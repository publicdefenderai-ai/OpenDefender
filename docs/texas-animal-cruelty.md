# Texas animal-cruelty and assistance-animal publication batch

This batch adds 24 individually supported choices: nine conduct branches under Penal Code §42.092, nine livestock branches under §42.09, and six actor/controlled-animal attack, injury and death branches under §42.091. It does not activate sources or establish production availability.

## Priority and scope

The official DPS 2025 adult-arrest workbook ranks code 73990643 (nonlivestock neglect/abandonment/transport/injury/overwork) 98th with 1,128 arrests and code 72010001 (nonlivestock torture/killing/poison/serious injury) 138th with 583. These aggregate codes total 1,711 adult arrests, not convictions, distinct people or branch-specific counts. Their broader statutory family supports efficient shared-dependency review; this is not a claim that all higher-ranked offenses are complete.

The workbook is `https://www.dps.texas.gov/administration/crime_records/pages/aareststatsoffense26.xlsx`, labeled 2025 and as of January 13, 2026. Its SHA-256 is `779a075cbb9e423f75330cda4fe9d89585c0b28fe41c5b577cd50161309b9483`. The committed priority artifact retains the ranking metadata and two selected rows. Reproduce with `python3 scripts/data-review/texas-verification/rank_arrests.py /path/to/workbook.xlsx --limit 150`.

| Section | Conduct choices | Key distinctions |
| --- | ---: | --- |
|42.092(b)(1)-(9)|9|Current four mental states, three different repeat ladders, branch-limited defenses and lawful-activity exceptions|
|42.09(a)(1)-(9)|9|Intentional/knowing only; four ordinary Class A and five ordinary state-jail branches; two-prior escalation; horse-tripping and livestock-poison limits|
|42.091(a)/(b), (c)(1)-(3)|6|Direct act versus incited/permitted controlled animal; attack Class A, injury state jail, death F3; mandatory subsection(d) restitution expressly applies to(a)|

Each choice starts with its ordinary grade and describes its supported enhanced punishment without assuming priors. Definitions of animal/livestock, custody, dangerous wild animal, veterinarian, depredation and assistance animal are retained. General hunting/agriculture exceptions require generally accepted and otherwise lawful conduct. The scoped summaries do not certify that a particular regulated activity is lawful or that a person is licensed.

The existing `tx-animal-cruelty-misdemeanor` identity remains withheld. Its section-level label cannot safely distinguish livestock from nonlivestock, mental states or grade; it is not silently remapped. New canonical IDs resolve saved selections; ID-less section descriptions require reselection. All earlier holds, including the separate protective-order firearm draft, are preserved.

Dog fighting, cockfighting, other animal offenses and a separately selectable §42.107 possession offense are not added. Section §42.107 is retained as a consequence dependency for §42.091/42.092, not §42.09: it prohibits possession/control with a qualifying conviction within the preceding five years. This packet does not claim exhaustive collateral-consequence or sentencing coverage.

## Version and evidence

The new statutory acquisition occurred November 20, 2026 UTC. Seventeen exact section documents support 362 offense/grading/penalty references. Eight documents are newly retained; nine existing documents are reused with their authentic retrieval timestamps and unchanged hashes. All 442 earlier manifest records and the manifest generation timestamp are unchanged. No existing receipt is issued, extended or replaced.

HB 285 added criminal negligence to §42.092 effective September 1, 2025 and added a defense limited to alleged criminal negligence during actual veterinary duties. Every affected choice explains that any element before the effective date requires the earlier law. The enrolled act's amendment, transition and effective-date sections are retained with content hashes and exact text spans. The change does not extend to §42.09 or42.091. The current-text statutory definition and source metadata are not a representation that today's wording applies to every historical prosecution.

The builder replays each choice against its actual retained documents and rejects missing or altered evidence. No unverified instruction number is published. The batch leaves instruction references blank rather than representing that an applicable instruction does not exist. New Spanish/Chinese requests retain explicit untranslated-English fallback; existing translations are untouched.

## Accounting and verification

Against merged main `1e8a07b42597c5fdf0ca185878a4ca4ddf98bc46`, the offline fixture has 466 configured Texas records, 390 eligible and 76 withheld. Source keys increase 220→228 and source links/snapshots 4054→4416. These counts exclude unmerged PR 283 and do not measure production availability.

- Offline replay: all 24 regenerated records exactly match the appended manifest records.
- Focused tests: 63 passed across five suites, including source integrity, missing/altered dependencies, saved identities, translations, category membership and instruction guards.
- TypeScript check: passed.
- Production build: passed. All 22 isolated built-selector checks passed without retries.
- No database-dependent stages, imports, receipt issuance, monitoring activation or deployment were run.

Verification commands:

```sh
npx tsx scripts/data-review/texas-verification/replay-assault-intoxication.ts animal-cruelty
npx vitest run tests/texas-animal-cruelty.test.ts tests/texas-ranked-possession.test.ts tests/texas-source-database.test.ts tests/texas-deployment-seed.test.ts tests/jury-instructions.test.ts
npx tsc --noEmit
```

Later publication/import requires the normal separately approved operational process. This code review does not authorize it.
