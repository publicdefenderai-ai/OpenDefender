import rows from "./florida-court-officials-publication.json";
import { projectEvidenceBackedChargeBatch, type EvidenceBackedChargeDefinition } from "./evidence-backed-charge-batch";
export const FLORIDA_COURT_OFFICIALS_DEFINITIONS: EvidenceBackedChargeDefinition[] = rows.map(({ definition }) => {
  if ((definition.category !== "felony" && definition.category !== "misdemeanor") || definition.jurisdiction !== "FL") throw Error("Unexpected Florida court-officials classification");
  return {...definition, category: definition.category};
});
export const FLORIDA_COURT_OFFICIALS_BATCH = projectEvidenceBackedChargeBatch(FLORIDA_COURT_OFFICIALS_DEFINITIONS);
export const FLORIDA_COURT_OFFICIALS_IDS = new Set(rows.map(row => row.id));
