---
name: content-pipeline
description: "Automated content pipeline: Research trending AI topics → Draft pillar article → Submit to felixng.dev as draft via Automation API → Generate social media variants. Human-in-the-Loop: all submissions are drafts."
risk: medium
source: custom
date_added: "2026-05-03"
---

# Content Pipeline Skill v1.0

> **Purpose**: End-to-end daily content automation for Felix Ng's personal brand. Research → Draft → Submit → Social Variants.

## Core Principle: Human-in-the-Loop (HitL)
**NO content is EVER published automatically.** All submissions go as **drafts** (`published: false`). Bear (Felix) reviews and approves at `/en/admin/posts`.

## Required Environment Variables
- `AUTOMATION_API_KEY` — API key for felixng.dev Automation endpoint
- `TAVILY_API_KEY` — Already configured in MCP

## Invocation
Triggered by:
- Cron job (recommended: daily at 08:00 ACST, after trending news)
- Manual: "Run content pipeline" or "Create today's content"

## Execution Process

### Phase 1: Research (5 min)
1. Read today's trending news briefing from `output/trending-news-briefing-YYYY-MM-DD.md`
2. If not available, use Tavily to search for top 5 AI/Tech stories today
3. Select the **#1 highest virality** story as the Pillar Topic
4. Identify a secondary personal angle for a Journal entry

### Phase 2: Pillar Drafting (10 min)
Draft TWO articles in the `output/` folder:

**Article 1: AI News** → `output/YYYY-MM-DD-ai-news.md`
- Type: `AI_NEWS`
- Structure: Hook → Context → Technical Deep Dive → Impact → What's Next
- Length: 800-1200 words
- Language: English
- Tone: Authoritative, data-driven, conversational

**Article 2: Journal** → `output/YYYY-MM-DD-journal.md`
- Type: `JOURNAL`
- Structure: Personal hook → 3-5 insights → Reflection → CTA
- Length: 500-800 words
- Language: English (with Vietnamese touches)
- Tone: Reflective, like talking to a smart friend over coffee

### Phase 3: Submit to Website (2 min)
For each article, call the Automation API:

```bash
AUTOMATION_API_KEY="${AUTOMATION_API_KEY}"
API_URL="https://felixng.vercel.app/api/automation"

# Submit AI News
jq -n \
  --arg title "$TITLE" \
  --arg slug "$(date +%Y-%m-%d)-$SLUG" \
  --arg type "AI_NEWS" \
  --arg content "$(cat output/YYYY-MM-DD-ai-news.md)" \
  '{
    title_en: $title,
    slug: $slug,
    type: $type,
    published: false,
    content_en: $content
  }' | curl -s -X POST "$API_URL" \
  -H "Authorization: Bearer $AUTOMATION_API_KEY" \
  -H "Content-Type: application/json" \
  -d @-
```

**CRITICAL**: Always set `published: false`. Never auto-publish.

### Phase 4: Social Media Variants (5 min)
Generate a single consolidated file: `output/YYYY-MM-DD-social.md`

Include ALL of the following sections:
1. **Twitter/X Thread** (Vietnamese, 5-8 tweets, curiosity hook)
2. **Facebook Post** (Bilingual EN/VI, 300-500 words, story-driven)
3. **Instagram Caption** (Pattern-interrupt hook, hashtags)
4. **TikTok Script** (30-60s spoken script with [VISUAL CUE])
5. **LinkedIn Post** (Professional, builder-focused, NTHacker brand)

### Phase 5: Report and Notify
1. Log results to `antigravity-changelog/CHANGELOG.md`
2. Git commit and push all output files
3. Send summary to Telegram:
   - "Content Pipeline Complete — [Date]"
   - "AI News: [Title] → Draft submitted"
   - "Journal: [Title] → Draft submitted"
   - "Social variants: output/YYYY-MM-DD-social.md"
   - "Review at: https://felixng.vercel.app/en/admin/posts"

## Social Content Rules
- NO bold (**text**) in social content — platforms do not render it
- NO Markdown Headers (#) in social content
- NO ALL CAPS headers — use Title Case + Emojis instead
- Links go in first comment (Facebook), not post body
- Twitter: max 280 chars per tweet, use "↳" for sub-points

## Output Files Summary
```
output/
├── YYYY-MM-DD-trending-briefing.md  ← Input (from trending-news cron)
├── YYYY-MM-DD-ai-news.md            ← Pillar 1
├── YYYY-MM-DD-journal.md            ← Pillar 2
└── YYYY-MM-DD-social.md             ← All social variants
```

## Error Handling
- If Automation API returns non-200: log error, save draft locally, notify Bear via Telegram
- If Tavily unavailable: fall back to wiki sources for research
- If jq not installed: use Node.js fetch pattern instead
