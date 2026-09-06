# Pennsylvania statutory authority review

This worksheet contains every Pennsylvania catalog record currently in the
committed source manifest: selectable records and records withheld pending
exact official-source verification.

## How to complete it

1. Open `pennsylvania-attorney-review.csv` in Excel, Google Sheets, or another
   spreadsheet program.
2. Review one row at a time.
3. Open the link in `officialCodeUrl` when one is provided. The official
   publisher is the Pennsylvania General Assembly. If the link is blank or the
   page does not contain the exact section, do not infer a replacement from a
   secondary source.
4. Confirm that the official section, title, and subdivision support the
   catalog label. Pay particular attention to whether a citation is a
   consolidated statute, an unconsolidated statute, federal law, a model-code
   reference, or an unsupported compound description.
5. Fill in the review columns:
   - `approvedDisplayName`: the plain-language name to show advocates, if the
     current catalog label should change.
   - `correctedCitation`: the exact Pennsylvania citation when the current
     citation is wrong or incomplete.
   - `correctedSubdivision`: the exact subsection or paragraph, if applicable.
   - `decision`: enter exactly one of `publish`, `correct`, `split`,
     `reclassify`, `deduplicate`, `hold`, or `remove`.
   - `reviewer`: attorney or reviewer name.
   - `reviewedAt`: review date in `YYYY-MM-DD` format.
   - `note`: brief rationale, including the official section/subdivision
     reviewed and the official source URL when a correction is proposed.
6. Do not edit the identity or evidence columns:
   `chargeId`, `catalogLabel`, `catalogCode`, `catalogCategory`,
   `currentDisposition`, `currentDispositionReason`, `proposedAlias`,
   `citation`, `subdivision`, `officialCodeUrl`, `officialTitle`, or
   `sourceStatus`.

## Decision guidance

- `publish`: the existing mapping is an exact, current official match.
- `correct`: the charge can remain one row, but the citation, subdivision, or
  display name needs correction.
- `split`: the row combines distinct offenses or legal provisions and should
  become separate reviewed records.
- `reclassify`: the row belongs under a different offense or legal category.
- `deduplicate`: the row duplicates another catalog record.
- `hold`: the mapping may be useful but cannot be approved yet because exact
  authority or substantive support is unresolved.
- `remove`: the row should not appear in the Pennsylvania catalog.

Every row needs a decision. A `publish` decision is not a bulk approval: it
will still be checked against the exact official section, title, subdivision,
complete text, current link, and provenance before it can become selectable.
Rejected, uncertain, or unsupported mappings should normally be marked `hold`
or `remove`, with an explanation in `note`.