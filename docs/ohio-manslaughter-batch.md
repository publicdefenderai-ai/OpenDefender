# Ohio manslaughter batch

Date: September 16, 2026 (Pacific). Development only.

## Scope and result

This batch replaces the two inherited Ohio manslaughter selections with independently source-derived, section-level records:

| Offense | Statutory source | Grading represented |
| --- | --- | --- |
| Voluntary manslaughter | § 2903.03 | First-degree felony; divisions (A) and (B) retained in the evidence |
| Involuntary manslaughter | § 2903.04 | Division (A): first-degree felony; division (B): third-degree felony |

This is not a claim to have implemented separate selection controls for every allegation, specification, grading condition, or historical version. The section-level descriptions explicitly preserve those differences rather than silently selecting a branch.

The two old IDs remain audit records but require reselection. They cannot become selectable again if the new source receipt expires. No silent alias or migration of saved cases was introduced.

## Source-based findings

### Voluntary manslaughter

- § 2903.03(A) requires the statute's knowingly-caused harm, sudden passion/rage, and serious-provocation conditions. Anger alone is not the statutory test.
- Division (B) addresses sexual motivation, defined through § 2971.01(J). A sexual-motivation allegation is not automatically a sexually violent predator specification.
- The current § 2971.01(B)(1) designated-homicide list includes involuntary manslaughter under § 2903.04(A), not voluntary manslaughter under § 2903.03. Do not infer identical specification treatment from the similar names.
- Ordinary first-degree sentencing requires both § 2929.14(A)(1) and § 2929.144. The selected minimum must not be shown as the maximum. The current statute's date distinction is disclosed without certifying the historical law applicable to a particular case.
- § 2929.13 preserves presumptions and conditional mandatory-prison rules; § 2929.18 supplies the separate base fine.

### Involuntary manslaughter

- The underlying offense matters: § 2903.04(A) is felony-based; (B) addresses specified lesser offenses and expressly excludes certain Title XLV minor misdemeanors and equivalent ordinances.
- This is not merely another name for reckless homicide.
- Division (D) contains conditional mandatory-prison and class-one suspension rules. § 4510.02(A)(1) supplies the lifetime duration; the underlying OVI provision is retained as dependency evidence.
- § 2929.13 adds conditional mandatory-prison rules, including criminal-history-dependent ones.
- Division (A) can fall within the qualifying specification framework in §§ 2971.01, 2941.147, 2941.148 and 2971.03. The explanation warns that life sentences can apply in that framework; ordinary base ranges are not universal maximums.

Both records require the § 2903.09 pregnancy/unborn definitions and express exceptions. Full official evidence is retained; selected quotation spans are not substitutes for the full text.

## Integration

- Additional sentencing dependencies have a distinct penalty role, rather than being mislabeled as offense definitions.
- Freshness covers every declared dependency. The expanded receipt checks 23 unique official pages.
- Ohio-specific voluntary and involuntary explanations now replace the generic shared manslaughter explanation only when Ohio is the selected jurisdiction. English, Spanish and Chinese explanations preserve the distinctions and carry the existing review warnings.
- Other states and jurisdiction-unspecified lookups retain their existing generic explanation.
- All legacy catalog audit rows are retained. The composed catalog contains 122 Ohio rows; dry-run validation yields 40 source identities, 55 links, and 18 selectable records.
- The selectable total does not increase: two old selectable records are replaced by two source-first records. The source-first subset increases from five to seven.

## Reproduction

- `npx tsx scripts/data-review/acquire-ohio-homicide-support.ts --manslaughter`
- `npm run review:ohio-pilot-refresh`
- `npx tsx scripts/data-review/ohio-discovery/review-chapter-2903.ts`
- `npm run db:seed:ohio -- --dry-run`

Acquisition output cannot approve itself: source construction verifies separately reviewed hash pins, section/URL identity, heading, effective information and quoted spans. No scheduled maintenance or production deployment is implied by the manual refresh command.

## Verification

TypeScript checking and focused regression tests passed. Independent code review identified and prompted fixes for full-state-name routing (`Ohio` as well as `OH`) and the record-specific role of § 2971.01: offense-definition evidence for voluntary manslaughter, sentencing-prerequisite evidence for involuntary manslaughter.

The development seed completed with 40 source identities and 55 current links. After restart, the running API returned both new IDs with current provenance and required sentencing/definition references. Both retired IDs were absent from selection and returned 404 from the provenance endpoint. The Case Guidance landing page rendered normally. This verification did not generate or substantively audit AI guidance.

## Remaining scope

Chapter accounting remains 40 examined sections: 24 offense candidates, 14 supporting sections, and two structurally complex sections. Seven sections now have source-first records; 19 offense-bearing sections remain without them. The next priority remains conditional assault and vehicular groups, followed by the remaining Chapter 2903 candidates.

No independent attorney sign-off, comprehensive collateral-consequence analysis, historical-law certification, or generated-guidance accuracy audit is claimed. Keep the national estimate withdrawn.