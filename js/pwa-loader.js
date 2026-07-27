/**
 * PWA LOADER
 * Service Worker registration and PWA support
 * Now exported as ES module.
 */

export function initPWA() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    const installingWorker = registration.installing;
                    if (installingWorker) {
                        installingWorker.addEventListener('statechange', (e) => {
                            if (e.target.state === 'installed' && navigator.serviceWorker.controller) {
                                if (window.confirm('New content available! Reload to update?')) {
                                    window.location.reload();
                                }
                            }
                        });
                    }
                })
                .catch(() => {
                    // SW registration failed
                });
        });
    }

    // Handle PWA Install Prompt
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the mini-infobar from appearing on mobile
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Update UI notify the user they can install the PWA
        const installBtn = document.getElementById('pwaInstallBtn');
        const installItem = document.getElementById('pwaInstallItem');
        if (installBtn && installItem) {
            installItem.classList.remove('d-none');
            installBtn.addEventListener('click', async () => {
                installItem.classList.add('d-none');
                // Show the install prompt
                deferredPrompt.prompt();
                // Wait for the user to respond to the prompt
                await deferredPrompt.userChoice;
                deferredPrompt = null;
            });
        }
    });

    window.addEventListener('appinstalled', () => {
        // Clear the deferredPrompt so it can be garbage collected
        deferredPrompt = null;
    });
}
