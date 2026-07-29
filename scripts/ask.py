"""Script dòng lệnh (CLI) thực hiện truy vấn và hỏi đáp với hệ thống RAG."""

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


def ask_once(pipeline: RAGPipeline, question: str) -> None:
    """Thực hiện một truy vấn và hiển thị kết quả kèm các nguồn trích dẫn tương ứng."""
    result = pipeline.answer(question)

    print("\n[Trả lời]:")
    print(result.answer)

    print("\n[Nguồn tham khảo]:")
    for i, s in enumerate(result.sources, start=1):
        print(f"  [{i}] {s.source} (Độ tương đồng Cosine: {s.score:.3f})")


def main() -> None:
    pipeline = RAGPipeline()

    # Nhận câu hỏi trực tiếp từ đối số dòng lệnh nếu có
    if len(sys.argv) > 1:
        ask_once(pipeline, " ".join(sys.argv[1:]))
        return

    # Chế độ tương tác liên tục trong terminal
    print("--- CHẾ ĐỘ HỎI ĐÁP RAG (Gõ 'exit' hoặc 'quit' để thoát) ---")
    while True:
        try:
            question = input("\nCâu hỏi: ").strip()
        except (EOFError, KeyboardInterrupt):
            print()
            break

        if question.lower() in {"exit", "quit", "thoat", "q"}:
            break
        if question:
            ask_once(pipeline, question)


if __name__ == "__main__":
    main()
