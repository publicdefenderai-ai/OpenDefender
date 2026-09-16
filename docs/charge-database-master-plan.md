# OpenDefender
## Charge Database Validation & Maintenance Master Plan

Planning baseline: September 16, 2026

Status: Ohio pilot authorized. National schedule and effort estimates withdrawn at the user's direction. Reissue this memo after the Ohio pilot provides measured throughput and review requirements.

Purpose: Build and maintain a source-derived, auditable criminal-charge database that supports accurate Case Guidance across all 57 currently represented jurisdictions: 50 states, the District of Columbia, five territories, and federal law.

Planning outlook: No current national or Ohio delivery estimate. Prior calendar, staffing-based effort, and review-hour estimates were not empirically grounded and must not be used as commitments.

## Executive decisions

- Start with Ohio, but build a reusable discovery, evidence, validation, publication, and monitoring system—not another isolated spreadsheet cleanup.
- Derive the inventory from statutory sources. Reconcile legacy records afterward; do not let their names determine which offenses exist.
- Target all in-scope felonies and a documented, high-coverage set of common misdemeanors. Never equate verification of the existing catalog with statewide completeness.
- Automate routine names, citations, structural extraction, and exact duplicate handling. Reserve attorney review for substantive legal ambiguity and risk-based quality assurance.
- Publish only records that meet explicit evidence and currentness requirements. Maintain unresolved material in a separate, nonselectable workspace.
- Treat continued maintenance as a funded operating function from the pilot onward, not as a later feature.

# 1. Goals, scope, and the meaning of “satisfactory”

## Product outcome

A user should be able to identify the offense on their charging paperwork, select the correct jurisdiction and supported statutory variant, and receive guidance grounded in the applicable offense and circumstances. A missing charge must be clearly disclosed; the application must not encourage selecting a merely similar offense.

## Jurisdiction scope

The baseline is all 50 states plus DC, American Samoa, Guam, the Northern Mariana Islands, Puerto Rico, the US Virgin Islands, and federal law: 57 jurisdictions. Federal and territorial work needs separate source and legal conventions; neither is a copy of a state adapter.

Cover adult criminal offenses in statewide or jurisdiction-wide statutory codes. Include felonies outside the main criminal title, such as vehicle, controlled-substance, tax, environmental, election, and weapons provisions. Discover criminal provisions across those titles rather than assume the criminal title is exhaustive.

Common misdemeanors are in scope; fringe misdemeanors are a documented later backlog. Regulatory offenses carrying criminal sanctions must be inventoried and their inclusion addressed explicitly. Municipal ordinances, tribal law, military justice, juvenile delinquency classifications, and exhaustive regulatory-offense coverage are not part of the initial completion claim. Record these exclusions prominently.

## Completion standards

- Inventory: account for every section in the defined source universe, including supporting provisions, repealed provisions, and unresolved candidates. Confirm enumeration against an independent table of contents or equivalent official inventory.
- Felonies: publish every identified, in-scope current felony and applicable material variant before labeling that jurisdiction “complete within defined scope.” Any unresolved possible felony prevents that label.
- Misdemeanors: where reliable filing data exist, target offenses accounting for at least 95% of misdemeanor filings in the documented reporting period. Do not infer this percentage from the number of catalog entries.
- Where filing data are unavailable, use an explicitly labeled priority checklist built from judiciary reports, charging forms, public-defense practice materials, and local legal input. Report checklist completion, not an invented population-coverage percentage.
- Accuracy: every published record must pass evidence, identity, grading, temporal, and dependency checks. No known critical legal defect may remain in a released record.
- Accessibility: every published record must be reachable in Case Guidance and relevant search, without list-size truncation. English, Spanish, and Chinese interfaces must preserve the underlying legal identity.

“Satisfactory national coverage” means every jurisdiction meets these standards or has a conspicuous, specifically bounded limitation. A jurisdiction with unresolved felony gaps is partial, not complete. There is no unconditional guarantee of exhaustive coverage where sources remain inaccessible.

# 2. Starting position and what to preserve

## Findings from the initial audit

The September 16 repository audit counted 7,158 catalog records. The development API returned 6,181 selectable entries, but only ten jurisdictions used the newer current-source eligibility boundary. These counts are a dated development snapshot, not production figures or verified completeness measurements.

Ohio and Illinois ingestion starts with existing catalog citations rather than enumerating the codes. Both returned 13 selectable charges in the development check. That illustrates the gap between successful retrieval and usable, complete coverage; it does not establish the number of offenses in either jurisdiction.

Official-title mismatch, shared-citation, and compound-reference classifications identify real issues but also create routine review work. Description and penalty accuracy is not comprehensively established by citation verification. Guidance protections limit some scope errors but do not establish support for every generated legal assertion.

Recent work has improved evidence-backed review and refresh safeguards. Detailed implementation must reconcile the latest merged changes before assigning work; do not duplicate existing refresh, quoted-evidence, or attorney-review capabilities.

## Reusable foundations

- Existing government-source adapters, exact section checks, and response validation.
- Source snapshots, content fingerprints, provenance links, and currentness evidence.
- Fail-closed eligibility controls in the jurisdictions already using them.
- Existing statutory citation overlays and jury-instruction references, subject to independent matching.
- Review evidence exports, source-change audit records, refresh protections, and regression fixtures.

## Required architectural change

Separate four layers: discovered source provisions; extracted offense records; legacy reconciliation; and published user-facing records. Add versioned descriptions, penalties, and guidance dependencies to the evidence model.

The first milestone must reconcile source manifests, stored records, and actual API availability for every jurisdiction. Investigate discrepancies such as the development API’s zero California result before drawing conclusions about source coverage. Do not use dated documentation as the live baseline.

# 3. Source acquisition and inventory methodology

## Build a jurisdiction source register

For each jurisdiction record the official publisher, code structure, permitted access method, publication lag, update mechanism, session-law source, effective-date conventions, available history, court and jury-instruction sources, and known access restrictions. Assign an accountable owner and backup.

Prefer structured official downloads or APIs where available; otherwise use respectful, rate-limited HTML or document retrieval. Cache documents, use conditional requests, and obey access conditions. Source unavailability must be visible; never fill gaps with model memory.

## Enumerate before extracting

Traverse titles, chapters, sections, subdivisions, and relevant appendices. Preserve a manifest of the discovered structure. Identify offense-defining provisions separately from definitions, exceptions, sentencing rules, enhancements, and procedural provisions.

Use references, offense language, and penalty-bearing language to identify candidate criminal provisions across the full statutory universe. These signals discover candidates; they do not independently prove that a provision creates a distinct crime.

Reconcile the inventory against a second discovery route where possible: official tables, downloadable code packages, criminal disposition reports, or official charging and jury-instruction indexes. Investigate discrepancies rather than combining lists without analysis.

## Evidence requirements

Retain source URL, publisher, source tier, section and subdivision, full relevant text, official title, retrieval time, effective information, content fingerprint, extraction version, and supporting passages. Respect licensing restrictions when storing or redistributing third-party material.

## Secondary-source policy

Official statutory text is preferred. Where an official online source is unavailable, a reliable third-party code service may support publication only after publisher-specific checks establish exact text, citation, currency, and permitted use. Flag every such record for later primary-source review and show its source status to users.

A FindLaw or Westlaw link alone is not verification. Conflicting editions, unavailable text, or uncertain currentness require withholding affected claims or the record. Do not bypass subscriptions or access restrictions. Search snippets, general legal articles, and generated summaries cannot substitute for statutory evidence.

# 4. Offense extraction, identity, and legal review

## Build records from the law

Extract the official offense name, exact provision, elements and scope, material statutory variants, exceptions, classification, grading conditions, and sentencing references. Represent uncertainty explicitly. Separate factual extraction from plain-language explanation.

Use models for bounded interpretation of retrieved text. Require quoted evidence and structured output; validate that quotations, subdivisions, citations, and cross-references exist. Independent model review can identify disagreements, but model agreement and confidence scores are not proof.

## Routine automation

- Adopt an unambiguous official offense heading without attorney transcription.
- Preserve the official name as the canonical display basis; keep search aliases separate from legal identity.
- Create supported variant labels such as “Official offense name — statutory distinguishing condition” only when the source establishes the distinction.
- Deduplicate only when jurisdiction, provision, version, elements, scope, and grading identity match. Sharing a section is insufficient.
- Treat alternative means, enhancements, and separate offenses as different concepts. Do not create one charge per subsection mechanically.

## Legacy reconciliation

An independently verified source-derived record may be published while the relationship to an old synthesized label remains unresolved. Keep an explicit ledger for correction, replacement, split, deduplication, hold, and removal.

Preserve historical IDs and saved selections. Do not silently remap an existing case to a different offense. When identity cannot be established, ask the user to reselect and explain why. Keep old records available for audit, not new selection.

## Attorney work that remains appropriate

Escalate conflicting authority, unclear offense boundaries, ambiguous grading or penalty dependencies, uncertain legal equivalence, retroactivity, judicial invalidation, and questionable subsection splits. Each item must present the exact question, relevant text, evidence links, proposed resolution, and affected records.

Review common or severe offenses and new extraction patterns more closely. An attorney approves the legal interpretation and reusable rule, not repeated data entry for every similar heading. The review ledger must identify the decision, reviewer, evidence version, rationale, and any future condition that invalidates the decision.

Publication may rely on deterministic, preapproved extraction patterns for unambiguous cases. If an automated rule fails quality review, quarantine the affected rule’s outputs and expand review; do not merely fix the sampled row.

# 5. Descriptions, penalties, guidance, and user experience

## Treat accuracy as field-specific

A verified citation does not certify the inherited description or maximum penalty. Generate descriptions from supported elements and conditions. Distinguish statutory text from explanatory language and avoid importing another jurisdiction’s terminology.

Resolve sentencing through all applicable general and offense-specific provisions. Store ranges, mandatory minima, fines, enhancement conditions, and uncertainty separately. A single generic “up to” penalty is not an adequate replacement for conditional rules.

Record the limits of the penalty information, including criminal-history or fact-dependent outcomes. Do not present individualized sentencing predictions as statutory facts.

## Guidance integration

Carry the selected offense identity, applicable version, material circumstances, and evidence into Case Guidance. Distinguish charge-specific legal statements from general procedural information. Charge records must not be treated as a substitute for separate procedural-law and deadline maintenance.

Require supporting authority for substantive offense and penalty claims. If a claim cannot be supported, omit it or clearly limit it; do not let generated prose supply missing law. Test combinations of charges and user circumstances, not only single-charge display.

Reuse jury-instruction references after confirming jurisdiction, offense, subdivision, version, and link availability. Identify model or pattern instructions as explanatory sources rather than statutory authority. Preserve useful references even when a direct public link is unavailable, with the access limitation shown.

## User-facing coverage and language

Show jurisdiction status before selection: complete within defined scope, partial, source unavailable, or update under review. Explain what is missing without implying that an absent charge is invalid.

Offer “I cannot find my charge,” citation search, spelling and common-name aliases, and a route to general guidance without inventing a substitute charge. Do not gather charging documents or sensitive facts unless separately justified and protected.

Provide equivalent coverage warnings and explanations in English, Spanish, and Chinese. Retain the original statutory name alongside translations so the user can match their paperwork. Legal translation must preserve elements, negation, grading, and uncertainty.

# 6. Quality controls and release gates

## Automated checks for every published record

Check exact provision identity, complete evidence text, quote fidelity, required cross-references, effective intervals, classification and penalty dependencies, duplicate conflicts, source status, and eligibility. A successful HTTP response is not sufficient.

Validate that each published offense is available through the API, selector, search, explanations, and guidance. Check pagination, retired IDs, stale saved selections, and localized displays. Verify database and manifest parity before release.

## Human quality assurance

For Ohio, create an attorney-adjudicated evaluation set spanning homicide, assault, sexual offenses, theft, drugs, driving, weapons, financial offenses, common misdemeanors, and difficult cross-references. Include adversarial examples: misleading headings, repealed text, amendments not yet effective, duplicate sections, and alternative means.

Review all unresolved high-risk interpretations and all new structural patterns. Supplement this with stratified random review of routine outputs, including each adapter and source tier. Oversample penalties and severe offenses. Use independent review rather than having the extractor validate only its own work.

Initial planning allowance is 100–200 routine records per jurisdiction, or all records when fewer, plus high-risk cases. Calibrate using pilot results and statistical advice. This is a workload assumption, not a sufficient sample-size claim for every desired accuracy threshold.

## Accuracy measurement

Report errors separately for identity, citation, elements, grading, penalties, temporal applicability, and translation. Release requires no known unresolved critical defect. Any critical sampled error triggers correction, investigation of the affected class, expanded testing, and a new acceptance decision.

A proposed audited field-accuracy target is at least 99.5%, but publish the sample size, selection method, observed errors, and uncertainty. Do not advertise guaranteed 99.5% population accuracy from a small or biased sample. With zero errors, the approximate 95% upper error bound is 3/n only under suitable independent random-sampling assumptions.

## Jurisdiction sign-off

Require inventory reconciliation, felony accounting, misdemeanor priority coverage, evidence completeness, currentness, quality review, UI availability, update monitoring, and an explicit limitations statement. Legal lead signs interpretation exceptions; data lead signs inventory; engineering signs operational integrity; product owner accepts disclosed scope.

Global averages must not conceal a weak jurisdiction. Release jurisdictions independently, with partial status when necessary.

# 7. Ohio pilot and reusable deliverables

## Pilot scope and sequence

First: establish the source universe, reconcile the current Ohio catalog, define schemas and release gates, and instrument the baseline. Begin code-wide discovery and current-law checks.

Next: extract felony candidates and priority misdemeanors; resolve definitions and sentencing dependencies; build structured identities, variant handling, and the exception ledger. Test source-derived Aggravated Murder naming without assuming the old generic record is equivalent.

Then: complete the agreed inventory sweep, adjudicate important exceptions, run quality sampling, connect the verified records to Case Guidance, and rehearse an amendment and a source outage. Measure execution and external waiting separately.

## Required outputs

- Ohio source register and complete provision-accounting manifest.
- Versioned, evidence-backed felony inventory and documented misdemeanor priority set.
- Legacy mapping ledger with no silent migration of saved cases.
- Validated descriptions, sentencing references, and reusable instruction links.
- Focused legal-exception queue and attorney-adjudicated evaluation set.
- Working availability and coverage notices in the full Case Guidance flow.
- Scheduled monitoring, stale-data rules, audit trail, and tested release recovery.
- Measured throughput, cost, exception rate, and revised national forecast.

## Pilot acceptance

Do not require all historical legacy labels to be resolved before publishing independently verified new records. Do require all possible in-scope felony provisions to be accounted for before claiming felony completeness.

Measure extraction failures by cause, percentage requiring actual legal judgment, review minutes per exception, defects by field, adapter repair effort, and time from discovered legal change to safely updated publication.

At the pilot review, decide whether the next wave is ready. If penalty resolution or multi-offense parsing remains unreliable, improve the shared system before multiplying the defect across jurisdictions. Start source-access reconnaissance elsewhere during Ohio, but do not scale unproven publication rules.

# 8. National rollout: schedule withdrawn pending Ohio

All prior calendar ranges, engineering person-week estimates, legal-review hour estimates, and staffing-derived forecasts are withdrawn. They were not based on measured performance of this project's agent-assisted workflow.

The rollout sequence remains: Ohio; the nine other existing authority states; the remaining 40 states; DC, five territories, and federal law; national reconciliation and stabilization. Independent work can overlap once the shared method is validated. A blocked source must not prevent unrelated jurisdictions from progressing.

Use the Ohio pilot to measure retrieval and extraction throughput, correction effort, true legal-exception frequency, review effort, runtime integration work, and source-access delays separately. Distinguish verified database availability from historical-law expansion, broader guidance enhancements, and ongoing operating work.

Reissue this memo only after those measurements support a defensible forecast. No replacement national deadline is proposed now.

# 9. Currentness and continuing legal maintenance

## Temporal model

Store retrieval date, last successful check, publisher’s stated currency, enactment date where available, effective start and end, and legal-review date separately. “Fetched today” does not establish that a publisher includes yesterday’s enacted law.

Maintain immutable historical versions and future-effective versions. A future amendment must not replace current law early. A current-law record is not automatically the law applicable to a past alleged offense.

Collect alleged offense date when necessary and explain date uncertainty. Do not default silently to current penalties for older conduct. Initially support current law plus preserved verified history and targeted historical lookup; exhaustive historical backfill is a separate program. If the applicable historical version or retroactivity rule is unresolved, withhold that specific conclusion and seek legal review.

## Monitoring cadence and proposed service objectives

| Cadence | Activity | Owner |
| --- | --- | --- |
| Daily on business days; more often near effective dates | Check official change feeds, session laws, emergency acts, known future changes, high-risk source alerts | Data operations |
| Weekly | Reconcile published-record fingerprints, cross-references, source access and queued legal changes; inspect secondary sources | Data operations and legal lead |
| Monthly | Re-enumerate source structures, find added/repealed provisions, reconcile inventory and misdemeanor priorities | Data lead |
| Quarterly | Risk-based legal sampling, instruction updates, court-decision signals, translation and adapter audits | Legal lead and QA |
| Annually | Independent scope/completeness review, full quality evaluation, refresh source contracts and reviewer coverage | Product, legal and engineering |

Where available, use incremental indexes and conditional retrieval rather than downloading every page daily. Discovering statutory change requires both codified text and session-law monitoring because codification can lag. Monitor official court or trusted legal alerts for invalidation or controlling interpretation; automated signals require legal triage, not automatic rewriting.

## Change handling

Detect change; retain a new snapshot; classify formatting versus substantive change; identify affected offenses and dependent penalties/descriptions/guidance; validate; obtain required legal review; stage the correct effective version; publish atomically; invalidate affected caches; verify user-facing output; preserve the audit trail.

Do not invalidate a legal decision for a harmless formatting change alone. Conversely, a changed supporting sentencing section can invalidate many offense records even if their own text is unchanged. Use a dependency graph and record exactly which evidence supported each decision.

Proposed targets: triage credible high-impact alerts within one business day; contain a confirmed harmful publication promptly, with a staffed target of four working hours; resolve ordinary changes within five business days or before effectiveness, whichever requires earlier work. Changes detected too late require immediate withholding of affected claims until validated. These targets require named staffing and are not existing guarantees.

Do not allow a freshness badge to remain current indefinitely. Initial policy: flag ordinary records overdue after seven days without a successful scheduled reconciliation; after 30 days, withhold unless documented evidence supports continued currency. Apply tighter rules to known legal changes and high-risk dependencies. A transient fetch failure alone does not prove repeal or justify deleting valid history.

# 10. Operations, risks, and decision checkpoints

## Steady-state operating budget

Set the operating budget after measuring Ohio's monitoring, exception handling, and maintenance cycles. Prior numerical staffing and review-hour assumptions are withdrawn. Named ownership and surge coverage remain requirements.

Track retrieval and model costs per jurisdiction, storage growth, review hours, queue age, adapter failures, and publication delays. Agent usage is not a substitute for accountable ownership.

## Main risks and controls

- Inaccessible or slow-to-update official sources: early reconnaissance, approved secondary-source policy, explicit partial status, and session-law tracking.
- Unbounded inventory: documented jurisdiction-specific source universe and exclusions; separate inventory discovery from publication completeness.
- Wrong offense splits or merged identities: exact subdivision and element evidence, adverse fixtures, independent review, and stable historical identities.
- Penalty errors: dependency-based rules, high-risk review, no unsupported sentencing predictions.
- Misleading accuracy claims: field-level audits, transparent samples, no guaranteed legal correctness based on model confidence.
- Legal-review bottlenecks: focused questions, reusable adjudicated patterns, scheduled local reviewers, and published queue aging.
- Automation drift: versioned extractors, fixed regression sets, cohort quarantine when a pattern fails, and reproducible imports.
- Licensing or privacy exposure: source-use review, restricted evidence storage where necessary, and no personal case data in shared review exports.

## Governance and checkpoints

Product owns scope and user disclosures. Engineering/data owns reproducibility and evidence integrity. Legal owns interpretation standards and ambiguity decisions. QA independently verifies release criteria. A release requires each owner’s sign-off for their domain.

Maintain a dashboard for every jurisdiction: inventory denominator and confidence, felony gaps, misdemeanor priority coverage, published and withheld counts, source tier, field defects, last legal and source checks, upcoming effective changes, unresolved critical issues, and next milestone.

At national acceptance, require all 57 jurisdictions to have explicit status, no hidden felony gaps behind a “complete” label, functioning monitoring, and two successful maintenance cycles. Exceptions remain visible and owned; they do not disappear into an overall percentage.

## Immediate next decision

The user has authorized proceeding with the Ohio-first pilot. Reconcile existing project work, execute the measured pilot, and reassess the national memo afterward. Proposed quality thresholds remain subject to validation; no withdrawn staffing or schedule assumption is an approved commitment.

## Evidence and estimate limitations

This plan draws on the user’s project brief and the September 16, 2026 read-only repository/development audit. Relevant implementation evidence includes the charge catalog, authority eligibility service, Ohio and Illinois importers, review instructions, guidance engine, and AI guidance service. No production database audit or code-wide nationwide statutory census was performed to prepare this plan.

All thresholds, maintenance objectives, staffing levels, and schedules in this document are proposed planning standards. They must be validated during the pilot. Accurate and current legal information is the objective; neither automated checks nor attorney sampling can eliminate every possibility of error.