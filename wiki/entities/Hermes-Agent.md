---
title: "Hermes Agent"
type: entity
source: https://github.com/NousResearch/hermes-agent
organization: Nous Research
category: ai-agent
tags: [ai-agents, open-source, nous-research, self-improving, serverless, messaging-gateway]
related_sources: [hermes-agent-documentation, nousresearch-hermes-agent-github, hermes-agent-self-improving-ai-agent]
related_entities: [Nous-Research, OpenClaw]
related_concepts: [AI-Agents, Self-Improving-AI-Agent, Skills-System, Memory-Architecture, Agentic-AI]
created: 2026-05-02
updated: 2026-05-02
---

# Hermes Agent

Open-source AI agent tự-cải-thiện được xây dựng bởi [Nous Research](https://nousresearch.com/). Agent AI duy nhất có **built-in learning loop** — tự tạo skills từ kinh nghiệm, tự cải thiện trong quá trình sử dụng, tự nhắc nhở để lưu giữ kiến thức, và xây dựng mô hình người dùng ngày càng sâu qua các phiên.

## Đặc điểm cốt lõi

### 🔄 Closed Learning Loop
- **Agent-curated memory** với periodic nudges
- **Autonomous skill creation** sau các task phức tạp
- **Skill self-improvement** trong quá trình sử dụng
- **FTS5 cross-session search** với LLM summarization
- **[Honcho](https://github.com/plastic-labs/honcho)** dialectic user modeling
- Tương thích với [agentskills.io](https://agentskills.io/) open standard

### 🌐 Model Agnostic
Sử dụng bất kỳ model nào: Nous Portal, OpenRouter (200+ models), NVIDIA NIM, Xiaomi MiMo, z.ai/GLM, Kimi/Moonshot, **MiniMax**, Hugging Face, OpenAI, hoặc endpoint tùy chỉnh. Switch bằng `hermes model`.

### 🖥️ 6 Terminal Backends
**local, Docker, SSH, Daytona, Singularity, Modal.** Daytona và Modal offer serverless persistence — agent hibernates khi idle, gần như không tốn chi phí.

### 💬 15+ Nền tảng nhắn tin
CLI, Telegram, Discord, Slack, WhatsApp, Signal, Matrix, Mattermost, Email, SMS, DingTalk, Feishu, WeCom, BlueBubbles, Home Assistant — tất cả từ một gateway process.

### 🔧 68 Built-in Tools
Tìm kiếm, trích xuất, duyệt web, vision, image generation, TTS.

### 📅 Scheduled Automations
Built-in cron scheduler với delivery đến bất kỳ nền tảng nào.

### 🧑‍💻 Delegation
Spawn isolated subagents cho parallel workstreams.

### 🔬 Research-Ready
Batch trajectory generation, Atropos RL environments, trajectory compression.

## Installation

```bash
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
```

Works trên Linux, macOS, WSL2, Android via Termux.

## So sánh với OpenClaw

| Aspect | Hermes Agent | OpenClaw |
|--------|-------------|----------|
| Architecture | Single agent | Multi-agent orchestration |
| Learning | Built-in self-improvement loop | External skills system |
| Deployment | Serverless (Daytona, Modal) | Primarily local/VPS |
| Migration | `hermes claw migrate` | N/A |
| Model flexibility | Any provider | Configurable |

## Liên kết

- [[entities/Nous-Research]] — Tổ chức xây dựng Hermes
- [[entities/OpenClaw]] — Migration path từ OpenClaw
- [[concepts/AI-Agents]]
- [[concepts/Self-Improving-AI-Agent]]
- [[concepts/Skills-System]]
- [[concepts/Memory-Architecture]]