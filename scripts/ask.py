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


def ask_once(pipeline: RAGPipeline, question: str, history: list[dict[str, str]] | None = None) -> str:
    """Thực hiện một truy vấn và hiển thị kết quả kèm các nguồn trích dẫn tương ứng."""
    result = pipeline.answer(question, history=history)

    print("\n[Trả lời]:")
    print(result.answer)

    print("\n[Nguồn tham khảo]:")
    for i, s in enumerate(result.sources, start=1):
        print(f"  [{i}] {s.source} (Độ tương đồng Cosine: {s.score:.3f})")
    
    return result.answer


def main() -> None:
    pipeline = RAGPipeline()

    # Nhận câu hỏi trực tiếp từ đối số dòng lệnh nếu có
    if len(sys.argv) > 1:
        ask_once(pipeline, " ".join(sys.argv[1:]))
        return

    # Chế độ tương tác liên tục trong terminal có trí nhớ ngữ cảnh
    print("--- CHẾ ĐỘ HỎI ĐÁP MULTI-TURN RAG (Gõ 'exit' hoặc 'quit' để thoát) ---")
    history: list[dict[str, str]] = []

    while True:
        try:
            question = input("\nCâu hỏi: ").strip()
        except (EOFError, KeyboardInterrupt):
            print()
            break

        if question.lower() in {"exit", "quit", "thoat", "q"}:
            break
        if question:
            answer_text = ask_once(pipeline, question, history=history)
            # Lưu câu hỏi và câu trả lời vào lịch sử hội thoại của CLI session
            history.append({"role": "user", "content": question})
            history.append({"role": "assistant", "content": answer_text})
            # Giữ tối đa 6 tin nhắn gần nhất
            history = history[-6:]


if __name__ == "__main__":
    main()
