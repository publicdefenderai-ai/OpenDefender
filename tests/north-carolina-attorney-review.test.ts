import { describe, expect, it } from "vitest";
import { criminalCharges } from "../shared/criminal-charges";
import { CHARGE_CITATIONS } from "../shared/criminal-charge-citations";
import {
  buildNorthCarolinaSourceUrl,
} from "../server/data/north-carolina-source-database-seed";
import { loadNorthCarolinaAuthorityManifest } from "../server/data/north-carolina-manifest-loader";
import {
  NORTH_CAROLINA_ATTORNEY_REVIEW_DECISIONS,
} from "../server/data/north-carolina-title-attorney-review";
import {
  NORTH_CAROLINA_TITLE_REVIEW_ACTIONS,
} from "../shared/north-carolina-title-review-actions";

describe("North Carolina attorney review import", () => {
  it("keeps all source identity fields aligned with the live catalog", () => {
    const ncCatalog = new Map(
      criminalCharges
        .filter((charge) => charge.jurisdiction === "NC")
        .map((charge) => [charge.id, charge]),
    );
    const manifest = loadNorthCarolinaAuthorityManifest();
    const manifestById = new Map(
      manifest.catalogRecords.map((record) => [record.chargeId, record]),
    );
    const rows = Object.values(NORTH_CAROLINA_ATTORNEY_REVIEW_DECISIONS);
    const expectedSourceIdentityMismatches = new Set(["nc-larceny-misdemeanor"]);
    const correctedCatalogSourceLabels: Record<string, string> = {
      "nc-burglary-in-the-second-degree": "Burglary in the Second Degree",
      "nc-residential-burglary": "Residential Burglary",
    };
    const reviewedIds = new Set(rows.map((row) => row.chargeId));

    expect(rows).toHaveLength(114);
    expect(
      manifest.catalogRecords
        .filter((record) => record.disposition === "retain" && !reviewedIds.has(record.chargeId))
        .map((record) => record.chargeId)
        .sort(),
    ).toEqual([
      "nc-disorderly-conduct",
      "nc-disorderly-conduct-public",
      "nc-identity-theft",
      "nc-possession-of-drug-paraphernalia",
      "nc-reckless-driving",
      "nc-second-degree-trespass",
    ]);
    for (const row of rows) {
      const charge = ncCatalog.get(row.chargeId);
      expect(charge, row.chargeId).toBeDefined();
      expect(row.catalogLabel, row.chargeId).toBe(
        correctedCatalogSourceLabels[row.chargeId] ?? charge!.name,
      );
      const record = manifestById.get(row.chargeId);
      expect(record, row.chargeId).toBeDefined();
      const reference = record!.sourceAudit.references.find((candidate) =>
        candidate.citation === row.citation &&
        (candidate.subdivision ?? "Whole section") === row.subdivision &&
        candidate.officialUrl === row.officialCodeUrl,
      );
      if (!reference && expectedSourceIdentityMismatches.has(row.chargeId)) {
        expect(record!.disposition, row.chargeId).toBe("require_exact_reselection");
        continue;
      }
      const correctedReferences: Record<string, string> = {
        "nc-murder-in-the-first-degree": "N.C. Gen. Stat. § 14-17(a)",
        "nc-burglary-in-the-first-degree": "N.C. Gen. Stat. § 14-51(a)",
        "nc-burglary-in-the-second-degree": "N.C. Gen. Stat. § 14-54",
        "nc-residential-burglary": "N.C. Gen. Stat. § 14-51(b)",
      };
      if (!reference && correctedReferences[row.chargeId]) {
        expect(record!.sourceAudit.references.map((candidate) => candidate.citation))
          .toContain(correctedReferences[row.chargeId]);
        continue;
      }
      expect(reference, row.chargeId).toBeDefined();
      expect(row.officialCodeUrl, row.chargeId).toBe(
        buildNorthCarolinaSourceUrl(reference!.section),
      );
      expect(CHARGE_CITATIONS[row.chargeId], row.chargeId).toBeDefined();
      expect(row.note, row.chargeId).not.toBe("");
    }
    expect(expectedSourceIdentityMismatches).toEqual(new Set(["nc-larceny-misdemeanor"]));
  });

  it("does not turn blank decisions into approvals", () => {
    const rows = Object.values(NORTH_CAROLINA_ATTORNEY_REVIEW_DECISIONS);
    const pending = rows.filter((row) => row.decision === "pending");

    expect(pending.map((row) => row.chargeId)).toEqual([
      "nc-assault-on-peace-officer",
      "nc-assault-with-deadly-weapon",
      "nc-possession-of-controlled-substance",
      "nc-possession-of-prohibited-weapon",
    ]);
    expect(Object.keys(NORTH_CAROLINA_TITLE_REVIEW_ACTIONS)).toHaveLength(60);
    expect(NORTH_CAROLINA_TITLE_REVIEW_ACTIONS["nc-recidivist-enhancement"].action)
      .toBe("remove");
    expect(NORTH_CAROLINA_TITLE_REVIEW_ACTIONS["nc-residential-burglary"].action)
      .toBe("publish");
    expect(NORTH_CAROLINA_TITLE_REVIEW_ACTIONS["nc-larceny-misdemeanor"].action)
      .toBe("hold");
  });
});