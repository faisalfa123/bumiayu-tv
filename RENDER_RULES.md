# Aturan Standar Render Aplikasi (TV Rendering Architecture & Performance Rules)

Dokumen ini mendefinisikan standar teknis rendering antarmuka pengguna (UI) dan pemutaran media pada **Bumiayu TV Launcher**. Aturan ini wajib dipatuhi dalam setiap pembaruan kode untuk menjamin launcher berjalan mulus, responsif, dan bebas lag pada perangkat Android TV dengan spesifikasi terbatas (seperti Xiaomi Smart TV 4A 32" RAM 1GB, Mali-450 GPU).

---

## 1. Prinsip Utama Arsitektur Rendering

### A. Zero GPU Overdraw & Zero `backdrop-filter: blur()`
- **DILARANG KERAS** menggunakan properti CSS `backdrop-filter: blur()` atau `filter: blur()`.
- GPU TV (Mali-450 / PowerVR) tidak memiliki dedicated memory untuk real-time blur buffer. Penggunaan blur akan menyebabkan dropped frames (drop ke < 15 fps) dan antarmuka macet.
- **Solusi Bersih:** Gunakan warna solid semi-transparan (`rgba(16, 20, 30, 0.95)`) atau linear-gradient murni yang dioptimasi hardware.

### B. Hardware Accelerated CSS & Will-Change Hygiene
- Semua elemen interaktif (`.tv-card`, `.nav-tab`, `.subfilter-pill`) wajib menggunakan transformasi GPU 3D:
  ```css
  transform: translateZ(0); /* Memaksa komposit layer GPU independen */
  will-change: transform;
  ```
- Durasi transisi remote D-Pad dibatasi antara **120ms – 160ms** dengan kurva `cubic-bezier(0.16, 1, 0.3, 1)` agar transisi terasa instan dan tidak ada efek "delay/floating".

### C. Shimmer & Feedback Visual Non-Intrusif
- Efek fokus wajib menggunakan pencahayaan batas bersih (*subtle border outline*) dan sapuan cahaya shimmer mikro (`::after` mask translateX).
- Hindari box-shadow dengan radius blur besar (> 25px) yang membebani rasterizer WebView.

---

## 2. Standar Format Poster & Rasio Layar

1. **Rasio Wajib 16:9 Sinematik:**
   - Semua poster saluran siaran, film, dan aplikasi wajib menggunakan rasio aspek **16:9** (`width: 480px; height: 270px` untuk resolusi master).
   - Menghindari kartu berformat kotak (1:1) yang menyebabkan artwork terpotong atau gepeng di layar lebar TV.
2. **Optimasi Asset Lokal:**
   - Poster dirender dan disimpan dalam direktori `assets/*.png` lokal dengan palet warna terindeks dan kompresi PNG lossless (`optimize=True`).
   - Ukuran per gambar poster tidak boleh melebihi **15 KB** untuk mencegah konsumsi RAM WebView membengkak.

---

## 3. Aturan Pemutar Media (HLS Stream Engine)

1. **Konfigurasi Buffer HLS RAM 1GB:**
   ```javascript
   new Hls({
       maxBufferLength: 8,              // Menahan maksimal 8 detik buffer ke depan
       maxMaxBufferLength: 15,          // Batas absolut 15 detik buffer
       maxBufferSize: 30 * 1000 * 1000, // Batas memori buffer ketat: 30 MB RAM
       enableWorker: false,             // Nonaktifkan worker threads untuk stabilitas Android WebView
       lowLatencyMode: false,
       backBufferLength: 4,             // Segera bersihkan buffer lampau > 4 detik
       fragLoadingTimeOut: 12000,
       manifestLoadingTimeOut: 10000
   });
   ```
2. **Validasi Stream Hidup (Live-Check):**
   - Setiap saluran baru wajib lolos uji respon HTTP 200 sebelum disajikan ke pengguna.
   - Jika stream gagal memuat, sistem otomatis memicu pemulihan error media (*recoverMediaError*) atau fallback ke HTML5 video native playback.
3. **Pemisahan Konten Dewasa (Privacy Vault):**
   - Saluran kategori 18+ tidak boleh muncul di daftar publik tab Live TV.
   - Wajib diisolasi ke dalam container terproteksi PIN 4-digit pribadi (`#vault-screen`).

---

## 4. Standar Navigasi 2D Spasial (D-Pad Remote)

- **Hierarki Vertikal Bertahap:**
  - Tab Navigasi Atas (`.nav-tab`) ⬇️
  - Bar Filter Sub-Kategori (`.subfilter-pill`) ⬇️
  - Baris Pertama Kartu (`.tv-card` Row 1) ⬇️
  - Baris Kedua Kartu (`.tv-card` Row 2)
- Saat pengguna berada di baris ke-2 dan menekan **D-Pad Atas (▲)**, fokus **HARUS** naik ke baris 1 di atasnya. DILARANG melompat langsung ke tab bar paling atas.
- Tombol **Back (Kembali)** pada remote TV harus memiliki fallback aman: menutup player video jika sedang menonton, atau mengembalikan fokus ke tab kategori aktif jika di menu utama.
