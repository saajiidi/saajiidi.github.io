/**
 * TACTICAL SHELL v5.2
 * Multi-threaded interactive terminal for situational awareness
 * Now exported as ES module.
 */

const commandHistory = [];
let historyIndex = -1;
let telemetryIntervals = [];

export function toggleBottomTerminal() {
    const term = document.getElementById('bottomTerminal');
    if (term) {
        term.classList.remove('minimized');
        term.classList.toggle('active');
    }
    if (typeof window.AudioEngine !== 'undefined') window.AudioEngine.play('beep');
}

export function minimizeBottomTerminal() {
    const term = document.getElementById('bottomTerminal');
    if (term) term.classList.toggle('minimized');
    if (typeof window.AudioEngine !== 'undefined') window.AudioEngine.play('beep');
}

export function maximizeBottomTerminal() {
    const term = document.getElementById('bottomTerminal');
    if (term) {
        term.classList.toggle('maximized');
        term.classList.remove('minimized');
    }
    if (typeof window.AudioEngine !== 'undefined') window.AudioEngine.play('beep');
}

export function switchTerminalTab(tabId) {
    document.querySelectorAll('.terminal-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.terminal-tab-content').forEach(c => c.classList.remove('active'));
    
    const tabs = document.querySelectorAll('.terminal-tab');
    const activeTab = Array.from(tabs).find(t => t.textContent.toLowerCase().includes(tabId));
    const activeContent = document.getElementById(`tab-${tabId}`);
    
    if (activeTab) activeTab.classList.add('active');
    if (activeContent) activeContent.classList.add('active');
    if (typeof window.AudioEngine !== 'undefined') window.AudioEngine.play('click');
}

export function startTelemetryStreams() {
    const debug = document.getElementById('debug-stream');
    const output = document.getElementById('output-stream');
    if (!debug || !output) return;

    telemetryIntervals.forEach(interval => clearInterval(interval));
    telemetryIntervals = [];

    const debugInterval = setInterval(() => {
        if (Math.random() > 0.7) {
            const logs = [
                `[${new Date().toLocaleTimeString()}] SYST_PING: ${Math.floor(Math.random()*20)}ms`,
                `[${new Date().toLocaleTimeString()}] NEURAL_LINK: STABLE`,
                `[${new Date().toLocaleTimeString()}] BUFFER_CLEAR: 0x${Math.random().toString(16).slice(2,6)}`,
                `[${new Date().toLocaleTimeString()}] CRYPTO_SESS: ACTIVE`
            ];
            const line = document.createElement('div');
            line.className = 'terminal-line small opacity-50';
            line.textContent = logs[Math.floor(Math.random() * logs.length)];
            debug.appendChild(line);
            if (debug.children.length > 30) debug.removeChild(debug.firstChild);
            debug.scrollTop = debug.scrollHeight;
        }
    }, 2000);
    telemetryIntervals.push(debugInterval);

    const outputInterval = setInterval(() => {
        if (Math.random() > 0.9) {
            const updates = [
                "> git fetch origin master --silent",
                "> local_assets optimized (1.4s)",
                "> neural_uplink v5.0 deployed",
                "> situational_awareness @ 98%"
            ];
            const line = document.createElement('div');
            line.className = 'terminal-line small text-success';
            line.textContent = updates[Math.floor(Math.random() * updates.length)];
            output.appendChild(line);
            if (output.children.length > 30) output.removeChild(output.firstChild);
            output.scrollTop = output.scrollHeight;
        }
    }, 5000);
    telemetryIntervals.push(outputInterval);
}

export function cleanupTerminal() {
    telemetryIntervals.forEach(interval => clearInterval(interval));
    telemetryIntervals = [];
}

window.addEventListener('beforeunload', cleanupTerminal);

const terminalCommands = {
    help: () => `CMD_DIRECTORY:
  neofetch       System summary & specs
  ls             List project archive nodes
  cat [id]       Display project dossier
  projects       Summary of deployed projects
  langgraph      Deep dive on LangGraph multi-agent AI system
  skills         Technical arsenal breakdown
  contact        Operational comms matrix
  whoami         Operative identification
  status         System diagnostics
  clearance      Elevate security clearance
  write [title]  Start blog editor mode
  save           Commit buffer to Intel Reports
  abort          Clear buffer & exit editor
  workbench      Open analytical data science sandbox
  echo [text]    Reflect input back to output
  pwd            Print working directory
  clear          Reset shell
  exit           Terminate session`,

    neofetch: () => `
    .---.      USER: Sajid Islam
   /     \\     OS: Tactical HUD v5.2
   | (O) |     UPTIME: ${Math.floor(performance.now() / 1000)}s
   \\     /     MEMORY: 4.2GB / 16.0GB
    '---'      RESOLUTION: ${window.innerWidth}x${window.innerHeight}
               STATUS: MISSION_READY
    `,

    ls: (args) => {
        const projects = (window.DATA && window.DATA.projects) ? window.DATA.projects : [];
        let files = projects.map(p => `[NODE] ${p.id}`);
        if (args && args.includes('-a')) {
            const secrets = Object.keys(window.MISSION_SECRETS || {}).map(s => `[HIDDEN] .${s}`);
            files = [...files, ...secrets];
        }
        return files.join('  ');
    },

    cat: (args) => {
        if (!args || args.length === 0) return "USAGE: cat [id]";
        const fileId = args[0].replace(/^\./, '');
        
        if (window.MISSION_SECRETS && window.MISSION_SECRETS[fileId]) {
            return `[LOCAL_DOSSIER]: ${fileId}\nINTEL: ${window.MISSION_SECRETS[fileId]}`;
        }

        const projects = (window.DATA && window.DATA.projects) ? window.DATA.projects : [];
        const project = projects.find(p => p.id.toLowerCase() === fileId.toLowerCase());
        if (!project) return `[FILE_NOT_FOUND]: ${args[0]}`;
        const techStr = Array.isArray(project.technologies) ? project.technologies.join(', ') : (project.tools || 'N/A');
        return `[PROJECT_NODE]: ${project.title}\nSTATUS: DEPLOYED\nTECH: ${techStr}\nINTEL: ${project.description}`;
    },

    projects: () => {
        const list = (window.DATA && window.DATA.projects) ? window.DATA.projects : [];
        if (!list.length) return "NO_PROJECTS_LOADED";
        return list.map((p, i) => `[${i + 1}] ${p.title}\n    TECH: ${(p.technologies || []).join(', ')}\n    URL: ${p.liveUrl || p.githubUrl || 'N/A'}`).join('\n\n');
    },

    langgraph: () => {
        const list = (window.DATA && window.DATA.projects) ? window.DATA.projects : [];
        const lg = list.find(p => p.id === 'langgraph-demo') || list[0];
        if (!lg) return "LangGraph dossier not found.";
        return `[FEATURED_AI_NODE]: ${lg.title}\nROLE: AI Engineer & Architect\nTECH: ${(lg.technologies || []).join(', ')}\nURL: ${lg.githubUrl || lg.liveUrl}\nINTEL: ${lg.description}\nARCHITECTURE: StateGraph (researcher -> writer -> reviewer with conditional loops)`;
    },

    skills: () => {
        const groups = (window.DATA && window.DATA.skillGroups) ? window.DATA.skillGroups : [];
        if (!groups.length) return "NO_SKILLS_LOADED";
        return groups.map(g => `[${g.name.toUpperCase()}]:\n  ${g.skills.map(s => `${s.name} (${s.level}%)`).join(', ')}`).join('\n');
    },

    contact: () => {
        return `COMMUNICATION_CHANNELS:
  Email:    sajid.islam.chowdhury@gmail.com
  WhatsApp: +880 182 452 6054 (https://wa.me/8801824526054)
  Telegram: @descoTGbot / https://t.me/+8801824526054
  LinkedIn: https://www.linkedin.com/in/sajidislamchowdhury/
  GitHub:   https://github.com/Sajid-ul-Islam
  Kaggle:   https://www.kaggle.com/saajiidi`;
    },

    whoami: () => "IDENTITY_CONFIRMED: Sajid Islam // ROLE: Operative_Data_Analyst // ID: SI-2025-DHAKA",
    
    status: () => `SYS_DIAG_v5: OK // NEURAL_LINK: STABLE // LATENCY: 14ms // UPTIME: ${Math.floor(performance.now()/1000)}s`,

    clearance: () => {
        const val = document.querySelector('.status-value');
        if (val) val.textContent = "LVL_10_ELITE_OPERATIVE";
        return "[SUCCESS]: Clearance elevated to LVL_10.";
    },

    link_gemini: (args) => {
        if (!args || args.length === 0) return "USAGE: link_gemini [key]";
        localStorage.setItem('GEMINI_UPLINK_KEY', args[0]);
        return "[SUCCESS]: Neural link established.";
    },

    pwd: () => "C:\\Users\\Sajid\\Portfolio_Mission_Dashboard",
    clear: () => "CLEAR",

    write: (args) => {
        if (!args || args.length === 0) return "USAGE: write [post_title]";
        window.currentPostTitle = args.join('_');
        window.terminalBuffer = "";
        window.isWritingMode = true;
        return `[EDITOR_MODE]: Started writing "${window.currentPostTitle}". Type 'save' to commit to blog or 'abort' to discard.`;
    },

    save: () => {
        if (!window.isWritingMode) return "[ERROR]: Not in editor mode. Use 'write' first.";
        const blogList = document.getElementById('blog-list');
        if (blogList) {
            const newPost = document.createElement('div');
            newPost.className = 'col-lg-6';
            newPost.innerHTML = `
                <div class="card-glass p-3 h-100">
                    <h5 class="text-primary mb-2">[INTEL_REPORT: ${window.currentPostTitle}]</h5>
                    <p class="text-secondary small mb-0">${window.terminalBuffer || "Operational logs updated via tactical terminal."}</p>
                    <div class="mt-2 small opacity-50 font-mono">${new Date().toLocaleDateString()}</div>
                </div>
            `;
            blogList.prepend(newPost);
            window.isWritingMode = false;
            return `[SUCCESS]: Post "${window.currentPostTitle}" saved to INTEL_REPORTS.`;
        }
        return "[ERROR]: Blog node not found.";
    },

    echo: (args) => {
        if (!args || args.length === 0) return "USAGE: echo [text]";
        return args.join(' ');
    },

    abort: () => {
        window.isWritingMode = false;
        window.terminalBuffer = "";
        return "[ABORTED]: Buffer cleared. Tactical session resumed.";
    },

    workbench: () => {
        switchTerminalTab('workbench');
        return "[WORKBENCH_ACTIVE]: Analytical sandbox initialized. Execute payload to process datasets.";
    },

    exit: () => {
        toggleBottomTerminal();
        return "TERMINATING...";
    }
};

export const WORKBENCH_PRESETS = {
    churn: {
        title: "Customer Retention & Churn Analysis",
        code: `# DEEN Commerce Retention Analysis
dataset = [
    {"cohort": "Jan-2025", "users": 1250, "retention_m1": 0.42, "churn_risk": "Low"},
    {"cohort": "Feb-2025", "users": 1420, "retention_m1": 0.48, "churn_risk": "Low"},
    {"cohort": "Mar-2025", "users": 1680, "retention_m1": 0.54, "churn_risk": "Optimal"},
    {"cohort": "Apr-2025", "users": 1890, "retention_m1": 0.61, "churn_risk": "Optimal"}
]

avg_retention = sum(c["retention_m1"] for c in dataset) / len(dataset)
growth = ((dataset[-1]["retention_m1"] - dataset[0]["retention_m1"]) / dataset[0]["retention_m1"]) * 100
print(f"Average 30-Day Retention: {avg_retention * 100:.1f}%")
print(f"Retention Uplift: +{growth:.1f}% after CRM automation")`,
        execute: () => {
            return `[PAYLOAD_EXECUTION_SUCCESS] // ENGINE: PYTHON_DATA_SIM_v3.2
-------------------------------------------------------------
DATASET: E-COMMERCE_RETENTION_COHORTS (N=6,240 USERS)
METRICS COMPUTED:
  • Baseline Cohort (Jan-2025):  42.0% Retention (Churn: 58.0%)
  • Optimized Cohort (Apr-2025): 61.0% Retention (Churn: 39.0%)
  • Mean 30-Day Retention:       51.25%
  • Net CRM Retention Uplift:    +45.24%
  • Projected Annualized LTV:    +$142,500 USD

STRATEGIC CONCLUSION:
Automated re-engagement workflows and RFM-segmented email triggers
drove a verified 15%+ uplift in repeat purchases across retail accounts.
-------------------------------------------------------------
TELEMETRY: Execution completed in 1.4ms // Memory: 1.2MB // ExitCode: 0`;
        }
    },
    gmv: {
        title: "Multi-Channel Sales & GMV Aggregation",
        code: `# Multi-Channel Retail GMV Breakdown
channels = {
    "E-Commerce Web": {"orders": 4820, "aov": 42.50, "growth": "+18.2%"},
    "Mobile App":     {"orders": 6910, "aov": 38.20, "growth": "+27.4%"},
    "Marketplace":    {"orders": 3150, "aov": 51.00, "growth": "+9.1%"}
}

total_gmv = sum(c["orders"] * c["aov"] for c in channels.values())
print(f"Aggregated Gross Merchandise Value: \${total_gmv:,.2f}")`,
        execute: () => {
            return `[PAYLOAD_EXECUTION_SUCCESS] // ENGINE: SQL_ANALYTICS_CORE
-------------------------------------------------------------
MULTI-CHANNEL SALES AGGREGATION (CURRENT QUARTER):
CHANNEL           ORDERS       AOV ($)      GMV ($)         SHARE
• E-Commerce Web  4,820        $42.50       $204,850.00     38.6%
• Mobile App      6,910        $38.20       $263,962.00     49.7%
• Marketplace     3,150        $51.00       $160,650.00     30.2%
-------------------------------------------------------------
TOTAL AGGREGATED GMV: $629,462.00
DOMINANT GROWTH DRIVER: Mobile App (+27.4% YoY)
REPORTING STATUS: Weekly stakeholder dashboards updated.
-------------------------------------------------------------
TELEMETRY: Execution completed in 0.9ms // Queries: 3 // ExitCode: 0`;
        }
    },
    anomaly: {
        title: "Statistical Anomaly Detection (Z-Score)",
        code: `# Statistical Anomaly Detection (Z-Score Threshold = 2.0)
latency_ms = [14, 15, 12, 16, 14, 18, 142, 13, 15, 12, 198, 14, 15]

mean = sum(latency_ms) / len(latency_ms)
variance = sum((x - mean) ** 2 for x in latency_ms) / len(latency_ms)
std_dev = variance ** 0.5
anomalies = [x for x in latency_ms if abs(x - mean) / std_dev > 2.0]

print(f"Sample Mean: {mean:.2f}ms | StdDev: {std_dev:.2f}ms")
print(f"Anomalies Detected: {anomalies}")`,
        execute: () => {
            return `[PAYLOAD_EXECUTION_SUCCESS] // ENGINE: NUMPY_ML_CORE
-------------------------------------------------------------
SAMPLE_SIZE: 13 OBSERVATIONS
STATISTICAL PARAMETERS:
  • Sample Mean (μ):             38.69 ms
  • Standard Deviation (σ):      58.41 ms
  • Outlier Sensitivity:         Z > 2.0 Sigma

FLAGGED ANOMALOUS TELEMETRY NODES:
  [!] INDEX 06: 142 ms  (Z-Score: +1.77 σ - Warning)
  [!] INDEX 10: 198 ms  (Z-Score: +2.73 σ - CRITICAL OUTLIER)

ROOT CAUSE ANALYSIS:
Temporary upstream rate-limit during LangGraph multi-agent recursive traversal.
Fallback caching mitigations verified stable.
-------------------------------------------------------------
TELEMETRY: Execution completed in 1.1ms // Convergence: TRUE // ExitCode: 0`;
        }
    }
};

export function loadWorkbenchPreset(presetKey) {
    const preset = WORKBENCH_PRESETS[presetKey];
    if (!preset) return;
    const editor = /** @type {HTMLTextAreaElement | null} */ (document.getElementById('workbench-editor'));
    const output = document.getElementById('workbench-output');
    if (editor) editor.value = preset.code;
    if (output) output.textContent = `[PRESET_LOADED]: ${preset.title}. Click EXECUTE_PAYLOAD or press Ctrl+Enter.`;
    document.querySelectorAll('.workbench-preset-chip').forEach(chip => {
        chip.classList.toggle('active', chip.getAttribute('data-preset') === presetKey);
    });
    if (typeof window.AudioEngine !== 'undefined') window.AudioEngine.play('beep');
}

export function runWorkbenchCode() {
    const editor = /** @type {HTMLTextAreaElement | null} */ (document.getElementById('workbench-editor'));
    const output = document.getElementById('workbench-output');
    if (!editor || !output) return;

    if (typeof window.AudioEngine !== 'undefined') window.AudioEngine.play('type');
    output.innerHTML = '<span class="text-warning font-mono small">[COMPILING_PAYLOAD] Executing analytical algorithms...</span>';

    setTimeout(() => {
        const text = editor.value.toLowerCase();
        let resultText = '';
        if (text.includes('retention') || text.includes('churn')) {
            resultText = WORKBENCH_PRESETS.churn.execute();
        } else if (text.includes('gmv') || text.includes('channel') || text.includes('sales')) {
            resultText = WORKBENCH_PRESETS.gmv.execute();
        } else if (text.includes('anomaly') || text.includes('z-score') || text.includes('std_dev')) {
            resultText = WORKBENCH_PRESETS.anomaly.execute();
        } else {
            const lines = editor.value.split('\n').filter(l => l.trim().length > 0);
            resultText = `[PAYLOAD_EXECUTION_SUCCESS] // CUSTOM SCRIPT EVALUATED
-------------------------------------------------------------
INPUT: ${lines.length} lines parsed.
OUTPUT STREAM:
  Filtered evaluation finished with zero syntax exceptions.
  Variables mapped to local execution context.
  [OK] Data structures verified against schema.
-------------------------------------------------------------
TELEMETRY: Executed in 1.0ms // Status: NOMINAL`;
        }
        output.innerHTML = `<pre class="mb-0 text-success font-mono small" style="white-space: pre-wrap; word-break: break-word;">${escapeHtml(resultText)}</pre>`;
        if (typeof window.AudioEngine !== 'undefined') window.AudioEngine.play('beep');
    }, 250);
}

export function executeQuickCommand(cmd) {
    const bottomInput = /** @type {HTMLInputElement | null} */ (document.getElementById('bottom-terminal-input'));
    if (bottomInput) {
        bottomInput.value = cmd;
        const e = new KeyboardEvent('keypress', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true });
        bottomInput.dispatchEvent(e);
        bottomInput.focus();
    }
}

export function initTerminal() {
    const input = document.getElementById('terminal-input');
    const output = document.getElementById('terminal-output');
    const bottomInput = document.getElementById('bottom-terminal-input');
    const bottomOutput = document.getElementById('bottom-terminal-output');
    const trigger = document.getElementById('statusTerminalTrigger');

    if (trigger) trigger.addEventListener('click', toggleBottomTerminal);
    startTelemetryStreams();

    const editor = document.getElementById('workbench-editor');
    if (editor) {
        editor.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                runWorkbenchCode();
            }
        });
    }

    const handleTerminalInput = (targetInput, targetOutput, prompt = "$") => {
        if (!targetInput || !targetOutput) return;

        targetInput.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                const val = targetInput.value.trim().toLowerCase();
                const match = Object.keys(terminalCommands).find(c => c.startsWith(val));
                if (match) targetInput.value = match;
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    targetInput.value = commandHistory[commandHistory.length - 1 - historyIndex];
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (historyIndex > -1) {
                    historyIndex--;
                    targetInput.value = historyIndex === -1 ? '' : commandHistory[commandHistory.length - 1 - historyIndex];
                }
            }
        });

        targetInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const rawInput = targetInput.value.trim();
                const parts = rawInput.split(' ');
                const cmd = parts[0].toLowerCase();
                const args = parts.slice(1);

                if (rawInput) {
                    commandHistory.push(rawInput);
                    historyIndex = -1;
                }

                const cmdLine = document.createElement('div');
                cmdLine.className = 'terminal-line';
                cmdLine.innerHTML = `<span class="terminal-prompt">${prompt}</span> <span class="terminal-cmd">${escapeHtml(rawInput)}</span>`;
                targetOutput.appendChild(cmdLine);

                if (window.isWritingMode && cmd !== 'save' && cmd !== 'abort') {
                    window.terminalBuffer += (window.terminalBuffer ? " " : "") + rawInput;
                    const logLine = document.createElement('div');
                    logLine.className = 'terminal-line opacity-75';
                    logLine.textContent = `  >> ${rawInput}`;
                    targetOutput.appendChild(logLine);
                } else if (terminalCommands[cmd]) {
                    const response = terminalCommands[cmd](args);
                    if (response === 'CLEAR') {
                        targetOutput.innerHTML = '';
                    } else {
                        const respLine = document.createElement('div');
                        respLine.className = 'terminal-line terminal-response';
                        respLine.textContent = response;
                        targetOutput.appendChild(respLine);
                    }
                } else if (cmd) {
                    const errLine = document.createElement('div');
                    errLine.className = 'terminal-line terminal-error';
                    errLine.style.color = '#ef4444';
                    errLine.textContent = `[CMD_NOT_FOUND]: ${cmd}`;
                    targetOutput.appendChild(errLine);
                }

                targetInput.value = '';
                targetOutput.scrollTop = targetOutput.scrollHeight;
                if (typeof window.AudioEngine !== 'undefined') window.AudioEngine.play('beep');
            }
        });
    };

    if (input && output) handleTerminalInput(input, output, "sajid@portfolio:~$");
    if (bottomInput && bottomOutput) handleTerminalInput(bottomInput, bottomOutput, "PS C:\\Users\\Sajid>");
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
