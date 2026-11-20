export type UserRole = "guest" | "user" | "admin_ops" | "admin_model" | "admin";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface SourceItem {
  source: string;
  text: string;
  score: number;
}

export interface QueryResponse {
  answer: string;
  sources: SourceItem[];
}

export interface WidgetConfig {
  apiUrl?: string;
  role?: UserRole;
  title?: string;
  subtitle?: string;
  placeholder?: string;
  initialMessage?: string;
  primaryColor?: string;
  position?: "bottom-right" | "bottom-left";
  quickPrompts?: string[];
}
