# PR 23: code readiness and production release are separate

## Independent review of the reported operational issues

Read-only checks of the public application on September 28, 2026 UTC found:

- Florida: 126 public selections. The earlier observation of 25 is no longer current.
- California: zero public selections, zero persisted sources/snapshots/links, and no completed seed run. The loaded manifest reports 99 configured selections, predating the current 174-record release. Updating code alone cannot populate this database.
- The receipt monitor is still an installation template in this checkout. Do not count it as active monitoring.
- Python safety tests are already wired into `tests/california-verification.test.ts`: it invokes unittest discovery through the existing Vitest entry point and fails if Python or the tests fail. Both Python test files are included; 16 Python tests passed locally, including the new retained-source comparison tests. `acquire-protected-person.py` is an acquisition program, not a unittest file; CI must not blindly execute it against a missing 1.28 GB archive or regenerate reviewed artifacts.
- The dependency installation correction in `docs/ohio-ci-install-fix.patch` remains an owner installation item. A workflow that cannot start Vitest cannot execute its Python bridge either. Install that fix rather than adding a redundant test invocation.
- Working on the PR branch while a PR is reviewed is expected. After merge, this task returns to main without staging unrelated files.

These observations are timestamped evidence, not a promise of the current production state. Recheck after publication.

## Owner release steps in Replit

1. Pull merged main. Check that it includes this PR's revised freshness code and receipt.
2. Run `node scripts/check-statutory-receipt-freshness.mjs`. Require all four receipts to pass. If any is due or invalid, renew it using its existing runbook and deploy the reviewed result; never change the timestamps manually.
3. Run `npm run db:seed:california -- --dry-run`. For this release, expect 174 selectable charges, 174 catalog records and zero stored statutory-text snapshots. This is manifest validation, not proof of database seeding.
4. Run `npm run db:seed:california` against the database used by the published app. Require a successful seed. Do not assume a development database is the deployment database.
5. Republish the application so the server loads the merged code and receipt. A workspace pull or seed alone is not deployment.
6. Run `node --import tsx scripts/check-california-deployment.ts` from the same checkout. Require `ok: true`. It reads only the public status and charge endpoints, checks the exact receipt dates/hash/method loaded by the server, a completed seed, and the exact eligible charge IDs (173 available, with one of 174 configured records held). No admin token or user/case data is involved.
7. Confirm the public Florida selector still has 126 entries. Failure is a release issue to investigate; do not relax evidence checks to restore counts.

The public California status response adds `archiveEvidence` for this check. Existing audit/manifest counts describe configured records and are not proof of live eligibility. Receipt metadata consists only of public statutory-source identity and dates.

## Owner GitHub Actions steps

Apply `docs/ohio-ci-install-fix.patch` to the regression workflow through an owner-authorized workflow edit. It selects the tested Node version, explicitly includes development dependencies, and fails immediately when the test executables are absent.

Install `docs/operations/statutory-evidence-freshness.yml` at `.github/workflows/statutory-evidence-freshness.yml`, run it manually and enable failure notifications as explained in `docs/operations/statutory-receipt-monitor.md`. These workflow writes are kept outside the repository-scoped token's permissions. They are concrete outstanding installation steps, not completed work.

## Maintenance priority after release

The [publisher's PUBINFO instructions](https://downloads.leginfo.legislature.ca.gov/pubinfo_Readme.pdf), page 3, prescribe daily incremental loads Monday through Saturday and full current-session loads on Sunday. Plan for routine archive changes, not rare exceptions. This establishes the intended update process, not a guaranteed publication time or service level.

The first real refresh encountered a changed archive hash, so dependency-level
comparison was pulled into this PR rather than deferred. All retained keys are
mapped to every candidate source version and compared with explicit pins. The
original archive remains intact; unchanged retained versions can renew without
approving unrelated source changes. The real comparison found one changed dependency, PEN:30515. Its dependent charge
is explicitly held; the 303 unchanged sections can support the other 173 configured
charges. Broader statewide rediscovery remains separate from this retained-source
renewal.

The current gate remains conservative for every changed dependency. Neither merging this PR nor installing the deadline alarm constitutes a Replit deployment or a continuous source-change detector.

## Receipt deadlines after this review

California: October 5, 2026, 04:30 UTC (real September 28 acquisition, one source hold).
Ohio Chapter 2903: October 1, 19:33 UTC. Ohio reviewed: October 1, 21:11 UTC.
Florida: October 3, 01:39 UTC. Those three receipts were not renewed by this
California comparison. Their renewal and publication remain required before the
listed deadlines; a successful California check does not renew another state.
