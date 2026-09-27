/** Evidence and release accounting for new identities, separate from historical corrections. */
import fs from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import additions from "../../../shared/california-person-property-additions.json";
import reviewData from "../output/california-person-property-review.json";
import acquisitionData from "../output/california-person-property-acquisition.json";
import { CALIFORNIA_CANONICAL_RECORDS, getCaliforniaCanonicalRecord } from "../../../shared/california-authority";
import { type SupplementalSource } from "./supplemental-review";

const hash = (value: string) => createHash("sha256").update(value).digest("hex");
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
export function readCaliforniaPersonPropertyReview() { return structuredClone(reviewData); }
export function readCaliforniaPersonPropertyAcquisition() { return structuredClone(acquisitionData); }
export function personPropertyDocuments(acquisition = readCaliforniaPersonPropertyAcquisition()): Record<string, SupplementalSource[]> {
  const documents: Record<string, SupplementalSource[]> = {};
  for (const name of ["one", "two", "three", "four", "five", "six", "expansion"]) {
    const file = name === "expansion" ? "california-catalog-source-expansion.json" : `california-batch-${name}-review.json`;
    const retained = JSON.parse(fs.readFileSync(new URL(`../output/${file}`, import.meta.url), "utf8")).documents;
    for (const [key, versions] of Object.entries(retained)) {
      if (documents[key] && !same(documents[key], versions)) throw new Error("Conflicting retained evidence");
      documents[key] = versions as SupplementalSource[];
    }
  }
  for (const [key, versions] of Object.entries(acquisition.documents)) {
    if (documents[key]) throw new Error("New evidence shadows retained source");
    documents[key] = versions;
  }
  return documents;
}
function sourceText(xml: string) {
  return xml.replace(/<[^>]*>/g, " ").replace(/&#(x[\da-f]+|\d+);|&(amp|lt|gt|quot|apos);/gi, (_, num, named) => num
    ? String.fromCodePoint(parseInt(num[0].toLowerCase() === "x" ? num.slice(1) : num, num[0].toLowerCase() === "x" ? 16 : 10))
    : ({ amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" }[named.toLowerCase()]!)).replace(/\s+/g, " ").trim();
}
export function validateCaliforniaPersonPropertyReview(review = readCaliforniaPersonPropertyReview(), acquisition = readCaliforniaPersonPropertyAcquisition()) {
  const discovery = JSON.parse(fs.readFileSync(new URL("../output/california-statewide/summary.json", import.meta.url), "utf8"));
  const batchBytes = fs.readFileSync(new URL("../output/california-statewide/review-batches.json", import.meta.url), "utf8");
  const batches = JSON.parse(batchBytes) as Array<{id: string; sectionKeys: string[]}>;
  const expectedKeys = [...new Set(batches.filter(b => acquisition.batchIds.includes(b.id)).flatMap(b => b.sectionKeys))].sort();
  if (review.schemaVersion !== 1 || review.scope !== "bounded_person_property_additions_not_statewide_certification" ||
      review.sourceAsOf !== "2026-09-24" || review.archiveSha256 !== discovery.archive.sha256 ||
      acquisition.archive.sha256 !== review.archiveSha256 || acquisition.batchManifestSha256 !== hash(batchBytes) ||
      review.acquisitionSha256 !== hash(JSON.stringify(acquisition, null, 2) + "\n")) throw new Error("Person/property provenance changed");
  if (expectedKeys.length !== 142 || !same(acquisition.candidateKeys, expectedKeys) ||
      !same(review.sections.map(r => r.key), expectedKeys) || new Set(review.sections.map(r => r.key)).size !== 142) throw new Error("Person/property section accounting changed");
  const documents = personPropertyDocuments(acquisition);
  const required = new Set([...expectedKeys, ...additions.flatMap(a => a.supportingKeys)]);
  if (!same([...acquisition.reusedKeys, ...Object.keys(acquisition.documents)].sort(), [...required].sort())) throw new Error("Incomplete source acquisition accounting");
  for (const key of required) {
    const versions = documents[key];
    if (!versions?.length || new Set(versions.map(v => v.versionId)).size !== versions.length) throw new Error("Missing or duplicate source version");
    for (const v of versions) {
      const url = new URL(v.sourceUrl);
      if (`${v.lawCode}:${v.section.replace(/\.$/, "")}` !== key || hash(v.contentXml) !== v.contentSha256 ||
          url.hostname !== "leginfo.legislature.ca.gov" || `${url.searchParams.get("lawCode")}:${url.searchParams.get("sectionNum")?.replace(/\.$/, "")}` !== key) throw new Error("Person/property source changed");
    }
  }
  const bindings = (key: string) => documents[key]?.map(v => ({ versionId: v.versionId, contentSha256: v.contentSha256 }));
  const allowed = new Set(["addition_branches_reviewed_other_branches_open", "deferred_low_priority_infraction", "supporting_or_procedural_provision", "existing_catalog_source_other_branches_open", "substantive_research_open"]);
  for (const section of review.sections) {
    if (!allowed.has(section.status) || !section.reason.trim() || !same(section.versions, bindings(section.key))) throw new Error("Unbound section disposition");
    const ids = additions.filter(a => `PEN:${a.code.match(/^\d+(?:\.\d+)*[a-z]?/)![0]}` === section.key).map(a => a.id);
    if (!same(section.additionIds, ids) || (ids.length > 0 && section.status !== "addition_branches_reviewed_other_branches_open")) throw new Error("Addition section accounting changed");
  }
  const expectedIds = additions.map(a => a.id).sort();
  if (expectedIds.length !== 26 || new Set(expectedIds).size !== 26 || !same(review.records.map(r => r.id).sort(), expectedIds)) throw new Error("Person/property addition accounting changed");
  for (const row of review.records) {
    const addition = additions.find(a => a.id === row.id)!;
    const canonical = getCaliforniaCanonicalRecord(row.id);
    const primary = `PEN:${addition.code.match(/^\d+(?:\.\d+)*[a-z]?/)![0]}`;
    const expectedSources = [...new Set([primary, ...addition.supportingKeys])].sort();
    if (row.status !== "bounded_statutory_addition_proposed" || row.sourceAsOf !== review.sourceAsOf || hash(JSON.stringify(addition)) !== row.definitionSha256 || !row.remainingWork) throw new Error("Reviewed addition changed");
    if (!same(Object.keys(addition.sourceEffectiveDates).sort(), expectedSources)) throw new Error("Incomplete source date accounting");
    if (!same(row.sources.map(s => s.key), expectedSources)) throw new Error("Addition dependencies incomplete");
    for (const source of row.sources) {
      const versions = documents[source.key];
      if ((addition.sourceEffectiveDates as Record<string, string | null | undefined>)[source.key] !== (versions[0].effectiveDate?.slice(0,10) ?? null)) throw new Error("Source effective date changed");
      if (versions.length !== 1 || versions.some(v => v.effectiveDate && v.effectiveDate.slice(0,10) > review.sourceAsOf) || !same(source.versions, bindings(source.key))) throw new Error("Unresolved addition source version");
    }
    const e = row.primaryEvidence;
    if (e.key !== primary || !e.text || e.start < 0 || e.end <= e.start || sourceText(documents[primary][0].contentXml).slice(e.start, e.end) !== e.text) throw new Error("Unbound primary evidence span");
    if (!canonical?.selectable || canonical.code !== addition.code || canonical.penalty !== addition.penalty || !same(canonical.categories, addition.categories)) throw new Error("Addition catalog drift");
    const runtimeKeys = canonical.sources.map(s => {
      const u = new URL(s.url); const key = `${u.searchParams.get("lawCode")}:${u.searchParams.get("sectionNum")}`;
      if (s.effectiveDate !== (documents[key]?.[0]?.effectiveDate?.slice(0,10) ?? null)) throw new Error("Runtime source date drift");
      return key;
    });
    if (!same(runtimeKeys.sort(), expectedSources)) throw new Error("Addition runtime dependencies incomplete");
    if (CALIFORNIA_CANONICAL_RECORDS.some(r => r.selectable && r.canonicalId !== row.id && r.lawCode === "PEN" && r.code === addition.code)) throw new Error("Duplicate exact charging identity");
  }
  if (review.deferrals.length !== 1 || review.deferrals[0].key !== "PEN:243.83" || !review.deferrals[0].severityEvidence || !review.deferrals[0].revisitCondition ||
      review.sections.find(s => s.key === "PEN:243.83")?.status !== "deferred_low_priority_infraction") throw new Error("Unexplained publication deferral");
  return { additions: additions.length, candidateSections: expectedKeys.length, reusedSections: acquisition.reusedKeys.length, newSections: Object.keys(acquisition.documents).length,
    configuredSelectable: CALIFORNIA_CANONICAL_RECORDS.filter(r => r.selectable).length,
    dispositions: review.sections.reduce<Record<string, number>>((out, r) => { out[r.status] = (out[r.status] ?? 0) + 1; return out; }, {}) };
}
export function renderCaliforniaPersonPropertyReview() {
  const summary = validateCaliforniaPersonPropertyReview();
  return ["# California person/property expansion", "", `Proposed additions: ${summary.additions}. Configured selectable after merge: ${summary.configuredSelectable} (previously 99). Source acquisition remains September 24, 2026. No production seed or deployment is certified.`, "",
    `The four-group batch accounts for ${summary.candidateSections} sections. Reuses ${summary.reusedSections} retained sections and acquires ${summary.newSections} additional sections for the batch and dependencies. Accounting is not full substantive verification of all 142 sections.`, "",
    "## Proposed exact identities", "", "English text is used as an intentional fallback in all locales until translations are reviewed. Penalties are adult base terms, not total sentence predictions. Attorney review remains pending. Use the primary source and dependency list together.", "",
    ...additions.flatMap(a => [`### ${a.title}: §${a.code}`, "", a.summary, "", `Mental state: ${a.mentalState}`, "", a.penalty, "", `Dependencies: ${a.supportingKeys.join(", ")}.`, "", `[Official primary section](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=${a.code.match(/^\d+(?:\.\d+)*[a-z]?/)![0]}.)`, ""]),
    "## Complete section accounting", "", "Rows with existing or new entries do not claim every subdivision is covered. Open research is engineering work, not a request for attorney data entry.", "", "| Section | Disposition | Reason |", "| --- | --- | --- |",
    ...reviewData.sections.map(r => `| ${r.key} | ${r.status.replaceAll("_", " ")} | ${r.reason} |`), "",
    "## Next combined work", "", "Finish the remaining forgery/theft identities and shared value-based grading, while independently checking omitted sections against official charging/instruction inventories. Existing sources and unresolved research remain reusable; the 142-section queue is not marked complete. The three earlier attorney questions remain open in docs/california-remaining-attorney-questions.md.", ""].join("\n");
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  fs.writeFileSync(new URL("../output/california-person-property-review.md", import.meta.url), renderCaliforniaPersonPropertyReview());
  console.log(JSON.stringify(validateCaliforniaPersonPropertyReview()));
}
