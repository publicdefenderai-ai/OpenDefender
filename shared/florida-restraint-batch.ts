import rows from "./florida-restraint-publication.json";
import { projectEvidenceBackedChargeBatch, type EvidenceBackedChargeDefinition } from "./evidence-backed-charge-batch";
export const FLORIDA_RESTRAINT_DEFINITIONS: EvidenceBackedChargeDefinition[] = rows.map(({ definition }) => {
  if (definition.category !== "felony" || definition.jurisdiction !== "FL") throw Error("Unexpected Florida restraint classification");
  return {...definition, category: "felony"};
});
export const FLORIDA_RESTRAINT_BATCH = projectEvidenceBackedChargeBatch(FLORIDA_RESTRAINT_DEFINITIONS);
export const FLORIDA_RESTRAINT_IDS = new Set(rows.map(row => row.id));
