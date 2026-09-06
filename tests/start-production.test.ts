import { afterEach, describe, expect, it, vi } from "vitest";
import { createProductionEnv, runProductionStartup } from "../scripts/start-production.mjs";

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

  it("forces production mode for spawned processes", () => {
    expect(createProductionEnv({ NODE_ENV: "development", PORT: "5000" })).toEqual({
      NODE_ENV: "production",
      PORT: "5000",
    });
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