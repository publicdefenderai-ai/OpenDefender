export type SearchContentType =
  | 'glossary'
  | 'charge'
  | 'diversion_program'
  | 'expungement'
  | 'legal_resource'
  | 'court'
  | 'mock_qa'
  | 'rights_info';

export interface SearchDocument {
  id: string;
  type: SearchContentType;
  title: string;
  titleEs?: string;
  titleZh?: string;
  content: string;
  contentEs?: string;
  contentZh?: string;
  tags: string[];
  aliases: string[];
  headings?: string[];
  jurisdiction?: string;
  url: string;
  score?: number;
}

export interface SearchResult {
  document: SearchDocument;
  score: number;
  highlights: {
    field: string;
    snippet: string;
  }[];
  matchedTerms: string[];
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
  totalCount: number;
  groupedResults: Record<SearchContentType, SearchResult[]>;
  suggestions: string[];
  searchTimeMs: number;
  correctedQuery?: string;
}

export interface SearchQuery {
  query: string;
  language: 'en' | 'es' | 'zh';
  filters?: {
    types?: SearchContentType[];
    jurisdiction?: string;
  };
  limit?: number;
  offset?: number;
}

export const LEGAL_SYNONYMS: Record<string, string[]> = {
  // DUI/DWI
  'dui': ['dwi', 'drunk driving', 'driving under the influence', 'owi', 'oui', 'impaired driving'],
  'dwi': ['dui', 'drunk driving', 'driving while intoxicated', 'owi', 'oui', 'impaired driving'],
  // Violent offenses
  'assault': ['battery', 'attack', 'physical harm', 'aggravated assault', 'simple assault'],
  'battery': ['assault', 'attack', 'physical contact'],
  // Property offenses AND property recovery (seized belongings, getting property back)
  // Also links to Fourth Amendment protections — scored at synonym weight so they
  // appear in results but don't outrank the primary property-retrieval page.
  'property': ['seized property', 'personal property', 'return property', 'get property back', 'property retrieval', 'property recovery', 'evidence unit', 'property crime', 'confiscated', 'fourth amendment', 'search and seizure', 'police search'],
  'belongings': ['property', 'personal property', 'seized property', 'possessions', 'property retrieval', 'evidence unit', 'get belongings back'],
  'seized': ['seized property', 'property retrieval', 'evidence unit', 'confiscated', 'taken by police', 'police took', 'property return'],
  'confiscated': ['seized property', 'property retrieval', 'taken by police', 'evidence unit'],
  'possessions': ['property', 'belongings', 'personal property', 'seized property', 'property retrieval'],
  'theft': ['larceny', 'stealing', 'robbery', 'burglary', 'shoplifting'],
  'larceny': ['theft', 'stealing', 'robbery'],
  'robbery': ['theft', 'mugging', 'holdup', 'armed robbery'],
  'burglary': ['breaking and entering', 'b&e', 'home invasion'],
  'shoplifting': ['theft', 'retail theft', 'larceny'],
  // Drugs
  'marijuana': ['cannabis', 'weed', 'pot', 'marihuana'],
  'drug': ['controlled substance', 'narcotic', 'illegal substance', 'substance'],
  'substance': ['drug', 'controlled substance', 'substance abuse', 'addiction'],
  'addiction': ['substance abuse', 'drug treatment', 'alcohol treatment', 'rehabilitation'],
  // Record clearing
  'expungement': ['expunction', 'record clearing', 'record sealing', 'expunge', 'clear record', 'seal record'],
  'expunge': ['expungement', 'expunction', 'record clearing', 'clear record', 'seal record'],
  'seal': ['record sealing', 'expungement', 'sealing records', 'clear record'],
  'record': ['criminal record', 'background check', 'rap sheet', 'expungement', 'record clearing'],
  'background': ['background check', 'criminal record', 'expungement', 'record'],
  // Bail / release
  'bail': ['bond', 'release', 'bail bond', 'pretrial release'],
  'bond': ['bail', 'bail bond', 'release'],
  'release': ['bail', 'bond', 'pretrial release', 'released from custody'],
  // Court proceedings
  'arraignment': ['first appearance', 'initial appearance', 'first court date'],
  'plea': ['guilty plea', 'not guilty', 'plea bargain', 'plea deal', 'plead guilty'],
  'sentencing': ['sentence', 'prison sentence', 'jail time', 'punishment', 'guidelines'],
  'sentence': ['sentencing', 'prison', 'jail', 'punishment', 'penalty'],
  'continuance': ['postpone', 'delay hearing', 'continue case', 'motion to continue'],
  'postpone': ['continuance', 'motion to continue', 'delay'],
  'dismiss': ['motion to dismiss', 'charges dropped', 'case dismissed', 'dropped charges'],
  'suppress': ['motion to suppress', 'exclude evidence', 'fourth amendment'],
  'evidence': ['suppress evidence', 'exclude evidence', 'motion to suppress'],
  // Supervision
  'probation': ['supervised release', 'community supervision', 'probation violation'],
  'parole': ['early release', 'supervised release', 'parole violation'],
  // Offense levels
  'felony': ['serious crime', 'major offense', 'felony charge'],
  'misdemeanor': ['minor offense', 'petty crime', 'misdemeanor charge'],
  // Attorneys
  'attorney': ['lawyer', 'counsel', 'legal representation', 'public defender'],
  'lawyer': ['attorney', 'counsel', 'legal representation', 'public defender'],
  'counsel': ['attorney', 'lawyer', 'public defender', 'right to counsel'],
  // Warrants
  'warrant': ['arrest warrant', 'bench warrant', 'search warrant', 'judicial warrant'],
  // Miranda / rights to silence
  'miranda': ['miranda rights', 'right to remain silent', 'miranda warning', 'fifth amendment'],
  'silent': ['right to remain silent', 'miranda', 'fifth amendment', 'plead the fifth'],
  'silence': ['right to remain silent', 'miranda', 'fifth amendment'],
  'remain': ['right to remain silent', 'miranda'],
  // Search and seizure
  'search': ['search and seizure', 'police search', 'fourth amendment', 'warrant'],
  'seizure': ['search and seizure', 'property seized', 'fourth amendment'],
  'consent': ['consent search', 'right to refuse', 'refuse search', 'fourth amendment'],
  'refuse': ['right to refuse', 'refuse search', 'consent search'],
  // Phone / digital
  'phone': ['cell phone', 'cellphone', 'mobile phone', 'digital device', 'smartphone'],
  'cell': ['cell phone', 'mobile phone', 'phone', 'cellphone'],
  'digital': ['digital privacy', 'phone', 'cell phone', 'electronic device'],
  'passcode': ['phone search', 'digital privacy', 'biometric', 'fingerprint', 'pin'],
  // Stop and frisk / traffic
  'stop': ['stop and frisk', 'terry stop', 'police stop', 'traffic stop', 'police encounter'],
  'frisk': ['stop and frisk', 'pat down', 'pat-down', 'search person', 'terry stop'],
  'traffic': ['traffic stop', 'vehicle stop', 'pulled over', 'car stop'],
  'vehicle': ['car', 'traffic stop', 'vehicle search', 'automobile'],
  'car': ['vehicle', 'traffic stop', 'vehicle search', 'automobile'],
  // Home search
  'home': ['house', 'residence', 'home search', 'apartment', 'fourth amendment'],
  'house': ['home', 'residence', 'dwelling', 'home search'],
  'apartment': ['housing', 'rent', 'landlord', 'residence'],
  // Arrest / detention
  'arrest': ['arrested', 'being arrested', 'police arrest', 'custody', 'taken into custody'],
  'arrested': ['arrest', 'in custody', 'taken into custody', 'booked'],
  'detained': ['detention', 'in custody', 'arrested', 'held', 'ice detention'],
  'detention': ['detained', 'immigration detention', 'in custody', 'jail', 'ice detention'],
  // Diversion / alternative programs
  'diversion': ['diversion program', 'alternative sentencing', 'pretrial diversion', 'drug court'],
  'alternative': ['diversion', 'diversion program', 'alternative sentencing'],
  // Immigration
  'immigration': ['deportation', 'removal', 'ice', 'immigration enforcement', 'undocumented'],
  'deportation': ['removal', 'immigration', 'ice detention', 'deported'],
  'deport': ['deportation', 'removal', 'ice', 'immigration'],
  'undocumented': ['immigration', 'unauthorized', 'ice', 'deportation'],
  'ice': ['immigration enforcement', 'deportation', 'detention', 'immigration'],
  // Support resources
  'job': ['employment', 'work', 'career', 'jobs', 'hire', 'second chance hiring', 'ban the box'],
  'work': ['employment', 'job', 'career', 'jobs', 'hire', 'workforce'],
  'employed': ['employment', 'job', 'work', 'career', 'hiring'],
  'fired': ['employment', 'termination', 'laid off', 'job loss'],
  'housing': ['shelter', 'apartment', 'rent', 'landlord', 'eviction', 'homelessness', 'fair chance housing', 'reentry housing'],
  'rent': ['housing', 'landlord', 'apartment', 'tenant', 'eviction'],
  'evict': ['eviction', 'landlord', 'housing', 'tenant'],
  'eviction': ['landlord', 'housing court', 'tenant', 'housing'],
  'homeless': ['housing', 'shelter', 'eviction', 'homelessness', 'transitional housing'],
  'shelter': ['housing', 'homeless shelter', 'transitional housing'],
  'mental': ['mental health', 'counseling', 'therapy', 'psychiatry', 'stress', 'anxiety'],
  'therapy': ['mental health', 'counseling', 'therapist', 'psychiatric'],
  'counseling': ['mental health', 'therapy', 'counselor', 'psychiatric'],
  'childcare': ['child care', 'babysitter', 'daycare', 'children', 'kids during court'],
  'transportation': ['rides', 'transit', 'bus', 'court transportation', 'ride to court'],
  'visitation': ['prison visitation', 'jail visitation', 'visiting hours', 'visit incarcerated'],
  'benefits': ['government benefits', 'snap', 'medicaid', 'tanf', 'welfare', 'assistance', 'financial assistance'],
  'reentry': ['re-entry', 'after prison', 'after jail', 'post-conviction', 'coming home', 'second chance'],
  // Financial / fees
  'fines': ['court fees', 'court costs', 'financial penalty', 'pay fines', 'financial support', 'financial assistance', 'fees', 'money owed'],
  'fees': ['court fees', 'fines', 'court costs', 'financial assistance', 'financial support', 'money'],
  'finances': ['financial support', 'money', 'fines', 'fees', 'court costs', 'benefits', 'bail fund', 'financial assistance'],
  'financial': ['finances', 'money', 'fines', 'fees', 'court costs', 'financial support'],
  'money': ['finances', 'financial support', 'bail', 'fines', 'fees', 'court costs'],
  'costs': ['court fees', 'court costs', 'fines', 'financial', 'money'],
  // Health
  'health': ['mental health', 'healthcare', 'medical', 'personal health', 'physical health'],
  'medical': ['health', 'healthcare', 'insurance', 'personal health', 'free clinic', 'medicaid'],
  'healthcare': ['health', 'medical', 'insurance', 'medicaid', 'free clinic'],
  // Collateral consequences
  'collateral': ['collateral consequences', 'conviction effects', 'criminal record effects', 'felony consequences', 'hidden penalties'],
  'consequences': ['collateral consequences', 'conviction effects', 'criminal record', 'penalties', 'felony consequences'],
  'conviction': ['convicted', 'criminal record', 'collateral consequences', 'felony', 'misdemeanor', 'expungement'],
  'convicted': ['conviction', 'criminal record', 'expungement', 'collateral consequences'],
  'license': ['professional license', 'occupational license', 'collateral consequences', 'conviction effects'],
  'voting': ['voting rights', 'felony disenfranchisement', 'collateral consequences', 'election'],
  // Family / kids
  'children': ['child', 'kids', 'childcare', 'family', 'parental rights', 'custody'],
  'family': ['children', 'kids', 'family care', 'visitation', 'parental rights', 'family support'],
  'custody': ['child custody', 'parental rights', 'family', 'children', 'collateral consequences'],
  // Support general
  'support': ['resources', 'help', 'assistance', 'support resources', 'services', 'reentry'],
  'resources': ['support', 'help', 'assistance', 'legal resources', 'services'],
  'help': ['support', 'resources', 'assistance', 'legal help', 'services'],
  'assistance': ['support', 'resources', 'help', 'financial assistance', 'services'],
};

export const CONTENT_TYPE_LABELS: Record<SearchContentType, { en: string; es: string; zh: string }> = {
  glossary: { en: 'Legal Terms', es: 'Términos Legales', zh: '法律术语' },
  charge: { en: 'Criminal Charges', es: 'Cargos Criminales', zh: '刑事指控' },
  diversion_program: { en: 'Diversion Programs', es: 'Programas de Diversión', zh: '转移计划' },
  expungement: { en: 'Expungement', es: 'Eliminación de Antecedentes', zh: '记录清除' },
  legal_resource: { en: 'Legal Resources', es: 'Recursos Legales', zh: '法律资源' },
  court: { en: 'Court Information', es: 'Información del Tribunal', zh: '法院信息' },
  mock_qa: { en: 'Court Preparation', es: 'Preparación para el Tribunal', zh: '法庭准备' },
  rights_info: { en: 'Know Your Rights', es: 'Conozca Sus Derechos', zh: '了解您的权利' },
};
