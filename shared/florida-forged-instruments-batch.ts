import rows from "./florida-forged-instruments-publication.json";
import { projectEvidenceBackedChargeBatch, type EvidenceBackedChargeDefinition } from "./evidence-backed-charge-batch";
export const FLORIDA_FORGED_INSTRUMENTS_DEFINITIONS: EvidenceBackedChargeDefinition[] = rows.map(({ definition }) => {
  if ((definition.category !== "felony" && definition.category !== "misdemeanor") || definition.jurisdiction !== "FL") throw Error("Unexpected Florida forged-instruments classification");
  return {...definition, category: definition.category};
});
export const FLORIDA_FORGED_INSTRUMENTS_BATCH = projectEvidenceBackedChargeBatch(FLORIDA_FORGED_INSTRUMENTS_DEFINITIONS);
export const FLORIDA_FORGED_INSTRUMENTS_IDS = new Set(rows.map(row => row.id));
