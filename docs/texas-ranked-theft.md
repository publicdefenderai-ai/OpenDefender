# Texas theft by value and prior convictions

| 2025 DPS rank | Offense code | Statutory branch | Adult arrests |
|---:|---|---|---:|
| 6 | 23990191 | §31.03(e)(2)(A), property worth at least $100 and less than $750 | 19,943 |
| 16 | 23990196 | §31.03(e)(4)(D), property worth less than $2,500 with at least two previous theft convictions | 10,620 |

Together these codes account for 30,563 reported adult arrests. These figures can count the same person more than once and do not establish convictions. [Texas DPS benchmark and methodology](../scripts/data-review/output/texas-2025-arrest-priorities.json)

Both choices require unlawful appropriation and intent to deprive the owner. Each supports the three alternative grounds for unlawful appropriation in subsection (b). The ordinary Class B branch ends below $750. The state jail felony branch ends below $2,500 and requires convictions for theft of any grade. Arrests alone are insufficient. Section 31.08 supplies valuation and deduction rules. Section 31.09 permits aggregation under one scheme or continuing course of conduct. Special property, victims and circumstances can change punishment. The catalog does not attach either branch to a saved section-only theft selection. The existing generic theft, theft by receiving and shoplifting IDs retain their holds. [Texas Penal Code, chapter 31](https://tcss.legis.texas.gov/resources/PE/htm/PE.31.htm)

The official chapter 31 text was retrieved November 16, 2026 Pacific. Its §31.03 history includes amendments effective December 4, 2025. The candidate reuses the official chapter 12 download from November 15 Pacific with its original retrieval time. The packet records 12 distinct sections and 19 source links. Earlier offense dates require checking the version in force at the time. CPJC 31.2 is linked for the underlying theft conduct. [Texas Penal Code, chapter 12](https://tcss.legis.texas.gov/resources/PE/htm/PE.12.htm) · [Texas Bar Books CPJC 31.2](https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F31_Theft%2FCPJC31-2.htm&version=037)

Run the offline reproduction with `node --import tsx scripts/data-review/texas-verification/replay-assault-intoxication.ts ranked-theft`. Relative to the preceding reviewed-possession draft, both new rows increase offline eligibility from 46 to 48 of 124 Texas choices. All 76 existing holds remain. Production requires a completed approved import with each required current link and a separate public availability check.
