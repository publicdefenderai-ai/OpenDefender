import { describe, expect, it } from "vitest";
import { resolveGuidanceCharge } from "../shared/guidance-charge-resolution";
import {
  OHIO_CHAPTER_2903_LEGACY_IDS_REQUIRING_RESELECTION,
  OHIO_CHAPTER_2903_PILOT_CHARGES,
} from "../shared/ohio-chapter-2903-catalog";

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

  it("fails closed for every Ohio legacy ID in dashboard and PDF guidance resolution", () => {
    const legacyCodes: Record<string, string> = {
      "oh-murder-in-the-first-degree": "2903.01",
      "oh-murder-in-the-second-degree": "2903.02",
      "oh-felony-murder": "2903.02",
    };

    for (const id of OHIO_CHAPTER_2903_LEGACY_IDS_REQUIRING_RESELECTION) {
      expect(resolveGuidanceCharge({
        id,
        name: "Historical Ohio homicide label",
        classification: "felony",
        code: legacyCodes[id],
      }, "OH")).toBeUndefined();
    }

    // Older persisted guidance can contain only the statute code. That shape
    // must not recover the raw degree-labelled Ohio row either.
    expect(resolveGuidanceCharge({
      name: "Murder in the First Degree",
      classification: "felony",
      code: "2903.01",
    }, "OH")).toBeUndefined();
  });

  it("still resolves the canonical source-first Ohio pilot IDs", () => {
    for (const pilotCharge of OHIO_CHAPTER_2903_PILOT_CHARGES) {
      expect(resolveGuidanceCharge({
        id: pilotCharge.id,
        name: pilotCharge.name,
        classification: pilotCharge.category,
        code: pilotCharge.code,
      }, "OH")).toMatchObject({
        id: pilotCharge.id,
        name: pilotCharge.name,
      });
    }
  });
});
