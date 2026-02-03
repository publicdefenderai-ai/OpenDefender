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

  for (const qa of GENERIC_MOCK_QA) {
    const proceedingType = qa.proceedingType as ProceedingType;
    const proceedingLabel = PROCEEDING_LABELS[proceedingType];
    documents.push({
      id: `mockqa-${qa.id}`,
      type: 'mock_qa',
      title: `${proceedingLabel.en} Preparation`,
      titleEs: `Preparación para ${proceedingLabel.es}`,
      content: `Court preparation for ${proceedingLabel.en}. Question: ${qa.questionKey}`,
      contentEs: `Preparación para ${proceedingLabel.es}`,
      tags: [qa.proceedingType, qa.casePhase, ...(qa.tags || [])],
      aliases: [],
      url: `/process?proceeding=${qa.proceedingType}`,
    });
  }
  devLog('search', `Indexed ${GENERIC_MOCK_QA.length} mock QA items`);

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
    
    if (score > 0) {
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
