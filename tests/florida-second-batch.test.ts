import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import d from "../shared/florida-reviewed-data/d.json";
import e from "../shared/florida-reviewed-data/e.json";
import analysisD from "../scripts/data-review/output/florida-reviewed-analysis-d.json";
import analysisE from "../scripts/data-review/output/florida-reviewed-analysis-e.json";
import type { EvidenceBackedChargeDefinition } from "../shared/evidence-backed-charge-batch";
import {
  assembleFloridaReviewedReport,
  FLORIDA_REVIEWED_SOURCE_RECORDS,
  type FloridaReviewedAnalysisEntry,
  type FloridaReviewedSourceCache,
} from "../server/data/florida-reviewed-source-records";

const definitions = [...d, ...e] as EvidenceBackedChargeDefinition[];
const analyses = [...analysisD, ...analysisE] as FloridaReviewedAnalysisEntry[];
const cache = JSON.parse(readFileSync(
  "scripts/data-review/output/florida-batch-source-cache.json", "utf8",
)) as FloridaReviewedSourceCache;
const fixtureTime = new Date(Math.max(...Object.values(cache.documents)
  .map(document => Date.parse(document.retrievedAt))) + 1000);

describe("Florida second cached-source batch", () => {
  it("accounts for supported records in all six priority sections with unique exact identities", () => {
    const approved = new Set(FLORIDA_REVIEWED_SOURCE_RECORDS.map(row => row.chargeId));
    expect(definitions).toHaveLength(21);
    expect(new Set(definitions.map(row => row.code)).size).toBe(definitions.length);
    for (const row of definitions) {
      expect(approved.has(row.id), row.id).toBe(true);
      expect(row.slug).toBe(row.id);
      expect(row.citations[0].citation).toBe(`Fla. Stat. § ${row.code}`);
    }
    for (const section of ["784.045", "806.01", "812.014", "837.02", "893.13", "893.147"]) {
      expect(definitions.some(row => row.code.startsWith(`${section}(`)), section).toBe(true);
    }
  });

  it("turns mismatched public primary citations and URLs into explicit technical holds", () => {
    for (const field of ["citation", "url"] as const) {
      const definition = structuredClone(definitions[0]);
      definition.citations[0][field] += "-mismatch";
      const result = assembleFloridaReviewedReport([definition], analyses, cache, fixtureTime);
      expect(result.report.drafts).toHaveLength(0);
      expect(result.technicalHolds).toEqual([{
        id: definition.id,
        reason: "Public primary citation/code or URL does not exactly match the cited official source",
      }]);
    }
  });

  it("keeps unsupported alternatives separate from their supported siblings", () => {
    expect(e.some(row => row.code === "893.147(4)(a)")).toBe(true);
    expect(e.some(row => row.code === "893.147(4)")).toBe(false);
    expect(e.some(row => row.code === "893.13(6)(b)")).toBe(false);
    const held = analysisE.filter(row => row.status === "held");
    expect(held).toHaveLength(3);
    for (const row of held) {
      expect(definitions.some(definition => definition.id === row.id)).toBe(false);
      expect(FLORIDA_REVIEWED_SOURCE_RECORDS.some(record => record.chargeId === row.id)).toBe(false);
    }
  });
});