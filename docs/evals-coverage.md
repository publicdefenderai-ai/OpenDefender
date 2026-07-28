# Content Accuracy Evals — Coverage Report

**Generated:** 2026-07-28  
**Harness:** `tests/evals-harness.test.ts`  
**Fixture file:** `tests/fixtures/evals-scenarios.ts`  
**Test runner:** `npx vitest run`

---

## Summary

| Dimension | Count |
|---|---|
| Total scenarios | 92 |
| Passing | 92 |
| Failing | 0 |
| Priority 1 (Deadlines) | 52 |
| Priority 2 (Collateral consequences) | 26 |
| Priority 3 (Alerts, coverage, uncertainties) | 35 |

> **⚠️ Attorney review recommended.** Expected values in the scenarios were derived from the rules constants in `server/services/guidance-engine.ts` by the engineering team.  They verify that the engine faithfully executes its own rules, but they do **not** independently verify that those rules are legally accurate.  A licensed attorney should review the jurisdiction deadlines in `jurisdictionRules`, the consequence language in `CHARGE_CONSEQUENCE_MAP`, and the critical alert text in `buildCriticalAlertsForCharges` before treating passing eval results as authoritative for users.

---

## Coverage dimensions

### Jurisdictions covered

| Jurisdiction | Status | Scenarios | Notes |
|---|---|---|---|
| CA | Mapped | 4 | Full deadline + DUI DMV path |
| TX | Mapped | 2 | Arraignment + discovery deadlines |
| NY | Mapped | 2 | Arraignment + discovery deadlines |
| FL | Mapped | 2 | Arraignment + preliminary hearing |
| IL | Mapped | 3 | Arraignment + preliminary hearing + discovery |
| PA | Mapped | 3 | Arraignment + preliminary hearing + discovery |
| WA | Mapped | 3 | Arraignment + preliminary hearing + discovery |
| OH | Mapped | 3 | Arraignment + preliminary hearing + discovery |
| GA | Mapped | 3 | Arraignment + preliminary hearing + discovery |
| AZ | Mapped | 3 | Arraignment + preliminary hearing + discovery |
| NJ | Mapped | 3 | Arraignment + preliminary hearing + discovery |
| MI | Mapped | 3 | Arraignment + preliminary hearing + discovery |
| NC | Mapped | 3 | Arraignment + preliminary hearing + discovery |
| VA | Mapped | 3 | Arraignment + preliminary hearing + discovery |
| federal | Mapped | 2 | "Without unnecessary delay" language |
| CO | Unmapped | 1 | isEstimate + uncertainty notice |
| OR | Unmapped | 1 | isEstimate + uncertainty notice |
| NV | Unmapped | 1 | isEstimate + uncertainty notice |
| MT | Unmapped | 1 | isEstimate + uncertainty notice |

**36 states not individually covered** — all unmapped states exercise the same code path; `CO`, `OR`, `NV`, and `MT` serve as representative samples.

### Charge types covered

| Keyword bucket | Sample charges tested | Consequence category verified |
|---|---|---|
| `dui` | `dui`, `driving under the influence`, `dwi` | `drivers_license` |
| `assault` | `assault`, `assault and battery` | `firearms` (felony/DV qualifier) |
| `drug` | `drug possession`, `possession of a controlled substance` | `benefits` |
| `theft` | `theft`, `grand theft auto`, `shoplifting` | `background_check` |
| `domestic` | `domestic violence`, `spousal assault` | `firearms` (Lautenberg) |
| `fraud` | `wire fraud`, `mail fraud`, `embezzlement` | `employment` |
| `burglary` | `burglary`, `breaking and entering` | `housing` |
| `traffic` | `reckless driving` | `drivers_license` |
| `weapons` | `carrying a concealed gun`, `carrying a firearm without a permit`, `armed robbery` | `firearms` |
| `default` | `trespassing`, `vandalism`, `disorderly conduct`, `harassment` | uncertainty notice |

### Case stages covered

| Stage | Scenarios | Notes |
|---|---|---|
| `arrest` | ~30 | Deadline + alert + consequence scenarios |
| `arraignment` | ~40 | Deadline + DUI + charge coverage |
| `pretrial` | 1 | immediateActions non-empty |
| `trial` | 1 | immediateActions non-empty |

### Background flags covered

| Flag | Tested values | Consequence verified |
|---|---|---|
| `citizenshipStatus` | `citizen`, `non_citizen`, omitted | `immigration` present/absent/uncertainty |
| `hasMinorChildren` | `true`, `false`, `null` | `custody` present/absent/uncertainty |
| `hasProfessionalLicense` | `true`, `false`, `null` | `employment` present/uncertainty |
| `hasHousingAssistance` | `true`, `false`, `null` | `housing` present/absent/uncertainty |
| `supervisionStatus` | `parole`, `probation`, `none`, omitted | `supervision_revocation` present/absent/uncertainty |

---

## What each priority group tests

### Priority 1 — Deadline accuracy (P1-01 through P1-52)
- **Mapped jurisdictions (CA, TX, NY, FL, IL, PA, WA, OH, GA, AZ, NJ, MI, NC, VA):** Each arraignment deadline string matches the constant in `jurisdictionRules` exactly (substring match).  Weekend caveat in CA is specifically tested (`'72 hours'`).
- **Mapped jurisdictions:** Discovery and preliminary hearing deadlines are present at arraignment stage.
- **Mapped jurisdictions:** No deadline has `isEstimate: true` — the engine should treat mapped rules as authoritative.
- **Unmapped states (CO, OR, NV, MT):** At least one deadline has `isEstimate: true`, and the `Jurisdiction-Specific Deadlines` uncertainty notice fires.
- **DUI × CA:** `immediateActions` contains the DMV hearing window text, including the `'10 days'` window.
- **Federal:** Arraignment deadline timeframe contains `'Without unnecessary delay'`.

### Priority 2 — Collateral consequences (P2-01 through P2-26)
- **Flag-driven consequences:** Each `CaseData` flag (`citizenshipStatus`, `hasMinorChildren`, `hasProfessionalLicense`, `hasHousingAssistance`, `supervisionStatus`) is individually toggled to confirm the consequence category appears when the flag is set and is absent when it is not.
- **Charge-specific consequences:** Each entry in `CHARGE_CONSEQUENCE_MAP` is exercised at least once with a representative charge string.  DUI → `drivers_license`, domestic → `firearms` (Lautenberg), weapons → `firearms` (felony prohibition), fraud → `employment`, burglary → `housing`, traffic → `drivers_license`, theft → `background_check`, drug → `benefits`, assault → `firearms`.
- **Combined scenarios:** Multiple flags set simultaneously confirm that all expected categories are present and none are deduplicated incorrectly.

### Priority 3 — Critical alerts and charge coverage (P3-01 through P3-35)
- **Arraignment deadline alert:** `arrest + detained` triggers the arraignment deadline text in `criticalAlerts` for CA, NY, and an unmapped state.
- **Public defender prompt:** `hasAttorney=false + arrest/arraignment` triggers a `'public defender'` keyword in `criticalAlerts`.
- **Right to silence:** `arrest` stage includes right to silence in `criticalAlerts`.
- **Default charge bucket:** Charges that don't match any keyword group (trespassing, vandalism, disorderly conduct, harassment) fire the `'Charge-Specific Guidance Not Available'` uncertainty notice and still produce non-empty `immediateActions`.
- **All keyword groups:** Each of the 9 mapped charge groups (`dui`, `assault`, `drug`, `theft`, `domestic`, `fraud`, `burglary`, `traffic`, `weapons`) and multiple secondary keyword samples produce non-empty `immediateActions` and at least one collateral consequence.
- **Missing background fields:** Each nullable background field omitted or set to `null` fires the corresponding uncertainty area (`Probation / Parole Status`, `Immigration Consequences`, `Minor Children / Custody Risk`, `Professional License`, `Public / Subsidized Housing`).

---

## Rule-change regression detection

### How the feedback loop works

The P1 deadline scenarios are the **authoritative source of truth** for what the engine should output for each mapped jurisdiction.  Each scenario's `deadlineTimeframeKeywords` is a verbatim substring of the corresponding `jurisdictionRules` constant in `server/services/guidance-engine.ts`.

This means:

> **Changing a `jurisdictionRules` value MUST cause the corresponding P1 scenario to fail.**

For example, if `jurisdictionRules.IL.arraignmentDeadline` is updated from `"Within 48 hours"` to `"Within 24 hours"`, scenario `P1-23` (which asserts `deadlineTimeframeKeywords: ['48 hours']`) will fail immediately on the next `npx vitest run`.  The failure surfaces the discrepancy before it reaches users.

### Canary tests

`tests/evals-harness.test.ts` contains a dedicated `describe('Canary — P1 deadline scenarios catch rule-constant changes', ...)` block that provides an extra layer of protection for two representative jurisdictions (IL and NY):

| Canary test | Jurisdiction | Canonical keyword | Corresponding P1 scenario |
|---|---|---|---|
| IL arraignment keyword present | IL | `"48 hours"` | P1-23 |
| IL arraignment sensitivity (wrong keyword absent) | IL | `"24 hours"` must be absent alone | P1-23 |
| NY arraignment keyword present | NY | `"24 hours"` | P1-07 |

These canary tests fail alongside the matching P1 scenario whenever the rule constant changes, making the regression doubly visible in CI output.

### Procedure when updating a `jurisdictionRules` value

1. Update the constant in `server/services/guidance-engine.ts`.
2. Run `npx vitest run tests/evals-harness.test.ts`.
3. Failing P1 scenarios identify every scenario whose `deadlineTimeframeKeywords` no longer matches — update those keywords to the new string.
4. If the changed jurisdiction is IL or NY, update the `canonicalKeyword` / `wrongKeyword` values in the canary block as well.
5. Obtain attorney review of the updated rule text.
6. Re-run `npx vitest run` to confirm all scenarios pass before merging.

### Why the scenarios are the source of truth (not the rule constants)

The scenarios were written by engineers reading the rule constants, but they will be reviewed by attorneys before launch.  After attorney review, the scenario expected values become the canonical statement of correct behaviour.  If a rule constant ever diverges from a scenario expected value, the *scenario* (attorney-reviewed) wins — the rule constant must be corrected and the attorney re-consulted.

---

## Known gaps

### Jurisdictions not individually covered
- 41 of 50 states plus DC and territories are covered only by the shared "unmapped state" code path.  The harness verifies the `isEstimate` flag and uncertainty notice fire, but does not verify the *actual deadline text* for those states because the engine uses `federal` defaults.
- **Recommended follow-up:** Expand `jurisdictionRules` for additional states beyond the current 14 mapped (CA, TX, NY, FL, IL, PA, WA, OH, GA, AZ, NJ, MI, NC, VA) and add deadline-accuracy scenarios for each.

### Case stages not fully exercised
- `pretrial` and `trial` stages are each covered by a single "non-empty `immediateActions`" scenario.  The deadline logic for those stages (discovery and trial deadlines) is not individually verified per jurisdiction.

### Multi-charge input
- All scenarios supply a single charge string.  The engine supports `charges` as an array.  The eval harness does not include scenarios with multiple simultaneous charges.

### Firearm consequence for misdemeanor assault
- P2-14 confirms `assault` → `firearms` consequence appears, but the engine's `CHARGE_CONSEQUENCE_MAP.assault` applies to "certain assault convictions — particularly felonies or offenses involving domestic partners."  The harness does not verify the consequence text distinguishes between felony and misdemeanor assault paths.

### Attorney review status
- None of the expected values have been verified by a licensed attorney.  Passing scenarios confirm *internal consistency* (the engine does what the rules constants say) but not *external accuracy* (whether the rules constants reflect current law).

---

## How to run

```bash
# Run evals only
npx vitest run tests/evals-harness.test.ts

# Run full test suite (evals included automatically)
npx vitest run
```

No additional configuration or dependencies are required.  The harness uses only `vitest` and the existing `generateEnhancedGuidance` export.
