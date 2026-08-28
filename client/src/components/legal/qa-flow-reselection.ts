/**
 * Replace a saved broad legacy charge with the exact choice made in QAFlow.
 * Keeping this state transition pure makes the reselection contract testable
 * without coupling statutory data tests to React rendering.
 */
export function replaceLegacyChargeWithCanonical(
  chargeIds: string[],
  legacyId: string,
  canonicalId: string,
): string[] {
  return chargeIds
    .filter((id) => id !== legacyId)
    .concat(canonicalId)
    .filter((id, index, ids) => ids.indexOf(id) === index);
}