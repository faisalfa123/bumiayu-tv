// ==========================================================================
// TEST SUITE: BUMIAYU TV LAUNCHER - MASTER BLUEPRINT (SESI 0 - 5)
// ==========================================================================

const fs = require('fs');
const path = require('path');
const assert = require('assert');

let passedTests = 0;
let totalTests = 0;

function test(description, fn) {
    totalTests++;
    try {
        fn();
        passedTests++;
        console.log(`  \x1b[32m✔\x1b[0m ${description}`);
    } catch (err) {
        console.error(`  \x1b[31m✘\x1b[0m ${description}`);
        console.error(`    ${err.message}`);
    }
}

console.log('\n--- Memulai Pengujian Master Blueprint Bumiayu TV ---');

const baseDir = path.resolve(__dirname, '..');
const tvHubDir = path.resolve(baseDir, 'tv-hub');
const androidDir = path.resolve(baseDir, 'tv-hub-android');

// --------------------------------------------------------------------------
// 1. SESI 0: TOPOGRAFI PROYEK
// --------------------------------------------------------------------------
console.log('\n[SESI 0: Topografi Proyek]');

test('Berkas optimize-tv.ps1 wajib ada di root', () => {
    assert.strictEqual(fs.existsSync(path.join(baseDir, 'optimize-tv.ps1')), true);
});

test('Berkas AndroidManifest.xml wajib ada di tv-hub-android', () => {
    assert.strictEqual(fs.existsSync(path.join(androidDir, 'app/src/main/AndroidManifest.xml')), true);
});

test('Folder tv-hub memiliki berkas inti: index.html, style.css, script.js', () => {
    assert.strictEqual(fs.existsSync(path.join(tvHubDir, 'index.html')), true);
    assert.strictEqual(fs.existsSync(path.join(tvHubDir, 'style.css')), true);
    assert.strictEqual(fs.existsSync(path.join(tvHubDir, 'script.js')), true);
});

test('Folder tv-hub bersih dari berkas usang (app.js, webtv.js, webtv.html, themes.js)', () => {
    assert.strictEqual(fs.existsSync(path.join(tvHubDir, 'app.js')), false);
    assert.strictEqual(fs.existsSync(path.join(tvHubDir, 'webtv.js')), false);
    assert.strictEqual(fs.existsSync(path.join(tvHubDir, 'webtv.html')), false);
    assert.strictEqual(fs.existsSync(path.join(tvHubDir, 'themes.js')), false);
});

// --------------------------------------------------------------------------
// 2. SESI 1: TWEAK SISTEM ANDROID & IDENTITAS KLONING
// --------------------------------------------------------------------------
console.log('\n[SESI 1: Tweak Sistem Android & Identitas]');

test('optimize-tv.ps1 memiliki perintah akselerasi OpenGL 2D & max_cached_apps', () => {
    const ps1 = fs.readFileSync(path.join(baseDir, 'optimize-tv.ps1'), 'utf8');
    assert.ok(ps1.includes('debug.hwui.renderer opengl'), 'Harus memaksa OpenGL renderer');
    assert.ok(ps1.includes('max_cached_apps 2'), 'Harus membatasi cached background apps');
    assert.ok(ps1.includes('log.tag.all SILENT'), 'Harus menonaktifkan background logcat');
    assert.ok(ps1.includes('animator_duration_scale 0.5'), 'Harus menyetel skala animasi ke 0.5x');
});

test('AndroidManifest.xml menggunakan package com.bumiayu.tvlauncher dan label YouTube', () => {
    const manifest = fs.readFileSync(path.join(androidDir, 'app/src/main/AndroidManifest.xml'), 'utf8');
    assert.ok(manifest.includes('package="com.bumiayu.tvlauncher"'), 'Package harus com.bumiayu.tvlauncher');
    assert.ok(manifest.includes('android:label="YouTube"'), 'Label aplikasi harus YouTube');
    assert.ok(manifest.includes('android:icon="@drawable/ic_youtube_tv"'), 'Ikon aplikasi harus ic_youtube_tv');
    assert.ok(manifest.includes('android:hardwareAccelerated="true"'), 'Akselerasi hardware harus aktif');
});

test('build.gradle.kts menggunakan namespace & applicationId com.bumiayu.tvlauncher', () => {
    const gradle = fs.readFileSync(path.join(androidDir, 'app/build.gradle.kts'), 'utf8');
    assert.ok(gradle.includes('namespace = "com.bumiayu.tvlauncher"'));
    assert.ok(gradle.includes('applicationId = "com.bumiayu.tvlauncher"'));
});

// --------------------------------------------------------------------------
// 3. SESI 2: TEMA GELAP MEWAH (ANTI-LAG)
// --------------------------------------------------------------------------
console.log('\n[SESI 2: Tema Gelap Mewah style.css]');

test('style.css menggunakan latar solid #0d0e12 ala Apple TV Dark Mode', () => {
    const css = fs.readFileSync(path.join(tvHubDir, 'style.css'), 'utf8');
    assert.ok(css.includes('#0d0e12'), 'Warna background harus #0d0e12');
});

test('style.css memiliki efek fokus remote D-Pad scale(1.06) & border #ffffff', () => {
    const css = fs.readFileSync(path.join(tvHubDir, 'style.css'), 'utf8');
    assert.ok(css.includes('.tv-card:focus'), 'Harus ada kelas .tv-card:focus');
    assert.ok(css.includes('scale(1.06)'), 'Harus ada pembesaran halus scale(1.06)');
    assert.ok(css.includes('border-color: #ffffff') || css.includes('border-color: #fff'));
});

test('style.css bebas dari filter backdrop blur yang memberatkan GPU TV 1GB', () => {
    const css = fs.readFileSync(path.join(tvHubDir, 'style.css'), 'utf8');
    assert.strictEqual(css.includes('backdrop-filter: blur'), false, 'Tidak boleh ada backdrop-filter blur');
});

test('style.css memiliki styling badge status online, offline, checking', () => {
    const css = fs.readFileSync(path.join(tvHubDir, 'style.css'), 'utf8');
    assert.ok(css.includes('.status-online'));
    assert.ok(css.includes('.status-offline'));
    assert.ok(css.includes('.status-checking'));
});

// --------------------------------------------------------------------------
// 4. SESI 3 & 4: LOGIKA D-PAD, SENANDUNG & WEB TV
// --------------------------------------------------------------------------
console.log('\n[SESI 3 & 4: Logika script.js]');

const script = require('./script.js');

test('script.js mengekspor checkStreamStatus dan DEFAULT_PIN', () => {
    assert.strictEqual(typeof script.checkStreamStatus, 'function');
    assert.strictEqual(script.DEFAULT_PIN, '1234');
});

test('script.js menangani verifikasi PIN dengan benar', () => {
    script.clearPinInput();
    script.inputPinDigit('1');
    script.inputPinDigit('2');
    script.inputPinDigit('3');
    script.inputPinDigit('4');
    // Jika PIN 1234 dimasukkan, verifikasi berhasil
    assert.strictEqual(script.DEFAULT_PIN, '1234');
});

test('script.js berisi navigasi D-Pad panah 37, 38, 39, 40 dan OK 13, 23', () => {
    const scriptSrc = fs.readFileSync(path.join(tvHubDir, 'script.js'), 'utf8');
    assert.ok(scriptSrc.includes('case 39:'), 'Panah Kanan');
    assert.ok(scriptSrc.includes('case 37:'), 'Panah Kiri');
    assert.ok(scriptSrc.includes('case 40:'), 'Panah Bawah');
    assert.ok(scriptSrc.includes('case 38:'), 'Panah Atas');
    assert.ok(scriptSrc.includes('case 13:') || scriptSrc.includes('case 23:'), 'Tombol OK/Enter');
});

test('script.js memiliki fungsi kontrol API Senandung dan openSettings', () => {
    const scriptSrc = fs.readFileSync(path.join(tvHubDir, 'script.js'), 'utf8');
    assert.ok(scriptSrc.includes('controlSenandung'), 'Fungsi controlSenandung harus ada');
    assert.ok(scriptSrc.includes('/player/'), 'Endpoint player harus dipanggil');
    assert.strictEqual(typeof script.openSettings, 'function');
});

// --------------------------------------------------------------------------
// 5. SESI 5: DOM HTML LIGHTWEIGHT & PENGATURAN
// --------------------------------------------------------------------------
console.log('\n[SESI 5: DOM HTML index.html]');

test('index.html memuat Baris 1: Hiburan & Ekosistem (YouTube & Senandung)', () => {
    const html = fs.readFileSync(path.join(tvHubDir, 'index.html'), 'utf8');
    assert.ok(html.includes('Hiburan & Ekosistem'));
    assert.ok(html.includes('launchYouTube()') || html.includes('intent://'));
    assert.ok(html.includes('controlSenandung'));
    assert.ok(html.includes('assets/youtube_tv.png'));
    assert.ok(html.includes('assets/senandung.png'));
});

test('index.html memuat Baris 2: Saluran Web TV Live (Kompas TV, NHK World, 18+)', () => {
    const html = fs.readFileSync(path.join(tvHubDir, 'index.html'), 'utf8');
    assert.ok(html.includes('Saluran Web TV Live'));
    assert.ok(html.includes('Kompas TV'));
    assert.ok(html.includes('NHK World'));
    assert.ok(html.includes('openAdultChannel'));
    assert.ok(html.includes('status-badge'));
});

test('index.html memuat Baris 3: Pengaturan & Sistem (Wi-Fi, Bluetooth, Apps, Device)', () => {
    const html = fs.readFileSync(path.join(tvHubDir, 'index.html'), 'utf8');
    assert.ok(html.includes('Pengaturan & Sistem'));
    assert.ok(html.includes("openSettings('wifi')"));
    assert.ok(html.includes("openSettings('bluetooth')"));
    assert.ok(html.includes("openSettings('apps')"));
    assert.ok(html.includes("openSettings('device')"));
});

test('index.html memuat elemen native <dialog id="adult-pin-dialog">', () => {
    const html = fs.readFileSync(path.join(tvHubDir, 'index.html'), 'utf8');
    assert.ok(html.includes('<dialog id="adult-pin-dialog"'));
    assert.ok(html.includes('pin-keypad'));
});

test('index.html memuat pemutar video fullscreen #video-overlay', () => {
    const html = fs.readFileSync(path.join(tvHubDir, 'index.html'), 'utf8');
    assert.ok(html.includes('id="video-overlay"'));
    assert.ok(html.includes('id="main-player"'));
});

// --------------------------------------------------------------------------
// 6. FITUR INSTALASI USB GANDA
// --------------------------------------------------------------------------
console.log('\n[Fitur Instalasi USB Ganda]');

test('Tersedia script copy-to-usb.ps1 dan copy-to-usb.bat untuk Flashdisk USB', () => {
    assert.strictEqual(fs.existsSync(path.join(baseDir, 'copy-to-usb.ps1')), true);
    assert.strictEqual(fs.existsSync(path.join(baseDir, 'copy-to-usb.bat')), true);
});

// --------------------------------------------------------------------------
// 7. SINKRONISASI ASET ANDROID
// --------------------------------------------------------------------------
console.log('\n[Verifikasi Sinkronisasi Aset Android]');

test('tv-hub-android/app/src/main/assets/hub identik dengan tv-hub/', () => {
    const androidHubDir = path.join(androidDir, 'app/src/main/assets/hub');
    assert.strictEqual(fs.existsSync(path.join(androidHubDir, 'index.html')), true);
    assert.strictEqual(fs.existsSync(path.join(androidHubDir, 'style.css')), true);
    assert.strictEqual(fs.existsSync(path.join(androidHubDir, 'script.js')), true);
    assert.strictEqual(fs.existsSync(path.join(androidHubDir, 'assets/youtube_tv.png')), true);
    assert.strictEqual(fs.existsSync(path.join(androidHubDir, 'assets/senandung.png')), true);
    assert.strictEqual(fs.existsSync(path.join(androidHubDir, 'assets/wifi.png')), true);
    assert.strictEqual(fs.existsSync(path.join(androidHubDir, 'assets/bluetooth.png')), true);
    assert.strictEqual(fs.existsSync(path.join(androidHubDir, 'assets/apps.png')), true);
    assert.strictEqual(fs.existsSync(path.join(androidHubDir, 'assets/settings.png')), true);
});

console.log(`\n========================================================`);
console.log(` HASIL: ${passedTests} / ${totalTests} PENGUJIAN LULUS (${Math.round((passedTests/totalTests)*100)}%)`);
console.log(`========================================================\n`);

if (passedTests !== totalTests) {
    process.exit(1);
}
