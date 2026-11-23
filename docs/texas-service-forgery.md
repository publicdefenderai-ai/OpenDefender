# Texas theft of service and forgery

This batch adds 49 distinct choices: 28 theft-of-service conduct/value combinations and 21 forgery writing-type, purpose/value and elderly-victim scopes. It retires the section-wide `tx-forgery` identity; an old saved selection is not silently converted to a new branch. This is offline catalog work, not an import, deployment, receipt renewal or production eligibility assertion.

## Scope and independent benchmark

The retained Texas DPS 2025 adult-arrest workbook ranks forgery of a financial instrument (25890001) at 121, with 788 records, and theft of service $100–under $750 (23990178) at 150, with 480. These are arrest records, not unique people or subdivision-specific frequency estimates. The current forgery grade differs from the historical DPS label. The workbook does not select the applicable law for particular conduct.

| Statutory scope | Choices | Current ordinary grades |
| --- | ---: | --- |
| §31.04(a)(1), service secured by deception/threat/false token | 7 | C, B, A, state jail, third, second, first |
| §31.04(a)(2), diversion of another's services | 7 | Same value ladder |
| §31.04(a)(3), written rental retained without consent | 7 | Same value ladder |
| §31.04(a)(4), agreed service unpaid after qualifying notice | 7 | Same value ladder |
| §32.21(b)/(c), residual writing | 2 | State jail; third for elderly-victim finding |
| §32.21(b)/(d), specified commercial instruments | 2 | Third; second for elderly-victim finding |
| §32.21(b)/(e)(1), (2), (3), specified money/records/instruments | 6 | Second; first for elderly-victim finding |
| §32.21(b)/(e-1)(1)–(6), property/service purpose and value | 11 | B, A, state jail, third, second, first; five separate elderly enhancements |

Each forgery choice binds the common conduct in (b), the exact writing/grade subdivision, definitions, value rules, presumptions and applicable sentencing provisions. Elderly means 65 or older and the offense must be against that person. Section (e-2) expressly excludes the highest value-ladder branch, (e-1)(6), from its increase. It does not create an offense above first degree here.

## Applicability boundaries

Theft of service requires both intent to avoid payment and knowledge that the service requires compensation. Unpaid debt alone does not supply intent. Written-rental and rent-to-own exclusions remain separate, as do diversion and agreed-service nonpayment. Property value for a return presumption is not automatically the stolen-service value for grading. The ten-day payment, five/three/two-day return, five-business-day rent-to-own, and two/five-day receipt presumptions retain their predicates; they are not irrebuttable offense elements. Section 2.05 governs permissive inferences. The postdated-check defense remains stated.

H.B. 3463 (2025) permits the specified e-mail/text notice for (a)(4), but not for the separate (c) notice prerequisites to (b)(2), (4) and (5) presumptions. It applies September 1, 2025 onward and preserves earlier law if any offense element predates that date. Existing service value grades were not first created by that amendment.

S.B. 1379 (2025) increased forgery grades and moved the first-degree property/service threshold to $150,000. Its any-element transition also preserves earlier law for pre-September 1, 2025 conduct. H.B. 1910's counterfeit-money presumption began September 1, 2023; it is not a new 2025 rule. H.B. 351 (2017) supplies the earlier value-ladder enactment. The retained enrolled bills include amendment markup and transition/effective-date sections.

The actual majority opinions, rather than publisher summaries or dissent labels, supply the judicial context:

- *Green / Lennox* (2024): separate forgery offenses; (d)/(e) can be charged without adding a nonstatutory negative-purpose allegation, but an applicable reduced value ladder controls.
- *Lennox*, PD-0284-25 (January 29, 2026): trial evidence raising the reduced (e-1) offense requires an instruction even without an objection; unobjected omission is reviewed for egregious harm. An uncharged greater offense must be pleaded rather than arising automatically at trial.

The opinions address historical grades. They do not override the 2025 statutory penalties. Judicial context contains selected majority passages extracted through the browser from accurately labeled Justia/FindLaw mirrors, with hashes and spans. Direct downloads returned 403. It is not represented as full-opinion or official-host acquisition. The FindLaw page appends other opinions; only the majority passages are retained. The Justia 2026 page labeled as a Keel original actually displays a Yeary dissent and is not used as the majority.

## Evidence and integration

The package retains 24 statutory documents, reusing 19 existing acquisitions without refreshing timestamps, plus four enactments and two selected judicial-context records. Every new manifest row is replayed from its exact ordered statutory dependencies. Changed or missing evidence is rejected. Spanish and Chinese use explicit English fallback, not purported translations. No unverified instruction link is added.

This draft stacks on PR301 (`codex/texas-next-frontier`) to preserve its 19 pending choices and avoid a shared-manifest conflict. It also includes already-merged main `327d0071b41a85f944c6685bf5e6f963f28f76dd`; inherited files are not new Texas research. Merge PR301 first, then this batch. PR301 remains unchanged during review.

Relative to that 624-row combined baseline, 623 records are byte-equivalent as parsed JSON; only legacy `tx-forgery` is changed to exact reselection. Global manifest metadata is unchanged. There are 49 additions (34 felony, 15 misdemeanor), producing 673 configured records, 595 offline-eligible choices and 78 withheld records. Net eligibility increases by 48, not 49. The seed has 304 source identities and 7,502 physical links/snapshots. These are offline counts, not proposed production writes.

## Validation

Final validation: 49 records replay exactly; six focused test files pass 32 tests; all three Texas browser specs pass 32 scenarios with no retries; typecheck and production build pass. Each command completed with exit 0. The initial focused run exposed two obsolete legacy-forgery test expectations; they now check a real reviewed forgery record and the explicit 78-record hold count. No full regression suite or production data check was run. Focused checks cover independent grade ladders, notice and rental exclusions, elderly thresholds, amendment dates, judicial context, source/hash tampering, legacy reselection, exact catalog identities, and honest translation fallback. Browser checks use the complete snapshot-bound paginated Texas catalog rather than a single 500-row page.

## Remaining work

This is not exhaustive Texas coverage. Other benchmark gaps, including mail theft and separately held speech/Chapter51 issues, remain queued. No source hold is cleared, receipt changed or live availability inferred. Review lessons applied here: current grades and historical opinions are checked separately; majority/dissent text is inspected; global counts include legacy retirement; shared-manifest integration is resolved before review; all validation exits are captured independently.
