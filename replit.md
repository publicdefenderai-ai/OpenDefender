# Public Defender AI - Legal Guidance Platform

## Overview

Public Defender AI is a web application designed to provide accessible legal guidance and rights information to individuals who may not have immediate access to legal representation. The platform offers AI-powered legal guidance, case law search capabilities, and comprehensive legal resource databases. Built with privacy-first principles, the application ensures that user data is ephemeral and not permanently stored.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### RECAP/Court Records Integration (October 2025)
- Integrated RECAP Archive and CourtListener API for free court record access
- Implemented "free-first" search strategy: checks RECAP Archive before suggesting paid PACER access
- Added Court Records Search page (`/court-records`):
  - Search federal court filings and dockets from RECAP Archive
  - Search case law opinions from CourtListener database
  - Clear indicators showing which documents are free vs. paid
  - Direct links to free RECAP documents
- Created RECAP Extensions page (`/recap-extensions`):
  - Information about RECAP browser extensions for Chrome, Edge, Firefox, and Safari
  - Prominent third-party disclaimer explaining the relationship with Free Law Project
  - Benefits explanation and how-it-works guide
  - Installation links for all supported browsers
- Added backend services:
  - `RecapService` class for CourtListener/RECAP API integration
  - Search endpoints: `/api/court-records/search` and `/api/court-records/docket/:docketId`
  - Support for searching by case name, docket number, keywords, court, and date ranges
- Updated navigation: Added Court Records Search and RECAP Extensions to header menu
- Database schema: Added `courtRecords` table for caching search results
- External API: Integrated with CourtListener REST API v4 using authentication token

### v1.0 Mobile Optimization and Feature Enhancements (October 2025)
- Created Mission Statement page (`/mission-statement`) with project goals and guiding principles
- Enhanced header functionality:
  - ? (help) icon now links to Mission Statement page
  - Implemented mobile hamburger menu with sheet navigation (Get Guidance, Learn Your Rights, Immigration Assistance)
- Mobile responsiveness improvements:
  - Optimized Urgent Help popup for mobile (max-w-[95vw], scrollable content, accessible close button)
  - Implemented "Show More" functionality for rights cards on mobile (initially shows 3, expandable to all 6)
  - Vertically stacked CTA buttons on mobile for better accessibility
  - Reduced padding and spacing across all sections on mobile devices
  - Hidden duplicate "Data Sources" section on mobile to reduce visual clutter
- Fixed Personalized Assessment category filter to exclude state codes (CA, NY, TX, etc.) from dropdown, showing only crime type categories
- Overall mobile experience: cleaner layout, reduced clutter, professional appearance optimized for smartphones

### Comprehensive Criminal Charges Database Expansion (September 2025)
- Expanded criminal charges database with comprehensive FindLaw crime categories
- Added missing crime types across Technology/Cyber, Financial/White Collar, Administrative/Process, and Specialized categories:
  - **Federal charges**: Identity Theft (18 USC 1028, 1028A), Wire Fraud (18 USC 1343), Money Laundering (18 USC 1956), Tax Evasion (26 USC 7201), Interstate Stalking (18 USC 2261A), Perjury (18 USC 1621), Obstruction of Justice (18 USC 1503)
  - **State charges**: Identity Theft for CA, NY (all degrees), TX; Stalking for CA, NY
- Fixed critical statutory inaccuracies:
  - Corrected Federal Identity Theft from incorrect 18 USC 1030 to proper 18 USC 1028/1028A
  - Fixed NY Identity Theft degree classifications to proper PL 190.80 (1st), 190.79 (2nd), 190.78 (3rd)
- Resolved React duplicate key warnings in legal guidance flow
- Enhanced charge categorization with new "Technology/Cyber Crimes" category
- Achieved comprehensive coverage for ALL 50 states plus DC and federal charges

### Enhanced Diversion Programs Database (September 2024)
- Expanded diversion programs database using Center for Health and Justice research
- Added verified TASC programs with real contact information:
  - Bronx TASC Diversion Program (NY) - EAC Network partnership
  - Delaware TASC Treatment Access Centers (Wilmington and Georgetown locations)  
  - Milwaukee County Drug Treatment Court (WI) - Part of state TAD program
  - Los Angeles County Mental Health Court (CA) - Rapid Diversion Program
- All new programs include verified addresses, phone numbers, and eligibility requirements
- Enhanced location search capabilities with comprehensive zip code coverage
- Programs sourced from official Center for Health and Justice national survey report

## System Architecture

### Frontend Architecture

**Technology Stack**: React 18 with TypeScript, utilizing Wouter for client-side routing instead of React Router. The UI is built on shadcn/ui components with Radix UI primitives, styled using Tailwind CSS with a custom legal-themed design system.

**Component Structure**: Follows a modular component architecture with specialized legal components (`RightsCard`, `QAFlow`, `DataSourceCard`) and reusable UI components. The application implements a theme provider supporting light/dark modes and uses Framer Motion for smooth animations and scroll reveals.

**State Management**: Leverages TanStack Query (React Query) for server state management, providing caching, background updates, and optimistic updates for legal data fetching. Local state is managed through React hooks.

### Backend Architecture

**Server Framework**: Express.js with TypeScript, implementing a RESTful API structure. The server includes custom middleware for request logging and error handling.

**Database Layer**: Uses Drizzle ORM with PostgreSQL for type-safe database operations. The schema includes tables for users, legal cases (ephemeral), legal resources, and court data.

**Storage Strategy**: Implements both in-memory storage for development and PostgreSQL for production. Legal case data is designed to be ephemeral with automatic expiration to maintain privacy.

### Data Sources and Integrations

**Court Data Integration**: Integrates with CourtListener API for case law search and legal opinion access. The service includes fallback mechanisms and rate limiting considerations.

**Legal Resources**: Maintains a curated database of legal resources categorized by jurisdiction and type (rights, procedures, statutes, etc.).

**Privacy-First Design**: All user session data is automatically deleted after session expiration. No personal identifying information is permanently stored.

### API Architecture

**Legal Resources API**: `/api/legal-resources` - Retrieves legal resources filtered by jurisdiction and category
**Court Data API**: `/api/court-data/:jurisdiction` - Fetches court information and local court details
**Case Law Search**: `/api/case-law/search` - Searches legal opinions and case precedents
**Legal Guidance**: Provides AI-generated legal guidance based on user input through a multi-step questionnaire
**Court Records Search**: `/api/court-records/search` - Searches RECAP Archive and case law database with free-first strategy
**Docket Details**: `/api/court-records/docket/:docketId` - Retrieves detailed docket information and associated documents

### Authentication and Session Management

Uses session-based authentication with PostgreSQL session store. Sessions are configured to expire automatically to maintain privacy principles.

### Build and Deployment

**Development**: Vite for fast development with HMR, TypeScript checking, and Replit-specific plugins
**Production**: ESBuild for server bundling, Vite for client-side optimization
**Database Management**: Drizzle Kit for schema migrations and database operations

## External Dependencies

### Database
- **PostgreSQL**: Primary database using Neon serverless PostgreSQL
- **Drizzle ORM**: Type-safe database operations and schema management
- **connect-pg-simple**: PostgreSQL session store for Express sessions

### Legal Data Sources
- **CourtListener API**: Free access to legal opinions, court data, and case law
- **RECAP Archive**: Free repository of federal court documents crowdsourced from PACER users
- **PACER Fetch API**: On-demand access to PACER documents (used as fallback when not available in RECAP)
- **Cornell Legal Information Institute**: Referenced for legal statutes and constitutional information
- **Government APIs**: Planned integration with federal and state legal databases
- **Juriscraper**: Python library for court website scraping (documented for future integration)

### UI and Styling
- **shadcn/ui**: Component library built on Radix UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom legal theme
- **Framer Motion**: Animation library for smooth user interactions
- **React Hook Form**: Form validation and management

### Development and Build Tools
- **Vite**: Development server and build tool
- **TypeScript**: Type safety across the full stack
- **ESBuild**: Fast JavaScript bundler for production builds
- **Replit Plugins**: Development environment integration

### Third-Party Services
- **Neon Database**: Serverless PostgreSQL hosting
- **CourtListener**: Legal case database and API
- **Government Legal APIs**: Various federal and state legal information sources (planned)

The application is designed to be modular and extensible, allowing for easy integration of additional legal data sources and expansion of AI capabilities while maintaining strict privacy standards.