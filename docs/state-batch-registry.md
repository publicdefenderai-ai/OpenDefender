# Adding a reviewed Ohio or Florida publication batch

The existing `shared/<batch>-publication.json` definition is the registry entry. Use the state's full lowercase name as the prefix (for example, `ohio-driving-license`). The deadline monitor and request-scope test discover these definitions independently of whether a receipt exists. A missing receipt still fails the monitor. The California archive, Ohio pilot, and legacy reviewed Ohio and Florida families retain their explicit receipt requirements.

Keep the existing publication and runtime wiring for the new family. Its source module exports the batch's freshness check (for example, `isOhioDrivingLicenseSourceFresh`). The request-scope suite substitutes that check while exercising the actual eligibility function and actual batch ID sets. It derives expected IDs from the separately retained publication evidence and runs each family stale in isolation against both the release-fixture and database-provider paths. Each batch still needs its own substantive evidence, receipt validation and release checks.

The published totals are computed from the configured charge catalog and explanations. The production client build embeds only the computed counts for the transparency page. Catalog totals do not measure production imports or live availability.

Run the shared integration checks with:
```sh
npx vitest run tests/authority-eligibility-request-scope.test.ts tests/statutory-receipt-freshness.test.ts tests/data-sources-inventory.test.ts
```

## Parallel review and merge order

Start Ohio and Florida research in parallel. Before wiring a new batch into the app, fetch main and check whether an open PR for the same state already changes the same catalog, eligibility or import code. If it does, build on that PR's current head and target its branch for review. Otherwise use current main. Record the base and intended merge order in the draft so Claude can review just the new batch.

Before sending drafts to Claude, simulate the intended sequence in a checkout with current local revisions. For example, after fetching main and both draft heads:

```sh
sh scripts/data-review/check-batch-integration.sh origin/main ohio-draft florida-draft
```

Pass the actual branch names or commit IDs in merge order, including a pending parent before its child. The check tries the second branch against the result of the first. It creates temporary Git objects without changing branches, files, the index, or GitHub. A conflict prints its files and stops. A clean simulation establishes only that Git can combine the edits. Run the registry, independent eligibility and per-batch evidence checks against the combined result to catch a missing family or silently changed behavior.

If main changes during review, repeat the simulation. A branch that is behind can merge directly when the simulated result and normal repository checks pass. For a conflict, integrate the newer base into the open draft, preserve each family's wiring, and tell Claude the new head and what changed. When a stacked parent has merged, target main and verify the child diff contains only its own changes before merging.
