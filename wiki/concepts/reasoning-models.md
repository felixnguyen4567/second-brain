---
title: Reasoning Models
type: concept
created: 2026-05-02
updated: 2026-05-02
sources: [openai-o3-pro-launch]
tags: [ai-architecture, chain-of-thought, reasoning]
---

# Reasoning Models

## Definition
A class of LLMs designed to spend more compute at inference time ("thinking longer") to solve complex problems. Unlike standard chat models that respond instantly, reasoning models deliberately slow down to work through multi-step logic.

## Key Examples
| Model | Lab | Benchmark (GPQA) | Notes |
| :--- | :--- | :--- | :--- |
| o3-pro | [[OpenAI]] | 92% | Most powerful, $200/mo |
| o3 | [[OpenAI]] | 87% | Previous generation |
| Claude 3.5 Opus | [[Anthropic]] | ~85% | Strong competitor |
| Gemini 2.5 Pro | [[Google DeepMind]] | ~83% | Google's entry |

## How It Works
1. Model receives a hard problem
2. Instead of immediate output, it generates internal "thinking" tokens
3. Thinking can last seconds to minutes (o3-pro: up to 10 min)
4. Final answer is typically more accurate than fast models

## Tradeoffs
- ✅ Much better at math, science, coding, logic
- ❌ Slower (30-60s vs instant)
- ❌ More expensive (10-20x standard models)
- ❌ Overkill for simple tasks

## Related
- [[OpenAI]] o-series lineage
- Chain-of-thought prompting (predecessor technique)
