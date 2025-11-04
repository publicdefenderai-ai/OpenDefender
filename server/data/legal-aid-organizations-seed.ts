import { type InsertLegalAidOrganization } from "@shared/schema";

// Comprehensive legal aid organizations database
// Sources: EOIR Pro Bono List, Legal Services Corporation (LSC), State/County PD Offices, Federal Defender Directory
// Last Updated: November 2025

export const legalAidOrganizationsSeed: InsertLegalAidOrganization[] = [
  // ========== IMMIGRATION LEGAL AID - EOIR PRO BONO LIST ==========
  
  // California Immigration Organizations
  {
    name: "San Francisco Public Defender's Office - Immigration Unit",
    organizationType: "immigration",
    address: "555 7th Street",
    city: "San Francisco",
    state: "CA",
    zipCode: "94103",
    county: "San Francisco",
    phone: "(628) 271-9898",
    email: null,
    website: "https://sfpublicdefender.org",
    latitude: "37.7800",
    longitude: "-122.4075",
    services: [
      "Deportation Defense",
      "Asylum Applications",
      "Withholding of Removal",
      "VAWA Petitions",
      "U Visa Applications",
      "SIJS"
    ],
    eligibility: "Must have pending immigration court case in San Francisco. Low-income individuals prioritized.",
    dataSource: "EOIR",
    isActive: true,
  },
  {
    name: "Alameda County Public Defender - Immigration Representation Unit",
    organizationType: "immigration",
    address: "1401 Lakeside Drive, 12th Floor",
    city: "Oakland",
    state: "CA",
    zipCode: "94612",
    county: "Alameda",
    phone: "(510) 272-6611",
    email: null,
    website: "https://www.acgov.org/defender/",
    latitude: "37.8058",
    longitude: "-122.2631",
    services: [
      "Deportation Defense",
      "Bond Hearings",
      "Asylum Applications",
      "Immigration Appeals"
    ],
    eligibility: "Alameda County residents in immigration detention or with court cases.",
    dataSource: "EOIR",
    isActive: true,
  },
  {
    name: "Immigrant Legal Resource Center (ILRC)",
    organizationType: "immigration",
    address: "1663 Mission Street, Suite 602",
    city: "San Francisco",
    state: "CA",
    zipCode: "94103",
    county: "San Francisco",
    phone: "(415) 255-9499",
    email: "info@ilrc.org",
    website: "https://www.ilrc.org",
    latitude: "37.7697",
    longitude: "-122.4192",
    services: [
      "Immigration Legal Training",
      "Technical Assistance",
      "Impact Litigation",
      "Policy Advocacy"
    ],
    eligibility: "Serves legal service providers and immigrants nationwide.",
    dataSource: "EOIR",
    isActive: true,
  },
  {
    name: "Asian Law Alliance",
    organizationType: "immigration",
    address: "991 W. Hedding Street, Suite 202",
    city: "San Jose",
    state: "CA",
    zipCode: "95126",
    county: "Santa Clara",
    phone: "(408) 287-9710",
    email: "info@asianlawalliance.org",
    website: "https://www.asianlawalliance.org",
    latitude: "37.3491",
    longitude: "-121.9166",
    services: [
      "Immigration Status Assistance",
      "Naturalization",
      "Family-Based Petitions",
      "Deportation Defense"
    ],
    eligibility: "Low-income individuals in Santa Clara County.",
    dataSource: "EOIR",
    isActive: true,
  },
  {
    name: "Central American Resource Center (CARECEN) - Los Angeles",
    organizationType: "immigration",
    address: "2845 W. 7th Street",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90005",
    county: "Los Angeles",
    phone: "(213) 385-7800",
    email: "info@carecen-la.org",
    website: "https://www.carecen-la.org",
    latitude: "34.0577",
    longitude: "-118.2957",
    services: [
      "Asylum Applications",
      "DACA",
      "TPS",
      "Citizenship",
      "Family Reunification"
    ],
    eligibility: "Low-income immigrants in Los Angeles area.",
    dataSource: "EOIR",
    isActive: true,
  },

  // New York Immigration Organizations
  {
    name: "The Legal Aid Society - Immigration Law Unit",
    organizationType: "immigration",
    address: "199 Water Street",
    city: "New York",
    state: "NY",
    zipCode: "10038",
    county: "New York",
    phone: "(212) 577-3300",
    email: null,
    website: "https://www.legalaidnyc.org",
    latitude: "40.7058",
    longitude: "-74.0052",
    services: [
      "Deportation Defense",
      "Asylum",
      "Special Immigrant Juvenile Status",
      "U Visa",
      "T Visa",
      "VAWA"
    ],
    eligibility: "Low-income individuals in New York City immigration proceedings.",
    dataSource: "EOIR",
    isActive: true,
  },
  {
    name: "New York Legal Assistance Group (NYLAG) - Immigration Protection Unit",
    organizationType: "immigration",
    address: "7 Hanover Square, 18th Floor",
    city: "New York",
    state: "NY",
    zipCode: "10004",
    county: "New York",
    phone: "(212) 613-5000",
    email: "immigration@nylag.org",
    website: "https://www.nylag.org",
    latitude: "40.7043",
    longitude: "-74.0091",
    services: [
      "Immigration Status Assistance",
      "Deportation Defense",
      "Asylum Applications",
      "Naturalization"
    ],
    eligibility: "Low-income New York City residents.",
    dataSource: "EOIR",
    isActive: true,
  },
  {
    name: "Catholic Charities Community Services - Immigration Legal Services",
    organizationType: "immigration",
    address: "1011 First Avenue, 11th Floor",
    city: "New York",
    state: "NY",
    zipCode: "10022",
    county: "New York",
    phone: "(212) 419-3700",
    email: null,
    website: "https://www.catholiccharitiesny.org",
    latitude: "40.7535",
    longitude: "-73.9669",
    services: [
      "Family-Based Immigration",
      "Citizenship",
      "DACA",
      "Asylum",
      "TPS"
    ],
    eligibility: "Low-income immigrants in the New York Archdiocese area.",
    dataSource: "EOIR",
    isActive: true,
  },

  // Texas Immigration Organizations
  {
    name: "RAICES (Refugee and Immigrant Center for Education and Legal Services)",
    organizationType: "immigration",
    address: "500 6th Street",
    city: "San Antonio",
    state: "TX",
    zipCode: "78215",
    county: "Bexar",
    phone: "(210) 375-9673",
    email: "info@raicestexas.org",
    website: "https://www.raicestexas.org",
    latitude: "29.4222",
    longitude: "-98.4894",
    services: [
      "Deportation Defense",
      "Bond Representation",
      "Asylum",
      "Family Reunification",
      "Children's Immigration Services"
    ],
    eligibility: "Low-income immigrants in Texas, especially those in detention.",
    dataSource: "EOIR",
    isActive: true,
  },
  {
    name: "American Gateways",
    organizationType: "immigration",
    address: "2900 Live Oak Street",
    city: "Dallas",
    state: "TX",
    zipCode: "75204",
    county: "Dallas",
    phone: "(512) 478-0546",
    email: "info@americangateways.org",
    website: "https://www.americangateways.org",
    latitude: "32.7821",
    longitude: "-96.7751",
    services: [
      "Asylum Applications",
      "Special Immigrant Juvenile Status",
      "VAWA",
      "U Visa",
      "Citizenship"
    ],
    eligibility: "Low-income families, children, and domestic violence survivors in Central Texas.",
    dataSource: "EOIR",
    isActive: true,
  },

  // Florida Immigration Organizations
  {
    name: "Americans for Immigrant Justice",
    organizationType: "immigration",
    address: "6355 NW 36th Street, Suite 101",
    city: "Miami",
    state: "FL",
    zipCode: "33166",
    county: "Miami-Dade",
    phone: "(305) 573-1106",
    email: "info@aijustice.org",
    website: "https://www.aijustice.org",
    latitude: "25.8079",
    longitude: "-80.3154",
    services: [
      "Deportation Defense",
      "Asylum",
      "Family-Based Immigration",
      "U Visa",
      "VAWA",
      "Citizenship"
    ],
    eligibility: "Low-income immigrants in South Florida.",
    dataSource: "EOIR",
    isActive: true,
  },

  // Illinois Immigration Organizations
  {
    name: "National Immigrant Justice Center (NIJC)",
    organizationType: "immigration",
    address: "224 S. Michigan Avenue, Suite 600",
    city: "Chicago",
    state: "IL",
    zipCode: "60604",
    county: "Cook",
    phone: "(312) 660-1370",
    email: "info@immigrantjustice.org",
    website: "https://www.immigrantjustice.org",
    latitude: "41.8780",
    longitude: "-87.6240",
    services: [
      "Deportation Defense",
      "Asylum",
      "Detained Individuals Representation",
      "Policy Advocacy"
    ],
    eligibility: "Detained and low-income immigrants in Illinois and nationwide.",
    dataSource: "EOIR",
    isActive: true,
  },

  // ========== LSC-FUNDED CRIMINAL/CIVIL LEGAL AID ORGANIZATIONS ==========
  
  // California LSC Grantees
  {
    name: "Legal Aid Foundation of Los Angeles (LAFLA)",
    organizationType: "civil_legal_aid",
    address: "1102 Crenshaw Boulevard",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90019",
    county: "Los Angeles",
    phone: "(213) 640-3850",
    email: null,
    website: "https://www.lafla.org",
    latitude: "34.0514",
    longitude: "-118.3369",
    services: [
      "Family Law",
      "Housing Law",
      "Consumer Protection",
      "Public Benefits",
      "Domestic Violence Assistance",
      "Expungement Help"
    ],
    eligibility: "Low-income residents of Los Angeles County (≤125% of federal poverty level).",
    dataSource: "LSC",
    isActive: true,
  },
  {
    name: "Bay Area Legal Aid",
    organizationType: "civil_legal_aid",
    address: "1800 Market Street, 3rd Floor",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102",
    county: "San Francisco",
    phone: "(800) 551-5554",
    email: "info@baylegal.org",
    website: "https://www.baylegal.org",
    latitude: "37.7733",
    longitude: "-122.4215",
    services: [
      "Housing Rights",
      "Family Law",
      "Public Benefits",
      "Consumer Protection",
      "Elder Law"
    ],
    eligibility: "Low-income residents in Alameda, Contra Costa, Marin, Napa, San Francisco, San Mateo, and Santa Clara counties.",
    dataSource: "LSC",
    isActive: true,
  },
  {
    name: "Greater Bakersfield Legal Assistance",
    organizationType: "civil_legal_aid",
    address: "2600 F Street, Suite 100",
    city: "Bakersfield",
    state: "CA",
    zipCode: "93301",
    county: "Kern",
    phone: "(661) 325-5943",
    email: null,
    website: "https://www.gbla.org",
    latitude: "35.3733",
    longitude: "-119.0187",
    services: [
      "Family Law",
      "Housing",
      "Consumer Issues",
      "Domestic Violence",
      "Public Benefits"
    ],
    eligibility: "Low-income residents of Kern County.",
    dataSource: "LSC",
    isActive: true,
  },

  // New York LSC Grantees
  {
    name: "Legal Services NYC",
    organizationType: "civil_legal_aid",
    address: "40 Worth Street, Suite 606",
    city: "New York",
    state: "NY",
    zipCode: "10013",
    county: "New York",
    phone: "(917) 661-4500",
    email: null,
    website: "https://www.legalservicesnyc.org",
    latitude: "40.7157",
    longitude: "-74.0027",
    services: [
      "Housing Rights",
      "Family Law",
      "Consumer Protection",
      "Public Benefits",
      "Disability Rights",
      "Elder Law"
    ],
    eligibility: "Low-income New York City residents.",
    dataSource: "LSC",
    isActive: true,
  },
  {
    name: "Nassau/Suffolk Law Services Committee",
    organizationType: "civil_legal_aid",
    address: "1 Helen Keller Way, 5th Floor",
    city: "Hempstead",
    state: "NY",
    zipCode: "11550",
    county: "Nassau",
    phone: "(516) 292-8100",
    email: null,
    website: "https://www.nslawservices.org",
    latitude: "40.7062",
    longitude: "-73.6187",
    services: [
      "Family Law",
      "Housing",
      "Consumer Protection",
      "Elder Law",
      "Domestic Violence"
    ],
    eligibility: "Low-income residents of Nassau and Suffolk counties.",
    dataSource: "LSC",
    isActive: true,
  },

  // Texas LSC Grantees
  {
    name: "Lone Star Legal Aid",
    organizationType: "civil_legal_aid",
    address: "800 Commerce Street, Suite 600",
    city: "Houston",
    state: "TX",
    zipCode: "77002",
    county: "Harris",
    phone: "(713) 652-0077",
    email: null,
    website: "https://www.lonestarlegal.org",
    latitude: "29.7604",
    longitude: "-95.3698",
    services: [
      "Family Law",
      "Housing",
      "Consumer Protection",
      "Employment Law",
      "Disaster Relief"
    ],
    eligibility: "Low-income residents in 72 counties across Texas.",
    dataSource: "LSC",
    isActive: true,
  },
  {
    name: "Texas RioGrande Legal Aid (TRLA)",
    organizationType: "civil_legal_aid",
    address: "300 S. Main, Suite 500",
    city: "San Antonio",
    state: "TX",
    zipCode: "78205",
    county: "Bexar",
    phone: "(210) 212-3700",
    email: null,
    website: "https://www.trla.org",
    latitude: "29.4241",
    longitude: "-98.4936",
    services: [
      "Family Law",
      "Housing Rights",
      "Consumer Protection",
      "Public Benefits",
      "Farmworker Rights"
    ],
    eligibility: "Low-income residents in Southwest Texas.",
    dataSource: "LSC",
    isActive: true,
  },

  // Illinois LSC Grantees
  {
    name: "Legal Aid Chicago",
    organizationType: "civil_legal_aid",
    address: "120 S. LaSalle Street, Suite 900",
    city: "Chicago",
    state: "IL",
    zipCode: "60603",
    county: "Cook",
    phone: "(312) 341-1070",
    email: null,
    website: "https://www.legalaidchicago.org",
    latitude: "41.8823",
    longitude: "-87.6324",
    services: [
      "Housing Rights",
      "Family Law",
      "Consumer Protection",
      "Public Benefits",
      "Disability Rights"
    ],
    eligibility: "Low-income Cook County residents.",
    dataSource: "LSC",
    isActive: true,
  },

  // Florida LSC Grantees
  {
    name: "Legal Services of Greater Miami",
    organizationType: "civil_legal_aid",
    address: "3000 Biscayne Boulevard, Suite 500",
    city: "Miami",
    state: "FL",
    zipCode: "33137",
    county: "Miami-Dade",
    phone: "(305) 576-0080",
    email: null,
    website: "https://www.lsgmi.org",
    latitude: "25.8023",
    longitude: "-80.1876",
    services: [
      "Housing Rights",
      "Family Law",
      "Consumer Protection",
      "Public Benefits",
      "Disaster Relief"
    ],
    eligibility: "Low-income residents of Miami-Dade County.",
    dataSource: "LSC",
    isActive: true,
  },
  {
    name: "Community Legal Services of Mid-Florida",
    organizationType: "civil_legal_aid",
    address: "122 E. Colonial Drive, Suite 200",
    city: "Orlando",
    state: "FL",
    zipCode: "32801",
    county: "Orange",
    phone: "(407) 841-7777",
    email: null,
    website: "https://www.clsmf.org",
    latitude: "28.5478",
    longitude: "-81.3773",
    services: [
      "Housing Rights",
      "Family Law",
      "Consumer Protection",
      "Public Benefits",
      "Elder Law"
    ],
    eligibility: "Low-income residents in Central Florida counties.",
    dataSource: "LSC",
    isActive: true,
  },

  // Additional States - Representative LSC Organizations

  // Arizona
  {
    name: "Community Legal Services - Arizona",
    organizationType: "civil_legal_aid",
    address: "305 S. 2nd Avenue",
    city: "Phoenix",
    state: "AZ",
    zipCode: "85003",
    county: "Maricopa",
    phone: "(602) 258-3434",
    email: null,
    website: "https://www.clsaz.org",
    latitude: "33.4484",
    longitude: "-112.0740",
    services: [
      "Family Law",
      "Housing Rights",
      "Consumer Protection",
      "Public Benefits"
    ],
    eligibility: "Low-income Maricopa County residents.",
    dataSource: "LSC",
    isActive: true,
  },

  // Georgia
  {
    name: "Atlanta Legal Aid Society",
    organizationType: "civil_legal_aid",
    address: "54 Ellis Street NE",
    city: "Atlanta",
    state: "GA",
    zipCode: "30303",
    county: "Fulton",
    phone: "(404) 524-5811",
    email: null,
    website: "https://www.atlantalegalaid.org",
    latitude: "33.7569",
    longitude: "-84.3873",
    services: [
      "Housing Rights",
      "Family Law",
      "Consumer Protection",
      "Public Benefits"
    ],
    eligibility: "Low-income residents in metro Atlanta.",
    dataSource: "LSC",
    isActive: true,
  },

  // Massachusetts
  {
    name: "Greater Boston Legal Services",
    organizationType: "civil_legal_aid",
    address: "197 Friend Street",
    city: "Boston",
    state: "MA",
    zipCode: "02114",
    county: "Suffolk",
    phone: "(617) 371-1234",
    email: null,
    website: "https://www.gbls.org",
    latitude: "42.3663",
    longitude: "-71.0593",
    services: [
      "Housing Rights",
      "Family Law",
      "Public Benefits",
      "Elder Law",
      "Disability Rights"
    ],
    eligibility: "Low-income residents in Greater Boston area.",
    dataSource: "LSC",
    isActive: true,
  },

  // Washington
  {
    name: "Northwest Justice Project",
    organizationType: "civil_legal_aid",
    address: "401 2nd Avenue South, Suite 407",
    city: "Seattle",
    state: "WA",
    zipCode: "98104",
    county: "King",
    phone: "(888) 201-1014",
    email: null,
    website: "https://www.nwjustice.org",
    latitude: "47.6004",
    longitude: "-122.3319",
    services: [
      "Family Law",
      "Housing Rights",
      "Consumer Protection",
      "Public Benefits",
      "Domestic Violence"
    ],
    eligibility: "Low-income Washington State residents.",
    dataSource: "LSC",
    isActive: true,
  },

  // Pennsylvania
  {
    name: "Community Legal Services of Philadelphia",
    organizationType: "civil_legal_aid",
    address: "1424 Chestnut Street",
    city: "Philadelphia",
    state: "PA",
    zipCode: "19102",
    county: "Philadelphia",
    phone: "(215) 981-3700",
    email: null,
    website: "https://www.clsphila.org",
    latitude: "39.9496",
    longitude: "-75.1627",
    services: [
      "Housing Rights",
      "Family Law",
      "Consumer Protection",
      "Public Benefits",
      "Disability Rights"
    ],
    eligibility: "Low-income Philadelphia residents.",
    dataSource: "LSC",
    isActive: true,
  },

  // Ohio
  {
    name: "Legal Aid Society of Columbus",
    organizationType: "civil_legal_aid",
    address: "1108 City Park Avenue",
    city: "Columbus",
    state: "OH",
    zipCode: "43206",
    county: "Franklin",
    phone: "(614) 241-2001",
    email: null,
    website: "https://www.columbuslegalaid.org",
    latitude: "39.9488",
    longitude: "-82.9865",
    services: [
      "Housing Rights",
      "Family Law",
      "Consumer Protection",
      "Public Benefits"
    ],
    eligibility: "Low-income residents in Franklin and surrounding counties.",
    dataSource: "LSC",
    isActive: true,
  },

  // Michigan
  {
    name: "Legal Aid of Western Michigan",
    organizationType: "civil_legal_aid",
    address: "89 Ionia Avenue NW, Suite 600",
    city: "Grand Rapids",
    state: "MI",
    zipCode: "49503",
    county: "Kent",
    phone: "(616) 774-0672",
    email: null,
    website: "https://www.lawestmi.org",
    latitude: "42.9645",
    longitude: "-85.6681",
    services: [
      "Family Law",
      "Housing Rights",
      "Consumer Protection",
      "Public Benefits"
    ],
    eligibility: "Low-income residents in Western Michigan.",
    dataSource: "LSC",
    isActive: true,
  },

  // North Carolina
  {
    name: "Legal Aid of North Carolina",
    organizationType: "civil_legal_aid",
    address: "224 S. Dawson Street",
    city: "Raleigh",
    state: "NC",
    zipCode: "27601",
    county: "Wake",
    phone: "(919) 856-2564",
    email: null,
    website: "https://www.legalaidnc.org",
    latitude: "35.7738",
    longitude: "-78.6379",
    services: [
      "Family Law",
      "Housing Rights",
      "Consumer Protection",
      "Public Benefits",
      "Domestic Violence"
    ],
    eligibility: "Low-income North Carolina residents statewide.",
    dataSource: "LSC",
    isActive: true,
  },

  // Colorado
  {
    name: "Colorado Legal Services",
    organizationType: "civil_legal_aid",
    address: "1905 Sherman Street, Suite 400",
    city: "Denver",
    state: "CO",
    zipCode: "80203",
    county: "Denver",
    phone: "(303) 837-1313",
    email: null,
    website: "https://www.coloradolegalservices.org",
    latitude: "39.7445",
    longitude: "-104.9846",
    services: [
      "Family Law",
      "Housing Rights",
      "Consumer Protection",
      "Public Benefits",
      "Farmworker Rights"
    ],
    eligibility: "Low-income Colorado residents statewide.",
    dataSource: "LSC",
    isActive: true,
  },

  // Oregon
  {
    name: "Legal Aid Services of Oregon",
    organizationType: "civil_legal_aid",
    address: "520 SW 6th Avenue, Suite 700",
    city: "Portland",
    state: "OR",
    zipCode: "97204",
    county: "Multnomah",
    phone: "(503) 224-4086",
    email: null,
    website: "https://www.lasoregon.org",
    latitude: "45.5202",
    longitude: "-122.6780",
    services: [
      "Family Law",
      "Housing Rights",
      "Consumer Protection",
      "Public Benefits",
      "Elder Law"
    ],
    eligibility: "Low-income Oregon residents statewide.",
    dataSource: "LSC",
    isActive: true,
  },

  // ========== PUBLIC DEFENDER OFFICES - COUNTY & STATE ==========

  // California - Los Angeles County
  {
    name: "Los Angeles County Public Defender",
    organizationType: "public_defender",
    address: "210 W. Temple Street",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90012",
    county: "Los Angeles",
    phone: "(213) 974-2811",
    email: null,
    website: "https://pubdef.lacounty.gov",
    latitude: "34.0553",
    longitude: "-118.2427",
    services: [
      "Felony Defense",
      "Misdemeanor Defense",
      "Juvenile Defense",
      "Mental Health Court",
      "Drug Court",
      "Veterans Court"
    ],
    eligibility: "Indigent defendants in Los Angeles County criminal and juvenile cases who cannot afford a private attorney.",
    dataSource: "state_website",
    isActive: true,
  },

  // California - San Francisco County
  {
    name: "San Francisco Public Defender",
    organizationType: "public_defender",
    address: "555 7th Street",
    city: "San Francisco",
    state: "CA",
    zipCode: "94103",
    county: "San Francisco",
    phone: "(415) 553-1671",
    email: null,
    website: "https://sfpublicdefender.org",
    latitude: "37.7800",
    longitude: "-122.4075",
    services: [
      "Felony Defense",
      "Misdemeanor Defense",
      "Juvenile Defense",
      "Post-Conviction Relief",
      "Clean Slate Program",
      "Reentry Services"
    ],
    eligibility: "Indigent defendants in San Francisco County criminal and juvenile cases.",
    dataSource: "state_website",
    isActive: true,
  },

  // California - San Diego County
  {
    name: "San Diego County Public Defender",
    organizationType: "public_defender",
    address: "450 B Street, Suite 800",
    city: "San Diego",
    state: "CA",
    zipCode: "92101",
    county: "San Diego",
    phone: "(619) 338-4700",
    email: null,
    website: "https://www.sandiegocounty.gov/defender",
    latitude: "32.7157",
    longitude: "-117.1611",
    services: [
      "Felony Defense",
      "Misdemeanor Defense",
      "Juvenile Defense",
      "Mental Health Court",
      "Veterans Court"
    ],
    eligibility: "Indigent defendants in San Diego County criminal and juvenile cases.",
    dataSource: "state_website",
    isActive: true,
  },

  // California - Alameda County
  {
    name: "Alameda County Public Defender",
    organizationType: "public_defender",
    address: "1401 Lakeside Drive, 12th Floor",
    city: "Oakland",
    state: "CA",
    zipCode: "94612",
    county: "Alameda",
    phone: "(510) 272-6600",
    email: null,
    website: "https://www.acgov.org/defender",
    latitude: "37.8058",
    longitude: "-122.2631",
    services: [
      "Felony Defense",
      "Misdemeanor Defense",
      "Juvenile Defense",
      "Mental Health Advocacy",
      "Immigration Representation"
    ],
    eligibility: "Indigent defendants in Alameda County criminal and juvenile cases.",
    dataSource: "state_website",
    isActive: true,
  },

  // Illinois - Cook County (Chicago)
  {
    name: "Cook County Public Defender",
    organizationType: "public_defender",
    address: "69 W. Washington Street, Suite 1600",
    city: "Chicago",
    state: "IL",
    zipCode: "60602",
    county: "Cook",
    phone: "(312) 603-0600",
    email: null,
    website: "https://www.cookcountypublicdefender.org",
    latitude: "41.8837",
    longitude: "-87.6297",
    services: [
      "Felony Defense",
      "Misdemeanor Defense",
      "Juvenile Defense",
      "Mental Health Court",
      "Drug Treatment Court",
      "Veterans Court",
      "Expungement Services"
    ],
    eligibility: "Indigent defendants in Cook County criminal and juvenile cases.",
    dataSource: "state_website",
    isActive: true,
  },

  // Texas - Harris County (Houston)
  {
    name: "Harris County Public Defender",
    organizationType: "public_defender",
    address: "1001 Preston Street, Suite 400",
    city: "Houston",
    state: "TX",
    zipCode: "77002",
    county: "Harris",
    phone: "(713) 274-6700",
    email: null,
    website: "https://hcpdo.org",
    latitude: "29.7604",
    longitude: "-95.3698",
    services: [
      "Felony Defense",
      "Misdemeanor Defense",
      "Juvenile Defense",
      "Mental Health Division",
      "Veterans Court"
    ],
    eligibility: "Indigent defendants in Harris County criminal and juvenile cases.",
    dataSource: "state_website",
    isActive: true,
  },

  // Texas - Dallas County
  {
    name: "Dallas County Public Defender",
    organizationType: "public_defender",
    address: "133 N. Riverfront Boulevard, LB 7",
    city: "Dallas",
    state: "TX",
    zipCode: "75207",
    county: "Dallas",
    phone: "(214) 653-3550",
    email: null,
    website: "https://www.dallascounty.org/government/defender",
    latitude: "32.7767",
    longitude: "-96.7970",
    services: [
      "Felony Defense",
      "Misdemeanor Defense",
      "Mental Health Court",
      "Veterans Court"
    ],
    eligibility: "Indigent defendants in Dallas County criminal cases.",
    dataSource: "state_website",
    isActive: true,
  },

  // Florida - Miami-Dade County
  {
    name: "Miami-Dade Public Defender",
    organizationType: "public_defender",
    address: "1320 NW 14th Street",
    city: "Miami",
    state: "FL",
    zipCode: "33125",
    county: "Miami-Dade",
    phone: "(305) 545-1958",
    email: null,
    website: "https://www.pdmiami.com",
    latitude: "25.7907",
    longitude: "-80.2201",
    services: [
      "Felony Defense",
      "Misdemeanor Defense",
      "Juvenile Defense",
      "Mental Health Court",
      "Drug Court",
      "Veterans Court"
    ],
    eligibility: "Indigent defendants in Miami-Dade County criminal and juvenile cases.",
    dataSource: "state_website",
    isActive: true,
  },

  // New York - Kings County (Brooklyn)
  {
    name: "Brooklyn Defender Services",
    organizationType: "public_defender",
    address: "177 Livingston Street, 7th Floor",
    city: "Brooklyn",
    state: "NY",
    zipCode: "11201",
    county: "Kings",
    phone: "(718) 254-0700",
    email: null,
    website: "https://www.bds.org",
    latitude: "40.6909",
    longitude: "-73.9882",
    services: [
      "Criminal Defense",
      "Family Defense",
      "Immigration Defense",
      "Civil Action Practice",
      "Reentry Services"
    ],
    eligibility: "Indigent defendants in Brooklyn criminal, family, and immigration cases.",
    dataSource: "state_website",
    isActive: true,
  },

  // New York - New York County (Manhattan)
  {
    name: "The Legal Aid Society - Criminal Defense Practice",
    organizationType: "public_defender",
    address: "199 Water Street",
    city: "New York",
    state: "NY",
    zipCode: "10038",
    county: "New York",
    phone: "(212) 577-3300",
    email: null,
    website: "https://www.legalaidnyc.org",
    latitude: "40.7089",
    longitude: "-74.0047",
    services: [
      "Felony Defense",
      "Misdemeanor Defense",
      "Juvenile Defense",
      "Appeals",
      "Post-Conviction Relief"
    ],
    eligibility: "Indigent defendants in New York City criminal and juvenile cases.",
    dataSource: "state_website",
    isActive: true,
  },

  // Pennsylvania - Philadelphia County
  {
    name: "Defender Association of Philadelphia",
    organizationType: "public_defender",
    address: "1441 Sansom Street",
    city: "Philadelphia",
    state: "PA",
    zipCode: "19102",
    county: "Philadelphia",
    phone: "(215) 568-3190",
    email: null,
    website: "https://www.philadefender.org",
    latitude: "39.9496",
    longitude: "-75.1651",
    services: [
      "Felony Defense",
      "Misdemeanor Defense",
      "Juvenile Defense",
      "Appeals",
      "Special Defense Units"
    ],
    eligibility: "Indigent defendants in Philadelphia County criminal and juvenile cases.",
    dataSource: "state_website",
    isActive: true,
  },

  // Georgia - Fulton County (Atlanta)
  {
    name: "Fulton County Public Defender",
    organizationType: "public_defender",
    address: "136 Pryor Street SW, Suite C-301",
    city: "Atlanta",
    state: "GA",
    zipCode: "30303",
    county: "Fulton",
    phone: "(404) 612-4640",
    email: null,
    website: "https://www.fultoncountyga.gov/inside-fulton-county/fulton-county-departments/public-defender",
    latitude: "33.7537",
    longitude: "-84.3917",
    services: [
      "Felony Defense",
      "Misdemeanor Defense",
      "Mental Health Court",
      "Drug Court"
    ],
    eligibility: "Indigent defendants in Fulton County criminal cases.",
    dataSource: "state_website",
    isActive: true,
  },

  // Arizona - Maricopa County (Phoenix)
  {
    name: "Maricopa County Public Defender",
    organizationType: "public_defender",
    address: "620 W. Jackson Street",
    city: "Phoenix",
    state: "AZ",
    zipCode: "85003",
    county: "Maricopa",
    phone: "(602) 506-7711",
    email: null,
    website: "https://www.maricopa.gov/1026/Public-Defender",
    latitude: "33.4484",
    longitude: "-112.0740",
    services: [
      "Felony Defense",
      "Misdemeanor Defense",
      "Juvenile Defense",
      "Mental Health Court"
    ],
    eligibility: "Indigent defendants in Maricopa County criminal and juvenile cases.",
    dataSource: "state_website",
    isActive: true,
  },

  // Washington - King County (Seattle)
  {
    name: "The Defender Association",
    organizationType: "public_defender",
    address: "810 Third Avenue, Suite 800",
    city: "Seattle",
    state: "WA",
    zipCode: "98104",
    county: "King",
    phone: "(206) 447-3900",
    email: null,
    website: "https://www.defender.org",
    latitude: "47.6062",
    longitude: "-122.3321",
    services: [
      "Felony Defense",
      "Misdemeanor Defense",
      "Immigration Project",
      "Parents Representation Program"
    ],
    eligibility: "Indigent defendants in King County criminal cases.",
    dataSource: "state_website",
    isActive: true,
  },

  // Massachusetts - Suffolk County (Boston)
  {
    name: "Committee for Public Counsel Services - Public Defender Division",
    organizationType: "public_defender",
    address: "44 Bromfield Street",
    city: "Boston",
    state: "MA",
    zipCode: "02108",
    county: "Suffolk",
    phone: "(617) 482-6212",
    email: null,
    website: "https://www.publiccounsel.net",
    latitude: "42.3564",
    longitude: "-71.0603",
    services: [
      "Criminal Defense",
      "Juvenile Defense",
      "Mental Health Advocacy",
      "Appeals"
    ],
    eligibility: "Indigent defendants in Massachusetts criminal and juvenile cases.",
    dataSource: "state_website",
    isActive: true,
  },

  // Michigan - Wayne County (Detroit)
  {
    name: "Wayne County Public Defender",
    organizationType: "public_defender",
    address: "1441 St. Antoine Street, Suite 1100",
    city: "Detroit",
    state: "MI",
    zipCode: "48226",
    county: "Wayne",
    phone: "(313) 224-5500",
    email: null,
    website: "https://www.waynecounty.com/elected/publicdefender",
    latitude: "42.3314",
    longitude: "-83.0458",
    services: [
      "Felony Defense",
      "Misdemeanor Defense",
      "Juvenile Defense",
      "Mental Health Court"
    ],
    eligibility: "Indigent defendants in Wayne County criminal and juvenile cases.",
    dataSource: "state_website",
    isActive: true,
  },

  // Minnesota - Hennepin County (Minneapolis)
  {
    name: "Hennepin County Public Defender",
    organizationType: "public_defender",
    address: "C-2100 Government Center, 300 South 6th Street",
    city: "Minneapolis",
    state: "MN",
    zipCode: "55487",
    county: "Hennepin",
    phone: "(612) 348-7500",
    email: null,
    website: "https://www.hennepinpublicdefender.org",
    latitude: "44.9778",
    longitude: "-93.2650",
    services: [
      "Felony Defense",
      "Misdemeanor Defense",
      "Juvenile Defense",
      "Mental Health Court",
      "Drug Court"
    ],
    eligibility: "Indigent defendants in Hennepin County criminal and juvenile cases.",
    dataSource: "state_website",
    isActive: true,
  },

  // Colorado - Denver County
  {
    name: "Denver Public Defender",
    organizationType: "public_defender",
    address: "1290 Broadway, Suite 1700",
    city: "Denver",
    state: "CO",
    zipCode: "80203",
    county: "Denver",
    phone: "(720) 913-8800",
    email: null,
    website: "https://www.coloradodefenders.us",
    latitude: "39.7392",
    longitude: "-104.9903",
    services: [
      "Felony Defense",
      "Misdemeanor Defense",
      "Juvenile Defense",
      "Appellate Services"
    ],
    eligibility: "Indigent defendants in Denver County and statewide Colorado criminal cases.",
    dataSource: "state_website",
    isActive: true,
  },

  // Oregon - Multnomah County (Portland)
  {
    name: "Metropolitan Public Defender",
    organizationType: "public_defender",
    address: "1120 SW 3rd Avenue, Suite 600",
    city: "Portland",
    state: "OR",
    zipCode: "97204",
    county: "Multnomah",
    phone: "(503) 225-9100",
    email: null,
    website: "https://www.mpdlaw.com",
    latitude: "45.5152",
    longitude: "-122.6784",
    services: [
      "Felony Defense",
      "Misdemeanor Defense",
      "Juvenile Defense",
      "Mental Health Court"
    ],
    eligibility: "Indigent defendants in Multnomah County criminal and juvenile cases.",
    dataSource: "state_website",
    isActive: true,
  },

  // Maryland - Baltimore City
  {
    name: "Office of the Public Defender - Baltimore City",
    organizationType: "public_defender",
    address: "6 Saint Paul Street, Suite 1302",
    city: "Baltimore",
    state: "MD",
    zipCode: "21202",
    county: "Baltimore City",
    phone: "(410) 767-8479",
    email: null,
    website: "https://www.opd.state.md.us",
    latitude: "39.2904",
    longitude: "-76.6122",
    services: [
      "Felony Defense",
      "Misdemeanor Defense",
      "Juvenile Defense",
      "Mental Health Advocacy"
    ],
    eligibility: "Indigent defendants in Baltimore City criminal and juvenile cases.",
    dataSource: "state_website",
    isActive: true,
  },

  // North Carolina - Mecklenburg County (Charlotte)
  {
    name: "Mecklenburg County Public Defender",
    organizationType: "public_defender",
    address: "720 East 4th Street, Suite 300",
    city: "Charlotte",
    state: "NC",
    zipCode: "28202",
    county: "Mecklenburg",
    phone: "(704) 336-4310",
    email: null,
    website: "https://www.mecknc.gov/CountyManagersOffice/PublicDefender",
    latitude: "35.2271",
    longitude: "-80.8431",
    services: [
      "Felony Defense",
      "Misdemeanor Defense",
      "Juvenile Defense"
    ],
    eligibility: "Indigent defendants in Mecklenburg County criminal and juvenile cases.",
    dataSource: "state_website",
    isActive: true,
  },

  // ========== FEDERAL PUBLIC DEFENDER OFFICES ==========

  // California - Central District (Los Angeles)
  {
    name: "Federal Public Defender - Central District of California",
    organizationType: "public_defender",
    address: "321 East 2nd Street",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90012",
    county: "Los Angeles",
    phone: "(213) 894-2854",
    email: null,
    website: "https://fpdcdca.org",
    latitude: "34.0479",
    longitude: "-118.2396",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals",
      "Capital Habeas Corpus",
      "Pretrial Services"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Central District of California.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // New York - Southern District (Manhattan)
  {
    name: "Federal Defenders of New York - Manhattan Office",
    organizationType: "public_defender",
    address: "52 Duane Street, 10th Floor",
    city: "New York",
    state: "NY",
    zipCode: "10007",
    county: "New York",
    phone: "(212) 417-8700",
    email: null,
    website: "https://www.federaldefendersny.org",
    latitude: "40.7148",
    longitude: "-74.0068",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals",
      "Immigration Consequences Advocacy"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Southern District of New York.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Illinois - Northern District (Chicago)
  {
    name: "Illinois Federal Defender Program",
    organizationType: "public_defender",
    address: "55 E. Monroe Street, Suite 2800",
    city: "Chicago",
    state: "IL",
    zipCode: "60603",
    county: "Cook",
    phone: "(312) 621-8380",
    email: null,
    website: "https://www.ilnd.uscourts.gov/Pages.aspx?page=Federal-Defender",
    latitude: "41.8806",
    longitude: "-87.6256",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals",
      "Post-Conviction Relief"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Northern District of Illinois.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Texas - Northern District (Dallas)
  {
    name: "Federal Public Defender - Northern District of Texas",
    organizationType: "public_defender",
    address: "525 S. Griffin Street, Suite 629",
    city: "Dallas",
    state: "TX",
    zipCode: "75202",
    county: "Dallas",
    phone: "(214) 767-2746",
    email: null,
    website: "https://www.txnd.uscourts.gov/federal-public-defenders-office",
    latitude: "32.7767",
    longitude: "-96.7979",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals",
      "Immigration Defense"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Northern District of Texas.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Pennsylvania - Eastern District (Philadelphia)
  {
    name: "Federal Community Defender - Eastern District of Pennsylvania",
    organizationType: "public_defender",
    address: "601 Walnut Street, Suite 540 West",
    city: "Philadelphia",
    state: "PA",
    zipCode: "19106",
    county: "Philadelphia",
    phone: "(215) 928-1100",
    email: null,
    website: "https://pae.fd.org",
    latitude: "39.9480",
    longitude: "-75.1486",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals",
      "Capital Habeas Corpus",
      "Immigration Consequences"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Eastern District of Pennsylvania.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Florida - Southern District (Miami)
  {
    name: "Federal Public Defender - Southern District of Florida",
    organizationType: "public_defender",
    address: "150 W. Flagler Street, Suite 1700",
    city: "Miami",
    state: "FL",
    zipCode: "33130",
    county: "Miami-Dade",
    phone: "(305) 530-7000",
    email: null,
    website: "https://www.flsd.uscourts.gov",
    latitude: "25.7743",
    longitude: "-80.1937",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals",
      "Immigration Defense"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Southern District of Florida.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Georgia - Northern District (Atlanta)
  {
    name: "Georgia Federal Defender Program - Northern District",
    organizationType: "public_defender",
    address: "101 Marietta Street NW, Suite 1500",
    city: "Atlanta",
    state: "GA",
    zipCode: "30303",
    county: "Fulton",
    phone: "(404) 688-7498",
    email: null,
    website: "https://www.gand.uscourts.gov",
    latitude: "33.7573",
    longitude: "-84.3898",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals",
      "Habeas Corpus"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Northern District of Georgia.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Washington - Western District (Seattle)
  {
    name: "Federal Defenders of Western Washington",
    organizationType: "public_defender",
    address: "1601 Fifth Avenue, Suite 700",
    city: "Seattle",
    state: "WA",
    zipCode: "98101",
    county: "King",
    phone: "(206) 553-1100",
    email: null,
    website: "https://www.wawd.uscourts.gov/federal-public-defender",
    latitude: "47.6101",
    longitude: "-122.3352",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals",
      "Immigration Consequences"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Western District of Washington.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Massachusetts - District of Massachusetts (Boston)
  {
    name: "Federal Defender Office - District of Massachusetts",
    organizationType: "public_defender",
    address: "408 Atlantic Avenue, 3rd Floor",
    city: "Boston",
    state: "MA",
    zipCode: "02110",
    county: "Suffolk",
    phone: "(617) 223-8061",
    email: null,
    website: "https://www.mad.uscourts.gov/boston/fpd.htm",
    latitude: "42.3554",
    longitude: "-71.0520",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals",
      "Immigration Defense"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the District of Massachusetts.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Nevada - District of Nevada (Las Vegas)
  {
    name: "Federal Public Defender - District of Nevada",
    organizationType: "public_defender",
    address: "411 E. Bonneville Avenue",
    city: "Las Vegas",
    state: "NV",
    zipCode: "89101",
    county: "Clark",
    phone: "(702) 388-6577",
    email: null,
    website: "https://fpdnevada.org",
    latitude: "36.1699",
    longitude: "-115.1398",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals",
      "Post-Conviction Relief"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the District of Nevada.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // ========== ADDITIONAL FEDERAL PUBLIC DEFENDER OFFICES (All Districts) ==========

  // Alaska
  {
    name: "Alaska Federal Public Defender",
    organizationType: "public_defender",
    address: "188 W Northern Lights Blvd, Suite 700",
    city: "Anchorage",
    state: "AK",
    zipCode: "99503",
    county: "Anchorage",
    phone: "(907) 646-3400",
    email: null,
    website: "https://www.akd.uscourts.gov",
    latitude: "61.2181",
    longitude: "-149.9003",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the District of Alaska.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Alabama - Middle District
  {
    name: "Alabama Middle Community Defender",
    organizationType: "public_defender",
    address: "817 South Court Street",
    city: "Montgomery",
    state: "AL",
    zipCode: "36104",
    county: "Montgomery",
    phone: "(334) 834-2099",
    email: null,
    website: "https://www.almd.uscourts.gov",
    latitude: "32.3668",
    longitude: "-86.2999",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Middle District of Alabama.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Alabama - Northern District
  {
    name: "Alabama Northern Federal Public Defender",
    organizationType: "public_defender",
    address: "505 20th Street North, Room 1425",
    city: "Birmingham",
    state: "AL",
    zipCode: "35203",
    county: "Jefferson",
    phone: "(205) 208-7170",
    email: null,
    website: "https://www.alnd.uscourts.gov",
    latitude: "33.5186",
    longitude: "-86.8104",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Northern District of Alabama.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Alabama - Southern District
  {
    name: "Alabama Southern Community Defender",
    organizationType: "public_defender",
    address: "11 North Water Street, Suite 11290",
    city: "Mobile",
    state: "AL",
    zipCode: "36602",
    county: "Mobile",
    phone: "(251) 433-0910",
    email: null,
    website: "https://www.alsd.uscourts.gov",
    latitude: "30.6943",
    longitude: "-88.0431",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Southern District of Alabama.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Arkansas - Eastern District
  {
    name: "Arkansas Eastern Federal Public Defender",
    organizationType: "public_defender",
    address: "1401 West Capitol Avenue, Suite 490",
    city: "Little Rock",
    state: "AR",
    zipCode: "72201",
    county: "Pulaski",
    phone: "(501) 324-6113",
    email: null,
    website: "https://www.are.uscourts.gov",
    latitude: "34.7465",
    longitude: "-92.2896",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Eastern District of Arkansas.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Arkansas - Western District
  {
    name: "Arkansas Western Federal Public Defender",
    organizationType: "public_defender",
    address: "112 W Center St, Suite 300",
    city: "Fayetteville",
    state: "AR",
    zipCode: "72701",
    county: "Washington",
    phone: "(479) 442-2306",
    email: null,
    website: "https://www.arwd.uscourts.gov",
    latitude: "36.0626",
    longitude: "-94.1574",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Western District of Arkansas.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Arizona
  {
    name: "Arizona Federal Public Defender",
    organizationType: "public_defender",
    address: "250 North 7th Avenue, Room 600",
    city: "Phoenix",
    state: "AZ",
    zipCode: "85007",
    county: "Maricopa",
    phone: "(602) 382-2700",
    email: null,
    website: "https://www.azd.uscourts.gov",
    latitude: "33.4484",
    longitude: "-112.0740",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the District of Arizona.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // California - Eastern District
  {
    name: "California Eastern Federal Public Defender",
    organizationType: "public_defender",
    address: "801 I Street, 3rd Floor",
    city: "Sacramento",
    state: "CA",
    zipCode: "95814",
    county: "Sacramento",
    phone: "(916) 498-5700",
    email: null,
    website: "https://www.caed.uscourts.gov",
    latitude: "38.5816",
    longitude: "-121.4944",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Eastern District of California.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // California - Northern District (San Francisco Main Office)
  {
    name: "California Northern Federal Public Defender",
    organizationType: "public_defender",
    address: "450 Golden Gate Avenue, Suite 19-6884",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102",
    county: "San Francisco",
    phone: "(415) 436-7700",
    email: null,
    website: "https://www.cand.uscourts.gov",
    latitude: "37.7749",
    longitude: "-122.4194",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Northern District of California.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // California - Northern District (Oakland Office)
  {
    name: "California Northern Federal Public Defender - Oakland Office",
    organizationType: "public_defender",
    address: "1301 Clay Street, Suite 1350N",
    city: "Oakland",
    state: "CA",
    zipCode: "94612",
    county: "Alameda",
    phone: "(510) 637-3500",
    email: null,
    website: "https://www.cand.uscourts.gov",
    latitude: "37.8044",
    longitude: "-122.2712",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Northern District of California.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // California - Northern District (Oakland Alt. Office)
  {
    name: "California Northern Federal Public Defender - Oakland City Center",
    organizationType: "public_defender",
    address: "1300 Clay Street",
    city: "Oakland",
    state: "CA",
    zipCode: "94612",
    county: "Alameda",
    phone: "(510) 637-3500",
    email: null,
    website: "https://www.cand.uscourts.gov",
    latitude: "37.8044",
    longitude: "-122.2712",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Northern District of California.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // California - Southern District
  {
    name: "Federal Defenders of San Diego",
    organizationType: "public_defender",
    address: "225 Broadway, Suite 900",
    city: "San Diego",
    state: "CA",
    zipCode: "92101",
    county: "San Diego",
    phone: "(619) 234-8467",
    email: null,
    website: "https://www.casd.uscourts.gov",
    latitude: "32.7157",
    longitude: "-117.1611",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Southern District of California.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Colorado
  {
    name: "Colorado Federal Public Defender",
    organizationType: "public_defender",
    address: "633 17th Street, Suite 1000",
    city: "Denver",
    state: "CO",
    zipCode: "80202",
    county: "Denver",
    phone: "(303) 294-7002",
    email: null,
    website: "https://www.cod.uscourts.gov",
    latitude: "39.7392",
    longitude: "-104.9903",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the District of Colorado.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Connecticut
  {
    name: "Connecticut Federal Public Defender",
    organizationType: "public_defender",
    address: "10 Columbus Boulevard",
    city: "Hartford",
    state: "CT",
    zipCode: "06106",
    county: "Hartford",
    phone: "(860) 493-6260",
    email: null,
    website: "https://www.ctd.uscourts.gov",
    latitude: "41.7658",
    longitude: "-72.6734",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the District of Connecticut.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // District of Columbia
  {
    name: "District of Columbia Federal Public Defender",
    organizationType: "public_defender",
    address: "625 Indiana Avenue, N.W., Suite 550",
    city: "Washington",
    state: "DC",
    zipCode: "20004",
    county: "District of Columbia",
    phone: "(202) 208-7500",
    email: null,
    website: "https://www.dcd.uscourts.gov",
    latitude: "38.8951",
    longitude: "-77.0369",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the District of Columbia.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Delaware
  {
    name: "Delaware Federal Public Defender",
    organizationType: "public_defender",
    address: "800 North King Street, Suite 200",
    city: "Wilmington",
    state: "DE",
    zipCode: "19801",
    county: "New Castle",
    phone: "(302) 573-6010",
    email: null,
    website: "https://www.ded.uscourts.gov",
    latitude: "39.7391",
    longitude: "-75.5398",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the District of Delaware.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Florida - Middle District
  {
    name: "Florida Middle Federal Public Defender",
    organizationType: "public_defender",
    address: "400 North Tampa Street, Room 2700",
    city: "Tampa",
    state: "FL",
    zipCode: "33602",
    county: "Hillsborough",
    phone: "(813) 228-2715",
    email: null,
    website: "https://www.flmd.uscourts.gov",
    latitude: "27.9506",
    longitude: "-82.4572",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Middle District of Florida.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Florida - Northern District
  {
    name: "Florida Northern Federal Public Defender",
    organizationType: "public_defender",
    address: "227 North Bronough Street, Room 4200",
    city: "Tallahassee",
    state: "FL",
    zipCode: "32301",
    county: "Leon",
    phone: "(850) 942-8818",
    email: null,
    website: "https://www.flnd.uscourts.gov",
    latitude: "30.4383",
    longitude: "-84.2807",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Northern District of Florida.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Georgia - Middle District
  {
    name: "Federal Defenders of the Middle District of Georgia",
    organizationType: "public_defender",
    address: "440 Martin Luther King Jr. Blvd, Suite 400",
    city: "Macon",
    state: "GA",
    zipCode: "31201",
    county: "Bibb",
    phone: "(478) 743-4747",
    email: null,
    website: "https://www.gamd.uscourts.gov",
    latitude: "32.8407",
    longitude: "-83.6324",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Middle District of Georgia.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Guam
  {
    name: "Guam Federal Public Defender",
    organizationType: "public_defender",
    address: "400 Route 8, Room 501",
    city: "Mong Mong",
    state: "GU",
    zipCode: "96910",
    county: "Guam",
    phone: "(671) 472-7111",
    email: null,
    website: "https://www.gud.uscourts.gov",
    latitude: "13.4443",
    longitude: "144.7937",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the District of Guam.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Hawaii
  {
    name: "Hawaii Federal Public Defender",
    organizationType: "public_defender",
    address: "300 Ala Moana Boulevard, Suite 7-104",
    city: "Honolulu",
    state: "HI",
    zipCode: "96850",
    county: "Honolulu",
    phone: "(808) 541-2521",
    email: null,
    website: "https://www.hid.uscourts.gov",
    latitude: "21.3099",
    longitude: "-157.8581",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the District of Hawaii.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Iowa - Southern District
  {
    name: "Iowa Southern Federal Public Defender",
    organizationType: "public_defender",
    address: "400 Locust Street, Suite 340",
    city: "Des Moines",
    state: "IA",
    zipCode: "50309",
    county: "Polk",
    phone: "(515) 309-9610",
    email: null,
    website: "https://www.iasd.uscourts.gov",
    latitude: "41.5868",
    longitude: "-93.6250",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Southern District of Iowa.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Idaho
  {
    name: "Federal Defender Services of Idaho",
    organizationType: "public_defender",
    address: "702 West Idaho Street, Room 1000",
    city: "Boise",
    state: "ID",
    zipCode: "83702",
    county: "Ada",
    phone: "(208) 331-5500",
    email: null,
    website: "https://www.id.uscourts.gov",
    latitude: "43.6150",
    longitude: "-116.2023",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the District of Idaho.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Illinois - Central District
  {
    name: "Illinois Central Federal Public Defender",
    organizationType: "public_defender",
    address: "401 Main Street, Suite 1500",
    city: "Peoria",
    state: "IL",
    zipCode: "61602",
    county: "Peoria",
    phone: "(309) 671-7891",
    email: null,
    website: "https://www.ilcd.uscourts.gov",
    latitude: "40.6936",
    longitude: "-89.5890",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Central District of Illinois.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Illinois - Southern District
  {
    name: "Illinois Southern Federal Public Defender",
    organizationType: "public_defender",
    address: "650 Missouri Avenue, Suite G10A",
    city: "East St. Louis",
    state: "IL",
    zipCode: "62201",
    county: "St. Clair",
    phone: "(618) 482-9050",
    email: null,
    website: "https://www.ilsd.uscourts.gov",
    latitude: "38.6270",
    longitude: "-90.1994",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Southern District of Illinois.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Indiana - Northern District
  {
    name: "Federal Community Defenders - Northern District of Indiana",
    organizationType: "public_defender",
    address: "2929 Carlson Drive, Suite 101",
    city: "Hammond",
    state: "IN",
    zipCode: "46323",
    county: "Lake",
    phone: "(219) 937-8020",
    email: null,
    website: "https://www.innd.uscourts.gov",
    latitude: "41.5834",
    longitude: "-87.5001",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Northern District of Indiana.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Indiana - Southern District
  {
    name: "Indiana Southern Federal Public Defender",
    organizationType: "public_defender",
    address: "46 East Ohio Street, Suite 300",
    city: "Indianapolis",
    state: "IN",
    zipCode: "46204",
    county: "Marion",
    phone: "(317) 229-2420",
    email: null,
    website: "https://www.insd.uscourts.gov",
    latitude: "39.7684",
    longitude: "-86.1581",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Southern District of Indiana.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Kansas
  {
    name: "Kansas Federal Public Defender",
    organizationType: "public_defender",
    address: "500 State Avenue, Suite 201",
    city: "Kansas City",
    state: "KS",
    zipCode: "66101",
    county: "Wyandotte",
    phone: "(913) 551-6704",
    email: null,
    website: "https://www.ksd.uscourts.gov",
    latitude: "39.1134",
    longitude: "-94.6266",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the District of Kansas.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Kentucky - Eastern District
  {
    name: "Kentucky Eastern Federal Public Defender",
    organizationType: "public_defender",
    address: "100 East Vine Street, Suite 800",
    city: "Lexington",
    state: "KY",
    zipCode: "40507",
    county: "Fayette",
    phone: "(859) 233-2237",
    email: null,
    website: "https://www.kyed.uscourts.gov",
    latitude: "38.0406",
    longitude: "-84.5037",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Eastern District of Kentucky.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Kentucky - Western District
  {
    name: "Western Kentucky Federal Community Defender",
    organizationType: "public_defender",
    address: "500 West Jefferson Street, Suite 2100",
    city: "Louisville",
    state: "KY",
    zipCode: "40202",
    county: "Jefferson",
    phone: "(502) 753-4821",
    email: null,
    website: "https://www.kywd.uscourts.gov",
    latitude: "38.2527",
    longitude: "-85.7585",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Western District of Kentucky.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Louisiana - Eastern District
  {
    name: "Louisiana Eastern Federal Public Defender",
    organizationType: "public_defender",
    address: "500 Poydras Street, Suite B-210",
    city: "New Orleans",
    state: "LA",
    zipCode: "70130",
    county: "Orleans",
    phone: "(504) 589-7930",
    email: null,
    website: "https://www.laed.uscourts.gov",
    latitude: "29.9511",
    longitude: "-90.0715",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Eastern District of Louisiana.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Louisiana - Middle District
  {
    name: "Louisiana Middle Federal Public Defender",
    organizationType: "public_defender",
    address: "707 Florida Street, Suite 210",
    city: "Baton Rouge",
    state: "LA",
    zipCode: "70801",
    county: "East Baton Rouge",
    phone: "(225) 389-3641",
    email: null,
    website: "https://www.lamd.uscourts.gov",
    latitude: "30.4515",
    longitude: "-91.1871",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Middle District of Louisiana.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Louisiana - Western District
  {
    name: "Louisiana Western Federal Public Defender",
    organizationType: "public_defender",
    address: "300 Fannin Street, Suite 3105",
    city: "Shreveport",
    state: "LA",
    zipCode: "71101",
    county: "Caddo",
    phone: "(318) 676-3690",
    email: null,
    website: "https://www.lawd.uscourts.gov",
    latitude: "32.5252",
    longitude: "-93.7502",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Western District of Louisiana.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Maine
  {
    name: "Maine Federal Public Defender",
    organizationType: "public_defender",
    address: "98 Maine Avenue, Suite 301",
    city: "Bangor",
    state: "ME",
    zipCode: "04401",
    county: "Penobscot",
    phone: "(207) 945-0068",
    email: null,
    website: "https://www.med.uscourts.gov",
    latitude: "44.8016",
    longitude: "-68.7712",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the District of Maine.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Maryland
  {
    name: "Maryland Federal Public Defender",
    organizationType: "public_defender",
    address: "6411 Ivy Lane, Suite 710",
    city: "Greenbelt",
    state: "MD",
    zipCode: "20770",
    county: "Prince George's",
    phone: "(301) 344-0600",
    email: null,
    website: "https://www.mdd.uscourts.gov",
    latitude: "39.0458",
    longitude: "-76.6413",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the District of Maryland.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Michigan - Eastern District
  {
    name: "Michigan Eastern Federal Public Defender",
    organizationType: "public_defender",
    address: "231 West Lafayette Boulevard, Room 260",
    city: "Detroit",
    state: "MI",
    zipCode: "48226",
    county: "Wayne",
    phone: "(313) 226-6020",
    email: null,
    website: "https://www.mied.uscourts.gov",
    latitude: "42.3314",
    longitude: "-83.0458",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Eastern District of Michigan.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Michigan - Western District
  {
    name: "Michigan Western Federal Public Defender",
    organizationType: "public_defender",
    address: "1 Division Avenue North, Suite 500",
    city: "Grand Rapids",
    state: "MI",
    zipCode: "49503",
    county: "Kent",
    phone: "(616) 456-2404",
    email: null,
    website: "https://www.miwd.uscourts.gov",
    latitude: "42.9634",
    longitude: "-85.6681",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Western District of Michigan.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Minnesota
  {
    name: "Minnesota Federal Public Defender",
    organizationType: "public_defender",
    address: "300 South Fourth Street, Suite 107",
    city: "Minneapolis",
    state: "MN",
    zipCode: "55415",
    county: "Hennepin",
    phone: "(612) 664-5810",
    email: null,
    website: "https://www.mnd.uscourts.gov",
    latitude: "44.9778",
    longitude: "-93.2650",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the District of Minnesota.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Mississippi - Northern District
  {
    name: "Mississippi Northern Federal Public Defender",
    organizationType: "public_defender",
    address: "911 Jackson Avenue, Room 756",
    city: "Oxford",
    state: "MS",
    zipCode: "38655",
    county: "Lafayette",
    phone: "(662) 234-1971",
    email: null,
    website: "https://www.msnd.uscourts.gov",
    latitude: "34.3665",
    longitude: "-89.5192",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Northern District of Mississippi.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Mississippi - Southern District
  {
    name: "Mississippi Southern Federal Public Defender",
    organizationType: "public_defender",
    address: "188 East Capitol Street, Suite 500",
    city: "Jackson",
    state: "MS",
    zipCode: "39201",
    county: "Hinds",
    phone: "(601) 965-4511",
    email: null,
    website: "https://www.mssd.uscourts.gov",
    latitude: "32.2988",
    longitude: "-90.1848",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Southern District of Mississippi.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Missouri - Eastern District
  {
    name: "Missouri Eastern Federal Public Defender",
    organizationType: "public_defender",
    address: "1010 Market Street, Suite 960",
    city: "St. Louis",
    state: "MO",
    zipCode: "63101",
    county: "St. Louis City",
    phone: "(314) 241-3222",
    email: null,
    website: "https://www.moed.uscourts.gov",
    latitude: "38.6270",
    longitude: "-90.1994",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Eastern District of Missouri.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Missouri - Western District
  {
    name: "Missouri Western Federal Public Defender",
    organizationType: "public_defender",
    address: "901 St. Louis Street, Suite 400",
    city: "Springfield",
    state: "MO",
    zipCode: "65806",
    county: "Greene",
    phone: "(417) 865-3791",
    email: null,
    website: "https://www.mowd.uscourts.gov",
    latitude: "37.2090",
    longitude: "-93.2923",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Western District of Missouri.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Montana
  {
    name: "Montana Federal Public Defender",
    organizationType: "public_defender",
    address: "100 North Park Avenue, Suite 300",
    city: "Helena",
    state: "MT",
    zipCode: "59601",
    county: "Lewis and Clark",
    phone: "(406) 449-8180",
    email: null,
    website: "https://www.mtd.uscourts.gov",
    latitude: "46.5891",
    longitude: "-112.0391",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the District of Montana.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Nebraska
  {
    name: "Nebraska Federal Public Defender",
    organizationType: "public_defender",
    address: "111 South 18th Plaza, Suite 1500",
    city: "Omaha",
    state: "NE",
    zipCode: "68102",
    county: "Douglas",
    phone: "(402) 280-4300",
    email: null,
    website: "https://www.ned.uscourts.gov",
    latitude: "41.2565",
    longitude: "-95.9345",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the District of Nebraska.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // New Hampshire
  {
    name: "New Hampshire Federal Public Defender",
    organizationType: "public_defender",
    address: "22 Bridge Street, 4th Floor",
    city: "Concord",
    state: "NH",
    zipCode: "03301",
    county: "Merrimack",
    phone: "(603) 225-1552",
    email: null,
    website: "https://www.nhd.uscourts.gov",
    latitude: "43.2081",
    longitude: "-71.5376",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the District of New Hampshire.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // New Jersey
  {
    name: "New Jersey Federal Public Defender",
    organizationType: "public_defender",
    address: "22 South Clinton Avenue, 8th Floor",
    city: "Trenton",
    state: "NJ",
    zipCode: "08608",
    county: "Mercer",
    phone: "(609) 989-0414",
    email: null,
    website: "https://www.njd.uscourts.gov",
    latitude: "40.2206",
    longitude: "-74.7597",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the District of New Jersey.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // New Mexico
  {
    name: "New Mexico Federal Public Defender",
    organizationType: "public_defender",
    address: "111 Lomas Boulevard NW, Suite 501",
    city: "Albuquerque",
    state: "NM",
    zipCode: "87102",
    county: "Bernalillo",
    phone: "(505) 346-2489",
    email: null,
    website: "https://www.nmd.uscourts.gov",
    latitude: "35.0844",
    longitude: "-106.6504",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the District of New Mexico.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // New York - Eastern District
  {
    name: "Federal Defenders of New York - Eastern District",
    organizationType: "public_defender",
    address: "One Pierrepont Plaza, 16th Floor",
    city: "Brooklyn",
    state: "NY",
    zipCode: "11201",
    county: "Kings",
    phone: "(718) 330-1200",
    email: null,
    website: "https://www.nyed.uscourts.gov",
    latitude: "40.6943",
    longitude: "-73.9879",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Eastern District of New York.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // New York - Northern District
  {
    name: "New York Northern Federal Public Defender",
    organizationType: "public_defender",
    address: "39 North Pearl Street, 4th Floor",
    city: "Albany",
    state: "NY",
    zipCode: "12207",
    county: "Albany",
    phone: "(518) 434-1718",
    email: null,
    website: "https://www.nynd.uscourts.gov",
    latitude: "42.6526",
    longitude: "-73.7562",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Northern District of New York.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // New York - Western District
  {
    name: "New York Western Federal Public Defender",
    organizationType: "public_defender",
    address: "68 Court Street, Suite 200",
    city: "Buffalo",
    state: "NY",
    zipCode: "14202",
    county: "Erie",
    phone: "(716) 551-5191",
    email: null,
    website: "https://www.nywd.uscourts.gov",
    latitude: "42.8864",
    longitude: "-78.8784",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Western District of New York.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // North Carolina - Eastern District
  {
    name: "North Carolina Eastern Federal Public Defender",
    organizationType: "public_defender",
    address: "310 New Bern Avenue, Suite 800",
    city: "Raleigh",
    state: "NC",
    zipCode: "27601",
    county: "Wake",
    phone: "(919) 856-4236",
    email: null,
    website: "https://www.nced.uscourts.gov",
    latitude: "35.7796",
    longitude: "-78.6382",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Eastern District of North Carolina.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // North Carolina - Middle District
  {
    name: "North Carolina Middle Federal Public Defender",
    organizationType: "public_defender",
    address: "101 South Edgeworth Street, 4th Floor",
    city: "Greensboro",
    state: "NC",
    zipCode: "27401",
    county: "Guilford",
    phone: "(336) 333-5351",
    email: null,
    website: "https://www.ncmd.uscourts.gov",
    latitude: "36.0726",
    longitude: "-79.7920",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Middle District of North Carolina.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // North Carolina - Western District
  {
    name: "North Carolina Western Federal Public Defender",
    organizationType: "public_defender",
    address: "227 West Trade Street, Suite 1650",
    city: "Charlotte",
    state: "NC",
    zipCode: "28202",
    county: "Mecklenburg",
    phone: "(704) 338-4550",
    email: null,
    website: "https://www.ncwd.uscourts.gov",
    latitude: "35.2271",
    longitude: "-80.8431",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Western District of North Carolina.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // North Dakota
  {
    name: "North Dakota Federal Public Defender",
    organizationType: "public_defender",
    address: "655 First Avenue North, Suite 500",
    city: "Fargo",
    state: "ND",
    zipCode: "58102",
    county: "Cass",
    phone: "(701) 297-7190",
    email: null,
    website: "https://www.ndd.uscourts.gov",
    latitude: "46.8772",
    longitude: "-96.7898",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the District of North Dakota.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Northern Mariana Islands
  {
    name: "Northern Mariana Islands Federal Public Defender",
    organizationType: "public_defender",
    address: "Horiguchi Building, Chalan Kanoa",
    city: "Saipan",
    state: "MP",
    zipCode: "96950",
    county: "Northern Mariana Islands",
    phone: "(670) 236-2850",
    email: null,
    website: "https://www.nmid.uscourts.gov",
    latitude: "15.1783",
    longitude: "145.7547",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the District of Northern Mariana Islands.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Ohio - Northern District
  {
    name: "Ohio Northern Federal Public Defender",
    organizationType: "public_defender",
    address: "801 West Superior Avenue, Suite 1450",
    city: "Cleveland",
    state: "OH",
    zipCode: "44113",
    county: "Cuyahoga",
    phone: "(216) 522-4856",
    email: null,
    website: "https://www.ohnd.uscourts.gov",
    latitude: "41.4993",
    longitude: "-81.6944",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Northern District of Ohio.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Ohio - Southern District
  {
    name: "Ohio Southern Federal Public Defender",
    organizationType: "public_defender",
    address: "10 West Broad Street, Suite 1020",
    city: "Columbus",
    state: "OH",
    zipCode: "43215",
    county: "Franklin",
    phone: "(614) 469-2999",
    email: null,
    website: "https://www.ohsd.uscourts.gov",
    latitude: "39.9612",
    longitude: "-82.9988",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Southern District of Ohio.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Oklahoma - Eastern District
  {
    name: "Oklahoma Eastern Federal Public Defender",
    organizationType: "public_defender",
    address: "106 North 5th Street, Suite 200",
    city: "Muskogee",
    state: "OK",
    zipCode: "74401",
    county: "Muskogee",
    phone: "(918) 687-2410",
    email: null,
    website: "https://www.oked.uscourts.gov",
    latitude: "35.7479",
    longitude: "-95.3697",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Eastern District of Oklahoma.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Oklahoma - Northern District
  {
    name: "Oklahoma Northern Federal Public Defender",
    organizationType: "public_defender",
    address: "224 South Boulder Avenue, Suite 300",
    city: "Tulsa",
    state: "OK",
    zipCode: "74103",
    county: "Tulsa",
    phone: "(918) 382-4787",
    email: null,
    website: "https://www.oknd.uscourts.gov",
    latitude: "36.1540",
    longitude: "-95.9928",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Northern District of Oklahoma.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Oklahoma - Western District
  {
    name: "Oklahoma Western Federal Public Defender",
    organizationType: "public_defender",
    address: "215 Dean A. McGee Avenue, Suite 109",
    city: "Oklahoma City",
    state: "OK",
    zipCode: "73102",
    county: "Oklahoma",
    phone: "(405) 609-5975",
    email: null,
    website: "https://www.okwd.uscourts.gov",
    latitude: "35.4676",
    longitude: "-97.5164",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Western District of Oklahoma.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Oregon
  {
    name: "Oregon Federal Public Defender",
    organizationType: "public_defender",
    address: "101 SW Main Street, Suite 1700",
    city: "Portland",
    state: "OR",
    zipCode: "97204",
    county: "Multnomah",
    phone: "(503) 326-2123",
    email: null,
    website: "https://www.ord.uscourts.gov",
    latitude: "45.5152",
    longitude: "-122.6784",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the District of Oregon.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Pennsylvania - Middle District
  {
    name: "Pennsylvania Middle Federal Public Defender",
    organizationType: "public_defender",
    address: "100 Chestnut Street, Suite 306",
    city: "Harrisburg",
    state: "PA",
    zipCode: "17101",
    county: "Dauphin",
    phone: "(717) 782-2237",
    email: null,
    website: "https://www.pamd.uscourts.gov",
    latitude: "40.2732",
    longitude: "-76.8867",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Middle District of Pennsylvania.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Pennsylvania - Western District
  {
    name: "Pennsylvania Western Federal Public Defender",
    organizationType: "public_defender",
    address: "1001 Liberty Avenue, Suite 1500",
    city: "Pittsburgh",
    state: "PA",
    zipCode: "15222",
    county: "Allegheny",
    phone: "(412) 644-6565",
    email: null,
    website: "https://www.pawd.uscourts.gov",
    latitude: "40.4406",
    longitude: "-79.9959",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Western District of Pennsylvania.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Puerto Rico
  {
    name: "Puerto Rico Federal Public Defender",
    organizationType: "public_defender",
    address: "150 Carlos Chardon Avenue, Suite 500",
    city: "San Juan",
    state: "PR",
    zipCode: "00918",
    county: "San Juan",
    phone: "(787) 729-6960",
    email: null,
    website: "https://www.prd.uscourts.gov",
    latitude: "18.4655",
    longitude: "-66.1057",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the District of Puerto Rico.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Rhode Island
  {
    name: "Rhode Island Federal Public Defender",
    organizationType: "public_defender",
    address: "10 Weybosset Street, Suite 300",
    city: "Providence",
    state: "RI",
    zipCode: "02903",
    county: "Providence",
    phone: "(401) 528-4281",
    email: null,
    website: "https://www.rid.uscourts.gov",
    latitude: "41.8240",
    longitude: "-71.4128",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the District of Rhode Island.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // South Carolina
  {
    name: "South Carolina Federal Public Defender",
    organizationType: "public_defender",
    address: "1310 Gadsden Street, Suite B",
    city: "Columbia",
    state: "SC",
    zipCode: "29201",
    county: "Richland",
    phone: "(803) 765-5305",
    email: null,
    website: "https://www.scd.uscourts.gov",
    latitude: "34.0007",
    longitude: "-81.0348",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the District of South Carolina.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // South Dakota
  {
    name: "South Dakota Federal Public Defender",
    organizationType: "public_defender",
    address: "515 South Dakota Avenue, Suite 201",
    city: "Sioux Falls",
    state: "SD",
    zipCode: "57104",
    county: "Minnehaha",
    phone: "(605) 330-4489",
    email: null,
    website: "https://www.sdd.uscourts.gov",
    latitude: "43.5473",
    longitude: "-96.7311",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the District of South Dakota.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Tennessee - Eastern District
  {
    name: "Tennessee Eastern Federal Public Defender",
    organizationType: "public_defender",
    address: "800 South Gay Street, Suite 2400",
    city: "Knoxville",
    state: "TN",
    zipCode: "37929",
    county: "Knox",
    phone: "(865) 637-7979",
    email: null,
    website: "https://www.tned.uscourts.gov",
    latitude: "35.9606",
    longitude: "-83.9207",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Eastern District of Tennessee.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Tennessee - Middle District
  {
    name: "Tennessee Middle Federal Public Defender",
    organizationType: "public_defender",
    address: "810 Broadway, Suite 200",
    city: "Nashville",
    state: "TN",
    zipCode: "37203",
    county: "Davidson",
    phone: "(615) 736-5047",
    email: null,
    website: "https://www.tnmd.uscourts.gov",
    latitude: "36.1627",
    longitude: "-86.7816",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Middle District of Tennessee.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Tennessee - Western District
  {
    name: "Tennessee Western Federal Public Defender",
    organizationType: "public_defender",
    address: "200 Jefferson Avenue, Suite 200",
    city: "Memphis",
    state: "TN",
    zipCode: "38103",
    county: "Shelby",
    phone: "(901) 544-3895",
    email: null,
    website: "https://www.tnwd.uscourts.gov",
    latitude: "35.1495",
    longitude: "-90.0490",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Western District of Tennessee.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Texas - Eastern District
  {
    name: "Texas Eastern Federal Public Defender",
    organizationType: "public_defender",
    address: "211 East Ferguson Street, Suite 504",
    city: "Tyler",
    state: "TX",
    zipCode: "75702",
    county: "Smith",
    phone: "(903) 590-1000",
    email: null,
    website: "https://www.txed.uscourts.gov",
    latitude: "32.3513",
    longitude: "-95.3011",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Eastern District of Texas.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Texas - Southern District
  {
    name: "Texas Southern Federal Public Defender",
    organizationType: "public_defender",
    address: "440 Louisiana Street, Suite 1350",
    city: "Houston",
    state: "TX",
    zipCode: "77002",
    county: "Harris",
    phone: "(713) 718-4600",
    email: null,
    website: "https://www.txs.uscourts.gov",
    latitude: "29.7604",
    longitude: "-95.3698",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Southern District of Texas.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Texas - Western District
  {
    name: "Texas Western Federal Public Defender",
    organizationType: "public_defender",
    address: "727 East Durango Boulevard, Suite A-406",
    city: "San Antonio",
    state: "TX",
    zipCode: "78206",
    county: "Bexar",
    phone: "(210) 229-6180",
    email: null,
    website: "https://www.txwd.uscourts.gov",
    latitude: "29.4241",
    longitude: "-98.4936",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Western District of Texas.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Utah
  {
    name: "Utah Federal Public Defender",
    organizationType: "public_defender",
    address: "46 West Broadway, Suite 110",
    city: "Salt Lake City",
    state: "UT",
    zipCode: "84101",
    county: "Salt Lake",
    phone: "(801) 524-4010",
    email: null,
    website: "https://www.utd.uscourts.gov",
    latitude: "40.7608",
    longitude: "-111.8910",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the District of Utah.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Vermont
  {
    name: "Vermont Federal Public Defender",
    organizationType: "public_defender",
    address: "11 Elmwood Avenue, Suite 4",
    city: "Burlington",
    state: "VT",
    zipCode: "05401",
    county: "Chittenden",
    phone: "(802) 660-2260",
    email: null,
    website: "https://www.vtd.uscourts.gov",
    latitude: "44.4759",
    longitude: "-73.2121",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the District of Vermont.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Virgin Islands
  {
    name: "Virgin Islands Federal Public Defender",
    organizationType: "public_defender",
    address: "5400 Veterans Drive, Suite 108",
    city: "St. Thomas",
    state: "VI",
    zipCode: "00802",
    county: "St. Thomas",
    phone: "(340) 774-0147",
    email: null,
    website: "https://www.vid.uscourts.gov",
    latitude: "18.3358",
    longitude: "-64.8963",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the District of Virgin Islands.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Virginia - Eastern District
  {
    name: "Virginia Eastern Federal Public Defender",
    organizationType: "public_defender",
    address: "701 East Broad Street, Suite 3600",
    city: "Richmond",
    state: "VA",
    zipCode: "23219",
    county: "Richmond City",
    phone: "(804) 771-2304",
    email: null,
    website: "https://www.vaed.uscourts.gov",
    latitude: "37.5407",
    longitude: "-77.4360",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Eastern District of Virginia.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Virginia - Western District
  {
    name: "Virginia Western Federal Public Defender",
    organizationType: "public_defender",
    address: "310 First Street SW, Suite 750",
    city: "Roanoke",
    state: "VA",
    zipCode: "24011",
    county: "Roanoke City",
    phone: "(540) 857-2471",
    email: null,
    website: "https://www.vawd.uscourts.gov",
    latitude: "37.2710",
    longitude: "-79.9414",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Western District of Virginia.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Washington - Eastern District
  {
    name: "Washington Eastern Federal Public Defender",
    organizationType: "public_defender",
    address: "920 West Riverside Avenue, Suite 700",
    city: "Spokane",
    state: "WA",
    zipCode: "99201",
    county: "Spokane",
    phone: "(509) 353-2100",
    email: null,
    website: "https://www.waed.uscourts.gov",
    latitude: "47.6588",
    longitude: "-117.4260",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Eastern District of Washington.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Washington - Western District (already have Seattle office, this is the main)
  {
    name: "Federal Defenders of Western Washington",
    organizationType: "public_defender",
    address: "1601 Fifth Avenue, Suite 700",
    city: "Seattle",
    state: "WA",
    zipCode: "98101",
    county: "King",
    phone: "(206) 553-1100",
    email: null,
    website: "https://www.wawd.uscourts.gov",
    latitude: "47.6101",
    longitude: "-122.3352",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Western District of Washington.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // West Virginia - Northern District
  {
    name: "West Virginia Northern Federal Public Defender",
    organizationType: "public_defender",
    address: "1125 Chapline Street, Suite 300",
    city: "Wheeling",
    state: "WV",
    zipCode: "26003",
    county: "Ohio",
    phone: "(304) 232-0140",
    email: null,
    website: "https://www.wvnd.uscourts.gov",
    latitude: "40.0640",
    longitude: "-80.7210",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Northern District of West Virginia.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // West Virginia - Southern District
  {
    name: "West Virginia Southern Federal Public Defender",
    organizationType: "public_defender",
    address: "300 Virginia Street East, Suite 2500",
    city: "Charleston",
    state: "WV",
    zipCode: "25301",
    county: "Kanawha",
    phone: "(304) 347-5928",
    email: null,
    website: "https://www.wvsd.uscourts.gov",
    latitude: "38.3498",
    longitude: "-81.6326",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Southern District of West Virginia.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Wisconsin - Eastern District
  {
    name: "Wisconsin Eastern Federal Public Defender",
    organizationType: "public_defender",
    address: "517 East Wisconsin Avenue, Suite 400",
    city: "Milwaukee",
    state: "WI",
    zipCode: "53202",
    county: "Milwaukee",
    phone: "(414) 297-1020",
    email: null,
    website: "https://www.wied.uscourts.gov",
    latitude: "43.0389",
    longitude: "-87.9065",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Eastern District of Wisconsin.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Wisconsin - Western District
  {
    name: "Wisconsin Western Federal Public Defender",
    organizationType: "public_defender",
    address: "222 West Washington Avenue, Suite 700",
    city: "Madison",
    state: "WI",
    zipCode: "53703",
    county: "Dane",
    phone: "(608) 264-5158",
    email: null,
    website: "https://www.wiwd.uscourts.gov",
    latitude: "43.0731",
    longitude: "-89.3840",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the Western District of Wisconsin.",
    dataSource: "federal_defender",
    isActive: true,
  },

  // Wyoming
  {
    name: "Wyoming Federal Public Defender",
    organizationType: "public_defender",
    address: "214 West 15th Street, Suite 100",
    city: "Cheyenne",
    state: "WY",
    zipCode: "82001",
    county: "Laramie",
    phone: "(307) 772-2781",
    email: null,
    website: "https://www.wyd.uscourts.gov",
    latitude: "41.1400",
    longitude: "-104.8202",
    services: [
      "Federal Criminal Defense",
      "Federal Appeals"
    ],
    eligibility: "Indigent defendants in federal criminal cases in the District of Wyoming.",
    dataSource: "federal_defender",
    isActive: true,
  },
];
