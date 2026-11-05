# Government-issued caregiver forms

All five state choices now link to documents supplied by a government agency or court. Custom California, Texas, Florida, New York and Illinois templates and their generation/printing code have been removed. OpenDefender does not alter or collect information for the external documents. English and Spanish reference guidance accompanies each choice. Chinese sessions receive an explicit Chinese translation-unavailable notice; the English panel is marked with its language. Full Chinese guidance remains a translation follow-up. The linked forms are identified as English, and the New York link is identified as a Word document rather than a PDF.

- California: California Courts caregiver affidavit.
- Texas: DFPS Form 2638.
- Florida: Fifteenth Judicial Circuit law-library child-care power of attorney. It is identified as a court-provided resource, without claiming universal suitability or acceptance.
- New York: OCFS-4940 from the issuing agency, replacing the university-hosted mirror.
- Illinois: DCFS CFS 444-2, under 755 ILCS 5/11-5.4. Guidance distinguishes short-term guardianship from a power of attorney for the parent’s own affairs and addresses witnesses, guardian acceptance, other-parent consent, duration exceptions and court orders.

## Public sources

- [California Courts affidavit](https://selfhelp.courts.ca.gov/sites/default/files/2026-01/Caregiver%20Authorization%20Affidavit-Jan2026%201.pdf)
- [Texas DFPS Form 2638](https://www.dfps.texas.gov/Application/Forms/showFile.aspx?NAME=2638.pdf) and [Family Code Chapter 34](https://tcss.legis.texas.gov/resources/FA/htm/FA.34.htm)
- [Florida court form](https://www.15thcircuit.com/sites/default/files/court-admin/law-library/forms-download/Power-of-Attorney-Temporary-for-the-Care-of-Children-fillable.pdf) and [court form directory](https://www.15thcircuit.com/services/law-library/legal-forms)
- [New York OCFS-4940](https://ocfs.ny.gov/forms/ocfs/ocfs-4940/OCFS-4940.docx) and [statutory requirements](https://www.nysenate.gov/legislation/laws/GOB/5-1552)
- [Illinois DCFS CFS 444-2](https://dcfs.illinois.gov/content/dam/soi/en/web/dcfs/documents/about-us/policy-rules-and-forms/documents/cfs-400/cfs-444-2-appointment-of-short-term-guardian-fillable.pdf) and [755 ILCS 5/11-5.4](https://www.ilga.gov/documents/legislation/ilcs/documents/075500050K11-5.4.htm)

The New York agency destination is also linked by CUNY’s government university resource page. Direct OCFS retrieval was blocked in this environment, so its current downloadable file could not be independently inspected. Browser tests check the destinations presented by OpenDefender; they do not certify third-party availability. Florida’s PDF downloaded successfully and Illinois’s four-page DCFS form was accessible.

## Validation

Typecheck and production build pass. Focused unit and locale-parity checks: 15 passed. Six browser checks passed, covering all five selections, English and Spanish plus explicitly labelled Chinese fallback, both themes, keyboard selection, correct file-type labels, absence of personal-data inputs/custom printing, and 320px bounds. The specification remains in the release allowlist. No full-suite or production-deployment claim is made.

## Release summary

This corrects substantive execution and duration information, not just presentation. The earlier Illinois generator specified one witness and notarization instead of the short-term guardianship statute’s two-witness requirement; the earlier New York generator specified two witnesses and a six-month limit. The new resources remove those incorrect requirements. Replacement of the generator does not validate documents previously generated: their execution and suitability require individual review.
