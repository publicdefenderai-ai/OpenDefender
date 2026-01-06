# Public Defender AI - Legal Guidance Platform

## Overview
Public Defender AI is a web application that provides accessible, AI-powered legal guidance and rights information. It offers case law search, legal resource databases, and connects users with legal aid organizations. The platform's core purpose is to democratize access to legal information, simplifying complex legal concepts for a broad audience, while prioritizing user privacy through data ephemerality.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions
The frontend is built with React 18, TypeScript, shadcn/ui, Wouter for routing, and Tailwind CSS. It features a custom legal-themed design, Framer Motion animations, and bilingual support (English/Spanish). All user-facing text is designed for a 6th-8th grade reading level, and the application is mobile-responsive. State management uses TanStack Query and React hooks. Key UI/UX enhancements include sophisticated color palettes, breadcrumb navigation, smooth page transitions, keyboard shortcuts, and mobile-first features like bottom navigation, click-to-call, and share functionality. Progressive loading techniques are used for optimized content delivery.

### Technical Implementations
The backend uses Express.js and TypeScript, providing a RESTful API. Drizzle ORM with PostgreSQL handles type-safe database operations. A dual-mode AI guidance system intelligently selects between Anthropic's Claude AI and a rule-based engine, incorporating robust error handling and fallbacks.

A comprehensive privacy architecture ensures data protection through transport encryption (HTTPS), encryption at rest (Google Cloud SQL), session-based ephemerality (memory-only legal case data, auto-expires after 24 hours or server restart), and PII protection (NLP-based redaction with local ML and regex). Anonymous consent tracking is also implemented.

A multi-tier validation system ensures legal accuracy: Tier 1 validates statutory citations and penalty ranges, and Tier 2 validates case law using CourtListener's semantic search API with enhanced query techniques. A user feedback system allows rating case helpfulness.

The platform integrates various legal data sources for criminal charges, diversion programs, and statutes (federal and state), with a "free-first" search strategy for court records.

### API Architecture
The API provides endpoints for legal resources, court information, AI-powered legal guidance, detailed docket information, and comprehensive search capabilities. It also includes intelligent attorney matching based on proximity and specific legal service needs.

### System Design Choices
Session-based authentication with PostgreSQL session storage is configured for automatic expiration. Vite is used for frontend development, and ESBuild for server bundling. Drizzle Kit manages database migrations. Automated data quality assurance runs on server startup to validate criminal charge codes against verified statute citations.

## External Dependencies

### Database
-   **PostgreSQL**: Primary database (Neon serverless).
-   **Drizzle ORM**: Type-safe database management.

### Legal Data Sources
-   **CourtListener API**: Legal opinions, court data, case law (includes AI-Powered Semantic Search).
-   **RECAP Archive**: Federal court documents.
-   **PACER Fetch API**: On-demand access to PACER documents (fallback).
-   **GovInfo.gov API**: Federal criminal statutes (Title 18 USC).
-   **OpenLaws API**: For statute text retrieval across 53 jurisdictions.
-   **LegiScan API**: For quarterly statute change monitoring.
-   **Bureau of Justice Statistics (BJS) API**: For crime statistics.
-   **EOIR.gov**: Immigration legal service providers.
-   **Legal Services Corporation (LSC)**: Civil legal aid organizations.
-   **Center for Health and Justice**: Diversion program research.
-   **NDAA Diversion Programs Directory**: Reference for diversion programs.

### AI and Machine Learning
-   **Anthropic Claude API**: AI-powered legal guidance generation using Claude Sonnet 4.5.

### Third-Party Services
-   **Neon Database**: Serverless PostgreSQL hosting.
-   **OpenStreetMap/Nominatim**: Geocoding and location-based search.