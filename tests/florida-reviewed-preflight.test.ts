import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import {
  inspectFloridaReviewedPreflight,
  type FloridaReviewedPreflightInputs,
} from "../scripts/data-review/florida-reviewed-preflight";

const hashJson = (value: unknown) =>
  createHash("sha256").update(JSON.stringify(value)).digest("hex");
const hashText = (value: string) =>
  createHash("sha256").update(value).digest("hex");
const now = new Date("2026-09-20T00:00:00.000Z");

function fixture(): FloridaReviewedPreflightInputs {
  const text = "999.001\nExample offense\n—A person commits the example offense.";
  const contentHash = hashText(text);
  const retrievedAt = "2026-09-19T00:00:00.000Z";
  const sourceKey = "fl:statute:999.001";
  const report = {
    schemaVersion: 1,
    kind: "florida_source_first_review",
    drafts: [{
      id: "fl-fs-example",
      requiredDependencies: [{ sourceKey, role: "offense", contentHash }],
    }],
    sourceEvidence: {
      [sourceKey]: {
        sourceKey,
        section: "999.001",
        text,
        contentHash,
        retrievedAt,
      },
    },
  };
  const eligibility = {
    schemaVersion: 1,
    reportHash: hashJson(report),
    decisions: [],
  };
  const receipt = {
    schemaVersion: 1,
    reportHash: hashJson(report),
    eligibilityHash: hashJson(eligibility),
    checkedAt: "2026-09-19T01:00:00.000Z",
    expiresAt: "2026-09-26T00:00:00.000Z",
    documents: [{ sourceKey, contentHash, retrievedAt }],
  };
  return {
    report,
    eligibility,
    receipt,
    cache: {
      schemaVersion: 1,
      jurisdiction: "FL",
      documents: {
        "999.001": { section: "999.001", text, contentHash, retrievedAt },
      },
    },
  };
}

describe("Florida reviewed evidence freshness preflight", () => {
  it("leaves unchanged fresh evidence ready and reports the actual expiration", () => {
    const result = inspectFloridaReviewedPreflight(fixture(), now);
    expect(result.ok).toBe(true);
    expect(result.expiresAt).toBe("2026-09-26T00:00:00.000Z");
    expect(result.dueBefore).toBe("2026-09-24T00:00:00.000Z");
    expect(result.dependencies).toMatchObject({
      requiringRetrieval: [],
      missing: [],
      hashDrift: [],
      stale: [],
      reassemblyRequired: [],
    });
  });

  it("requires a reviewed reassembly receipt for newer retrieval with the same hash", () => {
    const value = fixture();
    (value.cache as any).documents["999.001"].retrievedAt =
      "2026-09-20T00:00:00.000Z";
    const result = inspectFloridaReviewedPreflight(value, now);
    expect(result.ok).toBe(false);
    expect(result.dependencies.reassemblyRequired).toEqual(["999.001"]);
    expect(result.dependencies.requiringRetrieval).toEqual([]);
    expect(result.actions.join(" ")).toContain("explicitly review and activate");
  });

  it("holds a changed cache hash", () => {
    const value = fixture();
    const changed = "changed official body";
    (value.cache as any).documents["999.001"].text = changed;
    (value.cache as any).documents["999.001"].contentHash = hashText(changed);
    const result = inspectFloridaReviewedPreflight(value, now);
    expect(result.ok).toBe(false);
    expect(result.dependencies.hashDrift).toEqual(["999.001"]);
    expect(result.dependencies.reassemblyRequired).toEqual([]);
  });

  it("reports a missing cache dependency for selective retrieval", () => {
    const value = fixture();
    delete (value.cache as any).documents["999.001"];
    const result = inspectFloridaReviewedPreflight(value, now);
    expect(result.ok).toBe(false);
    expect(result.dependencies.missing).toEqual(["999.001"]);
    expect(result.dependencies.requiringRetrieval).toEqual(["999.001"]);
  });

  it("fails when expiration is reached or enters the 48-hour lead", () => {
    const due = inspectFloridaReviewedPreflight(
      fixture(), new Date("2026-09-24T00:00:00.000Z"),
    );
    expect(due.ok).toBe(false);
    expect(due.dueWithinLead).toBe(true);

    const expired = inspectFloridaReviewedPreflight(
      fixture(), new Date("2026-09-26T00:00:00.000Z"),
    );
    expect(expired.ok).toBe(false);
    expect(expired.expiresAt).toBe("2026-09-26T00:00:00.000Z");
  });

  it("fails closed for a tampered metadata binding", () => {
    const value = fixture();
    (value.eligibility as any).reportHash = "0".repeat(64);
    const result = inspectFloridaReviewedPreflight(value, now);
    expect(result.status).toBe("invalid");
    expect(result.metadataErrors).toContain(
      "eligibility reportHash does not bind the actual report",
    );
  });
});