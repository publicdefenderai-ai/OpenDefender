# Florida sexual-battery and injunction corrections

This batch changes two existing reviewed records, adding no charge IDs and renewing no receipt. It follows PR 118's five-record correction without expanding that historical packet. The 101-record family's existing receipt remains unchanged and does not approve the corrected report. Merge alone does not restore production availability.

| Existing record | Publication change | Preserved |
| --- | --- | --- |
| §794.011(2), sexual battery | Separate statutory capital/life classifications from constitutional sentencing limits; bind juvenile sentencing/review, adult-age conditions and fine rules; expose official Kennedy and Graham holding links | Exact identity, under-12 conduct, adult/juvenile branches, translated base summaries |
| §741.31(4)(a), injunction violation | Bind all eight listed conduct alternatives, ordinary misdemeanor/repeat-felony ranges, the definition of conviction, intervention-program exception and economic-damages provision | Existing one-prior/same-victim threshold, category alternatives, translated base summaries; distinct firearm-possession branch remains outside this identity |

The injunction's one-prior threshold was already correct. This is evidence closure and more complete guidance, not a claim that this batch first discovered the 2026 amendment. Its primary category now correctly reflects the ordinary first-degree misdemeanor, with felony retained as the conditional alternative. The 101-record count is unchanged. Published primary-tier totals move one record from felony to misdemeanor; this does not remove the conditional felony exposure from filtering or the guidance payload.

## Evidence and limits

The packet retains 12 exact official statute sections, titles, edition information, acquisition times and content hashes. Six exact sections were reacquired for this task; the other six reuse the preceding candidate's genuine acquisitions. The source texts are unchanged relative to the retained reviewed report wherever both contain the same section. Required dependencies are per record; the assembler checks exact conduct/grading spans and dependency hashes before integration.

The sexual-battery entry does not present statutory death authorization as assured constitutional enforceability, or Kennedy as assurance that a capital prosecution cannot be brought. Section 921.1425 expressly applies to conduct on or after October 1, 2023 and seeks reconsideration of existing precedent. The retained Kennedy majority holding concerns child rape not resulting, or intended to result, in death. The Graham majority holding requires a realistic release opportunity for juvenile nonhomicide offenders, not guaranteed release. These are separately identified judicial sources, not fictional statute snapshots.

The juvenile review explanation remains conditional on offense date and sentence. It does not resolve the exact-20-year wording difference between §775.082(3)(c) and §921.1402(2)(d), promise automatic release, or apply §794.0115's adult-only predicate to a juvenile. Section 741.2801 supplies no listed upgrade from an already capital or life felony; this does not clear unrelated domestic-violence consequences.

The injunction identity covers subsection (4)(a), with its own (4)(c) grading. Subsection (4)(b)/§790.233 possession is not synthesized into this record. General domestic-violence reclassification requires qualifying underlying conduct and is not inferred solely from the injunction label. The unchanged legacy generic assault/sexual-battery choices and remaining factual application groups require their own bounded integration; this packet does not claim statewide completion or clear them implicitly.

Existing Spanish and Chinese base summaries remain intact. Revised sentencing explanations use the existing draft-translation notice. No English fallback replaces those translations.

## Reproduction and verification

No command below connects to a database or issues a receipt:

```sh
node --import tsx scripts/data-review/florida-sexual-injunction/prepare.ts --check
./node_modules/.bin/vitest run tests/florida-sexual-injunction-corrections.test.ts tests/florida-domestic-corrections.test.ts tests/florida-second-batch.test.ts
npm run check
```

`--prepare candidate.json` builds a corrective packet from separately acquired exact-section documents. `--integrate` replaces only the two definitions, corresponding assembler inputs, approved-evidence bindings and report/eligibility hashes. It rejects changed source bodies shared with other records. Neither mode writes a receipt. The changed report and eligibility hashes intentionally no longer match the old reviewed receipt. Its expired time window is a second independent reason the 101-record family stays withheld; neither setting a later clock nor merging these corrections supplies renewal approval. The frozen previous definitions/evidence preserve comparison provenance without private deliberations.

Judicial provenance records bind official Library of Congress U.S. Reports PDF hashes, page numbers, extracted-page hashes and majority-holding excerpt offsets. With the two PDFs downloaded from their recorded URLs as `kennedy.pdf` and `graham.pdf`, optional local replay uses PyMuPDF:

```sh
python3 scripts/data-review/florida-sexual-injunction/verify-judicial-pdfs.py /path/to/public-pdfs
```

The ordinary tests verify retained excerpt hashes, record linkage, statutory bindings, translations and official explanation links. The PDF replay independently verifies full PDF identities and page/excerpt offsets. No full PDFs, case facts, private review material or credentials are included.

Production restoration remains a separate evidence comparison, approval, import and deployment operation. An expired or mismatched receipt must continue to withhold this reviewed family. The independent 15-record persons family and its receipt are untouched.

Validation is run against merged main `4c44290ce92e13de7cb1a8bb919f9291bc0a7875`. The focused Florida and aggregate-count suites, application typecheck, isolated production build, existing Florida release API check, both official PDF replays, offline packet reproduction and whitespace checks exercise this corrective batch. Exactly two existing reviewed drafts changed. Both the old reviewed receipt and independent persons receipt are byte-identical to the base.

Final standalone validation on the current lockfile (Vite 6.4.5): 102 tests passed across 17 Florida/aggregate-count suites, with 43 existing skips; typecheck and isolated production build passed. The existing Florida browser-release API test passed against a local fixture server with no production credentials, confirming independent persons-family availability and withholding of every older reviewed ID. This is fixture verification, not a claim of live database eligibility or production restoration.

## Coordinated merge order

This Florida draft is stacked on `codex/ohio-benefits-fraud-publication` at `462583a9f467ee3a0deedee10c6a75097fa99f95`. Merge Ohio PR #126 first, then this two-record Florida correction. The shared aggregate resolves additively: six Ohio additions plus Florida’s one-record primary-tier shift produce 8,062 choices, with 4,473 felony, 3,522 misdemeanor and 67 infraction primary tiers. No Ohio evidence, receipt, or eligibility changes are introduced by the Florida delta.

Stacked validation: 145 tests passed across 22 combined Florida, Ohio benefits, authority/primary-tier, aggregate-count and receipt-gate suites, with 43 existing skips. Typecheck and Florida offline reproduction passed. The Florida delta contains no Ohio evidence or receipt files.
