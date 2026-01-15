# Statute API Integration Strategy

## Executive Summary

This document outlines the comprehensive API integration strategy for the Public Defender AI statute database, providing coverage for federal and all 50 state criminal statutes. The platform uses a **hybrid approach**: extensive curated seed data (1,385+ statutes across 51 jurisdictions) combined with live OpenLaws API for dynamic lookups.

---

## Current Implementation Status

### ✅ **FULLY OPERATIONAL**

| Component | Status | Coverage |
|-----------|--------|----------|
| **Federal Statutes (GovInfo API)** | ✅ Active | Complete Title 18 USC |
| **State Statutes (Seed Data)** | ✅ Active | 1,385+ statutes across 51 jurisdictions |
| **OpenLaws API** | ✅ Active | 53 jurisdictions (50 states + DC + PR + Federal) |
| **LegiScan API** | ⚠️ Monitoring | Bill tracking for statute change alerts |

---

## API Coverage by Jurisdiction

### ✅ **Federal (Title 18 USC - Crimes and Criminal Procedure)**
- **API**: GovInfo.gov REST API
- **Status**: ✅ Fully Integrated
- **Coverage**: Complete federal criminal code
- **Authentication**: X-Api-Key header (GOVINFO_API_KEY environment variable)
- **Cost**: Free (government API)
- **Endpoints**:
  - Search: `POST https://api.govinfo.gov/search`
  - Package details: `GET /packages/{packageId}/summary`
  - Full text: `GET /packages/{packageId}/htm`
- **Implementation**: `server/services/govinfo.ts`

### ✅ **All 50 States + DC (OpenLaws API)**
- **API**: OpenLaws REST API
- **Status**: ✅ Fully Integrated
- **Coverage**: 4.3M+ statute sections across 53 jurisdictions
- **Authentication**: Bearer token (OPENLAWS_API_KEY environment variable)
- **Cost**: Free (CivicTech initiative)
- **Documentation**: https://docs.openlaws.us/version-104/api-reference
- **Implementation**: `server/services/openlaws-client.ts`
- **Features**:
  - Citation-based lookup (e.g., "Cal. Penal Code § 242")
  - Hierarchical division traversal
  - Level-by-level section search with BFS algorithm
  - Supports all citation formats (federal, state-specific, NJ colon-style, etc.)

---

## State Statute Seed Data Coverage

### Coverage Summary
- **Total Statutes**: 1,385+
- **Jurisdictions**: 51 (all 50 states + DC)
- **File**: `server/data/state-statutes-seed.ts`

### Statutes by Jurisdiction (Top 20)

| Rank | State | Count | | Rank | State | Count |
|------|-------|-------|--|------|-------|-------|
| 1 | NY | 61 | | 11 | AZ | 31 |
| 2 | CA | 59 | | 12 | AL | 29 |
| 3 | TX | 57 | | 13 | WI, WA, MD, CO, AR | 27 ea |
| 4 | FL | 57 | | 14 | CT, AK | 26 ea |
| 5 | IL | 54 | | 15 | LA | 25 |
| 6 | PA | 51 | | 16 | MN, KY | 24 ea |
| 7 | OH | 51 | | 17 | KS | 22 |
| 8 | GA | 47 | | 18 | TN, SC, MS | 21 ea |
| 9 | MI | 45 | | 19 | UT, SD, OR, MO, MA, IA, HI | 20 ea |
| 10 | NC | 44 | | 20 | VA, OK, MT, DE | 19 ea |

### Complete State Coverage (All 51 Jurisdictions)
All remaining states have 15-19 statutes each: WV, RI, NV, NM, DC, NJ, NH, NE, IN, ID, WY, ND, ME, VT

### Categories Covered Per State
- Assault (simple & aggravated)
- Theft/Larceny (petty & grand)
- Burglary, Robbery, Motor vehicle theft
- Drug possession & trafficking
- DUI/DWI
- Domestic violence
- Vandalism/Criminal mischief
- Trespassing, Disorderly conduct
- Weapons offenses
- Fraud, Identity theft
- Prostitution, Resisting arrest
- Harassment/stalking, Forgery

---

## Current Data Flow

```
User Search Query
  ↓
Legal Data Service
  ↓
┌─────────────────────┬──────────────────────┐
│ Local Seed Data     │ OpenLaws API         │
│ (1,385+ statutes)   │ (4.3M+ sections)     │
└─────────────────────┴──────────────────────┘
  ↓
Check Local First → If Not Found → Query OpenLaws API
  ↓
Return Results with Source Attribution
```

### API Endpoints

| Endpoint | Purpose |
|----------|---------|
| `GET /api/openlaws/status` | Check OpenLaws API availability |
| `GET /api/openlaws/citation/:citation` | Lookup statute by citation string |
| `GET /api/statutes` | Search seed data statutes |
| `GET /api/federal-statutes` | Search federal statutes via GovInfo |

---

## OpenLaws Client Features

### Citation Parsing
The OpenLaws client (`server/services/openlaws-client.ts`) parses multiple citation formats:

| Format | Example | Jurisdiction |
|--------|---------|--------------|
| Federal | `18 U.S.C. § 1001` | FED |
| California | `Cal. Penal Code § 187` | CA |
| New Jersey | `N.J.S.A. 2C:15-1` | NJ |
| Kansas | `K.S.A. 21-5413` | KS |
| DC Code | `D.C. Code § 22-2101` | DC |
| Simple | `FL Stat 784.03` | FL |
| With subsection | `Cal. Penal Code § 459(a)` | CA |

### Hierarchical Search Algorithm
Uses breadth-first search to navigate state statute hierarchies:
1. Parse citation to extract jurisdiction and section
2. Get root divisions for the jurisdiction's statute compilation
3. Prioritize compilations matching code hint (e.g., "Penal")
4. Traverse level-by-level until section found
5. Return full statute text with markdown content

---

## Alternative APIs Evaluated

### ❌ **Justia**
- **Status**: No public API available
- **TOS**: Prohibits automated scraping/reproduction
- **Conclusion**: Not viable

### ❌ **FindLaw**
- **Status**: No public API (owned by Thomson Reuters)
- **Conclusion**: Not viable

### ❌ **Web Scraping (All State Sites)**
- **Tested**: Justia, Texas, Florida, New York, Illinois, Ohio, NC, MI
- **Issues**: CloudFront blocking, URL rot, inconsistent HTML structures
- **Conclusion**: Not viable for production use

### ⚠️ **LegiScan API**
- **Status**: Integrated for monitoring
- **Use Case**: Bill tracking and legislative change alerts
- **Limitation**: Focuses on pending legislation, not codified statutes
- **Implementation**: `server/services/legiscan.ts`

---

## Criminal Charge Database Integration

### Database Scale
- **Total charges**: 4,146 across all jurisdictions
- **Coverage**: All 50 states + DC + Federal
- **Categories**: Homicide, assault, sexual offenses, theft, burglary, robbery, drugs, weapons, fraud, public order, DUI/traffic
- **Source file**: `shared/criminal-charges.ts`

### Charge → Statute Mapping
1. Parse charge citations (e.g., "Cal. Penal Code § 242")
2. Look up in seed data first (fast, offline)
3. If not found, query OpenLaws API (comprehensive, live)
4. Cache results in local database for performance
5. Link charges ↔ statutes bidirectionally

---

## Maintenance Strategy

### Quarterly Updates
1. Run LegiScan API to detect enacted criminal law changes
2. Update affected seed data entries
3. Validate citations still resolve via OpenLaws API
4. Log any broken citations for review

### Data Quality Assurance
- Automated startup validation of charge codes against statute citations
- User feedback tracking for statute helpfulness
- Error logging for failed OpenLaws lookups

---

## Resources

### Official Documentation
- **GovInfo API**: https://www.govinfo.gov/developers/api
- **OpenLaws API**: https://docs.openlaws.us/version-104/api-reference
- **LegiScan**: https://legiscan.com/legiscan

### Legal Data Standards
- **LII Citation Formats**: https://www.law.cornell.edu/citation/
- **PACER Case Locator**: https://pacer.uscourts.gov/
- **CourtListener**: https://www.courtlistener.com/api/rest-info/

---

**Last Updated**: January 15, 2026
**Maintained By**: Public Defender AI Development Team
**License**: MIT (code) / CC0 (documentation)

**Major Update (Jan 15, 2026)**: Documentation updated to reflect current implementation. OpenLaws API is now fully integrated with working citation lookup. Seed data expanded to 1,385+ statutes covering all 51 jurisdictions. Hybrid search strategy (seed data + API) is fully operational.
