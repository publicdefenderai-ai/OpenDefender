# Ohio verification batch one: recorded substantive findings

PR #4 was merged at `6df7c7405a979c0771aee2d4e7158de263482eed`.
This follow-up reads and records the conduct and penalty relationships for the
47 assigned sections linked to §§4301.99, 959.99, 3767.99 and 3743.99, plus the four
mandatory-fine cases identified in review: §§5589.211, 1321.141, 1321.592 and 4712.071.

## What is completed

- 51 section-level conduct analyses and 84 subsection/condition-specific penalty
  mappings, bound to 59 recorded authorities from the September 23 snapshot.
- Full primary and penalty texts preserved alongside the authored findings;
  exact penalty-division spans support the stated grades. Mappings include the
  remainder of a penalty division rather than stopping at the first sentence.
- All ten legacy catalog rows linked to the four priority sources have recorded
  analysis. Six of these were in the 20-row discovery-investigation bucket;
  the discovery report now distinguishes those six from the 14 without a batch
  analysis. It does not change their reconciliation verdict or approve a rename.
- The four mandatory-fine cases now carry `additionalPenalty: true` in extracted
  grade evidence and an explicit applicability-review reason. Degree alone is
  not presented as the complete penalty.

The readable findings are in
[the batch report](../scripts/data-review/output/ohio-penalty-verification-batch-one.md).
The durable authored input is
[batch-one.json](../scripts/data-review/ohio-verification/batch-one.json).
The generated JSON provides the evidence and catalog links for subsequent work.
This is substantive statutory analysis, not 51 newly published or independently
attorney-verified charges. Offense/charging units may split further than sections.

## Material distinctions preserved

| Source | Recorded result |
| --- | --- |
| 3743.60 / 3743.61 | Different licensing/compliance grades; the repeat-offense F5 escalation applies to the specified division I conduct, not every neighboring prohibition. |
| 3743.64(C) | M1 plus suspension/revocation provisions in the remainder of the penalty division. |
| 3743.65 | A–E M1; F F5; G M1; H minor misdemeanor. Discharge exceptions and subsection selection remain essential. |
| 3767.32 | A and B differ in culpability, property/receptacle scope and exceptions; M3 includes a possible cleanup order. The natural-person qualification in the shared clause concerns 3767.30. |
| 4301.631 | B purchase has a special fine-only penalty; C–I carry M4. |
| 4301.65 | Sale/offer differs from purchase/use; the sale offense has a repeat-offense increase within five consecutive years. |
| 4301.69 | Underage E(1) conduct is M3; furnishing under A has an unspecified-degree misdemeanor with its own fine/jail language; other divisions carry M1. |
| 959.131 | Actor, culpability, harm and prior-offense differences are retained, along with ancillary sanctions. |
| Mandatory-fine cases | 5589.211 states M1 and $5,000; 1321.141, 1321.592 and 4712.071 state minor misdemeanor and $100–$500. No substitution of a degree-default fine. |

These are source mappings for the recorded date, not individualized sentencing
advice. The full report retains exceptions and remaining work for every row.

## Ten section-specific holds

| Sections | Remaining issue |
| --- | --- |
| 3767.30 | Actor-specific association/natural-person penalties versus corporate conduct wording, plus enforceability review. |
| 4301.15 | Identify the actual distribution rule and its operative version. |
| 4301.21 | Literal reference to 4301.62(B)(8) does not match the recorded B subdivisions; do not silently substitute C(8). |
| 4301.691 | Obtain evidence for the express federal-mandate and secretary-of-state activation conditions before treating alternate ages as operative. |
| 4301.70 | Identify the underlying residual duty and confirm that another penalty does not apply. |
| 4301.74 | Resolve the contempt procedure versus separately charged misdemeanor boundary. |
| 959.12 / 959.17 | One shared list-scope interpretation remains flagged; neither conduct section has a division C. |
| 959.15(B)/(C) | The statute says felony with a fine but supplies no degree in that clause. Do not infer a degree or prison term. |
| 5589.211 | Resolve federal preemption/enforceability before publication. The related 5589.21 ruling does not automatically decide this provision. |

These ten held sections represent nine grouped issues. They are retained research
holds, not nine attorney questions sent without further work. The other 41 rows
have recorded source mappings without one of these particular holds; they still
need relevant dependency, currentness, independent review and release validation.

Official spot checks confirmed the cross-reference wording in
[§4301.21](https://codes.ohio.gov/ohio-revised-code/section-4301.21),
the activation wording in
[§4301.691](https://codes.ohio.gov/ohio-revised-code/section-4301.691),
and penalty provisions in the four priority sources and §§5589.99, 1321.99 and
[4712.99](https://codes.ohio.gov/ohio-revised-code/section-4712.99).
The [Ohio court's CSX summary](https://courtnewsohio.gov/cases/2022/SCO/0817/200608.asp)
reports preemption of §5589.21; the full opinion and its relevance to §5589.211
remain research, not a finding in this batch. Live spot checks do not replace or
renew the pinned snapshot.

## Reproducibility and validation

```sh
node --import tsx scripts/data-review/verify-ohio-penalty-batch.ts
```

The validator checks assignment coverage, source text/hashes/URLs/effective dates,
source eligibility, exact spans, stated-grade evidence and the nonpublication
boundary. It fails on changed authorities rather than reattaching earlier
judgments to new text. These are structural/evidence checks, not independent
validation of every legal interpretation. Authored findings are not overwritten
by discovery refreshes, and existing attorney-response files are untouched.

The full Ohio unit suite passed 242 tests across 27 files, excluding the
DB-backed runtime boundary integration suite. The script typecheck passed.
The ordinary discovery refresh still has 239 catalog rows: 151 mechanical
proposals and 88 unresolved rows. Its scope queue grows 320 → 324 because the
four special-fine relationships are correctly held. The new substantive overlay
tracks completed source analysis separately; it does not hide unresolved work by
weakening reconciliation rules.

## Next batch

Close the shared definitions, exceptions, rules and sentencing dependencies for
these mappings together, prioritizing the ten linked legacy rows. Use the
source-specific holds above as a finite research assignment. Then request only
legal judgments that remain after that work. General sentencing, independent
accuracy review, charging-document alias tests, Case Guidance integration and
publication approval remain outside this batch. Source-mapping completion is
now a durable result that the next batch can build on rather than repeat.
