import { WIDGET_STYLES } from "./styles";
import { ChatMessage, SourceItem, WidgetConfig, UserRole, FlareAction } from "./types";
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

// SVG Biểu tượng Microphone thu âm
const MIC_SVG = `
<svg viewBox="0 0 24 24" fill="currentColor">
  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
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
      "📷 Cách biến điện thoại thành camera giám sát",
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

function detectMascotUrl(): string {
  if ((window.FlareChatWidgetConfig as any)?.mascotUrl) {
    return (window.FlareChatWidgetConfig as any).mascotUrl;
  }

  const scripts = document.querySelectorAll("script");
  for (let i = 0; i < scripts.length; i++) {
    const src = scripts[i].src || "";
    if (src.includes("widget.js")) {
      try {
        const u = new URL(src);
        return `${u.origin}/mascot_flare.webm`;
      } catch {
        // ignore
      }
    }
  }

  if (window.FlareChatWidgetConfig?.apiUrl) {
    try {
      const u = new URL(window.FlareChatWidgetConfig.apiUrl);
      return `${u.origin}/mascot_flare.webm`;
    } catch {
      // ignore
    }
  }

  return "/mascot_flare.webm";
}

function detectMascotAvatarUrl(): string {
  if ((window.FlareChatWidgetConfig as any)?.avatarUrl) {
    return (window.FlareChatWidgetConfig as any).avatarUrl;
  }

  const scripts = document.querySelectorAll("script");
  for (let i = 0; i < scripts.length; i++) {
    const src = scripts[i].src || "";
    if (src.includes("widget.js")) {
      try {
        const u = new URL(src);
        return `${u.origin}/mascot_avatar.png`;
      } catch {
        // ignore
      }
    }
  }

  if (window.FlareChatWidgetConfig?.apiUrl) {
    try {
      const u = new URL(window.FlareChatWidgetConfig.apiUrl);
      return `${u.origin}/mascot_avatar.png`;
    } catch {
      // ignore
    }
  }

  return "/mascot_avatar.png";
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
  private mascotUrl: string = "";
  private mascotAvatarUrl: string = "";
  private mascotLauncherElem: HTMLElement | null = null;
  private mascotGreetingElem: HTMLElement | null = null;
  private mascotPillsElem: HTMLElement | null = null;
  private isMascotCollapsed = false;
  private history: ChatMessage[] = [];
  private messagesContainer: HTMLElement | null = null;
  private inputElem: HTMLTextAreaElement | null = null;
  private sendBtn: HTMLButtonElement | null = null;
  private micBtn: HTMLButtonElement | null = null;
  private voiceIndicatorElem: HTMLElement | null = null;
  private recognition: any = null;
  private isListening = false;
  private fabBtn: HTMLButtonElement | null = null;
  private fabBadge: HTMLElement | null = null;
  private windowElem: HTMLElement | null = null;
  private expandBtn: HTMLButtonElement | null = null;
  private subtitleElem: HTMLElement | null = null;
  private wrapperElem: HTMLElement | null = null;
  private themeObserver: MutationObserver | null = null;

  constructor(customConfig?: WidgetConfig) {
    const detectedRole = window.FlareChatWidgetConfig?.role || customConfig?.role || "guest";
    this.currentRole = this.normalizeRole(detectedRole);
    this.currentUserId = (window.FlareChatWidgetConfig as any)?.userId || (customConfig as any)?.userId || null;
    if (this.currentRole === "guest") this.currentUserId = null;

    const roleInfo = ROLE_CONFIGS[this.currentRole] || ROLE_CONFIGS.guest;
    this.mascotUrl = (customConfig as any)?.mascotUrl || (window.FlareChatWidgetConfig as any)?.mascotUrl || detectMascotUrl();
    this.mascotAvatarUrl = (customConfig as any)?.avatarUrl || (window.FlareChatWidgetConfig as any)?.avatarUrl || detectMascotAvatarUrl();

    this.config = {
      apiUrl: detectApiUrl(),
      mascotUrl: this.mascotUrl,
      avatarUrl: this.mascotAvatarUrl,
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

  private getAvatarHtml(): string {
    const videoSrc = this.mascotUrl || "/mascot_flare.webm";
    return `
      <video
        src="${videoSrc}"
        autoplay
        loop
        muted
        playsinline
        class="flare-avatar-mascot-video"
        aria-label="FLARE Mascot"
        onerror="this.style.display='none'; if (this.nextElementSibling) (this.nextElementSibling as HTMLElement).style.display='flex';"
      ></video>
      <div class="flare-avatar-fallback" style="display: none;">${FLAME_SVG}</div>
    `;
  }

  private playAllVideos(container?: HTMLElement | null) {
    const root = container || this.shadow;
    if (!root) return;
    root.querySelectorAll<HTMLVideoElement>("video").forEach((v) => {
      if (v.paused) {
        v.play().catch(() => {});
      }
    });
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
          this.appendAssistantMessage(msg.content, [], null, false);
        }
      }
    }
    this.playAllVideos();
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
    if (this.mascotGreetingElem) {
      this.mascotGreetingElem.textContent = roleInfo.greeting;
    }
    if (this.mascotPillsElem) {
      this.mascotPillsElem.innerHTML = roleInfo.quickPrompts
        .map((p) => `<button class="flare-mascot-pill" data-prompt="${p}">${p}</button>`)
        .join("");
      this.bindMascotPills();
    }

    if (isChanged) {
      this.loadHistory();
    }
  }

  public static setRole(newRole: string, newUserId: string | null = null) {
    if (widgetInstance) {
      widgetInstance.setRole(newRole, newUserId);
    } else {
      const normalized = (newRole || "").toLowerCase().trim() as UserRole;
      window.FlareChatWidgetConfig = {
        ...window.FlareChatWidgetConfig,
        role: normalized,
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
    this.mascotLauncherElem?.classList.add("hidden");
    this.playAllVideos();
    setTimeout(() => {
      this.inputElem?.focus();
      this.scrollToBottom();
      this.playAllVideos();
    }, 250);
  }

  public close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    this.windowElem?.classList.remove("active");
    this.mascotLauncherElem?.classList.remove("hidden");
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
    wrapper.className = "flare-wrapper";
    this.wrapperElem = wrapper;
    wrapper.innerHTML = `
      <!-- Mascot Launcher Nổi Bật Ở Góc Phải (Theo Hình Mẫu) -->
      <div class="flare-mascot-launcher" id="flare-mascot-launcher">
        <!-- 1. Hộp Lời Chào Nổi -->
        <div class="flare-mascot-bubble" id="flare-mascot-bubble" title="Bấm để mở chat cùng Flare AI">
          <div class="flare-bubble-header">
            <div class="flare-bubble-avatar">
              ${this.getAvatarHtml()}
            </div>
            <div class="flare-bubble-title">
              <span>Flare AI</span>
              <span class="flare-status-dot"></span>
            </div>
          </div>
          <div class="flare-bubble-text" id="flare-mascot-greeting-text">
            ${roleInfo.greeting}
          </div>
        </div>

        <!-- 2. Danh Sách Câu Hỏi Nhanh Xếp Dọc Nổi Lơ Lửng -->
        <div class="flare-mascot-pills" id="flare-mascot-pills">
          ${roleInfo.quickPrompts.map((p) => `<button class="flare-mascot-pill" data-prompt="${p}">${p}</button>`).join("")}
        </div>

        <!-- 3. Chú Mascot Ngọn Lửa Chuyển Động & Nút Thu Nhỏ -->
        <div class="flare-mascot-character-wrapper">
          <button class="flare-mascot-toggle-btn" id="flare-mascot-toggle-btn" title="Thu nhỏ / Mở rộng gợi ý">
            <svg viewBox="0 0 24 24"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>
          </button>
          <div class="flare-mascot-character" id="flare-mascot-character" title="Bấm để trò chuyện cùng Flare AI">
            <div class="flare-mascot-glow"></div>
            <video
              class="flare-mascot-video"
              src="${this.mascotUrl}"
              autoplay
              loop
              muted
              playsinline
            ></video>
          </div>
        </div>
      </div>

      <!-- Khung Cửa Sổ Chatbot -->
      <div class="flare-window" id="flare-window">
        <!-- Header -->
        <div class="flare-header">
          <div class="flare-header-left">
            <div class="flare-header-avatar">
              ${this.getAvatarHtml()}
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
          <!-- Thanh trạng thái đang lắng nghe giọng nói -->
          <div class="flare-voice-indicator" id="flare-voice-indicator">
            <div class="flare-voice-wave">
              <span></span><span></span><span></span><span></span>
            </div>
            <span>Đang lắng nghe giọng nói... Hãy ra lệnh hoặc đặt câu hỏi</span>
          </div>

          <div class="flare-input-wrapper">
            <textarea
              class="flare-input"
              id="flare-input"
              rows="1"
              placeholder="${this.config.placeholder}"
            ></textarea>
            <button class="flare-btn-mic" id="flare-btn-mic" type="button" title="Ra lệnh bằng giọng nói (Voice-to-Action)">
              ${MIC_SVG}
            </button>
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
    this.mascotLauncherElem = this.shadow.getElementById("flare-mascot-launcher");
    this.mascotGreetingElem = this.shadow.getElementById("flare-mascot-greeting-text");
    this.mascotPillsElem = this.shadow.getElementById("flare-mascot-pills");
    this.windowElem = this.shadow.getElementById("flare-window");
    this.messagesContainer = this.shadow.getElementById("flare-messages");
    this.inputElem = this.shadow.getElementById("flare-input") as HTMLTextAreaElement;
    this.sendBtn = this.shadow.getElementById("flare-btn-send") as HTMLButtonElement;
    this.micBtn = this.shadow.getElementById("flare-btn-mic") as HTMLButtonElement;
    this.voiceIndicatorElem = this.shadow.getElementById("flare-voice-indicator");
    this.expandBtn = this.shadow.getElementById("flare-btn-expand") as HTMLButtonElement;
    this.subtitleElem = this.shadow.getElementById("flare-header-subtitle-text");

    this.bindEvents();
    this.loadHistory();
    this.syncTheme();
    try {
      this.themeObserver = new MutationObserver(() => {
        this.syncTheme();
      });
      this.themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme"],
      });
    } catch {
      // ignore
    }
  }

  private syncTheme() {
    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    if (this.container) {
      this.container.classList.toggle("theme-light", isLight);
      this.container.setAttribute("data-theme", isLight ? "light" : "dark");
    }
    if (this.wrapperElem) {
      this.wrapperElem.classList.toggle("theme-light", isLight);
    }
  }

  private renderInitialGreeting() {
    if (!this.messagesContainer) return;

    const roleInfo = ROLE_CONFIGS[this.currentRole] || ROLE_CONFIGS.guest;

    // Bong bóng chào hỏi 1
    const msg1 = document.createElement("div");
    msg1.className = "flare-msg assistant";
    msg1.innerHTML = `
      <div class="flare-msg-avatar">${this.getAvatarHtml()}</div>
      <div class="flare-msg-bubble">
        <p>Xin chào, mình là trợ lý ảo <strong>Flare AI</strong> 👋</p>
      </div>
    `;
    this.messagesContainer.appendChild(msg1);
    this.playAllVideos(msg1);

    // Bong bóng chào hỏi 2
    const msg2 = document.createElement("div");
    msg2.className = "flare-msg assistant";
    msg2.innerHTML = `
      <div class="flare-msg-avatar" style="visibility: hidden;">${this.getAvatarHtml()}</div>
      <div class="flare-msg-bubble">
        <p>${roleInfo.greeting}</p>
      </div>
    `;
    this.messagesContainer.appendChild(msg2);
    this.playAllVideos(msg2);

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

  private bindMascotPills() {
    if (!this.mascotPillsElem) return;
    this.mascotPillsElem.querySelectorAll(".flare-mascot-pill").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const prompt = btn.getAttribute("data-prompt");
        if (prompt) {
          this.open();
          this.handleSend(prompt);
        }
      });
    });
  }

  private setupMascotDrag() {
    const launcher = this.mascotLauncherElem;
    const mascotChar = this.shadow?.getElementById("flare-mascot-character");
    if (!launcher || !mascotChar) return;

    // Khôi phục vị trí đã lưu từ localStorage (neo theo bottom và left)
    try {
      const saved = localStorage.getItem("flare_mascot_pos");
      if (saved) {
        const pos = JSON.parse(saved);
        if (typeof pos.bottom === "number" && typeof pos.left === "number") {
          const clampedX = Math.max(16, Math.min(window.innerWidth - 150, pos.left));
          const clampedY = Math.max(16, Math.min(window.innerHeight - 150, pos.bottom));
          launcher.style.left = `${clampedX}px`;
          launcher.style.bottom = `${clampedY}px`;
          launcher.style.right = "auto";
          launcher.style.top = "auto";
          if (clampedX < window.innerWidth / 2) {
            launcher.classList.add("is-left");
          } else {
            launcher.classList.remove("is-left");
          }
        } else {
          localStorage.removeItem("flare_mascot_pos");
        }
      }
    } catch {
      // bỏ qua lỗi đọc localStorage
    }

    let isDragging = false;
    let hasMoved = false;
    let startX = 0;
    let startY = 0;
    let initLeft = 0;
    let initBottom = 0;

    const onStart = (e: MouseEvent | TouchEvent) => {
      if ("button" in e && e.button !== 0) return; // Chỉ bắt chuột trái
      isDragging = true;
      hasMoved = false;

      const clientX = "clientX" in e ? e.clientX : e.touches[0].clientX;
      const clientY = "clientY" in e ? e.clientY : e.touches[0].clientY;
      startX = clientX;
      startY = clientY;

      const rect = launcher.getBoundingClientRect();
      initLeft = rect.left;
      initBottom = window.innerHeight - rect.bottom;

      launcher.style.transition = "none";
      mascotChar.classList.add("is-dragging");

      window.addEventListener("mousemove", onMove, { passive: false });
      window.addEventListener("mouseup", onEnd);
      window.addEventListener("touchmove", onMove, { passive: false });
      window.addEventListener("touchend", onEnd);
    };

    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = "clientX" in e ? e.clientX : e.touches[0].clientX;
      const clientY = "clientY" in e ? e.clientY : e.touches[0].clientY;
      const dx = clientX - startX;
      const dy = clientY - startY;

      if (!hasMoved && Math.hypot(dx, dy) > 4) {
        hasMoved = true;
      }

      if (hasMoved) {
        if (e.cancelable) e.preventDefault();
        const rect = launcher.getBoundingClientRect();
        const width = rect.width || 140;
        const height = rect.height || 140;
        const minX = 16;
        const maxX = Math.max(minX, window.innerWidth - width - 16);
        const minY = 16;
        const maxY = Math.max(minY, window.innerHeight - height - 16);

        const newLeft = Math.max(minX, Math.min(maxX, initLeft + dx));
        const newBottom = Math.max(minY, Math.min(maxY, initBottom - dy));

        launcher.style.left = `${newLeft}px`;
        launcher.style.bottom = `${newBottom}px`;
        launcher.style.right = "auto";
        launcher.style.top = "auto";

        if (newLeft < window.innerWidth / 2) {
          launcher.classList.add("is-left");
        } else {
          launcher.classList.remove("is-left");
        }
      }
    };

    const onEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      mascotChar.classList.remove("is-dragging");
      launcher.style.transition = "";

      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);

      if (hasMoved) {
        try {
          const rect = launcher.getBoundingClientRect();
          const curBottom = window.innerHeight - rect.bottom;
          localStorage.setItem(
            "flare_mascot_pos",
            JSON.stringify({
              left: Math.round(rect.left),
              bottom: Math.round(Math.max(16, curBottom)),
            })
          );
        } catch {
          // ignore
        }
      } else {
        // Nhấn chuột mà không kéo -> Mở cửa sổ chat
        this.open();
      }
    };

    mascotChar.addEventListener("mousedown", onStart as EventListener);
    mascotChar.addEventListener("touchstart", onStart as EventListener, { passive: true });
  }

  private bindEvents() {
    this.setupMascotDrag();
    this.shadow?.getElementById("flare-mascot-bubble")?.addEventListener("click", () => this.open());

    const toggleBtn = this.shadow?.getElementById("flare-mascot-toggle-btn");
    toggleBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.isMascotCollapsed = !this.isMascotCollapsed;
      if (this.isMascotCollapsed) {
        this.mascotLauncherElem?.classList.add("collapsed");
      } else {
        this.mascotLauncherElem?.classList.remove("collapsed");
      }
    });

    this.bindMascotPills();

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

    // Bắt sự kiện Ra lệnh giọng nói (Voice-to-Action)
    this.micBtn?.addEventListener("click", () => this.toggleListening());
    this.initSpeechRecognition();
  }

  private initSpeechRecognition() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      if (this.micBtn) {
        this.micBtn.title = "Trình duyệt không hỗ trợ nhận diện giọng nói (Khuyên dùng Chrome hoặc Edge)";
        this.micBtn.style.opacity = "0.5";
      }
      return;
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = "vi-VN";
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.maxAlternatives = 1;

      this.recognition.onstart = () => {
        this.isListening = true;
        this.micBtn?.classList.add("is-listening");
        this.voiceIndicatorElem?.classList.add("active");
        if (this.inputElem) {
          this.inputElem.placeholder = "Đang lắng nghe... (Nói lệnh hoặc câu hỏi)";
        }
      };

      this.recognition.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        const currentText = finalTranscript || interimTranscript;
        if (this.inputElem && currentText) {
          this.inputElem.value = currentText;
          this.inputElem.style.height = "auto";
          this.inputElem.style.height = Math.min(this.inputElem.scrollHeight, 100) + "px";
          this.inputElem.dispatchEvent(new Event("input"));
        }

        if (finalTranscript.trim()) {
          const query = finalTranscript.trim();
          this.stopListening();
          setTimeout(() => {
            this.handleSend(query);
          }, 350);
        }
      };

      this.recognition.onerror = (event: any) => {
        console.warn("[FlareChatWidget] Speech Recognition Error:", event.error);
        this.stopListening();
        if (event.error === "not-allowed") {
          alert("Vui lòng cấp quyền Microphone trên trình duyệt để sử dụng tính năng Ra lệnh giọng nói.");
        }
      };

      this.recognition.onend = () => {
        this.stopListening();
      };
    } catch (err) {
      console.warn("[FlareChatWidget] Lỗi khởi tạo SpeechRecognition:", err);
    }
  }

  private toggleListening() {
    if (!this.recognition) {
      alert("Trình duyệt của bạn chưa hỗ trợ Web Speech API. Hãy mở trên Google Chrome hoặc Microsoft Edge để trải nghiệm.");
      return;
    }

    if (this.isListening) {
      this.recognition.stop();
      this.stopListening();
    } else {
      if (this.inputElem) {
        this.inputElem.value = "";
        this.inputElem.style.height = "auto";
      }
      try {
        this.recognition.start();
      } catch (e) {
        console.warn("[FlareChatWidget] Lỗi start speech recognition:", e);
      }
    }
  }

  private stopListening() {
    this.isListening = false;
    this.micBtn?.classList.remove("is-listening");
    this.voiceIndicatorElem?.classList.remove("active");
    if (this.inputElem) {
      this.inputElem.placeholder = this.config.placeholder || "Hỏi Flare AI...";
    }
  }

  private async handleSend(questionText?: string) {
    const question = (questionText !== undefined ? questionText : this.inputElem?.value || "").trim();
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

      // Phân tích action tương tác hệ thống: Ưu tiên metadata từ backend Gemini, fallback sang client-side intent
      let action: FlareAction | null = res.action || null;
      if (!action) {
        action = this.detectClientAction(question);
      }

      // Render tin nhắn với hiệu ứng Typewriter streaming mượt mà
      this.appendAssistantMessage(res.answer, res.sources || [], action, true);

      this.history.push({ role: "user", content: question });
      this.history.push({ role: "assistant", content: res.answer });
      this.history = this.history.slice(-20);
      this.saveHistory();
    } catch (err: unknown) {
      typingElem.remove();
      const message = err instanceof Error ? err.message : "Đã có lỗi xảy ra.";
      this.appendAssistantMessage(
        `⚠️ **Không thể kết nối tới máy chủ Flare AI**\n\nChi tiết: ${message}\n\n*Gợi ý: Hãy đảm bảo Backend RAG đang hoạt động tại ${this.config.apiUrl}*`,
        [],
        null,
        false
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

  private dispatchWebAction(action: FlareAction) {
    try {
      window.dispatchEvent(
        new CustomEvent("flare-action", {
          detail: action,
          bubbles: true,
          composed: true,
        })
      );
    } catch (e) {
      console.warn("[FlareChatWidget] Không thể dispatch flare-action:", e);
    }
  }

  private detectClientAction(question: string): FlareAction | null {
    const q = question.toLowerCase();

    // 1. Ý định Thêm Camera / Nhập IP camera
    const addCamMatch =
      q.match(/(?:thêm|tạo|nhập|đưa|kết nối|add)\s+(?:camera|cam|ip)/i) ||
      q.match(/(?:camera|cam)\s+(?:với\s+)?ip/i) ||
      q.match(/nhập\s+ip\s+cam/i);

    if (addCamMatch) {
      // Tìm IP/URL trong câu hỏi (ví dụ: 192.168.1.50 hoặc 192.168.1.50:8080 hoặc http://...)
      const ipMatch = question.match(/(?:https?:\/\/)?((?:\d{1,3}\.){3}\d{1,3}(?::\d+)?(?:\/[^\s]*)?)/);
      let streamUrl = "";
      if (ipMatch) {
        let raw = ipMatch[0].trim();
        if (!raw.startsWith("http://") && !raw.startsWith("https://") && !raw.startsWith("rtsp://")) {
          streamUrl = `http://${raw}${raw.includes("/") ? "" : "/video"}`;
        } else {
          streamUrl = raw;
        }
      }

      // Nhận diện tên phòng hoặc khu vực
      let location = "";
      let name = "Camera IP mới";
      const locMatch = question.match(/(?:phòng\s+ngủ|phòng\s+khách|nhà\s+bếp|khu\s+vực\s+bếp|bếp|bãi\s+xe|hầm\s+xe|sân\s+thượng|hành\s+lang|kho\s+hàng|cửa\s+chính)/i);
      if (locMatch) {
        const rawLoc = locMatch[0].trim();
        location = rawLoc.charAt(0).toUpperCase() + rawLoc.slice(1);
        name = `Camera ${location}`;
      }

      const label = `Mở form thêm Camera ${location ? `(${location})` : streamUrl ? `(${streamUrl.replace(/^https?:\/\//, '').split('/')[0]})` : ''}`.trim();

      return {
        action: "ADD_CAMERA",
        label: label,
        params: {
          stream_url: streamUrl,
          name: name,
          location: location,
        },
      };
    }

    // 2. Ý định Bật/Tắt Webcam hoặc Tab Webcam
    if (q.includes("webcam") || q.includes("cam laptop") || q.includes("cam trực tiếp")) {
      return {
        action: "TOGGLE_WEBCAM",
        label: "Chuyển sang Webcam trực tiếp",
        params: { state: "start", tab: "realtime" },
      };
    }

    // 3. Ý định Tab Camera giám sát
    if (
      q.includes("danh sách camera") ||
      q.includes("xem camera") ||
      q.includes("màn hình camera") ||
      q.includes("trang camera") ||
      q.includes("mở camera")
    ) {
      return {
        action: "NAVIGATE",
        label: "Mở trang Camera giám sát",
        params: { tab: "cameras" },
      };
    }

    // 4. Ý định Tab Video
    if (q.includes("video của tôi") || q.includes("tải video") || q.includes("upload video") || q.includes("phân tích video")) {
      return {
        action: "NAVIGATE",
        label: "Mở trang Video tải lên",
        params: { tab: "videos" },
      };
    }

    // 5. Ý định Kết nối Zalo Bot
    if (q.includes("kết nối zalo") || q.includes("bot zalo") || q.includes("cài zalo") || q.includes("thông tin cá nhân")) {
      return {
        action: "CONNECT_ZALO",
        label: "Mở trang Hồ sơ & Kết nối Zalo",
        params: { tab: "profile" },
      };
    }

    // 6. Ý định Tab Quản trị / Lịch sử
    if (q.includes("sự kiện") || q.includes("lịch sử cảnh báo") || q.includes("nhật ký")) {
      return {
        action: "NAVIGATE",
        label: "Xem Sự kiện cảnh báo",
        params: { tab: "events" },
      };
    }

    return null;
  }

  private appendAssistantMessage(
    text: string,
    _sources: SourceItem[] = [],
    action?: FlareAction | null,
    enableStream = true
  ) {
    if (!this.messagesContainer) return;
    const msg = document.createElement("div");
    msg.className = "flare-msg assistant";

    let actionHtml = "";
    if (action) {
      actionHtml = `
        <div class="flare-action-card">
          <div class="flare-action-badge">
            <svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            <span>Tương tác hệ thống</span>
          </div>
          <button class="flare-action-btn" type="button" title="Bấm để kích hoạt trên giao diện">
            <svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            <span>${action.label || "Thực hiện thao tác trên web"}</span>
          </button>
        </div>
      `;
    }

    // Nếu không stream (ví dụ nạp lịch sử cũ hoặc thông báo lỗi ngắn)
    if (!enableStream || text.length < 5) {
      msg.innerHTML = `
        <div class="flare-msg-avatar">
          ${this.getAvatarHtml()}
        </div>
        <div class="flare-msg-bubble">
          ${parseSimpleMarkdown(text)}
          ${actionHtml}
        </div>
      `;
      this.bindActionCardButton(msg, action);
      this.messagesContainer.appendChild(msg);
      this.playAllVideos(msg);
      this.scrollToBottom();
      return;
    }

    // Hiệu ứng Typewriter streaming cho tin nhắn mới
    msg.innerHTML = `
      <div class="flare-msg-avatar">
        ${this.getAvatarHtml()}
      </div>
      <div class="flare-msg-bubble">
        <div class="flare-msg-content"></div>
        <span class="flare-cursor"></span>
      </div>
    `;
    this.messagesContainer.appendChild(msg);
    this.playAllVideos(msg);
    this.scrollToBottom();

    const contentElem = msg.querySelector<HTMLElement>(".flare-msg-content");
    const cursorElem = msg.querySelector<HTMLElement>(".flare-cursor");
    const bubbleElem = msg.querySelector<HTMLElement>(".flare-msg-bubble");

    let currentPos = 0;
    const totalLen = text.length;
    // Tốc độ: tính toán linh hoạt dựa trên độ dài
    const step = Math.max(2, Math.min(6, Math.floor(totalLen / 120)));
    const interval = 16;

    let isDone = false;
    const finishTyping = () => {
      if (isDone) return;
      isDone = true;
      clearInterval(timer);
      if (cursorElem) cursorElem.remove();
      if (bubbleElem) {
        bubbleElem.innerHTML = `${parseSimpleMarkdown(text)}${actionHtml}`;
        this.bindActionCardButton(msg, action);
      }
      this.scrollToBottom();
      // Tự động dispatch action ra hệ thống web FLARE ngay sau khi hoàn tất gõ chữ
      if (action) {
        this.dispatchWebAction(action);
      }
    };

    // Bấm vào bong bóng chat để bỏ qua typewriter và hiển thị toàn bộ ngay lập tức
    bubbleElem?.addEventListener("click", () => finishTyping(), { once: true });

    const timer = setInterval(() => {
      currentPos += step;
      if (currentPos >= totalLen) {
        finishTyping();
      } else {
        if (contentElem) {
          contentElem.innerHTML = parseSimpleMarkdown(text.slice(0, currentPos));
        }
        this.scrollToBottom();
      }
    }, interval);
  }

  private bindActionCardButton(msg: HTMLElement, action?: FlareAction | null) {
    if (!action) return;
    const btn = msg.querySelector<HTMLButtonElement>(".flare-action-btn");
    if (!btn) return;

    btn.addEventListener("click", () => {
      this.dispatchWebAction(action);
      btn.classList.add("is-executed");
      btn.innerHTML = `
        <svg viewBox="0 0 24 24" style="stroke: #86efac"><polyline points="20 6 9 17 4 12"/></svg>
        <span>Đã kích hoạt trên web!</span>
      `;
      setTimeout(() => {
        btn.classList.remove("is-executed");
        btn.innerHTML = `
          <svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          <span>${action.label || "Kích hoạt lại thao tác"}</span>
        `;
      }, 3000);
    });
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
