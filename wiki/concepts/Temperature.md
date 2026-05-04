---
title: "Temperature"
type: concept
tags: [temperature, LLM-parameter, creativity, randomness, output-control]
related_sources: [5-ai-terms-ahead]
related_concepts: [Tokens]
created: 2026-05-04
---

# Temperature

A parameter controlling how **random or predictable** an LLM's output is. Ranges from 0 (maximum predictability) to ~1+ (maximum creativity/randomness).

## How Temperature Works

When generating each word/token, the model predicts probabilities for possible next tokens. Temperature **reshapes this probability distribution**:

| Setting | Behavior | Output Character |
|---------|----------|-----------------|
| **Low (~0)** | Picks most likely token every time | Safe, consistent, accurate, can be boring |
| **High (~1+)** | Samples from broader distribution | Creative, surprising, unexpected, sometimes wrong |

## Real Example

Prompt: "Complete the sentence: The cat sat on the..."

- **Low temperature**: Almost always "mat" or "floor" — predictable, safe
- **High temperature**: Might say "philosophical dilemma" or "crumbling empire of Tuesday" — creative, risky

## Practical Guidelines

| Task Type | Recommended Temperature | Why |
|-----------|----------------------|-----|
| Summarization | Low | Should be accurate, not creative |
| Code generation | Low | Bugs introduced by randomness are dangerous |
| Factual Q&A | Low | Must be precise |
| Brainstorming | High | You want unexpected connections |
| Creative writing / fiction | High | Unexpected turns are desirable |
| Marketing copy | Medium-high | Some creativity, some consistency |

## Where to Find It

Most consumer apps (ChatGPT) set temperature to a fixed middle ground and don't expose the control. AI APIs and developer tools typically expose it as a parameter.

## Related Concepts

- [[concepts/Tokens]] — The atomic units whose selection temperature controls
- [[concepts/Hallucination]] — Higher temperature can increase hallucination risk
