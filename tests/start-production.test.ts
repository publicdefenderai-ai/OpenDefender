import { describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { createProductionEnv, runProductionStartup } from "../scripts/start-production.mjs";

describe("recovery-safe production startup", () => {
  it("starts only HTTP and ignores old seed injection options", async () => {
    const launch = vi.fn();
    const seed = vi.fn(() => { throw new Error("must never execute"); });
    expect(runProductionStartup({ launch, ...{ seed } })).toBe(true);
    await Promise.resolve();
    expect(launch).toHaveBeenCalledOnce();
    expect(seed).not.toHaveBeenCalled();
  });

  it("propagates a failed HTTP launch instead of declaring success", () => {
    expect(() => runProductionStartup({ launch: () => { throw new Error("launch failed"); } }))
      .toThrow("launch failed");
  });

  it("forces production mode without changing other settings", () => {
    expect(createProductionEnv({ NODE_ENV: "development", PORT: "5000" })).toEqual({
      NODE_ENV: "production", PORT: "5000",
    });
  });

  it("contains only the HTTP process spawn, not seed or schema commands", () => {
    const source = readFileSync("scripts/start-production.mjs", "utf8");
    expect(source.match(/spawn\(/g)).toHaveLength(1);
    expect(source).toContain('["dist/index.js"]');
    expect(source).not.toMatch(/dist\/seed-|db:push|drizzle-kit/);
  });

  it("post-merge hold succeeds without access to external executables or credentials", () => {
    // Bash built-ins only. An attempted npm/git/test/migration command fails with PATH empty.
    const result = spawnSync("/bin/bash", ["scripts/post-merge.sh"], {
      env: { PATH: "" }, encoding: "utf8",
    });
    expect(result.status).toBe(0);
    expect(result.stdout).toContain("automatic setup is disabled");
    expect(result.stderr).toBe("");
  });
});
