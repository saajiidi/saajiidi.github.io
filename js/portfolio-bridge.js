/**
 * PORTFOLIO BRIDGE
 * Handles the secure uplink to remote portfolio sites
 * Now exported as ES module.
 */

export const EXTERNAL_BLOCK_LIST = [
    'wa.me', 'whatsapp.com', 'api.whatsapp.com',
    'chatgpt.com', 'openai.com', 'chat.openai.com',
    'google.com', 'linkedin.com', 'facebook.com', 'instagram.com', 'twitter.com'
];

export function openPortfolioBridge(e, url) {
    if (e) e.preventDefault();
    const bridge = document.getElementById('portfolioBridge');
    const iframe = document.getElementById('portfolioIframe');
    const loader = bridge?.querySelector('.bridge-loader');
    const displayUrl = document.getElementById('bridgeDisplayUrl');

    const normalizedUrl = url.toLowerCase();
    const isBlocked = EXTERNAL_BLOCK_LIST.some(domain => normalizedUrl.includes(domain.toLowerCase()));

    if (isBlocked) {
        const win = window.open(url, '_blank');
        if (!win || win.closed || typeof win.closed == 'undefined') {
            window.location.assign(url);
        }
        if (typeof window.AudioEngine !== 'undefined') window.AudioEngine.play('beep');
        return;
    }

    if (bridge) {
        bridge.style.display = 'flex';
        bridge.classList.add('active');
    }
    const taskbar = document.getElementById('bridgeTaskbar');
    if (taskbar) taskbar.classList.remove('active');
    if (url && iframe) {
        iframe.src = url;
        try {
           if (displayUrl) displayUrl.textContent = new URL(url).hostname;
        } catch { if (displayUrl) displayUrl.textContent = "EXTERNAL_NODE"; }
    }
    if (loader) loader.style.display = 'flex';

    iframe.onload = () => {
        if (loader) loader.style.display = 'none';
        if (typeof window.AudioEngine !== 'undefined') window.AudioEngine.play('click');
    };

    if (typeof window.AudioEngine !== 'undefined') window.AudioEngine.play('beep');
}

export function minimizePortfolioBridge() {
    const bridge = document.getElementById('portfolioBridge');
    const taskbar = document.getElementById('bridgeTaskbar');
    if (bridge) bridge.style.display = 'none';
    if (taskbar) taskbar.classList.add('active');
    if (typeof window.AudioEngine !== 'undefined') window.AudioEngine.play('click');
}

export function restorePortfolioBridge() {
    const bridge = document.getElementById('portfolioBridge');
    const taskbar = document.getElementById('bridgeTaskbar');
    if (bridge) bridge.style.display = 'flex';
    if (taskbar) taskbar.classList.remove('active');
    if (typeof window.AudioEngine !== 'undefined') window.AudioEngine.play('click');
}

export function toggleMaximizeBridge() {
    const win = document.getElementById('bridgeWindow');
    if (win) win.classList.toggle('maximized');
    if (typeof window.AudioEngine !== 'undefined') window.AudioEngine.play('click');
}

export function initResizableBridge() {
    const win = document.getElementById('bridgeWindow');
    if (!win) return;
    const handle = win.querySelector('.bridge-resize-handle');
    if (!handle) return;
    let isResizing = false;

    handle.addEventListener('mousedown', (e) => {
        isResizing = true;
        document.addEventListener('mousemove', handleResize);
        document.addEventListener('mouseup', () => {
            isResizing = false;
            document.removeEventListener('mousemove', handleResize);
        });
        e.preventDefault();
    });

    function handleResize(e) {
        if (!isResizing) return;
        const rect = win.getBoundingClientRect();
        win.style.width = `${e.clientX - rect.left}px`;
        win.style.height = `${e.clientY - rect.top}px`;
        win.style.maxWidth = 'none';
    }
}

export function closePortfolioBridge() {
    const bridge = document.getElementById('portfolioBridge');
    const iframe = document.getElementById('portfolioIframe');
    if (!bridge || !iframe) return;

    bridge.classList.remove('active');
    setTimeout(() => {
        iframe.src = '';
    }, 400);
    if (typeof window.AudioEngine !== 'undefined') window.AudioEngine.play('click');
}
