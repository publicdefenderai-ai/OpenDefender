/**
 * Privacy-safe operational metrics for external source providers.
 *
 * Metrics are written as daily UTC aggregates. The allowlists below are
 * deliberate: callers cannot accidentally turn this path into a place where
 * prompts, citations, URLs, session IDs, or user narratives are persisted.
 */

import { asc, gte, sql } from 'drizzle-orm';
import { providerMetrics } from '@shared/schema';
import { errLog, opsLog } from '../utils/dev-logger';

export type MetricsProvider = 'CourtListener' | 'OpenLaws' | 'GuidanceEnrichment';
export type MetricsOperation = 'api_request' | 'source_enrichment';
export type MetricsOutcome = 'success' | 'failure' | 'timeout' | 'client_error' | 'cancelled';

export interface ProviderMetricInput {
  provider: MetricsProvider;
  operation: MetricsOperation;
  outcome: MetricsOutcome;
  durationMs: number;
}

const MAX_RECORDED_DURATION_MS = 24 * 60 * 60 * 1000;
const MAX_METRIC_DAYS = 90;
const ALLOWED_PROVIDERS: readonly MetricsProvider[] = [
  'CourtListener',
  'OpenLaws',
  'GuidanceEnrichment',
];
const ALLOWED_OPERATIONS: readonly MetricsOperation[] = [
  'api_request',
  'source_enrichment',
];
const ALLOWED_OUTCOMES: readonly MetricsOutcome[] = [
  'success',
  'failure',
  'timeout',
  'client_error',
  'cancelled',
];

function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function isValidMetric(input: ProviderMetricInput): boolean {
  if (!input || typeof input !== 'object') return false;
  return (
    typeof input?.provider === 'string' &&
    ALLOWED_PROVIDERS.includes(input.provider) &&
    typeof input?.operation === 'string' &&
    ALLOWED_OPERATIONS.includes(input.operation) &&
    typeof input?.outcome === 'string' &&
    ALLOWED_OUTCOMES.includes(input.outcome) &&
    Number.isFinite(input.durationMs) &&
    input.durationMs >= 0
  );
}

/**
 * Record one aggregate increment without ever awaiting it from a provider
 * request. A metrics outage must not make source enrichment unavailable.
 */
export async function recordProviderMetric(input: ProviderMetricInput): Promise<void> {
  if (!isValidMetric(input)) return;

  const durationMs = Math.min(Math.round(input.durationMs), MAX_RECORDED_DURATION_MS);
  const successCount = input.outcome === 'success' ? 1 : 0;
  const failureCount = input.outcome === 'failure' || input.outcome === 'timeout' ? 1 : 0;
  const timeoutCount = input.outcome === 'timeout' ? 1 : 0;
  const clientErrorCount = input.outcome === 'client_error' ? 1 : 0;
  const cancelledCount = input.outcome === 'cancelled' ? 1 : 0;

  try {
    // Lazy-load the database so provider clients remain usable in tests and in
    // development environments where durable storage is not configured.
    const { db } = await import('../db');
    const bucketStart = startOfUtcDay(new Date());

    await db.insert(providerMetrics).values({
      provider: input.provider,
      operation: input.operation,
      bucketStart,
      requestCount: 1,
      successCount,
      failureCount,
      timeoutCount,
      clientErrorCount,
      cancelledCount,
      durationTotalMs: durationMs,
      durationMaxMs: durationMs,
      lastOutcome: input.outcome,
    }).onConflictDoUpdate({
      target: [providerMetrics.provider, providerMetrics.operation, providerMetrics.bucketStart],
      set: {
        requestCount: sql`${providerMetrics.requestCount} + 1`,
        successCount: sql`${providerMetrics.successCount} + ${successCount}`,
        failureCount: sql`${providerMetrics.failureCount} + ${failureCount}`,
        timeoutCount: sql`${providerMetrics.timeoutCount} + ${timeoutCount}`,
        clientErrorCount: sql`${providerMetrics.clientErrorCount} + ${clientErrorCount}`,
        cancelledCount: sql`${providerMetrics.cancelledCount} + ${cancelledCount}`,
        durationTotalMs: sql`${providerMetrics.durationTotalMs} + ${durationMs}`,
        durationMaxMs: sql`GREATEST(${providerMetrics.durationMaxMs}, ${durationMs})`,
        lastOutcome: input.outcome,
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    // Observability must be best-effort and must not affect the legal guidance
    // response. Keep this log aggregate-only as well.
    errLog('Provider metrics write failed', {
      provider: input.provider,
      operation: input.operation,
      reason: error instanceof Error ? error.name : 'unknown',
    });
  }
}

export interface ProviderMetricRow {
  provider: MetricsProvider;
  operation: MetricsOperation;
  bucketStart: Date;
  requestCount: number;
  successCount: number;
  failureCount: number;
  timeoutCount: number;
  clientErrorCount: number;
  cancelledCount: number;
  durationTotalMs: number;
  durationMaxMs: number;
  lastOutcome: MetricsOutcome;
}

export interface ProviderMetricSummary {
  provider: MetricsProvider;
  requestCount: number;
  successCount: number;
  failureCount: number;
  timeoutCount: number;
  clientErrorCount: number;
  cancelledCount: number;
  durationTotalMs: number;
  durationMaxMs: number;
  averageDurationMs: number;
  availabilityPercent: number | null;
}

export interface ProviderMetricsReport {
  from: string;
  to: string;
  days: number;
  providers: ProviderMetricSummary[];
  daily: ProviderMetricRow[];
}

function emptySummary(provider: MetricsProvider): ProviderMetricSummary {
  return {
    provider,
    requestCount: 0,
    successCount: 0,
    failureCount: 0,
    timeoutCount: 0,
    clientErrorCount: 0,
    cancelledCount: 0,
    durationTotalMs: 0,
    durationMaxMs: 0,
    averageDurationMs: 0,
    availabilityPercent: null,
  };
}

/**
 * Read only aggregate metrics for the admin operations view.
 */
export async function getProviderMetrics(days = 30): Promise<ProviderMetricsReport> {
  const boundedDays = Math.max(
    1,
    Math.min(Number.isFinite(days) ? Math.floor(days) : 30, MAX_METRIC_DAYS),
  );
  const to = new Date();
  // Include exactly `boundedDays` UTC calendar buckets, including today.
  const from = new Date(to.getTime() - (boundedDays - 1) * 24 * 60 * 60 * 1000);
  const { db } = await import('../db');
  const rows = await db.select().from(providerMetrics)
    .where(gte(providerMetrics.bucketStart, startOfUtcDay(from)))
    .orderBy(asc(providerMetrics.bucketStart));

  const daily: ProviderMetricRow[] = rows
    .filter((row) =>
      ALLOWED_PROVIDERS.includes(row.provider as MetricsProvider) &&
      ALLOWED_OPERATIONS.includes(row.operation as MetricsOperation)
    )
    .map((row) => ({
    provider: row.provider as MetricsProvider,
    operation: row.operation as MetricsOperation,
    bucketStart: row.bucketStart,
    requestCount: row.requestCount,
    successCount: row.successCount,
    failureCount: row.failureCount,
    timeoutCount: row.timeoutCount,
    clientErrorCount: row.clientErrorCount,
    cancelledCount: row.cancelledCount,
    durationTotalMs: row.durationTotalMs,
    durationMaxMs: row.durationMaxMs,
    lastOutcome: row.lastOutcome as MetricsOutcome,
    }));
  const summaries = new Map<MetricsProvider, ProviderMetricSummary>();
  for (const provider of ['CourtListener', 'OpenLaws', 'GuidanceEnrichment'] as MetricsProvider[]) {
    summaries.set(provider, emptySummary(provider));
  }

  for (const row of daily) {
    const summary = summaries.get(row.provider);
    if (!summary) continue;
    summary.requestCount += row.requestCount;
    summary.successCount += row.successCount;
    summary.failureCount += row.failureCount;
    summary.timeoutCount += row.timeoutCount;
    summary.clientErrorCount += row.clientErrorCount;
    summary.cancelledCount += row.cancelledCount;
    summary.durationTotalMs += row.durationTotalMs;
    summary.durationMaxMs = Math.max(summary.durationMaxMs, row.durationMaxMs);
  }

  for (const summary of summaries.values()) {
    const measuredRequests = summary.requestCount - summary.cancelledCount;
    summary.averageDurationMs = measuredRequests > 0
      ? Math.round(summary.durationTotalMs / summary.requestCount)
      : 0;
    summary.availabilityPercent = measuredRequests > 0
      ? Math.round(((measuredRequests - summary.failureCount) / measuredRequests) * 1000) / 10
      : null;
  }

  opsLog('metrics', `Loaded provider metrics for ${boundedDays} day(s)`);
  return {
    from: from.toISOString(),
    to: to.toISOString(),
    days: boundedDays,
    providers: Array.from(summaries.values()),
    daily,
  };
}