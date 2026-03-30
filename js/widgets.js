/**
 * WIDGETS & HUD ANALYTICS
 * Handles status bars, search, GitHub integration, and data visualization
 */

// Global Initialization
window.addEventListener('DOMContentLoaded', () => {
    initSystemStatus();
    initDigitalClock();
    initLiveSearch();
    fetchGitHubActivity();
    initPdfFab();
    initZenMode();
    initDataViz();
    initSectionAnalytics();
    initHudResizer();
    initProjectFilters();
});

// ===== PROJECT FILTERS =====
function initProjectFilters() {
    const filters = document.querySelectorAll('#projectFilters .filter-btn');
    if (!filters.length) return;

    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterValue = btn.getAttribute('data-filter');
            
            filters.forEach(f => f.classList.remove('active'));
            btn.classList.add('active');

            const items = document.querySelectorAll('#project-list > div');
            items.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });

            if (typeof AudioEngine !== 'undefined') AudioEngine.play('click');
        });
    });
}

// ===== HUD RESIZER ENGINE =====
function initHudResizer() {
    const widgets = document.querySelectorAll('.card-glass');
    widgets.forEach(widget => {
        const handle = document.createElement('div');
        handle.className = 'hud-resize-handle';
        widget.appendChild(handle);

        handle.addEventListener('mousedown', initResize, false);

        function initResize(e) {
            e.preventDefault();
            window.addEventListener('mousemove', Resize, false);
            window.addEventListener('mouseup', stopResize, false);
        }

        function Resize(e) {
            widget.style.width = (e.clientX - widget.offsetLeft) + 'px';
            widget.style.height = (e.clientY - widget.offsetTop) + 'px';
        }

        function stopResize() {
            window.removeEventListener('mousemove', Resize, false);
            window.removeEventListener('mouseup', stopResize, false);
            if (typeof AudioEngine !== 'undefined') AudioEngine.play('click');
        }
    });
}

// ===== DIGITAL CLOCK HUD =====
function initDigitalClock() {
    const clock = document.getElementById('digitalClock');
    if (!clock) return;

    function update() {
        const now = new Date();
        clock.textContent = now.toTimeString().split(' ')[0];
    }
    setInterval(update, 1000);
    update();
}

// ===== SCROLL PROGRESS HUD =====
function initScrollProgress() {
    const progressHUD = document.createElement('div');
    progressHUD.className = 'scroll-progress-hud';
    document.body.appendChild(progressHUD);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPosition = window.pageYOffset;
        const progressPercentage = (scrollPosition / windowHeight) * 100;
        progressHUD.style.width = progressPercentage + '%';

        // Dynamic fade on navbar if needed
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (scrollPosition > 50) {
                navbar.style.background = 'rgba(5, 20, 16, 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
            } else {
                navbar.style.background = 'transparent';
                navbar.style.backdropFilter = 'none';
            }
        }
    });
}

// ===== SYSTEM STATUS WIDGET =====
function initSystemStatus() {
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

// ===== LIVE SEARCH =====
function initLiveSearch() {
    const searchContainer = document.getElementById('liveSearch');
    const searchInput = document.getElementById('globalSearch');
    const results = document.getElementById('searchResults');
    if (!searchContainer || !searchInput || !results) return;

    // Build search index
    const searchIndex = [];

    // Add projects
    document.querySelectorAll('.project-item').forEach(item => {
        const title = item.querySelector('.card-title')?.textContent || '';
        const text = item.querySelector('.card-text')?.textContent || '';
        searchIndex.push({
            type: 'Project',
            title: title.replace(/\[|\]/g, ''),
            text: text,
            element: item,
            section: 'projects'
        });
    });

    // Add experience
    document.querySelectorAll('.timeline-item').forEach(item => {
        const title = item.querySelector('h3')?.textContent || '';
        const company = item.querySelector('.subheading')?.textContent || '';
        searchIndex.push({
            type: 'Experience',
            title: title,
            text: company,
            element: item,
            section: 'experience'
        });
    });

    // Add skills
    document.querySelectorAll('#skill-chips .badge').forEach(item => {
        searchIndex.push({
            type: 'Skill',
            title: item.textContent,
            text: '',
            element: item,
            section: 'skills'
        });
    });

    // Keyboard shortcut (/)
    document.addEventListener('keydown', (e) => {
        if (e.key === '/' && !e.ctrlKey && !e.altKey && !e.metaKey) {
            if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
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

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        results.innerHTML = '';

        if (query.length < 2) return;

        const matches = searchIndex.filter(item =>
            item.title.toLowerCase().includes(query) ||
            item.text.toLowerCase().includes(query)
        ).slice(0, 8);

        matches.forEach(match => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.innerHTML = `
            <div class="search-result-type">${match.type}</div>
            <div class="search-result-title">${match.title}</div>
          `;
            resultItem.addEventListener('click', () => {
                const target = document.getElementById(match.section);
                if (target) target.scrollIntoView({ behavior: 'smooth' });
                searchContainer.classList.remove('active');
                searchInput.value = '';
            });
            results.appendChild(resultItem);
        });
    });
}

// ===== GITHUB ACTIVITY WIDGET =====
// Handled by js/github-feed.js (GitHub-style commit/push feed)
async function fetchGitHubActivity() { /* no-op — see github-feed.js */ }

// ===== PDF DOWNLOAD FAB =====
function initPdfFab() {
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

// ===== ZEN MODE =====
function initZenMode() {
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
        localStorage.setItem('zen-mode', body.classList.contains('zen-mode'));
    });
}

// ===== LIVE DATA VISUALIZATION =====
function initDataViz() {
    const canvas = document.getElementById('liveMetricsChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const pageViewsEl = document.getElementById('pageViews');
    const activeTimeEl = document.getElementById('activeTime');

    let pageViews = parseInt(sessionStorage.getItem('pageViews') || '0');
    let startTime = Date.now();
    let dataPoints = Array(20).fill(0);

    pageViews++;
    sessionStorage.setItem('pageViews', pageViews);
    if (pageViewsEl) pageViewsEl.textContent = pageViews;

    function drawChart() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = 'rgba(163, 230, 53, 0.1)';
        ctx.lineWidth = 1;
        for (let i = 0; i < canvas.width; i += 30) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, canvas.height);
            ctx.stroke();
        }

        ctx.strokeStyle = '#a3e635';
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
        if (activeTimeEl) activeTimeEl.textContent = elapsed + 'm';
    }

    const chartInterval = setInterval(() => {
        dataPoints.shift();
        dataPoints.push(Math.random() * 80 + 20);
        drawChart();
    }, 2000);

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        clearInterval(chartInterval);
    });

    drawChart();
}

// ===== SECTION ANALYTICS =====
function initSectionAnalytics() {
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
