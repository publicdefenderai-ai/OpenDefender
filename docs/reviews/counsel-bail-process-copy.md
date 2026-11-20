# Counsel and bail process wording

This bounded follow-up updates the rules engine's counsel and bail language in arrest/arraignment actions, alerts, next steps, rights, resources, overview, and the appointment question. Requests for appointed counsel are governed by eligibility and application procedures; appointment may involve a public defender or another assigned lawyer. The practice question retains an optional example for someone who wants appointed counsel. The roadmap does not decide eligibility.

Release requests are described as part of the court process, with case-specific eligibility and conditions. The copy does not suggest private contact with a judge or promise that a request produces release. Excessive-bail protection is distinguished from guaranteed release.

## Boundaries and sources

The content is shared English rules-engine output used by the rules route and the AI-error fallback. These strings do not have separate locale-key translations. This change does not label them as Spanish/Chinese translations or alter the language pipeline. Existing three-language dashboard presentation is checked separately. Other conversation locale copy, attorney playbooks, stage guidance outside counsel/bail, and state-specific deadlines are not a comprehensive review target here.

- [Federal Rule of Criminal Procedure 44](https://www.govinfo.gov/content/pkg/USCODE-2024-title18/html/USCODE-2024-title18-app-federalru-rule44.htm): appointed counsel and appointment procedures; federal and local rules govern implementation. This is an example, not an assertion that federal rules govern state proceedings.
- [U.S. Courts: Criminal Cases](https://www.uscourts.gov/about-federal-courts/types-cases/criminal-cases): the initial appearance addresses counsel and custody; release can carry conditions.
- [United States v. Salerno, 481 U.S. 739](https://www.law.cornell.edu/supremecourt/text/481/739): excessive-bail protection does not create an unconditional entitlement to release.

The status matrix exercises represented, unrepresented, and unknown-representation inputs at both arrest and arraignment. Unknown status is not treated as unrepresented. Existing urgency, treatment metadata, source gates, and appointment-resource branching remain unchanged. No production, receipt, database, or publication operation is included.

Validation: 102 focused unit tests passed; application typecheck and production build passed using this branch's own exact locked dependency installation. Ten isolated production-browser checks passed without retries, including real generated counsel/bail text on screen and in print, all three dashboard languages in both themes, and representation-status print/PDF checks. Full release and database suites were not run.
