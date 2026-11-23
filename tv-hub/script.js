/* ==============================================================================
   BUMIAYU TV - GOOGLE TV MODERN NAVIGATION & MEDIA ENGINE
   Hardware Optimized for Xiaomi Smart TV 4A 32" (Android TV 9)
   ============================================================================== */

const CHANNELS = [
    { id: "kompastv", name: "Kompas TV", genre: "Nasional News", desc: "Siaran langsung berita nasional independen, investigasi mendalam, dan warta terkini.", stream: "https://op-group1-swiftservehd-1.dens.tv/s/s104/index.m3u8", poster: "assets/kompastv.png" },
    { id: "metrotv", name: "Metro TV", genre: "Nasional News", desc: "Saluran berita 24 jam dengan program talkshow politik dan ekonomi nasional.", stream: "https://op-group1-swiftservehd-1.dens.tv/s/s103/index.m3u8", poster: "assets/metrotv.png" },
    { id: "tvone", name: "TV One", genre: "Nasional News & Sport", desc: "Warta berita, debat politik nasional, dan liputan olahraga terhangat.", stream: "https://op-group1-swiftservehd-1.dens.tv/s/s105/index.m3u8", poster: "assets/tvone.png" },
    { id: "trans7", name: "Trans7", genre: "Hiburan & Edukasi", desc: "Program ragam hiburan keluarga, petualangan alam, dan edukasi populer Indonesia.", stream: "https://op-group1-swiftservehd-1.dens.tv/s/s108/index.m3u8", poster: "assets/trans7.png" },
    { id: "transtv", name: "Trans TV", genre: "Bioskop & Lifestyle", desc: "Film bioskop box office terpopuler, gaya hidup, dan reality show keluarga.", stream: "https://op-group1-swiftservehd-1.dens.tv/s/s107/index.m3u8", poster: "assets/transtv.png" },
    { id: "nettv", name: "Net TV", genre: "Televisi Masa Kini", desc: "Program kreatif anak muda, komedi segar, drama, dan konser musik spektakuler.", stream: "https://op-group1-swiftservehd-1.dens.tv/s/s111/index.m3u8", poster: "assets/nettv.png" },
    { id: "indosiar", name: "Indosiar", genre: "Mega Series & Liga 1", desc: "Siaran langsung kompetisi sepak bola Liga 1 Indonesia dan drama realita.", stream: "https://op-group1-swiftservehd-1.dens.tv/s/s102/index.m3u8", poster: "assets/indosiar.png" },
    { id: "sctv", name: "SCTV", genre: "Sinetron & Olahraga", desc: "Sinetron primetime unggulan, liputan berita Liputan6, dan kompetisi bergengsi.", stream: "https://op-group1-swiftservehd-1.dens.tv/s/s101/index.m3u8", poster: "assets/sctv.png" },
    { id: "rcti", name: "RCTI", genre: "Kebanggaan Bersama", desc: "Saluran televisi swasta pertama Indonesia dengan tayangan hiburan keluarga dan ajang pencarian bakat.", stream: "https://op-group1-swiftservehd-1.dens.tv/s/s100/index.m3u8", poster: "assets/rcti.png" },
    { id: "cnnid", name: "CNN Indonesia", genre: "Berita & Finansial", desc: "Berita akurat dan terpercaya dengan standar jurnalisme global dalam Bahasa Indonesia.", stream: "https://op-group1-swiftservehd-1.dens.tv/s/s106/index.m3u8", poster: "assets/cnnid.png" },
    { id: "cnbcid", name: "CNBC Indonesia", genre: "Pasar Modal & Bisnis", desc: "Analisis pasar modal, tren investasi, berita ekonomi makro, dan bisnis global.", stream: "https://op-group1-swiftservehd-1.dens.tv/s/s110/index.m3u8", poster: "assets/cnbcid.png" },
    { id: "inews", name: "iNews", genre: "Inspirasi & Daerah", desc: "Jaringan televisi berita daerah terbesar di Indonesia dengan siaran olahraga pilihan.", stream: "https://op-group1-swiftservehd-1.dens.tv/s/s109/index.m3u8", poster: "assets/inews.png" },
    { id: "tvri", name: "TVRI Nasional", genre: "Saluran Pemersatu", desc: "Lembaga penyiaran publik yang menjangkau seluruh pelosok kepulauan nusantara.", stream: "https://op-group1-swiftservehd-1.dens.tv/s/s112/index.m3u8", poster: "assets/tvri.png" },
    { id: "nhkworld", name: "NHK World Japan", genre: "Internasional (Jepang)", desc: "Warta berita dunia, dokumenter sains, dan kebudayaan Jepang berbahasa Inggris 24/7.", stream: "https://nhkwlive-ojp.akamaized.net/hls/live/2003459/nhkwlive-ojp-en/index.m3u8", poster: "assets/nhkworld.png" },
    { id: "dw", name: "DW English", genre: "Internasional (Jerman)", desc: "Saluran berita internasional Jerman menyajikan liputan peristiwa dunia dan laporan mendalam.", stream: "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8", poster: "assets/dw.png" },
    { id: "france24", name: "France 24", genre: "Internasional (Prancis)", desc: "Perspektif berita Eropa dan Timur Tengah langsung dari Paris dalam Bahasa Inggris.", stream: "https://static.france24.com/live/F24_EN_LO_HLS/live_tv.m3u8", poster: "assets/france24.png" },
    { id: "aljazeera", name: "Al Jazeera", genre: "Internasional (Qatar)", desc: "Jurnalisme investigasi independen pemenang penghargaan dengan jaringan reporter terluas.", stream: "https://live-hls-web-aje.getaj.net/AJE/01.m3u8", poster: "assets/aljazeera.png" }
];

const ADULT_CHANNELS = [
    { id: "adult_1", name: "Dewasa Vault 1", genre: "18+ Private", stream: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", poster: "assets/settings.png" },
    { id: "adult_2", name: "Dewasa Vault 2", genre: "18+ Private", stream: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", poster: "assets/settings.png" }
];

let activeTabIndex = 0;
const TABS = ["home", "livetv", "apps", "settings"];
let currentChannelIndex = 0;
let hlsPlayer = null;

// Secret Remote Sequence Tracking (UP, UP, DOWN, DOWN)
const SECRET_COMBO = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown"];
let keyHistory = [];

// Vault State Management
let currentPinInput = "";
let tempPinSetup = "";
let vaultState = "LOCKED"; // "SETUP_1", "SETUP_CONFIRM", "ENTER_PIN", "UNLOCKED"

/* ==============================================================================
   INITIALIZATION & CLOCK
   ============================================================================== */
function initLauncher() {
    updateClock();
    setInterval(updateClock, 1000);
    renderChannels();
    setupDpadNavigation();
    setupBillboardListeners();
    setupVaultKeypad();

    // Default focus on first card of Home pane
    const firstCard = document.querySelector("#pane-home .tv-card");
    if (firstCard) firstCard.focus();
}

function updateClock() {
    const el = document.getElementById("clock-display");
    if (!el) return;
    const now = new Date();
    const h = String(now.getHours()).padStart(2, "0");
    const m = String(now.getMinutes()).padStart(2, "0");
    el.textContent = `${h}:${m}`;
}

/* ==============================================================================
   CHANNEL RENDERING
   ============================================================================== */
function renderChannels() {
    const homeStrip = document.getElementById("home-channels-strip");
    const fullGrid = document.getElementById("full-channels-grid");

    if (homeStrip) {
        homeStrip.innerHTML = "";
        CHANNELS.slice(0, 4).forEach((ch, idx) => {
            homeStrip.appendChild(createChannelCard(ch, idx));
        });
    }

    if (fullGrid) {
        fullGrid.innerHTML = "";
        CHANNELS.forEach((ch, idx) => {
            fullGrid.appendChild(createChannelCard(ch, idx));
        });
    }
}

function createChannelCard(ch, index) {
    const btn = document.createElement("button");
    btn.className = "tv-card channel-card";
    btn.tabIndex = -1;
    btn.setAttribute("data-stream", ch.stream);
    btn.setAttribute("data-title", ch.name);
    btn.setAttribute("data-desc", ch.desc);
    btn.setAttribute("data-badge", "LIVE TV");
    btn.setAttribute("data-index", String(index));
    btn.setAttribute("aria-label", `Tonton ${ch.name}`);

    btn.innerHTML = `
        <div class="channel-poster-wrap">
            <img src="${ch.poster}" alt="${ch.name}" class="channel-poster-img" loading="lazy">
            <span class="channel-live-pill">LIVE</span>
        </div>
        <div class="channel-card-body">
            <span class="channel-name">${ch.name}</span>
            <span class="channel-genre">${ch.genre}</span>
        </div>
    `;

    btn.addEventListener("click", () => {
        playStream(ch.stream, ch.name, index);
    });

    return btn;
}

/* ==============================================================================
   DYNAMIC HERO BILLBOARD UPDATER
   ============================================================================== */
function setupBillboardListeners() {
    const bTitle = document.getElementById("billboard-title");
    const bDesc = document.getElementById("billboard-desc");
    const bBadge = document.getElementById("billboard-badge");

    document.addEventListener("focusin", (e) => {
        const target = e.target;
        if (!target) return;

        const title = target.getAttribute("data-title");
        const desc = target.getAttribute("data-desc");
        const badge = target.getAttribute("data-badge");

        if (title && bTitle) bTitle.textContent = title;
        if (desc && bDesc) bDesc.textContent = desc;
        if (badge && bBadge) bBadge.textContent = badge;
    });
}

/* ==============================================================================
   TAB SWITCHING ENGINE
   ============================================================================== */
function switchTab(index) {
    if (index < 0 || index >= TABS.length) return;
    activeTabIndex = index;
    const targetTab = TABS[activeTabIndex];

    // Update Tab Buttons
    const tabButtons = document.querySelectorAll(".nav-tab");
    tabButtons.forEach((tab, i) => {
        const isActive = i === activeTabIndex;
        tab.classList.toggle("active", isActive);
        tab.setAttribute("aria-selected", String(isActive));
        tab.tabIndex = isActive ? 0 : -1;
    });

    // Update Panes
    TABS.forEach(tabName => {
        const pane = document.getElementById(`pane-${tabName}`);
        if (pane) {
            const isPaneActive = tabName === targetTab;
            pane.hidden = !isPaneActive;
            pane.classList.toggle("active", isPaneActive);
        }
    });

    // Reset key sequence on tab switch
    keyHistory = [];
}

/* ==============================================================================
   D-PAD SPATIAL NAVIGATION & SECRET COMBO
   ============================================================================== */
function setupDpadNavigation() {
    document.addEventListener("keydown", (e) => {
        const key = e.key;

        // Check Secret Combo on Settings Tab
        if (TABS[activeTabIndex] === "settings") {
            keyHistory.push(key);
            if (keyHistory.length > SECRET_COMBO.length) {
                keyHistory.shift();
            }
            if (isSecretComboMatched()) {
                e.preventDefault();
                keyHistory = [];
                triggerSecretVault();
                return;
            }
        }

        // Global Back key handler
        if (key === "Escape" || key === "Backspace") {
            const videoOverlay = document.getElementById("video-overlay");
            if (videoOverlay && !videoOverlay.hidden) {
                e.preventDefault();
                closePlayer();
                return;
            }

            const vaultModal = document.getElementById("vault-modal");
            if (vaultModal && vaultModal.open) {
                e.preventDefault();
                closeVault();
                return;
            }
        }

        // Tab Row Navigation
        const activeEl = document.activeElement;
        if (activeEl && activeEl.classList.contains("nav-tab")) {
            if (key === "ArrowRight") {
                e.preventDefault();
                const next = (activeTabIndex + 1) % TABS.length;
                switchTab(next);
                document.querySelectorAll(".nav-tab")[next].focus();
            } else if (key === "ArrowLeft") {
                e.preventDefault();
                const prev = (activeTabIndex - 1 + TABS.length) % TABS.length;
                switchTab(prev);
                document.querySelectorAll(".nav-tab")[prev].focus();
            } else if (key === "ArrowDown") {
                e.preventDefault();
                const currentPane = document.getElementById(`pane-${TABS[activeTabIndex]}`);
                if (currentPane) {
                    const firstCard = currentPane.querySelector(".tv-card");
                    if (firstCard) firstCard.focus();
                }
            }
            return;
        }

        // Move Up to Tab Bar from top row cards
        if (key === "ArrowUp" && activeEl && activeEl.classList.contains("tv-card")) {
            const currentPane = document.getElementById(`pane-${TABS[activeTabIndex]}`);
            const allCards = Array.from(currentPane ? currentPane.querySelectorAll(".tv-card") : []);
            const currentIndex = allCards.indexOf(activeEl);
            if (currentIndex >= 0 && currentIndex < 4) {
                e.preventDefault();
                const currentTabBtn = document.querySelectorAll(".nav-tab")[activeTabIndex];
                if (currentTabBtn) currentTabBtn.focus();
            }
        }
    });

    // App launch click listeners
    document.querySelectorAll("[data-pkg]").forEach(btn => {
        btn.addEventListener("click", () => {
            const pkg = btn.getAttribute("data-pkg");
            launchNativeApp(pkg);
        });
    });
}

function isSecretComboMatched() {
    if (keyHistory.length !== SECRET_COMBO.length) return false;
    for (let i = 0; i < SECRET_COMBO.length; i++) {
        if (keyHistory[i] !== SECRET_COMBO[i]) return false;
    }
    return true;
}

/* ==============================================================================
   STEALTH 18+ VAULT & FIRST-TIME PIN WIZARD
   ============================================================================== */
function triggerSecretVault() {
    const modal = document.getElementById("vault-modal");
    if (!modal) return;

    currentPinInput = "";
    const savedPin = getStoredPin();

    const titleEl = document.getElementById("vault-modal-title");
    const descEl = document.getElementById("vault-modal-desc");
    const statusEl = document.getElementById("vault-status-msg");
    const contentEl = document.getElementById("vault-content");
    const keypadEl = document.getElementById("vault-keypad");

    if (contentEl) contentEl.hidden = true;
    if (keypadEl) keypadEl.hidden = false;
    updatePinDisplay();

    if (!savedPin) {
        vaultState = "SETUP_1";
        if (titleEl) titleEl.textContent = "🆕 Atur PIN 4-Digit Baru";
        if (descEl) descEl.textContent = "Tentukan 4 digit angka rahasia Anda.";
        if (statusEl) {
            statusEl.textContent = "Masukkan 4 digit PIN baru pilihan Anda";
            statusEl.className = "vault-status-msg";
        }
    } else {
        vaultState = "ENTER_PIN";
        if (titleEl) titleEl.textContent = "🔐 Buka Brankas 18+";
        if (descEl) descEl.textContent = "Masukkan 4 digit PIN rahasia Anda.";
        if (statusEl) {
            statusEl.textContent = "Sesi 18+ tersembunyi total dari layar utama";
            statusEl.className = "vault-status-msg";
        }
    }

    modal.showModal();
    const firstKey = modal.querySelector(".pin-btn");
    if (firstKey) firstKey.focus();
}

function setupVaultKeypad() {
    const keypad = document.getElementById("vault-keypad");
    if (!keypad) return;

    keypad.querySelectorAll(".pin-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const key = btn.getAttribute("data-key");
            handleVaultKey(key);
        });
    });

    const btnCloseVault = document.getElementById("btn-close-vault");
    if (btnCloseVault) {
        btnCloseVault.addEventListener("click", () => {
            closeVault();
        });
    }

    const btnCancel = document.getElementById("btn-cancel-vault");
    if (btnCancel) {
        btnCancel.addEventListener("click", () => {
            closeVault();
        });
    }
}

function handleVaultKey(key) {
    const statusEl = document.getElementById("vault-status-msg");

    if (key === "clear") {
        currentPinInput = "";
        updatePinDisplay();
        return;
    }

    if (key === "submit") {
        verifyVaultPin();
        return;
    }

    if (currentPinInput.length < 4) {
        currentPinInput += key;
        updatePinDisplay();

        if (currentPinInput.length === 4) {
            // Auto submit when 4 digits entered
            setTimeout(verifyVaultPin, 120);
        }
    }
}

function verifyVaultPin() {
    const statusEl = document.getElementById("vault-status-msg");
    const titleEl = document.getElementById("vault-modal-title");
    const descEl = document.getElementById("vault-modal-desc");

    if (currentPinInput.length !== 4) {
        if (statusEl) {
            statusEl.textContent = "Harap masukkan lengkap 4 digit angka!";
            statusEl.className = "vault-status-msg error";
        }
        return;
    }

    if (vaultState === "SETUP_1") {
        tempPinSetup = currentPinInput;
        currentPinInput = "";
        vaultState = "SETUP_CONFIRM";
        updatePinDisplay();
        if (titleEl) titleEl.textContent = "🔄 Konfirmasi PIN Baru";
        if (descEl) descEl.textContent = "Ulangi 4 digit angka yang sama.";
        if (statusEl) {
            statusEl.textContent = "Ketik ulang PIN untuk memastikan";
            statusEl.className = "vault-status-msg";
        }
    } else if (vaultState === "SETUP_CONFIRM") {
        if (currentPinInput === tempPinSetup) {
            storePin(currentPinInput);
            unlockVaultSuccess();
        } else {
            currentPinInput = "";
            tempPinSetup = "";
            vaultState = "SETUP_1";
            updatePinDisplay();
            if (titleEl) titleEl.textContent = "🆕 Atur PIN 4-Digit Baru";
            if (statusEl) {
                statusEl.textContent = "PIN tidak cocok! Silakan buat ulang dari awal.";
                statusEl.className = "vault-status-msg error";
            }
        }
    } else if (vaultState === "ENTER_PIN") {
        const savedPin = getStoredPin();
        if (currentPinInput === savedPin) {
            unlockVaultSuccess();
        } else {
            currentPinInput = "";
            updatePinDisplay();
            if (statusEl) {
                statusEl.textContent = "PIN Salah! Coba lagi.";
                statusEl.className = "vault-status-msg error";
            }
        }
    }
}

function unlockVaultSuccess() {
    vaultState = "UNLOCKED";
    const titleEl = document.getElementById("vault-modal-title");
    const statusEl = document.getElementById("vault-status-msg");
    const keypadEl = document.getElementById("vault-keypad");
    const contentEl = document.getElementById("vault-content");

    if (titleEl) titleEl.textContent = "🔓 Sesi Rahasia 18+ Terbuka";
    if (statusEl) {
        statusEl.textContent = "Berhasil masuk ke brankas rahasia.";
        statusEl.className = "vault-status-msg";
    }
    if (keypadEl) keypadEl.hidden = true;
    if (contentEl) {
        contentEl.hidden = false;
        renderAdultChannels();
        const firstAdult = contentEl.querySelector(".tv-card");
        if (firstAdult) firstAdult.focus();
    }
}

function renderAdultChannels() {
    const grid = document.getElementById("adult-channels-grid");
    if (!grid) return;
    grid.innerHTML = "";

    ADULT_CHANNELS.forEach((ch, idx) => {
        const btn = document.createElement("button");
        btn.className = "tv-card channel-card";
        btn.tabIndex = 0;
        btn.setAttribute("data-stream", ch.stream);
        btn.setAttribute("data-title", ch.name);
        btn.setAttribute("data-desc", "Siaran terkunci proteksi keamanan 18+");
        btn.setAttribute("data-badge", "18+ PROTECTED");

        btn.innerHTML = `
            <div class="channel-poster-wrap">
                <img src="${ch.poster}" alt="${ch.name}" class="channel-poster-img">
                <span class="channel-live-pill" style="background:#e11d48">18+</span>
            </div>
            <div class="channel-card-body">
                <span class="channel-name">${ch.name}</span>
                <span class="channel-genre">Saluran Khusus Dewasa</span>
            </div>
        `;

        btn.addEventListener("click", () => {
            playStream(ch.stream, ch.name, idx);
        });

        grid.appendChild(btn);
    });
}

function updatePinDisplay() {
    const el = document.getElementById("vault-pin-display");
    if (!el) return;
    const len = currentPinInput.length;
    el.textContent = "•".repeat(len) + "-".repeat(4 - len);
}

function closeVault() {
    const modal = document.getElementById("vault-modal");
    if (modal) modal.close();
    currentPinInput = "";
    vaultState = "LOCKED";
}

function getStoredPin() {
    if (typeof localStorage !== "undefined") {
        return localStorage.getItem("vault_18_pin");
    }
    return null;
}

function storePin(pin) {
    if (typeof localStorage !== "undefined") {
        localStorage.setItem("vault_18_pin", pin);
    }
}

/* ==============================================================================
   HLS FULLSCREEN PLAYER ENGINE
   ============================================================================== */
function playStream(url, name, index) {
    if (typeof index === "number") currentChannelIndex = index;

    const overlay = document.getElementById("video-overlay");
    const nameEl = document.getElementById("player-channel-name");
    const video = document.getElementById("tv-video-player");

    if (nameEl) nameEl.textContent = name || "Channel Live";
    if (overlay) overlay.hidden = false;

    if (!video) return;

    if (hlsPlayer) {
        hlsPlayer.destroy();
        hlsPlayer = null;
    }

    if (window.Hls && Hls.isSupported()) {
        hlsPlayer = new Hls({ enableWorker: false, lowLatencyMode: true });
        hlsPlayer.loadSource(url);
        hlsPlayer.attachMedia(video);
        hlsPlayer.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play().catch(() => {});
        });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url;
        video.play().catch(() => {});
    }

    const backBtn = document.getElementById("btn-back-player");
    if (backBtn) {
        backBtn.onclick = closePlayer;
        backBtn.focus();
    }
}

function closePlayer() {
    const overlay = document.getElementById("video-overlay");
    const video = document.getElementById("tv-video-player");

    if (hlsPlayer) {
        hlsPlayer.destroy();
        hlsPlayer = null;
    }
    if (video) {
        video.pause();
        video.src = "";
    }
    if (overlay) overlay.hidden = true;
}

/* ==============================================================================
   NATIVE BRIDGE & APP LAUNCHERS
   ============================================================================== */
function launchNativeApp(pkg) {
    if (typeof window !== "undefined" && window.TvBridge && typeof window.TvBridge.launchApp === "function") {
        window.TvBridge.launchApp(pkg);
    } else {
        console.log(`[Preview Mode] Launching: ${pkg}`);
    }
}

function openSettings(section) {
    if (typeof window !== "undefined" && window.TvBridge && typeof window.TvBridge.openSettingsSection === "function") {
        window.TvBridge.openSettingsSection(section);
    } else if (typeof window !== "undefined" && window.TvBridge && typeof window.TvBridge.openSettings === "function") {
        window.TvBridge.openSettings();
    } else {
        console.log(`[Preview Mode] Open Settings Section: ${section}`);
    }
}

function controlSenandung(action) {
    if (typeof fetch === "undefined") return;
    const url = "http://192.168.1.100:3000/api/player/" + action;
    fetch(url, { method: "POST" }).catch(() => {
        console.log("Senandung command dispatched:", action);
    });
}

// Auto Init on DOM Loaded
if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", initLauncher);
}

// Export for Unit Tests
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        CHANNELS,
        ADULT_CHANNELS,
        TABS,
        switchTab,
        isSecretComboMatched,
        storePin,
        getStoredPin
    };
}
