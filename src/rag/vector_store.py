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

    def search(
        self, query_vector: np.ndarray, top_k: int, allowed_role: str | None = None
    ) -> list[SearchResult]:
        """Tìm kiếm top_k đoạn văn bản có độ tương đồng cosine cao nhất, hỗ trợ lọc theo quyền vai trò."""
        if not self._metadatas:
            return []

        # Chuẩn hóa vai trò người dùng (ví dụ: 'admin' tương đương 'admin_ops')
        user_role = (allowed_role or "guest").lower().strip()
        if user_role == "admin":
            user_role = "admin_ops"

        # Lọc danh sách chỉ mục chunk mà vai trò này được phép truy cập
        valid_indices = []
        for i, meta in enumerate(self._metadatas):
            roles = meta.get("allowed_roles")
            if roles is None or user_role in roles or "all" in roles:
                valid_indices.append(i)

        if not valid_indices:
            return []

        q = query_vector.astype(np.float32)
        q = q / (np.linalg.norm(q) + 1e-12)

        # Tính toán điểm cosine similarity
        all_scores = self._vectors @ q
        valid_scores = all_scores[valid_indices]

        # Lấy top_k trong các chunk được phép
        top_local_idx = np.argsort(-valid_scores)[:top_k]

        results: list[SearchResult] = []
        for local_i in top_local_idx:
            orig_i = valid_indices[int(local_i)]
            meta = self._metadatas[orig_i]
            results.append(
                SearchResult(
                    text=meta["text"],
                    source=meta["source"],
                    score=float(all_scores[orig_i]),
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
