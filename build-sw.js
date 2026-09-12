const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const rootDir = __dirname;
const swPath = path.join(rootDir, 'sw.js');

// Recursively get all files in a directory
function getFilesRecursively(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      // Ignore hidden directories like .git or .github
      if (!file.startsWith('.')) {
        getFilesRecursively(filePath, fileList);
      }
    } else {
      fileList.push(filePath);
    }
  }
  return fileList;
}

// Get all site assets (.html, .css, .js, images, fonts)
const allFiles = getFilesRecursively(rootDir);

const precacheAssets = allFiles
  .map(file => '/' + path.relative(rootDir, file).replace(/\\/g, '/'))
  .filter(assetPath => {
    // Exclude system/build files from precache
    if (assetPath.startsWith('/.git') || assetPath.startsWith('/.github')) return false;
    if (assetPath === '/build-sw.js' || assetPath === '/sw-register.js') return false;
    
    // Include HTML, manifest, and all static assets in /assets/
    return (
      assetPath.endsWith('.html') ||
      assetPath === '/manifest.json' ||
      assetPath.startsWith('/assets/')
    );
  });

// Add root route '/' explicitly
if (!precacheAssets.includes('/')) {
  precacheAssets.unshift('/');
}

// Generate dynamic cache name MD5 hash
const cacheHash = crypto.createHash('md5').update(Date.now().toString()).digest('hex');
const cacheName = `ror-pwa-${cacheHash}`;

let swContent = fs.readFileSync(swPath, 'utf8');

swContent = swContent.replace(
  /const CACHE_NAME = ['"].*?['"];/,
  `const CACHE_NAME = '${cacheName}';`
);

swContent = swContent.replace(
  /const PRECACHE_ASSETS = \[[\s\S]*?\];/,
  `const PRECACHE_ASSETS = ${JSON.stringify(precacheAssets, null, 2)};`
);

fs.writeFileSync(swPath, swContent, 'utf8');
console.log(`Updated sw.js with ${precacheAssets.length} assets. Cache ID: ${cacheName}`);
