# Ohio pilot source operations

## Boundary and activation

This is a bounded Chapter 2903 pilot, not all Ohio law. Scheduling, official
source acquisition, and legal interpretation are separate:

- GitHub Actions checks the **published app** every six hours (UTC). PostgreSQL
  schedules full comparisons every 24 hours, or six hours after failure.
- All instances read the same database receipt. There is no positive process
  cache or production fallback to the committed JSON receipt.
- Full normalized official text, title and effective date must match every
  reviewed pin, including **2929.02 and all other declared dependencies**.
  A receipt lasts at most seven days. Failure revokes it immediately.
- Fetching never updates legal text, charge mappings, reviewed pins or legal
  interpretations. A discovered change latches a review hold even if the
  publisher subsequently reverts the page. Routine name-review spreadsheets
  are not part of this process.

No production environment, database, deployment or scheduler secret has been
changed by adding this implementation. Before enabling it, use the approved
deployment/environment workflow to:

1. Confirm which database the deployed app uses. Development installation uses
   `migrations/0005_ohio_pilot_refresh.sql`, including its append-only review
   trigger. The recovery hold disables automatic post-merge installation:
   schema installation requires a separately approved, scoped command.
   For a Replit-managed production database, use the approved Publish schema
   workflow. For an external production database, use that database's separately
   authorized migration workflow. Verify both tables and the append-only trigger
   before activation. No migration runs during HTTP startup.
2. Deploy the application code. The pilot remains withheld until this database
   obtains its first live receipt and source reactivation succeeds; do not
   import an old filesystem receipt as production approval.
3. Obtain the published URL through the deployment workflow, not a development
   domain. Configure GitHub repository variable `OHIO_PILOT_APP_URL` and secret
   `OHIO_PILOT_ADMIN_TOKEN` using the approved environment/secret mechanism.
   The credential uses the app's existing admin authorization.
4. Confirm Actions and Issues are enabled, the workflow can write issues, and
   an operator watches workflow failures and the generated alert issue. Run
   the workflow manually against the intended environment, then set repository
   variable `OHIO_PILOT_SCHEDULER_ENABLED=true` to enable unattended checks.
5. Confirm a healthy response, future next-check time, audit evidence and
   restored source links. Never claim monitoring is active merely because
   the YAML is present. GitHub schedules only execute from the default branch.

The scheduler keeps its HTTP request open until comparison and reactivation
finish, so work does not rely on an idle Autoscale instance continuing to run.
There are no startup timers or source requests blocking the server port.
Claims revoke the old receipt conservatively while checking. A 45-minute
database lease permits recovery after process death; a stale worker cannot
publish after lease takeover. Concurrent scheduler/CLI/retry requests cannot
claim the same job. Failures and review holds return a non-success response
to the scheduler. A killed or missing scheduler is also visible as an overdue
check in operator status; Actions alone cannot notify if Actions itself stops.
Operators should monitor the status endpoint independently if continuous
alert delivery is required.

## Operator endpoints

All these endpoints require the existing admin bearer header (or admin API-key
header) and rate limiting. Do not expose admin credentials in URLs or logs.

- `GET /api/statutes/sources/ohio/pilot-refresh`: health, upcoming-expiry notice
  (48 hours), overdue notice, receipt expiry, current pinset, latest run ID,
  ten recent comparison runs and twenty immutable review decisions. Run metadata
  records expected/observed normalized text, hashes, titles, effective dates and
  official URLs for every section, including all changes in a single run.
- `POST` to that path: check if due and run the comparison.
- `POST .../pilot-refresh/retry`: explicit immediate retry, still lease-protected.
- `POST .../pilot-refresh/review`: explicit legal decision; see below.

No request may specify an arbitrary source URL or fetch implementation.
Errors, malformed pages, publisher throttling and text changes remain distinct
in the exact-section run evidence. Structured server events identify run IDs
and warnings without user/case data. The scheduler opens one deduplicated
operator issue and appends later failures. Close it only after checking recovery.

The CLI `npm run review:ohio-pilot-refresh` uses the connected shared database
and the same lease/audit/reactivation path. Run it only in the explicitly
intended environment. `--local-receipt` is an offline-development review aid
and is prohibited in production; it cannot renew runtime authority.

## Amendment, legal review, and reactivation

1. Retrieve exact evidence. Identify every changed section, including supporting
   sentencing rules such as 2929.02, not merely the offense section. An outage
   is not an amendment, and a readable amendment is not an approved mapping.
2. A legal reviewer assesses applicable effective dates, quoted claims,
   penalty/definition dependency closure, catalog mapping and temporal scope.
   Update the separately pinned source text and dependent interpretations only
   through a reviewed code change. Do not edit a receipt or mark a changed
   live page approved from the scheduler.
3. Deploy reviewed pins through the appropriate deployment workflow. Run an
   immediate live comparison. A clean comparison against the new pins is
   recorded, but an existing review hold or a changed deployed pinset is
   **not** automatically cleared.
4. After reviewing that exact latest run, submit:

   ```json
   {
     "runId": "<latest matching comparison run ID>",
     "pinset": "<current deployed pinset from status>",
     "reviewer": "<accountable legal reviewer>",
     "note": "<legal decision, affected sections including sentencing dependencies, effective-date analysis and reviewed change reference>",
     "decision": "approve"
   }
   ```

   Approval requires a still-fresh matching comparison receipt and the current
   deployed pinset. Old run IDs, concurrent refreshes, mismatched pins and
   expired comparisons are rejected. Reviewer attribution is supplied by the
   authenticated operator; it is not independent verification of qualifications.
   `decision: "reject"` records the decision and maintains the hold.
5. Approval appends an immutable review decision and re-seeds source links using
   the shared receipt. This is necessary when expiry previously removed pilot
   rows from the seed. Failure to reactivate revokes the receipt and requests
   retry. Confirm current runtime selection **and provenance**, not just HTTP
   success or an issued receipt.

Existing source snapshot review controls remain in place. An unresolved
snapshot review can still withhold a charge after pilot receipt approval.
Neither the pilot scheduler nor its review endpoint bypasses those controls.
If reactivation reports failure, inspect `pendingSourceReviews` in the operator
response (also `GET /api/statutes/sources/ohio/pending`). Review every changed
source snapshot, including 2929.02, using
`POST /api/statutes/sources/ohio/review/<snapshotId>` with `decision`, `reviewer`
and a substantive `note`. This uses the existing append-only source-review
audit. Then retry the live refresh. A pilot approval does not auto-approve
these snapshots. Reactivation verifies current selection for the pilot and
revokes the receipt if required source links remain unavailable.

## Verification

Focused tests cover official comparison evidence, 2929.02 changes, expiry,
upcoming warnings, shared-runtime fail-closed behavior, concurrent claims,
interrupted workers, rejection and reviewed reactivation. Run:

```
npx vitest run tests/ohio-pilot-refresh.test.ts tests/ohio-pilot-scheduler.test.ts tests/ohio-provenance-freshness.test.ts
```