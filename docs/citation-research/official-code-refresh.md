# Minnesota, Virginia, and Michigan official-code refresh

The committed snapshots for the MN, VA, and MI citation comparison are
refreshed with:

```text
npm run review:official-code-refresh
```

The command:

1. Collects every MN, VA, and MI section currently present in
   `shared/criminal-charge-citations.ts`.
2. Bypasses the seven-day `.cache/official-code` response cache and retrieves
   each section over verified HTTPS.
3. Fails before changing committed fixtures if any official response is
   missing, malformed, or unavailable. If an existing cache is stale or
   invalid, it is reported as replaced instead of being reused.
4. Writes the raw HTML, retrieval timestamp, and SHA-256 hash to the
   corresponding `tests/fixtures/official-code/*-official-code.json` file.
5. Replays all three fixtures through
   `scripts/data-review/import-commission-citations.ts`, regenerating
   `commission-import-mn-report.json`, `commission-import-va-report.json`,
   `commission-import-mi-report.json`, and the combined comparison report.

Run this command from a network-enabled review environment when an official
code update is expected. A failed refresh leaves the previously committed
fixtures and reports in place.