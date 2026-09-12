// Placeholder values: build-sw.js will overwrite these automatically on build
const CACHE_NAME = 'ror-pwa-68ff1ec34b69c6b454a77d115819be65';
const PRECACHE_ASSETS = [
  "/",
  "/manifest.json",
  "/about.html",
  "/animal-welfare.html",
  "/app.html",
  "/defense-tech.html",
  "/digital-visual-creation.html",
  "/environmental-welfare.html",
  "/events.html",
  "/index.html",
  "/insights.html",
  "/local-travels.html",
  "/merch.html",
  "/photography.html",
  "/portfolio.html",
  "/social-welfare.html",
  "/space-tech.html",
  "/timeline.html",
  "/web-dev.html"
];

// 1. Install Event: Cache all auto-detected pages immediately & force activation
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
});

// 2. Activate Event: Delete old cache buckets when CACHE_NAME updates
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event: Network-First for HTML, Cache-First for static assets
self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (!request.url.startsWith('http')) return;

  // HTML Navigation Strategy: Try network first, fall back to precached HTML if offline
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

  // Static Assets Strategy: Cache-First with network fallback
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
