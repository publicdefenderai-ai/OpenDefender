/**
 * Diversion Program Availability Checker
 * 
 * Cross-references diversion program recommendations against geographic availability
 * to ensure AI guidance only mentions programs actually available in the user's jurisdiction.
 */

export interface DiversionAvailability {
  programType: string;
  isAvailable: boolean;
  availableIn?: string[];
  nearestProgram?: {
    name: string;
    county: string;
    distance?: string;
  };
}

export interface DiversionValidationResult {
  jurisdiction: string;
  availablePrograms: string[];
  unavailableMentioned: string[];
  warnings: string[];
  programDetails: DiversionAvailability[];
}

const DIVERSION_PROGRAM_TYPES = [
  'Drug Court',
  'Mental Health Court',
  'Veterans Court',
  'DUI Court',
  'DWI Court',
  'Pretrial Diversion',
  'Pre-Booking Diversion',
  'Community Service',
  'Restorative Justice',
  'Youth Diversion',
  'Young Adult Diversion',
  'Homeless Court',
  'Crisis Intervention',
  'Deferred Prosecution',
  'Treatment Court',
  'Substance Abuse Treatment',
];

const STATE_DIVERSION_COVERAGE: Record<string, string[]> = {
  'CA': ['Drug Court', 'Mental Health Court', 'Veterans Court', 'Community Service', 'Homeless Court', 'Crisis Intervention', 'Pretrial Diversion', 'Substance Abuse Treatment'],
  'TX': ['Drug Court', 'DWI Court', 'Veterans Court', 'Mental Health Court', 'Pretrial Diversion'],
  'NY': ['Drug Court', 'Mental Health Court', 'Veterans Court', 'Community Service', 'Youth Diversion', 'Pretrial Diversion'],
  'FL': ['Drug Court', 'Mental Health Court', 'Veterans Court', 'DUI Court', 'Pretrial Diversion'],
  'IL': ['Drug Court', 'Mental Health Court', 'Veterans Court', 'Deferred Prosecution', 'Pretrial Diversion'],
  'PA': ['Drug Court', 'Mental Health Court', 'Veterans Court', 'Treatment Court', 'Pretrial Diversion'],
  'OH': ['Drug Court', 'Mental Health Court', 'Veterans Court', 'Community Service'],
  'GA': ['Drug Court', 'Mental Health Court', 'Veterans Court', 'DUI Court', 'Accountability Courts', 'Youth Diversion', 'Pretrial Diversion'],
  'NC': ['Drug Court', 'Mental Health Court', 'Veterans Court', 'Pretrial Diversion'],
  'MI': ['Drug Court', 'Mental Health Court', 'Veterans Court', 'Sobriety Court'],
  'NJ': ['Drug Court', 'Mental Health Court', 'Veterans Court', 'Pretrial Intervention'],
  'VA': ['Drug Court', 'Mental Health Court', 'Veterans Court', 'Pretrial Diversion'],
  'WA': ['Drug Court', 'Mental Health Court', 'Veterans Court', 'LEAD Program', 'Pretrial Diversion'],
  'AZ': ['Drug Court', 'Mental Health Court', 'Veterans Court', 'DUI Court'],
  'MA': ['Drug Court', 'Mental Health Court', 'Veterans Court', 'Pretrial Diversion'],
  'TN': ['Drug Court', 'Mental Health Court', 'Veterans Court', 'DUI Court'],
  'IN': ['Drug Court', 'Mental Health Court', 'Veterans Court', 'Problem-Solving Courts'],
  'MO': ['Drug Court', 'Mental Health Court', 'Veterans Court', 'DWI Court'],
  'MD': ['Drug Court', 'Mental Health Court', 'Veterans Court', 'Pretrial Diversion'],
  'WI': ['Drug Court', 'Mental Health Court', 'Veterans Court', 'Treatment Courts'],
  'CO': ['Drug Court', 'Mental Health Court', 'Veterans Court', 'Pretrial Diversion'],
  'MN': ['Drug Court', 'Mental Health Court', 'Veterans Court', 'DWI Court'],
  'SC': ['Drug Court', 'Mental Health Court', 'Veterans Court'],
  'AL': ['Drug Court', 'Mental Health Court', 'Veterans Court'],
  'LA': ['Drug Court', 'Mental Health Court', 'Veterans Court', 'DWI Court'],
  'KY': ['Drug Court', 'Mental Health Court', 'Veterans Court'],
  'OR': ['Drug Court', 'Mental Health Court', 'Veterans Court', 'LEAD Program', 'Pretrial Diversion'],
  'OK': ['Drug Court', 'Mental Health Court', 'Veterans Court'],
  'CT': ['Drug Court', 'Mental Health Court', 'Veterans Court', 'Accelerated Rehabilitation'],
  'UT': ['Drug Court', 'Mental Health Court', 'Veterans Court'],
  'IA': ['Drug Court', 'Mental Health Court', 'Veterans Court'],
  'NV': ['Drug Court', 'Mental Health Court', 'Veterans Court', 'DUI Court'],
  'AR': ['Drug Court', 'Mental Health Court', 'Veterans Court'],
  'MS': ['Drug Court', 'Mental Health Court', 'Veterans Court'],
  'KS': ['Drug Court', 'Mental Health Court', 'Veterans Court'],
  'NM': ['Drug Court', 'Mental Health Court', 'Veterans Court'],
  'NE': ['Drug Court', 'Mental Health Court', 'Veterans Court', 'Problem-Solving Courts'],
  'WV': ['Drug Court', 'Mental Health Court', 'Veterans Court'],
  'ID': ['Drug Court', 'Mental Health Court', 'Veterans Court'],
  'HI': ['Drug Court', 'Mental Health Court', 'Veterans Court'],
  'NH': ['Drug Court', 'Mental Health Court', 'Veterans Court'],
  'ME': ['Drug Court', 'Mental Health Court', 'Veterans Court'],
  'RI': ['Drug Court', 'Mental Health Court', 'Veterans Court'],
  'MT': ['Drug Court', 'Mental Health Court', 'Veterans Court'],
  'DE': ['Drug Court', 'Mental Health Court', 'Veterans Court', 'Pretrial Diversion'],
  'SD': ['Drug Court', 'Mental Health Court'],
  'ND': ['Drug Court', 'Mental Health Court'],
  'AK': ['Drug Court', 'Mental Health Court', 'Therapeutic Courts'],
  'DC': ['Drug Court', 'Mental Health Court', 'Veterans Court', 'Pretrial Diversion'],
  'VT': ['Drug Court', 'Mental Health Court'],
  'WY': ['Drug Court', 'Mental Health Court'],
  'FED': ['Pretrial Diversion', 'Deferred Prosecution'],
};

const LIMITED_COVERAGE_STATES = ['SD', 'ND', 'VT', 'WY', 'AK'];

export function checkDiversionAvailability(
  jurisdiction: string,
  mentionedPrograms: string[]
): DiversionValidationResult {
  const stateCode = jurisdiction.toUpperCase();
  const availableInState = STATE_DIVERSION_COVERAGE[stateCode] || [];
  
  const programDetails: DiversionAvailability[] = [];
  const unavailableMentioned: string[] = [];
  const warnings: string[] = [];
  
  for (const program of mentionedPrograms) {
    const normalizedProgram = normalizeProgamType(program);
    const isAvailable = availableInState.some(
      p => normalizeProgamType(p) === normalizedProgram
    );
    
    programDetails.push({
      programType: program,
      isAvailable,
      availableIn: isAvailable ? [stateCode] : findStatesWithProgram(normalizedProgram),
    });
    
    if (!isAvailable) {
      unavailableMentioned.push(program);
    }
  }
  
  if (LIMITED_COVERAGE_STATES.includes(stateCode)) {
    warnings.push(
      `${stateCode} has limited diversion program coverage. Contact your local court or public defender for current options.`
    );
  }
  
  if (unavailableMentioned.length > 0) {
    warnings.push(
      `The following programs may not be available in ${stateCode}: ${unavailableMentioned.join(', ')}. Check with your local court for alternatives.`
    );
  }
  
  return {
    jurisdiction: stateCode,
    availablePrograms: availableInState,
    unavailableMentioned,
    warnings,
    programDetails,
  };
}

export function getAvailableDiversionPrograms(jurisdiction: string): string[] {
  return STATE_DIVERSION_COVERAGE[jurisdiction.toUpperCase()] || [];
}

export function isDiversionProgramAvailable(
  jurisdiction: string,
  programType: string
): boolean {
  const available = getAvailableDiversionPrograms(jurisdiction);
  const normalizedType = normalizeProgamType(programType);
  return available.some(p => normalizeProgamType(p) === normalizedType);
}

function normalizeProgamType(programType: string): string {
  return programType
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/court$/, '')
    .replace(/program$/, '')
    .replace(/treatment$/, '')
    .trim();
}

function findStatesWithProgram(normalizedProgram: string): string[] {
  const states: string[] = [];
  for (const [state, programs] of Object.entries(STATE_DIVERSION_COVERAGE)) {
    if (programs.some(p => normalizeProgamType(p) === normalizedProgram)) {
      states.push(state);
    }
  }
  return states.slice(0, 5);
}

export function extractDiversionMentions(text: string): string[] {
  const mentions: string[] = [];
  const lowerText = text.toLowerCase();
  
  for (const programType of DIVERSION_PROGRAM_TYPES) {
    if (lowerText.includes(programType.toLowerCase())) {
      mentions.push(programType);
    }
  }
  
  return Array.from(new Set(mentions));
}

export function addDiversionAvailabilityWarning(
  jurisdiction: string,
  guidanceText: string
): { text: string; warnings: string[] } {
  const mentions = extractDiversionMentions(guidanceText);
  
  if (mentions.length === 0) {
    return { text: guidanceText, warnings: [] };
  }
  
  const validation = checkDiversionAvailability(jurisdiction, mentions);
  
  return {
    text: guidanceText,
    warnings: validation.warnings,
  };
}
