const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = './';
const EXCLUDE_DIRS = ['.git', '.github', 'node_modules'];

// 1. Scan directory for local assets
function getFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!EXCLUDE_DIRS.includes(file)) {
        getFiles(filePath, fileList);
      }
    } else {
      if (/\.(html|css|js|json|png|jpg|jpeg|svg|ico|webp)$/i.test(file)) {
        let relativePath = path.relative(PUBLIC_DIR, filePath).replace(/\\/g, '/');
        if (!relativePath.startsWith('/')) {
          relativePath = '/' + relativePath;
        }
        fileList.push(relativePath);
      }
    }
  });
  return fileList;
}

const localAssets = getFiles(PUBLIC_DIR);
const externalAssets = [
  'https://fonts.googleapis.com/css2?family=Jost:wght@100;200;300;400;500;600;700;800;900&display=swap'
];
const allAssets = Array.from(new Set([...localAssets, ...externalAssets]));
const cacheVersion = 'ror-pwa-' + Date.now();

// 2. Automatically Inject Manifest & SW Registration into all HTML files
const htmlFiles = localAssets.filter(file => file.endsWith('.html'));
htmlFiles.forEach(file => {
  const htmlPath = path.join(PUBLIC_DIR, file);
  let htmlContent = fs.readFileSync(htmlPath, 'utf8');
  let modified = false;

  // Inject manifest tag if missing
  if (!htmlContent.includes('rel="manifest"')) {
    htmlContent = htmlContent.replace('</head>', '  <link rel="manifest" href="/manifest.json">\n</head>');
    modified = true;
  }

  // Inject service worker registration script if missing
  if (!htmlContent.includes('sw-register.js')) {
    htmlContent = htmlContent.replace('</head>', '  <script src="/sw-register.js" defer></script>\n</head>');
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(htmlPath, htmlContent, 'utf8');
    console.log(`Injected manifest/sw into: ${file}`);
  }
});

// 3. Update sw.js with asset list and version hash
const swTemplatePath = './sw.js';
if (fs.existsSync(swTemplatePath)) {
  let swContent = fs.readFileSync(swTemplatePath, 'utf8');

  swContent = swContent.replace(
    /const CACHE_NAME = ['"].*?['"];/,
    `const CACHE_NAME = '${cacheVersion}';`
  );

  swContent = swContent.replace(
    /const PRECACHE_ASSETS = \[[\s\S]*?\];/,
    `const PRECACHE_ASSETS = ${JSON.stringify(allAssets, null, 2)};`
  );

  fs.writeFileSync(swTemplatePath, swContent, 'utf8');
  console.log(`Successfully updated sw.js with ${allAssets.length} assets and cache name ${cacheVersion}`);
} else {
  console.error('Error: sw.js template not found in root directory.');
}
