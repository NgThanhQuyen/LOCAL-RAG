"""Module đọc và tải các tập tin tài liệu thô từ thư mục lưu trữ.

Hỗ trợ các định dạng tập tin văn bản thuần (.txt, .md) và tài liệu PDF.
"""

from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

# Các định dạng văn bản thuần
_TEXT_SUFFIXES = {".txt", ".md", ".markdown"}


@dataclass
class Document:
    """Đại diện cho một tài liệu được tải vào bộ nhớ."""

    source: str  # Đường dẫn file tương đối dùng để trích dẫn nguồn
    text: str    # Nội dung văn bản của tài liệu


def _read_pdf(path: Path) -> str:
    """Đọc nội dung văn bản từ tập tin PDF."""
    from pypdf import PdfReader

    reader = PdfReader(str(path))
    return "\n".join((page.extract_text() or "") for page in reader.pages)


def load_documents(raw_dir: Path) -> list[Document]:
    """Duyệt và nạp toàn bộ các tập tin tài liệu hợp lệ trong thư mục raw_dir."""
    documents: list[Document] = []
    if not raw_dir.exists():
        return documents

    for path in sorted(raw_dir.rglob("*")):
        if not path.is_file():
            continue

        suffix = path.suffix.lower()
        if suffix in _TEXT_SUFFIXES:
            text = path.read_text(encoding="utf-8")
        elif suffix == ".pdf":
            text = _read_pdf(path)
        else:
            continue

        text = text.strip()
        if text:
            documents.append(
                Document(source=str(path.relative_to(raw_dir)), text=text)
            )

    return documents
