# Texas prostitution, solicitation and promotion

This batch adds 21 individually source-bound choices under Penal Code §§43.02, 43.021, 43.03, 43.032 and 43.04. Receiving a fee, paying a fee and promoting another person's conduct are distinct statutory roles. The held generic `tx-solicitation` identity is not silently remapped.

## Priority and scope

Official DPS 2025 adult-arrest ranks 101 and 120 cover solicitation code 40040022 (1,101 arrests) and prostitution code 40040009 (798). Their combined 1,899 arrests are aggregate offense-code counts, not convictions, unique people or counts for each new subdivision. The retained priority artifact includes the official workbook URL, exclusions and SHA-256 `779a075cbb9e423f75330cda4fe9d89585c0b28fe41c5b577cd50161309b9483`. Reproduce with `python3 scripts/data-review/texas-verification/rank_arrests.py /path/to/workbook.xlsx --limit 150`.

| Statute | Choices | Supported distinction |
| --- | ---: | --- |
|43.02|3|Receiving-fee ordinary, one/two qualifying priors, three-or-more priors; causal trafficking/compelling-prostitution defense|
|43.021|10|Ordinary adult, adult prior, actual minor, represented minor, believed minor; each with and without school/function/UIL punishment increase|
|43.03|6|Proceeds agreement versus compensated solicitation, each ordinary/prior/minor; personal-services exclusion|
|43.032|1|Two or more qualifying promotion acts during at least 30 days; unanimity and same-victim count/conviction restrictions|
|43.04|1|Knowing enterprise role using two or more persons engaged in prostitution|

Online promotion, compelling prostitution as its own selectable offense, and trafficking as a publication family remain outside this packet. The latter statutes are retained only where required to support the receiving-fee defense. Existing 76 holds, all 501 previous manifest records and all previous manifest metadata remain unchanged.

## Consequences and historical boundaries

A school/function/UIL finding increases the prescribed **punishment** to the next category; the summaries do not silently rename the underlying grade. The deferred-adjudication and no-double-use prior rules are limited to the sections that actually contain them. The article 62.001(5)(B-1) registration condition is “punishable as a felony of the second degree,” not simply a minor-victim label. School-enhanced repeat and minor cases are expressly left for the applicable Chapter 62 assessment rather than ruled out or assigned automatic lifetime registration.

The receiving-fee custody summaries include article 42A.515's mandatory suspension/community-supervision rules for the applicable Class B and state-jail offenses, prior/jury exceptions, and the program requirement only where a local program is established. Aggravated promotion includes the express registration listing and qualified judge/jury/deferred-supervision restrictions. These are not presented as unconditional incarceration or a blanket prohibition on every form of supervision. The first-offender solicitation program is optional and subject to eligibility and prosecutor consent.

Fifteen official enrolled enactments from 2009–2025 are retained with exact selected spans, hashes, acquisition timestamps and declared HTML decoding. They support these chronological distinctions:

- 2019 SB 1802 increased promotion/aggravated-promotion grades; later versions do not move that increase to 2023 or 2025.
- 2021 HB 1540 separated paying-fee solicitation into §43.021 and raised its ordinary/prior grading. Both HB 1540 and SB 1831 enacted the school/function/UIL increase in 2021. The 2023 amendments relocated it to §43.021(b-1); they did not first create it.
- 2023 SB 1653 broadened the minor-promotion wording by removing the former “engaging in prostitution” qualification.
- 2025 HB 1778 changed the minor-solicitation predicate wording and added continuous promotion. Its any-element transition in §2.12 expressly applies to §43.021(b). It is not incorrectly attributed to new §43.032: that choice is bounded to a period entirely on/after September 1, 2025, with earlier/straddling periods requiring separate applicability review.

Current statute dates are version metadata, not proof that every rule first began on the latest date. Earlier conduct requires the applicable historical law; this packet is not a complete reconstruction of every pre-2009 prosecution.

## Evidence and accounting

Thirty statutory documents support 310 individually role-bound references. Twelve are newly retained from official sources; 18 existing documents reuse their authentic timestamps and unchanged hashes. No receipt or approval date is extended. All new choices reject altered/missing dependencies and resolve only their exact saved IDs. Spanish/Chinese responses retain an explicit untranslated-English fallback. No unverified jury instruction is published, without asserting that no applicable instruction exists.

Against merged main `9cebb7bbf1c4a4afec0ffad19e1a6195ee973fc0`, offline counts are 522 configured, 446 eligible, 76 held, 262 source keys and 5,218 links/snapshots. These are offline fixture/import-plan counts, not production availability or authorization to import.

## Verification

- 63 focused tests passed across five suites: legal distinctions, chronological guards, source integrity, incomplete/changed dependencies, saved identity, translation fallback and instruction guards.
- All 21 regenerated manifest records match exactly; all 501 previous records and all non-record manifest fields are unchanged.
- Typecheck and production build passed; all 25 isolated built-selector checks passed without skips or retries.
- The build/browser checks preceded the clean integration of independent merged PR 287 DACA/TPS UI changes. No Texas files overlapped; final evidence replay was rerun after integration. No claim is made that the complete browser/full-regression suites were rerun.
- No production/database operation, import, migration, receipt renewal, monitoring activation or deployment was performed.

```sh
npx tsx scripts/data-review/texas-verification/replay-assault-intoxication.ts sexual-commerce
npx vitest run tests/texas-sexual-commerce.test.ts tests/texas-ranked-possession.test.ts tests/texas-source-database.test.ts tests/texas-deployment-seed.test.ts tests/jury-instructions.test.ts
```
