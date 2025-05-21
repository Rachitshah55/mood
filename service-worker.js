const CACHE_NAME = "mood-cache-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./style.css",
  "./main.js",
  "./favicon.ico",
  "./preview.jpg",
  "./icon192.png",
  "./icon512.png",
  "./widget.js",
  "./iframe.html",
  "./assets/sounds/birds.mp3",
  "./assets/sounds/wind.mp3",
  "./assets/sounds/rain.mp3",
  "./assets/sounds/snow.mp3",
  "./assets/sounds/storm.mp3"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
}); 