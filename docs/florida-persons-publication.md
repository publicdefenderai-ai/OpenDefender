# Florida persons publication: 15 additional branches

This batch prepares 15 individually supported choices for reviewed publication. It does not renew the earlier 101-record bundle, clear its holds, import a database, or establish live availability.

## Scope and evidence

The six primary sections are 784.03(2), 784.041(1)-(2), 784.048(4)/(5)/(7), 784.08(2)(a)-(d), 784.082(1)-(4), and 784.085(1)-(3). Each of the 15 definitions binds its primary identity, conduct, grading, complete dependencies and ordinary punishment. Reclassification rows retain the underlying assault/battery definitions rather than treating a penalty clause as the conduct definition. Descriptive branch qualifiers are distinguished from statutory short titles. Existing generic legacy records and earlier reviewed decisions are not overwritten.

Twenty-two distinct exact official section pages provide 37 source bindings. Acquisition used the publisher's selected Florida Statutes 2026 edition on November 6 UTC (November 5 Pacific), not a copied edition label or retrieval-date extension. The immutable source bodies and SHA-256 hashes are in `scripts/data-review/output/florida-persons-publication-evidence.json`; acquisition metadata supports offline reproduction. `scripts/data-review/florida-persons/effective-dates.json` records the independently checked effective-date clauses of the four 2026 session laws appearing in these retained histories. Its hashes cover the identified quotations, not entire PDFs.

The current edition alone was not treated as proof of applicability. Chapters 2026-86, 2026-128 and 2026-149 took effect July 1, 2026; chapter 2026-144 took effect upon becoming law, June 16, 2026. Earlier conduct requires the applicable earlier version. The section 784.03(2) explanation expressly identifies the new resisting-with-violence predicate's July 1 boundary.

## Special penalty handling

- Section 784.08's aggravated branches preserve the three-year minimum, fine, restitution and community-service requirements; all four branches preserve its prohibition on withholding adjudication or sentence.
- Stalking preserves the specified consecutive-sentence and no-contact provisions, without requiring a credible threat for the three new branches.
- Section 784.085 includes attempt and the adult/child age boundary.
- Section 741.2801's July 1, 2026 domestic-violence repeat reclassification is bound alongside section 741.28. Each potentially affected choice describes its conditional upgraded degree and corresponding custody/fine exposure. The definition of conviction and family/household condition are explicit. A dating relationship alone does not establish domestic violence under section 741.28. Section 784.03(2)'s express exception is preserved.
- The two ordinary-assault choices retain primary category `misdemeanor`, derived from their primary statutory grade, and carry both misdemeanor and felony in `categories`. This distinguishes the ordinary charge from the conditional domestic-violence repeat enhancement; category filters and the AI payload retain both. The other 13 choices are felony-primary. Public tier totals count primary categories, not exclusive possible exposure.

All 15 new explanations are English-only with an explicit untranslated-content notice for Spanish and Chinese requests. Existing translated summaries remain unchanged.

## Availability accounting and restoration boundary

At the retained acquisition instant, the new packet contributes 15 independently fresh candidates. The older 101-record receipt remains expired. Offline eligible count is therefore 40: 25 legacy choices plus 15 new choices, subject to actual database eligibility. A fresh old bundle would yield 141, but that is not the current availability claim. Ninety-two existing legacy holds remain unchanged. Configured manifest capacity is 233 (117 legacy records plus 101 earlier reviewed plus 15 new); configured records are not all selectable.

The new quarterly receipt expires February 6, 2027 at 05:10:28.479 UTC, anchored to the oldest genuine required acquisition. Existing receipt files are unchanged. Separate runtime gates ensure that an expired older receipt does not suppress this independent family; fresh evidence still cannot bypass database eligibility.

Restoring the older 101 is a separate substantive/currentness step. The newly identified section 741.2801 requires applicability reconciliation for existing assault, battery, aggravated battery, stalking, aggravated stalking and sexual-battery entries when domestic-violence conditions are present. Other injury-producing family offenses also require screening rather than an automatic all-clear. Unchanged hashes on an old dependency set are insufficient when a newly applicable general statute was absent from it. This batch neither reapproves those records nor changes their receipt. No existing legacy choice is represented as newly verified by this work.

## Reproduction and validation

No command below accesses a database:

```sh
node --import tsx scripts/data-review/florida-persons/prepare.ts --check
npm run check
./node_modules/.bin/vitest run tests/florida-persons-publication.test.ts tests/florida-persons-runtime-gates.test.ts tests/florida-deployment-seed.test.ts tests/florida-source-database.test.ts tests/florida-provenance-freshness.test.ts tests/statutory-receipt-freshness.test.ts tests/data-sources-inventory.test.ts tests/charge-explanations-catalog-coverage.test.ts
```

The isolated release API test is `tests/e2e/florida-persons-publication-release.spec.ts`, included in the committed browser allowlist. It positively checks all 15 new choices and negatively checks the expired older bundle. Running it requires the approved isolated release environment, not production credentials.

After reviewed merge, production import and deployment remain separately authorized operations. They must verify expected linked IDs and API availability rather than infer availability from the receipt or catalog alone. This PR does not authorize them.
