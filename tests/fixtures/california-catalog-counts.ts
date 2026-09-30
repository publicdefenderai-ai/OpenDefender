/**
 * Independently reviewed current totals, shared by unit and browser checks.
 * Update once per publication batch; never derive expected values from the
 * catalog under test. Per-batch tests still assert their own exact additions.
 * Runtime count assumes a fresh receipt and the existing PEN:30515 hold.
 */
export const CA_CATALOG_COUNTS = { configured: 476, eligible: 475 } as const;
