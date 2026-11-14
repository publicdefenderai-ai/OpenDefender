import { createHash } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import { getChargeById, getVerifiedCitation, getInstructionRef, getInstructionUrl } from "../shared/criminal-charges";
import { resolveGuidanceCharge } from "../shared/guidance-charge-resolution";
import { getChargeExplanation } from "../shared/charge-explanations";
import rows from "../shared/texas-assault-public-intoxication.json";
import sources from "../scripts/data-review/output/texas-assault-public-intoxication-evidence.json";
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
describe("Texas assault and public intoxication", () => {
  it("keeps each grade tied to its exact conduct, grading and sentencing provisions", () => {
    expect(records).toHaveLength(6);
    expect(rows.map(r => [r.references[0].subdivision,r.references[1].subdivision])).toEqual([
      ["(a)(1)","(b)"],["(a)(1)","(b)"],["(a)(1)","(b)(2)(A)"],["(a)(1)","(b)(2)(B)"],
      ["(a)(1)","(b-3)"],["(a)","(c), (e)"],
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
      expect(getVerifiedCitation(charge)).toBe(row.citation);
      expect(getInstructionRef(charge)).toBeNull();
      expect(getInstructionUrl(charge)).toBeNull();
      for (const locale of ["en","es","zh"]) {
        const explanation = getChargeExplanation(row.name,"TX",locale,row.id)!;
        expect(explanation.plainSummary).toBe(row.conduct);
        expect(explanation.degreeContext).toBe(row.penalty);
        expect(explanation.untranslated).toBe(locale !== "en");
        expect(explanation.translationDraft).toBe(false);
      }
    }
    expect(rows[1].category).toBe("misdemeanor");
    expect(rows[4].penalty).toContain("all be shown");
    expect(rows[5].penalty).toContain("24 months");
    expect(rows[5].conduct).toContain("may endanger");
    expect(resolveGuidanceCharge({code:"22.01(a)(1)",name:"Assault",classification:"misdemeanor"},"TX")).toBeUndefined();
    expect(buildTexasSourceDatabaseSeed(manifest).selectableChargeIds).not.toContain("tx-domestic-violence-assault");
  });

  it("withholds each exact charge when any required current link is missing or superseded", async () => {
    for (const record of records) {
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
