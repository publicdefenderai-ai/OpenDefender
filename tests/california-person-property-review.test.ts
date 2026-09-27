import { describe, expect, it } from "vitest";
import { readCaliforniaPersonPropertyReview, readCaliforniaPersonPropertyAcquisition, validateCaliforniaPersonPropertyReview } from "../scripts/data-review/california-verification/person-property-review";
import additions from "../shared/california-person-property-additions.json";
import { criminalCharges, getChargeById, getChargesByJurisdiction, classifyChargesForGuidance } from "../shared/criminal-charges";
import { getCaliforniaCanonicalRecord, CALIFORNIA_LEGACY_DISPOSITIONS } from "../shared/california-authority";
import { getChargeExplanation } from "../shared/charge-explanations";
import { buildCaliforniaSourceDatabaseSeed, buildCaliforniaReferenceHash } from "../server/data/california-source-database-seed";

describe("California person/property additions", () => {
  it("binds 26 new identities and accounts for all 142 candidate sections without clearing the open queue", () => {
    const result = validateCaliforniaPersonPropertyReview();
    expect(result).toMatchObject({ additions: 26, candidateSections: 142, reusedSections: 39, newSections: 118, configuredSelectable: 153 });
    expect(result.dispositions.substantive_research_open).toBe(79);
    expect(result.dispositions.deferred_low_priority_infraction).toBe(1);
    expect(CALIFORNIA_LEGACY_DISPOSITIONS).toHaveLength(115);
    expect(getChargeById("ca-pen-243-83")).toBeUndefined();
  });
  it("rejects an altered proposal, source bytes, or source binding", () => {
    const changed = readCaliforniaPersonPropertyReview(); changed.records[0].definitionSha256 = "unreviewed";
    expect(() => validateCaliforniaPersonPropertyReview(changed)).toThrow("Reviewed addition changed");
    const evidence = readCaliforniaPersonPropertyReview(); evidence.records[0].primaryEvidence.text = "invented";
    expect(() => validateCaliforniaPersonPropertyReview(evidence)).toThrow("Unbound primary evidence span");
    const binding = readCaliforniaPersonPropertyReview(); binding.records[0].sources[0].versions[0].contentSha256 = "changed";
    expect(() => validateCaliforniaPersonPropertyReview(binding)).toThrow("Unresolved addition source version");
    const acquisition = readCaliforniaPersonPropertyAcquisition(); acquisition.documents["PEN:244"][0].contentXml += "changed";
    expect(() => validateCaliforniaPersonPropertyReview(readCaliforniaPersonPropertyReview(), acquisition)).toThrow("provenance changed");
  });
  it("rejects missing dependencies, duplicate section accounting and unexplained deferrals", () => {
    const deps = readCaliforniaPersonPropertyReview(); deps.records[0].sources.pop();
    expect(() => validateCaliforniaPersonPropertyReview(deps)).toThrow("Addition dependencies incomplete");
    const duplicate = readCaliforniaPersonPropertyReview(); duplicate.sections[1] = duplicate.sections[0];
    expect(() => validateCaliforniaPersonPropertyReview(duplicate)).toThrow("section accounting changed");
    const gap = readCaliforniaPersonPropertyReview(); gap.deferrals[0].severityEvidence = "";
    expect(() => validateCaliforniaPersonPropertyReview(gap)).toThrow("Unexplained publication deferral");
  });
  it("keeps firearm, semiautomatic, officer and serious-injury branches distinct", () => {
    expect(getChargeById("ca-pen-245-a-2")!.categories).toEqual(["felony", "misdemeanor"]);
    expect(getChargeById("ca-pen-245-a-2")!.maxPenalty).toContain("6 months to 364 days");
    expect(getChargeById("ca-pen-245-b")!.categories).toEqual(["felony"]);
    expect(getChargeById("ca-pen-245-b")!.maxPenalty).toContain("3, 6, or 9 years");
    expect(getChargeById("ca-pen-245-d-2")!.maxPenalty).toContain("5, 7, or 9 years");
    expect(getChargeById("ca-pen-243-d")!.maxPenalty).toContain("2, 3, or 4 years");
    expect(getChargeById("ca-pen-243-d")!.description).toContain("serious impairment");
  });
  it("does not duplicate firearm negligence or assign its felony route to BB devices", () => {
    expect(getChargeById("ca-pen-246-3-a")).toBeUndefined();
    expect(getChargeById("ca-discharge-of-firearm-in-city")!.description).toContain("§246.3(a)");
    expect(getChargeById("ca-pen-246-3-b")!.categories).toEqual(["misdemeanor"]);
    expect(getChargeById("ca-pen-246-3-b")!.maxPenalty).toContain("does not apply");
    expect(getChargeById("ca-pen-246")!.description).toContain("even if nobody is inside");
  });
  it("preserves forgery-specific intent and express fine alternatives", () => {
    expect(getChargeById("ca-pen-470b")!.description).toContain("intent that it facilitate forgery");
    expect(getChargeById("ca-pen-471-5")!.maxPenalty).toContain("6 months");
    expect(getChargeById("ca-pen-247-5")!.maxPenalty).toContain("not an automatic combination");
    expect(getChargeById("ca-pen-245-6-c")!.maxPenalty).toContain("$100 to $5,000");
  });
  it("preserves actual effective dates and unknowns instead of assigning the review month", () => {
    const seed = buildCaliforniaSourceDatabaseSeed(new Date("2026-09-27T00:00:00Z"));
    expect(getCaliforniaCanonicalRecord("ca-pen-471-5")!.currentness.effectiveDate).toBeNull();
    expect(getCaliforniaCanonicalRecord("ca-pen-244")!.currentness.effectiveDate).toBe("1996-01-01");
    const record = getCaliforniaCanonicalRecord("ca-pen-244")!;
    const source = record.sources.find(s => s.citation.endsWith("18.5"))!;
    const original = buildCaliforniaReferenceHash(record, source);
    expect(buildCaliforniaReferenceHash(record, { ...source, effectiveDate: "2026-09-27" })).not.toBe(original);
    for (const a of additions) {
      for (const snapshot of seed.snapshots.filter(s => s.metadata.canonicalId === a.id)) {
        const u = new URL(snapshot.sourceUrl);
        const key = `${u.searchParams.get("lawCode")}:${u.searchParams.get("sectionNum")}`;
        expect(snapshot.effectiveDateStart).toBe((a.sourceEffectiveDates as Record<string, string | null | undefined>)[key]);
      }
    }
  });
  it("projects the same identity, categories and text through catalog, guidance, explanation and source manifest", () => {
    const seed = buildCaliforniaSourceDatabaseSeed(new Date("2026-09-27T00:00:00Z"));
    const visible = getChargesByJurisdiction("CA");
    expect(visible).toHaveLength(153);
    expect(new Set(visible.map(c => c.id)).size).toBe(153);
    for (const a of additions) {
      const charge = getChargeById(a.id)!;
      expect(charge.description).toBe(a.summary);
      expect(charge.maxPenalty).toBe(a.penalty);
      expect(classifyChargesForGuidance([a.id])[0]).toMatchObject({ id: a.id, categories: a.categories, maxPenalty: a.penalty, verifiedCitation: `Cal. Penal Code § ${a.code}` });
      expect(criminalCharges.find(c => c.id === a.id)!.categories).toEqual(a.categories);
      expect(getCaliforniaCanonicalRecord(a.id)!.legacyIds).toEqual([]);
      expect(seed.selectableChargeIds).toContain(a.id);
      expect(seed.catalogRecords.some(r => r.chargeId === a.id)).toBe(true);
      const links = seed.links.filter(l => l.chargeId === a.id);
      expect(links).toHaveLength(a.supportingKeys.length + 1);
      for (const language of ["en", "es", "zh"]) {
        const explanation = getChargeExplanation("An intentionally wrong display name", "CA", language, a.id)!;
        expect(explanation.plainSummary).toBe(a.summary);
        expect(explanation.degreeContext).toBe(a.penalty);
        expect(explanation.untranslated).toBe(language !== "en");
        expect(explanation.translationDraft).toBe(false); // English fallback, not a claimed translation.
      }
    }
  });
});
