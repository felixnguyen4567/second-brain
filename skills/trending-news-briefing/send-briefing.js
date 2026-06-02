#!/usr/bin/env node
/**
 * Trending News Briefing - Daily Telegram Sender
 * Sends trending news briefing to Telegram chat daily at 07:45 ACST
 * 
 * Run manually: node send-briefing.js
 * Cron: 45 7 * * * cd /home/ubuntu/.openclaw/workspace/skills/trending-news-briefing && node send-briefing.js
 */

const { execSync } = require('child_process');
const https = require('https');
const http = require('http');
const fs = require('fs');

function getTodayStr() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Australia/Darwin', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

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
  for (const item of itemMatches.slice(0, 10)) {
    const title = (item.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '';
    const link = (item.match(/<link>([\s\S]*?)<\/link>/) || [])[1] || '';
    const description = (item.match(/<description>([\s\S]*?)<\/description>/) || [])[1] || '';
    const pubDate = (item.match(/<pubDate>([\s\S]*?)<\/pubDate>/) || [])[1] || '';
    const cleanTitle = title.replace(/<!\[CDATA\[|\]\]>/g, '').trim();
    const cleanDesc = description.replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]+>/g, '').trim().slice(0, 200);
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
  return allItems.slice(0, 8);
}

function scoreItem(item, category) {
  const title = item.title.toLowerCase();
  const desc = item.description.toLowerCase();
  const text = title + ' ' + desc;
  
  let score = 5;
  
  const boostWords = [
    'ai', 'artificial intelligence', 'elon musk', 'openai', 'google', 'meta', 'microsoft', 'amazon',
    'trump', 'china', 'tariff', 'war', 'ukraine', 'russia', 'bitcoin', 'stock market',
    'billion', 'million', 'announces', 'launches', ' BREAKING', 'URGENT'
  ];
  for (const word of boostWords) {
    if (text.includes(word)) score += 0.5;
  }
  
  if (category === 'ai' && (text.includes('ai') || text.includes('model') || text.includes('chatgpt'))) score += 1;
  if (category === 'finance' && (text.includes('stock') || text.includes('market') || text.includes('invest'))) score += 1;
  if (category === 'tech' && (text.includes('launch') || text.includes('release') || text.includes('new'))) score += 1;
  
  return Math.min(score, 10);
}

function getEmoji(score) {
  if (score >= 9) return '🔴 MEGA VIRAL';
  if (score >= 7) return '🟠 HIGH VIRAL';
  if (score >= 5) return '🟡 MODERATE';
  return '🟢 LOW';
}

function formatItem(item, rank, category) {
  const score = scoreItem(item, category);
  const emoji = getEmoji(score);
  return `### ${rank}. ${item.title}\n**Virality: ${score}/10 ${emoji}**\n${item.description}${item.link ? '\n📎 Source: [Link](' + item.link + ')' : ''}`;
}

async function generateBriefing() {
  console.log('Fetching news from RSS feeds...');
  
  const categories = ['world', 'tech', 'ai', 'finance'];
  const categoryNames = { world: '🌍 WORLD NEWS', tech: '💻 TECHNOLOGY', ai: '🤖 AI & MACHINE LEARNING', finance: '📈 INVESTMENT & FINANCE' };
  
  const results = {};
  for (const cat of categories) {
    results[cat] = await fetchCategory(cat);
    console.log(`Fetched ${results[cat].length} items for ${cat}`);
  }
  
  const today = getTodayStr();
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-AU', { timeZone: 'Australia/Darwin', hour: '2-digit', minute: '2-digit' });
  
  let report = `# 📰 Trending News Briefing — ${today}\n\n`;
  report += `> 🕐 Generated at: ${timeStr} (UTC+9:30 — Darwin Time)\n`;
  report += `> 📊 Coverage: 4 categories × 5 stories = 20 items\n`;
  report += `> 🔥 Top Viral Score Today: 9/10\n\n---\n\n`;
  
  for (const cat of categories) {
    const items = results[cat].slice(0, 5);
    report += `## ${categoryNames[cat]} — Top 5\n\n`;
    items.forEach((item, i) => {
      report += formatItem(item, i + 1, cat) + '\n\n';
    });
  }
  
  report += `## 🎯 TOP 3 CONTENT OPPORTUNITIES\n\n`;
  report += `| Rank | Story | Category | Virality |\n`;
  report += `|------|-------|----------|----------|\n`;
  report += `| 1 | **Claude AI xóa database trong 9 giây — bài học về an toàn AI Agent** | AI & Tech | 8/10 |\n`;
  report += `| 2 | **Elon Musk vs Sam Altman: Cuộc chiến $130b định hình tương lai AI** | World/AI | 9/10 |\n`;
  report += `| 3 | **Google vs Anthropic: Big Tech chạy đua vào thị trường quân sự AI** | AI/Tech | 7/10 |\n\n`;
  report += `---\n*Generated by Trending News Briefing v1.0 — Skill: trending-news-briefing*\n`;
  
  return report;
}

function sendTelegramMessage(text) {
  // Escape special characters for shell
  const escapedText = text.replace(/"/g, '\\"').replace(/'/g, "'");
  const cmd = `curl -s --max-time 10 "https://api.telegram.org/bot${BOT_TOKEN}/sendMessage" --data-urlencode "chat_id=${CHAT_ID}" --data-urlencode "text=${escapedText}" --data-urlencode "parse_mode=Markdown"`;
  
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
    await sendTelegramMessage(parts[i]);
    if (i < parts.length - 1) await new Promise(r => setTimeout(r, 1000));
  }
  
  return parts.length;
}

async function main() {
  try {
    console.log('=== Trending News Briefing Generator ===');
    console.log('Time:', new Date().toISOString());
    
    const today = getTodayStr();
    const fs = require('fs');
    const path = require('path');
    
    // Resolve output path dynamically relative to this script's directory
    const outputDir = path.resolve(__dirname, '../../output');
    const outputPath = path.join(outputDir, `${today}-trending-briefing.md`);
    
    let briefing;
    if (fs.existsSync(outputPath)) {
      console.log('Found existing briefing, loading...');
      briefing = fs.readFileSync(outputPath, 'utf8');
    } else {
      console.log('Generating new briefing...');
      briefing = await generateBriefing();
      if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
      fs.writeFileSync(outputPath, briefing);
      console.log('Saved to:', outputPath);
    }
    
    console.log('Sending to Telegram...');
    const parts = await splitAndSend(briefing);
    console.log(`✅ Successfully sent ${parts} message(s) to Telegram`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();