# Privacy Impact Assessment (PIA) — OpenDefender

> Adapted from [anthropics/claude-for-legal](https://github.com/anthropics/claude-for-legal)
> (Apache 2.0 © Anthropic PBC). Tailored for OpenDefender's privacy-first,
> public-access legal information platform.

---

## When a PIA Is Required

Run this template before shipping any of the following:

- A new AI-powered feature or tool
- A change to how user inputs are collected, processed, or routed
- A new third-party integration (API, MCP server, analytics, etc.)
- A change to session data handling, retention, or deletion
- A new field that collects user-provided information (even temporarily)
- Any change to the case guidance or chatbot flows

Minor editorial content changes, UI styling, and bug fixes do not require a PIA.
If in doubt, run it — this template takes less than ten minutes.

---

## Template

### 1. Feature Description

**Feature name:**
**Date:**
**Reviewer:**

What does this feature do? (2–3 sentences, plain English)

---

### 2. Data Assessment

**What user-provided information does this feature collect or process?**
(E.g., typed text, selections, uploaded files, geolocation)

| Data element | Collected? | Sent to third party? | Stored beyond session? |
|---|---|---|---|
| Free-text input | | | |
| Jurisdiction/state selection | | | |
| Charge type selection | | | |
| File upload | | | |
| Other: _____ | | | |

**If anything is stored beyond the session:** What is the retention period and where is it stored?

---

### 3. Third-Party Processing

**Does any user input get sent to Anthropic (via the AI API)?**
- [ ] Yes — describe what is sent: ___________
- [ ] No

**If yes:** Users are informed of Anthropic's 30-day retention and potential subpoena
disclosure in the consent screen. Verify the disclosure is accurate for what is
being sent. If the scope has changed, update the consent and privacy notice language.

**Any other third-party services receiving user data?**
(CourtListener, Cloudflare Turnstile, other MCP servers, analytics, etc.)

| Service | Data sent | Purpose |
|---|---|---|
| | | |

---

### 4. Privacy Policy Consistency

**Current policy commitments (from Privacy Policy page):**
- No personal data collected or stored
- All interactions are anonymous
- Session data auto-deleted when you close your browser or end your session
- We do not sell or share your data

**Does this feature comply with all four commitments above?**
- [ ] Yes — no changes needed
- [ ] No — describe the gap: ___________
- [ ] Partially — describe: ___________

**If there is a gap:** One of the following must happen before launch:
(a) The feature is redesigned to close the gap, or
(b) The privacy policy and all user-facing disclosures are updated first.

---

### 5. Risk Assessment

**What is the worst-case scenario if data processed by this feature were subpoenaed
or breached?**

(Be specific. "User typed their charge type and state" has a very different risk
profile from "user narrated the facts of their arrest in detail.")

**Risk level:** Low / Medium / High

**Rationale:**

---

### 6. Disclosure Requirement Check

**Do any of these need to be updated based on this feature?**

- [ ] Privacy Policy (`/privacy-policy`)
- [ ] Case guidance consent screen (bullet 3 — Anthropic retention notice)
- [ ] First 24 Hours page disclaimer
- [ ] Rights Info page disclaimer
- [ ] GuidanceDashboard Privacy Notice card
- [ ] CLAUDE.md privacy rules (Section 1)
- [ ] None — no disclosure changes needed

---

### 7. Sign-Off

| Condition | Met? |
|---|---|
| All data collected is session-only or explicitly consented to | |
| Third-party processing disclosed in consent/privacy flows | |
| Privacy policy remains accurate | |
| No new personal data stored on our servers | |
| Anthropic consent language accurate for what is sent | |

**Decision:**
- [ ] Proceed — no privacy concerns
- [ ] Proceed with modifications: ___________
- [ ] Hold — requires policy update before launch
- [ ] Escalate — requires additional review

**Notes:**

---

*This PIA is an internal review tool, not a legal assessment. It does not constitute
legal advice. For features with significant privacy implications, consult qualified
privacy counsel.*
