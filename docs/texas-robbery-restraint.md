# Texas robbery, restraint and jugging

This batch corrects two existing whole-statute robbery choices and adds eleven individually scoped choices. The robbery IDs remain unchanged because their statute identity and ordinary grade were already correct; the older descriptions wrongly implied a weapon was always required. No saved-case reselection is imposed for those IDs. Bank robbery and attempted-robbery holds remain unchanged.

## Priority basis and scope

The retained official 2025 Texas DPS adult-arrest workbook ranks aggravated robbery 52nd (3,188), unlawful restraint 61st (2,497), and robbery 66th (2,198). The total is 7,883 adult arrests, not convictions, unique people, or counts attributable to each of the new subdivisions. The priority extract preserves the workbook provenance and can be reproduced from the retained top-75 inventory. Jugging is an adjacent, newly enacted offense; no annual arrest count is assigned to it here.

| Choice | Conduct citation | Grade/penalty |
| --- | --- | --- |
| Robbery (`tx-robbery-in-the-second-degree`) | Tex. Penal Code § 29.02(a) | Second-degree felony |
| Aggravated robbery (`tx-robbery-in-the-first-degree`) | Tex. Penal Code § 29.03(a) | First-degree felony |
| Unlawful restraint (ordinary adult branch) (`tx-pc-20-02-ordinary`) | Tex. Penal Code § 20.02(a) | Class A misdemeanor |
| Unlawful restraint (child younger than 17) (`tx-pc-20-02-child`) | Tex. Penal Code § 20.02(a) | State jail felony |
| Unlawful restraint (substantial risk of serious bodily injury) (`tx-pc-20-02-risk`) | Tex. Penal Code § 20.02(a) | Third-degree felony |
| Unlawful restraint (public servant with duty connection) (`tx-pc-20-02-public-servant`) | Tex. Penal Code § 20.02(a) | Third-degree felony |
| Unlawful restraint (actor in custody) (`tx-pc-20-02-custody`) | Tex. Penal Code § 20.02(a) | Third-degree felony |
| Unlawful restraint (actor committed to a civil commitment facility) (`tx-pc-20-02-civil`) | Tex. Penal Code § 20.02(a) | Third-degree felony |
| Unlawful restraint (sheriff, constable, municipal officer or DPS officer) (`tx-pc-20-02-peace-officer`) | Tex. Penal Code § 20.02(a) | Second-degree felony |
| Unlawful restraint (judge with duty connection) (`tx-pc-20-02-judge`) | Tex. Penal Code § 20.02(a) | Second-degree felony |
| Jugging (ordinary grade) (`tx-pc-29-04-ordinary`) | Tex. Penal Code § 29.04(a) | State jail felony |
| Jugging (vehicle burglary during the offense) (`tx-pc-29-04-vehicle`) | Tex. Penal Code § 29.04(a) | Third-degree felony |
| Jugging (robbery during the offense) (`tx-pc-29-04-robbery`) | Tex. Penal Code § 29.04(a) | First-degree felony |

## Statutory boundaries

- Robbery retains both the injury and threat/fear alternatives, their different culpability requirements, theft intent and immediate-flight/attempt scope. No completed taking, weapon or property-value threshold is invented. Aggravated robbery retains serious injury, deadly weapon and elderly/disabled alternatives, with its own disability definition. Judge-ordered supervision restrictions are distinguished from jury-recommended eligibility.
- Unlawful restraint includes the statutory definitions of consent, age and acquiescence. For ages 14 through 16, the special geographic alternative requires both leaving Texas and going beyond 120 miles from home. The under-14 relative defense, age-gap/no-force defense and lawful-detention exception remain explicit. Risk, public-servant, actor-custody, civil-commitment, peace-officer and judge grades are separated. Custody is the actor's status, not merely the victim's restraint; an unrelated chapter's custody definition is not silently incorporated.
- Peace-officer status is limited to the common article 2A.001(1)-(4) sheriff, constable, municipal-police/marshal and DPS roles in both published versions. Other officer classes remain outside this bounded choice. Civil-commitment dependencies and public-servant definitions remain required evidence.
- Jugging requires theft-of-money intent, knowing following without substantial route deviation and two or more actual criminal instruments. Ordinary objects do not automatically meet the specially-designed/made/adapted instrument definition. Vehicle burglary and robbery predicates have their own conduct requirements. The provision took effect September 1, 2025 and is not assigned to earlier conduct. Permission to prosecute under both sections is not treated as automatic cumulative punishment.

## Evidence and instructions

The packet retains 31 official sections acquired November 18, 2026, including conduct, grading, definitions, defenses and sentencing dependencies, and binds 156 per-record provisions. All 18 texts overlapping earlier reviewed packets match exactly. Each section includes the exact official URL, acquisition time, effective-date metadata, text hash, snapshot hash and chapter hash. These are new candidate observations; no existing receipt is changed or renewed. The oldest historical effective date on a section is not a claim that every later amendment was operative then; affected conduct must be evaluated under the version applicable to its date.

Publisher-verified links are CPJC 29.2 for robbery by threat, 29.3 for aggravated robbery by serious injury, and 20.7 for restraint by force, intimidation or deception. Labels explicitly limit those instruction theories. They do not certify other robbery alternatives, child-acquiescence restraint, or special grading instructions. No verified jugging instruction is displayed; this does not assert that none exists. Publisher pages were checked directly on November 18, 2026; no copyrighted instruction text is reproduced in the packet.

All summaries use the reviewed English content. Non-English requests show the explicit English-content notice rather than mislabeling it as a translation.

## Offline accounting and verification

Relative to PR260: 320 to 331 configured Texas IDs; 245 to 256 eligible with all required evidence; 75 held identities unchanged. The seed builder produces 178 source keys and 2,282 per-record snapshot/links. Two existing robbery records are replaced in place; the other 318 prior manifest records and manifest generation timestamp are unchanged. These offline figures do not establish production availability. No database operation, import, activation, deployment or receipt renewal is part of this change.

Reproduction: `npx tsx scripts/data-review/texas-verification/replay-assault-intoxication.ts robbery-restraint` emits the thirteen manifest records from the committed evidence through the actual importer record builder. Tests compare them exactly with the committed manifest, reject missing or changed evidence, validate every role binding, verify retained statutory conditions, preserve saved robbery IDs and check honest language fallbacks. The required-link eligibility test covers every new record.

Validation: 179 focused Texas, instruction, source-inventory, explanation and PDF tests passed; six database integration checks were deliberately skipped. Typecheck and production build passed. All 16 isolated built-selector checks passed. The built selector test checks each choice's exact name, code, description, penalty and category and verifies unique robbery IDs and retained holds. PR260 is merged; this draft integrates exact main `7ac4e595` including its public-servant grading clarification, and targets main directly. No active release pin is changed.

The public-servant restraint summary and penalty explicitly preserve §20.02(c)(3) second-degree grading for any legally qualifying peace officer/judge with the required knowledge and duty/retaliation connection, even if the narrower officer selector does not offer that role. The comparison is supported by retained §12.33; no additional role is cleared. Publisher editions 048 and 055 were directly compared for CPJC20.7,29.2 and29.3; the instruction bodies match, and all three links now use edition055. Retained statutory evidence and all acquisition/manifest dates remain unchanged.
