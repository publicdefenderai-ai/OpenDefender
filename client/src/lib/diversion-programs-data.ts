import { DiversionProgram } from "@shared/schema";

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