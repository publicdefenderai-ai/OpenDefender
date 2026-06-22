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
| FL | Fla. Std. Jury Instr. (Crim.) | FL Supreme Court | Yes | Yes | No | Yes | **IMPL** — FSJI refs + per-instruction docx/rtf URLs; 7.x homicide, 8.4 assault, 8.6 stalking/harassment (2024/03), 11.1 sex battery, 13.1 burglary, 13.5 trespass (2023/07), 14.3 retail theft/shoplifting (2022/08 rtf), 15.1 robbery, 17.2 criminal mischief/vandalism (2022/08 rtf), 25.x drugs, 28.1 DUI, 29.3 loitering (2022/08 rtf); URL pattern: https://www-media.floridabar.org/uploads/{year}/{month}/{instr}.{docx\|rtf} |
| NJ | Model Jury Charges (Crim.) | NJ Courts | No | Yes (per-charge) | No | Yes | **IMPL** — njcourts.gov PDFs |
| TX | Texas Criminal Pattern Jury Charges (TPJC) | State Bar of TX | No | No | Yes (Westlaw) | No | **IMPL** — TPJC refs only (paywalled; no instructionUrl); murder, manslaughter, assault, DV, robbery, burglary, rape/sexual assault, DUI all 3 offenses, drugs, disorderly conduct (42.01), criminal trespass (30.05), public intoxication (49.02), petty theft/theft (31.03), resisting arrest (38.03), bail jumping/failure to appear (38.10), unlawful carrying weapon (TPJC 46.02), felon-in-possession (TPJC 46.04); tx-driving-while-suspended (Transp. Code § 521.457) omitted — Transportation Code not covered by TPJC |
| PA | Pa. SSJI (Criminal) | PA Bar | No | No | Yes (LexisNexis) | No | **IMPL** — Pa. SSJI refs only (paywalled LexisNexis; no instructionUrl); murder (1st/2nd/3rd/felony), manslaughter, attempted murder, assault, DV, robbery, burglary, rape (1st/2nd), sexual assault (2nd/3rd), DUI all 3 offenses, drugs; 15.3503 criminal trespass |
| OH | Ohio Jury Instructions | Ohio Judicial College | Yes (HTML) | Yes | No | Yes | **IMPL** — OJI refs only (not publicly accessible via supremecourt.ohio.gov — all paths return 404; may require Ohio Judicial College purchase; no instructionUrl); murder, manslaughter, robbery, bank robbery, residential/commercial/auto burglary, rape (2nd/3rd degree), assault (simple/deadly weapon/peace officer), domestic violence, child sexual abuse, OVI/DUI, drugs (possession/marijuana/paraphernalia/maintaining premises); 509.05 vandalism, 511.21 criminal trespass, 513.02 theft/shoplifting, 517.11 disorderly conduct/loitering, 517.21 telecommunications harassment |
| GA | Suggested Pattern Jury Instr. | Council of Superior Court Judges | No | Yes (bulk PDF) | No | No | **IMPL** — ref text only (no per-URL) |
| IL | Illinois Pattern Jury Instructions (Crim.) | IL Sup. Ct. | Yes (HTML) | Yes | No | Yes | **IMPL** — IPI-CR refs + illinoiscourts.gov chapter PDF URLs; murder, manslaughter, robbery, burglary, rape, assault, DUI, drugs, attempt; **16.01 criminal damage/vandalism** (Ch. 16 GUID 50f36433, verified 2026-06); **Ch. 16 criminal trespass to real property** (§ 21-3, same GUID, exact sub-instruction unverified); harassment ref 11.47 REMOVED (11.47 = Hate Crime § 12-7.1, not harassment § 26.5-2); loitering ref 22.01 REMOVED (Ch. 22 = Interference with Judicial Functions, not § 26-1 disorderly conduct/loitering) |
| NC | North Carolina Pattern Jury Instructions | NC Judicial College | No | No | Yes (LexisNexis) | No | **IMPL** — NC PJI refs only (paywalled; no instructionUrl); murder, manslaughter, assault, DV, robbery, burglary, rape, DUI, drugs |
| MI | Michigan Criminal Jury Instructions | MI Judicial Institute | Yes (HTML) | Yes | No | Yes | **IMPL** — CJI2d refs + courts.michigan.gov base URL; murder, manslaughter, robbery, bank robbery, residential/commercial/auto burglary, rape (1st/2nd), sexual exploitation, child sexual abuse, assault (simple/deadly weapon/domestic/peace officer), DUI, drugs (possession/marijuana/paraphernalia/maintaining premises); 18.5 stalking/harassment, 20.5 disorderly person/loitering, 22.10 retail fraud/shoplifting, 32.5 malicious destruction/vandalism, 33.1 trespass |
| WA | Washington Pattern Jury Instructions (Crim.) | WA Sup. Ct. | Yes (HTML) | Yes | No | Yes | **IMPL** — WPIC per-instruction URLs; 26.x homicide, 35.x assault (incl. DV), 36.52.01 harassment, 36.53.01 vehicular, 37.x robbery, 38.x burglary, 45.x rape/sexual assault, 48.04 disorderly conduct/loitering, 50.x drugs, 56.04 criminal trespass 2nd, 58.04 malicious mischief 3rd/vandalism, 70.62 retail theft/shoplifting, 92.06 DUI (all 3 offenses) |
| AZ | RAJI Criminal | State Bar of AZ | No | Yes (bulk) | No | No | **IMPL** — azleg.gov statute URLs; ref text |
| MA | SJC Homicide Instr. (§ I–IX) + Dist.Ct. + Sup.Ct. | MA SJC / Dist.Ct. / Sup.Ct. | Yes (HTML + PDF) | Yes | No | Yes | **IMPL** — per-instruction URLs: SJC Homicide §§ IV–VIII (murder/manslaughter/attempt, mass.gov/info-details/); Dist.Ct. PDFs (5.140 vehicular, 5.310 OUI, 6.140/6.160/6.270 assault, 6.260 indecent A&B ≥14, 6.280 indecent A&B child <14, 7.800/7.820/7.830 drugs, 8.100/8.104 B&E, 10.100 firearms possession/felon/minor, mass.gov/doc/{slug}/download); Sup.Ct. PDFs (armed robbery, rape, sexual-exploitation-of-a-child, mass.gov/doc/superior-court-model-criminal-jury-instructions-{topic}-pdf/download) |
| TN | TPI-Criminal | TN Judicial Conference | No | No | Yes (LexisNexis) | No | **IMPL** — TPI-Crim. refs only (paywalled; no instructionUrl); murder, manslaughter, assault, DV, robbery, burglary, rape, DUI, drugs |
| IN | Indiana Model Criminal Jury Instructions | IN Judicial Ctr. | Yes (HTML) | Yes | No | Yes | **IMPL** — Ind. Model Crim. Jury Instr. base URL (in.gov/courts/iocs/resources/model-criminal-jury-instructions/); 7.2010 murder/felony-murder/attempted-murder, 10.2010 rape/sexual-assault/statutory-rape/child-sexual-abuse/exploitation/attempted-sexual-assault, 11.2010 felon-in-possession/prohibited-weapon/juvenile-firearm, 13.2010 residential/commercial/auto-burglary, 13.3010 criminal-trespass, 14.2010 robbery/bank-robbery/attempted-robbery, 15.2010 criminal-mischief/vandalism, 17.2010 harassment, 17.4010 loitering, 20.2010 drug-possession/paraphernalia/maintaining-premises/school-zone, 28.2010 DUI |
| MO | Missouri Approved Instructions (Criminal) | MO Sup. Ct. | Yes (HTML) | Yes | No | Yes | **IMPL** — MAI-CR base URL; murder, manslaughter, assault, DV assault, robbery, burglary, sexual assault, rape, DUI, drugs covered; **304.04** shoplifting/stealing (§ 570.030), **319.06** harassment (§ 565.090), **323.52** vandalism/property damage (§ 569.100), **323.68** trespass (§ 569.140), **327.10** loitering (§ 574.050) |
| MD | Maryland Criminal Jury Instructions (MCJI) | MD Judicial Coll. | No | No | Yes (LexisNexis) | No | **IMPL** — MCJI refs only (paywalled; no instructionUrl); murder, manslaughter, assault, DV, robbery, burglary, rape, sexual assault, grand theft, DUI, drugs |
| WI | Wisconsin Jury Instructions — Criminal | WI Judicial Coll. | Yes (HTML) | Yes | No | Yes | **IMPL** — Wis JI-Criminal base URL; murder, manslaughter, assault, DV assault, robbery, burglary, sexual assault, rape, DUI, drugs covered; **1400** vandalism/criminal damage (§ 943.01), **1453** trespass (§ 943.13), **1454** shoplifting/retail theft (§ 943.50), **1900** harassment (§ 947.0125), **1917** loitering (§ 947.02) |
| MN | Minnesota Jury Instruction Guides (Crim.) (CRIMJIG) | MN Dist. Judges Assoc. | No | No | Yes (Westlaw) | No | **IMPL** — CRIMJIG refs only (paywalled; no instructionUrl); murder, manslaughter, assault (1st/2nd/3rd/deadly weapon/peace officer), DV, robbery, bank robbery, residential/commercial/auto burglary, rape/sexual assault (1st/2nd), child sexual abuse, sexual exploitation, DUI, drugs (possession/marijuana/paraphernalia/maintaining premises), trespass (17.10), disorderly conduct (17.20), obstructing/resisting arrest (13.01), bail jumping/failure to appear (13.10), theft/petty theft + shoplifting (16.01), criminal damage to property/vandalism (17.25), harassment/stalking (12A.01), loitering (17.50), felon-in-possession (CRIMJIG 11.01); mn-public-intoxication (§ 340A.902) omitted — liquor-law petty misdemeanor, no CRIMJIG instruction |
| CO | COLJI-Criminal | CO Sup. Ct. Comm. | No | No | Yes (Westlaw) | No | **IMPL** — ref text only (paywalled) |
| AL | Alabama Pattern Jury Instructions — Crim. (APJI-Crim.) | AL Bar / Circuit Judges | No | No | Yes (ALBarStar) | No | **IMPL** — APJI-Crim. refs only (paywalled ALBarStar; no instructionUrl); murder (1st/2nd/felony), manslaughter (vol/invol), criminally negligent homicide, assault (1st/2nd/3rd/aggravated/deadly weapon/DV), robbery (1st/2nd), burglary (1st/2nd/3rd), rape 1st, DUI all 3 offenses, drug trafficking |
| SC | South Carolina Requests to Charge — Criminal | SC Bar | No | No | Yes (LexisNexis) | No | **IMPL** — SC Req. to Charge Crim. refs only (paywalled LexisNexis; no instructionUrl); murder (1st/2nd), attempted murder, manslaughter (vol/invol), assault (1st/2nd/3rd/aggravated/deadly weapon/DV), robbery (1st/2nd), burglary (1st/2nd/3rd), rape 1st, DUI all 3 offenses, drug trafficking |
| KY | Kentucky Instructions to Juries (Crim.) | KY Bar | No | No | Yes (LexisNexis) | No | **IMPL** — KY JI refs only (paywalled LexisNexis; no instructionUrl); murder § 507.020, manslaughter 1st § 507.030, manslaughter 2nd § 507.040, reckless homicide § 507.050, vehicular homicide § 189A.010, assault 1st § 508.010, robbery 1st § 515.020, robbery 2nd § 515.030, burglary 1st § 511.020, burglary 2nd § 511.030, rape/sexual assault 1st § 510.040, DUI § 189A.010, drug trafficking § 218A.1411/218A.1412 |
| OR | Oregon Uniform Criminal Jury Instructions | OR Crim. Law Sect. | No | No | Yes (LexisNexis) | No | **IMPL** — UCJI refs only (paywalled LexisNexis; no instructionUrl); murder 1705, murder 2nd 1706, felony murder 1707, manslaughter 1st 1710, manslaughter 2nd 1720, crim neg homicide 1730, vehicular homicide 1735, assault 1st 1851, robbery 1st 1661, robbery 2nd 1662, burglary 1st 1671, burglary 2nd 1672, rape/sexual assault 1901, DUII 2712, drug trafficking 2752/2753 |
| OK | Oklahoma Uniform Jury Instructions — Crim. | OK OUJI-CR | Yes (HTML) | Yes | No | Yes | **IMPL** — OUJI-CR refs + oscn.net per-instruction URLs (DeliverDocument.asp?CiteID= format, verified 2026-06; old /applications/ouji-cr/{N}-{M}.htm format is 404); **4-32** harassment (CiteID=81086), 4-72/83 murder, 4-89/97 manslaughter, 4-15a DV assault, 4-18 aggravated assault, 4-120 rape/sexual assault, 4-133/141 robbery, 5-8/17 burglary, **5-103** shoplifting/larceny of merchandise (CiteID=81304), **5-108** malicious mischief/vandalism § 1760 (CiteID=81309), 6-11 DUI, 6-39/44/46 drugs; loitering ref 5-40 REMOVED (5-40 = False Pretense; no OUJI-CR instruction for general loitering); trespass ref 5-65 REMOVED (5-65 = Counterfeiting Coins; no OUJI-CR instruction for criminal trespass) |
| CT | Connecticut Jury Instructions (Crim.) | CT Jud. Branch | Yes (HTML) | Yes | No | Yes | **IMPL** — CT JI refs + jud.ct.gov per-instruction URLs; 2.x homicide, 3.1 sexual assault, 5.x robbery, 6.x assault, 7.x burglary, 11.1 DUI, 12.x drugs |
| IA | Iowa Criminal Jury Instructions | Iowa State Bar | No | No | Yes (Westlaw) | No | **IMPL** — Iowa CJI refs only (paywalled Westlaw; no instructionUrl); murder 1st 700.1, murder 2nd 700.3, voluntary manslaughter 710.1, involuntary manslaughter 710.3, vehicular homicide 720.1, assault 1000.1, robbery 1st 920.1, robbery 2nd 920.3, burglary 1st 930.1, burglary 2nd 930.3, sexual abuse/rape 1st 900.1, DUI 2500.1, drug trafficking 2300.1/2300.3 |
| MS | Mississippi Model Jury Instructions | MS Bar | No | No | Yes | No | **IMPL** — Miss. Model JI (Crim.) refs only (paywalled; no instructionUrl); murder (1-1/1-3/1-5), manslaughter (1-7/1-9), attempted murder (1-20), assault (16-1), DV (16-10), robbery (23-1/23-3), burglary (19-1/19-3), rape/sexual assault (25-1/25-5), DUI (27-40), drug trafficking (27-20), PWID (27-25), drug possession (27-10), petty theft (12-1), grand theft (12-3), shoplifting (12-5), trespass (22-1), vandalism (22-5), resisting arrest (24-1), failure to appear (24-5), harassment (28-5), disorderly conduct (28-10), loitering (28-15), public intoxication (28-20) |
| AR | Arkansas Model Jury Instructions (Crim.) | AR Judicial Council | No | No | Yes | No | **IMPL** — AMI Crim. refs only (paywalled; no instructionUrl); murder (1001/1002/1003), manslaughter (1004/1005), crim neg homicide (1006), vehicular homicide (1008), assault (2001), DV (2015), robbery (3001/3002), burglary (3501/3502), rape (4003), sexual assault (4001), DUI (5001), drug trafficking (6001), drug possession (6002), petty theft (7003), grand theft (7001/7002), shoplifting (7005), vandalism (7101), trespass (7201), harassment (9001), disorderly conduct (9101), loitering (9102), public intoxication (9201), resisting arrest (9301), failure to appear (9401) |
| KS | Kansas Pattern Instructions — Crim. | KS Judicial Council | Yes (HTML) | Yes | No | Yes | **IMPL** — PIK Crim. 4th base URL (kscourts.org/Kansas-Courts/District-Courts/Pattern-Jury-Instructions/Criminal); 54.010 murder-1st, 54.020 murder-2nd, 54.030 felony-murder, 54.040 attempted-murder, 54.050 voluntary-manslaughter, 54.060 involuntary-manslaughter, 54.070 vehicular-homicide/criminally-negligent-homicide, 52.010 felon-in-possession/prohibited-weapon/juvenile-firearm, 56.010 robbery/bank-robbery/attempted-robbery, 57.010 rape/statutory-rape/attempted-sexual-assault, 57.020 child-sexual-abuse, 57.060 sexual-exploitation-of-minor, 59.010 residential-burglary, 59.020 commercial/auto-burglary, 67.010 maintaining-drug-premises, 67.030 drug-possession/paraphernalia, 67.040 school-zone, 75.010 DUI |
| UT | Utah Model Jury Instructions | UT Cts. | Yes (HTML) | Yes | No | Yes | **IMPL** — UMJI-CR base URL; murder, manslaughter, assault, DV assault, robbery, burglary, sexual assault, rape, DUI, drugs covered; **1702** shoplifting/retail theft (§ 76-6-602), **1704** trespass (§ 76-6-206), **1707** vandalism/criminal mischief (§ 76-6-106), **1901** harassment (§ 76-9-201), **1906** loitering/disorderly conduct (§ 76-9-102) |
| NV | Nevada Jury Instructions | NV Cts. / State Bar | No | No | Yes | No | **IMPL** — Nev. JI refs only (paywalled; no instructionUrl); murder (51/52), manslaughter (53/54), vehicular homicide (55), assault (70), DV (75), robbery (120/122), burglary (131/133), sexual assault/rape (81/82), DUI (245), drug trafficking (200), PWID (205), drug possession (§28.01), petty theft (§15.10), grand theft (§15.20/§15.25), shoplifting (§15.30), trespass (§20.07), vandalism (§21.01), harassment (§20.05), resisting arrest (§19.05), failure to appear/bail jumping (§19.10), loitering (§20.06) |
| NM | Uniform Jury Instructions — Crim. (NMRA 14) | NM Sup. Ct. | Yes (HTML) | Yes | No | Yes | **IMPL** — UJI 14-series base URL; murder, manslaughter, assault, DV assault, robbery, burglary, sexual assault, rape, DUI, drugs covered; **14-1401** trespass (§ 30-14-1), **14-1501** vandalism/malicious mischief (§ 30-15-1), **14-1620** shoplifting (§ 30-16-20), **14-0341** harassment (§ 30-3A-2), **14-2001** loitering/disorderly conduct (§ 30-20-1) |
| WV | West Virginia Criminal Jury Instructions | WV Bar | No | No | Yes | No | **IMPL** — W.Va. Crim. JI refs only (paywalled; no instructionUrl); murder, manslaughter, assault, DV, robbery, burglary, rape, sexual assault, DUI, drugs |
| NE | Nebraska Jury Instructions (Crim.) | NE Jud. Council | No | Yes (bulk) | No | No | **IMPL** — Neb. JI-Crim. refs only (bulk PDF; no per-instruction URL); murder, manslaughter, assault, DV, robbery, burglary, rape, sexual assault, DUI, drugs |
| ID | Idaho Criminal Jury Instructions | ID Cts. | No | Yes (bulk) | No | No | **IMPL** — ICJI refs only (bulk PDF; no per-instruction URL); murder, manslaughter, assault, DV, robbery, burglary, rape, sexual assault, DUI, drugs |
| HI | Hawaii Criminal Jury Instructions | HI Cts. | No | Yes (bulk) | No | No | **IMPL** — Hawaii CJIS refs only (bulk PDF; no per-instruction URL); murder, manslaughter, assault, DV, robbery, burglary, rape, sexual assault, DUI, drugs |
| ME | Maine Jury Instruction Manual | ME Jud. Branch | No | No | Yes | No | **IMPL** — Me. JI Manual refs only (paywalled; no instructionUrl); murder, manslaughter, assault, DV, robbery, burglary, rape, sexual assault, OUI, drugs |
| NH | NH Superior Court Criminal Jury Instructions | NH Cts. | No | No | Yes | No | **IMPL** — N.H. Crim. JI refs only (paywalled; no instructionUrl); murder, manslaughter, assault, DV, robbery, burglary, rape, sexual assault, DUI, drugs |
| RI | Rhode Island Model Jury Instructions | RI Bar | No | No | Yes | No | **IMPL** — R.I. Model JI (Crim.) refs only (paywalled; no instructionUrl); murder, manslaughter, assault, DV, robbery, burglary, rape, sexual assault, DUI, drugs |
| MT | Montana Criminal Jury Instructions | MT Cts. | No | Yes (bulk) | No | No | **IMPL** — Mont. Crim. JI refs only (bulk PDF; no per-instruction URL); murder, manslaughter, assault, DV, robbery, burglary, rape, sexual assault, DUI, drugs |
| ND | North Dakota Criminal Jury Instructions | ND Cts. | No | No | Yes | No | **IMPL** — N.D. JI (Crim.) refs only (paywalled; no instructionUrl); murder, manslaughter, assault, DV, robbery, burglary, rape, sexual assault, DUI, drugs |
| SD | South Dakota Pattern Jury Instructions | SD UJS | No | No | Yes | No | **IMPL** — S.D. PJI (Crim.) refs only (paywalled; no instructionUrl); murder, manslaughter, assault, DV, robbery, burglary, rape, sexual assault, DUI, drugs |
| VT | Vermont Jury Instructions | VT Cts. | No | No | Yes | No | **IMPL** — Vt. JI Crim. refs only (paywalled; no instructionUrl); murder, manslaughter, assault, DV, robbery, burglary, rape, sexual assault, DUI, drugs |
| AK | Alaska Pattern Jury Instructions | AK Cts. | No | Yes (bulk) | No | No | **IMPL** — Alaska PJI-Crim. refs only (bulk PDF; no per-instruction URL); murder, manslaughter, assault, DV, robbery, burglary, rape, sexual assault, DUI, drugs |
| DE | Delaware Criminal Jury Instructions | DE Cts. | No | No | Yes | No | **IMPL** — Del. Crim. JI refs only (paywalled; no instructionUrl); murder, manslaughter, assault, DV, robbery, burglary, rape, sexual assault, DUI, drugs |
| WY | Wyoming Criminal Pattern Jury Instructions | WY Bar | No | No | Yes | No | **IMPL** — Wyo. PJI Crim. refs only (paywalled; no instructionUrl); murder, manslaughter, assault, DV, robbery, burglary, rape, sexual assault, DUI, drugs |
| LA | Louisiana Criminal Jury Instructions | LA Jud. College | No | No | Yes | No | **IMPL** — La. Crim. JI refs only (paywalled; no instructionUrl); murder, manslaughter, assault, DV, robbery, burglary, rape, sexual assault, DUI, drugs |
| VA | Virginia Model Jury Instructions (Crim.) (VMJI) | VA CLE | No | No | Yes (LexisNexis) | No | **IMPL** — VMJI refs only (paywalled; no instructionUrl); murder, manslaughter, assault, DV, robbery, burglary, rape, sexual assault, grand theft, DUI, drugs |
| DC | DC Criminal Jury Instructions (Redbook) | DC Courts | Yes (HTML) | Yes | No | Yes | **IMPL** — DC Redbook §§ refs + dccourts.gov base URL; murder (§§ 4.100/4.101/4.400), manslaughter (§§ 4.200/4.210/4.220/4.300), assault (§§ 4.500/4.501), robbery (§ 4.600), burglary (§§ 5.100/5.200), sexual abuse/rape (§ 8.100), drugs (§§ 9.100/9.200), DUI/OUI (§ 3.100) |
| PR | Puerto Rico (Spanish) Jury Instructions | PR Sup. Ct. | No | Yes (bulk) | No | No | **IMPL** — P.R. Instr. al Jurado refs only (bulk PDF; no per-instruction URL); murder 1st/2nd, manslaughter vol/invol, felony murder, criminally negligent homicide, vehicular homicide, aggravated assault, DV assault, assault 1st, rape/sexual assault 1st, child sexual abuse, robbery 1st/2nd, burglary 1st/2nd, drug distribution/manufacturing/possession |
| AS/GU/MP | Territory jury instructions (9th Cir.) | 9th Cir. | No | Yes (free PDF) | No | No | **IMPL** — 9th Cir. Model Crim. Instr. refs (no instructionUrl; as persuasive authority in territory courts); homicide (§§ 8.70–8.73), assault (§ 8.3), sexual abuse (§ 8.140), robbery (§ 8.120), burglary (§ 8.130), drugs (§§ 14.1/14.4) |
| VI | Territory jury instructions (3d Cir.) | 3d Cir. | No | Yes (free PDF) | No | No | **IMPL** — 3d Cir. Model Crim. JI refs (no instructionUrl; as persuasive authority in VI courts); murder (§§ 6.17/6.18), manslaughter (§ 6.19), assault (§ 6.21), sexual abuse (§ 6.25), robbery (§ 7.07), burglary (§ 7.08), drugs (§ 9.15) |
| Federal | Federal Criminal Jury Instructions | Various circuits | Varies | Varies | Varies | Varies | **IMPL** — 9th Cir. Model Crim. Instr.: murder/felony-murder § 8.70, attempted murder § 8.74, sexual abuse §§ 8.140–8.145, Hobbs Act robbery § 8.120, drugs § 14.1, false statements § 9.8, ID fraud § 9.30, RICO § 9.24; Sand's Mod. Fed. JI: theft by receiving § 57A-11, animal cruelty § 32-8, juvenile delinquency § 9-15 |

**Per-URL**: Whether individual instructions have stable, linkable per-instruction URLs (not bulk PDF only).

---

## Jurisdictions with Linkable Per-Instruction URLs (priority targets)

These states publish free, per-instruction URLs suitable for direct `instructionUrl` links:

| State | URL Pattern | Example |
|-------|-------------|---------|
| **NY** | `https://www.nycourts.gov/judges/cji/2-PenalLaw/{art}/{art}.{sec}.pdf` | [Murder 2nd §125.25](https://www.nycourts.gov/judges/cji/2-PenalLaw/125/125.25.pdf) |
| **NJ** | `https://www.njcourts.gov/sites/default/files/attorneys/crimjury/{2c}{sec}.pdf` | [Murder 2C:11-3](https://www.njcourts.gov/sites/default/files/attorneys/crimjury/2c1103.pdf) |
| **FL** | `https://www.floridasupremecourt.org/jury-instructions/criminal-standard-jury-instructions/{instr}.pdf` | Research needed for exact pattern |
| **IL** | `https://www.illinoiscourts.gov/resources/{guid}/file` | Per-chapter PDFs; each GUID is unique per chapter (verified 200 on 6 chapters 2026-06). Known GUIDs: Ch. 7 Homicide = `4ca60c86-cef3-465a-83ae-9cc61d159640`; Ch. 11 Bodily Harm = `26c815cd-a14a-4ab0-a234-704512806e8e`; Ch. 16 Criminal Damage and Trespass = `50f36433-7722-466e-a3aa-0da8a6ae9b3c`. Chapters 22 (Judicial Interference) and 23 (Traffic) are NOT loitering/trespass chapters — chapter assignments must be verified via the illinoiscourts.gov IPI-CR index before assigning refs. |
| **OH** | N/A — OJI not publicly accessible as per-instruction URLs | All tested supremecourt.ohio.gov/JCS/crimJustice/OJI/ paths return 404 (index, PDFs, and .htm instruction paths verified 2026-06); OJI may require Ohio Judicial College purchase; `instructionRef` label only (no `instructionUrl`) |
| **MI** | `https://www.courts.michigan.gov/rules-administrative-orders-and-jury-instructions/current-rules-and-jury-instructions/model-criminal-jury-instructions2/` | One HTML document with all CJI2d instructions (mjieducation.mi.gov redirects here); verified 200 (2026-06) |
| **WA** | `https://www.courts.wa.gov/superiorct/jury_instructions/?fa=jury_instructions.displaySection&category=criminal&section=WPIC+{N}.{NN}` | per-instruction query param URL |
| **OK** | `https://www.oscn.net/applications/oscn/DeliverDocument.asp?CiteID={id}` | per-instruction URL via OSCN document delivery (old `/applications/ouji-cr/{N}-{M}.htm` format is 404 as of 2026-06; use OSCN index at `/applications/oscn/Index.asp?ftdb=STOKJUCR&level=3` to find CiteIDs) |
| **CT** | `https://www.jud.ct.gov/ji/Criminal/{chapter}/{instruction}.htm` | per-instruction HTM URL |
| **MA** | SJC Homicide: `https://www.mass.gov/info-details/model-jury-instructions-on-homicide-{chapter-slug}` · Dist.Ct. PDFs: `https://www.mass.gov/doc/{nnnn-topic-slug}/download` · Sup.Ct. PDFs: `https://www.mass.gov/doc/superior-court-model-criminal-jury-instructions-{topic}-pdf/download` · Base index: `https://www.mass.gov/model-jury-instructions` | per-instruction; 403 from curl = CDN bot-block; confirmed live via webFetch (2026-06); old base URL `/lists/criminal-model-jury-instructions` is now 404 — base moved to `/model-jury-instructions`; firearm 10100 PDF dead — replaced with `superior-court-model-criminal-jury-instructions-firearm-possession-pdf/download` (verified 2026-06) |
| **DC** | no public URL — DC Redbook (LexisNexis/Matthew Bender) has no free web equivalent | base URL `/superior-court/criminal-division/dc-criminal-jury-instructions` returned 404 as of 2026-06-18 (was 403 in prior check); node/266 and node/21001 return "Access Denied"; no per-instruction URLs publicly accessible; `instructionUrl` removed from all DC entries — `instructionRef` text labels retained |
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
21. **MN** — CRIMJIG **IMPLEMENTED** (ref text only — paywalled Westlaw; murder incl. 3rd degree, manslaughter, assault, DV, robbery, burglary incl. 3rd degree, rape, sexual assault, grand theft, DUI all 3 offenses, drugs incl. possession)
22. **TX** — TPJC **IMPLEMENTED** (ref text only — paywalled Westlaw; murder, manslaughter, assault incl. DV, robbery, burglary, rape/sexual assault, DUI all 3 offenses, drugs incl. possession and PWID)
23. **VA** — VMJI **IMPLEMENTED** (ref text only — paywalled LexisNexis; murder, manslaughter, assault, DV, robbery, burglary, rape, sexual assault, grand theft, DUI all 3 offenses, drugs)
24. **MA** — SJC Homicide + Dist.Ct. + Sup.Ct. PDFs **IMPLEMENTED** (per-instruction URLs; murder SJC §§ IV/V, felony murder § IV, manslaughter §§ VI/VII, vehicular homicide Dist.Ct. 5.140, attempted murder § VIII; aggravated assault 6.160, A&B 6.140, domestic A&B 6.270; armed robbery Sup.Ct. PDF, unarmed robbery Sup.Ct. PDF; B&E nighttime 8.100, B&E daytime 8.104; rape Sup.Ct. PDF; OUI 5.310; drug distribution 7.800, possession 7.820, PWID 7.830)
25. **DC** — DC Redbook **IMPLEMENTED** (base URL only — dccourts.gov 403s all access; §§ refs: murder 4.100/4.101/4.400, manslaughter 4.200/4.210/4.220/4.300, assault 4.500/4.501, robbery 4.600, burglary 5.100/5.200, sexual abuse/rape 8.100, drugs 9.100/9.200, DUI/OUI 3.100)
26. **PA** — Pa. SSJI (Crim.) **IMPLEMENTED** (ref text only — paywalled LexisNexis; murder 1st/2nd/3rd/felony, manslaughter, attempted murder, aggravated assault, DV, robbery, burglary, rape 1st/2nd, sexual assault 2nd/3rd, DUI all 3 offenses, possession, PWID)
27. **AL** — APJI-Crim. **IMPLEMENTED** (ref text only — paywalled ALBarStar; no instructionUrl; murder 1st/2nd/felony, manslaughter vol/invol, criminally negligent homicide, assault 1st/2nd/3rd/aggravated/deadly weapon/DV, robbery 1st/2nd, burglary 1st/2nd/3rd, rape 1st, DUI all 3 offenses, drug trafficking)
28. **SC** — SC Req. to Charge Crim. **IMPLEMENTED** (ref text only — paywalled LexisNexis; no instructionUrl; murder 1st/2nd, attempted murder, manslaughter vol/invol, assault 1st/2nd/3rd/aggravated/deadly weapon/DV, robbery 1st/2nd, burglary 1st/2nd/3rd, rape 1st, DUI all 3 offenses, drug trafficking)

---

*Last updated: 2026-06-18 (URL spot-check: MA per-instruction URLs all confirmed live via webFetch — SJC Homicide info-details slugs, Dist.Ct. PDFs, Sup.Ct. PDFs; MA old base URL `/lists/criminal-model-jury-instructions` now 404 — new base is `/model-jury-instructions`; MA firearm 10100 PDF dead — updated 3 entries to `superior-court-model-criminal-jury-instructions-firearm-possession-pdf/download`; DC base URL `/superior-court/criminal-division/dc-criminal-jury-instructions` now 404 and node paths access-denied — DC Redbook has no public web access; instructionUrl removed from all 24 DC entries, instructionRef labels retained; DC URL pattern in pji-availability.md updated to reflect no public URL) · 2026-06-16 (MA promoted from PLANNED to IMPL with per-instruction URLs: SJC Homicide §§ IV–VIII, Dist.Ct. 5.140/5.310/6.140/6.160/6.270/7.800/7.820/7.830/8.100/8.104 PDFs, Sup.Ct. armed/unarmed robbery and rape PDFs — 7 URLs spot-checked live 2026-06; DC promoted to IMPL with base URL + DC Redbook §§ refs; mass.gov returns 403 from curl/CDN, confirmed live via browser/webFetch; TX promoted from NO URL to IMPL — TPJC refs (paywalled Westlaw) added for all target categories incl. DV assault, DUI 2nd/3rd, rape/sexual assault 2nd; MN IMPL confirmed with possession of controlled substance CRIMJIG 20.20 and rape 2nd degree CRIMJIG 12.04 added to complete coverage; PA promoted from NO URL to IMPL — Pa. SSJI refs (paywalled LexisNexis) added for all target categories: murder 1st/2nd/3rd/felony, manslaughter, attempted murder, aggravated assault, DV assault, robbery, burglary, rape 1st/2nd, sexual assault 2nd/3rd, DUI all 3 offenses, possession, PWID; NC/TN gap-fill: vehicular homicide, possession, PWID, sexual assault 1st/2nd/3rd refs added; TN criminally negligent homicide added; TX sexual assault 2nd/3rd TPJC 22.011 added)*  
*Maintained by the citation research team. See `shared/criminal-charge-citations.ts` for implemented data.*
