var Y=Object.defineProperty;var P=(E,x,C)=>x in E?Y(E,x,{enumerable:!0,configurable:!0,writable:!0,value:C}):E[x]=C;var s=(E,x,C)=>P(E,typeof x!="symbol"?x+"":x,C);this.FlareChatWidget=function(){"use strict";const E=`
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
`;async function x(g,e,t=[],a="guest"){const r=`${g.replace(/\/+$/,"")}/chat`,i=await fetch(r,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question:e,history:t,role:a})});if(!i.ok){let n=`Lỗi máy chủ (${i.status})`;try{const o=await i.json();o.detail&&(n=o.detail)}catch{}throw new Error(n)}return i.json()}const C=`
<svg class="icon-flame" viewBox="0 0 24 24" fill="currentColor">
  <path d="M12 23c-4.97 0-9-3.96-9-8.83 0-3.9 2.53-7.58 4.67-9.84.41-.44 1.12-.34 1.39.2 1.09 2.18 2.52 3.82 3.94 4.54.42.21.92-.08.95-.55.15-2.26 1.4-5.4 3.95-7.46.46-.37 1.15-.05 1.17.54.12 3.52 1.39 6.27 3.01 7.82 1.25 1.19 1.92 2.62 1.92 4.58 0 4.87-4.03 8.83-9 8.83z"/>
</svg>
`,H=`
<svg viewBox="0 0 24 24" fill="currentColor">
  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
</svg>
`,w={guest:{subtitle:"Khách vãng lai",greeting:"Bạn cần mình hỗ trợ gì về kỹ năng an toàn PCCC & thoát hiểm ạ? 😊",quickPrompts:["🚨 Kỹ năng thoát hiểm khi có khói độc","🧯 Cách sử dụng bình chữa cháy CO2 và bột","📞 Khi phát hiện cháy cần gọi số nào?","ℹ️ Giới thiệu hệ thống cảnh báo cháy FLARE"]},user:{subtitle:"Người dùng hệ thống",greeting:"Chào bạn! Bạn cần hỗ trợ gì về sử dụng FLARE hoặc an toàn PCCC? 😊",quickPrompts:["📷 Cách biến điện thoại thành camera giám sát","📱 Hướng dẫn kết nối Bot Zalo nhận cảnh báo","📹 Cách bật webcam laptop phát hiện cháy","❓ Cách gửi phản hồi khi hệ thống nhận diện sai","🚨 Kỹ năng thoát hiểm khi có khói"]},admin_ops:{subtitle:"Quản trị Vận hành",greeting:"Chào Quản trị viên Vận hành! Bạn cần hỗ trợ gì về tác vụ hệ thống? ⚡",quickPrompts:["📊 Cách giám sát phiên cảnh báo realtime hệ thống","👥 Quy trình quản lý và duyệt tài khoản người dùng","📋 Cách xem báo cáo đánh giá sự cố hỏa hoạn","⚙️ Hướng dẫn lệnh CLI tạo tài khoản quản trị"]},admin:{subtitle:"Quản trị Vận hành",greeting:"Chào Quản trị viên Vận hành! Bạn cần hỗ trợ gì về tác vụ hệ thống? ⚡",quickPrompts:["📊 Cách giám sát phiên cảnh báo realtime hệ thống","👥 Quy trình quản lý và duyệt tài khoản người dùng","📋 Cách xem báo cáo đánh giá sự cố hỏa hoạn","⚙️ Hướng dẫn lệnh CLI tạo tài khoản quản trị"]},admin_model:{subtitle:"Quản trị Mô hình AI",greeting:"Chào Quản trị viên Mô hình! Bạn cần hỗ trợ gì về MLOps & Dataset? 🎯",quickPrompts:["🏷️ Hướng dẫn dùng canvas SVG vẽ lại bounding box","🔄 Chu trình Active Learning bổ sung dữ liệu","📦 Cách xuất dataset chuẩn định dạng YOLO","🧪 Quy trình kiểm định và đối soát mô hình mới"]}};function L(g){if(!g)return"";let t=g.replace(/\[nguồn:\s*[^\]]+\]/gi,"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");t=t.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>"),t=t.replace(/`([^`]+)`/g,"<code>$1</code>");const a=t.split(`
`),r=[];let i=!1,n=!1;for(const o of a){const f=o.trim();if(f.startsWith("- ")||f.startsWith("* ")){n&&(r.push("</ol>"),n=!1),i||(r.push("<ul>"),i=!0),r.push(`<li>${f.substring(2)}</li>`);continue}const m=f.match(/^(\d+)\.\s+(.*)/);if(m){i&&(r.push("</ul>"),i=!1),n||(r.push("<ol>"),n=!0),r.push(`<li>${m[2]}</li>`);continue}i&&(r.push("</ul>"),i=!1),n&&(r.push("</ol>"),n=!1),f.length>0&&r.push(`<p>${o}</p>`)}return i&&r.push("</ul>"),n&&r.push("</ol>"),r.join("")}function S(){var e;if((e=window.FlareChatWidgetConfig)!=null&&e.apiUrl)return window.FlareChatWidgetConfig.apiUrl;const g=document.querySelectorAll("script");for(let t=0;t<g.length;t++){const a=g[t].src||"";if(a.includes("widget.js"))try{return`${new URL(a).origin}/api`}catch{}}return"http://localhost:8001/api"}function F(){var e,t;if((e=window.FlareChatWidgetConfig)!=null&&e.mascotUrl)return window.FlareChatWidgetConfig.mascotUrl;const g=document.querySelectorAll("script");for(let a=0;a<g.length;a++){const r=g[a].src||"";if(r.includes("widget.js"))try{return`${new URL(r).origin}/mascot_flare.webm`}catch{}}if((t=window.FlareChatWidgetConfig)!=null&&t.apiUrl)try{return`${new URL(window.FlareChatWidgetConfig.apiUrl).origin}/mascot_flare.webm`}catch{}return"/mascot_flare.webm"}function $(){var e,t;if((e=window.FlareChatWidgetConfig)!=null&&e.avatarUrl)return window.FlareChatWidgetConfig.avatarUrl;const g=document.querySelectorAll("script");for(let a=0;a<g.length;a++){const r=g[a].src||"";if(r.includes("widget.js"))try{return`${new URL(r).origin}/mascot_avatar.png`}catch{}}if((t=window.FlareChatWidgetConfig)!=null&&t.apiUrl)try{return`${new URL(window.FlareChatWidgetConfig.apiUrl).origin}/mascot_avatar.png`}catch{}return"/mascot_avatar.png"}let c=null;class M{constructor(e){s(this,"config");s(this,"container",null);s(this,"shadow",null);s(this,"isOpen",!1);s(this,"isFullscreen",!1);s(this,"isLoading",!1);s(this,"currentRole","guest");s(this,"currentUserId",null);s(this,"mascotUrl","");s(this,"mascotAvatarUrl","");s(this,"mascotLauncherElem",null);s(this,"mascotGreetingElem",null);s(this,"mascotPillsElem",null);s(this,"isMascotCollapsed",!1);s(this,"history",[]);s(this,"messagesContainer",null);s(this,"inputElem",null);s(this,"sendBtn",null);s(this,"micBtn",null);s(this,"voiceIndicatorElem",null);s(this,"recognition",null);s(this,"isListening",!1);s(this,"fabBtn",null);s(this,"fabBadge",null);s(this,"windowElem",null);s(this,"expandBtn",null);s(this,"subtitleElem",null);s(this,"wrapperElem",null);s(this,"themeObserver",null);var r,i,n,o;const t=((r=window.FlareChatWidgetConfig)==null?void 0:r.role)||(e==null?void 0:e.role)||"guest";this.currentRole=this.normalizeRole(t),this.currentUserId=((i=window.FlareChatWidgetConfig)==null?void 0:i.userId)||(e==null?void 0:e.userId)||null,this.currentRole==="guest"&&(this.currentUserId=null);const a=w[this.currentRole]||w.guest;this.mascotUrl=(e==null?void 0:e.mascotUrl)||((n=window.FlareChatWidgetConfig)==null?void 0:n.mascotUrl)||F(),this.mascotAvatarUrl=(e==null?void 0:e.avatarUrl)||((o=window.FlareChatWidgetConfig)==null?void 0:o.avatarUrl)||$(),this.config={apiUrl:S(),mascotUrl:this.mascotUrl,avatarUrl:this.mascotAvatarUrl,title:"Flare AI",subtitle:a.subtitle,placeholder:"Hỏi Flare AI...",quickPrompts:a.quickPrompts,...window.FlareChatWidgetConfig,...e},this.mount(),c=this}getAvatarHtml(){return`
      <video
        src="${this.mascotUrl||"/mascot_flare.webm"}"
        autoplay
        loop
        muted
        playsinline
        class="flare-avatar-mascot-video"
        aria-label="FLARE Mascot"
        onerror="this.style.display='none'; if (this.nextElementSibling) (this.nextElementSibling as HTMLElement).style.display='flex';"
      ></video>
      <div class="flare-avatar-fallback" style="display: none;">${C}</div>
    `}playAllVideos(e){const t=e||this.shadow;t&&t.querySelectorAll("video").forEach(a=>{a.paused&&a.play().catch(()=>{})})}normalizeRole(e){const t=(e||"").toLowerCase().trim();return t==="admin"||t==="admin_ops"?"admin_ops":t==="admin_model"?"admin_model":t==="user"?"user":"guest"}getStorageKey(){return!this.currentUserId||this.currentRole==="guest"?null:`flare_chat_history_${this.currentUserId}`}saveHistory(){const e=this.getStorageKey();if(e)try{localStorage.setItem(e,JSON.stringify(this.history))}catch{}}loadHistory(){if(!this.messagesContainer)return;this.messagesContainer.innerHTML="";const e=this.getStorageKey();let t=[];if(e)try{const a=localStorage.getItem(e);if(a){const r=JSON.parse(a);Array.isArray(r)&&(t=r)}}catch{t=[]}if(this.history=t,this.renderInitialGreeting(),t.length>0)for(const a of t)a.role==="user"?this.appendUserMessage(a.content):a.role==="assistant"&&this.appendAssistantMessage(a.content,[],null,!1);this.playAllVideos()}setRole(e,t=null){const a=this.normalizeRole(e),r=a==="guest"?null:t?String(t):this.currentUserId,i=this.currentRole!==a||this.currentUserId!==r;this.currentRole=a,this.currentUserId=r;const n=w[a]||w.guest;this.config.subtitle=n.subtitle,this.config.quickPrompts=n.quickPrompts,this.subtitleElem&&(this.subtitleElem.textContent=n.subtitle),this.mascotGreetingElem&&(this.mascotGreetingElem.textContent=n.greeting),this.mascotPillsElem&&(this.mascotPillsElem.innerHTML=n.quickPrompts.map(o=>`<button class="flare-mascot-pill" data-prompt="${o}">${o}</button>`).join(""),this.bindMascotPills()),i&&this.loadHistory()}static setRole(e,t=null){if(c)c.setRole(e,t);else{const a=(e||"").toLowerCase().trim();window.FlareChatWidgetConfig={...window.FlareChatWidgetConfig,role:a,userId:e==="guest"?null:t?String(t):null}}}static open(){c==null||c.open()}static close(){c==null||c.close()}static toggle(){c==null||c.toggle()}static clear(){c==null||c.clear()}static getInstance(){return c}init(e){e&&(e.role&&this.setRole(e.role),this.config={...this.config,...e})}open(){var e,t;this.isOpen||(this.isOpen=!0,(e=this.windowElem)==null||e.classList.add("active"),(t=this.mascotLauncherElem)==null||t.classList.add("hidden"),this.playAllVideos(),setTimeout(()=>{var a;(a=this.inputElem)==null||a.focus(),this.scrollToBottom(),this.playAllVideos()},250))}close(){var e,t;this.isOpen&&(this.isOpen=!1,(e=this.windowElem)==null||e.classList.remove("active"),(t=this.mascotLauncherElem)==null||t.classList.remove("hidden"))}toggle(){this.isOpen?this.close():this.open()}toggleFullscreen(){var e,t;this.isFullscreen=!this.isFullscreen,this.isFullscreen?(e=this.windowElem)==null||e.classList.add("fullscreen"):(t=this.windowElem)==null||t.classList.remove("fullscreen"),this.scrollToBottom()}clear(){this.history=[];const e=this.getStorageKey();if(e)try{localStorage.removeItem(e)}catch{}this.messagesContainer&&(this.messagesContainer.innerHTML="",this.renderInitialGreeting())}mount(){if(document.getElementById("flare-rag-widget-root"))return;this.container=document.createElement("div"),this.container.id="flare-rag-widget-root",document.body.appendChild(this.container),this.shadow=this.container.attachShadow({mode:"open"});const e=document.createElement("style");e.textContent=E,this.shadow.appendChild(e);const t=w[this.currentRole]||w.guest,a=document.createElement("div");a.className="flare-wrapper",this.wrapperElem=a,a.innerHTML=`
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
            ${t.greeting}
          </div>
        </div>

        <!-- 2. Danh Sách Câu Hỏi Nhanh Xếp Dọc Nổi Lơ Lửng -->
        <div class="flare-mascot-pills" id="flare-mascot-pills">
          ${t.quickPrompts.map(r=>`<button class="flare-mascot-pill" data-prompt="${r}">${r}</button>`).join("")}
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
                <span id="flare-header-subtitle-text">${t.subtitle}</span>
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
              ${H}
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
    `,this.shadow.appendChild(a),this.mascotLauncherElem=this.shadow.getElementById("flare-mascot-launcher"),this.mascotGreetingElem=this.shadow.getElementById("flare-mascot-greeting-text"),this.mascotPillsElem=this.shadow.getElementById("flare-mascot-pills"),this.windowElem=this.shadow.getElementById("flare-window"),this.messagesContainer=this.shadow.getElementById("flare-messages"),this.inputElem=this.shadow.getElementById("flare-input"),this.sendBtn=this.shadow.getElementById("flare-btn-send"),this.micBtn=this.shadow.getElementById("flare-btn-mic"),this.voiceIndicatorElem=this.shadow.getElementById("flare-voice-indicator"),this.expandBtn=this.shadow.getElementById("flare-btn-expand"),this.subtitleElem=this.shadow.getElementById("flare-header-subtitle-text"),this.bindEvents(),this.loadHistory(),this.syncTheme();try{this.themeObserver=new MutationObserver(()=>{this.syncTheme()}),this.themeObserver.observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme"]})}catch{}}syncTheme(){const e=document.documentElement.getAttribute("data-theme")==="light";this.container&&(this.container.classList.toggle("theme-light",e),this.container.setAttribute("data-theme",e?"light":"dark")),this.wrapperElem&&this.wrapperElem.classList.toggle("theme-light",e)}renderInitialGreeting(){if(!this.messagesContainer)return;const e=w[this.currentRole]||w.guest,t=document.createElement("div");t.className="flare-msg assistant",t.innerHTML=`
      <div class="flare-msg-avatar">${this.getAvatarHtml()}</div>
      <div class="flare-msg-bubble">
        <p>Xin chào, mình là trợ lý ảo <strong>Flare AI</strong> 👋</p>
      </div>
    `,this.messagesContainer.appendChild(t),this.playAllVideos(t);const a=document.createElement("div");a.className="flare-msg assistant",a.innerHTML=`
      <div class="flare-msg-avatar" style="visibility: hidden;">${this.getAvatarHtml()}</div>
      <div class="flare-msg-bubble">
        <p>${e.greeting}</p>
      </div>
    `,this.messagesContainer.appendChild(a),this.playAllVideos(a);const r=document.createElement("div");r.className="flare-suggestions-group",r.innerHTML=e.quickPrompts.map(i=>`<button class="flare-suggest-pill" data-prompt="${i}">${i}</button>`).join(""),this.messagesContainer.appendChild(r),r.querySelectorAll(".flare-suggest-pill").forEach(i=>{i.addEventListener("click",()=>{const n=i.getAttribute("data-prompt");n&&this.handleSend(n)})}),this.scrollToBottom()}bindMascotPills(){this.mascotPillsElem&&this.mascotPillsElem.querySelectorAll(".flare-mascot-pill").forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();const a=e.getAttribute("data-prompt");a&&(this.open(),this.handleSend(a))})})}setupMascotDrag(){var k;const e=this.mascotLauncherElem,t=(k=this.shadow)==null?void 0:k.getElementById("flare-mascot-character");if(!e||!t)return;try{const l=localStorage.getItem("flare_mascot_pos");if(l){const p=JSON.parse(l);if(typeof p.bottom=="number"&&typeof p.left=="number"){const u=Math.max(16,Math.min(window.innerWidth-150,p.left)),d=Math.max(16,Math.min(window.innerHeight-150,p.bottom));e.style.left=`${u}px`,e.style.bottom=`${d}px`,e.style.right="auto",e.style.top="auto",u<window.innerWidth/2?e.classList.add("is-left"):e.classList.remove("is-left")}else localStorage.removeItem("flare_mascot_pos")}}catch{}let a=!1,r=!1,i=0,n=0,o=0,f=0;const m=l=>{if("button"in l&&l.button!==0)return;a=!0,r=!1;const p="clientX"in l?l.clientX:l.touches[0].clientX,u="clientY"in l?l.clientY:l.touches[0].clientY;i=p,n=u;const d=e.getBoundingClientRect();o=d.left,f=window.innerHeight-d.bottom,e.style.transition="none",t.classList.add("is-dragging"),window.addEventListener("mousemove",h,{passive:!1}),window.addEventListener("mouseup",v),window.addEventListener("touchmove",h,{passive:!1}),window.addEventListener("touchend",v)},h=l=>{if(!a)return;const p="clientX"in l?l.clientX:l.touches[0].clientX,u="clientY"in l?l.clientY:l.touches[0].clientY,d=p-i,b=u-n;if(!r&&Math.hypot(d,b)>4&&(r=!0),r){l.cancelable&&l.preventDefault();const y=e.getBoundingClientRect(),z=y.width||140,U=y.height||140,A=16,R=Math.max(A,window.innerWidth-z-16),T=16,W=Math.max(T,window.innerHeight-U-16),I=Math.max(A,Math.min(R,o+d)),N=Math.max(T,Math.min(W,f-b));e.style.left=`${I}px`,e.style.bottom=`${N}px`,e.style.right="auto",e.style.top="auto",I<window.innerWidth/2?e.classList.add("is-left"):e.classList.remove("is-left")}},v=()=>{if(a)if(a=!1,t.classList.remove("is-dragging"),e.style.transition="",window.removeEventListener("mousemove",h),window.removeEventListener("mouseup",v),window.removeEventListener("touchmove",h),window.removeEventListener("touchend",v),r)try{const l=e.getBoundingClientRect(),p=window.innerHeight-l.bottom;localStorage.setItem("flare_mascot_pos",JSON.stringify({left:Math.round(l.left),bottom:Math.round(Math.max(16,p))}))}catch{}else this.open()};t.addEventListener("mousedown",m),t.addEventListener("touchstart",m,{passive:!0})}bindEvents(){var t,a,r,i,n,o,f,m,h,v,k,l,p,u;this.setupMascotDrag(),(a=(t=this.shadow)==null?void 0:t.getElementById("flare-mascot-bubble"))==null||a.addEventListener("click",()=>this.open());const e=(r=this.shadow)==null?void 0:r.getElementById("flare-mascot-toggle-btn");e==null||e.addEventListener("click",d=>{var b,y;d.stopPropagation(),this.isMascotCollapsed=!this.isMascotCollapsed,this.isMascotCollapsed?(b=this.mascotLauncherElem)==null||b.classList.add("collapsed"):(y=this.mascotLauncherElem)==null||y.classList.remove("collapsed")}),this.bindMascotPills(),(i=this.fabBtn)==null||i.addEventListener("click",()=>this.toggle()),(n=this.fabBadge)==null||n.addEventListener("click",()=>this.open()),(f=(o=this.shadow)==null?void 0:o.getElementById("flare-btn-close"))==null||f.addEventListener("click",()=>this.close()),(h=(m=this.shadow)==null?void 0:m.getElementById("flare-btn-clear"))==null||h.addEventListener("click",()=>this.clear()),(v=this.expandBtn)==null||v.addEventListener("click",()=>this.toggleFullscreen()),(k=this.inputElem)==null||k.addEventListener("input",()=>{!this.inputElem||!this.sendBtn||(this.inputElem.style.height="auto",this.inputElem.style.height=Math.min(this.inputElem.scrollHeight,100)+"px",this.sendBtn.disabled=!this.inputElem.value.trim()||this.isLoading)}),(l=this.inputElem)==null||l.addEventListener("keydown",d=>{var b;if(d.key==="Enter"&&!d.shiftKey){d.preventDefault();const y=(b=this.inputElem)==null?void 0:b.value.trim();y&&!this.isLoading&&this.handleSend(y)}}),(p=this.sendBtn)==null||p.addEventListener("click",()=>{var b;const d=(b=this.inputElem)==null?void 0:b.value.trim();d&&!this.isLoading&&this.handleSend(d)}),(u=this.micBtn)==null||u.addEventListener("click",()=>this.toggleListening()),this.initSpeechRecognition()}initSpeechRecognition(){const e=window.SpeechRecognition||window.webkitSpeechRecognition;if(!e){this.micBtn&&(this.micBtn.title="Trình duyệt không hỗ trợ nhận diện giọng nói (Khuyên dùng Chrome hoặc Edge)",this.micBtn.style.opacity="0.5");return}try{this.recognition=new e,this.recognition.lang="vi-VN",this.recognition.continuous=!1,this.recognition.interimResults=!0,this.recognition.maxAlternatives=1,this.recognition.onstart=()=>{var t,a;this.isListening=!0,(t=this.micBtn)==null||t.classList.add("is-listening"),(a=this.voiceIndicatorElem)==null||a.classList.add("active"),this.inputElem&&(this.inputElem.placeholder="Đang lắng nghe... (Nói lệnh hoặc câu hỏi)")},this.recognition.onresult=t=>{let a="",r="";for(let n=t.resultIndex;n<t.results.length;++n){const o=t.results[n][0].transcript;t.results[n].isFinal?r+=o:a+=o}const i=r||a;if(this.inputElem&&i&&(this.inputElem.value=i,this.inputElem.style.height="auto",this.inputElem.style.height=Math.min(this.inputElem.scrollHeight,100)+"px",this.inputElem.dispatchEvent(new Event("input"))),r.trim()){const n=r.trim();this.stopListening(),setTimeout(()=>{this.handleSend(n)},350)}},this.recognition.onerror=t=>{console.warn("[FlareChatWidget] Speech Recognition Error:",t.error),this.stopListening(),t.error==="not-allowed"&&alert("Vui lòng cấp quyền Microphone trên trình duyệt để sử dụng tính năng Ra lệnh giọng nói.")},this.recognition.onend=()=>{this.stopListening()}}catch(t){console.warn("[FlareChatWidget] Lỗi khởi tạo SpeechRecognition:",t)}}toggleListening(){if(!this.recognition){alert("Trình duyệt của bạn chưa hỗ trợ Web Speech API. Hãy mở trên Google Chrome hoặc Microsoft Edge để trải nghiệm.");return}if(this.isListening)this.recognition.stop(),this.stopListening();else{this.inputElem&&(this.inputElem.value="",this.inputElem.style.height="auto");try{this.recognition.start()}catch(e){console.warn("[FlareChatWidget] Lỗi start speech recognition:",e)}}}stopListening(){var e,t;this.isListening=!1,(e=this.micBtn)==null||e.classList.remove("is-listening"),(t=this.voiceIndicatorElem)==null||t.classList.remove("active"),this.inputElem&&(this.inputElem.placeholder=this.config.placeholder||"Hỏi Flare AI...")}async handleSend(e){var r;const t=(e!==void 0?e:((r=this.inputElem)==null?void 0:r.value)||"").trim();if(!t||this.isLoading)return;this.inputElem&&(this.inputElem.value="",this.inputElem.style.height="auto"),this.sendBtn&&(this.sendBtn.disabled=!0),this.appendUserMessage(t),this.isLoading=!0;const a=this.showTypingIndicator();try{const i=await x(this.config.apiUrl||"http://localhost:8001/api",t,this.history,this.currentRole);a.remove();let n=i.action||null;n||(n=this.detectClientAction(t)),this.appendAssistantMessage(i.answer,i.sources||[],n,!0),this.history.push({role:"user",content:t}),this.history.push({role:"assistant",content:i.answer}),this.history=this.history.slice(-20),this.saveHistory()}catch(i){a.remove();const n=i instanceof Error?i.message:"Đã có lỗi xảy ra.";this.appendAssistantMessage(`⚠️ **Không thể kết nối tới máy chủ Flare AI**

Chi tiết: ${n}

*Gợi ý: Hãy đảm bảo Backend RAG đang hoạt động tại ${this.config.apiUrl}*`,[],null,!1)}finally{this.isLoading=!1,this.inputElem&&(this.inputElem.disabled=!1,this.inputElem.focus()),this.sendBtn&&this.inputElem&&(this.sendBtn.disabled=!this.inputElem.value.trim()),this.scrollToBottom()}}appendUserMessage(e){if(!this.messagesContainer)return;const t=document.createElement("div");t.className="flare-msg user",t.innerHTML=`
      <div class="flare-msg-avatar">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      </div>
      <div class="flare-msg-bubble">${L(e)}</div>
    `,this.messagesContainer.appendChild(t),this.scrollToBottom()}dispatchWebAction(e){try{window.dispatchEvent(new CustomEvent("flare-action",{detail:e,bubbles:!0,composed:!0}))}catch(t){console.warn("[FlareChatWidget] Không thể dispatch flare-action:",t)}}detectClientAction(e){const t=e.toLowerCase();if(t.match(/(?:thêm|tạo|nhập|đưa|kết nối|add)\s+(?:camera|cam|ip)/i)||t.match(/(?:camera|cam)\s+(?:với\s+)?ip/i)||t.match(/nhập\s+ip\s+cam/i)){const r=e.match(/(?:https?:\/\/)?((?:\d{1,3}\.){3}\d{1,3}(?::\d+)?(?:\/[^\s]*)?)/);let i="";if(r){let h=r[0].trim();!h.startsWith("http://")&&!h.startsWith("https://")&&!h.startsWith("rtsp://")?i=`http://${h}${h.includes("/")?"":"/video"}`:i=h}let n="",o="Camera IP mới";const f=e.match(/(?:phòng\s+ngủ|phòng\s+khách|nhà\s+bếp|khu\s+vực\s+bếp|bếp|bãi\s+xe|hầm\s+xe|sân\s+thượng|hành\s+lang|kho\s+hàng|cửa\s+chính)/i);if(f){const h=f[0].trim();n=h.charAt(0).toUpperCase()+h.slice(1),o=`Camera ${n}`}return{action:"ADD_CAMERA",label:`Mở form thêm Camera ${n?`(${n})`:i?`(${i.replace(/^https?:\/\//,"").split("/")[0]})`:""}`.trim(),params:{stream_url:i,name:o,location:n}}}return t.includes("webcam")||t.includes("cam laptop")||t.includes("cam trực tiếp")?{action:"TOGGLE_WEBCAM",label:"Chuyển sang Webcam trực tiếp",params:{state:"start",tab:"realtime"}}:t.includes("danh sách camera")||t.includes("xem camera")||t.includes("màn hình camera")||t.includes("trang camera")||t.includes("mở camera")?{action:"NAVIGATE",label:"Mở trang Camera giám sát",params:{tab:"cameras"}}:t.includes("video của tôi")||t.includes("tải video")||t.includes("upload video")||t.includes("phân tích video")?{action:"NAVIGATE",label:"Mở trang Video tải lên",params:{tab:"videos"}}:t.includes("kết nối zalo")||t.includes("bot zalo")||t.includes("cài zalo")||t.includes("thông tin cá nhân")?{action:"CONNECT_ZALO",label:"Mở trang Hồ sơ & Kết nối Zalo",params:{tab:"profile"}}:t.includes("sự kiện")||t.includes("lịch sử cảnh báo")||t.includes("nhật ký")?{action:"NAVIGATE",label:"Xem Sự kiện cảnh báo",params:{tab:"events"}}:null}appendAssistantMessage(e,t=[],a,r=!0){if(!this.messagesContainer)return;const i=document.createElement("div");i.className="flare-msg assistant";let n="";if(a&&(n=`
        <div class="flare-action-card">
          <div class="flare-action-badge">
            <svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            <span>Tương tác hệ thống</span>
          </div>
          <button class="flare-action-btn" type="button" title="Bấm để kích hoạt trên giao diện">
            <svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            <span>${a.label||"Thực hiện thao tác trên web"}</span>
          </button>
        </div>
      `),!r||e.length<5){i.innerHTML=`
        <div class="flare-msg-avatar">
          ${this.getAvatarHtml()}
        </div>
        <div class="flare-msg-bubble">
          ${L(e)}
          ${n}
        </div>
      `,this.bindActionCardButton(i,a),this.messagesContainer.appendChild(i),this.playAllVideos(i),this.scrollToBottom();return}i.innerHTML=`
      <div class="flare-msg-avatar">
        ${this.getAvatarHtml()}
      </div>
      <div class="flare-msg-bubble">
        <div class="flare-msg-content"></div>
        <span class="flare-cursor"></span>
      </div>
    `,this.messagesContainer.appendChild(i),this.playAllVideos(i),this.scrollToBottom();const o=i.querySelector(".flare-msg-content"),f=i.querySelector(".flare-cursor"),m=i.querySelector(".flare-msg-bubble");let h=0;const v=e.length,k=Math.max(2,Math.min(6,Math.floor(v/120))),l=16;let p=!1;const u=()=>{p||(p=!0,clearInterval(d),f&&f.remove(),m&&(m.innerHTML=`${L(e)}${n}`,this.bindActionCardButton(i,a)),this.scrollToBottom(),a&&this.dispatchWebAction(a))};m==null||m.addEventListener("click",()=>u(),{once:!0});const d=setInterval(()=>{h+=k,h>=v?u():(o&&(o.innerHTML=L(e.slice(0,h))),this.scrollToBottom())},l)}bindActionCardButton(e,t){if(!t)return;const a=e.querySelector(".flare-action-btn");a&&a.addEventListener("click",()=>{this.dispatchWebAction(t),a.classList.add("is-executed"),a.innerHTML=`
        <svg viewBox="0 0 24 24" style="stroke: #86efac"><polyline points="20 6 9 17 4 12"/></svg>
        <span>Đã kích hoạt trên web!</span>
      `,setTimeout(()=>{a.classList.remove("is-executed"),a.innerHTML=`
          <svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          <span>${t.label||"Kích hoạt lại thao tác"}</span>
        `},3e3)})}showTypingIndicator(){var t;const e=document.createElement("div");return e.className="flare-typing",e.innerHTML=`
      <div class="flare-typing-dot"></div>
      <div class="flare-typing-dot"></div>
      <div class="flare-typing-dot"></div>
    `,(t=this.messagesContainer)==null||t.appendChild(e),this.scrollToBottom(),e}scrollToBottom(){this.messagesContainer&&requestAnimationFrame(()=>{setTimeout(()=>{this.messagesContainer&&(this.messagesContainer.scrollTop=this.messagesContainer.scrollHeight)},30)})}}function B(){if(c||(c=new M),window.flareWidgetInstance=c,window.flareWidget=c,window.FlareChatWidget=M,window.FlareChatWidgetConfig){const g=window.FlareChatWidgetConfig.role,e=window.FlareChatWidgetConfig.userId;g&&c.setRole(g,e)}}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",B):B(),M}();
