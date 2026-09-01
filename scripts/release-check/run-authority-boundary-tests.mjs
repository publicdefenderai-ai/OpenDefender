import { spawnSync } from "node:child_process";

const seedCommands = [
  ["db:seed:pennsylvania", "Pennsylvania"],
  ["db:seed:south-carolina", "South Carolina"],
];

const boundaryTestFiles = [
  "tests/pennsylvania-runtime-boundary.integration.test.ts",
  "tests/south-carolina-runtime-boundary.integration.test.ts",
];

function assertDevelopmentEnvironment() {
  // REPLIT_ENVIRONMENT is a workspace platform label and can be "production"
  // while the development workflow is running. NODE_ENV is the app runtime
  // selector that this command must preserve rather than override.
  if (process.env.NODE_ENV && process.env.NODE_ENV !== "development") {
    throw new Error(
      "Authority boundary validation is development-only; refusing to run outside NODE_ENV=development.",
    );
  }

  const productionMarkers = [
    "REPLIT_DEPLOYMENT",
    "REPLIT_DEPLOYMENT_ID",
    "REPLIT_DEPLOYMENT_URL",
  ];
  const productionMarker = productionMarkers.find((name) => process.env[name]);
  if (productionMarker) {
    throw new Error(
      `Authority boundary validation cannot run in a production environment (${productionMarker}).`,
    );
  }

  if (!process.env.DATABASE_URL) {
    throw new Error(
      "Authority boundary validation requires the development DATABASE_URL; no database was selected.",
    );
  }
}

function runNpm(args, env, label) {
  const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
  const result = spawnSync(npmCommand, args, {
    env,
    stdio: "inherit",
  });

  if (result.error) {
    throw new Error(`${label} failed to start: ${result.error.message}`);
  }
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function main() {
  assertDevelopmentEnvironment();

  const developmentEnv = {
    ...process.env,
    NODE_ENV: "development",
    RUN_PENNSYLVANIA_AUTHORITY_API_TESTS: "1",
    RUN_SOUTH_CAROLINA_AUTHORITY_API_TESTS: "1",
  };

  for (const [script, jurisdiction] of seedCommands) {
    console.log(`Seeding ${jurisdiction} authority from its committed manifest...`);
    runNpm(["run", script], developmentEnv, `${jurisdiction} seed`);
  }

  console.log("Running Pennsylvania and South Carolina runtime boundary suites...");
  runNpm(["exec", "--", "vitest", "run", ...boundaryTestFiles], developmentEnv, "Authority boundary tests");
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}