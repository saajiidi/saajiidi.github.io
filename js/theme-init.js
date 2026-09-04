/**
 * UNIVERSAL THEME INITIALIZER
 * Single source of truth patcher for all three portfolio themes.
 * Reads PROFILE_INFO, SOCIAL_LINKS, STATS from js/data/index.js
 * and patches every theme's hardcoded DOM elements.
 *
 * Usage: <script type="module" src="js/theme-init.js"></script>
 */

import { PROFILE_INFO, SOCIAL_LINKS, STATS } from './data/index.js';

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Set text content on every element matching selector (if exists) */
function setText(selector, value) {
  document.querySelectorAll(selector).forEach(el => { el.textContent = value; });
}


// ── WhatsApp normalizer ───────────────────────────────────────────────────────
function waLink(raw) {
  const digits = raw.replace(/\D/g, '');
  return `https://wa.me/${digits}`;
}

// ── Patch <meta> tags in <head> ───────────────────────────────────────────────
function patchMeta() {
  // description
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute('content', `${PROFILE_INFO.name} — ${PROFILE_INFO.role} specializing in Python, SQL, Power BI, and machine learning.`);

  // author
  const author = document.querySelector('meta[name="author"]');
  if (author) author.setAttribute('content', PROFILE_INFO.name);

  // OG / Twitter image
  ['og:image', 'twitter:image'].forEach(prop => {
    const el = document.querySelector(`meta[property="${prop}"]`);
    if (el) el.setAttribute('content', `https://sajid-ul-islam.github.io/${PROFILE_INFO.photo}`);
  });

  // OG / Twitter description
  ['og:description', 'twitter:description'].forEach(prop => {
    const el = document.querySelector(`meta[property="${prop}"]`);
    if (el) el.setAttribute('content', `${PROFILE_INFO.role} specializing in Python, SQL, Power BI, and machine learning.`);
  });
}

// ── Patch profile image(s) ────────────────────────────────────────────────────
function patchProfilePhoto() {
  document.querySelectorAll('img[alt="Sajid Islam"], img[alt="Profile"]').forEach(img => {
    img.src = PROFILE_INFO.photo;
    img.alt = PROFILE_INFO.name;
  });
}

// ── Patch name appearances ────────────────────────────────────────────────────
function patchName() {
  // Elements with class .owner-name (all themes use this)
  setText('.owner-name', PROFILE_INFO.name);

  // Ironforge hero headline accent name span
  setText('.owner-name-accent', PROFILE_INFO.name.toUpperCase());

  // Tactical specific: status bar identity & navbar brand
  setText('.data-name', PROFILE_INFO.name.toUpperCase());
  setText('.status-value[data-field="identity"]', PROFILE_INFO.name.toUpperCase().replace(' ', '_'));
}

// ── Patch social / contact links ──────────────────────────────────────────────
function patchLinks() {
  const wa = waLink(PROFILE_INFO.whatsapp);

  // WhatsApp — href on any wa.me links or .footer-whatsapp
  document.querySelectorAll('a[href*="wa.me"], a.footer-whatsapp').forEach(a => { a.href = wa; });

  // Telegram — href on any t.me links (skip if contact is a masked placeholder)
  if (PROFILE_INFO.telegram && !PROFILE_INFO.telegram.includes('*')) {
    document.querySelectorAll('a[href*="t.me"]').forEach(a => { a.href = PROFILE_INFO.telegram; });
  } else {
    // Hide dead telegram buttons rather than linking to a placeholder
    document.querySelectorAll('a[href*="t.me"]').forEach(a => {
      if ((a.getAttribute('href') || '').includes('*')) a.style.display = 'none';
    });
  }

  // Email — mailto: links or .footer-email
  document.querySelectorAll('a[href^="mailto:"], a.footer-email').forEach(a => { a.href = `mailto:${PROFILE_INFO.email}`; });

  // Email text spans
  document.querySelectorAll('[data-field="email"]').forEach(el => { el.textContent = PROFILE_INFO.email; });
  document.querySelectorAll('[data-field="whatsapp"]').forEach(el => { el.textContent = PROFILE_INFO.whatsapp; });

  // GitHub links
  document.querySelectorAll('a[href*="github.com"]').forEach(a => {
    if (a.href.includes('Sajid') || a.href === '#' && a.title === 'GitHub') a.href = PROFILE_INFO.github;
  });
  // GitHub icon links with title
  document.querySelectorAll('a[title="GitHub"]').forEach(a => { a.href = PROFILE_INFO.github; });

  // LinkedIn links
  document.querySelectorAll('a[href*="linkedin.com"], a[title="LinkedIn"]').forEach(a => {
    a.href = PROFILE_INFO.linkedin;
  });

  // Kaggle links
  document.querySelectorAll('a[href*="kaggle.com"], a[title="Kaggle"]').forEach(a => {
    a.href = PROFILE_INFO.kaggle;
  });

  // Hugging Face links
  document.querySelectorAll('a[href*="huggingface.co"]').forEach(a => {
    a.href = PROFILE_INFO.huggingface;
  });
}

// ── Patch inline email in copyEmail() button calls ────────────────────────────
function patchCopyEmailButtons() {
  document.querySelectorAll('button[onclick*="copyEmail"]').forEach(btn => {
    const current = btn.getAttribute('onclick');
    const patched = current.replace(/'[^']+@[^']+'/g, `'${PROFILE_INFO.email}'`);
    btn.setAttribute('onclick', patched);
    // Also update the visible span sibling if present
    const span = btn.previousElementSibling;
    if (span && span.textContent.includes('@')) span.textContent = PROFILE_INFO.email;
  });

  // Static <span> showing email (tactical contact modal)
  document.querySelectorAll('span').forEach(span => {
    if (span.textContent.trim().match(/^[\w.]+@[\w.]+$/) && span.textContent.includes('@gmail.com')) {
      span.textContent = PROFILE_INFO.email;
    }
  });

  // Static <span> showing phone
  document.querySelectorAll('span').forEach(span => {
    if (span.textContent.trim().match(/^\+880/)) {
      span.textContent = PROFILE_INFO.whatsapp;
    }
  });
}

// ── Patch footer copyright ────────────────────────────────────────────────────
function patchFooter() {
  const year = new Date().getFullYear();
  const slug = PROFILE_INFO.name.toUpperCase().replace(' ', '-');

  // Class-targeted copyright (sketchbook)
  document.querySelectorAll('.footer-copyright').forEach(p => {
    p.textContent = `\u00a9 ${year} ${slug}`;
  });

  // Fallback: any <p> containing copyright year pattern
  document.querySelectorAll('p').forEach(p => {
    if (p.textContent.match(/©\s*20\d\d\s+SAJID/i)) {
      p.textContent = `\u00a9 ${year} ${slug}`;
    }
  });
}

// ── Patch <title> ─────────────────────────────────────────────────────────────
function patchTitle() {
  if (document.title && document.title.includes('Sajid Islam')) {
    document.title = document.title.replace(/Sajid Islam/g, PROFILE_INFO.name);
  }
}

// ── Patch hero text (sketchbook) ──────────────────────────────────────────────
function patchHeroText() {
  const heroText = document.getElementById('hero-text');
  if (heroText && heroText.textContent.trim().length < 20) {
    // Already rendered dynamically by PortfolioData bootstrap — skip
    return;
  }
}

// ── Patch stats counters across themes ───────────────────────────────────────
function patchStats() {
  // Ironforge: elements with [data-count] attribute
  document.querySelectorAll('[data-count]').forEach((el, i) => {
    if (STATS[i]) el.setAttribute('data-count', STATS[i].value);
  });

  // Sketchbook: h3 inside #stats section
  const statsSection = document.getElementById('stats');
  if (statsSection) {
    const statCards = statsSection.querySelectorAll('h3');
    statCards.forEach((h3, i) => {
      if (STATS[i]) h3.textContent = `${STATS[i].value}${STATS[i].suffix}`;
    });

    // Also patch the paragraph labels if they exist
    const statLabels = statsSection.querySelectorAll('p');
    statLabels.forEach((p, i) => {
      if (STATS[i]) p.textContent = STATS[i].label;
    });
  }
}

// ── JSON-LD structured data patch ────────────────────────────────────────────
function patchJSONLD() {
  const jsonLD = document.querySelector('script[type="application/ld+json"]');
  if (!jsonLD) return;
  try {
    const data = JSON.parse(jsonLD.textContent);
    data.name = PROFILE_INFO.name;
    data.jobTitle = PROFILE_INFO.role;
    data.description = PROFILE_INFO.heroText;
    if (data.sameAs) {
      data.sameAs = [PROFILE_INFO.github, PROFILE_INFO.linkedin, PROFILE_INFO.kaggle];
    }
    data.image = `https://sajid-ul-islam.github.io/${PROFILE_INFO.photo}`;
    jsonLD.textContent = JSON.stringify(data, null, 2);
  } catch { /* ignore malformed JSON-LD */ }
}

// ── Run all patches ───────────────────────────────────────────────────────────
function initTheme() {
  patchMeta();
  patchTitle();
  patchJSONLD();
  patchProfilePhoto();
  patchName();
  patchLinks();
  patchCopyEmailButtons();
  patchFooter();
  patchStats();
  patchHeroText();
}

// Run immediately on import (DOM may still be loading)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTheme);
} else {
  initTheme();
}

export { initTheme, PROFILE_INFO, SOCIAL_LINKS, STATS };
