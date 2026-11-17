# Florida cannabis definition: public source evidence

Recorded November 17, 2026. This supplements the candidate-only comparison in PR 247. It changes no charge, source pin, receipt, approval, import or production setting. This packet records public evidence; activation requires separate review.

## Retained official materials

- [Laws of Florida chapter 2017-232, section 1](https://laws.flrules.org/2017/232), PDF page 3: the published contingency and effective-date language.
- [Florida Constitution](https://www.flsenate.gov/Laws/Constitution/): Article X sections 20 and 29, including their published histories.
- [Official 2026 Florida Statutes §893.02](https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0800-0899/0893/Sections/0893.02.html): the main definition and conditional editorial note, both retained verbatim.
- Official statewide amendment lists for every general-election cycle from 2018 through 2026, plus the Legislature's published 2024 proposal result.

## Election-source accounting

| Election | Official evidence | Retained scope |
| --- | --- | --- |
| 2018 | Brevard election authority | All 12 statewide proposals: 1–7 and 9–13. |
| 2020 | Official sample ballot | All six statewide amendments. |
| 2022 | Official sample ballot | All three statewide amendments. |
| 2024 | Official six-amendment list and Legislature's Economic and Demographic Research result | All six proposals; EDR records proposal 3, Adult Personal Use of Marijuana, as defeated. |
| 2026 | Official election authority's statewide list | All three proposals identified as having appeared on the November 3, 2026 ballot. This records ballot scope, not certification of results. |

Source URLs, retained text, extraction methods, acquisition completion times and hashes are in [the evidence packet](../scripts/data-review/florida-launch/cannabis-trigger-review.json). The packet does not decide whether the statutory contingency applies or authorize a change to the operative definition.

## Verification and limits

The DOS direct document download and initiative portal returned HTTP 403. Accessible official legislative and county election records supply the retained evidence.

Run `node_modules/.bin/vitest run tests/florida-cannabis-trigger-review.test.ts tests/florida-restoration-comparison.test.ts` for offline evidence integrity and coverage checks. Tests enforce the five-election set, amendment identities, source hashes and retained statutory/result excerpts. Passing checks establish evidence integrity, not legal applicability or activation approval.

Raw acquisition files are retained locally outside the checkout. HTML excerpts use body text with script/style elements removed and whitespace collapsed. PDF excerpts use PyMuPDF text extraction; the act excerpt is from page 3, and ballots concatenate pages in order. Stored start/end offsets refer to normalized extracted texts, not raw HTML/PDF bytes.
