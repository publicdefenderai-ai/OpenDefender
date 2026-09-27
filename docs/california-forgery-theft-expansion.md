# California forgery, theft and receiving expansion

This batch adds 28 exact charge choices from 20 primary sections. Together with PR #20's merged person/property batch, California has 153 configured selectable identities (previously 125). These are repository counts; Replit source seeding and deployment still determine what users can select live.

The additions include the three possession-for-forgery branches in §475, fictitious payment instruments, access-card forgery and retailer fraud, construction-fund diversion, lost-property theft, automotive and retail property held for resale, receiving a stolen vehicle, and temporary bicycle/vessel or aircraft taking. They preserve different charging identities and penalties rather than mapping all of them to generic theft or forgery.

## Review entry points

Read the [combined review packet](../scripts/data-review/output/california-forgery-theft-review.md) for each charge, its penalty, official link, dependencies and complete successor queue. The [current coverage report](../scripts/data-review/output/california-expanded-catalog-coverage.md) gives aggregate catalog and evidence counts. The JSON files retain public statutory evidence and authored review bindings; they contain no private cases or user records.

Particular distinctions to inspect:

- §484b uses the current source's $2,350 construction-fund threshold, not ordinary theft's $950. The lower branch uses the default misdemeanor punishment; the higher branch carries its own alternatives and fine.
- §§484h(a)/(b) use their own consecutive-six-month aggregation rules. §§496.5/496.6 use different resale and aggregation requirements.
- §473(b)'s mandatory misdemeanor treatment is limited to listed instruments and value, with prior-conviction and simultaneous identity-theft exceptions. It is not a rule for every forgery.
- §496d has distinct property definitions and does not automatically inherit §496(a)'s $950 misdemeanor rule. The source dependencies include Harbors and Navigation Code §21 as well as Vehicle Code definitions; §666.5 is retained for specified prior convictions.
- §483.5(a)'s criminal route requires the additional fraudulent-use knowledge condition in subdivision (f). The device offense in subdivision (b) is a different misdemeanor branch.
- §499d's felony wording does not erase its alternate misdemeanor sentencing route. Ordinary §499b bicycle/vessel offenses retain misdemeanor categories, with prior-conviction consequences explained separately.

## Efficiency and evidence boundaries

This batch reuses 98 retained sections and adds only seven dependency sections, all from the same hash-verified official archive acquired September 24. Total retained California research evidence is now 297 sections / 300 versions. Offline replay is not a currentness refresh. Unknown effective dates remain null.

A small shared addition registry projects both batches into the catalog, explanations and source seed while keeping each batch's authored definitions and evidence bindings separate. Every new identity is checked against its content hash, primary excerpt, dependency versions and effective dates. Selection remains withheld if the required source links have not been seeded. English content carries an explicit unavailable-translation notice in Spanish and Chinese; reviewed translations remain open work.

The independent instruction cross-check is deliberately limited: official CALCRIM index entries confirm several distinct charging identities, and instruction 1933 confirms the counterfeiting-equipment knowledge requirement. The older edition is not being represented as a comprehensive current instruction or case-law audit. The review notes also link the official Orozco opinion supporting the §496d distinction.

## What remains

All 79 sections left open by the prior batch have successor dispositions. Twenty now support these additions; 59 remain substantive research. Neither result declares every subdivision or theory of a source section complete. §484e access-card theft remains open for its own valuation analysis, including Romanowski, rather than inheriting the forgery rules.

The earlier low-priority infraction deferral and three specific attorney questions remain unchanged. No new attorney data-entry assignment is needed for this batch. Next, combine the remaining specialized theft/financial sections and protected-victim assault/battery groups, then continue the other Penal Code and priority code families. Statewide completeness and a defensible offense denominator have not yet been established.

## Validation and release

Replay acquisition with `python3 scripts/data-review/california-verification/acquire-forgery-theft.py`, then run the forgery/theft review and coverage TypeScript entry points using `node --import tsx`. The catalog guard checks every new ID, including its English fallback flag. Tests also check distinct thresholds, source bindings, complete queue accounting and rejection of a wrong-code vessel dependency.

After review and merge, use the normal Replit source seed/republication process and verify live selection and guidance. No production seed, deployment, real case input or external AI request was performed during this batch. GitHub's existing npm-installation failure is separate and is not fixed here.

Validation result: 154 targeted tests passed, with two existing opt-in tests skipped. Typecheck and production build passed. Six combined browser/API checks passed; three new-batch checks were repeated against the final rebuilt artifact. The acquisition replay was byte-identical.
