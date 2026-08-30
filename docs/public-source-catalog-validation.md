# Public-Source Catalog Validation

**Validation date:** 2026-08-29
**Scope:** Public-source inventory coverage and release validation. This is an
application and source-access integrity check, not a manual legal review.

## Gate result

**BLOCKED — do not open another jurisdiction yet.**

Every current jurisdiction now has a complete catalog-row inventory and a
repeatable public-source coverage report. Seven jurisdictions meet the
official-response target; Georgia and Pennsylvania remain explicitly blocked
by source-access limitations. The selectable column is intentionally a
separate, stricter publication boundary: a source response can be retained in
the inventory while the catalog row remains withheld when its exact legal
identity is ambiguous. This prevents low publication coverage from being
silently converted into inferred authority.

## Coverage standard

The measurable high-coverage target applies to each current jurisdiction:

- **100% catalog accounting:** every catalog row appears exactly once as either
  a selectable record or an explicitly withheld record.
- **At least 90% official responses:** the committed import received an
  official source response for at least 90% of catalog rows. For California,
  this means every canonical row has a committed official-source reference.
- **No silent gaps:** every withheld row carries a non-empty reason. The
  report also shows the stricter publishable rate separately for prioritizing
  future exact-identity work.

Run the deterministic check with:

```text
npm run review:source-coverage
```

It reads committed manifests only, writes
`scripts/data-review/output/public-source-coverage-report.json`, and exits
non-zero for every jurisdiction below the target, including jurisdictions with
a documented source-access blocker. Blockers are surfaced in the report for
diagnosis; they are not treated as a passing release exception and must be
resolved before expanding the catalog.

The same report is available to authenticated administrators at
`GET /api/admin/source-coverage`. It is generated from the committed manifests
and deterministic seed builders on every request; it does not make a live
legislative-source request.

## Catalog matrix

The eight JSON manifests below each load from
`scripts/data-review/output/*-source-manifest.json`. California is a separate
reference-only canonical seed and does not use a JSON manifest.

| Jurisdiction | Catalog rows | Official responses | Selectable | Publishable | Sources | Withheld | Status |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| California | 120 canonical | 120 (100%) | 99 | 83% | 179 | 21 | Meets target |
| Florida | 117 | 116 (99%) | 25 | 21% | 25 | 92 | Meets target |
| Georgia | 129 | 0 (0%) | 0 | 0% | 0 | 129 | Blocked: no public section text |
| Illinois | 116 | 115 (99%) | 13 | 11% | 13 | 103 | Meets target |
| New York | 121 | 112 (93%) | 94 | 78% | 88 | 27 | Meets target |
| Ohio | 115 | 115 (100%) | 13 | 11% | 13 | 102 | Meets target |
| Pennsylvania | 112 | 98 (88%) | 25 | 22% | 25 | 87 | Blocked: incomplete source response |
| South Carolina | 128 | 127 (99%) | 2 | 2% | 2 | 126 | Meets target |
| Texas | 111 | 109 (98%) | 33 | 30% | 30 | 78 | Meets target |

All retained records carry verified authority provisions. Withheld records
carry no publishable provisions and are excluded from the selectable charge
boundary, but remain in the inventory with their explicit reason. The
`coveragePercentage`/`selectableCoveragePercentage` fields show the
publishable-rate boundary explicitly. The report also includes
`officialSourceAvailability` (`available`, `partial`, or `unavailable`) and a
six-part `gapBreakdown` for source access, missing imports, stale records,
incomplete text, technical seed failures, and identity review. These categories
are intentionally separate: a complete source response that still needs exact
identity review is not counted as a source-access failure.

`nextHighestValueCoverageTargets` ranks all current jurisdictions with withheld
rows. Source-access blockers appear first; the remaining targets are ordered by
the number of rows that can be improved by completing the existing official
source/import review. This is the expansion gate: do not begin another
jurisdiction while the command reports below-target jurisdictions, and use the
ranked list to select the next coverage work.

## Checks run

### Passed

- `npm run check`
- `npm run review:source-coverage`
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
  committed-manifest commands and the California reference-only command
  produced byte-identical summaries across both passes. California uses the
  fixed dry-run timestamp `1970-01-01T00:00:00.000Z` by default; use
  `--imported-at <ISO-8601 timestamp>` to compare against another fixed
  release timestamp:

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

## Source-access blockers

These are the only jurisdictions below the 90% official-response target. They
are concrete source-contract limitations, not attorney-review prerequisites.
They intentionally keep the coverage command and release verification red
until resolved:

1. **Georgia:** the public Georgia General Assembly API exposes legislation
   metadata and code-title names, but not current codified section text. The
   importer therefore receives no official section document that satisfies
   its exact URL, document-identity, complete-text, and currentness contract.
   The next attempt must use a stable public section-text endpoint; it must not
   substitute secondary sources or authenticated-only annotated-code access.

2. **Pennsylvania:** the official consolidated-statute source does not
   currently return every requested section needed by the catalog inventory.
   The manifest preserves unavailable and placeholder rows rather than
   inferring authority from a secondary source. Re-run the official PA source
   probe when the missing section routes or source contract are restored.

The machine-readable blocker details are in
`public-source-coverage-report.json`. No new jurisdiction should be opened
until these blockers are either resolved or formally accepted as
environment/source-contract limitations.

## Other release blockers

1. **Production search smoke is not green in the isolated release runner.**
   `npm run test:e2e:release` built the production artifact and started the
   release server, but 11 browser tests passed and the site-search keyboard
   test failed because the release runner deliberately points
   `DATABASE_URL` at an unavailable local database. `/api/site-search`
   correctly fails closed while resolving current authority-selectable IDs, so
   the UI showed “Search failed” instead of a listbox. This must be resolved
   with a database-backed release fixture or a safe hermetic search fixture
   before claiming production search parity.

2. **Deployment/runtime test matrix is incomplete.** Illinois has no dedicated
   deployment-seed test. Pennsylvania and South Carolina have neither a
   deployment-seed test nor a runtime-boundary integration test. New York has
   no dedicated runtime-boundary integration test. Their source manifest
   tests passed, but their startup and HTTP boundary paths are not covered at
   the same depth as Florida, Georgia, Ohio, and Texas.

3. **Production startup relies on a separate script list.** The production
   launcher explicitly runs the eight JSON-manifest seed bundles, while
   California remains an admin-triggered reference-only seed endpoint.
   This is currently consistent with the source policy, but it should remain a
   deliberate launch decision rather than being interpreted as uniform
   automatic startup seeding.

These deployment/test blockers do not change the public-source coverage
measurements above. They still need an explicit release decision before
launch.
