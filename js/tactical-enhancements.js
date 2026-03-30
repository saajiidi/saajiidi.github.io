/**
 * TACTICAL ENHANCEMENTS - v3.0
 * Advanced HUD features: cursor effects, keyboard shortcuts, command palette, audio, animations
 */

// ===== 1. ENHANCED TYPEWRITER WITH BLOCK CURSOR =====
class EnhancedTypewriter {
    constructor(el, text, speed = 50) {
        this.el = el;
        this.text = text;
        this.speed = speed;
        this.index = 0;
        this.cursorVisible = true;
        this.el.innerHTML = '';
        this.el.classList.add('enhanced-typewriter');
        
        const sessionID = Math.random().toString(36).substr(2, 9);
        this.el.setAttribute('data-session', sessionID);
        this.sessionID = sessionID;
        
        // Add cursor element
        this.cursorEl = document.createElement('span');
        this.cursorEl.className = 'terminal-cursor';
        this.el.appendChild(this.cursorEl);
        
        // Start cursor blink
        this.cursorInterval = setInterval(() => this.blinkCursor(), 530);
    }
    
    blinkCursor() {
        this.cursorVisible = !this.cursorVisible;
        this.cursorEl.style.opacity = this.cursorVisible ? '1' : '0';
    }
    
    type() {
        if (this.el.getAttribute('data-session') !== this.sessionID) {
            clearInterval(this.cursorInterval);
            return;
        }

        if (this.index < this.text.length) {
            this.cursorEl.before(this.text.charAt(this.index));
            this.index++;
            AudioEngine.play('type');
            setTimeout(() => this.type(), this.speed);
        } else {
            // Keep cursor blinking at end
            this.el.classList.add('typing-complete');
        }
    }
    
    stop() {
        clearInterval(this.cursorInterval);
    }
}

// ===== 2. GLITCH ON SCROLL OBSERVER =====
class ScrollGlitchEffect {
    constructor() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('glitched')) {
                    entry.target.classList.add('glitched');
                    glitchEffect(entry.target);
                }
            });
        }, { threshold: 0.5 });
    }
    
    init() {
        const targets = document.querySelectorAll('h2, .section-label, .card-title');
        targets.forEach(el => this.observer.observe(el));
    }
}

// ===== 3. AUDIO ENGINE =====
class AudioEngineClass {
    constructor() {
        this.enabled = localStorage.getItem('tactical-audio') !== 'disabled';
        this.sounds = {};
        this.init();
    }
    
    init() {
        // Create audio context on first user interaction
        this.ctx = null;
        
        // Generate sounds procedurally
        this.generateSounds();
        
        // Enable on first interaction
        document.addEventListener('click', () => this.enableAudio(), { once: true });
        document.addEventListener('keydown', () => this.enableAudio(), { once: true });
    }
    
    enableAudio() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }
    
    generateSounds() {
        // Terminal beep
        this.sounds.beep = () => {
            if (!this.ctx || !this.enabled) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.frequency.setValueAtTime(800, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.1);
            
            gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
            
            osc.start(this.ctx.currentTime);
            osc.stop(this.ctx.currentTime + 0.1);
        };
        
        // Key type click
        this.sounds.type = () => {
            if (!this.ctx || !this.enabled) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.frequency.setValueAtTime(200 + Math.random() * 100, this.ctx.currentTime);
            
            gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.02);
            
            osc.start(this.ctx.currentTime);
            osc.stop(this.ctx.currentTime + 0.02);
        };
        
        // Hover hum
        this.sounds.hover = () => {
            if (!this.ctx || !this.enabled) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.frequency.setValueAtTime(150, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.15);
            
            gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.15);
            
            osc.start(this.ctx.currentTime);
            osc.stop(this.ctx.currentTime + 0.15);
        };
        
        // Click confirm
        this.sounds.click = () => {
            if (!this.ctx || !this.enabled) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.type = 'square';
            osc.frequency.setValueAtTime(400, this.ctx.currentTime);
            
            gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
            
            osc.start(this.ctx.currentTime);
            osc.stop(this.ctx.currentTime + 0.08);
        };
    }
    
    play(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName]();
        }
    }
    
    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('tactical-audio', this.enabled ? 'enabled' : 'disabled');
        return this.enabled;
    }
}

const AudioEngine = new AudioEngineClass();

// ===== 4. KEYBOARD SHORTCUTS =====
class KeyboardNavigator {
    constructor() {
        this.sections = ['about', 'experience', 'education', 'skills', 'projects', 'awards'];
        this.currentSection = 0;
        this.commandPaletteOpen = false;
        this.init();
    }
    
    init() {
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Track current section on scroll
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    this.currentSection = this.sections.indexOf(id);
                }
            });
        }, { threshold: 0.5 });
        
        this.sections.forEach(id => {
            const el = document.getElementById(id);
            if (el) this.observer.observe(el);
        });
    }
    
    handleKeydown(e) {
        // Ignore if typing in input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        // Command palette: Ctrl+K or Cmd+K
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            CommandPalette.toggle();
            return;
        }
        
        // Close palette on Escape
        if (e.key === 'Escape' && this.commandPaletteOpen) {
            CommandPalette.close();
            return;
        }
        
        // Skip if palette is open
        if (this.commandPaletteOpen) return;
        
        // j/k navigation
        if (e.key === 'j' || e.key === 'ArrowDown') {
            e.preventDefault();
            this.nextSection();
        } else if (e.key === 'k' || e.key === 'ArrowUp') {
            e.preventDefault();
            this.prevSection();
        } else if (e.key === 'g' && !e.shiftKey) {
            e.preventDefault();
            this.goToTop();
        } else if (e.key === 'G' || (e.key === 'g' && e.shiftKey)) {
            e.preventDefault();
            this.goToBottom();
        } else if (e.key === '/') {
            e.preventDefault();
            CommandPalette.open();
        } else if (e.altKey && e.key === 't') {
            e.preventDefault();
            const term = document.getElementById('bottomTerminal');
            if (term) term.classList.toggle('active');
            AudioEngine.play('beep');
        } else if (e.altKey && e.key === 'h') {
            e.preventDefault();
            document.body.classList.toggle('hud-off');
            this.showNotification(`HUD Overlays ${document.body.classList.contains('hud-off') ? 'DISABLED' : 'ENABLED'}`);
        } else if (e.altKey && e.key === 'm') {
            e.preventDefault();
            if (typeof AudioEngine !== 'undefined' && AudioEngine.toggleMusic) {
                AudioEngine.toggleMusic();
            } else if (window.AudioEngine && window.AudioEngine.toggleMusic) {
                 window.AudioEngine.toggleMusic();
            } else if (document.getElementById('musicToggle')) {
                document.getElementById('musicToggle').click();
            }
        } else if (e.key === 'a') {
            e.preventDefault();
            AudioEngine.toggle();
            this.showNotification(`Audio ${AudioEngine.enabled ? 'ENABLED' : 'DISABLED'}`);
        }
    }
    
    nextSection() {
        if (this.currentSection < this.sections.length - 1) {
            this.currentSection++;
            this.scrollToSection(this.sections[this.currentSection]);
        }
    }
    
    prevSection() {
        if (this.currentSection > 0) {
            this.currentSection--;
            this.scrollToSection(this.sections[this.currentSection]);
        }
    }
    
    goToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        AudioEngine.play('beep');
    }
    
    goToBottom() {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        AudioEngine.play('beep');
    }
    
    scrollToSection(id) {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
            AudioEngine.play('beep');
        }
    }
    
    showNotification(text) {
        const notif = document.createElement('div');
        notif.className = 'tactical-notification';
        notif.textContent = text;
        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 2000);
    }
}

// ===== 5. COMMAND PALETTE =====
class CommandPaletteClass {
    constructor() {
        this.isOpen = false;
        this.commands = [
            { id: 'about', label: 'About', icon: 'fa-user', shortcut: '1' },
            { id: 'experience', label: 'Experience', icon: 'fa-briefcase', shortcut: '2' },
            { id: 'education', label: 'Education', icon: 'fa-graduation-cap', shortcut: '3' },
            { id: 'skills', label: 'Skills', icon: 'fa-microchip', shortcut: '4' },
            { id: 'projects', label: 'Projects', icon: 'fa-code', shortcut: '5' },
            { id: 'awards', label: 'Awards', icon: 'fa-trophy', shortcut: '6' },
            { type: 'separator' },
            { id: 'theme', label: 'Toggle Theme', icon: 'fa-moon', action: () => document.getElementById('theme-toggle').click() },
            { id: 'audio', label: 'Toggle Audio', icon: 'fa-volume-up', action: () => { AudioEngine.toggle(); } },
            { id: 'top', label: 'Go to Top', icon: 'fa-arrow-up', shortcut: 'g', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }) },
            { id: 'contact', label: 'Contact', icon: 'fa-terminal', action: () => document.querySelector('[data-bs-target="#contactModal"]').click() }
        ];
        this.filteredCommands = [...this.commands];
        this.selectedIndex = 0;
        this.init();
    }
    
    init() {
        this.createPalette();
        this.setupKeyboard();
    }
    
    createPalette() {
        this.palette = document.createElement('div');
        this.palette.className = 'command-palette';
        this.palette.innerHTML = `
            <div class="command-palette-overlay"></div>
            <div class="command-palette-modal card-glass">
                <div class="command-palette-header">
                    <i class="fas fa-terminal"></i>
                    <input type="text" class="command-palette-input" placeholder="Type a command or search..." autocomplete="off">
                    <span class="command-palette-shortcut">ESC to close</span>
                </div>
                <div class="command-palette-commands"></div>
            </div>
        `;
        document.body.appendChild(this.palette);
        
        this.input = this.palette.querySelector('.command-palette-input');
        this.commandsContainer = this.palette.querySelector('.command-palette-commands');
        this.overlay = this.palette.querySelector('.command-palette-overlay');
        
        this.input.addEventListener('input', (e) => this.filter(e.target.value));
        this.input.addEventListener('keydown', (e) => this.handleInputKeydown(e));
        this.overlay.addEventListener('click', () => this.close());
        
        this.renderCommands();
    }
    
    setupKeyboard() {
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.toggle();
            }
        });
    }
    
    filter(query) {
        if (!query) {
            this.filteredCommands = [...this.commands];
        } else {
            const lower = query.toLowerCase();
            this.filteredCommands = this.commands.filter(cmd => 
                cmd.type !== 'separator' && 
                (cmd.label?.toLowerCase().includes(lower) || 
                 cmd.id?.toLowerCase().includes(lower))
            );
        }
        this.selectedIndex = 0;
        this.renderCommands();
    }
    
    handleInputKeydown(e) {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            this.selectedIndex = (this.selectedIndex + 1) % this.filteredCommands.length;
            this.renderCommands();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            this.selectedIndex = (this.selectedIndex - 1 + this.filteredCommands.length) % this.filteredCommands.length;
            this.renderCommands();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const cmd = this.filteredCommands[this.selectedIndex];
            if (cmd) this.execute(cmd);
        } else if (e.key === 'Escape') {
            this.close();
        }
    }
    
    renderCommands() {
        this.commandsContainer.innerHTML = this.filteredCommands.map((cmd, i) => {
            if (cmd.type === 'separator') {
                return '<div class="command-palette-separator"></div>';
            }
            const selected = i === this.selectedIndex ? 'selected' : '';
            return `
                <div class="command-palette-item ${selected}" data-index="${i}">
                    <i class="fas ${cmd.icon}"></i>
                    <span class="command-palette-label">${cmd.label}</span>
                    ${cmd.shortcut ? `<span class="command-palette-key">${cmd.shortcut}</span>` : ''}
                </div>
            `;
        }).join('');
        
        this.commandsContainer.querySelectorAll('.command-palette-item').forEach(item => {
            item.addEventListener('click', () => {
                const cmd = this.filteredCommands[parseInt(item.dataset.index)];
                this.execute(cmd);
            });
            item.addEventListener('mouseenter', () => {
                this.selectedIndex = parseInt(item.dataset.index);
                this.renderCommands();
            });
        });
    }
    
    execute(cmd) {
        AudioEngine.play('click');
        if (cmd.action) {
            cmd.action();
        } else if (cmd.id && document.getElementById(cmd.id)) {
            document.getElementById(cmd.id).scrollIntoView({ behavior: 'smooth' });
        }
        this.close();
    }
    
    open() {
        this.isOpen = true;
        this.palette.classList.add('open');
        this.input.value = '';
        this.filter('');
        setTimeout(() => this.input.focus(), 100);
        AudioEngine.play('beep');
    }
    
    close() {
        this.isOpen = false;
        this.palette.classList.remove('open');
        this.input.blur();
    }
    
    toggle() {
        if (this.isOpen) this.close();
        else this.open();
    }
}

const CommandPalette = new CommandPaletteClass();

// ===== 6. ANIMATED COUNTERS =====
class AnimatedCounters {
    static init() {
        const counters = document.querySelectorAll('.animated-counter');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.dataset.target);
                    const suffix = counter.dataset.suffix || '';
                    const prefix = counter.dataset.prefix || '';
                    AnimatedCounters.animate(counter, target, prefix, suffix);
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(c => observer.observe(c));
    }
    
    static animate(el, target, prefix, suffix) {
        const duration = 2000;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        
        const step = () => {
            current += increment;
            if (current >= target) {
                el.textContent = `${prefix}${target}${suffix}`;
                AudioEngine.play('beep');
            } else {
                el.textContent = `${prefix}${Math.floor(current)}${suffix}`;
                setTimeout(step, duration / steps);
            }
        };
        
        step();
    }
}

// ===== 7. SKILL PROGRESS BARS =====
class SkillProgressBars {
    static init() {
        const container = document.getElementById('skill-progress-bars');
        if (!container) return;
        
        const skills = [
            { name: 'Python', level: 90 },
            { name: 'SQL', level: 85 },
            { name: 'Power BI', level: 95 },
            { name: 'Machine Learning', level: 75 },
            { name: 'Data Analysis', level: 90 }
        ];
        
        container.innerHTML = skills.map(skill => `
            <div class="skill-progress-item">
                <div class="skill-progress-header">
                    <span class="skill-name">${skill.name}</span>
                    <span class="skill-percent">${skill.level}%</span>
                </div>
                <div class="skill-progress-bar">
                    <div class="skill-progress-fill" data-level="${skill.level}"></div>
                </div>
            </div>
        `).join('');
        
        // Animate on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.skill-progress-fill').forEach((fill, i) => {
                        setTimeout(() => {
                            fill.style.width = `${fill.dataset.level}%`;
                        }, i * 100);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(container);
    }
}

// ===== 8. TESTIMONIALS CAROUSEL =====
class TestimonialsCarousel {
    static init() {
        const container = document.getElementById('testimonials-carousel');
        if (!container) return;
        
        const testimonials = [
            {
                quote: "Sajid's data insights transformed our business strategy. His BI dashboards are exceptional.",
                author: "DEEN Commerce Team",
                role: "Business Intelligence"
            },
            {
                quote: "Exceptional analytical skills. The churn prediction model improved our retention by 25%.",
                author: "Project Lead",
                role: "ML Initiative"
            },
            {
                quote: "A true data strategist who understands both technical and business perspectives.",
                author: "Daraz Analytics",
                role: "Marketplace Operations"
            }
        ];
        
        let current = 0;
        
        const render = () => {
            const t = testimonials[current];
            container.innerHTML = `
                <div class="testimonial-card card-glass">
                    <div class="testimonial-quote">"${t.quote}"</div>
                    <div class="testimonial-author">
                        <span class="author-name">${t.author}</span>
                        <span class="author-role">${t.role}</span>
                    </div>
                    <div class="testimonial-nav">
                        <button class="testimonial-btn" onclick="TestimonialsCarousel.prev()">◀</button>
                        <span class="testimonial-dots">
                            ${testimonials.map((_, i) => `<span class="dot ${i === current ? 'active' : ''}"></span>`).join('')}
                        </span>
                        <button class="testimonial-btn" onclick="TestimonialsCarousel.next()">▶</button>
                    </div>
                </div>
            `;
        };
        
        this.testimonials = testimonials;
        this.current = current;
        this.render = render;
        render();
        
        // Auto-advance
        setInterval(() => this.next(), 5000);
    }
    
    static next() {
        this.current = (this.current + 1) % this.testimonials.length;
        this.render();
    }
    
    static prev() {
        this.current = (this.current - 1 + this.testimonials.length) % this.testimonials.length;
        this.render();
    }
}

// ===== 9. SCANLINE PULSE =====
class ScanlinePulse {
    static init() {
        const scanlines = document.querySelector('.scanlines');
        if (!scanlines) return;
        
        // Add CSS animation dynamically
        const style = document.createElement('style');
        style.textContent = `
            @keyframes scanlinePulse {
                0%, 100% { opacity: 0.15; }
                50% { opacity: 0.25; }
            }
            .scanlines {
                animation: scanlineScroll 10s linear infinite, scanlinePulse 4s ease-in-out infinite !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// ===== 10. HOVER AUDIO EFFECTS =====
class HoverAudio {
    static init() {
        const interactiveElements = document.querySelectorAll('a, button, .card-glass, .nav-link');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => AudioEngine.play('hover'));
            el.addEventListener('click', () => AudioEngine.play('click'));
        });
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    new KeyboardNavigator();
    new ScrollGlitchEffect().init();
    ScanlinePulse.init();
    AnimatedCounters.init();
    SkillProgressBars.init();
    TestimonialsCarousel.init();
    HoverAudio.init();
    
    // Initialize Draggable Widgets
    if (document.getElementById('githubWidget')) {
        new DraggableHUDElement(document.getElementById('githubWidget'));
    }
    if (document.getElementById('dataVizWidget')) {
        new DraggableHUDElement(document.getElementById('dataVizWidget'));
    }
});

// ===== 11. DRAGGABLE HUD COMPONENTS =====
class DraggableHUDElement {
    constructor(el, handle = null) {
        this.el = el;
        this.handle = handle || el.querySelector('.widget-header, .viz-header, .bridge-header') || el;
        this.isDragging = false;
        this.offsetX = 0;
        this.offsetY = 0;
        
        this.init();
    }
    
    init() {
        this.handle.style.cursor = 'grab';
        
        // Mouse Events
        this.handle.addEventListener('mousedown', (e) => this.dragStart(e));
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.dragEnd());
        
        // Touch Events
        this.handle.addEventListener('touchstart', (e) => this.dragStart(e), { passive: false });
        document.addEventListener('touchmove', (e) => this.drag(e), { passive: false });
        document.addEventListener('touchend', () => this.dragEnd());
        
        // Load saved position
        const savedPos = localStorage.getItem(`pos-${this.el.id}`);
        if (savedPos) {
            const { x, y } = JSON.parse(savedPos);
            this.el.style.left = x;
            this.el.style.top = y;
            this.el.style.right = 'auto'; // Break initial fixed positioning
            this.el.style.bottom = 'auto';
        }
    }
    
    dragStart(e) {
        if (e.target.closest('button, a')) return; // Don't drag on buttons
        
        this.isDragging = true;
        this.handle.style.cursor = 'grabbing';
        this.el.classList.add('is-dragging');
        
        const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
        
        const rect = this.el.getBoundingClientRect();
        this.offsetX = clientX - rect.left;
        this.offsetY = clientY - rect.top;
        
        AudioEngine.play('click');
        if (e.type === 'touchstart') e.preventDefault();
    }
    
    drag(e) {
        if (!this.isDragging) return;
        
        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
        
        let x = clientX - this.offsetX;
        let y = clientY - this.offsetY;
        
        // Boundary Check
        x = Math.max(10, Math.min(x, window.innerWidth - this.el.offsetWidth - 10));
        y = Math.max(10, Math.min(y, window.innerHeight - this.el.offsetHeight - 10));
        
        this.el.style.left = `${x}px`;
        this.el.style.top = `${y}px`;
        this.el.style.right = 'auto';
        this.el.style.bottom = 'auto';
        
        if (e.type === 'touchmove') e.preventDefault();
    }
    
    dragEnd() {
        if (!this.isDragging) return;
        this.isDragging = false;
        this.handle.style.cursor = 'grab';
        this.el.classList.remove('is-dragging');
        
        // Save Position
        localStorage.setItem(`pos-${this.el.id}`, JSON.stringify({
            x: this.el.style.left,
            y: this.el.style.top
        }));
        
        AudioEngine.play('beep');
    }
}

// Export for global access
window.TestimonialsCarousel = TestimonialsCarousel;
window.AudioEngine = AudioEngine;
window.CommandPalette = CommandPalette;
