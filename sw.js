// Keep your dynamic build hash here!
const CACHE_NAME = 'ror-pwa-5b8d487efe7bd6de189924b8342a55e5d99f84ac';

const ASSETS_TO_CACHE = [
  '/',
  '/app.html',
  '/manifest.json',
  // static assets
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Instantly swap to the new hash version
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          // Deletes all old hash caches (anything that isn't the current CACHE_NAME)
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim()) // Take control of open tabs immediately
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Network-First for HTML so app.html isn't stuck serving old layout
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          return networkResponse;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Cache-First for static assets
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      return cachedResponse || fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
        }
        return networkResponse;
      });
    })
  );
});
