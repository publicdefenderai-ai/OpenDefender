/**
 * Production startup environment guard tests.
 *
 * Goal: SESSION_SECRET and the Turnstile CAPTCHA keys used to fail silently
 * open when unset in production (a log line, then the server ran anyway with
 * a public dev-default secret / no bot protection). This suite locks in the
 * fix: the server must refuse to start in production if any of them are
 * missing, and must never do so outside production.
 */

import { describe, it, expect } from 'vitest';
import { getMissingProductionEnvVars, assertProductionEnv } from '../server/startup-checks';

const COMPLETE_ENV = {
  NODE_ENV: 'production',
  SESSION_SECRET: 'a-real-secret',
  TURNSTILE_SECRET_KEY: 'a-real-turnstile-secret',
  TURNSTILE_SITE_KEY: 'a-real-turnstile-site-key',
};

describe('getMissingProductionEnvVars', () => {
  it('returns an empty array when every required var is set', () => {
    expect(getMissingProductionEnvVars(COMPLETE_ENV)).toEqual([]);
  });

  it('lists all three when none are set', () => {
    expect(getMissingProductionEnvVars({})).toEqual([
      'SESSION_SECRET',
      'TURNSTILE_SECRET_KEY',
      'TURNSTILE_SITE_KEY',
    ]);
  });

  it('lists only the ones that are actually missing', () => {
    expect(
      getMissingProductionEnvVars({ SESSION_SECRET: 'set' }),
    ).toEqual(['TURNSTILE_SECRET_KEY', 'TURNSTILE_SITE_KEY']);
  });

  it('treats an empty string as missing, not "set"', () => {
    expect(
      getMissingProductionEnvVars({ ...COMPLETE_ENV, SESSION_SECRET: '' }),
    ).toEqual(['SESSION_SECRET']);
  });
});

describe('assertProductionEnv', () => {
  it('throws in production when SESSION_SECRET is missing', () => {
    expect(() =>
      assertProductionEnv({ ...COMPLETE_ENV, SESSION_SECRET: undefined }),
    ).toThrow(/SESSION_SECRET/);
  });

  it('throws in production when either Turnstile key is missing', () => {
    expect(() =>
      assertProductionEnv({ ...COMPLETE_ENV, TURNSTILE_SECRET_KEY: undefined }),
    ).toThrow(/TURNSTILE_SECRET_KEY/);
    expect(() =>
      assertProductionEnv({ ...COMPLETE_ENV, TURNSTILE_SITE_KEY: undefined }),
    ).toThrow(/TURNSTILE_SITE_KEY/);
  });

  it('names every missing variable in a single error, not just the first', () => {
    expect(() => assertProductionEnv({ NODE_ENV: 'production' })).toThrow(
      /SESSION_SECRET.*TURNSTILE_SECRET_KEY.*TURNSTILE_SITE_KEY/s,
    );
  });

  it('does not throw in production when everything required is set', () => {
    expect(() => assertProductionEnv(COMPLETE_ENV)).not.toThrow();
  });

  it('does not throw in development even when everything is missing', () => {
    expect(() => assertProductionEnv({ NODE_ENV: 'development' })).not.toThrow();
  });

  it('does not throw when NODE_ENV is unset (defaults to non-production behavior)', () => {
    expect(() => assertProductionEnv({})).not.toThrow();
  });

  it('does not throw in test environments even when everything is missing', () => {
    expect(() => assertProductionEnv({ NODE_ENV: 'test' })).not.toThrow();
  });
});
