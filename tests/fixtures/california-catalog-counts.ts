/**
 * Expected configured totals for this batch, shared by unit and browser checks.
 * Update once per publication batch; never derive expected values from the
 * catalog under test. Per-batch tests still assert their own exact additions.
 * The eligible value is a test expectation at a valid evidence time, NOT a live
 * availability count. It assumes scripts/data-review/output/
 * california-archive-refresh-receipt.json is valid at the test clock and the
 * approved PEN:30515 successor. An expired receipt withholds runtime choices.
 */
export const CA_CATALOG_COUNTS = { configured: 694, eligible: 694 } as const;
