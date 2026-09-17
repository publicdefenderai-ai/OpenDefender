# Ohio Chapter 2903 — continuation

Date: September 16, 2026 (Pacific). Environment: development only.

**Later batch:** `docs/ohio-manslaughter-batch.md` records the subsequent replacement of two inherited manslaughter entries. The source-first total is now seven, with 19 offense-bearing sections remaining. The table below preserves this earlier batch's results.

## Current accounting

| Measure | Result |
| --- | ---: |
| Sections examined against stored official text and pinned hashes | 40 |
| Offense-candidate sections | 24 |
| Supporting sections | 14 |
| Sections still requiring variant/conditional-sentencing analysis | 2 |
| Source-first records configured and seeded | 5 |
| Offense-bearing sections without a new source-first record | 21 |
| Requests for attorney name transcription | 0 |

These are different units: sections, candidates, and published records are not interchangeable. Five source-first records do not certify all allegations, specifications, historical versions, or sentencing outcomes in those sections. The development Ohio API contains 18 selectable records in total; the other 13 retain their earlier evidence status and are not re-certified by this batch.

## Corrected omission

The earlier accounting mistakenly called § 2903.43 supporting-only. Its division (I)(1) prohibits specified reckless failures to enroll, re-enroll, or report an address change; division (I)(2) expressly creates a fifth-degree felony. The corrected candidate preserves the exact operative and grading evidence. A regression guard now refuses supporting-only classification when offense-bearing language is present, even under an administrative heading.

## Newly activated records

| Offense | Source | Base classification | Separate base sentencing support |
| --- | --- | --- | --- |
| Reckless homicide | § 2903.041 | Third-degree felony | § 2929.14(A)(3)(b); § 2929.18(A)(3)(c) |
| Negligent homicide | § 2903.05 | First-degree misdemeanor | § 2929.24(A)(1); § 2929.28(A)(2)(a)(i) |
| Negligent assault | § 2903.14 | Third-degree misdemeanor | § 2929.24(A)(3); § 2929.28(A)(2)(a)(iii) |

Full pinned definition evidence includes § 2901.22 (culpability), § 2903.09 (pregnancy/unborn definitions and their express exceptions, including for negligent assault), and § 2923.11 where relevant (weapons and dangerous ordnance, including exclusions). Full sentencing pages are retained; short base-range summaries explicitly do not predict aggregate sentences, specifications, restitution, or other sanctions.

Each record has an independent source-first ID. The old “Criminally Negligent Homicide” ID is retained for audit and requires reselection; it is not silently aliased. Exact-name explanations are available in English, Spanish and Chinese with the existing unreviewed-translation and attorney-review warnings.

## Structural analysis

The publication-review ledger now retains all detected guilt/grade clauses rather than only the first matching sentence. Explicitly named groups are:

- § 2903.06: aggravated vehicular homicide, vehicular homicide, vehicular manslaughter.
- § 2903.08: aggravated vehicular assault, vehicular assault.
- § 2903.34: patient abuse, gross patient neglect, patient neglect.

Each group has its statutory conduct-division reference and exact supporting quotation with offsets and source hash. Group extraction does not authorize publication or determine whether multiple allegations can be charged or punished together. Conditional grades, exceptions, and all applicable sentencing dependencies still need to be represented and validated. They are not questions about how to transcribe names.

## Reproduction and maintenance

- `npx tsx scripts/data-review/acquire-ohio-homicide-support.ts`: acquire the explicitly scoped official offense/definition/sentencing pages. Acquisition alone cannot approve changed text; runtime uses separate reviewed hash pins.
- `npm run review:ohio-chapter-accounting`: corrected 40-section accounting.
- `npx tsx scripts/data-review/ohio-discovery/review-chapter-2903.ts`: complete chapter review ledger, named groups, quote spans, and cross-reference candidates.
- `npm run review:ohio-pilot-refresh`: check all 13 distinct pinned source pages, including definition dependencies. Live requests are serialized and paced. HTTP 429 receives bounded retries respecting Retry-After; a final failure still revokes the receipt.
- `npm run db:seed:ohio -- --dry-run`: validate the composed catalog without database writes.
- `npm run db:seed:ohio`: intentional development synchronization; this batch produced 30 source identities and 35 authority links for 18 selectable charges.

Refresh still requires an operator. No scheduler, production deployment, production schema migration, complete historical-law validation, independent attorney approval, or substantive generated-guidance audit is claimed.

## Evidence outputs

- `scripts/data-review/output/ohio-chapter-2903-accounting.json`
- `scripts/data-review/output/ohio-chapter-2903-accounting.csv`
- `scripts/data-review/output/ohio-chapter-2903-publication-review.json`
- `scripts/data-review/output/ohio-homicide-support-evidence.json`

The review ledger distinguishes configured source-first records from actual runtime availability. Its cross-reference list is a dependency-discovery aid, not a claim that every referenced provision is required for every case or has already been validated.

## Still to do

Verification for this batch: focused regression tests and TypeScript checking passed. The running development API returned all three added IDs with current provenance, including their § 2903.09 dependency; the retired negligent-homicide ID returned 404 at the provenance endpoint and was absent from selection. The Case Guidance landing page rendered after restart. No new end-to-end generated-guidance accuracy test was performed.

Continue the 21 withheld offense-bearing sections, prioritizing conditional grading and penalty closure. Voluntary manslaughter requires attention to its sexual-motivation division and referenced definition; a generic first-degree range is not a complete treatment of every allegation. Involuntary manslaughter has separate conduct/grade paths and additional intoxication-related consequences. Finish these and the assault/patient/vehicular groups without mechanically creating one offense per paragraph.

Then enumerate sections outside Chapter 2903 and continue the Ohio felony/common-misdemeanor inventory. Keep this work in the main conversation for monitoring. Do not infer a national estimate from cached acquisition speed or these few activated records.