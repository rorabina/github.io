const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const rootDir = __dirname;
const swPath = path.join(rootDir, 'sw.js');

// 1. Scan directory and automatically get all .html files
const htmlFiles = fs.readdirSync(rootDir)
  .filter(file => file.endsWith('.html'))
  .map(file => `/${file}`);

// Ensure root '/' and manifest are included
const precacheAssets = Array.from(new Set(['/', '/manifest.json', ...htmlFiles]));

// 2. Generate a unique hash for CACHE_NAME based on current time
const cacheHash = crypto.createHash('md5').update(Date.now().toString()).digest('hex');
const cacheName = `ror-pwa-${cacheHash}`;

// 3. Read current sw.js and replace CACHE_NAME & PRECACHE_ASSETS
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
console.log(`Successfully updated sw.js with ${precacheAssets.length} assets. Cache ID: ${cacheName}`);
