---
title: "RAG (Retrieval-Augmented Generation)"
type: concept
tags: [RAG, knowledge-retrieval, vector-database, AI-memory, grounding]
related_sources: [5-ai-terms-ahead, ai-agent-skills-explained-simply]
related_concepts: [Tokens, Hallucination, AI-Skills]
created: 2026-05-04
---

# RAG (Retrieval-Augmented Generation)

A technique for giving LLMs access to information beyond their training data by retrieving relevant documents at query time and feeding them into the context window alongside the user's question.

## The Problem RAG Solves

LLMs are **frozen at training time**:
- They know nothing about events after their training cutoff
- They know nothing about your company's internal documents
- They know nothing about the PDF you just uploaded

RAG bridges this gap by letting the model "see" relevant external information at inference time.

## How RAG Works

```
User Question
     │
     ▼
┌─────────────────────────────┐
│ 1. EMBED QUESTION           │  (Convert question to vector)
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ 2. VECTOR SEARCH            │  (Find most similar document chunks)
│    (Vector Database)        │  (Understands meaning, not keywords)
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ 3. RETRIEVE CHUNKS          │  (Return top-k most relevant passages)
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ 4. GENERATE                  │  (Feed chunks + question to LLM)
│    (LLM)                     │  (LM generates answer using context)
└─────────────────────────────┘
```

Key insight: **The LLM didn't learn your document. It found and used relevant passages.**

## Key Components

| Component | Role |
|-----------|------|
| **Chunking** | Break documents into smaller pieces for retrieval |
| **Embeddings** | Convert text to vectors (numerical representations of meaning) |
| **Vector Database** | Stores embeddings; enables semantic search (meaning, not keywords) |
| **Retriever** | Finds most relevant chunks to the query |
| **Generator** | LLM produces answer using retrieved context |

## RAG vs Fine-Tuning vs Skills

| Method | What It Gives | Cost | Update Frequency |
|--------|--------------|------|-----------------|
| **RAG** | Factual knowledge from documents | Low at inference | Real-time (swap docs) |
| **Fine-tuning** | Knowledge baked into model weights | Very high (retraining) | Only when retrained |
| **Skills** | Procedural knowledge (how to do) | Low | Just update the file |

## Common RAG Applications

- "Chat with your PDF" / "Chat with your documents"
- Customer support bots that know your company's policies
- Legal document analysis
- Research paper summarization
- Internal knowledge base Q&A

## Limitations

RAG doesn't fix hallucination — it reduces it by grounding responses in retrieved text. But if the retrieved chunks contain errors, or if retrieval finds wrong chunks, the LLM can still hallucinate.

## Related Concepts

- [[concepts/Hallucination]] — The problem RAG helps mitigate
- [[concepts/Tokens]] — What gets retrieved and fed to the LLM
- [[concepts/AI-Skills]] — Skills provide procedural knowledge; RAG provides factual knowledge
- [[concepts/Procedural-Knowledge]] — The other major knowledge type (skills' domain)
