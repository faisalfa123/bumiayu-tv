# Bumiayu TV Launcher Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebrand and upgrade the TV Hub into **Bumiayu TV Launcher** with 4 switchable anime-retro animated themes (`Bumiayu 16-Bit Pixel Art`, `Bumiayu Asri`, `Bumiayu Samudra`, `Bumiayu Rintik`), **SmartTube Stable** integration, a full **Web TV** module (Nasional, Internasional, and PIN/D-Pad-Pattern-locked 18+ category), plus Ambient Screensaver mode.

**Architecture:** Modular HTML5/CSS3/Canvas frontend (`tv-hub/index.html`, `styles.css`, `themes.js`, `app.js`, `webtv.html`, `webtv.js`) synchronized into `tv-hub-android/app/src/main/assets/hub/` and wrapped by the native Android TV Leanback Kotlin launcher (`Bumiayu TV Launcher` in `AndroidManifest.xml`, `MainActivity.kt`, `WebAppActivity.kt`, `VirtualPointerView.kt`) built via GitHub Actions.

**Tech Stack:** HTML5 Canvas (<=24 particles, 60fps on Mali-450), CSS Custom Properties (`[data-theme="pixel|asri|samudra|rintik"]`), Vanilla JS (zero dependencies), Native Kotlin Android TV SDK 33, GitHub Actions, PowerShell.

**Spec:** [2026-11-18-bumiayu-tv-launcher-design.md](file:///C:/Users/user/.gemini/antigravity/scratch/xiaomi-tv-debloat/docs/superpowers/specs/2026-11-18-bumiayu-tv-launcher-design.md)

## Global Constraints
- App name: **Bumiayu TV Launcher** everywhere (HTML `<title>`, brand header, `AndroidManifest.xml` `android:label`, `build-apk.yml` artifact `BumiayuTVLauncher-APK`).
- 4 switchable themes (`pixel`, `asri`, `samudra`, `rintik`) with `bumiayu_theme` in `localStorage` and lightweight Canvas particle effects (<= 24 particles, 0 `backdrop-filter`).
- Web TV supports 2 primary modes (`nasional`, `internasional`) + locked `adult` (`18+ / Dewasa`) mode with configurable 4-digit PIN or D-Pad directional pattern lock (hashed, auto-locks on exit, optional hide-tab toggle).
- Both direct HLS/M3U playback (`<video>`) and WebView fallback (`TvBridge.openWebApp`) supported.
- All pure logic (theme state, lock verification/hashing, M3U parser, grid navigation) must have passing Node unit tests in `tv-hub/test.js`.

---

### Task 1: Bumiayu Theme Engine, Canvas Particle FX & Rebranded Hub (`tv-hub/`)

**Files:**
- Create: `C:/Users/user/.gemini/antigravity/scratch/xiaomi-tv-debloat/tv-hub/themes.js`
- Modify: `C:/Users/user/.gemini/antigravity/scratch/xiaomi-tv-debloat/tv-hub/index.html`
- Modify: `C:/Users/user/.gemini/antigravity/scratch/xiaomi-tv-debloat/tv-hub/styles.css`
- Modify: `C:/Users/user/.gemini/antigravity/scratch/xiaomi-tv-debloat/tv-hub/app.js`

- [ ] **Step 1: Create `tv-hub/themes.js`**
Implement `BUMIAYU_THEMES` (`pixel`, `asri`, `samudra`, `rintik`), theme persistence (`bumiayu_theme`), and `BumiayuParticleEngine` (`<canvas id="bg-canvas">` capped at 22 particles, rendering pixel stars/grid for `pixel`, amber falling leaves for `asri`, rising ocean bubbles for `samudra`, and diagonal raindrops for `rintik`, pausing automatically on `visibilitychange`).

- [ ] **Step 2: Update `tv-hub/index.html` & `tv-hub/styles.css`**
- Rebrand header to **Bumiayu TV Launcher** with current theme badge.
- Add **Web TV** card (`data-action="webtv"`) in Row 1 alongside **SmartTube** (`com.teamsmart.videomanager.tv`), **Netflix**, and **Prime Video** (4 columns in Row 1 or clean balanced 3-row layout: Row 0 `Senandung, Immich, DompetMungil`; Row 1 `SmartTube, Web TV, Netflix, Prime Video`; Row 2 `Tema Bumiayu, Layar Santai (Ambient), HDMI / TV Inputs, Pengaturan Server`).
- Add **Theme Picker Modal** (`#theme-modal`) to switch between the 4 Bumiayu themes live.
- Add **Ambient Screensaver Overlay** (`#ambient-overlay`) showing retro anime clock + particles when triggered (any key exits).
- Add CSS variables for `[data-theme="pixel"]` (stepped pixel-art borders, retro amber/cyan accents), `[data-theme="asri"]` (autumn gold/terracotta), `[data-theme="samudra"]` (deep ocean teal/blue), and `[data-theme="rintik"]` (misty rainy slate-blue).

- [ ] **Step 3: Update `tv-hub/app.js`**
Integrate theme switching, `#theme-modal` focus trap, `#ambient-overlay` toggle, and `webtv.html` navigation.

---

### Task 2: Web TV Module with Nasional, Internasional, & PIN/Pattern-Locked 18+ (`tv-hub/webtv.html`, `webtv.js`)

**Files:**
- Create: `C:/Users/user/.gemini/antigravity/scratch/xiaomi-tv-debloat/tv-hub/webtv.html`
- Create: `C:/Users/user/.gemini/antigravity/scratch/xiaomi-tv-debloat/tv-hub/webtv.js`

- [ ] **Step 1: Create `tv-hub/webtv.js` (Pure Logic + UI Controller)**
- Pre-populated channel catalog for `nasional` (e.g. TVRI Nasional, Kompas TV, CNN Indonesia, Metro TV, Trans TV, NET.) and `internasional` (NHK World Japan, Al Jazeera English, DW English, France 24, NASA TV), plus `adult` (18+ custom/M3U slots).
- Built-in lightweight **M3U Parser** (`parseM3U(text)`) so users can paste/import M3U playlists or add custom channels.
- **LockManager**: Supports `pin` (4-digit code) or `pattern` (4–6 D-Pad directions e.g. `UP,UP,DOWN,RIGHT`), stored as a deterministic hash in `localStorage` (`bumiayu_lock_config`), with `hideAdultTab` toggle. Default lock is active; unlocking grants session access only (auto-locks on exit).
- **Dual Playback**: Direct `<video id="tv-player">` with HLS/native support + Channel Up/Down (`ArrowUp`/`ArrowDown` in fullscreen) + `TvBridge.openWebApp` fallback for web-based TV streams.
- **Favorites**: Star toggle pinning favorite channels to the top.

- [ ] **Step 2: Create `tv-hub/webtv.html`**
- Inherits active Bumiayu theme (`data-theme`) and `themes.js` particles.
- Category tabs: **Channel Nasional**, **Channel Internasional**, **🔒 18+ / Dewasa** (hidden if `hideAdultTab` is enabled until unlocked), **⚙️ Pengaturan & Sandi**.
- On-screen D-Pad friendly **PIN Pad / Pattern Recorder Modal** + **Channel/M3U Manager Modal**.

---

### Task 3: Sync Android Wrapper (`tv-hub-android/`), CI Workflow & Windows Deployer

**Files:**
- Modify: `C:/Users/user/.gemini/antigravity/scratch/xiaomi-tv-debloat/tv-hub-android/app/src/main/AndroidManifest.xml`
- Modify: `C:/Users/user/.gemini/antigravity/scratch/xiaomi-tv-debloat/tv-hub-android/app/src/main/res/drawable/tv_banner.xml`
- Modify: `C:/Users/user/.gemini/antigravity/scratch/xiaomi-tv-debloat/.github/workflows/build-apk.yml`
- Modify: `C:/Users/user/.gemini/antigravity/scratch/xiaomi-tv-debloat/optimize-tv.ps1`
- Sync: `tv-hub/*.html`, `*.css`, `*.js` -> `tv-hub-android/app/src/main/assets/hub/`

- [ ] **Step 1: Rebrand `AndroidManifest.xml`, `tv_banner.xml`, and `build-apk.yml`**
Update app label to `Bumiayu TV Launcher`, banner text to `Bumiayu TV`, and CI artifact name to `BumiayuTVLauncher-APK` (looking for `BumiayuTVLauncher*.apk` or `FaisalTVHub*.apk` in `optimize-tv.ps1`).
- [ ] **Step 2: Sync `tv-hub/` assets into `tv-hub-android/app/src/main/assets/hub/`**
Verify byte-for-byte SHA-256 parity.

---

### Task 4: Expanded Unit Tests & Documentation (`tv-hub/test.js`, `README.md`)

**Files:**
- Modify: `C:/Users/user/.gemini/antigravity/scratch/xiaomi-tv-debloat/tv-hub/test.js`
- Modify: `C:/Users/user/.gemini/antigravity/scratch/xiaomi-tv-debloat/README.md`

- [ ] **Step 1: Add unit tests for `themes.js` and `webtv.js`**
Test theme validation/persistence, M3U parsing, PIN & D-Pad Pattern hashing/verification, and hidden 18+ tab rules. Run `node tv-hub/test.js` (all pass).
- [ ] **Step 2: Update `README.md`**
Document Bumiayu TV Launcher, 4 themes, Web TV (Nasional, Internasional, 18+ PIN/Pattern lock), SmartTube, and GitHub Actions APK build.
