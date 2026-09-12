const CACHE_NAME = 'ror-pwa-1789229991996';
const PRECACHE_ASSETS = [
  "/about.html",
  "/animal-welfare.html",
  "/app.html",
  "/assets/bootstrap/css/bootstrap.min.css",
  "/assets/bootstrap/js/bootstrap.bundle.min.js",
  "/assets/dropdown/css/style.css",
  "/assets/dropdown/js/navbar-dropdown.js",
  "/assets/embla/embla.min.js",
  "/assets/embla/script.js",
  "/assets/images/11.jpg",
  "/assets/images/20210509-041133-01-optimized-2000x1500.jpg",
  "/assets/images/20260910-143718-96x96.png",
  "/assets/images/20260910-143919-128x128-1.png",
  "/assets/images/20260912-120839-815x815.jpg",
  "/assets/images/20260912-121008-815x815.png",
  "/assets/images/background17.jpg",
  "/assets/images/gallery01.jpg",
  "/assets/images/gallery02.jpg",
  "/assets/images/gallery03.jpg",
  "/assets/images/gallery04.jpg",
  "/assets/images/gallery05.jpg",
  "/assets/images/gallery06.jpg",
  "/assets/images/gallery07.jpg",
  "/assets/images/gallery10.jpg",
  "/assets/images/hashes.json",
  "/assets/images/logo-rorabina-512x512.png",
  "/assets/images/mbr-1-1256x837.jpg",
  "/assets/images/mbr-1-1920x1280.jpg",
  "/assets/images/mbr-1-192x128.jpeg",
  "/assets/images/mbr-1-192x144.jpeg",
  "/assets/images/mbr-1-600x401.jpg",
  "/assets/images/mbr-1256x690.png",
  "/assets/images/mbr-1256x750.jpg",
  "/assets/images/mbr-1256x837.jpg",
  "/assets/images/mbr-1256x839.jpg",
  "/assets/images/mbr-1467x1920.jpg",
  "/assets/images/mbr-1695x1102.jpg",
  "/assets/images/mbr-1695x1126.jpg",
  "/assets/images/mbr-1695x1271.jpg",
  "/assets/images/mbr-1695x1356.jpg",
  "/assets/images/mbr-1920x1284.jpeg",
  "/assets/images/mbr-1920x1284.jpg",
  "/assets/images/mbr-192x116.jpeg",
  "/assets/images/mbr-192x128.jpeg",
  "/assets/images/mbr-2-1200x800.jpeg",
  "/assets/images/mbr-2-1200x800.jpg",
  "/assets/images/mbr-2-1256x837.jpg",
  "/assets/images/mbr-2-192x128.jpeg",
  "/assets/images/mbr-2-815x543.jpg",
  "/assets/images/mbr-3-1256x837.jpg",
  "/assets/images/mbr-3-1695x1130.jpg",
  "/assets/images/mbr-3-192x128.jpeg",
  "/assets/images/mbr-3-815x543.jpg",
  "/assets/images/mbr-4-1695x1130.jpg",
  "/assets/images/mbr-4-1920x1280.jpg",
  "/assets/images/mbr-4-600x400.jpg",
  "/assets/images/mbr-4-815x543.jpg",
  "/assets/images/mbr-5-1695x1130.jpg",
  "/assets/images/mbr-5-815x543.jpg",
  "/assets/images/mbr-6-815x543.jpg",
  "/assets/images/mbr-600x350.jpg",
  "/assets/images/mbr-600x386.jpg",
  "/assets/images/mbr-600x398.jpg",
  "/assets/images/mbr-815x458.png",
  "/assets/images/mbr-815x509.jpg",
  "/assets/images/mbr-815x519.jpg",
  "/assets/images/mbr-815x542.jpg",
  "/assets/images/pano-20220719-232500-013-022-optimized20-202-2000x1333.jpg",
  "/assets/images/psx-20211215-195015-01-optimized-2000x1500.jpg",
  "/assets/images/shop1.jpg",
  "/assets/images/shop2.jpg",
  "/assets/images/shop3.jpg",
  "/assets/mobirise/css/mbr-additional.css",
  "/assets/parallax/jarallax.css",
  "/assets/parallax/jarallax.js",
  "/assets/smoothscroll/smooth-scroll.js",
  "/assets/socicon/css/styles.css",
  "/assets/socicon/fonts/socicon.svg",
  "/assets/theme/css/style.css",
  "/assets/theme/js/script.js",
  "/assets/web/assets/mobirise-icons-bold/mobirise-icons-bold.css",
  "/assets/web/assets/mobirise-icons-bold/mobirise-icons-bold.svg",
  "/assets/web/assets/mobirise-icons2/mobirise2.css",
  "/assets/web/assets/mobirise-icons2/mobirise2.svg",
  "/assets/ytplayer/index.js",
  "/build-sw.js",
  "/defense-tech.html",
  "/digital-visual-creation.html",
  "/environmental-welfare.html",
  "/events.html",
  "/index.html",
  "/insights.html",
  "/local-travels.html",
  "/manifest.json",
  "/merch.html",
  "/photography.html",
  "/portfolio.html",
  "/social-welfare.html",
  "/space-tech.html",
  "/sw-register.js",
  "/sw.js",
  "/test.html",
  "/timeline.html",
  "/web-dev.html",
  "https://fonts.googleapis.com/css2?family=Jost:wght@100;200;300;400;500;600;700;800;900&display=swap"
];

// 1. Install Event: Cache assets safely one-by-one so a single failure doesn't abort caching
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.allSettled(
        PRECACHE_ASSETS.map(async (url) => {
          try {
            await cache.add(url);
          } catch (err) {
            console.warn(`Failed to precache asset: ${url}`, err);
          }
        })
      );
    })
  );
});

// 2. Activate Event: Clear out outdated caches and take control immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event: Network-first for navigation, Cache-first for assets, handle opaque cross-origin fonts/CDNs
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Handle HTML Page Navigations
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || caches.match('/index.html') || caches.match('/');
          });
        })
    );
    return;
  }

  // Handle Static Assets, Stylesheets, Fonts, and Images
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request)
        .then((networkResponse) => {
          // Allow status 200 and opaque cross-origin responses (status 0 for external fonts/CDNs)
          if (networkResponse && (networkResponse.status === 200 || networkResponse.status === 0)) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Fallback if asset fetch fails offline
          return null;
        });
    })
  );
});
