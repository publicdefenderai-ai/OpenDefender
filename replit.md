# Public Defender AI - Legal Guidance Platform

## Recent Changes

- **Language Simplification Initiative (October 2025)**: Comprehensive site-wide effort to replace complex legal terminology with simple, accessible language for users with limited education, low English proficiency, or no legal background
  - Simplified guidance engine critical alerts and immediate actions: "Exercise right to remain silent" → "Stay silent - don't answer questions without a lawyer"
  - Updated all translation keys (English and Spanish) for urgent help modal, case guidance flow, and rights information
  - Simplified PDF generator user-facing text: "Legal Case Guidance" → "Your Legal Help Guide", "Jurisdiction" → "Your State"
  - Replaced complex terminology throughout:
    - "Assert rights" → "State your rights"
    - "Assessment" → "Get started"
    - "Precedent" → "Past court cases"
    - "Probable cause/Reasonable suspicion" → "Good reason"
    - "Exigent circumstances" → "Emergencies"
    - "Fourth/Fifth/Sixth Amendment" → "The law" with simplified explanations
    - "Constitutional rights" → "Legal rights"
    - "Due process" → "Fair legal process"
    - "Arraignment" → "First court appearance"
    - "Preliminary hearing" → "First hearing"
    - "Miranda rights" → "Your rights warning"
    - "Impartial jury" → "Fair, unbiased jury"
    - "Statutes" → "Laws"
  - All 13 pages and 750+ translation keys now use 6th-8th grade reading level language

## Overview

Public Defender AI is a web application providing accessible, AI-powered legal guidance and rights information. It offers case law search, legal resource databases, and connects users with legal aid organizations. The platform is built with privacy-first principles, ensuring user data is ephemeral and not permanently stored. Key capabilities include AI-powered legal assistance, access to court records, and a comprehensive database of criminal charges and diversion programs. The project aims to empower individuals without immediate legal representation by democratizing access to legal information.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend uses React 18 with TypeScript, Wouter for routing, and shadcn/ui components built on Radix UI primitives. Styling is managed with Tailwind CSS, incorporating a custom legal-themed design system. Framer Motion provides animations. State management employs TanStack Query for server state (caching, background updates) and React hooks for local state. The application supports light/dark modes and is optimized for mobile responsiveness across all features, including a mobile hamburger menu and adaptive display of content. It features complete bilingual support (English/Spanish) with internationalization (i18n) using `react-i18next` - all 13 pages, interactive modals, and navigation menus are fully translated to Spanish with 750+ translation keys covering the entire user interface including the Get Started menu, Legal Guidance modal, Court Locator information cards, and Development Roadmap mission section.

### Backend Architecture

The backend is built with Express.js and TypeScript, providing a RESTful API. It includes custom middleware for logging and error handling. Drizzle ORM with PostgreSQL is used for type-safe database operations. Legal case data is designed to be ephemeral and automatically expires to ensure user privacy. The server provides endpoints for legal resources, court data, case law search, AI legal guidance, court records search (RECAP/CourtListener), and legal aid organizations, including location-based searches for public defenders.

### Data Sources and Integrations

The system integrates with various legal data sources to provide comprehensive information. It includes a robust database of legal aid organizations with detailed contact and service information, and a comprehensive criminal charges database covering federal and state offenses across all 50 states and DC, cross-referenced with FindLaw categories. The diversion programs database now contains 73 programs across major US metropolitan areas, with comprehensive coverage of California (16 programs across 9 counties), New York (12 programs across 6 counties), Georgia (16 programs across 8 counties including the Atlanta metro area), and Illinois (4 programs across 3 counties including Chicago), plus programs in Texas, Florida, Pennsylvania, Washington, Colorado, Massachusetts, Tennessee, Oregon, North Carolina, Ohio, Delaware, and Wisconsin. Programs include drug courts, mental health courts (including SPMI diversion), veterans courts, pretrial diversion, deferred prosecution, harm reduction initiatives (LEAD/PATH model), accountability courts, and CARE courts, all with verified contact information, eligibility criteria, and program details sourced from the NDAA Prosecutor-Led Diversion Programs Directory, state court systems, district attorney offices, and solicitor-general offices. A "free-first" search strategy is implemented for court records, prioritizing RECAP Archive before suggesting paid PACER access. User session data is automatically deleted post-session, and no personal identifying information is permanently stored.

### API Architecture

The API includes endpoints for:
- `/api/legal-resources`: Retrieves resources filtered by jurisdiction/category.
- `/api/court-data/:jurisdiction`: Fetches court information.
- `/api/case-law/search`: Searches legal opinions and precedents.
- `/api/court-records/search`: Searches RECAP Archive and case law database.
- `/api/court-records/docket/:docketId`: Retrieves detailed docket information.
- `/api/legal-aid-organizations`: Provides legal aid organization data with filtering.
- AI-generated legal guidance based on user input.

### Authentication and Session Management

Session-based authentication is used with a PostgreSQL session store, configured for automatic expiration to uphold privacy principles.

### Build and Deployment

Vite is used for frontend development (HMR, TypeScript checking) and client-side production optimization. ESBuild bundles the server for production. Drizzle Kit handles database schema migrations.

## External Dependencies

### Database
- **PostgreSQL**: Primary database (Neon serverless PostgreSQL).
- **Drizzle ORM**: Type-safe database management.
- **connect-pg-simple**: PostgreSQL session store.

### Legal Data Sources
- **CourtListener API**: Legal opinions, court data, case law.
- **RECAP Archive**: Federal court documents.
- **PACER Fetch API**: On-demand access to PACER documents (fallback).
- **Cornell Legal Information Institute**: Legal statutes.
- **EOIR.gov**: Immigration legal service providers.
- **Legal Services Corporation (LSC)**: Civil legal aid organizations.
- **Center for Health and Justice**: Diversion program research.
- **NDAA Diversion Programs Directory** (https://diversion.ndaa.org/): National directory of 250+ prosecutor-led diversion programs (referenced for future expansion).
- **CrimeSolutions.gov Programs API** (https://data.ojp.usdoj.gov/): DOJ Office of Justice Programs database of evidence-based programs (currently offline due to government operations, will be integrated when available).
- **State and Local Court Systems**: Direct research from court websites and district attorney offices across major US metropolitan areas.

### UI and Styling
- **shadcn/ui**: Component library.
- **Tailwind CSS**: Utility-first CSS framework.
- **Framer Motion**: Animations.
- **React Hook Form**: Form management.

### Development and Build Tools
- **Vite**: Development server and build tool.
- **TypeScript**: Type safety.
- **ESBuild**: Fast JavaScript bundler.
- **react-i18next**: Internationalization.

### Third-Party Services
- **Neon Database**: Serverless PostgreSQL hosting.
- **CourtListener**: Legal case database and API.
- **OpenStreetMap/Nominatim**: Geocoding and location-based search.