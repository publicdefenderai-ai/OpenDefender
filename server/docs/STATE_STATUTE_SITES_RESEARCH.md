# State Statute Sites - Official .gov Sources for Web Scraping

## Overview

This document catalogs the official .gov websites for criminal statute codes across all 50 states, with detailed URL patterns, HTML structure notes, and scraping strategies for the top 10 states by population.

## Top 10 States (Priority Implementation)

### 1. California (CA) - Population: 39.5M
**Criminal Code**: Penal Code  
**Official Site**: https://leginfo.legislature.ca.gov/  
**Direct Link**: https://leginfo.legislature.ca.gov/faces/codesTOCSelected.xhtml?tocCode=PEN

**URL Pattern**:
- Table of Contents: `/faces/codesTOCSelected.xhtml?tocCode=PEN`
- Individual Sections: `/faces/codes_displaySection.xhtml?sectionNum={section}&lawCode=PEN`
- Example: https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=242&lawCode=PEN

**Structure**:
- 6 Parts → Titles → Chapters → Sections
- Part 1 (§25–680.4): Crimes and Punishments
- Part 2 (§681–1620): Criminal Procedure
- Part 3 (§2000–10008): Imprisonment and Death Penalty

**Citation Format**: `Cal. Penal Code § {section}`  
**Examples**:
- Battery: Cal. Penal Code § 242
- Burglary: Cal. Penal Code § 459
- Murder: Cal. Penal Code § 187

**Special Notes**:
- Drug crimes: Health & Safety Code (not Penal Code)
- Traffic crimes: Vehicle Code (not Penal Code)
- Well-structured HTML with clear section numbers and titles

---

### 2. Texas (TX) - Population: 29.1M
**Criminal Code**: Texas Penal Code  
**Official Site**: https://statutes.capitol.texas.gov/  
**Direct Link**: https://statutes.capitol.texas.gov/?link=PE

**URL Pattern**:
- Table of Contents: `/Docs/PE/htm/PE.toc.htm`
- Individual Chapters: `/Docs/PE/htm/PE.{chapter}.htm`
- Full PDF: `/docs/sdocs/penalcode.pdf`
- Example: https://statutes.capitol.texas.gov/Docs/PE/htm/PE.19.htm (Homicide)

**Structure**:
- 11 Titles → Chapters → Sections
- Title 5: Offenses Against the Person
- Title 7: Offenses Against Property
- Title 10: Offenses Against Public Health, Safety, and Morals

**Citation Format**: `Tex. Penal Code § {chapter}.{section}`  
**Examples**:
- Murder: Tex. Penal Code § 19.02
- Assault: Tex. Penal Code § 22.01
- Theft: Tex. Penal Code § 31.03

**Special Notes**:
- Clean HTML structure, easy to parse
- PDF available for full code download
- Updated through 89th Legislative Session (2025)

---

### 3. Florida (FL) - Population: 21.5M
**Criminal Code**: Florida Statutes Title XLVI (Crimes)  
**Official Site**: https://www.leg.state.fl.us/  
**Direct Link**: https://www.leg.state.fl.us/Statutes/

**URL Pattern**:
- Table of Contents: `/Statutes/index.cfm?App_mode=Display_Index&Title_Request=XLVI`
- Individual Chapters: `/Statutes/index.cfm?App_mode=Display_Statute&Ch={chapter}`
- Individual Sections: `/Statutes/index.cfm?App_mode=Display_Statute&Search_String=&URL={chapter}/{section}.html`
- Alternative: https://www.flsenate.gov/Laws/Statutes

**Structure**:
- Title XLVI (Crimes): Chapters 775-896
- Title XLVII (Criminal Procedure): Chapters 900-985
- Chapter 775: General Penalties
- Chapters 776-896: Specific criminal offenses

**Citation Format**: `Fla. Stat. § {chapter}.{section}`  
**Examples**:
- Murder: Fla. Stat. § 782.04
- Burglary: Fla. Stat. § 810.02
- Battery: Fla. Stat. § 784.03

**Special Notes**:
- Updated annually after legislative sessions (July/August)
- Two official sources (leg.state.fl.us and flsenate.gov)
- FDLE Statute Search Tool available: https://web.fdle.state.fl.us/statutes/search.jsf

---

### 4. New York (NY) - Population: 19.5M
**Criminal Code**: Penal Law (Chapter 40 of Consolidated Laws)  
**Official Site**: https://www.nysenate.gov/  
**Direct Link**: https://www.nysenate.gov/legislation/laws/PEN/-CH40

**URL Pattern**:
- Table of Contents: `/legislation/laws/PEN/-CH40`
- Individual Articles: `/legislation/laws/PEN/A{article}`
- Individual Sections: `/legislation/laws/PEN/{section}`
- Example: https://www.nysenate.gov/legislation/laws/PEN/125.25 (Murder 2nd Degree)

**Structure**:
- Articles organized by offense type
- Article 120: Assault
- Article 125: Homicide
- Article 130: Sex Offenses
- Article 140: Burglary and Related Offenses
- Article 155: Larceny

**Citation Format**: `N.Y. Penal Law § {section}`  
**Examples**:
- Murder 2nd Degree: N.Y. Penal Law § 125.25
- Assault 3rd Degree: N.Y. Penal Law § 120.00
- Burglary 2nd Degree: N.Y. Penal Law § 140.25

**Special Notes**:
- Alternative source: https://public.leginfo.state.ny.us/
- NY Courts Criminal Jury Instructions: https://www.nycourts.gov/judges/cji/2-PenalLaw/cji3.shtml
- Clean, modern JSON-based API available (OpenLegislation)

---

### 5. Pennsylvania (PA) - Population: 12.8M
**Criminal Code**: Title 18 (Crimes and Offenses)  
**Official Site**: https://www.legis.state.pa.us/  
**Direct Link**: https://www.legis.state.pa.us/cfdocs/legis/LI/consCheck.cfm?txtType=HTM&ttl=18

**URL Pattern**:
- Table of Contents: `/cfdocs/legis/LI/consCheck.cfm?txtType=HTM&ttl=18`
- Individual Parts: `/WU01/LI/LI/CT/HTM/18/18.HTM` (requires navigation)
- Alternative: https://www.pacodeandbulletin.gov/

**Structure**:
- Title 18: Crimes and Offenses
- Organized by Parts → Chapters → Sections
- Part II: Definition of Specific Offenses
  - Article A: Offenses Against the Person
  - Article B: Offenses Against Property
  - Article C: Offenses Against Family
  - Article D: Offenses Against Public Administration

**Citation Format**: `18 Pa.C.S. § {section}`  
**Examples**:
- Murder: 18 Pa.C.S. § 2502
- Burglary: 18 Pa.C.S. § 3502
- Theft: 18 Pa.C.S. § 3921

**Special Notes**:
- Complex frameset-based HTML (challenging to scrape)
- Alternative cleaner source: PA Code and Bulletin
- May require headless browser for navigation

---

### 6. Illinois (IL) - Population: 12.7M
**Criminal Code**: 720 ILCS 5 (Criminal Code of 2012)  
**Official Site**: https://www.ilga.gov/  
**Direct Link**: https://www.ilga.gov/legislation/ilcs/ilcs3.asp?ChapterID=53&ActID=1876

**URL Pattern**:
- Table of Contents: `/legislation/ilcs/ilcs3.asp?ChapterID=53&ActID=1876`
- Individual Articles: `/legislation/ilcs/ilcs4.asp?DocName=072000050HArt.+{article}&ActID=1876&ChapterID=53`
- Individual Sections: `/legislation/ilcs/fulltext.asp?DocName=072000050K{section}`
- Example: https://www.ilga.gov/legislation/ilcs/fulltext.asp?DocName=072000050K9-1 (Murder)

**Structure**:
- Title I: General Provisions
- Title II: Principles of Criminal Liability
- Title III: Specific Offenses
  - Article 9: Homicide
  - Article 11: Sex Offenses (multiple subdivisions)
  - Article 12: Bodily Harm
  - Article 18: Theft and Deception

**Citation Format**: `720 ILCS 5/{article}-{section}`  
**Examples**:
- First Degree Murder: 720 ILCS 5/9-1
- Burglary: 720 ILCS 5/19-1
- Battery: 720 ILCS 5/12-3

**Special Notes**:
- Complex section numbering system
- Frequent use of subdivisions (11-1.20, 11-1.30, etc.)
- ILGA database updated regularly

---

### 7. Ohio (OH) - Population: 11.7M
**Criminal Code**: Ohio Revised Code Title 29 (Crimes)  
**Official Site**: https://codes.ohio.gov/  
**Direct Link**: https://codes.ohio.gov/ohio-revised-code

**URL Pattern**:
- Table of Contents: `/ohio-revised-code`
- Individual Chapters: `/ohio-revised-code/chapter-{chapter}`
- Individual Sections: `/ohio-revised-code/section-{chapter}.{section}`
- Example: https://codes.ohio.gov/ohio-revised-code/section-2903.02 (Murder)

**Structure**:
- Title 29: Crimes-Procedure
- Chapter 2903: Homicide and Assault
- Chapter 2907: Sex Offenses
- Chapter 2909: Arson and Related Offenses
- Chapter 2911: Robbery, Burglary, and Trespass
- Chapter 2913: Theft and Fraud
- Chapter 2925: Drug Offenses
- Chapter 2929: Penalties and Sentencing

**Citation Format**: `Ohio Rev. Code Ann. § {chapter}.{section}`  
**Examples**:
- Murder: Ohio Rev. Code Ann. § 2903.02
- Burglary: Ohio Rev. Code Ann. § 2911.12
- Theft: Ohio Rev. Code Ann. § 2913.02

**Special Notes**:
- Clean, modern website (maintained by Legislative Service Commission)
- PDF downloads available for each section
- Effective dates and legislative history included
- Excellent for scraping (structured JSON data available)

---

### 8. Georgia (GA) - Population: 10.7M
**Criminal Code**: Georgia Code Title 16 (Crimes and Offenses)  
**Official Site**: ⚠️ **NO FREE .GOV SITE AVAILABLE**  
**Alternative Sources**:
- Justia: https://law.justia.com/codes/georgia/title-16/
- Cornell LII: https://law.cornell.edu/states/georgia
- LexisNexis (official but paid)

**URL Pattern** (Justia):
- Table of Contents: `/codes/georgia/title-16/`
- Individual Chapters: `/codes/georgia/title-16/chapter-{chapter}/`
- Individual Sections: `/codes/georgia/title-16/chapter-{chapter}/section-{section}/`

**Structure**:
- Title 16: Crimes and Offenses
- Chapter 5: Crimes Against the Person
- Chapter 7: Damage to and Intrusion Upon Property
- Chapter 8: Offenses Involving Theft
- Chapter 13: Controlled Substances

**Citation Format**: `Ga. Code Ann. § {title}-{chapter}-{section}`  
**Examples**:
- Murder: Ga. Code Ann. § 16-5-1
- Burglary: Ga. Code Ann. § 16-7-1
- Theft: Ga. Code Ann. § 16-8-2

**Special Notes**:
- Georgia does NOT provide free official .gov access to statutes
- Must use third-party aggregators (Justia, Cornell LII)
- Terms of Service may prohibit automated scraping
- Consider manual data entry or licensed API access

---

### 9. North Carolina (NC) - Population: 10.5M
**Criminal Code**: General Statutes Chapter 14 (Criminal Law)  
**Official Site**: https://www.ncleg.gov/  
**Direct Link**: https://www.ncleg.gov/Laws/GeneralStatuteSections/Chapter14

**URL Pattern**:
- Table of Contents: `/Laws/GeneralStatuteSections/Chapter14`
- HTML Full Chapter: `/EnactedLegislation/Statutes/HTML/ByChapter/Chapter_14.html`
- PDF Full Chapter: `/EnactedLegislation/Statutes/PDF/ByChapter/Chapter_14.pdf`
- Individual Sections: `/EnactedLegislation/Statutes/PDF/BySection/Chapter_14/GS_{section}.pdf`
- Example: https://www.ncleg.gov/EnactedLegislation/Statutes/PDF/BySection/Chapter_14/GS_14-1.pdf

**Structure**:
- Chapter 14: Criminal Law
- Subchapter I: General Provisions
- Articles organized by offense type
  - Article 6: Homicide
  - Article 7-7B: Rape and Sex Offenses
  - Article 8: Assaults
  - Article 14: Burglary
  - Article 16: Larceny

**Citation Format**: `N.C. Gen. Stat. § {chapter}-{section}`  
**Examples**:
- Murder: N.C. Gen. Stat. § 14-17
- Burglary: N.C. Gen. Stat. § 14-51
- Assault: N.C. Gen. Stat. § 14-33

**Special Notes**:
- Both HTML and PDF versions available
- Can browse by Article or Section
- PDFs are clean and easy to parse
- Not the "official" version (printed volumes are official) but reliable

---

### 10. Michigan (MI) - Population: 10.0M
**Criminal Code**: Michigan Compiled Laws Chapter 750 (Michigan Penal Code)  
**Official Site**: http://legislature.mi.gov/  
**Direct Link**: http://legislature.mi.gov/doc.aspx?mcl-chap750

**URL Pattern**:
- Table of Contents: `/doc.aspx?mcl-chap750`
- Individual Sections: `/doc.aspx?mcl-{chapter}-{section}`
- Example: http://legislature.mi.gov/doc.aspx?mcl-750-316 (Murder)

**Structure**:
- Chapter 750: Michigan Penal Code
- Organized by offense type within single chapter
- Sections 1-568: Various criminal offenses
- Common ranges:
  - §316-329: Homicide
  - §349-360: Kidnapping and Abduction
  - §110-115: Burglary
  - §356-357: Larceny

**Citation Format**: `Mich. Comp. Laws § {chapter}.{section}`  
**Examples**:
- Murder: Mich. Comp. Laws § 750.316
- Burglary: Mich. Comp. Laws § 750.110
- Larceny: Mich. Comp. Laws § 750.356

**Special Notes**:
- Simple URL pattern (easy to scrape)
- Clean HTML structure
- All criminal law in Chapter 750

---

## Scraping Strategy Summary

### Easy to Scrape (Good HTML Structure)
1. **Texas**: Clean HTML, chapter-based URLs
2. **Ohio**: Modern site, JSON data available
3. **Michigan**: Simple URL pattern, clean HTML
4. **New York**: OpenLegislation API available

### Moderate Difficulty
1. **California**: Well-structured but dynamic (JSF framework)
2. **Florida**: Two sources, requires chapter navigation
3. **Illinois**: Complex section numbering
4. **North Carolina**: PDF and HTML both available

### Challenging
1. **Pennsylvania**: Frameset-based, may need headless browser
2. **Georgia**: ⚠️ **NO .GOV SITE** - must use third-party (Justia/Cornell)

---

## Implementation Priority

### Phase 1: Quick Wins (States 1-4)
Start with states that have clean HTML and simple URL patterns:
1. **Texas** - Cleanest structure
2. **Ohio** - Modern site with JSON
3. **Michigan** - Simple URLs
4. **New York** - API available

### Phase 2: Standard Scraping (States 5-8)
1. **California** - Most important (largest population)
2. **Florida** - Two official sources
3. **Illinois** - Complex numbering
4. **North Carolina** - PDF + HTML

### Phase 3: Special Cases (States 9-10)
1. **Pennsylvania** - Frameset navigation
2. **Georgia** - Third-party only (manual entry or licensed API)

---

## Robots.txt Compliance

Before scraping any site, check robots.txt:
- California: https://leginfo.legislature.ca.gov/robots.txt
- Texas: https://statutes.capitol.texas.gov/robots.txt
- Florida: https://www.leg.state.fl.us/robots.txt
- etc.

**Rate Limiting Rules**:
- Maximum 1 request per second per domain
- Implement exponential backoff on errors
- Use respectful User-Agent string
- Honor Crawl-delay directives

---

## Next Steps

1. ✅ Document all 50 states (this file covers top 10)
2. 🔄 Fetch sample HTML pages to analyze structure
3. ⏳ Build state-specific HTML parsers
4. ⏳ Implement robots.txt checker
5. ⏳ Build rate limiter with exponential backoff
6. ⏳ Create scraping queue system
7. ⏳ Test scrapers on small samples (3-5 sections per state)
8. ⏳ Full scrape of top 10 states
9. ⏳ Validate data quality
10. ⏳ Expand to remaining 40 states
