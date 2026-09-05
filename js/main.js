/**
 * MAIN ENTRY POINT - ES Module System
 * Consolidates all portfolio modules with proper imports/exports
 */

// ===== DATA IMPORTS =====
import { 
  DATA, PROFILE_INFO, EXPERIENCES, EDUCATION, PROJECTS, 
  SKILL_GROUPS, BLOG_POSTS, LEARNING_ITEMS, GAMING, STATS,
  FILE_TREE, SOCIAL_LINKS, LOCAL_INTEL,
  PortfolioData
} from './data/index.js';

// ===== AUDIO ENGINE =====
import { AudioEngine } from './audio-engine.js';

// ===== TACTICAL CORE =====
import { 
  glitchEffect, updateThemeIcon, updateSystemHealth, 
  copyEmail, initTelemetryOverlay, SkillsGlobe,
  replayProject, MISSION_SECRETS 
} from './tactical-core.js';

// ===== TACTICAL ENHANCEMENTS =====
import { 
  ScrollGlitchEffect, KeyboardNavigator,
  AnimatedCounters, SkillProgressBars,
  TestimonialsCarousel, ScanlinePulse
} from './tactical-enhancements.js';

// ===== TACTICAL DATA =====
import { 
  initializeTacticalData, renderInfo, renderExperience, 
  renderEducation, renderSkillGroups,
  renderProjects, renderBlogs, renderLearning, renderGaming,
  renderMedia, renderFileTree, fetchGithubRepos,
  decryptDossier, toggleCaseStudy, initializeProjectFilters,
  toggleDecryptAll,
  openCaseStudy, closeCaseStudy,
  toggleTreeSection, toggleMobileSidebar, handleTreeClick,
  runTypewriter
} from './tactical-data.js';

// ===== TERMINAL =====
import { 
  toggleBottomTerminal, minimizeBottomTerminal, maximizeBottomTerminal, switchTerminalTab, startTelemetryStreams,
  runWorkbenchCode, loadWorkbenchPreset, executeQuickCommand,
  cleanupTerminal, initTerminal
} from './terminal.js';

// ===== COMMAND PALETTE =====
import { initCommandPalette, togglePalette } from './command-palette.js';

// ===== SHARED ACCENT SWITCHER =====
import { initAccentSwitcher } from './theme-accent.js';

// ===== FLOATING WIDGETS =====
import { FloatingWidget, initFloatingWidgets, toggleTelemetryWidget } from './floating-widgets.js';

// ===== GITHUB FEED =====
import { initGitHubFeed } from './github-feed.js';

// ===== PORTFOLIO BRIDGE (iframe uplink) =====
import { 
  openPortfolioBridge as openBridge, closePortfolioBridge as closeBridge,
  minimizePortfolioBridge, restorePortfolioBridge, toggleMaximizeBridge,
  initResizableBridge, EXTERNAL_BLOCK_LIST
} from './portfolio-bridge.js';

// ===== WIDGETS =====
import { 
  initDigitalClock, initScrollProgress, initSystemStatus,
  initLiveSearch, initPdfFab, initZenMode, initDataViz,
  initSectionAnalytics
} from './widgets.js';

// ===== TACTICAL WIDGETS =====
import { TacticalWidgets } from './tactical-widgets.js';

// ===== THEME SWITCHER =====
import { initThemeToggleWithRipple } from './theme-switcher-ripple.js';

// ===== PWA LOADER =====
import { initPWA } from './pwa-loader.js';

// ===== AI CHAT =====
import { initAiChat, handleSuggestion } from './ai-bot.js';

// ===== BOOT SEQUENCE LOGIC =====
const bootMessages = [
  "BIOS: Initializing boot sequence...",
  "CPU: Intel Core i9-12900K @ 5.2GHz [OK]",
  "MEM: 64GB DDR5-5600MHz [OK]",
  "GPU: NVIDIA RTX 4090 [OK]",
  "STORAGE: NVMe SSD 4TB [OK]",
  "NET: Ethernet 2.5G [OK]",
  "OS: Tactical-OS v5.1.0 (Build 2077) booting...",
  "STATUS: All systems nominal.",
  "LOADING_MODULE: Core data structures...",
  "LOADING_MODULE: UI framework components...",
  "LOADING_MODULE: Neural network interface...",
  "LOADING_MODULE: Skill matrix visualization...",
  "LOADING_MODULE: Encrypted comms protocols...",
  "LOADING_MODULE: AI Oracle uplink...",
  "INIT: Portfolio rendering engine...",
  "INIT: User authentication module...",
  "INIT: Local telemetry services...",
  "INIT: Experience timeline processing...",
  "INIT: Project analysis algorithms...",
  "INIT: Blog content parser...",
  "INIT: Learning path optimizer...",
  "INIT: Gamification engine...",
  "INIT: Social link encryption...",
  "BOOT_COMPLETE: Welcome, Operative. Mission environment initialized.",
  "ACCESS_GRANTED: Proceed with caution."
];

async function typeWriter(bootLogElement, bootCursorElement, messages) {
  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];
    const line = document.createElement('span');
    bootLogElement.appendChild(line);
    bootLogElement.scrollTop = bootLogElement.scrollHeight; // Auto-scroll
    for (let j = 0; j < message.length; j++) {
      line.textContent += message[j];
      await new Promise(resolve => setTimeout(resolve, Math.random() * 5 + 10)); // Fast typing speed
    }
    bootLogElement.appendChild(document.createTextNode('\n')); // Add newline
    await new Promise(resolve => setTimeout(resolve, 50)); // Delay between lines
  }
  bootCursorElement.remove(); // Remove cursor after typing
  await new Promise(resolve => setTimeout(resolve, 500)); // Short pause after all messages
}

async function initBootSequence() {
  const bootSequence = document.getElementById('boot-sequence');
  const bootLog = bootSequence.querySelector('.boot-log');
  const bootCursor = bootSequence.querySelector('.boot-cursor');

  // Only run boot sequence on first visit of the session
  if (sessionStorage.getItem('bootSequencePlayed') === 'true') {
    bootSequence.classList.add('hidden');
    document.body.style.overflow = ''; // Restore scroll
    return;
  }

  document.body.style.overflow = 'hidden'; // Prevent scrolling during boot
  await typeWriter(bootLog, bootCursor, bootMessages);

  bootSequence.classList.add('hidden');
  bootSequence.addEventListener('transitionend', () => {
    bootSequence.remove();
    document.body.style.overflow = ''; // Restore scroll after hidden
  }, { once: true });

  sessionStorage.setItem('bootSequencePlayed', 'true');
}


// ===== MAKE GLOBALS AVAILABLE =====
// Only expose globals required by inline onclick handlers in HTML templates,
// or shared as cross-module state via window.*.
window.DATA = DATA;
window.AudioEngine = AudioEngine;
window.MISSION_SECRETS = MISSION_SECRETS;
window.PortfolioData = PortfolioData;
window.projectsList = null;      // shared state: set by tactical-data.js, read by tactical-data.js
window.skillsRadarChart = null;  // shared state: set by main.js, read by tactical-data.js
window.chartBaseData = null;     // shared state: set by main.js, read by tactical-data.js
window.TestimonialsCarousel = TestimonialsCarousel;
window.replayProject = replayProject;
window.decryptDossier = decryptDossier;
window.toggleCaseStudy = toggleCaseStudy;
window.openCaseStudy = openCaseStudy;
window.closeCaseStudy = closeCaseStudy;
window.openPortfolioBridge = openBridge;
window.closePortfolioBridge = closeBridge;
window.toggleTreeSection = toggleTreeSection;
window.toggleMobileSidebar = toggleMobileSidebar;
window.handleTreeClick = handleTreeClick;
window.switchTerminalTab = switchTerminalTab;
window.toggleBottomTerminal = toggleBottomTerminal;
window.minimizeBottomTerminal = minimizeBottomTerminal;
window.maximizeBottomTerminal = maximizeBottomTerminal;
window.runWorkbenchCode = runWorkbenchCode;
window.loadWorkbenchPreset = loadWorkbenchPreset;
window.executeQuickCommand = executeQuickCommand;
window.toggleDecryptAll = toggleDecryptAll;
window.toggleTelemetryWidget = toggleTelemetryWidget;
window.togglePalette = togglePalette;
window.copyEmail = copyEmail;
window.handleSuggestion = handleSuggestion;
window.glitchEffect = glitchEffect;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', async () => {
  initBootSequence(); // Initialize boot sequence first
  
  // Premium Scroll Reveal
  if (typeof IntersectionObserver !== 'undefined') {
    // Auto-add class to major structural elements
    document.querySelectorAll('.card-glass, .resume-item, .timeline-wrapper, .skill-progress-item').forEach(el => {
      if (!el.classList.contains('scroll-reveal')) {
        el.classList.add('scroll-reveal');
      }
    });

    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          scrollObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    document.querySelectorAll('.scroll-reveal').forEach(el => scrollObserver.observe(el));
  }

  // Core initialization
  updateSystemHealth();
  SkillsGlobe.init();
  initTelemetryOverlay();
  
  // Audio
  const musicBtn = document.getElementById('musicToggle');
  if (musicBtn) musicBtn.addEventListener('click', () => AudioEngine.toggleMusic());
  
  // Speech synthesis
  if (window.speechSynthesis) {
    window.speechSynthesis.getVoices();
  }
  
  // Theme management
  localStorage.setItem('portfolio-active-theme', 'theme-tactical.html');
  
  const root = document.documentElement;
  
  const applyTheme = (theme, accent) => {
    root.setAttribute('data-theme', theme);
    if (accent) root.setAttribute('data-accent', accent);
    document.body.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
  };

  const savedTheme = localStorage.getItem('tactical-theme') || 'dark';
  applyTheme(savedTheme);

  // Initialize theme toggle with ripple
  if (typeof initThemeToggleWithRipple === 'function') {
    initThemeToggleWithRipple({
      buttonId: 'theme-toggle',
      getTheme: () => root.getAttribute('data-theme') || 'dark',
      applyTheme: (theme) => applyTheme(theme, root.getAttribute('data-accent')),
      saveTheme: (theme) => localStorage.setItem('tactical-theme', theme)
    });
  }

  // Accent color switcher (shared module)
  initAccentSwitcher({
    defaultAccent: 'green',
    onChange: () => {
      // Update chart colors when accent changes
      if (typeof window.updateChartColors === 'function') {
        window.updateChartColors();
      }
    }
  });
  
  // Glitch effect initializer
  document.querySelectorAll('.section-label, h2:not(.display-2)').forEach(el => {
    el.addEventListener('mouseenter', () => glitchEffect(el));
    setTimeout(() => glitchEffect(el), 500);
  });
  
  // Initialize skills radar chart (wait for Chart.js to load)
  if (typeof window.loadChartJS === 'function') {
    window.loadChartJS().then(() => initSkillsRadarChart()).catch(() => initSkillsRadarChart());
  } else {
    initSkillsRadarChart();
  }

  // Render dynamic content before widgets that snapshot the DOM.
  const tacticalData = await initializeTacticalData();
  
  // Initialize all widget modules
  initTerminal();
  initCommandPalette();
  initDigitalClock();
  initScrollProgress();
  initSystemStatus();
  initLiveSearch(tacticalData);
  initPdfFab();
  initZenMode();
  initDataViz();
  initSectionAnalytics();
  
  // Initialize floating widgets (handles drag + resize)
  setTimeout(initFloatingWidgets, 500);

  // Initialize GitHub live feed
  initGitHubFeed();

  // Initialize tactical widgets
  TacticalWidgets.init();
  
  // Initialize PWA
  initPWA();

  // Initialize AI chat
  initAiChat();
  
  // Initialize enhancement classes
  new KeyboardNavigator();
  new ScrollGlitchEffect().init();
  ScanlinePulse.init();
  AnimatedCounters.init();
  SkillProgressBars.init();
  TestimonialsCarousel.init();

  // Auto-collapse mobile navbar on link click
  const navCollapse = document.getElementById('navbarSupportedContent');
  if (navCollapse) {
    navCollapse.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 992 && navCollapse.classList.contains('show')) {
          if (window.bootstrap?.Collapse) {
            const bsCollapse = window.bootstrap.Collapse.getInstance(navCollapse) || new window.bootstrap.Collapse(navCollapse, { toggle: false });
            bsCollapse.hide();
          } else {
            navCollapse.classList.remove('show');
          }
        }
      });
    });
  }
});

// ===== SKILLS RADAR CHART =====
function initSkillsRadarChart() {
  const canvas = document.getElementById('skillsChart');
  const skillMap = { 'PYTHON': 0, 'SQL': 1, 'PANDAS': 2, 'SCIKIT-LEARN': 3, 'JAVASCRIPT': 4, 'AI/RAG': 5 };
  const baseData = [90, 88, 88, 80, 78, 78];
  window.chartBaseData = [...baseData];

  if (canvas instanceof HTMLCanvasElement && typeof Chart !== 'undefined') {
    const ctx = canvas.getContext('2d');
    const cs = getComputedStyle(document.documentElement);
    const initColor = cs.getPropertyValue('--primary-color').trim() || '#4ade80';
    const initRGB = cs.getPropertyValue('--primary-color-rgb').trim() || '74, 222, 128';
    const initText = cs.getPropertyValue('--text-secondary').trim() || '#a3b89c';

    window.skillsRadarChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Python', 'SQL', 'Pandas', 'ML', 'JavaScript', 'AI/RAG'],
        datasets: [{
          label: 'Capability Index',
          data: [...baseData],
          backgroundColor: `rgba(${initRGB}, 0.2)`,
          borderColor: initColor,
          borderWidth: 1.5,
          pointBackgroundColor: initColor,
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: initColor
        }]
      },
      options: {
        scales: {
          r: {
            angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
            grid: { color: 'rgba(255, 255, 255, 0.1)' },
            pointLabels: {
              color: initText,
              font: { family: 'JetBrains Mono', size: 11 }
            },
            ticks: { display: false, maxTicksLimit: 5 }
          }
        },
        plugins: {
          legend: { display: false }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });

    // Color synchronization handler
    window.updateChartColors = () => {
      if (!window.skillsRadarChart) return;
      const computed = getComputedStyle(document.documentElement);
      const color = computed.getPropertyValue('--primary-color').trim() || '#4ade80';
      const rgb = computed.getPropertyValue('--primary-color-rgb').trim() || '74, 222, 128';
      const text = computed.getPropertyValue('--text-secondary').trim() || '#a3b89c';

      const chart = window.skillsRadarChart;
      chart.data.datasets[0].borderColor = color;
      chart.data.datasets[0].pointBackgroundColor = color;
      chart.data.datasets[0].pointHoverBorderColor = color;
      chart.data.datasets[0].backgroundColor = `rgba(${rgb}, 0.2)`;
      chart.options.scales.r.pointLabels.color = text;
      chart.update();
    };

    // Initial color read
    window.updateChartColors();
    
    // Gamify connections using Event Delegation
    document.addEventListener('mouseover', (e) => {
      const target = /** @type {Element | null} */ (e.target);
      const badge = target?.closest('.skill-pill-tactical, .tech-chip');
      if (badge instanceof HTMLElement && window.skillsRadarChart) {
        badge.style.cursor = 'pointer';
        const skill = badge.textContent.trim().toUpperCase();
        let index = skillMap[skill];
        
        if (index === undefined) {
          const labels = window.skillsRadarChart.data.labels.map(l => l.toUpperCase());
          index = labels.indexOf(skill);
        }
        
        if (index !== undefined && index !== -1) {
          const currentData = window.chartBaseData || baseData;
          const newData = currentData.map((v, i) => i === index ? 100 : v * 0.4);
          window.skillsRadarChart.data.datasets[0].data = newData;
          window.skillsRadarChart.update('none');
          badge.classList.add('pulse');
        }
      }
    });
    
    document.addEventListener('mouseout', (e) => {
      const target = /** @type {Element | null} */ (e.target);
      const badge = target?.closest('.skill-pill-tactical, .tech-chip');
      if (badge && window.skillsRadarChart) {
        window.skillsRadarChart.data.datasets[0].data = [...(window.chartBaseData || baseData)];
        window.skillsRadarChart.update('none');
        badge.classList.remove('pulse');
      }
    });
  }
}

// ===== EXPORT FOR MODULE USAGE =====
export {
  DATA, PROFILE_INFO, EXPERIENCES, EDUCATION, PROJECTS,
  SKILL_GROUPS, BLOG_POSTS, LEARNING_ITEMS, GAMING, STATS,
  FILE_TREE, SOCIAL_LINKS, LOCAL_INTEL,
  PortfolioData,
  AudioEngine, glitchEffect,
  copyEmail, SkillsGlobe,
  initializeTacticalData, renderInfo, renderExperience,
  renderEducation, renderSkillGroups,
  renderProjects, renderBlogs, renderLearning, renderGaming,
  renderMedia, renderFileTree, fetchGithubRepos,
  decryptDossier, toggleCaseStudy, initializeProjectFilters, toggleDecryptAll,
  openCaseStudy, closeCaseStudy,
  toggleBottomTerminal, minimizeBottomTerminal, maximizeBottomTerminal, switchTerminalTab, startTelemetryStreams,
  runWorkbenchCode, loadWorkbenchPreset, executeQuickCommand,
  cleanupTerminal, initTerminal, initCommandPalette, togglePalette,
  FloatingWidget, initFloatingWidgets, toggleTelemetryWidget, initGitHubFeed,
  openBridge, closeBridge, minimizePortfolioBridge, restorePortfolioBridge,
  toggleMaximizeBridge, initResizableBridge, EXTERNAL_BLOCK_LIST,
  initDigitalClock, initScrollProgress, initSystemStatus,
  initLiveSearch, initPdfFab, initZenMode, initDataViz,
  initSectionAnalytics, TacticalWidgets, initThemeToggleWithRipple,
  initPWA, initAiChat, runTypewriter
};
