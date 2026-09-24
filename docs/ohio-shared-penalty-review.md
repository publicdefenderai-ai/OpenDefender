# Ohio shared penalty review: fewer false flags, larger research batches

**Substantive follow-up:** [The 51-section verification batch](ohio-verification-batch-one.md)
records the conduct and penalty findings for the first four priority sources and four fine cases.

This batch combines the two PR #3 review findings with shared-source research
assembly. It uses the unchanged September 23 snapshot. No catalog, runtime,
reviewed decision, publication gate or production database is changed.

## Measured effect against PR #3

| Measure | Before | After |
| --- | ---: | ---: |
| Penalty-scope candidate sections | 425 | 320 |
| Externally graded prohibition candidates | 160 | 244 |
| Plain penalty-linked candidates needing conduct research | 50 | 71 |
| Legacy discovery investigations | 24 | 20 |
| All unresolved legacy rows | 92 | 88 |
| Mechanical research proposals | 147 | 151 |

114 sections lose collateral scope flags: 87 return to externally graded
prohibition discovery and 27 still require conduct research. Nine other sections
receive stricter flags for previously unrecognized qualifications. The net scope
queue reduction is 105 sections (24.7%); this is not 105 legally completed charges.

Four catalog rows referencing §4301.62 or §4301.633 return to catchline proposals.
They remain unapproved proposals, including the legacy “alcohol in park” label;
this pass does not certify that the label or an individual's facts match the
statute. The driving-under-suspension citation suggestion remains review-only.

Named-offense extraction is unchanged: 531 candidates / 477 distinct names.
33,320 sections, 87 scheduled repeals, 69 temporal holds, 20 ranges (one unresolved)
and 456 sections with local grade evidence remain accounted for.

## Target-level scope and retained uncertainty

Each direct reference now has exact reference spans, a scope classification and
explicit review reasons. In §101.99(A), the repeated “of section” preserves the
division qualification for §101.91, while an explicit new section reference resets
the list for §§101.77 and 101.97. Bare numbers inherit a clearly whole-section list,
but bare numbers after a division-qualified reference remain ambiguous. For example,
§959.99(C)'s references to §§959.12 and 959.17 are not silently cleared.

Shared repeat-offense conditions, exceptions, actor qualifications, temporal
conditions and unparsed reference language continue to require review. A range
alone no longer contaminates a separate explicit direct reference. Range members
still receive no assigned grade. Compact text containing a later “notwithstanding”
clause stays flagged. A chapter number such as 1901 is not mistaken for a year.

Spot checks used official [§4301.99](https://codes.ohio.gov/ohio-revised-code/section-4301.99),
[§959.99](https://codes.ohio.gov/ohio-revised-code/section-959.99), and
[§4719.99](https://codes.ohio.gov/ohio-revised-code/section-4719.99).
The attempted live §101.99 lookup timed out; its fixture is bound to the recorded
cache. These lookups did not replace the pinned source snapshot.

Reconciliation now warns once on missing or incomplete chapter caches, naming the
acquisition/replay scripts and explaining that some reviewer excerpts will be
empty. Existing inventory evidence remains available; the whole evidence column
is not necessarily empty. A changed source hash still fails rather than warning.

## Shared research packets

`ohio-discovery-investigation.json` now includes `sharedPenaltyResearch` and
`sharedPenaltySourceBatches`. The remaining penalty research is organized as:

- 833 target relationships across 308 distinct source clauses;
- 164 source-section batches, ordered first by affected legacy catalog rows,
  then by number of target sections;
- 759 distinct target sections and 10 affected legacy catalog rows.

A packet retains the full penalty sentence, hash, exact target references and
reasons, range resolution, each target's hashed source excerpt, status, and catalog
IDs. Definitions and held versions stay visible without becoming approved crimes.
Group assembly rejects changed source text or spans. These are assembled research
packets, not completed applicability findings or attorney assignments.

The 525 repeated clause reads identified by the grouping metric are avoidable
source duplication, not measured attorney-hours saved. Different target sections
still need conduct analysis. The full offline refresh measured 23 seconds with no
source requests; the separate spot checks above are not part of that measurement.

## Next substantive batches and scaling discipline

| Priority source | Target sections in research packets | Linked legacy rows |
| --- | ---: | ---: |
| 4301.99 | 23 | 5 |
| 959.99 | 11 | 2 |
| 3767.99 | 6 | 2 |
| 3743.99 | 7 | 1 |
| 1533.99 | 42 | 0 |
| 907.99 | 33 | 0 |

The first four sources collectively touch all ten legacy rows in the shared
penalty packets. They are the next substantive review batch: read each complete
penalty source once, assemble conduct/division/actor/exception dependencies for
its targets, and record source-bound applicability findings. Escalate only actual
legal interpretation questions. Do not spend another cycle creating one report
or pull request per section. The remaining local-grade and temporal-version queues
are separate work, not erased by this grouping.

For future jurisdictions, reuse source-hash/span grouping, explicit scope reasons,
source-batch prioritization and before/after queue accounting. Keep the statutory
reference grammar state-specific and fail conservatively on unrecognized wording.
The success measure is source dependencies and charge questions resolved per
batch, not just a fast report refresh or a smaller queue produced by weaker rules.

## Validation

223 tests passed across 26 Ohio test files (database-backed runtime boundary
integration excluded). After final source-batch assembly, the affected three-file
suite passed 43 tests and the script typecheck passed. Verified 1,547 exact target
reference/packet excerpt spans, source hashes, one-to-one clause-to-source-batch
coverage, unchanged named-offense objects and blank generated decision/note fields.
