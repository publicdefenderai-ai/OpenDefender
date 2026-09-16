import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  accountingCsv,
  buildOhioChapter2903Accounting,
} from "../scripts/data-review/ohio-discovery/account-chapter-2903";

const discovery = JSON.parse(readFileSync(
  "scripts/data-review/output/ohio-chapter-2903-discovery.json",
  "utf8",
));

describe("Ohio Chapter 2903 source-first accounting", () => {
  it("accounts for every discovered section without publishing charges", () => {
    const report = buildOhioChapter2903Accounting(discovery);

    expect(report.rows).toHaveLength(40);
    expect(report.accounting).toMatchObject({
      enumeratedSectionCount: 40,
      offenseCandidateSectionCount: 23,
      supportingProvisionCount: 15,
      needsLegalInterpretationCount: 2,
      publishedOffenseCount: 0,
      namingReviewCount: 0,
    });
    expect(report.rows.every((row) =>
      row.exactTitle.length > 0 &&
      row.titleEvidence === `Section ${row.sectionId} | ${row.exactTitle}.` &&
      row.evidenceSourceHash.length === 64 &&
      row.operativeEvidence.length > 0,
    )).toBe(true);
    expect(report.rows.filter((row) => row.disposition !== "supporting_provision")
      .every((row) => row.gradingEvidence && /punished as provided|felony|misdemeanor/i.test(row.gradingEvidence))).toBe(true);
    expect(report.rows.filter((row) => row.disposition === "needs_legal_interpretation")
      .map((row) => row.sectionId)).toEqual(["2903.06", "2903.08"]);
    expect(report.rows.filter((row) => row.disposition === "needs_legal_interpretation")
      .every((row) => row.legalQuestion?.includes("Do not infer one catalog row per subparagraph."))).toBe(true);
    expect(report.replayMetrics).toMatchObject({
      hashesValidated: 40,
      definitionsMatched: 40,
      failClosed: true,
    });
  });

  it("is deterministic and retains source structural and sentencing references", () => {
    const first = buildOhioChapter2903Accounting(discovery);
    const second = buildOhioChapter2903Accounting(discovery);
    expect(second).toEqual(first);
    expect(first.rows.find((row) => row.sectionId === "2903.01")?.sentencingCrossReferences)
      .toContain("R.C. 2929.02");
    expect(first.rows.find((row) => row.sectionId === "2903.06")
      ?.structuralAlternativeOrSubdivisionReferences.length).toBeGreaterThan(0);
    expect(accountingCsv(first).split("\n")).toHaveLength(42);
  });

  it("fails closed if a pinned official text or title quote changes", () => {
    const changedText = structuredClone(discovery);
    changedText.sections[0].normalizedText += "\nChanged.";
    expect(() => buildOhioChapter2903Accounting(changedText))
      .toThrow(/Fail closed: normalized official source hash changed/);

    const changedTitle = structuredClone(discovery);
    changedTitle.sections[0].title = "A handwritten replacement";
    expect(() => buildOhioChapter2903Accounting(changedTitle))
      .toThrow(/Fail closed: 2903\.01 title is not routine-extracted/);
  });
});