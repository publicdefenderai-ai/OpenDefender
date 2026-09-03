# North Carolina title attorney review — import actions

The completed workbook was imported from the attached review sheet into the
committed CSV and attributable decision ledger. The CSV preserves every
review note, including notes that contain source links.

## Current disposition

- 114 review rows imported.
- 76 rows explicitly approved.
- 34 rows rejected.
- 4 rows remain pending because the decision cell was blank. No blank decision
  was inferred from the presence of reviewer or date fields.
- 70 rows are now selectable after the note-driven action layer and exact-source checks.
- 60 rows remain withheld: 30 require exact catalog follow-up and 30 are
  explicitly removed from selector surfaces. Every row remains in the manifest
  for audit history and carries its review decision/note when it was reviewed.

The 70 selectable rows consist of six previously verified exact mappings and 64
approved title aliases whose official section, complete text, currentness
evidence, and catalog code all pass the fail-closed authority checks.

The six `retain` mappings outside this workbook are pre-existing verified
baseline records: identity theft, possession of drug paraphernalia, disorderly
conduct, reckless driving, public disorderly conduct, and second-degree
trespass. They are not approvals from this review batch. Six additional
pre-existing alias-renamed baseline records are also outside the workbook and
remain governed by their existing exact-source evidence.

## Actions taken from the notes

- Rows explicitly marked as not charges, sentencing guidance, definitions,
  licensing exceptions, duplicate coverage, or unsuitable vehicle/school
  guidance are retained in the manifest with `remove` disposition and excluded
  from selector surfaces.
- Murder is split by the reviewer-directed subsection mapping: first degree is
  section 14-17(a), and second degree is section 14-17(b).
- Burglary now distinguishes first-degree burglary under 14-51(a),
  second-degree burglary under 14-51(b), and general breaking and entering
  under 14-54.
- Straightforward approved source-code mismatches were corrected to the
  reviewed sections, including assault, sexual-offense, larceny, fraud,
  alcohol, trespass, weapon, and related rows.

## Notes that intentionally remain follow-up work

Rows are held rather than bulk-published when the reviewer requested a split,
reclassification, or penalty-specific model:

- assault circumstances under sections 14-32 and 14-33;
- controlled-substance subsections under section 90-95;
- felony/misdemeanor larceny distinctions under section 14-72;
- amount/hashish distinctions for marijuana possession;
- injury-level distinctions for resisting officers;
- death, serious-injury, and repeat-offense distinctions for vehicular
  homicide; and
- the multi-offense tax penalty provision.

The complete per-row action and rationale are maintained in
`shared/north-carolina-title-review-actions.ts`. The four blank decisions remain
pending, and `nc-larceny-misdemeanor` remains held because the workbook changed
its generated whole-section subdivision to `(a)`; that source-column mismatch is
not silently reconciled.

Rejected rows were not deleted; their notes remain available in the CSV and
ledger. The runtime authority database has been reseeded from the resulting
manifest with 66 sources, 70 links, and zero errors.