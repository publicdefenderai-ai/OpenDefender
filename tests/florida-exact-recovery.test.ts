import { describe, expect, it } from "vitest";
import { floridaRecoveryCachePolicy } from "../scripts/data-review/florida-exact-recovery";

describe("Florida exact recovery cache policy", () => {
  it("reuses fresh documents and accepted saved raw responses by default", () => {
    expect(floridaRecoveryCachePolicy([])).toMatchObject({
      refresh: false,
      reuseFreshDocument: true,
      reuseSavedRawResponse: true,
    });
  });

  it("requires network selection when explicit refresh is requested", () => {
    expect(floridaRecoveryCachePolicy(["--refresh"])).toMatchObject({
      refresh: true,
      reuseFreshDocument: false,
      reuseSavedRawResponse: false,
    });
  });

  it("rejects refresh combined with raw reparsing", () => {
    expect(() => floridaRecoveryCachePolicy(["--refresh", "--reparse-raw"]))
      .toThrow("--refresh and --reparse-raw cannot be combined");
  });
});