import { spawn } from "node:child_process";
import { createServer } from "node:net";
import {
  cpSync,
  existsSync,
  mkdtempSync,
  mkdirSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const adminToken = process.env.RELEASE_CHECK_ADMIN_TOKEN;
if (!adminToken) {
  throw new Error("Release source-readiness check requires its in-memory admin token fixture");
}

const artifactPath = resolve(process.cwd(), "dist/index.js");
if (!existsSync(artifactPath)) {
  throw new Error(`Release source-readiness check could not find the production artifact: ${artifactPath}`);
}

const sourceManifestFiles = [
  "fl-source-manifest.json",
  "ga-source-manifest.json",
  "il-source-manifest.json",
  "ny-source-manifest.json",
  "oh-source-manifest.json",
  "pa-source-manifest.json",
  "sc-source-manifest.json",
  "tx-source-manifest.json",
];

const sourceSeedFiles = [
  "seed-california-source-database.ts",
  "seed-florida-source-database.ts",
  "seed-georgia-source-database.ts",
  "seed-illinois-source-database.ts",
  "seed-new-york-source-database.ts",
  "seed-ohio-source-database.ts",
  "seed-pennsylvania-source-database.ts",
  "seed-south-carolina-source-database.ts",
  "seed-texas-source-database.ts",
];

const expectedJurisdictions = ["CA", "FL", "GA", "IL", "NY", "OH", "PA", "SC", "TX"];
const expectedReportKeys = [
  "target",
  "jurisdictions",
  "belowTargetJurisdictions",
  "nextHighestValueCoverageTargets",
];
const expectedRowKeys = [
  "jurisdiction",
  "source",
  "manifestGeneratedAt",
  "catalogRows",
  "selectableRows",
  "withheldRows",
  "rowsWithExplicitWithheldReason",
  "catalogAccountingRate",
  "rowsWithOfficialResponse",
  "officialResponseRate",
  "officialResponsePercentage",
  "publishableRate",
  "coveragePercentage",
  "selectableCoveragePercentage",
  "sources",
  "snapshots",
  "links",
  "officialSourceAvailability",
  "gapBreakdown",
  "gapCounts",
  "staleRows",
  "status",
  "blocker",
  "manifestPath",
  "seedScriptPath",
];

function sortedKeys(value) {
  return Object.keys(value).sort();
}

function releaseEnvironment(port) {
  return {
    NODE_ENV: "production",
    PORT: String(port),
    ADMIN_TOKEN: adminToken,
    SESSION_SECRET: "release-gate-session-secret-not-for-production",
    TURNSTILE_SECRET_KEY: "release-gate-turnstile-secret-not-for-production",
    TURNSTILE_SITE_KEY: "release-gate-turnstile-site-key-not-for-production",
    DATABASE_URL: "postgresql://release_check:release_check@127.0.0.1:6543/release_check",
    RELEASE_CHECK: "true",
    RELEASE_CHECK_AUTHORITY_SELECTABLE_CHARGE_IDS: "[]",
    DOTENV_CONFIG_PATH: join(tmpdir(), "opendefender-release-check-no-env"),
  };
}

async function findFreePort() {
  return await new Promise((resolvePort, reject) => {
    const server = createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      if (!address || typeof address === "string") {
        server.close();
        reject(new Error("Could not determine a free release-check port"));
        return;
      }
      server.close((error) => {
        if (error) reject(error);
        else resolvePort(address.port);
      });
    });
  });
}

function describeChildFailure(output) {
  const trimmed = output.trim();
  return trimmed ? `\n${trimmed}` : "";
}

async function startArtifact(cwd, expectedStatus) {
  const port = await findFreePort();
  const child = spawn(process.execPath, [artifactPath], {
    cwd,
    env: releaseEnvironment(port),
    stdio: ["ignore", "pipe", "pipe"],
  });
  let output = "";
  const capture = (chunk) => {
    output = `${output}${chunk.toString()}`.slice(-12_000);
  };
  child.stdout.on("data", capture);
  child.stderr.on("data", capture);

  const url = `http://127.0.0.1:${port}/api/admin/source-coverage`;
  let response;
  let lastError;
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (child.exitCode !== null) {
      throw new Error(
        `Production artifact exited before source-readiness response (code ${child.exitCode}).` +
          describeChildFailure(output),
      );
    }
    try {
      response = await fetch(url, {
        headers: { "x-admin-api-key": adminToken },
      });
      if (response.status === expectedStatus) break;
      lastError = new Error(`expected HTTP ${expectedStatus}, received HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolveDelay) => setTimeout(resolveDelay, 250));
  }

  if (!response || response.status !== expectedStatus) {
    throw new Error(
      `Production artifact did not return the expected source-readiness status: ${
        lastError?.message ?? "no response"
      }.` + describeChildFailure(output),
    );
  }

  return {
    response,
    stop: () => stopArtifact(child),
  };
}

async function stopArtifact(child) {
  if (child.exitCode !== null) return;
  await new Promise((resolveStop) => {
    const forceStop = setTimeout(() => {
      child.kill("SIGKILL");
    }, 5_000);
    child.once("exit", () => {
      clearTimeout(forceStop);
      resolveStop();
    });
    child.kill("SIGTERM");
  });
}

function makeFailureFixture({ missingManifest, missingSeed }) {
  const fixtureRoot = mkdtempSync(join(tmpdir(), "opendefender-release-source-readiness-"));
  const outputRoot = join(fixtureRoot, "scripts", "data-review", "output");
  const seedRoot = join(fixtureRoot, "scripts", "data-review");
  const committedOutputRoot = resolve(process.cwd(), "scripts/data-review/output");
  const committedSeedRoot = resolve(process.cwd(), "scripts/data-review");

  mkdirSync(seedRoot, { recursive: true });
  cpSync(committedOutputRoot, outputRoot, { recursive: true });
  for (const seedFile of sourceSeedFiles) {
    cpSync(join(committedSeedRoot, seedFile), join(seedRoot, seedFile));
  }

  if (missingManifest) {
    rmSync(join(outputRoot, missingManifest));
  }
  if (missingSeed) {
    rmSync(join(seedRoot, missingSeed));
  }

  return fixtureRoot;
}

async function checkSuccessfulReadiness() {
  const server = await startArtifact(process.cwd(), 200);
  try {
    const body = await server.response.json();
    if (body.success !== true) {
      throw new Error("Authenticated source-readiness response did not report success");
    }
    if (sortedKeys(body).join(",") !== [...expectedReportKeys, "success"].sort().join(",")) {
      throw new Error("Authenticated source-readiness response has an unexpected top-level envelope");
    }
    if (
      JSON.stringify(body.jurisdictions?.map((row) => row.jurisdiction)) !==
      JSON.stringify(expectedJurisdictions)
    ) {
      throw new Error("Authenticated source-readiness response has an unexpected jurisdiction set");
    }
    for (const row of body.jurisdictions) {
      if (sortedKeys(row).join(",") !== expectedRowKeys.sort().join(",")) {
        throw new Error(`Source-readiness row for ${row.jurisdiction} has an unexpected envelope`);
      }
    }
  } finally {
    await server.stop();
  }
}

async function checkGenericFailure(fixtureRoot, description) {
  const server = await startArtifact(fixtureRoot, 500);
  try {
    const body = await server.response.json();
    const expected = {
      success: false,
      error: "Source coverage report is unavailable",
    };
    if (JSON.stringify(body) !== JSON.stringify(expected)) {
      throw new Error(`${description} returned an unsafe source-readiness error envelope`);
    }
    if (body.stack !== undefined) {
      throw new Error(`${description} leaked a stack property in the source-readiness response`);
    }
  } finally {
    await server.stop();
  }
}

async function main() {
  await checkSuccessfulReadiness();

  const missingManifestFixture = makeFailureFixture({
    missingManifest: "fl-source-manifest.json",
  });
  try {
    await checkGenericFailure(missingManifestFixture, "Missing-manifest release fixture");
  } finally {
    rmSync(missingManifestFixture, { recursive: true, force: true });
  }

  const missingSeedFixture = makeFailureFixture({
    missingSeed: "seed-texas-source-database.ts",
  });
  try {
    await checkGenericFailure(missingSeedFixture, "Missing-seed release fixture");
  } finally {
    rmSync(missingSeedFixture, { recursive: true, force: true });
  }

  console.log("Verified bundled source-readiness success and generic manifest/seed failure envelopes.");
}

try {
  await main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}