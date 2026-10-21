import { execFileSync } from "node:child_process";
import { describe, it } from "vitest";

describe("offline correction preparation", () => {
  it("runs the private-output and evidence-integrity checks in the existing CI suite", () => {
    // Do not skip missing Python or failed checks. All fixtures are fictional.
    execFileSync("python3", ["-m", "unittest", "discover", "-s",
      "scripts/data-review/offline-corrections", "-p", "test_*.py"], {
      cwd: process.cwd(), timeout: 20_000, stdio: "pipe",
      env: { PATH: process.env.PATH, PYTHONDONTWRITEBYTECODE: "1" },
    });
  }, 25_000);
});
