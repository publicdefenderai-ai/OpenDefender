import { describe, expect, it } from "vitest";
import { getLiveStatuteErrorKey } from "../client/src/lib/live-statute-errors";

describe("live statute error classification", () => {
  it("keeps invalid and missing citations distinct from provider outages", () => {
    expect(getLiveStatuteErrorKey(new Error('400: {"error":"Invalid citation format"}'))).toBe(
      "invalidCitation",
    );
    expect(getLiveStatuteErrorKey(new Error('404: {"error":"Statute not found"}'))).toBe(
      "citationNotFound",
    );
    expect(getLiveStatuteErrorKey(new Error('503: {"error":"Provider unavailable"}'))).toBe(
      "citationFailed",
    );
    expect(getLiveStatuteErrorKey(new Error("Failed to fetch"))).toBe("citationFailed");
  });
});