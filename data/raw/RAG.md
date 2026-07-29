# TÀI LIỆU KIẾN THỨC VÀ HƯỚNG DẪN DỰ ÁN CHATNTQ RAG

---

## PHẦN 1: KIẾN THỨC TỔNG QUAN VỀ RAG (RETRIEVAL-AUGMENTED GENERATION)

### 1. RAG là gì?
RAG (Retrieval-Augmented Generation — Sinh câu trả lời tăng cường truy hồi) là kỹ thuật tiên tiến kết hợp giữa **Tìm kiếm thông tin (Retrieval)** và **Mô hình ngôn ngữ lớn (LLM)**. 

Thay vì buộc LLM phải tự trả lời dựa trên bộ nhớ đã học (vốn có thể bị lỗi thời hoặc xuất hiện ảo giác), hệ thống RAG sẽ:
1. Truy tìm các đoạn văn bản chứa thông tin liên quan nhất từ kho dữ liệu riêng.
2. Ghép các đoạn tài liệu này vào ngữ cảnh (context) kèm theo câu hỏi.
3. Đưa cho LLM đọc ngữ cảnh và tổng hợp ra câu trả lời chính xác, bám sát thực tế.

---

### 2. Vì sao cần sử dụng RAG?
Mặc dù các LLM hiện đại rất thông minh, chúng vẫn gặp các hạn chế lớn:
- **Hiện tượng ảo giác (Hallucination)**: LLM có thể bịa ra thông tin không có thật với phong cách rất tự tin.
- **Giới hạn tri thức**: LLM không truy cập được dữ liệu nội bộ riêng của cá nhân hay doanh nghiệp.
- **Khó cập nhật thông tin**: Muốn bổ sung kiến thức mới cho LLM bằng cách huấn luyện lại (Fine-tuning) tốn rất nhiều chi phí và thời gian.

**Giải pháp RAG giúp**:
- Đảm bảo câu trả lời luôn dựa trên tài liệu thật, có trích dẫn nguồn rõ ràng.
- Giảm thiểu tối đa hiện tượng ảo giác.
- Dễ dàng cập nhật dữ liệu mới: chỉ cần nạp thêm file văn bản vào hệ thống mà không cần tốn chi phí huấn luyện lại mô hình.

---

### 3. Quy trình 6 bước cốt lõi của một hệ thống RAG

#### Giai đoạn Offline (Nạp dữ liệu — Ingest):
1. **Load (Đọc tài liệu)**: Đọc các tập tin tài liệu thô (.txt, .md, .pdf) vào bộ nhớ.
2. **Chunk (Phân đoạn)**: Chia nhỏ văn bản dài thành các đoạn văn ngắn (chunk) có độ dài vừa phải và có độ chồng lấn (overlap) để giữ trọn vẹn ngữ cảnh.
3. **Embed (Tạo Vector)**: Biến đổi từng đoạn văn bản thành một chuỗi số thực (vector nhúng) biểu diễn ngữ nghĩa.
4. **Store (Lưu trữ)**: Lưu các vector cùng thông tin văn bản gốc vào kho dữ liệu Vector Store.

#### Giai đoạn Online (Hỏi đáp — Query):
5. **Retrieve (Truy hồi)**: Chuyển câu hỏi của người dùng thành vector, tính điểm tương đồng Cosine Similarity để lấy ra Top-K đoạn tài liệu liên quan nhất.
6. **Generate (Sinh câu trả lời)**: Ghép câu hỏi cùng ngữ cảnh tài liệu tìm được vào prompt và gửi cho LLM để sinh câu trả lời hoàn chỉnh.

---

### 4. Khái niệm Embedding, Cosine Similarity và Vector Store
- **Embedding**: Là việc chuyển đổi từ ngữ hoặc đoạn văn bản thành một vector số nhiều chiều (ví dụ 768 chiều). Hai đoạn văn có ý nghĩa tương đồng nhau sẽ có hai vector nằm gần nhau trong không gian.
- **Cosine Similarity**: Công thức toán học đo góc giữa hai vector để xác định mức độ giống nhau về mặt ngữ nghĩa (giá trị từ 0 đến 1, trong đó 1 là hoàn toàn giống nghĩa).
- **Vector Store**: Cơ sở dữ liệu chuyên dụng dùng để lưu trữ các vector và thực hiện phép nhân ma trận tìm kiếm ngữ nghĩa cực nhanh.

---

### 5. So sánh RAG và Fine-tuning
- **RAG**: Phù hợp cho việc tra cứu tài liệu, kiến thức thay đổi thường xuyên, cần trích dẫn nguồn và triển khai nhanh chóng với chi phí thấp.
- **Fine-tuning**: Phù hợp cho việc thay đổi văn phong, giọng điệu hoặc huấn luyện mô hình thực hiện một tác vụ định dạng chuyên biệt.

---

## PHẦN 2: THÔNG TIN CHI TIẾT VỀ DỰ ÁN CHATNTQ RAG

### 1. Giới thiệu Dự án ChatNTQ RAG
ChatNTQ RAG là ứng dụng Web AI hỏi đáp tài liệu thông minh full-stack, được xây dựng theo kiến trúc tách biệt giữa **Backend REST API (FastAPI)** và **Frontend Web UI (giao diện ChatGPT Dark Mode)**.

---

### 2. Kiến trúc Công nghệ của Dự án ChatNTQ RAG

| Thành phần | Công nghệ / Thư viện | Mô tả |
| :--- | :--- | :--- |
| **LLM Chat** | Google Gemini (`google-genai` SDK) | Sử dụng mô hình `gemini-flash-latest` để tổng hợp và sinh câu trả lời cuối cùng từ ngữ cảnh. |
| **Embedding Model** | `intfloat/multilingual-e5-base` | Mô hình nhúng đa ngôn ngữ chạy **cục bộ 100% trên máy** qua thư viện `sentence-transformers` (miễn phí, không tốn quota API). |
| **Vector Store** | Custom `VectorStore` (NumPy) | Tự phát triển bằng Python NumPy, chuẩn hóa L2 và tính Cosine Similarity trực tiếp qua phép nhân ma trận. |
| **Backend Framework** | FastAPI & Uvicorn | Cung cấp hệ thống RESTful API bất đồng bộ (`/api/chat`, `/api/documents`, `/api/upload`, `/api/ingest`, `/api/health`). |
| **Frontend UI** | HTML5, CSS3, JavaScript (ES6) | Giao diện Single-Page Application phong cách ChatGPT Dark Theme với hiệu ứng gõ chữ, bảng hiển thị % điểm tương đồng và modal xem trích dẫn nguồn. |

---

### 3. Giải đáp Thắc mắc về Vận hành Dự án (Project FAQ)

#### Q1: Làm thế nào để khởi chạy ứng dụng Web ChatNTQ RAG?
**Trả lời**: Trong giao diện dòng lệnh (PowerShell đã kích hoạt venv), bạn chạy lệnh:
```powershell
python scripts/run_web.py
```
Trình duyệt sẽ tự động mở giao diện Web tại địa chỉ `http://127.0.0.1:8000`.

#### Q2: Tôi có thể nạp thêm tài liệu mới vào hệ thống bằng cách nào?
**Trả lời**: Bạn có thể nạp tài liệu theo 2 cách:
1. **Trên giao diện Web**: Thao tác kéo thả tập tin `.txt`, `.md`, hoặc `.pdf` vào ô Upload ở thanh Sidebar bên trái. Hệ thống sẽ tự động lưu và nạp lại Vector Store.
2. **Thủ công**: Thêm file vào thư mục `data/raw/` rồi chạy lệnh `python scripts/ingest.py` trong terminal.

#### Q3: Ứng dụng ChatNTQ RAG có thể chạy Offline được không?
**Trả lời**: Phần lớn quy trình RAG (bao gồm đọc tài liệu, chia chunk, tạo vector nhúng với model E5 và tìm kiếm vector) đều chạy **cục bộ 100% trên máy của bạn**. Chỉ riêng bước cuối cùng khi gửi ngữ cảnh cho Google Gemini sinh câu trả lời là cần có kết nối mạng internet.

#### Q4: Dự án đảm bảo tính an toàn dữ liệu và bảo mật như thế nào?
**Trả lời**:
- Khóa API bí mật (`GEMINI_API_KEY`) được lưu trữ trong tập tin `.env` cục bộ.
- Tập tin `.env` và các dữ liệu vector nhị phân trong `data/processed/` đã được chặn trong `.gitignore`, đảm bảo không bao giờ bị lộ hay push nhầm lên GitHub.

#### Q5: Các đường dẫn API chính của hệ thống gồm những gì?
**Trả lời**:
- `POST /api/chat`: Gửi câu hỏi và nhận câu trả lời RAG kèm trích dẫn nguồn.
- `GET /api/documents`: Xem danh sách tất cả file tài liệu trong kho `data/raw`.
- `POST /api/upload`: Tải file tài liệu mới lên máy chủ và kích hoạt nạp vector.
- `DELETE /api/documents/{filename}`: Xóa một file tài liệu và cập nhật lại kho vector.
- `POST /api/ingest`: Kích hoạt quá trình nạp dữ liệu thủ công.
- `GET /api/health`: Kiểm tra trạng thái hoạt động của máy chủ API và Vector Store.