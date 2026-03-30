/**
 * TACTICAL SERVICE WORKER V2
 * PWA Support for offline functionality with Network-First strategy for updates
 */

const CACHE_NAME = 'tactical-intel-v2';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/css/modern-custom.css',
    '/css/tactical-hud.css',
    '/css/tactical-enhancements.css',
    '/js/tactical-data.js',
    '/js/tactical-enhancements.js',
    '/img/profile.jpg'
];

// Install: Cache static assets
self.addEventListener('install', (event) => {
    console.log('[SW] Installing Tactical Service Worker V2...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate: Clean up old caches immediately
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating Tactical Service Worker V2...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => {
                        console.log('[SW] Deleting old cache:', name);
                        return caches.delete(name);
                    })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch: Network-First for navigation (HTML), Stale-While-Revalidate for others
self.addEventListener('fetch', (event) => {
    const isNavigation = event.request.mode === 'navigate';
    const isRoot = new URL(event.request.url).pathname === '/';

    if (isNavigation || isRoot) {
        // Network-First strategy for index.html/root
        event.respondWith(
            fetch(event.request)
                .then((networkResponse) => {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                    return networkResponse;
                })
                .catch(() => {
                    return caches.match(event.request) || caches.match('/index.html');
                })
        );
    } else {
        // Stale-While-Revalidate strategy for static assets
        event.respondWith(
            caches.match(event.request)
                .then((cachedResponse) => {
                    const fetchPromise = fetch(event.request)
                        .then((networkResponse) => {
                            if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                                const responseClone = networkResponse.clone();
                                caches.open(CACHE_NAME).then((cache) => {
                                    cache.put(event.request, responseClone);
                                });
                            }
                            return networkResponse;
                        });
                    return cachedResponse || fetchPromise;
                })
        );
    }
});

// Message handling for skip waiting
self.addEventListener('message', (event) => {
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }
});

