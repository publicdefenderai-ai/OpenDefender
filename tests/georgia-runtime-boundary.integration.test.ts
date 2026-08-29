import { describe, expect, it } from "vitest";

const runIntegration = process.env.RUN_GA_AUTHORITY_API_TESTS === "1";
const BASE_URL = process.env.REPLIT_DEV_DOMAIN
  ? `https://${process.env.REPLIT_DEV_DOMAIN}`
  : "http://localhost:5000";

describe.skipIf(!runIntegration)("Georgia runtime authority boundary", () => {
  it("excludes all withheld Georgia rows from selection and export", async () => {
    const response = await fetch(`${BASE_URL}/api/criminal-charges?jurisdiction=GA&limit=500`);
    expect(response.ok).toBe(true);
    const payload = await response.json() as { success: boolean; charges: Array<{ id: string }> };
    expect(payload.success).toBe(true);
    expect(payload.charges).toHaveLength(0);

    const exportResponse = await fetch(`${BASE_URL}/api/v1/export/charges?jurisdiction=GA`);
    expect(exportResponse.ok).toBe(true);
    expect(await exportResponse.json()).toEqual([]);
  });

  it("does not expose provenance or rules guidance for withheld Georgia rows", async () => {
    const chargeId = "ga-murder-in-the-first-degree";
    const provenance = await fetch(`${BASE_URL}/api/criminal-charges/${chargeId}/sources`);
    expect(provenance.status).toBe(404);

    const rules = await fetch(`${BASE_URL}/api/legal-guidance/rules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jurisdiction: "GA",
        charges: [chargeId],
        caseStage: "arrest",
        custodyStatus: "in_custody",
      }),
    });
    expect(rules.status).toBe(400);
    expect((await rules.json()).requiresReselection).toBe(true);
  });
});