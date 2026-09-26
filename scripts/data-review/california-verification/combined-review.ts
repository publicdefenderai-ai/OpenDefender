/** Combined source groups remain separate from case-specific legal approval. */
import { createHash } from "node:crypto";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import corrections from "../../../shared/california-batch-three-corrections.json";
import baseline from "../output/california-batch-three-baseline.json";
import evidence from "../output/california-batch-three-review.json";
import expansion from "../output/california-catalog-source-expansion.json";
import { getCaliforniaCanonicalRecord, getCaliforniaCorrectionDependencies } from "../../../shared/california-authority";
import { readCaliforniaReview, validateCaliforniaReview } from "./review";
import { readCaliforniaReuseReview, validateCaliforniaReuseReview } from "./reuse-review";
const hash = (text: string) => createHash("sha256").update(text).digest("hex");
export function readCaliforniaCombinedReview() { return structuredClone(evidence); }
export function validateCaliforniaCombinedReview(review = readCaliforniaCombinedReview()) {
  const first = readCaliforniaReview(), second = readCaliforniaReuseReview();
  validateCaliforniaReview(first); validateCaliforniaReuseReview(second);
  if (review.schemaVersion !== 1 || review.scope !== "bounded_shared_source_corrections_not_full_legal_certification" || review.archiveSha256 !== first.archive.sha256 || expansion.archive.sha256 !== review.archiveSha256 || review.sourceAsOf !== "2026-09-24") throw new Error("Combined review provenance changed");
  const prior = { ...first.documents, ...second.documents, ...expansion.documents };
  const documents: typeof first.documents = { ...prior, ...review.documents };
  for (const [key, versions] of Object.entries(documents)) {
    if (!versions.length || new Set(versions.map(v => v.versionId)).size !== versions.length) throw new Error("Duplicate or missing source version");
    for (const doc of versions) if (`${doc.lawCode}:${doc.section.replace(/\.$/, "")}` !== key || hash(doc.contentXml) !== doc.contentSha256) throw new Error("Combined source changed");
  }
  for (const key of Object.keys(review.documents)) if (key in prior) throw new Error("Combined source shadows retained evidence");
  const expectedIds = baseline.records.map(row => row.record.canonicalId).sort();
  if (expectedIds.length !== 18 || new Set(expectedIds).size !== 18 || JSON.stringify(review.records.map(row => row.id).sort()) !== JSON.stringify(expectedIds) || JSON.stringify(corrections.map(row => row.id).sort()) !== JSON.stringify(expectedIds)) throw new Error("Combined batch accounting changed");
  for (const row of review.records) {
    const original = baseline.records.find(item => item.record.canonicalId === row.id)!;
    const correction = corrections.find(item => item.id === row.id)!;
    if (hash(JSON.stringify(original.record)) !== original.catalogSha256 || row.baselineSha256 !== original.catalogSha256) throw new Error("Combined baseline changed");
    if (row.status !== "bounded_correction_proposed" || hash(JSON.stringify(correction)) !== row.correctionSha256 || !row.remainingWork) throw new Error("Combined correction changed");
    const current = getCaliforniaCanonicalRecord(row.id);
    if (!current?.selectable || current.penalty !== correction.penalty.en || JSON.stringify(current.categories) !== JSON.stringify(correction.categories)) throw new Error("Combined catalog drift");
    const primary = original.record.sources.filter(s => s.kind === "statute").map(s => { const u = new URL(s.url); return `${u.searchParams.get("lawCode")}:${u.searchParams.get("sectionNum")?.replace(/\.$/, "")}`; });
    const deps = getCaliforniaCorrectionDependencies(correction);
    const expected = [...new Set([...primary, ...deps.map(d => `${d.lawCode}:${d.section}`)])].sort();
    if (JSON.stringify(row.sources.map(s => s.key).sort()) !== JSON.stringify(expected)) throw new Error("Combined dependencies incomplete");
    for (const source of row.sources) {
      const versions = documents[source.key];
      // This batch relies only on single-version sources; ambiguity requires a new review.
      if (versions?.some(doc => doc.effectiveDate && doc.effectiveDate.slice(0, 10) > review.sourceAsOf)) throw new Error("Future source requires separate review");
      if (versions?.length !== 1 || source.versions.length !== 1 || source.versions[0].versionId !== versions[0].versionId || source.versions[0].contentSha256 !== versions[0].contentSha256) throw new Error("Combined version evidence incomplete or ambiguous");
    }
    for (const dep of deps) if (!current.sources.some(source => { const u = new URL(source.url); return source.kind === "classification" && u.searchParams.get("lawCode") === dep.lawCode && u.searchParams.get("sectionNum")?.replace(/\.$/, "") === dep.section; })) throw new Error("Combined runtime dependency missing");
  }
  const used = new Set(review.records.flatMap(row => row.sources.map(s => s.key)));
  if (Object.keys(review.documents).some(key => !used.has(key))) throw new Error("Unused new source");
  return { corrections: 18, addedSections: Object.keys(review.documents).length, addedVersions: Object.values(review.documents).reduce((n, v) => n + v.length, 0), sharedSources: used.size };
}
export function renderCaliforniaCombinedReview(review = readCaliforniaCombinedReview()) {
  validateCaliforniaCombinedReview(review);
  const docs = { ...readCaliforniaReview().documents, ...readCaliforniaReuseReview().documents, ...expansion.documents, ...review.documents } as ReturnType<typeof readCaliforniaReview>["documents"];
  return ["# California combined statutory review: 18 records", "", "Seven rape subdivisions, six murder/robbery/attempt records, and five manslaughter records. Reuses all primary text and adds 14 penalty/definition sections from the same hash-verified official archive. This is a bounded correction pass, not full legal certification or a statewide completeness claim.", "", "Source snapshot: September 24, 2026. English, Spanish, and Chinese text reaches exact-ID explanations; translations remain drafts for professional review. Statutory base terms are not total sentence predictions.", "", ...review.records.flatMap(row => { const correction = corrections.find(c => c.id === row.id)!; return [
    `## ${row.id}`, "", correction.summary.en, "", correction.penalty.en, "",
    ...row.sources.map(source => `- [${source.key}](${docs[source.key][0].sourceUrl})`), "", `Remaining work: ${row.remainingWork}`, "",
  ]; })].join("\n");
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  fs.writeFileSync(new URL("../output/california-batch-three-review.md", import.meta.url), renderCaliforniaCombinedReview());
  console.log(JSON.stringify(validateCaliforniaCombinedReview()));
}
