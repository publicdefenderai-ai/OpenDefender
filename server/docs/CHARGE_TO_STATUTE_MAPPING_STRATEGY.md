# Criminal Charge to Statute Mapping Strategy

## Overview

This document outlines the strategy for connecting our 4,146 criminal charges to their underlying state and federal statutes, enabling users to see the actual law text, penalties, and official sources for each charge they're facing.

## Current Implementation Status

| Component | Status | Notes |
|-----------|--------|-------|
| Criminal Charges Database | ✅ Complete | 4,146 charges across all jurisdictions |
| State Statute Seed Data | ✅ Complete | 1,385+ statutes covering 51 jurisdictions |
| OpenLaws API Integration | ✅ Complete | Live citation lookup for 53 jurisdictions |
| Citation Parsing | ✅ Complete | Supports federal, all 50 states, DC, PR |
| Charge → Statute Lookup | ✅ Complete | Hybrid search (seed data + API) |

## Goal

When a user selects a charge like "Battery" in California, they should see:
- **Charge Name**: Battery
- **Charge Code**: 242 (from our database)
- **Full Citation**: Cal. Penal Code § 242
- **Statute Text**: "A battery is any willful and unlawful use of force or violence upon the person of another."
- **Penalties**: Misdemeanor, up to 6 months in county jail and/or $2,000 fine
- **Official Source**: Link to https://leginfo.legislature.ca.gov/

## Database Schema Connection

### Criminal Charges (shared/criminal-charges.ts)
```typescript
{
  id: 'ca-battery',
  name: 'Battery',
  code: '242',  // State-specific code number
  jurisdiction: 'CA',
  statuteCitations: ['Cal. Penal Code § 242']  // NEW FIELD - links to statutes table
}
```

### Statutes Table (shared/schema.ts)
```typescript
{
  citation: 'Cal. Penal Code § 242',
  jurisdiction: 'CA',
  content: 'A battery is any willful and unlawful use...',
  relatedCharges: ['Battery'],  // Bidirectional link
  url: 'https://leginfo.legislature.ca.gov/...'
}
```

## Mapping Strategy by State

### Federal Charges
- **Code Format**: USC section numbers (e.g., '1001', '922')
- **Citation Format**: `18 USC § {code}`
- **Source**: GovInfo.gov API (already integrated)
- **Example**: Code '1001' → '18 USC § 1001'

### State Charges

#### Alabama (AL)
- **Code Format**: Alabama Code sections (e.g., '13A-9-20')
- **Citation Format**: `Ala. Code § {code}`
- **Official Source**: http://alisondb.legislature.state.al.us/alison/CodeOfAlabama/1975/coatoc.htm
- **Example**: Code '13A-6-2' → 'Ala. Code § 13A-6-2'

#### California (CA)
- **Code Format**: Penal Code sections (e.g., '242', '459')
- **Citation Format**: `Cal. Penal Code § {code}`
- **Official Source**: https://leginfo.legislature.ca.gov/faces/codesTOCSelected.xhtml?tocCode=PEN
- **Structure**: 6 Parts → Titles → Chapters → Sections
- **Example**: Code '242' → 'Cal. Penal Code § 242'
- **Note**: Drug crimes may be in Health & Safety Code, vehicle crimes in Vehicle Code

#### Texas (TX)
- **Code Format**: Texas Penal Code sections (e.g., '19.02', '22.01')
- **Citation Format**: `Tex. Penal Code § {code}`
- **Official Source**: https://statutes.capitol.texas.gov/Docs/PE/htm/PE.19.htm
- **Example**: Code '19.02' → 'Tex. Penal Code § 19.02'

#### Florida (FL)
- **Code Format**: Florida Statutes sections (e.g., '782.04', '810.02')
- **Citation Format**: `Fla. Stat. § {code}`
- **Official Source**: http://www.leg.state.fl.us/statutes/
- **Example**: Code '782.04' → 'Fla. Stat. § 782.04'

#### New York (NY)
- **Code Format**: NY Penal Law sections (e.g., '125.25', '160.15')
- **Citation Format**: `N.Y. Penal Law § {code}`
- **Official Source**: https://www.nysenate.gov/legislation/laws/PEN
- **Example**: Code '125.25' → 'N.Y. Penal Law § 125.25'

#### Pennsylvania (PA)
- **Code Format**: PA Consolidated Statutes (e.g., '2502', '3921')
- **Citation Format**: `18 Pa.C.S. § {code}`
- **Official Source**: https://www.legis.state.pa.us/cfdocs/legis/LI/consCheck.cfm?txtType=HTM&ttl=18
- **Example**: Code '2502' → '18 Pa.C.S. § 2502'

#### Illinois (IL)
- **Code Format**: Illinois Compiled Statutes (e.g., '720-5/9-1', '720-5/12-3.2')
- **Citation Format**: `720 ILCS 5/{section}`
- **Official Source**: https://www.ilga.gov/legislation/ilcs/ilcs3.asp?ActID=1876&ChapterID=53
- **Example**: Code '720-5/9-1' → '720 ILCS 5/9-1'

#### Ohio (OH)
- **Code Format**: Ohio Revised Code (e.g., '2903.01', '2913.02')
- **Citation Format**: `Ohio Rev. Code Ann. § {code}`
- **Official Source**: https://codes.ohio.gov/ohio-revised-code
- **Example**: Code '2903.01' → 'Ohio Rev. Code Ann. § 2903.01'

#### Georgia (GA)
- **Code Format**: Georgia Code (e.g., '16-5-1', '16-8-2')
- **Citation Format**: `Ga. Code Ann. § {code}`
- **Official Source**: https://law.justia.com/codes/georgia/title-16/ (Note: GA doesn't have free .gov site)
- **Alternative**: Use Cornell LII or Justia for scraping
- **Example**: Code '16-5-1' → 'Ga. Code Ann. § 16-5-1'

#### North Carolina (NC)
- **Code Format**: NC General Statutes (e.g., '14-32', '14-54')
- **Citation Format**: `N.C. Gen. Stat. § {code}`
- **Official Source**: https://www.ncleg.gov/Laws/GeneralStatutes
- **Example**: Code '14-32' → 'N.C. Gen. Stat. § 14-32'

#### Michigan (MI)
- **Code Format**: Michigan Compiled Laws (e.g., '750.316', '750.356')
- **Citation Format**: `Mich. Comp. Laws § {code}`
- **Official Source**: http://legislature.mi.gov/
- **Example**: Code '750.316' → 'Mich. Comp. Laws § 750.316'

## Implementation Steps

### Phase 1: Automated Citation Generation (Quick Win)
For charges where the code directly maps to statute number:
1. Loop through all 4,146 charges
2. Use jurisdiction + code to generate citation automatically
3. Add to `statuteCitations` field
4. Example:
   ```typescript
   jurisdiction: 'CA', code: '242' 
   → statuteCitations: ['Cal. Penal Code § 242']
   ```

### Phase 2: Statute Scraping & Validation
For each state .gov site:
1. Scrape criminal code sections
2. Extract: citation, title, full text, penalties
3. Match scraped citations to our generated citations
4. Store in `statutes` table with `relatedCharges` bidirectional link
5. Flag any charges where citation doesn't match scraped data (needs manual review)

### Phase 3: UI Integration
1. Update Case Assessment flow to show statute when charge selected
2. Add "View Full Statute" link to official .gov source
3. Display statute text in plain language summary
4. Show penalties from statute (compare to charge maxPenalty field)

### Phase 4: Ongoing Maintenance
1. Use LegiScan API to detect enacted bills
2. When bill modifies criminal statute, queue for re-scrape
3. Update statute text quarterly
4. Validate statute citations still match charges

## Scraping Considerations

### Rate Limiting
- Respect robots.txt for all .gov sites
- Maximum 1 request per second per domain
- Implement exponential backoff on errors

### HTML Parsing Patterns
Each state has different HTML structure. Common patterns:
- **Table-based**: Sections in `<table>` rows
- **List-based**: Nested `<ul>` with section numbers
- **Div-based**: `<div class="statute">` containers
- **Custom**: State-specific legislative markup

### Error Handling
- Log failed scrapes to `statute_scrapes` table
- Queue failed sections for manual review
- Allow partial success (some sections scraped, some failed)

### Data Quality
- Validate citation format matches expected pattern
- Check for duplicate sections
- Verify penalties align with charge category (felony vs misdemeanor)
- Flag charges with no matching statute for manual review

## Special Cases

### Multi-Code Charges
Some charges may reference multiple statutes:
```typescript
{
  name: 'Aggravated Battery',
  code: '243',
  statuteCitations: [
    'Cal. Penal Code § 243(d)',  // Main statute
    'Cal. Penal Code § 242'      // Underlying battery definition
  ]
}
```

### Federal + State Overlap
Charges prosecutable in both jurisdictions:
```typescript
{
  name: 'Drug Trafficking',
  jurisdiction: 'US',
  statuteCitations: [
    '21 USC § 841',        // Federal
    'Cal. Health & Safety Code § 11352'  // State (if known)
  ]
}
```

### Missing Statutes
If statute not found after scraping:
1. Mark charge with `statuteCitations: null`
2. Log to review queue
3. Display message: "Official statute text pending - contact local legal aid"

## Success Metrics

- **Coverage**: % of charges with linked statutes (target: 95%+)
- **Accuracy**: % of citations that match official sources (target: 99%+)
- **Freshness**: % of statutes updated within last quarter (target: 100%)
- **User Impact**: % of users who view statute text during case assessment (track in analytics)

## Future Enhancements

1. **Plain Language Summaries**: AI-generated simple explanations of statute text
2. **Penalty Calculators**: Show sentencing ranges based on prior convictions, aggravating factors
3. **Case Law Links**: Connect statutes to relevant court precedents from CourtListener
4. **Statute Comparison**: Side-by-side view of how charge is defined in different states
