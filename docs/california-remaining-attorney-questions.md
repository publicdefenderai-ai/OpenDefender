# California: three focused legal-review questions

Prepared September 27, 2026. The remaining 28 catalog records have a bounded
statutory correction pass. These questions concern legal interpretation and
current enforceability, not data entry. A correction is not full legal approval.
The platform text explicitly preserves uncertainty for these branches.

## 1. Child-support felony branch: §270 and Gregori

**Read:** [PEN §270](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=270.)
and the published opinion in [People v. Gregori (1983), 144 Cal.App.3d 353](https://law.justia.com/cases/california/court-of-appeal/3d/144/353.html),
especially pages 358–359. The opinion is reproduced by Justia; it is a primary
judicial opinion, not a practice-blog summary. Subsequent treatment has not been
exhaustively checked in this pass.

**Context:** The statute's ordinary branch permits misdemeanor punishment. Its
second sentence adds a state-prison option after an adjudication of parentage and
notice. Gregori limits felony punishment based only on an earlier parentage
adjudication for a first offender, while distinguishing a previous §270 conviction.
The source text itself still contains the broader adjudication wording.

**Question to answer:** For the general §270 entry, what exact prior-conviction
and parentage conditions should we require before describing the felony branch
as applicable? Does subsequent binding authority change Gregori's first-offender
limitation? Please identify the controlling authority, or approve retaining the
unresolved warning pending further research.

**Current treatment:** State the ordinary misdemeanor punishment, disclose the
statutory state-prison alternative and Gregori limitation, and mark application
of the felony branch unresolved. Do not claim either automatic felony exposure
or an unconditional misdemeanor-only ceiling. Existing ID is preserved.

## 2. Dangerous fireworks: exactly 100 pounds under §12700(b)

**Read:** [HSC §12677](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=HSC&sectionNum=12677.),
[§12505](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=HSC&sectionNum=12505.),
and [§12700(b)(2)–(3)](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=HSC&sectionNum=12700.).
The retained official text and hashes are in `california-batch-six-review.json`.

**Context:** Both weight bands include exactly 100 pounds of unaltered dangerous
fireworks, measured gross including packaging. The adjacent bands differ in fine
range and availability of felony sentencing. This overlap is also recorded as
CA-001 in the [source-anomaly inventory](statutory-source-anomalies.md).

**Question to answer:** Is there controlling authority resolving the applicable
classification and punishment at exactly 100 pounds? If not, approve keeping that
boundary explicitly unresolved rather than choosing the harsher or lighter band.
We have not inferred a legislative correction or rewritten either boundary.

**Current treatment:** Explain the bands and preserve the overlap warning. No
automatic classification or penalty is assigned specifically to the 100-pound
boundary. Separate altered-fireworks and delivery-to-minors theories remain
outside the simple possession treatment.

## 3. Assault-weapon possession: definition-specific enforceability

**Read:** [PEN §30605](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=30605.),
[§30510](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=30510.),
[§30515](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=30515.),
and [§30675 exemptions](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=PEN&sectionNum=30675.).
For litigation research, Miller v. Bonta is Ninth Circuit case **23-2979**, from
Southern District of California **3:19-cv-01537**. Historical injunctions and stays
must not be treated as a verified current docket disposition.

**Context:** The statute provides misdemeanor/felony alternatives and a narrow
historically timed first-violation fine exception. Constitutionality and the scope
of operative court orders can depend on the particular statutory weapon definition.
The available statutory evidence does not itself establish present enforceability.

**Question to answer:** For each definition relevant to §30605, is there a currently
operative injunction or other binding limitation that changes availability? Please
provide the order/date and its scope, or approve retaining unresolved enforceability
status pending a current docket review. We are not asking you to populate weapon lists.

**Current treatment (updated September 28):** Withhold
`ca-possession-of-prohibited-weapon` from live selection and provenance. The new
publisher archive replaces the retained §30515 definition with two versions:
Stats. 2026, Ch. 354, Sec. 6 (history says repealed January 1, 2029) and Sec. 7
(history says operative January 1, 2029). Both rows carry an effective date of
September 20, 2026 and an active flag. Neither the shared date nor that flag alone
chooses the applicable version.

The new source text and metadata are retained in
`scripts/data-review/output/california-changed-source-evidence.json`; the previous
text remains in `california-batch-six-review.json`. Alongside the court-order
question above, confirm which definition applies to the alleged conduct date and
whether our linked §30605 guidance requires any change. This is a specific legal
review, not a request to enter or reconstruct source data. No other configured
charge declares §30515 as a dependency. The other 303 retained sections renewed
without changes to text or legal/version metadata. Do not infer that this hold
means every §30605 charge is legally invalid.

## Known future changes to monitor

- **January 1, 2027:** VEH §40610 replaces the current version. Both versions are
  retained and separately hashed; this batch relies only on common registration
  correction language. The motorcycle-specific difference is not applied to these
  registration records.
- **January 1, 2030:** VEH §4000(a)(4) states the endpoint of the temporary restriction
  on enforcement solely for recently expired registration. Recheck the operative
  text before that endpoint; do not represent it as an extension of registration.

This document records monitoring needs. It does not install a scheduler or refresh
source evidence. Live publication still requires the normal seed/deploy and parity
checks after independent PR review.
