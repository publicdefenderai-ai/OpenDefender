import { describe, expect, it } from "vitest";

const runIntegration = process.env.RUN_TEXAS_SOURCE_DB_INTEGRATION === "1";

describe.skipIf(!runIntegration)("Texas source database persistence", () => {
  it("fails closed when a current TCSS snapshot changes and enters pending review", async () => {
    const { db } = await import("../server/db");
    const {
      statuteChargeLinks,
      statuteIngestionRuns,
      statuteSourceSnapshots,
      statuteSources,
      statuteUpdateQueue,
    } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    const {
      getAuthorityChargeProvenance,
      getCurrentAuthoritySelectableChargeIds,
      seedAuthoritySourceDatabase,
    } = await import("../server/services/authority-source-database");

    const chargeId = "tx-integration-pending-review";
    const sourceKey = "tx:integration:pending-review";
    const importedAt = new Date("2026-08-28T00:00:00.000Z");
    const runIds: string[] = [];

    const makeSeed = (
      contentHash: string,
      effectiveDateStart = "September 1, 2025",
    ) => ({
      jurisdiction: "TX",
      sourcePolicy: "integration_test",
      sources: [{
        sourceKey,
        jurisdiction: "TX",
        publisher: "Texas Legislative Council TCSS",
        sourceType: "statute",
        canonicalUrl: "https://tcss.legis.texas.gov/resources/PE/htm/PE.22.htm#22.02",
        apiIdentifier: "PE/22.02",
        accessPolicy: "store_text",
        reuseStatus: "permitted",
        canStoreContent: true,
        lastRetrievedAt: importedAt,
        lastCheckedAt: importedAt,
        metadata: { integrationTest: true },
      }],
      snapshots: [{
        sourceKey,
        jurisdiction: "TX",
        citation: "Tex. Penal Code § 22.02",
        section: "PE/22.02",
        officialTitle: "AGGRAVATED ASSAULT.",
        sourceUrl: "https://tcss.legis.texas.gov/resources/PE/htm/PE.22.htm#22.02",
        content: `integration test source text ${contentHash}`,
        contentHash,
        hashBasis: "source_content",
        retrievedAt: importedAt,
        manifestImportedAt: importedAt,
        effectiveDateStart,
        effectiveDateEnd: null,
        status: "current",
        requiresReview: false,
        supersedesSnapshotId: null,
        metadata: {
          integrationTest: true,
          fingerprint: `${contentHash}:${effectiveDateStart}`,
        },
      }],
      links: [{
        chargeId,
        snapshotKey: sourceKey,
        supportRole: "offense",
        citation: "Tex. Penal Code § 22.02",
        subdivision: null,
      }],
      catalogRecords: [{
        chargeId,
        catalogLabel: "Integration Test Charge",
        catalogCode: "PE 22.02",
        catalogCategory: "Assault",
        disposition: "retain",
        dispositionReason: "Integration test",
        canonicalTitle: "AGGRAVATED ASSAULT.",
        provisions: [{
          sourceKey,
          lawId: "PE",
          section: "22.02",
          citation: "Tex. Penal Code § 22.02",
          officialTitle: "AGGRAVATED ASSAULT.",
          sourceUrl: "https://tcss.legis.texas.gov/resources/PE/htm/PE.22.htm#22.02",
          content: `integration test source text ${contentHash}`,
          contentHash,
          hashBasis: "source_content",
          retrievedAt: importedAt,
          effectiveDateStart,
          effectiveDateEnd: null,
          supportRole: "offense",
          subdivision: null,
          metadata: { fingerprint: `${contentHash}:${effectiveDateStart}` },
        }],
        apiStatus: "verified",
      }],
      selectableChargeIds: [chargeId],
      generatedAt: importedAt,
    });

    try {
      const first = await seedAuthoritySourceDatabase(makeSeed("hash-initial"));
      runIds.push(first.runId);
      expect(first.success).toBe(true);
      expect((await getCurrentAuthoritySelectableChargeIds("TX")).has(chargeId)).toBe(true);
      expect(await getAuthorityChargeProvenance("TX", chargeId)).not.toBeNull();

      const metadataCorrection = await seedAuthoritySourceDatabase(
        makeSeed("hash-initial", "September 1, 2026"),
      );
      runIds.push(metadataCorrection.runId);
      expect(metadataCorrection.changeCount).toBe(0);
      expect((await getCurrentAuthoritySelectableChargeIds("TX")).has(chargeId)).toBe(true);

      const changed = await seedAuthoritySourceDatabase(makeSeed("hash-changed"));
      runIds.push(changed.runId);
      expect(changed.success).toBe(true);
      expect(changed.changeCount).toBeGreaterThan(0);
      expect((await getCurrentAuthoritySelectableChargeIds("TX")).has(chargeId)).toBe(false);
      expect(await getAuthorityChargeProvenance("TX", chargeId)).toBeNull();
    } finally {
      const sourceRows = await db.select({ id: statuteSources.id })
        .from(statuteSources).where(eq(statuteSources.sourceKey, sourceKey));
      const sourceIds = sourceRows.map((row) => row.id);
      if (sourceIds.length > 0) {
        const snapshotRows = await db.select({ id: statuteSourceSnapshots.id })
          .from(statuteSourceSnapshots).where(eq(statuteSourceSnapshots.sourceId, sourceIds[0]));
        const snapshotIds = snapshotRows.map((row) => row.id);
        if (snapshotIds.length > 0) {
          await db.delete(statuteChargeLinks)
            .where(eq(statuteChargeLinks.snapshotId, snapshotIds[0]));
        }
        await db.delete(statuteSourceSnapshots)
          .where(eq(statuteSourceSnapshots.sourceId, sourceIds[0]));
        await db.delete(statuteSources).where(eq(statuteSources.id, sourceIds[0]));
      }
      await db.delete(statuteUpdateQueue)
        .where(eq(statuteUpdateQueue.citation, "Tex. Penal Code § 22.02"));
      for (const runId of runIds) {
        await db.delete(statuteIngestionRuns)
          .where(eq(statuteIngestionRuns.id, runId));
      }
    }
  });
});