import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

export default [
  {
    files: ['js/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2021,
        // Globals required by inline onclick handlers or cross-module window.* access
        DATA: 'writable',
        AudioEngine: 'writable',
        MISSION_SECRETS: 'writable',
        PortfolioData: 'writable',
        TestimonialsCarousel: 'writable',
        replayProject: 'writable',
        decryptDossier: 'writable',
        toggleCaseStudy: 'writable',
        openCaseStudy: 'writable',
        closeCaseStudy: 'writable',
        openPortfolioBridge: 'writable',
        closePortfolioBridge: 'writable',
        toggleTreeSection: 'writable',
        toggleMobileSidebar: 'writable',
        handleTreeClick: 'writable',
        switchTerminalTab: 'writable',
        toggleBottomTerminal: 'writable',
        minimizeBottomTerminal: 'writable',
        togglePalette: 'writable',
        copyEmail: 'writable',
        handleSuggestion: 'writable',
        glitchEffect: 'writable',
        executeCommand: 'writable',
        Chart: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-undef': 'error',
      'no-redeclare': 'error',
      'eqeqeq': ['error', 'smart'],
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-template': 'warn',
      'no-duplicate-imports': 'error',
    },
  },
  eslintConfigPrettier,
];
