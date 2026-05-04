---
title: "Procedural Knowledge"
type: concept
tags: [procedural-knowledge, cognitive-science, AI-memory, skills, knowledge-types]
related_sources: [ai-agent-skills-explained-simply]
related_concepts: [AI-Skills, skills-system]
related_entities: [Anthropic, OpenAI]
created: 2026-05-04
---

# Procedural Knowledge

The know-how to perform actions — not facts about something, but the ability to actually *do* it. Distinguished from semantic knowledge (facts) in cognitive science, and the gap it creates in LLMs.

## The Problem LLMs Have

Large language models know **facts**:
- "The capital of France is Paris"
- "SQL was developed at IBM in the 1970s"

But they lack **procedural knowledge**:
- "How to file quarterly taxes"
- "The 47 steps to generate a compliant financial report"
- "How to ride a bike"

Knowing facts about an activity doesn't mean you can perform it. This is the procedural knowledge gap.

## Three Types of Memory (Cognitive Science)

| Memory Type | What It Stores | Example | AI Equivalent |
|-------------|---------------|---------|---------------|
| **Semantic** | Facts | "Paris is the capital of France" | RAG / knowledge bases |
| **Episodic** | Experiences | "I visited Paris last summer" | Conversation logs |
| **Procedural** | How to do things | "How to navigate Paris streets" | **Skill files** |

Agent architectures are beginning to mirror this three-tier memory structure.

## Why It Matters for AI Agents

Without procedural knowledge, an agent given a task requiring a specific process has only two options:
1. **Spell out every step** every time (defeats the purpose of an agent)
2. **Guess** the process (defeats the purpose of having a process)

Neither works at scale.

## Skills as Procedural Memory

**Skills** (filesystem-based `skill.md` files) are the architectural solution:
- They encode *how* to do something, in what order, with what judgment
- They're loaded at point of need (progressive disclosure)
- They're just files — version-controlled, portable, easily updated

## Related Concepts

- [[concepts/AI-Skills]] — The implementation of procedural knowledge in AI agents
- [[concepts/skills-system]] — System-level architecture for skills
- [[concepts/RAG]] — Semantic knowledge counterpart
