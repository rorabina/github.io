let deferredPrompt;

// 1. Register Service Worker globally across all pages
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => console.log('Service Worker registered:', reg.scope))
      .catch((err) => console.error('Service Worker registration failed:', err));
  });
}

// 2. Capture Chrome's install prompt event in the background
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  console.log('PWA Install prompt captured and ready.');
});

// 3. Attach button listeners when on app.html
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('app.html')) {

    // Target the Android button by text content or classes
    const androidButtons = Array.from(document.querySelectorAll('a, button')).filter((el) => {
      const text = el.textContent.trim().toLowerCase();
      return text === 'android' || text.includes('download on android') || el.classList.contains('pwa-android-btn');
    });

    // Target the iOS button by text content or classes
    const iosButtons = Array.from(document.querySelectorAll('a, button')).filter((el) => {
      const text = el.textContent.trim().toLowerCase();
      return text === 'ios' || text.includes('apple') || text.includes('iphone') || el.classList.contains('pwa-ios-btn');
    });

    // Handle Android Button Click
    androidButtons.forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        if (deferredPrompt) {
          e.preventDefault();
          deferredPrompt.prompt(); // Trigger native install dialog
          
          const { outcome } = await deferredPrompt.userChoice;
          console.log(`User prompt choice: ${outcome}`);
          deferredPrompt = null;
        } else {
          // If prompt isn't ready or app is already installed, fallback to scrolling to Android text
          const androidSection = document.querySelector('h3:nth-of-type(1)') || document.body;
          androidSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Handle iOS Button Click -> Scroll down to Safari instructions
    iosButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        // Finds the iOS section heading on app.html and scrolls into view smoothly
        const iosSection = Array.from(document.querySelectorAll('h3, h2, div')).find((el) => 
          el.textContent.toLowerCase().includes('ios') || el.textContent.toLowerCase().includes('apple')
        );

        if (iosSection) {
          iosSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

  }
});
