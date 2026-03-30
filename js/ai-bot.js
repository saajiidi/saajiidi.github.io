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

const KNOWLEDGE_BASE = {
    "projects": "Scanning mission logs... I recommend checking out 'VS Code Portfolio' or 'Automation Pivot' for high-impact intel.",
    "experience": "The operative has been active at DEEN Commerce, Daraz, and Thriving Skills as a BI Analyst.",
    "skills": "Primary skill clusters: Python, SQL, Power BI, and Machine Learning.",
    "contact": "Secure uplink can be established via the terminal (cmd: 'email') or the contact link.",
    "who": "I am the AI Oracle [v3.1], your tactical debrief assistant for Sajid Islam's profesional dataset.",
    "hi": "Greetings, Operative. Intelligence uplink stable.",
    "hello": "Greetings, Operative. Ready for debrief?",
    "ip": () => `Your current network node: ${userTelemetry.ip}`,
    "os": () => `Detected operating environment: ${userTelemetry.os}`,
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
        addMessage(`[SYSTEM_SCAN_COMPLETED] Target IP: ${userTelemetry.ip} // OS: ${userTelemetry.os}`, 'system');
    });

    toggle.addEventListener('click', () => {
        container.classList.toggle('active');
        if (typeof AudioEngine !== 'undefined') AudioEngine.play('click');
        const ping = toggle.querySelector('.ping-dot');
        if (ping) ping.style.display = 'none';
    });

    closeBtn.addEventListener('click', () => {
        container.classList.remove('active');
        if (typeof AudioEngine !== 'undefined') AudioEngine.play('click');
    });

    const sendMessage = () => {
        const text = input.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        input.value = '';

        setTimeout(() => {
            const query = text.toLowerCase();
            let response = "Intel inconclusive. Knowledge base for that query restricted. Try 'projects' or 'skills'.";

            for (let key in KNOWLEDGE_BASE) {
                if (query.includes(key)) {
                    response = typeof KNOWLEDGE_BASE[key] === 'function' ? KNOWLEDGE_BASE[key]() : KNOWLEDGE_BASE[key];
                    break;
                }
            }

            addMessage(response, 'bot');
            if (typeof AudioEngine !== 'undefined') AudioEngine.play('beep');
        }, 600);
    };

    const addMessage = (text, sender) => {
        const msg = document.createElement('div');
        msg.className = `ai-message ${sender}`;
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
