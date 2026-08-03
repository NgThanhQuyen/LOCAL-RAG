import logging
import os
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .routes import router

# Ẩn các cảnh báo hệ thống không cần thiết
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"
os.environ["TOKENIZERS_PARALLELISM"] = "false"


class EndpointFilter(logging.Filter):
    """Lọc bỏ log kiểm tra tự động (/api/health, /api/documents) để console sạch sẽ, chỉ hiện khi người dùng thao tác."""

    def filter(self, record: logging.LogRecord) -> bool:
        msg = record.getMessage()
        if "GET /api/health" in msg or "GET /api/documents" in msg:
            return False
        return True


# Áp dụng bộ lọc cho Uvicorn Access Logger
logging.getLogger("uvicorn.access").addFilter(EndpointFilter())

# Đường dẫn thư mục giao diện web tĩnh
BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"

app = FastAPI(
    title="ChatNTQ RAG Web App",
    description="Hệ thống Hỏi - Đáp RAG với FastAPI & Google Gemini",
    version="1.0.0",
)

# Cấu hình middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Đăng ký các tuyến đường API
app.include_router(router)

# Đăng ký phục vụ các tập tin giao diện web tĩnh
if STATIC_DIR.exists():
    app.mount("/", StaticFiles(directory=str(STATIC_DIR), html=True), name="static")
