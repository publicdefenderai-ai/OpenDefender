import { spawn, spawnSync } from "node:child_process";

const releasePort = "5001";
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const command = process.platform === "win32" ? "npx.cmd" : "npx";

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

const testProcess = spawn(
  command,
  [
    "playwright",
    "test",
    "--config",
    "playwright.release.config.ts",
    "tests/e2e/navigation-accessibility.spec.ts",
    "tests/e2e/export-release-gate.spec.ts",
  ],
  {
    env: {
      ...process.env,
      RELEASE_CHECK_PORT: releasePort,
      PLAYWRIGHT_BASE_URL: `http://127.0.0.1:${releasePort}`,
    },
    stdio: "inherit",
  },
);

testProcess.on("exit", (code, signal) => {
  process.exitCode = signal ? 1 : (code ?? 1);
});