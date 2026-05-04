---
title: "Model Context Protocol (MCP)"
type: concept
tags: [MCP, AI-agents, tool-calling, protocol, schema-injection]
related_sources: [10-must-have-clis-ai-agents-2026, ai-agent-skills-explained-simply]
related_concepts: [CLI-Tools, AI-Skills]
related_entities: [Anthropic]
created: 2026-05-04
---

# Model Context Protocol (MCP)

Anthropic's open protocol (late 2024) for connecting AI agents to external tools and services. Provides a universal standard for tool definitions via structured JSON schemas injected into the model's context window.

## How MCP Works

1. Client connects to MCP server
2. Server exposes tools with full schema (name, parameters, descriptions, auth)
3. Schema is injected into LLM context window at session start
4. LLM calls tools via structured requests
5. MCP client routes requests to servers, returns results

## The Overhead Problem

**Critical issue**: MCP dumps its **entire schema** into the context window. Every tool definition, parameter description, and auth flow loads before a single task runs.

- 1 MCP server: ~50K tokens overhead
- 3–4 stacked MCP servers: **150K+ tokens** before any useful work
- This overhead is paid on every new session

## Benchmarks: CLI vs MCP (2026)

A study ran 75 comparative tests between MCP-based and CLI-based agents:

| Metric | CLI Agents | MCP Agents |
|--------|-----------|------------|
| Token cost | Baseline | 10–32x higher |
| Reliability | ~100% | ~72% |
| Anthropic finding | 98.7% token reduction using shell scripts vs MCP tools |

**Perplexity** publicly pulled MCP support from their agent architecture, citing token overhead and reliability failures.

## When MCP Is Still the Right Tool

MCP remains valuable for:
- Enterprise deployments with **OAuth 2.1 requirements**
- **Multi-tenant auth** architectures
- **Compliance/audit** requirements
- Services with **no CLI available** (Notion, Figma, Airtable)
- Complex enterprise integrations requiring standardized tool definitions

## Skills + MCP: Complementary

Skills (procedural knowledge) and MCP (tool capability) work together:
- **MCP** provides the *capability* to invoke something externally
- **Skills** provide the *judgment* for when and how to use it

## Related Concepts

- [[concepts/CLI-Tools]] — The more efficient alternative for most developer tasks
- [[concepts/AI-Skills]] — Procedural knowledge for agent judgment
- [[concepts/agentic-ai]] — Agent architectures that use tools
