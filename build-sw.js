const fs = require('fs');
const path = require('path');

// Recursively find all static files to precache
function getFiles(dir, baseDir = '') {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const relativePath = path.join(baseDir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules') {
        results = results.concat(getFiles(filePath, relativePath));
      }
    } else {
      // Avoid precaching sw.js itself or backup files
      if (file !== 'sw.js' && !file.endsWith('.bak')) {
        results.push('/' + relativePath.replace(/\\/g, '/'));
      }
    }
  });
  return results;
}

const precacheAssets = getFiles('.');
// Increment version tag whenever you want to force cache invalidation on mobile PWAs
const CACHE_NAME = 'ror-pwa-v2';

const swContent = `
const CACHE_NAME = '${CACHE_NAME}';
const PRECACHE_ASSETS = ${JSON.stringify(precacheAssets, null, 2)};

// 1. Install Event: Precache core static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Precaching app shell & assets');
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// 2. Activate Event: Clean up old cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event: Network-First for HTML (Instant updates), Stale-While-Revalidate for Assets
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // A. Strategy for HTML Navigation / Pages: NETWORK-FIRST
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          // Update cache with the fresh page from network
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => {
          // If offline, serve from cache fallback
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || caches.match('/index.html');
          });
        })
    );
    return;
  }

  // B. Strategy for Static Assets (CSS, JS, Images, Fonts): STALE-WHILE-REVALIDATE
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
        }
        return networkResponse;
      }).catch(() => {/* Ignore network errors for static asset fetches */});

      // Serve cached asset immediately, or wait for network fetch if missing
      return cachedResponse || fetchPromise;
    })
  );
});
`;

fs.writeFileSync('sw.js', swContent, 'utf8');
console.log('Successfully updated sw.js with Network-First strategy!');
