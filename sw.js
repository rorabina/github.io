// Keep your dynamic build hash here!
const CACHE_NAME = 'ror-pwa-72c30727a029cfe819f3f35c0e6cc7dd698d1a9b';

// Comprehensive list of all site pages and core assets to precache
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/about.html',
  '/animal-welfare.html',
  '/app.html',
  '/cuisines.html',
  '/defense-tech.html',
  '/digital-visual-creation.html',
  '/environmental-welfare.html',
  '/events.html',
  '/insights.html',
  '/interests.html',
  '/manifest.json',
  '/merch.html',
  '/photography.html',
  '/portfolio.html',
  '/social-welfare.html',
  '/space-tech.html',
  '/timeline.html',
  '/travel.html',
  '/web-dev.html',
];

// 1. Install Event: Cache all pages immediately & force activation
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
});

// 2. Activate Event: Clear old caches when CACHE_NAME hash updates
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event: Network-First for HTML, Cache-First for static files
self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (!request.url.startsWith('http')) return;

  // HTML Navigation: Try network first (updates layout), fall back to precached HTML if offline
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || caches.match('/');
          });
        })
    );
    return;
  }

  // Static Assets: Try cache first, fall back to network
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
        }
        return networkResponse;
      });
    })
  );
});
