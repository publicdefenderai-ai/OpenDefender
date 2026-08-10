/**
 * Production startup environment checks.
 *
 * Pulled out as a pure function (rather than left inline in index.ts) so it's
 * unit-testable without booting the real server — see tests/startup-checks.test.ts.
 */

/** Environment variables that must be set before the server is allowed to start in production. */
const REQUIRED_IN_PRODUCTION = ['SESSION_SECRET', 'TURNSTILE_SECRET_KEY', 'TURNSTILE_SITE_KEY'] as const;

/**
 * Returns the names of required production env vars that are unset or empty.
 * An empty array means the environment is complete.
 */
export function getMissingProductionEnvVars(env: NodeJS.ProcessEnv): string[] {
  return REQUIRED_IN_PRODUCTION.filter((name) => !env[name]);
}

/**
 * Throws if `env.NODE_ENV === 'production'` and any required var is missing.
 * No-op in any other environment (development, test, undefined).
 */
export function assertProductionEnv(env: NodeJS.ProcessEnv): void {
  if (env.NODE_ENV !== 'production') return;

  const missing = getMissingProductionEnvVars(env);
  if (missing.length > 0) {
    throw new Error(
      `Refusing to start in production: missing required environment variable(s): ${missing.join(', ')}. ` +
      `SESSION_SECRET is required so session-ownership cookies can't be forged with the public dev-default secret. ` +
      `TURNSTILE_SECRET_KEY and TURNSTILE_SITE_KEY are both required so AI endpoints aren't left without bot/abuse protection. ` +
      `Set these in the production environment before deploying.`
    );
  }
}
