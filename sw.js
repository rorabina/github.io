// Placeholder values: build-sw.js will overwrite these automatically on build
const CACHE_NAME = 'ror-pwa-39d41b315c3bddfc53316226517a8416';
const PRECACHE_ASSETS = [
  "/",
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
  "/assets/socicon/fonts/socicon.eot",
  "/assets/socicon/fonts/socicon.svg",
  "/assets/socicon/fonts/socicon.ttf",
  "/assets/socicon/fonts/socicon.woff",
  "/assets/socicon/fonts/socicon.woff2",
  "/assets/theme/css/style.css",
  "/assets/theme/js/script.js",
  "/assets/web/assets/mobirise-icons-bold/mobirise-icons-bold.css",
  "/assets/web/assets/mobirise-icons-bold/mobirise-icons-bold.eot",
  "/assets/web/assets/mobirise-icons-bold/mobirise-icons-bold.svg",
  "/assets/web/assets/mobirise-icons-bold/mobirise-icons-bold.ttf",
  "/assets/web/assets/mobirise-icons-bold/mobirise-icons-bold.woff",
  "/assets/web/assets/mobirise-icons-bold/mobirise-icons-bold.woff2",
  "/assets/web/assets/mobirise-icons2/mobirise2.css",
  "/assets/web/assets/mobirise-icons2/mobirise2.eot",
  "/assets/web/assets/mobirise-icons2/mobirise2.svg",
  "/assets/web/assets/mobirise-icons2/mobirise2.ttf",
  "/assets/web/assets/mobirise-icons2/mobirise2.woff",
  "/assets/web/assets/mobirise-icons2/mobirise2.woff2",
  "/assets/ytplayer/index.js",
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

// 3. Fetch Event: Network-First for HTML, Cache-First with robust dynamic caching for assets
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

  // Asset Strategy (CSS, JS, Fonts, Images, CDNs): Cache-First + Dynamic Cache
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(request).then((networkResponse) => {
        // Cache valid responses including opaque cross-origin CDN assets (type === 'opaque')
        if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
        }
        return networkResponse;
      }).catch(() => {
        // Silently fail for missing background assets when offline
      });
    })
  );
});
