---
title: "AI Skills"
type: concept
source: https://docs.anthropic.com/en/docs/claude-model-card
related_sources: [claude-skills-best, hermes-agent-documentation]
tags: [ai-skills, automation, reusable-knowledge, instruction-sets]
related_concepts: [AI-Agents, Skills-System, Self-Improving-AI-Agent, Memory-Architecture]
related_entities: [Anthropic, Hermes-Agent]
created: 2026-05-02
updated: 2026-05-02
---

# AI Skills

Reusable instruction sets hoặc procedures mà AI agents sử dụng để thực hiện các task cụ thể một cách nhất quán. Skills cho phép AI agent "học" và "nhớ" cách thực hiện tasks thay vì phải được hướng dẫn lại từ đầu mỗi lần.

## Các loại Skills

### Procedural Skills
Những kỹ năng được mã hóa thành các bước cụ thể — ví dụ: " cách research một chủ đề", "cách viết code test". Agent đọc và thực hiện theo.

### Self-Generated Skills
Một số agent (như [[Hermes-Agent]]) có khả năng **tự tạo skills** từ kinh nghiệm. Sau khi hoàn thành một task phức tạp, agent trích xuất pattern thành skill để tái sử dụng.

### Community Skills
Các skills được chia sẻ qua open standards như [agentskills.io](https://agentskills.io/). Compatible với Hermes Agent.

## AI Skills vs Traditional Programming

| Aspect | Traditional Code | AI Skills |
|--------|-----------------|-----------|
| Flexibility | Fixed logic | Adapts to context |
| Portability | Platform-specific | Cross-platform |
| Maintenance | Manual updates | Self-improving |
| Creation | Manual coding | Auto-generation possible |

## Related Concepts

- [[Skills-System]] — System-level implementation của skills
- [[Self-Improving-AI-Agent]] — Khả năng tự tạo skills
- [[Memory-Architecture]] — Lưu trữ và truy xuất skills
- [[AI-Agents]] — Agents sử dụng skills

## References

- [Claude Skills](https://docs.anthropic.com/en/docs/claude-model-card) — Anthropic's Skills platform
- [agentskills.io](https://agentskills.io/) — Open standard skills hub
- [Hermes Skills System](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills)