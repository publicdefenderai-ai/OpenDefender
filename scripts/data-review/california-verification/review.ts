/** Offline audit of the bounded corrections for the initial 25-record batch. */
import { createHash } from "node:crypto";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import corrections from "../../../shared/california-batch-one-corrections.json";
import baseline from "../output/california-batch-one-baseline.json";
import { getCaliforniaCanonicalRecord, getCaliforniaCorrectionDependencies } from "../../../shared/california-authority";

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
  versionNotes: Array<{
    sourceKey: string; asOf: string; scope: string; selectedVersionId: string;
    transitionDate: string; note: string;
    versions: Array<{ versionId: string; contentSha256: string; applicableFrom: string; applicableUntil: string | null; historyEvidence: string }>;
  }>;
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
  // Research-only version accounting. This never resolves a runtime license
  // calculation or relaxes the multiple-version hold on correction sources.
  if (review.versionNotes.length !== 1 || review.versionNotes[0].sourceKey !== "VEH:13352") throw new Error("Missing licensing version accounting");
  for (const note of review.versionNotes) {
    const docs = review.documents[note.sourceKey];
    if (note.scope !== "research_only_not_runtime_license_calculation" || !/^\d{4}-\d{2}-\d{2}$/.test(note.asOf) ||
        note.versions.length !== docs.length || new Set(note.versions.map(v => v.versionId)).size !== docs.length) throw new Error("Incomplete version accounting");
    for (const version of note.versions) {
      const doc = docs.find(item => item.versionId === version.versionId);
      if (!doc || doc.contentSha256 !== version.contentSha256 || !version.historyEvidence || !doc.history.includes(version.historyEvidence)) throw new Error("Version evidence changed");
    }
    const current = note.versions.filter(v => v.applicableFrom <= note.asOf && (!v.applicableUntil || note.asOf < v.applicableUntil));
    if (current.length !== 1 || current[0].versionId !== note.selectedVersionId || current[0].applicableUntil !== note.transitionDate ||
        !note.versions.some(v => v.applicableFrom === note.transitionDate && v.versionId !== note.selectedVersionId)) throw new Error("Version date review required");
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
    const dependencies = getCaliforniaCorrectionDependencies(correction);
    const expectedSources = [...new Set([...row.primarySources, ...dependencies.map(({ lawCode, section }) => `${lawCode}:${section}`)])].sort();
    if (JSON.stringify([...row.correctionSources].sort()) !== JSON.stringify(expectedSources)) throw new Error(`Correction evidence incomplete: ${row.id}`);
    if (row.correctionSources.some(key => review.documents[key].length !== 1)) throw new Error(`Correction has unresolved source versions: ${row.id}`);
    const record = getCaliforniaCanonicalRecord(row.id);
    if (!record || record.penalty !== correction.penalty.en || JSON.stringify(record.categories) !== JSON.stringify(correction.categories)) throw new Error(`Catalog correction drift: ${row.id}`);
    for (const { lawCode, section } of dependencies) {
      if (!record.sources.some(source => {
        const url = new URL(source.url);
        return source.kind === "classification" && url.searchParams.get("lawCode") === lawCode && url.searchParams.get("sectionNum")?.replace(/\.$/, "") === section;
      })) throw new Error(`Runtime dependency missing: ${row.id}/${lawCode}:${section}`);
    }
  }
  if (correctedIds.size !== corrections.length || correctedIds.size !== 25) throw new Error("Correction coverage changed");
  return { batchRecords: review.records.length, corrections: correctedIds.size, pending: review.records.length - correctedIds.size, sections: Object.keys(review.documents).length, versions: Object.values(review.documents).reduce((sum, rows) => sum + rows.length, 0) };
}
export function renderCaliforniaReview(review: CaliforniaReview) {
  const counts = validateCaliforniaReview(review);
  return ["# California batch one: corrections and remaining work", "",
    `${counts.batchRecords} existing records accounted for: ${counts.corrections} bounded corrections proposed; ${counts.pending} await this correction pass; deeper legal review remains. ${counts.sections} source sections (${counts.versions} versions) retained. No new charges published.`, "",
    `Archive: ${review.archive.sourceUrl}; modified ${review.archive.lastModified}; acquired ${review.archive.retrievedAt}.`, "",
    ...review.limits.map(limit => `- ${limit}`), "",
    "## Known source transition", "",
    ...review.versionNotes.flatMap(note => [
      `${note.sourceKey}: research as of ${note.asOf}; transition ${note.transitionDate}. ${note.note}`, "",
      ...note.versions.map(version => `- Version ${version.versionId}: ${version.applicableFrom} to ${version.applicableUntil ?? "no stated end"}. ${version.historyEvidence}`), "",
    ]),
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
