# Ohio: 32-section substantive statutory verification

This packet maps 34 individual offense/subdivision identities across 28 sections. Four additional sections have separate dispositions below. These are statutory mappings, not 34 newly selectable charges. No runtime sources, catalog records, receipts, eligibility decisions, database contents or prior attorney decisions change.

The input is PR 99's retained official-source packet. Fifteen additional official sections supply definitions, sentencing and arson-registration evidence. Each retained document records its exact official URL, acquisition time, effective-date metadata and SHA-256 of extracted text. The mapping binds each offense to its own conduct and grading divisions and retains its complete primary section, including defenses, exceptions and merger rules. Shared sentencing sources do not determine an offense's grade.

## Individual mappings

A scope listed below is the scope of the mapping. Broader parent-division quotations are retained for context; they do not clear excluded subdivisions. Official headings are used with the subdivision for the three unnamed-grade credit/usury branches. All other names come from the operative guilt clause, including complete comma-separated weapon and railroad names.

| Section | Scope | Statutory identity |
| --- | --- | --- |
| 2905.01 | A,B | kidnapping |
| 2905.02 | A,B | abduction |
| 2905.03 | A,B | unlawful restraint |
| 2905.11 | B | extortion |
| 2905.11 | D | sexual extortion |
| 2905.12 | A | coercion |
| 2905.22 | A(1) | Extortionate extension of credit - criminal usury |
| 2905.22 | A(2) | Extortionate extension of credit - criminal usury |
| 2905.22 | A(3) | Extortionate extension of credit - criminal usury |
| 2905.32 | A | trafficking in persons |
| 2905.33 | A | unlawful conduct with respect to documents |
| 2909.02 | A | aggravated arson |
| 2909.03 | A,B | arson |
| 2909.04 | A(1),A(2),B | disrupting public services |
| 2909.05 | A,B,C,D | vandalism |
| 2909.07 | A(1)-A(6) | criminal mischief, and shall be punished as provided in division (C)(2), (3), or (4) of this section |
| 2909.08 | B | endangering aircraft |
| 2909.08 | C | endangering airport operations |
| 2909.09 | B | vehicular vandalism |
| 2909.10 | A | railroad vandalism |
| 2909.10 | B | criminal trespass on a locomotive, engine, railroad car, or other railroad vehicle |
| 2909.10 | C | interference with the operation of a train |
| 2909.22 | A | soliciting or providing support for an act of terrorism |
| 2909.23 | A | making a terroristic threat |
| 2909.26 | A,B | criminal possession of a chemical weapon, biological weapon, radiological or nuclear weapon, or explosive device |
| 2909.27 | A,B | criminal use of a chemical weapon, biological weapon, radiological or nuclear weapon, or explosive device |
| 2909.28 | A | illegal assembly or possession of chemicals or substances for the manufacture of a chemical weapon, biological weapon, radiological or nuclear weapon, or explosive device |
| 2909.29 | A | money laundering in support of terrorism |
| 2909.081 | A | interfering with the operation of an aircraft with a laser |
| 2909.101 | A | railroad grade crossing device vandalism |
| 2911.23 | B | criminal trespass on a place of public amusement |
| 2911.31 | A | safecracking |
| 2911.32 | A | tampering with coin machines |
| 2911.211 | A(1) | aggravated trespass |

## Separate dispositions and exclusions

- 2905.111 supplies victim protection for sexual extortion, not a standalone criminal charge.
- 2909.31 supplies identification and entry-denial provisions, without a standalone criminal penalty in the reviewed authority. Section 2901.03 is retained; no offense is synthesized.
- 2905.05 remains unpublished. Romage invalidated division (A); Horky addressed the amended provision. No conclusion that (B)/(C) are also invalid, or that they are cleared for publication, follows from that holding. The packet links the published opinions.
- 2909.24 remains unpublished pending predicate-specific grading and capital/life-sentencing mapping. It cannot safely be assigned a single ordinary felony profile.
- 2909.04(A)(3) remains outside the mapped scope because its hospital-definition reference to 3727.01 is unavailable. A successor is not silently substituted.
- 2909.07(A)(7) and 2911.211(A)(2) remain outside the mapped scopes. Their incorporated critical-infrastructure definition reaches the existing 1509.01 hold, which is preserved. Retaining 2911.21 as context does not clear that dependency.

## Sentencing distinctions retained

Kidnapping's safe-release reduction excludes involuntary-servitude division (A)(6), and its under-thirteen/sexual-motivation branch supplies special life terms. Trafficking in persons has a special ten-through-fifteen-year minimum range rather than the ordinary first-degree range. Money laundering in support of terrorism begins at misdemeanor level and has its own dollar thresholds. Vandalism expressly adds a fine; public-amusement trespass permits additional community service. Arson registration depends on 2909.13 through 2909.15 and cannot be inferred from the offense grade alone.

Ordinary felony/misdemeanor sentencing sources remain distinct from special specifications, offense-date rules, organizational fines, restitution, special fines and other sanctions. This packet does not claim comprehensive case-law coverage or recursive dependency closure.

## Verification and next publication step

```sh
node --import tsx scripts/data-review/ohio-major-substantive.ts --check
npx vitest run tests/ohio-major-substantive.test.ts tests/ohio-coverage-frontier.test.ts
npx tsc --noEmit
```

The focused tests cover individual identities, complete statutory names, grade exceptions, non-offense exclusions, existing holds, source corruption and reproducibility. They verify bindings and accounting; they are not a substitute for substantive source review.

The next publication batch can reuse these individually bound mappings to construct catalog entries, branch-specific penalty explanations and search aliases together. Before publication, complete the applicable dependency and sentencing bindings for each entry; keep excluded branches out of selectable scope and test that runtime text does not imply their inclusion. Translation status must remain explicit. This packet supplies no publication approval or renewal and makes no claim of live availability.
