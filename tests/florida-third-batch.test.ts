import { describe, expect, it } from "vitest";
import f from "../shared/florida-reviewed-data/f.json";
import analysis from "../scripts/data-review/output/florida-reviewed-analysis-f.json";
import { FLORIDA_REVIEWED_SOURCE_RECORDS } from "../server/data/florida-reviewed-source-records";

describe("Florida cached abuse and neglect batch", () => {
  it("activates nine distinct, exactly cited and localized scopes", () => {
    expect(f).toHaveLength(9);
    expect(new Set(f.map(row => row.code)).size).toBe(9);
    for (const row of f) {
      expect(row.slug).toBe(row.id);
      expect(row.citations[0].citation).toBe(`Fla. Stat. § ${row.code}`);
      expect(FLORIDA_REVIEWED_SOURCE_RECORDS.some(record => record.chargeId === row.id)).toBe(true);
      for (const locale of ["en", "es", "zh"] as const) {
        expect(row.text[locale].plainSummary.trim()).not.toBe("");
        expect(row.text[locale].degreeContext.trim()).not.toBe("");
      }
    }
  });

  it("binds both aggravated-battery and underlying battery elements", () => {
    for (const code of ["825.102(2)", "827.03(2)(a)"]) {
      const row = f.find(definition => definition.code === code)!;
      const entry = analysis.find(candidate => candidate.id === row.id)!;
      for (const section of ["784.03", "784.045"]) {
        expect(row.citations.some(citation => citation.citation === `Fla. Stat. § ${section}`)).toBe(true);
        expect(entry.requiredSections.some(dependency =>
          dependency.section === section &&
          dependency.role === (section === "784.03" ? "definition" : "justification"))).toBe(true);
      }
    }
  });

  it("does not activate the juvenile-dependency branch without current chapter 39 support", () => {
    const held = analysis.filter(entry => entry.status === "held");
    expect(held).toHaveLength(1);
    expect(held[0].reason).toContain("39.01");
    expect(f.some(row => row.code === "827.04(1)")).toBe(false);
    expect(FLORIDA_REVIEWED_SOURCE_RECORDS.some(row => row.chargeId === held[0].id)).toBe(false);
  });
});