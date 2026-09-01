import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const seedScripts = [
  "dist/seed-new-york-source-database.js",
  "dist/seed-texas-source-database.js",
  "dist/seed-florida-source-database.js",
  "dist/seed-pennsylvania-source-database.js",
  "dist/seed-south-carolina-source-database.js",
  "dist/seed-illinois-source-database.js",
  "dist/seed-ohio-source-database.js",
  "dist/seed-georgia-source-database.js",
  "dist/seed-north-carolina-source-database.js",
];
let currentSeed;
let server;

function runSeed(script) {
  return new Promise((resolve, reject) => {
    currentSeed = spawn(process.execPath, [script], {
      env: process.env,
      stdio: "inherit",
    });
    currentSeed.on("error", reject);
    currentSeed.on("exit", (code, signal) => {
      currentSeed = undefined;
      if (signal || code !== 0) {
        reject(new Error(`${script} exited with ${signal ?? `code ${code ?? "unknown"}`}`));
        return;
      }
      resolve();
    });
  });
}

async function seedAuthorityDatabases() {
  for (const script of seedScripts) {
    await runSeed(script);
  }
  console.log(`[production-start] Authority seed refresh completed for ${seedScripts.length} jurisdictions.`);
}

function startServer() {
  server = spawn(process.execPath, ["dist/index.js"], {
    env: process.env,
    stdio: "inherit",
  });
  server.on("error", (error) => {
    console.error("[production-start] Failed to start HTTP server:", error);
    process.exitCode = 1;
  });
  server.on("exit", (code, signal) => {
    if (currentSeed) currentSeed.kill("SIGTERM");
    process.exitCode = signal ? 1 : (code ?? 1);
  });
}

for (const shutdownSignal of ["SIGINT", "SIGTERM"]) {
  process.on(shutdownSignal, () => {
    currentSeed?.kill(shutdownSignal);
    server?.kill(shutdownSignal);
  });
}

export async function runProductionStartup({
  seed = seedAuthorityDatabases,
  launch = startServer,
  onFailure = () => {
    process.exitCode = 1;
  },
} = {}) {
  try {
    await seed();
  } catch (error) {
    console.error("[production-start] Authority seed refresh failed; HTTP server will not start:", error);
    onFailure(error);
    return false;
  }
  launch();
  console.log(
    `[production-start] HTTP server starting after ${seedScripts.length}-jurisdiction authority seed refresh.`,
  );
  return true;
}

if (fileURLToPath(import.meta.url) === resolve(process.argv[1] ?? "")) {
  void runProductionStartup();
}