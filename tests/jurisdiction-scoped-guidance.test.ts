import fs from "node:fs";
import { describe, expect, it } from "vitest";
import {
  chargeExplanations,
  getChargeExplanation,
} from "../shared/charge-explanations";
import { CASE_GUIDANCE_SCOPED_SLUGS } from "../shared/charge-explanation-case-guidance";

const JURISDICTIONS = [
  "California",
  "Florida",
  "Ohio",
  "New York",
  "Virginia",
  "Texas",
  "Illinois",
  "Georgia",
  "North Carolina",
  "Arizona",
  "New Jersey",
  "Nevada",
];

function visibleGenericText(result: NonNullable<ReturnType<typeof getChargeExplanation>>): string {
  return [
    result.plainSummary,
    result.degreeContext,
    ...result.keyTerms.flatMap(term => [term.term, term.plainMeaning, term.example ?? ""]),
  ].join(" ");
}

describe("jurisdiction-scoped case guidance", () => {
  it("neutralizes comparative state-law prose for selected-state guidance in all supported languages", () => {
    for (const entry of chargeExplanations) {
      if (!CASE_GUIDANCE_SCOPED_SLUGS.has(entry.slug)) continue;

      for (const language of ["en", "es", "zh"]) {
        const result = getChargeExplanation(entry.slug, "California", language);
        expect(result, `${entry.slug}/${language} did not resolve`).not.toBeNull();
        const text = visibleGenericText(result!);

        // The selected-state overlay is a separate, explicitly labeled field.
        // Generic case guidance must not carry a comparison to another state.
        for (const state of JURISDICTIONS.filter(state => state !== "California")) {
          expect(text, `${entry.slug}/${language} leaked ${state}`).not.toMatch(
            new RegExp(`\\b${state.replace(/ /g, "\\s+")}\\b`, "i"),
          );
        }
      }
    }
  });

  it("keeps a neutral explanation and flags missing verified state detail", () => {
    const result = getChargeExplanation("check fraud", "ZZ", "en");
    expect(result).not.toBeNull();
    expect(result!.jurisdictionDetail).toBeUndefined();
    expect(result!.jurisdictionDetailMissing).toBe(true);
    expect(visibleGenericText(result!)).not.toMatch(/\bCalifornia\b|\bFlorida\b|\bOhio\b/i);
  });

  it("preserves the comparative research view when no state is selected", () => {
    const result = getChargeExplanation("first degree murder", undefined, "en");
    expect(result).not.toBeNull();
    expect(result!.plainSummary).toContain("most serious");
  });

  it("exposes the same coverage warning contract on the dashboard and PDF paths", () => {
    const dashboard = fs.readFileSync("client/src/components/legal/guidance-dashboard.tsx", "utf8");
    const pdf = fs.readFileSync("client/src/lib/pdf-generator.ts", "utf8");
    expect(dashboard).toContain("jurisdictionDetailMissing");
    expect(dashboard).toContain("charge-jurisdiction-coverage");
    expect(pdf).toContain("jurisdictionDetailMissing");
    expect(pdf).toContain("jurisdictionCoverageWarning");
  });
});