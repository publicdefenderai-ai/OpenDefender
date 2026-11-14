import { beforeEach, describe, expect, it, vi } from "vitest";
import { loadTexasAuthorityManifest } from "../server/data/texas-manifest-loader";
import { buildTexasManifestRecord, buildTexasSourceDatabaseSeed } from "../server/data/texas-source-database-seed";
import { getChargeById, getVerifiedCitation, classifyChargesForGuidance } from "../shared/criminal-charges";
import { getChargeExplanation } from "../shared/charge-explanations";
import { texasDwiById, texasDwiRecords } from "../shared/texas-dwi";
import { resolveGuidanceCharge } from "../shared/guidance-charge-resolution";
import packet from "../scripts/data-review/output/texas-dwi-branch-candidate.json";

const fixture = vi.hoisted(() => ({ links: [] as object[], metadata: {} as object }));
vi.mock("../server/db", () => ({ db: { select: () => ({ from: () => {
  const query = {
    innerJoin: () => query,
    where: () => Object.assign(Promise.resolve(fixture.links), {
      orderBy: () => ({ limit: async () => [{ metadata: fixture.metadata }] }),
    }),
  };
  return query;
} }) } }));
import { getCurrentAuthoritySelectableChargeIds } from "../server/services/authority-source-database";

const manifest = loadTexasAuthorityManifest();
const records = manifest.catalogRecords.filter(r => texasDwiById.has(r.chargeId));
const links = records.flatMap(row => row.provisions.map(p => ({
  chargeId: row.chargeId, sourceKey: p.sourceKey, supportRole: p.supportRole, citation: p.citation,
  subdivision: p.subdivision, contentHash: p.contentHash,
})));
describe("Texas DWI reviewed dependencies", () => {
  beforeEach(() => {
    fixture.links = links;
    fixture.metadata = { selectableChargeIds: records.map(row => row.chargeId), catalogRecords: records };
  });

  it("uses the same four supported scopes across selection, citations, guidance and translations", () => {
    expect(records).toHaveLength(4);
    const saved = {code: "49.04", name: "Driving While Intoxicated", classification: "misdemeanor"};
    expect(resolveGuidanceCharge(saved, "TX")).toBeUndefined();
    expect(resolveGuidanceCharge({...saved, id: "tx-dui-second-offense"}, "TX")?.code).toBe("49.09(a)");
    for (const row of texasDwiRecords) {
      const charge = getChargeById(row.id)!;
      expect(charge.name).toBe(row.name);
      expect(getVerifiedCitation(charge)).toContain(row.code);
      const reviewed = packet.branches.find(b => b.dpsCode === row.dpsCode)!;
      expect(charge.maxPenalty).toContain(reviewed.summary);
      for (const q of packet.sharedQualifications) expect(charge.maxPenalty).toContain(q.summary);
      expect(classifyChargesForGuidance(row.id)[0].maxPenalty).toBe(charge.maxPenalty);
      for (const lang of ["en", "es", "zh"]) {
        const exp = getChargeExplanation(charge.name, "TX", lang, row.id)!;
        expect(exp.canonicalChargeId).toBe(row.id);
        expect(exp.degreeContext).toBe(charge.maxPenalty);
        expect(exp.untranslated).toBe(lang !== "en");
      }
    }
  });

  it("rejects changed, missing, reordered or misbound source documents in the actual import and seed builders", () => {
    const record = records.find(r => r.chargeId === "tx-dui-second-offense")!;
    const c = getChargeById(record.chargeId)!;
    const docs = record.provisions.map(p => ({ code: p.lawId, section: p.section, title: p.officialTitle,
      sourceUrl: p.sourceUrl, text: p.content!, effectiveDateStart: p.effectiveDateStart, retrievedAt: p.retrievedAt! }));
    expect(buildTexasManifestRecord(c, docs, manifest.generatedAt).provisions).toHaveLength(9);
    for (const bad of [docs.slice(1), [...docs].reverse(), docs.map((d,i) => i === 2 ? {...d,text:d.text + "changed"} : d),
      docs.map((d,i) => i === 0 ? {...d,title:"PUBLIC INTOXICATION."} : d)]) {
      expect(buildTexasManifestRecord(c,bad,manifest.generatedAt).disposition).toBe("require_exact_reselection");
    }
    const bad = {...record, provisions:record.provisions.map((p,i) => i === 1 ? {...p,subdivision:"(b)"}:p)};
    expect(() => buildTexasSourceDatabaseSeed({...manifest, catalogRecords:[bad]})).toThrow(/unreviewed Texas evidence/);
  });

  it("requires deployed links with exact reviewed content, including when the old import omits them", async () => {
    const all = records.map(row => row.chargeId);
    expect(await getCurrentAuthoritySelectableChargeIds("TX")).toEqual(new Set(all));
    const id = "tx-dui-second-offense";
    const remaining = new Set(all.filter(x => x !== id));
    for (const change of ["missing", "hash", "subdivision"]) {
      fixture.links = links.flatMap(l => {
        if (l.chargeId !== id || l.sourceKey !== "tx:PE:49.09") return [l];
        if (change === "missing") return [];
        return [change === "hash" ? {...l,contentHash:"incorrect"} : {...l,subdivision:"(b)"}];
      });
      fixture.metadata = { selectableChargeIds: all, catalogRecords: records.map(row => ({
        ...row, provisions: row.provisions.filter(p => !(row.chargeId === id && p.section === "49.09")),
      })) };
      expect(await getCurrentAuthoritySelectableChargeIds("TX")).toEqual(remaining);
    }
  });
});
