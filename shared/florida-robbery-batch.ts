import rows from "./florida-robbery-publication.json";
import { projectEvidenceBackedChargeBatch, type EvidenceBackedChargeDefinition } from "./evidence-backed-charge-batch";
export const FLORIDA_ROBBERY_DEFINITIONS: EvidenceBackedChargeDefinition[] = rows.map(({ definition }) => {
  if (definition.category !== "felony" || definition.jurisdiction !== "FL") throw Error("Unexpected Florida robbery classification");
  return {...definition, category: "felony"};
});
export const FLORIDA_ROBBERY_BATCH = projectEvidenceBackedChargeBatch(FLORIDA_ROBBERY_DEFINITIONS);
export const FLORIDA_ROBBERY_IDS = new Set(rows.map(row => row.id));
