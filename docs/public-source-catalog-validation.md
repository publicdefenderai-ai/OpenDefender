# Public-Source Catalog Validation

**Validation date:** 2026-08-29
**Scope:** Release validation of the completed authority-backed catalog. This is
an application and deployment integrity check, not a manual legal review.

## Gate result

**BLOCKED — do not open another jurisdiction yet.**

The committed source records and fail-closed selection rules passed the static
and development-runtime checks. The release gate is not fully green because
the database-isolated production browser check cannot exercise site search, and
California's reference-only seed command stamps each run with a new import
time. The remaining gaps are listed below so they are not mistaken for legal
coverage.

## Catalog matrix

The eight JSON manifests below each load from
`scripts/data-review/output/*-source-manifest.json`. California is a separate
reference-only canonical seed and does not use a JSON manifest.

| Jurisdiction | Catalog rows | Selectable | Sources | Snapshots | Links | Withheld |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| California | 120 canonical (115 legacy inventory) | 99 | 179 | 179 | 179 | 21 canonical; 59 legacy |
| Florida | 117 | 25 | 25 | 25 | 25 | 92 |
| Georgia | 129 | 0 | 0 | 0 | 0 | 129 |
| Illinois | 116 | 13 | 13 | 13 | 13 | 103 |
| New York | 121 | 94 | 88 | 96 | 96 | 27 |
| Ohio | 115 | 13 | 13 | 13 | 13 | 102 |
| Pennsylvania | 112 | 25 | 25 | 25 | 25 | 87 |
| South Carolina | 128 | 2 | 2 | 2 | 2 | 126 |
| Texas | 111 | 33 | 30 | 33 | 33 | 78 |

All retained records carry verified authority provisions. Withheld records
carry no publishable provisions and are excluded from the selectable charge
boundary.

## Checks run

### Passed

- `npm run check`
- `npm run build`
- `npm test` — 57 active test files passed; 1,279 tests passed. Nine
  integration files remain skipped unless their explicit environment guards
  are enabled.
- Targeted source and deployment tests for all nine jurisdictions — 14 files,
  75 tests passed.
- Development integration boundary pass with the explicit authority and
  persistence guards enabled — 8 files, 19 tests passed. One test file was
  skipped by its own guard.
- Two-pass dry-run loading of all nine seed commands. The eight
  committed-manifest commands produced byte-identical summaries across both
  passes:

  ```text
  npx tsx scripts/data-review/seed-{california,florida,georgia,illinois,new-york,ohio,pennsylvania,south-carolina,texas}-source-database.ts --dry-run
  ```

- Direct development API checks:
  - site search returns the Data Sources and Methodology result for
    `how accurate`;
  - verified Florida provenance retains its official title, citation, source
    link, retrieval metadata, and content hash;
  - a withheld Florida charge returns 404 from the provenance endpoint;
  - v1 Florida export excludes the withheld rows.
- Development browser smoke:
  - site-search listbox appears and ArrowDown sets the active descendant while
    preserving combobox focus;
  - `/case-guidance` reaches its non-blank initial state;
  - the mitigation builder accepts minimal test input and exposes working
    output controls.

The source-database, guidance identity, reselection, search, and export
assertions are covered by the jurisdiction-specific tests plus
`tests/guidance-route.test.ts`, `tests/guidance-parity.test.ts`, and
`tests/qa-flow-reselection.test.ts`. AI guidance tests use the existing
hermetic test boundary; no live AI request was made for this validation.

## Remaining blockers

1. **Production search smoke is not green in the isolated release runner.**
   `npm run test:e2e:release` built the production artifact and started the
   release server, but 11 browser tests passed and the site-search keyboard
   test failed because the release runner deliberately points
   `DATABASE_URL` at an unavailable local database. `/api/site-search`
   correctly fails closed while resolving current authority-selectable IDs, so
   the UI showed “Search failed” instead of a listbox. This must be resolved
   with a database-backed release fixture or a safe hermetic search fixture
   before claiming production search parity.

2. **California dry-run metadata is not byte-stable.** Its seed builder
   intentionally receives `new Date()` and records that value as
   `manifestImportedAt`; the underlying canonical records, links, hashes, and
   counts are stable, but the complete dry-run JSON changes between runs.
   Either validate California with a fixed import timestamp or make the
   reference-only import timestamp an explicit input before treating the
   entire catalog as deterministic.

3. **Deployment/runtime test matrix is incomplete.** Illinois has no dedicated
   deployment-seed test. Pennsylvania and South Carolina have neither a
   deployment-seed test nor a runtime-boundary integration test. New York has
   no dedicated runtime-boundary integration test. Their source manifest
   tests passed, but their startup and HTTP boundary paths are not covered at
   the same depth as Florida, Georgia, Ohio, and Texas.

4. **Production startup relies on a separate script list.** The production
   launcher explicitly runs the eight JSON-manifest seed bundles, while
   California remains an admin-triggered reference-only seed endpoint.
   This is currently consistent with the source policy, but it should remain a
   deliberate launch decision rather than being interpreted as uniform
   automatic startup seeding.

No new jurisdiction should be opened until blocker 1 is either made green or
formally accepted as an environment-only limitation, blocker 2 has a
deterministic validation convention, and blocker 3 has an explicit coverage
decision.
