/* ==============================================================================
   BUMIAYU TV - GOOGLE TV MODERN NAVIGATION & MEDIA ENGINE (v2.1.0)
   Hardware Optimized for Xiaomi Smart TV 4A 32" (Android TV 9)
   Pure 2D Spatial Grid Navigation with Keyboard & Remote D-Pad Support
   ============================================================================== */

const CHANNELS = [
    // 17 Saluran Inti (Pertahankan Penuh & Tanpa Perubahan URL)
    { id: "trans7", name: "Trans7", genre: "Nasional Hiburan", desc: "Program ragam hiburan keluarga, petualangan alam, dan edukasi populer Indonesia.", stream: "https://live.cnbcindonesia.com/trans7/smil:trans7.smil/playlist.m3u8", poster: "assets/trans7.png" },
    { id: "transtv", name: "Trans TV", genre: "Bioskop & Lifestyle", desc: "Film bioskop box office terpopuler, gaya hidup, dan reality show keluarga.", stream: "https://live.cnbcindonesia.com/transtv/smil:transtv.smil/playlist.m3u8", poster: "assets/transtv.png" },
    { id: "metrotv", name: "Metro TV", genre: "Nasional News", desc: "Saluran berita 24 jam dengan program talkshow politik dan ekonomi nasional.", stream: "https://edge.medcom.id/live-edge/smil:metro.smil/playlist.m3u8", poster: "assets/metrotv.png" },
    { id: "tvri", name: "TVRI Nasional", genre: "Saluran Pemersatu", desc: "Lembaga penyiaran publik yang menjangkau seluruh pelosok kepulauan nusantara.", stream: "https://ott-balancer.tvri.go.id/live/eds/Nasional/hls/Nasional.m3u8", poster: "assets/tvri.png" },
    { id: "tvri_bali", name: "TVRI Bali", genre: "Seni & Wisata", desc: "Warta budaya, seni tradisi Dewata, dan pariwisata Pulau Bali.", stream: "https://ott-balancer.tvri.go.id/live/eds/Bali/hls/Bali.m3u8", poster: "assets/tvri_bali.png" },
    { id: "tvri_sumut", name: "TVRI Sumatera Utara", genre: "Warta Regional", desc: "Warta berita, kebudayaan Melayu Batak, dan ragam acara Sumatera Utara.", stream: "https://ott-balancer.tvri.go.id/live/eds/Sumut/hls/Sumut.m3u8", poster: "assets/tvri_sumut.png" },
    { id: "tvri_kalsel", name: "TVRI Kalimantan Selatan", genre: "Warta Borneo", desc: "Liputan Borneo, warta budaya Banjar, dan siaran regional Kalsel.", stream: "https://ott-balancer.tvri.go.id/live/eds/Kalsel/hls/Kalsel.m3u8", poster: "assets/tvri_kalsel.png" },
    { id: "tvri_jateng", name: "TVRI Jawa Tengah", genre: "Daerah & Budaya", desc: "Siaran kearifan lokal, budaya, dan warta regional Jawa Tengah.", stream: "https://ott-balancer.tvri.go.id/live/eds/Jateng/hls/Jateng.m3u8", poster: "assets/tvri_jateng.png" },
    { id: "tvri_jatim", name: "TVRI Jawa Timur", genre: "Daerah & Informasi", desc: "Siaran informasi daerah dan hiburan masyarakat Jawa Timur.", stream: "https://ott-balancer.tvri.go.id/live/eds/Jatim/hls/Jatim.m3u8", poster: "assets/tvri_jatim.png" },
    { id: "tvri_jogja", name: "TVRI Yogyakarta", genre: "Budaya Nusantara", desc: "Warta budaya istimewa, seni tradisi, dan liputan Yogyakarta.", stream: "https://ott-balancer.tvri.go.id/live/eds/Jogjakarta/hls/Jogjakarta.m3u8", poster: "assets/tvri_jogja.png" },
    { id: "nhkworld", name: "NHK World Japan", genre: "Internasional (Jepang)", desc: "Warta berita dunia, dokumenter sains, dan kebudayaan Jepang berbahasa Inggris 24/7.", stream: "https://media-tyo.hls.nhkworld.jp/hls/w/live/master.m3u8", poster: "assets/nhkworld.png" },
    { id: "dw", name: "DW English", genre: "Internasional (Jerman)", desc: "Saluran berita internasional Jerman menyajikan liputan peristiwa dunia dan laporan mendalam.", stream: "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8", poster: "assets/dw.png" },
    { id: "ahsantv", name: "Ahsan TV", genre: "Edukasi Islami", desc: "Siaran kajian keluarga dan edukasi Islam berkualitas.", stream: "https://5bf7b725107e5.streamlock.net/ahsantv/ahsantv/playlist.m3u8", poster: "assets/ahsantv.png" },
    { id: "ugtv", name: "UGTV Gunadarma", genre: "Pendidikan & Sains", desc: "Televisi edukasi, sains terapan, dan warta kampus Universitas Gunadarma.", stream: "https://cdn.gunadarma.ac.id/streams/ugtv/ingestugtv.m3u8", poster: "assets/ugtv.png" },
    { id: "aktv", name: "AKTV", genre: "Inspirasi Regional", desc: "Siaran warta lokal dan ragam acara seni budaya Jawa Barat.", stream: "https://akativi.siar.us/live/akativi.m3u8", poster: "assets/aktv.png" },
    { id: "ammedia", name: "AM Media", genre: "Religi & Komunitas", desc: "Saluran siaran dakwah dan informasi komunitas.", stream: "https://ammedia.siar.us/ammedia/live/playlist.m3u8", poster: "assets/ammedia.png" },
    { id: "muxtest", name: "Big Buck Bunny HD", genre: "Uji Coba 60fps", desc: "Video streaming pengujian performa hardware dekoder HLS 1080p 60fps.", stream: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", poster: "assets/muxtest.png" },

    // Saluran Tambahan Nasional & Regional Terverifikasi Aktif
    { id: "tvri_jabar", name: "TVRI Jawa Barat", genre: "Warta Parahyangan", desc: "Siaran informasi, seni budaya Sunda, dan warta seputar Jawa Barat.", stream: "https://ott-balancer.tvri.go.id/live/eds/Jabar/hls/Jabar.m3u8", poster: "assets/tvri_jabar.png" },
    { id: "tvri_kaltim", name: "TVRI Kalimantan Timur", genre: "Warta IKN & Borneo", desc: "Liputan Ibu Kota Nusantara, budaya Dayak, dan warta Kalimantan Timur.", stream: "https://ott-balancer.tvri.go.id/live/eds/Kaltim/hls/Kaltim.m3u8", poster: "assets/tvri_kaltim.png" },
    { id: "tvri_sulsel", name: "TVRI Sulawesi Selatan", genre: "Warta Celebes", desc: "Siaran berita Makassar, kebudayaan Bugis-Makassar, dan Sulawesi Selatan.", stream: "https://ott-balancer.tvri.go.id/live/eds/Sulsel/hls/Sulsel.m3u8", poster: "assets/tvri_sulsel.png" },
    { id: "tvri_papua", name: "TVRI Papua", genre: "Bumi Cenderawasih", desc: "Warta pembangunan kepulauan Papua, seni budaya, dan pesona timur Indonesia.", stream: "https://ott-balancer.tvri.go.id/live/eds/Papua/hls/Papua.m3u8", poster: "assets/tvri_papua.png" },
    { id: "tvri_aceh", name: "TVRI Aceh", genre: "Serambi Mekkah", desc: "Siaran syiar keislaman, warta pembangunan Serambi Mekkah, dan kebudayaan Aceh.", stream: "https://ott-balancer.tvri.go.id/live/eds/Aceh/hls/Aceh.m3u8", poster: "assets/tvri_aceh.png" },
    { id: "tvri_sumbar", name: "TVRI Sumatera Barat", genre: "Ranah Minang", desc: "Warta budaya Ranah Minangkabau, kuliner tradisi, dan berita Sumatera Barat.", stream: "https://ott-balancer.tvri.go.id/live/eds/Sumbar/hls/Sumbar.m3u8", poster: "assets/tvri_sumbar.png" },
    { id: "tvri_riau", name: "TVRI Riau", genre: "Lancang Kuning", desc: "Warta Melayu Riau, kepulauan Selat Malaka, dan kemajuan daerah Riau.", stream: "https://ott-balancer.tvri.go.id/live/eds/Riau/hls/Riau.m3u8", poster: "assets/tvri_riau.png" },

    // Saluran Tambahan Nasional & Regional Populer Terverifikasi
    { id: "rtv", name: "RTV (Rajawali TV)", genre: "Kartun & Keluarga", desc: "Program animasi unggulan anak-anak, serial tokusatsu, dan hiburan keluarga.", stream: "https://rtvstream.rtv.co.id:4555/hls/rtv.m3u8", poster: "assets/rtv.png" },
    { id: "nusantaratv", name: "Nusantara TV", genre: "Berita & Budaya", desc: "Warta berita terkini nusantara, kebudayaan daerah, dan program inspiratif.", stream: "https://nusantaratv.siar.us/nusantaratv/live/playlist.m3u8", poster: "assets/nusantaratv.png" },
    { id: "jawapostv", name: "Jawa Pos TV", genre: "Warta Metropolitan", desc: "Berita investigasi, liputan kota metropolitan, dan kabar regional Jawa Pos.", stream: "http://122.248.43.242:1935/JAWAPOSTVJKT/_definst_/myStream/playlist.m3u8", poster: "assets/jawapostv.png" },
    { id: "tv9", name: "TV9 Nusantara", genre: "Religi & Budaya", desc: "Siaran dakwah santun menyejukkan, warta keislaman dan khazanah nusantara.", stream: "https://5bf7b725107e5.streamlock.net/tv9/tv9/playlist.m3u8", poster: "assets/tv9.png" },
];

const ADULT_CHANNELS = [
    { id: "vault_adult_1", name: "Saluran Privat Dewasa 1", genre: "18+ Sesi Khusus", desc: "Siaran saluran khusus privat dewasa 1080p.", stream: "https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8", poster: "assets/vault_adult_1.png" },
    { id: "vault_adult_2", name: "Saluran Privat Dewasa 2", genre: "18+ Sesi Khusus", desc: "Siaran saluran khusus privat dewasa 60fps.", stream: "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8", poster: "assets/vault_adult_2.png" },
    { id: "vault_adult_3", name: "Saluran Privat Dewasa 3", genre: "18+ Cadangan HLS", desc: "Siaran cadangan kecepatan tinggi proteksi PIN.", stream: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", poster: "assets/vault_adult.png" }
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
let vaultState = "LOCKED";

let currentScreen = "PLAYBOX"; // "PLAYBOX" or "LEGION"

function openLegionView(tabName = "home") {
    currentScreen = "LEGION";
    const pbView = document.getElementById("playbox-view");
    const legionView = document.getElementById("legion-view");
    if (pbView) pbView.style.display = "none";
    if (legionView) legionView.style.display = "block";

    const tabIdx = TABS.indexOf(tabName);
    if (tabIdx !== -1) {
        switchTab(tabIdx, true);
    } else {
        switchTab(0, true);
    }
}

function openPlayboxView() {
    currentScreen = "PLAYBOX";
    const pbView = document.getElementById("playbox-view");
    const legionView = document.getElementById("legion-view");
    if (legionView) legionView.style.display = "none";
    if (pbView) pbView.style.display = "flex";

    const firstCard = document.getElementById("pb-card-livetv");
    if (firstCard) firstCard.focus();
}

function setupPlayboxListeners() {
    const cardLive = document.getElementById("pb-card-livetv");
    const cardYt = document.getElementById("pb-card-youtube");
    const cardCat = document.getElementById("pb-card-catalog");
    const btnSettings = document.getElementById("pb-btn-settings");
    const btnBackPb = document.getElementById("btn-back-to-playbox");

    if (cardLive) cardLive.addEventListener("click", () => openLegionView("livetv"));
    if (cardYt) cardYt.addEventListener("click", () => openLegionView("apps"));
    if (cardCat) cardCat.addEventListener("click", () => openLegionView("home"));
    if (btnSettings) btnSettings.addEventListener("click", () => openLegionView("settings"));
    if (btnBackPb) btnBackPb.addEventListener("click", () => openPlayboxView());
}


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

    document.addEventListener("focusin", (e) => {
        const target = e.target;
        if (!target) return;

        const title = target.getAttribute("data-title");
        const desc = target.getAttribute("data-desc");

        if (title && bTitle) bTitle.textContent = title;
        if (desc && bDesc) bDesc.textContent = desc;
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

        const vaultScreen = document.getElementById("vault-screen");
        if (vaultScreen && vaultScreen.style.display !== "none") {
            handleVaultScreenKeys(e, code);
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
                    } else {
                        const backPb = document.getElementById("btn-back-to-playbox");
                        if (backPb) backPb.focus();
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

        // CASE 0: PLAYBOX SCREEN NAVIGATION
        if (currentScreen === "PLAYBOX") {
            const pbCards = Array.from(document.querySelectorAll(".playbox-card"));
            const btnSettings = document.getElementById("pb-btn-settings");
            const curIdx = pbCards.indexOf(current);

            switch (code) {
                case 39: // Right
                    e.preventDefault();
                    if (curIdx !== -1 && curIdx + 1 < pbCards.length) {
                        pbCards[curIdx + 1].focus();
                    }
                    break;
                case 37: // Left
                    e.preventDefault();
                    if (curIdx !== -1 && curIdx - 1 >= 0) {
                        pbCards[curIdx - 1].focus();
                    }
                    break;
                case 38: // Up -> to settings icon
                    e.preventDefault();
                    if (btnSettings) btnSettings.focus();
                    break;
                case 40: // Down -> back to cards
                    e.preventDefault();
                    if (current === btnSettings && pbCards.length > 0) {
                        pbCards[0].focus();
                    }
                    break;
                case 13:
                case 23:
                    e.preventDefault();
                    if (current) current.click();
                    break;
            }
            return;
        }

        // Focus on Back to Playbox Button in Legion Hub
        if (current && current.id === "btn-back-to-playbox") {
            switch (code) {
                case 39: // Right -> to first nav tab
                    e.preventDefault();
                    const firstTab = document.querySelectorAll(".nav-tab")[0];
                    if (firstTab) firstTab.focus();
                    break;
                case 40: // Down -> into active pane
                    e.preventDefault();
                    const activePane = document.getElementById(`pane-${TABS[activeTabIndex]}`);
                    if (activePane) {
                        const firstCard = activePane.querySelector(".tv-card");
                        if (firstCard) firstCard.focus();
                    }
                    break;
                case 13:
                case 23:
                    e.preventDefault();
                    openPlayboxView();
                    break;
            }
            return;
        }

        // CASE B: Focus is on a Card inside Active Pane (PER-SHELF GRID NAVIGATION)
        if (current && current.classList.contains("tv-card")) {
            const activePane = document.getElementById(`pane-${TABS[activeTabIndex]}`);
            if (!activePane) return;

            const currentShelf = current.closest(".shelf-section");
            const allShelves = Array.from(activePane.querySelectorAll(".shelf-section"));
            const shelfIndex = allShelves.indexOf(currentShelf);

            const cardsInCurrentShelf = currentShelf ? Array.from(currentShelf.querySelectorAll(".tv-card")) : [];
            const idxInShelf = cardsInCurrentShelf.indexOf(current);

            let cols = 4;
            const gridEl = current.closest(".shelf-grid");
            if (gridEl) {
                if (gridEl.classList.contains("dual-yt-shelf")) cols = 3;
                else if (gridEl.classList.contains("channels-shelf")) cols = 4;
                else if (gridEl.classList.contains("channels-full-grid")) cols = 4;
                else if (gridEl.classList.contains("apps-shelf")) cols = 4;
                else if (gridEl.classList.contains("settings-shelf")) cols = 4;
            }

            switch (code) {
                case 39: // Right
                    e.preventDefault();
                    if (idxInShelf + 1 < cardsInCurrentShelf.length) {
                        cardsInCurrentShelf[idxInShelf + 1].focus();
                    }
                    break;

                case 37: // Left
                    e.preventDefault();
                    if (idxInShelf - 1 >= 0) {
                        cardsInCurrentShelf[idxInShelf - 1].focus();
                    }
                    break;

                case 40: // Down
                    e.preventDefault();
                    // If more rows exist inside this same shelf:
                    if (idxInShelf + cols < cardsInCurrentShelf.length) {
                        cardsInCurrentShelf[idxInShelf + cols].focus();
                    } else if (shelfIndex !== -1 && shelfIndex + 1 < allShelves.length) {
                        // Move down to next shelf below!
                        const nextShelf = allShelves[shelfIndex + 1];
                        const nextCards = Array.from(nextShelf.querySelectorAll(".tv-card"));
                        if (nextCards.length > 0) {
                            const targetCol = Math.min(idxInShelf % cols, nextCards.length - 1);
                            nextCards[targetCol].focus();
                        }
                    }
                    break;

                case 38: // Up (PREVENT JUMPING DIRECTLY TO TOP BAR FROM BOTTOM SHELF)
                    e.preventDefault();
                    if (idxInShelf - cols >= 0) {
                        // Move up within same shelf
                        cardsInCurrentShelf[idxInShelf - cols].focus();
                    } else if (shelfIndex > 0) {
                        // Move up to previous shelf above!
                        const prevShelf = allShelves[shelfIndex - 1];
                        const prevCards = Array.from(prevShelf.querySelectorAll(".tv-card"));
                        if (prevCards.length > 0) {
                            // Target corresponding column on the last row of previous shelf
                            const prevCols = prevShelf.querySelector(".shelf-grid") && prevShelf.querySelector(".shelf-grid").classList.contains("dual-yt-shelf") ? 3 : 4;
                            const lastRowStart = Math.floor((prevCards.length - 1) / prevCols) * prevCols;
                            const targetCol = Math.min(lastRowStart + (idxInShelf % cols), prevCards.length - 1);
                            prevCards[targetCol].focus();
                        }
                    } else {
                        // ONLY when at the topmost row of the very first shelf -> jump up to Nav Tab!
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
                    // Back from Legion catalog returns to Playbox
                    e.preventDefault();
                    openPlayboxView();
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
   STEALTH 18+ VAULT & DEDICATED FULLSCREEN LOCK SCREEN (NETFLIX / APPLE TV STYLE)
   Strictly Zero Floating Dialogs Covering Video
   ============================================================================== */
function triggerSecretVault() {
    const vaultScreen = document.getElementById("vault-screen");
    const pinView = document.getElementById("vault-pin-view");
    const unlockedView = document.getElementById("vault-unlocked-view");
    if (!vaultScreen || !pinView || !unlockedView) return;

    currentPinInput = "";
    tempPinSetup = "";
    const savedPin = getStoredPin();

    const titleEl = document.getElementById("vault-pin-title");
    const descEl = document.getElementById("vault-pin-desc");
    const errorEl = document.getElementById("vault-pin-error");

    vaultScreen.style.display = "flex";
    pinView.style.display = "flex";
    unlockedView.style.display = "none";
    updatePinDisplay();

    if (!savedPin) {
        vaultState = "SETUP_1";
        if (titleEl) titleEl.textContent = "🆕 Atur PIN 4-Digit Baru";
        if (descEl) descEl.textContent = "Tentukan 4 digit angka rahasia Anda.";
        if (errorEl) {
            errorEl.textContent = "Buat 4 digit PIN baru untuk mengamankan brankas";
            errorEl.className = "pin-status-banner";
        }
    } else {
        vaultState = "ENTER_PIN";
        if (titleEl) titleEl.textContent = "🔐 Brankas Privasi";
        if (descEl) descEl.textContent = "Masukkan 4-digit PIN profil Anda.";
        if (errorEl) {
            errorEl.textContent = "";
            errorEl.className = "pin-status-banner";
        }
    }

    // Focus first key
    setTimeout(() => {
        const firstKey = pinView.querySelector(".pin-key");
        if (firstKey) firstKey.focus();
    }, 80);
}

function handleVaultScreenKeys(e, code) {
    if (code === 27 || code === 4 || e.key === "Escape" || e.key === "Backspace") {
        e.preventDefault();
        closeVault();
        return;
    }

    // Remote Physical Number Keys (0-9)
    if (vaultState === "ENTER_PIN" || vaultState === "SETUP_1" || vaultState === "SETUP_CONFIRM") {
        let numKey = null;
        if (code >= 48 && code <= 57) numKey = String(code - 48); // 0-9 top row
        else if (code >= 96 && code <= 105) numKey = String(code - 96); // 0-9 numpad
        if (numKey !== null) {
            e.preventDefault();
            handleVaultKey(numKey);
            return;
        }
    }

    const current = document.activeElement;
    if (!current) return;

    const unlockedView = document.getElementById("vault-unlocked-view");
    // Inside Unlocked Adult Shelf
    if (unlockedView && unlockedView.style.display !== "none") {
        const adultItems = Array.from(unlockedView.querySelectorAll(".tv-card, #btn-lock-vault"));
        const curIdx = adultItems.indexOf(current);
        if (curIdx !== -1) {
            if (code === 39 && curIdx + 1 < adultItems.length) { // Right
                e.preventDefault();
                adultItems[curIdx + 1].focus();
            } else if (code === 37 && curIdx - 1 >= 0) { // Left
                e.preventDefault();
                adultItems[curIdx - 1].focus();
            } else if (code === 40 && current.id === "btn-lock-vault") { // Down from lock button to cards
                e.preventDefault();
                const firstCard = unlockedView.querySelector(".tv-card");
                if (firstCard) firstCard.focus();
            } else if (code === 38 && current.classList.contains("tv-card")) { // Up from cards to lock button
                e.preventDefault();
                const lockBtn = document.getElementById("btn-lock-vault");
                if (lockBtn) lockBtn.focus();
            } else if (code === 13 || code === 23) { // OK
                e.preventDefault();
                current.click();
            }
        }
        return;
    }

    // Inside PIN Keypad Grid (3 columns)
    const pinView = document.getElementById("vault-pin-view");
    if (!pinView || pinView.style.display === "none") return;

    const keys = Array.from(pinView.querySelectorAll(".pin-key"));
    const curIdx = keys.indexOf(current);

    if (curIdx !== -1) {
        switch (code) {
            case 39: // Right
                e.preventDefault();
                if (curIdx + 1 < keys.length) keys[curIdx + 1].focus();
                break;
            case 37: // Left
                e.preventDefault();
                if (curIdx - 1 >= 0) keys[curIdx - 1].focus();
                break;
            case 40: // Down (grid 3 cols)
                e.preventDefault();
                if (curIdx + 3 < keys.length) keys[curIdx + 3].focus();
                break;
            case 38: // Up (grid 3 cols)
                e.preventDefault();
                if (curIdx - 3 >= 0) keys[curIdx - 3].focus();
                break;
            case 13: // OK
            case 23:
                e.preventDefault();
                current.click();
                break;
        }
    }
}

function setupVaultKeypad() {
    const keypad = document.getElementById("vault-keypad");
    if (!keypad) return;

    keypad.querySelectorAll(".pin-key").forEach(btn => {
        btn.addEventListener("click", () => {
            const key = btn.getAttribute("data-key");
            if (key) handleVaultKey(key);
        });
    });

    const btnLockVault = document.getElementById("btn-lock-vault");
    if (btnLockVault) btnLockVault.addEventListener("click", closeVault);

    const btnCancel = document.getElementById("btn-cancel-pin");
    if (btnCancel) btnCancel.addEventListener("click", closeVault);
}

function handleVaultKey(key) {
    if (key === "clear") {
        if (currentPinInput.length > 0) {
            currentPinInput = currentPinInput.slice(0, -1);
            updatePinDisplay();
        }
        return;
    }

    if (currentPinInput.length < 4) {
        currentPinInput += key;
        updatePinDisplay();
        if (currentPinInput.length === 4) {
            setTimeout(verifyVaultPin, 140);
        }
    }
}

function verifyVaultPin() {
    const errorEl = document.getElementById("vault-pin-error");
    const titleEl = document.getElementById("vault-pin-title");
    const descEl = document.getElementById("vault-pin-desc");

    if (currentPinInput.length !== 4) return;

    if (vaultState === "SETUP_1") {
        tempPinSetup = currentPinInput;
        currentPinInput = "";
        vaultState = "SETUP_CONFIRM";
        updatePinDisplay();
        if (titleEl) titleEl.textContent = "🔄 Konfirmasi PIN";
        if (descEl) descEl.textContent = "Ulangi 4 digit angka yang sama.";
        if (errorEl) {
            errorEl.textContent = "Ketik ulang PIN Anda sekali lagi";
            errorEl.className = "pin-status-banner";
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
            if (errorEl) {
                errorEl.textContent = "PIN tidak cocok! Silakan buat ulang dari awal.";
                errorEl.className = "pin-status-banner error";
            }
        }
    } else if (vaultState === "ENTER_PIN") {
        const savedPin = getStoredPin();
        if (currentPinInput === savedPin) {
            unlockVaultSuccess();
        } else {
            currentPinInput = "";
            updatePinDisplay();
            if (errorEl) {
                errorEl.textContent = "PIN Salah! Coba lagi.";
                errorEl.className = "pin-status-banner error";
            }
        }
    }
}

function unlockVaultSuccess() {
    vaultState = "UNLOCKED";
    const pinView = document.getElementById("vault-pin-view");
    const unlockedView = document.getElementById("vault-unlocked-view");

    if (pinView) pinView.style.display = "none";
    if (unlockedView) {
        unlockedView.style.display = "flex";
        renderAdultChannels();
        setTimeout(() => {
            const firstAdult = unlockedView.querySelector(".tv-card");
            if (firstAdult) firstAdult.focus();
        }, 100);
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
        btn.setAttribute("data-badge", "18+ PRIVASI");

        btn.innerHTML = `
            <div class="channel-poster-wrap">
                <img src="${ch.poster}" alt="${ch.name}" class="channel-poster-img" onerror="this.src='assets/vault_adult.png'">
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
    for (let i = 0; i < 4; i++) {
        const dot = document.getElementById(`pindot-${i}`);
        if (dot) {
            dot.classList.toggle("filled", i < currentPinInput.length);
        }
    }
}

function closeVault() {
    const vaultScreen = document.getElementById("vault-screen");
    if (vaultScreen) vaultScreen.style.display = "none";
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

    // Immediately hide vault screen so video plays 100% full without dialog blocking
    const vaultScreen = document.getElementById("vault-screen");
    if (vaultScreen) vaultScreen.style.display = "none";

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

    // If closing player from an unlocked vault session, return to vault shelf
    if (vaultState === "UNLOCKED") {
        const vaultScreen = document.getElementById("vault-screen");
        const unlockedView = document.getElementById("vault-unlocked-view");
        if (vaultScreen && unlockedView) {
            vaultScreen.style.display = "flex";
            unlockedView.style.display = "flex";
            const firstAdult = unlockedView.querySelector(".tv-card");
            if (firstAdult) firstAdult.focus();
            return;
        }
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

        const vaultScreen = document.getElementById("vault-screen");
        if (vaultScreen && vaultScreen.style.display !== "none") {
            closeVault();
            return true;
        }

        // Return to home if on another tab
        if (currentScreen === "LEGION") {
            openPlayboxView();
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
