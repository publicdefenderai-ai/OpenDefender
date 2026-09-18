import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import eligibility from "../shared/ohio-reviewed-eligibility.json";
import {
  OHIO_REVIEWED_RECEIPT_PATH,
  OHIO_REVIEWED_SOURCES,
  validateOhioReviewedRefreshReceipt,
} from "../server/data/ohio-reviewed-source";
import {
  buildOhioReviewedManifestRecords,
  buildOhioSourceDatabaseSeed,
  OHIO_MANIFEST_SOURCE,
  validateOhioManifestRecord,
} from "../server/data/ohio-source-database-seed";

describe("reviewed Ohio source-first batch", () => {
  it("accounts for every reviewed draft without treating the reviewer sheet as bulk approval", () => {
    expect(eligibility.decisions).toHaveLength(125);
    expect(new Set(eligibility.decisions.map(row => row.id)).size).toBe(125);
    expect(eligibility.decisions.filter(row => row.status === "eligible")).toHaveLength(105);
    expect(eligibility.decisions.filter(row => row.status === "held")).toHaveLength(20);
    expect(eligibility.decisions.filter(row => row.status === "duplicate")).toHaveLength(0);
    expect(OHIO_REVIEWED_SOURCES).toHaveLength(105);
    expect(eligibility.decisions.find(row =>
      row.id === "oh-orc-2923-211-underage-purchase-of-a-firearm")?.reason)
      .toContain("juvenile delinquent act");
    expect(eligibility.decisions.find(row =>
      row.id === "oh-orc-2705-02-contempt-under-r-c-2705-02")?.reason)
      .toContain("civil, criminal, and procedural contempt distinctions");
  });

  it("keeps all three reviewed interpretations and their controlling evidence bound", () => {
    const caregiver = OHIO_REVIEWED_SOURCES.find(row =>
      row.chargeId.includes("recklessly-failing-to-provide"));
    expect(caregiver?.grading).toContain("F4");
    expect(caregiver?.grading).toContain("M2 is not an available outcome");

    const assault = OHIO_REVIEWED_SOURCES.find(row => row.chargeId === "oh-orc-2903-13-assault");
    expect(assault?.grading).toContain("OAC 3701-12-01(M)");
    expect(assault?.dependencies.some(row => row.section === "OAC:3701-12-01")).toBe(true);
    expect(assault?.grading).toContain("victim and duty/location conditions");

    const conspiracy = OHIO_REVIEWED_SOURCES.find(row => row.chargeId === "oh-orc-2923-01-conspiracy");
    expect(conspiracy?.grading).toContain("2913.421");
    expect(conspiracy?.offense.text).toContain("section 2923.421");
    expect(conspiracy?.dependencies.some(row => row.section === "2913.421")).toBe(true);
  });

  it("fails closed on a changed source without approving the new hash", () => {
    const receipt = JSON.parse(readFileSync(OHIO_REVIEWED_RECEIPT_PATH, "utf8"));
    expect(validateOhioReviewedRefreshReceipt(receipt, new Date(receipt.checkedAt))).toBeNull();
    receipt.documents[0].contentHash = "0".repeat(64);
    expect(validateOhioReviewedRefreshReceipt(receipt, new Date(receipt.checkedAt)))
      .toContain("every approved dependency");
    expect(OHIO_REVIEWED_SOURCES.some(source =>
      source.offense.contentHash === "0".repeat(64) ||
      source.dependencies.some(document => document.contentHash === "0".repeat(64)),
    )).toBe(false);
  });

  it("rejects duplicate substitutions, missing dependencies, and changed roles", () => {
    const record = buildOhioReviewedManifestRecords(new Date("2026-09-18T05:00:00Z"))
      .find(row => row.chargeId === "oh-orc-2903-13-assault")!;
    expect(validateOhioManifestRecord(record)).toBeNull();

    const duplicate = structuredClone(record);
    duplicate.provisions[duplicate.provisions.length - 1] =
      structuredClone(duplicate.provisions[0]);
    expect(validateOhioManifestRecord(duplicate)).toContain("dependency");

    const missing = structuredClone(record);
    missing.provisions.pop();
    expect(validateOhioManifestRecord(missing)).toContain("dependency set is incomplete");

    const wrongRole = structuredClone(record);
    wrongRole.provisions[0].supportRole = "penalty";
    expect(validateOhioManifestRecord(wrongRole)).toContain("not the pinned official evidence");

    const oacAsOffense = structuredClone(record);
    oacAsOffense.provisions.find(provision =>
      provision.sourceKey === "oh:administrative-rule:3701-12-01")!.supportRole = "offense";
    expect(validateOhioManifestRecord(oacAsOffense)).toContain("not the pinned official evidence");
    expect(() => buildOhioSourceDatabaseSeed({
      jurisdiction: "OH", generatedAt: new Date("2026-09-18T05:00:00Z"),
      source: OHIO_MANIFEST_SOURCE, catalogRecords: [oacAsOffense],
    })).toThrow("cannot be a primary criminal offense");

    const wrongCatalogIdentity = structuredClone(record);
    wrongCatalogIdentity.catalogCode = "0000.00";
    expect(validateOhioManifestRecord(wrongCatalogIdentity))
      .toBe("Manifest catalog identity does not match the current Ohio catalog");
  });

  it("uses source-stable fingerprints and produces a repeatable deduplicated seed", () => {
    const firstRecords = buildOhioReviewedManifestRecords(new Date("2026-09-18T05:00:00Z"));
    const laterRecords = buildOhioReviewedManifestRecords(new Date("2026-09-18T06:00:00Z"));
    const fingerprints = (records: typeof firstRecords) => records.flatMap(record =>
      record.provisions.map(provision => [
        provision.sourceKey,
        provision.metadata.fingerprint,
      ]));
    expect(fingerprints(firstRecords)).toEqual(fingerprints(laterRecords));
    const fingerprintsBySource = new Map<string, Set<unknown>>();
    for (const [sourceKey, fingerprint] of fingerprints(firstRecords)) {
      const values = fingerprintsBySource.get(String(sourceKey)) ?? new Set();
      values.add(fingerprint);
      fingerprintsBySource.set(String(sourceKey), values);
    }
    expect([...fingerprintsBySource.values()].every(values => values.size === 1)).toBe(true);

    const manifest = {
      jurisdiction: "OH" as const,
      generatedAt: new Date("2026-09-18T05:00:00Z"),
      source: OHIO_MANIFEST_SOURCE,
      catalogRecords: firstRecords,
    };
    const now = new Date();
    const firstSeed = buildOhioSourceDatabaseSeed(manifest, now);
    const repeatedSeed = buildOhioSourceDatabaseSeed(manifest, now);
    expect(repeatedSeed).toEqual(firstSeed);
    expect(new Set(firstSeed.snapshots.map(snapshot =>
      `${snapshot.sourceKey}|${snapshot.citation}|${snapshot.officialTitle}|${snapshot.contentHash}`,
    )).size).toBe(firstSeed.snapshots.length);
    expect(firstSeed.links.length).toBeGreaterThan(firstSeed.snapshots.length);
  });
});