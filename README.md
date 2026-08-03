# ChatNTQ RAG — Local RAG Pipeline & Semantic Search Engine

**Hệ thống Tìm kiếm Ngữ nghĩa & Hỏi - Đáp Tăng Cường Truy Hồi (Retrieval-Augmented Generation) Tối Ưu Cho Dữ Liệu Văn Bản Tiếng Việt.**

![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110%2B-009688?logo=fastapi&logoColor=white)
![Google Gemini](https://img.shields.io/badge/LLM-Google_Gemini-4285F4?logo=google&logoColor=white)
![Sentence Transformers](https://img.shields.io/badge/Embedding-Sentence_Transformers-FF6F00?logo=huggingface&logoColor=white)
![Multilingual E5](https://img.shields.io/badge/Model-Multilingual_E5_Base-orange)
![NumPy Vector Search](https://img.shields.io/badge/Vector_Search-NumPy_Cosine-013243?logo=numpy&logoColor=white)
![PyPDF](https://img.shields.io/badge/PDF_Parser-PyPDF-red)
![Pytest](https://img.shields.io/badge/Testing-Pytest-0A9EDC?logo=pytest&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?logo=docker&logoColor=white)
![Web UI Demo](https://img.shields.io/badge/Demo-HTML5%2FCSS3%2FJS-E34F26?logo=html5&logoColor=white)

---

## 1. Giới Thiệu Dự Án (Data & AI Perspective)

**ChatNTQ RAG** là dự án nghiên cứu và triển khai quy trình **Retrieval-Augmented Generation (RAG)** giải quyết bài toán tra cứu tri thức ngữ nghĩa trên tập tài liệu tùy chỉnh mà không cần huấn luyện lại mô hình (Zero-Shot Knowledge Ingestion).

Dự án tập trung chuyên sâu vào **Pipeline xử lý dữ liệu (Data Pipeline)**, **Mô hình hóa Vector không gian (Vector Embeddings)**, **Thuật toán tìm kiếm độ tương đồng Cosine Similarity**, **Trí nhớ hội thoại đa lượt (Multi-turn RAG Memory)** và **Kỹ thuật Prompt Engineering** nhằm triệt tiêu hoàn toàn hiện tượng ảo giác (hallucination) của LLM.

---

## 2. Điểm Mấu Chốt Về Khoa Học Dữ Liệu & AI Trong Dự Án

### 1. Quy Trình Phân Đoạn Văn Bản (Text Chunking & Overlap)
- **Sliding Window Chunking**: Chia nhỏ văn bản thành các phân đoạn `chunk_size = 800` ký tự.
- **Context Boundary Overlap**: Giữ độ chồng lấn `chunk_overlap = 120` ký tự giữa hai đoạn liên kề nhằm tránh mất mát thông tin tại ranh giới cắt của ngữ cảnh.

### 2. Mô Hình Nhúng Vector Ngữ Nghĩa (Multilingual Vector Embeddings)
- Sử dụng mô hình `intfloat/multilingual-e5-base` (768 chiều) thông qua thư viện `sentence-transformers` chạy **cục bộ 100% trên CPU/GPU** (không tốn API quota).
- **Asymmetric Encoding**: Xử lý tiền tố bất đối xứng đặc thù của dòng mô hình E5 — thêm tiền tố `passage: ` khi tạo vector tài liệu và `query: ` khi nhúng câu hỏi truy vấn để tối ưu hóa khoảng cách không gian vector.

### 3. Thuật Toán Tìm Kiếm Vector (Vector Search với NumPy & L2 Normalization)
- **Chuẩn hóa L2 (L2 Normalization)**: Tự động đưa mọi vector về độ dài đơn vị $\|V\| = 1$. Khi mọi vector có độ dài 1, phép tính Cosine Similarity rút gọn về phép tính **Tích vô hướng (Dot Product)**:
  $$\text{Cosine Similarity}(Q, V) = Q \cdot V^T$$
- **High-Performance Matrix Vectorization**: Sử dụng phép nhân ma trận NumPy cho phép tính toán và xếp hạng Top-$K$ ($K=8$) đoạn tài liệu có điểm tương đồng cao nhất trong thời gian tính bằng miligiây ($O(N \cdot D)$).

### 4. Trí Nhớ Hội Thoại Đa Lượt & Tái Cấu Trúc Câu Hỏi (Conversational Multi-Turn RAG)
- **Standalone Query Rewriting**: Khi người dùng đặt câu hỏi nối tiếp chứa đại từ thay thế (*"nó"*, *"số tiền đó"*, *"câu trước"*), Gemini LLM sẽ tự động phân tích lịch sử hội thoại và tái cấu trúc câu hỏi thành một **Câu hỏi độc lập đầy đủ thực thể (Standalone Query)** trước khi truy vấn kho vector.
- **Tối ưu hóa Hạn ngạch (Quota Optimization)**: Bộ lọc heuristic `_is_followup_question()` giúp phát hiện chính xác câu hỏi nối tiếp, bỏ qua việc gọi LLM viết lại cho các câu hỏi độc lập rõ nghĩa, giúp **tiết kiệm 50% số lượt gọi Gemini API**.

### 5. Tự Động Nạp & Cập Nhật Kho Vector (Auto-Ingestion & Hot-Reload)
- **Filesystem Timestamp Tracking**: Phương thức `_check_and_auto_ingest_if_needed()` tự động theo dõi thời gian thay đổi (`st_mtime`) của các file tài liệu trong `data/raw/`.
- Khi người dùng copy file mới (`.md`, `.txt`, `.pdf`) vào kho, hệ thống tự động phát hiện và kích hoạt nạp vector tức thì mà không cần dừng server hay thao tác thủ công.

### 6. Triệt Tiêu Ảo Giác & Đảm Bảo Đầy Đủ Bảng Biểu (Exhaustive Prompting)
- Ép LLM (Google Gemini `gemini-flash-latest`) trả lời **nghiêm ngặt và duy nhất** dựa trên khối ngữ cảnh được truy xuất ($K=8$).
- System instructions yêu cầu AI giữ trọn vẹn 100% tất cả các dòng, các cột và chi tiết số liệu dạng bảng (bán hàng, danh sách khách hàng) mà không tự ý bỏ bớt hay cắt ngắn.

---

## 3. Kiến Trúc Luồng Xử Lý Dữ Liệu (Data Flow Architecture)

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        DATA INGESTION PIPELINE (OFFLINE PHASE)                         │
│                                                                                        │
│  [Raw Documents] ──► [Document Loader] ──► [Text Splitter] ──► [Local E5 Embedder]     │
│  (.txt, .md, .pdf)   (PyPDF / Pathlib)   (Chunk + Overlap)    (Multilingual E5 768D)   │
│                                                                        │               │
│                                                                        ▼               │
│                                                            [Vector Store (.npz)]       │
└────────────────────────────────────────────────────────────────────────┼───────────────┘
                                                                         │
┌────────────────────────────────────────────────────────────────────────┼───────────────┐
│                        QUERY & RETRIEVAL PIPELINE (ONLINE PHASE)       │               │
│                                                                        ▼               │
│  [User Query] ──► [Standalone Rewriter] ──► [Query Embedder] ──► [Cosine Search]       │
│  (+ Chat History)  (Gemini LLM / Heuristic) (E5 Query Format)    (L2 Normalized Dot)   │
│                                                                        │               │
│                                                                        ▼               │
│  [Final Answer] ◄── [Google Gemini LLM] ◄────────────────────── [Top-K Context]        │
│   (+ Sources)       (System Instructions)                         (Top K=8 Chunks)     │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Cấu Trúc Thư Mục Dự Án & Chi Tiết Các Thành Phần

```text
LOCAL-RAG/
├── .dockerignore             # Danh sách loại trừ các file tạm/venv khi build Docker Image
├── .env.example              # Mẫu khai báo các biến môi trường (API Key, model parameters)
├── .gitignore                # Loại trừ các tập tin nhạy cảm (.env) và dữ liệu nhị phân khỏi Git
├── Dockerfile                # Cấu hình đóng gói Docker Container (nạp sẵn weights E5 model)
├── docker-compose.yml        # Cấu hình khởi chạy nhanh Docker Compose cùng Volume persistence
├── pyproject.toml            # Khai báo gói ứng dụng Python (chatntq-rag) và dependencies
├── requirements.txt          # Danh sách các thư viện Python phụ thuộc cần cài đặt
├── README.md                 # Tài liệu mô tả kiến trúc và hướng dẫn vận hành dự án
│
├── data/                     # Quản lý tập trung dữ liệu của hệ thống RAG
│   ├── raw/                  # Nơi chứa tài liệu thô đầu vào (.txt, .md, .pdf)
│   │   ├── RAG.md            # Tài liệu tri thức chuẩn về RAG và hướng dẫn dự án
│   │   └── sales.md          # Tài liệu test dữ liệu bảng biểu bán hàng & tính toán
│   └── processed/            # Nơi lưu trữ tập tin kho dữ liệu vector store (.npz & .meta.json)
│
├── src/                      # Mã nguồn chính của ứng dụng
│   ├── api/                  # Tầng Web API & Giao diện Demo minh họa
│   │   ├── __init__.py       # Đánh dấu package Python cho tầng API
│   │   ├── main.py           # Khởi tạo FastAPI, CORS, mount file tĩnh & bộ lọc log EndpointFilter
│   │   ├── routes.py         # Định nghĩa các REST Endpoints (/api/chat, /api/documents, /api/upload...)
│   │   ├── schemas.py        # Các mô hình Pydantic xác thực dữ liệu đầu vào/đầu ra (kèm ChatMessage)
│   │   └── static/           # Tài nguyên giao diện Web Single Page Application
│   │       ├── index.html    # Cấu trúc HTML giao diện Dark Mode kèm Thẻ câu hỏi mẫu
│   │       ├── css/
│   │       │   └── style.css # Hệ thống thiết kế CSS (Dark Theme, Glassmorphism, Session List)
│   │       └── js/
│   │           └── app.js    # Logic JS phía client (LocalStorage Session Manager, Event Delegation)
│   │
│   └── rag/                  # Package lõi xử lý quy trình Data & AI RAG Engine
│       ├── __init__.py       # Đánh dấu package Python và xuất bản lớp RAGPipeline
│       ├── config.py         # Đọc thiết lập môi trường .env vào đối tượng Settings bất biến
│       ├── loader.py         # Đọc và trích xuất dữ liệu từ các tập tin .txt, .md và .pdf
│       ├── chunker.py        # Thuật toán phân đoạn văn bản (chunking) kèm độ chồng lấn (overlap)
│       ├── embeddings.py     # Quản lý mô hình nhúng vector cục bộ sentence-transformers (E5)
│       ├── vector_store.py   # Kho lưu trữ vector, chuẩn hóa L2 và thuật toán Cosine Similarity bằng NumPy
│       ├── llm.py            # Giao diện đóng gói các cuộc gọi API tới Google Gemini LLM
│       ├── prompts.py        # Thiết kế System Instructions và Prompt Templates kiểm soát ảo giác
│       └── pipeline.py       # Bộ điều phối chính kết nối Ingest, Auto-reload & Standalone Query Rewriting
│
├── scripts/                  # Các kịch bản khởi chạy dự án
│   ├── run_web.py            # Script khởi chạy máy chủ Web FastAPI (host=0.0.0.0, port=8000)
│   ├── ingest.py             # Script dòng lệnh (CLI) nạp tài liệu vào kho vector
│   └── ask.py                # Script dòng lệnh (CLI) hỏi đáp Multi-turn trong terminal
│
└── tests/                    # Thư mục kiểm thử tự động
    ├── test_api.py           # Bộ kiểm thử unit test cho các đường dẫn API Endpoints
    └── test_smoke.py         # Bộ kiểm thử smoke test cho thuật toán chia chunk và vector search
```

---

## 5. Công Nghệ & Thư Viện Sử Dụng

| Phân Loại | Thư Viện / Công Nghệ | Công Dụng Chi Tiết |
| :--- | :--- | :--- |
| **Ngôn ngữ** | Python 3.10+ | Môi trường phát triển cốt lõi |
| **Mô hình Embedding** | `sentence-transformers` / `multilingual-e5-base` | Biến đổi văn bản thành vector 768 chiều cục bộ |
| **Đại số & Vector** | `NumPy` | Tính toán ma trận vector và độ tương đồng Cosine |
| **LLM Chat** | `google-genai` (Gemini API) | Sinh phản hồi tổng hợp từ ngữ cảnh trích xuất |
| **Xử lý Tài liệu** | `pypdf`, `pathlib` | Đọc dữ liệu tập tin PDF, Markdown, Text |
| **Backend API** | `FastAPI`, `Uvicorn` | RESTful API bất đồng bộ kèm bộ lọc log `EndpointFilter` |
| **Frontend UI** | HTML5, CSS3, JavaScript (Vanilla) | Single Page Application với LocalStorage Session Manager |
| **Testing** | `pytest` | Kiểm thử tự động thuật toán chia chunk & vector search |
| **Đóng gói** | `Docker`, `Docker Compose` | Đóng gói ứng dụng Containerized tối ưu hóa weights model |

---

## 6. Hướng Dẫn Cài Đặt & Chạy Trên Máy Cục Bộ

### Bước 6.1 — Khởi Tạo Môi Trường Ảo

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

### Bước 6.2 — Cài Đặt Thư Viện Phụ Thuộc

```powershell
pip install -r requirements.txt
```

### Bước 6.3 — Cấu Hình API Key

Sao chép `.env.example` thành `.env` và điền `GEMINI_API_KEY`:

```env
GEMINI_API_KEY=dán_api_key_của_bạn_vào_đây
GEMINI_CHAT_MODEL=gemini-flash-latest
EMBED_MODEL=intfloat/multilingual-e5-base
RAG_CHUNK_SIZE=800
RAG_CHUNK_OVERLAP=120
RAG_TOP_K=8
```

### Bước 6.4 — Chạy Demo Kiểm Thử

#### Cách A: Mở Giao diện Demo Web (Interactive UI Demo)
```powershell
python scripts/run_web.py
```
*Trình duyệt sẽ mở `http://127.0.0.1:8000` để bạn trải nghiệm thử nghiệm đặt câu hỏi.*

#### Cách B: Chạy Nạp Data & Thử Nghiệm Qua CLI (Terminal)
Nạp dữ liệu tài liệu thô trong `data/raw/`:
```powershell
python scripts/ingest.py
```
Đặt câu hỏi trực tiếp:
```powershell
python scripts/ask.py "RAG khác Fine-tuning như thế nào?"
```

---

## 7. Kiểm Thử Tự Động (Automated Testing)

Chạy pytest để kiểm tra độ chính xác của các thuật toán xử lý dữ liệu và vector search:

```powershell
pytest
```

---

## 8. Đóng Gói & Triển Khai Docker (Containerization & Deployment)

Dự án đã được hoàn thiện đóng gói Docker Image tối ưu hóa dung lượng (Python 3.11-slim) và nạp sẵn weights mô hình embedding để khởi động cực nhanh trên mọi môi trường Server/Cloud.

### Cách A — Khởi chạy & Theo dõi trực tiếp bằng Docker Compose (Khuyên dùng)

```bash
docker-compose up --build
```
- *Trình duyệt truy cập giao diện Web UI tại: `http://localhost:8000`.*
- *Dòng Log nhật ký sẽ hiển thị trực tiếp trên Terminal.*
- *Khi muốn dừng máy chủ, chỉ cần bấm **`Ctrl + C`**.*

### Cách B — Khởi chạy ở chế độ chạy ngầm (Background Mode)

```bash
docker-compose up -d --build
```

### Cách C — Build & Run thủ công bằng Docker CLI

```bash
# 1. Build Docker Image
docker build -t chatntq-rag .

# 2. Khởi chạy Docker Container
docker run -p 8000:8000 --env-file .env -v ${PWD}/data/raw:/app/data/raw --name chatntq_rag_app chatntq-rag
```
