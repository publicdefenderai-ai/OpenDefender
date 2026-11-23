import serviceForgery from "../shared/texas-service-forgery.json";
import disorderlyClassC from "../shared/texas-disorderly-class-c.json";
import deadlyFluid from "../shared/texas-deadly-fluid.json";
import recordsBail from "../shared/texas-records-bail.json";
import publicPeace from "../shared/texas-public-peace.json";
import commerce from "../shared/texas-sexual-commerce.json";
import indecentContact from "../shared/texas-indecent-contact.json";
import protectiveFirearms from "../shared/texas-protective-firearms.json";
import animals from "../shared/texas-animal-cruelty.json";
import communications from "../shared/texas-communications-stalking.json";
import childSexual from "../shared/texas-child-sexual-offenses.json";
import intoxicationHarm from "../shared/texas-intoxication-harm.json";
import prohibited from "../shared/texas-prohibited-possession.json";
import threats from "../shared/texas-threats-alerts.json";
import robbery from "../shared/texas-robbery-restraint.json";
import protectedAssault from "../shared/texas-protected-assault.json";
import fraud from "../shared/texas-card-identity-fraud.json";
import road from "../shared/texas-road-safety.json";
import justice from "../shared/texas-justice-process.json";
import { createHash } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import { getChargeById, getVerifiedCitation, getVerifiedSourceUrl, getInstructionRef, getInstructionUrl } from "../shared/criminal-charges";
import { resolveGuidanceCharge } from "../shared/guidance-charge-resolution";
import { getChargeExplanation } from "../shared/charge-explanations";
import rows from "../shared/texas-ranked-possession.json";
import family from "../shared/texas-family-safety.json";
import delivery from "../shared/texas-ranked-delivery.json";
import weights from "../shared/texas-possession-weights.json";
import burglaryRows from "../shared/texas-ranked-burglary.json";
import lossRows from "../shared/texas-property-loss.json";
import carryRows from "../shared/texas-carry-branches.json";
import closeoutRows from "../shared/texas-priority-closeout.json";
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

  it("withholds the retired weapons identity even when an old run has its full historical link", async () => {
    const id = "tx-unlawful-carrying-of-weapon";
    const old = {chargeId:id, sourceKey:"tx:PE:46.02", supportRole:"offense",
      citation:"Tex. Penal Code § 46.02", subdivision:null, contentHash:"old"};
    mock.metadata = {selectableChargeIds:[id], catalogRecords:[{chargeId:id,provisions:[old]}]};
    mock.links = [old];
    expect(await getCurrentAuthoritySelectableChargeIds("TX")).toEqual(new Set());
  });

  it("rejects historical generic manufacture/delivery identities even with complete old links", async () => {
    for (const id of ["tx-possession-with-intent-to-distribute", "tx-distribution-of-controlled-substance", "tx-manufacturing-controlled-substance", "tx-drug-trafficking"]) {
      const old = {chargeId:id,sourceKey:"tx:HS:481.112",supportRole:"offense",citation:"Tex. Health & Safety Code § 481.112",subdivision:null,contentHash:"old"};
      mock.metadata = {selectableChargeIds:[id],catalogRecords:[{chargeId:id,provisions:[old]}]};
      mock.links = [old];
      expect(await getCurrentAuthoritySelectableChargeIds("TX")).toEqual(new Set());
    }
  });

  it("withholds each exact charge when any required current link is missing or superseded", async () => {
    const rankedIds = new Set([...ids, ...theftRows.map(row => row.id), ...propertyRows.map(row => row.id), ...arrestRows.map(row => row.id), ...closeoutRows.map(row => row.id), ...carryRows.map(row => row.id), ...lossRows.map(row => row.id), ...burglaryRows.map(row => row.id), ...weights.map(row => row.id), ...delivery.map(row => row.id), ...family.map(row => row.id), ...justice.map(row => row.id), ...road.map(row => row.id), ...fraud.map(row => row.id), ...protectedAssault.map(row => row.id), ...robbery.map(row => row.id), ...threats.map(row => row.id), ...prohibited.map(row => row.id), ...intoxicationHarm.map(row => row.id), ...childSexual.map(row => row.id), ...communications.map(row => row.id), ...animals.map(row => row.id), ...protectiveFirearms.map(row => row.id), ...indecentContact.map(row => row.id), ...commerce.map(row => row.id), ...publicPeace.map(row => row.id), ...recordsBail.map(row => row.id), ...deadlyFluid.map(row => row.id), ...disorderlyClassC.map(row => row.id), ...serviceForgery.map(row => row.id)]);
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
