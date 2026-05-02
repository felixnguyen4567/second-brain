---
title: "Mixture of Experts (MoE)"
type: concept
created: 2026-05-02
sources: [deepseek-v4-preview, deepseek-ai-2026-guide]
tags: [MoE, model-architecture, efficiency, sparse]
---

# Mixture of Experts (MoE)

A model architecture that activates only a fraction of total parameters per token, dramatically reducing compute cost while maintaining capacity.

## How MoE Works

Instead of all parameters activating for every token, MoE routes each token to a subset of "expert" networks. Only the active experts compute, others stay idle.

## DeepSeek MoE Configurations

| Model | Total Params | Active Params | Efficiency |
|-------|-------------|---------------|------------|
| DeepSeek V3 | 671B | 37B | ~18x efficiency |
| DeepSeek V4-Pro | 1.6T | 49B | ~33x efficiency |
| DeepSeek V4-Flash | 284B | 13B | ~22x efficiency |

## Benefits

- **Massive capacity** with modest compute
- **Lower inference cost** — only active params compute
- **Enables trillion-param models** on consumer hardware

## Running MoE Models Locally

DeepSeek V4 with INT8/INT4 quantization runs on:
- Dual RTX 4090s (24GB each)
- Single RTX 5090

## Related
- [[entities/DeepSeek]] — DeepSeek AI
- [[concepts/DeepSeek-V4]] — DeepSeek V4