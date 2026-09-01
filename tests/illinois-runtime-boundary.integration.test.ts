import { beforeAll, describe, expect, it } from "vitest";

const runIntegration = process.env.RUN_ILLINOIS_AUTHORITY_API_TESTS === "1";
const BASE_URL = process.env.REPLIT_DEV_DOMAIN
  ? `https://${process.env.REPLIT_DEV_DOMAIN}`
  : "http://localhost:5000";

interface ChargesResponse {
  success: boolean;
  charges: Array<{ id: string; name: string }>;
}

describe.skipIf(!runIntegration)("Illinois runtime authority boundary", () => {
  let charges: ChargesResponse;

  beforeAll(async () => {
    const response = await fetch(`${BASE_URL}/api/criminal-charges?jurisdiction=IL&limit=500`);
    expect(response.ok).toBe(true);
    charges = await response.json() as ChargesResponse;
  });

  it("filters withheld rows from the charge API and v1 export", async () => {
    expect(charges.success).toBe(true);
    expect(charges.charges.some((charge) => charge.id === "il-aggravated-assault")).toBe(true);
    expect(charges.charges.some((charge) => charge.id === "il-possession-of-drug-paraphernalia")).toBe(true);
    expect(charges.charges.some((charge) => charge.id === "il-money-laundering")).toBe(true);
    expect(charges.charges.some((charge) => charge.id === "il-vehicular-homicide")).toBe(false);
    expect(charges.charges.some((charge) => charge.id === "il-bank-robbery")).toBe(false);

    const exportResponse = await fetch(`${BASE_URL}/api/v1/export/charges?jurisdiction=IL`);
    expect(exportResponse.ok).toBe(true);
    const exported = await exportResponse.json() as Array<{ id: string }>;
    expect(exported.some((charge) => charge.id === "il-aggravated-assault")).toBe(true);
    expect(exported.some((charge) => charge.id === "il-vehicular-homicide")).toBe(false);
    expect(exported.some((charge) => charge.id === "il-bank-robbery")).toBe(false);
  });

  it("publishes only current ILGA provenance", async () => {
    for (const chargeId of [
      "il-aggravated-assault",
      "il-possession-of-drug-paraphernalia",
      "il-money-laundering",
    ]) {
      const current = await fetch(`${BASE_URL}/api/criminal-charges/${chargeId}/sources`);
      expect(current.ok).toBe(true);
      const currentPayload = await current.json() as {
        provenance?: { sources?: Array<{ publisher: string; sourceUrl: string; contentAvailable: boolean }> };
      };
      expect(currentPayload.provenance?.sources?.[0]).toMatchObject({
        publisher: "Illinois General Assembly",
        contentAvailable: true,
        sourceUrl: expect.stringMatching(
          /^https:\/\/www\.ilga\.gov\/legislation\/ilcs\/documents\//,
        ),
      });
    }

    const withheld = await fetch(
      `${BASE_URL}/api/criminal-charges/il-vehicular-homicide/sources`,
    );
    expect(withheld.status).toBe(404);
  });

  it("applies the same boundary to v1 search and rules guidance", async () => {
    const searchResponse = await fetch(
      `${BASE_URL}/api/v1/search?q=aggravated%20assault&types=charge&limit=100`,
    );
    expect(searchResponse.ok).toBe(true);
    const payload = await searchResponse.json() as {
      results: Array<{ document: { id: string } }>;
    };
    expect(payload.results.some((result) => result.document.id === "charge-il-aggravated-assault")).toBe(true);
    expect(payload.results.some((result) => result.document.id === "charge-il-vehicular-homicide")).toBe(false);

    const response = await fetch(`${BASE_URL}/api/legal-guidance/rules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jurisdiction: "IL",
        charges: ["il-vehicular-homicide"],
        caseStage: "arrest",
        custodyStatus: "in_custody",
      }),
    });
    expect(response.status).toBe(400);
    const guidance = await response.json() as { requiresReselection?: boolean };
    expect(guidance.requiresReselection).toBe(true);
  });
});