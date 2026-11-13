import {expect, it} from "vitest";
import definitions from "../shared/florida-legacy-remaining.json";
import {buildRemainingBindings} from "../scripts/data-review/florida-legacy-remaining/verify";
import packet from "../scripts/data-review/florida-legacy-remaining/bindings.json";
import {classifyChargesForGuidance, criminalCharges, getChargeById, getChargesByJurisdiction, getSelectableCharges} from "../shared/criminal-charges";
import {getChargeExplanation} from "../shared/charge-explanations";
import {resolveGuidanceCharge} from "../shared/guidance-charge-resolution";
import {loadFloridaAuthorityManifest} from "../server/data/florida-manifest-loader";
import {validateFloridaManifestRecord} from "../server/data/florida-source-database-seed";

const manifest = loadFloridaAuthorityManifest();

it("reproduces source-bound content and rejects missing documents", () => {
  expect(buildRemainingBindings()).toEqual(packet);
  expect(()=>buildRemainingBindings({})).toThrow(/primary text mismatch/);
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
  expect(resolveGuidanceCharge({id:d.id,name:d.legacyLabel,code:d.code,classification:d.category},"FL")?.name).toBe(d.name);
  for (const lang of ["en","es","zh"] as const) {
    const explanation = getChargeExplanation(d.legacyLabel,"FL",lang,d.id);
    expect(explanation).toMatchObject({canonicalChargeId:d.id,...d.text[lang]});
    if (lang !== "en") expect(explanation).toMatchObject({translationDraft:true,untranslated:false});
  }
});

it("rejects an unrelated category or changed source on the historical firearm record", () => {
  const historical = manifest.catalogRecords.find(r => r.chargeId === "fl-discharge-of-firearm-in-city")!;
  expect(validateFloridaManifestRecord({...historical,catalogCategory:"infraction"})).toBeTruthy();
  expect(validateFloridaManifestRecord({...historical,provisions:historical.provisions.map(p=>({...p,contentHash:"invalid"}))})).toBeTruthy();
  for (const id of ["fl-discharge-of-firearm-in-city","fl-unlawful-carrying-of-weapon","fl-reckless-driving"]) {
    expect(classifyChargesForGuidance(id)[0]).toMatchObject({classification:"misdemeanor",categories:["misdemeanor","felony"]});
  }
});
it("accounts for exact threshold, grade and life-sentence distinctions", () => {
  const lookup = (id: string) => getChargeById(id)!;
  expect(lookup("fl-murder-in-the-first-degree").maxPenalty).toContain("death only if sought");
  expect(lookup("fl-murder-in-the-second-degree").description).toContain("depraved disregard");
  expect(lookup("fl-possession-of-marijuana-under-20g").name).toContain("20 Grams or Less");
  expect(lookup("fl-vehicular-homicide").maxPenalty).toContain("October 1, 2025");
  expect(lookup("fl-minor-in-possession").maxPenalty).toContain("prior conviction");
});
