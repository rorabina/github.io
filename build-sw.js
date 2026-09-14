const workboxBuild = require('workbox-build');
const fs = require('fs');
const path = require('path');

async function buildSW() {
  // 1. Strip Mobirise Backlinks from HTML Files
  const htmlFiles = fs.readdirSync(__dirname).filter(file => file.endsWith('.html'));
  
  htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Remove Mobirise dynamic footer links
    content = content.replace(/<section[^>]*class="[^"]*engine[^"]*"[^>]*>[\s\S]*?<\/section>/gi, '');
    content = content.replace(/<a[^>]*href="https?:\/\/(www\.)?mobirise\.com[^"]*"[^>]*>[\s\S]*?<\/a>/gi, '');
    
    // Inject Web App Manifest if missing
    if (!content.includes('rel="manifest"')) {
      content = content.replace(/<\/head>/i, '  <link rel="manifest" href="manifest.json">\n</head>');
    }
    
    fs.writeFileSync(file, content, 'utf8');
  });

  // 2. Generate Workbox Service Worker
  const { count, size } = await workboxBuild.generateSW({
    globDirectory: './',
    globPatterns: [
      '**/*.{html,css,js,png,jpg,jpeg,svg,gif,json,woff,woff2}'
    ],
    globIgnores: [
      'node_modules/**/*',
      'build-sw.js',
      'releases/**/*',
      '.github/**/*'
    ],
    swDest: 'sw.js',
    clientsClaim: true,
    skipWaiting: true
  });

  console.log(`Generated sw.js, which will precache ${count} files, totaling ${size} bytes.`);
}

buildSW();
