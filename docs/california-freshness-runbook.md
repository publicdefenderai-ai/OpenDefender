# California archive currency and renewal

California has 174 configured selectable records. Live selection and provenance
also require complete database evidence and a valid, unexpired archive receipt.
The configured catalog remains available for research and reproducible coverage
counts; those counts are not a promise that all records are currently available.

The initial receipt preserved the September 24 acquisition and October 1 deadline.
The current receipt is tied to an actual candidate acquisition; see its `checkedAt`
and `expiresAt` fields. Offline comparison never restarts that clock.
It binds to the reviewed PUBINFO archive and, for a changed ZIP, the exact pinned
set of retained statutory versions. A record's
`currentness.status` is evaluated on access, including for an already-loaded
object. Server queries check freshness before and after database reads. Old
seeded rows and the release-check fixture cannot bypass expiry. Seeding is refused
when the receipt is stale or invalid; reimporting metadata does not renew evidence.

## Renew retained statutory evidence

Run from the repository root:

```sh
python3 scripts/data-review/california-verification/refresh-retained.py --acquire --activate-unchanged
node scripts/check-statutory-receipt-freshness.mjs
```

The first command acquires a separate official candidate archive (approximately
1.28 GB), records authentic request-start time, verifies transfer length and the
archive SHA-256, and compares all 304 retained sections / 307 versions. It preserves
the original reviewed archive. Only unchanged text hashes and legal/version metadata earn a seven-day receipt.
Changed or missing sections remain explicit holds; every dependent charge is
withheld while unrelated charges remain eligible. Code identity, version IDs,
effective dates and active flags all participate. Publisher transaction update
timestamps are retained separately in the comparison audit. The real refresh
changed those timestamps on every retained row without changing most statutes;
timestamps alone are not treated as amended statutory content.
ZIP member locations, table positions and publisher transaction-user IDs are
excluded because they do not establish statutory content or version identity.

The explicit pins also participate in the running application's validation. A
missing, duplicate, unaccounted-for change or differently acquired comparison row
invalidates the receipt. Explicitly held rows cannot support dependent records. Tests require the pins to cover all retained artifacts and every configured
primary/supporting statutory URL. Expanding the evidence set requires an explicit
pin update; acquisition alone cannot grant approval to new charges.

To replay an already acquired candidate, omit `--acquire`. Its original retrieval
time is preserved; a stale candidate cannot be activated. Without
`--activate-unchanged`, the script produces comparison evidence only. Changed or missing versions require substantive review. Activation renews only the
unchanged subset and records the rest as mandatory source holds.

Review and commit the comparison, receipt and changed-source evidence, then deploy
the updated app.
The server imports them at build time: a repository commit alone does not renew a
running application. Follow `docs/pr23-release-checklist.md` to seed missing
California source rows and confirm the exact receipt and selector in production.
No new database seed is needed solely to renew an unchanged set already seeded.

## Changed source or failed retrieval

An acquisition attempt first writes an unverified receipt. Retrieval failure leaves
it withheld. A changed dependency records a comparison hold and cannot be approved
by this command, even when `--activate-unchanged` renews the unaffected subset. Resolve source differences through the existing legal-review
process; never extend dates, replace pins, or drop a changed dependency merely to
clear the alarm.

Commit and deploy a withheld receipt promptly when relevant source changes are
confirmed. The running app does not observe local files; until deployment it uses
its prior receipt and deadline. A failure confined to corrupt local candidate files
requires recovery of the genuine evidence, not a conclusion that the law changed.

The original `scripts/refresh-california-archive.mjs` remains a whole-archive
comparison diagnostic. It rejects any archive byte change. Use the retained-source
procedure above for routine renewal so unrelated archive churn does not force legal
review of unchanged statutes. The publisher's documented Sunday full-session load
makes such churn an expected maintenance case.

A changed retained section holds only configured records declaring it as a primary
or supporting dependency. Jury instructions, case-law
changes and new statutes outside the retained set are not certified by this check.
The original statewide discovery snapshot also remains historical; retained-source
renewal does not rerun statewide discovery or establish completeness.

## Activate the deadline alarm

Follow `docs/operations/statutory-receipt-monitor.md` to install the supplied workflow
as a repository owner and enable failure notifications. The template is not an
active schedule. It checks all four required receipts daily and fails within 48
hours of expiry. California additionally validates the archive binding and maximum
receipt lifetime. The alarm does not retrieve law or extend any receipt.

There is no continuous source-change detector in this change. A seven-day window
bounds unchecked age; it cannot guarantee detection of an amendment made between
checks. Known future statutory transitions still require the existing review holds.

## September 28 renewal

The publisher regenerated the session archive with a Last-Modified timestamp of
September 28 at 04:26:06 UTC. The separately retained candidate was acquired at
04:30:01 UTC. Comparison found 303 unchanged retained sections and one changed
section, PEN:30515. The renewal expires **October 5, 2026 at 04:30:01 UTC**.

`ca-possession-of-prohibited-weapon` remains configured for research but is withheld
from live selection/provenance. Its supporting assault-weapon definition changed
from one retained version to two publisher versions with distinct operative periods.
The new texts and metadata are in
`scripts/data-review/output/california-changed-source-evidence.json`; they are held,
not a new legal approval. Resolve the current definition and known enforceability
question together before restoring this charge. This release expects 173 live
California selections after successful seeding and deployment, out of 174 configured.
