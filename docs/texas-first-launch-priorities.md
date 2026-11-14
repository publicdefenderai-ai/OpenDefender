# Texas first-launch priorities from 2025 adult arrest records

The 25 highest-ranked eligible DPS offense codes account for 447,911 of 831,210 adult arrest records (53.9%). The Texas selector returned 33 choices on November 13, 2026 Pacific (05:39:47 UTC on November 14). These matched all 19 retained choices and 14 approved aliases in the manifest. The other 78 manifest IDs require exact reselection. Arrest volumes measure the priority of work. One person may appear more than once. Convictions and deferred adjudications appear separately in DPS disposition-year reports.

DPS labels the link by report year. The workbook headed “Arrest Records: 2023-2025” supplies the actual 2025 Adult and Juvenile columns and states “As of 01-13-2026 4:24PM.” The preceding workbook ends in 2024. The parser checks those internal headers and reconciles both statewide totals. It sorts descending by adult records, then ascending by eight-digit DPS code. Of 2,435 unique codes, 56 carry law label X and one has a nonnumeric generic citation. Removing those 57 excludes 71,549 adult records and leaves 2,378 codes and 759,661 adult records. Juvenile counts remain available in the artifact. Multiple codes may identify the same statute, a particular fact pattern or an enhancement. This sample does not establish statewide completeness. [DPS report index](https://www.dps.texas.gov/section/crime-records/crime-records-reports-and-statistical-information) · [Annual workbook](https://www.dps.texas.gov/administration/crime_records/pages/aareststatsoffense26.xlsx) · [DPS offense codes](https://www.dps.texas.gov/section/crime-records/appendix-k-offense-codes)

## Code-by-code results

The live column describes the strongest available match. “Section only” means a selectable ID cites the same section but lacks the exact ranked subdivision. “Held relative” means an unselectable record has a historical citation to the chapter section and may describe different conduct. The accompanying crosswalk lists individual IDs and retained subdivisions for each row. DPS citation strings are preserved verbatim.

| Rank | DPS code | DPS offense | Citation | Adult arrests | Live result |
|---:|---|---|---|---:|---|
| 1 | 54040009 | DRIVING WHILE INTOXICATED | PC 49.04 | 50,134 | Same reference, incomplete penalty |
| 2 | 13990031 | ASSAULT CAUSES BODILY INJURY FAMILY MEMBER | PC 22.01(a)(1) | 44,649 | Held relative |
| 3 | 35990247 | POSS CS PG 1/1-B <1G | HSC 481.115(b) | 36,273 | Held relative |
| 4 | 35620008 | POSS MARIJ < 2OZ | HSC 481.121(b)(1) | 34,955 | Held relative |
| 5 | 57070020 | CRIMINAL TRESPASS | PC 30.05(d)(1) | 30,751 | Section only |
| 6 | 23990191 | THEFT PROP >=$100<$750 | PC 31.03(e)(2)(A) | 19,943 | Held relative |
| 7 | 52030027 | UNL CARRYING WEAPON | PC 46.02(b) | 19,321 | Section only |
| 8 | 48010006 | RESIST ARREST SEARCH OR TRANSP | PC 38.03(a) | 18,432 | Held relative |
| 9 | 35990248 | POSS CS PG 1/1-B >=1G<4G | HSC 481.115(c) | 17,698 | Held relative |
| 10 | 13150005 | AGG ASSLT W/DEADLY WEAPON | PC 22.02(a)(2) | 17,589 | Section only |
| 11 | 54990067 | DRIVING W/LIC INV W/PREV CONV/SUSP/W/O FIN RES | TRC 521.457(f)(f-1) | 15,301 | Held relative |
| 12 | 13990001 | ASSAULT CAUSES BODILY INJ | PC 22.01(a)(1) | 14,591 | Held relative |
| 13 | 48010017 | EVADING ARREST DETENTION | PC 38.04(b) | 14,075 | Section only |
| 14 | 35990019 | POSS CS PG 2 < 1G | HSC 481.116(b) | 12,193 | No matching section or choice |
| 15 | 54040014 | DRIVING WHILE INTOXICATED BAC >= 0.15 | PC 49.04(d) | 11,546 | Section only |
| 16 | 23990196 | THEFT PROP <$2,500  2/MORE PREV CONV | PC 31.03(e)(4)(D) | 10,620 | Held relative |
| 17 | 54040010 | DRIVING WHILE INTOXICATED 2ND | PC 49.09(a) | 10,443 | Named choice cites wrong grading provision |
| 18 | 13990076 | ASSAULT FAM/HOUSE MEM IMPEDE BREATH/CIRCULAT | PC 22.01(b)(2)(B) | 10,224 | Held relative |
| 19 | 48010020 | EVADING ARREST DET W/VEH | PC 38.04(b)(2)(A) | 9,792 | Section only |
| 20 | 35990249 | POSS CS PG 1/1-B >=4G<200G | HSC 481.115(d) | 8,851 | Held relative |
| 21 | 24110003 | UNAUTH USE OF VEHICLE | PC 31.07 | 8,401 | No matching section or choice |
| 22 | 48990009 | FAIL TO ID FUGITIVE INTENT GIVE FALSE INFO | PC 38.02(d)(2) | 8,163 | Section only |
| 23 | 54040012 | DRIVING WHILE INTOXICATED/OPEN ALCH CONTAINER | PC 49.04(c) | 8,116 | Section only |
| 24 | 35990020 | POSS CS PG 2 >= 1G < 4G | HSC 481.116(c) | 8,068 | No matching section or choice |
| 25 | 38990027 | VIOL BOND/PROTECTIVE ORDER | PC 25.07(g) | 7,782 | Held relative |

## First correction family

The four DWI rows represent 80,239 adult arrest records. The live first-offense choice offers only “Penalties vary by jurisdiction.” The second-offense choice points to §49.04(b), the ordinary Class B provision, although its stable ID signals a repeat conviction and its displayed maximum is one year. Both live DWI choices display the same name. The repeat provision is §49.09(a). Neither the open-container nor the 0.15 testing branch has a distinct selectable choice. The candidate supplies four individually supported scopes, nine official section texts, bounded quotations and shared qualifications. It includes the September 1, 2025 school-crossing-zone change and the additional traffic fine and statutory indigency waiver. Verify the offense date and applicable prior convictions before applying a branch. [Penal Code chapter 49](https://tcss.legis.texas.gov/resources/PE/htm/PE.49.htm) · [Punishments](https://tcss.legis.texas.gov/resources/PE/htm/PE.12.htm) · [Traffic fine](https://tcss.legis.texas.gov/resources/TN/htm/TN.709.htm)

The current Texas manifest builder checks the primary offense title against each linked provision. A correctly cited punishment section has a different title and can cause reselection. Before publication, distinguish the primary conduct provision from explicitly authorized grading, definition and penalty dependencies. Keep exact source identity, date, hash and subdivision checks for every role, and require changes in a dependency to withhold its dependents. Add negative tests for wrong code, wrong subdivision, missing dependency and changed evidence. Correct the two proven stable-ID mappings, and separately review adding the BAC and open-container IDs. Exercise saved selection, search, translated or labeled fallback guidance, provenance and isolated import eligibility before requesting deployment and import. This research PR changes zero live choices or receipts.

Next, group the six controlled-substance and marijuana rows by the three Health and Safety Code sections, followed by bodily-injury and aggravated assault. Review penalty-group identities, weight thresholds, relationship conditions and exceptions for each code individually. DPS labels alone cannot establish those elements.

## Reproduction

Download the linked workbook and pass its local path to the ranking check. The public-selector evidence is a frozen public read. Future live counts or names can differ. Regenerating the comparison reads the committed manifest, legacy citation metadata and that observation.

```sh
python3 scripts/data-review/texas-verification/rank_arrests.py /path/to/aareststatsoffense26.xlsx --check scripts/data-review/output/texas-2025-arrest-priorities.json
python3 scripts/data-review/texas-verification/compare_priority.py
python3 scripts/data-review/texas-verification/check_dwi_sources.py /path/to/downloaded/chapters
./node_modules/.bin/vitest run tests/texas-priority-benchmark.test.ts
```
