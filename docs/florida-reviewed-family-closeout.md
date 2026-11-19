# Florida reviewed-family corrections: remaining 26 records

This is a fresh successor to unmerged PR151, based on main `7ac4e595`. Record-by-record comparison found that all 26 target definitions still equaled their pre-PR151 versions. Later same-section choices cover different or narrower branches; none replaces or excludes these 26 IDs. The separate reviewed legacy forgery entry also does not replace the source-first forgery identity.

These 26 existing records occupy 22 primary sections. With the 75 distinct records in preceding corrective packets, their IDs exactly account for the 101-record family. This is bounded family accounting, not statewide completeness.

| Group | Records | Individually supported changes |
| --- | ---: | --- |
| Participation and administration of justice | 8 | Target-dependent grading and distinct renunciation rules; accessory exceptions; perjury recantation; false-report costs/restitution; violent resistance; failure-to-appear forfeiture. |
| Property, financial and computer offenses | 7 | Separate arson grades and injury context; criminal-mischief thresholds/consequences; trespass qualifications; forgery; worthless-instrument exceptions; authorized computer activity. |
| Public and regulated conduct | 6 | Prostitution-related mandatory consequences, exposure exceptions, expired-registration predicates, dumping points, mandatory unlicensed-sale fines, and the speech-only disorderly-conduct limitation. |
| Weapons, dependents and animal offenses | 5 | Actual firearm possession and qualifying-prior minimums; short-barreled weapon exceptions; nonsupport restitution; separate cruelty fines/custody and listing deadline. |

Six primary categories change from felony to the ordinary misdemeanor branch: §§562.12(1), 806.13(1), 810.09(1)–(2), 827.06(2)–(3), 832.05(2)–(4), and 837.05. Existing conditional felony categories remain. No IDs are added. Aggregate primary tiers therefore shift six from felony to misdemeanor; dynamic catalog counts reflect this automatically.

## Source reuse and individualized conditions

Forty of the 44 required official sections match the current reviewed report and retain its November 17 retrieval metadata. Only four supplemental sections required new acquisition: §§775.087, 796.08, 806.031 and 837.07. Their official 2026 text matched the old candidate exactly. Raw responses remain outside Git at `/private/tmp/od-fl-closeout-evidence`; the committed successor baseline records classifications, acquisition times and text hashes.

All 26 records retain their own charged conduct, grade and translated summaries. Incorporated definitions and sentencing clauses have separately validated source hashes and offsets. The official Fourth District opinion applying *State v. Saunders* is retained with a page-specific excerpt and response hash for the speech-only §877.03 limitation. Effective-date evidence and the January 1, 2027 animal-conviction listing deadline remain distinct from operative grading.

The earlier proposal's generic domestic-violence paragraph is replaced with an explicit applicability boundary. These charge labels are outside the crimes expressly enumerated in §741.28(2); the remaining route requires this offense to result in human injury/death between qualifying family/household members, the statutory relationship/cohabitation requirements, and a qualifying conviction already existing at the time. The guidance does not treat a family relationship alone, animal injury alone, or a charge label as sufficient. The prior-conviction definition is individually bound under §741.2801(1), alongside the grading and relationship clauses. Conditional applicability is not a finding about any user's facts.

## Approval boundary

The approved receipt remains byte-for-byte unchanged, with its existing February 17, 2027 deadline. This corrective report and its eligibility binding no longer match that receipt. The runtime therefore withholds the 101-record family, even when database IDs exist and the old receipt has not expired. This PR does not renew or rebind it.

The previously approved 101-record restoration package and scoped runner are insufficient for this changed content. A later, separately reviewed package must bind the accepted corrections before restoration. Do not run the statewide import, reuse the old package as approval of these corrections, or silently extend any dates. The historical proposal and comparison stay frozen; their generator correctly rejects the changed active inputs. Historical activation tests now verify preserved receipt identity and explicit rejection of the corrected report, using clearly synthetic receipts only to test positive validation boundaries.

The other 75 corrected definitions, drafts and decision rows are hash-checked unchanged. Existing holds and all independent-family receipts remain unchanged. No production, import, migration, monitoring or database operation is part of this draft.

## Offline verification

```sh
node --import tsx scripts/data-review/florida-reviewed-closeout/prepare.ts --check
node_modules/.bin/vitest run tests/florida-reviewed-closeout-corrections.test.ts tests/florida-restoration-proposal.test.ts tests/florida-reviewed-activation.test.ts
```

Validation for this successor: all 59 Florida test files passed (293 tests passed, 43 skipped); application typecheck and production build passed; the isolated built persons-selector check passed, including withholding the corrected 101-record family while the independent family remains available. Skipped database checks are not claimed as passes. No full production-release approval follows.
