/**
 * TACTICAL SHELL v5.2
 * Multi-threaded interactive terminal for situational awareness
 */

let commandHistory = [];
let historyIndex = -1;
let telemetryIntervals = [];

function toggleBottomTerminal() {
    const term = document.getElementById('bottomTerminal');
    if (term) term.classList.toggle('active');
    if (typeof AudioEngine !== 'undefined') AudioEngine.play('beep');
}

window.switchTerminalTab = (tabId) => {
    document.querySelectorAll('.terminal-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.terminal-tab-content').forEach(c => c.classList.remove('active'));
    
    // Find tab by content text or ID
    const tabs = document.querySelectorAll('.terminal-tab');
    const activeTab = Array.from(tabs).find(t => t.textContent.toLowerCase().includes(tabId));
    const activeContent = document.getElementById(`tab-${tabId}`);
    
    if (activeTab) activeTab.classList.add('active');
    if (activeContent) activeContent.classList.add('active');
    if (typeof AudioEngine !== 'undefined') AudioEngine.play('click');
};

function startTelemetryStreams() {
    const debug = document.getElementById('debug-stream');
    const output = document.getElementById('output-stream');
    if (!debug || !output) return;

    // Clear existing intervals to prevent memory leaks
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

// Cleanup function to prevent memory leaks
function cleanupTerminal() {
    telemetryIntervals.forEach(interval => clearInterval(interval));
    telemetryIntervals = [];
}

// Add cleanup on page unload
window.addEventListener('beforeunload', cleanupTerminal);

const terminalCommands = {
    help: () => `CMD_DIRECTORY:
  neofetch       System summary & specs
  ls             List project archive nodes
  cat [id]       Display project dossier
  whoami         Operative identification
  status         System diagnostics
  clearance      Elevate security clearance
  write [title]  Start blog editor mode
  save           Commit buffer to Intel Reports
  abort          Clear buffer & exit editor
  run [js]       Execute tactical code
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
        let files = window.DATA.projects.map(p => `[NODE] ${p.id}`);
        if (args && args.includes('-a')) {
            const secrets = Object.keys(window.MISSION_SECRETS || {}).map(s => `[HIDDEN] .${s}`);
            files = [...files, ...secrets];
        }
        return files.join('  ');
    },

    cat: (args) => {
        if (!args || args.length === 0) return "USAGE: cat [id]";
        const fileId = args[0].replace(/^\./, '');
        
        // Check Mission Secrets first
        if (window.MISSION_SECRETS && window.MISSION_SECRETS[fileId]) {
            return `[LOCAL_DOSSIER]: ${fileId}\nINTEL: ${window.MISSION_SECRETS[fileId]}`;
        }

        const project = window.DATA.projects.find(p => p.id.toLowerCase() === fileId.toLowerCase());
        if (!project) return `[FILE_NOT_FOUND]: ${args[0]}`;
        return `[PROJECT_NODE]: ${project.title}\nSTATUS: DEPLOYED\nTECH: ${project.tools}\nINTEL: ${project.description}`;
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

    run: (args) => {
        if (!args || args.length === 0) return "USAGE: run [javascript_code]";
        try {
            const code = args.join(' ');
            const result = eval(code);
            return `[EXECUTION_RESULT]: ${result}`;
        } catch (e) {
            return `[EXECUTION_ERROR]: ${e.message}`;
        }
    },

    abort: () => {
        window.isWritingMode = false;
        window.terminalBuffer = "";
        return "[ABORTED]: Buffer cleared. Tactical session resumed.";
    },

    exit: () => {
        toggleBottomTerminal();
        return "TERMINATING...";
    }
};

function initTerminal() {
    const input = document.getElementById('terminal-input');
    const output = document.getElementById('terminal-output');
    const bottomInput = document.getElementById('bottom-terminal-input');
    const bottomOutput = document.getElementById('bottom-terminal-output');
    const trigger = document.getElementById('statusTerminalTrigger');

    if (trigger) trigger.addEventListener('click', toggleBottomTerminal);
    startTelemetryStreams();

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
                if (typeof AudioEngine !== 'undefined') AudioEngine.play('beep');
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

document.addEventListener('DOMContentLoaded', initTerminal);
