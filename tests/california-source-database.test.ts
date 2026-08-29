import { describe, expect, it } from "vitest";
import {
  CALIFORNIA_CANONICAL_RECORDS,
  getCaliforniaCanonicalRecord,
} from "../shared/california-authority";
import {
  buildCaliforniaReferenceHash,
  buildCaliforniaSourceKey,
  buildCaliforniaSourceDatabaseSeed,
  validateCaliforniaSourceDatabaseSeed,
} from "../server/data/california-source-database-seed";

const retrievedAt = new Date("2026-08-27T12:00:00.000Z");

describe("California source database manifest", () => {
  const seed = buildCaliforniaSourceDatabaseSeed(retrievedAt);

  it("covers every selectable canonical record and no excluded legacy record", () => {
    const selectable = CALIFORNIA_CANONICAL_RECORDS.filter((record) => record.selectable);
    const linkedChargeIds = new Set(seed.links.map((link) => link.chargeId));

    expect(seed.selectableChargeIds).toHaveLength(selectable.length);
    expect(seed.selectableChargeIds).toHaveLength(99);
    expect(linkedChargeIds).toEqual(new Set(selectable.map((record) => record.canonicalId)));
    expect(seed.snapshots).toHaveLength(seed.links.length);
    expect(seed.snapshots.every((snapshot) => snapshot.jurisdiction === "CA")).toBe(true);
    expect(seed.selectableChargeIds).not.toContain("ca-wire-fraud");
    expect(seed.selectableChargeIds).not.toContain("ca-gang-enhancement");
    expect(seed.catalogRecords).toHaveLength(99);
    expect(seed.legacyInventory).toHaveLength(115);
    expect(seed.audit.inventory).toMatchObject({
      legacyRecordCount: 115,
      retainedCount: 49,
      aliasCount: 7,
      reselectionRequiredCount: 44,
      removedCount: 15,
      withheldCount: 59,
    });
    expect(seed.audit.provenance).toMatchObject({
      sourceCount: seed.sources.length,
      snapshotCount: seed.snapshots.length,
      linkCount: seed.links.length,
      accessPolicy: "reference_only",
      reuseStatus: "not_cleared",
      contentStored: false,
    });
    expect(seed.audit.currentness).toMatchObject({
      status: "current",
      currentSnapshotCount: seed.snapshots.length,
      allSourcesMarkedCurrentLawText: true,
      verificationMethod: "committed_authority_manifest",
    });
  });

  it("treats the typed legacy inventory as a fail-closed committed boundary", () => {
    expect(validateCaliforniaSourceDatabaseSeed(seed)).toEqual([]);
    const tampered = {
      ...seed,
      legacyInventory: seed.legacyInventory.map((entry) =>
        entry.legacyId === "ca-wire-fraud"
          ? { ...entry, disposition: "retain" as const, selectable: true }
          : entry,
      ),
    };
    expect(validateCaliforniaSourceDatabaseSeed(tampered)).toContain(
      "California legacy disposition changed for ca-wire-fraud",
    );
  });

  it("retains exact charge citations and subdivision metadata", () => {
    const rape = getCaliforniaCanonicalRecord("ca-rape-261-a1");
    expect(rape).toBeDefined();

    const rapeSnapshots = seed.snapshots.filter(
      (snapshot) => snapshot.metadata.canonicalId === "ca-rape-261-a1",
    );
    expect(rapeSnapshots.length).toBeGreaterThan(0);
    expect(rapeSnapshots.some((snapshot) => snapshot.citation === rape!.citation)).toBe(true);
    expect(rapeSnapshots.every((snapshot) => snapshot.metadata.subdivision === rape!.code)).toBe(true);
    expect(
      rapeSnapshots
        .filter((snapshot) => snapshot.metadata.sourceKind === "statute")
        .every((snapshot) => snapshot.section.includes("§ 261")),
    ).toBe(true);
  });

  it("supports multiple provisions for a charge without collapsing them", () => {
    const linksByCharge = new Map<string, number>();
    for (const link of seed.links) {
      linksByCharge.set(link.chargeId, (linksByCharge.get(link.chargeId) ?? 0) + 1);
    }

    expect([...linksByCharge.values()].some((count) => count > 1)).toBe(true);
    const rapeLinks = seed.links.filter((link) => link.chargeId === "ca-rape-261-a1");
    expect(new Set(rapeLinks.map((link) => link.supportRole))).toContain("offense");
    expect(new Set(rapeLinks.map((link) => link.supportRole))).toContain("jury_instruction");
  });

  it("is reference-only and never introduces OpenLaws as a source", () => {
    expect(seed.sources.length).toBeGreaterThan(0);
    expect(seed.sources.every((source) => source.accessPolicy === "reference_only")).toBe(true);
    expect(seed.sources.every((source) => source.canStoreContent === false)).toBe(true);
    expect(seed.sources.every((source) => source.lastRetrievedAt === null)).toBe(true);
    expect(seed.sources.every((source) => source.lastCheckedAt === null)).toBe(true);
    expect(seed.snapshots.every((snapshot) => snapshot.content === null)).toBe(true);
    expect(seed.snapshots.every((snapshot) => snapshot.retrievedAt === null)).toBe(true);
    expect(seed.snapshots.every((snapshot) => snapshot.manifestImportedAt === retrievedAt)).toBe(true);
    expect(seed.snapshots.every((snapshot) => snapshot.hashBasis === "reference_metadata")).toBe(true);
    expect(JSON.stringify(seed).toLowerCase()).not.toContain("openlaws");
  });

  it("produces stable fingerprints that change when an official reference changes", () => {
    const record = getCaliforniaCanonicalRecord("ca-murder-in-the-first-degree")!;
    const source = record.sources[0];
    const originalHash = buildCaliforniaReferenceHash(record, source);
    const changedUrlHash = buildCaliforniaReferenceHash(record, {
      ...source,
      url: `${source.url}&revision=changed`,
    });
    const changedCitationHash = buildCaliforniaReferenceHash(record, {
      ...source,
      citation: `${source.citation} (corrected)`,
    });
    const changedTitleHash = buildCaliforniaReferenceHash(
      { ...record, officialTitle: `${record.officialTitle} (corrected)` },
      source,
    );
    const changedSubdivisionHash = buildCaliforniaReferenceHash(
      { ...record, code: `${record.code}-corrected` },
      source,
    );
    const changedCurrentnessHash = buildCaliforniaReferenceHash(
      {
        ...record,
        currentness: {
          ...record.currentness,
          effectiveDate: "2026-09",
        },
      },
      source,
    );

    expect(originalHash).toMatch(/^[a-f0-9]{64}$/);
    expect(buildCaliforniaReferenceHash(record, source)).toBe(originalHash);
    expect(changedUrlHash).not.toBe(originalHash);
    expect(changedCitationHash).not.toBe(originalHash);
    expect(changedTitleHash).not.toBe(originalHash);
    expect(changedSubdivisionHash).not.toBe(originalHash);
    expect(changedCurrentnessHash).not.toBe(originalHash);
    expect(buildCaliforniaSourceKey(record, source, 0)).toBe(
      buildCaliforniaSourceKey(record, { ...source, url: `${source.url}&revision=changed` }, 0),
    );
  });

  it("does not turn a later manifest import into a retrieval or verification event", () => {
    const earlier = buildCaliforniaSourceDatabaseSeed(new Date("2026-08-27T12:00:00.000Z"));
    const later = buildCaliforniaSourceDatabaseSeed(new Date("2026-09-01T12:00:00.000Z"));

    expect(earlier.sources[0].lastRetrievedAt).toBeNull();
    expect(earlier.sources[0].lastCheckedAt).toBeNull();
    expect(later.sources[0].lastRetrievedAt).toBeNull();
    expect(later.sources[0].lastCheckedAt).toBeNull();
    expect(later.snapshots[0].retrievedAt).toBeNull();
    expect(later.snapshots[0].manifestImportedAt).not.toEqual(earlier.snapshots[0].manifestImportedAt);
  });
});