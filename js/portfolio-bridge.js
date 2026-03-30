/**
 * PORTFOLIO BRIDGE
 * Handles the secure uplink to remote portfolio sites
 */

const EXTERNAL_BLOCK_LIST = [
    'wa.me', 'whatsapp.com', 'api.whatsapp.com',
    'chatgpt.com', 'openai.com', 'chat.openai.com',
    'google.com', 'linkedin.com', 'facebook.com', 'instagram.com', 'twitter.com'
];

function openPortfolioBridge(e, url) {
    if (e) e.preventDefault();
    const bridge = document.getElementById('portfolioBridge');
    const iframe = document.getElementById('portfolioIframe');
    const loader = bridge.querySelector('.bridge-loader');
    const displayUrl = document.getElementById('bridgeDisplayUrl');

    const normalizedUrl = url.toLowerCase();
    const isBlocked = EXTERNAL_BLOCK_LIST.some(domain => normalizedUrl.includes(domain.toLowerCase()));

    if (isBlocked) {
        // [BYPASS_ENGAGED] - Direct Tab/Window Popup for Restricted Nodes
        console.log('[UPLINK_STATUS]: Restricted Node Detected. Shifting to Secure Direct Window.');
        const win = window.open(url, '_blank');
        if (!win || win.closed || typeof win.closed == 'undefined') {
            // Popup blocker likely active - use direct location shift if it's the last resort
            window.location.assign(url);
        }
        if (typeof AudioEngine !== 'undefined') AudioEngine.play('beep');
        return;
    }

    bridge.classList.add('active');
    if (url) {
        iframe.src = url;
        try {
           if (displayUrl) displayUrl.textContent = new URL(url).hostname;
        } catch(err) { if (displayUrl) displayUrl.textContent = "EXTERNAL_NODE"; }
    }
    loader.style.display = 'flex';

    iframe.onload = () => {
        loader.style.display = 'none';
        if (typeof AudioEngine !== 'undefined') AudioEngine.play('click');
    };

    if (typeof AudioEngine !== 'undefined') AudioEngine.play('beep');
}

function minimizePortfolioBridge() {
    const bridge = document.getElementById('portfolioBridge');
    const taskbar = document.getElementById('bridgeTaskbar');
    bridge.style.display = 'none';
    taskbar.classList.add('active');
    if (typeof AudioEngine !== 'undefined') AudioEngine.play('click');
}

function restorePortfolioBridge() {
    const bridge = document.getElementById('portfolioBridge');
    const taskbar = document.getElementById('bridgeTaskbar');
    bridge.style.display = 'flex';
    taskbar.classList.remove('active');
    if (typeof AudioEngine !== 'undefined') AudioEngine.play('click');
}

function toggleMaximizeBridge() {
    const win = document.getElementById('bridgeWindow');
    win.classList.toggle('maximized');
    if (typeof AudioEngine !== 'undefined') AudioEngine.play('click');
}

function initResizableBridge() {
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

function closePortfolioBridge() {
    const bridge = document.getElementById('portfolioBridge');
    const iframe = document.getElementById('portfolioIframe');
    if (!bridge || !iframe) return;

    bridge.classList.remove('active');
    setTimeout(() => {
        iframe.src = '';
    }, 400);
    if (typeof AudioEngine !== 'undefined') AudioEngine.play('click');
}
