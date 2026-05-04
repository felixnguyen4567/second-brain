---
title: "CLI Tools"
type: concept
tags: [cli-tools, developer-tools, terminal, productivity, ai-agents]
related_sources: [10-must-have-clis-ai-agents-2026]
related_concepts: [MCP, Terminal-Productivity, Agentic-AI, Local-AI]
created: 2026-05-04
---

# CLI Tools

Command-Line Interface tools là các chương trình chạy trong terminal/command prompt, thay thế các thao tác GUI bằng commands có thể script và tự động hóa hoàn toàn.

## Tại sao CLI quan trọng với AI Agents

### The 2025-2026 Shift
AI coding agent trend đã tạo second-order effect: nếu AI coding assistant sống trong terminal, tại sao mọi thứ khác không làm vậy? Mỗi developer tool company lớn đã ship hoặc update CLI trong 2025-2026.

### Key Advantages
- **Không có schema injection overhead** — model chạy command, nhận output, done
- **Language models đã train trên millions of shell scripts** — biết cách chain commands tự nhiên qua Unix pipes, CLI usage patterns
- **Token efficiency**: 10-32x cheaper so với MCP
- **Reliability**: ~100% so với MCP ~72%

### MCP Overhead Problem
MCP dumps entire schema vào context window. Stack 3-4 MCP servers = 150K tokens overhead trước khi làm bất cứ điều gì hữu ích. Anthropic internal research: shell scripting thay vì MCP tools giảm token usage 98.7%.

## Common CLI Tools for AI Agents

| Tool | Purpose |
|------|---------|
| `gh` | GitHub repository management |
| Stripe CLI | Payment testing, webhook forwarding |
| Supabase CLI | Local Postgres stack |
| Valyu CLI | Specialized data (SEC, PubMed, FRED) |
| PostHog CLI | Analytics setup |
| ElevenLabs CLI | TTS/STT/Voice cloning |
| Ramp CLI | Financial operations |
| Vercel CLI | Deployment |

## Khi nào dùng CLI thay vì MCP

**Dùng CLI khi:**
- Local development và testing
- Deployment và infrastructure management
- Data access (SEC filings, research data)
- Financial operations
- Developer-facing workflows

**Dùng MCP khi:**
- Enterprise deployments với OAuth 2.1
- Multi-tenant auth requirements
- Compliance requirements
- Services không có CLI (Notion, Figma, Airtable)

## Related Concepts

- [[MCP]] — Model Context Protocol (alternative approach)
- [[Terminal-Productivity]] — Productivity in terminal environments
- [[Agentic-AI]] — AI agents using tools
- [[Local-AI]] — Running AI locally