# New York source database

## Authority and retrieval policy

New York charge provenance is sourced only from the New York State Senate Open
Legislation API:

- API: `https://legislation.nysenate.gov/api/3`
- Human-readable source: `https://www.nysenate.gov/legislation/laws/{lawId}/{section}`
- Publisher: New York State Senate Open Legislation

The importer uses the API's structured law identifier, section identifier,
official title, full section text, active date, and published-date history. The
full returned section text is stored in the shared provenance snapshot tables
with a SHA-256 content hash. Each retrieval updates both the source's checked
and retrieved timestamps; the manifest import timestamp is tracked separately.
No OpenLaws endpoint is used by this process.

The committed audit manifest is
`scripts/data-review/output/ny-source-manifest.json`. Refresh and seed it with:

```text
npx tsx scripts/data-review/import-ny-source-database.ts
```

The command requires `NY_SENATE_API_KEY` through Replit Secrets. It is
rate-limited to one request approximately every 550 ms and fails closed when a
section cannot be returned with an official title and text.

## Catalog contract

All 121 current NY catalog rows appear in the manifest. Each row has one of
these explicit dispositions:

- `retain`: the catalog label matches the official title or is a local NYC
  ordinance reference.
- `exact_alias_rename`: the official section is confirmed, but the legacy
  plain-English label is replaced at current lookup/selector boundaries by the
  official title.
- `require_exact_reselection`: the API section is missing, the row is a
  placeholder, or the returned title is a materially different offense,
  penalty, or enforcement provision. These rows are not selectable and do not
  receive charge-specific guidance or exports.
- `remove`: reserved for a future catalog removal after an explicit review.

Official source text is the verbatim basis for elements, mental state,
classification/grading, penalty, and currentness fields. Those fields remain
marked `attorneyReview: "pending"`: API verification is not attorney approval.

## Provision roles

The shared provenance tables preserve more than one provision for a charge.
For a retained compound offense, the manifest can link New York Penal Law
§110.00 as `offense` and a target-offense provision such as §125.25 as
`grading`. An incomplete or semantically mismatched compound row is instead
withheld until an exact mapping is established. Links also support `penalty`,
`currentness`, and `jury_instruction` roles when a future manifest supplies
those provisions.
Source identity is stable on `ny:{lawId}:{section}`; title, URL, text, and
currentness changes create a pending-review snapshot rather than silently
replacing the active one.

Runtime eligibility uses the latest **completed** NY manifest and intersects
its required provision/role/citation links with current snapshots. A failed
refresh is not published and therefore preserves the last completed authority;
when no completed manifest exists, NY selection and provenance fail closed.

NYC administrative-code rows are retained as `reference_only` records with no
stored source text because they are outside the state Senate API. They are
clearly identified as local ordinances in provenance metadata.
