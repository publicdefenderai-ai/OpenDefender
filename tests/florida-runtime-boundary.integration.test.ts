import { beforeAll, describe, expect, it } from "vitest";

const runIntegration = process.env.RUN_FLORIDA_AUTHORITY_API_TESTS === "1";
const BASE_URL = process.env.REPLIT_DEV_DOMAIN
  ? `https://${process.env.REPLIT_DEV_DOMAIN}`
  : "http://localhost:5000";

interface ChargesResponse {
  success: boolean;
  charges: Array<{ id: string; name: string }>;
}

const withheldFloridaIds = [
  "fl-noise-violation",
  "fl-bank-robbery",
  "fl-resisting-arrest",
  "fl-sexual-assault-in-the-second-degree",
  "fl-petty-theft",
  "fl-assault-on-peace-officer",
  "fl-embezzlement",
];

describe.skipIf(!runIntegration)("Florida runtime authority boundary", () => {
  let charges: ChargesResponse;

  beforeAll(async () => {
    const response = await fetch(`${BASE_URL}/api/criminal-charges?jurisdiction=FL&limit=500`);
    expect(response.ok).toBe(true);
    charges = await response.json() as ChargesResponse;
  });

  it("filters withheld rows from the charge API and v1 export", async () => {
    expect(charges.success).toBe(true);
    expect(charges.charges.some((charge) => charge.id === "fl-aggravated-assault")).toBe(true);
    for (const chargeId of withheldFloridaIds) {
      expect(charges.charges.some((charge) => charge.id === chargeId), chargeId).toBe(false);
    }

    const exportResponse = await fetch(`${BASE_URL}/api/v1/export/charges?jurisdiction=FL`);
    expect(exportResponse.ok).toBe(true);
    const exported = await exportResponse.json() as Array<{ id: string }>;
    expect(exported.some((charge) => charge.id === "fl-aggravated-assault")).toBe(true);
    for (const chargeId of withheldFloridaIds) {
      expect(exported.some((charge) => charge.id === chargeId), chargeId).toBe(false);
    }
  });

  it("publishes only current Online Sunshine provenance", async () => {
    const current = await fetch(`${BASE_URL}/api/criminal-charges/fl-aggravated-assault/sources`);
    expect(current.ok).toBe(true);
    const currentPayload = await current.json() as {
      provenance?: { sources?: Array<{ publisher: string; sourceUrl: string; contentAvailable: boolean }> };
    };
    expect(currentPayload.provenance?.sources?.[0]).toMatchObject({
      publisher: "Florida Legislature Online Sunshine",
      contentAvailable: true,
    });
    expect(currentPayload.provenance?.sources?.[0]?.sourceUrl).toMatch(
      /^https:\/\/www\.leg\.state\.fl\.us\/statutes\//,
    );

    for (const chargeId of withheldFloridaIds) {
      const withheld = await fetch(`${BASE_URL}/api/criminal-charges/${chargeId}/sources`);
      expect(withheld.status, chargeId).toBe(404);
    }
  });

  it("applies the same boundary to v1 search and rules guidance", async () => {
    const searchResponse = await fetch(
      `${BASE_URL}/api/v1/search?q=aggravated%20assault&types=charge&limit=100`,
    );
    expect(searchResponse.ok).toBe(true);
    const payload = await searchResponse.json() as {
      results: Array<{ document: { id: string } }>;
    };
    expect(payload.results.some((result) => result.document.id === "charge-fl-aggravated-assault")).toBe(true);
    for (const chargeId of withheldFloridaIds) {
      expect(payload.results.some((result) => result.document.id === `charge-${chargeId}`), chargeId).toBe(false);
    }

    for (const chargeId of withheldFloridaIds) {
      const response = await fetch(`${BASE_URL}/api/legal-guidance/rules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jurisdiction: "FL",
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