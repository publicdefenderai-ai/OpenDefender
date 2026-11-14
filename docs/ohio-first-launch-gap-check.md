# Ohio first-launch gap check

On November 13, 2026 at 9:11:40 p.m. Pacific, the public Ohio selector returned seven choices. **None of the original 22 priority IDs appeared.** GitHub main at `a3c970a1` has all 22 configured with their expected individual citations, source families and hash-verified primary text. The public response and the current repository disagree even on the seven returned IDs: all seven fall outside the reviewed identity gate in this revision.

| Original lookup | Reviewed identities checked | Public exact matches |
| --- | ---: | ---: |
| Assault, including the negligent and aggravated variants | 4 | 0 |
| Domestic violence, physical harm, reckless serious harm and threat | 3 | 0 |
| Theft | 1 | 0 |
| Impaired driving | 3 | 0 |
| Drug possession | 9 | 0 |
| Extortion and sexual extortion | 2 | 0 |

The attached observation lists all 22 IDs and codes from the November 11 benchmark. Of these, three assault entries use the separately controlled Chapter 2903 pilot. Source support for any of the 22 does not prove a production approval. The public status endpoint reported 134 linked, 10 selectable, 259 sources and 259 current snapshots one second after the selector capture. Its most recent completed import was October 27. The 10 reported by status cannot identify any additional choices. No deployed commit or database contents were inspected.

## What users could actually select

The seven Ohio results were legacy rape, gross sexual imposition, aggravated robbery, robbery, disorderly conduct, domestic violence and criminal trespass. The captured names, codes and penalty wording are retained for comparison. The generic domestic-violence choice is already retired in main and requires saved-user reselection. The six other legacy identities remain in static catalog data but fail main's reviewed-identity selector condition. Generic criminal trespass is distinct from the held reviewed ID. The public legacy wording cannot clear that hold. **Until production is reconciled, the public legacy penalties for gross sexual imposition and aggravated robbery still describe possible life imprisonment without the reviewed branch distinctions.**

## Previous gaps and holds

The earlier seven-section priority queue now has 28 configured reviewed choices. The public response contains zero of these exact IDs. The numbers below describe reviewed branches rather than all possible factual applications.

| Sections | Individually bound choices |
| --- | --- |
| 2907.06, 2907.07, 2907.08 | 1 sexual imposition, 8 importuning, 4 voyeurism |
| 2923.15, 2923.16 | 1 weapons-under-the-influence, 10 vehicle-firearm branches |
| 2925.12, 2925.22 | 1 drug-abuse-instrument, 3 deception-to-obtain-drugs branches |

All 20 identities held in the original Ohio eligibility ledger, plus the separate § 1509.01 dependency hold for reviewed criminal trespass, remain outside the reviewed selector set and the captured public response. Other unresolved provisions retain their existing dispositions, including child enticement under § 2905.05 and predicate-dependent terrorism grading under § 2909.24. Neither is a substitute for a missing priority match. The check counts 534 configured reviewed identities across all families; the existing deployment fixture separately asserts 649 stored catalog rows and 540 eligible IDs under its test conditions. None is a statewide denominator.

## Next actions

1. **Reconcile deployment before announcing Ohio launch.** Replit can first compare the served revision, completed import and exact source links to merged main, then identify which families meet their own verification prerequisite. Review the three pilot assault IDs separately. After separately approved operational changes, repeat the complete public lookup: verify exact IDs, correct branch penalties and saved-ID reselection. Keep § 1509.01 and all original holds in place. If a reviewed choice stays unavailable, record its specific missing prerequisite.
2. **Prioritize the stopped-school-bus charge at § 4511.75(A).** The ten-foot stop duty and the opposite-direction four-lane exception matter. Section (F)(1) expressly supplies a fine up to $500 and requires appearance in person; (F)(2) permits a class-seven suspension. The general minor-misdemeanor fine threshold and the default traffic penalty do not supply a supported classification for this choice. Resolve classification from controlling authority before configuring it. [Ohio § 4511.75](https://codes.ohio.gov/ohio-revised-code/section-4511.75) · [Ohio § 2901.02](https://codes.ohio.gov/ohio-revised-code/section-2901.02) · [Ohio § 4511.99](https://codes.ohio.gov/ohio-revised-code/section-4511.99)
3. **Treat § 2913.41 as evidence in a theft prosecution.** Its operative introduction makes the listed circumstances prima-facie evidence of purpose to defraud in a qualifying rental or lodging theft prosecution. The heading alone suggested a missing offense; no independent charge or penalty is warranted from this section. Consider it as context when improving the existing theft guidance. [Ohio § 2913.41](https://codes.ohio.gov/ohio-revised-code/section-2913.41)

The original benchmark is deliberately bounded. These checks do not measure filing frequencies or establish statewide completeness. To verify locally, run `node --import tsx scripts/data-review/check-ohio-first-launch.ts` from the repository root. It reads the recorded public observation and repository evidence offline, prints each priority ID and its primary hash, and rejects a missing reviewed binding, changed primary hash, duplicate captured ID or exposed held identity. New public observations require a fresh, complete selector response and separate status capture.
