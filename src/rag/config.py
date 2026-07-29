"""Cấu hình trung tâm cho hệ thống RAG.

Đọc các thông số thiết lập từ file môi trường .env và đóng gói
thành đối tượng Settings bất biến (dataclass frozen).
"""

from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv

# Thư mục gốc dự án
PROJECT_ROOT = Path(__file__).resolve().parents[2]

# Nạp biến môi trường từ file .env
load_dotenv(PROJECT_ROOT / ".env")


@dataclass(frozen=True)
class Settings:
    """Chứa toàn bộ cấu hình cần thiết cho ứng dụng."""

    # Cấu hình Gemini API
    api_key: str
    chat_model: str

    # Cấu hình mô hình embedding cục bộ
    embed_model: str

    # Đường dẫn lưu trữ dữ liệu
    raw_dir: Path
    store_path: Path

    # Tham số xử lý RAG
    chunk_size: int
    chunk_overlap: int
    top_k: int


def load_settings() -> Settings:
    """Đọc môi trường và trả về đối tượng cấu hình Settings."""
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key:
        raise RuntimeError(
            "Chưa cấu hình GEMINI_API_KEY. Vui lòng kiểm tra lại file .env."
        )

    data_dir = PROJECT_ROOT / "data"
    return Settings(
        api_key=api_key,
        chat_model=os.getenv("GEMINI_CHAT_MODEL", "gemini-flash-latest"),
        embed_model=os.getenv("EMBED_MODEL", "intfloat/multilingual-e5-base"),
        raw_dir=data_dir / "raw",
        store_path=data_dir / "processed" / "vector_store.npz",
        chunk_size=int(os.getenv("RAG_CHUNK_SIZE", "800")),
        chunk_overlap=int(os.getenv("RAG_CHUNK_OVERLAP", "120")),
        top_k=int(os.getenv("RAG_TOP_K", "4")),
    )
