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

export interface ImmediateAction { action: string; urgency: 'urgent' | 'high' | 'medium' | 'low'; }
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
  };
  dangerFlags?: string[];
  localOrdinance?: any;
  generatedBy?: string;
  usageMetrics?: unknown;
}

const strings = (value: unknown): string[] => Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
const items = <T>(value: unknown): T[] => Array.isArray(value) ? value as T[] : [];

/** Convert API, rules, streaming, or legacy cached data to the one display contract. */
export function normalizeGuidance(raw: unknown, caseDataOverride?: Partial<GuidanceViewModel['caseData']>): GuidanceViewModel {
  const value = (raw && typeof raw === 'object' ? raw : {}) as Record<string, any>;
  const sourceCase = value.caseData && typeof value.caseData === 'object' ? value.caseData : {};
  const rights = strings(value.rights ?? value.rightsReminders);
  return {
    sessionId: typeof value.sessionId === 'string' ? value.sessionId : '',
    generatedAt: typeof value.generatedAt === 'string' ? value.generatedAt : undefined,
    overview: typeof value.overview === 'string' ? value.overview : '',
    criticalAlerts: strings(value.criticalAlerts),
    immediateActions: items<ImmediateAction>(value.immediateActions).filter(item => item && typeof item.action === 'string'),
    nextSteps: strings(value.nextSteps),
    deadlines: items<GuidanceDeadline>(value.deadlines).filter(item => item && typeof item.event === 'string'),
    rights,
    rightsReminders: rights,
    resources: items<GuidanceResource>(value.resources).filter(item => item && typeof item.type === 'string'),
    warnings: strings(value.warnings),
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
    uncertainties: items<GuidanceUncertainty>(value.uncertainties).filter(item => item && typeof item.area === 'string'),
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