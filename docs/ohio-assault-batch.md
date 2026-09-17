# Ohio assault continuation

September 16, 2026 (Pacific); development only.

**Subsequent batch:** `docs/ohio-felonious-assault-batch.md` records the later source-first activation of felonious assault. The current total is nine source-first and nineteen selectable Ohio records. This document preserves the preceding aggravated-assault batch.

## Activated scope

Aggravated assault, § 2903.12, is represented by a new source-first section-level record. It replaces the inherited `oh-aggravated-assault` selection without silently migrating saved cases.

The evidence and English/Spanish/Chinese explanation preserve:

- Sudden passion/rage caused by serious victim provocation reasonably sufficient to incite deadly force; anger alone is not the statutory condition.
- Knowing conduct: serious physical harm, or causing/attempting physical harm using a deadly weapon or dangerous ordnance.
- Fourth-degree base grade versus third-degree peace-officer/qualifying BCI-investigator grade.
- Mandatory third-degree imprisonment when such a protected victim suffers serious physical harm.
- The known-pregnancy specification and its separate mandatory-prison rule. § 2929.14(B)(8) permits six months **or** a degree-based term, subject to the offense section's protected-victim override; it is not an added six-month enhancement.
- Separate ordinary fine and prison authorities. Other specifications/counts/sanctions are not presented as resolved by these ordinary ranges.

Required evidence includes culpability, harm, weapons, pregnancy/unborn definitions and exceptions, and the adopted protected-victim definitions. The oath-taking exception in § 2935.081 retains its “as used in this section” scope; it is not treated as a blanket exclusion of highway-patrol troopers from assault protections.

This does not create separate UI controls for every allegation or certify historical-law or case-specific sentencing outcomes.

## Felonious assault remains withheld

Official § 2903.11 and supporting sources were acquired. Its full operative clauses are preserved in the assault review ledger. It is not activated as a new source-first offense by this batch.

Remaining analysis includes the separate (A)/(B) conduct paths, locally modified sexual-conduct definition, first/second-degree grading, protected-victim mandatory rules, pregnancy/accelerant/child-victim specifications, motor-vehicle license suspension, and the qualifying sexual-motivation/predator specification framework.

Using § 2903.11(E)(5) solely as an investigator-definition dependency for aggravated assault does not establish complete felonious-assault coverage. The legacy “Assault with Deadly Weapon” and “Assault on Peace Officer” labels are not silently aliased to either source-first offense.

## Accounting

- Eight source-first records, up from seven.
- Eighteen total selectable Ohio records, unchanged: one inherited selectable record is replaced.
- Eighteen offense-bearing Chapter 2903 sections remain without source-first records, down from nineteen.
- The composed audit catalog contains 123 rows. Dry-run validation yields 50 source identities and 71 links.
- Current-source refresh checks 31 distinct official pages. Twelve pages were acquired for this assault investigation; some remain research-only and cannot renew runtime eligibility.

Sections, source identities, selectable records and retained audit rows are different units. The remaining ten selectable legacy records are not recertified by this batch.

## Reproduction

- `npx tsx scripts/data-review/acquire-ohio-homicide-support.ts --assault`
- `npx tsx scripts/data-review/acquire-ohio-homicide-support.ts --assault-definitions`
- `npx tsx scripts/data-review/review-ohio-assault.ts`
- `npx tsx scripts/data-review/ohio-discovery/review-chapter-2903.ts`
- `npm run review:ohio-pilot-refresh`
- `npm run db:seed:ohio -- --dry-run`

Acquisition is not approval. Separate reviewed pins and exact quoted spans govern required runtime evidence. The new record remains subject to the existing freshness, attorney-review and unreviewed-translation warnings.

## Verification

TypeScript and focused regression checks passed after correcting stale legacy-ID expectations and making the six-month-or-degree-term alternative explicit in all three language summaries. Development synchronization completed with 50 sources, 71 links and 18 selectable records. The running API returned the new aggravated-assault ID and required provenance; the retired ID was absent from selection and its provenance endpoint returned 404. The Case Guidance landing page rendered normally.

No production deployment, independent attorney sign-off or substantive generated-AI-guidance accuracy audit was performed.