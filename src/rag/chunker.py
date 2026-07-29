"""Module chia nhỏ văn bản (chunking) thành các đoạn có độ dài cố định kèm phần chồng lấn.

Phân tách các tài liệu dài thành các phân đoạn nhỏ giúp tối ưu quá trình
tạo embedding và tìm kiếm thông tin theo ngữ cảnh.
"""

from __future__ import annotations

from dataclasses import dataclass

from .loader import Document


@dataclass
class Chunk:
    """Đại diện cho một đoạn văn bản sau khi chia nhỏ."""

    source: str  # Tên file tài liệu gốc
    index: int   # Thứ tự của đoạn trong tập tin
    text: str    # Nội dung của đoạn văn bản


def chunk_text(text: str, chunk_size: int, overlap: int) -> list[str]:
    """Chia chuỗi văn bản thành các phân đoạn theo độ dài quy định và độ chồng lấn."""
    text = text.strip()
    if not text:
        return []
    if overlap >= chunk_size:
        raise ValueError("Độ chồng lấn (overlap) phải nhỏ hơn kích thước đoạn (chunk_size).")

    chunks: list[str] = []
    start = 0
    length = len(text)

    while start < length:
        end = min(start + chunk_size, length)
        chunks.append(text[start:end])
        if end == length:
            break
        start = end - overlap

    return chunks


def chunk_documents(
    documents: list[Document], chunk_size: int, overlap: int
) -> list[Chunk]:
    """Chia nhỏ danh sách tài liệu thành danh sách các đoạn Chunk."""
    all_chunks: list[Chunk] = []
    for doc in documents:
        for i, piece in enumerate(chunk_text(doc.text, chunk_size, overlap)):
            all_chunks.append(Chunk(source=doc.source, index=i, text=piece))
    return all_chunks
