const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const rootDir = __dirname;
const swPath = path.join(rootDir, 'sw.js');

// Automatically scan for all .html files in the repository root
const htmlFiles = fs.readdirSync(rootDir)
  .filter(file => file.endsWith('.html'))
  .map(file => `/${file}`);

const precacheAssets = Array.from(new Set(['/', '/manifest.json', ...htmlFiles]));

// Generate dynamic cache name
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
