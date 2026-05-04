---
title: "AI Agent Skills Explained Simply"
source: "https://medium.com/@tahirbalarabe2/ai-agent-skills-explained-simply-4010f6d9db92"
author:
  - "[[Tahir]]"
published: 2026-04-25
created: 2026-05-04
description: "More"
tags:
  - "clippings"
---
![](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*vdYEFOYfAj635SkF3sh2EQ.png)

**TLDR:**AI agent skills add procedural knowledge to LLMs via skill.md files. Learn the open standard adopted by Claude Code and OpenAI.

[**WHAT ARE AGENT SKILLS?**](https://medium.com/@tahirbalarabe2/what-are-agent-skills-c7793b206daf)

Full Credit:[IBM Technology](https://youtu.be/Lg-meK5IU8Q?si=C6CHYqAyE77e0P38)

You know what’s weird about AI agents? They can explain quantum mechanics but they can’t follow a 47-step workflow for generating a financial report.

That sounds like a joke. It’s not.

Large language models know facts. They know the capital of France. They know the history of SQL. They can tell you the airspeed velocity of an unladen swallow. They probably know which kind of swallow the question refers to.

But knowledge isn’t just facts. There’s another kind. The kind you use when you actually do something.

Riding a bike. Filing taxes. Making coffee. These aren’t things you know. They’re things you do. And knowing the facts about them doesn’t mean you can do them.

This is procedural knowledge. And AI agents don’t have it.

## The Problem with Agents

Not by default. When you give an agent a task that requires a specific process, it has two choices:

- You spell out every single step every time
- The agent guesses

Neither works. Spelling out 47 steps every time defeats the purpose of having an agent. Guessing defeats the purpose of having a process.

So what do you do?

## What Is a Agent Skill?

[Agent Skills are modular capabilities that extend LLM’s functionality.](https://medium.com/@tahirbalarabe2/what-are-agent-skills-c7793b206daf) They’re reusable, filesystem-based resources containing instructions, metadata, and optional resources (scripts, templates) that Claude automatically uses when relevant to your request.

You give the agent a skill.

A skill is just a markdown file. That’s it. A file called `skill.md` in a folder.

## The Basic Structure

At the top you put YAML front matter with two mandatory fields:

- Name — Identifies the skill
- Description — Tells the agent when to use it

Below that you write the instructions. Step by step. Rules. Examples. Whatever the agent needs to know.

## Optional Additions

You can add optional folders:

- Scripts — Executable code in JavaScript, Python, or bash
- References — Extra documentation loaded when needed
- Assets — Static resources like templates and data files

That’s the whole thing.

## How Progressive Disclosure Works

Here’s where it gets interesting. What if an agent has hundreds of skills? Loading all of them into memory would use up every token before anyone asks a question.

So skills use progressive disclosure in three tiers.

## Tier One: Metadata Only

The agent loads just the name and description from each skill. That’s a few tokens per skill. Even with a hundred skills installed, the overhead won’t fill the context window.

This is essentially a table of contents.

## Tier Two: Full Instructions

When the agent sees a request that matches a skill’s description, it reads the complete instructions into context. Now it knows what to do.

The matching happens through the LLM’s own reasoning. The model decides when a skill applies. That’s why a good description matters so much.

## Tier Three: Optional Resources

Scripts, references, and assets only load when a specific task needs them.

The agent starts with a lightweight index. It pulls in details when they matter. It grabs resources only at the point of need.

## Skills vs Other Knowledge Methods

![](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*7fzkAir00J7M_PF63prFTg.png)

There are several ways to give agents knowledge. They handle different things.

## MCP (Model Context Protocol)

- What it gives you: Tool access
- What it does: Lets agents call external APIs and interact with services
- What it doesn’t do: Tell the agent when to reach for something or what to do once it has

## RAG (Retrieval Augmented Generation)

- What it gives you: Factual knowledge
- What it does: Pulls relevant chunks from a knowledge database at runtime
- What it doesn’t do: Teach an agent how to do something. It’s reference material.

## Fine Tuning

- What it gives you: Knowledge baked into model weights
- What it does: Makes knowledge permanent
- What it doesn’t do: Stay cheap. If the model changes, fine tuning has to be redone.

## Skills

- What they give you: Procedural knowledge
- What they do: Tell the agent how to do things, in what order, with what judgment
- What makes them different: They’re just files. Version control. Easy updates. Portable across platforms.

In practice, skills often use these other methods. MCP provides the capability to invoke something externally. The skill provides the judgment for when and how to do that.

## The Open Standard

The `skill.md` format is an open standard published at agent [https://agentskills.io](https://agentskills.io/home) It's an Apache 2.0 licensed project.

Major AI platforms have adopted it:

- Claude Code
- OpenAI Codex
- Many other tools

A skill built for one platform works on any platform that supports the spec.

## A Cognitive Science Framework

Here’s a useful way to think about skills. Humans have distinct types of memory.

### Semantic Memory (Facts)

Rome is the capital of Italy.

Maps to: RAG and knowledge bases

### Episodic Memory (Experiences)

I went to Rome last summer.

Maps to: Conversation logs and interaction history

### Procedural Memory (Skills)

How to ride a scooter on the streets of Rome and live to tell the tale.

Maps to: Skill files

Agent architectures are starting to mirror this structure.

## The Trust Problem

Skills can include executable scripts with access to:

- Your file system
- Environment variables
- API keys

This is what makes skills powerful. It’s also what makes trust important.

When an agent runs a script, it’s executing commands on your machine. Audits have found that publicly available skills frequently contain bad things:

- Prompt injection
- Tool poisoning
- Hidden malware

Treat skill installation the same way you treat installing any software dependency. Review it. Understand what it does. Then decide.

## Where This Leaves Us

Skills are procedural memory for AI agents. They’re defined in a markdown file that lives in a folder. They teach an agent how to do a specific job. They load efficiently through progressive disclosure. The format is an open standard.

An agent that already knows the airspeed velocity of an unladen swallow can now also learn how to perform any repeatable task you define for it.

That’s the gap skills fill. And that’s why every major AI coding platform adopted them.

## Frequently Asked Questions (FAQ)

## Q1: Can I create my own agent skill?

Yes. A skill is simply a `skill.md` file in a folder. You write a name and description in YAML front matter, then add step-by-step instructions in plain markdown. Optionally, you can include scripts, references, or assets.

## Q2: Do skills work across different AI platforms?

Yes. The `skill.md` format is an open standard published at agent [https://agentskills.io](https://agentskills.io/home) under an Apache 2.0 license. A skill built for one platform works on any platform that supports the spec, including Claude Code and OpenAI Codex.

## Q3: Are agent skills safe to use?

Not automatically. Skills can include executable scripts with access to your file system, environment variables, and API keys. Publicly available skills have been found to contain prompt injection, tool poisoning, and hidden malware. Always review a skill before installing it.

## Q4: How is a skill different from MCP?

MCP (Model Context Protocol) gives agents tool access to call external APIs and services. A skill provides the judgment for when to use those tools and what to do with them. Skills often use MCP for execution.

## Q5: How is a skill different from RAG?

RAG (Retrieval Augmented Generation) pulls factual knowledge from a database at runtime. It is reference material. A skill teaches procedural knowledge — how to do something step by step.

## Q6: What happens if an agent has hundreds of skills?

The agent uses progressive disclosure. At startup, it loads only the name and description from each skill (a few tokens per skill). When a task matches a skill’s description, it loads the full instructions. Scripts and resources load only when needed.

## Q7: What are the mandatory fields in a skill.md file?

Name and description. The name identifies the skill. The description tells the agent what the skill does and when to use it — this is the trigger condition.

## Q8: Can a skill include code?

Yes. The optional `scripts` folder can contain executable JavaScript, Python, or bash code that the agent can run.

## Q9: Why are skills becoming an open standard?

They solve a specific problem: giving agents procedural knowledge. Because skills are just files, they can be version controlled, easily updated, and moved between platforms. Major AI coding platforms have adopted the spec.

## Q10: What kind of tasks are skills best for?

Repeatable workflows with specific steps, such as generating a compliant financial report, extracting a PDF, or any multi-step process that requires consistent execution and judgment.

## Further Reading:

[What is LLM Wiki Pattern? Persistent Knowledge with LLM Wikis](https://medium.com/@tahirbalarabe2/what-is-llm-wiki-pattern-persistent-knowledge-with-llm-wikis-3227f561abc1)

[🐍 LiteLLM PyPI Supply Chain Attack Detection and Remediation](https://medium.com/@tahirbalarabe2/litellm-pypi-supply-chain-attack-detection-and-remediation-cef5e99270ed)

[🐍The LiteLLM PyPI Supply Chain Attack What You Need to Know](https://medium.com/@tahirbalarabe2/the-litellm-pypi-supply-chain-attack-what-you-need-to-know-6ab536d4aeb3)

[What is Moltbook? The Social Network for Ai Agents](https://medium.com/@tahirbalarabe2/what-is-moltbook-the-social-network-for-ai-agents-12f7a28a2d12)

[What is Clawdbot(Moltbot)?](https://medium.com/@tahirbalarabe2/what-is-moltbook-the-social-network-for-ai-agents-12f7a28a2d12)

[🦞(Clawdbot) MoltBot OpenClaw Local System Architecture](https://medium.com/@tahirbalarabe2/clawdbot-moltbot-openclaw-local-system-architecture-52acc37f1213)

[WHAT ARE AGENT SKILLS?](https://medium.com/@tahirbalarabe2/what-are-agent-skills-c7793b206daf)

[Agent Skills Vs MCP Vs Prompts Vs Projects Vs Subagents:A Comparative Analysis](https://medium.com/@tahirbalarabe2/agent-skills-vs-mcp-vs-prompts-vs-projects-vs-subagents-a-comparative-analysis-7a36cd85cb74)

[⌨️ What is LLM Prompt Engineering?](https://medium.com/@tahirbalarabe2/%EF%B8%8F-what-is-llm-prompt-engineering-e80c59bd522e)

[📈 Prompt Engineering Made Simple with the RISEN Framework](https://medium.com/@tahirbalarabe2/prompt-engineering-made-simple-with-the-risen-framework-038d98319574)

[💡 What is Prompt Engineering?:: RAG, CoT, ReAct & DSP Explained](https://medium.com/@tahirbalarabe2/what-is-prompt-engineering-rag-cot-react-dsp-explained-0aa0a9bd0a90)

[🔗What is Model Context Protocol? (MCP) Architecture Overview](https://medium.com/@tahirbalarabe2/what-is-model-context-protocol-mcp-architecture-overview-c75f20ba4498)

[How DRIFT Stops Prompt Injection Attacks in LLM Agents](https://medium.com/@tahirbalarabe2/how-drift-stops-prompt-injection-attacks-in-llm-agents-9454368f5e4c)

[Implementing Secure by Design Principles in AI System Development](https://medium.com/@tahirbalarabe2/implementing-secure-by-design-principles-in-ai-system-development-5ea2d199bb28)

[How to Build an Enterprise AI Compliance Program](https://medium.com/@tahirbalarabe2/how-to-build-an-enterprise-ai-compliance-program-58aba0861651)

[🕵️How to Monitor AI Models in Production](https://medium.com/@tahirbalarabe2/%EF%B8%8Fhow-to-monitor-ai-models-in-production-2f29820094f3)

[⚙️AWS Well-Architected Best Practices](https://medium.com/@tahirbalarabe2/%EF%B8%8Faws-well-architected-best-practices-5c36c6a9cde6)

[Building Cloud Agnostic Resilience After AWS Outage](https://medium.com/@tahirbalarabe2/building-cloud-agnostic-resilience-after-aws-outage-7dbe1f04becc)

[Building Secure AI Agents with Data Governance](https://medium.com/@tahirbalarabe2/building-secure-ai-agents-with-data-governance-dc7865eab9f7)

[Part 1: Building AI Data Governance](https://medium.com/@tahirbalarabe2/building-ai-data-governance-with-databricks-unity-catalog-e1d5ed4cab2f)

[**Part 2: Building The HR Agent**](https://medium.com/@tahirbalarabe2/build-your-ai-agent-with-tool-calling-5111eab61521)

[Part 3: Evaluating and Deploying the HR Analytics Agent](https://medium.com/@tahirbalarabe2/evaluating-and-deploying-ai-agent-0e878e27cc7f)

[How to Build a Secure Enterprise Sovereign AI Factory with Open-Source.](https://medium.com/@tahirbalarabe2/how-to-build-a-secure-enterprise-sovereign-ai-factory-with-open-source-361990805673)

[Build AI Customer Support Agents with PydanticAI](https://medium.com/@tahirbalarabe2/building-type-safe-ai-agents-with-pydanticai-fee757c6a00f)

[⚙️LangChain vs. LangGraph: A Comparative Analysis](https://medium.com/@tahirbalarabe2/%EF%B8%8Flangchain-vs-langgraph-a-comparative-analysis-ce7749a80d9c)

[🔗What is Model Context Protocol? (MCP) Architecture Overview](https://medium.com/@tahirbalarabe2/deepseek-r1-explained-chain-of-thought-reinforcement-learning-and-model-distillation-0eb165d928c9)

[🚀DeepSeek R1 Explained: Chain of Thought, Reinforcement Learning, and Model Distillation](https://medium.com/@tahirbalarabe2/deepseek-r1-explained-chain-of-thought-reinforcement-learning-and-model-distillation-0eb165d928c9)

[💻What is Ollama: Running Large Language Models Locally](https://medium.com/@tahirbalarabe2/what-is-ollama-running-large-language-models-locally-e917ca40defe)

[Model Context Protocol (MCP) vs. APIs: The New Standard for AI Integration](https://medium.com/@tahirbalarabe2/model-context-protocol-mcp-vs-apis-the-new-standard-for-ai-integration-d6b9a7665ea7)

[🧠Understanding LLM Context Windows: Tokens, Attention, and Challenges](https://medium.com/@tahirbalarabe2/understanding-llm-context-windows-tokens-attention-and-challenges-c98e140f174d)

[How DRIFT Stops Prompt Injection Attacks in LLM Agents](https://medium.com/@tahirbalarabe2/how-drift-stops-prompt-injection-attacks-in-llm-agents-9454368f5e4c)