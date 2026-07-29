"""Module chuyển đổi văn bản thành biểu diễn vector (embedding).

Sử dụng thư viện sentence-transformers để tạo vector biểu diễn ngữ nghĩa
cho đoạn văn bản và truy vấn tìm kiếm.
"""

from __future__ import annotations

import numpy as np
from sentence_transformers import SentenceTransformer


class LocalEmbedder:
    """Quản lý mô hình nhúng văn bản cục bộ bằng sentence-transformers."""

    def __init__(self, model_name: str):
        # Khởi tạo mô hình sentence-transformers
        self._model = SentenceTransformer(model_name)
        # Các mô hình dòng E5 yêu cầu tiền tố passage/query
        self._is_e5 = "e5" in model_name.lower()

    def _encode(self, texts: list[str]) -> np.ndarray:
        vectors = self._model.encode(
            texts,
            convert_to_numpy=True,
            normalize_embeddings=True,  # Chuẩn hóa vector về độ dài 1
        )
        return vectors.astype(np.float32)

    def embed_documents(self, texts: list[str]) -> np.ndarray:
        """Tạo vector embedding cho danh sách các đoạn văn bản tài liệu."""
        if not texts:
            return np.zeros((0, 0), dtype=np.float32)
        prepared = [f"passage: {t}" for t in texts] if self._is_e5 else texts
        return self._encode(prepared)

    def embed_query(self, text: str) -> np.ndarray:
        """Tạo vector embedding cho một câu truy vấn tìm kiếm."""
        prepared = f"query: {text}" if self._is_e5 else text
        return self._encode([prepared])[0]
