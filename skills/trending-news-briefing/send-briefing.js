#!/usr/bin/env node
/**
 * Trending News Briefing - Daily Telegram Sender & Curation Engine
 * Sends trending news briefing to Telegram chat daily at 07:45 ACST
 * 
 * Run manually: node send-briefing.js
 */

const { execSync } = require('child_process');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Load environment variables from second-brain/.env
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const BOT_TOKEN = '8560386393:AAG_c6GfsJY-TmleBrU4n8xO17umTLQmKEI';
const CHAT_ID = '2078996036'; // Bear's Telegram ID

const RSS_FEEDS = {
  world: [
    'https://feeds.bbci.co.uk/news/world/rss.xml',
    'https://feeds.reuters.com/reuters/worldnews',
  ],
  tech: [
    'https://techcrunch.com/feed/',
    'https://www.theverge.com/rss/index.xml',
  ],
  ai: [
    'https://venturebeat.com/category/ai/feed/',
    'https://www.artificialintelligence-news.com/feed/',
  ],
  finance: [
    'https://feeds.bloomberg.com/markets/news.rss',
    'https://feeds.reuters.com/reuters/businessNews',
  ]
};

function getTodayStr() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Australia/Darwin', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, { timeout: 10000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject).on('timeout', () => reject(new Error('Timeout')));
  });
}

function parseRSS(xml) {
  const items = [];
  const itemMatches = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];
  for (const item of itemMatches.slice(0, 15)) { // Fetch slightly more items for better curation
    const title = (item.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '';
    const link = (item.match(/<link>([\s\S]*?)<\/link>/) || [])[1] || '';
    const description = (item.match(/<description>([\s\S]*?)<\/description>/) || [])[1] || '';
    const pubDate = (item.match(/<pubDate>([\s\S]*?)<\/pubDate>/) || [])[1] || '';
    const cleanTitle = title.replace(/<!\[CDATA\[|\]\]>/g, '').trim();
    const cleanDesc = description.replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]+>/g, '').trim().slice(0, 300);
    if (cleanTitle && link) {
      items.push({ title: cleanTitle, link: link.trim(), description: cleanDesc, pubDate });
    }
  }
  return items;
}

async function fetchCategory(category) {
  const feeds = RSS_FEEDS[category] || [];
  let allItems = [];
  for (const feed of feeds) {
    try {
      const xml = await fetchUrl(feed);
      allItems = allItems.concat(parseRSS(xml));
    } catch (e) {
      console.error(`Failed to fetch ${feed}: ${e.message}`);
    }
  }
  return allItems;
}

async function callLLM(systemPrompt, userPrompt) {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not defined in environment variables.');
  }

  const response = await axios.post(
    'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
    {
      model: 'gemini-2.5-flash',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GEMINI_API_KEY}`
      }
    }
  );

  return response.data.choices[0].message.content;
}

async function generateBriefing() {
  console.log('Fetching news from RSS feeds...');
  
  const categories = ['world', 'tech', 'ai', 'finance'];
  const rawResults = {};
  
  for (const cat of categories) {
    rawResults[cat] = await fetchCategory(cat);
    console.log(`Fetched ${rawResults[cat].length} raw items for ${cat}`);
  }
  
  const today = getTodayStr();
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-AU', { timeZone: 'Australia/Darwin', hour: '2-digit', minute: '2-digit' });
  
  const systemPrompt = `You are "Felix Ng" — an elite B2B tech founder, AI researcher, and world-class developer influencer.
Your writing style is highly respected for being sharp, technical, opinionated, extremely conversational, and human.

Your task is to analyze the provided raw RSS news items and generate a premium, high-impact daily trending news briefing.

STRICT INSTRUCTIONS:
1. Translate the summary and opportunities into professional, engaging, and rich Vietnamese. Keep titles in English but feel free to add Vietnamese translations in parentheses if it makes it clearer.
2. For each category, select the top 5 most important/trending stories, write the original English title, compute a realistic Virality Score (1-10) based on B2B relevance/novelty/impact, and write a 2-3 sentence summary IN VIETNAMESE that highlights the core facts, technical/business implications, or interesting details (in an engaging, sharp, conversational tech style).
3. Do NOT use generic summaries like "Bản tin cập nhật tình hình thực tế". Be specific, technical, and concrete. Mention names, numbers, and facts from the raw descriptions.
4. Dynamically curate the "TOP 3 CONTENT OPPORTUNITIES" at the bottom: analyze the selected stories, pick the 3 best ones for content production, and write a detailed explanation of why they work and what the creative hook should be.
5. Output ONLY the raw Markdown briefing with NO markdown code wrappers (no \`\`\`markdown ... \`\`\`), no HTML tags, no greetings, and no conversational text.

Use this EXACT Markdown Template:
# 📰 Trending News Briefing — ${today}

> 🕐 Generated at: ${timeStr} (Darwin Local Time)
> 📊 Coverage: 4 categories × 5 stories = 20 items
> 🔥 Top Viral Score Today: [Score]/10

---

## 🌍 WORLD NEWS — Top 5

### 1. [Title]
**Virality: [Score]/10 [Emoji]**
[2-3 sentence summary in Vietnamese]
📎 Source: [Link]([URL])

... (repeat for 5 items) ...

## 💻 TECHNOLOGY — Top 5
... (5 items) ...

## 🤖 AI & MACHINE LEARNING — Top 5
... (5 items) ...

## 📈 INVESTMENT & FINANCE — Top 5
... (5 items) ...

## 🎯 TOP 3 CONTENT OPPORTUNITIES

• **Rank 1: [Story Title]** ([Category] | Virality: [Score]/10) - *Góc B2B:* [Vietnamese explanation of the angle, why it works, and the creative hook]
• **Rank 2: [Story Title]** ([Category] | Virality: [Score]/10) - *Góc B2B:* [Vietnamese explanation of the angle, why it works, and the creative hook]
• **Rank 3: [Story Title]** ([Category] | Virality: [Score]/10) - *Góc B2B:* [Vietnamese explanation of the angle, why it works, and the creative hook]

---
*Generated by Trending News Briefing v2.0 — Skill: trending-news-briefing*`;

  const userPrompt = `RAW RSS NEWS ITEMS:\n\n${JSON.stringify(rawResults, null, 2)}`;
  
  console.log('Sending news to Gemini for premium curation...');
  const curatedMarkdown = await callLLM(systemPrompt, userPrompt);
  return curatedMarkdown.trim();
}

function sendTelegramMessage(text) {
  // Escape special characters for shell
  const escapedText = text.replace(/"/g, '\\"').replace(/'/g, "'");
  const cmd = `curl -s --max-time 15 "https://api.telegram.org/bot${BOT_TOKEN}/sendMessage" --data-urlencode "chat_id=${CHAT_ID}" --data-urlencode "text=${escapedText}" --data-urlencode "parse_mode=Markdown"`;
  
  try {
    const result = execSync(cmd, { encoding: 'utf8', maxBuffer: 1024 * 1024 });
    const parsed = JSON.parse(result);
    if (!parsed.ok) throw new Error(parsed.description || 'Unknown error');
    return parsed.result;
  } catch (e) {
    throw new Error(e.message);
  }
}

async function splitAndSend(message) {
  const MAX_LENGTH = 4096;
  const lines = message.split('\n');
  let part = '';
  let parts = [];
  
  for (const line of lines) {
    if ((part + '\n' + line).length > MAX_LENGTH) {
      parts.push(part);
      part = line;
    } else {
      part += '\n' + line;
    }
  }
  if (part) parts.push(part);
  
  console.log(`Sending ${parts.length} message(s)...`);
  
  for (let i = 0; i < parts.length; i++) {
    try {
      await sendTelegramMessage(parts[i]);
    } catch (err) {
      console.error(`Telegram part ${i} failed, attempting un-formatted fallback...`);
      // Fallback: send clean text without markdown to avoid telegram escape errors
      const cleanText = parts[i].replace(/[\*_`\[\]()]/g, '');
      await sendTelegramMessage(cleanText);
    }
    if (i < parts.length - 1) await new Promise(r => setTimeout(r, 1000));
  }
  
  return parts.length;
}

async function main() {
  try {
    console.log('=== Trending News Briefing Curator starting ===');
    console.log('Time:', new Date().toISOString());
    
    if (!GEMINI_API_KEY) {
      console.error('❌ GEMINI_API_KEY is not defined. Please define it in second-brain/.env');
      process.exit(1);
    }

    const today = getTodayStr();
    
    // Paths definition
    const outputDir = path.resolve(__dirname, '../../output');
    const outputPath = path.join(outputDir, `${today}-trending-briefing.md`);
    const historyDir = path.resolve(__dirname, '../daily-news-brief/history');
    const historyPath = path.join(historyDir, `${today}.md`);

    let briefing;
    
    console.log('Generating curated news brief via Gemini-2.5-Flash...');
    briefing = await generateBriefing();
    
    // Save to output folder
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(outputPath, briefing, 'utf8');
    console.log('Saved to output:', outputPath);

    // Save directly to daily-news-brief history so dashboard picks it up instantly
    if (!fs.existsSync(historyDir)) fs.mkdirSync(historyDir, { recursive: true });
    fs.writeFileSync(historyPath, briefing, 'utf8');
    console.log('Saved to dashboard history:', historyPath);

    // Also update latest-brief.md in daily-news-brief folder
    const latestBriefPath = path.resolve(__dirname, '../daily-news-brief/latest-brief.md');
    fs.writeFileSync(latestBriefPath, briefing, 'utf8');
    console.log('Updated latest-brief.md:', latestBriefPath);
    
    console.log('Sending to Telegram...');
    const parts = await splitAndSend(briefing);
    console.log(`✅ Curated briefing generated & sent successfully to Telegram!`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();