# Texas family-safety offenses

Twenty choices address Penal Code §§22.04, 22.041, 25.11 and 42.062. Four selected DPS codes recorded 15,974 adult arrests in 2025. Arrest counts guide the review order. They do not establish convictions, unique defendants, offense dates or exhaustive coverage. [Official DPS workbook](https://www.dps.texas.gov/administration/crime_records/pages/aareststatsoffense26.xlsx)

| DPS rank | Code | Recorded citation | Adult arrests | Current bounded treatment |
| --- | --- | --- | ---: | --- |
| 33 | 13990043 | 22.04(f) | 5,507 | Ordinary intentional/knowing bodily injury, plus separately supported adjacent mental-state and institutional branches |
| 43 | 53990010 | 42.061999999999998 | 4,420 | §42.062(a) and (b), with separate prior-conviction choices |
| 49 | 13990078 | 25.11(e) | 3,744 | Continuous violence against the family |
| 65 | 38990042 | 22.041(f) | 2,303 | Endangerment, with separately supported abandonment grades |

The workbook is the January 13, 2026 snapshot with SHA-256 `779a075cbb9e423f75330cda4fe9d89585c0b28fe41c5b577cd50161309b9483`. Running `python3 scripts/data-review/texas-verification/rank_arrests.py /path/to/aareststatsoffense26.xlsx --limit 75` reproduces the ranked source. The packet preserves the reported floating-point citation for rank 43. Its label and the official statute establish §42.062 as the intended section. The two ordinary conduct choices share that single DPS count. Adjacent grades add no inferred arrest totals.

## Individual choices

| ID | Conduct scope | Grading scope | Ordinary classification |
| --- | --- | --- | --- |
| tx-pc-22-04-serious-intentional | §22.04(a)(1), (a)(2) | §22.04(e) | First-degree felony |
| tx-pc-22-04-serious-reckless | §22.04(a)(1), (a)(2) | §22.04(e) | Second-degree felony |
| tx-pc-22-04-bodily-intentional | §22.04(a)(3) | §22.04(f) | Third-degree felony |
| tx-pc-22-04-bodily-reckless | §22.04(a)(3) | §22.04(f) | State jail felony |
| tx-pc-22-04-negligent | §22.04(a)(1), (a)(2), (a)(3) | §22.04(g) | State jail felony |
| tx-pc-22-04-institutional-serious-intentional | §22.04(a-1)(1), (a-1)(2) | §22.04(e) | First-degree felony |
| tx-pc-22-04-institutional-serious-reckless | §22.04(a-1)(1), (a-1)(2) | §22.04(e) | Second-degree felony |
| tx-pc-22-04-institutional-bodily-intentional | §22.04(a-1)(3) | §22.04(f) | Third-degree felony |
| tx-pc-22-04-institutional-bodily-reckless | §22.04(a-1)(3) | §22.04(f) | State jail felony |
| tx-pc-22-04-institutional-negligent | §22.04(a-1)(1), (a-1)(2), (a-1)(3) | §22.04(g) | State jail felony |
| tx-pc-22-04-direct-care | §22.04(a)(3) | §22.04(f) | Second-degree felony |
| tx-pc-22-041-abandon-return | §22.041(b) | §22.041(d)(1) | State jail felony |
| tx-pc-22-041-abandon-no-return | §22.041(b) | §22.041(d)(2) | Third-degree felony |
| tx-pc-22-041-abandon-imminent-danger | §22.041(b) | §22.041(e) | Second-degree felony |
| tx-pc-22-041-endanger | §22.041(c) | §22.041(f) | State jail felony |
| tx-pc-25-11-continuous | §25.11(a) | §25.11(e) | Third-degree felony |
| tx-pc-42-062-a | §42.062(a) | §42.062(c) | Class A misdemeanor |
| tx-pc-42-062-a-prior | §42.062(a) | §42.062(c) | State jail felony |
| tx-pc-42-062-b | §42.062(b) | §42.062(c) | Class A misdemeanor |
| tx-pc-42-062-b-prior | §42.062(b) | §42.062(c) | State jail felony |

The §22.04 choices distinguish injury level, mental state, ordinary acts/omissions, institutional omissions and the direct-care-employee circumstance. The ordinary provision allows criminally negligent acts. The separate institutional provision also permits criminally negligent omissions. The special second-degree bodily-injury branch expressly refers to (a)(3). It is not copied into every institutional-omission row. The caregiver-duty, medical-care, notice and other conditional defenses remain bound to the complete section. The same-episode concurrent-sentence provision in (h) is described beside the penalties. [Section 22.04](https://tcss.legis.texas.gov/resources/PE/htm/PE.22.htm#22.04)

The omission descriptions preserve both statutory duties and assumed-care duties. The Court of Criminal Appeals confirmed in Cockrell that a duty outside the Family Code can supply the required statutory duty, while emphasizing that the charged injury and mental state still require proof. These records do not assume a duty from a relationship label alone. [Cockrell v. State, PD-0760-24, August 20, 2025](https://law.justia.com/cases/texas/court-of-criminal-appeals/2025/pd-0760-24-0.html)

The §22.041 choices separate intentional abandonment with and without intent to return, the higher imminent-danger abandonment circumstance, and endangerment by act or omission. The safe-delivery exception is linked to Family Code §§262.301 and 262.302. The athletic-event defense is limited to endangerment. The drug-related presumptions are linked to §2.05 and their substance definitions, preserving the state's burden. The retained §22.041 text shows September 1, 2025 as its latest effective date. Earlier conduct requires the applicable version. [Section 22.041](https://tcss.legis.texas.gov/resources/PE/htm/PE.22.htm#22.041)

Continuous family violence requires two or more qualifying bodily-injury assaults within twelve months or less and the specified relationship. It does not require prior convictions. The source's course-of-conduct unanimity rule, overlapping-conviction limits and count restrictions are identified. Emergency-interference choices distinguish knowing interference with a request from recklessly rendering a device unusable. Actual or reasonably perceived emergency circumstances must meet (d). A prior §42.062 conviction changes the grade to a state jail felony. [Section 25.11](https://tcss.legis.texas.gov/resources/PE/htm/PE.25.htm#25.11) · [Section 42.062](https://tcss.legis.texas.gov/resources/PE/htm/PE.42.htm#42.062)

The retained §22.04(j) text still refers to (i)(3), which is absent from the current (i). The source is preserved literally. The summaries identify the notice defense and its conditions without inventing a missing paragraph.

## Evidence, instructions and availability

The new twenty records bind 265 required links to 34 official sections. Sixteen sections reused from earlier Texas packets have identical text hashes. All 216 prior manifest entries and their generation timestamp compare equal after parsing. The source packet includes actual acquisition times and effective-date evidence. The Insurance Code dependency is used solely for the incorporated autism definition. It creates no insurance offense.

Replay with `node --import tsx scripts/data-review/texas-verification/replay-assault-intoxication.ts family-safety`. Tests independently rebuild every record through the production builder, verify the source and snapshot hashes, reject changed or incomplete evidence, and exercise each required runtime link. Saved ID-less selections require an exact choice because the same section spans multiple grades. New Spanish and Chinese requests retain the explicit English-content notice.

Publisher-verified CPJC 22.9, 22.17, 22.18 and 22.20 links are labeled for their specific child and conduct theories. They do not establish elder, disability or institutional-omission instructions. CPJC 25.22 covers continuous family violence. Other mappings remain unverified and are omitted. [CPJC 22.9](https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F22_Assaultive_Offenses%2FCPJC22-9.htm&version=026) · [CPJC 22.17](https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F22_Assaultive_Offenses%2FCPJC22-17.htm&version=048) · [CPJC 22.18](https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F22_Assaultive_Offenses%2FCPJC22-18.htm&version=048) · [CPJC 22.20](https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F22_Assaultive_Offenses%2FCPJC22-20.htm&version=026) · [CPJC 25.22](https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F25_Offenses_against_the_Family%2FCPJC25-22.htm&version=055)

With its manufacture/delivery parent, this candidate has 161 eligible of 236 configured Texas IDs when all evidence links are current, with 121 source keys and 1,168 links. These are offline candidate counts. Live availability requires the separate import and verification workflow. Existing holds remain in place. This packet makes no claim to complete all family offenses or the statewide offense inventory.
