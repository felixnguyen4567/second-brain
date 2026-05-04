---
title: "GitHub CLI"
type: entity
category: cli-tool / version-control
tags: [cli-tools, git, developer-tools, ai-agents]
related_sources: [10-must-have-clis-ai-agents-2026]
related_concepts: [CLI-Tools]
created: 2026-05-04
---

# GitHub CLI (`gh`)

Official command-line interface for GitHub, enabling repository management, pull requests, issues, and GitHub Actions workflows directly from the terminal. Added `gh copilot` in 2026 for inline AI assistance.

## Overview

**The problem it solves**: Context-switching from terminal to browser to review PRs, comment on issues, or trigger workflows. Five minutes lost every time you break flow.

**What it does**: GitHub in your terminal — PRs, issues, repos, Actions, search, clone — with `gh copilot` for AI assistance without leaving the shell.

## Key Commands

```bash
# Create a PR with branch name as title, commits as description
gh pr create --fill

# Review a PR
gh pr view 123 --web

# List issues
gh issue list

# Trigger workflow
gh workflow run deploy.yml
```

## Related Concepts

- [[concepts/CLI-Tools]]
