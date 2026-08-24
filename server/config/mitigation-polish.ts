export const MITIGATION_POLISH_MAX_BODY_BYTES_ENV = 'MITIGATION_POLISH_MAX_BODY_BYTES';
export const DEFAULT_MITIGATION_POLISH_MAX_BODY_BYTES = 10 * 1024;
export const MAX_MITIGATION_POLISH_BODY_BYTES = 100 * 1024;

/**
 * Resolve the mitigation polish request-body limit from the environment.
 *
 * An unset variable keeps the existing 10 KB default. Any configured value
 * must be a positive integer no larger than 100 KB so a typo cannot silently
 * weaken the request-size guard.
 */
export function getMitigationPolishMaxBodyBytes(
  env: NodeJS.ProcessEnv = process.env,
): number {
  const rawValue = env[MITIGATION_POLISH_MAX_BODY_BYTES_ENV];

  if (rawValue === undefined) {
    return DEFAULT_MITIGATION_POLISH_MAX_BODY_BYTES;
  }

  if (!/^\d+$/.test(rawValue)) {
    throw new Error(
      `${MITIGATION_POLISH_MAX_BODY_BYTES_ENV} must be a positive integer no greater than ${MAX_MITIGATION_POLISH_BODY_BYTES} bytes.`,
    );
  }

  const value = Number(rawValue);
  if (
    !Number.isSafeInteger(value) ||
    value < 1 ||
    value > MAX_MITIGATION_POLISH_BODY_BYTES
  ) {
    throw new Error(
      `${MITIGATION_POLISH_MAX_BODY_BYTES_ENV} must be a positive integer no greater than ${MAX_MITIGATION_POLISH_BODY_BYTES} bytes.`,
    );
  }

  return value;
}