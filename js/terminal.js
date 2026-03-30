/**
 * TERMINAL CONTACT SYSTEM
 * Interactive HUD elements for direct communication protocols
 */

const terminalCommands = {
    help: () => `Available commands:
  help              Show this help message
  whoami            Display operative identity
  projects          List all active projects
  status            System diagnostic check
  email             Copy email to clipboard
  phone             Show phone number
  whatsapp          Open WhatsApp chat
  schedule          Schedule a meeting
  flush             Clear local cache & reset PWA
  update            Check for tactical updates
  clear             Reset terminal
  exit              Close tactical terminal`,

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
    if (!input || !output) return;

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const val = input.value.trim().toLowerCase();
            if (!val) return;
            const match = Object.keys(terminalCommands).find(c => c.startsWith(val));
            if (match) input.value = match;
            if (typeof AudioEngine !== 'undefined') AudioEngine.play('click');
        }
    });

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const cmd = input.value.trim().toLowerCase();

            // Add command to output
            const cmdLine = document.createElement('div');
            cmdLine.className = 'terminal-line';
            cmdLine.innerHTML = `<span class="terminal-prompt">$</span> <span class="terminal-cmd">${escapeHtml(input.value)}</span>`;
            output.appendChild(cmdLine);

            // Execute command
            if (terminalCommands[cmd]) {
                const response = terminalCommands[cmd]();
                if (response === 'CLEAR') {
                    output.innerHTML = '';
                } else {
                    const respLine = document.createElement('div');
                    respLine.className = 'terminal-line terminal-response';
                    respLine.textContent = response;
                    output.appendChild(respLine);
                }
            } else if (cmd) {
                const errLine = document.createElement('div');
                errLine.className = 'terminal-line terminal-response';
                errLine.style.color = '#ef4444';
                errLine.textContent = `Command not found: ${cmd}. Type 'help' for available commands.`;
                output.appendChild(errLine);
            }

            input.value = '';
            output.scrollTop = output.scrollHeight;
        }
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
