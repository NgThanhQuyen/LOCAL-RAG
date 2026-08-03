# HƯỚNG DẪN KẾT THỨC VÀ TRIỂN KHAI DỰ ÁN CHATNTQ RAG

---

## PHẦN 1: CÁC KIẾN THỨC CƠ BẢN VỀ RAG (RETRIEVAL-AUGMENTED GENERATION)

### 1. Khái niệm RAG là gì?
RAG (**Retrieval-Augmented Generation** - Sinh câu trả lời tăng cường bằng tra cứu) là một kỹ thuật tiên tiến trong xử lý ngôn ngữ tự nhiên (NLP) và AI. RAG kết hợp hai sức mạnh:
- **Retrieval (Tra cứu)**: Tìm kiếm các đoạn văn bản có nội dung liên quan nhất từ kho tài liệu riêng của bạn.
- **Generation (Sinh văn bản)**: Đưa các đoạn tài liệu vừa tìm được vào mô hình ngôn ngữ lớn (LLM như Gemini) để tổng hợp và trả lời.

**Lợi ích**: Giúp AI trả lời chính xác dựa trên tài liệu thực tế, tránh bịa đặt thông tin (hallucination) và luôn có trích dẫn nguồn rõ ràng.

---

### 2. Quy trình 6 bước hoạt động cốt lõi của RAG
1. **Load (Nạp tài liệu)**: Đọc các tập tin văn bản thô (`.txt`, `.md`, `.pdf`) từ thư mục chứa dữ liệu.
2. **Chunk (Phân đoạn)**: Chia tài liệu dài thành các đoạn nhỏ (`chunk_size=800` ký tự) có độ gối đầu (`chunk_overlap=120` ký tự).
3. **Embed (Tạo Vector)**: Dùng mô hình Embedding biến đổi từng đoạn văn thành một vector số nhiều chiều (768 chiều).
4. **Store (Lưu trữ)**: Lưu danh sách các vector và dữ liệu văn bản tương ứng vào kho chứa Vector Store.
5. **Retrieve (Tra cứu)**: Chuyển câu hỏi của người dùng thành vector, dùng thuật toán Cosine Similarity để tìm ra Top-K đoạn tài liệu có độ tương đồng cao nhất.
6. **Generate (Sinh phản hồi)**: Đưa Top-K đoạn tài liệu cùng câu hỏi và lịch sử hội thoại vào prompt gửi cho LLM để sinh ra câu trả lời hoàn chỉnh.

---

### 3. Khái niệm Embedding, Cosine Similarity và Vector Store
- **Embedding**: Là quá trình chuyển đổi từ ngữ hoặc đoạn văn bản thành vector số 768 chiều. Hai đoạn văn có ý nghĩa tương đồng sẽ nằm gần nhau trong không gian vector.
- **Cosine Similarity**: Công thức toán học đo góc giữa hai vector để xác định mức độ giống nhau về ngữ nghĩa (giá trị từ 0 đến 1, 1 là hoàn toàn giống nghĩa).
- **Vector Store**: Cơ sở dữ liệu chuyên dụng dùng để lưu trữ các vector và thực hiện phép nhân ma trận tìm kiếm ngữ nghĩa cực nhanh.

---

### 4. So sánh RAG và Fine-tuning
- **RAG**: Phù hợp cho việc tra cứu tài liệu kiến thức thay đổi thường xuyên, cập nhật dữ liệu mới tức thì, chi phí triển khai thấp và có trích dẫn nguồn rõ ràng.
- **Fine-tuning**: Phù hợp cho việc thay đổi văn phong, giọng điệu hoặc huấn luyện mô hình thực hiện một tác vụ định dạng chuyên biệt, tốn chi phí và thời gian huấn luyện lại khi dữ liệu thay đổi.

---

## PHẦN 2: THÔNG TIN VỀ DỰ ÁN CHATNTQ RAG

### 2.1. Giới thiệu dự án ChatNTQ RAG
**ChatNTQ RAG** là hệ thống Hỏi - Đáp dựa trên RAG được thiết kế và xây dựng tối ưu cho các bài toán Data Science và AI Engineer:
- **Mô hình Embedding Cục bộ**: Sử dụng `intfloat/multilingual-e5-base` chạy **cục bộ 100% trên máy** qua thư viện `sentence-transformers`. Không tốn chi phí hay hạn ngạch API khi tạo vector.
- **Vector Store Tự phát triển**: Sử dụng thư viện `NumPy` để thực hiện chuẩn hóa $L_2$ và nhân ma trận Cosine Similarity ($Q \cdot V^T$) tốc độ cao.
- **LLM Chat & Tổng hợp**: Sử dụng Google Gemini API (`gemini-flash-latest`) để sinh câu trả lời tự nhiên, chính xác từ ngữ cảnh.
- **Trí nhớ hội thoại Multi-turn**: Tự động phân tích và tái cấu trúc câu hỏi nối tiếp (Standalone Query Rewriting) để AI ghi nhớ lịch sử cuộc trò chuyện.
- **Tự động nạp dữ liệu (Auto-ingest)**: Hệ thống tự phát hiện khi bạn thêm/sửa file mới trong `data/raw/` để tự động nạp lại kho vector.

---

### 2.2. Lưu ý và Kinh nghiệm tối ưu khi sử dụng ChatNTQ RAG
- **Cơ chế hoạt động của thuật toán Top-K Retrieval**:
  Khi bạn đặt câu hỏi, thuật toán tìm kiếm vector sẽ quét qua **TOÀN BỘ** các tập tin tài liệu có trong thư mục `data/raw/` để trích xuất ra Top-K đoạn văn bản có độ tương đồng cao nhất.
- **Kinh nghiệm tối ưu độ chính xác tra cứu**:
  Khi trong thư mục `data/raw/` chứa quá nhiều tập tin thuộc các chủ đề khác nhau (ví dụ vừa có dữ liệu bán hàng `sales.md`, vừa có tài liệu lý thuyết `RAG.md`), các đoạn văn bản thuộc Top-K trích xuất có thể bị chia nhỏ và phân tán giữa nhiều tập tin.
  
  **Lời khuyên tối ưu**: Để đạt được độ chính xác tuyệt đối và câu trả lời sâu sắc nhất cho một chủ đề cụ thể, bạn nên **chỉ giữ duy nhất tập tin tài liệu thuộc chủ đề đó trong kho dữ liệu** khi hỏi đáp. Việc này đảm bảo toàn bộ Top-K đoạn tài liệu được trích xuất đều tập trung 100% vào tập tin mục tiêu, không bị nhiễu bởi các tài liệu không liên quan.