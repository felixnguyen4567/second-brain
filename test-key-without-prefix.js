const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const rawKey = process.env.GEMINI_API_KEY;
const cleanKey = rawKey.startsWith('AQ.') ? rawKey.substring(3) : rawKey;

async function test() {
  const url = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cleanKey}`
      },
      body: JSON.stringify({
        model: 'gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: 'Say hello.' }
        ],
        temperature: 0.3
      })
    });
    
    const data = await response.json();
    console.log('Response Status:', response.status);
    console.log('Response Data:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
  }
}

test();
