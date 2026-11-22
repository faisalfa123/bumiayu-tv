---
name: numes-ai
description: Integrasi Numes AI sebagai model AI alternatif saat Google Gemini mengalami limit atau untuk second-opinion, serta cek kuota dan usage real-time.
---

# Numes AI Skill

Gunakan skill ini ketika pengguna ingin bertanya ke model AI Numes (seperti DeepSeek, Claude, GLM, Kimi), ingin mengecek limit/pemakaian kuota API, atau ketika model utama Gemini terkena batas limit (rate limit/quota).

## Perintah & Penggunaan

1. **Cek Penggunaan dan Sisa Kuota API**:
   - Jalankan tool `numes_get_usage` atau script `C:\Users\user\.gemini\antigravity\numes-bridge\server.py`.
2. **Chat ke Model AI Tambahan**:
   - Panggil tool `numes_chat` dengan model pilihan (default: `deepseek/deepseek-v4.1-flash:free`).
   - Tersedia model-model free tanpa biaya kredit serta model premium.
