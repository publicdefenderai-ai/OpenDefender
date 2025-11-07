import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY!,
  baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL!,
  timeout: 30000,
});

async function test() {
  console.log('Testing Anthropic SDK...');
  console.log('Base URL:', process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL);
  console.log('API Key length:', process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY?.length);
  
  try {
    const startTime = Date.now();
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 100,
      messages: [{ role: 'user', content: 'Say OK' }],
    });
    
    console.log('Success! Took:', Date.now() - startTime, 'ms');
    console.log('Response:', message.content[0]);
    console.log('Usage:', message.usage);
  } catch (error: any) {
    console.error('Error:', error.message);
    console.error('Status:', error.status);
    console.error('Type:', error.type);
  }
}

test();
