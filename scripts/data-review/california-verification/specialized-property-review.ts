/** A source-reuse successor: explicit gaps never become silent publication approval. */
import fs from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import additions from "../../../shared/california-specialized-property-additions.json";
import reviewData from "../output/california-specialized-property-review.json";
import { CALIFORNIA_CANONICAL_RECORDS, getCaliforniaCanonicalRecord } from "../../../shared/california-authority";
import { californiaPrimaryIdentity } from "../../../shared/california-law-codes";
import { personPropertyDocuments, sourceText } from "./person-property-review";
import { readCaliforniaForgeryTheftAcquisition } from "./forgery-theft-review";
import { readCaliforniaProtectedPersonReview, readCaliforniaProtectedPersonAcquisition } from "./protected-person-review";

const hash = (value: string) => createHash("sha256").update(value).digest("hex");
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const primary = (a: {lawCode: string; code: string}) => californiaPrimaryIdentity(a.lawCode, a.code).key;
export const readCaliforniaSpecializedPropertyReview = () => structuredClone(reviewData);
export function specializedPropertyDocuments() {
  const docs = personPropertyDocuments();
  for (const acquisition of [readCaliforniaForgeryTheftAcquisition(), readCaliforniaProtectedPersonAcquisition()]) {
    for (const [key, versions] of Object.entries(acquisition.documents)) {
      if (docs[key]) throw new Error("Source reuse shadows retained evidence");
      docs[key] = versions;
    }
  }
  return docs;
}
export function validateCaliforniaSpecializedPropertyReview(review = readCaliforniaSpecializedPropertyReview(), definitions = additions, docs = specializedPropertyDocuments()) {
  const previous = readCaliforniaProtectedPersonReview();
  const expectedKeys = previous.sections.filter(s => s.status === "substantive_research_open").map(s => s.key);
  if (review.schemaVersion !== 1 || review.scope !== "bounded_specialized_property_additions_not_statewide_certification" || review.newSources !== 0 ||
      review.sourceAsOf !== previous.sourceAsOf || review.archiveSha256 !== previous.archiveSha256 ||
      review.previousReviewSha256 !== hash(fs.readFileSync(new URL("../output/california-protected-person-review.json", import.meta.url), "utf8"))) throw new Error("Specialized-property provenance changed");
  if (expectedKeys.length !== 40 || !same(review.sections.map(s => s.key), expectedKeys)) throw new Error("Successor queue accounting changed");
  const required = [...new Set([...expectedKeys, ...definitions.flatMap(a => a.supportingKeys)])].sort();
  for (const key of required) {
    const versions = docs[key];
    if (!versions?.length || new Set(versions.map(v => v.versionId)).size !== versions.length) throw new Error("Missing or duplicate source version");
    for (const v of versions) {
      const url = new URL(v.sourceUrl);
      if (`${v.lawCode}:${v.section.replace(/\.$/, "")}` !== key || hash(v.contentXml) !== v.contentSha256 || url.protocol !== "https:" ||
          url.hostname !== "leginfo.legislature.ca.gov" || `${url.searchParams.get("lawCode")}:${url.searchParams.get("sectionNum")?.replace(/\.$/, "")}` !== key) throw new Error("Unbound source identity or content");
    }
  }
  const bindings = (key: string) => docs[key]?.map(v => ({ versionId: v.versionId, contentSha256: v.contentSha256 }));
  const verifySpan = (e: {key: string; start: number; end: number; text: string}, key: string) => {
    if (e.key !== key || !e.text || e.start < 0 || e.end <= e.start || sourceText(docs[key][0].contentXml).slice(e.start, e.end) !== e.text) throw new Error("Unbound evidence span");
  };
  const ids = definitions.map(a => a.id).sort();
  if (ids.length !== 17 || new Set(ids).size !== ids.length || !same(review.records.map(r => r.id).sort(), ids)) throw new Error("Addition accounting changed");
  const support = new Set(["PEN:490.5", "PEN:497", "PEN:499", "PEN:502.9"]);
  for (const section of review.sections) {
    const assigned = definitions.filter(a => primary(a) === section.key).map(a => a.id);
    const status = assigned.length ? "addition_branches_reviewed_other_branches_open" : support.has(section.key) ? "supporting_or_procedural_provision" : section.key === "PEN:490.7" ? "deferred_low_priority_offense" : "substantive_research_open";
    if (section.status !== status || !section.reason.trim() || !same(section.additionIds, assigned) || !same(section.versions, bindings(section.key))) throw new Error("Unbound section disposition");
    verifySpan(section.evidence, section.key);
  }
  for (const row of review.records) {
    const a = definitions.find(a => a.id === row.id)!;
    const key = primary(a);
    if (!expectedKeys.includes(key) || row.status !== "bounded_statutory_addition_proposed" || !row.remainingWork || a.sourceAsOf !== review.sourceAsOf ||
        a.translationStatus !== "english_only_pending_translation" || hash(JSON.stringify(a)) !== row.definitionSha256) throw new Error("Reviewed definition changed");
    const keys = [...new Set([key, ...a.supportingKeys])].sort();
    if (!same(Object.keys(a.sourceEffectiveDates).sort(), keys) || !same(row.sources.map(s => s.key), keys)) throw new Error("Incomplete source dependencies");
    for (const source of row.sources) {
      const versions = docs[source.key];
      if (versions?.length !== 1 || !same(source.versions, bindings(source.key)) || versions.some(v => v.effectiveDate && v.effectiveDate.slice(0,10) > review.sourceAsOf)) throw new Error("Unresolved source version");
      if ((a.sourceEffectiveDates as Record<string, string | null>)[source.key] !== (versions[0].effectiveDate?.slice(0,10) ?? null)) throw new Error("Source date changed");
    }
    verifySpan(row.primaryEvidence, key);
    const canonical = getCaliforniaCanonicalRecord(row.id);
    if (!canonical?.selectable || canonical.lawCode !== a.lawCode || canonical.code !== a.code || canonical.officialTitle !== a.title || canonical.penalty !== a.penalty || !same(canonical.categories, a.categories)) throw new Error("Addition catalog drift");
    const runtimeKeys = canonical.sources.map(s => {
      const u = new URL(s.url); const key = `${u.searchParams.get("lawCode")}:${u.searchParams.get("sectionNum")}`;
      if (s.effectiveDate !== (docs[key]?.[0]?.effectiveDate?.slice(0,10) ?? null)) throw new Error("Runtime source date drift");
      return key;
    });
    if (!same(runtimeKeys.sort(), keys)) throw new Error("Runtime dependencies incomplete");
    if (CALIFORNIA_CANONICAL_RECORDS.some(r => r.selectable && r.canonicalId !== a.id && r.lawCode === a.lawCode && r.code === a.code)) throw new Error("Duplicate charging identity");
  }
  const deferral = review.deferrals[0];
  if (review.deferrals.length !== 1 || deferral.key !== "PEN:490.7" || deferral.evidenceSectionKey !== deferral.key || !deferral.reviewer || !deferral.reviewedAt || !deferral.reason || !deferral.severityEvidence || !deferral.revisitCondition) throw new Error("Unexplained publication deferral");
  return { additions: ids.length, candidateSections: expectedKeys.length, reviewedPrimarySections: review.sections.filter(s => s.additionIds.length).length,
    remainingResearchSections: review.sections.filter(s => s.status === "substantive_research_open").length,
    supportingSections: support.size, deferredSections: 1, reusedSections: required.length, newSections: 0,
    configuredSelectable: CALIFORNIA_CANONICAL_RECORDS.filter(r => r.selectable).length };
}
export function renderCaliforniaSpecializedPropertyReview() {
  const s = validateCaliforniaSpecializedPropertyReview();
  return ["# California specialized property expansion", "", `${s.additions} proposed choices from ${s.reviewedPrimarySections} primary sections. Configured selectable records: ${s.configuredSelectable}, previously 174. No production deployment or source seed is certified by this report.`, "",
    `All ${s.candidateSections} previously open sections receive evidence-bound dispositions. ${s.remainingResearchSections} remain substantive research, ${s.supportingSections} are supporting provisions, and ${s.deferredSections} is a documented low-priority deferral. Partially covered sections still have the open branches stated below.`, "",
    `Reuses ${s.reusedSections} retained sections; no new download and no freshness extension. Definitions bind to the September 24 archive; the separate retained-source refresh receipt controls current runtime eligibility.`, "",
    "## Proposed choices", "", "English content displays an unavailable-translation notice in Spanish and Chinese. Terms are adult base penalties, not sentence predictions. Independent legal review remains pending.", "",
    ...additions.flatMap(a => [`### ${a.title}: §${a.code}`, "", a.summary, "", `Mental state: ${a.mentalState}`, "", a.penalty, "", `Dependencies: ${a.supportingKeys.join(", ")}.`, "", `[Official primary source](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=${a.lawCode}&sectionNum=${primary(a).split(":")[1]}.)`, ""]),
    "## Complete successor accounting", "", "Research gaps below are retained engineering work, not requests for attorney data entry. Deferral does not mean a law is repealed. Source references and apparent contradictions remain literal in the evidence artifact.", "",
    "| Section | Disposition | Reason |", "| --- | --- | --- |", ...reviewData.sections.map(r => `| ${r.key} | ${r.status.replaceAll("_", " ")} | ${r.reason} |`), "",
    ...reviewData.deferrals.map(d => `Deferral reviewed ${d.reviewedAt} by ${d.reviewer}. ${d.severityEvidence} Revisit: ${d.revisitCondition}`), "",
    "Next work is organized by statewide offense families in docs/california-completion-plan.md. This queue is not all of California, and no statewide completeness percentage has been established.", ""].join("\n");
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  fs.writeFileSync(new URL("../output/california-specialized-property-review.md", import.meta.url), renderCaliforniaSpecializedPropertyReview());
  console.log(JSON.stringify(validateCaliforniaSpecializedPropertyReview()));
}
