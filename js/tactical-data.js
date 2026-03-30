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
 * Fetch and parse CSV data
 */
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
        
        // Track the current session to prevent overlaps
        const sessionID = Math.random().toString(36).substr(2, 9);
        this.el.setAttribute('data-session', sessionID);
        this.sessionID = sessionID;
    }
    type() {
        // If the element has been claimed by a newer "Refetch" session, abort this one
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

/**
 * Global trigger for the typewriter effect
 */
function runTypewriter(info) {
    const tH1 = document.getElementById('typewriter-h1');
    const tP = document.getElementById('typewriter-p');
    
    if (tH1) {
        tH1.parentElement.style.opacity = '1'; // Show H1
        const h1Text = `Hi, I'm ${info.Name.split(' ')[0]} 👋`;
        new Typewriter(tH1, h1Text, 120).type(); // Slower name
    }
    
    if (tP) {
        const pText = info.HeroText || "Analyzing data for strategic growth.";
        // More cinematic delay
        setTimeout(() => {
            tP.parentElement.style.opacity = '1'; // Show P
            new Typewriter(tP, pText, 60).type(); // Polished bio speed
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
        console.warn(`[DATA_FAIL] Using local fallback for ${sheetName}. Check if Sheet is Published!`);
        return [];
    }
}

/**
 * Robust CSV Parser
 */
function parseCSV(csvText) {
    const lines = csvText.split('\n');
    if (lines.length < 1) return [];
    
    const headers = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim());
    
    return lines.slice(1).filter(line => line.trim()).map(line => {
        const values = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
        const obj = {};
        headers.forEach((header, i) => {
            let val = values[i] ? values[i].replace(/^"|"$/g, '').trim() : '';
            // Handle double-escaped quotes in CSV
            val = val.replace(/""/g, '"');
            obj[header] = val;
        });
        return obj;
    });
}

/**
 * Update UI with fetched data
 */
async function initializeTacticalData() {
    console.log('[SYNC] Connecting to Intel Grid...');

    // Trigger typewriter immediately with defaults for "Instant Ops"
    runTypewriter(DEFAULT_INFO);
    
    const [infoData, experience, education, skills, projects, awards] = await Promise.all([
        fetchSheetData(SHEETS.INFO),
        fetchSheetData(SHEETS.EXPERIENCE),
        fetchSheetData(SHEETS.EDUCATION),
        fetchSheetData(SHEETS.SKILLS),
        fetchSheetData(SHEETS.PROJECTS),
        fetchSheetData(SHEETS.AWARDS)
    ]);

    // Use local DATA if available, merging with fetched data or replacing it
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
        if (window.DATA && window.DATA.skillGroups) {
            renderSkillGroups(window.DATA.skillGroups);
        } else {
            renderSkills(finalSkills);
        }
    }

    if (finalProjects.length > 0) {
        renderProjects(finalProjects);
        initializeProjectFilters();
        
        // Dynamically add featured projects to file tree data if available
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
                // Insert a "Featured" section
                window.DATA.fileTreeData.push({
                    id: 'featured-ops',
                    label: 'FEATURED_OPS',
                    isOpen: true,
                    items: featuredProjects
                });
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
    
    // Fetch GitHub Repos
    if (window.TACTICAL_INFO && window.TACTICAL_INFO.Github) {
        fetchGithubRepos(window.TACTICAL_INFO.Github.split('/').pop());
    } else {
        fetchGithubRepos('saajiidi');
    }

    // Initialize AI Chat
    initAIChat();

    // Fade out skeletons after a delay
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
    
    const waLink = document.querySelector('[href*="wa.me"]');
    if (waLink && info.Whatsapp) waLink.href = `https://wa.me/${info.Whatsapp.replace(/\D/g, '')}`;
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
        const highlights = item.highlights ? item.highlights.map(h => `<li class="mb-2"><i class="fas fa-microchip text-primary me-2"></i> ${h}</li>`).join('') : 
                          (item.Bullet1 ? `<li class="mb-2"><i class="fas fa-microchip text-primary me-2"></i> ${item.Bullet1}</li>` : '') + 
                          (item.Bullet2 ? `<li class="mb-2"><i class="fas fa-microchip text-primary me-2"></i> ${item.Bullet2}</li>` : '');
        
        container.insertAdjacentHTML('beforeend', `
          <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="resume-item mb-5">
              <div class="resume-content">
                <h3 class="mb-1 text-light">${item.title || item.Role}</h3>
                <div class="subheading mb-3 text-primary">${item.company || item.Company}</div>
                <ul class="list-unstyled text-secondary">
                  ${highlights}
                </ul>
                ${item.technologies ? `
                <div class="mt-3 d-flex flex-wrap gap-2">
                    ${item.technologies.map(t => `<span class="badge border border-secondary text-secondary small" style="font-size: 0.7rem;">${t.toUpperCase()}</span>`).join('')}
                </div>` : ''}
              </div>
              <div class="resume-date"><span>${item.startDate || item.Date}${item.endDate ? ` — ${item.endDate}` : (item.current ? ' — Present' : '')}</span></div>
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
          <div class="timeline-item">
            <div class="timeline-dot"></div>
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
    const chartLabels = [];
    const chartValues = [];
    
    if (chipContainer) {
        chipContainer.innerHTML = '';
        groups.forEach(group => {
            group.skills.forEach(skill => {
                chipContainer.insertAdjacentHTML('beforeend', `<span class="badge border border-primary text-primary" title="${group.name}">${skill.name.toUpperCase()}</span>`);
                if (skill.level && chartLabels.length < 6) {
                    chartLabels.push(skill.name);
                    chartValues.push(skill.level);
                }
            });
        });
    }

    if (window.skillsRadarChart && chartLabels.length > 0) {
        window.skillsRadarChart.data.labels = chartLabels;
        window.skillsRadarChart.data.datasets[0].data = chartValues;
        window.skillsRadarChart.update();
    }

    // Update progress bars if they exist
    const pbContainer = document.getElementById('skill-progress-bars');
    if (pbContainer) {
        const topSkills = groups.flatMap(g => g.skills).filter(s => s.level).sort((a,b) => b.level - a.level).slice(0, 5);
        pbContainer.innerHTML = topSkills.map(skill => `
            <div class="skill-progress-item mb-3">
                <div class="skill-progress-header d-flex justify-content-between mb-1">
                    <span class="skill-name small text-secondary">${skill.name}</span>
                    <span class="skill-percent small text-primary">${skill.level}%</span>
                </div>
                <div class="progress bg-dark" style="height: 4px;">
                    <div class="progress-bar bg-primary" role="progressbar" style="width: ${skill.level}%" aria-valuenow="${skill.level}" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            </div>
        `).join('');
    }
}

function renderSkills(data) {
    const chipContainer = document.getElementById('skill-chips');
    if (chipContainer) {
        chipContainer.innerHTML = '';
        data.forEach(item => {
            if (item.Skill) {
               chipContainer.insertAdjacentHTML('beforeend', `<span class="badge border border-primary text-primary">${item.Skill.toUpperCase()}</span>`);
            }
        });
    }
    const chartLabels = data.map(item => item.Skill).filter(s => s && s.length < 15).slice(0, 6);
    const chartValues = data.map(item => parseInt(item.Value) || 80).slice(0, 6);
    if (window.skillsRadarChart) {
        window.skillsRadarChart.data.labels = chartLabels;
        window.skillsRadarChart.data.datasets[0].data = chartValues;
        window.skillsRadarChart.update();
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
                <div class="mb-2">
                    <span class="case-label">Metrics:</span> 
                    <div class="d-flex gap-2 mt-1">
                        ${item.caseStudy.metrics.map(m => `<span class="badge bg-secondary bg-opacity-25 text-light">${m.label}: ${m.value}</span>`).join('')}
                    </div>
                </div>
            </div>
        ` : '';

        container.insertAdjacentHTML('beforeend', `
          <div class="col-lg-6 project-item" data-category="${item.category || 'all'}">
            <div class="card-glass h-100">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <h5 class="card-title text-primary mb-0">[${item.title.toUpperCase()}]</h5>
                    ${item.featured ? '<span class="badge bg-primary text-dark" style="font-size: 0.6rem;">FEATURED</span>' : ''}
                </div>
                <p class="card-text text-secondary small">${item.description}</p>
                <div class="d-flex flex-wrap gap-2 mb-3">
                    ${item.technologies.slice(0, 4).map(t => `<span class="text-primary" style="font-size: 0.7rem; font-family: 'JetBrains Mono'">#${t.replace(/\s+/g, '')}</span>`).join('')}
                </div>
                
                ${caseStudyHtml}

                <div class="d-flex gap-2 mt-3">
                    <a href="${item.liveUrl || item.githubUrl || item.Link || '#'}" 
                       onclick="openPortfolioBridge(event, '${item.liveUrl || item.githubUrl || item.Link || '#'}')" 
                       class="btn btn-sm btn-primary">VIEW_INTEL</a>
                    ${item.caseStudy ? `<button class="btn btn-sm btn-outline-secondary" onclick="toggleCaseStudy('${item.id}', this)">CASE_STUDY</button>` : ''}
                </div>
              </div>
            </div>
          </div>
        `);
    });
}

function toggleCaseStudy(id, btn) {
    const el = document.getElementById(`case-${id}`);
    if (el) {
        const isHidden = el.style.display === 'none';
        el.style.display = isHidden ? 'block' : 'none';
        btn.innerText = isHidden ? 'HIDE_INTEL' : 'CASE_STUDY';
        AudioEngine.play('beep');
    }
}

function renderAwards(data) {
    const container = document.getElementById('awards-list');
    if (!container) return;
    container.innerHTML = '';
    data.forEach(item => {
        container.insertAdjacentHTML('beforeend', `
          <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="resume-item mb-4">
              <h3 class="mb-0">${item.Title}</h3>
              <div class="subheading mb-3 text-primary">${item.Subheading}</div>
              ${item.Date ? `<p class="text-secondary small">${item.Date}</p>` : ''}
              ${item.Link ? `<a href="${item.Link}" target="_blank" class="btn btn-sm btn-primary">VIEW_INTEL</a>` : ''}
            </div>
          </div>
        `);
    });
}

function initializeProjectFilters() {
    const filters = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.project-item');
    if (!filters.length || !items.length) return;

    filters.forEach(btn => {
        btn.onclick = () => {
            const filterValue = btn.getAttribute('data-filter');
            
            filters.forEach(f => f.classList.remove('active'));
            btn.classList.add('active');

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
        };
    });
}

function renderBlogs(data) {
    const container = document.getElementById('blog-list');
    if (!container) return;
    container.innerHTML = data.map(post => `
        <div class="col-md-4">
            <div class="card-glass p-3 h-100">
                <div class="small text-primary mb-2">${post.date}</div>
                <h6 class="text-light">[${post.title.toUpperCase()}]</h6>
                <p class="small text-secondary mb-3">${post.excerpt}</p>
                <div class="d-flex flex-wrap gap-2 mb-3">
                    ${post.tags.map(t => `<span class="badge border border-secondary text-secondary" style="font-size: 0.6rem;">${t}</span>`).join('')}
                </div>
                <a href="${post.url}" class="btn btn-sm btn-outline-primary w-100">READ_INTEL</a>
            </div>
        </div>
    `).join('');
}

function renderLearning(data) {
    const container = document.getElementById('learning-list');
    if (!container) return;
    container.innerHTML = data.map(item => `
        <div class="col-md-6">
            <div class="skill-progress-item mb-3">
                <div class="d-flex justify-content-between mb-1">
                    <span class="small text-secondary">${item.name} (${item.category})</span>
                    <span class="small text-primary">${item.progress}%</span>
                </div>
                <div class="progress bg-dark" style="height: 6px;">
                    <div class="progress-bar bg-success" style="width: ${item.progress}%"></div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderGaming(data) {
    const statsContainer = document.getElementById('gaming-stats');
    if (statsContainer) {
        statsContainer.innerHTML = data.stats.map(s => `
            <div class="text-center">
                <div class="small text-secondary">${s.label}</div>
                <div class="text-primary fw-bold">${s.value}</div>
            </div>
        `).join('');
    }

    const gamesContainer = document.getElementById('favorite-games');
    if (gamesContainer) {
        gamesContainer.innerHTML = data.favorites.map(g => `
            <li class="d-flex justify-content-between border-bottom border-secondary border-opacity-10 py-2">
                <span class="text-light">${g.name}</span>
                <span class="badge bg-secondary bg-opacity-25 text-secondary">${g.category}</span>
            </li>
        `).join('');
    }
}

function renderMedia(data) {
    const container = document.getElementById('favorite-media');
    if (!container) return;
    container.innerHTML = data.map(m => `
        <div class="col-4">
            <div class="card-glass p-2 text-center h-100">
                <img src="${m.image}" alt="${m.title}" class="img-fluid mb-2 border border-secondary border-opacity-25" style="border-radius: 4px;">
                <div class="small text-secondary fw-bold" style="font-size: 0.7rem;">${m.title}</div>
                <div class="text-primary" style="font-size: 0.6rem;">${m.subtitle}</div>
            </div>
        </div>
    `).join('');
}

function renderFileTree(data) {
    const container = document.querySelector('.file-tree-container');
    if (!container) return;
    
    container.innerHTML = data.map(section => `
        <div class="file-tree-section" id="tree-sec-${section.id}">
            <div class="file-tree-header ${section.isOpen ? '' : 'collapsed'}" onclick="toggleTreeSection('${section.id}')">
                <i class="fas fa-chevron-down"></i>
                <span>${section.label}</span>
            </div>
            <div class="file-tree-items" style="display: ${section.isOpen ? 'block' : 'none'}">
                ${section.items.map(item => `
                    <a href="${item.href.startsWith('/') ? '#' + (item.id || item.label.toLowerCase()) : item.href}" class="file-tree-item" onclick="handleTreeClick(event, '${item.id || item.label.toLowerCase()}')">
                        <i class="file-tree-icon fas fa-${item.icon || 'file'}"></i>
                        <span class="file-label">${item.label}</span>
                        ${item.extension ? `<span class="file-extension ext-${item.extension}">${item.extension}</span>` : ''}
                    </a>
                `).join('')}
            </div>
        </div>
    `).join('');
}

async function fetchGithubRepos(username) {
    const container = document.getElementById('githubActivity');
    if (!container) return;
    
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=60`);
        if (!response.ok) throw new Error('GITHUB_OFFLINE');
        const repos = await response.json();
        
        container.innerHTML = repos.map(repo => `
            <div class="activity-item mb-2 p-2 border-bottom border-secondary border-opacity-10">
                <div class="d-flex justify-content-between">
                    <a href="${repo.html_url}" target="_blank" class="small text-primary fw-bold text-decoration-none">${repo.name.toUpperCase()}</a>
                    <span class="small text-secondary" style="font-size: 0.6rem;">${repo.language || 'N/A'}</span>
                </div>
                <div class="small text-secondary" style="font-size: 0.65rem; line-height: 1.2;">${repo.description || 'No description provided.'}</div>
                <div class="d-flex gap-3 mt-1">
                    <span class="small text-secondary" style="font-size: 0.6rem;"><i class="fas fa-star me-1"></i>${repo.stargazers_count}</span>
                    <span class="small text-secondary" style="font-size: 0.6rem;"><i class="fas fa-code-branch me-1"></i>${repo.forks_count}</span>
                </div>
            </div>
        `).join('');
    } catch (error) {
        container.innerHTML = '<div class="small text-danger">TELEMETRY_LINK_LOST</div>';
    }
}

function initAIChat() {
    // Inject Chat UI if not exists
    if (!document.getElementById('aiChatContainer')) {
        const chatHtml = `
            <div class="ai-chat-container card-glass" id="aiChatContainer">
                <div class="ai-chat-header d-flex justify-content-between align-items-center">
                    <span><i class="fas fa-robot text-primary me-2"></i>AI_COMMS_V4</span>
                    <button class="btn btn-sm text-primary p-0" onclick="toggleAIChat()"><i class="fas fa-minus"></i></button>
                </div>
                <div class="ai-chat-body" id="aiChatBody">
                    <div class="ai-message system">Secure bridge established. Awaiting input...</div>
                </div>
                <div class="ai-chat-input-wrapper">
                    <input type="text" id="aiChatInput" placeholder="Message Alpha-1..." autocomplete="off">
                    <button onclick="sendAIMessage()"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>
            <button class="ai-chat-toggle pulse" id="aiChatLaunch" onclick="toggleAIChat()">
                <i class="fas fa-comment-dots"></i>
                <span class="ping-dot"></span>
            </button>
        `;
        document.body.insertAdjacentHTML('beforeend', chatHtml);
        
        const input = document.getElementById('aiChatInput');
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendAIMessage();
        });
    }
}

function toggleAIChat() {
    const chat = document.getElementById('aiChatContainer');
    chat.classList.toggle('active');
    AudioEngine.play('beep');
}

async function sendAIMessage() {
    const input = document.getElementById('aiChatInput');
    const body = document.getElementById('aiChatBody');
    const msg = input.value.trim();
    
    if (!msg) return;
    
    // User Message
    const userDiv = document.createElement('div');
    userDiv.className = 'ai-message user';
    userDiv.textContent = msg;
    body.appendChild(userDiv);
    input.value = '';
    body.scrollTop = body.scrollHeight;
    
    AudioEngine.play('type');

    // Simulate thinking
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'ai-message system typing';
    loadingDiv.textContent = 'Processing...';
    body.appendChild(loadingDiv);
    
    // Delayed Response
    setTimeout(() => {
        loadingDiv.remove();
        const responseDiv = document.createElement('div');
        responseDiv.className = 'ai-message bot';
        
        // Simple tactical response logic
        let reply = "Operational parameters within normal range. My neural core indicates Sajid is the expert for this request.";
        if (msg.toLowerCase().includes('who')) reply = "Identity search in progress... Subject: Sajid Islam. Status: Senior Operative in Data & ML.";
        if (msg.toLowerCase().includes('skill')) reply = "Retrieving skill grid... Primary nodes: Python, SQL, BI Tools, React. Power levels categorized as High.";
        if (msg.toLowerCase().includes('hire')) reply = "Recruitment protocol initiated. Please use the terminal command 'email' or use the contact form to establish high-priority link.";
        
        responseDiv.textContent = reply;
        body.appendChild(responseDiv);
        body.scrollTop = body.scrollHeight;
        AudioEngine.play('beep');
    }, 1500);
}

function toggleTreeSection(id) {
    const header = document.querySelector(`#tree-sec-${id} .file-tree-header`);
    const items = document.querySelector(`#tree-sec-${id} .file-tree-items`);
    if (header && items) {
        const isCollapsed = header.classList.toggle('collapsed');
        items.style.display = isCollapsed ? 'none' : 'block';
        AudioEngine.play('hover');
    }
}

function toggleMobileSidebar() {
    const sidebar = document.getElementById('fileTreeSidebar');
    sidebar.classList.toggle('d-none');
    sidebar.classList.toggle('open');
    AudioEngine.play('beep');
}

function handleTreeClick(e, id) {
    // If it's hash link, we'll let it scroll
    if (e.currentTarget.getAttribute('href').startsWith('#')) {
        // Find if element exists
        const targetId = e.currentTarget.getAttribute('href').substring(1);
        const el = document.getElementById(targetId);
        if (el) {
            e.preventDefault();
            el.scrollIntoView({ behavior: 'smooth' });
            
            // Highlight active in tree
            document.querySelectorAll('.file-tree-item').forEach(item => item.classList.remove('active'));
            e.currentTarget.classList.add('active');
            
            if (window.innerWidth < 992) toggleMobileSidebar();
        }
    }
    AudioEngine.play('click');
}

document.addEventListener('DOMContentLoaded', initializeTacticalData);
