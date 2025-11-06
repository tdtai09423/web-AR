import React, { useState, useEffect } from 'react';
import './App.css';

// Biến toàn cục để theo dõi số lượng marker đang được nhìn thấy
// Cần thiết cho logic ẩn/hiện prompt quét
let activeMarkerCount = 0;

function App() {
  const [isLoading, setIsLoading] = useState(true);
  // Vẫn dùng state của React để render màn hình chờ
  const [showScanPrompt, setShowScanPrompt] = useState(false);

  // useEffect này chỉ chạy 1 lần khi component được mount
  useEffect(() => {
    // Chúng ta sẽ "đăng ký" một component A-Frame tùy chỉnh.
    // Component này sẽ chứa logic play/pause cho TỪNG marker.
    // Điều này giúp code JSX của chúng ta sạch sẽ hơn rất nhiều.
    
    // Dùng (window as any) để TypeScript không phàn nàn về AFRAME
    // (Vì AFRAME được tải từ <script> trong index.html, không phải import)
    if ((window as any).AFRAME) {
      
      // Kiểm tra xem component đã được đăng ký chưa (để tránh lỗi HMR)
      if (!Object.keys((window as any).AFRAME.components).includes('play-on-scan')) {
        
        (window as any).AFRAME.registerComponent('play-on-scan', {
          /**
           * Hàm init() được gọi MỘT LẦN cho mỗi <a-entity> có gắn 'play-on-scan'.
           */
          init: function () {
            // this.el chính là thẻ <a-entity> (marker)
            const videoEl = this.el.querySelector('a-video');
            const scanPromptEl = document.getElementById('scan-prompt');

            // Khi tìm thấy marker
            this.el.addEventListener('markerFound', () => {
              if (videoEl) {
                const video: HTMLVideoElement = videoEl.object3D.el.srcElement;
                if (video) video.play();
              }
              
              activeMarkerCount++;
              // Ẩn prompt quét khi BẤT KỲ marker nào được tìm thấy
              if (scanPromptEl) scanPromptEl.style.display = 'none';
            });

            // Khi mất dấu marker
            this.el.addEventListener('markerLost', () => {
              if (videoEl) {
                const video: HTMLVideoElement = videoEl.object3D.el.srcElement;
                if (video) video.pause();
              }
              
              activeMarkerCount--;
              // Chỉ hiện lại prompt khi KHÔNG CÒN marker nào được thấy
              if (activeMarkerCount === 0 && scanPromptEl) {
                scanPromptEl.style.display = 'flex';
              }
            });
          }
        });
      }
    }

    // Logic xử lý màn hình tải (load)
    const setupLoadingScreen = () => {
      const scene = document.querySelector('a-scene');
      if (scene) {
        // 'hasLoaded' là một cờ của A-Frame
        if (scene.hasLoaded) {
          setIsLoading(false);
          setShowScanPrompt(true);
        } else {
          // 'arjs-nft-loaded' kích hoạt khi TẤT CẢ các tệp marker NFT đã tải xong
          scene.addEventListener('arjs-nft-loaded', () => {
            setIsLoading(false);
            setShowScanPrompt(true);
          }, { once: true }); // Chỉ chạy 1 lần
        }
      } else {
        // Nếu A-Frame chưa kịp khởi tạo, thử lại sau 100ms
        setTimeout(setupLoadingScreen, 100);
      }
    };

    setupLoadingScreen();

    // Không cần hàm cleanup vì component A-Frame tự quản lý vòng đời của nó
  }, []); // Mảng rỗng đảm bảo useEffect chỉ chạy 1 lần

  return (
    <>
      {/* Màn hình chờ tải */}
      {isLoading && (
        <div id="loader" className="overlay">
          <div>Đang tải dữ liệu AR...<br />Vui lòng chờ.</div>
        </div>
      )}

      {/* Hướng dẫn quét */}
      {showScanPrompt && (
        <div id="scan-prompt" className="overlay">
          <div>
            Hãy hướng camera vào một trong các ảnh đã đăng ký
          </div>
        </div>
      )}

      {/* Cảnh AR */}
      <a-scene
        id="ar-scene"
        vr-mode-ui="enabled: false;"
        renderer="logarithmicDepthBuffer: true;"
        embedded
        arjs="sourceType: webcam; trackingMethod: best; debugUIEnabled: false;"
      >
        <a-assets>
          {/* === TÀI SẢN 1 === */}
          {/* Video từ thư mục public/asset1 */}
          <video
            id="video1"
            src="/asset1/video1.mp4"
            preload="auto"
            loop={true}
            playsInline
            crossOrigin="anonymous"
          ></video>
          
          {/* === TÀI SẢN 2 === */}
          {/* Video từ thư mục public/asset2 */}
          <video 
            id="video2"
            src="/asset2/video2.mp4"
            preload="auto" 
            loop={true} 
            playsInline 
            crossOrigin="anonymous"
          ></video>

          {/* === THÊM CÁC VIDEO KHÁC CỦA BẠN VÀO ĐÂY === */}
          {/*
          <video id="video-3" src="/video-3.mp4" ... ></video>
          */}

        </a-assets>

        {/* === MARKER 1 === */}
        {/* Marker từ thư mục public/asset1 */}
        <a-entity
          id="marker1"
          type="nft"
          url="/asset1/video1"
          smooth="true"
          smoothCount="10"
          play-on-scan  // <-- Gắn component tùy chỉnh của chúng ta
        >
          {/* Nội dung bên trong: liên kết tới video #video1 */}
          <a-video
            src="#video1"
            width="1.6" height="0.9" // Tỷ lệ 16:9
            rotation="-90 0 0"
            position="0 0 -0.1"
          ></a-video>
        </a-entity>

        {/* === MARKER 2 === */}
        {/* Marker từ thư mục public/asset2 */}
        <a-entity
          id="marker2"
          type="nft"
          url="/asset2/video2"
          smooth="true"
          smoothCount="10"
          play-on-scan // <-- Gắn component tùy chỉnh của chúng ta
        >
          {/* Nội dung bên trong: liên kết tới video #video2 */}
          <a-video
            src="#video2"
            width="1.28" height="0.72" // Tỷ lệ khác
            rotation="-90 0 0"
            position="0 0 -0.1"
          ></a-video>
        </a-entity>
        
        {/* === THÊM CÁC MARKER KHÁC CỦA BẠN VÀO ĐÂY === */}
        {/*
        <a-entity
          id="marker-3"
          type="nft"
          url="/ten-marker-3"
          smooth="true"
          play-on-scan
        >
          <a-video
            src="#video-3"
            width="1" height="1" // Tỷ lệ 1:1
            rotation="-90 0 0"
          ></a-video>
        </a-entity>
        */}

        {/* Camera của người dùng */}
        <a-entity camera></a-entity>
      </a-scene>
    </>
  );
}

export default App;