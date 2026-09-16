import { beforeAll, describe, expect, it } from "vitest";
import { loadPennsylvaniaAuthorityManifest } from "../server/data/pennsylvania-manifest-loader";

const manifest = loadPennsylvaniaAuthorityManifest();
const publishedCorrectedChargeIds = [
  "pa-bank-robbery",
  "pa-burglary-in-the-second-degree",
  "pa-robbery-in-the-first-degree",
  "pa-solicitation",
] as const;
const selectableRecords = manifest.catalogRecords
  .filter((record) => record.disposition === "retain" || record.disposition === "exact_alias_rename");
const selectableChargeIds = selectableRecords.map((record) => record.chargeId);
const expectedPublishedChargeIds = new Set(selectableChargeIds);
const withheldChargeIds = manifest.catalogRecords
  .filter((record) => record.disposition !== "retain" && record.disposition !== "exact_alias_rename")
  .map((record) => record.chargeId);
const representativeWithheldChargeIds = [
  "pa-burglary-in-the-first-degree",
  "pa-attempted-robbery",
] as const;

// This suite must only be enabled against the development workflow. It uses
// the development database's committed seed and must never target production.
const runIntegration =
  process.env.NODE_ENV === "development" &&
  process.env.RUN_PENNSYLVANIA_AUTHORITY_API_TESTS === "1";
const BASE_URL = process.env.REPLIT_DEV_DOMAIN
  ? `https://${process.env.REPLIT_DEV_DOMAIN}`
  : "http://localhost:5000";

interface ChargesResponse {
  success: boolean;
  charges: Array<{ id: string }>;
}

describe.skipIf(!runIntegration)("Pennsylvania runtime authority boundary", () => {
  let charges: ChargesResponse;

  beforeAll(async () => {
    const response = await fetch(`${BASE_URL}/api/criminal-charges?jurisdiction=PA&limit=500`);
    expect(response.ok).toBe(true);
    charges = await response.json() as ChargesResponse;
  });

  it("filters withheld rows from the charge API and v1 export", async () => {
    expect(charges.success).toBe(true);
    expect(new Set(charges.charges.map((charge) => charge.id))).toEqual(expectedPublishedChargeIds);
    expect(charges.charges.some((charge) => charge.id === "pa-aggravated-assault")).toBe(true);
    for (const chargeId of publishedCorrectedChargeIds) {
      expect(charges.charges.some((charge) => charge.id === chargeId), chargeId).toBe(true);
    }

    const exportResponse = await fetch(`${BASE_URL}/api/v1/export/charges?jurisdiction=PA`);
    expect(exportResponse.ok).toBe(true);
    const exported = await exportResponse.json() as Array<{ id: string }>;
    expect(new Set(exported.map((charge) => charge.id))).toEqual(expectedPublishedChargeIds);
    expect(exported.some((charge) => charge.id === "pa-aggravated-assault")).toBe(true);
    for (const chargeId of publishedCorrectedChargeIds) {
      expect(exported.some((charge) => charge.id === chargeId), chargeId).toBe(true);
    }
  });

  it("publishes current Pennsylvania provenance for every selectable manifest row", async () => {
    for (const chargeId of selectableChargeIds) {
      const current = await fetch(`${BASE_URL}/api/criminal-charges/${chargeId}/sources`);
      expect(current.ok, chargeId).toBe(true);
      const currentPayload = await current.json() as {
        provenance?: {
          sources?: Array<{
            publisher: string;
            sourceUrl: string;
            contentAvailable: boolean;
            status: string;
          }>;
        };
      };
      const sources = currentPayload.provenance?.sources ?? [];
      expect(sources.length, chargeId).toBeGreaterThan(0);
      const manifestRecord = selectableRecords.find((record) => record.chargeId === chargeId);
      expect(manifestRecord, chargeId).toBeDefined();
      expect(
        sources.map((source) => source.sourceUrl).sort(),
        chargeId,
      ).toEqual(manifestRecord?.provisions.map((provision) => provision.sourceUrl).sort());
      for (const source of sources) {
        expect(source, chargeId).toMatchObject({
          publisher: "Pennsylvania General Assembly",
          contentAvailable: true,
          status: "current",
        });
        expect(source.sourceUrl, chargeId).toMatch(
          /^https:\/\/(?:www\.legis\.state\.pa\.us\/cfdocs\/legis\/LI\/consCheck\.cfm|www\.palegis\.us\/statutes\/(?:consolidated|unconsolidated)\/)/,
        );
      }
    }

    for (const chargeId of withheldChargeIds) {
      const withheld = await fetch(`${BASE_URL}/api/criminal-charges/${chargeId}/sources`);
      expect(withheld.status, chargeId).toBe(404);
    }
  });

  it("keeps published Pennsylvania aliases discoverable while excluding withheld rows", async () => {
    const searchResponse = await fetch(
      `${BASE_URL}/api/v1/search?q=prostitution&types=charge&jurisdiction=PA&limit=100`,
    );
    expect(searchResponse.ok).toBe(true);
    const payload = await searchResponse.json() as {
      results: Array<{ document: { id: string } }>;
    };
    expect(payload.results.some((result) => result.document.id === "charge-pa-solicitation")).toBe(true);
    expect(payload.results.some((result) => result.document.id === "charge-pa-attempted-robbery")).toBe(false);

    for (const chargeId of representativeWithheldChargeIds) {
      const response = await fetch(`${BASE_URL}/api/legal-guidance/rules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jurisdiction: "PA",
          charges: [chargeId],
          caseStage: "arrest",
          custodyStatus: "in_custody",
        }),
      });
      expect(response.status, chargeId).toBe(400);
      const guidance = await response.json() as { requiresReselection?: boolean };
      expect(guidance.requiresReselection, chargeId).toBe(true);
    }
  });
});