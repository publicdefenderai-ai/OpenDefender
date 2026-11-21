# Texas public-peace firearm and obstruction branches

This batch adds 25 individually supported choices under Penal Code §§42.01, 42.03 and 42.12. The generic `tx-disorderly-conduct` identity requires exact reselection; it is not silently converted into a firearm or obstruction charge. The already-held municipal-discharge, noise and panhandling identities stay held. Section 42.01's speech, noise, odor, fighting, exposure and observation branches are outside this packet.

## Priority and scope

The retained official DPS 2025 workbook ranks municipal firearm discharge at 99 (code 52130007; 1,127 adult arrest records), passageway obstruction at 118 (53070004; 803) and firearm disorderly conduct at 122 (53110006; 782). The combined 2,712 records are offense-code arrest totals, not unique defendants, convictions or counts for each new branch. The workbook hash is `779a075cbb9e423f75330cda4fe9d89585c0b28fe41c5b577cd50161309b9483`. [DPS workbook](https://www.dps.texas.gov/administration/crime_records/pages/aareststatsoffense26.xlsx)

| Conduct | Choices | Individually supported distinctions |
| --- | ---: | --- |
| §42.01(a)(7), (8), (9) | 3 | Public discharge excluding roads/ranges; alarming display; road discharge. (7)/(8) are Class B; (9) is ordinarily Class C. |
| §42.12(a) | 1 | Reckless discharge inside a municipality with at least 100,000 population; Class A. |
| §42.03(a)(1) | 7 | Obstruction: ordinary, emergency vehicle, emergency facility, exhibition, exhibition prior, exhibition intoxication, exhibition injury. |
| §42.03(a)(2)(A) | 7 | Reasonable order to prevent obstruction, with the same separately identified grade conditions. |
| §42.03(a)(2)(B) | 7 | Reasonable order to disperse people dangerously close to a fire, riot or other hazard, with the same separately identified grade conditions. |

The obstruction conduct theories are alternatives, not an assertion that one incident authorizes 21 counts. Their ordinary branch is Class B; the ordinary reckless-driving-exhibition branch is Class A; the specified emergency-access and enhanced exhibition branches are state jail felonies. Fifteen new choices have a felony category and ten a misdemeanor category. [Official chapter 42](https://tcss.legis.texas.gov/resources/PE/htm/PE.42.htm)

## Boundaries that affect meaning

- Public firearm discharge excludes public roads and the statutorily defined sport shooting range. Road discharge is its own subdivision and ordinary grade. The wild-animal defense requires reasonable fear of bodily injury from a defined dangerous wild animal. The Parks and Wildlife employee exception requires the specified authority to take mortally injured or apparently diseased wildlife. It is not general permission for a private person to shoot across a road.
- Alarming display requires the statutory manner calculated to alarm; firearm possession or visibility alone does not establish it. Municipal discharge requires recklessness, the corporate boundary and the population threshold; population follows Government Code §311.005(3), subject to its statutory/context qualification.
- Obstruction retains lack of legal privilege or authority, the relevant mental state, and reasonable-order/issuer-knowledge conditions. Section 42.04's expression-related prior-order requirement and defenses remain in all obstruction summaries. No blanket prohibition on protest or gatherings is asserted.
- The emergency-vehicle enhancement requires knowing prevention plus an operating qualifying audible **or** visual signal. Emergency-vehicle status alone is insufficient. Emergency-facility access requires the licensed-hospital or emergency-medical-care definition; not every office qualifies.
- A reckless driving exhibition requires all three §42.03(f) acts, a highway/street and at least two spectators assembled to watch. It is not synonymous with ordinary reckless driving. Prior, intoxication and resulting bodily-injury predicates remain distinct; serious bodily injury is not required by (e)(3).
- Article 42A.517's at-least-ten-day county-jail condition applies when community supervision is granted for a state-jail-felony obstruction conviction. It is not an automatic prison minimum or a promise of supervision. The exhibition rows retain Chapter 59 property-forfeiture authority and process qualifications rather than presenting forfeiture as automatic.

Local Government Code is now recognized as an explicit dependency code for the incorporated shooting-range definition. The ordinary primary-title and exact hash/dependency checks remain intact.

## Amendment chronology and evidence

Thirty-one official statutory documents support 340 role-bound references. Fourteen documents reuse retained evidence with its actual acquisition timestamps; seventeen are newly retained. Five official enrolled acts bind the material chronology, including reuse of the existing unchanged H.B. 4595 document and acquisition timestamp:

- 2021 H.B. 9 established emergency-access felony grading and article 42A.517.
- 2021 S.B. 1495 established the exhibition grades and its all-three-acts definition.
- 2023 H.B. 4595 reconciled the concurrent §42.03 text; it did not first create the 2021 grades.
- 2023 H.B. 1442 added the other-law prosecution limitation and exhibition forfeiture coverage, with its prospective transition.
- 2023 H.B. 3065 added the narrow wildlife-employee exception to road discharge. It did not first enact the firearm disorderly-conduct offenses or grades.

The enacted texts and selected spans retain source URLs, acquisition times, decoding, exact offsets and hashes. The summaries distinguish commencement of the substantive rule from a section's latest amendment metadata. Prior/straddling conduct requires the applicable historical law; this is not a reconstruction of every historical version.

## Accounting and integration

Based on main `cdd21aa75da92d0751f3559efbe5a4d2ccc71708`, which includes PRs 289 and 290, the offline manifest has 547 configured IDs, 470 eligible and 77 held. There are 279 source keys and 5,557 required links/snapshots. The net eligible increase is 24: 25 new choices minus the retired generic disorderly-conduct choice. These are offline counts, not production availability or approval to import.

All 521 other existing manifest records and all manifest-level metadata are unchanged. The existing municipal-discharge hold is preserved rather than automatically mapped. Saved exact IDs resolve only to their own branches; old generic disorderly-conduct identities and code-only new-family selections require reselection. Spanish and Chinese responses remain explicitly untranslated English fallbacks. No unverified jury instruction is asserted.

## Verification

- 67 focused tests across five suites cover conduct, grades, commencement dates, source integrity, reselection, missing/altered dependencies, translations and instruction boundaries.
- All 25 manifest records replay exactly; source and enacted-span hashes match. The generic retirement is the only changed prior manifest record.
- Typecheck and production build pass.
- All 26 isolated built-selector browser checks pass without retries or skips. Nineteen retained sections also match fresh official chapter downloads. Full release/full regression verification is not claimed here.
- No production/database operation, import, migration, receipt renewal, monitoring activation or deployment was performed.

```sh
node --import tsx scripts/data-review/texas-verification/replay-assault-intoxication.ts public-peace
npx vitest run tests/texas-public-peace.test.ts tests/texas-ranked-possession.test.ts tests/texas-source-database.test.ts tests/texas-deployment-seed.test.ts tests/jury-instructions.test.ts
```
