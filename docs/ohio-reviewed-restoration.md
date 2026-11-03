# Ohio reviewed-charge restoration

This batch integrates the 18 existing source corrections and rechecks their full dependency set. It restores the reviewed implementation locally; it does not deploy, import into a database, or complete Ohio's statewide offense inventory.

## Changes and preserved boundaries

- Nine records receive corrected English scope or grading; two receive related-context clarification. Seven retain their guidance and receive evidence updates only.
- The original substantive report, approval ledger and legal decisions remain unchanged. The existing §1509.01 source-change hold remains in place.
- Eighteen official documents support the correction overlay. Exact source hashes, effective dates and JavaScript quote offsets are validated. Changes to this overlay invalidate earlier reviewed receipts.
- The two hazing records use the current §4729.01 source, with their dangerous-drug operative quotations unchanged.
- Eleven changed summaries use explicitly labeled English fallback in Spanish and Chinese. Unchanged records retain their translations. These new fallback summaries need translation work.
- The generic legacy `oh-menacing` record requires explicit reselection of the corrected `oh-orc-2903-22-menacing` record. Its old source must not coexist as current evidence with the replacement. Saved cases are not silently migrated.

## Official-source check

The acquisition covered 215 distinct official sections. The known 11 changed sections match the reconciled candidate versions. The additional §2913.04 difference is limited to `E xcept` becoming `Except` and a publisher update footer; a test proves that exact comparison. No additional substantive change was found. OAC 3701-12-01 was parsed as an administrative rule, not as an ORC section. §4561.15 matched on its exact section page.

`ohio-restoration-source-check.json` retains the per-section acquisition time, URL, heading, effective date and content hash. The correction evidence is separate from the historical review. Current official acquisitions were compared against every resulting source pin before issuing either local receipt.

The pilot receipt covers 61 documents; the reviewed receipt covers 175. They share dependencies. Expiry is capped at the oldest underlying retrieval plus seven days, not seven days after replay. The committed receipts expire November 10, 2026, at approximately 06:05 UTC (November 9, 22:05 Pacific). A later renewal must reacquire or legitimately reuse still-fresh matching evidence; changing dates alone is not verification.

## Expected import result

Offline manifest/seed construction, without any database connection, yields:

| Measure | Expected |
| --- | ---: |
| Catalog records, including historical/nonselectable records | 238 |
| Eligible choices with both receipts valid | 132 |
| Reviewed choices restored | 123 (19 pilot + 104 reviewed) |
| Remaining legacy eligible choices | 9 |
| Source rows / snapshots | 262 / 262 |
| Evidence links | 719 |

The earlier 133 projection included the now-superseded legacy menacing record. The additional supporting authorities increase source and link counts; this does not add new charge identities. Stored IDs alone do not establish eligibility.

## Verification and release handoff

Database-free checks:

```sh
npx tsc --noEmit
npx vitest run tests/ohio*.test.ts
node --import tsx scripts/data-review/restore-ohio-reviewed-receipts.ts --evidence=/path/to/local-official-acquisitions.json
```

The last command validates only. `--write-receipts` explicitly writes both local receipts after both comparisons pass. It never edits source pins, connects to a database or deploys. Missing, changed, future-dated or stale acquisition evidence aborts the operation.

After code review and approved merge, Replit must publish the reviewed implementation and run the approved Ohio source import against the confirmed production database. Verify the completed import and all 132 eligible choices, including the corrected menacing identity. Confirm the held source-first trespass identity stays unavailable, legacy menacing requires reselection, changed non-English explanations show their notice, and database eligibility is still required. Do not infer successful restoration from receipt freshness or stored link counts alone.

Validation on the restoration branch: typecheck passed; 320 Ohio/coverage tests passed with three skipped. The full local run passed 2,108 tests, with three failed tests and seven failed files (including suite setup failures). The same isolated environment on merged main passed 2,096 tests with five failed tests and eight failed files. The two Ohio failures are fixed; remaining failures concern the pre-existing Florida instruction coverage check and unavailable local service/database/test-runner prerequisites. No production credentials or database connection were used to obtain these results.
