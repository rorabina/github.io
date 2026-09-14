const workboxBuild = require('workbox-build');
const fs = require('fs');

async function buildSW() {
  console.log('Cleaning HTML files, injecting PWA manifest, and attaching Android PWA installer...');
  const htmlFiles = fs.readdirSync('./').filter(file => file.endsWith('.html'));

  htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // 1. Remove Mobirise engine sections, containers, and backlinks completely
    content = content.replace(/<(section|div|footer|p)[^>]*>(?:(?!<\/(?:section|div|footer|p)>)[\s\S])*?href="https?:\/\/(www\.)?(mobirise\.com|mobiri\.se)[^"]*"[\s\S]*?<\/\1>/gi, '');
    content = content.replace(/<a[^>]*href="https?:\/\/(www\.)?(mobirise\.com|mobiri\.se)[^"]*"[^>]*>[\s\S]*?<\/a>/gi, '');

    // 2. Inject CSS Fail-Safe to disable layout clicks on leftover Mobirise elements
    if (!content.includes('/* Mobirise Fail-Safe */')) {
      const styleInject = `
<style id="mobirise-cleaner">
  /* Mobirise Fail-Safe */
  [class*="engine"], [id*="mobirise"], a[href*="mobiri.se"], a[href*="mobirise.com"] {
    display: none !important;
    visibility: hidden !important;
    pointer-events: none !important;
    height: 0 !important;
    width: 0 !important;
    opacity: 0 !important;
  }
</style>
`;
      content = content.replace(/<\/head>/i, `${styleInject}\n</head>`);
    }

    // 3. Inject Web App Manifest link if missing
    if (!content.includes('rel="manifest"')) {
      content = content.replace(/<\/head>/i, '  <link rel="manifest" href="manifest.json">\n</head>');
    }

    // 4. Inject Android PWA Install Handler into app.html
    if (file === 'app.html' && !content.includes('pwa-android-installer')) {
      const pwaInstallerScript = `
<script id="pwa-android-installer">
  (function() {
    let deferredPrompt = null;

    // Listen for the browser PWA install event
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      console.log('PWA install prompt intercepted and ready.');
    });

    document.addEventListener('DOMContentLoaded', () => {
      // Target the Android button by its text content or icon
      const buttons = Array.from(document.querySelectorAll('a, button'));
      const androidBtn = buttons.find(b => b.textContent.includes('Android') || b.querySelector('.socicon-android'));

      if (androidBtn) {
        androidBtn.addEventListener('click', async (evt) => {
          evt.preventDefault();
          if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log('User PWA install response:', outcome);
            deferredPrompt = null;
          } else {
            alert('PWA installation is either already completed or not supported on this browser/device.');
          }
        });
      }
    });
  })();
</script>
`;
      content = content.replace(/<\/body>/i, `${pwaInstallerScript}\n</body>`);
    }

    fs.writeFileSync(file, content, 'utf8');
  });

  // 5. Generate Workbox Service Worker
  const { count, size } = await workboxBuild.generateSW({
    globDirectory: './',
    globPatterns: ['**/*.{html,css,js,png,jpg,jpeg,svg,gif,json}'],
    globIgnores: ['node_modules/**/*', 'build-sw.js', 'releases/**/*', '.github/**/*'],
    swDest: 'sw.js',
    clientsClaim: true,
    skipWaiting: true
  });

  console.log(`Generated sw.js: precaching ${count} files (${size} bytes).`);
}

buildSW().catch(console.error);
