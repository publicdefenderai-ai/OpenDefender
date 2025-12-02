# Public Defender AI - Legal Guidance Platform

## Overview

Public Defender AI is a web application providing accessible, AI-powered legal guidance and rights information. It offers case law search, legal resource databases, and connects users with legal aid organizations. The platform prioritizes user privacy by ensuring data ephemerality. Its core purpose is to democratize access to legal information for individuals without immediate legal representation, simplifying complex legal concepts for a broad audience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions

The frontend is built with React 18 and TypeScript, utilizing shadcn/ui components, Wouter for routing, and Tailwind CSS for styling. It features a custom legal-themed design, Framer Motion for animations, and comprehensive bilingual support (English/Spanish) with `react-i18next`. All user-facing text is designed for a 6th-8th grade reading level, and the application is mobile-responsive. State management uses TanStack Query and React hooks.

### Technical Implementations

The backend, developed with Express.js and TypeScript, provides a RESTful API. Drizzle ORM with PostgreSQL handles type-safe database operations, with legal case data designed to be ephemeral.

A dual-mode AI guidance system intelligently selects between Anthropic's Claude AI (Sonnet 4.5) and a rule-based engine. It includes robust error handling with retry logic and fallbacks to ensure continuous service. All AI interactions are cost-tracked. A critical PII redaction system (`server/services/pii-redactor.ts`) automatically scrubs user input before it reaches Claude AI, balancing privacy with the preservation of legal context. High-confidence PII is redacted with category-aware placeholders.

The platform integrates various legal data sources, including databases for legal aid organizations, criminal charges, diversion programs, and criminal statutes (federal and state). A "free-first" search strategy is used for court records, prioritizing RECAP Archive. User session data is automatically deleted post-session. Federal statutes are sourced from the GovInfo API, while state statutes are derived from a comprehensive, manually curated database with 50-state + DC coverage (963 unique statutes at ~92% coverage), including comprehensive homicide (221 statutes), burglary (107 statutes), and robbery (90 statutes) coverage for all 51 jurisdictions with direct links to official legislature websites.

### API Architecture

The API provides endpoints for legal resources, court information, AI-powered legal guidance, detailed docket information, and comprehensive search capabilities including keyword, semantic, and hybrid search for case law and court records.

### System Design Choices

Session-based authentication with PostgreSQL session storage is configured for automatic expiration to ensure privacy. Frontend development uses Vite, and the server is bundled with ESBuild for production. Drizzle Kit manages database migrations.

## External Dependencies

### Database
-   **PostgreSQL**: Primary database (Neon serverless).
-   **Drizzle ORM**: Type-safe database management.

### Legal Data Sources
-   **CourtListener API**: Legal opinions, court data, case law (includes AI-Powered Semantic Search).
-   **RECAP Archive**: Federal court documents.
-   **PACER Fetch API**: On-demand access to PACER documents (fallback).
-   **GovInfo.gov API**: Federal criminal statutes (Title 18 USC).
-   **OpenLaws API**: Provides metadata for 53 jurisdictions (no statute text in current tier).
-   **LegiScan API**: For quarterly statute change monitoring.
-   **Bureau of Justice Statistics (BJS) API**: For crime statistics (currently in progress).
-   **Cornell Legal Information Institute**: Legal statutes reference.
-   **EOIR.gov**: Immigration legal service providers.
-   **Legal Services Corporation (LSC)**: Civil legal aid organizations.
-   **Center for Health and Justice**: Diversion program research.
-   **NDAA Diversion Programs Directory**: Reference for diversion programs.

### AI and Machine Learning
-   **Anthropic Claude API**: AI-powered legal guidance generation using Claude Sonnet 4.5.

### Third-Party Services
-   **Neon Database**: Serverless PostgreSQL hosting.
-   **OpenStreetMap/Nominatim**: Geocoding and location-based search.