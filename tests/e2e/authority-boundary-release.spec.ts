import { expect, test } from "@playwright/test";

type JurisdictionBoundary = {
  name: string;
  code: string;
  query: string;
  selectableChargeId: string;
  withheldChargeIds: string[];
};

const boundaries: JurisdictionBoundary[] = [
  {
    name: "Pennsylvania",
    code: "PA",
    query: "assault",
    selectableChargeId: "pa-aggravated-assault",
    withheldChargeIds: [
      "pa-assault-on-peace-officer",
      "pa-bank-robbery",
    ],
  },
  {
    name: "South Carolina",
    code: "SC",
    query: "shoplifting",
    selectableChargeId: "sc-shoplifting",
    withheldChargeIds: [
      "sc-murder-in-the-first-degree",
      "sc-shoplifting-under-2000",
    ],
  },
];

type Charge = { id: string };
type ChargesPayload = {
  success: boolean;
  charges: Charge[];
};
type SearchPayload = {
  success: boolean;
  results: Array<{ document?: { id?: string } }>;
};

const releaseOrigin = new URL(
  process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:5001",
).origin;

async function expectChargePresence(
  charges: Charge[],
  chargeId: string,
  expected: boolean,
  context: string,
) {
  expect(
    charges.some((charge) => charge.id === chargeId),
    `${context}: ${chargeId}`,
  ).toBe(expected);
}

test.describe("authority boundary release gate", () => {
  for (const boundary of boundaries) {
    test(`${boundary.name} keeps withheld authority out of release APIs`, async ({ page }) => {
      const chargesResponse = await page.request.get(
        `/api/criminal-charges?jurisdiction=${boundary.code}&limit=500`,
      );
      expect(chargesResponse.ok()).toBe(true);
      const chargesPayload = await chargesResponse.json() as ChargesPayload;
      expect(chargesPayload.success).toBe(true);

      await expectChargePresence(
        chargesPayload.charges,
        boundary.selectableChargeId,
        true,
        `${boundary.name} charge API`,
      );
      for (const chargeId of boundary.withheldChargeIds) {
        await expectChargePresence(
          chargesPayload.charges,
          chargeId,
          false,
          `${boundary.name} charge API`,
        );
      }

      const exportResponse = await page.request.get(
        `/api/v1/export/charges?jurisdiction=${boundary.code}`,
      );
      expect(exportResponse.ok()).toBe(true);
      const exported = await exportResponse.json() as Charge[];
      await expectChargePresence(
        exported,
        boundary.selectableChargeId,
        true,
        `${boundary.name} export`,
      );
      for (const chargeId of boundary.withheldChargeIds) {
        await expectChargePresence(
          exported,
          chargeId,
          false,
          `${boundary.name} export`,
        );
      }
    });

    test(`${boundary.name} keeps withheld authority out of search and guidance`, async ({ page }) => {
      const searchResponse = await page.request.get(
        `/api/v1/search?q=${encodeURIComponent(boundary.query)}&types=charge&limit=100`,
      );
      expect(searchResponse.ok()).toBe(true);
      const searchPayload = await searchResponse.json() as SearchPayload;

      expect(
        searchPayload.results.some(
          (result) => result.document?.id === `charge-${boundary.selectableChargeId}`,
        ),
      ).toBe(true);
      for (const chargeId of boundary.withheldChargeIds) {
        expect(
          searchPayload.results.some(
            (result) => result.document?.id === `charge-${chargeId}`,
          ),
        ).toBe(false);
      }

      for (const chargeId of boundary.withheldChargeIds) {
        const guidanceResponse = await page.request.post("/api/legal-guidance/rules", {
          headers: {
            // Production API mutations require a same-origin header. Use the
            // release server origin so the test reaches the authority guard
            // rather than failing at the CSRF middleware.
            Origin: releaseOrigin,
          },
          data: {
            jurisdiction: boundary.code,
            charges: [chargeId],
            caseStage: "arrest",
            custodyStatus: "in_custody",
          },
        });
        expect(guidanceResponse.status(), `${boundary.name} guidance: ${chargeId}`).toBe(400);
        const guidance = await guidanceResponse.json() as { requiresReselection?: boolean };
        expect(guidance.requiresReselection, `${boundary.name} guidance: ${chargeId}`).toBe(true);
      }
    });
  }
});