import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";

describe("Ohio seed offline planning", () => {
  it("runs deterministically without database settings or a runtime pilot receipt", () => {
    const env = {
      PATH: process.env.PATH,
      HOME: process.env.HOME,
      TMPDIR: process.env.TMPDIR ?? "/tmp",
      NODE_ENV: "test",
    };
    const run = () => execFileSync(
      process.execPath,
      ["--import", "tsx", "scripts/data-review/seed-ohio-source-database.ts", "--dry-run"],
      { env, encoding: "utf8", timeout: 30_000 },
    );
    const first = run();
    expect(run()).toBe(first);
    expect(JSON.parse(first)).toMatchObject({ jurisdiction: "OH", mode: "dry-run" });
    expect(JSON.parse(first).sources).toBeGreaterThan(0);
  }, 65_000);
});
