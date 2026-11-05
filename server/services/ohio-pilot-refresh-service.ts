import { randomUUID } from "node:crypto";
import type { PoolClient } from "pg";
import { pool } from "../db";
import { ohioPilotPinset, validateOhioChapter2903RefreshReceipt } from "../data/ohio-chapter-2903-refresh";
import { compareOhioChapter2903Sources } from "../data/ohio-chapter-2903-comparison";

const JOB = "ohio-chapter-2903";
const UPCOMING_MS = 48 * 60 * 60 * 1000;
// Includes every dependency, throttling and bounded 429 retries. A dead worker
// cannot renew after takeover: all writes are fenced by the claim token.
const LEASE_MINUTES = 45;

interface State {
  receipt: unknown;
  approved_pinset: string | null;
  review_required: boolean;
  reason: string | null;
  next_check_at: Date;
  lease_token: string | null;
  lease_until: Date | null;
  last_run_id: string | null;
}

export function ohioPilotStatus(state: State | undefined, now = new Date()) {
  const reason = !state ? "Ohio pilot has not been checked in this database"
    : state.lease_token ? "Ohio pilot refresh is in progress or was interrupted"
    : state.review_required ? state.reason || "Ohio official text or reviewed pins changed; legal review is required"
    : state.reason || validateOhioChapter2903RefreshReceipt(state.receipt, now);
  const receipt = state?.receipt as { expiresAt?: string } | null;
  const expiresAt = receipt?.expiresAt ?? null;
  const remaining = expiresAt ? Date.parse(expiresAt) - now.getTime() : NaN;
  const notices: string[] = [];
  if (reason) notices.push(reason);
  if (Number.isFinite(remaining) && remaining <= UPCOMING_MS) {
    notices.push(remaining <= 0 ? "Ohio pilot verification has expired" : "Ohio pilot verification expires within 48 hours");
  }
  if (state && new Date(state.next_check_at).getTime() < now.getTime() - 6 * 60 * 60 * 1000) {
    notices.push("Ohio pilot scheduled check is overdue; verify the external scheduler");
  }
  return {
    fresh: reason === null, reason, receipt: reason === null ? state?.receipt : null,
    expiresAt, reviewRequired: state?.review_required ?? false,
    nextCheckAt: state?.next_check_at ?? null,
    lastRunId: state?.last_run_id ?? null, pinset: ohioPilotPinset(), notices,
    healthy: reason === null && notices.length === 0,
  };
}

/** No positive local cache: every instance sees revocation and expiry. */
export async function getOhioPilotRefreshStatus() {
  try {
    const result = await pool.query<State>("SELECT * FROM ohio_pilot_refresh_state WHERE id = $1", [JOB]);
    return ohioPilotStatus(result.rows[0]);
  } catch {
    return {
      ...ohioPilotStatus(undefined), fresh: false, healthy: false, receipt: null,
      reason: "Ohio pilot shared verification database is unavailable",
      notices: ["Ohio pilot shared verification database is unavailable; authority is withheld"],
    };
  }
}

export async function getOhioPilotRefreshEvidence() {
  const { getPendingAuthoritySourceSnapshots } = await import("./authority-source-database");
  const [status, runs, reviews, pendingSourceReviews] = await Promise.all([
    getOhioPilotRefreshStatus(),
    pool.query(`SELECT id, status, started_at, completed_at, error_message, metadata
      FROM statute_ingestion_runs WHERE jurisdiction = 'OH' AND operation = 'pilot_refresh'
      ORDER BY started_at DESC LIMIT 10`),
    pool.query(`SELECT id, run_id, pinset, reviewer, note, decision, decided_at
      FROM ohio_pilot_review_decisions ORDER BY decided_at DESC LIMIT 20`),
    getPendingAuthoritySourceSnapshots("OH"),
  ]);
  return { ...status, runs: runs.rows, reviews: reviews.rows, pendingSourceReviews };
}

async function transaction<T>(body: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await body(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function reactivate() {
  const [{ loadOhioAuthorityManifest }, { seedOhioSourceDatabase }, authority] = await Promise.all([
    import("../data/ohio-manifest-loader"), import("./ohio-source-database"),
    import("./authority-source-database"),
  ]);
  const status = await getOhioPilotRefreshStatus();
  if (!status.fresh) throw new Error(status.reason ?? "Ohio receipt unavailable");
  const manifest = loadOhioAuthorityManifest(undefined, new Date(), status.receipt);
  const result = await seedOhioSourceDatabase(manifest);
  if (!result.success) throw new Error("Ohio pilot source reseed failed");
  const { OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS } = await import("../data/ohio-chapter-2903-source");
  const pilotIds = new Set(OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS.map(record => record.chargeId));
  const expectedIds = manifest.catalogRecords
    .filter(record => pilotIds.has(record.chargeId) &&
      (record.disposition === "retain" || record.disposition === "exact_alias_rename"))
    .map(record => record.chargeId);
  const selectable = await authority.getCurrentAuthoritySelectableChargeIds("OH");
  if (expectedIds.some(id => !selectable.has(id))) {
    throw new Error("Ohio pilot source links are not current; inspect pending snapshot reviews");
  }
}

export async function runOhioPilotRefresh(options: {
  force?: boolean;
  triggeredBy?: string;
  // Injection is internal/test-only; no request body can supply source access.
  compare?: typeof compareOhioChapter2903Sources;
  reactivate?: () => Promise<void>;
} = {}) {
  const token = randomUUID();
  const runId = randomUUID();
  const pinset = ohioPilotPinset();
  const claimed = await transaction(async client => {
    await client.query("INSERT INTO ohio_pilot_refresh_state (id) VALUES ($1) ON CONFLICT DO NOTHING", [JOB]);
    const result = await client.query<State>(`UPDATE ohio_pilot_refresh_state
      SET lease_token = $2, lease_until = now() + interval '${LEASE_MINUTES} minutes',
          receipt = NULL, reason = 'Official refresh in progress; previous receipt revoked', updated_at = now()
      WHERE id = $1 AND (lease_until IS NULL OR lease_until <= now())
        AND ($3::boolean OR next_check_at <= now())
      RETURNING *`, [JOB, token, options.force === true]);
    if (!result.rowCount) return false;
    // An expired claim is never silently considered successful.
    await client.query(`UPDATE statute_ingestion_runs SET status = 'failed', completed_at = now(),
      error_count = 1, error_message = 'Worker interrupted or lease expired'
      WHERE jurisdiction = 'OH' AND operation = 'pilot_refresh' AND status = 'in_progress'`);
    await client.query(`INSERT INTO statute_ingestion_runs
      (id, jurisdiction, operation, status, triggered_by, metadata)
      VALUES ($1, 'OH', 'pilot_refresh', 'in_progress', $2, $3::jsonb)`,
    [runId, options.triggeredBy ?? "scheduler", JSON.stringify({ pinset })]);
    return true;
  });
  if (!claimed) return { ran: false, ...await getOhioPilotRefreshStatus() };

  let comparison: Awaited<ReturnType<typeof compareOhioChapter2903Sources>>;
  try {
    comparison = await (options.compare ?? compareOhioChapter2903Sources)();
  } catch {
    comparison = { receipt: null, evidence: [], errors: ["Official-source comparison failed unexpectedly"] };
  }
  const activated = await transaction(async client => {
    const result = await client.query<State>(`SELECT * FROM ohio_pilot_refresh_state
      WHERE id = $1 AND lease_token = $2 AND lease_until > now() FOR UPDATE`, [JOB, token]);
    const state = result.rows[0];
    if (!state) throw new Error("Ohio refresh lease lost; stale worker cannot publish");
    const valid = comparison.errors.length === 0 &&
      validateOhioChapter2903RefreshReceipt(comparison.receipt) === null;
    const changed = comparison.evidence.some(item => item.status === "changed");
    const reviewRequired = state.review_required || changed ||
      (state.approved_pinset !== null && state.approved_pinset !== pinset);
    const activate = valid && !reviewRequired;
    const reason = reviewRequired ? "Ohio source or reviewed pins changed; explicit legal review required"
      : !valid ? comparison.errors.join("; ").slice(0, 8000) || "Official comparison did not produce a valid receipt"
      : null;
    await client.query(`UPDATE statute_ingestion_runs SET status = $2, completed_at = now(),
      source_count = $3, change_count = $4, error_count = $5, error_message = $6, metadata = $7::jsonb
      WHERE id = $1`, [runId, activate ? "completed" : "failed", comparison.evidence.length,
      comparison.evidence.filter(item => item.status === "changed").length, comparison.errors.length,
      reason, JSON.stringify({ pinset, ...comparison })]);
    await client.query(`UPDATE ohio_pilot_refresh_state SET receipt = $3::jsonb,
      approved_pinset = CASE WHEN $4 THEN $5 ELSE approved_pinset END,
      review_required = $6, reason = $7, next_check_at = now() +
        CASE WHEN $4 THEN interval '3 months' ELSE interval '6 hours' END,
      lease_token = NULL, lease_until = NULL, last_run_id = $8, updated_at = now()
      WHERE id = $1 AND lease_token = $2`,
    [JOB, token, JSON.stringify(activate ? comparison.receipt : null), activate, pinset, reviewRequired, reason, runId]);
    return activate;
  });
  if (activated) {
    try {
      await (options.reactivate ?? reactivate)();
    } catch {
      // A valid comparison is not proof that source links were restored.
      await pool.query(`UPDATE ohio_pilot_refresh_state SET receipt = NULL,
        reason = 'Ohio source reactivation failed; retry refresh', next_check_at = now()
        WHERE id = $1 AND last_run_id = $2`, [JOB, runId]);
      await pool.query(`UPDATE statute_ingestion_runs SET status = 'failed', error_count = error_count + 1,
        error_message = 'Ohio source reactivation failed' WHERE id = $1`, [runId]);
    }
  }
  const status = await getOhioPilotRefreshStatus();
  console[status.healthy ? "info" : "error"](JSON.stringify({
    event: "ohio_pilot_refresh", runId, fresh: status.fresh, notices: status.notices,
  }));
  return { ran: true, ...status };
}

export class OhioPilotReviewError extends Error {}

/** Legal interpretation is an explicit, audited action separate from fetching.
 * Approval is bound to the latest exact evidence AND the deployed reviewed pins.
 */
export async function reviewOhioPilotRefresh(input: {
  runId: string; pinset: string; reviewer: string; note: string; decision: "approve" | "reject";
}, reactivation = reactivate) {
  if (!input || typeof input.runId !== "string" || typeof input.pinset !== "string" ||
      typeof input.reviewer !== "string" || input.reviewer.trim().length < 3 ||
      typeof input.note !== "string" || input.note.trim().length < 20 ||
      input.note.length > 10000 || input.reviewer.length > 200 ||
      !["approve", "reject"].includes(input.decision)) {
    throw new OhioPilotReviewError("Supply runId, deployed pinset, reviewer and a substantive legal-review note");
  }
  await transaction(async client => {
    const result = await client.query<State>("SELECT * FROM ohio_pilot_refresh_state WHERE id = $1 FOR UPDATE", [JOB]);
    const state = result.rows[0];
    if (!state || state.lease_token || state.last_run_id !== input.runId || input.pinset !== ohioPilotPinset()) {
      throw new OhioPilotReviewError("Refresh changed or is in progress; reload exact evidence before reviewing");
    }
    const run = await client.query(`SELECT metadata FROM statute_ingestion_runs
      WHERE id = $1 AND jurisdiction = 'OH' AND operation = 'pilot_refresh'`, [input.runId]);
    const metadata = run.rows[0]?.metadata;
    if (input.decision === "approve" && (metadata?.pinset !== input.pinset ||
      validateOhioChapter2903RefreshReceipt(metadata?.receipt) !== null)) {
      throw new OhioPilotReviewError("Deploy reviewed exact source pins and run a matching live comparison before approval");
    }
    await client.query(`INSERT INTO ohio_pilot_review_decisions
      (run_id, pinset, reviewer, note, decision) VALUES ($1, $2, $3, $4, $5)`,
    [input.runId, input.pinset, input.reviewer.trim(), input.note.trim(), input.decision]);
    await client.query(`UPDATE ohio_pilot_refresh_state SET receipt = $2::jsonb,
      approved_pinset = CASE WHEN $3 THEN $4 ELSE approved_pinset END,
      review_required = NOT $3, reason = $5, updated_at = now()
      WHERE id = $1`, [JOB, JSON.stringify(input.decision === "approve" ? metadata.receipt : null),
      input.decision === "approve", input.pinset, input.decision === "approve" ? null : "Legal reviewer rejected Ohio pilot reactivation"]);
  });
  if (input.decision === "approve") {
    try {
      await reactivation();
    } catch {
      await pool.query(`UPDATE ohio_pilot_refresh_state SET receipt = NULL,
        reason = 'Ohio source reactivation failed; retry refresh', next_check_at = now()
        WHERE id = $1 AND last_run_id = $2`, [JOB, input.runId]);
    }
  }
  return getOhioPilotRefreshStatus();
}