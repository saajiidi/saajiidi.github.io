/**
 * Shared accent/theme switching logic.
 * Import from any theme to avoid duplicating swatch + localStorage code.
 *
 * Usage:
 *   import { initAccentSwitcher } from './theme-accent.js';
 *   initAccentSwitcher({ defaultAccent: 'green' });
 */

const STORAGE_KEY = 'tactical-accent';

export function getSavedAccent(fallback = 'green') {
  return localStorage.getItem(STORAGE_KEY) || fallback;
}

export function setAccent(name) {
  document.documentElement.setAttribute('data-accent', name);
  localStorage.setItem(STORAGE_KEY, name);
}

/**
 * Wire up all `.color-swatch` buttons and restore the saved accent.
 * @param {object} [opts]
 * @param {string} [opts.defaultAccent] - fallback if nothing saved
 * @param {function} [opts.onChange]   - optional callback(accentName)
 */
export function initAccentSwitcher({ defaultAccent = 'green', onChange } = {}) {
  const saved = getSavedAccent(defaultAccent);
  setAccent(saved);

  document.querySelectorAll('.color-swatch').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = /** @type {HTMLElement | null} */ (e.currentTarget);
      const name = target ? target.getAttribute('data-color') : null;
      if (!name) return;
      setAccent(name);
      if (onChange) onChange(name);
    });
  });
}
