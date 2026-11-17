import rows from "./florida-fire-riot-publication.json";
import { projectEvidenceBackedChargeBatch, type EvidenceBackedChargeDefinition } from "./evidence-backed-charge-batch";
export const FLORIDA_FIRE_RIOT_DEFINITIONS: EvidenceBackedChargeDefinition[] = rows.map(({ definition }) => {
  if ((definition.category !== "felony" && definition.category !== "misdemeanor") || definition.jurisdiction !== "FL") throw Error("Unexpected Florida fire-riot classification");
  return {...definition, category: definition.category};
});
export const FLORIDA_FIRE_RIOT_BATCH = projectEvidenceBackedChargeBatch(FLORIDA_FIRE_RIOT_DEFINITIONS);
export const FLORIDA_FIRE_RIOT_IDS = new Set(rows.map(row => row.id));
