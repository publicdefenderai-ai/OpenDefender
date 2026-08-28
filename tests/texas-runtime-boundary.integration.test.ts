import { beforeAll, describe, expect, it } from "vitest";

const runIntegration = process.env.RUN_TEXAS_AUTHORITY_API_TESTS === "1";
const BASE_URL = process.env.REPLIT_DEV_DOMAIN
  ? `https://${process.env.REPLIT_DEV_DOMAIN}`
  : "http://localhost:5000";

interface ChargesResponse {
  success: boolean;
  charges: Array<{ id: string; name: string }>;
}

describe.skipIf(!runIntegration)("Texas runtime authority boundary", () => {
  let charges: ChargesResponse;

  beforeAll(async () => {
    const response = await fetch(`${BASE_URL}/api/criminal-charges?jurisdiction=TX&limit=500`);
    expect(response.ok).toBe(true);
    charges = await response.json() as ChargesResponse;
  });

  it("filters withheld rows from the charge API and v1 export", async () => {
    expect(charges.success).toBe(true);
    expect(charges.charges.some((charge) => charge.id === "tx-aggravated-assault")).toBe(true);
    expect(charges.charges.some((charge) => charge.id === "tx-bank-robbery")).toBe(false);
    expect(charges.charges.some((charge) => charge.id === "tx-wire-fraud")).toBe(false);

    const exportResponse = await fetch(`${BASE_URL}/api/v1/export/charges?jurisdiction=TX`);
    expect(exportResponse.ok).toBe(true);
    const exported = await exportResponse.json() as Array<{ id: string }>;
    expect(exported.some((charge) => charge.id === "tx-aggravated-assault")).toBe(true);
    expect(exported.some((charge) => charge.id === "tx-bank-robbery")).toBe(false);
    expect(exported.some((charge) => charge.id === "tx-wire-fraud")).toBe(false);
  });

  it("publishes only current TCSS provenance and withholds missing provenance", async () => {
    const current = await fetch(`${BASE_URL}/api/criminal-charges/tx-aggravated-assault/sources`);
    expect(current.ok).toBe(true);
    const currentPayload = await current.json() as {
      provenance?: { sources?: Array<{ publisher: string; sourceUrl: string; contentAvailable: boolean }> };
    };
    expect(currentPayload.provenance?.sources?.[0]).toMatchObject({
      publisher: "Texas Legislative Council TCSS",
      contentAvailable: true,
    });
    expect(currentPayload.provenance?.sources?.[0]?.sourceUrl).toMatch(
      /^https:\/\/tcss\.legis\.texas\.gov\/resources\//,
    );

    const withheld = await fetch(`${BASE_URL}/api/criminal-charges/tx-bank-robbery/sources`);
    expect(withheld.status).toBe(404);
  });

  it("applies the same boundary to v1 search", async () => {
    const searchResponse = await fetch(
      `${BASE_URL}/api/v1/search?q=intoxication%20manslaughter&types=charge&limit=100`,
    );
    expect(searchResponse.ok).toBe(true);
    const payload = await searchResponse.json() as {
      results: Array<{ document: { id: string } }>;
    };
    expect(payload.results.some((result) => result.document.id === "charge-tx-vehicular-homicide")).toBe(true);
    expect(payload.results.some((result) => result.document.id === "charge-tx-bank-robbery")).toBe(false);
  });

  it("rejects withheld Texas charges in rules guidance", async () => {
    const response = await fetch(`${BASE_URL}/api/legal-guidance/rules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jurisdiction: "TX",
        charges: ["tx-bank-robbery"],
        caseStage: "arrest",
        custodyStatus: "in_custody",
      }),
    });
    expect(response.status).toBe(400);
    const payload = await response.json() as { requiresReselection?: boolean };
    expect(payload.requiresReselection).toBe(true);
  });
});