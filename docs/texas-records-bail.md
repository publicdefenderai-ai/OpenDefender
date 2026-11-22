# Texas false reports, governmental records and bail appearance

## Scope and integration

48 individually identified choices: three recipient branches under §37.08(a), three appearance-offense grades under §38.10, and six §37.10(a) conduct theories with seven bounded record/grade scopes each. This branch is stacked on PR 293 (`ce1c1ee4e7a7a33484e9a14c1f3b84eb85e28632`); merge 293 first, then retarget this branch to main and verify the combined counts. NY research PR 294 touches no files in this batch.

The four DPS 2025 adult-arrest codes ranked 91, 92, 95 and 110 total 4,577 records. These prioritize research; they are not counts of unique people, nor counts attributable to the 48 subdivisions. The workbook hash and exact ranked rows are retained in `texas-records-bail-priorities.json`.

All 547 inherited manifest records and the manifest-level metadata are unchanged. There are 595 configured Texas identities, 518 offline eligible identities and 77 held identities; the seed contains 289 source keys and 6,190 binding references. These counts do not establish production availability. The legacy `tx-failure-to-appear` and `tx-false-info-to-police` remain held for exact reselection; no successor is substituted automatically.

## Boundaries

- False reports require knowing falsity, intent to deceive, materiality and the specified recipient. The investigator/employee predicates are not flattened into the corrections/jailer branch.
- Bail jumping requires lawful release with an appearance condition and a knowing or intentional failure according to that condition. The community-supervision/parole/intermittent-sentence and reasonable-excuse defenses remain visible.
- Record scopes distinguish ordinary A/state-jail grading, issued-document F3/F2, forensic report/device F3 and issued search warrant F3. The latter three do not automatically inherit the issued-document intent-to-harm F2 clause.
- School/PEIMS, enrollment-residency, contingent-interest appraisal, specified ballot information, temporary tags, insurance/financial-responsibility and mixed special-record cases remain outside these bounded choices. Foreign-government issued-document cases are not added.
- The legally authorized destruction exception, narrow records-transfer rule, lawful public-servant possession defense, limited no-effect defense, disclaimer format and permissive presumption are retained with their own provisions. They are not general exemptions from every act.
- Enactments distinguish the 2009 forensic grades/disclaimer rule, 2011 false-report changes, 2015 warrant grade and 2019 jailer addition from the latest 2023 section version. Earlier-conduct applicability remains explicit. The current §38.10 numbering date is not represented as first criminalization.
- Spanish and Chinese use explicitly marked English fallback; no CPJC instruction is asserted for these new choices.

## Reproducibility

`node --import tsx scripts/data-review/texas-verification/replay-assault-intoxication.ts records-bail` rebuilds the 48 manifest records from 24 retained statutory documents. Eight official enactments retain whole-text hashes and independently sliceable section spans. Replay, missing/changed-source rejection, exact IDs, grading distinctions and dates are tested without a database.

The Texas browser checks now follow snapshot-bound pagination because the fixture exceeds 500 choices. They require stable snapshot/total, forward progress, exact completion and no duplicates; the API's 500-item page limit is unchanged.

## Validation

- App typecheck and production build passed.
- Five focused suites:27 passed, zero failed.
- Isolated production browser checks: 27 passed, zero failed; no retries.
- Full regression suite and production data checks were not run.

No import, receipt issuance/renewal, activation, production operation or publication is included.

## Published scopes

| ID | Conduct subdivision | Ordinary grade |
|---|---|---|
| `tx-pc-37-08-investigator` | 37.08(a)(1) | Class B misdemeanor |
| `tx-pc-37-08-agency-employee` | 37.08(a)(2) | Class B misdemeanor |
| `tx-pc-37-08-corrections-jailer` | 37.08(a)(3) | Class B misdemeanor |
| `tx-pc-38-10-ordinary` | 38.10(a) | Class A misdemeanor |
| `tx-pc-38-10-fine-only` | 38.10(a) | Class C misdemeanor |
| `tx-pc-38-10-felony` | 38.10(a) | Third-degree felony |
| `tx-pc-37-10-false-entry-ordinary` | 37.10(a)(1) | Class A misdemeanor |
| `tx-pc-37-10-false-entry-ordinary-harm` | 37.10(a)(1) | State jail felony |
| `tx-pc-37-10-false-entry-issued-document` | 37.10(a)(1) | Third-degree felony |
| `tx-pc-37-10-false-entry-issued-document-harm` | 37.10(a)(1) | Second-degree felony |
| `tx-pc-37-10-false-entry-expert-report` | 37.10(a)(1) | Third-degree felony |
| `tx-pc-37-10-false-entry-testing-device-report` | 37.10(a)(1) | Third-degree felony |
| `tx-pc-37-10-false-entry-search-warrant` | 37.10(a)(1) | Third-degree felony |
| `tx-pc-37-10-fabricate-present-use-ordinary` | 37.10(a)(2) | Class A misdemeanor |
| `tx-pc-37-10-fabricate-present-use-ordinary-harm` | 37.10(a)(2) | State jail felony |
| `tx-pc-37-10-fabricate-present-use-issued-document` | 37.10(a)(2) | Third-degree felony |
| `tx-pc-37-10-fabricate-present-use-issued-document-harm` | 37.10(a)(2) | Second-degree felony |
| `tx-pc-37-10-fabricate-present-use-expert-report` | 37.10(a)(2) | Third-degree felony |
| `tx-pc-37-10-fabricate-present-use-testing-device-report` | 37.10(a)(2) | Third-degree felony |
| `tx-pc-37-10-fabricate-present-use-search-warrant` | 37.10(a)(2) | Third-degree felony |
| `tx-pc-37-10-destroy-conceal-impair-ordinary` | 37.10(a)(3) | Class A misdemeanor |
| `tx-pc-37-10-destroy-conceal-impair-ordinary-harm` | 37.10(a)(3) | State jail felony |
| `tx-pc-37-10-destroy-conceal-impair-issued-document` | 37.10(a)(3) | Third-degree felony |
| `tx-pc-37-10-destroy-conceal-impair-issued-document-harm` | 37.10(a)(3) | Second-degree felony |
| `tx-pc-37-10-destroy-conceal-impair-expert-report` | 37.10(a)(3) | Third-degree felony |
| `tx-pc-37-10-destroy-conceal-impair-testing-device-report` | 37.10(a)(3) | Third-degree felony |
| `tx-pc-37-10-destroy-conceal-impair-search-warrant` | 37.10(a)(3) | Third-degree felony |
| `tx-pc-37-10-possess-sell-unlawful-use-ordinary` | 37.10(a)(4) | Class A misdemeanor |
| `tx-pc-37-10-possess-sell-unlawful-use-ordinary-harm` | 37.10(a)(4) | State jail felony |
| `tx-pc-37-10-possess-sell-unlawful-use-issued-document` | 37.10(a)(4) | Third-degree felony |
| `tx-pc-37-10-possess-sell-unlawful-use-issued-document-harm` | 37.10(a)(4) | Second-degree felony |
| `tx-pc-37-10-possess-sell-unlawful-use-expert-report` | 37.10(a)(4) | Third-degree felony |
| `tx-pc-37-10-possess-sell-unlawful-use-testing-device-report` | 37.10(a)(4) | Third-degree felony |
| `tx-pc-37-10-possess-sell-unlawful-use-search-warrant` | 37.10(a)(4) | Third-degree felony |
| `tx-pc-37-10-make-present-use-false-ordinary` | 37.10(a)(5) | Class A misdemeanor |
| `tx-pc-37-10-make-present-use-false-ordinary-harm` | 37.10(a)(5) | State jail felony |
| `tx-pc-37-10-make-present-use-false-issued-document` | 37.10(a)(5) | Third-degree felony |
| `tx-pc-37-10-make-present-use-false-issued-document-harm` | 37.10(a)(5) | Second-degree felony |
| `tx-pc-37-10-make-present-use-false-expert-report` | 37.10(a)(5) | Third-degree felony |
| `tx-pc-37-10-make-present-use-false-testing-device-report` | 37.10(a)(5) | Third-degree felony |
| `tx-pc-37-10-make-present-use-false-search-warrant` | 37.10(a)(5) | Third-degree felony |
| `tx-pc-37-10-possess-sell-unlawfully-obtained-ordinary` | 37.10(a)(6) | Class A misdemeanor |
| `tx-pc-37-10-possess-sell-unlawfully-obtained-ordinary-harm` | 37.10(a)(6) | State jail felony |
| `tx-pc-37-10-possess-sell-unlawfully-obtained-issued-document` | 37.10(a)(6) | Third-degree felony |
| `tx-pc-37-10-possess-sell-unlawfully-obtained-issued-document-harm` | 37.10(a)(6) | Second-degree felony |
| `tx-pc-37-10-possess-sell-unlawfully-obtained-expert-report` | 37.10(a)(6) | Third-degree felony |
| `tx-pc-37-10-possess-sell-unlawfully-obtained-testing-device-report` | 37.10(a)(6) | Third-degree felony |
| `tx-pc-37-10-possess-sell-unlawfully-obtained-search-warrant` | 37.10(a)(6) | Third-degree felony |
