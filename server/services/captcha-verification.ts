/**
 * CAPTCHA Verification Service using Cloudflare Turnstile
 *
 * Turnstile is a privacy-focused CAPTCHA alternative that:
 * - Does not track users across sites
 * - Does not use cookies for tracking
 * - Is free for unlimited use
 *
 * Setup:
 * 1. Create a Turnstile widget at https://dash.cloudflare.com/turnstile
 * 2. Set TURNSTILE_SECRET_KEY in environment variables
 * 3. Use the site key in frontend components
 */

import { devLog, errLog } from '../utils/dev-logger';

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

interface TurnstileVerifyResponse {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
  action?: string;
  cdata?: string;
}

interface VerificationResult {
  success: boolean;
  error?: string;
}

/**
 * Verify a Turnstile CAPTCHA token
 *
 * @param token - The token from the frontend Turnstile widget
 * @param remoteIp - Optional client IP for additional validation
 * @returns Verification result
 */
export async function verifyCaptcha(token: string, remoteIp?: string): Promise<VerificationResult> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  // If no secret key configured, skip verification in development
  if (!secretKey) {
    if (process.env.NODE_ENV === 'development') {
      devLog('captcha', 'No TURNSTILE_SECRET_KEY set, skipping verification in development');
      return { success: true };
    }
    errLog('[CAPTCHA] TURNSTILE_SECRET_KEY not configured');
    return {
      success: false,
      error: 'CAPTCHA verification not configured'
    };
  }

  // Validate token format
  if (!token || typeof token !== 'string' || token.length < 10) {
    return {
      success: false,
      error: 'Invalid CAPTCHA token'
    };
  }

  try {
    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token);
    if (remoteIp) {
      formData.append('remoteip', remoteIp);
    }

    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      errLog(`[CAPTCHA] Turnstile API error: ${response.status}`);
      return {
        success: false,
        error: 'CAPTCHA verification service unavailable'
      };
    }

    const result: TurnstileVerifyResponse = await response.json();

    if (result.success) {
      devLog('captcha', 'Verification successful');
      return { success: true };
    }

    // Handle specific error codes
    const errorCodes = result['error-codes'] || [];
    devLog('captcha', 'Verification failed', errorCodes);

    if (errorCodes.includes('timeout-or-duplicate')) {
      return {
        success: false,
        error: 'CAPTCHA expired or already used. Please try again.'
      };
    }

    if (errorCodes.includes('invalid-input-response')) {
      return {
        success: false,
        error: 'Invalid CAPTCHA. Please complete the verification again.'
      };
    }

    return {
      success: false,
      error: 'CAPTCHA verification failed. Please try again.'
    };

  } catch (error) {
    errLog('[CAPTCHA] Verification error:', error);
    return {
      success: false,
      error: 'CAPTCHA verification failed. Please try again.'
    };
  }
}

/**
 * Check if CAPTCHA is required (i.e., properly configured)
 */
export function isCaptchaRequired(): boolean {
  return !!process.env.TURNSTILE_SECRET_KEY || process.env.NODE_ENV !== 'development';
}

/**
 * Get the public site key for frontend use
 * This is safe to expose to clients
 */
export function getCaptchaSiteKey(): string | null {
  return process.env.TURNSTILE_SITE_KEY || null;
}
