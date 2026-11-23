# Changelog - Bumiayu TV Launcher

All notable changes to the Bumiayu TV Launcher project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.1.0] - 2026-11-23

### 🚀 Perbaikan Kritis & Peningkatan Fitur (Bug Fixes & Overhaul)

#### 1. Perbaikan Navigasi D-Pad & Pemilihan Menu (Bug #1 Selesai)
- **Masalah:** Tombol remote hanya bisa memilih menu pertama dan sering terjebak pindah-pindah tab.
- **Solusi:**
  - Membangun ulang mesin navigasi spasial 2D (`setupDpadNavigation`).
  - Menghapus pembatasan `tabindex="-1"` pada kartu anak di dalam container sehingga kursor D-Pad remote dapat bergerak bebas ke kanan, kiri, atas, dan bawah.
  - Menambahkan pemetaan tombol D-Pad Center/Enter (`keyCode: 13` dan `keyCode: 23`) untuk memicu eksekusi kartu secara presisi.
  - Memperbaiki transisi dari Top Navigation Tab turun ke baris kartu menggunakan tombol Panah Bawah (`ArrowDown`).

#### 2. Perbaikan Pemutar Siaran TV (Bug #2 Selesai)
- **Masalah:** Siaran Live TV tidak jalan sama sekali saat kartu dipilih.
- **Solusi:**
  - Membundel pustaka `hls.min.js` secara lokal di dalam APK (`file:///android_asset/hub/hls.min.js`) tanpa bergantung pada koneksi CDN eksternal `jsdelivr.net`.
  - Mengganti seluruh link stream mati (DensTV yang geo-blocked/expired) dengan 17 saluran HLS publik resmi yang telah diuji aktif dan berjalan (Trans7, Trans TV, Metro TV, TVRI Nasional, TVRI Daerah, DW English, NHK World, Ahsan TV, UGTV, Siar AKTV).
  - Menambahkan recovery otomatis saat terjadi buffer atau network error pada pemutar HLS.

#### 3. Dual YouTube Hub & TizenTube Cobalt
- Mengintegrasikan **SmartTube** (Leanback Remote TV) dan **TizenTube Cobalt** (`io.gh.reisxd.tizentube.cobalt`) secara berdampingan di Tab Beranda.
- TizenTube Cobalt otomatis terunduh dan terpasang pada sistem TV.

#### 4. Stealth 18+ Vault (Keamanan Brankas Dewasa)
- Kategori 18+ disembunyikan secara total dari tampilan Beranda dan Live TV.
- Akses rahasia hanya dapat dipanggil pada Tab `[Pengaturan]` menggunakan kombinasi tombol remote:  
  `ATAS` -> `ATAS` -> `BAWAH` -> `BAWAH`.
- Dilengkapi **Wizard Pembuatan PIN Baru**: Pengguna diminta membuat dan mengonfirmasi 4-digit PIN pilihan sendiri saat pertama kali dibuka.

---

## [1.0.0] - 2026-11-22
- Rilis awal Bumiayu TV Launcher untuk Xiaomi Smart TV 4A 32" (Android TV 9).
- Debloat bawaan PatchWall dan optimasi memori RAM 1GB.
- Antarmuka tema gelap solid Apple TV `#0d0e12`.
