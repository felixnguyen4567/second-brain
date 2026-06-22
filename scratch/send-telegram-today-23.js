const fs = require('fs');
const path = require('path');

const BOT_TOKEN = '8560386393:AAG_c6GfsJY-TmleBrU4n8xO17umTLQmKEI';
const CHAT_ID = '2078996036';

async function sendTelegramMessage(text) {
  const payload = {
    chat_id: CHAT_ID,
    text: text,
    parse_mode: 'Markdown'
  };
  
  const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  const result = await response.json();
  if (!result.ok) {
    throw new Error(result.description || 'Unknown error');
  }
  return result.result;
}

async function splitAndSend(message) {
  const MAX_LENGTH = 4000; // conservative limit
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
  
  console.log(`Sending ${parts.length} Telegram message parts...`);
  for (let i = 0; i < parts.length; i++) {
    try {
      await sendTelegramMessage(parts[i]);
      console.log(`Part ${i + 1} sent successfully.`);
    } catch (err) {
      console.error(`Telegram part ${i} failed, sending fallback without markdown formatting...`, err.message);
      const cleanText = parts[i].replace(/[\*_`\[\]()]/g, '');
      await sendTelegramMessage(cleanText);
      console.log(`Fallback for part ${i + 1} sent successfully.`);
    }
    if (i < parts.length - 1) await new Promise(r => setTimeout(r, 1000));
  }
}

async function main() {
  const briefingPath = path.join(__dirname, '../output/2026-06-23-ai-tech-briefing.md');
  const briefing = fs.readFileSync(briefingPath, 'utf8');
  
  console.log('Sending briefing...');
  await splitAndSend(briefing);
  
  console.log('Sending update notification...');
  const wikiUpdateMessage = `📚 *Wiki updated:* trending news 2026-06-23 saved. Total: 150 pages.`;
  await sendTelegramMessage(wikiUpdateMessage);
  console.log('Wiki update notification sent!');
  
  console.log('All messages sent!');
}

main().catch(console.error);
