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
- Anthropic API key (for AI features)

**Installation:**

```bash
# Clone the repository
git clone https://github.com/shahabasghar/PublicDefenderAI.git
cd PublicDefenderAI

# Install dependencies
npm install

# Set up environment variables
# Create a .env file with required API keys and database URL

# Run database migrations
npm run db:push

# Start the development server
npm run dev
