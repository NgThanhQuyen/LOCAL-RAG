import logging
import os
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
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

# Cấu hình middleware CORS linh hoạt
# Hỗ trợ tùy biến qua biến môi trường CORS_ORIGINS (mặc định cho phép mọi origin khi phát triển cục bộ)
cors_origins_raw = os.environ.get("CORS_ORIGINS", "*").strip()
if cors_origins_raw == "*" or not cors_origins_raw:
    origins = ["*"]
    allow_creds = False  # Tránh lỗi xung đột bảo mật khi allow_origins=["*"] theo chuẩn RFC CORS
else:
    origins = [o.strip() for o in cors_origins_raw.split(",") if o.strip()]
    allow_creds = True

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=allow_creds,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Đăng ký các tuyến đường API
app.include_router(router)


@app.get("/widget.js", include_in_schema=False)
def get_widget_script():
    """Phục vụ trực tiếp file nhúng widget độc lập cho các ứng dụng web bên ngoài."""
    widget_path = STATIC_DIR / "widget.js"
    if not widget_path.exists():
        raise HTTPException(
            status_code=404,
            detail="File widget.js chưa được tạo. Hãy chạy lệnh 'npm run build:widget' trong thư mục widget trước.",
        )
    return FileResponse(
        widget_path,
        media_type="application/javascript",
        headers={"Cache-Control": "no-cache, must-revalidate"},
    )


# Đăng ký phục vụ các tập tin giao diện web tĩnh
if STATIC_DIR.exists():
    app.mount("/", StaticFiles(directory=str(STATIC_DIR), html=True), name="static")
