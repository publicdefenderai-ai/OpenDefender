# Ohio residual publication batch

Base: merged PR107 evidence at release candidate `446ec93d063d80a4140e1714e39ce03422dace60`. This batch carries all fourteen residual mappings into individually supported catalog records across eleven sections. It is not statewide completion.

## Outcome

Fourteen new configured identities: thirteen primary felony choices and one misdemeanor choice. They cover kidnapping, abduction, extortion, sexual extortion, three separate credit/usury branches, trafficking, unlawful conduct with identification documents, aggravated arson, arson, disrupting public services, vandalism, and criminal mischief.

The three section 2905.22 choices retain the official heading. Their catalog codes explicitly distinguish (A)(1), (A)(2), and (A)(3), avoiding invented short offense names and preventing the misdemeanor records branch from inheriting the felony grade of its siblings.

Legacy `oh-vandalism` is additionally withheld through the existing explicit-reselection mechanism. It characterized section 2909.05 as a misdemeanor with up to one year in jail, while the retained statute establishes F5/F4/F3 branches. Saved legacy IDs are not silently mapped to the new choice. Both ID-based and code-only saved-guidance resolution reject that legacy identity. The authoritative selector must likewise omit it.

Gross additions are fourteen; net potential eligible increase is thirteen after removing that incorrect legacy choice. Catalog count rises from 258 to 272 and includes withheld historical entries; it is not the number users can select. Publication/production availability is reported separately below.

## Evidence and legal scope

The batch reuses 42 official documents acquired November 3-5, 2026. No source text or retrieval date is rewritten. Each definition has its own conduct, grading, complete-primary context, supporting section set, exact quoted spans, and hashes. Runtime validation binds definitions back to PR107's individually scoped mapping, rejecting expanded parent-division conduct and missing dependencies.

Important distinctions:

- Kidnapping's fifteen-years-to-life and ten-years-to-life specification branches remain separate from ordinary F1/F2 sentencing. The generic 50% maximum explanation expressly applies only to ordinary non-life indefinite terms.
- Trafficking uses the statutory ten-to-fifteen-year minimum selection, not the ordinary three-to-eleven-year F1 minimum.
- Sexual extortion preserves the specific prior-offense/protected-victim conditions and applicable allied-offense language.
- Document servitude includes all nine listed predicate dependencies, including section 2907.323.
- Arson distinguishes threshold, purpose, and subsection grading, preserves consent defenses, and identifies the separately supported registration provisions.
- Vandalism retains the additional F5 fine separately from the conventional sentencing fine.
- Disrupting public services excludes (A)(3); criminal mischief excludes (A)(7). The existing section 1509.01 hold is unchanged. Whole-section evidence is context, not approval of excluded conduct.

No prior attorney decisions are reopened or altered. New Spanish/Chinese requests receive the explicit untranslated-English notice; existing translated summaries remain untouched.

## New-batch verification window

This creates the new residual batch's own acquisition-bound `quarterly-v1` window; it does not renew the pilot, reviewed, or major-batch receipts.

- Latest used acquisition / checkedAt: November 5, 2026 at 06:33:47.509 UTC.
- Oldest used acquisition: November 3, 2026 at 07:20:48.867 UTC.
- Expiry: February 3, 2027 at 07:20:48.867 UTC, three calendar months from the oldest acquisition.

Packet hash, source acquisition times, and shared quarterly policy are validated together. Regeneration cannot extend the period. A later source change or missing/expired/mismatched receipt fails closed. The initial acquisition set is reused within the existing seven-day candidate-admission interval; it is not described as a new source retrieval today.

## Review and deployment boundary

No database operations, migrations, import, production publication, existing receipt renewal, or monitoring activation are performed. Merge alone does not make these records selectable. The new batch requires independently reviewed code/evidence, a separately approved import with complete current source links, and deployment.

The prior production report of ten selectable choices is not the current code's evidence-complete inventory. The pilot nineteen, separately reviewed 104, prior major twenty, legacy choices, and new residual fourteen remain independently accounted for. With all relevant file receipts valid and the pilot receipt explicitly supplied, this branch's offline seed simulation yields 165 eligible IDs: eight legacy, nineteen pilot, 104 separately reviewed, twenty major, and fourteen residual. This is an offline eligibility result, not a claim that production has these rows or the required pilot schema.

For the eventual approved production reconciliation, compare actual complete linked IDs against the approved import's eligible set. Preserve the pilot schema/activation boundary, verify source holds and legacy-vandalism reselection, and report configured / eligible / actually selectable counts separately. Do not infer successful availability from a row count or receipt alone.

## Verification commands

- `node --import tsx scripts/data-review/prepare-ohio-residual-publication.ts --check`
- `npx vitest run tests/ohio-residual-publication.test.ts tests/ohio-residual-runtime-gates.test.ts tests/ohio-common-authority-boundary.test.ts tests/ohio-major-publication.test.ts tests/ohio-source-database.test.ts tests/data-sources-inventory.test.ts tests/statutory-receipt-freshness.test.ts tests/ohio-residual-verification.test.ts`
- `npm run check`

The first focused run exposed historical test assumptions: a fixed Ohio catalog count and an eight-day future instant that no longer means all receipts have expired. Those tests now preserve their historical clock and derive a post-expiry instant from all Ohio windows. The public data-source totals are independently checked against the catalog. The browser release allowlist includes all fourteen new identities and explicitly excludes legacy `oh-vandalism`; adding that spec does not claim it has run.

Validation on this branch: all 63 focused tests passed across eight files; application typecheck and reproducibility check passed. Full regression and browser checks are reserved for the combined integration candidate, so they are not claimed here.
