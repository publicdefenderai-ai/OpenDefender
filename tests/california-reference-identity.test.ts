import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import receipt from "../scripts/data-review/output/california-archive-refresh-receipt.json";
import { CALIFORNIA_CANONICAL_RECORDS, getCaliforniaCanonicalRecord } from "../shared/california-authority";
import { buildCaliforniaSourceDatabaseSeed } from "../server/data/california-source-database-seed";

const state = vi.hoisted(() => ({ rows: [] as any[], ids: [] as string[] }));
vi.mock("../server/db", () => ({
  db: { select: () => ({ from: () => {
    const chain: any = {
      innerJoin: () => chain,
      where: () => Object.assign(Promise.resolve(state.rows), {
        orderBy: () => ({ limit: async () => [{
          metadata: { selectableChargeIds: state.ids },
        }] }),
      }),
    };
    return chain;
  } }) },
}));
import {
  getCaliforniaChargeProvenance,
  getCurrentCaliforniaSelectableChargeIds,
} from "../server/services/california-source-database";

const evidenceTime = new Date(receipt.checkedAt);
const seed = buildCaliforniaSourceDatabaseSeed(evidenceTime);
const snapshots = new Map(seed.snapshots.map(row => [row.sourceKey, row]));
const allRows = seed.links.map(link => {
  const snapshot = snapshots.get(link.snapshotKey)!;
  return {
    chargeId: link.chargeId,
    citation: snapshot.citation,
    section: snapshot.section,
    sourceUrl: snapshot.sourceUrl,
    supportRole: link.supportRole,
    subdivision: link.subdivision,
  };
});
const pettyTheft = "ca-petty-theft";
const unaffected = "ca-prostitution-solicitation";
const pettyRows = allRows.filter(row => row.chargeId === pettyTheft);
const otherRows = allRows.filter(row => row.chargeId === unaffected);

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(evidenceTime);
  state.ids = [pettyTheft, unaffected];
  state.rows = [...pettyRows, ...otherRows];
});
afterEach(() => { vi.useRealTimers(); });

// Exercise both consumers of the shared completeness rule. The query is
// mocked, but these rows are built from the actual committed import payload.
async function expectPettyTheftRejected() {
  state.rows = [...state.rows.filter(row => row.chargeId === pettyTheft), ...otherRows];
  expect(await getCurrentCaliforniaSelectableChargeIds()).toEqual(new Set([unaffected]));
  state.rows = state.rows.filter(row => row.chargeId === pettyTheft);
  expect(await getCaliforniaChargeProvenance(pettyTheft)).toBeNull();
}

describe("California exact reference identities", () => {
  it("accepts all 16 petty-theft references, including three instructions at the same URL", async () => {
    expect(pettyRows).toHaveLength(16);
    const instructions = pettyRows.filter(row => row.supportRole === "jury_instruction");
    expect(instructions.map(row => row.section)).toEqual(["CALCRIM 1800", "CALCRIM 1804", "CALCRIM 1805"]);
    expect(new Set(instructions.map(row => row.sourceUrl)).size).toBe(1);
    expect(await getCurrentCaliforniaSelectableChargeIds()).toEqual(new Set([pettyTheft, unaffected]));
    state.rows = pettyRows;
    const provenance = await getCaliforniaChargeProvenance(pettyTheft);
    expect(provenance?.sources).toHaveLength(16);
    expect(provenance?.sources.filter(row => row.section.startsWith("CALCRIM "))).toHaveLength(3);
  });

  it("admits exactly the full 703-record committed release without restoring held records", async () => {
    state.ids = CALIFORNIA_CANONICAL_RECORDS.map(row => row.canonicalId);
    state.rows = allRows;
    const actual = await getCurrentCaliforniaSelectableChargeIds();
    expect(actual.size).toBe(703);
    expect(actual).toEqual(new Set(seed.selectableChargeIds));
    for (const held of CALIFORNIA_CANONICAL_RECORDS.filter(row => !row.selectable)) {
      expect(actual.has(held.canonicalId)).toBe(false);
      expect(await getCaliforniaChargeProvenance(held.canonicalId)).toBeNull();
    }
  });

  it.each(pettyRows.map((row, index) => [row.section, index] as const))(
    "rejects missing required reference %s",
    async (_section, index) => {
      state.rows = pettyRows.filter((_, position) => position !== index);
      await expectPettyTheftRejected();
    },
  );

  it.each(["CALCRIM 1804", "CALCRIM 1805"])(
    "rejects replacing %s with another instruction at the same URL, even with 16 rows",
    async section => {
      const replacement = pettyRows.find(row => row.section === "CALCRIM 1800")!;
      state.rows = pettyRows.map(row => row.section === section ? { ...replacement } : row);
      expect(state.rows).toHaveLength(16);
      await expectPettyTheftRejected();
    },
  );

  it("still rejects an exact duplicate current reference", async () => {
    state.rows = [...pettyRows, { ...pettyRows[0] }];
    await expectPettyTheftRejected();
  });

  it("still rejects an unexpected additional reference", async () => {
    state.rows = [...pettyRows, { ...pettyRows[0], section: "Unreviewed reference" }];
    await expectPettyTheftRejected();
  });

  it.each([
    ["supportRole", "grading"],
    ["sourceUrl", "https://example.invalid/not-reviewed"],
    ["citation", "Cal. Penal Code § 999"],
    ["section", "Cal. Penal Code § 999"],
    ["subdivision", "wrong-subdivision"],
  ])("rejects a substituted %s", async (field, value) => {
    state.rows = pettyRows.map((row, index) => index === 0 ? { ...row, [field]: value } : row);
    await expectPettyTheftRejected();
  });

  it("fails closed for rows without their specific reference citation", async () => {
    state.rows = pettyRows.map(row => ({ ...row, section: undefined }));
    await expectPettyTheftRejected();
  });

  it("keeps a held record unavailable even if every expected reference is supplied", async () => {
    const held = CALIFORNIA_CANONICAL_RECORDS.find(row => !row.selectable && row.sources.length > 0)!;
    expect(held).toBeDefined();
    state.ids = [held.canonicalId];
    state.rows = held.sources.map(source => ({
      chargeId: held.canonicalId, citation: held.citation, section: source.citation,
      sourceUrl: source.url, subdivision: held.code,
      supportRole: source.kind === "statute" ? "offense" :
        source.kind === "classification" ? "grading" : "jury_instruction",
    }));
    expect(await getCurrentCaliforniaSelectableChargeIds()).toEqual(new Set());
    expect(await getCaliforniaChargeProvenance(held.canonicalId)).toBeNull();
  });

  it("keeps the receipt expiry boundary intact for both consumers", async () => {
    expect(getCaliforniaCanonicalRecord(pettyTheft)?.selectable).toBe(true);
    vi.setSystemTime(new Date(receipt.expiresAt));
    expect(await getCurrentCaliforniaSelectableChargeIds()).toEqual(new Set());
    expect(await getCaliforniaChargeProvenance(pettyTheft)).toBeNull();
  });
});
