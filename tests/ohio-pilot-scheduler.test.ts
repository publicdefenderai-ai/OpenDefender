import { beforeEach, describe, expect, it, vi } from "vitest";
import { ohioPilotPinset } from "../server/data/ohio-chapter-2903-refresh";
import { expectedDocuments } from "../server/data/ohio-chapter-2903-refresh";

vi.mock("../server/services/authority-source-database", () => ({
  getPendingAuthoritySourceSnapshots: async () => [],
}));

type Comparison = {
  receipt: Record<string, unknown> | null;
  evidence: Array<{
    section: string;
    expected: Record<string, unknown>;
    observed: Record<string, unknown> | null;
    status: "unchanged" | "changed" | "unavailable";
  }>;
  errors: string[];
};

type RefreshState = {
  id: string;
  receipt: Record<string, unknown> | null;
  approved_pinset: string | null;
  review_required: boolean;
  reason: string | null;
  next_check_at: Date;
  lease_token: string | null;
  lease_until: Date | null;
  last_run_id: string | null;
};

type Run = {
  id: string;
  jurisdiction: string;
  operation: string;
  status: string;
  source_count: number;
  change_count: number;
  error_count: number;
  started_at: Date;
  completed_at: Date | null;
  triggered_by: string | null;
  error_message: string | null;
  metadata: Comparison & { pinset: string };
};

const mocks = vi.hoisted(() => ({
  now: new Date("2026-01-01T12:00:00.000Z"),
  state: undefined as RefreshState | undefined,
  runs: new Map<string, Run>(),
  reviews: [] as Array<Record<string, unknown>>,
  unavailable: false,
}));

function copyState() {
  return mocks.state && {
    ...mocks.state,
    receipt: mocks.state.receipt && JSON.parse(JSON.stringify(mocks.state.receipt)),
  };
}

function validReceipt(checkedAt = mocks.now) {
  return {
    schemaVersion: 1,
    checkedAt: checkedAt.toISOString(),
    expiresAt: new Date(checkedAt.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    documents: expectedDocuments(),
  };
}

function unchangedComparison(): Comparison {
  return {
    receipt: validReceipt(),
    errors: [],
    evidence: expectedDocuments().map((document) => ({
      section: document.section,
      expected: { section: document.section },
      observed: { section: document.section },
      status: "unchanged" as const,
    })),
  };
}

function changedComparison(section = "2929.02"): Comparison {
  const comparison = unchangedComparison();
  const evidence = comparison.evidence.find((item) => item.section === section);
  if (evidence) evidence.status = "changed";
  comparison.receipt = null;
  comparison.errors = [`${section}: official source changed from its reviewed pin`];
  return comparison;
}

function createClient() {
  return {
    query: (text: string, values?: unknown[]) => query(text, values),
    release: vi.fn(),
  };
}

async function query(text: string, values: unknown[] = []): Promise<any> {
  if (mocks.unavailable) throw new Error("database unavailable");
  const sql = text.replace(/\s+/g, " ").trim();

  if (sql.startsWith("BEGIN") || sql.startsWith("COMMIT") || sql.startsWith("ROLLBACK")) {
    return { rows: [], rowCount: 0 };
  }

  if (sql.startsWith("INSERT INTO ohio_pilot_refresh_state")) {
    if (!mocks.state) {
      mocks.state = {
        id: String(values[0]),
        receipt: null,
        approved_pinset: null,
        review_required: false,
        reason: null,
        next_check_at: new Date(mocks.now),
        lease_token: null,
        lease_until: null,
        last_run_id: null,
      };
    }
    return { rows: [], rowCount: 1 };
  }

  if (sql.startsWith("UPDATE ohio_pilot_refresh_state SET lease_token")) {
    const [, token, force] = values;
    const due = !mocks.state?.next_check_at || mocks.state.next_check_at <= mocks.now;
    const leaseExpired = !mocks.state?.lease_until || mocks.state.lease_until <= mocks.now;
    if (!mocks.state || !leaseExpired || (!(force === true) && !due)) {
      return { rows: [], rowCount: 0 };
    }
    mocks.state.lease_token = String(token);
    mocks.state.lease_until = new Date(mocks.now.getTime() + 45 * 60 * 1000);
    mocks.state.receipt = null;
    mocks.state.reason = "Official refresh in progress; previous receipt revoked";
    return { rows: [copyState()], rowCount: 1 };
  }

  if (sql.startsWith("SELECT * FROM ohio_pilot_refresh_state") && sql.includes("lease_token")) {
    const [, token] = values;
    const available = mocks.state && mocks.state.lease_token === token &&
      mocks.state.lease_until !== null && mocks.state.lease_until > mocks.now;
    return { rows: available ? [copyState()] : [], rowCount: available ? 1 : 0 };
  }

  if (sql.startsWith("SELECT * FROM ohio_pilot_refresh_state")) {
    return { rows: copyState() ? [copyState()] : [], rowCount: mocks.state ? 1 : 0 };
  }

  if (sql.startsWith("UPDATE statute_ingestion_runs SET status = 'failed', error_count")) {
    const run = mocks.runs.get(String(values[0]));
    if (run) {
      run.status = "failed";
      run.error_count += 1;
      run.error_message = "Ohio source reactivation failed";
    }
    return { rows: [], rowCount: run ? 1 : 0 };
  }

  if (sql.startsWith("UPDATE statute_ingestion_runs SET status = 'failed'")) {
    for (const run of mocks.runs.values()) {
      if (run.jurisdiction === "OH" && run.operation === "pilot_refresh" && run.status === "in_progress") {
        run.status = "failed";
        run.completed_at = new Date(mocks.now);
        run.error_count = 1;
        run.error_message = "Worker interrupted or lease expired";
      }
    }
    return { rows: [], rowCount: 1 };
  }

  if (sql.startsWith("INSERT INTO statute_ingestion_runs")) {
    const [id, triggeredBy, metadata] = values;
    const parsed = JSON.parse(String(metadata));
    mocks.runs.set(String(id), {
      id: String(id),
      jurisdiction: "OH",
      operation: "pilot_refresh",
      status: "in_progress",
      source_count: 0,
      change_count: 0,
      error_count: 0,
      started_at: new Date(mocks.now),
      completed_at: null,
      triggered_by: String(triggeredBy),
      error_message: null,
      metadata: parsed,
    });
    return { rows: [], rowCount: 1 };
  }

  if (sql.startsWith("UPDATE statute_ingestion_runs SET status = $2")) {
    const [id, status, sourceCount, changeCount, errorCount, errorMessage, metadata] = values;
    const run = mocks.runs.get(String(id));
    if (run) {
      run.status = String(status);
      run.completed_at = new Date(mocks.now);
      run.source_count = Number(sourceCount);
      run.change_count = Number(changeCount);
      run.error_count = Number(errorCount);
      run.error_message = errorMessage === null ? null : String(errorMessage);
      run.metadata = JSON.parse(String(metadata));
    }
    return { rows: [], rowCount: run ? 1 : 0 };
  }

  if (sql.startsWith("UPDATE ohio_pilot_refresh_state SET receipt = $3")) {
    const [, token, receipt, activate, pinset, reviewRequired, reason, runId] = values;
    if (!mocks.state || mocks.state.lease_token !== token) return { rows: [], rowCount: 0 };
    mocks.state.receipt = JSON.parse(String(receipt));
    if (activate === true) mocks.state.approved_pinset = String(pinset);
    mocks.state.review_required = reviewRequired === true;
    mocks.state.reason = reason === null ? null : String(reason);
    mocks.state.next_check_at = new Date(
      mocks.now.getTime() + (activate === true ? 24 : 6) * 60 * 60 * 1000,
    );
    mocks.state.lease_token = null;
    mocks.state.lease_until = null;
    mocks.state.last_run_id = String(runId);
    return { rows: [], rowCount: 1 };
  }

  if (sql.startsWith("UPDATE ohio_pilot_refresh_state SET receipt = NULL")) {
    const [, runId] = values;
    if (mocks.state?.last_run_id === String(runId)) {
      mocks.state.receipt = null;
      mocks.state.reason = sql.includes("retry refresh")
        ? "Ohio source reactivation failed; retry refresh"
        : "Ohio source reactivation failed; retry refresh";
      mocks.state.next_check_at = new Date(mocks.now);
      return { rows: [], rowCount: 1 };
    }
    return { rows: [], rowCount: 0 };
  }

  if (sql.startsWith("SELECT metadata FROM statute_ingestion_runs")) {
    const run = mocks.runs.get(String(values[0]));
    return { rows: run ? [{ metadata: run.metadata }] : [], rowCount: run ? 1 : 0 };
  }

  if (sql.startsWith("INSERT INTO ohio_pilot_review_decisions")) {
    const [runId, pinset, reviewer, note, decision] = values;
    mocks.reviews.push({
      id: `review-${mocks.reviews.length + 1}`,
      run_id: runId,
      pinset,
      reviewer,
      note,
      decision,
      decided_at: new Date(mocks.now),
    });
    return { rows: [], rowCount: 1 };
  }

  if (sql.startsWith("UPDATE ohio_pilot_refresh_state SET receipt = $2")) {
    const [, receipt, approve, pinset, reason] = values;
    if (!mocks.state) return { rows: [], rowCount: 0 };
    mocks.state.receipt = JSON.parse(String(receipt));
    mocks.state.approved_pinset = approve === true ? String(pinset) : mocks.state.approved_pinset;
    mocks.state.review_required = approve !== true;
    mocks.state.reason = reason === null ? null : String(reason);
    return { rows: [], rowCount: 1 };
  }

  if (sql.startsWith("UPDATE ohio_pilot_refresh_state SET receipt = NULL")) {
    return { rows: [], rowCount: 0 };
  }

  if (sql.startsWith("SELECT id, status, started_at")) {
    const rows = [...mocks.runs.values()].sort(
      (a, b) => b.started_at.getTime() - a.started_at.getTime(),
    ).slice(0, 10);
    return { rows, rowCount: rows.length };
  }

  if (sql.startsWith("SELECT id, run_id, pinset")) {
    return { rows: mocks.reviews.slice(-20).reverse(), rowCount: mocks.reviews.length };
  }

  throw new Error(`Unhandled mock SQL: ${sql}`);
}

vi.mock("../server/db", () => ({
  pool: {
    query,
    connect: async () => createClient(),
  },
}));

const {
  getOhioPilotRefreshEvidence,
  getOhioPilotRefreshStatus,
  ohioPilotStatus,
  reviewOhioPilotRefresh,
  runOhioPilotRefresh,
} = await import("../server/services/ohio-pilot-refresh-service");

describe("Ohio pilot scheduler", () => {
  beforeEach(() => {
    // Receipt validation is intentionally against the service's wall clock.
    // Keep the stateful SQL clock at the same instant instead of constructing
    // a receipt in the future relative to the implementation under test.
    mocks.now = new Date();
    mocks.state = undefined;
    mocks.runs.clear();
    mocks.reviews.length = 0;
    mocks.unavailable = false;
  });

  it("serializes concurrent claims behind one 45-minute lease", async () => {
    let releaseComparison!: () => void;
    const comparisonBlocked = new Promise<void>((resolve) => { releaseComparison = resolve; });
    let comparisons = 0;
    const compare = async () => {
      comparisons++;
      await comparisonBlocked;
      return unchangedComparison();
    };

    const first = runOhioPilotRefresh({
      compare,
      force: true,
      reactivate: async () => undefined,
    });
    await new Promise((resolve) => setTimeout(resolve, 0));
    const second = await runOhioPilotRefresh({ compare, force: true });
    expect(second.ran).toBe(false);
    expect(comparisons).toBe(1);
    expect(mocks.state?.lease_until?.getTime()).toBe(
      mocks.now.getTime() + 45 * 60 * 1000,
    );

    releaseComparison();
    await first;
  });

  it("fences a stale worker after its lease is taken over", async () => {
    let releaseComparison!: () => void;
    const comparisonBlocked = new Promise<void>((resolve) => { releaseComparison = resolve; });
    const first = runOhioPilotRefresh({
      force: true,
      compare: async () => {
        await comparisonBlocked;
        return unchangedComparison();
      },
    });
    await new Promise((resolve) => setTimeout(resolve, 0));
    mocks.now = new Date(mocks.now.getTime() + 46 * 60 * 1000);
    const takeover = await runOhioPilotRefresh({
      force: true,
      compare: async () => unchangedComparison(),
      reactivate: async () => undefined,
    });
    expect(takeover.ran).toBe(true);
    releaseComparison();
    await expect(first).rejects.toThrow("lease lost");
    expect(mocks.state?.last_run_id).not.toBeNull();
    expect(mocks.state?.lease_token).toBeNull();
  });

  it("stores an unchanged receipt with no more than the seven-day renewal window", async () => {
    const result = await runOhioPilotRefresh({
      force: true,
      compare: async () => unchangedComparison(),
      reactivate: async () => undefined,
    });
    expect(result.fresh).toBe(true);
    const receipt = result.receipt as { checkedAt: string; expiresAt: string };
    expect(Date.parse(receipt.expiresAt) - Date.parse(receipt.checkedAt))
      .toBeLessThanOrEqual(7 * 24 * 60 * 60 * 1000);
  });

  it("revokes the old receipt whenever comparison returns errors", async () => {
    const first = await runOhioPilotRefresh({
      force: true,
      compare: async () => unchangedComparison(),
      reactivate: async () => undefined,
    });
    expect(first.fresh).toBe(true);
    const failed = await runOhioPilotRefresh({
      force: true,
      compare: async () => ({
        receipt: null,
        evidence: [],
        errors: ["official source unavailable"],
      }),
    });
    expect(failed.fresh).toBe(false);
    expect(failed.receipt).toBeNull();
    expect(failed.reason).toContain("official source unavailable");
  });

  it("warns for upcoming and expired receipts and overdue checks", () => {
    const receipt = validReceipt();
    receipt.expiresAt = new Date(mocks.now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    const upcoming = ohioPilotStatus({
      id: "ohio-chapter-2903",
      receipt,
      approved_pinset: ohioPilotPinset(),
      review_required: false,
      reason: null,
      next_check_at: new Date(mocks.now.getTime() - 7 * 60 * 60 * 1000),
      lease_token: null,
      lease_until: null,
      last_run_id: "run",
    }, mocks.now);
    expect(upcoming.notices).toContain("Ohio pilot verification expires within 48 hours");
    expect(upcoming.notices).toContain("Ohio pilot scheduled check is overdue; verify the external scheduler");

    receipt.expiresAt = new Date(mocks.now.getTime() - 1).toISOString();
    const expired = ohioPilotStatus({ ...upcoming, receipt }, mocks.now);
    expect(expired.notices).toContain("Ohio pilot verification has expired");
    expect(expired.healthy).toBe(false);
  });

  it("keeps a changed 2929.02 evidence result blocked until an explicit review", async () => {
    const changed = await runOhioPilotRefresh({
      force: true,
      compare: async () => changedComparison(),
    });
    expect(changed.fresh).toBe(false);
    expect(changed.reviewRequired).toBe(true);
    expect(changed.reason).toMatch(/review|required|changed/i);
    const penalty = (await getOhioPilotRefreshEvidence()).runs[0].metadata.evidence
      .find((item: { section: string }) => item.section === "2929.02");
    expect(penalty.status).toBe("changed");

    const stillBlocked = await runOhioPilotRefresh({
      force: true,
      compare: async () => unchangedComparison(),
    });
    expect(stillBlocked.fresh).toBe(false);
    expect(stillBlocked.reviewRequired).toBe(true);
    expect(stillBlocked.receipt).toBeNull();
  });

  it("reactivates only after a reviewed pinset and matching live comparison", async () => {
    mocks.state = {
      id: "ohio-chapter-2903",
      receipt: null,
      approved_pinset: "previous-reviewed-pinset",
      review_required: true,
      reason: "Ohio source or reviewed pins changed; explicit legal review required",
      next_check_at: new Date(mocks.now),
      lease_token: null,
      lease_until: null,
      last_run_id: null,
    };
    const run = await runOhioPilotRefresh({
      force: true,
      compare: async () => unchangedComparison(),
    });
    expect(run.reviewRequired).toBe(true);
    expect(run.receipt).toBeNull();

    const reviewed = await reviewOhioPilotRefresh({
      runId: run.lastRunId!,
      pinset: ohioPilotPinset(),
      reviewer: "Attorney Reviewer",
      note: "I reviewed the changed official text, deployed pinset, and matching live comparison.",
      decision: "approve",
    }, async () => undefined);
    expect(reviewed.fresh).toBe(true);
    expect(reviewed.reviewRequired).toBe(false);
    expect(reviewed.receipt).not.toBeNull();
  });

  it("leaves a rejected review blocked", async () => {
    mocks.state = {
      id: "ohio-chapter-2903",
      receipt: null,
      approved_pinset: ohioPilotPinset(),
      review_required: true,
      reason: "Ohio source or reviewed pins changed; explicit legal review required",
      next_check_at: new Date(mocks.now),
      lease_token: null,
      lease_until: null,
      last_run_id: null,
    };
    const run = await runOhioPilotRefresh({
      force: true,
      compare: async () => unchangedComparison(),
    });
    const rejected = await reviewOhioPilotRefresh({
      runId: run.lastRunId!,
      pinset: ohioPilotPinset(),
      reviewer: "Attorney Reviewer",
      note: "Rejected pending a complete legal review of the changed source.",
      decision: "reject",
    });
    expect(rejected.reviewRequired).toBe(true);
    expect(rejected.receipt).toBeNull();
    expect(rejected.reason).toMatch(/review|required|changed|reject/i);
  });

  it("denies stale run and stale pinset review attempts", async () => {
    await expect(reviewOhioPilotRefresh({
      runId: "missing-run",
      pinset: ohioPilotPinset(),
      reviewer: "Attorney Reviewer",
      note: "This review must not be accepted for a stale run.",
      decision: "approve",
    })).rejects.toThrow("Refresh changed");

    mocks.state = {
      id: "ohio-chapter-2903",
      receipt: null,
      approved_pinset: null,
      review_required: true,
      reason: "review",
      next_check_at: new Date(mocks.now),
      lease_token: null,
      lease_until: null,
      last_run_id: "run",
    };
    await expect(reviewOhioPilotRefresh({
      runId: "run",
      pinset: "stale-pinset",
      reviewer: "Attorney Reviewer",
      note: "This review must not be accepted for stale deployed pins.",
      decision: "approve",
    })).rejects.toThrow("Refresh changed");
  });

  it("fails closed when source reactivation fails", async () => {
    const result = await runOhioPilotRefresh({
      force: true,
      compare: async () => unchangedComparison(),
      reactivate: async () => { throw new Error("seed unavailable"); },
    });
    expect(result.fresh).toBe(false);
    expect(result.receipt).toBeNull();
    expect(result.reason).toBe("Ohio source reactivation failed; retry refresh");
    expect([...mocks.runs.values()][0].status).toBe("failed");
  });

  it("withholds authority on a shared database outage while pure status remains deterministic", async () => {
    mocks.unavailable = true;
    const status = await getOhioPilotRefreshStatus();
    expect(status.healthy).toBe(false);
    expect(status.receipt).toBeNull();
    expect(status.reason).toBe("Ohio pilot shared verification database is unavailable");
    expect(ohioPilotStatus(undefined, mocks.now).healthy).toBe(false);
    await expect(getOhioPilotRefreshEvidence()).rejects.toThrow("database unavailable");
  });
});