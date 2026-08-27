import { createHash } from "node:crypto";
import {
  CALIFORNIA_CANONICAL_RECORDS,
  type CaliforniaCanonicalRecord,
  type CaliforniaSource,
} from "@shared/california-authority";

export type CaliforniaSourceType = "statute" | "jury_instruction" | "classification";
export type CaliforniaAccessPolicy = "reference_only" | "store_text";
export type CaliforniaReuseStatus = "permitted" | "restricted" | "not_cleared";
export type CaliforniaSnapshotHashBasis = "source_content" | "reference_metadata";

export interface CaliforniaSourceSeed {
  sourceKey: string;
  jurisdiction: "CA";
  publisher: string;
  sourceType: CaliforniaSourceType;
  canonicalUrl: string;
  apiIdentifier: string | null;
  accessPolicy: CaliforniaAccessPolicy;
  reuseStatus: CaliforniaReuseStatus;
  canStoreContent: boolean;
  lastRetrievedAt: null;
  lastCheckedAt: null;
  metadata: Record<string, unknown>;
}

export interface CaliforniaSnapshotSeed {
  sourceKey: string;
  jurisdiction: "CA";
  citation: string;
  section: string;
  officialTitle: string;
  sourceUrl: string;
  content: null;
  contentHash: string;
  hashBasis: CaliforniaSnapshotHashBasis;
  retrievedAt: null;
  manifestImportedAt: Date;
  effectiveDateStart: string;
  effectiveDateEnd: null;
  status: "current";
  requiresReview: false;
  supersedesSnapshotId: null;
  metadata: {
    canonicalId: string;
    sourceKind: CaliforniaSource["kind"];
    sourceCitation: string;
    subdivision: string;
    currentnessEvidence: string;
    authorityEvidenceDate: string | null;
    verificationMethod: "committed_authority_manifest";
    attorneyReview: "pending";
  };
}

export interface CaliforniaChargeLinkSeed {
  chargeId: string;
  snapshotKey: string;
  supportRole: "offense" | "grading" | "penalty" | "currentness" | "jury_instruction";
  citation: string;
  subdivision: string;
}

export interface CaliforniaSourceDatabaseSeed {
  sources: CaliforniaSourceSeed[];
  snapshots: CaliforniaSnapshotSeed[];
  links: CaliforniaChargeLinkSeed[];
  selectableChargeIds: string[];
  generatedAt: Date;
}

const REFERENCE_ONLY_POLICY: Pick<
  CaliforniaSourceSeed,
  "accessPolicy" | "reuseStatus" | "canStoreContent"
> = {
  // California's current site disallows automated crawling. Until an expressly
  // permitted bulk/API channel is documented, retain official references and
  // fingerprints but do not fetch or store the source text.
  accessPolicy: "reference_only",
  reuseStatus: "not_cleared",
  canStoreContent: false,
};

function sourceTypeFor(source: CaliforniaSource): CaliforniaSourceType {
  if (source.kind === "jury-instruction") return "jury_instruction";
  return source.kind;
}

export function buildCaliforniaSourceKey(
  record: CaliforniaCanonicalRecord,
  source: CaliforniaSource,
  sourcePosition: number,
): string {
  // canonicalId + source role + position are stable across URL, title,
  // citation, and subdivision corrections. Those mutable provenance fields
  // must be detected by snapshot comparison, not used as row identity.
  return `ca:${record.canonicalId}:${source.kind}:${sourcePosition}`;
}

function snapshotKeyFor(
  record: CaliforniaCanonicalRecord,
  source: CaliforniaSource,
  sourcePosition: number,
): string {
  return buildCaliforniaSourceKey(record, source, sourcePosition);
}

/**
 * A reference-only snapshot is hashed from the exact citation, subdivision,
 * title, URL, and currentness evidence. It is deliberately labeled as
 * reference_metadata so it is never mistaken for a hash of source text.
 */
export function buildCaliforniaReferenceHash(
  record: CaliforniaCanonicalRecord,
  source: CaliforniaSource,
): string {
  const reference = {
    canonicalId: record.canonicalId,
    citation: record.citation,
    sourceCitation: source.citation,
    sourceKind: source.kind,
    sourceUrl: source.url,
    officialTitle: record.officialTitle,
    subdivision: record.code,
    effectiveDate: record.currentness.effectiveDate,
    currentnessEvidence: record.currentness.evidence,
  };
  return createHash("sha256").update(JSON.stringify(reference)).digest("hex");
}

function authorityEvidenceDate(record: CaliforniaCanonicalRecord): string | null {
  return record.currentness.evidence.match(/checked\s+(\d{4}-\d{2}(?:-\d{2})?)/i)?.[1] ?? null;
}

function supportRoleFor(source: CaliforniaSource): CaliforniaChargeLinkSeed["supportRole"] {
  switch (source.kind) {
    case "jury-instruction":
      return "jury_instruction";
    case "classification":
      return "grading";
    case "statute":
      return "offense";
  }
}

/**
 * Build the narrow California database manifest from the canonical release
 * boundary. The default timestamp is injectable so refreshes and tests can
 * produce reproducible audit records.
 */
export function buildCaliforniaSourceDatabaseSeed(
  retrievedAt: Date = new Date(),
): CaliforniaSourceDatabaseSeed {
  const selectableRecords = CALIFORNIA_CANONICAL_RECORDS.filter((record) => record.selectable);
  const sourceMap = new Map<string, CaliforniaSourceSeed>();
  const snapshots: CaliforniaSnapshotSeed[] = [];
  const links: CaliforniaChargeLinkSeed[] = [];

  for (const record of selectableRecords) {
    for (const [sourcePosition, source] of record.sources.entries()) {
      const sourceKey = buildCaliforniaSourceKey(record, source, sourcePosition);
      if (!sourceMap.has(sourceKey)) {
        sourceMap.set(sourceKey, {
          sourceKey,
          jurisdiction: "CA",
          publisher: source.publisher,
          sourceType: sourceTypeFor(source),
          canonicalUrl: source.url,
          apiIdentifier: null,
          ...REFERENCE_ONLY_POLICY,
          lastRetrievedAt: null,
          lastCheckedAt: null,
          metadata: {
            releaseManifest: "CALIFORNIA_SOURCE_MANIFEST",
            currentLawText: source.currentLawText,
            canonicalId: record.canonicalId,
            sourcePosition,
          },
        });
      }

      const snapshotKey = snapshotKeyFor(record, source, sourcePosition);
      snapshots.push({
        sourceKey,
        jurisdiction: "CA",
        citation: record.citation,
        section: source.citation,
        officialTitle: record.officialTitle,
        sourceUrl: source.url,
        content: null,
        contentHash: buildCaliforniaReferenceHash(record, source),
        hashBasis: "reference_metadata",
          retrievedAt: null,
          manifestImportedAt: retrievedAt,
        effectiveDateStart: record.currentness.effectiveDate,
        effectiveDateEnd: null,
        status: "current",
        requiresReview: false,
        supersedesSnapshotId: null,
        metadata: {
          canonicalId: record.canonicalId,
          sourceKind: source.kind,
          sourceCitation: source.citation,
          subdivision: record.code,
          currentnessEvidence: record.currentness.evidence,
          authorityEvidenceDate: authorityEvidenceDate(record),
          verificationMethod: "committed_authority_manifest",
          attorneyReview: record.attorneyReview,
        },
      });
      links.push({
        chargeId: record.canonicalId,
        snapshotKey,
        supportRole: supportRoleFor(source),
        citation: record.citation,
        subdivision: record.code,
      });
    }
  }

  return {
    sources: [...sourceMap.values()],
    snapshots,
    links,
    selectableChargeIds: selectableRecords.map((record) => record.canonicalId),
    generatedAt: retrievedAt,
  };
}

export const californiaSourceDatabaseSeed = buildCaliforniaSourceDatabaseSeed;