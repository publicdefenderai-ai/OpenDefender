# California archive currency and renewal

California has 174 configured selectable records. Live selection and provenance
also require complete database evidence and a valid, unexpired archive receipt.
The configured catalog remains available for research and reproducible coverage
counts; those counts are not a promise that all records are currently available.

The initial receipt preserves the actual September 24 acquisition time and expires
on **October 1, 2026 at 22:10:49 UTC**. Installing this check does not refresh law.
It binds to the reviewed PUBINFO archive's full SHA-256 and byte count. A record's
`currentness.status` is evaluated on access, including for an already-loaded
object. Server queries check freshness before and after database reads. Old
seeded rows and the release-check fixture cannot bypass expiry. Seeding is refused
when the receipt is stale or invalid; reimporting metadata does not renew evidence.

## Renew an unchanged archive

Run from the repository root:

```sh
node scripts/refresh-california-archive.mjs
node scripts/check-statutory-receipt-freshness.mjs
```

The first command downloads and streams approximately 1.28 GB from the pinned
official publisher URL. It does not retain a second archive or overwrite the
reviewed cache. It verifies a direct HTTP 200 response, transfer length when
provided, complete byte count and SHA-256. Only an identical full archive earns a
seven-day receipt, measured from request start. HEAD metadata, local cache reads,
manifest imports and legal review dates cannot renew it.

Review the receipt diff, commit it through the normal PR process, and deploy the
updated application in Replit. The application imports its receipt at build time;
committing a renewal alone does not update an already deployed application.
No database reseed is needed solely to renew identical archive evidence.

## Changed archive or failed retrieval

The script first writes an unverified receipt. Failure leaves it withheld; a changed
archive records the observed hash and byte count and exits unsuccessfully. Inspect
the cause and retry a transient retrieval failure. If the publisher has changed,
retain a separate new archive and compare the affected primary and supporting
sections against the reviewed evidence before approving a new baseline. Never
replace the old evidence cache or extend dates just to clear an alarm.

Commit and deploy a withheld receipt promptly when change is detected. A running
application does not watch repository files or learn about a local failed refresh;
it continues under its previously deployed receipt until that receipt expires or
the new release is deployed. Updating the pinned baseline requires explicit
source review and tests; this script cannot bless changed law.

This deliberately conservative first gate withholds all California selections when
the common archive expires or changes. An unrelated archive edit also requires
research triage. Future section-level renewal can narrow that impact while keeping
exact primary/supporting dependency checks. Jury instructions and case-law changes
are not independently refreshed by comparing the statutory archive.

## Activate the deadline alarm

Follow `docs/operations/statutory-receipt-monitor.md` to install the supplied workflow
as a repository owner and enable failure notifications. The template is not an
active schedule. It checks all four required receipts daily and fails within 48
hours of expiry. California additionally validates the archive binding and maximum
receipt lifetime. The alarm does not retrieve law or extend any receipt.

There is no continuous source-change detector in this change. A seven-day window
bounds unchecked age; it cannot guarantee detection of an amendment made between
checks. Known future statutory transitions still require the existing review holds.
