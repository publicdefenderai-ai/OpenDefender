/**
 * PII (Personally Identifiable Information) Redaction Service
 * 
 * Scrubs sensitive information from user input before sending to Claude AI.
 * Uses category-aware placeholders to preserve narrative context while removing identifiers.
 * 
 * **Redacted Categories (High Confidence):**
 * - Email addresses, phone numbers (regex-based, reliable)
 * - SSN, credit cards, account numbers (regex-based, reliable)
 * - Physical addresses with street numbers (pattern-based)
 * - Government IDs (driver's licenses, passports)
 * - Birthdates in specific formats
 * - **Names in strong context**: "my name is X", "I am X", "Officer/Judge/Dr. X"
 * 
 * **IMPORTANT LIMITATIONS:**
 * This regex-based approach cannot guarantee 100% name redaction while preserving legal context.
 * Names mentioned in free-form narrative (e.g., "John Doe witnessed the event") may not be caught
 * to avoid over-redacting institutional terms like "State of California" or "District Attorney's Office".
 * 
 * **Privacy Guidance for Users:**
 * - Avoid mentioning full names in free-form descriptions
 * - Use pronouns ("the officer", "my attorney") instead of names
 * - Focus on facts and circumstances rather than personal identifiers
 * 
 * **Future Enhancement:**
 * Consider Microsoft Presidio or similar NER/ML-based solution for production-grade name detection.
 */

import { Redactor } from '@redactpii/node';

/**
 * Redaction statistics for observability
 */
export interface RedactionStats {
  name: number;
  email: number;
  phone: number;
  ssn: number;
  creditCard: number;
  address: number;
  dob: number;
  total: number;
}

/**
 * Case details structure (mirrors claude-guidance.ts)
 */
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

/**
 * Redaction result with scrubbed case details and statistics
 */
export interface RedactionResult {
  redactedDetails: CaseDetails;
  stats: RedactionStats;
}

// Configure PII redactor with all detection rules enabled
const redactor = new Redactor({
  rules: {
    // Identity
    EMAIL: true,
    SSN: true,
    PHONE: true,
    CREDIT_CARD: true,
    // Note: @redactpii/node doesn't have built-in NAME detection
    // We'll use comprehensive custom patterns below
  },
  
  // Use custom replacement tokens for better context preservation
  customReplacements: {
    EMAIL: '[REDACTED_EMAIL]',
    SSN: '[REDACTED_SSN]',
    PHONE: '[REDACTED_PHONE]',
    CREDIT_CARD: '[REDACTED_CARD]',
  }
});

/**
 * Additional patterns for PII not covered by @redactpii/node
 */
const ADDITIONAL_PII_PATTERNS = {
  // Physical addresses (basic pattern)
  // Matches: "123 Main St", "456 Oak Avenue Apt 2", etc.
  ADDRESS: /\b\d{1,5}\s+[A-Za-z0-9\s,.-]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct|Circle|Cir|Way|Place|Pl|Parkway|Pkwy|Apartment|Apt|Suite|Ste|Unit|#)\b(?:\s*(?:Apt|Apartment|Suite|Ste|Unit|#)?\s*[A-Za-z0-9-]*)?/gi,
  
  // Driver's License / State ID patterns (common formats)
  // Examples: "DL123456", "A1234567", etc.
  DRIVERS_LICENSE: /\b(?:DL|ID|LIC|LICENSE)[:\s-]?[A-Z0-9]{5,15}\b/gi,
  
  // Passport numbers (format varies by country, basic pattern)
  PASSPORT: /\b(?:PASSPORT|PP)[:\s#-]?[A-Z0-9]{6,12}\b/gi,
  
  // Account numbers (generic pattern)
  ACCOUNT_NUMBER: /\b(?:ACCOUNT|ACCT|ACC)[:\s#-]?[0-9]{6,17}\b/gi,
  
  // Dates of birth (multiple formats)
  // MM/DD/YYYY, DD-MM-YYYY, Month DD, YYYY, etc.
  DOB: /\b(?:DOB|BIRTH|BORN)[:\s]*(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4})\b/gi,
  
  // Context-based name detection (HIGH CONFIDENCE ONLY)
  // Only redacts names when preceded by strong contextual triggers
  // Catches: "my name is John Doe", "I am Jane Smith", "I'm Bob", "called Alice", "named Charlie", "Officer Bob Jones", "Dr. Alice Brown Jr."
  // Supports: case-insensitive, apostrophes, hyphens, initials, suffixes
  // DOES NOT catch names in free narrative to preserve legal context (e.g., "State of California")
  NAME_WITH_STRONG_CONTEXT: /\b(?:my\s+name\s+(?:is|was)|I\s+(?:am|was)|I'm\s+|called\s+|named\s+|(?:Officer|Detective|Sergeant|Lieutenant|Captain|Chief|Judge|Mr\.|Mrs\.|Ms\.|Dr\.|Prof\.|Professor)\s+)((?:[A-Za-z'-]+|[A-Z]\.?)(?:\s+(?:[A-Za-z'-]+|[A-Z]\.?))*(?:\s+(?:Jr\.|Sr\.|III|IV|V|Esq\.))?)/gi,
  
  // Institutional titles and jurisdictional phrases that should NOT be redacted (not personal names)
  // Must check before redacting title + name combinations
  INSTITUTIONAL_TITLES: /\b(?:Attorney\s+General|Chief\s+Justice|Chief\s+Judge|District\s+Attorney|Public\s+Defender|State\s+Attorney|Solicitor\s+General|State\s+of\s+[A-Z][a-z]+|(?:City|County|State)\s+(?:Attorney'?s?|Prosecutor'?s?)\s+Office|Office\s+of\s+the\s+[A-Z][a-z]+|Department\s+of\s+[A-Z][a-z]+)\b/gi,
};

/**
 * Redact text using both @redactpii/node and custom patterns
 */
function redactText(text: string | undefined): string {
  if (!text) return '';
  
  // First pass: Use @redactpii/node for standard PII
  let redacted = redactor.redact(text);
  
  // Second pass: Apply additional custom patterns
  
  // First, protect institutional titles from redaction
  const institutionalTitlePlaceholders = new Map<string, string>();
  let placeholderIndex = 0;
  redacted = redacted.replace(ADDITIONAL_PII_PATTERNS.INSTITUTIONAL_TITLES, (match) => {
    const placeholder = `__INSTITUTIONAL_TITLE_${placeholderIndex++}__`;
    institutionalTitlePlaceholders.set(placeholder, match);
    return placeholder;
  });
  
  // Apply context-based name redaction (HIGH CONFIDENCE ONLY)
  // This preserves legal context while catching the most explicit name disclosures
  redacted = redacted.replace(ADDITIONAL_PII_PATTERNS.NAME_WITH_STRONG_CONTEXT, (match, name) => {
    return match.replace(name, '[REDACTED_NAME]');
  });
  
  redacted = redacted.replace(ADDITIONAL_PII_PATTERNS.ADDRESS, '[REDACTED_ADDRESS]');
  redacted = redacted.replace(ADDITIONAL_PII_PATTERNS.DRIVERS_LICENSE, '[REDACTED_ID]');
  redacted = redacted.replace(ADDITIONAL_PII_PATTERNS.PASSPORT, '[REDACTED_PASSPORT]');
  redacted = redacted.replace(ADDITIONAL_PII_PATTERNS.ACCOUNT_NUMBER, '[REDACTED_ACCOUNT]');
  redacted = redacted.replace(ADDITIONAL_PII_PATTERNS.DOB, '[REDACTED_DOB]');
  
  // Restore institutional titles
  institutionalTitlePlaceholders.forEach((original, placeholder) => {
    redacted = redacted.replace(placeholder, original);
  });
  
  return redacted;
}

/**
 * Count redactions in text for observability
 */
function countRedactions(original: string, redacted: string): Partial<RedactionStats> {
  const stats: Partial<RedactionStats> = {
    name: 0,
    email: 0,
    phone: 0,
    ssn: 0,
    creditCard: 0,
    address: 0,
    dob: 0,
  };
  
  // Count each type of redaction token
  stats.email = (redacted.match(/\[REDACTED_EMAIL\]/g) || []).length;
  stats.phone = (redacted.match(/\[REDACTED_PHONE\]/g) || []).length;
  stats.ssn = (redacted.match(/\[REDACTED_SSN\]/g) || []).length;
  stats.creditCard = (redacted.match(/\[REDACTED_CARD\]/g) || []).length;
  stats.address = (redacted.match(/\[REDACTED_ADDRESS\]/g) || []).length;
  stats.dob = (redacted.match(/\[REDACTED_DOB\]/g) || []).length;
  stats.name = (redacted.match(/\[REDACTED_NAME\]/g) || []).length;
  
  return stats;
}

/**
 * Redact all PII from case details before sending to Claude AI
 * 
 * @param caseDetails - User-provided case information
 * @returns Redacted case details and redaction statistics
 */
export function redactCaseDetails(caseDetails: CaseDetails): RedactionResult {
  // Track all redactions across fields
  const allStats: Partial<RedactionStats> = {
    name: 0,
    email: 0,
    phone: 0,
    ssn: 0,
    creditCard: 0,
    address: 0,
    dob: 0,
  };
  
  // Helper to redact a field and accumulate stats
  const redactField = (text: string | undefined): string => {
    if (!text) return '';
    const original = text;
    const redacted = redactText(text);
    const stats = countRedactions(original, redacted);
    
    // Accumulate stats
    Object.keys(stats).forEach(key => {
      const k = key as keyof RedactionStats;
      if (typeof allStats[k] === 'number' && typeof stats[k] === 'number') {
        (allStats[k] as number) += stats[k] as number;
      }
    });
    
    return redacted;
  };
  
  // Create redacted copy of case details
  const redactedDetails: CaseDetails = {
    // Non-PII fields - pass through unchanged
    jurisdiction: caseDetails.jurisdiction,
    caseStage: caseDetails.caseStage,
    custodyStatus: caseDetails.custodyStatus,
    hasAttorney: caseDetails.hasAttorney,
    witnessesPresent: caseDetails.witnessesPresent,
    
    // Charges - normalize array/string and pass through (charge codes aren't PII)
    charges: caseDetails.charges,
    
    // PII-sensitive fields - redact
    arrestDate: redactField(caseDetails.arrestDate),
    arrestLocation: redactField(caseDetails.arrestLocation),
    incidentDescription: redactField(caseDetails.incidentDescription),
    policeStatement: redactField(caseDetails.policeStatement),
    evidenceNotes: redactField(caseDetails.evidenceNotes),
    priorConvictions: redactField(caseDetails.priorConvictions),
    employmentStatus: redactField(caseDetails.employmentStatus),
    familySituation: redactField(caseDetails.familySituation),
    concernsQuestions: redactField(caseDetails.concernsQuestions),
  };
  
  // Calculate total redactions
  const total = Object.values(allStats).reduce((sum, count) => sum + (count || 0), 0);
  
  const stats: RedactionStats = {
    name: allStats.name || 0,
    email: allStats.email || 0,
    phone: allStats.phone || 0,
    ssn: allStats.ssn || 0,
    creditCard: allStats.creditCard || 0,
    address: allStats.address || 0,
    dob: allStats.dob || 0,
    total,
  };
  
  return {
    redactedDetails,
    stats,
  };
}

/**
 * Check if PII redaction is enabled (can be controlled via env var)
 */
export function isPIIRedactionEnabled(): boolean {
  // Always enabled by default for production safety
  // Can be disabled for development/testing via env var
  return process.env.DISABLE_PII_REDACTION !== 'true';
}

/**
 * Utility to check if text contains potential PII
 * Useful for validation and testing
 */
export function hasPII(text: string): boolean {
  if (!text) return false;
  
  // Quick check using @redactpii/node
  const hasBasicPII = redactor.hasPII(text);
  if (hasBasicPII) return true;
  
  // Check additional patterns
  // Note: Create new RegExp instances to avoid global regex lastIndex issues
  const patterns = {
    ADDRESS: new RegExp(ADDITIONAL_PII_PATTERNS.ADDRESS.source, 'gi'),
    DRIVERS_LICENSE: new RegExp(ADDITIONAL_PII_PATTERNS.DRIVERS_LICENSE.source, 'gi'),
    PASSPORT: new RegExp(ADDITIONAL_PII_PATTERNS.PASSPORT.source, 'gi'),
    ACCOUNT_NUMBER: new RegExp(ADDITIONAL_PII_PATTERNS.ACCOUNT_NUMBER.source, 'gi'),
    DOB: new RegExp(ADDITIONAL_PII_PATTERNS.DOB.source, 'gi'),
    NAME_WITH_STRONG_CONTEXT: new RegExp(ADDITIONAL_PII_PATTERNS.NAME_WITH_STRONG_CONTEXT.source, 'gi'),
  };
  
  for (const pattern of Object.values(patterns)) {
    if (pattern.test(text)) return true;
  }
  
  return false;
}
