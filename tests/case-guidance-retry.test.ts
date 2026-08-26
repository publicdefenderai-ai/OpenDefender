import { describe, expect, it } from 'vitest';
import {
  buildGuidanceRetryPayload,
  isGuidanceRequestActive,
} from '../client/src/lib/case-guidance-retry';

describe('case guidance retries', () => {
  it('uses a newly issued CAPTCHA token for an AI retry', () => {
    const retry = buildGuidanceRetryPayload(
      {
        jurisdiction: 'CA',
        charges: ['assault'],
        guidanceMode: 'ai',
        captchaToken: 'spent-token',
      },
      'ai',
      'fresh-token',
    );

    expect(retry).toMatchObject({
      jurisdiction: 'CA',
      charges: ['assault'],
      guidanceMode: 'ai',
      captchaToken: 'fresh-token',
    });
    expect(retry.captchaToken).not.toBe('spent-token');
  });

  it('does not carry a CAPTCHA token into the rules-based fallback', () => {
    const fallback = buildGuidanceRetryPayload(
      { jurisdiction: 'CA', guidanceMode: 'ai', captchaToken: 'spent-token' },
      'rules',
    );

    expect(fallback).toMatchObject({ jurisdiction: 'CA', guidanceMode: 'rules' });
    expect(fallback).not.toHaveProperty('captchaToken');
  });

  it('rejects a stale completion after a newer retry becomes active', () => {
    expect(isGuidanceRequestActive(2, 1)).toBe(false);
    expect(isGuidanceRequestActive(2, 2)).toBe(true);
  });
});