
const CACHE_NAME = "pwa-cache-v1";

const urlsToCache = [
    "/",
    "/index.html",
    "/css/styles.css",
    "/js/ui.js",
    "/img/dish.png"
];

self.addEventListener("install", event => {
    console.log("Service Worker: Installing...");

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log("Caching files...");
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                console.log("Files cached successfully.");
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
            if (response) {
                console.log("Serving from cache:", event.request.url);
                return response;
            }
            console.log("Fetching from network:", event.request.url);
            return fetch(event.request);
        })
    );
});
