# Public Defender AI - Legal Guidance Platform

## Overview

Public Defender AI is a web application providing accessible, AI-powered legal guidance and rights information. It offers case law search, legal resource databases, and connects users with legal aid organizations. The platform prioritizes user privacy by ensuring data ephemerality. Its core purpose is to democratize access to legal information for individuals without immediate legal representation, simplifying complex legal concepts for a broad audience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX Decisions

The frontend is built with React 18 and TypeScript, utilizing shadcn/ui components, Wouter for routing, and Tailwind CSS for styling. It features a custom legal-themed design, Framer Motion for animations, and comprehensive bilingual support (English/Spanish) with `react-i18next`. All user-facing text is designed for a 6th-8th grade reading level, and the application is mobile-responsive. State management uses TanStack Query and React hooks.

**Visual Polish (Jan 2025)**: Enhanced UI/UX with polished interactions and animations:
- **Card component**: Added `hoverable` prop for interactive lift effects with shadow transitions
- **Micro-animations**: Fade-in, slide-in, scale-in animations with staggered delays (all respect `prefers-reduced-motion`)
- **Loading skeletons**: Reusable skeleton components (`client/src/components/ui/loading-skeletons.tsx`) with shimmer effect
- **Empty states**: EmptyState component (`client/src/components/ui/empty-state.tsx`) with variant-specific icons and colors
- **Typography utilities**: Text-balance, text-pretty, heading-tight classes for refined typography
- **CSS utilities in `index.css`**: card-elevated, card-interactive, hover-lift, hover-scale, btn-bounce classes
- Note: Tailwind opacity modifiers (e.g., `text-primary/30`) don't work in @apply or as variable-based classes; use inline styles with `hsl(var(--css-var) / opacity)` instead

**Breadcrumb Navigation (Jan 2025)**: Added responsive breadcrumb component (`client/src/components/navigation/page-breadcrumb.tsx`) for improved navigation:
- **Desktop**: Full trail (Home / Section / Current Page) with clickable links
- **Mobile**: Collapsed back-link format (← Parent Page) to save space
- Applied to: Rights Info, Document Library, and all Immigration sub-pages (DACA/TPS, Workplace Raids, Family Planning, Bond Hearings, Find Attorney)
- Respects navigation guard for unsaved changes warning

**Page Transitions (Jan 2025)**: Smooth fade-in animations when navigating between pages (`client/src/components/ui/page-transition.tsx`):
- Uses Framer Motion's AnimatePresence with "wait" mode for clean transitions
- Subtle slide-up effect (8px) combined with opacity fade
- Duration: 0.3s with custom easing curve
- Respects `prefers-reduced-motion` (simpler, faster fade only)

**Keyboard Shortcuts (Jan 2025)**: Power user keyboard shortcuts (`client/src/hooks/use-keyboard-shortcuts.ts`):
- `/` - Focus first search input on page
- `Esc` - Close dialogs or unfocus inputs
- `Ctrl+K` (or `Cmd+K`) - Show keyboard shortcuts help dialog
- `g` then `h` - Navigate to Home
- `g` then `r` - Navigate to Rights Info
- `g` then `d` - Navigate to Document Library
- `g` then `c` - Navigate to Chat
- Shortcuts dialog component: `client/src/components/ui/keyboard-shortcuts-dialog.tsx`

### Technical Implementations

The backend, developed with Express.js and TypeScript, provides a RESTful API. Drizzle ORM with PostgreSQL handles type-safe database operations, with legal case data designed to be ephemeral.

A dual-mode AI guidance system intelligently selects between Anthropic's Claude AI (Sonnet 4.5) and a rule-based engine. It includes robust error handling with retry logic and fallbacks to ensure continuous service. All AI interactions are cost-tracked.

### Complete Privacy Architecture (100% - Dec 2025)

The platform implements comprehensive privacy protection across four layers:

**1. Transport Encryption (HTTPS)**: All data in transit is encrypted via TLS. The Express server uses `trust proxy` for proper handling behind Replit's SSL-terminating reverse proxy.

**2. Encryption at Rest**: PostgreSQL database uses Google Cloud SQL with automatic encryption, key rotation, and granular access controls. All stored data is encrypted at the database level.

**3. Session-Based Ephemerality**: 
- Legal case data is memory-only (never written to database)
- Auto-expires after 24 hours via `setTimeout` cleanup
- Cleared on any server restart

**4. PII Protection (NLP-Based)**: The redaction system (`server/services/pii-redactor.ts`) uses:
- **NLP-Based Name Detection**: compromise.js for ML-powered detection, running 100% locally
- **Institutional Term Preservation**: Legal terms like "State of California" protected from false positives
- **Regex Pattern Matching**: Additional detection for emails, SSNs, phone numbers, addresses
- **Category-Aware Placeholders**: `[REDACTED_NAME]`, `[REDACTED_EMAIL]` preserve context for AI

**5. Anonymous Consent Tracking**: Privacy consents use SHA-256 hashed session identifiers—raw session IDs never persisted. Only aggregate statistics exposed via API. Server logs contain no PII.

### Multi-Tier Validation System

The legal accuracy validation system (`server/services/legal-accuracy-validator.ts`) uses a two-tier approach:

**Tier 1 - Statute Validation (70% weight)**: Validates statutory citations against the curated database, checks penalty range accuracy, and verifies jurisdiction-specific requirements.

**Tier 2 - Case Law Validation (30% weight)**: The case law validator (`server/services/case-law-validator.ts`) queries CourtListener's semantic search API to find relevant precedents. Key parameters:
- Relevance score threshold: 0.2 (minimum for inclusion)
- Corroboration threshold: 0.4 (for counting as supporting case)
- Semantic score default: 0.1 (conservative when CourtListener doesn't return scores)
- Confidence boost: 0.05-0.15 based on corroborating case count and court level

**Search Query Enhancements (Dec 2025)**: Improved CourtListener search with:
- Enriched queries with legal synonyms from charge category keywords
- Statute citation extraction from charge codes with jurisdiction-aware formatting (e.g., "Penal Code 245" for CA, "Penal Law 121" for NY)
- Multi-stage fallback: primary search → broader search (no jurisdiction filter) → statute-specific search → category-based semantic search
- Better logging for search quality monitoring
- Relevance scoring weights: semantic 45%, charge category 25%, case stage 15%, statute citation match 15%

**User Feedback System**: Users can rate precedent case helpfulness via thumbs up/down buttons. Feedback is validated with Zod schema, deduplicated (one vote per session per case), and stored for analytics.

**Validation UX (Dec 2025)**: Replaced jarring "Accuracy Check" card with supportive reassurance message. Technical metrics (confidence scores, tier breakdowns) are hidden by default behind a collapsible "How we verified this" section for advanced users. When no precedent cases are found, the system displays a supportive explanation rather than leaving the user confused.

The platform integrates various legal data sources, including databases for legal aid organizations, criminal charges, diversion programs, and criminal statutes (federal and state). A "free-first" search strategy is used for court records, prioritizing RECAP Archive. User session data is automatically deleted post-session. Federal statutes are sourced from the GovInfo API, while state statutes are derived from a comprehensive, manually curated database with 50-state + DC coverage (1,255 unique statutes with 713 validated charge-statute matches). Coverage includes 12 major offense categories: Homicide (221 statutes), Burglary (107), Theft (91), Robbery (90), Assault/Battery (85), Drug Offenses (81), Sexual Assault (80), Fraud (100+ including wire/mail/check/insurance/computer/tax fraud and forgery), Traffic/DUI (50+ including reckless driving, hit-and-run, suspended license), Public Order (60+ including disorderly conduct, trespassing, vandalism, loitering, public intoxication), Weapons (51 felon-in-possession statutes plus unlawful discharge), and additional variants (carjacking, drug paraphernalia, domestic violence). All 51 jurisdictions have direct links to official legislature websites.

### API Architecture

The API provides endpoints for legal resources, court information, AI-powered legal guidance, detailed docket information, and comprehensive search capabilities including keyword, semantic, and hybrid search for case law and court records.

**Intelligent Attorney Matching (Jan 2025)**: The proximity search API (`/api/legal-aid-organizations/proximity`) now supports optional `services` filtering to match legal aid organizations with user's specific legal needs. A charge-to-service mapping utility (`shared/charge-service-mapping.ts`) maps charge categories (DUI, theft, assault, etc.) to recommended legal services (DUI Defense, Criminal Defense, etc.) for intelligent resource recommendations.

### System Design Choices

Session-based authentication with PostgreSQL session storage is configured for automatic expiration to ensure privacy. Frontend development uses Vite, and the server is bundled with ESBuild for production. Drizzle Kit manages database migrations.

### Data Quality Assurance

An automated charge-statute consistency validator (`server/services/charge-statute-validator.ts`) runs on every server startup, ensuring criminal charge codes in `shared/criminal-charges.ts` align with verified statute citations in the database. Mismatches are logged as warnings with actionable fix commands. Utility scripts for validation (`scripts/validate-charge-statute-consistency.ts`) and auto-fixing (`scripts/fix-charge-codes.ts`) support maintenance.

## External Dependencies

### Database
-   **PostgreSQL**: Primary database (Neon serverless).
-   **Drizzle ORM**: Type-safe database management.

### Legal Data Sources
-   **CourtListener API**: Legal opinions, court data, case law (includes AI-Powered Semantic Search).
-   **RECAP Archive**: Federal court documents.
-   **PACER Fetch API**: On-demand access to PACER documents (fallback).
-   **GovInfo.gov API**: Federal criminal statutes (Title 18 USC).
-   **OpenLaws API**: Accessible at api.openlaws.us (53 jurisdictions confirmed). Full statute text retrieval now working via hierarchical division endpoints. Uses hybrid lookup: database seed data first (fast, <100ms), API fallback for unknown statutes (slower, uses BFS traversal). Client implementation in `server/services/openlaws-client.ts` with citation parsing supporting multiple formats (standard state codes, NJ colon-delimited, Kansas hyphenated, federal USC, subsections).
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