"""Định nghĩa các REST API Endpoints cho hệ thống Local RAG."""

from pathlib import Path
from fastapi import APIRouter, HTTPException, UploadFile, File, Depends, status

from rag.pipeline import RAGPipeline
from .schemas import (
    QueryRequest,
    QueryResponse,
    SourceItem,
    DocumentItem,
    IngestResponse,
    HealthResponse,
)

router = APIRouter(prefix="/api", tags=["RAG API"])

# Định dạng file được phép upload
ALLOWED_EXTENSIONS = {".txt", ".md", ".markdown", ".pdf"}


def get_pipeline() -> RAGPipeline:
    """Dependency cung cấp đối tượng RAGPipeline duy nhất (Singleton)."""
    if not hasattr(get_pipeline, "_instance"):
        get_pipeline._instance = RAGPipeline()
    return get_pipeline._instance


@router.get("/health", response_model=HealthResponse)
def health_check(pipeline: RAGPipeline = Depends(get_pipeline)):
    """Kiểm tra trạng thái hoạt động của hệ thống và Vector Store."""
    has_store = pipeline.settings.store_path.exists()
    return HealthResponse(
        status="ok",
        has_vector_store=has_store,
        chat_model=pipeline.settings.chat_model,
        embed_model=pipeline.settings.embed_model,
    )


@router.post("/chat", response_model=QueryResponse)
def chat_query(
    request: QueryRequest, pipeline: RAGPipeline = Depends(get_pipeline)
):
    """Gửi câu hỏi tới RAG Pipeline và nhận câu trả lời kèm nguồn trích dẫn."""
    try:
        history_dicts = [msg.model_dump() for msg in request.history]
        res = pipeline.answer(request.question, history=history_dicts)
        sources = [
            SourceItem(source=s.source, text=s.text, score=s.score)
            for s in res.sources
        ]
        return QueryResponse(answer=res.answer, sources=sources)
    except FileNotFoundError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Chưa có Vector Store. Hãy nạp tài liệu trước khi đặt câu hỏi.",
        ) from e
    except Exception as e:
        err_str = str(e)
        if "429" in err_str or "RESOURCE_EXHAUSTED" in err_str:
            err_msg = "Hệ thống đang chạm giới hạn tần suất gọi API miễn phí của Google Gemini (tối đa 15 câu/phút). Vui lòng chờ khoảng 30 - 60 giây rồi thử lại!"
        else:
            err_msg = f"Lỗi khi xử lý câu hỏi: {err_str}"
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=err_msg,
        ) from e


@router.get("/documents", response_model=list[DocumentItem])
def list_documents(pipeline: RAGPipeline = Depends(get_pipeline)):
    """Lấy danh sách các tài liệu thô trong data/raw."""
    raw_dir = pipeline.settings.raw_dir
    if not raw_dir.exists():
        return []

    docs = []
    for path in sorted(raw_dir.rglob("*")):
        if path.is_file() and path.suffix.lower() in ALLOWED_EXTENSIONS:
            rel_path = path.relative_to(raw_dir)
            docs.append(
                DocumentItem(
                    filename=str(rel_path),
                    size_bytes=path.stat().st_size,
                    file_type=path.suffix.lower(),
                )
            )
    return docs


@router.post("/upload", response_model=IngestResponse)
async def upload_document(
    file: UploadFile = File(...), pipeline: RAGPipeline = Depends(get_pipeline)
):
    """Tải file tài liệu mới (.txt, .md, .pdf) lên data/raw và tự động nạp lại Vector Store."""
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Định dạng file '{file_ext}' không được hỗ trợ. Chỉ chấp nhận: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    raw_dir = pipeline.settings.raw_dir
    raw_dir.mkdir(parents=True, exist_ok=True)

    dest_path = raw_dir / file.filename
    content = await file.read()
    dest_path.write_bytes(content)

    # Tự động nạp lại vector store
    try:
        num_chunks = pipeline.ingest()
        return IngestResponse(
            num_chunks=num_chunks,
            message=f"Đã tải lên '{file.filename}' và nạp lại thành công {num_chunks} chunk.",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Đã lưu file nhưng lỗi khi nạp vector: {str(e)}",
        ) from e


@router.delete("/documents/{filename:path}")
def delete_document(
    filename: str, pipeline: RAGPipeline = Depends(get_pipeline)
):
    """Xóa file tài liệu khỏi data/raw và cập nhật lại Vector Store."""
    raw_dir = pipeline.settings.raw_dir
    file_path = (raw_dir / filename).resolve()

    # Bảo vệ chống Directory Traversal Attack
    if not str(file_path).startswith(str(raw_dir.resolve())):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Tên file không hợp lệ.",
        )

    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy file '{filename}'.",
        )

    file_path.unlink()

    # Re-ingest nếu còn file
    remaining_docs = [
        p for p in raw_dir.rglob("*") if p.is_file() and p.suffix.lower() in ALLOWED_EXTENSIONS
    ]
    if remaining_docs:
        num_chunks = pipeline.ingest()
        return {"message": f"Đã xóa '{filename}' và cập nhật vector store ({num_chunks} chunk)."}
    else:
        # Nếu xóa hết file, xóa luôn vector store
        if pipeline.settings.store_path.exists():
            pipeline.settings.store_path.unlink()
        meta_path = pipeline.settings.store_path.with_suffix(".meta.json")
        if meta_path.exists():
            meta_path.unlink()
        pipeline._store = None
        return {"message": f"Đã xóa '{filename}'. Đã dọn dẹp vector store do không còn tài liệu."}


@router.post("/ingest", response_model=IngestResponse)
def trigger_ingest(pipeline: RAGPipeline = Depends(get_pipeline)):
    """Kích hoạt nạp dữ liệu (Ingestion) thủ công."""
    try:
        num_chunks = pipeline.ingest()
        return IngestResponse(
            num_chunks=num_chunks,
            message=f"Đã nạp lại dữ liệu thành công! Tổng cộng {num_chunks} chunk.",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        ) from e
