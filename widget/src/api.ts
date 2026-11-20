import { ChatMessage, QueryResponse, UserRole } from "./types";

export async function sendChatMessage(
  apiUrl: string,
  question: string,
  history: ChatMessage[] = [],
  role: UserRole = "guest"
): Promise<QueryResponse> {
  const url = `${apiUrl.replace(/\/+$/, "")}/chat`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      question,
      history,
      role,
    }),
  });

  if (!response.ok) {
    let errorDetail = `Lỗi máy chủ (${response.status})`;
    try {
      const errorJson = await response.json();
      if (errorJson.detail) {
        errorDetail = errorJson.detail;
      }
    } catch {
      // ignore json parse error
    }
    throw new Error(errorDetail);
  }

  return response.json();
}
