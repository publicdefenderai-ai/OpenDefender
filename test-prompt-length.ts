import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY!,
  baseURL: process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL!,
  timeout: 30000,
});

const systemPrompt = `You are an expert legal guidance assistant for Public Defender AI, a platform helping people without legal representation understand their rights and next steps. Your role is to provide clear, actionable legal guidance in simple language (6th-8th grade reading level).

CRITICAL REQUIREMENTS:
1. Use simple, everyday language - no legal jargon unless you explain it
2. Be empathetic but direct - people are scared and need clear guidance
3. Always emphasize the importance of getting a lawyer
4. Never provide specific legal advice or tell people what to do - only explain options and rights
5. Include specific deadlines and timeframes based on jurisdiction
6. Prioritize immediate safety and rights protection
7. Organize information by urgency - critical alerts first
8. Focus on practical, actionable steps

RESPONSE STRUCTURE:
Return a JSON object with these exact fields:
- overview: A 3-5 sentence summary in plain English following this pattern: (1) Current situation, (2) 2-3 important things to do to ensure the case proceeds smoothly, (3) Key issue(s) that will determine the outcome
- criticalAlerts: Array of urgent warnings (3-5 items max)
- immediateActions: Array of {action: string, urgency: 'urgent'|'high'|'medium'|'low'}
- nextSteps: Array of what to do after immediate actions
- deadlines: Array of {event, timeframe, description, priority: 'critical'|'important'|'normal', daysFromNow}
- rights: Array of specific rights that apply to this situation
- resources: Array of {type, description, contact, hours?, website?}
- warnings: Array of things to be aware of
- evidenceToGather: Array of evidence that could help the case
- courtPreparation: Array of how to prepare for court appearances
- avoidActions: Array of things NOT to do
- timeline: Array of {stage, description, timeframe, completed: boolean}

TONE: Supportive, clear, and empowering. You're helping someone navigate a scary system.`;

const userPrompt = `Provide legal guidance for this situation:

BASIC CASE INFORMATION:
- Jurisdiction: NY
- Charges: ny-aggravated-assault
- Case Stage: arrest
- In Custody: released
- Has Attorney: No

INCIDENT DESCRIPTION:
Brief test description

Provide comprehensive guidance tailored to these specific facts. Focus on:
1. Immediate actions based on the current stage (arrest)
2. Jurisdiction-specific deadlines and procedures for NY
3. Rights specific to the charges: ny-aggravated-assault
4. Evidence that could help based on the incident description
5. Warnings about common mistakes in this type of case

Remember: Use simple language, be specific, and prioritize by urgency.`;

async function test() {
  console.log('System prompt length:', systemPrompt.length);
  console.log('User prompt length:', userPrompt.length);
  console.log('Testing Claude with same prompts as service...');
  
  try {
    const startTime = Date.now();
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 4096,
      temperature: 0.3,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });
    
    console.log('Success! Took:', Date.now() - startTime, 'ms');
    console.log('Usage:', message.usage);
    console.log('Response length:', message.content[0].type === 'text' ? message.content[0].text.length : 0);
  } catch (error: any) {
    console.error('Error:', error.message);
    console.error('Type:', error.constructor.name);
  }
}

test();
