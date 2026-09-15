let deferredPrompt;

// 1. Register Service Worker with relative directory scope
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
        registration.update();
      })
      .catch((err) => {
        console.error('Service Worker registration failed:', err);
      });
  });
}

// 2. Capture Chrome's install event globally
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

// 3. Attach event listeners on app.html
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('app.html')) {
    const handleAndroidInstall = async (e) => {
      e.preventDefault();
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User prompt response: ${outcome}`);
        deferredPrompt = null;
      } else {
        alert('App installation is not available right now or the app is already installed on this device.');
      }
    };

    const androidButtons = Array.from(document.querySelectorAll('a, button, .btn')).filter((el) => {
      const text = el.innerText ? el.innerText.trim().toLowerCase() : '';
      return text.includes('android') || el.classList.contains('pwa-android-btn');
    });

    androidButtons.forEach((btn) => btn.addEventListener('click', handleAndroidInstall));
  }
});
