/** One validated classification pass supplies all three dependent research reports. */
import { classifyOhioOffenses, writeOhioInventory } from "./classify-ohio-offenses";
import { reconcileOhioCatalog, writeOhioReconciliation } from "./reconcile-ohio-catalog";
import { investigateOhioDiscovery, writeOhioInvestigation } from "./investigate-ohio-discovery";

const started = Date.now();
const classified = classifyOhioOffenses();
writeOhioInventory(classified);
writeOhioReconciliation(reconcileOhioCatalog());
writeOhioInvestigation(investigateOhioDiscovery(process.cwd(), classified));
console.log(`Ohio discovery reports refreshed in ${Math.round((Date.now() - started) / 1000)} seconds; one classification pass, no network requests.`);
