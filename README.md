# Public Defender AI

**Expanding access to justice through AI-powered legal guidance and resources.**

Public Defender AI is a free, open-source platform that helps people understand and navigate the U.S. criminal justice and immigration systems. Think of it as a public defender in your pocket.

🌐 **Live Platform**: [Visit Public Defender AI](https://justice-guard-sa.replit.app/)

---

## 🎯 Mission

To democratize access to legal information and resources, particularly for individuals without immediate legal representation. We provide simplified, accessible legal guidance in plain language with full bilingual support (English/Spanish).

---

## ✨ Key Features

### 📚 Comprehensive Legal Database
- **4,146 Criminal Charges** with detailed information and statute citations
- **1,385+ State Statutes** curated seed data covering all 51 jurisdictions (50 states + DC)
- **4.3M+ Live Statutes** via OpenLaws API across 53 jurisdictions (50 states + DC + PR + Federal)
- **Complete Federal Criminal Code** via GovInfo API (Title 18 USC)
- **73 Diversion Programs** directory covering major U.S. metropolitan areas
- **153 Legal Aid Organizations** (123 public defender offices, 12 immigration, 18 civil)

### 🔍 Search & Discovery
- **Court Records Search** via RECAP Archive and CourtListener
- **Semantic Search** using AI to understand natural language queries
- **ZIP Code-based Search** to find local public defenders, courts, and legal aid organizations
- **Case Law Database** with advanced search capabilities

### 🤖 AI-Powered Guidance
- **Claude Sonnet 4** integration for personalized legal guidance
- **Hybrid Approach**: Rule-based engine for simple cases, AI for complex situations
- **Privacy-First**: All user data is ephemeral and deleted after session
- **Automatic Timeout Handling**: Reliable service with retry logic

### ⚖️ Attorney Document Generation (NEW)
- **Verified Attorney Portal** with attestation-based access
- **Motion to Continue Template** with California-specific variant (LA Superior Court format)
- **AI-Generated Content**: Good cause statements and legal arguments with proper citations
- **Word (.docx) Export** with California Rules of Court formatting (CRC 2.104-2.111)
- **Multi-Step Wizard** for guided document creation
- **Session-Protected**: 30-minute secure sessions with automatic cleanup

### 🌍 Accessibility
- **Bilingual Support**: Full English and Spanish translations
- **Mobile-Optimized**: Responsive design works on all devices
- **Plain Language**: Written at 6th-8th grade reading level
- **Dark Mode Support**: Comfortable viewing in any lighting

---

## 🚀 Getting Started

### For Users

Simply visit [justice-guard-sa.replit.app](https://justice-guard-sa.replit.app/) to access:
- Legal guidance and rights information
- Public defender and legal aid search
- Court records and case law research
- Criminal charge information and statutes
- Diversion program directory

### For Developers

**Prerequisites:**
- Node.js 18+
- PostgreSQL database

**Required API Keys:**

To run this application with full functionality, you'll need to obtain your own API keys from the following services:

| API Key | Service | Purpose | Required? |
|---------|---------|---------|-----------|
| `ANTHROPIC_API_KEY` | [Anthropic](https://console.anthropic.com/) | AI-powered legal guidance using Claude | **Required** for AI features |
| `DATABASE_URL` | PostgreSQL | Database connection string | **Required** |
| `COURTLISTENER_API_TOKEN` | [CourtListener](https://www.courtlistener.com/help/api/) | Case law search, court records, RECAP archive | Optional (enables court records) |
| `OPENLAWS_API_KEY` | [OpenLaws](https://openlaws.com/) | Live statute retrieval across 53 jurisdictions | Optional (enables live statutes) |
| `GOVINFO_API_KEY` | [GovInfo.gov](https://api.govinfo.gov/docs/) | Federal statutes (Title 18 USC) | Optional (free government API) |
| `LEGISCAN_API_KEY` | [LegiScan](https://legiscan.com/legiscan) | Bill tracking and statute change monitoring | Optional (enables bill tracking) |

> **Note**: The application will function with reduced features if optional API keys are not provided. The AI guidance and rule-based fallback systems will still work with just the Anthropic API key.

**Installation:**

```bash
# Clone the repository
git clone https://github.com/shahabasghar/PublicDefenderAI.git
cd PublicDefenderAI

# Install dependencies
npm install

# Set up environment variables
# Create a .env file with your API keys:
# DATABASE_URL=postgresql://...
# ANTHROPIC_API_KEY=sk-ant-...
# COURTLISTENER_API_TOKEN=... (optional)
# OPENLAWS_API_KEY=... (optional)
# GOVINFO_API_KEY=... (optional)
# LEGISCAN_API_KEY=... (optional)

# Run database migrations
npm run db:push

# Start the development server
npm run dev
```

---

## 📋 Attorney Portal

The Attorney Portal provides verified attorneys with AI-powered document generation tools.

### Available Templates
| Template | Jurisdiction | Status |
|----------|--------------|--------|
| Motion to Continue | California (LA Superior Court) | ✅ Available |
| Motion to Continue | Generic (all states) | ✅ Available |
| Discovery Request | Coming Soon | 🚧 Planned |
| Bail Reduction Motion | Coming Soon | 🚧 Planned |

### Document Features
- **California Formatting**: Compliant with California Rules of Court (CRC 2.104-2.111)
- **Line Numbers**: Automatic line numbering for California pleading paper
- **AI Sections**: Claude-generated good cause statements and legal arguments
- **Penal Code Citations**: Automatic inclusion of PC § 1050, § 1382 for CA motions
- **DOCX Export**: Professional Word document ready for filing

### Security
- Attestation-based verification (no bar credentials stored)
- 30-minute session timeout with automatic cleanup
- Rate-limited AI generation (10 requests per 15 minutes)
- PII never sent to AI - only case metadata

---

## 🏗️ Architecture

```
├── client/                 # React frontend (Vite)
│   ├── components/         # Reusable UI components
│   │   └── attorney/       # Attorney portal components
│   ├── pages/              # Page components
│   └── lib/                # API clients and utilities
├── server/                 # Express backend
│   ├── routes.ts           # API endpoints
│   └── services/           # Business logic
│       └── attorney-docs/  # Document generation services
├── shared/                 # Shared types and data
│   ├── templates/          # Document template definitions
│   └── attorney/           # Attorney types and schemas
└── db/                     # Database schema (Drizzle ORM)
```

---

## 📄 License

This project uses a dual-license structure:

- **Code** (MIT License): All source code is licensed under the MIT License. See [LICENSE](LICENSE).
- **Content** (CC0 1.0): All non-code content (legal information, educational materials, templates) is released to the public domain under CC0. See [LICENSE-CONTENT](LICENSE-CONTENT).

This means you can freely use, modify, and distribute both the code and content. The CC0 license for content maximizes adoption for access to justice initiatives.

---

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a pull request.

---

**Disclaimer**: This platform provides legal information, not legal advice. Always consult with a licensed attorney for legal matters.
