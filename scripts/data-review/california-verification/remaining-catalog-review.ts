import fs from "node:fs";
import { fileURLToPath } from "node:url";
import corrections from "../../../shared/california-batch-six-corrections.json";
import baseline from "../output/california-batch-six-baseline.json";
import evidence from "../output/california-batch-six-review.json";
import expansion from "../output/california-catalog-source-expansion.json";
import { readCaliforniaReview } from "./review";
import { readCaliforniaReuseReview } from "./reuse-review";
import { readCaliforniaCombinedReview } from "./combined-review";
import { validateSupplementalCaliforniaReview } from "./supplemental-review";
import { readCaliforniaAgeDrivingReview } from "./age-driving-review";
import { readCaliforniaFinancialPropertyReview, validateCaliforniaFinancialPropertyReview } from "./financial-property-review";
export function readCaliforniaRemainingCatalogReview() { return structuredClone(evidence); }
function retained() { return { ...readCaliforniaReview().documents, ...readCaliforniaReuseReview().documents, ...readCaliforniaCombinedReview().documents, ...expansion.documents, ...readCaliforniaAgeDrivingReview().documents, ...readCaliforniaFinancialPropertyReview().documents }; }
export function validateCaliforniaRemainingCatalogReview(review = readCaliforniaRemainingCatalogReview()) {
  validateCaliforniaFinancialPropertyReview();
  return validateSupplementalCaliforniaReview({ review, baseline, corrections, retained: retained(), archiveSha256: readCaliforniaReview().archive.sha256, sourceAsOf: "2026-09-24", expectedCount: 28 });
}
export function renderCaliforniaRemainingCatalogReview(review = readCaliforniaRemainingCatalogReview()) {
  validateCaliforniaRemainingCatalogReview(review);
  const docs = { ...retained(), ...review.documents } as ReturnType<typeof readCaliforniaReview>["documents"];
  return ["# California remaining catalog review: 28 records", "", "Combined public-order, process/liability, firearm, drug, regulatory, and traffic review. Reuses all 25 primary sections. This is a bounded statutory pass, not full legal certification or statewide completeness.", "", "Source snapshot: September 24, 2026. Translations remain drafts for professional review. Base terms are not total sentence predictions. Three targeted unresolved legal questions are documented in docs/california-remaining-attorney-questions.md. VEH 40610 has two retained versions; only their explicitly bound shared registration-correction passages support this batch.", "", ...review.records.flatMap(row => { const c = corrections.find(c => c.id === row.id)!; return [
    `## ${row.id}`, "", c.summary.en, "", c.penalty.en, "", ...row.sources.map(s => `- [${s.key}](${docs[s.key][0].sourceUrl})`), "", `Remaining work: ${row.remainingWork}`, "",
  ]; })].join("\n");
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  fs.writeFileSync(new URL("../output/california-batch-six-review.md", import.meta.url), renderCaliforniaRemainingCatalogReview());
  console.log(JSON.stringify(validateCaliforniaRemainingCatalogReview()));
}
