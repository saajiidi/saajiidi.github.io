/**
 * GITHUB LIVE FEED — Reliable GitHub-style activity renderer
 * Fetches real data from GitHub API, falls back to simulated commits
 * Renders into #githubActivity with .activity-item elements
 */

const GH_USER   = 'saajiidi';
const GH_API    = `https://api.github.com/users/${GH_USER}/events/public`;

const TYPE_MAP = {
    PushEvent:          { icon: 'fa-code-commit',      color: '#22c55e', verb: 'pushed to'    },
    CreateEvent:        { icon: 'fa-plus-circle',      color: '#3b82f6', verb: 'created'      },
    ForkEvent:          { icon: 'fa-code-branch',      color: '#8b5cf6', verb: 'forked'       },
    WatchEvent:         { icon: 'fa-star',             color: '#f59e0b', verb: 'starred'      },
    PullRequestEvent:   { icon: 'fa-code-pull-request',color: '#a855f7', verb: 'opened PR in' },
    IssuesEvent:        { icon: 'fa-circle-dot',       color: '#06b6d4', verb: 'issue in'     },
    ReleaseEvent:       { icon: 'fa-tag',              color: '#ec4899', verb: 'released'     },
    DeleteEvent:        { icon: 'fa-trash-alt',        color: '#ef4444', verb: 'deleted from' }
};

const FALLBACK_EVENTS = [
    { type: 'PushEvent',   repo: 'saajiidi.github.io',       branch: 'main',   msg: 'Fix portfolio bridge & restore feed',  sha: 'a3f1c28', ago: '8m ago'  },
    { type: 'PushEvent',   repo: 'saajiidi.github.io',       branch: 'main',   msg: 'Add Agentic AI to learning track',     sha: 'b8e2d14', ago: '42m ago' },
    { type: 'CreateEvent', repo: 'agentic-ai-assistant',     branch: 'feature/rag', msg: '',                                sha: '',        ago: '2h ago'  },
    { type: 'PushEvent',   repo: 'agentic-ai-assistant',     branch: 'develop',msg: 'Bootstrap LangChain + VectorDB',       sha: 'c9a3f77', ago: '4h ago'  },
    { type: 'WatchEvent',  repo: 'langchain-ai/langchain',   branch: '',       msg: '',                                     sha: '',        ago: '8h ago'  },
    { type: 'PushEvent',   repo: 'e-com-dashboard',          branch: 'main',   msg: 'Update KPI with real-time data',       sha: 'd2b1e9', ago: '1d ago'   },
    { type: 'ForkEvent',   repo: 'vercel/next.js',           branch: '',       msg: '',                                     sha: '',        ago: '2d ago'  }
];

function timeAgo(isoString) {
    const s = Math.floor((Date.now() - new Date(isoString)) / 1000);
    if (s < 60)     return 'just now';
    if (s < 3600)   return `${Math.floor(s / 60)}m ago`;
    if (s < 86400)  return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
}

function shortRepo(fullName) {
    return (fullName || '').replace(`${GH_USER}/`, '');
}

function renderActivityItem(data) {
    const cfg    = TYPE_MAP[data.type] || { icon: 'fa-circle', color: '#6b7280', verb: 'activity in' };
    const repo   = shortRepo(data.repo);
    const time   = data.ago || data.isoTime;
    const branch = data.branch;
    const sha    = data.sha;
    const msg    = data.msg;

    return `
        <div class="activity-item gh-row">
            <span class="gh-dot" style="background:${cfg.color}; box-shadow:0 0 6px ${cfg.color}80">
                <i class="fas ${cfg.icon}"></i>
            </span>
            <div class="gh-info">
                <div class="gh-line1">
                    <span class="gh-verb">${cfg.verb}</span>
                    <span class="gh-repo">${repo}</span>
                    <span class="gh-time">${time}</span>
                </div>
                <div class="gh-line2">
                    ${branch  ? `<span class="gh-tag branch"><i class="fas fa-code-branch"></i>${branch}</span>` : ''}
                    ${sha     ? `<span class="gh-tag hash"><i class="fas fa-hashtag"></i>${sha}</span>` : ''}
                    ${msg     ? `<span class="gh-msg">"${msg}"</span>` : ''}
                </div>
            </div>
        </div>`;
}

function renderFallback(container) {
    container.innerHTML = FALLBACK_EVENTS.map(renderActivityItem).join('');
    animateItems(container);
}

function animateItems(container) {
    container.querySelectorAll('.activity-item').forEach((el, i) => {
        el.style.opacity   = '0';
        el.style.transform = 'translateX(-10px)';
        setTimeout(() => {
            el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            el.style.opacity    = '1';
            el.style.transform  = 'translateX(0)';
        }, i * 60);
    });
}

async function initGitHubFeed() {
    const container = document.getElementById('githubActivity');
    if (!container) return;

    // Update header with live dot
    const header = document.querySelector('#githubWidget .widget-header');
    if (header) {
        header.innerHTML = `<i class="fab fa-github"></i><span>LIVE_FEED</span><span class="gh-live-dot"></span>`;
    }

    container.innerHTML = `<div class="activity-item" style="color:#64748b;font-size:0.75rem;padding:8px 12px">Fetching commits...</div>`;

    try {
        const res = await fetch(GH_API, { headers: { 'Accept': 'application/vnd.github.v3+json' } });
        if (!res.ok) throw new Error('API error');

        const events = await res.json();
        if (!Array.isArray(events) || events.length === 0) throw new Error('No events');

        const items = events.slice(0, 8).map(ev => {
            const cfg    = TYPE_MAP[ev.type] || TYPE_MAP['WatchEvent'];
            const commits = ev.payload?.commits || [];
            return {
                type:   ev.type,
                repo:   ev.repo?.name || '',
                branch: (ev.payload?.ref || '').replace('refs/heads/', '') || ev.payload?.ref_type || '',
                msg:    commits[0]?.message?.split('\n')[0] || '',
                sha:    (commits[0]?.sha || '').slice(0, 7),
                ago:    timeAgo(ev.created_at)
            };
        });

        container.innerHTML = items.map(renderActivityItem).join('');
        animateItems(container);

    } catch (_) {
        renderFallback(container);
    }

    // Live simulation: add new fake events every 30s
    setInterval(() => {
        const newEvents = [
            { type: 'PushEvent',  repo: 'saajiidi.github.io', branch: 'main', msg: 'Minor fix',             sha: Math.random().toString(36).slice(2,9), ago: 'just now' },
            { type: 'WatchEvent', repo: 'openai/openai-python', branch: '', msg: '',                         sha: '',                                      ago: 'just now' },
            { type: 'PushEvent',  repo: 'e-com-dashboard',     branch: 'main', msg: 'Update dashboard data', sha: Math.random().toString(36).slice(2,9), ago: 'just now' }
        ];
        const pick = newEvents[Math.floor(Math.random() * newEvents.length)];
        const newEl = document.createElement('div');
        newEl.style.cssText = 'opacity:0;transform:translateX(-10px);transition:opacity 0.3s ease,transform 0.3s ease';
        newEl.innerHTML = renderActivityItem(pick);
        const child = newEl.firstElementChild;
        if (child && container.firstChild) {
            container.insertBefore(child, container.firstChild);
            setTimeout(() => { child.style.opacity = '1'; child.style.transform = 'translateX(0)'; }, 50);
        }
        // Remove beyond 10
        while (container.children.length > 10) container.removeChild(container.lastChild);
    }, 30000);
}

document.addEventListener('DOMContentLoaded', initGitHubFeed);
