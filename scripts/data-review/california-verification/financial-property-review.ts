import fs from "node:fs";
import { fileURLToPath } from "node:url";
import corrections from "../../../shared/california-batch-five-corrections.json";
import baseline from "../output/california-batch-five-baseline.json";
import evidence from "../output/california-batch-five-review.json";
import expansion from "../output/california-catalog-source-expansion.json";
import { readCaliforniaReview } from "./review";
import { readCaliforniaReuseReview } from "./reuse-review";
import { readCaliforniaCombinedReview } from "./combined-review";
import { validateSupplementalCaliforniaReview } from "./supplemental-review";
import { readCaliforniaAgeDrivingReview, validateCaliforniaAgeDrivingReview } from "./age-driving-review";
export function readCaliforniaFinancialPropertyReview() { return structuredClone(evidence); }
function retained() { return { ...readCaliforniaReview().documents, ...readCaliforniaReuseReview().documents, ...readCaliforniaCombinedReview().documents, ...expansion.documents, ...readCaliforniaAgeDrivingReview().documents }; }
export function validateCaliforniaFinancialPropertyReview(review = readCaliforniaFinancialPropertyReview()) {
  validateCaliforniaAgeDrivingReview();
  return validateSupplementalCaliforniaReview({ review, baseline, corrections, retained: retained(), archiveSha256: readCaliforniaReview().archive.sha256, sourceAsOf: "2026-09-24", expectedCount: 11 });
}
export function renderCaliforniaFinancialPropertyReview(review = readCaliforniaFinancialPropertyReview()) {
  validateCaliforniaFinancialPropertyReview(review);
  const docs = { ...retained(), ...review.documents } as ReturnType<typeof readCaliforniaReview>["documents"];
  return ["# California financial and property review: 11 records", "", "Eight shared source groups: computer crimes, identity theft, insurance fraud, money laundering, forgery, bad checks, access-card theft, and embezzlement. Reuses all primary text; seven newly extracted supporting sections. This is a bounded statutory pass, not full legal certification or statewide completeness.", "", "Source snapshot: September 24, 2026. Translations remain drafts for professional review. Base terms are not total sentence predictions. Low-value rules are tied to their specific instruments, aggregation periods, and prior-conviction exceptions.", "", ...review.records.flatMap(row => { const c = corrections.find(c => c.id === row.id)!; return [
    `## ${row.id}`, "", c.summary.en, "", c.penalty.en, "", ...row.sources.map(s => `- [${s.key}](${docs[s.key][0].sourceUrl})`), "", `Remaining work: ${row.remainingWork}`, "",
  ]; })].join("\n");
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  fs.writeFileSync(new URL("../output/california-batch-five-review.md", import.meta.url), renderCaliforniaFinancialPropertyReview());
  console.log(JSON.stringify(validateCaliforniaFinancialPropertyReview()));
}
