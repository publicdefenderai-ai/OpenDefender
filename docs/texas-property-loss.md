# Texas property-loss and theft review

Extending the frozen 2025 DPS ranking to 75 codes identifies six additional high-volume property offenses in the same two statutory families, accounting for **23,371 adult arrest records**. Each rank uses the same workbook, exclusions, adult column and tie-break as the original top 25. The new file reproduces the original first 25 entries. Counts measure arrests and can include the same person more than once. [Top 75 and workbook identity](../scripts/data-review/output/texas-2025-arrest-priorities-top75.json)

| Rank | DPS code | Conduct and grading | 2025 adult arrests |
|---:|---|---|---:|
| 28 | 23990194 | Theft, value $2,500 to under $30,000, §31.03(e)(4)(A) | 6,789 |
| 30 | 29990042 | Criminal mischief, loss $100 to under $750, §28.03(b)(2) | 6,036 |
| 48 | 29990043 | Criminal mischief, loss $750 to under $2,500, §28.03(b)(3)(A) | 3,843 |
| 59 | 29990044 | Criminal mischief, loss $2,500 to under $30,000, §28.03(b)(4)(A) | 2,590 |
| 67 | 23990198 | Theft, value $30,000 to under $150,000, §31.03(e)(5) | 2,097 |
| 68 | 23990008 | Theft of a firearm, §31.03(e)(4)(C) | 2,016 |

Seven choices cover the ordinary criminal-mischief loss ranges. The retained section-wide ID now identifies damage/destruction, tampering with resulting financial loss or substantial inconvenience, and marking another owner's property without effective consent. The former misdemeanor-only summary omitted felony exposure. Section 28.06 distinguishes destroyed and damaged property and supplies a valuation rule when loss cannot be determined by the statutory criteria. Special branches involving schools, protected places, utilities, livestock, critical infrastructure and other specified facts still require matching their own circumstances. [Criminal mischief and valuation](https://tcss.legis.texas.gov/resources/PE/htm/PE.28.htm#28.03)

Five theft choices add the four ordinary felony value ranges and firearm theft. The DPS amount-based entries map to the value clauses even when the same subdivision contains a separate special-property alternative. The firearm provision has no minimum value. Individual choices retain unlawful appropriation with intent to deprive, valuation, aggregation, sentencing, and the grading changes that can apply to the particular property or circumstances. CPJC 31.2 covers underlying theft conduct. No verified criminal-mischief item was assigned. [Theft](https://tcss.legis.texas.gov/resources/PE/htm/PE.31.htm#31.03) · [Penal Code chapter 12](https://tcss.legis.texas.gov/resources/PE/htm/PE.12.htm)

The packet binds 13 records (12 new IDs and one existing ID) to 19 official sections through 93 links. Texas reports September 1, 2025 as the latest effective date for §28.03 and December 4, 2025 for §31.03. The offense date matters. The candidate has 93 eligible of 168 configured Texas choices when all required evidence links are current. Production availability requires separate import and verification. The earlier age-only carry and generic weapons holds remain intact.

Reproduce the ranking with `python3 scripts/data-review/texas-verification/rank_arrests.py WORKBOOK --limit 75 --check scripts/data-review/output/texas-2025-arrest-priorities-top75.json`. Reproduce the 13 manifest records offline with `node --import tsx scripts/data-review/texas-verification/replay-assault-intoxication.ts property-loss`.
