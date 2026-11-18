'use strict';

const STORAGE_KEY = 'faisal_tv_apps_config';

const DEFAULT_CONFIG = {
  senandung: 'http://192.168.1.100:8080',
  immich: 'http://192.168.1.100:2283',
  dompetmungil: 'http://192.168.1.100:3000',
};

const INDONESIAN_DAYS = [
  'Minggu',
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu',
];

const INDONESIAN_MONTHS = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

/**
 * Normalize a user-entered server URL, falling back when empty.
 * @param {string} url
 * @param {string} fallback
 * @returns {string}
 */
function normalizeUrl(url, fallback) {
  if (typeof url !== 'string') return fallback;
  const trimmed = url.trim().replace(/\/+$/, '');
  if (!trimmed) return fallback;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `http://${trimmed}`;
}

/**
 * Load app server configuration from storage, merged with DEFAULT_CONFIG.
 * @param {Storage} [storage]
 * @returns {{ senandung: string, immich: string, dompetmungil: string }}
 */
function getDefaultStorage() {
  return typeof window !== 'undefined' && window.localStorage ? window.localStorage : null;
}

function loadConfig(storage) {
  let base = { ...DEFAULT_CONFIG };
  const store = storage !== undefined ? storage : getDefaultStorage();
  if (store) {
    try {
      const raw = store.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          base = {
            senandung: normalizeUrl(parsed.senandung, DEFAULT_CONFIG.senandung),
            immich: normalizeUrl(parsed.immich, DEFAULT_CONFIG.immich),
            dompetmungil: normalizeUrl(parsed.dompetmungil, DEFAULT_CONFIG.dompetmungil),
          };
        }
      }
    } catch (_err) {
      // Ignore malformed JSON
    }
  }
  if (!storage && typeof window !== 'undefined' && window.TvBridge && typeof window.TvBridge.getAppUrlsJson === 'function') {
    try {
      const nativeRaw = window.TvBridge.getAppUrlsJson();
      if (nativeRaw) {
        const nativeParsed = JSON.parse(nativeRaw);
        if (nativeParsed && typeof nativeParsed === 'object') {
          if (nativeParsed.senandung) base.senandung = normalizeUrl(nativeParsed.senandung, base.senandung);
          if (nativeParsed.immich) base.immich = normalizeUrl(nativeParsed.immich, base.immich);
          if (nativeParsed.dompetmungil) base.dompetmungil = normalizeUrl(nativeParsed.dompetmungil, base.dompetmungil);
        }
      }
    } catch (_err) {
      // Ignore bridge parse errors
    }
  }
  return base;
}

/**
 * Save app server configuration to storage.
 * @param {Partial<typeof DEFAULT_CONFIG>} config
 * @param {Storage} [storage]
 * @returns {{ senandung: string, immich: string, dompetmungil: string }}
 */
function saveConfig(config, storage) {
  const store = storage !== undefined ? storage : getDefaultStorage();
  const next = {
    senandung: normalizeUrl(config && config.senandung, DEFAULT_CONFIG.senandung),
    immich: normalizeUrl(config && config.immich, DEFAULT_CONFIG.immich),
    dompetmungil: normalizeUrl(config && config.dompetmungil, DEFAULT_CONFIG.dompetmungil),
  };
  if (store) {
    try {
      store.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (_err) {
      // Ignore storage quota or private mode errors
    }
  }
  if (!storage && typeof window !== 'undefined' && window.TvBridge && typeof window.TvBridge.saveAppUrl === 'function') {
    try {
      window.TvBridge.saveAppUrl('senandung', next.senandung);
      window.TvBridge.saveAppUrl('immich', next.immich);
      window.TvBridge.saveAppUrl('dompetmungil', next.dompetmungil);
    } catch (_err) {
      // Ignore bridge errors
    }
  }
  return next;
}

/**
 * Pure 2D spatial grid navigation helper with boundary clamping.
 * @param {number[]} rowLengths - Number of items in each row.
 * @param {{ row: number, col: number }} currentPos
 * @param {'ArrowLeft'|'ArrowRight'|'ArrowUp'|'ArrowDown'} direction
 * @returns {{ row: number, col: number }}
 */
function navigateGrid(rowLengths, currentPos, direction) {
  if (!Array.isArray(rowLengths) || rowLengths.length === 0) {
    return { row: 0, col: 0 };
  }

  const maxRow = rowLengths.length - 1;
  let row = Math.max(0, Math.min(maxRow, currentPos ? currentPos.row : 0));
  const currentRowMaxCol = Math.max(0, (rowLengths[row] || 1) - 1);
  let col = Math.max(0, Math.min(currentRowMaxCol, currentPos ? currentPos.col : 0));

  switch (direction) {
    case 'ArrowLeft':
      col = Math.max(0, col - 1);
      break;
    case 'ArrowRight':
      col = Math.min(currentRowMaxCol, col + 1);
      break;
    case 'ArrowUp':
      if (row > 0) {
        row -= 1;
        col = Math.min(col, Math.max(0, (rowLengths[row] || 1) - 1));
      }
      break;
    case 'ArrowDown':
      if (row < maxRow) {
        row += 1;
        col = Math.min(col, Math.max(0, (rowLengths[row] || 1) - 1));
      }
      break;
    default:
      break;
  }

  return { row, col };
}

/**
 * Pure focus-trap index helper for modal D-Pad navigation.
 * @param {number} focusableCount
 * @param {number} currentIndex
 * @param {'ArrowUp'|'ArrowLeft'|'ArrowDown'|'ArrowRight'|'next'|'prev'} direction
 * @returns {number}
 */
function trapModalFocus(focusableCount, currentIndex, direction) {
  if (!focusableCount || focusableCount <= 0) return 0;
  const idx = Math.max(0, Math.min(focusableCount - 1, currentIndex || 0));
  if (direction === 'ArrowUp' || direction === 'ArrowLeft' || direction === 'prev') {
    return (idx - 1 + focusableCount) % focusableCount;
  }
  if (direction === 'ArrowDown' || direction === 'ArrowRight' || direction === 'next') {
    return (idx + 1) % focusableCount;
  }
  return idx;
}

/**
 * Format time as HH:MM (24-hour).
 * @param {Date} date
 * @returns {string}
 */
function formatClock(date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Format date in Indonesian (e.g. "Senin, 18 November 2026").
 * @param {Date} date
 * @returns {string}
 */
function formatIndonesianDate(date) {
  const dayName = INDONESIAN_DAYS[date.getDay()] || '';
  const dayNum = date.getDate();
  const monthName = INDONESIAN_MONTHS[date.getMonth()] || '';
  const year = date.getFullYear();
  return `${dayName}, ${dayNum} ${monthName} ${year}`;
}

// --- Browser / WebView Runtime ---
(function initBrowserHub() {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return;
  }

  let audioCtx = null;
  let toastTimer = null;
  let currentPos = { row: 0, col: 0 };
  let isModalOpen = false;
  let modalFocusIndex = 0;

  function playFocusSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtx) {
        audioCtx = new AudioCtx();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(260, audioCtx.currentTime + 0.045);

      gain.gain.setValueAtTime(0.055, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.045);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch (_err) {
      // Audio playback may be blocked or unsupported; ignore silently
    }
  }

  function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.setAttribute('aria-hidden', 'false');
    toast.classList.add('visible');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('visible');
      toast.setAttribute('aria-hidden', 'true');
    }, 3000);
  }

  function getGridRows() {
    const rowElements = Array.from(document.querySelectorAll('.card-row'));
    return rowElements.map((rowEl) => Array.from(rowEl.querySelectorAll('.card')));
  }

  function applyGridFocus(nextPos, shouldPlaySound) {
    const gridRows = getGridRows();
    if (gridRows.length === 0) return;

    const prevCard = document.querySelector('.card.focused');
    if (prevCard) {
      prevCard.classList.remove('focused');
      prevCard.setAttribute('tabindex', '-1');
    }

    const targetRow = gridRows[nextPos.row] || gridRows[0];
    const targetCard = targetRow[nextPos.col] || targetRow[0];
    if (!targetCard) return;

    currentPos = nextPos;
    targetCard.classList.add('focused');
    targetCard.setAttribute('tabindex', '0');
    targetCard.focus({ preventScroll: true });
    if (typeof targetCard.scrollIntoView === 'function') {
      targetCard.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }

    if (shouldPlaySound) {
      playFocusSound();
    }
  }

  function launchWebApp(appId, appName) {
    const config = loadConfig();
    const url = config[appId] || DEFAULT_CONFIG[appId];
    if (!url) {
      showToast(`URL untuk ${appName} belum dikonfigurasi.`);
      return;
    }
    if (window.TvBridge && typeof window.TvBridge.openWebApp === 'function') {
      window.TvBridge.openWebApp(appName, url, appId);
    } else {
      showToast(`Membuka ${appName} (${url})`);
      window.open(url, '_blank', 'noopener');
    }
  }

  function launchNativeApp(pkg, appName) {
    if (window.TvBridge && typeof window.TvBridge.launchApp === 'function') {
      window.TvBridge.launchApp(pkg);
    } else {
      showToast(`Preview mode: ${appName} (${pkg}) membutuhkan Android TV.`);
    }
  }

  function handleAction(action) {
    if (action === 'inputs') {
      if (window.TvBridge && typeof window.TvBridge.openTvInputs === 'function') {
        window.TvBridge.openTvInputs();
      } else {
        showToast('Preview mode: Pilih Input HDMI/AV tersedia di Android TV.');
      }
      return;
    }
    if (action === 'settings') {
      if (window.TvBridge && typeof window.TvBridge.openSettings === 'function') {
        window.TvBridge.openSettings();
      } else {
        showToast('Preview mode: Pengaturan TV tersedia di Android TV.');
      }
      return;
    }
    if (action === 'reconfig') {
      openReconfigModal();
    }
  }

  function activateCard(card) {
    if (!card) return;
    playFocusSound();
    const appId = card.dataset.appId;
    const pkg = card.dataset.pkg;
    const action = card.dataset.action;
    const appName = card.dataset.appName || 'Aplikasi';

    if (appId) {
      launchWebApp(appId, appName);
    } else if (pkg) {
      launchNativeApp(pkg, appName);
    } else if (action) {
      handleAction(action);
    }
  }

  function getModalFocusables() {
    const modal = document.getElementById('reconfig-modal');
    if (!modal) return [];
    return Array.from(modal.querySelectorAll('.modal-focusable'));
  }

  function setModalFocus(index) {
    const items = getModalFocusables();
    if (items.length === 0) return;
    items.forEach((el) => el.classList.remove('modal-focused'));
    modalFocusIndex = Math.max(0, Math.min(items.length - 1, index));
    const target = items[modalFocusIndex];
    target.classList.add('modal-focused');
    target.focus();
  }

  function openReconfigModal() {
    const modal = document.getElementById('reconfig-modal');
    if (!modal) return;
    const config = loadConfig();

    const inputSenandung = document.getElementById('input-senandung');
    const inputImmich = document.getElementById('input-immich');
    const inputDompet = document.getElementById('input-dompetmungil');

    if (inputSenandung) inputSenandung.value = config.senandung;
    if (inputImmich) inputImmich.value = config.immich;
    if (inputDompet) inputDompet.value = config.dompetmungil;

    isModalOpen = true;
    if (typeof modal.showModal === 'function') {
      if (!modal.open) modal.showModal();
    } else {
      modal.setAttribute('open', '');
    }
    setModalFocus(0);
  }

  function closeReconfigModal() {
    const modal = document.getElementById('reconfig-modal');
    isModalOpen = false;
    if (modal) {
      if (typeof modal.close === 'function' && modal.open) {
        modal.close();
      } else {
        modal.removeAttribute('open');
      }
    }
    applyGridFocus(currentPos, false);
  }

  function handleModalKeydown(e) {
    const items = getModalFocusables();
    if (items.length === 0) return;

    const activeEl = document.activeElement;
    const activeIdx = items.indexOf(activeEl);
    if (activeIdx !== -1) {
      modalFocusIndex = activeIdx;
    }

    const isInput = activeEl && activeEl.tagName === 'INPUT';

    if (e.key === 'Escape' || (e.key === 'Backspace' && !isInput)) {
      e.preventDefault();
      closeReconfigModal();
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const nextIdx = trapModalFocus(items.length, modalFocusIndex, e.shiftKey ? 'prev' : 'next');
      setModalFocus(nextIdx);
      playFocusSound();
      return;
    }

    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIdx = trapModalFocus(items.length, modalFocusIndex, e.key);
      setModalFocus(nextIdx);
      playFocusSound();
      return;
    }

    if (!isInput && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
      e.preventDefault();
      const nextIdx = trapModalFocus(items.length, modalFocusIndex, e.key);
      setModalFocus(nextIdx);
      playFocusSound();
      return;
    }

    if (e.key === 'Enter' && isInput) {
      e.preventDefault();
      const nextIdx = trapModalFocus(items.length, modalFocusIndex, 'ArrowDown');
      setModalFocus(nextIdx);
    }
  }

  function handleHubKeydown(e) {
    if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;

    if (isModalOpen) {
      handleModalKeydown(e);
      return;
    }

    if (
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowRight' ||
      e.key === 'ArrowUp' ||
      e.key === 'ArrowDown'
    ) {
      const gridRows = getGridRows();
      const rowLengths = gridRows.map((r) => r.length);
      const nextPos = navigateGrid(rowLengths, currentPos, e.key);
      if (nextPos.row !== currentPos.row || nextPos.col !== currentPos.col) {
        e.preventDefault();
        applyGridFocus(nextPos, true);
      }
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      const gridRows = getGridRows();
      const card = gridRows[currentPos.row] && gridRows[currentPos.row][currentPos.col];
      activateCard(card);
    }
  }

  function updateClock() {
    const clockEl = document.getElementById('live-clock');
    const dateEl = document.getElementById('live-date');
    const now = new Date();
    if (clockEl) clockEl.textContent = formatClock(now);
    if (dateEl) dateEl.textContent = formatIndonesianDate(now);
  }

  document.addEventListener('DOMContentLoaded', () => {
    updateClock();
    setInterval(updateClock, 1000);

    const gridRows = getGridRows();
    gridRows.forEach((cards, rIdx) => {
      cards.forEach((card, cIdx) => {
        card.addEventListener('click', () => {
          applyGridFocus({ row: rIdx, col: cIdx }, false);
          activateCard(card);
        });
        card.addEventListener('mouseenter', () => {
          if (!isModalOpen) {
            applyGridFocus({ row: rIdx, col: cIdx }, false);
          }
        });
      });
    });

    const modal = document.getElementById('reconfig-modal');
    if (modal) {
      modal.addEventListener('cancel', (e) => {
        e.preventDefault();
        closeReconfigModal();
      });
      modal.addEventListener('close', () => {
        if (isModalOpen) {
          isModalOpen = false;
          applyGridFocus(currentPos, false);
        }
      });
    }

    const cancelBtn = document.getElementById('btn-cancel-reconfig');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        closeReconfigModal();
      });
    }

    const form = document.getElementById('reconfig-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const inputSenandung = document.getElementById('input-senandung');
        const inputImmich = document.getElementById('input-immich');
        const inputDompet = document.getElementById('input-dompetmungil');

        saveConfig({
          senandung: inputSenandung ? inputSenandung.value : '',
          immich: inputImmich ? inputImmich.value : '',
          dompetmungil: inputDompet ? inputDompet.value : '',
        });

        closeReconfigModal();
        showToast('Konfigurasi server berhasil disimpan.');
      });
    }

    document.addEventListener('keydown', handleHubKeydown);

    // Expose modal trigger for Android bridge or error page deep-link
    window.openReconfigModal = openReconfigModal;
    if (window.location && /[?&]reconfig=1/.test(window.location.search)) {
      openReconfigModal();
    } else {
      applyGridFocus({ row: 0, col: 0 }, false);
    }
  });
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    STORAGE_KEY,
    DEFAULT_CONFIG,
    normalizeUrl,
    loadConfig,
    saveConfig,
    navigateGrid,
    trapModalFocus,
    formatClock,
    formatIndonesianDate,
  };
}
