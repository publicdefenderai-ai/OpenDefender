import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { getChargeById, getInstructionRef, getVerifiedCitation, getVerifiedSourceUrl } from "../shared/criminal-charges";
import { getChargeExplanation } from "../shared/charge-explanations";
import { resolveGuidanceCharge } from "../shared/guidance-charge-resolution";
import { loadTexasAuthorityManifest } from "../server/data/texas-manifest-loader";
import { buildTexasSourceDatabaseSeed } from "../server/data/texas-source-database-seed";
import rows from "../shared/texas-ranked-theft.json";
import sources from "../scripts/data-review/output/texas-ranked-theft-evidence.json";
import benchmark from "../scripts/data-review/output/texas-2025-arrest-priorities.json";

const manifest = loadTexasAuthorityManifest();
const sourceByKey = new Map(Object.entries(sources));

describe("Texas ranked theft branches", () => {
  it("reconciles both DPS codes to the exact statutory grades and qualifying predicates", () => {
    const ranked = benchmark.top25.filter(r => rows.some(row => row.dpsCode === r.code));
    expect(ranked.map(row => [row.citation, row.adult])).toEqual([["31.03(e)(2)(A)", 19943], ["31.03(e)(4)(D)", 10620]]);
    expect(rows.map(row => row.code)).toEqual(ranked.map(r => r.citation));
    expect(rows.map(row => row.category)).toEqual(["misdemeanor", "felony"]);
    expect(sources["PE:31.03"].text).toContain("the value of the property stolen is $100 or more but less than $750");
    expect(sources["PE:31.03"].text).toContain("less than $2,500 and the defendant has been previously convicted two or more times of any grade of theft");
    expect(rows[0].penalty).toContain("minimum is 30 days");
    expect(rows[1].conduct).toContain("Prior arrests alone do not qualify");
    expect(rows[1].penalty).toContain("180 days to two years");
  });

  it("requires reviewed offense, grade and dependency evidence and honors the saved-ID boundary", () => {
    const eligible = buildTexasSourceDatabaseSeed(manifest).selectableChargeIds;
    for (const legacy of ["tx-petty-theft","tx-shoplifting","tx-theft-by-receiving","tx-theft-under-2500"]) {
      expect(eligible).not.toContain(legacy);
    }
    expect(resolveGuidanceCharge({ code: "31.03", name: "Theft", classification: "misdemeanor" }, "TX")).toBeUndefined();
    for (const row of rows) {
      const charge = getChargeById(row.id)!;
      expect(eligible).toContain(row.id);
      expect(getVerifiedCitation(charge)).toBe(row.citation);
      expect(getVerifiedSourceUrl(charge)).toBe(sources["PE:31.03"].sourceUrl);
      expect(getInstructionRef(charge)).toContain("CPJC 31.2");
      for (const language of ["en", "es", "zh"]) {
        expect(getChargeExplanation(row.name, "TX", language, row.id)).toMatchObject({
          plainSummary: row.conduct, degreeContext: row.penalty, untranslated: language !== "en", translationDraft: false,
        });
      }
      const record = manifest.catalogRecords.find(r => r.chargeId === row.id)!;
      expect(record.provisions.map(p => [p.lawId,p.section,p.subdivision,p.supportRole]))
        .toEqual(row.references.map(r => [r.code,r.section,r.subdivision,r.supportRole]));
      for (const p of record.provisions) {
        const doc = sourceByKey.get(`${p.lawId}:${p.section}`)!;
        expect(p.content).toBe(doc.text);
        expect(createHash("sha256").update(doc.text).digest("hex")).toBe(doc.textSha256);
        expect(createHash("sha256").update(JSON.stringify(doc.text)).digest("hex")).toBe(p.contentHash);
      }
    }
  });
});
