import rows from "./florida-child-victims-publication.json";
import { projectEvidenceBackedChargeBatch, type EvidenceBackedChargeDefinition } from "./evidence-backed-charge-batch";
export const FLORIDA_CHILD_VICTIMS_DEFINITIONS: EvidenceBackedChargeDefinition[] = rows.map(({ definition }) => {
  if ((definition.category !== "felony" && definition.category !== "misdemeanor") || definition.jurisdiction !== "FL") throw Error("Unexpected Florida child-victims classification");
  return {...definition, category: definition.category};
});
export const FLORIDA_CHILD_VICTIMS_BATCH = projectEvidenceBackedChargeBatch(FLORIDA_CHILD_VICTIMS_DEFINITIONS);
export const FLORIDA_CHILD_VICTIMS_IDS = new Set(rows.map(row => row.id));
