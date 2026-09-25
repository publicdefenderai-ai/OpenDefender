/** Offline audit of the bounded corrections and the remaining 25-record batch. */
import { createHash } from "node:crypto";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import corrections from "../../../shared/california-batch-one-corrections.json";
import baseline from "../output/california-batch-one-baseline.json";
import { getCaliforniaCanonicalRecord } from "../../../shared/california-authority";

interface Document {
  lawCode: string; section: string; versionId: string; effectiveDate: string | null;
  contentXml: string; contentSha256: string; sourceUrl: string; history: string;
}
interface ReviewRow {
  id: string; baselineSha256: string; group: string; status: string;
  primarySources: string[]; sharedResearchSources: string[]; correctionSources: string[];
  correctionSha256: string | null; remainingWork: string;
}
export interface CaliforniaReview {
  schemaVersion: number; kind: string;
  archive: { sourceUrl: string; sha256: string; retrievedAt: string; lastModified: string };
  documents: Record<string, Document[]>; records: ReviewRow[]; limits: string[];
}
const hash = (text: string) => createHash("sha256").update(text).digest("hex");
export const reviewPath = new URL("../output/california-batch-one-review.json", import.meta.url);
export function readCaliforniaReview(): CaliforniaReview {
  return JSON.parse(fs.readFileSync(reviewPath, "utf8"));
}
export function validateCaliforniaReview(review: CaliforniaReview) {
  if (review.schemaVersion !== 1 || review.kind !== "california_bounded_correction_review_not_statewide_certification") throw new Error("Unexpected review scope");
  if (review.records.length !== baseline.records.length || new Set(review.records.map(row => row.id)).size !== baseline.records.length) throw new Error("Batch accounting changed");
  const baselineIds = new Map(baseline.records.map(row => [row.canonicalId, row.catalogSha256]));
  for (const [key, versions] of Object.entries(review.documents)) {
    if (!versions.length) throw new Error(`Missing source: ${key}`);
    for (const doc of versions) {
      if (`${doc.lawCode}:${doc.section.replace(/\.$/, "")}` !== key ||
          hash(doc.contentXml) !== doc.contentSha256) throw new Error(`Changed source: ${key}`);
    }
  }
  const correctedIds = new Set<string>();
  for (const row of review.records) {
    if (!baselineIds.has(row.id) || baselineIds.get(row.id) !== row.baselineSha256) throw new Error(`Baseline changed: ${row.id}`);
    const original = baseline.records.find(item => item.canonicalId === row.id)!;
    const primary = [...new Set(original.sources.filter(source => source.kind === "statute").map(source => {
      const url = new URL(source.url);
      return `${url.searchParams.get("lawCode")}:${url.searchParams.get("sectionNum")?.replace(/\.$/, "")}`;
    }))].sort();
    if (JSON.stringify([...row.primarySources].sort()) !== JSON.stringify(primary)) throw new Error(`Primary evidence changed: ${row.id}`);
    for (const key of [...row.primarySources, ...row.sharedResearchSources, ...row.correctionSources]) {
      if (!review.documents[key]?.length) throw new Error(`Missing dependency: ${key}`);
    }
    const correction = corrections.find(item => item.id === row.id);
    if (!correction) {
      if (row.status !== "research_pending" || row.correctionSha256 || row.correctionSources.length || !row.remainingWork) throw new Error(`Unreviewed record promoted: ${row.id}`);
      continue;
    }
    if (row.status !== "bounded_correction_proposed" || row.correctionSha256 !== hash(JSON.stringify(correction))) throw new Error(`Correction changed: ${row.id}`);
    correctedIds.add(row.id);
    const expectedSources = [...new Set([...row.primarySources, ...correction.supportingSections.map(section => `PEN:${section}`)])].sort();
    if (JSON.stringify([...row.correctionSources].sort()) !== JSON.stringify(expectedSources)) throw new Error(`Correction evidence incomplete: ${row.id}`);
    if (row.correctionSources.some(key => review.documents[key].length !== 1)) throw new Error(`Correction has unresolved source versions: ${row.id}`);
    const record = getCaliforniaCanonicalRecord(row.id);
    if (!record || record.penalty !== correction.penalty.en || JSON.stringify(record.categories) !== JSON.stringify(correction.categories)) throw new Error(`Catalog correction drift: ${row.id}`);
    for (const section of correction.supportingSections) {
      if (!record.sources.some(source => source.kind === "classification" && source.citation === `Cal. Penal Code § ${section}`)) throw new Error(`Runtime dependency missing: ${row.id}/${section}`);
    }
  }
  if (correctedIds.size !== corrections.length || correctedIds.size !== 11) throw new Error("Correction coverage changed");
  return { batchRecords: review.records.length, corrections: correctedIds.size, pending: review.records.length - correctedIds.size, sections: Object.keys(review.documents).length, versions: Object.values(review.documents).reduce((sum, rows) => sum + rows.length, 0) };
}
export function renderCaliforniaReview(review: CaliforniaReview) {
  const counts = validateCaliforniaReview(review);
  return ["# California batch one: corrections and remaining work", "",
    `${counts.batchRecords} existing records accounted for: ${counts.corrections} bounded corrections proposed; ${counts.pending} remain in research. ${counts.sections} source sections (${counts.versions} versions) retained. No new charges published.`, "",
    `Archive: ${review.archive.sourceUrl}; modified ${review.archive.lastModified}; acquired ${review.archive.retrievedAt}.`, "",
    ...review.limits.map(limit => `- ${limit}`), "",
    ...review.records.flatMap(row => {
      const correction = corrections.find(item => item.id === row.id);
      return [`## ${row.id}`, "", correction ? correction.summary.en : "Research pending.", "", ...(correction ? [correction.penalty.en, "", "Supporting sources:", "", ...row.correctionSources.map(key => `- [${key}](${review.documents[key][0].sourceUrl})`), ""] : []), `Remaining work: ${row.remainingWork}`, ""];
    }),
  ].join("\n");
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const review = readCaliforniaReview();
  const counts = validateCaliforniaReview(review);
  fs.writeFileSync(new URL("../output/california-batch-one-review.md", import.meta.url), renderCaliforniaReview(review));
  console.log(JSON.stringify(counts));
}
