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

## ❌ FAILED: Web Scraping Approaches (All Non-Viable)

### **Justia Codes** (CloudFront Blocking)
- **URL**: https://law.justia.com/codes/
- **Status**: ❌ **BLOCKED** - CloudFront CDN returns 403 Forbidden for all automated requests
- **Tested**: November 2025
- **Issue**: Bot detection at CDN level blocks before reaching servers, regardless of robots.txt compliance
- **Conclusion**: Not viable for programmatic access

### **State Legislature Websites** (Outdated URLs)
- **Tested States**: TX, FL, NY, IL, OH, NC, MI
- **Status**: ❌ **BROKEN** - URL structures changed, returning 404 errors
- **Example**: Texas `statutes.capitol.texas.gov` sections return 404
- **Issue**: Legislature websites redesign without maintaining old URL patterns
- **Conclusion**: Unsustainable - requires constant URL monitoring and updates

### **OpenLaws API** (Team Unresponsive)
- **Status**: ❌ **ABANDONED** - No response after weeks of outreach
- **Conclusion**: Unreliable for production use

---

## ✅ WORKING SOLUTION: Quality Over Quantity

### **Federal Statutes - GovInfo API** (ACTIVE)
- **URL**: https://www.govinfo.gov/app/details/USCODE-2021-title18
- **Coverage**: Complete Title 18 USC (federal criminal code)
- **Cost**: FREE (official government API)
- **Status**: ✅ **FULLY OPERATIONAL**
- **Reliability**: Stable, maintained by U.S. Government Publishing Office

### **State Statutes - Curated Seed Data** (ACTIVE)
- **Coverage**: 15 high-quality statutes across 10 major states
- **States**: CA (3), FL (2), TX (2), NY (2), GA, IL, MI, NC, OH, PA (1 each)
- **Content**: Common criminal offenses (assault, theft, burglary, robbery, fraud)
- **Status**: ✅ **VERIFIED AND OPERATIONAL**
- **Advantages**:
  - Manually verified for accuracy
  - No web scraping reliability issues
  - Covers most common user queries
  - Can expand strategically as needed

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

### Completed Actions:
1. ✅ **Complete**: GovInfo.gov federal integration - fully operational
2. ✅ **Complete**: Hybrid search combining local seed data + API results  
3. ✅ **Complete**: Curated seed data for 10 major states (15 statutes)
4. ❌ **Tested & Abandoned**: Justia web scraper (CloudFront blocking)
5. ❌ **Tested & Abandoned**: State website scrapers (404s, outdated URLs)
6. ❌ **Deprecated**: California Laws API (no longer accessible)
7. ❌ **Abandoned**: OpenLaws API (team not responding)

### Current Strategy:
**Quality over quantity** - Focus on verified, accurate data rather than unreliable web scraping

### Remaining Actions:
1. 🔜 **Next**: Expand seed data to 50 statutes covering top 15 states
2. 🔜 **Next**: Build charge → statute mapping using criminal-charges.ts data
3. 🔜 **Next**: Implement caching strategy for frequently accessed statutes
4. 🔜 **Future**: Monitor LegiScan for statute changes, update seed data quarterly

### Deployment Strategy:
- **Current**: Federal complete + 10 states operational
- **Month 1**: Expand to top 20 states with curated data
- **Month 2**: Statute → Charge mapping implementation
- **Month 3**: User testing & refinement based on actual queries
- **Ongoing**: Quarterly reviews and targeted seed data expansion

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

**Last Updated**: November 14, 2025
**Maintained By**: Public Defender AI Development Team
**License**: MIT (code) / CC0 (documentation)

**Major Update (Nov 14, 2025)**: After comprehensive testing of web scraping approaches (Justia, state websites), all proved non-viable due to bot blocking and URL rot. Pivoted to **quality-over-quantity strategy**: GovInfo federal API (complete coverage) + manually curated high-quality seed data for major states. This approach prioritizes data accuracy and reliability over fragile web scraping.
