# OpenDefender — Data Sources Index

**Internal reference document. Not a public site page.**

This index documents where every category of data on the OpenDefender platform comes from, what verification processes are in place, and where to look to update the data. It is intended for quality control reviewers, contributors, and maintainers.

Last reviewed: March 2026 (updated after editorial review pass)

---

## Table of Contents

1. [Federal Statutes](#1-federal-statutes)
2. [Criminal Charges Database](#2-criminal-charges-database)
3. [Legal Aid Organizations](#3-legal-aid-organizations)
4. [Expungement Eligibility Data](#4-expungement-eligibility-data)
5. [Diversion Programs](#5-diversion-programs)
6. [Legal Glossary](#6-legal-glossary)
7. [Statistics Cited in Content](#7-statistics-cited-in-content)
8. [Static Editorial Pages](#8-static-editorial-pages)
9. [External APIs and Services](#9-external-apis-and-services)
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

**Total charges:** 6,952 (as of 2026-03) — original base charges plus 456 inchoate/derivative charges added March 2026 (Phase 1: criminal attempt, conspiracy, aiding and abetting, accessory after the fact; Phase 2: attempted murder, attempted robbery, attempted sexual assault, criminal solicitation to commit a crime) across all 56 jurisdictions (50 states + DC + AS/GU/MP/PR/VI) plus federal.

**Two tiers of accuracy apply:**

| Tier | Charges | Accuracy approach |
|------|---------|-------------------|
| Base (original) | ~6,496 entries | Synthesized from MPC patterns; statute codes are generated placeholders, not pulled from state legislatures. Penalty ranges reflect common patterns. Do not cite statute numbers as authoritative without cross-referencing the actual state code. |
| Inchoate / derivative (Phase 1 & 2) | 456 entries | Grounded in universal legal doctrine (MPC §§ 2.06, 2.07, 5.01, 5.02, 5.03), which has been adopted substantially by nearly all states. Federal entries cite actual statutes (18 U.S.C. §§ 2, 3, 371, 1113, 1349, 1373, 1951, 2242). State `code` fields reference the MPC section rather than fabricating a state-specific number, which is accurate across all jurisdictions. |

**Important caveat (base charges):** The base charges contain synthesized statute codes used for consistency, not individual state legislature lookups. The file header contains this disclosure. Inchoate charges deliberately avoid this pattern by citing MPC doctrine instead.

- Charge categories and penalty ranges reflect common patterns across US jurisdictions
- Individual statute codes in the base set (e.g., "Cal. Penal Code § X") should be verified against the actual state code before being cited authoritatively
- This data powers the AI Case Guidance feature's charge classification and validation, not the static editorial pages

**References:** Model Penal Code (American Law Institute, §§ 2.06, 2.07, 5.01, 5.02, 5.03); 18 U.S.C. §§ 2, 3, 371, 1113, 1349, 1373, 1951, 2242; FBI Uniform Crime Reporting (UCR) classifications for charge frequency ranking.

**Live statute APIs:**

| API | Role | Status | Env var |
|-----|------|--------|---------|
| OpenLaws — https://docs.openlaws.us/ | **Tier 3 citation fallback** in the legal accuracy validator. When a citation from AI guidance is not found in the local DB, OpenLaws is queried as a live authoritative source before the citation is flagged as unverified. Covers all 50 states + federal (4.3M+ sections). | Active (fails silently if key absent) | `OPENLAWS_API_KEY` |
| GovInfo — https://api.govinfo.gov | Federal statute package search (metadata + document links, not full text). Used in `legal-data.ts` for `searchFederalStatutes()`. | Active | `GOVINFO_API_KEY` |
| LegiScan — https://api.legiscan.com/ | Bill tracking — monitors new criminal legislation across states for staleness detection. Not part of the guidance or validation pipeline. | Configured, not actively called | `LEGISCAN_API_KEY` |

**To update:** For a given state, cross-reference the synthesized charges against the state's current criminal code via its official legislature website. Any corrections to statute citations or penalty ranges should be applied in `shared/criminal-charges.ts`.

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

**Coverage:** 170+ organizations across California, New York, Texas, Illinois, Florida, Arizona, Georgia, and other states. Each record includes name, address, phone, website, and service specialties.

**Verification:** Quarterly automated HTTP check via `.github/workflows/quarterly-data-review.yml` → `check-legal-aid.ts`. Script sends HTTP HEAD requests to all organization URLs and outputs `legal-aid-diff.json` flagging errors, redirects, and timeouts for manual review.

**Last manual verification pass:** March 2026 (13 corrections applied — addresses, phone numbers, and website URLs).

**To update:** For any organization flagged in the quarterly diff, visit the organization's official website directly to obtain current contact information, then update the corresponding record in `server/data/legal-aid-organizations-seed.ts`.

**Key source directories to check during updates:**
- EOIR Pro Bono List: https://www.justice.gov/eoir/pro-bono-legal-service-providers
- LSC Grantee directory: https://www.lsc.gov/grants/grantee-directory
- Federal Defender list: https://www.fd.org/federal-public-defenders

---

## 4. Expungement Eligibility Data

**File:** `client/src/lib/expungement-data.ts`

Each state entry in this file contains a `sources` array listing the exact legal citations used. Currently documented states:

**California**
- California Penal Code Section 1203.4
- California Courts Self-Help Center

**Texas**
- Texas Code of Criminal Procedure, Chapter 55
- Texas Government Code, Chapter 411

**Florida**
- Florida Statute 943.0585 (Expungement)
- Florida Statute 943.059 (Sealing)
- Florida Department of Law Enforcement (FDLE)

Additional states are documented in the file with their respective source citations in the `sources` field of each entry.

**To update:** Visit the official state legislature website for the relevant jurisdiction and compare the waiting periods, exclusions, and procedure steps against what is stored. Fees (e.g., FDLE's $75 processing fee) should be verified directly with the relevant agency.

---

## 5. Diversion Programs

**File:** `client/src/lib/diversion-programs-data.ts`

**Primary sources** (documented in file header and per-program `sources` fields):

1. NDAA Prosecutor-Led Diversion Programs Directory — https://diversion.ndaa.org/
2. Center for Health and Justice Report (2024)
3. Individual county and state superior court websites
4. District Attorney and prosecutor office websites
5. CrimeSolutions.gov (when available)

Each program record carries a `sources` array. Example sources used:
- Los Angeles Superior Court
- Harris County District Courts
- New York State Unified Court System
- Milwaukee County Courts / Wisconsin DOJ TAD Program
- EAC Network
- Delaware Department of Health and Social Services

**Coverage:** 73 programs across California, New York, Texas, Florida, Georgia, Illinois, Delaware, Wisconsin, and additional states.

**To update:** Check the NDAA directory first for additions and changes, then verify each program's eligibility criteria, contact information, and operating status directly with the court or prosecutor's office. Program availability changes frequently.

---

## 6. Legal Glossary

**File:** `client/src/lib/legal-glossary-data.ts`

**Coverage:** 46 terms as of March 2026.

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

All statistics that appear in user-facing content are in `client/src/i18n.ts`. The following are the specific claims with their sources, as embedded in the content strings:

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

| Page | File | Last Reviewed | Next Review |
|------|------|--------------|-------------|
| Your Constitutional Rights | `client/src/pages/rights-info.tsx` | 2026-03 | 2027-01 |
| First 24 Hours After Arrest | `client/src/pages/first-24-hours.tsx` | 2026-03 | 2027-01 |
| Right to an Attorney | `client/src/pages/right-to-counsel.tsx` | 2026-03 | 2027-01 |
| Search and Seizure | `client/src/pages/search-seizure.tsx` | 2026-03 | 2027-01 |
| Understanding Warrants | `client/src/pages/warrants.tsx` | 2026-03 | 2027-01 |
| Collateral Consequences | `client/src/pages/collateral-consequences.tsx` | 2026-03 | 2027-01 |
| Immigration Guidance | `client/src/pages/immigration-guidance.tsx` | 2026-03 (partial) | 2026-09 |
| Quick Reference Card | `client/src/pages/quick-reference.tsx` | 2026-03 | 2027-01 |
| Criminal Justice Process | `client/src/pages/process.tsx` | 2026-03 | 2027-01 |

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

### Court and Legal Aid Geolocation
- **Service:** OpenStreetMap Nominatim — https://nominatim.openstreetmap.org/search
- **Purpose:** ZIP code geocoding for the court and legal aid locator
- **Authentication:** None required

### Immigration Bond Information
- **Data source for bond fund directory:** National Bail Fund Network (referenced in content)
- **URL in content:** https://www.nationalbailfund.org/

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
| `check-detention-facilities.ts` | Validates ICE detention facility data URLs | Diff output |
| `check-consulates.ts` | Verifies consulate contact information and URLs | Diff output |
| `generate-report.ts` | Reads all diff outputs and opens a GitHub Issue with items needing manual review | GitHub Issue |

**What to do when a quarterly issue is filed:** Each item in the issue requires a human to visit the flagged URL or organization directly, verify the current correct information, and update the corresponding seed file or data file in the repository.

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
| Cornell LII | https://www.law.cornell.edu/uscode | Federal statute text |

---

## 12. Data Quality Flags

### Known limitations

**Criminal charges database is synthesized, not direct statute pulls.**
The charges in `shared/criminal-charges.ts` are based on Model Penal Code patterns, not individually pulled from each state's legislature. Generated statute codes are used for consistency in the AI guidance system. Statute citations from this database should not be cited as authoritative without cross-referencing against the relevant state's official code. Tier 3 (OpenLaws) provides a live verification fallback for any citation that appears in AI guidance output.

**Diversion program data changes frequently.**
Eligibility criteria, operating hours, phone numbers, and even program existence change often. The quarterly URL check catches dead links but cannot verify whether the program details are still accurate. Diversion program entries should be re-verified against the source court or prosecutor's office at least annually.

**Immigration guidance requires accelerated review.**
Immigration law and enforcement policy change rapidly. `immigration-guidance.tsx` is on a 6-month review cycle (next due 2026-09) and was only partially reviewed in the March 2026 pass due to file size. Full line-by-line review is outstanding.

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

### What has continuous automated validation
- Federal statute URLs (quarterly)
- Legal aid organization URLs (quarterly)
- AI Case Guidance output: citation existence (Tier 1 DB + Tier 3 OpenLaws), case law precedent (Tier 2 CourtListener), penalty accuracy, jurisdiction match, timeline verification — all at generation time
