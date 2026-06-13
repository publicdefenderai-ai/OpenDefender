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

---

## California — CALCRIM (California Criminal Jury Instructions)

**Publisher**: Judicial Council of California  
**Format**: Annual PDF (not individual HTML pages per instruction)  
**Official URL**: https://www.courts.ca.gov/partners/documents/calcrim-juryinstructions.pdf  
**Coverage**: All 58 counties; updated annually (latest: 2024 edition)  
**Status**: **IMPLEMENTED** — `instructionRef` added to key CA charges

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
| Drug Possession/Transportation | 2300 | § 11350 / § 11352 |
| DUI | 2110 | § 23152 VEH |
| Vandalism | 2900 | § 594 |

### CA Charges Still Needing CALCRIM Refs (future work)

- ca-stalking (CALCRIM 1301, § 646.9)
- ca-kidnapping (CALCRIM 1215, § 207)
- ca-arson (CALCRIM 1515, § 451)
- ca-child-sexual-abuse (CALCRIM 1110, § 288) — already correct citation, needs instructionRef
- ca-conspiracy (CALCRIM 415, § 182)
- ca-identity-theft (CALCRIM 2040, § 530.5)
- ca-resisting-arrest (CALCRIM 2656, § 148)

---

## New York — CJI2d (Criminal Jury Instructions, 2nd Ed.)

**Publisher**: New York State Unified Court System, Office of Court Administration  
**Format**: HTML pages (individually accessible)  
**Official URL**: https://www.nycourts.gov/judges/cji/  
**Coverage**: All NY courts; updated as needed  
**Status**: PLANNED — URL pattern confirmed; `instructionRef` + `instructionUrl` to be added

### NY CJI2d URL Pattern

```
https://www.nycourts.gov/judges/cji/2-PenalLaw/{article}/{article}.{section}.pdf
```

Example (Murder 2nd, Penal Law § 125.25):
`https://www.nycourts.gov/judges/cji/2-PenalLaw/125/125.25.pdf`

### Key NY CJI2d Mappings (to implement)

| Charge | CJI2d Ref | Penal Law § |
|--------|-----------|-------------|
| Murder 1st | CJI2d PL 125.27 | 125.27 |
| Murder 2nd | CJI2d PL 125.25 | 125.25 |
| Manslaughter 1st | CJI2d PL 125.20 | 125.20 |
| Manslaughter 2nd | CJI2d PL 125.15 | 125.15 |
| Assault 1st | CJI2d PL 120.10 | 120.10 |
| Robbery 1st | CJI2d PL 160.15 | 160.15 |
| Robbery 2nd | CJI2d PL 160.10 | 160.10 |
| Burglary 1st | CJI2d PL 140.30 | 140.30 |
| Burglary 2nd | CJI2d PL 140.25 | 140.25 |
| Rape 1st | CJI2d PL 130.35 | 130.35 |

---

## New Jersey — Model Jury Charges (Criminal)

**Publisher**: New Jersey Courts (judiciary.state.nj.us)  
**Format**: PDF pages  
**Official URL**: https://www.njcourts.gov/attorneys/criminal-model-jury-charges  
**Status**: PLANNED

### NJ URL Pattern

```
https://www.njcourts.gov/sites/default/files/attorneys/crimjury/{article}{section}.pdf
```

Example (Murder, § 2C:11-3):
`https://www.njcourts.gov/sites/default/files/attorneys/crimjury/2c11-3.pdf`

---

## Arizona — RAJI (Revised Arizona Jury Instructions)

**Publisher**: State Bar of Arizona, Criminal Law Section  
**Format**: PDF volumes  
**Official URL**: https://www.azcourts.gov/AZCourts/media/AZCourtMedia/PDFs/committees/RAJI/  
**Status**: RESEARCH NEEDED — URL patterns for individual instructions not confirmed

---

## Georgia — Suggested Pattern Jury Instructions (Criminal)

**Publisher**: Council of Superior Court Judges of Georgia  
**Format**: PDF (volume-based, not per-instruction URLs)  
**Official URL**: https://georgiacourts.gov/councils/superior-court-judges-council/  
**Status**: RESEARCH NEEDED — individual instruction URLs not available online

---

## Colorado — COLJI-Criminal (Colorado Criminal Jury Instructions)

**Publisher**: Colorado Supreme Court Committee on Criminal Jury Instructions  
**Format**: Westlaw/LexisNexis (paywalled); no free individual HTML pages  
**Status**: NO FREE URL — `instructionRef` text only (no `instructionUrl`); same as CA

---

## Texas — Texas Criminal Pattern Jury Charges

**Publisher**: State Bar of Texas  
**Format**: Published volumes (paywalled)  
**Status**: NO FREE URL — `instructionRef` text only if added

---

## Florida — Standard Jury Instructions in Criminal Cases

**Publisher**: Florida Supreme Court  
**Format**: HTML pages (freely accessible)  
**Official URL**: https://www.floridasupremecourt.org/jury-instructions/criminal-standard-jury-instructions/  
**URL Pattern**: Per-instruction pages available; research needed for exact format  
**Status**: PLANNED

---

## Implementation Priority

1. **CA** — CALCRIM ✅ Implemented (key charges)
2. **NY** — CJI2d ⏳ Planned (HTML pages confirmed accessible)
3. **FL** — Standard Instructions ⏳ Planned (HTML pages confirmed)
4. **NJ** — Model Jury Charges ⏳ Planned (PDF pages confirmed)
5. **AZ** — RAJI 🔍 Research needed
6. **CO** — COLJI 🚫 Paywalled (ref text only)
7. **TX** — TCPJC 🚫 Paywalled (ref text only)
8. **GA** — SPJI 🔍 Research needed

---

## States with 0% Citation Coverage (13 jurisdictions)

These states have no verified overlay entries. PJI research may help bootstrap coverage:

| State | Primary Citation Source | PJI Publisher |
|-------|------------------------|---------------|
| HI | Haw. Rev. Stat. (unreachable site) | Hawaii Pattern Jury Instructions Criminal |
| ME | Me. Rev. Stat. tit. 17-A | Maine Jury Instruction Manual |
| MS | Miss. Code Ann. | Mississippi Model Jury Instructions |
| MT | Mont. Code Ann. | Montana Criminal Jury Instructions |
| ND | N.D. Cent. Code | North Dakota Criminal Jury Instructions |
| NH | N.H. Rev. Stat. Ann. | NH Superior Court Criminal Jury Instructions |
| NM | N.M. Stat. Ann. | NMRA 14-000 series (Uniform Jury Instructions) |
| RI | R.I. Gen. Laws | Rhode Island Model Jury Instructions |
| SD | S.D. Codified Laws | South Dakota Pattern Jury Instructions |
| VT | Vt. Stat. Ann. | Vermont Jury Instructions |
| WV | W. Va. Code | West Virginia Criminal Jury Instructions |
| WY | Wyo. Stat. Ann. | Wyoming Criminal Pattern Jury Instructions |
| DC | D.C. Code | DC Criminal Jury Instructions (Redbook) |

---

*Last updated: 2026-06-13*  
*Maintained by the citation research team. See `shared/criminal-charge-citations.ts` for implemented data.*
