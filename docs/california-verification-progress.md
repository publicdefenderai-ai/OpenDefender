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

## Property and drug correction delivery after PR 8

PR 8 merged at `e04bddca86daecd27cb23403eca51f31cd1877c9`, including deletion of the unused name-only multiple-explanation helper flagged by review.

This delivery combines the six property and two drug records. The cumulative first batch now has 19 records with bounded corrections and six driving records still in research. This count describes corrected records, not completed legal certification or statewide coverage.

The visible changes include misdemeanor-first labels with explicit alternatives for petty theft and §11350 possession; the narrow §490.1 infraction conditions; separate warnings for §§666.1 and 11395 repeat-offender paths; §489(c) and §461(b) punishment dependencies; vandalism fine thresholds; and §11364 exceptions with the §11374 punishment range. All eight use the existing exact-ID explanations in English, Spanish, and Chinese. Translations remain drafts. No new charge IDs or automatic case remappings are introduced.

### Reuse and evidence

All but one needed section were already in the shared review bundle. HSC §11374 was extracted from the existing official archive after verifying its receipt hash, without another network download. The combined bundle now retains 58 sections and 59 versions. Its source record preserves the archive member, table row hash, content hash, and official URL. The existing extractor's `extract(archive, requests)` function reproduces this additional request with `[{"lawCode":"HSC","section":"11374"}]`; it retains every version and never extracts archive paths to disk. The offline review validator and renderer continue to work without the ignored cache.

Supporting references now explicitly distinguish Health and Safety Code sections from Penal Code sections. The same dependency resolver supplies the catalog and review checks. A tested source boundary withholds paraphernalia if its HSC §11374 reference is absent or replaced with a same-number Penal Code reference, while leaving an unrelated charge available.

### Checks and rollout

Application typecheck, production build, 76 focused tests, and four production-browser checks passed. Browser checks cover all 19 corrected penalties/classification alternatives, rules-guidance propagation, and visible petty-theft and possession labels. Synthetic inputs and a local fixture were used; external AI and production database credentials were excluded. The existing release runner already includes the expanded tests. No production seed or deployment was performed.

GitHub checks on PR 8 failed before running tests because `vitest` and `playwright` were not found on the runner (run 36092327383). This is a separate CI installation issue; local passing checks do not establish green GitHub CI. No workflow permissions were requested and no CI configuration was bundled into this data-review change.

After merge, the deployment requirement above still applies: refresh the California source references in the intended Replit database and republish. The next grouped review is the six driving records, including the four DUI subdivisions and the retained versions of VEH §13352. Complete case-law, enhancements, diversion, and independent legal review remain outside the bounded corrections; no new attorney data-entry task is created by this delivery.

## Driving correction delivery after PR 9

PR 9 merged at `faa13f3ff41979e021cf032b4740f2834b8a9d57`, including the reviewed fix that copies explicit California classification alternatives onto existing shared-catalog entries. A regression test reads `criminalCharges` directly, including vandalism, rather than relying solely on canonical lookup helpers. Legacy inventory IDs and primary-category accounting are preserved.

This delivery combines the six remaining initial-batch records: four distinct §23152 DUI subdivisions, reckless driving, and §12500(a) unlicensed driving. The initial 25 records now each have bounded statutory corrections. That is a completed correction pass, not complete legal certification, statewide discovery, or production deployment.

The main corrections are:

- First-offense DUI descriptions distinguish the §23536 punishment without probation from §23538's discretionary jail condition when probation is granted. They preserve repeat-offender felony possibilities and make clear that the ordinary first-offense range is not universal. Subdivisions (a), (b), (f), and (g) remain distinct, including the rebuttable BAC presumption in (b).
- Reckless driving includes the ordinary jail/fine alternatives and identifies §§23104, 23105, and 40008 as separate punishment branches. The ordinary 90-day upper bound is not presented as the limit for every injury or commercial-image-capture case.
- Unlicensed driving uses §40000.10, effective January 1, 2023: an ordinary first or second violation is a $100 infraction, with specified prior-suspension/revocation and third-or-later-violation exceptions. The record is no longer presented as invariably a misdemeanor. §42002 supplies the misdemeanor punishment. §40000.11, collected earlier as a candidate source, does not establish this charge's grading and is not a correction dependency.

All six use the existing translated exact-ID explanation path; translations remain drafts. Vehicle Code dependencies use the same resolver and seeded-reference requirement as the Penal Code and Health and Safety Code dependencies. No new charge IDs or automatic remappings are introduced.

### Future licensing law is accounted for separately

The source bundle retains both VEH §13352 versions. The research note identifies the 2026 amendment with scheduled repeal on January 1, 2033, and the successor not operative until that date. The note binds both version identities and content hashes to their source histories and fixes an explicit research date. The validator rejects choosing the future version for that date, losing its evidence, or advancing the research date to the transition without renewed review.

This is research accounting, not a runtime license calculator or an automatic monitoring service. Offense dates, administrative DMV proceedings, interlock eligibility, exact suspension/revocation duration, and statutory exceptions still require their own review. Neither multi-version section is silently admitted as a single correction source, and no precise license duration is newly published.

### Reuse, checks, and what remains

Six additional sections were extracted from the already cached official archive: VEH §§40000.10, 40000.15, 42002, 23104, 23105, and 40008. The bundle now holds 64 sections/65 versions. Their original member names, table/content hashes, and official URLs are preserved. Reproduce these requests with the existing extractor's `extract(archive, requests)` function after verifying the archive against its receipt. The correction validator/renderer continues to run entirely from committed evidence without that download cache.

Application typecheck, production build, 82 focused tests, and six production-browser checks passed. Browser coverage includes all 25 corrected catalog penalties/categories, rules-guidance propagation, and visible license/DUI classification alternatives. No external AI or real user cases were used. The previously documented GitHub runner installation problem remains separate; these local results do not claim green GitHub CI.

After review and merge, refresh the California source references in the intended Replit database, republish, and verify public rollout as described above. No production seed or deployment occurred here. The next scope is the remaining 74 selectable California records, alongside broader source-discovery accounting so missing charges are tracked rather than equated with catalog coverage. Complete case-law, enhancement, individualized sentencing, and independent legal review remain distinct from this 25-record correction pass. No new attorney data-entry task is needed for the current delivery.
