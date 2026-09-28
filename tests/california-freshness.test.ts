import comparison from "../scripts/data-review/output/california-retained-refresh-comparison.json";
import retainedPins from "../shared/california-retained-pins.json";
import { afterEach, describe, expect, it, vi } from "vitest";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createHash } from "node:crypto";
import receipt from "../scripts/data-review/output/california-archive-refresh-receipt.json";
import review from "../scripts/data-review/output/california-batch-one-review.json";
import { CALIFORNIA_ARCHIVE, californiaReceiptStatus as checkReceipt } from "../shared/california-freshness-core.mjs";
import { buildCaliforniaSourceDatabaseSeed } from "../server/data/california-source-database-seed";
import { CALIFORNIA_CANONICAL_RECORDS, getCaliforniaCanonicalRecord } from "../shared/california-authority";
// @ts-expect-error Dependency-free operational script.
import { compareArchiveResponse, refreshCaliforniaArchive } from "../scripts/refresh-california-archive.mjs";
const californiaReceiptStatus = (value: unknown, now: Date) => checkReceipt(value, now, comparison);
const select = vi.fn();
vi.mock("../server/db", () => ({ db: { select } }));
afterEach(() => { vi.useRealTimers(); vi.clearAllMocks(); vi.unstubAllEnvs(); });
describe("California archive currency", () => {
  it("binds the receipt to retained evidence and expires exactly at its deadline", () => {
    expect(review.archive.sha256).toBe(CALIFORNIA_ARCHIVE.sha256);
    expect(review.archive.bytes).toBe(CALIFORNIA_ARCHIVE.bytes);
    expect(Date.parse(review.archive.retrievedAt)).toBe(Date.parse(CALIFORNIA_ARCHIVE.acquiredAt));
    if (receipt.method === "original_acquisition") expect(receipt.checkedAt).toBe(CALIFORNIA_ARCHIVE.acquiredAt);
    expect(californiaReceiptStatus(receipt, new Date(Date.parse(receipt.expiresAt) - 1))).toBe("current");
    expect(californiaReceiptStatus(receipt, new Date(receipt.expiresAt))).toBe("stale");
  });
  it("covers every configured primary and supporting statutory source", () => {
    for (const record of CALIFORNIA_CANONICAL_RECORDS.filter(row => row.selectable)) {
      for (const source of record.sources.filter(row => row.kind !== "jury-instruction")) {
        const url = new URL(source.url);
        const key = `${url.searchParams.get("lawCode")}:${url.searchParams.get("sectionNum")?.replace(/\.$/, "")}`;
        expect(Object.hasOwn(retainedPins, key), `${record.canonicalId}: ${key}`).toBe(true);
      }
    }
  });
  it("does not accept missing, duplicated, changed, or differently acquired comparison evidence", () => {
    const now = new Date(receipt.checkedAt);
    expect(checkReceipt(receipt, now)).toBe("invalid");
    const clone = () => JSON.parse(JSON.stringify(comparison));
    for (const mutate of [
      (r: any) => r.sections.pop(),
      (r: any) => { r.sections[0] = r.sections[1]; },
      (r: any) => { r.sections[0].observedHash = "different"; },
      (r: any) => { r.sections[0].observedVersions += 1; },
      (r: any) => { r.candidate.retrievedAt = "2000-01-01"; },
      (r: any) => { r.candidate.sha256 = "0".repeat(64); },
    ]) {
      const changed = clone(); mutate(changed);
      expect(checkReceipt(receipt, now, changed)).toBe("invalid");
    }
  });
  it("fails closed on invalid dates, provenance, excessive TTL, and withdrawn checks", () => {
    const now = new Date(receipt.checkedAt);
    for (const bad of [null, {}, { ...receipt, status: "changed" }, { ...receipt, archiveSha256: "wrong" },
      { ...receipt, archiveBytes: 2 }, { ...receipt, sourceUrl: "https://example.com" },
      { ...receipt, checkedAt: new Date(Date.parse(receipt.expiresAt) + 1).toISOString() }, { ...receipt, expiresAt: "2026-11-01" },
      { ...receipt, method: "head_request" }, { ...receipt, checkedAt: "bad" }]) {
      expect(californiaReceiptStatus(bad, now)).toBe("invalid");
    }
  });
  it("downgrades already-loaded metadata and denies stale selection, provenance and reseeding before DB access", async () => {
    vi.useFakeTimers(); vi.setSystemTime(new Date(receipt.checkedAt));
    const record = getCaliforniaCanonicalRecord("ca-pen-245-a-4")!;
    expect(record.currentness.status).toBe("current");
    const service = await import("../server/services/california-source-database");
    vi.setSystemTime(new Date(receipt.expiresAt));
    expect(record.currentness.status).toBe("stale");
    expect(await service.getCurrentCaliforniaSelectableChargeIds()).toEqual(new Set());
    expect(await service.getCaliforniaChargeProvenance(record.canonicalId)).toBeNull();
    await expect(service.seedCaliforniaSourceDatabase()).rejects.toThrow("stale or invalid");
    expect(select).not.toHaveBeenCalled();
  });
  it("withholds only records depending on the changed section, including release fixtures", async () => {
    vi.useFakeTimers(); vi.setSystemTime(new Date(receipt.checkedAt));
    expect(receipt.heldSourceKeys).toEqual(["PEN:30515"]);
    const held = CALIFORNIA_CANONICAL_RECORDS.filter(row => row.selectable && row.currentness.status !== "current");
    expect(held.map(row => row.canonicalId)).toEqual(["ca-possession-of-prohibited-weapon"]);
    const service = await import("../server/services/california-source-database");
    expect(await service.getCaliforniaChargeProvenance(held[0].canonicalId)).toBeNull();
    expect(select).not.toHaveBeenCalled();
    vi.stubEnv("RELEASE_CHECK", "true");
    vi.stubEnv("RELEASE_CHECK_AUTHORITY_SELECTABLE_CHARGE_IDS", JSON.stringify(CALIFORNIA_CANONICAL_RECORDS.filter(row => row.selectable).map(row => row.canonicalId)));
    const eligibility = await import("../server/services/authority-eligibility");
    const allowed = await eligibility.getCurrentAuthoritySelectableChargeIds();
    expect(allowed.has(held[0].canonicalId)).toBe(false);
    expect(allowed.has("ca-pen-245-a-4")).toBe(true);
  });
  it("reports the receipt actually loaded by the running server, including after expiry", async () => {
    vi.useFakeTimers(); vi.setSystemTime(new Date(receipt.checkedAt));
    const chain: any = { from: () => chain, where: () => chain, orderBy: () => chain,
      innerJoin: () => chain, limit: async () => [], then: (resolve: any) => resolve([]) };
    select.mockReturnValue(chain);
    const service = await import("../server/services/california-source-database");
    const fresh = await service.getCaliforniaSourceDatabaseStatus();
    expect(fresh.archiveEvidence).toMatchObject({ status: "current", checkedAt: receipt.checkedAt, expiresAt: receipt.expiresAt, archiveSha256: receipt.archiveSha256 });
    vi.setSystemTime(new Date(receipt.expiresAt));
    expect((await service.getCaliforniaSourceDatabaseStatus()).archiveEvidence.status).toBe("stale");
  });
  it("does not serve a selection query that crosses the expiry boundary", async () => {
    vi.useFakeTimers(); vi.setSystemTime(new Date(Date.parse(receipt.expiresAt) - 1));
    const seed = buildCaliforniaSourceDatabaseSeed();
    const rows = seed.links.filter(link => link.chargeId === "ca-pen-245-a-4").map(link => {
      const snapshot = seed.snapshots.find(row => row.sourceKey === link.snapshotKey)!;
      return { chargeId: link.chargeId, citation: snapshot.citation, sourceUrl: snapshot.sourceUrl,
        supportRole: link.supportRole, subdivision: link.subdivision };
    });
    let crossDeadline = false;
    const chain: any = { from: () => chain, where: () => chain, orderBy: () => chain,
      limit: async () => [{ metadata: { selectableChargeIds: ["ca-pen-245-a-4"] } }],
      innerJoin: () => chain, then: (resolve: any) => {
        if (crossDeadline) vi.setSystemTime(new Date(receipt.expiresAt)); resolve(rows);
      } };
    select.mockReturnValue(chain);
    const service = await import("../server/services/california-source-database");
    expect(await service.getCurrentCaliforniaSelectableChargeIds()).toEqual(new Set(["ca-pen-245-a-4"]));
    expect(await service.getCaliforniaChargeProvenance("ca-pen-245-a-4")).not.toBeNull();
    crossDeadline = true;
    expect(await service.getCurrentCaliforniaSelectableChargeIds()).toEqual(new Set());
    vi.setSystemTime(new Date(Date.parse(receipt.expiresAt) - 1));
    expect(await service.getCaliforniaChargeProvenance("ca-pen-245-a-4")).toBeNull();
  });
  it("does not allow the release fixture to bypass receipt expiry", async () => {
    vi.useFakeTimers(); vi.setSystemTime(new Date(receipt.checkedAt));
    vi.stubEnv("RELEASE_CHECK", "true");
    const ids = CALIFORNIA_CANONICAL_RECORDS.filter(row => row.selectable).map(row => row.canonicalId);
    vi.stubEnv("RELEASE_CHECK_AUTHORITY_SELECTABLE_CHARGE_IDS", JSON.stringify(ids));
    const service = await import("../server/services/authority-eligibility");
    expect((await service.getCurrentAuthoritySelectableChargeIds()).has(ids[0])).toBe(true);
    vi.setSystemTime(new Date(receipt.expiresAt));
    expect([...await service.getCurrentAuthoritySelectableChargeIds()].filter(id => ids.includes(id))).toEqual([]);
  });
  it("compares complete response bytes, rejects partial responses and preserves a withheld receipt on change/failure", async () => {
    const bytes = new TextEncoder().encode("test archive");
    const expected = { bytes: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex") };
    expect((await compareArchiveResponse(new Response(bytes), expected)).matched).toBe(true);
    await expect(compareArchiveResponse(new Response(bytes, { status: 206 }), expected)).rejects.toThrow();
    await expect(compareArchiveResponse(new Response(bytes, { headers: { "content-length": "999" } }), expected)).rejects.toThrow();
    const dir = mkdtempSync(join(tmpdir(), "ca-refresh-")), file = join(dir, "receipt.json");
    try {
      await expect(refreshCaliforniaArchive(file, async () => new Response(bytes))).rejects.toThrow("differs");
      expect(JSON.parse(readFileSync(file, "utf8")).status).toBe("changed");
      await expect(refreshCaliforniaArchive(file, async () => { throw new Error("offline"); })).rejects.toThrow("offline");
      expect(JSON.parse(readFileSync(file, "utf8")).status).toBe("unverified");
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });
});
