# Ohio priority coverage and public availability

On November 11, 2026 at 06:07:44 UTC, the published Ohio selector returned **7 choices across the complete result set**. None carried one of the **276 individually reviewed IDs** on GitHub main `078c9d1b`. The public status endpoint reported 10 selectable, 134 linked, 259 sources and 259 current snapshots, with the last completed import on October 27. The seven returned IDs are what a user could select at the check. The status endpoint does not identify the other three.

The repository has 391 raw Ohio catalog IDs, including 372 configured choices. Of those, 276 belong to the 11 individually reviewed source families; the other 96 configured choices are outside that set. All 11 filesystem receipts passed their applicable validators at the observation time, including the three November renewals. This does not establish a production import, deployed revision or shared pilot approval.

## Six priority lookups

These are practical priorities based on the consequences of getting the charge wrong and the reported availability problem. They are not a court-filing frequency study or an estimate of statewide completeness.

| Family | Reviewed identity and scope | Reviewed IDs on main | Reviewed IDs returned publicly |
| --- | --- | ---: | ---: |
| Assault | §§2903.11/.12/.13/.14: felonious, aggravated, assault and negligent assault. The first, second and fourth use the pilot gate; §2903.13 uses the separate reviewed gate. | 4 | 0 |
| Domestic violence | §2919.25(A), (B), (C): physical harm/attempt, reckless serious harm, threat of force. Different ordinary grades and prior/pregnancy rules. | 3 | 0; one retired generic ID returned |
| Theft | §2913.02: a reviewed theft choice with value-, victim- and property-dependent grades. A shoplifting or embezzlement label does not establish a separate statutory offense. | 1 | 0 |
| Impaired driving | §4511.19(A)(1)(a)–(i)/(A)(2), (A)(1)(j) and (B): ordinary/listed-substance/underage branches. | 3 | 0 |
| Drug possession | §2925.11: nine distinct statutory substance-based identities, including aggravated, cocaine, heroin and fentanyl-related compound possession. Amount, schedule, lawful exceptions and offense date matter. | 9 | 0 |
| Extortion | §2905.11: extortion and sexual extortion are two distinct, reviewed residual-family choices. | 2 | 0 |

**22 reviewed choices, zero publicly returned by exact ID.** The JSON inventory lists each exact ID, its family and its citation; it also lists all 276 reviewed choices. A primary section match does not show that the same conduct, grading or exceptions were delivered.

## Inspect the seven exposed legacy choices first

| Live ID | What the public response actually says or omits | Action |
| --- | --- | --- |
| `oh-sexual-assault-in-the-third-degree` | Gross sexual imposition; the penalty field says life is possible if the victim is under 13. Section 2907.05(C) assigns F4/F3 by branch and directs the specified mandatory term to a definite F3 schedule. Age alone does not support the displayed life claim. | Prioritize withholding or correcting the legacy text and exposing the reviewed gross-sexual-imposition record. [Official statute](https://codes.ohio.gov/ohio-revised-code/section-2907.05) |
| `oh-robbery-in-the-first-degree` | Aggravated robbery; the penalty field presents life imprisonment without conditions. Section 2911.01(C) classifies the offense as F1. Its ordinary sentencing rules do not state that generic life maximum. | Verify the reviewed F1 record's eligibility and remove the misleading legacy alternative. [Offense](https://codes.ohio.gov/ohio-revised-code/section-2911.01) · [Sentencing](https://codes.ohio.gov/ohio-revised-code/section-2929.14) |
| `oh-robbery-in-the-second-degree` | Robbery; the penalty field gives a generic 20 years. Section 2911.02(B) distinguishes F2 under (A)(1)/(2) and F3 under (A)(3). | Replace the generic estimate with the reviewed branch-sensitive choice. [Official statute](https://codes.ohio.gov/ohio-revised-code/section-2911.02) |
| `oh-rape-in-the-first-degree` | Rape; the legacy summary mentions 11 years and a prior-offense life caveat. The reviewed §2907.02 record addresses additional specific mandatory/life/juvenile provisions. | Expose the reviewed choice and reconcile the legacy record, including the applicable offense-date sentencing rule. [Official statute](https://codes.ohio.gov/ohio-revised-code/section-2907.02) |
| `oh-disorderly-conduct` | Says penalties vary by jurisdiction. Section 2917.11(E) specifies the ordinary minor misdemeanor and listed M4 exceptions. | Use the reviewed Ohio record. [Official statute](https://codes.ohio.gov/ohio-revised-code/section-2917.11) |
| `oh-domestic-violence` | Gives only the M1 first-offense penalty and describes physical harm. Main already requires reselection of this ID. | Verify the deployed revision and return the three reviewed choices including the M4 threat branch. Preserve saved-user reselection. [Official statute](https://codes.ohio.gov/ohio-revised-code/section-2919.25) |
| `oh-criminal-trespass` | Gives M4 and cites §2911.21 as a whole. The returned code does not limit the choice to (A)(1)–(4). Under (D)(1), (A)(5) is M1; (D)(2) also requires a special fine when specified vehicles are used. | The separate source-first ID remains held because (F)(3) incorporates §1509.01. The live generic ID does not demonstrate a separate reviewed M4 branch. Reconcile it before relying on it; the hold remains in force. [Official statute](https://codes.ohio.gov/ohio-revised-code/section-2911.21) |

## Next work in parallel

1. **Production reconciliation.** Replit can compare the deployed SHA, returned IDs and actual record-to-source links against this inventory. Start with the seven rows above and the 22 priority IDs. Check the pilot's shared approval separately. Neither expiry nor local code alone explains all absences. Return a read-only list of concrete missing links, deployed-ID discrepancies and gated IDs before any approval for changes.
2. **New legal coverage.** Seven discovery sections have zero raw, reviewed or public IDs, even after checking all current families. First batch: sexual imposition, importuning and voyeurism (§§2907.06/.07/.08). In parallel or next: using weapons while intoxicated and improperly handling firearms in a motor vehicle (§§2923.15/.16); possessing drug abuse instruments and deception to obtain a dangerous drug (§§2925.12/.22). These are leads for individual conduct, grade, exception and penalty review. The old discovery frontier alone cannot clear them.
3. **Acceptance check.** After separately approved remediation, page through the public selector, match all expected IDs and confirm specific branch penalties and saved-ID behavior. A count from status, a receipt passing locally or a shared citation is insufficient. No action in this inventory alters the existing legal or operational holds.

## Reproduce

`node --import tsx scripts/data-review/ohio-priority-availability.ts --check` rebuilds the inventory from repository data and its stored public observation, without a network request. To collect a new observation explicitly, run the same command with `--capture`. This queries only the unauthenticated Ohio selector and source-status endpoints; public observation time, IDs and counts may change.
