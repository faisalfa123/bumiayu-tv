# Xiaomi Smart TV 4A (32" 1GB RAM) — Apple TV Experience Toolkit

Toolkit otomatis untuk mentransformasi **Xiaomi Smart TV 4A 32 Inch (RAM 1 GB)** menjadi perangkat yang **sangat ringan, bebas iklan, responsif, dan nyaman digunakan layaknya Apple TV (tvOS)**.

---

## 🌟 Apa Saja Keunggulannya?
1. **RAM Bebas Meningkat Signifikan (~300MB Free RAM Ekstra):** Menonaktifkan PatchWall, background tracker Xiaomi, dan analitik yang biasanya membebani RAM 1GB.
2. **Navigasi Secepat Apple TV:** Skala animasi sistem disetel ke `0.5x` dan akselerasi GPU 2D diaktifkan sehingga perpindahan menu terasa instan tanpa jeda/stutter.
3. **100% Bebas Iklan & Banner Rekomendasi:** Menggantikan Google TV Home & PatchWall yang berat dengan **FaisalTVHub** (Custom WebView Launcher ala Apple TV) atau **Flix Launcher** (FOSS, Kotlin, ukuran < 1 MB).
4. **Integrasi Ekosistem Self-Hosted (`faisalfa123`):** Akses langsung **Senandung** (`:8080`), **Immich** (`:2283`), dan **DompetMungil** (`:3000`) dari satu layar Hub TV, lengkap dengan kursor remote D-Pad.
5. **YouTube Bebas Iklan Otomatis:** **SmartTube Stable** (`smarttube_stable.apk`) otomatis diunduh dan dipasang oleh `optimize-tv.bat`.
6. **Tombol Mikrofon Remote Tetap Aktif:** Google Voice Assistant (`com.google.android.katniss`) dipertahankan sepenuhnya, sehingga Anda tetap bisa mencari konten via suara dengan remote Xiaomi.
7. **Akses Port HDMI Tetap Terjaga:** Tersedia shortcut *TV Inputs* untuk berpindah ke HDMI 1, HDMI 2, dan AV.
8. **100% Aman & Non-Root (Widevine L1 Tetap Aman):** Tidak merusak lisensi DRM, sehingga Netflix, Disney+ Hotstar, dan Prime Video tetap bisa memutar resolusi HD.
9. **Bisa Dikembalikan Kapan Saja (1-Click Restore):** Cukup jalankan `restore-tv.bat`.

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
├── tv-hub/                 <-- Web UI FaisalTVHub (bisa dipreview di browser)
├── tv-hub-android/         <-- Wrapper Android TV (WebView + Virtual Pointer)
├── .github/workflows/      <-- Workflow GitHub Actions (Build FaisalTVHub APK)
├── bin/                    <-- Tempat adb.exe (terunduh otomatis)
└── apk/                    <-- Tempat APK (FaisalTVHub.apk, smarttube_stable.apk, dll.)
```

---

## 🖥️ FaisalTVHub (`tv-hub/` & `tv-hub-android/`)

**FaisalTVHub** adalah launcher & hub khusus bergaya Apple TV (tvOS) yang dirancang untuk menggantikan layar utama Xiaomi TV sekaligus menyatukan aplikasi self-hosted Anda:

- **Integrasi Langsung Aplikasi Self-Hosted (`faisalfa123`):**
  - **Senandung** (`:8080`) — Musik & audio self-hosted
  - **Immich** (`:2283`) — Galeri foto & video keluarga
  - **DompetMungil** (`:3000`) — Pencatatan keuangan
  - Ditambah kartu akses cepat ke aplikasi TV lokal (SmartTube, Netflix, TV Inputs, dll.)
- **Virtual Pointer / Kursor Remote D-Pad:**
  Web app self-hosted umumnya dibuat untuk mouse/sentuhan, bukan remote TV. FaisalTVHub menyertakan kursor virtual bawaan:
  - Tekan **tombol arah (Atas/Bawah/Kiri/Kanan)** pada remote untuk menggerakkan kursor di dalam web app.
  - Tekan **OK / Tengah** untuk melakukan klik.
  - Tekan tombol **MENU** atau **INFO** untuk beralih antara **Mode Kursor** dan **Mode D-Pad bawaan** kapan saja.
- **Layar Error & Re-konfigurasi Server dari Remote TV:**
  Jika server Odroid C2 / STB sedang offline atau berganti alamat IP, Anda tidak perlu mengedit kode atau membongkar APK. Cukup pilih **"Re-konfigurasi Alamat Server"** di layar error langsung menggunakan remote TV, lalu masukkan IP server yang baru.
- **Preview Cepat di Laptop:**
  Anda dapat melihat dan mencoba tampilan Hub langsung di browser laptop dengan membuka file `tv-hub/index.html`.

---

## 📺 SmartTube Stable (YouTube Non-Iklan)

`optimize-tv.bat` kini **otomatis mengunduh dan memasang** **`smarttube_stable.apk`** (`com.teamsmart.videomanager.tv`) ke Xiaomi TV Anda. SmartTube jauh lebih ringan untuk TV RAM 1GB dibandingkan aplikasi YouTube bawaan, mendukung pemutaran hingga 60fps tanpa lag, 100% bebas iklan, dan dilengkapi **SponsorBlock**.

---

## 🛠️ Cara Build APK `FaisalTVHub` via GitHub Actions (Tanpa Android Studio di Windows)

Anda tidak perlu menginstal Android Studio atau Android SDK di laptop Windows untuk menghasilkan file `FaisalTVHub.apk`:

1. **Push proyek ke repository GitHub Anda** (misalnya `faisalfa123/xiaomi-tv-debloat`).
2. Buka repository tersebut di browser, lalu klik tab **Actions**.
3. Pastikan workflow **`Build FaisalTVHub APK`** berjalan (otomatis terpicu saat push ke branch `main`/`master`, atau bisa dijalankan manual via *Run workflow*) dan tunggu hingga selesai (**~2 menit**).
4. Setelah statusnya hijau, buka hasil run tersebut dan unduh artifact bernama **`FaisalTVHub-APK`** (di dalamnya berisi file `app-debug.apk`).
5. Ekstrak file `app-debug.apk`, ubah namanya menjadi **`FaisalTVHub.apk`**, lalu taruh ke dalam folder **`apk/FaisalTVHub.apk`** di proyek ini.
6. Jalankan **`optimize-tv.bat`** — script akan otomatis mendeteksi dan memasang `apk/FaisalTVHub.apk` ke Xiaomi TV Anda (serta menanyakan IP server SBC/Odroid C2 Anda secara opsional).

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
> Pastikan Laptop dan TV Anda terhubung ke jaringan Wi-Fi yang sama (berdasarkan foto TV Anda: SSID **griya alit**, IP TV: **`192.168.0.107`**).

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
   - Memasang **FaisalTVHub** (jika `apk/FaisalTVHub.apk` tersedia) atau mengunduh & memasang **Flix Launcher**.
   - Menonaktifkan PatchWall dan iklan Xiaomi.
   - Menyetel animasi super mulus 0.5x.

---

### Langkah 3: Menikmati Hasilnya
1. Setelah script menampilkan *"OPTIMASI SELESAI DENGAN SUKSES!"*, ambil remote TV Anda.
2. Tekan tombol **HOME** (ikon lingkaran).
3. Anda akan disambut oleh tampilan launcher baru yang bersih, cepat, tanpa iklan, dan navigasi yang sangat responsif!

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
