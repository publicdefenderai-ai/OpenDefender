# Ohio hazing and protection batch

September 17, 2026. Development verification only; follows `ohio-three-charge-batch.md`.

## Added source-first records

| Section | Statutory title | Grading boundary |
| --- | --- | --- |
| 2903.31 | Hazing | B1/B2 M2; C1/C2 F3 require coerced alcohol/drug consumption resulting in serious physical harm |
| 2903.311 | Reckless failure to immediately report knowledge of hazing | M4; M1 if the hazing causes serious physical harm |
| 2903.32 | Female genital mutilation | F2, with an additional mandatory fine whose amount is capped at $25,000 |

No exact-code legacy records needed retirement. No old saved-case identity was aliased or renamed.

## Evidence and review

Seven current official pages were acquired successfully: the three offense sections and 3719.011, 3719.01, 4729.01 and 2925.01. These support the drug-of-abuse umbrella and its incorporated category definitions. Existing reviewed sentencing, culpability and harm definitions were reused. The combined receipt was refreshed against 51 official pages; acquisition does not approve its own hashes.

The acquisition command now supports reusable named section batches instead of requiring another hardcoded flag per expansion:

```sh
npx tsx scripts/data-review/acquire-ohio-homicide-support.ts \
  --batch-name=hazing-and-protection \
  --sections=2903.31,2903.311,2903.32,3719.011,3719.01,4729.01,2925.01
```

Independent read-only review found one substantive summary omission: the membership-or-affiliation alternative. Both affected explanations were corrected in English, Spanish and Chinese, with a regression test. The source evidence already included the full language. No other concrete blocker was reported.

Other safeguards:

- Hazing covers continued/reinstated membership or affiliation, not just initial student initiation. Mental harm or its substantial risk can qualify. B2 and C2 have deliberately distinct full-line anchors; a shared prefix must not select B2 twice.
- The felony branch requires coerced consumption resulting in serious physical harm, not serious injury alone.
- The reporting offense retains the enumerated roles, official **and** professional capacity, immediate reporting of knowledge, law-enforcement destination and both county alternatives. It is not a universal bystander duty. Its injury enhancement does not import the coerced-consumption requirement from the separate hazing felony.
- Female genital mutilation retains both knowing conduct paths, the under-eighteen condition, transportation purpose, all three medical-exception conditions, and all three expressly excluded defenses.
- Its additional fine must be imposed, but $25,000 is a ceiling, not a fixed fine. The ordinary F2 ceiling is separate. Modern minimum terms are distinguished from indefinite maximums, with the 50% example limited to one qualifying felony.
- Drug classification of particular substances and individual professional licensing/scope require separate review. These summaries do not certify either, or attempt to reproduce every drug schedule and professional licensing rule.

## Verified result

- Application and review-script type checks passed.
- 100 tests across 11 focused suites passed.
- Development synchronization completed with 130 catalog/audit rows, 90 source identities, 167 links and 25 selectable charges.
- The seed inserted 15 snapshots and reused 152; these are not offense counts.
- After restart, all three charges were returned by the Ohio API, with successful source responses containing the required dependencies.
- The Case Guidance page rendered. The pre-existing unauthenticated attorney-session 404 remained separate from the successfully verified charge endpoints.
- The chapter review reports 15 source-first records and 11 offense-bearing sections still without source-first records. Its inventory remains 40 sections: 24 offense candidates, 14 supporting provisions and two structural interpretation sections.
- The 105 legacy rows requiring exact reselection remain unchanged.

§2903.13 remains withheld for its unresolved incorporated-definition issue. Ohio remains incomplete; this batch supplies no national schedule or coverage estimate. Translations remain drafts, attorney review remains pending, and no production deployment or production database change was made.