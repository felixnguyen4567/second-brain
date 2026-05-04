---
title: "AI Agent Skills Explained Simply"
type: source
source: https://medium.com/@tahirbalarabe2/ai-agent-skills-explained-simply-4010f6d9db92
author: "[[Tahir Balarabe]]"
published: 2026-04-25
created: 2026-05-04
description: "AI Agent Skills add procedural knowledge to LLMs via skill.md files. Open standard adopted by Claude Code and OpenAI."
tags: [ai-skills, skills-system, procedural-knowledge, llm, open-standard]
related_sources: [claude-skills-best, hermes-agent-documentation]
related_concepts: [AI-Skills, Skills-System, Procedural-Knowledge, MCP, RAG, Fine-Tuning]
related_entities: [Anthropic, OpenAI, Hermes-Agent, OpenClaw]
---

# AI Agent Skills Explained Simply

## Tóm tắt

Bài viết giải thích khái niệm **Agent Skills** — cách thêm procedural knowledge vào LLMs qua skill.md files. Skills là open standard tại [agentskills.io](https://agentskills.io/home), được adopt bởi Claude Code và OpenAI Codex.

## Vấn đề Skills giải quyết

LLMs biết facts nhưng **không biết làm procedures**. Ví dụ: LLMs có thể giải thích quantum mechanics nhưng không thể follow một 47-step workflow để generate financial report.

Hai lựa chọn không hiệu quả:
1. Spell out every step mỗi lần → defeats purpose of having agent
2. Agent guesses → defeats purpose of having process

## Skill là gì?

**Skill = một markdown file (`skill.md` trong một folder)**. Nó chứa:
- **YAML front matter**: `name` và `description` (bắt buộc)
- **Instructions**: step-by-step, rules, examples

### Optional additions
- `scripts/` — executable code (JS, Python, bash)
- `references/` — extra documentation
- `assets/` — templates, data files

## Progressive Disclosure (3 Tiers)

| Tier | What loads | When |
|------|-----------|------|
| 1 | Metadata (name + description) | Startup — few tokens per skill |
| 2 | Full instructions | Task matches skill description |
| 3 | Scripts, references, assets | Point of need |

Agent bắt đầu với lightweight index, pull details khi relevant.

## Skills vs Other Knowledge Methods

| Method | Gives you | Does | Doesn't do |
|--------|-----------|------|-----------|
| **MCP** | Tool access | Call external APIs | When to reach, what to do |
| **RAG** | Factual knowledge | Pull relevant chunks | Teach how to do something |
| **Fine-Tuning** | Baked knowledge | Make knowledge permanent | Stay cheap; redo if model changes |
| **Skills** | Procedural knowledge | Tell agent how to do, in what order, with what judgment | — |

## Cognitive Science Framework

| Human Memory | Maps to | Description |
|---|---|---|
| Semantic (facts) | RAG, knowledge bases | "Rome is capital of Italy" |
| Episodic (experiences) | Conversation logs | "I went to Rome last summer" |
| Procedural (skills) | **Skill files** | "How to ride a scooter in Rome" |

## The Trust Problem

Skills có thể include executable scripts với quyền truy cập file system, environment variables, API keys. **Audits đã tìm thấy publicly available skills chứa prompt injection, tool poisoning, hidden malware.** Treat skill installation như installing software dependencies — luôn review trước.

## The Open Standard

Format là open standard tại [agentskills.io](https://agentskills.io/home) (Apache 2.0 license). Adopted by:
- Claude Code
- OpenAI Codex
- Many other tools

Skill built cho một platform works trên bất kỳ platform nào support spec.

## Related Concepts

- [[concepts/AI-Skills]] — AI Skills overview
- [[concepts/Skills-System]] — System-level implementation
- [[concepts/MCP]] — Tool access (skills provide judgment for MCP)
- [[concepts/RAG]] — Factual knowledge (skills provide procedural knowledge)
- [[concepts/Procedural-Knowledge]] — Know-how vs know-that
- [[concepts/Progressive-Disclosure]] — Loading strategy for skills

## Related Entities

- [[entities/Anthropic]] — Behind Claude Code Skills
- [[entities/OpenAI]] — Behind OpenAI Codex Skills
- [[entities/Hermes-Agent]] — Has self-improving skill generation
- [[entities/OpenClaw]] — Has skills system