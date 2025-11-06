# 📦 Danh sách Assets trong Project

## ✅ Đã cấu hình: 4 Markers + 4 Videos

### 📍 Asset 1
- **Thư mục**: `/public/asset1/`
- **Files**:
  - `video1.fset` ✓
  - `video1.fset3` ✓
  - `video1.iset` ✓
  - `video1.mp4` ✓
- **Marker ID**: `marker1`
- **Video ID**: `video1`
- **Kích thước video**: 1.6 x 0.9 (tỷ lệ 16:9)
- **Test Button**: 🟢 Xanh lá - "Test Video 1"

---

### 📍 Asset 2
- **Thư mục**: `/public/asset2/`
- **Files**:
  - `video2.fset` ✓
  - `video2.fset3` ✓
  - `video2.iset` ✓
  - `video2.mp4` ✓
- **Marker ID**: `marker2`
- **Video ID**: `video2`
- **Kích thước video**: 1.28 x 0.72
- **Test Button**: 🔵 Xanh dương - "Test Video 2"

---

### 📍 Asset 3
- **Thư mục**: `/public/asset3/`
- **Files**:
  - `video3.fset` ✓
  - `video3.fset3` ✓
  - `video3.iset` ✓
  - `video3.mp4` ✓
- **Marker ID**: `marker3`
- **Video ID**: `video3`
- **Kích thước video**: 1.6 x 0.9 (tỷ lệ 16:9)
- **Test Button**: 🟠 Cam - "Test Video 3"

---

### 📍 Asset 4
- **Thư mục**: `/public/asset4/`
- **Files**:
  - `video4.fset` ✓
  - `video4.fset3` ✓
  - `video4.iset` ✓
  - `video4.mp4` ✓
  - `image.png` (hình ảnh gốc marker)
- **Marker ID**: `marker4`
- **Video ID**: `video4`
- **Kích thước video**: 1.6 x 0.9 (tỷ lệ 16:9)
- **Test Button**: 🔴 Hồng - "Test Video 4"

---

## 🎮 Cách sử dụng

### 1. Test Videos (không cần marker)
1. Mở ứng dụng trong trình duyệt
2. Đợi loading xong
3. Nhấn các nút test để kiểm tra từng video:
   - 🟢 Test Video 1
   - 🔵 Test Video 2
   - 🟠 Test Video 3
   - 🔴 Test Video 4

### 2. Quét Markers
1. **Chuẩn bị hình ảnh gốc** mà bạn đã dùng để tạo marker
2. **In ra giấy** hoặc hiển thị trên màn hình khác
3. **Hướng camera** vào hình ảnh
4. **Giữ ổn định** cho đến khi video xuất hiện

### 3. Debug
Mở Console (F12) để xem logs:
```
🎯 Marker initialized: marker1
🎯 Marker initialized: marker2
🎯 Marker initialized: marker3
🎯 Marker initialized: marker4
📍 Found 4 NFT markers
```

Khi quét thành công:
```
✅ Marker found! marker1
📹 Video element found
🎬 Video src: #video1
✅ Video playing: #video1
```

---

## ⚠️ LƯU Ý QUAN TRỌNG

### Marker NFT yêu cầu:
- ✅ Hình ảnh gốc **giống hệt** với hình đã tạo marker
- ✅ Ánh sáng **đủ sáng**
- ✅ Camera **ổn định**, không rung
- ✅ Khoảng cách: **20-50cm**
- ✅ Hình ảnh **rõ nét**, không mờ

### ❌ Marker sẽ KHÔNG hoạt động nếu:
- ❌ Hình ảnh bị crop hoặc thêm viền
- ❌ Hình ảnh nằm chung khung với nhiều hình khác
- ❌ Hình ảnh bị mờ, tối, hoặc phản quang
- ❌ Camera quá gần (< 10cm) hoặc quá xa (> 100cm)

---

## 🔧 Thêm Asset mới

Nếu bạn muốn thêm asset5, asset6... làm theo các bước:

### Bước 1: Tạo thư mục
```
public/
  asset5/
    video5.fset
    video5.fset3
    video5.iset
    video5.mp4
```

### Bước 2: Thêm video vào `<a-assets>` trong App.tsx
```tsx
<video 
  id="video5"
  src="/asset5/video5.mp4"
  preload="auto" 
  loop={true} 
  playsInline 
  crossOrigin="anonymous"
></video>
```

### Bước 3: Thêm marker vào scene
```tsx
<a-nft
  id="marker5"
  type="nft"
  url="/asset5/video5"
  smooth="true"
  smoothCount="10"
  smoothTolerance=".01"
  smoothThreshold="5"
  play-on-scan
>
  <a-video
    src="#video5"
    width="1.6" 
    height="0.9"
    rotation="-90 0 0"
    position="0 0 0"
  ></a-video>
</a-nft>
```

### Bước 4: Thêm test button (optional)
```tsx
<button 
  onClick={() => testVideo('#video5')}
  style={{ 
    padding: '10px 20px', 
    margin: '5px',
    backgroundColor: '#9C27B0',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '12px'
  }}
>
  Test Video 5
</button>
```

---

## 📊 Tổng kết

| Asset | Marker ID | Video ID | Kích thước | Màu Button |
|-------|-----------|----------|------------|------------|
| Asset 1 | marker1 | video1 | 1.6 x 0.9 | 🟢 Xanh lá |
| Asset 2 | marker2 | video2 | 1.28 x 0.72 | 🔵 Xanh dương |
| Asset 3 | marker3 | video3 | 1.6 x 0.9 | 🟠 Cam |
| Asset 4 | marker4 | video4 | 1.6 x 0.9 | 🔴 Hồng |

---

## 🚀 Deploy

Trước khi deploy, hãy kiểm tra:
- [ ] Tất cả 4 videos test được
- [ ] Tất cả 4 markers load thành công (xem Console)
- [ ] Ít nhất 1 marker có thể được phát hiện khi quét
- [ ] Videos tự động play khi phát hiện marker
- [ ] Videos tự động pause khi mất marker

---

## 📞 Hỗ trợ

Nếu gặp vấn đề:
1. Đọc file `GIẢI_THÍCH_VẤN_ĐỀ.md`
2. Đọc file `MARKER_GUIDE.md`
3. Kiểm tra Console (F12) để xem logs
4. Đảm bảo hình ảnh marker đúng với hình đã tạo NFT

---

**Chúc may mắn! 🎉**
