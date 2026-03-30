/**
 * FLOATING WIDGET MANAGER v3.0
 * Draggable + Resizable for: GitHub Feed, KPI, Real-Time Metrics
 * Chatbot intentionally excluded — it uses its own CSS toggle system
 */

class FloatingWidget {
    constructor(element, options = {}) {
        if (!element) return;
        this.element = element;
        this.opts = Object.assign({
            title: 'Widget',
            minW: 220, minH: 150,
            maxW: Math.min(window.innerWidth  * 0.9, 860),
            maxH: Math.min(window.innerHeight * 0.9, 700),
            defW: 320,  defH: 380,
            defX: null, defY: null,
            zBase: 1500
        }, options);

        this._dragging  = false;
        this._resizing  = false;
        this._resizeDir = null;
        this._dsx = 0; this._dsy = 0; // drag start mouse
        this._del = 0; this._det = 0; // drag start element pos
        this._rsw = 0; this._rsh = 0; // resize start size
        this._rsl = 0; this._rst = 0; // resize start pos

        this._onMove = this._move.bind(this);
        this._onUp   = this._up.bind(this);
        this._setup();
    }

    _setup() {
        const el = this.opts;
        const e  = this.element;

        e.classList.add('floating-widget');

        // ── inject fw-header ──
        if (!e.querySelector('.fw-header')) {
            const h = document.createElement('div');
            h.className = 'fw-header';
            h.innerHTML = `
                <span class="fw-title">${this.opts.title}</span>
                <span class="fw-controls">
                    <button class="fw-btn fw-min"   title="Minimize">−</button>
                    <button class="fw-btn fw-max"   title="Maximize">□</button>
                    <button class="fw-btn fw-close" title="Close">×</button>
                </span>`;
            e.insertBefore(h, e.firstChild);
        }

        // ── resize handles ──
        ['nw','n','ne','e','se','s','sw','w'].forEach(d => {
            const r = document.createElement('div');
            r.className = `fw-resize fw-resize-${d}`;
            r.dataset.dir = d;
            e.appendChild(r);
            r.addEventListener('mousedown', ev => this._startResize(ev));
        });

        // ── size + position ──
        e.style.cssText += `
            position: fixed !important;
            width:  ${this.opts.defW}px;
            height: ${this.opts.defH}px;
            left: ${this.opts.defX !== null ? this.opts.defX : Math.max(0, window.innerWidth  - this.opts.defW - 24)}px;
            top:  ${this.opts.defY !== null ? this.opts.defY : Math.max(0, window.innerHeight - this.opts.defH - 110)}px;
            z-index: ${this.opts.zBase};
            overflow: hidden;
        `;

        // ── drag via header ──
        const header = e.querySelector('.fw-header');
        if (header) {
            header.addEventListener('mousedown', ev => this._startDrag(ev));
        }

        // ── control buttons ──
        e.querySelector('.fw-min')  ?.addEventListener('click', () => this._minimize());
        e.querySelector('.fw-max')  ?.addEventListener('click', () => this._maximize());
        e.querySelector('.fw-close')?.addEventListener('click', () => { e.style.display = 'none'; });

        // ── bring to front on click ──
        e.addEventListener('mousedown', () => this._toFront());

        document.addEventListener('mousemove', this._onMove);
        document.addEventListener('mouseup',   this._onUp);
    }

    _startDrag(e) {
        if (e.target.closest('.fw-controls')) return;
        this._dragging = true;
        this._dsx = e.clientX;
        this._dsy = e.clientY;
        this._del = parseInt(this.element.style.left) || 0;
        this._det = parseInt(this.element.style.top)  || 0;
        this.element.querySelector('.fw-header').style.cursor = 'grabbing';
        e.preventDefault();
    }

    _startResize(e) {
        e.preventDefault(); e.stopPropagation();
        this._resizing  = true;
        this._resizeDir = e.target.dataset.dir;
        this._dsx  = e.clientX; this._dsy = e.clientY;
        this._rsw  = parseInt(this.element.style.width)  || this.opts.defW;
        this._rsh  = parseInt(this.element.style.height) || this.opts.defH;
        this._rsl  = parseInt(this.element.style.left)   || 0;
        this._rst  = parseInt(this.element.style.top)    || 0;
    }

    _move(e) {
        if (this._dragging) {
            const dx = e.clientX - this._dsx;
            const dy = e.clientY - this._dsy;
            this.element.style.left = Math.max(0, this._del + dx) + 'px';
            this.element.style.top  = Math.max(0, this._det + dy) + 'px';
        }
        if (this._resizing) {
            const { minW, minH, maxW, maxH } = this.opts;
            const dx = e.clientX - this._dsx;
            const dy = e.clientY - this._dsy;
            const d  = this._resizeDir;
            let w = this._rsw, h = this._rsh, l = this._rsl, t = this._rst;

            if (d.includes('e')) w = Math.min(maxW, Math.max(minW, this._rsw + dx));
            if (d.includes('s')) h = Math.min(maxH, Math.max(minH, this._rsh + dy));
            if (d.includes('w')) { w = Math.min(maxW, Math.max(minW, this._rsw - dx)); l = this._rsl + (this._rsw - w); }
            if (d.includes('n')) { h = Math.min(maxH, Math.max(minH, this._rsh - dy)); t = this._rst + (this._rsh - h); }

            this.element.style.width  = w + 'px';
            this.element.style.height = h + 'px';
            this.element.style.left   = l + 'px';
            this.element.style.top    = t + 'px';
        }
    }

    _up() {
        if (this._dragging) {
            const h = this.element.querySelector('.fw-header');
            if (h) h.style.cursor = 'grab';
        }
        this._dragging = this._resizing = false;
        this._resizeDir = null;
    }

    _minimize() {
        this.element.classList.toggle('fw-minimized');
        const isMin = this.element.classList.contains('fw-minimized');
        this.element.querySelectorAll(':scope > *:not(.fw-header):not(.fw-resize)').forEach(el => {
            el.style.display = isMin ? 'none' : '';
        });
    }

    _maximize() {
        if (this.element.classList.contains('fw-maximized')) {
            this.element.classList.remove('fw-maximized');
            this.element.style.width  = this.opts.defW + 'px';
            this.element.style.height = this.opts.defH + 'px';
            this.element.style.left   = (window.innerWidth  - this.opts.defW - 24) + 'px';
            this.element.style.top    = (window.innerHeight - this.opts.defH - 110) + 'px';
        } else {
            this.element.classList.add('fw-maximized');
            Object.assign(this.element.style, { width:'88vw', height:'85vh', left:'6vw', top:'8vh' });
        }
    }

    _toFront() {
        document.querySelectorAll('.floating-widget').forEach(w => w.style.zIndex = this.opts.zBase);
        this.element.style.zIndex = this.opts.zBase + 10;
    }
}

// ── Init specific widgets ──────────────────────────────

function initFloatingWidgets() {
    if (window._fwDone) return;
    window._fwDone = true;

    // GitHub Live Feed widget
    const ghWidget = document.getElementById('githubWidget');
    if (ghWidget) {
        new FloatingWidget(ghWidget, {
            title: '[LIVE_FEED]',
            defW: 380, defH: 360,
            minW: 280, minH: 240,
            defX: 24,
            defY: window.innerHeight - 430,
            zBase: 1500
        });
    }

    // Operational KPI (rendered by tactical-widgets.js into body)
    const kpi = document.getElementById('metricsWidget');
    if (kpi) {
        new FloatingWidget(kpi, {
            title: '[OPERATIONAL_KPI]',
            defW: 240, defH: 210,
            minW: 200, minH: 180,
            defX: window.innerWidth - 280,
            defY: 90,
            zBase: 1500
        });
    }

    // Real-Time Metrics chart widget
    const dataViz = document.getElementById('dataVizWidget');
    if (dataViz) {
        new FloatingWidget(dataViz, {
            title: '[REAL_TIME_METRICS]',
            defW: 330, defH: 260,
            minW: 260, minH: 200,
            defX: window.innerWidth - 370,
            defY: 315,
            zBase: 1500
        });
    }
}

document.addEventListener('DOMContentLoaded', () => setTimeout(initFloatingWidgets, 500));
window.addEventListener('load', () => setTimeout(initFloatingWidgets, 800));
