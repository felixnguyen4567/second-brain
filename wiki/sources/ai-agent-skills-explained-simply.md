---
title: "AI Agent Skills Explained Simply"
source: "https://medium.com/@tahirbalarabe2/ai-agent-skills-explained-simply-4010f6d9db92"
author:
  - "Tahir Balarabe"
published: 2026-04-25
created: 2026-05-04
description: "Explains AI Agent Skills as modular, filesystem-based procedural knowledge units for LLMs. Covers the skill.md format, progressive disclosure, and how skills compare to MCP, RAG, and fine-tuning."
tags:
  - "clippings"
  - "AI-skills"
  - "agentic-ai"
  - "procedural-knowledge"
---

# AI Agent Skills Explained Simply

## Summary

AI Agent Skills solve the **procedural knowledge gap** in LLMs. While LLMs know facts (semantic memory), they lack step-by-step workflows (procedural memory). Skills are filesystem-based markdown files (`skill.md`) that teach agents how to execute repeatable processes. The format is an open standard at [[https://agentskills.io](https://agentskills.io/home)] (Apache 2.0), adopted by Claude Code and OpenAI Codex.

## Core Concepts

### What Is a Skill?

A skill is a folder containing a `skill.md` file with:
- **YAML frontmatter**: `name` (identifier) + `description` (trigger condition)
- **Instructions**: Step-by-step markdown guidance
- **Optional**: `scripts/`, `references/`, `assets/` subfolders

### Three-Tier Progressive Disclosure

| Tier | What Loads | Tokens/Skill |
|------|-----------|--------------|
| Metadata | Name + description only | ~few tokens |
| Full instructions | Complete `skill.md` | Full file |
| Resources | Scripts, references, assets | At point of need |

### Skills vs Other Knowledge Methods

- **MCP**: Tool access (capability), not judgment (when/how)
- **RAG**: Factual reference material, not procedural steps
- **Fine-tuning**: Baked into weights, expensive to update when model changes
- **Skills**: Files. Version-controlled. Portable. Update without retraining.

### Cognitive Science Mapping

| Human Memory | AI Implementation |
|--------------|-------------------|
| Semantic (facts) | RAG / knowledge bases |
| Episodic (experiences) | Conversation logs |
| Procedural (skills) | Skill files |

## The Trust Problem

Skills can include executable scripts with access to:
- File system
- Environment variables
- API keys

Publicly available skills have been found containing:
- Prompt injection
- Tool poisoning
- Hidden malware

**Warning**: Treat skill installation like installing software dependencies — always review before use.

## Key Commands / Structure

```
skill-folder/
├── skill.md          # Mandatory: name, description, instructions
├── scripts/          # Optional: JS, Python, bash executables
├── references/       # Optional: extra documentation
└── assets/           # Optional: templates, data files
```

## Adoption

- **Claude Code** — native skills support
- **OpenAI Codex** — native skills support
- **agentskills.io** — open standard registry (Apache 2.0)

## Related Concepts

- [[concepts/skills-system]] — Reusable codified knowledge units in AI agents
- [[concepts/Procedural-Knowledge]] — Know-how vs know-that distinction
- [[concepts/MCP]] — Model Context Protocol (complementary, not competing)
- [[concepts/RAG]] — Factual retrieval (skills' counterpart for facts)

## Entities

- [[entities/Anthropic]] — Behind Claude Code skills platform
- [[entities/OpenAI]] — Behind Codex skills platform
