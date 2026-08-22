/**
 * GLOBAL THEME SWITCHER TEARDROP RIPPLE TRANSITION MODULE
 * Self-contained visual transition engine.
 * Now exported as ES module.
 */

// 1. Dynamic CSS Injection
const transitionStyles = `
  .theme-drop-overlay {
    z-index: 99999;
    pointer-events: none;
    view-transition-name: theme-drop;
    position: fixed;
    inset: 0;
  }
  .theme-drop {
    will-change: transform;
    filter: drop-shadow(0 3px 8px rgba(0,0,0,0.25));
    width: 30px;
    height: 42px;
    position: absolute;
    top: 0;
  }
  .theme-drop path {
    fill: var(--bg, #FAF9F6);
  }
  .theme-drop ellipse {
    fill: #fff;
    opacity: 0.35;
  }
  .theme-drop-bead {
    background: var(--bg, #FAF9F6);
    opacity: 0;
    border-radius: 50%;
    width: 10px;
    height: 10px;
    position: absolute;
    box-shadow: inset 0 2px 2px rgba(255,255,255,0.6), inset 0 -1px 2px rgba(0,0,0,0.35), 0 1px 2px rgba(0,0,0,0.25);
  }
  .theme-splash-drop {
    opacity: 0.95;
    position: absolute;
  }
  .theme-splash-drop i {
    background: var(--bg, #FAF9F6);
    border-radius: 50%;
    width: 100%;
    height: 100%;
    display: block;
    box-shadow: inset 0 1px 1px rgba(255,255,255,0.65), inset 0 -1px 1px rgba(0,0,0,0.35), 0 1px 2px rgba(0,0,0,0.3);
  }
  .theme-water {
    width: 100%;
    height: 100%;
    position: absolute;
    inset: 0;
  }
  ::view-transition {
    pointer-events: none;
  }
  @media (prefers-reduced-motion: no-preference) {
    ::view-transition-old(root) {
      animation: none;
    }
    ::view-transition-new(root) {
      animation: 2.2s cubic-bezier(0.12, 0.72, 0.28, 1) both theme-ripple-reveal;
    }
    :root.theme-rippling::view-transition-new(root) {
      filter: url(#theme-water-warp);
    }
    ::view-transition-old(theme-drop) {
      display: none;
    }
    ::view-transition-new(theme-drop) {
      animation: none;
    }
  }
  @keyframes theme-ripple-reveal {
    0% {
      clip-path: ellipse(0px 0px at var(--ripple-x, 50vw) var(--ripple-y, 40vh));
    }
    to {
      clip-path: ellipse(var(--ripple-rx, 160vmax) var(--ripple-ry, 90vmax) at var(--ripple-x, 50vw) var(--ripple-y, 40vh));
    }
  }
`;

// Inject styles on script load
const styleEl = document.createElement('style');
styleEl.textContent = transitionStyles;
document.head.appendChild(styleEl);

// 2. Shader & Animation Core
const isReduced = matchMedia('(prefers-reduced-motion: reduce)');
const ua = navigator.userAgent;
const isIOS = /iP(hone|ad|od)/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const isSafari = /AppleWebKit/.test(ua) && !/Chrome|CriOS|FxiOS|Edg/.test(ua);
const useWebgl = !isIOS && !isSafari && !/Firefox|FxiOS/.test(ua);

let activeTransition = null;
const flattenFactor = 0.55;
const durationRipple = 2200;
const bezierControl = { x1: 0.12, y1: 0.72, x2: 0.28, y2: 1 };

// Bezier Ease Solver
const solveBezier = (t) => {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  const getPt = (p, p1, p2) => 3 * (1 - p) * (1 - p) * p * p1 + 3 * (1 - p) * p * p * p2 + p * p * p;
  let left = 0, right = 1;
  for (let i = 0; i < 24; i++) {
    const mid = (left + right) / 2;
    if (getPt(mid, bezierControl.x1, bezierControl.x2) < t) {
      left = mid;
    } else {
      right = mid;
    }
  }
  return getPt((left + right) / 2, bezierControl.y1, bezierControl.y2);
};

const vertexShaderSrc = `
  attribute vec2 p;
  void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

const fragmentShaderSrc = `
  precision highp float;
  uniform vec2 u_res;
  uniform vec2 u_center;
  uniform float u_front;
  uniform float u_spread;
  uniform float u_flatten;
  uniform float u_time;
  uniform float u_fade;

  float wave(float r) {
    float d = r - u_front;
    float amp = exp(-u_front / (u_spread * 0.7));
    float punch = 1.0 + 1.6 * exp(-u_time * 3.5);
    float lambda = 40.0 + u_front * 0.12;
    float sigma = d > 0.0 ? 18.0 + u_front * 0.02 : 40.0 + u_front * 0.05;
    float lead = 1.15 * exp(-d * d / (2.0 * sigma * sigma));
    float rings = sin(6.2832 * r / lambda - u_time * 5.5);
    float win = smoothstep(u_front * 0.12, u_front * 0.4, r)
      * (1.0 - smoothstep(u_front - lambda * 0.35, u_front, r));
    float fall = exp(-(u_front - r) / (u_front * 0.55 + 1.0));
    return (lead + rings * win * fall * 1.1) * amp * punch;
  }

  void main() {
    vec2 p = vec2(gl_FragCoord.x, u_res.y - gl_FragCoord.y);
    vec2 q = p - u_center;
    q.y /= u_flatten;
    float r = length(q);
    float ang = atan(q.y, q.x);
    float wob = sin(ang * 5.0 + u_time * 1.6)
      + 0.6 * sin(ang * 8.0 - u_time * 2.3)
      + 0.4 * sin(ang * 13.0 + u_time * 3.1);
    float rw = r + wob * (3.5 + u_front * 0.012);
    vec2 dir = r > 0.5 ? q / r : vec2(0.0);
    vec2 grad = dir * (wave(rw + 1.5) - wave(rw)) * 24.0;
    vec3 N = normalize(vec3(-grad.x, grad.y, 1.0));
    vec3 L = normalize(vec3(-0.25, 0.55, 0.8));
    vec3 R = reflect(-L, N);
    float spec = pow(max(R.z, 0.0), 80.0);
    float tilt = dot(N, L) - L.z;
    float s = spec * 0.85 + tilt * 0.85;
    float born = smoothstep(2.0, 46.0, r);
    float a = clamp(abs(s), 0.0, 1.0) * (s > 0.0 ? 1.0 : 0.7) * born * u_fade;
    gl_FragColor = vec4(s > 0.0 ? vec3(1.0) : vec3(0.0), a);
  }
`;

const renderWebGLRipple = (canvas, cX, cY, maxRadius) => {
  return new Promise(resolve => {
    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false });
    if (!gl) return resolve();
    
    const ratio = Math.min(devicePixelRatio || 1, isIOS ? 1 : 1.5);
    canvas.width = Math.round(innerWidth * ratio);
    canvas.height = Math.round(innerHeight * ratio);

    const compile = (type, source) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, source);
      gl.compileShader(s);
      return s;
    };

    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vertexShaderSrc));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fragmentShaderSrc));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return resolve();

    gl.useProgram(prog);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    
    const positionLoc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);
    
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const getUniform = name => gl.getUniformLocation(prog, name);
    gl.uniform2f(getUniform('u_res'), canvas.width, canvas.height);
    gl.uniform2f(getUniform('u_center'), cX * ratio, cY * ratio);
    gl.uniform1f(getUniform('u_spread'), maxRadius * ratio);
    gl.uniform1f(getUniform('u_flatten'), flattenFactor);

    const uFront = getUniform('u_front');
    const uTime = getUniform('u_time');
    const uFade = getUniform('u_fade');
    
    const durationTotal = 4200;
    const start = performance.now();
    
    const frame = (now) => {
      const elapsed = now - start;
      gl.uniform1f(uFront, solveBezier(elapsed / durationRipple) * maxRadius * ratio);
      gl.uniform1f(uTime, elapsed / 1000);
      const fadeVal = elapsed < durationRipple ? 1 : Math.max(0, 1 - (elapsed - durationRipple) / (durationTotal - durationRipple));
      gl.uniform1f(uFade, fadeVal * fadeVal);
      
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      
      if (elapsed < durationTotal) {
        requestAnimationFrame(frame);
      } else {
        resolve();
      }
    };
    requestAnimationFrame(frame);
  });
};

const runTeardropTransition = async (activeObj, btnElement, targetTheme, applyThemeCallback) => {
  // Apply the theme synchronously and INDEPENDENTLY of the animation so the
  // dark/light swap ALWAYS happens even if the water-drop/WebGL animation fails,
  // throws, or never resolves. The teardrop is purely cosmetic from here on.
  try { applyThemeCallback(targetTheme); } catch (_) {}

  const width = visualViewport?.width ?? innerWidth;
  const height = visualViewport?.height ?? innerHeight;
  const btnRect = btnElement.getBoundingClientRect();
  
  const startX = btnRect.left + btnRect.width / 2;
  const startY = btnRect.bottom - 8;
  
  const splashY = Math.min(Math.max(height * 0.42, startY + 180), height - 60);
  const maxDist = Math.hypot(Math.max(startX, width - startX), Math.max(splashY, height - splashY) / flattenFactor) + 40;

  const root = document.documentElement;
  root.style.setProperty('--ripple-x', `${startX}px`);
  root.style.setProperty('--ripple-y', `${splashY}px`);
  root.style.setProperty('--ripple-rx', `${maxDist}px`);
  root.style.setProperty('--ripple-ry', `${maxDist * flattenFactor}px`);

  const overlay = document.createElement('div');
  overlay.className = 'theme-drop-overlay';
  overlay.style.colorScheme = targetTheme;
  overlay.innerHTML = `
    <canvas class="theme-water" aria-hidden="true"></canvas>
    <svg class="theme-drop" viewBox="0 0 40 56" aria-hidden="true">
      <path d="M20 1C20 1 5 21.5 5 36a15 15 0 0 0 30 0C35 21.5 20 1 20 1Z"></path>
      <ellipse cx="13.5" cy="35" rx="3.5" ry="5.5"></ellipse>
    </svg>
    <div class="theme-drop-bead"></div>
    <svg width="0" height="0" aria-hidden="true" style="position:absolute">
      <filter id="theme-water-warp" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.008 0.014" numOctaves="2" seed="7" result="noise"></feTurbulence>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G">
          <animate id="theme-warp-anim" attributeName="scale" values="0;26;9;3;0" keyTimes="0;0.12;0.5;0.8;1" dur="2.1s" begin="indefinite"></animate>
        </feDisplacementMap>
      </filter>
    </svg>
  `;
  document.body.appendChild(overlay);
  activeObj.overlay = overlay;

  const teardrop = overlay.querySelector('.theme-drop');
  teardrop.style.left = `${startX}px`;
  teardrop.style.transformOrigin = '50% 0%';
  const transformKeyframes = (yVal) => `translate(-50%, ${yVal}px)`;
  
  await teardrop.animate([
    { transform: `${transformKeyframes(startY)} scale(0.25)`, opacity: 0 },
    { transform: `${transformKeyframes(startY)} scale(0.8, 0.66)`, opacity: 1, offset: 0.45 },
    { transform: `${transformKeyframes(startY)} scale(1.06, 0.9)`, offset: 0.75 },
    { transform: `${transformKeyframes(startY)} scale(1)` }
  ], {
    duration: 340,
    easing: 'cubic-bezier(0.25, 0, 0.3, 1)',
    fill: 'forwards'
  }).finished;

  const endY = splashY - 42;
  const fallDistance = Math.max(60, endY - startY);
  teardrop.style.transformOrigin = '50% 100%';
  
  await teardrop.animate([
    { transform: `${transformKeyframes(startY)} scale(1)` },
    { transform: `${transformKeyframes(startY + 10)} scale(0.93, 1.12)`, offset: 0.14 },
    { transform: `${transformKeyframes(endY)} scale(0.95, 1.1)` }
  ], {
    duration: Math.max(360, Math.sqrt(fallDistance) * 27),
    easing: 'cubic-bezier(0.33, 0, 0.67, 0.33)',
    fill: 'forwards'
  }).finished;

  if (window.AudioEngine) {
    window.AudioEngine.play('waterDrop');
  }

  teardrop.animate([
    { transform: `${transformKeyframes(endY)} scale(0.95, 1.1)`, opacity: 1 },
    { transform: `${transformKeyframes(endY)} scale(1.9, 0.2)`, opacity: 0 }
  ], {
    duration: 170,
    easing: 'cubic-bezier(0.15, 0.6, 0.4, 1)',
    fill: 'forwards'
  });

  if (useWebgl) {
    root.classList.add('theme-rippling');
  }

  // Theme already applied synchronously at function entry (independent of the
  // animation). The view-transition below is a purely cosmetic clip-path reveal.
  let transition;
  if (document.startViewTransition) {
    try {
      transition = document.startViewTransition(() => {});
      activeObj.transition = transition;
      await transition.ready.catch(() => {});
    } catch {
      transition = { ready: Promise.resolve(), finished: Promise.resolve() };
      activeObj.transition = transition;
    }
  } else {
    transition = { ready: Promise.resolve(), finished: Promise.resolve() };
    activeObj.transition = transition;
  }

  const tasks = [];
  if (useWebgl) {
    try {
      overlay.querySelector('#theme-warp-anim')?.beginElement();
    } catch {}
    tasks.push(renderWebGLRipple(overlay.querySelector('.theme-water'), startX, splashY, maxDist));
  }

  const splashConfigs = [
    { dx: -34, rise: 18, size: 4, duration: 500 },
    { dx: -20, rise: 26, size: 5, duration: 560 },
    { dx: -8, rise: 30, size: 4, duration: 600 },
    { dx: 9, rise: 28, size: 5, duration: 580 },
    { dx: 22, rise: 23, size: 4, duration: 540 },
    { dx: 35, rise: 16, size: 3, duration: 490 }
  ];

  for (const cfg of splashConfigs) {
    const drop = document.createElement('div');
    drop.className = 'theme-splash-drop';
    drop.style.left = `${startX - cfg.size / 2}px`;
    drop.style.top = `${splashY - cfg.size}px`;
    drop.style.width = `${cfg.size}px`;
    drop.style.height = `${cfg.size}px`;
    drop.innerHTML = `<i></i>`;
    overlay.appendChild(drop);

    tasks.push(
      drop.animate([
        { transform: 'translateX(0)' },
        { transform: `translateX(${cfg.dx}px)` }
      ], { duration: cfg.duration, easing: 'linear', fill: 'both' }).finished,
      
      drop.firstElementChild.animate([
        { transform: 'translateY(0) scale(1)', opacity: 0.95, easing: 'cubic-bezier(0.2, 0.7, 0.4, 1)' },
        { transform: `translateY(${-cfg.rise}px) scale(0.8)`, opacity: 0.95, offset: 0.52, easing: 'cubic-bezier(0.6, 0, 0.85, 0.45)' },
        { transform: 'translateY(5px) scale(0.4)', opacity: 0 }
      ], { duration: cfg.duration, fill: 'both' }).finished
    );
  }

  const bead = overlay.querySelector('.theme-drop-bead');
  bead.style.left = `${startX}px`;
  bead.style.top = `${splashY - 5}px`;
  
  tasks.push(
    bead.animate([
      { transform: 'translate(-50%, 0) scale(1)', opacity: 0.9, easing: 'cubic-bezier(0.2, 0.8, 0.4, 1)' },
      { transform: 'translate(-50%, -46px) scale(0.7)', opacity: 0.9, offset: 0.5, easing: 'cubic-bezier(0.55, 0, 0.8, 0.4)' },
      { transform: 'translate(-50%, 4px) scale(0.45)', opacity: 0 }
    ], { delay: 90, duration: 480, fill: 'both' }).finished
  );

  transition.finished.then(() => activeObj.revealed = true, () => activeObj.revealed = true);
  tasks.push(transition.finished);
  
  await Promise.allSettled(tasks);
};

const cleanupTransition = (activeObj, getThemeCallback, applyThemeCallback) => {
  if (activeTransition === activeObj) {
    document.documentElement.classList.remove('theme-rippling');
    activeObj.overlay?.remove();
    activeTransition = null;
    // Guarantee the swap took effect even if the view transition dropped it.
    if (getThemeCallback() !== activeObj.next) {
      applyThemeCallback(activeObj.next);
    }
  }
};

const toggleThemeWithAnimation = (btnElement, nextTheme, getThemeCallback, applyThemeCallback) => {
  const activeObj = { next: nextTheme };
  activeTransition = activeObj;
  
  runTeardropTransition(activeObj, btnElement, nextTheme, applyThemeCallback)
    .catch(() => {})
    .then(() => {
      cleanupTransition(activeObj, getThemeCallback, applyThemeCallback);
    });
};

// --- Exposed Global Modular Initializer ---
export function initThemeToggleWithRipple({
  buttonId = 'theme-toggle',
  getTheme = () => document.documentElement.getAttribute('data-theme') || 'dark',
  applyTheme = () => {},
  saveTheme = () => {}
}) {
  // Look for button elements with either ID (theme-toggle or themeToggle)
  let btn = document.getElementById(buttonId);
  if (!btn) {
    // Retry common variants
    const alternativeId = buttonId === 'theme-toggle' ? 'themeToggle' : 'theme-toggle';
    btn = document.getElementById(alternativeId);
  }
  if (!btn) {
    btn = document.querySelector('.btn-theme-toggle') || document.querySelector('#themeToggle') || document.querySelector('#theme-toggle');
  }
  if (!btn) {
    return;
  }

  // Idempotent: never bind the same button twice (page may call this explicitly
  // AND the module may auto-bind on import).
  if (btn.dataset.rippleBound) {
    return;
  }
  btn.dataset.rippleBound = '1';

  btn.addEventListener('mouseenter', () => {
    if (window.AudioEngine) {
      window.AudioEngine._loadWaterDropSound();
    }
  });

  btn.addEventListener('click', () => {
    if (window.AudioEngine) {
      window.AudioEngine._loadWaterDropSound();
    }
    const currentTheme = getTheme();
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';

    // Only skip animation for reduced motion preference
    if (isReduced.matches) {
      applyTheme(nextTheme);
      saveTheme(nextTheme);
      return;
    }

    if (activeTransition) {
      const prev = activeTransition;
      activeTransition = null;
      if (!prev.revealed) {
        prev.transition?.skipTransition?.();
        prev.overlay?.remove();
        document.documentElement.classList.remove('theme-rippling');
        applyTheme(nextTheme);
        saveTheme(nextTheme);
        return;
      }
      prev.overlay?.remove();
      document.documentElement.classList.remove('theme-rippling');
    }

    toggleThemeWithAnimation(btn, nextTheme, getTheme, applyTheme);
    saveTheme(nextTheme);
  });
}

if (typeof window !== 'undefined') {
  window.initThemeToggleWithRipple = initThemeToggleWithRipple;

  // Auto-init: any theme that includes this module gets the teardrop switcher
  // out-of-the-box, as long as it has a #themeToggle / #theme-toggle button.
  // Per-theme scripts may still call initThemeToggleWithRipple() explicitly;
  // this guard avoids double-binding the same button.
  const autoBind = () => {
    const btn = document.getElementById('themeToggle') || document.getElementById('theme-toggle');
    if (!btn) return;
    const root = document.documentElement;
    const getTheme = () => root.getAttribute('data-theme') || 'dark';
    const applyTheme = (theme) => {
      root.setAttribute('data-theme', theme);
      document.body.setAttribute('data-theme', theme);
      const icon = document.getElementById('themeToggleIcon');
      if (icon) icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    };
    // Single canonical key shared by ALL themes (sketchbook / tactical / ironforge)
    // so switching on one page carries to the others.
    const THEME_KEY = 'tactical-theme';
    const saved = localStorage.getItem(THEME_KEY) || 'dark';
    applyTheme(saved === 'light' ? 'light' : 'dark');
    // initThemeToggleWithRipple sets its own rippleBound guard, so we must NOT
    // pre-set it here (doing so made init early-return and the toggle went dead).
    initThemeToggleWithRipple({
      buttonId: btn.id,
      getTheme,
      applyTheme,
      saveTheme: (t) => { localStorage.setItem(THEME_KEY, t); }
    });
  };

  // Cross-tab live sync: if the theme changes in another open tab, apply it here
  // too (storage events don't fire in the tab that made the change, by design).
  window.addEventListener('storage', (e) => {
    if (e.key === 'tactical-theme' && e.newValue) {
      document.documentElement.setAttribute('data-theme', e.newValue);
      document.body.setAttribute('data-theme', e.newValue);
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoBind);
  } else {
    autoBind();
  }
}

