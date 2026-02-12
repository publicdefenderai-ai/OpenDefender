// Claude AI-Powered Legal Guidance Service
// Using direct Anthropic API with user-provided API key
import Anthropic from '@anthropic-ai/sdk';
import crypto from 'crypto';
import { redactCaseDetails, isPIIRedactionEnabled } from './pii-redactor';
import { validateLegalGuidance, ValidationResult } from './legal-accuracy-validator';
import { devLog, opsLog, errLog } from '../utils/dev-logger';
import { recordAICost } from './cost-tracker';
import { checkDiversionAvailability, extractDiversionMentions } from '@shared/diversion-availability';
import { CLAUDE_MODEL } from '../config/ai-model';

// Validate Anthropic API credentials
const apiKey = process.env.ANTHROPIC_API_KEY;

if (!apiKey) {
  errLog('Anthropic API key not set');
  throw new Error('ANTHROPIC_API_KEY required for AI guidance features');
}

const anthropic = new Anthropic({
  apiKey,
  timeout: 90000, // 90 second timeout for the SDK - generous time for complex legal guidance
});

// Simple in-memory cache for identical requests (expires after 15 minutes for privacy)
// Shorter TTL reduces risk of data persistence while maintaining performance
interface CacheEntry {
  response: ClaudeGuidance;
  timestamp: number;
}
const responseCache = new Map<string, CacheEntry>();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes in milliseconds (privacy-focused)

// Clean up expired cache entries periodically (every 5 minutes)
setInterval(() => {
  const now = Date.now();
  const keysToDelete: string[] = [];
  
  responseCache.forEach((entry, key) => {
    if (now - entry.timestamp > CACHE_TTL) {
      keysToDelete.push(key);
    }
  });
  
  if (keysToDelete.length > 0) {
    keysToDelete.forEach(key => responseCache.delete(key));
    devLog('privacy', `Cleared ${keysToDelete.length} expired cache entries`);
  }
}, 5 * 60 * 1000); // Run cleanup every 5 minutes

// Function to clear cache for a specific session (call on session end)
export function clearSessionCache(sessionId?: string): void {
  if (!sessionId) {
    responseCache.clear();
    devLog('privacy', 'All guidance cache cleared');
  } else {
    // Clear entries that might contain this session's data
    // Since cache keys are hashes, we clear all as a safety measure
    const sizeBefore = responseCache.size;
    responseCache.clear();
    devLog('privacy', `Cleared ${sizeBefore} cache entries for session cleanup`);
  }
}

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
  language?: string;
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
  mockQA?: Array<{
    question: string;
    suggestedResponse: string;
    explanation: string;
    category: 'identity' | 'charges' | 'circumstances' | 'plea' | 'procedural' | 'general';
  }>;
  usageMetrics: {
    inputTokens: number;
    outputTokens: number;
    estimatedCost: number;
  };
  validation?: {
    confidenceScore: number;
    isValid: boolean;
    summary: string;
    checksPerformed: number;
    checksPassed: number;
    issues: Array<{
      type: string;
      severity: 'error' | 'warning' | 'info';
      message: string;
      suggestion?: string;
    }>;
  };
}

function buildSystemPrompt(language?: string): string {
  const isSpanish = language === 'es';
  
  const languageInstruction = isSpanish 
    ? `IMPORTANT LANGUAGE REQUIREMENT: You MUST respond entirely in Spanish (Español). All text in the JSON response must be written in Spanish, using clear, simple language that is easy to understand. Do NOT use English anywhere in your response.`
    : '';
  
  const readingLevelNote = isSpanish
    ? 'en español sencillo (nivel de lectura de 6to-8vo grado)'
    : 'in simple language (6th-8th grade reading level)';
  
  const overviewNote = isSpanish
    ? 'A 3-5 sentence summary in simple Spanish'
    : 'A 3-5 sentence summary in plain English';

  return `You are an expert legal guidance assistant for Public Defender AI, a platform helping people without legal representation understand their rights and next steps. Your role is to provide clear, actionable legal guidance ${readingLevelNote}.

${languageInstruction}

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
- overview: ${overviewNote} following this pattern: (1) Current situation, (2) 2-3 important things to do to ensure the case proceeds smoothly, (3) Key issue(s) that will determine the outcome
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
- mockQA: Array of 3-5 personalized practice Q&A items tailored to the user's specific case. Each item must have:
  - question: A question the judge, prosecutor, or attorney might ask during the relevant proceeding (based on case stage)
  - suggestedResponse: A recommended response tailored to their specific circumstances (speak as the defendant)
  - explanation: Why this response is appropriate and what to be mindful of
  - category: One of 'identity', 'charges', 'circumstances', 'plea', 'procedural', or 'general'
  
MOCK Q&A GUIDELINES:
- Base questions on the user's specific charges, case stage, and circumstances
- Responses should be honest, respectful, and protect the user's rights
- Include questions about specific incidents only if the user provided those details
- Focus on the upcoming court proceeding based on the case stage
- Keep responses brief and direct - courts prefer concise answers

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

  // Add language instruction if Spanish is requested
  if (caseDetails.language === 'es') {
    prompt += `\n\nIMPORTANT: Generate ALL guidance content in Spanish (Español). All text in the response should be in Spanish, using clear, simple language that is easy to understand.`;
  }

  return prompt;
}

// Generate cache key from case details
function generateCacheKey(caseDetails: CaseDetails): string {
  // Create deterministic hash of ALL case details fields to avoid cache collisions
  const hash = crypto.createHash('sha256');
  hash.update(JSON.stringify({
    jurisdiction: caseDetails.jurisdiction,
    charges: caseDetails.charges,
    caseStage: caseDetails.caseStage,
    custodyStatus: caseDetails.custodyStatus,
    hasAttorney: caseDetails.hasAttorney,
    arrestDate: caseDetails.arrestDate,
    arrestLocation: caseDetails.arrestLocation,
    incidentDescription: caseDetails.incidentDescription,
    policeStatement: caseDetails.policeStatement,
    witnessesPresent: caseDetails.witnessesPresent,
    evidenceNotes: caseDetails.evidenceNotes,
    priorConvictions: caseDetails.priorConvictions,
    employmentStatus: caseDetails.employmentStatus,
    familySituation: caseDetails.familySituation,
    concernsQuestions: caseDetails.concernsQuestions,
    language: caseDetails.language,
  }));
  return hash.digest('hex');
}

// Improved JSON extraction with multiple fallback strategies
function extractJSON(responseText: string): string {
  // Strategy 1: Try to extract from markdown code block
  const markdownMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (markdownMatch) {
    return markdownMatch[1].trim();
  }

  // Strategy 2: Look for JSON object with balanced braces
  const braceStack: number[] = [];
  let jsonStart = -1;
  let jsonEnd = -1;

  for (let i = 0; i < responseText.length; i++) {
    if (responseText[i] === '{') {
      if (braceStack.length === 0) {
        jsonStart = i;
      }
      braceStack.push(i);
    } else if (responseText[i] === '}') {
      braceStack.pop();
      if (braceStack.length === 0 && jsonStart !== -1) {
        jsonEnd = i;
        break;
      }
    }
  }

  if (jsonStart !== -1 && jsonEnd !== -1) {
    return responseText.slice(jsonStart, jsonEnd + 1);
  }

  // Strategy 3: Try simple indexOf/lastIndexOf as last resort
  const simpleStart = responseText.indexOf('{');
  const simpleEnd = responseText.lastIndexOf('}');
  if (simpleStart !== -1 && simpleEnd !== -1 && simpleEnd > simpleStart) {
    return responseText.slice(simpleStart, simpleEnd + 1);
  }

  throw new Error('No valid JSON structure found in Claude response');
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

// Helper function to make Claude API call with retry logic
async function callClaudeWithRetry(
  systemPrompt: string,
  userPrompt: string,
  maxRetries: number = 1
): Promise<Anthropic.Messages.Message> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        devLog('claude', `Retrying API call (attempt ${attempt + 1}/${maxRetries + 1})...`);
      }
      
      const startTime = Date.now();
      
      // Wrap the API call in a timeout promise to ensure it actually times out
      const timeoutMs = 95000; // 95 seconds - slightly longer than SDK timeout for complex legal guidance
      const apiCallPromise = anthropic.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 4096,
        temperature: 0.3,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userPrompt,
          },
        ],
      });
      
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Claude API timed out after 95 seconds')), timeoutMs);
      });
      
      const message = await Promise.race([apiCallPromise, timeoutPromise]);
      
      devLog('claude', `API responded in ${Date.now() - startTime}ms`);
      devLog('claude', 'Response usage', message.usage);
      
      return message;
    } catch (error: any) {
      lastError = error;
      
      // Check if this is a timeout error that we should retry
      const isTimeout = error.constructor.name === 'APIConnectionTimeoutError' || 
                       (error instanceof Error && error.message.includes('timed out'));
      
      // Check if this is an overloaded error (529) that we should retry
      const isOverloaded = error instanceof Anthropic.APIError && error.status === 529;
      
      if ((isTimeout || isOverloaded) && attempt < maxRetries) {
        devLog('claude', `API ${isOverloaded ? 'overloaded' : 'timed out'} on attempt ${attempt + 1}, will retry...`);
        // Add a delay before retry (3 seconds for overloaded, 1 second for timeout)
        const delay = isOverloaded ? 3000 : 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      // If not a retriable error or we've exhausted retries, throw the error
      throw error;
    }
  }
  
  // This should never be reached, but TypeScript needs it
  throw lastError || new Error('Failed to call Claude API after retries');
}

export async function generateClaudeGuidance(
  caseDetails: CaseDetails
): Promise<ClaudeGuidance> {
  // CRITICAL: Redact PII before any processing (cache, API calls, logs)
  // This ensures no personally identifiable information reaches Claude or our systems
  let processedDetails = caseDetails;
  
  if (isPIIRedactionEnabled()) {
    const { redactedDetails, stats } = redactCaseDetails(caseDetails);
    processedDetails = redactedDetails;
    
    // Log redaction stats for observability (NOT the actual redacted values)
    if (stats.total > 0) {
      devLog('pii', 'Redacted sensitive information', {
        total: stats.total,
        breakdown: {
          names: stats.name,
          emails: stats.email,
          phones: stats.phone,
          ssn: stats.ssn,
          creditCards: stats.creditCard,
          addresses: stats.address,
          dob: stats.dob,
        }
      });
    }
  }
  
  // Check cache using redacted details (prevents PII in cache keys)
  const cacheKey = generateCacheKey(processedDetails);
  const cachedEntry = responseCache.get(cacheKey);
  
  if (cachedEntry && (Date.now() - cachedEntry.timestamp) < CACHE_TTL) {
    devLog('claude', 'Cache hit for guidance request');
    return cachedEntry.response;
  }

  try {
    const systemPrompt = buildSystemPrompt(processedDetails.language);
    const userPrompt = buildUserPrompt(processedDetails);

    devLog('claude', 'Generating personalized guidance...');
    devLog('claude', `Prompt length: ${userPrompt.length} characters`);
    devLog('claude', 'Making API request to Claude (with retry on timeout)...');
    
    const message = await callClaudeWithRetry(systemPrompt, userPrompt, 1);

    // Extract the text content
    const textContent = message.content.find(block => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text content in Claude response');
    }

    // Parse the JSON response using improved extraction
    const responseText = textContent.text;
    const jsonText = extractJSON(responseText);
    
    // Parse and validate the JSON
    let parsedData: any;
    try {
      parsedData = JSON.parse(jsonText);
    } catch (parseError) {
      throw new Error(`Failed to parse Claude response as JSON: ${parseError instanceof Error ? parseError.message : 'Unknown parse error'}. Response preview: ${responseText.slice(0, 200)}...`);
    }

    // Validate response structure
    validateClaudeResponse(parsedData);

    // Calculate costs (Sonnet 4.5 pricing: $3/MTok input, $15/MTok output)
    const inputCost = (message.usage.input_tokens / 1_000_000) * 3.0;
    const outputCost = (message.usage.output_tokens / 1_000_000) * 15.0;

    // Record cost for daily budget tracking
    recordAICost(inputCost + outputCost, 'claude-guidance');

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
      mockQA: parsedData.mockQA,
      usageMetrics: {
        inputTokens: message.usage.input_tokens,
        outputTokens: message.usage.output_tokens,
        estimatedCost: inputCost + outputCost,
      },
    };

    // Run legal accuracy validation against our databases
    try {
      const validationResult = await validateLegalGuidance(guidance, {
        jurisdiction: processedDetails.jurisdiction,
        charges: processedDetails.charges,
        caseStage: processedDetails.caseStage,
      });
      
      guidance.validation = {
        confidenceScore: validationResult.confidenceScore,
        isValid: validationResult.isValid,
        summary: validationResult.summary,
        checksPerformed: validationResult.checksPerformed,
        checksPassed: validationResult.checksPassed,
        issues: validationResult.issues.map(issue => ({
          type: issue.type,
          severity: issue.severity,
          message: issue.message,
          suggestion: issue.suggestion,
        })),
      };
      
      devLog('guidance', `Validation complete - Confidence: ${(validationResult.confidenceScore * 100).toFixed(1)}%`);
    } catch (validationError) {
      devLog('guidance', 'Validation failed, returning guidance without validation', validationError);
      // Continue without validation - guidance is still useful
    }

    // Cross-reference diversion program recommendations against geographic availability
    try {
      const allGuidanceText = [
        guidance.overview || '',
        ...(guidance.nextSteps || []),
        ...(guidance.warnings || []),
        ...(guidance.resources || []).map(r => r.description || ''),
      ].join(' ');
      
      const mentionedDiversions = extractDiversionMentions(allGuidanceText);
      
      if (mentionedDiversions.length > 0) {
        const diversionValidation = checkDiversionAvailability(
          processedDetails.jurisdiction,
          mentionedDiversions
        );
        
        // Add warnings about unavailable diversion programs
        if (diversionValidation.warnings.length > 0) {
          guidance.warnings = [
            ...(guidance.warnings || []),
            ...diversionValidation.warnings,
          ];
          devLog('guidance', `Added ${diversionValidation.warnings.length} diversion availability warnings`);
        }
      }
    } catch (diversionError) {
      devLog('guidance', 'Diversion availability check failed', diversionError);
      // Continue without diversion validation
    }

    // Cache the successful response (including validation)
    responseCache.set(cacheKey, {
      response: guidance,
      timestamp: Date.now(),
    });

    return guidance;
  } catch (error) {
    errLog('Claude AI error', error);
    
    // Provide specific error messages based on error type
    if (error instanceof Anthropic.APIError) {
      if (error.status === 429) {
        throw new Error('AI service is currently overloaded. Please try again in a few minutes.');
      } else if (error.status === 401 || error.status === 403) {
        throw new Error('AI service authentication failed. Please contact support.');
      } else if (error.status === 500 || error.status === 503) {
        throw new Error('AI service is temporarily unavailable. Please try again shortly.');
      } else if (error.status === 400) {
        throw new Error('Invalid request to AI service. Please try with different input.');
      }
    }
    
    // Check for timeout
    if (error instanceof Error && error.message.includes('timed out')) {
      throw new Error('AI service request timed out. The service may be experiencing high load. Please try again.');
    }
    
    throw new Error(
      `Failed to generate AI guidance: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

// Health check function to verify API key is working
export async function testClaudeConnection(): Promise<boolean> {
  try {
    await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 10,
      messages: [{ role: 'user', content: 'test' }],
    });
    return true;
  } catch (error) {
    errLog('Claude connection test failed', error);
    return false;
  }
}
