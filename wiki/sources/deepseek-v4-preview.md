---
title: "DeepSeek V4 Preview Release"
source: "https://api-docs.deepseek.com/news/news260424"
author:
  - DeepSeek AI
published: 2026-04-24
created: 2026-05-02
description: "DeepSeek-V4 officially released with Pro (1.6T/49B) and Flash (284B/13B) variants. Native 1M context, agentic optimizations, OpenAI/Anthropic API compatible."
tags:
  - clippings
  - deepseek
  - llm
  - multimodal
---

# DeepSeek V4 Preview Release

DeepSeek-V4 Preview chính thức được release và open-source ngày 24/04/2026. Đây là bản xem trước của flagship model với hai biến thể chính.

## Hai Phiên Bản

### DeepSeek-V4-Pro
- **Tổng params:** 1.6T | **Active params:** 49B (MoE)
- Hiệu năng ngang hàng với các top closed-source models thế giới
- Enhanced Agentic Capabilities — Open-source SOTA trên Agentic Coding benchmarks
- Rich World Knowledge — Dẫn đầu mọi open models, chỉ sau Gemini-3.1-Pro
- World-Class Reasoning — Beat mọi open models về Math/STEM/Coding

### DeepSeek-V4-Flash
- **Tổng params:** 284B | **Active params:** 13B (MoE)
- Reasoning gần ngang V4-Pro
- Fast, efficient, economical choice cho API usage

## Điểm Nổi Bật Kỹ Thuật

### Cấu trúc Novel Attention
- Token-wise compression + DSA (DeepSeek Sparse Attention)
- Giảm ~50% compute cho long-context scenarios

### 1M Context là Standard
- 1M token context là default trên mọi official DeepSeek services
- Cả hai model đều support dual modes: Thinking / Non-Thinking

### Agentic Optimizations
- Được tích hợp sẵn với Claude Code, OpenClaw & OpenCode
- Đang được dùng in-house tại DeepSeek cho agentic coding

## API Compatibility
- Giữ nguyên `base_url`, chỉ cần đổi model sang `deepseek-v4-pro` hoặc `deepseek-v4-flash`
- Hỗ trợ **OpenAI ChatCompletions** và **Anthropic APIs**
- `deepseek-chat` và `deepseek-reasoner` sẽ ngừng hoạt động sau **Jul 24th, 2026, 15:59 UTC**

## Links
- Tech Report: https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro/blob/main/DeepSeek_V4.pdf
- Open Weights: https://huggingface.co/collections/deepseek-ai/deepseek-v4

## Related
- [[sources/deepseek-ai-2026-guide]] — Comprehensive guide (DeepSeek Fan Site)
- [[entities/DeepSeek]] — DeepSeek AI entity
- [[concepts/DeepSeek-V4]] — DeepSeek V4 concept
- [[concepts/Mixture-of-Experts]] — MoE architecture concept
- [[entities/OpenAI]] — Competitor
- [[entities/Anthropic]] — Competitor