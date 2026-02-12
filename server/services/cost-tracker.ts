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
