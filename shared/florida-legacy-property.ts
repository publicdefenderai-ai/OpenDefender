import burglary from "./florida-legacy-burglary.json";
import property from "./florida-legacy-property.json";
import {projectEvidenceBackedChargeBatch, type EvidenceBackedChargeDefinition} from "./evidence-backed-charge-batch";

export const FLORIDA_LEGACY_PROPERTY_DEFINITIONS: EvidenceBackedChargeDefinition[] = [...property, ...burglary].map(row => {
  if (row.jurisdiction !== "FL" || (row.category !== "felony" && row.category !== "misdemeanor"))
    throw Error(`Invalid Florida property record ${row.id}`);
  const categories = "categories" in row ? row.categories as string[] | undefined : undefined;
  if (categories && (categories[0] !== row.category || categories.some(tier => tier !== "felony" && tier !== "misdemeanor")))
    throw Error(`Invalid Florida property classifications for ${row.id}`);
  return {...row, jurisdiction: "FL", category: row.category, categories: categories as EvidenceBackedChargeDefinition["categories"]};
});
export const FLORIDA_LEGACY_PROPERTY = projectEvidenceBackedChargeBatch(FLORIDA_LEGACY_PROPERTY_DEFINITIONS);

// Reuse the configured identities, including their existing authority gate and search groups.
export function floridaLegacyPropertyText(id: string) {
  const row = FLORIDA_LEGACY_PROPERTY.charges.find(charge => charge.id === id);
  if (!row) throw Error(`Missing reviewed Florida property text: ${id}`);
  return {
    ...(row.categories ? {categories: row.categories} : {}),
    nameEs: row.nameEs, nameZh: row.nameZh, searchAliases: row.searchAliases,
    description: row.description, descriptionEs: row.descriptionEs, descriptionZh: row.descriptionZh,
    maxPenalty: row.maxPenalty, maxPenaltyEs: row.maxPenaltyEs, maxPenaltyZh: row.maxPenaltyZh,
    statuteCitations: row.statuteCitations,
  };
}
