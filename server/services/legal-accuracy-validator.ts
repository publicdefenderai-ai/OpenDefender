/**
 * Legal Accuracy Validation Service
 * 
 * Tier 1 Validation: Cross-references AI-generated legal guidance against 
 * authoritative data sources to ensure accuracy.
 * 
 * Validation Layers:
 * 1. Citation Validation - Verifies statute citations exist in our database
 * 2. Penalty Accuracy - Confirms penalty statements match official records
 * 3. Jurisdiction Match - Ensures guidance is appropriate for the specified state
 * 4. Timeline Verification - Validates deadlines are realistic for jurisdiction
 */

import { storage } from '../storage';
import { criminalCharges, getChargeById, getChargesByJurisdiction } from '@shared/criminal-charges';

export interface ValidationIssue {
  type: 'citation_not_found' | 'penalty_mismatch' | 'jurisdiction_mismatch' | 'timeline_issue' | 'charge_not_found';
  severity: 'error' | 'warning' | 'info';
  field: string;
  message: string;
  aiValue?: string;
  expectedValue?: string;
  suggestion?: string;
}

export interface ValidationResult {
  isValid: boolean;
  confidenceScore: number;
  validationTimestamp: Date;
  checksPerformed: number;
  checksPassed: number;
  issues: ValidationIssue[];
  validatedData: {
    citationsVerified: number;
    citationsTotal: number;
    penaltiesVerified: number;
    penaltiesTotal: number;
    jurisdictionMatch: boolean;
    chargesVerified: number;
    chargesTotal: number;
  };
  summary: string;
}

interface GuidanceToValidate {
  overview?: string;
  criticalAlerts?: string[];
  immediateActions?: Array<{ action: string; urgency: string }>;
  nextSteps?: string[];
  deadlines?: Array<{ event: string; timeframe: string; description: string; priority: string; daysFromNow?: number }>;
  rights?: string[];
  warnings?: string[];
  chargeClassifications?: Array<{ code: string; title: string; classification: string; maxPenalty: string }>;
  timeline?: Array<{ stage: string; description: string; timeframe: string; completed: boolean }>;
}

interface CaseContext {
  jurisdiction: string;
  charges: string | string[];
  caseStage?: string;
}

const CITATION_PATTERNS = [
  /(?:§|section)\s*(\d+[\w.-]*)/gi,
  /(\d+)\s+(?:U\.?S\.?C\.?|USC)\s*§?\s*(\d+)/gi,
  /(?:Cal\.?\s*)?(?:Penal|Pen\.?)\s*(?:Code)?\s*§?\s*(\d+[\w.-]*)/gi,
  /(?:N\.?Y\.?\s*)?(?:Penal|Pen\.?)\s*(?:Law)?\s*§?\s*(\d+[\w.-]*)/gi,
  /(?:Tex\.?\s*)?(?:Penal|Pen\.?)\s*(?:Code)?\s*§?\s*(\d+[\w.-]*)/gi,
  /(?:Fla\.?\s*)?(?:Stat\.?|Statutes?)\s*§?\s*(\d+[\w.-]*)/gi,
];

const PENALTY_PATTERNS = [
  /(\d+)\s*(?:to\s*)?(\d+)?\s*years?(?:\s+(?:in\s+)?(?:prison|jail|incarceration))?/gi,
  /(?:up\s+to\s+)?(\d+)\s*years?\s*(?:imprisonment|prison|jail)/gi,
  /\$\s*([\d,]+)(?:\s*(?:to|-)?\s*\$?\s*([\d,]+))?\s*(?:fine)?/gi,
  /(?:life|death)\s*(?:imprisonment|sentence|penalty)/gi,
  /(\d+)\s*(?:months?|days?)\s*(?:in\s+)?(?:prison|jail)?/gi,
  /(misdemeanor|felony|infraction)/gi,
];

const JURISDICTION_DEADLINE_RULES: Record<string, { arraignment: string; speedy_trial: string; bail_hearing: string }> = {
  'CA': { arraignment: '48 hours', speedy_trial: '60 days (felony) / 30 days (misdemeanor)', bail_hearing: '48 hours' },
  'NY': { arraignment: '24 hours', speedy_trial: '6 months (felony) / 90 days (misdemeanor)', bail_hearing: '24 hours' },
  'TX': { arraignment: '48 hours', speedy_trial: 'No statutory limit', bail_hearing: '48 hours' },
  'FL': { arraignment: '24 hours', speedy_trial: '175 days (felony) / 90 days (misdemeanor)', bail_hearing: '24 hours' },
  'IL': { arraignment: '48 hours', speedy_trial: '120 days (felony) / 30 days (misdemeanor)', bail_hearing: '48 hours' },
  'PA': { arraignment: '72 hours', speedy_trial: '365 days', bail_hearing: '72 hours' },
  'OH': { arraignment: '48 hours', speedy_trial: '270 days (felony) / 90 days (misdemeanor)', bail_hearing: '48 hours' },
  'GA': { arraignment: '48 hours', speedy_trial: 'Term of court rule', bail_hearing: '48 hours' },
  'NC': { arraignment: '96 hours', speedy_trial: 'No statutory limit', bail_hearing: '48 hours' },
  'MI': { arraignment: '48 hours', speedy_trial: '180 days', bail_hearing: '48 hours' },
  'federal': { arraignment: '48 hours', speedy_trial: '70 days', bail_hearing: '48 hours' },
};

function extractCitations(text: string): string[] {
  const citations: string[] = [];
  
  for (const pattern of CITATION_PATTERNS) {
    const matches = Array.from(text.matchAll(new RegExp(pattern.source, pattern.flags)));
    for (const match of matches) {
      citations.push(match[0].trim());
    }
  }
  
  return Array.from(new Set(citations));
}

function extractPenalties(text: string): Array<{ raw: string; years?: number; fine?: number; type?: string }> {
  const penalties: Array<{ raw: string; years?: number; fine?: number; type?: string }> = [];
  
  for (const pattern of PENALTY_PATTERNS) {
    const matches = Array.from(text.matchAll(new RegExp(pattern.source, pattern.flags)));
    for (const match of matches) {
      const penalty: { raw: string; years?: number; fine?: number; type?: string } = { raw: match[0] };
      
      if (match[0].toLowerCase().includes('year')) {
        penalty.years = parseInt(match[1]) || undefined;
      }
      if (match[0].includes('$')) {
        penalty.fine = parseInt(match[1]?.replace(/,/g, '')) || undefined;
      }
      if (/felony|misdemeanor|infraction/i.test(match[0])) {
        penalty.type = match[0].toLowerCase();
      }
      
      penalties.push(penalty);
    }
  }
  
  return penalties;
}

function normalizeJurisdiction(jurisdiction: string): string {
  const normalized = jurisdiction.toUpperCase().trim();
  
  const stateMap: Record<string, string> = {
    'CALIFORNIA': 'CA', 'TEXAS': 'TX', 'FLORIDA': 'FL', 'NEW YORK': 'NY',
    'PENNSYLVANIA': 'PA', 'ILLINOIS': 'IL', 'OHIO': 'OH', 'GEORGIA': 'GA',
    'NORTH CAROLINA': 'NC', 'MICHIGAN': 'MI', 'NEW JERSEY': 'NJ',
    'VIRGINIA': 'VA', 'WASHINGTON': 'WA', 'ARIZONA': 'AZ', 'MASSACHUSETTS': 'MA',
    'TENNESSEE': 'TN', 'INDIANA': 'IN', 'MISSOURI': 'MO', 'MARYLAND': 'MD',
    'WISCONSIN': 'WI', 'COLORADO': 'CO', 'MINNESOTA': 'MN', 'SOUTH CAROLINA': 'SC',
    'ALABAMA': 'AL', 'LOUISIANA': 'LA', 'KENTUCKY': 'KY', 'OREGON': 'OR',
    'OKLAHOMA': 'OK', 'CONNECTICUT': 'CT', 'UTAH': 'UT', 'IOWA': 'IA',
    'NEVADA': 'NV', 'ARKANSAS': 'AR', 'MISSISSIPPI': 'MS', 'KANSAS': 'KS',
    'NEW MEXICO': 'NM', 'NEBRASKA': 'NE', 'WEST VIRGINIA': 'WV', 'IDAHO': 'ID',
    'HAWAII': 'HI', 'NEW HAMPSHIRE': 'NH', 'MAINE': 'ME', 'MONTANA': 'MT',
    'RHODE ISLAND': 'RI', 'DELAWARE': 'DE', 'SOUTH DAKOTA': 'SD', 'NORTH DAKOTA': 'ND',
    'ALASKA': 'AK', 'VERMONT': 'VT', 'WYOMING': 'WY', 'DISTRICT OF COLUMBIA': 'DC',
    'FEDERAL': 'federal',
  };
  
  return stateMap[normalized] || normalized;
}

async function validateCitations(
  guidance: GuidanceToValidate,
  jurisdiction: string
): Promise<{ verified: number; total: number; issues: ValidationIssue[] }> {
  const issues: ValidationIssue[] = [];
  let verified = 0;
  let total = 0;
  
  const allText = [
    guidance.overview || '',
    ...(guidance.criticalAlerts || []),
    ...(guidance.immediateActions?.map(a => a.action) || []),
    ...(guidance.nextSteps || []),
    ...(guidance.deadlines?.map(d => `${d.event} ${d.description}`) || []),
    ...(guidance.rights || []),
    ...(guidance.warnings || []),
  ].join(' ');
  
  const citations = extractCitations(allText);
  total = citations.length;
  
  if (total === 0) {
    return { verified: 0, total: 0, issues: [] };
  }
  
  const normalizedJurisdiction = normalizeJurisdiction(jurisdiction);
  const statutes = await storage.getStatutes(normalizedJurisdiction);
  const federalStatutes = normalizedJurisdiction !== 'federal' 
    ? await storage.getStatutes('federal') 
    : [];
  
  const allStatutes = [...statutes, ...federalStatutes];
  
  for (const citation of citations) {
    const found = allStatutes.some(statute => 
      statute.citation.toLowerCase().includes(citation.toLowerCase()) ||
      citation.toLowerCase().includes(statute.section?.toLowerCase() || '')
    );
    
    if (found) {
      verified++;
    } else {
      issues.push({
        type: 'citation_not_found',
        severity: 'warning',
        field: 'citations',
        message: `Citation "${citation}" could not be verified in our statute database`,
        aiValue: citation,
        suggestion: 'This citation may be valid but is not in our current database. Consider manual verification.',
      });
    }
  }
  
  return { verified, total, issues };
}

async function validatePenalties(
  guidance: GuidanceToValidate,
  context: CaseContext
): Promise<{ verified: number; total: number; issues: ValidationIssue[] }> {
  const issues: ValidationIssue[] = [];
  let verified = 0;
  let total = 0;
  
  const chargeClassifications = guidance.chargeClassifications || [];
  total = chargeClassifications.length;
  
  if (total === 0) {
    return { verified: 0, total: 0, issues: [] };
  }
  
  const normalizedJurisdiction = normalizeJurisdiction(context.jurisdiction);
  const chargeIds = Array.isArray(context.charges) ? context.charges : [context.charges];
  
  for (const classification of chargeClassifications) {
    let matchFound = false;
    
    for (const chargeId of chargeIds) {
      const charge = getChargeById(chargeId);
      
      if (charge) {
        if (charge.category.toLowerCase() === classification.classification.toLowerCase()) {
          matchFound = true;
        } else if (
          charge.maxPenalty.toLowerCase().includes(classification.maxPenalty.toLowerCase()) ||
          classification.maxPenalty.toLowerCase().includes(charge.maxPenalty.toLowerCase())
        ) {
          matchFound = true;
        }
      }
    }
    
    const jurisdictionCharges = getChargesByJurisdiction(normalizedJurisdiction);
    if (!matchFound && jurisdictionCharges.length > 0) {
      const similarCharge = jurisdictionCharges.find(c => 
        c.name.toLowerCase().includes(classification.title.toLowerCase()) ||
        classification.title.toLowerCase().includes(c.name.toLowerCase())
      );
      
      if (similarCharge) {
        if (similarCharge.category.toLowerCase() !== classification.classification.toLowerCase()) {
          issues.push({
            type: 'penalty_mismatch',
            severity: 'warning',
            field: 'chargeClassifications',
            message: `Classification mismatch for "${classification.title}"`,
            aiValue: classification.classification,
            expectedValue: similarCharge.category,
            suggestion: `Our records show this is typically a ${similarCharge.category}, not ${classification.classification}`,
          });
        } else {
          matchFound = true;
        }
      }
    }
    
    if (matchFound) {
      verified++;
    }
  }
  
  return { verified, total, issues };
}

async function validateCharges(
  context: CaseContext
): Promise<{ verified: number; total: number; issues: ValidationIssue[] }> {
  const issues: ValidationIssue[] = [];
  const chargeIds = Array.isArray(context.charges) ? context.charges : [context.charges];
  let verified = 0;
  const total = chargeIds.length;
  
  const normalizedJurisdiction = normalizeJurisdiction(context.jurisdiction);
  
  for (const chargeId of chargeIds) {
    const charge = getChargeById(chargeId);
    
    if (charge) {
      if (charge.jurisdiction.toUpperCase() === normalizedJurisdiction.toUpperCase() ||
          charge.jurisdiction.toLowerCase() === 'federal') {
        verified++;
      } else {
        issues.push({
          type: 'jurisdiction_mismatch',
          severity: 'warning',
          field: 'charges',
          message: `Charge "${charge.name}" is from ${charge.jurisdiction}, but case jurisdiction is ${normalizedJurisdiction}`,
          aiValue: charge.jurisdiction,
          expectedValue: normalizedJurisdiction,
          suggestion: 'Verify that the correct jurisdiction-specific charge was selected',
        });
        verified++;
      }
    } else {
      const possibleMatch = criminalCharges.find(c => 
        c.id.toLowerCase().includes(chargeId.toLowerCase()) ||
        c.name.toLowerCase().includes(chargeId.toLowerCase())
      );
      
      if (possibleMatch) {
        verified++;
        issues.push({
          type: 'charge_not_found',
          severity: 'info',
          field: 'charges',
          message: `Charge ID "${chargeId}" matched to "${possibleMatch.name}" by partial match`,
          suggestion: 'Consider using the exact charge ID for better accuracy',
        });
      } else {
        issues.push({
          type: 'charge_not_found',
          severity: 'warning',
          field: 'charges',
          message: `Charge "${chargeId}" not found in our database`,
          suggestion: 'This may be a valid charge not yet in our database, or a typo',
        });
      }
    }
  }
  
  return { verified, total, issues };
}

function validateTimelines(
  guidance: GuidanceToValidate,
  jurisdiction: string
): { issues: ValidationIssue[] } {
  const issues: ValidationIssue[] = [];
  const normalizedJurisdiction = normalizeJurisdiction(jurisdiction);
  const rules = JURISDICTION_DEADLINE_RULES[normalizedJurisdiction] || JURISDICTION_DEADLINE_RULES['federal'];
  
  const deadlines = guidance.deadlines || [];
  
  for (const deadline of deadlines) {
    const eventLower = deadline.event.toLowerCase();
    const timeframeLower = deadline.timeframe.toLowerCase();
    
    if (eventLower.includes('arraignment')) {
      const expectedHours = parseInt(rules.arraignment);
      const mentionedHours = extractHoursFromTimeframe(timeframeLower);
      
      if (mentionedHours && Math.abs(mentionedHours - expectedHours) > 24) {
        issues.push({
          type: 'timeline_issue',
          severity: 'warning',
          field: 'deadlines',
          message: `Arraignment deadline may not match ${normalizedJurisdiction} rules`,
          aiValue: deadline.timeframe,
          expectedValue: rules.arraignment,
          suggestion: `In ${normalizedJurisdiction}, arraignment typically occurs within ${rules.arraignment}`,
        });
      }
    }
    
    if (eventLower.includes('speedy trial') || eventLower.includes('trial deadline')) {
      issues.push({
        type: 'timeline_issue',
        severity: 'info',
        field: 'deadlines',
        message: `Speedy trial reference detected - ${normalizedJurisdiction} rule: ${rules.speedy_trial}`,
        aiValue: deadline.timeframe,
        expectedValue: rules.speedy_trial,
      });
    }
  }
  
  return { issues };
}

function extractHoursFromTimeframe(timeframe: string): number | null {
  const hoursMatch = timeframe.match(/(\d+)\s*hours?/i);
  if (hoursMatch) return parseInt(hoursMatch[1]);
  
  const daysMatch = timeframe.match(/(\d+)\s*days?/i);
  if (daysMatch) return parseInt(daysMatch[1]) * 24;
  
  return null;
}

function calculateConfidenceScore(result: Omit<ValidationResult, 'confidenceScore' | 'summary'>): number {
  const { validatedData, issues, checksPerformed, checksPassed } = result;
  
  if (checksPerformed === 0) return 0.5;
  
  let score = checksPassed / checksPerformed;
  
  const errorCount = issues.filter(i => i.severity === 'error').length;
  const warningCount = issues.filter(i => i.severity === 'warning').length;
  
  score -= errorCount * 0.15;
  score -= warningCount * 0.05;
  
  if (validatedData.citationsTotal > 0) {
    score += (validatedData.citationsVerified / validatedData.citationsTotal) * 0.1;
  }
  
  if (validatedData.jurisdictionMatch) {
    score += 0.1;
  }
  
  return Math.max(0, Math.min(1, score));
}

function generateSummary(result: Omit<ValidationResult, 'summary'>): string {
  const { confidenceScore, validatedData, issues } = result;
  
  const errorCount = issues.filter(i => i.severity === 'error').length;
  const warningCount = issues.filter(i => i.severity === 'warning').length;
  
  let summary = '';
  
  if (confidenceScore >= 0.9) {
    summary = 'High confidence: Guidance aligns well with our legal databases. ';
  } else if (confidenceScore >= 0.7) {
    summary = 'Good confidence: Guidance is mostly accurate with minor notes. ';
  } else if (confidenceScore >= 0.5) {
    summary = 'Moderate confidence: Some information could not be verified. ';
  } else {
    summary = 'Low confidence: Several items require verification. ';
  }
  
  if (validatedData.citationsTotal > 0) {
    summary += `Verified ${validatedData.citationsVerified}/${validatedData.citationsTotal} citations. `;
  }
  
  if (validatedData.chargesTotal > 0) {
    summary += `Matched ${validatedData.chargesVerified}/${validatedData.chargesTotal} charges. `;
  }
  
  if (errorCount > 0) {
    summary += `${errorCount} error(s) found. `;
  }
  if (warningCount > 0) {
    summary += `${warningCount} warning(s) noted. `;
  }
  
  return summary.trim();
}

export async function validateLegalGuidance(
  guidance: GuidanceToValidate,
  context: CaseContext
): Promise<ValidationResult> {
  console.log('[Validator] Starting legal accuracy validation...');
  const startTime = Date.now();
  
  const allIssues: ValidationIssue[] = [];
  let checksPerformed = 0;
  let checksPassed = 0;
  
  const citationResult = await validateCitations(guidance, context.jurisdiction);
  allIssues.push(...citationResult.issues);
  if (citationResult.total > 0) {
    checksPerformed++;
    if (citationResult.verified >= citationResult.total * 0.5) checksPassed++;
  }
  
  const penaltyResult = await validatePenalties(guidance, context);
  allIssues.push(...penaltyResult.issues);
  if (penaltyResult.total > 0) {
    checksPerformed++;
    if (penaltyResult.verified >= penaltyResult.total * 0.5) checksPassed++;
  }
  
  const chargeResult = await validateCharges(context);
  allIssues.push(...chargeResult.issues);
  checksPerformed++;
  if (chargeResult.verified >= chargeResult.total * 0.5) checksPassed++;
  
  const timelineResult = validateTimelines(guidance, context.jurisdiction);
  allIssues.push(...timelineResult.issues);
  
  const jurisdictionMatch = chargeResult.issues.filter(i => i.type === 'jurisdiction_mismatch').length === 0;
  
  const partialResult = {
    isValid: allIssues.filter(i => i.severity === 'error').length === 0,
    validationTimestamp: new Date(),
    checksPerformed,
    checksPassed,
    issues: allIssues,
    validatedData: {
      citationsVerified: citationResult.verified,
      citationsTotal: citationResult.total,
      penaltiesVerified: penaltyResult.verified,
      penaltiesTotal: penaltyResult.total,
      jurisdictionMatch,
      chargesVerified: chargeResult.verified,
      chargesTotal: chargeResult.total,
    },
  };
  
  const confidenceScore = calculateConfidenceScore(partialResult);
  const summary = generateSummary({ ...partialResult, confidenceScore });
  
  const result: ValidationResult = {
    ...partialResult,
    confidenceScore,
    summary,
  };
  
  const duration = Date.now() - startTime;
  console.log(`[Validator] Validation completed in ${duration}ms - Confidence: ${(confidenceScore * 100).toFixed(1)}%`);
  
  return result;
}

export function isGuidanceReliable(result: ValidationResult, threshold: number = 0.6): boolean {
  return result.confidenceScore >= threshold && result.isValid;
}
