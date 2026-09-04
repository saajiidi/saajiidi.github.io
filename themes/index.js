/**
 * Theme Engine Registry
 * Central configuration for managing portfolio themes
 * 
 * Structure:
 *   themes/
 *   ├── base/          -- Shared design tokens & utilities
 *   │   ├── tokens.css
 *   │   └── mixins.css
 *   ├── sketchbook/    -- Hand-drawn paper aesthetic
 *   │   ├── sketchbook.css
 *   │   └── README.md
 *   ├── tactical/      -- Military/HUD theme
 *   │   ├── tactical.css
 *   │   └── README.md
 */

// Available Themes
const THEMES = {
  sketchbook: {
    name: "Sketchbook Ink",
    file: "themes/sketchbook/sketchbook.css",
    description: "Hand-drawn paper aesthetic with animated transitions"
  },
  tactical: {
    name: "Tactical HUD",
    file: "themes/tactical/tactical.css",
    description: "Military-inspired interface with telemetry overlays"
  }
};

// Default Theme
const DEFAULT_THEME = "sketchbook";

// Theme Switching Utility
function switchTheme(themeName) {
  const theme = THEMES[themeName];
  if (!theme) {
    console.warn(`Unknown theme: ${themeName}`);
    return;
  }

  // Remove existing theme link
  const existingLink = document.getElementById('theme-css');
  if (existingLink) existingLink.remove();

  // Add new theme link
  const link = document.createElement('link');
  link.id = 'theme-css';
  link.rel = 'stylesheet';
  link.href = theme.file;
  document.head.appendChild(link);

  // Save preference
  localStorage.setItem('portfolio-theme', themeName);
}

// Auto-switch based on saved preference
(function initTheme() {
  let savedTheme = localStorage.getItem('portfolio-theme') || DEFAULT_THEME;
  if (!THEMES[savedTheme]) savedTheme = DEFAULT_THEME; // e.g. retired ironforge
  switchTheme(savedTheme);
})();

console.log("Theme Engine initialized:", Object.keys(THEMES));
