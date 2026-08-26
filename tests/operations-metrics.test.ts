import { beforeEach, describe, expect, it, vi } from "vitest";

const insert = vi.fn();
const select = vi.fn();

vi.mock("../server/db", () => ({
  db: { insert, select },
}));

describe("privacy-safe provider metrics", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("writes only allowlisted aggregate fields and increments a daily bucket", async () => {
    const onConflictDoUpdate = vi.fn().mockResolvedValue(undefined);
    insert.mockReturnValue({
      values: vi.fn().mockReturnValue({ onConflictDoUpdate }),
    });

    const { recordProviderMetric } = await import("../server/services/operations-metrics");
    await recordProviderMetric({
      provider: "CourtListener",
      operation: "api_request",
      outcome: "timeout",
      durationMs: 8_000,
    });

    const values = insert.mock.results[0].value.values.mock.calls[0][0];
    expect(values).toMatchObject({
      provider: "CourtListener",
      operation: "api_request",
      requestCount: 1,
      successCount: 0,
      failureCount: 1,
      timeoutCount: 1,
      durationTotalMs: 8_000,
      durationMaxMs: 8_000,
      lastOutcome: "timeout",
    });
    expect(Object.keys(values)).not.toEqual(expect.arrayContaining([
      "prompt", "citation", "url", "sessionId", "caseData", "narrative",
    ]));
    expect(onConflictDoUpdate).toHaveBeenCalledOnce();
  });

  it("does not persist invalid timing values", async () => {
    const { recordProviderMetric } = await import("../server/services/operations-metrics");
    await recordProviderMetric({
      provider: "OpenLaws",
      operation: "api_request",
      outcome: "failure",
      durationMs: Number.NaN,
    });

    expect(insert).not.toHaveBeenCalled();
  });

  it("does not persist an unknown provider at runtime", async () => {
    const { recordProviderMetric } = await import("../server/services/operations-metrics");
    await recordProviderMetric({
      provider: "UnexpectedProvider" as never,
      operation: "api_request",
      outcome: "failure",
      durationMs: 10,
    });

    expect(insert).not.toHaveBeenCalled();
  });

  it("summarizes daily rows without exposing internal row metadata", async () => {
    const rows = [
      {
        provider: "CourtListener",
        operation: "api_request",
        bucketStart: new Date("2026-08-26T00:00:00.000Z"),
        requestCount: 4,
        successCount: 3,
        failureCount: 1,
        timeoutCount: 1,
        clientErrorCount: 0,
        cancelledCount: 0,
        durationTotalMs: 4000,
        durationMaxMs: 2000,
        lastOutcome: "timeout",
        updatedAt: new Date(),
      },
    ];
    const orderBy = vi.fn().mockResolvedValue(rows);
    const where = vi.fn().mockReturnValue({ orderBy });
    const from = vi.fn().mockReturnValue({ where });
    select.mockReturnValue({ from });

    const { getProviderMetrics } = await import("../server/services/operations-metrics");
    const report = await getProviderMetrics(7);
    const courtListener = report.providers.find((item) => item.provider === "CourtListener");

    expect(courtListener).toMatchObject({
      requestCount: 4,
      successCount: 3,
      failureCount: 1,
      averageDurationMs: 1000,
      availabilityPercent: 75,
    });
    expect(report.daily[0]).not.toHaveProperty("updatedAt");
    expect(report.days).toBe(7);
  });
});