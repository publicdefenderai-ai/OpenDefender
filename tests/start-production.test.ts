import { afterEach, describe, expect, it, vi } from "vitest";
import { runProductionStartup } from "../scripts/start-production.mjs";

describe("production startup authority gate", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("does not launch HTTP when an authority seed fails", async () => {
    const launch = vi.fn();
    const onFailure = vi.fn();
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const started = await runProductionStartup({
      seed: async () => {
        throw new Error("simulated seed failure");
      },
      launch,
      onFailure,
    });

    expect(started).toBe(false);
    expect(launch).not.toHaveBeenCalled();
    expect(onFailure).toHaveBeenCalledOnce();
  });

  it("launches HTTP only after every authority seed succeeds", async () => {
    const events: string[] = [];
    const started = await runProductionStartup({
      seed: async () => {
        events.push("seed-complete");
      },
      launch: () => {
        events.push("http-started");
      },
    });

    expect(started).toBe(true);
    expect(events).toEqual(["seed-complete", "http-started"]);
  });
});