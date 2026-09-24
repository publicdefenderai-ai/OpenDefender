# Ohio charge database: progress and next delivery

Updated September 24, 2026. This is the current navigation page for the statewide discovery and 51-section follow-up. Earlier Ohio pilots and their approvals remain separate; these counts do not replace their histories.

## Current implementation handoff

See [Ohio coverage and remaining gaps](ohio-coverage-and-gaps.md). Four existing common-charge records now have corrected English/Spanish/Chinese summaries and supported penalty limits. Six older IDs require explicit reselection. Fireworks and underage-possession descriptive drafts remain held by the existing identity gate.

The full refresh observed a §1509.01 amendment effective September 23, 2026. Criminal trespass depends on that definition and is now held pending review. The current seed configures **133 selectable records**, not complete statewide coverage. No production database or deployment was changed here.

The corrections supplement the historical research rather than rewriting its original findings. The narrative and counts below describe that earlier research stage where noted. All six attorney responses have been recorded; no response to those original questions remains pending.

## The outcome we are building toward

A person should be able to find the charge on their paperwork, confirm the correct Ohio statute and subsection, and receive Case Guidance that uses the applicable conduct, penalties, exceptions and case stage. A label that sounds plausible is insufficient. A statute's presence in the code does not establish that every part remains enforceable.

The work has three distinct outputs:

| Output | What it does | Status for this batch |
| --- | --- | --- |
| Evidence inventory | Accounts for official provisions, versions, penalties and unresolved sources | Statewide enumeration exists; 51 sections have recorded conduct/penalty analysis |
| Reviewed charge records | Establishes names, citations, variants, aliases, exceptions and supported penalties | Ten catalog entries now have six concrete consolidation/correction proposals; four source-based entries already existed |
| Platform behavior | Uses approved records in search, saved cases and Case Guidance | Four existing records corrected locally; independent review, merge and deployment remain |

**We are building the evidence-backed database, but this batch is not yet a published catalog expansion.** Do not count a discovered section, extracted grade or authored analysis as a verified selectable charge.

## What the latest batch adds

Read [the catalog proposals and review questions](../scripts/data-review/output/ohio-dependency-review.md). The durable [research ledger](../scripts/data-review/ohio-verification/dependency-review.json) retains supporting statutory text, exact evidence, catalog baselines and remaining work.

- Ten catalog IDs receive explicit proposed dispositions across six statutory sections. Six are older definitions; four are existing source-based definitions. We propose consolidation rather than counting duplicates as new charges.
- Twenty-five additional statutes are preserved with hashes and effective dates. Six shared research modules cover sentencing, culpability, fireworks, liquor, animal provisions and lending. A shared module records its limited finding; it does not certify every dependency for its assigned sections.
- All nine prior hold issues have an owner and a proposed treatment: six recorded attorney responses and three agent research tasks. Scoped responses do not close the remaining research or approve publication. The held expansion candidates do not block work on the ten catalog entries.
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

The older proposals above are comparisons with repository definitions, not a claim that every older entry is currently served by the deployed app. Runtime publication gates and deployed availability were not checked in this research task. The figures above are ordinary adult statutory ceilings, not individualized or aggregate sentences. Source details and qualifications are in the linked report.

## Verification and maintenance

All 260 Ohio unit tests pass across 28 files; the database-backed runtime integration suite was excluded. The script typecheck and offline research validation pass. Three existing test files now use the committed evidence receipts’ shared validity interval rather than wall-clock time. Production expiry checks and the tests that require expired sources to be withheld remain intact.

The pilot receipt expired during this work. A genuine online check of all 61 previously pinned pilot sources found unchanged text, titles and effective dates; its receipt is renewed through October 1, 2026 at 19:33 UTC. This renews verification of existing pins; it approves no new charges and changes no source text. The separate reviewed-batch receipt still expires September 25 at 05:25 UTC and needs its own refresh before relying on it after that time. Neither receipt has been deployed by this research task.

## Attorney decisions recorded September 24, 2026

All six requested responses are recorded in the [research ledger and rendered report](../scripts/data-review/output/ohio-dependency-review.md). No further response to those original questions is pending.

1. §3767.30: stationary-service-only candidates; exclude the severed procession branch and keep corporate grading held. Default to excluding disputed misdemeanor candidates from active guidance while their legal basis remains unresolved. Subsequent-treatment checks remain agent work.
2. §4301.21(D): preserve the literal B(8) reference; label C(8) as the likely intended exception. The [source-anomaly inventory](statutory-source-anomalies.md) tracks this apparent error without rewriting the statute.
3. §4301.74: keep guidance simple and describe applicable procedural scenarios, including contempt. Do not infer an ordinary misdemeanor path solely from the grade or assume that both routes are legally available. Implementation and validation remain.
4. §§959.12 and 959.17: approve the whole-section M4 interpretation for both; remaining offense verification is separate.
5. §959.15(B)/(C): retain felony classification with degree unspecified, the expressly stated fine up to $10,000, and explicit uncertainty about incarceration authorization/range. Do not describe the offense as fine-only.
6. §5589.211: retain unresolved enforceability and the active-guidance hold; do not extend the neighboring-section ruling by assumption.

These are scoped decisions, not release approvals. The three agent research holds, historical-source retrieval, subsequent-treatment checks, and other dependency work remain agent responsibilities. The held expansion candidates do not block the independently validated common-charge batch.

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
