/**
 * PORTFOLIO BRIDGE
 * Handles the secure uplink to remote portfolio sites
 */

function openPortfolioBridge(e, url) {
    if (e) e.preventDefault();
    const bridge = document.getElementById('portfolioBridge');
    const iframe = document.getElementById('portfolioIframe');
    const loader = bridge.querySelector('.bridge-loader');
    const windowEl = document.getElementById('bridgeWindow');
    const headerEl = document.getElementById('bridgeHeader');

    bridge.classList.add('active');
    iframe.src = url;
    loader.style.display = 'flex';

    iframe.onload = () => {
        loader.style.display = 'none';
    };

    if (typeof AudioEngine !== 'undefined') AudioEngine.play('beep');

    // Initialize Draggable/Resizable for Bridge
    if (!window.bridgeDraggable && typeof DraggableHUDElement !== 'undefined') {
        window.bridgeDraggable = new DraggableHUDElement(windowEl, headerEl);
        initResizableBridge();
    }
}

function toggleMaximizeBridge() {
    const windowEl = document.getElementById('bridgeWindow');
    if (windowEl) windowEl.classList.toggle('maximized');
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
