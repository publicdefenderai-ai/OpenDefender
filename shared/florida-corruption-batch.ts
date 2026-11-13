import rows from "./florida-corruption-publication.json";
import { projectEvidenceBackedChargeBatch, type EvidenceBackedChargeDefinition } from "./evidence-backed-charge-batch";
export const FLORIDA_CORRUPTION_DEFINITIONS: EvidenceBackedChargeDefinition[] = rows.map(({ definition }) => {
  if ((definition.category !== "felony" && definition.category !== "misdemeanor") || definition.jurisdiction !== "FL") throw Error("Unexpected Florida corruption classification");
  return {...definition, category: definition.category};
});
export const FLORIDA_CORRUPTION_BATCH = projectEvidenceBackedChargeBatch(FLORIDA_CORRUPTION_DEFINITIONS);
export const FLORIDA_CORRUPTION_IDS = new Set(rows.map(row => row.id));
