import { readFileSync } from "node:fs";
import { describe, it, expect } from "vitest";
import { OHIO_FELONIOUS_ASSAULT_SOURCE as source } from "../server/data/ohio-felonious-assault-source";
import { OHIO_FELONIOUS_ASSAULT_CHARGE as charge } from "../shared/ohio-felonious-assault";
import { ohioChapter2903Evidence } from "../server/data/ohio-chapter-2903-source";
import { buildOhioChapter2903PilotManifestRecords, validateOhioManifestRecord, buildOhioSourceDatabaseSeed } from "../server/data/ohio-source-database-seed";
import { loadOhioAuthorityManifest } from "../server/data/ohio-manifest-loader";
import { getChargeExplanation } from "../shared/charge-explanations";
import { getChargeById, classifyChargesForGuidance } from "../shared/criminal-charges";
import { resolveGuidanceCharge } from "../shared/guidance-charge-resolution";
import { validateOhioChapter2903RefreshReceipt, OHIO_CHAPTER_2903_REFRESH_RECEIPT_PATH } from "../server/data/ohio-chapter-2903-refresh";

describe("Ohio felonious assault source-first record", () => {
  it("keeps both conduct families and the local sexual-conduct exception", () => {
    const quotes = source.offense.quotedSpans.map(row => row.quote).join("\n");
    for (const text of ["Cause serious physical harm", "Cause or attempt to cause physical harm",
      "without disclosing that knowledge", "lacks the mental capacity", "under eighteen years of age",
      "not the spouse", "carried the offender's bodily fluid"]) {
      expect(quotes).toContain(text);
    }
    expect(source.additionalEvidence!.some(row => row.section === "2907.01")).toBe(true);
    expect(source.additionalEvidence!.some(row => row.section === "2903.09")).toBe(true);
    expect(getChargeById(charge.id)?.name).toBe("Felonious assault");
    expect(classifyChargesForGuidance([charge.id])).toEqual([
      expect.objectContaining({ id: charge.id, verifiedCitation: "Ohio Rev. Code Ann. § 2903.11" }),
    ]);
  });

  it("preserves graded modern minimums, maxima and the pregnancy date exception", () => {
    const quotes = source.offense.quotedSpans.map(row => row.quote).join("\n");
    expect(quotes).toContain("felony of the second degree");
    expect(quotes).toContain("victim of a violation of division (A)");
    expect(quotes).toContain("victim suffered serious physical harm");
    expect(source.additionalPenalties!.some(row => row.section === "2929.144")).toBe(true);
    const terms = source.additionalPenalties!.find(row => row.section === "2929.14" && row.subdivision === null)!;
    const pregnancy = terms.quotedSpans.find(row => row.quote.startsWith("(8)"))!.quote;
    expect(pregnancy).toContain("except that if the violation is a felony of the first or second degree committed on or after March 22, 2019");
    expect(charge.maxPenalty).toContain("not six months");
    expect(charge.maxPenalty).toContain("minimum plus 50%");
  });

  it("does not stack the child-victim term with other additional terms for the same offense", () => {
    const specification = source.additionalPenalties!.find(row => row.section === "2941.1426")!;
    expect(specification.quotedSpans.some(row => row.quote.includes("precluded if a court imposes any other additional prison term"))).toBe(true);
    const terms = source.additionalPenalties!.find(row => row.section === "2929.14" && row.subdivision === null)!;
    expect(terms.quotedSpans.some(row => row.quote.includes("shall not impose any other additional prison term"))).toBe(true);
    expect(terms.quotedSpans.some(row => row.quote.includes("consecutively to and prior to") && row.quote.includes("(B)(10)"))).toBe(true);
    expect(source.additionalPenalties!.find(row => row.section === "2929.01")!.quotedSpans.some(
      row => row.quote.includes("permanently and substantially impairs"))).toBe(true);
  });

  it("requires accelerant injury conditions, same-act limit, suspension and both life-specification prerequisites", () => {
    const accelerant = source.additionalPenalties!.find(row => row.section === "2941.1425")!;
    expect(accelerant.quotedSpans.some(row => row.quote.includes("permanent, serious disfigurement or permanent, substantial incapacity"))).toBe(true);
    const terms = source.additionalPenalties!.find(row => row.section === "2929.14" && row.subdivision === null)!;
    expect(terms.quotedSpans.some(row => row.quote.includes("shall not impose more than one") && row.quote.includes("same act"))).toBe(true);
    expect(source.additionalPenalties!.find(row => row.section === "4510.02")!.quotedSpans.some(row => row.quote.includes("three years to life"))).toBe(true);
    const life = source.additionalPenalties!.find(row => row.section === "2971.03")!;
    expect(life.quotedSpans.some(row => row.quote.includes("both a sexual motivation specification and a sexually violent predator specification"))).toBe(true);
    expect(life.quotedSpans.some(row => row.quote.includes("under eighteen years of age"))).toBe(true);
  });

  it("rejects missing dependencies, wrong roles and missing freshness evidence", () => {
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
    expect(ohioChapter2903Evidence(source).find(row => row.document.section === "2971.01")?.supportRole).toBe("penalty");
    const receipt = JSON.parse(readFileSync(OHIO_CHAPTER_2903_REFRESH_RECEIPT_PATH, "utf8"));
    expect(validateOhioChapter2903RefreshReceipt(receipt, new Date(receipt.checkedAt))).toBeNull();
    for (const section of ["2907.01", "4501.01", "2941.1425", "2941.1426", "2929.01"]) {
      const missing = structuredClone(receipt);
      missing.documents = missing.documents.filter((row: { section: string }) => row.section !== section);
      expect(validateOhioChapter2903RefreshReceipt(missing, new Date(receipt.checkedAt))).not.toBeNull();
    }
  });

  it("preserves critical limitations in each Ohio-only language summary", () => {
    const conditions: Record<string, string[]> = {
      en: ["not six months", "bars any other additional prison term", "both sexual-motivation", "same act", "up to $15,000", "not fixed fines"],
      es: ["no seis meses", "impide cualquier otra pena de prisión adicional", "ambas especificaciones", "mismo acto", "hasta $15,000", "no importes fijos"],
      zh: ["不是六个月", "禁止对同一罪行再判任何其他额外监禁", "两项附加指控", "同一行为", "罚金上限", "并非固定罚款"],
    };
    const exception: Record<string, string[]> = {
      en: ["non-body instrument or object", "unless the offender knew at the time", "offender's bodily fluid"],
      es: ["no sea parte del cuerpo", "salvo que el autor supiera en ese momento", "su propio fluido corporal"],
      zh: ["非身体组成部分", "除非行为人当时知道", "其本人的体液"],
    };
    for (const jurisdiction of ["OH", "Ohio", " ohio "]) {
      for (const [language, phrases] of Object.entries(conditions)) {
        const explanation = getChargeExplanation(charge.name, jurisdiction, language, charge.id)!;
        expect(explanation.slug).toBe("ohio-felonious-assault");
        for (const phrase of phrases) expect(explanation.degreeContext).toContain(phrase);
        for (const phrase of exception[language]) expect(explanation.plainSummary).toContain(phrase);
        if (language !== "en") expect(explanation.translationDraft).toBe(true);
      }
    }
    expect(getChargeExplanation(charge.name, "CA")?.slug).not.toBe("ohio-felonious-assault");
    expect(getChargeExplanation(charge.name)?.slug).not.toBe("ohio-felonious-assault");
    expect(getChargeExplanation(charge.name, "OH")?.degreeContext).toBe(charge.maxPenalty);
  });

  it("does not silently remap weapon/peace-officer legacy cases, including after expiry", () => {
    for (const id of ["oh-assault-with-deadly-weapon", "oh-assault-on-peace-officer"]) {
      expect(getChargeById(id)).toBeUndefined();
      expect(resolveGuidanceCharge({ id, name: "Assault", code: "2903.11", classification: "felony" }, "OH")).toBeUndefined();
      for (const now of [new Date(), new Date(Date.now() + 8 * 86400000)]) {
        const manifest = loadOhioAuthorityManifest(undefined, now);
        expect(manifest.catalogRecords.find(row => row.chargeId === id)).toMatchObject({
          disposition: "require_exact_reselection", provisions: [],
        });
        expect(buildOhioSourceDatabaseSeed(manifest, now).selectableChargeIds).not.toContain(id);
      }
    }
  });
});