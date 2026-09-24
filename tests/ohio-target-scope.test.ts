import { describe, expect, it } from "vitest";
import { extractOhioPenaltyLinkages } from "../scripts/data-review/ohio-discovery/offense-extractor";

function scopes(reference: string, prefix = "", suffix = "") {
  const text = `${prefix}Whoever violates ${reference} of the Revised Code is guilty of a misdemeanor of the fourth degree${suffix}.`;
  const [link] = extractOhioPenaltyLinkages(text, "101.99");
  for (const target of link.targetScopes) for (const span of target.referenceSpans) {
    expect(span.text).toBe(text.slice(span.start, span.end));
  }
  return Object.fromEntries(link.targetScopes.map(target => [target.section, target]));
}

describe("Per-target penalty reference scope", () => {
  it("separates explicit whole-section references from shared division qualifiers", () => {
    const rows = scopes("division (A), (B), or (C) of section 101.71 or of section 101.91, or section 101.77 or 101.97");
    expect(rows["101.71"].scope).toBe("division_qualified");
    expect(rows["101.91"].scope).toBe("division_qualified");
    expect(rows["101.77"].requiresApplicabilityReview).toBe(false);
    expect(rows["101.97"].requiresApplicabilityReview).toBe(false);
  });
  it("resets a whole-section list after an explicit section keyword", () => {
    const rows = scopes("division (D) of section 102.02 or section 102.021, 102.03, 102.04, or 102.07");
    expect(rows["102.02"].requiresApplicabilityReview).toBe(true);
    expect(Object.values(rows).filter(row => !row.requiresApplicabilityReview).map(row => row.section)).toEqual(["102.021", "102.03", "102.04", "102.07"]);
  });
  it("does not clear ambiguous bare siblings following a division qualifier", () => {
    const rows = scopes("section 959.03, 959.06, division (C) of section 959.09, 959.12, or 959.17 or division (A) of section 959.15");
    expect(rows["959.03"].requiresApplicabilityReview).toBe(false);
    expect(rows["959.06"].requiresApplicabilityReview).toBe(false);
    expect(rows["959.09"].scope).toBe("division_qualified");
    expect(rows["959.12"].scope).toBe("ambiguous_reference");
    expect(rows["959.17"].requiresApplicabilityReview).toBe(true);
  });
  it.each([
    ["Except as provided in division (B), ", "", "conditional_penalty"],
    ["", " on a first offense; on each subsequent offense the grade increases", "conditional_penalty"],
    ["Prior to July 1, 1996, ", "", "temporal_condition"],
    ["On or after July 1, 1996, ", "", "temporal_condition"],
    ["", ", unless a different penalty is specified", "conditional_penalty"],
    ["", ".(2) Notwithstanding division (B)(1), only civil remedies apply to licensees", "conditional_penalty"],
  ])("retains shared conditions when one target is bare", (prefix, suffix, reason) => {
    const rows = scopes("division (A) of section 101.71 or section 101.77", prefix, suffix);
    expect(rows["101.77"].reviewReasons).toContain(reason);
  });
  it("does not mistake a chapter number for a historical year", () => {
    expect(scopes("section 1901.01")["1901.01"].requiresApplicabilityReview).toBe(false);
  });
  it("keeps actor and rule qualifications conservative", () => {
    const actor = scopes("section 3767.13 or, being a natural person, violates section 3767.30");
    expect(actor["3767.30"].reviewReasons).toContain("actor_qualification");
    const rule = scopes("section 101.71 or any rule adopted under section 101.77");
    expect(rule["101.77"].reviewReasons).toContain("unparsed_reference_qualification");
  });
  it("does not let a range contaminate a separate direct reference or become a direct grade", () => {
    const rows = scopes("sections 907.01 to 907.17 or section 907.41");
    expect(Object.keys(rows)).toEqual(["907.41"]);
    expect(rows["907.41"].requiresApplicabilityReview).toBe(false);
  });
  it("preserves both mentions when the same target has mixed scopes", () => {
    const rows = scopes("section 101.71 or division (B) of section 101.71");
    expect(rows["101.71"].referenceSpans).toHaveLength(2);
    expect(rows["101.71"].requiresApplicabilityReview).toBe(true);
  });
});
