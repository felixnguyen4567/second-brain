---
title: MCP
type: entity
created: 2026-05-02
updated: 2026-05-02
sources: [production-grade-mcp-server.md]
tags: [protocol, agentic, AI, tools]
---

# MCP (Model Context Protocol)

**MCP** (Model Context Protocol) is a standardized protocol for connecting AI agents to external tools and data sources. It acts as the secure interface layer between agentic systems and enterprise data.

## Overview

MCP servers provide a **secure, authenticated, policy-checked tool surface** that agents call through. Every tool call goes through:
1. Authentication (who is calling)
2. Authorization (what are they allowed to do)
3. Rate limiting (quota enforcement)
4. Caching (performance)
5. Circuit breaking (reliability)
6. Execution
7. Audit logging

## Key Concepts

- [[concepts/MCP-server-architecture]]
- [[concepts/multi-tenant-isolation]]
- [[concepts/OAuth-2.1-resource-server]]

## Sources

- [[sources/production-grade-mcp-server]] — Production-grade MCP server architecture guide