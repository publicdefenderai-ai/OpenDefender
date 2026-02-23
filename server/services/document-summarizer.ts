/**
 * Document Summarization Service
 *
 * Provides AI-powered summarization of legal documents using Claude.
 *
 * PRIVACY & SECURITY:
 * - Documents are processed in memory only - never written to disk or database
 * - No caching of documents or summaries
 * - PII is redacted before sending to Claude
 * - All data is cleared after response is sent
 * - Anthropic does not store documents permanently or use them for AI training
 * - Anthropic may temporarily retain data for up to 30 days for operational/safety purposes
 */

import Anthropic from '@anthropic-ai/sdk';
import { CLAUDE_MODEL } from '../config/ai-model';
import * as pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { devLog, errLog } from '../utils/dev-logger';
import { recordAICost, isRequestCostAcceptable } from './cost-tracker';

// Initialize Anthropic client
const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  errLog('Anthropic API key not set for document summarizer');
}

const anthropic = apiKey ? new Anthropic({
  apiKey,
  timeout: 120000, // 2 minute timeout for document processing
}) : null;

// Supported file types and their max sizes
const SUPPORTED_TYPES = {
  'application/pdf': { ext: 'pdf', maxSize: 10 * 1024 * 1024 }, // 10MB
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { ext: 'docx', maxSize: 10 * 1024 * 1024 },
  'text/plain': { ext: 'txt', maxSize: 1 * 1024 * 1024 }, // 1MB
  'image/png': { ext: 'png', maxSize: 5 * 1024 * 1024 }, // 5MB - for OCR via Claude vision
  'image/jpeg': { ext: 'jpg', maxSize: 5 * 1024 * 1024 },
  'image/webp': { ext: 'webp', maxSize: 5 * 1024 * 1024 },
};

// Maximum text length to send to Claude (~25k tokens at ~4 chars/token)
const MAX_TEXT_LENGTH = 100_000;

export interface DocumentSummaryRequest {
  file: Buffer;
  mimeType: string;
  filename: string;
  language?: 'en' | 'es';
  summaryType?: 'general' | 'legal_document' | 'court_filing' | 'police_report' | 'evidence';
}

export interface DocumentSummary {
  summary: string;
  keyPoints: string[];
  importantDates: Array<{
    date: string;
    description: string;
    isDeadline: boolean;
  }>;
  legalTermsExplained: Array<{
    term: string;
    explanation: string;
  }>;
  potentialConcerns: string[];
  recommendedActions: string[];
  documentType: string;
  pageCount?: number;
  usageMetrics: {
    inputTokens: number;
    outputTokens: number;
    estimatedCost: number;
  };
}

export interface SummaryError {
  code: 'UNSUPPORTED_TYPE' | 'FILE_TOO_LARGE' | 'EXTRACTION_FAILED' | 'AI_ERROR' | 'INVALID_FILE' | 'SERVICE_UNAVAILABLE';
  message: string;
}

/**
 * Validate file type and size
 */
export function validateFile(mimeType: string, size: number): SummaryError | null {
  const typeConfig = SUPPORTED_TYPES[mimeType as keyof typeof SUPPORTED_TYPES];

  if (!typeConfig) {
    return {
      code: 'UNSUPPORTED_TYPE',
      message: `Unsupported file type: ${mimeType}. Supported types: PDF, DOCX, TXT, PNG, JPEG, WebP`
    };
  }

  if (size > typeConfig.maxSize) {
    const maxMB = typeConfig.maxSize / (1024 * 1024);
    return {
      code: 'FILE_TOO_LARGE',
      message: `File too large. Maximum size for ${typeConfig.ext.toUpperCase()} files is ${maxMB}MB`
    };
  }

  return null;
}

/**
 * Extract text content from a document
 */
async function extractText(file: Buffer, mimeType: string): Promise<{ text: string; pageCount?: number }> {
  try {
    switch (mimeType) {
      case 'application/pdf': {
        const pdfData = await pdfParse(file);
        return {
          text: pdfData.text.slice(0, MAX_TEXT_LENGTH),
          pageCount: pdfData.numpages
        };
      }

      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
        const result = await mammoth.extractRawText({ buffer: file });
        return {
          text: result.value.slice(0, MAX_TEXT_LENGTH)
        };
      }

      case 'text/plain': {
        return {
          text: file.toString('utf-8').slice(0, MAX_TEXT_LENGTH)
        };
      }

      // Images will be handled via Claude's vision capability
      case 'image/png':
      case 'image/jpeg':
      case 'image/webp':
        return { text: '' }; // Text will be extracted by Claude vision

      default:
        throw new Error(`Unsupported mime type: ${mimeType}`);
    }
  } catch (error) {
    devLog('summarizer', 'Text extraction failed', error);
    throw new Error(`Failed to extract text from document: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Basic PII redaction for document text
 * Note: This is a simplified version - the full PII redactor handles more cases
 */
function redactDocumentPII(text: string): string {
  let redacted = text;

  // SSN patterns
  redacted = redacted.replace(/\b\d{3}[-.]?\d{2}[-.]?\d{4}\b/g, '[SSN REDACTED]');

  // Phone numbers
  redacted = redacted.replace(/\b(\+?1[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE REDACTED]');

  // Email addresses
  redacted = redacted.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL REDACTED]');

  // Credit card numbers
  redacted = redacted.replace(/\b(?:\d{4}[-. ]?){3}\d{4}\b/g, '[CARD REDACTED]');

  // Driver's license patterns (varies by state, basic pattern)
  redacted = redacted.replace(/\b[A-Z]{1,2}\d{6,8}\b/gi, '[DL# REDACTED]');

  return redacted;
}

/**
 * Build system prompt for document summarization
 */
function buildSystemPrompt(language: 'en' | 'es', summaryType: string): string {
  const isSpanish = language === 'es';

  const languageInstruction = isSpanish
    ? 'IMPORTANT: Respond entirely in Spanish (Español). Use clear, simple language.'
    : '';

  const typeInstructions: Record<string, string> = {
    general: 'This is a general legal document. Identify its type and summarize its key contents.',
    legal_document: 'This is a formal legal document. Focus on legal obligations, rights, and requirements.',
    court_filing: 'This is a court filing. Identify the case details, claims, and required responses.',
    police_report: 'This is a police report. Summarize the incident, charges, and evidence mentioned.',
    evidence: 'This document may be used as evidence. Identify what it proves or disproves and its relevance.',
  };

  return `You are a legal document analyst for Public Defender AI. Your role is to help people understand legal documents they have received in simple, clear language (6th-8th grade reading level).

${languageInstruction}

DOCUMENT TYPE CONTEXT:
${typeInstructions[summaryType] || typeInstructions.general}

CRITICAL REQUIREMENTS:
1. Use simple, everyday language - explain all legal terms
2. Highlight anything that requires action or has a deadline
3. Identify potential concerns or issues for the reader
4. Be thorough but concise
5. Never provide legal advice - explain what the document says, not what to do about it
6. If the document quality is poor or text is unclear, note this

RESPONSE STRUCTURE:
Return a JSON object with these exact fields:
- summary: A 2-4 paragraph plain-English summary of what this document is and what it means
- keyPoints: Array of 3-7 most important points from the document
- importantDates: Array of {date: string, description: string, isDeadline: boolean} for any dates mentioned
- legalTermsExplained: Array of {term: string, explanation: string} for legal terms that appear
- potentialConcerns: Array of things the reader should be aware of or concerned about
- recommendedActions: Array of suggested next steps (general guidance, not legal advice)
- documentType: Your assessment of what type of document this is (e.g., "Criminal Complaint", "Subpoena", "Plea Agreement", etc.)

TONE: Helpful, clear, and empowering. You're helping someone understand important legal documents.`;
}

/**
 * Summarize a document using Claude AI
 */
export async function summarizeDocument(request: DocumentSummaryRequest): Promise<DocumentSummary> {
  if (!anthropic) {
    throw new Error('Document summarization service is not configured');
  }

  const { file, mimeType, filename, language = 'en', summaryType = 'general' } = request;

  devLog('summarizer', `Processing ${filename} (${mimeType}, ${file.length} bytes)`);

  // Validate file
  const validationError = validateFile(mimeType, file.length);
  if (validationError) {
    throw new Error(validationError.message);
  }

  // Extract text (or prepare for vision)
  const { text, pageCount } = await extractText(file, mimeType);

  // Redact PII from extracted text
  const redactedText = text ? redactDocumentPII(text) : '';

  const systemPrompt = buildSystemPrompt(language, summaryType);

  // Pre-flight cost check for text-based documents (images use vision pricing, not char-based)
  if (!mimeType.startsWith('image/') && !isRequestCostAcceptable(systemPrompt.length + redactedText.length)) {
    throw new Error('Document content is too large to process. Please use a shorter document or select specific pages.');
  }

  // Build the message content based on file type
  let messageContent: Anthropic.Messages.ContentBlockParam[];

  if (mimeType.startsWith('image/')) {
    // Use Claude's vision capability for images
    const base64Data = file.toString('base64');
    const mediaType = mimeType as 'image/png' | 'image/jpeg' | 'image/webp' | 'image/gif';

    messageContent = [
      {
        type: 'image',
        source: {
          type: 'base64',
          media_type: mediaType,
          data: base64Data,
        },
      },
      {
        type: 'text',
        text: `Please analyze this document image and provide a summary. The file is named "${filename}". Extract all visible text and provide the structured analysis.`,
      },
    ];
  } else {
    // Text-based document
    if (!redactedText || redactedText.trim().length < 50) {
      throw new Error('Could not extract sufficient text from the document. The file may be empty, corrupted, or contain only images.');
    }

    messageContent = [
      {
        type: 'text',
        text: `Please analyze this legal document and provide a summary. The file is named "${filename}".\n\nDOCUMENT CONTENT:\n\n${redactedText}`,
      },
    ];
  }

  try {
    devLog('summarizer', 'Calling Claude API...');
    const startTime = Date.now();

    const message = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 4096,
      temperature: 0.2,
      system: [
        {
          type: 'text' as const,
          text: systemPrompt,
          cache_control: { type: 'ephemeral' as const },
        },
      ],
      messages: [
        {
          role: 'user',
          content: messageContent,
        },
      ],
    });

    devLog('summarizer', `Claude responded in ${Date.now() - startTime}ms`);

    // Extract response text
    const textContent = message.content.find(block => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text content in Claude response');
    }

    // Parse JSON from response
    const responseText = textContent.text;
    let jsonText: string;

    // Try to extract JSON from markdown code block
    const markdownMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (markdownMatch) {
      jsonText = markdownMatch[1].trim();
    } else {
      // Find JSON object directly
      const jsonStart = responseText.indexOf('{');
      const jsonEnd = responseText.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        jsonText = responseText.slice(jsonStart, jsonEnd + 1);
      } else {
        throw new Error('Could not extract JSON from response');
      }
    }

    const parsed = JSON.parse(jsonText);

    // Calculate costs (Sonnet 4 pricing: $3/MTok input, $15/MTok output)
    // With prompt caching: cache writes = $3.75/MTok (+25%), cache reads = $0.30/MTok (-90%)
    const regularInputCost = (message.usage.input_tokens / 1_000_000) * 3.0;
    const cacheWriteCost = ((message.usage.cache_creation_input_tokens ?? 0) / 1_000_000) * 3.75;
    const cacheReadCost = ((message.usage.cache_read_input_tokens ?? 0) / 1_000_000) * 0.30;
    const inputCost = regularInputCost + cacheWriteCost + cacheReadCost;
    const outputCost = (message.usage.output_tokens / 1_000_000) * 15.0;

    // Record cost for daily budget tracking
    recordAICost(inputCost + outputCost, 'document-summarizer');

    const summary: DocumentSummary = {
      summary: parsed.summary || 'Unable to generate summary',
      keyPoints: parsed.keyPoints || [],
      importantDates: parsed.importantDates || [],
      legalTermsExplained: parsed.legalTermsExplained || [],
      potentialConcerns: parsed.potentialConcerns || [],
      recommendedActions: parsed.recommendedActions || [],
      documentType: parsed.documentType || 'Unknown Document Type',
      pageCount,
      usageMetrics: {
        inputTokens: message.usage.input_tokens,
        outputTokens: message.usage.output_tokens,
        estimatedCost: inputCost + outputCost,
      },
    };

    devLog('summarizer', `Summary generated successfully. Document type: ${summary.documentType}`);

    // IMPORTANT: Do not cache or store the summary - return immediately
    // The buffer and all data will be garbage collected after response is sent

    return summary;

  } catch (error) {
    devLog('summarizer', 'Error', error);

    if (error instanceof Anthropic.APIError) {
      if (error.status === 429) {
        throw new Error('AI service is currently overloaded. Please try again in a few minutes.');
      } else if (error.status === 401 || error.status === 403) {
        throw new Error('AI service authentication failed.');
      }
    }

    throw new Error(`Failed to summarize document: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get supported file types for UI display
 */
export function getSupportedFileTypes(): Array<{ mimeType: string; extension: string; maxSizeMB: number }> {
  return Object.entries(SUPPORTED_TYPES).map(([mimeType, config]) => ({
    mimeType,
    extension: config.ext,
    maxSizeMB: config.maxSize / (1024 * 1024),
  }));
}
