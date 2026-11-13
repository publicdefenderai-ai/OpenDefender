import { readFileSync, readdirSync } from "node:fs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { publicationBatches, requiredReceipts } from "../scripts/data-review/publication-batches.mjs";

const deadline = Date.parse("2026-11-10T00:00:00Z");
const output = new URL("../scripts/data-review/output/", import.meta.url);
const charges = [{ id: "ca-one", jurisdiction: "CA" }, { id: "oh-criminal-trespass", jurisdiction: "OH" }];

// The expectation comes from reviewed evidence; the production gate still uses
// the real batch ID sets. A missing gate, wrong ID set or swapped check fails.
const batches = publicationBatches.map(({ key, jurisdiction }) => {
  const packet = JSON.parse(readFileSync(new URL(key + "-publication-evidence.json", output), "utf8"));
  const records: { id: string }[] = jurisdiction === "OH" ? packet.records : packet.eligibility.decisions;
  const ids = records.map(record => record.id);
  const fresh = vi.fn(() => Date.now() < deadline);
  const family = key.split("-").map(word => word[0].toUpperCase() + word.slice(1)).join("");
  vi.doMock(`../server/data/${key}-source`, () => ({ [`is${family}SourceFresh`]: fresh }));
  charges.push(...ids.map(id => ({ id, jurisdiction })));
  return { key, ids, fresh };
});

const allBatchIds = batches.flatMap(batch => batch.ids);
const reviewedIds = new Set(allBatchIds);
const db = vi.fn(async (_jurisdiction: string) => new Set([...allBatchIds, "oh-criminal-trespass"]));
const caDb = vi.fn(async () => new Set(["ca-one"]));
const caFresh = vi.fn(() => Date.now() < deadline);
vi.doMock("../shared/criminal-charges", () => ({ getSelectableCharges: () => charges }));
vi.doMock("../shared/california-authority", () => ({
  CALIFORNIA_CANONICAL_RECORDS: [{ canonicalId: "ca-one", selectable: true }],
  getCaliforniaCanonicalRecord: () => ({ currentness: { status: "current" } }),
}));
vi.doMock("../shared/california-freshness", () => ({ isCaliforniaEvidenceFresh: caFresh }));
vi.doMock("../shared/ohio-reviewed-identity", () => ({ isReviewedOhioChargeId: (id: string) => reviewedIds.has(id) }));
vi.doMock("../server/data/ohio-reviewed-source", () => ({ OHIO_REVIEWED_SOURCES: [], isOhioReviewedSourceFresh: vi.fn() }));
vi.doMock("../server/data/ohio-chapter-2903-source", () => ({ OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS: [] }));
vi.doMock("../server/data/ohio-chapter-2903-refresh", () => ({ isOhioChapter2903PilotFresh: vi.fn() }));
vi.doMock("../server/data/florida-reviewed-source-records", () => ({ FLORIDA_REVIEWED_SOURCE_RECORDS: [], isFloridaReviewedSourceFresh: vi.fn() }));
vi.doMock("../server/services/authority-source-database", () => ({ getCurrentAuthoritySelectableChargeIds: db }));
vi.doMock("../server/services/california-source-database", () => ({ getCurrentCaliforniaSelectableChargeIds: caDb }));

const { getCurrentAuthoritySelectableChargeIds: select } = await import("../server/services/authority-eligibility");

it("covers the independently retained packets and receipts exactly once", () => {
  const files = readdirSync(output);
  expect(requiredReceipts.slice().sort()).toEqual(files.filter(file => file.endsWith("-refresh-receipt.json")).sort());
  expect(batches.map(batch => batch.key + "-publication-evidence.json").sort())
    .toEqual(files.filter(file => /^(ohio|florida)-.*-publication-evidence\.json$/.test(file)).sort());
  expect(allBatchIds.length).toBe(reviewedIds.size);
  for (const batch of batches) expect(batch.ids.length, batch.key).toBeGreaterThan(0);
});

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
  vi.setSystemTime(deadline - 1);
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});

describe.each([true, false])("request-scoped eligibility with release fixture %s", fixture => {
  beforeEach(() => {
    vi.stubEnv("RELEASE_CHECK", String(fixture));
    vi.stubEnv("RELEASE_CHECK_AUTHORITY_SELECTABLE_CHARGE_IDS", JSON.stringify(charges.map(charge => charge.id)));
  });

  it("does not evaluate unrelated state evidence or databases for California", async () => {
    expect(await select(["CA"])).toEqual(new Set(["ca-one"]));
    expect(db).not.toHaveBeenCalled();
    for (const batch of batches) expect(batch.fresh, batch.key).not.toHaveBeenCalled();
    expect(caFresh).toHaveBeenCalledTimes(1);
  });

  it("checks every family once per request and rechecks at exact expiry", async () => {
    expect(await select(["OH", "FL"])).toEqual(reviewedIds);
    for (const batch of batches) expect(batch.fresh, batch.key).toHaveBeenCalledTimes(1);
    vi.setSystemTime(deadline);
    expect(await select(["OH", "FL"])).toEqual(new Set());
    for (const batch of batches) expect(batch.fresh, batch.key).toHaveBeenCalledTimes(2);
  });

  it.each(batches)("withholds only $key on expiry and restores it on the next request", async batch => {
    batch.fresh.mockReturnValueOnce(false);
    const expected = new Set(allBatchIds);
    for (const id of batch.ids) expected.delete(id);
    expect(await select(["OH", "FL"])).toEqual(expected);
    expect(await select(["OH", "FL"])).toEqual(reviewedIds);
    expect(batch.fresh).toHaveBeenCalledTimes(2);
  });

  it("keeps all-jurisdiction callers supported", async () => {
    expect(await select()).toEqual(new Set([...allBatchIds, "ca-one"]));
  });
});

it("does not cache database eligibility between requests", async () => {
  vi.stubEnv("RELEASE_CHECK", "false");
  expect(await select(["CA"])).toEqual(new Set(["ca-one"]));
  caDb.mockResolvedValueOnce(new Set());
  expect(await select(["CA"])).toEqual(new Set());
});
