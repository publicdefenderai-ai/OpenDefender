# Release investigation: November 5, 2026

Baseline: `f96e4d3c04e1ae4c5860a43cc744c3114f505409`. This is a code-only repair proposal, not deployment clearance. PR107 is not included.

## Repairs

- Replace vulnerable Zod 3 with Zod 4.6.7 and compatible drizzle-zod and React Hook Form adapters. Remove unused zod-validation-error. Preserve validation failures, attorney attestations, input stripping and record limits using Zod 4 APIs. No schema definitions or migrations change.
- Load browser-test catalog fixtures through the application TypeScript loader. Direct transitive JSON imports previously stopped Playwright collection under Node 24. Catalog expectations remain derived from the same application records, not copied identifiers.
- Recognize the official PAlegis blank-frame/literal-loader wrapper without executing JavaScript. Follow only a same-origin, same-path URL with matching citation parameters. Preserve HTTP, redirect, content-type, title, section-marker and extractable-body checks. The importer and contract checker share the wrapper parser; no importer was run in write mode.

The Zod issue is GHSA-mrhx-c7xc-m3w5. This was present on the release baseline. Only the affected validation stack and compatibility call sites are updated; no forced audit repair or unrelated dependency upgrade is used.

## Verification

- Production dependency audit before: two high findings (Zod and dependent zod-validation-error). After: zero findings. Audit uses `npm audit --omit=dev`; it does not claim the development dependency tree is free of findings.
- `npm run check`: passed.
- Production build and `check-source-readiness.mjs`: passed, including generic failure envelopes. The PR105 fix is retained.
- Focused route/startup tests: 36 passed, 8 skipped. Final validation/Pennsylvania tests: 37 passed.
- Full database-free suite result is recorded in the PR. PostgreSQL integration tests are excluded explicitly; no database test is represented as passed.
- Playwright collection: 506 tests discovered without the former JSON-import errors. The release allowlist selects 373.
- Broad browser attempt: stopped after 120 completed tests (115 passed, 5 failed). It is NOT a complete passing release run. No production credentials or database were used.
- South Carolina and North Carolina retained-manifest checks passed. These are not new source reacquisitions.
- Pennsylvania live probes improved from 0/7 to 5/7. Titles 18, 23, 34, 42 and 75 now pass. The configured Title 35 section 1279.105 and Title 47 section 4-406 probes still fail; their consolidated-viewer requests must not be treated as proof of a statutory change. Do not weaken this check or substitute another statute to make it green.
- Illinois live check did not complete in the bounded investigation and was stopped. No result is inferred.
- Existing Georgia/Pennsylvania coverage gate remains failing.

## Browser blockers exposed after collection was repaired

1. The v1 California search test requests 500 results and expects all 703 configured IDs. The endpoint is capped at 500; its all-record expectation cannot pass as written. Reconcile the endpoint pagination contract and test, retaining withheld-ID assertions.
2. Pennsylvania release assertions expect pa-assault-on-peace-officer to be withheld, while the retained manifest supplies it to the release fixture. A separate Pennsylvania search/guidance assertion also fails. Reconcile the reviewed manifest and test expectations before changing either; this PR does not change legal eligibility.
3. The ca-dui-23152-f selector test times out. No cause or baseline equivalence is asserted from this run.
4. The California unavailable-authority questionnaire test fails. Preserve the fail-closed UI contract while investigating; do not suppress this assertion.

These are newly exposed results, not all independently proven baseline regressions or baseline failures. The broad browser check was previously unable to collect these tests. Remaining browser checks are unverified.

## California candidate, separate approval track

A new official archive was acquired at 2026-11-05T07:24:42.241007Z. All 959 retained section keys / 967 versions compare unchanged. Public comparison evidence and provenance are supplied separately outside Git. No source pin, active receipt, transition hold or attorney decision changes in this PR.

The existing receipt expires November 5 at 23:28:32 UTC (3:28:32 p.m. Pacific). The quarterly policy does not itself extend that receipt. A later approved issuance must preserve the candidate acquisition anchor and use the reviewed comparison procedure. Do not copy dates into a receipt manually.

## Replit handoff

1. After review and authorized merge, sync the exact resulting commit and report its SHA. Do not publish merely because regression CI is green.
2. Re-run audit, typecheck, production build and source-readiness check on that exact revision. Resolve/review the browser and coverage/source blockers above; do not silently skip them.
3. Run authority-boundary integration checks only against an explicitly disposable, isolated database with all production/development application credentials removed. No original database is authorized for those seed-based tests.
4. Obtain a Publishing schema preview only at the later publication decision. Do not approve unexpected statements. This code repair has no schema changes.
5. Ohio pilot tables/append-only trigger remain a separate approval matter. Without shared pilot verification, the pilot must remain withheld. The 104 separately reviewed charges have an independent gate, but their production verification is not established by this review.
6. California receipt issuance/activation, any imports/migrations, monitoring enablement and publication each remain outside this work's authorization. All startup safeguards, connection precedence, inert post-merge setup, legal holds and Florida warning translations remain unchanged.
