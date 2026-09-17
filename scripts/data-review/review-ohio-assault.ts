/**
 * Evidence ledger, not an activation command. Felonious-assault acquisition
 * does not imply the conduct branches or sentencing specifications are closed.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS } from "../../server/data/ohio-chapter-2903-source";

interface Document { section: string; title: string; text: string; contentHash: string; sourceUrl: string; effectiveDateStart: string }
const documents: Document[] = JSON.parse(readFileSync(
  "scripts/data-review/output/ohio-assault-support-evidence.json", "utf8")).documents;
const rows = ["2903.11", "2903.12"].map(section => {
  const document = documents.find(row => row.section === section);
  if (!document || createHash("sha256").update(document.text).digest("hex") !== document.contentHash) {
    throw new Error(`Invalid acquisition evidence: ${section}`);
  }
  const configured = OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS.find(row => row.offense.section === section);
  return {
    section, title: document.title, sourceUrl: document.sourceUrl,
    effectiveDate: document.effectiveDateStart, sourceHash: document.contentHash,
    status: configured ? "source_first_configured_requires_runtime_check" : "withheld_from_source_first_publication",
    configuredId: configured?.chargeId ?? null,
    // Preserve every operative paragraph, not merely the title or guilt clause.
    operativeEvidence: document.text.split("\n").filter(line => line.startsWith("(")).map(quote => {
      const start = document.text.indexOf(quote);
      return { quote, start, end: start + quote.length, sourceHash: document.contentHash };
    }),
    nextChecks: configured ? [
      "Check live availability, provenance and currentness; section-level selection is not an allegation-specific sentencing calculator.",
    ] : [
      "Reconcile division (A) harm/weapon paths and division (B) separately; do not reduce the entire section to assault with a weapon.",
      "Preserve the modified sexual-conduct definition in (E)(4), rather than importing § 2907.01 without the local exception.",
      "Resolve first/second-degree grading, protected-victim serious-harm rule and offense-date-dependent indefinite terms.",
      "Resolve §§ 2941.1423, 2941.1425 and 2941.1426 prerequisites and their § 2929.14 sentencing interactions.",
      "Resolve division (D)(4)'s motor-vehicle weapon and class-two suspension conditions.",
      "Evaluate the designated-offense/specification framework in §§ 2971.01, 2941.147, 2941.148 and 2971.03.",
      "Keep legacy synthesized labels separate; using (E)(5) as another offense's definition cannot activate this section.",
    ],
  };
});
writeFileSync("scripts/data-review/output/ohio-assault-publication-review.json",
  JSON.stringify({ reportKind: "evidence_review_not_runtime_approval", rows }, null, 2) + "\n");
console.log(rows.map(({ section, status }) => ({ section, status })));