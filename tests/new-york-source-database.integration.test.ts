import { describe, expect, it } from "vitest";

const runIntegration = process.env.RUN_NEW_YORK_SOURCE_DB_INTEGRATION === "1";

describe.skipIf(!runIntegration)("New York source database persistence", () => {
  it("keeps a citation-only pending change ineligible across repeated imports", async () => {
    const { db } = await import("../server/db");
    const {
      statuteIngestionRuns,
      statuteSources,
      statuteUpdateQueue,
    } = await import("@shared/schema");
    const {
      getCurrentNewYorkSelectableChargeIds,
      getNewYorkChargeProvenance,
      seedNewYorkSourceDatabase,
    } = await import("../server/services/new-york-source-database");
    const { eq } = await import("drizzle-orm");

    const chargeId = "ny-integration-repeat-pending";
    const sourceKey = "ny:test:repeat-pending";
    const firstCitation = "N.Y. Penal Law § 220.16";
    const changedCitation = "N.Y. Penal Law § 220.16(a)";
    const importedAt = new Date("2026-08-27T12:00:00.000Z");
    const runIds: string[] = [];

    const makeSeed = (citation: string, contentHash: string) => ({
      sources: [{
        sourceKey,
        jurisdiction: "NY" as const,
        publisher: "New York Senate Open Legislation API",
        sourceType: "statute" as const,
        canonicalUrl: "https://legislation.nysenate.gov/section/PEN/220.16",
        apiIdentifier: "PEN/220.16",
        accessPolicy: "store_text" as const,
        reuseStatus: "permitted" as const,
        canStoreContent: true,
        lastRetrievedAt: importedAt,
        lastCheckedAt: importedAt,
        metadata: { integrationTest: true },
      }],
      snapshots: [{
        sourceKey,
        jurisdiction: "NY" as const,
        citation,
        section: "PEN/220.16",
        officialTitle: "Integration Test Controlled Substance Charge",
        sourceUrl: "https://legislation.nysenate.gov/section/PEN/220.16",
        content: "integration test source text",
        contentHash,
        hashBasis: "source_content" as const,
        retrievedAt: importedAt,
        manifestImportedAt: importedAt,
        effectiveDateStart: "2026-01-01",
        effectiveDateEnd: null,
        status: "current" as const,
        requiresReview: false as const,
        supersedesSnapshotId: null,
        metadata: {
          integrationTest: true,
          fingerprint: contentHash,
        },
      }],
      links: [{
        chargeId,
        snapshotKey: sourceKey,
        supportRole: "offense" as const,
        citation,
        subdivision: null,
      }],
      catalogRecords: [{
        chargeId,
        catalogLabel: "Integration Test Charge",
        catalogCode: "PEN 220.16",
        catalogCategory: "Controlled Substances",
        disposition: "retain" as const,
        dispositionReason: "Integration test",
        canonicalTitle: "Integration Test Controlled Substance Charge",
        provisions: [{
          sourceKey,
          lawId: "PEN",
          citation,
          section: "PEN/220.16",
          officialTitle: "Integration Test Controlled Substance Charge",
          sourceUrl: "https://legislation.nysenate.gov/section/PEN/220.16",
          content: "integration test source text",
          contentHash,
          hashBasis: "source_content" as const,
          supportRole: "offense" as const,
          subdivision: null,
          retrievedAt: importedAt,
          effectiveDateStart: "2026-01-01",
          effectiveDateEnd: null,
          metadata: { fingerprint: contentHash },
        }],
        apiStatus: "verified" as const,
      }],
      selectableChargeIds: [chargeId],
      generatedAt: importedAt,
      jurisdiction: "NY" as const,
      source: "NY Open Legislation API (legislation.nysenate.gov)" as const,
    });

    try {
      const initial = await seedNewYorkSourceDatabase(makeSeed(firstCitation, "hash-initial"));
      runIds.push(initial.runId);
      expect(initial.success).toBe(true);
      expect((await getCurrentNewYorkSelectableChargeIds()).has(chargeId)).toBe(true);

      const changed = await seedNewYorkSourceDatabase(makeSeed(changedCitation, "hash-changed"));
      runIds.push(changed.runId);
      expect(changed.success).toBe(true);
      expect((await getCurrentNewYorkSelectableChargeIds()).has(chargeId)).toBe(false);
      expect(await getNewYorkChargeProvenance(chargeId)).toBeNull();

      const repeated = await seedNewYorkSourceDatabase(makeSeed(changedCitation, "hash-changed"));
      runIds.push(repeated.runId);
      expect(repeated.success).toBe(true);
      expect((await getCurrentNewYorkSelectableChargeIds()).has(chargeId)).toBe(false);
      expect(await getNewYorkChargeProvenance(chargeId)).toBeNull();
    } finally {
      for (const runId of runIds) {
        await db.delete(statuteIngestionRuns).where(eq(statuteIngestionRuns.id, runId));
      }
      await db.delete(statuteUpdateQueue).where(eq(statuteUpdateQueue.citation, changedCitation));
      await db.delete(statuteSources).where(eq(statuteSources.sourceKey, sourceKey));
    }
  }, 30000);
});