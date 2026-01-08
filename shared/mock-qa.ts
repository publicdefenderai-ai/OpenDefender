export type ProceedingType = 
  | 'arraignment'
  | 'bail_hearing'
  | 'pretrial_hearing'
  | 'plea_hearing'
  | 'trial'
  | 'sentencing'
  | 'probation_violation';

export type CasePhase = 
  | 'just_arrested'
  | 'arraignment'
  | 'pretrial'
  | 'trial'
  | 'sentencing'
  | 'post_conviction';

export type AudienceScope = 'generic' | 'fact_specific';

export interface MockQAItem {
  id: string;
  proceedingType: ProceedingType;
  casePhase: CasePhase;
  audienceScope: AudienceScope;
  questionKey: string;
  suggestedResponseKey: string;
  explanationKey: string;
  tags?: string[];
  displayOrder: number;
}

export interface MockQATemplate {
  id: string;
  proceedingType: ProceedingType;
  casePhase: CasePhase;
  questionTemplate: string;
  responseTemplate: string;
  applicabilityCriteria: {
    chargeCategories?: string[];
    custodyStatus?: ('in_custody' | 'out_on_bail' | 'or_release')[];
    hasPublicDefender?: boolean;
  };
}

export const PROCEEDING_LABELS: Record<ProceedingType, { en: string; es: string }> = {
  arraignment: { en: 'Arraignment', es: 'Lectura de Cargos' },
  bail_hearing: { en: 'Bail Hearing', es: 'Audiencia de Fianza' },
  pretrial_hearing: { en: 'Pretrial Hearing', es: 'Audiencia Preliminar' },
  plea_hearing: { en: 'Plea Hearing', es: 'Audiencia de Declaración' },
  trial: { en: 'Trial', es: 'Juicio' },
  sentencing: { en: 'Sentencing', es: 'Sentencia' },
  probation_violation: { en: 'Probation Violation Hearing', es: 'Audiencia de Violación de Libertad Condicional' }
};

export const GENERIC_MOCK_QA: MockQAItem[] = [
  // Arraignment Questions
  {
    id: 'arr-1',
    proceedingType: 'arraignment',
    casePhase: 'arraignment',
    audienceScope: 'generic',
    questionKey: 'mockQA.arraignment.plea.question',
    suggestedResponseKey: 'mockQA.arraignment.plea.response',
    explanationKey: 'mockQA.arraignment.plea.explanation',
    tags: ['plea', 'critical'],
    displayOrder: 1
  },
  {
    id: 'arr-2',
    proceedingType: 'arraignment',
    casePhase: 'arraignment',
    audienceScope: 'generic',
    questionKey: 'mockQA.arraignment.understand.question',
    suggestedResponseKey: 'mockQA.arraignment.understand.response',
    explanationKey: 'mockQA.arraignment.understand.explanation',
    tags: ['rights'],
    displayOrder: 2
  },
  {
    id: 'arr-3',
    proceedingType: 'arraignment',
    casePhase: 'arraignment',
    audienceScope: 'generic',
    questionKey: 'mockQA.arraignment.attorney.question',
    suggestedResponseKey: 'mockQA.arraignment.attorney.response',
    explanationKey: 'mockQA.arraignment.attorney.explanation',
    tags: ['attorney', 'critical'],
    displayOrder: 3
  },
  {
    id: 'arr-4',
    proceedingType: 'arraignment',
    casePhase: 'arraignment',
    audienceScope: 'generic',
    questionKey: 'mockQA.arraignment.waiveTime.question',
    suggestedResponseKey: 'mockQA.arraignment.waiveTime.response',
    explanationKey: 'mockQA.arraignment.waiveTime.explanation',
    tags: ['timing'],
    displayOrder: 4
  },

  // Bail Hearing Questions
  {
    id: 'bail-1',
    proceedingType: 'bail_hearing',
    casePhase: 'arraignment',
    audienceScope: 'generic',
    questionKey: 'mockQA.bail.residence.question',
    suggestedResponseKey: 'mockQA.bail.residence.response',
    explanationKey: 'mockQA.bail.residence.explanation',
    tags: ['bail'],
    displayOrder: 1
  },
  {
    id: 'bail-2',
    proceedingType: 'bail_hearing',
    casePhase: 'arraignment',
    audienceScope: 'generic',
    questionKey: 'mockQA.bail.employment.question',
    suggestedResponseKey: 'mockQA.bail.employment.response',
    explanationKey: 'mockQA.bail.employment.explanation',
    tags: ['bail'],
    displayOrder: 2
  },
  {
    id: 'bail-3',
    proceedingType: 'bail_hearing',
    casePhase: 'arraignment',
    audienceScope: 'generic',
    questionKey: 'mockQA.bail.ties.question',
    suggestedResponseKey: 'mockQA.bail.ties.response',
    explanationKey: 'mockQA.bail.ties.explanation',
    tags: ['bail'],
    displayOrder: 3
  },

  // Pretrial Hearing Questions
  {
    id: 'pre-1',
    proceedingType: 'pretrial_hearing',
    casePhase: 'pretrial',
    audienceScope: 'generic',
    questionKey: 'mockQA.pretrial.progress.question',
    suggestedResponseKey: 'mockQA.pretrial.progress.response',
    explanationKey: 'mockQA.pretrial.progress.explanation',
    tags: ['status'],
    displayOrder: 1
  },
  {
    id: 'pre-2',
    proceedingType: 'pretrial_hearing',
    casePhase: 'pretrial',
    audienceScope: 'generic',
    questionKey: 'mockQA.pretrial.conditions.question',
    suggestedResponseKey: 'mockQA.pretrial.conditions.response',
    explanationKey: 'mockQA.pretrial.conditions.explanation',
    tags: ['conditions'],
    displayOrder: 2
  },

  // Plea Hearing Questions
  {
    id: 'plea-1',
    proceedingType: 'plea_hearing',
    casePhase: 'pretrial',
    audienceScope: 'generic',
    questionKey: 'mockQA.plea.voluntary.question',
    suggestedResponseKey: 'mockQA.plea.voluntary.response',
    explanationKey: 'mockQA.plea.voluntary.explanation',
    tags: ['plea', 'critical'],
    displayOrder: 1
  },
  {
    id: 'plea-2',
    proceedingType: 'plea_hearing',
    casePhase: 'pretrial',
    audienceScope: 'generic',
    questionKey: 'mockQA.plea.discussed.question',
    suggestedResponseKey: 'mockQA.plea.discussed.response',
    explanationKey: 'mockQA.plea.discussed.explanation',
    tags: ['attorney'],
    displayOrder: 2
  },
  {
    id: 'plea-3',
    proceedingType: 'plea_hearing',
    casePhase: 'pretrial',
    audienceScope: 'generic',
    questionKey: 'mockQA.plea.consequences.question',
    suggestedResponseKey: 'mockQA.plea.consequences.response',
    explanationKey: 'mockQA.plea.consequences.explanation',
    tags: ['consequences', 'critical'],
    displayOrder: 3
  },

  // Sentencing Questions
  {
    id: 'sent-1',
    proceedingType: 'sentencing',
    casePhase: 'sentencing',
    audienceScope: 'generic',
    questionKey: 'mockQA.sentencing.statement.question',
    suggestedResponseKey: 'mockQA.sentencing.statement.response',
    explanationKey: 'mockQA.sentencing.statement.explanation',
    tags: ['allocution'],
    displayOrder: 1
  },
  {
    id: 'sent-2',
    proceedingType: 'sentencing',
    casePhase: 'sentencing',
    audienceScope: 'generic',
    questionKey: 'mockQA.sentencing.understand.question',
    suggestedResponseKey: 'mockQA.sentencing.understand.response',
    explanationKey: 'mockQA.sentencing.understand.explanation',
    tags: ['sentence'],
    displayOrder: 2
  },

  // Trial Questions
  {
    id: 'trial-1',
    proceedingType: 'trial',
    casePhase: 'trial',
    audienceScope: 'generic',
    questionKey: 'mockQA.trial.testify.question',
    suggestedResponseKey: 'mockQA.trial.testify.response',
    explanationKey: 'mockQA.trial.testify.explanation',
    tags: ['testimony', 'critical'],
    displayOrder: 1
  },
  {
    id: 'trial-2',
    proceedingType: 'trial',
    casePhase: 'trial',
    audienceScope: 'generic',
    questionKey: 'mockQA.trial.juryWaiver.question',
    suggestedResponseKey: 'mockQA.trial.juryWaiver.response',
    explanationKey: 'mockQA.trial.juryWaiver.explanation',
    tags: ['jury'],
    displayOrder: 2
  }
];

export function getQAByProceeding(proceedingType: ProceedingType): MockQAItem[] {
  return GENERIC_MOCK_QA
    .filter(qa => qa.proceedingType === proceedingType && qa.audienceScope === 'generic')
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getQAByPhase(casePhase: CasePhase): MockQAItem[] {
  return GENERIC_MOCK_QA
    .filter(qa => qa.casePhase === casePhase && qa.audienceScope === 'generic')
    .sort((a, b) => a.displayOrder - b.displayOrder);
}

export const FACT_SPECIFIC_TEMPLATES: MockQATemplate[] = [
  {
    id: 'fs-dui-1',
    proceedingType: 'arraignment',
    casePhase: 'arraignment',
    questionTemplate: 'Do you understand that the charge of {chargeType} carries a maximum penalty of {maxPenalty}?',
    responseTemplate: 'Yes, Your Honor, I understand.',
    applicabilityCriteria: {
      chargeCategories: ['dui', 'dwi']
    }
  },
  {
    id: 'fs-drug-1',
    proceedingType: 'arraignment',
    casePhase: 'arraignment',
    questionTemplate: 'Are you currently enrolled in any drug treatment programs?',
    responseTemplate: 'Your attorney should help you answer this based on your specific situation.',
    applicabilityCriteria: {
      chargeCategories: ['drug_possession', 'drug_related']
    }
  },
  {
    id: 'fs-custody-1',
    proceedingType: 'bail_hearing',
    casePhase: 'arraignment',
    questionTemplate: 'Do you have the means to post bail if it is set?',
    responseTemplate: 'Discuss your financial situation honestly with your attorney before answering.',
    applicabilityCriteria: {
      custodyStatus: ['in_custody']
    }
  }
];
