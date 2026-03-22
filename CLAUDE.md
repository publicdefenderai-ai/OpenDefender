# CLAUDE.md — OpenDefender / PublicDefenderAI

Project rules, conventions, and hard-won lessons. Read this before making any changes.

---

## Project Overview

OpenDefender is a public legal aid platform providing constitutional rights information, AI-guided case guidance, and immigration resources. Users are people in or approaching crisis — often low-income, recently arrested, or facing deportation.

**Tech stack:** React + TypeScript (Vite), Wouter routing, TanStack Query, Tailwind + shadcn/ui, Express server, Drizzle ORM + PostgreSQL, react-i18next

---

## Non-Negotiable Site-Wide Rules

### 1. Privacy and Security First
- Never log, store, or surface user-identifying data beyond the session
- Never expose test routes, admin bypasses, or debug endpoints in production
- All session data must auto-delete; cost tracking must be durable (awaited writes)
- **No secrets in the codebase.** API keys, database credentials, session secrets, and tokens must only ever come from `process.env`. Never assign a secret as a string literal in source code. If a value looks like a key or credential, it belongs in the hosting environment's secret manager, not in code. The `.env` file is gitignored and must never be committed. See `.env.example` for the full list of required variables.

### 2. Accuracy Above All — No Dummy, Stale, or Placeholder Data in Production
This has been violated before. Never ship:
- Mock court data with fake addresses or phone numbers
- Legal aid contacts that haven't been verified against live sources
- Statistics without naming the source and data year
- Statute content truncated with `...`
- Hardcoded defaults that don't match the user's actual jurisdiction

If real data isn't available yet, surface a clear "data not available" message — do not invent or guess.

---

## Reading Level

**All user-facing content must be written at a 6th grade reading level.** This applies to page copy, AI prompts, UI labels, and tooltip text.

- Replace legal jargon with plain language in explanatory body text
- Legal terms can appear as labels or headers but must be explained immediately
- Avoid em dashes, passive constructions, and multi-clause sentences
- Avoid AI-type speak: unnecessary em dashes, dramatic phrasing, flowery transitions

---

## i18n Rules

- All three languages (EN, ES, ZH) are in **one large file: `client/src/i18n.ts`** (~1000KB). There are no separate JSON locale files.
- When searching for a key, always use `grep` with line numbers — never try to read the whole file
- Every user-facing string must be wrapped in `t('key')` — hardcoded English strings will not be translated
- When adding a new string, add it in all three language blocks (EN around line 1–4800, ES around 4800–9600, ZH around 9600+)
- The approximate line ranges shift as content grows — grep to locate the right section before editing

---

## Routing and New Pages

- All routes are registered in `client/src/App.tsx` using wouter's `<Route>` and lazy imports
- Every new page needs:
  1. A lazy import at the top of App.tsx
  2. A `<Route>` entry in the Router function
  3. An entry in the `sitePages` array in `server/services/search-indexer.ts` (manually maintained — it does NOT auto-discover pages)
- The search indexer will silently miss new pages if you forget step 3

---

## Legal Accuracy Validator Scope

The two-tier legal accuracy validator (`server/services/legal-accuracy-validator.ts`) only runs on **AI Case Guidance output** — it does NOT validate static editorial pages.

- Tier 1: checks statute citations against the statute DB, penalties against `criminalCharges`, timelines against `JURISDICTION_DEADLINE_RULES` (10 states + federal)
- Tier 2: CourtListener semantic search (wrapped in try/catch, fails silently — do not assume it always runs)
- The AI generates guidance first (from training data), then the validator checks it after — do not describe this as "not generated from memory"
- Static editorial pages (rights-info, first-24-hours, right-to-counsel, search-seizure, etc.) are manually researched and are the author's responsibility for accuracy

Do not overstate the platform's accuracy coverage in user-facing copy. The home page pledge was corrected once already for this reason.

---

## Design Conventions

- **No icon overload.** One icon per navigation item or section header maximum. Do not add decorative icons to every list item or link.
- **No rainbow/color-coded panels** for urgency states or information categories. Use neutral cards with numbered lists instead.
- **No collapsible accordions** for trust or commitment sections — these must always be visible.
- **vivid-header** CSS class is used for hero sections across pages.
- Component pattern: `Header`, `Footer`, `ScrollReveal`, `PageBreadcrumb`, `Card/CardContent/CardHeader/CardTitle`, `Alert/AlertDescription`, `Badge`, `Collapsible`, `Button` from shadcn/ui; `Link` from wouter.
- `useScrollToTop` hook is used on every page.

---

## Mistakes Made by Replit Agent (Do Not Repeat)

### Data and Content
- **Shipped mock court data** with fake phone numbers and addresses as a fallback — removed in `fdf30dd`. Never add a data fallback that returns fabricated contact info.
- **Statute content truncated with `...`** — shipped to production in `federal-statutes-seed.ts`. Fixed in `c87761b`. Every statute entry must have complete verbatim text, not excerpts.
- **Stale legal aid contacts** — multiple orgs had wrong addresses, phones, and websites. Fixed in `88879fc` and `992936f`. Any legal aid data must be verified against the org's live website before committing.
- **Statistics with no source or age disclosure** — case outcome stats were shown without naming the BJS/USSC source or the data year. Fixed in `88879fc`. Always include source and data year.
- **Overstated accuracy pledge** — "Every statute we cite is sourced. Every legal claim is checked against real databases, not generated from memory." was factually wrong in two ways. Fixed in `34efd5b`.
- **Hardcoded CA jurisdiction defaults** — document wizard defaulted to California for all users. Fixed in `e3f83c1`. Forms must default to "Other / Generic" unless the user has specified a state.
- **Broken external links on support pages** — many resource links on employment, transportation, housing, and other support pages pointed to wrong or dead URLs. Fixed in `1167641`. Verify all external links before committing.

### Security and Code Quality
- **`parseInt` without radix** — always use `parseInt(x, 10)`. Bare `parseInt` is unpredictable with leading zeros.
- **Admin dev-mode bypass via `NODE_ENV`** — was `if (NODE_ENV === 'development') skip auth`. Now requires explicit `ADMIN_DISABLE_AUTH=true` env var. Never gate auth on NODE_ENV alone.
- **`recordAICost` not awaited** — cost was lost on crash. All DB writes for cost tracking must be awaited.
- **CSS injection via `dangerouslySetInnerHTML`** — color values were injected without an allowlist. Now sanitized with `sanitizeColor()` in `chart.tsx`. Never inject user-supplied or dynamic values into CSS blocks without allowlisting.
- **Missing DB indexes** — tables with frequent WHERE-clause lookups were unindexed. Add indexes to every column used in WHERE, JOIN, or ORDER BY at schema creation time.
- **O(n) storage scans** — `Array.from(map.values()).find(...)` used for session dedup. Now uses reverse-index Maps for O(1) lookup.
- **Session cache not isolated** — guidance cache keys were not prefixed by session ID, so `clearSessionCache` cleared all sessions. Cache keys must include `sessionId` as prefix.
- **Test route exposed** — `/dashboard-test` route was left in production routing. Removed in `fdf30dd`. Never commit test or debug routes to main.

### UI and Performance
- **25 Google Font families loaded** — only Inter and Source Serif 4 are used. Trimmed in `ea44c1f`. Only import fonts that are actually referenced in CSS.
- **Replit dev banner script left in `index.html`** — removed in `ea44c1f`. Always audit `index.html` for Replit-specific injections before launch.
- **Broken og-image.png references** — OG meta tags pointed to a file that didn't exist. Fixed in `ea44c1f`. Verify all static asset references exist before committing.
- **Icon overload and rainbow panels** — removed in `2cea364`. The Urgent Help modal had color-coded panels; the How-To page had 26 per-link icons. Keep UI clean and minimal.

### i18n
- **Hardcoded English strings** not wrapped in `t()` — found across court locator, accessibility links, and dev progress labels. Fixed in `b28dff0`. Every string visible to users must go through i18n.
- **Dead i18n keys** — `limitedData` and `sampleData` keys existed in all three locales but were never referenced by any component. Removed in `c87761b`. Do not leave unreferenced keys in i18n.ts.

---

## Mistakes Made by Claude (Do Not Repeat)

- **Push failing when remote is ahead** — always run `git pull --rebase origin main` before `git push origin main`. The Replit agent pushes on its own schedule.
- **Assuming i18n uses separate JSON files** — it does not. All translations are in one large `client/src/i18n.ts`. Use grep with line numbers to find and edit specific keys.
- **Forgetting to add new pages to the search indexer** — `server/services/search-indexer.ts` has a `sitePages` array that must be manually updated. The system does not auto-discover pages. Five pages were missing from search until caught in `d4ba2a9`.
- **Unnecessary em dashes in copy** — em dashes read as AI-generated prose and hurt readability. Replace with periods, commas, or colons as appropriate. Keep only where the em dash makes a clear stylistic improvement.

---

## Git Workflow

- Branch: `main` (single branch, no feature branches currently)
- Remote is frequently ahead (Replit agent pushes independently)
- Before every push: `git pull --rebase origin main && git push origin main`
- Commit messages: short imperative subject line, blank line, then bullet-point body if needed
- Always co-author: `Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>`

---

## Quarterly Maintenance (Automated)

Three GitHub Actions workflows run quarterly to flag stale data:
- `check-legal-aid.ts` — HTTP checks all 24 legal aid org URLs, outputs `legal-aid-diff.json`
- `check-federal-statutes.ts` — HEAD checks all Cornell LII statute URLs, outputs `statutes-diff.json`
- `generate-report.ts` — reads diff outputs and opens a GitHub Issue with items needing manual review

Do not remove or disable these workflows.
