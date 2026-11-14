import rows from "./florida-theft-thresholds-publication.json";
import { projectEvidenceBackedChargeBatch, type EvidenceBackedChargeDefinition } from "./evidence-backed-charge-batch";
export const FLORIDA_THEFT_THRESHOLDS_DEFINITIONS: EvidenceBackedChargeDefinition[] = rows.map(({ definition }) => {
  if ((definition.category !== "felony" && definition.category !== "misdemeanor") || definition.jurisdiction !== "FL") throw Error("Unexpected Florida theft-thresholds classification");
  return {...definition, category: definition.category};
});
export const FLORIDA_THEFT_THRESHOLDS_BATCH = projectEvidenceBackedChargeBatch(FLORIDA_THEFT_THRESHOLDS_DEFINITIONS);
export const FLORIDA_THEFT_THRESHOLDS_IDS = new Set(rows.map(row => row.id));
