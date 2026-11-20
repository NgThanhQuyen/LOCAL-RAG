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

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Tooltip Badge "🔥 Hỏi Flare AI" */
.flare-fab-badge {
  position: fixed;
  bottom: 30px;
  right: 92px;
  background: var(--flare-bg-panel);
  color: var(--flare-text);
  border: 1px solid rgba(255, 87, 34, 0.5);
  padding: 9px 16px;
  border-radius: 30px;
  font-size: 13.5px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5), 0 0 14px rgba(255, 87, 34, 0.3);
  cursor: pointer;
  z-index: 2147483647;
  white-space: nowrap;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  animation: badge-float 3s ease-in-out infinite;
}

.flare-fab-badge:hover {
  transform: translateY(-2px) scale(1.04);
  border-color: var(--flare-primary);
  box-shadow: 0 8px 26px rgba(255, 87, 34, 0.5);
}

.flare-fab-badge.hidden {
  opacity: 0;
  transform: translateX(14px) scale(0.85);
  pointer-events: none;
}

.flare-badge-icon {
  font-size: 16px;
  display: inline-flex;
  align-items: center;
  animation: flame-flicker 1.8s infinite ease-in-out;
}

@keyframes badge-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

@keyframes flame-flicker {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.15) rotate(4deg); }
}

/* Nút bấm tròn hình Ngọn lửa (FAB) */
.flare-fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff5722 0%, #e64a19 100%);
  color: #ffffff;
  border: none;
  cursor: pointer;
  box-shadow: 0 8px 28px rgba(255, 87, 34, 0.55), 0 0 0 2px rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2147483647;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.flare-fab:hover {
  transform: translateY(-3px) scale(1.06);
  box-shadow: 0 12px 34px rgba(255, 87, 34, 0.7), 0 0 20px rgba(255, 87, 34, 0.75);
}

.flare-fab:active {
  transform: translateY(0) scale(0.96);
}

.flare-fab svg {
  width: 30px;
  height: 30px;
  fill: currentColor;
  transition: all 0.3s ease;
}

.flare-fab.open svg.icon-flame {
  display: none;
}

.flare-fab:not(.open) svg.icon-close {
  display: none;
}

.flare-fab-pulse {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid rgba(255, 87, 34, 0.85);
  animation: pulse-ring 2.4s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
  pointer-events: none;
}

@keyframes pulse-ring {
  0% { transform: scale(0.95); opacity: 0.85; }
  50% { transform: scale(1.4); opacity: 0; }
  100% { transform: scale(1.4); opacity: 0; }
}

/* Khung cửa sổ Chat — Mở rộng rộng rãi hơn (440px) */
.flare-window {
  position: fixed;
  bottom: 94px;
  right: 24px;
  width: 440px;
  max-width: calc(100vw - 32px);
  height: 620px;
  max-height: calc(100vh - 115px);
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
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(255, 87, 34, 0.25), rgba(216, 67, 21, 0.45));
  border: 1px solid rgba(255, 87, 34, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff5722;
  box-shadow: 0 0 12px rgba(255, 87, 34, 0.35);
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
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 15px;
}

.flare-msg.assistant .flare-msg-avatar {
  background: linear-gradient(135deg, rgba(255, 87, 34, 0.2), rgba(216, 67, 21, 0.4));
  border: 1px solid rgba(255, 87, 34, 0.45);
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
