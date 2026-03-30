/**
 * PWA LOADER
 * Handles Service Worker registration and update prompts
 */

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('[TACTICAL] Service Worker registered:', registration.scope);

                // Check for updates periodically
                registration.update();

                registration.onupdatefound = () => {
                    const installingWorker = registration.installing;
                    installingWorker.onstatechange = () => {
                        if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('[TACTICAL] New content available; please refresh.');
                        }
                    };
                };
            })
            .catch((error) => {
                console.log('[TACTICAL] Service Worker registration failed:', error);
            });
    });

    // Reload when the new service worker takes over
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
            window.location.reload();
            refreshing = true;
        }
    });
}
