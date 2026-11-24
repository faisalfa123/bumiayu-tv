# Changelog - Bumiayu TV Launcher

All notable changes to the Bumiayu TV Launcher project are documented in this file.

The versioning format follows our project SOP defined in `VERSIONING_RULES.md`:
- **Format 3-Angka:** `Main.Beta.NightlyDev` (`X.Y.Z`)
- **Perbaikan Bug:** Dicatat di versi berjalan tanpa menaikkan nomor versi.
- **Penambahan Fitur / Modifikasi:** Menaikkan nomor versi ke `Nightly Dev` (`Z` naik) kecuali secara eksplisit diminta rilis Stabil/Beta.

---

## [2.1.2] - 2026-11-24

### 🚀 Rilis Stabil Versi 2.1.2 & Multi-ABI Cross-Platform Engine

#### 1. Rilis Resmi Multi-ABI APK di GitHub Release
- **Paket APK Spesifik Arsitektur:** Rilis GitHub kini menyediakan file APK mandiri siap pasang untuk setiap tipe arsitektur prosesor:
  - `bumiayu-tv-armeabi-v7a-32bit.apk`: Khusus TV RAM 1GB / Smart TV hemat daya (Xiaomi TV 4A 32", Coocaa, Changhong, RealMe TV).
  - `bumiayu-tv-arm64-v8a-64bit.apk`: Khusus Android TV Box & Google TV modern 64-bit (Xiaomi TV Box S Gen 2, Nvidia Shield, Chromecast TV).
  - `bumiayu-tv-x86-32bit.apk`: Khusus emulator Android TV 32-bit dan sistem Intel x86.
  - `bumiayu-tv-x86_64-64bit.apk`: Khusus emulator Android TV 64-bit dan TV Box arsitektur x86_64.
  - `bumiayu-tv-universal.apk`: Paket universal multi-arsitektur lengkap siap pasang di semua tipe perangkat Android TV.

#### 2. Master Plan Arsitektur Proyek (`MASTER.md`)
- **Dokumen Kitab Suci Pengembangan:** Menambahkan file `MASTER.md` di root repositori mencakup visi Media Hub Sinematik, standar UI/UX baru anti-monoton, roadmap Fase 1 (Rebranding TizenTube ke icon YouTube resmi & UptoID ke Store TV), serta SOP performa GPU Mali-450.

#### 3. Restorasi Kecepatan Animasi Sistem
- **Skala Animasi Standar 1.0x:** Mengembalikan `window_animation_scale`, `transition_animation_scale`, dan `animator_duration_scale` dari `0.5x` menjadi `1.0x` murni untuk transisi halus alami tanpa efek patah.

#### 4. Sekat Sub-Filter Live TV & M3U Global Streaming
- Menghadirkan toolbar filter kategori di tab Live TV (`Semua Saluran`, `TV Nasional`, `M3U Global & Movies`, `Favorit`) dengan pra-validasi HTTP 200 dan isolasi konten dewasa ke Brankas PIN 18+.

---

## [2.0.4 Nightly Dev] - 2026-11-24

### 🚀 Fitur Baru & Peningkatan Sub-Tab M3U Global

#### 1. Toolbar Sekat Sub-Filter di Tab Live TV
- **Filter Kategori Terpadu:** Menambahkan bar navigasi sub-kategori di atas daftar siaran Live TV:
  - Semua Saluran: Menampilkan seluruh 36+ saluran TV nasional dan M3U terverifikasi.
  - TV Nasional: Menyaring khusus siaran televisi nasional Indonesia (Trans7, Trans TV, Metro TV, TVRI Nasional & Daerah, RTV, Nusantara TV, Jawa Pos TV, TV9 Nusantara, BRTV, dll.).
  - M3U Global & Movies: Menampilkan saluran pilihan M3U global (Red Bull TV, 00s Cinema Replay, 1HD Music TV, Persiana Music, Blender Cinema HD, Akamai Ultra Live).
  - Favorit: Akses cepat ke deretan saluran siaran utama.
- **Navigasi D-Pad Mulus:** Pengguna dapat menavigasikan remote D-Pad Atas/Bawah antara Tab Kategori Utama, Toolbar Subfilter, dan Kartu Siaran tanpa konflik fokus.

#### 2. Validasi Stream M3U Aktif & Proteksi Konten 18+
- **Pre-Flight Stream Check:** Setiap URL saluran M3U diverifikasi status HTTP 200 sebelum disajikan ke aplikasi untuk mencegah error channel mati atau buffering abadi.
- **Isolasi Konten Dewasa:** Saluran dewasa otomatis disaring dan hanya dapat dibuka di dalam Brankas Privasi (*Vault 18+*) dengan PIN 4-digit pribadi.
- **Poster Sinematik 16:9:** Dibuatkan artwork poster beresolusi tinggi (480x270) untuk seluruh saluran M3U baru.

#### 3. Cross-Platform Universal ABI & Dokumen Panduan Render
- **Multi-Arsitektur Android:** Konfigurasi Gradle diperluas mendukung penuh arsitektur 32-bit dan 64-bit (rmeabi-v7a, rm64-v8a, x86, x86_64).
- **Dokumentasi RENDER_RULES.md:** Menetapkan standar teknis GPU rendering, larangan blur filter, dan arsitektur buffer HLS anti-lag.
- **Dokumentasi Visual README.md:** Menambahkan galeri tangkapan layar live dari Mi TV ke repositori GitHub.

---

## [2.0.1 Nightly Dev] - 2026-11-23

### 🎨 Desain Antarmuka Sinematik & Peningkatan Fitur (Google TV Modern Edition)

#### 1. Perombakan Visual Total (Anti "AI-Slop" Overhaul)
- **Desain Poster Sinematik 16:9:** Mengganti poster lama yang monoton dan terkesan artifisial dengan grafis *Google TV Cinematic Poster* resolusi tinggi (480x270). Menghilangkan duplikasi teks, menghapus lingkaran monogram buatan (`TR`, `ME`, `TV`), dan menghilangkan lencana LIVE ganda.
- **Tipografi Bersih & Elegan:** Menghapus emoji anak-anak (`🏠`, `📺`, `📱`, `⚙️`) pada navigasi atas dan menggantinya dengan tab navigasi minimalis modern (`Beranda`, `Live TV`, `Aplikasi`, `Pengaturan`).
- **Dynamic Backdrop & Ambient Glow:** Kartu yang mendapat fokus D-Pad mendapatkan efek pembesaran halus `scale(1.06)`, aksen border cyan elektrik `#38bdf8`, dan shadow lembut tanpa memberatkan GPU Mali-450.

#### 2. TizenTube Cobalt Sebagai Default YouTube Hub
- **TizenTube Cobalt (`io.gh.reisxd.tizentube.cobalt`)** kini menjadi kartu utama di Tab Beranda.
- **SmartTube (`org.smarttube.stable`)** diposisikan sebagai alternatif pemutar YouTube TV tanpa iklan.
- Hero billboard di Beranda langsung menyorot TizenTube Cobalt saat aplikasi pertama kali dibuka.

#### 3. Penambahan Saluran TV Nasional & Regional Aktif
- Menjaga keutuhan **17 saluran streaming pertama** (Trans7, Trans TV, Metro TV, TVRI Nasional, TVRI Bali, TVRI Sumut, TVRI Kalsel, TVRI Jateng, TVRI Jatim, TVRI Jogja, NHK World, DW English, Ahsan TV, UGTV, AKTV Siar, AM Media, Mux Test) tanpa perubahan URL karena terbukti berjalan mulus di TV pengguna.
- Menambahkan **7 saluran TV nasional & regional terverifikasi aktif (HTTP 200 OK)**:
  - TVRI Jawa Barat (Warta Parahyangan)
  - TVRI Kalimantan Timur (Warta IKN & Borneo)
  - TVRI Sulawesi Selatan (Warta Celebes)
  - TVRI Papua (Bumi Cenderawasih)
  - TVRI Aceh (Serambi Mekkah)
  - TVRI Sumatera Barat (Ranah Minang)
  - TVRI Riau (Bumi Lancang Kuning)

#### 4. Identitas & Logo Baru "Bumiayu TV Launcher"
- Memperbarui nama aplikasi di AndroidManifest menjadi **Bumiayu TV Launcher** (menggantikan nama default "YouTube").
- Mendesain logo vektor datar (*flat minimal cyan-obsidian*) pada `ic_launcher.xml` dan `tv_banner.xml` dengan simbol layar TV modern beraksen cyan dan obsidian pekat.

#### 5. Kejelasan Akses & Pengaturan Brankas Rahasia 18+
- Menempatkan kartu akses langsung **"Brankas Privasi (18+)"** di dalam Tab `[Pengaturan]` agar pengguna tidak kebingungan mencari letak siaran privat dewasa.
- Mempertahankan jalur pintas remote rahasia: Tombol remote `ATAS` -> `ATAS` -> `BAWAH` -> `BAWAH` pada Tab `[Pengaturan]`.
- Dilengkapi **Panduan Pengaturan PIN Mandiri**: Saat pertama kali dibuka, pengguna langsung diminta membuat 4-digit PIN pilihan sendiri dan melakukan konfirmasi sebelum brankas dapat terbuka.
- Menyediakan poster khusus `assets/vault_adult.png` dan `assets/vault_lock.png`.

#### 6. Perbaikan Kritis: Dialog Menutupi Video & Fullscreen TV Lock Screen (Bug Fix Patch)
- **Perbaikan Modal Menutupi Video:** Memperbaiki bug di mana modal dialog melayang tetap terbuka dan menutupi 80% layar saat video dewasa diputar. Kini saat saluran diklik, tampilan kunci otomatis tertutup total dan video tayang 100% fullscreen tanpa ada elemen keypad yang menghalangi.
- **Dedicated Fullscreen TV Lock Screen (Ala Apple TV / Netflix Profile PIN):** Mengganti modal melayang yang kaku dengan antarmuka fullscreen elegan: 4 lingkaran dot PIN (`○ ○ ○ ○` -> `● ● ● ●`), keypad numerik D-Pad yang responsif, serta dukungan input langsung dari tombol angka remote fisik (0-9).
- **Perbaikan Rasio 16:9 Thumbnail Hub:** Memperbaiki kontainer poster TizenTube, SmartTube, dan Senandung dari format kotak (90x90) menjadi rasio asli 16:9 (130x74px) sehingga logo dan teks tidak lagi terpotong di layar TV.

---

## [2.0.0] - 2026-11-23 [STABLE RELEASE]

### 🚀 Tonggak Rilis Stabil Fondasi Sistem
- Fondasi arsitektur Google TV Leanback untuk Xiaomi Smart TV 4A 32" (Android TV 9).
- Mesin navigasi spasial 2D D-Pad remote yang responsif.
- Pemutar internal HLS (`hls.min.js`) lokal tanpa dependensi CDN luar.
- Katalog 17 saluran siaran nasional dan internasional pertama.
- Pengaturan cepat Android TV (Wi-Fi, Bluetooth, Kelola Aplikasi, Setelan Perangkat).

---

## [1.0.0] - 2026-11-22
- Rilis inisial debloat dan antarmuka web TV hub awal.
