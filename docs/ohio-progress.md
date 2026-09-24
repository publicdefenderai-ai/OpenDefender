# Ohio charge database: progress and next delivery

Updated September 24, 2026. This is the current navigation page for the statewide discovery and 51-section follow-up. Earlier Ohio pilots and their approvals remain separate; these counts do not replace their histories.

## The outcome we are building toward

A person should be able to find the charge on their paperwork, confirm the correct Ohio statute and subsection, and receive Case Guidance that uses the applicable conduct, penalties, exceptions and case stage. A label that sounds plausible is insufficient. A statute's presence in the code does not establish that every part remains enforceable.

The work has three distinct outputs:

| Output | What it does | Status for this batch |
| --- | --- | --- |
| Evidence inventory | Accounts for official provisions, versions, penalties and unresolved sources | Statewide enumeration exists; 51 sections have recorded conduct/penalty analysis |
| Reviewed charge records | Establishes names, citations, variants, aliases, exceptions and supported penalties | Ten catalog entries now have six concrete consolidation/correction proposals; four source-based entries already existed |
| Platform behavior | Uses approved records in search, saved cases and Case Guidance | No live changes from this research batch; approval, integration and end-to-end validation remain |

**We are building the evidence-backed database, but this batch is not yet a published catalog expansion.** Do not count a discovered section, extracted grade or authored analysis as a verified selectable charge.

## What the latest batch adds

Read [the catalog proposals and review questions](../scripts/data-review/output/ohio-dependency-review.md). The durable [research ledger](../scripts/data-review/ohio-verification/dependency-review.json) retains supporting statutory text, exact evidence, catalog baselines and remaining work.

- Ten catalog IDs receive explicit proposed dispositions across six statutory sections. Six are older definitions; four are existing source-based definitions. We propose consolidation rather than counting duplicates as new charges.
- Twenty-five additional statutes are preserved with hashes and effective dates. Six shared research modules cover sentencing, culpability, fireworks, liquor, animal provisions and lending. A shared module records its limited finding; it does not certify every dependency for its assigned sections.
- All nine prior hold issues have an owner and a proposed treatment: six legal-judgment questions and three agent research tasks. The held expansion candidates do not block work on the ten catalog entries.
- Case-law research identifies an invalidated funeral-procession branch still present in statutory text and culpability requirements that the animal-cruelty statute does not state expressly. This is why checking only names and statutory citations would be insufficient.
- The offline check rejects changed source text, lost assignments, missing reference signals, changed catalog/citation baselines and attempts to treat this research as publication approval. It works without the untracked chapter cache.

Examples of the platform improvements this enables:

| Existing problem | Proposed correction |
| --- | --- |
| Older open-container entry says $500 and possible jail | Preserve the state offense's minor-misdemeanor classification and ordinary $150 fine ceiling; keep all relevant exemptions |
| “Alcohol in Park” points to open-container law | Require the actual citation/charge identity instead of silently treating every park alcohol allegation as the same offense |
| Older animal-cruelty entry says one year/$5,000 | Use the cited M2 offense's ordinary adult 90-day/$750 ceilings, supported culpability and actual additional sanctions |
| One fireworks entry combines several types of conduct | Distinguish discharge, intoxication-related discharge and discharge without property permission; keep different grades and local exceptions |
| “Minor in Possession” obscures age and subsection | Preserve the existing E citation, refine to E(1), and distinguish under-21 conduct from under-18 procedure and conditional license consequences |

These are comparisons with repository definitions, not a claim that every older entry is currently served by the deployed app. Runtime publication gates and deployed availability were not checked in this research task. The figures above are ordinary adult statutory ceilings, not individualized or aggregate sentences. Source details and qualifications are in the linked report.

## Verification and maintenance

All 260 Ohio unit tests pass across 28 files; the database-backed runtime integration suite was excluded. The script typecheck and offline research validation pass. Three existing test files now use the committed evidence receipts’ shared validity interval rather than wall-clock time. Production expiry checks and the tests that require expired sources to be withheld remain intact.

The pilot receipt expired during this work. A genuine online check of all 61 previously pinned pilot sources found unchanged text, titles and effective dates; its receipt is renewed through October 1, 2026 at 19:33 UTC. This renews verification of existing pins; it approves no new charges and changes no source text. The separate reviewed-batch receipt still expires September 25 at 05:25 UTC and needs its own refresh before relying on it after that time. Neither receipt has been deployed by this research task.

## What you need to review

The report's **Attorney decisions** section contains six questions, each with proposed treatment, source links and statutory excerpts:

1. §3767.30: stationary funeral protests versus the severed procession branch; corporate actor treatment.
2. §4301.21(D): how to handle the source's nonexistent §4301.62(B)(8) exception reference.
3. §4301.74: contempt procedure versus an ordinary misdemeanor Case Guidance route.
4. §§959.12 and 959.17: one shared penalty-list interpretation affecting both sections.
5. §959.15(B)/(C): sentencing for the expressly classified felony with no stated degree.
6. §5589.211: the effect of railroad preemption authority concerning a neighboring section.

A short response approving the proposed interpretation, correcting it, or keeping it held with a reason is enough. There is no need to copy statutes or review all 51 sections. These are optional parallel expansion decisions, not a request to clear all six before ordinary catalog work can proceed. The agent retains missing-rule, activation-certificate and underlying-duty research. Source capture and any missing legislative-history retrieval also remain agent work; the attorney questions do not transfer those tasks to you.

## Next platform milestone

Prioritize the six common section groups above. Finish their relevant dependencies, incorporate independent review, and prepare a single implementation batch that:

1. Updates or reuses canonical records with the supported penalties and exceptions, including appropriate translations.
2. Makes citation/subsection matching and ambiguous-name handling explicit; saved cases require confirmation when identity changes.
3. Demonstrates search and Case Guidance behavior with synthetic examples before publication. Real charging-document examples, if later needed, should be deidentified and never committed with personal information.
4. Passes source freshness and publication gates plus end-to-end checks. Repair the existing GitHub dependency-install failure so remote checks provide useful evidence again.

Do not require the rare railroad, scarcity-rule or unclassified-felony issues to resolve before shipping an independently validated common-charge batch. Keep those records held with reasons. Conversely, do not call the common-charge batch ready merely because its penalty grades are known.

## What transfers to future states

Reuse acquisition/version accounting, exact source evidence, grouped penalty-source review, stable record identity, and change-detection checks. Review a shared definition or sentencing rule once and record where it matters. Separate legal judgment from acquisition and clerical work. Keep a list of unresolved sources instead of escalating every missing fact to an attorney.

The Ohio-specific legal interpretations will not transfer automatically. We have not yet measured end-to-end time savings for another state. The next useful efficiency measure is **reviewed records delivered to the platform per batch**, alongside serious errors caught and the amount of attorney time required. Lines of code, pages of reports and raw extracted sections are not measures of database quality.

## Reproduce this handoff

```sh
node --import tsx scripts/data-review/review-ohio-dependencies.ts
```

This validates the committed research against the existing batch, enumeration and catalog, then regenerates the readable report. It makes no network calls, reads no credentials or user cases, and writes no runtime or production data. The original batch and attorney responses are preserved.
