let deferredPrompt;

// 1. Register Service Worker globally with relative directory scope
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js') // Omit scope or use './'
      .then((registration) => {
        console.log('Service Worker registered successfully with scope:', registration.scope);
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
  console.log('PWA beforeinstallprompt successfully captured.');
});

// 3. Attach event listeners on app.html
document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('app.html')) {
    // Function to handle the Android install click/touch
    const handleAndroidInstall = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User prompt response: ${outcome}`);
        deferredPrompt = null;
      } else {
        alert('App installation is not available right now or the app is already installed on this device.');
      }
    };

    // Find the Android button by flexible query selectors
    const androidButtons = Array.from(document.querySelectorAll('a, button, .btn')).filter((el) => {
      const text = el.innerText ? el.innerText.trim().toLowerCase() : '';
      return text.includes('android') || el.classList.contains('pwa-android-btn');
    });

    // Attach click listener for Android button
    androidButtons.forEach((btn) => {
      btn.addEventListener('click', handleAndroidInstall);
    });

    // iOS Button Action -> Smooth scroll down to Safari steps
    const iosButtons = Array.from(document.querySelectorAll('a, button, .btn')).filter((el) => {
      const text = el.innerText ? el.innerText.trim().toLowerCase() : '';
      return text.includes('ios') || text.includes('apple');
    });

    iosButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const iosSection = Array.from(document.querySelectorAll('h2, h3, div')).find(
          (el) => el.innerText && el.innerText.toLowerCase().includes('ios')
        );
        if (iosSection) {
          iosSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }
});
