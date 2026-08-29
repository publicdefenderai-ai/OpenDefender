import { createHash } from "node:crypto";
import {
  CALIFORNIA_CANONICAL_RECORDS,
  CALIFORNIA_LEGACY_DISPOSITIONS,
  CALIFORNIA_RESELECTION_ALTERNATIVES,
  getCaliforniaReconciliationInventory,
  type CaliforniaLegacyDisposition,
  type CaliforniaCanonicalRecord,
  type CaliforniaSource,
} from "@shared/california-authority";
import type {
  AuthorityCatalogRecord,
  AuthorityProvisionSeed,
} from "../services/authority-source-database";

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

/**
 * California predates the JSON authority manifests.  Keep the complete
 * legacy inventory explicit while the canonical release records use the same
 * catalog/provision vocabulary as manifest-backed states.
 */
export interface CaliforniaLegacyInventoryRecord extends CaliforniaLegacyDisposition {
  canonicalIds: string[];
  selectable: boolean;
}

export interface CaliforniaSourceDatabaseAudit {
  boundary: "legacy_disposition_inventory";
  inventory: {
    legacyRecordCount: number;
    retainedCount: number;
    aliasCount: number;
    reselectionRequiredCount: number;
    removedCount: number;
    withheldCount: number;
    reselectionAlternativeCount: number;
    uniqueReselectionAlternativeCount: number;
  };
  canonical: {
    recordCount: number;
    selectableRecordCount: number;
    withheldRecordCount: number;
  };
  provenance: {
    sourceCount: number;
    snapshotCount: number;
    linkCount: number;
    sourceTypes: CaliforniaSourceType[];
    publishers: string[];
    accessPolicy: CaliforniaAccessPolicy;
    reuseStatus: CaliforniaReuseStatus;
    contentStored: boolean;
  };
  currentness: {
    status: "current";
    effectiveDateStarts: string[];
    currentSnapshotCount: number;
    allSourcesMarkedCurrentLawText: boolean;
    verificationMethod: "committed_authority_manifest";
    manifestImportedAt: string;
  };
}

export interface CaliforniaSourceDatabaseSeed {
  sources: CaliforniaSourceSeed[];
  snapshots: CaliforniaSnapshotSeed[];
  links: CaliforniaChargeLinkSeed[];
  catalogRecords: AuthorityCatalogRecord[];
  legacyInventory: CaliforniaLegacyInventoryRecord[];
  selectableChargeIds: string[];
  audit: CaliforniaSourceDatabaseAudit;
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

function auditProvisionFor(
  record: CaliforniaCanonicalRecord,
  source: CaliforniaSource,
  sourcePosition: number,
): AuthorityProvisionSeed {
  const sourceKey = buildCaliforniaSourceKey(record, source, sourcePosition);
  return {
    sourceKey,
    lawId: record.lawCode,
    section: source.citation,
    citation: record.citation,
    officialTitle: record.officialTitle,
    sourceUrl: source.url,
    content: null,
    contentHash: buildCaliforniaReferenceHash(record, source),
    hashBasis: "reference_metadata",
    retrievedAt: null,
    effectiveDateStart: record.currentness.effectiveDate,
    effectiveDateEnd: null,
    supportRole: supportRoleFor(source),
    subdivision: record.code,
    metadata: {
      canonicalId: record.canonicalId,
      sourceKind: source.kind,
      sourceCitation: source.citation,
      currentnessEvidence: record.currentness.evidence,
      verificationMethod: "committed_authority_manifest",
      attorneyReview: record.attorneyReview,
    },
  };
}

export function buildCaliforniaLegacyInventory(): CaliforniaLegacyInventoryRecord[] {
  return getCaliforniaReconciliationInventory().map((entry) => ({
    ...entry,
    canonicalIds: entry.canonicalId
      ? [entry.canonicalId]
      : [...(CALIFORNIA_RESELECTION_ALTERNATIVES[entry.legacyId] ?? [])],
    selectable: entry.disposition === "retain" || entry.disposition === "alias",
  }));
}

function buildAudit(
  legacyInventory: CaliforniaLegacyInventoryRecord[],
  selectableRecords: CaliforniaCanonicalRecord[],
  sources: CaliforniaSourceSeed[],
  snapshots: CaliforniaSnapshotSeed[],
  links: CaliforniaChargeLinkSeed[],
  importedAt: Date,
): CaliforniaSourceDatabaseAudit {
  const count = (disposition: CaliforniaLegacyDisposition["disposition"]) =>
    legacyInventory.filter((entry) => entry.disposition === disposition).length;
  const alternatives = legacyInventory
    .filter((entry) => entry.disposition === "reselection-required")
    .flatMap((entry) => entry.canonicalIds);

  return {
    boundary: "legacy_disposition_inventory",
    inventory: {
      legacyRecordCount: legacyInventory.length,
      retainedCount: count("retain"),
      aliasCount: count("alias"),
      reselectionRequiredCount: count("reselection-required"),
      removedCount: count("remove"),
      withheldCount: legacyInventory.filter((entry) => !entry.selectable).length,
      reselectionAlternativeCount: alternatives.length,
      uniqueReselectionAlternativeCount: new Set(alternatives).size,
    },
    canonical: {
      recordCount: CALIFORNIA_CANONICAL_RECORDS.length,
      selectableRecordCount: selectableRecords.length,
      withheldRecordCount: CALIFORNIA_CANONICAL_RECORDS.length - selectableRecords.length,
    },
    provenance: {
      sourceCount: sources.length,
      snapshotCount: snapshots.length,
      linkCount: links.length,
      sourceTypes: [...new Set(sources.map((source) => source.sourceType))],
      publishers: [...new Set(sources.map((source) => source.publisher))],
      accessPolicy: "reference_only",
      reuseStatus: "not_cleared",
      contentStored: snapshots.some((snapshot) => snapshot.content !== null),
    },
    currentness: {
      status: "current",
      effectiveDateStarts: [...new Set(selectableRecords.map((record) => record.currentness.effectiveDate))],
      currentSnapshotCount: snapshots.filter((snapshot) => snapshot.status === "current").length,
      allSourcesMarkedCurrentLawText: sources.every((source) => source.metadata.currentLawText === true),
      verificationMethod: "committed_authority_manifest",
      manifestImportedAt: importedAt.toISOString(),
    },
  };
}

/**
 * Validate both sides of the California legacy exception before a deployment
 * seed is written.  The checks are local and deterministic so a missing row,
 * source, snapshot, or link fails closed instead of silently shrinking the
 * release boundary.
 */
export function validateCaliforniaSourceDatabaseSeed(
  seed: CaliforniaSourceDatabaseSeed,
): string[] {
  const errors: string[] = [];
  const ids = (values: Array<{ legacyId?: string; canonicalId?: string }>, key: "legacyId" | "canonicalId") =>
    values.map((value) => value[key]).filter((value): value is string => Boolean(value));
  const legacyIds = ids(seed.legacyInventory, "legacyId");
  if (legacyIds.length !== seed.legacyInventory.length || new Set(legacyIds).size !== legacyIds.length) {
    errors.push("California legacy inventory must contain unique legacy IDs");
  }
  if (legacyIds.length !== CALIFORNIA_LEGACY_DISPOSITIONS.length) {
    errors.push(`California legacy inventory must contain ${CALIFORNIA_LEGACY_DISPOSITIONS.length} rows`);
  }
  const expectedLegacyIds = new Set(CALIFORNIA_LEGACY_DISPOSITIONS.map((entry) => entry.legacyId));
  if (legacyIds.some((id) => !expectedLegacyIds.has(id)) ||
      [...expectedLegacyIds].some((id) => !legacyIds.includes(id))) {
    errors.push("California legacy inventory does not match the committed legacy catalog boundary");
  }
  const expectedLegacyById = new Map(
    CALIFORNIA_LEGACY_DISPOSITIONS.map((entry) => [entry.legacyId, entry]),
  );
  for (const entry of seed.legacyInventory) {
    const expected = expectedLegacyById.get(entry.legacyId);
    if (!expected) continue;
    const expectedCanonicalIds = expected.canonicalId
      ? [expected.canonicalId]
      : [...(CALIFORNIA_RESELECTION_ALTERNATIVES[expected.legacyId] ?? [])];
    if (
      entry.disposition !== expected.disposition ||
      entry.canonicalId !== expected.canonicalId ||
      entry.reason !== expected.reason ||
      entry.selectable !== (expected.disposition === "retain" || expected.disposition === "alias") ||
      JSON.stringify(entry.canonicalIds) !== JSON.stringify(expectedCanonicalIds)
    ) {
      errors.push(`California legacy disposition changed for ${entry.legacyId}`);
    }
  }

  const selectableIds = new Set(seed.selectableChargeIds);
  const catalogIds = seed.catalogRecords.map((record) => record.chargeId);
  if (new Set(catalogIds).size !== catalogIds.length ||
      catalogIds.length !== seed.selectableChargeIds.length ||
      catalogIds.some((id) => !selectableIds.has(id)) ||
      [...selectableIds].some((id) => !catalogIds.includes(id))) {
    errors.push("California catalog records and selectable charge IDs are out of sync");
  }
  if (seed.catalogRecords.some((record) =>
    record.disposition !== "retain" ||
    record.provisions.length === 0 ||
    record.apiStatus !== "verified",
  )) {
    errors.push("Every selectable California catalog record must retain verified authority provisions");
  }

  const sourceKeys = new Set(seed.sources.map((source) => source.sourceKey));
  if (sourceKeys.size !== seed.sources.length) errors.push("California sources must have unique source keys");
  for (const snapshot of seed.snapshots) {
    if (!sourceKeys.has(snapshot.sourceKey)) errors.push(`California snapshot has no source: ${snapshot.sourceKey}`);
    if (snapshot.status !== "current" || snapshot.requiresReview || snapshot.content !== null ||
        snapshot.retrievedAt !== null || snapshot.hashBasis !== "reference_metadata") {
      errors.push(`California snapshot is not a fail-closed reference snapshot: ${snapshot.sourceKey}`);
    }
  }
  const snapshotKeys = new Set(seed.snapshots.map((snapshot) => snapshot.sourceKey));
  for (const link of seed.links) {
    if (!selectableIds.has(link.chargeId) || !snapshotKeys.has(link.snapshotKey)) {
      errors.push(`California link is outside the selectable authority boundary: ${link.chargeId}`);
    }
  }
  if (seed.sources.some((source) =>
    source.accessPolicy !== "reference_only" ||
    source.reuseStatus !== "not_cleared" ||
    source.canStoreContent ||
    source.lastRetrievedAt !== null ||
    source.lastCheckedAt !== null,
  )) {
    errors.push("California source policy must remain reference-only and unretrieved");
  }
  if (JSON.stringify(seed).toLowerCase().includes("openlaws")) {
    errors.push("California authority seed must not contain OpenLaws references");
  }
  if (seed.audit.inventory.legacyRecordCount !== seed.legacyInventory.length ||
      seed.audit.canonical.selectableRecordCount !== seed.selectableChargeIds.length ||
      seed.audit.provenance.sourceCount !== seed.sources.length ||
      seed.audit.provenance.snapshotCount !== seed.snapshots.length ||
      seed.audit.provenance.linkCount !== seed.links.length ||
      seed.audit.currentness.currentSnapshotCount !== seed.snapshots.length) {
    errors.push("California authority audit facts do not match the seed rows");
  }
  return errors;
}

export function assertCaliforniaSourceDatabaseSeed(seed: CaliforniaSourceDatabaseSeed): void {
  const errors = validateCaliforniaSourceDatabaseSeed(seed);
  if (errors.length > 0) throw new Error(errors.join("; "));
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
  const legacyInventory = buildCaliforniaLegacyInventory();
  const currentIds = legacyInventory.map((entry) => entry.legacyId);
  // This is the explicit legacy exception: unlike JSON-manifest states, its
  // committed inventory is the typed disposition table in shared code.
  if (currentIds.length !== CALIFORNIA_LEGACY_DISPOSITIONS.length) {
    throw new Error("California legacy disposition inventory is incomplete");
  }
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

  const seed: CaliforniaSourceDatabaseSeed = {
    sources: [...sourceMap.values()],
    snapshots,
    links,
    catalogRecords: selectableRecords.map((record) => ({
      chargeId: record.canonicalId,
      catalogLabel: record.officialTitle,
      catalogCode: record.code,
      catalogCategory: record.classification,
      disposition: "retain",
      dispositionReason: "Canonical California record is backed by the committed authority boundary.",
      canonicalTitle: record.officialTitle,
      provisions: record.sources.map((source, sourcePosition) =>
        auditProvisionFor(record, source, sourcePosition)),
      apiStatus: "verified",
    })),
    legacyInventory,
    selectableChargeIds: selectableRecords.map((record) => record.canonicalId),
    audit: buildAudit(
      legacyInventory,
      selectableRecords,
      [...sourceMap.values()],
      snapshots,
      links,
      retrievedAt,
    ),
    generatedAt: retrievedAt,
  };
  assertCaliforniaSourceDatabaseSeed(seed);
  return seed;
}

export const californiaSourceDatabaseSeed = buildCaliforniaSourceDatabaseSeed;