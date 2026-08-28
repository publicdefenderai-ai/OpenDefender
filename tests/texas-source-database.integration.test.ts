import { describe, expect, it } from "vitest";
import express from "express";
import request from "supertest";

const runIntegration = process.env.RUN_TEXAS_SOURCE_DB_INTEGRATION === "1";

describe.skipIf(!runIntegration)("Texas source database persistence", () => {
  it("fails closed when a current TCSS snapshot changes and enters pending review", async () => {
    const { db } = await import("../server/db");
    const {
      statuteChargeLinks,
      statuteIngestionRuns,
      statuteSourceReviewDecisions,
      statuteSourceSnapshots,
      statuteSources,
      statuteUpdateQueue,
    } = await import("@shared/schema");
    const { and, eq, inArray, sql } = await import("drizzle-orm");
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

      const [initialSnapshot] = await db.select({ id: statuteSourceSnapshots.id })
        .from(statuteSourceSnapshots)
        .innerJoin(statuteSources, eq(statuteSourceSnapshots.sourceId, statuteSources.id))
        .where(and(
          eq(statuteSources.sourceKey, sourceKey),
          eq(statuteSourceSnapshots.status, "current"),
        ));
      expect(initialSnapshot).toBeDefined();
      await db.insert(statuteChargeLinks).values({
        chargeId: "tx-integration-retired-link",
        snapshotId: initialSnapshot.id,
        supportRole: "penalty",
        citation: "Tex. Penal Code § 22.02",
        subdivision: null,
        isCurrent: false,
      });

      const changed = await seedAuthoritySourceDatabase(makeSeed("hash-changed"));
      runIds.push(changed.runId);
      expect(changed.success).toBe(true);
      expect(changed.changeCount).toBeGreaterThan(0);
      expect((await getCurrentAuthoritySelectableChargeIds("TX")).has(chargeId)).toBe(false);
      expect(await getAuthorityChargeProvenance("TX", chargeId)).toBeNull();

      const { registerRoutes } = await import("../server/routes");
      const testApp = express();
      testApp.use(express.json());
      await registerRoutes(testApp);
      const previousAdminToken = process.env.ADMIN_TOKEN;
      process.env.ADMIN_TOKEN = "integration-review-token";
      try {
        await request(testApp)
          .get("/api/statutes/sources/texas/pending-review")
          .expect(401);

        const pendingResponse = await request(testApp)
          .get("/api/statutes/sources/texas/pending-review")
          .set("x-admin-api-key", "integration-review-token")
          .expect(200);
        expect(pendingResponse.body.success).toBe(true);
        expect(pendingResponse.body.snapshots).toEqual(expect.arrayContaining([
          expect.objectContaining({
            sourceKey,
            contentHash: "hash-changed",
            officialTitle: "AGGRAVATED ASSAULT.",
            sourceUrl: "https://tcss.legis.texas.gov/resources/PE/htm/PE.22.htm#22.02",
            hashBasis: "source_content",
            supersedesSnapshotId: expect.any(String),
          }),
        ]));
        const pendingSnapshot = pendingResponse.body.snapshots.find(
          (snapshot: { contentHash: string }) => snapshot.contentHash === "hash-changed",
        );
        expect(pendingSnapshot).toBeDefined();

        const approveResponse = await request(testApp)
          .post(`/api/statutes/sources/texas/review/${pendingSnapshot.id}`)
          .set("x-admin-api-key", "integration-review-token")
          .send({
            decision: "approve",
            reviewer: "integration-reviewer",
            note: "Verified against the current TCSS snapshot.",
          })
          .expect(200);
        expect(approveResponse.body).toMatchObject({
          success: true,
          decision: "approve",
          snapshot: {
            id: pendingSnapshot.id,
            status: "current",
            requiresReview: false,
            contentHash: "hash-changed",
          },
          affectedChargeIds: [chargeId],
          restoredLinkCount: 1,
        });
        const [retiredLink] = await db.select({ isCurrent: statuteChargeLinks.isCurrent })
          .from(statuteChargeLinks)
          .where(eq(statuteChargeLinks.chargeId, "tx-integration-retired-link"));
        expect(retiredLink?.isCurrent).toBe(false);
        expect((await getCurrentAuthoritySelectableChargeIds("TX")).has(chargeId)).toBe(true);
        expect(await getAuthorityChargeProvenance("TX", chargeId)).toMatchObject({
          chargeId,
          sources: [expect.objectContaining({
            contentHash: "hash-changed",
            status: "current",
          })],
        });

        const rejected = await seedAuthoritySourceDatabase(makeSeed("hash-rejected"));
        runIds.push(rejected.runId);
        const rejectedPending = (await request(testApp)
          .get("/api/statutes/sources/texas/pending")
          .set("authorization", "Bearer integration-review-token")
          .expect(200)).body.snapshots.find(
            (snapshot: { contentHash: string }) => snapshot.contentHash === "hash-rejected",
          );
        expect(rejectedPending).toBeDefined();

        const rejectResponse = await request(testApp)
          .post(`/api/statutes/sources/texas/pending-review/${rejectedPending.id}`)
          .set("x-admin-api-key", "integration-review-token")
          .send({
            decision: "reject",
            reviewer: "integration-reviewer",
            note: "Prior verified source remains authoritative.",
          })
          .expect(200);
        expect(rejectResponse.body).toMatchObject({
          success: true,
          decision: "reject",
          snapshot: {
            id: rejectedPending.id,
            status: "superseded",
            requiresReview: false,
            contentHash: "hash-rejected",
          },
          affectedChargeIds: [chargeId],
          restoredLinkCount: 1,
        });
        await request(testApp)
          .post(`/api/statutes/sources/texas/pending-review/${rejectedPending.id}`)
          .set("x-admin-api-key", "integration-review-token")
          .send({
            decision: "reject",
            reviewer: "integration-reviewer",
          })
          .expect(409);
        expect((await getCurrentAuthoritySelectableChargeIds("TX")).has(chargeId)).toBe(true);
        expect(await getAuthorityChargeProvenance("TX", chargeId)).toMatchObject({
          sources: [expect.objectContaining({
            contentHash: "hash-changed",
            status: "current",
          })],
        });

        const decisionsResponse = await request(testApp)
          .get("/api/statutes/sources/texas/review-decisions")
          .set("x-admin-api-key", "integration-review-token")
          .expect(200);
        expect(decisionsResponse.body.decisions).toEqual(expect.arrayContaining([
          expect.objectContaining({
            snapshotId: pendingSnapshot.id,
            decision: "approve",
            reviewer: "integration-reviewer",
            snapshotHash: "hash-changed",
          }),
          expect.objectContaining({
            snapshotId: rejectedPending.id,
            decision: "reject",
            reviewer: "integration-reviewer",
            snapshotHash: "hash-rejected",
          }),
        ]));
      } finally {
        if (previousAdminToken === undefined) delete process.env.ADMIN_TOKEN;
        else process.env.ADMIN_TOKEN = previousAdminToken;
      }
    } finally {
      const sourceRows = await db.select({ id: statuteSources.id })
        .from(statuteSources).where(eq(statuteSources.sourceKey, sourceKey));
      const sourceIds = sourceRows.map((row) => row.id);
      if (sourceIds.length > 0) {
        const snapshotRows = await db.select({ id: statuteSourceSnapshots.id })
          .from(statuteSourceSnapshots).where(eq(statuteSourceSnapshots.sourceId, sourceIds[0]));
        const snapshotIds = snapshotRows.map((row) => row.id);
        if (snapshotIds.length > 0) {
          // Review decisions are append-only in production. Integration
          // teardown uses a narrowly scoped privileged fixture cleanup and
          // immediately restores the trigger.
          await db.execute(sql`ALTER TABLE statute_source_review_decisions
            DISABLE TRIGGER statute_source_review_decisions_append_only`);
          try {
            await db.delete(statuteSourceReviewDecisions)
              .where(inArray(statuteSourceReviewDecisions.snapshotId, snapshotIds));
          } finally {
            await db.execute(sql`ALTER TABLE statute_source_review_decisions
              ENABLE TRIGGER statute_source_review_decisions_append_only`);
          }
          await db.delete(statuteChargeLinks)
            .where(inArray(statuteChargeLinks.snapshotId, snapshotIds));
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
  }, 30_000);
});