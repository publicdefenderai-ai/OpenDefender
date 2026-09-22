import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import e from "../shared/florida-reviewed-data/e.json";
import f from "../shared/florida-reviewed-data/f.json";
import audit from "../scripts/data-review/output/florida-eyeball-review-reconciliation-audit.json";

const hashJson = (value: unknown) =>
  createHash("sha256").update(JSON.stringify(value)).digest("hex");

describe("Florida eyeball-review reconciliation", () => {
  it("binds all ten verbatim dispositions to the reviewed record and evidence hashes", () => {
    expect(audit.items).toHaveLength(10);
    expect(new Set(audit.items.map(item =>
      `${item.priority}|${item.reviewedRecordId}`)).size).toBe(10);
    expect(audit.items.every(item => item.appliedAction === "split")).toBe(true);
    expect(audit.policy.legalApprovalClaimed).toBe(false);
    expect(audit.sourceReview.sha256).toBe(
      createHash("sha256").update(readFileSync(audit.sourceReview.path)).digest("hex"),
    );
    for (const item of audit.items) {
      expect(item.verbatimDecision.decision).not.toBe("");
      expect(item.verbatimDecision.notes).not.toBe("");
      expect(item.originalBinding.recordHash).toMatch(/^[a-f0-9]{64}$/);
      expect(item.originalBinding.evidenceHash).toMatch(/^[a-f0-9]{64}$/);
      expect(item.originalBinding.bindingHash).toMatch(/^[a-f0-9]{64}$/);
    }
    expect(audit.items.find(item => item.priority === 5)?.verbatimDecision.checkbox).toBeNull();
    expect(audit.items.find(item => item.priority === 5)?.verbatimDecision.decision)
      .toBe("Split per the more detailed answers above.");
  });

  it("maps to existing records without adding duplicate catalog identities", () => {
    const definitions = [...e, ...f];
    const definitionById = new Map(definitions.map(row => [row.id, row]));
    const mappings = audit.items.flatMap(item => item.catalogMappings)
      .filter(mapping => mapping.status === "existing");
    expect(audit.policy.recordsAdded).toBe(0);
    for (const mapping of mappings) {
      const definition = definitionById.get(mapping.id!);
      expect(definition?.code).toBe(mapping.code);
      expect(mapping.reconciledRecordHash).toBe(hashJson(definition));
    }
  });

  it("keeps unsupported branches held and preserves the corrected impregnation scope", () => {
    expect(audit.remainingHolds.map(row => row.code)).toEqual(["893.147(7)", "827.04(1)"]);
    const impregnation = audit.items.find(item => item.priority === 10)!
      .catalogMappings.find(mapping => mapping.code === "827.04(3)")!;
    expect(impregnation.status).toBe("existing");
    expect(impregnation.displayNames?.en).toContain("age 21 or older");
    expect(audit.policy.item10).toContain("not copied as law");
  });
});