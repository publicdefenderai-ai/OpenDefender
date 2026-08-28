import { describe, expect, it } from "vitest";
import type {
  CaliforniaSourceDatabaseSeed,
  CaliforniaSnapshotSeed,
  CaliforniaSourceSeed,
} from "../server/data/california-source-database-seed";

const runIntegration = process.env.RUN_CALIFORNIA_SOURCE_DB_INTEGRATION === "1";

describe.skipIf(!runIntegration)("California source database persistence", () => {
  it("keeps the old current link when URL, citation, title, subdivision, or currentness changes", async () => {
    const { db } = await import("../server/db");
    const {
      statuteChargeLinks,
      statuteIngestionRuns,
      statuteSourceSnapshots,
      statuteSources,
      statuteUpdateQueue,
    } = await import("@shared/schema");
    const { and, eq } = await import("drizzle-orm");
    const { seedCaliforniaSourceDatabase } = await import("../server/services/california-source-database");

    const baseSource: Omit<CaliforniaSourceSeed, "sourceKey"> = {
      jurisdiction: "CA",
      publisher: "California Legislative Information",
      sourceType: "statute",
      canonicalUrl: "https://example.gov/section/1",
      apiIdentifier: null,
      accessPolicy: "reference_only",
      reuseStatus: "not_cleared",
      canStoreContent: false,
      lastRetrievedAt: null,
      lastCheckedAt: null,
      metadata: { integrationTest: true },
    };
    const baseSnapshot: Omit<CaliforniaSnapshotSeed, "sourceKey" | "contentHash"> = {
      jurisdiction: "CA",
      citation: "Cal. Penal Code § 1(a)",
      section: "Cal. Penal Code § 1",
      officialTitle: "Integration Test Charge",
      sourceUrl: baseSource.canonicalUrl,
      content: null,
      hashBasis: "reference_metadata",
      retrievedAt: null,
      manifestImportedAt: new Date("2026-08-27T12:00:00.000Z"),
      effectiveDateStart: "2026-08",
      effectiveDateEnd: null,
      status: "current",
      requiresReview: false,
      supersedesSnapshotId: null,
      metadata: {
        canonicalId: "ca-integration-test",
        sourceKind: "statute",
        sourceCitation: "Cal. Penal Code § 1",
        subdivision: "1(a)",
        currentnessEvidence: "integration test",
        attorneyReview: "pending",
      },
    };

    const runIds: string[] = [];
    const sourceKeys: string[] = [];
    const queueCitations = new Set<string>();
    const makeSeed = (
      suffix: string,
      changes: {
        url?: string;
        citation?: string;
        title?: string;
        subdivision?: string;
        effectiveDate?: string;
      } = {},
    ): CaliforniaSourceDatabaseSeed => {
      const sourceKey = `test:ca:stable-source:${suffix}`;
      const url = changes.url ?? baseSource.canonicalUrl;
      sourceKeys.push(sourceKey);
      return {
        sources: [{ ...baseSource, sourceKey, canonicalUrl: url }],
        snapshots: [{
          ...baseSnapshot,
          sourceKey,
          sourceUrl: url,
          citation: changes.citation ?? baseSnapshot.citation,
          officialTitle: changes.title ?? baseSnapshot.officialTitle,
          effectiveDateStart: changes.effectiveDate ?? baseSnapshot.effectiveDateStart,
          contentHash: `hash-${suffix}-${url}-${changes.citation ?? ""}-${changes.title ?? ""}-${changes.subdivision ?? ""}-${changes.effectiveDate ?? ""}`,
          metadata: {
            ...baseSnapshot.metadata,
            subdivision: changes.subdivision ?? baseSnapshot.metadata.subdivision,
          },
        }],
        links: [{
          chargeId: "ca-integration-test",
          snapshotKey: sourceKey,
          supportRole: "offense",
          citation: changes.citation ?? baseSnapshot.citation,
          subdivision: changes.subdivision ?? baseSnapshot.metadata.subdivision,
        }],
        selectableChargeIds: ["ca-integration-test"],
        generatedAt: baseSnapshot.manifestImportedAt,
      };
    };

    try {
      const cases = [
        { name: "url", changes: { url: "https://example.gov/section/1?revision=2" } },
        { name: "citation", changes: { citation: "Cal. Penal Code § 1(b)" } },
        { name: "title", changes: { title: "Corrected Integration Test Charge" } },
        { name: "subdivision", changes: { subdivision: "1(b)" } },
        { name: "currentness", changes: { effectiveDate: "2026-09" } },
      ];

      for (const testCase of cases) {
        const initial = await seedCaliforniaSourceDatabase(makeSeed(testCase.name));
        runIds.push(initial.runId);
        expect(initial.success).toBe(true);

        const changed = await seedCaliforniaSourceDatabase(makeSeed(testCase.name, testCase.changes));
        runIds.push(changed.runId);
        if (testCase.changes.citation) queueCitations.add(testCase.changes.citation);
        expect(changed.success).toBe(true);
        expect(changed.changeCount).toBe(1);
        expect(changed.linkCount).toBe(0);

        const [source] = await db
          .select({
            id: statuteSources.id,
            lastRetrievedAt: statuteSources.lastRetrievedAt,
            lastCheckedAt: statuteSources.lastCheckedAt,
          })
          .from(statuteSources)
          .where(eq(statuteSources.sourceKey, `test:ca:stable-source:${testCase.name}`));
        expect(source).toBeDefined();
        expect(source!.lastRetrievedAt).toBeNull();
        expect(source!.lastCheckedAt).toBeNull();

        const snapshots = await db
          .select({
            status: statuteSourceSnapshots.status,
            requiresReview: statuteSourceSnapshots.requiresReview,
            sourceUrl: statuteSourceSnapshots.sourceUrl,
            retrievedAt: statuteSourceSnapshots.retrievedAt,
            manifestImportedAt: statuteSourceSnapshots.manifestImportedAt,
          })
          .from(statuteSourceSnapshots)
          .where(eq(statuteSourceSnapshots.sourceId, source!.id));
        expect(snapshots.filter((snapshot) => snapshot.status === "current")).toHaveLength(1);
        expect(snapshots.filter((snapshot) => snapshot.status === "pending_review")).toHaveLength(1);
        expect(snapshots.find((snapshot) => snapshot.status === "pending_review")?.requiresReview).toBe(true);
        expect(snapshots.every((snapshot) => snapshot.retrievedAt === null)).toBe(true);
        expect(snapshots.every((snapshot) => snapshot.manifestImportedAt instanceof Date)).toBe(true);

        const links = await db
          .select({ snapshotId: statuteChargeLinks.snapshotId })
          .from(statuteChargeLinks)
          .innerJoin(
            statuteSourceSnapshots,
            eq(statuteChargeLinks.snapshotId, statuteSourceSnapshots.id),
          )
          .where(and(
            eq(statuteChargeLinks.chargeId, "ca-integration-test"),
            eq(statuteChargeLinks.isCurrent, true),
            eq(statuteSourceSnapshots.sourceId, source!.id),
          ));
        expect(links).toHaveLength(1);
      }
    } finally {
      for (const runId of runIds) {
        await db.delete(statuteIngestionRuns).where(eq(statuteIngestionRuns.id, runId));
      }
      queueCitations.add(baseSnapshot.citation);
      for (const citation of queueCitations) {
        await db.delete(statuteUpdateQueue).where(eq(statuteUpdateQueue.citation, citation));
      }
      for (const sourceKey of sourceKeys) {
        await db.delete(statuteSources).where(eq(statuteSources.sourceKey, sourceKey));
      }
    }
  });
});