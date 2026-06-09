const https = require('https');
const http = require('http');
const fs = require('fs');

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
  for (const item of itemMatches.slice(0, 15)) {
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

async function main() {
  const categories = ['world', 'tech', 'ai', 'finance'];
  const rawResults = {};
  for (const cat of categories) {
    rawResults[cat] = await fetchCategory(cat);
  }
  console.log(JSON.stringify(rawResults, null, 2));
}

main().catch(console.error);
