# California practical completion plan

Updated September 28, 2026. The target is dependable coverage of important charges, with an honest omission inventory. It is not a claim that every criminally enforceable California provision has been published.

## Present position

The combined drug follow-up proposes 18 additional choices, taking the configured catalog from 218 to 236: the 99 original corrected choices and 137 additions. There are 162 distinct primary sections and 403 retained sections/407 versions including dependencies. The existing changed weapon source still withholds one configured record, leaving 235 eligible while the receipt is valid. These are repository counts, not verified production availability; 21 other canonical labels remain outside the configured catalog.

The new drug packet accounts for 104 candidate identities: 102 Chapter 6 sections plus two independent benchmark probes. Twenty primary sections supply additions, six have earlier catalog entries, 77 remain shared-context or substantive research, and BPC 4326 is absent from the archive. This is an honest research queue, not 77 confirmed missing offenses. No unknown-severity provision is classified as a minor omission.

The latest successor packet accounts for all 40 sections left in the first person/property group: nine supply new choices, four are supporting provisions, one is a low-priority deferral, and 26 remain substantive research. Previously reviewed sections can still have unpublished subdivisions. Neither 40 nor 26 is the remaining statewide workload.

The archive discovery ledger spans 30 codes and records 6,028 sections with criminal-language signals, 3,530 possible penalty targets, and other unresolved/no-signal sections. These overlap legal concepts, definitions, procedure, historical text, and noncriminal rules. They are not missing-charge counts and cannot support a coverage percentage.

## Rough remaining effort

Planning range: **3–6 more substantive batches plus one combined benchmark/release pass after this drug follow-up**. This remains a work-package estimate: the remaining families can be combined where shared sources justify it. Confidence is limited until the benchmark extends beyond the drug chapter. New serious omissions, changed law, or difficult applicability issues may expand the range. This is a work-package estimate, not a fixed number of days or a promise of exhaustive statutory completeness.

| Combined work package | Scope and reuse opportunity |
| --- | --- |
| Controlled-substances follow-up (current) | Eighteen additional choices cover the 16 previously unmatched instruction entries at a bounded adult-branch level. Reuses all 14 primary sections and adds only BPC 26032 licensing protection. |
| Drug/alcohol carry-forward | Preserve HSC 11395 as a consequential standalone-identity gap, juvenile actor branches under HSC 11354, BPC 4326 history, and unreviewed chapter candidates. Prioritize alcohol offenses with the driving batch where appropriate. These are not minor-charge deferrals. |
| Driving and vessels | Vehicle Code criminal driving, injury, suspended-license, evasion, and hit-and-run branches; Harbors and Navigation Code predicates; carry forward PEN 192.5, 193.8, and 499. Reuse existing DUI and traffic evidence. |
| Remaining offenses against people and weapons | Sexual offenses, domestic violence, child/elder protection, threats/stalking, detention offenses, and weapon restrictions. Treat changed PEN 30515 versions and enforceability separately. Split into two reviewable batches if the legal distinctions become too dense. |
| Justice, public order, property and financial gaps | Obstruction, court-order violations, custody/escape, public-order offenses, and consequential property/fraud branches. Carry forward wage theft, remittance, access-card valuation, trade-secret theft, and scrap-metal gaps. Split where shared sources do not justify one packet. |
| Targeted other-code pass | Prioritize criminal provisions in Business and Professions, Welfare and Institutions, and other codes identified by independent references or the candidate ledger. Record obscure minor/administrative candidates as explicit deferrals after severity is established; do not interpret a whole code's review as automatic publication approval. |

Some packages can combine; the largest may need splitting. Count useful charging identities and resolved gaps, not PRs or raw section totals. Do not keep cycling through obscure leftovers in the first four statutory groups while major families remain unexamined. **Next recommended batch: driving and vessels, with alcohol overlaps and explicit drug-gap carry-forward.**

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
