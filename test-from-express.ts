import Anthropic from '@anthropic-ai/sdk';
import express from 'express';

const app = express();

const anthropic = new Anthropic({
  apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY!,
  baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL!,
  timeout: 30000,
});

app.get('/test-claude', async (req, res) => {
  console.log('Testing Claude from Express...');
  
  try {
    const startTime = Date.now();
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 100,
      messages: [{ role: 'user', content: 'Say OK' }],
    });
    
    console.log('Success! Took:', Date.now() - startTime, 'ms');
    res.json({ success: true, time: Date.now() - startTime, response: message.content[0] });
  } catch (error: any) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

const server = app.listen(3333, () => {
  console.log('Test server listening on port 3333');
  console.log('Test with: curl http://localhost:3333/test-claude');
});
