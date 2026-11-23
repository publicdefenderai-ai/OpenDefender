# New York placeholder identity hold

Three legacy records combine a New York display title with unresolved generic/MPC content: `ny-conspiracy`, `ny-recidivist-enhancement` and `ny-money-laundering`. Their existing citation-confidence hold does not suppress the catalog summaries, penalties or previously saved narratives. This change withholds those exact identities rather than substituting a different statute or offense.

## Behavior and scope

- The three IDs enter the existing New York reselection set. Jurisdiction selectors, unscoped catalog/search readers, canonical charge lookup and guidance classifications omit them. The central authority selector also excludes them even if a stored database eligibility list still authorizes them.
- The saved-charge resolver cannot resurrect these three records through its raw-catalog fallback. ID-bound explanations return null.
- Saved roadmaps containing these IDs are replaced by a localized confirmation notice on screen and in browser print. This suppresses the entire historical narrative, not just the charge card; app Print refuses to print it. The central PDF generator rejects the plan before creating a PDF, covering the dashboard, case-guidance and chat callers.
- Older New York saves containing a known exact legacy label/code without an ID are also held. Matching is limited to the three records' known labels/codes and comma-separated saved selections; it is not arbitrary substring matching or a rule against other states' similarly named offenses.
- A mixed plan with a supported charge and one of these placeholders remains held. An extra known legacy label in the saved selection also remains held even alongside another classification. A future reviewed NY replacement reusing a historical display name must deliberately reconcile this conservative alias rule; no successor is inferred here.
- Truly charge-free roadmaps still display, print and export with the catalog offline. Unrelated NY identities and similarly named records in other jurisdictions are unchanged.

## Evidence and operation boundaries

Original raw catalog records, research snapshots, receipt files, source/snapshot identities and evidence bindings are preserved. The source manifest marks these three identities require_exact_reselection with an explicit reason, and the pure seed builder filters these IDs from its future eligibility proposal: the committed 121-record manifest produces **91**, previously **94**, proposed selectable IDs. All retained manifest provisions remain unchanged. Because held identities are excluded from future seed writes, the offline seed proposal now contains 86 sources, 93 snapshots and 93 links (previously 89/96/96); no existing database evidence is deleted. This is an offline proposal, not an executed import or a live availability count.

The release harness excludes the same three IDs using the shared JSON identity list, as a second check against stale fixture eligibility. The independent test expectation still enumerates the three IDs explicitly. No receipt, database mapping, import, migration, deployment or production change is made. Existing Ohio pilot boundaries and other state holds remain intact.

This is a bounded safety hold, not substantive verification of the remaining NY catalog. Name-only generic research/explanation APIs are not globally removed; the protected paths are exact selected identities and recognized saved placeholders. Unknown free-text descriptions outside these known aliases require a separate review.

## Validation

Commands and final results are recorded in the PR. Focused checks cover catalog exclusion, stale database eligibility, no automatic replacement, saved-ID and ID-less resolution, scoped explanations, seed preservation, PDF rejection, localized screen/print notices, and charge-free/unrelated controls. Browser checks use the isolated production fixture with no production credentials, one worker and no retries. Full release and database integration suites are not claimed as passed.

Local results: **171 tests passed across seven unit files**; TypeScript and production build passed. **Eight browser scenarios passed**, covering saved IDs and code-only fields in English/Spanish/Chinese, exact localized Print text/accessibility labels, stale API claims, no-charge offline PDF export, and an unrelated NY roadmap. No retries, skipped scenarios or increased timeouts were introduced. The database integration expectation was updated to 91 but that integration test was not run.

Final consistency correction: the three manifest dispositions and independent seed-write/count expectations now agree. `npm run test:batch-consistency` passed all 39 checks, including readiness contracts and the admin coverage route. Final combined regression run: 3,652 tests passed, 91 skipped; one suite failed because local PostgreSQL `initdb` is unavailable. Typecheck and production build passed. The eight NY browser scenarios passed with no retries. The standalone coverage report completes without a technical exception and still exits 1 for the existing GA/PA coverage shortfalls. No full production release clearance or database verification is claimed.
