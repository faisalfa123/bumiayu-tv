/* ==============================================================================
   BUMIAYU TV - GOOGLE TV MODERN NAVIGATION & MEDIA ENGINE (v2.1.0)
   Hardware Optimized for Xiaomi Smart TV 4A 32" (Android TV 9)
   Pure 2D Spatial Grid Navigation with Keyboard & Remote D-Pad Support
   ============================================================================== */

const CHANNELS = [
    { id: "trans7", name: "Trans7", genre: "Nasional Hiburan", desc: "Program ragam hiburan keluarga, petualangan alam, dan edukasi populer Indonesia.", stream: "https://live.cnbcindonesia.com/trans7/smil:trans7.smil/playlist.m3u8", poster: "assets/trans7.png" },
    { id: "transtv", name: "Trans TV", genre: "Bioskop & Lifestyle", desc: "Film bioskop box office terpopuler, gaya hidup, dan reality show keluarga.", stream: "https://live.cnbcindonesia.com/transtv/smil:transtv.smil/playlist.m3u8", poster: "assets/transtv.png" },
    { id: "metrotv", name: "Metro TV", genre: "Nasional News", desc: "Saluran berita 24 jam dengan program talkshow politik dan ekonomi nasional.", stream: "https://edge.medcom.id/live-edge/smil:metro.smil/playlist.m3u8", poster: "assets/metrotv.png" },
    { id: "tvri", name: "TVRI Nasional", genre: "Saluran Pemersatu", desc: "Lembaga penyiaran publik yang menjangkau seluruh pelosok kepulauan nusantara.", stream: "https://ott-balancer.tvri.go.id/live/eds/Nasional/hls/Nasional.m3u8", poster: "assets/tvri.png" },
    { id: "tvri_bali", name: "TVRI Bali", genre: "Seni & Wisata", desc: "Warta budaya, seni tradisi Dewata, dan pariwisata Pulau Bali.", stream: "https://ott-balancer.tvri.go.id/live/eds/Bali/hls/Bali.m3u8", poster: "assets/tvri.png" },
    { id: "tvri_sumut", name: "TVRI Sumatera Utara", genre: "Warta Regional", desc: "Warta berita, kebudayaan Melayu Batak, dan ragam acara Sumatera Utara.", stream: "https://ott-balancer.tvri.go.id/live/eds/Sumut/hls/Sumut.m3u8", poster: "assets/tvri.png" },
    { id: "tvri_kalsel", name: "TVRI Kalimantan Selatan", genre: "Warta Borneo", desc: "Liputan Borneo, warta budaya Banjar, dan siaran regional Kalsel.", stream: "https://ott-balancer.tvri.go.id/live/eds/Kalsel/hls/Kalsel.m3u8", poster: "assets/tvri.png" },
    { id: "tvri_jateng", name: "TVRI Jawa Tengah", genre: "Daerah & Budaya", desc: "Siaran kearifan lokal, budaya, dan warta regional Jawa Tengah.", stream: "https://ott-balancer.tvri.go.id/live/eds/Jateng/hls/Jateng.m3u8", poster: "assets/tvri.png" },
    { id: "tvri_jatim", name: "TVRI Jawa Timur", genre: "Daerah & Informasi", desc: "Siaran informasi daerah dan hiburan masyarakat Jawa Timur.", stream: "https://ott-balancer.tvri.go.id/live/eds/Jatim/hls/Jatim.m3u8", poster: "assets/tvri.png" },
    { id: "tvri_jogja", name: "TVRI Yogyakarta", genre: "Budaya Nusantara", desc: "Warta budaya istimewa, seni tradisi, dan liputan Yogyakarta.", stream: "https://ott-balancer.tvri.go.id/live/eds/Jogjakarta/hls/Jogjakarta.m3u8", poster: "assets/tvri.png" },
    { id: "nhkworld", name: "NHK World Japan", genre: "Internasional (Jepang)", desc: "Warta berita dunia, dokumenter sains, dan kebudayaan Jepang berbahasa Inggris 24/7.", stream: "https://media-tyo.hls.nhkworld.jp/hls/w/live/master.m3u8", poster: "assets/nhkworld.png" },
    { id: "dw", name: "DW English", genre: "Internasional (Jerman)", desc: "Saluran berita internasional Jerman menyajikan liputan peristiwa dunia dan laporan mendalam.", stream: "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8", poster: "assets/dw.png" },
    { id: "ahsantv", name: "Ahsan TV", genre: "Edukasi Islami", desc: "Siaran kajian keluarga dan edukasi Islam berkualitas.", stream: "https://5bf7b725107e5.streamlock.net/ahsantv/ahsantv/playlist.m3u8", poster: "assets/settings.png" },
    { id: "ugtv", name: "UGTV Gunadarma", genre: "Pendidikan & Sains", desc: "Televisi edukasi, sains terapan, dan warta kampus Universitas Gunadarma.", stream: "https://cdn.gunadarma.ac.id/streams/ugtv/ingestugtv.m3u8", poster: "assets/settings.png" },
    { id: "aktv", name: "AKTV", genre: "Inspirasi Regional", desc: "Siaran warta lokal dan ragam acara seni budaya Jawa Barat.", stream: "https://akativi.siar.us/live/akativi.m3u8", poster: "assets/settings.png" },
    { id: "ammedia", name: "AM Media", genre: "Religi & Komunitas", desc: "Saluran siaran dakwah dan informasi komunitas.", stream: "https://ammedia.siar.us/ammedia/live/playlist.m3u8", poster: "assets/settings.png" },
    { id: "muxtest", name: "Big Buck Bunny HD", genre: "Uji Coba 60fps", desc: "Video streaming pengujian performa hardware dekoder HLS 1080p 60fps.", stream: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", poster: "assets/settings.png" }
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
const SECRET_COMBO = [38, 38, 40, 40]; // Keycodes for ArrowUp & ArrowDown
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
    setupBillboardListeners();
    setupVaultKeypad();
    setupDpadNavigation();

    // Default focus: focus first card on Home pane
    setTimeout(() => {
        const firstCard = document.querySelector("#pane-home .tv-card");
        if (firstCard) {
            firstCard.focus();
        } else {
            const firstTab = document.querySelector(".nav-tab");
            if (firstTab) firstTab.focus();
        }
    }, 150);
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
    btn.tabIndex = 0;
    btn.setAttribute("data-stream", ch.stream);
    btn.setAttribute("data-title", ch.name);
    btn.setAttribute("data-desc", ch.desc);
    btn.setAttribute("data-badge", "LIVE TV");
    btn.setAttribute("data-index", String(index));
    btn.setAttribute("aria-label", `Tonton ${ch.name}`);

    btn.innerHTML = `
        <div class="channel-poster-wrap">
            <img src="${ch.poster}" alt="${ch.name}" class="channel-poster-img" onerror="this.src='assets/settings.png'">
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
function switchTab(index, shouldFocusPane = false) {
    if (index < 0 || index >= TABS.length) return;
    activeTabIndex = index;
    const targetTab = TABS[activeTabIndex];

    // Update Tab Buttons
    const tabButtons = document.querySelectorAll(".nav-tab");
    tabButtons.forEach((tab, i) => {
        const isActive = i === activeTabIndex;
        tab.classList.toggle("active", isActive);
        tab.setAttribute("aria-selected", String(isActive));
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

    keyHistory = [];

    if (shouldFocusPane) {
        const currentPane = document.getElementById(`pane-${targetTab}`);
        if (currentPane) {
            const firstCard = currentPane.querySelector(".tv-card");
            if (firstCard) firstCard.focus();
        }
    }
}

/* ==============================================================================
   2D SPATIAL D-PAD NAVIGATION ENGINE
   ============================================================================== */
function setupDpadNavigation() {
    document.addEventListener("keydown", (e) => {
        const code = e.keyCode || e.which;

        // Overlay & Modal Handlers first
        const videoOverlay = document.getElementById("video-overlay");
        if (videoOverlay && videoOverlay.style.display === "block") {
            handleVideoPlayerKeys(e, code);
            return;
        }

        const vaultModal = document.getElementById("vault-modal");
        if (vaultModal && vaultModal.open) {
            handleVaultModalKeys(e, code);
            return;
        }

        // Secret Combo Tracking on Settings Tab
        if (TABS[activeTabIndex] === "settings") {
            if (code === 38 || code === 40) { // Up or Down
                keyHistory.push(code);
                if (keyHistory.length > SECRET_COMBO.length) {
                    keyHistory.shift();
                }
                if (isSecretComboMatched()) {
                    e.preventDefault();
                    keyHistory = [];
                    triggerSecretVault();
                    return;
                }
            } else {
                keyHistory = [];
            }
        }

        const current = document.activeElement;

        // CASE A: Focus is on Top Navigation Tabs
        if (current && current.classList.contains("nav-tab")) {
            const tabs = Array.from(document.querySelectorAll(".nav-tab"));
            const curIdx = tabs.indexOf(current);

            switch (code) {
                case 39: // Right
                    e.preventDefault();
                    if (curIdx + 1 < tabs.length) {
                        tabs[curIdx + 1].focus();
                        switchTab(curIdx + 1, false);
                    }
                    break;
                case 37: // Left
                    e.preventDefault();
                    if (curIdx - 1 >= 0) {
                        tabs[curIdx - 1].focus();
                        switchTab(curIdx - 1, false);
                    }
                    break;
                case 40: // Down -> Move into Active Pane Cards
                    e.preventDefault();
                    const activePane = document.getElementById(`pane-${TABS[activeTabIndex]}`);
                    if (activePane) {
                        const firstCard = activePane.querySelector(".tv-card");
                        if (firstCard) firstCard.focus();
                    }
                    break;
                case 13: // Enter / Center OK
                case 23:
                    e.preventDefault();
                    switchTab(curIdx, true);
                    break;
            }
            return;
        }

        // CASE B: Focus is on a Card inside Active Pane
        if (current && current.classList.contains("tv-card")) {
            const activePane = document.getElementById(`pane-${TABS[activeTabIndex]}`);
            if (!activePane) return;

            const cards = Array.from(activePane.querySelectorAll(".tv-card"));
            const curIdx = cards.indexOf(current);
            if (curIdx === -1) return;

            // Compute columns based on grid layout
            const parentShelf = current.closest(".shelf-grid");
            let cols = 4;
            if (parentShelf) {
                if (parentShelf.classList.contains("dual-yt-shelf")) cols = 3;
                else if (parentShelf.classList.contains("channels-shelf")) cols = 4;
                else if (parentShelf.classList.contains("channels-full-grid")) cols = 4;
                else if (parentShelf.classList.contains("apps-shelf")) cols = 4;
                else if (parentShelf.classList.contains("settings-shelf")) cols = 4;
            }

            switch (code) {
                case 39: // Right
                    e.preventDefault();
                    if (curIdx + 1 < cards.length) {
                        cards[curIdx + 1].focus();
                    }
                    break;

                case 37: // Left
                    e.preventDefault();
                    if (curIdx - 1 >= 0) {
                        cards[curIdx - 1].focus();
                    }
                    break;

                case 40: // Down
                    e.preventDefault();
                    if (curIdx + cols < cards.length) {
                        cards[curIdx + cols].focus();
                    }
                    break;

                case 38: // Up
                    e.preventDefault();
                    if (curIdx - cols >= 0) {
                        cards[curIdx - cols].focus();
                    } else {
                        // At top row of cards -> jump up to active Navigation Tab!
                        const currentTab = document.querySelectorAll(".nav-tab")[activeTabIndex];
                        if (currentTab) currentTab.focus();
                    }
                    break;

                case 13: // Enter / OK
                case 23: // DPAD_CENTER
                    e.preventDefault();
                    current.click();
                    break;

                case 27: // Escape / Back
                case 4:
                    // Jump to Nav tab on Back press if in pane
                    const currentTab = document.querySelectorAll(".nav-tab")[activeTabIndex];
                    if (currentTab) currentTab.focus();
                    break;
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

function handleVaultModalKeys(e, code) {
    if (code === 27 || code === 4) { // Escape / Back
        e.preventDefault();
        closeVault();
        return;
    }

    const current = document.activeElement;
    if (!current) return;

    // Inside Vault Unlocked View
    const contentEl = document.getElementById("vault-content");
    if (contentEl && !contentEl.hidden) {
        const adultCards = Array.from(contentEl.querySelectorAll(".tv-card, .btn-lock, #btn-cancel-vault"));
        const idx = adultCards.indexOf(current);
        if (idx !== -1) {
            if (code === 39 && idx + 1 < adultCards.length) { e.preventDefault(); adultCards[idx + 1].focus(); }
            else if (code === 37 && idx - 1 >= 0) { e.preventDefault(); adultCards[idx - 1].focus(); }
            else if (code === 13 || code === 23) { e.preventDefault(); current.click(); }
        }
        return;
    }

    // Inside Numeric Keypad Grid (3 columns)
    const keypad = document.getElementById("vault-keypad");
    if (!keypad || keypad.hidden) return;

    const btns = Array.from(keypad.querySelectorAll(".pin-btn"));
    const curIdx = btns.indexOf(current);

    if (curIdx !== -1) {
        switch (code) {
            case 39: // Right
                e.preventDefault();
                if (curIdx + 1 < btns.length) btns[curIdx + 1].focus();
                break;
            case 37: // Left
                e.preventDefault();
                if (curIdx - 1 >= 0) btns[curIdx - 1].focus();
                break;
            case 40: // Down (grid 3 cols)
                e.preventDefault();
                if (curIdx + 3 < btns.length) btns[curIdx + 3].focus();
                else {
                    const cancelBtn = document.getElementById("btn-cancel-vault");
                    if (cancelBtn) cancelBtn.focus();
                }
                break;
            case 38: // Up (grid 3 cols)
                e.preventDefault();
                if (curIdx - 3 >= 0) btns[curIdx - 3].focus();
                break;
            case 13: // OK
            case 23:
                e.preventDefault();
                current.click();
                break;
        }
    } else if (current.id === "btn-cancel-vault") {
        if (code === 38) {
            e.preventDefault();
            btns[btns.length - 1].focus();
        } else if (code === 13 || code === 23) {
            e.preventDefault();
            closeVault();
        }
    }
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
    if (btnCloseVault) btnCloseVault.addEventListener("click", closeVault);

    const btnCancel = document.getElementById("btn-cancel-vault");
    if (btnCancel) btnCancel.addEventListener("click", closeVault);
}

function handleVaultKey(key) {
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
                <img src="${ch.poster}" alt="${ch.name}" class="channel-poster-img" onerror="this.src='assets/settings.png'">
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
    // Refocus settings card
    const firstSettings = document.querySelector("#pane-settings .tv-card");
    if (firstSettings) firstSettings.focus();
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
   HLS FULLSCREEN PLAYER ENGINE (OFFLINE & LOCAL EMBEDDED FALLBACK)
   ============================================================================== */
function playStream(url, name, index) {
    if (typeof index === "number") currentChannelIndex = index;

    const overlay = document.getElementById("video-overlay");
    const nameEl = document.getElementById("player-channel-name");
    const video = document.getElementById("tv-video-player");

    if (nameEl) nameEl.textContent = name || "Channel Live";
    if (overlay) {
        overlay.style.display = "block";
        overlay.hidden = false;
    }

    if (!video) return;

    if (hlsPlayer) {
        try { hlsPlayer.destroy(); } catch (_) {}
        hlsPlayer = null;
    }

    // Check Hls availability (local or global)
    if (typeof Hls !== "undefined" && Hls.isSupported() && url.includes(".m3u8")) {
        try {
            hlsPlayer = new Hls({
                maxBufferLength: 15,
                maxMaxBufferLength: 30,
                enableWorker: false, // Safer on WebView
                lowLatencyMode: false,
                backBufferLength: 10
            });
            hlsPlayer.loadSource(url);
            hlsPlayer.attachMedia(video);
            hlsPlayer.on(Hls.Events.MANIFEST_PARSED, () => {
                video.play().catch(() => {});
            });
            hlsPlayer.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            hlsPlayer.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            hlsPlayer.recoverMediaError();
                            break;
                        default:
                            destroyPlayer();
                            break;
                    }
                }
            });
        } catch (e) {
            // Direct native fallback
            video.src = url;
            video.play().catch(() => {});
        }
    } else {
        video.src = url;
        video.load();
        video.play().catch(() => {});
    }

    const backBtn = document.getElementById("btn-back-player");
    if (backBtn) backBtn.focus();
}

function handleVideoPlayerKeys(e, code) {
    if (code === 27 || code === 4 || e.key === "Escape" || e.key === "Backspace") {
        e.preventDefault();
        closePlayer();
        return;
    }

    // Switch channels left/right with D-Pad
    if (code === 39) { // Next Channel
        e.preventDefault();
        currentChannelIndex = (currentChannelIndex + 1) % CHANNELS.length;
        const next = CHANNELS[currentChannelIndex];
        playStream(next.stream, next.name, currentChannelIndex);
    } else if (code === 37) { // Previous Channel
        e.preventDefault();
        currentChannelIndex = (currentChannelIndex - 1 + CHANNELS.length) % CHANNELS.length;
        const prev = CHANNELS[currentChannelIndex];
        playStream(prev.stream, prev.name, currentChannelIndex);
    }
}

function destroyPlayer() {
    const video = document.getElementById("tv-video-player");
    if (hlsPlayer) {
        try { hlsPlayer.destroy(); } catch (_) {}
        hlsPlayer = null;
    }
    if (video) {
        video.pause();
        video.removeAttribute("src");
        video.load();
    }
}

function closePlayer() {
    const overlay = document.getElementById("video-overlay");
    destroyPlayer();
    if (overlay) {
        overlay.style.display = "none";
        overlay.hidden = true;
    }

    // Refocus active pane first card
    const activePane = document.getElementById(`pane-${TABS[activeTabIndex]}`);
    if (activePane) {
        const first = activePane.querySelector(".tv-card");
        if (first) first.focus();
    }
}

// Android Back Hook
if (typeof window !== "undefined") {
    window.onAndroidBack = function() {
        const overlay = document.getElementById("video-overlay");
        if (overlay && overlay.style.display === "block") {
            closePlayer();
            return true;
        }

        const vaultModal = document.getElementById("vault-modal");
        if (vaultModal && vaultModal.open) {
            closeVault();
            return true;
        }

        return false;
    };
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
