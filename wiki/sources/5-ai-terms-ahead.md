---
title: "If You Understand These 5 AI Terms, You're Ahead of 90% of People"
source: "https://medium.com/towards-artificial-intelligence/if-you-understand-these-5-ai-terms-youre-ahead-of-90-of-people-c7622d353319"
author:
  - "Shreyas Naphad"
published: 2026-03-29
created: 2026-05-04
description: "Five foundational AI concepts explained simply: Tokens, Context Window, Temperature, Hallucination, and RAG. Understanding these gives you a working mental model of how LLMs actually operate."
tags:
  - "clippings"
  - "LLM-fundamentals"
  - "AI-education"
---

# 5 AI Terms — You're Ahead of 90% of People

## Summary

Five foundational AI concepts explained for non-engineers: **Tokens** (the atomic unit of AI text processing), **Context Window** (working memory capacity), **Temperature** (randomness dial), **Hallucination** (confident wrong answers), and **RAG** (Retrieval-Augmented Generation — how AI "knows" your documents).

## The 5 Terms

### 1. Tokens

AI models process **chunks of text** (not words, not letters). A token can be a full word ("cat"), part of a word ("un", "tion"), or punctuation.

**Why it matters:**
- API pricing is measured in tokens per 1,000
- Context window capacity is measured in tokens
- Prompt optimization = token optimization
- Long conversations drop oldest tokens when context window fills

### 2. Context Window

The total tokens an AI can hold "in memory" at once — includes instructions, conversation history, uploaded documents, and its own replies.

**Mental model**: A whiteboard. Once full, you must erase old content to write new.

**Examples:**
- Old models: ~4K tokens (a few pages)
- Modern models: 200K–1M tokens (books, codebases)
- Once full, oldest tokens are dropped (AI "forgets")

### 3. Temperature

Controls output **randomness vs predictability**.

| Setting | Behavior | Use Case |
|---------|----------|----------|
| Low (~0) | Safe, predictable, consistent | Summarization, coding, facts |
| High (~1+) | Creative, surprising, risky | Fiction, brainstorming |

**Example**: "The cat sat on the..."
- Low temp → "mat" / "floor" (predictable)
- High temp → "philosophical dilemma" / "crumbling empire of Tuesday"

### 4. Hallucination

AI generates **wrong answers with full confidence**. Not a bug — a consequence of how LLMs work: they predict the next most likely token, not retrieve facts.

**Why dangerous**: AI makes mistakes with the **same confidence** as correct answers.

**Practical rule**: Never blindly trust AI for facts, medical/legal advice, statistics. Always verify.

### 5. RAG (Retrieval-Augmented Generation)

**Problem it solves**: LLMs are frozen at training time. They can't access your documents, last week's news, or internal data.

**How it works**:
1. Break document into **chunks** → store in a **vector database** (understands meaning, not keywords)
2. When you ask a question, **retrieve** most relevant chunks
3. **Feed** chunks + question to LLM → **Generate** answer

**"Chat with your PDF" = very smart search + LLM**. The model didn't learn your document — it found and used relevant passages.

## Practical Takeaways

- Better prompts = fewer tokens wasted
- Awareness of context window prevents "forgetting" confusion
- Factual tasks → low temperature; creative tasks → higher temperature
- Hallucination awareness = smarter AI use (verify what matters)
- RAG understanding = you know what "AI knows your data" actually means

## Related Concepts

- [[concepts/RAG]] — Retrieval-Augmented Generation
- [[concepts/llm-engineering]] — Token optimization and context management in production systems
