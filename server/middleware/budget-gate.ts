/**
 * Budget Gate Middleware
 *
 * Blocks AI requests when the daily cost budget has been exceeded.
 * Returns 503 with a friendly message so the frontend can show a banner.
 */

import type { Request, Response, NextFunction } from 'express';
import { isAIAvailable } from '../services/cost-tracker';

export function requireBudget(req: Request, res: Response, next: NextFunction) {
  if (!isAIAvailable()) {
    return res.status(503).json({
      success: false,
      error: 'AI features are temporarily unavailable due to high usage today. They will be restored at midnight UTC. We apologize for the inconvenience.',
      code: 'AI_BUDGET_EXCEEDED',
    });
  }
  next();
}
