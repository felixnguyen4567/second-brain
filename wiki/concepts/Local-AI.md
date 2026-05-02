---
title: "Local AI"
type: concept
created: 2026-05-02
updated: 2026-05-02
sources: [local-ai-agents-guide, deepseek-v4-preview]
tags: [local-ai, privacy, offline, self-hosted]
---

# Local AI

AI models that run entirely on your own hardware without sending data to external APIs. Offers privacy, no API costs, and offline capability.

## Why Local AI

| Benefit | Description |
|---------|-------------|
| **Privacy** | Data never leaves your machine |
| **No API Costs** | Pay once for hardware, use unlimited |
| **Offline** | Works without internet connection |
| **Control** | Full control over model and configuration |

## Recommended Stack

### LLM Layer
- **Ollama** — Easiest setup, OpenAI-compatible API
- **qwen3:8b** — Reliable JSON, fits 8GB VRAM
- **nomic-embed-text** — 768-dim embeddings

### Memory Layer
- **Mem0** — Structured persistent memory with fact extraction
- Filters what gets stored for retrieval quality

### Storage Layer
- **Chroma** — Zero infra, auto-persist to local dir
- **Qdrant** — Proper service, scales to millions of vectors

### Framework
- **OpenClaw** — Tool-first, filesystem-native
- **LangGraph** — State graph for complex pipelines

## Running DeepSeek Locally
- DeepSeek V4 (INT8/INT4 quantized) fits on dual RTX 4090s or single RTX 5090
- Ollama supports DeepSeek models

## Key Insight
> "A modest local model with a well-designed persistent memory layer consistently outperforms a larger model that starts every session from scratch." — Aashi Dutt

## Related
- [[entities/Ollama]] — Local inference server
- [[entities/DeepSeek]] — Models available locally
- [[concepts/AI-Agents]] — Building agents on local AI
- [[concepts/Memory-Architecture]] — Persistent memory systems