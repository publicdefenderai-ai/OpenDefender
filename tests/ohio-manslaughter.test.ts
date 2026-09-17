import { describe, expect, it } from "vitest";
import { getChargeExplanation } from "../shared/charge-explanations";
import { OHIO_MANSLAUGHTER_CHARGES } from "../shared/ohio-manslaughter-catalog";
import { OHIO_MANSLAUGHTER_SOURCE_RECORDS } from "../server/data/ohio-manslaughter-source";
import { buildOhioChapter2903PilotManifestRecords, buildOhioSourceDatabaseSeed, validateOhioManifestRecord } from "../server/data/ohio-source-database-seed";
import { loadOhioAuthorityManifest } from "../server/data/ohio-manifest-loader";
import { resolveGuidanceCharge } from "../shared/guidance-charge-resolution";
import { getChargeById, classifyChargesForGuidance } from "../shared/criminal-charges";
import { ohioChapter2903Evidence } from "../server/data/ohio-chapter-2903-source";
import { validateOhioChapter2903RefreshReceipt, OHIO_CHAPTER_2903_REFRESH_RECEIPT_PATH } from "../server/data/ohio-chapter-2903-refresh";
import { readFileSync } from "node:fs";

describe("source-first Ohio manslaughter", () => {
  it.each(OHIO_MANSLAUGHTER_CHARGES)("resolves $name without substituting the generic explanation", charge => {
    expect(getChargeById(charge.id)?.name).toBe(charge.name);
    expect(classifyChargesForGuidance([charge.id])).toEqual([
      expect.objectContaining({ id: charge.id, name: charge.name, verifiedCitation: charge.statuteCitations![0] }),
    ]);
    const slug = charge.code === "2903.03" ? "ohio-voluntary-manslaughter" : "ohio-involuntary-manslaughter";
    for (const jurisdiction of ["OH", "Ohio", " ohio "]) {
      const english = getChargeExplanation(charge.name, jurisdiction, "en", charge.id);
      expect(english?.slug).toBe(slug);
      for (const language of ["es", "zh"]) {
        const translated = getChargeExplanation(charge.name, jurisdiction, language, charge.id);
        expect(translated?.slug).toBe(slug);
        expect(translated?.plainSummary).not.toBe(english?.plainSummary);
        expect(translated?.degreeContext).not.toBe(english?.degreeContext);
        expect(translated?.translationDraft).toBe(true);
      }
    }
    expect(getChargeExplanation(charge.name, "CA")?.slug).toBe("manslaughter");
    expect(getChargeExplanation(charge.name)?.slug).toBe("manslaughter");
  });

  it("does not confuse sexual motivation with a qualifying predator specification", () => {
    const voluntary = OHIO_MANSLAUGHTER_SOURCE_RECORDS[0];
    const involuntary = OHIO_MANSLAUGHTER_SOURCE_RECORDS[1];
    const definition = voluntary.additionalEvidence!.find(document => document.section === "2971.01")!;
    const qualifyingClause = definition.quotedSpans.find(span =>
      span.quote.startsWith("(1) A violation of section 2903.01"))!.quote;
    expect(qualifyingClause).toContain("division (A) of section 2903.04");
    expect(qualifyingClause).not.toContain("2903.03");
    expect(voluntary.offense.quotedSpans.some(span => span.quote.startsWith("(B) No person, with a sexual motivation"))).toBe(true);
    expect(involuntary.additionalPenalties!.some(document => document.section === "2971.03")).toBe(true);
    expect(involuntary.additionalPenalties!.some(document => document.section === "2941.147")).toBe(true);
    expect(involuntary.additionalPenalties!.some(document => document.section === "2941.148")).toBe(true);
    expect(OHIO_MANSLAUGHTER_CHARGES[1].maxPenalty).toContain("life sentences");
    expect(ohioChapter2903Evidence(voluntary).find(item =>
      item.document.section === "2971.01")?.supportRole).toBe("offense");
    expect(ohioChapter2903Evidence(involuntary).find(item =>
      item.document.section === "2971.01")?.supportRole).toBe("penalty");
  });

  it("preserves both involuntary conduct/grade paths, exclusions and mandatory consequences", () => {
    const source = OHIO_MANSLAUGHTER_SOURCE_RECORDS[1];
    expect(source.offense.text).toContain("Violation of division (A) of this section is a felony of the first degree");
    expect(source.offense.text).toContain("Violation of division (B) of this section is a felony of the third degree");
    expect(source.offense.quotedSpans.some(span => span.quote.includes("Title XLV"))).toBe(true);
    expect(source.offense.quotedSpans.some(span => span.quote.includes("mandatory prison term"))).toBe(true);
    const suspension = source.additionalPenalties!.find(document => document.section === "4510.02")!;
    expect(suspension.subdivision).toBe("(A)(1)");
    expect(suspension.quotedSpans.some(span => span.quote.includes("life of the person"))).toBe(true);
    expect(source.additionalPenalties!.find(document => document.section === "2929.13")?.text)
      .toContain("Any offense that is a third degree felony");
  });

  it("pins maximum-term and mandatory-prison dependencies separately from base minimum terms", () => {
    for (const source of OHIO_MANSLAUGHTER_SOURCE_RECORDS) {
      const provisions = ohioChapter2903Evidence(source);
      expect(provisions.find(item => item.document.section === "2929.144")?.supportRole).toBe("penalty");
      expect(provisions.find(item => item.document.section === "2929.13")?.supportRole).toBe("penalty");
      expect(provisions.some(item => item.document.section === "2903.09")).toBe(true);
      const record = buildOhioChapter2903PilotManifestRecords(new Date()).find(row => row.chargeId === source.chargeId)!;
      expect(validateOhioManifestRecord(record)).toBeNull();
      for (let index = 0; index < record.provisions.length; index++) {
        const missing = structuredClone(record);
        missing.provisions.splice(index, 1);
        expect(validateOhioManifestRecord(missing)).not.toBeNull();
      }
    }
  });

  it("retires old selections without deleting audit rows or restoring them when freshness expires", () => {
    for (const id of ["oh-voluntary-manslaughter", "oh-involuntary-manslaughter"]) {
      expect(getChargeById(id)).toBeUndefined();
      expect(resolveGuidanceCharge({ id, name: "Manslaughter", code: id.includes("involuntary") ? "2903.04" : "2903.03",
        classification: "felony" }, "OH")).toBeUndefined();
      for (const now of [new Date(), new Date(Date.now() + 8 * 86400000)]) {
        const manifest = loadOhioAuthorityManifest(undefined, now);
        expect(manifest.catalogRecords.find(record => record.chargeId === id)).toMatchObject({
          disposition: "require_exact_reselection", provisions: [],
        });
        expect(buildOhioSourceDatabaseSeed(manifest, now).selectableChargeIds).not.toContain(id);
      }
    }
  });

  it("requires new maximum-term and special-sentencing sources in the live receipt", () => {
    const receipt = JSON.parse(readFileSync(OHIO_CHAPTER_2903_REFRESH_RECEIPT_PATH, "utf8"));
    const now = new Date(receipt.checkedAt);
    expect(validateOhioChapter2903RefreshReceipt(receipt, now)).toBeNull();
    for (const section of ["2929.144", "2929.13", "2971.03", "2941.147", "2941.148", "4510.02", "4511.19"]) {
      const missing = structuredClone(receipt);
      missing.documents = missing.documents.filter((document: { section: string }) => document.section !== section);
      expect(validateOhioChapter2903RefreshReceipt(missing, now)).not.toBeNull();
    }
  });
});