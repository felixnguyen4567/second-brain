---
title: "Tokens"
type: concept
tags: [tokens, LLM-fundamentals, pricing, context-window, AI-text-processing]
related_sources: [5-ai-terms-ahead]
related_concepts: [Context-Window, Temperature, Hallucination]
created: 2026-05-04
---

# Tokens

The atomic unit of text processing in large language models. AI models don't read words or letters — they read **chunks of text** called tokens.

## What Is a Token?

A token can be:
- A complete word: "cat", "running"
- Part of a word: "un", "tion", "ing"
- Punctuation: ".", ",", "!"
- Whitespace: " " (space)

**Example**: "I love pizza" → 3 tokens: "I", " love", " pizza"

## Why Tokens Matter

### API Pricing
Every AI product (ChatGPT, Claude, Gemini) measures usage in **tokens per 1,000**. The more tokens in your prompt + response, the more it costs.

### Context Window Capacity
The model's "working memory" is measured in tokens. Once the context window fills up, oldest tokens are dropped — the model "forgets."

### Prompt Optimization
Understanding tokens means you understand why:
- Shorter prompts can be more effective than longer ones
- Long conversations eventually lose early context
- Token efficiency directly affects cost

## Practical Implications

| Scenario | Token Impact |
|----------|-------------|
| Short factual query | Few tokens, fast, cheap |
| Long document summarization | Many tokens, slower, more expensive |
| 50-message conversation | Token count grows with each exchange |
| Context window full | Oldest messages dropped |

## Related Concepts

- [[concepts/Context-Window]] — The total token capacity of a model
- [[concepts/Temperature]] — Output randomness setting
- [[concepts/Hallucination]] — Why AI confidently gives wrong answers
