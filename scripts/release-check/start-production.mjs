import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const releaseCheckAdminToken = process.env.RELEASE_CHECK_ADMIN_TOKEN?.trim();
if (!releaseCheckAdminToken) {
  throw new Error("Release production harness requires its in-memory admin token fixture");
}
if (releaseCheckAdminToken === process.env.ADMIN_TOKEN) {
  throw new Error("Release production harness fixture must not reuse the production admin token");
}

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

// California's authority boundary is typed rather than manifest-backed.
// Keep this release-only fixture in lockstep with the selectable records in
// shared/california-authority.ts; authority-eligibility.ts fails closed when
// a current record is missing here.
const releaseCheckCaliforniaSelectableChargeIds = [
  "ca-murder-in-the-first-degree",
  "ca-murder-in-the-second-degree",
  "ca-voluntary-manslaughter",
  "ca-involuntary-manslaughter",
  "ca-assault-with-deadly-weapon",
  "ca-assault-on-peace-officer",
  "ca-menacing",
  "ca-petty-theft",
  "ca-theft-by-receiving",
  "ca-credit-card-fraud",
  "ca-embezzlement",
  "ca-shoplifting",
  "ca-burglary-in-the-first-degree",
  "ca-burglary-in-the-second-degree",
  "ca-robbery-in-the-first-degree",
  "ca-robbery-in-the-second-degree",
  "ca-carjacking",
  "ca-possession-of-controlled-substance",
  "ca-possession-with-intent-to-distribute",
  "ca-distribution-of-controlled-substance",
  "ca-manufacturing-controlled-substance",
  "ca-possession-of-drug-paraphernalia",
  "ca-maintaining-drug-house",
  "ca-unlawful-carrying-of-weapon",
  "ca-felon-in-possession-of-firearm",
  "ca-discharge-of-firearm-in-city",
  "ca-possession-of-prohibited-weapon",
  "ca-check-fraud",
  "ca-forgery",
  "ca-public-intoxication",
  "ca-vandalism",
  "ca-dui-second-offense",
  "ca-dui-third-offense",
  "ca-reckless-driving",
  "ca-driving-without-license",
  "ca-domestic-battery",
  "ca-fare-evasion",
  "ca-prostitution-solicitation",
  "ca-resisting-arrest",
  "ca-minor-in-possession",
  "ca-false-info-to-police",
  "ca-driving-without-insurance",
  "ca-expired-registration",
  "ca-failure-to-pay-child-support",
  "ca-animal-cruelty-misdemeanor",
  "ca-littering",
  "ca-attempted-murder",
  "ca-attempted-robbery",
  "ca-money-laundering",
  "ca-vehicular-manslaughter-192-c1",
  "ca-vehicular-manslaughter-192-c2",
  "ca-vehicular-manslaughter-192-c3",
  "ca-gross-vehicular-manslaughter-191-5-a",
  "ca-vehicular-manslaughter-191-5-b",
  "ca-assault-240",
  "ca-battery-243-a",
  "ca-rape-261-a2",
  "ca-rape-261-a1",
  "ca-rape-261-a3",
  "ca-rape-261-a4",
  "ca-rape-261-a5",
  "ca-rape-261-a6",
  "ca-rape-261-a7",
  "ca-sexual-penetration-289-a1a",
  "ca-sexual-penetration-289-a1b",
  "ca-sexual-battery-243-4-a",
  "ca-sexual-battery-243-4-e1",
  "ca-unlawful-sexual-intercourse-261-5-b",
  "ca-unlawful-sexual-intercourse-261-5-c",
  "ca-unlawful-sexual-intercourse-261-5-d",
  "ca-lewd-act-child-288-a",
  "ca-lewd-act-child-288-c1",
  "ca-grand-theft-487-a",
  "ca-grand-theft-agricultural-487-b1a",
  "ca-grand-theft-firearm-487-d2",
  "ca-identity-theft-530-5-a",
  "ca-identity-theft-530-5-c1",
  "ca-insurance-fraud-550-a1",
  "ca-insurance-fraud-550-b1",
  "ca-computer-crime-502-c1",
  "ca-computer-crime-502-c5",
  "ca-disturbing-the-peace-415-1",
  "ca-disturbing-the-peace-415-2",
  "ca-disturbing-the-peace-415-3",
  "ca-dui-23152-a",
  "ca-dui-23152-f",
  "ca-dui-23152-g",
  "ca-dui-23152-b",
  "ca-failure-to-appear-1320-a",
  "ca-failure-to-appear-1320-b",
  "ca-protective-order-273-6-a",
  "ca-open-container-23222-a",
  "ca-open-container-23222-b",
  "ca-indecent-exposure-314-1",
  "ca-illegal-fireworks-12677",
  "ca-conspiracy-182-a1",
  "ca-accessory-after-the-fact-32",
  "ca-criminal-solicitation-653f-a",
  "ca-criminal-solicitation-653f-b",
];

const releaseCheckAuthoritySelectableChargeIds = [...new Set([
  ...releaseCheckAuthorityManifestFiles.flatMap((fileName) => {
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
  ...releaseCheckCaliforniaSelectableChargeIds,
])];

const releaseCheckEnv = {
  NODE_ENV: "production",
  PORT: process.env.PORT ?? "5000",
  SESSION_SECRET: "release-gate-session-secret-not-for-production",
  TURNSTILE_SECRET_KEY: "release-gate-turnstile-secret-not-for-production",
  TURNSTILE_SITE_KEY: "release-gate-turnstile-site-key-not-for-production",
  ADMIN_TOKEN: releaseCheckAdminToken,
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