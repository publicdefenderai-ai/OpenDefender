import rows from "./florida-payment-fraud-publication.json";
import { projectEvidenceBackedChargeBatch, type EvidenceBackedChargeDefinition } from "./evidence-backed-charge-batch";
export const FLORIDA_PAYMENT_FRAUD_DEFINITIONS: EvidenceBackedChargeDefinition[] = rows.map(({ definition }) => {
  if ((definition.category !== "felony" && definition.category !== "misdemeanor") || definition.jurisdiction !== "FL") throw Error("Unexpected Florida payment-fraud classification");
  return {...definition, category: definition.category};
});
export const FLORIDA_PAYMENT_FRAUD_BATCH = projectEvidenceBackedChargeBatch(FLORIDA_PAYMENT_FRAUD_DEFINITIONS);
export const FLORIDA_PAYMENT_FRAUD_IDS = new Set(rows.map(row => row.id));
