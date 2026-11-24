export const WIDGET_STYLES = `
:host {
  --flare-primary: #ff5722;
  --flare-primary-hover: #f4511e;
  --flare-primary-glow: rgba(255, 87, 34, 0.4);
  --flare-bg-main: #0d1117;
  --flare-bg-panel: #161b22;
  --flare-bg-card: #1c2128;
  --flare-border: rgba(240, 246, 252, 0.12);
  --flare-text: #f0f6fc;
  --flare-text-muted: #8b949e;
  --flare-accent: #388bfd;
  --flare-font: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --flare-radius: 18px;
  --flare-shadow: 0 16px 48px rgba(0, 0, 0, 0.65), 0 0 0 1px var(--flare-border);
  font-family: var(--flare-font);
  color: var(--flare-text);
  box-sizing: border-box;
}

:host([data-theme="light"]),
:host(.theme-light),
.flare-wrapper.theme-light {
  --flare-bg-main: #f8fafc;
  --flare-bg-panel: #ffffff;
  --flare-bg-card: #ffffff;
  --flare-border: rgba(0, 0, 0, 0.08);
  --flare-text: #0f172a;
  --flare-text-muted: #64748b;
  --flare-shadow: 0 16px 48px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.06);
}

.flare-wrapper.theme-light .flare-mascot-bubble {
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(255, 87, 34, 0.35);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12), 0 0 16px rgba(255, 87, 34, 0.15);
}

.flare-wrapper.theme-light .flare-bubble-title {
  color: #0f172a;
}

.flare-wrapper.theme-light .flare-bubble-text {
  color: #334155;
}

.flare-wrapper.theme-light .flare-mascot-pill {
  background: rgba(255, 255, 255, 0.96);
  color: #1e293b;
  border: 1px solid rgba(255, 87, 34, 0.35);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
}

.flare-wrapper.theme-light .flare-mascot-pill:hover {
  background: linear-gradient(135deg, #ff5722 0%, #f4511e 100%);
  color: #ffffff;
}

.flare-wrapper.theme-light .flare-mascot-toggle-btn {
  background: rgba(255, 255, 255, 0.9);
  border-color: rgba(255, 87, 34, 0.3);
  color: #64748b;
}

.flare-wrapper.theme-light .flare-header {
  background: #ffffff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.flare-wrapper.theme-light .flare-header-title {
  color: #0f172a;
}

.flare-wrapper.theme-light .flare-btn-icon:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.flare-wrapper.theme-light .flare-messages {
  background: #f8fafc;
  scrollbar-color: #cbd5e1 transparent;
}

.flare-wrapper.theme-light .flare-messages::-webkit-scrollbar-thumb {
  background: #cbd5e1;
}

.flare-wrapper.theme-light .flare-msg.assistant .flare-msg-bubble {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  color: #0f172a;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.flare-wrapper.theme-light .flare-msg-bubble strong {
  color: #ea580c;
}

.flare-wrapper.theme-light .flare-msg-bubble code {
  background: rgba(0, 0, 0, 0.05);
  color: #c2410c;
}

.flare-wrapper.theme-light .flare-action-btn {
  background: linear-gradient(135deg, rgba(255, 87, 34, 0.08) 0%, rgba(255, 87, 34, 0.18) 100%);
  border: 1px solid rgba(255, 87, 34, 0.4);
  color: #c2410c;
  box-shadow: 0 2px 6px rgba(255, 87, 34, 0.1);
}

.flare-wrapper.theme-light .flare-action-btn:hover {
  background: linear-gradient(135deg, #ff5722 0%, #f4511e 100%);
  color: #ffffff;
}

.flare-wrapper.theme-light .flare-suggest-pill {
  color: #c2410c;
  background: rgba(255, 87, 34, 0.06);
  border: 1.5px solid rgba(255, 87, 34, 0.35);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.flare-wrapper.theme-light .flare-suggest-pill:hover {
  background: linear-gradient(135deg, #ff5722 0%, #f4511e 100%);
  color: #ffffff;
  border-color: #ff5722;
}

.flare-wrapper.theme-light .flare-typing {
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.flare-wrapper.theme-light .flare-footer {
  background: #ffffff;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
}

.flare-wrapper.theme-light .flare-input-wrapper {
  background: #f1f5f9;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.flare-wrapper.theme-light .flare-input {
  color: #0f172a;
}

.flare-wrapper.theme-light .flare-input::placeholder {
  color: #94a3b8;
}

.flare-wrapper.theme-light .flare-btn-mic {
  background: rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(0, 0, 0, 0.08);
  color: #64748b;
}

.flare-wrapper.theme-light .flare-btn-mic:hover {
  background: rgba(255, 87, 34, 0.12);
  color: var(--flare-primary);
}

.flare-wrapper.theme-light .flare-brand {
  color: #94a3b8;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Tooltip Badge & Nút Tròn (Ẩn khi có Mascot Launcher) */
.flare-fab-badge, .flare-fab {
  display: none !important;
}

/* Mascot Launcher Container nổi ở góc dưới bên phải */
.flare-mascot-launcher {
  position: fixed;
  bottom: 16px;
  right: 20px;
  z-index: 2147483646;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  pointer-events: none;
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  user-select: none;
}

.flare-mascot-launcher.hidden {
  opacity: 0;
  transform: translateY(20px) scale(0.9);
  pointer-events: none !important;
}

.flare-mascot-launcher.is-left {
  align-items: flex-start;
}

.flare-mascot-launcher.is-left .flare-mascot-bubble {
  border-radius: 18px 18px 18px 4px;
}

.flare-mascot-launcher.is-left .flare-mascot-pills {
  align-items: flex-start;
}

/* Thẻ bong bóng lời chào nổi (Floating Greeting Bubble) */
.flare-mascot-bubble {
  pointer-events: auto;
  background: rgba(22, 27, 34, 0.94);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 87, 34, 0.45);
  border-radius: 18px 18px 4px 18px;
  padding: 12px 16px;
  margin-bottom: 10px;
  max-width: 290px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.55), 0 0 16px rgba(255, 87, 34, 0.25);
  animation: mascot-float 3.8s ease-in-out infinite;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.flare-mascot-bubble:hover {
  transform: translateY(-3px) scale(1.02);
  border-color: var(--flare-primary);
  box-shadow: 0 16px 36px rgba(255, 87, 34, 0.4);
}

.flare-bubble-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.flare-bubble-avatar {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--flare-primary);
  border-radius: 50%;
  overflow: hidden;
}

.flare-bubble-avatar svg {
  width: 18px;
  height: 18px;
  fill: currentColor;
}

.flare-bubble-avatar video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.flare-bubble-title {
  font-size: 14.5px;
  font-weight: 700;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 6px;
}

.flare-bubble-title .flare-status-dot {
  display: inline-block;
}

.flare-bubble-text {
  font-size: 13.5px;
  line-height: 1.45;
  color: #f0f6fc;
}

/* Danh sách các tag gợi ý bay lơ lửng (Floating Suggestion Pills) */
.flare-mascot-pills {
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.flare-mascot-launcher.collapsed .flare-mascot-bubble,
.flare-mascot-launcher.collapsed .flare-mascot-pills {
  display: none !important;
}

.flare-mascot-pill {
  background: rgba(22, 27, 34, 0.92);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 87, 34, 0.4);
  color: #f0f6fc;
  padding: 8px 15px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4);
  text-align: right;
  max-width: 300px;
  white-space: normal;
  line-height: 1.35;
}

.flare-mascot-pill:hover {
  background: linear-gradient(135deg, #ff5722 0%, #f4511e 100%);
  color: #ffffff;
  border-color: #ff784e;
  transform: translateX(-4px) scale(1.02);
  box-shadow: 0 8px 24px rgba(255, 87, 34, 0.55);
}

/* Chú Mascot Ngọn Lửa Chuyển Động (Animated Character) */
.flare-mascot-character-wrapper {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 6px;
}

.flare-mascot-character {
  position: relative;
  width: 125px;
  height: 125px;
  cursor: grab;
  user-select: none;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.flare-mascot-character.is-dragging {
  cursor: grabbing !important;
  transform: scale(1.06);
}

.flare-mascot-character:hover {
  transform: scale(1.09) translateY(-4px);
}

.flare-mascot-video {
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
  filter: drop-shadow(0 8px 22px rgba(255, 87, 34, 0.5));
}

.flare-mascot-glow {
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 75px;
  height: 18px;
  background: radial-gradient(ellipse at center, rgba(255, 87, 34, 0.65) 0%, rgba(255, 87, 34, 0) 70%);
  border-radius: 50%;
  pointer-events: none;
  z-index: -1;
  animation: glow-pulse 2.4s infinite ease-in-out;
}

/* Nút Thu nhỏ / Ẩn bớt lời chào */
.flare-mascot-toggle-btn {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: rgba(22, 27, 34, 0.85);
  border: 1px solid rgba(255, 87, 34, 0.3);
  color: var(--flare-text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  opacity: 0.7;
}

.flare-mascot-toggle-btn:hover {
  opacity: 1;
  color: var(--flare-text);
  border-color: var(--flare-primary);
  background: var(--flare-bg-card);
}

.flare-mascot-toggle-btn svg {
  width: 14px;
  height: 14px;
  fill: currentColor;
  transition: transform 0.25s ease;
}

.flare-mascot-launcher.collapsed .flare-mascot-toggle-btn svg {
  transform: rotate(180deg);
}

@keyframes mascot-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

@keyframes glow-pulse {
  0%, 100% { opacity: 0.6; transform: translateX(-50%) scale(0.95); }
  50% { opacity: 1; transform: translateX(-50%) scale(1.15); }
}

/* Avatar Mascot Video trong Header, Thẻ chào và Avatar tin nhắn (Đồng bộ chuẩn logo FLARE) */
.flare-header-avatar,
.flare-msg-avatar,
.flare-bubble-avatar {
  position: relative;
  overflow: hidden;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  user-select: none;
}

.flare-avatar-mascot-video,
.flare-header-avatar video,
.flare-msg-avatar video,
.flare-bubble-avatar video {
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
  filter: drop-shadow(0 2px 6px rgba(255, 87, 34, 0.45));
  transform: scale(1.18);
  display: block;
}

.flare-avatar-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.flare-avatar-fallback svg {
  width: 60%;
  height: 60%;
  fill: currentColor;
}

/* Khung cửa sổ Chat — Mở rộng rộng rãi hơn (440px) */
.flare-window {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 440px;
  max-width: calc(100vw - 32px);
  height: 620px;
  max-height: calc(100vh - 48px);
  background: var(--flare-bg-main);
  border: 1px solid var(--flare-border);
  border-radius: var(--flare-radius);
  box-shadow: var(--flare-shadow);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 2147483646;
  opacity: 0;
  transform: translateY(16px) scale(0.96);
  pointer-events: none;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.flare-window.active {
  opacity: 1;
  transform: translateY(0) scale(1);
  pointer-events: all;
}

/* Chế độ Toàn màn hình (Fullscreen) */
.flare-window.fullscreen {
  top: 16px;
  bottom: 16px;
  left: 16px;
  right: 16px;
  width: auto;
  max-width: none;
  height: auto;
  max-height: none;
  border-radius: 20px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 87, 34, 0.3);
}

/* Header */
.flare-header {
  padding: 14px 18px;
  background: var(--flare-bg-panel);
  border-bottom: 1px solid var(--flare-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.flare-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.flare-header-avatar {
  position: relative;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(255, 87, 34, 0.22) 0%, rgba(139, 30, 19, 0.45) 100%);
  border: 1px solid rgba(255, 87, 34, 0.4);
  display: grid;
  place-items: center;
  color: #ff5722;
  box-shadow: 0 0 16px rgba(255, 87, 34, 0.35);
  flex-shrink: 0;
  overflow: hidden;
}

.flare-header-avatar svg {
  width: 22px;
  height: 22px;
  fill: currentColor;
}

.flare-header-title {
  font-size: 15.5px;
  font-weight: 600;
  color: var(--flare-text);
  line-height: 1.2;
}

.flare-header-subtitle {
  font-size: 11.5px;
  color: var(--flare-text-muted);
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 3px;
}

.flare-status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #3fb950;
  box-shadow: 0 0 8px rgba(63, 185, 80, 0.9);
}

.flare-header-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.flare-btn-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: transparent;
  border: none;
  color: var(--flare-text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.flare-btn-icon:hover {
  background: var(--flare-bg-card);
  color: var(--flare-text);
}

.flare-btn-icon svg {
  width: 17px;
  height: 17px;
  fill: currentColor;
}

/* Biểu tượng phóng to/thu nhỏ toàn màn hình */
.flare-window:not(.fullscreen) .icon-compress {
  display: none;
}

.flare-window.fullscreen .icon-expand {
  display: none;
}

/* Khu vực tin nhắn */
.flare-messages {
  flex: 1 1 auto;
  min-height: 0;
  padding: 18px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
  scrollbar-width: thin;
  scrollbar-color: var(--flare-bg-card) transparent;
}

.flare-messages::-webkit-scrollbar {
  width: 6px;
}
.flare-messages::-webkit-scrollbar-thumb {
  background: var(--flare-bg-card);
  border-radius: 3px;
}

.flare-msg {
  display: flex;
  gap: 10px;
  max-width: 90%;
  animation: msg-appear 0.25s ease-out;
}

@keyframes msg-appear {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.flare-msg.user {
  margin-left: auto;
  flex-direction: row-reverse;
}

.flare-msg.assistant {
  margin-right: auto;
}

.flare-msg-avatar {
  position: relative;
  width: 32px;
  height: 32px;
  border-radius: 9px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(255, 87, 34, 0.25);
}

.flare-msg.assistant .flare-msg-avatar {
  background: linear-gradient(135deg, rgba(255, 87, 34, 0.22) 0%, rgba(139, 30, 19, 0.45) 100%);
  border: 1px solid rgba(255, 87, 34, 0.4);
  color: var(--flare-primary);
}

.flare-msg.assistant .flare-msg-avatar svg {
  width: 18px;
  height: 18px;
  fill: currentColor;
}

.flare-msg.user .flare-msg-avatar {
  background: linear-gradient(135deg, #ff5722 0%, #e64a19 100%);
  color: white;
}

.flare-msg-bubble {
  padding: 12px 16px;
  border-radius: 14px;
  font-size: 13.8px;
  line-height: 1.6;
  word-break: break-word;
}

.flare-msg.user .flare-msg-bubble {
  background: linear-gradient(135deg, #ff5722 0%, #e64a19 100%);
  color: #ffffff;
  border-bottom-right-radius: 4px;
  box-shadow: 0 4px 16px rgba(255, 87, 34, 0.3);
}

.flare-msg.assistant .flare-msg-bubble {
  background: var(--flare-bg-card);
  border: 1px solid var(--flare-border);
  color: var(--flare-text);
  border-bottom-left-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.flare-msg-bubble p:not(:last-child) {
  margin-bottom: 8px;
}

.flare-msg-bubble ul, .flare-msg-bubble ol {
  margin-left: 20px;
  margin-bottom: 8px;
}

.flare-msg-bubble li {
  margin-bottom: 5px;
}

.flare-msg-bubble strong {
  color: #ff9e80;
  font-weight: 600;
}

.flare-msg.user .flare-msg-bubble strong {
  color: #ffffff;
}

.flare-msg-bubble code {
  background: rgba(0, 0, 0, 0.4);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
  font-size: 12.5px;
  color: #ffab91;
}

/* Thẻ hành động tương tác giao diện (Action Card & Button) */
.flare-action-card {
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px dashed rgba(255, 87, 34, 0.35);
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.flare-action-badge {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #ff9e80;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.flare-action-badge svg {
  width: 13px;
  height: 13px;
  fill: #ff9e80;
}

.flare-action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  background: linear-gradient(135deg, rgba(255, 87, 34, 0.18) 0%, rgba(255, 87, 34, 0.32) 100%);
  border: 1px solid rgba(255, 87, 34, 0.5);
  color: #ffffff;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 2px 8px rgba(255, 87, 34, 0.25);
  text-align: left;
  user-select: none;
}

.flare-action-btn:hover {
  background: linear-gradient(135deg, #ff5722 0%, #f4511e 100%);
  border-color: #ff5722;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 87, 34, 0.45);
}

.flare-action-btn:active {
  transform: translateY(0);
}

.flare-action-btn svg {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.flare-action-btn.is-executed {
  background: rgba(34, 197, 94, 0.18);
  border-color: rgba(34, 197, 94, 0.5);
  color: #86efac;
}

/* Các Tag Câu Hỏi Nhanh Xếp Hàng Dọc Bên Phải (Như Mẫu Easy AI) */
.flare-suggestions-group {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 9px;
  margin-top: 4px;
  margin-bottom: 8px;
  animation: msg-appear 0.3s ease-out;
}

.flare-suggest-pill {
  padding: 9px 18px;
  font-size: 13px;
  font-weight: 500;
  color: #ff9e80;
  background: rgba(255, 87, 34, 0.08);
  border: 1.5px solid rgba(255, 87, 34, 0.45);
  border-radius: 22px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  text-align: right;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.flare-suggest-pill:hover {
  background: rgba(255, 87, 34, 0.2);
  border-color: #ff5722;
  color: #ffffff;
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 4px 14px rgba(255, 87, 34, 0.35);
}

.flare-suggest-pill:active {
  transform: translateY(0) scale(0.98);
}

.flare-typing {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 12px 18px;
  background: var(--flare-bg-card);
  border: 1px solid var(--flare-border);
  border-radius: 14px;
  width: fit-content;
}

.flare-typing-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--flare-primary);
  animation: typing-jump 1.2s infinite ease-in-out;
}

.flare-typing-dot:nth-child(2) { animation-delay: 0.2s; }
.flare-typing-dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes typing-jump {
  0%, 80%, 100% { transform: translateY(0); opacity: 0.35; }
  40% { transform: translateY(-6px); opacity: 1; }
}

/* Footer & Input */
.flare-footer {
  padding: 14px 18px;
  background: var(--flare-bg-panel);
  border-top: 1px solid var(--flare-border);
  flex-shrink: 0;
}

.flare-input-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--flare-bg-main);
  border: 1px solid var(--flare-border);
  border-radius: 14px;
  padding: 9px 14px;
  transition: all 0.2s ease;
}

.flare-input-wrapper:focus-within {
  border-color: var(--flare-primary);
  box-shadow: 0 0 0 2px rgba(255, 87, 34, 0.25);
}

.flare-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--flare-text);
  font-family: inherit;
  font-size: 13.8px;
  resize: none;
  max-height: 90px;
  line-height: 1.45;
}

.flare-input::placeholder {
  color: #6e7681;
}

/* Nút Thu Âm / Ra Lệnh Giọng Nói (Voice-to-Action) */
.flare-btn-mic {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #94a3b8;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  flex-shrink: 0;
}

.flare-btn-mic:hover {
  background: rgba(255, 87, 34, 0.15);
  border-color: rgba(255, 87, 34, 0.4);
  color: var(--flare-primary);
  transform: scale(1.05);
}

.flare-btn-mic.is-listening {
  background: #ef4444 !important;
  border-color: #f87171 !important;
  color: #ffffff !important;
  animation: mic-pulse 1.2s infinite ease-in-out;
}

@keyframes mic-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(239, 68, 68, 0);
    transform: scale(1.08);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
    transform: scale(1);
  }
}

.flare-btn-mic svg {
  width: 17px;
  height: 17px;
  fill: currentColor;
}

/* Thông báo trạng thái thu âm giọng nói */
.flare-voice-indicator {
  display: none;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  margin-bottom: 6px;
  border-radius: 8px;
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.35);
  color: #fca5a5;
  font-size: 12px;
  font-weight: 500;
  animation: flare-fade-in 0.2s ease;
}

.flare-voice-indicator.active {
  display: flex;
}

.flare-voice-wave {
  display: flex;
  align-items: center;
  gap: 2.5px;
  height: 12px;
}

.flare-voice-wave span {
  width: 3px;
  height: 100%;
  background: #ef4444;
  border-radius: 2px;
  animation: sound-wave 0.8s infinite ease-in-out alternate;
}

.flare-voice-wave span:nth-child(2) { animation-delay: 0.2s; height: 70%; }
.flare-voice-wave span:nth-child(3) { animation-delay: 0.4s; height: 100%; }
.flare-voice-wave span:nth-child(4) { animation-delay: 0.1s; height: 50%; }

@keyframes sound-wave {
  0% { transform: scaleY(0.3); }
  100% { transform: scaleY(1); }
}

/* Con trỏ nhấp nháy cho hiệu ứng Typewriter */
.flare-cursor {
  display: inline-block;
  width: 2px;
  height: 14px;
  background: var(--flare-primary);
  margin-left: 2px;
  vertical-align: middle;
  animation: cursor-blink 0.75s infinite;
}

@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@keyframes flare-fade-in {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

.flare-btn-send {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: var(--flare-primary);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.flare-btn-send:hover:not(:disabled) {
  background: var(--flare-primary-hover);
  transform: scale(1.05);
}

.flare-btn-send:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.flare-btn-send svg {
  width: 17px;
  height: 17px;
  fill: currentColor;
}

.flare-brand {
  font-size: 11px;
  color: #6e7681;
  text-align: center;
  margin-top: 8px;
}

@media (max-width: 480px) {
  .flare-window {
    right: 8px;
    left: 8px;
    bottom: 84px;
    width: auto;
    height: calc(100vh - 96px);
  }
  .flare-fab-badge {
    display: none;
  }
}
`;
