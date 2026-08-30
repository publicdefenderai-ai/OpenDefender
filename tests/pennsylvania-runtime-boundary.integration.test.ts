import { beforeAll, describe, expect, it } from "vitest";

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
    expect(charges.charges.some((charge) => charge.id === "pa-aggravated-assault")).toBe(true);
    expect(charges.charges.some((charge) => charge.id === "pa-assault-on-peace-officer")).toBe(false);
    expect(charges.charges.some((charge) => charge.id === "pa-bank-robbery")).toBe(false);

    const exportResponse = await fetch(`${BASE_URL}/api/v1/export/charges?jurisdiction=PA`);
    expect(exportResponse.ok).toBe(true);
    const exported = await exportResponse.json() as Array<{ id: string }>;
    expect(exported.some((charge) => charge.id === "pa-aggravated-assault")).toBe(true);
    expect(exported.some((charge) => charge.id === "pa-assault-on-peace-officer")).toBe(false);
    expect(exported.some((charge) => charge.id === "pa-bank-robbery")).toBe(false);
  });

  it("publishes only current Pennsylvania provenance", async () => {
    const current = await fetch(`${BASE_URL}/api/criminal-charges/pa-aggravated-assault/sources`);
    expect(current.ok).toBe(true);
    const currentPayload = await current.json() as {
      provenance?: {
        sources?: Array<{
          publisher: string;
          sourceUrl: string;
          contentAvailable: boolean;
        }>;
      };
    };
    expect(currentPayload.provenance?.sources?.[0]).toMatchObject({
      publisher: "Pennsylvania General Assembly",
      contentAvailable: true,
    });
    expect(currentPayload.provenance?.sources?.[0]?.sourceUrl).toMatch(
      /^https:\/\/www\.legis\.state\.pa\.us\/cfdocs\/legis\/LI\/consCheck\.cfm/,
    );

    for (const chargeId of ["pa-assault-on-peace-officer", "pa-bank-robbery"]) {
      const withheld = await fetch(`${BASE_URL}/api/criminal-charges/${chargeId}/sources`);
      expect(withheld.status, chargeId).toBe(404);
    }
  });

  it("applies the same boundary to v1 search and rules guidance", async () => {
    const searchResponse = await fetch(
      `${BASE_URL}/api/v1/search?q=assault&types=charge&limit=100`,
    );
    expect(searchResponse.ok).toBe(true);
    const payload = await searchResponse.json() as {
      results: Array<{ document: { id: string } }>;
    };
    expect(payload.results.some((result) => result.document.id === "charge-pa-aggravated-assault")).toBe(true);
    expect(payload.results.some((result) => result.document.id === "charge-pa-assault-on-peace-officer")).toBe(false);

    for (const chargeId of ["pa-assault-on-peace-officer", "pa-bank-robbery"]) {
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