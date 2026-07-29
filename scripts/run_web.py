"""Script khởi chạy Web Application cho hệ thống Local RAG."""

import sys
import webbrowser
from pathlib import Path

# Đảm bảo bảng mã đầu ra UTF-8 cho dòng lệnh Windows
try:
    sys.stdout.reconfigure(encoding="utf-8")
except (AttributeError, ValueError):
    pass

# Thêm thư mục src vào đường dẫn tìm kiếm module
PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT / "src"))

import uvicorn


def main() -> None:
    host = "127.0.0.1"
    port = 8000
    url = f"http://{host}:{port}"

    print(f"Đang khởi động ứng dụng Web Local RAG...")
    print(f"Địa chỉ dịch vụ Web UI: {url}")
    print("Nhấn Ctrl+C để dừng máy chủ.")

    # Tự động mở giao diện trên trình duyệt mặc định
    try:
        webbrowser.open(url)
    except Exception:
        pass

    # Khởi chạy Uvicorn Web Server
    uvicorn.run(
        "api.main:app",
        host=host,
        port=port,
        reload=False,
        log_level="info",
    )


if __name__ == "__main__":
    main()
