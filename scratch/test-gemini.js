const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("No GEMINI_API_KEY found in .env!");
  process.exit(1);
}

// Pricing per 1M tokens (from official Google AI Studio Gemini 2.5 pricing)
const PRICING = {
  'gemini-2.5-pro': {
    inputLessThan128k: 1.25 / 1000000,
    outputLessThan128k: 5.00 / 1000000,
  },
  'gemini-2.5-flash': {
    inputLessThan128k: 0.075 / 1000000,
    outputLessThan128k: 0.30 / 1000000,
  }
};

async function testModel(modelName) {
  console.log(`\n🚀 Testing model: ${modelName}...`);
  const url = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';
  
  try {
    const start = Date.now();
    const response = await axios.post(
      url,
      {
        model: modelName,
        messages: [
          { role: 'system', content: 'You are a professional assistant specializing in AI and tech journalism.' },
          { role: 'user', content: 'Say hello in Vietnamese and write a 1-sentence tip on AI productivity tools.' }
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
    
    const end = Date.now();
    const data = response.data;
    const content = data.choices[0].message.content;
    const usage = data.usage;
    const duration = (end - start) / 1000;
    
    console.log(`✅ Success! Response: "${content.trim()}"`);
    console.log(`⏱️ Speed: ${duration.toFixed(2)}s`);
    
    if (usage) {
      const inputTokens = usage.prompt_tokens;
      const outputTokens = usage.completion_tokens;
      const totalTokens = usage.total_tokens;
      
      const pricing = PRICING[modelName] || PRICING['gemini-2.5-flash'];
      const inputCost = inputTokens * pricing.inputLessThan128k;
      const outputCost = outputTokens * pricing.outputLessThan128k;
      const totalCost = inputCost + outputCost;
      
      console.log(`📊 Token Usage: Input: ${inputTokens} | Output: ${outputTokens} | Total: ${totalTokens}`);
      console.log(`💰 Estimated Cost: $${totalCost.toFixed(6)} USD`);
      
      return {
        model: modelName,
        success: true,
        duration: duration,
        inputTokens: inputTokens,
        outputTokens: outputTokens,
        totalTokens: totalTokens,
        cost: totalCost,
        response: content.trim()
      };
    } else {
      console.log("⚠️ No usage metadata returned.");
      return { model: modelName, success: true, duration: duration, error: 'No usage metadata' };
    }
  } catch (err) {
    const errMsg = err.response ? JSON.stringify(err.response.data) : err.message;
    console.error(`❌ Model ${modelName} failed:`, errMsg);
    return { model: modelName, success: false, error: errMsg };
  }
}

async function runBenchmark() {
  console.log("====================================================");
  console.log("📊 GEMINI MODEL COST & PERFORMANCE BENCHMARK");
  console.log("====================================================");
  
  const models = ['gemini-2.5-pro', 'gemini-2.5-flash'];
  const results = [];
  
  for (const model of models) {
    const res = await testModel(model);
    results.push(res);
  }
  
  console.log("\n====================================================");
  console.log("📋 SUMMARY BENCHMARK REPORT");
  console.log("====================================================");
  console.table(
    results.map(r => {
      if (!r.success) {
        return {
          'Model': r.model,
          'Status': '❌ FAILED',
          'Speed (s)': 'N/A',
          'Prompt Tokens': 'N/A',
          'Completion Tokens': 'N/A',
          'Cost (USD)': 'N/A',
          'Calls per $1.00': 'N/A'
        };
      }
      return {
        'Model': r.model,
        'Status': '✅ OK',
        'Speed (s)': `${r.duration.toFixed(2)}s`,
        'Prompt Tokens': r.inputTokens,
        'Completion Tokens': r.outputTokens,
        'Cost (USD)': `$${r.cost.toFixed(6)}`,
        'Calls per $1.00': Math.floor(1 / r.cost).toLocaleString()
      };
    })
  );
  
  const pro = results.find(r => r.model === 'gemini-2.5-pro' && r.success);
  const flash = results.find(r => r.model === 'gemini-2.5-flash' && r.success);
  
  if (pro && flash) {
    const costRatio = pro.cost / flash.cost;
    console.log(`\n💡 FLASH model is approx. ${costRatio.toFixed(1)}x CHEAPER than PRO for this exact request!`);
    console.log(`💡 Moving to gemini-2.5-flash will save you ~94% of your Gemini API costs.`);
  }
  console.log("====================================================\n");
}

runBenchmark();
