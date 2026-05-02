---
title: "NousResearch/hermes-agent: The agent that grows with you"
source: https://github.com/NousResearch/hermes-agent
author: Nous Research
created: 2026-05-02
description: "GitHub repository for Hermes Agent — self-improving AI agent by Nous Research with closed learning loop, 68 tools, 15+ messaging platforms, serverless deployment, and OpenClaw migration support."
tags: [clippings, nous-research, github, ai-agents, open-source]
related_entities: [Hermes-Agent, Nous-Research, OpenClaw]
related_concepts: [AI-Agents, Self-Improving-AI-Agent, Skills-System, Memory-Architecture, Agentic-AI]
---

# NousResearch/hermes-agent: The Agent That Grows With You

Nguồn: [github.com/NousResearch/hermes-agent](https://github.com/NousResearch/hermes-agent)

## Tổng quan

Hermes Agent là **self-improving AI agent** được xây dựng bởi [Nous Research](https://nousresearch.com/). Repository chứa toàn bộ source code, scripts, documentation, và CLI tools. Đây là agent AI duy nhất với built-in learning loop — tự tạo skills từ kinh nghiệm, tự cải thiện trong quá trình sử dụng, tìm kiếm các cuộc trò chuyện trước đó, và xây dựng mô hình người dùng ngày càng sâu.

## Đặc điểm chính

### 🔄 Closed Learning Loop
- Agent-curated memory với periodic nudges
- Autonomous skill creation sau các task phức tạp
- Skills tự cải thiện trong quá trình sử dụng
- FTS5 session search với LLM summarization cho cross-session recall
- Honcho dialectic user modeling
- Tương thích với [agentskills.io](https://agentskills.io/) open standard

### 🌐 Model Flexibility
Sử dụng bất kỳ model nào: Nous Portal, OpenRouter (200+ models), NVIDIA NIM (Nemotron), Xiaomi MiMo, z.ai/GLM, Kimi/Moonshot, **MiniMax**, Hugging Face, OpenAI, hoặc endpoint tùy chỉnh. Switch với `hermes model` — không code changes, không vendor lock-in.

### 🖥️ 6 Terminal Backends
**local, Docker, SSH, Daytona, Singularity, Modal.** Daytona và Modal offer serverless persistence — agent hibernates khi idle, wakes on demand, gần như không tốn chi phí giữa các phiên.

### 💬 15+ Messaging Platforms
Telegram, Discord, Slack, WhatsApp, Signal, Matrix, Mattermost, Email, SMS, DingTalk, Feishu, WeCom, BlueBubbles, Home Assistant — tất cả từ một gateway process duy nhất. Voice memo transcription, cross-platform conversation continuity.

### 📅 Scheduled Automations
Built-in cron scheduler với delivery đến bất kỳ nền tảng nào. Daily reports, nightly backups, weekly audits — tất cả bằng ngôn ngữ tự nhiên, chạy không cần giám sát.

### 🧑‍💻 Delegation & Parallelization
Spawn isolated subagents cho parallel workstreams. Write Python scripts call tools via RPC, collapse multi-step pipelines thành zero-context-cost turns.

### 🔬 Research-Ready
Batch trajectory generation, Atropos RL environments, trajectory compression cho training next-gen tool-calling models.

## CLI Commands

| Command | Mô tả |
|---------|-------|
| `hermes` | Interactive CLI — bắt đầu cuộc trò chuyện |
| `hermes model` | Chọn LLM provider và model |
| `hermes tools` | Configure tools được bật |
| `hermes config set` | Set individual config values |
| `hermes gateway` | Start messaging gateway |
| `hermes setup` | Full setup wizard |
| `hermes claw migrate` | Migrate từ OpenClaw |
| `hermes update` | Update phiên bản mới nhất |
| `hermes doctor` | Diagnose issues |

## Quick Install

```bash
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
```

Works trên Linux, macOS, WSL2, Android via Termux.

## Migration từ OpenClaw

Tự động import: SOUL.md, memories (MEMORY.md, USER.md), skills, command allowlist, messaging settings, API keys (Telegram, OpenRouter, OpenAI, Anthropic, ElevenLabs), TTS assets, workspace instructions (AGENTS.md).

```bash
hermes claw migrate              # Interactive
hermes claw migrate --dry-run    # Preview
hermes claw migrate --preset user-data
hermes claw migrate --overwrite
```

## Community

- 💬 [Discord](https://discord.gg/NousResearch)
- 📚 [Skills Hub](https://agentskills.io/)
- 🐛 [Issues](https://github.com/NousResearch/hermes-agent/issues)
- 🔌 [HermesClaw](https://github.com/AaronWong1999/hermesclaw) — Community WeChat bridge

## Liên kết nội bộ

- [[entities/Hermes-Agent]]
- [[entities/Nous-Research]]
- [[entities/OpenClaw]]
- [[concepts/AI-Agents]]
- [[concepts/Self-Improving-AI-Agent]]
- [[concepts/Skills-System]]
- [[concepts/Memory-Architecture]]