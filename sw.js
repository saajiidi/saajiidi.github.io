/**
 * TACTICAL SERVICE WORKER V2
 * PWA Support for offline functionality with Network-First strategy for updates
 */

const CACHE_NAME = 'tactical-intel-v9';

// Only cache HTML entry points and the manifest.
// Vite-bundled CSS/JS live under dist/assets/ with content-hashed filenames,
// so we let stale-while-revalidate handle them dynamically.
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/theme-sketchbook.html',
    '/theme-tactical.html',
    '/resume.html',
    '/projects.html',
    '/manifest.json',
    '/img/profile.jpg',
    '/img/icon.png'
];

// Install: Cache static assets (one 404 must not abort the whole install)
self.addEventListener('install', (event) => {
    console.log('[SW] Installing Tactical Service Worker V2...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => Promise.allSettled(
                STATIC_ASSETS.map(url => cache.add(url).catch(err =>
                    console.warn('[SW] skip cache:', url, err.message)))
            ))
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

