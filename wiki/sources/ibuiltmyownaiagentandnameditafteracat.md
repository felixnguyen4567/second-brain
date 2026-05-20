---
title: "I Built My Own AI Agent and Named It After a Cat"
source: "https://medium.com/@sausheong/i-built-my-own-ai-agent-and-named-it-after-a-cat-471b456dc26c"
author:
  - "[[Sau Sheong]]"
published: 2026-05-03
created: 2026-05-20
description: "Felix is a self-sufficient, locally-run AI agent built by Sau Sheong. Runs entirely on-device with Gemma4 via Ollama, JSONL session storage, Markdown memory files, and an MCP-connected tool architecture. Key design: everything-is-a-tool, index pattern, bounded failure, long-running process contract."
tags:
  - "clippings"
  - "local-ai"
  - "ai-agents"
  - "openclaw"
---

*Felix is a self-sufficient, locally-run AI agent I made for myself. Here's the design behind it*

## Summary

Sau Sheong built **Felix**, a personal AI agent named after a cat (deliberately non-threatening vs "claw" tools). Runs entirely on-device — one binary, one state directory (`~/.felix/`), optional local Gemma4 via bundled Ollama, zero cloud dependency once model is downloaded. Architecture key: **everything-is-a-tool** (all capabilities go through one permissioned tool interface), **index pattern** (inject lightweight index instead of full memories/skills per turn — cuts 5–15KB speculative context), **bounded failure** (per-call timeouts, circuit breakers for MCP, session self-healing), **long-running process contract** (live config hot-reload without restart).

Supports multi-agent per install, sub-agent delegation (e.g. Claude Sonnet planner → local Gemma4 executor), Cortex knowledge graph for cross-session memory, OpenTelemetry traces. Security defaults: localhost-only, bash allowlist, internal network blocking, workspace-contained file access.

Felix is written in Go. GitHub: `sausheong/felix`.

## Key Entities

- [[Felix-AI-Agent]] — The agent itself: self-sufficient, on-device, Go binary
- [[Sau-Sheong]] — Author, built Felix for personal research/writing/organising tasks
- [[OpenClaw]] — Referenced as "the obvious answer" but built differently; both local, both agentic
- [[Gemma-4]] — Default local model (9.6GB) bundled with Felix via Ollama
- [[Cortex]] — Local knowledge graph library; recalls entities/relationships from past conversations
- [[MCP]] — Model Context Protocol; external tool server interface used by Felix

## Key Concepts

- [[Local-AI]] — Runs entirely on-device, no API key, no internet required after initial model download
- [[everything-is-a-tool]] — Single unified tool interface for all capabilities (built-in + MCP); one permission check, one audit trail
- [[Index-Pattern]] — Inject lightweight availability index instead of full content on every turn; model calls tool to load on demand; saves 5–15KB/prompt, enables token cache reuse
- [[Bounded-Failure]] — Per-call timeouts, session self-healing, per-server circuit breakers for MCP; prevents token-burning self-repair loops
- [[Knowledge-Graph-Memory]] — Cortex extracts entities/relationships per session; surfaces relevant context in future conversations
- [[Long-Running-Process-Contract]] — Live config hot-reload without restart; API key changes take effect on next message

## Why This Matters for Bear / Cognify Tech

Felix is the clearest published architecture showing what "local-first AI agent" actually looks like in production. The index pattern is directly applicable to OpenClaw skill/memory loading. The everything-is-a-tool model validates OpenClaw's tool architecture. The bounded-failure design is a gold standard for agent reliability. Felix shows that local AI agents can be genuinely self-sufficient — no cloud dependency, portable state, observable — directly relevant to Cognify Tech's SME positioning.