---
title: "Hermes Agent Documentation"
source: https://hermes-agent.nousresearch.com/docs
author: Nous Research
created: 2026-05-02
description: "Official documentation for Hermes Agent — the self-improving AI agent built by Nous Research. Covers installation, messaging gateway, tools, memory, skills, MCP, voice, personality, security, and architecture."
tags: [clippings, nous-research, documentation, ai-agents]
related_entities: [Hermes-Agent, Nous-Research]
related_concepts: [AI-Agents, Self-Improving-AI-Agent, Skills-System, Memory-Architecture, Agentic-AI]
---

# Hermes Agent Documentation

Nguồn: [hermes-agent.nousresearch.com/docs](https://hermes-agent.nousresearch.com/docs)

## Tổng quan

Hermes Agent là **AI agent tự-cải-thiện** được xây dựng bởi [Nous Research](https://nousresearch.com/). Đây là agent duy nhất có vòng học tập khép kín — tự tạo skills từ kinh nghiệm, tự cải thiện trong quá trình sử dụng, tự nhắc nhở để lưu giữ kiến thức, và xây dựng mô hình người dùng ngày càng sâu qua các phiên.

## Đặc điểm chính

### 🔄 Closed Learning Loop
- **Agent-curated memory** với periodic nudges
- **Autonomous skill creation** sau các task phức tạp
- **Skill self-improvement** trong quá trình sử dụng
- **FTS5 cross-session search** với LLM summarization
- **[Honcho](https://github.com/plastic-labs/honcho)** dialectic user modeling
- Tương thích với [agentskills.io](https://agentskills.io/) open standard

### 🌍 Chạy mọi nơi
- 6 terminal backends: **local, Docker, SSH, Daytona, Singularity, Modal**
- Daytona và Modal cung cấp serverless persistence — agent hibernates khi idle, gần như không tốn chi phí
- Chạy trên $5 VPS, GPU cluster, hoặc serverless infrastructure

### 💬 15+ Nền tảng nhắn tin
CLI, Telegram, Discord, Slack, WhatsApp, Signal, Matrix, Mattermost, Email, SMS, DingTalk, Feishu, WeCom, BlueBubbles, Home Assistant — tất cả từ một gateway process.

### 🔧 68 Built-in Tools
Tìm kiếm, trích xuất, duyệt web, vision, image generation, TTS — đầy đủ cho autonomous operation.

### 🧠 Memory & Skills
- **Memory System**: persistent memory mở rộng qua các phiên
- **Skills System**: procedural memory tự tạo và tái sử dụng
- **Context Files**: project context định hình mọi cuộc trò chuyện

### 🔌 MCP Integration
Kết nối MCP servers, filter tools, mở rộng Hermes một cách an toàn.

### 🎙️ Voice Mode
Real-time voice interaction trong CLI, Telegram, Discord, và Discord VC.

### 🎭 Personality & SOUL.md
Định nghĩa giọng nói mặc định của Hermes bằng SOUL.md persona file.

### 🔒 Bảo mật
Command approval, authorization, container isolation.

### 📅 Scheduled Automations
Built-in cron scheduler với delivery đến bất kỳ nền tảng nào. Daily reports, nightly backups, weekly audits — tất cả bằng ngôn ngữ tự nhiên.

### 🧑‍💻 Delegates & Parallelizes
Spawn isolated subagents cho parallel workstreams. Write Python scripts call tools via RPC, collapse multi-step pipelines thành zero-context-cost turns.

### 🔬 Research-Ready
Batch trajectory generation, Atropos RL environments, trajectory compression cho training next-gen tool-calling models.

## Quick Install

```bash
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
```

Works on Linux, macOS, WSL2, và Android via Termux.

## Model Flexibility

Sử dụng bất kỳ model nào: Nous Portal, OpenRouter (200+ models), NVIDIA NIM, Xiaomi MiMo, z.ai/GLM, Kimi/Moonshot, **MiniMax**, Hugging Face, OpenAI, hoặc endpoint của riêng bạn. Switch với `hermes model` — không cần thay đổi code.

## Migration từ OpenClaw

Hermes tự động import SOUL.md, memories, skills, command allowlist, messaging settings, API keys, TTS assets, và workspace instructions từ OpenClaw:

```bash
hermes claw migrate              # Interactive migration
hermes claw migrate --dry-run     # Preview
hermes claw migrate --preset user-data   # Without secrets
hermes claw migrate --overwrite  # Overwrite conflicts
```

## Liên kết nội bộ

- [[entities/Hermes-Agent]]
- [[entities/Nous-Research]]
- [[concepts/AI-Agents]]
- [[concepts/Self-Improving-AI-Agent]]
- [[concepts/Skills-System]]
- [[concepts/Memory-Architecture]]