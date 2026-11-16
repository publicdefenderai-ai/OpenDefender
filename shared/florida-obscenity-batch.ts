import rows from "./florida-obscenity-publication.json";
import { projectEvidenceBackedChargeBatch, type EvidenceBackedChargeDefinition } from "./evidence-backed-charge-batch";
export const FLORIDA_OBSCENITY_DEFINITIONS: EvidenceBackedChargeDefinition[] = rows.map(({ definition }) => {
  if ((definition.category !== "felony" && definition.category !== "misdemeanor") || definition.jurisdiction !== "FL") throw Error("Unexpected Florida obscenity classification");
  return {...definition, category: definition.category};
});
export const FLORIDA_OBSCENITY_BATCH = projectEvidenceBackedChargeBatch(FLORIDA_OBSCENITY_DEFINITIONS);
export const FLORIDA_OBSCENITY_IDS = new Set(rows.map(row => row.id));
