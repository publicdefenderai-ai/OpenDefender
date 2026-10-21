import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("lockfile portability", () => {
  it("does not require Replit-internal package servers outside Replit", () => {
    const lock = JSON.parse(readFileSync("package-lock.json", "utf8"));
    const internalPackages = Object.entries(lock.packages)
      .filter(([, entry]) => {
        const resolved = (entry as { resolved?: string }).resolved;
        if (!resolved || !/^https?:/.test(resolved)) return false;
        const host = new URL(resolved).hostname;
        return host === "package-firewall.replit.internal" || host === "package-firewall.replit.local";
      })
      .map(([name]) => name);
    expect(internalPackages, "Use public registry tarballs with unchanged integrity hashes").toEqual([]);
  });
});
