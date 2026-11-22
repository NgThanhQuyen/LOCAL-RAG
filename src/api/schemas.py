"""Pydantic schemas cho Web API."""

from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    """Một tin nhắn trong lịch sử cuộc trò chuyện."""

    role: str = Field(..., description="Vai trò: 'user' hoặc 'assistant'")
    content: str = Field(..., description="Nội dung tin nhắn")


class QueryRequest(BaseModel):
    """Payload gửi lên từ client khi hỏi đáp."""

    question: str = Field(..., min_length=1, description="Câu hỏi của người dùng")
    history: list[ChatMessage] = Field(
        default_factory=list, description="Lịch sử tin nhắn gần đây trong cuộc trò chuyện"
    )
    role: str = Field(
        default="guest",
        description="Vai trò người dùng: 'guest', 'user', 'admin_ops', 'admin_model'",
    )


class SourceItem(BaseModel):
    """Một nguồn tài liệu tham khảo được trích dẫn."""

    source: str
    text: str
    score: float


class ActionPayload(BaseModel):
    """Hành động tương tác giao diện (UI Action) gửi về client."""

    action: str = Field(..., description="Mã hành động, ví dụ: 'NAVIGATE', 'ADD_CAMERA', 'TOGGLE_WEBCAM'")
    label: str = Field(default="", description="Nhãn hiển thị trên nút bấm tương tác")
    params: dict = Field(default_factory=dict, description="Các tham số đi kèm hành động")


class QueryResponse(BaseModel):
    """Kết quả trả về cho câu hỏi RAG."""

    answer: str
    sources: list[SourceItem]
    action: ActionPayload | None = None


class DocumentItem(BaseModel):
    """Thông tin về một file tài liệu thô trong data/raw."""

    filename: str
    size_bytes: int
    file_type: str


class IngestResponse(BaseModel):
    """Kết quả phản hồi sau khi nạp tài liệu."""

    num_chunks: int
    message: str


class HealthResponse(BaseModel):
    """Trạng thái hệ thống RAG API."""

    status: str
    has_vector_store: bool
    chat_model: str
    embed_model: str
