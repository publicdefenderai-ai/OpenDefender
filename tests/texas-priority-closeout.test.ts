import { createHash } from "node:crypto";
import { expect, it } from "vitest";
import ranking from "../scripts/data-review/output/texas-2025-arrest-priorities.json";
import evidence from "../scripts/data-review/output/texas-priority-closeout-evidence.json";
import { loadTexasAuthorityManifest } from "../server/data/texas-manifest-loader";
import { buildTexasSourceDatabaseSeed } from "../server/data/texas-source-database-seed";
import { getChargeExplanation } from "../shared/charge-explanations";
import { getChargeById, getInstructionRef } from "../shared/criminal-charges";
import { resolveGuidanceCharge } from "../shared/guidance-charge-resolution";
import rows from "../shared/texas-priority-closeout.json";
import { needsTexasChargeReselection, texasHeldCarryId } from "../shared/texas-reviewed";

const manifest = loadTexasAuthorityManifest();
const docs = new Map(Object.entries(evidence));
it("requires every reviewed offense, grading provision and penalty link", () => {
  for (const row of rows) {
    const record = manifest.catalogRecords.find(r => r.chargeId === row.id)!;
    expect(record.provisions.map(p => [p.lawId, p.section, p.subdivision, p.supportRole]))
      .toEqual(row.references.map(r => [r.code, r.section, r.subdivision, r.supportRole]));
    for (const provision of record.provisions) {
      const doc = docs.get(provision.lawId + ":" + provision.section)!;
      expect(provision.content).toBe(doc.text);
      expect(provision.contentHash).toBe(createHash("sha256").update(JSON.stringify(doc.text)).digest("hex"));
    }
    expect(getChargeExplanation(row.name, "TX", "zh", row.id)).toMatchObject({plainSummary: row.conduct, untranslated: true});
  }
});

it("accounts for the three exact ranks and excludes the aggregate carry rank from their total", () => {
  const codes = new Set(rows.map(row => row.dpsCode).filter(Boolean));
  expect([...codes].sort()).toEqual(["13150005","38990027","54990067"]);
  expect(ranking.top25.filter(r => codes.has(r.code)).reduce((n,r) => n+r.adult,0)).toBe(40672);
  expect(rows.filter(r => r.dpsCode === "54990067").map(r => r.code))
    .toEqual(["521.457(f)(1)", "521.457(f)(2)", "521.457(f-1)"]);
  const weaponOrder = rows.find(r => r.code === "25.07(g)(1)(B)")!;
  expect(weaponOrder.conduct).toContain("(a)(4) firearm possession alone does not satisfy");
  expect(rows.find(r => r.code === "521.457(f-2)")?.conduct).toContain("caused or was at fault");
  expect(getInstructionRef(getChargeById("tx-pc-22-02-a-2")!)).toContain("bodily-injury theory only");
});

it("rejects the old section-wide weapons ID even in a previously eligible import or saved case", () => {
  const held = manifest.catalogRecords.find(r => r.chargeId === texasHeldCarryId)!;
  expect(held.disposition).toBe("require_exact_reselection");
  expect(held.provisions).toEqual([]);
  expect(() => buildTexasSourceDatabaseSeed({...manifest,catalogRecords:[{...held,disposition:"exact_alias_rename"}]}))
    .toThrow("requires reselection");
  for (const old of [{id:texasHeldCarryId, code:"",name:"Old charge"}, {code:"46.02(b)",name:"Old charge"}]) {
    expect(needsTexasChargeReselection(old,"TX")).toBe(true);
    expect(resolveGuidanceCharge({...old,classification:"misdemeanor"},"TX")).toBeUndefined();
  }
  expect(getChargeExplanation("Unlawful Carrying Weapons","TX","en",texasHeldCarryId)).toBeNull();
  expect(rows.filter(r => r.code.startsWith("46.02")).map(r => r.code)).toEqual(["46.02(a-5)", "46.02(a-6)"]);
  expect(rows.find(r => r.code === "46.02(a-5)")?.conduct).toContain("holster");
});
