# Ohio focused authority review

The Ohio importer has already fetched and validated the official Ohio Revised
Code page for every distinct cited section it could reach. The generated queue
contains only rows that still need a legal identity decision; the 13 exact
official matches do not appear in the queue.

## Review one cluster at a time

Rows with the same citation are shown together through `relatedChargeIds`.
Decide whether the rows are:

- distinct offenses or subsections that should remain separate;
- one canonical row plus duplicates;
- one row that needs a corrected name or citation; or
- unsupported and therefore held or removed.

Do not treat similar names as duplicates without checking the statutory
elements, subsection, victim, and grading consequences.

## Decision options

Choose exactly one:

- `publish` — the current mapping is exact and can be selected.
- `correct` — keep one row but correct the display name, citation, or subsection.
- `split` — separate distinct offenses or subsections before publication.
- `reclassify` — move the row to a different offense or legal category.
- `deduplicate` — point this row to an existing canonical row.
- `hold` — keep it unavailable while authority or identity remains unresolved.
- `remove` — it should not appear in the Ohio catalog.
- `other` — use only when none of the above fits; explain the outcome in
  `otherDetails` and identify the next action.

The source URL, official title, citation, duplicate candidates, current
manifest reason, and review question are generated automatically. The
reviewer should only supply the decision and any correction or explanation
needed for that decision.

Reviewer identity and dates belong in the private review record, not in the
committed runtime manifest.