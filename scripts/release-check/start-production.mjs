import { spawn } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";

// These values exist solely to prove that the production artifact honors the
// required startup checks. They are intentionally not production credentials.
const releaseCheckEnv = {
  NODE_ENV: "production",
  PORT: process.env.PORT ?? "5000",
  SESSION_SECRET: "release-gate-session-secret-not-for-production",
  TURNSTILE_SECRET_KEY: "release-gate-turnstile-secret-not-for-production",
  TURNSTILE_SITE_KEY: "release-gate-turnstile-site-key-not-for-production",
  DATABASE_URL: "postgresql://release_check:release_check@127.0.0.1:6543/release_check",
  RELEASE_CHECK: "true",
  DOTENV_CONFIG_PATH: join(tmpdir(), "opendefender-release-check-no-env"),
};

const server = spawn(process.execPath, ["dist/index.js"], {
  env: releaseCheckEnv,
  stdio: "inherit",
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.kill(signal));
}

server.on("exit", (code, signal) => {
  if (signal) {
    process.exitCode = 1;
    return;
  }
  process.exitCode = code ?? 1;
});