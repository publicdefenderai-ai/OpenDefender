/**
 * The portable case-plan contract.  Every surface that shows a case plan
 * (roadmap, chat, PDF, and browser print) receives this normalized shape.
 * Keep generation-specific prompt details outside this file.
 */
export type GuidanceSectionId =
  | 'criticalAlerts' | 'overview' | 'charges' | 'immediateActions' | 'timeline'
  | 'deadlines' | 'rights' | 'nextSteps' | 'evidenceToGather' | 'warnings'
  | 'courtPreparation' | 'avoidActions' | 'collateralConsequences'
  | 'mockQA' | 'uncertainties' | 'resources';

export const GUIDANCE_SECTION_ORDER: readonly GuidanceSectionId[] = [
  'criticalAlerts', 'overview', 'charges', 'immediateActions', 'timeline',
  'deadlines', 'rights', 'nextSteps', 'evidenceToGather', 'warnings',
  'courtPreparation', 'collateralConsequences', 'mockQA', 'avoidActions',
  'uncertainties', 'resources',
] as const;

export const GUIDANCE_SURFACE_TREATMENT: Record<GuidanceSectionId, {
  dashboard: 'shown'; chat: 'shown' | 'linked'; pdf: 'shown'; print: 'shown';
}> = Object.fromEntries(GUIDANCE_SECTION_ORDER.map((section) => [section, {
  dashboard: 'shown', chat: 'shown', pdf: 'shown', print: 'shown',
}])) as Record<GuidanceSectionId, { dashboard: 'shown'; chat: 'shown' | 'linked'; pdf: 'shown'; print: 'shown' }>;

/**
 * Presentation is assigned by an action's author or source boundary, never
 * inferred from its prose. Legal-information items stay readable but are not
 * presented as user-specific, completable instructions.
 */
export type ImmediateActionTreatment = 'practical' | 'legal-information';
export interface ImmediateAction {
  action: string;
  urgency: 'urgent' | 'high' | 'medium' | 'low';
  treatment?: ImmediateActionTreatment;
}
export type PracticalStarterStepId = 'organize' | 'calendar' | 'everydaySupport';
export type PracticalSupportLinkKind = 'legalHelp' | 'court' | 'lifeSupport';
export interface PracticalSupportLink {
  kind: PracticalSupportLinkKind;
  href: string;
}

/**
 * These IDs, rather than localized prose, travel with every normalized plan.
 * Each surface renders the same practical actions in the user's language.
 */
export const DEFAULT_PRACTICAL_STARTER_STEPS: readonly PracticalStarterStepId[] = [
  'organize',
  'calendar',
  'everydaySupport',
] as const;
export const DEFAULT_PRACTICAL_SUPPORT_LINKS: readonly PracticalSupportLink[] = [
  { kind: 'legalHelp', href: '/resources' },
  { kind: 'court', href: '/court-locator' },
  { kind: 'lifeSupport', href: '/support' },
] as const;
export interface GuidanceDeadline { event: string; timeframe: string; description: string; priority: 'critical' | 'important' | 'normal'; daysFromNow?: number; isEstimate?: boolean; }
export interface GuidanceTimelineItem { stage: string; description: string; timeframe: string; completed: boolean; isEstimate?: boolean; }
export interface GuidanceResource { type: string; description: string; contact: string; hours?: string; website?: string; }
export interface CollateralConsequence { category: string; consequence: string; timing: string; actionNote: string; }
export interface MockQAItem { question: string; suggestedResponse: string; explanation: string; category?: 'identity' | 'charges' | 'circumstances' | 'plea' | 'procedural' | 'general'; }
export interface GuidanceUncertainty { area: string; note: string; }

export interface GuidanceViewModel {
  sessionId: string;
  generatedAt?: string;
  overview: string;
  criticalAlerts: string[];
  immediateActions: ImmediateAction[];
  practicalStarterSteps: PracticalStarterStepId[];
  practicalSupportLinks: PracticalSupportLink[];
  nextSteps: string[];
  deadlines: GuidanceDeadline[];
  rights: string[];
  /** Legacy API alias retained for previously saved sessions. Renderers use rights. */
  rightsReminders: string[];
  resources: GuidanceResource[];
  warnings: string[];
  evidenceToGather: string[];
  courtPreparation: string[];
  avoidActions: string[];
  timeline: GuidanceTimelineItem[];
  chargeClassifications: Array<{ id?: string; name: string; classification: string; code: string; verifiedCitation?: string | null }>;
  mockQA: MockQAItem[];
  collateralConsequences: CollateralConsequence[];
  uncertainties: GuidanceUncertainty[];
  caseData: { jurisdiction: string; charges: string; caseStage: string; custodyStatus: string; hasAttorney: boolean; selectedConcerns?: string[] };
  // Retain optional renderer metadata without allowing the core plan to drift.
  validation?: {
    confidenceScore: number;
    isValid: boolean;
    summary: string;
    checksPerformed: number;
    checksPassed: number;
    issues: Array<{ type: string; severity: 'error' | 'warning' | 'info'; message: string; suggestion?: string }>;
    tiers?: Record<string, { name: string; score: number; checksPerformed: number; checksPassed: number; issues: Array<{ type: string; severity: 'error' | 'warning' | 'info'; message: string }> }>;
    precedents?: Array<{ id: string; caseName: string; citation: string; court: string; courtLevel: 'supreme' | 'appellate' | 'trial' | 'unknown'; jurisdiction: string; dateFiled: string; relevanceScore: number; matchedChargeCategories: string[]; excerpt?: string; url?: string; absoluteUrl?: string }>;
    sourceEnrichment?: {
      status: 'pending' | 'complete' | 'unavailable';
      providers: string[];
      providerStatuses?: Record<string, 'available' | 'unavailable' | 'not_run'>;
      message: string;
    };
  };
  dangerFlags?: string[];
  localOrdinance?: any;
  generatedBy?: string;
  usageMetrics?: unknown;
}

const strings = (value: unknown): string[] => Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
const items = <T>(value: unknown): T[] => Array.isArray(value) ? value as T[] : [];

function comparisonText(value: string): string {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`#]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLocaleLowerCase();
}

function comparisonTokens(value: string): Set<string> {
  return new Set(comparisonText(value).split(/\s+/).filter(token => token.length > 2));
}

function nearDuplicate(left: string, right: string): boolean {
  const leftText = comparisonText(left);
  const rightText = comparisonText(right);
  if (!leftText || !rightText) return false;
  if (leftText === rightText) return true;
  if (leftText.length < 35 || rightText.length < 35) return false;

  const leftTokens = comparisonTokens(left);
  const rightTokens = comparisonTokens(right);
  if (leftTokens.size < 5 || rightTokens.size < 5) return false;
  const overlap = [...leftTokens].filter(token => rightTokens.has(token)).length;
  const union = new Set([...leftTokens, ...rightTokens]).size;
  const containment = overlap / Math.min(leftTokens.size, rightTokens.size);
  const jaccard = overlap / union;
  return overlap >= 5 && (containment >= 0.85 || jaccard >= 0.75);
}

const DEDUPE_TOPICS = [
  /\bdeadlines?\b|\btimeframes?\b|\bplazos?\b|截止|期限/iu,
  /\bprocedur(?:e|es|al)\b|\bcourt rules?\b|\bcourt practices?\b|\bprocedimientos?\b|程序|规则/iu,
  /\bbail\b|\bbond\b|\bfianza\b|保释/iu,
  /\bsentenc(?:e|ing)\b|\bpenalt(?:y|ies)\b|\bsentencia\b|\bpenas?\b|判刑|刑罚/iu,
  /\barraignment\b|\bcomparecencia\b|\blectura de cargos\b|提审/iu,
];

function matchingTopics(value: string): Set<number> {
  return new Set(DEDUPE_TOPICS.flatMap((pattern, index) => pattern.test(value) ? [index] : []));
}

function isLocalVerificationCaveat(value: string): boolean {
  return (
    /\bcount(?:y|ies)\b|\blocal\b|\bjurisdiction\b|\bstate[- ]specific\b|\bcondad(?:o|os)\b|\blocal(?:es)?\b|\bjurisdicci[oó]n\b|县|当地|辖区/iu.test(value)
    && /\bverif(?:y|ied|ication)\b|\bconfirm(?:ed|ation)?\b|\bvary\b|\bdiffer\b|\bnot available\b|\buncertain\b|\bno pudo confirmarse\b|\bconfirma(?:r|ción)\b|核实|确认|不同/iu.test(value)
  );
}

function uniqueStrings(values: string[]): string[] {
  const result: string[] = [];
  for (const value of values) {
    if (!value.trim()) continue;
    if (!result.some(existing => nearDuplicate(existing, value))) {
      result.push(value);
    }
  }
  return result;
}

/**
 * Keep uncertainty items as the structured home for jurisdiction caveats.
 * A warning is removed only when it is an exact/near duplicate or repeats the
 * same local-verification topic. Distinct case-specific subjects, such as a
 * DMV deadline versus a criminal-court deadline, remain visible.
 */
function dedupeWarningsAndUncertainties(
  warnings: string[],
  uncertainties: GuidanceUncertainty[],
): { warnings: string[]; uncertainties: GuidanceUncertainty[] } {
  const uniqueWarnings = uniqueStrings(warnings);
  const uniqueUncertainties: GuidanceUncertainty[] = [];

  for (const item of uncertainties) {
    if (!item.area.trim() && !item.note.trim()) continue;
    const duplicate = uniqueUncertainties.some(existing =>
      nearDuplicate(`${existing.area}: ${existing.note}`, `${item.area}: ${item.note}`),
    );
    if (!duplicate) uniqueUncertainties.push(item);
  }

  const retainedWarnings = uniqueWarnings.filter(warning => !uniqueUncertainties.some(item => {
    const uncertaintyText = `${item.area}: ${item.note}`;
    if (nearDuplicate(warning, uncertaintyText)) return true;
    if (!isLocalVerificationCaveat(warning) || !isLocalVerificationCaveat(uncertaintyText)) return false;

    const warningTopics = matchingTopics(warning);
    const uncertaintyTopics = matchingTopics(uncertaintyText);
    return [...warningTopics].some(topic => uncertaintyTopics.has(topic));
  }));

  return { warnings: retainedWarnings, uncertainties: uniqueUncertainties };
}

/** Convert API, rules, streaming, or legacy cached data to the one display contract. */
export function normalizeGuidance(raw: unknown, caseDataOverride?: Partial<GuidanceViewModel['caseData']>): GuidanceViewModel {
  const value = (raw && typeof raw === 'object' ? raw : {}) as Record<string, any>;
  const sourceCase = value.caseData && typeof value.caseData === 'object' ? value.caseData : {};
  const rights = strings(value.rights ?? value.rightsReminders);
  const warningContent = dedupeWarningsAndUncertainties(
    strings(value.warnings),
    items<GuidanceUncertainty>(value.uncertainties).filter(item => item && typeof item.area === 'string' && typeof item.note === 'string'),
  );
  return {
    sessionId: typeof value.sessionId === 'string' ? value.sessionId : '',
    generatedAt: typeof value.generatedAt === 'string' ? value.generatedAt : undefined,
    overview: typeof value.overview === 'string' ? value.overview : '',
    criticalAlerts: strings(value.criticalAlerts),
    immediateActions: items<ImmediateAction>(value.immediateActions)
      .filter(item => item && typeof item.action === 'string')
      .map(item => ({
        ...item,
        // Legacy and AI-authored actions are intentionally conservative:
        // they are legal information unless their source explicitly labels
        // them as a practical action.
        treatment: item.treatment === 'practical' ? 'practical' : 'legal-information',
      })),
    practicalStarterSteps: [...DEFAULT_PRACTICAL_STARTER_STEPS],
    practicalSupportLinks: DEFAULT_PRACTICAL_SUPPORT_LINKS.map(link => ({ ...link })),
    nextSteps: strings(value.nextSteps),
    deadlines: items<GuidanceDeadline>(value.deadlines).filter(item => item && typeof item.event === 'string'),
    rights,
    rightsReminders: rights,
    resources: items<GuidanceResource>(value.resources).filter(item => item && typeof item.type === 'string'),
    warnings: warningContent.warnings,
    evidenceToGather: strings(value.evidenceToGather),
    courtPreparation: strings(value.courtPreparation),
    avoidActions: strings(value.avoidActions),
    timeline: items<GuidanceTimelineItem>(value.timeline).filter(item => item && typeof item.stage === 'string'),
    chargeClassifications: items<Record<string, any>>(value.chargeClassifications)
      .filter(item => item && (typeof item.name === 'string' || typeof item.title === 'string'))
      .map(item => ({
        ...item,
        name: String(item.name ?? item.title),
        classification: String(item.classification ?? ''),
        code: String(item.code ?? ''),
      })),
    mockQA: items<MockQAItem>(value.mockQA).filter(item => item && typeof item.question === 'string'),
    collateralConsequences: items<CollateralConsequence>(value.collateralConsequences).filter(item => item && typeof item.consequence === 'string'),
    uncertainties: warningContent.uncertainties,
    caseData: {
      jurisdiction: String(caseDataOverride?.jurisdiction ?? sourceCase.jurisdiction ?? ''),
      charges: String(caseDataOverride?.charges ?? sourceCase.charges ?? ''),
      caseStage: String(caseDataOverride?.caseStage ?? sourceCase.caseStage ?? ''),
      custodyStatus: String(caseDataOverride?.custodyStatus ?? sourceCase.custodyStatus ?? ''),
      hasAttorney: Boolean(caseDataOverride?.hasAttorney ?? sourceCase.hasAttorney),
      selectedConcerns: caseDataOverride?.selectedConcerns ?? sourceCase.selectedConcerns,
    },
    validation: value.validation,
    dangerFlags: strings(value.dangerFlags),
    localOrdinance: value.localOrdinance,
    generatedBy: typeof value.generatedBy === 'string' ? value.generatedBy : undefined,
    usageMetrics: value.usageMetrics,
  };
}