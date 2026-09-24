# Ohio discovery accounting

September 23, 2026. Discovery and reconciliation only; no publication or database changes.

The classifier now retains penalty-linked sections even when their conduct text
does not match its prohibition patterns. Previously, 154 such sections were
classified as supporting and omitted from the candidate report. They now have
the status `penalty_linked_candidate`. This is a request for conduct and penalty
applicability analysis, not a finding that 154 additional crimes exist.

## Snapshot integrity

Classification validates the chapter cache against the committed section
enumeration before extracting candidates. Missing or duplicate chapters/sections,
changed text hashes, headings, effective dates or retrieval times, inconsistent
counts, and empty active section bodies stop classification. Cache validation
does not renew evidence timestamps or authorize publication.

The report pins the enumeration's SHA-256 hash. Reconciliation requires that
same enumeration, preventing a report from being combined with another snapshot.
An omitted section is distinguished from an absent section using the full
enumeration, rather than the filtered candidate list.

This proves agreement with the recorded snapshot. It does not independently
establish that the publisher's inventory is exhaustive or that the snapshot
represents the law applicable to a particular case. `supporting` means no
recognized offense signal; it is not a verified non-offense determination.

## Recorded replay

The offline replay used the September 23 enumeration and existing chapter cache.

| Measure | Result |
| --- | ---: |
| Chapters accounted for | 971 |
| Sections accounted for | 33,320 |
| Named-offense sections | 414 |
| Named offense candidates | 529 |
| Externally graded prohibition sections | 408 |
| Locally graded prohibition sections | 9 |
| Prohibition-only sections | 1,760 |
| Penalty-linked candidates without recognized conduct wording | 154 |
| Supporting sections, including repealed/reserved entries | 30,575 |

These units must not be combined into a count of verified offenses. The 321
repealed/reserved sections remain in the section denominator and cannot acquire
candidate offenses or grades.

External penalty quotations now carry the penalty section's source URL and text
hash. Six target sections require investigation: five are marked repealed/reserved
in the snapshot, and one is absent. Their references remain in
`accounting.unresolvedPenaltyTargets`; no replacement citation is guessed.

The legacy reconciliation still accounts for 239 catalog rows. It reports 155
mechanical proposals and 84 unresolved rows, including 17 `discovery_unresolved`
rows. Those 17 are source/extraction investigations, not an attorney assignment.
They include present sections previously described as missing and prohibition
candidates previously described as non-offenses. None is automatically renamed.

## Reproduction

With the matching `.cache/ohio-chapters` evidence already available:

```sh
node --import tsx scripts/data-review/classify-ohio-offenses.ts
node --import tsx scripts/data-review/reconcile-ohio-catalog.ts
node node_modules/vitest/vitest.mjs run tests/ohio-discovery-accounting.test.ts
```

The first two commands regenerate discovery/reconciliation JSON and the legacy
review CSV. They make no network requests or database writes and do not modify
eligibility decisions, legal-review decisions, translations, or runtime catalogs.
If the cache and enumeration differ, repair or deliberately reacquire the
snapshot through the acquisition workflow; do not edit hashes to make it pass.
A fresh checkout needs the matching evidence cache or a newly acquired snapshot
before a statewide replay. The focused tests use isolated synthetic fixtures and
do not need that cache, credentials, a database, or network access.

## Remaining work

Investigate the retained candidates using their linked penalty text and full
conduct provisions, grouping recurring extraction patterns before requesting
legal review. Audit penalty-range handling, unusual criminalization language,
and sections classified as supporting to assess remaining false negatives.
Independent inventory checks and attorney-selected benchmarks remain necessary
before asserting felony completeness. This change does not address publication
naming rules, conditional penalty modeling, or end-to-end guidance accuracy.

## Verification

All 167 Ohio unit tests passed across 22 files, including 15 new accounting
regressions. Script/shared/server type checking passed with the repository's
declared but locally missing `@types/jsdom@30.0.0` supplied from a temporary
installation and configuration; dependency manifests were unchanged. The
statewide offline replay and report totals also passed. Live API and browser
verification were not performed for this offline-only change.
