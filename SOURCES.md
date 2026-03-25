# OpenDefender — Data Sources Index

**Internal reference document. Not a public site page.**

This index documents where every category of data on the OpenDefender platform comes from, what verification processes are in place, and where to look to update the data. It is intended for quality control reviewers, contributors, and maintainers.

Last reviewed: March 2026

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

**Important caveat:** This database contains synthesized charges based on standard criminal law patterns and Model Penal Code principles. The statute codes used are generated for consistency, not pulled directly from individual state legislature websites. The file itself contains this disclosure in its header comments.

This means:
- Charge categories and penalty ranges reflect common patterns across US jurisdictions
- Individual statute codes (e.g., "Cal. Penal Code § X") should be verified against the actual state code before being cited authoritatively
- This data powers the AI Case Guidance feature's charge classification and validation, not the static editorial pages

**Reference used during creation:** Model Penal Code (American Law Institute); FBI Uniform Crime Reporting (UCR) classifications for charge frequency ranking.

**Optional live statute APIs (configured but not required):**
- OpenLaws API — https://docs.openlaws.us/ (env var: `OPENLAWS_API_KEY`)
- GovInfo API — https://api.govinfo.gov (env var: `GOVINFO_API_KEY`)
- LegiScan API — https://api.legiscan.com/ (env var: `LEGISCAN_API_KEY`)

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
- **Claim:** "Studies show detained defendants face worse case outcomes."
- **Source:** This is a widely documented finding. Primary references include BJS *Pretrial Detention and Misconduct in Federal District Courts* and Arnold Foundation pretrial research. The current content does not cite a specific study inline — this is flagged as an area to strengthen with a specific citation.
- **Location:** `client/src/lib/legal-glossary-data.ts`, Pretrial Detention entry

**To update statistics:** Check the U.S. Sentencing Commission's annual Sourcebook (https://www.ussc.gov/research/sourcebook) and BJS data tools (https://bjs.ojp.gov/) for updated figures. When figures change materially, update both the EN string and the ES/ZH translations in `client/src/i18n.ts`.

---

## 8. Static Editorial Pages

The following pages are manually authored and maintained by the platform team. They are not validated by the automated legal accuracy validator (which only applies to AI Case Guidance output).

| Page | File |
|------|------|
| Your Constitutional Rights | `client/src/pages/rights-info.tsx` |
| First 24 Hours After Arrest | `client/src/pages/first-24-hours.tsx` |
| Right to an Attorney | `client/src/pages/right-to-counsel.tsx` |
| Search and Seizure | `client/src/pages/search-seizure.tsx` |
| Understanding Warrants | `client/src/pages/warrants.tsx` |
| Collateral Consequences | `client/src/pages/collateral-consequences.tsx` |
| Immigration Guidance | `client/src/pages/immigration-guidance.tsx` |
| Quick Reference Card | `client/src/pages/quick-reference.tsx` |
| Criminal Justice Process | `client/src/pages/process.tsx` |

**Reference sources used during authorship of these pages** (not exhaustive — pages were researched at time of writing):
- U.S. Constitution (First, Fourth, Fifth, Sixth, Eighth, Fourteenth Amendments)
- Miranda v. Arizona, 384 U.S. 436 (1966) — right to remain silent
- Gideon v. Wainwright, 372 U.S. 335 (1963) — right to counsel
- Mapp v. Ohio, 367 U.S. 643 (1961) — exclusionary rule
- Terry v. Ohio, 392 U.S. 1 (1968) — stop and frisk / reasonable suspicion
- Illinois v. Gates, 462 U.S. 213 (1983) — probable cause standard
- ACLU Know Your Rights — https://www.aclu.org/know-your-rights
- National Immigration Law Center — https://www.nilc.org/

**To update:** Review the page content against the current constitutional and statutory landscape. For immigration pages, check USCIS policy updates at https://www.uscis.gov/ and EOIR at https://www.justice.gov/eoir.

---

## 9. External APIs and Services

### AI Case Guidance
- **Provider:** Anthropic Claude Sonnet 4 (claude-sonnet-4-6)
- **Purpose:** Generates personalized case guidance based on user-provided charge and jurisdiction
- **Validation:** Output passes through the two-tier legal accuracy validator before delivery
- **Env var:** `ANTHROPIC_API_KEY`

### Case Law Validation (Tier 2)
- **Service:** CourtListener API — https://www.courtlistener.com/api/rest/v4
- **Purpose:** Semantic search for case law precedent to validate AI-generated guidance
- **Authentication:** Optional (`COURTLISTENER_API_TOKEN`). Fails silently if unavailable.
- **Note:** This validator runs only on AI output, not on static editorial pages.

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
The charges in `shared/criminal-charges.ts` are based on Model Penal Code patterns, not individually pulled from each state's legislature. Generated statute codes are used for consistency in the AI guidance system. Statute citations from this database should not be cited as authoritative without cross-referencing against the relevant state's official code.

**Pretrial detention outcome statistic lacks inline citation.**
The claim that "studies show detained defendants face worse case outcomes" in the Pretrial Detention glossary entry does not currently cite a specific study. This should be updated to reference a named BJS or Arnold Foundation study.

**Diversion program data changes frequently.**
Eligibility criteria, operating hours, phone numbers, and even program existence change often. The quarterly URL check catches dead links but cannot verify whether the program details are still accurate. Diversion program entries should be re-verified against the source court or prosecutor's office at least annually.

**Static editorial pages are author-maintained.**
The legal accuracy validator only applies to AI-generated Case Guidance output. Static pages (rights-info, first-24-hours, warrants, etc.) are the responsibility of the platform authors. There is no automated check for stale content on these pages.

**BJS analytics integration is in progress.**
References to Bureau of Justice Statistics (BJS) API integration for crime statistics and NCVS/NIBRS data appear in the codebase but are not yet live. Do not cite these as active data sources.

### What has continuous automated validation
- Federal statute URLs (quarterly)
- Legal aid organization URLs (quarterly)
- AI Case Guidance output against statute DB and CourtListener (at generation time)
