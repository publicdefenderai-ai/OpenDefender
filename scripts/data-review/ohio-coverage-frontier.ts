/** Research accounting only. Section/name overlap never establishes full conduct coverage. */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { OHIO_REVIEWED_DEFINITIONS } from "../../shared/ohio-reviewed-batch";
import eligibility from "../../shared/ohio-reviewed-eligibility.json";
import holds from "../../shared/ohio-source-change-holds.json";
import { OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS } from "../../server/data/ohio-chapter-2903-source";
import type { OhioClassifiedSection } from "./classify-ohio-offenses";

export type KnownIdentity = { id: string; section: string; name: string; status: "configured" | "held" };
export const normalizedIdentity = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
export function reconcileOhioDiscovery(sections: OhioClassifiedSection[], known: KnownIdentity[]) {
  if (new Set(sections.map(r => r.section)).size !== sections.length || new Set(known.map(r => r.id)).size !== known.length) {
    throw new Error("Duplicate Ohio section or reviewed record identity");
  }
  return sections.map(section => {
    const linked = known.filter(r => r.section === section.section);
    const names = section.offences.map(offense => {
      const matches = linked.filter(r => normalizedIdentity(r.name) === normalizedIdentity(offense.name));
      return { name: offense.name, divisions: offense.divisions, guiltClause: offense.guiltClause,
        identityMatches: matches.map(r => ({ id: r.id, status: r.status })),
        disposition: matches.some(r => r.status === "configured") ? "identity_match_requires_branch_audit"
          : matches.length ? "existing_hold_preserved" : "unmatched_discovery_name_not_verified_offense" };
    });
    return { section: section.section, chapter: section.chapter, sourceUrl: section.sourceUrl,
      sourceHash: section.contentHash, effectiveDate: section.effectiveDate, sourceStatus: section.sourceStatus,
      classification: section.classification, catchline: section.catchline,
      reviewedRecords: linked, names,
      disposition: linked.length ? "section_overlap_not_full_coverage" : "no_reviewed_identity_at_section" };
  });
}
export function buildOhioCoverageFrontier() {
  const inputPath = "scripts/data-review/output/ohio-offense-inventory.json";
  const bytes = readFileSync(inputPath, "utf8");
  const inventory = JSON.parse(bytes);
  const known: KnownIdentity[] = [
    ...OHIO_REVIEWED_DEFINITIONS.map(r => ({ id: r.id, section: r.code, name: r.name,
      status: eligibility.decisions.find(d => d.id === r.id)?.status === "eligible" && !holds.some(h => h.id === r.id)
        ? "configured" as const : "held" as const })),
    ...OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS.map(r => ({ id: r.chargeId, section: r.offense.section,
      name: r.canonicalTitle, status: "configured" as const })),
  ];
  const rows = reconcileOhioDiscovery(inventory.sections, known);
  const nextBatch = rows.filter(r => ["2905", "2909", "2911"].includes(r.chapter) && !r.reviewedRecords.length);
  const named = rows.flatMap(r => r.names);
  return { schemaVersion: 1, kind: "ohio_discovery_to_reviewed_identity_frontier",
    publicationStatus: "research_only_no_eligibility_or_receipt_changes",
    discoveryGeneratedAt: inventory.generatedAt,
    discoverySha256: createHash("sha256").update(bytes).digest("hex"),
    reviewedIdentitySha256: createHash("sha256").update(JSON.stringify(known)).digest("hex"),
    counts: { enumeratedSections: inventory.totals.sections, candidateSections: rows.length,
      sectionsWithoutRecognizedOffenseSignal: inventory.totals.supporting,
      namedCandidates: named.length,
      configuredNameMatches: named.filter(r => r.disposition === "identity_match_requires_branch_audit").length,
      heldNameMatches: named.filter(r => r.disposition === "existing_hold_preserved").length,
      unmatchedNames: named.filter(r => r.disposition === "unmatched_discovery_name_not_verified_offense").length,
      sectionOverlaps: rows.filter(r => r.reviewedRecords.length).length,
      nextBatchSections: nextBatch.length },
    nextBatch: { chapters: ["2905", "2909", "2911"], sections: nextBatch.map(r => r.section),
      purpose: "Retain primary evidence for unreviewed person-restraint, property-damage and property-entry sections together; assess each offense separately before publication." },
    limits: ["The September discovery snapshot is not a current statewide census.",
      "Extracted names may include false positives; unmatched names are not a count of missing crimes.",
      "Identity matches do not establish that all subdivisions, penalties or conduct branches are covered.",
      "Supporting classification means no recognized signal, not verified noncriminal status.",
      "Existing holds and prior decisions are preserved; no new attorney review assignment is created."], rows };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const output = "scripts/data-review/output/ohio-coverage-frontier.json";
  const rendered = JSON.stringify(buildOhioCoverageFrontier(), null, 2) + "\n";
  if (process.argv.includes("--check")) {
    if (readFileSync(output, "utf8") !== rendered) throw new Error("Ohio frontier differs; intentionally regenerate after catalog changes");
  } else writeFileSync(output, rendered);
  console.log(JSON.stringify(JSON.parse(rendered).counts));
}
