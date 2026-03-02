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

// Common words that add noise if scored individually
const STOP_WORDS = new Set(['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'own', 'say', 'she', 'two', 'who', 'did', 'use', 'way', 'had', 'let', 'put', 'set', 'too', 'any', 'few', 'far', 'off', 'old', 'why', 'ask', 'men', 'ran', 'run', 'see', 'try', 'yes', 'yet', 'ago', 'did', 'due', 'via', 'per', 'etc']);

function expandSynonyms(query: string): string[] {
  const normalized = normalizeText(query);
  const words = normalized.split(' ');
  const expanded: string[] = [normalized];
  const seen = new Set<string>([normalized]);

  // For multi-word queries, also score meaningful individual words so that
  // e.g. "phone search" finds both "phone" and "search" documents separately
  for (const word of words) {
    if (word.length >= 4 && !STOP_WORDS.has(word) && !seen.has(word)) {
      expanded.push(word);
      seen.add(word);
    }
  }

  // Expand synonyms for each word and for the full phrase
  for (const term of [...words, normalized]) {
    const synonyms = LEGAL_SYNONYMS[term];
    if (synonyms) {
      for (const syn of synonyms) {
        const replacement = normalized.replace(term, syn);
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
    {
      id: 'miranda',
      title: 'Miranda Rights',
      titleEs: 'Derechos Miranda',
      titleZh: '米兰达权利',
      content: 'Your right to remain silent — anything you say can and will be used against you in a court of law. Right to an attorney. If you cannot afford an attorney, one will be appointed for you. Invoke your right to remain silent by clearly saying "I am invoking my right to remain silent." Do not answer police questions without an attorney. Miranda warning must be given before custodial interrogation. Fifth Amendment protection against self-incrimination. Sixth Amendment right to counsel.',
      tags: ['miranda', 'right to remain silent', 'fifth amendment', 'sixth amendment', 'attorney', 'custodial interrogation', 'police questioning'],
      aliases: ['miranda rights', 'miranda warning', 'right to remain silent', 'plead the fifth', 'remain silent', 'do not talk to police', 'police questioning rights'],
      url: '/rights-info#miranda',
    },
    {
      id: 'search-seizure',
      title: 'Search and Seizure Rights',
      titleEs: 'Derechos de Registro e Incautación',
      titleZh: '搜查与扣押权利',
      content: 'Fourth Amendment protections against unreasonable searches and seizures. Police generally need a warrant signed by a judge to search your home, your phone, or your belongings. You have the right to refuse consent to a search. Stop and frisk: police can briefly stop you on the street if they have reasonable suspicion, and pat down for weapons only. Vehicle search: police can search your car without a warrant if they have probable cause. Phone search: police need a warrant to search your cell phone — Riley v. California (2014). Home search: refuse entry without a warrant signed by a judge. Search of person: you have privacy rights during searches. Do not physically resist a search even if it is unlawful — object verbally and raise it in court.',
      tags: ['search', 'seizure', 'fourth amendment', 'warrant', 'police', 'phone search', 'cell phone', 'digital privacy', 'stop and frisk', 'vehicle search', 'home search', 'consent', 'traffic stop', 'refuse search'],
      aliases: ['police search', 'can police search', 'phone search', 'cell phone search', 'can police search my phone', 'stop and frisk', 'traffic stop search', 'home search warrant', 'search my car', 'refuse search', 'fourth amendment rights'],
      url: '/search-seizure',
    },
    {
      id: 'attorney',
      title: 'Right to an Attorney',
      titleEs: 'Derecho a un Abogado',
      titleZh: '获得律师的权利',
      content: 'Sixth Amendment right to counsel. You have the right to an attorney at all critical stages of a criminal prosecution. If you cannot afford an attorney, a public defender will be appointed. Request an attorney immediately upon arrest or during questioning. Say clearly: "I want a lawyer." Do not answer questions until your attorney is present. Public defender offices provide free legal representation to those who qualify financially.',
      tags: ['attorney', 'lawyer', 'public defender', 'sixth amendment', 'right to counsel', 'free attorney'],
      aliases: ['right to attorney', 'right to a lawyer', 'public defender', 'free lawyer', 'can I get a free lawyer', 'appointed attorney', 'I want a lawyer'],
      url: '/rights-info#attorney',
    },
    {
      id: 'speedy-trial',
      title: 'Right to a Speedy Trial',
      titleEs: 'Derecho a un Juicio Rápido',
      titleZh: '快速审判的权利',
      content: 'Sixth Amendment speedy trial rights. The government must bring your case to trial within a reasonable time. The Speedy Trial Act sets time limits in federal cases. State laws vary. Unreasonable delay can result in dismissal of charges. Speedy trial rights protect against prolonged pretrial detention.',
      tags: ['speedy trial', 'sixth amendment', 'trial rights', 'time limits', 'dismissal'],
      aliases: ['speedy trial rights', 'how long can they hold me', 'trial delay', 'right to fast trial'],
      url: '/rights-info#speedy-trial',
    },
    {
      id: 'jury',
      title: 'Right to a Jury Trial',
      titleEs: 'Derecho a un Juicio con Jurado',
      titleZh: '陪审团审判的权利',
      content: 'Sixth Amendment right to trial by jury for serious offenses. The jury must unanimously agree on a verdict. You can waive your right to a jury trial and elect a bench trial before a judge only. In federal court and most state courts, felony charges carry the right to a jury trial. Misdemeanor right to jury trial varies by state.',
      tags: ['jury trial', 'sixth amendment', 'trial rights', 'bench trial', 'verdict'],
      aliases: ['jury trial rights', 'right to jury', 'bench trial', 'trial by jury'],
      url: '/rights-info#jury',
    },
  ];

  for (const page of rightsPages) {
    documents.push({
      id: `rights-${page.id}`,
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
  devLog('search', `Indexed ${rightsPages.length} rights info pages`);

  // Dedicated sub-documents for each search-seizure scenario
  const searchSeizureScenarios = [
    {
      id: 'phone-search',
      title: 'Phone Search Rights',
      titleEs: 'Derechos en Registro de Teléfono',
      content: 'Police need a warrant to search your cell phone or smartphone. Riley v. California (2014): the Supreme Court unanimously ruled that police cannot search your phone without a warrant. You are not required to provide your passcode or PIN to police. Biometric unlock (fingerprint or face scan) — police may attempt to compel biometric unlock, but your passcode is protected. Digital privacy: your phone contains deeply personal information and has stronger Fourth Amendment protection than physical items. Do not voluntarily hand over your phone. You can say: "I do not consent to a search of my phone."',
      tags: ['phone search', 'cell phone', 'digital privacy', 'fourth amendment', 'warrant', 'passcode', 'biometric', 'smartphone', 'riley v california'],
      aliases: ['can police search my phone', 'cell phone search', 'phone passcode', 'digital device search', 'phone privacy', 'search my phone', 'unlock phone for police', 'phone warrant'],
      url: '/search-seizure#phone-search',
    },
    {
      id: 'stop-frisk',
      title: 'Stop and Frisk Rights',
      titleEs: 'Derechos en Parada y Cacheo',
      content: 'Terry stop: police can briefly detain you on the street if they have reasonable suspicion of criminal activity — a hunch or your appearance alone is not enough. Pat-down for weapons: police may pat down your outer clothing only if they have reasonable suspicion you are armed and dangerous. You have the right to ask "Am I free to go?" — if yes, calmly walk away. Do not physically resist the stop even if it is unlawful. You can say: "I do not consent to this search." State your name if your state requires it. Terry v. Ohio established stop-and-frisk law.',
      tags: ['stop and frisk', 'terry stop', 'pat down', 'police stop', 'reasonable suspicion', 'fourth amendment', 'street stop'],
      aliases: ['stop and frisk', 'pat down', 'police pat down', 'can police stop me', 'terry stop', 'street stop', 'am i free to go', 'police detain me'],
      url: '/search-seizure#stop-frisk',
    },
    {
      id: 'vehicle-search',
      title: 'Vehicle Search Rights',
      titleEs: 'Derechos en Registro de Vehículo',
      content: 'During a traffic stop, police can search your car without a warrant if they have probable cause — for example, if they see contraband in plain view (plain view doctrine), smell marijuana, or have other specific facts suggesting evidence of a crime. You have the right to refuse consent to a vehicle search. Refusing consent is not grounds for arrest. Do not physically resist. If you consent, you cannot take it back. Do not leave drugs, weapons, or contraband in plain view. You can say: "I do not consent to a search of my vehicle."',
      tags: ['vehicle search', 'car search', 'traffic stop', 'probable cause', 'consent', 'fourth amendment', 'plain view', 'automobile'],
      aliases: ['can police search my car', 'car search', 'vehicle search rights', 'traffic stop search', 'pulled over search', 'search my vehicle', 'car stopped by police'],
      url: '/search-seizure#vehicle-search',
    },
    {
      id: 'home-search',
      title: 'Home Search Rights',
      titleEs: 'Derechos en Registro del Hogar',
      content: 'Police need a search warrant signed by a judge to enter and search your home. You have the right to refuse entry without a valid judicial warrant. Ask to see the warrant through the window or have it slipped under the door. Exigent circumstances — police may enter without a warrant in genuine emergencies (hot pursuit, imminent destruction of evidence, risk to life). Do not consent to a home search. An ICE administrative warrant (Form I-200 or I-205) is NOT a judicial warrant and does not give police the right to enter. Anything you say at the door can be used against you.',
      tags: ['home search', 'house search', 'warrant', 'fourth amendment', 'search warrant', 'residence', 'door', 'judicial warrant', 'exigent circumstances'],
      aliases: ['can police enter my home', 'home search warrant', 'house search', 'search my home', 'police at my door', 'do i have to let police in', 'police knock door'],
      url: '/search-seizure#home-search',
    },
    {
      id: 'person-search',
      title: 'Search of Person Rights',
      titleEs: 'Derechos en Registro Personal',
      content: 'Police may search your person incident to a lawful arrest — they do not need a separate warrant. Strip search: policies vary by jurisdiction; strip searches require more than an ordinary arrest and must be conducted by an officer of the same sex and in private. Body cavity search: requires a warrant or court order except in very limited circumstances. Do not physically resist a search. You can object verbally: "I do not consent to this search." Document everything afterward and raise it with your attorney.',
      tags: ['search of person', 'strip search', 'body search', 'fourth amendment', 'search incident to arrest', 'pat down', 'personal search'],
      aliases: ['can police search me', 'search my body', 'strip search rights', 'personal search rights', 'being searched by police'],
      url: '/search-seizure#person-search',
    },
  ];

  for (const scenario of searchSeizureScenarios) {
    documents.push({
      id: `rights-${scenario.id}`,
      type: 'rights_info',
      title: scenario.title,
      titleEs: scenario.titleEs,
      content: scenario.content,
      tags: scenario.tags,
      aliases: scenario.aliases,
      url: scenario.url,
    });
  }
  devLog('search', `Indexed ${searchSeizureScenarios.length} search & seizure scenario pages`);

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
      content: 'Your Fourth Amendment rights against unreasonable searches and seizures. Phone search and digital privacy — police need a warrant to search your cell phone. Stop and frisk rights during police encounters. Vehicle search rights during traffic stops. Home search — how to respond when police come to your door. Search of person rights including pat-downs and strip searches. When police need a warrant. How to refuse consent. What to say when police ask to search.',
      tags: ['search', 'seizure', 'fourth amendment', 'warrant', 'police', 'phone search', 'stop and frisk', 'vehicle search', 'home search', 'traffic stop', 'consent', 'digital privacy'],
      aliases: ['police search', 'can police search', 'phone search', 'cell phone search', 'stop and frisk', 'traffic stop', 'search my car', 'search my home', 'refuse search'],
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
      id: 'support-personal-health',
      title: 'Personal Health Support Resources',
      titleEs: 'Recursos de Apoyo de Salud Personal',
      titleZh: '个人健康支持资源',
      content: 'Personal health resources for people involved in the criminal justice system. Access to healthcare, medical appointments, prescription medications, insurance coverage, and managing health needs during your case. Free clinics, community health centers, and Medicaid enrollment assistance.',
      tags: ['personal health', 'healthcare', 'medical', 'health insurance', 'medicaid', 'free clinic', 'prescription', 'health care'],
      aliases: ['health care help', 'free medical care', 'doctor help', 'health insurance help', 'medicaid enrollment', 'medical assistance'],
      url: '/support/personal-health'
    },
    {
      id: 'attorney-playbooks',
      title: 'Attorney Case Playbooks',
      titleEs: 'Guías de Casos para Abogados',
      titleZh: '律师案例手册',
      content: 'Strategic case roadmaps for criminal defense and immigration attorneys. Stage-by-stage guidance for arraignment, DUI, drug possession, probation violations, bail, domestic violence, felony assault, weapons charges, sentencing, post-conviction relief, asylum, ICE detention, VAWA, U visa, adjustment of status, and more. Includes jurisdiction variations and template references.',
      tags: ['attorney', 'playbooks', 'case guidance', 'criminal defense', 'immigration defense', 'strategy', 'stages'],
      aliases: ['case roadmap', 'attorney guide', 'defense strategy', 'case playbook', 'lawyer guide'],
      url: '/attorney/playbooks'
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
