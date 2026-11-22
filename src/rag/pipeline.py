"""Lớp điều phối RAGPipeline kết hợp các module nạp tài liệu, nhúng vector và sinh câu trả lời."""

from __future__ import annotations

from dataclasses import dataclass
import json
import re

from google import genai
from google.genai import types

from . import prompts
from .chunker import chunk_documents
from .config import Settings, load_settings
from .embeddings import LocalEmbedder
from .llm import GeminiLLM
from .loader import load_documents
from .vector_store import SearchResult, VectorStore


def get_allowed_roles_for_source(source: str) -> list[str]:
    """Phân quyền truy cập tài liệu dựa trên tên file nguồn."""
    s = source.lower()
    if "pccc" in s or "thoat-hiem" in s:
        return ["guest", "user", "admin_ops", "admin_model", "admin"]
    elif "nguoi-dung" in s or "user" in s:
        return ["user", "admin_ops", "admin_model", "admin"]
    elif "van-hanh" in s or "admin-ops" in s:
        return ["admin_ops", "admin"]
    elif "mo-hinh" in s or "admin-model" in s:
        return ["admin_model", "admin"]
    return ["guest", "user", "admin_ops", "admin_model", "admin"]


@dataclass
class RAGAnswer:
    """Kết quả phản hồi bao gồm nội dung câu trả lời, nguồn tham khảo và action tương tác giao diện."""

    answer: str
    sources: list[SearchResult]
    action: dict | None = None


class RAGPipeline:
    """Quản lý toàn bộ quy trình xử lý RAG bao gồm giai đoạn nạp dữ liệu (ingest) và hỏi đáp (query)."""

    def __init__(self, settings: Settings | None = None):
        self.settings = settings or load_settings()

        # Thiết lập cơ chế thử lại (retry) khi gặp sự cố tạm thời từ phía server
        http_options = types.HttpOptions(
            retry_options=types.HttpRetryOptions(
                attempts=4,
                initial_delay=1.0,
                max_delay=10.0,
                http_status_codes=[429, 500, 502, 503, 504],
            )
        )

        # Khởi tạo mô hình Gemini LLM
        client = genai.Client(
            api_key=self.settings.api_key, http_options=http_options
        )
        self.llm = GeminiLLM(client, self.settings.chat_model)

        # Khởi tạo mô hình nhúng vector cục bộ
        self.embedder = LocalEmbedder(self.settings.embed_model)

        self._store: VectorStore | None = None

    def ingest(self) -> int:
        """Đọc toàn bộ tài liệu thô, phân đoạn văn bản, tạo vector embedding và lưu kho chứa."""
        documents = load_documents(self.settings.raw_dir)
        if not documents:
            raise RuntimeError(
                f"Không tìm thấy tài liệu nào trong thư mục {self.settings.raw_dir}."
            )

        chunks = chunk_documents(
            documents, self.settings.chunk_size, self.settings.chunk_overlap
        )
        vectors = self.embedder.embed_documents([c.text for c in chunks])
        metadatas = [
            {
                "text": c.text,
                "source": c.source,
                "index": c.index,
                "allowed_roles": get_allowed_roles_for_source(c.source),
            }
            for c in chunks
        ]

        store = VectorStore.build(vectors, metadatas)
        store.save(self.settings.store_path)
        self._store = store
        if self.settings.store_path.exists():
            self._store_mtime = self.settings.store_path.stat().st_mtime
        return len(chunks)

    def answer(
        self,
        question: str,
        history: list[dict[str, str]] | None = None,
        role: str = "guest",
    ) -> RAGAnswer:
        """Thực hiện truy vấn câu hỏi (kèm lịch sử hội thoại và vai trò người dùng), tìm kiếm và sinh câu trả lời."""
        store = self._get_store()

        # Tạo chuỗi văn bản lịch sử hội thoại
        history_str = prompts.build_history_str(history)

        # Nếu có lịch sử và câu hỏi có dấu hiệu nối tiếp, dùng LLM viết lại thành Standalone Query
        standalone_question = question
        if history_str and self._is_followup_question(question):
            try:
                condense_prompt = prompts.CONDENSE_QUESTION_PROMPT.format(
                    chat_history=history_str.strip(), question=question
                )
                rewritten = self.llm.generate(condense_prompt).strip()
                if rewritten:
                    standalone_question = rewritten
            except Exception:
                standalone_question = question

        # Nhúng câu hỏi độc lập và tìm kiếm các đoạn tài liệu có điểm tương đồng cao nhất theo vai trò
        query_vector = self.embedder.embed_query(standalone_question)
        results = store.search(query_vector, self.settings.top_k, allowed_role=role)

        # Tổng hợp ngữ cảnh tài liệu + lịch sử hội thoại để tạo câu trả lời từ Gemini LLM
        context = prompts.build_context(results)
        prompt = prompts.RAG_PROMPT_TEMPLATE.format(
            history_section=history_str, context=context, question=question
        )
        system_prompt = prompts.get_system_prompt_for_role(role)
        answer_text = self.llm.generate(prompt, system=system_prompt)

        # Trích xuất khối ```flare-action ... ``` nếu có
        clean_answer = answer_text
        action_dict: dict | None = None
        action_match = re.search(r"```flare-action\s*(\{.*?\})\s*```", answer_text, re.DOTALL)
        if action_match:
            try:
                raw_json = action_match.group(1).strip()
                action_dict = json.loads(raw_json)
                # Tách khối action ra khỏi câu trả lời để hiển thị tự nhiên
                clean_answer = (
                    answer_text[: action_match.start()].rstrip()
                    + "\n"
                    + answer_text[action_match.end() :].lstrip()
                ).strip()
            except Exception:
                action_dict = None

        return RAGAnswer(answer=clean_answer, sources=results, action=action_dict)

    def _get_store(self) -> VectorStore:
        """Nạp dữ liệu từ đĩa lưu trữ, tự động nạp lại nếu phát hiện tài liệu mới hoặc file vector thay đổi."""
        self._check_and_auto_ingest_if_needed()

        store_path = self.settings.store_path
        if not store_path.exists():
            raise FileNotFoundError(f"Không tìm thấy file vector store tại {store_path}")

        mtime = store_path.stat().st_mtime
        if self._store is None or getattr(self, "_store_mtime", 0) != mtime:
            self._store = VectorStore.load(store_path)
            self._store_mtime = mtime
        return self._store

    def _check_and_auto_ingest_if_needed(self) -> None:
        """Tự động nạp lại vector store nếu phát hiện file mới/sửa trong data/raw."""
        raw_dir = self.settings.raw_dir
        store_path = self.settings.store_path
        if not raw_dir.exists():
            return

        allowed_exts = {".txt", ".md", ".markdown", ".pdf"}
        raw_files = [
            p for p in raw_dir.rglob("*")
            if p.is_file() and p.suffix.lower() in allowed_exts
        ]
        if not raw_files:
            return

        if not store_path.exists():
            self.ingest()
            return

        store_mtime = store_path.stat().st_mtime
        if any(p.stat().st_mtime > store_mtime for p in raw_files):
            self.ingest()

    def _is_followup_question(self, question: str) -> bool:
        """Kiểm tra xem câu hỏi có chứa từ khóa dấu hiệu của câu hỏi nối tiếp hay không."""
        q_lower = question.lower().strip()
        keywords = {
            "nó", "đó", "này", "trước", "vừa", "trên", "ấy", "họ", "chia",
            "câu", "gì", "ai", "bao nhiêu", "kết quả", "thế nào", "sao", "bạn"
        }
        words = set(q_lower.split())
        return len(words) <= 5 or bool(words & keywords)
