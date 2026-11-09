# Florida harm-family sentencing corrections

This batch completes ordinary and conditional sentencing guidance for eleven existing reviewed Florida choices. It adds no charge IDs, changes no primary categories or aggregate counts, and renews no receipt. Each choice retains its own statutory identity, conduct subdivision and grading evidence. Existing translated base summaries and established holds remain intact.

| Primary provision | Existing identity | Ordinary grade | Conditional §741.2801 grade |
| --- | --- | --- | --- |
| 782.07(1) | Manslaughter | F2 | F1 |
| 782.07(2) | Aggravated manslaughter of an elderly person or disabled adult | F1 | Life |
| 782.07(3) | Aggravated manslaughter of a child | F1 | Life |
| 825.102(1) | Elder/disabled-adult abuse without great bodily harm | F3 | F2 |
| 825.102(2) | Aggravated elder/disabled-adult abuse | F1 | Life |
| 825.102(3)(b) | Elder/disabled-adult neglect causing great bodily harm | F2 | F1 |
| 825.102(3)(c) | Elder/disabled-adult neglect without great bodily harm | F3 | F2 |
| 827.03(2)(a) | Aggravated child abuse | F1 | Life |
| 827.03(2)(b) | Child neglect causing great bodily harm | F2 | F1 |
| 827.03(2)(c) | Child abuse without great bodily harm | F3 | F2 |
| 827.03(2)(d) | Child neglect without great bodily harm | F3 | F2 |

The table's conditional column does not assert that every charged case is domestic violence. The product explains the required family/household relationship, prior qualifying conviction at the time of the offense, July 1, 2026 effective boundary, and the difference between expressly listed domestic-violence offenses and other offenses resulting in physical injury or death. Psychological injury or risk alone does not satisfy the residual physical-injury/death clause. A qualifying separately listed assault or battery can have different elements.

Ordinary F3/F2/F1 ranges and fines come from §§775.082 and 775.083, with the statutory higher-gain/loss fine qualification. The conditional F1-to-life explanation uses the applicable post-1995 life-felony rule, not a universal fixed forty-year ceiling. Repeat-offender and other case-specific sentencing remain qualified. Section 741.283's intentional-bodily-harm prerequisite is not inferred from culpable negligence, and its state-incarceration exception is preserved.

## Source-specific safeguards

- Child neglect keeps the caregiver's willful-omission requirement and the independent, unsupervised activity exception, including its willful-and-wanton endangerment qualification. The separate failure-to-protect branch is not erased.
- Elder isolation retains the reasonable-welfare-protection defense in §825.102(1)(d).
- Aggravated battery references retain both §§784.03 and 784.045. Elder/disabled-adult and child/caregiver definitions remain bound to §§825.101 and 827.01.
- Manslaughter retains its existing chapter 776 justification inventory and §§782.03/782.04 exception dependencies. The two aggravated manslaughter branches separately incorporate their own elder or child neglect provisions.
- Definitions outside the charged subdivision have their own `incorporatedConduct` spans. They are not treated as additional charged conduct, and the assembler's subdivision scope guard is unchanged. A separate validator rejects missing rows, missing or wrong-scope bindings, altered source hashes, invalid offsets and altered quotation text.

## Acquisition and accounting

The packet binds 29 official sections. Ten documents reuse recent genuine candidate acquisitions from the preceding review; nineteen exact sections were acquired on November 8, 2026. All nineteen reacquired legal-text hashes match the retained baseline. The July 1, 2026 boundary reuses the previously retained public chapter 2026-86 effective-date clause, its official URL and quote hash; it does not represent a new legal approval. A matching hash supports reuse of the reviewed text; it does not issue a receipt or silently clear other records.

The historical domestic-applicability screen remains a frozen inventory. This packet is the successor treatment for eleven of its fifteen injury/death-priority rows, not a rewrite of its historical counts or an assertion that the residual queue is complete. The remaining two murder and two DUI identities are outside this batch. Their differing predicates and sentencing structures need their own coherent treatment. The seven previously corrected records are unchanged.

All eleven revised sentencing explanations remain available in English, Spanish and Chinese, using the existing draft-translation notice for translated content. Existing translated base summaries are not replaced by English fallbacks.

## Reproduction and runtime boundary

```sh
node --import tsx scripts/data-review/florida-harm/prepare.ts --check
./node_modules/.bin/vitest run tests/florida-*.test.ts tests/data-sources-inventory.test.ts
npm run check
```

These commands use retained evidence and pure source builders, without a database. `--prepare candidate.json` creates the candidate corrective packet. `--integrate` updates only the eleven corresponding definitions, assembler inputs, evidence and eligibility bindings. Integration rejects changed shared source bodies and leaves all other definitions and decisions intact.

The old reviewed receipt is byte-identical to the base. It neither matches the corrected report nor has a current time window, so the 101-record reviewed family remains withheld. Neither merging this batch nor regenerating its evidence authorizes restoration. The independent fifteen-persons family and its receipt are untouched. No imports, migrations, deployment, monitoring activation or receipt renewal occur in this batch.

This draft starts from PR #127 head `3619495833d7d1523bdd4323f694545c3a54f316`. It can be reviewed independently of the next Ohio batch because it changes only Florida-specific files and no common catalog counters.

Validation: 108 tests passed across 18 Florida and aggregate-count suites, with 43 existing skips; application typecheck and offline packet reproduction passed. The final effective-date binding addition passed its nine focused harm/history checks. Exactly eleven existing reviewed drafts changed; both Florida receipt files are byte-identical to the base.
