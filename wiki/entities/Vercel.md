---
title: "Vercel CLI"
type: entity
category: cli-tool / deployment
tags: [cli-tools, deployment, frontend, serverless, vercel, ai-agents]
related_sources: [10-must-have-clis-ai-agents-2026]
related_concepts: [CLI-Tools]
created: 2026-05-04
---

# Vercel CLI

Command-line interface for Vercel — deploys projects and returns a unique preview URL in under a minute. Runs your app exactly as it will run in production, including edge behavior and serverless function emulation.

## Overview

**The problem it solves**: After building/cooking an app or website, getting it live for everyone to use means navigating dashboards and clicking through deployment settings.

**What it does**: `vercel` deploys and returns a preview URL in under a minute. `vercel dev` runs your app exactly as production with same environment variables, same edge behavior.

## Key Commands

```bash
# Deploy current directory
vercel

# Pull all environment variables into a local .env.local file
vercel env pull.env.local

# Run local dev matching production behavior
vercel dev
```

## Related Concepts

- [[concepts/CLI-Tools]]
