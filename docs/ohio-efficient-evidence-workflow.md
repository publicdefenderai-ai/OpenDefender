# Ohio batch evidence workflow

## Current handoff: focused substantive review

The current catalog/Chapter 2903 batch has now received substantive analysis
and all focused review responses have been integrated.
Use **`scripts/data-review/output/ohio-focused-manual-review.html`** for the
readable handoff, or `ohio-focused-manual-review.csv` for the decision sheet.
The older `ohio-batch-manual-review` files were acquisition-stage analysis prompts,
not a finished attorney queue.

- 97 prior groups analyzed: 85 routine offense sections and 12
  supporting/procedural sections.
- 125 structured source-first drafts, with complete source text, conduct/grade
  summaries, exact evidence spans, and separately hashed supporting sources.
  Seven analyzed sections already have independent source-first records.
- Three focused legal questions are resolved and zero are pending. The preserved
  original questions concern §2903.16's reckless-neglect element/grade overlap,
  §2903.13's incorporated HMO definition, and §2923.01's mismatched
  computer/email predicate cross-reference.
- No remaining agent-owned acquisition items in this scoped handoff.
- No catalog, runtime, database, approval-pin, or published-app changes.
  The 29 configured selectable charges are unchanged. Drafts are not publication
  approval, localized explanations, or complete statewide coverage.

Revalidate and regenerate the handoff offline:

```sh
npx tsx scripts/data-review/run-ohio-substantive-review.ts
```

The command consumes the recorded `ohio-substantive-findings.json`, applies the
durable `ohio-substantive-review-decisions.json` without overwriting those baseline
findings, and rejects changed primary/supporting hashes, stale sources, inexact
quotations, duplicate identities, and incomplete assignment coverage. It also
verifies the submitted review file against its recorded content hash. It does not
re-review new text automatically.
The separate assembly script is a deliberate import of recorded analysis, not a
source-refresh or approval mechanism.

The response ledger is hash-bound to each baseline finding, the submitted review
file, and every supporting authority used for that response. Reruns preserve the
recorded decisions and verbatim reviewer notes; changed evidence fails closed
rather than silently rebinding a decision. Integration records scoped legal
review—it is not bulk publication approval and does not alter the publication
gate.

The substantive pass used 22 bounded HTTP requests for missing penalty/reference
sources and current cannabis provisions; web research for official repeal context
was separate. This is not an end-to-end time or Agent-cost claim.
The targeted test runner reported 40 passing tests across three files; the shell
deadline expired during runner shutdown. The script/shared/server typecheck passed,
the complete packet compiled, and the unchanged app rendered.

## What this completes—and what it does not

Response-integration validation passed 15 targeted tests covering the three
interpretations, unchanged original text, partial responses, changed authority,
duplicate decisions, evidence retention, and the publication boundary. The
script/shared/server typecheck passed, and the unchanged app rendered.

This workflow consolidates source acquisition, caching, literal statutory-name extraction, reference triage, evidence packets, and durable review notes. It has been applied to all 134 current Ohio catalog records (105 withheld), plus the nine remaining offense-bearing sections in the Chapter 2903 inventory.

**It is not an automated legal reviewer or a completed Ohio catalog expansion.** It does not approve source pins, create new charge explanations, reconcile ambiguous legacy identities, or publish new selectable charges. Statewide section discovery outside Chapter 2903 remains incomplete. The 29 configured selectable records are unchanged.

The acquisition-stage output below is historical context, not the current attorney handoff. The focused substantive packet above supersedes its generic questions. Runtime source-first catalog expansion remains separate.

## Commands

```sh
# Default: offline preparation from fresh, hash-validated local evidence.
npm run review:ohio-batch

# Acquire missing/stale evidence within an explicit HTTP budget.
npm run review:ohio-batch -- --acquire --max-requests=100 --depth=1

# Retry a previously failed acquisition deliberately.
npm run review:ohio-batch -- --acquire --retry-failures --max-requests=20 --depth=1
```

Do not run two writers concurrently. Use the workflow in development, not as an automatic production publication process.

The default depth is two. Depth limits are intentional: a textual reference is not automatically applicable to a charge. Fresh evidence is reused for seven days without resetting its original acquisition timestamp. Cached failures have a 30-minute cooldown; force/retry flags are explicit. A failed refresh never falls back to the older document.

## Efficiency changes

1. **Whole chapters instead of one request per section.** Ohio chapter pages contain full section text. The collector isolates each section and runs the existing section extractor on it. Exact heading, section identity, URL, effective date, and normalized content hashes are checked. The canonical section URL and actual chapter acquisition URL are both retained.
2. **One request per needed chapter per run.** Other sections returned by the same response populate the cache for subsequent targets. If a chapter layout cannot be safely parsed, the collector may fetch the exact section page within the same request budget. It never guesses a neighboring section.
3. **Explicit incorporation leads rather than all numerical references.** Definition and penalty references are collected; other mentions remain review leads. Model Penal Code and federal-regulation citations are not converted into Ohio section URLs.
4. **One prepared packet per statutory section.** The packet groups affected catalog IDs, quoted guilt clauses, grading and definition evidence, exact text offsets, hashes, and source URLs.
5. **Durable decisions.** Review and reference-selection ledgers survive reruns. Changed evidence invalidates applicability decisions and flags legal decisions for another review, without deleting the old notes.
6. **Separate approval boundary.** Collection, name matching, a reviewer note, or a successful batch exit never authorizes publication. Existing source pins, freshness gates, and reviewed catalog changes still control it.

## Outputs

All generated output is under `scripts/data-review/output/`:

- `ohio-batch-manual-review.csv`: spreadsheet template for review.
- `ohio-batch-manual-review.md`: readable questions, evidence and technical blockers.
- `ohio-batch-review.json`: full structured evidence packet.
- `ohio-batch-review-decisions.json`: durable decision ledger; this is not overwritten with blank decisions on rerun.
- `ohio-batch-reference-decisions.json`: hash-bound include/exclude decisions for reference applicability.
- `ohio-batch-review-state.json`: pending, recorded, or changed-evidence review state.
- `ohio-batch-source-cache.json`: acquisition evidence, not an approval manifest.
- `ohio-batch-run-receipt.json`: scope, timing, request counts, failures and coverage limits.
- `ohio-batch-runs/`: prior run packets.
- `ohio-substantive-review-decisions.json`: focused substantive responses bound
  to baseline findings, the submitted review file, and reviewed authority hashes.
- `ohio-substantive-review-authorities.json`: additional supporting-authority
  documents used by those responses.

Generated CSV/Markdown/packet files are refreshed on rerun. Preserve completed review work in the decision ledger, not by editing those generated files in place. Returned spreadsheets require deliberate transcription/reconciliation into the ledger; there is no automatic spreadsheet-to-publication import.

Reference decision example:

```json
{
  "schemaVersion": 1,
  "decisions": {
    "2903.16": {
      "sourceHash": "<exact hash from the evidence packet>",
      "references": {
        "2901.01": {
          "decision": "include",
          "reason": "<why this reference applies to the proposed claim>"
        }
      }
    }
  }
}
```

Only references actually present in the source text can be selected. A source-hash change disables prior reference decisions. Legal decisions allow `publish_candidate`, `correct`, `split`, `reclassify`, `deduplicate`, `hold`, and `remove`; even `publish_candidate` is review evidence, not a runtime approval.

Exit 1 means the command could not prepare a valid run. Exit 2 means unresolved acquisition, coverage, pinned-source, or bounded-reference work remains. Reports are still emitted for independent successful work.

## Applied results and remaining work

The applied evidence pass covered 110 primary sections and prepared 139 literal named-offense candidates. Those candidates are not necessarily distinct charges. All catalog targets have primary official text.

There are 97 section-level manual-review groups. Categories overlap:

- 87 groups include legacy identity/citation reconciliation.
- 19 include multiple named-offense or grading/conduct boundaries.
- 78 include proposed claim-scope review.
- 66 include applicability decisions for additional statutory references.

Two primary groups have direct incorporated-source gaps:

- Assault, §2903.13: the referenced §3727.01 does not currently resolve to section text.
- Nonsupport, §2919.21: the referenced §3115.31 does not currently resolve to section text.

These are not resolved by repeated downloads or by guessing replacement definitions. Their legal effect/current replacement needs to be established before relying on affected summaries. Deeper references beyond the selected acquisition depth remain explicitly listed in the run receipt.

Other attorney and Spanish/Chinese fluent-speaker sign-off requirements remain.
Additional statewide discovery and substantive source-first charge construction
are still needed; do not describe this scoped focused-review completion as
statewide completion.

## Measurement and verification

The last acquisition pass before documentation took 10.5 seconds using an already populated cache: 416 evidence documents reused, five target acquisitions, and 14 actual HTTP requests including fallbacks. That is **not** the time or cost of this implementation turn. Earlier development passes made hundreds of individual requests before chapter-level acquisition was implemented; those costs must not be hidden in a throughput claim.

A Chapter 2903 bulk download yielded all 40 sections. All 19 comparisons against existing approved section hashes matched. This proves compatible extraction for that sample, not universal legal correctness.

The batch itself makes no paid model calls. The receipt does not know Replit Agent's cost, and no end-to-end cost saving is claimed.

Validation included batch regression tests, script/application-shared type checking, existing chapter/refresh regressions, and a running-app screenshot. No production database change or publication was performed.