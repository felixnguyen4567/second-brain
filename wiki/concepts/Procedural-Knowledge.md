---
title: "Procedural Knowledge"
type: concept
tags: [knowledge-management, ai-skills, cognitive-science, memory]
related_sources: [ai-agent-skills-explained-simply]
related_concepts: [Skills-System, AI-Skills, Memory-Architecture]
related_entities: [Hermes-Agent]
created: 2026-05-04
---

# Procedural Knowledge

Procedural knowledge là loại kiến thức về **cách thực hiện một task** — không phải facts, mà là know-how. Ngược lại với declarative knowledge (knowing that).

## Trong Cognitive Science

Con người có ba loại memory:

| Type | Example | Maps to AI |
|------|---------|------------|
| **Semantic** (facts) | "Rome is the capital of Italy" | RAG, knowledge bases |
| **Episodic** (experiences) | "I went to Rome last summer" | Conversation logs |
| **Procedural** (skills) | "How to ride a scooter in Rome" | **Skill files** |

## Tại sao LLMs thiếu Procedural Knowledge

LLMs được train trên text để predict tokens — chúng học được facts từ training data. Nhưng procedural knowledge không được encode trong weights vì nó cần **experiential learning** (learning by doing).

LLMs có thể explain quantum mechanics nhưng **không thể follow** một 47-step workflow để generate financial report. Đó là lý do cần Skills.

## Giải pháp: Skill Files

**Skill = procedural knowledge được mã hóa thành markdown file.** Khi agent cần làm gì đó, nó load skill và thực hiện theo các bước đã được encode.

### Ví dụ skill structure
```yaml
---
name: Generate Financial Report
description: Creates a compliant financial report from raw data
---
## Steps
1. Validate input data format
2. Calculate key metrics
3. Apply compliance rules
4. Generate summary sections
```

## Related Concepts

- [[Skills-System]] — System-level implementation
- [[AI-Skills]] — Reusable instruction sets
- [[Memory-Architecture]] — Storage and retrieval
- [[Self-Improving-AI-Agent]] — Agent that generates its own skills