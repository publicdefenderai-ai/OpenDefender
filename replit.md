# Public Defender AI - Legal Guidance Platform

## Overview

Public Defender AI is a web application designed to provide accessible legal guidance and rights information to individuals who may not have immediate access to legal representation. The platform offers AI-powered legal guidance, case law search capabilities, and comprehensive legal resource databases. Built with privacy-first principles, the application ensures that user data is ephemeral and not permanently stored.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

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
- **Cornell Legal Information Institute**: Referenced for legal statutes and constitutional information
- **Government APIs**: Planned integration with federal and state legal databases

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