---
title: "Hallucination"
type: concept
tags: [hallucination, LLM-problem, AI-errors, confidence, factual-accuracy]
related_sources: [5-ai-terms-ahead]
related_concepts: [Tokens, Context-Window, Temperature]
created: 2026-05-04
---

# Hallucination

When an AI generates **wrong answers with full confidence**. Not a bug — a fundamental consequence of how LLMs work. The model was trained to predict the next most likely token, not to retrieve facts.

## What It Looks Like

You ask about a book. The AI gives you a title, author, year, and plot summary — all **completely made up**. The book doesn't exist. But the AI states it as confidently as a Wikipedia entry.

## Why It Happens

LLMs are **not databases**. They don't look up facts. They predict what token comes next based on patterns learned during training.

When the model doesn't know something:
- It **doesn't** say "I don't know"
- It **generates** what sounds like a correct answer
- Because that's literally what it was trained to do

## The Core Danger

AI makes mistakes with the **same confidence** it uses when it's right. You can't tell from the output alone whether it's accurate or hallucinated.

## Practical Rules

1. **Never blindly trust AI for facts** — statistics, medical advice, legal information, historical dates
2. **Always verify** what matters before acting on it
3. **Use lower temperature** for factual tasks (less randomness = fewer confident mistakes)
4. **Use RAG** when you need AI to work with specific documents (grounded in retrieved text)

## Hallucination vs Forgetting

| Problem | Cause | Looks Like |
|---------|-------|-----------|
| **Hallucination** | Model generates wrong token | Confident wrong answer |
| **Forgetting** | Context window overflow | Model loses track of earlier conversation |

## Related Concepts

- [[concepts/Tokens]] — The tokens the model is "hallucinating"
- [[concepts/Context-Window]] — Can contribute to confusion in long conversations
- [[concepts/Temperature]] — Higher temp = higher risk of hallucination
- [[concepts/RAG]] — A key mitigation: ground AI responses in retrieved documents
