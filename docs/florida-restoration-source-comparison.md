# Florida reviewed-family source comparison

All 130 official dependency sections for the corrected 101-record family were acquired successfully on November 17, 2026, between 17:39:02.320 and 17:41:00.321 UTC. Every candidate text, heading and extracted effective-date value matches every corresponding retained version in the current reviewed report. All 101 identities and their 920 required dependency bindings are individually accounted for in the result. All pages identify the Florida Statutes 2026 edition. There are zero changed-text, formatting, metadata-mismatch or unavailable outcomes in this acquisition. [Per-section results and affected charge IDs](../scripts/data-review/florida-launch/restoration-comparison.json)

The baseline is the corrected report on bf5dad01, following the merged legal-review batches. Comparing the older October receipt alone would miss the later corrections. The report records the active report, receipt, eligibility, cache and definition-file hashes before and after the comparison. They match exactly.

The official text contains 41 lines mentioning effective dates, expiration or related terms. These are retained in the comparison for inspection. None of the scanned lines identifies a new post-acquisition operative date or repeal relative to the reviewed baseline. Many concern expiration of vehicle registrations, orders or leases. Section 893.02 also retains a contingent cannabis-definition provision tied to a constitutional amendment. The separate [constitutional-trigger review](florida-cannabis-constitutional-trigger.md) now supplies the post-2017 election screen, failed 2024 proposal and current constitutional evidence. It records public evidence only; activation requires separate review. This comparison alone did not resolve that trigger. [Florida Constitution](https://www.flsenate.gov/Laws/Constitution/) Existing offense-date qualifications and previously reviewed judicial limitations continue to matter. Null extracted effective-date values remain null. Page edition, unchanged text and a new retrieval timestamp do not independently establish every case's legal applicability.

This comparison supports proceeding with a candidate reassembly using the existing corrected decisions. It does not support copying the October receipt's report or eligibility hashes. The subsequent proposal must rebind the current report and approved definitions to the newly acquired evidence, preserving identity, conduct, grading, translations, holds and all existing applicability conditions. Compare the exact resulting diff before approving any quarterly receipt or production import. If reassembly introduces a substantive difference, stop that record for review.

The oldest successful retrieval would cap a proposed three-calendar-month window at **February 17, 2027, 17:39:02.320 UTC**. This is a proposed ceiling calculated from evidence. No receipt was issued. The old 101-record family's receipt remains expired and mismatched; its runtime gate remains closed.

The candidate acquisition resides outside the checkout at `/private/tmp/od-fl-restoration-evidence`. Each section has a raw HTML response, response-hash/acquisition metadata and parsed candidate document. A full comparison can be reproduced there without network access:

```sh
node --import tsx scripts/data-review/florida-launch/compare-reviewed-sources.ts /private/tmp/od-fl-restoration-evidence --replay
```

To acquire a fresh candidate set, use a new absolute directory outside the repository and omit `--replay`. The command discovers the current reviewed dependency set, paces sequential requests, applies the official exact-section parser, rejects an unexpected edition, checks retained hashes and verifies active-file preservation. It never calls the existing mutating assembly command or a database.

Validation covers changed text, formatting-only differences, metadata changes, multiple retained versions, corrupt baseline hashes and rejection of the active checkout as a candidate destination. The full 130-section acquisition and offline replay passed.
