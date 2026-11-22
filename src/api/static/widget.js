var N=Object.defineProperty;var P=(v,m,E)=>m in v?N(v,m,{enumerable:!0,configurable:!0,writable:!0,value:E}):v[m]=E;var l=(v,m,E)=>P(v,typeof m!="symbol"?m+"":m,E);this.FlareChatWidget=function(){"use strict";const v=`
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

/* Video Mascot trong Header và Avatar tin nhắn */
.flare-header-avatar video,
.flare-msg-avatar video {
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
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
`;async function m(h,e,t=[],a="guest"){const i=`${h.replace(/\/+$/,"")}/chat`,r=await fetch(i,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({question:e,history:t,role:a})});if(!r.ok){let s=`Lỗi máy chủ (${r.status})`;try{const g=await r.json();g.detail&&(s=g.detail)}catch{}throw new Error(s)}return r.json()}const E=`
<svg class="icon-flame" viewBox="0 0 24 24" fill="currentColor">
  <path d="M12 23c-4.97 0-9-3.96-9-8.83 0-3.9 2.53-7.58 4.67-9.84.41-.44 1.12-.34 1.39.2 1.09 2.18 2.52 3.82 3.94 4.54.42.21.92-.08.95-.55.15-2.26 1.4-5.4 3.95-7.46.46-.37 1.15-.05 1.17.54.12 3.52 1.39 6.27 3.01 7.82 1.25 1.19 1.92 2.62 1.92 4.58 0 4.87-4.03 8.83-9 8.83z"/>
</svg>
`,u={guest:{subtitle:"Khách vãng lai",greeting:"Bạn cần mình hỗ trợ gì về kỹ năng an toàn PCCC & thoát hiểm ạ? 😊",quickPrompts:["🚨 Kỹ năng thoát hiểm khi có khói độc","🧯 Cách sử dụng bình chữa cháy CO2 và bột","📞 Khi phát hiện cháy cần gọi số nào?","ℹ️ Giới thiệu hệ thống cảnh báo cháy FLARE"]},user:{subtitle:"Người dùng hệ thống",greeting:"Chào bạn! Bạn cần hỗ trợ gì về sử dụng FLARE hoặc an toàn PCCC? 😊",quickPrompts:["📷 Cách biến điện thoại thành camera giám sát","📱 Hướng dẫn kết nối Bot Zalo nhận cảnh báo","📹 Cách bật webcam laptop phát hiện cháy","❓ Cách gửi phản hồi khi hệ thống nhận diện sai","🚨 Kỹ năng thoát hiểm khi có khói"]},admin_ops:{subtitle:"Quản trị Vận hành",greeting:"Chào Quản trị viên Vận hành! Bạn cần hỗ trợ gì về tác vụ hệ thống? ⚡",quickPrompts:["📊 Cách giám sát phiên cảnh báo realtime hệ thống","👥 Quy trình quản lý và duyệt tài khoản người dùng","📋 Cách xem báo cáo đánh giá sự cố hỏa hoạn","⚙️ Hướng dẫn lệnh CLI tạo tài khoản quản trị"]},admin:{subtitle:"Quản trị Vận hành",greeting:"Chào Quản trị viên Vận hành! Bạn cần hỗ trợ gì về tác vụ hệ thống? ⚡",quickPrompts:["📊 Cách giám sát phiên cảnh báo realtime hệ thống","👥 Quy trình quản lý và duyệt tài khoản người dùng","📋 Cách xem báo cáo đánh giá sự cố hỏa hoạn","⚙️ Hướng dẫn lệnh CLI tạo tài khoản quản trị"]},admin_model:{subtitle:"Quản trị Mô hình AI",greeting:"Chào Quản trị viên Mô hình! Bạn cần hỗ trợ gì về MLOps & Dataset? 🎯",quickPrompts:["🏷️ Hướng dẫn dùng canvas SVG vẽ lại bounding box","🔄 Chu trình Active Learning bổ sung dữ liệu","📦 Cách xuất dataset chuẩn định dạng YOLO","🧪 Quy trình kiểm định và đối soát mô hình mới"]}};function k(h){if(!h)return"";let t=h.replace(/\[nguồn:\s*[^\]]+\]/gi,"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");t=t.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>"),t=t.replace(/`([^`]+)`/g,"<code>$1</code>");const a=t.split(`
`),i=[];let r=!1,s=!1;for(const g of a){const p=g.trim();if(p.startsWith("- ")||p.startsWith("* ")){s&&(i.push("</ol>"),s=!1),r||(i.push("<ul>"),r=!0),i.push(`<li>${p.substring(2)}</li>`);continue}const b=p.match(/^(\d+)\.\s+(.*)/);if(b){r&&(i.push("</ul>"),r=!1),s||(i.push("<ol>"),s=!0),i.push(`<li>${b[2]}</li>`);continue}r&&(i.push("</ul>"),r=!1),s&&(i.push("</ol>"),s=!1),p.length>0&&i.push(`<p>${g}</p>`)}return r&&i.push("</ul>"),s&&i.push("</ol>"),i.join("")}function z(){var e;if((e=window.FlareChatWidgetConfig)!=null&&e.apiUrl)return window.FlareChatWidgetConfig.apiUrl;const h=document.querySelectorAll("script");for(let t=0;t<h.length;t++){const a=h[t].src||"";if(a.includes("widget.js"))try{return`${new URL(a).origin}/api`}catch{}}return"http://localhost:8001/api"}function F(){var e,t;if((e=window.FlareChatWidgetConfig)!=null&&e.mascotUrl)return window.FlareChatWidgetConfig.mascotUrl;const h=document.querySelectorAll("script");for(let a=0;a<h.length;a++){const i=h[a].src||"";if(i.includes("widget.js"))try{return`${new URL(i).origin}/mascot_flare.webm`}catch{}}if((t=window.FlareChatWidgetConfig)!=null&&t.apiUrl)try{return`${new URL(window.FlareChatWidgetConfig.apiUrl).origin}/mascot_flare.webm`}catch{}return"/mascot_flare.webm"}let o=null;class L{constructor(e){l(this,"config");l(this,"container",null);l(this,"shadow",null);l(this,"isOpen",!1);l(this,"isFullscreen",!1);l(this,"isLoading",!1);l(this,"currentRole","guest");l(this,"currentUserId",null);l(this,"mascotUrl","");l(this,"mascotLauncherElem",null);l(this,"mascotGreetingElem",null);l(this,"mascotPillsElem",null);l(this,"isMascotCollapsed",!1);l(this,"history",[]);l(this,"messagesContainer",null);l(this,"inputElem",null);l(this,"sendBtn",null);l(this,"fabBtn",null);l(this,"fabBadge",null);l(this,"windowElem",null);l(this,"expandBtn",null);l(this,"subtitleElem",null);var i,r,s;const t=((i=window.FlareChatWidgetConfig)==null?void 0:i.role)||(e==null?void 0:e.role)||"guest";this.currentRole=this.normalizeRole(t),this.currentUserId=((r=window.FlareChatWidgetConfig)==null?void 0:r.userId)||(e==null?void 0:e.userId)||null,this.currentRole==="guest"&&(this.currentUserId=null);const a=u[this.currentRole]||u.guest;this.mascotUrl=(e==null?void 0:e.mascotUrl)||((s=window.FlareChatWidgetConfig)==null?void 0:s.mascotUrl)||F(),this.config={apiUrl:z(),mascotUrl:this.mascotUrl,title:"Flare AI",subtitle:a.subtitle,placeholder:"Hỏi Flare AI...",quickPrompts:a.quickPrompts,...window.FlareChatWidgetConfig,...e},this.mount(),o=this}getAvatarHtml(){return this.mascotUrl?`<video class="flare-avatar-mascot-video" src="${this.mascotUrl}" autoplay loop muted playsinline></video>`:E}normalizeRole(e){const t=(e||"").toLowerCase().trim();return t==="admin"||t==="admin_ops"?"admin_ops":t==="admin_model"?"admin_model":t==="user"?"user":"guest"}getStorageKey(){return!this.currentUserId||this.currentRole==="guest"?null:`flare_chat_history_${this.currentUserId}`}saveHistory(){const e=this.getStorageKey();if(e)try{localStorage.setItem(e,JSON.stringify(this.history))}catch{}}loadHistory(){if(!this.messagesContainer)return;this.messagesContainer.innerHTML="";const e=this.getStorageKey();let t=[];if(e)try{const a=localStorage.getItem(e);if(a){const i=JSON.parse(a);Array.isArray(i)&&(t=i)}}catch{t=[]}if(this.history=t,this.renderInitialGreeting(),t.length>0)for(const a of t)a.role==="user"?this.appendUserMessage(a.content):a.role==="assistant"&&this.appendAssistantMessage(a.content)}setRole(e,t=null){const a=this.normalizeRole(e),i=a==="guest"?null:t?String(t):this.currentUserId,r=this.currentRole!==a||this.currentUserId!==i;this.currentRole=a,this.currentUserId=i;const s=u[a]||u.guest;this.config.subtitle=s.subtitle,this.config.quickPrompts=s.quickPrompts,this.subtitleElem&&(this.subtitleElem.textContent=s.subtitle),this.mascotGreetingElem&&(this.mascotGreetingElem.textContent=s.greeting),this.mascotPillsElem&&(this.mascotPillsElem.innerHTML=s.quickPrompts.map(g=>`<button class="flare-mascot-pill" data-prompt="${g}">${g}</button>`).join(""),this.bindMascotPills()),r&&this.loadHistory()}static setRole(e,t=null){if(o)o.setRole(e,t);else{const a=(e||"").toLowerCase().trim();window.FlareChatWidgetConfig={...window.FlareChatWidgetConfig,role:a,userId:e==="guest"?null:t?String(t):null}}}static open(){o==null||o.open()}static close(){o==null||o.close()}static toggle(){o==null||o.toggle()}static clear(){o==null||o.clear()}static getInstance(){return o}init(e){e&&(e.role&&this.setRole(e.role),this.config={...this.config,...e})}open(){var e,t;this.isOpen||(this.isOpen=!0,(e=this.windowElem)==null||e.classList.add("active"),(t=this.mascotLauncherElem)==null||t.classList.add("hidden"),setTimeout(()=>{var a;(a=this.inputElem)==null||a.focus(),this.scrollToBottom()},250))}close(){var e,t;this.isOpen&&(this.isOpen=!1,(e=this.windowElem)==null||e.classList.remove("active"),(t=this.mascotLauncherElem)==null||t.classList.remove("hidden"))}toggle(){this.isOpen?this.close():this.open()}toggleFullscreen(){var e,t;this.isFullscreen=!this.isFullscreen,this.isFullscreen?(e=this.windowElem)==null||e.classList.add("fullscreen"):(t=this.windowElem)==null||t.classList.remove("fullscreen"),this.scrollToBottom()}clear(){this.history=[];const e=this.getStorageKey();if(e)try{localStorage.removeItem(e)}catch{}this.messagesContainer&&(this.messagesContainer.innerHTML="",this.renderInitialGreeting())}mount(){if(document.getElementById("flare-rag-widget-root"))return;this.container=document.createElement("div"),this.container.id="flare-rag-widget-root",document.body.appendChild(this.container),this.shadow=this.container.attachShadow({mode:"open"});const e=document.createElement("style");e.textContent=v,this.shadow.appendChild(e);const t=u[this.currentRole]||u.guest,a=document.createElement("div");a.innerHTML=`
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
          ${t.quickPrompts.map(i=>`<button class="flare-mascot-pill" data-prompt="${i}">${i}</button>`).join("")}
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
    `,this.shadow.appendChild(a),this.mascotLauncherElem=this.shadow.getElementById("flare-mascot-launcher"),this.mascotGreetingElem=this.shadow.getElementById("flare-mascot-greeting-text"),this.mascotPillsElem=this.shadow.getElementById("flare-mascot-pills"),this.windowElem=this.shadow.getElementById("flare-window"),this.messagesContainer=this.shadow.getElementById("flare-messages"),this.inputElem=this.shadow.getElementById("flare-input"),this.sendBtn=this.shadow.getElementById("flare-btn-send"),this.expandBtn=this.shadow.getElementById("flare-btn-expand"),this.subtitleElem=this.shadow.getElementById("flare-header-subtitle-text"),this.bindEvents(),this.loadHistory()}renderInitialGreeting(){if(!this.messagesContainer)return;const e=u[this.currentRole]||u.guest,t=document.createElement("div");t.className="flare-msg assistant",t.innerHTML=`
      <div class="flare-msg-avatar">${this.getAvatarHtml()}</div>
      <div class="flare-msg-bubble">
        <p>Xin chào, mình là trợ lý ảo <strong>Flare AI</strong> 👋</p>
      </div>
    `,this.messagesContainer.appendChild(t);const a=document.createElement("div");a.className="flare-msg assistant",a.innerHTML=`
      <div class="flare-msg-avatar" style="visibility: hidden;">${this.getAvatarHtml()}</div>
      <div class="flare-msg-bubble">
        <p>${e.greeting}</p>
      </div>
    `,this.messagesContainer.appendChild(a);const i=document.createElement("div");i.className="flare-suggestions-group",i.innerHTML=e.quickPrompts.map(r=>`<button class="flare-suggest-pill" data-prompt="${r}">${r}</button>`).join(""),this.messagesContainer.appendChild(i),i.querySelectorAll(".flare-suggest-pill").forEach(r=>{r.addEventListener("click",()=>{const s=r.getAttribute("data-prompt");s&&this.handleSend(s)})}),this.scrollToBottom()}bindMascotPills(){this.mascotPillsElem&&this.mascotPillsElem.querySelectorAll(".flare-mascot-pill").forEach(e=>{e.addEventListener("click",t=>{t.stopPropagation();const a=e.getAttribute("data-prompt");a&&(this.open(),this.handleSend(a))})})}setupMascotDrag(){var C;const e=this.mascotLauncherElem,t=(C=this.shadow)==null?void 0:C.getElementById("flare-mascot-character");if(!e||!t)return;try{const n=localStorage.getItem("flare_mascot_pos");if(n){const f=JSON.parse(n);if(typeof f.bottom=="number"&&typeof f.left=="number"){const d=Math.max(16,Math.min(window.innerWidth-150,f.left)),c=Math.max(16,Math.min(window.innerHeight-150,f.bottom));e.style.left=`${d}px`,e.style.bottom=`${c}px`,e.style.right="auto",e.style.top="auto",d<window.innerWidth/2?e.classList.add("is-left"):e.classList.remove("is-left")}else localStorage.removeItem("flare_mascot_pos")}}catch{}let a=!1,i=!1,r=0,s=0,g=0,p=0;const b=n=>{if("button"in n&&n.button!==0)return;a=!0,i=!1;const f="clientX"in n?n.clientX:n.touches[0].clientX,d="clientY"in n?n.clientY:n.touches[0].clientY;r=f,s=d;const c=e.getBoundingClientRect();g=c.left,p=window.innerHeight-c.bottom,e.style.transition="none",t.classList.add("is-dragging"),window.addEventListener("mousemove",w,{passive:!1}),window.addEventListener("mouseup",y),window.addEventListener("touchmove",w,{passive:!1}),window.addEventListener("touchend",y)},w=n=>{if(!a)return;const f="clientX"in n?n.clientX:n.touches[0].clientX,d="clientY"in n?n.clientY:n.touches[0].clientY,c=f-r,x=d-s;if(!i&&Math.hypot(c,x)>4&&(i=!0),i){n.cancelable&&n.preventDefault();const B=e.getBoundingClientRect(),S=B.width||140,A=B.height||140,H=16,$=Math.max(H,window.innerWidth-S-16),I=16,U=Math.max(I,window.innerHeight-A-16),T=Math.max(H,Math.min($,g+c)),R=Math.max(I,Math.min(U,p-x));e.style.left=`${T}px`,e.style.bottom=`${R}px`,e.style.right="auto",e.style.top="auto",T<window.innerWidth/2?e.classList.add("is-left"):e.classList.remove("is-left")}},y=()=>{if(a)if(a=!1,t.classList.remove("is-dragging"),e.style.transition="",window.removeEventListener("mousemove",w),window.removeEventListener("mouseup",y),window.removeEventListener("touchmove",w),window.removeEventListener("touchend",y),i)try{const n=e.getBoundingClientRect(),f=window.innerHeight-n.bottom;localStorage.setItem("flare_mascot_pos",JSON.stringify({left:Math.round(n.left),bottom:Math.round(Math.max(16,f))}))}catch{}else this.open()};t.addEventListener("mousedown",b),t.addEventListener("touchstart",b,{passive:!0})}bindEvents(){var t,a,i,r,s,g,p,b,w,y,C,n,f;this.setupMascotDrag(),(a=(t=this.shadow)==null?void 0:t.getElementById("flare-mascot-bubble"))==null||a.addEventListener("click",()=>this.open());const e=(i=this.shadow)==null?void 0:i.getElementById("flare-mascot-toggle-btn");e==null||e.addEventListener("click",d=>{var c,x;d.stopPropagation(),this.isMascotCollapsed=!this.isMascotCollapsed,this.isMascotCollapsed?(c=this.mascotLauncherElem)==null||c.classList.add("collapsed"):(x=this.mascotLauncherElem)==null||x.classList.remove("collapsed")}),this.bindMascotPills(),(r=this.fabBtn)==null||r.addEventListener("click",()=>this.toggle()),(s=this.fabBadge)==null||s.addEventListener("click",()=>this.open()),(p=(g=this.shadow)==null?void 0:g.getElementById("flare-btn-close"))==null||p.addEventListener("click",()=>this.close()),(w=(b=this.shadow)==null?void 0:b.getElementById("flare-btn-clear"))==null||w.addEventListener("click",()=>this.clear()),(y=this.expandBtn)==null||y.addEventListener("click",()=>this.toggleFullscreen()),(C=this.inputElem)==null||C.addEventListener("input",()=>{!this.inputElem||!this.sendBtn||(this.inputElem.style.height="auto",this.inputElem.style.height=Math.min(this.inputElem.scrollHeight,100)+"px",this.sendBtn.disabled=!this.inputElem.value.trim()||this.isLoading)}),(n=this.inputElem)==null||n.addEventListener("keydown",d=>{var c;if(d.key==="Enter"&&!d.shiftKey){d.preventDefault();const x=(c=this.inputElem)==null?void 0:c.value.trim();x&&!this.isLoading&&this.handleSend(x)}}),(f=this.sendBtn)==null||f.addEventListener("click",()=>{var c;const d=(c=this.inputElem)==null?void 0:c.value.trim();d&&!this.isLoading&&this.handleSend(d)})}async handleSend(e){if(!e||this.isLoading)return;this.inputElem&&(this.inputElem.value="",this.inputElem.style.height="auto"),this.sendBtn&&(this.sendBtn.disabled=!0),this.appendUserMessage(e),this.isLoading=!0;const t=this.showTypingIndicator();try{const a=await m(this.config.apiUrl||"http://localhost:8001/api",e,this.history,this.currentRole);t.remove(),this.appendAssistantMessage(a.answer),this.history.push({role:"user",content:e}),this.history.push({role:"assistant",content:a.answer}),this.history=this.history.slice(-20),this.saveHistory()}catch(a){t.remove();const i=a instanceof Error?a.message:"Đã có lỗi xảy ra.";this.appendAssistantMessage(`⚠️ **Không thể kết nối tới máy chủ Flare AI**

Chi tiết: ${i}

*Gợi ý: Hãy đảm bảo Backend RAG đang hoạt động tại ${this.config.apiUrl}*`)}finally{this.isLoading=!1,this.inputElem&&(this.inputElem.disabled=!1,this.inputElem.focus()),this.sendBtn&&this.inputElem&&(this.sendBtn.disabled=!this.inputElem.value.trim()),this.scrollToBottom()}}appendUserMessage(e){if(!this.messagesContainer)return;const t=document.createElement("div");t.className="flare-msg user",t.innerHTML=`
      <div class="flare-msg-avatar">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
      </div>
      <div class="flare-msg-bubble">${k(e)}</div>
    `,this.messagesContainer.appendChild(t),this.scrollToBottom()}appendAssistantMessage(e,t=[]){if(!this.messagesContainer)return;const a=document.createElement("div");a.className="flare-msg assistant",a.innerHTML=`
      <div class="flare-msg-avatar">
        ${this.getAvatarHtml()}
      </div>
      <div class="flare-msg-bubble">
        ${k(e)}
      </div>
    `,this.messagesContainer.appendChild(a),this.scrollToBottom()}showTypingIndicator(){var t;const e=document.createElement("div");return e.className="flare-typing",e.innerHTML=`
      <div class="flare-typing-dot"></div>
      <div class="flare-typing-dot"></div>
      <div class="flare-typing-dot"></div>
    `,(t=this.messagesContainer)==null||t.appendChild(e),this.scrollToBottom(),e}scrollToBottom(){this.messagesContainer&&requestAnimationFrame(()=>{setTimeout(()=>{this.messagesContainer&&(this.messagesContainer.scrollTop=this.messagesContainer.scrollHeight)},30)})}}function M(){if(o||(o=new L),window.flareWidgetInstance=o,window.flareWidget=o,window.FlareChatWidget=L,window.FlareChatWidgetConfig){const h=window.FlareChatWidgetConfig.role,e=window.FlareChatWidgetConfig.userId;h&&o.setRole(h,e)}}return document.readyState==="loading"?document.addEventListener("DOMContentLoaded",M):M(),L}();
