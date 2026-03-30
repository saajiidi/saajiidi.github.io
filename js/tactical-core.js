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

function copyEmail(email, event) {
    navigator.clipboard.writeText(email);
    const btn = event.target;
    const originalText = btn.innerText;
    btn.innerText = 'COPIED';
    setTimeout(() => { btn.innerText = originalText; }, 2000);
}

// Initializer
window.addEventListener('DOMContentLoaded', () => {
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
