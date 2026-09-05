/**
 * TACTICAL DATA ENGINE - v2.0
 * Data rendering and initialization
 * Now exported as ES module.
 */

import { PROFILE_INFO, PortfolioData } from './data/index.js';

/** Escape untrusted strings before innerHTML interpolation. */
function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
}

const DEFAULT_INFO = PROFILE_INFO;

export class Typewriter {
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

export function runTypewriter(info) {
    const tH1 = document.getElementById('typewriter-h1');
    const tP = document.getElementById('typewriter-p');

    const name = info.Name || info.name || '';
    const heroText = info.HeroText || info.heroText || "Analyzing data for strategic growth.";

    if (tH1 && name) {
        tH1.parentElement.style.opacity = '1';
        const h1Text = `Hi, I'm ${name.split(' ')[0]} 👋`;
        new Typewriter(tH1, h1Text, 120).type();
    }

    if (tP) {
        setTimeout(() => {
            tP.parentElement.style.opacity = '1';
            new Typewriter(tP, heroText, 60).type();
        }, 2200);
    }
}

export async function initializeTacticalData() {
    runTypewriter(DEFAULT_INFO);

    await PortfolioData.load();
    
    const info = PortfolioData.getInfo();
    const finalExperience = PortfolioData.getExperiences();
    const finalEducation = PortfolioData.getEducation();
    const finalSkillGroups = PortfolioData.getSkills();
    const finalProjects = PortfolioData.getProjects();
    const fileTree = PortfolioData.getFileTree();
    const blogs = PortfolioData.getBlogPosts();
    const learning = PortfolioData.getLearning();
    const gaming = PortfolioData.getGaming();

    window.projectsList = finalProjects;

    renderInfo({
      Name: info.name,
      Role: info.role,
      HeroText: info.heroText,
      Github: info.github,
      Linkedin: info.linkedin,
      Kaggle: info.kaggle,
      Whatsapp: info.whatsapp,
      Email: info.email
    });

    if (finalExperience.length > 0) renderExperience(finalExperience);
    if (finalEducation.length > 0) renderEducation(finalEducation);
    
    if (finalSkillGroups.length > 0) {
        renderSkillGroups(finalSkillGroups);
    }

    if (finalProjects.length > 0) {
        renderProjects(finalProjects);
        initializeProjectFilters();
        
        if (fileTree) {
            const projectsFolder = fileTree.find(f => f.id === 'portfolio');
            if (projectsFolder && !fileTree.some(f => f.id === 'featured-ops')) {
                const featuredProjects = finalProjects.filter(p => p.featured).map(p => ({
                    id: `project-${p.id}`,
                    label: p.title.split(' ')[0],
                    href: p.liveUrl || p.githubUrl || `#projects`,
                    icon: 'code',
                    extension: p.technologies.includes('Python') ? 'py' : (p.technologies.includes('React') ? 'tsx' : 'ts')
                }));
                fileTree.push({ id: 'featured-ops', label: 'FEATURED_OPS', isOpen: true, items: featuredProjects });
            }
        }
    }

    if (blogs) renderBlogs(blogs);
    if (learning) renderLearning(learning);
    if (gaming) renderGaming(gaming);
    if (gaming && gaming.favorites) renderMedia(gaming.favorites);
    if (fileTree) renderFileTree(fileTree);

    const githubUser = info.github ? info.github.split('/').pop() : 'Sajid-ul-Islam';
    fetchGithubRepos(githubUser);

    setTimeout(() => {
        document.querySelectorAll('.skeleton').forEach(el => el.classList.add('fade-out'));
    }, 500);

    return {
        projects: finalProjects,
        experience: finalExperience,
        skills: finalSkillGroups
    };
}

export function renderInfo(info) {
    if (!info) return;
    const name = info.Name || info.name;
    if (!name) return;
    runTypewriter(info);
    document.title = `${name} || [TACTICAL_INTEL]`;
    document.querySelectorAll('.data-name').forEach(el => { if (el instanceof HTMLElement) el.innerText = name; });
    const role = info.Role || info.role;
    if (role) document.querySelectorAll('.data-role').forEach(el => { if (el instanceof HTMLElement) el.innerText = role; });
    window.TACTICAL_INFO = info;

    const github = info.Github || info.github;
    const linkedin = info.LinkedIn || info.Linkedin || info.linkedin;
    const kaggle = info.Kaggle || info.kaggle;
    const huggingface = info.HuggingFace || info.huggingface || PROFILE_INFO.huggingface;

    if (github) document.querySelectorAll('[title="GitHub"]').forEach(a => { if (a instanceof HTMLAnchorElement) a.href = github; });
    if (linkedin) document.querySelectorAll('[title="LinkedIn"]').forEach(a => { if (a instanceof HTMLAnchorElement) a.href = linkedin; });
    if (kaggle) document.querySelectorAll('[title="Kaggle"]').forEach(a => { if (a instanceof HTMLAnchorElement) a.href = kaggle; });
    if (huggingface) document.querySelectorAll('[title="Hugging Face"]').forEach(a => { if (a instanceof HTMLAnchorElement) a.href = huggingface; });

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

export function renderExperience(data) {
    const container = document.getElementById('experience-list');
    if (!container) return;
    if (!Array.isArray(data)) {
        container.innerHTML = '<div class="text-danger p-3">[ERROR] Invalid experience data format</div>';
        return;
    }
    container.innerHTML = '';
    try {
        data.forEach(item => {
            const highlights = item.highlights ? item.highlights.map(h => `<li class="mb-2"><i class="fas fa-microchip text-primary me-2"></i> ${esc(h)}</li>`).join('') : '';
            container.insertAdjacentHTML('beforeend', `
              <div class="timeline-item">
                <div class="timeline-dot"></div>
                <div class="resume-item mb-5">
                  <div class="resume-content">
                    <h3 class="mb-1 text-light">${esc(item.title || item.Role)}</h3>
                    <div class="subheading mb-3 text-primary">${esc(item.company || item.Company)}</div>
                    <ul class="list-unstyled text-secondary">${highlights}</ul>
                  </div>
                  <div class="resume-date"><span>${esc(item.startDate || item.Date)}${item.endDate ? ` — ${esc(item.endDate)}` : ''}</span></div>
                </div>
              </div>
            `);
        });
    } catch {
        container.innerHTML = '<div class="text-danger p-3">[ERROR] Failed to render experience</div>';
    }
}

export function renderEducation(data) {
    const container = document.getElementById('education-list');
    if (!container) return;
    if (!Array.isArray(data)) {
        container.innerHTML = '<div class="text-danger p-3">[ERROR] Invalid education data format</div>';
        return;
    }
    container.innerHTML = '';
    try {
        data.forEach(item => {
            container.insertAdjacentHTML('beforeend', `
              <div class="timeline-item"><div class="timeline-dot"></div>
                <div class="resume-item mb-4">
                  <h3 class="mb-0">${esc(item.Institution || item.institution || '')}</h3>
                  <div class="subheading mb-2 text-primary">${esc(item.Degree || item.degree || '')}</div>
                  <div class="resume-date"><span>${esc(item.Date || item.date || '')}</span></div>
                </div>
              </div>
            `);
        });
    } catch {
        container.innerHTML = '<div class="text-danger p-3">[ERROR] Failed to render education</div>';
    }
}

export function renderSkillGroups(groups) {
    const chartLabels = [];
    const chartValues = [];

    const iconMap = {
        'PYTHON': 'fab fa-python', 'SQL': 'fas fa-database', 'POWER BI': 'fas fa-chart-bar',
        'TABLEAU': 'fas fa-chart-pie', 'REACT': 'fab fa-react', 'JAVASCRIPT': 'fab fa-js',
        'ML': 'fas fa-brain', 'EXCEL': 'fas fa-file-excel', 'WEB DEV': 'fas fa-code'
    };

    groups.forEach((group, index) => {
        const groupContainer = document.querySelector(`#skill-group-${index} .skill-chips-container`);
        if (groupContainer) {
            groupContainer.innerHTML = group.skills.map(skill => {
                const icon = iconMap[skill.name.toUpperCase()] || 'fas fa-microchip';
                if (skill.level && chartLabels.length < 6) {
                    chartLabels.push(skill.name);
                    chartValues.push(skill.level);
                }
                return `
                    <div class="skill-pill-tactical">
                        <i class="${icon} text-primary"></i>
                        <span class="font-mono small">${esc(String(skill.name || '').toUpperCase())}</span>
                    </div>`;
            }).join('');
        }
    });

    if (window.skillsRadarChart && chartLabels.length > 0) {
        window.skillsRadarChart.data.labels = chartLabels;
        window.skillsRadarChart.data.datasets[0].data = chartValues;
        window.chartBaseData = [...chartValues];
        window.skillsRadarChart.update();
    }
}

export function renderProjects(data) {
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
                <h5 class="card-title text-light mb-3 text-uppercase tracking-widest">${esc(item.title)}</h5>
                <div class="redaction-container mb-3" onclick="decryptDossier('${item.id}', this)">
                    <p class="card-text redacted-text" id="desc-${item.id}">${String(item.description || '').split(' ').map(w => '█'.repeat(w.length)).join(' ')}</p>
                    <div class="redaction-overlay"><span class="decrypt-prompt">DECRYPT_INTEL</span></div>
                </div>
                <div class="d-flex flex-wrap gap-2 mb-4">
                    ${item.technologies ? item.technologies.slice(0, 4).map(t => `<span class="tag-tactical">#${esc(String(t)).toUpperCase()}</span>`).join('') : ''}
                </div>
                ${caseStudyHtml}
                <div class="d-flex gap-2 mt-auto">
                    <a href="${item.liveUrl || '#'}" onclick="openCaseStudy(event, '${item.id}')" class="btn btn-sm btn-primary">UPLINK</a>
                    <button class="btn btn-sm btn-outline-primary ms-auto" onclick="decryptDossier('${item.id}', this, true)"><i class="fas fa-sync-alt"></i></button>
                </div>
              </div>
            </div>
          </div>
        `);
    });
}

export function decryptDossier(id, el, force = false) {
    const descEl = document.getElementById(`desc-${id}`);
    const dossier = document.getElementById(`dossier-${id}`);
    if (!descEl || (!force && descEl.classList.contains('decrypted'))) return;
    const project = window.projectsList ? window.projectsList.find(p => p.id === id) : ((window.DATA && window.DATA.projects) ? window.DATA.projects.find(p => p.id === id) : null);
    const actualText = project ? project.description : "DATA_RECOVERY_FAILED.";
    if (typeof window.AudioEngine !== 'undefined') window.AudioEngine.play('type');
    descEl.classList.add('decrypting');
    dossier.classList.add('scanning');
    let i = 0;
    const interval = setInterval(() => {
        if (i < actualText.length) { descEl.textContent = `${actualText.substring(0, i)  }█`; i++; }
        else { descEl.textContent = actualText; descEl.classList.remove('decrypting'); descEl.classList.add('decrypted'); dossier.classList.remove('scanning'); clearInterval(interval); if (typeof window.AudioEngine !== 'undefined') window.AudioEngine.play('beep'); }
    }, 20);
};

export function toggleCaseStudy(id, _btn) {
    const el = document.getElementById(`case-${id}`);
    if (el) { el.style.display = el.style.display === 'none' ? 'block' : 'none'; }
}

export function toggleDecryptAll() {
    const list = window.projectsList || (window.DATA && window.DATA.projects) || [];
    const btn = document.getElementById('decryptAllBtn');
    const isDecryptingAll = btn ? btn.getAttribute('data-state') !== 'decrypted' : true;

    list.forEach((project, idx) => {
        const descEl = document.getElementById(`desc-${project.id}`);
        const dossier = document.getElementById(`dossier-${project.id}`);
        if (!descEl || !dossier) return;

        if (isDecryptingAll) {
            setTimeout(() => {
                decryptDossier(project.id, descEl, true);
            }, idx * 50);
        } else {
            descEl.textContent = String(project.description || '').split(' ').map(w => '█'.repeat(w.length)).join(' ');
            descEl.classList.remove('decrypted', 'decrypting');
            dossier.classList.remove('scanning');
        }
    });

    if (btn) {
        btn.setAttribute('data-state', isDecryptingAll ? 'decrypted' : 'redacted');
        btn.innerHTML = isDecryptingAll 
            ? '<i class="fas fa-lock me-1"></i> [REDACT_ALL]'
            : '<i class="fas fa-unlock-alt me-1"></i> [DECRYPT_ALL]';
    }
}

export function initializeProjectFilters() {
    const filters = document.querySelectorAll('.filter-btn');
    filters.forEach(btn => {
        if (btn instanceof HTMLElement) {
            btn.onclick = () => {
                const f = btn.getAttribute('data-filter');
                filters.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                document.querySelectorAll('.project-item').forEach(item => {
                    if (item instanceof HTMLElement) {
                        const cat = item.getAttribute('data-category');
                        item.style.display = (f === 'all' || cat === f) ? 'block' : 'none';
                    }
                });
            };
        }
    });
}

export function renderBlogs(data) {
    const container = document.getElementById('blog-list');
    if (container) container.innerHTML = data.map(p => `<div class="col-md-4 card-glass p-3 m-2"><h6 class="text-primary">${esc(p.title)}</h6><p class="small text-secondary">${esc(p.excerpt)}</p>${p.url ? `<a href="${esc(p.url)}" target="_blank" rel="noopener" class="small text-primary">READ_INTEL →</a>` : ''}</div>`).join('');
}

export function renderLearning(data) {
    const container = document.getElementById('learning-list');
    const pct = v => Math.max(0, Math.min(100, Number(v) || 0));
    if (container) container.innerHTML = data.map(l => `<div class="col-md-6 mb-2"><span>${esc(l.name)}</span><div class="progress" style="height:4px; background: rgba(var(--primary-color-rgb), 0.08)"><div class="progress-bar" style="width:${pct(l.progress)}%; background: var(--primary-color); box-shadow: 0 0 6px var(--primary-color);"></div></div></div>`).join('');
}

export function renderGaming(data) {
    const container = document.getElementById('gaming-stats');
    if (container) container.innerHTML = data.stats.map(s => `<span>${esc(s.label)}: ${esc(s.value)}</span>`).join(' | ');
}

export function renderMedia(data) {
    const container = document.getElementById('media-list') || document.getElementById('favorites-list');
    if (!container || !data) return;

    try {
        container.innerHTML = data.map(item => `
            <div class="media-card card-glass p-3 mb-3">
                <div class="d-flex align-items-center gap-3">
                    <img src="${esc(item.image) || '/img/placeholder-media.png'}" 
                         alt="${esc(item.title)}" 
                         class="media-thumbnail rounded"
                         style="width: 60px; height: 80px; object-fit: cover;"
                         onerror="this.src='/img/placeholder-media.png'">
                    <div>
                        <h6 class="text-primary mb-1">${esc(item.title)}</h6>
                        <span class="badge bg-secondary">${esc(item.subtitle || 'Media')}</span>
                    </div>
                </div>
            </div>
        `).join('');
    } catch {
        container.innerHTML = '<div class="text-danger p-3">[ERROR] Failed to render media</div>';
    }
}

export function renderFileTree(data) {
    const container = document.querySelector('.file-tree-container');
    if (!container) return;
    container.innerHTML = data.map(section => `
        <div class="file-tree-section" id="tree-sec-${esc(section.id)}">
            <div class="file-tree-header" onclick="toggleTreeSection('${esc(section.id)}')"><span>${esc(section.label)}</span></div>
            <div class="file-tree-items" style="display: ${section.isOpen ? 'block' : 'none'}">
                ${section.items.map(item => `<a href="${esc(item.href)}" class="file-tree-item" onclick="handleTreeClick(event, '${esc(item.id)}')"><span>${esc(item.label)}</span></a>`).join('')}
            </div>
        </div>`).join('');
}

export async function fetchGithubRepos(username) {
    const container = document.getElementById('githubActivity');
    if (!container) return;
    try {
        const r = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=5`);
        const repos = await r.json();
        container.innerHTML = repos.map(repo => `<div class="p-2 border-bottom border-secondary border-opacity-10"><a href="${esc(repo.html_url)}" target="_blank" rel="noopener" class="small text-primary">${esc(String(repo.name || '').toUpperCase())}</a></div>`).join('');
    } catch { container.innerHTML = 'OFFLINE'; }
}

export function openCaseStudy(e, projectId) {
    e.preventDefault();
    const project = (window.DATA && window.DATA.projects) ? window.DATA.projects.find(p => p.id === projectId) : null;
    if (!project) return;

    let overlay = document.getElementById('portfolioBridgeOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'portfolioBridgeOverlay';
        overlay.className = 'portfolio-bridge-overlay';
        document.body.appendChild(overlay);
    }

    const caseStudy = project.caseStudy || {};
    const impacts = caseStudy.impact ? caseStudy.impact.map(i => `<li>${esc(i)}</li>`).join('') : '<li>Metrics still compiling...</li>';
    const tech = project.technologies ? project.technologies.map(t => `<span class="tag-tactical">#${esc(t)}</span>`).join('') : '';

    overlay.innerHTML = `
        <div class="bridge-backdrop" onclick="closeCaseStudy()"></div>
        <div class="bridge-window">
            <div class="bridge-header">
                <div class="d-flex align-items-center gap-2"><div class="pulse-indicator"></div><span class="bridge-title">[CASE_STUDY: ${esc(project.title)}]</span></div>
                <div class="d-flex align-items-center"><span class="telemetry-data d-none d-md-block">STATUS: DECRYPTED</span><button class="btn-bridge-ctrl btn-exit" onclick="closeCaseStudy()">ABORT</button></div>
            </div>
            <div class="bridge-content p-4 overflow-auto" style="background: var(--bg-page) !important;">
                <div class="row">
                    <div class="col-lg-8">
                        <h2 class="text-primary mb-3">${esc(project.title)}</h2>
                        <p class="lead text-secondary">${esc(project.description)}</p>
                        <div class="mt-4 p-3 border border-secondary border-opacity-25 bg-dark bg-opacity-25">
                            <h6 class="text-highlight">[MISSION_PROBLEM]</h6><p class="small">${esc(caseStudy.problem || 'N/A')}</p>
                            <h6 class="text-highlight mt-3">[TACTICAL_SOLUTION]</h6><p class="small">${esc(caseStudy.solution || 'N/A')}</p>
                            <h6 class="text-highlight mt-3">[IMPACT_METRICS]</h6><ul class="small text-secondary">${impacts}</ul>
                        </div>
                    </div>
                    <div class="col-lg-4 mt-4 mt-lg-0 border-start border-secondary border-opacity-25">
                        <h6 class="text-primary mb-3">SYSTEM_SPECS</h6>
                        <div class="d-flex flex-wrap gap-2 mb-4">${tech}</div>
                        <div class="d-grid gap-3 mt-4">
                            ${project.liveUrl ? `<a href="${esc(project.liveUrl)}" target="_blank" rel="noopener" class="btn btn-primary"><i class="fas fa-external-link-alt me-2"></i> INITIATE_LIVE_UPLINK</a>` : ''}
                            ${project.githubUrl ? `<a href="${esc(project.githubUrl)}" target="_blank" rel="noopener" class="btn btn-outline-secondary"><i class="fab fa-github me-2"></i> VIEW_SOURCE_CODE</a>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    setTimeout(() => overlay.classList.add('active'), 10);
}

export function closeCaseStudy() {
    const overlay = document.getElementById('portfolioBridgeOverlay');
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 400);
    }
}

export function toggleTreeSection(id) {
    const el = /** @type {HTMLElement | null} */ (document.querySelector(`#tree-sec-${id} .file-tree-items`));
    if (el) el.style.display = el.style.display === 'none' ? 'block' : 'none';
}

export function toggleMobileSidebar() { 
    const sidebar = document.getElementById('fileTreeSidebar');
    if (sidebar) sidebar.classList.toggle('open'); 
}

export function handleTreeClick(e, _id) {
    const href = e.currentTarget.getAttribute('href');
    if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.getElementById(href.substring(1));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    }
}

