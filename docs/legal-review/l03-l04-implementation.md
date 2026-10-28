# L03/L04 review implementation

Source: Shahab Asghar's saved `opendefender-legal-review-2026-10-28.html`, review dated October 27, 2026. The exact notes and before/after changes are preserved in `l03-l04-review-record.json`. This branch is based on merged PR 64 and does not modify PR 65.

## Incorporated

- **L03.1:** Update both the live Know Your Rights search tab and the legacy Search & Seizure source (the old URL redirects). Explain the automobile exception without implying a reduced probable-cause standard; distinguish a search incident to arrest from a general vehicle search. Qualify warrant inspection and make speaking through the door an option. Explain that strip-search rules depend on jurisdiction and setting. Separate authority to search a phone from compelled biometric/passcode unlocking, including testimonial acts, the circuit split and foregone-conclusion doctrine. Remove contradictory blanket unlocking instructions.
- **L03.2:** Replace universal parental-notification language on First 24 Hours and in the juvenile counsel scenario. Distinguish requesting a parent from invoking counsel.
- **L03.3:** Qualify phone access and remove assurances that every attorney call is unrecorded. Propagate the corrections through Rights, First 24 Hours, timeline, quick-reference cards and the overlapping Friends & Family warning. Replace the universal 48–72-hour assertion with a qualified 24–72-hour overview that distinguishes initial appearance from arraignment. Add jurisdiction-specific insanity pleas without presenting them as a universal option. Keep the bail-entitlement and discovery material the reviewer accepted.
- **L04.1:** Add unsecured/signature bonds as a fifth type, distinguished from ROR; remove automatic-warrant wording in the bail guide and First 24 Hours.
- **L04.2–3:** Preserve the plea statistics, immigration consequences and plea-agreement material approved as written. Approval remains limited to the captured English text and reviewed scope.
- Propagate edited locale entries into Spanish and Chinese. The existing search-and-seizure/counsel pages remain English-only; this batch does not claim full multilingual coverage.

## Wording differences returned for review

1. **Missed court:** Used “The court can issue a warrant … this is a serious risk, but it is not automatic in every case,” rather than “almost certainly.” This keeps the warning prominent without asserting an unsupported nationwide probability. [Sutter Superior Court](https://www.sutter.courts.ca.gov/divisions/criminal) describes issuance as discretionary.
2. **Attorney calls:** Did not say authorities are always allowed to record them or that every statement is categorically inadmissible. Privilege, monitoring rules, waiver and remedies are distinct. The copy directs users to a designated confidential channel; [28 CFR 540.102](https://www.law.cornell.edu/cfr/text/28/540.102) expressly prohibits monitoring properly placed attorney calls in federal facilities.
3. **Juveniles:** Preserve the ability to ask for a parent, while avoiding a promise that police must stop or wait. Requesting a parent is not necessarily a request for counsel. See [DOJ juvenile-interrogation guidance](https://www.justice.gov/archives/jm/criminal-resource-manual-44-questioning-juvenile-custody) and [Fare v. Michael C.](https://www.law.cornell.edu/supremecourt/text/442/707).
4. **Vehicles:** Fewer warrant protections does not mean that the automobile exception lowers probable cause. Search incident to arrest has its own limits. [Arizona v. Gant](https://www.law.cornell.edu/supremecourt/text/07-542).
5. **Warrant inspection:** A warrant need not invariably be presented before the search, independently of sealing or no-knock issues. [United States v. Grubbs](https://www.govinfo.gov/app/details/USREPORTS-547/USREPORTS-547-90).
6. **Strip searches:** The cited Third Circuit decision addresses searches incident to arrest outside jails/prisons, not every custodial strip search. The new language preserves that boundary. [Beatty v. Gardner, No. 25-2860](https://www2.ca3.uscourts.gov/opinarch/252860p.pdf).
7. **Unlocking:** The distinction is between testimonial communication and physical acts in context, not merely whether police have a warrant. [United States v. Payne](https://cdn.ca9.uscourts.gov/datastore/opinions/2024/04/17/22-50262.pdf) and the [Ninth Circuit digital-search guide discussing Brown](https://cdn.ca9.uscourts.gov/datastore/district/MJEB_guide.pdf) illustrate the split. The copy describes the foregone-conclusion doctrine as disputed, not automatic admissibility.
8. **Timing/pleas:** 24–72 hours is a qualified overview, not a universal arraignment deadline or a replacement for the separate prompt probable-cause determination rule. [California court overview](https://selfhelp.courts.ca.gov/criminal-court/overview/arraignment) and [Colorado Rule 11](https://www.coloradojudicial.gov/sites/default/files/2024-06/Supp%20RULE%2011%20PLEAS.pdf) illustrate timing and plea variation.
9. **Unsecured bonds:** No upfront deposit; a specified potential payment distinguishes this from recognizance. [18 USC 3142(b)](https://www.law.cornell.edu/uscode/text/18/3142). Local conditions still control.

## Review status and remaining work

The updated workbook contains the original saved decisions plus an implementation appendix with exact replacement text, translations and the differences above. Original captured material remains labeled historical; the appendix is the current proposed copy. Nothing is marked attorney-approved merely because it was implemented.

- [ ] Reviewer accepts or adjusts the implementation wording differences above.
- [ ] Independent legal/translation review of Spanish and Chinese propagation, if required before multilingual signoff.
- [ ] Carry these content overrides into future bail, quick-reference, counsel and search design migrations. Original design HTML snapshots are not amended legal authority.
- [ ] L01/L02 follow-ups remain separate, including the broader First 24 Hours tone/state-timing review. This targeted pass is not a content overhaul or full-page signoff.

No changes to AI questionnaires, prompts, generated output logic, provider terms, or source-eligibility gates. No merge or production deployment is included in this task.

## Validation completed

Typecheck and production build passed. All five focused release-config browser checks passed: translated print cards/bail/arraignment in English, Spanish and Chinese; the live Rights search scenarios; and the expandable juvenile counsel scenario. The new spec is included in the release allowlist. The approved plea-guide subtrees are unchanged across all three locales. The self-contained workbook opened without script errors, rendered the new supplements, and retained the saved L03 notes and L04 approval decisions. All 45 saved fields were preserved byte-for-value through JSON comparison. Full CI and a nationwide legal audit are not claimed.
