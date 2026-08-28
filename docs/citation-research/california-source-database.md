# California source database

**Scope:** the selectable California canonical charge records in
`shared/california-authority.ts`.

## Source policy

The database uses California Legislative Information and California Judicial
Council references already approved by the California authority contract. The
current California Legislative Information site disallows automated crawling,
so this first database release is **reference-only**:

- It stores the exact official URL, citation, subdivision, canonical charge
  title, effective-date evidence, manifest-import time, and a SHA-256
  fingerprint.
- It does not fetch or store California source text.
- Reference-only rows leave source retrieval/check timestamps and snapshot
  `retrievedAt` null; a manifest import is not represented as a source
  retrieval or verification event.
- The fingerprint is explicitly labeled `reference_metadata`; it is not
  presented as a hash of statutory text.
- A future text snapshot may be added only after a permitted official bulk/API
  channel or reuse permission is documented.
- OpenLaws is not an acquisition source, verifier, fallback, or seed input.

## Versioning and review

Each source reference has a versioned snapshot. The currently linked snapshot
continues to support user-facing charge provenance. If a later refresh changes
its citation, URL, subdivision, title, or currentness evidence, the importer
creates a `pending_review` snapshot and a high-priority source-change queue
entry. It does not replace the current charge link or silently alter guidance.

The database also records each seed/refresh run and keeps charge relationships
separate from source snapshots. One canonical charge may link to multiple
statutory, grading, penalty, currentness, and jury-instruction provisions.

## Refresh command

Use the dry run to inspect coverage without a database connection:

```text
npx tsx scripts/data-review/seed-california-source-database.ts --dry-run
```

The write mode requires the configured database:

```text
npx tsx scripts/data-review/seed-california-source-database.ts
```

Attorney review remains pending for every California canonical record. Source
verification is not attorney approval.