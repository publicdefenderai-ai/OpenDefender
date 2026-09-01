import { afterEach, describe, expect, it, vi } from "vitest";
import { runProductionStartup } from "../scripts/start-production.mjs";

describe("production startup", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("starts HTTP even when an authority seed fails", async () => {
    const launch = vi.fn();
    const onFailure = vi.fn();
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const started = runProductionStartup({
      seed: () => {
        throw new Error("simulated seed failure");
      },
      launch,
      onFailure,
    });

    expect(started).toBe(true);
    expect(launch).toHaveBeenCalledOnce();
    await Promise.resolve();
    expect(onFailure).toHaveBeenCalledOnce();
  });

  it("launches HTTP before an asynchronous authority seed completes", async () => {
    const events: string[] = [];
    let finishSeed!: () => void;
    const started = runProductionStartup({
      seed: () =>
        new Promise<void>((resolve) => {
          events.push("seed-started");
          finishSeed = resolve;
        }),
      launch: () => {
        events.push("http-started");
      },
    });

    expect(started).toBe(true);
    expect(events).toEqual(["http-started", "seed-started"]);

    finishSeed();
    await Promise.resolve();
    expect(events).toEqual(["http-started", "seed-started"]);
  });
});