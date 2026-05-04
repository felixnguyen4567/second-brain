---
title: "PostHog CLI"
type: entity
category: cli-tool / analytics
tags: [cli-tools, analytics, product-analytics, feature-flags, self-hosting]
related_sources: [10-must-have-clis-ai-agents-2026]
related_concepts: [CLI-Tools]
created: 2026-05-04
---

# PostHog CLI

Command-line tool for PostHog analytics platform. Sets up product analytics and feature flags in seconds, with automatic framework detection and self-hosting support.

## Overview

**The problem it solves**: Adding analytics to every new project involves finding the right SDK, configuring manually, wiring up events, double-checking for PII leaks. Feature flags take even longer.

**What it does**: `posthog` in any project directory walks through setup interactively, detects React/Next.js/Svelte/React Native, handles all wiring automatically. `posthog deploy-hobby` self-hosts on your own infra in one line.

## Key Commands

```bash
# Interactive setup in any project
posthog

# Self-host on your own infrastructure (requires Docker)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/posthog/posthog/HEAD/bin/deploy-hobby)"
```

## Related Concepts

- [[concepts/CLI-Tools]]
