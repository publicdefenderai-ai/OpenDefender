/**
 * AI Cost Tracker Service
 *
 * In-memory daily cost accumulator for AI endpoints.
 * Tracks spend across all AI services and enforces a daily budget limit.
 *
 * Resets automatically at midnight UTC.
 */

import { opsLog } from '../utils/dev-logger';

const DAILY_BUDGET_USD = parseFloat(process.env.AI_DAILY_BUDGET || '50');

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
  'claude-guidance': parseFloat(process.env.AI_BUDGET_GUIDANCE || '30'),
  'document-summarizer': parseFloat(process.env.AI_BUDGET_SUMMARIZER || '15'),
  'attorney-docs': parseFloat(process.env.AI_BUDGET_ATTORNEY || '5'),
};

// Maximum allowed estimated cost for a single request
const MAX_REQUEST_COST_USD = parseFloat(process.env.AI_MAX_REQUEST_COST || '0.15');

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
