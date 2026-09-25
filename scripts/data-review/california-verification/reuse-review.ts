/** Six-record reuse batch: source-bound corrections, not legal certification. */
import { createHash } from "node:crypto";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import corrections from "../../../shared/california-batch-two-corrections.json";
import baseline from "../output/california-batch-two-baseline.json";
import evidence from "../output/california-batch-two-review.json";
import { getCaliforniaCanonicalRecord, getCaliforniaCorrectionDependencies } from "../../../shared/california-authority";
import { readCaliforniaReview, validateCaliforniaReview } from "./review";
const hash = (text: string) => createHash("sha256").update(text).digest("hex");
export function readCaliforniaReuseReview() { return structuredClone(evidence); }
export function validateCaliforniaReuseReview(review = readCaliforniaReuseReview()) {
  const first = readCaliforniaReview();
  validateCaliforniaReview(first);
  if (review.schemaVersion !== 1 || review.scope !== "bounded_shared_source_corrections_not_full_legal_certification" || review.archiveSha256 !== first.archive.sha256) throw new Error("Reuse review provenance changed");
  const documents: ReturnType<typeof readCaliforniaReview>["documents"] = { ...first.documents, ...review.documents };
  for (const [key, versions] of Object.entries(review.documents)) {
    if (first.documents[key] || !versions.length || new Set(versions.map(v => v.versionId)).size !== versions.length) throw new Error("Duplicate or missing reuse source");
    for (const doc of versions) if (`${doc.lawCode}:${doc.section.replace(/\.$/, "")}` !== key || hash(doc.contentXml) !== doc.contentSha256) throw new Error("Reuse source changed");
  }
  if (review.commonVersionClauses.length !== 1 || review.commonVersionClauses[0].sourceKey !== "VEH:23103.5") throw new Error("Missing common-clause scope");
  for (const clause of review.commonVersionClauses) {
    const versions = documents[clause.sourceKey];
    if (!clause.clauseXml.startsWith("<p>(c)") || !clause.clauseXml.endsWith("</p>") || clause.clauseXml.indexOf("</p>") !== clause.clauseXml.length - 4 || !clause.limitation || !versions?.every(doc => doc.contentXml.includes(clause.clauseXml))) throw new Error("Common version clause changed");
  }
  if (review.records.length !== 6 || new Set(review.records.map(row => row.id)).size !== 6 || corrections.length !== 6) throw new Error("Reuse batch accounting changed");
  for (const row of review.records) {
    const original = baseline.records.find(item => item.record.canonicalId === row.id);
    const correction = corrections.find(item => item.id === row.id);
    if (!original || hash(JSON.stringify(original.record)) !== original.catalogSha256 || row.baselineSha256 !== original.catalogSha256) throw new Error("Reuse baseline changed");
    if (!correction || row.status !== "bounded_correction_proposed" || hash(JSON.stringify(correction)) !== row.correctionSha256 || !row.remainingWork) throw new Error("Reuse correction changed");
    const current = getCaliforniaCanonicalRecord(row.id);
    if (!current?.selectable || current.penalty !== correction.penalty.en || JSON.stringify(current.categories) !== JSON.stringify(correction.categories)) throw new Error("Reuse catalog drift");
    const primary = original.record.sources.filter(s => s.kind === "statute").map(s => { const u = new URL(s.url); return `${u.searchParams.get("lawCode")}:${u.searchParams.get("sectionNum")?.replace(/\.$/, "")}`; });
    const deps = getCaliforniaCorrectionDependencies(correction);
    const expected = [...new Set([...primary, ...deps.map(d => `${d.lawCode}:${d.section}`)])].sort();
    if (JSON.stringify(row.sources.map(s => s.key).sort()) !== JSON.stringify(expected)) throw new Error("Reuse dependencies incomplete");
    for (const source of row.sources) {
      const versions = documents[source.key];
      if (!versions?.length || source.versions.length !== versions.length || new Set(source.versions.map(v => v.versionId)).size !== versions.length || source.versions.some(v => !versions.some(doc => doc.versionId === v.versionId && doc.contentSha256 === v.contentSha256))) throw new Error("Reuse version evidence incomplete");
      if (versions.length > 1 && !review.commonVersionClauses.some(clause => clause.sourceKey === source.key)) throw new Error("Unresolved reuse source versions");
    }
    for (const dep of deps) if (!current.sources.some(source => { const u = new URL(source.url); return source.kind === "classification" && u.searchParams.get("lawCode") === dep.lawCode && u.searchParams.get("sectionNum")?.replace(/\.$/, "") === dep.section; })) throw new Error("Reuse runtime dependency missing");
  }
  return { corrections: review.records.length, addedSections: Object.keys(review.documents).length, addedVersions: Object.values(review.documents).reduce((n, v) => n + v.length, 0) };
}
export function renderCaliforniaReuseReview(review = readCaliforniaReuseReview()) {
  validateCaliforniaReuseReview(review);
  const documents: ReturnType<typeof readCaliforniaReview>["documents"] = { ...readCaliforniaReview().documents, ...review.documents };
  return ["# California combined reuse batch: six proposed corrections", "",
    "Assault on a peace officer, first-degree burglary, repeat DUI, agricultural theft, and firearm theft. Existing IDs retained; this is a bounded statutory pass, not full legal certification.", "",
    ...review.commonVersionClauses.flatMap(clause => ["## Shared clause across retained versions", "", clause.limitation, "", clause.clauseXml.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim(), ""]),
    ...review.records.flatMap(row => { const correction = corrections.find(c => c.id === row.id)!; return [
      `## ${row.id}`, "", correction.summary.en, "", correction.penalty.en, "",
      ...row.sources.map(source => `- [${source.key}](${documents[source.key][0].sourceUrl}) (${source.versions.length} retained version(s))`), "",
      `Remaining work: ${row.remainingWork}`, "",
    ]; }),
  ].join("\n");
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  fs.writeFileSync(new URL("../output/california-batch-two-review.md", import.meta.url), renderCaliforniaReuseReview());
  console.log(JSON.stringify(validateCaliforniaReuseReview()));
}
