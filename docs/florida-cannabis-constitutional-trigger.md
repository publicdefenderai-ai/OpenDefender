# Florida cannabis definition: constitutional contingency review

Reviewed November 17, 2026. This supplements the candidate-only comparison in PR 247. It changes no charge, source pin, receipt, approval, import or production setting.

## Recommended disposition

Retain the primary cannabis definition published in the official 2026 Florida Statutes §893.02(3), including its qualified medical-marijuana and hemp exclusions. Do not substitute the alternative definition printed in the contingent editorial note. The retained official election and constitutional evidence supports that disposition; an unchanged statute hash alone would not.

This closes the specific election/version investigation flagged in the comparison packet. It does not independently authorize restoration of the 101 charges. Review and activation of any replacement receipt, report binding and eligibility remain separate.

## What the trigger actually requires

[Laws of Florida chapter 2017-232, section 1](https://laws.flrules.org/2017/232), PDF page 3, makes the act expire six months **after the effective date** of a later amendment to Article X, section 29, or an adopted constitutional amendment related to cannabis or marijuana. A proposed initiative, qualification for a ballot, or a simple majority below the required adoption threshold is not an adopted amendment. The 2016 medical-marijuana amendment is the predicate the 2017 act implements, not a later trigger.

The [current official constitution](https://www.flsenate.gov/Laws/Constitution/) still gives section 29 the history “adopted 2016.” The [official 2026 statute](https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0800-0899/0893/Sections/0893.02.html) places the medical-marijuana exclusion in its main subsection and introduces the alternative with “If such amendment or adoption takes place.” That publication structure corroborates the recommended disposition, rather than proving it by itself.

## Complete post-2017 general-election screen

| Election | Official evidence | Result for this review |
| --- | --- | --- |
| 2018 | Brevard election authority, all 12 statewide proposals (1–7 and 9–13) | No specific marijuana amendment. Amendment 9's general vaping rule is addressed below. |
| 2020 | Official sample ballot, all six statewide amendments | Citizenship, minimum wage, primaries, amendment voting, and property exemptions; no marijuana or section 29 amendment. |
| 2022 | Official sample ballot, all three statewide amendments | Flood improvements, constitution revision commission, and property exemption; no marijuana or section 29 amendment. |
| 2024 | Official full six-amendment list and Legislature's Economic and Demographic Research result | Adult Personal Use of Marijuana, proposal 3, is expressly recorded as defeated. No adoption and no resulting six-month expiration clock. |
| 2026 | Official election authority's complete three-amendment list, expressly described as having appeared November 3, 2026 | Budget stabilization, agricultural tangible property, and homestead/non-homestead taxation; no marijuana or section 29 amendment. This is ballot evidence, not a claim that each result has been certified. |

Source links, exact retained text, extraction methods, acquisition completion times and hashes are in [the evidence packet](../scripts/data-review/florida-launch/cannabis-trigger-review.json). The sample ballots include public candidate names, not voter or case data. Local referenda do not amend the state constitution.

### The 2018 vaping amendment

Amendment 9 amended Article X, section 20 concerning enclosed indoor workplaces. Its device definition encompasses nicotine “or any other substance,” so the scope can reach marijuana vapor incidentally. It neither amends medical-marijuana section 29 nor expressly mentions cannabis. The current official legislature continues to publish the medical-marijuana exclusion as the primary §893.02(3) definition years after that amendment.

The recommended disposition therefore treats this general workplace restriction as distinct from the cannabis-regime contingency; it does not erase the vaping restriction or claim a court has adjudicated the outer meaning of “related to.” If contrary controlling authority is identified, the definition and affected dependencies must be reviewed before activation. This bounded interpretation is explicit, rather than hidden behind a keyword search or an unchanged hash.

## Verification and limits

The DOS direct document download and initiative portal returned HTTP 403. Accessible official legislative and county election records supply the evidence instead. The 2024 failure is supported by the Legislature's published result, not by an inference from pending initiative status. Future initiatives must be evaluated if adopted; this packet does not forecast their outcome.

Run `node_modules/.bin/vitest run tests/florida-cannabis-trigger-review.test.ts tests/florida-restoration-comparison.test.ts` for offline evidence integrity and coverage checks. Tests enforce the complete five-election set, amendment identities, source hashes and the decisive trigger/current-definition/result excerpts. They cannot turn a legal interpretation into an adjudicated holding.

Raw acquisition files remain outside Git at `/private/tmp/od-fl-trigger-src`; the existing §893.02 candidate is in `/private/tmp/od-fl-restoration-evidence`. HTML excerpts use body text with script/style elements removed and whitespace collapsed. PDF excerpts use PyMuPDF text extraction; the act excerpt is from page 3, and ballots concatenate pages in order. Stored start/end offsets refer to those normalized extracted texts, not raw HTML/PDF bytes.
