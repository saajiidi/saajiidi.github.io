/**
 * WIDGETS & HUD ANALYTICS
 * Handles status bars, search, GitHub integration, and data visualization
 * Now exported as ES module.
 */


export function initDigitalClock() {
    const clockContainer = document.getElementById('digitalClock');
    if (!clockContainer) return;

    const hoursMinutesSpan = clockContainer.querySelector('.clock-hours-minutes');
    const secondsSpan = clockContainer.querySelector('.clock-seconds');

    function update() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        if (hoursMinutesSpan) {
            hoursMinutesSpan.textContent = `${hours}:${minutes}`;
        }

        if (secondsSpan) {
            // Apply animation class
            secondsSpan.classList.remove('animate-second'); // Remove to re-trigger animation
            if (secondsSpan instanceof HTMLElement) void secondsSpan.offsetWidth; // Trigger reflow
            secondsSpan.textContent = seconds;
            secondsSpan.classList.add('animate-second');
        }
    }
    setInterval(update, 1000);
    update();
}

export function initScrollProgress() {
    const progressHUD = document.createElement('div');
    progressHUD.className = 'scroll-progress-hud';
    document.body.appendChild(progressHUD);

    let ticking = false;

    function updateScrollProgress() {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPosition = window.pageYOffset;
        const progressPercentage = (scrollPosition / windowHeight) * 100;
        progressHUD.style.width = `${progressPercentage  }%`;

        const navbar = /** @type {HTMLElement | null} */ (document.querySelector('.navbar'));
        if (navbar) {
            if (scrollPosition > 50) {
                const cs = getComputedStyle(document.documentElement);
                const bgCard = cs.getPropertyValue('--bg-card').trim() || 'rgba(12, 20, 10, 0.82)';
                navbar.style.background = bgCard;
                navbar.style.backdropFilter = 'blur(10px)';
            } else {
                navbar.style.background = 'transparent';
                navbar.style.backdropFilter = 'none';
            }
        }
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateScrollProgress);
            ticking = true;
        }
    }, { passive: true });
}

export function initSystemStatus() {
    const widget = document.getElementById('systemStatus');
    if (!widget) return;

    const statuses = [
        { text: 'AVAILABLE FOR OPS', class: 'available' },
        { text: 'OPEN TO WORK', class: 'available' },
        { text: 'ACCEPTING PROJECTS', class: 'available' }
    ];

    widget.addEventListener('click', () => {
        const currentIndex = statuses.findIndex(s => s.text === widget.querySelector('.status-text').textContent);
        const next = statuses[(currentIndex + 1) % statuses.length];

        widget.querySelector('.status-text').textContent = next.text;
        widget.querySelector('.status-indicator').className = `status-indicator ${next.class}`;
    });
}

export function initLiveSearch(tacticalData) {
    const searchContainer = document.getElementById('liveSearch');
    const searchInput = /** @type {HTMLInputElement | null} */ (document.getElementById('globalSearch'));
    const results = document.getElementById('searchResults');
    if (!searchContainer || !searchInput || !results) return;

    const searchIndex = [];
    const { projects = [], experience = [], skills = [] } = tacticalData || {};

    projects.forEach(item => {
        searchIndex.push({
            type: 'Project',
            title: item.title.replace(/\[|\]/g, ''),
            text: item.description,
            section: 'projects'
        });
    });

    experience.forEach(item => {
        searchIndex.push({
            type: 'Experience',
            title: item.company,
            text: `${item.title  } ${  item.description}`,
            section: 'experience'
        });
    });

    skills.forEach(group => {
        group.skills.forEach(skill => {
            searchIndex.push({
                type: 'Skill',
                title: skill.name,
                text: `${group.title  } proficiency: ${  skill.level  }%`,
                section: 'skills'
            });
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === '/' && !e.ctrlKey && !e.altKey && !e.metaKey) {
            if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
                e.preventDefault();
                searchContainer.classList.add('active');
                searchInput.focus();
            }
        }
        if (e.key === 'Escape') {
            searchContainer.classList.remove('active');
            results.innerHTML = '';
        }
    });

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        results.innerHTML = '';

        if (query.length < 2) return;

        const matches = searchIndex.filter(item =>
            item.title.toLowerCase().includes(query) ||
            (item.text && item.text.toLowerCase().includes(query))
        ).slice(0, 8);

        matches.forEach(match => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            const typeEl = document.createElement('div');
            typeEl.className = 'search-result-type';
            typeEl.textContent = match.type;
            const titleEl = document.createElement('div');
            titleEl.className = 'search-result-title';
            titleEl.textContent = match.title;
            resultItem.append(typeEl, titleEl);
            resultItem.addEventListener('click', () => {
                const target = document.getElementById(match.section);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    // Optional: Highlight the item, though we don't have a direct element reference anymore
                }
                searchContainer.classList.remove('active');
                searchInput.value = '';
            });
            results.appendChild(resultItem);
        });
    });
}

export function initPdfFab() {
    const fab = document.getElementById('pdfFab');
    if (!fab) return;

    fab.addEventListener('click', () => {
        const resumeWindow = window.open('resume.html', '_blank');
        if (resumeWindow) {
            resumeWindow.addEventListener('load', () => {
                setTimeout(() => {
                    resumeWindow.print();
                }, 1000);
            });
        }
    });
}

export function initZenMode() {
    const toggle = document.getElementById('zenToggle');
    const body = document.body;
    if (!toggle) return;

    if (localStorage.getItem('zen-mode') === 'true') {
        body.classList.add('zen-mode');
        toggle.classList.add('active');
    }

    toggle.addEventListener('click', () => {
        body.classList.toggle('zen-mode');
        toggle.classList.toggle('active');
        localStorage.setItem('zen-mode', String(body.classList.contains('zen-mode')));
    });
}

export function initDataViz() {
    const canvas = /** @type {HTMLCanvasElement | null} */ (document.getElementById('liveMetricsChart'));
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pageViewsEl = document.getElementById('pageViews');
    const activeTimeEl = document.getElementById('activeTime');

    let pageViews = parseInt(sessionStorage.getItem('pageViews') || '0');
    const startTime = Date.now();
    const dataPoints = Array(20).fill(0);

    pageViews++;
    sessionStorage.setItem('pageViews', String(pageViews));
    if (pageViewsEl) pageViewsEl.textContent = String(pageViews);

    function drawChart() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const cs = getComputedStyle(document.documentElement);
        const chartRGB = cs.getPropertyValue('--primary-color-rgb').trim() || '0, 240, 255';
        const chartColor = cs.getPropertyValue('--primary-color').trim() || '#00f0ff';

        ctx.strokeStyle = `rgba(${chartRGB}, 0.1)`;
        ctx.lineWidth = 1;
        for (let i = 0; i < canvas.width; i += 30) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
        }

        ctx.strokeStyle = chartColor;
        ctx.lineWidth = 2;
        ctx.beginPath();

        dataPoints.forEach((val, i) => {
            const x = (i / (dataPoints.length - 1)) * canvas.width;
            const y = canvas.height - (val / 100) * canvas.height;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });

        ctx.stroke();

        const elapsed = Math.floor((Date.now() - startTime) / 60000);
        if (activeTimeEl) activeTimeEl.textContent = `${elapsed  }m`;
    }

    const chartInterval = setInterval(() => {
        dataPoints.shift();
        dataPoints.push(Math.random() * 80 + 20);
        drawChart();
    }, 2000);

    window.addEventListener('beforeunload', () => {
        clearInterval(chartInterval);
    });

    drawChart();
}

export function initSectionAnalytics() {
    const sections = ['about', 'experience', 'education', 'skills', 'projects', 'awards'];
    const viewCounts = JSON.parse(localStorage.getItem('sectionViews') || '{}');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                viewCounts[id] = (viewCounts[id] || 0) + 1;
                localStorage.setItem('sectionViews', JSON.stringify(viewCounts));
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
    });
}
