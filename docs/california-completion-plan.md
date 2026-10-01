# California practical completion plan

Updated September 30, 2026. The target is dependable coverage of important charges, with an honest omission inventory. It is not a claim that every criminally enforceable California provision has been published.

## Present position

PR45 is merged. The repeat-theft/vehicle and assembly successor proposes ten choices, bringing the repository to 604 configured and evidence-eligible choices while the receipt is fresh: 99 corrected originals and 505 additions. They cover 327 primary sections, with 814 retained publication sections/822 versions including dependencies. These are repository counts, not verified production availability; 21 canonical labels remain withheld. The four attorney decisions remain recorded. Historical milestones below describe their earlier state.

The new drug packet accounts for 104 candidate identities: 102 Chapter 6 sections plus two independent benchmark probes. Twenty primary sections supply additions, six have earlier catalog entries, 77 remain shared-context or substantive research, and BPC 4326 is absent from the archive. This is an honest research queue, not 77 confirmed missing offenses. No unknown-severity provision is classified as a minor omission.

The latest successor packet accounts for all 40 sections left in the first person/property group: nine supply new choices, four are supporting provisions, one is a low-priority deferral, and 26 remain substantive research. Previously reviewed sections can still have unpublished subdivisions. Neither 40 nor 26 is the remaining statewide workload.

The archive discovery ledger spans 30 codes and records 6,028 sections with criminal-language signals, 3,530 possible penalty targets, and other unresolved/no-signal sections. These overlap legal concepts, definitions, procedure, historical text, and noncriminal rules. They are not missing-charge counts and cannot support a coverage percentage.

## Rough remaining effort

The cumulative people/weapons crosswalk now accounts for 207 instructions across five families: 160 have bounded matches, 29 are context/defense/allegation entries, one is a generic weapon template, and 17 still require branch comparison or resolution. Bounded matches do not certify every branch or the statute's completeness. These entries overlap and are not a count of new charges. There is no defensible statewide percentage yet.

| Next work package | Scope |
| --- | --- |
| Serious violence, abuse and detention | First 28 branches merged in PR32. Carry forward the fine question, kidnapping siblings and elder financial branches. |
| Sexual-offense branches | The first 64 choices are merged; the successor adds 26 registration/exploitation and related branches. Commercial image distribution, special registration duties and custody enforceability remain explicit research holds. |
| Weapons, threats and hate crimes | The 43 conduct choices and 24 eligibility/ammunition/carrying choices are merged. Knife/open-carry, addiction-only and remaining assault-weapon questions stay held for research. |
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


## Weapons, threats and hate crimes: combined conduct publication

Forty-three choices cover 23 primary sections: stalking/order/prior distinctions, civil-rights interference, terrorizing symbols and religious threats, explosive-device conduct, brandishing, discharge/permission from vehicles, armed criminal action, assault-intent possession and first/second/third-degree or off-premises firearm storage. Twenty-eight additional instruction entries gain bounded matches. The 72 dependencies reuse 16 monitored sections and add 56, including 27 research promotions.

The unchanged-source comparison covers 584 of 585 retained sections. PEN 30515 remains held, and the acquisition/expiry dates remain unchanged. The 2026 storage operative dates and defenses, minimum brandishing terms, additional community service, homicide versus injury terms, and differing culpability requirements are preserved. FGC supporting citations now retain the Fish and Game Code label rather than being forced into a Penal Code identity.

CA-008 and CA-009 document older CALCRIM hate-crime grading and symbol-terrorism subdivisions. Exact instruction pages remain unchanged. The statute controls the displayed alternatives, and a bounded match does not certify the old wording as current law. The earlier 311.11 clinical display-label choice is now explicitly recorded in that batch's decisions and regenerated report, preserving charging-paper aliases.

Reproduce with `acquire-weapons-threats.py` and `node --import tsx scripts/data-review/california-verification/weapons-threats-review.ts`. Next combine remaining weapon predicates/carrying/enforceability comparisons, then justice/public-order/property and the targeted other-code/homicide/gang pass. Existing attorney questions remain open; no new manual data-entry assignment is created.


## Firearm eligibility, ammunition and concealed carrying successor

The combined batch adds 24 exact branches from nine primary sections. Its dependency pass reuses 57 sections and adds 101 monitored sections, including 23 already retained for research. This larger dependency set covers actual predicate and exemption provisions; retaining those texts does not certify each as a standalone offense.

The cumulative people/weapons crosswalk now has 160 bounded instruction matches, 29 context entries and one generic weapon template, leaving 17 substantive instruction entries unresolved. Bounded matches are not assertions that every branch in an instruction or family is complete. The historical research packet remains unchanged.

Key distinctions include the misdemeanor-only 29805(g)/(h) branches, conviction-date cutoffs, known warrants versus convictions, wardship before age 30 versus adult-court convictions, purchase/receipt versus ownership under protective orders, two different ammunition definitions, and cumulative concealed-carry grading conditions. Adult ranges are not juvenile dispositions. The 29850 defense is not generalized to 29900 or 29825.

Knife/open-carry enforceability, addiction-only restrictions, remaining assault-weapon branches, hate-crime allegations and storage siblings remain explicit research items. The officer-victim tear-gas branch adds a related prison-or-fine classification question; it is withheld rather than guessed. Court links in the review explain holds only and do not claim complete docket verification. Existing attorney questions remain open, with no new manual data-entry assignment.

The unchanged-source comparison covers 685 of 686 retained sections. PEN 30515 stays held. Replay preserves the original September 28 comparison acquisition time and October 5 expiry; it does not renew the receipt.

Reproduce with `acquire-weapons-eligibility.py` and `node --import tsx scripts/data-review/california-verification/weapons-eligibility-review.ts`. Next combine justice/public-order/property research into a shared-source batch while keeping the remaining consequential weapons questions visible. Then complete the targeted other-code/homicide/gang pass and assess release readiness against the documented important-charge benchmark, not an invented statewide offense denominator.


## Justice, public order and property: combined missing-branch inventory

This research packet covers eight complete families in the retained 2026 CALCRIM PDF: arson, robbery/carjacking, burglary/receiving, theft/extortion, criminal writings/fraud, crimes against government, tax, and miscellaneous offenses. The 202 instructions span 574 pages, checked against 13 contents pages. The miscellaneous family includes instructions 3001/3002 on failure to appear and 3010 on recorded communications; numeric cutoffs must not omit them. Reserved entry 1809 is accounted for without inventing an instruction.

The frozen catalog after PR37 has associations for 67 substantive instructions; 102 have no primary-source catalog match, and 33 are context/defense/grading. Neither association nor absence is a legal completeness decision. Instructions overlap offenses and shared citations can hide different subdivisions. No statewide percentage is inferred.

A single acquisition covers 912 candidate sections: 232 reuse earlier publication or research evidence, and 680 newly retained sections contain 682 versions. No requested section is missing. PEN 132.5 and 451.5 retain multiple versions requiring explicit resolution before publication. Whole shared-source groups add adjacent discovery leads without turning every clause into a release requirement. Unknown severity remains open; minor deferral requires an actual review.

| Successor group | Instructions | No catalog primary match | Existing associations to compare | Context/grading |
| --- | ---: | ---: | ---: | ---: |
| Justice, witnesses, orders and failure to appear | 32 | 19 | 7 | 6 |
| Custody, contraband and escape | 16 | 15 | 0 | 1 |
| Property, arson and extortion | 48 | 18 | 18 | 12 |
| Fraud, financial and tax | 62 | 18 | 32 | 12 |
| Public order and miscellaneous | 44 | 32 | 10 | 2 |

Next combine the first two groups into one substantive review where practical. Resolve clear branches using shared evidence; preserve order validity, lawful official performance, custody status, force, exceptions, and classification questions. These are engineering queues, not attorney data-entry assignments. Existing attorney and enforceability holds remain in their predecessor reports.

Efficiency changes: the catalog snapshot is frozen to the PR37 merge commit rather than the changing runtime catalog, so future additions cannot silently rewrite this report. Prior artifacts are hash-bound and reused. The new extractor reuses the established PDF heading parser, checks printed contents independently, preserves non-Penal code identities, and excludes subdivision numbers from source keys. The existing Vitest regression entry point now runs all 31 Python extraction/verification tests, passing no application credentials to the subprocess. This closes the missing Python invocation without broadening GitHub workflow permissions. The existing npm installation problem can still block that runner and remains a separate infrastructure issue.

Reproduce with `extract-justice-property-benchmark.py`, `acquire-justice-property.py`, and `node --import tsx scripts/data-review/california-verification/justice-property-review.ts`. This packet does not change publication pins, the existing PEN 30515 hold, or the October 5 receipt deadline. Homicide/gang comparisons, selected other-code gaps and the final deployment/maintenance checks remain after these groups; the old 3-6-batch estimate is not a renewed promise.

## Catalog-size prerequisite before the combined justice/custody publication

The next combined publication would take California beyond 500 eligible choices. Review found that the questionnaire and dashboard requested only the first 500 records and the chat selector requested only 200. The API also capped each response at 500. Publishing more choices without changing these consumers would silently omit charges or incorrectly ask users to reselect a saved charge.

The prerequisite change keeps the 500-record response bound and adds explicit pagination. The questionnaire, chat selector, dashboard authority lookup and PDF export load every matching page before using the result. Every page independently applies current authority; a content/membership change between pages rejects the lookup, and a failed page never leaves a partial catalog selectable. California PDF export now uses the same live authority preflight as the dashboard. This infrastructure change is separate from legal publication and applies to every jurisdiction.

Coverage remains 476 configured choices, with 475 eligible under the existing receipt and PEN 30515 hold. No receipt is renewed. The combined witness/court-order/custody/escape batch remains next; the preliminary legal comparison preserves statutory misdemeanor alternatives, consecutive terms, order validity, lawful performance, and unresolved fine or custody questions. It does not yet approve new choices or close the corresponding research groups.

## Combined witnesses, orders, custody and escape publication

This batch proposes 45 choices from 21 primary sections, combining the first two justice/property queues. It reuses 28 published dependencies and adds 38 monitored sections; 22 of those sources were already retained in the research packet. The resulting catalog has 521 configured choices and 520 eligible choices under the existing receipt, with the PEN 30515 hold preserved. The publication collection now retains 724 sections/730 versions, and comparison finds 723 unchanged sections plus that one held dependency. The comparison retains its September 28 acquisition time and October 5 expiry.

The 202-entry frozen research crosswalk stays intact. A separate publication crosswalk gives bounded matches to 32 instruction entries: 22 in justice/witnesses/orders and 10 in custody/escape. This is not credit for every statutory sibling, and existing ordinary resisting-arrest and own-recognizance choices are not duplicated. Display titles describe operative conduct when no short statutory name exists; citation aliases remain available.

The review preserves witness-interference intent differences, adviser/privilege exceptions, actor-specific evidence-tampering penalties, perjury delivery rules, valid known orders and lawful official performance. It distinguishes 166 and 273.6 custody minima, the separate state-prison and 1170(h) routes, and consecutive prison/custody terms. Section 4532's felony wording does not erase its explicit ordinary county-jail alternatives. Section 836.6's aggravated range requires both force and proximate serious injury to an officer. Fine uncertainty for seven choices is explicit and grouped for further research rather than assigned by analogy.

Remaining serious research includes the life-prisoner/capital branch, gassing county-jail alternatives, drugs/paraphernalia in custody, official bribery/threat and riot siblings, and legacy commitment language. These are not dismissed as minor omissions and are not new attorney data-entry assignments. The existing four attorney questions and all earlier enforceability holds remain open. Next combine property/arson/extortion publication where shared evidence permits, then financial/fraud/tax and public-order branches, while keeping the targeted other-code/homicide/gang comparison and release/maintenance checks visible.

Reproduce with `acquire-justice-custody.py`, `justice-custody-review.ts`, `coverage.ts`, and offline `refresh-retained.py --activate-unchanged` against the retained candidate receipt. The new acquisition excludes itself when assembling predecessors, avoiding circular reuse. The shared browser-test catalog loader follows all pages; older batch release checks no longer assume California fits in one response.

PR39 review observation: full-object page-token hashing has a small measured cost. Replacing it with IDs alone would weaken content consistency across deployments sharing the same IDs. Keep the current check; if profiling warrants optimization, combine a cached content revision with ordered authority-gated IDs rather than silently removing the content guarantee.


## Attorney decisions implemented: September 30 successor review

All four requested decisions now have runtime penalty text: section 270's
first-offender protection and qualified prior-conviction possibility; the likely
lesser fireworks treatment at exactly 100 pounds with explicit uncertainty;
currently enforceable assault-weapon restrictions with a dated litigation notice;
and a discretionary $10,000 base fine for felony false imprisonment under section
672. Historical review packets are preserved. A successor evidence packet binds
the approved interpretations and statutory versions. New penalty prose uses an
explicit English fallback notice in Spanish/Chinese until translated review.

The reviewed section 30515 successor is compared against the authenticated retained
September 28 publisher archive. All 724 sections match, containing 731 versions.
Section 6 of AB 191 is operative now; section 7 is separately retained for 2029,
when a transition gate requires review. Old-ZIP receipts cannot establish currency
for the successor. Replay retains the October 5 expiration and does not renew it.
California has 521 configured and 521 evidence-eligible choices while the receipt
is fresh. No new identities or national tier-count changes occur in this batch.

No further attorney answer is required for the four questions. The approved
interpretations retain their specific limits; statutory freshness is not court
case monitoring. Live deployment parity remains to be checked after merge/deploy.
Next substantive expansion: combine property/arson/extortion branches using the
existing shared research inventory, then financial/fraud/tax and public order.


## Property, arson and extortion: combined publication

The successor adds 22 choices from 15 primary sections. It reuses 18 published sources and promotes 19 already-researched sources; three additional dependencies complete the 22 newly monitored sections. The shared-source comparison matches all 746 publication sections/754 versions against the authenticated retained candidate. Its September 28 acquisition time and October 5 expiration are unchanged. Acquisition replay excludes its own output, and ordinary validation is offline in a fresh clone.

The batch covers malicious arson, reckless fires, aggravated and attempted arson, incendiary preparation, concerted residential robbery, forcible vehicle entry, burglary tools and extortion including threatening writings/ransomware. The review preserves arson's special fines and registration duties, the six-month county-jail alternative in 452(c), and uncertainty in misdemeanor fine ceilings. Emergency sentencing remains a visible special-branch research item, not an ordinary range. Aggravated arson retains both source versions, explicitly chooses the 2026 version, and receives a January 1, 2029 transition gate. Older enactment/effective dates do not establish operative priority.

Fifteen instruction entries receive bounded matches; the 32 justice/custody matches remain in the cumulative 202-entry crosswalk. Neither number certifies a complete family. Repeat-theft/vehicle-taking branches, existing theft/receiving/elder-financial associations, emergency arson sentencing and remaining fine questions are explicitly retained. No new attorney answer is requested for this publication. Next combine financial/fraud/tax and consequential remaining property branches where the sources overlap, then public order and targeted other-code/homicide/gang comparisons. Deployment parity and maintenance remain release requirements.

Reproduce with `acquire-property-arson.py`, `node --import tsx scripts/data-review/california-verification/property-arson-review.ts`, and `coverage.ts`. Publication pins are explicit; the normal retained-source comparison checks every dependency. Spanish/Chinese readers receive an English fallback notice until translation review. Tests exercise evidence tampering, version selection and transition boundaries, custody alternatives, guidance categories and charging-paper searches.


## Financial, public-money and tax publication

The combined successor adds 28 choices from ten primary sections: public filing of false instruments, insured-property fraud, financial statements, false personation, seven public-money conduct branches, and income/franchise-tax offenses. It reuses six published sources and promotes ten already-researched sources; 17 additional dependencies complete 27 newly monitored sections. All 773 publication sections/781 versions match the authenticated retained candidate. Its acquisition date and October 5 expiration are unchanged.

Seventeen previously unmatched instruction entries receive bounded matches, preserving the earlier 47 justice/custody and property/arson matches in the 202-entry cumulative crosswalk. The larceny-linked false-personation section 530 remains open, as do older source-key associations requiring branch comparison. This is not all California financial crime or every type of tax. Repeat-theft/vehicle-taking, public-order and targeted other-code/homicide/gang comparisons remain in the queue.

The review binds the distinct public-money knowledge/criminal-negligence requirements, financial-statement fine alternatives, two-year repetition and knowledge requirements from CALCRIM 2810, and known-duty tax willfulness from CALCRIM 2828 and its cited authority. Section 19705/19708 fine-or-imprisonment alternatives are read with PEN 18(b)/17(b); a felony label alone does not justify suppressing the misdemeanor route. Corporate fine caps, individual custody, investigation costs and the 364-day misdemeanor ceiling remain distinct. Revenue and Taxation Code identities and R&T charging-paper aliases are preserved. Supporting case links are also structured in the review artifact, with former/current statute-number limits stated.

Reproduce with `acquire-financial-tax.py`, `node --import tsx scripts/data-review/california-verification/financial-tax-review.ts`, and `coverage.ts`. Reuse the shared source packet and cumulative crosswalk rather than repeat acquisition per charge. The batch adds no attorney data-entry assignment. Remaining ambiguous branches stay research items rather than being declared minor or complete. Browser tests cover paginated API/guidance and both Penal Code and R&T citation lookup; offline tests reject cross-code substitution, source/definition drift and invalid spans.

PR43 CI observation: GitHub's jobs stopped with `vitest: not found` and `playwright: not found` before executing tests. Local typecheck, build, focused browser checks and the full suite remain the available verification, with the documented unrelated Florida/database failures. The CI dependency-installation problem requires separate infrastructure follow-up; it is not a passing CI claim and this publication does not broaden workflow permissions.


## Combined public-order publication

The successor to the financial/tax batch adds 23 choices from 11 primary sections: damage to communication/electrical lines; threatened, occupational and residential trespass; dangerous animals; underage alcohol supply and consumption; parental permission leading to a collision; six betting branches and a limited noncommercial-pool infraction; and confidential recordings. It reuses 13 published dependencies, promotes 18 retained research sections and acquires only three additional dependencies. All 794 publication sources/802 versions match the authenticated retained refresh candidate. Its original acquisition time and October 5 expiration remain unchanged.

The 202-entry justice/property crosswalk now has 86 bounded publication matches, preserving all 64 earlier matches. A match is not an assertion that every alternative in the instruction is covered. Prior financial/property findings carry forward with their evidence, alongside explicit holds for school loitering and remaining assembly/dispersal and trespass branches. No additional attorney answer is required to review this batch.

Legal distinctions protected by the batch include actual interference and continuous occupation for the selected trespass branches; different animal knowledge standards; conditional alcohol jail minimums and fine/community-service alternatives; medical-aid immunity; the noncommercial pool exception; and participant evidence-recording exceptions, particularly domestic violence. No obsolete underage-alcohol license suspension is inferred from VEH 13202.5.

Reproduce with `acquire-public-order.py`, `node --import tsx scripts/data-review/california-verification/public-order-review.ts`, and `coverage.ts`. The reviewer packet preserves exact statutory text, definition hashes, dependency versions and instruction-page hashes. Runtime checks cover expiry, multilingual fallback and code aliases; browser checks cover the paginated API, guidance and four charging-paper searches. This batch depends on the financial/tax branch and should be reviewed as a stacked PR until that predecessor is merged.

Next: combine the remaining consequential property/repeat-theft branches with the remaining assembly/dispersal review where practical, then reconcile outstanding benchmark findings across families. Minor unresolved branches remain inventoried gaps. These bounded publication counts are not a statewide completeness percentage.


## Repeat theft, vehicles and assembly publication

Following merged PR45, this combined batch proposes ten choices covering the older and newer repeat-theft allegations, bounded vehicle taking/posttheft driving, public-meeting disruption, ordinary and custodial riot incitement, riot participation, rout/unlawful assembly and two different dispersal offenses. Eleven previously unmatched instruction entries receive bounded matches, bringing the cumulative 202-entry justice/property crosswalk to 97 matches. These are not complete-instruction or statewide-completeness claims.

The publication reuses 17 published sources and promotes 12 sources from the shared research packet; eight additional dependencies complete 20 newly monitored sections. The acquisition now recognizes the research packet's frozen reuse providers, avoiding falsely reporting their sources as entirely new research. Every promoted version is still checked against the validated packet. All 814 retained publication sections/822 versions match the authenticated refresh candidate; the existing acquisition time and October 5 expiry are unchanged.

The review distinguishes section 666's custody and restricted eligibility requirements from section 666.1's two-prior scheme, including its first/subsequent conviction custody difference and possible diversion. Vehicle taking above $950 and posttheft driving after a substantial break receive bounded publication; low-value taking and special-vehicle sentencing remain separate gaps. The publication does not treat temporary low-value taking as automatically felony or remove misdemeanor treatment solely because of a vehicle prior.

Assembly guidance preserves the constitutional conduct/immediate-danger limits, lawful-warning requirements, the different intent rules for sections 409 and 416, and section 409.7 protections for qualifying journalists. Elections Code identity is added for section 403's elector-meeting exception, without mislabeling that dependency as Penal Code.

Three fine ceilings (sections 666, 666.1 and 404.6(c)) remain explicitly unresolved in both the user-facing penalty text and the research queue. Supported classifications and custody ranges are published without inventing a generic fine. This bounded gap does not require an immediate attorney assignment. Prior findings are either carried forward or preserved in a superseded-finding ledger with narrower remaining work; they no longer disappear when a later batch addresses only part of the question.

Reproduce with `acquire-repeat-theft-assembly.py`, `node --import tsx scripts/data-review/california-verification/repeat-theft-assembly-review.ts`, and `coverage.ts`. Source/definition tampering, source code identity, constitutional safeguards, prior-conviction distinctions, expiry and multilingual fallback have targeted tests. Browser coverage exercises the paginated API, rules guidance and four exact citation searches.

Next: consolidate the remaining benchmark associations against already-published choices, prioritize consequential unresolved branches and targeted other-code/homicide/gang comparisons, and retain marginal uncertain offenses as explicit gaps. Avoid another full extraction pass for already-bound sources. Maintenance and deployment parity remain release requirements.

## Benchmark reconciliation after PR46

The full 202-entry justice/property inventory has been reconciled against earlier publication batches. Twenty instruction entries now link to already-reviewed choices, preserving original definition hashes, statutory evidence, dependency versions, review-artifact hashes and instruction-page hashes. The cumulative count is 117 bounded matches, 31 context/defense/grading entries and 54 open substantive comparisons. All 97 previous matches and every unresolved finding from PR46 are preserved. This is not a statewide completeness percentage or a claim that every alternative within a matched instruction is covered.

No runtime catalog changes or new acquisition were needed. Configured California choices remain 604, and the existing freshness deadline is unchanged. The efficiency gain is concrete: previously completed forgery, access-card, organized-retail-theft, chop-shop and vehicle-tampering research is reused instead of repeated. The report distinguishes shared-source associations from explicit conduct comparisons and preserves important qualifications, including section 472 concealment and section 484b's unresolved causation split.

Next combine consequential financial and identity branches: employee and elder financial theft, access-card transfer/account information, insurance-fraud alternatives and identity-transfer/false-personation. These are research candidates, not presumed missing charges or approved legal conclusions. Follow with the grouped justice/public-official/custody comparisons and targeted other-code/homicide/gang checks. Marginal uncertain offenses can remain documented gaps. Attorney judgment is requested only when a concrete legal ambiguity remains after research.

Reproduce the complete machine-readable inventory and human report with `node --import tsx scripts/data-review/california-verification/benchmark-reconciliation.ts`. The reviewed mappings are explicit in `benchmark-reconciliation-plan.json`; no automatic citation match can approve a branch. Future publication batches should consume this cumulative crosswalk so the recovered matches are not lost. Tests reject evidence drift, misplaced instruction links, wrong statutory identities, duplicate mappings and silent clearing of prior findings.
