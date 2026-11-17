# Texas possession by substance and weight

Seven additional Texas DPS codes account for **22,824 adult arrests in 2025**. The two grounds for dangerous-drug possession share a grading citation. Its 3,978 arrests count once; the workbook does not establish how many involved intent to sell. Arrest records can include the same person more than once. [Ranked entries and workbook hash](../scripts/data-review/output/texas-possession-weights-priorities.json)

| Rank | DPS code | Supported branch | Adult arrests |
|---:|---|---|---:|
| 29 | 35990021 | Penalty Group 2, 4 to under 400 grams, §481.116(d) | 6,466 |
| 34 | 35990023 | Penalty Group 3, under 28 grams, §481.117(b) | 5,478 |
| 46 | 35990133 | Dangerous drug, §483.041(d), separate choices for (a) and (b) | 3,978 |
| 55 | 35620010 | Marihuana, over four ounces through five pounds, §481.121(b)(3) | 2,918 |
| 70 | 35620009 | Marihuana, over two through four ounces, §481.121(b)(2) | 1,842 |
| 88 | 35990213 | Penalty Group 2-A, two ounces or less, §481.1161(b)(1) | 1,286 |
| 113 | 35620020 | Marihuana, two ounces or less in a qualifying zone, §481.134(f) | 856 |

Twenty-two new drug choices cover the remaining possession weights for Groups 1/1-B and 2, all Group 3 and 2-A weights, the remaining marihuana weights, the specified marihuana zone finding and both dangerous-drug grounds. Group 2-A uses its own list, mental state and aggregate-weight rule. For marihuana the quantity must be usable and the statutory definition excludes hemp. The offense date matters. The Chapter 481 possession sections in this batch show September 1, 2023 as their latest effective date; §483.041 shows September 1, 2021. [Chapter 481](https://tcss.legis.texas.gov/resources/HS/htm/HS.481.htm) · [Chapter 483](https://tcss.legis.texas.gov/resources/HS/htm/HS.483.htm#483.041)

The upper Group 1/1-B branch begins at 400 grams and carries a ten-year minimum and $100,000 fine ceiling. At 400 grams the Group 2 and Group 3 branches instead use five years and $50,000. Site-specific enhancements follow the enumerated subsections in §481.134. The separate misdemeanor zone lists omit the two lowest Group 2-A grades. The private-residence/no-minor exception applies to §481.134(f). For the state jail marihuana and Group 2-A weights, article 42A.551(c) excludes amounts over one pound from mandatory suspension. Lower-weight overdose defenses and exceptions are identified on the branches to which they apply. [Drug-free zones](https://tcss.legis.texas.gov/resources/HS/htm/HS.481.htm#481.134) · [Community supervision](https://tcss.legis.texas.gov/resources/CR/htm/CR.42A.htm#42A.551)

CPJC 81.9 is linked to the higher marihuana weight branches. Existing CPJC 81.10 mappings address underlying controlled-substance possession. Neither instruction supplies an automatic zone finding. [Texas Bar Books CPJC 81.9](https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F81_Controlled_Substance_Offenses%2FCPJC81-9.htm&version=048)

A twenty-third choice covers Penal Code §30.05(d)(3)(D). The existing after-warning summary now includes that circumstance. The property must be of or within a general residential operation actually operating as a residential treatment center. Section 30.05(b)(13) incorporates the Human Resources Code definition of a general residential operation. The separate shelter-center branch under (d)(3)(A) remains held. [Penal Code §30.05](https://tcss.legis.texas.gov/resources/PE/htm/PE.30.htm#30.05) · [Human Resources Code §42.002](https://tcss.legis.texas.gov/resources/HR/htm/HR.42.htm#42.002)

The 23 new records bind 162 links to 33 official sections. All 23 sections overlapping earlier Texas evidence packets matched their prior text hashes. Offline replay uses `node --import tsx scripts/data-review/texas-verification/replay-assault-intoxication.ts possession-weights`. The candidate has 127 eligible of 202 configured Texas IDs when all evidence links are current. Public availability depends on separate import and verification.
