import rows from "./florida-property-damage-publication.json";
import { projectEvidenceBackedChargeBatch, type EvidenceBackedChargeDefinition } from "./evidence-backed-charge-batch";
export const FLORIDA_PROPERTY_DAMAGE_DEFINITIONS: EvidenceBackedChargeDefinition[] = rows.map(({ definition }) => {
  if ((definition.category !== "felony" && definition.category !== "misdemeanor") || definition.jurisdiction !== "FL") throw Error("Unexpected Florida property-damage classification");
  const {categories, ...base} = definition;
  if (definition.code === '806.101') {
    if (definition.category !== 'misdemeanor' || categories?.join(',') !== 'misdemeanor,felony') throw Error('Invalid false fire alarm classifications');
    return {...base, category: definition.category, categories: ['misdemeanor','felony']};
  }
  if (categories) throw Error('Unexpected alternate classification');
  return {...base, category: definition.category};
});
export const FLORIDA_PROPERTY_DAMAGE_BATCH = projectEvidenceBackedChargeBatch(FLORIDA_PROPERTY_DAMAGE_DEFINITIONS);
export const FLORIDA_PROPERTY_DAMAGE_IDS = new Set(rows.map(row => row.id));
