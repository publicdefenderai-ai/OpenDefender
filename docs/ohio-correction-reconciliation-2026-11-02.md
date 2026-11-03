# Ohio correction reconciliation: November 2, 2026

This batch reconciles the existing recovery-era corrections without reopening settled owner decisions. The private review packet and proposed legal wording remain outside Git. The public JSON contains only identities, evidence hashes, field names and neutral status accounting. No correction is activated by this report.

## Results

- All 18 record baselines still match the committed definitions or original source-only provider.
- Nine records require guidance and evidence updates; seven retain their guidance and require evidence updates; two require related-context treatment.
- All 17 exact official section requests succeeded on November 2 Pacific (November 3 UTC). Extracted text hashes and effective dates match the retained candidate versions.
- Existing packet integrity, quotation spans, dependency coverage and UTF-16 evidence bindings passed the offline preparer. These checks establish reuse of the packet, not new legal approval.
- The section 1509.01 criminal-trespass hold remains unchanged. No source pin, receipt, decision ledger, translation, database record or production deployment changes in this batch.

## Per-record disposition

| Record | Treatment | English fields needing integration | Required candidate sections |
| --- | --- | --- | --- |
| oh-orc-2903-06-aggravated-vehicular-homicide | Guidance and evidence update | plainSummary | 2903.06, 4501.01, 4519.01 |
| oh-orc-2903-06-vehicular-homicide | Guidance and evidence update | plainSummary | 2903.06, 4501.01, 4519.01 |
| oh-orc-2903-06-vehicular-manslaughter | Guidance and evidence update | plainSummary | 2903.06, 4501.01, 4519.01 |
| oh-orc-2903-08-aggravated-vehicular-assault | Guidance and evidence update | plainSummary | 2903.08, 4501.01, 4519.01 |
| oh-orc-2903-08-vehicular-assault | Guidance and evidence update | degreeContext, plainSummary | 2903.08, 4501.01, 4519.01 |
| oh-orc-2903-216-illegal-use-of-a-tracking-device-or-application | Guidance and evidence update | plainSummary | 2903.216 |
| oh-orc-2903-22-menacing | Guidance and evidence update | degreeContext, plainSummary | 1901.33, 1907.201, 2301.27, 2903.22 |
| oh-orc-2903-31-hazing | Keep guidance; update evidence | None in base text | 4729.01 |
| oh-orc-2903-311-reckless-failure-to-immediately-report-knowledge-of-hazing | Keep guidance; update evidence | None in base text | 4729.01 |
| oh-orc-2913-02-theft | Guidance and evidence update | degreeContext | 2913.02, 2929.31, 4737.012, 4737.04 |
| oh-orc-2913-04-unauthorized-use-of-property | Keep guidance; update evidence | None in base text | 109.57 |
| oh-orc-2913-04-unauthorized-use-of-computer-cable-or-telecommunication-property | Keep guidance; update evidence | None in base text | 109.57 |
| oh-orc-2913-04-unauthorized-use-of-the-law-enforcement-automated-database-system | Keep guidance; update evidence | None in base text | 109.57 |
| oh-orc-2913-04-unauthorized-use-of-the-ohio-law-enforcement-gateway | Keep guidance; update evidence | None in base text | 109.57 |
| oh-orc-2913-49-identity-fraud | Keep guidance; update evidence | None in base text | 2913.02 |
| oh-orc-2913-51-receiving-stolen-property | Guidance and evidence update | degreeContext | 2913.51, 2929.31, 4729.01, 4737.012, 4737.04 |
| oh-orc-2917-14-unlawfully-impeding-public-passage-of-an-emergency-service-responder | Keep base guidance; reconcile related context | None in base text | 2921.31 |
| oh-orc-2927-12-ethnic-intimidation | Keep base guidance; reconcile related context | None in base text | 1901.33, 1907.201, 2301.27, 2903.22 |

## Runtime blocker corrected

The shared public catalog export named `OHIO_CHAPTER_2903_PILOT_CHARGES` contains 123 source-first entries, including 104 separately reviewed records. Using that combined list for the pilot receipt made those 104 records depend on two independently maintained receipts. The manifest and seed builders already bind the pilot receipt to its 19 actual source records. The shared runtime gate now uses that same source membership.

The regression tests exercise all four fresh/expired combinations through both database-backed selection and isolated release fixtures. A reviewed record with its own expired receipt remains withheld; a pilot record still needs its pilot receipt; fresh receipts without database eligibility still do not permit selection. This is removal of an unrelated dependency, not a lifetime approval or freshness bypass.

## Restoration sequence

1. Integrate the already reconciled source/evidence replacements as one reviewed batch, preserving old effective versions where conduct-date applicability matters. Do not copy private deliberations into runtime artifacts.
2. Bind the nine guidance changes and two context changes to their exact approved claims; preserve existing translations or explicitly disclose untranslated updates. Evidence-only changes must not alter conduct or grading.
3. Recheck the complete active dependency sets, including the appropriate administrative-rule parser. These 17 checks alone cannot renew either whole-set receipt. Reuse prior substantive approval for unchanged sources; isolate any additional substantive changes instead of reopening settled questions.
4. Run source identity, offsets, dependency completeness, held-record, selection and explanation tests. Submit the combined publication/evidence changes for review before any source activation.
5. After approved merge, coordinate the production source import and check actual IDs and explanations. Do not assume 134 stored linked IDs represent 134 eligible choices.

The offline historical comparison yields 133 eligible choices while both receipts are valid versus ten at the current clock. That is 123 configured choices affected by expiry; it is not the count of all Ohio offenses, nor a promise that renewal alone resolves source changes. Unfinished substantive review and discovery beyond the configured catalog remain separate work.

## Verification

The offline packet preparer passed on all 18 current baselines, and every candidate binding matched its freshly acquired source. Typecheck and 49 focused tests passed across independent Ohio gates, deployment seeding, pilot refresh, provenance, common corrections, Florida expiry, California freshness and offline preparation. The new independent-gate regression fails on the pre-fix implementation and passes after the fix. No database or application was started for those tests.

The paired JSON is a dated observation; later source changes must not rewrite it or inherit its comparison result.
