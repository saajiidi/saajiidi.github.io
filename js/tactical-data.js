/**
 * TACTICAL DATA ENGINE - v2.0
 * Restoring original data and fixing filtering bugs.
 */

const SHEET_ID = '1jRHTJ6rC4UMLoBt1o26mfOlOzDTnGJGv'; // Sajid's Portfolio Sheet
const BASE_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=`;

const SHEETS = {
    INFO: 'Info',
    EXPERIENCE: 'Experience',
    EDUCATION: 'Education',
    SKILLS: 'Skills',
    PROJECTS: 'Projects',
    AWARDS: 'Awards'
};

const DEFAULT_INFO = {
    Name: 'Sajid Islam',
    Role: 'Data Scientist & Business Analyst',
    HeroText: 'A Data & Business Analyst specialized in turning complex datasets into strategic growth. Based in Bangladesh, I lead data-ops at DEEN Commerce and previously optimized performance at Daraz (Alibaba Group).'
};

/**
 * Typewriter Effect Class
 */
class Typewriter {
    constructor(el, text, speed = 50) {
        this.el = el;
        this.text = text;
        this.speed = speed;
        this.index = 0;
        this.el.innerHTML = '';
        this.el.classList.add('typewriter-cursor');
        
        const sessionID = Math.random().toString(36).substr(2, 9);
        this.el.setAttribute('data-session', sessionID);
        this.sessionID = sessionID;
    }
    type() {
        if (this.el.getAttribute('data-session') !== this.sessionID) return;

        if (this.index < this.text.length) {
            this.el.innerHTML += this.text.charAt(this.index);
            this.index++;
            setTimeout(() => this.type(), this.speed);
        } else {
            this.el.classList.remove('typewriter-cursor');
        }
    }
}

function runTypewriter(info) {
    const tH1 = document.getElementById('typewriter-h1');
    const tP = document.getElementById('typewriter-p');
    
    if (tH1) {
        tH1.parentElement.style.opacity = '1';
        const h1Text = `Hi, I'm ${info.Name.split(' ')[0]} 👋`;
        new Typewriter(tH1, h1Text, 120).type();
    }
    
    if (tP) {
        const pText = info.HeroText || "Analyzing data for strategic growth.";
        setTimeout(() => {
            tP.parentElement.style.opacity = '1';
            new Typewriter(tP, pText, 60).type();
        }, 2200);
    }
}

async function fetchSheetData(sheetName) {
    try {
        const response = await fetch(`${BASE_URL}${sheetName}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const text = await response.text();
        return parseCSV(text);
    } catch (error) {
        console.warn(`[DATA_FAIL] Using local fallback for ${sheetName}.`);
        return [];
    }
}

function parseCSV(csvText) {
    const lines = csvText.split('\n');
    if (lines.length < 1) return [];
    const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim());
    return lines.slice(1).filter(line => line.trim()).map(line => {
        const values = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
        const obj = {};
        headers.forEach((header, i) => {
            let val = values[i] ? values[i].replace(/^"|"$/g, '').trim() : '';
            val = val.replace(/""/g, '"');
            obj[header] = val;
        });
        return obj;
    });
}

async function initializeTacticalData() {
    console.log('[SYNC] Connecting to Intel Grid...');

    runTypewriter(DEFAULT_INFO);
    
    const [infoData, experience, education, skills, projects, awards] = await Promise.all([
        fetchSheetData(SHEETS.INFO),
        fetchSheetData(SHEETS.EXPERIENCE),
        fetchSheetData(SHEETS.EDUCATION),
        fetchSheetData(SHEETS.SKILLS),
        fetchSheetData(SHEETS.PROJECTS),
        fetchSheetData(SHEETS.AWARDS)
    ]);

    const finalProjects = projects.length > 0 ? projects : (window.DATA ? window.DATA.projects : []);
    const finalExperience = experience.length > 0 ? experience : (window.DATA ? window.DATA.experiences : []);
    const finalSkills = skills.length > 0 ? skills : (window.DATA ? window.DATA.skillGroups : []);

    if (infoData.length > 0) {
        const info = {};
        infoData.forEach(item => { info[item.Key] = item.Value; });
        renderInfo(info);
    }

    if (finalExperience.length > 0) renderExperience(finalExperience);
    if (education.length > 0) renderEducation(education);
    
    if (finalSkills.length > 0) {
        if (window.DATA && window.DATA.skillGroups) renderSkillGroups(window.DATA.skillGroups);
        else renderSkills(finalSkills);
    }

    if (finalProjects.length > 0) {
        renderProjects(finalProjects);
        initializeProjectFilters();
        if (window.DATA && window.DATA.fileTreeData) {
            const projectsFolder = window.DATA.fileTreeData.find(f => f.id === 'portfolio');
            if (projectsFolder) {
                const featuredProjects = finalProjects.filter(p => p.featured).map(p => ({
                    id: `project-${p.id}`,
                    label: p.title.split(' ')[0],
                    href: p.liveUrl || p.githubUrl || `#projects`,
                    icon: 'code',
                    extension: p.technologies.includes('Python') ? 'py' : (p.technologies.includes('React') ? 'tsx' : 'ts')
                }));
                window.DATA.fileTreeData.push({ id: 'featured-ops', label: 'FEATURED_OPS', isOpen: true, items: featuredProjects });
            }
        }
    }
    if (awards.length > 0) renderAwards(awards);

    if (window.DATA) {
        if (window.DATA.blogPosts) renderBlogs(window.DATA.blogPosts);
        if (window.DATA.learningItems) renderLearning(window.DATA.learningItems);
        if (window.DATA.gaming) renderGaming(window.DATA.gaming);
        if (window.DATA.favoriteMedia) renderMedia(window.DATA.favoriteMedia);
        if (window.DATA.fileTreeData) renderFileTree(window.DATA.fileTreeData);
    }
    
    if (window.TACTICAL_INFO && window.TACTICAL_INFO.Github) fetchGithubRepos(window.TACTICAL_INFO.Github.split('/').pop());
    else fetchGithubRepos('saajiidi');

    initAIChat();

    setTimeout(() => {
        document.querySelectorAll('.skeleton').forEach(el => el.classList.add('fade-out'));
    }, 500);
}

function renderInfo(info) {
    if (!info.Name) return;
    runTypewriter(info);
    document.title = `${info.Name} || [TACTICAL_INTEL]`;
    document.querySelectorAll('.data-name').forEach(el => el.innerText = info.Name);
    document.querySelectorAll('.data-role').forEach(el => el.innerText = info.Role);
    window.TACTICAL_INFO = info;
    
    if (info.Github) document.querySelectorAll('[title="GitHub"]').forEach(a => a.href = info.Github);
    if (info.LinkedIn) document.querySelectorAll('[title="LinkedIn"]').forEach(a => a.href = info.LinkedIn);
    if (info.Kaggle) document.querySelectorAll('[title="Kaggle"]').forEach(a => a.href = info.Kaggle);
    
    const waSpan = document.getElementById('contact-details');
    if (waSpan && info.Whatsapp && info.Email) {
        waSpan.innerHTML = `
          <div class="mb-4">
            <label class="section-label small mb-2">ENCRYPTED_EMAIL</label>
            <div class="d-flex align-items-center justify-content-between p-3 bg-dark bg-opacity-50 border border-secondary border-opacity-25">
              <span>${info.Email}</span>
              <button class="btn btn-sm btn-outline-primary" onclick="copyEmail('${info.Email}', event)">COPY</button>
            </div>
          </div>
          <div class="mb-4">
            <label class="section-label small mb-2">DIRECT_SIGNAL</label>
            <div class="d-flex align-items-center justify-content-between p-3 bg-dark bg-opacity-50 border border-secondary border-opacity-25">
              <span>${info.Whatsapp}</span>
              <a href="https://wa.me/${info.Whatsapp.replace(/\D/g, '')}" target="_blank" class="btn btn-sm btn-primary">WHATSAPP</a>
            </div>
          </div>
        `;
    }
}

function renderExperience(data) {
    const container = document.getElementById('experience-list');
    if (!container) return;
    container.innerHTML = '';
    data.forEach(item => {
        const highlights = item.highlights ? item.highlights.map(h => `<li class="mb-2"><i class="fas fa-microchip text-primary me-2"></i> ${h}</li>`).join('') : '';
        container.insertAdjacentHTML('beforeend', `
          <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="resume-item mb-5">
              <div class="resume-content">
                <h3 class="mb-1 text-light">${item.title || item.Role}</h3>
                <div class="subheading mb-3 text-primary">${item.company || item.Company}</div>
                <ul class="list-unstyled text-secondary">${highlights}</ul>
              </div>
              <div class="resume-date"><span>${item.startDate || item.Date}${item.endDate ? ` — ${item.endDate}` : ''}</span></div>
            </div>
          </div>
        `);
    });
}

function renderEducation(data) {
    const container = document.getElementById('education-list');
    if (!container) return;
    container.innerHTML = '';
    data.forEach(item => {
        container.insertAdjacentHTML('beforeend', `
          <div class="timeline-item"><div class="timeline-dot"></div>
            <div class="resume-item mb-4">
              <h3 class="mb-0">${item.Institution}</h3>
              <div class="subheading mb-2 text-primary">${item.Degree}</div>
              <div class="resume-date"><span>${item.Date}</span></div>
            </div>
          </div>
        `);
    });
}

function renderSkillGroups(groups) {
    const chipContainer = document.getElementById('skill-chips');
    const pbContainer = document.getElementById('skill-progress-bars');
    const chartLabels = [];
    const chartValues = [];
    if (chipContainer) {
        chipContainer.innerHTML = '';
        groups.forEach(group => {
            group.skills.forEach(skill => {
                chipContainer.insertAdjacentHTML('beforeend', `<span class="badge border border-primary text-primary py-2 px-3 m-1">${skill.name.toUpperCase()}</span>`);
                if (skill.level && chartLabels.length < 6) { chartLabels.push(skill.name); chartValues.push(skill.level); }
            });
        });
    }
    if (window.skillsRadarChart && chartLabels.length > 0) {
        window.skillsRadarChart.data.labels = chartLabels;
        window.skillsRadarChart.data.datasets[0].data = chartValues;
        window.skillsRadarChart.update();
    }
}

function renderSkills(data) {
    const chipContainer = document.getElementById('skill-chips');
    if (chipContainer) {
        chipContainer.innerHTML = '';
        data.forEach(item => {
            if (item.Skill) chipContainer.insertAdjacentHTML('beforeend', `<span class="badge border border-primary text-primary m-1">${item.Skill.toUpperCase()}</span>`);
        });
    }
}

function renderProjects(data) {
    const container = document.getElementById('project-list');
    if (!container) return;
    container.innerHTML = '';
    data.forEach(item => {
        const caseStudyHtml = item.caseStudy ? `
            <div class="case-study-details mt-3 pt-3 border-top border-secondary border-opacity-25" style="display: none;" id="case-${item.id}">
                <div class="mb-2"><span class="case-label">Problem:</span> <span class="case-text">${item.caseStudy.problem}</span></div>
                <div class="mb-2"><span class="case-label">Solution:</span> <span class="case-text">${item.caseStudy.solution}</span></div>
            </div>` : '';

        container.insertAdjacentHTML('beforeend', `
          <div class="col-lg-6 project-item" data-category="${item.category || 'all'}">
            <div class="card-glass h-100 project-dossier" id="dossier-${item.id}">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <span class="font-mono small text-primary opacity-50">[DOSSIER_ID: ${item.id || 'PRJ_01'}]</span>
                    ${item.featured ? '<span class="badge badge-featured">FEATURED_OP</span>' : ''}
                </div>
                <h5 class="card-title text-light mb-3 text-uppercase tracking-widest">${item.title}</h5>
                <div class="redaction-container mb-3" onclick="decryptDossier('${item.id}', this)">
                    <p class="card-text redacted-text" id="desc-${item.id}">${item.description.split(' ').map(w => '█'.repeat(w.length)).join(' ')}</p>
                    <div class="redaction-overlay"><span class="decrypt-prompt">DECRYPT_INTEL</span></div>
                </div>
                <div class="d-flex flex-wrap gap-2 mb-4">
                    ${item.technologies ? item.technologies.slice(0, 4).map(t => `<span class="tag-tactical">#${t.toUpperCase()}</span>`).join('') : ''}
                </div>
                ${caseStudyHtml}
                <div class="d-flex gap-2 mt-auto">
                    <a href="${item.liveUrl || '#'}" onclick="openPortfolioBridge(event, '${item.liveUrl}')" class="btn btn-sm btn-primary">UPLINK</a>
                    <button class="btn btn-sm btn-outline-primary ms-auto" onclick="decryptDossier('${item.id}', this, true)"><i class="fas fa-sync-alt"></i></button>
                </div>
              </div>
            </div>
          </div>
        `);
    });
}

window.decryptDossier = (id, el, force = false) => {
    const descEl = document.getElementById(`desc-${id}`);
    const dossier = document.getElementById(`dossier-${id}`);
    if (!descEl || (!force && descEl.classList.contains('decrypted'))) return;
    const project = (window.DATA && window.DATA.projects) ? window.DATA.projects.find(p => p.id == id) : null;
    const actualText = project ? project.description : "DATA_RECOVERY_FAILED.";
    if (typeof AudioEngine !== 'undefined') AudioEngine.play('type');
    descEl.classList.add('decrypting');
    dossier.classList.add('scanning');
    let i = 0;
    const interval = setInterval(() => {
        if (i < actualText.length) { descEl.textContent = actualText.substring(0, i) + '█'; i++; }
        else { descEl.textContent = actualText; descEl.classList.remove('decrypting'); descEl.classList.add('decrypted'); dossier.classList.remove('scanning'); clearInterval(interval); if (typeof AudioEngine !== 'undefined') AudioEngine.play('beep'); }
    }, 20);
};

function toggleCaseStudy(id, btn) {
    const el = document.getElementById(`case-${id}`);
    if (el) { el.style.display = el.style.display === 'none' ? 'block' : 'none'; }
}

function renderAwards(data) {
    const container = document.getElementById('awards-list');
    if (!container) return;
    container.innerHTML = data.map(item => `
          <div class="timeline-item"><div class="timeline-dot"></div>
            <div class="resume-item mb-4">
              <h3 class="mb-0">${item.Title}</h3>
              <div class="subheading mb-3 text-primary">${item.Subheading}</div>
            </div>
          </div>`).join('');
}

function initializeProjectFilters() {
    const filters = document.querySelectorAll('.filter-btn');
    filters.forEach(btn => {
        btn.onclick = () => {
            const f = btn.getAttribute('data-filter');
            filters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.querySelectorAll('.project-item').forEach(item => {
                const cat = item.getAttribute('data-category');
                item.style.display = (f === 'all' || cat === f) ? 'block' : 'none';
            });
        };
    });
}

function renderBlogs(data) {
    const container = document.getElementById('blog-list');
    if (container) container.innerHTML = data.map(p => `<div class="col-md-4 card-glass p-3 m-2"><h6 class="text-primary">${p.title}</h6><p class="small text-secondary">${p.excerpt}</p></div>`).join('');
}

function renderLearning(data) {
    const container = document.getElementById('learning-list');
    if (container) container.innerHTML = data.map(l => `<div class="col-md-6 mb-2"><span>${l.name}</span><div class="progress" style="height:4px"><div class="progress-bar bg-success" style="width:${l.progress}%"></div></div></div>`).join('');
}

function renderGaming(data) {
    const container = document.getElementById('gaming-stats');
    if (container) container.innerHTML = data.stats.map(s => `<span>${s.label}: ${s.value}</span>`).join(' | ');
}

function renderMedia(data) { }

function renderFileTree(data) {
    const container = document.querySelector('.file-tree-container');
    if (!container) return;
    container.innerHTML = data.map(section => `
        <div class="file-tree-section" id="tree-sec-${section.id}">
            <div class="file-tree-header" onclick="toggleTreeSection('${section.id}')"><span>${section.label}</span></div>
            <div class="file-tree-items" style="display: ${section.isOpen ? 'block' : 'none'}">
                ${section.items.map(item => `<a href="${item.href}" class="file-tree-item" onclick="handleTreeClick(event, '${item.id}')"><span>${item.label}</span></a>`).join('')}
            </div>
        </div>`).join('');
}

async function fetchGithubRepos(username) {
    const container = document.getElementById('githubActivity');
    if (!container) return;
    try {
        const r = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=5`);
        const repos = await r.json();
        container.innerHTML = repos.map(repo => `<div class="p-2 border-bottom border-secondary border-opacity-10"><a href="${repo.html_url}" target="_blank" class="small text-primary">${repo.name.toUpperCase()}</a></div>`).join('');
    } catch (e) { container.innerHTML = 'OFFLINE'; }
}

function initAIChat() {
    if (!document.getElementById('aiChatContainer')) {
        document.body.insertAdjacentHTML('beforeend', `<div class="ai-chat-container card-glass" id="aiChatContainer"><div class="ai-chat-header" onclick="toggleAIChat()">AI_COMMS_V4</div><div class="ai-chat-body" id="aiChatBody"></div><input type="text" id="aiChatInput" onkeypress="if(event.key==='Enter')sendAIMessage()"></div>`);
    }
}

function toggleAIChat() { document.getElementById('aiChatContainer').classList.toggle('active'); }

async function sendAIMessage() {
    const input = document.getElementById('aiChatInput');
    const msg = input.value.trim();
    if (!msg) return;
    const body = document.getElementById('aiChatBody');
    body.insertAdjacentHTML('beforeend', `<div class="ai-message user">${msg}</div>`);
    input.value = '';
    
    // AI Navigation Command Logic
    if (msg.toLowerCase().includes('projects')) {
        document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
        body.insertAdjacentHTML('beforeend', `<div class="ai-message bot">Navigation complete. Project blueprints loaded.</div>`);
    } else if (msg.toLowerCase().includes('skills')) {
        document.getElementById('skills').scrollIntoView({ behavior: 'smooth' });
        body.insertAdjacentHTML('beforeend', `<div class="ai-message bot">Grid initialized. Skill nodes active.</div>`);
    } else {
        body.insertAdjacentHTML('beforeend', `<div class="ai-message bot">Acknowledged. Tactical link established.</div>`);
    }
    body.scrollTop = body.scrollHeight;
}

function toggleTreeSection(id) { 
    const el = document.querySelector(`#tree-sec-${id} .file-tree-items`);
    if(el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

function toggleMobileSidebar() { document.getElementById('fileTreeSidebar').classList.toggle('open'); }

function handleTreeClick(e, id) {
    const href = e.currentTarget.getAttribute('href');
    if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.getElementById(href.substring(1));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    }
}

document.addEventListener('DOMContentLoaded', initializeTacticalData);
