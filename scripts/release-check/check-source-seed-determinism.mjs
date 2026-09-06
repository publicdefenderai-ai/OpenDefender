import { spawnSync } from "node:child_process";

const seedCommands = [
  {
    script: "db:seed:california",
    jurisdiction: "California",
    args: ["--dry-run", "--imported-at", "1970-01-01T00:00:00.000Z"],
  },
  { script: "db:seed:florida", jurisdiction: "Florida", args: ["--dry-run"] },
  { script: "db:seed:georgia", jurisdiction: "Georgia", args: ["--dry-run"] },
  { script: "db:seed:illinois", jurisdiction: "Illinois", args: ["--dry-run"] },
  { script: "db:seed:new-york", jurisdiction: "New York", args: ["--dry-run"] },
  { script: "db:seed:north-carolina", jurisdiction: "North Carolina", args: ["--dry-run"] },
  { script: "db:seed:ohio", jurisdiction: "Ohio", args: ["--dry-run"] },
  { script: "db:seed:pennsylvania", jurisdiction: "Pennsylvania", args: ["--dry-run"] },
  {
    script: "db:seed:south-carolina",
    jurisdiction: "South Carolina",
    args: ["--dry-run"],
  },
  { script: "db:seed:texas", jurisdiction: "Texas", args: ["--dry-run"] },
];

function dryRunEnvironment() {
  const env = { ...process.env };
  for (const name of Object.keys(env)) {
    if (name === "DATABASE_URL" || name === "NEON_DATABASE_URL" || name.startsWith("PG")) {
      delete env[name];
    }
  }
  return env;
}

function runDryRun({ script, jurisdiction, args }) {
  const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
  const result = spawnSync(npmCommand, ["run", script, "--", ...args], {
    env: dryRunEnvironment(),
    encoding: "buffer",
    stdio: ["ignore", "pipe", "pipe"],
  });

  if (result.error) {
    throw new Error(`${jurisdiction} source seed dry-run failed to start: ${result.error.message}`);
  }
  if (result.status !== 0) {
    const stderr = result.stderr?.toString("utf8").trim();
    throw new Error(
      `${jurisdiction} source seed dry-run failed with exit code ${result.status ?? "unknown"}.${
        stderr ? `\n${stderr}` : ""
      }`,
    );
  }

  return result.stdout;
}

function firstDifference(left, right) {
  const length = Math.min(left.length, right.length);
  for (let index = 0; index < length; index += 1) {
    if (left[index] !== right[index]) return index;
  }
  return left.length === right.length ? -1 : length;
}

function main() {
  for (const command of seedCommands) {
    const firstOutput = runDryRun(command);
    const secondOutput = runDryRun(command);
    const difference = firstDifference(firstOutput, secondOutput);

    if (difference !== -1) {
      throw new Error(
        `${command.jurisdiction} source seed dry-run is not deterministic: ` +
          `the two outputs differ byte-for-byte at byte ${difference} ` +
          `(${firstOutput.length} bytes vs ${secondOutput.length} bytes).`,
      );
    }

    console.log(`${command.jurisdiction}: deterministic dry-run output (${firstOutput.length} bytes)`);
  }

  console.log(`Verified deterministic dry-run output for ${seedCommands.length} jurisdictions.`);
}

try {
  main();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}