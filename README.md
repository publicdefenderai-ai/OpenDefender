# OpenDefender

**Expanding access to justice through AI-powered legal guidance and resources.**

OpenDefender is a free, open-source platform that helps people understand and navigate the U.S. criminal justice and immigration systems. Think of it as a public defender in your pocket — available 24/7, in plain language, at no cost.

🌐 **Live Platform**: [opendefender.replit.app](https://opendefender.replit.app/)

---

## Mission

To democratize access to legal information and resources, particularly for individuals without immediate legal representation. OpenDefender provides simplified, accessible legal guidance written at a 6th–8th grade reading level with full trilingual support (English / Spanish / Chinese).

---

## Key Features

### Comprehensive Legal Database
- **6,496 Criminal Charges** with statute citations across all 56 U.S. jurisdictions (50 states, DC, and territories)
- **5,956 State Statutes** with citation links to all 51 state legislature websites
- **73 Diversion Programs** covering major U.S. metropolitan areas
- **Complete Federal Criminal Code** via GovInfo API (Title 18 USC)
- **Live Statute Retrieval** via OpenLaws API across 53 jurisdictions

### AI-Powered Case Guidance
- **Claude Sonnet 4** for personalized, jurisdiction-aware case guidance
- **Dual-mode engine**: AI for complex situations, rule-based fallback for reliability
- **Privacy-first**: All case data is session-based and expires after 1 hour
- **NLP-based PII redaction** before any data reaches the AI

### Site-Wide Search
- Indexes **6,670+ legal documents** across charges, statutes, glossary terms, diversion programs, and all site pages
- Legal synonym expansion and weighted relevance scoring
- Fully multilingual (EN / ES / ZH)

### Rights & Education
- **Interactive 7-stage Case Timeline** — from arrest through appeal, in 3 languages
- **Quick-Reference Cards** — printable rights cards for police encounters and court stages
- **Mock Q&A Practice** — static Q&A library plus AI-generated personalized practice questions
- **Legal Glossary** — plain-language definitions with search
- **Search & Seizure Guide** — Fourth Amendment rights across common scenarios
- **First 24 Hours Guide** and **Jail Phone Call Guide**

### Life Support Resources Hub
11 dedicated resource pages covering real-life challenges alongside a criminal case:

> Employment · Finances · Housing · Transportation · Childcare · Court Logistics · Reputation · Immigration · Mental Health · Personal Health · Family Care

Each page includes actionable steps, vetted external resources, FAQs, and national organizations including [Partners for Justice](https://www.partnersforjustice.org/).

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
- Case guidance and AI legal chat
- Know Your Rights and case timeline
- Court records and case law search
- Criminal charge database with statute links
- Attorney and legal aid locator (ZIP code-based)
- Document summarizer
- Life support resources hub

### For Developers

**Prerequisites**
- Node.js 18+
- PostgreSQL database

**Environment Variables**

| Variable | Service | Purpose | Required? |
|----------|---------|---------|-----------|
| `ANTHROPIC_API_KEY` | [Anthropic](https://console.anthropic.com/) | AI guidance via Claude Sonnet 4 | **Required** for AI features |
| `DATABASE_URL` | PostgreSQL | Database connection string | **Required** |
| `COURTLISTENER_API_TOKEN` | [CourtListener](https://www.courtlistener.com/help/api/) | Case law search and court records | Optional |
| `OPENLAWS_API_KEY` | [OpenLaws](https://openlaws.com/) | Live statute retrieval (53 jurisdictions) | Optional |
| `GOVINFO_API_KEY` | [GovInfo.gov](https://api.govinfo.gov/docs/) | Federal statutes (Title 18 USC) | Optional |
| `LEGISCAN_API_KEY` | [LegiScan](https://legiscan.com/legiscan) | Bill tracking for statute changes | Optional |

> The app runs with reduced features when optional keys are absent. AI guidance and the rule-based fallback both work with just `ANTHROPIC_API_KEY` and `DATABASE_URL`.

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
│   │   │   ├── legal/          # Case guidance, chat, timeline, Q&A
│   │   │   ├── support/        # Life support resource page templates
│   │   │   ├── attorney/       # Attorney portal components
│   │   │   └── layout/         # Header, footer, navigation
│   │   ├── pages/              # Page-level components (Wouter routing)
│   │   │   └── support/        # 11 life support resource pages
│   │   ├── hooks/              # Custom React hooks
│   │   └── i18n.ts             # Trilingual translations (EN / ES / ZH)
│   └── public/                 # Static assets, favicons, sitemap, robots.txt
├── server/                     # Express.js backend (TypeScript)
│   ├── routes.ts               # Main API endpoints
│   ├── routes-v1.ts            # Public API v1 endpoints
│   ├── services/               # Business logic
│   │   ├── attorney-docs/      # 37-template document generation engine
│   │   ├── ai-guidance.ts      # Claude + rule-based hybrid guidance
│   │   ├── cost-tracker.ts     # AI spend monitoring
│   │   └── search/             # Site-wide multilingual search index
│   ├── data/                   # Curated seed data (statutes, programs)
│   └── middleware/             # Auth, rate limiting, PII redaction
├── shared/                     # Code shared between client and server
│   ├── criminal-charges.ts     # 6,496 charges across 56 jurisdictions
│   ├── schema.ts               # Drizzle ORM database schema
│   ├── playbooks/              # Attorney playbook content
│   ├── templates/              # Document template definitions
│   └── attorney/               # Attorney types and schemas
├── scripts/
│   └── content-review/         # Quarterly AI-powered content accuracy review
├── docs/                       # Technical design documents
└── .github/workflows/          # Quarterly content review CI
```

---

## Automated Content Review

A quarterly GitHub Actions workflow (`.github/workflows/quarterly-content-review.yml`) uses Claude to scan user-facing content for accuracy and currency. It runs on January 1, April 1, July 1, and October 1, and can also be triggered manually from the Actions tab.

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

- **Translations**: Improving or expanding EN/ES/ZH translations in `client/src/i18n.ts`
- **Charge data**: Adding or correcting statute citations in `shared/criminal-charges.ts`
- **Diversion programs**: Updating program availability in `server/data/`
- **Document templates**: Adding new motion templates in `server/services/attorney-docs/`
- **Accessibility**: WCAG 2.1 AA improvements across the UI

Please open an issue before submitting a large pull request.

---

**Not legal advice.** This platform provides general legal information only. Using this site or code does not create an attorney-client relationship. For advice specific to your situation, consult a qualified attorney. See [full disclaimers](https://opendefender.io/disclaimers).
