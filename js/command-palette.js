/**
 * STRATEGIC COMMAND PALETTE - [v1.0]
 * Global navigation and mission search hub
 */

let paletteActive = false;
let selectedIndex = -1;

function initCommandPalette() {
    const palette = document.getElementById('commandPalette');
    const input = document.getElementById('paletteInput');
    const results = document.getElementById('paletteResults');

    // --- Keyboard Event Matrix ---
    document.addEventListener('keydown', (e) => {
        // Toggle (Ctrl+K or /)
        if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA')) {
            e.preventDefault();
            togglePalette();
        }

        // Close (Esc)
        if (e.key === 'Escape' && paletteActive) {
            togglePalette();
        }

        // Navigation
        if (paletteActive) {
            const items = results.querySelectorAll('.palette-result-item');
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                selectedIndex = (selectedIndex + 1) % items.length;
                updateSelection(items);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                selectedIndex = (selectedIndex - 1 + items.length) % items.length;
                updateSelection(items);
            } else if (e.key === 'Enter' && selectedIndex >= 0) {
                e.preventDefault();
                items[selectedIndex].click();
            }
        }
    });

    // --- Search Stream ---
    input.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        if (!query) {
            results.innerHTML = '<div class="palette-hint p-4 text-center text-secondary small">SEARCH_INDEX_ACTIVE: Type keywords...</div>';
            return;
        }
        performSearch(query);
    });

    // --- Station Clock Sync ---
    setInterval(updateStationClock, 1000);
}

function togglePalette() {
    const palette = document.getElementById('commandPalette');
    const input = document.getElementById('paletteInput');
    paletteActive = !paletteActive;
    
    palette.classList.toggle('active');
    if (paletteActive) {
        input.value = '';
        input.focus();
        selectedIndex = -1;
        document.getElementById('paletteResults').innerHTML = '<div class="palette-hint p-4 text-center text-secondary small">SEARCH_INDEX_ACTIVE: Type keywords...</div>';
    }
    
    if (typeof AudioEngine !== 'undefined') AudioEngine.play('beep');
}

function updateSelection(items) {
    items.forEach((item, idx) => {
        item.classList.toggle('selected', idx === selectedIndex);
        if (idx === selectedIndex) item.scrollIntoView({ block: 'nearest' });
    });
}

function performSearch(query) {
    const resultsDiv = document.getElementById('paletteResults');
    let searchIndex = [];

    // Map Portfolio DATA to search index
    if (window.DATA) {
        window.DATA.projects.forEach(p => searchIndex.push({ type: 'PROJECT', label: p.title, url: p.liveUrl || p.githubUrl, icon: 'project-diagram' }));
        window.DATA.experiences.forEach(e => searchIndex.push({ type: 'EXPERIENCE', label: e.title + ' @ ' + e.company, id: 'experience', icon: 'briefcase' }));
        window.DATA.skillGroups.forEach(sg => sg.skills.forEach(s => searchIndex.push({ type: 'SKILL', label: s.name, id: 'skills', icon: 'microchip' })));
        if (window.DATA.blogPosts) window.DATA.blogPosts.forEach(b => searchIndex.push({ type: 'BLOG', label: b.title, url: b.url, icon: 'file-alt' }));
    }

    // Filter results
    const filtered = searchIndex.filter(item => 
        item.label.toLowerCase().includes(query) || 
        item.type.toLowerCase().includes(query)
    ).slice(0, 8);

    if (filtered.length === 0) {
        resultsDiv.innerHTML = '<div class="p-4 text-center text-danger small">[NO_RESULTS_FOUND]</div>';
        return;
    }

    resultsDiv.innerHTML = filtered.map((item, idx) => `
        <div class="palette-result-item" onclick="executeCommand('${item.url}', '${item.id}')">
            <span><i class="fas fa-${item.icon} me-3 text-primary" style="width:15px"></i> ${item.label.toUpperCase()}</span>
            <span class="text-secondary small tracking-widest">[${item.type}]</span>
        </div>
    `).join('');
    
    selectedIndex = 0;
    updateSelection(resultsDiv.querySelectorAll('.palette-result-item'));
}

function executeCommand(url, id) {
    togglePalette();
    if (url && url !== 'undefined') {
        if (typeof openPortfolioBridge !== 'undefined') {
            openPortfolioBridge(null, url);
        } else {
            window.open(url, '_blank');
        }
    } else if (id) {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
}

function updateStationClock() {
    const node = document.getElementById('stationTime');
    if (!node) return;
    
    // Dhaka is UTC+6
    const now = new Date();
    const dhakaOffset = 6 * 60;
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const dhakaTime = new Date(utc + (dhakaOffset * 60000));
    
    const h = String(dhakaTime.getHours()).padStart(2, '0');
    const m = String(dhakaTime.getMinutes()).padStart(2, '0');
    const s = String(dhakaTime.getSeconds()).padStart(2, '0');
    
    node.textContent = `STATION_TIME: ${h}:${m}:${s}`;
}

document.addEventListener('DOMContentLoaded', initCommandPalette);
