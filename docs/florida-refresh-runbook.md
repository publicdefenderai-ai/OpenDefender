# Florida reviewed evidence refresh runbook

This is a development-only, manual recovery procedure for the reviewed Florida
source-first artifacts. There is **no reminder, scheduler, or automatic refresh
installed**. The preflight is read-only: it makes no network requests, writes
nothing, and cannot activate records or extend timestamps.

## Check freshness

Run:

```sh
npm run review:florida-freshness
```

The command prints JSON and exits nonzero if evidence is expired, is within the
48-hour lead window, is missing or stale, has hash drift, needs reassembly, or
has malformed/tampered metadata. `expiresAt` is the receipt's actual value;
`dueBefore` is exactly 48 hours earlier. Treat `invalid` as fail-closed.

The dependency lists drive selective recovery:

- `requiringRetrieval`: retrieve only these statute sections.
- `missing`: a required report, receipt, or cache binding is absent.
- `stale`: cached evidence is older than seven days (or future-dated).
- `hashDrift`: the retrieved body changed, or a hash/body binding is invalid.
- `reassemblyRequired`: the cache has a newer retrieval of the same body. No
  further retrieval is needed, but the old report/receipt timestamp is still
  authoritative until explicit reviewed activation.

## Selective recovery

1. Stop on any metadata error. Restore or regenerate the affected artifact; do
   not infer approval from nearby rows.
2. For a pre-expiry refresh, pass the preflight's required sections explicitly
   to the forced exact-recovery path:

   ```sh
   npx tsx scripts/data-review/florida-exact-recovery.ts --refresh --sections=<comma-separated-required-sections> --max-requests=<1-to-30>
   ```

   `--refresh` performs actual network retrieval instead of accepting a fresh
   cache entry or reparsing the raw-response cache. Do not combine it with
   `--reparse-raw`. The request cap is at most 30; split more than 30 required
   sections into explicit batches and run each batch separately. Outside a
   deliberate full pre-expiry refresh, retrieve only sections listed in
   `requiringRetrieval` and skip fresh sections. Preserve authentic official
   source bodies, hashes, URLs, editions, and retrieval times.
3. Rerun the preflight against the recovered cache.
4. If a body hash changed, keep all dependent records held. Re-check quoted
   identity, conduct, grading, definitions, exceptions, and justifications,
   then obtain the required explicit evidence/legal review. Never copy the old
   approval to a changed hash.
5. If a newer retrieval has the same hash, existing approved quote bindings
   remain useful, but freshness is not automatically renewed. Reassemble the
   report and receipt and perform explicit reviewed activation. This is not
   auto-approval.
6. Follow the two-step commands in `docs/florida-runtime-contract.md`:
   `--prepare`, review the exact prepared report, then
   `--activate-reviewed`. Activation must remain a deliberate reviewed act.
7. Rerun the preflight and require `ok: true` before relying on the reviewed
   runtime artifacts.

The `--refresh` path permits deliberate retrieval during the 48-hour lead
window; the preflight itself still does not retrieve anything. Reissuing or
editing a receipt cannot extend the evidence's seven-day lifetime. No command
in this runbook installs a reminder, scheduler, or automatic refresh.

## September 26 recovery and deployment

The September 25, 2026 21:18:23 UTC receipt expired. Independent checks reproduced
three failing tests and a manifest reduction from 218 to 117 records. The public
Case Guidance selector showed 25 Florida charges on September 26; this observation
does not establish when production first lost the other 101 selections.

All 92 required official sections were retrieved again in four bounded batches
(30/30/30/2). Each section's full extracted text, title, section identity, URL,
edition, effective-date field and recomputed content hash matched the previously
reviewed evidence. The exact prepared report also matched the previous report
apart from genuine retrieval timestamps. Existing legal decisions were preserved;
no changed text was approved. See
[the comparison receipt](../scripts/data-review/output/florida-refresh-2026-09-26.json).

The recovered local manifest has 218 records and 126 selectable charges (25 legacy
plus 101 source-first). This is not a claim of deployment or statewide completeness.
The new expiry is **2026-10-03 01:39:08 UTC**, with a refresh target before
**2026-10-01 01:39:08 UTC** (September 30 at 6:39 p.m. Pacific).

After the recovery PR is merged, in Replit:

1. Pull the latest GitHub main branch.
2. Run `npm run review:florida-freshness`; require `ok: true`.
3. Run `npm run db:seed:florida -- --dry-run`; expect 218 manifest records and
   126 selectable charges for this snapshot.
4. Run `npm run db:seed:florida`, then republish/restart the deployment so its
   server loads the new committed receipt and evidence.
5. Check the public Florida selector for 126 charges. If it still shows 25, check
   that the published server and database received this revision; do not weaken
   the freshness gate.

Structural tests now use the receipt's issuance time so they do not change with
the calendar. Separate tests verify exclusion exactly at expiry, including a
previously composed manifest. These tests do not certify present freshness:
`npm run review:florida-freshness` remains the real-clock operational check.
Run that check daily and before deployment. A recurring source-maintenance job
is still needed to prevent this class of interruption across states; no scheduled
job is installed by this change. It should alert before expiry, compare unchanged
sources mechanically, and route changed authority for review without copying its
old approval.
