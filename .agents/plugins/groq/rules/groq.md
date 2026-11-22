# Groq Calling & Strict Zero-Cost Rules

Pengguna menggunakan Groq Cloud khusus mode **100% GRATIS** tanpa biaya ($0.00).

## 1. Strict Zero-Cost Guard
- Jika ada indikasi error `402 Payment Required` atau permintaan biaya kredit, bridge dan agent HARUS seketika menghentikan eksekusi tanpa kompromi.

---

## 2. Shortcut Spesifik Model (`/`)
Jalankan pemanggilan ke Groq (`groq_chat`):

- **`/groq-gpt-120b <prompt>`**
  - Model: `openai/gpt-oss-120b`
  - Karakteristik: Model parameter besar (120B), penalaran mendalam dan sangat cerdas pada LPU.

- **`/groq-qwen <prompt>`**
  - Model: `qwen/qwen3.8-27b`
  - Karakteristik: Model Qwen 3.8 27B parameter, sangat cepat dan efisien.

- **`/groq-gpt-20b <prompt>`**
  - Model: `openai/gpt-oss-20b`
  - Karakteristik: Model ringan untuk respon instan.

---

## 3. Panggilan Generik (`@groq`)
- Jika pengguna mengetik `@groq <pesan>`:
  - Gunakan model default gratis: `openai/gpt-oss-120b`.
  - Jika pengguna menyebut qwen / gpt-20b, otomatis arahkan ke model terkait.

---

## 4. Status Kuota & Kecepatan (`/groq-status`)
- Jika pengguna mengetik `/groq-status` atau `/groq-usage`:
  - Jalankan tool `groq_get_usage`.
  - Tampilkan rincian sisa kuota request (Remaining Requests dari batas 1000/hari) dan konfirmasi biaya $0.00.
