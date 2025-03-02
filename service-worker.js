
const STATIC_CACHE = "pwa-static-v2";
const DYNAMIC_CACHE = "pwa-dynamic-v1";
const CACHE_LIMIT = 50; 

const ASSETS = [
    "/",
    "/index.html",
    "/css/styles.css",
    "/js/ui.js",
    "/img/dish.png",
    "/img/icons/icon-192x192.png",
    "/img/icons/icon-512x512.png"
];

self.addEventListener("install", event => {
    console.log("Service Worker: Installing...");

    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log("Caching static assets...");
                return cache.addAll(ASSETS);
            })
            .then(() => {
                console.log("Static cache completed.");
            })
    );
});

self.addEventListener("activate", event => {
    console.log("Service Worker: Activated.");

    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
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
            return response || fetch(event.request).then(fetchRes => {
                return caches.open(DYNAMIC_CACHE).then(cache => {
                    cache.put(event.request.url, fetchRes.clone());
                    limitCacheSize(DYNAMIC_CACHE, CACHE_LIMIT);
                    return fetchRes;
                });
            });
        }).catch(() => {
            console.log("Offline: No cached resource found.");
        })
    );
});

const limitCacheSize = (cacheName, maxItems) => {
    caches.open(cacheName).then(cache => {
        cache.keys().then(keys => {
            if (keys.length > maxItems) {
                cache.delete(keys[0]).then(() => limitCacheSize(cacheName, maxItems));
            }
        });
    });
};
