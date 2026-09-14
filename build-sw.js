const workboxBuild = require('workbox-build');
const fs = require('fs');

async function buildSW() {
  console.log('Cleaning HTML files & injecting PWA manifest...');
  const htmlFiles = fs.readdirSync('./').filter(file => file.endsWith('.html'));

  htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // 1. Remove Mobirise engine sections, containers, and backlinks completely
    content = content.replace(/<section[^>]*class="[^"]*engine[^"]*"[^>]*>[\s\S]*?<\/section>/gi, '');
    content = content.replace(/<section[^>]*id="[^"]*mobirise[^"]*"[^>]*>[\s\S]*?<\/section>/gi, '');
    content = content.replace(/<div[^>]*class="[^"]*mbr-footer[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');
    content = content.replace(/<a[^>]*href="https?:\/\/(www\.)?mobirise\.com[^"]*"[^>]*>[\s\S]*?<\/a>/gi, '');

    // 2. Inject Web App Manifest if missing
    if (!content.includes('rel="manifest"')) {
      content = content.replace(/<\/head>/i, '  <link rel="manifest" href="manifest.json">\n</head>');
    }

    fs.writeFileSync(file, content, 'utf8');
  });

  // 3. Generate Workbox Service Worker
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
