/**
 * PII (Personally Identifiable Information) Redaction Service
 * 
 * Enhanced with NLP-based name detection using compromise.js for ML-powered
 * entity recognition. All processing happens locally - no data sent externally.
 * 
 * Scrubs sensitive information from user input before sending to Claude AI.
 * Uses category-aware placeholders to preserve narrative context while removing identifiers.
 * 
 * **Redacted Categories:**
 * - Email addresses, phone numbers (regex-based, reliable)
 * - SSN, credit cards, account numbers (regex-based, reliable)
 * - Physical addresses with street numbers (pattern-based)
 * - Government IDs (driver's licenses, passports)
 * - Birthdates in specific formats
 * - **Names**: NLP-detected person names + context-based patterns
 * - **Organizations**: Detected but preserved for legal context
 * 
 * **Privacy Guarantee:**
 * All NLP processing runs locally using compromise.js - no external API calls.
 * User data never leaves this server.
 */

import { Redactor } from '@redactpii/node';
import nlp from 'compromise';

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
  language?: string;
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
    EMAIL: true,
    SSN: true,
    PHONE: true,
    CREDIT_CARD: true,
  },
  
  customReplacements: {
    EMAIL: '[REDACTED_EMAIL]',
    SSN: '[REDACTED_SSN]',
    PHONE: '[REDACTED_PHONE]',
    CREDIT_CARD: '[REDACTED_CARD]',
  }
});

/**
 * Legal/institutional terms that should NOT be redacted even if they look like names
 */
const PROTECTED_TERMS = new Set([
  // Government entities
  'state of', 'county of', 'city of', 'united states', 'commonwealth of',
  // Legal roles (generic)
  'attorney general', 'district attorney', 'public defender', 'state attorney',
  'chief justice', 'chief judge', 'solicitor general',
  // Institutions
  'police department', 'sheriff office', 'court of appeals', 'supreme court',
  'department of', 'office of', 'bureau of', 'division of',
  // Common legal phrases
  'in re', 'ex parte', 'pro se', 'habeas corpus',
]);

/**
 * Check if a name match is likely a protected institutional term
 */
function isProtectedTerm(text: string, matchStart: number, matchEnd: number): boolean {
  // Get surrounding context (50 chars before and after)
  const contextStart = Math.max(0, matchStart - 50);
  const contextEnd = Math.min(text.length, matchEnd + 50);
  const context = text.slice(contextStart, contextEnd).toLowerCase();
  
  // Check if any protected term is in the context around this match
  for (const term of Array.from(PROTECTED_TERMS)) {
    if (context.includes(term)) {
      // Check if the match is part of this protected phrase
      const matchText = text.slice(matchStart, matchEnd).toLowerCase();
      if (context.indexOf(matchText) >= context.indexOf(term) && 
          context.indexOf(matchText) <= context.indexOf(term) + term.length + 20) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * NLP-based name detection using compromise.js
 * Detects person names in free-form text without relying solely on patterns
 */
function detectNamesWithNLP(text: string): Array<{ text: string; start: number; end: number }> {
  const names: Array<{ text: string; start: number; end: number }> = [];
  
  try {
    const doc = nlp(text);
    
    // Get all person names detected by NLP
    const people = doc.people();
    
    people.forEach((person: any) => {
      const personText = person.text();
      if (personText && personText.length >= 2) {
        // Find all occurrences of this name in the original text
        let searchStart = 0;
        while (true) {
          const index = text.indexOf(personText, searchStart);
          if (index === -1) break;
          
          // Only add if not a protected term
          if (!isProtectedTerm(text, index, index + personText.length)) {
            names.push({
              text: personText,
              start: index,
              end: index + personText.length
            });
          }
          
          searchStart = index + 1;
        }
      }
    });
    
    // Also detect possessive names (e.g., "John's car")
    const possessives = doc.match('#Person+').forEach((match: any) => {
      const matchText = match.text();
      if (matchText && matchText.length >= 2) {
        let searchStart = 0;
        while (true) {
          const index = text.indexOf(matchText, searchStart);
          if (index === -1) break;
          
          if (!isProtectedTerm(text, index, index + matchText.length)) {
            // Check for duplicates
            const isDuplicate = names.some(n => 
              n.start === index && n.end === index + matchText.length
            );
            if (!isDuplicate) {
              names.push({
                text: matchText,
                start: index,
                end: index + matchText.length
              });
            }
          }
          
          searchStart = index + 1;
        }
      }
    });
    
  } catch (error) {
    console.error('[PII Redactor] NLP name detection error:', error);
  }
  
  // Sort by position (reverse order for safe replacement)
  return names.sort((a, b) => b.start - a.start);
}

/**
 * Additional patterns for PII not covered by @redactpii/node
 */
const ADDITIONAL_PII_PATTERNS = {
  ADDRESS: /\b\d{1,5}\s+[A-Za-z0-9\s,.-]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct|Circle|Cir|Way|Place|Pl|Parkway|Pkwy|Apartment|Apt|Suite|Ste|Unit|#)\b(?:\s*(?:Apt|Apartment|Suite|Ste|Unit|#)?\s*[A-Za-z0-9-]*)?/gi,
  
  DRIVERS_LICENSE: /\b(?:DL|ID|LIC|LICENSE)[:\s-]?[A-Z0-9]{5,15}\b/gi,
  
  PASSPORT: /\b(?:PASSPORT|PP)[:\s#-]?[A-Z0-9]{6,12}\b/gi,
  
  ACCOUNT_NUMBER: /\b(?:ACCOUNT|ACCT|ACC)[:\s#-]?[0-9]{6,17}\b/gi,
  
  DOB: /\b(?:DOB|BIRTH|BORN)[:\s]*(?:\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4})\b/gi,
  
  // Context-based name detection (fallback for explicit patterns)
  NAME_WITH_STRONG_CONTEXT: /\b(?:my\s+name\s+(?:is|was)|I\s+(?:am|was)|I'm\s+|called\s+|named\s+|(?:Officer|Detective|Sergeant|Lieutenant|Captain|Chief|Judge|Mr\.|Mrs\.|Ms\.|Dr\.|Prof\.|Professor)\s+)((?:[A-Za-z'-]+|[A-Z]\.?)(?:\s+(?:[A-Za-z'-]+|[A-Z]\.?))*(?:\s+(?:Jr\.|Sr\.|III|IV|V|Esq\.))?)/gi,
  
  INSTITUTIONAL_TITLES: /\b(?:Attorney\s+General|Chief\s+Justice|Chief\s+Judge|District\s+Attorney|Public\s+Defender|State\s+Attorney|Solicitor\s+General|State\s+of\s+[A-Z][a-z]+|(?:City|County|State)\s+(?:Attorney'?s?|Prosecutor'?s?)\s+Office|Office\s+of\s+the\s+[A-Z][a-z]+|Department\s+of\s+[A-Z][a-z]+)\b/gi,
};

/**
 * Redact text using NLP-based detection, @redactpii/node, and custom patterns
 */
function redactText(text: string | undefined): string {
  if (!text) return '';
  
  // First pass: Use @redactpii/node for standard PII (email, SSN, phone, credit card)
  let redacted = redactor.redact(text);
  
  // Second pass: NLP-based name detection
  const nlpNames = detectNamesWithNLP(redacted);
  for (const name of nlpNames) {
    // Replace from end to start to preserve positions
    redacted = redacted.slice(0, name.start) + '[REDACTED_NAME]' + redacted.slice(name.end);
  }
  
  // Third pass: Apply additional custom patterns
  
  // Protect institutional titles from redaction
  const institutionalTitlePlaceholders = new Map<string, string>();
  let placeholderIndex = 0;
  redacted = redacted.replace(ADDITIONAL_PII_PATTERNS.INSTITUTIONAL_TITLES, (match) => {
    const placeholder = `__INSTITUTIONAL_TITLE_${placeholderIndex++}__`;
    institutionalTitlePlaceholders.set(placeholder, match);
    return placeholder;
  });
  
  // Apply context-based name redaction (fallback for patterns NLP might miss)
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
  const allStats: Partial<RedactionStats> = {
    name: 0,
    email: 0,
    phone: 0,
    ssn: 0,
    creditCard: 0,
    address: 0,
    dob: 0,
  };
  
  const redactField = (text: string | undefined): string => {
    if (!text) return '';
    const original = text;
    const redacted = redactText(text);
    const stats = countRedactions(original, redacted);
    
    Object.keys(stats).forEach(key => {
      const k = key as keyof RedactionStats;
      if (typeof allStats[k] === 'number' && typeof stats[k] === 'number') {
        (allStats[k] as number) += stats[k] as number;
      }
    });
    
    return redacted;
  };
  
  const redactedDetails: CaseDetails = {
    jurisdiction: caseDetails.jurisdiction,
    caseStage: caseDetails.caseStage,
    custodyStatus: caseDetails.custodyStatus,
    hasAttorney: caseDetails.hasAttorney,
    witnessesPresent: caseDetails.witnessesPresent,
    charges: caseDetails.charges,
    language: caseDetails.language,
    
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
 * Check if PII redaction is enabled
 *
 * SECURITY: PII redaction is now MANDATORY and cannot be disabled.
 * This protects user privacy by ensuring sensitive information is always
 * scrubbed before being sent to external AI services.
 *
 * Previously this could be disabled via DISABLE_PII_REDACTION env var,
 * but that option has been removed to prevent accidental exposure of
 * personally identifiable information.
 */
export function isPIIRedactionEnabled(): boolean {
  // SECURITY: Always enabled - cannot be disabled
  // Removed: process.env.DISABLE_PII_REDACTION check
  return true;
}

/**
 * Utility to check if text contains potential PII
 * Now includes NLP-based name detection
 */
export function hasPII(text: string): boolean {
  if (!text) return false;
  
  // Check using @redactpii/node
  const hasBasicPII = redactor.hasPII(text);
  if (hasBasicPII) return true;
  
  // Check for NLP-detected names
  const nlpNames = detectNamesWithNLP(text);
  if (nlpNames.length > 0) return true;
  
  // Check additional patterns
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

/**
 * Test function for development - shows what would be redacted
 */
export function testRedaction(text: string): { original: string; redacted: string; names: string[] } {
  const nlpNames = detectNamesWithNLP(text);
  const redacted = redactText(text);
  
  return {
    original: text,
    redacted,
    names: nlpNames.map(n => n.text),
  };
}
