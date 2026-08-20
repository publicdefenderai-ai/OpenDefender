import { defineConfig, devices } from "@playwright/test";
import { execFileSync } from "node:child_process";

const serverPort = process.env.RELEASE_CHECK_PORT ?? "5001";
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${serverPort}`;

function findSystemChromium(): string | undefined {
  if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH) {
    return process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
  }

  try {
    const executablePath = execFileSync("which", ["chromium"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return executablePath || undefined;
  } catch {
    return undefined;
  }
}

const systemChromium = findSystemChromium();

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 60000,
  retries: 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL,
    headless: true,
    screenshot: "only-on-failure",
    launchOptions: {
      executablePath: systemChromium,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run start:release-check",
    env: {
      ...process.env,
      PORT: serverPort,
    },
    url: baseURL,
    timeout: 60_000,
    reuseExistingServer: false,
  },
});