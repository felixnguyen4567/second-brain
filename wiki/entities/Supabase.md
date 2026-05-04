---
title: "Supabase CLI"
type: entity
category: cli-tool / backend-as-a-service
tags: [cli-tools, postgres, database, backend, developer-tools, ai-agents]
related_sources: [10-must-have-clis-ai-agents-2026]
related_concepts: [CLI-Tools, Local-AI]
created: 2026-05-04
---

# Supabase CLI

Official command-line tool for Supabase — open-source Firebase alternative providing Postgres, Auth, Storage, Edge Functions, and a dashboard UI as a complete local stack.

## Overview

**The problem it solves**: Multiple developers testing against a shared staging database causes unpredictable migration failures. Production deployments are tense because schema changes can't be previewed.

**What it does**: `supabase start` spins up a complete Supabase stack locally — Postgres, Auth, Storage, Edge Functions, dashboard — all on your machine. Local-first development with proper migration tracking.

## Key Commands

```bash
# Start local Supabase stack
supabase start

# Apply local migrations to remote database
supabase db push

# Reset local database
supabase db reset
```

## Supabase vs Firebase

| Feature | Supabase | Firebase |
|---------|----------|----------|
| Database | PostgreSQL | Firestore (NoSQL) |
| Auth | Yes | Yes |
| Storage | Yes | Yes |
| CLI | Yes | Yes |
| Open Source | Yes | No |
| SQL | Yes | No |

## Related Concepts

- [[concepts/CLI-Tools]]
- [[concepts/Local-AI]]
