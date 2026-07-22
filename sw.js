// Nicotine Addiction Management Toolkit — service worker
// v9: network-first for the app page so updates aren't stuck behind a stale
// cache, plus resilient per-file precaching so one missing/renamed asset
// can't silently kill the whole install (a dead service worker means Chrome
// will never offer the native install prompt).
const CACHE_NAME = "nicotine-toolkit-v9";

const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-72.png",
  "./icons/icon-96.png",
  "./icons/icon-128.png",
  "./icons/icon-144.png",
  "./icons/icon-152.png",
  "./icons/icon-180.png",
  "./icons/icon-192.png",
  "./icons/icon-384.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.all(
        APP_SHELL.map((url) =>
          cache.add(url).catch((err) => {
            console.warn("SW precache skipped (missing or failed):", url, err);
          })
        )
      )
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  // Navigation / HTML requests: try the network FIRST so users always get the
  // latest deployed version. Only fall back to cache if they're offline.
  // (A plain cache-first strategy here is the most common reason a PWA looks
  // "stuck" on an old version after you push a fix.)
  if (event.request.mode === "navigate" || event.request.destination === "document") {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return res;
        })
        .catch(() => caches.match(event.request).then((cached) => cached || caches.match("./index.html")))
    );
    return;
  }

  // Static assets (icons, manifest, css/js if any): cache-first is fine, they rarely change.
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).catch(() => cached))
  );
});
