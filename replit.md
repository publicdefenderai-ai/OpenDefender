# Public Defender AI - Legal Guidance Platform

## Overview
Public Defender AI is a web application that democratizes access to legal information by providing AI-powered legal guidance, case law search, and connections to legal aid organizations. Its core purpose is to simplify complex legal concepts for a broad audience, ensuring user privacy through data ephemerality. The platform aims to make legal support more accessible and understandable for everyone.

## User Preferences
Preferred communication style: Simple, everyday language.

## Standing Rules — DO NOT VIOLATE
- **NEVER run charge validation scripts automatically.** The scripts `scripts/validate-charge-statute-consistency.ts`, `scripts/fix-charge-codes.ts`, `scripts/verify-new-charge-codes.ts`, `scripts/verify-remaining-jurisdictions.ts`, `scripts/spot-check-links.ts`, and `scripts/add-new-statute-seeds.ts` are **manual-only tools**. They must ONLY be run when the user explicitly asks for validation or statute code verification. Running them without being asked wastes significant platform resources.

## System Architecture

### UI/UX Decisions
The frontend is built with React 18, TypeScript, shadcn/ui, Wouter for routing, and Tailwind CSS. It features a legal-themed design, Framer Motion animations, and trilingual support (English/Spanish/Chinese). All user-facing text is designed for a 6th-8th grade reading level. The application is mobile-responsive with features like bottom navigation and click-to-call. Accessibility is a key focus, achieving high WCAG 2.1 compliance scores through elements like aria-labels, proper color contrast, and viewport scaling.

### Technical Implementations
The backend uses Express.js and TypeScript, exposing a RESTful API. Drizzle ORM with PostgreSQL manages database interactions. A dual-mode AI guidance system intelligently switches between Anthropic's Claude AI and a rule-based engine, with robust error handling. Data privacy is ensured through encryption, session-based ephemerality (legal case data expires after 24 hours or server restart), and NLP-based PII redaction. A multi-tier validation system ensures legal accuracy by validating statutory citations and case law using CourtListener's semantic search. The platform integrates various legal data sources for criminal charges (6,496 across 56 jurisdictions with 5,916 verified statute codes — 100% match rate for 51 state/DC jurisdictions, zero mismatches; 580 territory charges flagged separately), diversion programs, and statutes (5,956 records in PostgreSQL with citation links to all 51 state legislature websites). The 32 newly added charge types (failure-to-appear, probation violation, resisting arrest, open container, MIP, harassment/stalking, noise violation, indecent exposure, fake ID, contempt of court, and more) have been fully seeded with verified statute records. Full consistency validation confirms 5,916/5,916 state/DC charge-statute matches (100%, zero mismatches). URL spot-check expanded to cover all 32 new charge types: 123/123 citation links valid (100%). MA defective-vehicle-equipment code corrected to `90-7A` (final fix from full validation run). A TX Code of Criminal Procedure URL fix was applied for chapter-alphanumeric codes (e.g., 42A for community supervision). MA citation extractor updated to preserve chapter-section format (e.g., `265-13A`) preventing regression. Note: OpenLaws `searchByCitation` is unsuitable for batch verification (50 sub-calls per citation, unreliable results for valid statutes); URL spot-checks against official state legislature sites are the authoritative verification method.

### Site-Wide Search
A comprehensive, multilingual search system indexes 6,663 legal documents, including glossary terms, criminal charges, diversion programs, and all 38 site pages (including all 11 `/support/*` pages). It uses legal synonym expansion and weighted relevance scoring for accurate results.

### Visual Case Timeline
An interactive 7-stage criminal case timeline provides descriptions, rights, and tips for each stage of a criminal proceeding, available in English, Spanish, and Chinese.

### Quick-Reference Cards
Printable and saveable rights reference cards are available, covering police encounters and various court stages, with full multilingual support.

### Mock Q&A Practice Feature
A dual-layer system offers both a static library of generic Q&A items and AI-generated personalized practice questions tailored to a user's specific case details.

### Attorney Portal - Document Generation
The Attorney Portal provides verified attorneys with jurisdiction-specific document generation tools. It includes over 25 templates for various criminal motions (covering all 50 states + DC) and immigration motions (EOIR format).

### Public API v1
A public REST API (`/api/v1/`) allows third-party integration, offering read-only access to legal content, charges, and programs via endpoints and embeddable widgets. It provides an OpenAPI Specification and interactive documentation, with CORS enabled and rate limiting for fair use. AI-powered guidance endpoints remain private for security and liability reasons.

### System Design Choices
The application uses session-based authentication with PostgreSQL for session storage. Vite is used for frontend development and ESBuild for server bundling. Drizzle Kit manages database migrations. Charge validation scripts are manual-only tools (run via CLI on request) and do NOT run at server startup.

## External Dependencies

### Database
-   **PostgreSQL**: Primary database (Neon serverless).
-   **Drizzle ORM**: Type-safe database management.

### Legal Data Sources

#### Case Law & Court Records
-   **CourtListener API**: Legal opinions, court data, and semantic search.
-   **RECAP Archive**: Federal court documents.
-   **PACER Fetch API**: On-demand federal court documents (fallback).

#### Statutes & Laws
-   **GovInfo.gov API**: Federal criminal statutes (Title 18 USC).
-   **OpenLaws API**: Live statute retrieval across 53 jurisdictions.
-   **Curated Seed Data**: Verified statutes for offline access.
-   **LegiScan API**: Bill tracking for statute change monitoring.

#### Rights Information & Legal Resources
-   **Legal Services Corporation (LSC)**: Civil legal aid organizations.
-   **EOIR.gov**: Immigration legal service providers.
-   **Bureau of Justice Statistics (BJS) API**: Crime statistics.
-   **Center for Health and Justice**: Diversion program research.
-   **NDAA Diversion Programs Directory**: Diversion program reference.

### AI and Machine Learning
-   **Anthropic Claude API**: AI-powered legal guidance generation (Claude Sonnet 4).
-   **Legal Accuracy Validator (Tier 1 & 2)**: Validates AI guidance against statutes and case law.
-   **Rule-Based Fallback Engine**: Provides guidance when AI is unavailable.

### Third-Party Services
-   **Neon Database**: Serverless PostgreSQL hosting.
-   **OpenStreetMap/Nominatim**: Geocoding and location-based search.