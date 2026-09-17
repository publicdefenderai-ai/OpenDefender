import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { OHIO_AGGRAVATED_ASSAULT_CHARGE as charge } from "../shared/ohio-aggravated-assault";
import { OHIO_AGGRAVATED_ASSAULT_SOURCE as source } from "../server/data/ohio-assault-source";
import { getChargeExplanation } from "../shared/charge-explanations";
import { getChargeById, classifyChargesForGuidance } from "../shared/criminal-charges";
import { resolveGuidanceCharge } from "../shared/guidance-charge-resolution";
import { ohioChapter2903Evidence } from "../server/data/ohio-chapter-2903-source";
import { buildOhioChapter2903PilotManifestRecords, buildOhioSourceDatabaseSeed, validateOhioManifestRecord } from "../server/data/ohio-source-database-seed";
import { loadOhioAuthorityManifest } from "../server/data/ohio-manifest-loader";
import { OHIO_CHAPTER_2903_REFRESH_RECEIPT_PATH, validateOhioChapter2903RefreshReceipt } from "../server/data/ohio-chapter-2903-refresh";

describe("source-first Ohio aggravated assault", () => {
  it("preserves the provocation condition and both conduct/grade branches", () => {
    const quotes = source.offense.quotedSpans.map(span => span.quote).join("\n");
    expect(quotes).toContain("serious provocation occasioned by the victim");
    expect(quotes).toContain("shall knowingly");
    expect(quotes).toContain("Cause serious physical harm");
    expect(quotes).toContain("Cause or attempt to cause physical harm");
    expect(quotes).toContain("felony of the fourth degree");
    expect(quotes).toContain("felony of the third degree");
    expect(getChargeById(charge.id)?.code).toBe("2903.12");
    expect(classifyChargesForGuidance([charge.id])).toEqual([
      expect.objectContaining({ id: charge.id, verifiedCitation: "Ohio Rev. Code Ann. § 2903.12" }),
    ]);
  });

  it("does not describe six months as an extra pregnancy enhancement or omit the protected-victim override", () => {
    const penalty = source.additionalPenalties!.find(document => document.subdivision === "(B)(8)")!;
    expect(penalty.text).toContain("either a definite prison term of six months or");
    expect(penalty.quotedSpans.some(span => span.quote.includes("knew was pregnant"))).toBe(true);
    expect(source.offense.text).toContain("except as otherwise provided in this division");
    expect(charge.maxPenalty).toContain("subject to the section's protected-victim rule");
    expect(charge.maxPenalty).not.toContain("additional six");
    const specification = source.additionalPenalties!.find(document => document.section === "2941.1423")!;
    expect(specification.quotedSpans.some(span => span.quote.includes("indictment"))).toBe(true);
  });

  it("includes pregnancy exceptions, harm/weapons definitions and adopted investigator definitions", () => {
    const evidence = ohioChapter2903Evidence(source);
    for (const section of ["2903.09", "2901.01", "2901.22", "2923.11", "2935.01", "109.541", "109.54", "2935.081"]) {
      expect(evidence.find(row => row.document.section === section)?.supportRole).toBe("offense");
    }
    const investigator = evidence.find(row => row.document.section === "2903.11")!;
    expect(investigator.document.subdivision).toBe("(E)(5)");
    expect(investigator.document.quotedSpans.some(span => span.quote.includes("commissioned"))).toBe(true);
    expect(source.offense.section).toBe("2903.12");
    const oathException = evidence.find(row => row.document.section === "2935.081")!;
    expect(oathException.document.quotedSpans.some(span => span.quote.startsWith("(A) As used in this section"))).toBe(true);
  });

  it("rejects missing or misclassified dependencies and missing current-source checks", () => {
    const record = buildOhioChapter2903PilotManifestRecords(new Date()).find(row => row.chargeId === charge.id)!;
    expect(validateOhioManifestRecord(record)).toBeNull();
    for (let index = 0; index < record.provisions.length; index++) {
      const missing = structuredClone(record);
      missing.provisions.splice(index, 1);
      expect(validateOhioManifestRecord(missing)).not.toBeNull();
      const changed = structuredClone(record);
      changed.provisions[index].supportRole = changed.provisions[index].supportRole === "penalty" ? "offense" : "penalty";
      expect(validateOhioManifestRecord(changed)).not.toBeNull();
    }
    const receipt = JSON.parse(readFileSync(OHIO_CHAPTER_2903_REFRESH_RECEIPT_PATH, "utf8"));
    expect(validateOhioChapter2903RefreshReceipt(receipt, new Date(receipt.checkedAt))).toBeNull();
    for (const section of ["2903.12", "2903.11", "109.54", "2935.081", "2941.1423"]) {
      const missing = structuredClone(receipt);
      missing.documents = missing.documents.filter((row: { section: string }) => row.section !== section);
      expect(validateOhioChapter2903RefreshReceipt(missing, new Date(receipt.checkedAt))).not.toBeNull();
    }
  });

  it("uses Ohio-only explanations in all three languages for postal codes and state names", () => {
    for (const [language, alternative, notAdditive] of [
      ["en", "either six months or", "does not add six months"],
      ["es", "seis meses o una pena", "no añade seis meses"],
      ["zh", "六个月或", "不是在原刑期上另加六个月"],
    ]) {
      const summary = getChargeExplanation(charge.name, "OH", language, charge.id)!.degreeContext!;
      expect(summary).toContain(alternative);
      expect(summary).toContain(notAdditive);
    }
    for (const jurisdiction of ["OH", "Ohio", " ohio "]) {
      const en = getChargeExplanation(charge.name, jurisdiction, "en", charge.id)!;
      expect(en.slug).toBe("ohio-aggravated-assault");
      for (const language of ["es", "zh"]) {
        const localized = getChargeExplanation(charge.name, jurisdiction, language, charge.id)!;
        expect(localized.slug).toBe(en.slug);
        expect(localized.plainSummary).not.toBe(en.plainSummary);
        expect(localized.degreeContext).not.toBe(en.degreeContext);
        expect(localized.translationDraft).toBe(true);
      }
    }
    expect(getChargeExplanation(charge.name, "CA")?.slug).not.toBe("ohio-aggravated-assault");
    expect(getChargeExplanation(charge.name)?.slug).not.toBe("ohio-aggravated-assault");
  });

  it("keeps the retired ID unavailable even when new-source approval expires", () => {
    const id = "oh-aggravated-assault";
    expect(getChargeById(id)).toBeUndefined();
    expect(resolveGuidanceCharge({ id, name: "Aggravated Assault", code: "2903.12", classification: "felony" }, "OH")).toBeUndefined();
    for (const now of [new Date(), new Date(Date.now() + 8 * 86400000)]) {
      const manifest = loadOhioAuthorityManifest(undefined, now);
      expect(manifest.catalogRecords.find(row => row.chargeId === id)).toMatchObject({
        disposition: "require_exact_reselection", provisions: [],
      });
      expect(buildOhioSourceDatabaseSeed(manifest, now).selectableChargeIds).not.toContain(id);
    }
  });
});