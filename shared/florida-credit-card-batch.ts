import rows from "./florida-credit-card-publication.json";
import { projectEvidenceBackedChargeBatch, type EvidenceBackedChargeDefinition } from "./evidence-backed-charge-batch";
export const FLORIDA_CREDIT_CARD_DEFINITIONS: EvidenceBackedChargeDefinition[] = rows.map(({ definition }) => {
  if ((definition.category !== "felony" && definition.category !== "misdemeanor") || definition.jurisdiction !== "FL") throw Error("Unexpected Florida credit-card classification");
  const categories = definition.categories?.map(tier => {
    if (tier !== "misdemeanor" && tier !== "felony") throw Error("Invalid Florida credit-card exposure");
    return tier;
  });
  if (categories && categories[0] !== definition.category) throw Error("Invalid ordinary credit-card grade");
  return {...definition, category: definition.category, ...(categories ? {categories} : {categories:undefined})};
});
export const FLORIDA_CREDIT_CARD_BATCH = projectEvidenceBackedChargeBatch(FLORIDA_CREDIT_CARD_DEFINITIONS);
export const FLORIDA_CREDIT_CARD_IDS = new Set(rows.map(row => row.id));
