# Adding a reviewed Ohio or Florida publication batch

The existing `shared/<batch>-publication.json` definition is the registry entry. Use the state's full lowercase name as the prefix (for example, `ohio-driving-license`). The deadline monitor and request-scope test discover these definitions independently of whether a receipt exists. A missing receipt still fails the monitor. The California archive, Ohio pilot, and legacy reviewed Ohio and Florida families retain their explicit receipt requirements.

Keep the existing publication and runtime wiring for the new family. Its source module exports the batch's freshness check (for example, `isOhioDrivingLicenseSourceFresh`). The request-scope suite substitutes that check while exercising the actual eligibility function and actual batch ID sets. It derives expected IDs from the separately retained publication evidence and runs each family stale in isolation against both the release-fixture and database-provider paths. Each batch still needs its own substantive evidence, receipt validation and release checks.

The published totals are computed from the configured charge catalog and explanations. The production client build embeds only the computed counts for the transparency page. Catalog totals do not measure production imports or live availability.

Run the shared integration checks with:
```sh
npx vitest run tests/authority-eligibility-request-scope.test.ts tests/statutory-receipt-freshness.test.ts tests/data-sources-inventory.test.ts
```
