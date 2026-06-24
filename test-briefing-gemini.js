const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
console.log('GEMINI_API_KEY length:', GEMINI_API_KEY ? GEMINI_API_KEY.length : 0);
console.log('GEMINI_API_KEY starts with:', GEMINI_API_KEY ? GEMINI_API_KEY.slice(0, 10) : 'none');

async function test() {
  const url = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';
  try {
    const response = await axios.post(
      url,
      {
        model: 'gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: 'Say hello.' }
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
    console.log('Success:', response.data);
  } catch (err) {
    console.error('Error status:', err.response ? err.response.status : err.message);
    if (err.response) {
      console.error('Error data:', JSON.stringify(err.response.data, null, 2));
    }
  }
}

test();
