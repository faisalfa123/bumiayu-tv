// ==========================================================================
// BUMIAYU TV LAUNCHER - SCRIPT UTAMA (XIAOMI MI TV 4A 1GB RAM)
// ==========================================================================

const SENANDUNG_API = "http://100.79.122.76:8080/api";
const DEFAULT_PIN = "1234";

let enteredPin = "";
let pendingAdultStreamUrl = "";
let currentHlsInstance = null;
let osdTimer = null;

// ==========================================================================
// 1. SPATIAL NAVIGATION D-PAD (2D GRID NATIVE)
// ==========================================================================
function getCardMatrix() {
    const rows = document.querySelectorAll('.grid-row');
    return Array.from(rows).map(row => Array.from(row.querySelectorAll('.tv-card')));
}

function handleDpadNavigation(e) {
    const pinDialog = document.getElementById('adult-pin-dialog');
    if (pinDialog && pinDialog.open) {
        // Let dialog handle its own focus trap / navigation
        handlePinDialogKey(e);
        return;
    }

    const videoOverlay = document.getElementById('video-overlay');
    if (videoOverlay && videoOverlay.style.display === 'block') {
        if (e.keyCode === 27 || e.keyCode === 4 || e.key === 'Escape' || e.key === 'Backspace') {
            closeVideoPlayer();
            e.preventDefault();
        }
        return;
    }

    const current = document.activeElement;
    if (!current || !current.classList.contains('tv-card')) return;

    const matrix = getCardMatrix();
    let currentRowIndex = -1;
    let currentColIndex = -1;

    for (let r = 0; r < matrix.length; r++) {
        const c = matrix[r].indexOf(current);
        if (c !== -1) {
            currentRowIndex = r;
            currentColIndex = c;
            break;
        }
    }

    if (currentRowIndex === -1) return;

    switch(e.keyCode) {
        case 39: // Panah Kanan
            if (currentColIndex + 1 < matrix[currentRowIndex].length) {
                matrix[currentRowIndex][currentColIndex + 1].focus();
                e.preventDefault();
            }
            break;

        case 37: // Panah Kiri
            if (currentColIndex - 1 >= 0) {
                matrix[currentRowIndex][currentColIndex - 1].focus();
                e.preventDefault();
            }
            break;

        case 40: // Panah Bawah
            if (currentRowIndex + 1 < matrix.length) {
                const targetRow = matrix[currentRowIndex + 1];
                const targetCol = Math.min(currentColIndex, targetRow.length - 1);
                targetRow[targetCol].focus();
                e.preventDefault();
            }
            break;

        case 38: // Panah Atas
            if (currentRowIndex - 1 >= 0) {
                const targetRow = matrix[currentRowIndex - 1];
                const targetCol = Math.min(currentColIndex, targetRow.length - 1);
                targetRow[targetCol].focus();
                e.preventDefault();
            }
            break;

        case 13: // Enter / OK
        case 23: // DPAD_CENTER
            current.click();
            e.preventDefault();
            break;

        case 27: // Escape / Back
        case 4:  // Android KEYCODE_BACK
            // Handled at system level
            break;
    }
}

// ==========================================================================
// 2. KONTROL SERVER SENANDUNG & YOUTUBE
// ==========================================================================
function controlSenandung(action) {
    showToast(`Mengirim perintah: ${action}...`);
    fetch(`${SENANDUNG_API}/player/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: action })
    })
    .then(response => {
        if (!response.ok) throw new Error('Status: ' + response.status);
        showToast(`Senandung: ${action} berhasil!`);
    })
    .catch(err => {
        showToast(`Senandung offline (${err.message})`);
    });
}

function launchYouTube() {
    if (window.TvBridge && typeof window.TvBridge.launchApp === 'function') {
        window.TvBridge.launchApp('org.smarttube.stable');
        setTimeout(() => {
            if (window.TvBridge) window.TvBridge.launchApp('com.teamsmart.videomanager.tv');
        }, 300);
    } else {
        window.location.href = 'intent://#Intent;component=com.teamsmart.videomanager.tv/com.teamsmart.videomanager.tv.MainActivity;end';
    }
}

function openSettings(section) {
    if (window.TvBridge && typeof window.TvBridge.openSettingsSection === 'function') {
        window.TvBridge.openSettingsSection(section);
    } else if (window.TvBridge && typeof window.TvBridge.openSettings === 'function') {
        window.TvBridge.openSettings();
    } else {
        showToast(`Membuka Pengaturan: ${section || 'Sistem'}`);
    }
}

// ==========================================================================
// 3. DAFTAR PLAYLIST & VALIDATOR KONEKSI HLS / M3U8 STREAM
// ==========================================================================
async function checkStreamStatus(url) {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        await fetch(url, { 
            method: 'HEAD', 
            mode: 'no-cors',
            signal: controller.signal 
        });
        
        clearTimeout(timeoutId);
        return true;
    } catch (_error) {
        return false;
    }
}

function initChannelChecker() {
    const channelCards = document.querySelectorAll('.tv-card[data-stream]');
    
    channelCards.forEach(async (card) => {
        const streamUrl = card.getAttribute('data-stream');
        const badge = card.querySelector('.status-badge');
        
        if (badge && streamUrl) {
            badge.className = "status-badge status-checking";
            badge.innerText = "Checking...";
            
            const isOnline = await checkStreamStatus(streamUrl);
            
            if (isOnline) {
                badge.className = "status-badge status-online";
                badge.innerText = "Online";
                card.style.opacity = "1";
            } else {
                badge.className = "status-badge status-offline";
                badge.innerText = "Offline";
                card.style.opacity = "0.45";
            }
        }
    });
}

// ==========================================================================
// 4. FITUR PROTEKSI PIN KATEGORI 18+ (REMOTE D-PAD DIALOG)
// ==========================================================================
function openAdultChannel(streamUrl) {
    pendingAdultStreamUrl = streamUrl;
    enteredPin = "";
    updatePinDisplay();
    
    const dialog = document.getElementById('adult-pin-dialog');
    if (dialog && typeof dialog.showModal === 'function') {
        dialog.showModal();
        const firstBtn = dialog.querySelector('.pin-btn');
        if (firstBtn) firstBtn.focus();
    } else {
        // Fallback jika dialog tidak tersedia
        const userPIN = prompt("Masukkan 4-Digit PIN Pengaman:");
        if (userPIN === DEFAULT_PIN) {
            playStream(streamUrl, "Kategori 18+");
        } else {
            alert("PIN Salah! Akses ditolak.");
        }
    }
}

function updatePinDisplay() {
    if (typeof document === 'undefined') return;
    const display = document.getElementById('pin-display');
    if (!display) return;
    display.innerText = "•".repeat(enteredPin.length).padEnd(4, "-");
}

function inputPinDigit(digit) {
    if (enteredPin.length < 4) {
        enteredPin += digit;
        updatePinDisplay();
        
        if (enteredPin.length === 4) {
            setTimeout(verifyEnteredPin, 150);
        }
    }
}

function clearPinInput() {
    enteredPin = "";
    updatePinDisplay();
}

function closePinDialog() {
    if (typeof document === 'undefined') return;
    const dialog = document.getElementById('adult-pin-dialog');
    if (dialog && dialog.open) {
        dialog.close();
    }
    enteredPin = "";
    pendingAdultStreamUrl = "";
    const adultCard = document.querySelector('.tv-card[onclick*="openAdultChannel"]');
    if (adultCard) adultCard.focus();
}

function verifyEnteredPin() {
    if (enteredPin === DEFAULT_PIN) {
        const targetUrl = pendingAdultStreamUrl;
        closePinDialog();
        showToast("PIN Benar! Membuka siaran 18+...");
        if (targetUrl) playStream(targetUrl, "Kategori 18+ (Terkunci)");
    } else {
        showToast("PIN Salah! Akses ditolak.");
        clearPinInput();
    }
}

function handlePinDialogKey(e) {
    if (e.keyCode === 27 || e.keyCode === 4) { // Back / Esc
        closePinDialog();
        e.preventDefault();
        return;
    }

    // Direct numeric keys from remote (0-9)
    if (e.key >= '0' && e.key <= '9') {
        inputPinDigit(e.key);
        e.preventDefault();
        return;
    }

    const current = document.activeElement;
    if (!current || !current.classList.contains('pin-btn')) return;

    const btns = Array.from(document.querySelectorAll('#adult-pin-dialog .pin-btn'));
    const index = btns.indexOf(current);

    switch(e.keyCode) {
        case 39: // Kanan
            if (index + 1 < btns.length) {
                btns[index + 1].focus();
                e.preventDefault();
            }
            break;
        case 37: // Kiri
            if (index - 1 >= 0) {
                btns[index - 1].focus();
                e.preventDefault();
            }
            break;
        case 40: // Bawah (Grid 3 kolom)
            if (index + 3 < btns.length) {
                btns[index + 3].focus();
                e.preventDefault();
            }
            break;
        case 38: // Atas (Grid 3 kolom)
            if (index - 3 >= 0) {
                btns[index - 3].focus();
                e.preventDefault();
            }
            break;
        case 13:
        case 23:
            current.click();
            e.preventDefault();
            break;
    }
}

// ==========================================================================
// 5. PEMUTAR VIDEO FULLSCREEN TERINTEGRASI
// ==========================================================================
function playStream(url, title) {
    const overlay = document.getElementById('video-overlay');
    const player = document.getElementById('main-player');
    const osdTitle = document.getElementById('osd-title');
    const osd = document.getElementById('player-osd');

    if (!overlay || !player) return;

    if (osdTitle) osdTitle.innerText = title || "Live TV";
    overlay.style.display = 'block';

    if (osd) {
        osd.classList.remove('hidden');
        clearTimeout(osdTimer);
        osdTimer = setTimeout(() => {
            if (osd) osd.classList.add('hidden');
        }, 4000);
    }

    // Pembersihan player lama
    destroyCurrentPlayer();

    // Inisialisasi pemutaran HLS / HTML5
    if (typeof Hls !== 'undefined' && Hls.isSupported() && url.includes('.m3u8')) {
        currentHlsInstance = new Hls({
            maxBufferLength: 15,
            maxMaxBufferLength: 30,
            enableWorker: true,
            lowLatencyMode: false,
            backBufferLength: 15
        });
        currentHlsInstance.loadSource(url);
        currentHlsInstance.attachMedia(player);
        currentHlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
            player.play().catch(() => {});
        });
    } else {
        player.src = url;
        player.load();
        player.play().catch(() => {});
    }
}

function destroyCurrentPlayer() {
    const player = document.getElementById('main-player');
    if (currentHlsInstance) {
        try {
            currentHlsInstance.destroy();
        } catch (_) {}
        currentHlsInstance = null;
    }
    if (player) {
        player.pause();
        player.removeAttribute('src');
        player.load();
    }
}

function closeVideoPlayer() {
    const overlay = document.getElementById('video-overlay');
    destroyCurrentPlayer();
    if (overlay) overlay.style.display = 'none';

    // Fokus kembali ke kartu pertama yang terlihat
    const firstCard = document.querySelector('.tv-card');
    if (firstCard) firstCard.focus();
}

// Android Back Hook
if (typeof window !== 'undefined') {
    window.onAndroidBack = function() {
        const overlay = document.getElementById('video-overlay');
        if (overlay && overlay.style.display === 'block') {
            closeVideoPlayer();
            return true;
        }

        const pinDialog = document.getElementById('adult-pin-dialog');
        if (pinDialog && pinDialog.open) {
            closePinDialog();
            return true;
        }

        return false;
    };
}

// ==========================================================================
// 6. UTILITAS & JAM SISTEM
// ==========================================================================
function showToast(msg) {
    if (typeof document === 'undefined') return;
    const toast = document.getElementById('toast-notification');
    if (!toast) return;
    toast.innerText = msg;
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 2800);
}

function updateClock() {
    if (typeof document === 'undefined') return;
    const clock = document.getElementById('clock-display');
    if (!clock) return;
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    clock.innerText = `${hours}:${minutes}`;
}

// Inisialisasi saat DOM dimuat
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        // Fokus kartu pertama
        const firstCard = document.querySelector('.tv-card');
        if (firstCard) firstCard.focus();

        // Inisialisasi jam
        updateClock();
        setInterval(updateClock, 1000);

        // Inisialisasi pengecekan status saluran
        initChannelChecker();
    });

    document.addEventListener('keydown', handleDpadNavigation);
}

// Export untuk keperluan unit testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        checkStreamStatus,
        initChannelChecker,
        inputPinDigit,
        clearPinInput,
        verifyEnteredPin,
        DEFAULT_PIN,
        controlSenandung,
        openSettings
    };
}
