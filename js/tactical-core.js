/**
 * TACTICAL CORE
 * Core UI interactions, theme management, and base effects
 * Now exported as ES module.
 */

export const GLITCH_CHARS = 'ABCDEFGHIKLMNOPQRSTUVWXYZ0123456789§$#@*&';

export function glitchEffect(el) {
    if (!el) return;
    const originalText = el.getAttribute('data-original') || el.innerText;
    if (!el.getAttribute('data-original')) el.setAttribute('data-original', originalText);

    let iterations = 0;
    const interval = setInterval(() => {
        el.innerText = originalText.split('').map((char, index) => {
            if (index < iterations) return char;
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        }).join('');
        if (iterations >= originalText.length) clearInterval(interval);
        iterations += 1 / 3;
    }, 30);
}

export function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    const themeIcon = themeToggle.querySelector('i');
    if (themeIcon) {
        themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

export function updateSystemHealth() {
    const batteryNode = document.getElementById('batteryNode');
    const memoryNode = document.getElementById('memoryNode');
    const osNode = document.getElementById('osNode');

    if (navigator.getBattery) {
        navigator.getBattery().then(bat => {
            const updateBat = () => { if (batteryNode) batteryNode.textContent = `${Math.round(bat.level * 100)}%`; };
            updateBat();
            bat.onlevelchange = updateBat;
        });
    }

    if (navigator.deviceMemory) {
        if (memoryNode) memoryNode.textContent = `${navigator.deviceMemory}GB_RAM`;
    } else {
        if (memoryNode) memoryNode.textContent = "DETECT_FAILED";
    }

    const platform = navigator.userAgentData ? navigator.userAgentData.platform : "LEGACY_OS";
    if (osNode) osNode.textContent = platform.toUpperCase();
}

export const MISSION_SECRETS = {
    "secrets.txt": "TOP_SECRET: Project Antigravity is a success. Codename: Sajid_Islam. Origin: Dhaka_Grid_02.",
    "access_codes.md": "ACCESS_GRANTED: Use 'sudo clearance' to elevate your situational awareness."
};

export function copyEmail(email, event) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).catch(() => {});
    }
    const btn = (event && event.target) ? (event.target.closest('button') || event.target) : null;
    if (btn) {
        const originalText = btn.innerText;
        btn.innerText = 'COPIED';
        setTimeout(() => { btn.innerText = originalText; }, 2000);
    }
}

export function initTelemetryOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'telemetry-overlay d-none d-xl-flex';

    const colLeft = document.createElement('div');
    colLeft.className = 'telemetry-column left-col';
    const colRight = document.createElement('div');
    colRight.className = 'telemetry-column right-col text-end';

    overlay.appendChild(colLeft);
    overlay.appendChild(colRight);
    document.body.appendChild(overlay);

    const generateHex = () => Array.from({ length: 4 }, () => Math.random().toString(16).substr(2, 4).toUpperCase()).join(' ');
    const generateBin = () => Array.from({ length: 4 }, () => Math.random() > 0.5 ? '1011' : '0100').join(' ');

    const telemetryInterval = setInterval(() => {
        let leftText = '';
        let rightText = '';
        for (let i = 0; i < 35; i++) {
            leftText += `[SYS_${Math.floor(Math.random() * 99)}] 0x${generateHex()}\n`;
            rightText += `MEM_${generateBin()}\n`;
        }
        colLeft.textContent = leftText;
        colRight.textContent = rightText;
    }, 5000);

    window.addEventListener('beforeunload', () => clearInterval(telemetryInterval));
}

export const SkillsGlobe = {
    canvas: null, ctx: null, tags: [],
    radius: 140, angleX: 0, angleY: 0,
    _colorRGB: '74, 222, 128',
    _animFrameId: null,
    _refreshColor() {
        const cs = getComputedStyle(document.documentElement);
        this._colorRGB = cs.getPropertyValue('--primary-color-rgb').trim() || '74, 222, 128';
    },
    init: function () {
        this.canvas = document.getElementById('skillCanvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this._refreshColor();
        const skillList = ["PYTHON", "SQL", "LANGGRAPH", "AI_AGENTS", "POWER_BI", "TABLEAU", "MACHINE_LEARNING", "NLP", "FASTAPI", "BUSINESS_OPS", "CHURN_ANALYSIS", "STREAMLIT", "PANDAS", "DASHBOARDING", "DATA_OPS", "PYTORCH", "DOCKER", "VIZ"];

        this.tags = skillList.map((text, i) => {
            const phi = Math.acos(-1 + (2 * i) / skillList.length);
            const theta = Math.sqrt(skillList.length * Math.PI) * phi;
            return {
                text,
                x: this.radius * Math.cos(theta) * Math.sin(phi),
                y: this.radius * Math.sin(theta) * Math.sin(phi),
                z: this.radius * Math.cos(phi)
            };
        });

        const parent = document.getElementById('canvasParent');
        if (!parent) return;
        this.canvas.width = parent.offsetWidth;
        this.canvas.height = parent.offsetHeight;

        this._onResize = () => {
            this.canvas.width = parent.offsetWidth;
            this.canvas.height = parent.offsetHeight;
        };
        window.addEventListener('resize', this._onResize);
        window.addEventListener('beforeunload', () => {
            window.removeEventListener('resize', this._onResize);
        });

        this._paused = false;
        const observer = new IntersectionObserver((entries) => {
            const isVisible = entries[0].isIntersecting;
            if (this._paused !== !isVisible) {
                this._paused = !isVisible;
                if (!this._paused) this.startLoop();
            }
        }, { threshold: 0.1 });
        observer.observe(this.canvas);

        document.addEventListener('visibilitychange', () => {
            const isHidden = document.hidden;
            if (this._paused !== isHidden) {
                this._paused = isHidden;
                if (!this._paused) this.startLoop();
            }
        });

        this.startLoop();
    },
    startLoop: function () {
        if (this._animFrameId) cancelAnimationFrame(this._animFrameId);
        this.animate();
    },
    animate: function () {
        if (this._paused) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.angleX += 0.003;
        this.angleY += 0.003;

        const projectedPoints = [];

        this.tags.forEach(tag => {
            const y1 = tag.y * Math.cos(this.angleX) - tag.z * Math.sin(this.angleX);
            const z1 = tag.y * Math.sin(this.angleX) + tag.z * Math.cos(this.angleX);
            const x1 = tag.x * Math.cos(this.angleY) + z1 * Math.sin(this.angleY);
            const z2 = -tag.x * Math.sin(this.angleY) + z1 * Math.cos(this.angleY);

            const scale = 300 / (300 - z2);
            const x2 = x1 * scale + this.canvas.width / 2;
            const y2 = y1 * scale + this.canvas.height / 2;

            if (scale > 0) {
                projectedPoints.push({ x: x2, y: y2 });
                const alpha = (scale - 0.5) / 1.5;
                this.ctx.fillStyle = `rgba(${this._colorRGB}, ${alpha})`;
                this.ctx.font = `${10 * scale}px "JetBrains Mono"`;
                this.ctx.textAlign = "center";
                this.ctx.fillText(tag.text, x2, y2);
            }
        });

        this.ctx.beginPath();
        for (let i = 0; i < projectedPoints.length; i++) {
            for (let j = i + 1; j < projectedPoints.length; j++) {
                const dist = Math.hypot(projectedPoints[i].x - projectedPoints[j].x, projectedPoints[i].y - projectedPoints[j].y);
                if (dist < 60) {
                    this.ctx.moveTo(projectedPoints[i].x, projectedPoints[i].y);
                    this.ctx.lineTo(projectedPoints[j].x, projectedPoints[j].y);
                }
            }
        }
        this.ctx.strokeStyle = `rgba(${this._colorRGB}, 0.15)`;
        this.ctx.lineWidth = 0.5;
        this.ctx.stroke();

        if (!this._paused) {
            this._animFrameId = requestAnimationFrame(() => this.animate());
        }
    }
};

export function replayProject(projectId) {
    const term = document.getElementById('bottomTerminal');
    const output = document.getElementById('bottom-terminal-output');
    if (!term || !output) return;

    term.classList.add('active');
    if (typeof window.switchTerminalTab === 'function') {
        window.switchTerminalTab('terminal');
    }
    output.innerHTML = '';

    const logs = [
        `[REPLAY_INIT]: ${projectId}`,
        `> fetching remote_origin... SUCCESS`,
        `> initializing situational environment...`,
        `> optimizing tactical assets...`,
        `> code_origin v1.0 compiled.`,
        `[MISSION_COMPLETE]: ${projectId} replayed successfully.`
    ];

    logs.forEach((log, i) => {
        setTimeout(() => {
            const line = document.createElement('div');
            line.className = 'terminal-line terminal-response';
            line.textContent = log;
            output.appendChild(line);
            output.scrollTop = output.scrollHeight;
            if (typeof window.AudioEngine !== 'undefined') window.AudioEngine.play('beep');
        }, i * 800);
    });
}
