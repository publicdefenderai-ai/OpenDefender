# California person/property expansion

This release proposes 26 new, precisely cited choices for Case Guidance. California's configured selectable catalog increases from 99 to 125; the separate 115-row historical reconciliation and its 21 withheld canonical labels are preserved. These additions are bounded statutory reviews, not certification of every defense, enhancement or case-law issue.

The practical gains include serious-injury battery; ordinary firearm, semiautomatic-firearm and protected-officer assault branches; stun-gun and school-employee offenses; hazing; shooting at inhabited and unoccupied targets; BB-device discharge; aircraft laser/light offenses; and identification/medical-record forgery offenses. Negligent firearm discharge already had a corrected entry, so no duplicate was added. Forgery-facilitation intent remains explicit for §§470a and 470b.

## Review the combined delivery

Start with the [readable review and complete section accounting](../scripts/data-review/output/california-person-property-review.md). The [expanded catalog report](../scripts/data-review/output/california-expanded-catalog-coverage.md) gives the current counts. The earlier `california-catalog-coverage` files remain the frozen input to PR #19's statewide scan; regenerating current coverage now writes the separately named expanded report so historical discovery does not silently change.

| Result for the four selected groups | Sections |
| --- | ---: |
| Source for proposed new branches; other branches remain open | 16 |
| Existing catalog source; other branches remain open | 12 |
| Supporting or procedural provision | 34 |
| Substantive research still open | 79 |
| Deferred lower-priority infraction | 1 |
| Total | 142 |

Twenty-six identities arise from 16 sections because several provisions contain distinct charging branches. This is not a claim that the 142-section batch is substantively complete. There is still no statewide offense denominator or completeness percentage.

The one explicit deferral is §243.83, the sporting-event attendee infraction with a statutory maximum $250 fine. Its severity evidence and revisit condition are in the review JSON. Unknown-severity offenses have not been treated as minor. The three previously identified attorney questions remain in the existing packet; this delivery does not silently resolve them or require the attorney to do routine source lookup.

## Evidence and release boundaries

The batch reuses 39 retained sections and acquires 118 more sections from the same hash-verified official archive, for the 142 candidates and their additional dependencies. Total retained research evidence across California becomes 290 sections/293 versions. Acquisition remains September 24, 2026; offline review is not a source refresh.

Every proposed addition binds its exact content to the primary statute and supporting source versions. Checks reject changed definitions, missing dependencies, altered source bytes, unbound excerpts, alternate/future source versions and incomplete section accounting. A review reuses common classification/sentencing authorities, but does not apply a penalty to an unrelated branch.

New source metadata preserves the actual effective date supplied in the archive. Where it is unknown, it remains null. The September review month is not assigned as an enactment date. Source-specific dates are carried into the reference-only database manifest and included in its fingerprints. The old entries' date convention is not migrated in this batch.

All new entries use English fallback in Spanish and Chinese views until translated content is reviewed. They do not inherit generic name-matched explanations or present English as a completed translation. This limitation is explicit in each definition and displayed through a localized notice in the charge selector, guidance dashboard and PDF. The notice says English is being shown because the requested translation is unavailable; it does not call the English text a draft translation. Localization is still open publication-quality work.

The existing California source-database boundary still withholds an addition unless its seeded identity and all expected source links exist. Production content storage remains reference-only. No real case records, production credentials, external AI requests or live database writes are used by this delivery.

## Reproduce and release

```sh
python3 scripts/data-review/california-verification/acquire-person-property.py
node --import tsx scripts/data-review/california-verification/person-property-review.ts
node --import tsx scripts/data-review/california-verification/coverage.ts
npx vitest run tests/california-*.test.ts tests/data-sources-inventory.test.ts
```

After review and merge, pull main in Replit, run the existing California source seed/republication workflow, and verify live exact IDs, classification alternatives, penalties and representative guidance. A merge alone does not prove deployment. The isolated local release fixture is extended only so browser tests can exercise the new identities; it does not replace the production source gate.

## Next combined batch

Continue the 79 open research sections, prioritizing forgery, theft/receiving and shared value-based grading. Reuse the now-retained full texts and common punishment provisions. Check independent official instruction/charging inventories for omissions before declaring any chapter complete. Later release batches cover the remaining Penal Code, the high-priority Health and Safety/Vehicle/Business and Professions groups, and then other codes and criminally enforceable regulations. Minor ambiguous fringes can remain documented gaps while the important, supported charges proceed.

## Validation

115 California-focused and public-inventory tests passed; two existing opt-in integration tests were skipped. Typecheck and production build passed. All three browser/API tests passed on the final isolated build, including all 26 API records, representative rules classifications and two exact citation searches. Acquisition replay reproduced the committed source artifact byte-for-byte. No production seed, deployment, real case input or external AI call was performed. These results do not assert that unrelated GitHub Actions installation issues are fixed.

Review follow-up: the catalog guard retains name-based coverage for other records and requires exact canonical-ID explanations for every new California identity. All 152 tests in the combined California, catalog-explanation, translation-integrity and PDF-warning suite passed (two opt-in tests skipped); typecheck and production build passed again. PDF rendering tests verify Spanish and Chinese notices precede English content.
