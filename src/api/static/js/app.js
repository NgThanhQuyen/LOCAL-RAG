/**
 * ChatNTQ RAG Client Script
 * Quản lý tương tác chat, Lịch sử cuộc trò chuyện (Multi-turn), hiển thị Markdown & trích dẫn nguồn.
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const chatHistory = document.getElementById('chat-history');
    const welcomeScreen = document.getElementById('welcome-screen');
    const clearChatBtn = document.getElementById('clear-chat-btn');

    // Sidebar Elements
    const sidebar = document.getElementById('sidebar');
    const openSidebarBtn = document.getElementById('open-sidebar-btn');
    const closeSidebarBtn = document.getElementById('close-sidebar-btn');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const newChatBtn = document.getElementById('new-chat-btn');
    const refreshDocsBtn = document.getElementById('refresh-docs-btn');
    const docList = document.getElementById('doc-list');
    const uploadZone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('file-input');
    const reingestBtn = document.getElementById('reingest-btn');
    const sessionList = document.getElementById('session-list');
    const clearAllSessionsBtn = document.getElementById('clear-all-sessions-btn');

    // Status Elements
    const statusIndicator = document.getElementById('status-indicator');
    const statusTitle = document.getElementById('status-title');
    const statusDesc = document.getElementById('status-desc');

    // Modal Elements
    const sourceModal = document.getElementById('source-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalBody = document.getElementById('modal-body');

    // State
    let isGenerating = false;
    let sessions = loadSessionsFromStorage();
    let currentSessionId = getInitialSessionId();

    // Configure Marked.js Options
    if (window.marked) {
        marked.setOptions({
            highlight: function (code, lang) {
                if (window.hljs && hljs.getLanguage(lang)) {
                    return hljs.highlight(code, { language: lang }).value;
                }
                return window.hljs ? hljs.highlightAuto(code).value : code;
            },
            breaks: true
        });
    }

    // --- Init ---
    checkHealth();
    loadDocuments();
    renderSessionList();
    loadActiveSessionToUI();

    // --- Input Auto Resize & Buttons State ---
    chatInput.addEventListener('input', () => {
        chatInput.style.height = 'auto';
        chatInput.style.height = Math.min(chatInput.scrollHeight, 160) + 'px';
        sendBtn.disabled = !chatInput.value.trim() || isGenerating;
    });

    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!sendBtn.disabled) {
                handleSendMessage();
            }
        }
    });

    sendBtn.addEventListener('click', handleSendMessage);

    // --- Suggestion Cards ---
    document.querySelectorAll('.suggestion-card').forEach(card => {
        card.addEventListener('click', () => {
            const prompt = card.getAttribute('data-prompt');
            if (prompt) {
                chatInput.value = prompt;
                chatInput.dispatchEvent(new Event('input'));
                handleSendMessage();
            }
        });
    });

    // --- Sidebar Toggle ---
    openSidebarBtn?.addEventListener('click', () => {
        sidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
    });

    const closeSidebar = () => {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
    };

    closeSidebarBtn?.addEventListener('click', closeSidebar);
    sidebarOverlay?.addEventListener('click', closeSidebar);

    // --- Sessions & History Management ---
    function loadSessionsFromStorage() {
        try {
            const raw = localStorage.getItem('chat_sessions');
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    function saveSessionsToStorage() {
        try {
            localStorage.setItem('chat_sessions', JSON.stringify(sessions));
        } catch (e) {
            console.error('Lỗi lưu phiên chat:', e);
        }
    }

    function getInitialSessionId() {
        if (sessions.length > 0) {
            return sessions[0].id;
        }
        return createNewSessionObject().id;
    }

    function createNewSessionObject() {
        const newSession = {
            id: 'session_' + Date.now(),
            title: 'Cuộc trò chuyện mới',
            createdAt: Date.now(),
            messages: []
        };
        sessions.unshift(newSession);
        saveSessionsToStorage();
        return newSession;
    }

    function createNewChat() {
        const newSession = createNewSessionObject();
        currentSessionId = newSession.id;
        renderSessionList();
        loadActiveSessionToUI();
    }

    newChatBtn.addEventListener('click', createNewChat);
    clearChatBtn.addEventListener('click', () => {
        const active = getCurrentSession();
        if (active) {
            active.messages = [];
            saveSessionsToStorage();
            loadActiveSessionToUI();
        }
    });

    clearAllSessionsBtn?.addEventListener('click', () => {
        if (confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử các cuộc trò chuyện?')) {
            sessions = [];
            saveSessionsToStorage();
            createNewChat();
        }
    });

    function getCurrentSession() {
        return sessions.find(s => s.id === currentSessionId);
    }

    function renderSessionList() {
        if (!sessionList) return;

        if (sessions.length === 0) {
            sessionList.innerHTML = `<div class="empty-history-text">Chưa có cuộc trò chuyện nào</div>`;
            return;
        }

        sessionList.innerHTML = sessions.map(s => `
            <div class="session-item ${s.id === currentSessionId ? 'active' : ''}" data-id="${s.id}">
                <div class="session-title">
                    <i class="fa-regular fa-message"></i>
                    <span>${escapeHtml(s.title)}</span>
                </div>
                <button class="delete-session-btn" data-id="${s.id}" title="Xóa phiên này">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </div>
        `).join('');

        sessionList.querySelectorAll('.session-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = item.getAttribute('data-id');
                if (id !== currentSessionId) {
                    currentSessionId = id;
                    renderSessionList();
                    loadActiveSessionToUI();
                }
            });
        });

        sessionList.querySelectorAll('.delete-session-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                sessions = sessions.filter(s => s.id !== id);
                saveSessionsToStorage();
                if (currentSessionId === id) {
                    currentSessionId = sessions.length > 0 ? sessions[0].id : createNewSessionObject().id;
                }
                renderSessionList();
                loadActiveSessionToUI();
            });
        });
    }

    function loadActiveSessionToUI() {
        const active = getCurrentSession();
        chatHistory.innerHTML = '';

        if (!active || !active.messages || active.messages.length === 0) {
            chatHistory.appendChild(welcomeScreen);
            welcomeScreen.style.display = 'flex';
        } else {
            welcomeScreen.style.display = 'none';
            active.messages.forEach(msg => {
                if (msg.role === 'user') {
                    appendUserMessage(msg.content);
                } else if (msg.role === 'assistant') {
                    const row = document.createElement('div');
                    row.className = 'message-row assistant-row';
                    row.innerHTML = `
                        <div class="avatar"><i class="fa-solid fa-robot"></i></div>
                        <div class="message-content">
                            <div class="message-text"></div>
                        </div>
                    `;
                    chatHistory.appendChild(row);
                    animateResponseText(row.querySelector('.message-text'), msg.content);
                    if (msg.sources && msg.sources.length > 0) {
                        renderSourceBadges(row.querySelector('.message-content'), msg.sources);
                    }
                }
            });
        }
        scrollToBottom();
    }

    function getHistoryForApi() {
        const active = getCurrentSession();
        if (!active || !active.messages) return [];
        // Lấy tối đa 6 tin nhắn gần nhất để làm ngữ cảnh history
        const recent = active.messages.slice(-6);
        return recent.map(m => ({
            role: m.role,
            content: m.content
        }));
    }

    // --- Health Check ---
    async function checkHealth() {
        try {
            const res = await fetch('/api/health');
            const data = await res.json();
            if (data.has_vector_store) {
                statusIndicator.className = 'status-indicator ready';
                statusTitle.textContent = 'Đã Sẵn Sàng';
                statusDesc.textContent = 'Vector Store đã nạp';
            } else {
                statusIndicator.className = 'status-indicator';
                statusTitle.textContent = 'Chưa Nạp Store';
                statusDesc.textContent = 'Cần bấm Nạp Vector';
            }
        } catch (err) {
            statusIndicator.className = 'status-indicator';
            statusTitle.textContent = 'Mất Kết Nối';
            statusDesc.textContent = 'API server offline';
        }
    }

    // --- Load Raw Documents ---
    async function loadDocuments() {
        try {
            const res = await fetch('/api/documents');
            const docs = await res.json();
            renderDocuments(docs);
        } catch (err) {
            docList.innerHTML = `<div style="color:var(--danger);font-size:0.8rem;">Lỗi tải danh sách file.</div>`;
        }
    }

    function renderDocuments(docs) {
        if (!docs || docs.length === 0) {
            docList.innerHTML = `<div style="color:var(--text-muted);font-size:0.8rem;padding:8px;">Chưa có tài liệu nào trong data/raw.</div>`;
            return;
        }

        docList.innerHTML = docs.map(d => `
            <div class="doc-item">
                <div class="doc-info">
                    <i class="fa-regular fa-file-lines"></i>
                    <div style="display:flex;flex-direction:column;">
                        <span class="doc-name" title="${d.filename}">${d.filename}</span>
                        <span class="doc-size">${formatBytes(d.size_bytes)}</span>
                    </div>
                </div>
                <button class="icon-btn delete-doc-btn" data-filename="${d.filename}" title="Xóa file">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            </div>
        `).join('');

        docList.querySelectorAll('.delete-doc-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const fname = btn.getAttribute('data-filename');
                if (confirm(`Bạn có chắc chắn muốn xóa file '${fname}'?`)) {
                    await deleteDocument(fname);
                }
            });
        });
    }

    async function deleteDocument(filename) {
        try {
            const res = await fetch(`/api/documents/${encodeURIComponent(filename)}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            alert(data.message || 'Đã xóa file.');
            loadDocuments();
            checkHealth();
        } catch (err) {
            alert('Lỗi khi xóa file: ' + err.message);
        }
    }

    // --- Upload File Drag & Drop ---
    uploadZone.addEventListener('click', () => fileInput.click());

    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('dragover');
    });

    ['dragleave', 'dragend'].forEach(evt => {
        uploadZone.addEventListener(evt, () => uploadZone.classList.remove('dragover'));
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
            uploadFile(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
            uploadFile(fileInput.files[0]);
        }
    });

    async function uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);

        uploadZone.innerHTML = `<i class="fa-solid fa-spinner fa-spin upload-icon"></i><p>Đang tải lên & nạp vector...</p>`;

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.detail || 'Lỗi upload.');
            }

            const data = await res.json();
            alert(data.message);
            loadDocuments();
            checkHealth();
        } catch (err) {
            alert('Upload thất bại: ' + err.message);
        } finally {
            uploadZone.innerHTML = `
                <i class="fa-solid fa-cloud-arrow-up upload-icon"></i>
                <p>Kéo thả file <span>.txt, .md, .pdf</span> vào đây</p>
                <small>hoặc click để chọn file từ máy</small>
            `;
            fileInput.value = '';
        }
    }

    // --- Trigger Ingest Thủ công ---
    reingestBtn.addEventListener('click', async () => {
        reingestBtn.disabled = true;
        reingestBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Đang tạo vector...`;
        try {
            const res = await fetch('/api/ingest', { method: 'POST' });
            const data = await res.json();
            alert(data.message);
            checkHealth();
        } catch (err) {
            alert('Lỗi nạp vector: ' + err.message);
        } finally {
            reingestBtn.disabled = false;
            reingestBtn.innerHTML = `<i class="fa-solid fa-database"></i> Nạp lại Vector Store`;
        }
    });

    refreshDocsBtn.addEventListener('click', loadDocuments);

    // --- Send Chat Message ---
    async function handleSendMessage() {
        const query = chatInput.value.trim();
        if (!query || isGenerating) return;

        let activeSession = getCurrentSession();
        if (!activeSession) {
            activeSession = createNewSessionObject();
            currentSessionId = activeSession.id;
        }

        const historyForApi = getHistoryForApi();

        // Ẩn welcome screen
        welcomeScreen.style.display = 'none';

        // Thêm câu hỏi người dùng vào session
        const isFirstMessage = activeSession.messages.length === 0;
        activeSession.messages.push({ role: 'user', content: query });

        if (isFirstMessage) {
            activeSession.title = query.length > 22 ? query.substring(0, 22) + '...' : query;
        }

        saveSessionsToStorage();
        renderSessionList();

        // Hiển thị tin nhắn người dùng
        appendUserMessage(query);

        // Reset input
        chatInput.value = '';
        chatInput.style.height = 'auto';
        sendBtn.disabled = true;
        isGenerating = true;

        // Hiển thị trạng thái đang suy nghĩ
        const assistantRow = createAssistantMessageSkeleton();
        chatHistory.appendChild(assistantRow);
        scrollToBottom();

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: query,
                    history: historyForApi
                })
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.detail || 'Lỗi kết nối API.');
            }

            const data = await res.json();

            // Hiển thị kết quả trả lời
            await animateResponseText(assistantRow.querySelector('.message-text'), data.answer);

            // Hiển thị danh sách nguồn trích dẫn
            if (data.sources && data.sources.length > 0) {
                renderSourceBadges(assistantRow.querySelector('.message-content'), data.sources);
            }

            // Lưu câu trả lời assistant vào session
            activeSession.messages.push({
                role: 'assistant',
                content: data.answer,
                sources: data.sources || []
            });
            saveSessionsToStorage();

        } catch (err) {
            assistantRow.querySelector('.message-text').innerHTML = `
                <div style="color:var(--danger);">
                    <i class="fa-solid fa-triangle-exclamation"></i> ${escapeHtml(err.message)}
                </div>
            `;
        } finally {
            isGenerating = false;
            scrollToBottom();
        }
    }

    function appendUserMessage(text) {
        const row = document.createElement('div');
        row.className = 'message-row user-row';
        row.innerHTML = `
            <div class="avatar"><i class="fa-solid fa-user"></i></div>
            <div class="message-content">
                <div class="message-text">${escapeHtml(text)}</div>
            </div>
        `;
        chatHistory.appendChild(row);
    }

    function createAssistantMessageSkeleton() {
        const row = document.createElement('div');
        row.className = 'message-row assistant-row';
        row.innerHTML = `
            <div class="avatar"><i class="fa-solid fa-robot"></i></div>
            <div class="message-content">
                <div class="message-text">
                    <i class="fa-solid fa-circle-notch fa-spin text-accent"></i> Đang suy nghĩ và xử lý ngữ cảnh...
                </div>
            </div>
        `;
        return row;
    }

    async function animateResponseText(container, fullText) {
        container.innerHTML = '';
        const parsedHtml = window.marked ? marked.parse(fullText) : fullText;
        container.innerHTML = parsedHtml;

        if (window.hljs) {
            container.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
        }
    }

    function renderSourceBadges(container, sources) {
        const sourcesDiv = document.createElement('div');
        sourcesDiv.className = 'sources-container';

        sourcesDiv.innerHTML = `
            <div class="sources-title">
                <i class="fa-solid fa-quote-left"></i> Nguồn tham khảo (${sources.length} đoạn liên quan nhất):
            </div>
            <div class="source-badges">
                ${sources.map((s, idx) => `
                    <div class="source-badge" data-index="${idx}">
                        <i class="fa-regular fa-file-code"></i>
                        <span>${escapeHtml(s.source)}</span>
                        <span class="score-tag">${(s.score * 100).toFixed(1)}%</span>
                    </div>
                `).join('')}
            </div>
        `;

        sourcesDiv.querySelectorAll('.source-badge').forEach(badge => {
            badge.addEventListener('click', () => {
                const idx = parseInt(badge.getAttribute('data-index'));
                openSourceModal(sources, idx);
            });
        });

        container.appendChild(sourcesDiv);
    }

    function openSourceModal(sources, activeIdx) {
        modalBody.innerHTML = sources.map((s, i) => `
            <div class="modal-source-item" style="${i === activeIdx ? 'border-color:var(--accent);' : ''}">
                <div class="modal-source-meta">
                    <span><i class="fa-regular fa-file"></i> Nguồn: ${escapeHtml(s.source)}</span>
                    <span class="score-tag">Độ tương đồng: ${(s.score * 100).toFixed(1)}%</span>
                </div>
                <div style="white-space:pre-wrap;font-family:var(--font-mono);font-size:0.85rem;background:var(--bg-input);padding:10px;border-radius:6px;color:var(--text-primary);">${escapeHtml(s.text)}</div>
            </div>
        `).join('');

        sourceModal.classList.add('active');
    }

    closeModalBtn?.addEventListener('click', () => sourceModal.classList.remove('active'));
    sourceModal?.addEventListener('click', (e) => {
        if (e.target === sourceModal) sourceModal.classList.remove('active');
    });

    // --- Suggestion Cards Click Event Delegation ---
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.suggestion-card');
        if (card) {
            const promptText = card.getAttribute('data-prompt');
            if (promptText && !isGenerating) {
                chatInput.value = promptText;
                handleSendMessage();
            }
        }
    });

    // --- Helpers ---
    function scrollToBottom() {
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    function formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    function escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});
