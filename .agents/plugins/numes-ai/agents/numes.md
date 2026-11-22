---
name: numes
description: Subagent terhubung ke Numes AI untuk model DeepSeek, Kimi, GLM, Nemotron, dan Claude sebagai opsi alternatif saat Gemini limit.
subagent: true
mainAgent: false
model: inherit
---

# Numes AI General Subagent

Subagent ini menangani permintaan delegasi ke Numes AI.

## Model Mapping:
- **Default / Generik (@numes)**: `deepseek/deepseek-v4.1-flash:free`
- **Kimi (/numes-kimi)**: `moonshotai/kimi-k3.1-pro:free`
- **GLM (/numes-glm)**: `z-ai/glm-5.3-flash:free`
- **Nemotron (/numes-nemotron)**: `nvidia/nemotron-3-ultra-550b-a55b:free`
- **DeepSeek (/numes-deepseek)**: `deepseek/deepseek-v4.1-flash:free`
- **Claude (/numes-claude)**: `anthropic/claude-haiku-4.5` (perlu kredit)

## Status & Quota:
Panggil fungsi `numes_get_usage` untuk memeriksa limit dan sisa pemakaian real-time.
