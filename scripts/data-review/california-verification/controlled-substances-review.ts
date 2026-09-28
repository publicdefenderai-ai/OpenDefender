/** Bounded publication plus independent miss detection, never chapter certification. */
import fs from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import additions from "../../../shared/california-controlled-substances-additions.json";
import acquisitionData from "../output/california-controlled-substances-acquisition.json";
import reviewData from "../output/california-controlled-substances-review.json";
import benchmarkData from "../output/california-controlled-substances-benchmark-source.json";
import { CALIFORNIA_CANONICAL_RECORDS, getCaliforniaCanonicalRecord } from "../../../shared/california-authority";
import { californiaPrimaryIdentity } from "../../../shared/california-law-codes";
import { specializedPropertyDocuments } from "./specialized-property-review";
import { sourceText } from "./person-property-review";

const hash = (s: string) => createHash("sha256").update(s).digest("hex");
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
const jsonHash = (v: unknown) => hash(JSON.stringify(v, null, 2) + "\n");
const primary = (a: {lawCode: string; code: string}) => californiaPrimaryIdentity(a.lawCode, a.code).key;
export const readCaliforniaControlledSubstancesReview = () => structuredClone(reviewData);
export const readCaliforniaControlledSubstancesAcquisition = () => structuredClone(acquisitionData);
export const readCaliforniaDrugBenchmark = () => structuredClone(benchmarkData);
export function controlledSubstancesDocuments(acquisition = readCaliforniaControlledSubstancesAcquisition()) {
  const docs = specializedPropertyDocuments();
  for (const [key, versions] of Object.entries(acquisition.documents)) {
    if (docs[key]) throw new Error("New source shadows retained evidence");
    docs[key] = versions;
  }
  return docs;
}
export function validateCaliforniaControlledSubstancesReview(review = readCaliforniaControlledSubstancesReview(), definitions = additions,
  acquisition = readCaliforniaControlledSubstancesAcquisition(), benchmark = readCaliforniaDrugBenchmark()) {
  const manifestBytes = fs.readFileSync(new URL("../output/california-statewide/review-batches.json", import.meta.url), "utf8");
  const manifest = JSON.parse(manifestBytes) as Array<{id: string; sectionKeys: string[]}>;
  const batch = manifest.find(b => b.id === "HSC:division=10./title=-/part=-/chapter=6.");
  const keys = [...new Set([...(batch?.sectionKeys ?? []), "BPC:4326", "HSC:11550"])].sort();
  if (review.schemaVersion !== 1 || review.scope !== "bounded_controlled_substances_additions_not_statewide_certification" || review.sourceAsOf !== "2026-09-24" ||
      acquisition.archive.sha256 !== "dd0f40a7256bcf31e8dff50efa4833e296a700a7f772e36c23dc276039ef22a4" || acquisition.archive.sha256 !== review.archiveSha256 ||
      acquisition.batchId !== batch?.id || acquisition.batchManifestSha256 !== hash(manifestBytes) || review.acquisitionSha256 !== jsonHash(acquisition) || review.benchmarkSha256 !== jsonHash(benchmark)) throw new Error("Drug review provenance changed");
  if (keys.length !== 104 || !same(acquisition.candidateKeys, keys) || !same(review.sections.map(s => s.key), keys) || !same(acquisition.missingBenchmarkKeys, ["BPC:4326"])) throw new Error("Drug section accounting changed");
  const docs = controlledSubstancesDocuments(acquisition);
  const required = [...new Set([...keys.filter(k => k !== "BPC:4326"), ...definitions.flatMap(a => a.supportingKeys), "HSC:11007", "HSC:11018", "HSC:11019", "HSC:11006.5", "HSC:11018.5"])].sort();
  if (!same([...acquisition.reusedKeys, ...Object.keys(acquisition.documents)].sort(), required)) throw new Error("Incomplete drug acquisition");
  for (const key of required) {
    const versions = docs[key];
    if (!versions?.length || new Set(versions.map(v => v.versionId)).size !== versions.length) throw new Error("Missing source version");
    for (const v of versions) {
      const u = new URL(v.sourceUrl);
      if (`${v.lawCode}:${v.section.replace(/\.$/, "")}` !== key || hash(v.contentXml) !== v.contentSha256 || u.protocol !== "https:" || u.hostname !== "leginfo.legislature.ca.gov" || `${u.searchParams.get("lawCode")}:${u.searchParams.get("sectionNum")?.replace(/\.$/, "")}` !== key) throw new Error("Unbound source identity or content");
    }
  }
  const bindings = (key: string) => docs[key]?.map(v => ({versionId: v.versionId, contentSha256: v.contentSha256})) ?? [];
  const verifySpan = (e: {key: string; versionId: string; start: number; end: number; text: string}, key: string) => {
    const version = docs[key]?.find(v => v.versionId === e.versionId);
    if (e.key !== key || !version || !e.text || e.start < 0 || e.end <= e.start || sourceText(version.contentXml).slice(e.start, e.end) !== e.text) throw new Error("Unbound source excerpt");
  };
  // Never choose the latest version silently. Only the identical exclusion and
  // 17-drug list are approved here, not either version's standalone punishment.
  const decision = review.sourceVersionDecisions[0];
  if (review.sourceVersionDecisions.length !== 1 || decision.key !== "HSC:11375" || decision.status !== "shared_exception_only_no_primary_publication" || !decision.reason || docs[decision.key].length !== 2 || decision.excerpts.length !== 4) throw new Error("Unresolved exception version");
  for (const e of decision.excerpts) verifySpan(e, decision.key);
  const scope = "As to the substances specified in subdivision (c), this section, and not Sections 11377, 11378, 11379, and 11380, shall apply.";
  const list = "(1) Chlordiazepoxide. (2) Clonazepam. (3) Clorazepate. (4) Diazepam. (5) Flurazepam. (6) Lorazepam. (7) Mebutamate. (8) Oxazepam. (9) Prazepam. (10) Temazepam. (11) Halazepam. (12) Alprazolam. (13) Propoxyphene. (14) Diethylpropion. (15) Phentermine. (16) Pemoline. (17) Triazolam.";
  for (const v of docs[decision.key]) if (!same(decision.excerpts.filter(e => e.versionId === v.versionId).map(e => e.text), [scope, list])) throw new Error("Exception differs between retained versions");
  const ids = definitions.map(a => a.id).sort();
  if (ids.length !== 27 || new Set(ids).size !== ids.length || !same(review.records.map(r => r.id).sort(), ids)) throw new Error("Drug addition accounting changed");
  for (const section of review.sections) {
    const assigned = definitions.filter(a => primary(a) === section.key).map(a => a.id);
    const existing = CALIFORNIA_CANONICAL_RECORDS.filter(r => r.selectable && !ids.includes(r.canonicalId) && `${r.lawCode}:${r.code.split("(")[0]}` === section.key).map(r => r.canonicalId);
    const status = assigned.length ? "addition_branches_reviewed_other_branches_open" : existing.length ? "existing_entry_not_family_completion" : section.key === "BPC:4326" ? "benchmark_source_absent" : "substantive_research_open";
    if (section.status !== status || !section.reason.trim() || !same(section.additionIds, assigned) || !same(section.existingIds, existing) || !same(section.versions, bindings(section.key))) throw new Error("Unbound section disposition");
    if (section.key === "BPC:4326") { if (section.evidence !== null || docs[section.key]) throw new Error("Invented absent source"); }
    else if (!section.evidence) throw new Error("Missing source excerpt");
    else verifySpan(section.evidence, section.key);
  }
  for (const row of review.records) {
    const a = definitions.find(a => a.id === row.id)!;
    const key = primary(a);
    if (!keys.includes(key) || key === decision.key || row.status !== "bounded_statutory_addition_proposed" || !row.remainingWork || a.sourceAsOf !== review.sourceAsOf ||
        a.translationStatus !== "english_only_pending_translation" || hash(JSON.stringify(a)) !== row.definitionSha256) throw new Error("Reviewed drug definition changed");
    const sourceKeys = [...new Set([key, ...a.supportingKeys])].sort();
    if (!same(Object.keys(a.sourceEffectiveDates).sort(), sourceKeys) || !same(row.sources.map(s => s.key), sourceKeys)) throw new Error("Incomplete drug dependencies");
    for (const source of row.sources) {
      const versions = docs[source.key];
      const expectedDate = source.key === decision.key ? null : versions[0]?.effectiveDate?.slice(0,10) ?? null;
      if ((source.key !== decision.key && versions.length !== 1) || !same(source.versions, bindings(source.key)) || versions.some(v => v.effectiveDate && v.effectiveDate.slice(0,10) > review.sourceAsOf)) throw new Error("Unresolved source version");
      if ((a.sourceEffectiveDates as Record<string, string | null>)[source.key] !== expectedDate) throw new Error("Source date drift");
    }
    verifySpan(row.primaryEvidence, key);
    const canonical = getCaliforniaCanonicalRecord(a.id);
    if (!canonical?.selectable || canonical.lawCode !== a.lawCode || canonical.code !== a.code || canonical.officialTitle !== a.title || canonical.penalty !== a.penalty || !same(canonical.categories, a.categories)) throw new Error("Drug catalog drift");
    const runtimeKeys = canonical.sources.map(s => {
      const u = new URL(s.url); const k = `${u.searchParams.get("lawCode")}:${u.searchParams.get("sectionNum")}`;
      if (s.effectiveDate !== (a.sourceEffectiveDates as Record<string, string | null>)[k]) throw new Error("Runtime source date drift");
      return k;
    });
    if (!same(runtimeKeys.sort(), sourceKeys) || CALIFORNIA_CANONICAL_RECORDS.some(r => r.selectable && r.canonicalId !== a.id && r.lawCode === a.lawCode && r.code === a.code)) throw new Error("Duplicate or incomplete charging identity");
  }
  validateDrugBenchmark(benchmark, review.crosswalk, definitions);
  return {additions: ids.length, candidateSections: keys.length, reviewedPrimarySections: review.sections.filter(s => s.additionIds.length).length,
    existingPrimarySections: review.sections.filter(s => s.existingIds.length).length, remainingResearchSections: review.sections.filter(s => s.status === "substantive_research_open").length,
    absentBenchmarkSections: 1, benchmarkInstructions: benchmark.instructions.length, reusedSections: acquisition.reusedKeys.length,
    newSections: Object.keys(acquisition.documents).length, newVersions: Object.values(acquisition.documents).reduce((n,v) => n+v.length,0),
    configuredSelectable: CALIFORNIA_CANONICAL_RECORDS.filter(r => r.selectable).length};
}

export function validateDrugBenchmark(benchmark = readCaliforniaDrugBenchmark(), crosswalk = readCaliforniaControlledSubstancesReview().crosswalk, definitions = additions) {
  const expected = "2300 2301 2302 2303 2304 2305 2306 2307 2315 2316 2320 2321 2330 2331 2335 2336 2337 2338 2350 2351 2352 2361 2363 2364 2370 2375 2376 2380 2381 2382 2383 2384 2390 2391 2392 2393 2400 2401 2410 2412 2413 2430 2431 2432 2440 2441".split(" ");
  if (benchmark.receipt.sourceUrl !== "https://courts.ca.gov/system/files/file/calcrim-2026.pdf" || benchmark.receipt.pdfPages !== 2680 || !/^[a-f0-9]{64}$/.test(benchmark.receipt.sha256) || !same(benchmark.instructions.map(i => i.id), expected) || !same(crosswalk.map(i => i.instruction), expected)) throw new Error("Benchmark inventory changed");
  if (!same(benchmark.pages.map(p => p.page), Array.from({length:124},(_,i)=>1589+i))) throw new Error("Missing benchmark pages");
  for (const p of benchmark.pages) if (hash(p.text) !== p.sha256) throw new Error("Unbound benchmark page");
  for (const [i, b] of benchmark.instructions.entries()) {
    const row = crosswalk[i];
    const lastPage = benchmark.instructions[i+1]?.firstPage ? benchmark.instructions[i+1].firstPage-1 : 1712;
    const pages = benchmark.pages.filter(p => p.page >= b.firstPage && p.page <= lastPage);
    if (b.lastPage !== lastPage || !pages.length || !new RegExp(`^${b.id}\\.\\s`, "m").test(pages[0].text) || !same(b.pageHashes, pages.map(p=>({page:p.page,sha256:p.sha256}))) || row.firstPage !== b.firstPage || row.lastPage !== b.lastPage) throw new Error("Unbound instruction pages");
    if (!row.reason || new Set(row.chargeIds).size !== row.chargeIds.length || row.chargeIds.some(id => !getCaliforniaCanonicalRecord(id)?.selectable)) throw new Error("Invalid benchmark match");
    const newIds = definitions.filter(a => a.calcrim.includes(b.id)).map(a => a.id).sort();
    if (!same(row.chargeIds.filter(id => definitions.some(a => a.id === id)).sort(), newIds)) throw new Error("Benchmark addition match drift");
    const status = ["2412","2413"].includes(b.id) ? "benchmark_source_absent" : ["2331","2335","2336","2337","2338","2350","2351","2352","2361","2363","2364","2370","2430","2431","2432","2441"].includes(b.id) ? "publication_gap" : b.id === "2305" ? "non_offense_instruction" : b.id === "2307" ? "penalty_context_only" : ["2380","2381","2382","2384"].includes(b.id) ? "partial_catalog_match" : "catalog_branch_matches_found";
    if (row.status !== status || (["catalog_branch_matches_found","partial_catalog_match","penalty_context_only"].includes(status) !== Boolean(row.chargeIds.length))) throw new Error("Benchmark gap silently cleared");
  }
}
export function renderCaliforniaControlledSubstancesReview() {
  const a = validateCaliforniaControlledSubstancesReview();
  return ["# California controlled-substances expansion and independent benchmark", "",
    `${a.additions} additional adult choices from ${a.reviewedPrimarySections} primary sections; ${a.configuredSelectable} configured California choices in total. Source expiry and changed-source holds still apply. This report does not verify deployment.`, "",
    `${a.candidateSections} candidate sections are accounted for: ${a.reviewedPrimarySections} with new bounded branches, ${a.existingPrimarySections} with existing entries, ${a.remainingResearchSections} still open, and one absent benchmark source. Open includes context and procedural provisions not yet fully dispositioned; it is not a count of missing crimes.`, "",
    `Reuses ${a.reusedSections} sections and adds ${a.newSections} sections/${a.newVersions} versions. The original acquisition clock is preserved. Both versions of HSC 11375 are retained; only their identical exclusion/list is used, with no asserted effective date or standalone publication.`, "",
    "## Proposed charge choices", "", "Adult base penalties are not sentence predictions. Independent attorney review remains pending. English-only additions display an unavailable-translation notice in other languages.", "",
    ...additions.flatMap(r => [`### ${r.title}: HSC §${r.code}`, "", r.summary, "", `Mental state: ${r.mentalState}`, "", r.penalty, "", `Dependencies: ${r.supportingKeys.join(", ")}.`, "", `[Official primary source](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=HSC&sectionNum=${primary(r).split(":")[1]}.)`, ""]),
    "## Independent jury-instruction crosswalk", "",
    "The official February 2026 CALCRIM drug chapter supplies 46 independently enumerated entries. Some are defenses or allegations, not charges. A branch match does not certify the whole instruction; no coverage percentage is claimed. The retained PDF receipt and 124 page texts bind this comparison to its edition. Statutes control penalties and current law.", "",
    "| Instruction | PDF pages | Disposition | Matched IDs / remaining work |", "| --- | --- | --- | --- |",
    ...reviewData.crosswalk.map(r => `| ${r.instruction} | ${r.firstPage}-${r.lastPage} | ${r.status.replaceAll("_"," ")} | ${r.chargeIds.join(", ")} ${r.reason} |`), "",
    "## Chapter and benchmark-source accounting", "",
    "These gaps are engineering research, not requests for attorney data entry. No unknown-severity provision is dismissed as minor. Commercial cannabis, precursors, drug-money offenses, false compartments and armed drug use remain consequential work for a combined follow-up.", "",
    "| Section | Disposition | Remaining work |", "| --- | --- | --- |", ...reviewData.sections.map(r=>`| ${r.key} | ${r.status.replaceAll("_"," ")} | ${r.reason} |`), "",
    "HSC 11377's $70 fine is not represented as an aggregate fine ceiling. [People v. Clark (1992) 7 Cal.App.4th 1041](https://law.justia.com/cases/california/court-of-appeal/4th/7/1041.html) discusses an additional Penal Code 672 fine; the current statute has since been amended, so the entry preserves that limitation rather than predicting all monetary obligations.", "",
    "Anomaly inventory: docs/statutory-source-anomalies.md is the cross-batch index. Historical batch anomaly fields remain source-specific evidence, not a second canonical registry.", ""].join("\n");
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  fs.writeFileSync(new URL("../output/california-controlled-substances-review.md", import.meta.url), renderCaliforniaControlledSubstancesReview());
  console.log(JSON.stringify(validateCaliforniaControlledSubstancesReview()));
}
