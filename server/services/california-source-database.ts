import { and, desc, eq, sql } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { db } from "../db";
import {
  statuteChargeLinks,
  statuteIngestionRuns,
  statuteSourceSnapshots,
  statuteSources,
  statuteUpdateQueue,
} from "@shared/schema";
import {
  assertCaliforniaSourceDatabaseSeed,
  buildCaliforniaSourceDatabaseSeed,
  type CaliforniaSourceDatabaseAudit,
  type CaliforniaSourceDatabaseSeed,
  type CaliforniaSnapshotSeed,
  type CaliforniaSourceSeed,
} from "../data/california-source-database-seed";
import { getCaliforniaCanonicalRecord } from "@shared/california-authority";
import { errLog, opsLog } from "../utils/dev-logger";

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

function snapshotKey(snapshot: CaliforniaSnapshotSeed): string {
  return snapshot.sourceKey;
}

function sourceValues(source: CaliforniaSourceSeed) {
  return {
    sourceKey: source.sourceKey,
    jurisdiction: source.jurisdiction,
    publisher: source.publisher,
    sourceType: source.sourceType,
    canonicalUrl: source.canonicalUrl,
    apiIdentifier: source.apiIdentifier,
    accessPolicy: source.accessPolicy,
    reuseStatus: source.reuseStatus,
    canStoreContent: source.canStoreContent,
    metadata: source.metadata,
    isActive: true,
  };
}

/**
 * Seeds the narrow California authority layer without touching the legacy
 * `statutes` table. Reference-only snapshots are kept current until a human
 * reviews a changed fingerprint; pending snapshots never become charge links.
 */
export async function seedCaliforniaSourceDatabase(
  seed: CaliforniaSourceDatabaseSeed = buildCaliforniaSourceDatabaseSeed(),
): Promise<CaliforniaSourceDatabaseResult> {
  assertCaliforniaSourceDatabaseSeed(seed);
  const runId = randomUUID();
  const startedAt = new Date();
  let snapshotInserted = 0;
  let snapshotReused = 0;
  let changeCount = 0;
  let linkCount = 0;

  await db.insert(statuteIngestionRuns).values({
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
    await db.transaction(async (tx) => {
      const sourceIds = new Map<string, string>();

      for (const source of seed.sources) {
        const [row] = await tx
          .insert(statuteSources)
          .values(sourceValues(source))
          .onConflictDoUpdate({
            target: statuteSources.sourceKey,
            set: {
              canonicalUrl: source.canonicalUrl,
              apiIdentifier: source.apiIdentifier,
              accessPolicy: source.accessPolicy,
              reuseStatus: source.reuseStatus,
              canStoreContent: source.canStoreContent,
              metadata: source.metadata,
              isActive: true,
            },
          })
          .returning({ id: statuteSources.id });

        if (!row) {
          throw new Error(`Unable to upsert California source ${source.sourceKey}`);
        }
        sourceIds.set(source.sourceKey, row.id);
      }

      const activeSnapshotIds = new Map<string, string>();

      for (const snapshot of seed.snapshots) {
        const sourceId = sourceIds.get(snapshot.sourceKey);
        if (!sourceId) {
          throw new Error(`Missing source row for ${snapshot.sourceKey}`);
        }

        const duplicate = await tx
          .select({
            id: statuteSourceSnapshots.id,
            status: statuteSourceSnapshots.status,
          })
          .from(statuteSourceSnapshots)
          .where(and(
            eq(statuteSourceSnapshots.sourceId, sourceId),
            eq(statuteSourceSnapshots.contentHash, snapshot.contentHash),
          ))
          .limit(1);

        let activeSnapshotId: string | undefined;
        if (duplicate[0]) {
          snapshotReused++;
          if (duplicate[0].status === "current") {
            activeSnapshotId = duplicate[0].id;
          }
        }

        const current = await tx
          .select({
            id: statuteSourceSnapshots.id,
            contentHash: statuteSourceSnapshots.contentHash,
          })
          .from(statuteSourceSnapshots)
          .where(and(
            eq(statuteSourceSnapshots.sourceId, sourceId),
            eq(statuteSourceSnapshots.status, "current"),
          ))
          .limit(1);

        if (!duplicate[0]) {
          if (current[0] && current[0].contentHash !== snapshot.contentHash) {
            const [pending] = await tx
              .insert(statuteSourceSnapshots)
              .values({
                sourceId,
                jurisdiction: snapshot.jurisdiction,
                citation: snapshot.citation,
                section: snapshot.section,
                officialTitle: snapshot.officialTitle,
                sourceUrl: snapshot.sourceUrl,
                content: snapshot.content,
                contentHash: snapshot.contentHash,
                hashBasis: snapshot.hashBasis,
                retrievedAt: snapshot.retrievedAt,
                manifestImportedAt: snapshot.manifestImportedAt,
                effectiveDateStart: snapshot.effectiveDateStart,
                effectiveDateEnd: snapshot.effectiveDateEnd,
                status: "pending_review",
                requiresReview: true,
                supersedesSnapshotId: current[0].id,
                metadata: snapshot.metadata,
              })
              .returning({ id: statuteSourceSnapshots.id });

            if (!pending) {
              throw new Error(`Unable to record changed California snapshot ${snapshot.citation}`);
            }
            snapshotInserted++;
            changeCount++;

            const existingQueue = await tx
              .select({ id: statuteUpdateQueue.id })
              .from(statuteUpdateQueue)
              .where(and(
                eq(statuteUpdateQueue.jurisdiction, "CA"),
                eq(statuteUpdateQueue.citation, snapshot.citation),
                eq(statuteUpdateQueue.status, "pending"),
              ))
              .limit(1);

            if (!existingQueue[0]) {
              await tx.insert(statuteUpdateQueue).values({
                jurisdiction: "CA",
                citation: snapshot.citation,
                reason: "source_change",
                triggeredBy: runId,
                priority: "high",
                status: "pending",
                errorMessage: `Reference fingerprint changed for ${snapshot.sourceUrl}; human review required before promotion.`,
              });
            }
            // Keep the prior current snapshot active until the change is reviewed.
            activeSnapshotId = current[0].id;
          } else {
            const [currentInserted] = await tx
              .insert(statuteSourceSnapshots)
              .values({
                sourceId,
                jurisdiction: snapshot.jurisdiction,
                citation: snapshot.citation,
                section: snapshot.section,
                officialTitle: snapshot.officialTitle,
                sourceUrl: snapshot.sourceUrl,
                content: snapshot.content,
                contentHash: snapshot.contentHash,
                hashBasis: snapshot.hashBasis,
                retrievedAt: snapshot.retrievedAt,
                manifestImportedAt: snapshot.manifestImportedAt,
                effectiveDateStart: snapshot.effectiveDateStart,
                effectiveDateEnd: snapshot.effectiveDateEnd,
                status: "current",
                requiresReview: false,
                supersedesSnapshotId: null,
                metadata: snapshot.metadata,
              })
              .returning({ id: statuteSourceSnapshots.id });

            if (!currentInserted) {
              throw new Error(`Unable to insert California snapshot ${snapshot.citation}`);
            }
            snapshotInserted++;
            activeSnapshotId = currentInserted.id;
          }
        }

        // A duplicate pending snapshot still needs the existing current row
        // resolved for the charge relationship.
        if (!activeSnapshotId && current[0]) {
          activeSnapshotId = current[0].id;
        }
        if (!activeSnapshotId) {
          throw new Error(`No active California snapshot for ${snapshot.citation}`);
        }
        activeSnapshotIds.set(snapshotKey(snapshot), activeSnapshotId);
      }

      for (const link of seed.links) {
        const snapshotId = activeSnapshotIds.get(link.snapshotKey);
        if (!snapshotId) {
          throw new Error(`Missing snapshot for California charge ${link.chargeId}`);
        }
        const linkInsert = await tx
          .insert(statuteChargeLinks)
          .values({
            chargeId: link.chargeId,
            snapshotId,
            supportRole: link.supportRole,
            citation: link.citation,
            subdivision: link.subdivision,
            isCurrent: true,
          })
          .onConflictDoNothing({
            target: [
              statuteChargeLinks.chargeId,
              statuteChargeLinks.snapshotId,
              statuteChargeLinks.supportRole,
            ],
          });
        if ((linkInsert.rowCount ?? 0) > 0) linkCount++;
      }

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
    await db
      .update(statuteIngestionRuns)
      .set({
        status: "failed",
        errorCount: 1,
        errorMessage: message,
        completedAt: new Date(),
      })
      .where(eq(statuteIngestionRuns.id, runId));
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
      message,
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
  if (!record || !record.selectable) return null;

  const rows = await db
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
    })
    .from(statuteChargeLinks)
    .innerJoin(statuteSourceSnapshots, eq(statuteChargeLinks.snapshotId, statuteSourceSnapshots.id))
    .innerJoin(statuteSources, eq(statuteSourceSnapshots.sourceId, statuteSources.id))
    .where(and(
      eq(statuteChargeLinks.chargeId, record.canonicalId),
      eq(statuteChargeLinks.isCurrent, true),
      eq(statuteSourceSnapshots.status, "current"),
    ));

  // A charge is not provenance-safe if a current link disappeared during a
  // partial seed. Never return partial authority to guidance or exports.
  if (rows.length !== record.sources.length) return null;

  return {
    chargeId: record.canonicalId,
    officialTitle: record.officialTitle,
    citation: record.citation,
    sources: rows,
  };
}

export const californiaSourceDatabase = {
  seed: seedCaliforniaSourceDatabase,
  getStatus: getCaliforniaSourceDatabaseStatus,
  getChargeProvenance: getCaliforniaChargeProvenance,
};