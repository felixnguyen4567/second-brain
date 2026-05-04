---
title: "Context Window"
type: concept
tags: [context-window, LLM-fundamentals, working-memory, tokens, AI-limits]
related_sources: [5-ai-terms-ahead]
related_concepts: [Tokens, Hallucination]
created: 2026-05-04
---

# Context Window

The total amount of text (measured in tokens) that an AI model can hold and process in a single turn. Includes instructions, conversation history, uploaded documents, and the model's own replies.

## Mental Model: The Whiteboard

Think of the context window as a **whiteboard**:
- You can write whatever you want on it
- Once it's full, you must **erase something old to write something new**
- The model can't see beyond what's on the whiteboard

## Context Window Sizes Through Time

| Model Era | Context Size | What It Can Hold |
|-----------|-------------|-----------------|
| Early models | ~4K tokens | A few pages of text |
| 2023–2024 | 32K–128K tokens | Long documents, several chapters |
| 2025–2026 | 200K–1M tokens | Entire books, codebases |

## What Counts Against the Context Window

Everything in a single API call counts:
1. System instructions
2. Conversation history (all previous messages)
3. Uploaded files / documents
4. The model's reply being generated

## The "Forgetting" Problem

When the context window fills up, the oldest tokens are dropped — the AI "forgets" earlier parts of the conversation. This is why:
- Long-running conversations can become confused
- Important context from early in a conversation disappears
- Strategies like summarization mid-conversation help

## Large Context Windows Change What's Possible

A 200K token context (Claude) or 1M token context (Gemini) means:
- Paste an entire book and ask questions about it
- Feed an entire codebase for review
- Upload years of conversation history

**This is why people got excited when Claude announced 200K and Gemini pushed toward 1M tokens.**

## Related Concepts

- [[concepts/Tokens]] — The atomic units that fill the context window
- [[concepts/Hallucination]] — Not a context window problem, but related to what the model can "see"
