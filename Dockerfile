# Sử dụng Python 3.11 phiên bản slim để tối ưu dung lượng Container Image
FROM python:3.11-slim

# Thiết lập các biến môi trường hệ thống
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONPATH=/app/src \
    HF_HUB_DISABLE_SYMLINKS_WARNING=1 \
    TOKENIZERS_PARALLELISM=false

# Thiết lập thư mục làm việc trong Container
WORKDIR /app

# Cài đặt các gói phụ thuộc hệ thống cần thiết cho build & healthcheck
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy tập tin định nghĩa thư viện phụ thuộc
COPY requirements.txt pyproject.toml ./

# Cài đặt các thư viện Python
RUN pip install --no-cache-dir -r requirements.txt

# Tự động nạp sẵn trọng số mô hình intfloat/multilingual-e5-base vào Cache để khởi động ứng dụng cực nhanh
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('intfloat/multilingual-e5-base')"

# Copy mã nguồn dự án vào Container
COPY src/ ./src/
COPY scripts/ ./scripts/
COPY data/ ./data/

# Cấu hình Cổng kết nối Web Server FastAPI
EXPOSE 8001

# Khởi chạy dịch vụ Web UI
CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8001"]
