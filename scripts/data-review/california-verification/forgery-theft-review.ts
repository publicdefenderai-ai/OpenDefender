/** Successor accounting: preserve the prior review instead of silently clearing its queue. */
import fs from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import additions from "../../../shared/california-forgery-theft-additions.json";
import reviewData from "../output/california-forgery-theft-review.json";
import acquisitionData from "../output/california-forgery-theft-acquisition.json";
import { CALIFORNIA_CANONICAL_RECORDS, getCaliforniaCanonicalRecord } from "../../../shared/california-authority";
import { personPropertyDocuments, readCaliforniaPersonPropertyReview, sourceText } from "./person-property-review";

const hash = (value: string) => createHash("sha256").update(value).digest("hex");
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const primaryKey = (code: string) => `PEN:${code.match(/^\d+(?:\.\d+)*[a-z]?/)![0]}`;
export const readCaliforniaForgeryTheftReview = () => structuredClone(reviewData);
export const readCaliforniaForgeryTheftAcquisition = () => structuredClone(acquisitionData);
export function validateCaliforniaForgeryTheftReview(review = readCaliforniaForgeryTheftReview(), acquisition = readCaliforniaForgeryTheftAcquisition(), definitions = additions) {
  const previous = readCaliforniaPersonPropertyReview();
  const previousBytes = fs.readFileSync(new URL("../output/california-person-property-review.json", import.meta.url), "utf8");
  const expectedKeys = previous.sections.filter(s => s.status === "substantive_research_open").map(s => s.key);
  if (review.schemaVersion !== 1 || acquisition.schemaVersion !== 1 || review.scope !== "bounded_forgery_theft_additions_not_statewide_certification" || acquisition.scope !== "forgery_theft_dependency_acquisition_not_publication" ||
      review.sourceAsOf !== previous.sourceAsOf || review.archiveSha256 !== previous.archiveSha256 || acquisition.archive.sha256 !== review.archiveSha256 ||
      review.previousReviewSha256 !== hash(previousBytes) || acquisition.previousReviewSha256 !== hash(previousBytes) ||
      review.acquisitionSha256 !== hash(JSON.stringify(acquisition, null, 2) + "\n")) throw new Error("Forgery/theft provenance changed");
  if (expectedKeys.length !== 79 || !same(acquisition.candidateKeys, expectedKeys) || !same(review.sections.map(s => s.key), expectedKeys)) throw new Error("Successor queue accounting changed");
  const docs = personPropertyDocuments();
  for (const [key, versions] of Object.entries(acquisition.documents)) {
    if (docs[key]) throw new Error("New source shadows retained evidence");
    docs[key] = versions;
  }
  const required = [...new Set([...expectedKeys, ...definitions.flatMap(a => a.supportingKeys)])].sort();
  if (!same([...acquisition.reusedKeys, ...Object.keys(acquisition.documents)].sort(), required)) throw new Error("Incomplete dependency acquisition");
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
  const ids = definitions.map(a => a.id).sort();
  if (ids.length !== 28 || new Set(ids).size !== ids.length || !same(review.records.map(r => r.id).sort(), ids)) throw new Error("Addition accounting changed");
  for (const section of review.sections) {
    const assigned = definitions.filter(a => primaryKey(a.code) === section.key).map(a => a.id);
    const status = assigned.length ? "addition_branches_reviewed_other_branches_open" : "substantive_research_open";
    if (section.status !== status || !section.reason.trim() || !same(section.additionIds, assigned) || !same(section.versions, bindings(section.key))) throw new Error("Unbound section disposition");
  }
  for (const row of review.records) {
    const a = definitions.find(a => a.id === row.id)!;
    const primary = primaryKey(a.code);
    if (!expectedKeys.includes(primary)) throw new Error("Addition outside successor queue");
    if (row.status !== "bounded_statutory_addition_proposed" || !row.remainingWork || a.sourceAsOf !== review.sourceAsOf || hash(JSON.stringify(a)) !== row.definitionSha256) throw new Error("Reviewed definition changed");
    const keys = [...new Set([primary, ...a.supportingKeys])].sort();
    if (!same(Object.keys(a.sourceEffectiveDates).sort(), keys) || !same(row.sources.map(s => s.key), keys)) throw new Error("Incomplete source dependencies");
    for (const s of row.sources) {
      const versions = docs[s.key];
      if (versions?.length !== 1 || !same(s.versions, bindings(s.key)) || versions.some(v => v.effectiveDate && v.effectiveDate.slice(0,10) > review.sourceAsOf)) throw new Error("Unresolved source version");
      if ((a.sourceEffectiveDates as Record<string, string | null>)[s.key] !== (versions[0].effectiveDate?.slice(0,10) ?? null)) throw new Error("Source date changed");
    }
    const e = row.primaryEvidence;
    if (e.key !== primary || !e.text || e.start < 0 || e.end <= e.start || sourceText(docs[primary][0].contentXml).slice(e.start, e.end) !== e.text) throw new Error("Unbound evidence span");
    const canonical = getCaliforniaCanonicalRecord(row.id);
    if (!canonical?.selectable || canonical.code !== a.code || canonical.officialTitle !== a.title || canonical.penalty !== a.penalty || !same(canonical.categories, a.categories)) throw new Error("Addition catalog drift");
    const runtimeKeys = canonical.sources.map(s => {
      const u = new URL(s.url); const key = `${u.searchParams.get("lawCode")}:${u.searchParams.get("sectionNum")}`;
      if (s.effectiveDate !== (docs[key]?.[0]?.effectiveDate?.slice(0,10) ?? null)) throw new Error("Runtime source date drift");
      return key;
    });
    if (!same(runtimeKeys.sort(), keys)) throw new Error("Runtime dependencies incomplete");
    if (CALIFORNIA_CANONICAL_RECORDS.some(r => r.selectable && r.canonicalId !== a.id && r.lawCode === "PEN" && r.code === a.code)) throw new Error("Duplicate charging identity");
  }
  return { additions: ids.length, candidateSections: expectedKeys.length, reviewedPrimarySections: review.sections.filter(s => s.additionIds.length).length,
    remainingResearchSections: review.sections.filter(s => !s.additionIds.length).length, reusedSections: acquisition.reusedKeys.length,
    newSections: Object.keys(acquisition.documents).length, newVersions: Object.values(acquisition.documents).reduce((n,v) => n+v.length,0),
    configuredSelectable: CALIFORNIA_CANONICAL_RECORDS.filter(r => r.selectable).length };
}
export function renderCaliforniaForgeryTheftReview() {
  const s = validateCaliforniaForgeryTheftReview();
  return ["# California forgery, theft and receiving expansion", "", `${s.additions} proposed choices from ${s.reviewedPrimarySections} primary sections. Configured selectable records: ${s.configuredSelectable}, previously 125. These counts describe the repository, not a verified production deployment.`, "",
    `Reuses ${s.reusedSections} retained sections; adds ${s.newSections} dependencies. The source archive was acquired September 24, 2026 and has not been refreshed by this offline review.`, "",
    "## Proposed identities", "", "English content carries an unavailable-translation notice in Spanish and Chinese. Terms below are adult base penalties, not total sentence predictions. Attorney review remains pending.", "",
    ...additions.flatMap(a => [`### ${a.title}: §${a.code}`, "", a.summary, "", `Mental state: ${a.mentalState}`, "", a.penalty, "", `Dependencies: ${a.supportingKeys.join(", ")}.`, "", `[Official primary source](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=${primaryKey(a.code).slice(4)}.)`, ""]),
    "## Successor queue", "", `All ${s.candidateSections} previously open sections remain accounted for. ${s.remainingResearchSections} still need substantive research. New identities do not certify every branch of their source sections. The previous low-priority infraction deferral and three attorney questions remain unchanged.`, "",
    "| Section | Disposition | Reason |", "| --- | --- | --- |",
    ...reviewData.sections.map(r => `| ${r.key} | ${r.status.replaceAll("_", " ")} | ${r.reason} |`), "",
    "## Independent checks and limits", "", ...reviewData.researchNotes.map(n => `- [${n.authority}](${n.sourceUrl}): ${n.finding}`), "",
    "Next: the remaining 59 research sections and unreviewed branches, including access-card theft valuation, specialized theft and protected-victim assault/battery groups. No statewide completeness percentage is established.", ""].join("\n");
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  fs.writeFileSync(new URL("../output/california-forgery-theft-review.md", import.meta.url), renderCaliforniaForgeryTheftReview());
  console.log(JSON.stringify(validateCaliforniaForgeryTheftReview()));
}
