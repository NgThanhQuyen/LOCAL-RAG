"""Module lưu trữ vector và truy vấn tìm kiếm độ tương đồng Cosine.

Thực hiện lưu trữ các vector embedding cùng thông tin metadata tương ứng,
cho phép tìm kiếm nhanh các đoạn văn bản có ngữ nghĩa tương đồng nhất.
"""

from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path

import numpy as np


@dataclass
class SearchResult:
    """Kết quả tìm kiếm văn bản theo ngữ nghĩa."""

    text: str
    source: str
    score: float


class VectorStore:
    """Lưu trữ ma trận vector và thực hiện tìm kiếm cosine similarity bằng NumPy."""

    def __init__(self, vectors: np.ndarray, metadatas: list[dict]):
        self._vectors = vectors
        self._metadatas = metadatas

    @staticmethod
    def _normalize(matrix: np.ndarray) -> np.ndarray:
        """Chuẩn hóa L2 cho ma trận vector."""
        norms = np.linalg.norm(matrix, axis=1, keepdims=True)
        norms[norms == 0] = 1e-12
        return matrix / norms

    @classmethod
    def build(cls, vectors: np.ndarray, metadatas: list[dict]) -> "VectorStore":
        """Khởi tạo kho chứa vector mới và thực hiện chuẩn hóa dữ liệu đầu vào."""
        return cls(cls._normalize(vectors.astype(np.float32)), metadatas)

    def search(self, query_vector: np.ndarray, top_k: int) -> list[SearchResult]:
        """Tìm kiếm top_k đoạn văn bản có độ tương đồng cosine cao nhất."""
        if not self._metadatas:
            return []

        q = query_vector.astype(np.float32)
        q = q / (np.linalg.norm(q) + 1e-12)

        # Tính toán điểm cosine similarity bằng tích vô hướng
        scores = self._vectors @ q
        top_idx = np.argsort(-scores)[:top_k]

        results: list[SearchResult] = []
        for i in top_idx:
            meta = self._metadatas[int(i)]
            results.append(
                SearchResult(
                    text=meta["text"],
                    source=meta["source"],
                    score=float(scores[i]),
                )
            )
        return results

    def save(self, path: Path) -> None:
        """Lưu tập tin vector (.npz) và metadata (.meta.json) xuống đĩa."""
        path.parent.mkdir(parents=True, exist_ok=True)
        np.savez(path, vectors=self._vectors)
        meta_path = path.with_suffix(".meta.json")
        meta_path.write_text(
            json.dumps(self._metadatas, ensure_ascii=False), encoding="utf-8"
        )

    @classmethod
    def load(cls, path: Path) -> "VectorStore":
        """Đọc và nạp lại dữ liệu kho chứa vector từ tập tin lưu trữ."""
        if not path.exists():
            raise FileNotFoundError(
                f"Không tìm thấy tập tin vector store tại {path}. "
                "Vui lòng thực hiện nạp dữ liệu (ingest) trước khi truy vấn."
            )
        data = np.load(path)
        meta_path = path.with_suffix(".meta.json")
        metadatas = json.loads(meta_path.read_text(encoding="utf-8"))
        return cls(data["vectors"], metadatas)
