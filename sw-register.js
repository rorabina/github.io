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

  // If the user lands directly on app.html, trigger the pop-up immediately
  if (window.location.pathname.includes('app.html')) {
    triggerInstallPrompt();
  }
});

// 3. Function to trigger the installation pop-up
async function triggerInstallPrompt() {
  if (deferredPrompt) {
    // Small delay ensures the page renders completely before showing the prompt
    setTimeout(async () => {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`Installation prompt choice: ${outcome}`);
      deferredPrompt = null;
    }, 500);
  }
}

// 4. Check on page load if landing on app.html with a prepared prompt
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('app.html')) {
    // Wire up any manual "Install Now" button on app.html as a backup
    const pageButtons = document.querySelectorAll('.pwa-install-btn, .btn-install, a[href*="install"]');
    pageButtons.forEach((btn) => {
      btn.onclick = (e) => {
        e.preventDefault();
        triggerInstallPrompt();
      };
    });

    if (deferredPrompt) {
      triggerInstallPrompt();
    }
  }
});
