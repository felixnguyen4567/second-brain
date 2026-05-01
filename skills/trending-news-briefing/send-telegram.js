const BOT_TOKEN = '8560386393:AAG_c6GfsJY-TmleBrU4n8xO17umTLQmKEI';
const CHAT_ID = '2078996036';

async function sendTelegramMessage(text) {
  const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: text,
      parse_mode: 'Markdown'
    })
  });
  const result = await response.json();
  if (!result.ok) throw new Error(result.description || 'Unknown error');
  return result.result;
}

async function main() {
  await sendTelegramMessage('✅ Test: Telegram sender using fetch() works!');
  console.log('Message sent successfully');
}

main().catch(console.error);
