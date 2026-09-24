import { ohioEvidenceTestTime } from "./helpers/ohio-evidence-time";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { OHIO_PATIENT_CARE_BATCH as batch, OHIO_PATIENT_CARE_DEFINITIONS as definitions } from "../shared/ohio-patient-care";
import { projectEvidenceBackedChargeBatch } from "../shared/evidence-backed-charge-batch";
import { OHIO_PATIENT_CARE_SOURCES as sources } from "../server/data/ohio-patient-care-source";
import { ohioChapter2903Evidence } from "../server/data/ohio-chapter-2903-source";
import { buildOhioChapter2903PilotManifestRecords, validateOhioManifestRecord, buildOhioSourceDatabaseSeed, hasOhioOperativeNameEvidence } from "../server/data/ohio-source-database-seed";
import { loadOhioAuthorityManifest } from "../server/data/ohio-manifest-loader";
import { OHIO_CHAPTER_2903_REFRESH_RECEIPT_PATH, validateOhioChapter2903RefreshReceipt } from "../server/data/ohio-chapter-2903-refresh";
import { classifyChargesForGuidance, getChargeById, CHARGE_ID_ALIASES } from "../shared/criminal-charges";
import { getChargeExplanation } from "../shared/charge-explanations";

describe("single-declaration, evidence-backed charge projection", () => {
  it("produces every view from the same four definitions without mutating them", () => {
    const before = JSON.stringify(definitions);
    expect(projectEvidenceBackedChargeBatch(definitions)).toEqual(batch);
    expect(JSON.stringify(definitions)).toBe(before);
    expect(batch.charges).toHaveLength(4);
    expect(Object.keys(batch.translations)).toHaveLength(4);
  });
  it("is jurisdiction-independent and treats names as literal matches, not regex", () => {
    const row = structuredClone(definitions[0]);
    Object.assign(row, { id: "fixture-charge", jurisdiction: "TEST", slug: "fixture", name: "Offense (A) + B" });
    const result = projectEvidenceBackedChargeBatch([row]);
    expect(result.charges[0].jurisdiction).toBe("TEST");
    expect(result.explanations[0].sources!.every(source => source.jurisdiction === "TEST")).toBe(true);
    expect(result.explanations[0].chargePattern.test(row.name)).toBe(true);
    expect(result.explanations[0].chargePattern.test("Offense A  B")).toBe(false);
  });
  it("rejects duplicate IDs/slugs, missing languages and missing citations", () => {
    expect(() => projectEvidenceBackedChargeBatch([definitions[0], definitions[0]])).toThrow();
    for (const mutate of [
      (row: typeof definitions[number]) => { row.text.zh.plainSummary = ""; },
      (row: typeof definitions[number]) => { row.text.es.degreeContext = ""; },
      (row: typeof definitions[number]) => { row.citations = []; },
      (row: typeof definitions[number]) => { row.verifiedMonth = "2026-13"; },
    ]) {
      const row = structuredClone(definitions[0]);
      mutate(row);
      expect(() => projectEvidenceBackedChargeBatch([row])).toThrow();
    }
  });
});

describe("Ohio patient-care authority", () => {
  it.each(definitions)("keeps the exact statutory identity and subdivision for $name", row => {
    const source = sources.find(source => source.chargeId === row.id)!;
    expect(getChargeById(row.id)?.name).toBe(row.name);
    expect(source.canonicalTitle).toBe(row.name);
    expect(source.offense.subdivision).toBe(row.subdivision);
    expect(classifyChargesForGuidance([row.id])).toEqual([
      expect.objectContaining({ id: row.id, verifiedCitation: row.citations[0].citation }),
    ]);
    expect(Object.values(CHARGE_ID_ALIASES)).not.toContain(row.id);
    const record = buildOhioChapter2903PilotManifestRecords(new Date()).find(record => record.chargeId === row.id)!;
    expect(validateOhioManifestRecord(record)).toBeNull();
    expect(record.provisions[0].officialTitle).toBe(source.offense.title);
    expect(record.mapping?.candidateEvidence[0].sectionIdentity.subdivision).toBe(row.subdivision);
  });
  it("uses explicit guilt clauses, not the shared heading or a guessed synonym, for the three offenses", () => {
    for (const source of sources.slice(0, 3)) {
      expect(source.offense.title).toBe("Patient abuse or neglect");
      expect(hasOhioOperativeNameEvidence(source)).toBe(true);
      expect(hasOhioOperativeNameEvidence({ ...source, nameBasis: undefined })).toBe(false);
      expect(hasOhioOperativeNameEvidence({ ...source, canonicalTitle: "Patient mistreatment" })).toBe(false);
      expect(hasOhioOperativeNameEvidence({ ...source, offense: { ...source.offense, subdivision: "(A)(9)" } })).toBe(false);
      const noGrade = { ...source, offense: { ...source.offense,
        quotedSpans: source.offense.quotedSpans.filter(span => span.kind !== "grading") } };
      expect(hasOhioOperativeNameEvidence(noGrade)).toBe(false);
    }
    const seed = buildOhioSourceDatabaseSeed(loadOhioAuthorityManifest(undefined, ohioEvidenceTestTime), ohioEvidenceTestTime);
    const keys = sources.slice(0, 3).map(source =>
      seed.links.find(link => link.chargeId === source.chargeId && link.supportRole === "offense")?.snapshotKey);
    expect(keys.every(Boolean)).toBe(true);
    expect(new Set(keys).size).toBe(3);
  });
  it.each(definitions)("rejects missing, changed or wrong-role supporting evidence for $name", row => {
    const record = buildOhioChapter2903PilotManifestRecords(new Date()).find(record => record.chargeId === row.id)!;
    for (let index = 0; index < record.provisions.length; index++) {
      const missing = structuredClone(record);
      missing.provisions.splice(index, 1);
      expect(validateOhioManifestRecord(missing)).not.toBeNull();
      const wrongRole = structuredClone(record);
      wrongRole.provisions[index].supportRole = wrongRole.provisions[index].supportRole === "offense" ? "penalty" : "offense";
      expect(validateOhioManifestRecord(wrongRole)).not.toBeNull();
    }
    const changed = structuredClone(record);
    changed.provisions[0].content += "\nAltered";
    expect(validateOhioManifestRecord(changed)).not.toBeNull();
    const wrongMapping = structuredClone(record);
    wrongMapping.mapping!.candidateCitations = ["Ohio Rev. Code Ann. § 2903.13"];
    expect(validateOhioManifestRecord(wrongMapping)).not.toBeNull();
  });
  it("retains complete care-facility definitions, exclusions and each applicable sentencing degree", () => {
    for (const source of sources) {
      const evidence = ohioChapter2903Evidence(source);
      for (const section of ["2903.33", "3721.10", "5123.19", "5119.14", "5123.03", "5119.34", "3701.01", "3721.01", "2901.01", "2901.22"]) {
        expect(evidence.some(item => item.document.section === section && item.supportRole === "offense")).toBe(true);
      }
      const exclusions = evidence.find(item => item.document.section === "5123.19")!.document;
      expect(exclusions.quotedSpans.some(span => span.quote.includes('"Residential facility" does not mean') &&
        span.quote.includes("pediatric transition care program"))).toBe(true);
      const residential = evidence.find(item => item.document.section === "5119.34")!.document;
      expect(residential.quotedSpans.some(span =>
        span.quote.includes('A "residential facility" is') &&
        span.quote.includes('"Residential facility" does not include'))).toBe(true);
    }
    expect(sources[0].additionalPenalties!.some(doc => doc.section === "2929.14" && doc.subdivision === "(A)(3)(b)")).toBe(true);
    for (const source of sources.slice(1, 3)) {
      expect(source.additionalPenalties!.some(doc => doc.section === "2929.14" && doc.subdivision === "(A)(5)")).toBe(true);
    }
    expect(sources[3].additionalPenalties).toEqual([]);
  });
  it("requires every new source in the existing freshness gate", () => {
    const receipt = JSON.parse(readFileSync(OHIO_CHAPTER_2903_REFRESH_RECEIPT_PATH, "utf8"));
    expect(validateOhioChapter2903RefreshReceipt(receipt, new Date(receipt.checkedAt))).toBeNull();
    for (const section of ["2903.33", "2903.34", "2903.35", "3721.10", "5123.19", "5119.14", "5123.03", "5119.34", "3701.01", "3721.01"]) {
      const missing = structuredClone(receipt);
      missing.documents = missing.documents.filter((doc: { section: string }) => doc.section !== section);
      expect(validateOhioChapter2903RefreshReceipt(missing, new Date(receipt.checkedAt))).not.toBeNull();
    }
    expect(validateOhioChapter2903RefreshReceipt(receipt, new Date(receipt.expiresAt))).not.toBeNull();
  });
  it.each(definitions)("provides consistent Ohio-only EN/ES/ZH explanations for $name", row => {
    for (const language of ["en", "es", "zh"] as const) {
      const explanation = getChargeExplanation(row.name, "OH", language, row.id)!;
      expect(explanation.plainSummary).toBe(row.text[language].plainSummary);
      expect(explanation.degreeContext).toBe(row.text[language].degreeContext);
      if (language !== "en") expect(explanation.translationDraft).toBe(true);
    }
    expect(getChargeExplanation(row.name, "CA")?.slug ?? "").not.toBe(row.slug);
    expect(getChargeExplanation(row.name)?.slug ?? "").not.toBe(row.slug);
  });
  it("distinguishes harm, fault, defense scope and repeat-conviction branches in all languages", () => {
    for (const [language, knowing, reckless, harmOnly, supervisor, purpose] of [
      ["en", "knowingly", "recklessly", "Physical harm alone", "affirmative defense", "purpose of incriminating"],
      ["es", "a sabiendas", "temerariamente", "El daño físico por sí solo", "defensa afirmativa", "propósito de incriminar"],
      ["zh", "明知", "轻率", "仅有身体伤害", "积极抗辩", "目的"],
    ] as const) {
      expect(definitions[0].text[language].plainSummary).toContain(knowing);
      expect(definitions[0].text[language].plainSummary).toContain(reckless);
      expect(definitions[1].text[language].plainSummary).toContain(knowing);
      expect(definitions[2].text[language].plainSummary).toContain(harmOnly);
      expect(definitions[2].text[language].plainSummary).toContain(supervisor);
      expect(definitions[3].text[language].plainSummary).toContain(purpose);
      expect(definitions[0].text[language].degreeContext).toContain("F3");
      expect(definitions[1].text[language].degreeContext).toContain("F5");
      expect(definitions[2].text[language].degreeContext).toContain("F5");
      expect(definitions[3].text[language].degreeContext).not.toContain("F5");
    }
  });
});