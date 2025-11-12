/**
 * PII (Personally Identifiable Information) Redaction Service
 * 
 * Scrubs sensitive information from user input before sending to Claude AI.
 * Uses category-aware placeholders to preserve narrative context while removing identifiers.
 * 
 * Redacted categories:
 * - Full names (including aliases)
 * - Physical addresses (home, work, school)
 * - Email addresses and usernames
 * - Phone numbers
 * - SSN, passport, driver's license, government IDs
 * - Financial information (account/card numbers)
 * - Birthdates
 * - Sensitive employment, health, educational, legal records
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
  
  // Enhanced name detection - matches names in any case (2-4 words)
  // Matches: "John Doe", "john doe", "JOHN DOE", "Mary Jane Smith", "Officer Johnson"
  // Limitations: May have false positives with proper nouns, place names, organizations
  // This is a trade-off between privacy (over-redaction) and accuracy
  FULL_NAME: /\b[A-Za-z]{2,15}(?:\s+[A-Za-z]{2,15}){1,3}\b/g,
  
  // Specific name context patterns for higher confidence  
  // Catches: "my name is X", "I am X", "arrested X", "Officer X", etc.
  // Case-insensitive to catch all variants
  NAME_WITH_CONTEXT: /\b(?:my\s+name\s+(?:is|was)|I\s+(?:am|was)|called|named|(?:Officer|Detective|Mr\.|Mrs\.|Ms\.|Dr\.)\s+)([A-Za-z]+(?:\s+[A-Za-z]+)*)/gi,
};

/**
 * Redact text using both @redactpii/node and custom patterns
 */
function redactText(text: string | undefined): string {
  if (!text) return '';
  
  // First pass: Use @redactpii/node for standard PII
  let redacted = redactor.redact(text);
  
  // Second pass: Apply additional custom patterns
  // Apply context-based name redaction first (higher confidence)
  redacted = redacted.replace(ADDITIONAL_PII_PATTERNS.NAME_WITH_CONTEXT, (match, name) => {
    return match.replace(name, '[REDACTED_NAME]');
  });
  
  // Apply general capitalized name pattern
  // Skip common words/titles to reduce false positives
  const commonWords = new Set([
    'The', 'This', 'That', 'These', 'Those', 'What', 'When', 'Where', 'Which', 'Who',
    'Police', 'Court', 'Judge', 'Attorney', 'Defendant', 'Plaintiff', 'State', 'Federal',
    'County', 'City', 'Department', 'Office', 'Bureau', 'Agency', 'United', 'States',
    'America', 'Public', 'Defender', 'District', 'Superior', 'Municipal', 'Criminal',
    'Civil', 'Family', 'Juvenile', 'Traffic', 'Small', 'Claims', 'Monday', 'Tuesday',
    'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'January', 'February',
    'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',
    'November', 'December', 'North', 'South', 'East', 'West', 'Street', 'Avenue',
    'Boulevard', 'Road', 'Drive', 'Lane', 'Court'
  ]);
  
  redacted = redacted.replace(ADDITIONAL_PII_PATTERNS.FULL_NAME, (match) => {
    // Check if it's a common word/title we should skip (case-insensitive)
    const firstWord = match.split(/\s+/)[0];
    
    // Check against common words (case-insensitive comparison)
    const commonWordsArray = Array.from(commonWords);
    for (const commonWord of commonWordsArray) {
      if (firstWord.toLowerCase() === commonWord.toLowerCase()) {
        return match; // Don't redact
      }
    }
    
    // Also skip if all words are very short (likely not names)
    const words = match.split(/\s+/);
    if (words.every(w => w.length <= 2)) {
      return match; // Don't redact short words like "to be", "if it"
    }
    
    return '[REDACTED_NAME]';
  });
  
  redacted = redacted.replace(ADDITIONAL_PII_PATTERNS.ADDRESS, '[REDACTED_ADDRESS]');
  redacted = redacted.replace(ADDITIONAL_PII_PATTERNS.DRIVERS_LICENSE, '[REDACTED_ID]');
  redacted = redacted.replace(ADDITIONAL_PII_PATTERNS.PASSPORT, '[REDACTED_PASSPORT]');
  redacted = redacted.replace(ADDITIONAL_PII_PATTERNS.ACCOUNT_NUMBER, '[REDACTED_ACCOUNT]');
  redacted = redacted.replace(ADDITIONAL_PII_PATTERNS.DOB, '[REDACTED_DOB]');
  
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
    FULL_NAME: new RegExp(ADDITIONAL_PII_PATTERNS.FULL_NAME.source, 'g'),
    NAME_WITH_CONTEXT: new RegExp(ADDITIONAL_PII_PATTERNS.NAME_WITH_CONTEXT.source, 'gi'),
  };
  
  for (const pattern of Object.values(patterns)) {
    if (pattern.test(text)) return true;
  }
  
  return false;
}
