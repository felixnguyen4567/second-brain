---
title: "DeepSeek AI"
type: entity
created: 2026-05-02
updated: 2026-05-02
sources: [deepseek-v4-preview, deepseek-ai-2026-guide]
tags: [AI-lab, company, reasoning, open-source]
---

# DeepSeek AI

Chinese AI lab that shocked the world in early 2026 with competitive open-source models at dramatically lower prices. Headquartered in China.

## Key Models

### DeepSeek R1
- Reasoning model, open-source weights
- Competitive with OpenAI o1
- January 2026 release

### DeepSeek V3
- 671B total params / 37B active (MoE)
- 128K context
- ~85% HumanEval

### DeepSeek V4 (April 2026)
- **V4-Pro:** 1.6T total / 49B active (MoE) — flagship
- **V4-Flash:** 284B total / 13B active — fast/economical
- 1M token context (default across all services)
- Native multimodal (text, images, video, audio)
- **Pricing: 10-50x cheaper** than GPT-5.4 / Claude Opus 4.5
- Open-source weights under Apache 2.0 (expected)
- Runnable locally on dual RTX 4090s or single RTX 5090

## Architectural Innovations

1. **Engram Conditional Memory** — 97% accuracy on 1M token retrieval (vs 84.2% standard)
2. **mHC (Manifold-Constrained Hyper-Connections)** — Stable training with 6.7% overhead
3. **DSA (DeepSeek Sparse Attention)** — ~50% compute reduction for long context

## API
- Compatible with OpenAI ChatCompletions and Anthropic APIs
- Keep `base_url`, just update model to `deepseek-v4-pro` or `deepseek-v4-flash`
- `deepseek-chat` and `deepseek-reasoner` retired after Jul 24, 2026

## Hardware Context
- Trained on Nvidia H800s (initial training)
- Optimized for **Huawei Ascend 950PR** and **Cambricon MLU** (US export restrictions)
- Ascend 950PR delivers 2.87x compute vs Nvidia H20

## Related
- [[entities/OpenAI]] — Primary competitor
- [[entities/Anthropic]] — Competitor (Claude)
- [[concepts/DeepSeek-V4]] — V4 concept
- [[concepts/Mixture-of-Experts]] — MoE architecture
- [[concepts/Local-AI]] — Running models locally