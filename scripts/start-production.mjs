import { spawn } from "node:child_process";

const seedScripts = [
  "dist/seed-new-york-source-database.js",
  "dist/seed-texas-source-database.js",
  "dist/seed-florida-source-database.js",
  "dist/seed-pennsylvania-source-database.js",
  "dist/seed-south-carolina-source-database.js",
  "dist/seed-illinois-source-database.js",
];
let child;

function runSeed(index) {
  child = spawn(process.execPath, [seedScripts[index]], {
    env: process.env,
    stdio: "inherit",
  });
  child.on("exit", (code, signal) => {
    if (signal || code !== 0) {
      process.exitCode = signal ? 1 : (code ?? 1);
      return;
    }
    if (index + 1 < seedScripts.length) {
      runSeed(index + 1);
      return;
    }

    const server = spawn(process.execPath, ["dist/index.js"], {
      env: process.env,
      stdio: "inherit",
    });
    for (const serverSignal of ["SIGINT", "SIGTERM"]) {
      process.on(serverSignal, () => server.kill(serverSignal));
    }
    server.on("exit", (serverCode, serverSignal) => {
      process.exitCode = serverSignal ? 1 : (serverCode ?? 1);
    });
  });
}

for (const seedSignal of ["SIGINT", "SIGTERM"]) {
  process.on(seedSignal, () => child?.kill(seedSignal));
}

runSeed(0);