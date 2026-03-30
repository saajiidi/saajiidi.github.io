/**
 * AI ORACLE - CHAT BOT LOGIC
 * Features a reactive, knowledge-based assistant for the portfolio.
 */

let userTelemetry = { ip: "UNKNOWN", os: "DETECTION_FAILED" };

async function fetchUserTelemetry() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        userTelemetry.ip = data.ip;
    } catch (e) { console.log('IP_FETCH_BYPASS_DETECTED'); }

    const osMatch = navigator.userAgent.match(/\(([^)]+)\)/);
    if (osMatch) userTelemetry.os = osMatch[1];
}

const KNOWLEDGE_GROUPS = {
    "edu": {
        keys: ["education", "study", "university", "school", "degree", "acad", "grad", "edu"],
        response: () => {
            return "Dossier: Education. Sajid holds a BSc in CSE from North South University. He also pursued an EMBA at Dhaka University and is currently completing a PGD in Data Science at ABP.";
        }
    },
    "exp": {
        keys: ["experience", "work", "job", "career", "history", "position", "company", "exp"],
        response: () => {
            if (window.DATA && window.DATA.experiences) {
                const latest = window.DATA.experiences[0];
                return `Current Assignment: ${latest.title} at ${latest.company}. Past ops at Daraz (Alibaba Group) and Thriving Skills. Total experience: 5+ years in Data & BI.`;
            }
            return "Experience Intel: Leading BI Analyst with history at DEEN Commerce, Daraz, and NZ TEX Group.";
        }
    },
    "who": {
        keys: ["who", "identity", "sajid"],
        response: "Target Profile: Sajid Islam. Status: Active. Profession: Data Scientist & BI Analyst. Mission: Transforming datasets into business growth."
    },
    "what": {
        keys: ["what", "does", "role", "specialty"],
        response: "Capability Report: BI Development (Power BI/Tableau), Data Engineering (Python/SQL), and MLOps. Architect of several automated retail dashboards."
    },
    "where": {
        keys: ["where", "location", "from", "station"],
        response: "Location Tracking: Stationed in Dhaka, Bangladesh. Operational across Dhaka Grid 02."
    },
    "hi": {
        keys: ["hi", "hello", "hey", "greetings"],
        response: "Uplink stable. Mission Oracle v3.6 at your service. Enter query (e.g., 'exp' or 'edu')."
    }
};

function initAiChat() {
    const toggle = document.getElementById('aiChatToggle');
    const container = document.getElementById('aiChatContainer');
    const closeBtn = document.getElementById('closeAiChat');
    const input = document.getElementById('aiChatInput');
    const sendBtn = document.getElementById('sendAiMessage');
    const body = document.getElementById('aiChatBody');

    if (!toggle || !container) return;

    fetchUserTelemetry().then(() => {
        addMessage(`[SYSTEM_SCAN_COMPLETE] IP: ${userTelemetry.ip} // OS: ${userTelemetry.os}`, 'system');
    });

    toggle.addEventListener('click', () => {
        container.classList.toggle('active');
        if (typeof AudioEngine !== 'undefined') AudioEngine.play('click');
        const ping = toggle.querySelector('.ping-dot');
        if (ping) ping.style.display = 'none';
    });

    closeBtn.addEventListener('click', () => {
        container.classList.remove('active');
    });

    const sendMessage = () => {
        const text = input.value.trim().toLowerCase();
        if (!text) return;

        addMessage(text, 'user');
        input.value = '';

        setTimeout(() => {
            let response = null;

            for (let group in KNOWLEDGE_GROUPS) {
                if (KNOWLEDGE_GROUPS[group].keys.some(key => text.includes(key))) {
                    response = typeof KNOWLEDGE_GROUPS[group].response === 'function' 
                        ? KNOWLEDGE_GROUPS[group].response() 
                        : KNOWLEDGE_GROUPS[group].response;
                    break;
                }
            }

            if (response) {
                addMessage(response, 'bot');
            } else {
                // [NEURAL_LINK_OVERRIDE] - V2 Dual-Uplink
                const fallbackText = "[QUERY_OVERFLOW]: Local intel exhausted. Initiating external neural bridge. Select your uplink protocol:";
                addMessage(fallbackText, 'bot', true);
                
                setTimeout(() => {
                    const btnContainer = document.createElement('div');
                    btnContainer.className = 'ai-message bot-action d-flex flex-column gap-2';
                    
                    const chatGptPrompt = encodeURIComponent(`I'm exploring Sajid Islam's Portfolio. 
                    Main Portfolio: https://saajiidi.github.io 
                    Dashboard: https://sajid-ul-islam.vercel.app 
                    GitHub: https://github.com/saajiidi 
                    LinkedIn: https://linkedin.com/in/sajidislamchowdhury
                    Please provide detailed analysis on his Data Science and BI expertise.`);

                    btnContainer.innerHTML = `
                        <button class="btn-theme-toggle w-100 mb-1" onclick="openPortfolioBridge(null, 'https://chatgpt.com/?q=${chatGptPrompt}')">
                            <i class="fas fa-brain me-2"></i> [AI_DOSSIER_UPLINK]
                        </button>
                        <button class="btn-theme-toggle w-100" onclick="openPortfolioBridge(null, 'https://wa.me/+8801824526054')">
                            <i class="fas fa-user-secret me-2"></i> [HUMAN_COMMAND_UPLINK]
                        </button>
                    `;
                    body.appendChild(btnContainer);
                    body.scrollTop = body.scrollHeight;
                }, 400);
            }
            if (typeof AudioEngine !== 'undefined') AudioEngine.play('beep');
        }, 600);
    };

    const addMessage = (text, sender, isSystem = false) => {
        const msg = document.createElement('div');
        msg.className = `ai-message ${sender} ${isSystem ? 'system' : ''}`;
        msg.textContent = text;
        body.appendChild(msg);
        body.scrollTop = body.scrollHeight;
    };

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}

// Auto-run when DOM is ready (or manual call from index.html)
window.addEventListener('DOMContentLoaded', initAiChat);
