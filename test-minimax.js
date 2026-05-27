const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const key = process.env.MINIMAX_API_KEY;

async function test() {
  console.log('Testing MiniMax connection with key:', key ? (key.slice(0, 10) + '...') : 'undefined');
  try {
    const res = await axios.post(
      'https://api.minimax.io/v1/chat/completions',
      {
        model: 'MiniMax-M2.7',
        messages: [{ role: 'user', content: 'Say hi.' }],
        temperature: 0.3
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`
        }
      }
    );
    console.log('Success!', res.data);
  } catch (err) {
    if (err.response) {
      console.log('Error status:', err.response.status);
      console.log('Error data:', JSON.stringify(err.response.data, null, 2));
    } else {
      console.log('Error message:', err.message);
    }
  }
}

test();
