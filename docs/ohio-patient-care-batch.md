# Ohio patient-care batch

Development verification, September 17, 2026. Ohio remains incomplete.

## Added records

| Exact provision | Statutory offense | Grading |
| --- | --- | --- |
| 2903.34(A)(1) | Patient abuse | F4; F3 for a prior conviction or guilty plea under any part of 2903.34 |
| 2903.34(A)(2) | Gross patient neglect | M1; F5 for that qualifying prior |
| 2903.34(A)(3) | Patient neglect | M2; F5 for that qualifying prior |
| 2903.35 | Filing false patient abuse or neglect complaints | M1; no imported 2903.34 enhancement |

The three separate offenses are explicitly named in the statute's guilt clauses. Their source identities retain exact conduct subdivisions and the original section heading. No legacy identity was aliased, renamed or retired.

## Reusable improvement

`shared/evidence-backed-charge-batch.ts` projects one reviewed declaration into catalog records, explanations and Spanish/Chinese translation entries. It is jurisdiction-independent but does not approve source evidence or generalize Ohio's legal rules. The patient-care source bindings also reuse the declarations for IDs, subdivisions and sentencing degrees.

Canonical English names remain available for matching charging paperwork, consistent with the existing pilot. EN/ES/ZH explanatory text is present; attorney and fluent-speaker sign-off remain pending.

## Evidence and corrections

Ten new official pages were acquired. Existing harm, culpability and sentencing evidence was reused. The existing refresh command checked 61 distinct pages once; its seven-day gate and separate pin-approval boundary were not changed. Automatic-monitoring implementation was not modified.

Independent read-only review found that the initially selected 5119.34 definition block omitted division (B). The complete definition and exclusions are now included, with a regression check. The live API check also exposed nondeterministic primary-source ordering; Ohio pilot provenance now selects the reviewed exact offense citation rather than whichever supporting source the database returns first.

No unresolved statutory interpretation was identified in this batch. Particular facility classification, licensing consequences, historical applicability and individualized sentencing remain outside these summaries.

## Verification and limits

- Application and review-script type checks passed.
- Across the focused suites and targeted fixes: 113 tests passed; three existing live-integration tests were skipped.
- Development seed: 134 catalog/audit rows, 105 source identities, 226 links/snapshots, 29 selectable charges. Of the snapshots, 15 were inserted and 211 reused.
- Chapter inventory: 40 sections; 19 source-first records; nine offense-bearing sections remain without source-first records. These are not statewide coverage figures.
- The 105 legacy rows requiring reselection remain unchanged. The separate 2903.13 incorporated-definition issue remains unresolved.
- Initial acquisition-to-development-seed interval: approximately 14 minutes, excluding preceding exploration and the subsequent runtime-ordering fix. This is not an end-to-end throughput benchmark or a measured cost saving.
- No production deployment, production database change or new task-agent assignment.