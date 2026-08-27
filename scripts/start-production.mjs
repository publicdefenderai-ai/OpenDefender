import { spawn } from "node:child_process";

const seed = spawn(process.execPath, ["dist/seed-new-york-source-database.js"], {
  env: process.env,
  stdio: "inherit",
});

seed.on("exit", (code, signal) => {
  if (signal || code !== 0) {
    process.exitCode = signal ? 1 : (code ?? 1);
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

for (const seedSignal of ["SIGINT", "SIGTERM"]) {
  process.on(seedSignal, () => seed.kill(seedSignal));
}