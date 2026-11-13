import rows from "./florida-license-documents-publication.json";
import { projectEvidenceBackedChargeBatch, type EvidenceBackedChargeDefinition } from "./evidence-backed-charge-batch";
export const FLORIDA_LICENSE_DOCUMENTS_DEFINITIONS: EvidenceBackedChargeDefinition[] = rows.map(({ definition }) => {
  if ((definition.category !== "felony" && definition.category !== "misdemeanor") || definition.jurisdiction !== "FL") throw Error("Unexpected Florida license-documents classification");
  const {categories, ...base} = definition;
  if (definition.code === '322.212(5)(a)') {
    if (definition.category !== 'felony' || categories?.join(',') !== 'felony,misdemeanor') throw Error('Invalid application-fraud classifications');
    return {...base, category: definition.category, categories: ['felony','misdemeanor']};
  }
  if (categories) throw Error('Unexpected alternate classification');
  return {...base, category: definition.category};
});
export const FLORIDA_LICENSE_DOCUMENTS_BATCH = projectEvidenceBackedChargeBatch(FLORIDA_LICENSE_DOCUMENTS_DEFINITIONS);
export const FLORIDA_LICENSE_DOCUMENTS_IDS = new Set(rows.map(row => row.id));
