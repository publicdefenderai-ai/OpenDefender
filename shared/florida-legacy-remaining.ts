import definitions from "./florida-legacy-remaining.json";
import { projectEvidenceBackedChargeBatch, type EvidenceBackedChargeDefinition } from "./evidence-backed-charge-batch";

function tier(value: string): "misdemeanor" | "felony" {
  if (value !== "felony" && value !== "misdemeanor") throw Error("Unexpected Florida offense classification " + value);
  return value;
}
export const FLORIDA_LEGACY_REMAINING_DEFINITIONS: EvidenceBackedChargeDefinition[] = definitions.map(row => ({
  ...row, category:tier(row.category), categories:row.categories.map(tier),
}));
export const FLORIDA_LEGACY_REMAINING = projectEvidenceBackedChargeBatch(FLORIDA_LEGACY_REMAINING_DEFINITIONS);
const charges = new Map(FLORIDA_LEGACY_REMAINING.charges.map(row => [row.id, row]));
export function floridaRemainingDisplayName(id: string) {
  return charges.get(id)?.name;
}
export function floridaRemainingChargeText(id: string) {
  const row = charges.get(id);
  if (!row) throw Error("Missing reviewed Florida charge " + id);
  const {nameEs,nameZh,description,descriptionEs,descriptionZh,maxPenalty,maxPenaltyEs,maxPenaltyZh,searchAliases,statuteCitations} = row;
  return {nameEs,nameZh,description,descriptionEs,descriptionZh,maxPenalty,maxPenaltyEs,maxPenaltyZh,searchAliases,statuteCitations,
    ...(row.categories && row.categories.length > 1 ? {categories:row.categories} : {})};
}
