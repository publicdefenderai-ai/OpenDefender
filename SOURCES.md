# OpenDefender — Data Sources Index

**Internal reference document. Not a public site page.**

This index documents where every category of data on the OpenDefender platform comes from, what verification processes are in place, and where to look to update the data. It is intended for quality control reviewers, contributors, and maintainers.

Last reviewed: July 2026 (beta banner reinstated; 7 legal-guidance directive phrases softened in EN locale; LOCUS-v1 (LocalLaws) API added to Sections 9 and 11; collateral consequences screener, advocate toolkit, bail preparation, case timeline, and 11 support pages added to Section 8; glossary count updated to 50; stats locale file reference updated to locales/en.ts; criminal-charge-citations.ts overlay file noted in Section 2; API_INTEGRATION_STRATEGY.md charge and statute counts corrected; §10a updated to reflect full 52-jurisdiction coverage — all 18 formerly-low-confidence states verified at medium/high and now injected into AI prompts)

---

## Table of Contents

1. [Federal Statutes](#1-federal-statutes)
2. [Criminal Charges Database](#2-criminal-charges-database)
2b. [Citation Verification — State Sentencing Commission Offense Tables](#2b-citation-verification--state-sentencing-commission-offense-tables)
3. [Legal Aid Organizations](#3-legal-aid-organizations)
4. [Expungement Eligibility Data](#4-expungement-eligibility-data)
5. [Diversion Programs](#5-diversion-programs)
6. [Legal Glossary](#6-legal-glossary)
7. [Statistics Cited in Content](#7-statistics-cited-in-content)
8. [Static Editorial Pages](#8-static-editorial-pages)
9. [External APIs and Services](#9-external-apis-and-services)
10a. [Jurisdiction Procedure Rules](#10a-jurisdiction-procedure-rules)
10b. [Collateral Consequences Data](#10b-collateral-consequences-data)
10. [Quarterly Automated Checks](#10-quarterly-automated-checks)
11. [External Resource Links](#11-external-resource-links)
12. [Data Quality Flags](#12-data-quality-flags)

---

## 1. Federal Statutes

**File:** `server/data/federal-statutes-seed.ts`

**Primary source:** Cornell Legal Information Institute (LII) — https://www.law.cornell.edu/uscode

Statutory text is sourced verbatim from Cornell LII and stored in full (no truncation). Each entry carries `sourceApi: 'cornell_lii'` in the data schema.

**Statutes included:**

| Citation | Description |
|----------|-------------|
| 18 U.S.C. § 1001 | False Statements |
| 18 U.S.C. § 1341 | Mail Fraud |
| 18 U.S.C. § 1343 | Wire Fraud |
| 18 U.S.C. § 111 | Assault on a Federal Officer |
| 18 U.S.C. § 371 | Conspiracy |
| 18 U.S.C. § 641 | Theft of Government Property |
| 18 U.S.C. § 1028 | Identity Theft |
| 18 U.S.C. § 1956 | Money Laundering |
| 18 U.S.C. § 2113 | Bank Robbery |
| 21 U.S.C. § 841 | Drug Possession with Intent to Distribute |

**Verification:** Quarterly automated URL check via `.github/workflows/quarterly-data-review.yml` → `check-federal-statutes.ts`. That script sends HTTP HEAD requests to each Cornell LII URL and flags redirects or errors for manual review.

**To update:** Visit the Cornell LII URL for each statute, compare to the stored text, and update `server/data/federal-statutes-seed.ts`. Statute text changes are rare but do occur when Congress amends a section.

---

## 2. Criminal Charges Database

**File:** `shared/criminal-charges.ts`

**Total charges:** 7,155 (verified April 2026 against live file) — original base charges plus phases 1–5 as described below. Note: the earlier figure of 7,579 cited in March 2026 did not match the live file; the correct count from the search indexer and direct file analysis is 7,155.

**Phase breakdown:**
- Phase 1 (228 entries): Criminal attempt, conspiracy, aiding and abetting, accessory after the fact — MPC §§ 2.06, 2.07, 5.01, 5.03; federal 18 U.S.C. §§ 2, 3, 371
- Phase 2 (228 entries): Attempted murder, attempted robbery, attempted sexual assault, criminal solicitation — federal 18 U.S.C. §§ 373, 1113, 1951, 2242
- Phase 3 (285 entries): Sentencing enhancements — gang/RICO, hate crime, recidivist/three-strikes, firearm-in-felony, drug school zone — federal 18 U.S.C. §§ 249, 521, 924(c), 924(e), 1959; 21 U.S.C. § 860
- Phase 4 (117 entries): White-collar and federal-specific crimes — state RICO/racketeering and money laundering (56 jurisdictions each) plus federal-only entries for RICO (18 U.S.C. § 1962), money laundering (18 U.S.C. § 1956), drug trafficking (21 U.S.C. § 841), illegal entry (8 U.S.C. § 1325), illegal re-entry (8 U.S.C. § 1326)
- Phase 5 (225 entries): Juvenile-specific proceedings — delinquency adjudication (felony and misdemeanor level), transfer to adult court, juvenile firearm possession — all 56 jurisdictions plus federal (18 U.S.C. §§ 5031–5042); key cases: In re Gault (1967), Kent v. United States (1966), Miller v. Alabama (2012)

**Total as of 2026-04: 7,155 charges.** All phases cover 57 jurisdiction codes: 50 states + DC + AS/GU/MP/PR/VI (56 geographic jurisdictions) plus a separate `federal` code (19 charges).

**Two tiers of accuracy apply:**

| Tier | Charges | Accuracy approach |
|------|---------|-------------------|
| Base (original) | ~6,496 entries | Synthesized from MPC patterns; statute codes are generated placeholders, not pulled from state legislatures. Penalty ranges reflect common patterns. Do not cite statute numbers as authoritative without cross-referencing the actual state code. |
| Inchoate / derivative (Phase 1 & 2) | 456 entries | Grounded in universal legal doctrine (MPC §§ 2.06, 2.07, 5.01, 5.02, 5.03), which has been adopted substantially by nearly all states. Federal entries cite actual statutes (18 U.S.C. §§ 2, 3, 371, 1113, 1349, 1373, 1951, 2242). State `code` fields reference the MPC section rather than fabricating a state-specific number, which is accurate across all jurisdictions. |

**Important caveat (base charges):** The base charges contain synthesized statute codes used for consistency, not individual state legislature lookups. The file header contains this disclosure. Inchoate charges deliberately avoid this pattern by citing MPC doctrine instead.

- Charge categories and penalty ranges reflect common patterns across US jurisdictions
- Individual statute codes in the base set (e.g., "Cal. Penal Code § X") should be verified against the actual state code before being cited authoritatively
- This data powers the AI Case Guidance feature's charge classification and validation, not the static editorial pages

**Jury instruction overlay file:** `shared/criminal-charge-citations.ts` — a separate companion file that annotates select charges (primarily CA, NY, FL, TX, PA, OH, IL, and other major jurisdictions) with jury instruction references (`instructionRef`, e.g., "CALCRIM 1600") and direct URLs (`instructionUrl`) to court-hosted instruction documents. This file does not duplicate charge records; it overlays citation and instruction data onto charges defined in `shared/criminal-charges.ts`. Coverage is documented in `docs/citation-research/pji-availability.md`.

**References:** Model Penal Code (American Law Institute, §§ 2.06, 2.07, 5.01, 5.02, 5.03); 18 U.S.C. §§ 2, 3, 371, 1113, 1349, 1373, 1951, 2242; FBI Uniform Crime Reporting (UCR) classifications for charge frequency ranking.

**Live statute APIs:**

| API | Role | Status | Env var |
|-----|------|--------|---------|
| OpenLaws — https://docs.openlaws.us/ | **Tier 3 citation fallback** in the legal accuracy validator. When a citation from AI guidance is not found in the local DB, OpenLaws is queried as a live authoritative source before the citation is flagged as unverified. Covers all 50 states + federal (4.3M+ sections). | Active (fails silently if key absent) | `OPENLAWS_API_KEY` |
| GovInfo — https://api.govinfo.gov | Federal statute package search (metadata + document links, not full text). Used in `legal-data.ts` for `searchFederalStatutes()`. | Active | `GOVINFO_API_KEY` |
| LegiScan — https://api.legiscan.com/ | Bill tracking — monitors new criminal legislation across states for staleness detection. Not part of the guidance or validation pipeline. | Configured, not actively called | `LEGISCAN_API_KEY` |

**To update:** For a given state, cross-reference the synthesized charges against the state's current criminal code via its official legislature website. Any corrections to statute citations or penalty ranges should be applied in `shared/criminal-charges.ts`.

---

## 2b. Citation Verification — State Sentencing Commission Offense Tables

**Purpose:** These official state publications serve as ground-truth audit references for the criminal charges database and for validating AI-generated statute citations. They represent the authoritative enumeration of criminal offenses and their classifications as published by each state's sentencing commission, legislature, or judicial body.

**Audit workbook:** `sentencing-commission-audit.xlsx` (project root) — generated and maintained by `generate_audit_sheet.py`. Contains per-state row counts, source document metadata, and audit notes.

**Source documents inventoried (as of April 2026):**

| State | Document | Edition / Year | Row Count | Notes |
|-------|----------|---------------|-----------|-------|
| Washington | Adult Sentencing Manual — "Felony Index by Offense" | 2025 | 620 | Pages 165–186 of sentencing manual; rows identified by RCW citation pattern at line start |
| Pennsylvania | Sentencing Guidelines — §303a.9 Offense Listing | 8th Edition | 1,335 | 1,348 raw matches minus 13 false positives from statutory class cross-references preceded by "18 Pa.C.S. §" |
| Arkansas | Criminal Benchbook — "Offense Seriousness Ranking Table" | 2026 | 1,222 | Printed pages 15–68 (PDF pages 20–73); rows identified by ACA statute citation pattern |
| Michigan | Sentencing Guidelines — "Alphabetical Felony List" | 2025 | 1,542 | Pages 177–214; 1,328 standard MCL entries + 214 split MCL entries on continuation lines |
| Missouri | Charge Code Manual | Current (pages 1–116) | 2,730 | PDF pages 13–128; rows identified by charge code format `\d+\.\d-\d{3}[YN]\d{4}` |
| Delaware | Criminal Benchbook — "Index of Offenses" | 2025 | 615 | Pages 4–26; 609 full entries + 6 split statute entries (11-1471 Video Lottery subdivisions) |
| Texas | Inventory of Texas Felony Offenses by Category | Current through 85th Legislature (April 2018) | 726 | 706 entries under 24 standard Texas code titles + 20 Vernon's Civil Statutes entries (Racing Act, Securities Act, Sabotage, Sports Bribery, Commodity Markets) |

**How these are used:**

1. **Citation audit:** Row counts from each table are compared against the corresponding charges in `shared/criminal-charges.ts` to identify gaps (charges in our DB with no matching state source entry) or surplus (state offenses not yet in our DB).
2. **Statute code verification:** The official section numbers from these tables are cross-referenced against the synthesized codes in the criminal charges database. Discrepancies are flagged for correction.
3. **Felony classification accuracy:** Penalty classifications (e.g., Class A/B/C felony, First/Second/Third Degree) in these official tables serve as ground truth for auditing AI guidance output.

**Source types by state:**

| Document Type | States | Publisher |
|---|---|---|
| Sentencing commission manual / guidelines | WA, PA, MI | State sentencing commission |
| Criminal benchbook / judicial reference | AR, DE | State Supreme Court or Administrative Office of Courts |
| Legislative charge code manual | MO | Missouri State Courts Administrator |
| Legislative inventory | TX | Texas Legislative Council |

**Obtaining updated editions:**

| State | Source URL |
|-------|-----------|
| WA | https://www.cfc.wa.gov/PublicationRepository/SentencingManual.pdf |
| PA | https://www.pcs.la.psu.edu/guidelines/sentencing-guidelines/current-edition |
| AR | Arkansas Supreme Court / Administrative Office of Courts (benchbook distribution) |
| MI | https://courts.michigan.gov/Administration/SCAO/OfficesPrograms/CriminalCases/Pages/SentencingGuidelines.aspx |
| MO | https://www.courts.mo.gov/page.jsp?id=304 |
| DE | https://courts.delaware.gov/Superior/benchbook.aspx |
| TX | https://www.tlc.texas.gov/policy/felony_offenses.pdf |

**Verification cadence:** These documents are updated by their respective states on legislative session cycles (typically annually or biennially). Re-count and re-audit when a new edition is published or when a state legislative session concludes.

**Known limitations:**
- TX document is through the 85th Legislature, 1st Called Session (April 2018) — newer editions should be checked at tlc.texas.gov
- MO charge code format (`NNNN.N-NNNYNN NNNN`) is specific to the Missouri court case management system and does not map directly to MO Revised Statutes without cross-referencing
- AR Benchbook rows include all seriousness ranking levels (A through E unranked); each seriousness level for the same offense is a separate row
- MI split MCL entries (214 rows) occur when multiple subsections share a single MCL base citation across multiple lines; each subsection line is counted separately

---

## 3. Legal Aid Organizations

**File:** `server/data/legal-aid-organizations-seed.ts`

**Primary sources** (tagged per record in `dataSource` field):

| Source | What it covers |
|--------|---------------|
| `EOIR` | Executive Office for Immigration Review Pro Bono List — immigration legal aid providers approved by EOIR |
| `LSC` | Legal Services Corporation grantees — federally funded civil and criminal legal aid |
| `state_website` | State and county public defender offices — verified directly against official government websites |
| `federal_defender` | Federal Public Defender offices — sourced from federal judiciary directory |
| `state_pd_website` | Local/county public defender offices — verified against official state indigent defense commission or public defender websites |
| `court_admin_website` | Court-appointed attorney programs — verified against court administrator or state judicial branch websites |

**Organization types** (tagged per record in `organizationType` field):

| Type | Description |
|------|-------------|
| `public_defender` | Federal Public Defender offices (one per federal district) |
| `county_public_defender` | Local or county public defender offices handling state criminal cases |
| `court_appointed_program` | Court-administered programs that appoint private attorneys for indigent defendants |

**Coverage:** 170+ organizations including legal aid orgs, federal public defenders, local/county public defenders, and court-appointed programs. As of March 2026, Virginia county public defenders (25 offices) and Phase A state-level PD contacts (18 states) have been added. Coverage will expand quarterly.

**Verification:** Two automated quarterly HTTP checks:
- `check-legal-aid.ts` → `legal-aid-diff.json` — checks legal aid org URLs
- `check-public-defenders.ts` → `public-defenders-diff.json` — checks public defender and court-appointed program websites; also flags entries with missing phone numbers for manual lookup

**Last manual verification pass:** March 2026 (13 corrections applied — addresses, phone numbers, and website URLs; Virginia and Phase A PD offices added).

**To update:** For any organization flagged in the quarterly diff, visit the organization's official website directly to obtain current contact information, then update the corresponding record in `server/data/legal-aid-organizations-seed.ts`. Also update the matching entry in `scripts/data-review/check-public-defenders.ts` (the two lists must be kept in sync).

**Key source directories to check during updates:**
- EOIR Pro Bono List: https://www.justice.gov/eoir/pro-bono-legal-service-providers
- LSC Grantee directory: https://www.lsc.gov/grants/grantee-directory
- Federal Defender list: https://www.fd.org/federal-public-defenders
- Virginia Indigent Defense Commission: https://indigentdefense.virginia.gov
- State PD office lists: each state's indigent defense commission or judicial branch website

---

## 4. Expungement Eligibility Data

**File:** `client/src/lib/expungement-data.ts`

Each state entry in this file contains a `sources` array listing the exact legal citations used.

**Coverage (as of March 2026):** All 50 states + DC + Federal (52 entries total). Expanded from 7 entries (CA, TX, FL, NY, PA, GA, Federal) to full national coverage in March 2026.

**Data methodology:**
- Primary source for each state: state legislature website (state statute text) and/or state court administrative website
- Secondary sources: NCSL Expungement/Sealing State Statutes Survey, Clean Slate Initiative state tracker, National Reentry Resource Center
- Each entry documents the distinction between true expungement (record destruction) and record sealing (access restriction) where applicable
- States with no felony expungement pathway omit `felonyMonths` from `waitingPeriods` rather than setting 0, to avoid misleading the eligibility calculator
- States where expungement is only available at sentencing (not by post-sentence petition) — notably WI — are flagged in the `overview` field
- States with set-aside statutes rather than true expungement — notably AZ, NM — are flagged in the `overview` field

**Notable state-specific rules captured:**
- IL: Cannabis offenses may be expunged immediately under Cannabis Regulation and Tax Act
- NJ: Clean Slate Act (2020) — automatic expungement after 10 years
- NE: No conviction expungement available; only non-conviction records (arrests, acquittals)
- VA: Very limited — primarily dismissals and acquittals; HB 5076 added misdemeanor sealing (2021)
- WI: Expungement only if judge orders it at sentencing; no post-sentence petition
- AZ: Set-aside (not true expungement); separate Prop 207 marijuana pathway
- HI: No felony conviction expungement; misdemeanors only after 5 years
- DC: Misdemeanors and non-violent felonies eligible after waiting period

**To update:** Visit the official state legislature website for the relevant jurisdiction and compare the waiting periods, exclusions, and procedure steps against what is stored. Fees should be verified directly with the relevant state court administrative office. The `lastUpdated` field in each entry records the verification date — entries with dates older than 24 months should be prioritized for re-verification.

---

## 5. Diversion Programs

**File:** `client/src/lib/diversion-programs-data.ts`

**Primary sources** (documented in file header and per-program `sources` fields):

1. **NADCP** — National Association of Drug Court Professionals, Find-a-Drug-Court locator — https://www.nadcp.org/find-a-drug-court/
2. **NDAA** — Prosecutor-Led Diversion Programs Directory — https://diversion.ndaa.org/
3. **National TASC** — Treatment Accountability for Safer Communities (Delaware fallback) — https://www.nationaltasc.org
4. Center for Health and Justice Report (2024)
5. Individual state and county court system websites (official state judiciary portals for all 50 states)
6. State Department of Health agencies (Wyoming, Montana)
7. District Attorney and prosecutor office websites
8. CrimeSolutions.gov (when available)

Each program record carries a `sources` array listing the exact court system or organization the data was verified against.

**Coverage (as of April 2026):** 111 programs covering all 50 states + DC + Federal programs.

| Tier | Programs | Coverage |
|------|---------|---------|
| Metro-area programs | 78 | CA, CO, DE, FL, GA, IL, IN, MA, MN, NC, NY, OH, OR, PA, TN, TX, WA, WI + Federal |
| Statewide programs | 33 | AK, AL, AR, AZ, CT, DC, HI, IA, ID, KS, KY, LA, ME, MD, MI, MO, MS, MT, ND, NE, NH, NJ, NM, NV, OK, RI, SC, SD, UT, VA, VT, WV, WY |

Metro programs represent detailed county- or city-level entries with specific program contacts. Statewide entries point to the official state court system's specialty/problem-solving courts portal, which lists all local programs in that state.

**Link validation script:** `scripts/check-diversion-programs.ts`

Run with:
```bash
npx tsx scripts/check-diversion-programs.ts          # console output only
npx tsx scripts/check-diversion-programs.ts --report  # also writes scripts/output/diversion-link-report.json
```

The script makes HEAD requests to all 111 contact URLs, falls back to GET when HEAD is rejected (405/406), and treats 403/999 responses from government CDN bot-blocks as "live." Exit code 0 = all live, 1 = one or more broken links.

**Last link validation:** April 10, 2026 — 110/111 live (1 intermittent CDN throttle on kscourts.org, which is confirmed live in browser). 9 broken URLs found in pre-existing data were fixed in this pass.

**To update:** Check the NADCP locator (https://www.nadcp.org/find-a-drug-court/) first for additions and changes in specific states, then verify eligibility criteria and contact information directly with the court or prosecutor's office. Run `check-diversion-programs.ts` after any batch update to confirm all contact URLs are still live. Program availability changes frequently — re-run the link checker before each quarterly data review.

---

## 6. Legal Glossary

**File:** `client/src/lib/legal-glossary-data.ts`

**Coverage:** 50 terms as of July 2026.

**Source methodology:** Definitions are written by the platform authors in plain language (6th grade reading level per site policy), synthesized from standard constitutional law and criminal procedure principles. No single external database is used.

**Primary references consulted during authorship:**
- Black's Law Dictionary (standard legal definitions)
- Cornell LII Legal Information Institute — https://www.law.cornell.edu/
- ACLU Know Your Rights materials — https://www.aclu.org/know-your-rights
- U.S. Courts glossary — https://www.uscourts.gov/glossary

Terms include `learnMoreUrl` fields linking to relevant pages on the site where applicable. Terms are not sourced from a live database and do not have automated validation.

**To update:** Review the definition against Cornell LII or the relevant constitutional/statutory text and update the `definition` field. If a term's legal landscape has changed (e.g., bail law), update accordingly and note the date.

---

## 7. Statistics Cited in Content

All statistics that appear in user-facing content are in `client/src/locales/en.ts` (English), `client/src/locales/es.ts` (Spanish), and `client/src/locales/zh.ts` (Chinese). These files replaced the single `client/src/i18n.ts` file as of 2026. The following are the specific claims with their sources:

### Plea bargain rates
- **Claim:** "Approximately 97–98% of criminal convictions are resolved through guilty pleas rather than trials."
- **Sources:**
  - U.S. Sentencing Commission, FY 2024 Sourcebook of Federal Sentencing Statistics
  - Bureau of Justice Statistics (BJS), *Felony Defendants in Large Urban Counties*, 2009
  - ABA Plea Bargain Task Force Report, 2023
- **Location in i18n.ts:** `process.guides.plea.intro`, `process.guides.bondBail.text`

### Probation supervision fees
- **Claim:** "Typical range: $10–$150 per month, depending on state (44 states charge supervision fees). Some states have eliminated fees for low-income individuals."
- **Source:** Fines and Fees Justice Center, 2022
- **Location in i18n.ts:** `support.financial.probationFees.note`

### Pretrial detention / case outcomes
- **Claim:** "People detained before trial are more likely to be convicted and receive longer sentences than similarly situated defendants who were released — even after controlling for charge type and criminal history."
- **Sources:**
  - Laura and John Arnold Foundation, *Pretrial Criminal Justice Research*, 2013
  - Bureau of Justice Statistics, *Pretrial Detention and Misconduct in Federal District Courts, 1995–2010*
- **Location:** `client/src/lib/legal-glossary-data.ts`, Pretrial Detention entry
- **Status:** Citation added inline — ✅ resolved

### Bail guide sourcing
- **Claim:** State bail reform trends, risk assessment tools, preventive detention, bail schedules.
- **Sources:**
  - Pretrial Justice Institute
  - Laura and John Arnold Foundation Pretrial Research, 2013
  - Bail Reform Act of 1984, 18 U.S.C. § 3142
- **Location:** `client/src/i18n.ts`, `process.guides.bail.intro` (EN/ES/ZH)
- **Status:** Source note added to bail guide intro — ✅ resolved

**To update statistics:** Check the U.S. Sentencing Commission's annual Sourcebook (https://www.ussc.gov/research/sourcebook) and BJS data tools (https://bjs.ojp.gov/) for updated figures. When figures change materially, update both the EN string and the ES/ZH translations in `client/src/i18n.ts`.

---

## 8. Static Editorial Pages

The following pages are manually authored and maintained by the platform team. They are not validated by the automated legal accuracy validator (which only applies to AI Case Guidance output).

**Full editorial review log:** [EDITORIAL_REVIEW_LOG.md](./EDITORIAL_REVIEW_LOG.md) — contains per-page primary sources, issues found, fixes applied, last-reviewed dates, and next-review schedule.

**Last review pass:** March 2026. Five content corrections applied (see log for details).

| Page | File | Route | Last Reviewed | Next Review |
|------|------|-------|--------------|-------------|
| Your Constitutional Rights | `client/src/pages/rights-info.tsx` | `/rights-info` | 2026-05 | 2027-01 |
| First 24 Hours After Arrest | `client/src/pages/first-24-hours.tsx` | `/first-24-hours` | 2026-05 | 2027-01 |
| Right to an Attorney | `client/src/pages/right-to-counsel.tsx` | `/right-to-counsel` | 2026-03 | 2027-01 |
| Understanding Warrants | `client/src/pages/warrants.tsx` | `/warrants` | 2026-03 | 2027-01 |
| Immigration Guidance | `client/src/pages/immigration-guidance.tsx` | `/immigration-guidance` | 2026-05 (USCIS AOS memo added) | 2026-09 |
| After Deportation | `client/src/pages/immigration/after-deportation.tsx` | `/immigration-guidance/after-deportation` | 2026-05 (new) | 2026-11 |
| Friends & Family | `client/src/pages/friends-family.tsx` | `/friends-family` | 2026-05 | 2027-01 |
| Friends & Family Toolkit | `client/src/pages/friends-family-toolkit.tsx` | `/friends-family/toolkit` | 2026-05 | 2027-01 |
| Site Directory | `client/src/pages/directory.tsx` | `/directory` | 2026-05 | 2027-06 |
| How It Works (Five Paths) | `client/src/pages/how-to.tsx` | `/how-to` | 2026-05 | 2027-06 |
| Collateral Consequences Screener | `client/src/pages/collateral-consequences.tsx` | `/collateral-consequences` | 2026-07 (new) | 2027-01 |
| Advocate Toolkit Hub | `client/src/pages/for-advocates.tsx` | `/for-advocates` | 2026-07 | 2027-01 |
| Advocate: Intake Checklist | `client/src/pages/for-advocates/intake-checklist.tsx` | `/for-advocates/intake-checklist` | 2026-07 | 2027-01 |
| Advocate: Mitigation Memo Builder | `client/src/pages/for-advocates/mitigation-builder.tsx` | `/for-advocates/mitigation-builder` | 2026-07 | 2027-01 |
| Visual Case Timeline | `client/src/pages/case-timeline.tsx` (route redirect from `/process`) | `/case-timeline` | 2026-05 | 2027-01 |
| Bail Preparation Toolkit | `client/src/pages/support/court-logistics/bail-preparation.tsx` | `/support/court-logistics/bail-preparation` | 2026-05 | 2027-01 |

**Life Support Resource Pages (11 pages under `/support/*`):**

These pages are template-driven with i18n content from `client/src/locales/en.ts`. Each page provides actionable steps, FAQs, and curated external links for a specific life area. Content is authored by the platform team and reviewed on the same annual cycle as other editorial pages.

| Page | Route | Last Reviewed | Next Review |
|------|-------|--------------|-------------|
| Employment | `/support/employment` | 2026-05 | 2027-01 |
| Finances | `/support/finances` | 2026-05 | 2027-01 |
| Housing | `/support/housing` | 2026-05 | 2027-01 |
| Transportation | `/support/transportation` | 2026-05 | 2027-01 |
| Childcare | `/support/childcare` | 2026-05 | 2027-01 |
| Court Logistics | `/support/court-logistics` | 2026-05 | 2027-01 |
| Reputation & Records | `/support/reputation` | 2026-05 | 2027-01 |
| Immigration (Support) | `/support/immigration` | 2026-05 | 2027-01 |
| Mental Health & Treatment | `/support/mental-health` | 2026-05 | 2027-01 |
| Personal Health | `/support/personal-health` | 2026-05 | 2027-01 |
| Family Care | `/support/family-care` | 2026-05 | 2027-01 |

**Merged/redirected pages (May 2026):**
- Search and Seizure — merged as a tab into `/rights-info`. `client/src/pages/search-seizure.tsx` removed; route `/search-seizure` redirects to `/rights-info`.
- Collateral Consequences — content absorbed into `/support/reputation`. Route `/collateral-consequences` redirects there.
- Quick Reference Cards — merged into `/rights-info`. Route `/quick-reference` redirects there.
- Criminal Case Process — redirects from `/process` to `/case-timeline`.
- Record Expungement — redirects from `/record-expungement` to `/support/reputation`.

**Routing change (May 2026):**
- `/directory` and `/how-to` are now separate pages (previously both served by `how-to.tsx` with `/how-to` redirecting to `/directory`). `/directory` (site inventory) now uses `directory.tsx`; `/how-to` (five-path explainer with example journeys) uses `how-to.tsx`. Both are canonical.

**Key primary sources across these pages:**
- U.S. Constitution, Amendments IV, V, VI, VIII, XIV
- Miranda v. Arizona, 384 U.S. 436 (1966)
- Gideon v. Wainwright, 372 U.S. 335 (1963)
- Brewer v. Williams, 430 U.S. 387 (1977)
- Scott v. Illinois, 440 U.S. 367 (1979)
- Mapp v. Ohio, 367 U.S. 643 (1961)
- Terry v. Ohio, 392 U.S. 1 (1968)
- Riley v. California, 573 U.S. 373 (2014)
- Brady v. Maryland, 373 U.S. 83 (1963)
- Fare v. Michael C., 442 U.S. 707 (1979)
- Wilson v. Arkansas, 514 U.S. 927 (1995)
- 18 U.S.C. § 922(g) (firearms prohibition)
- 18 U.S.C. § 3109 (knock-and-announce)
- 34 U.S.C. § 20901 et seq. (SORNA)
- California State Auditor Report 2015-130 (CalGang database)
- ACLU Know Your Rights — https://www.aclu.org/know-your-rights
- National Immigration Law Center — https://www.nilc.org/

**To update:** Review the page content against the current constitutional and statutory landscape. For immigration pages, check USCIS policy updates at https://www.uscis.gov/ and EOIR at https://www.justice.gov/eoir. Record all reviews in `EDITORIAL_REVIEW_LOG.md`.

---

## 9. External APIs and Services

### AI Case Guidance
- **Provider:** Anthropic Claude Sonnet 4 (claude-sonnet-4-6)
- **Purpose:** Generates personalized case guidance based on user-provided charge and jurisdiction
- **Validation:** Output passes through a three-tier legal accuracy validator before delivery
- **Disclaimer:** Every guidance response includes a standard "Statute Citations" notice in the Areas of Uncertainty panel, directing users to verify citations with their attorney or at law.cornell.edu/uscode
- **Env var:** `ANTHROPIC_API_KEY`

### Legal Accuracy Validator — Three Tiers

| Tier | Service | Purpose | Fails silently? |
|------|---------|---------|-----------------|
| Tier 1 | Local statute DB + `shared/criminal-charges.ts` | Citation existence, penalty accuracy, jurisdiction match, timeline verification | No — always runs |
| Tier 2 | CourtListener API — https://www.courtlistener.com/api/rest/v4 | Semantic case law precedent search; confidence boost | Yes (`COURTLISTENER_API_TOKEN` optional) |
| Tier 3 | OpenLaws API — https://docs.openlaws.us/ | Live citation fallback: if not found in local DB, queries OpenLaws before flagging as unverified | Yes (`OPENLAWS_API_KEY` optional) |

The validator runs only on AI-generated Case Guidance output, not on static editorial pages.

### Municipal Ordinance Text — LOCUS-v1 (LocalLaws / UC Berkeley)
- **Service:** LOCUS-v1 — LocalLaws dataset via Hugging Face Datasets Server API — https://huggingface.co/datasets/the-ride/LOCUS-v1
- **Purpose:** Municipal and county ordinance text for local-ordinance charges (loitering, trespass, disorderly conduct, illegal camping, noise violations, and similar municipal offenses)
- **Authentication:** None required (public HuggingFace Datasets Server API)
- **License:** CC-BY-NC-4.0
- **Citation:** Peskoff, Barrow, Vu & Davenport et al. (2026), *LOCUS: A Dataset for Grounding Legal Statements in Local Ordinances*, arXiv:2606.19334
- **Implementation:** `server/services/locus-lookup.ts`
- **Note:** LOCUS-v1 is used as a supplementary reference for local-ordinance charges only. It is not used for state felony or misdemeanor citations, which come from the OpenLaws API and the curated seed database.

### Court and Legal Aid Geolocation
- **Service:** OpenStreetMap Nominatim — https://nominatim.openstreetmap.org/search
- **Purpose:** ZIP code geocoding for the court and legal aid locator
- **Authentication:** None required

### Immigration Bond Information
- **Data source for bond fund directory:** National Bail Fund Network (referenced in content)
- **URL in content:** https://www.nationalbailfund.org/

---

## 10a. Jurisdiction Procedure Rules

**File:** `shared/jurisdiction-procedure-rules.ts`

**What it covers:** Authoritative procedural timelines for all 50 US states + DC + federal, including:
- Arraignment deadline (hours from arrest)
- Bail hearing timing (hours from arrest)
- Speedy trial window (days, by charge class and custody status where the rule varies)
- Phone call rights (statutory limit in hours, or "reasonable time" where no limit exists)
- Bail structure (cash bail, reform status, notable reform notes)

**Consumers:**
1. Legal accuracy validator (`server/services/legal-accuracy-validator.ts`) — imports `JURISDICTION_DEADLINE_RULES` for deadline validation of AI-generated guidance
2. AI guidance prompt builder (`server/services/claude-guidance.ts`) — imports `buildJurisdictionContextBlock()` to inject verified state rules directly into the Claude prompt before generation

**Data confidence tiers (as of July 2026 — all 52 jurisdictions covered):**

| Tier | States | How used |
|------|--------|----------|
| `high` | Federal, CA, NY, TX, FL, IL, PA, OH, GA, NC, MI, NJ, AR | Injected into AI prompts as authoritative cited fact |
| `medium` | VA, WA, AZ, MA, TN, IN, MO, MD, WI, CO, MN, SC, AL, LA, KY, OR, OK, CT, UT, IA, NV, MS, KS, NM, NE, WV, ID, HI, NH, ME, MT, RI, DE, SD, ND, AK, VT, WY, DC | Injected with qualifying language ("generally") |
| `low` | *(none — all jurisdictions now injected)* | — |

**Source methodology:** Each entry cites a specific statute, court rule, or case citation. High-confidence entries are based on well-established, widely-cited rules. Medium-confidence entries reflect best available knowledge from general legal references. Low-confidence entries require verification against current state statutes before being promoted.

**Primary authoritative sources consulted:**
- Federal Rules of Criminal Procedure (Fed. R. Crim. P. 5, 10)
- 18 U.S.C. § 3161 (Speedy Trial Act)
- Individual state criminal procedure codes and court rules (cited per-entry)
- NCSC (National Center for State Courts) — comparative state court procedure reference
- Westlaw state rule summaries (general knowledge basis for medium-confidence entries)

**Key reform notes (as of 2026-07):**
- Illinois: Cash bail eliminated statewide (SAFE-T Act / Pretrial Fairness Act, effective Sept. 18, 2023)
- New Jersey: Cash bail eliminated for most defendants (Criminal Justice Reform Act, effective Jan. 1, 2017)
- New York: Cash bail eliminated for most non-violent offenses (2019 reform, amended 2020 and 2022)
- Washington D.C.: Operates largely without cash bail under the Bail Reform Act framework
- New Mexico: 2016 constitutional amendment allowing non-monetary conditions of release

**To update:** When a state legislature amends a speedy trial statute, bail reform passes, or a court rule is revised:
1. Update the entry in `shared/jurisdiction-procedure-rules.ts`
2. Bump the `lastVerified` date to the current month
3. Promote the `dataConfidence` level if the entry was previously unverified
4. Add a `bailReformNote` or `notes` field documenting the change
5. Update this SOURCES.md entry with the reform note

**Quarterly review:** All 52 jurisdictions are now at medium or high confidence — there are no remaining low-confidence entries. Quarterly review should focus on re-verifying entries whose `lastVerified` date is older than 12 months, and on updating any entries affected by new bail reform legislation or speedy trial statute changes. To re-verify an entry: visit the official state legislature or court rules website, confirm the current rule, update the entry, and bump `lastVerified` to the current month.

---

## 10. Quarterly Automated Checks

Two GitHub Actions workflows run on January 1, April 1, July 1, and October 1 at 08:00 UTC. They can also be triggered manually from the GitHub Actions UI.

**Workflow files:**
- `.github/workflows/quarterly-data-review.yml`
- `.github/workflows/quarterly-content-review.yml`

**What each check does:**

| Script | What it checks | Output |
|--------|---------------|--------|
| `check-legal-aid.ts` | HTTP HEAD requests to all legal aid org URLs — flags 404s, redirects, timeouts | `legal-aid-diff.json` |
| `check-federal-statutes.ts` | HTTP HEAD requests to all Cornell LII statute URLs — flags redirects to different domains | `statutes-diff.json` |
| `check-detention-facilities.ts` | Validates ICE detention facility data URLs | `detention-diff.json` |
| `check-consulates.ts` | Verifies consulate contact information and URLs | `consulate-diff.json` |
| `check-public-defenders.ts` | HTTP HEAD requests to all public defender and court-appointed program websites; also flags entries with missing phone numbers | `public-defenders-diff.json` |
| `check-diversion-programs.ts` | HTTP HEAD/GET requests to all 111 diversion program contact URLs — treats 403/999 from gov CDNs as live; exits non-zero if any true 404/ERROR found | `diversion-link-report.json` |
| `generate-report.ts` | Reads all diff outputs and opens a GitHub Issue with items needing manual review | GitHub Issue |

**What to do when a quarterly issue is filed:** Each item in the issue requires a human to visit the flagged URL or organization directly, verify the current correct information, and update the corresponding seed file or data file in the repository.

---

## 10b. Collateral Consequences Data

**File:** `client/src/lib/collateral-consequences-data.ts`

**Coverage (as of July 2026):** All 50 states + DC (51 entries). Each entry covers seven consequence categories: voting rights, employment (ban-the-box + occupational licensing), public benefits (SNAP/TANF drug felony ban status), housing (fair chance housing laws), driver's license suspension, immigration enforcement posture, and sex offender registration.

**Primary sources per category:**

| Category | Primary Sources |
|---|---|
| Voting rights restoration | State constitution, state election law statutes, CCRC state profiles, ProCon.org felon voting tracker |
| Ban-the-box / fair chance hiring | State statutes, NELP fair chance hiring tracker (nelp.org), NCSL ban-the-box state law survey |
| Occupational licensing nexus reform | CCRC licensing tracker, Institute for Justice occupational licensing database, state licensing board statutes |
| SNAP/TANF drug felony ban | USDA FNS State Options Reports, CLASP state snapshots, 21 U.S.C. § 862a (federal baseline) |
| Fair chance housing | State statutes, CCRC housing tracker, local ordinance text |
| Driver's license suspension (DUI/drug) | State DMV statutes, NCSL DUI law tracker (ncsl.org), GHSA state alcohol-impaired driving laws, Governors Highway Safety Association |
| Immigration enforcement posture | ILRC Quick Reference Chart (2024), ICE 287(g) agreement list, state sanctuary-policy laws, Padilla v. Kentucky, 559 U.S. 356 (2010) |
| Sex offender registration | SORNA, 34 U.S.C. § 20901 et seq.; NCSL sex offender laws database (ncsl.org/research/civil-and-criminal-justice); state sex offender registration statutes |

**Data confidence tiers:**
- `high` — verified against primary state statute text; specific citation exists
- `medium` — verified against secondary source (NCSL, CCRC, NELP) with plausible citation; most entries are medium
- `low` — inference or placeholder; not surfaced to users as authoritative

**Notable state-specific rules captured:**
- Voting: ME, VT, OR (2024): vote while incarcerated. MN (2024): vote while on parole/probation.
- Voting: MS: requires 2/3 legislative vote or gubernatorial pardon for most crimes.
- Voting: FL: Amendment 4 (2018) + SB 7066 financial obligation requirement.
- Voting: VA: depends on executive order, not statute — subject to administration change.
- SNAP: States fully opted out include CA, CO, CT, DC, DE, HI, IA, ID, IL, KS, KY, MA, MD, ME, MI, MN, MT, NE, NH, NJ, NM, NY, OH, OR, PA, RI, UT, VA, VT, WA, WV, WI.
- SNAP: States with full ban or modified ban: AL, AR, AZ, FL, GA, LA, MS (TANF), MO (TANF), NC, OK, SC, SD, TN, TX, WY.
- BTB private employers: CA, CO, CT, DC, HI, IL, MA, MD, MN, NJ, NM, NY, NV, OR, RI, VT, WA.
- Fair chance housing (statewide): DC, NJ, OR, WA. Local ordinances in many others.

**Quarterly review:** Re-verify entries with `lastVerified` dates older than 12 months. Key areas that change frequently:
- State voting rights laws (executive orders are particularly volatile)
- Ban-the-box expansions (many states active in this area)
- SNAP opt-out status (some states have expanded opt-outs in recent legislative sessions)

---

## 11. External Resource Links

The following external organizations are linked from support and resource pages. These links are verified manually and also flagged by quarterly checks.

| Organization | URL | Used for |
|-------------|-----|---------|
| 211.org (United Way) | https://www.211.org | Housing, transportation, childcare resource hub |
| HUD.gov | https://www.hud.gov | Housing and Urban Development resources |
| SAMHSA / 988 Lifeline | https://www.samhsa.gov | Mental health and substance abuse helpline |
| NAMI | https://www.nami.org | National Alliance on Mental Illness |
| EEOC | https://www.eeoc.gov | Employment discrimination resources |
| American Bar Association | https://www.americanbar.org | Pro bono program finder |
| ILRC | https://www.ilrc.org | Immigrant Legal Resource Center |
| ACLU | https://www.aclu.org | Know Your Rights materials |
| CourtListener | https://www.courtlistener.com | Case law research (also used as API) |
| National Bail Fund Network | https://www.nationalbailfund.org | Local bail fund directory |
| Partners for Justice | https://www.partnersforjustice.org | Immigration support |
| EOIR Pro Bono List | https://www.justice.gov/eoir/pro-bono-legal-service-providers | Immigration legal aid directory |
| LSC Grantee Directory | https://www.lsc.gov/grants/grantee-directory | Civil legal aid organizations |
| NDAA Diversion Directory | https://diversion.ndaa.org/ | Prosecutor-led diversion programs |
| NADCP Find-a-Drug-Court | https://www.nadcp.org/find-a-drug-court/ | Drug court and problem-solving court locator (all 50 states) |
| National TASC | https://www.nationaltasc.org | Treatment Accountability for Safer Communities — fallback for states where DHSS sites block automated checks |
| Cornell LII | https://www.law.cornell.edu/uscode | Federal statute text |
| Al Otro Lado | https://alotrolado.org | After-deportation: legal services for deportees in Mexico and Central America; cross-border family reunification |
| RAICES | https://raicestexas.org | After-deportation: legal representation and family reunification services |
| NILC (National Immigration Law Center) | https://nilc.org | After-deportation: know-your-rights resources and immigration policy guidance |
| CLINIC (Catholic Legal Immigration Network) | https://cliniclegal.org | After-deportation: referrals to 370+ affiliated immigration legal service providers |
| Immigration Advocates Network | https://immigrationadvocates.org | After-deportation: free search for immigration legal aid by location |
| NLIHC (National Low Income Housing Coalition) | https://nlihc.org | After-deportation: emergency rental assistance locator by county |
| Vera Institute of Justice | https://vera.org | After-deportation: research and resources on immigration detention and deportation |
| LOCUS-v1 / LocalLaws (UC Berkeley) | https://huggingface.co/datasets/the-ride/LOCUS-v1 | Municipal ordinance text for local-ordinance charges (loitering, trespass, disorderly conduct, etc.). CC-BY-NC-4.0. Cite: Peskoff et al. (2026), arXiv:2606.19334 |

---

## 12. Data Quality Flags

### Known limitations

**Criminal charges database is synthesized, not direct statute pulls.**
The charges in `shared/criminal-charges.ts` are based on Model Penal Code patterns, not individually pulled from each state's legislature. Generated statute codes are used for consistency in the AI guidance system. Statute citations from this database should not be cited as authoritative without cross-referencing against the relevant state's official code. Tier 3 (OpenLaws) provides a live verification fallback for any citation that appears in AI guidance output.

**Diversion program data changes frequently.**
Eligibility criteria, operating hours, phone numbers, and even program existence change often. The quarterly URL check catches dead links but cannot verify whether the program details are still accurate. Diversion program entries should be re-verified against the source court or prosecutor's office at least annually.

**Immigration guidance requires accelerated review.**
Immigration law and enforcement policy change rapidly. `immigration-guidance.tsx` is on a 6-month review cycle (next due 2026-09). A dated policy alert for USCIS memo PM-602-0199 (adjustment of status policy change, May 22, 2026) was added in May 2026. Full line-by-line review of the page body remains outstanding. The new `after-deportation.tsx` page was added May 2026 and is due for its first review by November 2026.

**BJS analytics integration is in progress.**
References to Bureau of Justice Statistics (BJS) API integration for crime statistics and NCVS/NIBRS data appear in the codebase but are not yet live. Do not cite these as active data sources.

**Attorney review not yet completed.**
Platform content has not been formally reviewed by a licensed attorney as of March 2026. A legal review pass is recommended before public launch, particularly for the immigration guidance and collateral consequences pages.

### Resolved since initial index

| Issue | Resolution | Commit |
|-------|-----------|--------|
| Pretrial detention stat had no specific citation | Added Arnold Foundation 2013 + BJS citation inline | `8a96cbd` |
| Bail guide claims uncited | Added Pretrial Justice Institute / Arnold Foundation / 18 U.S.C. § 3142 source note | `8a96cbd` |
| Static editorial pages had no review audit trail | Created `EDITORIAL_REVIEW_LOG.md`; completed March 2026 review pass | `2b2f6fd` |
| Phone call timing overstated (said "3 hours" universally) | Updated to note CA-specific rule; other states require "reasonable time" | `2b2f6fd` |
| Biometrics/passcode law stated with false certainty | Updated to reflect unsettled law with circuit variation | `2b2f6fd` |
| Terry stop custody analysis missing circuit caveat | Added "significant variation by circuit and state" | `2b2f6fd` |
| Knock-and-announce lacked statutory citation | Added 18 U.S.C. § 3109 | `2b2f6fd` |
| CalGang "2016 audit" had no auditor attribution | Added "California State Auditor report (Report 2015-130)" | `2b2f6fd` |
| Synthesized statute codes could pass validator unchecked | Added OpenLaws Tier 3 live citation fallback to validator | `83f3d6c` |
| No user-facing statute disclaimer on AI guidance | Added standard "Statute Citations" uncertainty entry to all guidance responses | `83f3d6c` |
| USCIS AOS policy change not reflected on site | Added dated policy alert (PM-602-0199, May 22 2026) to `/immigration-guidance`; updated after-deportation FAQ Q7 | `1cd0214` |
| After-deportation page had no source inventory entry | Added to Section 8 static editorial pages table with review schedule | This update |
| /directory and /how-to routing entry was stale (said /how-to redirects to /directory) | Updated to reflect split: both are now canonical separate pages | This update |

### What has continuous automated validation
- Federal statute URLs (quarterly)
- Legal aid organization URLs (quarterly)
- Public defender and court-appointed program websites (quarterly); missing phone numbers also flagged
- **Diversion program contact URLs (quarterly)** — all 111 programs via `check-diversion-programs.ts`; 403/999 CDN bot-blocks treated as live, true 404/ERROR responses flagged
- AI Case Guidance output: citation existence (Tier 1 DB + Tier 3 OpenLaws), case law precedent (Tier 2 CourtListener), penalty accuracy, jurisdiction match, timeline verification — all at generation time
