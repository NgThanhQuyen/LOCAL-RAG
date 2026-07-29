"""Package kho lưu trữ và xử lý RAG (Retrieval-Augmented Generation).

Cung cấp lớp điều phối chính RAGPipeline để thực hiện các thao tác
nạp tài liệu, tìm kiếm vector và sinh câu trả lời.
"""

from .pipeline import RAGPipeline, RAGAnswer

__all__ = ["RAGPipeline", "RAGAnswer"]
__version__ = "0.1.0"
