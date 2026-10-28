import type { TFunction } from 'i18next';
import type { QAFormData } from './qa-flow';
import { getChargeById } from '@shared/criminal-charges';

// Presentation only. Questions, allowed values, validation and payloads remain in QAFlow.
// Existing English-only background labels match the canonical questionnaire.
export function summarizeIntakeStep(step: number, data: QAFormData, t: TFunction): string[] {
  const prefix = 'legalGuidance.qaFlow';
  const skipped = () => [t('design.chatOptionalSkipped')];
  if (step === 0) return [t(`${prefix}.consent.${data.guidanceMode === 'rules' ? 'cardBTitle' : 'cardATitle'}`)];
  if (step === 1) {
    const territories: Record<string, string> = { PR: 'Puerto Rico', GU: 'Guam', VI: 'U.S. Virgin Islands', AS: 'American Samoa', MP: 'Northern Mariana Islands' };
    return [territories[data.jurisdiction] || t(`${prefix}.jurisdiction.states.${data.jurisdiction}`)];
  }
  if (step === 2) return data.chargesUnknown
    ? [t('design.chatChargesUnknown')]
    : data.charges.map(id => getChargeById(id)?.name || t('design.chatSelectedCharge'));
  if (step === 3) {
    const custody: Record<string, string> = { detained: 'yes', released: 'bail', ownRecognizance: 'recognizance', notArrested: 'no', unsure: 'unsure' };
    return [
      `${t(`${prefix}.status.caseStageLabel`)}: ${t(`${prefix}.status.stages.${data.caseStage}`)}`,
      `${t(`${prefix}.status.custodyLabel`)}: ${t(`${prefix}.status.custodyOptions.${custody[data.custodyStatus]}`)}`,
      ...(data.hasAttorney === null ? [] : [`${t('chat.casePanel.attorney', 'Attorney')}: ${t(data.hasAttorney ? 'chat.casePanel.hasAttorney' : 'chat.casePanel.noAttorney')}`]),
    ];
  }
  if (step === 4) {
    const answers: string[] = [];
    const supervision: Record<string, string> = { none: 'No', probation: 'Yes, probation', parole: 'Yes, parole', both: 'Yes, both', unsure: 'Not sure' };
    const citizenship: Record<string, string> = { citizen: 'U.S. citizen', non_citizen: 'Non-citizen (green card, visa, DACA, etc.)', prefer_not: 'Prefer not to say' };
    if (data.supervisionStatus) answers.push(`Probation or parole: ${supervision[data.supervisionStatus]}`);
    if (data.schoolZoneStatus) answers.push(`${t(`${prefix}.background.schoolZoneQuestion`)}: ${t(`${prefix}.background.schoolZoneOptions.${data.schoolZoneStatus}`)}`);
    for (const [key, label] of [['priorConvictions', 'Prior convictions'], ['hasMinorChildren', 'Minor children in your care'], ['hasProfessionalLicense', 'Professional license'], ['hasHousingAssistance', 'Public or subsidized housing']] as const) {
      if (data[key] !== null) answers.push(`${label}: ${data[key] ? 'Yes' : 'No'}`);
    }
    if (data.citizenshipStatus) answers.push(`Citizenship or immigration status: ${citizenship[data.citizenshipStatus]}`);
    return answers.length ? answers : skipped();
  }
  if (step === 5) return data.selectedConcerns.length
    ? data.selectedConcerns.map(id => t(`${prefix}.additionalDetails.concernsCategories.${id}.label`))
    : skipped();
  return [];
}
