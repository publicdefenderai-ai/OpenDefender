import { getCaliforniaEvidenceSummary, isCaliforniaEvidenceFresh } from "@shared/california-freshness";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { db } from "../db";
import {
  statuteChargeLinks,
  statuteIngestionRuns,
  statuteSourceSnapshots,
  statuteSources,
} from "@shared/schema";
import {
  assertCaliforniaSourceDatabaseSeed,
  buildCaliforniaSourceDatabaseSeed,
  type CaliforniaSourceDatabaseAudit,
  type CaliforniaSourceDatabaseSeed,
} from "../data/california-source-database-seed";
import { getCaliforniaCanonicalRecord } from "@shared/california-authority";
import { errLog, opsLog } from "../utils/dev-logger";
import { withCaliforniaImportSession, type CaliforniaImportDatabase } from "./california-import-session";
import { writeCaliforniaImportBatches } from "./california-import-batches";

export interface CaliforniaSourceDatabaseResult {
  success: boolean;
  runId: string;
  sourceCount: number;
  snapshotInserted: number;
  snapshotReused: number;
  changeCount: number;
  linkCount: number;
  errorCount: number;
  selectableChargeCount: number;
  catalogRecordCount: number;
  withheldLegacyRecordCount: number;
  audit: CaliforniaSourceDatabaseAudit;
  message: string;
}

export interface CaliforniaSourceDatabaseStatus {
  archiveEvidence: ReturnType<typeof getCaliforniaEvidenceSummary>;
  sourceCount: number;
  snapshotCount: number;
  currentSnapshotCount: number;
  pendingReviewCount: number;
  linkedChargeCount: number;
  selectableChargeCount: number;
  catalogRecordCount: number;
  withheldLegacyRecordCount: number;
  audit: CaliforniaSourceDatabaseAudit;
  lastRun: {
    id: string;
    status: string;
    startedAt: Date;
    completedAt: Date | null;
    changeCount: number;
    errorCount: number;
  } | null;
}

export interface CaliforniaChargeProvenance {
  chargeId: string;
  officialTitle: string;
  citation: string;
  sources: Array<{
    citation: string;
    section: string;
    sourceUrl: string;
    publisher: string;
    sourceType: string;
    retrievedAt: Date | null;
    manifestImportedAt: Date;
    effectiveDateStart: string | null;
    effectiveDateEnd: string | null;
    contentAvailable: boolean;
    contentHash: string;
    hashBasis: string;
    status: string;
  }>;
}

type CaliforniaCurrentProvenanceRow = CaliforniaChargeProvenance["sources"][number];
type CaliforniaEvidenceRow = Pick<
  CaliforniaCurrentProvenanceRow,
  "sourceUrl" | "citation"
> & {
  supportRole: string;
  subdivision: string | null;
};

function supportRoleForSourceKind(kind: "statute" | "jury-instruction" | "classification") {
  switch (kind) {
    case "jury-instruction":
      return "jury_instruction";
    case "classification":
      return "grading";
    case "statute":
      return "offense";
  }
}

function provenanceKey(source: {
  sourceUrl: string;
  supportRole: string;
  citation: string;
  subdivision: string | null;
}): string {
  return [
    source.sourceUrl,
    source.supportRole,
    source.citation,
    source.subdivision ?? "",
  ].join("|");
}

function hasCompleteCaliforniaEvidence(
  record: NonNullable<ReturnType<typeof getCaliforniaCanonicalRecord>>,
  rows: CaliforniaEvidenceRow[],
): boolean {
  const expected = new Set(record.sources.map((source) => provenanceKey({
    sourceUrl: source.url,
    supportRole: supportRoleForSourceKind(source.kind),
    citation: record.citation,
    subdivision: record.code,
  })));
  const actual = new Set(rows.map((row) => provenanceKey(row)));

  return expected.size > 0 &&
    rows.length === expected.size &&
    actual.size === expected.size &&
    [...expected].every((key) => actual.has(key));
}

async function getCurrentCaliforniaProvenanceRows(
  chargeId: string,
): Promise<Array<CaliforniaCurrentProvenanceRow & CaliforniaEvidenceRow>> {
  return db
    .select({
      citation: statuteSourceSnapshots.citation,
      section: statuteSourceSnapshots.section,
      sourceUrl: statuteSourceSnapshots.sourceUrl,
      publisher: statuteSources.publisher,
      sourceType: statuteSources.sourceType,
      retrievedAt: statuteSourceSnapshots.retrievedAt,
      manifestImportedAt: statuteSourceSnapshots.manifestImportedAt,
      effectiveDateStart: statuteSourceSnapshots.effectiveDateStart,
      effectiveDateEnd: statuteSourceSnapshots.effectiveDateEnd,
      contentAvailable: sql<boolean>`${statuteSourceSnapshots.content} is not null`,
      contentHash: statuteSourceSnapshots.contentHash,
      hashBasis: statuteSourceSnapshots.hashBasis,
      status: statuteSourceSnapshots.status,
      supportRole: statuteChargeLinks.supportRole,
      subdivision: statuteChargeLinks.subdivision,
    })
    .from(statuteChargeLinks)
    .innerJoin(statuteSourceSnapshots, eq(statuteChargeLinks.snapshotId, statuteSourceSnapshots.id))
    .innerJoin(statuteSources, eq(statuteSourceSnapshots.sourceId, statuteSources.id))
    .where(and(
      eq(statuteChargeLinks.chargeId, chargeId),
      eq(statuteChargeLinks.isCurrent, true),
      eq(statuteSourceSnapshots.jurisdiction, "CA"),
      eq(statuteSourceSnapshots.status, "current"),
    ));
}

/**
 * Seeds the narrow California authority layer without touching the legacy
 * `statutes` table. Reference-only snapshots are kept current until a human
 * reviews a changed fingerprint; pending snapshots never become charge links.
 */
export async function seedCaliforniaSourceDatabase(
  seed: CaliforniaSourceDatabaseSeed = buildCaliforniaSourceDatabaseSeed(),
): Promise<CaliforniaSourceDatabaseResult> {
  if (!isCaliforniaEvidenceFresh()) throw new Error("California evidence is stale or invalid; refresh and review before seeding");
  assertCaliforniaSourceDatabaseSeed(seed);
  return withCaliforniaImportSession((database, checkDeadline) =>
    seedCaliforniaOnSession(seed, database, checkDeadline));
}

async function seedCaliforniaOnSession(
  seed: CaliforniaSourceDatabaseSeed,
  database: CaliforniaImportDatabase,
  checkDeadline: () => void,
): Promise<CaliforniaSourceDatabaseResult> {
  const runId = randomUUID();
  const startedAt = new Date();
  let snapshotInserted = 0;
  let snapshotReused = 0;
  let changeCount = 0;
  let linkCount = 0;

  checkDeadline();
  await database.insert(statuteIngestionRuns).values({
    id: runId,
    jurisdiction: "CA",
    operation: "seed",
    status: "in_progress",
    sourceCount: seed.sources.length,
    metadata: {
      sourcePolicy: "reference_only",
      catalogRecordCount: seed.catalogRecords.length,
      selectableChargeCount: seed.selectableChargeIds.length,
      selectableChargeIds: seed.selectableChargeIds,
      catalogRecords: seed.catalogRecords,
      legacyInventory: seed.legacyInventory,
      audit: seed.audit,
      generatedAt: seed.generatedAt.toISOString(),
    },
  });

  try {
    await database.transaction(async (tx) => {
      const counts = await writeCaliforniaImportBatches(tx, seed, runId, checkDeadline);
      ({ snapshotInserted, snapshotReused, changeCount, linkCount } = counts);
      checkDeadline();
      if (!isCaliforniaEvidenceFresh()) throw new Error("California evidence expired during import; transaction must roll back.");
      await tx
        .update(statuteIngestionRuns)
        .set({
          status: "completed",
          snapshotCount: snapshotInserted,
          linkCount,
          changeCount,
          completedAt: new Date(),
        })
        .where(eq(statuteIngestionRuns.id, runId));
      checkDeadline();
    });

    const message = `California source database seeded: ${seed.sources.length} sources, ${snapshotInserted} snapshots, ${linkCount} links, ${changeCount} changes queued for review.`;
    opsLog("california-source-db", message);
    return {
      success: true,
      runId,
      sourceCount: seed.sources.length,
      snapshotInserted,
      snapshotReused,
      changeCount,
      linkCount,
      errorCount: 0,
      selectableChargeCount: seed.selectableChargeIds.length,
      catalogRecordCount: seed.catalogRecords.length,
      withheldLegacyRecordCount: seed.audit.inventory.withheldCount,
      audit: seed.audit,
      message,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown California source database error";
    // Everything in the data transaction rolled back, including completion.
    snapshotInserted = 0;
    snapshotReused = 0;
    changeCount = 0;
    linkCount = 0;
    let failureRecorded = false;
    try {
      const recorded = await database.update(statuteIngestionRuns).set({
        status: "failed", errorCount: 1, errorMessage: message, completedAt: new Date(),
      }).where(and(
        eq(statuteIngestionRuns.id, runId),
        eq(statuteIngestionRuns.status, "in_progress"),
      )).returning({ id: statuteIngestionRuns.id });
      // A lost COMMIT acknowledgement must not overwrite a completed run.
      failureRecorded = recorded.length === 1;
    } catch (recordError) {
      errLog("California import failure record could not be saved; inspect primary activity before retrying", recordError);
    }
    errLog("California source database seed failed", error);
    return {
      success: false,
      runId,
      sourceCount: seed.sources.length,
      snapshotInserted,
      snapshotReused,
      changeCount,
      linkCount,
      errorCount: 1,
      selectableChargeCount: seed.selectableChargeIds.length,
      catalogRecordCount: seed.catalogRecords.length,
      withheldLegacyRecordCount: seed.audit.inventory.withheldCount,
      audit: seed.audit,
      message: failureRecorded ? message : `${message} Failure status could not be saved; do not retry without primary verification.`,
    };
  }
}

export async function getCaliforniaSourceDatabaseStatus(): Promise<CaliforniaSourceDatabaseStatus> {
  const [
    sourceCount,
    snapshotCount,
    currentSnapshotCount,
    pendingReviewCount,
    linkedChargeCount,
    lastRun,
  ] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(statuteSources).where(and(
      eq(statuteSources.jurisdiction, "CA"),
      eq(statuteSources.isActive, true),
    )),
    db.select({ count: sql<number>`count(*)` }).from(statuteSourceSnapshots).where(eq(statuteSourceSnapshots.jurisdiction, "CA")),
    db.select({ count: sql<number>`count(*)` }).from(statuteSourceSnapshots).where(and(
      eq(statuteSourceSnapshots.jurisdiction, "CA"),
      eq(statuteSourceSnapshots.status, "current"),
    )),
    db.select({ count: sql<number>`count(*)` }).from(statuteSourceSnapshots).where(and(
      eq(statuteSourceSnapshots.jurisdiction, "CA"),
      eq(statuteSourceSnapshots.requiresReview, true),
    )),
    db.select({ count: sql<number>`count(distinct ${statuteChargeLinks.chargeId})` })
      .from(statuteChargeLinks)
      .innerJoin(statuteSourceSnapshots, eq(statuteChargeLinks.snapshotId, statuteSourceSnapshots.id))
      .where(and(
        eq(statuteSourceSnapshots.jurisdiction, "CA"),
        eq(statuteChargeLinks.isCurrent, true),
      )),
    db.select({
      id: statuteIngestionRuns.id,
      status: statuteIngestionRuns.status,
      startedAt: statuteIngestionRuns.startedAt,
      completedAt: statuteIngestionRuns.completedAt,
      changeCount: statuteIngestionRuns.changeCount,
      errorCount: statuteIngestionRuns.errorCount,
      metadata: statuteIngestionRuns.metadata,
    })
      .from(statuteIngestionRuns)
      .where(eq(statuteIngestionRuns.jurisdiction, "CA"))
      .orderBy(desc(statuteIngestionRuns.startedAt))
      .limit(1),
  ]);

  const metadata = lastRun[0]?.metadata as {
    selectableChargeCount?: number;
    catalogRecordCount?: number;
    audit?: CaliforniaSourceDatabaseAudit;
  } | null;
  const audit = metadata?.audit ?? buildCaliforniaSourceDatabaseSeed(new Date(0)).audit;

  return {
    archiveEvidence: getCaliforniaEvidenceSummary(),
    sourceCount: Number(sourceCount[0]?.count ?? 0),
    snapshotCount: Number(snapshotCount[0]?.count ?? 0),
    currentSnapshotCount: Number(currentSnapshotCount[0]?.count ?? 0),
    pendingReviewCount: Number(pendingReviewCount[0]?.count ?? 0),
    linkedChargeCount: Number(linkedChargeCount[0]?.count ?? 0),
    selectableChargeCount: Number(
      metadata?.selectableChargeCount ??
        buildCaliforniaSourceDatabaseSeed(new Date(0)).selectableChargeIds.length,
    ),
    catalogRecordCount: Number(
      metadata?.catalogRecordCount ?? audit.canonical.selectableRecordCount,
    ),
    withheldLegacyRecordCount: Number(
      metadata?.audit?.inventory?.withheldCount ?? audit.inventory.withheldCount,
    ),
    audit,
    lastRun: lastRun[0]
      ? {
          id: lastRun[0].id,
          status: lastRun[0].status,
          startedAt: lastRun[0].startedAt,
          completedAt: lastRun[0].completedAt,
          changeCount: lastRun[0].changeCount,
          errorCount: lastRun[0].errorCount,
        }
      : null,
  };
}

/**
 * Read current, database-backed provenance only for a selectable canonical
 * charge. Pending snapshots are intentionally excluded until reviewed.
 */
export async function getCaliforniaChargeProvenance(
  chargeId: string,
): Promise<CaliforniaChargeProvenance | null> {
  const record = getCaliforniaCanonicalRecord(chargeId);
  if (!isCaliforniaEvidenceFresh() || !record || !record.selectable || record.currentness.status !== "current") return null;

  const rows = await getCurrentCaliforniaProvenanceRows(record.canonicalId);

  // A charge is not provenance-safe if a current link disappeared during a
  // partial seed. Never return partial authority to guidance or exports.
  if (record.currentness.status !== "current" || !hasCompleteCaliforniaEvidence(record, rows)) return null;

  return {
    chargeId: record.canonicalId,
    officialTitle: record.officialTitle,
    citation: record.citation,
    sources: rows,
  };
}

/**
 * Return only California canonical charges whose complete committed source
 * evidence is still present in the database. The latest completed seed defines
 * the release boundary; the current-link check prevents a partial seed from
 * making an incomplete record available through another route.
 */
export async function getCurrentCaliforniaSelectableChargeIds(): Promise<Set<string>> {
  if (!isCaliforniaEvidenceFresh()) return new Set();
  const [latestRun] = await db
    .select({ metadata: statuteIngestionRuns.metadata })
    .from(statuteIngestionRuns)
    .where(and(
      eq(statuteIngestionRuns.jurisdiction, "CA"),
      eq(statuteIngestionRuns.status, "completed"),
    ))
    .orderBy(desc(statuteIngestionRuns.startedAt))
    .limit(1);
  if (!latestRun) return new Set();

  const metadata = latestRun.metadata as { selectableChargeIds?: unknown } | null;
  const candidateIds = Array.isArray(metadata?.selectableChargeIds)
    ? metadata.selectableChargeIds.filter((value): value is string => typeof value === "string")
    : [];
  if (candidateIds.length === 0) return new Set();

  const currentRows = await db
    .select({
      chargeId: statuteChargeLinks.chargeId,
      citation: statuteSourceSnapshots.citation,
      sourceUrl: statuteSourceSnapshots.sourceUrl,
      supportRole: statuteChargeLinks.supportRole,
      subdivision: statuteChargeLinks.subdivision,
    })
    .from(statuteChargeLinks)
    .innerJoin(statuteSourceSnapshots, eq(statuteChargeLinks.snapshotId, statuteSourceSnapshots.id))
    .where(and(
      inArray(statuteChargeLinks.chargeId, candidateIds),
      eq(statuteChargeLinks.isCurrent, true),
      eq(statuteSourceSnapshots.jurisdiction, "CA"),
      eq(statuteSourceSnapshots.status, "current"),
    ));
  const rowsByCharge = new Map<string, CaliforniaEvidenceRow[]>();
  for (const row of currentRows) {
    const rows = rowsByCharge.get(row.chargeId) ?? [];
    rows.push({
      citation: row.citation,
      sourceUrl: row.sourceUrl,
      supportRole: row.supportRole,
      subdivision: row.subdivision,
    });
    rowsByCharge.set(row.chargeId, rows);
  }

  if (!isCaliforniaEvidenceFresh()) return new Set();
  return new Set(candidateIds.filter((chargeId) => {
    const record = getCaliforniaCanonicalRecord(chargeId);
    return Boolean(
      record?.selectable && record.currentness.status === "current" &&
      hasCompleteCaliforniaEvidence(record, rowsByCharge.get(chargeId) ?? []),
    );
  }));
}

export const californiaSourceDatabase = {
  seed: seedCaliforniaSourceDatabase,
  getStatus: getCaliforniaSourceDatabaseStatus,
  getChargeProvenance: getCaliforniaChargeProvenance,
};