---
title: "Stripe CLI"
type: entity
category: cli-tool / payments
tags: [cli-tools, payments, webhooks, developer-tools, ai-agents]
related_sources: [10-must-have-clis-ai-agents-2026]
related_concepts: [CLI-Tools]
created: 2026-05-04
---

# Stripe CLI

Official command-line tool from Stripe for payment integration, webhook testing, and local development. Enables real event forwarding to localhost without requiring a public URL.

## Overview

**The problem it solves**: Payment webhook handlers broken in production can't be reproduced locally. No way to send real Stripe events to localhost without pushing test code live.

**What it does**: `stripe listen` creates a live tunnel from Stripe's event system to your local server. Real events, forwarded in real time. `stripe trigger` fires any event on demand. `stripe logs tail` streams API requests as they happen.

## Key Commands

```bash
# Forward Stripe events to your local webhook endpoint
stripe listen --forward-to localhost:3000/webhook

# Fire a specific event on demand
stripe trigger payment_intent.succeeded

# Stream live API requests
stripe logs tail
```

## Related Concepts

- [[concepts/CLI-Tools]]
