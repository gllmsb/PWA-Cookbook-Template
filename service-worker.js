
const CACHE_NAME = "christmas-app-v1";

const ASSETS = [
    "/",
    "/index.html",
    "/css/styles.css",
    "/js/main.js",
    "/img/christmas-tree.png",
    "/fallback.html" 
];

self.addEventListener("install", event => {
    console.log("Service Worker: Installing...");

    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log("Caching static assets...");
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener("activate", event => {
    console.log("Service Worker: Activated.");

    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => {
                        console.log("Deleting old cache:", key);
                        return caches.delete(key);
                    })
            );
        })
    );
});

self.addEventListener("fetch", event => {
    console.log("Fetching:", event.request.url);

    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        }).catch(() => {
            return caches.match("/fallback.html");
        })
    );
});
