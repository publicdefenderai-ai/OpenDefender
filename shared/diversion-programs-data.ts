import { DiversionProgram } from "./schema";

/**
 * DIVERSION PROGRAMS DATABASE
 * 
 * Current Status: 110 diversion programs covering all 50 states + DC + Federal programs
 * Directory review: November 2026 (selected entries); original inventory: April 2026
 * 
 * Selected metropolitan coverage:
 * 
 * California (16 programs across 9 counties):
 * - Los Angeles County, San Francisco, Orange County, San Diego County
 * - Sacramento County (3 programs), Alameda County (2), Riverside County (2)
 * - Fresno County, Kern County
 * 
 * New York:
 * - Manhattan, Brooklyn, Bronx, Queens, Staten Island (Richmond)
 * - Nassau County, Albany County (2), Westchester County (3)
 * - Suffolk County
 * 
 * Georgia (16 programs across 8 counties + 1 city):
 * - Atlanta Metro: Fulton County, Cobb County, Gwinnett County (5), DeKalb County (3)
 * - Clayton County, Henry County, Douglas County, Sandy Springs (city)
 * 
 * Illinois (4 programs across 3 counties):
 * - Cook County/Chicago, DuPage County, Kane County (2), Winnebago County
 * 
 * Other Metro Programs (30 programs):
 * - Texas (Harris County, Dallas County)
 * - Florida (Miami-Dade, Broward County)
 * - Pennsylvania (Philadelphia)
 * - Washington (King County/Seattle)
 * - Colorado (Denver)
 * - Massachusetts (Suffolk County/Boston)
 * - Tennessee (Davidson County/Nashville)
 * - Oregon (Multnomah County/Portland)
 * - North Carolina (Mecklenburg County/Charlotte)
 * - Ohio (Franklin County/Columbus)
 * - Delaware, Wisconsin, Federal programs
 * 
 * Statewide Programs (33 programs added April 2026):
 * AK, AL, AR, AZ, CT, DC, HI, IA, ID, KS, KY, LA, ME, MD, MI, MO, MS, MT,
 * ND, NE, NH, NJ, NM, NV, OK, RI, SC, SD, UT, VA, VT, WV, WY
 * 
 * Data Sources:
 * 1. NADCP (National Association of Drug Court Professionals) – nadcp.org/find-a-drug-court/
 * 2. NDAA Prosecutor-Led Diversion Programs Directory (https://diversion.ndaa.org/)
 * 3. Center for Health and Justice Report (2024)
 * 4. State and county court systems (CA, NY, GA, IL and all 50 state court websites)
 * 5. District Attorney offices and prosecutor-led diversion programs
 * 6. Municipal court programs
 * 7. CrimeSolutions.gov Programs API (when available)
 * 8. State court websites and Solicitor-General offices
 * 9. State Department of Health agencies (WY, MT)
 * 
 * Program Types Include:
 * - Drug Courts & Substance Abuse Treatment
 * - Mental Health Courts & Crisis Intervention (SPMI programs)
 * - Veterans Courts & PTSD Treatment
 * - Pre-Booking/Pretrial Diversion (LEAD/PATH model)
 * - Pre-Filing/Pre-Arraignment Diversion
 * - Harm Reduction Programs
 * - Community Service & Restorative Justice
 * - Youth & Young Adult Diversion
 * - CARE Courts (California)
 * - Accountability Courts (Georgia)
 * - Deferred Prosecution Programs (Illinois, Kane County model)
 */

export const diversionPrograms: DiversionProgram[] = [
  // California Programs
  {
    id: "ca-la-drug-court",
    name: "Los Angeles County Drug Court",
    jurisdictionType: "county",
    state: "CA",
    county: "Los Angeles",
    cities: ["Los Angeles", "Pasadena", "Glendale", "Burbank"],
    zipCodes: ["90001", "90002", "90003", "90004", "90005", "90006", "90007", "90008", "90010", "90012", "90013", "90014", "90015", "90017", "90019", "90020", "90021", "90024", "90025", "90026", "90027", "90028", "90029", "90031", "90032", "90033", "90034", "90035", "90036", "90037", "90038", "90039", "90040", "90041", "90042", "90043", "90044", "90045", "90046", "90047", "90048", "90049", "90056", "90057", "90058", "90059", "90061", "90062", "90063", "90064", "90065", "90066", "90067", "90068", "90069", "90071", "90073", "90077", "90078", "90079", "90089", "90094", "90095", "90210", "90211", "90212", "90230", "90232", "90247", "90248", "90249", "90250", "90254", "90255", "90260", "90262", "90263", "90264", "90265", "90266", "90267", "90272", "90274", "90275", "90277", "90278", "90280", "90290", "90291", "90292", "90293", "90301", "90302", "90303", "90304", "90305", "90401", "90402", "90403", "90404", "90405", "90501", "90502", "90503", "90504", "90505", "90506", "90507", "90508", "90509", "90510", "90601", "90602", "90603", "90604", "90605", "90606", "90620", "90621", "90623", "90630", "90631", "90637", "90638", "90639", "90640", "90650", "90660", "90670", "90701", "90702", "90703", "90704", "90706", "90710", "90712", "90713", "90714", "90715", "90716", "90717", "90723", "90731", "90732", "90733", "90734", "90744", "90745", "90746", "90747", "90748", "90755", "90801", "90802", "90803", "90804", "90805", "90806", "90807", "90808", "90810", "90813", "90814", "90815", "90822", "90831", "90832", "90833", "90834", "90835", "90840", "90842", "90844", "90846", "90847", "90848", "91001", "91006", "91007", "91010", "91011", "91016", "91017", "91020", "91024", "91025", "91030", "91031", "91040", "91042", "91043", "91046", "91066", "91077", "91101", "91102", "91103", "91104", "91105", "91106", "91107", "91108", "91109", "91110", "91114", "91115", "91116", "91117", "91118", "91121", "91123", "91124", "91125", "91126", "91129", "91131", "91182", "91184", "91185", "91188", "91189", "91199", "91201", "91202", "91203", "91204", "91205", "91206", "91207", "91208", "91209", "91210", "91214", "91221", "91222", "91224", "91225", "91226"],
    programTypes: ["Drug Court", "Substance Abuse Treatment", "Mental Health Treatment"],
    eligibilityNotes: "Non-violent drug offenses, first-time offenders preferred. Must be Los Angeles County resident.",
    contact: {
      phone: "(213) 974-6535",
      email: "drugcourt@lacourt.org",
      url: "https://www.lacourt.org/division/criminal/drugcourt"
    },
    sources: ["Los Angeles Superior Court"],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },
  {
    id: "ca-la-mental-health-court",
    name: "Los Angeles County Mental Health Court",
    jurisdictionType: "county",
    state: "CA",
    county: "Los Angeles",
    cities: ["Los Angeles", "Pasadena", "Glendale", "Burbank", "Long Beach"],
    zipCodes: ["90001", "90002", "90003", "90004", "90005", "90006", "90007", "90008", "90010", "90012", "90013", "90014", "90015", "90017", "90019", "90020", "90021", "90024", "90025", "90026", "90027", "90028", "90029", "90031", "90032", "90033", "90034", "90035", "90036", "90037", "90038", "90039", "90040", "90041", "90042", "90043", "90044", "90045", "90046", "90047", "90048", "90049", "90056", "90057", "90058", "90059", "90061", "90062", "90063", "90064", "90065", "90066", "90067", "90068", "90069", "90071", "90073", "90077", "90078", "90079", "90089", "90094", "90095", "90210", "90211", "90212", "90230", "90232", "90247", "90248", "90249", "90250", "90254", "90255", "90260", "90262", "90263", "90264", "90265", "90266", "90267", "90272", "90274", "90275", "90277", "90278", "90280", "90290", "90291", "90292", "90293", "90301", "90302", "90303", "90304", "90305", "90401", "90402", "90403", "90404", "90405"],
    programTypes: ["Mental Health Court", "Rapid Diversion Program", "Court Linkage Program", "Crisis Intervention"],
    eligibilityNotes: "Mental health or substance use disorders. Pre-plea diversion available under California Penal Code Section 1001.36. Both misdemeanor and felony charges eligible.",
    contact: {
      phone: "(323) 226-2908",
      url: "https://www.lacourt.org/division/mentalhealth/mentalhealth.aspx"
    },
    sources: ["Los Angeles Superior Court Mental Health Division", "Center for Health and Justice Report"],
    lastUpdated: new Date("2024-09-20"),
    isActive: true,
  },
  {
    id: "ca-sf-community-justice",
    name: "San Francisco Community Justice Center",
    jurisdictionType: "city",
    state: "CA",
    county: "San Francisco",
    cities: ["San Francisco"],
    zipCodes: ["94102", "94103", "94104", "94105", "94107", "94108", "94109", "94110", "94111", "94112", "94114", "94115", "94116", "94117", "94118", "94121", "94122", "94123", "94124", "94127", "94129", "94130", "94131", "94132", "94133", "94134", "94158"],
    programTypes: ["Community Service", "Mental Health Court", "Homeless Court"],
    eligibilityNotes: "Quality-of-life offenses, mental health issues, homelessness-related charges.",
    contact: {
      phone: "(628) 217-6400",
      url: "https://sf.courts.ca.gov/divisions/collaborative-courts/community-justice-center"
    },
    sources: ["San Francisco Superior Court"],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },
  {
    id: "ca-orange-mental-health",
    name: "Orange County Mental Health Court",
    jurisdictionType: "county",
    state: "CA",
    county: "Orange",
    cities: ["Anaheim", "Irvine", "Santa Ana", "Huntington Beach", "Garden Grove"],
    zipCodes: ["90620", "90621", "90623", "90630", "90631", "90680", "90720", "90740", "92602", "92603", "92604", "92606", "92612", "92614", "92617", "92618", "92620", "92623", "92625", "92626", "92627", "92628", "92629", "92630", "92637", "92646", "92647", "92648", "92649", "92650", "92651", "92652", "92653", "92654", "92655", "92656", "92657", "92658", "92660", "92661", "92662", "92663", "92677", "92678", "92679", "92683", "92684", "92685", "92688", "92690", "92691", "92692", "92693", "92694", "92697", "92698", "92701", "92702", "92703", "92704", "92705", "92706", "92707", "92708", "92711", "92712", "92728", "92735", "92780", "92781", "92782", "92799", "92801", "92802", "92803", "92804", "92805", "92806", "92807", "92808", "92831", "92832", "92833", "92834", "92835", "92836", "92837", "92838", "92840", "92841", "92842", "92843", "92844", "92845", "92846", "92850", "92856", "92857", "92859", "92860", "92861", "92862", "92863", "92864", "92865", "92866", "92867", "92868", "92869", "92870", "92871"],
    programTypes: ["Mental Health Court", "Crisis Intervention", "Psychiatric Treatment"],
    eligibilityNotes: "Mental health diagnosis required, non-violent offenses preferred.",
    contact: {
      phone: "(714) 834-3734",
      url: "https://www.occourts.org"
    },
    sources: ["Orange County Superior Court"],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // Texas Programs
  {
    id: "tx-harris-drug-court",
    name: "Harris County STAR (Success Through Addiction Recovery) Drug Court",
    jurisdictionType: "county",
    state: "TX",
    county: "Harris",
    cities: ["Houston", "Pasadena", "Baytown"],
    zipCodes: ["77001", "77002", "77003", "77004", "77005", "77006", "77007", "77008", "77009", "77010", "77011", "77012", "77013", "77014", "77015", "77016", "77017", "77018", "77019", "77020", "77021", "77022", "77023", "77024", "77025", "77026", "77027", "77028", "77029", "77030", "77031", "77032", "77033", "77034", "77035", "77036", "77037", "77038", "77039", "77040", "77041", "77042", "77043", "77044", "77045", "77046", "77047", "77048", "77049", "77050", "77051", "77052", "77053", "77054", "77055", "77056", "77057", "77058", "77059", "77060", "77061", "77062", "77063", "77064", "77065", "77066", "77067", "77068", "77069", "77070", "77071", "77072", "77073", "77074", "77075", "77076", "77077", "77078", "77079", "77080", "77081", "77082", "77083", "77084", "77085", "77086", "77087", "77088", "77089", "77090", "77091", "77092", "77093", "77094", "77095", "77096", "77098", "77099", "77201", "77202", "77336", "77338", "77339", "77345", "77346", "77354", "77357", "77365", "77373", "77375", "77377", "77379", "77388", "77389", "77396", "77401", "77402", "77407", "77429", "77433", "77441", "77447", "77449", "77450", "77459", "77477", "77478", "77479", "77489", "77493", "77494", "77498", "77502", "77503", "77504", "77505", "77506", "77507", "77508", "77530", "77532", "77536", "77547", "77562", "77571", "77572", "77573", "77581", "77584", "77586", "77587", "77598"],
    programTypes: ["Drug Court", "DWI Court", "Felony Mental Health Court"],
    eligibilityNotes: "STAR Adult Drug Court combines court supervision with treatment for substance use. Contact the program to confirm current referral, residence and admission requirements.",
    contact: {
      phone: "(713) 755-4610",
      email: "star@justex.net",
      url: "https://justex.net/adult"
    },
    sources: ["Harris County District Courts", "https://justex.net/adult"],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },
  {
    id: "tx-dallas-veterans",
    name: "Dallas County Veterans Court",
    jurisdictionType: "county",
    state: "TX",
    county: "Dallas",
    cities: ["Dallas", "Plano", "Irving", "Garland"],
    zipCodes: ["75001", "75002", "75006", "75007", "75010", "75011", "75013", "75014", "75015", "75016", "75017", "75019", "75020", "75023", "75024", "75025", "75026", "75030", "75032", "75034", "75035", "75038", "75039", "75040", "75041", "75042", "75043", "75044", "75045", "75046", "75047", "75048", "75049", "75050", "75051", "75052", "75054", "75056", "75057", "75060", "75061", "75062", "75063", "75064", "75065", "75067", "75069", "75070", "75071", "75074", "75075", "75080", "75081", "75082", "75083", "75085", "75086", "75087", "75088", "75089", "75093", "75094", "75098", "75115", "75116", "75125", "75126", "75134", "75137", "75138", "75141", "75142", "75146", "75149", "75150", "75152", "75154", "75156", "75159", "75166", "75172", "75173", "75180", "75181", "75182", "75187", "75201", "75202", "75203", "75204", "75205", "75206", "75207", "75208", "75209", "75210", "75211", "75212", "75214", "75215", "75216", "75217", "75218", "75219", "75220", "75221", "75222", "75223", "75224", "75225", "75226", "75227", "75228", "75229", "75230", "75231", "75232", "75233", "75234", "75235", "75236", "75237", "75238", "75240", "75241", "75243", "75244", "75246", "75247", "75248", "75249", "75250", "75251", "75252", "75253", "75254", "75258", "75260", "75261", "75262", "75263", "75264", "75265", "75266", "75267", "75270", "75275", "75277", "75283", "75284", "75285", "75287", "75294", "75295", "75301", "75303", "75310", "75312", "75313", "75315", "75320", "75323", "75326", "75336", "75339", "75342", "75354", "75355", "75356", "75357", "75359", "75360", "75363", "75364", "75367", "75368", "75370", "75371", "75372", "75373", "75374", "75376", "75378", "75379", "75380", "75381", "75382", "75386", "75387", "75388", "75389", "75390", "75391", "75392", "75393", "75394", "75395", "75396", "75397", "75398"],
    programTypes: ["Veterans Court", "PTSD Treatment", "Substance Abuse for Veterans"],
    eligibilityNotes: "Veterans, reservists and active-duty service members charged in Dallas County may apply. The court considers felony and misdemeanor cases and reviews treatment needs and other eligibility criteria before admission.",
    contact: {
      phone: "(214) 875-4939",
      url: "https://www.dallascounty.org/Assets/uploads/docs/courts/criminal_district/court4/VTC-Application-4.9.2026.pdf"
    },
    sources: ["Dallas County Courts", "https://www.dallascounty.org/Assets/uploads/docs/courts/criminal_district/court4/VTC-Application-4.9.2026.pdf"],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // Florida Programs  
  {
    id: "fl-miami-dade-drug",
    name: "Miami-Dade Drug Court",
    jurisdictionType: "county",
    state: "FL",
    county: "Miami-Dade",
    cities: ["Miami", "Miami Beach", "Coral Gables", "Hialeah"],
    zipCodes: ["33101", "33102", "33109", "33111", "33112", "33114", "33116", "33119", "33122", "33124", "33125", "33126", "33127", "33128", "33129", "33130", "33131", "33132", "33133", "33134", "33135", "33136", "33137", "33138", "33139", "33140", "33141", "33142", "33143", "33144", "33145", "33146", "33147", "33150", "33154", "33155", "33156", "33157", "33158", "33161", "33162", "33163", "33164", "33165", "33166", "33167", "33168", "33169", "33170", "33172", "33173", "33174", "33175", "33176", "33177", "33178", "33179", "33180", "33181", "33182", "33183", "33184", "33185", "33186", "33187", "33188", "33189", "33190", "33193", "33194", "33196", "33197", "33199"],
    programTypes: ["Drug Court", "Mental Health Court", "Veterans Court"],
    eligibilityNotes: "The adult drug court considers qualifying drug possession or purchase charges. State Attorney approval and criminal-history restrictions apply. The adult Drug Court FAQ describes treatment, supervision and exclusions. Mental health and veterans courts are separate programs.",
    contact: {
      phone: "(305) 349-7000",
      url: "https://www.jud11.flcourts.org/Frequently-Asked-Questions-for-Miami-Dade-County-Drug-Court"
    },
    sources: ["Miami-Dade County Court", "https://www.jud11.flcourts.org/Frequently-Asked-Questions-for-Miami-Dade-County-Drug-Court"],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },
  {
    id: "fl-broward-mental-health",
    name: "Broward County Mental Health Court",
    jurisdictionType: "county",
    state: "FL",
    county: "Broward",
    cities: ["Fort Lauderdale", "Hollywood", "Pembroke Pines", "Coral Springs"],
    zipCodes: ["33004", "33009", "33019", "33020", "33021", "33023", "33024", "33025", "33026", "33027", "33028", "33029", "33060", "33062", "33063", "33064", "33065", "33066", "33067", "33068", "33069", "33071", "33073", "33074", "33075", "33076", "33077", "33301", "33302", "33303", "33304", "33305", "33306", "33307", "33308", "33309", "33311", "33312", "33313", "33314", "33315", "33316", "33317", "33318", "33319", "33320", "33321", "33322", "33323", "33324", "33325", "33326", "33327", "33328", "33330", "33331", "33332", "33334", "33351", "33355", "33359", "33388", "33394"],
    programTypes: ["Mental Health Court", "Crisis Intervention", "Dual Diagnosis Treatment"],
    eligibilityNotes: "Voluntary misdemeanor mental health court for people with qualifying mental illness, developmental disabilities or neurological conditions. Co-occurring conditions may qualify. The felony mental health docket is separate.",
    contact: {
      phone: "(954) 831-6565",
      url: "https://www.17th.flcourts.org/11-mental-health-county-court/"
    },
    sources: ["Broward County Court", "https://www.17th.flcourts.org/11-mental-health-county-court/"],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // New York Programs
  {
    id: "ny-manhattan-drug",
    name: "Manhattan Drug Treatment Court",
    jurisdictionType: "county",
    state: "NY",
    county: "New York",
    cities: ["New York"],
    zipCodes: ["10001", "10002", "10003", "10004", "10005", "10006", "10007", "10009", "10010", "10011", "10012", "10013", "10014", "10016", "10017", "10018", "10019", "10020", "10021", "10022", "10023", "10024", "10025", "10026", "10027", "10028", "10029", "10030", "10031", "10032", "10033", "10034", "10035", "10036", "10037", "10038", "10039", "10040", "10044", "10065", "10069", "10075", "10103", "10110", "10111", "10112", "10115", "10119", "10128", "10152", "10153", "10154", "10162", "10165", "10167", "10168", "10169", "10170", "10171", "10172", "10173", "10174", "10177", "10199", "10271", "10278", "10279", "10280", "10282"],
    programTypes: ["Drug Treatment Court", "Alcohol Treatment Court", "Mental Health Court"],
    eligibilityNotes: "Non-violent drug offenses, alcohol-related offenses, mental health issues. Must be Manhattan resident.",
    contact: {
      phone: "(646) 386-5730",
      url: "https://www.nycourts.gov/courts/1jd/criminal/drug_treatment_court.shtml"
    },
    sources: ["New York State Unified Court System"],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },
  {
    id: "ny-brooklyn-veterans",
    name: "Brooklyn Veterans Court",
    jurisdictionType: "county",
    state: "NY",
    county: "Kings",
    cities: ["Brooklyn"],
    zipCodes: ["11201", "11203", "11204", "11205", "11206", "11207", "11208", "11209", "11210", "11211", "11212", "11213", "11214", "11215", "11216", "11217", "11218", "11219", "11220", "11221", "11222", "11223", "11224", "11225", "11226", "11228", "11229", "11230", "11231", "11232", "11233", "11234", "11235", "11236", "11237", "11238", "11239", "11241", "11242", "11243", "11249", "11251", "11252"],
    programTypes: ["Veterans Court", "PTSD Treatment", "Military Family Support"],
    eligibilityNotes: "Military veterans and their families, service-related mental health issues.",
    contact: {
      phone: "(347) 296-1484",
      url: "https://www.nycourts.gov/courts/2jd/kings/criminal/veteranscourt.shtml"
    },
    sources: ["Brooklyn Criminal Court"],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },
  {
    id: "ny-bronx-tasc",
    name: "Bronx TASC Diversion Program",
    jurisdictionType: "county",
    state: "NY",
    county: "Bronx",
    cities: ["Bronx"],
    zipCodes: ["10451", "10452", "10453", "10454", "10455", "10456", "10457", "10458", "10459", "10460", "10461", "10462", "10463", "10464", "10465", "10466", "10467", "10468", "10469", "10470", "10471", "10472", "10473", "10474", "10475"],
    programTypes: ["Substance Abuse Treatment", "Case Management", "Court Liaison Services"],
    eligibilityNotes: "Non-violent substance abuse related offenses. Minimum 12-18 month program commitment. Successful completion may result in case reduction or dismissal.",
    contact: {
      phone: "(718) 538-7416",
      email: "Yolanda.Cardona@EAC-Network.org",
      url: "https://eac-network.org/bronx-tasc/"
    },
    sources: ["EAC Network", "Center for Health and Justice Report"],
    lastUpdated: new Date("2024-09-20"),
    isActive: true,
  },

  // Delaware Programs
  {
    id: "de-wilmington-tasc",
    name: "Delaware TASC Treatment Access Center - Wilmington",
    jurisdictionType: "state",
    state: "DE",
    county: "New Castle",
    cities: ["Wilmington", "Newark", "New Castle"],
    zipCodes: ["19701", "19702", "19703", "19706", "19707", "19708", "19709", "19710", "19711", "19712", "19713", "19714", "19715", "19716", "19717", "19718", "19720", "19721", "19801", "19802", "19803", "19804", "19805", "19806", "19807", "19808", "19809", "19810", "19850", "19880", "19884", "19885", "19886", "19890", "19891", "19892", "19893", "19894", "19895", "19896", "19897", "19898"],
    programTypes: ["Drug Court", "Mental Health Court", "Veterans Court", "TIP/WISH Court", "Re-Entry Court"],
    eligibilityNotes: "TASC links Delaware courts and treatment services through assessment, referrals and case management. A voluntary drug diversion program is available. Contact TASC for the applicable duration.",
    contact: {
      phone: "(302) 577-2711",
      url: "https://dhss.delaware.gov/dsamh/division-of-substance-abuse-and-mental-health/treatment-access-centers/"
    },
    sources: ["Delaware Department of Health and Social Services", "Center for Health and Justice Report", "https://dhss.delaware.gov/dsamh/division-of-substance-abuse-and-mental-health/treatment-access-centers/"],
    lastUpdated: new Date("2024-09-20"),
    isActive: true,
  },
  {
    id: "de-georgetown-tasc",
    name: "Delaware TASC Treatment Access Center - Georgetown",
    jurisdictionType: "state",
    state: "DE",
    county: "Sussex",
    cities: ["Georgetown", "Rehoboth Beach", "Lewes", "Seaford", "Milford"],
    zipCodes: ["19930", "19931", "19933", "19934", "19936", "19938", "19939", "19940", "19941", "19943", "19944", "19945", "19946", "19947", "19950", "19951", "19952", "19953", "19954", "19955", "19956", "19958", "19960", "19962", "19963", "19964", "19966", "19967", "19968", "19969", "19970", "19971", "19973", "19975", "19977", "19979", "19980"],
    programTypes: ["Drug Court", "Mental Health Court", "Veterans Court", "TIP/WISH Court", "Re-Entry Court"],
    eligibilityNotes: "Serves Sussex County through assessment, referral, case management and a voluntary drug diversion program.",
    contact: {
      phone: "(302) 854-0010",
      url: "https://dhss.delaware.gov/dsamh/division-of-substance-abuse-and-mental-health/treatment-access-centers/"
    },
    sources: ["Delaware Department of Health and Social Services", "Center for Health and Justice Report", "https://dhss.delaware.gov/dsamh/division-of-substance-abuse-and-mental-health/treatment-access-centers/"],
    lastUpdated: new Date("2024-09-20"),
    isActive: true,
  },

  // Wisconsin Programs
  {
    id: "wi-milwaukee-drug-court",
    name: "Milwaukee County Drug Treatment Court",
    jurisdictionType: "county",
    state: "WI",
    county: "Milwaukee",
    cities: ["Milwaukee", "West Allis", "Wauwatosa", "Greenfield"],
    zipCodes: ["53201", "53202", "53203", "53204", "53205", "53206", "53207", "53208", "53209", "53210", "53211", "53212", "53213", "53214", "53215", "53216", "53217", "53218", "53219", "53220", "53221", "53222", "53223", "53224", "53225", "53226", "53227", "53228", "53233", "53234", "53235", "53237", "53259", "53263", "53274", "53278", "53288", "53290", "53293", "53295"],
    programTypes: ["Drug Treatment Court", "Treatment Alternatives and Diversion (TAD)"],
    eligibilityNotes: "Milwaukee’s Drug Treatment Court is a post-plea program with judicial supervision and treatment. Separate county diversion and deferred-prosecution programs have different referral requirements and outcomes.",
    contact: {
      phone: "(414) 223-1341",
      url: "https://county.milwaukee.gov/EN/Courts/Court-Resources/Drug-Treatment-Court"
    },
    sources: ["Milwaukee County Courts", "Wisconsin DOJ TAD Program", "Center for Health and Justice Report", "https://county.milwaukee.gov/EN/Courts/Court-Resources/Drug-Treatment-Court"],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // Illinois Programs
  {
    id: "il-cook-drug-court",
    name: "Cook County Drug Treatment Court",
    jurisdictionType: "county",
    state: "IL",
    county: "Cook",
    cities: ["Chicago", "Skokie", "Rolling Meadows", "Maywood", "Bridgeview", "Markham"],
    zipCodes: ["60601", "60602", "60603", "60604", "60605", "60606", "60607", "60608", "60609", "60610", "60611", "60612", "60613", "60614", "60615", "60616", "60617", "60618", "60619", "60620", "60621", "60622", "60623", "60624", "60625", "60626", "60628", "60629", "60630", "60631", "60632", "60633", "60634", "60636", "60637", "60638", "60639", "60640", "60641", "60642", "60643", "60644", "60645", "60646", "60647", "60649", "60651", "60652", "60653", "60654", "60655", "60656", "60657", "60659", "60660", "60661"],
    programTypes: ["Drug Court", "Substance Abuse Treatment"],
    eligibilityNotes: "High-risk, high-need defendants with non-violent felony offenses eligible for probation. Diagnosed substance use disorder required. Under 730 ILCS 166/20(b)(4), the five-year lookback for a crime of violence excludes incarceration, parole and mandatory supervised release. 18-24 month program duration.",
    contact: {
      phone: "(312) 603-8000",
      email: "problemsolvingcourts@cookcountyil.gov",
      url: "https://www.cookcountycourtil.gov/division/problem-solving-courts/drug-treatment-court-programs"
    },
    sources: ["Cook County Circuit Court", "https://www.ilga.gov/documents/legislation/ilcs/documents/073001660K20.htm"],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },
  {
    id: "il-cook-mental-health-court",
    name: "Cook County Mental Health Treatment Court",
    jurisdictionType: "county",
    state: "IL",
    county: "Cook",
    cities: ["Chicago", "Skokie", "Rolling Meadows", "Maywood", "Bridgeview", "Markham"],
    zipCodes: ["60601", "60602", "60603", "60604", "60605", "60606", "60607", "60608", "60609", "60610", "60611", "60612", "60613", "60614", "60615", "60616", "60617", "60618", "60619", "60620", "60621", "60622", "60623", "60624", "60625", "60626", "60628", "60629", "60630", "60631", "60632", "60633", "60634", "60636", "60637", "60638", "60639", "60640", "60641", "60642", "60643", "60644", "60645", "60646", "60647", "60649", "60651", "60652", "60653", "60654", "60655", "60656", "60657", "60659", "60660", "60661"],
    programTypes: ["Mental Health Court", "Crisis Intervention", "Intensive Probation"],
    eligibilityNotes: "High-risk, high-need repeat offenders with felony non-violent offenses. Diagnosed mental health disorder required. 24 months intensive probation. Capacity up to 35 participants per court.",
    contact: {
      phone: "(312) 603-8000",
      email: "problemsolvingcourts@cookcountyil.gov",
      url: "https://www.cookcountycourtil.gov/division/problem-solving-courts/"
    },
    sources: ["Cook County Circuit Court"],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // Pennsylvania Programs  
  {
    id: "pa-phila-drug-court",
    name: "Philadelphia Drug Treatment Court",
    jurisdictionType: "city",
    state: "PA",
    county: "Philadelphia",
    cities: ["Philadelphia"],
    zipCodes: ["19102", "19103", "19104", "19106", "19107", "19111", "19112", "19113", "19114", "19115", "19116", "19118", "19119", "19120", "19121", "19122", "19123", "19124", "19125", "19126", "19127", "19128", "19129", "19130", "19131", "19132", "19133", "19134", "19135", "19136", "19137", "19138", "19139", "19140", "19141", "19142", "19143", "19144", "19145", "19146", "19147", "19148", "19149", "19150", "19151", "19152", "19153", "19154"],
    programTypes: ["Drug Treatment Court", "Substance Abuse Treatment", "Dual Diagnosis"],
    eligibilityNotes: "Year-long intensive program spanning four phases. No-contest plea required. Admission depends on criminal history. After successful completion the plea is withdrawn and charges are dismissed. Expungement eligibility has an additional arrest-free period of one year. Dual diagnosis option available for co-occurring mental health and substance abuse issues.",
    contact: {
      url: "https://phillyda.org/adult-diversion-and-alternatives-to-incarceration-initiatives/"
    },
    sources: ["Philadelphia District Attorney's Office", "https://phillyda.org/adult-diversion-and-alternatives-to-incarceration-initiatives/"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },
  {
    id: "pa-phila-amp",
    name: "Philadelphia Accelerated Misdemeanor Program (AMP)",
    jurisdictionType: "city",
    state: "PA",
    county: "Philadelphia",
    cities: ["Philadelphia"],
    zipCodes: ["19102", "19103", "19104", "19106", "19107", "19111", "19112", "19113", "19114", "19115", "19116", "19118", "19119", "19120", "19121", "19122", "19123", "19124", "19125", "19126", "19127", "19128", "19129", "19130", "19131", "19132", "19133", "19134", "19135", "19136", "19137", "19138", "19139", "19140", "19141", "19142", "19143", "19144", "19145", "19146", "19147", "19148", "19149", "19150", "19151", "19152", "19153", "19154"],
    programTypes: ["Pretrial Diversion", "Community Service"],
    eligibilityNotes: "AMP I serves first-time participants and AMP II serves people with prior nonviolent misdemeanor convictions. The case remains in pretrial status. AMP I generally involves 12–18 hours of community service or proof of drug treatment. The DA reports an average of five weeks from admission to completion for AMP I. AMP II conditions differ.",
    contact: {
      url: "https://phillyda.org/adult-diversion-and-alternatives-to-incarceration-initiatives/"
    },
    sources: ["Philadelphia District Attorney's Office", "https://phillyda.org/adult-diversion-and-alternatives-to-incarceration-initiatives/"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },
  {
    id: "pa-phila-veterans-court",
    name: "Philadelphia Veterans Court",
    jurisdictionType: "city",
    state: "PA",
    county: "Philadelphia",
    cities: ["Philadelphia"],
    zipCodes: ["19102", "19103", "19104", "19106", "19107", "19111", "19112", "19113", "19114", "19115", "19116", "19118", "19119", "19120", "19121", "19122", "19123", "19124", "19125", "19126", "19127", "19128", "19129", "19130", "19131", "19132", "19133", "19134", "19135", "19136", "19137", "19138", "19139", "19140", "19141", "19142", "19143", "19144", "19145", "19146", "19147", "19148", "19149", "19150", "19151", "19152", "19153", "19154"],
    programTypes: ["Veterans Court", "Mental Health Treatment", "Substance Abuse Treatment"],
    eligibilityNotes: "Active or former military members charged with non-violent misdemeanors. Services through VA officials include drug/alcohol treatment, mental health treatment, medical referrals, housing assistance, employment training. Includes mentor matching. For cases admitted pretrial or by a no-contest plea, successful completion followed by court termination makes the case eligible for expungement. For a petition under Pa.R.Crim.P. 790, file with the clerk. The Commonwealth generally has 60 days to consent or object. The court decides whether to issue an order. Confirm the applicable procedure and fee with the clerk.",
    contact: {
      url: "https://phillyda.org/adult-diversion-and-alternatives-to-incarceration-initiatives/"
    },
    sources: ["Philadelphia District Attorney's Office", "https://phillyda.org/adult-diversion-and-alternatives-to-incarceration-initiatives/", "https://www.pacodeandbulletin.gov/Display/pacode?file=/secure/pacode/data/234/chapter7/s790.html"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },

  // Washington Programs
  {
    id: "wa-king-lead",
    name: "Seattle-King County LEAD Program (Let Everyone Advance with Dignity)",
    jurisdictionType: "county",
    state: "WA",
    county: "King",
    cities: ["Seattle", "Burien"],
    zipCodes: ["98101", "98102", "98103", "98104", "98105", "98106", "98107", "98108", "98109", "98112", "98115", "98116", "98117", "98118", "98119", "98121", "98122", "98125", "98126", "98133", "98134", "98136", "98144", "98146", "98148", "98154", "98164", "98166", "98168", "98174", "98177", "98178", "98188", "98195", "98199"],
    programTypes: ["Pre-Booking Diversion", "Harm Reduction", "Case Management"],
    eligibilityNotes: "Low-level drug possession/sales (≤3 grams), prostitution, property crimes. Cannot have felony convictions for serious violent crimes. Harm-reduction oriented, abstinence not required. Services provided as long as needed with no fixed end date. Note: Program capacity was reduced in Q2 2025 due to funding cuts; referral acceptance rates are lower than in prior years.",
    contact: {
      phone: "(206) 392-0050",
      url: "https://kingcounty.gov/en/dept/dchs/human-social-services/behavioral-health-recovery/diversion-reentry-programs/lead"
    },
    sources: ["King County Department of Community and Human Services", "Purpose, Dignity, Action (PDA)", "https://kingcounty.gov/en/dept/dchs/human-social-services/behavioral-health-recovery/diversion-reentry-programs/lead"],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // Colorado Programs
  {
    id: "co-denver-reach",
    name: "Denver County Court Competency Diversion Program",
    jurisdictionType: "city",
    state: "CO",
    county: "Denver",
    cities: ["Denver"],
    zipCodes: ["80201", "80202", "80203", "80204", "80205", "80206", "80207", "80209", "80210", "80211", "80212", "80214", "80216", "80218", "80219", "80220", "80221", "80222", "80223", "80224", "80226", "80227", "80230", "80231", "80232", "80235", "80236", "80237", "80238", "80239", "80246", "80247", "80249", "80264"],
    programTypes: ["Mental Health Diversion", "Competency Screening", "Treatment Linkage"],
    eligibilityNotes: "Denver County Court’s competency diversion program serves people with lower-level charges whose competency to proceed is in question. Participants work with Bridges of Colorado on individualized community treatment plans. Successful completion can lead to dismissal. The statewide competency diversion pathway has separate rules.",
    contact: {
      url: "https://www.denverda.org/"
    },
    sources: ["Denver County Court", "Bridges of Colorado", "https://www.denvercountycourt.org/court/"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },

  // Georgia Programs
  {
    id: "ga-fulton-diversion-center",
    name: "Fulton County Center for Diversion & Services",
    jurisdictionType: "county",
    state: "GA",
    county: "Fulton",
    cities: ["Atlanta"],
    zipCodes: ["30301", "30302", "30303", "30304", "30305", "30306", "30307", "30308", "30309", "30310", "30311", "30312", "30313", "30314", "30315", "30316", "30317", "30318", "30319", "30324", "30326", "30327", "30328", "30329", "30331", "30332", "30334", "30336", "30337", "30338", "30339", "30340", "30341", "30342", "30343", "30344", "30345", "30346", "30350", "30354", "30363"],
    programTypes: ["Pre-Arrest Diversion", "Crisis Services", "Sobering Center", "Case Management"],
    eligibilityNotes: "24/7 services. Age 18+. Voluntary participation required. Brought by law enforcement or first responders. Excludes violent crimes or substantial risk of harm. Offenses driven by mental health crises, substance use, extreme poverty, or homelessness.",
    contact: {
      url: "https://www.fultonsuperiorcourtga.gov/center-for-diversion-and-services"
    },
    sources: ["Fulton County Superior Court", "Grady Health System"],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },
  {
    id: "ga-fulton-drug-court",
    name: "Fulton County Accountability Court (Drug Court)",
    jurisdictionType: "county",
    state: "GA",
    county: "Fulton",
    cities: ["Atlanta"],
    zipCodes: ["30301", "30302", "30303", "30304", "30305", "30306", "30307", "30308", "30309", "30310", "30311", "30312", "30313", "30314", "30315", "30316", "30317", "30318", "30319", "30324", "30326", "30327", "30328", "30329", "30331", "30332", "30334", "30336", "30337", "30338", "30339", "30340", "30341", "30342", "30343", "30344", "30345", "30346", "30350", "30354", "30363"],
    programTypes: ["Drug Court", "Substance Abuse Treatment", "Job Training"],
    eligibilityNotes: "Non-violent felony drug offenses. Substance abuse and/or mental health challenges. Age 17+, Fulton County resident. Voluntary participation. 18 months minimum program. $750 participation fee.",
    contact: {
      phone: "(404) 613-5313",
      url: "https://fultoncourt.org/sites/default/files/accountability/DrugCourtParticipantHandbook2024.pdf"
    },
    sources: ["Fulton County Superior Court", "https://fultoncourt.org/sites/default/files/accountability/DrugCourtParticipantHandbook2024.pdf"],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // Massachusetts Programs
  {
    id: "ma-suffolk-drug-diversion",
    name: "Suffolk County Services Over Sentences (SOS)",
    jurisdictionType: "county",
    state: "MA",
    county: "Suffolk",
    cities: ["Boston"],
    zipCodes: ["02108", "02109", "02110", "02111", "02113", "02114", "02115", "02116", "02118", "02119", "02120", "02121", "02122", "02124", "02125", "02126", "02127", "02128", "02129", "02130", "02131", "02132", "02134", "02135", "02136", "02163", "02199", "02203", "02210", "02215"],
    programTypes: ["Drug Diversion", "Substance Abuse Treatment", "Pre-Disposition"],
    eligibilityNotes: "Voluntary predisposition program for people with substance use disorders, including co-occurring mental health conditions. North Suffolk Community Services and the Suffolk District Attorney’s Office offer treatment planning and recovery coaching. Possible outcomes depend on the case.",
    contact: {
      url: "https://northsuffolk.org/addiction-services/"
    },
    sources: ["Suffolk County District Attorney's Office", "North Suffolk Mental Health Association", "https://northsuffolk.org/addiction-services/"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },
  {
    id: "ma-suffolk-recovery-court",
    name: "Suffolk County Recovery Court",
    jurisdictionType: "county",
    state: "MA",
    county: "Suffolk",
    cities: ["Boston", "Dorchester", "Charlestown", "South Boston", "East Boston"],
    zipCodes: ["02108", "02109", "02110", "02111", "02113", "02114", "02115", "02116", "02118", "02119", "02120", "02121", "02122", "02124", "02125", "02126", "02127", "02128", "02129", "02130", "02131", "02132", "02134", "02135", "02136", "02163", "02199", "02203", "02210", "02215"],
    programTypes: ["Recovery Court", "Substance Abuse Treatment", "Judicial Supervision"],
    eligibilityNotes: "Nonviolent individuals with substance use disorders. Alternative to incarceration. Integrates substance abuse treatment with case processing and judicial supervision.",
    contact: {
      phone: "(857) 287-1806",
      email: "Elizabeth.Plange@BMC.org",
      url: "https://www.bmc.org/programs/criminal-justice-mental-health-programs"
    },
    sources: ["Boston Medical Center"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },
  {
    id: "ma-suffolk-mental-health-court",
    name: "Suffolk County Mental Health Court",
    jurisdictionType: "county",
    state: "MA",
    county: "Suffolk",
    cities: ["Boston", "West Roxbury", "Roxbury"],
    zipCodes: ["02108", "02109", "02110", "02111", "02113", "02114", "02115", "02116", "02118", "02119", "02120", "02121", "02122", "02124", "02125", "02126", "02127", "02128", "02129", "02130", "02131", "02132", "02134", "02135", "02136", "02163", "02199", "02203", "02210", "02215"],
    programTypes: ["Mental Health Court", "Pretrial Diversion", "Intensive Social Services"],
    eligibilityNotes: "Mental health + co-occurring substance use issues. Pretrial diversion or post-conviction program. Treatment and intensive social services. Goal: achieve recovery, maintain stability, avoid incarceration.",
    contact: {
      phone: "(857) 287-1806",
      email: "Elizabeth.Plange@BMC.org",
      url: "https://www.bmc.org/programs/criminal-justice-mental-health-programs"
    },
    sources: ["Boston Medical Center", "https://www.mass.gov/info-details/mental-health-courts"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },

  // California Programs (San Diego - additional)
  {
    id: "ca-sd-drug-court",
    name: "San Diego County Drug Court (PC 1000)",
    jurisdictionType: "county",
    state: "CA",
    county: "San Diego",
    cities: ["San Diego", "Chula Vista", "Oceanside", "Escondido", "Carlsbad"],
    zipCodes: ["92101", "92102", "92103", "92104", "92105", "92106", "92107", "92108", "92109", "92110", "92111", "92113", "92114", "92115", "92116", "92117", "92118", "92119", "92120", "92121", "92122", "92123", "92124", "92126", "92127", "92128", "92129", "92130", "92131", "92132", "92134", "92135", "92136", "92139", "92140", "92145", "92147", "92154", "92155"],
    programTypes: ["Drug Court", "Deferred Entry of Judgment", "Substance Abuse Counseling"],
    eligibilityNotes: "First-time, non-violent drug offenders. Plead guilty → judge delays sentencing for 18 months → complete 5-6 months of substance abuse counseling + random drug testing. Charges dismissed if successful.",
    contact: {
      url: "https://www.sdcourt.ca.gov/"
    },
    sources: ["San Diego Superior Court"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },
  {
    id: "ca-sd-behavioral-health-court",
    name: "San Diego Behavioral Health Court",
    jurisdictionType: "county",
    state: "CA",
    county: "San Diego",
    cities: ["San Diego"],
    zipCodes: ["92101", "92102", "92103", "92104", "92105", "92106", "92107", "92108", "92109", "92110", "92111", "92113", "92114", "92115", "92116", "92117", "92118", "92119", "92120", "92121", "92122", "92123", "92124", "92126", "92127", "92128", "92129", "92130", "92131", "92132", "92134", "92135", "92136", "92139", "92140", "92145", "92147", "92154", "92155"],
    programTypes: ["Mental Health Court", "Behavioral Health Treatment", "Intensive Services"],
    eligibilityNotes: "San Diego operates Behavioral Health Court tracks for eligible adults with felony cases and serious mental illness. Referral, clinical assessment and court approval determine admission and the applicable track.",
    contact: {
      url: "https://www.sdcourt.ca.gov/"
    },
    sources: ["San Diego Superior Court", "Telecare", "https://www.sdcourt.ca.gov/sites/default/files/sdcourt/generalinformation/paco2/educationalprograms/courtclergy/SDSC%20Collaborative%20Courts.pdf"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },

  // Tennessee Programs
  {
    id: "tn-davidson-recovery-court",
    name: "Nashville-Davidson County Recovery Court",
    jurisdictionType: "county",
    state: "TN",
    county: "Davidson",
    cities: ["Nashville"],
    zipCodes: ["37201", "37203", "37204", "37205", "37206", "37207", "37208", "37209", "37210", "37211", "37212", "37213", "37214", "37215", "37216", "37217", "37218", "37219", "37220", "37221", "37228", "37243"],
    programTypes: ["Recovery Court", "Drug Court", "Medication-Assisted Treatment"],
    eligibilityNotes: "Non-violent offenders with substance abuse/chemical dependency diagnosis. Willing to participate in treatment. Services include substance use treatment, MAT, behavioral health services, drug testing, housing/transportation assistance, employment support, community service.",
    contact: {
      url: "https://recoverycourt.nashville.gov/"
    },
    sources: ["General Sessions Court of Metropolitan Nashville & Davidson County"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },
  {
    id: "tn-davidson-mental-health-court",
    name: "Nashville-Davidson County Mental Health Court",
    jurisdictionType: "county",
    state: "TN",
    county: "Davidson",
    cities: ["Nashville"],
    zipCodes: ["37201", "37203", "37204", "37205", "37206", "37207", "37208", "37209", "37210", "37211", "37212", "37213", "37214", "37215", "37216", "37217", "37218", "37219", "37220", "37221", "37228", "37243"],
    programTypes: ["Mental Health Court", "Crisis Intervention", "Treatment Linkage"],
    eligibilityNotes: "Individuals with mental illness who can participate via probation program or diversion program for criminal charges. Mental health evaluation & treatment, medication compliance monitoring, psychiatric treatment, links to community providers.",
    contact: {
      url: "https://gscourt.nashville.gov/departments-services/mental-health-court/"
    },
    sources: ["General Sessions Court of Metropolitan Nashville & Davidson County", "https://gscourt.nashville.gov/departments-services/mental-health-court/"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },
  {
    id: "tn-davidson-veterans-court",
    name: "Nashville-Davidson County Veterans Treatment Court",
    jurisdictionType: "county",
    state: "TN",
    county: "Davidson",
    cities: ["Nashville"],
    zipCodes: ["37201", "37203", "37204", "37205", "37206", "37207", "37208", "37209", "37210", "37211", "37212", "37213", "37214", "37215", "37216", "37217", "37218", "37219", "37220", "37221", "37228", "37243"],
    programTypes: ["Veterans Court", "PTSD Treatment", "Substance Abuse for Veterans"],
    eligibilityNotes: "Veterans with addiction, serious mental illness, or co-occurring disorders. Agree to participate as condition of probation or diversion program. Mental health evaluation, alcohol/substance abuse assistance, supervision by veteran-specific client specialists, volunteer veteran mentors.",
    contact: {
      url: "https://gscourt.nashville.gov/departments-services/veterans-treatment-court/"
    },
    sources: ["General Sessions Court of Metropolitan Nashville & Davidson County"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },

  // Oregon Programs
  {
    id: "or-multnomah-path",
    name: "Multnomah County PATH Program (Promoting Access to Hope)",
    jurisdictionType: "county",
    state: "OR",
    county: "Multnomah",
    cities: ["Portland"],
    zipCodes: ["97201", "97202", "97203", "97204", "97205", "97206", "97209", "97210", "97211", "97212", "97213", "97214", "97215", "97216", "97217", "97218", "97219", "97220", "97221", "97222", "97223", "97224", "97225", "97227", "97229", "97230", "97232", "97233", "97239"],
    programTypes: ["Pre-Booking Diversion", "Harm Reduction", "Mental Health Support"],
    eligibilityNotes: "Community outreach and care coordination for people experiencing housing instability, substance use or mental health challenges and criminal legal system involvement. PATH succeeds LEAD and accepts referrals from community members, providers and law enforcement, including self-referrals.",
    contact: {
      phone: "(503) 988-4888",
      url: "https://multco.us/info/law-enforcement-assisted-diversion-leadr"
    },
    sources: ["Multnomah County Behavioral Health Division", "https://multco.us/file/40101-26_adopted.pdf/download"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },
  {
    id: "or-multnomah-stop",
    name: "Multnomah County STOP Drug Diversion Program",
    jurisdictionType: "county",
    state: "OR",
    county: "Multnomah",
    cities: ["Portland"],
    zipCodes: ["97201", "97202", "97203", "97204", "97205", "97206", "97209", "97210", "97211", "97212", "97213", "97214", "97215", "97216", "97217", "97218", "97219", "97220", "97221", "97222", "97223", "97224", "97225", "97227", "97229", "97230", "97232", "97233", "97239"],
    programTypes: ["Drug Diversion", "Substance Abuse Treatment"],
    eligibilityNotes: "First-time drug possession offenses. Post-plea model (participants plead guilty, charges dropped upon completion). 365 days in treatment required. Six consecutive clean drug tests needed. Charges can be removed from criminal record upon successful completion. Established 1991. Note: Oregon's Measure 110 (2020) decriminalized drug possession, effectively ending the STOP model. After Measure 110 was partially rolled back in September 2024, Multnomah County launched a new Deflection Center (October 2024) using a different model. The original STOP program described here is no longer operative.",
    contact: {
      phone: "(503) 988-4888",
      url: "https://www.multco.us/dcj-adult"
    },
    sources: ["Multnomah County Circuit Court", "https://crimesolutions.ojp.gov/ratedprograms/multnomah-county-ore-sanction-treatment-opportunity-progress-stop-drug-diversion"],
    lastUpdated: new Date("2026-03-01"),
    isActive: false,
  },
  {
    id: "or-multnomah-mental-health-court",
    name: "Multnomah County Mental Health Court",
    jurisdictionType: "county",
    state: "OR",
    county: "Multnomah",
    cities: ["Portland"],
    zipCodes: ["97201", "97202", "97203", "97204", "97205", "97206", "97209", "97210", "97211", "97212", "97213", "97214", "97215", "97216", "97217", "97218", "97219", "97220", "97221", "97222", "97223", "97224", "97225", "97227", "97229", "97230", "97232", "97233", "97239"],
    programTypes: ["Mental Health Court", "Treatment Services", "Medication Management"],
    eligibilityNotes: "People with qualifying mental health conditions may be on probation or have pending charges. The court reviews diagnoses and other eligibility criteria. Treatment, case management and medication support are available.",
    contact: {
      url: "https://www.mcda.us/index.php/programs-initiatives/mental-health-court"
    },
    sources: ["Multnomah County District Attorney", "Cascadia Health", "https://www.mcda.us/index.php/programs-initiatives/mental-health-court"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },

  // North Carolina Programs
  {
    id: "nc-mecklenburg-step",
    name: "Mecklenburg County S.T.E.P. Program",
    jurisdictionType: "county",
    state: "NC",
    county: "Mecklenburg",
    cities: ["Charlotte"],
    zipCodes: ["28201", "28202", "28203", "28204", "28205", "28206", "28207", "28208", "28209", "28210", "28211", "28212", "28213", "28214", "28215", "28216", "28217", "28226", "28227", "28244", "28262", "28269", "28270", "28273", "28277", "28278", "28280", "28282"],
    programTypes: ["Drug Treatment Court", "Supervision", "Treatment", "Education"],
    eligibilityNotes: "Chemically dependent adults with court-ordered treatment plans. Minimum 1 year program. Regular court supervision, drug/alcohol screening and testing, assigned case coordinator, assistance with medical, social, employment, and housing services.",
    contact: {
      url: "https://cjs.mecknc.gov/Services/STEP"
    },
    sources: ["Mecklenburg County Criminal Justice Services"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },
  {
    id: "nc-mecklenburg-90-96",
    name: "Mecklenburg County 90-96 Program",
    jurisdictionType: "county",
    state: "NC",
    county: "Mecklenburg",
    cities: ["Charlotte"],
    zipCodes: ["28201", "28202", "28203", "28204", "28205", "28206", "28207", "28208", "28209", "28210", "28211", "28212", "28213", "28214", "28215", "28216", "28217", "28226", "28227", "28244", "28262", "28269", "28270", "28273", "28277", "28278", "28280", "28282"],
    programTypes: ["Conditional Discharge", "Drug Education", "Community Service"],
    eligibilityNotes: "First-time drug possession offenses (small amounts) and drug paraphernalia. No previous drug charge convictions. No prior felony convictions. Requires drug abuse assessment, community service (hours depend on the program), regular random drug testing, regular case manager meetings. Charges dismissed upon completion.",
    contact: {
      url: "https://cjs.mecknc.gov/"
    },
    sources: ["Mecklenburg County Criminal Justice Services", "Anuvia Prevention and Recovery Center", "https://cjs.mecknc.gov/"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },

  // Ohio Programs
  {
    id: "oh-franklin-rise",
    name: "Franklin County RISE Mental Health Court",
    jurisdictionType: "county",
    state: "OH",
    county: "Franklin",
    cities: ["Columbus"],
    zipCodes: ["43004", "43016", "43017", "43026", "43054", "43064", "43065", "43068", "43081", "43085", "43119", "43123", "43125", "43201", "43202", "43203", "43204", "43205", "43206", "43207", "43209", "43210", "43211", "43212", "43213", "43214", "43215", "43217", "43219", "43220", "43221", "43222", "43223", "43224", "43227", "43228", "43229", "43230", "43231", "43232", "43235"],
    programTypes: ["Mental Health Court", "Treatment Services", "Accountability Support"],
    eligibilityNotes: "Felony offenders with serious mental illness. Moderate to high-risk offenders where mental illness was a primary factor in criminal involvement. 2-year specialized docket with 4 phases. History of serious/repetitive violence may exclude participation.",
    contact: {
      url: "https://fccourts.org/503/RISE-Mental-Health-Court"
    },
    sources: ["Franklin County Court of Common Pleas", "https://fccourts.org/503/RISE-Mental-Health-Court"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },
  {
    id: "oh-franklin-prosecutor-diversion",
    name: "Franklin County Prosecutor's Diversion Unit",
    jurisdictionType: "county",
    state: "OH",
    county: "Franklin",
    cities: ["Columbus"],
    zipCodes: ["43004", "43016", "43017", "43026", "43054", "43064", "43065", "43068", "43081", "43085", "43119", "43123", "43125", "43201", "43202", "43203", "43204", "43205", "43206", "43207", "43209", "43210", "43211", "43212", "43213", "43214", "43215", "43217", "43219", "43220", "43221", "43222", "43223", "43224", "43227", "43228", "43229", "43230", "43231", "43232", "43235"],
    programTypes: ["Pretrial Diversion", "Post-Indictment Diversion"],
    eligibilityNotes: "First-time, non-violent offenders. Avoid or be diverted from prosecution after indictment. Strict entry criteria. Completion avoids prosecution.",
    contact: {
      url: "https://prosecutor.franklincountyohio.gov/"
    },
    sources: ["Franklin County Prosecutor's Office"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },

  // California Additional Programs
  {
    id: "ca-sacramento-mental-health",
    name: "Sacramento County Mental Health Diversion",
    jurisdictionType: "county",
    state: "CA",
    county: "Sacramento",
    cities: ["Sacramento", "Elk Grove", "Citrus Heights", "Folsom", "Rancho Cordova"],
    zipCodes: ["95811", "95814", "95815", "95816", "95817", "95818", "95819", "95820", "95821", "95822", "95823", "95824", "95825", "95826", "95827", "95828", "95829", "95830", "95831", "95832", "95833", "95834", "95835", "95836", "95837", "95838", "95841", "95842", "95843", "95864", "95865", "95866", "95867"],
    programTypes: ["Mental Health Diversion", "PC 1001.36", "Community Treatment"],
    eligibilityNotes: "Felony, misdemeanor, or wobbler charges with diagnosed mental health disorders (300+ qualifying conditions). Up to 2 years community-based treatment. Recent controversy over oversight and accountability.",
    contact: {
      url: "https://www.saccourt.ca.gov/criminal/collaborative-courts.aspx"
    },
    sources: ["Sacramento Superior Court"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },
  {
    id: "ca-sacramento-drug-diversion",
    name: "Sacramento County Drug Diversion Program",
    jurisdictionType: "county",
    state: "CA",
    county: "Sacramento",
    cities: ["Sacramento", "Elk Grove", "Citrus Heights", "Folsom", "Rancho Cordova"],
    zipCodes: ["95811", "95814", "95815", "95816", "95817", "95818", "95819", "95820", "95821", "95822", "95823", "95824", "95825", "95826", "95827", "95828", "95829", "95830", "95831", "95832", "95833", "95834", "95835", "95836", "95837", "95838", "95841", "95842", "95843", "95864", "95865", "95866", "95867"],
    programTypes: ["Drug Diversion", "Prop 36", "Recovery Court"],
    eligibilityNotes: "First-time drug offense, simple possession. 18-36 months duration. Recovery Court located at 8745 Folsom Blvd. Multi-disciplinary sites offering detox, residential treatment, outpatient, methadone, sober living.",
    contact: {
      url: "https://www.saccourt.ca.gov/criminal/collaborative-courts.aspx"
    },
    sources: ["Sacramento Superior Court", "Sacramento Probation Department"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },
  {
    id: "ca-sacramento-veterans",
    name: "Sacramento County Veterans Treatment Program",
    jurisdictionType: "county",
    state: "CA",
    county: "Sacramento",
    cities: ["Sacramento", "Elk Grove", "Citrus Heights", "Folsom", "Rancho Cordova"],
    zipCodes: ["95811", "95814", "95815", "95816", "95817", "95818", "95819", "95820", "95821", "95822", "95823", "95824", "95825", "95826", "95827", "95828", "95829", "95830", "95831", "95832", "95833", "95834", "95835", "95836", "95837", "95838", "95841", "95842", "95843", "95864", "95865", "95866", "95867"],
    programTypes: ["Veterans Court", "Military Diversion"],
    eligibilityNotes: "12-18 months for veterans with service-related offenses. Excludes sex, arson, gang crimes. Service-connected conditions including PTSD, TBI.",
    contact: {
      url: "https://www.saccourt.ca.gov/criminal/collaborative-courts.aspx"
    },
    sources: ["Sacramento Superior Court"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },
  {
    id: "ca-alameda-cares",
    name: "Alameda County CARES Navigation Center",
    jurisdictionType: "county",
    state: "CA",
    county: "Alameda",
    cities: ["Oakland", "Berkeley", "Fremont", "Hayward", "San Leandro", "Alameda"],
    zipCodes: ["94501", "94502", "94536", "94537", "94538", "94539", "94541", "94542", "94543", "94544", "94545", "94546", "94555", "94577", "94578", "94579", "94580", "94586", "94587", "94588", "94601", "94602", "94603", "94604", "94605", "94606", "94607", "94608", "94609", "94610", "94611", "94612", "94613", "94618", "94619", "94621", "94701", "94702", "94703", "94704", "94705", "94706", "94707", "94708", "94709", "94710", "94720"],
    programTypes: ["Pre-Arrest Diversion", "Mobile Crisis Response", "Substance Use Treatment"],
    eligibilityNotes: "$6 million Prop 47 grant awarded October 2024 (largest in DA office history). County-wide mobile unit. Police can refer individuals directly to treatment without jail or court. Prioritizes substance use and mental health issues.",
    contact: {
      phone: "(510) 272-6222",
      url: "https://www.alameda.courts.ca.gov/divisions/collaborative-courts"
    },
    sources: ["Alameda County District Attorney", "Alameda County Behavioral Health", "https://www.acgov.org/board/bos_calendar/documents/DocsAgendaReg_11_12_24/PUBLIC%20PROTECTION/Regular%20Calendar/DA_378381.pdf"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },
  {
    id: "ca-alameda-eic",
    name: "Alameda County Early Intervention Court",
    jurisdictionType: "county",
    state: "CA",
    county: "Alameda",
    cities: ["Oakland", "Berkeley", "Fremont", "Hayward", "San Leandro", "Alameda"],
    zipCodes: ["94501", "94502", "94536", "94537", "94538", "94539", "94541", "94542", "94543", "94544", "94545", "94546", "94555", "94577", "94578", "94579", "94580", "94586", "94587", "94588", "94601", "94602", "94603", "94604", "94605", "94606", "94607", "94608", "94609", "94610", "94611", "94612", "94613", "94618", "94619", "94621", "94701", "94702", "94703", "94704", "94705", "94706", "94707", "94708", "94709", "94710", "94720"],
    programTypes: ["Early Intervention Court", "Case Management", "PC 1170(h)"],
    eligibilityNotes: "Low-level felonies (PC Section 1170(h)). Typically 1 year with weekly then monthly progress reports. Case dismissal + PC 851.91 relief. Excludes gun cases, DV, 290 registration.",
    contact: {
      url: "https://www.alameda.courts.ca.gov/divisions/collaborative-courts"
    },
    sources: ["Alameda County Superior Court", "Leaders in Community Alternatives (LCA)", "https://www.alameda.courts.ca.gov/divisions/collaborative-courts"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },
  {
    id: "ca-orange-first-point",
    name: "Orange County FIRST Point Diversion Program",
    jurisdictionType: "county",
    state: "CA",
    county: "Orange",
    cities: ["Santa Ana", "Anaheim", "Irvine", "Huntington Beach", "Garden Grove", "Orange", "Fullerton", "Costa Mesa", "Mission Viejo", "Westminster", "Newport Beach", "Buena Park", "Lake Forest", "Tustin", "Yorba Linda", "San Clemente", "Laguna Niguel", "La Habra", "Fountain Valley", "Placentia", "Rancho Santa Margarita", "Aliso Viejo", "Brea", "Seal Beach"],
    zipCodes: ["92602", "92603", "92604", "92606", "92610", "92612", "92614", "92617", "92618", "92620", "92624", "92626", "92627", "92629", "92630", "92637", "92646", "92647", "92648", "92649", "92651", "92653", "92655", "92656", "92657", "92660", "92661", "92662", "92663", "92672", "92673", "92675", "92676", "92677", "92678", "92679", "92683", "92688", "92691", "92692", "92694", "92697", "92701", "92703", "92704", "92705", "92706", "92707", "92708", "92780", "92782", "92801", "92802", "92803", "92804", "92805", "92806", "92807", "92808", "92831", "92832", "92833", "92835", "92840", "92841", "92843", "92844", "92845", "92861", "92865", "92866", "92867", "92868", "92869", "92870", "92886", "92887"],
    programTypes: ["Pre-Filing Diversion", "Mental Health Support", "Substance Abuse Treatment"],
    eligibilityNotes: "Launched early 2022. Low-level offenders with mental health and substance abuse issues. Partners: OC DA, Sheriff, Seal Beach PD, Irvine PD, Health Care Agency and Social Services Agency. Coverage: Seal Beach, Irvine, South OC. No charges filed; connects offenders to services immediately.",
    contact: {
      url: "https://ocdistrictattorney.gov/press/orange-county-district-attorneys-office-launches-countys-first-pre-filing-diversion-pilot-program-first-point-with-law-enforcement-health-care-partners-program-w/"
    },
    sources: ["Orange County District Attorney", "Orange County Health Care Agency", "https://ocdistrictattorney.gov/press/orange-county-district-attorneys-office-launches-countys-first-pre-filing-diversion-pilot-program-first-point-with-law-enforcement-health-care-partners-program-w/"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },
  {
    id: "ca-riverside-judicial-diversion",
    name: "Riverside County Judicial Diversion (PC 1001.95)",
    jurisdictionType: "county",
    state: "CA",
    county: "Riverside",
    cities: ["Riverside", "Moreno Valley", "Corona", "Murrieta", "Temecula", "Indio", "Palm Desert", "Lake Elsinore", "Hemet", "Perris"],
    zipCodes: ["92201", "92203", "92210", "92211", "92220", "92230", "92234", "92236", "92240", "92253", "92260", "92262", "92264", "92270", "92274", "92276", "92280", "92282", "92292", "92320", "92324", "92501", "92503", "92504", "92505", "92506", "92507", "92508", "92509", "92518", "92530", "92532", "92536", "92539", "92543", "92544", "92545", "92548", "92551", "92553", "92555", "92557", "92563", "92567", "92570", "92571", "92582", "92583", "92584", "92585", "92586", "92587", "92590", "92591", "92592", "92593", "92595", "92596"],
    programTypes: ["Judicial Diversion", "Misdemeanor Diversion", "PC 1001.95"],
    eligibilityNotes: "Judge-initiated pretrial diversion for misdemeanors. Judge can grant over prosecutor's objection. Eligible: petty theft, trespassing, minor drug charges. Excludes DUI, DV, sex offenses, stalking. Charges dismissed upon completion.",
    contact: {
      url: "https://www.courts.ca.gov/courts.htm?court_id=S23"
    },
    sources: ["Riverside Superior Court"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },
  {
    id: "ca-riverside-care-court",
    name: "Riverside County CARE Court",
    jurisdictionType: "county",
    state: "CA",
    county: "Riverside",
    cities: ["Riverside", "Moreno Valley", "Corona", "Murrieta", "Temecula", "Indio", "Palm Desert"],
    zipCodes: ["92201", "92203", "92210", "92211", "92220", "92230", "92234", "92236", "92240", "92253", "92260", "92262", "92264", "92270", "92274", "92276", "92280", "92282", "92292", "92320", "92324", "92501", "92503", "92504", "92505", "92506", "92507", "92508", "92509", "92518", "92530", "92532", "92536", "92539", "92543", "92544", "92545", "92548"],
    programTypes: ["CARE Court", "Civil Behavioral Health", "Mental Health Treatment"],
    eligibilityNotes: "Effective October 2, 2023. Civil court program for behavioral health treatment. Residents with serious mental illness. Referrals: family, friends, doctors, law enforcement. Department 12, Riverside Historic Courthouse. Monday-Friday afternoons.",
    contact: {
      phone: "(800) 499-3008",
      url: "https://www.riverside.courts.ca.gov/system/files/2023-09/Public%20Notice_Notice%20of%20Implementation%20of%20the%20CARE%20Act%20092023.pdf"
    },
    sources: ["Riverside University Health System", "https://www.riverside.courts.ca.gov/system/files/2023-09/Public%20Notice_Notice%20of%20Implementation%20of%20the%20CARE%20Act%20092023.pdf"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },
  {
    id: "ca-fresno-mental-health",
    name: "Fresno County Mental Health Diversion (AB 1810)",
    jurisdictionType: "county",
    state: "CA",
    county: "Fresno",
    cities: ["Fresno", "Clovis", "Madera", "Sanger", "Reedley"],
    zipCodes: ["93650", "93701", "93702", "93703", "93704", "93705", "93706", "93710", "93711", "93720", "93721", "93722", "93723", "93724", "93725", "93726", "93727", "93728", "93730"],
    programTypes: ["Mental Health Diversion Court", "ACT Model", "FSP Model"],
    eligibilityNotes: "Mental health diversion under Penal Code § 1001.36 is a pretrial treatment pathway. The maximum diversion period is one year for a misdemeanor and two years for a felony. The court determines whether the statutory criteria are met.",
    contact: {
      url: "https://www.fresno.courts.ca.gov/divisions/collaborative-courts-division/mental-health-ab1810-court"
    },
    sources: ["Fresno County Department of Behavioral Health", "Turning Point of Central California", "https://www.fresno.courts.ca.gov/divisions/collaborative-courts-division/mental-health-ab1810-court", "https://www.fresno.courts.ca.gov/system/files/general/mhd-policy-_-procedures-manual-revised-424.pdf"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },
  {
    id: "ca-kern-att-diversion",
    name: "Kern County ATT Mental Health Diversion Program",
    jurisdictionType: "county",
    state: "CA",
    county: "Kern",
    cities: ["Bakersfield", "Delano", "Ridgecrest", "Wasco", "Arvin", "Tehachapi"],
    zipCodes: ["93203", "93215", "93250", "93263", "93280", "93301", "93304", "93305", "93306", "93307", "93308", "93309", "93311", "93312", "93313", "93314"],
    programTypes: ["Mental Health Diversion", "Severe Mental Illness", "Court-Referred"],
    eligibilityNotes: "Individuals with severe mental illness referred by court after serious crimes. 1-2 years. Recovery Specialists, therapists, multiple weekly sessions. FY 2024 results: 33% reduction incarceration days, 30% reduction psychiatric inpatient days, 9% reduction homeless days.",
    contact: {
      url: "https://www.kern.courts.ca.gov/"
    },
    sources: ["Kern County Superior Court", "Kern Behavioral Health and Recovery Services", "https://www.bscc.ca.gov/wp-content/uploads/2025/08/Kern-Updated-CCP-Annual-Plan-24-25.pdf"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },

  // New York Additional Programs
  {
    id: "ny-manhattan-green-light",
    name: "Manhattan Project Green Light",
    jurisdictionType: "city",
    state: "NY",
    county: "New York",
    cities: ["Manhattan", "New York"],
    zipCodes: ["10001", "10002", "10003", "10004", "10005", "10006", "10007", "10009", "10010", "10011", "10012", "10013", "10014", "10016", "10017", "10018", "10019", "10020", "10021", "10022", "10023", "10024", "10025", "10026", "10027", "10028", "10029", "10030", "10031", "10032", "10033", "10034", "10035", "10036", "10037", "10038", "10039", "10040", "10044", "10065", "10069", "10075", "10103", "10110", "10111", "10112", "10115", "10119", "10128", "10162", "10165", "10167", "10168", "10169", "10170", "10171", "10172", "10173", "10174", "10177", "10199", "10271", "10278", "10279", "10280", "10282"],
    programTypes: ["Driver's License Diversion", "Pre-Arraignment", "Post-Arraignment"],
    eligibilityNotes: "VTL § 511(1)(a) (driving with suspended license). Suspensions not from DWI/drug convictions. Clear suspensions within 2 weeks → DA declines prosecution. Post-arraignment: clear suspensions by next court date → case dismissed.",
    contact: {
      phone: "(646) 213-2633",
      email: "greenlight@nycja.org",
      url: "https://manhattanda.org/projectgreenlight-2/"
    },
    sources: ["Manhattan District Attorney's Office", "https://manhattanda.org/projectgreenlight-2/"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },
  {
    id: "ny-albany-lead",
    name: "Albany County LEAD Program",
    jurisdictionType: "county",
    state: "NY",
    county: "Albany",
    cities: ["Albany", "Cohoes", "Watervliet"],
    zipCodes: ["12201", "12202", "12203", "12204", "12205", "12206", "12207", "12208", "12209", "12210", "12211", "12220"],
    programTypes: ["Pre-Arrest Diversion", "LEAD", "Harm Reduction", "Case Management"],
    eligibilityNotes: "Non-violent offenders with addiction, mental illness, or poverty issues. Police diversion at point of contact instead of arrest. Operational since April 2016 (3rd LEAD program in U.S.). Both diversion and referral pathways. Quarterly public reporting.",
    contact: {
      phone: "(518) 694-5116",
      email: "info@albanylead.org",
      url: "https://albanylead.org/"
    },
    sources: ["Albany PD", "Albany County DA", "Albany County Public Defender", "https://albanylead.org/"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },
  {
    id: "ny-albany-community-accountability",
    name: "Albany County Community Accountability Board",
    jurisdictionType: "county",
    state: "NY",
    county: "Albany",
    cities: ["Albany", "Cohoes", "Watervliet"],
    zipCodes: ["12201", "12202", "12203", "12204", "12205", "12206", "12207", "12208", "12209", "12210", "12211", "12220"],
    programTypes: ["Restorative Justice", "Young Adult Diversion", "Felony Diversion"],
    eligibilityNotes: "Historical Albany County program involving restorative justice and community accountability. Current intake, age limits, case outcomes and program identity require confirmation with Albany County Probation.",
    contact: {
      phone: "(518) 487-5200",
      url: "https://www.albanycountyny.gov/departments/probation"
    },
    sources: ["Albany County Probation Department", "https://www.albanycountyny.gov/departments/probation"],
    lastUpdated: new Date("2024-11-01"),
    isActive: false,
  },
  {
    id: "ny-westchester-fresh-start",
    name: "Westchester County Fresh Start Program",
    jurisdictionType: "county",
    state: "NY",
    county: "Westchester",
    cities: ["Yonkers", "New Rochelle", "Mount Vernon", "White Plains", "Port Chester", "Harrison", "Rye"],
    zipCodes: ["10501", "10502", "10503", "10504", "10505", "10506", "10507", "10510", "10511", "10522", "10523", "10528", "10530", "10532", "10533", "10543", "10550", "10552", "10553", "10557", "10562", "10566", "10573", "10577", "10580", "10583", "10588", "10589", "10590", "10591", "10594", "10595", "10601", "10603", "10604", "10605", "10606", "10607", "10701", "10702", "10703", "10704", "10705", "10706", "10707", "10708", "10709", "10710"],
    programTypes: ["Pre-Arraignment Diversion", "First-Time Offenders", "Social Services"],
    eligibilityNotes: "First-time, non-violent, low-level offenders. Social services, counseling, and rehabilitation as alternative to conviction, fines, and incarceration. Partnership between DA's Office and Westchester County Department of Community Mental Health.",
    contact: {
      phone: "(914) 995-3415",
      url: "https://www.westchesterda.net/diversion-and-youth-programs"
    },
    sources: ["Westchester County District Attorney"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },
  {
    id: "ny-westchester-opt-in",
    name: "Westchester County OPT-In Program",
    jurisdictionType: "county",
    state: "NY",
    county: "Westchester",
    cities: ["Yonkers", "New Rochelle", "Mount Vernon", "White Plains", "Port Chester"],
    zipCodes: ["10501", "10502", "10503", "10504", "10505", "10506", "10507", "10510", "10511", "10522", "10523", "10528", "10530", "10532", "10533", "10543", "10550", "10552", "10553", "10557", "10562", "10566", "10573", "10577", "10580", "10583", "10588", "10589", "10590", "10591", "10594", "10595", "10601", "10603", "10604", "10605", "10606", "10607", "10701", "10702", "10703", "10704", "10705", "10706", "10707", "10708", "10709", "10710"],
    programTypes: ["Substance Use Diversion", "Pre-Arraignment", "Overdose Prevention"],
    eligibilityNotes: "Substance-related offenses. Connects individuals with peer mentors before first court appearance. Provides naloxone kits through Urban League of Westchester. Individualized treatment plans. Successful participation considered in case resolutions.",
    contact: {
      phone: "(914) 995-3415",
      url: "https://www.westchesterda.net/diversion-and-youth-programs"
    },
    sources: ["Westchester County District Attorney", "Urban League of Westchester"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },
  {
    id: "ny-westchester-project-reset",
    name: "Westchester County Project Reset",
    jurisdictionType: "county",
    state: "NY",
    county: "Westchester",
    cities: ["Yonkers", "New Rochelle", "Mount Vernon", "White Plains"],
    zipCodes: ["10501", "10502", "10503", "10504", "10505", "10506", "10507", "10510", "10511", "10522", "10523", "10528", "10530", "10532", "10533", "10543", "10550", "10552", "10553", "10557", "10562", "10566", "10573", "10577", "10580", "10583", "10588", "10589", "10590", "10591", "10594", "10595", "10601", "10603", "10604", "10605", "10606", "10607", "10701", "10702", "10703", "10704", "10705", "10706", "10707", "10708", "10709", "10710"],
    programTypes: ["Prosecutor-Led Diversion", "Community-Based Intervention", "Low-Level Offenses"],
    eligibilityNotes: "Low-level offenses. Brief community-based interventions instead of traditional case processing. 71% of eligible participants had cases dismissed or declined for prosecution (2024 evaluation). Workshops focus on healing, self-reflection, community-based services.",
    contact: {
      phone: "(914) 995-3415",
      url: "https://www.westchesterda.net/diversion-and-youth-programs"
    },
    sources: ["Westchester County District Attorney"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },

  {
    id: "ny-suffolk-judicial-diversion",
    name: "Suffolk County Judicial Diversion Program",
    jurisdictionType: "county",
    state: "NY",
    county: "Suffolk",
    cities: ["Huntington", "Brookhaven", "Islip", "Smithtown", "Babylon", "Southampton"],
    zipCodes: ["11701", "11702", "11703", "11704", "11705", "11706", "11713", "11714", "11715", "11716", "11717", "11718", "11719", "11720", "11721", "11722", "11724", "11725", "11726", "11727", "11729", "11730", "11731", "11732", "11733", "11735", "11738", "11739", "11740", "11741", "11742", "11743", "11746", "11747", "11749", "11751", "11752", "11753", "11754", "11755", "11756", "11757", "11758", "11760", "11762", "11763", "11764", "11766", "11767", "11768", "11769", "11770", "11772", "11776", "11777", "11778", "11779", "11780", "11782", "11784", "11786", "11787", "11788", "11789", "11790", "11792", "11794", "11795", "11796", "11798"],
    programTypes: ["Felony Diversion", "CPL Article 216", "Substance Abuse Treatment"],
    eligibilityNotes: "Non-violent felony charges + substance abuse issues. Court-supervised drug/alcohol treatment alternative to jail/probation. Focus on rehabilitation over punishment.",
    contact: {
      url: "https://www.nycourts.gov/courts/10jd/suffolk/treatment/"
    },
    sources: ["Suffolk County Court"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },

  // Georgia Additional Programs
  {
    id: "ga-cobb-pretrial-diversion",
    name: "Cobb County Pretrial Diversion Program",
    jurisdictionType: "county",
    state: "GA",
    county: "Cobb",
    cities: ["Marietta", "Smyrna", "Kennesaw", "Acworth", "Austell"],
    zipCodes: ["30060", "30062", "30064", "30066", "30067", "30068", "30080", "30082", "30101", "30106", "30126", "30127", "30144", "30152", "30168", "30339"],
    programTypes: ["Pretrial Diversion", "First Offender Program", "Community Service"],
    eligibilityNotes: "First-time, non-violent offenders focusing on theft, disorderly conduct. Counseling, therapy, education, drug screening, community service, mentoring. Admin fees + restitution. Duration varies.",
    contact: {
      url: "https://www.cobbcounty.gov/courts/district-attorney/pretrial-diversion"
    },
    sources: ["Cobb County District Attorney"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },
  {
    id: "ga-gwinnett-ptid",
    name: "Gwinnett County Pre-Trial Intervention & Diversion (PTID)",
    jurisdictionType: "county",
    state: "GA",
    county: "Gwinnett",
    cities: ["Lawrenceville", "Duluth", "Norcross", "Suwanee", "Buford", "Snellville"],
    zipCodes: ["30019", "30024", "30043", "30044", "30045", "30046", "30047", "30048", "30049", "30052", "30071", "30078", "30091", "30092", "30093", "30094", "30095", "30096", "30097", "30099"],
    programTypes: ["Felony Diversion", "PTID", "O.C.G.A. §15-18-80"],
    eligibilityNotes: "Non-violent offenses, Schedule I-IV drugs <2g. Managed by Professional Probation Services (PPS). Sliding fee scale by need. Excludes prior felony First Offender completion.",
    contact: {
      url: "https://www.gwinnettcounty.com/government/departments/district-attorney/pre-trial-intervention-diversion"
    },
    sources: ["Gwinnett County District Attorney", "Professional Probation Services", "https://www.gwinnettcounty.com/government/departments/district-attorney/pre-trial-intervention-diversion"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },
  {
    id: "ga-gwinnett-youth-diversion",
    name: "Gwinnett County Youth Diversion Program",
    jurisdictionType: "county",
    state: "GA",
    county: "Gwinnett",
    cities: ["Lawrenceville", "Duluth", "Norcross", "Suwanee", "Buford", "Snellville"],
    zipCodes: ["30019", "30024", "30043", "30044", "30045", "30046", "30047", "30048", "30049", "30052", "30071", "30078", "30091", "30092", "30093", "30094", "30095", "30096", "30097", "30099"],
    programTypes: ["Youth Diversion", "Juvenile Restorative Justice", "Volunteer Panel"],
    eligibilityNotes: "Since 1996. First-time juvenile offenders. Community volunteer panel meets with juvenile & parents/guardians. Panel determines consequences via signed agreement. Voluntary. Case dismissed if successfully completed. No delinquency record.",
    contact: {
      email: "stephanie.morrison@gwinnettcounty.com",
      url: "https://www.gwinnettcourts.com/juvenile/youth-diversion-program"
    },
    sources: ["Gwinnett County Juvenile Court", "https://www.gwinnettcourts.com/juvenile/youth-diversion-program"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },
  {
    id: "ga-gwinnett-new-directions",
    name: "Gwinnett County New Directions Program",
    jurisdictionType: "county",
    state: "GA",
    county: "Gwinnett",
    cities: ["Lawrenceville", "Duluth", "Norcross", "Suwanee", "Buford", "Snellville"],
    zipCodes: ["30019", "30024", "30043", "30044", "30045", "30046", "30047", "30048", "30049", "30052", "30071", "30078", "30091", "30092", "30093", "30094", "30095", "30096", "30097", "30099"],
    programTypes: ["Juvenile Diversion", "Educational Program", "I Have Willpower Curriculum"],
    eligibilityNotes: "12-week program for first-time juvenile offenders. Partner: Be More Positive Enterprises, Inc. 4-phase 'I Have Willpower' curriculum addressing accountability, self-awareness, decision-making.",
    contact: {
      url: "https://www.gwinnettcounty.com/government/departments/district-attorney/programs/new-directions"
    },
    sources: ["Gwinnett County District Attorney", "https://www.gwinnettcounty.com/government/departments/district-attorney/programs/new-directions"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },
  {
    id: "ga-gwinnett-mental-health",
    name: "Gwinnett County Mental Health Diversion",
    jurisdictionType: "county",
    state: "GA",
    county: "Gwinnett",
    cities: ["Lawrenceville", "Duluth", "Norcross", "Suwanee", "Buford", "Snellville"],
    zipCodes: ["30019", "30024", "30043", "30044", "30045", "30046", "30047", "30048", "30049", "30052", "30071", "30078", "30091", "30092", "30093", "30094", "30095", "30096", "30097", "30099"],
    programTypes: ["Mental Health Diversion", "SPMI Treatment", "Misdemeanor"],
    eligibilityNotes: "Verified SPMI diagnosis (Schizophrenia, Schizoaffective, Bipolar, Major Depression, PTSD, GAD). Non-violent misdemeanor directly related to diagnosis. Biopsychosocial assessment. Treatment may include psychiatry, medication compliance, therapy, case management, vocational training.",
    contact: {
      phone: "(678) 347-6287",
      email: "Jamie.Story@VPHealth.org",
      url: "https://www.gwinnettcounty.com/departments/solicitor/mentalhealthdiversion"
    },
    sources: ["Gwinnett County Solicitor-General", "View Point Health"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },
  {
    id: "ga-dekalb-solicitor-diversion",
    name: "DeKalb County Solicitor Pre-Trial Diversion",
    jurisdictionType: "county",
    state: "GA",
    county: "DeKalb",
    cities: ["Decatur", "Tucker", "Stone Mountain", "Lithonia", "Clarkston"],
    zipCodes: ["30002", "30021", "30030", "30032", "30033", "30034", "30035", "30038", "30058", "30079", "30083", "30084", "30085", "30086", "30087", "30088"],
    programTypes: ["Misdemeanor Diversion", "Pretrial Intervention", "Solicitor-General"],
    eligibilityNotes: "First-time, low-level misdemeanor offenders (shoplifting, disorderly conduct, affray). Duration varies by charge and track. Community service, counseling/classes, employment/school enrollment, monthly probation fees. Successful completion → charges dismissed, eligible for record restriction.",
    contact: {
      url: "https://dekalbsolicitorgeneral.com/diversion/misdemeanor-diversion/"
    },
    sources: ["DeKalb County Solicitor-General", "https://dekalbsolicitorgeneral.com/diversion/misdemeanor-diversion/"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },
  {
    id: "ga-dekalb-da-diversion",
    name: "DeKalb County District Attorney Pre-Trial Diversion",
    jurisdictionType: "county",
    state: "GA",
    county: "DeKalb",
    cities: ["Decatur", "Tucker", "Stone Mountain", "Lithonia", "Clarkston"],
    zipCodes: ["30002", "30021", "30030", "30032", "30033", "30034", "30035", "30038", "30058", "30079", "30083", "30084", "30085", "30086", "30087", "30088"],
    programTypes: ["Felony Diversion", "Superior Court", "First Offender"],
    eligibilityNotes: "First-time non-violent felony offenders. Minimum 6 months. Attorney mandatory at orientation. Employment/school enrollment, community service, fees paid over 6 months. No prior criminal convictions. Charges dismissed upon completion; arrest record can be restricted.",
    contact: {
      url: "https://www.dekalbda.org/about_us/pre-trial_diversion.php"
    },
    sources: ["DeKalb County District Attorney", "https://www.dekalbda.org/about_us/pre-trial_diversion.php"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },
  {
    id: "ga-dekalb-accountability-courts",
    name: "DeKalb County Accountability Courts",
    jurisdictionType: "county",
    state: "GA",
    county: "DeKalb",
    cities: ["Decatur", "Tucker", "Stone Mountain", "Lithonia", "Clarkston"],
    zipCodes: ["30002", "30021", "30030", "30032", "30033", "30034", "30035", "30038", "30058", "30079", "30083", "30084", "30085", "30086", "30087", "30088"],
    programTypes: ["Drug Court", "Mental Health Court", "Veterans Court"],
    eligibilityNotes: "Felony-level alternative sentencing programs include Drug Court (two tracks, approximately 24 months), Mental Health Court (minimum 14 months), and Veterans Treatment Court (approximately two years). Track requirements vary.",
    contact: {
      url: "https://dekalbgasuperiorcourt.gov/department/accountability-courts/"
    },
    sources: ["DeKalb County District Attorney", "DeKalb County Superior Court", "https://dekalbgasuperiorcourt.gov/department/accountability-courts/"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },
  {
    id: "ga-clayton-ptid",
    name: "Clayton County Pre-Trial Intervention & Diversion",
    jurisdictionType: "county",
    state: "GA",
    county: "Clayton",
    cities: ["Jonesboro", "Riverdale", "Morrow", "Forest Park", "College Park"],
    zipCodes: ["30236", "30238", "30260", "30274", "30288", "30294", "30296", "30297"],
    programTypes: ["Pretrial Diversion", "PIDP", "First Offender"],
    eligibilityNotes: "First-time offenders, no prior diversion participation, ability to pay restitution. Self-development programs, ADA + DA approval required. 90 days duration. $600 + $25 drug screening + restitution.",
    contact: {
      url: "https://www.claytoncountyda.info/pretrialinterventiondiversionprogram"
    },
    sources: ["Clayton County District Attorney", "https://www.claytoncountyda.info/pretrialinterventiondiversionprogram"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },
  {
    id: "ga-henry-pretrial-diversion",
    name: "Henry County Pretrial Diversion Program",
    jurisdictionType: "county",
    state: "GA",
    county: "Henry",
    cities: ["McDonough", "Stockbridge", "Hampton", "Locust Grove"],
    zipCodes: ["30228", "30233", "30236", "30252", "30253", "30258", "30281"],
    programTypes: ["Pretrial Diversion", "First-Time Offender", "Individualized Supervision"],
    eligibilityNotes: "First-time, non-violent offenders. Individualized supervision, corrective programs. Specified period. Fees + restitution.",
    contact: {
      phone: "(770) 288-7366",
      email: "lflint@co.henry.ga.us",
      url: "https://henrycountyda.org/pretrial-diversion-program/"
    },
    sources: ["Henry County District Attorney", "https://henrycountyda.org/pretrial-diversion-program/"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },
  {
    id: "ga-douglas-pretrial-diversion",
    name: "Douglas County Pre-Trial Diversion Program",
    jurisdictionType: "county",
    state: "GA",
    county: "Douglas",
    cities: ["Douglasville", "Villa Rica", "Austell"],
    zipCodes: ["30134", "30135", "30187"],
    programTypes: ["Young Adult Diversion", "General Diversion", "BJA Grant"],
    eligibilityNotes: "Two tracks: Young Adult (17-24) / General (25+). Non-violent offenders, minimal criminal history. Accountability courses, life skills training, victim/community restoration. 9-12 months avg. BJA Grant funded.",
    contact: {
      url: "https://www.douglascountyga.gov/970/Pre-Trial-Diversion-Program"
    },
    sources: ["Douglas County District Attorney", "Bureau of Justice Assistance", "https://www.douglascountyga.gov/970/Pre-Trial-Diversion-Program"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },
  {
    id: "ga-sandy-springs-treatment",
    name: "Sandy Springs Treatment Diversion Program",
    jurisdictionType: "city",
    state: "GA",
    county: "Fulton",
    cities: ["Sandy Springs"],
    zipCodes: ["30328", "30342", "30350"],
    programTypes: ["Treatment Diversion", "Municipal Court", "Drug/Alcohol/Mental Health"],
    eligibilityNotes: "Launched 2021. 12-month program for non-violent misdemeanors (non-DUI). Tailored for drug/alcohol addiction or mental health issues. Accountability team: prosecutor, defense attorney, judge, community leaders. Fee: $700 entry + $60/month (reducible via community service). PTSD support for veterans.",
    contact: {
      url: "https://www.sandyspringsga.gov/"
    },
    sources: ["Sandy Springs Solicitor's Office", "https://www.sandyspringsga.gov/"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },

  // Illinois Additional Programs
  {
    id: "il-dupage-pretrial-diversion",
    name: "DuPage County Pretrial Diversion Program",
    jurisdictionType: "county",
    state: "IL",
    county: "DuPage",
    cities: ["Wheaton", "Naperville", "Downers Grove", "Elmhurst", "Lombard", "Carol Stream", "Glen Ellyn"],
    zipCodes: ["60101", "60103", "60106", "60108", "60126", "60128", "60137", "60139", "60148", "60157", "60181", "60187", "60188", "60189", "60515", "60516", "60517", "60540", "60555", "60559", "60561", "60563", "60565", "60566"],
    programTypes: ["Felony Diversion", "Theft/Shoplifting Focus"],
    eligibilityNotes: "First-time non-violent felonies. Qualifying: theft, shoplifting (retail theft >$300, theft >$500). NOT eligible: drug cases, DUIs, low-level marijuana, mandatory prison felonies. Unique: requires guilty plea upfront. 1-year probation with tailored conditions. $50 application + $750 if accepted.",
    contact: {
      url: "https://www.dupageco.org/statesattorney/"
    },
    sources: ["DuPage County State's Attorney", "https://www.dupagecounty.gov/States%20Attorney/Documents/Publications/Pre-trial%20Diversion.final.pdf"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },
  {
    id: "il-kane-deferred-prosecution",
    name: "Kane County Deferred Prosecution Programs",
    jurisdictionType: "county",
    state: "IL",
    county: "Kane",
    cities: ["Aurora", "Elgin", "St. Charles", "Carpentersville", "Geneva", "Batavia"],
    zipCodes: ["60119", "60120", "60123", "60124", "60134", "60136", "60140", "60142", "60151", "60174", "60175", "60177", "60505", "60506", "60507", "60510", "60511", "60519", "60538", "60539"],
    programTypes: ["Deferred Prosecution", "Drug/Alcohol Program", "Domestic Violence", "Solicitation"],
    eligibilityNotes: "Started 1995 (originally 'Second Chance'). Five program categories: Felony/Misdemeanor, Misdemeanor Drug/Alcohol, Domestic Violence/Battery (first in IL), Felony Drug, Solicitation of Prostitution. 92% do not re-offend after completion (2015 Aurora University study).",
    contact: {
      phone: "(630) 232-3500",
      url: "https://sao.kanecountyil.gov/Pages/SecondChance.aspx"
    },
    sources: ["Kane County State's Attorney", "https://countyofkane.legistar.com/LegislationDetail.aspx?FullText=1&GUID=E7CB5F1E-3EEE-4A7C-BB9E-72CF43CA6205&ID=8012313&Options=&Search="],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },
  {
    id: "il-kane-lead",
    name: "Kane County LEAD Pre-Arrest Diversion",
    jurisdictionType: "county",
    state: "IL",
    county: "Kane",
    cities: ["Elgin", "Aurora"],
    zipCodes: ["60119", "60120", "60123", "60124", "60505", "60506", "60507"],
    programTypes: ["Pre-Arrest Diversion", "LEAD Model", "Law Enforcement Assisted"],
    eligibilityNotes: "Launched July 2021. A federal DOJ grant supported expansion. Operating: Elgin PD, Kane County Sheriff. Expansion to Aurora PD in 2024. Officers refer to social services instead of arrest for low-level crimes. Services: job training, housing, addiction/mental health treatment, ID assistance. Reduces racial disparities.",
    contact: {
      url: "https://sao.kanecountyil.gov/LEAD"
    },
    sources: ["Kane County State's Attorney", "U.S. Department of Justice", "https://www.kanecountyil.gov/Lists/Events/Attachments/5929/AG%20PKT%20-%2021-11-03%20Executive.pdf"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },
  {
    id: "il-winnebago-divert",
    name: "Winnebago County DIVERT Program",
    jurisdictionType: "county",
    state: "IL",
    county: "Winnebago",
    cities: ["Rockford", "Machesney Park", "Loves Park", "Roscoe"],
    zipCodes: ["61008", "61011", "61012", "61073", "61101", "61102", "61103", "61104", "61107", "61108", "61109", "61111", "61112", "61114", "61115"],
    programTypes: ["Pretrial Diversion", "State-Funded", "Free Program"],
    eligibilityNotes: "Launched March 2022 with state grant. First-time, non-violent offenders. FREE (state-funded) - replaced previous $500 fee program. 155 successful completions by January 2024. Prosecutor-led.",
    contact: {
      url: "https://loyolaccj.org/blog/evaluating-a-prosecutor-led-pretrial-diversion-program-in-winnebago-county-interim-report"
    },
    sources: ["Winnebago County State's Attorney", "Loyola University Chicago Center for Criminal Justice"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },

  // Federal Programs (available nationwide)
  {
    id: "federal-pretrial",
    name: "Federal Pretrial Diversion Program",
    jurisdictionType: "state",
    state: "Federal",
    county: null,
    cities: null,
    zipCodes: null,
    programTypes: ["Pretrial Diversion", "Community Service", "Supervision"],
    eligibilityNotes: "First-time federal offenders, non-violent crimes, good candidates for rehabilitation.",
    contact: {
      phone: "(202) 514-2000",
      url: "https://www.justice.gov/jm/jm-9-22000-pretrial-diversion-program"
    },
    sources: ["U.S. Department of Justice"],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // New programs added March 2026
  {
    id: "ca-la-jcod-rdp",
    name: "Los Angeles County Rapid Diversion Program (RDP)",
    jurisdictionType: "county",
    state: "CA",
    county: "Los Angeles",
    cities: ["Los Angeles", "Pasadena", "Compton", "Long Beach", "Pomona", "Van Nuys", "San Fernando", "Torrance"],
    zipCodes: [],
    programTypes: ["Pretrial Diversion", "Mental Health Diversion", "Substance Use Diversion"],
    eligibilityNotes: "A mental health or substance use condition must have been a significant factor in the offense. Pre-plea; both misdemeanor and felony charges eligible. No fixed charge-type exclusions. Up to 2-year community-based treatment plan; case dismissed upon graduation. Currently operating at 8 courthouses countywide including San Fernando (added December 2025).",
    contact: {
      phone: "(833) 522-5263",
      url: "https://jcod.lacounty.gov/program/rapid-diversion-program-rdp/"
    },
    sources: ["LA County Justice, Care and Opportunities Department (JCOD)", "RAND Corporation evaluation (2025)", "https://jcod.lacounty.gov/program/rapid-diversion-program-rdp/"],
    lastUpdated: new Date("2026-01-26"),
    isActive: true,
  },
  {
    id: "tx-tarrant-mental-health-court",
    name: "Tarrant County Mental Health Diversion Court",
    jurisdictionType: "county",
    state: "TX",
    county: "Tarrant",
    cities: ["Fort Worth", "Arlington", "Euless", "Bedford", "Haltom City", "North Richland Hills", "Mansfield"],
    zipCodes: [],
    programTypes: ["Mental Health Court", "Pretrial Diversion", "Post-Booking Diversion"],
    eligibilityNotes: "Must have qualifying mental health diagnosis (major depression, bipolar disorder, schizophrenia, schizoaffective disorder, anxiety disorders). Four phases, each generally lasting three to four months. Charges dismissed upon successful completion. Jail Diversion Center co-located for walk-in crisis support.",
    contact: {
      phone: "(817) 884-1774",
      url: "https://www.tarrantcountytx.gov/en/criminal-courts/specialty-programs/mhdp.html"
    },
    sources: ["Tarrant County Criminal Courts", "Texas Indigent Defense Commission", "https://www.tarrantcountytx.gov/content/dam/main/criminal-courts/Documents/mental-health-diversion-court/MHDP_Participant_Handbook_Final_2025.pdf"],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },
  {
    id: "wa-king-drug-diversion-court",
    name: "King County Adult Drug Diversion Court",
    jurisdictionType: "county",
    state: "WA",
    county: "King",
    cities: ["Seattle", "Burien", "Renton", "Bellevue", "Kirkland", "Redmond"],
    zipCodes: [],
    programTypes: ["Drug Court", "Felony Property Diversion", "Substance Abuse Treatment"],
    eligibilityNotes: "Adults charged with felony property crimes and drug-related crimes in King County. Voluntary participation. Minimum 10 months to complete (average 16 months). Must work with assigned treatment provider. Cannot have prior serious violent felony conviction.",
    contact: {
      phone: "(206) 477-0788",
      email: "PAODrugCourt@kingcounty.gov",
      url: "https://kingcounty.gov/en/dept/dja/courts-jails-legal-system/courts-drugcourt/drug-court"
    },
    sources: ["King County Department of Judicial Administration", "King County Prosecuting Attorney's Office", "https://kingcounty.gov/en/dept/dja/courts-jails-legal-system/courts-drugcourt/drug-court"],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },
  {
    id: "mn-hennepin-adult-diversion",
    name: "Hennepin County Adult Diversion Program",
    jurisdictionType: "county",
    state: "MN",
    county: "Hennepin",
    cities: ["Minneapolis", "Bloomington", "Plymouth", "Brooklyn Park", "Minnetonka", "Eden Prairie", "Edina"],
    zipCodes: [],
    programTypes: ["Pretrial Diversion", "Drug Diversion", "Property Crime Diversion", "Restorative Justice"],
    eligibilityNotes: "First-time, low-level nonviolent offenders. Qualifying offenses include property crimes and minor drug offenses. Requires community service, restitution, and/or treatment referral. The county announced plans to expand adult diversion in 2025. Check current criteria with the county attorney.",
    contact: {
      url: "https://www.hennepinattorney.org/en/about/adult-diversion/adult-diversion"
    },
    sources: ["Hennepin County Attorney's Office", "University of Minnesota Medical School recidivism study (2025)", "https://hennepinmn.legistar.com/LegislationDetail.aspx?GUID=7E89389F-7C45-48B2-AE81-2EF98CE981C3&ID=7747707&Options=&Search="],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },
  {
    id: "in-marion-behavioral-health-court",
    name: "Marion County Behavioral Health Court",
    jurisdictionType: "county",
    state: "IN",
    county: "Marion",
    cities: ["Indianapolis", "Lawrence", "Beech Grove", "Speedway", "Southport"],
    zipCodes: [],
    programTypes: ["Mental Health Court", "Behavioral Health Diversion", "Crisis Intervention"],
    eligibilityNotes: "Adults with qualifying mental health diagnoses where illness was a significant factor in the offense. Voluntary post-conviction treatment program with five phases. 1 to 3-year program including education/GED support, job coaching, psychiatric treatment, and medication compliance monitoring.",
    contact: {
      phone: "(317) 327-7853",
      url: "https://www.indycourts.org/mhac"
    },
    sources: ["Marion Superior Court", "Indianapolis Office of Public Health and Safety", "https://www.indycourts.org/mhac"],
    lastUpdated: new Date("2026-03-01"),
    isActive: true,
  },

  // ── EXPANSION: 33 Additional Jurisdictions (added April 2026) ──────────────

  // Alaska
  {
    id: "ak-state-therapeutic-courts",
    name: "Alaska Therapeutic Courts Program",
    jurisdictionType: "state",
    state: "AK",
    county: null,
    cities: ["Anchorage", "Fairbanks", "Juneau", "Sitka", "Ketchikan"],
    zipCodes: null,
    programTypes: ["Drug Court", "Mental Health Court", "Veterans Court", "DUI / Wellness Court"],
    eligibilityNotes: "Non-violent offenders with a documented substance use disorder or mental health diagnosis. Eligibility requires a nexus between the condition and the criminal conduct. Wellness courts focus on alcohol-related offenses (DUI, refusal). Mental health courts serve defendants with a qualifying diagnosis. Veterans courts serve veterans and active-duty personnel with service-connected conditions. Risk/needs assessment required.",
    contact: {
      phone: "(907) 264-0401",
      url: "https://courts.alaska.gov/therapeutic/index.htm",
    },
    sources: ["Alaska Court System – Therapeutic Courts", "NADCP"],
    lastUpdated: new Date("2026-04-10"),
    isActive: true,
  },

  // Alabama
  {
    id: "al-state-drug-courts",
    name: "Alabama Drug Court & Problem-Solving Courts",
    jurisdictionType: "state",
    state: "AL",
    county: null,
    cities: ["Birmingham", "Montgomery", "Huntsville", "Mobile", "Tuscaloosa"],
    zipCodes: null,
    programTypes: ["Drug Court", "Mental Health Court", "Veterans Court", "DUI Court"],
    eligibilityNotes: "Non-violent felony or misdemeanor offenders with a substance use disorder or mental health diagnosis. First-time offenders preferred. Eligibility is determined by local circuit courts. Contact your circuit court's specialty court coordinator or your defense attorney to apply.",
    contact: {
      url: "https://judicial.alabama.gov",
    },
    sources: ["Alabama Administrative Office of Courts", "NADCP"],
    lastUpdated: new Date("2026-04-10"),
    isActive: true,
  },

  // Arkansas
  {
    id: "ar-state-specialty-courts",
    name: "Arkansas Specialty Courts Program",
    jurisdictionType: "state",
    state: "AR",
    county: null,
    cities: ["Little Rock", "Fort Smith", "Fayetteville", "Springdale", "Jonesboro"],
    zipCodes: null,
    programTypes: ["Drug Court", "Mental Health Court", "Veterans Court", "DWI Court"],
    eligibilityNotes: "Non-violent offenders with a substance use or mental health disorder. Arkansas has 28 judicial circuits. Contact the local circuit court to check its available specialty programs. DWI courts serve repeat DWI offenders. Veterans courts are available in select districts. Must complete risk/needs assessment. Referrals come from prosecutors, defense counsel, or the court.",
    contact: {
      url: "https://www.arcourts.gov/",
    },
    sources: ["Arkansas Administrative Office of Courts", "NADCP", "https://arcourts.gov/sites/default/files/arkansas-judicial-circuits-map.pdf"],
    lastUpdated: new Date("2026-04-10"),
    isActive: true,
  },

  // Arizona
  {
    id: "az-state-problem-solving-courts",
    name: "Arizona Problem-Solving Courts",
    jurisdictionType: "state",
    state: "AZ",
    county: null,
    cities: ["Phoenix", "Tucson", "Mesa", "Chandler", "Scottsdale", "Flagstaff"],
    zipCodes: null,
    programTypes: ["Drug Court", "Mental Health Court", "Veterans Court", "DUI Court", "Juvenile Drug Court"],
    eligibilityNotes: "Non-violent adult and juvenile drug offenders, individuals with serious mental illness (SMI), and veterans with service-connected conditions. Maricopa County operates the Early Disposition Court for expedited case resolution. Assignment there does not establish acceptance into treatment or diversion. Eligibility varies by county — contact your county Superior Court's specialty court division. Standardized risk/needs assessment required.",
    contact: {
      phone: "(602) 452-3300",
      url: "https://www.azcourts.gov",
    },
    sources: ["Arizona Administrative Office of the Courts", "NADCP", "https://maricopacountyattorney.org/189/Adult-Criminal-Trial-Process"],
    lastUpdated: new Date("2026-04-10"),
    isActive: true,
  },

  // Connecticut
  {
    id: "ct-state-diversionary-programs",
    name: "Connecticut Accelerated Rehabilitation & Diversionary Programs",
    jurisdictionType: "state",
    state: "CT",
    county: null,
    cities: ["Hartford", "Bridgeport", "New Haven", "Stamford", "Waterbury"],
    zipCodes: null,
    programTypes: ["Pre-Trial Diversion", "Drug Education Program", "Accelerated Rehabilitation"],
    eligibilityNotes: "Accelerated Rehabilitation (AR): Available for non-serious crimes and motor vehicle violations; defendant must be unlikely to re-offend. Drug Education and Community Service Program (DECSP): For first-time possession-only charges. Family Violence Education Program: For eligible domestic-related charges. Apply through the Superior Court clerk's office or your attorney.",
    contact: {
      phone: "(860) 566-3400",
      url: "https://www.jud.ct.gov",
    },
    sources: ["Connecticut Judicial Branch", "NADCP", "https://www.cga.ct.gov/current/pub/chap_960.htm"],
    lastUpdated: new Date("2026-04-10"),
    isActive: true,
  },

  // District of Columbia
  {
    id: "dc-drug-court-diversion",
    name: "DC Superior Court Drug Court & Diversion Programs",
    jurisdictionType: "state",
    state: "DC",
    county: null,
    cities: ["Washington"],
    zipCodes: null,
    programTypes: ["Drug Court", "Mental Health Court", "Misdemeanor Diversion", "Community Court"],
    eligibilityNotes: "Non-violent misdemeanor and felony charges where substance abuse or mental health is a primary factor. Cases identified by the US Attorney's Office (felonies) or DC Office of the Attorney General (misdemeanors). The DC Community Court handles quality-of-life misdemeanors with community-based services. Ask your attorney about eligibility.",
    contact: {
      phone: "(202) 879-1010",
      url: "https://www.dccourts.gov",
    },
    sources: ["DC Superior Court", "US Attorney's Office for DC", "NADCP"],
    lastUpdated: new Date("2026-04-10"),
    isActive: true,
  },

  // Hawaii
  {
    id: "hi-state-drug-mental-health-court",
    name: "Hawaii Drug Court & Specialty Courts",
    jurisdictionType: "state",
    state: "HI",
    county: null,
    cities: ["Honolulu", "Hilo", "Kailua", "Pearl City", "Wailuku"],
    zipCodes: null,
    programTypes: ["Drug Court", "Mental Health Court", "Veterans Court", "HOPE Probation"],
    eligibilityNotes: "Non-violent drug-related felony offenders with a documented substance use disorder. Mental Health Court serves non-violent offenders with persistent mental health disorders. HOPE (Hawaii's Opportunity Probation with Enforcement) is a probation supervision model for people already on probation. Veterans Court available on Oahu. Eligibility determined by court referral or attorney request.",
    contact: {
      phone: "(808) 539-4400",
      url: "https://www.courts.state.hi.us",
    },
    sources: ["Hawaii State Judiciary", "NADCP", "https://www.courts.state.hi.us/special_projects/hope/about_hope_probation"],
    lastUpdated: new Date("2026-04-10"),
    isActive: true,
  },

  // Iowa
  {
    id: "ia-state-specialty-courts",
    name: "Iowa Specialty Courts (Drug Courts & Treatment Courts)",
    jurisdictionType: "state",
    state: "IA",
    county: null,
    cities: ["Des Moines", "Cedar Rapids", "Davenport", "Sioux City", "Iowa City"],
    zipCodes: null,
    programTypes: ["Drug Court", "Mental Health Court", "Veterans Court", "Family Drug Court"],
    eligibilityNotes: "High-risk/high-need offenders with a substance use disorder facing felony or aggravated misdemeanor charges. Must demonstrate that substance abuse is a primary factor in the offense. Violent offenders are generally excluded. Risk/needs assessment (LSI-R) required. Referrals from prosecution, defense, or the court.",
    contact: {
      phone: "(515) 348-4700",
      url: "https://www.iowacourts.gov/for-the-public/",
    },
    sources: ["Iowa Judicial Branch", "NADCP", "https://www.iowacourts.gov/for-the-public/"],
    lastUpdated: new Date("2026-04-10"),
    isActive: true,
  },

  // Idaho
  {
    id: "id-state-problem-solving-courts",
    name: "Idaho Problem-Solving Courts",
    jurisdictionType: "state",
    state: "ID",
    county: null,
    cities: ["Boise", "Nampa", "Meridian", "Idaho Falls", "Caldwell", "Twin Falls"],
    zipCodes: null,
    programTypes: ["Drug Court", "Mental Health Court", "Veterans Court", "DUI Court"],
    eligibilityNotes: "Non-violent offenders with substance use or mental health disorders. Programs operate across all 7 judicial districts. Eligibility is set by local court criteria and a clinical assessment. Must be willing to participate voluntarily in an intensive supervision and treatment program.",
    contact: {
      phone: "(208) 334-2246",
      url: "https://isc.idaho.gov/solve-court/home",
    },
    sources: ["Idaho Supreme Court – Problem-Solving Courts", "NADCP", "https://isc.idaho.gov/solve-court/home"],
    lastUpdated: new Date("2026-04-10"),
    isActive: true,
  },

  // Kansas
  {
    id: "ks-state-specialty-courts",
    name: "Kansas Specialty Courts & Pretrial Diversion",
    jurisdictionType: "state",
    state: "KS",
    county: null,
    cities: ["Wichita", "Overland Park", "Kansas City", "Topeka", "Olathe"],
    zipCodes: null,
    programTypes: ["Drug Court", "DUI Court", "Mental Health Court", "Pre-Trial Diversion"],
    eligibilityNotes: "Non-violent drug-related offenses and DUI. Many counties also offer prosecutor-led pretrial diversion for first-time misdemeanor or low-level felony charges. Eligibility determined by local district court and county attorney. Contact your local county attorney or defense attorney to inquire about diversion eligibility.",
    contact: {
      phone: "(785) 296-2256",
      url: "https://www.kscourts.org",
    },
    sources: ["Kansas Office of Judicial Administration", "NADCP", "https://ksrevisor.gov/statutes/chapters/ch22/022_029_0008.html"],
    lastUpdated: new Date("2026-04-10"),
    isActive: true,
  },

  // Kentucky
  {
    id: "ky-state-drug-courts",
    name: "Kentucky Drug Courts & Specialty Courts",
    jurisdictionType: "state",
    state: "KY",
    county: null,
    cities: ["Louisville", "Lexington", "Bowling Green", "Owensboro", "Covington"],
    zipCodes: null,
    programTypes: ["Drug Court", "Mental Health Court", "Veterans Court", "DUI Court", "Family Drug Court"],
    eligibilityNotes: "Non-violent felony or misdemeanor offenders with a substance use disorder or mental health diagnosis. Kentucky operates certified programs in many judicial circuits. Referrals by prosecution, defense, or court. Risk/needs assessment required.",
    contact: {
      url: "https://www.kycourts.gov/Court-Programs/Specialty-Courts/Pages/Drug-Court.aspx",
    },
    sources: ["Kentucky Court of Justice", "NADCP", "https://www.kycourts.gov/Court-Programs/Specialty-Courts/Pages/Drug-Court.aspx"],
    lastUpdated: new Date("2026-04-10"),
    isActive: true,
  },

  // Louisiana
  {
    id: "la-state-drug-courts",
    name: "Louisiana Drug Courts & Specialty Courts",
    jurisdictionType: "state",
    state: "LA",
    county: null,
    cities: ["New Orleans", "Baton Rouge", "Shreveport", "Metairie", "Lafayette"],
    zipCodes: null,
    programTypes: ["Drug Court", "Mental Health Court", "Veterans Court", "DWI Court", "Juvenile Drug Court"],
    eligibilityNotes: "Non-violent drug and alcohol offenders and those with mental health disorders. Louisiana has specialty court programs across the state, including drug, DWI, mental health, and veterans courts. Eligibility varies by parish and program type. Contact your district attorney's office or defense attorney.",
    contact: {
      url: "https://www.nadcp.org/state/louisiana/",
    },
    sources: ["Louisiana Supreme Court", "Louisiana District Attorneys Association", "NADCP", "https://www.lasc.org/press_room/annual_reports/reports/2023_Annual_Report.pdf"],
    lastUpdated: new Date("2026-04-10"),
    isActive: true,
  },

  // Maine
  {
    id: "me-state-drug-treatment-courts",
    name: "Maine Adult Drug Treatment Courts",
    jurisdictionType: "state",
    state: "ME",
    county: null,
    cities: ["Portland", "Lewiston", "Bangor", "Augusta", "Biddeford"],
    zipCodes: null,
    programTypes: ["Drug Court", "Mental Health Court", "Veterans Court"],
    eligibilityNotes: "Non-violent felony or misdemeanor charges for high-risk/high-need individuals with substance use disorders. The Maine Judicial Branch lists each treatment court and the counties it serves. Must complete a clinical assessment. Violent offenses are generally excluded. Contact the court clerk or your defense attorney to request evaluation.",
    contact: {
      phone: "(207) 822-0770",
      url: "https://www.courts.maine.gov/courts/treatment/adult.html",
    },
    sources: ["Maine Judicial Branch", "NADCP", "https://www.courts.maine.gov/courts/treatment/adult.html", "https://www.courts.maine.gov/courts/treatment/trc-report-2025.pdf"],
    lastUpdated: new Date("2026-04-10"),
    isActive: true,
  },

  // Maryland
  {
    id: "md-state-problem-solving-courts",
    name: "Maryland Problem-Solving Courts",
    jurisdictionType: "state",
    state: "MD",
    county: null,
    cities: ["Baltimore", "Frederick", "Rockville", "Gaithersburg", "Annapolis"],
    zipCodes: null,
    programTypes: ["Drug Court", "Mental Health Court", "Veterans Court", "DUI Court", "Juvenile Drug Court"],
    eligibilityNotes: "Non-violent offenders with documented substance abuse or mental health issues. Programs operate in most of Maryland's 24 circuit courts. A stet postpones the trial under Maryland Rule 4-248. The charge remains on the docket. Either party may request that it be rescheduled within one year. Eligibility varies by county — contact your local circuit court.",
    contact: {
      phone: "(410) 260-1250",
      url: "https://www.mdcourts.gov/circuit/",
    },
    sources: ["Maryland Judiciary", "NADCP", "https://www.mdcourts.gov/circuit/"],
    lastUpdated: new Date("2026-04-10"),
    isActive: true,
  },

  // Michigan
  {
    id: "mi-state-problem-solving-courts",
    name: "Michigan Problem-Solving Courts",
    jurisdictionType: "state",
    state: "MI",
    county: null,
    cities: ["Detroit", "Grand Rapids", "Warren", "Sterling Heights", "Lansing", "Ann Arbor"],
    zipCodes: null,
    programTypes: ["Drug Court", "Sobriety Court", "Mental Health Court", "Veterans Court", "Hybrid Court"],
    eligibilityNotes: "Non-violent offenses where substance abuse or mental health is a contributing factor. Michigan also uses Delayed Sentence (MCL 771.1) for eligible first-time offenders. Sobriety courts target alcohol-related offenses. The Michigan judiciary maintains a statewide problem-solving court directory. Referrals from prosecution, defense, or probation. Risk/needs screening required.",
    contact: {
      phone: "(517) 373-0128",
      url: "https://www.courts.michigan.gov/administration/court-programs/problem-solving-courts/",
    },
    sources: ["Michigan Supreme Court – State Court Administrative Office", "NADCP", "https://www.courts.michigan.gov/administration/court-programs/problem-solving-courts/"],
    lastUpdated: new Date("2026-04-10"),
    isActive: true,
  },

  // Missouri
  {
    id: "mo-state-drug-courts",
    name: "Missouri Drug Courts & Treatment Courts",
    jurisdictionType: "state",
    state: "MO",
    county: null,
    cities: ["Kansas City", "St. Louis", "Springfield", "Columbia", "Independence"],
    zipCodes: null,
    programTypes: ["Drug Court", "Mental Health Court", "Veterans Court", "DWI Court", "Juvenile Drug Court"],
    eligibilityNotes: "Non-violent offenders with a substance use disorder or mental health diagnosis. Drug and other treatment courts operate across Missouri's circuit courts. DWI courts target repeat alcohol offenders. Veterans courts serve those with service-related conditions. Eligibility set by local circuit court and prosecutor.",
    contact: {
      url: "https://www.courts.mo.gov",
    },
    sources: ["Missouri Office of State Courts Administrator", "NADCP", "https://www.courts.mo.gov/file.jsp?id=54191"],
    lastUpdated: new Date("2026-04-10"),
    isActive: true,
  },

  // Mississippi
  {
    id: "ms-state-drug-courts",
    name: "Mississippi Drug Courts & Problem-Solving Courts",
    jurisdictionType: "state",
    state: "MS",
    county: null,
    cities: ["Jackson", "Gulfport", "Southaven", "Hattiesburg", "Biloxi"],
    zipCodes: null,
    programTypes: ["Drug Court", "Mental Health Court", "Veterans Court", "DUI Court"],
    eligibilityNotes: "Non-violent drug and alcohol offenders. Drug courts operate across the state. Mental health courts available in select districts. Eligibility determined by local circuit court and district attorney. Ask your attorney about diversion eligibility for your specific county.",
    contact: {
      url: "https://www.ms.gov",
    },
    sources: ["Mississippi Administrative Office of Courts", "NADCP", "https://courts.ms.gov/trialcourts/interventioncourts/2025%20Intervention%20Courts%20database%20for%20website.pdf"],
    lastUpdated: new Date("2026-04-10"),
    isActive: true,
  },

  // Montana
  {
    id: "mt-state-treatment-courts",
    name: "Montana Treatment Courts",
    jurisdictionType: "state",
    state: "MT",
    county: null,
    cities: ["Billings", "Missoula", "Great Falls", "Bozeman", "Butte", "Helena"],
    zipCodes: null,
    programTypes: ["Drug Court", "Mental Health Court", "DUI Court", "Veterans Court", "Juvenile Drug Court"],
    eligibilityNotes: "Non-violent drug-dependent offenders involved in the criminal justice system. Programs operate across all judicial districts. Some districts offer DUI and veterans-specific tracks. Both adult and juvenile programs available. Risk/needs assessment required.",
    contact: {
      phone: "(406) 444-2621",
      url: "https://courts.mt.gov/courts/treatment/",
    },
    sources: ["Montana Supreme Court – Court Services Division", "NADCP"],
    lastUpdated: new Date("2026-04-10"),
    isActive: true,
  },

  // North Dakota
  {
    id: "nd-state-drug-courts",
    name: "North Dakota Adult Drug Courts",
    jurisdictionType: "state",
    state: "ND",
    county: null,
    cities: ["Fargo", "Bismarck", "Grand Forks", "Minot", "West Fargo"],
    zipCodes: null,
    programTypes: ["Drug Court", "Mental Health Court", "Veterans Court", "DUI Court"],
    eligibilityNotes: "Non-violent offenders with a documented substance use disorder. Violent offenders are excluded by state statute. Cases typically involve drug possession or property crimes driven by addiction. Risk/needs assessment required. Must be willing to participate in intensive supervision and treatment.",
    contact: {
      phone: "(701) 328-4216",
      url: "https://www.ndcourts.gov",
    },
    sources: ["North Dakota Supreme Court", "NADCP"],
    lastUpdated: new Date("2026-04-10"),
    isActive: true,
  },

  // Nebraska
  {
    id: "ne-state-problem-solving-courts",
    name: "Nebraska Problem-Solving Courts",
    jurisdictionType: "state",
    state: "NE",
    county: null,
    cities: ["Omaha", "Lincoln", "Bellevue", "Grand Island", "Kearney"],
    zipCodes: null,
    programTypes: ["Drug Court", "DUI Court", "Mental Health Court", "Veterans Court", "Juvenile Drug Court"],
    eligibilityNotes: "Adult and juvenile drug courts, DUI courts, and veterans courts statewide. Targets high-risk/high-need individuals. Pretrial diversion also available for first-time offenders with minor violations through county attorney offices. Must complete risk/needs screening.",
    contact: {
      phone: "(402) 471-3730",
      url: "https://supremecourt.nebraska.gov/courts/problem-solving-courts",
    },
    sources: ["Nebraska Supreme Court", "NADCP"],
    lastUpdated: new Date("2026-04-10"),
    isActive: true,
  },

  // New Hampshire
  {
    id: "nh-state-drug-courts",
    name: "New Hampshire Drug Courts & Treatment Courts",
    jurisdictionType: "state",
    state: "NH",
    county: null,
    cities: ["Manchester", "Nashua", "Concord", "Dover", "Rochester"],
    zipCodes: null,
    programTypes: ["Drug Court", "Mental Health Court", "Veterans Court"],
    eligibilityNotes: "Non-violent felony-level drug-related charges or charges where addiction is a significant contributing factor. Programs operate through the Superior Court in each county. Risk/needs assessment required. Contact the Superior Court in your county or speak with your defense attorney about eligibility.",
    contact: {
      phone: "(603) 271-2030",
      url: "https://www.courts.nh.gov",
    },
    sources: ["New Hampshire Judicial Branch", "NADCP"],
    lastUpdated: new Date("2026-04-10"),
    isActive: true,
  },

  // New Jersey
  {
    id: "nj-pti-recovery-court",
    name: "New Jersey Pretrial Intervention (PTI) & Recovery Court",
    jurisdictionType: "state",
    state: "NJ",
    county: null,
    cities: ["Newark", "Jersey City", "Paterson", "Elizabeth", "Edison", "Trenton"],
    zipCodes: null,
    programTypes: ["Pre-Trial Diversion", "Drug Court", "Recovery Court"],
    eligibilityNotes: "Pretrial Intervention (PTI): Generally available to first-time offenders charged with third- or fourth-degree offenses; charges dismissed upon successful completion. Recovery Court (formerly Drug Court): For individuals with substance use disorders facing non-violent criminal charges; intensive treatment and supervision. Contact your county PTI director or defense attorney.",
    contact: {
      phone: "(609) 815-2900",
      url: "https://www.njcourts.gov/courts/criminal/",
    },
    sources: ["New Jersey Courts – Criminal Division", "NADCP", "https://www.njcourts.gov/sites/default/files/forms/10304_pti.pdf"],
    lastUpdated: new Date("2026-04-10"),
    isActive: true,
  },

  // New Mexico
  {
    id: "nm-state-problem-solving-courts",
    name: "New Mexico Problem-Solving Courts",
    jurisdictionType: "state",
    state: "NM",
    county: null,
    cities: ["Albuquerque", "Las Cruces", "Rio Rancho", "Santa Fe", "Roswell"],
    zipCodes: null,
    programTypes: ["Drug Court", "Mental Health Court", "Veterans Court", "Pre-Prosecution Diversion", "DWI Court"],
    eligibilityNotes: "Drug courts: Adult and juvenile drug-addicted offenders with no history of violent crimes. Mental health courts: Where mental illness is the primary driver of the criminal activity. Pre-Prosecution Diversion (PPD): Available for first-time, non-violent felony offenders through the district attorney's office — charges are dismissed upon completion.",
    contact: {
      phone: "(505) 827-4800",
      url: "https://pscourts.nmcourts.gov/",
    },
    sources: ["New Mexico Administrative Office of the Courts", "NADCP"],
    lastUpdated: new Date("2026-04-10"),
    isActive: true,
  },

  // Nevada
  {
    id: "nv-state-specialty-courts",
    name: "Nevada Specialty Courts",
    jurisdictionType: "state",
    state: "NV",
    county: null,
    cities: ["Las Vegas", "Henderson", "Reno", "North Las Vegas", "Sparks", "Carson City"],
    zipCodes: null,
    programTypes: ["Drug Court", "DUI Court", "Mental Health Court", "Veterans Court"],
    eligibilityNotes: "Adult drug court: High-risk/high-need drug-addicted offenders. Under NRS 484C.340, certain people facing a third DUI within seven years may apply for treatment. Admission requires court approval. Successful completion can reduce the felony to a misdemeanor. Mental health and veterans courts: Non-violent offenses where mental health or military service is a mitigating factor. Programs operate in Clark County (Las Vegas), Washoe County (Reno), and other districts.",
    contact: {
      phone: "(775) 684-1700",
      url: "https://nvcourts.gov/aoc/programs_and_services/specialty_courts/overview",
    },
    sources: ["Nevada Administrative Office of the Courts", "NADCP", "https://www.leg.state.nv.us/nrs/NRS-484C.html"],
    lastUpdated: new Date("2026-04-10"),
    isActive: true,
  },

  // Oklahoma
  {
    id: "ok-state-specialty-courts",
    name: "Oklahoma Specialty Courts",
    jurisdictionType: "state",
    state: "OK",
    county: null,
    cities: ["Oklahoma City", "Tulsa", "Norman", "Broken Arrow", "Edmond", "Lawton"],
    zipCodes: null,
    programTypes: ["Drug Court", "Mental Health Court", "Veterans Court", "DUI Court", "Juvenile Drug Court"],
    eligibilityNotes: "Drug courts: Non-violent felony offenders who would otherwise face incarceration; clinical addiction assessment required. Mental health courts: Non-violent offenders with serious mental illness. Oklahoma uses the LSI-R (Level of Service Inventory-Revised) to determine eligibility. Programs are available in most judicial districts statewide.",
    contact: {
      phone: "(405) 552-4700",
      url: "https://www.oscn.net",
    },
    sources: ["Oklahoma Supreme Court Network", "NADCP", "https://www.oscn.net"],
    lastUpdated: new Date("2026-04-10"),
    isActive: true,
  },

  // Rhode Island
  {
    id: "ri-state-drug-mental-health-court",
    name: "Rhode Island Adult Drug Court & Mental Health Treatment Court",
    jurisdictionType: "state",
    state: "RI",
    county: null,
    cities: ["Providence", "Cranston", "Warwick", "Pawtucket", "East Providence"],
    zipCodes: null,
    programTypes: ["Drug Court", "Mental Health Court", "Veterans Court"],
    eligibilityNotes: "The Superior Court Adult Drug Court serves eligible participants with substance-use-related offenses. The District Court Mental Health Treatment Calendar serves eligible misdemeanor defendants with a qualifying disorder. These programs have separate admission criteria.",
    contact: {
      phone: "(401) 222-3250",
      url: "https://www.courts.ri.gov",
    },
    sources: ["Rhode Island Judiciary – Superior Court", "NADCP", "https://www.courts.ri.gov/Courts/superiorcourt/Documents/AdultDrugCourtCalendarBrochure.pdf"],
    lastUpdated: new Date("2026-04-10"),
    isActive: true,
  },

  // South Carolina
  {
    id: "sc-state-drug-courts",
    name: "South Carolina Drug Courts & Problem-Solving Courts",
    jurisdictionType: "state",
    state: "SC",
    county: null,
    cities: ["Columbia", "Charleston", "North Charleston", "Mount Pleasant", "Rock Hill"],
    zipCodes: null,
    programTypes: ["Drug Court", "Mental Health Court", "Veterans Court", "DUI Court"],
    eligibilityNotes: "Non-violent drug offenders and those with mental health conditions. Drug courts operate through circuit solicitor offices (prosecutors) across all 16 judicial circuits. Eligibility determined by the solicitor's office and local program guidelines. Contact your circuit's solicitor office or defense attorney.",
    contact: {
      url: "https://scprosecutors.sc.gov/adult-drug-court",
    },
    sources: ["South Carolina Judicial Department", "NADCP", "https://scprosecutors.sc.gov/adult-drug-court"],
    lastUpdated: new Date("2026-04-10"),
    isActive: true,
  },

  // South Dakota
  {
    id: "sd-state-problem-solving-courts",
    name: "South Dakota Drug Courts & DUI Courts",
    jurisdictionType: "state",
    state: "SD",
    county: null,
    cities: ["Sioux Falls", "Rapid City", "Aberdeen", "Brookings", "Watertown"],
    zipCodes: null,
    programTypes: ["Drug Court", "DUI Court", "Mental Health Court", "Veterans Court"],
    eligibilityNotes: "Non-violent drug and DUI offenders. Eligibility is based on a standardized risk and needs assessment (LSI-R). Programs are administered through the Unified Judicial System and operate across multiple judicial circuits statewide.",
    contact: {
      phone: "(605) 773-3474",
      url: "https://ujs.sd.gov/Circuit_Court/Problem_Solving_Courts/Default.aspx",
    },
    sources: ["South Dakota Unified Judicial System", "NADCP", "https://ujs.sd.gov/programs-services/treatment-courts/"],
    lastUpdated: new Date("2026-04-10"),
    isActive: true,
  },

  // Utah
  {
    id: "ut-state-problem-solving-courts",
    name: "Utah Problem-Solving Courts",
    jurisdictionType: "state",
    state: "UT",
    county: null,
    cities: ["Salt Lake City", "West Valley City", "Provo", "West Jordan", "Orem", "St. George"],
    zipCodes: null,
    programTypes: ["Drug Court", "Mental Health Court", "Veterans Court", "Family Drug Court", "DUI Court"],
    eligibilityNotes: "Adult, juvenile, and family drug courts; mental health courts; and veterans courts statewide. Generally covers non-violent felony and misdemeanor offenses related to addiction or mental illness. Eligibility requires a clinical assessment. Programs operate in all eight judicial districts.",
    contact: {
      phone: "(801) 578-3800",
      url: "https://www.utcourts.gov/en/courts/court-types/problem-solving-courts.html",
    },
    sources: ["Utah State Courts", "NADCP", "https://www.utcourts.gov/en/courts/court-types/problem-solving-courts.html"],
    lastUpdated: new Date("2026-04-10"),
    isActive: true,
  },

  // Vermont
  {
    id: "vt-state-treatment-courts",
    name: "Vermont Treatment Courts",
    jurisdictionType: "state",
    state: "VT",
    county: null,
    cities: ["Burlington", "South Burlington", "Rutland", "Barre", "Montpelier"],
    zipCodes: null,
    programTypes: ["Drug Court", "Mental Health Court", "DUI Court", "Family Drug Court"],
    eligibilityNotes: "Non-violent offenders with high treatment needs for substance abuse or mental health, with adult drug treatment dockets in Chittenden, Rutland, Washington and Windsor counties. DUI/Driving while suspended courts available for alcohol-related charges. Family drug courts serve parents with child welfare involvement. Contact the Vermont Judiciary for program availability by county.",
    contact: {
      phone: "(802) 828-3278",
      url: "https://www.vtcourts.gov/programs-and-services/treatment-and-specialty-dockets",
    },
    sources: ["Vermont Judiciary", "NADCP", "https://www.vtcourts.gov/programs-and-services/treatment-and-specialty-dockets"],
    lastUpdated: new Date("2026-04-10"),
    isActive: true,
  },

  // Virginia
  {
    id: "va-state-drug-treatment-courts",
    name: "Virginia Drug Treatment Courts & Behavioral Health Dockets",
    jurisdictionType: "state",
    state: "VA",
    county: null,
    cities: ["Virginia Beach", "Norfolk", "Chesapeake", "Richmond", "Arlington", "Alexandria"],
    zipCodes: null,
    programTypes: ["Drug Court", "Mental Health Court", "Veterans Court", "DUI Court"],
    eligibilityNotes: "Non-violent offenders with substance use disorders. Pretrial diversion eligibility determined by local Commonwealth's Attorneys. Behavioral health dockets serve those with co-occurring disorders. Drug treatment courts operate in most cities and counties. Contact your local Commonwealth's Attorney or defense attorney.",
    contact: {
      phone: "(804) 786-6455",
      url: "https://www.vacourts.gov",
    },
    sources: ["Virginia's Judicial System – Drug Treatment Courts", "NADCP", "https://www.vacourts.gov"],
    lastUpdated: new Date("2026-04-10"),
    isActive: true,
  },

  // West Virginia
  {
    id: "wv-state-drug-courts",
    name: "West Virginia Drug Courts & Problem-Solving Courts",
    jurisdictionType: "state",
    state: "WV",
    county: null,
    cities: ["Charleston", "Huntington", "Morgantown", "Parkersburg", "Wheeling"],
    zipCodes: null,
    programTypes: ["Drug Court", "Mental Health Court", "Veterans Court", "DUI Court", "Family Drug Court"],
    eligibilityNotes: "Non-violent offenders with a substance use disorder or mental health diagnosis. West Virginia operates drug courts through circuit courts. Family drug courts focus on parents with child welfare involvement. Eligibility determined by local circuit court and prosecutor. Contact your circuit court or defense attorney.",
    contact: {
      url: "https://www.courtswv.gov",
    },
    sources: ["West Virginia Supreme Court of Appeals", "NADCP", "https://www.courtswv.gov/sites/default/pubfilesmnt/2026-04/ADCMap_R.pdf"],
    lastUpdated: new Date("2026-04-10"),
    isActive: true,
  },

  // Wyoming
  {
    id: "wy-state-cst-programs",
    name: "Wyoming Court Supervised Treatment (CST) Programs",
    jurisdictionType: "state",
    state: "WY",
    county: null,
    cities: ["Cheyenne", "Casper", "Laramie", "Gillette", "Rock Springs"],
    zipCodes: null,
    programTypes: ["Drug Court", "DUI Court", "Mental Health Court", "Veterans Court"],
    eligibilityNotes: "Wyoming’s Court Supervised Treatment programs are administered through the judiciary. Adult, juvenile and DUI tracks are available. Local courts assess treatment needs and eligibility.",
    contact: {
      phone: "(307) 777-6494",
      url: "https://www.wyocourts.gov/treatment-and-diversion-courts/",
    },
    sources: ["Wyoming Judicial Branch", "https://www.wyocourts.gov/treatment-and-diversion-courts/"],
    lastUpdated: new Date("2026-04-10"),
    isActive: true,
  },
];

// Helper function to search diversion programs by location
const stateNameToAbbrev: Record<string, string> = {
  'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR', 'california': 'CA',
  'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE', 'florida': 'FL', 'georgia': 'GA',
  'hawaii': 'HI', 'idaho': 'ID', 'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA',
  'kansas': 'KS', 'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD',
  'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS', 'missouri': 'MO',
  'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV', 'new hampshire': 'NH', 'new jersey': 'NJ',
  'new mexico': 'NM', 'new york': 'NY', 'north carolina': 'NC', 'north dakota': 'ND', 'ohio': 'OH',
  'oklahoma': 'OK', 'oregon': 'OR', 'pennsylvania': 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
  'south dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT', 'vermont': 'VT',
  'virginia': 'VA', 'washington': 'WA', 'west virginia': 'WV', 'wisconsin': 'WI', 'wyoming': 'WY',
  'district of columbia': 'DC', 'washington dc': 'DC', 'washington d.c.': 'DC', 'd.c.': 'DC'
};

// Check if a string looks like a zip code (5 digits)
function isZipCode(query: string): boolean {
  return /^\d{5}$/.test(query.trim());
}

// Async search that expands zip code searches to show all programs in that state
export interface ExpandedSearchResult {
  programs: DiversionProgram[];
  expandedToState?: string;
  searchedZipCode?: string;
  county?: string;
}


export function searchDiversionPrograms(query: string): DiversionProgram[] {
  if (!query.trim()) return diversionPrograms;
  
  const lowercaseQuery = query.toLowerCase().trim();
  
  // Check if query matches a full state name and get the abbreviation
  const stateAbbrev = stateNameToAbbrev[lowercaseQuery];
  
  return diversionPrograms.filter(program => {
    // Search by zip code
    if (program.zipCodes?.some(zip => zip.includes(query))) {
      return true;
    }
    
    // Search by county
    if (program.county?.toLowerCase().includes(lowercaseQuery)) {
      return true;
    }
    
    // Search by city
    if (program.cities?.some(city => city.toLowerCase().includes(lowercaseQuery))) {
      return true;
    }
    
    // Search by state abbreviation (e.g., "CA")
    if (program.state.toLowerCase().includes(lowercaseQuery)) {
      return true;
    }
    
    // Search by full state name (e.g., "California" -> matches "CA")
    if (stateAbbrev && program.state.toUpperCase() === stateAbbrev) {
      return true;
    }
    
    // Search by program name
    if (program.name.toLowerCase().includes(lowercaseQuery)) {
      return true;
    }
    
    return false;
  });
}

// Helper function to get programs by state
export function getProgramsByState(state: string): DiversionProgram[] {
  return diversionPrograms.filter(program => 
    program.state.toLowerCase() === state.toLowerCase()
  );
}

// Helper function to get all available states
export function getAvailableStates(): string[] {
  const states = new Set(diversionPrograms.map(program => program.state));
  return Array.from(states).sort();
}

// Helper function to resolve zip code to county (simplified)
export function resolveZipToCounty(zipCode: string): DiversionProgram[] {
  return diversionPrograms.filter(program => 
    program.zipCodes?.includes(zipCode)
  );
}