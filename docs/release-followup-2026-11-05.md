# Release follow-up: search pagination and source-check diagnosis

This code-only follow-up is based on PR108 at `4acfa725ef34b722cbbbc03608de6a25e1be2640`. It does not modify PR108, renew receipts, change legal eligibility, run database operations, enable monitoring or publish.

## Changes

- Charge-only search now applies `offset` after authority filtering and before returning a page. The v1 endpoint previously ignored offset, while the shared search service truncated charges before pagination. More than 500 matching charges could therefore not be retrieved across search pages. The v1 maximum remains 500 per page. Invalid offsets return 400. Mixed-content relevance grouping is preserved.
- Browser and API completeness tests now traverse all search pages and retain exact membership, duplicate and withheld-ID checks. The API documents the offset parameter.
- Pennsylvania browser assertions follow the existing reviewed manifest: two exact aliases are positively asserted, and actual removed identities exercise negative API/export/guidance paths. Jurisdiction-scoped assertions use a jurisdiction-scoped search.
- The California unavailable-authority test expects the current explicit loading-failure notice while still asserting no fallback charge is selectable. The prior DUI selector timeout passed unchanged on rerun; this is not represented as a diagnosed product defect.
- Pennsylvania representative-title probing excludes only identities with an explicit existing `remove` decision. Holds remain included. Title 47's rejected consolidated citation is no longer a renewal prerequisite; Title 35 remains unresolved because held drug references still require a supported unconsolidated-source contract. This does not change coverage accounting, the manifest, a hold or a legal decision.
- Illinois certificate-validation failures stop after the first request rather than being retried for every section. The error explains that source verification is incomplete. No TLS bypass or trust-store/configuration change is made, and no manifest/audit artifact is written on this path.

Additional release repairs found during the broader run:

- Complete both site-search and v1-search pagination assertions, including jurisdiction checks on every page.
- Give the record-clearance state selector a translated accessible label and a stable test target, distinct from the page's language selector.
- Include the 20 configured Ohio major IDs in the database-free release fixture. Their receipt/hold gates still run; no production import or eligibility is granted.
- Wait for the AI-polish response handler to establish cooldown before advancing the simulated clock, and assert the daily-limit state on the twentieth request. Application throttling is unchanged.
- Wait for the counsel page's dropdown close-autofocus before testing subsequent hash navigation. Focus-event diagnostics identified the race; the speculative page-code change was removed.
- The readiness UI test now honestly expects both GA and PA blocked, matching the unchanged coverage gate.

## Validation and remaining boundaries

Full database-free regression suite: 2,323 passed, 75 skipped (PostgreSQL tests excluded). Typecheck and production build pass. The final bundled source-readiness checker passes. After the fixture change, 36 focused startup/Ohio/policy tests pass.

The initial three browser suites passed 26 tests. A broader run then passed 339 and exposed five later failures, with 30 not run. Follow-up runs exercised the unrun files and repaired failures. Inventory reconciliation finds a passing result for all 374 unique release-browser scenarios across those runs; this is not a claim that one uninterrupted full run passed. The corrected cooldown and counsel scenarios passed three repetitions. One extra shared-server readiness repetition failed its admin request; fresh-server readiness results are recorded in the PR. The strict ten-admin-requests-per-hour limiter is unchanged.

These results do not establish database-boundary verification or deployment clearance.

The actual Illinois request failed with `UNABLE_TO_VERIFY_LEAF_SIGNATURE`. A separate curl request using normal certificate validation received HTTP 403. This is a source-access failure, not evidence of a statutory amendment. Replit must test from its own supported network environment; do not disable certificate checks or substitute a mirror.

The retained Georgia/Pennsylvania coverage gate remains unchanged. Georgia requires a supported complete-document source contract. Pennsylvania's unresolved/withheld source inventory remains explicitly incomplete. This PR does not resolve those limitations or silently waive them.

## Replit next steps

1. Wait for review and approved merges of PR108 and this follow-up. Sync the resulting main revision and report its exact commit.
2. Run `npm run check`, `npm run audit:dependencies`, `npm run build`, and `node scripts/release-check/check-source-readiness.mjs` independently. Do not use the full release command as a shortcut: it contains seed-based database checks.
3. Run the read-only `npm run review:pennsylvania-source` and `npm run review:illinois-source` checks and report outcomes. Pennsylvania currently remains blocked on Title 35. Illinois must be checked from Replit's environment with normal TLS verification.
4. Run browser release checks against the isolated release-check server. Preserve every authority and withheld-ID assertion.
5. Database authority-boundary tests require a separately approved, isolated disposable database. No application production/development database is authorized by this handoff. Ohio pilot schema, imports and monitoring remain separate actions.
6. The prepared California archive comparison remains separate and unactivated. Its existing receipt expires November 5 at 23:28:32 UTC. A quarterly policy change does not extend it. Any issuance/activation must use the genuine comparison and a separate owner approval.
7. Do not publish on the strength of these code checks. Outstanding source/coverage limitations require resolution or an explicit owner decision about reduced availability, plus the remaining release checks and Publishing schema inspection.
