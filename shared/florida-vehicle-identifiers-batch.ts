import rows from "./florida-vehicle-identifiers-publication.json";
import { projectEvidenceBackedChargeBatch, type EvidenceBackedChargeDefinition } from "./evidence-backed-charge-batch";
export const FLORIDA_VEHICLE_IDENTIFIERS_DEFINITIONS: EvidenceBackedChargeDefinition[] = rows.map(({ definition }) => {
  if ((definition.category !== "felony" && definition.category !== "misdemeanor") || definition.jurisdiction !== "FL") throw Error("Unexpected Florida vehicle-identifiers classification");
  return {...definition, category: definition.category};
});
export const FLORIDA_VEHICLE_IDENTIFIERS_BATCH = projectEvidenceBackedChargeBatch(FLORIDA_VEHICLE_IDENTIFIERS_DEFINITIONS);
export const FLORIDA_VEHICLE_IDENTIFIERS_IDS = new Set(rows.map(row => row.id));
