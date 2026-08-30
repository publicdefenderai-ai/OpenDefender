import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

// These values exist solely to prove that the production artifact honors the
// required startup checks. They are intentionally not production credentials.
const releaseCheckAuthorityManifestFiles = [
  "ny-source-manifest.json",
  "tx-source-manifest.json",
  "fl-source-manifest.json",
  "pa-source-manifest.json",
  "sc-source-manifest.json",
  "il-source-manifest.json",
  "oh-source-manifest.json",
  "ga-source-manifest.json",
];

const releaseCheckAuthoritySelectableChargeIds = [...new Set(
  releaseCheckAuthorityManifestFiles.flatMap((fileName) => {
    const manifestPath = resolve(process.cwd(), "scripts/data-review/output", fileName);
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    if (!Array.isArray(manifest.catalogRecords)) {
      throw new Error(`Release-check authority manifest has no catalog records: ${fileName}`);
    }
    return manifest.catalogRecords
      .filter((record) =>
        (record.disposition === "retain" || record.disposition === "exact_alias_rename") &&
        Array.isArray(record.provisions) &&
        record.provisions.length > 0 &&
        typeof record.chargeId === "string",
      )
      .map((record) => record.chargeId);
  }),
)];

const releaseCheckEnv = {
  NODE_ENV: "production",
  PORT: process.env.PORT ?? "5000",
  SESSION_SECRET: "release-gate-session-secret-not-for-production",
  TURNSTILE_SECRET_KEY: "release-gate-turnstile-secret-not-for-production",
  TURNSTILE_SITE_KEY: "release-gate-turnstile-site-key-not-for-production",
  DATABASE_URL: "postgresql://release_check:release_check@127.0.0.1:6543/release_check",
  RELEASE_CHECK: "true",
  RELEASE_CHECK_AUTHORITY_SELECTABLE_CHARGE_IDS: JSON.stringify(
    releaseCheckAuthoritySelectableChargeIds,
  ),
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