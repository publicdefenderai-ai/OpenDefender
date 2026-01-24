# Attorney Document Generation Service - Feature Scope

## Executive Summary

A secure, AI-powered document drafting service for licensed attorneys to generate common filings in criminal and immigration cases. The service prioritizes security, privilege protection, and accuracy while starting with simpler, high-volume filings to minimize risk and maximize utility.

This feature is part of a broader reorganization of Public Defender AI into two pathways: **"Get Guidance"** for individuals and families, and **"For Attorneys"** for licensed legal professionals.

---

## Site Architecture: Light-Touch Separation

### Design Philosophy

Rather than bifurcating the entire site into two separate experiences, we use a **light-touch approach**:

- **One unified site** accessible to everyone (individuals, families, and attorneys)
- **Attorney Tools** section for features requiring attestation (document generation)
- **Progressive disclosure** - don't overwhelm users upfront

This approach recognizes that most features (including personalized guidance) are valuable to both individuals AND attorneys. Only document generation truly requires attorney gating due to privilege concerns.

### Homepage (Unchanged)

The homepage maintains its current simple design with two urgency-based options:

```
┌─────────────────────────────────────────────────────────────┐
│                    PUBLIC DEFENDER AI                        │
│                                                             │
│    ┌─────────────────────┐    ┌─────────────────────┐      │
│    │    GET STARTED      │    │  URGENT HELP NEEDED │      │
│    │                     │    │                     │      │
│    │  Learn about your   │    │  Being arrested or  │      │
│    │  rights and options │    │  detained right now │      │
│    └─────────────────────┘    └─────────────────────┘      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### "Get Started" Landing Page (New)

After clicking "Get Started", users see 5 clear options:

```
┌─────────────────────────────────────────────────────────────┐
│                  What can we help with?                      │
│                                                             │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│  │  GET GUIDANCE   │ │  KNOW YOUR      │ │  IMMIGRATION    ││
│  │                 │ │  RIGHTS         │ │  ENFORCEMENT    ││
│  │  Personalized   │ │                 │ │                 ││
│  │  help for your  │ │  Constitutional │ │  Your rights &  ││
│  │  situation      │ │  protections    │ │  how to prepare ││
│  └─────────────────┘ └─────────────────┘ └─────────────────┘│
│                                                             │
│  ┌─────────────────┐ ┌─────────────────┐                   │
│  │  FIND           │ │  ATTORNEY       │                   │
│  │  RESOURCES      │ │  TOOLS          │                   │
│  │                 │ │                 │                   │
│  │  Public         │ │  Document       │                   │
│  │  defenders,     │ │  drafting for   │                   │
│  │  legal aid      │ │  legal pros     │                   │
│  └─────────────────┘ └─────────────────┘                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Navigation Structure

Header provides direct access for returning users:

```
[Logo]  [Get Guidance]  [Rights]  [Immigration]  [Resources]  [Attorney Tools]
```

### Feature Organization

**Get Guidance**
| Feature | Route | Description |
|---------|-------|-------------|
| Personalized Guidance Chat | `/chat` | AI-powered guidance for your situation |
| Friends & Family | `/friends-family` | Supporting a loved one |

**Know Your Rights**
| Feature | Route | Description |
|---------|-------|-------------|
| Rights Information | `/rights-info` | Constitutional and procedural rights |
| Criminal Justice Process | `/process` | Understanding the system |
| Search & Seizure | `/search-seizure` | 4th Amendment protections |

**Immigration Enforcement**
| Feature | Route | Description |
|---------|-------|-------------|
| Immigration Guidance | `/immigration-guidance` | Know your rights, how to prepare |
| DACA/TPS Information | `/immigration-guidance/daca-tps` | Status-specific guidance |
| Workplace Raids | `/immigration-guidance/workplace-raids` | Employer & employee rights |

**Find Resources**
| Feature | Route | Description |
|---------|-------|-------------|
| Find Public Defender | `/resources` | Locate free representation |
| Find Legal Aid | `/resources` | Low-cost legal help |
| Diversion Programs | `/diversion-programs` | Alternatives to prosecution |
| Record Expungement | `/record-expungement` | Clearing your record |

**Attorney Tools** (Gated by attestation for document generation)
| Feature | Route | Gated | Description |
|---------|-------|-------|-------------|
| Document Generation | `/attorney/documents` | Yes | AI-powered filing drafts |
| Attorney Portal Home | `/attorney` | No | Overview and access point |

### Shared Resources (Accessible to Everyone)

These appear in navigation and are available without any gating:

| Feature | Route | Description |
|---------|-------|-------------|
| Document Library | `/document-library` | Legal forms and templates |
| Statute Lookup | `/statutes` | Research relevant laws |
| Legal Glossary | `/legal-glossary` | Legal term definitions |
| Court Locator | `/court-locator` | Find court locations |
| Court Records | `/court-records` | PACER/RECAP case research |
| Navigate This Tool | `/how-to` | Guide to using the site |

### Updated "Navigate This Tool" Page

The `/how-to` page will explain all sections of the site:

```
┌─────────────────────────────────────────────────────────────┐
│  GET GUIDANCE                                               │
│  Personalized help understanding your legal situation—      │
│  whether you have an attorney or not.                       │
│  • Chat with our AI assistant                               │
│  • Get step-by-step guidance for your specific case         │
│  • Help a friend or family member                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  KNOW YOUR RIGHTS                                           │
│  Understand the legal protections available to you.         │
│  • Constitutional rights                                    │
│  • The criminal justice process                             │
│  • Search and seizure protections                           │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  IMMIGRATION ENFORCEMENT                                    │
│  Know your rights and prepare for potential encounters.     │
│  • Rights during ICE encounters                             │
│  • Workplace raid preparation                               │
│  • Family safety planning                                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  FIND RESOURCES                                             │
│  Connect with legal help in your area.                      │
│  • Public defender offices                                  │
│  • Legal aid organizations                                  │
│  • Diversion programs                                       │
│  • Record expungement                                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  ATTORNEY TOOLS                                             │
│  For licensed attorneys representing clients.               │
│  • Document drafting (requires attestation)                 │
│  • Generate common criminal and immigration filings         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  SHARED RESOURCES                                           │
│  Available to everyone:                                     │
│  • Document Library • Statute Lookup • Legal Glossary       │
│  • Court Locator • Court Records                            │
└─────────────────────────────────────────────────────────────┘
```

---

## Document Generation Feature

### Core Concept

Attorneys input structured case facts through a guided interface, and the system generates jurisdiction-appropriate draft documents using AI, validated templates, and legal databases. All documents are clearly marked as drafts requiring attorney review.

### Key Principles
1. **Attorney-only access** - Verified legal professionals acting on behalf of clients
2. **Template-assisted generation** - AI fills structured templates rather than free-form generation
3. **Zero persistence** - Case data deleted immediately after session
4. **Privilege protection** - Clear markings and attestations throughout
5. **Human-in-the-loop** - Attorney review required before any document is finalized

---

## Phase 1: Target Documents

### Criminal Filings (Simpler, High-Volume)

| Document | Complexity | Risk Level | Utility |
|----------|------------|------------|---------|
| Notice of Appearance | Low | Low | High |
| Motion to Continue/Adjourn | Low | Low | High |
| Motion for Discovery (Boilerplate) | Low | Low | High |
| Bail/Bond Reduction Motion | Medium | Medium | High |
| Motion to Modify Conditions of Release | Low | Low | Medium |
| Speedy Trial Demand | Low | Low | Medium |

### Immigration Filings (Simpler, High-Volume)

| Document | Complexity | Risk Level | Utility |
|----------|------------|------------|---------|
| EOIR-28 Notice of Entry of Appearance | Low | Low | High |
| Motion to Continue (Immigration Court) | Low | Low | High |
| Motion to Change Venue | Low | Low | Medium |
| Bond Memorandum (Structure) | Medium | Medium | High |
| Stay of Removal Request (Template) | Medium | Medium | High |
| I-589 Declaration Outline | Medium | Medium | High |

### Documents Explicitly Excluded from Phase 1
- Suppression motions (fact-intensive, high stakes)
- Sentencing memoranda (requires nuanced advocacy)
- Appeals briefs (complex legal arguments)
- Habeas petitions (high complexity)
- Asylum merit briefs (fact-intensive)

---

## User Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  1. ATTORNEY VERIFICATION                                        │
│     - Bar number + State                                        │
│     - Attestation: "I am a licensed attorney acting on behalf   │
│       of a client in this matter"                               │
│     - Agreement to Terms of Service                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. DOCUMENT SELECTION                                          │
│     - Select case type (Criminal / Immigration)                 │
│     - Select jurisdiction (State/Federal/Immigration Court)     │
│     - Select document type from available templates             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. CASE FACTS INPUT                                            │
│     - Structured form with required fields                      │
│     - Jurisdiction-specific prompts                             │
│     - Clear labels for what information is needed               │
│     ⚠️ Warning: "Information entered is processed by AI and     │
│        will be permanently deleted after this session"          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  4. DOCUMENT GENERATION                                         │
│     - AI processes facts against validated template             │
│     - Citation verification against legal databases             │
│     - Jurisdiction-specific formatting applied                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  5. REVIEW & EXPORT                                             │
│     - Preview generated document                                │
│     - All documents marked: "DRAFT - PRIVILEGED & CONFIDENTIAL" │
│     - Highlighted sections requiring attorney review            │
│     - Export as Word (.docx) for editing                        │
│     ⚠️ Final attestation: "I have reviewed this draft and take  │
│        responsibility for its contents"                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  6. SESSION TERMINATION                                         │
│     - All case data permanently deleted                         │
│     - Confirmation shown to user                                │
│     - Audit log entry (no case details, only metadata)          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Hallucination Mitigation Strategy

### 1. Template-Based Architecture
Instead of free-form generation, use structured templates where AI fills specific sections:

```
MOTION TO CONTINUE

IN THE [Court Name from DB] COURT
[County/District from DB], [State from DB]

THE PEOPLE OF THE STATE OF [State]    )
                                       )  Case No. [User Input]
vs.                                    )
                                       )
[Client Name - User Input],           )
                    Defendant.         )

COMES NOW the Defendant, by and through undersigned counsel,
and respectfully moves this Honorable Court to continue the
[Hearing Type - User Input] currently scheduled for
[Date - User Input] to a date convenient to the Court.

IN SUPPORT THEREOF, Defendant states:

[AI-GENERATED SECTION - Validated Against Template Rules]
- Must include: reason for continuance
- Must NOT include: fabricated case citations
- Must flag: any legal standards cited for attorney verification

[STANDARD CLOSING - From Template]
```

### 2. Citation Verification
- **No fabricated case citations** - AI instructed to leave citation placeholders
- Cross-reference any mentioned statutes against verified legal databases
- Flag unverified legal claims with `[VERIFY]` markers
- Provide suggested citation lookup resources

### 3. Structured Output Validation
```typescript
interface GeneratedDocument {
  sections: {
    id: string;
    type: 'template' | 'ai-generated' | 'user-input';
    content: string;
    requiresReview: boolean;
    citations: {
      text: string;
      verified: boolean;
      source?: string;
    }[];
  }[];
  warnings: string[];
  unverifiedClaims: string[];
}
```

### 4. Confidence Scoring
- Rate each AI-generated section on confidence
- Low-confidence sections highlighted for mandatory review
- Provide alternative phrasings where uncertain

### 5. Jurisdiction-Specific Validation
- Validate court names against known courts database
- Verify local rule compliance (page limits, formatting)
- Check filing deadlines against jurisdiction rules

---

## Security Architecture

### Data Flow Security

```
┌─────────────┐    HTTPS/TLS 1.3    ┌─────────────┐
│   Browser   │◄──────────────────►│   Server    │
│  (Client)   │                     │  (No Logs)  │
└─────────────┘                     └──────┬──────┘
                                           │
                                    Encrypted in Transit
                                           │
                                    ┌──────▼──────┐
                                    │  Claude API │
                                    │ (Stateless) │
                                    └─────────────┘
```

### Technical Protections

| Layer | Protection | Implementation |
|-------|------------|----------------|
| **Transport** | TLS 1.3 | All communications encrypted |
| **Application** | No server-side logging of case data | Logging whitelist approach |
| **Memory** | Session-scoped data only | No database persistence |
| **API** | Ephemeral requests to Claude | No conversation history |
| **Export** | Client-side document generation | Server never stores final docs |
| **Audit** | Metadata only | Log: timestamp, doc type, jurisdiction (no case facts) |

### Session Management

```typescript
interface AttorneySession {
  sessionId: string;          // UUID, not tied to identity
  barVerified: boolean;       // Attestation completed
  createdAt: Date;
  expiresAt: Date;            // 30-minute max session
  dataRetained: false;        // Explicit flag - always false
}

// On session end or timeout:
function terminateSession(sessionId: string): void {
  // 1. Clear all in-memory case data
  // 2. Invalidate session token
  // 3. Log termination (no case details)
  // 4. Return confirmation to client
}
```

### Data Deletion Guarantees

1. **No database storage** - Case facts never written to persistent storage
2. **Memory-only processing** - Data exists only during active request
3. **30-minute session limit** - Automatic expiration and cleanup
4. **Explicit deletion on export** - Data cleared when document downloaded
5. **No Claude conversation history** - Each request is stateless

---

## Privilege Protection

### Attorney Verification Workflow

```typescript
interface AttorneyAttestation {
  barNumber: string;
  barState: string;
  attestations: {
    isLicensedAttorney: boolean;        // Required
    actingOnBehalfOfClient: boolean;    // Required
    understandsPrivilegeRequirements: boolean;  // Required
    acceptsTermsOfService: boolean;     // Required
  };
  timestamp: Date;
  ipHash: string;  // Hashed, not stored in plain text
}
```

### Required Disclaimers (Shown at Key Points)

**On Entry:**
> "This service is exclusively for licensed attorneys preparing documents on behalf of clients. Documents generated are marked as privileged attorney work product. By proceeding, you attest that you are a licensed attorney and that the information you provide is protected by attorney-client privilege."

**Before Fact Input:**
> "The information you enter will be processed by AI to generate your document. All data is encrypted in transit and permanently deleted after your session ends. No case information is retained by Public Defender AI."

**On Document Preview:**
> "This is a DRAFT document requiring your professional review before filing. You are responsible for verifying all facts, citations, and legal arguments. AI-generated content may contain errors."

**On Export:**
> "By downloading this document, you acknowledge that:
> 1. You have reviewed the draft and take responsibility for its contents
> 2. The document is attorney work product protected by privilege
> 3. Sharing outside the attorney-client relationship may waive privilege
> 4. All case data will be permanently deleted from our systems"

### Document Watermarking

Every generated document includes:

```
╔════════════════════════════════════════════════════════════════╗
║  DRAFT - PRIVILEGED & CONFIDENTIAL - ATTORNEY WORK PRODUCT    ║
║  Generated via Public Defender AI - Requires Attorney Review   ║
║  Session: [Truncated Session ID] | Generated: [Timestamp]      ║
╚════════════════════════════════════════════════════════════════╝
```

Header on every page:
```
DRAFT - PRIVILEGED & CONFIDENTIAL
```

Footer on every page:
```
Attorney Work Product - [Bar State] Bar No. [Partial] - Page X of Y
```

---

## Technical Architecture

### New Components Required

```
/server
  /services
    /attorney-docs
      - template-engine.ts      # Template processing
      - document-generator.ts   # AI integration for doc gen
      - citation-validator.ts   # Verify legal citations
      - jurisdiction-rules.ts   # Court-specific formatting
      - session-manager.ts      # Secure session handling

/shared
  /templates
    /criminal
      - motion-to-continue.json
      - notice-of-appearance.json
      - motion-for-discovery.json
      - bail-reduction-motion.json
    /immigration
      - eoir-28.json
      - motion-to-continue-eoir.json
      - bond-memorandum.json
      - stay-of-removal.json

/client
  /pages
    - get-started.tsx           # NEW: Landing page with 5 options
    - attorney/
      - index.tsx               # Attorney portal home
      - verify.tsx              # Attestation gate
      - documents.tsx           # Document generation
    - how-to.tsx                # Updated to explain all sections
  /components
    /attorney-docs
      - verification-form.tsx   # Bar attestation
      - document-selector.tsx   # Choose document type
      - fact-input-form.tsx     # Structured case input
      - document-preview.tsx    # Review before export
      - export-dialog.tsx       # Final attestation + download
    /get-started
      - option-card.tsx         # Card component for 5 options
```

### URL Structure

```
/                           → Homepage (Get Started / Urgent Help)
/get-started                → Landing page with 5 options (NEW)

# Get Guidance
/chat                       → Personalized guidance
/friends-family             → Helping loved ones

# Know Your Rights
/rights-info                → Constitutional rights
/process                    → Criminal justice process
/search-seizure             → 4th Amendment protections

# Immigration Enforcement
/immigration-guidance       → Immigration rights hub
/immigration-guidance/...   → Sub-pages (DACA, workplace raids, etc.)

# Find Resources
/resources                  → Public defenders, legal aid
/diversion-programs         → Alternatives to prosecution
/record-expungement         → Clearing records

# Attorney Tools
/attorney                   → Attorney portal home
/attorney/verify            → Attestation gate
/attorney/documents         → Document generation (gated)

# Shared Resources (no gating)
/document-library           → Legal forms and templates
/statutes                   → Statute lookup
/legal-glossary             → Legal definitions
/court-locator              → Find court locations
/court-records              → PACER/RECAP case research
/how-to                     → Navigate this tool (updated)
/mission-statement          → About
/privacy-policy             → Privacy
/disclaimers                → Legal notices
```

### Template Schema

```typescript
interface DocumentTemplate {
  id: string;
  name: string;
  category: 'criminal' | 'immigration';
  jurisdictions: string[];  // Supported jurisdictions
  complexity: 'low' | 'medium' | 'high';

  sections: TemplateSection[];

  requiredInputs: {
    id: string;
    label: string;
    type: 'text' | 'date' | 'select' | 'textarea';
    required: boolean;
    validation?: string;  // Regex or validation rule
    helpText?: string;
  }[];

  jurisdictionVariants: {
    [jurisdiction: string]: {
      courtName: string;
      filingRequirements: string[];
      localRules: string[];
    };
  };
}

interface TemplateSection {
  id: string;
  type: 'static' | 'user-input' | 'ai-generated';
  content?: string;           // For static sections
  inputMapping?: string;      // For user-input sections
  aiPrompt?: string;          // For AI-generated sections
  maxLength?: number;
  requiresReview: boolean;
}
```

---

## Risk Assessment

### Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| AI hallucinates case citations | High | High | No citations in AI output; placeholder approach |
| Incorrect legal standards cited | Medium | High | Jurisdiction validation; mandatory review flags |
| Data breach of case information | Low | Critical | No persistence; memory-only; encryption |
| Non-attorney uses service | Medium | Medium | Attestation; bar number collection; ToS |
| Document used without review | Medium | High | Multiple attestations; draft watermarks |
| Privilege waiver concerns | Low | Medium | Clear warnings; export attestation |

### Liability Considerations

1. **Terms of Service** must clearly state:
   - Documents are drafts requiring attorney review
   - Public Defender AI is not practicing law
   - Attorney assumes full responsibility for filed documents
   - No guarantee of accuracy or completeness

2. **Professional Responsibility**
   - Attorneys remain bound by their ethical obligations
   - Service is a tool, not a substitute for professional judgment
   - Competence requirement still applies (Model Rule 1.1)

---

## Success Metrics

### Phase 1 Goals

| Metric | Target |
|--------|--------|
| Documents generated | Track usage by type |
| Time savings | Survey: avg time saved per document |
| Error rate | % of documents with flagged issues |
| Attorney satisfaction | NPS score from users |
| Security incidents | 0 data breaches |

### Quality Indicators

- % of AI-generated sections accepted without modification
- % of citations verified successfully
- Average confidence score per document type
- Support ticket rate per 100 documents

---

## Implementation Phases

### Phase 0: Site Reorganization
- Create `/get-started` landing page with 5 options
- Create `/attorney` portal home page
- Add "Attorney Tools" to main navigation
- Update "Navigate This Tool" (`/how-to`) to explain all sections
- Keep Court Records at `/court-records` (shared resource)
- No preference storage needed (stateless by design)

**Estimated effort**: 2-4 hours

### Phase 1: Document Generation (MVP)
- Attorney verification/attestation workflow (`/attorney/verify`)
- Document generation page (`/attorney/documents`)
- 3-4 simplest criminal templates (CA, NY, TX, FL)
  - Notice of Appearance
  - Motion to Continue
  - Motion for Discovery
  - Bail/Bond Reduction Motion
- 2-3 simplest immigration templates
  - EOIR-28 Notice of Entry
  - Motion to Continue (Immigration Court)
  - Bond Memorandum
- Basic session security (memory-only, auto-expiration)
- Document export (Word format)
- "DRAFT - PRIVILEGED & CONFIDENTIAL" watermarking

**Estimated effort**: 2-4 weeks

### Phase 2: Expansion
- Additional document templates based on attorney feedback
- Citation verification integration
- Jurisdiction-specific formatting refinements
- Usage analytics (privacy-preserving)
- Legal aid organization partnerships for template review

### Phase 3: Enhancement
- Additional jurisdiction support beyond initial 4 states
- Advanced hallucination detection
- Template customization options
- Filing deadline calculator
- Local court rules reference

---

## Key Decisions

1. **Site Architecture**: Light-touch separation with one unified site accessible to everyone. "Attorney Tools" is simply one section among five options, with document generation gated by attestation. This recognizes that most features (including personalized guidance) are valuable to both individuals AND attorneys.

2. **Progressive Disclosure**: Homepage remains simple (2 options: Get Started / Urgent Help). After "Get Started", users see 5 options: Get Guidance, Know Your Rights, Immigration Enforcement, Find Resources, Attorney Tools.

3. **Privacy**: Stateless design - no preference storage. No cookies or localStorage for user type.

4. **Bar Verification**: Attestation only - no API integration with state bars. Attorneys self-certify their bar number and state.

5. **Pricing Model**: **Free service** - consistent with Public Defender AI's mission to increase access to justice.

6. **Jurisdiction Priority**: Phase 1 will support four states:
   - California
   - New York
   - Texas
   - Florida

   These cover a significant portion of criminal and immigration cases nationally. Additional jurisdictions will be added in later phases.

7. **Shared Resources**: Most features are accessible to everyone without gating:
   - Personalized Guidance Chat (valuable to attorneys too)
   - Document Library
   - Statute Lookup
   - Legal Glossary
   - Court Locator
   - Court Records
   - All rights and immigration information

8. **Gated Features**: Only document generation requires attorney attestation (due to privilege concerns).

9. **Template Sources**: Plan to partner with legal aid organizations for template review in the near future.

---

## Future Considerations

1. **Malpractice Acknowledgment**: Consider whether to require attorneys to acknowledge malpractice coverage in future phases.

2. **Jurisdiction Expansion**: After Phase 1, prioritize states based on user demand and legal aid partnerships.

3. **Legal Aid Partnerships**: Engage organizations like Legal Aid Society, Public Defender offices, and immigration legal services for template validation and feedback.

---

*Document Version: 1.1*
*Last Updated: January 2026*
*Status: Planning/Scoping - Key Decisions Finalized*
