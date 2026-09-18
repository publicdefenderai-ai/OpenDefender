import { beforeAll, describe, expect, it } from "vitest";
import { criminalCharges } from "../shared/criminal-charges";
import { getChargeExplanation } from "../shared/charge-explanations";
import {
  FLORIDA_REVIEWED_DEFINITIONS,
} from "../shared/florida-reviewed-batch";
import {
  FLORIDA_REVIEWED_SOURCE_RECORDS,
} from "../server/data/florida-reviewed-source-records";

const runIntegration = process.env.RUN_FLORIDA_AUTHORITY_API_TESTS === "1";
const BASE_URL = process.env.REPLIT_DEV_DOMAIN
  ? `https://${process.env.REPLIT_DEV_DOMAIN}`
  : "http://localhost:5000";

interface ChargesResponse {
  success: boolean;
  charges: Array<{ id: string; name: string }>;
}

const approvedFloridaIds = new Set(
  FLORIDA_REVIEWED_SOURCE_RECORDS.map((record) => record.chargeId),
);
const unavailableReviewedIds = FLORIDA_REVIEWED_DEFINITIONS
  .map((definition) => definition.id)
  .filter((id) => !approvedFloridaIds.has(id));

const representativePatterns = [
  ["DUI", /driving under the influence|dui/i],
  ["property", /criminal mischief|trespass|retail theft|stolen property/i],
  ["homicide", /manslaughter|murder/i],
] as const;
const representativeDefinitions = representativePatterns.flatMap(([kind, pattern]) => {
  const definition = FLORIDA_REVIEWED_DEFINITIONS.find((candidate) =>
    approvedFloridaIds.has(candidate.id) &&
    (pattern.test(candidate.name) || pattern.test(candidate.slug)));
  return definition ? [{ kind, definition }] : [];
});
const locales = ["en", "es", "zh"] as const;

const withheldFloridaIds = [
  "fl-noise-violation",
  "fl-bank-robbery",
  "fl-resisting-arrest",
  "fl-sexual-assault-in-the-second-degree",
  "fl-petty-theft",
  "fl-assault-on-peace-officer",
  "fl-embezzlement",
];

describe("Florida reviewed localized catalog boundary", () => {
  it("maps every approved row to complete shared EN/ES/ZH charge explanations", () => {
    expect(approvedFloridaIds.size).toBeGreaterThan(0);
    for (const id of approvedFloridaIds) {
      const definition = FLORIDA_REVIEWED_DEFINITIONS.find((row) => row.id === id);
      const charge = criminalCharges.find((row) => row.id === id);
      expect(definition, id).toBeDefined();
      expect(charge, id).toMatchObject({
        name: definition!.name,
        nameEs: definition!.names!.es,
        nameZh: definition!.names!.zh,
        description: definition!.text.en.plainSummary,
        descriptionEs: definition!.text.es.plainSummary,
        descriptionZh: definition!.text.zh.plainSummary,
      });
      for (const locale of locales) {
        const explanation = getChargeExplanation(
          definition!.name,
          "FL",
          locale,
          id,
        );
        expect(explanation?.plainSummary, `${id}:${locale}`)
          .toBe(definition!.text[locale].plainSummary);
        expect(explanation?.degreeContext, `${id}:${locale}`)
          .toBe(definition!.text[locale].degreeContext);
      }
    }
    for (const id of unavailableReviewedIds) {
      expect(approvedFloridaIds.has(id), id).toBe(false);
    }
  });
});

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
    for (const chargeId of approvedFloridaIds) {
      expect(charges.charges.some((charge) => charge.id === chargeId), chargeId).toBe(true);
    }
    for (const chargeId of unavailableReviewedIds) {
      expect(charges.charges.some((charge) => charge.id === chargeId), chargeId).toBe(false);
    }
    for (const chargeId of withheldFloridaIds) {
      expect(charges.charges.some((charge) => charge.id === chargeId), chargeId).toBe(false);
    }

    const exportResponse = await fetch(`${BASE_URL}/api/v1/export/charges?jurisdiction=FL`);
    expect(exportResponse.ok).toBe(true);
    const exported = await exportResponse.json() as Array<{ id: string }>;
    expect(exported.some((charge) => charge.id === "fl-aggravated-assault")).toBe(true);
    for (const chargeId of approvedFloridaIds) {
      expect(exported.some((charge) => charge.id === chargeId), chargeId).toBe(true);
    }
    for (const chargeId of unavailableReviewedIds) {
      expect(exported.some((charge) => charge.id === chargeId), chargeId).toBe(false);
    }
    for (const chargeId of withheldFloridaIds) {
      expect(exported.some((charge) => charge.id === chargeId), chargeId).toBe(false);
    }
  });

  for (const { kind, definition } of representativeDefinitions) {
    for (const locale of locales) {
      it(`finds the approved ${kind} representative using ${locale} localized search`, async () => {
        const query = locale === "en" ? definition.name : definition.names![locale];
        const response = await fetch(
          `${BASE_URL}/api/site-search?q=${encodeURIComponent(query)}` +
          `&lang=${locale}&types=charge&jurisdiction=FL&limit=100`,
        );
        expect(response.ok).toBe(true);
        const payload = await response.json() as {
          results: Array<{ document: { id: string } }>;
        };
        expect(
          payload.results.some((result) =>
            result.document.id === `charge-${definition.id}`),
          `${definition.id}:${locale}`,
        ).toBe(true);
      });
    }
  }

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
  }, 20_000);
});