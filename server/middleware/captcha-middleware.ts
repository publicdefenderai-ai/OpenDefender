/**
 * CAPTCHA Verification Middleware
 *
 * Protects expensive AI endpoints from abuse by requiring
 * Cloudflare Turnstile verification.
 */

import type { Request, Response, NextFunction } from 'express';
import { verifyCaptcha, isCaptchaRequired } from '../services/captcha-verification';
import { devLog } from '../utils/dev-logger';

/**
 * Middleware to require CAPTCHA verification for AI endpoints
 *
 * Expects the CAPTCHA token in one of:
 * - req.body.captchaToken (for JSON requests)
 * - req.body['captcha-token'] (for form data)
 * - req.headers['x-captcha-token'] (for any request type)
 */
export function requireCaptcha(req: Request, res: Response, next: NextFunction) {
  // Skip if CAPTCHA is not configured (no Turnstile keys set)
  if (!isCaptchaRequired()) {
    devLog('captcha', 'Skipping - not configured');
    return next();
  }

  // Extract token from various sources
  const token =
    req.body?.captchaToken ||
    req.body?.['captcha-token'] ||
    req.headers['x-captcha-token'] as string;

  if (!token) {
    return res.status(400).json({
      success: false,
      error: 'CAPTCHA verification required',
      code: 'CAPTCHA_REQUIRED'
    });
  }

  // Get client IP for additional validation
  const clientIp = req.ip || req.socket.remoteAddress;

  // Verify the token
  verifyCaptcha(token, clientIp)
    .then(result => {
      if (result.success) {
        next();
      } else {
        res.status(403).json({
          success: false,
          error: result.error || 'CAPTCHA verification failed',
          code: 'CAPTCHA_FAILED'
        });
      }
    })
    .catch(error => {
      devLog('captcha', 'Error', error);
      res.status(500).json({
        success: false,
        error: 'CAPTCHA verification error',
        code: 'CAPTCHA_ERROR'
      });
    });
}

/**
 * Optional CAPTCHA middleware - verifies if token provided, passes through if not
 * Use this for endpoints where CAPTCHA is recommended but not required
 */
export function optionalCaptcha(req: Request, res: Response, next: NextFunction) {
  const token =
    req.body?.captchaToken ||
    req.body?.['captcha-token'] ||
    req.headers['x-captcha-token'] as string;

  // No token provided - proceed without verification
  if (!token) {
    return next();
  }

  // Token provided - verify it
  const clientIp = req.ip || req.socket.remoteAddress;

  verifyCaptcha(token, clientIp)
    .then(result => {
      if (!result.success) {
        // Token provided but invalid - reject
        return res.status(403).json({
          success: false,
          error: result.error || 'CAPTCHA verification failed',
          code: 'CAPTCHA_FAILED'
        });
      }
      next();
    })
    .catch(() => {
      // On error, proceed anyway (optional verification)
      next();
    });
}
