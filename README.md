# Xiaomi Smart TV 4A (32" 1GB RAM) — Bumiayu TV Launcher & Apple TV Experience Toolkit

Toolkit otomatis untuk mentransformasi **Xiaomi Smart TV 4A 32 Inch (RAM 1 GB)** menjadi perangkat yang **sangat ringan, bebas iklan, responsif, dan nyaman digunakan**, lengkap dengan **Bumiayu TV Launcher** — launcher Android TV bergaya anime-retro yang ringan, bebas iklan, dan terintegrasi dengan Web TV serta layanan self-hosted Anda.

---

## 🌟 Apa Saja Keunggulannya?
1. **RAM Bebas Meningkat Signifikan (~300MB Free RAM Ekstra):** Menonaktifkan PatchWall, background tracker Xiaomi, dan analitik yang biasanya membebani RAM 1GB.
2. **Navigasi Secepat Apple TV:** Skala animasi sistem disetel ke `0.5x` dan akselerasi GPU 2D diaktifkan sehingga perpindahan menu terasa instan tanpa jeda/stutter.
3. **100% Bebas Iklan & Banner Rekomendasi:** Menggantikan Google TV Home & PatchWall yang berat dengan **Bumiayu TV Launcher** (Custom WebView Launcher bertema anime-retro) atau **Flix Launcher** (FOSS, Kotlin, ukuran < 1 MB).
4. **4 Tema Anime Retro & Mode Layar Santai (Ambient):** Pilih suasana visual favorit langsung dari remote TV dengan partikel 60fps ringan yang ramah GPU Mali-450.
5. **Web TV Terintegrasi + Mode 18+ Terkunci:** Nonton TV Nasional, TV Internasional, import playlist M3U, tandai saluran Favorit, serta amankan kategori 18+ dengan **PIN 4-Digit** atau **Pola Arah Remote**.
6. **Integrasi Ekosistem Self-Hosted (`faisalfa123`):** Akses langsung **Senandung** (`:8080`), **Immich** (`:2283`), dan **DompetMungil** (`:3000`) dari satu layar Hub TV, lengkap dengan kursor remote D-Pad.
7. **YouTube Bebas Iklan Otomatis:** **SmartTube Stable** (`smarttube_stable.apk`) otomatis diunduh dan dipasang oleh `optimize-tv.bat`.
8. **Tombol Mikrofon Remote Tetap Aktif:** Google Voice Assistant (`com.google.android.katniss`) dipertahankan sepenuhnya, sehingga Anda tetap bisa mencari konten via suara dengan remote Xiaomi.
9. **Akses Port HDMI Tetap Terjaga:** Tersedia shortcut *TV Inputs* untuk berpindah ke HDMI 1, HDMI 2, dan AV.
10. **100% Aman & Non-Root (Widevine L1 Tetap Aman):** Tidak merusak lisensi DRM, sehingga Netflix, Disney+ Hotstar, dan Prime Video tetap bisa memutar resolusi HD.
11. **Bisa Dikembalikan Kapan Saja (1-Click Restore):** Cukup jalankan `restore-tv.bat`.

---

## 📁 Struktur File Toolkit
```text
xiaomi-tv-debloat/
│
├── optimize-tv.bat         <-- [KLIK DUA KALI INI UNTUK OPTIMASI]
├── restore-tv.bat          <-- [KLIK DUA KALI INI JIKA INGIN RESTORE]
├── optimize-tv.ps1         <-- Script inti PowerShell otomasi ADB
├── restore-tv.ps1          <-- Script pemulihan paket bawaan
├── packages-bloat.txt      <-- Daftar paket bloatware yang dinonaktifkan
├── packages-protected.txt  <-- Daftar putih paket penting yang dijaga
├── tv-hub/                 <-- Web UI Bumiayu TV Launcher (bisa dipreview di browser)
├── tv-hub-android/         <-- Wrapper Android TV (WebView + Virtual Pointer)
├── .github/workflows/      <-- Workflow GitHub Actions (Build BumiayuTVLauncher APK)
├── bin/                    <-- Tempat adb.exe (terunduh otomatis)
└── apk/                    <-- Tempat APK (BumiayuTVLauncher.apk, smarttube_stable.apk, dll.)
```

---

## 🎨 Bumiayu TV Launcher (`tv-hub/` & `tv-hub-android/`)

**Bumiayu TV Launcher** adalah launcher & hub khusus yang dirancang untuk menggantikan layar utama Xiaomi TV sekaligus menyatukan hiburan TV, Web TV, dan aplikasi self-hosted Anda:

### 1. 4 Tema Anime Retro & Mode Layar Santai (Ambient)
Ganti suasana layar utama kapan saja lewat tombol **Tema** (tersimpan otomatis di TV):
- **`Bumiayu 16-Bit Pixel Art`** (`pixel`) — Nuansa retro arcade dengan grid horizon & bintang piksel amber/cyan.
- **`Bumiayu Asri`** (`asri`) — Suasana musim gugur hangat dengan animasi daun emas berguguran.
- **`Bumiayu Samudra`** (`samudra`) — Laut dalam biru tenang dengan animasi gelembung lembut.
- **`Bumiayu Rintik`** (`rintik`) — Senja berkabut dengan efek rintik hujan yang menenangkan.
- **Mode Layar Santai (Ambient):** Tekan tombol **Layar Santai** (atau biarkan layar idle) untuk menyembunyikan kartu aplikasi dan menampilkan jam besar, tanggal Indonesia, serta animasi partikel tema secara penuh. Tekan tombol apa saja pada remote untuk kembali ke beranda.

### 2. Web TV & Fitur 18+ Terkunci (PIN / Pola Arah Remote)
Akses halaman **Web TV** langsung dari kartu utama Bumiayu TV Launcher:
- **Channel Nasional:** TVRI Nasional (HLS), Kompas TV, CNN Indonesia, Metro TV, Trans TV, NET TV.
- **Channel Internasional:** NHK World Japan, Al Jazeera English, DW English, France 24 English, NASA TV.
- **Import Playlist M3U:** Tambahkan saluran kustom Anda sendiri via teks/file M3U di menu **Pengaturan & Sandi** (otomatis mendeteksi stream `HLS` maupun `Web TV`).
- **Saluran Favorit (`★`):** Tandai saluran favorit agar selalu tampil paling atas di daftar kategori.
- **Mode 18+ Terkunci PIN 4-Digit atau Pola Arah Remote:**
  - Kategori **18+ / Dewasa** terkunci secara default (PIN bawaan: **`1234`**).
  - Anda dapat mengubah kunci ke **PIN 4-Digit** kustom atau **Pola Arah Remote** (kombinasi 4–6 tombol arah D-Pad, misalnya `↑ ↑ ↓ →`) melalui menu **Pengaturan & Sandi**.
  - Tersedia opsi **Sembunyikan Tab 18+** agar tab 18+ tidak muncul di bilah kategori sebelum dibuka, dan sesi otomatis terkunci kembali saat keluar dari Web TV.

### 3. Integrasi Self-Hosted & Kursor Remote D-Pad
- **Integrasi Langsung Aplikasi Self-Hosted (`faisalfa123`):**
  - **Senandung** (`:8080`) — Musik & audio self-hosted
  - **Immich** (`:2283`) — Galeri foto & video keluarga
  - **DompetMungil** (`:3000`) — Pencatatan keuangan
  - Ditambah kartu akses cepat ke aplikasi TV lokal (Web TV, SmartTube, Netflix, TV Inputs, dll.).
- **Virtual Pointer / Kursor Remote D-Pad:**
  - Tekan **tombol arah (Atas/Bawah/Kiri/Kanan)** pada remote untuk menggerakkan kursor di dalam web app, tekan **OK / Tengah** untuk klik, dan tekan **MENU** atau **INFO** untuk beralih antara **Mode Kursor** dan **Mode D-Pad bawaan**.
- **Layar Error & Re-konfigurasi Server dari Remote TV:**
  - Jika server Odroid C2 / STB sedang offline atau berganti IP, pilih **"Re-konfigurasi Alamat Server"** langsung dari remote TV tanpa membongkar APK.

### 4. Preview Langsung di Laptop
Anda dapat melihat dan mencoba seluruh tampilan **Bumiayu TV Launcher** (termasuk 4 tema, Mode Layar Santai, dan Web TV) langsung di browser laptop dengan membuka file **`tv-hub/index.html`**.

---

## 📺 SmartTube Stable (YouTube Non-Iklan)

`optimize-tv.bat` **otomatis mengunduh dan memasang** **`smarttube_stable.apk`** (`com.teamsmart.videomanager.tv`) ke Xiaomi TV Anda. SmartTube jauh lebih ringan untuk TV RAM 1GB dibandingkan aplikasi YouTube bawaan, mendukung pemutaran hingga 60fps tanpa lag, 100% bebas iklan, dan dilengkapi **SponsorBlock**.

---

## 🛠️ Cara Build APK `Bumiayu TV Launcher` via GitHub Actions (Tanpa Android Studio di Windows)

Anda tidak perlu menginstal Android Studio atau Android SDK di laptop Windows untuk menghasilkan file APK:

1. **Push proyek ke repository GitHub Anda** (misalnya `faisalfa123/xiaomi-tv-debloat`).
2. Buka repository tersebut di browser, lalu klik tab **Actions**.
3. Pastikan workflow build APK berjalan (otomatis terpicu saat push ke branch `main`/`master`, atau bisa dijalankan manual via *Run workflow*) dan tunggu hingga selesai (**~2 menit**).
4. Setelah statusnya hijau, buka hasil run tersebut dan unduh artifact bernama **`BumiayuTVLauncher-APK`** (berisi `app-debug.apk`).
5. Ekstrak file `app-debug.apk`, ubah namanya menjadi **`BumiayuTVLauncher.apk`**, lalu taruh ke dalam folder **`apk/`** (`apk/BumiayuTVLauncher.apk`) di proyek ini.
6. Jalankan **`optimize-tv.bat`** — script akan otomatis mendeteksi dan memasang `apk/BumiayuTVLauncher.apk` ke Xiaomi TV Anda (serta menanyakan IP server SBC/Odroid C2 Anda secara opsional).

---

## 🚀 Panduan Langkah demi Langkah

### Langkah 1: Aktifkan USB Debugging di Xiaomi TV
1. Nyalakan Xiaomi TV Anda.
2. Buka **Pengaturan** (ikon gerigi di pojok kanan atas) > **Preferensi Perangkat** > **Tentang**.
3. Gulir ke bawah sampai menemukan tulisan **Build** (Versi OS).
4. Tekan tombol **OK/Tengah** pada remote sebanyak **7 kali berturut-turut** sampai muncul notifikasi: *"Anda sekarang adalah seorang pengembang!"*.
5. Tekan tombol *Kembali (Back)*, lalu buka menu baru: **Opsi Pengembang (Developer Options)**.
6. Aktifkan opsi:
   - **Debugging USB** (USB Debugging) -> Ubah ke **ON / Aktif**.

> [!NOTE]
> Pastikan Laptop dan TV Anda terhubung ke jaringan Wi-Fi yang sama (misalnya SSID **griya alit**, IP TV: **`192.168.0.107`**).

---

### Langkah 2: Jalankan Optimasi dari Laptop Windows
1. Buka folder `xiaomi-tv-debloat` di laptop Windows Anda.
2. **Klik dua kali (Double-click)** file **`optimize-tv.bat`**.
3. Jendela hitam/biru akan terbuka:
   - Jika ADB belum terpasang di laptop, script akan otomatis mengunduh *Android Platform-Tools* resmi dari Google ke folder `bin/`.
   - Script akan menampilkan: `Masukkan Alamat IP TV Anda (Tekan ENTER untuk '192.168.0.107')`.
   - Cukup tekan tombol **ENTER** pada keyboard laptop Anda.
4. **Lihat Layar TV Anda:**
   - Akan muncul jendela popup: *"Izinkan Debugging USB dari komputer ini?"*.
   - Gunakan remote TV untuk mencentang kotak **"Selalu izinkan dari komputer ini"**, lalu pilih **OK**.
5. Tekan **ENTER** pada jendela script di laptop untuk melanjutkan.
6. Script akan otomatis:
   - Mem-backup status aplikasi TV Anda.
   - Mengunduh & memasang **SmartTube Stable** (`smarttube_stable.apk`).
   - Memasang **Bumiayu TV Launcher** (jika `apk/BumiayuTVLauncher.apk` tersedia) atau mengunduh & memasang **Flix Launcher**.
   - Menonaktifkan PatchWall dan iklan Xiaomi.
   - Menyetel animasi super mulus 0.5x.

---

### Langkah 3: Menikmati Hasilnya
1. Setelah script menampilkan *"OPTIMASI SELESAI DENGAN SUKSES!"*, ambil remote TV Anda.
2. Tekan tombol **HOME** (ikon lingkaran).
3. Anda akan disambut oleh tampilan **Bumiayu TV Launcher** yang bersih, cepat, tanpa iklan, bertema anime-retro, dan siap digunakan!

---

## 💡 Rekomendasi Tambahan (Aplikasi Wajib untuk TV RAM 1GB)
Agar pengalaman menonton makin maksimal:
- **SmartTube Stable:** Sudah otomatis dipasang oleh `optimize-tv.bat` untuk menggantikan aplikasi YouTube bawaan. Jauh lebih hemat RAM, mendukung 60fps tanpa lag, bebas iklan, dan dilengkapi SponsorBlock.
- **TV Inputs:** Untuk berpindah antar colokan HDMI / Set-Top Box, buka ikon aplikasi *TV Inputs* yang ada di launcher.

---

## 🔄 Cara Mengembalikan ke Pengaturan Semula (Restore)
Jika di kemudian hari Anda ingin menjual TV atau mengembalikan PatchWall bawaan pabrik:
1. Pastikan TV dan Laptop terhubung ke Wi-Fi.
2. Klik dua kali file **`restore-tv.bat`**.
3. Tekan **ENTER** saat diminta IP TV.
4. Semua aplikasi bawaan dan animasi akan diaktifkan kembali seperti sedia kala!
