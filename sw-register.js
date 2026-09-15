// Register Service Worker and manage offline caching progress UI
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Inject Progress Bar Container dynamically into DOM
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
          transition: width 0.2s linear;
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

    // Only append widget if the page is online and not already fully cached
    if (navigator.onLine && !localStorage.getItem('pwa_fully_cached')) {
      document.body.appendChild(barContainer);
    }

    // Register Service Worker
    navigator.serviceWorker.register('/sw.js').then(reg => {
      console.log('Service Worker registered with scope:', reg.scope);
    }).catch(err => console.error('SW registration failed:', err));

    // Listen for progress updates from sw.js
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'CACHE_PROGRESS') {
        const percent = Math.min(Math.round((event.data.current / event.data.total) * 100), 100);
        const fill = document.getElementById('pwa-progress-fill');
        const pctText = document.getElementById('pwa-status-pct');
        const labelText = document.getElementById('pwa-status-label');

        if (fill) fill.style.width = percent + '%';
        if (pctText) pctText.innerText = percent + '%';

        if (percent >= 100) {
          if (labelText) labelText.innerText = 'Ready for offline use!';
          localStorage.setItem('pwa_fully_cached', 'true');
          setTimeout(() => {
            const widget = document.getElementById('pwa-cache-status');
            if (widget) {
              widget.style.opacity = '0';
              widget.style.transform = 'translateY(10px)';
              setTimeout(() => widget.remove(), 400);
            }
          }, 2500);
        }
      }
    });
  });
}
