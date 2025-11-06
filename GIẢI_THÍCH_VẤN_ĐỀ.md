# ⚠️ VẤN ĐỀ: Nhiều hình trong cùng khung hình

## 🔴 TẠI SAO MARKER KHÔNG HOẠT ĐỘNG?

Bạn đang gặp vấn đề vì **hình ảnh marker nằm chung khung với các hình ảnh khác**. Đây là vấn đề phổ biến với NFT marker trong AR.js.

### Ví dụ:

```
┌─────────────────────────────────┐
│  [Hình A]  [Hình B]  [Hình C]  │  ← Một khung hình lớn
│  [Hình D]  [Hình E]  [Hình F]  │     có 6 hình nhỏ
└─────────────────────────────────┘
```

Khi bạn:
1. ✅ Tạo marker NFT cho **Hình B** (riêng lẻ)
2. ❌ Nhưng quét **toàn bộ khung hình** (có cả A, B, C, D, E, F)

→ **AR.js KHÔNG THỂ nhận diện** vì:
- Feature points của Hình B bị lẫn với A, C, D, E, F
- Kích thước và tỷ lệ không khớp
- Marker chỉ train với Hình B, không phải cả khung

---

## ✅ GIẢI PHÁP

### Option 1: TÁCH RIÊNG TỪNG HÌNH (KHUYẾN NGHỊ NHẤT ⭐)

#### Bước 1: Crop từng hình riêng lẻ
```
Hình A.jpg  →  Tạo marker riêng  →  video1.mp4
Hình B.jpg  →  Tạo marker riêng  →  video2.mp4
Hình C.jpg  →  Tạo marker riêng  →  video3.mp4
```

#### Bước 2: Tạo NFT marker cho TỪNG hình
1. Vào https://carnaux.github.io/NFT-Marker-Creator/
2. Upload **Hình A.jpg** (chỉ hình A, không có gì khác)
3. Tải về: `imageA.fset`, `imageA.fset3`, `imageA.iset`
4. Lặp lại cho Hình B, C, D...

#### Bước 3: In hoặc hiển thị TỪNG HÌNH RIÊNG
- **In ra giấy**: Mỗi hình một tờ giấy riêng
- **Hiển thị màn hình**: Mỗi lần hiển thị 1 hình đầy màn hình
- **Không quét** từ khung hình chung có nhiều hình

#### Bước 4: Cấu trúc thư mục
```
public/
  asset1/
    imageA.fset
    imageA.fset3
    imageA.iset
    video1.mp4
  asset2/
    imageB.fset
    imageB.fset3
    imageB.iset
    video2.mp4
```

---

### Option 2: TRAIN MARKER VỚI TOÀN BỘ KHUNG HÌNH

Nếu bắt buộc phải giữ nguyên khung hình:

#### Bước 1: Train với toàn bộ khung
1. Upload **TOÀN BỘ khung hình** (có cả A, B, C, D, E, F) vào NFT Marker Creator
2. Tạo marker cho cả khung lớn đó

#### Bước 2: Đặt nhiều video trên cùng 1 marker
```tsx
<a-nft
  id="whole-frame"
  type="nft"
  url="/assets/whole-frame-marker"
  play-on-scan
>
  {/* Video cho Hình A - vị trí trên trái */}
  <a-video
    src="#videoA"
    width="0.5" height="0.5"
    position="-0.8 0.5 0"
    rotation="-90 0 0"
  ></a-video>

  {/* Video cho Hình B - vị trí trên giữa */}
  <a-video
    src="#videoB"
    width="0.5" height="0.5"
    position="0 0.5 0"
    rotation="-90 0 0"
  ></a-video>

  {/* Video cho Hình C - vị trí trên phải */}
  <a-video
    src="#videoC"
    width="0.5" height="0.5"
    position="0.8 0.5 0"
    rotation="-90 0 0"
  ></a-video>

  {/* Tương tự cho D, E, F... */}
</a-nft>
```

#### Nhược điểm:
- ❌ Phải quét toàn bộ khung hình lớn
- ❌ Khó tracking nếu khung quá lớn
- ❌ Không linh hoạt

---

## 🧪 KIỂM TRA NHANH

### Test 1: Kiểm tra video có hoạt động không

1. Refresh trang web
2. Nhấn nút **"Test Video 1"** và **"Test Video 2"**
3. Nếu video chạy → ✅ Video OK, vấn đề là marker
4. Nếu video không chạy → ❌ Vấn đề là file video

### Test 2: Kiểm tra marker có load không

1. Mở Console (F12)
2. Xem có thông báo:
   ```
   📍 Found 2 NFT markers
   🎯 Marker initialized: marker1
   🎯 Marker initialized: marker2
   [info] Loading of NFT data complete
   ```
3. Nếu có → ✅ Marker đã load
4. Nếu không → ❌ File marker bị lỗi

### Test 3: Kiểm tra marker có phát hiện không

1. Quét hình ảnh
2. Xem Console có hiện:
   ```
   ✅ Marker found! marker1
   📹 Video element found
   ✅ Video playing: #video1
   ```
3. Nếu có log "Marker found" → ✅ Marker nhận diện được
4. Nếu không có → ❌ **ĐÂY LÀ VẤN ĐỀ CỦA BẠN**

---

## 🎯 KẾT LUẬN

**Vấn đề của bạn:**
- ✅ Marker đã load thành công
- ✅ Code hoạt động đúng
- ❌ **Marker KHÔNG ĐƯỢC PHÁT HIỆN** vì:
  - Quét hình không khớp với hình đã train
  - Hoặc hình nằm chung khung với nhiều hình khác

**Giải pháp:**
1. **Crop từng hình ra file riêng**
2. **Tạo NFT marker cho TỪNG hình riêng lẻ**
3. **Quét TỪNG hình riêng** (không quét khung chung)

---

## 📞 CẦN TRỢ GIÚP?

### Câu hỏi thường gặp:

**Q: Tôi không thể tách riêng được, phải làm sao?**
A: Dùng Option 2 - train marker với toàn bộ khung hình

**Q: Marker vẫn không nhận diện sau khi tách riêng?**
A: Kiểm tra:
- Hình có đủ sáng không?
- Hình có rõ nét không?
- Hình có độ tương phản cao không?
- Khoảng cách camera: 20-50cm

**Q: Có cách nào khác không?**
A: Thử dùng Pattern Marker (Hiro/Kanji) thay vì NFT marker

**Q: Video chạy nhưng không hiển thị trên marker?**
A: Điều chỉnh `position` và `rotation` của `<a-video>`

---

## 🔗 TÀI LIỆU THAM KHẢO

- NFT Marker Creator: https://carnaux.github.io/NFT-Marker-Creator/
- AR.js Documentation: https://ar-js-org.github.io/AR.js-Docs/
- A-Frame: https://aframe.io/docs/

---

**Tóm lại: Hãy crop từng hình riêng lẻ và tạo marker riêng cho từng hình!** 🎯
