import rows from "./florida-false-reports-publication.json";
import { projectEvidenceBackedChargeBatch, type EvidenceBackedChargeDefinition } from "./evidence-backed-charge-batch";
export const FLORIDA_FALSE_REPORTS_DEFINITIONS: EvidenceBackedChargeDefinition[] = rows.map(({ definition }) => {
  if ((definition.category !== "felony" && definition.category !== "misdemeanor") || definition.jurisdiction !== "FL") throw Error("Unexpected Florida false-reports classification");
  return {...definition, category: definition.category};
});
export const FLORIDA_FALSE_REPORTS_BATCH = projectEvidenceBackedChargeBatch(FLORIDA_FALSE_REPORTS_DEFINITIONS);
export const FLORIDA_FALSE_REPORTS_IDS = new Set(rows.map(row => row.id));
