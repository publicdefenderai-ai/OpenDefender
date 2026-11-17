import { createHash } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import { getChargeById, getVerifiedCitation, getVerifiedSourceUrl, getInstructionRef, getInstructionUrl } from "../shared/criminal-charges";
import { resolveGuidanceCharge } from "../shared/guidance-charge-resolution";
import { getChargeExplanation } from "../shared/charge-explanations";
import rows from "../shared/texas-ranked-possession.json";
import arrestRows from "../shared/texas-ranked-arrest.json";
import propertyRows from "../shared/texas-property-access.json";
import theftRows from "../shared/texas-ranked-theft.json";
import sources from "../scripts/data-review/output/texas-ranked-possession-evidence.json";
import { loadTexasAuthorityManifest } from "../server/data/texas-manifest-loader";
import { buildTexasSourceDatabaseSeed } from "../server/data/texas-source-database-seed";

const mock = vi.hoisted(() => ({ metadata: {} as object, links: [] as object[] }));
vi.mock("../server/db", () => ({ db: { select: () => ({ from: () => {
  const query = { innerJoin: () => query, where: () => Object.assign(Promise.resolve(mock.links), {
    orderBy: () => ({ limit: async () => [{metadata: mock.metadata}] }),
  }) };
  return query;
} }) } }));
import { getCurrentAuthoritySelectableChargeIds } from "../server/services/authority-source-database";

const manifest = loadTexasAuthorityManifest();
const ids = new Set(rows.map(r => r.id));
const records = manifest.catalogRecords.filter(r => ids.has(r.chargeId));
const text = new Map(Object.entries(sources));
describe("Texas ranked drug possession", () => {
  it("keeps each grade tied to its exact conduct, grading and sentencing provisions", () => {
    expect(records).toHaveLength(6);
    expect(rows.map(row => row.code)).toEqual([
      "481.115(b)", "481.121(b)(1)", "481.115(c)", "481.116(b)", "481.115(d)", "481.116(c)",
    ]);
    for (const row of rows) {
      const record = records.find(r => r.chargeId === row.id)!;
      expect(record.provisions.map(p => [p.lawId,p.section,p.subdivision,p.supportRole]))
        .toEqual(row.references.map(r => [r.code,r.section,r.subdivision,r.supportRole]));
      for (const p of record.provisions) {
        const doc = text.get(`${p.lawId}:${p.section}`)!;
        expect(p.content).toBe(doc.text);
        expect(createHash("sha256").update(doc.text).digest("hex")).toBe(doc.textSha256);
        expect(createHash("sha256").update(JSON.stringify(doc.text)).digest("hex")).toBe(p.contentHash);
      }
      const charge = getChargeById(row.id)!;
      expect(getVerifiedSourceUrl(charge)).toBe(text.get("HS:"+row.references[0].section)!.sourceUrl);
      expect(getVerifiedCitation(charge)).toBe(row.citation);
      expect(getInstructionRef(charge)).toContain(row.id === "tx-possession-of-marijuana" ? "CPJC 81.8" : "CPJC 81.10");
      expect(getInstructionUrl(charge)).toContain("bookviewer.texasbarpractice.com");
      for (const locale of ["en","es","zh"]) {
        const explanation = getChargeExplanation(row.name,"TX",locale,row.id)!;
        expect(explanation.plainSummary).toBe(row.conduct);
        expect(explanation.degreeContext).toBe(row.penalty);
        expect(explanation.untranslated).toBe(locale !== "en");
        expect(explanation.translationDraft).toBe(false);
      }
    }
    expect(rows[1].conduct).toContain("two ounces or less");
    expect(rows[1].penalty).toContain("private residence with no minor");
    for (const index of [0, 3]) {
      expect(rows[index].references).toContainEqual({code:"CR",section:"42A.551",subdivision:"(a), (b), (e)",supportRole:"penalty"});
      expect(rows[index].penalty).toContain("community supervision");
    }
    for (const index of [2, 4, 5]) {
      expect(rows[index].conduct).not.toContain("overdose defense");
      expect(rows[index].penalty).toContain("increases the minimum prison term by five years");
    }
    expect(resolveGuidanceCharge({code:"481.115",name:"Possession",classification:"felony"},"TX")).toBeUndefined();
    expect(buildTexasSourceDatabaseSeed(manifest).selectableChargeIds).not.toContain("tx-possession-of-controlled-substance");

  });

  it("withholds each exact charge when any required current link is missing or superseded", async () => {
    const rankedIds = new Set([...ids, ...theftRows.map(row => row.id), ...propertyRows.map(row => row.id), ...arrestRows.map(row => row.id)]);
    for (const record of manifest.catalogRecords.filter(row => rankedIds.has(row.chargeId))) {
      const all = record.provisions.map(p => ({chargeId:record.chargeId, sourceKey:p.sourceKey,
        contentHash:p.contentHash, subdivision:p.subdivision, supportRole:p.supportRole, citation:p.citation}));
      mock.metadata = {selectableChargeIds:[record.chargeId],catalogRecords:[record]};
      mock.links = all;
      expect(await getCurrentAuthoritySelectableChargeIds("TX")).toEqual(new Set([record.chargeId]));
      for (const [i] of all.entries()) {
        mock.links = all.filter((_,j) => i!==j);
        expect(await getCurrentAuthoritySelectableChargeIds("TX")).toEqual(new Set());
      }
      mock.links = all.map((p,i) => i===0 ? {...p,contentHash:"changed"} : p);
      expect(await getCurrentAuthoritySelectableChargeIds("TX")).toEqual(new Set());
    }
  });
});
