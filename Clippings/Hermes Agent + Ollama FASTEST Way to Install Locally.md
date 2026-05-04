---
title: "Hermes Agent + Ollama: FASTEST Way to Install Locally"
source: "https://medium.com/data-science-collective/hermes-agent-ollama-fastest-way-to-install-locally-f2b13d958e32"
author:
  - "[[Gao Dalie (高達烈)]]"
published: 2026-03-30
created: 2026-05-04
description: "More"
tags:
  - "clippings"
---
![](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*N8JgYRIBPrWaBHLKtltdqQ.png)

If you don’t have a Medium subscription, use this link to read the full article: [**link**](https://medium.com/@GaoDalie_AI/hermes-agent-ollama-fastest-way-to-install-locally-f2b13d958e32?sk=095b7b6d5ff013464b8051e452d82fc1)

Since the release of OpenClaw, new agents have been created almost every week, making it nearly impossible to try them all. But one new agent has caught the attention of many people, including myself.

It only has 6k stars on GitHub, compared to 307k stars for [**OpenClaw**](https://github.com/openclaw/openclaw) (at the time of writing). However, unlike most other agents, it doesn’t compete on memory usage but focuses on performance. That’s why it might be the only real competitor to OpenClaw in this space.

**In March 2026, a new star emerged in the world of AI agents: Hermes Agent**, developed by Nous Research. It is an open-source agent framework that fundamentally solves this “AI amnesia.”

You might be thinking, “Another new chatbot?” No. This is **a learning AI agent**. The more you use it, the smarter it becomes. The agent can transform what it learns into reusable skills, improve them through experience, store useful information, and even search for previous conversations. This allows it to understand better how you interact in different conversations.

The agent supports multiple platforms, including Telegram, Discord, Slack, WhatsApp, Signal, and CLI through a unified gateway, and is compatible with over 200 model endpoints such as OpenRouter, Nous Portal, OpenAI, and Anthropic. Deployment is extremely flexible — from $5 VPS to GPU clusters, and even serverless architectures with virtually no idle resources.

## Three features of Hermes Agent

### 1\. Skill-Learning Automated — Gets smarter the more you use it.

This is Hermes’s greatest weapon.

For example, suppose you ask Hermes to “deploy a service using Docker.” Hermes will execute the task and **automatically save the steps as a skill**. The next time you’re asked to do a similar task, it will do it faster and more accurately, based on its previous experience.

Moreover, skills **improve on their own**. If you notice during execution, “Oh, this part of my previous skill is outdated,” you correct it yourself.

OpenClaw doesn’t have this mechanism. OpenClaw skills are written and maintained by humans. Hermes is written and fixed by yourself.

### 2\. The Three-Layer Structure of Memory — An AI That Never Forgets

Many AIs forget everything once the conversation is over. Hermes is different.

**MEMORY.md** — A personal memo written by the agent. Record your environment, projects, and preferences.

**USER.md** — Your profile. Name, time zone, communication style.

**Session Search (FTS5)** — Saves all past conversations to SQLite. You can search conversations from several weeks ago.

If you ask, “Do you remember last week’s discussion about Nginx configuration?”, it will search past sessions and answer. There are very few other agents that can do this.

### 3\. You can talk to them from anywhere — 12-channel support

Telegram, Discord, Slack, WhatsApp, Signal, Email/SMS, Home Assistant, Matrix/Mattermost, DingTalk, CLI.

The same agent, with the same memory, responds from any platform. Instructions are given via Telegram in the morning, and progress is checked via Discord at night. It’s seamless.

## How memory works

Hermes Agent’s memory isn’t simply for history storage.

Memory has a three-layered structure: short-term memory, long-term memory, and skill memory, each with a different role. Short-term memory is the most recent conversational context. Long-term memory is the user’s preferences and patterns. Skill memory is reusable skills automatically generated from experience.

This “skill memory” feature is incredibly interesting. For example, if you complete the task “create a progress report every Monday” several times, Hermes Agent will internally save that task as a skill. From then on, it will output the report more efficiently and in a format that suits the user’s preferences.

The more you use it, the more it becomes customized to your specific needs. That’s the essence of self-improvement.

## Multi-platform compatible

Another strength is the wide range of locations where it can operate.

Telegram, Discord, Slack, WhatsApp, and CLI. You can access it from your favorite platform. Plus, memory is shared across platforms, so you can talk to the same “AI that knows you” whether you’re on Discord or Slack.

I tried it with the CLI, but running it as a Telegram bot might be the most practical approach. You can quickly talk to it from your smartphone and get a response that understands the context.

## OpenClaw Vs Hermes Agent

The moment Hermes wins: when you want to use it extensively as your personal companion, when you want to automate repetitive tasks (skill learning comes into play), when voice is needed, and when you want it to run smoothly (20MB vs 200MB+).

OpenClaw wins in these situations: when you want to link multiple AI agents, when you want to benefit from a large community, when you need browser automation or more plugins, and when a proven track record is required.

So which should you choose? The answer is “use both.” We actually operate a fleet of four machines using OpenClaw, and we’re also running the Hermes Agent on one of them.

OpenClaw is the fleet's commander — it excels at multi-agent coordination and multi-channel management. Hermes is your personal advisor — use it one-on-one and cultivate its intelligence to be uniquely yours. They can coexist. In fact, they are coexisting.

## Before we start! 🦸🏻♀️

If you like this topic and you want to support me:

1. **Clap** my article 50 times; that will really help me out.👏
2. [**Follow**](https://medium.com/@mr.tarik098) me on Medium and subscribe to get my latest article for Free🫶
3. Join the family — Subscribe to the [**YouTube channel**](https://www.youtube.com/channel/UC6P5WCWjqhhXVFBqbJHNxyw)

## How to use Hermes Agent

From here, we will explain the steps to actually set up the hermes agent and run the AI agent. Hermes offers WSL for Linux, macOS, or Windows, just like OpenClaw. The best approach is to set it up on a VPS or spare computer. But for this demo, we’re running it locally on a Mac, and it works just fine.

You can install the Hermes agent with a single command:

```rb
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
```

It will create a virtual environment for you, containing all the Python and Node.js dependencies you need.

This is the first screen you see — the setup wizard, showing a simple five-step roadmap. First, you choose your Model and Provider, then set the Terminal Backend, adjust Agent Settings, and connect Messaging Platforms like Telegram or Discord so you can chat with your agent from your phone. Finally, you add Tools like web search or image generation, and once you’re ready, just hit Enter and go through each step.

![](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*ipAWCwqznWsaw2FXIXLI6A.png)

Right away, it detects that we already have OpenClaw installed on this machine — the previous agent tool from Nous Research that Hermes builds on as the next version.

It finds all the data in `~/.openclaw` and offers to migrate everything — your settings, memories, skills, and API keys — in one shot, which saves a lot of time if you're coming from OpenClaw.

![](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*gGeqFyk4iNx_PRcpVKPJjQ.png)

In our case, we start fresh and type **n** to skip, but if you're an existing user, just hit **Y**, and even if you skip now, you can always run the migration later using the `openclaw-migration` skill.

Now we’re picking our inference provider — this is the AI model that powers everything. You’ve got a lot of options, but since we’re going fully local with no API keys or cloud costs, we scroll down and pick **Custom OpenAI-compatible endpoint**, which works with anything that follows the OpenAI API format — and Ollama fits perfectly, so that’s our choice.

![](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*0Q-q0P6Wenk98YtA93NH6g.png)

So here we’re configuring our Ollama endpoint. The base URL is `http://localhost:11434/v1`, which is the local server Ollama runs on your machine using port 11434, and `/v1` is the OpenAI-style API path.

![](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*6wYakSPG4ruIb91ZoZTf7g.png)

We leave the API key blank since everything is running locally with no authentication, then set the model to `gpt-oss:20b` — Microsoft’s 20B parameter model we already pulled into Ollama — and leave the context length empty so Hermes can auto-detect it.

Then in Agent Settings, we set max iterations to 60 so the agent can make up to 60 tool calls per task (you can raise it for longer jobs), turn Tool Progress Display to “all” so you can see everything it’s doing in real time, and leave Context Compression at 0.5 so it summarizes older messages when you hit half the memory limit.

![](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*4ktZ_C9_QHgdUor54apL6g.png)

Finally, for Session Reset Policy in Hermes, it can auto-reset conversations when they get too long or inactive, but it saves important info first — and you can always type `/reset` yourself anytime.

For the session reset, we go with the recommended setup — inactivity plus a daily reset, whichever comes first. We keep the defaults: 1440 minutes (24 hours) of inactivity and a reset at 4 am, which keeps things clean without you having to think about it.

For messaging platforms, we skip everything for now — Telegram, Discord, Slack, Matrix, WhatsApp — all set to no, since we can always come back later and connect them via Hermes when we want to chat from our phone.

![](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*8zvSTwqj_te0RoiN2dWWZQ.png)

Then we hit tools configuration, where the agent really comes to life — web search, browser control, terminal access, file handling, code execution, vision, memory, and more are already enabled by default; we only leave off Mixture of Agents, RL training, and Home Assistant since they need extra setup, and everything else stays on so we’re ready to go.

![](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*K1aDnbuv0lKUlgJZ1hOcOQ.png)

For browser automation, we choose Local Browser — a free headless Chromium that runs on your machine with no setup. For text-to-speech, we keep the default Microsoft Edge TTS since it’s free and already works. And for web search, we skip paid options because Hermes already has built-in DuckDuckGo search.

And that’s it — installation complete. I type **hermes** to launch it, and the dashboard shows all our tools and skills ready to go, but the status bar says Claude instead of our local model. That’s because Hermes defaults to Claude, even if we set up Ollama during setup.

![](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*FHkipliJd6CMJo6_N7wmBw.png)

No problem — we fix it fast. We exit and run **hermes model**, then pick our saved local endpoint, set the model to `gpt-oss:20b`, and confirm the same URL with no API key.

![](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*gUp6YrVp8kXbO2chybnKSg.png)

Now, when we launch Hermes again, the status bar shows `gpt-oss:20b`, which means everything is running locally on our machine — no cloud and no API costs.

Now that we’re fully set up on Ollama, let’s test it. We type a simple message like “hey, how are you doing today?” and the agent responds instantly with a normal greeting.

The status bar shows `gpt-oss:20b`, confirming our local model is replying, not a cloud service, and it shows 9.23K of 131K tokens used — so we have a huge context window — and the response came back in just about 2 seconds, all running on our own hardware

![](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*nyrd8D3PiuZ9YiWWrjBVYQ.png)

## My impression:

To be honest, since it’s v0.2.0, there are still some rough edges. Memory accuracy isn’t perfect, and skill generation sometimes goes in unintended directions.

But this approach itself is incredibly valuable.

Many of the frustrations we feel with AI tools today stem from a “disconnection of context.” Every time we start a new conversation, we have to explain everything from scratch: the project background, our preferences, and the team rules. We have to explain it all every single time.

Hermes Agent addresses this issue head-on. Moreover, it’s open source, and the data is in your hands. From a privacy standpoint, it offers peace of mind.

I believe the next phase of AI assistants is “memory.” Hermes Agent is one of the leading projects in this area. I’m looking forward to future updates.

***🧙♂️ I am an AI Generative expert! If you want to collaborate on a project, drop an*** [***inquiry here***](https://docs.google.com/forms/d/e/1FAIpQLSelxGSNOdTXULOG0HbhM21lIW_mTgq7NsDbUTbx4qw-xLEkMQ/viewform) ***or book a*** [***1-on-1 Consulting***](https://calendly.com/gao-dalie/ai-consulting-call) ***Call With Me.***

## [NVIDIA Nemoclaw + OpenShell: FASTEST Way to Install](https://pub.towardsai.net/nvidia-nemoclaw-openshell-fastest-way-to-install-bbfb82b08ea7?source=post_page-----f2b13d958e32---------------------------------------)

### If you don’t have a Medium subscription, use this link to read the full article: link

pub.towardsai.net

## [Multimodal RAG + Gemini Embedding 2 + GPT-5.4 Just Revolutionized AI Forever](https://pub.towardsai.net/multimodal-rag-gemini-embedding-2-gpt-5-4-just-revolutionized-ai-forever-d60ef8952c06?source=post_page-----f2b13d958e32---------------------------------------)

### During the weekend, I scrolled through Twitter to see what was happening in the AI community. Google has announced its…

pub.towardsai.net

## [I Studied OpenClaw Memory System — Here’s What I Found](https://generativeai.pub/i-studied-openclaw-memory-system-heres-what-i-found-c05c6d50def4?source=post_page-----f2b13d958e32---------------------------------------)

### Over the past year, almost all AI products have been talking about one word: memory.

generativeai.pub