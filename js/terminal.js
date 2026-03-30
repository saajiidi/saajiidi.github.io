/**
 * TERMINAL CONTACT SYSTEM
 * Interactive HUD elements for direct communication protocols
 */

let commandHistory = [];
let historyIndex = -1;

const terminalCommands = {
    link_gemini: (args) => {
        if (!args || args.length === 0) return "[ERROR]: Missing credentials. Usage: link_gemini [KEY]";
        localStorage.setItem('GEMINI_UPLINK_KEY', args[0]);
        if (typeof AudioEngine !== 'undefined') AudioEngine.play('beep');
        return "[SUCCESS]: Gemini Neural Uplink established. Oracle v4.0 engaged.";
    },

    unlink_gemini: () => {
        localStorage.removeItem('GEMINI_UPLINK_KEY');
        return "[SYSTEM]: Gemini Uplink severed. Reverting to local rule-based intelligence.";
    },

    help: () => `Available commands:
  help              Show this help message
  whoami            Display session & operative intel
  ls                List active project nodes
  cat [id]          Display project dossier details
  neofetch          Show stylized profile & system stats
  date              View Dhaka station time
  echo [msg]        Print message to terminal
  sudo              Execute as superuser
  pwd               Print working directory
  clearance         Elevate security clearance
  locate            Ping tactical GPS node
  oracle            Uplink to AI Chat Bot
  status            System diagnostic check
  link_gemini [key] Securely establish AI API uplink
  clear             Reset terminal
  exit              Close tactical terminal
  email | phone     Contact metadata
  whatsapp          Open direct chat`,

    ls: () => {
        if (!window.DATA || !window.DATA.projects) return 'Project database offline.';
        return window.DATA.projects.map(p => `[NODE] ${p.id}`).join('  ');
    },

    cat: (args) => {
        if (!args || args.length === 0) return "Usage: cat [project_id]";
        const project = window.DATA.projects.find(p => p.id.toLowerCase() === args[0].toLowerCase());
        if (!project) return `[FILE_NOT_FOUND]: ${args[0]}`;
        return `DOSSIER: ${project.title}
STATUS: DEPLOYED
TECH: ${project.tools}
INTEL: ${project.description}`;
    },

    neofetch: () => `      :::::::::     USER: Sajid Islam
  ::::::::::::::::  OS: Tactical HUD v5.0 [Linux 6.2.0-ext]
 :::: /     \\ ::::  HOST: Dhaka_Grid_02_Node
 :::: |     | ::::  UPTIME: ${Math.floor(performance.now() / 1000)}s
 :::: \\     / ::::  SKILLS: Python, SQL, BI, ML
  ::::::::::::::::  SHELL: bash 5.1
      :::::::::     STATUS: ACTIVE_FOR_OPS`,

    date: () => {
        const dhakaTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Dhaka"});
        return `STATION_TIME: ${dhakaTime}`;
    },

    echo: (args) => args.join(' '),

    sudo: () => "[PERMISSION_DENIED]: Operative is already at maximum privilege. Sudo unnecessary.",

    pwd: () => "/home/sajid/mission_dashboard",

    matrix: () => {
        document.body.classList.add('glitch-active');
        setTimeout(() => document.body.classList.remove('glitch-active'), 1500);
        return "CRITICAL_ERROR: Matrix leak detected. protocol 404 engaged.";
    },

    clearance: () => {
        const val = document.querySelector('.status-value');
        if (val) {
            val.textContent = "LVL_10_ELITE_OPERATIVE";
            val.classList.add('text-primary', 'pulse');
        }
        return "[SYSTEM_OVERRIDE]: Clearance level elevated to Level 10. Dossiers unlocked.";
    },

    locate: () => {
        if (typeof AudioEngine !== 'undefined') AudioEngine.play('beep');
        return "[GPS_UPLINK]: Latency 14ms... Target: Bangladesh [23.6850° N, 90.3563° E]. Uplink stable.";
    },

    oracle: () => {
        const chat = document.getElementById('aiChatContainer');
        if (chat) chat.classList.add('active');
        return "AI Oracle uplink requested. Terminal and Chat synchronized.";
    },

    whoami: () => `IDENTITY_CONFIRMED: SAJID ISLAM
ROLE: DATA SCIENTIST // BUSINESS ANALYST
LOCATION: DHAKA_GRID_02
CLEARANCE: LEVEL_5_ADMIN
STATUS: ACTIVE_FOR_OPS`,

    projects: () => {
        if (!window.DATA || !window.DATA.projects) return 'Project database offline.';
        return 'ACTIVE_PROJECTS:\n' + window.DATA.projects.map(p => `> [${p.id}] ${p.title}`).join('\n');
    },

    status: () => `SYSTEM_DIAGN_V3: OK
DATA_GRID: SYNCED
ENCRYPTION: AES_256_ACTIVE
CACHE_V: TACTICAL_V2
BATTERY: 100% (EXTERNAL_CORE)
UPTIME: ${Math.floor(performance.now() / 1000)}s`,

    flush: () => {
        if ('caches' in window) {
            caches.keys().then(names => {
                for (let name of names) caches.delete(name);
            });
        }
        localStorage.clear();
        sessionStorage.clear();
        setTimeout(() => window.location.reload(true), 1000);
        return 'PURGING_CACHE... SYSTEM_REBOOT_INITIATED.';
    },

    update: () => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistration().then(reg => {
                if (reg) reg.update();
            });
        }
        return 'FETCHING_LATEST_INTEL_PACKETS...';
    },

    email: () => {
        navigator.clipboard.writeText('sajid.islam.chowdhury@gmail.com');
        if (typeof AudioEngine !== 'undefined') AudioEngine.play('beep');
        return 'SECURE_EMAIL copied to clipboard.';
    },

    phone: () => 'SIGNAL_INTEL: +880 182 452 6054',

    whatsapp: () => {
        window.open('https://wa.me/+8801824526054', '_blank');
        return 'Initializing direct link...';
    },

    schedule: () => {
        window.open('https://calendly.com/sajidislamchowdhury', '_blank');
        return 'Redirecting to booking node...';
    },

    clear: () => 'CLEAR',

    exit: () => {
        const modalEl = document.getElementById('terminalContactModal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
        return 'Closing terminal...';
    }
};

function initTerminal() {
    const input = document.getElementById('terminal-input');
    const output = document.getElementById('terminal-output');
    const bottomInput = document.getElementById('bottom-terminal-input');
    const bottomOutput = document.getElementById('bottom-terminal-output');
    const trigger = document.getElementById('statusTerminalTrigger');

    if (trigger) trigger.addEventListener('click', toggleBottomTerminal);

    const handleTerminalInput = (targetInput, targetOutput) => {
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

                // Add command to output
                const cmdLine = document.createElement('div');
                cmdLine.className = 'terminal-line';
                cmdLine.innerHTML = `<span class="terminal-prompt">$</span> <span class="terminal-cmd">${escapeHtml(rawInput)}</span>`;
                targetOutput.appendChild(cmdLine);

                // Execute command
                if (terminalCommands[cmd]) {
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
                    const errorLine = document.createElement('div');
                    errorLine.className = 'terminal-line terminal-error';
                    errorLine.style.color = '#ef4444';
                    errorLine.textContent = `[COMMAND_NOT_FOUND]: ${cmd}. Type 'help' for available commands.`;
                    targetOutput.appendChild(errorLine);
                }

                targetInput.value = '';
                targetOutput.scrollTop = targetOutput.scrollHeight;
                if (typeof AudioEngine !== 'undefined') AudioEngine.play('beep');
            }
        });
    };

    if (input && output) handleTerminalInput(input, output);
    if (bottomInput && bottomOutput) handleTerminalInput(bottomInput, bottomOutput);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', initTerminal);
