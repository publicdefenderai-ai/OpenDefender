// Node and development use the catalog directly. The client production build
// replaces this module with its computed values (see vite.config.ts).
import { criminalCharges } from "./criminal-charges";
import { chargeExplanations } from "./charge-explanations";

const chargeTiers = { felony: 0, misdemeanor: 0, infraction: 0 };
const jurisdictions = new Set<string>();
for (const charge of criminalCharges) {
  chargeTiers[charge.category]++;
  jurisdictions.add(charge.jurisdiction);
}

export const catalogCounts = {
  charges: criminalCharges.length,
  chargeTiers,
  chargeJurisdictions: jurisdictions.size,
  chargeExplanations: chargeExplanations.length,
  chargeExplanationsWithSources: chargeExplanations.filter(entry => entry.sources?.length).length,
};
