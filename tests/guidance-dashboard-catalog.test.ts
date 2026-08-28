import { describe, expect, it } from "vitest";
import { resolveGuidanceCharge } from "../shared/guidance-charge-resolution";

describe("guidance dashboard canonical charge resolution", () => {
  it("uses the canonical California record for a catalog-selected legacy charge ID", () => {
    const charge = resolveGuidanceCharge({
      id: "ca-credit-card-fraud",
      name: "Credit Card Fraud",
      classification: "felony",
      code: "484e",
    });

    expect(charge).toMatchObject({
      id: "ca-credit-card-fraud",
      code: "484g",
      dataConfidence: "high",
      statuteCitations: ["Cal. Penal Code § 484g"],
    });
    expect(charge?.statuteCitations?.length).toBeGreaterThan(0);
  });

  it("normalizes an older code-only California guidance record before display", () => {
    const charge = resolveGuidanceCharge({
      name: "Credit Card Fraud",
      classification: "felony",
      code: "484e",
    }, "CA");

    expect(charge?.code).toBe("484g");
    expect(charge?.dataConfidence).toBe("high");
  });

  it("fails closed for rejected California IDs and code-only historical records", () => {
    expect(resolveGuidanceCharge({
      id: "ca-wire-fraud",
      name: "Wire Fraud",
      classification: "felony",
      code: "370",
    }, "CA")).toBeUndefined();

    expect(resolveGuidanceCharge({
      name: "Wire Fraud",
      classification: "felony",
      code: "370",
    }, "CA")).toBeUndefined();
  });
});