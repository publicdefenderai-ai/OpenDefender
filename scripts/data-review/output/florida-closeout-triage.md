# Florida legacy-hold closeout triage

**Catalog denominator:** 92 manifest rows marked `require_exact_reselection`; **92/92 triaged exactly once**.

This closes the legacy cleanup catalog, not the Florida Statutes. The cached working set is not a statewide statute or offense denominator, and no statewide completeness percentage is claimed. Coverage is branch-specific: a matching heading or bare section citation was not enough.

## Counts

- **covered_by_existing_exact_record:** 13
- **mechanical_correction:** 27
- **genuinely_missing_offense:** 11
- **real_legal_question:** 22
- **nonoffense_or_out_of_scope_candidate:** 19

- **Safe mechanical replacements:** 27
- **Narrow attorney questions:** 22

## Safe to apply

- `fl-menacing` → `fl-fs-784-011-assault`
- `fl-theft-by-receiving` → `fl-fs-812-019-dealing-in-stolen-property`
- `fl-credit-card-fraud` → `fl-fs-817-61-fraudulent-use-of-credit-cards`
- `fl-shoplifting` → `fl-fs-812-015-retail-theft`
- `fl-possession-of-controlled-substance` → `fl-fs-893-13-6-a-prohibited-acts-penalties`
- `fl-possession-with-intent-to-distribute` → `fl-fs-893-13-1-a-prohibited-acts-penalties`
- `fl-distribution-of-controlled-substance` → `fl-fs-893-13-1-a-prohibited-acts-penalties`
- `fl-manufacturing-controlled-substance` → `fl-fs-893-13-1-a-prohibited-acts-penalties`
- `fl-possession-of-drug-paraphernalia` → `fl-fs-893-147-1-use-possession-manufacture-delivery-transportation-advertisement-or-retail-sale-of-drug-paraphernalia-specified-machines-and-materials`
- `fl-felon-in-possession-of-firearm` → `fl-fs-790-23-felons-and-delinquents-possession-of-firearms-ammunition-or-electric-weapons-or-devices-unlawful`
- `fl-possession-of-prohibited-weapon` → `fl-fs-790-221-possession-of-short-barreled-rifle-short-barreled-shotgun-or-machine-gun-penalty`
- `fl-insurance-fraud` → `fl-fs-817-234-insurance-fraud`
- `fl-computer-fraud` → `fl-fs-815-06-offense-against-users-of-computers-computer-systems-computer-networks-or-electronic-devices`
- `fl-disorderly-conduct` → `fl-fs-877-03-breach-of-the-peace-disorderly-conduct`
- `fl-vandalism` → `fl-fs-806-13-criminal-mischief`
- `fl-hit-and-run` → `fl-fs-316-061-1-crashes-involving-damage-to-vehicle-or-property`
- `fl-battery` → `fl-fs-784-03-battery`
- `fl-driving-with-suspended-license` → `fl-fs-322-34-2-driving-while-license-suspended-revoked-canceled-or-disqualified`
- `fl-false-info-to-police` → `fl-fs-837-05-false-reports-to-law-enforcement-authorities`
- `fl-solicitation` → `fl-fs-796-07-prohibiting-prostitution-and-related-acts`
- `fl-failure-to-pay-child-support` → `fl-fs-827-06-nonsupport-of-dependents`
- `fl-animal-cruelty-misdemeanor` → `fl-fs-828-12-animal-cruelty`
- `fl-trespass-after-warning` → `fl-fs-810-09-trespass-on-property-other-than-structure-or-conveyance`
- `fl-criminal-attempt` → `fl-fs-777-04-1-criminal-attempt`
- `fl-conspiracy` → `fl-fs-777-04-3-criminal-conspiracy`
- `fl-accessory-after-the-fact` → `fl-fs-777-03-accessory-after-the-fact`
- `fl-criminal-solicitation` → `fl-fs-777-04-2-criminal-solicitation`

## Grouped unresolved questions

- **fl-voluntary-manslaughter:** Does Florida recognize a separately selectable voluntary-manslaughter offense, or should users select § 782.07(1) manslaughter without the common-law modifier?
- **fl-involuntary-manslaughter:** Does Florida recognize a separately selectable involuntary-manslaughter offense, or should users select § 782.07(1) manslaughter without the common-law modifier?
- **fl-criminally-negligent-homicide:** Which Florida offense, if any, is intended by this nonstatutory label?
- **fl-assault-on-peace-officer:** Should § 784.07 be represented as a reclassification attached to an exact assault/battery predicate rather than as a standalone offense?
- **fl-embezzlement:** What exact Florida offense and subdivision, if any, should the label “Embezzlement” represent?
- **fl-residential-burglary:** What exact Florida offense and subdivision, if any, should the label “Residential Burglary” represent?
- **fl-commercial-burglary:** What exact Florida offense and subdivision, if any, should the label “Commercial Burglary” represent?
- **fl-auto-burglary:** What exact Florida offense and subdivision, if any, should the label “Auto Burglary” represent?
- **fl-tax-fraud:** What exact Florida offense and subdivision, if any, should the label “Tax Fraud” represent?
- **fl-petit-theft:** What exact Florida offense and subdivision, if any, should the label “Petit Theft (Under $750)” represent?
- **fl-domestic-battery:** Should the catalog model domestic relationship facts separately from § 784.03 battery?
- **fl-violation-of-probation:** Should a revocation proceeding under § 948.06 ever appear in the offense selector?
- **fl-failure-to-appear:** What exact Florida offense and subdivision, if any, should the label “Failure to Appear” represent?
- **fl-resisting-arrest:** What exact Florida offense and subdivision, if any, should the label “Resisting Arrest / Obstruction” represent?
- **fl-indecent-exposure:** What exact Florida offense and subdivision, if any, should the label “Indecent Exposure / Public Urination” represent?
- **fl-aiding-and-abetting:** Which current Florida principal/accessory provision and liability model should replace the MPC placeholder?
- **fl-attempted-murder:** Should attempt-plus-predicate combinations be generated dynamically rather than stored as standalone charges?
- **fl-attempted-robbery:** Should attempt-plus-predicate combinations be generated dynamically rather than stored as standalone charges?
- **fl-attempted-sexual-assault:** Which exact Florida sexual-battery predicate and attempt grade does this label intend?
- **fl-rico-organized-crime:** What exact Florida offense and subdivision, if any, should the label “RICO / Organized Crime (Racketeering)” represent?
- **fl-money-laundering:** What exact Florida offense and subdivision, if any, should the label “Money Laundering” represent?
- **fl-juvenile-firearm-possession:** Which exact substantive firearm provision is intended, rather than an uncited juvenile-status label?

## Full accounting

| # | Legacy row | Classification | Extent | Exact replacement(s) | Action |
|---:|---|---|---|---|---|
| 1 | `fl-voluntary-manslaughter` — Voluntary Manslaughter | real_legal_question | none | — | Hold for the single narrow attorney question; do not map by heading or citation alone. |
| 2 | `fl-involuntary-manslaughter` — Involuntary Manslaughter | real_legal_question | none | — | Hold for the single narrow attorney question; do not map by heading or citation alone. |
| 3 | `fl-criminally-negligent-homicide` — Criminally Negligent Homicide | real_legal_question | none | — | Hold for the single narrow attorney question; do not map by heading or citation alone. |
| 4 | `fl-felony-murder` — Felony Murder | covered_by_existing_exact_record | partial | `fl-murder-in-the-first-degree`<br>`fl-murder-in-the-second-degree`<br>`fl-fs-782-04-4-murder-in-the-third-degree` | Retire the umbrella legacy row; use the enumerated exact records and do not imply coverage beyond them. |
| 5 | `fl-assault-on-peace-officer` — Assault on Peace Officer | real_legal_question | none | — | Hold for the single narrow attorney question; do not map by heading or citation alone. |
| 6 | `fl-menacing` — Menacing | mechanical_correction | full | `fl-fs-784-011-assault` | Retire the legacy row and route selection to fl-fs-784-011-assault; preserve the source-first display name and exact code. |
| 7 | `fl-sexual-assault-in-the-second-degree` — Sexual Battery (by Force) | genuinely_missing_offense | none | — | Author a new exact source-first record for the proven offense branch, with exact subdivision and grading evidence. |
| 8 | `fl-child-sexual-abuse` — Child Sexual Abuse | covered_by_existing_exact_record | partial | `fl-fs-800-04-4-lewd-or-lascivious-battery`<br>`fl-fs-800-04-5-lewd-or-lascivious-molestation`<br>`fl-fs-800-04-6-lewd-or-lascivious-conduct`<br>`fl-fs-800-04-7-lewd-or-lascivious-exhibition` | Retire the umbrella legacy row; use the enumerated exact records and do not imply coverage beyond them. |
| 9 | `fl-sexual-exploitation-of-minor` — Sexual Exploitation of Minor | covered_by_existing_exact_record | partial | `fl-fs-827-071-2-a-use-of-a-child-in-a-sexual-performance`<br>`fl-fs-827-071-2-b-aggravated-use-of-a-child-in-a-sexual-performance`<br>`fl-fs-827-071-3-promoting-a-sexual-performance-by-a-child` | Retire the umbrella legacy row; use the enumerated exact records and do not imply coverage beyond them. |
| 10 | `fl-petty-theft` — Petty Theft | covered_by_existing_exact_record | partial | `fl-fs-812-014-2-e-petit-theft-of-the-first-degree`<br>`fl-fs-812-014-3-a-petit-theft-of-the-second-degree`<br>`fl-fs-812-014-3-b-petit-theft`<br>`fl-fs-812-014-3-c-petit-theft` | Retire the umbrella legacy row; use the enumerated exact records and do not imply coverage beyond them. |
| 11 | `fl-theft-by-receiving` — Theft by Receiving | mechanical_correction | full | `fl-fs-812-019-dealing-in-stolen-property` | Retire the legacy row and route selection to fl-fs-812-019-dealing-in-stolen-property; preserve the source-first display name and exact code. |
| 12 | `fl-identity-theft` — Identity Theft | covered_by_existing_exact_record | partial | `fl-fs-817-568-fraudulent-use-of-personal-identification-information`<br>`fl-fs-817-568-harassment-by-use-of-personal-identification-information` | Retire the umbrella legacy row; use the enumerated exact records and do not imply coverage beyond them. |
| 13 | `fl-credit-card-fraud` — Credit Card Fraud | mechanical_correction | full | `fl-fs-817-61-fraudulent-use-of-credit-cards` | Retire the legacy row and route selection to fl-fs-817-61-fraudulent-use-of-credit-cards; preserve the source-first display name and exact code. |
| 14 | `fl-embezzlement` — Embezzlement | real_legal_question | none | — | Hold for the single narrow attorney question; do not map by heading or citation alone. |
| 15 | `fl-shoplifting` — Shoplifting | mechanical_correction | full | `fl-fs-812-015-retail-theft` | Retire the legacy row and route selection to fl-fs-812-015-retail-theft; preserve the source-first display name and exact code. |
| 16 | `fl-residential-burglary` — Residential Burglary | real_legal_question | none | — | Hold for the single narrow attorney question; do not map by heading or citation alone. |
| 17 | `fl-commercial-burglary` — Commercial Burglary | real_legal_question | none | — | Hold for the single narrow attorney question; do not map by heading or citation alone. |
| 18 | `fl-auto-burglary` — Auto Burglary | real_legal_question | none | — | Hold for the single narrow attorney question; do not map by heading or citation alone. |
| 19 | `fl-bank-robbery` — Bank Robbery | nonoffense_or_out_of_scope_candidate | none | — | Remove from the Florida offense catalog or move to a separately labeled procedure/enhancement/infraction workflow after owner confirmation. |
| 20 | `fl-possession-of-controlled-substance` — Possession of Controlled Substance | mechanical_correction | full | `fl-fs-893-13-6-a-prohibited-acts-penalties` | Retire the legacy row and route selection to fl-fs-893-13-6-a-prohibited-acts-penalties; preserve the source-first display name and exact code. |
| 21 | `fl-possession-with-intent-to-distribute` — Possession with Intent to Distribute | mechanical_correction | full | `fl-fs-893-13-1-a-prohibited-acts-penalties` | Retire the legacy row and route selection to fl-fs-893-13-1-a-prohibited-acts-penalties; preserve the source-first display name and exact code. |
| 22 | `fl-distribution-of-controlled-substance` — Distribution of Controlled Substance | mechanical_correction | full | `fl-fs-893-13-1-a-prohibited-acts-penalties` | Retire the legacy row and route selection to fl-fs-893-13-1-a-prohibited-acts-penalties; preserve the source-first display name and exact code. |
| 23 | `fl-manufacturing-controlled-substance` — Manufacturing Controlled Substance | mechanical_correction | full | `fl-fs-893-13-1-a-prohibited-acts-penalties` | Retire the legacy row and route selection to fl-fs-893-13-1-a-prohibited-acts-penalties; preserve the source-first display name and exact code. |
| 24 | `fl-drug-trafficking` — Drug Trafficking | covered_by_existing_exact_record | partial | `fl-fs-893-135-1-b-1-trafficking-in-cocaine`<br>`fl-fs-893-135-1-c-1-trafficking-in-illegal-drugs` | Retire the umbrella legacy row; use the enumerated exact records and do not imply coverage beyond them. |
| 25 | `fl-possession-of-drug-paraphernalia` — Possession of Drug Paraphernalia | mechanical_correction | full | `fl-fs-893-147-1-use-possession-manufacture-delivery-transportation-advertisement-or-retail-sale-of-drug-paraphernalia-specified-machines-and-materials` | Retire the legacy row and route selection to fl-fs-893-147-1-use-possession-manufacture-delivery-transportation-advertisement-or-retail-sale-of-drug-paraphernalia-specified-machines-and-materials; preserve the source-first display name and exact code. |
| 26 | `fl-maintaining-drug-house` — Maintaining Drug House | genuinely_missing_offense | none | — | Author a new exact source-first record for the proven offense branch, with exact subdivision and grading evidence. |
| 27 | `fl-felon-in-possession-of-firearm` — Felon in Possession of Firearm | mechanical_correction | full | `fl-fs-790-23-felons-and-delinquents-possession-of-firearms-ammunition-or-electric-weapons-or-devices-unlawful` | Retire the legacy row and route selection to fl-fs-790-23-felons-and-delinquents-possession-of-firearms-ammunition-or-electric-weapons-or-devices-unlawful; preserve the source-first display name and exact code. |
| 28 | `fl-possession-of-prohibited-weapon` — Possession of Prohibited Weapon | mechanical_correction | full | `fl-fs-790-221-possession-of-short-barreled-rifle-short-barreled-shotgun-or-machine-gun-penalty` | Retire the legacy row and route selection to fl-fs-790-221-possession-of-short-barreled-rifle-short-barreled-shotgun-or-machine-gun-penalty; preserve the source-first display name and exact code. |
| 29 | `fl-wire-fraud` — Wire Fraud | nonoffense_or_out_of_scope_candidate | none | — | Remove from the Florida offense catalog or move to a separately labeled procedure/enhancement/infraction workflow after owner confirmation. |
| 30 | `fl-mail-fraud` — Mail Fraud | nonoffense_or_out_of_scope_candidate | none | — | Remove from the Florida offense catalog or move to a separately labeled procedure/enhancement/infraction workflow after owner confirmation. |
| 31 | `fl-check-fraud` — Check Fraud | covered_by_existing_exact_record | partial | `fl-fs-832-05-giving-worthless-checks-drafts-and-debit-card-orders-penalty-duty-of-drawee-evidence-costs-complaint-form` | Retire the umbrella legacy row; use the enumerated exact records and do not imply coverage beyond them. |
| 32 | `fl-insurance-fraud` — Insurance Fraud | mechanical_correction | full | `fl-fs-817-234-insurance-fraud` | Retire the legacy row and route selection to fl-fs-817-234-insurance-fraud; preserve the source-first display name and exact code. |
| 33 | `fl-tax-fraud` — Tax Fraud | real_legal_question | none | — | Hold for the single narrow attorney question; do not map by heading or citation alone. |
| 34 | `fl-computer-fraud` — Computer Fraud | mechanical_correction | full | `fl-fs-815-06-offense-against-users-of-computers-computer-systems-computer-networks-or-electronic-devices` | Retire the legacy row and route selection to fl-fs-815-06-offense-against-users-of-computers-computer-systems-computer-networks-or-electronic-devices; preserve the source-first display name and exact code. |
| 35 | `fl-disorderly-conduct` — Disorderly Conduct | mechanical_correction | full | `fl-fs-877-03-breach-of-the-peace-disorderly-conduct` | Retire the legacy row and route selection to fl-fs-877-03-breach-of-the-peace-disorderly-conduct; preserve the source-first display name and exact code. |
| 36 | `fl-vandalism` — Vandalism | mechanical_correction | full | `fl-fs-806-13-criminal-mischief` | Retire the legacy row and route selection to fl-fs-806-13-criminal-mischief; preserve the source-first display name and exact code. |
| 37 | `fl-dui-first-offense` — DUI First Offense | covered_by_existing_exact_record | partial | `fl-fs-316-193-1-driving-under-the-influence` | Retire the umbrella legacy row; use the enumerated exact records and do not imply coverage beyond them. |
| 38 | `fl-dui-second-offense` — DUI Second Offense | genuinely_missing_offense | none | — | Author a new exact source-first record for the proven offense branch, with exact subdivision and grading evidence. |
| 39 | `fl-dui-third-offense` — DUI Third Offense | genuinely_missing_offense | none | — | Author a new exact source-first record for the proven offense branch, with exact subdivision and grading evidence. |
| 40 | `fl-hit-and-run` — Hit and Run | mechanical_correction | full | `fl-fs-316-061-1-crashes-involving-damage-to-vehicle-or-property` | Retire the legacy row and route selection to fl-fs-316-061-1-crashes-involving-damage-to-vehicle-or-property; preserve the source-first display name and exact code. |
| 41 | `fl-petit-theft` — Petit Theft (Under $750) | real_legal_question | none | — | Hold for the single narrow attorney question; do not map by heading or citation alone. |
| 42 | `fl-battery` — Simple Battery | mechanical_correction | full | `fl-fs-784-03-battery` | Retire the legacy row and route selection to fl-fs-784-03-battery; preserve the source-first display name and exact code. |
| 43 | `fl-domestic-battery` — Domestic Battery | real_legal_question | none | — | Hold for the single narrow attorney question; do not map by heading or citation alone. |
| 44 | `fl-driving-with-suspended-license` — Driving with a Suspended License (DWLSR) | mechanical_correction | full | `fl-fs-322-34-2-driving-while-license-suspended-revoked-canceled-or-disqualified` | Retire the legacy row and route selection to fl-fs-322-34-2-driving-while-license-suspended-revoked-canceled-or-disqualified; preserve the source-first display name and exact code. |
| 45 | `fl-violation-of-probation` — Violation of Probation | real_legal_question | none | — | Hold for the single narrow attorney question; do not map by heading or citation alone. |
| 46 | `fl-failure-to-appear` — Failure to Appear | real_legal_question | none | — | Hold for the single narrow attorney question; do not map by heading or citation alone. |
| 47 | `fl-resisting-arrest` — Resisting Arrest / Obstruction | real_legal_question | none | — | Hold for the single narrow attorney question; do not map by heading or citation alone. |
| 48 | `fl-protective-order-violation` — Violation of Protective Order | covered_by_existing_exact_record | partial | `fl-fs-741-31-4-a-violation-of-an-injunction-for-protection-against-domestic-violence` | Retire the umbrella legacy row; use the enumerated exact records and do not imply coverage beyond them. |
| 49 | `fl-open-container` — Open Container Violation | genuinely_missing_offense | none | — | Author a new exact source-first record for the proven offense branch, with exact subdivision and grading evidence. |
| 50 | `fl-false-info-to-police` — Providing False Information to Police | mechanical_correction | full | `fl-fs-837-05-false-reports-to-law-enforcement-authorities` | Retire the legacy row and route selection to fl-fs-837-05-false-reports-to-law-enforcement-authorities; preserve the source-first display name and exact code. |
| 51 | `fl-harassment` — Harassment / Stalking | covered_by_existing_exact_record | partial | `fl-fs-784-048-2-stalking`<br>`fl-fs-784-048-3-aggravated-stalking` | Retire the umbrella legacy row; use the enumerated exact records and do not imply coverage beyond them. |
| 52 | `fl-contempt-of-court` — Contempt of Court | genuinely_missing_offense | none | — | Author a new exact source-first record for the proven offense branch, with exact subdivision and grading evidence. |
| 53 | `fl-solicitation` — Solicitation / Prostitution | mechanical_correction | full | `fl-fs-796-07-prohibiting-prostitution-and-related-acts` | Retire the legacy row and route selection to fl-fs-796-07-prohibiting-prostitution-and-related-acts; preserve the source-first display name and exact code. |
| 54 | `fl-driving-without-insurance` — Driving Without Insurance | genuinely_missing_offense | none | — | Author a new exact source-first record for the proven offense branch, with exact subdivision and grading evidence. |
| 55 | `fl-expired-registration` — Driving with Expired Registration | covered_by_existing_exact_record | partial | `fl-fs-320-07-3-c-expiration-of-registration-renewal-required-penalties` | Retire the umbrella legacy row; use the enumerated exact records and do not imply coverage beyond them. |
| 56 | `fl-expired-inspection` — Driving with Expired/No Inspection | nonoffense_or_out_of_scope_candidate | none | — | Remove from the Florida offense catalog or move to a separately labeled procedure/enhancement/infraction workflow after owner confirmation. |
| 57 | `fl-failure-to-pay-child-support` — Criminal Nonsupport / Failure to Pay Child Support | mechanical_correction | full | `fl-fs-827-06-nonsupport-of-dependents` | Retire the legacy row and route selection to fl-fs-827-06-nonsupport-of-dependents; preserve the source-first display name and exact code. |
| 58 | `fl-noise-violation` — Noise Violation / Disturbing the Peace by Noise | covered_by_existing_exact_record | partial | `fl-fs-877-03-breach-of-the-peace-disorderly-conduct` | Retire the umbrella legacy row; use the enumerated exact records and do not imply coverage beyond them. |
| 59 | `fl-indecent-exposure` — Indecent Exposure / Public Urination | real_legal_question | none | — | Hold for the single narrow attorney question; do not map by heading or citation alone. |
| 60 | `fl-fake-id` — Possession of Fake/Fraudulent ID | genuinely_missing_offense | none | — | Author a new exact source-first record for the proven offense branch, with exact subdivision and grading evidence. |
| 61 | `fl-animal-at-large` — Animal at Large / Leash Law Violation | nonoffense_or_out_of_scope_candidate | none | — | Remove from the Florida offense catalog or move to a separately labeled procedure/enhancement/infraction workflow after owner confirmation. |
| 62 | `fl-animal-cruelty-misdemeanor` — Animal Cruelty (Misdemeanor) | mechanical_correction | full | `fl-fs-828-12-animal-cruelty` | Retire the legacy row and route selection to fl-fs-828-12-animal-cruelty; preserve the source-first display name and exact code. |
| 63 | `fl-illegal-camping` — Illegal Camping / Sleeping in Public | nonoffense_or_out_of_scope_candidate | none | — | Remove from the Florida offense catalog or move to a separately labeled procedure/enhancement/infraction workflow after owner confirmation. |
| 64 | `fl-panhandling` — Panhandling / Aggressive Solicitation | nonoffense_or_out_of_scope_candidate | none | — | Remove from the Florida offense catalog or move to a separately labeled procedure/enhancement/infraction workflow after owner confirmation. |
| 65 | `fl-unregistered-vehicle` — Operating Unregistered / Uninsured Vehicle | genuinely_missing_offense | none | — | Author a new exact source-first record for the proven offense branch, with exact subdivision and grading evidence. |
| 66 | `fl-curfew-violation` — Curfew Violation | genuinely_missing_offense | none | — | Author a new exact source-first record for the proven offense branch, with exact subdivision and grading evidence. |
| 67 | `fl-trespass-after-warning` — Trespass After Warning / Return After Ban | mechanical_correction | full | `fl-fs-810-09-trespass-on-property-other-than-structure-or-conveyance` | Retire the legacy row and route selection to fl-fs-810-09-trespass-on-property-other-than-structure-or-conveyance; preserve the source-first display name and exact code. |
| 68 | `fl-defective-vehicle-equipment` — Defective Vehicle Equipment / Broken Taillight | nonoffense_or_out_of_scope_candidate | none | — | Remove from the Florida offense catalog or move to a separately labeled procedure/enhancement/infraction workflow after owner confirmation. |
| 69 | `fl-truancy` — Truancy / Chronic Absenteeism | nonoffense_or_out_of_scope_candidate | none | — | Remove from the Florida offense catalog or move to a separately labeled procedure/enhancement/infraction workflow after owner confirmation. |
| 70 | `fl-littering` — Littering / Illegal Dumping | covered_by_existing_exact_record | partial | `fl-fs-403-413-6-b-florida-litter-law` | Retire the umbrella legacy row; use the enumerated exact records and do not imply coverage beyond them. |
| 71 | `fl-illegal-fireworks` — Illegal Discharge of Fireworks | nonoffense_or_out_of_scope_candidate | none | — | Remove from the Florida offense catalog or move to a separately labeled procedure/enhancement/infraction workflow after owner confirmation. |
| 72 | `fl-alcohol-in-park` — Possession of Alcohol in Park / Prohibited Area | nonoffense_or_out_of_scope_candidate | none | — | Remove from the Florida offense catalog or move to a separately labeled procedure/enhancement/infraction workflow after owner confirmation. |
| 73 | `fl-hunting-fishing-no-license` — Fishing / Hunting Without a License | genuinely_missing_offense | none | — | Author a new exact source-first record for the proven offense branch, with exact subdivision and grading evidence. |
| 74 | `fl-criminal-attempt` — Criminal Attempt | mechanical_correction | full | `fl-fs-777-04-1-criminal-attempt` | Retire the legacy row and route selection to fl-fs-777-04-1-criminal-attempt; preserve the source-first display name and exact code. |
| 75 | `fl-conspiracy` — Criminal Conspiracy | mechanical_correction | full | `fl-fs-777-04-3-criminal-conspiracy` | Retire the legacy row and route selection to fl-fs-777-04-3-criminal-conspiracy; preserve the source-first display name and exact code. |
| 76 | `fl-aiding-and-abetting` — Aiding and Abetting / Accomplice Liability | real_legal_question | none | — | Hold for the single narrow attorney question; do not map by heading or citation alone. |
| 77 | `fl-accessory-after-the-fact` — Accessory After the Fact | mechanical_correction | full | `fl-fs-777-03-accessory-after-the-fact` | Retire the legacy row and route selection to fl-fs-777-03-accessory-after-the-fact; preserve the source-first display name and exact code. |
| 78 | `fl-attempted-murder` — Attempted Murder | real_legal_question | none | — | Hold for the single narrow attorney question; do not map by heading or citation alone. |
| 79 | `fl-attempted-robbery` — Attempted Robbery | real_legal_question | none | — | Hold for the single narrow attorney question; do not map by heading or citation alone. |
| 80 | `fl-attempted-sexual-assault` — Attempted Sexual Assault | real_legal_question | none | — | Hold for the single narrow attorney question; do not map by heading or citation alone. |
| 81 | `fl-criminal-solicitation` — Criminal Solicitation | mechanical_correction | full | `fl-fs-777-04-2-criminal-solicitation` | Retire the legacy row and route selection to fl-fs-777-04-2-criminal-solicitation; preserve the source-first display name and exact code. |
| 82 | `fl-gang-enhancement` — Criminal Street Gang Enhancement | nonoffense_or_out_of_scope_candidate | none | — | Remove from the Florida offense catalog or move to a separately labeled procedure/enhancement/infraction workflow after owner confirmation. |
| 83 | `fl-hate-crime-enhancement` — Hate Crime Enhancement | nonoffense_or_out_of_scope_candidate | none | — | Remove from the Florida offense catalog or move to a separately labeled procedure/enhancement/infraction workflow after owner confirmation. |
| 84 | `fl-recidivist-enhancement` — Prior Felony / Recidivist Sentencing Enhancement | nonoffense_or_out_of_scope_candidate | none | — | Remove from the Florida offense catalog or move to a separately labeled procedure/enhancement/infraction workflow after owner confirmation. |
| 85 | `fl-firearm-in-felony-enhancement` — Use of a Firearm in Commission of a Felony | nonoffense_or_out_of_scope_candidate | none | — | Remove from the Florida offense catalog or move to a separately labeled procedure/enhancement/infraction workflow after owner confirmation. |
| 86 | `fl-drug-school-zone-enhancement` — Drug Offense in a School Zone (Proximity Enhancement) | nonoffense_or_out_of_scope_candidate | none | — | Remove from the Florida offense catalog or move to a separately labeled procedure/enhancement/infraction workflow after owner confirmation. |
| 87 | `fl-rico-organized-crime` — RICO / Organized Crime (Racketeering) | real_legal_question | none | — | Hold for the single narrow attorney question; do not map by heading or citation alone. |
| 88 | `fl-money-laundering` — Money Laundering | real_legal_question | none | — | Hold for the single narrow attorney question; do not map by heading or citation alone. |
| 89 | `fl-juvenile-delinquency-felony` — Juvenile Delinquency Adjudication (Felony-Level Act) | nonoffense_or_out_of_scope_candidate | none | — | Remove from the Florida offense catalog or move to a separately labeled procedure/enhancement/infraction workflow after owner confirmation. |
| 90 | `fl-juvenile-delinquency-misdemeanor` — Juvenile Delinquency Adjudication (Misdemeanor-Level Act) | nonoffense_or_out_of_scope_candidate | none | — | Remove from the Florida offense catalog or move to a separately labeled procedure/enhancement/infraction workflow after owner confirmation. |
| 91 | `fl-juvenile-transfer-adult-court` — Juvenile Transfer to Adult Court (Waiver Hearing) | nonoffense_or_out_of_scope_candidate | none | — | Remove from the Florida offense catalog or move to a separately labeled procedure/enhancement/infraction workflow after owner confirmation. |
| 92 | `fl-juvenile-firearm-possession` — Juvenile Firearm Possession | real_legal_question | none | — | Hold for the single narrow attorney question; do not map by heading or citation alone. |

The JSON and CSV contain exact citations, support quotes, source keys/URLs, and source hashes for integration and audit.
