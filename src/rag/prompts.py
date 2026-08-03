"""Quản lý các chuỗi câu lệnh chỉ dẫn (prompt templates) cho mô hình ngôn ngữ."""

from __future__ import annotations

from .vector_store import SearchResult

# Prompt hệ thống quy định vai trò và phạm vi trả lời của AI
SYSTEM_PROMPT = (
    "Bạn là trợ lý AI thông minh trả lời câu hỏi dựa trên NGỮ CẢNH TÀI LIỆU và LỊCH SỬ TRÒ CHUYỆN được cung cấp. "
    "Nếu người dùng yêu cầu liệt kê thông tin hoặc bảng biểu, bạn phải liệt kê ĐẦY ĐỦ VÀ TRỌN VẸN TẤT CẢ các dòng, các cột và chi tiết (như Mã KH, Tên, Thành phố, số liệu...) xuất hiện trong ngữ cảnh, tuyệt đối không được tự ý bỏ bớt hay cắt ngắn. "
    "Nếu ngữ cảnh không chứa đủ thông tin để trả lời, hãy nói rõ là bạn không tìm thấy thông tin trong tài liệu. "
    "Khi có thể, hãy trích dẫn nguồn theo dạng [nguồn: tên_file]."
)

# Prompt viết lại câu hỏi nối tiếp thành câu hỏi độc lập (Query Rewriting)
CONDENSE_QUESTION_PROMPT = """Dựa trên LỊCH SỬ TRÒ CHUYỆN dưới đây và CÂU HỎI MỚI của người dùng.
Nhiệm vụ của bạn là viết lại CÂU HỎI MỚI thành một CÂU HỎI ĐỘC LẬP (Standalone Question) chứa đầy đủ ngữ cảnh và các thực thể được nhắc tới (như số liệu, tên tài liệu, phép tính, đại từ "nó", "cái đó", "câu hỏi trước"...).
LƯU Ý: CHỈ trả về duy nhất 1 câu hỏi độc lập được viết lại bằng tiếng Việt. KHÔNG giải thích hay trả lời câu hỏi.

LỊCH SỬ TRÒ CHUYỆN:
{chat_history}

CÂU HỎI MỚI: {question}

CÂU HỎI ĐỘC LẬP ĐƯỢC VIẾT LẠI:"""

RAG_PROMPT_TEMPLATE = """{history_section}NGỮ CẢNH TÀI LIỆU TRÍCH XUẤT:
{context}

CÂU HỎI MỚI NHẤT: {question}

Hãy trả lời câu hỏi dựa trên NGỮ CẢNH TÀI LIỆU và LỊCH SỬ TRÒ CHUYỆN ở trên. Trình bày đầy đủ, chi tiết tất cả các thông tin/dữ liệu có trong ngữ cảnh."""


def build_context(results: list[SearchResult]) -> str:
    """Xây dựng chuỗi ngữ cảnh từ danh sách các đoạn tài liệu truy tìm được."""
    blocks = []
    for i, r in enumerate(results, start=1):
        blocks.append(f"[{i}] (nguồn: {r.source})\n{r.text}")
    return "\n\n".join(blocks)


def build_history_str(history: list[dict[str, str]] | None) -> str:
    """Chuyển mảng lịch sử tin nhắn thành chuỗi văn bản định dạng."""
    if not history:
        return ""

    lines = []
    for msg in history:
        role = "Người dùng" if msg.get("role") == "user" else "Trợ lý AI"
        content = msg.get("content", "").strip()
        if content:
            lines.append(f"- {role}: {content}")
    
    if not lines:
        return ""
    
    return "LỊCH SỬ TRÒ CHUYỆN GẦN ĐÂY:\n" + "\n".join(lines) + "\n\n"
