import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

let server;

export function createProductionEnv(env = process.env) {
  return { ...env, NODE_ENV: "production" };
}

function startServer() {
  server = spawn(process.execPath, ["dist/index.js"], {
    env: createProductionEnv(),
    stdio: "inherit",
  });
  server.on("error", (error) => {
    console.error("[production-start] Failed to start HTTP server:", error);
    process.exitCode = 1;
  });
  server.on("exit", (code, signal) => {
    process.exitCode = signal ? 1 : (code ?? 1);
  });
}

for (const shutdownSignal of ["SIGINT", "SIGTERM"]) {
  process.on(shutdownSignal, () => {
    server?.kill(shutdownSignal);
  });
}

export function runProductionStartup({
  launch = startServer,
} = {}) {
  // Startup is not permission to refresh authority or migrate a database.
  // Existing seed scripts are separate, explicitly approved maintenance commands.
  launch();
  console.log(
    "[production-start] HTTP server starting; automatic authority imports and schema changes are disabled.",
  );
  return true;
}

if (fileURLToPath(import.meta.url) === resolve(process.argv[1] ?? "")) {
  runProductionStartup();
}