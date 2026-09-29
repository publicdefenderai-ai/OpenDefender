# California practical completion plan

Updated September 29, 2026. The target is dependable coverage of important charges, with an honest omission inventory. It is not a claim that every criminally enforceable California provision has been published.

## Present position

PR34 is merged. The registration/exploitation successor proposes 26 choices, bringing the configured catalog to 409: 99 corrected originals and 310 additions. It covers 233 distinct primary sections, with 529 retained publication sections/535 versions including dependencies. PEN 30515 remains held, leaving 408 eligible while the receipt is valid. These are repository counts, not verified production availability; 21 other canonical labels remain withheld.

The new drug packet accounts for 104 candidate identities: 102 Chapter 6 sections plus two independent benchmark probes. Twenty primary sections supply additions, six have earlier catalog entries, 77 remain shared-context or substantive research, and BPC 4326 is absent from the archive. This is an honest research queue, not 77 confirmed missing offenses. No unknown-severity provision is classified as a minor omission.

The latest successor packet accounts for all 40 sections left in the first person/property group: nine supply new choices, four are supporting provisions, one is a low-priority deferral, and 26 remain substantive research. Previously reviewed sections can still have unpublished subdivisions. Neither 40 nor 26 is the remaining statewide workload.

The archive discovery ledger spans 30 codes and records 6,028 sections with criminal-language signals, 3,530 possible penalty targets, and other unresolved/no-signal sections. These overlap legal concepts, definitions, procedure, historical text, and noncriminal rules. They are not missing-charge counts and cannot support a coverage percentage.

## Rough remaining effort

The people/weapons benchmark now makes the next work concrete: 207 instructions across five families, with 43 bounded prior matches, 29 context/defense/allegation entries, one generic weapon template, 29 same-section comparisons still requiring branch review, and 105 entries with no same-section catalog candidate. These entries overlap and are not a count of new charges. There is no defensible statewide percentage yet.

| Next work package | Scope |
| --- | --- |
| Serious violence, abuse and detention | First 28 branches merged in PR32. Carry forward the fine question, kidnapping siblings and elder financial branches. |
| Sexual-offense branches | The first 64 choices are merged; the successor adds 26 registration/exploitation and related branches. Commercial image distribution, special registration duties and custody enforceability remain explicit research holds. |
| Weapons, threats and hate crimes | Combine clear conduct branches where practical; keep prohibited-person predicates, changed-source restrictions and enforceability questions explicit. |
| Justice, public order, property and financial gaps | Missing-charge pass for obstruction, court orders, custody/escape, public order and consequential property/fraud branches. |
| Targeted other-code and final benchmark pass | Check important other-code candidates and complete missing major-family comparisons, including homicide and gangs. Reconcile deployment, maintenance and explicit omissions. |

The earlier 3-6 substantive-batch estimate remains a provisional work-package range, not a deadline. This expanded comparison shows that people/weapons alone merits several substantial publication groups; trying to force every branch into one PR would make legal review harder. Combine shared sources within each group and do not repeatedly reopen low-priority traffic clauses. No new charge or currentness approval results from acquiring this packet.

Earlier consequential holds carry forward: HSC 11395 identity, minor-actor drug branches, BPC 4326 history, unresolved traffic/entrustment questions and PEN 30515. Moving to a new family does not resolve or demote those gaps.

## Independent benchmark and stop conditions

Build a versioned, source-linked crosswalk from the Judicial Council's official [criminal jury instruction resource](https://courts.ca.gov/criminal-jury-instructions-resource-center), plus a public official charging/filing inventory if a usable one is available. Verify the edition and retain it when acquired. Instructions can expose missed offenses and elements; they are not a complete criminal-code inventory or proof of filing frequency. The first retained benchmark now accounts for all 46 entries in the February 2026 drug chapter, with exact catalog matches, partial matches, defenses/context and explicit gaps. The successor adds bounded matches for the 16 formerly unmatched entries, including conditional allegations and the attorney-fee rule within substantive entries. Four minor-actor matches remain partial, HSC 11395 still lacks a standalone entry, and two instructions reference absent BPC 4326. These counts are not an offense denominator or recall score. The benchmark is not yet statewide.

For each major family, map each benchmark identity to a catalog entry, a documented reason it is not a separate selectable charge, or an explicit hold. Compare both citation/subdivision and names a person might see on charging papers. Use reproducible samples from the no-signal ledger and from lower-priority candidates to look for serious misses. Fix serious misses and record unresolved legal questions; do not use a good average score to hide a consequential gap.

We can move to another state when:

1. Every major family above has had a bounded missing-charge pass, with important gaps resolved or specifically held.
2. The independent crosswalk has no unexplained high-consequence omissions. Remaining minor uncertainties have source evidence, a reason, severity, date/reviewer, and a revisit condition. Unknown severity never qualifies as minor.
3. Existing attorney questions and consequential holds remain clearly surfaced. Interpretation questions include the relevant text and a decision needed; routine acquisition and entry remain engineering work.
4. Exact charging identity, category alternatives, penalties, non-English fallback notices, selection, guidance, and PDF behavior pass their checks.
5. The owner has deployed and seeded the reviewed catalog, and a public parity check verifies the expected eligible choices. Freshness monitoring and its notification destination are operational.

Exhaustive coverage of every regulatory misdemeanor, local ordinance, regulation, uncodified enactment, and litigation-dependent enforceability question is a separate maintenance program. It is not a defensible fixed-date milestone for this first release.

## Keeping work efficient and reviewable

Use the statewide ledger to group related sources, retain primary and dependency evidence once, and compare retained versions against a fresh archive instead of downloading per charge. Preserve earlier review packets and add successor accounting. A packet can publish clear branches and retain unresolved siblings without blocking unrelated choices.

Use one shared source packet for multiple related offenses, but keep the charged subdivision, actor, mental state, threshold and penalty separate. Source updates do not silently rewrite historical evidence or extend receipt dates. The first drug batch reused 23 sections and acquired 98 sections/99 versions in one archive pass. Its successor reuses 38 sections and adds one supporting section; all 14 primaries were already available. The independent benchmark is retained once with page hashes. Future groups can reuse both the evidence and the crosswalk accounting.

Legal interpretation, source freshness, and production availability are separate checks. A merge does not establish deployment; a fresh source does not establish its correct interpretation; and a large catalog does not establish statewide completeness.

## Primary-tier convention

California's singular display/count category is the highest explicitly listed category (felony, then misdemeanor, then infraction), independent of JSON array order. The full alternatives and conditional sentencing explanation remain visible. This is not a prediction that an ordinary misdemeanor will be charged as a felony. Direct catalog readers and canonical lookup use the same rule; the public data page discloses it. Historical reviewed arrays are not reordered.

## Reproducing the drug packet

The committed evidence supports offline validation in a fresh clone. Run `node --import tsx scripts/data-review/california-verification/controlled-substances-review.ts` to validate the reviewed definitions, section accounting, source excerpts and independent crosswalk and render its report. Run the coverage script in the same directory to rebuild the aggregate report. The normal Vitest suite invokes Python unittest discovery, including the new benchmark parser tests.

`acquire-controlled-substances.py` replays against the cached original archive and its original receipt; it excludes its own output from reuse accounting so a second run has the same result. `extract-calcrim-benchmark.py` replays against the cached official PDF and its original receipt, using PyMuPDF to extract text. The PDF is deliberately not committed; its receipt, hash and relevant 124 page texts are. Extraction is optional for ordinary validation and CI. A changed edition requires explicit boundary/inventory review, not a new clock on the same bytes. The separate statutory refresh process compares all retained versions and preserves the authentic acquisition time.

For the combined follow-up, run `node --import tsx scripts/data-review/california-verification/drug-successor-review.ts`. The successor binds the prior review hash and preserves every unaffected crosswalk row; it does not overwrite historical gap evidence. Its acquisition replay is `acquire-drug-successor.py`. The prompt-level AI tests use a mocked SDK and fake in-memory test key, requiring no provider credentials or external requests. The AI prompt now carries category alternatives and reviewed penalty conditions, with an explicit prohibition on treating the display tier or a generic prior-conviction answer as proof of felony eligibility.

The California questionnaire now uses the authority-filtered API, matching the other reviewed jurisdictions, so missing authority or a changed source cannot fall back to static choices. Charging-paper aliases reach the API and questionnaire search, and source-first drug IDs join the Drug Offenses filter. Browser checks cover exact subdivisions, alias search, API failure, and the existing changed-source weapon hold.


## Driving and vessels: prepared combined review packet

The next packet retains 215 candidate sections and dependencies across six discovery groups and explicit probes: 40 previously retained sections, 174 newly retained sections (175 versions), and one absent research probe, VEH 23564. The discovery groups are bounded candidate lists, not a claim that every provision of those chapters is included. Acquisition preserves the September 24 archive receipt and does not modify publication pins or extend the October 5 currentness deadline.

The independent comparison now also retains the entire February 2026 CALCRIM vehicle chapter, 30 instructions on 103 physical PDF pages. Four instructions have bounded catalog matches, seven concern context or allegations, and 19 expose unpublished branches requiring substantive review. Instructions overlap; those 19 entries are not 19 distinct new charges or a statewide completeness denominator.

Review 38 priority statutes in seven shared-source groups: injury DUI and omitted DUI branches; hit-and-run; evasion; suspended-license and court duties; reckless driving and street racing; vessels; and vehicle identification/chop shops. Remaining candidates stay visible without being downgraded to minor offenses. Vessel offenses and commercial-driving branches that lack their own instruction heading remain in the statutory queue.

Run `node --import tsx scripts/data-review/california-verification/driving-vessels-review.ts` to validate sources and regenerate the crosswalk and readable review order. `acquire-driving-vessels.py` and `extract-driving-benchmark.py` replay from the already retained archive/PDF with their original receipts. The ordinary tests validate committed evidence offline, including Python parser tests through the existing Vitest wrapper. This packet adds no selectable charges yet; publication requires subdivision, penalty, exception, translation-status and currentness checks for each proposed choice.


## Driving and vessel publication: first combined batch

The successor proposes 21 choices: six evasion branches, three driver hit-and-run branches, four vessel-manslaughter branches, four vessel DUI branches, two impaired-charter-crew branches, and two vessel accident-duty branches. These share 11 primary sections and 31 total dependencies. Seventeen research sections graduate to monitored publication evidence, 13 dependencies were already retained, and VEH 12810 is newly acquired for the traffic-point predicate. Only dependencies actually used by published choices are added to pins; the broader research packet remains a research inventory.

The unchanged-source comparison now covers 421 sections/425 versions. PEN 30515 remains the sole changed source; the original acquisition and October 5 expiry are preserved. Currentness and deployment remain separate from substantive review.

Run `node --import tsx scripts/data-review/california-verification/driving-publication-review.ts` to validate definitions, primary excerpts, all dependencies and the successor instruction accounting. `acquire-driving-publication.py` replays the dependency acquisition. The previous research packet is preserved; five previously unpublished instruction entries now have bounded matches, while nondriving-owner duties, injury DUI, omitted DUI branches, licensing, racing and vehicle identification remain open.

Two research labels require care: PEN 193.8 concerns entrusting a vehicle to an intoxicated minor, not vessel-manslaughter punishment (which is in PEN 193.5); PEN 499 concerns specified recidivist 499b conduct, not a generic vessel-taking offense. Neither has been published by analogy. HNC 655(e)'s addiction-status branch and treatment exception also remain open. None of these is dismissed as a minor charge.

Next publication group: combine injury DUI and omitted DUI branches with suspended-license/court duties and injury reckless-driving/racing where shared sentencing sources permit. Keep vehicle-identification and remaining vessel/owner duties in the explicit queue. The existing 3-6 substantive-batch planning range is not reduced merely because part of one family is published.


## Traffic successor: DUI, licensing and racing

Twenty-four proposed choices cover six injury-DUI branches, two commercial/passenger BAC branches, six suspended/restricted-license branches, three injury reckless-driving branches, five racing/exhibition branches, license presentation and willful traffic failure to appear. Thirty dependencies are reused; 29 additional publication sections (31 versions) are retained, including 16 promoted research sections. The archive comparison confirms 449 unchanged sections and the existing PEN 30515 hold; the original receipt date and expiry are preserved.

The statutory infraction alternatives for VEH 14601.1, 23109(c), and 40508 remain distinct from neighboring misdemeanor provisions. The review separates ordinary custody and mandatory fines from probation alternatives, and does not infer felony eligibility from a generic prior conviction. CA-006 records an apparent subdivision-reference error without rewriting the statute.

VEH 13352, 23103.5, 23573 and 23575 retain both the current and 2033-operative versions; explicit version decisions prevent treating a shared effective date or active flag as proof of current operation. Known transition dates withhold dependent records pending review even after a new archive receipt. VEH 23109's sideshow-specific license provision is tracked for 2029.

Run `node --import tsx scripts/data-review/california-verification/traffic-review.ts` for the source-bound report and successor instruction accounting. Replay `acquire-traffic.py` against the original retained archive.

Next: combine the remaining significant vehicle-identification/chop-shop and nondriving-owner duty questions, then move to an independent missing-charge pass for offenses against people and weapons. Addiction-status, under-21 and entrustment provisions remain explicitly open; none is silently classified as minor. The statewide estimate remains 3-6 substantive batches plus a combined benchmark/release pass because major nontraffic families still need examination.


## Vehicle identification and remaining duties

Ten proposed choices cover chop-shop ownership/operation, sale-related VIN alteration, the distinct dealing and possession branches of 10803, unauthorized identification-mark alteration, possession/dealing with removed identifiers, runaway parked-vehicle reporting, vehicle tampering, unauthorized custodial use, and false vehicle-theft reports with a conditional repeat branch. Seven dependencies are reused; eleven publication sections are added, including three promoted research sections. CALCRIM 2242 now has an exact bounded match. The owner/passenger instructions 2141 and 2151 remain open rather than being credited to the new runaway-vehicle entry.

The packet carries seven source-bound remaining findings: two owner/control liability branches; the entrustment exception's absent HSC 113785 reference (CA-007); habitual-offender predicates and notice; suspended-license injury sentencing scope; repeat temporary-taking predicates; and a documented lower-priority misdemeanor deferral for 10853. Research-only probes are kept separate from runtime pins. There are no new attorney data-entry assignments.

Run `node --import tsx scripts/data-review/california-verification/vehicle-identification-review.ts` to validate and render the packet. `acquire-vehicle-identification.py` replays against the original archive, including its exact missing-definition probe. Fresh comparison covers 461 sections/467 versions and preserves the receipt's original acquisition and expiry.

This batch builds on merged PR29, including its transition-inventory validation fix. It remains a separate review from the preceding traffic publication.

Next priority: the independent missing-charge pass for offenses against people and weapons, combining related sections. Carry forward the remaining vehicle questions explicitly rather than cycling through low-priority traffic clauses before reviewing another major family. The 3-6 substantive-batch planning range remains provisional and is not a claim of statewide completeness.


## People and weapons: combined independent gap packet

The packet combines all 207 instructions in five February 2026 CALCRIM families: assault/abuse, sexual offenses, kidnapping/trafficking, threats/hate crimes, and weapons. The 659 instruction pages and 16 printed contents pages are retained with hashes. Extraction checks each family's inventory against its own printed contents, including letter-suffixed entries such as 852A and 852B. Homicide and gangs remain outside this packet; later supplements are not certified.

One archive pass retains 373 statutory sections from 18 discovery candidate groups, instruction references and explicit probes: 77 reused, 296 newly retained, none absent. The reuse-provider list and hashes are frozen so later publication batches cannot silently change replay accounting. These are original-snapshot research sources, not fresh publication evidence. Runtime pins, the PEN 30515 hold and the existing expiry remain unchanged.

The crosswalk credits 43 explicit bounded prior matches, distinguishes 29 context/defense/allegation entries and one generic weapon template, and retains 134 instruction entries for comparison: 29 with same-section catalog candidates and 105 without any. Same-section hits can be misleading where a base citation such as PEN 240 or 647 links unrelated branches. They never receive automatic coverage credit. CALCRIM 2561 remains substantive separate-count research; only its enhancement-only sibling 2562 is classified as allegation context.

The four named source groups carry the next publication work. No attorney data-entry assignment is needed now. Start with serious violence, abuse and detention; acquire any newly identified sentencing dependencies, verify exact branches, compare against the fresh archive, and then publish the clear choices together. Refer only a concrete unresolved interpretation with source text and a decision needed.

Reproduce with `extract-people-weapons-benchmark.py`, `acquire-people-weapons.py`, and `node --import tsx scripts/data-review/california-verification/people-weapons-review.ts`. Ordinary validation and tests use committed public evidence offline; PDF/archive replay uses the retained original receipts. Parser tests run through the existing Python unittest wrapper in Vitest CI.


## Serious violence, abuse and detention: combined publication

The successor proposes 28 choices across 18 primary sections: mayhem/torture; three assault-with-intent branches; child abuse, fatal/brain-injury assault and corporal punishment; domestic injury; elder abuse and detention; kidnapping, hostage-taking and false imprisonment; trafficking; and child abduction. Twenty-five instruction entries gain bounded matches. The historical research packet is preserved, and its other families remain open.

Seventy dependencies are bound: 26 reused and 44 newly monitored, including 36 promoted research sections. The unchanged-source comparison confirms 504 of 505 publication sections; PEN 30515 is the sole changed-source hold. The authentic receipt dates and expiry are preserved. Section parsing now retains multiple trailing letters, keeping PEN 273ab distinct from PEN 273a throughout citations, URLs and authority checks.

The report preserves the January 2026 torture parole-minimum distinction, age/actor/intent branches, conditional prior terms and trafficking's additional fine/terms. The felony false-imprisonment fine limit is expressly unresolved in the user-facing explanation and in attorney question 4. Kidnapping 207(c)/(d), elder financial offenses and the other people/weapons groups remain research, not minor-charge deferrals.

Run `node --import tsx scripts/data-review/california-verification/violence-detention-review.ts` for the source-bound review and successor crosswalk. Replay `acquire-violence-detention.py` against the retained original archive. Next substantive group: combine the remaining sexual-offense branches using the already retained shared evidence, followed by weapons/threats and the remaining statewide families.


## Sexual offenses: combined publication

Sixty-four choices cover 13 primary sections: oral copulation, sodomy, the remaining core sexual-penetration branches, in-concert rape/penetration, aggravated child sexual assault, caretaker/forced lewd acts, harmful-matter grooming, arranged meetings, continuous abuse, adult conduct with young children, pimping, pandering and procurement. The 42 newly matched instruction entries receive bounded credit only. Existing rape, lewd-child and penetration choices are preserved.

The 25 required source sections reuse 19 already monitored sections and add six, including three promoted from research. The unchanged-source comparison covers 510 of 511 publication sections; PEN 30515 remains held. The original receipt acquisition time and expiry remain unchanged. The review preserves differing age/coercion terms, proof of incapacity, caretaker exceptions, conditional life/consecutive sentences and separate additional fines.

The successor carries forward all three violence/detention findings, including attorney question 4. Registration violations, image-based exploitation, contact-with-intent penalties, child annoyance/molestation, sexual-battery siblings and custody enforceability remain explicit substantive research. None is dismissed as a minor omission. No new attorney data-entry assignment is created.

Run `node --import tsx scripts/data-review/california-verification/sexual-offenses-review.ts` for the source-bound review and cumulative instruction crosswalk. `acquire-sexual-offenses.py` replays the frozen predecessor providers and the original archive. Shared expected catalog totals now live in one test fixture so each batch does not require dozens of manual count edits; independent per-batch counts and source checks remain.

Next: finish the remaining significant sexual-offense branches as a combined group, then weapons/threats/hate crimes and the remaining major families. The prior work-package estimate remains provisional; this is not statewide completeness.


## Registration and exploitation: combined successor

Twenty-six choices cover 13 primary sections, including four registration duties, actual/synthetic image-possession branches, distribution/production, child contact and annoyance, remaining sexual battery, incest, obscene live conduct and animal sexual abuse. Thirteen additional instruction entries gain bounded matches. The successor preserves historic crosswalk evidence while updating the broad sexual-family finding to distinguish work completed from specific remaining holds.

Forty-three source sections reuse 25 retained dependencies and add 18 to monitoring, including 13 promoted research sections. The fresh-archive replay confirms 528 of 529 sections unchanged; PEN 30515 remains held. Neither the authentic acquisition time nor the October 5 expiry is extended. The additions preserve registration knowledge/notice conditions, the distinct 30-day misdemeanor rule, actual/synthetic obscenity distinctions, prior-conviction and quantity-based terms, and additional fines.

Commercial distribution under 311.2(b) remains a significant classification question concerning the fine alternative and sections 17/18, not a minor omission. Special registration duties, Internet-identifier enforceability and custody-conduct branches remain research. No new attorney assignment is needed to review this publication batch. The existing felony false-imprisonment question remains open.

The registration overview now has independent retained-text and rendered-prose assertions for each adult tier period. These detect changed anchors; they do not certify exceptions or automate legal interpretation. Run `registration-exploitation-review.ts` for the cumulative source-bound report and `acquire-registration-exploitation.py` for frozen-provider acquisition replay.

Next: the combined weapons, threats and hate-crime group, followed by justice/public-order/property gaps and targeted other-code/homicide/gang benchmark work. The same practical-completion stop conditions apply; these counts are not a statewide coverage percentage.
