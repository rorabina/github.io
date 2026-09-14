const workboxBuild = require('workbox-build');
const fs = require('fs');

async function buildSW() {
  console.log('Cleaning HTML files & injecting PWA manifest...');
  const htmlFiles = fs.readdirSync('./').filter(file => file.endsWith('.html'));

  htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // 1. Regex to target any tag block wrapping a mobirise / mobiri.se link
    content = content.replace(/<(section|div|footer|p)[^>]*>(?:(?!<\/(?:section|div|footer|p)>)[\s\S])*?href="https?:\/\/(www\.)?(mobirise\.com|mobiri\.se)[^"]*"[\s\S]*?<\/\1>/gi, '');

    // 2. Fallback: Strip standalone mobirise link tags
    content = content.replace(/<a[^>]*href="https?:\/\/(www\.)?(mobirise\.com|mobiri\.se)[^"]*"[^>]*>[\s\S]*?<\/a>/gi, '');

    // 3. Inject CSS Fail-Safe to disable layout clicks on leftover Mobirise elements
    const styleInject = `
<style>
  [class*="engine"], [id*="mobirise"], a[href*="mobiri.se"], a[href*="mobirise.com"] {
    display: none !important;
    visibility: hidden !important;
    pointer-events: none !important;
    height: 0 !important;
    width: 0 !important;
    overflow: hidden !important;
    opacity: 0 !important;
  }
</style>
`;
    content = content.replace(/<\/head>/i, `${styleInject}\n</head>`);

    // 4. Inject Web App Manifest if missing
    if (!content.includes('rel="manifest"')) {
      content = content.replace(/<\/head>/i, '  <link rel="manifest" href="manifest.json">\n</head>');
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
