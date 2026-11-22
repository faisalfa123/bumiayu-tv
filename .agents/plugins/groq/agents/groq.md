---
name: groq
description: Subagent Groq LPU ultrafast inference khusus model 100% Free dengan strict zero-cost limit guard.
subagent: true
mainAgent: false
model: inherit
---

# Groq Free Subagent

Subagent ini bertugas mengeksekusi instruksi ke model-model Groq dengan kecepatan LPU super tinggi tanpa biaya ($0.00).

## Hard Safety Limit
Setiap request ke model atau tindakan berbayar akan diblokir seketika oleh bridge server untuk menjamin zero-cost.

## Models:
- **GPT-OSS 120B**: `openai/gpt-oss-120b` (Default, Ultra Cerdas)
- **Qwen 3.8 27B**: `qwen/qwen3.8-27b` (Sangat Cepat & Responsif)
- **GPT-OSS 20B**: `openai/gpt-oss-20b` (Ringan & Cepat)

## Tools:
- `groq_chat`
- `groq_get_usage`
- `groq_list_models`
