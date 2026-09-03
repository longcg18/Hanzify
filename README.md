# HanziFlow 汉字流 - Hệ Thống Bài Tập Tiếng Trung Trực Tuyến

Nền tảng giao diện bài tập tiếng Trung thông minh, tinh gọn dành cho lớp học online. Hỗ trợ học sinh làm bài tập trên điện thoại/máy tính và hệ thống chấm điểm tự động.

## 🌟 Tính Năng Nổi Bật
- **Giao diện Modern Oriental EdTech**: Kết hợp giữa sắc xanh Ngọc Bích (`Imperial Jade`), Đỏ Son (`Vermilion`) và phông chữ Hán thư pháp (`Noto Serif SC`, `Ma Shan Zheng`).
- **Font chữ Be Vietnam Pro & Inter**: Tối ưu hiển thị 100% tiếng Việt chuẩn, không lỗi font hay nhảy dấu.
- **Hiển thị Pinyin 1-1**: Phiên âm Pinyin và thanh điệu chuẩn xác từng chữ Hán bằng thẻ `<ruby>`.
- **5 Dạng bài tập tiếng Trung cốt lõi**:
  1. *Luyện Nghe (听力题)*: Player tùy biến có sóng âm và nút chỉnh tốc độ (1.0x / 0.8x).
  2. *Pinyin & Thanh điệu (拼音题)*: Nhận diện thanh điệu và biến điệu ngữ âm (dōngxi).
  3. *Ghép câu tiếng Trung (连词成句)*: Thẻ từ vựng tương tác chạm/bấm mượt mà.
  4. *Luyện Nói & Ghi âm (口语录音)*: Thu âm trực tiếp trên web với HTML5 Web Audio API & MediaRecorder.
  5. *Nộp vở viết chữ Hán (汉字书写)*: Khung chữ Mễ ô ly (`米字格 / 田字格`), chụp ảnh nộp bài viết.
- **Chấm điểm tức thì & Hiệu ứng pháo hoa (Confetti 🎉)**: Tự động chấm câu trắc nghiệm, hiển thị lời giải chi tiết và gửi bài nói/viết cho cô giáo.

## 🚀 Hướng Dẫn Chạy Cục Bộ (Local)
Không cần cài đặt thư viện phức tạp, chỉ cần mở trực tiếp file `index.html` hoặc chạy qua bất kỳ local server nào:

```bash
# Sử dụng Python có sẵn:
python -m http.server 8080

# Truy cập trình duyệt:
http://localhost:8080
```
