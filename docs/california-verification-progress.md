# California verification: first delivery

Started September 24, 2026. This delivery establishes a reproducible baseline and official source acquisition for a 25-record batch. It does not certify or publish those records.

## Measured baseline

The current code contains 120 canonical records, of which 99 are configured selectable. The separate legacy inventory has 115 rows: 49 retain, 7 alias, 44 requiring reselection, and 15 removed. These are overlapping populations, not additive counts of offenses. The old California authority memo's 49-selectable figure predates the 50 explicit reselection alternatives.

The public Case Guidance screen displayed 99 California choices on September 24, 2026. This confirms the visible count only, not full record identity, API, penalty, or generated-guidance parity. Direct public API reads returned HTTP 403; a normal browser could load the selector. No real case inputs or private user records were used.

The [generated batch checklist](../scripts/data-review/output/california-batch-one-baseline.md) lists 25 existing IDs across person/officer, public-order, property, drug-possession, and driving groups. They share 21 declared statute URLs. This is an engineering priority checklist, not a frequency-ranked sample. Shared sentencing and definition dependencies remain to be added through substantive review. Every record is marked not yet verified in this batch; old currentness assertions are preserved as claims to check.

## Acquisition route

California Legislative Counsel provides an [official download directory](https://downloads.leginfo.legislature.ca.gov/) and [PUBINFO instructions](https://downloads.leginfo.legislature.ca.gov/pubinfo_Readme.pdf). The instructions explicitly describe loading the session data and LAW_SECTION_TBL statute content into a local database. The small official loader kit confirms the 18-column table format and associated content files. This establishes an official bulk route for research acquisition; it does not change the application's existing reference-only publication policy.

Use the session archive, currently pubinfo_2025.zip, for code tables. The similarly named pubinfo_daily_* archives explicitly exclude code tables. Acquisition time, archive modification time, and a section's operative date are different facts. Preserve all matching versions and inspect history, future operative provisions, and changes since the archive before approving current law. A successful download or an active flag is not sufficient.

The raw archive and selected XML stay in the ignored .cache/california-bulk directory. The committed acquisition report contains source identifiers, version metadata and hashes, not the archive or private records. Extraction is offline and verifies the archive hash against its receipt. It never selects a winning version or changes runtime availability.

## Acquisition result

The September 21 archive (1,279,738,518 bytes) was downloaded September 24 and hashed. All 21 requested sections were found, each with one matching version in this archive. The [acquisition manifest](../scripts/data-review/output/california-batch-one-acquisition.json) preserves identifiers, histories and hashes. This is 21 acquired sections, not 25 verified charges. Later changes and shared dependencies remain to be checked.

The real data also demonstrates why review dates cannot substitute for effective dates: five requested sections have no effective-date value in the table, while histories contain enactment or initiative information. The extractor preserves missing dates as null. PEN 415 and PEN 594 illustrate histories where effective and operative dates differ; neither is automatically reduced to one currentness date.

## First issues to resolve in this batch

- **Assault identity:** the existing §245(a)(1) elements include force likely to cause great bodily injury. The [official section](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=245.) separates non-firearm deadly-weapon assault in (a)(1) from force-likely assault in (a)(4). Correct the scope and review the linked jury instruction before publication.
- **Classification display:** getCaliforniaCanonicalCharge derives category by searching prose for “infraction,” “misdemeanor,” and “felony.” The live screen consequently displays Petty Theft as Infraction and §11350 possession as Felony. The [petty-theft infraction provision](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=490.1.) has specific conditions; [§11350](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=HSC&sectionNum=11350.) has different punishment paths and exceptions. A single keyword-derived category cannot communicate those conditions. Resolve precise variants and UI treatment rather than flipping one default label.
- **Missing dependencies:** the assault record links §240 but its ordinary punishment is in [§241(a)](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=241.). Battery links §243 but also needs the conduct definition in §242. Existing URL counts do not establish complete evidence.
- **Dates:** currentness.effectiveDate is uniformly assigned the month of an earlier catalog check. It must not be treated as a statute-specific effective date. Acquire version evidence before changing this field.

These are engineering/research findings, not questions delegated to the attorney. Bring only remaining interpretive choices with exact evidence and proposed treatment after the source review.

## Deliverable boundary

The next substantive delivery should combine the 25-record review, shared dependencies, supported corrections, any exact-subdivision reselection needs, and search/guidance checks. Preserve stable IDs where meaning is unchanged. Do not automatically remap old cases where the offense identity changes. Keep disputed candidates unavailable with explicit gaps. Do not broaden this batch into an unbounded statewide parser project.

Measure records approved, corrected, withheld, and actually delivered; distinct source documents read; legal questions requiring attorney input; and elapsed acquisition/review time. No efficiency percentage is established by this first acquisition.

## Reproduction

Run the baseline with `node --import tsx scripts/data-review/california-verification/baseline.ts`. It reads the committed catalog only and does not fetch or refresh sources.

Acquire the official session archive once with `python3 scripts/data-review/california-verification/download-bulk.py`. Subsequent runs verify and reuse cached bytes without renewing their timestamp; an explicit `--refresh` reacquires the archive.

After the official archive and its acquisition receipt exist in .cache/california-bulk, run `python3 scripts/data-review/california-verification/extract-bulk.py`. Extraction preserves versions and reports missing sections rather than silently skipping them.

Run parser checks with `python3 -m unittest discover -s scripts/data-review/california-verification -p 'test_*.py'`.

## Separate Ohio rollout observation

The public Ohio selector displayed 10 choices, including Criminal Trespass, and a citation search for 4301.62 returned no choices on September 24, 2026. This differs from the merged configuration of 133 selectable records and its trespass hold. The user reports GitHub and Replit are updated; public deployment/source-seed parity remains unconfirmed. No deployment, production seeding, or production case creation was performed in this task. Resolve this operational mismatch separately from California legal review.

## Checks for this preparation

Four extraction tests and 20 existing California authority/source-database tests pass. The application typecheck passes. The broader scripts typecheck reports errors in existing jsdom-dependent review scripts (missing declarations and resulting implicit/unknown types), outside these new files; it is not green. No production build or end-to-end guidance approval is claimed for this research-only preparation.


## Combined correction delivery after PR 7

The first two groups now have 11 bounded corrections: eight person/officer records and three disturbing-the-peace subdivisions. This improves the actual catalog and exact-ID explanations in English, Spanish, and Chinese. It corrects sentencing language, preserves alternative classifications explicitly, and separates non-firearm deadly-weapon assault from the different force-likely subdivision. The translations remain marked as drafts. These are proposed corrections, not complete legal certification of the records.

The [combined review](../scripts/data-review/output/california-batch-one-review.md) accounts for all 25 records. Its JSON companion retains 57 public statute sections and 58 versions with content hashes. The 14 property, drug, and driving records remain in research. The two versions of VEH 13352 remain separate; neither is silently selected as current. The original baseline is historical and must not be regenerated over the pre-correction evidence.

Shared sources are acquired once and reused across charge records. The offline review validator binds corrections to source hashes and their required dependencies, rejects unresolved versions for corrected references, and prevents unfinished records from being promoted merely by changing a status. Run it with `node --import tsx scripts/data-review/california-verification/review.ts`; it regenerates the human-readable review without the ignored download cache.

### Deployment requirement

After this correction PR is reviewed and merged, Replit must pull the commit, run the existing `npm run db:seed:california` command against its intended database, and republish. The source database still stores references, not the research XML. An old seed missing a new dependency intentionally withholds the affected charge until refreshed. No production database or deployment was changed here. Check the public catalog and guidance after deployment; local release fixtures do not prove public rollout.

### Validation of the corrections

The application typecheck, production build, 35 focused tests (including the nested four Python unittest cases), and two production-browser checks passed. Browser checks exercise all 11 catalog penalties/classification alternatives, a rules-guidance response, and selection by precise citation. They use synthetic inputs with external AI and production database credentials excluded. The new browser tests are included in the existing release-check runner. No full repository regression-suite success or generated AI legal accuracy is claimed.

Next: finish the 14 remaining records as grouped property, controlled-substance, and driving reviews using the already acquired shared sources. Escalate only unresolved legal interpretations with concrete questions; the present delivery does not require attorney data entry.
