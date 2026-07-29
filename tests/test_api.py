"""Bộ kiểm thử cho các API endpoints trong package src/api/routes.py."""

import sys
from pathlib import Path
from fastapi.testclient import TestClient

# Thêm thư mục src vào đường dẫn tìm kiếm module
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from api.main import app

client = TestClient(app)


def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "has_vector_store" in data
    assert "chat_model" in data


def test_list_documents_endpoint():
    response = client.get("/api/documents")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_chat_invalid_request():
    response = client.post("/api/chat", json={"question": ""})
    # Kiểm tra phản hồi lỗi xác thực dữ liệu đầu vào (HTTP 422)
    assert response.status_code == 422
