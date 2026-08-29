import { beforeAll, describe, expect, it } from "vitest";

const runIntegration = process.env.RUN_OHIO_AUTHORITY_API_TESTS === "1";
const BASE_URL = process.env.REPLIT_DEV_DOMAIN
  ? `https://${process.env.REPLIT_DEV_DOMAIN}`
  : "http://localhost:5000";

interface ChargesResponse {
  success: boolean;
  charges: Array<{ id: string; name: string }>;
}

const withheldOhioIds = [
  "oh-murder-in-the-first-degree",
  "oh-bank-robbery",
  "oh-attempted-robbery",
  "oh-petty-theft",
  "oh-identity-theft",
];

describe.skipIf(!runIntegration)("Ohio runtime authority boundary", () => {
  let charges: ChargesResponse;

  beforeAll(async () => {
    const response = await fetch(`${BASE_URL}/api/criminal-charges?jurisdiction=OH&limit=500`);
    expect(response.ok).toBe(true);
    charges = await response.json() as ChargesResponse;
  });

  it("filters withheld rows from the charge API and v1 export", async () => {
    expect(charges.success).toBe(true);
    expect(charges.charges.some((charge) => charge.id === "oh-aggravated-assault")).toBe(true);
    for (const chargeId of withheldOhioIds) {
      expect(charges.charges.some((charge) => charge.id === chargeId), chargeId).toBe(false);
    }

    const exportResponse = await fetch(`${BASE_URL}/api/v1/export/charges?jurisdiction=OH`);
    expect(exportResponse.ok).toBe(true);
    const exported = await exportResponse.json() as Array<{ id: string }>;
    expect(exported.some((charge) => charge.id === "oh-aggravated-assault")).toBe(true);
    for (const chargeId of withheldOhioIds) {
      expect(exported.some((charge) => charge.id === chargeId), chargeId).toBe(false);
    }
  });

  it("publishes only current Ohio Laws provenance", async () => {
    const current = await fetch(`${BASE_URL}/api/criminal-charges/oh-aggravated-assault/sources`);
    expect(current.ok).toBe(true);
    const payload = await current.json() as {
      provenance?: { sources?: Array<{ publisher: string; sourceUrl: string; contentAvailable: boolean }> };
    };
    expect(payload.provenance?.sources?.[0]).toMatchObject({
      publisher: "Ohio Legislative Service Commission",
      contentAvailable: true,
    });
    expect(payload.provenance?.sources?.[0]?.sourceUrl).toMatch(
      /^https:\/\/codes\.ohio\.gov\/ohio-revised-code\/section-/,
    );

    for (const chargeId of withheldOhioIds) {
      const withheld = await fetch(`${BASE_URL}/api/criminal-charges/${chargeId}/sources`);
      expect(withheld.status, chargeId).toBe(404);
    }
  });

  it("applies the same boundary to rules guidance", async () => {
    for (const chargeId of withheldOhioIds) {
      const response = await fetch(`${BASE_URL}/api/legal-guidance/rules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jurisdiction: "OH",
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