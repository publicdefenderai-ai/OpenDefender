import rows from "./florida-road-racing-publication.json";
import { projectEvidenceBackedChargeBatch, type EvidenceBackedChargeDefinition } from "./evidence-backed-charge-batch";
export const FLORIDA_ROAD_RACING_DEFINITIONS: EvidenceBackedChargeDefinition[] = rows.map(({ definition }) => {
  if ((definition.category !== "felony" && definition.category !== "misdemeanor") || definition.jurisdiction !== "FL") throw Error("Unexpected Florida road-racing classification");
  return {...definition, category: definition.category};
});
export const FLORIDA_ROAD_RACING_BATCH = projectEvidenceBackedChargeBatch(FLORIDA_ROAD_RACING_DEFINITIONS);
export const FLORIDA_ROAD_RACING_IDS = new Set(rows.map(row => row.id));
