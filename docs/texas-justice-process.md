# Texas justice-process offenses

Seventeen individually supported choices cover Penal Code §§37.09, 38.15 and 36.06. The three selected DPS codes recorded 14,168 adult arrests in 2025. Arrest counts are a review priority measure, not convictions, unique people or counts for the new sub-branches.

| DPS rank | Code | Recorded citation | Adult arrests | Bounded treatment |
| --- | --- | --- | ---: | --- |
| 26 | 48040003 | 37.09(c) | 7,281 | Separate pending-investigation, later-investigation and fabrication conduct, with adjacent corpse grades/reporting duty |
| 41 | 73991084 | 38.15(b) | 4,517 | Subdivisions (a)(1)-(5), with the officer-class limitation below |
| 63 | 50990041 | 36.06(c) | 2,370 | Separate retaliation, obstruction and disclosure conduct; adjacent juror and resulting-injury grades |

The [official DPS workbook](https://www.dps.texas.gov/administration/crime_records/pages/aareststatsoffense26.xlsx) is the January 13, 2026 snapshot with SHA-256 `779a075cbb9e423f75330cda4fe9d89585c0b28fe41c5b577cd50161309b9483`. `python3 scripts/data-review/texas-verification/rank_arrests.py /path/to/aareststatsoffense26.xlsx --limit 75` reproduces the ranking. Multiple new choices can share one aggregate DPS code; the arrest count is counted once, not once per choice. This packet does not claim complete matching of that code when branches remain outside scope.

## Individual choices

| ID | Conduct subdivision | Grading subdivision | Classification |
| --- | --- | --- | --- |
| tx-pc-37-09-pending | §37.09(a)(1) | (c) | Third-degree felony |
| tx-pc-37-09-pending-corpse | §37.09(a)(1) | (c) | Second-degree felony |
| tx-pc-37-09-subsequent | §37.09(d)(1) | (c) | Third-degree felony |
| tx-pc-37-09-subsequent-corpse | §37.09(d)(1) | (c) | Second-degree felony |
| tx-pc-37-09-fabricating | §37.09(a)(2) | (c) | Third-degree felony |
| tx-pc-37-09-unreported-corpse | §37.09(d)(2) | (c) | Class A misdemeanor |
| tx-pc-36-06-retaliation | §36.06(a)(1) | (c) | Third-degree felony |
| tx-pc-36-06-retaliation-juror | §36.06(a)(1) | (c)(1) | Second-degree felony |
| tx-pc-36-06-obstruction | §36.06(a)(2) | (c) | Third-degree felony |
| tx-pc-36-06-obstruction-juror | §36.06(a)(2) | (c)(1) | Second-degree felony |
| tx-pc-36-06-disclosure | §36.06(a-1) | (c) | Third-degree felony |
| tx-pc-36-06-disclosure-injury | §36.06(a-1) | (c)(2) | Second-degree felony |
| tx-pc-38-15-a-1 | §38.15(a)(1) | (b) | Class B misdemeanor |
| tx-pc-38-15-a-2 | §38.15(a)(2) | (b) | Class B misdemeanor |
| tx-pc-38-15-a-3 | §38.15(a)(3) | (b) | Class B misdemeanor |
| tx-pc-38-15-a-4 | §38.15(a)(4) | (b) | Class B misdemeanor |
| tx-pc-38-15-a-5 | §38.15(a)(5) | (b) | Class B misdemeanor |

## Source distinctions

[Section 37.09](https://tcss.legis.texas.gov/resources/PE/htm/PE.37.htm#37.09) distinguishes an investigation already pending/in progress from knowledge of an offense and intent to impair a subsequent investigation. Fabrication requires knowledge of falsity and intent to affect the investigation or proceeding. Altering, destroying or concealing a human corpse is a second-degree felony; failing to report a corpse under the separate awareness/circumstances rule is a Class A misdemeanor. The privileged/work-product and prohibited-visual-material provisions are scoped to relevant conduct. The visual-material destruction defense is not presented as a defense for a corpse.

[Section 36.06](https://tcss.legis.texas.gov/resources/PE/htm/PE.36.htm#36.06) distinguishes retaliation for service/status, obstruction of service, and the address/telephone-disclosure offense. Intentional/knowing unlawful harm or threats and their required connection are not replaced by a generic prohibition on criticism. The juror circumstance and disclosure resulting in bodily injury have separate second-degree grades. The website-posting evidentiary rule follows a written safety demand, with 48-hour removal and four-year republication periods. It is not automatic guilt. The current text includes September 1, 2025 amendments, so earlier conduct needs the applicable version.

[Section 38.15](https://tcss.legis.texas.gov/resources/PE/htm/PE.38.htm#38.15) requires criminal negligence, not mere interference. Speech-only conduct is a statutory defense. The motorist-warning defense is confined to (a)(1). The information-dissemination presumption and media exceptions remain separate from the ordinary conduct elements and the speech defense. Subdivisions (a)(6)-(8), covering animal-control, regulatory-site and utility duties, are not published by this batch; their absence is not a finding that the conduct is noncriminal. The September 1, 2025 version and incorporated definitions are retained.

### Two published peace-officer versions

The [official article 2A.001](https://tcss.legis.texas.gov/resources/CR/htm/CR.2A.htm#2A.001) publishes two adjacent versions from 2025 amendments. Both full texts and publisher notices are retained. The parser now keeps repeated section anchors rather than returning only the first version. The production builder accepts this exact reviewed two-version document through a narrow article-specific header check while still requiring the pinned content hash. Missing, altered or unapproved versions remain rejected.

The ordinary sheriff/deputy, constable/deputy, municipal-police/marshal and DPS categories in subdivisions (1)-(4) match. Those are the only peace-officer categories resolved here. The versions differ in later school, hospital, juvenile/investigator and other categories. This packet does not harmonize those differences or publish an expanded officer list. The limitation is explicit in every affected summary and reference, including the honorably-retired-officer branch of §36.06. The separate public-servant, witness, informant and reporting-person bases retain their own requirements. Corrections-officer/jailer supervision of a working animal remains a separate statutory basis.

## Evidence and instructions

Nineteen official sections support 144 required links for these seventeen choices. Nine source texts also appear in prior reviewed evidence and match exactly; an additional source key was already in the retained manifest. All 236 previous manifest records and its generation timestamp remain unchanged. No receipt is renewed. Rebuild with `node --import tsx scripts/data-review/texas-verification/replay-assault-intoxication.ts justice-process`.

Publisher pages verified for the specific conduct are CPJC 37.9, 37.10, 37.11 and 37.12 (edition 053) and 36.9/36.10 (edition 037). The mappings describe underlying conduct only; they do not certify all enhancement or officer-class issues. The disclosure and public-duty mappings remain unverified and are omitted. No claim is made that no instruction exists.

- [CPJC 37.9](https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F37_Perjury_and_Other_Falsification%2FCPJC37-9.htm&version=053)
- [CPJC 37.10](https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F37_Perjury_and_Other_Falsification%2FCPJC37-10.htm&version=053)
- [CPJC 37.11](https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F37_Perjury_and_Other_Falsification%2FCPJC37-11.htm&version=053)
- [CPJC 37.12](https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F37_Perjury_and_Other_Falsification%2FCPJC37-12.htm&version=053)
- [CPJC 36.9](https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F36_Bribery_and_Corrupt_Influence%2FCPJC36-9.htm&version=037)
- [CPJC 36.10](https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F36_Bribery_and_Corrupt_Influence%2FCPJC36-10.htm&version=037)

With its family-safety parent, the candidate has 178 eligible of 253 configured Texas IDs, 130 source keys and 1,312 links under complete current evidence. These are offline candidate counts, not live availability. Existing holds and exact-selection requirements remain. Spanish and Chinese requests show the honest English-content notice. Imports, activation and deployment remain separate operations.
