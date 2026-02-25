# Public Defender AI - Legal Guidance Platform

## Overview
Public Defender AI is a web application that democratizes access to legal information by providing AI-powered legal guidance, case law search, and connections to legal aid organizations. Its core purpose is to simplify complex legal concepts for a broad audience, ensuring user privacy through data ephemerality. The platform aims to make legal support more accessible and understandable for everyone.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions
The frontend is built with React 18, TypeScript, shadcn/ui, Wouter for routing, and Tailwind CSS. It features a legal-themed design, Framer Motion animations, and trilingual support (English/Spanish/Chinese). All user-facing text is designed for a 6th-8th grade reading level. The application is mobile-responsive with features like bottom navigation and click-to-call. Accessibility is a key focus, achieving high WCAG 2.1 compliance scores through elements like aria-labels, proper color contrast, and viewport scaling.

### Technical Implementations
The backend uses Express.js and TypeScript, exposing a RESTful API. Drizzle ORM with PostgreSQL manages database interactions. A dual-mode AI guidance system intelligently switches between Anthropic's Claude AI and a rule-based engine, with robust error handling. Data privacy is ensured through encryption, session-based ephemerality (legal case data expires after 24 hours or server restart), and NLP-based PII redaction. A multi-tier validation system ensures legal accuracy by validating statutory citations and case law using CourtListener's semantic search. The platform integrates various legal data sources for criminal charges (6,496 across 56 jurisdictions with 5,916 verified statute codes — 91.1% coverage, zero mismatches), diversion programs, and statutes (5,956 records in PostgreSQL with citation links to all 51 state legislature websites).

### Site-Wide Search
A comprehensive, multilingual search system indexes over 6,600 legal documents, including glossary terms, criminal charges, and diversion programs. It uses legal synonym expansion and weighted relevance scoring for accurate results.

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
The application uses session-based authentication with PostgreSQL for session storage. Vite is used for frontend development and ESBuild for server bundling. Drizzle Kit manages database migrations, and automated data quality assurance runs on server startup.

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