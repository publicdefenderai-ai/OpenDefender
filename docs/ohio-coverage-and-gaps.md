# Ohio coverage and remaining gaps

This is a bounded handoff, not certification that Ohio's criminal-charge inventory is complete. Counts below describe repository configuration and source evidence; deployed availability must be checked after merge, source refresh and deployment.

## What this delivery changes

Four established source-based records receive supported adult sentencing limits, clearer exceptions and corresponding English, Spanish and Chinese explanations: littering (§3767.32), open container (§4301.62), false information to obtain alcohol for an under-21 person (§4301.633), and animal cruelty (§959.13). Source identities and saved canonical IDs remain stable.

Six older IDs require explicit reselection: `oh-littering`, `oh-open-container`, `oh-alcohol-in-park`, `oh-animal-cruelty-misdemeanor`, `oh-illegal-fireworks`, and `oh-minor-in-possession`. No saved case is automatically assigned a different statute. “Alcohol in Park” is not automatically treated as the state open-container offense.

Additional sentencing and definition sources must be present in the deployed seed before the corrected records become selectable. Receipt expiry or a changed correction invalidates availability. Full official source text stays server-side.

## Deliberate gaps

| Area | Treatment | What would resolve it |
| --- | --- | --- |
| Fireworks §3743.65(B)/(G)/(H) | Keep older broad ID and existing descriptive draft unavailable | Explicit scoped identity review, then licensing/safety-rule applicability and subsection-specific guidance validation; the whole-section catchline must not disguise a narrower record |
| Underage alcohol §4301.69(E)(1) | Keep the older ID and descriptive draft unavailable | Explicit subsection identity review and validation of age, juvenile/adult procedure and diversion wording; do not repurpose the entire section into an E(1) record |
| Changed sources | Exclude affected records in the source-change hold ledger | Compare amended text, review effects on dependent charges, then approve new evidence and refresh |
| Funeral protests §3767.30 | Exclude severed procession branch; retain corporate-grading hold | Subsequent-treatment/injunction verification and any needed actor-specific authority |
| Liquor §4301.21(D) cross-reference | Preserve literal reference; record C(8) as likely interpretation | Legislative-history investigation; no silent correction |
| Liquor-injunction contempt §4301.74 | Preserve classification; no assumed ordinary misdemeanor route | Validate simple scenario-based guidance and applicable procedural sources |
| Animal provisions §§959.12/.17 | Shared M4 list interpretation approved | Remaining offense review and publication checks |
| Animal fighting §959.15(B)/(C) | Unclassified felony; express fine; incarceration unresolved | Controlling sentencing authority or reviewed uncertainty treatment; never promise no incarceration |
| Railroad §5589.211 | Enforceability unresolved; unavailable in active guidance | Authority addressing this provision or a supported preemption analysis |
| §§4301.15/.691/.70 | Agent-owned research holds | Actual scarcity rule, activation evidence, or underlying duty, respectively |

The [source-change hold ledger](../shared/ohio-source-change-holds.json) records affected IDs. The [statutory source-anomaly inventory](statutory-source-anomalies.md) separately records apparent errors in official text. A legislative amendment is a source change, not a statutory error.

## Coverage accounting

The discovery snapshot accounts for 33,320 sections. These are statutory sections, not 33,320 offenses. Its categories include supporting law, prohibition candidates, unresolved penalty scopes and ranges. The 51-section verification batch is substantive research, not 51 published charges.

The historical reviewed catalog contains 125 drafts: 105 originally eligible and 20 held for identity or other issues. The deployment configuration previously admitted 134 Ohio records across the reviewed batch and earlier pilots. The observed §1509.01 change reduces the current configured number to 133; the held record is criminal trespass. The current 238-row deployment manifest preserves 105 older identities requiring reselection and 133 configured selectable records. Criminal trespass is excluded following the observed §1509.01 amendment. The 20 historical descriptive drafts remain separately held. These populations overlap and must not be added together as distinct crimes.

The original discovery backlog remains in [the discovery investigation](../scripts/data-review/output/ohio-discovery-investigation.json), including 68 remaining legacy rows and 87 scheduled repeals for monitoring. These are overlapping research populations, not counts of verified offenses. Source age and known transitions can require earlier review than the normal refresh interval.

## Validation and rollout

- Typecheck and production build pass.
- All 281 Ohio/release-harness tests pass across 31 files. The additional final correction/transparency checks pass (22 tests across three files; these overlap the focused total).
- Both production smoke tests pass: exact-citation search and corrected penalty delivery, rules guidance, rejection of six saved legacy IDs, and open-container selection in the rendered screener. The UI test simulates AI-service availability only; it uses the actual charge API and does not test live model output.
- A full repository run found 22 failing tests and four additional suite-loading failures outside this delivery after correcting the aggregate count affected by the new hold. The same failures reproduced in an unchanged HEAD checkout across eight test files. They include missing local database/AI configuration, a sandboxed subprocess limitation, and the existing Florida jury-instruction coverage assertion. Do not describe the entire repository suite as green.
- A direct comparison checked 172 statute dependencies: 171 were unchanged and §1509.01 changed. The administrative rule 3701-12-01 also matched its pin. After the criminal-trespass hold, the active reviewed receipt covers 170 distinct documents and expires **2026-10-01T21:11:44.566Z**. The separate pilot receipt has its own expiry; both must be valid at rollout.

After independent review and merge, Replit must pull the commit, build and run the normal Ohio source seed during deployment. No real database was seeded by this task. Check the four corrected charges and the holds against the deployed API before calling this delivery live. A later receipt refresh must fetch changed/stale sources; never edit timestamps to bypass the boundary.

## GitHub CI installation fix requires Replit application

The repository token intentionally cannot edit GitHub Actions workflows. GitHub rejected the attempted workflow update. The application PR preserves that access restriction and includes [the proposed CI patch](ohio-ci-install-fix.patch) as a reviewable artifact, without changing the active workflow.

In Replit, ask its agent: “Apply docs/ohio-ci-install-fix.patch to .github/workflows/regression-tests.yml, review the diff, then commit and push that workflow change using Replit's existing authorized GitHub connection.” The patch switches the regression jobs to Node 24 and verifies that Vitest and Playwright were actually installed. Remote installation success remains unverified until that workflow change is applied. It does not resolve the separately documented baseline test failures.

## Exit criteria and next-state workflow

Move to another state after independent review and merge of this bounded implementation, a successful deployment/source seed, and a smoke check of search and guidance. Unresolved candidates stay unavailable with specific reasons. No statewide completeness claim is required or justified.

For the next state, select a bounded set of commonly encountered charges first. Acquire primary law and shared dependencies together, preserve exact citations and source versions, review exceptions and sentencing, and deliver search/guidance examples in the same batch. Escalate only concrete legal judgments to the attorney. Record unresolved candidates instead of expanding infrastructure indefinitely. Measure usable reviewed records and attorney decisions per batch, not extracted section counts.
