"""Pydantic schemas cho Web API."""

from pydantic import BaseModel, Field


class QueryRequest(BaseModel):
    """Payload gửi lên từ client khi hỏi đáp."""

    question: str = Field(..., min_length=1, description="Câu hỏi của người dùng")


class SourceItem(BaseModel):
    """Một nguồn tài liệu tham khảo được trích dẫn."""

    source: str
    text: str
    score: float


class QueryResponse(BaseModel):
    """Kết quả trả về cho câu hỏi RAG."""

    answer: str
    sources: list[SourceItem]


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
