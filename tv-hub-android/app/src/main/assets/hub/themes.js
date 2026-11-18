'use strict';

const THEME_STORAGE_KEY = 'bumiayu_theme';

const BUMIAYU_THEMES = [
  {
    id: 'pixel',
    name: 'Bumiayu 16-Bit Pixel Art',
    shortName: '16-Bit Pixel',
    subtitle: 'Retro Arcade & CRT Amber/Cyan',
    icon: '👾',
    accent: '#fbbf24',
    secondary: '#22d3ee',
  },
  {
    id: 'asri',
    name: 'Bumiayu Asri',
    shortName: 'Asri (Gugur)',
    subtitle: 'Musim Gugur Hangat & Daun Emas',
    icon: '🍁',
    accent: '#f59e0b',
    secondary: '#ea580c',
  },
  {
    id: 'samudra',
    name: 'Bumiayu Samudra',
    shortName: 'Samudra',
    subtitle: 'Laut Dalam Biru & Gelembung',
    icon: '🌊',
    accent: '#22d3ee',
    secondary: '#38bdf8',
  },
  {
    id: 'rintik',
    name: 'Bumiayu Rintik',
    shortName: 'Rintik (Hujan)',
    subtitle: 'Senja Berkabut & Rintik Hujan',
    icon: '🌧️',
    accent: '#93c5fd',
    secondary: '#a5b4fc',
  },
];

const VALID_THEME_IDS = new Set(BUMIAYU_THEMES.map((t) => t.id));

/**
 * Normalize a theme id, falling back to 'pixel' if invalid.
 * @param {string} id
 * @returns {'pixel'|'asri'|'samudra'|'rintik'}
 */
function normalizeThemeId(id) {
  if (typeof id !== 'string') return 'pixel';
  const trimmed = id.trim().toLowerCase();
  return VALID_THEME_IDS.has(trimmed) ? trimmed : 'pixel';
}

/**
 * Get theme metadata object by id.
 * @param {string} id
 */
function getThemeMeta(id) {
  const validId = normalizeThemeId(id);
  return BUMIAYU_THEMES.find((t) => t.id === validId) || BUMIAYU_THEMES[0];
}

function getDefaultStorage() {
  return typeof window !== 'undefined' && window.localStorage ? window.localStorage : null;
}

/**
 * Load saved theme id from storage, defaulting to 'pixel'.
 * @param {Storage} [storage]
 * @returns {'pixel'|'asri'|'samudra'|'rintik'}
 */
function loadTheme(storage) {
  const store = storage !== undefined ? storage : getDefaultStorage();
  if (!store) return 'pixel';
  try {
    const raw = store.getItem(THEME_STORAGE_KEY);
    return normalizeThemeId(raw);
  } catch (_err) {
    return 'pixel';
  }
}

/**
 * Save theme id to storage and return normalized id.
 * @param {string} id
 * @param {Storage} [storage]
 * @returns {'pixel'|'asri'|'samudra'|'rintik'}
 */
function saveTheme(id, storage) {
  const validId = normalizeThemeId(id);
  const store = storage !== undefined ? storage : getDefaultStorage();
  if (store) {
    try {
      store.setItem(THEME_STORAGE_KEY, validId);
    } catch (_err) {
      // Ignore storage quota or private mode errors
    }
  }
  return validId;
}

/**
 * Apply theme attribute to document root.
 * @param {string} id
 * @returns {'pixel'|'asri'|'samudra'|'rintik'}
 */
function applyTheme(id) {
  const validId = normalizeThemeId(id);
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.setAttribute('data-theme', validId);
  }
  return validId;
}

/**
 * Lightweight 60fps Canvas particle renderer (<= 22 particles) for Mali-450.
 * Automatically pauses when document.hidden is true.
 */
class BumiayuParticleEngine {
  /**
   * @param {HTMLCanvasElement|null} canvas
   * @param {string} [initialTheme]
   */
  constructor(canvas, initialTheme) {
    this.canvas = canvas || null;
    this.ctx = this.canvas && typeof this.canvas.getContext === 'function'
      ? this.canvas.getContext('2d')
      : null;
    this.theme = normalizeThemeId(initialTheme);
    this.maxParticles = 20;
    this.particles = [];
    this.rafId = null;
    this.running = false;
    this.width = 0;
    this.height = 0;
    this.lastTime = 0;

    this._onResize = () => this.resize();
    this._onVisibility = () => this._handleVisibilityChange();
    this._tick = (ts) => this._loop(ts);
  }

  resize() {
    if (!this.canvas || typeof window === 'undefined') return;
    const w = window.innerWidth || 1280;
    const h = window.innerHeight || 720;
    this.width = w;
    this.height = h;
    // Keep 1:1 pixel ratio for Mali-450 GPU performance
    this.canvas.width = w;
    this.canvas.height = h;
  }

  setTheme(themeId) {
    const next = normalizeThemeId(themeId);
    if (next !== this.theme || this.particles.length === 0) {
      this.theme = next;
      this._initParticles();
    }
  }

  start() {
    if (!this.ctx || this.running) return;
    this.running = true;
    this.resize();
    this._initParticles();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this._onResize);
    }
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this._onVisibility);
    }
    if (typeof document === 'undefined' || !document.hidden) {
      this._scheduleFrame();
    }
  }

  stop() {
    this.running = false;
    this._cancelFrame();
  }

  destroy() {
    this.stop();
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this._onResize);
    }
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this._onVisibility);
    }
    this.particles = [];
  }

  _handleVisibilityChange() {
    if (!this.running) return;
    if (typeof document !== 'undefined' && document.hidden) {
      this._cancelFrame();
    } else {
      this.lastTime = 0;
      this._scheduleFrame();
    }
  }

  _scheduleFrame() {
    if (this.rafId !== null || typeof requestAnimationFrame !== 'function') return;
    this.rafId = requestAnimationFrame(this._tick);
  }

  _cancelFrame() {
    if (this.rafId !== null && typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(this.rafId);
    }
    this.rafId = null;
  }

  _initParticles() {
    const w = this.width || 1280;
    const h = this.height || 720;
    this.particles = [];
    for (let i = 0; i < this.maxParticles; i += 1) {
      this.particles.push(this._createParticle(w, h, true));
    }
  }

  _createParticle(w, h, randomPos) {
    const x = Math.random() * w;
    if (this.theme === 'pixel') {
      return {
        x,
        y: Math.random() * h * 0.78,
        size: Math.random() < 0.35 ? 4 : 3,
        phase: Math.random() * Math.PI * 2,
        speed: 0.8 + Math.random() * 1.4,
        vx: (Math.random() - 0.5) * 6,
        color: Math.random() < 0.5 ? '#fbbf24' : '#22d3ee',
      };
    }
    if (this.theme === 'asri') {
      const colors = ['#f59e0b', '#ea580c', '#fbbf24', '#d97706'];
      return {
        x,
        y: randomPos ? Math.random() * h : -20,
        size: 7 + Math.random() * 6,
        vx: 16 + Math.random() * 22,
        vy: 28 + Math.random() * 28,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 1.8,
        swayPhase: Math.random() * Math.PI * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    }
    if (this.theme === 'samudra') {
      return {
        x,
        y: randomPos ? Math.random() * h : h + 20,
        radius: 4 + Math.random() * 9,
        vy: -(22 + Math.random() * 26),
        swayPhase: Math.random() * Math.PI * 2,
        alpha: 0.16 + Math.random() * 0.24,
      };
    }
    // rintik
    return {
      x: randomPos ? Math.random() * w : Math.random() * (w + 180) - 90,
      y: randomPos ? Math.random() * h : -30,
      len: 16 + Math.random() * 18,
      vx: -65 - Math.random() * 25,
      vy: 340 + Math.random() * 160,
      alpha: 0.22 + Math.random() * 0.28,
    };
  }

  _loop(timestamp) {
    this.rafId = null;
    if (!this.running || !this.ctx) return;
    if (typeof document !== 'undefined' && document.hidden) return;

    const dt = this.lastTime ? Math.min(0.05, (timestamp - this.lastTime) / 1000) : 0.016;
    this.lastTime = timestamp;

    this._renderFrame(dt, timestamp / 1000);
    this._scheduleFrame();
  }

  _renderFrame(dt, elapsed) {
    const ctx = this.ctx;
    const w = this.width || 1280;
    const h = this.height || 720;
    ctx.clearRect(0, 0, w, h);

    if (this.theme === 'pixel') {
      this._renderPixel(ctx, w, h, dt, elapsed);
    } else if (this.theme === 'asri') {
      this._renderAsri(ctx, w, h, dt, elapsed);
    } else if (this.theme === 'samudra') {
      this._renderSamudra(ctx, w, h, dt, elapsed);
    } else {
      this._renderRintik(ctx, w, h, dt);
    }
  }

  _renderPixel(ctx, w, h, dt, elapsed) {
    // Subtle retro horizon grid at bottom
    const horizonY = Math.floor(h * 0.72);
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.09)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i <= 5; i += 1) {
      const y = horizonY + Math.floor(((i * i) / 25) * (h - horizonY));
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    }
    const centerX = w * 0.5;
    for (let i = -5; i <= 5; i += 1) {
      ctx.moveTo(centerX + i * 70, horizonY);
      ctx.lineTo(centerX + i * 240, h);
    }
    ctx.stroke();

    // Twinkling pixel stars
    for (let i = 0; i < this.particles.length; i += 1) {
      const p = this.particles[i];
      p.x = (p.x + p.vx * dt + w) % w;
      const alpha = 0.25 + 0.65 * Math.abs(Math.sin(elapsed * p.speed + p.phase));
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
    }
    ctx.globalAlpha = 1;
  }

  _renderAsri(ctx, w, h, dt, elapsed) {
    for (let i = 0; i < this.particles.length; i += 1) {
      const p = this.particles[i];
      p.x += (p.vx + Math.sin(elapsed * 1.4 + p.swayPhase) * 14) * dt;
      p.y += p.vy * dt;
      p.angle += p.spin * dt;

      if (p.y > h + 24 || p.x > w + 24) {
        this.particles[i] = this._createParticle(w, h, false);
        this.particles[i].x = Math.random() * w * 0.9;
        continue;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.globalAlpha = 0.72;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 0.52, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }

  _renderSamudra(ctx, w, h, dt, elapsed) {
    for (let i = 0; i < this.particles.length; i += 1) {
      const p = this.particles[i];
      p.y += p.vy * dt;
      p.x += Math.sin(elapsed * 1.6 + p.swayPhase) * 12 * dt;

      if (p.y < -24) {
        this.particles[i] = this._createParticle(w, h, false);
        continue;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(56, 189, 248, ${p.alpha * 0.45})`;
      ctx.fill();
      ctx.strokeStyle = `rgba(186, 230, 253, ${p.alpha})`;
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
  }

  _renderRintik(ctx, w, h, dt) {
    ctx.lineWidth = 1.4;
    for (let i = 0; i < this.particles.length; i += 1) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      if (p.y > h + 30 || p.x < -40) {
        this.particles[i] = this._createParticle(w, h, false);
        continue;
      }

      ctx.strokeStyle = `rgba(147, 197, 253, ${p.alpha})`;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - p.len * 0.2, p.y + p.len);
      ctx.stroke();
    }
  }
}

const exported = {
  THEME_STORAGE_KEY,
  BUMIAYU_THEMES,
  normalizeThemeId,
  getThemeMeta,
  loadTheme,
  saveTheme,
  applyTheme,
  BumiayuParticleEngine,
};

if (typeof window !== 'undefined') {
  window.BumiayuThemes = exported;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = exported;
}
