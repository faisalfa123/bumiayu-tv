# Xiaomi Smart TV 4A (32" 1GB RAM) — Apple TV Experience Toolkit

Toolkit otomatis untuk mentransformasi **Xiaomi Smart TV 4A 32 Inch (RAM 1 GB)** menjadi perangkat yang **sangat ringan, bebas iklan, responsif, dan nyaman digunakan layaknya Apple TV (tvOS)**.

---

## 🌟 Apa Saja Keunggulannya?
1. **RAM Bebas Meningkat Signifikan (~300MB Free RAM Ekstra):** Menonaktifkan PatchWall, background tracker Xiaomi, dan analitik yang biasanya membebani RAM 1GB.
2. **Navigasi Secepat Apple TV:** Skala animasi sistem disetel ke `0.5x` dan akselerasi GPU 2D diaktifkan sehingga perpindahan menu terasa instan tanpa jeda/stutter.
3. **100% Bebas Iklan & Banner Rekomendasi:** Menggantikan Google TV Home & PatchWall yang berat dengan **Flix Launcher** (FOSS, Kotlin, ukuran < 1 MB).
4. **Tombol Mikrofon Remote Tetap Aktif:** Google Voice Assistant (`com.google.android.katniss`) dipertahankan sepenuhnya, sehingga Anda tetap bisa mencari konten via suara dengan remote Xiaomi.
5. **Akses Port HDMI Tetap Terjaga:** Tersedia shortcut *TV Inputs* untuk berpindah ke HDMI 1, HDMI 2, dan AV.
6. **100% Aman & Non-Root (Widevine L1 Tetap Aman):** Tidak merusak lisensi DRM, sehingga Netflix, Disney+ Hotstar, dan Prime Video tetap bisa memutar resolusi HD.
7. **Bisa Dikembalikan Kapan Saja (1-Click Restore):** Cukup jalankan `restore-tv.bat`.

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
├── bin/                    <-- Tempat adb.exe (terunduh otomatis)
└── apk/                    <-- Tempat file APK launcher (Flix / FLauncher)
```

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
   - Mengunduh & memasang **Flix Launcher**.
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
- **SmartTube:** Sangat disarankan mengganti aplikasi YouTube bawaan dengan SmartTube. SmartTube jauh lebih hemat RAM, memutar video di 60fps dengan lancar tanpa lag, bebas iklan, dan dilengkapi SponsorBlock.
- **TV Inputs:** Untuk berpindah antar colokan HDMI / Set-Top Box, buka ikon aplikasi *TV Inputs* yang ada di launcher.

---

## 🔄 Cara Mengembalikan ke Pengaturan Semula (Restore)
Jika di kemudian hari Anda ingin menjual TV atau mengembalikan PatchWall bawaan pabrik:
1. Pastikan TV dan Laptop terhubung ke Wi-Fi.
2. Klik dua kali file **`restore-tv.bat`**.
3. Tekan **ENTER** saat diminta IP TV.
4. Semua aplikasi bawaan dan animasi akan diaktifkan kembali seperti sedia kala!
