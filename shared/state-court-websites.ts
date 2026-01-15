/**
 * Official State Court Websites
 * 
 * Maps state codes to their official judiciary/court system websites
 * for users to verify deadlines, local court rules, and case information.
 * 
 * Sources: Official state judiciary websites, verified Jan 2025
 */

export interface StateCourtInfo {
  state: string;
  stateName: string;
  courtWebsite: string;
  courtLocatorUrl?: string;
  localRulesNote: string;
}

export const stateCourtWebsites: Record<string, StateCourtInfo> = {
  'AL': {
    state: 'AL',
    stateName: 'Alabama',
    courtWebsite: 'https://judicial.alabama.gov',
    courtLocatorUrl: 'https://judicial.alabama.gov/court-directory',
    localRulesNote: 'Contact your local circuit or district court for specific deadlines and procedures.',
  },
  'AK': {
    state: 'AK',
    stateName: 'Alaska',
    courtWebsite: 'https://courts.alaska.gov',
    courtLocatorUrl: 'https://courts.alaska.gov/courtdir/index.htm',
    localRulesNote: 'Alaska has a unified court system. Check the court directory for your district.',
  },
  'AZ': {
    state: 'AZ',
    stateName: 'Arizona',
    courtWebsite: 'https://www.azcourts.gov',
    courtLocatorUrl: 'https://www.azcourts.gov/AZ-Courts/Find-a-Court',
    localRulesNote: 'Each county superior court has its own local rules and procedures.',
  },
  'AR': {
    state: 'AR',
    stateName: 'Arkansas',
    courtWebsite: 'https://www.arcourts.gov',
    courtLocatorUrl: 'https://www.arcourts.gov/courts/circuit-courts',
    localRulesNote: 'Contact your circuit court for local rules and deadlines.',
  },
  'CA': {
    state: 'CA',
    stateName: 'California',
    courtWebsite: 'https://www.courts.ca.gov',
    courtLocatorUrl: 'https://www.courts.ca.gov/find-my-court.htm',
    localRulesNote: 'Each county superior court has unique local rules. Verify deadlines with your court.',
  },
  'CO': {
    state: 'CO',
    stateName: 'Colorado',
    courtWebsite: 'https://www.courts.state.co.us',
    courtLocatorUrl: 'https://www.courts.state.co.us/Courts/Index.cfm',
    localRulesNote: 'Check with your judicial district for local court rules.',
  },
  'CT': {
    state: 'CT',
    stateName: 'Connecticut',
    courtWebsite: 'https://www.jud.ct.gov',
    courtLocatorUrl: 'https://www.jud.ct.gov/directory/directory/location.htm',
    localRulesNote: 'Connecticut has a unified court system with statewide procedures.',
  },
  'DE': {
    state: 'DE',
    stateName: 'Delaware',
    courtWebsite: 'https://courts.delaware.gov',
    courtLocatorUrl: 'https://courts.delaware.gov/locations/',
    localRulesNote: 'Check with your county court for specific procedures.',
  },
  'DC': {
    state: 'DC',
    stateName: 'District of Columbia',
    courtWebsite: 'https://www.dccourts.gov',
    courtLocatorUrl: 'https://www.dccourts.gov/superior-court',
    localRulesNote: 'DC Superior Court handles criminal matters. Check court calendar for deadlines.',
  },
  'FL': {
    state: 'FL',
    stateName: 'Florida',
    courtWebsite: 'https://www.flcourts.gov',
    courtLocatorUrl: 'https://www.flcourts.gov/Florida-Courts/Trial-Courts-and-டIrcuits',
    localRulesNote: 'Each circuit has its own local rules. Contact your circuit clerk.',
  },
  'GA': {
    state: 'GA',
    stateName: 'Georgia',
    courtWebsite: 'https://georgiacourts.gov',
    courtLocatorUrl: 'https://georgiacourts.gov/courts/',
    localRulesNote: 'Georgia has separate superior, state, and magistrate courts by county.',
  },
  'HI': {
    state: 'HI',
    stateName: 'Hawaii',
    courtWebsite: 'https://www.courts.state.hi.us',
    courtLocatorUrl: 'https://www.courts.state.hi.us/courts',
    localRulesNote: 'Hawaii has a unified court system. Check your circuit court for local procedures.',
  },
  'ID': {
    state: 'ID',
    stateName: 'Idaho',
    courtWebsite: 'https://isc.idaho.gov',
    courtLocatorUrl: 'https://isc.idaho.gov/findacourt',
    localRulesNote: 'Contact your district court for local rules and filing deadlines.',
  },
  'IL': {
    state: 'IL',
    stateName: 'Illinois',
    courtWebsite: 'https://www.illinoiscourts.gov',
    courtLocatorUrl: 'https://www.illinoiscourts.gov/courts-directory',
    localRulesNote: 'Each circuit has its own local rules. Check with your county clerk.',
  },
  'IN': {
    state: 'IN',
    stateName: 'Indiana',
    courtWebsite: 'https://www.in.gov/courts',
    courtLocatorUrl: 'https://www.in.gov/courts/local-courts/',
    localRulesNote: 'Each county has its own court rules. Contact your local court clerk.',
  },
  'IA': {
    state: 'IA',
    stateName: 'Iowa',
    courtWebsite: 'https://www.iowacourts.gov',
    courtLocatorUrl: 'https://www.iowacourts.gov/iowa-courts/district-court',
    localRulesNote: 'Iowa has uniform statewide rules. Check your district court for schedules.',
  },
  'KS': {
    state: 'KS',
    stateName: 'Kansas',
    courtWebsite: 'https://www.kscourts.org',
    courtLocatorUrl: 'https://www.kscourts.org/Courts/District-Courts',
    localRulesNote: 'Each judicial district may have local rules. Contact your district court.',
  },
  'KY': {
    state: 'KY',
    stateName: 'Kentucky',
    courtWebsite: 'https://courts.ky.gov',
    courtLocatorUrl: 'https://courts.ky.gov/courts/Pages/default.aspx',
    localRulesNote: 'Each circuit has local rules. Check with your circuit clerk.',
  },
  'LA': {
    state: 'LA',
    stateName: 'Louisiana',
    courtWebsite: 'https://www.lasc.org',
    courtLocatorUrl: 'https://www.lasc.org/links/La_Links.asp#dc',
    localRulesNote: 'Each judicial district court has its own local rules.',
  },
  'ME': {
    state: 'ME',
    stateName: 'Maine',
    courtWebsite: 'https://www.courts.maine.gov',
    courtLocatorUrl: 'https://www.courts.maine.gov/courts/index.shtml',
    localRulesNote: 'Contact your district or superior court for local procedures.',
  },
  'MD': {
    state: 'MD',
    stateName: 'Maryland',
    courtWebsite: 'https://www.mdcourts.gov',
    courtLocatorUrl: 'https://www.mdcourts.gov/circuit',
    localRulesNote: 'Each county circuit court has local rules. Check your court website.',
  },
  'MA': {
    state: 'MA',
    stateName: 'Massachusetts',
    courtWebsite: 'https://www.mass.gov/courts',
    courtLocatorUrl: 'https://www.mass.gov/orgs/trial-court',
    localRulesNote: 'Check with your district or superior court for local standing orders.',
  },
  'MI': {
    state: 'MI',
    stateName: 'Michigan',
    courtWebsite: 'https://courts.michigan.gov',
    courtLocatorUrl: 'https://courts.michigan.gov/Courts/trialcourts/Pages/default.aspx',
    localRulesNote: 'Each county circuit court has local administrative orders.',
  },
  'MN': {
    state: 'MN',
    stateName: 'Minnesota',
    courtWebsite: 'https://www.mncourts.gov',
    courtLocatorUrl: 'https://www.mncourts.gov/Find-Courts.aspx',
    localRulesNote: 'Each district has its own local rules and practices.',
  },
  'MS': {
    state: 'MS',
    stateName: 'Mississippi',
    courtWebsite: 'https://courts.ms.gov',
    courtLocatorUrl: 'https://courts.ms.gov/trialcourts/circuitcourt/circuitcourt.php',
    localRulesNote: 'Contact your circuit or county court for local procedures.',
  },
  'MO': {
    state: 'MO',
    stateName: 'Missouri',
    courtWebsite: 'https://www.courts.mo.gov',
    courtLocatorUrl: 'https://www.courts.mo.gov/page.jsp?id=233',
    localRulesNote: 'Each circuit has local court rules. Check with your circuit clerk.',
  },
  'MT': {
    state: 'MT',
    stateName: 'Montana',
    courtWebsite: 'https://courts.mt.gov',
    courtLocatorUrl: 'https://courts.mt.gov/courts/district',
    localRulesNote: 'Each judicial district has its own local rules.',
  },
  'NE': {
    state: 'NE',
    stateName: 'Nebraska',
    courtWebsite: 'https://supremecourt.nebraska.gov',
    courtLocatorUrl: 'https://supremecourt.nebraska.gov/courts/district-courts',
    localRulesNote: 'Check with your judicial district for local court rules.',
  },
  'NV': {
    state: 'NV',
    stateName: 'Nevada',
    courtWebsite: 'https://nvcourts.gov',
    courtLocatorUrl: 'https://nvcourts.gov/Find_a_Court/',
    localRulesNote: 'Each judicial district has its own local rules.',
  },
  'NH': {
    state: 'NH',
    stateName: 'New Hampshire',
    courtWebsite: 'https://www.courts.nh.gov',
    courtLocatorUrl: 'https://www.courts.nh.gov/our-courts',
    localRulesNote: 'Check with your circuit or superior court for local procedures.',
  },
  'NJ': {
    state: 'NJ',
    stateName: 'New Jersey',
    courtWebsite: 'https://www.njcourts.gov',
    courtLocatorUrl: 'https://www.njcourts.gov/courts/vicinage-directory',
    localRulesNote: 'Each vicinage has local practice rules. Check your county courthouse.',
  },
  'NM': {
    state: 'NM',
    stateName: 'New Mexico',
    courtWebsite: 'https://www.nmcourts.gov',
    courtLocatorUrl: 'https://www.nmcourts.gov/district-courts.aspx',
    localRulesNote: 'Each judicial district has its own local rules.',
  },
  'NY': {
    state: 'NY',
    stateName: 'New York',
    courtWebsite: 'https://www.nycourts.gov',
    courtLocatorUrl: 'https://www.nycourts.gov/courts/',
    localRulesNote: 'Court rules vary by county and court type. Check your local court website.',
  },
  'NC': {
    state: 'NC',
    stateName: 'North Carolina',
    courtWebsite: 'https://www.nccourts.gov',
    courtLocatorUrl: 'https://www.nccourts.gov/locations',
    localRulesNote: 'Each judicial district may have local rules. Contact your clerk of court.',
  },
  'ND': {
    state: 'ND',
    stateName: 'North Dakota',
    courtWebsite: 'https://www.ndcourts.gov',
    courtLocatorUrl: 'https://www.ndcourts.gov/district-court',
    localRulesNote: 'North Dakota has uniform statewide rules with some local variations.',
  },
  'OH': {
    state: 'OH',
    stateName: 'Ohio',
    courtWebsite: 'https://www.ohiocourts.gov',
    courtLocatorUrl: 'https://www.ohiocourts.gov/courts/courts-overview',
    localRulesNote: 'Each county common pleas court has its own local rules.',
  },
  'OK': {
    state: 'OK',
    stateName: 'Oklahoma',
    courtWebsite: 'https://www.oscn.net',
    courtLocatorUrl: 'https://www.oscn.net/applications/oscn/index.asp?level=1&ftdb=STOKCS',
    localRulesNote: 'Check with your district court for local rules and procedures.',
  },
  'OR': {
    state: 'OR',
    stateName: 'Oregon',
    courtWebsite: 'https://www.courts.oregon.gov',
    courtLocatorUrl: 'https://www.courts.oregon.gov/courts/Pages/default.aspx',
    localRulesNote: 'Each judicial district has supplementary local rules.',
  },
  'PA': {
    state: 'PA',
    stateName: 'Pennsylvania',
    courtWebsite: 'https://www.pacourts.us',
    courtLocatorUrl: 'https://www.pacourts.us/courts/courts-of-common-pleas',
    localRulesNote: 'Each county court of common pleas has its own local rules.',
  },
  'RI': {
    state: 'RI',
    stateName: 'Rhode Island',
    courtWebsite: 'https://www.courts.ri.gov',
    courtLocatorUrl: 'https://www.courts.ri.gov/Courts/Pages/default.aspx',
    localRulesNote: 'Rhode Island has a unified court system with statewide rules.',
  },
  'SC': {
    state: 'SC',
    stateName: 'South Carolina',
    courtWebsite: 'https://www.sccourts.org',
    courtLocatorUrl: 'https://www.sccourts.org/courtLocator/',
    localRulesNote: 'Each judicial circuit may have local rules. Contact your clerk of court.',
  },
  'SD': {
    state: 'SD',
    stateName: 'South Dakota',
    courtWebsite: 'https://ujs.sd.gov',
    courtLocatorUrl: 'https://ujs.sd.gov/Circuit_Court/default.aspx',
    localRulesNote: 'South Dakota has uniform statewide court rules.',
  },
  'TN': {
    state: 'TN',
    stateName: 'Tennessee',
    courtWebsite: 'https://www.tncourts.gov',
    courtLocatorUrl: 'https://www.tncourts.gov/courts',
    localRulesNote: 'Each judicial district has its own local rules.',
  },
  'TX': {
    state: 'TX',
    stateName: 'Texas',
    courtWebsite: 'https://www.txcourts.gov',
    courtLocatorUrl: 'https://www.txcourts.gov/courts/',
    localRulesNote: 'Each county district court has its own local rules. Check with your court clerk.',
  },
  'UT': {
    state: 'UT',
    stateName: 'Utah',
    courtWebsite: 'https://www.utcourts.gov',
    courtLocatorUrl: 'https://www.utcourts.gov/courts/',
    localRulesNote: 'Utah has a unified court system. Check your district court for local procedures.',
  },
  'VT': {
    state: 'VT',
    stateName: 'Vermont',
    courtWebsite: 'https://www.vermontjudiciary.org',
    courtLocatorUrl: 'https://www.vermontjudiciary.org/court-locations',
    localRulesNote: 'Vermont has a unified court system with statewide rules.',
  },
  'VA': {
    state: 'VA',
    stateName: 'Virginia',
    courtWebsite: 'https://www.vacourts.gov',
    courtLocatorUrl: 'https://www.vacourts.gov/courts/circuit/home.html',
    localRulesNote: 'Each circuit court may have local rules. Contact your circuit clerk.',
  },
  'WA': {
    state: 'WA',
    stateName: 'Washington',
    courtWebsite: 'https://www.courts.wa.gov',
    courtLocatorUrl: 'https://www.courts.wa.gov/court_dir/',
    localRulesNote: 'Each county superior court has its own local rules.',
  },
  'WV': {
    state: 'WV',
    stateName: 'West Virginia',
    courtWebsite: 'https://www.courtswv.gov',
    courtLocatorUrl: 'https://www.courtswv.gov/lower-courts/circuit-courts',
    localRulesNote: 'Each circuit court may have local rules. Contact your circuit clerk.',
  },
  'WI': {
    state: 'WI',
    stateName: 'Wisconsin',
    courtWebsite: 'https://www.wicourts.gov',
    courtLocatorUrl: 'https://www.wicourts.gov/courts/circuit/index.htm',
    localRulesNote: 'Each county circuit court has local court rules.',
  },
  'WY': {
    state: 'WY',
    stateName: 'Wyoming',
    courtWebsite: 'https://www.courts.state.wy.us',
    courtLocatorUrl: 'https://www.courts.state.wy.us/court-information/district-courts/',
    localRulesNote: 'Each judicial district has its own local rules.',
  },
  'FED': {
    state: 'FED',
    stateName: 'Federal',
    courtWebsite: 'https://www.uscourts.gov',
    courtLocatorUrl: 'https://www.uscourts.gov/about-federal-courts/federal-courts-public/court-website-links',
    localRulesNote: 'Each federal district court has its own local rules. Check your district court website.',
  },
};

export function getStateCourtInfo(stateCode: string): StateCourtInfo | null {
  const code = stateCode.toUpperCase();
  return stateCourtWebsites[code] || null;
}

export function getCourtLocatorUrl(stateCode: string): string | null {
  const info = getStateCourtInfo(stateCode);
  return info?.courtLocatorUrl || info?.courtWebsite || null;
}

export function getLocalRulesNote(stateCode: string): string {
  const info = getStateCourtInfo(stateCode);
  return info?.localRulesNote || 'Contact your local court for specific deadlines and procedures.';
}
