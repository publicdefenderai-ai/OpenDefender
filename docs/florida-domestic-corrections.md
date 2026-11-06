# Florida domestic-violence corrections: five existing choices

This batch corrects five existing reviewed identities rather than adding duplicate charges: assault (§784.011), battery (§784.03(1)(a)), stalking (§784.048(2)), aggravated stalking (§784.048(3)), and aggravated battery (§784.045(1)-(2)). Their IDs, names, and existing English, Spanish and Chinese summaries are preserved. Their grading explanations now include the source-bound domestic-violence repeat rules and sentencing qualifications. Spanish and Chinese additions remain explicitly draft translations under the existing product contract.

## What changed

Chapter 2026-86 created §741.2801, effective July 1, 2026. It reclassifies a domestic-violence offense when the accused already had a qualifying domestic-violence conviction at the time of the offense. The rule requires §741.28's family/household relationship; dating alone is insufficient. The express exclusion for §784.03(2) felony battery is retained. Ordinary grades remain the primary category and conditional felony exposure is separately carried in `categories`, including the guidance payload and both category filters.

The correction binds 18 official statutory sections. Fourteen exact source documents are reused from the immediately preceding Florida persons acquisition; four additional exact official pages supply §§741.281, 741.283, 741.325 and 870.01. The new pages were retrieved separately as the publisher's 2026 edition. No source body changed where the new evidence shares a source key with an untouched reviewed record.

The explanations preserve the existing riot variants, distinguish battery's repeat-offense exception, include ordinary custody/fine ranges, and state conditional upgraded ranges. They also bind the domestic-violence minimum probation/program rules and the separate minimum jail terms that require adjudicated guilt and intentionally caused bodily harm. The qualifying child-presence and nonsuspended-state-incarceration conditions are explicit. Stalking retains the separate consecutive-sentence and no-contact rules.

The effective date of chapter 2026-86 is retained in the prior persons packet's effective-date inventory. The new §741.325 dependency's 2026 amendment is chapter 2026-71, §2, effective July 1, 2026 ([official session law](https://laws.flrules.org/2026/71)); it adds optional faith-based programming and does not remove the paragraph (2) qualification condition used here. Earlier conduct still requires the applicable earlier law.

## Exact accounting and remaining work

The targeted §741.2801 screen accounts for all 101 separately reviewed identities:

| Disposition | Records |
| --- | ---: |
| Corrected in this batch | 5 |
| Explicitly enumerated offense family requiring remaining branch review | 1 |
| Injury/death condition priority | 15 |
| Residual factual condition not cleared | 80 |

This is not 96 findings of incorrect law or a statewide completeness claim. Section 741.28's residual language reaches another criminal offense resulting in physical injury or death between qualifying family/household members. A label-only screen cannot resolve those case-specific facts. The 80 residual rows therefore are not marked inapplicable or approved for renewal. The remaining enumerated row is the existing §794.011(2) sexual-battery entry, which needs branch-specific capital/life-grade treatment rather than an invented generic upgrade. The existing §741.31 injunction entry separately needs the chapter 2026-86 repeat-injunction amendment reconciled.

The older 25 legacy choices are not reapproved by this batch. In particular, their aggravated-assault and sexual-battery entries are additional candidates for the next targeted applicability group. The earlier 15-persons batch is unchanged, as are the 92 legacy holds.

## Runtime and approval boundary

The original 101-record receipt is byte-identical. Its old report/eligibility hashes do not approve the corrected packet, even when a test asks about an old date. The entire old reviewed family remains withheld until a separately reviewed comparison/renewal and any required import/deployment occur. This correction does not restore live charges by itself and does not extend dates.

Only five definitions, five drafts and their five decisions change. The other 96 definitions/drafts/decisions remain semantically identical. Source metadata is shared where text hashes match; that reuse does not reapprove other records. The engineering assembly inputs are updated so later reconstruction cannot silently restore the superseded explanations. Previously absent cache dependencies are added; existing cache bodies and acquisition history remain unchanged.

Structural seed and coverage tests use an explicitly synthetic receipt confined to test code. They exercise matching hashes and actual expiry validation, including a previously fresh manifest seeded after expiry. They do not change or approve the committed receipt. Independent real-receipt and runtime gate checks remain fail-closed.

## Verification

No command here uses a database:

```sh
node --import tsx scripts/data-review/florida-domestic/prepare.ts --check
node --import tsx scripts/data-review/florida-domestic/screen.ts --check
npm run check
./node_modules/.bin/vitest run tests/florida-domestic-corrections.test.ts tests/florida-deployment-seed.test.ts tests/florida-source-database.test.ts tests/florida-coverage-inventory.test.ts tests/florida-persons-publication.test.ts tests/florida-persons-runtime-gates.test.ts tests/florida-provenance-freshness.test.ts tests/data-sources-inventory.test.ts tests/charge-explanations-catalog-coverage.test.ts
```

Focused result: 82 tests across nine suites passed. The existing withheld-family browser contract remains unchanged; there is no new selectable family or browser allowlist entry. No import, migration, publication, receipt renewal, or monitoring activation was performed.
