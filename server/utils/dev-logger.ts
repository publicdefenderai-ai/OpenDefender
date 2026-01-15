/**
 * Privacy-conscious logging utility for legal applications
 * 
 * Categories:
 * - devLog: Development only - never in production (debug info, request details)
 * - opsLog: Operational stats - safe for production (counts, durations, status)
 * - errLog: Errors - always log
 * 
 * Privacy principle: Never log actual user data, only aggregate stats and system status
 */

const isDevelopment = process.env.NODE_ENV !== 'production';

/**
 * Development-only logging - completely silent in production
 * Use for: API request/response details, prompt lengths, cache keys, etc.
 */
export function devLog(...args: unknown[]): void {
  if (isDevelopment) {
    console.log(...args);
  }
}

/**
 * Operational logging - safe aggregate stats for production observability
 * Use for: Cleanup counts, validation scores, cache hit rates, timing metrics
 * NEVER include: User input, PII, session content, guidance text
 */
export function opsLog(message: string): void {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

/**
 * Error logging - always logs, critical for debugging
 */
export function errLog(message: string, error?: unknown): void {
  if (error) {
    console.error(`[ERROR] ${message}`, error);
  } else {
    console.error(`[ERROR] ${message}`);
  }
}
