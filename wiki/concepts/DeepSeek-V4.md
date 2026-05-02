---
title: "DeepSeek V4"
type: concept
created: 2026-05-02
updated: 2026-05-02
sources: [deepseek-v4-preview, deepseek-ai-2026-guide]
tags: [LLM, multimodal, MoE, 1M-context, reasoning]
---

# DeepSeek V4

Flagship model from [[DeepSeek]] released April 2026, featuring breakthrough architecture for cost-effective frontier AI.

## Variants

| Model | Total Params | Active Params | Target Use |
|-------|-------------|---------------|------------|
| V4-Pro | 1.6T | 49B (MoE) | Flagship, top performance |
| V4-Flash | 284B | 13B (MoE) | Fast, economical API |

## Key Specs

- **Context:** 1M tokens (default across all DeepSeek services)
- **Multimodal:** Native — text, images, video, audio from scratch
- **Benchmark:** >80% SWE-bench Verified, ~90% HumanEval
- **Pricing:** $0.14–0.30/M input, $0.28–0.50/M output (10-50x cheaper than GPT-5.4/Claude Opus 4.5)
- **Running Locally:** Dual RTX 4090s or single RTX 5090

## Architecture Innovations

### Engram Conditional Memory
- Decouples static facts (API signatures, patterns) from dynamic reasoning
- Needle-in-a-Haystack: 84.2% → **97%** accuracy on 1M token retrieval

### Manifold-Constrained Hyper-Connections (mHC)
- Constrains signal amplification to <2x (vs unconstrained 3000x)
- Only **6.7% computational overhead** for stable 1T model training

### DeepSeek Sparse Attention (DSA) + Lightning Indexer
- Token-wise compression + sparse attention
- ~50% compute reduction for long-context scenarios

## Agentic Integration
- Integrated with Claude Code, **OpenClaw**, and OpenCode
- Already driving in-house agentic coding at DeepSeek
- Dual modes: **Thinking** and **Non-Thinking**

## API Compatibility
- OpenAI ChatCompletions API compatible
- Anthropic API compatible
- Legacy models (`deepseek-chat`, `deepseek-reasoner`) retired Jul 24, 2026

## Related
- [[entities/DeepSeek]] — DeepSeek AI entity
- [[concepts/Mixture-of-Experts]] — MoE architecture
- [[concepts/Local-AI]] — Running locally
- [[concepts/Agentic-AI]] — Agentic capabilities
- [[concepts/Reasoning-Models]] — Thinking/reasoning modes