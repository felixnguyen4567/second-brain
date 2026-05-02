---
title: "AI Agents"
type: concept
created: 2026-05-02
updated: 2026-05-02
sources: [local-ai-agents-guide, deepseek-v4-preview]
tags: [AI-agents, automation, tools, reasoning]
---

# AI Agents

Systems where an LLM runs inference on your hardware, takes actions on your behalf, and maintains context across sessions — without sending data to external APIs.

## 5-Layer Architecture

```
┌─ Interface Layer (Web UI / CLI / IDE / Chat apps)
├─ Agent Framework (OpenClaw / LangGraph / CrewAI)
├─ Memory Layer (RAG / Mem0 / Session-scoped)
├─ LLM Layer (Ollama / llama.cpp / vLLM)
└─ Storage Layer (FAISS / Chroma / Qdrant)
```

## Key Characteristics

- **Reasoning:** Multi-step reasoning over single responses
- **Tool Use:** Calls external tools and APIs
- **Persistence:** Remembers context across sessions
- **Autonomy:** Completes tasks without continuous guidance

## Frameworks Compared

| Framework | Best For | Tradeoff |
|-----------|----------|----------|
| **OpenClaw** | File I/O heavy, tool-first | Not for complex multi-agent reasoning |
| **LangGraph** | Complex pipelines, traceability | Upfront state schema design |
| **CrewAI** | Multi-agent prototypes | Abstraction makes failures harder to debug |

## Agentic AI vs Basic Chat

| Aspect | Basic Chat | AI Agent |
|--------|------------|----------|
| Memory | Session-only | Persistent across sessions |
| Actions | Text only | Calls tools, writes files |
| Context | Resets each session | Builds over time |
| Use case | Q&A, brainstorming | Automation, coding, research |

## DeepSeek V4 Agentic Optimizations
- Integrated with Claude Code, **OpenClaw**, OpenCode
- Dual modes: Thinking (reasoning) and Non-Thinking (fast responses)

## Related
- [[concepts/Local-AI]] — Running agents locally
- [[concepts/Agentic-AI]] — Agentic AI concept
- [[concepts/Memory-Architecture]] — Memory for agents
- [[concepts/Skills-System]] — Reusable knowledge units
- [[entities/OpenClaw]] — Framework entity