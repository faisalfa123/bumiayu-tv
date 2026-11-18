# Web TV Multi-Engine, Auto-Health Check & 10-Foot UI/UX Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Web TV player in `tv-hub/` and `tv-hub-android/` into a robust, memory-efficient IPTV streaming experience for Xiaomi Smart TV 4A (1GB RAM, Mali-450 GPU) with multi-engine playback (RAM-optimized HLS.js + HTML5 native video fallback), async background stream health check with live/down status badges, auto-fallback on stalled streams, fullscreen auto-hiding OSD (4s), floating D-Pad channel drawer, and enhanced Android WebView mixed content / user-agent configuration.

**Architecture:**
- **Player Engine (`tv-hub/webtv.js` & `tv-hub/hls.min.js`):** Lightweight `Hls` configuration tailored for low-memory TVs (`maxBufferLength: 15`, `maxMaxBufferLength: 30`, `enableWorker: true`). Clean `hls.destroy()` on channel switch. Native HTML5 `<video>` fallback when HLS.js is unavailable or fails. Support `.m3u8`, `.mp4`, and compatible streams.
- **Auto-Health Checker (`tv-hub/webtv.js`):** Concurrency-limited (max 3 concurrent requests) async checker with 5s timeout and abort controller. Validates HTTP 200 and `#EXTM3U` content headers. Emits status badges: 🟢 LIVE, 🔴 DOWN, 🟡 CHECKING... Auto-fallback trigger on fatal error or 8s stall with elegant OSD notification and next active channel jump.
- **Stealth 18+ Category & M3U Parser:** Retains PIN/Pattern lock in Settings. M3U parser automatically routes channels with `group-title="Adult"` / `18+` / `XXX` into the secure category.
- **10-Foot UI/UX (`tv-hub/webtv.html`, `tv-hub/styles.css`):** Fullscreen player with 4s auto-hiding OSD (bottom/side), instant D-Pad left/OK drawer overlay, theme-reactive glowing `:focus` borders without heavy `backdrop-filter: blur()`.
- **Android Container (`tv-hub-android/`):** Update `WebSettings` in `MainActivity.kt` and `WebAppActivity.kt` for `MIXED_CONTENT_ALWAYS_ALLOW`, custom IPTV User-Agent, and hardware acceleration.

**Tech Stack:** Vanilla JavaScript (ES6+), HTML5 Video, HLS.js, CSS3 (translucent rgba, CSS transitions), Kotlin / Android Leanback WebView.

---

## Global Constraints
- Target Hardware: Xiaomi Smart TV 4A 32" (Android TV 9, 1GB RAM, Mali-450 GPU).
- Memory Safety: Clean destruction of player instances (`hls.destroy()`), max 3 background check workers, buffer capped at 15-30s.
- No heavy `backdrop-filter: blur()`; use solid semi-transparent `rgba(...)` surfaces.
- 100% remote D-Pad navigation (ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Enter, Back).

---

## Tasks

### Task 1: Android WebView WebSettings Optimization (Mixed Content & User-Agent)
**Deliverables:**
- In `tv-hub-android/app/src/main/java/com/faisal/tvhub/MainActivity.kt` and `WebAppActivity.kt`:
  - Enable `mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW` (Android 5.0+).
  - Configure modern TV User-Agent (`Mozilla/5.0 (Linux; Android 9; MiTV-4A) AppleWebKit/537.36 ... Exoplayer/IPTV`).
  - Set hardware acceleration layer and audio focus attributes.
- Sync Android assets.

- [ ] Update `MainActivity.kt` WebSettings with mixed content allow and custom TV User-Agent.
- [ ] Update `WebAppActivity.kt` WebSettings with mixed content allow and custom TV User-Agent.
- [ ] Verify compilation with `./gradlew assembleDebug` or GitHub Actions syntax.

### Task 2: Multi-Engine Video Player & Channel Definitions
**Deliverables:**
- In `tv-hub/webtv.js`:
  - Configure HLS.js with memory-conservative settings (`maxBufferLength: 15`, `maxMaxBufferLength: 30`, `enableWorker: true`, `lowLatencyMode: false`).
  - Fallback logic to native HTML5 video if HLS.js is unsupported or fails on manifest parsing.
  - Enhanced channel lists:
    - **Favorit (★)**
    - **Nasional** (TVRI, Kompas TV, CNN Indonesia, Metro TV, Trans TV, Trans 7, NET TV, tvOne, RTV, CNBC Indonesia, dll.)
    - **Internasional** (NHK World Japan, Al Jazeera English, DW English, France 24, NASA TV, Bloomberg, CNA, dll.)
    - **18+ / Dewasa (Terkunci)** with M3U group auto-categorization (`group-title="Adult"`, `18+`, `XXX`).
  - Clean `destroyPlayer()` on channel switch and page unload to prevent memory leaks.

- [ ] Implement `initPlayer(url, videoEl, options)` with HLS.js RAM bounds and native fallback.
- [ ] Update `DEFAULT_CHANNELS` with expanded National & International stream URLs.
- [ ] Enhance `parseM3U()` to auto-categorize channels with adult tags into the `adult` category.
- [ ] Add unit tests in `tv-hub/test.js` for player lifecycle and M3U adult tag parsing.

### Task 3: Asynchronous Stream Auto-Health Check & Badges
**Deliverables:**
- In `tv-hub/webtv.js` and `tv-hub/webtv.html`:
  - `ChannelHealthChecker`: Queue-based checker with max 3 concurrent requests, 5s timeout, AbortController.
  - Checks HTTP 200 and `#EXTM3U` or content-type headers.
  - Visual status badges on channel cards:
    - 🟢 LIVE / ON (Green badge)
    - 🔴 DOWN / OFFLINE (Red badge with dim card)
    - 🟡 CHECKING... (Yellow badge)
  - Dedicated "Cek Status Channel" button in header/tabs.
  - Auto-Fallback on Playback Stall: If playback encounters fatal error or stalls > 8 seconds:
    - Mark active channel as DOWN.
    - Show OSD notice: "Channel sedang gangguan / DOWN".
    - Provide quick button "Pindah ke Channel Aktif Berikutnya" or auto-jump after 3 seconds.

- [ ] Build `ChannelHealthChecker` with queue limit (3 concurrent), timeout (5000ms), and abort controller.
- [ ] Add status badge markup and classes (`.badge-live`, `.badge-down`, `.badge-checking`) in channel rendering.
- [ ] Implement stall detection timer (8s) and fatal HLS error auto-recovery / next channel jump.
- [ ] Add unit tests in `tv-hub/test.js` for health checker concurrency and status parsing.

### Task 4: 10-Foot IPTV UI/UX, Fullscreen OSD & Floating Channel Drawer
**Deliverables:**
- In `tv-hub/webtv.html` and `tv-hub/styles.css`:
  - Fullscreen video layout with transparent OSD overlay (channel number, logo, title, LIVE badge, category).
  - 4-second auto-hide timer for OSD on user inactivity.
  - Floating Quick Channel Drawer on left screen edge:
    - Toggled by pressing `ArrowLeft` or `Enter/OK` during fullscreen playback.
    - Up/Down navigates drawer items; Enter selects channel without full page reload.
    - ArrowRight or Back closes drawer.
  - Glow focus styling (`:focus`) corresponding to the active theme, using solid `rgba(...)` surfaces (no blur lag).

- [ ] Implement 4s auto-hiding OSD bottom/side banner with channel info and live indicator.
- [ ] Refine left-side Quick Channel Drawer with smooth CSS transform (no blur) and remote navigation.
- [ ] Ensure all interactive buttons (tabs, drawer items, check status, favorites) have high-contrast glowing focus indicators.
- [ ] Add unit tests in `tv-hub/test.js` for OSD auto-hide timing and drawer toggle state.

### Task 5: Testing, Android Sync, GitHub Actions Build & APK Deployment
**Deliverables:**
- Full test pass in `tv-hub/test.js`.
- Synchronize all files to `tv-hub-android/app/src/main/assets/hub/`.
- Commit and push to GitHub repository `faisalfa123/bumiayu-tv` on branch `main`.
- Download compiled `BumiayuTVLauncher-APK` and update local `apk/BumiayuTVLauncher.apk`.
- Test install via Wi-Fi ADB on Xiaomi TV.

- [ ] Run Node.js test suite (`node tv-hub/test.js`) and ensure 100% pass rate.
- [ ] Synchronize `tv-hub/*` to `tv-hub-android/app/src/main/assets/hub/`.
- [ ] Commit and push to GitHub `main` branch.
- [ ] Monitor GitHub Actions workflow run to success.
- [ ] Download new artifact `BumiayuTVLauncher.apk` and deploy to TV via ADB.
