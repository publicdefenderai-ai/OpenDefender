# California runtime renewal: October 29, 2026

This is an unchanged-source renewal after PR 87, not another legal review or a certification of statewide completeness. All 959 pinned sections and 967 retained versions match a newly downloaded official session archive. No source pins, approved successor decisions, intentional removals or future-law monitors were changed. There are no new changed-source holds.

## Provenance and result

- Official source: https://downloads.leginfo.legislature.ca.gov/pubinfo_2025.zip
- Acquisition started: 2026-10-29T23:28:32.557210+00:00.
- Publisher Last-Modified: Mon, 26 Oct 2026 04:26:08 GMT. This is recorded separately from acquisition time; acquisition does not imply that the publisher rebuilt the archive that day.
- Download size: 1,292,052,065 bytes, verified against the HTTP Content-Length.
- Observed archive SHA-256: `ec562b927cd7714905450feca5a8f0d887db4f4f9250192663481c6d7149a431`.
- Original reviewed archive SHA-256 remains `dd0f40a7256bcf31e8dff50efa4833e296a700a7f772e36c23dc276039ef22a4`.
- Receipt expires: 2026-11-05T23:28:32.557210+00:00, November 5 at 3:28 p.m. Pacific. Offline replay cannot move that deadline.
- At this renewal snapshot, all 703 configured choices pass the local evidence gate. The database-free manifest contains 703 catalog records and 5,733 source references/snapshots/links, with zero stored statutory-text snapshots.

The ZIP differs from the prior archive; section text hashes and legal/version metadata do not. Transaction timestamps and packaging are not treated as statutory amendments. Known future transitions remain gated independently. Jury-instruction updates, intervening court decisions and new offenses outside the pinned set are not certified by this comparison.

## Maintenance fixes

The official source returned HTTP 403 to urllib but HTTP 200 to curl. An explicit `--transport curl` option now verifies HTTPS, direct HTTP 200, byte length and content hash before issuing an acquisition receipt. Failed or redirected transfers cannot replace a complete candidate and receipt. No credentials or TLS bypass are used.

The default renewal cache is separate from the historical October 1 archive. Three recent publication validators now bind to `california-publication-comparison-2026-10-01.json`, an exact preservation of their historical comparison, instead of the rolling runtime report. Their evidence and review outputs are unchanged.

The public deployment checker now follows every catalog page with the same snapshot, continuation and duplicate checks as the application. A later-page error rejects the check instead of treating the first 500 choices as the complete catalog.

## Replit handoff after independent review and merge

1. Pull the reviewed merged commit. Confirm that it includes the renewal receipt and the publication work through PR 87; do not substitute an older recovery or design-only checkout.
2. Run `node --import tsx scripts/data-review/seed-california-source-database.ts --dry-run`. This imports no database module. For this release snapshot, expect 703 selectable charges and catalog records, 5,733 source references/snapshots/links, and zero stored statutory-text snapshots.
3. Verify the existing recovery safeguards and intended production database mapping. If the production source-reference manifest is behind, use the established California seed process only after owner approval against that confirmed database. A receipt renewal cannot supply missing database references. No database operation was performed for this PR.
4. Inspect any proposed publishing schema diff. This PR requires no schema change; do not approve an unexplained migration.
5. With owner approval, publish the reviewed app while the receipt is still current. Pulling GitHub or updating a workspace does not change the running server's imported receipt.
6. Run `node --import tsx scripts/check-california-deployment.ts`. Require `ok: true`, the exact reviewed receipt, a completed linked source manifest and all expected IDs across both pages. A fresh receipt alone does not prove successful deployment.

If review or release is delayed, reacquire and compare rather than editing dates. Plan the next source check before November 3, when this receipt enters its final 48 hours. The existing daily deadline workflow is still an owner-installation template under `docs/operations/`; it is not installed by this PR. No automatic renewal or notification service is claimed.

Ohio and Florida receipts are unchanged. Their maintenance remains separate from this California renewal.

## Reproduction without database access

- Currentness comparison against this retained candidate: `python3 scripts/data-review/california-verification/refresh-retained.py --candidate .cache/california-bulk/runtime-renewal-2026-10-29 --activate-unchanged`. The candidate must still be within its seven-day interval; an expired candidate is rejected.
- Future acquisition: follow `docs/california-freshness-runbook.md` using a separate runtime candidate directory and `--transport curl` if needed.
- Run the California tests, pagination tests, Python acquisition tests and typecheck. Browser release checks use synthetic source references without production credentials.

These commands do not establish live parity unless the separate public deployment check succeeds against the published app.

## Verification results

- Typecheck and production build passed.
- California, catalog and pagination checks: 431 passed, two intentionally skipped.
- Python acquisition/review suite: 40 passed.
- Isolated production-browser checks: nine passed, including all three latest publication groups, second-page lookup and rejection of a partial catalog. Synthetic data only; no production database or AI credentials.
- The frozen historical comparison is byte-identical to the pre-renewal report (SHA-256 `2e6d0ce5b26da582c198bc6211cf00e8facf5a561d4bfc216613ca6ef2141bb8`).

A read-only public check at 2026-10-29T23:35:09.426Z returned zero California choices. The public status did not report current evidence or a completed linked source seed and differed from this proposed receipt. This confirms that local eligibility is not live availability; it does not inspect database contents or establish that records are missing. Complete the coordinated deployment checks above after approval.
