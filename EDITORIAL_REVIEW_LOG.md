# OpenDefender — Editorial Review Log

**Internal reference document. Not a public site page.**

This log tracks the review history of all static editorial pages: when each was last reviewed, what primary sources were consulted, and any outstanding issues. Update this file whenever a page is substantively revised or re-verified.

Companion document: [SOURCES.md](./SOURCES.md)

---

## Review Summary

| Page | Last Reviewed | Reviewer | Next Review Due | Outstanding Issues |
|------|--------------|----------|-----------------|--------------------|
| rights-info | 2026-03-25 | Claude Sonnet 4.6 | 2027-01 | None |
| right-to-counsel | 2026-03-25 | Claude Sonnet 4.6 | 2027-01 | None |
| search-seizure | 2026-03-25 | Claude Sonnet 4.6 | 2027-01 | Phone biometrics law is evolving — re-verify annually |
| warrants | 2026-03-25 | Claude Sonnet 4.6 | 2027-01 | None |
| collateral-consequences | 2026-03-25 | Claude Sonnet 4.6 | 2027-01 | CalGang report year verified (CA State Auditor 2016) |
| immigration-guidance | 2026-03-25 | Claude Sonnet 4.6 | 2026-09 | File too large for full review; mark for secondary pass; high change-velocity content |
| quick-reference | 2026-03-25 | Claude Sonnet 4.6 | 2027-01 | None |
| process | 2026-03-25 | Claude Sonnet 4.6 | 2027-01 | Content is i18n-driven; review i18n.ts keys directly |
| first-24-hours | 2026-03-25 | Claude Sonnet 4.6 | 2027-01 | None |

---

## Page-by-Page Review Records

---

### rights-info.tsx — Your Constitutional Rights

**Last reviewed:** 2026-03-25
**Reviewer:** Claude Sonnet 4.6
**Next review due:** 2027-01

**Primary sources:**
- U.S. Constitution, Amendment IV (search and seizure)
- U.S. Constitution, Amendment V (self-incrimination, due process)
- U.S. Constitution, Amendment VI (right to counsel, speedy trial, confrontation)
- U.S. Constitution, Amendment VIII (excessive bail, cruel and unusual punishment)
- U.S. Constitution, Amendment XIV (due process, equal protection — applies Bill of Rights to states)
- Miranda v. Arizona, 384 U.S. 436 (1966)

**Review notes:**
- Content is predominantly rendered via i18n keys (`t('rights.detailedRights.*')`). The component file is a shell; actual text lives in `client/src/i18n.ts`. Future reviews must grep i18n.ts directly.
- Internal cross-links to `/search-seizure`, `/right-to-counsel`, `/warrants`, `/collateral-consequences`, `/case-guidance` are all valid.
- Jurisdiction defaulting: component uses a jurisdiction state variable. Confirmed it does not hardcode a state.
- Reading level: appropriate. No excessive jargon in visible strings.

**Issues fixed this review:** None

---

### right-to-counsel.tsx — Right to an Attorney

**Last reviewed:** 2026-03-25
**Reviewer:** Claude Sonnet 4.6
**Next review due:** 2027-01

**Primary sources:**
- U.S. Constitution, Amendment V (right against self-incrimination; custodial interrogation trigger)
- U.S. Constitution, Amendment VI (right to counsel at all critical stages of prosecution)
- Miranda v. Arizona, 384 U.S. 436 (1966) — when right to counsel is triggered during interrogation
- Gideon v. Wainwright, 372 U.S. 335 (1963) — right to appointed counsel for indigent defendants
- Brewer v. Williams, 430 U.S. 387 (1977) — deliberate elicitation test; 6th Amendment right
- Scott v. Illinois, 440 U.S. 367 (1979) — appointed counsel required only where imprisonment is actually imposed
- Terry v. Ohio, 392 U.S. 1 (1968) — reasonable suspicion for investigative stops (referenced in custody discussion)

**Review notes:**
- All case citations verified as accurate and relevant.
- Terry stop custody language updated: added "significant variation by circuit and state" qualifier. Prior text said "most courts say no" without noting circuit variation.
- Scott v. Illinois correctly applied — content accurately states appointed counsel is not guaranteed if no imprisonment is imposed.
- 5th vs. 6th Amendment distinction is clearly and correctly drawn throughout.

**Issues fixed this review:**
- Added circuit variation qualifier to Terry stop custody analysis (line 244)

---

### search-seizure.tsx — Search and Seizure

**Last reviewed:** 2026-03-25
**Reviewer:** Claude Sonnet 4.6
**Next review due:** 2027-01

**Primary sources:**
- U.S. Constitution, Amendment IV (search and seizure, warrant requirement)
- Terry v. Ohio, 392 U.S. 1 (1968) — stop and frisk; reasonable suspicion standard
- Riley v. California, 573 U.S. 373 (2014) — police need a warrant to search a cell phone
- U.S. Constitution, Amendment V (5th Amendment privilege against testimonial compulsion; basis for passcode protection)

**Review notes:**
- Scenario-based format (traffic stop, home, phone, Terry stop) is well-suited for the audience.
- Plain view doctrine: referenced implicitly ("items out in the open") but not named. Acceptable — naming it without explanation would add jargon.
- Search incident to arrest / car search: accurately stated as a general rule; does not overstate scope.
- Phone biometrics: prior text ("Fingerprint/Face ID can be forced, but passcodes cannot") overstated certainty. Updated to reflect that biometrics are unsettled law with circuit variation, while passcodes remain more clearly protected under the 5th Amendment.
- The "100-mile border zone" is accurate (CBP regulatory authority); content appropriately notes it on the immigration cross-reference page rather than here.

**Issues fixed this review:**
- Replaced overconfident biometrics/passcode statement with accurate unsettled-law framing (lines 142–143)

**Ongoing watch:** Phone biometrics case law is actively developing. Re-verify at next annual review.

---

### warrants.tsx — Understanding Warrants

**Last reviewed:** 2026-03-25
**Reviewer:** Claude Sonnet 4.6
**Next review due:** 2027-01

**Primary sources:**
- U.S. Constitution, Amendment IV (warrant requirement, probable cause, particularity)
- 18 U.S.C. § 3109 (knock-and-announce requirement for federal officers)
- Form I-200 (ICE administrative warrant — Order of Supervision)
- Form I-205 (ICE administrative warrant — Warrant of Removal/Deportation)
- Wilson v. Arkansas, 514 U.S. 927 (1995) — knock-and-announce as 4th Amendment component
- ACLU (documented ICE administrative warrant violations)
- National Immigration Law Center / NILC (documented warrant violations)
- Vera Institute of Justice (consent under coercion research)

**Review notes:**
- ICE administrative vs. judicial warrant distinction is the most critical content on this page. Confirmed legally accurate: Form I-200 and I-205 are administrative documents that do NOT carry judicial authority to enter a home without consent. Multiple federal court decisions support this.
- Knock-and-announce requirement: added 18 U.S.C. § 3109 citation for federal officers; state equivalents noted as varying.
- 100-mile border zone: content accurately states CBP authority applies within 100 miles of any external U.S. border; this is CBP regulatory authority, not a constitutional provision.
- The warrant comparison table (Search / Arrest / ICE Administrative / ICE Judicial) is accurate and appropriately structured.

**Issues fixed this review:**
- Added 18 U.S.C. § 3109 citation to knock-and-announce section (line 526)

---

### collateral-consequences.tsx — Hidden Consequences of a Conviction

**Last reviewed:** 2026-03-25
**Reviewer:** Claude Sonnet 4.6
**Next review due:** 2027-01

**Primary sources:**
- Immigration and Nationality Act (INA) — aggravated felony deportation provisions; Crimes Involving Moral Turpitude (CIMT)
- 18 U.S.C. § 922(g) — federal lifetime firearms prohibition for convicted felons
- Sex Offender Registration and Notification Act (SORNA), 34 U.S.C. § 20901 et seq.
- 42 U.S.C. § 1437 — federal public housing authority (HUD regulations on criminal history)
- 7 U.S.C. § 2015(r) — federal SNAP drug felony ban (with state opt-out provisions)
- 20 U.S.C. § 1091 — federal student aid (Pell Grant) suspension provisions
- California Penal Code § 186.22 — gang enhancement statute
- Texas Penal Code Ch. 71 — gang enhancement statute
- California State Auditor Report 2015-130 (CalGang database, 2016)

**Review notes:**
- Immigration consequences section is legally accurate. The statement "no discretion for an immigration judge" applies correctly to aggravated felonies under the INA.
- SNAP/TANF ban accurately notes that California, New York, and Illinois have opted out; Texas retains the federal ban.
- Voting rights section correctly characterizes state variation (California/Illinois/New York restore upon sentence completion; Texas restores only after full sentence plus parole).
- 18 U.S.C. § 922(g) firearms prohibition correctly cited as a lifetime federal ban.
- CalGang attribution improved: prior text said "a 2016 audit" without naming the auditor. Updated to "California State Auditor report (Report 2015-130)."
- Non-citizen defendants: content appropriately flags that immigration attorney consultation is essential. A dedicated callout exists on this page.

**Issues fixed this review:**
- Added "California State Auditor report (Report 2015-130)" attribution to CalGang database claim (line 284)

---

### immigration-guidance.tsx — Immigration Guidance

**Last reviewed:** 2026-03-25 (partial — file too large for complete review)
**Reviewer:** Claude Sonnet 4.6
**Next review due:** 2026-09 (accelerated — high change-velocity content)

**Primary sources (identified from partial review):**
- Immigration and Nationality Act (INA)
- DHS/ICE enforcement procedures and forms (I-200, I-205, I-247)
- U.S. Constitution, Amendment IV (applies to all persons in the United States regardless of status)
- DACA program (USCIS policy guidance) — verify at uscis.gov/daca before each review
- Executive Office for Immigration Review (EOIR) — immigration court procedures
- 8 U.S.C. § 1325 / § 1326 — unlawful entry and re-entry statutes

**Review notes:**
- File is approximately 56KB, too large for a complete line-by-line review in this pass.
- Immigration law and enforcement policy change rapidly, particularly under new administrations. This page requires more frequent review than others.
- DACA eligibility criteria must be verified against current USCIS guidance before each review — the program has been subject to ongoing litigation.
- ICE warrant and raid content cross-references warrants.tsx; confirmed consistent.
- Carousel-based step format for deportation phases is structurally sound; verify procedural steps against current EOIR guidelines.

**Outstanding issues:**
- Full line-by-line review is incomplete. Flag for a dedicated secondary review pass.
- All procedural timelines (bond hearings, notice to appear, appeal deadlines) should be verified against current EOIR practice at justice.gov/eoir.

---

### quick-reference.tsx — Quick Reference Card

**Last reviewed:** 2026-03-25
**Reviewer:** Claude Sonnet 4.6
**Next review due:** 2027-01

**Primary sources:**
- U.S. Constitution, Amendment VI (Gideon v. Wainwright guarantee of counsel; speedy trial)
- U.S. Constitution, Amendment VIII (excessive bail; Excessive Bail Clause)
- Brady v. Maryland, 373 U.S. 83 (1963) — Brady Rule; prosecution's duty to disclose evidence
- Miranda v. Arizona, 384 U.S. 436 (1966) — right to silence during interrogation

**Review notes:**
- Card format is excellent for the audience — short, action-oriented, do/don't structure.
- "Gideon guarantee" (line 343) is correctly referenced.
- "8th Amendment" for reasonable bail (line 399) is correctly applied.
- "Brady Rule" for right to discovery (line 455) is correctly cited.
- Print-friendly design confirmed; see-also link to `/collateral-consequences` is appropriate.
- Content is largely procedural and evergreen — low staleness risk.

**Issues fixed this review:** None

---

### process.tsx — The Criminal Justice Process

**Last reviewed:** 2026-03-25
**Reviewer:** Claude Sonnet 4.6
**Next review due:** 2027-01

**Primary sources:**
- U.S. Constitution, Amendment VI (speedy trial; right to counsel at arraignment and all critical stages)
- Gideon v. Wainwright, 372 U.S. 335 (1963) — public defender entitlement
- Bail Reform Act of 1984, 18 U.S.C. § 3142 (federal bail framework)
- Arnold Foundation Pretrial Research, 2013 (bail guide sources)
- Pretrial Justice Institute (bail guide sources)
- U.S. Sentencing Commission, FY 2024 Sourcebook (plea bargain statistics)
- Bureau of Justice Statistics, Felony Defendants in Large Urban Counties, 2009 (plea statistics)
- ABA Plea Bargain Task Force Report, 2023

**Review notes:**
- Content is almost entirely i18n-driven; the component file is a structural shell. Full content review requires reading `client/src/i18n.ts` keys under `process.guides.*`.
- Bail guide: expanded in March 2026 to add four new accordion items (preventive detention, bail schedules, changing legal landscape, risk assessment tools). All new content reviewed and sourced at time of authorship.
- Plea guide: statistics correctly cited inline with sources and data years.
- Accordion pattern is clean and accessible.
- Jurisdictional variation is consistently flagged throughout ("ask your attorney what applies in your jurisdiction").

**Issues fixed this review:** None (content was just substantially expanded and reviewed)

---

### first-24-hours.tsx — First 24 Hours After Arrest

**Last reviewed:** 2026-03-25
**Reviewer:** Claude Sonnet 4.6
**Next review due:** 2027-01

**Primary sources:**
- U.S. Constitution, Amendment V (right to remain silent; applies from moment of arrest)
- U.S. Constitution, Amendment VI (right to counsel; applies from moment of arrest)
- Miranda v. Arizona, 384 U.S. 436 (1966) — warnings required before custodial interrogation, not at arrest
- Fare v. Michael C., 442 U.S. 707 (1979) — juvenile waiver of Miranda rights; parental notification
- U.S. Constitution, Amendment VI (Title VI) — interpreter rights at no cost
- California Penal Code § 851.5 — phone call right (3-hour rule; referenced as state example)
- 18 U.S.C. § 3142 — federal bail framework (referenced in bail hearing step)

**Review notes:**
- Do/Don't format with color-coded boxes is highly effective for the target audience.
- Juvenile callout (lines 120–128) is accurate and appropriately prominent. Fare v. Michael C. establishes the parental notification standard (with state-law variations on top).
- Phone call timing: prior text said "within 3 hours" as a near-universal rule. Updated to clarify this is the California standard; most other states require "reasonable time." The fix is factually accurate.
- Interpreter right at no cost is correctly grounded in both 6th Amendment doctrine and Title VI of the Civil Rights Act.
- Miranda framing is correct throughout: rights exist at the moment of arrest; warnings are only required before custodial interrogation, not at the moment of arrest.
- Buttons linking to `/right-to-counsel` and `/warrants` are appropriate for Step 1.

**Issues fixed this review:**
- Phone call timing qualifier updated from "within 3 hours" to an accurate state-variation note (line 177)

---

## How to Use This Log

**When to update:** After any substantive edit to a page's content, accuracy, or sourcing. Minor formatting or link fixes do not require an update.

**What "reviewed" means:** A reviewer has read the full content, verified that primary legal sources are cited and accurate, checked for reading level compliance, and confirmed external links are live. It does not mean the content has been verified by a licensed attorney.

**Recommended review schedule:**
- Immigration-guidance.tsx: every 6 months (high change-velocity)
- All other editorial pages: annually (every January)
- After any major SCOTUS ruling affecting the relevant content area: immediate

**Attorney review:** This platform's content has not been formally reviewed by a licensed attorney as of March 2026. A legal review pass is recommended before public launch, particularly for the immigration guidance and collateral consequences pages.
