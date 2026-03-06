/**
 * AI Cost Tracker Service
 *
 * In-memory daily cost accumulator for AI endpoints.
 * Tracks spend across all AI services and enforces a daily budget limit.
 *
 * Resets automatically at midnight UTC.
 */

import { opsLog, errLog } from '../utils/dev-logger';
import { db } from '../db';
import { aiDailyCosts } from '@shared/schema';
import { eq } from 'drizzle-orm';

const DAILY_BUDGET_USD = parseFloat(process.env.AI_DAILY_BUDGET || '0');

interface DailyCostRecord {
  date: string; // YYYY-MM-DD in UTC
  totalCost: number;
  breakdown: Record<string, number>;
  requestCount: number;
}

let currentDay: DailyCostRecord = createNewDay();

function getUTCDateString(): string {
  return new Date().toISOString().split('T')[0];
}

function createNewDay(): DailyCostRecord {
  return {
    date: getUTCDateString(),
    totalCost: 0,
    breakdown: {},
    requestCount: 0,
  };
}

function ensureCurrentDay(): void {
  const today = getUTCDateString();
  if (currentDay.date !== today) {
    // Log previous day's totals before resetting
    if (currentDay.requestCount > 0) {
      opsLog('cost-tracker', `Daily summary for ${currentDay.date}: $${currentDay.totalCost.toFixed(4)} across ${currentDay.requestCount} requests`);
    }
    currentDay = createNewDay();
  }
}

/**
 * Load today's accumulated cost from the database on server startup.
 *
 * Retries up to 3 times with a 5-second per-attempt timeout to handle
 * Neon cold-start latency. If all attempts fail, assumes the budget is
 * fully exhausted (pessimistic fallback) so no AI spend can occur until
 * a successful restart — preventing runaway costs from restart loops.
 */
export async function initializeCostTracker(): Promise<void> {
  const MAX_ATTEMPTS = 3;
  const ATTEMPT_TIMEOUT_MS = 5_000;
  const RETRY_DELAY_MS = 2_000;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const today = getUTCDateString();
      const existing = await Promise.race([
        db.query.aiDailyCosts.findFirst({ where: eq(aiDailyCosts.date, today) }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('DB query timed out')), ATTEMPT_TIMEOUT_MS)
        ),
      ]);

      if (existing) {
        currentDay = {
          date: existing.date,
          totalCost: existing.totalCost,
          breakdown: existing.breakdown as Record<string, number>,
          requestCount: existing.requestCount,
        };
        opsLog('cost-tracker', `Restored daily cost from DB: $${currentDay.totalCost.toFixed(4)} (${currentDay.requestCount} requests)`);
      } else {
        opsLog('cost-tracker', 'No existing cost record for today — starting at $0.00');
      }
      return; // Success — exit retry loop

    } catch (err) {
      errLog(`[cost-tracker] DB restore attempt ${attempt}/${MAX_ATTEMPTS} failed`, err);
      if (attempt < MAX_ATTEMPTS) {
        await new Promise(r => setTimeout(r, RETRY_DELAY_MS));
      } else {
        // All attempts failed — block AI spend rather than silently resetting to $0.
        // This prevents a DB outage on restart from granting a fresh daily budget.
        currentDay.totalCost = DAILY_BUDGET_USD;
        errLog('[cost-tracker] Could not restore cost from DB after all retries — AI spend blocked for safety. Restart when DB is reachable.');
      }
    }
  }
}

/**
 * Record an AI cost after a successful API call
 */
export function recordAICost(cost: number, service: string): void {
  ensureCurrentDay();

  currentDay.totalCost += cost;
  currentDay.breakdown[service] = (currentDay.breakdown[service] || 0) + cost;
  currentDay.requestCount += 1;

  opsLog('cost-tracker', `+$${cost.toFixed(4)} (${service}) | Day total: $${currentDay.totalCost.toFixed(4)} / $${DAILY_BUDGET_USD}`);

  if (currentDay.totalCost >= DAILY_BUDGET_USD) {
    opsLog('cost-tracker', `BUDGET LIMIT REACHED: $${currentDay.totalCost.toFixed(4)} >= $${DAILY_BUDGET_USD}`);
  }

  // Persist to DB non-blocking — survives server restarts
  db.insert(aiDailyCosts)
    .values({
      date: currentDay.date,
      totalCost: currentDay.totalCost,
      breakdown: currentDay.breakdown,
      requestCount: currentDay.requestCount,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: aiDailyCosts.date,
      set: {
        totalCost: currentDay.totalCost,
        breakdown: currentDay.breakdown,
        requestCount: currentDay.requestCount,
        updatedAt: new Date(),
      },
    })
    .catch((err) => errLog('[cost-tracker] DB persist failed', err));
}

/**
 * Check if AI features are still available (under budget)
 */
export function isAIAvailable(): boolean {
  ensureCurrentDay();
  return currentDay.totalCost < DAILY_BUDGET_USD;
}

// Per-service daily caps (configurable via env vars)
const SERVICE_BUDGET_USD: Record<string, number> = {
  'claude-guidance': parseFloat(process.env.AI_BUDGET_GUIDANCE || '0'),
  'document-summarizer': parseFloat(process.env.AI_BUDGET_SUMMARIZER || '0'),
  'attorney-docs': parseFloat(process.env.AI_BUDGET_ATTORNEY || '0'),
};

// Maximum allowed estimated cost for a single request
const MAX_REQUEST_COST_USD = parseFloat(process.env.AI_MAX_REQUEST_COST || '0');

// Sonnet 4 input cost: $3 per 1M tokens, ~4 chars per token
const INPUT_COST_PER_CHAR = 3.0 / (1_000_000 * 4);

/**
 * Estimate the input cost for a request given total prompt character count.
 * Uses ~4 chars/token heuristic with Sonnet 4 input pricing ($3/MTok).
 */
export function estimateRequestCost(inputChars: number): number {
  return inputChars * INPUT_COST_PER_CHAR;
}

/**
 * Returns false if the estimated pre-flight cost exceeds the per-request ceiling.
 * Call this before making a Claude API request to reject oversized inputs early.
 */
export function isRequestCostAcceptable(inputChars: number): boolean {
  return estimateRequestCost(inputChars) <= MAX_REQUEST_COST_USD;
}

/**
 * Check if a specific service still has budget remaining (global cap + per-service cap).
 */
export function isServiceAvailable(service: string): boolean {
  ensureCurrentDay();
  if (currentDay.totalCost >= DAILY_BUDGET_USD) return false;
  const cap = SERVICE_BUDGET_USD[service];
  if (cap === undefined) return true;
  return (currentDay.breakdown[service] || 0) < cap;
}

/**
 * Get current cost status for the API status endpoint
 */
export function getAICostStatus(): {
  available: boolean;
  dailyBudget: number;
  currentSpend: number;
  remainingBudget: number;
  requestCount: number;
  message?: string;
} {
  ensureCurrentDay();

  const available = currentDay.totalCost < DAILY_BUDGET_USD;
  const remaining = Math.max(0, DAILY_BUDGET_USD - currentDay.totalCost);

  return {
    available,
    dailyBudget: DAILY_BUDGET_USD,
    currentSpend: Math.round(currentDay.totalCost * 10000) / 10000,
    remainingBudget: Math.round(remaining * 10000) / 10000,
    requestCount: currentDay.requestCount,
    message: available
      ? undefined
      : 'AI features are temporarily unavailable due to high usage today. They will be restored at midnight UTC.',
  };
}
