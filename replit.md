# Public Defender AI - Legal Guidance Platform

## Overview
Public Defender AI is a web application that provides accessible, AI-powered legal guidance and rights information. It offers case law search, legal resource databases, and connects users with legal aid organizations. The platform's core purpose is to democratize access to legal information, simplifying complex legal concepts for a broad audience, while prioritizing user privacy through data ephemerality.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions
The frontend is built with React 18, TypeScript, shadcn/ui, Wouter for routing, and Tailwind CSS. It features a custom legal-themed design, Framer Motion animations, and bilingual support (English/Spanish). All user-facing text is designed for a 6th-8th grade reading level, and the application is mobile-responsive. State management uses TanStack Query and React hooks. Key UI/UX enhancements include sophisticated color palettes, breadcrumb navigation, smooth page transitions, keyboard shortcuts, and mobile-first features like bottom navigation, click-to-call, and share functionality. Progressive loading techniques are used for optimized content delivery.

### Accessibility (WCAG 2.1 Compliance)
Automated accessibility audits using Lighthouse achieved scores of 94-100% across key pages:
- **Button accessibility**: All interactive buttons have aria-labels for screen readers
- **Color contrast**: Footer text uses gray-200 on slate-600 for 4.5:1+ contrast ratio
- **Viewport scaling**: Meta viewport allows user zoom (no maximum-scale restriction)
- **Icon accessibility**: Decorative icons use aria-hidden="true", icon-only links have aria-labels
- **Bilingual aria-labels**: Chat launcher button has translated labels (EN: "Open legal guidance chat", ES: "Abrir chat de orientación legal")

Remaining minor items (heading order optimization) documented for future enhancement.

### Technical Implementations
The backend uses Express.js and TypeScript, providing a RESTful API. Drizzle ORM with PostgreSQL handles type-safe database operations. A dual-mode AI guidance system intelligently selects between Anthropic's Claude AI and a rule-based engine, incorporating robust error handling and fallbacks.

A comprehensive privacy architecture ensures data protection through transport encryption (HTTPS), encryption at rest (Google Cloud SQL), session-based ephemerality (memory-only legal case data, auto-expires after 24 hours or server restart), and PII protection (NLP-based redaction with local ML and regex). Anonymous consent tracking is also implemented.

A multi-tier validation system ensures legal accuracy: Tier 1 validates statutory citations and penalty ranges, and Tier 2 validates case law using CourtListener's semantic search API with enhanced query techniques. A user feedback system allows rating case helpfulness.

The platform integrates various legal data sources for criminal charges, diversion programs, and statutes (federal and state), with a "free-first" search strategy for court records.

### Site-Wide Search Feature
A comprehensive search system indexes 4,275+ documents for instant, bilingual legal content discovery:
- **Search Index** (`server/services/search-indexer.ts`): Aggregates glossary terms (30), criminal charges (4,144), diversion programs (73), expungement rules (7), mock Q&A items (16), and rights info pages (5)
- **Legal Synonym Expansion** (`shared/search-types.ts`): Expands queries using legal aliases (e.g., "DUI" → "DWI", "OUI"; "bail" → "bond")
- **Relevance Scoring**: Weighted scoring based on title matches, alias matches, tag matches, and content frequency
- **UI Component** (`client/src/components/search/site-search.tsx`): Modal with debounced search, type badges, keyboard shortcuts (Cmd/Ctrl+K), and bilingual support
- **API Endpoints**: GET `/api/site-search` with query, language, filters; GET `/api/site-search/stats` for index statistics

### Mock Q&A Practice Feature
A dual-layer Mock Q&A system helps users prepare for court proceedings:
- **Static Library** (`shared/mock-qa.ts`): 17 bilingual generic Q&A items covering 6 proceeding types (arraignment, bail hearing, pretrial, plea, trial, sentencing) with translations in `i18n.ts`
- **AI-Generated Personalized Q&A**: Claude generates fact-specific practice questions tailored to user's case details, charges, and circumstances
- **UI Component** (`MockQASection`): Collapsible Q&A items with suggested responses and explanations, integrated into `/process` page and guidance dashboard

### Attorney Portal - Document Generation
The Attorney Portal (`/attorney`) provides verified attorneys with jurisdiction-specific document generation tools. Templates are registered in `server/services/attorney-docs/document-generator.ts` and follow the `DocumentTemplate` interface from `shared/templates/schema.ts`.

**Criminal Motion Templates** (All 50 States + DC, state + federal court variants):
| Template | File | Difficulty |
|----------|------|------------|
| Motion to Continue | `shared/templates/motion-to-continue.ts` | Basic |
| Motion to Suppress Evidence | `shared/templates/motion-to-suppress.ts` | Advanced |
| Motion to Reduce Bail | `shared/templates/motion-to-reduce-bail.ts` | Intermediate |
| Motion to Dismiss | `shared/templates/motion-to-dismiss.ts` | Intermediate |
| Motion for Discovery / Brady Motion | `shared/templates/motion-for-discovery.ts` | Intermediate |
| Motion for Pretrial Release | `shared/templates/motion-for-pretrial-release.ts` | Intermediate |
| Motion in Limine | `shared/templates/motion-in-limine.ts` | Intermediate |

**Immigration Templates** (EOIR format, nationally uniform):
| Template | File | Difficulty |
|----------|------|------------|
| Notice of Appearance | `shared/templates/notice-of-appearance.ts` | Basic |
| Written Pleadings to NTA | `shared/templates/nta-pleadings.ts` | Intermediate |
| Motion for Continuance | `shared/templates/motion-for-continuance-eoir.ts` | Basic |
| Motion for Bond Redetermination | `shared/templates/bond-motion-eoir.ts` | Intermediate |
| Motion to Change Venue | `shared/templates/motion-to-change-venue-eoir.ts` | Basic |
| Motion to Reopen | `shared/templates/motion-to-reopen-eoir.ts` | Intermediate |

**Coverage**: 143 total jurisdictions (51 state/territory + 92 federal districts) for criminal templates. Immigration templates use EOIR national format.

### API Architecture
The API provides endpoints for legal resources, court information, AI-powered legal guidance, detailed docket information, and comprehensive search capabilities. It also includes intelligent attorney matching based on proximity and specific legal service needs.

### Public API v1 (Third-Party Integration)
A public REST API (`/api/v1/`) enables third-party developers and legal aid organizations to integrate Public Defender AI's data into their own applications:
- **OpenAPI Specification**: Available at `/api/v1/openapi.json` for machine-readable API documentation
- **API Documentation Page**: Interactive docs at `/api-docs` with endpoint details, parameters, and examples
- **CORS Enabled**: Cross-origin requests allowed for all v1 endpoints
- **Rate Limiting**: 60 requests/minute per IP for fair use

**Public Endpoints (Read-Only, No Auth Required)**:
| Endpoint | Description |
|----------|-------------|
| GET `/api/v1/search?q={query}` | Full-text search across all legal content |
| GET `/api/v1/charges` | List criminal charges (4,144 across 51 jurisdictions) |
| GET `/api/v1/charges/:id` | Get specific charge details |
| GET `/api/v1/diversion-programs` | List diversion programs (73 programs) |
| GET `/api/v1/glossary` | List legal terms (30 terms) |
| GET `/api/v1/expungement-rules` | List expungement eligibility rules |
| GET `/api/v1/export/charges?format=csv` | Bulk export charges as CSV/JSON |
| GET `/api/v1/export/diversion-programs?format=csv` | Bulk export programs as CSV/JSON |
| GET `/api/v1/stats` | Get index statistics |
| GET `/api/v1/schemas` | List available JSON schemas |
| GET `/api/v1/schemas/:name` | Get specific JSON schema |

**Embeddable Widgets** (iframe-based embedding for third-party websites):
| Route | Description |
|-------|-------------|
| `/embed/search` | Embeddable search bar widget |
| `/embed/rights` | "Know Your Rights" card widget |
| `/embed/glossary` | Legal glossary widget |

Query parameters: `theme` (light/dark), `lang` (en/es), `variant` (full/compact/mini for rights), `compact` (true/false for search)

**Security Notes**: AI-powered guidance endpoints remain private (no third-party access) to prevent API cost abuse and legal liability concerns.

### System Design Choices
Session-based authentication with PostgreSQL session storage is configured for automatic expiration. Vite is used for frontend development, and ESBuild for server bundling. Drizzle Kit manages database migrations. Automated data quality assurance runs on server startup to validate criminal charge codes against verified statute citations.

## External Dependencies

### Database
-   **PostgreSQL**: Primary database (Neon serverless).
-   **Drizzle ORM**: Type-safe database management.

### Legal Data Sources

#### Case Law & Court Records
-   **CourtListener API**: 18M+ legal opinions, court data, case law with AI-powered semantic search.
-   **RECAP Archive**: Federal court documents (free PACER access).
-   **PACER Fetch API**: On-demand access to federal court documents (fallback).

#### Statutes & Laws
-   **GovInfo.gov API**: Complete federal criminal statutes (Title 18 USC). Free government API.
-   **OpenLaws API**: Live statute retrieval across 53 jurisdictions (50 states + DC + PR + Federal). Supports citation-based lookup with 4.3M+ sections.
-   **Curated Seed Data**: 1,385+ verified statutes across all 51 jurisdictions (50 states + DC) for offline/fast access.
-   **LegiScan API**: Bill tracking for quarterly statute change monitoring.

#### Rights Information & Legal Resources
-   **Legal Services Corporation (LSC)**: Civil legal aid organizations nationwide.
-   **EOIR.gov**: Immigration legal service providers.
-   **Bureau of Justice Statistics (BJS) API**: Crime statistics and sentencing data.
-   **Center for Health and Justice**: Diversion program research.
-   **NDAA Diversion Programs Directory**: Reference for diversion programs.

### AI and Machine Learning
-   **Anthropic Claude API**: AI-powered legal guidance generation using Claude Sonnet 4.
-   **Legal Accuracy Validator (Tier 1)**: Validates AI guidance against statutory citations and penalty ranges.
-   **Case Law Validator (Tier 2)**: Cross-references guidance with CourtListener's semantic search.
-   **Rule-Based Fallback Engine**: Provides guidance when AI is unavailable.

### Third-Party Services
-   **Neon Database**: Serverless PostgreSQL hosting.
-   **OpenStreetMap/Nominatim**: Geocoding and location-based search.

### Data Coverage Summary
| Category | Count | Source |
|----------|-------|--------|
| Criminal Charges | 4,146 | All 50 states + DC + Federal |
| State Statutes | 1,385+ | Seed data (51 jurisdictions) |
| Live Statutes | 4.3M+ | OpenLaws API (53 jurisdictions) |
| Federal Statutes | Complete | GovInfo API (Title 18 USC) |
| Diversion Programs | 73 | Major U.S. metros |
| Legal Aid Orgs | 153 | Public defenders, immigration, civil |

## Future Enhancements

### Planned Features
- **Accessibility Statement Page**: Create a dedicated page describing WCAG 2.1 AA compliance, accessibility features (keyboard navigation, screen reader support, bilingual aria-labels), and how users can report accessibility issues
- **Heading Order Optimization**: Minor accessibility improvement to ensure proper heading hierarchy across all pages