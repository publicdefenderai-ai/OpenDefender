# Ohio penalty evidence and reusable discovery improvements

**Follow-up:** [Shared penalty review](ohio-shared-penalty-review.md) reduces collateral
scope flags and assembles source-level research batches. Counts below are the PR #3 baseline.

This batch improves offline research against the recorded September 23, 2026
snapshot. It does not change the application, charge catalog, database, attorney
decisions or publication approvals. The earlier discovery and source-status
reports remain historical baselines; this document describes the latest batch.

## Measured results

| Measure | Result |
| --- | ---: |
| Accounted-for chapters / sections | 971 / 33,320 |
| Sections with unnamed local grade observations | 456 |
| Previously prohibition-only sections with local grade observations | 185 |
| Unnamed sections classified as local grade candidates | 315 |
| Recorded penalty ranges | 20 |
| Ranges bounded by recorded publisher order | 19 |
| Unresolved ranges | 1 |
| Qualified external penalty candidate sections | 425 |
| Scheduled repeals surfaced separately | 87 |
| Future-version / uncertain source holds | 69 |
| Legacy catalog rows | 239 |
| Mechanical proposals / unresolved rows | 147 / 92 |
| Discovery investigations with source excerpts | 24 of 24 |

These populations overlap; they are not counts of distinct crimes. The 456
sections include named-offense sections where additional local observations are
kept separate from attributed grades. The 185 comparison uses the current merged
source-status baseline, rather than the older snapshot underlying the earlier
183-section review estimate. Named offense extraction remains at 531 candidates
and 477 distinct names.

Unnamed local grades retain exact spans and complete sentence context, including
repeat-offense conditions. They do not manufacture an offense name or establish
which conduct receives a grade. The pass handles culpability adverbs, intervening
removal/liability consequences and the source's occasional “in the third degree”
wording. Rule references such as §149.38's “violates that rule” remain unresolved;
quoted election warnings and generic definitions are not local-grade findings.

Penalty range membership follows the recorded chapter order, preserving section
suffixes. It is never inferred by numeric increments. Missing endpoints, reversed
order and cross-chapter ranges do not produce guessed members. The one unresolved
range is §4507.99's reference from §4507.10 to absent endpoint §4507.37. This has
moved from the direct-target backlog to the range backlog; it has not been solved.
A definition inside a range can be a research candidate without becoming a crime.
Range grades are not assigned to members.

Compact paragraph boundaries now retain the §3767.99(C) penalty reference to
§3767.32. Full actor/division/exception context is preserved for applicability
analysis. Eight former automatic catchline proposals now require engineering
investigation because their penalty evidence contains qualifications. A unique
exact-name alternative for the driving-under-suspension row is only a citation
suggestion; the supplied §4510.11 citation is unchanged.

All 87 scheduled repeals carry dates and source provenance in accounting and
investigation output. These sections remain operative candidates at the snapshot
date and are separate from source holds. This is a report, not an installed
monitor or a claim about law after the snapshot date.

## Faster repeatable workflow

```sh
node --import tsx scripts/data-review/refresh-ohio-discovery.ts
```

One validated classification pass supplies inventory, reconciliation and
investigation. The full refresh measured **24 seconds with zero source requests**
on the existing cache. Original enumeration and cached authorities are unchanged.
The standalone report commands remain available. The generated catalog review CSV
is research output, not the durable attorney response ledger: its decision/note
columns were verified blank for this refresh. Do not regenerate it over human
annotations; preserve those separately first.

Parser entry points now require an explicit assessment date. Acquisition stops
before requests if it detects a parser upgrade, directing the operator to offline
`reparse-ohio-snapshot.ts`. A deliberate acquisition can instead specify
`--allow-parser-upgrade-fetch`; a version bump no longer silently initiates it.

For future states, reuse the recorded-order range resolver, source-bound evidence
shape, explicit date policy, research-versus-approval separation and single-pass
report orchestration. Statutory wording patterns still need state-specific
fixtures; Ohio's phrasing should not be assumed elsewhere.

## Validation and next work

- 208 tests passed across 25 Ohio test files; the database-backed runtime boundary
  integration suite was excluded. The script typecheck passed using the temporary
  local type dependency setup documented in the preceding source-status work.
- Checked 2,058 local-grade/range evidence spans against exact cached source text,
  verified inventory source hashes, unique coverage of all 239 catalog rows, and
  nonempty evidence for all 24 discovery investigations.
- No changes to source enumeration, production records, runtime behavior, reviewed
  decisions or publication gates.

Next, resolve applicability in shared penalty groups rather than row by row:
qualified actor/division references, the 19 bounded ranges, and unnamed local
grades. The 50 remaining plain penalty-linked candidates and 24 legacy discovery
rows remain engineering work. The other 68 unresolved legacy rows comprise 20
missing citations, 30 label conflicts, 17 compound-section ambiguities and one
citation suggestion. Locate versions for the 69 temporal holds and investigate
the missing range endpoint. Reserve attorney referrals for specific legal
questions after these source dependencies and alternatives are assembled.
