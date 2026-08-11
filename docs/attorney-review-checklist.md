# Attorney Pre-Launch Review Checklist

**Document purpose:** This checklist identifies every content area requiring legal sign-off before OpenDefender goes public. Hand this document to the reviewing attorney; check off each item as it is cleared. The same checklist is rendered interactively at `/admin/attorney-review`.

**How to use:**
1. Attorney reviews each item using the source file links and legal question provided.
2. If the content is acceptable as-is, the reviewer checks the box and adds initials + date.
3. If changes are needed, the reviewer notes them in the "Attorney notes" field and the team resolves before re-review.
4. All HIGH-risk items must be cleared before launch. MEDIUM-risk items should be cleared or have a documented rationale for deferral.

**Last updated:** 2026-08 (full line-number and scope audit against current codebase — see "What changed in this update" below)
**Platform URL:** `https://opendefender.ai` (also reachable at `https://opendefender.net`) | `http://localhost:5000` (dev). Both custom domains point at the same deployment — confirmed by checking that `/admin/attorney-review` progress saved on one is visible on the other. `opendefender.app` and `opendefender.replit.app`, cited in earlier versions of this document, are not live domains for this project.

---

## What changed in this update

The prior version of this checklist was written in July 2026. Every file-and-line-number citation in it had drifted — some content additions since then (warrants.tsx and letter-generator.tsx translation, a `shared/` data-file migration, homepage changes) shifted line numbers throughout `client/src/locales/en.ts` and moved some files entirely. None of that changed the underlying *legal content* that was already reviewable — but a reviewer clicking through stale line numbers would land on the wrong text, which defeats the point of a line-cited checklist. This pass:

- **Corrected every source-file citation** to its current, verified location (see per-item notes below).
- **Fixed one wrong key name**: H-9 cited a `attorney.disclaimer` locale key that doesn't exist — the real key is `attorneyPortal.disclaimer`.
- **Fixed one wrong file path**: M-4 cited `server/data/diversion-programs.ts`, which was never the path (or moved) — the actual file is `shared/diversion-programs-data.ts`.
- **Updated M-2's per-state citation-review counts**, which had shifted meaningfully since July (total is still 548, but the state distribution changed — see M-2).
- **Added `warrants.tsx` to H-6's scope** — this page has its own dedicated ICE-vs-judicial-warrant section directly on point for H-6's legal question, and was not previously listed as a source file for it. It was recently translated into Spanish and Chinese, not newly written — the English legal content is not new, only newly discoverable in this review because it was never cross-referenced into H-6.
- **Added a new item, M-7**, for `shared/jurisdiction-procedure-rules.ts` — see below for why this one clears the "very necessary" bar rather than being scope creep.
- **Enriched M-1's legal question** to reflect per-state logic (`DRIVERS_LICENSE_RULES[state].drugConvictionSuspension`) that now gates the driver's-license-suspension risk card for drug charges — the old question described a coarser, charge-type-only rule that no longer matches what the tool actually does.
- **Did not add** items for the CSRF/session-store/CAPTCHA security fixes made this cycle — those are engineering controls, not legal content, and are out of scope for an attorney content review (see "Items Out of Scope").
- **Did not add** an item for `letter-generator.tsx` — it's a lower-stakes AI surface (practical employer/landlord/utility letters, not legal argument) already covered in spirit by H-2/H-3's general AI-guidance disclosure and quality questions. Flagging it here as a judgment call your team may want to revisit, not adding it unilaterally.
- **Closed the H-4/H-5/H-9 backend gap**, immediately after this review surfaced it: all 14 `/api/attorney/*` routes are now behind a feature flag (`ATTORNEY_PORTAL_ENABLED`, off by default) so the document-generation API is no longer reachable while the frontend is hidden. This doesn't change what H-4/H-5/H-9 ask you to review — the templates still need legal sign-off before the flag is ever turned on — it just means the risk of someone reaching unreviewed content in the meantime is now closed rather than open.

### A blocker this review surfaced — since resolved on the backend, still open on the frontend

**H-4, H-5, and H-9 ask you to review the Attorney Portal's document-generation tools by visiting `/attorney/documents`.** That route currently redirects to `/directory` — the entire attorney-facing frontend was pulled from the public router at some point and never reconnected. You cannot generate a live sample document to review the way H-3 asks you to for AI case guidance.

**Update:** at the time this line was first written, the backend API endpoints (`/api/attorney/documents/generate` and 13 related routes) were still fully live and reachable directly despite the frontend being hidden — gated only by a four-checkbox self-attestation with no real identity verification, and trivially discoverable by anyone reading `server/routes.ts` in this public, open-source repo. That gap is now closed: all 14 `/api/attorney/*` routes are wrapped in a feature flag (`server/middleware/attorney-portal-gate.ts`, `ATTORNEY_PORTAL_ENABLED` env var) that fails closed — unset or anything other than the literal string `'true'` returns a 404 before any session or attestation logic runs. "Hidden" now actually means inaccessible, on both frontend and backend, not just unlinked.

Practically, for this review: read the 39 templates as source files rather than generating live samples — that part of the blocker is still real, since re-enabling the flag before H-4/H-5/H-9 are cleared would defeat the point of having added it. Once this checklist is cleared, re-enabling is a one-line env var change plus reconnecting the frontend router — see `.env.example`.

---

## Summary

| Risk Level | Total Items | Cleared | Pending |
|------------|-------------|---------|---------|
| 🔴 HIGH | 9 | — | 9 |
| 🟡 MEDIUM | 7 | — | 7 |
| **Total** | **16** | — | **16** |

---

## HIGH-RISK ITEMS

> These items make direct legal claims, create or disclaim legal relationships, or involve content where errors could directly harm users. All must be cleared before launch.

---

### H-1 · Core "Not Legal Advice" Disclaimer

**Risk:** High — This is the site's primary liability shield. Any ambiguity about whether the site provides legal advice could expose users to harm and expose the platform to liability.

**Content location:**
- `client/src/locales/en.ts:2733` — Main rights-info disclaimer: *"This information is for general education only. It is not legal advice, and no attorney-client relationship is formed by using this site. Information you access here is not protected by legal privilege. Laws vary by state. Talk to a licensed attorney about your specific situation."*
- `client/src/locales/en.ts:2129–2130` — Case guidance consent header: *"Legal information, not legal advice."* / *"We explain your rights and what to expect — we don't tell you what to do."*
- `client/src/locales/en.ts:2589` — Case guidance privacy step footer disclaimer: *"This tool provides general legal information and guidance only. It is not a substitute for professional legal advice."*
- `client/src/pages/disclaimers.tsx:475` — Site disclaimers page closing acknowledgement
- `client/src/locales/en.ts:5560` — First 24 Hours guide disclaimer
- `client/src/locales/en.ts:7489` — Record clearance screener disclaimer

**Legal question for attorney:**
Do the disclaimer statements in each of these locations adequately disclaim the formation of an attorney-client relationship, disclaim legal privilege, and convey that the site provides information rather than advice? Are there any jurisdictions where this language would be legally insufficient?

**Cleared:** ☐
**Reviewed by:** _______________  **Date:** _______________
**Attorney notes:** _______________________________________________

---

### H-2 · AI Guidance Disclosure & Anthropic Data Retention Notice

**Risk:** High — The platform discloses that user inputs are processed by Anthropic and retained for up to 30 days. Users in sensitive legal situations need to make an informed decision. This disclosure must be accurate and prominent.

**Content location:**
- `client/src/locales/en.ts:2137` — AI guidance card: *"Your inputs are processed by Anthropic's AI service and may be retained up to 30 days for safety and operational purposes. No attorney-client relationship is formed."*
- `client/src/locales/en.ts:5154–5155` — Chat privilege warning: *"This is general legal information, not legal advice. No attorney-client relationship is formed. Messages in this chat are processed by Anthropic and may be retained for up to 30 days. This chat is not protected by attorney-client privilege."*
- `client/src/locales/en.ts:5443–5444` — `notLegalAdvice` / `notLegalAdviceDesc` keys used in the export-warning UI

**AI model in use:** Claude Sonnet 4.6 (`claude-sonnet-4-6`) — configured in `server/config/ai-model.ts`
**Guidance pipeline:** `server/services/claude-guidance.ts`

**Legal question for attorney:**
Is the Anthropic data retention disclosure (30 days) accurate per Anthropic's current terms of service? Is it displayed at a point where users have meaningful opportunity to choose not to proceed? Is the language about attorney-client privilege and legal privilege clear enough that a layperson would understand they should not share privileged information?

**Cleared:** ☐
**Reviewed by:** _______________  **Date:** _______________
**Attorney notes:** _______________________________________________

---

### H-3 · AI Guidance Output Quality (Sample Review)

**Risk:** High — The AI generates jurisdiction-specific legal guidance about charges, rights, deadlines, and next steps. Inaccurate guidance could cause users to miss deadlines, waive rights, or take harmful action.

**Content location:**
- `server/services/claude-guidance.ts` — AI context builder and prompt
- `client/src/pages/case-guidance.tsx` — Case guidance flow UI
- `shared/jurisdiction-procedure-rules.ts` — Feeds jurisdiction-specific deadline facts (arraignment, speedy trial, discovery) directly into the prompt via `buildJurisdictionContextBlock`. See M-7 below — this file has known gaps in per-state verification depth that directly affect what H-3's sample outputs will say.
- AI model: Claude Sonnet 4.6 (`claude-sonnet-4-6`); timeout 150s; SDK `@anthropic-ai/sdk@0.93.0`

**What the attorney should review:**
Generate sample guidance outputs at `/case-guidance` for the following scenarios and review for accuracy, appropriate tone, and absence of affirmative legal advice:
1. CA — Felony DUI, pre-arraignment stage
2. NY — Drug possession (Class D felony), arraignment stage
3. TX — Assault causing bodily injury, plea stage
4. FL — Grand theft, sentencing stage
5. IL — Domestic battery, post-conviction stage
6. Any state — Immigration flag scenario (non-citizen with felony charge)

**Legal question for attorney:**
Do the AI outputs for these sample scenarios contain accurate legal information? Do they stay within the bounds of general information (not advice)? Do they appropriately flag when the user should consult an attorney rather than proceeding without one? Are there any outputs that make specific strategic recommendations that cross the line into legal advice?

**Cleared:** ☐
**Reviewed by:** _______________  **Date:** _______________
**Attorney notes:** _______________________________________________

---

### H-4 · Document Templates — Criminal Motion Sections

**Risk:** High — These templates are used by licensed attorneys to generate legal documents filed in court. AI-generated sections that are legally incorrect could result in ineffective motions or professional responsibility issues for the attorney.

**⚠️ See "A blocker this review surfaced" above — the live generation UI is unreachable (both frontend and, now, backend, by design); review these as source files.**

**Content location — templates with AI-generated sections** (`shared/templates/`):

| Template | File | AI Sections |
|----------|------|-------------|
| Bond Motion (EOIR) | `bond-motion-eoir.ts` | Statement of Facts, Legal Argument |
| Habeas Corpus Petition | `habeas-corpus-petition.ts` | Argument section |
| Motion for Bail Pending Appeal | `motion-for-bail-pending-appeal.ts` | Argument |
| Motion for Change of Venue | `motion-for-change-of-venue.ts` | Argument |
| Motion for Competency Evaluation | `motion-for-competency-evaluation.ts` | Argument |
| Motion for Continuance (EOIR) | `motion-for-continuance-eoir.ts` | Good Cause, Legal Standard, Proof of Service |
| Motion for Discovery | `motion-for-discovery.ts` | Multiple argument sections |
| Motion for Judgment of Acquittal | `motion-for-judgment-of-acquittal.ts` | Argument |
| Motion for Mistrial | `motion-for-mistrial.ts` | Argument |
| Motion for New Trial | `motion-for-new-trial.ts` | Argument |
| Motion for Pretrial Release | `motion-for-pretrial-release.ts` | Argument |
| Motion for Sentence Modification | `motion-for-sentence-modification.ts` | Argument |
| Motion for Speedy Trial | `motion-for-speedy-trial-demand.ts` | Argument |
| Motion for Stay of Removal (EOIR) | `motion-for-stay-of-removal-eoir.ts` | Argument |
| Motion for Voluntary Departure | `motion-for-voluntary-departure-eoir.ts` | Argument |
| Motion for Withholding/CAT | `motion-for-withholding-removal-cat.ts` | Argument |
| Motion in Limine | `motion-in-limine.ts` | Argument |
| Motion — Probation Violation Response | `motion-probation-violation-response.ts` | Argument |
| Motion to Accept Late Filing | `motion-to-accept-late-filing-eoir.ts` | Argument |
| Motion to Administratively Close | `motion-to-administratively-close-eoir.ts` | Argument |
| Motion to Change Venue (EOIR) | `motion-to-change-venue-eoir.ts` | Argument |
| Motion to Compel Discovery | `motion-to-compel-discovery.ts` | Argument |
| Motion to Continue | `motion-to-continue.ts` | Argument |
| Motion to Dismiss | `motion-to-dismiss.ts` | Argument |
| Motion to Exclude Expert | `motion-to-exclude-expert.ts` | Argument |
| Motion to Reconsider (EOIR) | `motion-to-reconsider-eoir.ts` | Argument |
| Motion to Reduce Bail | `motion-to-reduce-bail.ts` | Argument |
| Motion to Reopen (EOIR) | `motion-to-reopen-eoir.ts` | Argument |
| Motion to Sever | `motion-to-sever.ts` | Argument |
| Motion to Suppress | `motion-to-suppress.ts` | Argument |
| Motion to Suppress (Immigration) | `motion-to-suppress-immigration-eoir.ts` | Argument |
| Motion to Terminate Proceedings | `motion-to-terminate-eoir.ts` | Argument |
| Motion to Withdraw Plea | `motion-to-withdraw-plea.ts` | Argument |
| Notice of Appeal (BIA) | `notice-of-appeal-bia.ts` | Grounds section |
| Notice of Appeal (Criminal) | `notice-of-appeal-criminal.ts` | Grounds section |
| Notice of Appearance | `notice-of-appearance.ts` | — |
| NTA Pleadings | `nta-pleadings.ts` | Admissions/Denials |
| Sentencing Memorandum | `sentencing-memorandum.ts` | Argument |

**Attorney portal disclaimer:** `client/src/pages/attorney/index.tsx:135` — *"These tools are designed for licensed attorneys. Document generation features require attestation of bar membership."*
**Attorney bar attestation flow:** `client/src/contexts/attorney-context.tsx` (frontend state) / `shared/attorney/attestation-schema.ts` (validation — four self-attested boolean checkboxes, no bar-number verification)

**Legal question for attorney:**
Are the AI-generated argument sections in a representative sample of these templates (suggested: motion-to-suppress, motion-for-discovery, sentencing-memorandum, bond-motion-eoir, habeas-corpus-petition) legally sound? Does the platform's bar membership attestation requirement adequately gate these tools from lay users — and given it is currently a checkbox self-attestation with no identity verification, is that adequate even once the frontend route is restored? Are there template sections that contain affirmative legal assertions that could be incorrect in specific jurisdictions?

**Cleared:** ☐
**Reviewed by:** _______________  **Date:** _______________
**Attorney notes:** _______________________________________________

---

### H-5 · Document Templates — Immigration (EOIR Format)

**Risk:** High — Immigration motions filed with EOIR or the BIA have strict formatting and legal standard requirements. Errors in these templates could directly affect immigration outcomes.

**⚠️ Same access blocker as H-4 (now backend-enforced, not just frontend-hidden) — review as source files.**

**Content location:**
All EOIR-format templates above (14 templates): `bond-motion-eoir.ts`, `motion-for-continuance-eoir.ts`, `motion-for-stay-of-removal-eoir.ts`, `motion-for-voluntary-departure-eoir.ts`, `motion-for-withholding-removal-cat.ts`, `motion-to-accept-late-filing-eoir.ts`, `motion-to-administratively-close-eoir.ts`, `motion-to-change-venue-eoir.ts`, `motion-to-reconsider-eoir.ts`, `motion-to-reopen-eoir.ts`, `motion-to-suppress-immigration-eoir.ts`, `motion-to-terminate-eoir.ts`, `notice-of-appeal-bia.ts`, `nta-pleadings.ts`

**Legal standard references in templates:** `shared/templates/immigration-court-data.ts`, `shared/templates/county-data.ts`

**Legal question for attorney:**
Do the EOIR-format templates comply with current BIA Practice Manual requirements (2024–2025 edition)? Are the legal standards cited in the argument sections accurate for current Ninth/Fifth/Second Circuit precedent (where most EOIR practice occurs)? Is the withholding-of-removal / CAT template legally sound under current DHS v. Thuraissigiam and related precedent?

**Cleared:** ☐
**Reviewed by:** _______________  **Date:** _______________
**Attorney notes:** _______________________________________________

---

### H-6 · Know Your Rights — Immigration (ICE Encounters) & Warrants

**Risk:** High — This content tells users what they are legally permitted to do during ICE encounters and what a warrant does and does not authorize. Inaccurate information could lead to users inadvertently waiving rights or taking action that worsens their legal situation.

**Content location:**
- `client/src/pages/immigration/know-your-rights.tsx:340–341` — Source attribution: *"Source: National Immigration Law Center (NILC), 'Know Your Rights: Warrants' (December 2025). This information is educational only and does not constitute legal advice."*
- `client/src/pages/immigration/know-your-rights.tsx` (full file — KYR page)
- `client/src/pages/immigration/raids-toolkit.tsx` — Community raids preparedness
- `client/src/pages/immigration/workplace-raids.tsx` — Workplace ICE enforcement rights
- `client/src/pages/warrants.tsx` — **Added in this update.** Dedicated warrants page with its own "ICE vs. Court Warrants" section (judicial vs. administrative warrant distinction, what each does and doesn't authorize at the door) directly on point for this item's legal question. Recently translated into Spanish/Chinese; the underlying English legal content is pre-existing, not new.
- `client/src/locales/en.ts:2739–3349` — All immigration locale keys (this range moved substantially since the prior version of this checklist)
- `client/src/locales/en.ts:7908–8161` (`warrants` namespace) — Warrants page content in en.ts

**Legal question for attorney:**
Is the ICE encounter guidance (rights during arrest, warrant recognition, right to remain silent) legally accurate under current Fourth and Fifth Amendment precedent? Does the platform accurately describe what constitutes a judicial warrant vs. an administrative warrant, consistently between `know-your-rights.tsx` and the newer dedicated `warrants.tsx` page (do the two agree with each other)? Is the DACA/TPS eligibility information current as of the review date? Does the content in `raids-toolkit.tsx` and `workplace-raids.tsx` stay within the bounds of rights education rather than legal strategy?

**Cleared:** ☐
**Reviewed by:** _______________  **Date:** _______________
**Attorney notes:** _______________________________________________

---

### H-7 · Immigration Guidance Pages — Bond Hearings, DACA/TPS, Family Planning

**Risk:** High — These pages describe immigration law eligibility requirements, timelines, and procedural rights. Immigration law changes frequently and outdated information can cause users to miss deadlines or misunderstand their status.

**Content location:**
- `client/src/pages/immigration/bond-hearings.tsx` — Bond eligibility, hearing rights
- `client/src/pages/immigration/daca-tps.tsx` — DACA/TPS eligibility requirements and renewal
- `client/src/pages/immigration/family-planning.tsx` — Mixed-status family emergency planning
- `client/src/pages/immigration/after-deportation.tsx` — Post-deportation rights and re-entry
- `client/src/pages/immigration/find-detained.tsx` — ICE detainee locator guidance
- `client/src/locales/en.ts:3016` — DACA disclaimer: *"Immigration law changes frequently. Always verify current requirements with USCIS.gov or an immigration attorney before taking action."*

**Legal question for attorney:**
Are the DACA eligibility requirements (birth after June 15, 1981; U.S. presence since June 15, 2007, etc.) current and accurate? Are the bond hearing procedures described consistent with INA § 236(a) and current BIA precedent? Does the family planning content appropriately frame its guidance as general preparation rather than specific legal strategy? Is the after-deportation content legally accurate regarding re-entry bars and prosecutorial discretion?

**Cleared:** ☐
**Reviewed by:** _______________  **Date:** _______________
**Attorney notes:** _______________________________________________

---

### H-8 · Site Disclaimers Page

**Risk:** High — The `/disclaimers` page is the site's comprehensive liability disclosure. It is referenced from multiple pages and is the authoritative statement of what the platform does and does not provide.

**Content location:**
- `client/src/pages/disclaimers.tsx` — Full disclaimers page (485 lines)
- Key sections: general disclaimer (line ~50), AI guidance disclaimer, attorney tools disclaimer, third-party resources disclaimer (line ~380), user acknowledgement (line 475)

**Legal question for attorney:**
Does the disclaimers page adequately cover the platform's liability exposure? Are there content areas of the site not addressed in the disclaimers that should be — in particular, does it need to say anything about the Attorney Portal's document-generation API being reachable directly even while the frontend is disabled (see the blocker noted at the top of this document)? Is the "Acknowledgement of Disclosures" language at the end legally effective as constructive notice to users who use the site?

**Cleared:** ☐
**Reviewed by:** _______________  **Date:** _______________
**Attorney notes:** _______________________________________________

---

### H-9 · Attorney Portal Bar Attestation & Disclaimer

**Risk:** High — The Attorney Portal provides document generation tools gated behind a bar membership attestation. If the attestation is inadequate, lay users could access and rely on attorney-only tools without the expertise to use them safely.

**⚠️ See "A blocker this review surfaced" above.** The frontend attestation flow is unreachable via the UI (`/attorney/*` redirects to `/directory`), and as of this update `POST /api/attorney/verify` is now also gated by the `ATTORNEY_PORTAL_ENABLED` feature flag and returns 404 while it's off — so the underlying attestation-adequacy question below is currently moot in practice, but still needs an answer before the flag is ever flipped on.

**Content location:**
- `client/src/pages/attorney/index.tsx:135` — Disclaimer: *"These tools are designed for licensed attorneys. Document generation features require attestation of bar membership."*
- `client/src/contexts/attorney-context.tsx` — Bar attestation state management (frontend)
- `shared/attorney/attestation-schema.ts` — The actual validation logic: four `z.literal(true)` checkboxes (`isLicensedAttorney`, `actingOnBehalfOfClient`, `understandsPrivilegeRequirements`, `acceptsTermsOfService`), no bar number or identity check of any kind
- `client/src/locales/en.ts:5457` — `attorneyPortal.disclaimer` locale key *(corrected — prior version of this doc cited a non-existent `attorney.disclaimer` key)*

**Legal question for attorney:**
Is a four-checkbox self-attestation, with no bar-number or identity verification, legally adequate to restrict attorney-only document generation? Does the attestation language create attorney responsibility for use of AI-generated document sections? Is there an unauthorized practice of law concern given the gate can be passed by anyone, attorney or not, who is willing to check four boxes?

**Cleared:** ☐
**Reviewed by:** _______________  **Date:** _______________
**Attorney notes:** _______________________________________________

---

## MEDIUM-RISK ITEMS

> These items involve educational content, data displays, or secondary disclaimers. They should be reviewed before launch; deferral requires a documented rationale.

---

### M-1 · Collateral Consequences Data — All Nine Categories

**Risk:** Medium — The collateral consequences screener presents risk assessments across nine life areas. Inaccurate or overstated risk information could cause unnecessary alarm; understated risk could cause users to miss important consequences.

**Content location:**
- `client/src/pages/collateral-consequences.tsx` — Screener implementation
- Seven question-driven categories: `supervision` (probation/parole revocation), `immigration` (deportation risk), `children` (custody), `housing`, `employment`, `benefits` (public benefits), `license` (professional licenses) — risk level assignments and urgency scores: lines 65–115
- Two charge-type-driven categories (surfaced automatically based on charge selection, not yes/no answers):
  - `driverLicense` / `driverLicenseCheck` — driver's license suspension, triggered for DUI unconditionally, and for drug possession/trafficking **only in states with a verified `drugConvictionSuspension` rule** (see below) — otherwise a softer "check your state" card is shown instead
  - `sexOffender` — sex offender registry, triggered for sex offense charges
  - Definitions: lines 251–283; filtering logic (including the per-state drug-suspension check): lines 468–491
- `shared/collateral-consequences-data.ts` — `DRIVERS_LICENSE_RULES`, the per-state table of which states actually suspend a driver's license on a drug conviction. This table was recently verified for all 50 states + DC (per the project's own change history); still worth a legal spot-check since it directly changes what warning a user sees.

**Legal question for attorney:**
Are the risk level assignments (critical/warning) for each of the nine consequence categories appropriate? For example, is it correct to flag immigration consequences as "critical" for all non-citizen users regardless of charge type? Are the descriptions of each consequence area legally accurate as general educational statements? For the two charge-type-driven categories: is it legally correct that the driver's-license warning for drug charges only fires in states with a confirmed suspension law rather than showing for every drug charge nationwide? Is the sex offender registry risk correctly limited to sex offense charges? Does the screener appropriately disclaim that it provides a preliminary risk flag only, not a legal determination?

**Cleared:** ☐
**Reviewed by:** _______________  **Date:** _______________
**Attorney notes:** _______________________________________________

---

### M-2 · Charge Citations Flagged `needs_review` (548 entries)

**Risk:** Medium — These 548 entries in `shared/criminal-charge-citations.ts` carry `confidence: "needs_review"` because the OpenLaws API returned `not_found` when queried. The citations may be correct but unconfirmable via API, or they may be incorrect. They are not currently shown to users (only `confidence: "high"` entries surface the "Read the Law" button), but they inform the AI guidance context.

**Content location:**
- `shared/criminal-charge-citations.ts` — Filter for `confidence: "needs_review"` (548 entries)
- States with most entries *(recount — this distribution has shifted meaningfully since the prior version of this checklist; total is unchanged at 548)*: DC (36), ME (35), HI (34), ID (34), OR (34), VT (33), OK (33), UT (31), DE (30), KS (30), CT (29), MA (27), AZ (25), KY (20), NH (18), MI (17)
- Admin review tool: `/admin/citation-review` (interactive verification interface)

**Immediate action available:** The `/admin/citation-review` page allows manual verification against official state legislature URLs. An attorney or paralegal familiar with each state's code structure can verify or correct citations there.

**Legal question for attorney:**
For a representative sample (suggested: all DC entries [36], all ME entries [35], and 10 random entries from HI/ID/OR), are the statute citations correct? Should any of these be corrected before the AI guidance pipeline uses them as context? Are there citation patterns that look structurally wrong (wrong title, wrong chapter) that warrant a bulk re-audit?

**Cleared:** ☐
**Reviewed by:** _______________  **Date:** _______________
**Attorney notes:** _______________________________________________

---

### M-3 · Record Clearance Screener

**Risk:** Medium — The screener at `/support/reputation/eligibility` gives users a preliminary indication of whether their record may be eligible for expungement or sealing. Incorrect eligibility signals could cause users to either pursue inappropriate remedies or give up on legitimate ones.

**Content location:**
- `client/src/pages/support/record-clearance-screener.tsx` — Screener logic
- `client/src/locales/en.ts:7411` — Subtitle: *"Answer four questions to find out if your record may be eligible for expungement, sealing, or automatic clearance. This tool gives general information only. It is not legal advice."*
- `client/src/locales/en.ts:7489` — Disclaimer: *"This screener provides general information only. It is not legal advice. Results depend on your specific record and state law. Contact a legal aid organization for a full review."*

**Legal question for attorney:**
Are the eligibility logic pathways in the screener consistent with the general eligibility rules for expungement and record sealing across the most common states? Does the screener appropriately disclaim that results are preliminary and jurisdiction-specific? Is the disclaimer language sufficient to prevent users from relying on the screener's output as a definitive eligibility determination?

**Cleared:** ☐
**Reviewed by:** _______________  **Date:** _______________
**Attorney notes:** _______________________________________________

---

### M-4 · Diversion Programs Directory

**Risk:** Medium — The directory lists 111 diversion programs with eligibility criteria as self-reported by the programs. Users may rely on this information when deciding whether to request a diversion program.

**Content location:**
- `shared/diversion-programs-data.ts` — Program data (111 entries) *(corrected — prior version of this doc cited `server/data/diversion-programs.ts`, which is not the actual path)*
- `client/src/pages/diversion-programs.tsx` — Directory UI
- `client/src/locales/en.ts:4150` — Disclaimer: *"This directory lists programs and their eligibility criteria as reported by the programs themselves. Program availability and terms vary by jurisdiction. Whether a specific program is appropriate for your situation is a decision for you and your attorney. This page does not form an attorney-client relationship."*

**Legal question for attorney:**
Is the disclaimer adequate for a directory that relies on self-reported eligibility criteria? Are there eligibility criteria listed for any programs that appear legally incorrect or that could mislead users into thinking they are eligible when they are not? Should the directory carry a more prominent disclaimer that diversion program participation typically requires prosecutorial agreement?

**Cleared:** ☐
**Reviewed by:** _______________  **Date:** _______________
**Attorney notes:** _______________________________________________

---

### M-5 · Public Defender Intake Checklist (Advocate Tool)

**Risk:** Medium — This tool is used by public defenders and legal aid attorneys. The Padilla immigration flag (auto-raised for non-citizen clients) is a specific legal obligation; if it fires incorrectly it could cause defenders to miss or over-trigger a required inquiry.

**Content location:**
- `client/src/pages/for-advocates/intake-checklist.tsx` — Checklist implementation; Padilla flag logic at line 79 and surrounding
- `client/src/locales/en.ts:7736` — Disclaimer: *"This checklist is a practical tool only. It is not legal advice and is not privileged."*

**Legal question for attorney:**
Does the Padilla review auto-flag trigger correctly (for non-citizen status, not just for immigration-related charges)? Is the Padilla flag description accurate — specifically, does it correctly convey that Padilla v. Kentucky requires counsel to advise non-citizen clients of deportation consequences of guilty pleas? Is the tool's disclaimer adequate for a tool used by licensed attorneys?

**Cleared:** ☐
**Reviewed by:** _______________  **Date:** _______________
**Attorney notes:** _______________________________________________

---

### M-6 · Privacy Policy

**Risk:** Medium — The privacy policy describes how user data is handled. Inaccuracies (e.g., overstating data ephemerality, understating Anthropic's data retention) could create FTC or state consumer protection exposure.

**Content location:**
- `client/src/pages/privacy-policy.tsx` — Full privacy policy
- Key claims to verify:
  - "Session-only" / "data deleted after session" — verify against actual session storage TTL. This is now simpler than when this doc was last written: session persistence was removed entirely this cycle (no database-backed session store); the only server-side state is an in-memory 24-hour cookie TTL (`server/index.ts`, `maxAge: 24 * 60 * 60 * 1000`) that is wiped completely on any server restart, not just after 24 hours.
  - Anthropic data retention — currently stated as "up to 30 days" in guidance consent; verify this matches Anthropic's current API terms
  - Third-party data sharing disclosures

**Legal question for attorney:**
Does the privacy policy accurately describe the data lifecycle (in-memory session storage only, no database persistence, 24-hour TTL or full loss on restart, Anthropic 30-day AI processing retention)? Are there any claims in the privacy policy that are inconsistent with the actual technical implementation? Does the policy comply with CCPA requirements for California users and with any applicable state privacy laws for the states most likely to use this platform?

**Cleared:** ☐
**Reviewed by:** _______________  **Date:** _______________
**Attorney notes:** _______________________________________________

---

### M-7 · Jurisdiction Procedure Deadlines (Speedy Trial / Discovery / Arraignment) — New

**Risk:** Medium — `shared/jurisdiction-procedure-rules.ts` is the single source of truth for arraignment, bail-hearing, speedy-trial, and discovery-deadline facts across all 50 states + DC + federal. It feeds directly into the AI guidance prompt (`buildJurisdictionContextBlock`) as authoritative fact for `dataConfidence: 'high'` entries, and into the legal accuracy validator. A wrong deadline here doesn't just sit in an unused data file — it can come back to a user inside AI-generated guidance as though it were verified.

**Why this is being added now:** This engineering cycle completed a from-scratch primary-source re-verification of the 9 highest-population jurisdictions (federal, CA, NY, TX, IL, PA, OH, WA, GA) that a prior mass "bump the date" commit had left unverified despite claiming a fresh review date. That re-verification found and corrected **real substantive errors, not just staleness, in 3 of the 9**: California's misdemeanor speedy-trial deadline was missing its in-custody/not-in-custody split; Illinois had a fabricated misdemeanor-specific deadline that doesn't exist in the actual statute; Washington had its felony and misdemeanor in-custody/released figures collapsed to the same number, silently dropping the custody-based distinction the file's own notes claimed to encode. The other 43 jurisdictions (all states outside that group of 9, minus 6 that got genuine 2026-07 review per the file's own header comment) have not had an equivalent primary-source pass — they still carry `lastVerified` dates that may reflect a bulk timestamp update without accompanying verification.

**Content location:**
- `shared/jurisdiction-procedure-rules.ts` — full file; header comment (lines 1–44) documents exactly which jurisdictions have and have not had genuine primary-source review, and the 9 jurisdictions corrected this cycle each carry a dated, sourced inline comment above their `lastVerified` field explaining what was checked and against what
- `server/services/claude-guidance.ts` — `buildJurisdictionContextBlock`, where this data enters the AI prompt

**Legal question for attorney:**
For a sample of jurisdictions **not** in the 9 already re-verified this cycle (suggested: 3–5 states your team considers high-traffic or high-risk), are the arraignment, speedy-trial, and discovery-deadline figures in `jurisdiction-procedure-rules.ts` still accurate against current statute/rule text? Given that a prior "mass date bump" was found to have updated timestamps without actual verification, should the platform's maintenance process require documented sourcing (statute citation + date checked) for every future `lastVerified` change, the way the 9 corrected entries now do?

**Cleared:** ☐
**Reviewed by:** _______________  **Date:** _______________
**Attorney notes:** _______________________________________________

---

## Items Out of Scope for This Review

The following are tracked elsewhere or are purely technical:

| Item | Location | Why Out of Scope Here |
|------|----------|-----------------------|
| Statute citation accuracy for 30+ unaudited states | `shared/criminal-charges.ts` | Technical data accuracy, not legal interpretation |
| Broken external links | Diversion programs script | Operational, not legal content |
| Spanish / Chinese translations of disclaimer text | `client/src/locales/es.ts`, `zh.ts` | Covered under translation task; attorney should review translated disclaimers separately |
| CSRF / session-store / CAPTCHA security hardening | `server/index.ts`, `server/middleware/` | Engineering security controls, not legal content — tracked in the engineering pre-launch punch list, not here |
| Whether/when the Attorney Portal frontend gets reconnected and `ATTORNEY_PORTAL_ENABLED` gets flipped on | `client/src/App.tsx`, `server/middleware/attorney-portal-gate.ts` | The backend is now disabled by default (resolved this cycle); re-enabling is an engineering/product decision that should wait for H-4/H-5/H-9 to clear, not something this review resolves |

---

## Sign-Off Summary

| Area | Attorney | Date Cleared | Notes |
|------|----------|--------------|-------|
| H-1 Core Disclaimer | | | |
| H-2 AI Disclosure | | | |
| H-3 AI Output Quality | | | |
| H-4 Criminal Templates | | | |
| H-5 Immigration Templates | | | |
| H-6 ICE Encounter KYR + Warrants | | | |
| H-7 Immigration Pages | | | |
| H-8 Disclaimers Page | | | |
| H-9 Attorney Portal Gate | | | |
| M-1 Collateral Consequences | | | |
| M-2 Needs-Review Citations | | | |
| M-3 Record Clearance Screener | | | |
| M-4 Diversion Programs | | | |
| M-5 Intake Checklist | | | |
| M-6 Privacy Policy | | | |
| M-7 Jurisdiction Procedure Deadlines | | | |

**Overall launch authorization:**
All HIGH-risk items cleared: ☐
All MEDIUM-risk items cleared or deferred with rationale: ☐
