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
        const h1Text = `Hi, I'm ${info.Name.split(' ')[0]} 👋`;
        new Typewriter(tH1, h1Text, 100).type();
    }
    
    if (tP) {
        const pText = info.HeroText || "Analyzing data for strategic growth.";
        setTimeout(() => new Typewriter(tP, pText, 50).type(), 2000);
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

    if (infoData.length > 0) {
        const info = {};
        infoData.forEach(item => { info[item.Key] = item.Value; });
        renderInfo(info);
    }

    if (experience.length > 0) renderExperience(experience);
    if (education.length > 0) renderEducation(education);
    if (skills.length > 0) renderSkills(skills);
    if (projects.length > 0) {
        renderProjects(projects);
        // RE-INITIALIZE FILTER LOGIC AFTER RENDER
        initializeProjectFilters();
    }
    if (awards.length > 0) renderAwards(awards);

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
        container.insertAdjacentHTML('beforeend', `
          <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="resume-item mb-5">
              <div class="resume-content">
                <h3 class="mb-1 text-light">${item.Role}</h3>
                <div class="subheading mb-3 text-primary">${item.Company}</div>
                <ul class="list-unstyled text-secondary">
                  ${item.Bullet1 ? `<li class="mb-2"><i class="fas fa-microchip text-primary me-2"></i> ${item.Bullet1}</li>` : ''}
                  ${item.Bullet2 ? `<li class="mb-2"><i class="fas fa-microchip text-primary me-2"></i> ${item.Bullet2}</li>` : ''}
                </ul>
              </div>
              <div class="resume-date"><span>${item.Date}</span></div>
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
        container.insertAdjacentHTML('beforeend', `
          <div class="col-lg-6 project-item" data-category="${item.Category || 'all'}">
            <div class="card-glass h-100">
              <div class="card-body">
                <h5 class="card-title text-primary">[${item.Title.toUpperCase()}]</h5>
                <p class="card-text text-secondary">${item.Description}</p>
                <ul class="case-list">
                  ${item.Problem ? `<li><span class="case-label">Problem</span><span class="case-text">${item.Problem}</span></li>` : ''}
                  ${item.Approach ? `<li><span class="case-label">Approach</span><span class="case-text">${item.Approach}</span></li>` : ''}
                  ${item.Impact ? `<li><span class="case-label">Impact</span><span class="case-text">${item.Impact}</span></li>` : ''}
                  ${item.Tools ? `<li><span class="case-label">Tools</span><span class="case-text">${item.Tools}</span></li>` : ''}
                </ul>
                <a href="${item.Link || '#'}" target="_blank" rel="noopener" class="btn btn-sm btn-primary">VIEW_INTEL</a>
              </div>
            </div>
          </div>
        `);
    });
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
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    filterBtns.forEach(btn => {
        btn.onclick = () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.getAttribute('data-filter');
            projectItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.classList.remove('hide');
                } else {
                    item.classList.add('hide');
                }
            });
        };
    });
}

document.addEventListener('DOMContentLoaded', initializeTacticalData);
