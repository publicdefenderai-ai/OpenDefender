# Texas protected-victim assault

Twenty-four individually supported choices extend the existing ordinary/family bodily-injury review to protected roles and distinct threat/contact conduct. Existing reviewed family rows remain unchanged. The previously withheld legacy `tx-assault-on-peace-officer` remains withheld and now explicitly requires saved-case/PDF reselection; its old public-servant citation is not silently assigned the specific peace-officer grade.

## Priority selection

The retained [official DPS workbook](https://www.dps.texas.gov/administration/crime_records/pages/aareststatsoffense26.xlsx), January 13, 2026 snapshot, reports 2025 adult arrests. Rank 51, code 13990082 (peace officer/judge), records 3,581; rank 64, code 13990063 (public servant), 2,335; rank 73, code 13990090 (known pregnant person), 1,677. The total is 7,593 adult arrests, not convictions or distinct people. Counts are not assigned separately to each published role or sub-branch. The peace-officer aggregate remains only partly resolved because of the officer-class limitation below.

Workbook SHA-256: `779a075cbb9e423f75330cda4fe9d89585c0b28fe41c5b577cd50161309b9483`. Run `python3 scripts/data-review/texas-verification/rank_arrests.py /path/to/aareststatsoffense26.xlsx --limit 75` to reproduce the ranking. The three rows are retained in `texas-protected-assault-priorities.json`.

## Individual choices

| ID | Conduct | Grading |
| --- | --- | --- |
| tx-pc-22-01-public-servant | §22.01(a)(1) | §22.01(b)(1) |
| tx-pc-22-01-peace-officer | §22.01(a)(1) | §22.01(b-2) |
| tx-pc-22-01-judge | §22.01(a)(1) | §22.01(b-2) |
| tx-pc-22-01-custody-contractor | §22.01(a)(1) | §22.01(b)(3) |
| tx-pc-22-01-security | §22.01(a)(1) | §22.01(b)(4) |
| tx-pc-22-01-emergency | §22.01(a)(1) | §22.01(b)(5) |
| tx-pc-22-01-process-server | §22.01(a)(1) | §22.01(b)(6) |
| tx-pc-22-01-forced-abortion-injury | §22.01(a)(1) | §22.01(b)(7) |
| tx-pc-22-01-pregnant | §22.01(a)(1) | §22.01(b)(8) |
| tx-pc-22-01-hospital | §22.01(a)(1) | §22.01(b)(9) |
| tx-pc-22-01-utility | §22.01(a)(1) | §22.01(b)(10) |
| tx-pc-22-01-civil-office-1 | §22.01(a)(1) | §22.01(b-1) |
| tx-pc-22-01-civil-office-2 | §22.01(a)(2) | §22.01(b-1) |
| tx-pc-22-01-civil-office-3 | §22.01(a)(3) | §22.01(b-1) |
| tx-pc-22-01-civil-contractor-1 | §22.01(a)(1) | §22.01(b-1) |
| tx-pc-22-01-civil-contractor-2 | §22.01(a)(2) | §22.01(b-1) |
| tx-pc-22-01-civil-contractor-3 | §22.01(a)(3) | §22.01(b-1) |
| tx-pc-22-01-ordinary-2 | §22.01(a)(2) | §22.01(c) |
| tx-pc-22-01-sports-2 | §22.01(a)(2) | §22.01(c)(2) |
| tx-pc-22-01-forced-abortion-2 | §22.01(a)(2) | §22.01(c)(3) |
| tx-pc-22-01-ordinary-3 | §22.01(a)(3) | §22.01(c) |
| tx-pc-22-01-sports-3 | §22.01(a)(3) | §22.01(c)(2) |
| tx-pc-22-01-forced-abortion-3 | §22.01(a)(3) | §22.01(c)(3) |
| tx-pc-22-01-elderly-disabled-contact | §22.01(a)(3) | §22.01(c)(1) |

## Important distinctions

The [official §22.01 text](https://tcss.legis.texas.gov/resources/PE/htm/PE.22.htm#22.01) distinguishes intentional/knowing/reckless bodily injury from intentional/knowing threats of imminent bodily injury and intentional/knowing offensive contact. A protected-role bodily-injury felony is not automatically a felony for a threat or touch. The threat summaries do not resolve case-specific disputed questions about perception or communication of a threat beyond the statutory elements.

Ordinary public-servant bodily injury is third degree and requires the specified knowledge and lawful-duty/retaliation connection. The specific peace-officer/judge provision is second degree. The court may need to distinguish the offense actually alleged; this packet does not retroactively recast an old public-servant charging instrument as a different offense. Peace-officer status is bounded to article 2A.001(1)-(4): sheriff/deputy, constable/deputy, municipal-police/marshal and DPS categories meeting their conditions. Both official 2025 versions remain retained and hash-bound; other officer categories are not harmonized or newly cleared here. The separately supported judge branch is not subject to that officer-class dispute.

Government custody contractors require the specific facility and contract-service conditions. Security officers require the incorporated commissioned/registered status. Emergency personnel must be providing emergency services. Process servers have the incorporated certification definition. Hospital personnel must be on hospital property and meet the incorporated facility definition. Utility workers require actual or reasonable knowledge of their role and a connection to employment/agency duties, with all six incorporated Utilities Code sections retained. The uniform/badge presumptions are limited to the statutory role groups and do not compel guilt.

Knowledge of pregnancy under (b)(8) is distinct from the purpose of forcing an abortion under (b)(7)/(c)(3). The latter has different bodily-injury and threat/contact grades. No general abortion offense is added.

Civil-commitment enhancement applies only with the required committed-actor status and protected office/contractor role and duty connection. It reaches all three assault forms, so its threats and offensive contact are third-degree felonies rather than ordinary Class C misdemeanors. The facility definition is Penal Code §1.07(a)(8-a), not a generic jail or hospital definition. Chapter 841 commitment provisions are retained.

Ordinary threats/contact, sports-participant threats/contact, elderly/disabled offensive contact and forced-abortion threats/contact retain their separate grades. The sports actor must not be a sports participant. Elderly/disabled contact is not automatically the grade for a threat; the complete current disability-definition dependencies are retained. The general consent defense has its injury/risk conditions and gang-initiation/continued-membership exclusion.

### Remaining boundaries

The existing ordinary and family assault choices are preserved. The §22.01(b-4) smuggling-linked enhancement is outside this batch; it is not treated as cleared by the ordinary grade. Other peace-officer categories remain outside the narrowed choice. Separate aggravated assault and other overlapping offenses require their own elements. Case-specific prior convictions and sentencing findings can change the stated ordinary ranges. Current retained text does not establish the applicable version for earlier conduct.

## Evidence and instructions

Thirty-six official sections support 288 required links. Twenty texts overlap prior reviewed packets and match exactly. Acquisition metadata, effective-date text, official headings, chapter hashes, text hashes and snapshot hashes are retained. No active receipt or earlier acquisition date is renewed. Utilities Code citation support is added narrowly for the six statutory definitions.

The publisher's CPJC 22.1, 22.2 and 22.3 items cover underlying bodily-injury, threat and offensive-contact conduct. They are not presented as verified protected-role grading instructions. Existing verified 22.1 edition 013 is reused; 22.2 and 22.3 edition 055 were checked directly:

- [CPJC 22.1](https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F22_Assaultive_Offenses%2FCPJC22-1.htm&version=013)
- [CPJC 22.2](https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F22_Assaultive_Offenses%2FCPJC22-2.htm&version=055)
- [CPJC 22.3](https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F22_Assaultive_Offenses%2FCPJC22-3.htm&version=055)

The candidate has 320 configured Texas IDs, 245 eligible under complete current evidence, 167 source keys and 2,128 links. These are offline counts, not live availability. All 295 other prior manifest records and the generation timestamp remain unchanged. The one changed prior record clarifies an existing hold, so the eligible increase is exactly 24. New Spanish/Chinese requests show the English-content notice rather than claiming reviewed translations.

Reproduce the records with `node --import tsx scripts/data-review/texas-verification/replay-assault-intoxication.ts protected-assault`.

## Validation

- Texas, jury-instruction, source-inventory, catalog and PDF suites: 173 passed; six database integration tests deliberately skipped.
- Typecheck and production build passed. All 15 isolated built-selector checks passed, including the 24 new assault choices and legacy officer exclusion.
- No database operations, imports, monitoring changes, deployment, activation or receipt renewal.

The ordinary public-servant choice expressly excludes every qualifying §22.01(b-2) peace-officer/judge bodily-injury circumstance, including legally qualifying roles not offered by the narrower officer selector. The selector limitation does not reduce those statutory circumstances to third-degree. Knowledge and official-duty/retaliation conditions remain required; no additional role is cleared for selection. The second-degree comparison is separately bound to §12.33. This clarification changes no retained evidence or acquisition/manifest dates.
