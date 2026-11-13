import rows from "./florida-crash-flight-publication.json";
import { projectEvidenceBackedChargeBatch, type EvidenceBackedChargeDefinition } from "./evidence-backed-charge-batch";
export const FLORIDA_CRASH_FLIGHT_DEFINITIONS: EvidenceBackedChargeDefinition[] = rows.map(({ definition }) => {
  if (definition.category !== "felony" || definition.jurisdiction !== "FL") throw Error("Unexpected Florida crash/flight classification");
  return {...definition, category: "felony"};
});
export const FLORIDA_CRASH_FLIGHT_BATCH = projectEvidenceBackedChargeBatch(FLORIDA_CRASH_FLIGHT_DEFINITIONS);
export const FLORIDA_CRASH_FLIGHT_IDS = new Set(rows.map(row => row.id));
