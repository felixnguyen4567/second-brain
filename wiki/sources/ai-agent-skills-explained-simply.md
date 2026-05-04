---
title: "AI Agent Skills Explained Simply"
source: "https://medium.com/@tahirbalarabe2/ai-agent-skills-explained-simply-4010f6d9db92"
author:
  - "[[Tahir]]"
published: 2026-04-25
created: 2026-05-04
description: "AI agent skills add procedural knowledge to LLMs via skill.md files. Learn the open standard adopted by Claude Code and OpenAI."
tags:
  - "clippings"
  - "AI-Agents"
  - "AI-Skills"
---

## Tóm tắt

AI Agent Skills là modular capabilities mở rộng LLM bằng cách thêm procedural knowledge qua file `skill.md`. Đây là open standard được adopt bởi Claude Code và OpenAI Codex.

## Key Concepts

### Vấn đề của Agent
- LLMs biết facts nhưng không có procedural knowledge
- Khi cần workflow 47 bước, agent phải đoán hoặc được chỉ định từng bước — cả hai đều không hiệu quả

### Agent Skill là gì?
- File markdown (`skill.md`) trong một folder
- Chứa YAML frontmatter với `name` và `description`
- Hướng dẫn step-by-step cho agent

### Cấu trúc Skill
```
/skill-folder/
  skill.md      # Mandatory: name + description + instructions
  /scripts/     # Optional: JS, Python, bash
  /references/ # Optional: documentation
  /assets/      # Optional: templates, data
```

### Progressive Disclosure (3 Tiers)
1. **Tier 1:** Chỉ load metadata (name + description) — vài tokens mỗi skill
2. **Tier 2:** Khi trigger match → load full instructions
3. **Tier 3:** Scripts/assets chỉ load khi cần

### So sánh với các phương pháp khác

| Phương pháp | Cho gì | Làm gì | Không làm gì |
|---|---|---|---|
| **MCP** | Tool access | Gọi external APIs | Khi nào/dùng thế nào |
| **RAG** | Factual knowledge | Pull chunks từ DB | Dạy agent làm gì |
| **Fine Tuning** | Knowledge trong weights | Làm knowledge vĩnh viễn | Rẻ khi model đổi |
| **Skills** | Procedural knowledge | Step-by-step workflow | — |

### Open Standard
- Spec: [agentskills.io](https://agentskills.io) (Apache 2.0)
- Adopted bởi: Claude Code, OpenAI Codex

### Trust Problem
Skills có thể chạy script với quyền trên filesystem, env vars, API keys. Đã từng có malware trong public skills — cần review trước khi install.

## Liên quan

- [[AI-Skills]]
- [[Claude]]
- [[MCP]]
- [[AI-Agents]]
