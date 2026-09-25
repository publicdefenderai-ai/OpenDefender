import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { buildCaliforniaBaseline } from "../scripts/data-review/california-verification/baseline";
import batch from "../scripts/data-review/california-verification/batch-one.json";
import { CALIFORNIA_CANONICAL_RECORDS } from "../shared/california-authority";

describe("California verification preparation", () => {
  it("runs the Python extraction safety suite in the existing Vitest CI entry point", () => {
    // Ubuntu CI and the supported macOS workflow both provide python3.
    // A missing interpreter or failing unittest must fail this test, never skip it.
    expect(() => execFileSync("python3", ["-m", "unittest", "discover", "-s",
      "scripts/data-review/california-verification", "-p", "test_*.py"], {
      cwd: process.cwd(), timeout: 20_000, stdio: "pipe",
      env: { ...process.env, PYTHONDONTWRITEBYTECODE: "1" },
    })).not.toThrow();
  }, 25_000);

  it("accounts for 25 records sharing 21 declared statute sources without claiming verification", () => {
    const result = buildCaliforniaBaseline();
    expect(result.records).toHaveLength(25);
    expect(result.sourceRequests).toHaveLength(21);
    expect(result.accounting.newlyVerifiedRows).toBe(0);
    expect(result.records.every(row => row.verificationStatus === "not_yet_verified_in_this_batch")).toBe(true);
    expect(result.sourceRequests.find(row => row.lawCode === "PEN" && row.section === "415")?.chargeIds).toHaveLength(3);
  });

  it("rejects duplicate batch IDs", () => {
    const ids = batch.groups[0].chargeIds;
    const original = ids[1];
    try {
      ids[1] = ids[0];
      expect(() => buildCaliforniaBaseline()).toThrow("25 distinct batch records");
    } finally { ids[1] = original; }
  });

  it("rejects a record that is no longer selectable", () => {
    const record = CALIFORNIA_CANONICAL_RECORDS.find(row => row.canonicalId === batch.groups[0].chargeIds[0])!;
    const original = record.selectable;
    try {
      record.selectable = false;
      expect(() => buildCaliforniaBaseline()).toThrow("no longer selectable");
    } finally { record.selectable = original; }
  });

  it("rejects a source without its exact section identity", () => {
    const record = CALIFORNIA_CANONICAL_RECORDS.find(row => row.canonicalId === batch.groups[0].chargeIds[0])!;
    const source = record.sources.find(row => row.kind === "statute")!;
    const original = source.url;
    try {
      source.url = "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN";
      expect(() => buildCaliforniaBaseline()).toThrow("Unparseable official source");
    } finally { source.url = original; }
  });
});
