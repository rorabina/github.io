// Register Service Worker, Truly Dynamic Cache Progress, and Scoped Android PWA Trigger
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // 1. Inject Floating Progress Bar UI
    const barContainer = document.createElement('div');
    barContainer.id = 'pwa-cache-status';
    barContainer.innerHTML = `
      <style>
        #pwa-cache-status {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 99999;
          background: rgba(18, 18, 18, 0.92);
          color: #ffffff;
          padding: 12px 16px;
          border-radius: 12px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          font-size: 13px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
          backdrop-filter: blur(8px);
          display: flex;
          flex-direction: column;
          gap: 6px;
          min-width: 220px;
          transition: opacity 0.4s ease, transform 0.4s ease;
        }
        .pwa-progress-track {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
          overflow: hidden;
        }
        .pwa-progress-fill {
          height: 100%;
          width: 0%;
          background: #3b82f6;
          transition: width 0.3s ease-out;
        }
        .pwa-text-row {
          display: flex;
          justify-content: space-between;
          font-weight: 500;
        }
      </style>
      <div class="pwa-text-row">
        <span id="pwa-status-label">Saving for offline use...</span>
        <span id="pwa-status-pct">0%</span>
      </div>
      <div class="pwa-progress-track">
        <div id="pwa-progress-fill" class="pwa-progress-fill"></div>
      </div>
    `;

    if (navigator.onLine && !localStorage.getItem('pwa_fully_cached')) {
      document.body.appendChild(barContainer);
    }

    // 2. Register Service Worker
    navigator.serviceWorker.register('/sw.js').then(reg => {
      console.log('SW Registered:', reg.scope);
    }).catch(err => console.error('SW Registration Failed:', err));

    // 3. Fully Dynamic Progress Tracking (No Hardcoded Counts)
    let dynamicTotal = 0;

    // Listen for broadcast total from Service Worker if available
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'CACHE_PROGRESS' && event.data.total) {
        dynamicTotal = event.data.total;
      }
    });

    let checkInterval = setInterval(async () => {
      try {
        const cacheKeys = await caches.keys();
        const precacheName = cacheKeys.find(key => key.includes('workbox-precache'));

        if (precacheName) {
          const cache = await caches.open(precacheName);
          const cachedRequests = await cache.keys();
          const currentCount = cachedRequests.length;

          // Dynamically adapt total target based on highest detected count or broadcast
          dynamicTotal = Math.max(dynamicTotal, currentCount);

          // Check Service Worker registration status to confirm precaching completed
          const swReg = await navigator.serviceWorker.getRegistration();
          const isSWActive = swReg && swReg.active && !swReg.installing;

          let percent = 0;
          if (dynamicTotal > 0) {
            percent = Math.min(Math.round((currentCount / dynamicTotal) * 100), 100);
          }

          // If SW installation is finished and assets are cached, force 100% completion
          if (isSWActive && currentCount > 0 && percent >= 95) {
            percent = 100;
          }

          const fill = document.getElementById('pwa-progress-fill');
          const pctText = document.getElementById('pwa-status-pct');
          const labelText = document.getElementById('pwa-status-label');

          if (fill) fill.style.width = percent + '%';
          if (pctText) pctText.innerText = percent + '%';

          // Dismiss bar smoothly when full
          if (percent >= 100) {
            clearInterval(checkInterval);
            if (labelText) labelText.innerText = 'Ready for offline use!';
            localStorage.setItem('pwa_fully_cached', 'true');

            setTimeout(() => {
              const widget = document.getElementById('pwa-cache-status');
              if (widget) {
                widget.style.opacity = '0';
                widget.style.transform = 'translateY(10px)';
                setTimeout(() => widget.remove(), 400);
              }
            }, 2000);
          }
        }
      } catch (err) {
        console.error('Cache progress tracking error:', err);
      }
    }, 400);
  });
}

// 4. Scoped Android Install Button Handling for app.html
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  console.log('beforeinstallprompt captured successfully.');
});

function initAndroidButton() {
  if (window.location.pathname.includes('app.html')) {
    const androidBtns = document.querySelectorAll('a[href*="android"], .btn-android, #android-install-btn, .btn');
    androidBtns.forEach(btn => {
      if (btn.textContent.includes('Android')) {
        btn.style.cursor = 'pointer';
        btn.addEventListener('click', async (evt) => {
          evt.preventDefault();
          evt.stopPropagation();
          if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`PWA Install Choice: ${outcome}`);
            deferredPrompt = null;
          } else {
            alert('PWA install prompt is ready or app is already installed!');
          }
        });
      }
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAndroidButton);
} else {
  initAndroidButton();
}
