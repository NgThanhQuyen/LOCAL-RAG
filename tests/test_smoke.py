"""Kiểm thử nhanh (smoke tests) cho các thành phần xử lý offline của hệ thống RAG."""

import sys
from pathlib import Path

import numpy as np

# Thêm thư mục src vào đường dẫn tìm kiếm module
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from rag.chunker import chunk_text  # noqa: E402
from rag.vector_store import VectorStore  # noqa: E402


def test_chunk_text_respects_size_and_overlap():
    text = "a" * 1000
    chunks = chunk_text(text, chunk_size=300, overlap=50)

    assert len(chunks) > 1
    assert all(len(c) <= 300 for c in chunks)
    # Kiểm tra tính chính xác của phần chồng lấn giữa các đoạn
    assert chunks[1][:50] == chunks[0][-50:]


def test_chunk_text_empty_returns_empty():
    assert chunk_text("   ", chunk_size=100, overlap=10) == []


def test_vector_store_search_ranks_by_similarity():
    # Giả lập 3 vector để kiểm tra thứ tự tìm kiếm cosine similarity
    vectors = np.array([[1, 0, 0], [0, 1, 0], [0.9, 0.1, 0]], dtype=np.float32)
    metas = [{"text": f"doc{i}", "source": "t", "index": i} for i in range(3)]
    store = VectorStore.build(vectors, metas)

    results = store.search(np.array([1, 0, 0], dtype=np.float32), top_k=2)

    assert len(results) == 2
    assert results[0].text == "doc0"
    assert results[0].score >= results[1].score
