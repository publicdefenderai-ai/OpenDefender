# Immigration content update, October 29, 2026

## Product changes

- Replace the four-answer warrant classifier with informational observations. Remove entry-validity labels; distinguish an arrest warrant from a search warrant and describe limits on visual identification.
- Clarify driver/passenger identification, constitutional protections, non-public workplace entry, and immigration-document obligations. Correct I-9 inspection notice to three business days.
- Clarify DACA initial requests versus renewals, temporary protection, renewal timing and work-authorization gaps. Date the current-guidance statement and direct readers to USCIS. Explain that TPS termination dates and litigation vary by country and individual.
- Separate post-removal-order detention under § 1231 from § 1226(c). Describe the Laken Riley Act's inadmissibility condition and covered offenses, including arrest/charge triggers without a conviction.
- Correct ICE locator search inputs, zero padding, excluded minors, CBP timing and telephone hours. Clarify that RAICES reserves its bond fund for its own detained clients.

DACA, workplace and bond copy supports English, Spanish and Chinese. The existing encounter-script and locator surfaces support English and Spanish, with their existing English fallback; this change does not add full Chinese coverage to those surfaces. No questionnaires, eligibility decisions, database migrations, or AI prompts are added.

## Public sources

- [8 U.S.C. § 1304(e), registration documents](https://www.law.cornell.edu/uscode/text/8/1304)
- [ACLU, immigrants' rights](https://www.aclu.org/know-your-rights/immigrants-rights)
- [Federal Rule of Criminal Procedure 41](https://www.law.cornell.edu/rules/frcrmp/rule_41)
- [8 C.F.R. § 274a.2(b)(2), I-9 inspection](https://www.law.cornell.edu/cfr/text/8/274a.2)
- [USAGov DACA guidance, updated March 19, 2026](https://www.usa.gov/daca)
- [USCIS renewal bulletin, April 8, 2024](https://content.govdelivery.com/accounts/USDHSCIS/bulletins/3951e87)
- [USCIS response on DACA renewal delays and automatic extensions](https://www.uscis.gov/sites/default/files/document/foia/DeferredActionforChildhoodArrivals-RepresentativeCorrea.pdf)
- [CRS DACA litigation status](https://www.congress.gov/crs-product/LSB11369)
- [EOIR TPS notices](https://www.justice.gov/eoir/temporary-protected-status)
- [Laken Riley Act, Public Law 119-1, section 2](https://www.govinfo.gov/content/pkg/PLAW-119publ1/html/PLAW-119publ1.htm)
- [8 U.S.C. § 1231](https://www.law.cornell.edu/uscode/text/8/1231)
- [ICE Online Detainee Locator](https://locator.ice.gov/)
- [ICE detention reporting contact](https://www.ice.gov/enforcementconcerns)
- [RAICES bond fund](https://raicestexas.org/bond)

## Validation

The focused browser specification covers rendered translations, informational warrant behavior, encounter qualifications and locator instructions. It is included in the release browser-test allowlist. Typecheck and production build passed. All seven focused browser cases passed (three locale checks and four English/Spanish warrant/locator checks). No claim of a clean full suite or legal approval is made here.
