# Texas indecent exposure, indecent assault and public lewdness

This batch adds 30 individually source-bound choices: eight indecent-exposure choices (anus/genitals across four grades), 16 indecent-assault choices (four acts across the four common grading paths), and six public-lewdness choices (three acts with ordinary/civil-commitment grading). It does not import records, renew receipts or establish production availability.

## Priority and bounded coverage

The official DPS 2025 adult-arrest workbook ranks indecent exposure code 36150001 at 84 with 1,405 arrests and indecent assault code 36230001 at 123 with 771. These two aggregate codes total 2,176 adult arrests, not convictions, unique defendants or per-subdivision counts. The workbook and reproducible ranking metadata are retained in `texas-indecent-contact-priorities.json`; its SHA-256 remains `779a075cbb9e423f75330cda4fe9d89585c0b28fe41c5b577cd50161309b9483`. Reproduce ranks with `python3 scripts/data-review/texas-verification/rank_arrests.py /path/to/aareststatsoffense26.xlsx --limit 150`.

| Section | Choices | Scope |
| --- | ---: | --- |
|21.07(a)(1)-(3), (b)|6|Sexual intercourse, deviate sexual intercourse and sexual contact; public-place or nonpublic/recklessness alternative; ordinary Class A versus civilly committed SVP third degree|
|21.08(a), (b)|8|Anus versus genitals; no prior Class B, one prior Class A, two or more priors state jail, civilly committed SVP third degree|
|22.012(a)(1)-(4), common (b)/(b)(1)/(b)(2)|16|Four nonconsensual acts with specific sexual intent; ordinary Class A, nonprovider prior state jail, qualifying provider state jail, prior-provider third degree|

All non-SVP exposure choices exclude the civil-commitment scenario. Public lewdness does not transform all private consensual conduct into an offense. Indecent assault requires both absence of consent and the specific sexual intent. Provider grading requires both treatment/service to the victim and conduct beyond generally accepted practices; a job title alone is insufficient. A prior provider-paragraph conviction triggers the separate third-degree provision even if the current act is not during treatment.

The held generic `tx-indecent-exposure` ID remains withheld; it is not silently assigned one of eight new choices. All 76 prior holds and all 471 previous manifest records are unchanged. Saved canonical IDs resolve precisely; ID-less section descriptions require reselection.

## Two retained 2025 grading versions

The official §22.012 page contains two subsection (b) versions. HB 2593 adds a second-degree elderly/disabled-victim branch; SB 1610 adds a third-degree qualifying civil-commitment-facility staff/contractor branch. The ordinary and (b)(1)/(b)(2) wording is common to both. This packet retains both complete versions rather than deleting one or silently harmonizing the duplicated (b)(3) numbering.

Every new §22.012 summary expressly excludes both special scenarios and says they may carry higher grades. The elderly threshold and disabled-individual definition are retained through §22.04(c). The civil-commitment definitions are retained through Health and Safety Code Chapter 841. Neither special scenario is treated as an ordinary misdemeanor. The aggregate DPS indecent-assault code therefore has bounded support here, not a claim of complete statewide coverage for every possible fact pattern.

## Dates and consequences

Five official enrolled acts are retained with full text, acquisition metadata, hashes and exact selected spans: 2023 SB 1179, HB 1730 and HB 55, and 2025 SB 1610 and HB 2593. The summaries distinguish the 2023 public-lewdness civil-commitment, indecent-exposure repeat/civil-commitment, and indecent-assault provider/prior changes from the retained 2025 versions. Their transition clauses treat an offense with any element before the effective date as governed by earlier law. H.B. 1730 created the one-prior and two-or-more-prior exposure grades effective September 1, 2023; S.B. 1179 separately added the civil-commitment grade that day. S.B. 1610 reenacted their combined text in 2025. This packet does not resolve how the separate 2023 versions interacted before that reenactment. Current charging date alone does not determine applicable grading.

For exposure, the penalty text identifies article 62.001(5)(F)'s second-violation registration rule and its deferred-adjudication exception. Articles 62.001, 62.051 and 62.101 are retained. It does not assign everyone the same registration period or claim that other registration consequences never apply.

## Sources, instructions and accounting

Twenty statutory documents support 394 separately role-bound references. Five documents are newly retained from the official TCSS site on November 20, 2026 UTC; 15 existing documents retain their authentic acquisition timestamps and hashes. The manifest generation timestamp remains unchanged. Prior evidence and receipt files are untouched.

The publisher's current CPJC 21.8 is specifically **Indecent Exposure of Genitals** (edition 055, chapter updated August 2026). Its verified URL is `https://bookviewer.texasbarpractice.com/bookviewer/eviewer?bookValue=CPJC&keyName=..%2F21_Sexual_Offenses%2FCPJC21-8.htm&version=055`. Only four genital-exposure rows display that reference, expressly limited to underlying conduct; it is not represented as an anus-exposure instruction or support for grading. Other rows leave unverified mappings blank without claiming no instruction exists. Spanish and Chinese requests retain explicit untranslated-English fallback for the new choices.

Against merged main `4edd905456ceb9f831066dc1bb810abf8e87634e`, the offline fixture has 501 configured Texas records, 425 eligible and 76 withheld, 250 source keys and 4,908 links/snapshots. These are offline source-linked counts, not production availability.

## Verification

- All 30 regenerated records match their committed manifest entries exactly.
- 64 focused tests pass across five suites, including an enrolled-act guard distinguishing the 2023 exposure enhancements from the 2025 reenactment; no assertion was removed or skipped.
- Typecheck passed.
- Production build passed; all 24 isolated built-selector scenarios passed without retries.
- No database, import, migration, monitoring, receipt-renewal or deployment operation was performed.

```sh
npx tsx scripts/data-review/texas-verification/replay-assault-intoxication.ts indecent-contact
npx vitest run tests/texas-indecent-contact.test.ts tests/texas-ranked-possession.test.ts tests/texas-source-database.test.ts tests/texas-deployment-seed.test.ts tests/jury-instructions.test.ts
npx tsc --noEmit
```
