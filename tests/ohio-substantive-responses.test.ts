import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { applyOhioReviewResponses, type SubstantiveResponseLedger } from "../scripts/data-review/batch/substantive-responses";
import { compileOhioSubstantiveReview, type SubstantiveFinding } from "../scripts/data-review/batch/substantive-review";
import { textHash, type BatchDocument } from "../scripts/data-review/batch/source-batch";

const read = (name: string) => JSON.parse(readFileSync(`scripts/data-review/output/${name}`, "utf8"));
const baseline = read("ohio-substantive-findings.json") as SubstantiveFinding[];
const ledger = read("ohio-substantive-review-decisions.json") as SubstantiveResponseLedger;
const documents: Record<string, BatchDocument> = {
  ...read("ohio-batch-source-cache.json").documents,
  ...read("ohio-substantive-supplemental-evidence.json").documents,
  ...read("ohio-substantive-review-authorities.json").documents,
};
// Freeze at import time, rather than making checked-in evidence tests age out.
const now = new Date(ledger.submission.importedAt);
const compile = (responses = ledger, docs = documents) => compileOhioSubstantiveReview({
  findings: applyOhioReviewResponses(baseline, docs, responses), documents: docs,
  requiredSections: baseline.map(finding => finding.section), targets: [],
  existingSourceFirst: [], now,
});

describe("recorded Ohio responses", () => {
  it("closes exactly three questions while preserving baseline, raw notes and publication holds", () => {
    const originalHash = textHash(JSON.stringify(baseline));
    const report = compile();
    expect(report.summary.resolvedLegalQuestions).toBe(3);
    expect(report.manualQuestions).toEqual([]);
    expect(report.focusedReviewComplete).toBe(true);
    expect(textHash(JSON.stringify(baseline))).toBe(originalHash);
    expect(report.resolvedReviews.map(review => [review.decision, review.note]))
      .toEqual(ledger.decisions.map(entry => [entry.decision, entry.note]));
    expect(report.drafts.every(draft => draft.runtimePublication === "not_approved")).toBe(true);
    expect(textHash(readFileSync(ledger.submission.filePath, "utf8"))).toBe(ledger.submission.contentHash);
  });
  it("uses F4 for reckless neglect without changing the knowing branch or literal M2 evidence", () => {
    const row = compile().rows.find(row => row.section === "2903.16")!;
    expect(row.candidates[1].grading).toContain("F4");
    expect(row.candidates[1].grading).toContain("M2 is not an available outcome");
    expect(row.candidates[0]).toEqual(baseline.find(row => row.section === "2903.16")!.candidates[0]);
    expect(documents["2903.16"].text).toContain("misdemeanor of the second degree");
  });
  it("binds administrative authority and keeps the HMO interpretation within statutory conditions", () => {
    const report = compile();
    const row = report.rows.find(row => row.section === "2903.13")!;
    expect(row.relatedSections).toContain("OAC:3701-12-01");
    expect(row.resolution).toContain("do not treat every HMO employee as a hospital employee");
    expect(row.resolution).toContain("recorded reviewer's legal interpretation");
    expect(row.evidence.some(quote => quote.section === "OAC:3701-12-01" && quote.text.startsWith('(M)'))).toBe(true);
  });
  it("records the conspiracy correction without rewriting publisher text or copying predicate grades", () => {
    const row = compile().rows.find(row => row.section === "2923.01")!;
    expect(row.candidates[0].conduct).toContain("use §2913.421");
    expect(row.candidates[0].grading).toContain("do not substitute the predicate's grade directly");
    expect(documents["2923.01"].text).toContain("section 2923.421");
  });
  it("keeps unanswered questions pending and rejects duplicates and changed baseline interpretations", () => {
    const partial = compile({ ...ledger, decisions: ledger.decisions.slice(0, 2) });
    expect(partial.manualQuestions).toHaveLength(1);
    expect(partial.focusedReviewComplete).toBe(false);
    expect(() => compile({ ...ledger, decisions: [...ledger.decisions, ledger.decisions[0]] })).toThrow(/Duplicate review/);
    const changed = structuredClone(baseline);
    changed.find(row => row.section === "2903.13")!.resolution += " Changed.";
    expect(() => applyOhioReviewResponses(changed, documents, ledger)).toThrow(/no longer matches/);
  });
  it("invalidates changed or stale supporting authority instead of silently retaining a resolution", () => {
    const rule = documents["OAC:3701-12-01"];
    const text = rule.text + " Changed definition.";
    expect(() => compile(ledger, { ...documents, [rule.section]: { ...rule, text, contentHash: textHash(text) } }))
      .toThrow(/Reviewed authority changed/);
    const retrievedAt = new Date(now.getTime() - 8 * 24 * 60 * 60_000).toISOString();
    expect(() => compile(ledger, { ...documents, [rule.section]: { ...rule, retrievedAt } })).toThrow(/stale/);
  });
  it("rejects invented offense identities, removed dependencies and missing authority pins", () => {
    const changed = structuredClone(ledger);
    changed.decisions[0].candidates[0].name = "invented";
    expect(() => compile(changed)).toThrow(/identities/);
    const missing = structuredClone(ledger);
    missing.decisions[0].relatedSections = [];
    expect(() => compile(missing)).toThrow(/drop evidence/);
    const unbound = structuredClone(ledger);
    delete unbound.decisions[0].reviewedSourceHashes["OAC:3701-12-01"];
    expect(() => compile(unbound)).toThrow(/Reviewed authority changed/);
  });
});