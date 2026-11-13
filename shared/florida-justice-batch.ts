import rows from "./florida-justice-publication.json";
import { projectEvidenceBackedChargeBatch, type EvidenceBackedChargeDefinition } from "./evidence-backed-charge-batch";
export const FLORIDA_JUSTICE_DEFINITIONS: EvidenceBackedChargeDefinition[] = rows.map(({ definition }) => {
  if ((definition.category !== "felony" && definition.category !== "misdemeanor") || definition.jurisdiction !== "FL") throw Error("Unexpected Florida justice classification");
  return {...definition, category: definition.category};
});
export const FLORIDA_JUSTICE_BATCH = projectEvidenceBackedChargeBatch(FLORIDA_JUSTICE_DEFINITIONS);
export const FLORIDA_JUSTICE_IDS = new Set(rows.map(row => row.id));
