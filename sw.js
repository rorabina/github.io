const CACHE_NAME = 'ror-pwa-v3';

// List all HTML pages and static assets to precache automatically
const PRECACHE_ASSETS = [
  "/",
  "\"\"/about.html",
  "\"\"/environmental-welfare.html",
  "\"\"/merch.html",
  "\"\"/install-app.html",
  "\"\"/social-welfare.html",
  "\"\"/space-tech.html",
  "\"\"/local-adventures.html",
  "\"\"/insights.html",
  "\"\"/app.html",
  "\"\"/national-interests.html",
  "\"\"/interests.html",
  "\"\"/digital-visual-creation.html",
  "\"\"/timeline.html",
  "\"\"/photography.html",
  "\"\"/index.html",
  "\"\"/cuisines.html",
  "\"\"/travel.html",
  "\"\"/events.html",
  "\"\"/portfolio.html",
  "\"\"/portfolio-creative-works.html",
  "\"\"/animal-welfare.html",
  "\"\"/works.html",
  "\"\"/defense-tech.html",
  "\"\"/web-dev.html",
  "\"\"/page2.html",
  "\"\"/upcoming-events.html"
];

// Install Event: Downloads and caches all specified pages immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Precaching all site pages...');
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate Event: Deletes old caches when CACHE_NAME updates
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch Event: Serves from cache first, falls back to network
self.addEventListener('fetch', (event) => {
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      });
    })
  );
});
