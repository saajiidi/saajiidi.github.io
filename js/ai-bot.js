/**
 * AI ORACLE - CHAT BOT LOGIC (Secured)
 * Features a reactive, knowledge-based assistant for the portfolio.
 * SECURITY: All API keys are provided via localStorage only.
 */

import { LOCAL_INTEL } from './data/index.js';

const userTelemetry = { ip: "UNKNOWN", os: "DETECTION_FAILED" };

(async function() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        userTelemetry.ip = data.ip;
    } catch { /* IP fetch bypassed */ }

    const osMatch = navigator.userAgent.match(/\(([^)]+)\)/);
    if (osMatch) userTelemetry.os = osMatch[1];
})();

// SECURITY: No default API keys are stored here.
const DEFAULT_GEMINI_KEY = null;
const DEFAULT_OPENAI_KEY = null;

// --- MISSION_INTEL_DOSSIER ---

const KNOWLEDGE_GROUPS = {
    "hi": {
        keys: ["hi", "hello", "hey", "greetings", "yo", "u there", "sup", "good morning", "good evening"],
        response: () => `Hey there! I'm Sajid's AI Oracle. I have intel on his career, skills, projects, and more. What would you like to know?`
    },
    "bye": {
        keys: ["bye", "goodbye", "see you", "thanks", "thank you", "thx"],
        response: () => `Mission complete. Feel free to reach out anytime — Sajid is always open to new connections and opportunities. Have a great day!`
    },
    "edu": {
        keys: ["education", "study", "university", "school", "degree", "acad", "grad", "edu", "qualification", "college"],
        response: () => `📚 ACADEMIC DOSSIER:\n\n${LOCAL_INTEL.education.join('\n')}`
    },
    "exp": {
        keys: ["experience", "work", "job", "career", "history", "position", "company", "exp", "past", "track record", "resume"],
        response: () => `💼 CAREER HISTORY:\n\n${LOCAL_INTEL.experience.join('\n')}`
    },
    "who": {
        keys: ["who", "identity", "sajid", "himself", "profile", "about", "introduce"],
        response: `🎯 TARGET PROFILE:\n\n${LOCAL_INTEL.profile}\n\nHe's passionate about building products, automating workflows, and solving business problems with technology.`
    },
    "skill": {
        keys: ["skill", "tech", "stack", "know", "tool", "language", "python", "sql", "powerbi", "tableau", "technologies", "proficiency"],
        response: `⚡ TECHNICAL ARSENAL:\n\n${LOCAL_INTEL.skills}`
    },
    "project": {
        keys: ["project", "work", "featured", "ops", "made", "build", "portfolio", "app", "application"],
        response: () => `🚀 OPERATIONS LOG:\n\n${LOCAL_INTEL.projects.map((p, i) => `${i + 1}. ${p}`).join('\n')}`
    },
    "contact": {
        keys: ["contact", "email", "phone", "whatsapp", "reach", "connect", "linkedin", "github", "social"],
        response: () => `📞 COMM UPLINK:\n\n📧 Email: ${LOCAL_INTEL.contact.email}\n📱 WhatsApp: ${LOCAL_INTEL.contact.whatsapp}\n✈️ Telegram: ${LOCAL_INTEL.contact.telegram}\n💼 LinkedIn: ${LOCAL_INTEL.contact.linkedin}\n🐙 GitHub: ${LOCAL_INTEL.contact.github}\n📊 Kaggle: ${LOCAL_INTEL.contact.kaggle}\n🤗 HuggingFace: ${LOCAL_INTEL.contact.huggingface}`
    },
    "cert": {
        keys: ["certificate", "certification", "cert", "course", "training", "credential"],
        response: () => `🏆 CERTIFICATIONS:\n\n${LOCAL_INTEL.certifications}`
    },
    "learn": {
        keys: ["learning", "learning track", "currently learning", "study", "upskill", "course"],
        response: () => `📖 CURRENT LEARNING TRACK:\n\n${LOCAL_INTEL.learning.join('\n')}`
    },
    "hire": {
        keys: ["hire", "hiring", "available", "freelance", "opportunity", "collaboration", "job", "role", "remote"],
        response: () => `🤝 AVAILABILITY STATUS:\n\n${LOCAL_INTEL.availability}\n\nBest way to connect:\n📱 WhatsApp: ${LOCAL_INTEL.contact.whatsapp}\n✈️ Telegram: ${LOCAL_INTEL.contact.telegram}\n📧 Email: ${LOCAL_INTEL.contact.email}`
    },
    "game": {
        keys: ["game", "gaming", "hobby", "hobbies", "play", "favorite game", "free time"],
        response: () => `🎮 OFF-DUTY LOGS:\n\n${LOCAL_INTEL.gaming}`
    },
    "help": {
        keys: ["help", "what can you do", "features", "commands", "options"],
        response: () => `🤖 I can help you with:\n\n• Profile info — "Who is Sajid?"\n• Experience — "Work history"\n• Skills — "Technical skills"\n• Projects — "Show projects"\n• Education — "Education"\n• Certifications — "Certificates"\n• Contact — "How to reach him?"\n• Availability — "Is he available for hire?"\n• Learning — "What is he learning?"\n• Hobbies — "Gaming interests"\n\nOr just ask anything about Sajid's professional background!`
    }
};

// Fuzzy Matching Helper
function fuzzyMatch(input, keys) {
    const threshold = 0.7;
    input = input.toLowerCase();
    for (const key of keys) {
        if (input.includes(key)) return true;
        if (key.length > 3) {
            let matches = 0;
            for (let i = 0; i < input.length; i++) {
                if (key.includes(input[i])) matches++;
            }
            if (matches / key.length > threshold) return true;
        }
    }
    return false;
}

let exchangeCount = 0;
let chatHistory = [];

export const handleSuggestion = (text) => {
    const input = document.getElementById('aiChatInput');
    if (input) {
        input.value = text;
        const sendBtn = document.getElementById('sendAiMessage');
        if (sendBtn) sendBtn.click();
    }
};


export function initAiChat() {
    const toggle = document.getElementById('aiChatToggle');
    const container = document.getElementById('aiChatContainer');
    const closeBtn = document.getElementById('closeAiChat');
    const input = document.getElementById('aiChatInput');
    const sendBtn = document.getElementById('sendAiMessage');
    const body = document.getElementById('aiChatBody');
    const clearBtn = document.getElementById('clearAiChat');

    if (!toggle || !container) return;

    toggle.addEventListener('click', () => {
        container.classList.toggle('active');
        if (container.classList.contains('active')) {
            setTimeout(() => input?.focus(), 300);
        }
    });
    if (closeBtn) closeBtn.addEventListener('click', () => container.classList.remove('active'));

    // Clear chat
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            body.innerHTML = '';
            chatHistory = [];
            exchangeCount = 0;
            const sug = document.getElementById('aiSuggestions');
            if (sug) sug.style.display = '';
            addMessage("Chat cleared. How can I assist you?", 'bot');
        });
    }

    function formatTime() {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    const addMessage = async (text, sender, isSystem = false) => {
        const wrapper = document.createElement('div');
        wrapper.className = `ai-msg-wrapper ai-msg-${sender}`;

        const msg = document.createElement('div');
        msg.className = `ai-message ${sender} ${isSystem ? 'system' : ''}`;
        wrapper.appendChild(msg);

        const time = document.createElement('span');
        time.className = 'ai-msg-time';
        time.textContent = formatTime();
        wrapper.appendChild(time);

        body.appendChild(wrapper);
        body.scrollTop = body.scrollHeight;

        if (sender === 'bot' && !isSystem) {
            await typeWriterEffect(msg, text);
            if (typeof AudioEngine !== 'undefined' && AudioEngine.speak) {
                AudioEngine.speak(text);
            }
        } else {
            msg.textContent = text;
        }
        body.scrollTop = body.scrollHeight;

        chatHistory.push({ text, sender, time: formatTime() });
        return msg;
    };

    function showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'ai-msg-wrapper ai-msg-bot';
        indicator.id = 'typingIndicator';
        indicator.innerHTML = `
            <div class="ai-message bot typing-indicator">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </div>
        `;
        body.appendChild(indicator);
        body.scrollTop = body.scrollHeight;
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) indicator.remove();
    }

    async function typeWriterEffect(element, text) {
        let i = 0;
        while (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            body.scrollTop = body.scrollHeight;
            await new Promise(resolve => setTimeout(resolve, Math.random() * 15 + 20));
        }
    }

    function showQuickActions() {
        const actions = document.createElement('div');
        actions.className = 'ai-quick-actions';
        actions.innerHTML = `
            <button class="ai-quick-btn" onclick="window.open('resume.html', '_blank')">
                <i class="fas fa-file-pdf"></i> Resume
            </button>
            <button class="ai-quick-btn" onclick="window.open('https://wa.me/+8801824526054?text=Hi%20Sajid%2C%20I%20found%20your%20portfolio.', '_blank')">
                <i class="fab fa-whatsapp"></i> WhatsApp
            </button>
            <button class="ai-quick-btn" onclick="window.open('https://t.me/+8801824526054', '_blank')">
                <i class="fab fa-telegram"></i> Telegram
            </button>
            <button class="ai-quick-btn" onclick="window.open('https://github.com/Sajid-ul-Islam', '_blank')">
                <i class="fab fa-github"></i> GitHub
            </button>
            <button class="ai-quick-btn" onclick="window.open('https://www.linkedin.com/in/sajidislamchowdhury/', '_blank')">
                <i class="fab fa-linkedin"></i> LinkedIn
            </button>
        `;
        body.appendChild(actions);
        body.scrollTop = body.scrollHeight;
    }

    const sendMessage = async () => {
        const text = input.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        input.value = '';
        exchangeCount++;

        if (exchangeCount > 5) {
            const sug = document.getElementById('aiSuggestions');
            if (sug) sug.style.display = 'none';
        }

        // Show quick actions after first message
        if (exchangeCount === 1) {
            setTimeout(() => showQuickActions(), 600);
        }

        // 1. LOCAL_INTEL_CHECK
        let localResponse = null;
        for (const group in KNOWLEDGE_GROUPS) {
            if (fuzzyMatch(text, KNOWLEDGE_GROUPS[group].keys)) {
                localResponse = typeof KNOWLEDGE_GROUPS[group].response === 'function' ? KNOWLEDGE_GROUPS[group].response() : KNOWLEDGE_GROUPS[group].response;
                break;
            }
        }

        if (localResponse) {
            showTypingIndicator();
            setTimeout(() => {
                removeTypingIndicator();
                addMessage(localResponse, 'bot');
                if (typeof AudioEngine !== 'undefined') AudioEngine.play('beep');
            }, 600 + Math.random() * 400);
            return;
        }

        // 2. MULTI_MODEL_FALLBACK
        showTypingIndicator();

        // --- Try Gemini Primary ---
        try {
            const geminiKey = localStorage.getItem('GEMINI_UPLINK_KEY') || DEFAULT_GEMINI_KEY;
            if (!geminiKey) throw new Error("NO_GEMINI_KEY");

            const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-goog-api-key': geminiKey
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: `System Context: You are the AI Oracle for Sajid Islam. Profile: ${LOCAL_INTEL.profile}. Skills: ${LOCAL_INTEL.skills}. Respond in a professional, helpful tone. Keep responses concise. Query: ${text}` }] }]
                })
            });

            removeTypingIndicator();
            if (response.status === 403 || response.status === 429) throw new Error("NEURAL_SYNC_LEVEL_EXCEEDED");

            const data = await response.json();
            const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (aiResponse) {
                addMessage(aiResponse, 'bot');
                if (typeof AudioEngine !== 'undefined') AudioEngine.play('beep');
                return;
            }
        } catch { /* Gemini offline, trying OpenAI */ }

        // --- Try OpenAI Secondary ---
        try {
            const oaiKey = localStorage.getItem('OPENAI_UPLINK_KEY') || DEFAULT_OPENAI_KEY;
            if (!oaiKey) throw new Error("NO_OPENAI_KEY");

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${oaiKey}` },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        { role: "system", content: `Identity: Sajid Islam's AI Oracle. Dossier: ${LOCAL_INTEL.profile}. Skills: ${LOCAL_INTEL.skills}. Tone: Professional.` },
                        { role: "user", content: text }
                    ]
                })
            });
            const data = await response.json();
            const aiResponse = data.choices?.[0]?.message?.content;
            if (aiResponse) {
                removeTypingIndicator();
                addMessage(aiResponse, 'bot');
                if (typeof AudioEngine !== 'undefined') AudioEngine.play('beep');
                return;
            }
        } catch { /* OpenAI offline, showing fallback */ }

        removeTypingIndicator();
        addMessage("I don't have a specific answer for that. Here are some things I can help with:", 'bot');
        setTimeout(() => {
            const helpText = document.createElement('div');
            helpText.className = 'ai-message bot';
            helpText.innerHTML = `
                <div class="ai-help-list">
                    <div>Ask about his <strong>experience</strong>, <strong>skills</strong>, or <strong>projects</strong></div>
                    <div>Want to <strong>connect</strong>? Try "contact info"</div>
                    <div>Curious about <strong>availability</strong>? Ask "is he hiring?"</div>
                </div>
            `;
            body.appendChild(helpText);
            body.scrollTop = body.scrollHeight;
        }, 300);
    };

    if (sendBtn) sendBtn.addEventListener('click', sendMessage);
    if (input) input.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });

    // Initialize IntersectionObserver for Context-Aware Chatbot
    if (typeof IntersectionObserver !== 'undefined') {
        const sectionIds = ['about', 'experience', 'education', 'skills', 'projects'];
        const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateChatbotSuggestions(entry.target.id);
                }
            });
        }, { threshold: 0.5 });
        sections.forEach(sec => observer.observe(sec));
    }
}

export function updateChatbotSuggestions(sectionId) {
    const sugContainer = document.getElementById('aiSuggestions');
    if (!sugContainer) return;
    
    let html = '';
    const wALink = `<a href="https://wa.me/+8801824526054?text=Hi%20Sajid%2C%20I%20found%20your%20portfolio%20and%20would%20like%20to%20connect." target="_blank" rel="noopener" class="suggestion-chip suggestion-wa"><i class="fab fa-whatsapp me-1"></i> [CONNECT]</a>`;

    switch(sectionId) {
        case 'about':
            html = `
                <button class="suggestion-chip" onclick="handleSuggestion('Who is Sajid?')">[SHOW_DOSSIER]</button>
                <button class="suggestion-chip" onclick="handleSuggestion('What is his current role?')">[CURRENT_STATUS]</button>
            `;
            break;
        case 'experience':
            html = `
                <button class="suggestion-chip" onclick="handleSuggestion('Tell me about his experience at Daraz')">[DARAZ_LOG]</button>
                <button class="suggestion-chip" onclick="handleSuggestion('What does he do at DEEN Commerce?')">[DEEN_ROLE]</button>
            `;
            break;
        case 'education':
            html = `
                <button class="suggestion-chip" onclick="handleSuggestion('Where did he study?')">[ACADEMICS]</button>
                <button class="suggestion-chip" onclick="handleSuggestion('What certifications does he have?')">[CERTIFICATIONS]</button>
            `;
            break;
        case 'skills':
            html = `
                <button class="suggestion-chip" onclick="handleSuggestion('What are his top technical skills?')">[TECH_STACK]</button>
                <button class="suggestion-chip" onclick="handleSuggestion('Does he know Python and Power BI?')">[CORE_SKILLS]</button>
            `;
            break;
        case 'projects':
            html = `
                <button class="suggestion-chip" onclick="handleSuggestion('Show me his latest projects')">[LATEST_PROJECTS]</button>
                <button class="suggestion-chip" onclick="handleSuggestion('Explain the Streamlit Prototype Hub')">[STREAMLIT_HUB]</button>
            `;
            break;
        default:
            html = `
                <button class="suggestion-chip" onclick="handleSuggestion('Who is Sajid?')">[SHOW_DOSSIER]</button>
                <button class="suggestion-chip" onclick="handleSuggestion('What are his top technical skills?')">[TECH_STACK]</button>
            `;
    }
    sugContainer.innerHTML = html + wALink;
}
