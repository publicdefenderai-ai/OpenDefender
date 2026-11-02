import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { promisify } from "node:util";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { beforeAll, afterAll, beforeEach, describe, expect, it, vi } from "vitest";

const execFileAsync = promisify(execFile);

/**
 * This mock is deliberately installed before any server module is imported.
 * The connection details are filled only after the disposable postgres cluster
 * is running; no DATABASE_URL (or other ambient database setting) is read.
 */
const postgres = vi.hoisted(() => ({
  config: null as {
    host: string;
    port: number;
    user: string;
    database: string;
    max: number;
  } | null,
}));

vi.mock("../server/db", async () => {
  const { Pool } = await import("pg");
  const { drizzle } = await import("drizzle-orm/node-postgres");
  const schema = await import("../shared/schema");
  if (!postgres.config) throw new Error("Postgres test cluster was not configured");
  const pool = new Pool(postgres.config);
  return { pool, db: drizzle({ client: pool, schema }) };
});

type TestPool = {
  query: (text: string, values?: unknown[]) => Promise<{
    rows: any[];
    rowCount?: number | null;
  }>;
  end: () => Promise<void>;
};

let root: string | undefined;
let dataDirectory: string | undefined;
let socketDirectory: string | undefined;
let port: number;
let pool: TestPool;
let service: typeof import("../server/services/ohio-pilot-refresh-service");
let comparison: typeof import("../server/data/ohio-chapter-2903-comparison");
let refreshData: typeof import("../server/data/ohio-chapter-2903-refresh");
let sourceData: typeof import("../server/data/ohio-chapter-2903-source");
let authority: typeof import("../server/services/authority-source-database");

async function command(
  file: string,
  args: string[],
  input?: string,
): Promise<{ stdout: string; stderr: string }> {
  const result = await execFileAsync(file, args, {
    input,
    maxBuffer: 16 * 1024 * 1024,
  });
  return result;
}

async function psql(sql: string): Promise<void> {
  await command("psql", [
    "-h", socketDirectory!,
    "-p", String(port),
    "-U", "ohio_test",
    "-d", "ohio_test",
    "-v", "ON_ERROR_STOP=1",
    "-c", sql,
  ]);
}

function expectedDocuments() {
  const documents = new Map<string, (typeof sourceData.OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS)[number]["offense"]>();
  for (const record of sourceData.OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS) {
    for (const { document } of sourceData.ohioChapter2903Evidence(record)) {
      documents.set(document.section, document);
    }
  }
  return documents;
}

function officialPage(
  document: (typeof sourceData.OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS)[number]["offense"],
  suffix = "",
): string {
  const [heading, , effectiveDate, ...body] = document.text.split("\n");
  const date = new Date(`${effectiveDate.replace("Effective: ", "")}T00:00:00Z`);
  const formattedDate = date.toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return `<h1>${heading}</h1><div class="label">Effective:</div><div class="value">${formattedDate}</div><section class="laws-body">${document.title}.<br>${body.join("<br>")}${suffix}</section>`;
}

function fixtureFetch(
  changedSection?: string,
  documents = expectedDocuments(),
): typeof fetch {
  return (async (url: string) => {
    const section = url.match(/section-(.+)$/)?.[1] ?? "";
    const document = documents.get(section);
    return new Response(
      document
        ? officialPage(document, section === changedSection ? "<br>Changed official text." : "")
        : "missing",
      { status: document ? 200 : 404 },
    );
  }) as typeof fetch;
}

async function exactComparison(
  changedSection?: string,
  documents = expectedDocuments(),
) {
  return comparison.compareOhioChapter2903Sources(fixtureFetch(changedSection, documents));
}

describe("Ohio pilot refresh against an isolated PostgreSQL cluster", () => {
  beforeAll(async () => {
    root = mkdtempSync(join(tmpdir(), "ohio-pilot-postgres-"));
    dataDirectory = join(root, "data");
    socketDirectory = join(root, "socket");
    mkdirSync(socketDirectory);
    // The socket path is unique; the port only keeps postgres' internal
    // listener separate from any service using the default port.
    port = 50000 + (process.pid % 10000);

    await command("initdb", [
      "-D", dataDirectory,
      "-A", "trust",
      "-U", "ohio_test",
      "--no-locale",
      "--encoding=UTF8",
    ]);
    await command("pg_ctl", [
      "-D", dataDirectory,
      "-o", `-k ${socketDirectory} -p ${port}`,
      "-l", join(root, "postgres.log"),
      "-w",
      "start",
    ]);
    await command("createdb", [
      "-h", socketDirectory,
      "-p", String(port),
      "-U", "ohio_test",
      "ohio_test",
    ]);
    for (const migration of [
      "0000_ancient_kinsey_walden.sql",
      "0001_daily_omega_flight.sql",
      "0002_wide_deadpool.sql",
      "0003_texas_source_review_decisions.sql",
      "0004_source_review_integrity.sql",
      "0005_ohio_pilot_refresh.sql",
    ]) {
      await command("psql", [
        "-h", socketDirectory,
        "-p", String(port),
        "-U", "ohio_test",
        "-d", "ohio_test",
        "-v", "ON_ERROR_STOP=1",
        "-f", join("migrations", migration),
      ]);
    }

    postgres.config = {
      host: socketDirectory,
      port,
      user: "ohio_test",
      database: "ohio_test",
      max: 12,
    };
    const db = await import("../server/db");
    pool = db.pool as unknown as TestPool;
    [
      service,
      comparison,
      refreshData,
      sourceData,
      authority,
    ] = await Promise.all([
      import("../server/services/ohio-pilot-refresh-service"),
      import("../server/data/ohio-chapter-2903-comparison"),
      import("../server/data/ohio-chapter-2903-refresh"),
      import("../server/data/ohio-chapter-2903-source"),
      import("../server/services/authority-source-database"),
    ]);
    await pool.query("SELECT 1");
  }, 180_000);

  afterAll(async () => {
    if (pool) await pool.end();
    if (dataDirectory) {
      await command("pg_ctl", [
        "-D", dataDirectory,
        "-m", "immediate",
        "-l", join(root, "postgres.log"),
        "-w",
        "stop",
      ]).catch(() => undefined);
    }
    if (root) rmSync(root, { recursive: true, force: true });
  }, 30_000);

  beforeEach(async () => {
    await pool.query(`TRUNCATE TABLE
      ohio_pilot_review_decisions,
      ohio_pilot_refresh_state,
      statute_source_review_decisions,
      statute_update_queue,
      statute_charge_links,
      statute_source_snapshots,
      statute_sources,
      statute_ingestion_runs
      RESTART IDENTITY CASCADE`);
  });

  it("round-trips a JSONB receipt and activates unchanged official evidence", async () => {
    const checked = await exactComparison();
    expect(checked.errors).toEqual([]);
    expect(checked.receipt).not.toBeNull();

    const result = await service.runOhioPilotRefresh({
      force: true,
      compare: async () => checked,
      reactivate: async () => undefined,
    });
    expect(result.fresh).toBe(true);
    expect(result.receipt).not.toBeNull();

    const stored = await pool.query(
      "SELECT receipt, approved_pinset, review_required FROM ohio_pilot_refresh_state",
    );
    expect(stored.rows).toHaveLength(1);
    expect(refreshData.validateOhioChapter2903RefreshReceipt(stored.rows[0].receipt))
      .toBeNull();
    expect(stored.rows[0].approved_pinset).toBe(refreshData.ohioPilotPinset());
    expect(stored.rows[0].review_required).toBe(false);
  });

  it("revokes the live receipt before an unavailable comparison can publish", async () => {
    const unchanged = await exactComparison();
    await service.runOhioPilotRefresh({
      force: true,
      compare: async () => unchanged,
      reactivate: async () => undefined,
    });
    const failed = await service.runOhioPilotRefresh({
      force: true,
      compare: async () => ({
        receipt: null,
        evidence: [],
        errors: ["2929.02: official source returned HTTP 503"],
      }),
    });

    expect(failed.fresh).toBe(false);
    expect(failed.receipt).toBeNull();
    expect(failed.reason).toContain("HTTP 503");
    const stored = await pool.query(
      "SELECT receipt, reason FROM ohio_pilot_refresh_state",
    );
    expect(stored.rows[0].receipt).toBeNull();
    expect(stored.rows[0].reason).toContain("HTTP 503");
  });

  it("serializes concurrent refresh claims with the database lease", async () => {
    let comparisons = 0;
    let release!: () => void;
    const blocked = new Promise<void>((resolve) => { release = resolve; });
    const unchanged = await exactComparison();
    const compare = async () => {
      comparisons++;
      await blocked;
      return unchanged;
    };

    const first = service.runOhioPilotRefresh({
      force: true,
      compare,
      reactivate: async () => undefined,
    });
    for (let attempt = 0; attempt < 100 && comparisons === 0; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, 5));
    }
    const second = await service.runOhioPilotRefresh({
      force: true,
      compare,
      reactivate: async () => undefined,
    });

    expect(second.ran).toBe(false);
    expect(comparisons).toBe(1);
    const lease = await pool.query(
      "SELECT lease_token, lease_until FROM ohio_pilot_refresh_state",
    );
    expect(lease.rows[0].lease_token).toBeTruthy();
    expect(new Date(lease.rows[0].lease_until).getTime()).toBeGreaterThan(Date.now());

    release();
    await first;
  });

  it("enforces the append-only Ohio review decision trigger", async () => {
    const changed = await exactComparison("2929.02");
    const evidence = changed.evidence.find((item) => item.section === "2929.02");
    expect(changed.receipt).toBeNull();
    expect(evidence?.status).toBe("changed");
    expect(evidence?.observed?.text).toContain("Changed official text.");
    expect(evidence?.observed?.hash).not.toBe(evidence?.expected.hash);

    const run = await service.runOhioPilotRefresh({
      force: true,
      compare: async () => changed,
    });
    await service.reviewOhioPilotRefresh({
      runId: run.lastRunId!,
      pinset: refreshData.ohioPilotPinset(),
      reviewer: "Ohio integration attorney",
      note: "Rejected pending review of the changed official source text.",
      decision: "reject",
    });

    await expect(pool.query(
      "UPDATE ohio_pilot_review_decisions SET note = 'mutated' WHERE run_id = $1",
      [run.lastRunId],
    )).rejects.toThrow(/append-only/i);
    await expect(pool.query(
      "DELETE FROM ohio_pilot_review_decisions WHERE run_id = $1",
      [run.lastRunId],
    )).rejects.toThrow(/append-only/i);
  });

  it("requires exact changed 2929.02 evidence, then reviewed pins, before reactivation", async () => {
    const changed = await exactComparison("2929.02");
    const blocked = await service.runOhioPilotRefresh({
      force: true,
      compare: async () => changed,
    });
    expect(blocked.reviewRequired).toBe(true);
    expect(blocked.receipt).toBeNull();

    const matching = await exactComparison();
    const stillPending = await service.runOhioPilotRefresh({
      force: true,
      compare: async () => matching,
    });
    expect(stillPending.reviewRequired).toBe(true);
    expect(stillPending.receipt).toBeNull();
    expect(matching.errors).toEqual([]);

    let reactivationSawFreshReceipt = false;
    const reviewed = await service.reviewOhioPilotRefresh({
      runId: stillPending.lastRunId!,
      pinset: refreshData.ohioPilotPinset(),
      reviewer: "Ohio integration attorney",
      note: "Reviewed exact 2929.02 evidence, all deployed pins, and the matching live comparison.",
      decision: "approve",
    }, async () => {
      const live = await service.getOhioPilotRefreshStatus();
      reactivationSawFreshReceipt = live.fresh &&
        refreshData.validateOhioChapter2903RefreshReceipt(live.receipt) === null;
    });
    expect(reactivationSawFreshReceipt).toBe(true);
    expect(reviewed.fresh).toBe(true);
    expect(reviewed.reviewRequired).toBe(false);
  });

  it("fails default reactivation on an amended 2929.02 until review then restores current provenance", async () => {
    const originals = new Map<object, object>();
    const amended = new Set<object>();
    try {
      // First establish a real, fully seeded current authority database.
      const unchanged = await exactComparison();
      const activated = await service.runOhioPilotRefresh({
        force: true,
        compare: async () => unchanged,
      });
      expect(activated.fresh).toBe(true);

      // Keep a fixture of the old official page, then amend the actual
      // source-first pin used by the production manifest. All three
      // 2929.02 records must move together because they represent distinct
      // subdivisions of one official page.
      const oldOfficial = new Map([...expectedDocuments()].map(([section, document]) =>
        [section, structuredClone(document)] as const));
      for (const record of sourceData.OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS) {
        for (const { document } of sourceData.ohioChapter2903Evidence(record)) {
          if (document.section !== "2929.02") continue;
          if (!originals.has(document)) originals.set(document, structuredClone(document));
          const amendedText = document.text
            .replace("Effective: 2021-04-12", "Effective: 2026-09-17")
            .concat("\n(E) The amended integration-test text is effective on this date.");
          const amendedCurrentness = "Effective: 2026-09-17";
          Object.assign(document, {
            text: amendedText,
            effectiveDateStart: "2026-09-17",
            contentHash: createHash("sha256").update(amendedText).digest("hex"),
            quotedSpans: document.quotedSpans.map((span) =>
              span.kind === "currentness"
                ? {
                    ...span,
                    quote: amendedCurrentness,
                    start: amendedText.indexOf(amendedCurrentness),
                    end: amendedText.indexOf(amendedCurrentness) + amendedCurrentness.length,
                  }
                : span),
          });
          amended.add(document);
        }
      }
      expect(amended.size).toBeGreaterThan(0);
      const amendedHash = [...amended][0] as { contentHash: string };

      const changed = await exactComparison(undefined, oldOfficial);
      const changedEvidence = changed.evidence.find((item) => item.section === "2929.02");
      expect(changed.receipt).toBeNull();
      expect(changedEvidence?.status).toBe("changed");
      expect(changedEvidence?.expected.effectiveDate).toBe("2026-09-17");
      expect(changedEvidence?.observed?.effectiveDate).toBe("2021-04-12");
      expect(changedEvidence?.expected.hash).not.toBe(changedEvidence?.observed?.hash);

      const blocked = await service.runOhioPilotRefresh({
        force: true,
        compare: async () => changed,
      });
      expect(blocked.fresh).toBe(false);
      expect(blocked.reviewRequired).toBe(true);
      expect(blocked.receipt).toBeNull();

      // A matching live comparison records exact amended evidence but does
      // not auto-approve the already-reviewed pinset.
      const matching = await exactComparison();
      expect(matching.errors).toEqual([]);
      const pendingRun = await service.runOhioPilotRefresh({
        force: true,
        compare: async () => matching,
      });
      expect(pendingRun.reviewRequired).toBe(true);
      expect(pendingRun.receipt).toBeNull();

      // Explicit pilot review invokes the real default reactivation. The
      // amended snapshot is pending, so it must fail closed and revoke the
      // receipt until the source reviewer promotes that exact snapshot.
      const failedReactivation = await service.reviewOhioPilotRefresh({
        runId: pendingRun.lastRunId!,
        pinset: refreshData.ohioPilotPinset(),
        reviewer: "Ohio integration attorney",
        note: "Reviewed exact amended 2929.02 text, deployed pins, and live comparison.",
        decision: "approve",
      });
      expect(failedReactivation.fresh).toBe(false);
      expect(failedReactivation.receipt).toBeNull();
      expect(failedReactivation.reason).toContain("reactivation failed");

      const evidence = await service.getOhioPilotRefreshEvidence();
      const pending = evidence.pendingSourceReviews.filter(
        (row) => row.citation.startsWith("Ohio Rev. Code Ann. § 2929.02"),
      );
      expect(pending.length).toBeGreaterThan(0);
      expect(pending.some((row) => row.predecessor?.status === "current")).toBe(true);
      for (const snapshot of pending) {
        const review = await authority.reviewAuthoritySourceSnapshot({
          jurisdiction: "OH",
          snapshotId: snapshot.id,
          decision: "approve",
          reviewer: "Ohio integration attorney",
          note: "Reviewed the amended 2929.02 official text and exact replacement hash.",
        });
        expect(review.snapshot.status).toBe("current");
        expect(review.snapshot.requiresReview).toBe(false);
      }

      // Retrying the same live comparison now performs real reseeding,
      // validates current pilot links, and exposes the amended provenance.
      const retried = await service.runOhioPilotRefresh({
        force: true,
        compare: async () => matching,
      });
      expect(retried.fresh).toBe(true);
      expect(retried.receipt).not.toBeNull();
      const pilotIds = sourceData.OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS
        .map((record) => record.chargeId);
      const selectable = await authority.getCurrentAuthoritySelectableChargeIds("OH");
      expect(pilotIds.every((id) => selectable.has(id))).toBe(true);
      const provenance = await authority.getAuthorityChargeProvenance(
        "OH", "oh-orc-2903-01-aggravated-murder",
      );
      expect(provenance?.sources.some((source) =>
        source.section === "2929.02" &&
        source.contentHash === amendedHash.contentHash,
      )).toBe(true);
      expect((await service.getOhioPilotRefreshEvidence()).pendingSourceReviews)
        .toHaveLength(0);
    } finally {
      for (const [document, original] of originals) Object.assign(document, original);
    }
  }, 60_000);
});