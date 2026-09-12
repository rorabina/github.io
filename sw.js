const CACHE_NAME = 'ror-pwa-v5';

// Precache list with clean string paths
const PRECACHE_ASSETS = [
  "/",
  "/index.html",
  "/app.html",
  "/manifest.json",
  "/sw-register.js",
  "/about.html",
  "/animal-welfare.html",
  "/cuisines.html",
  "/defense-tech.html",
  "/digital-visual-creation.html",
  "/environmental-welfare.html",
  "/events.html",
  "/insights.html",
  "/install-app.html",
  "/interests.html",
  "/local-adventures.html",
  "/merch.html",
  "/national-interests.html",
  "/photography.html",
  "/portfolio.html",
  "/portfolio-creative-works.html",
  "/social-welfare.html",
  "/space-tech.html",
  "/timeline.html",
  "/travel.html",
  "/web-dev.html",
  "/works.html",
  "/assets/mobirise/css/mbr-additional.css",
  "/assets/socicon/fonts/socicon.woff2",
  "/assets/socicon/fonts/socicon.svg",
  "/assets/socicon/css/styles.css",
  "/assets/playervimeo/vimeo_player.js",
  "/assets/bootstrap/js/bootstrap.bundle.min.js",
  "/assets/bootstrap/css/bootstrap.min.css",
  "/assets/animatecss/animate.css",
  "/assets/ytplayer/index.js",
  "/assets/dropdown/js/navbar-dropdown.js",
  "/assets/dropdown/css/style.css",
  "/assets/formoid/formoid.min.js",
  "/assets/embla/script.js",
  "/assets/embla/embla.min.js",
  "/assets/theme/js/script.js",
  "/assets/theme/css/style.css"
];

// 1. Install Event - Force update and cache static assets
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Bypass waiting state immediately
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Precaching assets...');
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
});

// 2. Activate Event - Claim clients and clean up old cache versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(), // Claim control over open tabs immediately
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cache);
              return caches.delete(cache);
            }
          })
        );
      })
    ])
  );
});

// 3. Fetch Event - Network first with cache fallback strategy
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
