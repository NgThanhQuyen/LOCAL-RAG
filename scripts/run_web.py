"""Script khởi chạy Web Application cho hệ thống Local RAG."""

import sys
import threading
import time
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


def open_browser_later(url: str, delay: float = 2.0) -> None:
    """Mở trình duyệt sau khi máy chủ Uvicorn đã hoàn tất khởi tạo."""
    time.sleep(delay)
    try:
        webbrowser.open(url)
    except Exception:
        pass


def main() -> None:
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    url = f"http://127.0.0.1:{port}"

    print(f"Đang nạp các thư viện AI & Mô hình Vector Embedding (mất khoảng 3-5 giây)...")
    print(f"Địa chỉ giao diện Web UI: {url}")
    print("Nhấn Ctrl+C để dừng máy chủ.\n")

    # Mở trình duyệt trong luồng phụ sau khi khởi động
    threading.Thread(target=open_browser_later, args=(url, 2.5), daemon=True).start()

    try:
        # Khởi chạy Uvicorn Web Server
        uvicorn.run(
            "api.main:app",
            host=host,
            port=port,
            reload=False,
            log_level="info",
        )
    except KeyboardInterrupt:
        print("\nĐã dừng máy chủ Web RAG thành công.")


if __name__ == "__main__":
    main()
