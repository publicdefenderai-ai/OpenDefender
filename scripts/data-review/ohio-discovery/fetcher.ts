import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { OHIO_CODE_HOST } from "./types";

export interface OhioFetcherMetrics {
  fetchAttempts: number;
  networkRequests: number;
  cacheHits: number;
  retries: number;
  failedRequests: number;
}

export interface OhioFetchedPage {
  sourceUrl: string;
  retrievedAt: string;
  html: string;
  cacheHit: boolean;
}

interface CacheRecord {
  schemaVersion: 1;
  sourceUrl: string;
  retrievedAt: string;
  html: string;
}

export interface OhioFetcherOptions {
  cacheDir: string;
  cacheMaxAgeMs?: number;
  minRequestIntervalMs?: number;
  maxRetries?: number;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
}

function assertOfficialUrl(sourceUrl: string): URL {
  const url = new URL(sourceUrl);
  if (url.protocol !== "https:" || url.hostname !== OHIO_CODE_HOST) {
    throw new Error(`Refusing non-official Ohio Code URL: ${sourceUrl}`);
  }
  return url;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class OhioOfficialFetcher {
  readonly metrics: OhioFetcherMetrics = {
    fetchAttempts: 0,
    networkRequests: 0,
    cacheHits: 0,
    retries: 0,
    failedRequests: 0,
  };

  private readonly cacheMaxAgeMs: number;
  private readonly minRequestIntervalMs: number;
  private readonly maxRetries: number;
  private readonly timeoutMs: number;
  private readonly fetchImpl: typeof fetch;
  private nextRequestAt = 0;

  constructor(private readonly options: OhioFetcherOptions) {
    this.cacheMaxAgeMs = options.cacheMaxAgeMs ?? 24 * 60 * 60 * 1000;
    // The official site is rendered HTML, not a bulk-download API. One
    // serialized request per 700ms keeps this bounded crawl conservative.
    this.minRequestIntervalMs = options.minRequestIntervalMs ?? 700;
    this.maxRetries = options.maxRetries ?? 3;
    this.timeoutMs = options.timeoutMs ?? 30_000;
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  private cachePath(sourceUrl: string): string {
    return path.join(this.options.cacheDir, `${createHash("sha256").update(sourceUrl).digest("hex")}.json`);
  }

  async fetchPage(sourceUrl: string): Promise<OhioFetchedPage> {
    assertOfficialUrl(sourceUrl);
    const cachePath = this.cachePath(sourceUrl);
    if (fs.existsSync(cachePath)) {
      try {
        const cached = JSON.parse(fs.readFileSync(cachePath, "utf8")) as CacheRecord;
        const age = Date.now() - new Date(cached.retrievedAt).getTime();
        if (
          cached.schemaVersion === 1 &&
          cached.sourceUrl === sourceUrl &&
          typeof cached.html === "string" &&
          !Number.isNaN(age) &&
          age >= 0 &&
          age <= this.cacheMaxAgeMs
        ) {
          this.metrics.cacheHits++;
          return { sourceUrl, retrievedAt: cached.retrievedAt, html: cached.html, cacheHit: true };
        }
      } catch {
        // A malformed cache is ignored; a fresh official request is safer.
      }
    }

    let lastError = "Official Ohio source request failed";
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      this.metrics.fetchAttempts++;
      if (attempt > 0) {
        this.metrics.retries++;
        await sleep(2_000 * attempt);
      }
      const wait = this.nextRequestAt - Date.now();
      if (wait > 0) await sleep(wait);
      this.nextRequestAt = Date.now() + this.minRequestIntervalMs;
      try {
        this.metrics.networkRequests++;
        const response = await this.fetchImpl(sourceUrl, {
          signal: AbortSignal.timeout(this.timeoutMs),
          headers: {
            "User-Agent": "OpenDefender-OhioCodeDiscovery/1.0 (official source inventory)",
            Accept: "text/html,application/xhtml+xml",
          },
          redirect: "follow",
        });
        assertOfficialUrl(response.url || sourceUrl);
        if (!response.ok) {
          lastError = `HTTP ${response.status}`;
          if (response.status === 429 || response.status >= 500) {
            const retryAfterSeconds = Number(response.headers.get("retry-after"));
            if (Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0) {
              await sleep(Math.min(retryAfterSeconds * 1_000, 60_000));
            }
            continue;
          }
          break;
        }
        const contentType = response.headers.get("content-type") ?? "";
        if (!contentType.toLowerCase().includes("text/html")) {
          lastError = `Unexpected content type ${contentType || "(missing)"}`;
          break;
        }
        const html = await response.text();
        if (!html.trim()) {
          lastError = "Official Ohio source returned an empty body";
          break;
        }
        const retrievedAt = new Date().toISOString();
        fs.mkdirSync(this.options.cacheDir, { recursive: true });
        fs.writeFileSync(cachePath, JSON.stringify({
          schemaVersion: 1,
          sourceUrl,
          retrievedAt,
          html,
        } satisfies CacheRecord));
        return { sourceUrl, retrievedAt, html, cacheHit: false };
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error);
      }
    }
    this.metrics.failedRequests++;
    throw new Error(lastError);
  }
}

export async function mapWithConcurrency<T, R>(
  values: readonly T[],
  concurrency: number,
  worker: (value: T) => Promise<R>,
): Promise<R[]> {
  if (!Number.isInteger(concurrency) || concurrency < 1) throw new Error("Concurrency must be at least 1");
  const results = new Array<R>(values.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(concurrency, values.length) }, async () => {
    while (true) {
      const index = next++;
      if (index >= values.length) return;
      results[index] = await worker(values[index]);
    }
  }));
  return results;
}
