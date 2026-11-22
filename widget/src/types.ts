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

export interface FlareAction {
  action: string;
  label?: string;
  params?: Record<string, any>;
}

export interface QueryResponse {
  answer: string;
  sources: SourceItem[];
  action?: FlareAction | null;
}

export interface WidgetConfig {
  apiUrl?: string;
  mascotUrl?: string;
  avatarUrl?: string;
  role?: UserRole;
  userId?: string | null;
  title?: string;
  subtitle?: string;
  placeholder?: string;
  initialMessage?: string;
  primaryColor?: string;
  position?: "bottom-right" | "bottom-left";
  quickPrompts?: string[];
}
