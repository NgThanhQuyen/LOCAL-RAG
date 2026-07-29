"""Module tương tác với mô hình ngôn ngữ lớn (LLM) Google Gemini.

Đóng gói phương thức gọi sinh văn bản từ Google GenAI SDK.
"""

from __future__ import annotations

from google import genai
from google.genai import types


class GeminiLLM:
    """Giao diện đóng gói các cuộc gọi sinh phản hồi từ mô hình Gemini."""

    def __init__(self, client: genai.Client, model: str):
        self._client = client
        self._model = model

    def generate(self, prompt: str, system: str | None = None) -> str:
        """Sinh câu trả lời từ prompt văn bản đầu vào và chỉ thị hệ thống (system prompt)."""
        config = None
        if system:
            config = types.GenerateContentConfig(system_instruction=system)

        response = self._client.models.generate_content(
            model=self._model,
            contents=prompt,
            config=config,
        )
        return (response.text or "").strip()
