const CACHE_NAME = 'app-cache-v1.0.0'; // The script will automatically edit this string
const urlsToCache = [
  'index.html',
  'styles/layout.css',
  'styles/layout2.css',
  'styles/typography.css',
  'styles/dark-mode.css',
  'styles/3x3-today-box-layout.css',
  'app.js',
  'scripts/layout-toggler.js',
  'scripts/refreshHandler.js',
  'scripts/sw-register.js'
];

// Install the Service Worker and cache the files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Serve cached files when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
