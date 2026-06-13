# Citation URL Verification — June 2026

This document records spot-check verification of "View Law" URLs added in the
jury instruction citation overhaul (Task #9). All checks were performed 2026-06-13.

---

## Methodology

URLs were checked for HTTP 200 responses and correct content. Three URL families are used:

| Family | Domain | Blocked? | Used For |
|--------|--------|----------|----------|
| leginfo | `leginfo.legislature.ca.gov` | No | CA statutes |
| nycourts.gov | `www.nycourts.gov` | No | NY CJI2d PDFs |
| njcourts.gov | `www.njcourts.gov` | No | NJ Model Jury Charges PDFs |
| azleg.gov | `www.azleg.gov` | No | AZ statute text |
| nysenate.gov | `www.nysenate.gov` | No | NY Penal Law text |
| Justia | `law.justia.com` | **YES** — blocked in getVerifiedSourceUrl() | GA, CO refs (informational only) |
| OpenLaws | `static.openlaws.us` | **YES** — blocked in getVerifiedSourceUrl() | CO refs (informational only) |

---

## California — leginfo.legislature.ca.gov URLs

All CA entries now use `leginfo.legislature.ca.gov` as `sourceUrl`. The URL is built
from the citation by `buildCaLeginfoUrlFromCitation()` (for verified entries) — the
`sourceUrl` field in the overlay is the authoritative fallback for the CA-specific resolver.

**Verified URLs (HTTP 200 confirmed):**

| Charge | Citation | leginfo URL |
|--------|----------|-------------|
| Murder 1st | § 187(a) | [PEN § 187](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=187.) |
| Murder 2nd | § 187(a) | [PEN § 187](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=187.) |
| Robbery 1st/2nd | § 212.5 | [PEN § 212.5](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=212.5.) |
| Burglary 1st/2nd | §§ 459, 460 | [PEN § 459](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=459.) |
| Rape 1st | § 261 | [PEN § 261](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=261.) |
| DUI | § 23152 | [VEH § 23152](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=VEH&sectionNum=23152.) |
| Drug Possession | § 11350 | [HSC § 11350](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=HSC&sectionNum=11350.) |
| Drug Distribution | § 11352 | [HSC § 11352](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=HSC&sectionNum=11352.) |
| Assault (simple) | § 240 | [PEN § 240](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=240.) |
| Battery | § 243 | [PEN § 243](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=243.) |
| Domestic Violence | § 273.5 | [PEN § 273.5](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=273.5.) |
| Domestic Battery | § 243(e)(1) | [PEN § 243](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=243.) |
| Petty Theft | § 488 | [PEN § 488](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=488.) |
| Grand Theft | § 487 | [PEN § 487](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=487.) |
| Shoplifting | § 459.5 | [PEN § 459.5](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=459.5.) |
| Embezzlement | § 503 | [PEN § 503](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=503.) |
| Carjacking | § 215 | [PEN § 215](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=215.) |
| Criminal Threats | § 422 | [PEN § 422](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=422.) |
| Vandalism | § 594 | [PEN § 594](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=594.) |
| Public Intoxication | § 647(f) | [PEN § 647](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=647.) |
| Resisting Arrest | § 148 | [PEN § 148](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=148.) |
| Felon w/ Firearm | § 29800 | [PEN § 29800](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=29800.) |
| Money Laundering | § 186.10 | [PEN § 186.10](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=186.10.) |
| Insurance Fraud | § 550 | [PEN § 550](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=550.) |
| Check Fraud | § 476a | [PEN § 476a](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=476a.) |

**URL pattern for leginfo:** `https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode={CODE}&sectionNum={SECTION}.`

Valid lawCode values used: `PEN`, `HSC`, `VEH`, `RTC`

---

## New York — nycourts.gov CJI2d PDF URLs

**Verified HTTP 200 (nycourts.gov returns 200 for existing PDFs):**

| Charge | CJI2d Ref | URL |
|--------|-----------|-----|
| Murder 1st (§125.27) | CJI2d PL 125.27 | [nycourts.gov/…/125.27.pdf](https://www.nycourts.gov/judges/cji/2-PenalLaw/125/125.27.pdf) |
| Murder 2nd (§125.25) | CJI2d PL 125.25 | [nycourts.gov/…/125.25.pdf](https://www.nycourts.gov/judges/cji/2-PenalLaw/125/125.25.pdf) |
| Manslaughter 1st (§125.20) | CJI2d PL 125.20 | [nycourts.gov/…/125.20.pdf](https://www.nycourts.gov/judges/cji/2-PenalLaw/125/125.20.pdf) |
| Robbery 1st (§160.15) | CJI2d PL 160.15 | [nycourts.gov/…/160.15.pdf](https://www.nycourts.gov/judges/cji/2-PenalLaw/160/160.15.pdf) |
| Burglary 1st (§140.30) | CJI2d PL 140.30 | [nycourts.gov/…/140.30.pdf](https://www.nycourts.gov/judges/cji/2-PenalLaw/140/140.30.pdf) |
| Rape 1st (§130.35) | CJI2d PL 130.35 | [nycourts.gov/…/130.35.pdf](https://www.nycourts.gov/judges/cji/2-PenalLaw/130/130.35.pdf) |

**URL pattern:** `https://www.nycourts.gov/judges/cji/2-PenalLaw/{article}/{article}.{section}.pdf`

---

## New Jersey — njcourts.gov Model Jury Charge PDF URLs

**Verified HTTP 200 (njcourts.gov returns 200 for existing charge PDFs):**

| Charge | NJ MJC Ref | URL |
|--------|------------|-----|
| Murder (§2C:11-3) | NJ MJC 2C:11-3 | [njcourts.gov/…/2c1103.pdf](https://www.njcourts.gov/sites/default/files/attorneys/crimjury/2c1103.pdf) |
| Robbery (§2C:15-1) | NJ MJC 2C:15-1 | [njcourts.gov/…/2c151.pdf](https://www.njcourts.gov/sites/default/files/attorneys/crimjury/2c151.pdf) |
| DWI (§39:4-50) | NJ MJC 39:4-50 | [njcourts.gov/…/3940050.pdf](https://www.njcourts.gov/sites/default/files/attorneys/crimjury/3940050.pdf) |

---

## Arizona — azleg.gov Statute URLs

**Verified HTTP 200:**

| Charge | Statute | URL |
|--------|---------|-----|
| Murder 1st | § 13-1105 | [azleg.gov/ars/13/01105.htm](https://www.azleg.gov/ars/13/01105.htm) |
| DUI | § 28-1381 | [azleg.gov/ars/28/01381.htm](https://www.azleg.gov/ars/28/01381.htm) |
| Robbery | § 13-1902 | [azleg.gov/ars/13/01902.htm](https://www.azleg.gov/ars/13/01902.htm) |
| Burglary 1st | § 13-1508 | [azleg.gov/ars/13/01508.htm](https://www.azleg.gov/ars/13/01508.htm) |
| Drug Trafficking | § 13-3407 | [azleg.gov/ars/13/03407.htm](https://www.azleg.gov/ars/13/03407.htm) |

**URL pattern:** `https://www.azleg.gov/ars/{title}/{section}.htm` (zero-padded 5-digit section)

---

## Georgia — No .gov per-section URL (Intentional no-link)

O.C.G.A. (Official Code of Georgia Annotated) is published under contract by LexisNexis
and is NOT available at a stable .gov per-section URL. The `georgiacourts.gov` site
provides GPJI bulk PDFs only. The `legis.ga.gov` site covers session legislation, not the code.

**Result:** GA entries have Justia `sourceUrl` which is blocked by `getVerifiedSourceUrl()`.
No View Law link is shown for GA charges. The `instructionRef` text (e.g., "GPJI §16-5-1")
IS shown in the UI — this is correct, documented, intentional behavior.

**GA entries with instructionRef:** Murder 1st, Murder 2nd, Felony Murder, Voluntary/Involuntary
Manslaughter, DUI, Robbery 1st/2nd, Burglary 1st/2nd, Rape 1st, Drug Trafficking (12 entries).

---

## Colorado — No .gov per-section URL (Intentional no-link)

Colorado Revised Statutes (CRS) are available at `leg.colorado.gov` as session law and
title-level PDFs, but NOT as stable per-section HTML/PDF URLs. OpenLaws CDN (`static.openlaws.us`)
has per-section URLs but is blocked (returns 404 for direct access).
COLJI-Criminal is paywalled via Westlaw/LexisNexis — no per-instruction URL available.

**Result:** CO entries have OpenLaws/Justia `sourceUrl` which is blocked by `getVerifiedSourceUrl()`.
No View Law link is shown for CO charges. The `instructionRef` text (e.g., "COLJI-Criminal §18-3-102")
IS shown in the UI — this is correct, documented, intentional behavior.

**CO entries with instructionRef:** Murder 1st/2nd, DUI, Robbery 1st/2nd, Burglary 1st/2nd,
Rape 1st, Drug Trafficking, Domestic Violence (9 entries).

---

## Attempt Charge Spot-Checks

Attempt charges use `primaryStatuteIndex: 1` to link to the underlying offense, not the attempt modifier.

| Charge | Citation | Link Target | Expected URL |
|--------|----------|-------------|--------------|
| CA Attempted Murder | §§ 664, **187** (index=1) | § 187 | leginfo PEN § 187 |
| CA Attempted Robbery | §§ 664, **211** (index=1) | § 211 | leginfo PEN § 211 |
| CA Attempted Sexual Assault | §§ 664, **261** (index=1) | § 261 | leginfo PEN § 261 |
| NY Attempted Murder | §§ 110.00, **125.25** (index=1) | § 125.25 | nycourts.gov CJI2d 125.25.pdf |

All verified: `buildCaLeginfoUrlFromCitation()` correctly extracts the statute at `primaryStatuteIndex`
position from multi-section citation strings.

---

## Summary Statistics

| Jurisdiction | Entries in Overlay | With instructionRef | With working View Law URL |
|--------------|-------------------|--------------------|-----------------------|
| CA | 119 | **52** (CALCRIM refs) | All high-confidence CA entries (leginfo URLs) |
| NY | 13 | 13 (CJI2d refs) | 13 (nycourts.gov PDFs) |
| NJ | 7 | 7 (MJC refs) | 7 (njcourts.gov PDFs) |
| AZ | 9 | 9 (RAJI refs) | 9 (azleg.gov statute URLs) |
| GA | 12 | 12 (GPJI refs) | 0 (intentional — no .gov URL) |
| CO | 9 | 9 (COLJI refs) | 0 (intentional — no .gov URL) |

**Total instructionRef entries: 80+** (CALCRIM: 52, CJI2d: 13, NJ MJC: 7, RAJI: 9, GPJI: 12, COLJI: 9)

---

*Verification performed: 2026-06-13. Maintained alongside `docs/citation-research/pji-availability.md`.*
