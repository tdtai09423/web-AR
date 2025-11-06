# Hướng dẫn tạo và sử dụng NFT Marker

## ⚠️ VẤN ĐỀ QUAN TRỌNG: Marker trong khung hình chung

Nếu hình ảnh marker của bạn **nằm chung khung với các hình khác**, AR.js sẽ **KHÔNG THỂ nhận diện** được vì:

- NFT marker cần nhìn thấy **TOÀN BỘ hình ảnh đã train**
- Các feature points bị nhiễu bởi hình ảnh xung quanh
- Kích thước và tỷ lệ không khớp

## ✅ GIẢI PHÁP

### Phương án 1: Tạo marker riêng lẻ (KHUYẾN NGHỊ)

1. **Crop từng hình ảnh riêng lẻ**
   ```
   Thay vì: [Hình1] [Hình2] [Hình3] trong cùng 1 khung
   
   Làm thành: 
   - Hình1.jpg (riêng lẻ)
   - Hình2.jpg (riêng lẻ)
   - Hình3.jpg (riêng lẻ)
   ```

2. **Tạo NFT marker cho TỪNG hình riêng**
   - Truy cập: https://carnaux.github.io/NFT-Marker-Creator/
   - Upload từng hình riêng lẻ
   - Tải về file .fset, .fset3, .iset cho từng marker

3. **In hoặc hiển thị từng hình riêng lẻ**
   - In từng hình ra giấy riêng
   - Hoặc hiển thị từng hình một trên màn hình/tablet

### Phương án 2: Tạo marker cho TOÀN BỘ khung hình

Nếu không thể tách riêng, bạn có thể:

1. **Train marker với TOÀN BỘ khung hình**
   - Upload toàn bộ ảnh có nhiều hình nhỏ vào NFT Marker Creator
   - Tạo marker cho cả khung hình lớn

2. **Quét toàn bộ khung hình**
   - Khi sử dụng, phải quét TOÀN BỘ khung hình đó
   - Video/content sẽ hiển thị ở vị trí bạn chỉ định

3. **Tạo nhiều video targets**
   - Đặt nhiều `<a-video>` ở các vị trí khác nhau trong cùng 1 marker
   - Mỗi video sẽ xuất hiện ở vị trí tương ứng với hình ảnh con

### Phương án 3: Sử dụng Pattern Marker (Hiro/Kanji)

Nếu NFT không hiệu quả, thử dùng Pattern Marker:

```html
<!-- Thay vì NFT -->
<a-marker preset="hiro">
  <a-video src="#video1" ...></a-video>
</a-marker>

<!-- Hoặc tạo pattern tùy chỉnh -->
<a-marker type="pattern" url="pattern-marker.patt">
  <a-video src="#video2" ...></a-video>
</a-marker>
```

## 📋 CHECKLIST để Marker hoạt động tốt

- [ ] Hình ảnh marker có **độ tương phản cao**
- [ ] Hình ảnh có **nhiều chi tiết đặc trưng** (góc cạnh, texture)
- [ ] **Không bị mờ** hoặc nhiễu
- [ ] Kích thước tối thiểu: **480x480px**
- [ ] Tỷ lệ khung hình phù hợp (vuông hoặc 16:9)
- [ ] **ÁNH SÁNG đủ** khi quét
- [ ] Camera **ổn định**, không rung
- [ ] Khoảng cách phù hợp: **20-50cm**

## 🎯 KHUYẾN NGHỊ TỐT NHẤT

**Cho trường hợp của bạn (nhiều hình trong 1 khung):**

1. **Crop từng hình ra file riêng**
2. **Tạo NFT marker cho TỪNG hình**
3. **In/hiển thị từng hình riêng lẻ**
4. **Mỗi hình → 1 marker → 1 video**

Điều này đảm bảo:
- ✅ Độ chính xác cao
- ✅ Tracking ổn định
- ✅ Hiệu suất tốt
- ✅ Dễ bảo trì

## 🔧 CODE MẪU

```tsx
// Marker riêng lẻ
<a-nft
  id="marker1"
  type="nft"
  url="/asset1/image1"  // Hình 1 riêng lẻ
  play-on-scan
>
  <a-video src="#video1" width="1.6" height="0.9" />
</a-nft>

<a-nft
  id="marker2"
  type="nft"
  url="/asset2/image2"  // Hình 2 riêng lẻ
  play-on-scan
>
  <a-video src="#video2" width="1.6" height="0.9" />
</a-nft>
```

## ❓ TẠI SAO MARKER KHÔNG HOẠT ĐỘNG?

### Nguyên nhân thường gặp:

1. **Hình ảnh không khớp**
   - Quét hình khác với hình đã train marker
   - Hình bị crop hoặc thêm viền

2. **Chất lượng kém**
   - Ánh sáng yếu
   - Camera mờ
   - Hình in không rõ nét

3. **Khoảng cách không phù hợp**
   - Quá gần: < 10cm
   - Quá xa: > 100cm

4. **Marker kém chất lượng**
   - Hình quá đơn giản
   - Không có feature points rõ ràng
   - Màu sắc quá đồng nhất

## 🚀 BƯỚC TIẾP THEO

1. **Kiểm tra Console** (F12) xem có log `✅ Marker found!` không
2. **Nếu có log** → Video element có vấn đề
3. **Nếu không có log** → Marker không được nhận diện
   - Kiểm tra lại hình ảnh đang quét
   - Đảm bảo quét đúng hình đã tạo marker
   - Cải thiện điều kiện ánh sáng và khoảng cách

## 📞 DEBUG

Thêm vào Console để debug:
```javascript
// Xem marker đã load chưa
console.log(document.querySelectorAll('a-nft'));

// Xem video elements
console.log(document.querySelectorAll('video'));

// Test play video trực tiếp
document.querySelector('#video1').play();
```
