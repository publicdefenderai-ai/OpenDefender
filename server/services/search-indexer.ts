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

function calculateScore(doc: SearchDocument, queryTerms: string[], language: 'en' | 'es' | 'zh'): { score: number; matchedTerms: string[] } {
  let score = 0;
  const matchedTerms: string[] = [];
  const title = language === 'zh' && doc.titleZh ? doc.titleZh : 
                language === 'es' && doc.titleEs ? doc.titleEs : doc.title;
  const content = language === 'zh' && doc.contentZh ? doc.contentZh :
                  language === 'es' && doc.contentEs ? doc.contentEs : doc.content;
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
  
  const PROCEEDING_LABELS_ZH: Record<string, string> = {
    arraignment: '提审准备',
    bail_hearing: '保释听证准备',
    pretrial_hearing: '庭前会议准备',
    plea_hearing: '认罪听证准备',
    trial: '审判准备',
    sentencing: '量刑听证准备',
    probation_violation: '缓刑违规听证准备',
  };

  Array.from(proceedingGroups.entries()).forEach(([proceedingType, group]) => {
    documents.push({
      id: `mockqa-${proceedingType}`,
      type: 'mock_qa',
      title: `${group.label.en} Preparation`,
      titleEs: `Preparación para ${group.label.es}`,
      titleZh: PROCEEDING_LABELS_ZH[proceedingType] || `${group.label.en} Preparation`,
      content: `Practice questions and answers to prepare for your ${group.label.en}. Includes ${group.count} sample questions covering what the judge may ask.`,
      contentEs: `Preguntas y respuestas de práctica para prepararse para su ${group.label.es}. Incluye ${group.count} preguntas de ejemplo.`,
      tags: Array.from(new Set(group.tags)),
      aliases: [],
      url: `/process?proceeding=${proceedingType}`,
    });
  });
  devLog('search', `Indexed ${proceedingGroups.size} mock QA proceeding types`);

  const rightsPages = [
    { id: 'miranda', title: 'Miranda Rights', titleEs: 'Derechos Miranda', titleZh: '米兰达权利', content: 'Your right to remain silent. Anything you say can be used against you. Right to an attorney. If you cannot afford one, one will be provided.', url: '/rights-info#miranda' },
    { id: 'search-seizure', title: 'Search and Seizure Rights', titleEs: 'Derechos de Registro e Incautación', titleZh: '搜查与扣押权利', content: 'Fourth Amendment protections against unreasonable searches. When police can search. Your right to refuse consent.', url: '/search-seizure' },
    { id: 'attorney', title: 'Right to an Attorney', titleEs: 'Derecho a un Abogado', titleZh: '获得律师的权利', content: 'Sixth Amendment right to counsel. Public defender eligibility. When to request an attorney.', url: '/rights-info#attorney' },
    { id: 'speedy-trial', title: 'Right to a Speedy Trial', titleEs: 'Derecho a un Juicio Rápido', titleZh: '快速审判的权利', content: 'Sixth Amendment speedy trial rights. Time limits for prosecution.', url: '/rights-info#speedy-trial' },
    { id: 'jury', title: 'Right to a Jury Trial', titleEs: 'Derecho a un Juicio con Jurado', titleZh: '陪审团审判的权利', content: 'Sixth Amendment right to trial by jury. When jury trial is available.', url: '/rights-info#jury' },
  ];
  
  for (const page of rightsPages) {
    documents.push({
      id: `rights-${page.id}`,
      type: 'rights_info',
      title: page.title,
      titleEs: page.titleEs,
      titleZh: page.titleZh,
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
      titleZh: '移民知权指南',
      content: 'Know your rights during ICE encounters. Judicial warrants vs administrative warrants. You have the right to remain silent. Do not open the door without a judicial warrant signed by a judge. Administrative warrants (Form I-200, I-205) do not allow entry into your home. Ask to see the warrant through the window or slipped under the door.',
      tags: ['immigration', 'ICE', 'warrant', 'judicial warrant', 'administrative warrant', 'rights'],
      aliases: ['ICE raid', 'immigration enforcement', 'deportation'],
      url: '/immigration-guidance/know-your-rights'
    },
    {
      id: 'workplace-raids',
      title: 'Workplace Raids',
      titleEs: 'Redadas en el Lugar de Trabajo',
      titleZh: '工作场所搜查',
      content: 'What to do during a workplace ICE raid. Your rights at work. Do not run. Remain calm. You have the right to remain silent. Do not sign anything without an attorney.',
      tags: ['immigration', 'ICE', 'workplace', 'raid', 'employer'],
      aliases: ['ICE raid', 'work raid'],
      url: '/immigration-guidance/workplace-raids'
    },
    {
      id: 'daca-tps',
      title: 'DACA and TPS Information',
      titleEs: 'Información sobre DACA y TPS',
      titleZh: 'DACA和TPS信息',
      content: 'Deferred Action for Childhood Arrivals (DACA) and Temporary Protected Status (TPS). Eligibility requirements, renewal process, and current status updates.',
      tags: ['immigration', 'DACA', 'TPS', 'dreamers', 'work permit'],
      aliases: ['dreamers', 'deferred action', 'temporary protected status'],
      url: '/immigration-guidance/daca-tps'
    },
    {
      id: 'bond-hearings',
      title: 'Immigration Bond Hearings',
      titleEs: 'Audiencias de Fianza de Inmigración',
      titleZh: '移民保释听证会',
      content: 'Immigration bond hearing process. How to request bond. Factors judges consider. Preparing for your bond hearing.',
      tags: ['immigration', 'bond', 'detention', 'hearing', 'release'],
      aliases: ['immigration bail', 'detention release'],
      url: '/immigration-guidance/bond-hearings'
    },
    {
      id: 'family-planning',
      title: 'Family Immigration Planning',
      titleEs: 'Planificación Familiar de Inmigración',
      titleZh: '家庭移民规划',
      content: 'Emergency family planning for immigration enforcement. Power of attorney. Childcare arrangements. Document preparation.',
      tags: ['immigration', 'family', 'children', 'emergency plan'],
      aliases: ['family separation', 'child custody'],
      url: '/immigration-guidance/family-planning'
    },
    {
      id: 'find-attorney',
      title: 'Find an Immigration Attorney',
      titleEs: 'Encontrar un Abogado de Inmigración',
      titleZh: '查找移民律师',
      content: 'How to find free or low-cost immigration legal help. Legal aid organizations. Pro bono attorneys. Avoiding notario fraud.',
      tags: ['immigration', 'attorney', 'lawyer', 'legal aid'],
      aliases: ['immigration lawyer', 'legal help'],
      url: '/immigration-guidance/find-attorney'
    },
    {
      id: 'find-detained',
      title: 'Find a Detained Person',
      titleEs: 'Encontrar a una Persona Detenida',
      titleZh: '查找被拘留者',
      content: 'How to locate someone in immigration detention. ICE detainee locator. Detention facility information. Visitation rights.',
      tags: ['immigration', 'detention', 'ICE', 'locator'],
      aliases: ['ICE detention', 'detained immigrant'],
      url: '/immigration-guidance/find-detained'
    },
    {
      id: 'raids-toolkit',
      title: 'ICE Raids Toolkit',
      titleEs: 'Kit de Herramientas para Redadas de ICE',
      titleZh: 'ICE搜查工具包',
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
      titleZh: page.titleZh,
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
      titleZh: 'Public Defender AI - 法律指导',
      content: 'Free legal guidance and rights information. AI-powered assistance for criminal defense. Know your rights. Find legal resources.',
      tags: ['home', 'legal aid', 'public defender', 'rights'],
      aliases: ['main', 'start'],
      url: '/'
    },
    {
      id: 'rights-info',
      title: 'Know Your Rights',
      titleEs: 'Conozca Sus Derechos',
      titleZh: '了解您的权利',
      content: 'Understanding your constitutional rights. Miranda rights. Right to remain silent. Right to an attorney. Protection against unreasonable searches.',
      tags: ['rights', 'constitution', 'miranda', 'attorney'],
      aliases: ['constitutional rights', 'civil rights'],
      url: '/rights-info'
    },
    {
      id: 'court-locator',
      title: 'Court and Resource Locator',
      titleEs: 'Localizador de Tribunales y Recursos',
      titleZh: '法院和资源定位',
      content: 'Find courts, legal aid offices, and public defender offices near you. Locate legal resources in your area.',
      tags: ['court', 'locator', 'legal aid', 'public defender'],
      aliases: ['find court', 'courthouse', 'legal help near me'],
      url: '/court-locator'
    },
    {
      id: 'immigration-hub',
      title: 'Immigration Guidance Hub',
      titleEs: 'Centro de Orientación de Inmigración',
      titleZh: '移民指导中心',
      content: 'Comprehensive immigration resources. Know your rights. ICE encounters. DACA and TPS. Finding legal help.',
      tags: ['immigration', 'ICE', 'DACA', 'TPS', 'deportation'],
      aliases: ['immigrant rights', 'undocumented'],
      url: '/immigration-guidance'
    },
    {
      id: 'mission',
      title: 'Our Mission',
      titleEs: 'Nuestra Misión',
      titleZh: '我们的使命',
      content: 'Public Defender AI mission statement. Democratizing access to legal information. Helping those who cannot afford attorneys.',
      tags: ['mission', 'about', 'purpose'],
      aliases: ['about us', 'who we are'],
      url: '/mission-statement'
    },
    {
      id: 'court-records',
      title: 'Court Records Search',
      titleEs: 'Búsqueda de Registros Judiciales',
      titleZh: '法院记录搜索',
      content: 'Search federal court records. PACER and RECAP access. Find case documents and dockets.',
      tags: ['court records', 'PACER', 'RECAP', 'docket', 'case search'],
      aliases: ['case lookup', 'docket search', 'federal courts'],
      url: '/court-records'
    },
    {
      id: 'recap',
      title: 'RECAP Browser Extensions',
      titleEs: 'Extensiones de Navegador RECAP',
      titleZh: 'RECAP浏览器扩展',
      content: 'Free access to federal court documents. RECAP browser extension for Chrome and Firefox. Save money on PACER fees.',
      tags: ['RECAP', 'PACER', 'browser extension', 'free court documents'],
      aliases: ['free PACER', 'court documents'],
      url: '/recap-extensions'
    },
    {
      id: 'friends-family',
      title: 'Resources for Friends and Family',
      titleEs: 'Recursos para Amigos y Familia',
      titleZh: '亲友资源',
      content: 'How to support a loved one facing charges. Bail information. Court dates. Finding an attorney. Emotional support resources.',
      tags: ['family', 'support', 'loved one', 'bail', 'visiting'],
      aliases: ['help family member', 'loved one arrested'],
      url: '/friends-family'
    },
    {
      id: 'how-to',
      title: 'How to Use This App',
      titleEs: 'Cómo Usar Esta Aplicación',
      titleZh: '如何使用本应用',
      content: 'Guide to using Public Defender AI. Getting legal guidance. Understanding your case. Preparing for court.',
      tags: ['guide', 'tutorial', 'help', 'instructions'],
      aliases: ['getting started', 'user guide'],
      url: '/how-to'
    },
    {
      id: 'statutes',
      title: 'Statute Search',
      titleEs: 'Búsqueda de Estatutos',
      titleZh: '法规搜索',
      content: 'Search federal and state criminal statutes. Find laws by jurisdiction. Penalty information. Legal definitions.',
      tags: ['statutes', 'laws', 'criminal code', 'penalties'],
      aliases: ['criminal law', 'penal code', 'legal code'],
      url: '/statutes'
    },
    {
      id: 'chat',
      title: 'Legal Guidance Chat',
      titleEs: 'Chat de Orientación Legal',
      titleZh: '法律指导聊天',
      content: 'Get AI-powered legal guidance. Discuss your situation. Understand your options. Prepare for court proceedings.',
      tags: ['chat', 'guidance', 'AI', 'help', 'advice'],
      aliases: ['talk to AI', 'get help', 'legal advice'],
      url: '/chat'
    },
    {
      id: 'document-library',
      title: 'Legal Document Library',
      titleEs: 'Biblioteca de Documentos Legales',
      titleZh: '法律文件库',
      content: 'Legal document templates and forms. Court forms. Legal letters. Document preparation resources.',
      tags: ['documents', 'forms', 'templates', 'court forms'],
      aliases: ['legal forms', 'court paperwork'],
      url: '/document-library'
    },
    {
      id: 'resources',
      title: 'Legal Resources',
      titleEs: 'Recursos Legales',
      titleZh: '法律资源',
      content: 'Comprehensive legal resources. Legal aid organizations. Pro bono attorneys. Self-help legal information.',
      tags: ['resources', 'legal aid', 'help', 'assistance'],
      aliases: ['legal help', 'free legal'],
      url: '/resources'
    },
    {
      id: 'case-guidance',
      title: 'Case Guidance',
      titleEs: 'Orientación de Caso',
      titleZh: '案件指导',
      content: 'Get guidance for your specific case. Understand charges. Learn about defenses. Prepare for court.',
      tags: ['case', 'guidance', 'charges', 'defense'],
      aliases: ['my case', 'case help'],
      url: '/case-guidance'
    },
    {
      id: 'process',
      title: 'Court Process Guide',
      titleEs: 'Guía del Proceso Judicial',
      titleZh: '法庭流程指南',
      content: 'Understanding the court process. Arraignment. Bail hearings. Pretrial. Plea deals. Trial. Sentencing. Mock Q&A practice.',
      tags: ['court process', 'arraignment', 'trial', 'sentencing', 'plea'],
      aliases: ['what to expect', 'court steps'],
      url: '/process'
    },
    {
      id: 'search-seizure-page',
      title: 'Search and Seizure Guide',
      titleEs: 'Guía de Registro e Incautación',
      titleZh: '搜查与扣押指南',
      content: 'Your Fourth Amendment rights. When police can search. Consent searches. Warrant requirements. Traffic stops. Home searches.',
      tags: ['search', 'seizure', 'fourth amendment', 'warrant', 'police'],
      aliases: ['police search', 'can police search'],
      url: '/search-seizure'
    },
    {
      id: 'tech-docs',
      title: 'Technical Documentation',
      titleEs: 'Documentación Técnica',
      titleZh: '技术文档',
      content: 'Technical documentation hub for developers. API documentation. Embeddable widgets. JSON schemas. OpenAPI specification. Integration tools. Developer resources.',
      tags: ['technical', 'developer', 'api', 'integration', 'documentation'],
      aliases: ['tech docs', 'developer docs', 'developer hub'],
      url: '/tech-docs'
    },
    {
      id: 'api-docs',
      title: 'API Documentation',
      titleEs: 'Documentación de API',
      titleZh: 'API文档',
      content: 'Public API for developers. REST API endpoints. Search API. Criminal charges data. Diversion programs data. Legal glossary. CSV and JSON export. Open source integration. Third-party developers.',
      tags: ['api', 'developer', 'integration', 'data', 'export', 'open source'],
      aliases: ['developer docs', 'api reference', 'data export', 'integration'],
      url: '/api-docs'
    },
    {
      id: 'widgets',
      title: 'Embeddable Widgets',
      titleEs: 'Widgets Integrables',
      titleZh: '可嵌入组件',
      content: 'Embed legal resources on your website. Search widget. Know Your Rights card. Legal glossary widget. JavaScript embed. iframe embed. Customizable themes. Bilingual support.',
      tags: ['widgets', 'embed', 'integration', 'javascript', 'iframe'],
      aliases: ['embed code', 'website widget', 'integration tools'],
      url: '/widgets'
    },
    {
      id: 'case-timeline',
      title: 'Criminal Case Timeline',
      titleEs: 'Cronología del Caso Penal',
      titleZh: '刑事案件时间线',
      content: 'Interactive 7-stage criminal case timeline. Arrest, arraignment, pretrial, plea bargaining, trial, sentencing, and appeal. Understand each stage of a criminal proceeding, your rights, and what to expect.',
      tags: ['timeline', 'case stages', 'criminal process', 'arraignment', 'trial', 'sentencing', 'appeal', 'arrest'],
      aliases: ['case stages', 'criminal procedure', 'court process timeline', 'what happens after arrest'],
      url: '/case-timeline'
    },
    {
      id: 'quick-reference',
      title: 'Quick Reference Rights Cards',
      titleEs: 'Tarjetas de Referencia Rápida de Derechos',
      titleZh: '快速参考权利卡',
      content: 'Printable and saveable rights reference cards. Know your rights during police encounters, traffic stops, arrests, arraignment, bail hearings, and court appearances. Pocket-sized legal rights cards.',
      tags: ['quick reference', 'rights cards', 'printable', 'police encounter', 'traffic stop', 'arrest rights'],
      aliases: ['rights card', 'pocket card', 'printable rights', 'cheat sheet'],
      url: '/quick-reference'
    },
    {
      id: 'diversion-programs-hub',
      title: 'Diversion Programs Directory',
      titleEs: 'Directorio de Programas de Diversión',
      titleZh: '转移计划目录',
      content: 'Find diversion and alternative sentencing programs in your area. Drug courts, mental health courts, veteran courts, community service, and pretrial intervention programs. Avoid jail and get help.',
      tags: ['diversion', 'alternative sentencing', 'drug court', 'mental health court', 'veteran court', 'community service'],
      aliases: ['alternative to jail', 'drug program', 'first offender program', 'pretrial diversion'],
      url: '/diversion-programs'
    },
    {
      id: 'record-expungement-hub',
      title: 'Record Expungement Guide',
      titleEs: 'Guía de Eliminación de Antecedentes',
      titleZh: '记录清除指南',
      content: 'Learn how to clear your criminal record. Expungement eligibility by state. Record sealing. Certificates of rehabilitation. Clean slate laws. Start fresh after a conviction.',
      tags: ['expungement', 'record clearing', 'record sealing', 'clean slate', 'rehabilitation'],
      aliases: ['clear record', 'erase criminal record', 'second chance', 'record removal'],
      url: '/record-expungement'
    },
    {
      id: 'legal-glossary-hub',
      title: 'Legal Glossary',
      titleEs: 'Glosario Legal',
      titleZh: '法律术语表',
      content: 'Comprehensive legal glossary with plain-language definitions. Understand legal terms, court terminology, and criminal justice vocabulary. Search legal definitions.',
      tags: ['glossary', 'legal terms', 'definitions', 'vocabulary', 'terminology'],
      aliases: ['legal dictionary', 'law terms', 'court terms', 'legal definitions'],
      url: '/legal-glossary'
    },
    {
      id: 'document-summarizer',
      title: 'Legal Document Summarizer',
      titleEs: 'Resumidor de Documentos Legales',
      titleZh: '法律文件摘要器',
      content: 'Upload and summarize legal documents using AI. Understand court papers, legal notices, police reports, and other legal documents in plain language. Private and secure document analysis.',
      tags: ['document', 'summarizer', 'upload', 'AI', 'court papers', 'police report'],
      aliases: ['summarize document', 'understand court papers', 'read legal document'],
      url: '/document-summarizer'
    },
    {
      id: 'support-hub',
      title: 'Support Resources Hub',
      titleEs: 'Centro de Recursos de Apoyo',
      titleZh: '支持资源中心',
      content: 'Find support resources for people involved in the criminal justice system. Employment, finances, court logistics, mental health, housing, and more.',
      tags: ['support', 'resources', 'help', 'assistance', 'reentry'],
      aliases: ['get help', 'support services', 'reentry resources'],
      url: '/support'
    },
    {
      id: 'support-employment',
      title: 'Employment Support Resources',
      titleEs: 'Recursos de Apoyo para el Empleo',
      titleZh: '就业支持资源',
      content: 'Find employment resources for people with criminal records. Job training, resume help, ban the box employers, second chance hiring, workforce development programs.',
      tags: ['employment', 'jobs', 'work', 'hiring', 'career', 'ban the box', 'criminal record'],
      aliases: ['find a job', 'jobs for felons', 'employment with record', 'second chance employers'],
      url: '/support/employment'
    },
    {
      id: 'support-finances',
      title: 'Financial Support Resources',
      titleEs: 'Recursos de Apoyo Financiero',
      titleZh: '财务支持资源',
      content: 'Financial assistance for people in the criminal justice system. Help with fines, fees, court costs, bail funds, financial literacy, and benefits enrollment.',
      tags: ['finances', 'money', 'fines', 'fees', 'court costs', 'bail fund', 'financial aid'],
      aliases: ['pay fines', 'court fees help', 'financial assistance', 'bail money'],
      url: '/support/finances'
    },
    {
      id: 'support-court-logistics',
      title: 'Court Logistics Support',
      titleEs: 'Apoyo Logístico para el Tribunal',
      titleZh: '法院后勤支持',
      content: 'Help with court logistics. Transportation to court, childcare during hearings, what to wear, what to bring, courthouse navigation, interpreter services.',
      tags: ['court logistics', 'transportation', 'childcare', 'courthouse', 'interpreter', 'what to wear'],
      aliases: ['getting to court', 'court preparation', 'courthouse help', 'court day'],
      url: '/support/court-logistics'
    },
    {
      id: 'support-mental-health',
      title: 'Mental Health Support Resources',
      titleEs: 'Recursos de Apoyo de Salud Mental',
      titleZh: '心理健康支持资源',
      content: 'Mental health resources for people in the criminal justice system. Counseling, crisis hotlines, substance abuse treatment, trauma support, anxiety and stress management.',
      tags: ['mental health', 'counseling', 'therapy', 'crisis', 'substance abuse', 'anxiety', 'stress'],
      aliases: ['therapy', 'counseling', 'crisis hotline', 'substance abuse help', 'emotional support'],
      url: '/support/mental-health'
    },
    {
      id: 'support-transportation',
      title: 'Transportation Support Resources',
      titleEs: 'Recursos de Apoyo de Transporte',
      titleZh: '交通支持资源',
      content: 'Transportation assistance for court appearances and legal appointments. Free or low-cost rides to court, bus passes, rideshare programs, and transportation for people with limited mobility.',
      tags: ['transportation', 'rides', 'court transportation', 'bus pass', 'rideshare', 'getting to court'],
      aliases: ['ride to court', 'free transportation', 'bus pass help', 'court ride'],
      url: '/support/transportation'
    },
    {
      id: 'support-childcare',
      title: 'Childcare Support Resources',
      titleEs: 'Recursos de Apoyo para el Cuidado de Niños',
      titleZh: '儿童照顾支持资源',
      content: 'Childcare resources during court hearings and legal proceedings. Emergency childcare, subsidized childcare programs, and support for parents involved in the justice system.',
      tags: ['childcare', 'child care', 'kids', 'children', 'parenting', 'court hearing childcare'],
      aliases: ['childcare during court', 'babysitter help', 'child care assistance', 'kids during hearings'],
      url: '/support/childcare'
    },
    {
      id: 'support-housing',
      title: 'Housing Support Resources',
      titleEs: 'Recursos de Apoyo de Vivienda',
      titleZh: '住房支持资源',
      content: 'Housing assistance for people with criminal records. Transitional housing, reentry housing programs, fair chance housing policies, tenant rights, and homelessness prevention.',
      tags: ['housing', 'shelter', 'reentry housing', 'fair chance housing', 'eviction', 'homelessness'],
      aliases: ['find housing', 'reentry housing', 'housing with record', 'fair chance apartment', 'homeless shelter'],
      url: '/support/housing'
    },
    {
      id: 'support-family-care',
      title: 'Family Care Support Resources',
      titleEs: 'Recursos de Apoyo para el Cuidado Familiar',
      titleZh: '家庭照顾支持资源',
      content: 'Support for families affected by the criminal justice system. Visitation rights, maintaining family bonds, parental rights during incarceration, and family counseling.',
      tags: ['family', 'family care', 'visitation', 'parental rights', 'incarceration family', 'family counseling'],
      aliases: ['visit someone in jail', 'parental rights', 'family support', 'maintain family contact'],
      url: '/support/family-care'
    },
    {
      id: 'support-reputation',
      title: 'Reputation and Record Support',
      titleEs: 'Apoyo para la Reputación y el Registro',
      titleZh: '声誉和记录支持',
      content: 'Resources to rebuild reputation after a criminal record. Expungement assistance, record sealing, background check disputes, digital reputation management, and employer reference guidance.',
      tags: ['reputation', 'record', 'expungement', 'record sealing', 'background check', 'digital reputation'],
      aliases: ['clear criminal record', 'expunge record', 'seal record', 'background check dispute', 'reputation repair'],
      url: '/support/reputation'
    },
    {
      id: 'attorney-portal',
      title: 'Attorney Portal',
      titleEs: 'Portal de Abogados',
      titleZh: '律师门户',
      content: 'Verified attorney portal for document generation. Criminal motion templates, immigration motions, jurisdiction-specific legal documents for all 50 states and DC.',
      tags: ['attorney', 'lawyer', 'portal', 'documents', 'motions', 'templates'],
      aliases: ['lawyer portal', 'attorney tools', 'legal document generator'],
      url: '/attorney'
    },
    {
      id: 'privacy-policy',
      title: 'Privacy Policy',
      titleEs: 'Política de Privacidad',
      titleZh: '隐私政策',
      content: 'Privacy policy for Public Defender AI. How we protect your data. Data ephemerality. No personal information stored. Session-based privacy.',
      tags: ['privacy', 'policy', 'data', 'security'],
      aliases: ['data privacy', 'privacy statement'],
      url: '/privacy-policy'
    },
    {
      id: 'disclaimers',
      title: 'Legal Disclaimers',
      titleEs: 'Descargos de Responsabilidad',
      titleZh: '法律免责声明',
      content: 'Legal disclaimers for Public Defender AI. Not a substitute for legal counsel. Educational purposes only. Limitation of liability.',
      tags: ['disclaimer', 'legal notice', 'terms'],
      aliases: ['terms of use', 'legal notice', 'not legal advice'],
      url: '/disclaimers'
    },
  ];

  for (const page of sitePages) {
    documents.push({
      id: `page-${page.id}`,
      type: 'rights_info',
      title: page.title,
      titleEs: page.titleEs,
      titleZh: page.titleZh,
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
      const content = query.language === 'zh' && doc.contentZh ? doc.contentZh :
                      query.language === 'es' && doc.contentEs ? doc.contentEs : doc.content;
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
