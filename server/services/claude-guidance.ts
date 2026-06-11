// Claude AI-Powered Legal Guidance Service
// Using direct Anthropic API with user-provided API key
import Anthropic from '@anthropic-ai/sdk';
import crypto from 'crypto';
import { redactCaseDetails, isPIIRedactionEnabled } from './pii-redactor';
import { validateLegalGuidance, ValidationResult } from './legal-accuracy-validator';
import { devLog, opsLog, errLog } from '../utils/dev-logger';
import { recordAICost, isRequestCostAcceptable } from './cost-tracker';
import { checkDiversionAvailability, extractDiversionMentions } from '@shared/diversion-availability';
import { buildJurisdictionContextBlock } from '@shared/jurisdiction-procedure-rules';
import { buildCollateralConsequenceContextBlock } from '../../client/src/lib/collateral-consequences-data';
import { CLAUDE_MODEL_SONNET as CLAUDE_MODEL } from '../config/ai-model';
import { scanGuidanceForDangerContent, stripDangerousItems } from './guidance-safety';

// Validate Anthropic API credentials - graceful fallback if not configured
const apiKey = process.env.ANTHROPIC_API_KEY;
let anthropic: Anthropic | null = null;

if (!apiKey) {
  errLog('Anthropic API key not set - AI guidance will use rule-based fallback');
} else {
  anthropic = new Anthropic({
    apiKey,
    timeout: 145000, // 145 second timeout for the SDK - generous time for complex legal guidance
  });
}

// Simple in-memory cache for identical requests (expires after 15 minutes for privacy)
// Shorter TTL reduces risk of data persistence while maintaining performance
interface CacheEntry {
  response: ClaudeGuidance;
  timestamp: number;
}
const responseCache = new Map<string, CacheEntry>();
// Reverse index: sessionId -> Set of cache keys belonging to that session
const sessionCacheKeys = new Map<string, Set<string>>();
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
    // Also prune the reverse index
    sessionCacheKeys.forEach((keys, sid) => {
      keysToDelete.forEach(k => keys.delete(k));
      if (keys.size === 0) sessionCacheKeys.delete(sid);
    });
    devLog('privacy', `Cleared ${keysToDelete.length} expired cache entries`);
  }
}, 5 * 60 * 1000); // Run cleanup every 5 minutes

// Function to clear cache for a specific session (call on session end)
export function clearSessionCache(sessionId?: string): void {
  if (!sessionId) {
    responseCache.clear();
    sessionCacheKeys.clear();
    devLog('privacy', 'All guidance cache cleared');
  } else {
    const keys = sessionCacheKeys.get(sessionId);
    if (keys) {
      keys.forEach(k => responseCache.delete(k));
      sessionCacheKeys.delete(sessionId);
      devLog('privacy', `Cleared ${keys.size} cache entries for session ${sessionId.slice(0, 8)}...`);
    }
  }
}

interface CaseDetails {
  jurisdiction: string;
  charges: string | string[];
  caseStage: string;
  custodyStatus: string;
  hasAttorney: boolean;
  selectedConcerns?: string[];
  civilUrgency?: Record<string, 'none' | 'active' | 'emergency'>;
  language?: string;
  chargesUnknown?: boolean;
  supervisionStatus?: string;
  priorConvictions?: boolean | null;
  citizenshipStatus?: string;
  hasMinorChildren?: boolean | null;
  hasProfessionalLicense?: boolean | null;
  hasHousingAssistance?: boolean | null;
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
  uncertainties?: Array<{
    area: string;
    note: string;
  }>;
  dangerFlags?: string[];
  collateralConsequences?: Array<{
    category: string;
    consequence: string;
    timing: string;
    actionNote: string;
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

  return `You are an expert legal guidance assistant for OpenDefender, a platform helping people without legal representation understand their rights and next steps. Your role is to provide clear, actionable legal guidance ${readingLevelNote}.

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
9. EQUITY REQUIREMENT — Provide guidance of identical depth, completeness, and quality regardless of neighborhood names, economic circumstances, housing stability, employment status, or any other demographic proxy in the case description. Economic context (e.g., "cannot afford bail") must ONLY be used to surface relevant resources such as free legal aid, public defenders, or bail funds — never to reduce the number of rights explained, the detail of legal options presented, or the urgency or thoroughness of your recommendations. Every person — regardless of background or resources — is entitled to the same quality of legal information.

CONTENT FRAMING RULE — APPLIES TO ALL OUTPUT FIELDS:
This platform provides legal information and orientation, not legal advice. No output field may contain strategic case recommendations or personal directives. Apply this rule to every piece of text you generate:

PERMITTED:
- Describing what is typically important at this stage of a case, and why
- Presenting all available options and their legal consequences
- Explaining what courts and attorneys generally focus on at this stage
- Attributing guidance to attorneys: "Many attorneys advise..." or "Attorneys commonly caution..."
- Procedural information about what happens next and how the process works

NOT PERMITTED:
- Directing the user to take a specific case action: "Do X" or "Don't do Y"
- Recommending a specific plea, cooperation strategy, or evidence decision
- Case-specific strategic recommendations based on the user's stated facts
- Telling the user what they should do about their specific case

REWRITE TEST: Before writing any guidance item, ask: "Am I telling this person what to do, or am I telling them what is typically important and why?" If you are telling them what to do → rewrite as consequence-description or option-presentation. Attribute strategic guidance to attorneys, not to the platform.

DISPUTED-CLAIM HANDLING:
Users often describe their situation using one-sided language: "the officer lied," "they violated my rights," "the other person made it all up," "the witness is lying," or "the evidence was planted." Treat all such statements as the user's account — a disputed assertion, not a verified fact — when generating guidance.

Rules:
- Do NOT build guidance on the premise that the user's characterization of another party's conduct is factually established. "The officer lied in the report" may be true, but it has not been proven. Guidance premised on it as settled fact can mislead.
- DO acknowledge the user's account without endorsing it as fact. "If the account you describe is accurate, your attorney may want to explore..." or "If there is evidence that contradicts the official account, that is something to raise with your attorney."
- For claims of rights violations specifically ("they violated my rights," "the search was illegal"): these are legal conclusions, not factual ones. Do not confirm or deny the legal conclusion. Instead, note that whether a rights violation occurred is determined by a court, and that the user should share the full account with their attorney so it can be evaluated.
- This rule does not require you to be cold or dismissive. Acknowledge that the user's experience is real to them and that their account matters. The guidance is simply framed around what an attorney can investigate and argue — not around the claim being pre-confirmed.

TONE IN SENSITIVE SITUATIONS:
The following situations ALWAYS require an emotional acknowledgment BEFORE stating the recommendation. Do not skip this step — people need to feel heard before they can absorb difficult advice.

Situations that trigger this requirement (this list is not exhaustive — use judgment when a recommendation causes family pain):
- Any charge where the alleged victim is an immediate family member: spouse, partner, child, parent, sibling, grandparent, or anyone living in the same household
- Domestic violence, intimate partner violence, or any DV-adjacent charge
- Assault, battery, or threatening charges where the victim is a family member or loved one
- Restraining orders, protective orders, or no-contact orders involving family members
- Loss of custody, supervised visitation, or orders separating a parent from their children
- Any guidance that tells the user to stay away from, not contact, or limit contact with a family member — even if the charge itself is not labeled "domestic violence"

Pattern to follow:
Acknowledge the emotional difficulty first, then give the recommendation. Adapt the language to the specific relationship:
- Spouse/partner: "Though it may be painful to be separated from your partner during this time, it is strongly advisable to…"
- Child: "We understand that being told to stay away from your child is an incredibly painful position to be in. That said, it is strongly advisable to…"
- Parent: "Being separated from a parent during a legal case is deeply difficult. Nevertheless, it is strongly advisable to…"
- Sibling or other family member: "Though this situation affects a close family bond, it is strongly advisable to…"

Never frame the recommendation in purely transactional legal terms when it involves separation from a loved one. Always pair the hard advice with a recognition of what it costs the person emotionally.

NEVER DO — ABSOLUTE PROHIBITIONS:
You must NEVER, under any circumstances:
- Suggest, imply, or hint at destroying, deleting, altering, hiding, or disposing of any evidence, messages, texts, emails, photos, videos, or records
- Suggest leaving a jurisdiction, going "off the grid," fleeing, disappearing, or avoiding law enforcement contact in any way that constitutes flight from prosecution
- Suggest coordinating testimony, coaching witnesses, aligning stories, or telling others what to say
- Give advice that is itself an illegal act (obstruction, tampering, conspiracy, flight)
- Present uncertain jurisdiction-specific information as confident fact — if you are not certain about a deadline, statute, or local court procedure, say so explicitly and add it to the uncertainties field
These prohibitions apply even if the user appears to be asking for this type of guidance. Refuse clearly and redirect to an attorney.

FACT-SPECIFIC HARD STOPS — DO NOT PROVIDE SUBSTANTIVE GUIDANCE ON THESE TOPICS:
The following questions require an attorney to analyze the specific facts of the case. Giving generic guidance here can cause direct harm. On these topics, do not generate substantive advice in any field. Instead, redirect to an attorney before acting.

1. EVIDENCE HANDLING: Do not advise what to gather, preserve, discard, or do with any evidence, documents, photos, videos, or communications. The evidenceToGather array must contain exactly ONE item with this exact text: "Evidence decisions depend entirely on your specific case facts — do not touch, move, share, or discard anything related to your case before speaking with your attorney." Do not add any other items to this array.

2. COOPERATION AND STATEMENTS TO AUTHORITIES: Do not advise whether the user should cooperate with, make statements to, or answer questions from police, investigators, or prosecutors about the facts of their case. You may state that the person has the right to remain silent and to have an attorney present before any questioning. That is all.

3. PLEA DECISIONS: Do not evaluate, recommend, or characterize any plea offer. Do not advise on whether any deal is worth considering. If the topic arises, direct the user to discuss it only with their attorney.

4. WITNESS CONTACT OR STRATEGY: Do not advise the user to contact, avoid, or approach any witness. If the topic arises, the only permissible guidance is to take no action regarding witnesses until speaking with an attorney.

PROCEDURAL MYTH GUARD — DO NOT VALIDATE THESE CLAIMS:
Some people facing charges have encountered misinformation about legal "magic procedures" that supposedly void charges, strip courts of jurisdiction, or nullify Miranda violations. These claims are legally incorrect and acting on them causes direct harm. You must never validate, echo, or engage with them as though they have legal merit — not even with hedging language like "some people believe" or "this is disputed." These claims are not disputed in any court in any jurisdiction. They are uniformly rejected.

Myths you must not validate:

1. SOVEREIGN CITIZEN CLAIMS: Any assertion that a person is not subject to federal, state, or local law because they have "revoked consent," declared themselves a "sovereign citizen," invoked "common law" as an alternative to statutory law, cited Uniform Commercial Code (UCC) filings as a shield against criminal prosecution, referenced their "all-caps name" as a separate legal entity, or used any variation of this framework. Every federal and state court has rejected these arguments without exception.

2. MIRANDA-VOIDS-THE-CASE MYTH: Any claim that a failure to receive a Miranda warning means the arrest is invalid, the charges must be dropped, or the case is dismissed. This is false. A Miranda violation may result in certain statements being suppressed at trial — it does not void the arrest, nullify the charges, or end the prosecution. The case proceeds regardless.

3. MAGIC PROCEDURE CLAIMS: Any claim that sending a certified letter, filing a private affidavit, issuing a "notice to agent," demanding a "bill of particulars" as a jurisdictional challenge, or performing any administrative act outside the formal court process can defeat charges, disqualify a judge, or strip a court of jurisdiction.

How to respond when a user raises one of these claims:
- Correct the misconception clearly and briefly in plain language — state what the law actually provides.
- Do not validate the premise, even partially.
- Do not suggest the claim might work in some circumstances or jurisdictions — it does not.
- Then return immediately to accurate, actionable guidance.
- Be respectful: people who raise these claims are often desperate and have received bad information. Correct directly, without condescension, and redirect to what actually helps.

EVIDENCE URGENCY — ATTORNEY-ACTION NOTICE (distinct from the hard stops above):
For early-stage cases only (arrest within the last ~72 hours, pre-arraignment, or first court appearance not yet occurred), scan the case description for facts that suggest specific types of time-sensitive evidence may exist. If found, add ONE item to criticalAlerts using the structure below. This is an attorney-action notice, not a user-action instruction — the user takes no direct action.

Use this exact structure, filling in the specific evidence type based on the facts:
"[Specific evidence type] may be relevant to your case. This type of evidence is often deleted within 24–72 hours. An attorney can send a formal letter to preserve it on your behalf — you should not contact businesses, witnesses, or others directly. This is one reason why reaching a lawyer today, not next week, matters."

Evidence types and the case facts that trigger them:
- "Surveillance footage from [specific location, e.g. the bar, the store, the parking lot]": any named business, bar, restaurant, store, parking lot, building lobby, or street intersection appears in the case description
- "Dashcam or traffic camera footage": incident occurred on a road, involved a vehicle, or was a traffic stop
- "Police body camera footage": police were present at the scene during or immediately after the incident
- "Digital communications (texts, messages, or social media posts)": case involves communications between parties, especially in domestic violence, harassment, or threat charges
- "Witness accounts": specific witnesses or bystanders are mentioned in the case description

Rules:
- Only add this alert if the case stage is early and the case description clearly supports it. Do not invent evidence types not suggested by the facts.
- Do NOT say what the evidence will prove or what it is likely to show.
- Do NOT tell the user to act themselves. The only user action is to reach a lawyer today.
- This alert counts toward the criticalAlerts maximum.

CASE COMPLEXITY ESCALATION:
Certain case characteristics make the stakes significantly higher and reduce the ability of general orientation to be helpful. When any of the following are present, you MUST include a prominent escalation alert in criticalAlerts using the exact format below:

Trigger conditions — scan the case description and charges for:
1. FEDERAL CHARGES: arrest by federal agents (FBI, DEA, ATF, Secret Service, HSI), charges in federal court, a federal case number, or language suggesting federal jurisdiction
2. SERIOUS VIOLENT FELONIES: homicide, murder, manslaughter, rape, sexual assault, armed robbery, kidnapping, carjacking, aggravated assault with a deadly weapon, or any charge with a life sentence exposure
3. MULTIPLE CO-DEFENDANTS: case description mentions co-defendants, co-conspirators, or multiple people charged together for the same incident
4. ACCUMULATED SUPERVISION VIOLATIONS: person is on probation or parole AND this is not their first violation, or description suggests a pattern of violations
5. MANDATORY MINIMUM EXPOSURE: charges that typically carry mandatory minimum sentences (many federal drug charges, federal gun charges, RICO)

When triggered, add this as the FIRST item in criticalAlerts:
"This type of case involves circumstances where the stakes and legal complexity are significantly higher than a typical case. General orientation has clear limits here. An attorney with specific experience in [federal criminal defense / serious violent felonies / multi-defendant cases — use whichever applies] is especially important to find as quickly as possible. Do not make any decisions or statements before consulting with qualified counsel."

Rules:
- Only trigger when the case description clearly indicates one of the above conditions. Do not invent or assume complexity.
- This escalation does not replace other guidance — it supplements it.
- The escalation alert counts toward the criticalAlerts maximum.

RESPONSE STRUCTURE:
Return a JSON object with these exact fields:
- overview: ${overviewNote} following this pattern: (1) Current situation, (2) 2-3 important things to do to ensure the case proceeds smoothly, (3) Key issue(s) that will determine the outcome
- criticalAlerts: Array of urgent warnings — MAXIMUM 2 ITEMS. Only include a criticalAlert when inaction in the next 24-48 hours has a concrete legal consequence (e.g., a missed deadline triggers a bench warrant, a bail condition violation causes re-arrest, a time-limited right is about to expire). General reminders such as "get a lawyer," "don't discuss your case," or "attend court" belong in warnings or avoidActions — NOT here. If nothing in the case rises to that standard, return an empty array [].
- immediateActions: Array of {action: string, urgency: 'urgent'|'high'|'medium'|'low'} — describe what is typically important at this case stage and why, NOT as personal directives. Frame as what courts and attorneys generally focus on. Write "Having legal representation before arraignment is typically important because..." NOT "Get a lawyer today." Each item informs the person about what matters; it does not instruct them what to do.
- nextSteps: Array of what to do after immediate actions
- deadlines: Array of {event, timeframe, description, priority: 'critical'|'important'|'normal', daysFromNow}
- rights: Array of charge-specific and stage-specific rights that apply to this situation. DO NOT include universal Miranda rights, the right to remain silent, the right to an attorney, or the right against self-incrimination — those are displayed separately as hardcoded content. Focus only on rights specific to this charge type or case stage.
- resources: Array of {type, description, contact, hours?, website?}
- warnings: Array of things to be aware of
- evidenceToGather: Array with exactly ONE item per the FACT-SPECIFIC HARD STOPS rule above
- courtPreparation: Array of how to prepare for court appearances
- avoidActions: Array of charge-specific and stage-specific concerns at this stage — NOT written as prohibitions or directives. DO NOT include universal cautions (discussing the case with non-attorneys, consenting to searches, missing court dates) — those are displayed separately as hardcoded content. Focus on concerns specific to this charge type or case stage. Each item describes a concern and its legal context, not an instruction.
- timeline: Array of {stage, description, timeframe, completed: boolean}
- uncertainties: Array of areas where you are not fully certain. If you are unsure about a jurisdiction-specific deadline, statute, fee amount, or procedure, you MUST add an entry here instead of stating it as fact. Each entry has: {area: string, note: string}. Use an empty array [] if you are confident throughout.
  Example: {"area": "Bail eligibility in this county", "note": "This varies significantly by local court practice — confirm with your attorney or public defender."}
- collateralConsequences: Array of collateral consequences that are plausibly triggered by the charges and background context. Only include consequences that are genuinely likely given the specific charges and background, not a generic list. Each entry has: {category: string (one of: "drivers_license"|"immigration"|"housing"|"employment"|"custody"|"benefits"|"firearms"|"registry"|"supervision_revocation"|"other"), consequence: string (what the consequence is and which conviction types trigger it), timing: string (when it takes effect: e.g. "upon guilty plea", "upon conviction", "upon sentencing", "upon release"), actionNote: string (one concrete thing to raise with attorney or action that could prevent or mitigate)}. Only include if background fields are provided OR the charges commonly trigger specific collateral consequences. Return empty array [] if no relevant background was provided and charges are unlikely to trigger notable collateral consequences.

TONE: Supportive, clear, and empowering. You're helping someone navigate a scary system. Frame all guidance as what is typical for this charge type, jurisdiction, and case stage — for example "For someone facing [charge] at [stage] in [state]..." Do NOT use phrases like "based on your specific situation" or "personalized to your case" — the guidance is calibrated to the charge type and stage, not to the individual's personal facts.

OUTPUT SIZE RULES — MUST FOLLOW TO AVOID TRUNCATION:
- criticalAlerts: 2 items maximum
- immediateActions: 4 items maximum
- nextSteps: 5 items maximum
- deadlines: 3 items maximum
- rights: 5 items maximum
- resources: 3 items maximum
- warnings: 4 items maximum
- evidenceToGather: exactly 1 item (the standard attorney-referral message per FACT-SPECIFIC HARD STOPS)
- courtPreparation: 4 items maximum
- avoidActions: 4 items maximum
- timeline: 5 items maximum
- uncertainties: 3 items maximum
- collateralConsequences: 4 items maximum
- Keep each individual string value to 1-2 sentences maximum (3 sentences only for overview)
- Prioritize the most important items in each array — do not pad arrays with obvious or generic content

JSON FORMATTING RULES:
- Return ONLY a valid JSON object, no markdown code blocks, no explanatory text before or after
- Escape all special characters in strings properly (double quotes, backslashes, newlines)
- Do NOT use literal newlines inside JSON string values - use \\n instead
- Do NOT include trailing commas after the last item in arrays or objects
- Ensure all property names are double-quoted`;
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
  const chargesUnknown = caseDetails.chargesUnknown || 
    (Array.isArray(caseDetails.charges) ? caseDetails.charges.length === 0 : !caseDetails.charges);
  const chargesText = chargesUnknown
    ? 'Unknown — user has not been formally charged or does not yet know the charges'
    : Array.isArray(caseDetails.charges)
      ? caseDetails.charges.map(c => sanitizeInput(c, 200)).join(', ')
      : sanitizeInput(caseDetails.charges, 200);

  // Inject verified jurisdiction context when available (high/medium confidence states only)
  const jurisdictionBlock = buildJurisdictionContextBlock(
    sanitizeInput(caseDetails.jurisdiction, 100)
  );
  const collateralBlock = buildCollateralConsequenceContextBlock(
    sanitizeInput(caseDetails.jurisdiction, 100)
  );

  // Detect drug-related charges to surface treatment enrollment guidance
  const isDrugCase = !chargesUnknown && /drug|narcotic|controlled.?substance|marijuana|cannabis|cocaine|methamphetamine|heroin|fentanyl|opioid|possession.{0,20}substance/i.test(chargesText);

  let prompt = `Provide general legal information for someone in this situation. Do not treat this as a case analysis — treat it as orientation for a person at this charge type, jurisdiction, and case stage:
${jurisdictionBlock ? `\n${jurisdictionBlock}\n` : ''}${collateralBlock ? `\n${collateralBlock}\n` : ''}
BASIC CASE INFORMATION:
- Jurisdiction: ${sanitizeInput(caseDetails.jurisdiction, 100)}
- Charges: ${chargesText}
- Case Stage: ${sanitizeInput(caseDetails.caseStage, 100)}
- In Custody: ${sanitizeInput(caseDetails.custodyStatus, 100)}
- Has Attorney: ${caseDetails.hasAttorney ? 'Yes' : 'No'}`;

  // Background context for collateral consequences
  const backgroundLines: string[] = [];
  if (caseDetails.supervisionStatus && caseDetails.supervisionStatus !== 'none') {
    backgroundLines.push(`Supervision status: ${caseDetails.supervisionStatus}`);
  }
  if (caseDetails.priorConvictions === true) {
    backgroundLines.push('Prior convictions: Yes');
  }
  if (caseDetails.citizenshipStatus && caseDetails.citizenshipStatus !== 'prefer_not') {
    backgroundLines.push(`Citizenship/immigration status: ${caseDetails.citizenshipStatus === 'non_citizen' ? 'Non-citizen (has immigration status to protect)' : 'U.S. citizen'}`);
  }
  if (caseDetails.hasMinorChildren === true) {
    backgroundLines.push('Has minor children in care: Yes');
  }
  if (caseDetails.hasProfessionalLicense === true) {
    backgroundLines.push('Holds a professional license: Yes');
  }
  if (caseDetails.hasHousingAssistance === true) {
    backgroundLines.push('In public or subsidized housing: Yes');
  }
  if (backgroundLines.length > 0) {
    prompt += `\n\nBACKGROUND / COLLATERAL RISK CONTEXT (use to populate collateralConsequences field — only flag risks that are genuinely likely given these background facts and the charges above):\n${backgroundLines.join('\n')}`;
  }

  if (caseDetails.selectedConcerns && caseDetails.selectedConcerns.length > 0) {
    const concernsList = caseDetails.selectedConcerns.join(', ');
    prompt += `\n\nSPECIFIC CONCERNS: The person is particularly worried about: ${concernsList}. Address each concern factually in the guidance. When you do, include a markdown link to the relevant resource page from this map (only link to pages matching the selected concerns — weave the links naturally into the text):
- employment → [Employment Rights](/support/employment)
- housing → [Housing](/support/housing)
- finances → [Finances & Benefits](/support/finances)
- childcare → [Childcare Resources](/support/childcare)
- familyCare → [Family Care](/support/family-care)
- mentalHealth → [Mental Health Support](/support/mental-health)
- personalHealth → [Personal Health](/support/personal-health)
- transportation → [Transportation](/support/transportation)
- reputation → [Record & Reputation](/support/reputation)
- courtLogistics → [Court Logistics](/support/court-logistics)
- immigration → [Immigration Resources](/immigration-guidance)`;
  }

  // Civil emergency urgency signals
  if (caseDetails.civilUrgency && Object.keys(caseDetails.civilUrgency).length > 0) {
    const urgency = caseDetails.civilUrgency;
    const urgencyLines: string[] = [];

    if (urgency.housing === 'active') {
      urgencyLines.push('HOUSING - ACTIVE: Person has received a notice or contact from landlord. Include specific guidance on responding to landlord communications, tenant rights at this stage, and connecting with housing legal aid. This is time-sensitive.');
    } else if (urgency.housing === 'emergency') {
      urgencyLines.push('HOUSING - EMERGENCY: Eviction or lease termination proceedings have started. This is a legal emergency with strict deadlines (typically 3-30 days depending on state). This MUST appear in criticalAlerts and as the top immediateAction. Include: specific response deadline context, tenant rights during eviction, and urgent referral to housing legal aid. Do not bury this.');
    }

    if (urgency.employment === 'active') {
      urgencyLines.push('EMPLOYMENT - ACTIVE: Employer knows about the arrest but has not yet acted. Include guidance on employment rights, what employers can and cannot do with arrest information, and how to document the situation.');
    } else if (urgency.employment === 'emergency') {
      urgencyLines.push('EMPLOYMENT - EMERGENCY: Person has been suspended, placed on leave, or terminated. Include EEOC rights, the distinction between arrest and conviction for employment purposes, whether wrongful termination may apply, and referral to an employment attorney or legal aid.');
    }

    if (urgency.dependents === 'active') {
      urgencyLines.push('DEPENDENTS - ACTIVE: Caregiver situation for children or dependents is uncertain. Include guidance on identifying and documenting a caregiver plan immediately, notifying schools and care providers, and what documentation to prepare.');
    } else if (urgency.dependents === 'emergency') {
      urgencyLines.push('DEPENDENTS - EMERGENCY: Child welfare agency has been involved or reached out. This requires immediate action. Include specific rights during child welfare investigations, importance of legal representation in family court proceedings, and that responding promptly and cooperatively to the agency is important. Referral to family law legal aid.');
    }

    if (urgency.immigration === 'active') {
      urgencyLines.push('IMMIGRATION - ACTIVE: Person has an existing immigration case or pending status concern. Include guidance on how a criminal case can interact with immigration status, the importance of an immigration attorney reviewing the case, and that some plea dispositions can have immigration consequences that a general public defender may not address.');
    } else if (urgency.immigration === 'emergency') {
      urgencyLines.push('IMMIGRATION - EMERGENCY: Person has received an immigration notice, detainer, or ICE contact. This is a dual-system emergency. Include rights during ICE contact, the importance of an immigration attorney immediately, and link to [Immigration Resources](/immigration-guidance). Flag this in criticalAlerts.');
    }

    if (urgencyLines.length > 0) {
      prompt += `\n\nCIVIL EMERGENCY URGENCY SIGNALS — these represent active situations happening NOW, not hypothetical concerns. Address each one with specific, time-sensitive guidance. Urgency-level signals are more important than general case stage guidance:\n${urgencyLines.join('\n')}`;
    }
  }

  // Drug case: prompt treatment enrollment as an immediateAction
  if (isDrugCase) {
    prompt += `\n\nDRUG CASE — TREATMENT ENROLLMENT: Enrolling in a substance use treatment program before the next court date is one of the most impactful steps someone facing drug charges can take. Courts regularly consider proactive enrollment when deciding between incarceration and alternatives. Include this as an immediateAction or prominent nextStep: "Enroll in a drug treatment or substance use program before your next court date — courts consider proactive enrollment when deciding outcomes. Get a letter from the program confirming your enrollment date for your attorney. See our [Treatment Connection Guide](/support/mental-health#treatment-connection) for how to find programs, what to ask when you call, and letter templates." Use this exact markdown link in the text.`;
  }

  // Collateral consequences and CCRC resource guidance
  if (collateralBlock || (caseDetails.selectedConcerns && caseDetails.selectedConcerns.some(c =>
    ['housing', 'employment', 'finances', 'immigration', 'childcare', 'familyCare'].includes(c)
  ))) {
    prompt += `\n\nCOLLATERAL CONSEQUENCES RESOURCE: When discussing collateral consequences (effects on housing, employment, benefits, voting, or immigration), include the Collateral Consequences Resource Center as a resource. Use this format in the resources array: { type: "national", description: "State-by-state database of collateral consequences, certificates of relief, and restoration of rights. Authoritative source for understanding what a specific conviction affects.", contact: "ccrcatlaw.org", website: "https://ccrcatlaw.org" }. Include this resource whenever the guidance covers collateral consequences or civil impacts of a criminal case.\n\nRECORD CLEARING SCREENER: When guidance mentions expungement, record sealing, record clearing, or collateral consequences that could be addressed through record relief, include a link to the Record Clearance Eligibility Screener in the relevant nextSteps or resources: [Check your eligibility for record clearing](/support/reputation/eligibility). This screener is a decision-tree tool that takes about one minute. Include it whenever post-conviction record relief is relevant to the case stage.`;
  }

  if (chargesUnknown) {
    prompt += `\n\nIMPORTANT: The specific charges are not yet known. Do NOT guess or speculate about what the charges might be. Instead, provide:
1. General rights that apply at the current stage (${sanitizeInput(caseDetails.caseStage, 100)}) regardless of charge type
2. How to find out what the official charges are (e.g., arrest record, court clerk, public defender)
3. Jurisdiction-specific procedures and deadlines for ${sanitizeInput(caseDetails.jurisdiction, 100)} at this stage
4. Universal protective steps (right to remain silent, right to counsel, etc.)
5. Warnings about common mistakes when charges are unclear

Remember: Use simple language, be specific, and prioritize by urgency. Do not fabricate charges.`;
  } else {
    prompt += `\n\nProvide general legal information for someone in this situation. Frame all guidance as what is typically important at this case stage for this charge type in this jurisdiction — not as personalized case analysis. Focus on:
1. What typically happens at the ${sanitizeInput(caseDetails.caseStage, 100)} stage
2. Jurisdiction-specific deadlines and procedures for ${sanitizeInput(caseDetails.jurisdiction, 100)}
3. Rights and considerations generally applicable to ${chargesText} charges
4. What attorneys and courts typically focus on at this stage
5. Common issues that arise in this type of case

Remember: Use simple language, prioritize by urgency, and frame all guidance as general information rather than advice specific to this person's case.`;
  }

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
    selectedConcerns: caseDetails.selectedConcerns,
    civilUrgency: caseDetails.civilUrgency,
    language: caseDetails.language,
    supervisionStatus: caseDetails.supervisionStatus,
    priorConvictions: caseDetails.priorConvictions,
    citizenshipStatus: caseDetails.citizenshipStatus,
    hasMinorChildren: caseDetails.hasMinorChildren,
    hasProfessionalLicense: caseDetails.hasProfessionalLicense,
    hasHousingAssistance: caseDetails.hasHousingAssistance,
  }));
  return hash.digest('hex');
}

// Improved JSON extraction with multiple fallback strategies
function repairJSON(jsonText: string): string {
  let repaired = jsonText;
  repaired = repaired.replace(/,\s*([}\]])/g, '$1');
  repaired = repaired.replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":');
  repaired = repaired.replace(/\t/g, '  ');
  repaired = repaired.replace(/[\x00-\x1f]/g, (ch) => {
    if (ch === '\n' || ch === '\r') return '\\n';
    return '';
  });
  return repaired;
}

function extractJSON(responseText: string): string {
  // Strategy 1: Try to extract from markdown code block
  const markdownMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (markdownMatch) {
    const extracted = markdownMatch[1].trim();
    try {
      JSON.parse(extracted);
      return extracted;
    } catch {
      const repaired = repairJSON(extracted);
      try {
        JSON.parse(repaired);
        return repaired;
      } catch {
        // Fall through to other strategies
      }
    }
  }

  // Strategy 2: Look for JSON object with balanced braces (string-aware)
  let depth = 0;
  let jsonStart = -1;
  let jsonEnd = -1;
  let inString = false;
  let escapeNext = false;

  for (let i = 0; i < responseText.length; i++) {
    const ch = responseText[i];

    if (escapeNext) {
      escapeNext = false;
      continue;
    }

    if (ch === '\\' && inString) {
      escapeNext = true;
      continue;
    }

    if (ch === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (ch === '{') {
      if (depth === 0) {
        jsonStart = i;
      }
      depth++;
    } else if (ch === '}') {
      depth--;
      if (depth === 0 && jsonStart !== -1) {
        jsonEnd = i;
        break;
      }
    }
  }

  if (jsonStart !== -1 && jsonEnd !== -1) {
    const candidate = responseText.slice(jsonStart, jsonEnd + 1);
    try {
      JSON.parse(candidate);
      return candidate;
    } catch {
      const repaired = repairJSON(candidate);
      try {
        JSON.parse(repaired);
        return repaired;
      } catch {
        // Fall through
      }
    }
  }

  // Strategy 3: Try simple indexOf/lastIndexOf as last resort
  const simpleStart = responseText.indexOf('{');
  const simpleEnd = responseText.lastIndexOf('}');
  if (simpleStart !== -1 && simpleEnd !== -1 && simpleEnd > simpleStart) {
    const candidate = responseText.slice(simpleStart, simpleEnd + 1);
    try {
      JSON.parse(candidate);
      return candidate;
    } catch {
      const repaired = repairJSON(candidate);
      try {
        JSON.parse(repaired);
        return repaired;
      } catch {
        return candidate;
      }
    }
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
  // Check if API is configured
  if (!anthropic) {
    throw new Error('AI guidance service is not configured. Please contact support or try again later.');
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        devLog('claude', `Retrying API call (attempt ${attempt + 1}/${maxRetries + 1})...`);
      }
      
      const startTime = Date.now();
      
      // Wrap the API call in a timeout promise to ensure it actually times out
      const timeoutMs = 150000; // 150 seconds - slightly longer than SDK timeout for complex legal guidance
      const apiCallPromise = anthropic.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 3500,
        temperature: 0.3,
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
            content: userPrompt,
          },
        ],
      });
      
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Claude API timed out after 150 seconds')), timeoutMs);
      });
      
      const message = await Promise.race([apiCallPromise, timeoutPromise]);
      
      devLog('claude', `API responded in ${Date.now() - startTime}ms`);
      devLog('claude', 'Response usage', message.usage);
      
      return message;
    } catch (error: any) {
      lastError = error;
      
      // Check if this is an overloaded error (529) that we should retry
      const isOverloaded = error instanceof Anthropic.APIError && error.status === 529;
      
      if (isOverloaded && attempt < maxRetries) {
        devLog('claude', `API overloaded on attempt ${attempt + 1}, will retry...`);
        // Add a delay before retry on overloaded responses
        const delay = 3000;
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
  caseDetails: CaseDetails,
  sessionId?: string
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
  // Prefix with sessionId so per-session clearing is exact rather than clearing the whole cache
  const baseKey = generateCacheKey(processedDetails);
  const cacheKey = sessionId ? `${sessionId}:${baseKey}` : baseKey;
  const cachedEntry = responseCache.get(cacheKey);

  if (cachedEntry && (Date.now() - cachedEntry.timestamp) < CACHE_TTL) {
    devLog('claude', 'Cache hit for guidance request');
    return cachedEntry.response;
  }

  try {
    const systemPrompt = buildSystemPrompt(processedDetails.language);
    const userPrompt = buildUserPrompt(processedDetails);

    if (!isRequestCostAcceptable(systemPrompt.length + userPrompt.length)) {
      throw new Error('Request input is too large to process. Please reduce the amount of detail provided.');
    }

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

    // Calculate costs (Sonnet 4.6 pricing: $3/MTok input, $15/MTok output)
    // With prompt caching: cache writes = $3.75/MTok (+25%), cache reads = $0.30/MTok (-90%)
    const regularInputCost = (message.usage.input_tokens / 1_000_000) * 3.0;
    const cacheWriteCost = ((message.usage.cache_creation_input_tokens ?? 0) / 1_000_000) * 3.75;
    const cacheReadCost = ((message.usage.cache_read_input_tokens ?? 0) / 1_000_000) * 0.30;
    const inputCost = regularInputCost + cacheWriteCost + cacheReadCost;
    const outputCost = (message.usage.output_tokens / 1_000_000) * 15.0;

    // Record cost for daily budget tracking (awaited so it's durable before returning)
    await recordAICost(inputCost + outputCost, 'claude-guidance');

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
      uncertainties: Array.isArray(parsedData.uncertainties) ? parsedData.uncertainties : [],
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

    // Run rule-based safety scan on the serialized guidance before returning to client
    try {
      const guidanceText = JSON.stringify(guidance);
      const scanResult = scanGuidanceForDangerContent(guidanceText, cacheKey.slice(0, 8));
      if (scanResult.hasDangerContent) {
        devLog('safety', `Safety scan flagged categories: ${scanResult.dangerFlags.join(', ')}`);
        const stripped = stripDangerousItems(guidance.immediateActions, guidance.avoidActions);
        guidance.immediateActions = stripped.immediateActions;
        guidance.avoidActions = stripped.avoidActions;
        guidance.dangerFlags = scanResult.dangerFlags;
        devLog('safety', `Stripped ${stripped.strippedCount} dangerous item(s) from guidance`);
      }
    } catch (safetyError) {
      devLog('safety', 'Safety scan failed, continuing without scan', safetyError);
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

    // Inject statute citation disclaimer into uncertainties (always present)
    guidance.uncertainties = [
      ...(guidance.uncertainties || []),
      {
        area: 'Statute Citations',
        note: 'Citations in this guidance are provided for reference and cross-checked where possible. Laws change frequently and vary by jurisdiction. Verify all statute citations with your attorney or at law.cornell.edu/uscode before relying on them.',
      },
    ];

    // Cache the successful response (including validation)
    responseCache.set(cacheKey, {
      response: guidance,
      timestamp: Date.now(),
    });
    // Register in the reverse index so clearSessionCache(sessionId) can find this key
    if (sessionId) {
      if (!sessionCacheKeys.has(sessionId)) sessionCacheKeys.set(sessionId, new Set());
      sessionCacheKeys.get(sessionId)!.add(cacheKey);
    }

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

// Streaming version of generateClaudeGuidance — uses anthropic.messages.stream()
// Calls onChunk for each text token so the route can forward them as SSE.
// Returns the fully-parsed ClaudeGuidance once streaming is complete.
export async function streamClaudeGuidance(
  caseDetails: CaseDetails,
  onChunk: (text: string) => void,
  sessionId?: string
): Promise<ClaudeGuidance> {
  if (!anthropic) {
    throw new Error('AI guidance service is not configured. Please contact support or try again later.');
  }

  // PII redaction — same as non-streaming path
  let processedDetails = caseDetails;
  if (isPIIRedactionEnabled()) {
    const { redactedDetails, stats } = redactCaseDetails(caseDetails);
    processedDetails = redactedDetails;
    if (stats.total > 0) {
      devLog('pii', 'Redacted sensitive information (stream)', {
        total: stats.total,
        breakdown: { names: stats.name, emails: stats.email, phones: stats.phone, ssn: stats.ssn, creditCards: stats.creditCard, addresses: stats.address, dob: stats.dob },
      });
    }
  }

  // Cache check — on a hit, emit the full JSON as a single chunk and return
  const baseKey = generateCacheKey(processedDetails);
  const cacheKey = sessionId ? `${sessionId}:${baseKey}` : baseKey;
  const cachedEntry = responseCache.get(cacheKey);
  if (cachedEntry && (Date.now() - cachedEntry.timestamp) < CACHE_TTL) {
    devLog('claude', 'Cache hit — skipping stream, returning cached guidance');
    onChunk(JSON.stringify(cachedEntry.response));
    return cachedEntry.response;
  }

  const systemPrompt = buildSystemPrompt(processedDetails.language);
  const userPrompt = buildUserPrompt(processedDetails);

  if (!isRequestCostAcceptable(systemPrompt.length + userPrompt.length)) {
    throw new Error('Request input is too large to process. Please reduce the amount of detail provided.');
  }

  devLog('claude', 'Streaming personalized guidance...');
  devLog('claude', `Prompt length: ${userPrompt.length} characters`);

  const startTime = Date.now();
  let fullText = '';

  try {
    const stream = anthropic.messages.stream({
      model: CLAUDE_MODEL,
      max_tokens: 3500,
      temperature: 0.3,
      system: [
        {
          type: 'text' as const,
          text: systemPrompt,
          cache_control: { type: 'ephemeral' as const },
        },
      ],
      messages: [{ role: 'user', content: userPrompt }],
    });

    // Stream text tokens to caller via event iteration (SDK 0.37 API)
    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        const text = (event.delta as { type: 'text_delta'; text: string }).text;
        fullText += text;
        onChunk(text);
      }
    }

    const finalMessage = await stream.finalMessage();
    devLog('claude', `Stream completed in ${Date.now() - startTime}ms`);
    devLog('claude', 'Stream usage', finalMessage.usage);

    // Parse accumulated JSON
    const jsonText = extractJSON(fullText);
    let parsedData: any;
    try {
      parsedData = JSON.parse(jsonText);
    } catch (parseError) {
      throw new Error(
        `Failed to parse streamed response as JSON: ${parseError instanceof Error ? parseError.message : 'Unknown error'}. ` +
        `Received ${fullText.length} chars. Preview: ${fullText.slice(0, 200)}...`
      );
    }

    validateClaudeResponse(parsedData);

    // Cost tracking
    const regularInputCost = (finalMessage.usage.input_tokens / 1_000_000) * 3.0;
    const cacheWriteCost = ((finalMessage.usage.cache_creation_input_tokens ?? 0) / 1_000_000) * 3.75;
    const cacheReadCost = ((finalMessage.usage.cache_read_input_tokens ?? 0) / 1_000_000) * 0.30;
    const inputCost = regularInputCost + cacheWriteCost + cacheReadCost;
    const outputCost = (finalMessage.usage.output_tokens / 1_000_000) * 15.0;
    await recordAICost(inputCost + outputCost, 'claude-guidance');

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
      uncertainties: Array.isArray(parsedData.uncertainties) ? parsedData.uncertainties : [],
      usageMetrics: {
        inputTokens: finalMessage.usage.input_tokens,
        outputTokens: finalMessage.usage.output_tokens,
        estimatedCost: inputCost + outputCost,
      },
    };

    // Legal accuracy validation (same as non-streaming path)
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
      devLog('guidance', `Stream validation complete — Confidence: ${(validationResult.confidenceScore * 100).toFixed(1)}%`);
    } catch (validationError) {
      devLog('guidance', 'Validation failed on stream path, continuing without it', validationError);
    }

    // Safety scan
    try {
      const guidanceText = JSON.stringify(guidance);
      const scanResult = scanGuidanceForDangerContent(guidanceText, cacheKey.slice(0, 8));
      if (scanResult.hasDangerContent) {
        const stripped = stripDangerousItems(guidance.immediateActions, guidance.avoidActions);
        guidance.immediateActions = stripped.immediateActions;
        guidance.avoidActions = stripped.avoidActions;
        guidance.dangerFlags = scanResult.dangerFlags;
      }
    } catch (safetyError) {
      devLog('safety', 'Safety scan failed on stream path', safetyError);
    }

    // Diversion program cross-reference
    try {
      const allText = [
        guidance.overview || '',
        ...(guidance.nextSteps || []),
        ...(guidance.warnings || []),
        ...(guidance.resources || []).map(r => r.description || ''),
      ].join(' ');
      const mentionedDiversions = extractDiversionMentions(allText);
      if (mentionedDiversions.length > 0) {
        const diversionValidation = checkDiversionAvailability(processedDetails.jurisdiction, mentionedDiversions);
        if (diversionValidation.warnings.length > 0) {
          guidance.warnings = [...(guidance.warnings || []), ...diversionValidation.warnings];
        }
      }
    } catch (diversionError) {
      devLog('guidance', 'Diversion check failed on stream path', diversionError);
    }

    // Statute citation disclaimer
    guidance.uncertainties = [
      ...(guidance.uncertainties || []),
      {
        area: 'Statute Citations',
        note: 'Citations in this guidance are provided for reference and cross-checked where possible. Laws change frequently and vary by jurisdiction. Verify all statute citations with your attorney or at law.cornell.edu/uscode before relying on them.',
      },
    ];

    // Cache the result
    responseCache.set(cacheKey, { response: guidance, timestamp: Date.now() });
    if (sessionId) {
      if (!sessionCacheKeys.has(sessionId)) sessionCacheKeys.set(sessionId, new Set());
      sessionCacheKeys.get(sessionId)!.add(cacheKey);
    }

    return guidance;
  } catch (error: any) {
    errLog('Claude stream error', error);
    if (error instanceof Anthropic.APIError) {
      if (error.status === 429) throw new Error('AI service is currently overloaded. Please try again in a few minutes.');
      if (error.status === 401 || error.status === 403) throw new Error('AI service authentication failed. Please contact support.');
      if (error.status === 500 || error.status === 503) throw new Error('AI service is temporarily unavailable. Please try again shortly.');
      if (error.status === 400) throw new Error('Invalid request to AI service. Please try with different input.');
    }
    if (error instanceof Error && error.message.includes('timed out')) {
      throw new Error('AI service request timed out. Please try again.');
    }
    throw new Error(`Failed to generate AI guidance: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Health check function to verify API key is working
export async function testClaudeConnection(): Promise<boolean> {
  if (!anthropic) {
    errLog('Claude connection test failed - API not configured');
    return false;
  }

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

// Check if AI guidance is available
export function isAIGuidanceAvailable(): boolean {
  return anthropic !== null;
}
