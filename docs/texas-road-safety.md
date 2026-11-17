# Texas road-safety offenses

Sixteen individually supported choices address reckless driving, racing and duties after a collision: fifteen new IDs and a correction preserving `tx-reckless-driving`. The generic `tx-hit-and-run` identity remains withheld and now explicitly requires reselection; no old saved case is silently assigned a new subdivision or grade.

## Priority and scope

The retained official DPS January 13, 2026 workbook reports 2025 adult arrests, not convictions or unique people. Rank 36, code 54990044 (reckless driving), records 5,360; rank 42, code 54010010 (attended-vehicle damage of at least $200), 4,458; and rank 72, code 54990031 (racing), 1,731. Their combined 11,549 arrests are counted once per code, not once per new branch. Injury and unattended-vehicle choices are adjacent statutory distinctions, not additional measured arrests attributed to those three codes.

The [official workbook](https://www.dps.texas.gov/administration/crime_records/pages/aareststatsoffense26.xlsx) has SHA-256 `779a075cbb9e423f75330cda4fe9d89585c0b28fe41c5b577cd50161309b9483`. Reproduce the ranks with `python3 scripts/data-review/texas-verification/rank_arrests.py /path/to/aareststatsoffense26.xlsx --limit 75`. The selected rows are retained in `texas-road-safety-priorities.json`.

| ID | Citation | Classification |
| --- | --- | --- |
| tx-reckless-driving | Tex. Transp. Code § 545.401(a) | misdemeanor |
| tx-tn-545-420-ordinary | Tex. Transp. Code § 545.420(a) | misdemeanor |
| tx-tn-545-420-one-prior | Tex. Transp. Code § 545.420(a) | misdemeanor |
| tx-tn-545-420-intoxicated | Tex. Transp. Code § 545.420(a) | misdemeanor |
| tx-tn-545-420-open-container | Tex. Transp. Code § 545.420(a) | misdemeanor |
| tx-tn-545-420-two-priors | Tex. Transp. Code § 545.420(a) | felony |
| tx-tn-545-420-bodily-injury | Tex. Transp. Code § 545.420(a) | felony |
| tx-tn-545-420-serious-or-death | Tex. Transp. Code § 545.420(a) | felony |
| tx-tn-550-021-death | Tex. Transp. Code § 550.021(a) | felony |
| tx-tn-550-021-serious-injury | Tex. Transp. Code § 550.021(a) | felony |
| tx-tn-550-021-other-injury | Tex. Transp. Code § 550.021(a) | felony |
| tx-tn-550-022-under-200 | Tex. Transp. Code § 550.022(a) | misdemeanor |
| tx-tn-550-022-200-plus | Tex. Transp. Code § 550.022(a) | misdemeanor |
| tx-tn-550-022-freeway-relocation | Tex. Transp. Code § 550.022(b) | misdemeanor |
| tx-tn-550-024-under-200 | Tex. Transp. Code § 550.024(a) | misdemeanor |
| tx-tn-550-024-200-plus | Tex. Transp. Code § 550.024(a) | misdemeanor |

## Statutory distinctions

[Section 545.401](https://tcss.legis.texas.gov/resources/TN/htm/TN.545.htm#545.401) has its own misdemeanor punishment: up to 30 days, $200, or both. It does not authorize the old generic one-year penalty. Its private-area extension excludes paid parking and private residential property. Chapter 550, by contrast, includes paid parking but excludes private residential property. The summaries retain that difference.

[Section 545.420](https://tcss.legis.texas.gov/resources/TN/htm/TN.545.htm#545.420) separates ordinary Class B racing, Class A circumstances, two-prior state-jail grading and injury-caused felony grades. A speed exhibition must have the statutory drag-race connection; acceleration alone is not the offense. License suspension, at least ten community-service hours, early-reinstatement conditions and impoundment are separately supported. Injury must result from the offense.

[Section 550.021](https://tcss.legis.texas.gov/resources/TN/htm/TN.550.htm#550.021) separates death, serious bodily injury and other injury. The last has its own felony range: up to five years in the department or up to one year in county jail and a possible $5,000 fine. It is not the ordinary third-degree two-to-ten-year range, and the county-jail alternative does not turn it into a misdemeanor. [Lira (2025)](https://law.justia.com/cases/texas/second-court-of-appeals/2025/02-24-00167-cr.html) applies that special felony structure. Knowledge and the required stop, return, remain, information and aid duties are explicit. Causing the initial collision is not substituted for those duties.

Sections 550.022 and 550.024 split damage at $200 inclusive. The former covers a driven or attended vehicle and includes a distinct metropolitan-freeway relocation duty with drivability conditions. The latter concerns an unattended vehicle and permits its specific notice alternative. That alternative is not presented as satisfying injury or attended-vehicle duties. Section 550.025 fixture/landscaping branches are outside this batch. Class C remains a misdemeanor with its ordinary fine, not an infraction. Prior-conviction, historical-version and case-specific sentencing rules remain separate.

## Evidence and instructions

Thirty-two official sections support 203 required links. Fourteen texts overlap prior reviewed packets and match exactly. Acquisition metadata records November 17, 2026; each document retains the official heading, enactment/effective metadata, chapter hash, normalized-text hash and snapshot hash. No active receipt or existing acquisition date is renewed. This evidence does not establish the law applicable to earlier conduct merely because the page is current.

Rebuild candidate records with `node --import tsx scripts/data-review/texas-verification/replay-assault-intoxication.ts road-safety`. The prior manifest generation timestamp is preserved. Only the existing reckless-driving record and held hit-and-run record change; fifteen records are appended. The fully supported candidate has 268 configured Texas IDs, 194 eligible IDs, 147 source keys and 1,515 links. These are offline candidate counts, not production availability.

[CPJC 80.2, edition 007](https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F80_Transportation_Code_Offenses%2FCPJC80-2.htm&version=007) was verified with the publisher for the three injury-collision choices, limited to underlying failure-to-stop-and-render-aid conduct. It does not certify each punishment or enhancement. Other new instruction mappings remain omitted because they are not verified here; this is not a claim that no instruction exists.

Spanish and Chinese requests carry the explicit English-content notice. Held legacy selection, saved-case resolution, canonical explanation and PDF paths reject or neutrally flag the obsolete generic collision identity, including code-only variants with different generated names.

## Verification

- Texas, catalog, source-inventory, jury-instruction and PDF suites: 158 passed; six database integration checks intentionally skipped.
- Typecheck and production build: passed.
- Isolated production-artifact selector suite: 13 passed, including all sixteen road choices and rejection of the old generic collision choice.
- No database, import, deployment, receipt renewal or monitoring operation was performed.
