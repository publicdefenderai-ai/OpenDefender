import rows from "./florida-protected-persons-publication.json";
import { projectEvidenceBackedChargeBatch, type EvidenceBackedChargeDefinition } from "./evidence-backed-charge-batch";
export const FLORIDA_PROTECTED_PERSONS_DEFINITIONS: EvidenceBackedChargeDefinition[] = rows.map(({ definition }) => {
  if ((definition.category !== "felony" && definition.category !== "misdemeanor") || definition.jurisdiction !== "FL") throw Error("Unexpected Florida protected-persons classification");
  const {categories, ...base} = definition;
  if (definition.code === '784.07(2)(a)') {
    if (definition.category !== 'misdemeanor' || categories?.join(',') !== 'misdemeanor,felony') throw Error('Invalid protected assault classifications');
    return {...base, category: definition.category, categories: ['misdemeanor','felony']};
  }
  if (categories) throw Error('Unexpected alternate classification');
  return {...base, category: definition.category};
});
export const FLORIDA_PROTECTED_PERSONS_BATCH = projectEvidenceBackedChargeBatch(FLORIDA_PROTECTED_PERSONS_DEFINITIONS);
export const FLORIDA_PROTECTED_PERSONS_IDS = new Set(rows.map(row => row.id));
