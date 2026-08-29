import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import type {
  CaliforniaSourceDatabaseSeed,
  CaliforniaSnapshotSeed,
  CaliforniaSourceSeed,
} from "../server/data/california-source-database-seed";
import {
  buildCaliforniaLegacyInventory,
  buildCaliforniaSourceDatabaseSeed,
} from "../server/data/california-source-database-seed";
import { getCaliforniaCanonicalRecord } from "../shared/california-authority";

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
        catalogRecords: [{
          chargeId: "ca-integration-test",
          catalogLabel: baseSnapshot.officialTitle,
          catalogCode: "1",
          catalogCategory: "offense",
          disposition: "retain",
          dispositionReason: "Integration test record.",
          canonicalTitle: baseSnapshot.officialTitle,
          provisions: [{
            sourceKey,
            lawId: "PEN",
            section: baseSnapshot.section,
            citation: changes.citation ?? baseSnapshot.citation,
            officialTitle: changes.title ?? baseSnapshot.officialTitle,
            sourceUrl: url,
            content: null,
            contentHash: `hash-${suffix}-${url}-${changes.citation ?? ""}-${changes.title ?? ""}-${changes.subdivision ?? ""}-${changes.effectiveDate ?? ""}`,
            hashBasis: "reference_metadata",
            retrievedAt: null,
            effectiveDateStart: changes.effectiveDate ?? baseSnapshot.effectiveDateStart,
            effectiveDateEnd: null,
            supportRole: "offense",
            subdivision: changes.subdivision ?? baseSnapshot.metadata.subdivision,
            metadata: { integrationTest: true },
          }],
          apiStatus: "verified",
        }],
        legacyInventory: buildCaliforniaLegacyInventory(),
        audit: {
          boundary: "legacy_disposition_inventory",
          inventory: {
            legacyRecordCount: 115,
            retainedCount: 49,
            aliasCount: 7,
            reselectionRequiredCount: 44,
            removedCount: 15,
            withheldCount: 59,
            reselectionAlternativeCount: 57,
            uniqueReselectionAlternativeCount: 52,
          },
          canonical: { recordCount: 1, selectableRecordCount: 1, withheldRecordCount: 0 },
          provenance: {
            sourceCount: 1,
            snapshotCount: 1,
            linkCount: 1,
            sourceTypes: ["statute"],
            publishers: ["California Legislative Information"],
            accessPolicy: "reference_only",
            reuseStatus: "not_cleared",
            contentStored: false,
          },
          currentness: {
            status: "current",
            effectiveDateStarts: [changes.effectiveDate ?? baseSnapshot.effectiveDateStart],
            currentSnapshotCount: 1,
            allSourcesMarkedCurrentLawText: false,
            verificationMethod: "committed_authority_manifest",
            manifestImportedAt: baseSnapshot.manifestImportedAt.toISOString(),
          },
        },
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

  it("fails closed when a selectable charge loses one current provenance link", async () => {
    const { db } = await import("../server/db");
    const {
      statuteChargeLinks,
      statuteIngestionRuns,
      statuteSources,
      statuteSourceSnapshots,
    } = await import("@shared/schema");
    const { and, eq } = await import("drizzle-orm");
    const { getCaliforniaChargeProvenance } = await import("../server/services/california-source-database");
    const { registerRoutes } = await import("../server/routes");
    const { registerV1Routes } = await import("../server/routes-v1");

    const seed = buildCaliforniaSourceDatabaseSeed(new Date("2026-08-27T12:00:00.000Z"));
    const charge = seed.selectableChargeIds
      .map((chargeId) => getCaliforniaCanonicalRecord(chargeId))
      .find((record) => record && record.sources.length >= 2);
    expect(charge, "expected a selectable California charge with multiple sources").toBeDefined();

    const existingLinks = await db
      .select()
      .from(statuteChargeLinks)
      .where(eq(statuteChargeLinks.chargeId, charge!.canonicalId));
    const fixtureRunId = "test:ca:partial-provenance";
    const fixtureSourceKeys = charge!.sources.map(
      (_source, sourcePosition) => `${fixtureRunId}:source:${sourcePosition}`,
    );
    const importedAt = new Date("2026-08-27T12:00:00.000Z");
    const fixtureSnapshotIds: string[] = [];

    const sourceTypeFor = (source: (typeof charge)["sources"][number]) =>
      source.kind === "jury-instruction" ? "jury_instruction" : source.kind;
    const supportRoleFor = (source: (typeof charge)["sources"][number]) => {
      switch (source.kind) {
        case "jury-instruction":
          return "jury_instruction";
        case "classification":
          return "grading";
        case "statute":
          return "offense";
      }
    };

    try {
      await db
        .delete(statuteChargeLinks)
        .where(eq(statuteChargeLinks.chargeId, charge!.canonicalId));

      for (const [sourcePosition, source] of charge!.sources.entries()) {
        const sourceKey = fixtureSourceKeys[sourcePosition]!;
        const [sourceRow] = await db
          .insert(statuteSources)
          .values({
            sourceKey,
            jurisdiction: "CA",
            publisher: source.publisher,
            sourceType: sourceTypeFor(source),
            canonicalUrl: source.url,
            apiIdentifier: null,
            accessPolicy: "reference_only",
            reuseStatus: "not_cleared",
            canStoreContent: false,
            metadata: { integrationTest: true, sourcePosition },
            isActive: true,
          })
          .returning({ id: statuteSources.id });
        expect(sourceRow).toBeDefined();

        const [snapshotRow] = await db
          .insert(statuteSourceSnapshots)
          .values({
            sourceId: sourceRow!.id,
            jurisdiction: "CA",
            citation: charge!.citation,
            section: source.citation,
            officialTitle: charge!.officialTitle,
            sourceUrl: source.url,
            content: null,
            contentHash: `${fixtureRunId}:${sourcePosition}`,
            hashBasis: "reference_metadata",
            retrievedAt: null,
            manifestImportedAt: importedAt,
            effectiveDateStart: charge!.currentness.effectiveDate,
            effectiveDateEnd: null,
            status: "current",
            requiresReview: false,
            supersedesSnapshotId: null,
            metadata: {
              canonicalId: charge!.canonicalId,
              sourceKind: source.kind,
              sourceCitation: source.citation,
              subdivision: charge!.code,
              currentnessEvidence: charge!.currentness.evidence,
              verificationMethod: "committed_authority_manifest",
              attorneyReview: charge!.attorneyReview,
            },
          })
          .returning({ id: statuteSourceSnapshots.id });
        expect(snapshotRow).toBeDefined();
        fixtureSnapshotIds.push(snapshotRow!.id);
      }

      await db.insert(statuteChargeLinks).values(charge!.sources.map((source, sourcePosition) => ({
        chargeId: charge!.canonicalId,
        snapshotId: fixtureSnapshotIds[sourcePosition]!,
        supportRole: supportRoleFor(source),
        citation: charge!.citation,
        subdivision: charge!.code,
        isCurrent: true,
      })));

      await db.insert(statuteIngestionRuns).values({
        id: fixtureRunId,
        jurisdiction: "CA",
        operation: "seed",
        status: "completed",
        sourceCount: charge!.sources.length,
        snapshotCount: charge!.sources.length,
        linkCount: charge!.sources.length,
        startedAt: new Date(),
        completedAt: new Date(),
        metadata: {
          selectableChargeIds: [charge!.canonicalId],
          catalogRecords: [{
            chargeId: charge!.canonicalId,
            catalogLabel: charge!.officialTitle,
            catalogCode: charge!.code,
            catalogCategory: charge!.classification,
            disposition: "retain",
            dispositionReason: "Integration test fixture.",
            canonicalTitle: charge!.officialTitle,
            provisions: charge!.sources.map((source, sourcePosition) => ({
              sourceKey: fixtureSourceKeys[sourcePosition],
              lawId: charge!.lawCode,
              section: source.citation,
              citation: charge!.citation,
              officialTitle: charge!.officialTitle,
              sourceUrl: source.url,
              content: null,
              contentHash: `${fixtureRunId}:${sourcePosition}`,
              hashBasis: "reference_metadata",
              retrievedAt: null,
              effectiveDateStart: charge!.currentness.effectiveDate,
              effectiveDateEnd: null,
              supportRole: supportRoleFor(source),
              subdivision: charge!.code,
              metadata: { integrationTest: true },
            })),
            apiStatus: "verified",
          }],
        },
      });

      const testApp = express();
      testApp.use(express.json());
      await registerRoutes(testApp);
      registerV1Routes(testApp);

      await db
        .update(statuteChargeLinks)
        .set({ isCurrent: false })
        .where(eq(statuteChargeLinks.id, (
          await db
            .select({ id: statuteChargeLinks.id })
            .from(statuteChargeLinks)
            .where(and(
              eq(statuteChargeLinks.chargeId, charge!.canonicalId),
              eq(statuteChargeLinks.isCurrent, true),
            ))
            .limit(1)
        )[0]!.id));

      expect(await getCaliforniaChargeProvenance(charge!.canonicalId)).toBeNull();

      const provenanceResponse = await request(testApp)
        .get(`/api/criminal-charges/${charge!.canonicalId}/sources`)
        .expect(404);
      expect(provenanceResponse.body).toMatchObject({
        success: false,
        error: "Selectable charge provenance not found",
      });

      const guidanceResponse = await request(testApp)
        .post("/api/legal-guidance/rules")
        .send({
          jurisdiction: "CA",
          charges: [charge!.canonicalId],
          caseStage: "arrest",
          custodyStatus: "in_custody",
        })
        .expect(400);
      expect(guidanceResponse.body).toMatchObject({
        success: false,
        requiresReselection: true,
      });

      const exportResponse = await request(testApp)
        .get(`/api/v1/export/charges?jurisdiction=CA`)
        .expect(200);
      expect(exportResponse.body.some((exported: { id: string }) => exported.id === charge!.canonicalId)).toBe(false);
    } finally {
      await db.delete(statuteIngestionRuns).where(eq(statuteIngestionRuns.id, fixtureRunId));
      await db.delete(statuteChargeLinks).where(eq(statuteChargeLinks.chargeId, charge!.canonicalId));
      for (const sourceKey of fixtureSourceKeys) {
        await db.delete(statuteSources).where(eq(statuteSources.sourceKey, sourceKey));
      }
      if (existingLinks.length > 0) {
        await db.insert(statuteChargeLinks).values(existingLinks);
      }
    }

    expect(await db
      .select()
      .from(statuteChargeLinks)
      .where(eq(statuteChargeLinks.chargeId, charge!.canonicalId)))
      .toEqual(existingLinks);
    expect(await getCaliforniaChargeProvenance(charge!.canonicalId)).not.toBeNull();
  }, 30_000);
});