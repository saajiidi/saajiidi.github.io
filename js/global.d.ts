/**
 * Global type declarations for window properties used across modules.
 * These are set via window.* in main.js for inline onclick handlers
 * and cross-module shared state.
 */

/* eslint-disable no-unused-vars */

interface Window {
  DATA: any;
  bootstrap?: any;
  AudioEngine: any;
  MISSION_SECRETS: Record<string, string>;
  PortfolioData: any;
  projectsList: any[] | null;
  skillsRadarChart: any;
  chartBaseData: number[] | null;
  TestimonialsCarousel: any;
  replayProject: (id: string) => void;
  decryptDossier: (id: string, el: HTMLElement, force?: boolean) => void;
  toggleCaseStudy: (id: string) => void;
  openCaseStudy: (e: Event, id: string) => void;
  closeCaseStudy: () => void;
  openPortfolioBridge: (e: Event | null, url: string) => void;
  closePortfolioBridge: () => void;
  toggleTreeSection: (id: string) => void;
  toggleMobileSidebar: () => void;
  handleTreeClick: (e: Event, id: string) => void;
  switchTerminalTab: (tabId: string) => void;
  toggleBottomTerminal: () => void;
  minimizeBottomTerminal?: () => void;
  __aiChatBound?: boolean;
  __toggleAiChat?: (minimize?: boolean) => void;
  __minimizeAiChat?: () => void;
  togglePalette: () => void;
  copyEmail: (email: string, event: Event) => void;
  handleSuggestion: ((text: string) => void) | null;
  glitchEffect: (el: HTMLElement) => void;
  executeCommand: (url: string, id: string) => void;
  updateChartColors: () => void;
  loadChartJS: () => Promise<void>;
  TACTICAL_INFO: any;
  initThemeToggleWithRipple: (opts: any) => void;
  _fwDone?: boolean;
  currentPostTitle?: string;
  terminalBuffer?: string;
  isWritingMode?: boolean;
  webkitAudioContext?: typeof AudioContext;
}

/** AudioEngine loaded globally */
declare const AudioEngine: any;

/** Chart.js loaded via CDN script tag */
declare const Chart: any;

/** Navigator extensions (experimental Web APIs) */
interface Navigator {
  getBattery?: () => Promise<any>;
  deviceMemory?: number;
  userAgentData?: { platform: string };
}
