# October 1 evidence renewal and release handoff

This maintenance batch renews evidence through actual official-source retrieval. It does not approve changed statutes, remove legal holds, or add charges. California's next coverage batch remains the consequential forgery, access-card and bad-check comparisons plus reuse of already-reviewed benchmark matches.

## Ohio

The Chapter 2903 refresh compared all 61 official dependencies against their reviewed text, title and effective-date pins. The reviewed-catalog refresh compared 170 dependencies, including administrative rule 3701-12-01. All matched. The existing section 1509.01 criminal-trespass hold remains in place.

The first reviewed-catalog attempt encountered malformed chapter-page boundaries for sections 4561.15, 4737.012 and 4737.04. Exact official section retrieval recovered them with unchanged hashes. The refresh now persists successful acquisitions after partial failure, reports acquisition errors, and permits bounded exact-section recovery only for malformed chapter boundaries. It does not retry throttling or silently use old text after failed retrieval.

For deliberate pre-expiry renewal:

```sh
npm run review:ohio-pilot-refresh
node --import tsx scripts/data-review/refresh-ohio-reviewed-sources.ts --acquire --force --max-requests=100
```

`--force` requires acquisition. It bypasses the fresh-cache shortcut without changing any approval pin. To recover an interrupted or failed batch without repeating successful requests:

```sh
node --import tsx scripts/data-review/refresh-ohio-reviewed-sources.ts --acquire --retry-failures --max-requests=20
```

An unchanged cache replay preserves original retrieval times. Failed or changed dependencies continue to block renewal.

## Florida and California

Florida reacquired 92 required official sections. All source bodies and legal metadata matched. The prepared reviewed report was identical after excluding genuine retrieval/generation timestamps, and all 101 reviewed decisions were preserved through explicit activation. California reacquired the official archive and matched all 839 retained sections / 847 statutory versions; no new source holds were required. No retained pin or charge definition changed.

All four receipts now expire October 8, 2026, at approximately 18:00 UTC (11:00 a.m. Pacific); the exact instants remain in each receipt. The earliest deadline is the Ohio pilot at 17:58:30 UTC. Plan the next renewal before October 6, not at expiry. The comparison audit is `scripts/data-review/output/statutory-renewal-2026-10-01.json`.

## CI and deadline monitoring: one owner action

The active workflow still uses the old installation step and omits Python. PR 49's two CI jobs failed before tests because Vitest and Playwright were missing after npm's internal installation failure. Local validation is separate from remote CI success.

Apply the consolidated patch using Replit's existing authorized GitHub connection:

```sh
git apply --check docs/operations/ci-and-receipt-monitor.patch
git apply docs/operations/ci-and-receipt-monitor.patch
```

Review and commit the two workflow files. This supersedes `docs/ohio-ci-install-fix.patch`; do not apply both. It uses Node 24, explicitly installs development dependencies, checks test binaries, adds Python unittest discovery, and installs the existing daily receipt alarm with read-only repository permissions. Seven Python test files currently contain 32 tests; the claimed twenty-two Python test files was not reproduced.

After pushing, verify the regression jobs and manually run the receipt alarm. Enable Actions failure notifications for the maintainer. The alarm does not retrieve statutes or deploy the app. No broader token is requested or required.

## Deployment

A merged receipt does not update a running server. After this maintenance PR is reviewed and merged, pull main in Replit, run `node scripts/check-statutory-receipt-freshness.mjs`, build, and republish/restart. Do not weaken the freshness gate if this check fails. Unchanged source renewal alone does not require reseeding already-present sources. If a database is behind the catalog, use the existing jurisdiction-specific dry-run and seed procedures before checking public availability.

On October 1 the public Florida charge-list endpoint returned 126 choices, matching the restored 25 legacy plus 101 reviewed configuration. This contradicts the reported missing restoration but does not identify the deployed commit or certify every production behavior. No user records were accessed.

The scope here excludes bulk deletion of remote branches. Other chats may still use merged branch names; cleanup should account for active worktrees rather than delete them solely because a PR merged.

## Validation

110 focused TypeScript tests across 13 files, all 32 Python tests, typecheck and the production build passed. The real-clock receipt monitor reports all four receipts current. The consolidated workflow patch passes `git apply --check`. Remote CI repair and production deployment of these new receipts remain owner actions; no production database was changed.
