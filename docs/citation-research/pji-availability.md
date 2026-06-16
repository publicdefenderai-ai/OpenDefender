# Pattern Jury Instruction (PJI) Availability by State

Pattern Jury Instructions (PJIs) are model jury instructions published by state courts or bar associations.
They are maintained by judicial councils and updated annually, making them the **gold standard** for citation
accuracy — each instruction explicitly lists every statute element the jury must find, including all
multi-section charges that generic legal databases often miss.

## How PJIs Are Used in OpenDefender

1. **Citation authority**: When a PJI instruction exists for a charge, it overrides other sources for
   the correct statute citation (especially for multi-section charges like `§§ 664, 211`).
2. **Primary statute index**: Attempt charges always list the attempt modifier first (e.g., § 664 in CA,
   § 5.01 in federal) and the underlying offense second. `getPrimaryStatuteIndex()` auto-detects this
   pattern — charges whose name starts with "Attempted" get `primaryStatuteIndex: 1`.
3. **UI display**: The `instructionRef` field (e.g., `"CALCRIM 1600"`) is shown in the charge card so
   users can look up the full instruction in official court publications.
4. **View Law URL**: When `instructionUrl` is set in the overlay, it is preferred over `sourceUrl` for
   the "View Law" link — instruction pages are always on .gov domains and cite every statutory element.

---

## All-Jurisdiction PJI Availability Matrix

| State/Terr. | PJI Name | Publisher | Free HTML | Free PDF | Paywalled | Per-URL | Status |
|-------------|----------|-----------|-----------|----------|-----------|---------|--------|
| CA | CALCRIM | Judicial Council of CA | No | Yes (bulk) | No | No | **IMPL** — leginfo URLs via citation |
| NY | CJI2d | NY OCA | No | Yes (per-instruction) | No | Yes | **IMPL** — nycourts.gov PDFs |
| FL | Fla. Std. Jury Instr. (Crim.) | FL Supreme Court | Yes | Yes | No | Yes | **IMPL** — FSJI refs (7.x homicide, 8.4 assault, 11.1 sex battery, 13.1 burglary, 15.1 robbery, 25.x drugs, 28.1 DUI); base instructionUrl |
| NJ | Model Jury Charges (Crim.) | NJ Courts | No | Yes (per-charge) | No | Yes | **IMPL** — njcourts.gov PDFs |
| TX | Texas Criminal Pattern Jury Charges | State Bar of TX | No | No | Yes (Westlaw) | No | NO URL — ref text only |
| PA | Pa. SSJI (Criminal) | PA Bar | No | No | Yes (LexisNexis) | No | NO URL — ref text only |
| OH | Ohio Jury Instructions | Ohio Judicial College | Yes (HTML) | Yes | No | Yes | **IMPL** — OJI refs only (not publicly accessible via supremecourt.ohio.gov — all paths return 404; may require Ohio Judicial College purchase; no instructionUrl); murder, manslaughter, robbery, burglary, rape, assault, DUI, drugs |
| GA | Suggested Pattern Jury Instr. | Council of Superior Court Judges | No | Yes (bulk PDF) | No | No | **IMPL** — ref text only (no per-URL) |
| IL | Illinois Pattern Jury Instructions (Crim.) | IL Sup. Ct. | Yes (HTML) | Yes | No | Yes | **IMPL** — IPI-CR refs + illinoiscourts.gov chapter PDF URLs; murder, manslaughter, robbery, burglary, rape, assault, DUI, drugs, attempt |
| NC | North Carolina Pattern Jury Instructions | NC Judicial College | No | No | Yes (LexisNexis) | No | **IMPL** — NC PJI refs only (paywalled; no instructionUrl); murder, manslaughter, assault, DV, robbery, burglary, rape, DUI, drugs |
| MI | Michigan Criminal Jury Instructions | MI Judicial Institute | Yes (HTML) | Yes | No | Yes | **IMPL** — CJI2d refs + courts.michigan.gov base URL; murder, manslaughter, robbery, burglary, rape, assault, DUI, drugs |
| WA | Washington Pattern Jury Instructions (Crim.) | WA Sup. Ct. | Yes (HTML) | Yes | No | Yes | **IMPL** — WPIC per-instruction URLs; 26.x homicide, 35.x assault (incl. DV), 36.53.01 vehicular, 37.x robbery, 38.x burglary, 45.x rape/sexual assault, 50.x drugs, 92.06 DUI (all 3 offenses) |
| AZ | RAJI Criminal | State Bar of AZ | No | Yes (bulk) | No | No | **IMPL** — azleg.gov statute URLs; ref text |
| MA | Instruction 9.00 series | MA Sup. Jud. Ct. | Yes (HTML) | Yes | No | Yes | PLANNED |
| TN | TPI-Criminal | TN Judicial Conference | No | No | Yes (LexisNexis) | No | **IMPL** — TPI-Crim. refs only (paywalled; no instructionUrl); murder, manslaughter, assault, DV, robbery, burglary, rape, DUI, drugs |
| IN | Indiana Model Criminal Jury Instructions | IN Judicial Ctr. | Yes (HTML) | Yes | No | Yes | **IMPL** — Ind. Model Crim. Jury Instr. base URL; murder, manslaughter, assault, DV assault, robbery, burglary, sexual assault, rape, DUI, drugs covered |
| MO | Missouri Approved Instructions (Criminal) | MO Sup. Ct. | Yes (HTML) | Yes | No | Yes | **IMPL** — MAI-CR base URL; murder, manslaughter, assault, DV assault, robbery, burglary, sexual assault, rape, DUI, drugs covered |
| MD | Maryland Criminal Jury Instructions (MCJI) | MD Judicial Coll. | No | No | Yes (LexisNexis) | No | **IMPL** — MCJI refs only (paywalled; no instructionUrl); murder, manslaughter, assault, DV, robbery, burglary, rape, sexual assault, grand theft, DUI, drugs |
| WI | Wisconsin Jury Instructions — Criminal | WI Judicial Coll. | Yes (HTML) | Yes | No | Yes | **IMPL** — Wis JI-Criminal base URL; murder, manslaughter, assault, DV assault, robbery, burglary, sexual assault, rape, DUI, drugs covered |
| MN | Minnesota Jury Instruction Guides (Crim.) (CRIMJIG) | MN Dist. Judges Assoc. | No | No | Yes (Westlaw) | No | **IMPL** — CRIMJIG refs only (paywalled; no instructionUrl); murder, manslaughter, assault, DV, robbery, burglary, rape, sexual assault, grand theft, DUI, drugs |
| CO | COLJI-Criminal | CO Sup. Ct. Comm. | No | No | Yes (Westlaw) | No | **IMPL** — ref text only (paywalled) |
| AL | Alabama Pattern Jury Instructions — Crim. | AL Bar / Circuit Judges | No | No | Yes (ALBarStar) | No | NO URL — ref text only |
| SC | South Carolina Requests to Charge | SC Bar | No | No | Yes (LexisNexis) | No | NO URL — ref text only |
| KY | Kentucky Instructions to Juries (Crim.) | KY Bar | No | No | Yes (LexisNexis) | No | NO URL — ref text only |
| OR | Oregon Uniform Criminal Jury Instructions | OR Crim. Law Sect. | No | No | Yes (LexisNexis) | No | NO URL — ref text only |
| OK | Oklahoma Uniform Jury Instructions — Crim. | OK OUJI-CR | Yes (HTML) | Yes | No | Yes | **IMPL** — OUJI-CR refs + oscn.net per-instruction URLs; 4-72/83 murder, 4-89/97 manslaughter, 4-15a DV assault, 4-18 aggravated assault, 4-120 rape/sexual assault, 4-133/141 robbery, 5-8/17 burglary, 6-11 DUI, 6-39/44/46 drugs |
| CT | Connecticut Jury Instructions (Crim.) | CT Jud. Branch | Yes (HTML) | Yes | No | Yes | **IMPL** — CT JI refs + jud.ct.gov per-instruction URLs; 2.x homicide, 3.1 sexual assault, 5.x robbery, 6.x assault, 7.x burglary, 11.1 DUI, 12.x drugs |
| IA | Iowa Criminal Jury Instructions | Iowa State Bar | No | No | Yes (Westlaw) | No | NO URL — ref text only |
| MS | Mississippi Model Jury Instructions | MS Bar | No | No | Yes | No | NO URL — ref text only |
| AR | Arkansas Model Jury Instructions (Crim.) | AR Judicial Council | No | No | Yes | No | NO URL — ref text only |
| KS | Kansas Pattern Instructions — Crim. | KS Judicial Council | Yes (HTML) | Yes | No | Yes | **IMPL** — PIK Crim. 4th base URL; murder, manslaughter, assault, DV assault, robbery, burglary, sexual assault, rape, DUI, drugs covered |
| UT | Utah Model Jury Instructions | UT Cts. | Yes (HTML) | Yes | No | Yes | **IMPL** — UMJI-CR base URL; murder, manslaughter, assault, DV assault, robbery, burglary, sexual assault, rape, DUI, drugs covered |
| NV | Nevada Jury Instructions | NV Cts. / State Bar | No | No | Yes | No | NO URL — ref text only |
| NM | Uniform Jury Instructions — Crim. (NMRA 14) | NM Sup. Ct. | Yes (HTML) | Yes | No | Yes | **IMPL** — UJI 14-series base URL; murder, manslaughter, assault, DV assault, robbery, burglary, sexual assault, rape, DUI, drugs covered |
| WV | West Virginia Criminal Jury Instructions | WV Bar | No | No | Yes | No | NO URL — ref text only |
| NE | Nebraska Jury Instructions (Crim.) | NE Jud. Council | No | Yes (bulk) | No | No | NO URL — bulk only |
| ID | Idaho Criminal Jury Instructions | ID Cts. | No | Yes (bulk) | No | No | NO URL — bulk only |
| HI | Hawaii Criminal Jury Instructions | HI Cts. | No | Yes (bulk) | No | No | NO URL — bulk only |
| ME | Maine Jury Instruction Manual | ME Jud. Branch | No | No | Yes | No | NO URL — ref text only |
| NH | NH Superior Court Criminal Jury Instructions | NH Cts. | No | No | Yes | No | NO URL — ref text only |
| RI | Rhode Island Model Jury Instructions | RI Bar | No | No | Yes | No | NO URL — ref text only |
| MT | Montana Criminal Jury Instructions | MT Cts. | No | Yes (bulk) | No | No | NO URL — bulk only |
| ND | North Dakota Criminal Jury Instructions | ND Cts. | No | No | Yes | No | NO URL — ref text only |
| SD | South Dakota Pattern Jury Instructions | SD UJS | No | No | Yes | No | NO URL — ref text only |
| VT | Vermont Jury Instructions | VT Cts. | No | No | Yes | No | NO URL — ref text only |
| AK | Alaska Pattern Jury Instructions | AK Cts. | No | Yes (bulk) | No | No | NO URL — bulk only |
| DE | Delaware Criminal Jury Instructions | DE Cts. | No | No | Yes | No | NO URL — ref text only |
| WY | Wyoming Criminal Pattern Jury Instructions | WY Bar | No | No | Yes | No | NO URL — ref text only |
| LA | Louisiana Criminal Jury Instructions | LA Jud. College | No | No | Yes | No | NO URL — ref text only |
| VA | Virginia Model Jury Instructions (Crim.) (VMJI) | VA CLE | No | No | Yes (LexisNexis) | No | **IMPL** — VMJI refs only (paywalled; no instructionUrl); murder, manslaughter, assault, DV, robbery, burglary, rape, sexual assault, grand theft, DUI, drugs |
| DC | DC Criminal Jury Instructions (Redbook) | DC Courts | Yes (HTML) | Yes | No | Yes | PLANNED |
| PR | Puerto Rico (Spanish) Jury Instructions | PR Sup. Ct. | No | Yes (bulk) | No | No | NO URL — territory |
| AS/GU/MP/VI | Territory jury instructions | Various | No | No | No | No | NO URL — territory |
| Federal | Federal Criminal Jury Instructions | Various circuits | Varies | Varies | Varies | Varies | See federal note |

**Per-URL**: Whether individual instructions have stable, linkable per-instruction URLs (not bulk PDF only).

---

## Jurisdictions with Linkable Per-Instruction URLs (priority targets)

These states publish free, per-instruction URLs suitable for direct `instructionUrl` links:

| State | URL Pattern | Example |
|-------|-------------|---------|
| **NY** | `https://www.nycourts.gov/judges/cji/2-PenalLaw/{art}/{art}.{sec}.pdf` | [Murder 2nd §125.25](https://www.nycourts.gov/judges/cji/2-PenalLaw/125/125.25.pdf) |
| **NJ** | `https://www.njcourts.gov/sites/default/files/attorneys/crimjury/{2c}{sec}.pdf` | [Murder 2C:11-3](https://www.njcourts.gov/sites/default/files/attorneys/crimjury/2c1103.pdf) |
| **FL** | `https://www.floridasupremecourt.org/jury-instructions/criminal-standard-jury-instructions/{instr}.pdf` | Research needed for exact pattern |
| **IL** | `https://www.illinoiscourts.gov/resources/{guid}/file` | [Chapter 7 (Homicide)](https://www.illinoiscourts.gov/resources/4ca60c86-cef3-465a-83ae-9cc61d159640/file) — per-chapter PDFs; each GUID is unique per chapter (verified 200 on 6 chapters 2026-06) |
| **OH** | N/A — OJI not publicly accessible as per-instruction URLs | All tested supremecourt.ohio.gov/JCS/crimJustice/OJI/ paths return 404 (index, PDFs, and .htm instruction paths verified 2026-06); OJI may require Ohio Judicial College purchase; `instructionRef` label only (no `instructionUrl`) |
| **MI** | `https://www.courts.michigan.gov/rules-administrative-orders-and-jury-instructions/current-rules-and-jury-instructions/model-criminal-jury-instructions2/` | One HTML document with all CJI2d instructions (mjieducation.mi.gov redirects here); verified 200 (2026-06) |
| **WA** | `https://www.courts.wa.gov/superiorct/jury_instructions/?fa=jury_instructions.displaySection&category=criminal&section=WPIC+{N}.{NN}` | per-instruction query param URL |
| **OK** | `https://www.oscn.net/applications/ouji-cr/{chapter}-{number}.htm` | per-instruction HTM URL |
| **CT** | `https://www.jud.ct.gov/ji/Criminal/{chapter}/{instruction}.htm` | per-instruction HTM URL |
| **DC** | `https://www.dccourts.gov/` | HTML; per-instruction TBD |
| **NM** | `https://nmonesource.com/nmos/nmra/en/item/4248/` | NMRA 14-series HTML |

---

## California — CALCRIM (California Criminal Jury Instructions)

**Publisher**: Judicial Council of California  
**Format**: Annual bulk PDF (not individual HTML pages per instruction)  
**Official URL**: https://www.courts.ca.gov/partners/documents/calcrim-juryinstructions.pdf  
**Coverage**: All 58 counties; updated annually (latest: 2024 edition)  
**Status**: **IMPLEMENTED** — leginfo.legislature.ca.gov URLs built from citation text

### Key CALCRIM Mappings (implemented in overlay)

| Charge | CALCRIM # | Primary Statute |
|--------|-----------|-----------------|
| Murder 1st Degree | 521 | § 187(a) |
| Murder 2nd Degree | 520 | § 187(a) |
| Felony Murder | 540A | § 189 |
| Voluntary Manslaughter | 570 | § 192(a) |
| Involuntary Manslaughter | 580 | § 192(b) |
| Vehicular Manslaughter | 590 | § 191.5 |
| Attempted Murder | 600 | §§ 664, **187** (index=1) |
| Assault (simple) | 915 | § 240 |
| Assault with Deadly Weapon | 875 | § 245(a)(1) |
| Battery | 960 | § 242 |
| Domestic Violence | 840 | § 273.5 |
| Robbery (1st & 2nd) | 1600 | § 212.5 |
| Attempted Robbery | 1600 | §§ 664, **211** (index=1) |
| Carjacking | 1650 | § 215 |
| Burglary (1st & 2nd) | 1700 | §§ 459, 460(a)/(b) |
| Petty Theft | 1800 | § 488 |
| Grand Theft | 1801 | § 487 |
| Embezzlement | 1806 | § 503 |
| Criminal Threats (Menacing) | 1300 | § 422 |
| Rape (1st & 2nd) | 1000 | § 261 |
| Attempted Sexual Assault | 1000 | §§ 664, **261** (index=1) |
| Child Sexual Abuse | 1110 | § 288 |
| Drug Possession/Transportation | 2300/2302 | § 11350 / § 11351 / § 11352 |
| DUI | 2110 | § 23152 VEH |
| Vandalism | 2900 | § 594 |
| Trespassing | 2931 | § 602 |
| Disorderly Conduct | 2688 | § 647 |
| Resisting Arrest | 2656 | § 148 |
| Conspiracy | 415 | § 182 |
| Identity Theft | 2040 | § 530.5 |

### CA Charges — Additional Entries Added (2026-06)

The following entries were added with `confidence: "high"`, leginfo sourceUrls, and instructionRef values:

| Charge | CALCRIM | Statute |
|--------|---------|---------|
| Stalking | 1301 | § 646.9 |
| Kidnapping | 1215 | § 207 |
| Arson | 1515 | § 451 |
| Welfare Fraud | 1804 (Theft by False Pretense — obtaining benefits by misrepresentation) | WIC § 10980 |

All leginfo URLs verified live (HTTP 200) as of 2026-06.

---

## New York — CJI2d (Criminal Jury Instructions, 2nd Ed.)

**Publisher**: New York State Unified Court System, Office of Court Administration  
**Format**: Per-instruction PDF pages (freely accessible)  
**Official URL**: https://www.nycourts.gov/judges/cji/  
**Coverage**: All NY courts; updated as needed  
**Status**: **IMPLEMENTED** — `instructionRef` + `instructionUrl` (nycourts.gov PDFs) added

### NY CJI2d URL Pattern

```
https://www.nycourts.gov/judges/cji/2-PenalLaw/{article}/{article}.{section}.pdf
```

Example (Murder 2nd, Penal Law § 125.25):
`https://www.nycourts.gov/judges/cji/2-PenalLaw/125/125.25.pdf`

### Key NY CJI2d Mappings (implemented)

| Charge | CJI2d Ref | Penal Law § | instructionUrl |
|--------|-----------|-------------|----------------|
| Murder 1st | CJI2d PL 125.27 | 125.27 | nycourts.gov/…/125.27.pdf |
| Murder 2nd | CJI2d PL 125.25 | 125.25 | nycourts.gov/…/125.25.pdf |
| Felony Murder | CJI2d PL 125.25 | 125.25(3) | nycourts.gov/…/125.25.pdf |
| Manslaughter 1st | CJI2d PL 125.20 | 125.20 | nycourts.gov/…/125.20.pdf |
| Manslaughter 2nd | CJI2d PL 125.15 | 125.15 | nycourts.gov/…/125.15.pdf |
| Criminally Neg. Homicide | CJI2d PL 125.10 | 125.10 | nycourts.gov/…/125.10.pdf |
| Vehicular Homicide | CJI2d PL 125.12 | 125.12 | nycourts.gov/…/125.12.pdf |
| Attempted Murder | CJI2d PL 125.25 | §§ 110.00+125.25 (index=1) | nycourts.gov/…/125.25.pdf |
| Assault 1st (agg.) | CJI2d PL 120.10 | 120.10 | nycourts.gov/…/120.10.pdf |
| Assault 2nd | CJI2d PL 120.05 | 120.05 | nycourts.gov/…/120.05.pdf |
| Robbery 1st | CJI2d PL 160.15 | 160.15 | nycourts.gov/…/160.15.pdf |
| Robbery 2nd | CJI2d PL 160.10 | 160.10 | nycourts.gov/…/160.10.pdf |
| Burglary 1st | CJI2d PL 140.30 | 140.30 | nycourts.gov/…/140.30.pdf |
| Burglary 2nd | CJI2d PL 140.25 | 140.25 | nycourts.gov/…/140.25.pdf |
| Burglary 3rd | CJI2d PL 140.20 | 140.20 | nycourts.gov/…/140.20.pdf |
| Rape 1st | CJI2d PL 130.35 | 130.35 | nycourts.gov/…/130.35.pdf |
| Drug Trafficking | CJI2d PL 220.43 | 220.43 | nycourts.gov/…/220.43.pdf |
| Possession w/ Intent | CJI2d PL 220.16 | 220.16 | nycourts.gov/…/220.16.pdf |
| DUI | CJI2d VTL 1192 | VAT/1192 | nycourts.gov/…/1192.pdf |

---

## New Jersey — Model Jury Charges (Criminal)

**Publisher**: New Jersey Courts (njcourts.gov)  
**Format**: Per-charge PDF pages (freely accessible on njcourts.gov)  
**Official URL**: https://www.njcourts.gov/attorneys/criminal-model-jury-charges  
**Status**: **IMPLEMENTED** — `instructionRef` + `instructionUrl` (njcourts.gov PDFs) added

### NJ URL Pattern

```
https://www.njcourts.gov/sites/default/files/attorneys/crimjury/{statute-normalized}.pdf
```

Examples:
- Murder 2C:11-3 → `2c1103.pdf`
- DWI 39:4-50 → `3940050.pdf`
- Robbery 2C:15-1 → `2c151.pdf`

### Key NJ MJC Mappings (implemented)

| Charge | NJ MJC Ref | Statute |
|--------|------------|---------|
| Murder 1st / 2nd | NJ MJC 2C:11-3 | § 2C:11-3(a)/(b) |
| Felony Murder | NJ MJC 2C:11-3 | § 2C:11-3(a)(3) |
| Manslaughter (vol/invol) | NJ MJC 2C:11-4 | § 2C:11-4(a)/(b) |
| Criminally Neg. Homicide | NJ MJC 2C:11-5 | § 2C:11-5 |
| Vehicular Homicide | NJ MJC 2C:11-5 | § 2C:11-5 |
| Assault (aggravated) | NJ MJC 2C:12-1 | § 2C:12-1(b) |
| Assault (simple) | NJ MJC 2C:12-1 | § 2C:12-1(a) |
| Robbery 1st / 2nd | NJ MJC 2C:15-1 | § 2C:15-1(a)(2)/(1) |
| Burglary 1st / 2nd / 3rd | NJ MJC 2C:18-2 | § 2C:18-2(b)(1)/(a) |
| Sexual Assault / Rape 1st | NJ MJC 2C:14-2 | § 2C:14-2(a) |
| Drug Trafficking | NJ MJC 2C:35-5 | § 2C:35-5 |
| Possession w/ Intent | NJ MJC 2C:35-5 | § 2C:35-5(a)(1) |
| DWI | NJ MJC 39:4-50 | § 39:4-50 |

---

## Arizona — RAJI (Revised Arizona Jury Instructions)

**Publisher**: State Bar of Arizona, Criminal Law Section  
**Format**: Bulk PDF volumes (not per-instruction URLs)  
**Official URL**: https://www.azcourts.gov/AZCourts/media/AZCourtMedia/PDFs/committees/RAJI/  
**Status**: **IMPLEMENTED** — `instructionRef` text + `sourceUrl` updated to azleg.gov (no per-instruction URL)

Individual RAJI instruction pages are not publicly available as stable per-URL links. The `instructionRef`
label (e.g., "RAJI Criminal §13-1105") is shown in the UI; "View Law" links use the azleg.gov statute URL directly.

---

## Georgia — Suggested Pattern Jury Instructions (Criminal)

**Publisher**: Council of Superior Court Judges of Georgia  
**Format**: Bulk PDF (volume-based, not per-instruction URLs)  
**Official URL**: https://georgiacourts.gov/councils/superior-court-judges-council/  
**Status**: **IMPLEMENTED** — `instructionRef` text only (no `instructionUrl`); "View Law" uses Justia (blocked) — no URL shown

---

## Colorado — COLJI-Criminal (Colorado Criminal Jury Instructions)

**Publisher**: Colorado Supreme Court Committee on Criminal Jury Instructions  
**Format**: Westlaw/LexisNexis (paywalled); no free individual HTML pages  
**Status**: **IMPLEMENTED** — `instructionRef` text only (no `instructionUrl`); "View Law" uses Justia (blocked) — no URL shown

---

## Federal Circuits

| Circuit | PJI Name | Free URL |
|---------|----------|----------|
| 1st Cir. | Pattern Criminal Jury Instructions for the District Courts | No |
| 2nd Cir. | Sand, Modern Federal Jury Instructions | No (Lexis) |
| 3rd Cir. | Model Criminal Jury Instructions | Yes — [ca3.uscourts.gov](https://www.ca3.uscourts.gov/model-criminal-jury-instructions-0) |
| 4th Cir. | Pattern Jury Instructions (Crim.) | Yes — [ca4.uscourts.gov](https://www.ca4.uscourts.gov/judges-and-judgeships/court-records/pattern-jury-instructions) |
| 5th Cir. | Pattern Jury Instructions (Crim.) | Yes — [ca5.uscourts.gov](https://www.ca5.uscourts.gov/docs/default-source/forms-and-procedures---clerks-office/criminal-pattern-jury-instructions.pdf) |
| 7th Cir. | Pattern Criminal Federal Jury Instructions | Yes — [ca7.uscourts.gov](https://www.ca7.uscourts.gov/pattern-jury-instructions/pattern-jury.htm) |
| 9th Cir. | Manual of Model Criminal Jury Instructions | Yes — [www.ce9.uscourts.gov](https://www.ce9.uscourts.gov/jury-instructions/criminal) |
| 11th Cir. | Pattern Jury Instructions (Crim.) | Yes — [ca11.uscourts.gov](https://www.ca11.uscourts.gov/pattern-jury-instructions) |

---

## Implementation Priority

1. **CA** — CALCRIM **IMPLEMENTED** (leginfo statute URLs; ref text for instruction number)
2. **NY** — CJI2d **IMPLEMENTED** (nycourts.gov per-instruction PDF URLs)
3. **NJ** — Model Jury Charges **IMPLEMENTED** (njcourts.gov per-instruction PDF URLs)
4. **AZ** — RAJI **IMPLEMENTED** (azleg.gov statute URLs; ref text only for instruction)
5. **GA** — GPJI **IMPLEMENTED** (ref text only — bulk PDF, no per-URL)
6. **CO** — COLJI **IMPLEMENTED** (ref text only — paywalled)
7. **FL** — FSJI **IMPL** (base instructionUrl; murder, manslaughter, assault, robbery, burglary, sex battery, drugs, DUI covered)
8. **OK** — OUJI-CR **IMPL** (oscn.net per-instruction URLs; murder, manslaughter, assault, rape, robbery, burglary, DUI, drugs covered 2026-06)
9. **CT** — CT JI **IMPL** (jud.ct.gov per-instruction URLs; homicide, sexual assault, robbery, burglary, assault, DUI, drugs covered 2026-06)
10. **OH** — OJI **IMPL** (instructionRef only — no public per-instruction URLs; all supremecourt.ohio.gov/JCS/crimJustice/OJI/ paths return 404 (index, PDFs, .htm per-instruction paths all verified 2026-06); OJI appears to require Ohio Judicial College purchase; murder, manslaughter, robbery, burglary, rape, assault, DUI, drugs, simple assault, assault with deadly weapon covered; no instructionUrl added)
11. **IL** — IPI-CR **IMPL** (illinoiscourts.gov chapter PDF URLs via GUID pattern; all target categories covered including assault; HTTP spot-check 2026-06: all 6 chapter URLs confirmed 200)
12. **MI** — CJI2d **IMPL** (courts.michigan.gov full-HTML-set page; all target categories covered including assault and sexual assault; mjieducation.mi.gov redirects to courts.michigan.gov; HTTP spot-check 2026-06: base URL confirmed 200)
13. **WA** — WPIC **IMPL** (per-instruction query-param URLs; murder, manslaughter, vehicular, assault incl. DV, robbery, burglary, rape/sexual assault, drugs, DUI all 3 offenses covered 2026-06)
14. **NM** — UJI 14 **IMPLEMENTED** (nmsupremecourt.nmcourts.gov base URL; murder, manslaughter, assault, DV, robbery, burglary, sexual assault, rape, DUI, drugs)
15. **IN** — Ind. Model Crim. Jury Instr. **IMPLEMENTED** (in.gov/courts base URL; murder, manslaughter, assault, DV, robbery, burglary, sexual assault, rape, DUI, drugs)
16. **MO** — MAI-CR **IMPLEMENTED** (courts.mo.gov base URL; murder, manslaughter, assault, DV, robbery, burglary, sexual assault, rape, DUI, drugs)
17. **WI** — Wis JI-Criminal **IMPLEMENTED** (wicourts.gov base URL; murder, manslaughter, assault, DV, robbery, burglary, sexual assault, rape, DUI, drugs)
18. **UT** — UMJI-CR **IMPLEMENTED** (utcourts.gov base URL; murder, manslaughter, assault, DV, robbery, burglary, sexual assault, rape, DUI, drugs)
19. **KS** — PIK Crim. 4th **IMPLEMENTED** (kscourts.org base URL; murder, manslaughter, assault, DV, robbery, burglary, sexual assault, rape, DUI, drugs)
20. **MD** — MCJI **IMPLEMENTED** (ref text only — paywalled LexisNexis; murder, manslaughter, assault, DV, robbery, burglary, rape, sexual assault, grand theft, DUI, drugs all 3 offenses)
21. **MN** — CRIMJIG **IMPLEMENTED** (ref text only — paywalled Westlaw; murder incl. 3rd degree, manslaughter, assault, DV, robbery, burglary incl. 3rd degree, rape, sexual assault, grand theft, DUI all 3 offenses, drugs)
22. **VA** — VMJI **IMPLEMENTED** (ref text only — paywalled LexisNexis; murder, manslaughter, assault, DV, robbery, burglary, rape, sexual assault, grand theft, DUI all 3 offenses, drugs)

---

*Last updated: 2026-06-16 (NM, IN, MO, WI, UT, KS promoted to IMPL; NC and TN added; MD, MN, VA added; OH URL verification updated: supremecourt.ohio.gov OJI paths confirmed 404 — no instructionUrl added)*  
*Maintained by the citation research team. See `shared/criminal-charge-citations.ts` for implemented data.*
