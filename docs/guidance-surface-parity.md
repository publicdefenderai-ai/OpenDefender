# Case-plan surface parity

`shared/guidance-view-model.ts` is the contract for a defendant's case plan.
API routes normalize generated data before storing or returning it. The roadmap,
chat summary, PDF export, and browser print all consume that normalized model.
`GUIDANCE_SECTION_ORDER` is the canonical field order.

| Case-plan field | Roadmap | Chat | PDF | Browser print |
| --- | --- | --- | --- | --- |
| Urgent alerts | Shown prominently | Shown | Shown | Shown |
| Overview | Shown | Shown | Shown | Shown |
| Charge explanations | Shown | Charge/class shown | Shown | Shown |
| Immediate actions | Checklist | Shown with urgency | Shown | Shown |
| Timeline | Shown | Shown | Shown | Shown |
| Deadlines | Dedicated section | Shown | Shown | Shown |
| Rights | Shown | Shown | Shown | Shown |
| Next steps | Shown | Shown | Shown | Shown |
| Evidence to gather | Shown | Shown | Shown | Shown |
| Warnings | Shown | Shown | Shown | Shown |
| Court preparation | Shown | Shown | Shown | Shown |
| Collateral consequences | Shown | Shown | Shown | Shown |
| Practice questions | Shown | Shown | Shown | Shown |
| Actions to avoid | Shown | Shown | Shown | Shown |
| Uncertainties | Shown | Shown | Shown | Shown |
| Legal resources | Shown | Shown | Shown | Shown |

The roadmap may also show supplemental interactive material (verification
details, related court cases, support-topic links, and document-library links).
Those items are not generated case-plan fields and therefore are not parity
requirements.

Browser print does not depend on the roadmap's interactive accordion state. A
dedicated print-only renderer reads the normalized model and renders each
populated section in `GUIDANCE_SECTION_ORDER`, including response explanations
and mitigation notes that may be collapsed on screen.

## Attorney filing documents are separate

The attorney portal creates filing-draft DOCX documents. Those drafts are not a
Case Roadmap export and do not contain or replace the normalized defendant
guidance plan. The attorney drafting screen and download review dialog state
this distinction explicitly.
