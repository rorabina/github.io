const CACHE_NAME = 'ror-pwa-v5';

// Precache list with clean string paths
const PRECACHE_ASSETS = [
  "/",
  "/manifest.json",
  "\"\"/sw.js",
  "\"\"/about.html",
  "\"\"/environmental-welfare.html",
  "\"\"/sw-register.js",
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
  "\"\"/assets/mobirise/css/mbr-additional.css",
  "\"\"/assets/socicon/fonts/socicon.woff2",
  "\"\"/assets/socicon/fonts/socicon.svg",
  "\"\"/assets/socicon/css/styles.css",
  "\"\"/assets/playervimeo/vimeo_player.js",
  "\"\"/assets/bootstrap/js/bootstrap.bundle.min.js",
  "\"\"/assets/bootstrap/css/bootstrap.min.css",
  "\"\"/assets/animatecss/animate.css",
  "\"\"/assets/ytplayer/index.js",
  "\"\"/assets/dropdown/js/navbar-dropdown.js",
  "\"\"/assets/dropdown/css/style.css",
  "\"\"/assets/formoid/formoid.min.js",
  "\"\"/assets/embla/script.js",
  "\"\"/assets/embla/embla.min.js",
  "\"\"/assets/theme/js/script.js",
  "\"\"/assets/theme/css/style.css",
  "\"\"/assets/images/mbr-1916x1078.png",
  "\"\"/assets/images/gallery06.jpg",
  "\"\"/assets/images/20260908-191121-815x815.png",
  "\"\"/assets/images/mbr-4-600x400.jpg",
  "\"\"/assets/images/20260908-174641-815x815.png",
  "\"\"/assets/images/mbr-1-1200x800.jpg",
  "\"\"/assets/images/20210523-0548153s-128x128.png",
  "\"\"/assets/images/mbr-2-1695x1130.jpg",
  "\"\"/assets/images/20260825-102640b-128x128.png",
  "\"\"/assets/images/mbr-600x386.jpg",
  "\"\"/assets/images/mbr-4-1920x1280.jpg",
  "\"\"/assets/images/team6.jpg",
  "\"\"/assets/images/team4.jpg",
  "\"\"/assets/images/shop2.jpg",
  "\"\"/assets/images/mbr-2-1200x800.jpg",
  "\"\"/assets/images/20260908-170952-171x171.png",
  "\"\"/assets/images/logo-rorabina.png",
  "\"\"/assets/images/mbr-1920x1536.png",
  "\"\"/assets/images/shop3.jpg",
  "\"\"/assets/images/background1.jpg",
  "\"\"/assets/images/mbr-1-600x401.jpg",
  "\"\"/assets/images/pano-20220719-232500-013-022-optimized20-202-2000x1333.jpg",
  "\"\"/assets/images/gallery08.jpg",
  "\"\"/assets/images/mbr-600x400.jpg",
  "\"\"/assets/images/20260910-143919-128x128.png",
  "\"\"/assets/images/shop4.jpg",
  "\"\"/assets/images/20260910-173803-815x815.png",
  "\"\"/assets/images/mbr-3-815x543.jpg",
  "\"\"/assets/images/mbr-2-1920x1280.jpg",
  "\"\"/assets/images/team3.jpg",
  "\"\"/assets/images/mbr-1695x1130.jpg",
  "\"\"/assets/images/20260912-120839-815x815.jpg",
  "\"\"/assets/images/20260910-143919-1200x1200.jpg",
  "\"\"/assets/images/mbr-600x350.jpg",
  "\"\"/assets/images/mbr-1256x750.jpg",
  "\"\"/assets/images/20260912-121008-815x815.png",
  "\"\"/assets/images/20260910-165627-815x815.jpg",
  "\"\"/assets/images/20260908-170723-128x128.png",
  "\"\"/assets/images/13.jpg",
  "\"\"/assets/images/mbr-2-600x400.jpg",
  "\"\"/assets/images/mbr-1-1920x1280.jpg",
  "\"\"/assets/images/gallery04.jpg",
  "\"\"/assets/images/20260831-45832-815x815.png",
  "\"\"/assets/images/20260912-102801-815x815.jpg",
  "\"\"/assets/images/gallery13.jpg",
  "\"\"/assets/images/shop5.jpg",
  "\"\"/assets/images/mbr-2-815x543.jpg",
  "\"\"/assets/images/20260831-51818-815x815.png",
  "\"\"/assets/images/mbr-1200x800.jpg",
  "\"\"/assets/images/mbr-1-1831x1030.png",
  "\"\"/assets/images/mbr-815x509.jpg",
  "\"\"/assets/images/shop6.jpg",
  "\"\"/assets/images/mbr-1-1695x1356.jpg",
  "\"\"/assets/images/20260912-111607-815x815.jpg",
  "\"\"/assets/images/mbr-1920x1284.jpg",
  "\"\"/assets/images/mbr-600x362.jpg",
  "\"\"/assets/images/team2.jpg",
  "\"\"/assets/images/20260910-143919-128x128-1.png",
  "\"\"/assets/images/gallery03.jpg",
  "\"\"/assets/images/20260908-191340-815x815.jpg",
  "\"\"/assets/images/mbr-600x373.jpg",
  "\"\"/assets/images/20260908-170723-128x128-1.png",
  "\"\"/assets/images/icon-192.png",
  "\"\"/assets/images/mbr-3-1920x1280.jpg",
  "\"\"/assets/images/gallery07.jpg",
  "\"\"/assets/images/mbr-1-1695x1130.jpg",
  "\"\"/assets/images/mbr-1200x675.png",
  "\"\"/assets/images/mbr-600x338.jpg",
  "\"\"/assets/images/mbr-1695x1356.jpg",
  "\"\"/assets/images/background4.jpg",
  "\"\"/assets/images/20260908-170723-815x815.jpg",
  "\"\"/assets/images/september6-044923pm-800x800.png",
  "\"\"/assets/images/mbr-1256x837.jpg",
  "\"\"/assets/images/mbr-1467x1920.jpg",
  "\"\"/assets/images/gallery02.jpg",
  "\"\"/assets/images/20260908-180226-815x815.jpg",
  "\"\"/assets/images/20210523-0548154s-128x128-3.png",
  "\"\"/assets/images/mbr-1-600x400.jpg",
  "\"\"/assets/images/20260825-102640b-96x96.png",
  "\"\"/assets/images/gallery10.jpg",
  "\"\"/assets/images/gallery01.jpg",
  "\"\"/assets/images/mbr-1200x795.jpg",
  "\"\"/assets/images/11.jpg",
  "\"\"/assets/images/mbr-1-1916x1078.png",
  "\"\"/assets/images/mbr-3-600x400.jpg",
  "\"\"/assets/images/mbr-600x398.jpg",
  "\"\"/assets/images/8.jpg",
  "\"\"/assets/images/team5.jpg",
  "\"\"/assets/images/mbr-1-1256x707.png",
  "\"\"/assets/images/shop1.jpg",
  "\"\"/assets/images/gallery05.jpg",
  "\"\"/assets/images/20260910-143716-96x96.png",
  "\"\"/assets/images/20260910-143718-96x96.png",
  "\"\"/assets/images/mbr-1200x799.jpg",
  "\"\"/assets/gallery/script.js",
  "\"\"/assets/gallery/player.min.js",
  "\"\"/assets/gallery/style.css",
  "\"\"/assets/scrollgallery/scroll-gallery.js",
  "\"\"/assets/masonry/masonry.pkgd.min.js",
  "\"\"/assets/web/assets/gdpr-plugin/gdpr-styles.css",
  "\"\"/assets/web/assets/mobirise-icons2/mobirise2.woff2",
  "\"\"/assets/web/assets/mobirise-icons2/mobirise2.svg",
  "\"\"/assets/web/assets/mobirise-icons2/mobirise2.css",
  "\"\"/assets/web/assets/cookies-alert-plugin/cookies-alert-script.js",
  "\"\"/assets/web/assets/cookies-alert-plugin/cookies-alert-core.js",
  "\"\"/assets/web/assets/mobirise-icons-bold/mobirise-icons-bold.css",
  "\"\"/assets/web/assets/mobirise-icons-bold/mobirise-icons-bold.svg",
  "\"\"/assets/web/assets/mobirise-icons-bold/mobirise-icons-bold.woff2",
  "\"\"/assets/imagesloaded/imagesloaded.pkgd.min.js",
  "\"\"/assets/parallax/jarallax.css",
  "\"\"/assets/parallax/jarallax.js",
  "\"\"/assets/smoothscroll/smooth-scroll.js",
  "\"\"/page2.html",
  "\"\"/upcoming-events.html"
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
