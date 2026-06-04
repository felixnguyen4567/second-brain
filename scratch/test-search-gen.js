const path = require('path');
const axios = require('axios');

// Load env
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

async function callLLM(systemPrompt, userPrompt) {
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

async function testSearchAndGen() {
  console.log('=== Testing Tavily Search & Gemini Curation ===');
  const title = "Microsoft Majorana 2 quantum chip";
  console.log(`Searching details for topic: "${title}"...`);
  
  let searchContext = '';
  if (TAVILY_API_KEY) {
    try {
      const searchRes = await axios.post('https://api.tavily.com/search', {
        api_key: TAVILY_API_KEY,
        query: `${title} latest news details facts 2026`,
        search_depth: 'advanced',
        max_results: 5
      });
      const results = searchRes.data.results || [];
      searchContext = results.map(r => `Source: ${r.title}\nURL: ${r.url}\nContent: ${r.content}`).join('\n\n');
      console.log(`✅ Sourced ${results.length} Tavily results successfully.`);
      console.log('Sample context retrieved:', results[0]?.content.slice(0, 150) + '...\n');
    } catch (err) {
      console.error('Tavily search failed:', err.message);
    }
  } else {
    console.warn('No Tavily key found.');
  }

  const systemPrompt = `You are a professional B2B tech curator and content writer.
Generate a premium LinkedIn post and a Twitter post in Vietnamese.
Analyze the provided real-time search results to extract key facts and metrics. Do NOT hallucinate.
Output format:
<twitter>x_copy</twitter>
<linkedin>li_copy</linkedin>`;

  const userPrompt = `TOPIC: ${title}
DESCRIPTION: Microsoft has announced the Majorana 2 quantum chip at Microsoft Build.
REAL-TIME SEARCH CONTEXT:
${searchContext}`;

  console.log('Drafting social variants...');
  const output = await callLLM(systemPrompt, userPrompt);
  console.log('--- Drafted Outputs ---');
  console.log(output);
  console.log('=======================');
}

testSearchAndGen().catch(err => console.error('Crash:', err));
