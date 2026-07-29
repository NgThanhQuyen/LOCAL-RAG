"""Script dòng lệnh (CLI) thực hiện nạp dữ liệu tài liệu vào kho chứa vector."""

import sys
from pathlib import Path

# Đảm bảo bảng mã đầu ra UTF-8 cho dòng lệnh Windows
try:
    sys.stdout.reconfigure(encoding="utf-8")
except (AttributeError, ValueError):
    pass

# Thêm thư mục src vào đường dẫn tìm kiếm module
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from rag.pipeline import RAGPipeline  # noqa: E402


def main() -> None:
    pipeline = RAGPipeline()
    print(f"Đang tiến hành nạp tài liệu từ thư mục: {pipeline.settings.raw_dir}")

    num_chunks = pipeline.ingest()

    print(f"Đã hoàn thành phân đoạn và nạp thành công {num_chunks} chunk.")
    print(f"Tập tin vector store đã được lưu tại: {pipeline.settings.store_path}")
    print('Bạn có thể chạy thử nghiệm câu hỏi bằng lệnh: python scripts/ask.py "Nội dung câu hỏi"')


if __name__ == "__main__":
    main()
