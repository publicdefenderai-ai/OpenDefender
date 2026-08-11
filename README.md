# OpenDefender

**Free legal information and life support resources for people navigating the U.S. criminal justice and immigration systems.**

OpenDefender is a free, open-source platform that provides plain-language rights information, early advocacy guidance, and practical life support resources — covering housing, employment, finances, mental health and treatment, immigration, and more. Everything is free, trilingual, and requires no account.

🌐 **Live Platform**: [opendefender.ai](https://opendefender.ai/) (also available at [opendefender.net](https://opendefender.net/))

---

## Mission

To provide free, plain-language legal information and practical life support resources to people navigating the U.S. criminal justice and immigration systems — particularly in the early hours and days after an arrest, when legal representation is often not yet available. All content is written at a 6th-grade reading level with full trilingual support (English / Spanish / Chinese).

---

## Key Features

### First 24 Hours and Early Advocacy
- **First 24 Hours Guide** (`/first-24-hours`) — arrest through arraignment, including a full jail phone call section (what can and cannot be discussed, attorney call rules), state-by-state inmate locator, probation/parole guidance, and an explanation of who is charging you (DA, State's Attorney, U.S. Attorney)
- **Pretrial Release Advocacy Toolkit** (`/support/court-logistics/bail-preparation`) — documentation checklist for bail hearings (employment, housing, community ties, support network), letter templates (employer support, character reference, family support statement), and a plain-language guide to types of release (ROR through conditional release)
- **Right to an Attorney** (`/right-to-counsel`) — 5th vs. 6th Amendment timing, custody vs. detention, how to invoke
- **Warrants Guide** (`/warrants`) — search, arrest, and ICE warrants; what to do at the door

### Life Support Resources Hub
11 dedicated resource pages covering real-life challenges alongside a criminal case:

> Employment · Finances · Housing · Transportation · Childcare · Court Logistics · Reputation · Immigration · Mental Health & Treatment · Personal Health · Family Care

Each page includes actionable steps, vetted external resources, FAQs, and national organizations including [Partners for Justice](https://www.partnersforjustice.org/).

**Notable sections within Life Support:**
- **Treatment Connection** (Mental Health & Treatment) — how to find and enroll in drug treatment, mental health, or anger management programs before sentencing; SAMHSA treatment locator guidance; enrollment documentation templates for court use
- **Court Date Reminder Resources** (Court Logistics) — third-party reminder services, self-help steps, The Bail Project; linked to the court date tracker guide
- **Automatic Record Clearance** (Reputation & Records) — Clean Slate programs in 8 states; record clearing eligibility screener; FCRA rights when a background check is run; certificates of relief from collateral consequences; rap sheet error identification guide

### Friends & Family Hub
- `/friends-family` — overview guide for people supporting an arrested loved one, covering the first 48 hours and longer-term support during custody
- `/friends-family/toolkit` — practical toolkit: conversation guides, what not to say on jail calls, bail help, probation/parole explainers, and mock Q&A court prep

### Case Roadmap
- **Jurisdiction and charge-aware:** Enter your state, charge type, case stage, and custody status to get information calibrated to your specific combination of circumstances
- **Civil emergency triage:** If housing, employment, childcare, or immigration situations are active alongside a criminal case, the Roadmap surfaces those concerns and links to the relevant life support resources
- **Privacy-first:** All inputs are session-only, never written to a persistent database, and expire within 24 hours or on server restart
- **Powered by Claude Sonnet 4.6** for the guidance generation step
- **Informational, not advisory:** The Roadmap provides general legal information for your charge type and stage — users seeking legal advice are prompted to obtain counsel

### Rights & Education
- **Interactive 7-stage Case Timeline** — from arrest through appeal, in 3 languages
- **Your Constitutional Rights** (`/rights-info`) — Miranda, Search & Seizure (tab), Right to Counsel (tab), Speedy Trial, Jury Trial — all in one place
- **Mock Q&A Practice** — static Q&A library plus AI-generated personalized practice questions
- **Legal Glossary** — plain-language definitions with search

### Immigration Resources
- **Immigration Guidance Hub** (`/immigration-guidance`) — Know Your Rights during ICE encounters, workplace raids, DACA/TPS, bond hearings, family planning, raids toolkit, inmate locator
- **After Deportation** (`/immigration-guidance/after-deportation`) — practical guidance for families on both sides of a removal order; separate tracks for the person who was deported and for family remaining in the US; covers staying in contact, financial support, children's rights, and possible next legal steps

### Record and Background Check Tools
- **Record Clearance Eligibility Screener** (`/support/reputation/eligibility`) — 4-step decision tree; no AI, no data stored; runs entirely in the browser
- **FCRA Rights Guide** — adverse action notice requirements, 7-year lookback rule, how to dispute background check errors
- **Rap Sheet Error Identification** — missing dispositions, improperly unsealed records, unrecorded warrant vacaturs; how to request FBI and state records and submit corrections
- **Certificates of Relief** — available in approximately 20 states; lifts specific legal barriers without erasing the record
- **Clean Slate Automatic Clearance** — 8 states with active programs; eligibility and how to check status
- **Public Defender Intake Form** (`/support/court-logistics/intake-form`) — printable background information form; no data collection

### Comprehensive Legal Database
- **7,155 Criminal Charges** with statute citations across all 56 U.S. jurisdictions (50 states, DC, and territories)
- **5,956 State Statutes** with citation links to all 51 state legislature websites
- **111 Diversion Programs** covering all 50 states, DC, and Federal programs
- **Complete Federal Criminal Code** via GovInfo API (Title 18 USC)
- **Live Statute Retrieval** via OpenLaws API across 53 jurisdictions

### Site-Wide Search
- Indexes legal documents, site pages, and resource sections across charges, statutes, glossary terms, diversion programs, and all resource pages
- Legal synonym expansion and weighted relevance scoring
- Fully multilingual (EN / ES / ZH)

### Site Directory and Navigation
`/directory` — curated index of all five main paths and every site page, with quick-jump navigation.
`/how-to` — detailed explainer of the five paths with example journeys and the Friends & Family path.

### Attorney Portal — Document Generation
Verified attorneys access 37 motion templates across criminal and immigration defense:

**Criminal motions** — Suppress, Dismiss, Continue, Discovery, Compel Discovery, Bail Reduction, Pretrial Release, Bail Pending Appeal, In Limine, Mistrial, New Trial, Judgment of Acquittal, Sever, Withdraw Plea, Change of Venue, Speedy Trial Demand, Sentence Modification, Competency Evaluation, Habeas Corpus Petition, Sentencing Memorandum, Exclude Expert

**EOIR immigration motions** — NTA Pleadings, Continuance, Bond, Change of Venue, Reopen, Terminate, Reconsider, Stay of Removal, Suppress (Immigration), Voluntary Departure, Late Filing, Administrative Close, Notice of Appeal (BIA), Withholding of Removal / CAT

- Word (.docx) export with jurisdiction-specific formatting
- 60-minute secure sessions with automatic cleanup
- PII never sent to AI — only case metadata

### Attorney Playbooks
Stage-by-stage strategic roadmaps for criminal and immigration defense, from investigation through appeal.

### Public API v1
A public REST API (`/api/v1/`) for third-party integration:
- Read-only access to charges, statutes, diversion programs, and glossary
- Embeddable widgets
- OpenAPI specification with interactive docs at `/api-docs`
- CORS enabled with rate limiting

---

## Getting Started

### For Users

Visit the live platform — no account required:
- Case Roadmap — information calibrated to your charge type, state, and case stage
- Know Your Rights and case timeline
- First 24 Hours guide and pretrial release toolkit
- Life support resources (housing, employment, finances, mental health and treatment, and more)
- Court records and case law search
- Criminal charge database with statute links
- Attorney and legal aid locator (ZIP code-based)
- Document summarizer
- Record clearing eligibility screener and background check rights guide

### For Developers

**Prerequisites**
- Node.js 18+
- PostgreSQL database

**Environment Variables**

| Variable | Service | Purpose | Required? |
|----------|---------|---------|-----------|
| `ANTHROPIC_API_KEY` | [Anthropic](https://console.anthropic.com/) | Case Roadmap via Claude Sonnet 4.6 | **Required** for AI features |
| `DATABASE_URL` | PostgreSQL | Database connection string | **Required** |
| `COURTLISTENER_API_TOKEN` | [CourtListener](https://www.courtlistener.com/help/api/) | Case law search and court records | Optional |
| `OPENLAWS_API_KEY` | [OpenLaws](https://openlaws.com/) | Live statute retrieval (53 jurisdictions) | Optional |
| `GOVINFO_API_KEY` | [GovInfo.gov](https://api.govinfo.gov/docs/) | Federal statutes (Title 18 USC) | Optional |
| `LEGISCAN_API_KEY` | [LegiScan](https://legiscan.com/legiscan) | Bill tracking for statute changes | Optional |

> The app runs with reduced features when optional keys are absent. The Case Roadmap and the rule-based fallback both work with just `ANTHROPIC_API_KEY` and `DATABASE_URL`.

**Installation**

```bash
# Clone the repository
git clone https://github.com/publicdefenderai-ai/OpenDefender.git
cd OpenDefender

# Install dependencies
npm install

# Configure environment variables
# Create a .env file with your values (see table above)

# Run database migrations
npm run db:push

# Start the development server
npm run dev
```

The app runs at `http://localhost:5000`.

---

## Architecture

```
├── client/                     # React 18 frontend (Vite + TypeScript)
│   ├── src/
│   │   ├── components/         # Reusable UI (shadcn/ui + Tailwind CSS)
│   │   │   ├── legal/          # Case Roadmap, chat, timeline, Q&A
│   │   │   ├── support/        # Life support resource page templates
│   │   │   ├── attorney/       # Attorney portal components
│   │   │   └── layout/         # Header, footer, navigation
│   │   ├── pages/              # Page-level components (Wouter routing)
│   │   │   ├── support/        # 11 life support resource pages
│   │   │   └── immigration/    # Immigration sub-pages
│   │   ├── hooks/              # Custom React hooks
│   │   ├── locales/
│   │   │   ├── en.ts           # English translations
│   │   │   ├── es.ts           # Spanish translations
│   │   │   └── zh.ts           # Chinese translations
│   │   └── i18n.ts             # Translation configuration (imports from locales/)
│   └── public/                 # Static assets, favicons, sitemap, robots.txt
├── server/                     # Express.js backend (TypeScript)
│   ├── routes.ts               # Main API endpoints
│   ├── routes-v1.ts            # Public API v1 endpoints
│   ├── services/               # Business logic
│   │   ├── attorney-docs/      # 37-template document generation engine
│   │   ├── claude-guidance.ts  # Claude Sonnet 4.6 Case Roadmap
│   │   ├── cost-tracker.ts     # AI spend monitoring
│   │   └── search-indexer.ts   # Site-wide multilingual search index
│   ├── data/                   # Curated seed data (statutes, programs)
│   └── middleware/             # Auth, rate limiting, PII redaction
├── shared/                     # Code shared between client and server
│   ├── criminal-charges.ts     # 7,155 charges across 56 jurisdictions
│   ├── schema.ts               # Drizzle ORM database schema
│   ├── playbooks/              # Attorney playbook content
│   ├── templates/              # Document template definitions
│   └── attorney/               # Attorney types and schemas
├── scripts/
│   ├── content-review/         # Quarterly AI-powered content accuracy review
│   ├── data-review/            # Data quality and audit tooling
│   ├── check-diversion-programs.ts  # Link validation for all 111 diversion programs
│   └── post-merge.sh           # Post-merge setup (npm install + db:push)
├── docs/                       # Technical design documents
└── .github/workflows/          # Quarterly content review CI
```

---

## Automated Content Review & Accuracy Audits

A quarterly GitHub Actions workflow (`.github/workflows/quarterly-content-review.yml`) uses Claude to scan user-facing content for accuracy and currency. It runs on January 1, April 1, July 1, and October 1, and can also be triggered manually from the Actions tab.

### Monthly Accuracy Audits

OpenDefender conducts automated monthly accuracy audits to verify:
- Resource URLs (legal aid orgs, courts, government services)
- Contact information (addresses, phone numbers, hours, eligibility)
- Statute citations and content accuracy
- External resource descriptions and relevance

**Audit Rotation:**
- **Month 1, 4, 7, 10**: Employment & Finances
- **Month 2, 5, 8, 11**: Housing & Transportation
- **Month 3, 6, 9, 12**: Mental Health, Childcare & Other Categories

**Audit Process:** Monthly GitHub Issues are automatically created in a private companion repository to track findings and remediation.

### Privacy Impact Assessments (PIAs)

Any PR that adds data collection, third-party integrations, or modifies user-facing data handling automatically triggers a Privacy Impact Assessment requirement. PIAs are tracked in the private audits repository and must be completed before merge.

---

## License

This project uses a dual-license structure:

- **Code** (MIT License): All source code is free to use, modify, and distribute. See [LICENSE](LICENSE).
- **Content** (CC0 1.0 Universal): All non-code content — legal information, educational materials, translations — is released to the public domain. See [LICENSE-CONTENT](LICENSE-CONTENT).

The CC0 license for content is intentional: it maximizes adoption for access-to-justice initiatives so that other legal aid organizations can incorporate this material without restriction.

### Trademark notice

The CC0 dedication does **not** apply to the "OpenDefender" name or associated logos. Those are trademarks and are not included in the public domain dedication. You are free to use, adapt, and redistribute the content and code, but please do not use the OpenDefender name or logo in a way that implies your project is officially affiliated with or endorsed by this project.

### No endorsement

Using or redistributing this project's content or code does not imply endorsement by OpenDefender or its contributors. Please do not represent your use of this material as officially affiliated with, sponsored by, or backed by OpenDefender.

---

## Contributing

Contributions are welcome. Areas where help is especially valuable:

- **Translations**: Improving or expanding EN/ES/ZH translations in `client/src/locales/en.ts`, `es.ts`, and `zh.ts`
- **Charge data**: Adding or correcting statute citations in `shared/criminal-charges.ts`
- **Diversion programs**: Updating program availability in `client/src/lib/diversion-programs-data.ts`
- **Document templates**: Adding new motion templates in `server/services/attorney-docs/`
- **Accessibility**: WCAG 2.1 AA improvements across the UI

Please open an issue before submitting a large pull request.

---

**Not legal advice.** This platform provides general legal information only. Using this site or code does not create an attorney-client relationship. For advice specific to your situation, consult a qualified attorney. See [full disclaimers](https://opendefender.io/disclaimers).
