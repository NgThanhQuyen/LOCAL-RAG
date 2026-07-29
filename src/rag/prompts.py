"""Quản lý các chuỗi câu lệnh chỉ dẫn (prompt templates) cho mô hình ngôn ngữ."""

from __future__ import annotations

from .vector_store import SearchResult

# Prompt hệ thống quy định vai trò và phạm vi trả lời của AI
SYSTEM_PROMPT = (
    "Bạn là trợ lý AI trả lời câu hỏi CHỈ dựa trên phần NGỮ CẢNH được cung cấp. "
    "Nếu ngữ cảnh không chứa đủ thông tin, hãy nói rõ là bạn không tìm thấy thông tin "
    "trong tài liệu, tuyệt đối không tự bịa đặt. Trả lời ngắn gọn, chính xác, bằng tiếng Việt. "
    "Khi có thể, hãy trích dẫn nguồn theo dạng [nguồn: tên_file]."
)

# Mẫu định dạng prompt kết hợp ngữ cảnh và câu hỏi
RAG_PROMPT_TEMPLATE = """NGỮ CẢNH:
{context}

CÂU HỎI: {question}

Hãy trả lời câu hỏi dựa trên NGỮ CẢNH ở trên."""


def build_context(results: list[SearchResult]) -> str:
    """Xây dựng chuỗi ngữ cảnh từ danh sách các đoạn tài liệu truy tìm được."""
    blocks = []
    for i, r in enumerate(results, start=1):
        blocks.append(f"[{i}] (nguồn: {r.source})\n{r.text}")
    return "\n\n".join(blocks)
