# 📊 Content Package — 18/06/2026 (Topic #2)

## Metadata
- **Topic**: Agent-Reach — Cho AI Agent "Mắt" Để Đọc Reddit, X, YouTube
- **Category**: AI News / Developer Tool
- **Pillar**: Website Article (long-form)
- **Platforms**: Website → Twitter/X → Facebook → Instagram → TikTok → LinkedIn
- **Status**: DRAFT — Awaiting Felix review

---

## 🌐 WEBSITE ARTICLE (Pillar — Vietnamese)

### Agent-Reach: Tool Open-Source Cho AI Agent "Mắt" Để Đọc Reddit, X, YouTube — Miễn Phí

> AI agent của bạn thông minh. Nhưng nó bị mù. Nó không thể đọc Reddit, không biết Twitter đang nói gì, không xem được YouTube. Agent-Reach giải quyết điều đó — và nó hoàn toàn miễn phí.

---

#### Vấn Đề: AI Agent Bị Mù Trước Internet

Bạn có AI agent chạy trong Claude Code, Cursor, hay OpenClaw. Nó viết code giỏi. Nó phân tích data tốt. Nhưng hỏi nó "Reddit đang nói gì về React 20?" — im lặng. Hỏi "Video mới nhất của Fireship nói gì?" — không biết. Hỏi "Trend gì đang viral trên X?" — bó tay.

Đây là nghịch lý lớn nhất của AI agent năm 2026: mô hình ngôn ngữ mạnh nhất thế giới, nhưng bị cắt khỏi nguồn thông tin real-time lớn nhất — internet.

Lý do? Các nền tảng lớn đều khóa API:
- **Twitter/X API**: $100/tháng cho Basic, $5,000/tháng cho Pro
- **Reddit API**: Giới hạn rate limit nghiêm ngặt từ 2023
- **YouTube Data API**: Quota 10,000 units/ngày — hết rất nhanh

Kết quả: agent của bạn sống trong bong bóng, chỉ biết những gì nằm trong training data đã cũ.

#### Agent-Reach Là Gì?

Agent-Reach là tool open-source cho phép AI agent truy cập internet — đọc, search, và scrape dữ liệu từ hơn 13 nền tảng — mà KHÔNG cần API key trả phí.

Nó không phải wrapper. Nó là installer + configurator: cài đặt và cấu hình các tool upstream (như `yt-dlp`, `gh`, `rdt-cli`) trực tiếp vào environment của agent, tạo kết nối ổn định và nhanh.

**Hỗ trợ 13+ nền tảng:**

| Nhóm | Nền tảng |
|------|----------|
| Social & Media | Twitter/X, Reddit, YouTube, Instagram, LinkedIn |
| Châu Á | Bilibili, XiaoHongShu (Tiểu Hồng Thư), Douyin |
| Dev & Web | GitHub, RSS feeds, Web search (Exa) |

**Tương thích với:**
- Claude Code, Cursor, Windsurf, OpenClaw
- MCP (Model Context Protocol)
- Mọi AI agent framework dùng CLI

#### Cài Đặt Trong 2 Phút

**Cách 1: Qua CLI (Python)**
```bash
pip install agent-reach
agent-reach install --env=auto
```

Nếu dùng macOS với Homebrew (PEP 668):
```bash
python3 -m venv ~/.agent-reach-venv
source ~/.agent-reach-venv/bin/activate
pip install agent-reach
agent-reach install --env=auto
```

**Cách 2: Như Agent Skill (cho Claude Code/Cursor)**
```bash
npx skills add Panniantong/Agent-Reach@agent-reach
```

**Kiểm tra sức khỏe:**
```bash
agent-reach doctor
```

Lệnh `doctor` kiểm tra tất cả kênh (Twitter, Reddit, YouTube...) đã configured đúng chưa, dependencies có thiếu không, và tự fix nếu cần.

#### 3 Workflows Thực Tế Bạn Có Thể Dùng Ngay

**Workflow 1: Research-to-Content (Mình đang dùng cho bản tin này)**

Mỗi sáng, agent của mình:
1. Search Twitter/X và Reddit cho keywords "AI news", "developer tools", "trending"
2. Fetch top threads và posts có engagement cao nhất
3. Tóm tắt, phân loại theo chủ đề
4. Draft bản tin AI hàng ngày

Trước Agent-Reach: mất 2-3 giờ manual research. Sau: 15 phút agent tự chạy, mình chỉ review và edit.

**Workflow 2: Competitive Intelligence**

Theo dõi đối thủ tự động:
1. Monitor GitHub repos của competitor (new releases, issues)
2. Track brand mentions trên Reddit và X
3. Fetch YouTube reviews về sản phẩm đối thủ
4. Generate "Impact Report" hàng tuần

**Workflow 3: Multi-Agent Collaboration**

Chia team agent ra vai trò riêng:
- **Researcher Agent**: Dùng Agent-Reach pull raw data từ các nền tảng
- **Analyst Agent**: Tìm patterns và anomalies trong data
- **Writer Agent**: Chuyển analysis thành report hoặc content

Đây là đúng workflow mà Felix AI Daily đang dùng.

#### So Sánh Với Các Tool Khác

| Tool | Loại | Ưu điểm | Nhược điểm |
|------|------|---------|------------|
| **Agent-Reach** | CLI/Skill | Free, 13+ platforms, self-healing | Cần config cookie cho một số platform |
| **Browser-Use** | Browser automation | Full browser control, dynamic sites | Nặng, chậm, tốn tài nguyên |
| **Crawl4AI** | Self-hosted crawler | Mạnh cho RAG pipeline | Chỉ crawl web, không social media |
| **Firecrawl** | Hosted + OSS | Reliable, LLM-ready markdown | Trả phí cho hosted, giới hạn free tier |
| **Unbrowse** | Shadow API discovery | Nhanh, structured JSON | Mới, ít documentation |

**Verdict**: Agent-Reach thắng ở breadth (13+ platforms) và cost ($0). Browser-Use thắng ở depth (full browser control). Crawl4AI thắng ở RAG pipeline. Tùy use case mà chọn — hoặc dùng kết hợp.

#### Privacy & Lưu Ý

Agent-Reach lưu cookies và login data local, không upload lên đâu. Nhưng vài điểm cần nhớ:

- Cookies cho Twitter/X và XiaoHongShu cần handle cẩn thận
- Một số platform có anti-scraping — `agent-reach doctor` sẽ cảnh báo
- Luôn kiểm tra Terms of Service của nền tảng bạn scrape
- Tool auto-update để đối phó platform changes

#### Tại Sao Điều Này Quan Trọng?

Agent-Reach không chỉ là tool. Nó đại diện cho một xu hướng lớn hơn: **AI agent cần internet access để thực sự hữu ích.**

Năm 2025, agent chỉ cần đọc code và viết code. Năm 2026, agent cần hiểu context — và context sống trên internet: Reddit discussions, Twitter threads, YouTube tutorials, GitHub issues.

MCP giải quyết bài toán "kết nối tool". ARD (Agentic Resource Discovery) giải quyết bài toán "tìm tool". Agent-Reach giải quyết bài toán "đọc internet". Ba tầng này kết hợp = agent tự trị thực sự.

**Câu hỏi không còn là "AI có thể code không?" — mà là "AI có thể research không?"**

Agent-Reach nói: Có. Và miễn phí.

🔗 GitHub: [github.com/Panniantong/Agent-Reach](https://github.com/Panniantong/Agent-Reach)

---

## 🐦 TWITTER/X THREAD (Vietnamese)

**Tweet 1 (Hook):**
AI agent của bạn viết code giỏi. Nhưng nó bị MÙ.

Hỏi "Reddit đang nói gì?" → im lặng
Hỏi "Trend gì trên X?" → không biết
Hỏi "Video Fireship mới nhất?" → bó tay

Agent-Reach fix điều đó. Miễn phí. Open-source. 🧵

**Tweet 2:**
Vấn đề:
↳ Twitter/X API: $100-$5,000/tháng
↳ Reddit API: Rate limit nghiêm ngặt
↳ YouTube API: 10,000 units/ngày — hết rất nhanh

Agent thông minh nhất thế giới mà bị cắt khỏi internet = vô dụng với real-time data.

**Tweet 3:**
Agent-Reach = "đôi mắt" cho AI agent

↳ 13+ nền tảng: X, Reddit, YouTube, GitHub, Bilibili, XiaoHongShu...
↳ $0 API fees
↳ Tương thích: Claude Code, Cursor, OpenClaw
↳ Hỗ trợ MCP
↳ Self-healing: tự fix khi platform thay đổi

**Tweet 4:**
Cài đặt trong 30 giây:

pip install agent-reach
agent-reach install --env=auto
agent-reach doctor

Hoặc như Agent Skill:
npx skills add Panniantong/Agent-Reach@agent-reach

Xong. Agent của bạn giờ đọc được internet.

**Tweet 5:**
Workflow mình đang dùng cho bản tin AI hàng ngày:

1️⃣ Agent search X + Reddit cho "AI news"
2️⃣ Fetch top posts có engagement cao
3️⃣ Tóm tắt + phân loại theo chủ đề
4️⃣ Draft bản tin

Trước: 2-3 giờ manual. Sau: 15 phút agent tự chạy.

**Tweet 6:**
So sánh nhanh:
↳ Agent-Reach: Free, 13+ platforms, social media focus
↳ Browser-Use: Full browser control, nặng hơn
↳ Crawl4AI: Mạnh cho RAG, chỉ web
↳ Firecrawl: Reliable nhưng trả phí

Agent-Reach thắng ở breadth + cost. Dùng kết hợp là best.

**Tweet 7 (CTA):**
AI agent không chỉ cần viết code. Nó cần RESEARCH.

MCP = kết nối tool
ARD = tìm tool
Agent-Reach = đọc internet

Ba tầng này = agent tự trị thực sự.

GitHub: github.com/Panniantong/Agent-Reach

Bạn đang cho agent đọc internet chưa? 👇

Follow @felixng

---

## 📘 FACEBOOK POST (Bilingual EN/VI)

**🇬🇧 ENGLISH:**

Your AI agent is smart. But it's blind.

It can write code, analyze data, even generate entire applications. But ask it "What's trending on Reddit right now?" — silence. "What did that YouTube video say?" — no idea. "What are developers complaining about on X?" — crickets.

This is the biggest paradox of AI agents in 2026: the most powerful language models ever built, completely cut off from the largest real-time information source — the internet.

Why? Because platform APIs are expensive ($100-$5,000/month for Twitter alone) or severely rate-limited.

Enter Agent-Reach: an open-source tool that gives your AI agent "eyes" to read 13+ platforms — Twitter/X, Reddit, YouTube, GitHub, Bilibili, and more — for $0.

I've been using it for my daily AI news workflow:
1. Agent searches X + Reddit for AI news keywords
2. Fetches top threads with highest engagement
3. Summarizes and categorizes by topic
4. Drafts the daily briefing

Before: 2-3 hours of manual research. After: 15 minutes, agent does it all.

The question has shifted from "Can AI code?" to "Can AI research?" Agent-Reach says yes.

---

**🇻🇳 TIẾNG VIỆT:**

AI agent của bạn rất thông minh. Nhưng nó bị mù.

Nó viết code giỏi, phân tích data tốt, thậm chí generate cả ứng dụng. Nhưng hỏi "Reddit đang nói gì?" — im lặng. Hỏi "Video YouTube đó nói gì?" — không biết. Hỏi "Developer đang than phiền gì trên X?" — bó tay.

Đây là nghịch lý lớn nhất của AI agent 2026: mô hình ngôn ngữ mạnh nhất lịch sử, nhưng bị cắt khỏi internet.

Lý do? API nền tảng quá đắt ($100-$5,000/tháng chỉ riêng Twitter) hoặc bị giới hạn nghiêm ngặt.

Agent-Reach — tool open-source cho agent "đôi mắt" để đọc 13+ nền tảng: Twitter/X, Reddit, YouTube, GitHub, Bilibili... hoàn toàn miễn phí.

Mình đang dùng nó cho workflow bản tin AI hàng ngày:
1. Agent search X + Reddit cho AI news
2. Fetch top posts có engagement cao
3. Tóm tắt + phân loại
4. Draft bản tin

Trước: 2-3 giờ research thủ công. Sau: 15 phút agent tự chạy.

Câu hỏi không còn là "AI có code được không?" mà là "AI có research được không?" Agent-Reach nói: Có.

GitHub: github.com/Panniantong/Agent-Reach

Bạn đang dùng AI agent cho research chưa? Share cho mình biết! 👇

*Link in first comment*

---

## 📸 INSTAGRAM

### Caption:
AI agent của bạn viết code giỏi. Nhưng nó bị MÙ 🙈

Hỏi "Reddit nói gì?" → im lặng
Hỏi "Trend gì trên X?" → không biết

Agent-Reach = "đôi mắt" cho AI agent
↳ 13+ platforms: X, Reddit, YouTube, GitHub...
↳ $0 API fees
↳ Open-source

Swipe để xem cách mình dùng nó cho bản tin AI hàng ngày 👉

Trước: 2-3 giờ research. Sau: 15 phút agent tự chạy ⚡

.
.
.
#AI #AIagent #AgentReach #DeveloperTools #OpenSource #AIcoding #TechNews #FelixAIDaily #Automation #WebScraping

### Carousel Outline (7 slides):

**Slide 1 — Hook:**
"AI AGENT CỦA BẠN BỊ MÙ 🙈"
Subtitle: Nó code giỏi nhưng không đọc được internet

**Slide 2 — The Problem:**
"Tại sao agent bị mù?"
↳ Twitter/X API: $100-$5,000/tháng
↳ Reddit API: Rate limit nghiêm ngặt
↳ YouTube API: 10,000 units/ngày
= Agent thông minh nhất, bị cắt khỏi internet

**Slide 3 — The Solution:**
"Agent-Reach = 'Đôi mắt' cho AI"
↳ 13+ platforms
↳ X, Reddit, YouTube, GitHub, Bilibili...
↳ $0 — hoàn toàn miễn phí
↳ Open-source + self-healing

**Slide 4 — Install:**
"Cài đặt trong 30 giây"
pip install agent-reach
agent-reach install
agent-reach doctor ✅

**Slide 5 — My Workflow:**
"Workflow bản tin AI hàng ngày"
1️⃣ Agent search X + Reddit
2️⃣ Fetch top posts
3️⃣ Tóm tắt + phân loại
4️⃣ Draft bản tin
⏱ Trước: 2-3h → Sau: 15 phút

**Slide 6 — Comparison:**
"So sánh tools"
Agent-Reach: Free, 13+ platforms ✅
Browser-Use: Full browser, nặng
Crawl4AI: RAG focus, chỉ web
Firecrawl: Trả phí

**Slide 7 — CTA:**
"AI cần CODE + RESEARCH"
MCP = kết nối tool
ARD = tìm tool
Agent-Reach = đọc internet
Follow @felixng.dev cho AI tools mỗi ngày 🧠

### Reel Idea (30s):
[VISUAL: Terminal screen, agent running]
"AI agent của bạn viết code giỏi..."
[VISUAL: Agent returning blank/error]
"...nhưng hỏi Reddit nói gì? Im lặng."
[VISUAL: Agent-Reach logo + install command]
"Agent-Reach — cho agent đôi mắt"
[VISUAL: Split screen — 13 platform logos appearing]
"13 nền tảng. Miễn phí. Open-source."
[VISUAL: Before/After workflow comparison]
"Research 2 giờ → 15 phút"
[TEXT OVERLAY: Follow for more AI tools]

---

## 🎵 TIKTOK SCRIPT (30-40s)

[0-2s HOOK — Nói thẳng vào camera, giọng bất ngờ]
"AI agent của bạn bị MÙ. Mình nói thật."

[2-6s CONTEXT]
"Nó viết code giỏi lắm. Nhưng hỏi 'Reddit đang nói gì?' — im lặng. Vì Twitter API tốn 5 ngàn đô một tháng."

[6-15s GIẢI PHÁP]
[VISUAL CUE: Hiện terminal + agent-reach install]
"Agent-Reach fix điều đó. Cài 30 giây. Miễn phí. Agent đọc được 13 nền tảng: X, Reddit, YouTube, GitHub..."

[15-25s USE CASE CÁ NHÂN]
[VISUAL CUE: Hiện workflow diagram]
"Mình dùng nó cho bản tin AI hàng ngày. Trước mất 2-3 tiếng research tay. Giờ agent tự search, tự fetch, tự tóm tắt. 15 phút xong."

[25-35s KEY INSIGHT]
[VISUAL CUE: Text overlay — MCP + ARD + Agent-Reach]
"AI không chỉ cần code. Nó cần research. Agent-Reach cho nó đôi mắt. Miễn phí. Open-source."

[35-40s CTA]
[VISUAL CUE: Follow + Like overlay]
"Link GitHub trong bio. Follow để biết thêm AI tools hay mỗi ngày!"

---

## 💼 LINKEDIN POST (English — NTHacker brand)

AI agents in 2026 have a paradox that most engineering teams ignore:

They can write code, refactor architectures, and generate entire features. But they cannot read a Reddit thread, check what developers are saying on X, or summarize a YouTube tutorial.

The most powerful language models ever built — completely blind to real-time internet data.

Why? Because platform APIs are either expensive (Twitter/X: $100-$5,000/month), rate-limited (Reddit, YouTube), or locked behind enterprise agreements.

This is a structural problem, and it affects every team building AI-augmented workflows.

Agent-Reach is an open-source tool that solves this. Here is what it does and why it matters for engineering leaders:

1 What it is

A CLI tool and agent skill that installs lightweight scrapers for 13+ platforms — Twitter/X, Reddit, YouTube, GitHub, Bilibili, XiaoHongShu, and more. Zero API fees. Compatible with Claude Code, Cursor, OpenClaw, and any MCP-enabled framework.

2 Why it matters

The shift from "AI-assisted coding" to "AI-assisted research" is the next frontier. Your agents need to understand context — and context lives on the internet: Reddit discussions, X threads, YouTube walkthroughs, GitHub issues.

Without internet access, your agent is making decisions based on stale training data. That is a liability, not an advantage.

3 Real workflow impact

I use Agent-Reach for my daily AI news production:
↳ Agent searches X + Reddit for target keywords
↳ Fetches top-performing threads by engagement
↳ Summarizes and categorizes findings
↳ Drafts the briefing for human review

Time saved: from 2-3 hours of manual research to 15 minutes of automated pipeline.

4 The bigger picture

Three layers are converging to create truly autonomous agents:
↳ MCP (Model Context Protocol) = connect tools
↳ ARD (Agentic Resource Discovery) = discover tools
↳ Agent-Reach = read the internet

When your agent can connect, discover, and research — it stops being a "code autocomplete" and starts being a genuine knowledge worker.

5 Considerations

↳ Privacy: Cookies and auth data are stored locally
↳ Compliance: Always verify platform ToS before deploying
↳ Self-healing: Built-in diagnostics (agent-reach doctor) handle platform changes

The question for every engineering leader: Are your agents building with yesterday's context or today's reality?

GitHub: github.com/Panniantong/Agent-Reach

What tools are you using to give your agents internet access? Curious to hear your stack.

---

*Content Package created: 18/06/2026 20:35 ICT*
*Status: DRAFT — Awaiting Felix approval*
*Next: Felix review → Cover image generation → Automation API submission*
