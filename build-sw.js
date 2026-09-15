const workboxBuild = require('workbox-build');
const fs = require('fs');

async function buildSW() {
  console.log('Cleaning HTML files, injecting manifest, fixing CapacitorUpdater, adding sw-register, and building SW...');
  const htmlFiles = fs.readdirSync('./').filter(file => file.endsWith('.html'));

  htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // 1. Remove Mobirise engine sections, containers, and backlinks completely
    content = content.replace(/<(section|div|footer|p)[^>]*>(?:(?!<\/(?:section|div|footer|p)>)[\s\S])*?href="https?:\/\/(www\.)?(mobirise\.com|mobiri\.se)[^"]*"[\s\S]*?<\/\1>/gi, '');
    content = content.replace(/<a[^>]*href="https?:\/\/(www\.)?(mobirise\.com|mobiri\.se)[^"]*"[^>]*>[\s\S]*?<\/a>/gi, '');

    // 2. Fix broken Capgo CapacitorUpdater CDN import that causes JavaScript SyntaxError
    content = content.replace(
      /<script[^>]*type="module"[^>]*>[\s\S]*?import\s*\{\s*CapacitorUpdater\s*\}\s*from\s*['"]https:\/\/cdn\.jsdelivr\.net\/npm\/@capgo\/capacitor-updater[^'"]*['"];?[\s\S]*?<\/script>/gi,
      `<script>
  document.addEventListener('deviceready', () => {
    const { CapacitorUpdater } = window.Capacitor?.Plugins || {};
    if (CapacitorUpdater) {
      CapacitorUpdater.notifyAppReady();
    }
  });
</script>`
    );

    // 3. Inject CSS Fail-Safe
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

    // 4. Inject Web App Manifest link if missing
    if (!content.includes('rel="manifest"')) {
      content = content.replace(/<\/head>/i, '  <link rel="manifest" href="manifest.json">\n</head>');
    }

    // 5. Inject Service Worker registration script into ALL HTML pages if missing
    if (!content.includes('sw-register.js')) {
      content = content.replace(/<\/body>/i, '  <script src="sw-register.js"></script>\n</body>');
    }

    // 6. Inject Android PWA Install Handler into app.html
    if (file === 'app.html' && !content.includes('pwa-android-installer')) {
      const pwaInstallerScript = `
<script id="pwa-android-installer">
  (function() {
    let deferredPrompt = null;
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      console.log('PWA install prompt intercepted and ready.');
    });

    document.addEventListener('DOMContentLoaded', () => {
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

  // 7. Generate Workbox Service Worker with Precached HTML Routing
  const { count, size } = await workboxBuild.generateSW({
    globDirectory: './',
    globPatterns: ['**/*.{html,css,js,png,jpg,jpeg,svg,gif,json}'],
    globIgnores: ['node_modules/**/*', 'build-sw.js', 'releases/**/*', '.github/**/*'],
    swDest: 'sw.js',
    clientsClaim: true,
    skipWaiting: true,
    // Automatically match offline page navigations to precached HTML files
    directoryIndex: 'index.html',
    cleanUrls: false
  });

  console.log(`Generated sw.js: precaching ${count} files (${size} bytes).`);
}

buildSW().catch(console.error);
