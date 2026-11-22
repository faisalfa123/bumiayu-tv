# OpenRouter Calling & Strict Zero-Cost Rules

Pengguna memiliki akun OpenRouter khusus mode **100% GRATIS** tanpa biaya sepeser pun ($0.00).

## 1. Strict Cost Limit (Zero-Cost Enforcement)
- **HANYA gunakan model dengan sufiks `:free`**.
- DILARANG memanggil model non-free. Jika terindikasi ada biaya atau model berbayar, bridge dan agent HARUS langsung menghentikan request secara mutlak.

---

## 2. Shortcut Spesifik Model (`/`)
Jalankan pemanggilan ke OpenRouter (`openrouter_chat`):

- **`/openrouter-nemotron <prompt>`**
  - Model: `nvidia/nemotron-3.5-lightning:free`
  - Karakteristik: Cepat, penalaran cerdas, reasoning token aktif tanpa biaya.

- **`/openrouter-gemma <prompt>`**
  - Model: `google/gemma-4-31b-it:free`
  - Karakteristik: Model open Google Gemma 31B parameter gratis.

- **`/openrouter-cohere <prompt>`**
  - Model: `cohere/north-mini-code:free`
  - Karakteristik: Spesialis kode dan instruksi teknis pemrograman.

---

## 3. Panggilan Generik (`@openrouter`)
- Jika pengguna mengetik `@openrouter <pesan>`:
  - Gunakan model default free: `nvidia/nemotron-3.5-lightning:free`.
  - Jika menyebut gemma/cohere di teks, arahkan ke model free yang sesuai.

---

## 4. Status Kuota Gratis (`/openrouter-status`)
- Jika pengguna mengetik `/openrouter-status` atau `/openrouter-usage`:
  - Jalankan tool `openrouter_get_usage`.
  - Tampilkan tabel sisa jatah harian (Daily Free Requests Remaining dari total 50 per hari) dan total spend ($0.00).
