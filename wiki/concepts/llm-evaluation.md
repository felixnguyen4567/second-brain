---
title: LLM Evaluation
type: concept
created: 2026-05-03
updated: 2026-05-03
sources: [12-ai-books-2026-anubhav.md]
tags: [evaluation, llm, testing, production, agents]
---

# LLM Evaluation

How to evaluate LLM systems — especially challenging for agents and non-deterministic, multi-step systems where "right answer" isn't obvious.

## Core Challenge

Agents are notoriously hard to test. Standard metrics don't apply when:
- Outputs are non-deterministic
- Multiple valid paths to a goal
- Ground truth is ambiguous or expensive
- Task requires multi-step reasoning

## Key Metrics

From production systems literature:
- **Context Relevance** — retrieved context matches user query
- **Groundedness** — response aligns with retrieved context
- **Answer Relevance** — response aligns with user query (no ground truth needed)
- **Correctness** — generated vs. ground truth comparison
- **Coherence** — logical consistency, no contradictions

## Key Reading

- [[entities/Rush-Shahani]] — Building Reliable AI Systems (Manning)
- [[entities/Chip-Huyen]] — AI Engineering covers evaluation frameworks

## See Also
- [[concepts/llm-engineering]]
- [[concepts/ai-agent-architecture]]