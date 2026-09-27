import fs from "node:fs";
import { fileURLToPath } from "node:url";
import corrections from "../../../shared/california-batch-four-corrections.json";
import baseline from "../output/california-batch-four-baseline.json";
import evidence from "../output/california-batch-four-review.json";
import expansion from "../output/california-catalog-source-expansion.json";
import { readCaliforniaReview } from "./review";
import { readCaliforniaReuseReview } from "./reuse-review";
import { readCaliforniaCombinedReview, validateCaliforniaCombinedReview } from "./combined-review";
import { validateSupplementalCaliforniaReview } from "./supplemental-review";
export function readCaliforniaAgeDrivingReview() { return structuredClone(evidence); }
function retained() { return { ...readCaliforniaReview().documents, ...readCaliforniaReuseReview().documents, ...readCaliforniaCombinedReview().documents, ...expansion.documents }; }
export function validateCaliforniaAgeDrivingReview(review = readCaliforniaAgeDrivingReview()) {
  validateCaliforniaCombinedReview();
  return validateSupplementalCaliforniaReview({ review, baseline, corrections, retained: retained(), archiveSha256: readCaliforniaReview().archive.sha256, sourceAsOf: "2026-09-24", expectedCount: 11 });
}
export function renderCaliforniaAgeDrivingReview(review = readCaliforniaAgeDrivingReview()) {
  validateCaliforniaAgeDrivingReview(review);
  const docs = { ...retained(), ...review.documents } as ReturnType<typeof readCaliforniaReview>["documents"];
  return ["# California age and driving review: 11 records", "", "Five shared source groups: age-based unlawful intercourse, intoxication-related vehicular manslaughter, sexual battery, lewd acts, and sexual penetration. Reuses all primary text; four newly extracted supporting sections. This is a bounded statutory pass, not full legal certification or statewide completeness.", "", "Source snapshot: September 24, 2026. Translations remain drafts for professional review. Civil sanctions are separate from criminal penalties; base terms are not total sentence predictions.", "", ...review.records.flatMap(row => { const c = corrections.find(c => c.id === row.id)!; return [
    `## ${row.id}`, "", c.summary.en, "", c.penalty.en, "", ...row.sources.map(s => `- [${s.key}](${docs[s.key][0].sourceUrl})`), "", `Remaining work: ${row.remainingWork}`, "",
  ]; })].join("\n");
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  fs.writeFileSync(new URL("../output/california-batch-four-review.md", import.meta.url), renderCaliforniaAgeDrivingReview());
  console.log(JSON.stringify(validateCaliforniaAgeDrivingReview()));
}
