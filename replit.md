# Public Defender AI - Legal Guidance Platform

## Overview

Public Defender AI is a web application providing accessible, AI-powered legal guidance and rights information. It offers case law search, legal resource databases, and connects users with legal aid organizations. The platform is built with privacy-first principles, ensuring user data is ephemeral and not permanently stored. Key capabilities include AI-powered legal assistance, access to court records, and a comprehensive database of criminal charges, statutes, and diversion programs. The project aims to empower individuals without immediate legal representation by democratizing access to legal information, particularly focusing on simplified language for users with limited legal background.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend uses React 18 with TypeScript, Wouter for routing, and shadcn/ui components built on Radix UI primitives. Styling is managed with Tailwind CSS, incorporating a custom legal-themed design system. Framer Motion provides animations. State management employs TanStack Query for server state and React hooks for local state. The application supports light/dark modes and is optimized for mobile responsiveness across all features. It features complete bilingual support (English/Spanish) with internationalization (i18n) using `react-i18next`, ensuring all 13 pages, interactive modals, and navigation menus are fully translated. All user-facing text is designed for a 6th-8th grade reading level.

### Backend Architecture

The backend is built with Express.js and TypeScript, providing a RESTful API. It includes custom middleware for logging and error handling. Drizzle ORM with PostgreSQL is used for type-safe database operations. Legal case data is designed to be ephemeral and automatically expires to ensure user privacy. The server provides endpoints for legal resources, court data, case law search, AI legal guidance, court records search, and legal aid organizations, including location-based searches for public defenders.

### Data Sources and Integrations

The system integrates with various legal data sources to provide comprehensive information. This includes a robust database of legal aid organizations, a comprehensive criminal charges database, a database of diversion programs (73 programs across major US metropolitan areas), and an extensive criminal statutes database (federal and state). A "free-first" search strategy is implemented for court records, prioritizing RECAP Archive before suggesting paid PACER access. User session data is automatically deleted post-session, and no personal identifying information is permanently stored. The statute integration employs a hybrid multi-source approach:
1.  **Primary**: OpenLaws API (when access granted) for 50-state + federal coverage.
2.  **Current**: Seed data for 10 states via PostgreSQL.
3.  **Fallback**: Ethical web scraping for 7 allowed states.
4.  **Monitoring**: LegiScan API for quarterly statute change detection.

### API Architecture

The API includes endpoints for:
-   Legal resources (filtered by jurisdiction/category)
-   Court information by jurisdiction
-   Case law search
-   Court records search (RECAP Archive and case law database)
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
-   **CourtListener API**: Legal opinions, court data, case law.
-   **RECAP Archive**: Federal court documents.
-   **PACER Fetch API**: On-demand access to PACER documents (fallback).
-   **GovInfo.gov API**: Federal criminal statutes (Title 18 USC).
-   **OpenLaws API** (Pending): All 50 states + federal statutes.
-   **LegiScan API**: Quarterly statute change monitoring.
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

### Third-Party Services
-   **Neon Database**: Serverless PostgreSQL hosting.
-   **CourtListener**: Legal case database and API.
-   **OpenStreetMap/Nominatim**: Geocoding and location-based search.