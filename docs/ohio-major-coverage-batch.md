# Ohio major-coverage batch: source preparation

This is the next research batch after the restoration work in PR 97. It makes no catalog, eligibility, receipt, database or production changes. The figures below describe this retained snapshot, not a live coverage dashboard.

## What remains visible

The September discovery snapshot contains 33,320 statutory sections: 3,065 have recognized candidate signals and 30,255 do not. Neither population is a verified count of offenses or non-offenses.

Of 531 extracted name candidates, 108 match a configured reviewed identity at the same section, 3 match a held identity, and 420 do not match. An exact section/name match still requires a conduct-branch audit. Conversely, an unmatched extracted name can be a false positive or naming difference rather than a missing crime.

The queue preserves all reviewed identities and holds, including criminal trespass. It does not infer full coverage from one record at a section. Noncriminal/supporting-law exclusion and current statewide completeness remain unestablished.

## Combined next batch

Retained current primary sources cover 32 previously unreviewed sections in Chapters 2905, 2909 and 2911. The packet contains 68 official documents including shared sentencing, definition and first-hop references. The acquisition uses reusable local checkpoints; repeated packet assembly does not require downloading completed evidence again.

Each primary carries its own URL, effective date, content hash, extracted names/divisions, exact name and grade spans, and complete guilt-clause paragraphs. Full paragraphs remain available because the extractor can miss compound names; its 32 name candidates are not a promise of 32 publishable choices.

| Section | Official heading | Extracted-name candidates |
| --- | --- | ---: |
| [2905.01](https://codes.ohio.gov/ohio-revised-code/section-2905.01) | Kidnapping | 1 |
| [2905.02](https://codes.ohio.gov/ohio-revised-code/section-2905.02) | Abduction | 1 |
| [2905.03](https://codes.ohio.gov/ohio-revised-code/section-2905.03) | Unlawful restraint | 1 |
| [2905.05](https://codes.ohio.gov/ohio-revised-code/section-2905.05) | Criminal child enticement | 1 |
| [2905.11](https://codes.ohio.gov/ohio-revised-code/section-2905.11) | Extortion and sexual extortion | 2 |
| [2905.12](https://codes.ohio.gov/ohio-revised-code/section-2905.12) | Coercion | 1 |
| [2905.22](https://codes.ohio.gov/ohio-revised-code/section-2905.22) | Extortionate extension of credit - criminal usury | 0 |
| [2905.32](https://codes.ohio.gov/ohio-revised-code/section-2905.32) | Trafficking in persons | 1 |
| [2905.33](https://codes.ohio.gov/ohio-revised-code/section-2905.33) | Unlawful conduct with respect to documents | 1 |
| [2905.111](https://codes.ohio.gov/ohio-revised-code/section-2905.111) | Sexual extortion - person or child as victim | 0 |
| [2909.02](https://codes.ohio.gov/ohio-revised-code/section-2909.02) | Aggravated arson | 1 |
| [2909.03](https://codes.ohio.gov/ohio-revised-code/section-2909.03) | Arson | 1 |
| [2909.04](https://codes.ohio.gov/ohio-revised-code/section-2909.04) | Disrupting public services | 1 |
| [2909.05](https://codes.ohio.gov/ohio-revised-code/section-2909.05) | Vandalism | 1 |
| [2909.07](https://codes.ohio.gov/ohio-revised-code/section-2909.07) | Criminal mischief | 1 |
| [2909.08](https://codes.ohio.gov/ohio-revised-code/section-2909.08) | Endangering aircraft or airport operations | 2 |
| [2909.09](https://codes.ohio.gov/ohio-revised-code/section-2909.09) | Vehicular vandalism | 1 |
| [2909.10](https://codes.ohio.gov/ohio-revised-code/section-2909.10) | Railroad vandalism - criminal trespass - interference with operation of train | 3 |
| [2909.22](https://codes.ohio.gov/ohio-revised-code/section-2909.22) | Soliciting or providing support for act of terrorism | 1 |
| [2909.23](https://codes.ohio.gov/ohio-revised-code/section-2909.23) | Making terroristic threat | 1 |
| [2909.24](https://codes.ohio.gov/ohio-revised-code/section-2909.24) | Terrorism | 1 |
| [2909.26](https://codes.ohio.gov/ohio-revised-code/section-2909.26) | Criminal possession of chemical, biological, radiological, or nuclear weapon or explosive device | 1 |
| [2909.27](https://codes.ohio.gov/ohio-revised-code/section-2909.27) | Criminal use of chemical, biological, radiological, or nuclear weapon or explosive device | 1 |
| [2909.28](https://codes.ohio.gov/ohio-revised-code/section-2909.28) | Illegal assembly or possession of chemicals or substances for manufacture of prohibited weapons | 0 |
| [2909.29](https://codes.ohio.gov/ohio-revised-code/section-2909.29) | Money laundering in support of terrorism | 1 |
| [2909.31](https://codes.ohio.gov/ohio-revised-code/section-2909.31) | Person entering transportation facility to show identification | 0 |
| [2909.081](https://codes.ohio.gov/ohio-revised-code/section-2909.081) | Interfering with operation of aircraft with laser | 1 |
| [2909.101](https://codes.ohio.gov/ohio-revised-code/section-2909.101) | Railroad grade crossing device vandalism | 1 |
| [2911.23](https://codes.ohio.gov/ohio-revised-code/section-2911.23) | Criminal trespass on place of public amusement | 1 |
| [2911.31](https://codes.ohio.gov/ohio-revised-code/section-2911.31) | Safecracking | 1 |
| [2911.32](https://codes.ohio.gov/ohio-revised-code/section-2911.32) | Tampering with coin machines | 1 |
| [2911.211](https://codes.ohio.gov/ohio-revised-code/section-2911.211) | Aggravated trespass | 1 |

## Explicit limits and next publication work

- Official requests for §2907.12 and §3727.01 returned number-not-found redirects. These remain unavailable references. No substitute, repeal conclusion or enforceability conclusion is inferred.
- Chapter-wide references remain unresolved scope, rather than being expanded into assumed elements or penalties.
- One-hop acquisition is not complete dependency closure. Each publication record still needs conduct and exception review, branch-specific grading and sentencing, applicable authority and individual source bindings.
- Begin substantive publication preparation with the common restraint, arson/property-damage and property-entry offenses in this packet. Keep legally unresolved branches separate so they do not block unrelated supported records.
- Preserve prior decisions. Any new attorney deliberations belong in private communication, not this report.

## Reproduction

```sh
node --import tsx scripts/data-review/ohio-coverage-frontier.ts
node --import tsx scripts/data-review/ohio-coverage-frontier.ts --check
node --import tsx scripts/data-review/acquire-ohio-major-coverage.ts
npx vitest run tests/ohio-coverage-frontier.test.ts tests/ohio-discovery-accounting.test.ts tests/ohio-discovery-investigation.test.ts
```

The acquisition command uses the local checkpoint cache and fetches missing/stale evidence only. `--reuse=/path/to/local-official-acquisitions.json` can additionally reuse verified acquisitions less than 24 hours old; retrieval timestamps are preserved. The research output never renews a runtime receipt.

Regenerate the coverage frontier intentionally after changing reviewed identities. Its drift check is an explicit research command, not a blocking unit test tied to every later publication. Unit tests instead protect citation-plus-name matching, branch separation, holds, duplicate accounting and the exact retained evidence.

Validation: all 33 focused tests pass across the frontier, discovery-accounting and investigation suites. Application typechecking passes. The broader scripts typecheck still reports existing errors across unrelated research scripts and missing local jsdom declarations; it reports no diagnostics in either new module. No full-suite-green claim is made.
