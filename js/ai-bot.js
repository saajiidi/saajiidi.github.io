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
    "who": "Sajid Islam is a Data Scientist and Business Analyst specializing in transforming complex datasets into strategic growth. Currently leading Business Strategy at DEEN Commerce.",
    "what": "Sajid specializes in BI Development (Power BI/Tableau), Data Engineering (Python/SQL), and Machine Learning. He builds operational tools like the 'Automation Pivot' and 'Streamlit Hub'.",
    "where": "The operative is currently stationed in Dhaka, Bangladesh (Dhaka Grid).",
    "from": "Sajid is from Dhaka, Bangladesh. He holds a degree in Computer Science from North South University.",
    "why": "Objective: To leverage analytical precision and technical expertise to uncover actionable business insights and drive data-driven decision making.",
    "projects": "Accessing mission logs... I recommend '[STREAMLIT_HUB]' for operational tools or 'VS Code Portfolio' for React work.",
    "experience": "Operative Sajid has driven significant growth at Daraz (Alibaba Group) and is currently architecting BI systems at DEEN Commerce.",
    "skills": "Primary combat skills: Python, SQL, Power BI, and Next.js.",
    "hi": "Intelligence uplink stable. How can I assist with your situational awareness?",
    "hello": "Uplink verified. Ready for debrief on Sajid's latest mission logs?",
    "ip": () => `Tactical Node ID: ${userTelemetry.ip}`,
    "os": () => `Detected Environment: ${userTelemetry.os}`,
    "system_scan": () => `[SCAN_LOG]: IP: ${userTelemetry.ip} // OS: ${userTelemetry.os} // STATUS: OPTIMAL`,
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
