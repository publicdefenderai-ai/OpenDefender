# North Carolina statutory-heading attorney review

This worksheet contains the North Carolina catalog rows that have complete,
current official source evidence but still need a decision about whether the
official statutory heading is an acceptable name for the catalog offense.

## What is included

- 114 rows with complete section text and an official heading from the North
  Carolina General Assembly website.
- Each row includes the existing catalog name, the proposed official heading,
  the exact citation, the relevant subsection when applicable, and a direct
  government source link.
- Four additional withheld rows are intentionally omitted because the official
  page could not be extracted or retrieved reliably. Those require a source
  problem to be fixed before legal naming review is useful.

## How to complete it

1. Open the link in the `officialCodeUrl` column. The page is the North
   Carolina General Statutes site. Use the `citation` and `subdivision` columns
   to locate the relevant text.
2. Compare the existing `catalogLabel` with the complete official section and
   the `proposedAlias`, which is the official statutory heading.
3. Confirm that the cited section and subsection describe the same offense as
   the catalog row. Do not approve a row merely because the words sound
   related.
4. Fill in the review columns:
   - `approvedDisplayName`: leave blank to use the official heading, or enter a
     different plain-language display name if that is clearer and still
     accurately describes the same cited offense.
   - `decision`: enter exactly `approve` or `reject`.
   - `reviewer`: attorney's name.
   - `reviewedAt`: review date in `YYYY-MM-DD` format.
   - `note`: brief rationale, including the section/subsection reviewed.
5. Return the completed CSV file without editing the identity or source
   columns: `chargeId`, `catalogLabel`, `proposedAlias`, `citation`,
   `subdivision`, and `officialCodeUrl`.

## Decision rules

- `approve` means the cited official section/subsection supports the catalog
  offense and the selected display name is accurate.
- `reject` means the mapping is broader, narrower, compound, materially
  different, or otherwise uncertain. Rejected rows remain withheld.
- `approvedDisplayName` is only a user-facing label. It does not change the
  official citation, statutory text, subsection, grading, or penalty.
- If a row needs a different statute, subsection, or offense mapping rather
  than a different display name, reject it and explain the problem in `note`.

A complete review should contain a decision for every row. Approved mappings
will still be checked against the official citation, exact source text, and
required subdivision before publication.