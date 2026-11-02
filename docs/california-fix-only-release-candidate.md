# California-only release candidate

## Status

Prepared and locally checked on November 2, 2026. The owner explicitly approved
the California-only candidate's scope on November 2, 2026. **Not published.**
Approval does not cover the broader main checkout, the importer, Ohio activation
or database changes. The post-publication verification task remains incomplete.

The candidate is preserved in the local Git branch
`release/california-reference-identity-only`, commit
`a54626b98a0aa23297650e442ba3fdfa673b3e69`, with a separate
worktree at `generated-artifacts/california-fix-only`.
Its base is `8b4b1cd9594c43d9a49121e6a031a831c3dbbc16`, the last publication marker preceding the importer
refactor in this repository. That marker is repository evidence, not proof of
which revision is currently serving production.

The baseline commit's deployment trailer identifies build
`b01541b0-9548-4d62-9961-2ece830ab582`. The transfer packet includes the verbatim
Git commit metadata. This ties the candidate's parent to a recorded publication,
but available deployment metadata and public API responses do not independently
identify the currently serving backend commit. The release operator must match
that build/commit against the active deployment before using it as the serving
baseline. Do not interpret the public 702-ID behavior as proof of a Git SHA.

## Exact scope

The candidate changes only these four files relative to that base:

- `server/services/california-source-database.ts`
- `tests/california-reference-identity.test.ts`
- `tests/california-correction-authority-boundary.test.ts`
- `tests/california-freshness.test.ts`

The only application change includes the snapshot's specific section citation
in the exact reference identity and the selectable-ID query. Existing URL,
support-role, canonical-citation, subdivision, uniqueness, cardinality and
freshness requirements remain enforced.

The candidate excludes the faster California importer and the newer Ohio pilot
rollout. It changes no schema, source receipt, source hold, legal mapping,
connection setting, startup command or production data. Newer work remains on
the task workspace's main branch; nothing was removed or reverted there.

The importer rehearsal document now records ten passing disposable-PostgreSQL
cases. Therefore the old description that its isolated verification was still
queued is outdated. That result is not approval to bundle the importer or Ohio
work with this narrower candidate.

## Checks actually run against the isolated candidate

- TypeScript: `tsc --incremental false` passed.
- `npm run build` passed; bundle-size warnings remain.
- Six focused test files passed, 61 tests total:
  reference identity, correction authority boundary, freshness, deployment
  assessment, source database, and source transitions.
- The reference-identity suite includes exact equality with all 703 committed
  selectable IDs, petty theft, rejection of missing/substituted/duplicate
  references, preservation of held records and receipt expiry.

These are offline checks with a mocked database, not evidence of live parity.
No database-connected test, import, migration, receipt renewal or production
operation was run. The full-project suite was not run for this candidate.

## Remaining release steps

1. Scope approval is recorded above. It is not approval of the current main
   checkout's broader changes or a reopening of unrelated recovery operations.
2. In the main project/release workspace, select or reproduce this exact
   candidate on the intended release baseline. Do not publish the broader
   current main branch by accident. Confirm the actual serving revision before
   treating the repository's publication marker as its baseline. If the
   baseline differs, reconcile scope and repeat affected checks.
3. Confirm the candidate's production startup still performs no imports or
   schema changes. Confirm the publishing schema comparison proposes no
   database changes; stop if it does.
4. The owner/release operator publishes only the approved candidate. This task
   workspace must not publish or instruct publication of its current checkout.
5. After publication, run `node --import tsx scripts/check-california-deployment.ts`
   against the verified public deployment and require `ok: true`. At preparation
   time the script uses `https://opendefender.net`; establish that this is an
   active URL for the intended deployment rather than assuming it from code.
6. Independently retain evidence of both catalog pages (500 + 203), exact
   canonical-ID set equality, no duplicates or restored holds, presence of
   `ca-petty-theft`, and read-only production evidence that the committed import
   remains completed with 703 linked IDs.

The unchanged California receipt expires November 5, 2026 at 23:28:32 UTC.
The deployment checker refuses release with 48 hours or less remaining. Recheck
actual time before release; this document does not authorize renewal or bypass.

No reimport is needed for this fix. If live verification fails, investigate
read-only rather than retrying imports or changing mappings.

## Read-only public baseline after scope approval

At November 2, 2026, 20:26 UTC, deployment metadata reported a successful public
deployment at `https://opendefender.ai`, with `https://opendefender.net` as an
additional URL. The committed checker against the latter returned `ok: false`
only because the public selector had 702 rather than 703 expected IDs.

A separate pagination check against the primary URL found:

- Page sizes: 500 + 202, with a consistent pagination snapshot.
- Exactly 702 unique IDs, no unexpected IDs and no restored held IDs.
- The only missing ID was `ca-petty-theft`.
- Public source status reported the matching current receipt, 5,733 current
  snapshots, zero pending reviews and 703 linked charge IDs.
- The latest import was `completed`, with zero changes and zero errors.

This baseline is consistent with the known unfixed selector behavior. It is not
proof of the serving Git revision or a substitute for post-publication checks.
It supplies no reason to reimport data. No production database query or write
was performed; the import findings above come from the public status endpoint.

### Main-workspace handoff

Prepare/select the owner-approved California-only release: use the exact
four-file change on the confirmed serving baseline, excluding the faster
importer and Ohio rollout. The prepared local candidate is
`release/california-reference-identity-only` (`a54626b9`), based on `8b4b1cd9`.
If that task-local branch is unavailable in the main workspace, reproduce the
four-file change from the existing reference-identity fix commit `51053775`
on the confirmed release baseline, not on the broader current main checkout.
Preserve newer queued work. Stop for any unexpected schema change or baseline
difference. Publication must be handled in the main release workspace; this task
workspace does not publish. Once the approved candidate is serving, resume the
703-ID checks here.

## Portable transfer

The accompanying transfer archive contains a standalone candidate Git bundle
with its reachable history, this document, publication-marker evidence, a
machine-readable manifest, checksums and import instructions. A separate
incremental bundle preserves the newer main-branch work; it requires the
baseline history already included in the candidate bundle. Neither bundle
merges, checks out or publishes anything.

Import the candidate in the main workspace using the archive's instructions.
Do not reset, replace or force-update the main branch. The candidate branch
remains code-only; this release document is supplied alongside it so the exact
approved candidate commit is unchanged.

## GitHub handoff

The exact code-only candidate is available on GitHub in
`publicdefenderai-ai/OpenDefender`, branch
`release/california-reference-identity-only`, at
`a54626b98a0aa23297650e442ba3fdfa673b3e69`.

The companion branch `release/california-reference-identity-handoff` supplies
this guide and the baseline publication-marker evidence on top of the exact
candidate. Use it for documentation only; the approved code-only candidate's
commit remains unchanged.

In the main workspace, fetch both branches without merging or switching main:

```sh
git fetch origin \
  refs/heads/release/california-reference-identity-only:refs/remotes/origin/release/california-reference-identity-only \
  refs/heads/release/california-reference-identity-handoff:refs/remotes/origin/release/california-reference-identity-handoff
git rev-parse origin/release/california-reference-identity-only
git show origin/release/california-reference-identity-handoff:docs/california-fix-only-release-candidate.md
git show origin/release/california-reference-identity-handoff:docs/california-baseline-publication-marker.txt
```

The candidate SHA must match the full identity above. Confirm the serving
baseline and all remaining gates before selecting a release. No command above
publishes, accesses a database, merges main or removes newer work.
