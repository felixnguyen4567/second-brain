async function test() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  console.log('Environment GEMINI_API_KEY length:', GEMINI_API_KEY ? GEMINI_API_KEY.length : 0);
  console.log('Environment GEMINI_API_KEY starts with:', GEMINI_API_KEY ? GEMINI_API_KEY.slice(0, 10) : 'none');

  if (!GEMINI_API_KEY) {
    console.log('No GEMINI_API_KEY in process.env');
    return;
  }

  const url = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GEMINI_API_KEY}`
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
