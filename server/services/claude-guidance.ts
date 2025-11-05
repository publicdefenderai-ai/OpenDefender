// Claude AI-Powered Legal Guidance Service
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface CaseDetails {
  jurisdiction: string;
  charges: string | string[];
  caseStage: string;
  custodyStatus: string;
  hasAttorney: boolean;
  arrestDate?: string;
  arrestLocation?: string;
  incidentDescription?: string;
  policeStatement?: string;
  witnessesPresent?: boolean;
  evidenceNotes?: string;
  priorConvictions?: string;
  employmentStatus?: string;
  familySituation?: string;
  concernsQuestions?: string;
}

interface ClaudeGuidance {
  criticalAlerts: string[];
  immediateActions: Array<{
    action: string;
    urgency: 'urgent' | 'high' | 'medium' | 'low';
  }>;
  nextSteps: string[];
  deadlines: Array<{
    event: string;
    timeframe: string;
    description: string;
    priority: 'critical' | 'important' | 'normal';
    daysFromNow?: number;
  }>;
  rights: string[];
  resources: Array<{
    type: string;
    description: string;
    contact: string;
    hours?: string;
    website?: string;
  }>;
  warnings: string[];
  evidenceToGather: string[];
  courtPreparation: string[];
  avoidActions: string[];
  timeline: Array<{
    stage: string;
    description: string;
    timeframe: string;
    completed: boolean;
  }>;
  chargeClassifications?: Array<{
    code: string;
    title: string;
    classification: string;
    maxPenalty: string;
  }>;
  usageMetrics: {
    inputTokens: number;
    outputTokens: number;
    estimatedCost: number;
  };
}

function buildSystemPrompt(): string {
  return `You are an expert legal guidance assistant for Public Defender AI, a platform helping people without legal representation understand their rights and next steps. Your role is to provide clear, actionable legal guidance in simple language (6th-8th grade reading level).

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
}

function buildUserPrompt(caseDetails: CaseDetails): string {
  const chargesText = Array.isArray(caseDetails.charges) 
    ? caseDetails.charges.join(', ') 
    : caseDetails.charges;

  let prompt = `Provide legal guidance for this situation:

BASIC CASE INFORMATION:
- Jurisdiction: ${caseDetails.jurisdiction}
- Charges: ${chargesText}
- Case Stage: ${caseDetails.caseStage}
- In Custody: ${caseDetails.custodyStatus}
- Has Attorney: ${caseDetails.hasAttorney ? 'Yes' : 'No'}`;

  if (caseDetails.arrestDate) {
    prompt += `\n- Arrest Date: ${caseDetails.arrestDate}`;
  }
  if (caseDetails.arrestLocation) {
    prompt += `\n- Arrest Location: ${caseDetails.arrestLocation}`;
  }

  if (caseDetails.incidentDescription) {
    prompt += `\n\nINCIDENT DESCRIPTION:\n${caseDetails.incidentDescription}`;
  }

  if (caseDetails.policeStatement) {
    prompt += `\n\nPOLICE STATEMENT:\n${caseDetails.policeStatement}`;
  }

  if (caseDetails.witnessesPresent !== undefined) {
    prompt += `\n\nWitnesses Present: ${caseDetails.witnessesPresent ? 'Yes' : 'No'}`;
  }

  if (caseDetails.evidenceNotes) {
    prompt += `\n\nEVIDENCE NOTES:\n${caseDetails.evidenceNotes}`;
  }

  if (caseDetails.priorConvictions) {
    prompt += `\n\nPRIOR CONVICTIONS:\n${caseDetails.priorConvictions}`;
  }

  if (caseDetails.employmentStatus) {
    prompt += `\n\nEmployment Status: ${caseDetails.employmentStatus}`;
  }

  if (caseDetails.familySituation) {
    prompt += `\n\nFamily Situation: ${caseDetails.familySituation}`;
  }

  if (caseDetails.concernsQuestions) {
    prompt += `\n\nSPECIFIC CONCERNS/QUESTIONS:\n${caseDetails.concernsQuestions}`;
  }

  prompt += `\n\nProvide comprehensive guidance tailored to these specific facts. Focus on:
1. Immediate actions based on the current stage (${caseDetails.caseStage})
2. Jurisdiction-specific deadlines and procedures for ${caseDetails.jurisdiction}
3. Rights specific to the charges: ${chargesText}
4. Evidence that could help based on the incident description
5. Warnings about common mistakes in this type of case

Remember: Use simple language, be specific, and prioritize by urgency.`;

  return prompt;
}

export async function generateClaudeGuidance(
  caseDetails: CaseDetails
): Promise<ClaudeGuidance> {
  try {
    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(caseDetails);

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514', // Latest Sonnet 4.5 model
      max_tokens: 4096,
      temperature: 0.3, // Lower temperature for more consistent legal guidance
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    // Extract the text content
    const textContent = message.content.find(block => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text content in Claude response');
    }

    // Parse the JSON response
    const responseText = textContent.text;
    
    // Try to extract JSON from the response (Claude sometimes wraps it in markdown)
    const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                      responseText.match(/\{[\s\S]*\}/);
    
    const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : responseText;
    const guidance = JSON.parse(jsonText);

    // Calculate costs (Sonnet 4.5 pricing: $3/MTok input, $15/MTok output)
    const inputCost = (message.usage.input_tokens / 1_000_000) * 3.0;
    const outputCost = (message.usage.output_tokens / 1_000_000) * 15.0;

    return {
      ...guidance,
      usageMetrics: {
        inputTokens: message.usage.input_tokens,
        outputTokens: message.usage.output_tokens,
        estimatedCost: inputCost + outputCost,
      },
    };
  } catch (error) {
    console.error('Claude AI error:', error);
    throw new Error(
      `Failed to generate AI guidance: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

// Health check function to verify API key is working
export async function testClaudeConnection(): Promise<boolean> {
  try {
    await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 10,
      messages: [{ role: 'user', content: 'test' }],
    });
    return true;
  } catch (error) {
    console.error('Claude connection test failed:', error);
    return false;
  }
}
