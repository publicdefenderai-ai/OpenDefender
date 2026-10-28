import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Import configuration only: never invoke Drizzle CLI or a database client.
const primary = "postgresql://dummy:dummy@primary.invalid:5432/test";
const legacy = "postgresql://dummy:dummy@legacy.invalid:5432/test";

describe("schema-tool database URL precedence", () => {
  beforeEach(() => {
    vi.resetModules();
    for (const key of [
      "DATABASE_URL", "NEON_DATABASE_URL",
      "PGHOST", "PGPORT", "PGUSER", "PGPASSWORD", "PGDATABASE",
    ]) vi.stubEnv(key, undefined);
  });
  afterEach(() => { vi.unstubAllEnvs(); });

  async function configuredUrl() {
    const { default: config } = await import("../drizzle.config");
    return (config.dbCredentials as { url: string }).url;
  }

  it("prefers DATABASE_URL when both URL settings exist", async () => {
    vi.stubEnv("DATABASE_URL", primary);
    vi.stubEnv("NEON_DATABASE_URL", legacy);
    expect(await configuredUrl()).toBe(primary);
  });

  it("accepts DATABASE_URL by itself", async () => {
    vi.stubEnv("DATABASE_URL", primary);
    expect(await configuredUrl()).toBe(primary);
  });

  it("preserves the existing legacy fallback when DATABASE_URL is absent", async () => {
    vi.stubEnv("NEON_DATABASE_URL", legacy);
    expect(await configuredUrl()).toBe(legacy);
  });

  it("rejects missing URLs rather than using PG settings", async () => {
    vi.stubEnv("PGHOST", "preview.invalid");
    vi.stubEnv("PGPORT", "5432");
    vi.stubEnv("PGUSER", "dummy");
    vi.stubEnv("PGPASSWORD", "dummy");
    vi.stubEnv("PGDATABASE", "test");
    await expect(configuredUrl()).rejects.toThrow("DATABASE_URL or NEON_DATABASE_URL must be set");
  });

  it("does not silently fall back when DATABASE_URL is empty", async () => {
    vi.stubEnv("DATABASE_URL", "");
    vi.stubEnv("NEON_DATABASE_URL", legacy);
    await expect(configuredUrl()).rejects.toThrow("DATABASE_URL or NEON_DATABASE_URL must be set");
  });
});
