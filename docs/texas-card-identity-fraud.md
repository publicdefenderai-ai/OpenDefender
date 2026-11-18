# Texas card and identifying-information fraud

Twenty-eight individually supported choices cover Penal Code §§32.31, 32.315 and 32.51. They replace the unsafe availability of the section-wide identity-theft label with conduct and quantity choices, and keep the already withheld generic credit-card-fraud label unavailable. Saved identities require explicit reselection; no existing case is silently assigned a quantity or punishment.

## Priority selection

The retained [official DPS workbook](https://www.dps.texas.gov/administration/crime_records/pages/aareststatsoffense26.xlsx), January 13, 2026 snapshot, records 2025 adult arrests. Rank 54 is code 26050014, credit/debit-card abuse, with 2,948 adult arrests. Rank 58 is code 26040042, fewer-than-five-item identifying-information fraud, with 2,646. Together they represent 5,594 adult arrests, not convictions, unique people or a count for each published subdivision. The neighboring card-data statute and higher quantities have no separate arrest total attributed here.

Workbook SHA-256: `779a075cbb9e423f75330cda4fe9d89585c0b28fe41c5b577cd50161309b9483`. Reproduce the rank with `python3 scripts/data-review/texas-verification/rank_arrests.py /path/to/aareststatsoffense26.xlsx --limit 75`. Selected rows are retained in `texas-card-identity-fraud-priorities.json`. Shared DPS aliases do not establish that every arrest had a particular sub-branch or enhancement.

## Individual scopes

| ID | Conduct | Ordinary grading |
| --- | --- | --- |
| tx-pc-32-31-1-a | §32.31(b)(1)(A) | §32.31(d) |
| tx-pc-32-31-1-b | §32.31(b)(1)(B) | §32.31(d) |
| tx-pc-32-31-2 | §32.31(b)(2) | §32.31(d) |
| tx-pc-32-31-3 | §32.31(b)(3) | §32.31(d) |
| tx-pc-32-31-4 | §32.31(b)(4) | §32.31(d) |
| tx-pc-32-31-5 | §32.31(b)(5) | §32.31(d) |
| tx-pc-32-31-6 | §32.31(b)(6) | §32.31(d) |
| tx-pc-32-31-7 | §32.31(b)(7) | §32.31(d) |
| tx-pc-32-31-8 | §32.31(b)(8) | §32.31(d) |
| tx-pc-32-31-9 | §32.31(b)(9) | §32.31(d) |
| tx-pc-32-31-10 | §32.31(b)(10) | §32.31(d) |
| tx-pc-32-31-11 | §32.31(b)(11) | §32.31(d) |
| tx-pc-32-51-person-under-5 | §32.51(b)(1) | §32.51(c)(1) |
| tx-pc-32-51-person-5-to-9 | §32.51(b)(1) | §32.51(c)(2) |
| tx-pc-32-51-person-10-to-49 | §32.51(b)(1) | §32.51(c)(3) |
| tx-pc-32-51-person-50-plus | §32.51(b)(1) | §32.51(c)(4) |
| tx-pc-32-51-deceased-under-5 | §32.51(b)(2) | §32.51(c)(1) |
| tx-pc-32-51-deceased-5-to-9 | §32.51(b)(2) | §32.51(c)(2) |
| tx-pc-32-51-deceased-10-to-49 | §32.51(b)(2) | §32.51(c)(3) |
| tx-pc-32-51-deceased-50-plus | §32.51(b)(2) | §32.51(c)(4) |
| tx-pc-32-51-child-under-5 | §32.51(b)(3) | §32.51(c)(1) |
| tx-pc-32-51-child-5-to-9 | §32.51(b)(3) | §32.51(c)(2) |
| tx-pc-32-51-child-10-to-49 | §32.51(b)(3) | §32.51(c)(3) |
| tx-pc-32-51-child-50-plus | §32.51(b)(3) | §32.51(c)(4) |
| tx-pc-32-315-under-5 | §32.315(b) | §32.315(e)(1) |
| tx-pc-32-315-5-to-9 | §32.315(b) | §32.315(e)(2) |
| tx-pc-32-315-10-to-49 | §32.315(b) | §32.315(e)(3) |
| tx-pc-32-315-50-plus | §32.315(b) | §32.315(e)(4) |

### Card abuse

[Section 32.31](https://tcss.legis.texas.gov/resources/PE/htm/PE.32.htm#32.31) has twelve listed choices because (b)(1)(A) and (B) are separated and the other ten numbered alternatives retain their own required conduct. The knowledge, intent, merchant role, incomplete-card quantity and issuer/cardholder-consent conditions are not replaced by a generic fraud description. Receiving a benefit requires knowledge of the underlying violation. The stolen-card receiving alternative carries the intent-to-use/sell/transfer requirement; stealing separately depends on theft. The ordinary punishment is state-jail felony punishment; an offense proved against an elderly individual, age 65 or older, is third degree. Every choice states both the ordinary range and the specific conditional increase.

### Identifying information

[Section 32.51](https://tcss.legis.texas.gov/resources/PE/htm/PE.32.htm#32.51) separates another person's information without consent, deceased-person information without legal authorization, and a child younger than 18. The child branch does not add a lack-of-parental-consent element absent from its text. All require intent to harm or defraud. Each conduct category has fewer-than-five, five-to-nine, ten-to-49 and 50-or-more quantity choices.

Items, persons and documents are different measures. The name/date-of-birth combination in (a)(1)(A) is not two separate items. [Cortez (2015)](https://law.justia.com/cases/texas/court-of-criminal-appeals/2015/pd-0501-14.html) and [Ex parte Bodden (2024)](https://law.justia.com/cases/texas/court-of-criminal-appeals/2024/wr-90-536-02.html) confirm the importance of correctly identifying the information rather than merely counting its physical containers. Bodden also clarifies that financial account information need not always include a routing number when other information identifies the account. This packet does not automatically compute the number of items from a user's narrative or import an earlier statutory definition into current law.

The three-person intent presumption is distinct from the five-item grading threshold. The lawful-business/government exception is retained. For the first three quantity grades, (c-1) provides a one-category increase when its elderly-victim or fraudulent-use-to-facilitate-registration-offense condition is proved. The first-degree quantity branch is expressly excluded from that increase. Each applicable higher range is stated. Reference to article 62.102 supports the enhancement cross-reference; it does not newly publish a standalone registration offense or decide whether any particular person has a registration duty.

### Card information

[Section 32.315](https://tcss.legis.texas.gov/resources/PE/htm/PE.32.htm#32.315) separately covers counterfeit cards, nonconsensual card number/expiration-date information and digital-imprint data. Its four quantity choices preserve the specific counterfeit definition and consent conditions. Its rebuttable presumption concerns nonconsent for (b)(2)/(3) after five items; it is not an intent presumption and does not apply to the counterfeit-card alternative. The lawful-business/government exception remains. The elderly/registration enhancement from §32.51 is not transplanted into this statute. Restitution language in both statutes is conditional on a court order and excludes attorney fees from the specified reimbursement provision.

## Evidence, instructions and availability

Eighteen official sections support 326 required references. Thirteen source texts overlap earlier reviewed packets and match exactly. Each retained document includes official heading, effective metadata, acquisition time, chapter hash, text hash and snapshot hash. Current source acquisition does not establish the applicable version for earlier conduct. No old acquisition timestamp or active receipt is renewed.

Publisher pages were checked directly. CPJC 32.11 (edition 055) maps only to unauthorized presentation/use under §32.31(b)(1)(A). CPJC 32.41/32.42 (055) map to the other-person §32.51(b)(1) choices with underlying-conduct labels, not deceased/child conduct or enhancements. CPJC 32.6 (055) is linked with an explicit digital-imprint-only label on the combined §32.315 choices; it is not represented as a verified instruction for every counterfeit/number alternative. Other mappings remain unverified and omitted, without claiming no instruction exists.

- [CPJC 32.11](https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F32_Fraud%2FCPJC32-11.htm&version=055)
- [CPJC 32.41](https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F32_Fraud%2FCPJC32-41.htm&version=055)
- [CPJC 32.42](https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F32_Fraud%2FCPJC32-42.htm&version=055)
- [CPJC 32.6](https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F32_Fraud%2FCPJC32-6.htm&version=055)

The candidate has 296 configured Texas IDs, 221 eligible with complete current evidence, 151 source keys and 1,840 links. The change is 28 additions and one formerly eligible generic identity withheld: net 27 eligible. Generic card fraud was already withheld. Existing holds, source gates and translations remain; new non-English requests show an explicit English-content notice. These are offline counts, not production availability.

Reproduce the 28 manifest records with `node --import tsx scripts/data-review/texas-verification/replay-assault-intoxication.ts card-identity-fraud`. Only the two legacy hold records are changed; all 266 other existing records and the historical manifest generation timestamp are preserved.

## Validation

- Texas, source inventory, jury-instruction, catalog and PDF checks: 165 passed; six database integration tests intentionally skipped.
- Typecheck and production build passed. The isolated production-artifact selector suite passed all 14 checks, including all 28 fraud choices and both legacy exclusions.
- No database operation, import, activation, deployment, monitoring change or receipt renewal.
