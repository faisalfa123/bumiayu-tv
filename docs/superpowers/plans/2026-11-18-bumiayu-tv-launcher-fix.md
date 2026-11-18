# Bumiayu TV Launcher & Web TV Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Overhaul Bumiayu TV Launcher into a smooth, responsive, Ghibli-styled Android TV launcher for Xiaomi TV 4A (1GB RAM) with native direct HLS Web TV (no heavy browser lag or virtual pointer delays), transparent PIN/pattern setup without default lockouts, complete stealth hiding of the 18+ category (accessible strictly via Settings post-authentication), exclusive Senandung integration (removing Immich & DompetMungil), modern typography over high-res Ghibli scenery wallpapers (Bumiayu railway and lush green rice fields), and a polished ambient lockscreen with clock, weather widget, and Senandung playback status.

**Architecture:**
- **Hub Frontend (`tv-hub/`):** Streamlined 3-row layout (Row 0: Senandung dedicated card; Row 1: SmartTube, Web TV, Netflix, Prime; Row 2: Ghibli Theme Switcher, Ambient Lockscreen, TV Inputs, Server & Security Settings). High-resolution SVG/WebP Ghibli landscape backgrounds with subtle CSS gradients instead of blocky pixel styling.
- **Web TV Engine (`tv-hub/webtv.html`, `webtv.js`):** Eliminate heavy web-page iframes and virtual cursor latency. Implement direct hardware-accelerated HLS/m3u8 streaming using optimized HTML5 `<video>` / `hls.js` with remote D-Pad controls (Up/Down for instant channel surfing, Left for sliding semi-transparent overlay channel list, OK for current stream info banner, Back for returning to Hub).
- **Security & Setup Module:** Replace default hardcoded PIN `1234` with an uninitialized state (`isConfigured: false`). Entering security settings prompts a two-step "Buat Sandi Baru" (PIN or D-Pad directional pattern). Stealth 18+ category: hidden completely from normal category tabs, accessible only as a temporary unlocked session from inside the authenticated Settings menu.
- **Lockscreen / Ambient Mode:** Fullscreen Ghibli scenic wallpaper with cinematic dimming, large digital clock, Indonesian date, aesthetic weather card, and live Senandung track status widget.
- **Android Shell (`tv-hub-android/`):** Update `MainActivity.kt` and WebView assets, ensuring smooth GPU rendering without background blur overhead.

**Architecture Diagram:**

```mermaid
graph TD
    subgraph "Bumiayu TV Launcher (com.faisal.tvhub)"
        HUB[Launcher Home Grid] --> SENANDUNG[Senandung WebApp View]
        HUB --> WEBTV[Native HLS Web TV Player]
        HUB --> SMARTTUBE[SmartTube Stable Intent]
        HUB --> AMBIENT[Ambient Ghibli Lockscreen]
        HUB --> SETTINGS[Settings & Security Modal]
    end

    subgraph "Web TV Player"
        WEBTV --> OVERLAY[D-Pad Channel Drawer (Left)]
        WEBTV --> SURFING[Up/Down Channel Surfing]
        WEBTV --> HLS_ENGINE[Direct HLS Stream Engine]
    end

    subgraph "Security Module"
        SETTINGS --> FIRST_SETUP[Setup Sandi Pertama Kali]
        SETTINGS --> UNLOCK_ADULT[Buka Sesi Kategori 18+]
        UNLOCK_ADULT --> ADULT_LIST[Daftar Channel Dewasa Sementara]
    end
```

**Tech Stack:**
- Frontend: HTML5, CSS3 (Modern TV typography, Ghibli scenery gradients, GPU transforms), Vanilla JavaScript (ES6+), HLS.js
- Android TV Container: Kotlin, Android Leanback, Hardware-accelerated WebView, Android Audio/Media session hooks
- Automation & Packaging: PowerShell 5.1/7, `optimize-tv.bat`, Android Gradle 8.2, GitHub Actions CI

**Spec:** [Bumiayu TV Launcher Fix Spec (Conversation 2026-11-18)](#)

## Global Constraints
- Target Hardware: Xiaomi Smart TV 4A 32" (1GB RAM, Mali-450 GPU, Android TV 9 Pie).
- No heavy full-screen `backdrop-filter: blur()` to prevent frame drops and GPU thrashing on 1GB RAM.
- No heavy desktop web pages in Web TV; all streaming channels must be direct HLS/m3u8 or lightweight stream feeds.
- No virtual pointer / cursor mode in Web TV; all channel controls must be 100% native remote D-Pad key handling.
- Kategori 18+ must NEVER be rendered in public category tabs.
- Default security state must be uninitialized (no secret locked without user setup).
- Preserve Widevine L1 non-root safety and Google Voice Assistant remote mic.

## Review Focus
1. D-Pad responsiveness in Web TV: Channel switching (Up/Down) and channel drawer (Left) must execute under 50ms with zero cursor lag.
2. Direct HLS channel playback: Indonesian and International stream links must play reliably without loading external web browser wrappers.
3. Password setup workflow: First-time entry opens "Buat Sandi", requires confirmation, hashes correctly, and unlocks adult category only within authenticated session.
4. Senandung exclusivity: Verify Immich and DompetMungil cards are completely removed from DOM, navigation index, and launcher settings.
5. Visual aesthetics: Clean Studio Ghibli countryside/station background, sharp modern fonts, and functional ambient lockscreen.

---

## Tasks

### Task 1: Update Launcher Layout & Remove Immich/DompetMungil
**Deliverables:**
- Cleaned up `tv-hub/index.html` and `tv-hub/app.js` with only **Senandung** in Row 0.
- Modernized styling in `tv-hub/styles.css`: Studio Ghibli anime landscape background (station and terraced rice fields of Bumiayu), clean modern typography (`system-ui`, `Segoe UI`, `Inter`), removed chunky pixel fonts and pixel borders.
- Updated settings modal to only configure Senandung URL and Security PIN/Pattern.

- [ ] Remove Immich and DompetMungil HTML cards from `tv-hub/index.html` and `tv-hub-android/app/src/main/assets/hub/index.html`.
- [ ] Expand Senandung card in Row 0 to a prominent music hub card with playback status indicator.
- [ ] Implement SVG/CSS high-res Studio Ghibli style landscape illustration of Bumiayu (rural train station, Mount Slamet silhouette, and emerald rice terraces) with warm tvOS cinematic gradient in `tv-hub/styles.css`.
- [ ] Update grid navigation logic in `tv-hub/app.js` to account for single-item Row 0 (`colCount: 1`), 4-item Row 1, and 4-item Row 2.
- [ ] Verify test suite `tv-hub/test.js` passes with updated grid structure.

### Task 2: Implement First-Time Password Setup & Stealth 18+ Access
**Deliverables:**
- Modified `tv-hub/webtv.js` security management: `isConfigured` flag in `bumiayu_lock_config`.
- Transparent "Buat Sandi Baru" flow on first use (Choice of 4-digit PIN or D-Pad directional sequence with 2x verification).
- 100% Stealth 18+ Category: Tab completely removed from `webtv.html` navigation. Access is provided solely through a secure "Buka Saluran Dewasa" option in Settings dialog after authentication.

- [ ] Update `getDefaultLockConfig()` in `tv-hub/webtv.js` to set `{ isConfigured: false, hash: null, mode: 'pin', adultSessionActive: false }`.
- [ ] Build interactive modal in `tv-hub/webtv.html` for "Buat Sandi Baru" (Input $\rightarrow$ Konfirmasi Input $\rightarrow$ Simpan).
- [ ] Remove the adult category tab from the main Web TV category bar.
- [ ] Implement temporary session unlock for 18+ channels in `tv-hub/webtv.js`: only when unlocked via settings, the category list dynamically injects the adult channels into view, expiring when Web TV is closed.
- [ ] Update unit tests in `tv-hub/test.js` to test unconfigured lock state, PIN creation, authentication, and stealth category toggling.

### Task 3: Overhaul Web TV with Lightweight Native HLS Engine & Zero-Delay Remote Controls
**Deliverables:**
- Full removal of WebView web-page embeds and virtual pointer inside Web TV.
- Pure D-Pad remote control interaction: Up/Down to switch channels, Left to toggle semi-transparent channel drawer overlay, OK to toggle channel info banner, Back to exit.
- Direct HLS/M3U8 streaming sources for Indonesian and International channels with fallback status indicator.

- [ ] Replace iframe/web embeds in `tv-hub/webtv.html` with a hardware-accelerated `<video id="tv-player">` container and embedded `hls.js` script.
- [ ] Overhaul `DEFAULT_CHANNELS` in `tv-hub/webtv.js` to prioritize direct `.m3u8` streams for Indonesian TV (TVRI, Kompas TV, Metro TV, TVOne, etc.) and International TV (NHK World, Al Jazeera, DW, France 24).
- [ ] Create sliding left channel drawer with instant D-Pad navigation (no mouse pointer emulation).
- [ ] Add on-screen channel number and title overlay badge with smooth fade-out.
- [ ] Handle video errors gracefully with retry button and fallback stream indicator.

### Task 4: Enhance Ambient Mode into a Premium Ghibli Lockscreen
**Deliverables:**
- Polished Ambient Lockscreen in `tv-hub/index.html` and `tv-hub/styles.css`.
- Large modern digital clock, Indonesian calendar date, live weather card (Bumiayu 24°C, Cerah Berawan), and Senandung player widget.
- Remote press wake-up with zero lag.

- [ ] Style the ambient lockscreen container with darkened cinematic Ghibli backdrop and soft vignette.
- [ ] Add aesthetic weather card widget and Senandung music player widget (shows currently active track or "Senandung Siap Memutar Musik").
- [ ] Wire up remote key listener in `tv-hub/app.js` to wake up smoothly on any remote keypress.

### Task 5: Sync Android Wrapper, Build APK via GitHub Actions & Update Toolkit
**Deliverables:**
- Synchronized Android assets in `tv-hub-android/app/src/main/assets/hub/`.
- Updated GitHub Actions build to compile and upload `BumiayuTVLauncher.apk`.
- Verified local batch files `optimize-tv.bat` and `optimize-tv.ps1`.

- [ ] Copy updated `tv-hub/*` files to `tv-hub-android/app/src/main/assets/hub/`.
- [ ] Run Node.js tests `node tv-hub/test.js` to ensure 100% pass rate.
- [ ] Commit and push to GitHub repository `faisalfa123/bumiayu-tv` on branch `main`.
- [ ] Verify GitHub Actions build produces artifact `BumiayuTVLauncher-APK`.
- [ ] Download latest APK to `apk/BumiayuTVLauncher.apk` and test install on Xiaomi TV via ADB.
