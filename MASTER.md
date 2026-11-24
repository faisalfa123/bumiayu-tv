# 📺 MASTER PLAN: Bumiayu TV Launcher (Next-Gen Edition)

**Versi Dokumen:** 1.0.0  
**Target Hardware:** Xiaomi Smart TV 4A (Amlogic S905X, Mali-450 GPU, RAM 1GB)  
**Status:** Active Development  

## 1. Visi & Filosofi Desain
Bumiayu TV bukan sekadar launcher, melainkan sebuah **Media Hub Sinematik**. Tujuannya adalah mengubah pengalaman menonton di TV entry-level menjadi setara dengan perangkat premium (Apple TV/Google TV) melalui optimasi ekstrem dan estetika visual yang matang.

### Prinsip Utama:
*   **Zero-Bloat:** Tidak ada proses background yang tidak perlu.
*   **Visual Depth:** Menghilangkan kesan "datar/monoton" dengan penggunaan shadow, depth, dan tipografi hierarkis.
*   **Privacy First:** Fitur *Stealth Vault* 18+ adalah prioritas keamanan utama.

---

## 2. Standar UI/UX Baru (Anti-Monoton)
Untuk meningkatkan kualitas visual tanpa merubah struktur layout HTML dasar, terapkan aturan CSS berikut:

| Elemen | Spesifikasi Baru | Tujuan |
| :--- | :--- | :--- |
| **Kartu Fokus** | `transform: scale(1.08)` + `box-shadow: 0 20px 40px rgba(0,0,0,0.6)` | Memberikan efek "melayang" (depth). |
| **Background** | Dinamis (Blur dari poster aktif) atau Gradien `#0f172a` ke `#000` | Menciptakan suasana sinematik. |
| **Tipografi** | Font 'Inter' atau 'Roboto Condensed'. Judul: Bold (-0.5px spacing). | Tampilan modern dan tegas. |
| **Transisi** | Maksimal 300ms dengan `cubic-bezier`. Hindari animasi berat. | Responsif di GPU Mali-450. |
| **Rasio Gambar** | Wajib konsisten (16:9 untuk Live TV, 2:3 untuk Movies). | Kerapian grid visual. |

---

## 3. Roadmap Perubahan & Penambahan Fitur

### 🟢 Fase 1: Rebranding & Integrasi Aplikasi (Prioritas Tinggi)

#### A. Modifikasi TizenTube (YouTube Client)
*   **Tugas:** Mengganti ikon default TizenTube.
*   **Target:** Ikon harus identik dengan logo YouTube resmi agar user awam tidak bingung.
*   **Metode:** 
    1. Ekstrak APK TizenTube.
    2. Ganti file `res/mipmap-*/ic_launcher.png` dengan aset YouTube HD.
    3. Repackage dan sign ulang APK.
    4. Update path instalasi di script `optimize-tv.ps1`.

#### B. Instalasi & Rebranding UptoID TV
*   **Tugas:** Menambahkan toko aplikasi alternatif dan mengubah identitasnya.
*   **Target:** Nama aplikasi berubah menjadi **"Store TV"**.
*   **Metode:**
    1. Gunakan tool **APK Editor** atau **MT Manager** untuk mengubah `app_name` di `strings.xml`.
    2. Ganti ikon dengan ikon "Tas Belanja" atau "TV Store" yang minimalis.
    3. Pastikan package name tetap asli agar update otomatis dari UptoID masih bisa berjalan (opsional).

### 🟡 Fase 2: Peningkatan Kualitas Sistem (Quality of Life)

#### C. Optimasi Performa Rendering
*   **Tugas:** Implementasi *Object Pooling* pada JavaScript.
*   **Tujuan:** Mencegah *Garbage Collection* lag saat navigasi cepat.
*   **Detail:** Pre-allocate DOM nodes untuk list channel. Jangan hapus/buat elemen baru, cukup ubah konten (`src`, `text`) dari elemen yang sudah ada.

#### D. Sistem Tombol "Mi" (Quick Settings)
*   **Tugas:** Memetakan tombol fisik "Mi" di remote untuk membuka popup pengaturan.
*   **Syarat:** Tidak boleh me-reload halaman atau mengganggu pemutar video.
*   **Implementasi:** Overlay HTML `fixed` dengan `z-index: 9999`. Berisi opsi: Refresh Channel, Cek Wi-Fi, Clear Cache.

#### E. Kompresi Aset Media
*   **Tugas:** Konversi semua ikon dan poster statis ke format **WebP**.
*   **Tujuan:** Mengurangi ukuran download APK dan mempercepat loading awal di RAM 1GB.

---

## 4. Aturan Teknis Pengembangan (SOP)

1.  **Bahasa Utama:** Tetap menggunakan **HTML/CSS/JavaScript (Vanilla)**. 
    *   *Catatan:* Migrasi ke Go/Rust **DITOLAK** untuk UI karena overhead memori native yang terlalu besar untuk RAM 1GB. Go/Rust hanya digunakan untuk toolkit PC (PowerShell/Batch).
2.  **Manajemen Memori:** 
    *   Buffer HLS maksimal **30MB**.
    *   Batas maksimal elemen DOM aktif di layar: **50 item**.
3.  **Navigasi:** 
    *   Gunakan `tabindex` dinamis.
    *   Pastikan fokus tidak pernah "hilang" atau terjebak di elemen tersembunyi.
4.  **Testing:** 
    *   Wajib dites di emulator Android TV (x86) dan device fisik Xiaomi Mi TV 4A.

---

## 5. Struktur Folder Proyek

```text
bumiayu-tv/
├── tv-hub/                 # Source code Web Launcher (HTML/CSS/JS)
├── tv-hub-android/         # Wrapper Kotlin (Jika diperlukan native features)
├── assets/                 # Ikon YouTube, Store TV, dan Poster WebP
├── scripts/                # Toolkit PowerShell/Batch untuk instalasi
├── docs/                   # Dokumentasi RENDER_RULES.md & CHANGELOG.md
└── MASTER.md               # File panduan utama ini
```

---

## 6. Checklist Validasi Sebelum Rilis

- [ ] Ikon TizenTube sudah berubah menjadi YouTube.
- [ ] UptoID TV sudah terinstall dan bernama "Store TV".
- [ ] Tombol "Mi" berhasil memunculkan popup tanpa lag.
- [ ] Tidak ada animasi CSS yang menyebabkan stuttering di GPU Mali-450.
- [ ] Fitur PIN Vault 18+ berfungsi dan menyembunyikan konten secara total.
- [ ] Ukuran APK final tidak melebihi batas wajar untuk instalasi via USB.
