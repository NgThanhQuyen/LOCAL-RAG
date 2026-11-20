# ChatNTQ RAG — Local RAG Pipeline & Semantic Search Engine

**Hệ thống Hỏi - Đáp Tăng Cường Truy Hồi (Retrieval-Augmented Generation) & Tìm Kiếm Ngữ Nghĩa Đa Vai Trò Tối Ưu Cho Tiếng Việt.**

![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110%2B-009688?logo=fastapi&logoColor=white)
![Google Gemini](https://img.shields.io/badge/LLM-Google_Gemini-4285F4?logo=google&logoColor=white)
![Sentence Transformers](https://img.shields.io/badge/Embedding-Sentence_Transformers-FF6F00?logo=huggingface&logoColor=white)
![Multilingual E5](https://img.shields.io/badge/Model-Multilingual_E5_Base-orange)
![NumPy Vector Search](https://img.shields.io/badge/Vector_Search-NumPy_Cosine-013243?logo=numpy&logoColor=white)
![TypeScript](https://img.shields.io/badge/Widget-TypeScript_&_Vite-3178C6?logo=typescript&logoColor=white)
![Pytest](https://img.shields.io/badge/Testing-Pytest-0A9EDC?logo=pytest&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?logo=docker&logoColor=white)

---

## 1. Giới Thiệu Dự Án

**ChatNTQ RAG** là một giải pháp hoàn chỉnh về **Retrieval-Augmented Generation (RAG)** cho phép tra cứu ngữ nghĩa và hỏi - đáp thông minh trên tập tài liệu tùy chỉnh (`.md`, `.txt`, `.pdf`) mà không cần huấn luyện lại mô hình ngôn ngữ lớn (Zero-Shot Knowledge Ingestion).

Dự án cung cấp kiến trúc **hai trong một (Dual-Client Architecture)**:
1. **Interactive Web Application**: Ứng dụng Web Single Page hoàn chỉnh (SPA) với giao diện Dark Mode cao cấp, quản lý phiên chat đa luồng (Sessions), quản lý tài liệu (Upload/Xóa), nạp vector tự động và hiển thị trích dẫn nguồn trực quan.
2. **Standalone Embeddable Chat Widget (`widget.js`)**: Thành phần Chat Widget độc lập được viết bằng TypeScript + Vite, đóng gói theo định dạng IIFE (~26 KB) sử dụng **Shadow DOM** để nhúng liền mạch vào bất kỳ trang web nào chỉ với 1 thẻ `<script>` mà không gây xung đột CSS.

---

## 2. Kiến Trúc Kỹ Thuật Cốt Lõi

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        DATA INGESTION PIPELINE (OFFLINE PHASE)                         │
│                                                                                        │
│  [Raw Documents] ──► [Document Loader] ──► [Text Splitter] ──► [Local E5 Embedder]     │
│  (.txt, .md, .pdf)   (PyPDF / Pathlib)   (Chunk + Overlap)    (Multilingual E5 768D)   │
│                                                                        │               │
│                                                                        ▼               │
│                                                            [Vector Store (.npz)]       │
│                                                            (+ allowed_roles meta)      │
└────────────────────────────────────────────────────────────────────────┼───────────────┘
                                                                         │
┌────────────────────────────────────────────────────────────────────────┼───────────────┐
│                        QUERY & RETRIEVAL PIPELINE (ONLINE PHASE)       │               │
│                                                                        ▼               │
│  [User Query] ──► [Standalone Rewriter] ──► [Query Embedder] ──► [Cosine Search]       │
│  (+ Chat History)  (Gemini LLM / Heuristic) (E5 Query Format)    (RBAC Role Filter)    │
│                                                                        │               │
│                                                                        ▼               │
│  [Final Answer] ◄── [Google Gemini LLM] ◄────────────────────── [Top-K Context]        │
│   (Natural Tone)    (Persona Steering)                            (Top K=8 Chunks)     │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### 1. Nhúng Vector Cục Bộ (Local Multilingual Embeddings)
- Sử dụng mô hình `intfloat/multilingual-e5-base` (768 chiều) qua thư viện `sentence-transformers`.
- Chạy **cục bộ 100% trên CPU/GPU**: Không tốn chi phí API, không phụ thuộc mạng bên ngoài cho tác vụ embedding, bảo mật tuyệt đối dữ liệu nội bộ.
- **Asymmetric Encoding**: Xử lý tiền tố bất đối xứng đặc trưng của dòng E5 (`passage: ` cho tài liệu và `query: ` cho câu hỏi truy vấn) giúp tối ưu hóa không gian biểu diễn vector.

### 2. Tìm Kiếm Vector Tốc Độ Cao Bằng NumPy (Vectorized Cosine Similarity)
- **Chuẩn hóa L2 (L2 Normalization)**: Tự động chuẩn hóa mọi vector về độ dài $\|V\| = 1$. Khi đó, độ tương đồng Cosine trở thành phép nhân vô hướng (Dot Product):
  $$\text{Cosine Similarity}(Q, V) = Q \cdot V^T$$
- **NumPy Matrix Multiplication**: Tận dụng tối đa tập lệnh CPU SIMD để tính toán khoảng cách và xếp hạng Top-$K$ ($K=8$) đoạn tài liệu trong vòng vài miligiây.

### 3. Phân Quyền Truy Cập 2 Lớp (Two-Layer RBAC Architecture)
Hỗ trợ phân quyền chặt chẽ theo vai trò người dùng (`guest`, `user`, `admin_ops`, `admin_model`):
- **Lớp 1 — Lọc Vector Cứng (Metadata Filtering):** Hàm tìm kiếm vector chỉ tính toán trên các chunk có `allowed_roles` khớp với quyền của người gọi. Đảm bảo **Zero Data Leakage** — tài liệu quản trị không bao giờ lọt vào ngữ cảnh của người dùng thường hoặc khách vãng lai.
- **Lớp 2 — Điều Hướng Phong Cách Mềm (Persona Steering):** Tinh chỉnh System Instructions theo từng vai trò: phản hồi tự nhiên, giải thích rõ thẩm quyền và hướng dẫn đăng nhập lịch sự khi có yêu cầu vượt cấp.

### 4. Trí Nhớ Hội Thoại Đa Lượt & Tái Cấu Trúc Câu Hỏi (Conversational Multi-Turn RAG)
- **Standalone Query Rewriting**: Khi người dùng đặt câu hỏi phụ thuộc ngữ cảnh trước đó (*"nó là gì"*, *"hướng dẫn chi tiết hơn đi"*), hệ thống tự động phân tích lịch sử hội thoại và viết lại thành một câu hỏi độc lập đầy đủ thực thể trước khi truy xuất kho vector.
- **Tối ưu Hạn ngạch (Quota Optimization)**: Hàm phân tích heuristic `_is_followup_question()` phát hiện chính xác câu hỏi nối tiếp, bỏ qua việc gọi LLM viết lại đối với câu hỏi độc lập rõ nghĩa, giúp tiết kiệm tới 50% số lượt gọi LLM.

### 5. Tự Động Đồng Bộ Dữ Liệu (Auto-Ingestion & Hot-Reload)
- Theo dõi thời gian thay đổi (`st_mtime`) của các file tài liệu trong thư mục `data/raw/`.
- Khi có file mới được thêm vào hoặc chỉnh sửa, hệ thống tự động phát hiện và kích hoạt cập nhật lại kho vector mà không cần khởi động lại máy chủ.

---

## 3. Cấu Trúc Thư Mục Dự Án

```text
LOCAL-RAG/
├── .dockerignore             # Danh sách loại trừ các file tạm khi build Docker Image
├── .env.example              # Mẫu khai báo các biến môi trường
├── .gitignore                # Loại trừ .env, node_modules, cache nhị phân khỏi Git
├── Dockerfile                # Đóng gói Docker Container (nạp sẵn weights E5 model)
├── docker-compose.yml        # Khởi chạy Docker Compose cùng Volume hot-reload
├── pyproject.toml            # Cấu hình gói Python và dependencies
├── package.json              # Quản lý script npm cấp gốc (build:widget)
├── requirements.txt          # Danh sách thư viện Python
├── README.md                 # Tài liệu hướng dẫn dự án
│
├── data/                     # Quản lý tập trung dữ liệu RAG
│   ├── raw/                  # Thư mục chứa tài liệu thô (.txt, .md, .pdf)
│   └── processed/            # Kho lưu trữ vector store (.npz & .meta.json)
│
├── src/                      # Mã nguồn chính của ứng dụng
│   ├── api/                  # Tầng Web API & Static Web Demo
│   │   ├── main.py           # Khởi tạo FastAPI, CORS, Static Files, endpoint /widget.js
│   │   ├── routes.py         # REST Endpoints (/api/chat, /api/documents, /api/upload...)
│   │   ├── schemas.py        # Pydantic Schemas định nghĩa Request/Response
│   │   └── static/           # Giao diện Web SPA tích hợp sẵn
│   │       ├── index.html    # Giao diện Dark Mode SPA
│   │       ├── css/style.css # Giao diện thiết kế Glassmorphism
│   │       ├── js/app.js     # Quản lý phiên chat (Sessions) & Markdown render
│   │       └── widget.js     # Bundle Chat Widget độc lập (~26 KB)
│   │
│   └── rag/                  # Package lõi RAG Engine
│       ├── config.py         # Nạp cấu hình môi trường từ .env
│       ├── loader.py         # Trích xuất văn bản từ .txt, .md và .pdf
│       ├── chunker.py        # Phân đoạn văn bản (chunking) kèm độ chồng lấn (overlap)
│       ├── embeddings.py     # Mô hình nhúng vector cục bộ Multilingual-E5
│       ├── vector_store.py   # Kho vector, chuẩn hóa L2, Cosine Search & RBAC Filter
│       ├── llm.py            # Giao tiếp Google Gemini API
│       ├── prompts.py        # System Prompt Templates, vai trò & kiểm soát ảo giác
│       └── pipeline.py       # Điều phối Ingest, Auto-reload, Query Rewriting & RBAC
│
├── widget/                   # Mã nguồn TypeScript của Chat Widget độc lập
│   ├── package.json          # Dependencies (Vite, TypeScript)
│   ├── tsconfig.json         # Cấu hình TypeScript
│   ├── vite.config.ts        # Cấu hình build IIFE bundle
│   └── src/                  # Mã nguồn widget (UI, Styles, Events, Storage)
│       ├── index.ts          # Controller, User-Scoped localStorage & DOM Lifecycle
│       ├── styles.ts         # CSS cô lập cho Shadow DOM
│       ├── types.ts          # Interface TypeScript cho Widget & Role
│       └── api.ts            # Client gọi API /api/chat
│
├── scripts/                  # Kịch bản khởi chạy dự án
│   ├── run_web.py            # Chạy máy chủ Web FastAPI (host 0.0.0.0, port 8001)
│   ├── ingest.py             # CLI nạp tài liệu thủ công vào vector store
│   └── ask.py                # CLI hỏi đáp trực tiếp trong Terminal
│
└── tests/                    # Kiểm thử tự động
    ├── test_api.py           # Unit tests cho các REST API Endpoints
    └── test_smoke.py         # Smoke tests cho Chunker và Vector Search
```

---

## 4. Công Nghệ Sử Dụng

| Hạng Mục | Công Nghệ / Thư Viện | Vai Trò & Điểm Nổi Bật |
| :--- | :--- | :--- |
| **Ngôn ngữ** | Python 3.10+ & TypeScript | Backend xử lý AI & Client Widget |
| **Mô hình Embedding** | `sentence-transformers` / `intfloat/multilingual-e5-base` | Nhúng vector 768 chiều cục bộ (Offline 100%) |
| **Đại số Vector** | `NumPy` | Tính toán ma trận và xếp hạng Cosine Similarity |
| **LLM Inference** | `google-genai` (Google Gemini Flash) | Sinh câu trả lời tổng hợp có kiểm soát ảo giác |
| **Web Framework** | `FastAPI`, `Uvicorn` | RESTful API bất đồng bộ hiệu năng cao |
| **Đóng gói Widget** | `Vite` (IIFE Output) | Bundle độc lập ~26 KB, tự đóng gói CSS trong Shadow DOM |
| **Xử lý Tài liệu** | `pypdf`, `pathlib` | Đọc văn bản từ PDF, Markdown, Plain Text |
| **Testing** | `pytest` | Kiểm thử tự động thuật toán chia đoạn và Vector Search |
| **Triển khai** | `Docker`, `Docker Compose` | Container đóng gói sẵn weights mô hình E5 |

---

## 5. Hướng Dẫn Cài Đặt & Khởi Chạy

### Bước 1 — Khởi Tạo Môi Trường Python

```powershell
# Tạo môi trường ảo
python -m venv .venv

# Kích hoạt môi trường (Windows PowerShell)
.\.venv\Scripts\Activate.ps1

# Kích hoạt môi trường (Linux / macOS)
# source .venv/bin/activate
```

### Bước 2 — Cài Đặt Thư Viện Phụ Thuộc

```powershell
pip install -r requirements.txt
```

### Bước 3 — Thiết Lập Biến Môi Trường

Sao chép `.env.example` thành `.env`:

```powershell
Copy-Item .env.example .env
```

Mở file `.env` và điền `GEMINI_API_KEY` (lấy miễn phí tại [Google AI Studio](https://aistudio.google.com/apikey)):

```env
GEMINI_API_KEY=AIzaSy...
GEMINI_CHAT_MODEL=gemini-flash-latest
EMBED_MODEL=intfloat/multilingual-e5-base
RAG_CHUNK_SIZE=800
RAG_CHUNK_OVERLAP=120
RAG_TOP_K=8
PORT=8001
CORS_ORIGINS=*
```

### Bước 4 — Khởi Chạy Hệ Thống

#### Cách 1: Khởi Chạy Giao Diện Web FastAPI (Interactive Web Demo)
```powershell
python scripts/run_web.py
```
- Máy chủ sẽ chạy tại: `http://localhost:8001`.
- Mở trình duyệt để trải nghiệm ứng dụng Web SPA đầy đủ tính năng: Chat đa lượt, Upload tài liệu, Nạp Vector Store, Xem tài liệu trích dẫn.

#### Cách 2: Hỏi Đáp Trực Tiếp Qua Terminal (CLI)
```powershell
# 1. Nạp tài liệu trong data/raw/
python scripts/ingest.py

# 2. Đặt câu hỏi
python scripts/ask.py "Quy trình xử lý khi phát hiện đám cháy là gì?"
```

---

## 6. Đóng Gói & Tích Hợp Chat Widget Độc Lập (`widget.js`)

Chat Widget được thiết kế để nhúng vào **bất kỳ ứng dụng web nào** (React, Vue, Angular, WordPress, Web tĩnh HTML) với độ tương thích tuyệt đối.

### 1. Biên Dịch Mã Nguồn Widget
Khi có chỉnh sửa trong thư mục `widget/src/`, biên dịch lại widget bằng lệnh:

```powershell
npm run build:widget
```
*File kết quả sẽ được xuất tự động ra `src/api/static/widget.js`.*

### 2. Nhúng Vào Trang Web Bất Kỳ
Chỉ cần thêm thẻ `<script>` vào trang web đích trước thẻ đóng `</body>`:

```html
<!-- Cấu hình tùy chọn (nếu có) -->
<script>
  window.FlareChatWidgetConfig = {
    apiUrl: "http://localhost:8001/api",
    role: "guest"
  };
</script>

<!-- Nhúng Chat Widget -->
<script src="http://localhost:8001/widget.js" defer></script>
```

### 3. Điều Khiển Widget Qua JavaScript API
Widget cung cấp API toàn cục thông qua `window.FlareChatWidget`:

```javascript
// Đổi vai trò và phân vùng lưu trữ lịch sử theo tài khoản
window.FlareChatWidget.setRole("user", "user_12345");

// Chuyển về chế độ khách khi đăng xuất (tự làm sạch lịch sử phiên trước)
window.FlareChatWidget.setRole("guest", null);

// Mở, đóng hoặc toggle khung chat
window.FlareChatWidget.open();
window.FlareChatWidget.close();
window.FlareChatWidget.toggle();

// Xóa sạch lịch sử chat của phiên hiện tại
window.FlareChatWidget.clear();
```

### 4. Cơ Chế Quản Lý Lịch Sử Theo Người Dùng (User-Scoped Storage)
- **Khách vãng lai (`guest`):** Không lưu vào `localStorage`. Lịch sử chỉ lưu trong RAM/DOM của phiên hiện tại. Khi người dùng tải lại trang (F5) hoặc Đăng xuất, khung chat tự động xóa trắng về trạng thái ban đầu.
- **Tài khoản đã đăng nhập (`user`, `admin_ops`, `admin_model`):** Lưu trữ độc lập vào `localStorage` theo khóa `flare_chat_history_${userId}` (tối đa 20 tin nhắn gần nhất). Đảm bảo cách ly 100% dữ liệu trò chuyện giữa các tài khoản khác nhau trên cùng một trình duyệt.

---

## 7. Tài Liệu REST API

FastAPI cung cấp tài liệu Swagger UI trực quan tại: `http://localhost:8001/docs`.

### 1. `POST /api/chat`
Gửi câu hỏi và lịch sử trò chuyện để nhận câu trả lời từ RAG Pipeline.

**Request Body:**
```json
{
  "question": "Cách sử dụng bình chữa cháy bột và CO2 khác nhau thế nào?",
  "history": [
    { "role": "user", "content": "Xin chào" },
    { "role": "assistant", "content": "Chào bạn! Mình có thể hỗ trợ gì cho bạn?" }
  ],
  "role": "user"
}
```

**Response (200 OK):**
```json
{
  "answer": "Bình chữa cháy dạng bột có đồng hồ áp suất ở cổ bình, dùng dập tắt đám cháy chất rắn, lỏng, khí và điện hạ thế...",
  "sources": [
    {
      "source": "ky-nang-pccc-va-thoat-hiem.md",
      "text": "Theo TCVN 3890:2023, hai loại bình chữa cháy xách tay phổ biến...",
      "score": 0.884
    }
  ]
}
```

### 2. `GET /api/documents`
Lấy danh sách các file tài liệu hiện có trong thư mục `data/raw/`.

### 3. `POST /api/upload`
Tải file tài liệu mới (`.txt`, `.md`, `.pdf`) lên `data/raw/` và tự động kích hoạt nạp lại kho vector. Tích hợp kiểm tra chuẩn hóa tên file và giới hạn dung lượng tối đa 25MB.

### 4. `DELETE /api/documents/{filename}`
Xóa tài liệu khỏi `data/raw/` và tự động cập nhật lại kho vector. Tích hợp cơ chế chống tấn công Path Traversal.

### 5. `POST /api/ingest`
Kích hoạt tiến trình nạp (ingestion) toàn bộ tài liệu từ `data/raw/` vào kho vector.

### 6. `GET /api/health`
Kiểm tra trạng thái máy chủ, trạng thái kho vector và tên mô hình đang hoạt động.

### 7. `GET /widget.js`
Cung cấp trực tiếp file bundle widget độc lập phục vụ nhúng script từ bên ngoài kèm header `Cache-Control: no-cache`.

---

## 8. Triển Khai Với Docker

Dự án đã được container hóa hoàn chỉnh với Dockerfile tối ưu hóa dung lượng (Python 3.11-slim) và nạp sẵn trọng số của mô hình E5 vào Docker Cache giúp container khởi động tức thì.

### Khởi Chạy Bằng Docker Compose (Khuyên Dùng)

```bash
docker-compose up --build
```
- Khởi chạy ở chế độ chạy ngầm (Background):
  ```bash
  docker-compose up -d --build
  ```
- Dừng dịch vụ:
  ```bash
  docker-compose down
  ```

---

## 9. Kiểm Thử Tự Động (Automated Testing)

Chạy bộ kiểm thử tự động với `pytest` để kiểm tra toàn bộ pipeline:

```powershell
pytest
```

---

## 10. Lưu Ý Về An Toàn & Bảo Mật Khi Đưa Vào Vận Hành

1. **Bảo Mật API Key**: Tuyệt đối không commit file `.env` chứa `GEMINI_API_KEY` lên các kho mã nguồn công khai (GitHub/GitLab). File `.gitignore` của dự án đã được cấu hình sẵn để chặn `.env` và `node_modules/`.
2. **Xác Thực Vai Trò (Production RBAC)**: Khi triển khai vào hệ thống thực tế, tham số `role` của endpoint `/api/chat` nên được xác thực qua **JWT Bearer Token** hoặc Session Cookie từ dịch vụ Auth thay vì nhận tham số trần từ client.
3. **CORS Origins**: Trong môi trường Production, cấu hình biến `CORS_ORIGINS` trong `.env` thành danh sách domain cụ thể (ví dụ: `https://mywebsite.com,https://app.mywebsite.com`) thay vì để `*`.
4. **An Toàn Thao Tác File**: Các endpoint Upload và Delete file đã được tích hợp bộ lọc chống tấn công **Directory Traversal** (`Path.name`, kiểm tra `resolve()`) và giới hạn kích thước file chống tấn công cạn kiệt bộ nhớ (DoS).
