import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { buildChapterPublicationReview } from "../scripts/data-review/ohio-discovery/review-chapter-2903";
import { OHIO_CHAPTER_2903_ADDITIONAL_CHARGES } from "../shared/ohio-chapter-2903-additional-catalog";
import { getChargeExplanation } from "../shared/charge-explanations";
import { classifyChargesForGuidance, getChargeById } from "../shared/criminal-charges";
import { resolveGuidanceCharge } from "../shared/guidance-charge-resolution";
import { OHIO_CHAPTER_2903_ADDITIONAL_SOURCE_RECORDS } from "../server/data/ohio-chapter-2903-additional-source";
import { buildOhioChapter2903PilotManifestRecords, validateOhioManifestRecord } from "../server/data/ohio-source-database-seed";

const discovery = JSON.parse(readFileSync("scripts/data-review/output/ohio-chapter-2903-discovery.json", "utf8"));

describe("Ohio Chapter 2903 continuation", () => {
  it("exposes the administrative-section felony instead of hiding it as supporting text", () => {
    const review = buildChapterPublicationReview(discovery);
    expect(review.summary).toMatchObject({
      examinedSections: 40, offenseCandidates: 24, supportingProvisions: 14,
      sourceFirstConfiguredRecords: 12, withheldOffenseBearingSections: 14,
      namingTranscriptionReviewRequests: 0,
    });
    const registration = review.rows.find(row => row.section === "2903.43")!;
    expect(registration.disposition).toBe("offense_candidate");
    expect(registration.status).toBe("withheld_from_source_first_publication");
    expect(registration.offenseAndGradingEvidence.some(span =>
      span.text.includes("Whoever violates division (I)(1)") && span.text.includes("fifth degree"))).toBe(true);
  });

  it("uses explicit guilt clauses for vehicular and patient-offense groups, not one row per paragraph", () => {
    const rows = buildChapterPublicationReview(discovery).rows;
    expect(rows.find(row => row.section === "2903.06")?.namedUnits.map(unit => unit.name)).toEqual([
      "Aggravated vehicular homicide", "Vehicular homicide", "Vehicular manslaughter",
    ]);
    expect(rows.find(row => row.section === "2903.08")?.namedUnits.map(unit => unit.name)).toEqual([
      "Aggravated vehicular assault", "Vehicular assault",
    ]);
    expect(rows.find(row => row.section === "2903.34")?.namedUnits.map(unit => unit.name)).toEqual([
      "Patient abuse", "Gross patient neglect", "Patient neglect",
    ]);
    for (const row of rows) {
      const text = discovery.sections.find((source: {sectionId: string}) => source.sectionId === row.section).normalizedText;
      for (const span of [...row.offenseAndGradingEvidence, ...row.namedUnits.map(unit => unit.evidence)]) {
        expect(text.slice(span.start, span.end)).toBe(span.text);
      }
    }
  });

  it.each(OHIO_CHAPTER_2903_ADDITIONAL_CHARGES)("preserves $name identity and localized explanations", charge => {
    expect(getChargeById(charge.id)?.code).toBe(charge.code);
    expect(classifyChargesForGuidance([charge.id])).toEqual([
      expect.objectContaining({ id: charge.id, name: charge.name, verifiedCitation: charge.statuteCitations![0] }),
    ]);
    const en = getChargeExplanation(charge.name, "OH", "en");
    expect(en?.slug).not.toMatch(/degree|criminally-negligent/);
    for (const language of ["es", "zh"]) {
      const localized = getChargeExplanation(charge.name, "OH", language);
      expect(localized?.slug).toBe(en?.slug);
      expect(localized?.plainSummary).not.toBe(en?.plainSummary);
      expect(localized?.translationDraft).toBe(true);
    }
  });

  it("does not resolve the older synthesized negligent-homicide label through saved guidance", () => {
    expect(getChargeById("oh-criminally-negligent-homicide")).toBeUndefined();
    expect(resolveGuidanceCharge({ id: "oh-criminally-negligent-homicide",
      name: "Criminally Negligent Homicide", code: "2903.05", classification: "felony" }, "OH")).toBeUndefined();
  });

  it("requires every pinned sentencing and definition dependency", () => {
    const records = buildOhioChapter2903PilotManifestRecords(new Date());
    for (const source of OHIO_CHAPTER_2903_ADDITIONAL_SOURCE_RECORDS) {
      const record = records.find(row => row.chargeId === source.chargeId)!;
      expect(validateOhioManifestRecord(record)).toBeNull();
      for (let index = 0; index < record.provisions.length; index++) {
        const missing = structuredClone(record);
        missing.provisions.splice(index, 1);
        expect(validateOhioManifestRecord(missing)).not.toBeNull();
      }
    }
  });

  it("requires the unborn definition and its exceptions for negligent assault", () => {
    const records = buildOhioChapter2903PilotManifestRecords(new Date());
    const record = records.find(row => row.chargeId === "oh-orc-2903-14-negligent-assault")!;
    const definition = record.provisions.find(provision => provision.section === "2903.09")!;
    expect(definition).toBeDefined();
    const source = OHIO_CHAPTER_2903_ADDITIONAL_SOURCE_RECORDS.find(
      row => row.chargeId === record.chargeId)!;
    const spans = source.additionalEvidence!.find(document => document.section === "2903.09")!.quotedSpans;
    expect(spans.some(span => span.quote.startsWith(`(B) "Another's unborn"`))).toBe(true);
    expect(spans.some(span => span.quote.startsWith("(C) Notwithstanding"))).toBe(true);
    expect(spans.some(span => span.quote.startsWith("(1) Except") && span.quote.includes("actual consent"))).toBe(true);
    expect(spans.some(span => span.quote.startsWith("(2) In a manner"))).toBe(true);
    expect(spans.some(span => span.quote.startsWith("(e) Her"))).toBe(true);
    record.provisions = record.provisions.filter(provision => provision.section !== "2903.09");
    expect(validateOhioManifestRecord(record)).not.toBeNull();
  });
});