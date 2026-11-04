// Owner-approved disposable PostgreSQL only. Never load dotenv or app credentials.
import { spawnSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

if (!process.argv.includes("--approve-isolated-writes")) {
  throw new Error("Explicit owner approval required: --approve-isolated-writes");
}
const root = process.cwd();
mkdirSync("generated-artifacts", { recursive: true });
const dir = mkdtempSync(path.join(root, "generated-artifacts/ca-pg-"));
const socket = path.join(dir, "s");
mkdirSync(socket);
writeFileSync(path.join(dir, "DISPOSABLE"), "California public references and synthetic fixtures only\n");
const env = {
  PATH: process.env.PATH, HOME: dir, LANG: "C.UTF-8", TZ: "UTC",
  CA_REHEARSAL_SOCKET: socket, CA_REHEARSAL_OUTPUT: dir,
};
function run(command, args) {
  const result = spawnSync(command, args, { env, stdio: "inherit", cwd: root });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} exited ${result.status}`);
}
let started = false;
try {
  run("initdb", ["-D", path.join(dir, "data"), "-U", "ca_rehearsal", "-A", "trust", "--no-locale", "--encoding=UTF8"]);
  run("pg_ctl", ["-D", path.join(dir, "data"), "-l", path.join(dir, "postgres.log"),
    "-o", `-k ${socket} -h '' -p 55483 -c fsync=on -c synchronous_commit=on`, "-w", "start"]);
  started = true;
  run(process.execPath, [path.join(root, "node_modules/vitest/vitest.mjs"), "run",
    "tests/california-import-postgres.test.ts", "--maxWorkers=1", "--reporter=default",
    "--reporter=json", `--outputFile=${path.join(dir, "vitest-results.json")}`,
    ...(process.argv.includes("--scenario")
      ? ["--testNamePattern", process.argv[process.argv.indexOf("--scenario") + 1] ?? ""]
      : [])]);
} finally {
  if (started) run("pg_ctl", ["-D", path.join(dir, "data"), "-m", "fast", "-w", "stop"]);
  console.log(`Isolated rehearsal artifacts: ${path.relative(root, dir)}`);
}
