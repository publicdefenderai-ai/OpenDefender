import rows from "./florida-child-restraint-publication.json";
import { projectEvidenceBackedChargeBatch, type EvidenceBackedChargeDefinition } from "./evidence-backed-charge-batch";
export const FLORIDA_CHILD_RESTRAINT_DEFINITIONS: EvidenceBackedChargeDefinition[] = rows.map(({ definition }) => {
  if ((definition.category !== "felony" && definition.category !== "misdemeanor") || definition.jurisdiction !== "FL") throw Error("Unexpected Florida child-restraint classification");
  return {...definition, category: definition.category};
});
export const FLORIDA_CHILD_RESTRAINT_BATCH = projectEvidenceBackedChargeBatch(FLORIDA_CHILD_RESTRAINT_DEFINITIONS);
export const FLORIDA_CHILD_RESTRAINT_IDS = new Set(rows.map(row => row.id));
