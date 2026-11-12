import {expect, it} from "vitest";
import definitions from "../shared/florida-legacy-sexual.json";
import {buildSexualBindings} from "../scripts/data-review/florida-legacy-sexual/verify";
import packet from "../scripts/data-review/florida-legacy-sexual/bindings.json";
import {classifyChargesForGuidance, criminalCharges, getChargeById, getChargesByJurisdiction, getSelectableCharges} from "../shared/criminal-charges";
import {getChargeExplanation} from "../shared/charge-explanations";
import {resolveGuidanceCharge} from "../shared/guidance-charge-resolution";
import {loadFloridaAuthorityManifest} from "../server/data/florida-manifest-loader";
import {validateFloridaManifestRecord} from "../server/data/florida-source-database-seed";

const manifest = loadFloridaAuthorityManifest();

it("reproduces source-bound content and rejects missing documents", () => {
  expect(buildSexualBindings()).toEqual(packet);
  expect(()=>buildSexualBindings({})).toThrow(/primary text mismatch/);
});
it.each(definitions)("preserves the eligible legacy identity and carries corrected $code into each guidance path", d => {
  const stored = manifest.catalogRecords.find(r => r.chargeId === d.id)!;
  expect(validateFloridaManifestRecord(stored)).toBeNull();
  expect(criminalCharges.find(c => c.id === d.id)?.name).toBe(d.legacyLabel);
  const charge = getChargeById(d.id)!;
  for (const choices of [getChargesByJurisdiction("FL"),getSelectableCharges()]) {
    expect(choices.filter(c => c.id === d.id).map(c => c.name)).toEqual([d.name]);
  }
  expect(charge.searchAliases).toContain(d.legacyLabel);
  expect(classifyChargesForGuidance(d.id)[0]).toMatchObject({id:d.id,title:d.name,maxPenalty:d.text.en.degreeContext});
  expect(resolveGuidanceCharge({id:d.id,name:d.legacyLabel,code:d.code,classification:"felony"},"FL")?.name).toBe(d.name);
  for (const lang of ["en","es","zh"] as const) {
    const explanation = getChargeExplanation(d.legacyLabel,"FL",lang,d.id);
    expect(explanation).toMatchObject({canonicalChargeId:d.id,...d.text[lang]});
    if (lang !== "en") expect(explanation).toMatchObject({translationDraft:true,untranslated:false});
  }
});
it("distinguishes the life felony, the conditional adult minimum and the separate age statute",()=>{
  const [life,lesser,age] = definitions.map(d=>d.text.en);
  expect(life.plainSummary).toMatch(/age 12 or older[\s\S]+deadly weapon/);
  expect(life.degreeContext).toMatch(/\$15,000[\s\S]+50 years to life/);
  expect(lesser.degreeContext).toMatch(/up to 30 years[\s\S]+up to 15 years/);
  expect(age.plainSummary).toMatch(/age 24 or older[\s\S]+age 16 or 17/);
  expect(age.degreeContext).toContain("up to 15 years");
  expect(getChargeById(definitions[2].id)?.commonDefenses).not.toContain("Consent");
});
