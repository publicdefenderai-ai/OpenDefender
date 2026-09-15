import { PassThrough } from "node:stream";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { runReleaseServer } from "../scripts/release-check/start-production.mjs";

const fixturePath = resolve(
  process.cwd(),
  "scripts/release-check/fixtures/release-server-error.mjs",
);

function captureOutput() {
  const stream = new PassThrough();
  let output = "";
  stream.on("data", (chunk) => {
    output += chunk.toString();
  });
  return { stream, read: () => output };
}

describe("release server error propagation", () => {
  it("allows intentional missing-credential fallback logs", async () => {
    const stdout = captureOutput();
    const stderr = captureOutput();

    const result = await runReleaseServer({
      args: [fixturePath],
      env: {
        ...process.env,
        RELEASE_CHECK_FIXTURE_MODE: "allowed",
      },
      stdout: stdout.stream,
      stderr: stderr.stream,
    });

    expect(result).toMatchObject({
      code: 0,
      releaseCheckFailed: false,
      signal: null,
    });
    expect(stderr.read()).toContain(
      "Anthropic API key not set - AI guidance will use rule-based fallback",
    );
    expect(stderr.read()).not.toContain("failing verification");
  });

  it("fails closed while preserving unexpected server stderr context", async () => {
    const stdout = captureOutput();
    const stderr = captureOutput();

    const result = await runReleaseServer({
      args: [fixturePath],
      env: {
        ...process.env,
        RELEASE_CHECK_FIXTURE_MODE: "unexpected",
      },
      stdout: stdout.stream,
      stderr: stderr.stream,
    });

    expect(result.code).toBe(1);
    expect(result.releaseCheckFailed).toBe(true);
    expect(stderr.read()).toContain(
      "[ERROR] release fixture database connection failed: useful stderr context",
    );
    expect(stderr.read()).toContain(
      "[release-check] Production server emitted an unexpected error log; failing verification.",
    );
  });

  it("fails closed while preserving a server spawn error", async () => {
    const stdout = captureOutput();
    const stderr = captureOutput();
    const missingCommand = resolve(
      process.cwd(),
      "scripts/release-check/fixtures/release-server-does-not-exist",
    );

    const result = await runReleaseServer({
      command: missingCommand,
      args: [],
      env: {
        NODE_ENV: "test",
        RELEASE_CHECK: "true",
      },
      stdout: stdout.stream,
      stderr: stderr.stream,
    });

    expect(result).toMatchObject({
      code: 1,
      releaseCheckFailed: true,
      signal: null,
    });
    expect(stderr.read()).toContain(
      `[release-check] Failed to start production server: spawn ${missingCommand} ENOENT`,
    );
  });
});