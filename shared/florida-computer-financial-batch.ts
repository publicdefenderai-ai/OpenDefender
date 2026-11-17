import rows from "./florida-computer-financial-publication.json";
import { projectEvidenceBackedChargeBatch, type EvidenceBackedChargeDefinition } from "./evidence-backed-charge-batch";
export const FLORIDA_COMPUTER_FINANCIAL_DEFINITIONS: EvidenceBackedChargeDefinition[] = rows.map(({ definition }) => {
  if ((definition.category !== "felony" && definition.category !== "misdemeanor") || definition.jurisdiction !== "FL") throw Error("Unexpected Florida computer-financial classification");
  return {...definition, category: definition.category};
});
export const FLORIDA_COMPUTER_FINANCIAL_BATCH = projectEvidenceBackedChargeBatch(FLORIDA_COMPUTER_FINANCIAL_DEFINITIONS);
export const FLORIDA_COMPUTER_FINANCIAL_IDS = new Set(rows.map(row => row.id));
