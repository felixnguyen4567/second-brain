---
title: "Google Workspace CLI"
type: entity
category: cli-tool / productivity-suite
tags: [cli-tools, google-workspace, gmail, drive, calendar, docs, ai-agents]
related_sources: [10-must-have-clis-ai-agents-2026]
related_concepts: [CLI-Tools]
created: 2026-05-04
---

# Google Workspace CLI (`gws`)

Command-line interface for all Google Workspace operations — Gmail, Drive, Calendar, Docs, and every Workspace API. Replaces multiple GUI clicks with terminal commands.

## Overview

**The problem it solves**: Every Google Workspace operation (checking Drive, creating files, reading emails, setting up calendar events) requires multiple browser tabs and clicks.

**What it does**: `gws` handles any operation across Google Drive, Gmail, Calendar, and all Workspace APIs from one CLI.

## Key Commands

```bash
# List 10 most recent files in Google Drive
gws drive files list --params '{"pageSize": 10}'

# Check Gmail
gws gmail messages list --max-results 5

# Create calendar event
gws calendar events create --summary "Team Sync" --start 2026-05-04T10:00:00Z
```

## Installation

```bash
brew install googleworkspace-cli
npm install -g @googleworkspace/cli
cargo install --git https://github.com/googleworkspace/cli --locked
```

## Related Concepts

- [[concepts/CLI-Tools]]
