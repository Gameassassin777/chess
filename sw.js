const CACHE_NAME = "nexus-chess-v10";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./js/app.js",
  "./js/chess_logic.js",
  "./js/pieces_svg.js",
  "./manifest.json",
  "./apple-touch-icon.png",
  "./icon-512.png",
  "./assets/pieces/holo/p.png",
  "./assets/pieces/holo/n.png",
  "./assets/pieces/holo/b.png",
  "./assets/pieces/holo/r.png",
  "./assets/pieces/holo/q.png",
  "./assets/pieces/holo/k.png"
];

// Install Event
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  // Force active SW to be replaced immediately
  self.skipWaiting();
});

// Activate Event
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  // Take control of all pages immediately
  self.clients.claim();
});

// Fetch Event: Network first, fallback to Cache
self.addEventListener("fetch", (e) => {
  // Only handle GET requests and skip WebSocket, Worker, and version check URLs
  if (
    e.request.method !== "GET" ||
    e.request.url.includes("/ws/") ||
    e.request.url.includes("/rooms/") ||
    e.request.url.includes("version.json")
  ) {
    return;
  }
  
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        // Clone response and cache it
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, resClone);
        });
        return res;
      })
      .catch(() => {
        // Fallback to cache if offline
        return caches.match(e.request);
      })
  );
});
