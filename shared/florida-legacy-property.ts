import rows from "./florida-legacy-property.json";
import {projectEvidenceBackedChargeBatch, type EvidenceBackedChargeDefinition} from "./evidence-backed-charge-batch";

export const FLORIDA_LEGACY_PROPERTY_DEFINITIONS: EvidenceBackedChargeDefinition[] = rows.map(row => {
  if (row.jurisdiction !== "FL" || row.category !== "felony") throw Error(`Invalid Florida property record ${row.id}`);
  return {...row, jurisdiction: "FL", category: "felony"};
});
export const FLORIDA_LEGACY_PROPERTY = projectEvidenceBackedChargeBatch(FLORIDA_LEGACY_PROPERTY_DEFINITIONS);

// Reuse the six configured identities, including their existing authority gate and search groups.
export function floridaLegacyPropertyText(id: string) {
  const row = FLORIDA_LEGACY_PROPERTY.charges.find(charge => charge.id === id);
  if (!row) throw Error(`Missing reviewed Florida property text: ${id}`);
  return {
    nameEs: row.nameEs, nameZh: row.nameZh, searchAliases: row.searchAliases,
    description: row.description, descriptionEs: row.descriptionEs, descriptionZh: row.descriptionZh,
    maxPenalty: row.maxPenalty, maxPenaltyEs: row.maxPenaltyEs, maxPenaltyZh: row.maxPenaltyZh,
    statuteCitations: row.statuteCitations,
  };
}
