# Descriptive guidance copy cleanup

This bounded change covers the case-roadmap introduction, quick-reference cards, DUI guidance, the Ohio saved-charge notice, and five Texas CPJC 22.28 links. It does not certify every page or replace individualized legal advice. English, Spanish, and Chinese use corresponding descriptions; previously reviewed phone-call and plea-timing text remains shared.

The introduction describes general information rather than promising analysis of past court decisions or individualized instructions. Quick-reference headings and police/court content describe rights, process, and legal considerations with optional, clear examples for people who choose to invoke silence or counsel, or decline consent to a search. These examples preserve the qualifications about identification duties and other lawful grounds for searches. Appointed counsel is qualified by eligibility, and excessive-bail protection is not presented as a guarantee of release. The Ohio notice describes the intake option for unknown charges rather than implying a continuation button exists on the blocked roadmap.

DUI guidance distinguishes administrative license proceedings from consequences of conviction. The generic ten-day-from-arrest instruction is removed: deadlines and their triggering events depend on the state and notice. The underlying guidance fields and display interfaces remain unchanged. Attorney-facing playbooks and unrelated timeline pages are outside this copy pass.

## Source checks

- [California DMV: Driving Under the Influence](https://www.dmv.ca.gov/portal/driver-education-and-safety/dmv-safety-guidelines-actions/driving-under-the-influence/): administrative action is independent of criminal proceedings; its hearing clock is tied to receipt of the notice.
- [Texas DPS: Administrative License Revocation](https://www.dps.texas.gov/section/driver-license/administrative-license-revocation-alr-program): different notice routes have different hearing-request periods. These two states are examples showing why a national ten-day deadline is unsupported, not a fifty-state deadline inventory.
- [Edwards v. Arizona, 451 U.S. 477](https://www.govinfo.gov/content/pkg/USREPORTS-451/pdf/USREPORTS-451-477.pdf): requesting counsel during custodial interrogation can require questioning to stop. The card describes that protection without purporting to enumerate all invocation, waiver, and interrogation exceptions.
- [Hiibel, 542 U.S. 177](https://www.govinfo.gov/content/pkg/USREPORTS-542/pdf/USREPORTS-542-177.pdf): identification duties depend on applicable law and the encounter, rather than a universal obligation to provide physical identification.
- [Federal Rule of Criminal Procedure 44](https://www.govinfo.gov/content/pkg/USCODE-2024-title18/html/USCODE-2024-title18-app-federalru-rule44.htm): counsel appointment has eligibility conditions. The card does not treat this federal rule as every state's procedure.
- [United States v. Salerno, 481 U.S. 739](https://www.law.cornell.edu/supremecourt/text/481/739): excessive-bail protection does not establish an unconditional right to release.

- [Berghuis v. Thompkins, 560 U.S. 370](https://www.law.cornell.edu/supremecourt/text/08-1470): silence alone does not necessarily invoke the right; the card retains an explicit invocation example.
- [Davis v. United States, 512 U.S. 452](https://www.law.cornell.edu/supremecourt/text/512/452): an ambiguous reference to counsel does not require questioning to stop under the federal rule addressed in that case.

## Publisher edition normalization

The five existing terroristic-threat instruction links now use CPJC edition 055 instead of 048. The robbery/restraint links already use 055. Both publisher versions of `22_Assaultive_Offenses/CPJC22-28.htm` were retrieved and their normalized law-specific instruction text compared: 3,954 characters, identical SHA-256 `dc79d28d59ff027381512835e2900ce468e89cc8216e556cf8b68bd74e8e673c`. No publisher text is copied into this report. The existing limitation to the individual imminent-serious-injury fear theory remains unchanged.

## Validation

- Six focused unit suites: 112 passed.
- Application typecheck and production build: passed.
- Isolated production browser checks: 24 passed, no retries (case-guidance intake, reviewed rights, and quick-reference screen/print in all three languages).
- No receipts, database operations, imports, publication, or activation.

## Evaluation coverage

The DUI scenarios exercise both charge spellings through all three harness paths. They require administrative license-hearing information tied to the applicable notice and reject the former generic ten-day instruction. This does not remove or change independently sourced, state-specific deadline fixtures.

Validation after the invocation/evaluation correction: all 297 evaluation-harness tests and all 11 descriptive-copy tests passed in the full regression run. Full result: 3,441 passed, 91 skipped; one suite failed because `initdb` is unavailable (`ohio-pilot-postgres.test.ts`). No additional failure appeared. Application typecheck/build and seven quick-reference browser scenarios passed, including all three languages and both themes on screen and in print. These checks do not certify native print dialogs or production data.
