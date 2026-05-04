---
title: "AgentMail CLI"
type: entity
category: cli-tool / email
tags: [cli-tools, email, transactional-email, webhooks, ai-agents, inbox]
related_sources: [10-must-have-clis-ai-agents-2026]
related_concepts: [CLI-Tools]
created: 2026-05-04
---

# AgentMail CLI

Command-line tool for AgentMail — provides live email inbox creation, transactional sending, reply receiving, and threaded conversation management for AI agents. Solves the "AI agent needs a real email address" problem.

## Overview

**The problem it solves**: Giving an AI agent a real functional email address used to mean OAuth flows, domain verification delays, and weeks of setup. Testing transactional emails locally was painful — either send real emails, skip testing, or stand up a mock SMTP server that doesn't behave like production.

**What it does**: Creates a live inbox in milliseconds with a single API call. Real-time delivery via webhooks and websockets (no polling). `—agent` flag outputs JSON for piping to AI agent workflows.

## Key Commands

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

## Related Concepts

- [[concepts/CLI-Tools]]
