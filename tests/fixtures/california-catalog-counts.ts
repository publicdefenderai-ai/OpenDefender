/**
 * Independently reviewed current totals, shared by unit and browser checks.
 * Update once per publication batch; never derive expected values from the
 * catalog under test. Per-batch tests still assert their own exact additions.
 * Runtime count assumes a fresh receipt and the approved PEN:30515 successor.
 */
export const CA_CATALOG_COUNTS = { configured: 627, eligible: 627 } as const;
