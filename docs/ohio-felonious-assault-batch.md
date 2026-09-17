# Ohio felonious assault continuation

September 16, 2026 (Pacific). Development only.

## Source-first record

The new § 2903.11 **Felonious assault** record preserves the section's distinct conduct paths rather than reusing “Assault with Deadly Weapon” or “Assault on Peace Officer.” Those older IDs remain audit records requiring reselection, not aliases.

This is a section-level selection with conditional explanations, not an allegation-specific sentencing calculator, historical-law certification, or legal opinion about an individual case.

## Conditions preserved

- Division (A): knowing serious physical harm, or causing/attempting physical harm with a deadly weapon or dangerous ordnance.
- Division (B): knowledge of a positive carrier test and the separate nondisclosure, mental-capacity, and under-eighteen/nonspouse sexual-conduct alternatives.
- Division (E)(4)'s modified definition: non-body instrument/object insertion into another's vaginal or anal opening is excluded unless the offender knew at the time it carried the offender's bodily fluid. Merely mentioning a “modified definition” is not sufficient in the public explanation.
- Pregnancy/unborn definitions and exceptions, harm/culpability/weapons definitions, and adopted protected-victim definitions.
- Second-degree base grade, the division (A) first-degree protected-victim branch, and the serious-physical-harm mandatory first-degree rule.
- Modern first/second-degree minimums and indefinite maximums are different concepts. The minimum-plus-50% calculation is expressly limited to one qualifying felony.
- Fine amounts are discretionary ceilings, not fixed fines.
- For first/second-degree conduct on or after March 22, 2019, the known-pregnancy specification requires an applicable mandatory minimum—not the six-month alternative applicable in some other circumstances.
- Accelerant six-year term: qualifying permanent injury, consecutive/prior service, and at most one such term for felonies in the same act.
- Child-victim six-year term: under ten, permanent disabling harm, consecutive/prior service, and no other additional prison term for the same offense.
- Division (A)(2) motor-vehicle weapon use: class-two license suspension, three years to life.
- Qualifying convictions on both sexual-motivation and sexually violent predator specifications can invoke life sentencing. Sexual conduct alone does not establish those specifications. The source also retains the age-related sentencing exception.

These conditions are reflected in English, Spanish and Chinese. Translations retain draft-review warnings. The section's other-charge nonpreclusion clause and full source text remain available as evidence; this does not recertify every possible companion offense.

## Accounting

- Nine source-first Ohio records, up from eight.
- Nineteen selectable Ohio records, up from eighteen. The two legacy synthesized labels were already withheld, so this is a net new selectable record.
- Seventeen offense-bearing Chapter 2903 sections remain without source-first records.
- The 40-section chapter inventory remains 24 offense candidates, 14 supporting provisions and two structurally complex sections. These are different units from selectable records.
- Composed audit catalog: 124 rows. Dry-run seed: 60 source identities, 98 links.
- The required evidence receipt now includes 36 distinct official pages. Acquisition alone cannot approve amended text.

## Reproduction

- `npx tsx scripts/data-review/acquire-ohio-homicide-support.ts --felonious-assault-definitions`
- `npm run review:ohio-pilot-refresh`
- `npx tsx scripts/data-review/review-ohio-assault.ts`
- `npx tsx scripts/data-review/ohio-discovery/review-chapter-2903.ts`
- `npm run db:seed:ohio -- --dry-run`

## Review boundary

Independent code review prompted explicit fine-ceiling and object-insertion wording in all languages. Catalog explanation coverage is tested by charge name **and jurisdiction**, rather than requiring Ohio-only statutory names to have a misleading jurisdiction-independent explanation.

No attorney sign-off, production deployment, comprehensive historical validation, or substantive generated-AI-guidance audit is claimed. Continue with the remaining Ohio inventory; do not infer a national forecast from these batches.

## Verification

TypeScript and focused regression checks passed after the review corrections. Development synchronization completed with 60 source identities, 98 links and 19 selectable charges. After restart, the API returned the new felonious-assault record with its required definition, sentencing, specification and suspension references. Both older synthesized IDs were absent from selection and returned 404 at the provenance endpoint. The Case Guidance landing page rendered normally.