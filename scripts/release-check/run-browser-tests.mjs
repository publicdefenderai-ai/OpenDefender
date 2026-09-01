import { spawn, spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";

const releasePort = "5001";
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const command = process.platform === "win32" ? "npx.cmd" : "npx";
const releaseCheckAdminToken = randomBytes(32).toString("hex");

const buildProcess = spawnSync(npmCommand, ["run", "build"], {
  env: {
    ...process.env,
    NODE_ENV: "production",
  },
  stdio: "inherit",
});

if (buildProcess.error) {
  console.error("Release build failed to start:", buildProcess.error);
  process.exit(1);
}

if (buildProcess.status !== 0) {
  process.exit(buildProcess.status ?? 1);
}

const sourceReadinessProcess = spawnSync(
  process.execPath,
  ["scripts/release-check/check-source-readiness.mjs"],
  {
    env: {
      ...process.env,
      RELEASE_CHECK_ADMIN_TOKEN: releaseCheckAdminToken,
    },
    stdio: "inherit",
  },
);

if (sourceReadinessProcess.error) {
  console.error("Source-readiness release check failed to start:", sourceReadinessProcess.error);
  process.exit(1);
}

if (sourceReadinessProcess.status !== 0) {
  process.exit(sourceReadinessProcess.status ?? 1);
}

const testProcess = spawn(
  command,
  [
    "playwright",
    "test",
    "--config",
    "playwright.release.config.ts",
    "tests/e2e/navigation-accessibility.spec.ts",
    "tests/e2e/export-release-gate.spec.ts",
    "tests/e2e/authority-boundary-release.spec.ts",
    "tests/e2e/source-readiness-gate.spec.ts",
  ],
  {
    env: {
      ...process.env,
      RELEASE_CHECK_PORT: releasePort,
      PLAYWRIGHT_BASE_URL: `http://127.0.0.1:${releasePort}`,
      RELEASE_CHECK_ADMIN_TOKEN: releaseCheckAdminToken,
    },
    stdio: "inherit",
  },
);

testProcess.on("exit", (code, signal) => {
  process.exitCode = signal ? 1 : (code ?? 1);
});