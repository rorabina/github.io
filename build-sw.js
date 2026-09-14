const workboxBuild = require('workbox-build');
const fs = require('fs');

async function buildSW() {
  const htmlFiles = fs.readdirSync('./').filter(file => file.endsWith('.html'));
  
  // Clean HTML files and inject PWA manifest link
  htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Remove Mobirise backlinks
    content = content.replace(/<a[^>]*href="https?:\/\/(www\.)?mobirise\.com[^"]*"[^>]*>[\s\S]*?<\/a>/gi, '');
    
    // Inject Manifest if missing
    if (!content.includes('rel="manifest"')) {
      content = content.replace(/<\/head>/i, '  <link rel="manifest" href="manifest.json">\n</head>');
    }
    
    fs.writeFileSync(file, content, 'utf8');
  });

  // Generate Service Worker Precache Manifest
  await workboxBuild.generateSW({
    globDirectory: './',
    globPatterns: ['**/*.{html,css,js,png,jpg,jpeg,svg,gif,json}'],
    globIgnores: ['node_modules/**/*', 'build-sw.js', 'releases/**/*'],
    swDest: 'sw.js',
    clientsClaim: true,
    skipWaiting: true
  });
}

buildSW();
