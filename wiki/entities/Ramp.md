---
title: "Ramp CLI"
type: entity
category: cli-tool / finance
tags: [cli-tools, expenses, finance, corporate-cards, ai-agents]
related_sources: [10-must-have-clis-ai-agents-2026]
related_concepts: [CLI-Tools]
created: 2026-05-04
---

# Ramp CLI

Command-line interface for Ramp expense and corporate card management. Enables transaction queries, expense approvals, and vendor bill searches directly from the terminal with `--agent` flag for JSON output.

## Overview

**The problem it solves**: Approving expense reports means logging into the Ramp dashboard, finding each transaction, clicking approve, repeating. Team card management takes more time in dashboards than in code.

**What it does**: Query transactions, approve expenses, check card limits, search vendor bills — all scriptable and pipeable to other tools.

## Key Commands

```bash
# List transactions over $5000 since Jan 2026 in JSON
ramp transactions list --from_date 2026-01-01 --agent | \
  jq '.data[] | select(.amount > 5000)'
```

## Related Concepts

- [[concepts/CLI-Tools]]
