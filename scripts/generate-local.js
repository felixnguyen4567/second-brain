/**
 * Local Content Pipeline v3.0 - generate-local.js
 * Automates content production, double-loop critique/refinement, 
 * website draft submissions, and dashboard post queuing.
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const Database = require('better-sqlite3');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Setup configurations
const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
const AUTOMATION_API_KEY = process.env.AUTOMATION_API_KEY;
const VERCEL_API_URL = 'https://felixng.vercel.app/api/automation';

const DB_PATH = path.join(__dirname, '../../openclaw-dashboard/openclaw.db');
const BRIEF_HISTORY_DIR = path.join(__dirname, '../skills/daily-news-brief/history');

// Weekly Matrix Pillars v2.1 Configuration
const WEEKLY_PILLARS = {
  1: { type: 'AI_NEWS', pillar: 'Model Releases (AI News)', journal: 'Building in Public (Journal)', description: 'Latest LLM, voice, vision, and agent model drops' },
  2: { type: 'AI_NEWS', pillar: 'Agentic AI (AI News)', journal: 'Developer Tools (Journal)', description: 'AI agents, multi-agent frameworks, computer use, and coding assistants' },
  3: { type: 'AI_NEWS', pillar: 'Industry Apps (AI News)', journal: 'AI Perspectives (Journal)', description: 'Enterprise AI adoption, SaaS integration, and AI-enabled product showcases' },
  4: { type: 'AI_NEWS', pillar: 'Open Source (AI News)', journal: 'Tech Deep Dives (Journal)', description: 'OSS models, tools, and developer libraries' },
  5: { type: 'AI_NEWS', pillar: 'Ethics & Safety (AI News)', journal: 'Weekly Reflection (Journal)', description: 'AI regulations, alignment, safety standoffs, and weekly summaries' },
};

// Default fallback pillars if weekend
const DEFAULT_PILLAR = WEEKLY_PILLARS[2]; // Tuesday: Agentic AI / Developer Tools

// CLI argument parsing
const args = require('minimist')(process.argv.slice(2));
const optType = args.type; // AI_NEWS or JOURNAL
const optPillar = args.pillar; // Custom pillar name
const optTopic = args.topic; // Direct topic bypass
const optTavily = args.tavily || false; // Force Tavily
const optNewsBrief = args['news-brief'] || false; // Force Brief
const optDryRun = args['dry-run'] || false; // Dry run (no Vercel / DB writing)

async function main() {
  console.log('♟️  Starting Local Content Pipeline v3.0...');
  
  if (!MINIMAX_API_KEY && !GEMINI_API_KEY && !OPENAI_API_KEY && !OPENROUTER_API_KEY) {
    console.error('❌ No active LLM API keys found in .env! Please define at least one of: MINIMAX_API_KEY, GEMINI_API_KEY, OPENAI_API_KEY, or OPENROUTER_API_KEY.');
    process.exit(1);
  }

  // 1. Perform self-healing database migrations if database exists and not in dry-run mode
  if (!optDryRun) {
    try {
      runDatabaseMigration();
    } catch (err) {
      console.error('⚠️ Database migration failed:', err.message);
      console.log('Proceeding anyway (dashboard sync might be limited)...');
    }
  } else {
    console.log('⚠️ Running in DRY-RUN mode. No database or external API writes will occur.');
  }

  // 2. Select today's pillar
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 is Sunday, 6 is Saturday, 1-5 is Mon-Fri
  const schedule = WEEKLY_PILLARS[dayOfWeek] || DEFAULT_PILLAR;

  const contentType = optType || (Math.random() > 0.5 ? 'AI_NEWS' : 'JOURNAL');
  const pillarName = optPillar || (contentType === 'AI_NEWS' ? schedule.pillar : schedule.journal);
  
  console.log(`📅 Today's Date: ${today.toDateString()} (Day ${dayOfWeek})`);
  console.log(`📌 Selected Content Type: ${contentType}`);
  console.log(`📌 Selected Pillar Focus: ${pillarName}`);

  // 3. Source Topic (News Brief or Tavily or custom direct topic)
  let topic = '';
  let sourceSummary = '';
  let sourceUrl = '';

  if (optTopic) {
    console.log(`📝 Custom Topic Override: "${optTopic}"`);
    topic = optTopic;
    if (optTavily && TAVILY_API_KEY) {
      console.log(`🔍 Sourcing context via Tavily search for custom topic: "${optTopic}"...`);
      const searchResults = await searchTavily(optTopic);
      sourceSummary = searchResults.map(r => `Source: ${r.title}\nURL: ${r.url}\nContent: ${r.content}`).join('\n\n');
    } else {
      sourceSummary = `Manually provided topic: ${optTopic}`;
    }
  } else {
    const useNewsBrief = optNewsBrief || (!optTavily && fs.existsSync(BRIEF_HISTORY_DIR));
    
    if (useNewsBrief) {
      console.log(`📰 Sourcing from local Daily News Brief history...`);
      const briefData = readLatestNewsBrief();
      if (briefData) {
        console.log(`📄 Found latest brief file: ${briefData.filename}`);
        const parsedTopic = await parseTopicFromBrief(briefData.content, pillarName);
        if (parsedTopic) {
          topic = parsedTopic.title;
          sourceSummary = parsedTopic.description;
          console.log(`✨ Selected story from brief: "${topic}"`);
        }
      }
    }

    // Fallback or explicit Tavily
    if (!topic) {
      if (!TAVILY_API_KEY) {
        console.error('❌ No Tavily key or news brief available to fetch topic. Please provide --topic.');
        process.exit(1);
      }
      console.log(`🔍 Sourcing topic via Tavily search for "${pillarName} recent trends 2026"...`);
      const searchResults = await searchTavily(`${pillarName} news trends 2026`);
      if (searchResults && searchResults.length > 0) {
        const parsedTopic = await parseTopicFromTavily(searchResults, pillarName);
        if (parsedTopic) {
          topic = parsedTopic.title;
          sourceSummary = parsedTopic.description;
          sourceUrl = parsedTopic.url || searchResults[0].url;
          console.log(`✨ Selected story from Tavily: "${topic}"`);
        }
      }
    }
  }

  if (!topic) {
    console.error('❌ Failed to source a topic. Exiting.');
    process.exit(1);
  }

  // 4. Double-Loop Critique & Refinement
  console.log('\n--- 🔄 LOOP 1: Drafting Initial Article ---');
  const initialDraft = await runDraftingLoop(contentType, pillarName, topic, sourceSummary);
  console.log(`✅ Loop 1 Complete. Initial draft word count: ${initialDraft.split(/\s+/).length} words.`);

  console.log('\n--- 🔄 LOOP 2: Editor-in-Chief Critique ---');
  const critique = await runCritiqueLoop(initialDraft, pillarName, topic);
  console.log('📣 Editor Critique Summary:');
  console.log(critique.slice(0, 300) + '...\n');

  console.log('\n--- 🔄 LOOP 3: High-Fidelity Refinement ---');
  const refinedArticle = await runRefinementLoop(initialDraft, critique, pillarName, topic);
  console.log(`✅ Loop 3 Complete. Refined article word count: ${refinedArticle.split(/\s+/).length} words.`);

  // 5. Generate cover image prompt and construct Pollinations AI image URL
  console.log('\n--- 🎨 Generating Premium Visual Concept ---');
  const coverImageUrl = await generatePollinationsImageUrl(topic, refinedArticle);
  console.log(`🖼️ Constructed dynamic cover URL: ${coverImageUrl}`);

  // 6. Generate 5 Social Media repurposing variants (plain-text, clean)
  console.log('\n--- 📢 Repurposing into 5 Social Channels ---');
  const socialCopies = await generateSocialVariants(refinedArticle, topic);
  console.log('✓ Twitter/X (VI):', socialCopies.x.slice(0, 80) + '...');
  console.log('✓ Facebook (EN/VI):', socialCopies.fb.slice(0, 80) + '...');
  console.log('✓ LinkedIn (EN):', socialCopies.li.slice(0, 80) + '...');
  console.log('✓ Instagram (EN):', socialCopies.ig.slice(0, 80) + '...');
  console.log('✓ TikTok (EN):', socialCopies.tt.slice(0, 80) + '...');

  // Slug generation helper
  const slug = topic.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  // 7. Save generation results locally (Always, even in dry-run)
  const todayStr = today.toISOString().split('T')[0];
  const outputFilename = `${todayStr}-social.md`;
  const outputDir = path.join(__dirname, '../output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const outputPath = path.join(outputDir, outputFilename);

  const archiveMarkdown = `# Content Production Log | ${todayStr}

## 🎯 Topic: ${topic}
- **Type**: ${contentType}
- **Pillar**: ${pillarName}
- **Slug**: ${slug}
- **Cover Image**: ${coverImageUrl}

---

## 📝 Refined Article (Website Draft)

${refinedArticle}

---

## 📢 Multi-Channel Social Content

### 🐦 Twitter/X (Vietnamese)
${socialCopies.x}

### 📘 Facebook (Bilingual English/Vietnamese)
${socialCopies.fb}

### 💼 LinkedIn (Professional English)
${socialCopies.li}

### 📸 Instagram (English Carousel Hooks)
${socialCopies.ig}

### 🎵 TikTok (Spoken Script)
${socialCopies.tt}

---

## 🕵️‍♂️ Loop Diagnostics

### 📝 Loop 1: Initial Draft
${initialDraft}

### 📣 Loop 2: Editor-in-Chief Critique
${critique}
`;

  fs.writeFileSync(outputPath, archiveMarkdown, 'utf8');
  console.log(`💾 Saved complete content generation log to: output/${outputFilename}`);

  // 8. Submit draft to Website API & local Dashboard SQLite database
  if (!optDryRun) {
    // Website API Post
    if (AUTOMATION_API_KEY) {
      console.log('\n🚀 Submitting draft to Felix\'s website...');
      await submitDraftToWebsite(topic, slug, refinedArticle, contentType, coverImageUrl);
    } else {
      console.log('⚠️ Skipping website submission (AUTOMATION_API_KEY is not defined).');
    }

    // SQLite Dashboard Post
    console.log('\n📊 Queuing post directly in OpenClaw Dashboard...');
    await queueInDashboard(topic, socialCopies, coverImageUrl);
  }

  console.log('\n♟️  Content Pipeline execution complete! Have a fantastic day, Sếp Bear! ♟️');
}

// ==========================================
// 🛡️ DATABASE MIGRATIONS & SYNC
// ==========================================

function runDatabaseMigration() {
  console.log(`📂 Connecting to OpenClaw Dashboard Database at: ${DB_PATH}`);
  if (!fs.existsSync(DB_PATH)) {
    console.log('⚠️ SQLite database file not found. Skipping DB migration.');
    return;
  }

  const db = new Database(DB_PATH);
  
  // Verify columns in social_posts table
  const columns = db.prepare("PRAGMA table_info(social_posts)").all();
  const columnNames = columns.map(c => c.name);
  
  const requiredColumns = [
    'content_fb',
    'content_ig',
    'content_x',
    'content_li',
    'content_threads'
  ];

  requiredColumns.forEach(col => {
    if (!columnNames.includes(col)) {
      console.log(`🔧 Migrating: Adding missing column '${col}' to table 'social_posts'...`);
      db.prepare(`ALTER TABLE social_posts ADD COLUMN ${col} TEXT`).run();
    }
  });

  db.close();
  console.log('✅ SQLite database schema verified and migrated (Self-Healed).');
}

async function queueInDashboard(topic, socialCopies, coverImageUrl) {
  try {
    if (!fs.existsSync(DB_PATH)) {
      console.error('❌ Could not queue in dashboard: SQLite database file does not exist.');
      return;
    }

    const db = new Database(DB_PATH);

    // Standardized content title block that matches openclaw-dashboard matcher
    const structuredContent = `🎯 TIÊU ĐIỂM: ${topic}\n\n📝 CHI TIẾT: ${socialCopies.li.slice(0, 300)}...`;
    const mediaUrls = JSON.stringify([coverImageUrl]);

    const stmt = db.prepare(`
      INSERT INTO social_posts (
        content, media_urls, 
        content_fb, content_ig, content_x, content_li, content_threads,
        platform_fb_status, platform_ig_status, platform_x_status, platform_li_status, platform_threads_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      structuredContent,
      mediaUrls,
      socialCopies.fb,
      socialCopies.ig,
      socialCopies.x,
      socialCopies.li,
      socialCopies.threads, // Use high-fidelity Threads split thread
      'pending',
      'pending',
      'pending',
      'pending',
      'pending'
    );

    db.close();
    console.log('✅ Successfully queued social post directly in July Dashboard DB!');
  } catch (error) {
    console.error('❌ Failed to queue post in dashboard:', error.message);
  }
}

// ==========================================
// 📰 NEWS BRIEF & TAVILY TOPIC SOURCING
// ==========================================

function readLatestNewsBrief() {
  try {
    if (!fs.existsSync(BRIEF_HISTORY_DIR)) {
      return null;
    }

    const files = fs.readdirSync(BRIEF_HISTORY_DIR)
      .filter(f => f.endsWith('.md'))
      .sort()
      .reverse();

    if (files.length === 0) {
      return null;
    }

    const latestFile = files[0];
    const fullPath = path.join(BRIEF_HISTORY_DIR, latestFile);
    const content = fs.readFileSync(fullPath, 'utf8');

    return {
      filename: latestFile,
      content: content
    };
  } catch (err) {
    console.error('Error reading latest news brief:', err.message);
    return null;
  }
}

async function searchTavily(query) {
  try {
    const response = await axios.post('https://api.tavily.com/search', {
      api_key: TAVILY_API_KEY,
      query: query,
      search_depth: 'advanced',
      include_answer: false,
      max_results: 5
    });
    return response.data.results || [];
  } catch (err) {
    console.error('Tavily search error:', err.message);
    return [];
  }
}

// ==========================================
// 🤖 MINIMAX COMPLETIONS UTILITY
// ==========================================

async function callMiniMax(systemPrompt, userPrompt, jsonMode = false) {
  let url = '';
  let key = '';
  let model = '';
  let providerName = '';

  if (process.env.GEMINI_API_KEY) {
    providerName = 'Google Gemini (OpenAI-compatible)';
    url = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';
    key = process.env.GEMINI_API_KEY;
    model = 'gemini-2.5-flash';
  } else if (process.env.OPENAI_API_KEY) {
    providerName = 'OpenAI';
    url = 'https://api.openai.com/v1/chat/completions';
    key = process.env.OPENAI_API_KEY;
    model = 'gpt-4o';
  } else if (process.env.OPENROUTER_API_KEY) {
    providerName = 'OpenRouter';
    url = 'https://openrouter.ai/api/v1/chat/completions';
    key = process.env.OPENROUTER_API_KEY;
    model = 'meta-llama/llama-3.1-70b-instruct';
  } else if (process.env.MINIMAX_API_KEY) {
    providerName = 'MiniMax';
    url = 'https://api.minimax.io/v1/chat/completions';
    key = process.env.MINIMAX_API_KEY;
    model = 'MiniMax-M2.7';
  } else {
    throw new Error('No LLM API keys found in environment or .env file!');
  }

  try {
    const response = await axios.post(
      url,
      {
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        }
      }
    );

    const reply = response.data.choices[0].message.content;
    return reply;
  } catch (err) {
    console.error(`❌ LLM Provider ${providerName} API Call Error:`, err.response ? err.response.data : err.message);
    throw err;
  }
}

// ==========================================
// 🔬 TOPIC & ARTICLE GENERATION LOOPS
// ==========================================

async function parseTopicFromBrief(briefContent, pillarName) {
  const systemPrompt = `You are a professional news analyst. Review the provided daily news brief and extract the single most high-virality, interesting, and technical AI/Tech story that closely matches the pillar focal area: "${pillarName}". 
Your output MUST be a valid JSON block containing:
{
  "title": "A short compelling headline in professional English",
  "description": "A comprehensive summary of the story including all technical specifications, context, and key numbers."
}`;

  const userPrompt = `DAILY NEWS BRIEFING:\n\n${briefContent}`;
  const response = await callMiniMax(systemPrompt, userPrompt);
  
  try {
    // Extract JSON block in case LLM added markdown wrappers
    const jsonStr = response.match(/\{[\s\S]*\}/)?.[0] || response;
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error('Failed to parse JSON topic from news brief. Raw response:', response);
    return { title: 'AI Advancements in 2026', description: 'Advanced AI and tech capabilities shaping engineering workflows.' };
  }
}

async function parseTopicFromTavily(tavilyResults, pillarName) {
  const systemPrompt = `You are a professional technical researcher. Review these web search results and synthesize them to select the most significant, technical, and impactful story that represents the pillar focus: "${pillarName}".
Your output MUST be a valid JSON block containing:
{
  "title": "A sleek professional English headline for the story",
  "description": "Detailed explanation of the findings, numbers, architectures, and facts.",
  "url": "The most authoritative reference URL from the provided results"
}`;

  const userPrompt = `SEARCH RESULTS:\n\n${JSON.stringify(tavilyResults, null, 2)}`;
  const response = await callMiniMax(systemPrompt, userPrompt);

  try {
    const jsonStr = response.match(/\{[\s\S]*\}/)?.[0] || response;
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error('Failed to parse JSON topic from Tavily. Raw response:', response);
    return { 
      title: `Latest breakthroughs in ${pillarName}`, 
      description: 'Recent industrial movements and frameworks.',
      url: tavilyResults[0]?.url || ''
    };
  }
}

async function runDraftingLoop(contentType, pillarName, topic, summary) {
  const systemPrompt = `You are an elite B2B technology analyst, senior software architect, and viral tech essayist.
Your writing style is inspired by premium tech publications like Stratechery, Wired, and high-signal engineering blogs. It must be calm, premium, precise, deeply technical, yet incredibly captivating.

CRITICAL COPYWRITING UPGRADES (TO AVOID DRY/BORING TONE):
1. **Steel Hook Opening**: Do NOT start with introductions, summaries, or passive greetings (e.g. "Let's explore", "In this post, we delve"). Start directly at the first sentence with a powerful B2B hook:
   - Framework A (The Contrarian Take): Challenge a common industry belief: "90% of enterprises are lãng phí hàng triệu đô vào X. Nhưng thực tế kỹ thuật là Y..."
   - Framework B (The Engineering Agitation): "Building system X is easy. Running it at 100k QPS without blowing up your database is a structural nightmare. Here is how it breaks."
2. **Deep Technical Truth**: Back up every claim with concrete system architectures, API schemas, code-like structures, or flowcharts. Focus on tradeoffs, bottlenecks, and engineering realities.
3. **Punchy Active Voice**: Write in direct, active voice. Short paragraphs, wide spacing. No fluffy buzzwords ("digital transformation", "revolutionize", "testament to").
4. **Descriptive Subtitles**: Every subtitle header (##) must be highly descriptive and intriguing (e.g., "## The Stacking Problem: Why 3D Silicon Fails at 5GHz" instead of "## Technical Background").`;

  const userPrompt = `TOPIC CONTEXT SUMMARY:\n${summary}`;
  return await callMiniMax(systemPrompt, userPrompt);
}

async function runCritiqueLoop(draftText, pillarName, topic) {
  const systemPrompt = `You are the demanding, ruthless, and highly critical Editor-in-Chief of a premier tech publication (like Wired or Stratechery). 
Your job is to rip this draft apart and demand excellence. Be constructive but brutally honest.

Analyze the draft for:
1. **AI-isms and Forbidden Fluff**: Mark and list any forbidden clichés or lazy words. You DETEST words like: "delve", "rapidly evolving", "in this digital age", "game changer", "testament to", "double-edged sword", "tapestry", "revolutionize", "dive deep".
2. **Technical Depth**: Is it too shallow? Does it use fluffy hand-waving instead of explaining actual technical systems, architectures, or protocols?
3. **Hook and Flow**: Is the opening dry and generic? Does the flow hold interest?
4. **Tone and Style**: Is it overly enthusiastic, sales-y, or flowery? Force it to be calm, authoritative, precise, and premium.

Provide a detailed list of edits and strict instructions for a complete rewrite.`;

  const userPrompt = `ARTICLE DRAFT:\n\n${draftText}`;
  return await callMiniMax(systemPrompt, userPrompt);
}

async function runRefinementLoop(draftText, critiqueText, pillarName, topic) {
  const systemPrompt = `You are a master B2B technical copywriter and senior editor.
Your job is to rewrite the initial article draft, fully incorporating the Editor-in-Chief's brutal critique.

STRICT WRITING GUIDELINES:
1. Absolutely eliminate all AI-isms, forbidden clichés, and marketing fluff (no "delve", "rapidly evolving", "game changer", "testament to", etc.).
2. Drastically upgrade technical depth. Focus heavily on real engineering systems, trade-offs, architectures, or concrete code practices.
3. Sharpen the opening hook to be calm, highly engaging, and direct. Start immediately with the hook.
4. Maintain a calm, authoritative, premium, and professional B2B tone.
5. Do NOT include any intro or outro text (e.g. "Here is the refined draft..."). Output ONLY the final markdown article.
6. Do NOT include any "# Title" or H1 header at the top. Start directly with the text.`;

  const userPrompt = `INITIAL DRAFT:\n\n${draftText}\n\n=========================\nEDITOR CRITIQUE:\n\n${critiqueText}`;
  return await callMiniMax(systemPrompt, userPrompt);
}

// ==========================================
// 🎨 IMAGE GENERATION
// ==========================================

async function generatePollinationsImageUrl(title, content) {
  // Generate a highly visual tech concept prompt from the title/content using MiniMax
  const systemPrompt = `You are a creative digital art director. Generate a highly detailed, futuristic, and premium technological image prompt based on the article topic.
The prompt must be in plain English, short (under 40 words), and highly descriptive.
Choose an aesthetic matching: futuristic, high-tech abstract, glowing neon, clean glassmorphic elements, cyber, octane render, 3d, cinematic lighting.
Output ONLY the visual prompt string without quotes, introductions, or annotations.`;

  const userPrompt = `TITLE: ${title}\nSUMMARY: ${content.slice(0, 300)}...`;
  try {
    const visualPrompt = await callMiniMax(systemPrompt, userPrompt);
    const cleanPrompt = visualPrompt.replace(/[^\w\s,-]/g, '').trim();
    const seed = Math.floor(Math.random() * 100000);
    const encodedPrompt = encodeURIComponent(cleanPrompt);
    return `https://image.pollinations.ai/p/${encodedPrompt}?width=1200&height=630&nologo=true&seed=${seed}`;
  } catch (err) {
    console.error('Failed to generate visual prompt. Using standard tech fallback.');
    return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop';
  }
}

// ==========================================
// 📢 SOCIAL MEDIA REPURPOSING
// ==========================================

async function generateSocialVariants(articleText, topic) {
  const systemPrompt = `You are an elite B2B growth marketing director and viral copywriting mastermind.
Your task is to repurpose the technical article into 6 highly engaging, viral, and professional B2B posts optimized for different platforms.

STRICT COPYWRITING RULES (TO FIX THE "BORING 3/10" FEELING):
1. NO academic/generic language. Avoid boring openings like "Let's explore...", "Recent updates show...", "It is important to notice...".
2. ABSOLUTELY NO raw markdown bold (** or *) or headers (#) in the social variants. Social networks render raw asterisks as ugly, unformatted text.
3. Every post must open with a "HOOK OF STEEL" using one of these B2B frameworks:
   - Framework A (The Contrarian Take): "90% of developers think X. But the engineering reality is Y..." (Vietnamese: "90% lập trình viên nghĩ X. Nhưng thực tế kỹ thuật lại là Y...")
   - Framework B (The Technical Tear-down): Start directly with a massive technical milestone and concrete numbers: "Huawei Kirin chip just broke 5GHz using 3D stacking architecture. Here is how they did it..."
   - Framework C (The Agitated Problem-Solve): "Building AI agents in production is a hallucination nightmare. Here is the step-by-step framework to achieve determinism..."
4. Keep the paragraphs short, spacing wide, and use highly visual Unicode bullets like "↳" or "•" to maximize scannability.
5. Vietnamese copies must be calm yet opinionated, using highly professional terminology (Fed, Cục Dự trữ Liên bang, chip bán dẫn, kiến trúc xếp chồng 3D) while maintaining a premium B2B authority.

STRICT PLATFORM SPECIFICATIONS:
1. **Twitter/X**: Always in **Vietnamese** (tiếng Việt). Sharp, technical, maximum 280 characters. Start directly with a Framework B hook. Use ↳ for sub-points.
2. **Facebook**: Always **Bilingual** (English on top, Vietnamese below). Warm, story-driven, conversational, and highly intellectual. Emojis used very sparingly for spacing only.
3. **LinkedIn**: In **English**. Highly professional executive tone. Focus on system architecture, business impact, and concrete metrics. Use ↳ and numbered lists via Unicode characters. No bold/italics.
4. **Instagram**: In **English**. Structured into sequential slides for clean carousels. Start with a visual hook.
5. **TikTok**: In **English**. Spoken script with bracketed [VISUAL CUES] and [ANNOTATIONS].
6. **Threads**: Always in **Vietnamese** (tiếng Việt). Highly conversational, casual, and engaging.
   - Start the main post with a compelling conversational question or hook (e.g. "Anh em nghĩ sao...", "Không thể tin nổi...", "Cực kỳ chấn động...").
   - MUST break the long content into sequential sections using a single "---" divider on a new line.
   - Keep each section under 450 characters (strictly <= 500 characters limit) so it splits perfectly into a thread of comments. The first section is the main thread post (with the hook), and subsequent sections are the comments for readers to read the continuation.

Output format must be wrapped in XML-like tags for robust parsing:
<twitter>x_copy_here</twitter>
<facebook>fb_copy_here</facebook>
<linkedin>li_copy_here</linkedin>
<instagram>ig_copy_here</instagram>
<tiktok>tt_copy_here</tiktok>
<threads>threads_copy_here</threads>
<visual_prompt>detailed_30_word_image_prompt_for_sdxl_here</visual_prompt>`;

  const userPrompt = `TOPIC: ${topic}\n\nARTICLE:\n\n${articleText}`;
  const response = await callMiniMax(systemPrompt, userPrompt);

  const extractTag = (tag) => {
    const match = response.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'i'));
    return match ? match[1].trim() : `[Failed to generate ${tag} copy]`;
  };

  return {
    x: extractTag('twitter'),
    fb: extractTag('facebook'),
    li: extractTag('linkedin'),
    ig: extractTag('instagram'),
    tt: extractTag('tiktok'),
    threads: extractTag('threads')
  };
}

// ==========================================
// 🚀 WEBSITES DRAFTS SUBMISSION
// ==========================================

async function submitDraftToWebsite(title, slug, content, type, coverImageUrl) {
  try {
    const payload = {
      title_en: title,
      title_vi: '', // Optional
      slug: slug,
      type: type === 'AI_NEWS' ? 'AI_NEWS' : 'JOURNAL',
      published: false, // MANDATORY: Always false (draft) for Bear to approve in CMS
      coverImageUrl: coverImageUrl,
      content_en: content
    };

    console.log(`Submitting draft payload to ${VERCEL_API_URL}...`);
    const response = await axios.post(VERCEL_API_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTOMATION_API_KEY}`
      }
    });

    if (response.status === 200 || response.status === 201) {
      console.log('✅ Website draft submitted successfully!');
    } else {
      console.error('❌ Website submission failed with status:', response.status, response.data);
    }
  } catch (error) {
    console.error('❌ Connection error to Vercel API:', error.response ? error.response.data : error.message);
  }
}

// Run the engine
main().catch(err => {
  console.error('❌ Content Engine Crash:', err);
  process.exit(1);
});
