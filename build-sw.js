const workboxBuild = require('workbox-build');
const fs = require('fs');

async function buildSW() {
  console.log('Cleaning HTML files, injecting manifest, adding sw-register, and building SW...');
  const htmlFiles = fs.readdirSync('./').filter(file => file.endsWith('.html'));

  htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // 1. Remove Mobirise engine sections, containers, and backlinks completely
    content = content.replace(/<(section|div|footer|p)[^>]*>(?:(?!<\/(?:section|div|footer|p)>)[\s\S])*?href="https?:\/\/(www\.)?(mobirise\.com|mobiri\.se)[^"]*"[\s\S]*?<\/\1>/gi, '');
    content = content.replace(/<a[^>]*href="https?:\/\/(www\.)?(mobirise\.com|mobiri\.se)[^"]*"[^>]*>[\s\S]*?<\/a>/gi, '');

    // 2. Fix broken Capgo CapacitorUpdater CDN import
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

    fs.writeFileSync(file, content, 'utf8');
  });

  // 6. Generate Workbox Service Worker with Inlined Workbox Runtime
  const { count, size } = await workboxBuild.generateSW({
    globDirectory: './',
    globPatterns: ['**/*.{html,css,js,png,jpg,jpeg,svg,gif,json}'],
    globIgnores: [
      'node_modules/**/*',
      'build-sw.js',
      'sw.js',
      'workbox-*.js',
      'releases/**/*',
      '.github/**/*'
    ],
    swDest: 'sw.js',
    inlineWorkboxRuntime: true,
    clientsClaim: true,
    skipWaiting: true,
    cleanupOutdatedCaches: true,
    maximumFileSizeToCacheInBytes: 15 * 1024 * 1024,
    navigateFallback: 'index.html',
    runtimeCaching: [
      {
        urlPattern: ({ request }) => request.mode === 'navigate',
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'rorabina-html-pages',
          expiration: { maxEntries: 50 },
        },
      },
      {
        urlPattern: ({ request }) =>
          request.destination === 'style' ||
          request.destination === 'script' ||
          request.destination === 'image',
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'rorabina-assets',
          expiration: { maxEntries: 100, maxAgeSeconds: 30 * 24 * 60 * 60 },
        },
      },
    ],
  });

  console.log(`Generated sw.js: precaching ${count} files (${size} bytes).`);
}

buildSW().catch(console.error);
