# OpenDefender — Data Quality Control Playbook

**Internal reference. Not a public page.**

Documents every QC process used on this platform, when to run it, what it catches, and the lessons behind each check. Update this file whenever a new error pattern is discovered or a new check is added.

---

## Principle: Defense in Depth

No single check catches everything. The platform uses three overlapping layers:

1. **Pre-entry controls** — TypeScript types and data confidence tiers prevent obviously wrong data from compiling or reaching users.
2. **At-commit verification** — Research agents confirm factual accuracy before or shortly after a data entry is committed.
3. **Automated quarterly sweeps** — GitHub Actions scripts catch link rot, stale data, and structural drift on a fixed schedule.

What has NOT worked: Relying solely on training knowledge without a verification step. This led to 14 factual errors in Phase 4 collateral consequences data (full_ban states listed as modified/no_ban, wrong voting restoration points) and a completely wrong speedy trial entry for Arkansas ("no statutory deadline" when Ark. R. Crim. P. 28.1 sets a 12-month hard limit with dismissal-with-prejudice remedy).

---

## Layer 1: Pre-Entry Controls (apply at every data change)

### 1a. TypeScript strict typing for data files

**What it catches:** Invalid union values, duplicate keys, typos in field names, missing required fields.

**How to run:** `npx tsc --noEmit` — run before every commit involving data files.

**Lessons learned:**
- `bailStructure: 'reformed'` failed because the union only allows `'cash_bail' | 'reformed_no_cash' | 'reformed_limited_cash' | 'presumption_release'` — caught immediately.
- `licensingNexysReform` (typo) was caught at compile time.
- Duplicate `notes` keys in the FL employment block were caught at compile time.
- Three pre-existing errors in `claude-guidance.ts`, `cost-tracker.ts`, `guidance-safety.ts` — these are known pre-existing issues, not introduced by data changes. Track them separately.

**Rule:** No data file change ships without a clean `npx tsc --noEmit` (pre-existing errors are acceptable; new errors are not).

### 1b. Data confidence tiers

**What it catches:** Prevents low-confidence or unverified data from being surfaced to users.

**How it works:** Every entry in `jurisdiction-procedure-rules.ts`, `expungement-data.ts`, and `collateral-consequences-data.ts` has a `dataConfidence: 'high' | 'medium' | 'low'` field. The `get*Rule()` and `build*ContextBlock()` functions return `null` for low-confidence entries — AI prompts and editorial callouts silently fall back to generic text.

**Rule:** Start new jurisdiction entries at `low`. Promote to `medium` after secondary source verification (NCSL, CCRC, NELP, CLASP). Promote to `high` after verifying against primary statute text.

**Rule:** Never delete a low-confidence entry — retain it as a starting point for the next quarterly review pass. The entry documents what we don't yet know.

---

## Layer 2: At-Commit Verification (for every data expansion sprint)

### 2a. Parallel research agents before marking confidence level

**What it catches:** Factual errors in entries that were filled from training knowledge.

**Pattern:** Before finalizing a new batch of jurisdiction entries, launch 2–4 parallel Agent tool calls (subagent_type: general-purpose) with specific statutory questions. Collect results, compare against entries, correct before committing.

**Proven examples:**
- **AR speedy trial (Phase 1 low→high promotion):** Agent research found Ark. R. Crim. P. 28.1 gives 12 months (9 months in custody) with dismissal-with-prejudice — the existing entry said "no statutory deadline," which was completely wrong.
- **MO/DE procedure rules (Phase 1):** Agent research confirmed MO arraignment is a hard 48h clock (not "without unnecessary delay") under R. 22.08/21.10; DE bail structure is `reformed_limited_cash` not `cash_bail` (2017 SB 163).
- **Phase 4 post-commit (collateral consequences):** Agents found AL/ID/SC/MS retain the full federal lifetime SNAP/TANF ban (entries had `modified`); NC voting rights requires completing all supervision after NC Supreme Court reversed the 2023 trial court ruling.

**How to structure the research prompt:**
- Name the specific statute/rule you expect to exist
- Ask for the exact day count, conditions, and remedy
- Ask for the specific citation
- Ask explicitly: "Is the data in [file] at [lines] correct?"

**Rule:** For any data file covering ≥10 states, run post-commit research agents before the changes reach a release. Do not wait for users to find errors.

### 2b. Single-source cross-check for benefit ban data (SNAP/TANF)

**What it catches:** States incorrectly listed as having no ban or a modified ban when they retain the full federal lifetime ban.

**Why it matters:** Telling a user they can receive SNAP benefits when their state has a lifetime ban gives materially harmful misinformation.

**Known full-ban states (as of March 2026):** AL, ID, MS, SC, and possibly WY (verify). Any other state being promoted to `no_ban` should be confirmed against USDA FNS Drug Felony Conviction State Options document.

**Rule:** Before marking any state's SNAP/TANF status as `no_ban`, confirm against the current USDA FNS state options document (updated annually at fns.usda.gov). The CLASP state snapshots are a reliable secondary source. Do not infer from training knowledge alone.

### 2c. Apostrophe and string literal audit

**What it catches:** Unescaped apostrophes in single-quoted TypeScript string literals.

**Example:** `notes: 'Governor Reynolds' 2020 Order...'` — the apostrophe in `Reynolds'` terminates the string, causing dozens of TS2322 errors on that line.

**How to catch it:** `npx tsc --noEmit` catches these, but they produce cascade errors on a single line that can be confusing. Grep for possessives: `grep -n "'s \|'[A-Z]" yourfile.ts`.

**Rule:** When writing notes fields with proper names (Reynolds, Youngkin, Beshear) or possessives, use the form `Governor Reynolds (2020)` rather than `Governor Reynolds' 2020` to avoid the punctuation issue.

---

## Layer 3: Automated Quarterly Checks (GitHub Actions)

Four scripts run on a quarterly schedule via `.github/workflows/quarterly-data-review.yml`.

### 3a. check-legal-aid.ts

**What it checks:** HTTP HEAD requests to all 24 legal aid organization URLs in the seed data.

**Output:** `legal-aid-diff.json` — lists organizations with non-200 status codes.

**What to do with results:** Visit each flagged URL, verify the org's current website, update the seed file (`server/db/seed/legal-aid-seed.ts`) and run `npm run db:seed`.

**Lesson:** Static legal aid data went stale between the original Replit build and our first review pass. Several orgs had wrong addresses, phone numbers, and websites.

### 3b. check-federal-statutes.ts

**What it checks:** HTTP HEAD requests to all Cornell LII statute URLs in the federal statutes data.

**Output:** `statutes-diff.json` — lists statutes with non-200 status codes.

**What to do with results:** Verify the statute still exists at the URL; update the URL or remove the entry if the statute was relocated or repealed.

**Lesson:** Statute content was shipped truncated with `...` in the original seed (fixed in `c87761b`). Complete verbatim text is required.

### 3c. check-public-defenders.ts

**What it checks:** HTTP HEAD requests to public defender office and court-appointed program websites; also flags entries with missing phone numbers.

**Output:** `public-defenders-diff.json`

**What to do with results:** Verify each flagged org's current website and phone number directly.

### 3d. generate-report.ts

**What it does:** Reads all three diff outputs and opens a GitHub Issue with all items needing manual review.

**What to do:** Assign the issue to a contributor, work through each item, and close the issue when all corrections are committed.

---

## Layer 4: Manual Quarterly Review (no automation — human judgment required)

These checks cannot be automated because the data changes through legislation, executive orders, and court decisions — not through URL changes. They require a human to read the current state of the law.

### 4a. Voting Rights Restoration Review

**Frequency:** Quarterly.

**Why:** Voting rights laws are the most volatile category on the platform. States change them via executive order (IA, VA, KY — can be reversed without legislation), legislation (MN 2024, OR 2024), constitutional amendment (FL Amendment 4 2018), and litigation (NC Supreme Court reversal 2023).

**What to check:**
- The Sentencing Project's annual felon voting rights map: sentencingproject.org
- CCRC Restoration of Rights profiles: ccresourcecenter.org/state-restoration-profiles/
- NCSL felon voting rights tracker: ncsl.org/elections-and-campaigns/felon-voting-rights
- Brennan Center for Justice (litigation updates — especially FL, NC): brennancenter.org

**Priority states to verify each quarter:** VA (executive order, changes with governors), IA (executive order), KY (executive order), FL (litigation over financial obligations), NC (litigation ongoing), and any state with a recent election that changed the governor's office.

**File to update:** `client/src/lib/collateral-consequences-data.ts` — voting section per state.

### 4b. SNAP/TANF Drug Felony Ban Status Review

**Frequency:** Quarterly.

**Why:** States amend these bans through annual legislative sessions. Several states moved from full_ban → modified → no_ban over the 2018–2024 period. Telling a user their state has a lifetime ban when it has been repealed, or vice versa, is material misinformation about benefit eligibility.

**What to check:**
- USDA FNS "Drug Felony Conviction" state options document: fns.usda.gov (updated annually)
- CLASP state snapshots: clasp.org (updated periodically)
- Legal Action Center "After Prison" tracker

**Known full-ban states as of March 2026:** AL, ID, MS, SC. Verify WY (reform bills were introduced).

**File to update:** `client/src/lib/collateral-consequences-data.ts` — benefits section per state.

### 4c. Ban-the-Box / Fair Chance Hiring Review

**Frequency:** Semi-annual (this area moves fast).

**Why:** Many states passed BTB legislation between 2018 and 2024. The space is still active, and some states have expanded from public-only to private-employer coverage.

**What to check:**
- NELP fair chance hiring tracker: nelp.org/ban-the-box-fair-chance-hiring-state-and-local-guide
- NCSL BTB tracker: ncsl.org

**File to update:** `client/src/lib/collateral-consequences-data.ts` — employment section per state.

### 4d. Jurisdiction Procedure Rules Review

**Frequency:** Annual for medium/high-confidence states; quarterly for states with recent legislative activity.

**What to check:**
- Arraignment/initial appearance timelines: state court rules (check state supreme court website)
- Speedy trial rules: state legislature website
- Bail reform: check for new legislation (IL SAFE-T Act had implementation issues; NJ bail reform has had ongoing adjustments)

**Priority states:** Any state with a new bail reform law, any state that amended its speedy trial statute, any state flagged in the quarterly report.

**File to update:** `shared/jurisdiction-procedure-rules.ts`

### 4e. Expungement Data Review

**Frequency:** Annual (Clean Slate legislation has been active in many states).

**What to check:**
- CCRC expungement tracker: ccresourcecenter.org
- Clean Slate Initiative state tracker: cleanslateinitiative.org
- NCSL expungement/sealing statutes survey

**Priority states:** States with "modified" or limited expungement noted in the overview field; states with recent Clean Slate legislation (PA Clean Slate 2018, 2020; other states passing similar laws).

**File to update:** `client/src/lib/expungement-data.ts`

---

## Error Patterns to Watch For

These are the categories of errors that have actually occurred on this platform:

| Error Type | Example | Detection Method | Prevention |
|---|---|---|---|
| Wrong ban status (full vs. modified) | AL/ID/SC SNAP listed as `modified` when actually `full_ban` | Post-commit research agents | Verify against USDA FNS before entry |
| Wrong voting restoration point | NC listed as `on_release`; actually `supervision_complete` after court reversal | Post-commit research agents | Check litigation status, not just statute text |
| Wrong speedy trial characterization | AR listed as "no statutory deadline"; actually 12 months | Pre-commit research agents | Always search specifically for Rules of Criminal Procedure, not just constitutional provisions |
| Wrong BTB scope | VA listed as `public_only`; actually `private_also` since 2020 | Post-commit research agents | Check legislation from 2019–2024 before assuming public-only |
| Truncated statute content | Federal statutes shipped with `...` | TypeScript compile; visual review | All statute entries must have complete verbatim text |
| Fake/unverified contact data | Mock court data with fake phone numbers | Code review | No fallback data that returns fabricated info |
| Stale legal aid contacts | Wrong addresses, phones, websites | Quarterly URL checker | Verify against live org website before commit |
| Hardcoded jurisdiction defaults | Document wizard defaulted to CA for all users | Testing | Default to "Other / Generic" unless user specified |
| Apostrophe in single-quoted strings | `Governor Reynolds'` breaks string | `npx tsc --noEmit` | Use `Governor Reynolds (2020)` form |

---

## QC Checklist for a Data Expansion Sprint

Run this checklist when adding a new batch of jurisdiction data (e.g., a new phase):

- [ ] Define TypeScript interfaces before entering data (type errors are better than runtime errors)
- [ ] Enter data with `dataConfidence: 'low'` initially
- [ ] Launch parallel research agents to verify key facts (1 agent per state cluster or topic area)
- [ ] Compare research findings against entries; correct before committing
- [ ] Promote confidence level based on findings: `low → medium` (secondary source), `medium → high` (primary statute)
- [ ] Run `npx tsc --noEmit` — zero new errors
- [ ] Commit with clear message describing what was added and what sources were used
- [ ] Run a second round of post-commit research agents for the highest-stakes fields (benefit bans, voting rights)
- [ ] Apply corrections in a follow-up commit
- [ ] Update `SOURCES.md` with methodology and source citations
- [ ] Update memory plan file with phase completion status

---

## Contacts and Source Bookmarks

| Source | URL | What It Covers | Update Frequency |
|---|---|---|---|
| USDA FNS Drug Felony State Options | fns.usda.gov (search "drug felony SNAP") | SNAP/TANF ban status by state | Annual |
| CLASP State Snapshots | clasp.org | SNAP/TANF benefit restrictions | Periodic |
| NELP Fair Chance Tracker | nelp.org | Ban-the-box by state | Quarterly |
| CCRC State Restoration Profiles | ccresourcecenter.org/state-restoration-profiles/ | Voting, expungement, licensing | Ongoing |
| Sentencing Project Voting Map | sentencingproject.org | Felon voting rights by state | Annual |
| NCSL Felon Voting Rights | ncsl.org/elections-and-campaigns/felon-voting-rights | Voting rights statutes | Updated with legislation |
| Brennan Center | brennancenter.org | Voting rights litigation | Ongoing |
| Clean Slate Initiative | cleanslateinitiative.org | Expungement/sealing legislation | Ongoing |
| NCSL Expungement Statutes | ncsl.org | Expungement/sealing by state | Updated with legislation |
