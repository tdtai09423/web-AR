import { useState, useEffect } from 'react';
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
           * Hàm init() được gọi MỘT LẦN cho mỗi <a-nft> có gắn 'play-on-scan'.
           */
          init: function () {
            // this.el chính là thẻ <a-nft> (marker)
            const marker = this.el;
            const scanPromptEl = document.getElementById('scan-prompt');
            
            console.log('Marker initialized:', marker.id);

            // Khi tìm thấy marker
            marker.addEventListener('markerFound', () => {
              console.log('✅ Marker found!', marker.id);
              
              // Tìm video element bên trong marker
              const videoEl = marker.querySelector('a-video');
              if (videoEl) {
                // Lấy video HTML element từ src attribute
                const videoSrc = videoEl.getAttribute('src');
                const videoElement = document.querySelector(videoSrc);
                
                console.log('Video element:', videoElement);
                
                if (videoElement && videoElement.tagName === 'VIDEO') {
                  videoElement.play()
                    .then(() => console.log('✅ Video playing'))
                    .catch(err => console.error('❌ Error playing video:', err));
                }
              }
              
              activeMarkerCount++;
              console.log('Active marker count:', activeMarkerCount);
              
              // Ẩn prompt quét khi BẤT KỲ marker nào được tìm thấy
              if (scanPromptEl) scanPromptEl.style.display = 'none';
            });

            // Khi mất dấu marker
            marker.addEventListener('markerLost', () => {
              console.log('❌ Marker lost!', marker.id);
              
              const videoEl = marker.querySelector('a-video');
              if (videoEl) {
                const videoSrc = videoEl.getAttribute('src');
                const videoElement = document.querySelector(videoSrc);
                
                if (videoElement && videoElement.tagName === 'VIDEO') {
                  videoElement.pause();
                  console.log('⏸️ Video paused');
                }
              }
              
              activeMarkerCount--;
              console.log('Active marker count:', activeMarkerCount);
              
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
        console.log('🎬 A-Frame scene found, setting up loading screen');
        
        // Hàm để ẩn loading và hiện scan prompt
        const hideLoading = () => {
          console.log('✅ AR đã tải xong, ẩn màn hình loading');
          setIsLoading(false);
          setShowScanPrompt(true);
        };

        // Đợi camera được khởi tạo
        let cameraReady = false;
        const checkCamera = setInterval(() => {
          const video = document.querySelector('video');
          if (video && video.readyState >= 2) {
            console.log('📹 Camera ready');
            cameraReady = true;
            clearInterval(checkCamera);
          }
        }, 500);

        // Lắng nghe sự kiện arjs-video-loaded từ AR.js
        scene.addEventListener('arjs-video-loaded', () => {
          console.log('📱 AR.js video loaded');
          hideLoading();
        }, { once: true });

        // Kiểm tra nếu scene đã load xong
        if ((scene as any).hasLoaded) {
          console.log('🎬 Scene already loaded');
          hideLoading();
        } else {
          // Lắng nghe nhiều sự kiện để đảm bảo bắt được
          scene.addEventListener('loaded', () => {
            console.log('🎬 Scene loaded event');
            hideLoading();
          }, { once: true });
          
          // Timeout backup: nếu sau 5 giây vẫn chưa load, ẩn loading screen
          setTimeout(() => {
            console.log('⏱️ Timeout - ẩn loading screen sau 5 giây');
            hideLoading();
          }, 5000);
        }
      } else {
        console.log('⏳ Waiting for A-Frame scene...');
        // Nếu A-Frame chưa kịp khởi tạo, thử lại sau 100ms
        setTimeout(setupLoadingScreen, 100);
      }
    };

    setupLoadingScreen();

    // Debug: Log tất cả markers được tìm thấy
    setTimeout(() => {
      const markers = document.querySelectorAll('a-nft');
      console.log(`📍 Found ${markers.length} NFT markers:`, markers);
      
      markers.forEach((marker, index) => {
        console.log(`  Marker ${index + 1}:`, {
          id: marker.id,
          url: marker.getAttribute('url'),
          loaded: marker.hasAttribute('arjs-anchor')
        });
      });
    }, 2000);

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
            <br />
            <small style={{ fontSize: '12px', marginTop: '10px', display: 'block' }}>
              💡 Mẹo: Giữ camera ổn định, đảm bảo đủ ánh sáng và hình ảnh rõ nét
            </small>
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
        <a-nft
          id="marker1"
          type="nft"
          url="/asset1/video1"
          smooth="true"
          smoothCount="10"
          smoothTolerance=".01"
          smoothThreshold="5"
          play-on-scan
        >
          {/* Nội dung bên trong: liên kết tới video #video1 */}
          <a-video
            src="#video1"
            width="1.6" 
            height="0.9"
            rotation="-90 0 0"
            position="0 0 0"
          ></a-video>
        </a-nft>

        {/* === MARKER 2 === */}
        {/* Marker từ thư mục public/asset2 */}
        <a-nft
          id="marker2"
          type="nft"
          url="/asset2/video2"
          smooth="true"
          smoothCount="10"
          smoothTolerance=".01"
          smoothThreshold="5"
          play-on-scan
        >
          {/* Nội dung bên trong: liên kết tới video #video2 */}
          <a-video
            src="#video2"
            width="1.28" 
            height="0.72"
            rotation="-90 0 0"
            position="0 0 0"
          ></a-video>
        </a-nft>
        
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