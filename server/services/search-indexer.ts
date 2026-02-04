import type { SearchDocument, SearchContentType, SearchQuery, SearchResult, SearchResponse } from "@shared/search-types";
import { LEGAL_SYNONYMS } from "@shared/search-types";
import { legalGlossaryTerms } from "../../client/src/lib/legal-glossary-data";
import { diversionPrograms } from "../../client/src/lib/diversion-programs-data";
import { expungementRules } from "../../client/src/lib/expungement-data";
import { criminalCharges } from "@shared/criminal-charges";
import { GENERIC_MOCK_QA, PROCEEDING_LABELS, type ProceedingType } from "@shared/mock-qa";
import { devLog } from "../utils/dev-logger";

let searchIndex: SearchDocument[] = [];
let indexReady = false;

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function expandSynonyms(query: string): string[] {
  const normalized = normalizeText(query);
  const words = normalized.split(' ');
  const expanded: string[] = [normalized];
  const seen = new Set<string>([normalized]);
  
  for (const word of words) {
    const synonyms = LEGAL_SYNONYMS[word];
    if (synonyms) {
      for (const syn of synonyms) {
        const replacement = normalized.replace(word, syn);
        if (!seen.has(replacement)) {
          expanded.push(replacement);
          seen.add(replacement);
        }
        if (!seen.has(syn)) {
          expanded.push(syn);
          seen.add(syn);
        }
      }
    }
  }
  
  return expanded;
}

function calculateScore(doc: SearchDocument, queryTerms: string[], language: 'en' | 'es'): { score: number; matchedTerms: string[] } {
  let score = 0;
  const matchedTerms: string[] = [];
  const title = language === 'es' && doc.titleEs ? doc.titleEs : doc.title;
  const content = language === 'es' && doc.contentEs ? doc.contentEs : doc.content;
  const normalizedTitle = normalizeText(title);
  const normalizedContent = normalizeText(content);
  const normalizedAliases = doc.aliases.map(a => normalizeText(a));
  const normalizedTags = doc.tags.map(t => normalizeText(t));

  for (const term of queryTerms) {
    const normalizedTerm = normalizeText(term);
    
    if (normalizedTitle === normalizedTerm) {
      score += 100;
      matchedTerms.push(term);
    } else if (normalizedTitle.includes(normalizedTerm)) {
      score += 50;
      matchedTerms.push(term);
    }
    
    if (normalizedAliases.some(a => a === normalizedTerm)) {
      score += 80;
      matchedTerms.push(term);
    } else if (normalizedAliases.some(a => a.includes(normalizedTerm))) {
      score += 40;
      matchedTerms.push(term);
    }
    
    if (normalizedTags.some(t => t === normalizedTerm)) {
      score += 30;
      matchedTerms.push(term);
    }
    
    if (normalizedContent.includes(normalizedTerm)) {
      const occurrences = (normalizedContent.match(new RegExp(normalizedTerm, 'g')) || []).length;
      score += Math.min(occurrences * 5, 25);
      matchedTerms.push(term);
    }
  }

  const typeBoosts: Record<SearchContentType, number> = {
    glossary: 1.2,
    charge: 1.3,
    diversion_program: 1.1,
    expungement: 1.1,
    legal_resource: 1.0,
    court: 0.9,
    mock_qa: 0.8,
    rights_info: 1.15,
  };
  score *= typeBoosts[doc.type] || 1;

  return { score, matchedTerms: Array.from(new Set(matchedTerms)) };
}

function generateHighlight(text: string, terms: string[], maxLength: number = 150): string {
  const normalizedText = text.toLowerCase();
  let bestStart = 0;
  let bestScore = 0;

  for (let i = 0; i < text.length - maxLength; i += 20) {
    const chunk = normalizedText.slice(i, i + maxLength);
    let chunkScore = 0;
    for (const term of terms) {
      if (chunk.includes(normalizeText(term))) {
        chunkScore++;
      }
    }
    if (chunkScore > bestScore) {
      bestScore = chunkScore;
      bestStart = i;
    }
  }

  let snippet = text.slice(bestStart, bestStart + maxLength);
  if (bestStart > 0) snippet = '...' + snippet;
  if (bestStart + maxLength < text.length) snippet += '...';

  return snippet;
}

export function buildSearchIndex(): void {
  devLog('search', 'Building search index...');
  const startTime = Date.now();
  const documents: SearchDocument[] = [];

  for (const term of legalGlossaryTerms) {
    documents.push({
      id: `glossary-${term.id}`,
      type: 'glossary',
      title: term.term,
      content: term.definition,
      tags: term.tags || [],
      aliases: term.aliases || [],
      url: `/legal-glossary#${term.slug}`,
    });
  }
  devLog('search', `Indexed ${legalGlossaryTerms.length} glossary terms`);

  for (const charge of criminalCharges) {
    documents.push({
      id: `charge-${charge.id}`,
      type: 'charge',
      title: charge.name,
      titleEs: charge.nameEs,
      content: `${charge.description}. Common defenses: ${charge.commonDefenses.join(', ')}. Maximum penalty: ${charge.maxPenalty}`,
      contentEs: charge.descriptionEs,
      tags: [charge.category, charge.jurisdiction],
      aliases: [],
      jurisdiction: charge.jurisdiction,
      url: `/case-guidance?charge=${encodeURIComponent(charge.name)}`,
    });
  }
  devLog('search', `Indexed ${criminalCharges.length} criminal charges`);

  for (const program of diversionPrograms) {
    documents.push({
      id: `diversion-${program.id}`,
      type: 'diversion_program',
      title: program.name,
      content: `${program.name} in ${program.county || program.state}. Program types: ${program.programTypes.join(', ')}. ${program.eligibilityNotes || ''}`,
      tags: [...program.programTypes, program.state, program.jurisdictionType],
      aliases: [],
      jurisdiction: program.state,
      url: `/diversion-programs#${program.id}`,
    });
  }
  devLog('search', `Indexed ${diversionPrograms.length} diversion programs`);

  for (const rule of expungementRules) {
    const exclusions = rule.exclusions || [];
    const conditions = rule.conditions || [];
    documents.push({
      id: `expungement-${rule.id}`,
      type: 'expungement',
      title: `${rule.state} Expungement Rules`,
      content: `${rule.overview}. Exclusions: ${exclusions.join(', ')}. Conditions: ${conditions.join(', ')}`,
      tags: ['expungement', 'record clearing', rule.state],
      aliases: ['expunction', 'record sealing', 'record clearing'],
      jurisdiction: rule.state,
      url: `/record-expungement#${rule.state.toLowerCase().replace(/\s+/g, '-')}`,
    });
  }
  devLog('search', `Indexed ${expungementRules.length} expungement rules`);

  const proceedingGroups = new Map<string, { label: typeof PROCEEDING_LABELS[ProceedingType], tags: string[], count: number }>();
  for (const qa of GENERIC_MOCK_QA) {
    const proceedingType = qa.proceedingType as ProceedingType;
    const existing = proceedingGroups.get(proceedingType);
    if (existing) {
      existing.tags.push(...(qa.tags || []));
      existing.count++;
    } else {
      proceedingGroups.set(proceedingType, {
        label: PROCEEDING_LABELS[proceedingType],
        tags: [qa.proceedingType, qa.casePhase, ...(qa.tags || [])],
        count: 1
      });
    }
  }
  
  Array.from(proceedingGroups.entries()).forEach(([proceedingType, group]) => {
    documents.push({
      id: `mockqa-${proceedingType}`,
      type: 'mock_qa',
      title: `${group.label.en} Preparation`,
      titleEs: `Preparación para ${group.label.es}`,
      content: `Practice questions and answers to prepare for your ${group.label.en}. Includes ${group.count} sample questions covering what the judge may ask.`,
      contentEs: `Preguntas y respuestas de práctica para prepararse para su ${group.label.es}. Incluye ${group.count} preguntas de ejemplo.`,
      tags: Array.from(new Set(group.tags)),
      aliases: [],
      url: `/process?proceeding=${proceedingType}`,
    });
  });
  devLog('search', `Indexed ${proceedingGroups.size} mock QA proceeding types`);

  const rightsPages = [
    { id: 'miranda', title: 'Miranda Rights', titleEs: 'Derechos Miranda', content: 'Your right to remain silent. Anything you say can be used against you. Right to an attorney. If you cannot afford one, one will be provided.', url: '/rights-info#miranda' },
    { id: 'search-seizure', title: 'Search and Seizure Rights', titleEs: 'Derechos de Registro e Incautación', content: 'Fourth Amendment protections against unreasonable searches. When police can search. Your right to refuse consent.', url: '/search-seizure' },
    { id: 'attorney', title: 'Right to an Attorney', titleEs: 'Derecho a un Abogado', content: 'Sixth Amendment right to counsel. Public defender eligibility. When to request an attorney.', url: '/rights-info#attorney' },
    { id: 'speedy-trial', title: 'Right to a Speedy Trial', titleEs: 'Derecho a un Juicio Rápido', content: 'Sixth Amendment speedy trial rights. Time limits for prosecution.', url: '/rights-info#speedy-trial' },
    { id: 'jury', title: 'Right to a Jury Trial', titleEs: 'Derecho a un Juicio con Jurado', content: 'Sixth Amendment right to trial by jury. When jury trial is available.', url: '/rights-info#jury' },
  ];
  
  for (const page of rightsPages) {
    documents.push({
      id: `rights-${page.id}`,
      type: 'rights_info',
      title: page.title,
      titleEs: page.titleEs,
      content: page.content,
      tags: ['rights', 'constitution', 'legal rights'],
      aliases: [],
      url: page.url,
    });
  }
  devLog('search', `Indexed ${rightsPages.length} rights info pages`);

  const immigrationPages = [
    { 
      id: 'know-your-rights', 
      title: 'Immigration Know Your Rights', 
      titleEs: 'Conozca Sus Derechos de Inmigración',
      content: 'Know your rights during ICE encounters. Judicial warrants vs administrative warrants. You have the right to remain silent. Do not open the door without a judicial warrant signed by a judge. Administrative warrants (Form I-200, I-205) do not allow entry into your home. Ask to see the warrant through the window or slipped under the door.',
      tags: ['immigration', 'ICE', 'warrant', 'judicial warrant', 'administrative warrant', 'rights'],
      aliases: ['ICE raid', 'immigration enforcement', 'deportation'],
      url: '/immigration-guidance/know-your-rights'
    },
    {
      id: 'workplace-raids',
      title: 'Workplace Raids',
      titleEs: 'Redadas en el Lugar de Trabajo',
      content: 'What to do during a workplace ICE raid. Your rights at work. Do not run. Remain calm. You have the right to remain silent. Do not sign anything without an attorney.',
      tags: ['immigration', 'ICE', 'workplace', 'raid', 'employer'],
      aliases: ['ICE raid', 'work raid'],
      url: '/immigration-guidance/workplace-raids'
    },
    {
      id: 'daca-tps',
      title: 'DACA and TPS Information',
      titleEs: 'Información sobre DACA y TPS',
      content: 'Deferred Action for Childhood Arrivals (DACA) and Temporary Protected Status (TPS). Eligibility requirements, renewal process, and current status updates.',
      tags: ['immigration', 'DACA', 'TPS', 'dreamers', 'work permit'],
      aliases: ['dreamers', 'deferred action', 'temporary protected status'],
      url: '/immigration-guidance/daca-tps'
    },
    {
      id: 'bond-hearings',
      title: 'Immigration Bond Hearings',
      titleEs: 'Audiencias de Fianza de Inmigración',
      content: 'Immigration bond hearing process. How to request bond. Factors judges consider. Preparing for your bond hearing.',
      tags: ['immigration', 'bond', 'detention', 'hearing', 'release'],
      aliases: ['immigration bail', 'detention release'],
      url: '/immigration-guidance/bond-hearings'
    },
    {
      id: 'family-planning',
      title: 'Family Immigration Planning',
      titleEs: 'Planificación Familiar de Inmigración',
      content: 'Emergency family planning for immigration enforcement. Power of attorney. Childcare arrangements. Document preparation.',
      tags: ['immigration', 'family', 'children', 'emergency plan'],
      aliases: ['family separation', 'child custody'],
      url: '/immigration-guidance/family-planning'
    },
    {
      id: 'find-attorney',
      title: 'Find an Immigration Attorney',
      titleEs: 'Encontrar un Abogado de Inmigración',
      content: 'How to find free or low-cost immigration legal help. Legal aid organizations. Pro bono attorneys. Avoiding notario fraud.',
      tags: ['immigration', 'attorney', 'lawyer', 'legal aid'],
      aliases: ['immigration lawyer', 'legal help'],
      url: '/immigration-guidance/find-attorney'
    },
    {
      id: 'find-detained',
      title: 'Find a Detained Person',
      titleEs: 'Encontrar a una Persona Detenida',
      content: 'How to locate someone in immigration detention. ICE detainee locator. Detention facility information. Visitation rights.',
      tags: ['immigration', 'detention', 'ICE', 'locator'],
      aliases: ['ICE detention', 'detained immigrant'],
      url: '/immigration-guidance/find-detained'
    },
    {
      id: 'raids-toolkit',
      title: 'ICE Raids Toolkit',
      titleEs: 'Kit de Herramientas para Redadas de ICE',
      content: 'Complete toolkit for ICE raid preparation. Red cards. Emergency contacts. Family safety plan. Community rapid response.',
      tags: ['immigration', 'ICE', 'raid', 'emergency', 'toolkit'],
      aliases: ['raid preparation', 'ICE enforcement'],
      url: '/immigration-guidance/raids-toolkit'
    },
  ];

  for (const page of immigrationPages) {
    documents.push({
      id: `immigration-${page.id}`,
      type: 'rights_info',
      title: page.title,
      titleEs: page.titleEs,
      content: page.content,
      tags: page.tags,
      aliases: page.aliases,
      url: page.url,
    });
  }
  devLog('search', `Indexed ${immigrationPages.length} immigration guidance pages`);

  const sitePages = [
    {
      id: 'home',
      title: 'Public Defender AI - Legal Guidance',
      titleEs: 'Defensor Público AI - Orientación Legal',
      content: 'Free legal guidance and rights information. AI-powered assistance for criminal defense. Know your rights. Find legal resources.',
      tags: ['home', 'legal aid', 'public defender', 'rights'],
      aliases: ['main', 'start'],
      url: '/'
    },
    {
      id: 'rights-info',
      title: 'Know Your Rights',
      titleEs: 'Conozca Sus Derechos',
      content: 'Understanding your constitutional rights. Miranda rights. Right to remain silent. Right to an attorney. Protection against unreasonable searches.',
      tags: ['rights', 'constitution', 'miranda', 'attorney'],
      aliases: ['constitutional rights', 'civil rights'],
      url: '/rights-info'
    },
    {
      id: 'court-locator',
      title: 'Court and Resource Locator',
      titleEs: 'Localizador de Tribunales y Recursos',
      content: 'Find courts, legal aid offices, and public defender offices near you. Locate legal resources in your area.',
      tags: ['court', 'locator', 'legal aid', 'public defender'],
      aliases: ['find court', 'courthouse', 'legal help near me'],
      url: '/court-locator'
    },
    {
      id: 'immigration-hub',
      title: 'Immigration Guidance Hub',
      titleEs: 'Centro de Orientación de Inmigración',
      content: 'Comprehensive immigration resources. Know your rights. ICE encounters. DACA and TPS. Finding legal help.',
      tags: ['immigration', 'ICE', 'DACA', 'TPS', 'deportation'],
      aliases: ['immigrant rights', 'undocumented'],
      url: '/immigration-guidance'
    },
    {
      id: 'mission',
      title: 'Our Mission',
      titleEs: 'Nuestra Misión',
      content: 'Public Defender AI mission statement. Democratizing access to legal information. Helping those who cannot afford attorneys.',
      tags: ['mission', 'about', 'purpose'],
      aliases: ['about us', 'who we are'],
      url: '/mission-statement'
    },
    {
      id: 'court-records',
      title: 'Court Records Search',
      titleEs: 'Búsqueda de Registros Judiciales',
      content: 'Search federal court records. PACER and RECAP access. Find case documents and dockets.',
      tags: ['court records', 'PACER', 'RECAP', 'docket', 'case search'],
      aliases: ['case lookup', 'docket search', 'federal courts'],
      url: '/court-records'
    },
    {
      id: 'recap',
      title: 'RECAP Browser Extensions',
      titleEs: 'Extensiones de Navegador RECAP',
      content: 'Free access to federal court documents. RECAP browser extension for Chrome and Firefox. Save money on PACER fees.',
      tags: ['RECAP', 'PACER', 'browser extension', 'free court documents'],
      aliases: ['free PACER', 'court documents'],
      url: '/recap-extensions'
    },
    {
      id: 'friends-family',
      title: 'Resources for Friends and Family',
      titleEs: 'Recursos para Amigos y Familia',
      content: 'How to support a loved one facing charges. Bail information. Court dates. Finding an attorney. Emotional support resources.',
      tags: ['family', 'support', 'loved one', 'bail', 'visiting'],
      aliases: ['help family member', 'loved one arrested'],
      url: '/friends-family'
    },
    {
      id: 'how-to',
      title: 'How to Use This App',
      titleEs: 'Cómo Usar Esta Aplicación',
      content: 'Guide to using Public Defender AI. Getting legal guidance. Understanding your case. Preparing for court.',
      tags: ['guide', 'tutorial', 'help', 'instructions'],
      aliases: ['getting started', 'user guide'],
      url: '/how-to'
    },
    {
      id: 'statutes',
      title: 'Statute Search',
      titleEs: 'Búsqueda de Estatutos',
      content: 'Search federal and state criminal statutes. Find laws by jurisdiction. Penalty information. Legal definitions.',
      tags: ['statutes', 'laws', 'criminal code', 'penalties'],
      aliases: ['criminal law', 'penal code', 'legal code'],
      url: '/statutes'
    },
    {
      id: 'chat',
      title: 'Legal Guidance Chat',
      titleEs: 'Chat de Orientación Legal',
      content: 'Get AI-powered legal guidance. Discuss your situation. Understand your options. Prepare for court proceedings.',
      tags: ['chat', 'guidance', 'AI', 'help', 'advice'],
      aliases: ['talk to AI', 'get help', 'legal advice'],
      url: '/chat'
    },
    {
      id: 'document-library',
      title: 'Legal Document Library',
      titleEs: 'Biblioteca de Documentos Legales',
      content: 'Legal document templates and forms. Court forms. Legal letters. Document preparation resources.',
      tags: ['documents', 'forms', 'templates', 'court forms'],
      aliases: ['legal forms', 'court paperwork'],
      url: '/document-library'
    },
    {
      id: 'resources',
      title: 'Legal Resources',
      titleEs: 'Recursos Legales',
      content: 'Comprehensive legal resources. Legal aid organizations. Pro bono attorneys. Self-help legal information.',
      tags: ['resources', 'legal aid', 'help', 'assistance'],
      aliases: ['legal help', 'free legal'],
      url: '/resources'
    },
    {
      id: 'case-guidance',
      title: 'Case Guidance',
      titleEs: 'Orientación de Caso',
      content: 'Get guidance for your specific case. Understand charges. Learn about defenses. Prepare for court.',
      tags: ['case', 'guidance', 'charges', 'defense'],
      aliases: ['my case', 'case help'],
      url: '/case-guidance'
    },
    {
      id: 'process',
      title: 'Court Process Guide',
      titleEs: 'Guía del Proceso Judicial',
      content: 'Understanding the court process. Arraignment. Bail hearings. Pretrial. Plea deals. Trial. Sentencing. Mock Q&A practice.',
      tags: ['court process', 'arraignment', 'trial', 'sentencing', 'plea'],
      aliases: ['what to expect', 'court steps'],
      url: '/process'
    },
    {
      id: 'search-seizure-page',
      title: 'Search and Seizure Guide',
      titleEs: 'Guía de Registro e Incautación',
      content: 'Your Fourth Amendment rights. When police can search. Consent searches. Warrant requirements. Traffic stops. Home searches.',
      tags: ['search', 'seizure', 'fourth amendment', 'warrant', 'police'],
      aliases: ['police search', 'can police search'],
      url: '/search-seizure'
    },
  ];

  for (const page of sitePages) {
    documents.push({
      id: `page-${page.id}`,
      type: 'rights_info',
      title: page.title,
      titleEs: page.titleEs,
      content: page.content,
      tags: page.tags,
      aliases: page.aliases,
      url: page.url,
    });
  }
  devLog('search', `Indexed ${sitePages.length} site pages`);

  searchIndex = documents;
  indexReady = true;
  const elapsed = Date.now() - startTime;
  devLog('search', `Search index built: ${documents.length} documents in ${elapsed}ms`);
}

export function search(query: SearchQuery): SearchResponse {
  const startTime = Date.now();
  
  if (!indexReady) {
    buildSearchIndex();
  }

  const queryTerms = expandSynonyms(query.query);
  const results: SearchResult[] = [];

  for (const doc of searchIndex) {
    if (query.filters?.types && !query.filters.types.includes(doc.type)) {
      continue;
    }
    if (query.filters?.jurisdiction && doc.jurisdiction && doc.jurisdiction !== query.filters.jurisdiction) {
      continue;
    }

    const { score, matchedTerms } = calculateScore(doc, queryTerms, query.language);
    
    const MIN_SCORE_THRESHOLD = 15;
    if (score >= MIN_SCORE_THRESHOLD) {
      const content = query.language === 'es' && doc.contentEs ? doc.contentEs : doc.content;
      const highlight = generateHighlight(content, matchedTerms);
      
      results.push({
        document: doc,
        score,
        highlights: [{ field: 'content', snippet: highlight }],
        matchedTerms,
      });
    }
  }

  results.sort((a, b) => b.score - a.score);

  const limit = query.limit || 20;
  const offset = query.offset || 0;
  const paginatedResults = results.slice(offset, offset + limit);

  const groupedResults: Record<SearchContentType, SearchResult[]> = {
    glossary: [],
    charge: [],
    diversion_program: [],
    expungement: [],
    legal_resource: [],
    court: [],
    mock_qa: [],
    rights_info: [],
  };

  for (const result of paginatedResults) {
    groupedResults[result.document.type].push(result);
  }

  const suggestions: string[] = [];
  if (results.length === 0) {
    const normalizedQuery = normalizeText(query.query);
    for (const [term, syns] of Object.entries(LEGAL_SYNONYMS)) {
      if (syns.some(s => normalizeText(s).includes(normalizedQuery) || normalizedQuery.includes(normalizeText(s)))) {
        suggestions.push(term);
      }
    }
  }

  const searchTimeMs = Date.now() - startTime;

  return {
    query: query.query,
    results: paginatedResults,
    totalCount: results.length,
    groupedResults,
    suggestions: suggestions.slice(0, 5),
    searchTimeMs,
  };
}

export function getSearchIndexStats(): { totalDocuments: number; documentsByType: Record<string, number> } {
  const documentsByType: Record<string, number> = {};
  for (const doc of searchIndex) {
    documentsByType[doc.type] = (documentsByType[doc.type] || 0) + 1;
  }
  return { totalDocuments: searchIndex.length, documentsByType };
}
