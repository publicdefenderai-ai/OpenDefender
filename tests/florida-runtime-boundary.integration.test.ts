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
const LIVE_API_TIMEOUT_MS = 30_000;
const BASE_URL = process.env.REPLIT_DEV_DOMAIN
  ? `https://${process.env.REPLIT_DEV_DOMAIN}`
  : "http://localhost:5000";

async function responseFailure(response: Response): Promise<string> {
  if (response.ok) return "";
  return `HTTP ${response.status}: ${(await response.clone().text()).slice(0, 500)}`;
}

interface ChargesResponse {
  success: boolean;
  charges: Array<{ id: string; name: string; canonicalName: string }>;
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
  ["aggravated battery", /fl-fs-784-045-/],
  ["arson", /fl-fs-806-01-1-/],
  ["petit theft", /fl-fs-812-014-2-f-/],
  ["perjury", /fl-fs-837-02-/],
  ["controlled-substance sale", /fl-fs-893-13-1-a-/],
  ["drug paraphernalia", /fl-fs-893-147-1-/],
  ["elder abuse", /fl-fs-825-102-1-/],
  ["child abuse", /fl-fs-827-03-2-c-/],
  ["adult impregnation of a child", /fl-fs-827-04-3-/],
] as const;
const representativeDefinitions = representativePatterns.flatMap(([kind, pattern]) => {
  const definition = FLORIDA_REVIEWED_DEFINITIONS.find((candidate) =>
    approvedFloridaIds.has(candidate.id) &&
    (pattern.test(candidate.name) || pattern.test(candidate.slug)));
  return definition ? [{ kind, definition }] : [];
});
const locales = ["en", "es", "zh"] as const;
const renamedDefinitions = FLORIDA_REVIEWED_DEFINITIONS.filter(definition =>
  /^(893\.147|825\.102|827\.03|827\.04\(3\))/.test(definition.code));
const officialHeadingGroups = [
  renamedDefinitions.filter(definition => definition.code.startsWith("893.147")),
  renamedDefinitions.filter(definition => definition.code.startsWith("825.102")),
  renamedDefinitions.filter(definition => definition.code.startsWith("827.03")),
  renamedDefinitions.filter(definition => definition.code === "827.04(3)"),
];

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

  it("keeps every reconciled display identity distinct and the official heading searchable", () => {
    expect(renamedDefinitions).toHaveLength(17);
    expect(new Set(renamedDefinitions.map(row => row.name))).toHaveLength(17);
    for (const definition of renamedDefinitions) {
      expect(definition.aliases?.en).toHaveLength(1);
      expect(definition.aliases?.es).toHaveLength(1);
      expect(definition.aliases?.zh).toHaveLength(1);
    }
  });
});

describe.skipIf(!runIntegration)(
  "Florida runtime authority boundary",
  { timeout: LIVE_API_TIMEOUT_MS },
  () => {
  let charges: ChargesResponse;

  beforeAll(async () => {
    const response = await fetch(`${BASE_URL}/api/criminal-charges?jurisdiction=FL&limit=500`);
    expect(response.ok, await responseFailure(response)).toBe(true);
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
    expect(exportResponse.ok, await responseFailure(exportResponse)).toBe(true);
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

  it("returns all reconciled EN/ES/ZH names in the selector and JSON export", async () => {
    const exportedResponse = await fetch(`${BASE_URL}/api/v1/export/charges?jurisdiction=FL`);
    expect(exportedResponse.ok, await responseFailure(exportedResponse)).toBe(true);
    const exported = await exportedResponse.json() as Array<{
      id: string;
      name: string;
      nameEs?: string;
      nameZh?: string;
      searchAliases?: string[];
    }>;
    for (const locale of locales) {
      const response = await fetch(
        `${BASE_URL}/api/criminal-charges?jurisdiction=FL&limit=500&language=${locale}`,
      );
      expect(response.ok, await responseFailure(response)).toBe(true);
      const localized = await response.json() as ChargesResponse;
      for (const definition of renamedDefinitions) {
        const selector = localized.charges.find(charge => charge.id === definition.id);
        expect(selector?.name, `${definition.id}:${locale}`).toBe(
          locale === "en" ? definition.name : definition.names?.[locale],
        );
        expect(selector?.canonicalName).toBe(definition.name);
        const exportedCharge = exported.find(charge => charge.id === definition.id);
        expect(exportedCharge?.name).toBe(definition.name);
        expect(exportedCharge?.nameEs).toBe(definition.names?.es);
        expect(exportedCharge?.nameZh).toBe(definition.names?.zh);
        expect(exportedCharge?.searchAliases).toEqual([
          ...(definition.aliases?.en ?? []),
          ...(definition.aliases?.es ?? []),
          ...(definition.aliases?.zh ?? []),
        ]);
      }
    }
  });

  for (const locale of locales) {
    it(`finds every renamed group by its original ${locale.toUpperCase()} heading in selector and site search`, async () => {
      for (const group of officialHeadingGroups) {
        const heading = group[0]?.aliases?.[locale]?.[0];
        expect(heading).toBeTruthy();
        const selectorResponse = await fetch(
          `${BASE_URL}/api/criminal-charges?jurisdiction=FL&limit=500` +
          `&language=${locale}&search=${encodeURIComponent(heading!)}`,
        );
        expect(selectorResponse.ok, await responseFailure(selectorResponse)).toBe(true);
        const selector = await selectorResponse.json() as ChargesResponse;
        for (const definition of group) {
          expect(selector.charges.some(charge => charge.id === definition.id),
            `${definition.id}:${locale}:selector`).toBe(true);
        }

        const searchResponse = await fetch(
          `${BASE_URL}/api/site-search?q=${encodeURIComponent(heading!)}` +
          `&lang=${locale}&types=charge&jurisdiction=FL&limit=100`,
        );
        expect(searchResponse.ok, await responseFailure(searchResponse)).toBe(true);
        const search = await searchResponse.json() as {
          results: Array<{ document: { id: string } }>;
        };
        for (const definition of group) {
          expect(search.results.some(result =>
            result.document.id === `charge-${definition.id}`),
          `${definition.id}:${locale}:site-search`).toBe(true);
        }
      }
    });
  }

  for (const { kind, definition } of representativeDefinitions) {
    for (const locale of locales) {
      it(`finds the approved ${kind} representative using ${locale} localized search`, async () => {
        const query = locale === "en" ? definition.name : definition.names![locale];
        const response = await fetch(
          `${BASE_URL}/api/site-search?q=${encodeURIComponent(query)}` +
          `&lang=${locale}&types=charge&jurisdiction=FL&limit=100`,
        );
        expect(response.ok, await responseFailure(response)).toBe(true);
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
  },
);