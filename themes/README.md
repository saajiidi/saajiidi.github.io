# Portfolio Theme Engine

## Overview
Centralized theme management system for the Sajid Islam portfolio site.

## Directory Structure
```
themes/
├── base/              # Shared tokens & utilities
│   ├── tokens.css     # CSS custom properties (colors, spacing, typography)
│   └── mixins.css     # Reusable utility classes
├── sketchbook/        # Hand-drawn paper aesthetic
│   ├── sketchbook.css 
│   └── README.md
├── tactical/          # Military/HUD theme
│   ├── tactical.css
│   └── README.md
├── index.js           # Theme registry & switcher
└── README.md          # This file
```

## Adding a New Theme

1. Create a new folder under `themes/` (e.g., `neon/`)
2. Add a `neon.css` stylesheet with theme-specific styles
3. Create a `README.md` documenting the theme
4. Register it in `index.js`:
```js
neon: {
  name: "Neon Pulse",
  file: "themes/neon/neon.css",
  description: "Cyberpunk-inspired glowing interface"
}
```

## Theme Switching

Themes can be switched dynamically using JavaScript:
```js
switchTheme('sketchbook'); // Loads sketchbook.css
```

Preferences are saved to localStorage and persist across sessions.

## Development Guidelines

- Use CSS custom properties for theme-specific values
- Reference shared tokens from `base/tokens.css`
- Extend utility classes from `base/mixins.css`
- Document any unique behaviors in the theme's README
