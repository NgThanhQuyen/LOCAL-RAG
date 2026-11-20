import { WIDGET_STYLES } from "./styles";
import { ChatMessage, SourceItem, WidgetConfig, UserRole } from "./types";
import { sendChatMessage } from "./api";

declare global {
  interface Window {
    FlareChatWidget?: FlareChatWidgetController;
    FlareChatWidgetConfig?: WidgetConfig;
  }
}

// SVG Biểu tượng Ngọn lửa (Flame Icon)
const FLAME_SVG = `
<svg class="icon-flame" viewBox="0 0 24 24" fill="currentColor">
  <path d="M12 23c-4.97 0-9-3.96-9-8.83 0-3.9 2.53-7.58 4.67-9.84.41-.44 1.12-.34 1.39.2 1.09 2.18 2.52 3.82 3.94 4.54.42.21.92-.08.95-.55.15-2.26 1.4-5.4 3.95-7.46.46-.37 1.15-.05 1.17.54.12 3.52 1.39 6.27 3.01 7.82 1.25 1.19 1.92 2.62 1.92 4.58 0 4.87-4.03 8.83-9 8.83z"/>
</svg>
`;

// Cấu hình nhãn phụ và câu hỏi nhanh theo từng vai trò người dùng
const ROLE_CONFIGS: Record<
  string,
  {
    subtitle: string;
    greeting: string;
    quickPrompts: string[];
  }
> = {
  guest: {
    subtitle: "Khách vãng lai",
    greeting: "Bạn cần mình hỗ trợ gì về kỹ năng an toàn PCCC & thoát hiểm ạ? 😊",
    quickPrompts: [
      "🚨 Kỹ năng thoát hiểm khi có khói độc",
      "🧯 Cách sử dụng bình chữa cháy CO2 và bột",
      "📞 Khi phát hiện cháy cần gọi số nào?",
      "ℹ️ Giới thiệu hệ thống cảnh báo cháy FLARE",
    ],
  },
  user: {
    subtitle: "Người dùng hệ thống",
    greeting: "Chào bạn! Bạn cần hỗ trợ gì về sử dụng FLARE hoặc an toàn PCCC? 😊",
    quickPrompts: [
      "📱 Hướng dẫn kết nối Bot Zalo nhận cảnh báo",
      "📹 Cách bật webcam laptop phát hiện cháy",
      "❓ Cách gửi phản hồi khi hệ thống nhận diện sai",
      "🚨 Kỹ năng thoát hiểm khi có khói",
    ],
  },
  admin_ops: {
    subtitle: "Quản trị Vận hành",
    greeting: "Chào Quản trị viên Vận hành! Bạn cần hỗ trợ gì về tác vụ hệ thống? ⚡",
    quickPrompts: [
      "📊 Cách giám sát phiên cảnh báo realtime hệ thống",
      "👥 Quy trình quản lý và duyệt tài khoản người dùng",
      "📋 Cách xem báo cáo đánh giá sự cố hỏa hoạn",
      "⚙️ Hướng dẫn lệnh CLI tạo tài khoản quản trị",
    ],
  },
  admin: {
    subtitle: "Quản trị Vận hành",
    greeting: "Chào Quản trị viên Vận hành! Bạn cần hỗ trợ gì về tác vụ hệ thống? ⚡",
    quickPrompts: [
      "📊 Cách giám sát phiên cảnh báo realtime hệ thống",
      "👥 Quy trình quản lý và duyệt tài khoản người dùng",
      "📋 Cách xem báo cáo đánh giá sự cố hỏa hoạn",
      "⚙️ Hướng dẫn lệnh CLI tạo tài khoản quản trị",
    ],
  },
  admin_model: {
    subtitle: "Quản trị Mô hình AI",
    greeting: "Chào Quản trị viên Mô hình! Bạn cần hỗ trợ gì về MLOps & Dataset? 🎯",
    quickPrompts: [
      "🏷️ Hướng dẫn dùng canvas SVG vẽ lại bounding box",
      "🔄 Chu trình Active Learning bổ sung dữ liệu",
      "📦 Cách xuất dataset chuẩn định dạng YOLO",
      "🧪 Quy trình kiểm định và đối soát mô hình mới",
    ],
  },
};

function parseSimpleMarkdown(text: string): string {
  if (!text) return "";

  let cleanText = text.replace(/\[nguồn:\s*[^\]]+\]/gi, "");

  let html = cleanText
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  const lines = html.split("\n");
  const parsedLines: string[] = [];
  let inUl = false;
  let inOl = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (inOl) {
        parsedLines.push("</ol>");
        inOl = false;
      }
      if (!inUl) {
        parsedLines.push("<ul>");
        inUl = true;
      }
      parsedLines.push(`<li>${trimmed.substring(2)}</li>`);
      continue;
    }

    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      if (inUl) {
        parsedLines.push("</ul>");
        inUl = false;
      }
      if (!inOl) {
        parsedLines.push("<ol>");
        inOl = true;
      }
      parsedLines.push(`<li>${numMatch[2]}</li>`);
      continue;
    }

    if (inUl) {
      parsedLines.push("</ul>");
      inUl = false;
    }
    if (inOl) {
      parsedLines.push("</ol>");
      inOl = false;
    }

    if (trimmed.length > 0) {
      parsedLines.push(`<p>${line}</p>`);
    }
  }

  if (inUl) parsedLines.push("</ul>");
  if (inOl) parsedLines.push("</ol>");

  return parsedLines.join("");
}

function detectApiUrl(): string {
  if (window.FlareChatWidgetConfig?.apiUrl) {
    return window.FlareChatWidgetConfig.apiUrl;
  }

  const scripts = document.querySelectorAll("script");
  for (let i = 0; i < scripts.length; i++) {
    const src = scripts[i].src || "";
    if (src.includes("widget.js")) {
      try {
        const u = new URL(src);
        return `${u.origin}/api`;
      } catch {
        // ignore
      }
    }
  }

  return "http://localhost:8001/api";
}

let widgetInstance: FlareChatWidgetController | null = null;

class FlareChatWidgetController {
  private config: WidgetConfig;
  private container: HTMLElement | null = null;
  private shadow: ShadowRoot | null = null;
  private isOpen = false;
  private isFullscreen = false;
  private isLoading = false;
  private currentRole: UserRole = "guest";
  private currentUserId: string | null = null;
  private history: ChatMessage[] = [];
  private messagesContainer: HTMLElement | null = null;
  private inputElem: HTMLTextAreaElement | null = null;
  private sendBtn: HTMLButtonElement | null = null;
  private fabBtn: HTMLButtonElement | null = null;
  private fabBadge: HTMLElement | null = null;
  private windowElem: HTMLElement | null = null;
  private expandBtn: HTMLButtonElement | null = null;
  private subtitleElem: HTMLElement | null = null;

  constructor(customConfig?: WidgetConfig) {
    const detectedRole = window.FlareChatWidgetConfig?.role || customConfig?.role || "guest";
    this.currentRole = this.normalizeRole(detectedRole);
    this.currentUserId = (window.FlareChatWidgetConfig as any)?.userId || (customConfig as any)?.userId || null;
    if (this.currentRole === "guest") this.currentUserId = null;

    const roleInfo = ROLE_CONFIGS[this.currentRole] || ROLE_CONFIGS.guest;

    this.config = {
      apiUrl: detectApiUrl(),
      title: "Flare AI",
      subtitle: roleInfo.subtitle,
      placeholder: "Hỏi Flare AI...",
      quickPrompts: roleInfo.quickPrompts,
      ...window.FlareChatWidgetConfig,
      ...customConfig,
    };

    this.mount();
    widgetInstance = this;
  }

  private normalizeRole(role: string): UserRole {
    const r = (role || "").toLowerCase().trim();
    if (r === "admin" || r === "admin_ops") return "admin_ops";
    if (r === "admin_model") return "admin_model";
    if (r === "user") return "user";
    return "guest";
  }

  private getStorageKey(): string | null {
    if (!this.currentUserId || this.currentRole === "guest") return null;
    return `flare_chat_history_${this.currentUserId}`;
  }

  private saveHistory() {
    const key = this.getStorageKey();
    if (!key) return;
    try {
      localStorage.setItem(key, JSON.stringify(this.history));
    } catch {
      // ignore
    }
  }

  private loadHistory() {
    if (!this.messagesContainer) return;
    this.messagesContainer.innerHTML = "";

    const key = this.getStorageKey();
    let loaded: ChatMessage[] = [];

    if (key) {
      try {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            loaded = parsed;
          }
        }
      } catch {
        loaded = [];
      }
    }

    this.history = loaded;
    this.renderInitialGreeting();

    if (loaded.length > 0) {
      for (const msg of loaded) {
        if (msg.role === "user") {
          this.appendUserMessage(msg.content);
        } else if (msg.role === "assistant") {
          this.appendAssistantMessage(msg.content);
        }
      }
    }
  }

  public setRole(newRole: string, newUserId: string | null = null) {
    const normalized = this.normalizeRole(newRole);
    const uid = normalized === "guest" ? null : (newUserId ? String(newUserId) : this.currentUserId);

    const isChanged = this.currentRole !== normalized || this.currentUserId !== uid;

    this.currentRole = normalized;
    this.currentUserId = uid;

    const roleInfo = ROLE_CONFIGS[normalized] || ROLE_CONFIGS.guest;
    this.config.subtitle = roleInfo.subtitle;
    this.config.quickPrompts = roleInfo.quickPrompts;

    if (this.subtitleElem) {
      this.subtitleElem.textContent = roleInfo.subtitle;
    }

    if (isChanged) {
      this.loadHistory();
    }
  }

  public static setRole(newRole: string, newUserId: string | null = null) {
    if (widgetInstance) {
      widgetInstance.setRole(newRole, newUserId);
    } else {
      window.FlareChatWidgetConfig = {
        ...window.FlareChatWidgetConfig,
        role: newRole,
        userId: newRole === "guest" ? null : (newUserId ? String(newUserId) : null),
      };
    }
  }

  public static open() {
    widgetInstance?.open();
  }

  public static close() {
    widgetInstance?.close();
  }

  public static toggle() {
    widgetInstance?.toggle();
  }

  public static clear() {
    widgetInstance?.clear();
  }

  public static getInstance(): FlareChatWidgetController | null {
    return widgetInstance;
  }

  public init(customConfig?: WidgetConfig) {
    if (customConfig) {
      if (customConfig.role) {
        this.setRole(customConfig.role);
      }
      this.config = { ...this.config, ...customConfig };
    }
  }

  public open() {
    if (this.isOpen) return;
    this.isOpen = true;
    this.windowElem?.classList.add("active");
    this.fabBtn?.classList.add("open");
    this.fabBadge?.classList.add("hidden");
    setTimeout(() => {
      this.inputElem?.focus();
      this.scrollToBottom();
    }, 250);
  }

  public close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.windowElem?.classList.remove("active");
    this.fabBtn?.classList.remove("open");
    this.fabBadge?.classList.remove("hidden");
  }

  public toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  public toggleFullscreen() {
    this.isFullscreen = !this.isFullscreen;
    if (this.isFullscreen) {
      this.windowElem?.classList.add("fullscreen");
    } else {
      this.windowElem?.classList.remove("fullscreen");
    }
    this.scrollToBottom();
  }

  public clear() {
    this.history = [];
    const key = this.getStorageKey();
    if (key) {
      try {
        localStorage.removeItem(key);
      } catch {
        // ignore
      }
    }
    if (this.messagesContainer) {
      this.messagesContainer.innerHTML = "";
      this.renderInitialGreeting();
    }
  }

  private mount() {
    if (document.getElementById("flare-rag-widget-root")) return;

    this.container = document.createElement("div");
    this.container.id = "flare-rag-widget-root";
    document.body.appendChild(this.container);

    this.shadow = this.container.attachShadow({ mode: "open" });

    // Inject Stylesheet
    const styleElem = document.createElement("style");
    styleElem.textContent = WIDGET_STYLES;
    this.shadow.appendChild(styleElem);

    const roleInfo = ROLE_CONFIGS[this.currentRole] || ROLE_CONFIGS.guest;

    // Main Wrapper
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <!-- Tooltip Badge Gọi Mời Nhận Diện Chatbot -->
      <div class="flare-fab-badge" id="flare-fab-badge" title="Bấm để trò chuyện cùng Flare AI">
        <span class="flare-badge-icon">🔥</span>
        <span>Hỏi Flare AI</span>
      </div>

      <!-- Nút Tròn Nổi FAB với Icon Ngọn Lửa -->
      <button class="flare-fab" id="flare-fab" title="Trợ lý Flare AI">
        <div class="flare-fab-pulse"></div>
        ${FLAME_SVG}
        <svg class="icon-close" viewBox="0 0 24 24">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </button>

      <!-- Khung Cửa Sổ Chatbot -->
      <div class="flare-window" id="flare-window">
        <!-- Header -->
        <div class="flare-header">
          <div class="flare-header-left">
            <div class="flare-header-avatar">
              ${FLAME_SVG}
            </div>
            <div>
              <div class="flare-header-title">${this.config.title}</div>
              <div class="flare-header-subtitle">
                <span class="flare-status-dot"></span>
                <span id="flare-header-subtitle-text">${roleInfo.subtitle}</span>
              </div>
            </div>
          </div>
          <div class="flare-header-actions">
            <!-- Nút Làm Mới Đoạn Chat -->
            <button class="flare-btn-icon" id="flare-btn-clear" title="Làm mới cuộc trò chuyện">
              <svg viewBox="0 0 24 24">
                <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
              </svg>
            </button>

            <!-- Nút Mở Rộng / Toàn Màn Hình -->
            <button class="flare-btn-icon" id="flare-btn-expand" title="Mở rộng / Thu nhỏ toàn màn hình">
              <svg class="icon-expand" viewBox="0 0 24 24">
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
              </svg>
              <svg class="icon-compress" viewBox="0 0 24 24">
                <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-14v3h3v2h-5V5h2z"/>
              </svg>
            </button>

            <!-- Nút Đóng / Thu Nhỏ -->
            <button class="flare-btn-icon" id="flare-btn-close" title="Thu nhỏ">
              <svg viewBox="0 0 24 24">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Khu vực hiển thị tin nhắn -->
        <div class="flare-messages" id="flare-messages"></div>

        <!-- Khung nhập câu hỏi -->
        <div class="flare-footer">
          <div class="flare-input-wrapper">
            <textarea
              class="flare-input"
              id="flare-input"
              rows="1"
              placeholder="${this.config.placeholder}"
            ></textarea>
            <button class="flare-btn-send" id="flare-btn-send" disabled title="Gửi tin nhắn">
              <svg viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
          <div class="flare-brand">Hệ thống FLARE • Trợ lý AI Thông minh</div>
        </div>
      </div>
    `;
    this.shadow.appendChild(wrapper);

    // Cache elements
    this.fabBtn = this.shadow.getElementById("flare-fab") as HTMLButtonElement;
    this.fabBadge = this.shadow.getElementById("flare-fab-badge");
    this.windowElem = this.shadow.getElementById("flare-window");
    this.messagesContainer = this.shadow.getElementById("flare-messages");
    this.inputElem = this.shadow.getElementById("flare-input") as HTMLTextAreaElement;
    this.sendBtn = this.shadow.getElementById("flare-btn-send") as HTMLButtonElement;
    this.expandBtn = this.shadow.getElementById("flare-btn-expand") as HTMLButtonElement;
    this.subtitleElem = this.shadow.getElementById("flare-header-subtitle-text");

    this.bindEvents();
    this.loadHistory();
  }

  private renderInitialGreeting() {
    if (!this.messagesContainer) return;

    const roleInfo = ROLE_CONFIGS[this.currentRole] || ROLE_CONFIGS.guest;

    // Bong bóng chào hỏi 1
    const msg1 = document.createElement("div");
    msg1.className = "flare-msg assistant";
    msg1.innerHTML = `
      <div class="flare-msg-avatar">${FLAME_SVG}</div>
      <div class="flare-msg-bubble">
        <p>Xin chào, mình là trợ lý ảo <strong>Flare AI</strong> 👋</p>
      </div>
    `;
    this.messagesContainer.appendChild(msg1);

    // Bong bóng chào hỏi 2
    const msg2 = document.createElement("div");
    msg2.className = "flare-msg assistant";
    msg2.innerHTML = `
      <div class="flare-msg-avatar" style="visibility: hidden;">${FLAME_SVG}</div>
      <div class="flare-msg-bubble">
        <p>${roleInfo.greeting}</p>
      </div>
    `;
    this.messagesContainer.appendChild(msg2);

    // Danh sách tag hỏi nhanh xếp dọc theo đúng vai trò hiện tại
    const suggestionsGroup = document.createElement("div");
    suggestionsGroup.className = "flare-suggestions-group";
    suggestionsGroup.innerHTML = roleInfo.quickPrompts
      .map((p) => `<button class="flare-suggest-pill" data-prompt="${p}">${p}</button>`)
      .join("");

    this.messagesContainer.appendChild(suggestionsGroup);

    suggestionsGroup.querySelectorAll(".flare-suggest-pill").forEach((btn) => {
      btn.addEventListener("click", () => {
        const prompt = btn.getAttribute("data-prompt");
        if (prompt) {
          this.handleSend(prompt);
        }
      });
    });

    this.scrollToBottom();
  }

  private bindEvents() {
    this.fabBtn?.addEventListener("click", () => this.toggle());
    this.fabBadge?.addEventListener("click", () => this.open());

    this.shadow
      ?.getElementById("flare-btn-close")
      ?.addEventListener("click", () => this.close());

    this.shadow
      ?.getElementById("flare-btn-clear")
      ?.addEventListener("click", () => this.clear());

    this.expandBtn?.addEventListener("click", () => this.toggleFullscreen());

    this.inputElem?.addEventListener("input", () => {
      if (!this.inputElem || !this.sendBtn) return;
      this.inputElem.style.height = "auto";
      this.inputElem.style.height = Math.min(this.inputElem.scrollHeight, 100) + "px";
      this.sendBtn.disabled = !this.inputElem.value.trim() || this.isLoading;
    });

    this.inputElem?.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        const text = this.inputElem?.value.trim();
        if (text && !this.isLoading) {
          this.handleSend(text);
        }
      }
    });

    this.sendBtn?.addEventListener("click", () => {
      const text = this.inputElem?.value.trim();
      if (text && !this.isLoading) {
        this.handleSend(text);
      }
    });
  }

  private async handleSend(question: string) {
    if (!question || this.isLoading) return;

    if (this.inputElem) {
      this.inputElem.value = "";
      this.inputElem.style.height = "auto";
    }
    if (this.sendBtn) {
      this.sendBtn.disabled = true;
    }

    this.appendUserMessage(question);
    this.isLoading = true;

    const typingElem = this.showTypingIndicator();

    try {
      // Gửi kèm vai trò hiện tại (role) lên RAG Backend
      const res = await sendChatMessage(
        this.config.apiUrl || "http://localhost:8001/api",
        question,
        this.history,
        this.currentRole
      );

      typingElem.remove();

      this.appendAssistantMessage(res.answer);

      this.history.push({ role: "user", content: question });
      this.history.push({ role: "assistant", content: res.answer });
      this.history = this.history.slice(-20);
      this.saveHistory();
    } catch (err: unknown) {
      typingElem.remove();
      const message = err instanceof Error ? err.message : "Đã có lỗi xảy ra.";
      this.appendAssistantMessage(
        `⚠️ **Không thể kết nối tới máy chủ Flare AI**\n\nChi tiết: ${message}\n\n*Gợi ý: Hãy đảm bảo Backend RAG đang hoạt động tại ${this.config.apiUrl}*`
      );
    } finally {
      this.isLoading = false;
      if (this.inputElem) {
        this.inputElem.disabled = false;
        this.inputElem.focus();
      }
      if (this.sendBtn && this.inputElem) {
        this.sendBtn.disabled = !this.inputElem.value.trim();
      }
      this.scrollToBottom();
    }
  }

  private appendUserMessage(text: string) {
    if (!this.messagesContainer) return;
    const msg = document.createElement("div");
    msg.className = "flare-msg user";
    msg.innerHTML = `
      <div class="flare-msg-avatar">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      </div>
      <div class="flare-msg-bubble">${parseSimpleMarkdown(text)}</div>
    `;
    this.messagesContainer.appendChild(msg);
    this.scrollToBottom();
  }

  private appendAssistantMessage(text: string, _sources: SourceItem[] = []) {
    if (!this.messagesContainer) return;
    const msg = document.createElement("div");
    msg.className = "flare-msg assistant";

    msg.innerHTML = `
      <div class="flare-msg-avatar">
        ${FLAME_SVG}
      </div>
      <div class="flare-msg-bubble">
        ${parseSimpleMarkdown(text)}
      </div>
    `;
    this.messagesContainer.appendChild(msg);
    this.scrollToBottom();
  }

  private showTypingIndicator(): HTMLElement {
    const typing = document.createElement("div");
    typing.className = "flare-typing";
    typing.innerHTML = `
      <div class="flare-typing-dot"></div>
      <div class="flare-typing-dot"></div>
      <div class="flare-typing-dot"></div>
    `;
    this.messagesContainer?.appendChild(typing);
    this.scrollToBottom();
    return typing;
  }

  private scrollToBottom() {
    if (!this.messagesContainer) return;
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (this.messagesContainer) {
          this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }
      }, 30);
    });
  }
}

// Tự động khởi tạo
function initFlareChatWidget() {
  if (!widgetInstance) {
    widgetInstance = new FlareChatWidgetController();
  }
  (window as any).flareWidgetInstance = widgetInstance;
  (window as any).flareWidget = widgetInstance;
  (window as any).FlareChatWidget = FlareChatWidgetController;
  if (window.FlareChatWidgetConfig) {
    const cfgRole = window.FlareChatWidgetConfig.role;
    const cfgUid = (window.FlareChatWidgetConfig as any).userId;
    if (cfgRole) {
      widgetInstance.setRole(cfgRole, cfgUid);
    }
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initFlareChatWidget);
} else {
  initFlareChatWidget();
}

export default FlareChatWidgetController;
