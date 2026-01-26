/**
 * Document Generator Service
 *
 * Orchestrates document generation for attorney templates.
 * Handles template loading, AI section generation, and document assembly.
 */

import Anthropic from "@anthropic-ai/sdk";
import { randomUUID } from "crypto";
import { motionToContinueTemplate } from "../../../shared/templates/motion-to-continue";
import { processTemplate, validateFormData, applyJurisdictionVariant } from "./template-processor";
import { devLog, errLog, opsLog } from "../../utils/dev-logger";
import type { DocumentTemplate, TemplateSection } from "../../../shared/templates/schema";

// ============================================================================
// Types
// ============================================================================

export interface GenerateDocumentRequest {
  templateId: string;
  jurisdiction: string;
  formData: Record<string, string>;
  sessionId: string;
}

export interface GeneratedSection {
  id: string;
  name: string;
  type: "static" | "user-input" | "ai-generated";
  content: string;
}

export interface GeneratedDocument {
  documentId: string;
  templateId: string;
  templateName: string;
  jurisdiction: string;
  sections: GeneratedSection[];
  generatedAt: Date;
  expiresAt: Date;
}

export interface DocumentGenerationError {
  code: string;
  message: string;
  section?: string;
}

// Template registry
const templateRegistry: Map<string, DocumentTemplate> = new Map([
  ["motion-to-continue", motionToContinueTemplate],
]);

// Document storage (in-memory, expires with session)
const generatedDocuments: Map<string, GeneratedDocument> = new Map();

// Cleanup interval (every 5 minutes)
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
const DOCUMENT_TTL_MS = 30 * 60 * 1000; // 30 minutes (matches session TTL)

// Start cleanup interval
setInterval(() => {
  const now = Date.now();
  const keysToDelete: string[] = [];

  generatedDocuments.forEach((doc, key) => {
    if (doc.expiresAt.getTime() < now) {
      keysToDelete.push(key);
    }
  });

  if (keysToDelete.length > 0) {
    keysToDelete.forEach((key) => generatedDocuments.delete(key));
    opsLog(`[Document Generator] Cleaned up ${keysToDelete.length} expired documents`);
  }
}, CLEANUP_INTERVAL_MS);

// ============================================================================
// Template Functions
// ============================================================================

/**
 * Get list of available templates
 */
export function getTemplates(category?: string): Array<{
  id: string;
  name: string;
  category: string;
  description: string;
  estimatedCompletionTime: string;
  difficultyLevel: string;
  supportedJurisdictions: string[];
}> {
  const templates: Array<{
    id: string;
    name: string;
    category: string;
    description: string;
    estimatedCompletionTime: string;
    difficultyLevel: string;
    supportedJurisdictions: string[];
  }> = [];

  templateRegistry.forEach((template) => {
    if (!category || template.category === category) {
      templates.push({
        id: template.id,
        name: template.name,
        category: template.category,
        description: template.description,
        estimatedCompletionTime: template.estimatedCompletionTime,
        difficultyLevel: template.difficultyLevel,
        supportedJurisdictions: template.supportedJurisdictions,
      });
    }
  });

  return templates;
}

/**
 * Get a specific template by ID
 */
export function getTemplate(templateId: string, jurisdiction?: string): DocumentTemplate | null {
  const template = templateRegistry.get(templateId);
  if (!template) return null;

  // Apply jurisdiction variant if available
  if (jurisdiction) {
    return applyJurisdictionVariant(template, jurisdiction);
  }

  return template;
}

/**
 * Get a generated document by ID
 */
export function getGeneratedDocument(documentId: string): GeneratedDocument | null {
  const doc = generatedDocuments.get(documentId);
  if (!doc) return null;

  // Check if expired
  if (doc.expiresAt.getTime() < Date.now()) {
    generatedDocuments.delete(documentId);
    return null;
  }

  return doc;
}

// ============================================================================
// AI Generation
// ============================================================================

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
      timeout: 60000, // 60 second timeout
    })
  : null;

const AI_SYSTEM_PROMPT = `You are an expert legal document drafter for criminal defense matters.
Generate professional, persuasive content for court filings.
Use formal legal writing style. Cite relevant authorities when appropriate.
Be concise but thorough. Focus on facts and applicable law.
Do not include any preamble or explanation - return only the requested content.`;

/**
 * Generate AI content for a section
 */
async function generateAISection(
  section: TemplateSection,
  formData: Record<string, string>,
  jurisdiction: string
): Promise<string> {
  if (!anthropic) {
    throw new Error("AI service not configured (ANTHROPIC_API_KEY missing)");
  }

  if (!section.aiPromptTemplate) {
    throw new Error(`No AI prompt template for section: ${section.id}`);
  }

  // Interpolate variables into the prompt (but NOT PII like names)
  // Form data that gets sent to AI should be limited to non-PII metadata
  const safeFormData: Record<string, string> = {
    jurisdiction,
    hearingType: formData.hearingType || "hearing",
    primaryReason: formData.primaryReason || "good cause",
    reasonExplanation: formData.reasonExplanation || "",
    priorContinuances: formData.priorContinuances || "0",
    custodyStatus: formData.custodyStatus || "unknown",
    speedyTrialWaiver: formData.speedyTrialWaiver || "unknown",
    oppositionPosition: formData.oppositionPosition || "unknown",
  };

  // Process template with safe data
  const prompt = processTemplate(section.aiPromptTemplate, safeFormData);

  devLog(`[AI] Generating content for section: ${section.id}`);
  devLog(`[AI] Prompt length: ${prompt.length} characters`);

  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      temperature: 0.3, // Low temperature for legal accuracy
      system: AI_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const textContent = response.content.find((block) => block.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text content in AI response");
    }

    opsLog(
      `[AI] Section ${section.id}: ${response.usage.input_tokens}+${response.usage.output_tokens} tokens`
    );

    return textContent.text.trim();
  } catch (error) {
    errLog(`[AI] Failed to generate section ${section.id}:`, error);
    throw error;
  }
}

// ============================================================================
// Document Generation
// ============================================================================

/**
 * Generate a document from a template
 */
export async function generateDocument(
  request: GenerateDocumentRequest
): Promise<GeneratedDocument> {
  const { templateId, jurisdiction, formData, sessionId } = request;

  // Get template with jurisdiction variant
  const template = getTemplate(templateId, jurisdiction);
  if (!template) {
    throw new Error(`Template not found: ${templateId}`);
  }

  // Validate form data
  const validation = validateFormData(template, formData);
  if (!validation.isValid) {
    throw new Error(`Invalid form data: ${validation.errors.join(", ")}`);
  }

  devLog(`[Document Generator] Generating ${templateId} for jurisdiction ${jurisdiction}`);

  // Process each section
  const generatedSections: GeneratedSection[] = [];

  for (const section of template.baseSections) {
    let content = "";

    switch (section.type) {
      case "static":
        // Process static content with variable interpolation
        content = section.staticContent
          ? processTemplate(section.staticContent, formData)
          : "";
        break;

      case "user-input":
        // Format user input as structured content
        content = formatUserInputSection(section, formData);
        break;

      case "ai-generated":
        // Generate AI content
        content = await generateAISection(section, formData, jurisdiction);
        break;

      default:
        devLog(`[Document Generator] Unknown section type: ${section.type}`);
    }

    generatedSections.push({
      id: section.id,
      name: section.name,
      type: section.type,
      content,
    });
  }

  // Create document record
  const documentId = randomUUID();
  const now = new Date();

  const document: GeneratedDocument = {
    documentId,
    templateId,
    templateName: template.name,
    jurisdiction,
    sections: generatedSections,
    generatedAt: now,
    expiresAt: new Date(now.getTime() + DOCUMENT_TTL_MS),
  };

  // Store document
  generatedDocuments.set(documentId, document);

  opsLog(`[Document Generator] Generated document ${documentId.substring(0, 8)} for session ${sessionId.substring(0, 8)}`);

  return document;
}

/**
 * Format user input section for display
 */
function formatUserInputSection(
  section: TemplateSection,
  formData: Record<string, string>
): string {
  if (!section.inputs) return "";

  const lines: string[] = [];

  for (const input of section.inputs) {
    const value = formData[input.id];
    if (value) {
      // For select inputs, try to find the label
      if (input.type === "select" && input.validation?.options) {
        const option = input.validation.options.find((opt) => opt.value === value);
        lines.push(`${input.label}: ${option?.label || value}`);
      } else {
        lines.push(`${input.label}: ${value}`);
      }
    }
  }

  return lines.join("\n");
}

/**
 * Delete a generated document
 */
export function deleteGeneratedDocument(documentId: string): boolean {
  return generatedDocuments.delete(documentId);
}

/**
 * Clear all documents for a session
 */
export function clearSessionDocuments(sessionId: string): number {
  // In a production system, we'd track documents by session
  // For now, this clears all documents (since we don't track session-document mapping)
  const count = generatedDocuments.size;
  generatedDocuments.clear();
  return count;
}
