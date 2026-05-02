---
title: "Ollama"
type: entity
created: 2026-05-02
updated: 2026-05-02
sources: [local-ai-agents-guide]
tags: [tool, local-ai, inference, openai-compatible]
---

# Ollama

Local inference server that provides an OpenAI-compatible API running on localhost. The easiest entry point into local AI with one-command install and model pull.

## Key Features

- **One-command install + model pull** → OpenAI-compatible API on localhost
- Built-in model management, quantization selection, context window handling
- No daemon or HTTP layer needed (vs llama.cpp which is even lower level)
- Works with qwen3:8b model (fits in 8GB VRAM, reliable JSON output)

## Best Practices

### Disable Thinking Mode for JSON Reliability
Ollama wraps output in `<think>…</think>` blocks which breaks JSON parsers:

```python
_orig_ollama_chat = ollama.chat
def _no_think_chat(*args, **kwargs):
    opts = kwargs.get("options") or {}
    if isinstance(opts, dict):
        opts.setdefault("think", False)
        kwargs["options"] = opts
    return _orig_ollama_chat(*args, **kwargs)
ollama.chat = _no_think_chat
```

### Recommended Models
- **qwen3:8b** — reliable JSON, clean code gen, fits 8GB VRAM
- **nomic-embed-text** — for embeddings (768 dims)

## Limitations
- Not designed for production traffic
- Better suited for personal assistant or developer tool use cases
- For scale/production: use vLLM instead

## Related
- [[concepts/Local-AI]] — Local AI concept
- [[entities/DeepSeek]] — Models available on Ollama
- [[concepts/AI-Agents]] — Building agents on top of Ollama
- [[sources/local-ai-agents-guide]] — Full guide