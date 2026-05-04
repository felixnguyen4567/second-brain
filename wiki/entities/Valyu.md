---
title: "Valyu CLI"
type: entity
category: cli-tool / data-service
tags: [cli-tools, data-access, ai-agents, sec-filings, research]
related_sources: [10-must-have-clis-ai-agents-2026]
related_concepts: [CLI-Tools, Terminal-Productivity, Agentic-AI]
created: 2026-05-04
---

# Valyu CLI

Tool cung cấp web search và specialized/proprietary data access qua terminal cho AI agents.

## Đặc điểm chính

### Data Sources
- **SEC 10-K, 10-Q, 13F/G/D filings** — full-text search
- **PubMed, bioRxiv, clinical trial registries** — research papers
- **FRED economic indicators** — macroeconomic data
- **ChEMBL** — 2.5 triệu bioactive compounds
- **Patent databases** — patent search
- **Academic publishers** — research publications

### Commands
```bash
# Search across SEC filings
valyu search "Q1 2026 10-K supply chain risk factors semiconductors"

# Get answer grounded in real financial data
valyu answer "What did Apple disclose about AI infrastructure investment in their most recent 10-K?"

# Extract structured content from document
valyu contents https://arxiv.org/abs/2501.xxxxx
```

### Giá trị cho AI Agents
Khi agent cần thông tin thực (SEC filings, drug interactions, economic indicators, clinical trials) thay vì web search trả về news articles và Wikipedia → Valyu CLI giải quyết vấn đề này.

## Installation

```bash
# macOS/Linux via curl
curl -fsSL https://raw.githubusercontent.com/valyuAI/valyu-cli/main/install.sh | bash

# macOS via Homebrew
brew install valyuAI/cli/valyu

# npm
npm install -g @valyu/cli

# Windows (PowerShell)
irm https://raw.githubusercontent.com/valyuAI/valyu-cli/main/install.ps1 | iex
```

## Related

- [[concepts/CLI-Tools]]
- [[concepts/Terminal-Productivity]]