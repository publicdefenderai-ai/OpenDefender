import { DiversionProgram } from "@shared/schema";

/**
 * DIVERSION PROGRAMS DATABASE
 * 
 * Current Status: 57 diversion programs across major US metropolitan areas
 * Last Updated: November 2024
 * 
 * California Coverage (16 programs):
 * - Los Angeles County, San Francisco, Orange County, San Diego County
 * - Sacramento County, Alameda County, Riverside County
 * - Fresno County, Kern County
 * 
 * New York Coverage (12 programs):
 * - Manhattan, Brooklyn, Bronx, Queens, Staten Island (Richmond)
 * - Nassau County, Albany County, Westchester County
 * - Rockland County, Suffolk County
 * 
 * Other States (29 programs):
 * - Texas (Harris County, Dallas County)
 * - Florida (Miami-Dade, Broward County)
 * - Illinois (Cook County/Chicago)
 * - Pennsylvania (Philadelphia)
 * - Washington (King County/Seattle)
 * - Colorado (Denver)
 * - Georgia (Fulton County/Atlanta)
 * - Massachusetts (Suffolk County/Boston)
 * - Tennessee (Davidson County/Nashville)
 * - Oregon (Multnomah County/Portland)
 * - North Carolina (Mecklenburg County/Charlotte)
 * - Ohio (Franklin County/Columbus)
 * - Delaware, Wisconsin, Federal programs
 * 
 * Data Sources:
 * 1. NDAA Prosecutor-Led Diversion Programs Directory (https://diversion.ndaa.org/)
 * 2. Center for Health and Justice Report (2024)
 * 3. State and county court systems
 * 4. District Attorney offices and prosecutor-led diversion programs
 * 5. Municipal court programs
 * 6. CrimeSolutions.gov Programs API (when available)
 * 
 * Program Types Include:
 * - Drug Courts & Substance Abuse Treatment
 * - Mental Health Courts & Crisis Intervention
 * - Veterans Courts & PTSD Treatment
 * - Pre-Booking/Pretrial Diversion (LEAD/PATH model)
 * - Pre-Filing/Pre-Arraignment Diversion
 * - Harm Reduction Programs
 * - Community Service & Restorative Justice
 * - Youth & Young Adult Diversion
 * - CARE Courts (California)
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
    lastUpdated: new Date("2024-01-01"),
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
      phone: "(415) 551-5780",
      url: "https://www.sfsuperiorcourt.org/divisions/collaborative-courts"
    },
    sources: ["San Francisco Superior Court"],
    lastUpdated: new Date("2024-01-01"),
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
      url: "https://www.occourts.org/self-help/mentalhealthcourt/"
    },
    sources: ["Orange County Superior Court"],
    lastUpdated: new Date("2024-01-01"),
    isActive: true,
  },

  // Texas Programs
  {
    id: "tx-harris-drug-court",
    name: "Harris County Drug Court",
    jurisdictionType: "county",
    state: "TX",
    county: "Harris",
    cities: ["Houston", "Pasadena", "Baytown"],
    zipCodes: ["77001", "77002", "77003", "77004", "77005", "77006", "77007", "77008", "77009", "77010", "77011", "77012", "77013", "77014", "77015", "77016", "77017", "77018", "77019", "77020", "77021", "77022", "77023", "77024", "77025", "77026", "77027", "77028", "77029", "77030", "77031", "77032", "77033", "77034", "77035", "77036", "77037", "77038", "77039", "77040", "77041", "77042", "77043", "77044", "77045", "77046", "77047", "77048", "77049", "77050", "77051", "77052", "77053", "77054", "77055", "77056", "77057", "77058", "77059", "77060", "77061", "77062", "77063", "77064", "77065", "77066", "77067", "77068", "77069", "77070", "77071", "77072", "77073", "77074", "77075", "77076", "77077", "77078", "77079", "77080", "77081", "77082", "77083", "77084", "77085", "77086", "77087", "77088", "77089", "77090", "77091", "77092", "77093", "77094", "77095", "77096", "77098", "77099", "77201", "77202", "77336", "77338", "77339", "77345", "77346", "77354", "77357", "77365", "77373", "77375", "77377", "77379", "77388", "77389", "77396", "77401", "77402", "77407", "77429", "77433", "77441", "77447", "77449", "77450", "77459", "77477", "77478", "77479", "77489", "77493", "77494", "77498", "77502", "77503", "77504", "77505", "77506", "77507", "77508", "77530", "77532", "77536", "77547", "77562", "77571", "77572", "77573", "77581", "77584", "77586", "77587", "77598"],
    programTypes: ["Drug Court", "DWI Court", "Felony Mental Health Court"],
    eligibilityNotes: "Drug-related offenses, DWI cases, mental health issues. Must be Harris County resident.",
    contact: {
      phone: "(713) 755-6044",
      url: "https://www.hcdistrictcourt.org/drug-court"
    },
    sources: ["Harris County District Courts"],
    lastUpdated: new Date("2024-01-01"),
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
    eligibilityNotes: "Military veterans with service-connected mental health or substance abuse issues.",
    contact: {
      phone: "(214) 653-7994",
      url: "https://www.dallascounty.org/departments/dallascountycourts/veterans-court.php"
    },
    sources: ["Dallas County Courts"],
    lastUpdated: new Date("2024-01-01"),
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
    eligibilityNotes: "Non-violent drug offenses, mental health issues, veterans. Must be Miami-Dade resident.",
    contact: {
      phone: "(305) 349-7000",
      url: "https://www.jud11.flcourts.org/Criminal-Division/Drug-Court"
    },
    sources: ["Miami-Dade County Court"],
    lastUpdated: new Date("2024-01-01"),
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
    eligibilityNotes: "Mental health diagnosis required, co-occurring disorders accepted.",
    contact: {
      phone: "(954) 831-6565",
      url: "https://www.17th.flcourts.org/mental-health-court"
    },
    sources: ["Broward County Court"],
    lastUpdated: new Date("2024-01-01"),
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
    lastUpdated: new Date("2024-01-01"),
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
    lastUpdated: new Date("2024-01-01"),
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
    eligibilityNotes: "Coordinates all drug court diversion programs in Delaware. Superior Court minimum 6 months, Court of Common Pleas minimum 14 weeks.",
    contact: {
      phone: "(302) 577-2711",
      url: "https://dhss.delaware.gov/dhss/dsamh/tasc.html"
    },
    sources: ["Delaware Department of Health and Social Services", "Center for Health and Justice Report"],
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
    eligibilityNotes: "Southern Delaware location serving Sussex County. Provides intake assessments, urinalysis, educational groups, and case management services.",
    contact: {
      phone: "(302) 854-0010",
      url: "https://dhss.delaware.gov/dhss/dsamh/tasc.html"
    },
    sources: ["Delaware Department of Health and Social Services", "Center for Health and Justice Report"],
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
    eligibilityNotes: "Part of Wisconsin's TAD program for non-violent offenders with substance abuse issues. Alternative to incarceration with judicial supervision.",
    contact: {
      phone: "(414) 278-5362",
      url: "https://county.milwaukee.gov/EN/Courts/Court-Resources/Drug-Treatment-Court"
    },
    sources: ["Milwaukee County Courts", "Wisconsin DOJ TAD Program", "Center for Health and Justice Report"],
    lastUpdated: new Date("2024-09-20"),
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
    eligibilityNotes: "High-risk, high-need defendants with non-violent felony offenses eligible for probation. Diagnosed substance use disorder required. No conviction for violent crime in past 10 years. 18-24 month program duration.",
    contact: {
      phone: "problemsolvingcourts@cookcountyil.gov",
      url: "https://www.cookcountycourt.org/division/problem-solving-courts/drug-treatment-court-programs"
    },
    sources: ["Cook County Circuit Court"],
    lastUpdated: new Date("2024-11-01"),
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
      phone: "problemsolvingcourts@cookcountyil.gov",
      url: "https://www.cookcountycourt.org/division/problem-solving-courts/mental-health-treatment-court-program"
    },
    sources: ["Cook County Circuit Court"],
    lastUpdated: new Date("2024-11-01"),
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
    eligibilityNotes: "Year-long intensive program spanning four phases. No-contest plea required. No requirement for clean criminal history. Dual diagnosis option available for co-occurring mental health and substance abuse issues.",
    contact: {
      url: "https://phillyda.org/adult-diversion-and-alternatives-to-incarceration-initiatives/"
    },
    sources: ["Philadelphia District Attorney's Office"],
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
    eligibilityNotes: "Non-violent misdemeanor offenders with minimal criminal convictions. Pre-plea (case stays in pretrial status). Requires 12-18 hours community service OR proof of drug treatment.",
    contact: {
      url: "https://phillyda.org/adult-diversion-and-alternatives-to-incarceration-initiatives/"
    },
    sources: ["Philadelphia District Attorney's Office"],
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
    eligibilityNotes: "Active or former military members charged with non-violent misdemeanors. Services through VA officials include drug/alcohol treatment, mental health treatment, medical referrals, housing assistance, employment training. Includes mentor matching. Eligible for expungement upon completion.",
    contact: {
      url: "https://phillyda.org/adult-diversion-and-alternatives-to-incarceration-initiatives/"
    },
    sources: ["Philadelphia District Attorney's Office"],
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
    eligibilityNotes: "Low-level drug possession/sales (≤3 grams), prostitution, property crimes. Cannot have felony convictions for serious violent crimes. Harm-reduction oriented, abstinence not required. Services provided as long as needed with no fixed end date.",
    contact: {
      phone: "(206) 392-0050",
      url: "https://kingcounty.gov/en/dept/dchs/human-social-services/behavioral-health-recovery/diversion-reentry-programs/lead"
    },
    sources: ["King County Department of Community and Human Services", "Purpose, Dignity, Action (PDA)"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },

  // Colorado Programs
  {
    id: "co-denver-reach",
    name: "Denver REACH Mental Health Diversion Program",
    jurisdictionType: "city",
    state: "CO",
    county: "Denver",
    cities: ["Denver"],
    zipCodes: ["80201", "80202", "80203", "80204", "80205", "80206", "80207", "80209", "80210", "80211", "80212", "80214", "80216", "80218", "80219", "80220", "80221", "80222", "80223", "80224", "80226", "80227", "80230", "80231", "80232", "80235", "80236", "80237", "80238", "80239", "80246", "80247", "80249", "80264"],
    programTypes: ["Mental Health Diversion", "Competency Screening", "Treatment Linkage"],
    eligibilityNotes: "Low-level offenses with individuals previously found incompetent. Six-month diversion program. Released to community with treatment plans. Cases dismissed if compliant.",
    contact: {
      url: "https://www.denverda.org/units-and-programs/alternatives-to-prosecution/"
    },
    sources: ["Denver District Attorney's Office", "WellPower"],
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
      url: "http://fultoncourt.org/center-for-diversion-and-services"
    },
    sources: ["Fulton County Superior Court", "Grady Health System"],
    lastUpdated: new Date("2024-11-01"),
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
      url: "http://www.fultonsuperiorcourtga.gov/accountability-courts"
    },
    sources: ["Fulton County Superior Court"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
  },

  // Massachusetts Programs
  {
    id: "ma-suffolk-drug-diversion",
    name: "Suffolk County Drug Diversion Program",
    jurisdictionType: "county",
    state: "MA",
    county: "Suffolk",
    cities: ["Boston"],
    zipCodes: ["02108", "02109", "02110", "02111", "02113", "02114", "02115", "02116", "02118", "02119", "02120", "02121", "02122", "02124", "02125", "02126", "02127", "02128", "02129", "02130", "02131", "02132", "02134", "02135", "02136", "02163", "02199", "02203", "02210", "02215"],
    programTypes: ["Drug Diversion", "Substance Abuse Treatment", "Pre-Disposition"],
    eligibilityNotes: "Nonviolent offenders with substance use and mental health disorders. Eligible individuals can opt into treatment instead of prosecution. Participation can mitigate sentences.",
    contact: {
      url: "https://northsuffolk.org/addiction-services/"
    },
    sources: ["Suffolk County District Attorney's Office", "North Suffolk Mental Health Association"],
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
    eligibilityNotes: "Nonviolent individuals with substance use disorders. Alternative to incarceration. Integrates substance abuse treatment with case processing and judicial supervision. 4 court sessions at different locations.",
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
    eligibilityNotes: "Mental health + co-occurring substance use issues. Pretrial diversion or post-conviction program. Treatment and intensive social services. Goal: achieve recovery, maintain stability, avoid incarceration. 3 court sessions.",
    contact: {
      phone: "(857) 287-1806",
      email: "Elizabeth.Plange@BMC.org",
      url: "https://www.bmc.org/programs/criminal-justice-mental-health-programs"
    },
    sources: ["Boston Medical Center"],
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
    eligibilityNotes: "Felony defendants with serious mental illness (schizophrenia, schizoaffective disorder, bipolar disorder). Capacity: 75 spots for adults. Must plead guilty and agree to strict program requirements. 51% completion rate.",
    contact: {
      url: "https://www.sdcourt.ca.gov/"
    },
    sources: ["San Diego Superior Court", "Telecare"],
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
      url: "https://mentalhealthcourt.nashville.gov/"
    },
    sources: ["General Sessions Court of Metropolitan Nashville & Davidson County"],
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
    name: "Multnomah County PATH Program (Providing Access To Hope)",
    jurisdictionType: "county",
    state: "OR",
    county: "Multnomah",
    cities: ["Portland"],
    zipCodes: ["97201", "97202", "97203", "97204", "97205", "97206", "97209", "97210", "97211", "97212", "97213", "97214", "97215", "97216", "97217", "97218", "97219", "97220", "97221", "97222", "97223", "97224", "97225", "97227", "97229", "97230", "97232", "97233", "97239"],
    programTypes: ["Pre-Booking Diversion", "Harm Reduction", "Mental Health Support"],
    eligibilityNotes: "Diversion from jail for people with substance use and mental health challenges. Prioritizes Black, Indigenous, and People of Color at risk for legal engagement and homelessness. Goal-setting, resource connection, substance use and mental health support.",
    contact: {
      phone: "(503) 988-4888",
      url: "https://www.multco.us/lpscc/law-enforcement-assisted-diversion-lead"
    },
    sources: ["Multnomah County Behavioral Health Division"],
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
    eligibilityNotes: "First-time drug possession offenses. Post-plea model (participants plead guilty, charges dropped upon completion). 365 days in treatment required. Six consecutive clean drug tests needed. Charges can be removed from criminal record upon successful completion. Established 1991.",
    contact: {
      phone: "(503) 988-4888",
      url: "https://www.multco.us/dcj-adult/stop-drug-diversion"
    },
    sources: ["Multnomah County Circuit Court"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
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
    eligibilityNotes: "Currently on probation with qualifying mental health diagnoses (major depression, bipolar disorder, schizophrenia, or similar). Minimum 1 year to complete. 6-12 month programs with therapy, case management, and medication management.",
    contact: {
      url: "https://www.mcda.us/index.php/community-initiatives-special-programs/mental-health-court"
    },
    sources: ["Multnomah County District Attorney", "Cascadia Health"],
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
    eligibilityNotes: "First-time drug possession offenses (small amounts) and drug paraphernalia. No previous drug charge convictions. No prior felony convictions. Requires drug abuse assessment, 225 hours community service, regular random drug testing, regular case manager meetings. Charges dismissed upon completion.",
    contact: {
      url: "https://cjs.mecknc.gov/"
    },
    sources: ["Mecklenburg County Criminal Justice Services", "Anuvia Prevention and Recovery Center"],
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
      url: "https://fccourts.org/503/Mental-Health-Court"
    },
    sources: ["Franklin County Court of Common Pleas"],
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
      url: "https://prosecutor.franklincountyohio.gov/criminal-division/diversion-unit"
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
    sources: ["Alameda County District Attorney", "Alameda County Behavioral Health"],
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
    eligibilityNotes: "Low-level felonies (PC Section 1170(h)). Alameda County Medi-Cal eligible, no private insurance. Typically 1 year with weekly then monthly progress reports. Case dismissal + PC 851.91 relief. Excludes gun cases, DV, 290 registration.",
    contact: {
      url: "https://www.alameda.courts.ca.gov/divisions/collaborative-courts"
    },
    sources: ["Alameda County Superior Court", "Leaders in Community Alternatives (LCA)"],
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
    eligibilityNotes: "Launched early 2022. Low-level offenders with mental health and substance abuse issues. Partners: OC DA, Sheriff, Seal Beach PD, Irvine PD, Health Care Agency. Coverage: Seal Beach, Irvine, South OC. No charges filed; connects offenders to services immediately.",
    contact: {
      url: "https://orangecountyda.org/"
    },
    sources: ["Orange County District Attorney", "Orange County Health Care Agency"],
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
      url: "https://www.riverside.courts.ca.gov/"
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
    eligibilityNotes: "Effective October 1, 2023. Civil court program for behavioral health treatment. Residents with serious mental illness. Referrals: family, friends, doctors, law enforcement. Department 12, Riverside Historic Courthouse. Monday-Friday afternoons.",
    contact: {
      phone: "(800) 499-3008",
      url: "https://ruhealth.org/behavioral-health/care-court"
    },
    sources: ["Riverside University Health System"],
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
    eligibilityNotes: "Adults 18+ with primary behavioral health diagnoses (bipolar, schizophrenia, PTSD). 2 years pre-trial probation. ACT and FSP model: 4+ contacts/week at highest intensity, supportive housing, case management, therapy, medication support.",
    contact: {
      url: "https://www.fresno.courts.ca.gov/"
    },
    sources: ["Fresno County Department of Behavioral Health", "Turning Point of Central California"],
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
    sources: ["Kern County Superior Court", "Kern Behavioral Health and Recovery Services"],
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
      url: "https://manhattanda.org/projectgreenlight/"
    },
    sources: ["Manhattan District Attorney's Office"],
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
    eligibilityNotes: "Non-violent offenders with addiction, mental illness, or poverty issues. Police diversion at point of contact instead of arrest. Operational since 2015 (3rd LEAD program in U.S.). Both diversion and referral pathways. Quarterly public reporting.",
    contact: {
      phone: "(518) 694-5116",
      email: "info@albanylead.org",
      url: "https://albanylead.org/"
    },
    sources: ["Albany PD", "Albany County DA", "Albany County Public Defender"],
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
    eligibilityNotes: "Ages 18-25, no prior felony convictions, facing felony charges. 18-24 months duration. Full dismissal of charges upon completion. Victim perspective work, apology letters, restitution, community service required.",
    contact: {
      phone: "(518) 487-5200",
      url: "https://www.albanycountyny.gov/departments/probation"
    },
    sources: ["Albany County Probation Department"],
    lastUpdated: new Date("2024-11-01"),
    isActive: true,
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
    id: "ny-rockland-partnership-youth",
    name: "Rockland County Partnership for Safe Youth",
    jurisdictionType: "county",
    state: "NY",
    county: "Rockland",
    cities: ["New City", "Spring Valley", "Nyack", "Pearl River", "Monsey", "Suffern"],
    zipCodes: ["10901", "10913", "10920", "10923", "10927", "10952", "10954", "10956", "10960", "10962", "10965", "10968", "10970", "10974", "10976", "10977", "10980", "10983", "10984", "10989", "10994"],
    programTypes: ["Youth Diversion", "School-Based", "Ages 16-21"],
    eligibilityNotes: "Ages 16-21 with low-level, non-violent crimes (shoplifting, graffiti, marijuana possession, curfew violations). Students sign contracts for behavior/academic requirements. Charges dismissed upon successful completion. 90%+ positive outcomes. Served ~90 families in 2024.",
    contact: {
      phone: "(845) 638-5609",
      url: "https://www.rocklandda.org/diversion"
    },
    sources: ["Rockland County District Attorney", "Rockland BOCES"],
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
      url: "https://www.justice.gov/usao/justice-101/pretrial-diversion"
    },
    sources: ["U.S. Department of Justice"],
    lastUpdated: new Date("2024-01-01"),
    isActive: true,
  }
];

// Helper function to search diversion programs by location
export function searchDiversionPrograms(query: string): DiversionProgram[] {
  if (!query.trim()) return diversionPrograms;
  
  const lowercaseQuery = query.toLowerCase();
  
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
    
    // Search by state
    if (program.state.toLowerCase().includes(lowercaseQuery)) {
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