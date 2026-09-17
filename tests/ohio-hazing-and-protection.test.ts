import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { OHIO_HAZING_AND_PROTECTION_CHARGES as charges } from "../shared/ohio-hazing-and-protection";
import { OHIO_HAZING_AND_PROTECTION_SOURCES as sources } from "../server/data/ohio-hazing-and-protection-source";
import { ohioChapter2903Evidence } from "../server/data/ohio-chapter-2903-source";
import { createOhioEvidenceReader } from "../server/data/ohio-pinned-evidence";
import { buildOhioChapter2903PilotManifestRecords, validateOhioManifestRecord, buildOhioSourceDatabaseSeed } from "../server/data/ohio-source-database-seed";
import { loadOhioAuthorityManifest } from "../server/data/ohio-manifest-loader";
import { OHIO_CHAPTER_2903_REFRESH_RECEIPT_PATH, validateOhioChapter2903RefreshReceipt } from "../server/data/ohio-chapter-2903-refresh";
import { getChargeById, classifyChargesForGuidance, criminalCharges, CHARGE_ID_ALIASES } from "../shared/criminal-charges";
import { getChargeExplanation } from "../shared/charge-explanations";

const sourceFor = (section: string) => sources.find(row => row.offense.section === section)!;
const textFor = (section: string) => sourceFor(section).offense.quotedSpans.map(span => span.quote).join("\n");

describe("Ohio hazing and protection batch", () => {
  it.each(charges)("keeps the independent statutory identity for $name", charge => {
    expect(getChargeById(charge.id)?.name).toBe(charge.name);
    expect(sourceFor(charge.code).canonicalTitle).toBe(charge.name);
    expect(classifyChargesForGuidance([charge.id])).toEqual([
      expect.objectContaining({ id: charge.id, verifiedCitation: `Ohio Rev. Code Ann. § ${charge.code}` }),
    ]);
    expect(criminalCharges.filter(row => row.jurisdiction === "OH" && row.code === charge.code)).toHaveLength(1);
    expect(CHARGE_ID_ALIASES[charge.id]).toBeUndefined();
  });

  it("quotes both distinct permission clauses instead of selecting B2 twice", () => {
    const permissions = sourceFor("2903.31").offense.quotedSpans
      .filter(span => span.quote.startsWith("(2) No administrator"));
    expect(permissions).toHaveLength(2);
    expect(permissions[0].quote).toMatch(/associated with the organization\.$/);
    expect(permissions[1].quote).toContain("coerced consumption of alcohol or drugs of abuse resulting in serious physical harm");
    expect(permissions[1].start).toBeGreaterThan(permissions[0].end);
    expect(textFor("2903.31")).toContain("continue or reinstate membership");
    expect(textFor("2903.31")).toContain("mental or physical harm");
    expect(textFor("2903.31")).toContain("misdemeanor of the second degree");
    expect(textFor("2903.31")).toContain("felony of the third degree");
  });

  it("retains the reporting roles, both capacity conditions, immediacy and both county choices", () => {
    const text = textFor("2903.311");
    for (const phrase of ["administrator, employee, faculty member, teacher, consultant, alumnus, or volunteer",
      "official and professional capacity", "immediately report the knowledge", "law enforcement agency",
      "county in which the victim", "or in which the hazing", "misdemeanor of the first degree"]) {
      expect(text).toContain(phrase);
    }
    expect(sourceFor("2903.311").additionalEvidence!.some(row => row.section === "2903.31" && row.subdivision === "(A)")).toBe(true);
  });

  it("keeps the drug umbrella and full category definitions without classifying particular substances", () => {
    for (const section of ["2903.31", "2903.311"]) {
      const documents = sourceFor(section).additionalEvidence!;
      for (const required of ["3719.011", "3719.01", "4729.01", "2925.01", "2901.22", "2901.01"]) {
        expect(documents.some(row => row.section === required)).toBe(true);
      }
      expect(documents.find(row => row.section === "4729.01")!.quotedSpans.some(row =>
        row.quote.includes("biological product"))).toBe(true);
      expect(documents.find(row => row.section === "2925.01")!.quotedSpans.some(row =>
        row.quote.includes("does not include beer or intoxicating liquor"))).toBe(true);
    }
  });

  it("keeps both minor-victim conduct paths, every medical exception condition and all three nondefenses", () => {
    const text = textFor("2903.32");
    for (const phrase of ["under the age of eighteen", "knowingly transport a minor",
      "purpose of facilitating", "medical purposes", "physician or licensed health care professional",
      "within the scope", "Cultural or ritual necessity", "Consent of the minor", "Consent of the parent or guardian"]) {
      expect(text).toContain(phrase);
    }
    const fine = ohioChapter2903Evidence(sourceFor("2903.32")).find(row =>
      row.document.section === "2903.32" && row.document.subdivision === "(B)")!;
    expect(fine.supportRole).toBe("penalty");
    expect(fine.document.quotedSpans.some(row => row.kind === "penalty" &&
      row.quote.includes("shall impose") && row.quote.includes("additional fine of up to twenty-five thousand"))).toBe(true);
  });

  it.each(charges)("rejects missing/wrong-role evidence and expired authorization for $name", charge => {
    const record = buildOhioChapter2903PilotManifestRecords(new Date()).find(row => row.chargeId === charge.id)!;
    expect(validateOhioManifestRecord(record)).toBeNull();
    for (let index = 0; index < record.provisions.length; index++) {
      const missing = structuredClone(record);
      missing.provisions.splice(index, 1);
      expect(validateOhioManifestRecord(missing)).not.toBeNull();
      const wrong = structuredClone(record);
      wrong.provisions[index].supportRole = wrong.provisions[index].supportRole === "offense" ? "penalty" : "offense";
      expect(validateOhioManifestRecord(wrong)).not.toBeNull();
    }
    const future = new Date(Date.now() + 8 * 86400000);
    expect(buildOhioSourceDatabaseSeed(loadOhioAuthorityManifest(undefined, future), future).selectableChargeIds).not.toContain(charge.id);
  });

  it("rejects unapproved acquisition hashes and missing live checks for every newly adopted page", () => {
    const receipt = JSON.parse(readFileSync(OHIO_CHAPTER_2903_REFRESH_RECEIPT_PATH, "utf8"));
    expect(validateOhioChapter2903RefreshReceipt(receipt, new Date(receipt.checkedAt))).toBeNull();
    for (const section of ["2903.31", "2903.311", "2903.32", "3719.011", "3719.01", "4729.01", "2925.01"]) {
      const reader = createOhioEvidenceReader("scripts/data-review/output/ohio-hazing-and-protection-evidence.json", { [section]: "unreviewed" });
      expect(() => reader(section, null, [])).toThrow("not the reviewed official text");
      const missing = structuredClone(receipt);
      missing.documents = missing.documents.filter((row: { section: string }) => row.section !== section);
      expect(validateOhioChapter2903RefreshReceipt(missing, new Date(receipt.checkedAt))).not.toBeNull();
    }
  });

  it.each(charges)("provides Ohio-only English, Spanish and Chinese summaries for $name", charge => {
    for (const jurisdiction of ["OH", "Ohio", " ohio "]) {
      const english = getChargeExplanation(charge.name, jurisdiction, "en", charge.id)!;
      expect(english.degreeContext).toBe(charge.maxPenalty);
      for (const language of ["es", "zh"]) {
        const localized = getChargeExplanation(charge.name, jurisdiction, language, charge.id)!;
        expect(localized.slug).toBe(english.slug);
        expect(localized.plainSummary).not.toBe(english.plainSummary);
        expect(localized.degreeContext).not.toBe(english.degreeContext);
        expect(localized.translationDraft).toBe(true);
      }
      expect(getChargeExplanation(charge.name, jurisdiction, "es", charge.id)!.plainSummary).toBe(charge.descriptionEs);
    }
    expect(getChargeExplanation(charge.name, "CA")?.slug ?? "").not.toMatch(/^ohio-/);
    expect(getChargeExplanation(charge.name)?.slug ?? "").not.toMatch(/^ohio-/);
  });

  it("preserves different injury enhancements and the mandatory-but-not-fixed additional fine in each language", () => {
    const reportingName = charges.find(row => row.code === "2903.311")!.name;
    for (const [language, hazing, reporting, fine] of [
      ["en", "Serious injury alone does not establish", "not a general duty", "mandatory, but $25,000 is a ceiling"],
      ["es", "Una lesión grave por sí sola no establece", "No es un deber general", "obligatorio, pero $25,000 es un máximo"],
      ["zh", "仅有严重伤害并不足以确立", "不是对所有旁观者", "是强制性的，但25,000美元是上限"],
    ]) {
      expect(getChargeExplanation("Hazing", "OH", language)!.plainSummary).toContain(hazing);
      expect(getChargeExplanation(reportingName, "OH", language)!.plainSummary).toContain(reporting);
      expect(getChargeExplanation("Female genital mutilation", "OH", language)!.degreeContext).toContain(fine);
    }
  });

  it("does not narrow the membership-or-affiliation alternative in any language", () => {
    for (const charge of charges.filter(row => row.code !== "2903.32")) {
      for (const [language, phrase] of [["en", "affiliation"], ["es", "miembro o la afiliación"], ["zh", "成员资格或关联关系"]]) {
        expect(getChargeExplanation(charge.name, "OH", language)!.plainSummary).toContain(phrase);
      }
    }
  });
});