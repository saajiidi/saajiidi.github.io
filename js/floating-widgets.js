/**
 * FLOATING WIDGET MANAGER
 * Makes chatbot, live feed, KPI, and metrics resizable and movable
 */

class FloatingWidget {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            resizable: options.resizable !== false,
            draggable: options.draggable !== false,
            minWidth: options.minWidth || 200,
            minHeight: options.minHeight || 150,
            maxWidth: options.maxWidth || window.innerWidth * 0.8,
            maxHeight: options.maxHeight || window.innerHeight * 0.8,
            defaultWidth: options.defaultWidth || 300,
            defaultHeight: options.defaultHeight || 400,
            ...options
        };
        
        this.isDragging = false;
        this.isResizing = false;
        this.currentX = 0;
        this.currentY = 0;
        this.initialX = 0;
        this.initialY = 0;
        this.xOffset = 0;
        this.yOffset = 0;
        
        this.init();
    }
    
    init() {
        // Add floating widget class
        this.element.classList.add('floating-widget');
        
        // Create header if not exists
        if (!this.element.querySelector('.widget-header')) {
            const header = document.createElement('div');
            header.className = 'widget-header';
            header.innerHTML = `
                <div class="widget-title">${this.options.title || 'Widget'}</div>
                <div class="widget-controls">
                    <button class="widget-btn widget-minimize" title="Minimize">−</button>
                    <button class="widget-btn widget-maximize" title="Maximize">□</button>
                    <button class="widget-btn widget-close" title="Close">×</button>
                </div>
            `;
            this.element.insertBefore(header, this.element.firstChild);
        }
        
        // Create resize handles
        if (this.options.resizable) {
            const resizeHandles = ['nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'];
            resizeHandles.forEach(position => {
                const handle = document.createElement('div');
                handle.className = `resize-handle resize-${position}`;
                this.element.appendChild(handle);
            });
        }
        
        // Set initial size and position
        this.setDefaultPosition();
        this.setupEventListeners();
    }
    
    setDefaultPosition() {
        const rect = this.element.getBoundingClientRect();
        
        // Set default size
        this.element.style.width = this.options.defaultWidth + 'px';
        this.element.style.height = this.options.defaultHeight + 'px';
        
        // Position in bottom-right corner with some margin
        const x = window.innerWidth - this.options.defaultWidth - 50;
        const y = window.innerHeight - this.options.defaultHeight - 100;
        
        this.element.style.position = 'fixed';
        this.element.style.left = x + 'px';
        this.element.style.top = y + 'px';
        this.element.style.zIndex = '1000';
        
        this.xOffset = x;
        this.yOffset = y;
    }
    
    setupEventListeners() {
        const header = this.element.querySelector('.widget-header');
        
        // Dragging
        if (this.options.draggable && header) {
            header.addEventListener('mousedown', (e) => this.dragStart(e));
            document.addEventListener('mousemove', (e) => this.drag);
            document.addEventListener('mouseup', () => this.dragEnd());
        }
        
        // Resizing
        if (this.options.resizable) {
            const handles = this.element.querySelectorAll('.resize-handle');
            handles.forEach(handle => {
                handle.addEventListener('mousedown', (e) => this.resizeStart(e));
            });
            document.addEventListener('mousemove', (e) => this.resize);
            document.addEventListener('mouseup', () => this.resizeEnd());
        }
        
        // Control buttons
        const minimizeBtn = this.element.querySelector('.widget-minimize');
        const maximizeBtn = this.element.querySelector('.widget-maximize');
        const closeBtn = this.element.querySelector('.widget-close');
        
        if (minimizeBtn) minimizeBtn.addEventListener('click', () => this.minimize());
        if (maximizeBtn) maximizeBtn.addEventListener('click', () => this.maximize());
        if (closeBtn) closeBtn.addEventListener('click', () => this.close());
        
        // Bring to front on click
        this.element.addEventListener('mousedown', () => this.bringToFront());
    }
    
    dragStart(e) {
        if (e.target.closest('.widget-controls')) return;
        
        this.initialX = e.clientX - this.xOffset;
        this.initialY = e.clientY - this.yOffset;
        
        if (e.target === this.element.querySelector('.widget-header')) {
            this.isDragging = true;
            this.element.style.cursor = 'grabbing';
        }
    }
    
    drag(e) {
        if (this.isDragging) {
            e.preventDefault();
            this.currentX = e.clientX - this.initialX;
            this.currentY = e.clientY - this.initialY;
            
            this.xOffset = this.currentX;
            this.yOffset = this.currentY;
            
            this.element.style.left = this.currentX + 'px';
            this.element.style.top = this.currentY + 'px';
        }
    }
    
    dragEnd() {
        this.initialX = this.currentX;
        this.initialY = this.currentY;
        this.isDragging = false;
        this.element.style.cursor = 'auto';
    }
    
    resizeStart(e) {
        e.preventDefault();
        e.stopPropagation();
        
        this.isResizing = true;
        this.initialX = e.clientX;
        this.initialY = e.clientY;
        this.startWidth = parseInt(document.defaultView.getComputedStyle(this.element).width, 10);
        this.startHeight = parseInt(document.defaultView.getComputedStyle(this.element).height, 10);
        this.startLeft = parseInt(document.defaultView.getComputedStyle(this.element).left, 10);
        this.startTop = parseInt(document.defaultView.getComputedStyle(this.element).top, 10);
        
        this.resizeHandle = e.target.className.replace('resize-handle resize-', '');
    }
    
    resize(e) {
        if (this.isResizing) {
            let newWidth = this.startWidth;
            let newHeight = this.startHeight;
            let newLeft = this.startLeft;
            let newTop = this.startTop;
            
            const deltaX = e.clientX - this.initialX;
            const deltaY = e.clientY - this.initialY;
            
            switch(this.resizeHandle) {
                case 'e':
                    newWidth = Math.min(Math.max(this.options.minWidth, this.startWidth + deltaX), this.options.maxWidth);
                    break;
                case 'w':
                    newWidth = Math.min(Math.max(this.options.minWidth, this.startWidth - deltaX), this.options.maxWidth);
                    newLeft = this.startLeft + this.startWidth - newWidth;
                    break;
                case 's':
                    newHeight = Math.min(Math.max(this.options.minHeight, this.startHeight + deltaY), this.options.maxHeight);
                    break;
                case 'n':
                    newHeight = Math.min(Math.max(this.options.minHeight, this.startHeight - deltaY), this.options.maxHeight);
                    newTop = this.startTop + this.startHeight - newHeight;
                    break;
                case 'se':
                    newWidth = Math.min(Math.max(this.options.minWidth, this.startWidth + deltaX), this.options.maxWidth);
                    newHeight = Math.min(Math.max(this.options.minHeight, this.startHeight + deltaY), this.options.maxHeight);
                    break;
                case 'sw':
                    newWidth = Math.min(Math.max(this.options.minWidth, this.startWidth - deltaX), this.options.maxWidth);
                    newHeight = Math.min(Math.max(this.options.minHeight, this.startHeight + deltaY), this.options.maxHeight);
                    newLeft = this.startLeft + this.startWidth - newWidth;
                    break;
                case 'ne':
                    newWidth = Math.min(Math.max(this.options.minWidth, this.startWidth + deltaX), this.options.maxWidth);
                    newHeight = Math.min(Math.max(this.options.minHeight, this.startHeight - deltaY), this.options.maxHeight);
                    newTop = this.startTop + this.startHeight - newHeight;
                    break;
                case 'nw':
                    newWidth = Math.min(Math.max(this.options.minWidth, this.startWidth - deltaX), this.options.maxWidth);
                    newHeight = Math.min(Math.max(this.options.minHeight, this.startHeight - deltaY), this.options.maxHeight);
                    newLeft = this.startLeft + this.startWidth - newWidth;
                    newTop = this.startTop + this.startHeight - newHeight;
                    break;
            }
            
            this.element.style.width = newWidth + 'px';
            this.element.style.height = newHeight + 'px';
            this.element.style.left = newLeft + 'px';
            this.element.style.top = newTop + 'px';
        }
    }
    
    resizeEnd() {
        this.isResizing = false;
    }
    
    minimize() {
        this.element.classList.add('minimized');
        const content = this.element.querySelector('.widget-content, .ai-chat-container, .bridge-content, .kpi-container');
        if (content) content.style.display = 'none';
    }
    
    maximize() {
        if (this.element.classList.contains('maximized')) {
            // Restore to original size
            this.element.classList.remove('maximized');
            this.element.style.width = this.options.defaultWidth + 'px';
            this.element.style.height = this.options.defaultHeight + 'px';
            this.element.style.left = this.xOffset + 'px';
            this.element.style.top = this.yOffset + 'px';
        } else {
            // Maximize
            this.element.classList.add('maximized');
            this.element.style.width = '90vw';
            this.element.style.height = '90vh';
            this.element.style.left = '5vw';
            this.element.style.top = '5vh';
        }
    }
    
    close() {
        this.element.style.display = 'none';
    }
    
    bringToFront() {
        const widgets = document.querySelectorAll('.floating-widget');
        widgets.forEach(widget => {
            widget.style.zIndex = '1000';
        });
        this.element.style.zIndex = '1001';
    }
}

// Widget Manager
class WidgetManager {
    constructor() {
        this.widgets = new Map();
        this.init();
    }
    
    init() {
        // Initialize existing widgets
        this.initializeChatbot();
        this.initializeLiveFeed();
        this.initializeKPI();
        this.initializeMetrics();
    }
    
    initializeChatbot() {
        const chatbot = document.getElementById('aiChatContainer');
        if (chatbot) {
            const widget = new FloatingWidget(chatbot, {
                title: 'AI Oracle',
                defaultWidth: 350,
                defaultHeight: 500,
                minWidth: 280,
                minHeight: 400
            });
            this.widgets.set('chatbot', widget);
        }
    }
    
    initializeLiveFeed() {
        const liveFeed = document.getElementById('portfolioBridge');
        if (liveFeed) {
            const widget = new FloatingWidget(liveFeed, {
                title: 'Live Activity Feed',
                defaultWidth: 400,
                defaultHeight: 300,
                minWidth: 300,
                minHeight: 200
            });
            this.widgets.set('livefeed', widget);
        }
    }
    
    initializeKPI() {
        const kpiContainer = document.querySelector('.kpi-dashboard');
        if (kpiContainer) {
            const widget = new FloatingWidget(kpiContainer, {
                title: 'Operational KPI',
                defaultWidth: 320,
                defaultHeight: 250,
                minWidth: 280,
                minHeight: 200
            });
            this.widgets.set('kpi', widget);
        }
    }
    
    initializeMetrics() {
        const metricsContainer = document.querySelector('.real-time-metrics');
        if (metricsContainer) {
            const widget = new FloatingWidget(metricsContainer, {
                title: 'Real-time Metrics',
                defaultWidth: 380,
                defaultHeight: 280,
                minWidth: 320,
                minHeight: 220
            });
            this.widgets.set('metrics', widget);
        }
    }
    
    getWidget(name) {
        return this.widgets.get(name);
    }
    
    restoreAll() {
        this.widgets.forEach(widget => {
            widget.element.style.display = 'block';
        });
    }
}

// Initialize widget manager
let widgetManager;
document.addEventListener('DOMContentLoaded', () => {
    widgetManager = new WidgetManager();
    
    // Global access
    window.WidgetManager = WidgetManager;
    window.widgetManager = widgetManager;
});
