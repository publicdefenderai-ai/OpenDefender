/** Reusable checks for bounded batches with single versions or explicitly scoped common-version evidence. */
import { createHash } from "node:crypto";
import { getCaliforniaCanonicalRecord, getCaliforniaCorrectionDependencies } from "../../../shared/california-authority";
export const californiaEvidenceHash = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
export interface SupplementalSource { lawCode: string; section: string; versionId: string; contentXml: string; contentSha256: string; effectiveDate: string | null; sourceUrl: string }
export interface SupplementalReview {
  schemaVersion: number; scope: string; archiveSha256: string; sourceAsOf: string;
  commonVersionEvidence?: Array<{ key: string; scope: string; passages: string[] }>;
  documents: Record<string, SupplementalSource[]>;
  records: Array<{ id: string; status: string; baselineSha256: string; correctionSha256: string; remainingWork: string; sources: Array<{ key: string; versions: Array<{ versionId: string; contentSha256: string }> }> }>;
}
export function validateSupplementalCaliforniaReview(input: {
  review: SupplementalReview;
  baseline: { records: Array<{ catalogSha256: string; record: { canonicalId: string; sources: Array<{ kind: string; url: string }> } }> };
  corrections: Array<{ id: string; categories: string[]; supportingSections: string[]; supportingVehicleSections?: string[]; supportingHealthSections?: string[]; supportingBusinessSections?: string[]; penalty: { en: string } }>;
  retained: Record<string, SupplementalSource[]>; archiveSha256: string; sourceAsOf: string; expectedCount: number;
}) {
  const { review, baseline, corrections, retained } = input;
  if (review.schemaVersion !== 1 || review.scope !== "bounded_shared_source_corrections_not_full_legal_certification" || review.archiveSha256 !== input.archiveSha256 || review.sourceAsOf !== input.sourceAsOf) throw new Error("Supplemental provenance changed");
  for (const key of Object.keys(review.documents)) if (key in retained) throw new Error("Supplemental source shadows retained evidence");
  const documents = { ...retained, ...review.documents };
  for (const [key, versions] of Object.entries(documents)) {
    if (!versions.length || new Set(versions.map(v => v.versionId)).size !== versions.length) throw new Error("Duplicate or missing source version");
    for (const doc of versions) {
      const url = new URL(doc.sourceUrl);
      if (`${doc.lawCode}:${doc.section.replace(/\.$/, "")}` !== key || createHash("sha256").update(doc.contentXml).digest("hex") !== doc.contentSha256 || url.hostname !== "leginfo.legislature.ca.gov" || `${url.searchParams.get("lawCode")}:${url.searchParams.get("sectionNum")?.replace(/\.$/, "")}` !== key) throw new Error("Supplemental source changed");
    }
  }
  const common = review.commonVersionEvidence ?? [];
  if (new Set(common.map(item => item.key)).size !== common.length) throw new Error("Duplicate common-version evidence");
  for (const item of common) {
    const versions = documents[item.key];
    if (!item.scope.trim() || !item.passages.length || !versions || versions.length < 2) throw new Error("Invalid common-version evidence");
    for (const passage of item.passages) {
      if (!passage.trim() || versions.some(doc => !doc.contentXml.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().includes(passage))) throw new Error("Common passage missing from a source version");
    }
  }
  const expectedIds = baseline.records.map(row => row.record.canonicalId).sort();
  if (expectedIds.length !== input.expectedCount || new Set(expectedIds).size !== input.expectedCount || JSON.stringify(review.records.map(row => row.id).sort()) !== JSON.stringify(expectedIds) || JSON.stringify(corrections.map(row => row.id).sort()) !== JSON.stringify(expectedIds)) throw new Error("Supplemental accounting changed");
  for (const row of review.records) {
    const original = baseline.records.find(item => item.record.canonicalId === row.id)!;
    const correction = corrections.find(item => item.id === row.id)!;
    if (californiaEvidenceHash(original.record) !== original.catalogSha256 || row.baselineSha256 !== original.catalogSha256) throw new Error("Supplemental baseline changed");
    if (row.status !== "bounded_correction_proposed" || californiaEvidenceHash(correction) !== row.correctionSha256 || !row.remainingWork) throw new Error("Supplemental correction changed");
    const current = getCaliforniaCanonicalRecord(row.id);
    if (!current?.selectable || current.penalty !== correction.penalty.en || JSON.stringify(current.categories) !== JSON.stringify(correction.categories)) throw new Error("Supplemental catalog drift");
    const primary = original.record.sources.filter(s => s.kind === "statute").map(s => { const u = new URL(s.url); return `${u.searchParams.get("lawCode")}:${u.searchParams.get("sectionNum")?.replace(/\.$/, "")}`; });
    const deps = getCaliforniaCorrectionDependencies(correction);
    const expected = [...new Set([...primary, ...deps.map(d => `${d.lawCode}:${d.section}`)])].sort();
    if (JSON.stringify(row.sources.map(s => s.key).sort()) !== JSON.stringify(expected)) throw new Error("Supplemental dependencies incomplete");
    for (const source of row.sources) {
      const versions = documents[source.key];
      if (versions?.some(doc => doc.effectiveDate && doc.effectiveDate.slice(0, 10) > review.sourceAsOf)) throw new Error("Future source requires separate review");
      const expectedBindings = versions?.map(doc => ({ versionId: doc.versionId, contentSha256: doc.contentSha256 }));
      if (!versions || (versions.length !== 1 && !common.some(item => item.key === source.key)) || JSON.stringify(source.versions) !== JSON.stringify(expectedBindings)) throw new Error("Supplemental version evidence incomplete or ambiguous");
    }
    for (const dep of deps) if (!current.sources.some(source => { const u = new URL(source.url); return source.kind === "classification" && u.searchParams.get("lawCode") === dep.lawCode && u.searchParams.get("sectionNum")?.replace(/\.$/, "") === dep.section; })) throw new Error("Supplemental runtime dependency missing");
  }
  const used = new Set(review.records.flatMap(row => row.sources.map(s => s.key)));
  if (common.some(item => !used.has(item.key))) throw new Error("Unused common-version evidence");
  if (Object.keys(review.documents).some(key => !used.has(key))) throw new Error("Unused new source");
  return { corrections: review.records.length, addedSections: Object.keys(review.documents).length, addedVersions: Object.values(review.documents).reduce((n,v) => n + v.length, 0), sharedSources: used.size };
}
