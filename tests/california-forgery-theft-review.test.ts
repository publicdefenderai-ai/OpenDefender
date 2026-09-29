import {CA_CATALOG_COUNTS} from "./fixtures/california-catalog-counts";
import { describe, expect, it } from "vitest";
import additions from "../shared/california-forgery-theft-additions.json";
import { readCaliforniaForgeryTheftReview, readCaliforniaForgeryTheftAcquisition, validateCaliforniaForgeryTheftReview } from "../scripts/data-review/california-verification/forgery-theft-review";
import { getChargeById, getChargesByJurisdiction, classifyChargesForGuidance } from "../shared/criminal-charges";
import { getChargeExplanation } from "../shared/charge-explanations";
import { buildCaliforniaSourceDatabaseSeed } from "../server/data/california-source-database-seed";
import { getCaliforniaCanonicalRecord } from "../shared/california-authority";

describe("California combined forgery/theft expansion", () => {
  it("reuses evidence and keeps all 79 prior open sections accounted for", () => {
    expect(validateCaliforniaForgeryTheftReview()).toEqual({ additions: 28, candidateSections: 79, reviewedPrimarySections: 20, remainingResearchSections: 59, reusedSections: 98, newSections: 7, newVersions: 7, configuredSelectable: CA_CATALOG_COUNTS.configured });
    expect(readCaliforniaForgeryTheftReview().sections.find(s => s.key === "PEN:484e")?.status).toBe("substantive_research_open");
    expect(getChargeById("ca-pen-484e-d")).toBeUndefined();
  });
  it("rejects changed definitions, unsupported evidence and removed dependencies", () => {
    const changed = structuredClone(additions); changed[0].penalty = "No incarceration";
    expect(() => validateCaliforniaForgeryTheftReview(undefined, undefined, changed)).toThrow("Reviewed definition changed");
    const evidence = readCaliforniaForgeryTheftReview(); evidence.records[0].primaryEvidence.text = "Invented";
    expect(() => validateCaliforniaForgeryTheftReview(evidence)).toThrow("Unbound evidence span");
    const missing = readCaliforniaForgeryTheftReview(); missing.records[0].sources.pop();
    expect(() => validateCaliforniaForgeryTheftReview(missing)).toThrow("Incomplete source dependencies");
    const acquisition = readCaliforniaForgeryTheftAcquisition(); acquisition.documents["HNC:21"][0].contentXml += "changed";
    expect(() => validateCaliforniaForgeryTheftReview(undefined, acquisition)).toThrow("provenance changed");
    const identity = readCaliforniaForgeryTheftReview(); identity.records.find(r => r.id === "ca-pen-496d-a")!.sources.find(s => s.key === "HNC:21")!.key = "PEN:21";
    expect(() => validateCaliforniaForgeryTheftReview(identity)).toThrow("Incomplete source dependencies");
  });
  it("does not lose or silently clear unreviewed work", () => {
    const missing = readCaliforniaForgeryTheftReview(); missing.sections.pop();
    expect(() => validateCaliforniaForgeryTheftReview(missing)).toThrow("Successor queue accounting changed");
    const cleared = readCaliforniaForgeryTheftReview(); cleared.sections.find(s => s.key === "PEN:484e")!.status = "addition_branches_reviewed_other_branches_open";
    expect(() => validateCaliforniaForgeryTheftReview(cleared)).toThrow("Unbound section disposition");
  });
  it("keeps construction, retailer aggregation and forgery reductions distinct", () => {
    expect(getChargeById("ca-pen-484b")!.maxPenalty).toContain("$2,350");
    expect(getChargeById("ca-pen-484h-a")!.maxPenalty).toContain("six-month aggregate exceeds $950");
    expect(getChargeById("ca-pen-475-b")!.maxPenalty).toContain("convicted of both forgery and identity theft");
    expect(getChargeById("ca-pen-496d-a")!.maxPenalty).toContain("does not automatically apply");
    expect(getChargeById("ca-pen-496d-a")!.maxPenalty).toContain("2-, 3-, or 4-year");
    expect(getChargeById("ca-pen-480-a")!.description).toContain("knowing they have been or will be used");
    expect(getChargeById("ca-pen-483-5-a")!.description).toContain("Criminal liability under subdivision (f)");
    expect(getChargeById("ca-pen-483-5-b")!.categories).toEqual(["misdemeanor"]);
    expect(getChargeById("ca-pen-499b-b")!.categories).toEqual(["misdemeanor"]);
    expect(getChargeById("ca-pen-499d")!.categories).toEqual(["felony", "misdemeanor"]);
  });
  it("projects every exact branch into selection, explanations, guidance and the source seed", () => {
    const visible = getChargesByJurisdiction("CA");
    expect(visible).toHaveLength(CA_CATALOG_COUNTS.configured);
    expect(new Set(visible.map(c => c.id)).size).toBe(CA_CATALOG_COUNTS.configured);
    const seed = buildCaliforniaSourceDatabaseSeed(new Date("2026-09-27T00:00:00Z"));
    for (const a of additions) {
      expect(getChargeById(a.id)).toMatchObject({ code: a.code, name: a.title, description: a.summary, maxPenalty: a.penalty, categories: a.categories });
      expect(classifyChargesForGuidance([a.id])[0]).toMatchObject({ id: a.id, maxPenalty: a.penalty, categories: a.categories });
      expect(seed.selectableChargeIds).toContain(a.id);
      expect(seed.links.filter(l => l.chargeId === a.id)).toHaveLength(a.supportingKeys.length + 1);
      const record = getCaliforniaCanonicalRecord(a.id)!;
      expect(record.legacyIds).toEqual([]);
      expect(record.currentness.evidence).toContain("california-forgery-theft-review.json");
      for (const language of ["en", "es", "zh", "es-MX", "zh-CN"]) {
        const explanation = getChargeExplanation("Untrusted display name", "CA", language, a.id)!;
        expect(explanation).toMatchObject({ canonicalChargeId: a.id, plainSummary: a.summary, degreeContext: a.penalty, untranslated: language !== "en", translationDraft: false });
      }
    }
    const vessel = getCaliforniaCanonicalRecord("ca-pen-496d-a")!.sources.find(s => new URL(s.url).searchParams.get("lawCode") === "HNC")!;
    expect(vessel.citation).toBe("Cal. Harbors & Navigation Code § 21");
    expect(vessel.effectiveDate).toBeNull();
  });
});
