# California statewide discovery and larger review batches

This delivery inventories the retained official source archive across all 30 codes. It does not add charges to the platform or certify current law. The platform's 99 configured selectable California records have completed the existing-catalog correction pass; finding missing charges is the next distinct job.

## Measured inventory

The September 24 acquisition contains 162,431 version rows grouped into 161,426 code/section keys. Every row was read successfully. Keys are not necessarily distinct statutory identities: constitutional numbering repeats across articles, and 704 keys have multiple rows. The ledger retains each version and flags hierarchy collisions instead of selecting one version.

The first discovery pass finds:

| Disposition | Section keys | Meaning |
| --- | ---: | --- |
| Criminal-language candidate | 6,028 | Contains a criminal classification, offense or punishment signal; may still be procedural, civil, historical or merely referential. |
| Possible penalty target | 3,530 | Referenced by a section containing offense or punishment language; applicability is not established. |
| Prohibition unresolved | 31,354 | Contains broad prohibition wording without the above signals; many are civil or administrative. |
| No criminal signal detected | 120,514 | Needs independent miss detection; not certified noncriminal. |

These counts are not offense counts or a completeness percentage. All 70 source keys used by the 120 canonical catalog records are present (including withheld labels). The selectable subset previously accounted for 69 primary sections. A match does not establish that the catalog's citation is correct.

There are 2,835 overlapping possible penalty-source groups and 3,421 unresolved reference/scope hints. Neither assigns a grade. References anywhere in a penalty-bearing source can appear in a group, so the relevant clause must be read before using the relationship. Blanket references such as “this code” remain unexpanded: automatically expanding them produced a misleading statewide queue, and hierarchy order differs between codes. Ranges are also retained without numerical expansion.

## Replay and evidence inspection

```sh
python3 scripts/data-review/california-verification/discover-statewide.py --as-of 2026-09-27
python3 scripts/data-review/california-verification/inspect-statewide.py PEN:240
python3 -m unittest discover -s scripts/data-review/california-verification -p 'test_*.py'
```

Replay uses the ignored `.cache/california-bulk/pubinfo_2025.zip` and its acquisition receipt. The existing `scripts/data-review/california-verification/download-bulk.py` acquisition script provides the archive workflow. Replay rejects bytes that do not match the receipt; it does not refresh sources or substitute a new review date. The explicit assessment date cannot precede acquisition.

The [generated report](../scripts/data-review/output/california-statewide/README.md) links conceptually to adjacent summary, batch manifest and compressed ledgers. The inspection command checks ledger hashes and returns all matching versions, bounded excerpts, source hashes, references and holds without needing the raw archive. Excerpts are navigation aids; substantive review still requires the complete statute and its dependencies. The complete per-version ledger is roughly 32 MB compressed, principally source hashes and evidence; it is retained so a fresh clone can inspect accounting without a 1.28 GB download. No application records, case inputs or credentials are included.

The existing California Vitest bridge runs all Python unittest files in CI. Tests cover source failures, path traversal, version and code identity, range handling, unexpanded blanket scope, deterministic ledger bytes, deferral safeguards and committed accounting/hash reconciliation.

## First combined publication batch

The first batch uses Penal Code Part 1, Title 8, Chapters 1 and 9, and Title 13, Chapters 4 and 5: **142 candidate section keys in four related person/property groups** (27 + 40 + 20 + 55). This is an engineering batch, not a claim of 142 missing crimes or a frequency estimate. Deduplicate existing records, inspect definitions and shared punishment provisions together, and split only when legal complexity makes a single review impractical. Adjacent dependencies and independently identified omissions can be added without creating a separate small PR.

Before publication, each proposed record needs a defensible charging name/aliases, precise code and subdivision, elements, classification and punishment, retained evidence, current operative version, and resolved applicability. Then check selection, guidance and source-database parity. Attorney review should receive specific legal questions with context, not routine retrieval or data-entry assignments.

Use independent charging inventories and official jury-instruction references to test discovery recall, plus stratified samples from no-signal sections. Those checks are still outstanding; the lexical scan alone cannot certify statewide completeness. Later batches cover the remaining Penal Code, Health and Safety, Vehicle and Business and Professions groups, then other codes and criminally enforceable regulations. Regulations, local ordinances, uncodified enactments and comprehensive enforceability research are outside this initial scan.

The [first person/property expansion](california-person-property-expansion.md) added 26 choices in merged PR #20. Its frozen accounting left 79 sections in substantive research. The [successor forgery/theft batch](california-forgery-theft-expansion.md) proposes 28 more choices from 20 of those sections, leaving 59 in substantive research. Neither batch claims every branch or the entire four-group scope is complete.

## Accuracy and stopping rules

Prioritize consequential and common charges. When a genuinely low-priority minor candidate remains ambiguous after bounded research, leave it unpublished and record its key, reason, severity evidence, reviewer/date and revisit condition in `statewide-deferrals.json`. Unknown severity is not evidence that an offense is minor. The initial statewide scan inventory is preserved; the first publication batch records its §243.83 low-priority infraction deferral in the person/property review packet. Successor accounting retains that deferral rather than silently dropping it.

All unreviewed candidates already remain visible in the discovery ledger. Deferral cannot silently remove an existing catalog record. The three previously documented attorney questions remain open in the [question packet](california-remaining-attorney-questions.md). Future statutory changes and currentness require separate review; a successful scan does not reset evidence freshness.
