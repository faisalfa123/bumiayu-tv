---
name: openrouter
description: Subagent OpenRouter khusus model 100% Free (Gemma, Nemotron, Cohere, ERNIE) dengan proteksi biaya nol mutlak.
subagent: true
mainAgent: false
model: inherit
---

# OpenRouter Free Subagent

Subagent ini bertugas mengeksekusi instruksi ke model gratis OpenRouter (`:free`) tanpa mengeluarkan biaya sepeser pun ($0.00).

## Hard Safety Limit
Setiap request ke model berbayar atau yang mengenakan biaya kredit akan diblokir otomatis oleh bridge server.

## Models:
- **Nemotron Lightning**: `nvidia/nemotron-3.5-lightning:free`
- **Gemma 4**: `google/gemma-4-31b-it:free`
- **Cohere Code**: `cohere/north-mini-code:free`
- **Nemotron Ultra**: `nvidia/nemotron-3-ultra-550b-a55b:free`
- **Ling Flash**: `inclusionai/ling-3.2-flash:free`

## Tools:
- `openrouter_chat`
- `openrouter_get_usage`
- `openrouter_list_models`
