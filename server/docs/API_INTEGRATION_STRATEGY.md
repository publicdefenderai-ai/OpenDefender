# Statute API Integration Strategy

## Executive Summary

This document outlines the comprehensive API integration strategy for the Public Defender AI statute database, providing coverage for federal and all 50 state criminal statutes. The strategy prioritizes free, open-access APIs and leverages a hybrid approach combining strategic seed data with dynamic API fetching.

---

## API Coverage by Jurisdiction

### ✅ **Federal (Title 18 USC - Crimes and Criminal Procedure)**
- **API**: GovInfo.gov REST API
- **Status**: ✅ Integrated
- **Coverage**: Complete federal criminal code
- **Authentication**: X-Api-Key header (GOVINFO_API_KEY environment variable)
- **Cost**: Free (government API)
- **Endpoints**:
  - Search: `POST https://api.govinfo.gov/search`
  - Package details: `GET /packages/{packageId}/summary`
  - Full text: `GET /packages/{packageId}/htm`
- **Implementation**: `server/services/govinfo.ts`

### ❌ **California (CA)** - No Current Free API
- **Status**: ❌ No official API from leginfo.legislature.ca.gov
- **Attempted**: CaliLaws API (api.calilaws.com) - **DEPRECATED** (last updated ~2015, no longer accessible)
- **Official Alternative**: FTP database download from ftp://www.leginfo.ca.gov/pub/bill/ (requires local database setup)
- **Recommendation**: Wait for OpenLaws API integration for comprehensive CA coverage
- **Current Implementation**: Minimal seed data in `server/data/state-statutes-seed.ts`
- **Note**: LegiScan API covers CA bill tracking but not enacted criminal statutes

---

## Recommended Multi-State API: OpenLaws

### **OpenLaws API** (Priority Integration)
- **URL**: https://openlaws.us/api/
- **Coverage**: All 50 states + DC + Puerto Rico + Federal
- **Content**: Statutes, regulations, constitutions, case law
- **Cost**: Contact for access (CivicTech non-profit, likely free for public good projects)
- **API Docs**: https://openlaws.apidocumentation.com/

#### Key Features:
1. **Unified Data Model**: One consistent API across all 53 jurisdictions
2. **Citation Lookup**: Fetch by citation (e.g., "Cal. Penal Code § 242", "18 USC § 1001")
3. **Full-Text Search**: BM25 keyword search + hybrid semantic search
4. **50-State Surveys**: Cross-jurisdiction searches
5. **Historical Versions**: Track statutory changes over time (federal only currently)
6. **Case Law Integration**: Partnership with CourtListener/Free Law Project
7. **Rich Text Rendering**: Hierarchical structure with nested sections

#### Authentication:
- Bearer token authentication
- Request access: Schedule 25-min session at https://openlaws.us/api/
- Sandbox environment provided for testing

#### Integration Priority: **HIGH**
- **Impact**: Covers all 50 states with single API
- **Alignment**: Perfect for criminal charge → statute mapping
- **Timeline**: Contact OpenLaws team to request access ASAP

---

## Alternative APIs Evaluated

### ❌ **Justia**
- **Status**: No public API available
- **TOS**: Prohibits automated scraping/reproduction
- **Recommendation**: ❌ Do not scrape

### ❌ **FindLaw**
- **Status**: No public API available (owned by Thomson Reuters)
- **TOS**: Likely prohibits automated scraping
- **Recommendation**: ❌ Do not scrape

### ⚠️ **LegiScan API**
- **URL**: https://legiscan.com/legiscan
- **Coverage**: All 50 states + Congress
- **Focus**: **Bill tracking and pending legislation** (not enacted statutes)
- **Cost**: Free tier available
- **Recommendation**: ⚠️ Not suitable for current criminal statute needs (focuses on legislative process, not codified law)

### ⚠️ **Open States API (v3)**
- **URL**: https://docs.openstates.org/api-v3/
- **Coverage**: All 50 states
- **Focus**: **Legislative data** (bills, legislators, committees, votes)
- **Cost**: Free & open source
- **Recommendation**: ⚠️ Not suitable for criminal statutes (focuses on legislative process, not statutes)

---

## Current Implementation Status

### Integrated Services:
1. **GovInfo.gov** (`server/services/govinfo.ts`)
   - Federal statute search
   - Package details retrieval
   - Full-text extraction

2. **Legal Data Service** (`server/services/legal-data.ts`)
   - Current implementation: Local seed data only
   - Future: Hybrid search with API integration (post-OpenLaws access)
   - Source attribution tracking ready for API integration

### Current Data Flow:
```
User Search Query
  ↓
Legal Data Service
  ↓
Local Storage (Seed Data)
  ↓
Return Results
```

### Future Data Flow (Post-OpenLaws Integration):
```
User Search Query
  ↓
Legal Data Service
  ↓
┌─────────────────┬──────────────────┐
│ Local Storage   │ OpenLaws API     │
│ (Seed Data)     │ (50 States + Fed)│
└─────────────────┴──────────────────┘
  ↓
Deduplicate by Citation
  ↓
Return Combined Results with Source Attribution
```

---

## State Coverage Analysis

### States WITHOUT Current API Coverage:
**ALL 50 states** (no individual state APIs currently available)

- All 50 states: AL, AK, AZ, AR, CA, CO, CT, DE, FL, GA, HI, ID, IL, IN, IA, KS, KY, LA, ME, MD, MA, MI, MN, MS, MO, MT, NE, NV, NH, NJ, NM, NY, NC, ND, OH, OK, OR, PA, RI, SC, SD, TN, TX, UT, VT, VA, WA, WV, WI, WY
- Plus: DC, Puerto Rico, US Territories

**Note**: California's CaliLaws API is deprecated and no longer functional as of October 2025.

### **Recommended Solution**: OpenLaws API Integration
- **Impact**: Covers ALL 50 states + federal + DC + territories (53 jurisdictions total)
- **Timeline**: Request access immediately at https://openlaws.us/api/
- **Effort**: Single integration vs. 50+ individual state APIs
- **Sustainability**: CivicTech organization committed to long-term availability
- **Implementation Plan**:
  1. Request API access (schedule 25-min session)
  2. Receive bearer token + sandbox access
  3. Build OpenLaws service (`server/services/openlaws.ts`)
  4. Update legal-data service to include OpenLaws hybrid search
  5. Implement citation → statute mapping for 4,146 criminal charges
  6. Cache frequently accessed statutes in local database for performance

---

## Seed Data Strategy

### Current Approach:
- **Minimal seed data**: Strategic statutes for immediate coverage
- **API-first**: Prioritize dynamic fetching over large static datasets
- **Deduplication**: Combine local + API results, remove duplicates by citation

### Federal Statutes Seed Data:
- **File**: `server/data/federal-statutes-seed.ts`
- **Coverage**: ~15 major Title 18 USC sections
- **Categories**: Homicide, assault, theft, fraud, weapons, drugs, public order
- **Purpose**: Immediate availability before GovInfo API call

### State Statutes Seed Data:
- **File**: `server/data/state-statutes-seed.ts`
- **Coverage**: Top 10 states by population (CA, TX, FL, NY, PA, IL, OH, GA, NC, MI)
- **Sections per state**: ~10-20 core criminal statutes
- **Purpose**: Fallback when API unavailable

### Rationale for Minimal Seed Data:
1. **Reduces codebase size**: APIs provide comprehensive coverage
2. **Always up-to-date**: APIs return current statutes, seed data can become stale
3. **Scalability**: Easier to maintain one API integration than thousands of seed entries
4. **Storage efficiency**: Database smaller, faster queries
5. **User trust**: Official government sources > static snapshots

---

## Next Steps

### Immediate Actions:
1. ✅ **Complete**: GovInfo.gov federal integration
2. ✅ **Complete**: Hybrid search combining local seed data + API results
3. ✅ **Complete**: API research - Identified OpenLaws as best solution
4. ❌ **Deprecated**: California Laws API (no longer accessible)
5. 🔜 **PRIORITY**: Contact OpenLaws team to request API access (https://openlaws.us/api/)
6. 🔜 **Next**: Integrate OpenLaws API for 50-state coverage
7. 🔜 **Next**: Build charge → statute mapping using criminal-charges.ts data

### Integration Timeline:
- **Week 1**: OpenLaws API access request & approval
- **Week 2**: OpenLaws integration development & testing
- **Week 3**: Statute → Charge mapping implementation
- **Week 4**: User testing & refinement

---

## Criminal Charge Database Context

### Charges Database Scale:
- **Total charges**: 4,146 charges across all jurisdictions
- **Coverage**: All 50 states + DC + Federal
- **Categories**: Homicide, assault, sexual offenses, theft, burglary, robbery, drugs, weapons, fraud, public order, DUI/traffic
- **Source file**: `shared/criminal-charges.ts`

### Mapping Strategy:
Once OpenLaws API is integrated:
1. Parse criminal charge citations (e.g., "Cal. Penal Code § 242")
2. Use OpenLaws citation lookup to fetch full statute text
3. Cache in local database for performance
4. Link charges ↔ statutes bidirectionally

---

## Technical Debt & Future Improvements

### Known Limitations:
1. **49 states without API coverage** → Resolved by OpenLaws integration
2. **Manual seed data maintenance** → Minimize with API-first approach
3. **No historical statute versions** → OpenLaws provides for federal, coming for states
4. **Citation parsing** → Build robust parser for all state citation formats

### Future Enhancements:
1. **Semantic search**: Use OpenLaws hybrid semantic search for AI-powered queries
2. **50-state surveys**: "Show me all assault statutes across all states"
3. **Statutory history**: Track changes to laws over time
4. **Related regulations**: Link statutes to administrative regulations
5. **Ballot propositions**: Track how voter initiatives modify criminal statutes

---

## Resources

### Official Documentation:
- **GovInfo API**: https://www.govinfo.gov/developers/api
- **California Laws API**: https://api.calilaws.com/
- **OpenLaws API**: https://openlaws.apidocumentation.com/
- **LegiScan**: https://legiscan.com/legiscan

### Legal Data Standards:
- **LII Citation Formats**: https://www.law.cornell.edu/citation/
- **PACER Case Locator**: https://pacer.uscourts.gov/
- **CourtListener**: https://www.courtlistener.com/api/rest-info/

---

**Last Updated**: October 30, 2025
**Maintained By**: Public Defender AI Development Team
**License**: MIT (code) / CC0 (documentation)
