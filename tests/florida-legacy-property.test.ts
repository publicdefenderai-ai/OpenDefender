import { describe, expect, it } from "vitest";
import definitions from "../shared/florida-legacy-property.json";
import bindings from "../scripts/data-review/florida-legacy-property/bindings.json";
import sources from "../scripts/data-review/florida-legacy-property/sources.json";
import plan from "../scripts/data-review/florida-legacy-property/plan.json";
import { buildLegacyPropertyBindings } from "../scripts/data-review/florida-legacy-property/verify";
import { getChargeById, classifyChargesForGuidance, criminalCharges } from "../shared/criminal-charges";
import { getChargeExplanation } from "../shared/charge-explanations";

describe("Florida legacy property choices", () => {
  it("binds six existing exact identities and every legal and translated claim to the reviewed version", () => {
    expect(buildLegacyPropertyBindings()).toEqual(bindings);
    const mutated = structuredClone(sources);
    mutated["812.133"].text += "changed";
    expect(() => buildLegacyPropertyBindings(mutated)).toThrow("Invalid retained Florida source");
    const wrong = structuredClone(plan);
    wrong[4].subdivision = "(2)(b)";
    expect(() => buildLegacyPropertyBindings(sources, wrong)).toThrow("identity or source drift");
  });
  it.each(definitions)("preserves the configured identity and corrects the guidance and selector for $id", d => {
    expect(criminalCharges.filter(row => row.id === d.id)).toHaveLength(1);
    const charge = getChargeById(d.id)!;
    expect(charge.code).toBe(d.code);
    expect(charge.description).toBe(d.text.en.plainSummary);
    expect(charge.maxPenalty).toBe(d.text.en.degreeContext);
    expect(classifyChargesForGuidance(d.id)[0]).toMatchObject({id: d.id, maxPenalty: d.text.en.degreeContext});
    for (const lang of ["en","es","zh"] as const) {
      const explanation = getChargeExplanation(d.name, "FL", lang, d.id);
      expect(explanation).toMatchObject({canonicalChargeId: d.id, ...d.text[lang]});
      expect(explanation?.sources.map(source => source.url)).toEqual(d.citations.map(citation => citation.url));
      if (lang !== "en") expect(explanation).toMatchObject({translationDraft:true, untranslated:false});
    }
  });
  it("keeps the theft thresholds, two robbery subdivisions, and both carjacking branches distinct", () => {
    const [first,second,third,armed,unarmed,car] = definitions.map(row => row.text.en);
    expect(first.plainSummary).toContain("$100,000");
    expect(second.plainSummary).toContain("$20,000");
    expect(third.plainSummary).toContain("$750");
    expect(armed.plainSummary).toContain("injury is not required");
    expect(unarmed.plainSummary).toContain("no firearm, deadly weapon or other weapon");
    expect(unarmed.degreeContext).toContain("15 years");
    expect(car.degreeContext).toMatch(/up to life[\s\S]+up to 30 years/);
    expect(car.degreeContext).not.toMatch(/death penalty|federal carjacking/i);
  });
});
