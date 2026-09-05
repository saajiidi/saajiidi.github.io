/**
 * FLOATING WIDGET MANAGER v3.0
 * Draggable + Resizable for: GitHub Feed, KPI, Real-Time Metrics
 * Now exported as ES module.
 */

export class FloatingWidget {
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
        this._dsx = 0; this._dsy = 0;
        this._del = 0; this._det = 0;
        this._rsw = 0; this._rsh = 0;
        this._rsl = 0; this._rst = 0;

        this._onMove = this._move.bind(this);
        this._onUp   = this._up.bind(this);
        /** @param {TouchEvent} ev */
        this._onTouchMove = (ev) => {
            if (this._dragging && ev.touches.length === 1) {
                this._move(ev.touches[0]);
            }
        };
        this._onTouchUp = () => this._up();
        this._setup();
    }

    _setup() {
        const e  = this.element;

        e.classList.add('floating-widget');

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

        ['nw','n','ne','e','se','s','sw','w'].forEach(d => {
            const r = document.createElement('div');
            r.className = `fw-resize fw-resize-${d}`;
            r.dataset.dir = d;
            e.appendChild(r);
            r.addEventListener('mousedown', ev => this._startResize(ev));
        });

        const initialW = Math.min(this.opts.defW, Math.max(220, window.innerWidth - 24));
        const initialH = Math.min(this.opts.defH, Math.max(200, window.innerHeight - 100));
        const initialLeft = this.opts.defX !== null
            ? Math.max(12, Math.min(this.opts.defX, window.innerWidth - initialW - 12))
            : Math.max(12, window.innerWidth - initialW - 24);
        const initialTop = this.opts.defY !== null
            ? Math.max(70, Math.min(this.opts.defY, window.innerHeight - initialH - 70))
            : Math.max(70, window.innerHeight - initialH - 110);

        e.style.cssText += `
            position: fixed !important;
            width:  ${initialW}px;
            height: ${initialH}px;
            left: ${initialLeft}px;
            top:  ${initialTop}px;
            z-index: ${this.opts.zBase};
            overflow: hidden;
        `;

        const header = e.querySelector('.fw-header');
        if (header) {
            header.addEventListener('mousedown', ev => this._startDrag(ev));
            header.addEventListener('touchstart', ev => {
                if (ev.touches.length === 1) this._startDrag(ev.touches[0]);
            }, { passive: true });
        }

        e.querySelector('.fw-min')  ?.addEventListener('click', () => this._minimize());
        e.querySelector('.fw-max')  ?.addEventListener('click', () => this._maximize());
        e.querySelector('.fw-close')?.addEventListener('click', () => this._destroy());

        e.addEventListener('mousedown', () => this._toFront());

        document.addEventListener('mousemove', this._onMove);
        document.addEventListener('mouseup',   this._onUp);
        document.addEventListener('touchmove', this._onTouchMove, { passive: true });
        document.addEventListener('touchend',   this._onTouchUp, { passive: true });
    }

    /** @param {MouseEvent | Touch} e */
    _startDrag(e) {
        if ('target' in e && e.target instanceof Element && e.target.closest('.fw-controls')) return;
        this._dragging = true;
        this._dsx = e.clientX;
        this._dsy = e.clientY;
        this._del = parseInt(this.element.style.left) || 0;
        this._det = parseInt(this.element.style.top)  || 0;
        const header = /** @type {HTMLElement | null} */ (this.element.querySelector('.fw-header'));
        if (header) header.style.cursor = 'grabbing';
        if ('preventDefault' in e && typeof e.preventDefault === 'function') {
            e.preventDefault();
        }
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

    /** @param {MouseEvent | Touch} e */
    _move(e) {
        if (this._dragging) {
            const dx = e.clientX - this._dsx;
            const dy = e.clientY - this._dsy;
            const curW = parseInt(this.element.style.width) || this.opts.defW;
            const curH = parseInt(this.element.style.height) || this.opts.defH;
            const maxX = Math.max(0, window.innerWidth - curW);
            const maxY = Math.max(0, window.innerHeight - Math.min(curH, 60));
            this.element.style.left = `${Math.max(0, Math.min(maxX, this._del + dx))}px`;
            this.element.style.top  = `${Math.max(0, Math.min(maxY, this._det + dy))}px`;
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

            this.element.style.width  = `${w  }px`;
            this.element.style.height = `${h  }px`;
            this.element.style.left   = `${l  }px`;
            this.element.style.top    = `${t  }px`;
        }
    }

    _up() {
        if (this._dragging) {
            const h = /** @type {HTMLElement | null} */ (this.element.querySelector('.fw-header'));
            if (h) h.style.cursor = 'grab';
        }
        this._dragging = this._resizing = false;
        this._resizeDir = null;
    }

    _destroy() {
        this.element.style.display = 'none';
        this.element.classList.add('fw-hidden');
    }

    _minimize() {
        this.element.classList.toggle('fw-minimized');
        const isMin = this.element.classList.contains('fw-minimized');
        this.element.querySelectorAll(':scope > *:not(.fw-header):not(.fw-resize)').forEach(el => {
            if (el instanceof HTMLElement) el.style.display = isMin ? 'none' : '';
        });
    }

    _maximize() {
        if (this.element.classList.contains('fw-maximized')) {
            this.element.classList.remove('fw-maximized');
            this.element.style.width  = `${this.opts.defW  }px`;
            this.element.style.height = `${this.opts.defH  }px`;
            this.element.style.left   = `${window.innerWidth  - this.opts.defW - 24  }px`;
            this.element.style.top    = `${window.innerHeight - this.opts.defH - 110  }px`;
        } else {
            this.element.classList.add('fw-maximized');
            Object.assign(this.element.style, { width:'88vw', height:'85vh', left:'6vw', top:'8vh' });
        }
    }

    _toFront() {
        document.querySelectorAll('.floating-widget').forEach(w => {
            if (w instanceof HTMLElement) w.style.zIndex = String(this.opts.zBase);
        });
        this.element.style.zIndex = String(this.opts.zBase + 10);
    }
}

export function toggleTelemetryWidget() {
    const cmdCenter = document.getElementById('commandCenterWidget');
    if (!cmdCenter) return;
    const isHidden = cmdCenter.style.display === 'none' || cmdCenter.classList.contains('fw-hidden');
    if (isHidden) {
        cmdCenter.style.display = 'block';
        cmdCenter.classList.remove('fw-hidden');
        cmdCenter.style.zIndex = '1600';
    } else {
        cmdCenter.style.display = 'none';
        cmdCenter.classList.add('fw-hidden');
    }
    if (typeof window.AudioEngine !== 'undefined') window.AudioEngine.play('beep');
}

export function initFloatingWidgets() {
    if (window._fwDone) return;
    window._fwDone = true;

    // Unified Command Center Widget
    const cmdCenter = document.getElementById('commandCenterWidget');
    if (cmdCenter) {
        const isMobile = window.innerWidth < 768;
        new FloatingWidget(cmdCenter, {
            title: '[COMMAND_CENTER]',
            defW: isMobile ? Math.min(280, window.innerWidth - 24) : 300,
            defH: isMobile ? 320 : 400,
            minW: 240, minH: 260,
            defX: isMobile ? 12 : window.innerWidth - 340,
            defY: isMobile ? 70 : 80,
            zBase: 1500
        });
        if (isMobile) {
            cmdCenter.style.display = 'none';
            cmdCenter.classList.add('fw-hidden');
        }
    }
}
