import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import type { EvidenceBackedChargeDefinition } from "../../shared/evidence-backed-charge-batch";

const rows: EvidenceBackedChargeDefinition[] = JSON.parse(readFileSync("shared/florida-legacy-property.json","utf8"));
for (const language of ["en", "es", "zh"] as const) {
  test(`Florida selector serves the six existing property identities with corrected ${language} content`, async ({ request }) => {
    const response = await request.get("/api/criminal-charges", { params: {jurisdiction:"FL",language,limit:500} });
    expect(response.ok()).toBe(true);
    const { charges } = await response.json();
    for (const row of rows) {
      const selected = charges.filter((charge: {id:string}) => charge.id === row.id);
      expect(selected).toHaveLength(1);
      expect(selected[0]).toMatchObject({code: row.code, citation: row.citations[0].citation,
        description:row.text[language].plainSummary, maxPenalty:row.text[language].degreeContext});
    }
  });
}
