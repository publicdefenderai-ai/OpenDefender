export type CasePhase = 
  | 'just_arrested'
  | 'arraignment'
  | 'pretrial'
  | 'trial'
  | 'sentencing'
  | 'post_conviction';

export type DocumentCategory = 'criminal' | 'immigration';

export type ImportanceLevel = 'critical' | 'important' | 'informational';

export interface DocumentSection {
  id: string;
  labelKey: string;
  explanationKey: string;
}

export interface LegalDocument {
  id: string;
  slug: string;
  category: DocumentCategory;
  phases: CasePhase[];
  importanceLevel: ImportanceLevel;
  displayOrder: number;
  formNumber?: string;
  titleKey: string;
  descriptionKey: string;
  purposeKey: string;
  whatToDoKey: string;
  sections: DocumentSection[];
}

export const LEGAL_DOCUMENTS: LegalDocument[] = [
  {
    id: 'citation-ticket',
    slug: 'citation-ticket',
    category: 'criminal',
    phases: ['just_arrested'],
    importanceLevel: 'critical',
    displayOrder: 1,
    titleKey: 'documents.citationTicket.title',
    descriptionKey: 'documents.citationTicket.description',
    purposeKey: 'documents.citationTicket.purpose',
    whatToDoKey: 'documents.citationTicket.whatToDo',
    sections: [
      { id: 'charges', labelKey: 'documents.citationTicket.sections.charges.label', explanationKey: 'documents.citationTicket.sections.charges.explanation' },
      { id: 'court-date', labelKey: 'documents.citationTicket.sections.courtDate.label', explanationKey: 'documents.citationTicket.sections.courtDate.explanation' },
      { id: 'case-number', labelKey: 'documents.citationTicket.sections.caseNumber.label', explanationKey: 'documents.citationTicket.sections.caseNumber.explanation' },
      { id: 'bail-amount', labelKey: 'documents.citationTicket.sections.bailAmount.label', explanationKey: 'documents.citationTicket.sections.bailAmount.explanation' },
    ]
  },
  {
    id: 'arrest-warrant',
    slug: 'arrest-warrant',
    category: 'criminal',
    phases: ['just_arrested'],
    importanceLevel: 'important',
    displayOrder: 2,
    titleKey: 'documents.arrestWarrant.title',
    descriptionKey: 'documents.arrestWarrant.description',
    purposeKey: 'documents.arrestWarrant.purpose',
    whatToDoKey: 'documents.arrestWarrant.whatToDo',
    sections: [
      { id: 'probable-cause', labelKey: 'documents.arrestWarrant.sections.probableCause.label', explanationKey: 'documents.arrestWarrant.sections.probableCause.explanation' },
      { id: 'judge-signature', labelKey: 'documents.arrestWarrant.sections.judgeSignature.label', explanationKey: 'documents.arrestWarrant.sections.judgeSignature.explanation' },
      { id: 'charges-listed', labelKey: 'documents.arrestWarrant.sections.chargesListed.label', explanationKey: 'documents.arrestWarrant.sections.chargesListed.explanation' },
    ]
  },
  {
    id: 'property-voucher',
    slug: 'property-voucher',
    category: 'criminal',
    phases: ['just_arrested'],
    importanceLevel: 'critical',
    displayOrder: 3,
    titleKey: 'documents.propertyVoucher.title',
    descriptionKey: 'documents.propertyVoucher.description',
    purposeKey: 'documents.propertyVoucher.purpose',
    whatToDoKey: 'documents.propertyVoucher.whatToDo',
    sections: [
      { id: 'items-list', labelKey: 'documents.propertyVoucher.sections.itemsList.label', explanationKey: 'documents.propertyVoucher.sections.itemsList.explanation' },
      { id: 'voucher-number', labelKey: 'documents.propertyVoucher.sections.voucherNumber.label', explanationKey: 'documents.propertyVoucher.sections.voucherNumber.explanation' },
      { id: 'officer-info', labelKey: 'documents.propertyVoucher.sections.officerInfo.label', explanationKey: 'documents.propertyVoucher.sections.officerInfo.explanation' },
    ]
  },
  {
    id: 'booking-papers',
    slug: 'booking-papers',
    category: 'criminal',
    phases: ['just_arrested'],
    importanceLevel: 'important',
    displayOrder: 4,
    titleKey: 'documents.bookingPapers.title',
    descriptionKey: 'documents.bookingPapers.description',
    purposeKey: 'documents.bookingPapers.purpose',
    whatToDoKey: 'documents.bookingPapers.whatToDo',
    sections: [
      { id: 'personal-info', labelKey: 'documents.bookingPapers.sections.personalInfo.label', explanationKey: 'documents.bookingPapers.sections.personalInfo.explanation' },
      { id: 'arrest-details', labelKey: 'documents.bookingPapers.sections.arrestDetails.label', explanationKey: 'documents.bookingPapers.sections.arrestDetails.explanation' },
      { id: 'booking-number', labelKey: 'documents.bookingPapers.sections.bookingNumber.label', explanationKey: 'documents.bookingPapers.sections.bookingNumber.explanation' },
    ]
  },
  {
    id: 'miranda-acknowledgment',
    slug: 'miranda-acknowledgment',
    category: 'criminal',
    phases: ['just_arrested'],
    importanceLevel: 'informational',
    displayOrder: 5,
    titleKey: 'documents.mirandaAcknowledgment.title',
    descriptionKey: 'documents.mirandaAcknowledgment.description',
    purposeKey: 'documents.mirandaAcknowledgment.purpose',
    whatToDoKey: 'documents.mirandaAcknowledgment.whatToDo',
    sections: [
      { id: 'rights-listed', labelKey: 'documents.mirandaAcknowledgment.sections.rightsListed.label', explanationKey: 'documents.mirandaAcknowledgment.sections.rightsListed.explanation' },
      { id: 'waiver-section', labelKey: 'documents.mirandaAcknowledgment.sections.waiverSection.label', explanationKey: 'documents.mirandaAcknowledgment.sections.waiverSection.explanation' },
    ]
  },
  {
    id: 'criminal-complaint',
    slug: 'criminal-complaint',
    category: 'criminal',
    phases: ['arraignment'],
    importanceLevel: 'critical',
    displayOrder: 6,
    titleKey: 'documents.criminalComplaint.title',
    descriptionKey: 'documents.criminalComplaint.description',
    purposeKey: 'documents.criminalComplaint.purpose',
    whatToDoKey: 'documents.criminalComplaint.whatToDo',
    sections: [
      { id: 'charges', labelKey: 'documents.criminalComplaint.sections.charges.label', explanationKey: 'documents.criminalComplaint.sections.charges.explanation' },
      { id: 'facts-alleged', labelKey: 'documents.criminalComplaint.sections.factsAlleged.label', explanationKey: 'documents.criminalComplaint.sections.factsAlleged.explanation' },
      { id: 'statute-citations', labelKey: 'documents.criminalComplaint.sections.statuteCitations.label', explanationKey: 'documents.criminalComplaint.sections.statuteCitations.explanation' },
    ]
  },
  {
    id: 'arraignment-notice',
    slug: 'arraignment-notice',
    category: 'criminal',
    phases: ['just_arrested', 'arraignment'],
    importanceLevel: 'critical',
    displayOrder: 7,
    titleKey: 'documents.arraignmentNotice.title',
    descriptionKey: 'documents.arraignmentNotice.description',
    purposeKey: 'documents.arraignmentNotice.purpose',
    whatToDoKey: 'documents.arraignmentNotice.whatToDo',
    sections: [
      { id: 'court-location', labelKey: 'documents.arraignmentNotice.sections.courtLocation.label', explanationKey: 'documents.arraignmentNotice.sections.courtLocation.explanation' },
      { id: 'date-time', labelKey: 'documents.arraignmentNotice.sections.dateTime.label', explanationKey: 'documents.arraignmentNotice.sections.dateTime.explanation' },
      { id: 'case-number', labelKey: 'documents.arraignmentNotice.sections.caseNumber.label', explanationKey: 'documents.arraignmentNotice.sections.caseNumber.explanation' },
    ]
  },
  {
    id: 'bail-bond-order',
    slug: 'bail-bond-order',
    category: 'criminal',
    phases: ['arraignment'],
    importanceLevel: 'critical',
    displayOrder: 8,
    titleKey: 'documents.bailBondOrder.title',
    descriptionKey: 'documents.bailBondOrder.description',
    purposeKey: 'documents.bailBondOrder.purpose',
    whatToDoKey: 'documents.bailBondOrder.whatToDo',
    sections: [
      { id: 'bail-amount', labelKey: 'documents.bailBondOrder.sections.bailAmount.label', explanationKey: 'documents.bailBondOrder.sections.bailAmount.explanation' },
      { id: 'conditions', labelKey: 'documents.bailBondOrder.sections.conditions.label', explanationKey: 'documents.bailBondOrder.sections.conditions.explanation' },
      { id: 'next-court-date', labelKey: 'documents.bailBondOrder.sections.nextCourtDate.label', explanationKey: 'documents.bailBondOrder.sections.nextCourtDate.explanation' },
    ]
  },
  {
    id: 'discovery-documents',
    slug: 'discovery-documents',
    category: 'criminal',
    phases: ['pretrial'],
    importanceLevel: 'critical',
    displayOrder: 9,
    titleKey: 'documents.discoveryDocuments.title',
    descriptionKey: 'documents.discoveryDocuments.description',
    purposeKey: 'documents.discoveryDocuments.purpose',
    whatToDoKey: 'documents.discoveryDocuments.whatToDo',
    sections: [
      { id: 'police-reports', labelKey: 'documents.discoveryDocuments.sections.policeReports.label', explanationKey: 'documents.discoveryDocuments.sections.policeReports.explanation' },
      { id: 'witness-statements', labelKey: 'documents.discoveryDocuments.sections.witnessStatements.label', explanationKey: 'documents.discoveryDocuments.sections.witnessStatements.explanation' },
      { id: 'evidence-list', labelKey: 'documents.discoveryDocuments.sections.evidenceList.label', explanationKey: 'documents.discoveryDocuments.sections.evidenceList.explanation' },
    ]
  },
  {
    id: 'plea-offer',
    slug: 'plea-offer',
    category: 'criminal',
    phases: ['pretrial'],
    importanceLevel: 'critical',
    displayOrder: 10,
    titleKey: 'documents.pleaOffer.title',
    descriptionKey: 'documents.pleaOffer.description',
    purposeKey: 'documents.pleaOffer.purpose',
    whatToDoKey: 'documents.pleaOffer.whatToDo',
    sections: [
      { id: 'offered-charges', labelKey: 'documents.pleaOffer.sections.offeredCharges.label', explanationKey: 'documents.pleaOffer.sections.offeredCharges.explanation' },
      { id: 'recommended-sentence', labelKey: 'documents.pleaOffer.sections.recommendedSentence.label', explanationKey: 'documents.pleaOffer.sections.recommendedSentence.explanation' },
      { id: 'deadline', labelKey: 'documents.pleaOffer.sections.deadline.label', explanationKey: 'documents.pleaOffer.sections.deadline.explanation' },
    ]
  },
  {
    id: 'subpoena',
    slug: 'subpoena',
    category: 'criminal',
    phases: ['pretrial', 'trial'],
    importanceLevel: 'important',
    displayOrder: 11,
    titleKey: 'documents.subpoena.title',
    descriptionKey: 'documents.subpoena.description',
    purposeKey: 'documents.subpoena.purpose',
    whatToDoKey: 'documents.subpoena.whatToDo',
    sections: [
      { id: 'appearance-required', labelKey: 'documents.subpoena.sections.appearanceRequired.label', explanationKey: 'documents.subpoena.sections.appearanceRequired.explanation' },
      { id: 'documents-requested', labelKey: 'documents.subpoena.sections.documentsRequested.label', explanationKey: 'documents.subpoena.sections.documentsRequested.explanation' },
    ]
  },
  {
    id: 'sentencing-order',
    slug: 'sentencing-order',
    category: 'criminal',
    phases: ['sentencing'],
    importanceLevel: 'critical',
    displayOrder: 12,
    titleKey: 'documents.sentencingOrder.title',
    descriptionKey: 'documents.sentencingOrder.description',
    purposeKey: 'documents.sentencingOrder.purpose',
    whatToDoKey: 'documents.sentencingOrder.whatToDo',
    sections: [
      { id: 'sentence-imposed', labelKey: 'documents.sentencingOrder.sections.sentenceImposed.label', explanationKey: 'documents.sentencingOrder.sections.sentenceImposed.explanation' },
      { id: 'fines-restitution', labelKey: 'documents.sentencingOrder.sections.finesRestitution.label', explanationKey: 'documents.sentencingOrder.sections.finesRestitution.explanation' },
      { id: 'probation-terms', labelKey: 'documents.sentencingOrder.sections.probationTerms.label', explanationKey: 'documents.sentencingOrder.sections.probationTerms.explanation' },
      { id: 'appeal-rights', labelKey: 'documents.sentencingOrder.sections.appealRights.label', explanationKey: 'documents.sentencingOrder.sections.appealRights.explanation' },
    ]
  },
  {
    id: 'notice-to-appear-i862',
    slug: 'notice-to-appear-i862',
    category: 'immigration',
    phases: ['just_arrested'],
    importanceLevel: 'critical',
    displayOrder: 101,
    formNumber: 'I-862',
    titleKey: 'documents.noticeToAppearI862.title',
    descriptionKey: 'documents.noticeToAppearI862.description',
    purposeKey: 'documents.noticeToAppearI862.purpose',
    whatToDoKey: 'documents.noticeToAppearI862.whatToDo',
    sections: [
      { id: 'a-number', labelKey: 'documents.noticeToAppearI862.sections.aNumber.label', explanationKey: 'documents.noticeToAppearI862.sections.aNumber.explanation' },
      { id: 'charges', labelKey: 'documents.noticeToAppearI862.sections.charges.label', explanationKey: 'documents.noticeToAppearI862.sections.charges.explanation' },
      { id: 'hearing-info', labelKey: 'documents.noticeToAppearI862.sections.hearingInfo.label', explanationKey: 'documents.noticeToAppearI862.sections.hearingInfo.explanation' },
      { id: 'legal-services', labelKey: 'documents.noticeToAppearI862.sections.legalServices.label', explanationKey: 'documents.noticeToAppearI862.sections.legalServices.explanation' },
    ]
  },
  {
    id: 'record-deportable-alien-i213',
    slug: 'record-deportable-alien-i213',
    category: 'immigration',
    phases: ['just_arrested'],
    importanceLevel: 'important',
    displayOrder: 102,
    formNumber: 'I-213',
    titleKey: 'documents.recordDeportableAlienI213.title',
    descriptionKey: 'documents.recordDeportableAlienI213.description',
    purposeKey: 'documents.recordDeportableAlienI213.purpose',
    whatToDoKey: 'documents.recordDeportableAlienI213.whatToDo',
    sections: [
      { id: 'arrest-circumstances', labelKey: 'documents.recordDeportableAlienI213.sections.arrestCircumstances.label', explanationKey: 'documents.recordDeportableAlienI213.sections.arrestCircumstances.explanation' },
      { id: 'statements-recorded', labelKey: 'documents.recordDeportableAlienI213.sections.statementsRecorded.label', explanationKey: 'documents.recordDeportableAlienI213.sections.statementsRecorded.explanation' },
    ]
  },
  {
    id: 'bond-hearing-notice',
    slug: 'bond-hearing-notice',
    category: 'immigration',
    phases: ['arraignment'],
    importanceLevel: 'critical',
    displayOrder: 103,
    titleKey: 'documents.bondHearingNotice.title',
    descriptionKey: 'documents.bondHearingNotice.description',
    purposeKey: 'documents.bondHearingNotice.purpose',
    whatToDoKey: 'documents.bondHearingNotice.whatToDo',
    sections: [
      { id: 'hearing-date', labelKey: 'documents.bondHearingNotice.sections.hearingDate.label', explanationKey: 'documents.bondHearingNotice.sections.hearingDate.explanation' },
      { id: 'eligibility-info', labelKey: 'documents.bondHearingNotice.sections.eligibilityInfo.label', explanationKey: 'documents.bondHearingNotice.sections.eligibilityInfo.explanation' },
    ]
  },
  {
    id: 'warrant-of-removal-i205',
    slug: 'warrant-of-removal-i205',
    category: 'immigration',
    phases: ['sentencing', 'post_conviction'],
    importanceLevel: 'critical',
    displayOrder: 104,
    formNumber: 'I-205',
    titleKey: 'documents.warrantOfRemovalI205.title',
    descriptionKey: 'documents.warrantOfRemovalI205.description',
    purposeKey: 'documents.warrantOfRemovalI205.purpose',
    whatToDoKey: 'documents.warrantOfRemovalI205.whatToDo',
    sections: [
      { id: 'removal-order', labelKey: 'documents.warrantOfRemovalI205.sections.removalOrder.label', explanationKey: 'documents.warrantOfRemovalI205.sections.removalOrder.explanation' },
      { id: 'appeal-deadline', labelKey: 'documents.warrantOfRemovalI205.sections.appealDeadline.label', explanationKey: 'documents.warrantOfRemovalI205.sections.appealDeadline.explanation' },
    ]
  },
  {
    id: 'order-of-supervision-i220b',
    slug: 'order-of-supervision-i220b',
    category: 'immigration',
    phases: ['post_conviction'],
    importanceLevel: 'critical',
    displayOrder: 105,
    formNumber: 'I-220B',
    titleKey: 'documents.orderOfSupervisionI220B.title',
    descriptionKey: 'documents.orderOfSupervisionI220B.description',
    purposeKey: 'documents.orderOfSupervisionI220B.purpose',
    whatToDoKey: 'documents.orderOfSupervisionI220B.whatToDo',
    sections: [
      { id: 'reporting-requirements', labelKey: 'documents.orderOfSupervisionI220B.sections.reportingRequirements.label', explanationKey: 'documents.orderOfSupervisionI220B.sections.reportingRequirements.explanation' },
      { id: 'travel-restrictions', labelKey: 'documents.orderOfSupervisionI220B.sections.travelRestrictions.label', explanationKey: 'documents.orderOfSupervisionI220B.sections.travelRestrictions.explanation' },
    ]
  },
  {
    id: 'expedited-removal-i860',
    slug: 'expedited-removal-i860',
    category: 'immigration',
    phases: ['just_arrested'],
    importanceLevel: 'critical',
    displayOrder: 106,
    formNumber: 'I-860',
    titleKey: 'documents.expeditedRemovalI860.title',
    descriptionKey: 'documents.expeditedRemovalI860.description',
    purposeKey: 'documents.expeditedRemovalI860.purpose',
    whatToDoKey: 'documents.expeditedRemovalI860.whatToDo',
    sections: [
      { id: 'removal-grounds', labelKey: 'documents.expeditedRemovalI860.sections.removalGrounds.label', explanationKey: 'documents.expeditedRemovalI860.sections.removalGrounds.explanation' },
      { id: 'fear-claim', labelKey: 'documents.expeditedRemovalI860.sections.fearClaim.label', explanationKey: 'documents.expeditedRemovalI860.sections.fearClaim.explanation' },
    ]
  },
];

export function getDocumentsForPhase(phase: CasePhase, category?: DocumentCategory): LegalDocument[] {
  return LEGAL_DOCUMENTS.filter(doc => {
    const matchesPhase = doc.phases.includes(phase);
    const matchesCategory = category ? doc.category === category : true;
    return matchesPhase && matchesCategory;
  }).sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getCriticalDocumentsForPhase(phase: CasePhase, category?: DocumentCategory): LegalDocument[] {
  return getDocumentsForPhase(phase, category).filter(doc => doc.importanceLevel === 'critical');
}

export function getDocumentById(id: string): LegalDocument | undefined {
  return LEGAL_DOCUMENTS.find(doc => doc.id === id);
}

export function getDocumentBySlug(slug: string): LegalDocument | undefined {
  return LEGAL_DOCUMENTS.find(doc => doc.slug === slug);
}

export function mapCaseStageToPhase(caseStage: string): CasePhase {
  const stageMap: Record<string, CasePhase> = {
    'just_arrested': 'just_arrested',
    'arrest': 'just_arrested',
    'investigation': 'just_arrested',
    'arraignment': 'arraignment',
    'pretrial': 'pretrial',
    'pre-trial': 'pretrial',
    'trial': 'trial',
    'sentencing': 'sentencing',
    'post_conviction': 'post_conviction',
    'appeal': 'post_conviction',
    'appeals': 'post_conviction',
  };
  return stageMap[caseStage.toLowerCase()] || 'just_arrested';
}

export const PHASE_LABELS: Record<CasePhase, { en: string; es: string; zh: string }> = {
  just_arrested: { en: 'Just Arrested / Investigation', es: 'Recién Arrestado / Investigación', zh: '刚被逮捕 / 调查阶段' },
  arraignment: { en: 'Arraignment', es: 'Lectura de Cargos', zh: '提审' },
  pretrial: { en: 'Pre-Trial Proceedings', es: 'Procedimientos Previos al Juicio', zh: '庭前程序' },
  trial: { en: 'Trial', es: 'Juicio', zh: '审判' },
  sentencing: { en: 'Sentencing', es: 'Sentencia', zh: '量刑' },
  post_conviction: { en: 'Post-Conviction / Appeals', es: 'Post-Condena / Apelaciones', zh: '定罪后 / 上诉' },
};
