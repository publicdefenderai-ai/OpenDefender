# Illinois evidence-backed mapping review

This worksheet contains Illinois catalog rows with complete official ILGA
section evidence whose machine mapping is still a semantic conflict or a
shared-citation cluster. Exact matches and rows with missing, compound, or
citation-identity evidence are intentionally excluded; they need a source or
catalog correction before semantic review is useful.

## How to complete it

1. Open `officialSourceUrl` and compare the catalog row with the exact
   `evidenceSection`, subdivision, official title, and quoted offense text.
2. Check the `evidenceCurrentness`, `evidenceGrading`, and `evidencePenalty`
   columns. These are extracted from the same bounded official text and are
   provided to keep the decision tied to the reviewed version.
3. For rows marked `shared-citation-cluster`, review every related charge in
   the cluster. Decide whether the rows are distinct subsections/offenses,
   one canonical row plus duplicates, or a mapping that needs correction.
4. Fill in `decision` with exactly one of `publish`, `correct`, `split`,
   `reclassify`, `deduplicate`, `hold`, `remove`, or `other`.
5. Fill in `approvedDisplayName`, `correctedCitation`,
   `correctedSubdivision`, `canonicalChargeId`, `otherDetails`, and `note`
   only when the selected decision needs them. Explain every non-publish
   decision in `note`.

The source, mapping, currentness, grading, penalty, hash, and quoted-span
columns are evidence and must not be edited. Reviewer identity and review
date belong in the private review record.

## Fail-closed publication rule

Completing a worksheet does not publish a row by itself. A later import must
still validate the exact Illinois section and subdivision, complete official
text, currentness evidence, content hash, official link, and an exact or
explicitly reviewed title mapping. Rejected, uncertain, unsupported, or
structurally corrected rows remain withheld until those checks pass.