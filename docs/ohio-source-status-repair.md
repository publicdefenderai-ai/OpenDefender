# Ohio source-status repair and repeatable replay

This follow-up repairs the acquisition defect identified in the discovery
investigation. It changes offline research only. It does not update runtime
charges, attorney decisions, publication eligibility or the production database.

## Measured result

The recorded September 23, 2026 snapshot was reparsed from its original official
chapter HTML in **90 seconds**, with **zero network requests**. All 971 chapters
and 33,320 sections remain accounted for. Original retrieval times, page hashes,
section text hashes, headings, citations and effective dates were preserved.

| Measure | Before | After |
| --- | ---: | ---: |
| Sections flagged inactive | 321 | 1 |
| Explicit future-effective version holds | Not separately tracked | 69 |
| Scheduled future repeals | Suppressed by keyword | 87 retained with dated notices |
| Sections with a discovery candidate signal | 2,745 | 2,763 |
| Unresolved external penalty targets | 6 | 1 |
| Legacy catalog rows needing discovery investigation | 17 | 17 |

The replay removes incorrect inactive flags from 320 sections: 229 with
former-number history, 87 with future repeal notices, and four with incidental
status words. These are section-status corrections, not 320 additional crimes.

Twenty sections regain candidate signals, including all five previously flagged
renumbered penalty targets (128.96, 3715.34, 5101.631, 5180.275 and 5180.403).
Two previously retained candidates, 5164.43 and 4732.42, are held because the
displayed versions postdate the recorded retrieval date. The net candidate-section
increase is 18. Research must locate applicable versions; a hold does not mean
that no offense existed under an earlier version.

The retained penalty-linked bucket grows from 154 to 155 (86 broader wording
signals, 34 duty/administration signals, 33 range endpoints and two dependencies).
The remaining external target, 4507.37, is still an absent range endpoint, not a
guessed replacement charge. Catalog reconciliation remains 155 mechanical
proposals and 84 unresolved rows. Nothing has been promoted to an approved charge.

## What changed

Status interpretation now distinguishes operative text, scheduled repeal,
repeal, movement to another number, reservation, a not-yet-effective displayed
version and uncertainty. Status is assessed at the recorded chapter retrieval
date, never silently advanced to the date a report is rerun. Explicit notices
carry their original heading/body spans and transition dates when recognized.
Unknown dates and empty/ambiguous sources remain held for research.

For example, the official [128.96 page](https://codes.ohio.gov/ohio-revised-code/section-128.96)
describes its former number while supplying conduct under the new number.
The [4723.063 heading](https://codes.ohio.gov/ohio-revised-code/section-4723.063)
announces a future repeal; it is not a notice that the provision was already
repealed at the snapshot date. In contrast, the dated notice in
[1705.01](https://codes.ohio.gov/ohio-revised-code/section-1705.01) precedes that date.

Parsed chapter caches now carry parser version 2. Acquisition rejects older
parsed caches, while it can still reuse original HTML under its existing freshness
policy. Snapshot validation checks parser-version agreement and recomputes status
from the recorded evidence before classification. Held versions cannot contribute
offense names or penalty links. The investigation report includes all 69 temporal
holds as engineering version-research tasks.

The classifier also now gives a descriptive acquisition instruction when the
enumeration file is missing, addressing Claude's small error-message finding.

## Faster repeatable workflow

1. Repair a recurring extraction pattern once, with regressions for false positives
   and negative cases, rather than edit individual report rows.
2. Replay already-recorded pages offline when parser behavior changes. Verify every
   page against its original URL, hash and retrieval time before parsing; use
   bounded worker processes to keep DOM memory from accumulating statewide.
3. Stage the new caches and enumeration. Check the complete denominator and all
   source fields before applying. Keep the prior cache and enumeration locally
   for rollback. A text or citation change stops this status-only replay.
4. Regenerate classification, reconciliation and investigation in dependency order.
   Check changed rows and counts before preparing legal questions.

```sh
node --import tsx scripts/data-review/reparse-ohio-snapshot.ts --apply
node --import tsx scripts/data-review/classify-ohio-offenses.ts
node --import tsx scripts/data-review/reconcile-ohio-catalog.ts
node --import tsx scripts/data-review/investigate-ohio-discovery.ts
```

The replay needs the matching original HTML and chapter cache; a fresh clone
without that evidence must acquire a snapshot first. It never falls back to a
network request. Omitting `--apply` leaves validated staging files for inspection.
Existing staging/backup directories cause a descriptive stop rather than being
overwritten. Applying replaces the research cache and enumeration, not any
publication database. A failure during replacement is detectable by snapshot
validation; the original cache and enumeration remain in the local backup.

The committed [replay receipt](../scripts/data-review/output/ohio-source-status-replay.json)
records old/new enumeration hashes, counts, runtime and every changed or
non-operative status. The regenerated investigation is the current research view;
the earlier investigation document records the findings that led to this repair.

## Remaining batches

Next prioritize unnamed local grades and penalty ranges, followed by conduct
wording and citation research. Preserve divisions, exceptions and prior-offense
conditions; do not create offense names from unnamed grades. Retrieve applicable
versions for the 69 temporal holds, starting with the two affected candidate
sections. The other 67 unresolved catalog rows and independent completeness
benchmarks remain outstanding. Reviewer excerpts and review-only name suggestions
are still separate follow-up improvements.

## Validation

All 189 Ohio unit tests passed across 24 files, including date-boundary,
renumbering, incidental-word, source-hash, cache-version and held-version
regressions. Script/shared/server type checking passed using the temporary
installation of the already-declared jsdom types described in the earlier
accounting report; dependency manifests were unchanged. Full offline replay,
classification, reconciliation and investigation completed successfully.
Live database/API/browser checks are outside this offline research change.
