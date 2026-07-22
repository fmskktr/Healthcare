// HealthLog Pro — minimal service worker (enables "Install App" on Android/Chrome)
// v2: network-first for the app shell so future updates aren't stuck behind a stale cache
const CACHE_NAME = 'healthlog-pro-v2';
const CORE_ASSETS = ['./index.html', './manifest.json', './icon-192.png', './icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Navigation / HTML requests: try the network FIRST so users always get the
  // latest deployed version. Only fall back to cache if they're offline.
  if (event.request.mode === 'navigate' || event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Static assets (icons, manifest, etc.): cache-first is fine, they rarely change.
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).catch(() => cached))
  );
});

