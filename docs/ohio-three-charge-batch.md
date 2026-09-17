# Ohio three-charge source-first batch

September 17, 2026, UTC; development only. This follows the felonious-assault batch and the withheld simple-assault review.

## Added records

| Official section | Official title | Conditional grading |
| --- | --- | --- |
| 2903.21 | Aggravated menacing | M1 ordinarily; specified child-services circumstances F5, or F4 with the fully qualifying prior offense |
| 2903.15 | Permitting child abuse | F3 for serious physical harm; F1 for death |
| 2903.18 | Strangulation | B1 F2, B2 F3; B3 F5/F4/F3 according to its exact conditions |

These are three new canonical identities. They do not rename, alias or retire existing saved-case IDs. In particular, aggravated menacing must not be confused with menacing or menacing by stalking.

## Material safeguards

- Aggravated menacing requires the statutory belief of serious harm, not weapon display or an actual injury. Organizational targeting includes governmental employers. The felony conditions retain the victim's agency status, actual/anticipated duties, and all qualifying-prior circumstances. Pregnancy exceptions and harm-to-property definitions are included.
- Permitting child abuse retains custody, both age categories, proximate causation and the two affirmative-defense requirements together. It does not assume strict liability merely because the section does not spell out a mental state; the general culpability rules are required evidence.
- Strangulation preserves all three conduct branches and the medical/beneficial-procedure defense. Within B3, the relationship-plus-prior-violent-felony condition is distinct from the independent known-pregnancy alternative. The latter does not require that relationship or a prior conviction.
- Strangulation adopts the dating definition in 3113.31(A)(8), not the adult-respondent condition in that section's A9. Its own former-dating window is twelve months. Household definitions preserve the separate five-year cohabitation and natural-parent rules.
- Fine amounts are ceilings; ordinary prison terms are conditional. Modern F1/F2 minimums are distinguished from indefinite maximums. The minimum-plus-50% example is limited to one qualifying felony.
- English, Spanish and Chinese explanations retain these boundaries. Translations are drafts and attorney review remains pending.

## Evidence and accounting

Acquisition used a separate nine-page batch file. Eight of those pages became required pinned dependencies; 5103.02 was acquisition-only because its appearance of “private child placing agency” was not a standalone definition of that term. No professional licensing or agency-status certification is claimed.

The full current receipt covers 44 distinct official pages. Dry-run totals:

- 12 source-first Ohio records, up from 9.
- 22 selectable Ohio charges, up from 19.
- 127 catalog/audit rows; 105 still require exact reselection.
- 75 source identities and 138 provision links/snapshots.
- 14 offense-bearing Chapter 2903 sections remain without source-first records.

These units are not interchangeable. Chapter inventory remains 40 sections; this batch is not completion of Ohio or a basis for a national estimate.

## Still withheld

The new source-first §2903.13 Assault record remains withheld. Its incorporated HMO-definition issue described in `ohio-simple-assault-review.md` is not resolved by this batch. Historical secondary text was not promoted to current authority.

## Verification boundary

Independent read-only review found no concrete legal-summary blockers. Regression coverage checks statutory identities, conditional grades and defenses, cross-language meaning, correct dependency roles, removed dependencies, expired approval and missing fresh-source checks. No attorney sign-off, production deployment, historical-law certification or substantive generated-guidance audit is claimed.

Development synchronization subsequently completed with 22 selectable charges and 138 links. After restart, the API returned each of the three new records with its required provenance; the unresolved source-first assault record remained absent. The Case Guidance landing page rendered normally. Type checking and focused regression checks passed, including the corrected inventory totals.

Reproduce with:

1. `npx tsx scripts/data-review/acquire-ohio-homicide-support.ts --chapter-batch` — acquisition only, not approval.
2. `npm run review:ohio-pilot-refresh` — currentness comparison against independently pinned text.
3. `npm run db:seed:ohio -- --dry-run`
4. `npx vitest run tests/ohio-chapter-batch.test.ts tests/ohio-source-database.test.ts tests/ohio-deployment-seed.test.ts`