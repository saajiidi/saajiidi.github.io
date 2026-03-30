/**
 * TACTICAL CORE
 * Core UI interactions, theme management, and base effects
 */

const GLITCH_CHARS = 'ABCDEFGHIKLMNOPQRSTUVWXYZ0123456789§$#@*&';

function glitchEffect(el) {
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

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    const themeIcon = themeToggle.querySelector('i');
    if (themeIcon) {
        themeIcon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

/**
 * MISSION_CRITICAL CORE v6.0
 * Hardware Diagnostics, Neural Voice, and Ambient Situational Audio
 */

const AudioEngine = {
    beep: () => { /* existing beep */ },
    play: (id) => { /* existing logic */ },
    
    // MISSION_AUDIO: Dark-Ambient Synthwave
    track: new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'),
    isPlaying: false,
    toggleMusic: function() {
        const btn = document.getElementById('musicToggle');
        const label = document.getElementById('trackName');
        if (this.isPlaying) {
            this.track.pause();
            this.isPlaying = false;
            btn.innerHTML = '<i class="fas fa-play"></i>';
            label.textContent = '[MISSION_AUDIO: OFFLINE]';
        } else {
            this.track.play();
            this.track.loop = true;
            this.track.volume = 0.3;
            this.isPlaying = true;
            btn.innerHTML = '<i class="fas fa-pause"></i>';
            label.textContent = '[MISSION_AUDIO: PLAYING_SYNTH_01]';
        }
    },

    // NEURAL_VOICE: AI Oracle TTS
    speak: function(text) {
        if (!window.speechSynthesis) return;
        const msg = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        // Try to find a robotic sounding voice
        msg.voice = voices.find(v => v.name.includes('Google UK English Male')) || voices[0];
        msg.pitch = 0.8;
        msg.rate = 1.1;
        window.speechSynthesis.speak(msg);
    }
};

function updateSystemHealth() {
    const batteryNode = document.getElementById('batteryNode');
    const memoryNode = document.getElementById('memoryNode');
    const osNode = document.getElementById('osNode');

    if (navigator.getBattery) {
        navigator.getBattery().then(bat => {
            const updateBat = () => { batteryNode.textContent = `${Math.round(bat.level * 100)}%`; };
            updateBat();
            bat.onlevelchange = updateBat;
        });
    }

    if (navigator.deviceMemory) {
        memoryNode.textContent = `${navigator.deviceMemory}GB_RAM`;
    } else {
        memoryNode.textContent = "DETECT_FAILED";
    }

    const platform = navigator.userAgentData ? navigator.userAgentData.platform : "LEGACY_OS";
    osNode.textContent = platform.toUpperCase();
}

// SECRET_DOSSIERS
window.MISSION_SECRETS = {
    "secrets.txt": "TOP_SECRET: Project Antigravity is a success. Codename: Sajid_Islam. Origin: Dhaka_Grid_02.",
    "access_codes.md": "ACCESS_GRANTED: Use 'sudo clearance' to elevate your situational awareness."
};

function copyEmail(email, event) {
    navigator.clipboard.writeText(email);
    const btn = event.target;
    const originalText = btn.innerText;
    btn.innerText = 'COPIED';
    setTimeout(() => { btn.innerText = originalText; }, 2000);
}

// Initializer
// 3D_SKILL_GLOBE_CORE
const SkillsGlobe = {
    canvas: null, ctx: null, tags: [],
    radius: 140, angleX: 0, angleY: 0,
    init: function() {
        this.canvas = document.getElementById('skillCanvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        const skillList = ["PYTHON", "SQL", "POWER_BI", "TABLEAU", "MACHINE_LEARNING", "NLP", "DEEP_LEARNING", "BUSINESS_OPS", "CHURN_ANALYSIS", "STREAMLIT", "EXCEL", "PANDAS", "DASHBOARDING", "DATA_OPS", "SCRUTINY", "VIZ"];
        
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
        this.canvas.width = parent.offsetWidth;
        this.canvas.height = parent.offsetHeight;

        window.addEventListener('resize', () => {
            this.canvas.width = parent.offsetWidth;
            this.canvas.height = parent.offsetHeight;
        });

        this.animate();
    },
    animate: function() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.angleX += 0.003;
        this.angleY += 0.003;

        this.tags.forEach(tag => {
            // Rotate around X
            let y1 = tag.y * Math.cos(this.angleX) - tag.z * Math.sin(this.angleX);
            let z1 = tag.y * Math.sin(this.angleX) + tag.z * Math.cos(this.angleX);
            // Rotate around Y
            let x1 = tag.x * Math.cos(this.angleY) + z1 * Math.sin(this.angleY);
            let z2 = -tag.x * Math.sin(this.angleY) + z1 * Math.cos(this.angleY);

            const scale = 300 / (300 - z2);
            const x2 = x1 * scale + this.canvas.width / 2;
            const y2 = y1 * scale + this.canvas.height / 2;

            if (scale > 0) {
                const alpha = (scale - 0.5) / 1.5;
                this.ctx.fillStyle = `rgba(34, 197, 94, ${alpha})`;
                this.ctx.font = `${10 * scale}px "JetBrains Mono"`;
                this.ctx.textAlign = "center";
                this.ctx.fillText(tag.text, x2, y2);
            }
        });
        requestAnimationFrame(() => this.animate());
    }
};

window.replayProject = (projectId) => {
    const term = document.getElementById('bottomTerminal');
    const output = document.getElementById('bottom-terminal-output');
    if (!term || !output) return;
    
    term.classList.add('active');
    switchTerminalTab('terminal');
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
            if (typeof AudioEngine !== 'undefined') AudioEngine.play('beep');
        }, i * 800);
    });
};

window.addEventListener('DOMContentLoaded', () => {
    updateSystemHealth();
    SkillsGlobe.init();
    
    const musicBtn = document.getElementById('musicToggle');
    if (musicBtn) musicBtn.addEventListener('click', () => AudioEngine.toggleMusic());

    window.speechSynthesis.getVoices();

    // --- Theme Switching Ops ---
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    const savedTheme = localStorage.getItem('tactical-theme') || 'dark';
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('tactical-theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    // --- Glitch Effect Initializer ---
    document.querySelectorAll('.section-label, h2:not(.display-2)').forEach(el => {
        el.addEventListener('mouseenter', () => glitchEffect(el));
        setTimeout(() => glitchEffect(el), 500); 
    });

    // --- Initial Sync ---
    if (typeof initializeProjectFilters !== 'undefined') {
        initializeProjectFilters();
    }

    // --- Skills Radar Chart ---
    const canvas = document.getElementById('skillsChart');
    const skillMap = { 'PYTHON': 0, 'SQL': 1, 'POWER_BI': 2, 'ML': 3, 'WEB_DEV': 4, 'TABLEAU': 2 }; // Map badges to indices
    const baseData = [90, 85, 95, 70, 75, 80];

    if (canvas && typeof Chart !== 'undefined') {
        const ctx = canvas.getContext('2d');
        window.skillsRadarChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Python', 'SQL', 'BI Tools', 'ML', 'Web Dev', 'Marketing'],
                datasets: [{
                    label: '[SKILL_POWER_LEVEL]',
                    data: [...baseData],
                    backgroundColor: 'rgba(163, 230, 53, 0.2)',
                    borderColor: '#a3e635',
                    borderWidth: 1,
                    pointBackgroundColor: '#a3e635'
                }]
            },
            options: {
                animation: { duration: 400 },
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        pointLabels: { color: '#94a3b8', font: { family: 'JetBrains Mono' } },
                        ticks: { display: false },
                        suggestedMin: 0,
                        suggestedMax: 100
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });

        // Gamify connections
        document.querySelectorAll('#skill-chips .badge').forEach(badge => {
            badge.style.cursor = 'pointer';
            badge.addEventListener('mouseenter', () => {
                const skill = badge.textContent.trim().toUpperCase();
                const index = skillMap[skill];
                if (index !== undefined) {
                    const newData = baseData.map((v, i) => i === index ? 100 : v * 0.4); // Highlight effect
                    window.skillsRadarChart.data.datasets[0].data = newData;
                    window.skillsRadarChart.update('none');
                    badge.classList.add('pulse');
                }
            });
            badge.addEventListener('mouseleave', () => {
                window.skillsRadarChart.data.datasets[0].data = [...baseData];
                window.skillsRadarChart.update();
                badge.classList.remove('pulse');
            });
        });
    }
});
