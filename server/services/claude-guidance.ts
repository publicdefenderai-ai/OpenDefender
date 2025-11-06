// Claude AI-Powered Legal Guidance Service
import Anthropic from '@anthropic-ai/sdk';

// Validate API key on module load
const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.error('CRITICAL: ANTHROPIC_API_KEY environment variable is not set');
  throw new Error('ANTHROPIC_API_KEY environment variable is required for AI guidance features');
}

const anthropic = new Anthropic({
  apiKey,
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
  overview: string;
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
}

// Input sanitization to prevent prompt injection and limit excessive input
function sanitizeInput(input: string | undefined, maxLength: number = 5000): string {
  if (!input) return '';
  
  // Trim and limit length
  let sanitized = input.trim().slice(0, maxLength);
  
  // Remove potential prompt injection patterns
  // Remove system-like instructions that could confuse the AI
  sanitized = sanitized.replace(/\b(ignore (previous|all) instructions?|disregard|forget what I said|new instructions?)\b/gi, '[redacted]');
  
  return sanitized;
}

function buildUserPrompt(caseDetails: CaseDetails): string {
  // Sanitize charges array/string
  const chargesText = Array.isArray(caseDetails.charges) 
    ? caseDetails.charges.map(c => sanitizeInput(c, 200)).join(', ') 
    : sanitizeInput(caseDetails.charges, 200);

  let prompt = `Provide legal guidance for this situation:

BASIC CASE INFORMATION:
- Jurisdiction: ${sanitizeInput(caseDetails.jurisdiction, 100)}
- Charges: ${chargesText}
- Case Stage: ${sanitizeInput(caseDetails.caseStage, 100)}
- In Custody: ${sanitizeInput(caseDetails.custodyStatus, 100)}
- Has Attorney: ${caseDetails.hasAttorney ? 'Yes' : 'No'}`;

  if (caseDetails.arrestDate) {
    prompt += `\n- Arrest Date: ${sanitizeInput(caseDetails.arrestDate, 100)}`;
  }
  if (caseDetails.arrestLocation) {
    prompt += `\n- Arrest Location: ${sanitizeInput(caseDetails.arrestLocation, 500)}`;
  }

  if (caseDetails.incidentDescription) {
    prompt += `\n\nINCIDENT DESCRIPTION:\n${sanitizeInput(caseDetails.incidentDescription)}`;
  }

  if (caseDetails.policeStatement) {
    prompt += `\n\nPOLICE STATEMENT:\n${sanitizeInput(caseDetails.policeStatement)}`;
  }

  if (caseDetails.witnessesPresent !== undefined) {
    prompt += `\n\nWitnesses Present: ${caseDetails.witnessesPresent ? 'Yes' : 'No'}`;
  }

  if (caseDetails.evidenceNotes) {
    prompt += `\n\nEVIDENCE NOTES:\n${sanitizeInput(caseDetails.evidenceNotes)}`;
  }

  if (caseDetails.priorConvictions) {
    prompt += `\n\nPRIOR CONVICTIONS:\n${sanitizeInput(caseDetails.priorConvictions)}`;
  }

  if (caseDetails.employmentStatus) {
    prompt += `\n\nEmployment Status: ${sanitizeInput(caseDetails.employmentStatus, 500)}`;
  }

  if (caseDetails.familySituation) {
    prompt += `\n\nFamily Situation: ${sanitizeInput(caseDetails.familySituation)}`;
  }

  if (caseDetails.concernsQuestions) {
    prompt += `\n\nSPECIFIC CONCERNS/QUESTIONS:\n${sanitizeInput(caseDetails.concernsQuestions)}`;
  }

  prompt += `\n\nProvide comprehensive guidance tailored to these specific facts. Focus on:
1. Immediate actions based on the current stage (${sanitizeInput(caseDetails.caseStage, 100)})
2. Jurisdiction-specific deadlines and procedures for ${sanitizeInput(caseDetails.jurisdiction, 100)}
3. Rights specific to the charges: ${chargesText}
4. Evidence that could help based on the incident description
5. Warnings about common mistakes in this type of case

Remember: Use simple language, be specific, and prioritize by urgency.`;

  return prompt;
}

// Validate Claude response structure
function validateClaudeResponse(data: any): void {
  const validUrgencies = ['urgent', 'high', 'medium', 'low'];
  const validPriorities = ['critical', 'important', 'normal'];

  // Required string field
  if (typeof data.overview !== 'string' || !data.overview) {
    throw new Error('Invalid response: overview must be a non-empty string');
  }

  // Required array fields
  if (!Array.isArray(data.criticalAlerts)) {
    throw new Error('Invalid response: criticalAlerts must be an array');
  }

  if (!Array.isArray(data.immediateActions)) {
    throw new Error('Invalid response: immediateActions must be an array');
  }

  // Validate immediateActions structure
  for (const action of data.immediateActions) {
    if (typeof action.action !== 'string' || !action.action) {
      throw new Error('Invalid response: each immediateAction must have a non-empty action string');
    }
    if (!validUrgencies.includes(action.urgency)) {
      throw new Error(`Invalid response: urgency must be one of ${validUrgencies.join(', ')}`);
    }
  }

  if (!Array.isArray(data.nextSteps)) {
    throw new Error('Invalid response: nextSteps must be an array');
  }

  if (!Array.isArray(data.deadlines)) {
    throw new Error('Invalid response: deadlines must be an array');
  }

  // Validate deadlines structure
  for (const deadline of data.deadlines) {
    if (typeof deadline.event !== 'string' || !deadline.event) {
      throw new Error('Invalid response: each deadline must have a non-empty event string');
    }
    if (typeof deadline.timeframe !== 'string') {
      throw new Error('Invalid response: each deadline must have a timeframe string');
    }
    if (typeof deadline.description !== 'string') {
      throw new Error('Invalid response: each deadline must have a description string');
    }
    if (!validPriorities.includes(deadline.priority)) {
      throw new Error(`Invalid response: deadline priority must be one of ${validPriorities.join(', ')}`);
    }
  }

  if (!Array.isArray(data.rights)) {
    throw new Error('Invalid response: rights must be an array');
  }

  if (!Array.isArray(data.resources)) {
    throw new Error('Invalid response: resources must be an array');
  }

  if (!Array.isArray(data.warnings)) {
    throw new Error('Invalid response: warnings must be an array');
  }

  if (!Array.isArray(data.evidenceToGather)) {
    throw new Error('Invalid response: evidenceToGather must be an array');
  }

  if (!Array.isArray(data.courtPreparation)) {
    throw new Error('Invalid response: courtPreparation must be an array');
  }

  if (!Array.isArray(data.avoidActions)) {
    throw new Error('Invalid response: avoidActions must be an array');
  }

  if (!Array.isArray(data.timeline)) {
    throw new Error('Invalid response: timeline must be an array');
  }
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
    let jsonText: string;
    const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
    
    if (jsonMatch) {
      jsonText = jsonMatch[1];
    } else {
      // Try to find JSON object (find first { and last })
      const jsonStart = responseText.indexOf('{');
      const jsonEnd = responseText.lastIndexOf('}');
      
      if (jsonStart === -1 || jsonEnd === -1 || jsonEnd < jsonStart) {
        throw new Error('No valid JSON found in Claude response');
      }
      
      jsonText = responseText.slice(jsonStart, jsonEnd + 1);
    }
    
    // Parse and validate the JSON
    let parsedData: any;
    try {
      parsedData = JSON.parse(jsonText);
    } catch (parseError) {
      throw new Error(`Failed to parse Claude response as JSON: ${parseError instanceof Error ? parseError.message : 'Unknown parse error'}`);
    }

    // Validate response structure
    validateClaudeResponse(parsedData);

    // Calculate costs (Sonnet 4.5 pricing: $3/MTok input, $15/MTok output)
    const inputCost = (message.usage.input_tokens / 1_000_000) * 3.0;
    const outputCost = (message.usage.output_tokens / 1_000_000) * 15.0;

    // Explicitly construct response with validated fields
    const guidance: ClaudeGuidance = {
      overview: parsedData.overview,
      criticalAlerts: parsedData.criticalAlerts,
      immediateActions: parsedData.immediateActions,
      nextSteps: parsedData.nextSteps,
      deadlines: parsedData.deadlines,
      rights: parsedData.rights,
      resources: parsedData.resources,
      warnings: parsedData.warnings,
      evidenceToGather: parsedData.evidenceToGather,
      courtPreparation: parsedData.courtPreparation,
      avoidActions: parsedData.avoidActions,
      timeline: parsedData.timeline,
      chargeClassifications: parsedData.chargeClassifications,
      usageMetrics: {
        inputTokens: message.usage.input_tokens,
        outputTokens: message.usage.output_tokens,
        estimatedCost: inputCost + outputCost,
      },
    };

    return guidance;
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
