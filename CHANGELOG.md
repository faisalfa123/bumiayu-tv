# Changelog - Bumiayu TV Launcher

All notable changes to the Bumiayu TV Launcher project are documented in this file.

The versioning format follows our project SOP defined in `VERSIONING_RULES.md`:
- **Format 3-Angka:** `Main.Beta.NightlyDev` (`X.Y.Z`)
- **Perbaikan Bug:** Dicatat di versi berjalan tanpa menaikkan nomor versi.
- **Penambahan Fitur / Modifikasi:** Menaikkan nomor versi ke `Nightly Dev` (`Z` naik) kecuali secara eksplisit diminta rilis Stabil/Beta.

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
