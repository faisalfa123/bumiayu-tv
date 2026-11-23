# Aturan Versioning Proyek Bumiayu TV Launcher

Dokumen ini merupakan aturan resmi (*Standard Operating Procedure*) untuk penomoran versi dan siklus rilis proyek Bumiayu TV Launcher.

---

## 1. Format Penomoran Versi

Format penomoran versi menggunakan skema 3-angka: **`X.Y.Z`**

- **`X` (Angka Pertama) — Versi Utama (Main Release):**  
  Berubah hanya ketika terjadi perombakan arsitektur besar-besaran, pergantian platform, atau perubahan fundamental pada launcher.
- **`Y` (Angka Kedua) — Versi Beta (Feature Testing):**  
  Digunakan saat penambahan fitur besar yang sedang dalam tahap uji coba pra-stabil.
- **`Z` (Angka Ketiga) — Versi Nightly Dev (Pengembangan Aktif):**  
  Digunakan untuk setiap penambahan fitur, perubahan antarmuka, atau permintaan modifikasi yang diminta pengguna.

---

## 2. Ketentuan Perubahan Versi

1. **Perbaikan Bug (Bug Fix):**
   - Jika pengguna meminta perbaikan bug pada versi yang sedang berjalan, **nomor versi TIDAK berubah**.
   - Perbaikan dicatat sebagai entri *Patch/Fix* di dalam versi tersebut pada `CHANGELOG.md` dan commit Git.

2. **Penambahan Fitur / Modifikasi:**
   - Setiap permintaan penambahan fitur baru, pengubahan layout antarmuka, atau perubahan fungsi non-bug otomatis **menaikkan nomor versi**.
   - Jika pengguna tidak secara spesifik menyebutkan ingin merilis versi "Stabil" atau "Beta", versi otomatis masuk ke **Nightly Dev** (angka `Z` naik).

3. **Status Milestone Saat Ini:**
   - **`v2.0.0`**: Ditetapkan sebagai **Stable Release** (Fondasi arsitektur Google TV Modern & 2D D-Pad).
   - **`v2.0.1 Nightly Dev`**: Versi aktif saat ini (Perombakan visual Cinematic Poster, TizenTube sebagai default, penambahan channel TV nasional, dan logo baru Flat Cyan-Obsidian).
