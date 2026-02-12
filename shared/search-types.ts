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
  'dui': ['dwi', 'drunk driving', 'driving under the influence', 'owi', 'oui', 'impaired driving'],
  'dwi': ['dui', 'drunk driving', 'driving while intoxicated', 'owi', 'oui', 'impaired driving'],
  'assault': ['battery', 'attack', 'physical harm'],
  'battery': ['assault', 'attack', 'physical contact'],
  'theft': ['larceny', 'stealing', 'robbery', 'burglary'],
  'larceny': ['theft', 'stealing', 'robbery'],
  'robbery': ['theft', 'mugging', 'holdup'],
  'burglary': ['breaking and entering', 'b&e', 'home invasion'],
  'marijuana': ['cannabis', 'weed', 'pot', 'marihuana'],
  'drug': ['controlled substance', 'narcotic', 'illegal substance'],
  'expungement': ['expunction', 'record clearing', 'record sealing', 'dismissal'],
  'bail': ['bond', 'release', 'bail bond'],
  'arraignment': ['first appearance', 'initial appearance'],
  'plea': ['guilty plea', 'not guilty', 'plea bargain', 'plea deal'],
  'probation': ['supervised release', 'community supervision'],
  'parole': ['early release', 'supervised release'],
  'felony': ['serious crime', 'major offense'],
  'misdemeanor': ['minor offense', 'petty crime'],
  'attorney': ['lawyer', 'counsel', 'legal representation', 'public defender'],
  'lawyer': ['attorney', 'counsel', 'legal representation'],
  'warrant': ['arrest warrant', 'bench warrant', 'search warrant'],
  'miranda': ['miranda rights', 'right to remain silent', 'miranda warning'],
  'diversion': ['diversion program', 'alternative sentencing', 'pretrial diversion'],
  'immigration': ['deportation', 'removal', 'ice', 'immigration enforcement'],
  'deportation': ['removal', 'immigration', 'ice detention'],
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
