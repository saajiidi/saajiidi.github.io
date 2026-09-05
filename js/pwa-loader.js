/**
 * PWA LOADER
 * Service Worker registration and PWA support
 * Now exported as ES module.
 */

function showUpdateToast() {
    if (document.getElementById('pwa-update-toast')) return;
    const toast = document.createElement('div');
    toast.id = 'pwa-update-toast';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');
    toast.style.cssText = `
        position: fixed;
        bottom: max(20px, calc(15px + env(safe-area-inset-bottom)));
        left: 50%;
        transform: translateX(-50%);
        background: rgba(15, 23, 42, 0.96);
        color: #f8fafc;
        border: 1px solid var(--primary-color, #38bdf8);
        border-radius: 8px;
        padding: 10px 16px;
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 99999;
        box-shadow: 0 10px 30px rgba(0,0,0,0.6);
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-size: 0.8rem;
        max-width: calc(100vw - 32px);
    `;
    toast.innerHTML = `
        <span style="display:inline-flex;align-items:center;gap:6px;">
            <span style="width:8px;height:8px;border-radius:50%;background:var(--primary-color,#38bdf8);display:inline-block;"></span>
            Update available
        </span>
        <button id="pwa-reload-btn" type="button" style="background:var(--primary-color,#38bdf8);color:#0f172a;border:none;padding:5px 12px;border-radius:4px;font-weight:700;font-size:0.75rem;cursor:pointer;min-height:32px;">Reload</button>
        <button id="pwa-dismiss-btn" type="button" style="background:transparent;color:#94a3b8;border:none;font-size:16px;cursor:pointer;padding:0 4px;min-height:32px;" title="Dismiss">&times;</button>
    `;
    document.body.appendChild(toast);
    document.getElementById('pwa-reload-btn')?.addEventListener('click', () => {
        window.location.reload();
    });
    document.getElementById('pwa-dismiss-btn')?.addEventListener('click', () => {
        toast.remove();
    });
}

export function initPWA() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    const trackInstalling = (worker) => {
                        worker.addEventListener('statechange', () => {
                            if (worker.state === 'installed' && navigator.serviceWorker.controller) {
                                showUpdateToast();
                            }
                        });
                    };

                    if (registration.waiting && navigator.serviceWorker.controller) {
                        showUpdateToast();
                    } else if (registration.installing) {
                        trackInstalling(registration.installing);
                    }

                    registration.addEventListener('updatefound', () => {
                        if (registration.installing) {
                            trackInstalling(registration.installing);
                        }
                    });
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
