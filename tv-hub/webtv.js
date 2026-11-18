'use strict';

const CHANNEL_STORAGE_KEY = 'bumiayu_webtv_channels';
const LOCK_STORAGE_KEY = 'bumiayu_lock_config';
const FAV_STORAGE_KEY = 'bumiayu_webtv_favorites';

const DEFAULT_CHANNELS = {
  nasional: [
    {
      id: 'tvri-nasional',
      name: 'TVRI Nasional',
      url: 'https://ott-balancer.tvri.go.id/live/eds/Nasional/hls/Nasional.m3u8',
      category: 'nasional',
      type: 'hls',
    },
    {
      id: 'kompas-tv',
      name: 'Kompas TV',
      url: 'https://www.kompas.tv/live',
      category: 'nasional',
      type: 'web',
    },
    {
      id: 'cnn-indonesia',
      name: 'CNN Indonesia',
      url: 'https://www.cnnindonesia.com/tv',
      category: 'nasional',
      type: 'web',
    },
    {
      id: 'metro-tv',
      name: 'Metro TV',
      url: 'https://www.metrotvnews.com/live',
      category: 'nasional',
      type: 'web',
    },
    {
      id: 'trans-tv',
      name: 'Trans TV',
      url: 'https://www.transtv.co.id/live',
      category: 'nasional',
      type: 'web',
    },
    {
      id: 'net-tv',
      name: 'NET TV',
      url: 'https://www.netmedia.co.id/live-streaming',
      category: 'nasional',
      type: 'web',
    },
  ],
  internasional: [
    {
      id: 'nhk-world',
      name: 'NHK World Japan',
      url: 'https://nhkwlive-ojp.akamaized.net/hls/live/2003459/nhkwlive-ojp-en/index.m3u8',
      category: 'internasional',
      type: 'hls',
    },
    {
      id: 'al-jazeera-en',
      name: 'Al Jazeera English',
      url: 'https://live-hls-web-aje.getaj.net/AJE/index.m3u8',
      category: 'internasional',
      type: 'hls',
    },
    {
      id: 'dw-english',
      name: 'DW English',
      url: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8',
      category: 'internasional',
      type: 'hls',
    },
    {
      id: 'france-24-en',
      name: 'France 24 English',
      url: 'https://www.france24.com/en/live',
      category: 'internasional',
      type: 'web',
    },
    {
      id: 'nasa-tv',
      name: 'NASA TV',
      url: 'https://plus.nasa.gov/scheduled-video/nasa-tv-public/',
      category: 'internasional',
      type: 'web',
    },
  ],
  adult: [
    {
      id: 'adult-placeholder-1',
      name: 'Slot Custom 18+ (Import M3U)',
      url: '',
      category: 'adult',
      type: 'hls',
      isPlaceholder: true,
    },
  ],
};

function getDefaultStorage() {
  return typeof window !== 'undefined' && window.localStorage ? window.localStorage : null;
}

/**
 * Deterministic synchronous pure-JS hash (dual-round salted FNV-1a)
 * so Node unit tests and file:// WebView work identically without crypto.subtle.
 * @param {string} secret
 * @returns {string}
 */
function hashSecret(secret) {
  const input = `bumiayu-tv-v1:${String(secret == null ? '' : secret)}`;
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  for (let i = 0; i < input.length; i += 1) {
    const c = input.charCodeAt(i);
    h1 ^= c;
    h1 = Math.imul(h1, 0x01000193) >>> 0;
    h2 ^= (c + i) & 0xff;
    h2 = Math.imul(h2, 0x85ebca6b) >>> 0;
  }
  return `fnv1a:${h1.toString(16).padStart(8, '0')}${h2.toString(16).padStart(8, '0')}`;
}

/**
 * Normalize a D-Pad pattern (array or comma-separated string) into canonical form.
 * @param {string|string[]} pattern
 * @returns {string}
 */
function normalizePattern(pattern) {
  const raw = Array.isArray(pattern) ? pattern : String(pattern || '').split(',');
  return raw
    .map((step) => String(step).trim().toUpperCase())
    .filter((step) => step === 'UP' || step === 'DOWN' || step === 'LEFT' || step === 'RIGHT')
    .join(',');
}

/**
 * Determine stream type ('hls' | 'web') from URL.
 * @param {string} url
 * @returns {'hls'|'web'}
 */
function inferStreamType(url) {
  const lower = String(url || '').toLowerCase();
  if (/\.(m3u8|mp4|webm|ts)(\?.*)?$/i.test(lower) || lower.includes('.m3u8')) {
    return 'hls';
  }
  return 'web';
}

/**
 * Parse M3U playlist text into normalized channel objects.
 * @param {string} text
 * @param {'nasional'|'internasional'|'adult'} [defaultCategory='nasional']
 * @returns {Array<{id: string, name: string, url: string, category: string, type: 'hls'|'web'}>}
 */
function parseM3U(text, defaultCategory = 'nasional') {
  if (typeof text !== 'string' || !text.trim()) return [];
  const validCat = ['nasional', 'internasional', 'adult'].includes(defaultCategory)
    ? defaultCategory
    : 'nasional';

  const lines = text.split(/\r?\n/);
  const channels = [];
  let pendingName = '';

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (!line) continue;

    if (line.startsWith('#EXTINF:')) {
      const commaIdx = line.lastIndexOf(',');
      pendingName = commaIdx !== -1 ? line.slice(commaIdx + 1).trim() : '';
      continue;
    }

    if (line.startsWith('#')) {
      continue;
    }

    if (/^https?:\/\//i.test(line)) {
      const name = pendingName || `Channel ${channels.length + 1}`;
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || 'ch';
      channels.push({
        id: `m3u-${slug}-${channels.length + 1}`,
        name,
        url: line,
        category: validCat,
        type: inferStreamType(line),
      });
      pendingName = '';
    } else {
      pendingName = '';
    }
  }

  return channels;
}

function getDefaultLockConfig() {
  return {
    isConfigured: false,
    mode: 'pin',
    hash: null,
    hideAdultTab: true,
  };
}

/**
 * Load lock configuration from storage.
 * @param {Storage} [storage]
 * @returns {{ isConfigured: boolean, mode: 'pin'|'pattern', hash: string|null, hideAdultTab: boolean }}
 */
function loadLockConfig(storage) {
  const defaults = getDefaultLockConfig();
  const store = storage !== undefined ? storage : getDefaultStorage();
  if (!store) return defaults;

  try {
    const raw = store.getItem(LOCK_STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return defaults;

    const isConfigured = Boolean(parsed.isConfigured);
    const mode = parsed.mode === 'pattern' ? 'pattern' : 'pin';
    const hash = typeof parsed.hash === 'string' && parsed.hash ? parsed.hash : (isConfigured ? defaults.hash : null);
    const hideAdultTab = parsed.hideAdultTab !== undefined ? Boolean(parsed.hideAdultTab) : defaults.hideAdultTab;
    return { isConfigured, mode, hash, hideAdultTab };
  } catch (_err) {
    return defaults;
  }
}

/**
 * Save lock configuration to storage.
 * @param {{ isConfigured?: boolean, mode?: 'pin'|'pattern', hash?: string|null, hideAdultTab?: boolean }} cfg
 * @param {Storage} [storage]
 * @returns {{ isConfigured: boolean, mode: 'pin'|'pattern', hash: string|null, hideAdultTab: boolean }}
 */
function saveLockConfig(cfg, storage) {
  const current = loadLockConfig(storage);
  const isConfigured = cfg && typeof cfg.isConfigured === 'boolean' ? cfg.isConfigured : (cfg && cfg.hash ? true : current.isConfigured);
  const next = {
    isConfigured,
    mode: cfg && cfg.mode === 'pattern' ? 'pattern' : cfg && cfg.mode === 'pin' ? 'pin' : current.mode,
    hash: cfg && cfg.hash !== undefined ? cfg.hash : current.hash,
    hideAdultTab: cfg && typeof cfg.hideAdultTab === 'boolean' ? cfg.hideAdultTab : current.hideAdultTab,
  };
  const store = storage !== undefined ? storage : getDefaultStorage();
  if (store) {
    try {
      store.setItem(LOCK_STORAGE_KEY, JSON.stringify(next));
    } catch (_err) {
      // Ignore storage errors
    }
  }
  return next;
}

/**
 * Verify a PIN or D-Pad pattern string/array against lockConfig.
 * @param {string|string[]} input
 * @param {{ isConfigured?: boolean, mode: string, hash: string }} lockConfig
 * @returns {boolean}
 */
function verifyLockSecret(input, lockConfig) {
  if (!lockConfig || !lockConfig.isConfigured || typeof lockConfig.hash !== 'string' || !lockConfig.hash) {
    return false;
  }
  if (input == null) return false;
  const normalized = Array.isArray(input) ? normalizePattern(input) : String(input).trim();
  if (!normalized) return false;
  return hashSecret(normalized) === lockConfig.hash;
}

/**
 * Sort channels so favorites appear first while preserving relative order.
 * @param {Array<{id: string}>} channels
 * @param {string[]} favoriteIds
 * @returns {Array}
 */
function sortChannelsWithFavorites(channels, favoriteIds) {
  if (!Array.isArray(channels)) return [];
  const favSet = new Set(Array.isArray(favoriteIds) ? favoriteIds : []);
  const favs = [];
  const rest = [];
  for (let i = 0; i < channels.length; i += 1) {
    const ch = channels[i];
    if (ch && favSet.has(ch.id)) {
      favs.push(ch);
    } else {
      rest.push(ch);
    }
  }
  return favs.concat(rest);
}

function cloneDefaultChannels() {
  return {
    nasional: DEFAULT_CHANNELS.nasional.map((c) => ({ ...c })),
    internasional: DEFAULT_CHANNELS.internasional.map((c) => ({ ...c })),
    adult: DEFAULT_CHANNELS.adult.map((c) => ({ ...c })),
  };
}

/**
 * Load channel catalog from storage, falling back to DEFAULT_CHANNELS.
 * @param {Storage} [storage]
 */
function loadChannels(storage) {
  const base = cloneDefaultChannels();
  const store = storage !== undefined ? storage : getDefaultStorage();
  if (!store) return base;

  try {
    const raw = store.getItem(CHANNEL_STORAGE_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return base;
    return {
      nasional: Array.isArray(parsed.nasional) ? parsed.nasional : base.nasional,
      internasional: Array.isArray(parsed.internasional) ? parsed.internasional : base.internasional,
      adult: Array.isArray(parsed.adult) ? parsed.adult : base.adult,
    };
  } catch (_err) {
    return base;
  }
}

function saveChannels(channels, storage) {
  const store = storage !== undefined ? storage : getDefaultStorage();
  if (store) {
    try {
      store.setItem(CHANNEL_STORAGE_KEY, JSON.stringify(channels));
    } catch (_err) {
      // Ignore storage errors
    }
  }
  return channels;
}

function loadFavorites(storage) {
  const store = storage !== undefined ? storage : getDefaultStorage();
  if (!store) return [];
  try {
    const raw = store.getItem(FAV_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : [];
  } catch (_err) {
    return [];
  }
}

function saveFavorites(favIds, storage) {
  const clean = Array.from(new Set(Array.isArray(favIds) ? favIds : []));
  const store = storage !== undefined ? storage : getDefaultStorage();
  if (store) {
    try {
      store.setItem(FAV_STORAGE_KEY, JSON.stringify(clean));
    } catch (_err) {
      // Ignore storage errors
    }
  }
  return clean;
}

function isAdultTabVisible(lockConfig, isUnlocked) {
  if (!lockConfig) return false;
  if (lockConfig.hideAdultTab) return false;
  return Boolean(isUnlocked);
}

// --- Browser / WebView Controller ---
(function initWebTvBrowser() {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return;
  }

  let channelsByCat = loadChannels();
  let favoriteIds = loadFavorites();
  let lockConfig = loadLockConfig();
  let activeCategory = 'nasional';
  let isAdultUnlocked = false;
  let pendingUnlockAction = null;
  let playbackToken = 0;
  let lastFocusElement = null;

  let pinBuffer = '';
  let patternBuffer = [];
  let settingsPatternBuffer = [];
  let settingsSelectedMode = lockConfig.mode;

  let activePlayerChannels = [];
  let activePlayerIndex = -1;
  let hlsInstance = null;
  let hlsLoadPromise = null;
  let toastTimer = null;

  const ARROW_GLYPHS = {
    UP: '↑',
    DOWN: '↓',
    LEFT: '←',
    RIGHT: '→',
  };

  function applyThemeAndParticles() {
    let themeId = 'pixel';
    try {
      const saved = window.localStorage && window.localStorage.getItem('bumiayu_theme');
      if (saved) themeId = saved;
    } catch (_err) {
      // Ignore
    }

    if (window.BumiayuThemes) {
      if (typeof window.BumiayuThemes.applyTheme === 'function') {
        window.BumiayuThemes.applyTheme(themeId);
      } else {
        document.documentElement.setAttribute('data-theme', themeId);
      }
      if (typeof window.BumiayuThemes.BumiayuParticleEngine === 'function') {
        const canvas = document.getElementById('bg-canvas');
        if (canvas) {
          const engine = new window.BumiayuThemes.BumiayuParticleEngine(canvas, themeId);
          engine.start();
        }
      }
    } else {
      document.documentElement.setAttribute('data-theme', themeId);
    }
  }

  function showToast(msg) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('visible'), 3000);
  }

  function updateClock() {
    const now = new Date();
    const clockEl = document.getElementById('live-clock');
    const dateEl = document.getElementById('live-date');
    if (clockEl) {
      clockEl.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    }
    if (dateEl) {
      const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      dateEl.textContent = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
    }
  }

  function renderTabs() {
    document.querySelectorAll('.webtv-tab').forEach((tab) => {
      const cat = tab.dataset.category;
      const isSelected = cat === activeCategory;
      tab.classList.toggle('active', isSelected);
      tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    });
  }

  function renderChannelGrid() {
    const grid = document.getElementById('channel-grid');
    const emptyEl = document.getElementById('channel-empty');
    if (!grid) return;

    let rawList = [];
    if (activeCategory === 'favorit') {
      const favSet = new Set(favoriteIds);
      const all = (channelsByCat.nasional || []).concat(channelsByCat.internasional || []);
      rawList = all.filter((ch) => favSet.has(ch.id));
    } else {
      rawList = channelsByCat[activeCategory] || [];
    }

    const sorted = activeCategory === 'favorit' ? rawList : sortChannelsWithFavorites(rawList, favoriteIds);
    grid.innerHTML = '';

    if (sorted.length === 0) {
      if (emptyEl) {
        emptyEl.hidden = false;
        emptyEl.textContent = activeCategory === 'favorit'
          ? 'Belum ada channel favorit. Tekan ★ pada channel untuk menambahkannya ke sini.'
          : 'Belum ada channel di kategori ini. Tambahkan atau impor playlist M3U melalui ⚙️ Pengaturan & Sandi.';
      }
      return;
    }
    if (emptyEl) emptyEl.hidden = true;

    const favSet = new Set(favoriteIds);

    sorted.forEach((ch, idx) => {
      const card = document.createElement('div');
      card.className = 'channel-card focusable-item';
      card.tabIndex = 0;
      card.dataset.channelId = ch.id;
      card.dataset.index = String(idx);

      const isFav = favSet.has(ch.id);
      const badgeClass = ch.type === 'hls' ? 'badge-hls' : 'badge-web';
      const badgeLabel = ch.type === 'hls' ? 'HLS STREAM' : 'WEB TV';

      card.innerHTML = `
        <div class="channel-card-top">
          <span class="channel-badge ${badgeClass}">${badgeLabel}</span>
          <button type="button" class="fav-btn ${isFav ? 'is-fav' : ''}" aria-label="Favorit" title="Tandai Favorit">${isFav ? '★' : '☆'}</button>
        </div>
        <div class="channel-name">${escapeHtml(ch.name)}</div>
        <div class="channel-meta">${ch.isPlaceholder ? 'Belum ada URL — import M3U di Pengaturan' : escapeHtml(ch.url)}</div>
      `;

      const favBtn = card.querySelector('.fav-btn');
      favBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorite(ch.id);
      });

      card.addEventListener('click', () => {
        launchChannel(ch, sorted);
      });

      card.addEventListener('keydown', (e) => {
        if (e.target && e.target.closest('.fav-btn')) {
          return;
        }
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          launchChannel(ch, sorted);
        } else if (e.key === 'f' || e.key === 'F') {
          e.preventDefault();
          toggleFavorite(ch.id);
        }
      });

      grid.appendChild(card);
    });
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function toggleFavorite(channelId) {
    const hadFavFocus = document.activeElement && document.activeElement.classList.contains('fav-btn');
    const idx = favoriteIds.indexOf(channelId);
    if (idx === -1) {
      favoriteIds = [channelId].concat(favoriteIds);
      showToast('Ditambahkan ke Favorit ★');
    } else {
      favoriteIds = favoriteIds.filter((id) => id !== channelId);
      showToast('Dihapus dari Favorit');
    }
    saveFavorites(favoriteIds);
    renderChannelGrid();
    const targetCard = document.querySelector(`.channel-card[data-channel-id="${channelId}"]`);
    if (targetCard) {
      const targetEl = hadFavFocus ? targetCard.querySelector('.fav-btn') : targetCard;
      if (targetEl) targetEl.focus();
    }
  }

  function ensureHlsJs() {
    if (window.Hls) return Promise.resolve(window.Hls);
    if (hlsLoadPromise) return hlsLoadPromise;
    hlsLoadPromise = new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1/dist/hls.min.js';
      script.async = true;
      script.onload = () => resolve(window.Hls || null);
      script.onerror = () => {
        hlsLoadPromise = null;
        resolve(null);
      };
      document.head.appendChild(script);
    });
    return hlsLoadPromise;
  }

  function launchChannel(channel, listInCategory) {
    if (!channel || !channel.url) {
      showToast('Channel ini belum memiliki URL. Tambahkan di Pengaturan & Sandi.');
      return;
    }

    if (channel.type === 'web') {
      if (window.TvBridge && typeof window.TvBridge.openWebApp === 'function') {
        window.TvBridge.openWebApp(channel.name, channel.url, `webtv-${channel.id}`);
      } else {
        showToast(`Membuka ${channel.name}...`);
        window.open(channel.url, '_blank', 'noopener');
      }
      return;
    }

    // HLS / Direct video playback
    activePlayerChannels = (listInCategory || []).filter((c) => c.type === 'hls' && c.url);
    activePlayerIndex = Math.max(
      0,
      activePlayerChannels.findIndex((c) => c.id === channel.id)
    );
    openPlayerOverlay(channel);
  }

  function openPlayerOverlay(channel) {
    const overlay = document.getElementById('player-overlay');
    const video = document.getElementById('tv-player');
    const titleEl = document.getElementById('player-channel-name');
    const metaEl = document.getElementById('player-channel-meta');
    if (!overlay || !video) return;

    if (overlay.hidden) {
      lastFocusElement = document.activeElement;
    }
    const token = ++playbackToken;
    overlay.hidden = false;
    if (titleEl) titleEl.textContent = channel.name;
    if (metaEl) {
      const posText = activePlayerChannels.length > 0
        ? `Channel ${activePlayerIndex + 1}/${activePlayerChannels.length}`
        : 'Live Stream';
      metaEl.textContent = `${posText} • ▲/▼ Ganti Channel • ESC/Back Tutup`;
    }

    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }

    video.pause();
    video.removeAttribute('src');
    video.load();

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = channel.url;
      video.play().catch(() => {});
    } else {
      ensureHlsJs().then((Hls) => {
        if (overlay.hidden || token !== playbackToken) return;
        if (hlsInstance) {
          hlsInstance.destroy();
          hlsInstance = null;
        }
        if (Hls && Hls.isSupported()) {
          hlsInstance = new Hls({ enableWorker: true });
          hlsInstance.loadSource(channel.url);
          hlsInstance.attachMedia(video);
          hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
            if (token === playbackToken) video.play().catch(() => {});
          });
          hlsInstance.on(Hls.Events.ERROR, (_ev, data) => {
            if (data && data.fatal && token === playbackToken) {
              showToast(`Stream ${channel.name} tidak merespons.`);
            }
          });
        } else {
          video.src = channel.url;
          video.play().catch(() => {
            if (token === playbackToken) {
              showToast(`Format stream ${channel.name} tidak didukung di browser ini.`);
            }
          });
        }
      });
    }
  }

  function closePlayerOverlay() {
    playbackToken++;
    const overlay = document.getElementById('player-overlay');
    const video = document.getElementById('tv-player');
    if (hlsInstance) {
      hlsInstance.destroy();
      hlsInstance = null;
    }
    if (video) {
      video.pause();
      video.removeAttribute('src');
      video.load();
    }
    if (overlay) overlay.hidden = true;
    if (lastFocusElement && lastFocusElement.isConnected) {
      lastFocusElement.focus();
    }
  }

  function zapChannel(delta) {
    if (activePlayerChannels.length <= 1) return;
    activePlayerIndex =
      (activePlayerIndex + delta + activePlayerChannels.length) % activePlayerChannels.length;
    openPlayerOverlay(activePlayerChannels[activePlayerIndex]);
  }

  // --- Lock Modal ---
  function openLockModal(onSuccess) {
    const modal = document.getElementById('lock-modal');
    if (!modal) return;
    pendingUnlockAction = onSuccess || null;
    pinBuffer = '';
    patternBuffer = [];

    const isPattern = lockConfig.mode === 'pattern';
    const pinPane = document.getElementById('lock-pin-pane');
    const patternPane = document.getElementById('lock-pattern-pane');
    const errEl = document.getElementById('lock-error');

    if (pinPane) pinPane.hidden = isPattern;
    if (patternPane) patternPane.hidden = !isPattern;
    if (errEl) errEl.textContent = '';

    updatePinDisplay();
    updatePatternDisplay();

    if (typeof modal.showModal === 'function') {
      modal.showModal();
    } else {
      modal.setAttribute('open', '');
    }

    const firstBtn = modal.querySelector(isPattern ? '.pattern-key' : '.pin-key');
    if (firstBtn) firstBtn.focus();
  }

  function closeLockModal() {
    const modal = document.getElementById('lock-modal');
    if (!modal) return;
    if (typeof modal.close === 'function' && modal.open) {
      modal.close();
    } else {
      modal.removeAttribute('open');
    }
    pendingUnlockAction = null;
  }

  function updatePinDisplay() {
    const display = document.getElementById('pin-dots');
    if (!display) return;
    const filled = '●'.repeat(pinBuffer.length);
    const empty = '○'.repeat(Math.max(0, 4 - pinBuffer.length));
    display.textContent = `${filled}${empty}`;
  }

  function updatePatternDisplay() {
    const display = document.getElementById('pattern-badges');
    if (!display) return;
    if (patternBuffer.length === 0) {
      display.innerHTML = '<span class="pattern-placeholder">Tekan 4–6 arah D-Pad / tombol arah...</span>';
      return;
    }
    display.innerHTML = patternBuffer
      .map((dir) => `<span class="pattern-badge">${ARROW_GLYPHS[dir] || dir}</span>`)
      .join('');
  }

  function submitLockAttempt() {
    const errEl = document.getElementById('lock-error');
    const input = lockConfig.mode === 'pattern' ? patternBuffer : pinBuffer;

    if (lockConfig.mode === 'pin' && pinBuffer.length !== 4) {
      if (errEl) errEl.textContent = 'Masukkan 4 digit PIN.';
      return;
    }
    if (lockConfig.mode === 'pattern' && patternBuffer.length < 4) {
      if (errEl) errEl.textContent = 'Minimal 4 arah pola remote.';
      return;
    }

    if (verifyLockSecret(input, lockConfig)) {
      isAdultUnlocked = true;
      const action = pendingUnlockAction;
      closeLockModal();
      renderTabs();
      showToast('Mode 18+ terbuka untuk sesi ini.');
      if (typeof action === 'function') action();
    } else {
      if (errEl) errEl.textContent = lockConfig.mode === 'pattern' ? 'Pola arah salah!' : 'PIN salah!';
      pinBuffer = '';
      patternBuffer = [];
      updatePinDisplay();
      updatePatternDisplay();
    }
  }

  let settingsPatternStep = 1; // 1: input, 2: confirm
  let settingsPatternConfirmBuffer = [];

  function setSettingsStatus(msg, isSuccess) {
    const el = document.getElementById('settings-status');
    if (!el) return;
    el.textContent = msg || '';
    el.style.color = isSuccess ? '#34d399' : '#f87171';
  }

  function updateAdultSessionUI() {
    const lockedPane = document.getElementById('adult-session-locked-pane');
    const unlockedPane = document.getElementById('adult-session-unlocked-pane');
    const container = document.getElementById('adult-channel-list-container');
    if (lockedPane) lockedPane.hidden = isAdultUnlocked;
    if (unlockedPane) unlockedPane.hidden = !isAdultUnlocked;

    if (container) {
      container.innerHTML = '';
      if (!isAdultUnlocked) return;
      const adultList = (channelsByCat.adult || []).filter((ch) => !ch.isPlaceholder && ch.url);
      if (adultList.length === 0) {
        container.innerHTML = '<p style="color:var(--text-secondary);font-size:0.85rem;margin:0;">Belum ada channel dewasa aktif. Impor playlist M3U di bagian bawah dialog ini.</p>';
        return;
      }
      adultList.forEach((ch) => {
        const item = document.createElement('div');
        item.style.display = 'flex';
        item.style.alignItems = 'center';
        item.style.justifyContent = 'space-between';
        item.style.padding = '8px 10px';
        item.style.borderBottom = '1px solid rgba(255,255,255,0.08)';
        item.innerHTML = `
          <div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-right:8px;">
            <span style="font-weight:700;color:#ffffff;font-size:0.9rem;">${escapeHtml(ch.name)}</span>
            <span style="color:var(--text-secondary);font-size:0.75rem;display:block;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(ch.url)}</span>
          </div>
          <button type="button" class="btn btn-secondary btn-play-adult" style="font-size:0.8rem;padding:4px 10px;flex-shrink:0;">Putar</button>
        `;
        const playBtn = item.querySelector('.btn-play-adult');
        playBtn.addEventListener('click', () => {
          closeSettingsModal();
          launchChannel(ch, adultList);
        });
        container.appendChild(item);
      });
    }
  }

  // --- Settings & M3U Modal ---
  function openSettingsModal() {
    const modal = document.getElementById('webtv-settings-modal');
    if (!modal) return;
    lastFocusElement = document.activeElement;
    settingsSelectedMode = lockConfig.mode || 'pin';
    settingsPatternBuffer = [];
    settingsPatternConfirmBuffer = [];
    settingsPatternStep = 1;
    setSettingsStatus('', false);

    const currentSecGroup = document.getElementById('setting-current-sec-group');
    const currentSecInput = document.getElementById('setting-current-secret');
    const noteEl = document.getElementById('sec-config-note');
    const saveLockBtn = document.getElementById('btn-save-lock');
    const newPinInput = document.getElementById('setting-new-pin');
    const confirmPinInput = document.getElementById('setting-confirm-pin');

    if (currentSecInput) currentSecInput.value = '';
    if (newPinInput) newPinInput.value = '';
    if (confirmPinInput) confirmPinInput.value = '';

    if (lockConfig.isConfigured) {
      if (currentSecGroup) currentSecGroup.hidden = false;
      if (noteEl) noteEl.textContent = 'Sandi sudah aktif. Masukkan sandi saat ini untuk mengubah sandi atau membuka menu rahasia.';
      if (saveLockBtn) saveLockBtn.textContent = 'Ubah Sandi';
    } else {
      if (currentSecGroup) currentSecGroup.hidden = true;
      if (noteEl) noteEl.textContent = 'Sandi belum dikonfigurasi. Buat Sandi Baru (Pilih Mode: PIN 4 Digit atau Pola D-Pad Remote).';
      if (saveLockBtn) saveLockBtn.textContent = 'Simpan & Aktifkan Sandi';
    }

    updateSettingsModeUI();
    updateSettingsPatternDisplay();
    updateAdultSessionUI();

    if (typeof modal.showModal === 'function') {
      modal.showModal();
    } else {
      modal.setAttribute('open', '');
    }
    const firstBtn = document.getElementById('mode-btn-pin');
    if (firstBtn) firstBtn.focus();
  }

  function closeSettingsModal() {
    const modal = document.getElementById('webtv-settings-modal');
    if (!modal) return;
    if (typeof modal.close === 'function' && modal.open) {
      modal.close();
    } else {
      modal.removeAttribute('open');
    }
    if (lastFocusElement && lastFocusElement.isConnected) {
      lastFocusElement.focus();
    }
  }

  function updateSettingsModeUI() {
    const pinBtn = document.getElementById('mode-btn-pin');
    const patBtn = document.getElementById('mode-btn-pattern');
    const pinGroup = document.getElementById('setting-pin-group');
    const patGroup = document.getElementById('setting-pattern-group');

    if (pinBtn) pinBtn.classList.toggle('btn-primary', settingsSelectedMode === 'pin');
    if (patBtn) patBtn.classList.toggle('btn-primary', settingsSelectedMode === 'pattern');
    if (pinGroup) pinGroup.hidden = settingsSelectedMode !== 'pin';
    if (patGroup) patGroup.hidden = settingsSelectedMode !== 'pattern';
  }

  function updateSettingsPatternDisplay() {
    const el = document.getElementById('setting-pattern-preview');
    const confirmEl = document.getElementById('setting-pattern-confirm-preview');
    const confirmWrap = document.getElementById('setting-pattern-confirm-wrap');
    const stepLabel = document.getElementById('setting-pattern-step-label');
    const nextBtn = document.getElementById('btn-pattern-next-step');

    if (el) {
      if (settingsPatternBuffer.length === 0) {
        el.innerHTML = '<span class="pattern-placeholder">Langkah 1: Rekam 4–6 arah pola...</span>';
      } else {
        el.innerHTML = settingsPatternBuffer
          .map((dir) => `<span class="pattern-badge">${ARROW_GLYPHS[dir] || dir}</span>`)
          .join('');
      }
    }

    if (confirmWrap) confirmWrap.hidden = settingsPatternStep !== 2;
    if (stepLabel) {
      stepLabel.textContent = settingsPatternStep === 2
        ? 'Langkah 2: Rekam Ulang Pola Arah untuk Konfirmasi'
        : 'Langkah 1: Rekam Pola Arah (4–6 arah)';
    }
    if (nextBtn) {
      nextBtn.textContent = settingsPatternStep === 2 ? 'Kembali ke Langkah 1' : 'Lanjut Konfirmasi';
    }

    if (confirmEl) {
      if (settingsPatternConfirmBuffer.length === 0) {
        confirmEl.innerHTML = '<span class="pattern-placeholder">Ulangi arah yang sama untuk konfirmasi...</span>';
      } else {
        confirmEl.innerHTML = settingsPatternConfirmBuffer
          .map((dir) => `<span class="pattern-badge">${ARROW_GLYPHS[dir] || dir}</span>`)
          .join('');
      }
    }
  }

  function selectCategory(cat) {
    if (cat === 'settings') {
      openSettingsModal();
      return;
    }
    activeCategory = cat;
    renderTabs();
    renderChannelGrid();
  }

  function bindEvents() {
    const backBtn = document.getElementById('btn-back-home');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        isAdultUnlocked = false;
        window.location.href = 'index.html';
      });
    }

    document.querySelectorAll('.webtv-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        selectCategory(tab.dataset.category);
      });
    });

    // Lock modal keypad
    document.querySelectorAll('.pin-key').forEach((btn) => {
      btn.addEventListener('click', () => {
        const val = btn.dataset.pin;
        if (val === 'clear') {
          pinBuffer = '';
        } else if (val === 'ok') {
          submitLockAttempt();
          return;
        } else if (pinBuffer.length < 4) {
          pinBuffer += val;
        }
        updatePinDisplay();
      });
    });

    document.querySelectorAll('.pattern-key').forEach((btn) => {
      btn.addEventListener('click', () => {
        const dir = btn.dataset.dir;
        if (dir === 'clear') {
          patternBuffer = [];
        } else if (dir === 'ok') {
          submitLockAttempt();
          return;
        } else if (patternBuffer.length < 6) {
          patternBuffer.push(dir);
        }
        updatePatternDisplay();
      });
    });

    const lockCancelBtn = document.getElementById('btn-lock-cancel');
    if (lockCancelBtn) lockCancelBtn.addEventListener('click', closeLockModal);

    // Settings modal controls
    const modePinBtn = document.getElementById('mode-btn-pin');
    const modePatBtn = document.getElementById('mode-btn-pattern');
    if (modePinBtn) {
      modePinBtn.addEventListener('click', () => {
        settingsSelectedMode = 'pin';
        updateSettingsModeUI();
      });
    }
    if (modePatBtn) {
      modePatBtn.addEventListener('click', () => {
        settingsSelectedMode = 'pattern';
        updateSettingsModeUI();
      });
    }

    document.querySelectorAll('.setting-pattern-key').forEach((btn) => {
      btn.addEventListener('click', () => {
        const dir = btn.dataset.dir;
        if (dir === 'clear') {
          if (settingsPatternStep === 2) {
            settingsPatternConfirmBuffer = [];
          } else {
            settingsPatternBuffer = [];
          }
        } else {
          if (settingsPatternStep === 2) {
            if (settingsPatternConfirmBuffer.length < 6) {
              settingsPatternConfirmBuffer.push(dir);
            }
          } else {
            if (settingsPatternBuffer.length < 6) {
              settingsPatternBuffer.push(dir);
            }
          }
        }
        updateSettingsPatternDisplay();
      });
    });

    const nextStepBtn = document.getElementById('btn-pattern-next-step');
    if (nextStepBtn) {
      nextStepBtn.addEventListener('click', () => {
        if (settingsPatternStep === 1) {
          if (settingsPatternBuffer.length < 4) {
            setSettingsStatus('Langkah 1: Rekam minimal 4 arah pola terlebih dahulu.', false);
            return;
          }
          settingsPatternStep = 2;
          settingsPatternConfirmBuffer = [];
          setSettingsStatus('Silakan ulangi pola yang sama untuk konfirmasi.', true);
        } else {
          settingsPatternStep = 1;
        }
        updateSettingsPatternDisplay();
      });
    }

    const saveLockBtn = document.getElementById('btn-save-lock');
    if (saveLockBtn) {
      saveLockBtn.addEventListener('click', () => {
        // If already configured, verify current secret first
        if (lockConfig.isConfigured) {
          const currentInput = (document.getElementById('setting-current-secret')?.value || '').trim();
          if (!currentInput) {
            setSettingsStatus('Masukkan sandi/PIN saat ini untuk mengubah konfigurasi.', false);
            return;
          }
          if (!verifyLockSecret(currentInput, lockConfig)) {
            setSettingsStatus('Sandi/PIN saat ini salah!', false);
            return;
          }
        }

        let newSecret = '';
        if (settingsSelectedMode === 'pin') {
          const pinVal = (document.getElementById('setting-new-pin')?.value || '').trim();
          const confirmPinVal = (document.getElementById('setting-confirm-pin')?.value || '').trim();
          if (!/^\d{4}$/.test(pinVal)) {
            setSettingsStatus('PIN baru harus tepat 4 digit angka.', false);
            return;
          }
          if (pinVal !== confirmPinVal) {
            setSettingsStatus('Konfirmasi PIN tidak cocok dengan PIN baru.', false);
            return;
          }
          newSecret = pinVal;
        } else {
          if (settingsPatternBuffer.length < 4) {
            setSettingsStatus('Pola arah minimal 4 langkah arah remote.', false);
            return;
          }
          const p1 = normalizePattern(settingsPatternBuffer);
          const p2 = normalizePattern(settingsPatternConfirmBuffer);
          if (settingsPatternStep !== 2 || !p2) {
            setSettingsStatus('Selesaikan langkah 2: Konfirmasi pola arah remote.', false);
            return;
          }
          if (p1 !== p2) {
            setSettingsStatus('Konfirmasi pola tidak cocok dengan pola awal.', false);
            return;
          }
          newSecret = p1;
        }

        const nextHash = hashSecret(newSecret);
        lockConfig = saveLockConfig({
          isConfigured: true,
          mode: settingsSelectedMode,
          hash: nextHash,
          hideAdultTab: true,
        });

        // Reset inputs
        const currentSecInput = document.getElementById('setting-current-secret');
        const newPinInput = document.getElementById('setting-new-pin');
        const confirmPinInput = document.getElementById('setting-confirm-pin');
        if (currentSecInput) currentSecInput.value = '';
        if (newPinInput) newPinInput.value = '';
        if (confirmPinInput) confirmPinInput.value = '';
        settingsPatternBuffer = [];
        settingsPatternConfirmBuffer = [];
        settingsPatternStep = 1;

        openSettingsModal(); // Refresh modal state
        setSettingsStatus('Sandi berhasil disimpan & diaktifkan!', true);
        showToast('Sandi keamanan tersimpan.');
      });
    }

    const unlockAdultBtn = document.getElementById('btn-unlock-adult-session');
    if (unlockAdultBtn) {
      unlockAdultBtn.addEventListener('click', () => {
        if (!lockConfig.isConfigured) {
          setSettingsStatus('Buat & simpan sandi terlebih dahulu di atas.', false);
          return;
        }
        openLockModal(() => {
          updateAdultSessionUI();
          setSettingsStatus('Menu rahasia 18+ terbuka untuk sesi ini.', true);
        });
      });
    }

    const lockAdultBtn = document.getElementById('btn-lock-adult-session');
    if (lockAdultBtn) {
      lockAdultBtn.addEventListener('click', () => {
        isAdultUnlocked = false;
        updateAdultSessionUI();
        setSettingsStatus('Menu rahasia telah dikunci kembali.', true);
        showToast('Menu 18+ dikunci.');
      });
    }

    const addCustomBtn = document.getElementById('btn-add-custom-channel');
    if (addCustomBtn) {
      addCustomBtn.addEventListener('click', () => {
        const name = (document.getElementById('custom-ch-name')?.value || '').trim();
        const url = (document.getElementById('custom-ch-url')?.value || '').trim();
        const cat = document.getElementById('custom-ch-cat')?.value || 'nasional';
        if (!name || !url) {
          setSettingsStatus('Nama channel dan URL wajib diisi.', false);
          return;
        }
        const list = (channelsByCat[cat] || []).filter((c) => !c.isPlaceholder);
        list.push({
          id: `custom-${Date.now()}`,
          name,
          url,
          category: cat,
          type: inferStreamType(url),
        });
        channelsByCat[cat] = list;
        saveChannels(channelsByCat);
        document.getElementById('custom-ch-name').value = '';
        document.getElementById('custom-ch-url').value = '';
        if (activeCategory === cat) renderChannelGrid();
        setSettingsStatus(`Channel "${name}" ditambahkan ke ${cat}.`, true);
      });
    }

    const importM3uBtn = document.getElementById('btn-import-m3u');
    if (importM3uBtn) {
      importM3uBtn.addEventListener('click', async () => {
        const rawText = (document.getElementById('m3u-input')?.value || '').trim();
        const cat = document.getElementById('m3u-cat')?.value || 'nasional';
        if (!rawText) {
          setSettingsStatus('Tempel teks M3U atau masukkan URL playlist .m3u.', false);
          return;
        }
        let content = rawText;
        if (/^https?:\/\//i.test(rawText) && !rawText.includes('\n')) {
          try {
            const resp = await fetch(rawText);
            content = await resp.text();
          } catch (_err) {
            setSettingsStatus('Gagal mengunduh URL M3U. Coba tempel isi teksnya.', false);
            return;
          }
        }
        const parsed = parseM3U(content, cat);
        if (parsed.length === 0) {
          setSettingsStatus('Tidak ada channel valid ditemukan dalam M3U.', false);
          return;
        }
        const existing = (channelsByCat[cat] || []).filter((c) => !c.isPlaceholder);
        channelsByCat[cat] = existing.concat(parsed);
        saveChannels(channelsByCat);
        document.getElementById('m3u-input').value = '';
        if (activeCategory === cat) renderChannelGrid();
        setSettingsStatus(`${parsed.length} channel diimpor ke ${cat}.`, true);
      });
    }

    const closeSettingsBtn = document.getElementById('btn-settings-close');
    if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', closeSettingsModal);

    const playerCloseBtn = document.getElementById('btn-player-close');
    if (playerCloseBtn) playerCloseBtn.addEventListener('click', closePlayerOverlay);

    // Global keyboard & D-Pad handler
    document.addEventListener('keydown', (e) => {
      const playerOverlay = document.getElementById('player-overlay');
      const lockModal = document.getElementById('lock-modal');
      const settingsModal = document.getElementById('webtv-settings-modal');

      if (playerOverlay && !playerOverlay.hidden) {
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          zapChannel(-1);
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          zapChannel(1);
        } else if (e.key === 'Escape' || e.key === 'Backspace') {
          e.preventDefault();
          closePlayerOverlay();
        }
        return;
      }

      if (lockModal && lockModal.hasAttribute('open')) {
        if (e.key === 'Escape' || e.key === 'Backspace') {
          e.preventDefault();
          closeLockModal();
        }
        return;
      }

      if (settingsModal && settingsModal.hasAttribute('open')) {
        if (e.key === 'Escape') {
          e.preventDefault();
          closeSettingsModal();
        }
        return;
      }

      const tag = document.activeElement && document.activeElement.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if (e.key === 'Escape' || e.key === 'Backspace') {
        e.preventDefault();
        isAdultUnlocked = false;
        window.location.href = 'index.html';
      }
    });

    window.addEventListener('pagehide', () => {
      isAdultUnlocked = false;
    });

    const lockModalEl = document.getElementById('lock-modal');
    if (lockModalEl) {
      lockModalEl.addEventListener('cancel', (e) => {
        e.preventDefault();
        closeLockModal();
      });
    }
    const settingsModalEl = document.getElementById('webtv-settings-modal');
    if (settingsModalEl) {
      settingsModalEl.addEventListener('cancel', (e) => {
        e.preventDefault();
        closeSettingsModal();
      });
    }

    window.onAndroidBack = function () {
      const playerOverlay = document.getElementById('player-overlay');
      if (playerOverlay && !playerOverlay.hidden) {
        closePlayerOverlay();
        return true;
      }
      if (lockModalEl && lockModalEl.hasAttribute('open')) {
        closeLockModal();
        return true;
      }
      if (settingsModalEl && settingsModalEl.hasAttribute('open')) {
        closeSettingsModal();
        return true;
      }
      return false;
    };
  }

  applyThemeAndParticles();
  updateClock();
  setInterval(updateClock, 15000);
  renderTabs();
  renderChannelGrid();
  bindEvents();
  const initialTab = document.querySelector('.webtv-tab.active');
  if (initialTab) initialTab.focus();
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CHANNEL_STORAGE_KEY,
    LOCK_STORAGE_KEY,
    FAV_STORAGE_KEY,
    DEFAULT_CHANNELS,
    parseM3U,
    hashSecret,
    normalizePattern,
    inferStreamType,
    isAdultTabVisible,
    loadLockConfig,
    saveLockConfig,
    verifyLockSecret,
    sortChannelsWithFavorites,
    loadChannels,
    saveChannels,
    loadFavorites,
    saveFavorites,
  };
}
