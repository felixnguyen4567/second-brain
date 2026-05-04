---
title: "AgentMail CLI"
type: entity
category: cli-tool / email-service
tags: [cli-tools, email, transactional-email, ai-agents, webhooks]
related_sources: [10-must-have-clis-ai-agents-2026]
related_concepts: [CLI-Tools, Terminal-Productivity, Agentic-AI]
created: 2026-05-04
---

# AgentMail CLI

CLI cho phép AI agents gửi, nhận, và quản lý email hoàn toàn từ terminal.

## Vấn đề AgentMail giải quyết

### Traditional Email APIs (SendGrid, SES)
- **One-way**: agent có thể gửi nhưng không thể nhận replies
- Không duy trì threads
- Không search inbox semantically

### AgentMail Solution
- Tạo live inbox trong milliseconds với single API call
- Real-time delivery via webhooks và websockets (no polling)
- Agent guardrails và permissions built-in
- Nhận replies, maintain threads, search semantically

## Commands

```bash
# List all agent inboxes
agentmail inboxes list

# Send an email from an agent inbox
agentmail inboxes:messages send \
  --inbox agent@yourdomain.agentmail.to \
  --to user@example.com \
  --subject "Follow-up from your AI assistant" \
  --body "Here are the results you requested."
```

## Installation

```bash
npm install -g agentmail-cli
```

## Related

- [[concepts/CLI-Tools]]
- [[concepts/Agentic-AI]]