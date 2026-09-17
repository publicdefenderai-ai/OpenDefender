import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { OHIO_CHAPTER_BATCH_SOURCES as sources } from "../server/data/ohio-chapter-batch-source";
import { OHIO_CHAPTER_BATCH_CHARGES as charges } from "../shared/ohio-chapter-batch";
import { getChargeExplanation } from "../shared/charge-explanations";
import { getChargeById, classifyChargesForGuidance } from "../shared/criminal-charges";
import { buildOhioChapter2903PilotManifestRecords, validateOhioManifestRecord, buildOhioSourceDatabaseSeed } from "../server/data/ohio-source-database-seed";
import { loadOhioAuthorityManifest } from "../server/data/ohio-manifest-loader";
import { OHIO_CHAPTER_2903_REFRESH_RECEIPT_PATH, validateOhioChapter2903RefreshReceipt } from "../server/data/ohio-chapter-2903-refresh";

const sourceFor = (section: string) => sources.find(row => row.offense.section === section)!;
const chargeFor = (section: string) => charges.find(row => row.code === section)!;
const quotesFor = (section: string) => sourceFor(section).offense.quotedSpans.map(row => row.quote).join("\n");

describe("Ohio three-charge source-first batch", () => {
  it.each(charges)("publishes the exact statutory identity for $name", charge => {
    expect(getChargeById(charge.id)?.name).toBe(charge.name);
    expect(classifyChargesForGuidance([charge.id])).toEqual([
      expect.objectContaining({ id: charge.id, verifiedCitation: `Ohio Rev. Code Ann. § ${charge.code}` }),
    ]);
    expect(sourceFor(charge.code).canonicalTitle).toBe(charge.name);
  });

  it("retains aggravated-menacing belief, organizational targeting and full qualifying prior conditions", () => {
    const text = quotesFor("2903.21");
    for (const value of ["knowingly cause another to believe", "serious physical harm",
      "performance or anticipated performance", "the victim of that prior offense", "governmental employer"]) {
      expect(text).toContain(value);
    }
    expect(chargeFor("2903.21").description).toContain("not a requirement that a weapon be displayed");
    const definitions = sourceFor("2903.21").additionalEvidence!;
    expect(definitions.some(row => row.section === "2903.09")).toBe(true);
    expect(definitions.find(row => row.section === "2901.01" && row.subdivision === "(A)(9)")!.quotedSpans.some(row =>
      row.quote.startsWith("(e) A violation of division"))).toBe(true);
    expect(definitions.some(row => row.section === "5153.02")).toBe(true);
  });

  it("retains child-abuse age/custody/causation and both affirmative-defense requirements", () => {
    const text = quotesFor("2903.15");
    for (const value of ["under eighteen", "under twenty-one", "proximate result",
      "did not have readily available a means", "and that the defendant took timely and reasonable steps"]) {
      expect(text).toContain(value);
    }
    const culpability = sourceFor("2903.15").additionalEvidence!.find(row => row.section === "2901.21")!;
    expect(culpability.quotedSpans.some(row => row.quote.includes("neither specifies culpability nor plainly indicates"))).toBe(true);
    expect(chargeFor("2903.15").description).toContain("do not assume automatic strict liability");
    expect(chargeFor("2903.15").maxPenalty).toContain("Serious physical harm is third-degree; death is first-degree");
  });

  it("keeps strangulation's pregnancy alternative independent and imports only the adopted dating definition", () => {
    const text = quotesFor("2903.18");
    expect(text).toContain("or if the offender knew");
    expect(text).toContain("within the twelve months");
    expect(text).toContain("medical or other procedure undertaken to aid or benefit");
    const dating = sourceFor("2903.18").additionalEvidence!.find(row => row.section === "3113.31")!;
    expect(dating.subdivision).toBe("(A)(8)");
    expect(dating.quotedSpans.some(row => row.quote.includes("casual acquaintanceship"))).toBe(true);
    expect(dating.quotedSpans.some(row => row.quote.includes("respondent who is an adult"))).toBe(false);
    const family = sourceFor("2903.18").additionalEvidence!.find(row => row.section === "2919.25")!;
    expect(family.quotedSpans.some(row => row.quote.includes("within five years"))).toBe(true);
    expect(family.quotedSpans.some(row => row.quote.startsWith("(b) The natural parent"))).toBe(true);
    expect(chargeFor("2903.18").maxPenalty).toContain("does not require that relationship or a prior conviction");
  });

  it.each(charges)("rejects missing or wrong-role evidence for $name and withholds expired approval", charge => {
    const record = buildOhioChapter2903PilotManifestRecords(new Date()).find(row => row.chargeId === charge.id)!;
    expect(validateOhioManifestRecord(record)).toBeNull();
    for (let index = 0; index < record.provisions.length; index++) {
      const missing = structuredClone(record);
      missing.provisions.splice(index, 1);
      expect(validateOhioManifestRecord(missing)).not.toBeNull();
      const wrongRole = structuredClone(record);
      wrongRole.provisions[index].supportRole = wrongRole.provisions[index].supportRole === "penalty" ? "offense" : "penalty";
      expect(validateOhioManifestRecord(wrongRole)).not.toBeNull();
    }
    const future = new Date(Date.now() + 8 * 86400000);
    const seed = buildOhioSourceDatabaseSeed(loadOhioAuthorityManifest(undefined, future), future);
    expect(seed.selectableChargeIds).not.toContain(charge.id);
  });

  it("requires a current check for every newly adopted official page", () => {
    const receipt = JSON.parse(readFileSync(OHIO_CHAPTER_2903_REFRESH_RECEIPT_PATH, "utf8"));
    const now = new Date(receipt.checkedAt);
    expect(validateOhioChapter2903RefreshReceipt(receipt, now)).toBeNull();
    for (const section of ["2903.15", "2903.18", "2903.21", "2901.21", "2919.25", "3113.31", "5153.01", "5153.02"]) {
      const missing = structuredClone(receipt);
      missing.documents = missing.documents.filter((row: { section: string }) => row.section !== section);
      expect(validateOhioChapter2903RefreshReceipt(missing, now)).not.toBeNull();
    }
  });

  it.each(charges)("provides Ohio-scoped EN/ES/ZH explanations for $name", charge => {
    for (const jurisdiction of ["OH", "Ohio", " ohio "]) {
      const english = getChargeExplanation(charge.name, jurisdiction, "en", charge.id)!;
      expect(english.slug).toMatch(/^ohio-/);
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

  it("retains the most easily lost legal conditions in all three languages", () => {
    for (const [language, both, independent, notFixed] of [
      ["en", "both conditions", "does not require that relationship or a prior conviction", "not fixed fines"],
      ["es", "ambas condiciones", "no exige esa relación ni una condena previa", "no son multas fijas"],
      ["zh", "两项条件同时满足", "不要求该关系或既往定罪", "不是固定罚款"],
    ]) {
      expect(getChargeExplanation("Permitting child abuse", "OH", language)!.plainSummary).toContain(both);
      const strangulation = getChargeExplanation("Strangulation", "OH", language)!;
      expect(strangulation.degreeContext).toContain(independent);
      expect(strangulation.degreeContext).toContain(notFixed);
    }
  });
});