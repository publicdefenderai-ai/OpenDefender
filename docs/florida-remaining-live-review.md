# Remaining Florida live choices, November 11, 2026

The reference selector returned 25 Florida IDs. Six property choices and three Chapter 810 choices were already corrected on main. Three Chapter 794 choices are reviewed in the preceding batch. The thirteen distinct remaining IDs are accounted for below. The table tracks the text observed at the public endpoint and the proposed Florida-specific guidance. It does not measure statewide completeness.

| ID | Live wording or omission | Florida authority | Disposition |
| --- | --- | --- | --- |
| fl-murder-in-the-first-degree | Premeditated killing only; up to life and fines | §782.04(1), §§775.082(1), 921.141 | Correct the three statutory paths. Explain adult life without parole and separate capital sentencing; distinguish under-18 rules. |
| fl-murder-in-the-second-degree | Intentional killing without premeditation | §782.04(2), §§775.082(3), 775.083(1) | Correct the imminently dangerous act and depraved-mind requirement. Retain possible life imprisonment. |
| fl-vehicular-homicide | Intoxicated or reckless; maximum 10 years | §782.071, §316.062(1), §322.28(4)(a) | Reckless driving causing death. Ordinary 15 years; 30 for specified failure to provide information and aid or a listed prior. Bind October 2025 effective date and minimum three-year license revocation. |
| fl-aggravated-assault | Intent to cause serious harm; 20 years | §§784.011(1), 784.021(1)–(3), 741.28, 741.2801 | Require incorporated assault plus either statutory alternative; ordinary five years. Distinguish conditional domestic reclassification and riot sentencing rank. |
| fl-unlawful-carrying-of-weapon | No permit; maximum one year | §790.01(1)–(5), §790.06 | Distinguish eligibility from licensure. Concealed weapon/electric device: first-degree misdemeanor. Concealed firearm: third-degree felony. |
| fl-discharge-of-firearm-in-city | City title; only one year; primary felony | §790.15(1)–(4) | Use official scope and ordinary first-degree misdemeanor. Distinguish second- and third-degree vehicle branches. Preserve the old manifest's exact source-bound identity. |
| fl-forgery | Creating false documents; 10 years | §831.01, §§775.082(3), 775.083(1) | Require a listed instrument and intent to injure or defraud. Ordinary third-degree felony: five years. |
| fl-loitering | Remaining without purpose; penalty varies | §856.021(1)–(3) | Correct reasonable alarm and statutory opportunity-to-explain requirements. Second-degree misdemeanor: 60 days and $500. |
| fl-reckless-driving | Single one-year penalty | §316.192(1)–(5) | Distinguish first/repeat ordinary sentencing, harm and serious-injury branches, additional fine and conditional treatment. |
| fl-disorderly-intoxication | Public intoxication and disturbance or endangerment | §856.011(1)–(3) | Separate endangerment from the public disturbance branch. Retain 60-day/$500 ordinary penalty. Add conditional treatment provision. |
| fl-possession-of-marijuana-under-20g | Less than 20 grams; two-year suspension; county-diversion assertion | §893.13(6)(a)–(b), §§322.055, 322.056 | Exactly 20 grams qualifies; extracted resin excluded. Correct license consequences by age. Remove unsupported local availability claim. |
| fl-resisting-officer-without-violence | Lawful execution; up to one year/$1,000 | §843.02, §§775.082(4), 775.083(1) | Retain ordinary penalty. Specify covered persons and execution of process, and bind the saved guidance and localized explanations to Florida law. |
| fl-minor-in-possession | Possessing, consuming or purchasing; generic $500 and license penalties | §562.111(1)–(2), §§775.082(4), 775.083(1) | Limit the charge to possession. Distinguish first and repeat grades and statutory employment and tasting exceptions. |

The thirteen IDs retain their existing manifest status. Twelve primary hashes match immediately. For §562.111 the earlier normalized text begins with a footnote marker before the section number; removing precisely that one character gives the current official text byte for byte. The validator requires both exact hashes and complete text equality under that transformation.

Official Florida Statutes 2026 evidence supplies 23 sections and 81 per-record span bindings. Four documents are reused by hash. The ordinary §790.15 tier correction moves one record from felony to misdemeanor in the published primary-tier counts; all qualifying branches are searchable. Spanish and Chinese content retains its translation-draft flag. Existing receipts, legal holds, separately reviewed identities, and database mappings remain in force.

Reproduce the packet offline with `node --import tsx scripts/data-review/florida-legacy-remaining/verify.ts --check`.
