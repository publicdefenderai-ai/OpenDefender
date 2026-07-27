# Attorney Pre-Launch Review Checklist

**Document purpose:** This checklist identifies every content area requiring legal sign-off before OpenDefender goes public. Hand this document to the reviewing attorney; check off each item as it is cleared. The same checklist is rendered interactively at `/admin/attorney-review`.

**How to use:**
1. Attorney reviews each item using the source file links and legal question provided.
2. If the content is acceptable as-is, the reviewer checks the box and adds initials + date.
3. If changes are needed, the reviewer notes them in the "Attorney notes" field and the team resolves before re-review.
4. All HIGH-risk items must be cleared before launch. MEDIUM-risk items should be cleared or have a documented rationale for deferral.

**Last updated:** July 2026  
**Platform URL:** https://opendefender.app (production) | http://localhost:5000 (dev)

---

## Summary

| Risk Level | Total Items | Cleared | Pending |
|------------|-------------|---------|---------|
| 🔴 HIGH | 9 | — | 9 |
| 🟡 MEDIUM | 6 | — | 6 |
| **Total** | **15** | — | **15** |

---

## HIGH-RISK ITEMS

> These items make direct legal claims, create or disclaim legal relationships, or involve content where errors could directly harm users. All must be cleared before launch.

---

### H-1 · Core "Not Legal Advice" Disclaimer

**Risk:** High — This is the site's primary liability shield. Any ambiguity about whether the site provides legal advice could expose users to harm and expose the platform to liability.

**Content location:**
- `client/src/locales/en.ts:2592–2597` — Main rights-info disclaimer: *"This information is for general education only. It is not legal advice, and no attorney-client relationship is formed by using this site. Information you access here is not protected by legal privilege. Laws vary by state. Talk to a licensed attorney about your specific situation."*
- `client/src/locales/en.ts:2018–2019` — Case guidance consent header: *"Legal information, not legal advice."* / *"We explain your rights and what to expect — we don't tell you what to do."*
- `client/src/locales/en.ts:2456` — Case guidance privacy page footer: *"This tool provides general legal information and guidance only. It is not a substitute for professional legal advice."*
- `client/src/pages/disclaimers.tsx:499` — Site disclaimers page closing acknowledgement
- `client/src/locales/en.ts:5355` — First 24 Hours guide disclaimer
- `client/src/locales/en.ts:6491` — Record clearance screener disclaimer

**Legal question for attorney:**  
Do the disclaimer statements in each of these locations adequately disclaim the formation of an attorney-client relationship, disclaim legal privilege, and convey that the site provides information rather than advice? Are there any jurisdictions where this language would be legally insufficient?

**Cleared:** ☐  
**Reviewed by:** _______________  **Date:** _______________  
**Attorney notes:** _______________________________________________

---

### H-2 · AI Guidance Disclosure & Anthropic Data Retention Notice

**Risk:** High — The platform discloses that user inputs are processed by Anthropic and retained for up to 30 days. Users in sensitive legal situations need to make an informed decision. This disclosure must be accurate and prominent.

**Content location:**
- `client/src/locales/en.ts:2026` — AI guidance card: *"Your inputs are processed by Anthropic's AI service and may be retained up to 30 days for safety and operational purposes. No attorney-client relationship is formed."*
- `client/src/locales/en.ts:4949–4950` — Chat privilege warning: *"This is general legal information, not legal advice. No attorney-client relationship is formed. Messages in this chat are processed by Anthropic and may be retained for up to 30 days. This chat is not protected by attorney-client privilege."*
- `client/src/locales/en.ts:5238–5239` — `notLegalAdvice` / `notLegalAdviceDesc` keys used in guidance UI

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
**Attorney bar attestation flow:** `client/src/contexts/attorney-context.tsx`

**Legal question for attorney:**  
Are the AI-generated argument sections in a representative sample of these templates (suggested: motion-to-suppress, motion-for-discovery, sentencing-memorandum, bond-motion-eoir, habeas-corpus-petition) legally sound? Does the platform's bar membership attestation requirement adequately gate these tools from lay users? Are there template sections that contain affirmative legal assertions that could be incorrect in specific jurisdictions?

**Cleared:** ☐  
**Reviewed by:** _______________  **Date:** _______________  
**Attorney notes:** _______________________________________________

---

### H-5 · Document Templates — Immigration (EOIR Format)

**Risk:** High — Immigration motions filed with EOIR or the BIA have strict formatting and legal standard requirements. Errors in these templates could directly affect immigration outcomes.

**Content location:**  
All EOIR-format templates above (8 templates): `bond-motion-eoir.ts`, `motion-for-continuance-eoir.ts`, `motion-for-stay-of-removal-eoir.ts`, `motion-for-voluntary-departure-eoir.ts`, `motion-for-withholding-removal-cat.ts`, `motion-to-accept-late-filing-eoir.ts`, `motion-to-administratively-close-eoir.ts`, `motion-to-change-venue-eoir.ts`, `motion-to-reconsider-eoir.ts`, `motion-to-reopen-eoir.ts`, `motion-to-suppress-immigration-eoir.ts`, `motion-to-terminate-eoir.ts`, `notice-of-appeal-bia.ts`, `nta-pleadings.ts`

**Legal standard references in templates:** `shared/templates/immigration-court-data.ts`, `shared/templates/county-data.ts`

**Legal question for attorney:**  
Do the EOIR-format templates comply with current BIA Practice Manual requirements (2024–2025 edition)? Are the legal standards cited in the argument sections accurate for current Ninth/Fifth/Second Circuit precedent (where most EOIR practice occurs)? Is the withholding-of-removal / CAT template legally sound under current DHS v. Thuraissigiam and related precedent?

**Cleared:** ☐  
**Reviewed by:** _______________  **Date:** _______________  
**Attorney notes:** _______________________________________________

---

### H-6 · Know Your Rights — Immigration (ICE Encounters)

**Risk:** High — This content tells users what they are legally permitted to do during ICE encounters. Inaccurate information could lead to users inadvertently waiving rights or taking action that worsens their legal situation.

**Content location:**
- `client/src/pages/immigration/know-your-rights.tsx:341` — Source attribution: *"Source: National Immigration Law Center (NILC), 'Know Your Rights: Warrants' (December 2025). This information is educational only and does not constitute legal advice."*
- `client/src/pages/immigration/know-your-rights.tsx` (full file — KYR page)
- `client/src/pages/immigration/raids-toolkit.tsx` — Community raids preparedness
- `client/src/pages/immigration/workplace-raids.tsx` — Workplace ICE enforcement rights
- `client/src/locales/en.ts:2600–2870` — All immigration locale keys
- `client/src/locales/en.ts:2877` — DACA disclaimer: *"Immigration law changes frequently. Always verify current requirements with USCIS.gov or an immigration attorney before taking action."*

**Source being cited:** NILC "Know Your Rights: Warrants" (December 2025). Attorney should verify this source is current and that the content accurately reflects it.

**Legal question for attorney:**  
Is the ICE encounter guidance (rights during arrest, warrant recognition, right to remain silent) legally accurate under current Fourth and Fifth Amendment precedent? Does the platform accurately describe what constitutes a judicial warrant vs. an administrative warrant? Is the DACA/TPS eligibility information current as of the review date? Does the content in `raids-toolkit.tsx` and `workplace-raids.tsx` stay within the bounds of rights education rather than legal strategy?

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
- `client/src/locales/en.ts:2873–3272` — All DACA, TPS, bond, family planning locale keys

**Legal question for attorney:**  
Are the DACA eligibility requirements (birth after June 15, 1981; U.S. presence since June 15, 2007, etc.) current and accurate? Are the bond hearing procedures described consistent with INA § 236(a) and current BIA precedent? Does the family planning content appropriately frame its guidance as general preparation rather than specific legal strategy? Is the after-deportation content legally accurate regarding re-entry bars and prosecutorial discretion?

**Cleared:** ☐  
**Reviewed by:** _______________  **Date:** _______________  
**Attorney notes:** _______________________________________________

---

### H-8 · Site Disclaimers Page

**Risk:** High — The `/disclaimers` page is the site's comprehensive liability disclosure. It is referenced from multiple pages and is the authoritative statement of what the platform does and does not provide.

**Content location:**
- `client/src/pages/disclaimers.tsx` — Full disclaimers page (~500 lines)
- Key sections: general disclaimer (line ~50), AI guidance disclaimer, attorney tools disclaimer, third-party resources disclaimer (line ~395), user acknowledgement (line ~499)

**Legal question for attorney:**  
Does the disclaimers page adequately cover the platform's liability exposure? Are there content areas of the site not addressed in the disclaimers that should be? Is the "Acknowledgement of Disclosures" language at the end legally effective as constructive notice to users who use the site?

**Cleared:** ☐  
**Reviewed by:** _______________  **Date:** _______________  
**Attorney notes:** _______________________________________________

---

### H-9 · Attorney Portal Bar Attestation & Disclaimer

**Risk:** High — The Attorney Portal provides document generation tools gated behind a bar membership attestation. If the attestation is inadequate, lay users could access and rely on attorney-only tools without the expertise to use them safely.

**Content location:**
- `client/src/pages/attorney/index.tsx:135` — Disclaimer: *"These tools are designed for licensed attorneys. Document generation features require attestation of bar membership."*
- `client/src/contexts/attorney-context.tsx` — Bar attestation state management
- `client/src/locales/en.ts:5252` — `attorney.disclaimer` locale key

**Legal question for attorney:**  
Is the bar membership attestation step legally adequate to restrict access to attorney-only document generation features? Does the attestation language clearly create attorney responsibility for the use of AI-generated document sections? Is there a professional responsibility concern (unauthorized practice of law) if the attestation gate is bypassed?

**Cleared:** ☐  
**Reviewed by:** _______________  **Date:** _______________  
**Attorney notes:** _______________________________________________

---

## MEDIUM-RISK ITEMS

> These items involve educational content, data displays, or secondary disclaimers. They should be reviewed before launch; deferral requires a documented rationale.

---

### M-1 · Collateral Consequences Data — All Seven Categories

**Risk:** Medium — The collateral consequences screener presents risk assessments in seven life areas. Inaccurate or overstated risk information could cause unnecessary alarm; understated risk could cause users to miss important consequences.

**Content location:**
- `client/src/pages/collateral-consequences.tsx` — Screener implementation (491 lines)
- Categories: `supervision` (probation/parole revocation), `immigration` (deportation risk), `children` (custody), `housing`, `employment`, `benefits` (public benefits), `license` (professional licenses)
- Risk level assignments and urgency scores: lines ~82–112

**Note on in-progress work:** A task is pending to add three additional consequence categories: driver's license suspension, immigration-specific consequences (beyond the current general flag), and sex offender registry. These new categories will need their own attorney review before launch. This item covers only the existing seven.

**Legal question for attorney:**  
Are the risk level assignments (critical/warning) for each of the seven consequence categories appropriate? For example, is it correct to flag immigration consequences as "critical" for all non-citizen users regardless of charge type? Are the descriptions of each consequence area legally accurate as general educational statements? Does the screener appropriately disclaim that it provides a preliminary risk flag only, not a legal determination?

**Cleared:** ☐  
**Reviewed by:** _______________  **Date:** _______________  
**Attorney notes:** _______________________________________________

---

### M-2 · Charge Citations Flagged `needs_review` (548 entries)

**Risk:** Medium — These 548 entries in `shared/criminal-charge-citations.ts` carry `confidence: "needs_review"` because the OpenLaws API returned `not_found` when queried. The citations may be correct but unconfirmable via API, or they may be incorrect. They are not currently shown to users (only `confidence: "high"` entries surface the "Read the Law" button), but they inform the AI guidance context.

**Content location:**
- `shared/criminal-charge-citations.ts` — Filter for `confidence: "needs_review"` (548 entries)
- States with most entries: ME (23), HI (23), OK (22), DC (21), ID (20), VT (19), OR (19), UT (18), MA (17), KS (16), CT (16), DE (15), KY (14), NH (13), WI (11)
- Admin review tool: `/admin/citation-review` (interactive verification interface)

**Immediate action available:** The `/admin/citation-review` page allows manual verification against official state legislature URLs. An attorney or paralegal familiar with each state's code structure can verify or correct citations there.

**Legal question for attorney:**  
For a representative sample (suggested: all DC entries [21], all DE entries [15], and 10 random entries from ME/HI/OK), are the statute citations correct? Should any of these be corrected before the AI guidance pipeline uses them as context? Are there citation patterns that look structurally wrong (wrong title, wrong chapter) that warrant a bulk re-audit?

**Cleared:** ☐  
**Reviewed by:** _______________  **Date:** _______________  
**Attorney notes:** _______________________________________________

---

### M-3 · Record Clearance Screener

**Risk:** Medium — The screener at `/support/reputation/eligibility` gives users a preliminary indication of whether their record may be eligible for expungement or sealing. Incorrect eligibility signals could cause users to either pursue inappropriate remedies or give up on legitimate ones.

**Content location:**
- `client/src/pages/support/record-clearance-screener.tsx` — Screener logic
- `client/src/locales/en.ts:6427` — Subtitle: *"Answer four questions to find out if your record may be eligible for expungement, sealing, or automatic clearance. This tool gives general information only. It is not legal advice."*
- `client/src/locales/en.ts:6491` — Disclaimer: *"This screener provides general information only. It is not legal advice. Results depend on your specific record and state law. Contact a legal aid organization for a full review."*

**Legal question for attorney:**  
Are the eligibility logic pathways in the screener consistent with the general eligibility rules for expungement and record sealing across the most common states? Does the screener appropriately disclaim that results are preliminary and jurisdiction-specific? Is the disclaimer language at line 6491 sufficient to prevent users from relying on the screener's output as a definitive eligibility determination?

**Cleared:** ☐  
**Reviewed by:** _______________  **Date:** _______________  
**Attorney notes:** _______________________________________________

---

### M-4 · Diversion Programs Directory

**Risk:** Medium — The directory lists 111 diversion programs with eligibility criteria as self-reported by the programs. Users may rely on this information when deciding whether to request a diversion program.

**Content location:**
- `server/data/diversion-programs.ts` — Program data (111 entries)
- `client/src/pages/diversion-programs.tsx` — Directory UI
- `client/src/locales/en.ts:4011` — Disclaimer: *"This directory lists programs and their eligibility criteria as reported by the programs themselves. Program availability and terms vary by jurisdiction. Whether a specific program is appropriate for your situation is a decision for you and your attorney. This page does not form an attorney-client relationship."*

**Legal question for attorney:**  
Is the disclaimer at line 4011 adequate for a directory that relies on self-reported eligibility criteria? Are there eligibility criteria listed for any programs that appear legally incorrect or that could mislead users into thinking they are eligible when they are not? Should the directory carry a more prominent disclaimer that diversion program participation typically requires prosecutorial agreement?

**Cleared:** ☐  
**Reviewed by:** _______________  **Date:** _______________  
**Attorney notes:** _______________________________________________

---

### M-5 · Public Defender Intake Checklist (Advocate Tool)

**Risk:** Medium — This tool is used by public defenders and legal aid attorneys. The Padilla immigration flag (auto-raised for non-citizen clients) is a specific legal obligation; if it fires incorrectly it could cause defenders to miss or over-trigger a required inquiry.

**Content location:**
- `client/src/pages/for-advocates/intake-checklist.tsx` — Checklist implementation
- Padilla flag logic: searches for `padilla` or `immigration` in the file
- `client/src/locales/en.ts:6738` — Disclaimer: *"This checklist is a practical tool only. It is not legal advice and is not privileged."*

**Legal question for attorney:**  
Does the Padilla review auto-flag trigger correctly (for non-citizen status, not just for immigration-related charges)? Is the Padilla flag description accurate — specifically, does it correctly convey that Padilla v. Kentucky requires counsel to advise non-citizen clients of deportation consequences of guilty pleas? Is the tool's disclaimer (line 6738) adequate for a tool used by licensed attorneys?

**Cleared:** ☐  
**Reviewed by:** _______________  **Date:** _______________  
**Attorney notes:** _______________________________________________

---

### M-6 · Privacy Policy

**Risk:** Medium — The privacy policy describes how user data is handled. Inaccuracies (e.g., overstating data ephemerality, understating Anthropic's data retention) could create FTC or state consumer protection exposure.

**Content location:**
- `client/src/pages/privacy-policy.tsx` — Full privacy policy
- Key claims to verify:
  - "Session-only" / "data deleted after session" — verify against actual session storage TTL (server: 24h or restart, whichever comes first; `server/index.ts`)
  - Anthropic data retention — currently stated as "up to 30 days" in guidance consent; verify this matches Anthropic's current API terms
  - Third-party data sharing disclosures

**Legal question for attorney:**  
Does the privacy policy accurately describe the data lifecycle (session storage, 24-hour server-side TTL, Anthropic 30-day AI processing retention)? Are there any claims in the privacy policy that are inconsistent with the actual technical implementation? Does the policy comply with CCPA requirements for California users and with any applicable state privacy laws for the states most likely to use this platform?

**Cleared:** ☐  
**Reviewed by:** _______________  **Date:** _______________  
**Attorney notes:** _______________________________________________

---

## Items Out of Scope for This Review

The following are tracked elsewhere or are purely technical:

| Item | Location | Why Out of Scope Here |
|------|----------|-----------------------|
| New collateral consequence categories (driver's license, sex offender registry) | Task pending implementation | Not yet built; will need own review row when added |
| Statute citation accuracy for 30+ unaudited states | `shared/criminal-charges.ts` | Technical data accuracy, not legal interpretation |
| Broken external links | Diversion programs script | Operational, not legal content |
| Spanish / Chinese translations of disclaimer text | `client/src/locales/es.ts`, `zh.ts` | Covered under translation task; attorney should review translated disclaimers separately |

---

## Sign-Off Summary

| Area | Attorney | Date Cleared | Notes |
|------|----------|--------------|-------|
| H-1 Core Disclaimer | | | |
| H-2 AI Disclosure | | | |
| H-3 AI Output Quality | | | |
| H-4 Criminal Templates | | | |
| H-5 Immigration Templates | | | |
| H-6 ICE Encounter KYR | | | |
| H-7 Immigration Pages | | | |
| H-8 Disclaimers Page | | | |
| H-9 Attorney Portal Gate | | | |
| M-1 Collateral Consequences | | | |
| M-2 Needs-Review Citations | | | |
| M-3 Record Clearance Screener | | | |
| M-4 Diversion Programs | | | |
| M-5 Intake Checklist | | | |
| M-6 Privacy Policy | | | |

**Overall launch authorization:**  
All HIGH-risk items cleared: ☐  
All MEDIUM-risk items cleared or deferred with rationale: ☐  

**Authorized by:** _______________  **Bar number:** _______________  **Date:** _______________
