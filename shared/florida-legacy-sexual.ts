import definitions from "./florida-legacy-sexual.json";
import { projectEvidenceBackedChargeBatch, type EvidenceBackedChargeDefinition } from "./evidence-backed-charge-batch";

export const FLORIDA_LEGACY_SEXUAL_DEFINITIONS: EvidenceBackedChargeDefinition[] = definitions.map(row => {
  if (row.jurisdiction !== "FL" || row.category !== "felony") throw Error("Unexpected Florida classification for " + row.id);
  return { ...row, jurisdiction: "FL", category: "felony" };
});
export const FLORIDA_LEGACY_SEXUAL = projectEvidenceBackedChargeBatch(FLORIDA_LEGACY_SEXUAL_DEFINITIONS);
const charges = new Map(FLORIDA_LEGACY_SEXUAL.charges.map(row => [row.id, row]));

export function floridaSexualDisplayName(id: string) {
  return charges.get(id)?.name;
}

export function floridaSexualChargeText(id: string) {
  const row = charges.get(id);
  if (!row) throw Error("Missing reviewed Florida sexual-offense identity: " + id);
  const {nameEs, nameZh, description, descriptionEs, descriptionZh, maxPenalty, maxPenaltyEs, maxPenaltyZh, searchAliases, statuteCitations} = row;
  return {nameEs, nameZh, description, descriptionEs, descriptionZh, maxPenalty, maxPenaltyEs, maxPenaltyZh, searchAliases, statuteCitations};
}
