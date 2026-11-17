# Florida: proposed restoration of 101 reviewed choices

Historical proposal: the [activation candidate](florida-reviewed-activation.md) incorporates the exact artifacts in a separate change. The generator reports original versus installed input state separately; the frozen summary below retains proposal-time observations.

This is a candidate for review, not an issued receipt or permission to activate. The existing expired receipt and all active report, eligibility, cache, definitions and pins remain unchanged. The 101 choices remain withheld under that receipt.

## Concrete proposed change

The official comparison acquired 130 sections on November 17, 2026 and matched every retained text, heading and effective-date value. Those sections support 221 distinct source keys and 920 dependency references across the 101 corrected identities. The proposal preserves all source text, draft content, definitions, decision rows, holds and approval hashes. It changes only the cloned report's retrieval timestamps, the cloned eligibility's report hash, and the proposed receipt binding/window.

| Proposed receipt field | Value |
| --- | --- |
| Policy | quarterly-v1 |
| checkedAt | 2026-11-17T17:43:25.113Z, the completed comparison time |
| Oldest actual acquisition | 2026-11-17T17:39:02.320Z |
| expiresAt ceiling | 2027-02-17T17:39:02.320Z |
| reportHash | `9d1f28e1232241bfaac0bf8707a7b176ed9a18e1d067eb622381d42685eb2c55` |
| eligibilityHash | `848c4e4d54ab229ef55879a9f7e627e50291bd0266032fbd754810992ae10196` |
| Proposed receipt JSON hash | `8ad28ad89cfcd43b2b45c03dca6668815b08d7a9fa4aff16720a508b9d8f0144` |

Hashes use SHA-256 over `JSON.stringify(parsedObject)`, matching the runtime validator, not the pretty-printed file bytes. The committed [proposal](../scripts/data-review/florida-launch/restoration-proposal.json) supplies all 101 IDs, 221 document bindings, input file hashes and comparison/constitutional-evidence hashes. Later preparation cannot extend the deadline: it remains anchored to the oldest actual acquisition. The proposed checkedAt describes source comparison, not a claim that approval was granted then.

## What still requires review

1. Accept the unchanged-source comparison and the corrected 101-record baseline together; unchanged raw law does not automatically approve changes made since the old receipt.
2. Review the [public constitutional-source evidence](florida-cannabis-constitutional-trigger.md). This packet does not decide legal applicability. Activation requires separate review; a passing technical validator does not supply that approval.
3. Confirm the exact proposal hashes and unchanged decision rows. Any drift must stop preparation and receive a new comparison/reconciliation, rather than rebinding arbitrary changed content.
4. Separately approve issuance of the reviewed receipt and incorporation of its matching report/eligibility artifacts. This PR does not perform that step.

## Replit: read-only checks now

Use the reviewed code revision and a fresh external candidate folder. No database or production credential is needed:

```sh
node --import tsx scripts/data-review/florida-launch/prepare-restoration-proposal.ts /tmp/florida-proposal-review-unique
node_modules/.bin/vitest run tests/florida-restoration-proposal.test.ts tests/florida-restoration-comparison.test.ts tests/florida-cannabis-trigger-review.test.ts
```

The command creates `proposed-report.json`, `proposed-eligibility.json`, `proposed-receipt.json` and `proposed-summary.json` only in that external folder. It refuses checkout destinations, existing output files and output-file symlinks, verifies all active input hashes before and after, and uses the production record builder and receipt validator on candidate objects. It does not import the proposal as active data. The current receipt must fail validation against the candidate; the proposed receipt must pass at comparison time and fail at expiry.

Report the exact revision, reproduced summary hashes, 101 IDs, 920 bindings and test result in one handoff. Do not install the proposed files, run the existing mutating prepare/import commands, change database mappings, publish, or enable monitoring. A fresh acquisition is unnecessary merely to reproduce this reviewed comparison while its evidence window remains valid; new source changes or elapsed evidence validity require reassessment.

## Later steps, only after separate approval

Codex can prepare the small activation PR using the exact reviewed candidate report, eligibility binding and receipt. Approval must explicitly cover those artifacts; no decisions or holds should be loosened. Preserve the acquisition cache separately and do not let later generic regeneration overwrite the reviewed report with stale cache timestamps.

After that PR's review and merge, Replit can inspect the exact release revision, schema proposal and normal release gates. An import and deployment require their own authorization. Then verify the complete expected IDs through the public paginated selector and linked authority records, not merely a stored count. The proposed 101 additions are not a promise that other independently gated families are live or that Florida is exhaustively covered.
