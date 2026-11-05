# California quarterly source refresh

This is a check of previously reviewed statutory evidence, not another review of every charge. It does not establish statewide completeness or review new case law. Existing attorney decisions, removals, and legal-source holds remain in force.

## Who does what

1. **Owner:** authorize preparing a refresh. No terminal commands are required of you.
2. **Codex:** download the official archive into a separate candidate folder and compare every pinned section/version with the reviewed evidence. Report unchanged, changed, missing, and future-version differences. This step does not alter the active receipt.
3. **Codex:** when authorized, prepare a receipt update in a draft PR. If all retained sources are unchanged, the new deadline is three calendar months after the actual acquisition, not after merge or deployment. Changed or missing dependencies remain held; they require separate substantive review.
4. **Reviewer and owner:** review the PR and approve its merge. This updates GitHub, not the running application.
5. **Replit:** sync the approved commit, complete release checks, and inspect the Publishing schema proposal. A receipt-only update requires no database import or migration for sources already imported. Report any unexpected schema changes instead of approving them.
6. **Owner:** authorize publication after release blockers are resolved. Replit publishes only after this approval.
7. **Replit or Codex:** read the public California status endpoint and verify the deployed receipt's acquisition time, deadline, holds, and selectable IDs against the approved commit. Report completion only after the live values match.

The owner approves decisions; Codex prepares and tests evidence/code; Replit handles the production deployment. Do not ask the owner to manually edit receipt dates or database records.

## Codex commands: prepare candidate evidence

Use a new candidate directory for each refresh. Keep the original historical archive and publication packets unchanged.

```sh
python3 scripts/data-review/california-verification/refresh-retained.py \
  --acquire --transport curl \
  --candidate /absolute/path/to/new-candidate
```

Without `--activate-unchanged`, outputs stay in that directory. Preserve its `archive.zip`, acquisition receipt, comparison, and changed-source evidence. The archive is about 1.3 GB and should not be committed to Git.

Review the comparison before proceeding. Matching ZIP hashes alone are insufficient: the comparison checks retained legal text and version metadata, including code identity, version IDs, effective dates, and active flags. Publisher transaction timestamps alone do not establish amended law. New statutes outside the retained set are not certified by this check.

## Codex commands: prepare the authorized receipt PR

On a clean branch, replay the genuine candidate. Do not acquire again merely to restart its clock.

```sh
python3 scripts/data-review/california-verification/refresh-retained.py \
  --candidate /absolute/path/to/new-candidate \
  --activate-unchanged
node scripts/check-statutory-receipt-freshness.mjs
```

Here `--activate-unchanged` writes repository receipt/comparison files; it does **not** deploy or change the production database. It requires an authentic candidate acquired less than seven days ago. This candidate-admission limit is distinct from the three-calendar-month quarterly verification period.

Review the diff. Expected files are:

- `scripts/data-review/output/california-archive-refresh-receipt.json`
- `scripts/data-review/output/california-retained-refresh-comparison.json`
- `scripts/data-review/output/california-changed-source-evidence.json`

Check that the archive binding, pinned sections, prior approvals, and intentional holds are preserved. Run the California freshness and affected integration tests. The cross-state monitor can still fail for another state's expired receipt; report those results separately, without changing them to make California's check pass.

If retrieval fails, stop and report the access problem; do not infer that law changed. If retained content differs, retain the evidence and holds for review. Never extend dates, discard changed dependencies, or rewrite historical review packets to clear an alarm. The combined `--acquire --activate-unchanged` mode can write an unverified repository receipt before acquisition; use the separated steps above so research cannot overwrite the active repository receipt accidentally.

## Deployment and confirmation

The application bundles the receipt at build time. Merging alone does not renew the live site. Replit must build and deploy the approved revision after publication approval. No new seed is needed solely to renew unchanged evidence already imported.

Seeding is refused when the receipt is stale or invalid; reimporting metadata does not renew evidence. Existing seeded rows and release-check fixtures cannot bypass expiry.

Read-only public check:

```sh
curl --fail --silent --show-error \
  https://opendefender.net/api/statutes/sources/california/status
```

Confirm `archiveEvidence.status`, `checkedAt`, `expiresAt`, and `heldSourceKeys`. Compare selectable IDs across all catalog pages with the approved catalog, not just a count. Do not equate stored source rows or linked charge counts with eligibility. If missing database evidence is discovered, report it for separate import approval; do not run an import as part of this routine refresh.

## Monitoring and future updates

See [cross-state verification policy](source-verification-policy.md). Quarterly verification and automated availability checks serve different purposes: availability checks can report inaccessible sources but cannot renew receipts or approve legal changes. Monitoring activation is a separate decision. Known statutory transitions still require their existing review deadlines and holds even between quarterly refreshes.

Historical renewal examples and earlier counts remain in Git history. They are not instructions for the current deployment. Use the approved receipt and live status for the current deadline.
