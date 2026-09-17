import { describe, expect, it } from "vitest";
import { compileOhioSubstantiveReview, type SubstantiveFinding } from "../scripts/data-review/batch/substantive-review";
import { extractOffenseUnits } from "../scripts/data-review/batch/ohio-review-report";
import { textHash, type BatchDocument } from "../scripts/data-review/batch/source-batch";

const now = new Date("2026-09-17T22:00:00Z");
const doc = (text: string, section = "2903.16"): BatchDocument => ({
  section, title: "Example", text, contentHash: textHash(text),
  sourceUrl: `https://codes.ohio.gov/ohio-revised-code/section-${section}`,
  retrievedAt: "2026-09-17T20:00:00Z", effectiveDateStart: "2026-03-20",
});
const source = doc("(A) No person shall do the prohibited act.\n(B) Whoever violates this section is guilty of example, a misdemeanor of the first degree.");
const finding = (): SubstantiveFinding => ({
  section: source.section, sourceHash: source.contentHash, classification: "routine_offense",
  resolution: "The conduct and M1 grade are explicit.", question: null, relatedSections: [],
  candidates: [{ name: "example", conduct: "(A)", grading: "(B): M1.", evidenceQuotes: [source.text] }],
});
function run(rows = [finding()], documents = { [source.section]: source }, required = [source.section]) {
  return compileOhioSubstantiveReview({
    findings: rows, documents, requiredSections: required, targets: [],
    existingSourceFirst: [], now,
  });
}

describe("substantive review boundaries", () => {
  it("prepares a draft without changing runtime approval", () => {
    const result = run();
    expect(result.readyForFocusedManualReview).toBe(true);
    expect(result.summary.runtimeChargesAdded).toBe(0);
    expect(result.drafts[0].runtimePublication).toBe("not_approved");
    expect(result.manualQuestions).toEqual([]);
  });
  it("rejects missing coverage, duplicate findings and changed primary text", () => {
    expect(() => run([], undefined, [source.section])).toThrow(/coverage/);
    expect(() => run([finding(), finding()])).toThrow(/Duplicate/);
    expect(() => run([{ ...finding(), sourceHash: "wrong" }])).toThrow(/source changed/);
  });
  it("rejects stale sources and inexact quotations", () => {
    expect(() => run(undefined, { [source.section]: { ...source, retrievedAt: "2026-08-01T00:00:00Z" } })).toThrow(/stale/);
    const row = finding();
    row.candidates[0].evidenceQuotes = ["Whoever violates ... is guilty"];
    expect(() => run([row])).toThrow(/no exact/);
  });
  it("attributes a penalty quotation to its actual source and invalidates changed related text", () => {
    const penalty = doc("(A) The penalty is a misdemeanor of the first degree.", "2903.99");
    const row = { ...finding(), relatedSections: [penalty.section], relatedSourceHashes: { [penalty.section]: penalty.contentHash } };
    row.candidates[0].evidenceQuotes.push(penalty.text);
    const result = run([row], { [source.section]: source, [penalty.section]: penalty });
    const evidence = result.drafts[0].reviewedEvidence as Array<{ section: string }>;
    expect(evidence[1].section).toBe(penalty.section);
    expect(() => run([row], { [source.section]: source, [penalty.section]: doc(penalty.text + "\nAdditional exception.", penalty.section) })).toThrow(/Related review source changed/);
  });
  it("keeps technical gaps out of attorney work and blocks handoff readiness", () => {
    const result = run([{ ...finding(), classification: "technical_gap", relatedSections: ["2903.99"] }]);
    expect(result.readyForFocusedManualReview).toBe(false);
    expect(result.technicalWork).toHaveLength(1);
    expect(result.manualQuestions).toEqual([]);
  });
  it("requires a specific question rather than generic scope confirmation", () => {
    expect(() => run([{ ...finding(), classification: "specific_legal_question", question: "Confirm the scope." }])).toThrow(/specific unresolved/);
    const result = run([{ ...finding(), classification: "specific_legal_question", question: "Does the stated harm element necessarily trigger the separately recited felony enhancement?" }]);
    expect(result.manualQuestions).toHaveLength(1);
    expect(result.drafts[0].status).toBe("draft_with_specific_legal_hold");
  });
});

describe("literal Ohio offense names", () => {
  it("keeps internal commas, abbreviations and multiple guilt clauses", () => {
    const units = extractOffenseUnits(doc("Whoever violates division (A) of this section is guilty of possession of L.S.D. Whoever violates division (B) of this section is guilty of unauthorized use of computer, cable, or telecommunication property, a felony of the fifth degree."));
    expect(units.map(unit => unit.name)).toEqual(["possession of L.S.D.", "unauthorized use of computer, cable, or telecommunication property"]);
  });
  it("rejects introductory, grade, specification and conditional fragments", () => {
    const text = [
      "Whoever violates this section is guilty of one of the following:",
      "Whoever violates this section is guilty of a minor misdemeanor.",
      "Whoever violates this section is guilty of a specification of the type described in division (A).",
      "The offender is guilty of conspiring with that other person.",
      "A person is guilty of only one conspiracy.",
      "If the offender is guilty of nonsupport of dependents by reason of failing to provide support, the court shall assess costs.",
      "Whoever violates this section is guilty of conspiracy, which is one of the following:",
    ].join("\n");
    expect(extractOffenseUnits(doc(text)).map(unit => unit.name)).toEqual(["conspiracy"]);
  });
});