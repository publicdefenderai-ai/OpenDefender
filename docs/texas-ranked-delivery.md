# Texas manufacture and delivery weights

Fourteen choices cover the current weight branches under Health and Safety Code §§481.112, 481.1123 and 481.113. Each choice binds its conduct, grade, drug-group definitions, evidentiary rule and sentencing dependencies to retained official sections. Their fourteen selected DPS codes account for 13,199 adult arrest records in 2025. The counts prioritize review and do not establish convictions, unique defendants, offense dates or statewide completeness. [Official DPS workbook](https://www.dps.texas.gov/administration/crime_records/pages/aareststatsoffense26.xlsx)

| DPS rank | Code | Current section | Adult arrests |
| --- | --- | --- | ---: |
| 32 | 35990003 | §481.112(d) | 5,599 |
| 74 | 35990002 | §481.112(c) | 1,602 |
| 77 | 35990008 | §481.113(d) | 1,563 |
| 87 | 35990281 | §481.1123(d) | 1,327 |
| 115 | 35990001 | §481.112(b) | 830 |
| 135 | 35990276 | §481.112(f) | 608 |
| 165 | 35990243 | §481.1123(c) | 364 |
| 184 | 35990275 | §481.112(e) | 289 |
| 196 | 35990284 | §481.113(e) | 262 |
| 220 | 35990007 | §481.113(c) | 224 |
| 229 | 35990283 | §481.1123(f) | 203 |
| 280 | 35990280 | §481.1123(b) | 132 |
| 286 | 35990282 | §481.1123(e) | 126 |
| 369 | 35990006 | §481.113(b) | 70 |

The ranking uses the retained official workbook with SHA-256 `779a075cbb9e423f75330cda4fe9d89585c0b28fe41c5b577cd50161309b9483`, dated January 13, 2026. To reproduce the underlying ranking, run `python3 scripts/data-review/texas-verification/rank_arrests.py /path/to/aareststatsoffense26.xlsx --limit 369`. The selected fourteen rows are the highest-ranked ordinary code for each exact current weight subdivision in these three sections. Lower-ranked duplicate citations, differently described historical codes and specialized zone codes are outside this selected benchmark. The current statutory elements and offense date must independently support a charge.

## Conduct and punishment

Group 1 uses five weight choices, Group 1-B uses five, and Group 2 or 2-A uses four. Manufacture, actual or constructive delivery, offers to sell and possession with intent to deliver retain their statutory definitions. Offers to sell require the independent corroboration specified by §481.182. Chapter 481 authorizations and practitioner exceptions remain explicit. [Official Chapter 481](https://tcss.legis.texas.gov/resources/HS/htm/HS.481.htm)

The Group 1-B under-one-gram grade is a third-degree felony. Its four-to-under-200-gram branch has a ten-year minimum and $20,000 fine ceiling. At 200 grams its minimum rises to 15 years with a $200,000 ceiling, and at 400 grams to 20 years with a $500,000 ceiling. Group 1 and Group 2 use different thresholds, minima and fine limits. The primary sections show September 1, 2023 as the latest effective date. The Group 1-B summaries identify that amendment explicitly. The retained definitions and repeat-offender provisions include later effective dates, and the choice descriptions require the offense-date law. Historical event dates cannot be inferred from the year of arrest. [Group 1-B](https://tcss.legis.texas.gov/resources/HS/htm/HS.481.htm#481.1123)

The summaries distinguish the drug-free-zone degree increases from the separate five-year minimum/fine-doubling provision. The child-use and consumption-causing-death-or-serious-injury increases apply only to the state jail, third-degree and second-degree base grades listed in §§481.140 and 481.141. The latter requires manufacture or delivery and its causal finding, and prohibits the increase when the same criminal episode is also prosecuted under Penal Code §19.02(b)(4). Consecutive-sentence rules remain explicit. These contextual consequences require their own findings and do not create additional charge choices. [Drug-free zones](https://tcss.legis.texas.gov/resources/HS/htm/HS.481.htm#481.134) · [Child-use increase](https://tcss.legis.texas.gov/resources/HS/htm/HS.481.htm#481.140) · [Consumption-result increase](https://tcss.legis.texas.gov/resources/HS/htm/HS.481.htm#481.141)

CPJC 81.13, publisher version 048, is linked with an express actual/constructive-transfer scope. It supplies that conduct theory only. Manufacture, offer-to-sell, possession-with-intent and punishment findings require their applicable instructions. English summaries return the established English-content notice for Spanish and Chinese requests. [Publisher CPJC 81.13](https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F81_Controlled_Substance_Offenses%2FCPJC81-13.htm&version=048)

## Evidence and availability

The new records bind 128 links to nineteen sections acquired from the official TCSS resources on November 17, 2026. All twelve sections shared with earlier retained packets match those packets' text hashes. The existing 202 manifest entries and manifest-generation timestamp compare equal after parsing. New source acquisition timestamps belong to this packet. The 2023 history for the primary statutes and latest section-level history dates for their dependencies are retained alongside each text and hash.

Replay the candidate with `node --import tsx scripts/data-review/texas-verification/replay-assault-intoxication.ts ranked-delivery`. The tests independently rebuild each record through the production builder, verify every text and snapshot hash, reject missing or changed required evidence, and check every required runtime link. The candidate has 141 eligible of 216 configured Texas IDs when all current evidence is available, with 103 source keys and 903 links. These are offline candidate counts. Live availability requires the separate import and verification workflow.

Four preexisting generic §481.112 identities already have `require_exact_reselection` dispositions. Saved guidance and exports now explicitly require an exact substance group and weight choice for those IDs, including code-only saved selections. The original IDs and historical manifest accounting remain. Their old generic ten- or twenty-year ceiling cannot substitute for a reviewed branch. The shelter-center and age-only carrying holds remain in place.
