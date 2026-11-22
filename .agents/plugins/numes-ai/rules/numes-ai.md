# Numes AI Calling & Model Routing Rules

Ketika pengguna memanggil Numes AI melalui slash command `/`, jalankan model spesifik sesuai daftar berikut:

---

## 9 Model Numes Gratis (Sesuai Dashboard Numes AI):

1. **`/numes-deepseek-flash <prompt>`**
   - Target: `deepseek/deepseek-v4.1-flash:free`
   - Kecepatan: 152.8 tok/s (Tercepat)

2. **`/numes-deepseek-uncensored <prompt>`**
   - Target: `dealignai/deepseek-v4.1-flash-uncensored-fp8:free`
   - FP8 Uncensored

3. **`/numes-kimi-pro <prompt>`**
   - Target: `moonshotai/kimi-k3.1-pro:free`
   - Penalaran & context panjang

4. **`/numes-kimi-abliterated <prompt>`**
   - Target: `uniboshi/kimi-k3-abliterated-v1:free`
   - Unrestricted / Abliterated

5. **`/numes-glm-flash <prompt>`**
   - Target: `z-ai/glm-5.3-flash:free`
   - Model Flash ringan & responsif

6. **`/numes-glm-flash-uncensored <prompt>`**
   - Target: `dealignai/glm-5.3-flash-uncensored-fp8:free`
   - Flash Uncensored FP8

7. **`/numes-glm-standard <prompt>`**
   - Target: `z-ai/glm-5.3:free`
   - Model GLM 5.3 Full (74.2 tok/s)

8. **`/numes-glm-uncensored <prompt>`**
   - Target: `dealignai/glm-5.3-uncensored-fp8:free`
   - GLM 5.3 Uncensored FP8

9. **`/numes-nemotron-ultra <prompt>`**
   - Target: `nvidia/nemotron-3-ultra-550b-a55b:free`
   - NVIDIA Ultra Scale (129.5 tok/s, Availability 98.8%)

---

## Cek Status & Quota:
- **`/numes-status`** &rarr; Menampilkan sisa limit harian dan total usage secara real-time.
