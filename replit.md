# Public Defender AI - Legal Guidance Platform

## Overview

Public Defender AI is a web application providing accessible, AI-powered legal guidance and rights information. It offers case law search, legal resource databases, and connects users with legal aid organizations. The platform is built with privacy-first principles, ensuring user data is ephemeral and not permanently stored. Key capabilities include AI-powered legal assistance, access to court records, and a comprehensive database of criminal charges and diversion programs. The project aims to empower individuals without immediate legal representation by democratizing access to legal information.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend uses React 18 with TypeScript, Wouter for routing, and shadcn/ui components built on Radix UI primitives. Styling is managed with Tailwind CSS, incorporating a custom legal-themed design system. Framer Motion provides animations. State management employs TanStack Query for server state (caching, background updates) and React hooks for local state. The application supports light/dark modes and is optimized for mobile responsiveness across all features, including a mobile hamburger menu and adaptive display of content. It features full bilingual support with complete internationalization (i18n) using `react-i18next` - all 13 pages are fully translated to Spanish with 700+ translation keys covering the entire user interface.

### Backend Architecture

The backend is built with Express.js and TypeScript, providing a RESTful API. It includes custom middleware for logging and error handling. Drizzle ORM with PostgreSQL is used for type-safe database operations. Legal case data is designed to be ephemeral and automatically expires to ensure user privacy. The server provides endpoints for legal resources, court data, case law search, AI legal guidance, court records search (RECAP/CourtListener), and legal aid organizations, including location-based searches for public defenders.

### Data Sources and Integrations

The system integrates with various legal data sources to provide comprehensive information. It includes a robust database of legal aid organizations with detailed contact and service information, and a comprehensive criminal charges database covering federal and state offenses across all 50 states and DC, cross-referenced with FindLaw categories. It also incorporates an expanded diversion programs database with verified program details. A "free-first" search strategy is implemented for court records, prioritizing RECAP Archive before suggesting paid PACER access. User session data is automatically deleted post-session, and no personal identifying information is permanently stored.

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