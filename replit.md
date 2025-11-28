# Public Defender AI - Legal Guidance Platform

## Overview

Public Defender AI is a web application providing accessible, AI-powered legal guidance and rights information. It offers case law search, legal resource databases, and connects users with legal aid organizations. The platform is built with privacy-first principles, ensuring user data is ephemeral and not permanently stored. Key capabilities include AI-powered legal assistance, access to court records, and a comprehensive database of criminal charges, statutes, and diversion programs. The project aims to empower individuals without immediate legal representation by democratizing access to legal information, particularly focusing on simplified language for users with limited legal background.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend uses React 18 with TypeScript, Wouter for routing, and shadcn/ui components built on Radix UI primitives. Styling is managed with Tailwind CSS, incorporating a custom legal-themed design system. Framer Motion provides animations. State management employs TanStack Query for server state and React hooks for local state. The application supports light/dark modes and is optimized for mobile responsiveness across all features. It features complete bilingual support (English/Spanish) with internationalization (i18n) using `react-i18next`, ensuring all 13 pages, interactive modals, and navigation menus are fully translated. All user-facing text is designed for a 6th-8th grade reading level.

**Recent UI Updates (Nov 2025)**: The /case-guidance page has been streamlined by removing the "What You'll Receive" section. This content has been preserved in an internal FAQ outline (docs/faq-outline.md) for potential future use in a dedicated FAQ page. The page now flows directly from "How It Works" to "Privacy & Security" sections, creating a more focused user experience.

### Backend Architecture

The backend is built with Express.js and TypeScript, providing a RESTful API. It includes custom middleware for logging and error handling. Drizzle ORM with PostgreSQL is used for type-safe database operations. Legal case data is designed to be ephemeral and automatically expires to ensure user privacy. The server provides endpoints for legal resources, court data, case law search, AI legal guidance, court records search, and legal aid organizations, including location-based searches for public defenders.

**AI Legal Guidance Engine**: The platform features a dual-mode guidance system that intelligently selects between Claude AI (Anthropic) and a rule-based engine. When users provide detailed incident descriptions or specific concerns, Claude Sonnet 4 (May 2025) generates personalized, context-aware legal guidance using advanced natural language processing. The system includes automatic retry logic with enforced 65-second timeouts using Promise.race() wrappers, ensuring reliable timeout handling even when SDK timeouts fail. It automatically retries once on timeout or API overload (529 errors) and falls back to the rule-based engine if both attempts fail, ensuring consistent service delivery without UI freezing. All AI interactions include usage tracking (input/output tokens, cost estimation) logged server-side for transparency and cost monitoring. Uses direct Anthropic API connection (https://api.anthropic.com) with user-provided API key for maximum reliability.

**PII Protection (Nov 2025)**: All user input is automatically scrubbed of Personally Identifiable Information (PII) before being sent to Claude AI. The redaction system (`server/services/pii-redactor.ts`) uses a hybrid regex-based approach that balances privacy protection with legal context preservation. **High-confidence redaction** includes: email addresses, phone numbers, SSN/government IDs, credit cards, account numbers, physical addresses, birthdates, driver's licenses, and passports. **Context-based name redaction** catches explicit disclosures ("my name is X", "I am X", "Officer/Judge/Dr. X") while preserving institutional references ("State of California", "District Attorney's Office"). The system uses `@redactpii/node` with custom patterns, category-aware placeholders (`[REDACTED_EMAIL]`, `[REDACTED_PHONE]`, etc.), and protects against over-redaction of legal terms. Redaction occurs before cache key generation and API calls. Logs aggregate counts for observability. **Documented limitations**: Names in free-form narrative may not be caught to preserve legal context - a deliberate trade-off between comprehensive PII removal and preserving actionable legal guidance. Users are advised to avoid full names and use pronouns. Future enhancement: Microsoft Presidio or NER-based solution for production-grade name detection. Can be disabled via `DISABLE_PII_REDACTION=true` for development.

### Data Sources and Integrations

The system integrates with various legal data sources to provide comprehensive information. This includes a robust database of legal aid organizations (153 total: 123 public defender offices [95 federal, 28 state/county], 12 immigration, 18 civil legal aid), a comprehensive criminal charges database, a database of diversion programs (73 programs across major US metropolitan areas), and an extensive criminal statutes database (federal and state). A "free-first" search strategy is implemented for court records, prioritizing RECAP Archive before suggesting paid PACER access. User session data is automatically deleted post-session, and no personal identifying information is permanently stored. The statute integration employs a pragmatic multi-source approach:
1.  **Primary - Federal**: GovInfo API (✅ ACTIVE) for Title 18 USC federal criminal statutes - complete coverage.
2.  **Primary - State**: Curated seed data (200 statutes, 10 states) - ✅ operational, high-quality manually verified statutes covering the 20 most common criminal charges per state.
3.  **OpenLaws API** (✅ ACTIVE - Nov 2025): API key obtained and integrated. Provides access to 53 jurisdictions (50 states + DC + Puerto Rico + Federal). Base URL: `https://api.openlaws.us/api/v1`. Authentication via Bearer token. Client service at `server/services/openlaws-client.ts`.
4.  **Monitoring**: LegiScan API for quarterly statute change detection.

**Current Status (Nov 2025)**: OpenLaws API is now active with confirmed access to all 53 US jurisdictions. The current API tier provides jurisdiction listing and law metadata endpoints. Citation lookup and full-text search may require enterprise tier access. Current working solution: GovInfo federal coverage + **200 manually curated high-quality statutes** for top 10 states (CA, TX, FL, NY, PA, IL, OH, GA, NC, MI) with 20 statutes each covering assault, theft, burglary, robbery, drug offenses, DUI, domestic violence, weapons, fraud, and other common charges based on FBI UCR 2024 data. OpenLaws integration can be expanded as additional API access is granted.

### API Architecture

The API includes endpoints for:
-   Legal resources (filtered by jurisdiction/category)
-   Court information by jurisdiction
-   Case law search (keyword and **semantic search modes**)
-   Court records search (RECAP Archive and case law database with semantic search support)
-   Semantic case law search (natural language queries)
-   Hybrid search (combines keywords with semantic understanding)
-   Detailed docket information by ID
-   Legal aid organization data with filtering
-   Federal criminal statutes (Title 18 USC)
-   State criminal statutes by state code
-   AI-generated legal guidance based on user input.

### Authentication and Session Management

Session-based authentication is used with a PostgreSQL session store, configured for automatic expiration to uphold privacy principles.

### Build and Deployment

Vite is used for frontend development and client-side production optimization. ESBuild bundles the server for production. Drizzle Kit handles database schema migrations.

## External Dependencies

### Database
-   **PostgreSQL**: Primary database (Neon serverless PostgreSQL).
-   **Drizzle ORM**: Type-safe database management.
-   **connect-pg-simple**: PostgreSQL session store.

### Legal Data Sources
-   **CourtListener API**: Legal opinions, court data, case law with **AI-Powered Semantic Search** (Nov 2025) - Natural language search that understands meaning and intent beyond keyword matching.
-   **RECAP Archive**: Federal court documents.
-   **PACER Fetch API**: On-demand access to PACER documents (fallback).
-   **GovInfo.gov API**: Federal criminal statutes (Title 18 USC).
-   **OpenLaws API** (✅ ACTIVE): All 53 jurisdictions (50 states + DC + Puerto Rico + Federal) statute/regulation metadata. API key configured.
-   **LegiScan API**: Quarterly statute change monitoring.
-   **Bureau of Justice Statistics (BJS) API** (⚠️ IN PROGRESS): NCVS (National Crime Victimization Survey) and NIBRS (National Incident-Based Reporting System) for crime statistics. **Current Status**: Infrastructure implemented but requires critical fixes before production use: (1) Separate person-level and household-level weighting to avoid mixing incompatible units, (2) Implement pagination (currently capped at 100k records, causing data truncation), (3) Validate totals reconcile with category breakdowns. See `server/services/bjs-statistics.ts` and `shared/bjs-code-mappings.ts`.
-   **Cornell Legal Information Institute**: Legal statutes reference.
-   **EOIR.gov**: Immigration legal service providers.
-   **Legal Services Corporation (LSC)**: Civil legal aid organizations.
-   **Center for Health and Justice**: Diversion program research.
-   **NDAA Diversion Programs Directory**: Reference for diversion programs.
-   **State and Local Court Systems**: Direct research from court websites and district attorney offices.

### UI and Styling
-   **shadcn/ui**: Component library.
-   **Tailwind CSS**: Utility-first CSS framework.
-   **Framer Motion**: Animations.
-   **React Hook Form**: Form management.

### Development and Build Tools
-   **Vite**: Development server and build tool.
-   **TypeScript**: Type safety.
-   **ESBuild**: Fast JavaScript bundler.
-   **react-i18next**: Internationalization.

### AI and Machine Learning
-   **Anthropic Claude API**: AI-powered legal guidance generation using Claude Sonnet 4.5.
-   **Cost Tracking**: Server-side monitoring of API usage (tokens and costs).

### Third-Party Services
-   **Neon Database**: Serverless PostgreSQL hosting.
-   **CourtListener**: Legal case database and API.
-   **OpenStreetMap/Nominatim**: Geocoding and location-based search.