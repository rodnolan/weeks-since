const CACHE_NAME = 'app-cache-v0.0.5'; // The script will automatically edit this string
const urlsToCache = [
  'index.html',
  'style.css',
  'script.js'
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
