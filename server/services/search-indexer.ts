import type { SearchDocument, SearchContentType, SearchQuery, SearchResult, SearchResponse } from "@shared/search-types";
import { LEGAL_SYNONYMS } from "@shared/search-types";
import { legalGlossaryTerms } from "../../client/src/lib/legal-glossary-data";
import { diversionPrograms } from "../../client/src/lib/diversion-programs-data";
import { expungementRules } from "../../client/src/lib/expungement-data";
import { criminalCharges, getInstructionRef, getInstructionUrl, getVerifiedCitation } from "@shared/criminal-charges";
import { GENERIC_MOCK_QA, PROCEEDING_LABELS, type ProceedingType } from "@shared/mock-qa";
import { devLog } from "../utils/dev-logger";

let searchIndex: SearchDocument[] = [];
let indexReady = false;
let fuzzyVocabulary: Map<string, number> = new Map();

// Levenshtein edit distance — O(m*n) DP, optimized to a single row.
// Returns 99 early when length difference alone exceeds maxDist (avoids full computation).
function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  if (Math.abs(m - n) > 3) return 99;
  const row: number[] = Array.from({ length: n + 1 }, (_, i) => i);
  for (let i = 1; i <= m; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= n; j++) {
      const temp = row[j];
      row[j] = a[i - 1] === b[j - 1] ? prev : 1 + Math.min(prev, row[j], row[j - 1]);
      prev = temp;
    }
  }
  return row[n];
}

// Build a frequency-weighted vocabulary from high-value fields of every document.
// Called once at the end of buildSearchIndex().
function buildFuzzyVocabulary(): void {
  fuzzyVocabulary = new Map();
  for (const doc of searchIndex) {
    const sources: string[] = [
      doc.title,
      ...(doc.tags || []),
      ...(doc.aliases || []),
      ...(doc.headings || []),
    ];
    for (const source of sources) {
      for (const word of normalizeText(source).split(' ')) {
        if (word.length >= 3 && !STOP_WORDS.has(word)) {
          fuzzyVocabulary.set(word, (fuzzyVocabulary.get(word) || 0) + 1);
        }
      }
    }
  }
}

// For each direct query term not found in the vocabulary, find the closest
// vocabulary word within an edit-distance budget that scales with word length.
// Returns a Map of { originalNormalizedTerm → correctedWord }.
function tryFuzzyCorrect(terms: string[]): Map<string, string> {
  const corrections = new Map<string, string>();
  for (const term of terms) {
    const nt = normalizeText(term);
    // Skip very short terms unless they're known legal abbreviations
    if (nt.length < 4 && !LEGAL_SHORT_TERMS.has(nt)) continue;
    // Never fuzzy-correct known legal abbreviations — "dui" should never become "due"
    if (LEGAL_SHORT_TERMS.has(nt)) continue;
    if (fuzzyVocabulary.has(nt)) continue;
    const maxDist = nt.length >= 8 ? 2 : 1;
    let bestWord = '';
    let bestDist = maxDist + 1;
    let bestFreq = 0;
    for (const [vocabWord, freq] of fuzzyVocabulary) {
      if (Math.abs(vocabWord.length - nt.length) > maxDist) continue;
      const dist = levenshtein(nt, vocabWord);
      if (dist < bestDist || (dist === bestDist && freq > bestFreq)) {
        bestDist = dist;
        bestWord = vocabWord;
        bestFreq = freq;
      }
    }
    if (bestWord && bestDist <= maxDist) {
      corrections.set(nt, bestWord);
    }
  }
  return corrections;
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Common words that add noise if scored individually
const STOP_WORDS = new Set(['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'own', 'say', 'she', 'two', 'who', 'did', 'use', 'way', 'had', 'let', 'put', 'set', 'too', 'any', 'few', 'far', 'off', 'old', 'why', 'ask', 'men', 'ran', 'run', 'see', 'try', 'yes', 'yet', 'ago', 'did', 'due', 'via', 'per', 'etc']);

// Short legal abbreviations and acronyms that must NOT be filtered by the
// 4-char minimum length rule and must NOT be fuzzy-corrected.
const LEGAL_SHORT_TERMS = new Set(['dui', 'dwi', 'ice', 'tro', 'ada', 'fbi', 'doj', 'atf', 'oui', 'owi', 'ids', 'cps', 'tps']);

/**
 * For charge names like "Robbery in the First Degree" or "Murder in the Second Degree",
 * extract the base crime name ("robbery", "murder") and return it as a lowercase alias.
 * This ensures that a user searching "robbery" finds FL's "Robbery in the First Degree"
 * via an alias-exact-match score (90 × 0.6 boost) even though "robbery" is only a partial
 * title match (60 × 0.6). Returns null when the name is already a short-form crime name
 * (no degree qualifier to strip).
 */
function extractChargeBaseAlias(name: string): string | null {
  // Match "Robbery in the First Degree", "Assault in the Second Degree", etc.
  const m = name.match(/^(.+?)\s+in\s+the\s+(?:first|second|third|fourth|fifth)\s+degree$/i);
  if (m) return m[1].trim().toLowerCase();
  // Match "First-Degree Murder", "Second Degree Assault", etc.
  const m2 = name.match(/^(?:first|second|third|fourth|fifth)[- ]degree\s+(.+)$/i);
  if (m2) return m2[1].trim().toLowerCase();
  return null;
}

// Returned by expandSynonyms — keeps direct query terms separate from
// synonym-inferred terms so they can be scored at different weights.
interface ExpandedQuery {
  directTerms: string[];   // the user's actual words (full phrase + individual words)
  synonymTerms: string[];  // additional terms inferred from LEGAL_SYNONYMS
}

function expandSynonyms(query: string): ExpandedQuery {
  const normalized = normalizeText(query);
  const words = normalized.split(' ');

  const directSet = new Set<string>([normalized]);

  // For multi-word queries, individual meaningful words are direct matches.
  // LEGAL_SHORT_TERMS (dui, ice, tro, etc.) bypass the 4-char minimum.
  for (const word of words) {
    if ((word.length >= 4 || LEGAL_SHORT_TERMS.has(word)) && !STOP_WORDS.has(word)) {
      directSet.add(word);
    }
  }

  const synonymSet = new Set<string>();

  for (const term of [...words, normalized]) {
    const synonyms = LEGAL_SYNONYMS[term];
    if (synonyms) {
      for (const syn of synonyms) {
        if (!directSet.has(syn)) synonymSet.add(syn);
        // For multi-word queries, also add the phrase with the term substituted
        if (words.length > 1) {
          const replacement = normalized.replace(term, syn);
          if (!directSet.has(replacement) && replacement !== normalized) {
            synonymSet.add(replacement);
          }
        }
      }
    }
  }

  return {
    directTerms: [...directSet],
    synonymTerms: [...synonymSet].filter(s => !directSet.has(s)),
  };
}

// Escape special regex characters so expanded terms are safe to use in RegExp
function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Score one set of terms against a document's fields.
// isDirect=true → user's actual words (full weight)
// isDirect=false → synonym-expanded words (reduced weight to prevent false positives)
function scoreFields(
  terms: string[],
  normalizedTitle: string,
  normalizedContent: string,
  normalizedAliases: string[],
  normalizedTags: string[],
  normalizedHeadings: string[],
  isDirect: boolean
): { score: number; matchedTerms: string[] } {
  let score = 0;
  const matchedTerms: string[] = [];

  for (const term of terms) {
    const nt = normalizeText(term);
    if (!nt || nt.length < 2) continue;
    const prefixRe = nt.length >= 3 ? new RegExp(`\\b${escapeRegex(nt)}`, 'i') : null;

    // ── Title ──────────────────────────────────────────────────────
    if (normalizedTitle === nt) {
      score += isDirect ? 120 : 55;
      matchedTerms.push(term);
    } else if (normalizedTitle.includes(nt)) {
      score += isDirect ? 60 : 28;
      matchedTerms.push(term);
    } else if (prefixRe && prefixRe.test(normalizedTitle)) {
      // Prefix match: "bai" matches "bail", "arrai" matches "arraignment"
      score += isDirect ? 35 : 14;
      matchedTerms.push(term);
    }

    // ── Aliases (equivalent names / phrases for this document) ─────
    if (normalizedAliases.some(a => a === nt)) {
      score += isDirect ? 90 : 38;
      matchedTerms.push(term);
    } else if (normalizedAliases.some(a => a.includes(nt))) {
      score += isDirect ? 45 : 18;
      matchedTerms.push(term);
    } else if (prefixRe && normalizedAliases.some(a => prefixRe.test(a))) {
      score += isDirect ? 22 : 9;
      matchedTerms.push(term);
    }

    // ── Page section headings (e.g. "Booking", "Bail Hearing") ─────
    // Scored between aliases and tags — a heading match is a strong signal
    // that this page covers the topic the user is searching for.
    if (normalizedHeadings.length > 0) {
      if (normalizedHeadings.some(h => h === nt)) {
        score += isDirect ? 55 : 22;
        matchedTerms.push(term);
      } else if (normalizedHeadings.some(h => h.includes(nt))) {
        score += isDirect ? 30 : 12;
        matchedTerms.push(term);
      } else if (prefixRe && normalizedHeadings.some(h => prefixRe.test(h))) {
        score += isDirect ? 18 : 7;
        matchedTerms.push(term);
      }
    }

    // ── Tags (primary topic signals — weighted heavily) ─────────────
    if (normalizedTags.some(t => t === nt)) {
      // Exact tag match
      score += isDirect ? 70 : 28;
      matchedTerms.push(term);
    } else if (nt.length >= 4 && normalizedTags.some(t => t.split(' ').includes(nt))) {
      // Word-boundary partial tag match (e.g. "property" inside "property retrieval")
      // Min length 4 avoids false positives on short noise words
      score += isDirect ? 35 : 14;
      matchedTerms.push(term);
    } else if (prefixRe && nt.length >= 4 && normalizedTags.some(t => prefixRe.test(t))) {
      score += isDirect ? 18 : 7;
      matchedTerms.push(term);
    }

    // ── Content body (capped low — incidental mentions shouldn't dominate) ──
    if (normalizedContent.includes(nt)) {
      const occurrences = (normalizedContent.match(new RegExp(escapeRegex(nt), 'g')) || []).length;
      score += isDirect
        ? Math.min(occurrences * 4, 18)
        : Math.min(occurrences * 2, 8);
      matchedTerms.push(term);
    }
  }

  return { score, matchedTerms };
}

function calculateScore(
  doc: SearchDocument,
  directTerms: string[],
  synonymTerms: string[],
  language: 'en' | 'es' | 'zh'
): { score: number; matchedTerms: string[] } {
  const title = language === 'zh' && doc.titleZh ? doc.titleZh :
                language === 'es' && doc.titleEs ? doc.titleEs : doc.title;
  const content = language === 'zh' && doc.contentZh ? doc.contentZh :
                  language === 'es' && doc.contentEs ? doc.contentEs : doc.content;
  const normalizedTitle = normalizeText(title);
  const normalizedContent = normalizeText(content);
  const normalizedAliases = doc.aliases.map(a => normalizeText(a));
  const normalizedTags = doc.tags.map(t => normalizeText(t));
  const normalizedHeadings = (doc.headings || []).map(h => normalizeText(h));

  const direct = scoreFields(directTerms, normalizedTitle, normalizedContent, normalizedAliases, normalizedTags, normalizedHeadings, true);
  const syn = scoreFields(synonymTerms, normalizedTitle, normalizedContent, normalizedAliases, normalizedTags, normalizedHeadings, false);

  const typeBoosts: Record<SearchContentType, number> = {
    legal_resource: 1.3,
    rights_info: 1.2,
    expungement: 1.15,
    diversion_program: 1.15,
    glossary: 1.1,
    court: 1.0,
    mock_qa: 0.9,
    charge: 0.6,
  };

  const rawScore = direct.score + syn.score;

  // Phrase coherence bonus: when a multi-word query has ALL its meaningful
  // individual terms present in the document, the document is specifically
  // about the query rather than tangentially mentioning one term.
  // Only fires for 2+ meaningful terms; keeps the multiplier modest (1.2×)
  // so it nudges rank rather than dominating it.
  const meaningfulTerms = directTerms.filter(
    t => !t.includes(' ') && t.length >= 4 && !STOP_WORDS.has(t)
  );
  let coherenceMultiplier = 1.0;
  if (meaningfulTerms.length >= 2) {
    const allPresent = meaningfulTerms.every(t => {
      const nt = normalizeText(t);
      return (
        normalizedTitle.includes(nt) ||
        normalizedContent.includes(nt) ||
        normalizedAliases.some(a => a.includes(nt)) ||
        normalizedTags.some(tag => tag.includes(nt))
      );
    });
    if (allPresent) coherenceMultiplier = 1.2;
  }

  const score = rawScore * (typeBoosts[doc.type] || 1) * coherenceMultiplier;
  const matchedTerms = Array.from(new Set([...direct.matchedTerms, ...syn.matchedTerms]));

  return { score, matchedTerms };
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
    const instructionRef = getInstructionRef(charge);
    const instructionUrl = getInstructionUrl(charge);
    const citation = getVerifiedCitation(charge) ?? null;
    const baseAlias = extractChargeBaseAlias(charge.name);
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
      citation,
      ...(instructionRef ? { instructionRef } : {}),
      ...(instructionUrl ? { instructionUrl } : {}),
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
    // The screener (record-clearance-screener.tsx) only offers the 50 states + DC as
    // options — its state codes match rule.state directly except for the "Federal"
    // entry, which has no screener option and links to the general info page instead.
    const screenerUrl = rule.state === 'Federal'
      ? '/support/reputation'
      : `/support/reputation/eligibility?state=${rule.state}`;
    documents.push({
      id: `expungement-${rule.id}`,
      type: 'expungement',
      title: `${rule.state} Expungement Rules`,
      content: `${rule.overview}. Exclusions: ${exclusions.join(', ')}. Conditions: ${conditions.join(', ')}`,
      tags: ['expungement', 'record clearing', rule.state],
      aliases: ['expunction', 'record sealing', 'record clearing'],
      jurisdiction: rule.state,
      url: screenerUrl,
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
      url: `/case-timeline`,
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
      url: '/rights-info',
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
      url: '/rights-info',
    },
    {
      id: 'stop-frisk',
      title: 'Stop and Frisk Rights',
      titleEs: 'Derechos en Parada y Cacheo',
      content: 'Terry stop: police can briefly detain you on the street if they have reasonable suspicion of criminal activity — a hunch or your appearance alone is not enough. Pat-down for weapons: police may pat down your outer clothing only if they have reasonable suspicion you are armed and dangerous. You have the right to ask "Am I free to go?" — if yes, calmly walk away. Do not physically resist the stop even if it is unlawful. You can say: "I do not consent to this search." State your name if your state requires it. Terry v. Ohio established stop-and-frisk law.',
      tags: ['stop and frisk', 'terry stop', 'pat down', 'police stop', 'reasonable suspicion', 'fourth amendment', 'street stop'],
      aliases: ['stop and frisk', 'pat down', 'police pat down', 'can police stop me', 'terry stop', 'street stop', 'am i free to go', 'police detain me'],
      url: '/rights-info',
    },
    {
      id: 'vehicle-search',
      title: 'Vehicle Search Rights',
      titleEs: 'Derechos en Registro de Vehículo',
      content: 'During a traffic stop, police can search your car without a warrant if they have probable cause — for example, if they see contraband in plain view (plain view doctrine), smell marijuana, or have other specific facts suggesting evidence of a crime. You have the right to refuse consent to a vehicle search. Refusing consent is not grounds for arrest. Do not physically resist. If you consent, you cannot take it back. Do not leave drugs, weapons, or contraband in plain view. You can say: "I do not consent to a search of my vehicle."',
      tags: ['vehicle search', 'car search', 'traffic stop', 'probable cause', 'consent', 'fourth amendment', 'plain view', 'automobile'],
      aliases: ['can police search my car', 'car search', 'vehicle search rights', 'traffic stop search', 'pulled over search', 'search my vehicle', 'car stopped by police'],
      url: '/rights-info',
    },
    {
      id: 'home-search',
      title: 'Home Search Rights',
      titleEs: 'Derechos en Registro del Hogar',
      content: 'Police need a search warrant signed by a judge to enter and search your home. You have the right to refuse entry without a valid judicial warrant. Ask to see the warrant through the window or have it slipped under the door. Exigent circumstances — police may enter without a warrant in genuine emergencies (hot pursuit, imminent destruction of evidence, risk to life). Do not consent to a home search. An ICE administrative warrant (Form I-200 or I-205) is NOT a judicial warrant and does not give police the right to enter. Anything you say at the door can be used against you.',
      tags: ['home search', 'house search', 'warrant', 'fourth amendment', 'search warrant', 'residence', 'door', 'judicial warrant', 'exigent circumstances'],
      aliases: ['can police enter my home', 'home search warrant', 'house search', 'search my home', 'police at my door', 'do i have to let police in', 'police knock door'],
      url: '/rights-info',
    },
    {
      id: 'person-search',
      title: 'Search of Person Rights',
      titleEs: 'Derechos en Registro Personal',
      content: 'Police may search your person incident to a lawful arrest — they do not need a separate warrant. Strip search: policies vary by jurisdiction; strip searches require more than an ordinary arrest and must be conducted by an officer of the same sex and in private. Body cavity search: requires a warrant or court order except in very limited circumstances. Do not physically resist a search. You can object verbally: "I do not consent to this search." Document everything afterward and raise it with your attorney.',
      tags: ['search of person', 'strip search', 'body search', 'fourth amendment', 'search incident to arrest', 'pat down', 'personal search'],
      aliases: ['can police search me', 'search my body', 'strip search rights', 'personal search rights', 'being searched by police'],
      url: '/rights-info',
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

  const warrantSubPages = [
    {
      id: 'ice-warrant-distinction',
      title: 'ICE Administrative Warrant vs. Judicial Warrant',
      titleEs: 'Orden Administrativa ICE vs. Orden Judicial',
      titleZh: 'ICE行政令与司法令的区别',
      content: 'An ICE administrative warrant (Form I-200 or I-205) is signed by an immigration enforcement officer, not a judge. It does NOT give officers the legal right to enter your home without your consent. A judicial warrant is signed by a U.S. District Court judge or magistrate and does authorize entry. ICE administrative warrants are the most common document ICE carries. You can identify an administrative warrant because it is on DHS letterhead and signed by a "Deportation Officer" or "Immigration Enforcement Agent" — not a judge. A judicial warrant will reference a specific federal court. If officers present only an administrative warrant, you may say "I do not consent to entry" through a closed door. Fourth Amendment protections apply to all people in the United States regardless of immigration status.',
      tags: ['ICE warrant', 'administrative warrant', 'judicial warrant', 'Form I-200', 'Form I-205', 'DHS', 'fourth amendment', 'immigration enforcement', 'home entry', 'consent', 'deportation officer'],
      aliases: ['ICE at my door', 'ICE administrative warrant', 'ICE warrant vs court warrant', 'is ICE warrant valid', 'form I-200', 'form I-205', 'administrative vs judicial warrant', 'do I have to let ICE in', 'ICE enter my home', 'immigration warrant'],
      url: '/warrants#ice-warrants',
    },
    {
      id: 'at-the-door-now',
      title: 'Officers at Your Door — What to Do Right Now',
      titleEs: 'Agentes en Su Puerta — Qué Hacer Ahora Mismo',
      titleZh: '警察在门口 — 现在该怎么做',
      content: 'Do not open the door. You can speak through the door or a window. Ask: "Do you have a warrant?" Ask them to slide any warrant under the door. Look for a judge\'s signature and your specific address. If it is signed by an immigration officer rather than a judge, it is an administrative warrant and does not authorize entry without your consent. If there is no judicial warrant: say "I do not consent to entry" calmly through the door. If there is a valid judicial warrant: remain calm, invoke your right to remain silent, and contact your attorney as soon as possible. Do not physically resist even if entry is forced. Write down officer names, badge numbers, and what documents were shown as soon as it is safe.',
      tags: ['officers at door', 'police at door', 'ICE at door', 'what to do', 'warrant at door', 'do not open door', 'right now', 'emergency guidance'],
      aliases: ['police knocking door', 'ICE at door right now', 'officers knocking', 'what to do if police at door', 'should I open door for police', 'police outside my home', 'knock at door police', 'police at my house', 'law enforcement at door'],
      url: '/warrants#at-the-door',
    },
    {
      id: 'warrant-exceptions',
      title: 'When Police Don\'t Need a Warrant',
      titleEs: 'Cuándo la Policía No Necesita una Orden',
      titleZh: '警察不需要搜查令的情况',
      content: 'Courts have recognized several exceptions where police may act without a warrant. Consent: if you give permission, no warrant is needed — you have the right to refuse. Exigent circumstances: a genuine emergency such as someone in danger, a fleeing suspect, or imminent destruction of evidence. Plain view: officers already lawfully present can seize contraband they can clearly see. Search incident to lawful arrest: officers can search the person and immediate area when making a valid arrest. Vehicle searches: officers with probable cause can search a car without a warrant. Terry stop: officers with reasonable suspicion can briefly stop and pat down for weapons only. These exceptions have limits and officers sometimes claim them more broadly than courts allow. You can always state "I do not consent" — your objection is on the record even if it does not stop the search.',
      tags: ['warrant exceptions', 'exigent circumstances', 'plain view', 'consent search', 'terry stop', 'probable cause', 'fourth amendment', 'no warrant', 'search without warrant', 'reasonable suspicion'],
      aliases: ['when police don\'t need warrant', 'warrantless search', 'exigent circumstances', 'plain view doctrine', 'consent to search', 'do police always need warrant', 'exceptions to warrant requirement', 'search without warrant legal'],
      url: '/warrants#no-warrant-needed',
    },
  ];

  for (const page of warrantSubPages) {
    documents.push({
      id: `warrant-${page.id}`,
      type: 'rights_info',
      title: page.title,
      titleEs: page.titleEs,
      titleZh: page.titleZh,
      content: page.content,
      tags: page.tags,
      aliases: page.aliases,
      headings: (page as { headings?: string[] }).headings,
      url: page.url,
    });
  }
  devLog('search', `Indexed ${warrantSubPages.length} warrant sub-pages`);

  const sitePages = [
    {
      id: 'home',
      title: 'OpenDefender - Legal Guidance',
      titleEs: 'OpenDefender - Orientación Legal',
      titleZh: 'OpenDefender - 法律指导',
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
      content: 'OpenDefender mission statement. Democratizing access to legal information. Helping those who cannot afford attorneys.',
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
      content: 'How to support a loved one facing charges. Bail information. Court dates. Finding an attorney. Emotional support resources. What to do in the first 24 hours. How to find someone who was arrested. Probation and parole holds. Understanding the criminal process as a family member.',
      tags: ['family', 'support', 'loved one', 'bail', 'visiting', 'arrested family member', 'find someone in jail'],
      aliases: ['help family member', 'loved one arrested', 'my son was arrested', 'my daughter was arrested', 'spouse arrested', 'find someone arrested'],
      url: '/friends-family'
    },
    {
      id: 'friends-family-toolkit',
      title: 'Family Support Toolkit',
      titleEs: 'Kit de Herramientas de Apoyo Familiar',
      titleZh: '家庭支持工具包',
      content: 'Practical toolkit for families supporting someone through the criminal justice system. Conversation guides for jail and court. What to say and what not to say. Helping with bail. Understanding probation and parole conditions. Mock Q&A practice for court appearances. Glossary of key terms for families.',
      tags: ['family toolkit', 'family support', 'jail visit', 'court support', 'conversation guide', 'probation', 'parole', 'mock qa', 'practice questions'],
      aliases: ['family toolkit', 'support toolkit', 'helping someone in jail', 'court conversation guide', 'what to say to someone in jail', 'family court prep'],
      url: '/friends-family/toolkit'
    },
    {
      id: 'directory',
      title: 'Site Directory',
      titleEs: 'Directorio del Sitio',
      titleZh: '网站目录',
      content: 'Full directory of all OpenDefender resources. Browse all site pages and tools organized by category: get help, know your rights, find resources, life support, reference, and attorney tools.',
      tags: ['directory', 'all resources', 'site map', 'browse'],
      aliases: ['all pages', 'site directory', 'browse resources', 'full directory'],
      url: '/directory'
    },
    {
      id: 'how-to',
      title: 'How It Works — The Five Paths',
      titleEs: 'Cómo Funciona — Los Cinco Caminos',
      titleZh: '如何使用 — 五条路径',
      content: 'Detailed guide to OpenDefender\'s five main paths: First 24 Hours after arrest, Case Roadmap, Life & Family support, Immigration Rights, and helping Friends & Family who were arrested. Example journeys showing how the paths work together.',
      tags: ['guide', 'tutorial', 'how to', 'getting started', 'paths', 'friends family', 'example'],
      aliases: ['getting started', 'user guide', 'how to use', 'paths explained'],
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
      url: '/legal-aid'
    },
    {
      id: 'case-guidance',
      title: 'Case Roadmap',
      titleEs: 'Hoja de Ruta del Caso',
      titleZh: '案件路线图',
      content: 'Get guidance calibrated to your charge type, state, and case stage. Enter your jurisdiction, charges, case stage, and custody status. Understand what typically happens next, what courts look at, your rights at this stage, and what deadlines apply. Includes civil emergency triage for housing, employment, childcare, and immigration concerns.',
      tags: ['case guidance', 'case roadmap', 'charges', 'arraignment', 'pretrial', 'bail', 'sentencing', 'personalized guidance', 'case stage'],
      aliases: ['my case', 'case help', 'what happens next', 'understand my charges', 'what to expect at arraignment'],
      url: '/case-guidance'
    },
    {
      id: 'collateral-consequences',
      title: 'Arrest-Stage Risk Screener',
      titleEs: 'Verificador de Riesgos al Momento del Arresto',
      titleZh: '逮捕阶段风险筛查',
      content: 'An arrest can immediately put housing, employment, and other vital systems at risk, even before any conviction. Answer 7 quick yes-or-no questions to see what may need attention right now. Screens for housing risk, employment risk, immigration consequences, professional licenses, student aid, public benefits, and child custody. Collateral consequences of arrest. What is at risk. Housing risk from arrest. Immigration consequences of arrest. Employment risk.',
      tags: ['collateral consequences', 'housing risk', 'immigration', 'arrest risk', 'employment', 'screener', 'risk assessment', 'professional license', 'benefits', 'child custody'],
      aliases: ["what's at risk", 'housing risk', 'immigration arrest', 'collateral consequences screener', 'risk screener', 'what happens to my housing', 'will i lose my job', 'immigration consequences', 'arrest consequences'],
      url: '/collateral-consequences'
    },
    {
      id: 'process',
      title: 'Court Process Guide',
      titleEs: 'Guía del Proceso Judicial',
      titleZh: '法庭流程指南',
      content: 'Understanding the court process. Arraignment. Bail hearings. Pretrial. Plea deals. Trial. Sentencing. Mock Q&A practice.',
      tags: ['court process', 'arraignment', 'trial', 'sentencing', 'plea'],
      aliases: ['what to expect', 'court steps'],
      url: '/case-timeline'
    },
    {
      id: 'search-seizure-page',
      title: 'Search and Seizure Guide',
      titleEs: 'Guía de Registro e Incautación',
      titleZh: '搜查与扣押指南',
      content: 'Your Fourth Amendment rights against unreasonable searches and seizures. Phone search and digital privacy — police need a warrant to search your cell phone. Stop and frisk rights during police encounters. Vehicle search rights during traffic stops. Home search — how to respond when police come to your door. Search of person rights including pat-downs and strip searches. When police need a warrant. How to refuse consent. What to say when police ask to search.',
      tags: ['search', 'seizure', 'fourth amendment', 'warrant', 'police', 'phone search', 'stop and frisk', 'vehicle search', 'home search', 'traffic stop', 'consent', 'digital privacy'],
      aliases: ['police search', 'can police search', 'phone search', 'cell phone search', 'stop and frisk', 'traffic stop', 'search my car', 'search my home', 'refuse search'],
      headings: ['Phone search and digital privacy', 'Can police search my cell phone', 'Stop and frisk', 'Terry stop', 'Traffic stop and vehicle search', 'Home search', 'Search of person', 'Pat-down', 'Strip search', 'How to refuse consent', 'What to say when police ask to search', 'When police need a warrant'],
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
      headings: ['Arrest', 'Booking', 'Arraignment', 'Preliminary hearing', 'Pretrial motions', 'Pretrial', 'Bail hearing', 'Plea bargaining', 'Plea deal', 'Trial', 'Jury selection', 'Sentencing', 'Sentencing guidelines', 'Appeal', 'Your rights at each stage', 'Speedy trial', 'Public defender'],
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
      url: '/rights-info'
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
      url: '/support/reputation'
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
      id: 'letter-generator',
      title: 'Letter Generator — Employer, Landlord & Utility Letters',
      titleEs: 'Generador de Cartas — Empleador, Arrendador y Servicios',
      titleZh: '信件生成器 — 雇主、房东和公用事业信件',
      content: 'AI-powered letter generator for non-legal communication. Write personalized letters to employers requesting court date leave, explaining an absence, or disclosing a criminal record. Write letters to landlords requesting a payment plan or notifying of changed circumstances. Write letters to utility companies requesting hardship assistance. Not legal advice — practical communication support.',
      tags: ['letter', 'communication', 'employer letter', 'landlord letter', 'utility letter', 'payment plan', 'court time off', 'record disclosure', 'hardship', 'writing help'],
      aliases: ['write a letter', 'letter to employer', 'letter to landlord', 'rent deferral letter', 'court date leave', 'record disclosure letter', 'hardship letter', 'utility payment plan'],
      url: '/letter-generator'
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
      content: 'Help with court logistics. Transportation to court, childcare during hearings, what to wear, what to bring, courthouse navigation, interpreter services. Getting your property back after arrest — personal belongings phone wallet keys cash ID inventoried at evidence unit of arresting precinct. Vehicle towed after arrest, contact towing company directly, storage fees accumulate daily. ID replacement after arrest, replacing driver license state ID Social Security card. Court-ordered programs verification, community service hours documentation. What happens if late to court, bench warrant, interpreter services.',
      tags: ['court logistics', 'transportation', 'childcare', 'courthouse', 'interpreter', 'what to wear', 'property retrieval', 'get property back', 'belongings', 'evidence unit', 'precinct', 'vehicle towed', 'ID replacement', 'court-ordered programs', 'community service'],
      aliases: ['getting to court', 'court preparation', 'courthouse help', 'court day', 'get belongings back', 'get property back after arrest', 'property retrieval', 'towed car after arrest', 'ID replacement after arrest', 'court ordered program', 'verify community service'],
      headings: ['What to wear to court', 'What to bring to court', 'Transportation to court', 'Childcare during hearings', 'Interpreter services', 'Getting your property back after arrest', 'Evidence unit', 'Personal belongings retrieval', 'Vehicle towed after arrest', 'ID replacement after arrest', 'Replacing your driver license', 'Replacing your Social Security card', 'Court-ordered programs', 'Community service documentation', 'What if you are late to court', 'Bench warrant'],
      url: '/support/court-logistics'
    },
    {
      id: 'support-mental-health',
      title: 'Mental Health & Treatment Resources',
      titleEs: 'Recursos de Salud Mental y Tratamiento',
      titleZh: '心理健康与治疗资源',
      content: 'Mental health and drug treatment resources for people in the criminal justice system. Counseling, crisis hotlines, substance use treatment, anger management programs, and trauma support. Includes a treatment connection guide: how to find and enroll in a drug treatment or mental health program before sentencing, which courts consider favorably. Templates for enrollment documentation letters and attorney notification. SAMHSA treatment locator guidance.',
      tags: ['mental health', 'drug treatment', 'substance abuse', 'counseling', 'therapy', 'crisis', 'anger management', 'treatment before sentencing', 'rehabilitation', 'SAMHSA'],
      aliases: ['therapy', 'counseling', 'crisis hotline', 'drug treatment program', 'substance abuse help', 'anger management class', 'rehab', 'treatment program', 'enroll in treatment before court', 'show judge treatment'],
      url: '/support/mental-health'
    },
    {
      id: 'support-transportation',
      title: 'Transportation Support Resources',
      titleEs: 'Recursos de Apoyo de Transporte',
      titleZh: '交通支持资源',
      content: 'How to get to court, probation check-ins, and legal appointments when you have no car. Free and low-cost options: nonprofit court ride programs, bus pass assistance, rideshare subsidies, volunteer driver networks, and public transit trip planning. What to do if you will be late to court due to transportation — call your attorney immediately, transportation is not typically an excuse for missing a court date but documentation matters. Getting to probation or parole check-in appointments: missing a check-in can trigger a violation, so ask your officer in advance about transportation difficulties. Courthouse parking, ADA accessible transportation, and interpreter coordination for appointments.',
      tags: ['transportation', 'rides', 'court transportation', 'bus pass', 'rideshare', 'getting to court', 'probation check-in', 'parole check-in', 'late to court', 'court ride', 'volunteer driver', 'ADA transportation'],
      aliases: ['ride to court', 'free transportation', 'bus pass help', 'court ride', 'how do I get to court', 'no car for court', 'missing court transportation problem', 'probation appointment transportation', 'parole check-in transportation', 'late to court transportation'],
      headings: ['Free rides to court', 'Bus pass assistance', 'What to do if you will be late', 'Probation and parole check-in transportation', 'ADA accessible transportation'],
      url: '/support/transportation'
    },
    {
      id: 'support-childcare',
      title: 'Childcare Support Resources',
      titleEs: 'Recursos de Apoyo para el Cuidado de Niños',
      titleZh: '儿童照顾支持资源',
      content: 'Finding childcare when you have court hearings, probation appointments, attorney meetings, or are dealing with a legal case. Emergency childcare options for same-day court dates. Subsidized daycare and Head Start programs for income-eligible families. Childcare voucher programs through local social services. What to tell the daycare if your schedule is unpredictable due to your case. If you are detained or incarcerated: who can care for your children, emergency custody arrangements, and how to prevent termination of parental rights by staying in contact through legal mail and phone calls. Your children\'s school has obligations to notify you of important events even if you are incarcerated. Rights of incarcerated parents regarding child protective services (CPS) proceedings.',
      tags: ['childcare', 'child care', 'kids', 'children', 'parenting', 'court hearing childcare', 'emergency childcare', 'head start', 'childcare voucher', 'subsidized daycare', 'incarcerated parent', 'CPS', 'parental rights', 'DCFS'],
      aliases: ['childcare during court', 'babysitter help', 'child care assistance', 'kids during hearings', 'who watches my kids during court', 'childcare emergency', 'no babysitter for court', 'children while in jail', 'parental rights incarceration', 'CPS and arrest', 'children when parent arrested'],
      headings: ['Emergency childcare for court', 'Subsidized childcare programs', 'Head Start eligibility', 'If you are detained or incarcerated', 'Parental rights and CPS', 'Preventing termination of parental rights'],
      url: '/support/childcare'
    },
    {
      id: 'support-housing',
      title: 'Housing Support Resources',
      titleEs: 'Recursos de Apoyo de Vivienda',
      titleZh: '住房支持资源',
      content: 'Housing assistance for renters, homeowners, and people experiencing housing instability. Tenant rights, fair chance housing, eviction defense, mortgage forbearance guidance, CFPB homeowner resources, HUD housing counseling, transitional and emergency housing, homelessness resources, and guidance on maintaining a mailing address for court notices.',
      tags: ['housing', 'shelter', 'reentry housing', 'fair chance housing', 'eviction', 'homelessness', 'mortgage', 'foreclosure', 'homeowner', 'forbearance', 'rent', 'landlord', 'unstable housing', 'emergency housing'],
      aliases: ['find housing', 'reentry housing', 'housing with record', 'fair chance apartment', 'homeless shelter', 'missed mortgage payment', 'mortgage help', 'foreclosure help', 'cant pay rent', 'cant pay mortgage', 'housing instability', 'no housing', 'emergency shelter'],
      url: '/support/housing'
    },
    {
      id: 'support-family-care',
      title: 'Family Care Support Resources',
      titleEs: 'Recursos de Apoyo para el Cuidado Familiar',
      titleZh: '家庭照顾支持资源',
      content: 'Support for maintaining family bonds during a criminal case or incarceration. Visitation rights: how to get on the visitor list, what ID is required, what you can and cannot bring, dress code requirements. Phone calls from jail: how calls are monitored and recorded, rate assistance programs, what never to say on a jail call. Letters and legal mail: the difference between regular mail (monitored) and legal mail from attorneys (confidential). Parental rights: your rights as a parent during incarceration, how to participate in custody hearings from jail via video, how to stay on your children\'s school contact list. Family counseling resources. Reunification services after release. Emergency planning: who will care for elderly or disabled family members if you are detained.',
      tags: ['family', 'family care', 'visitation', 'parental rights', 'incarceration family', 'family counseling', 'prison visitation', 'jail phone calls', 'legal mail', 'family reunification', 'elderly care', 'custody hearing from jail'],
      aliases: ['visit someone in jail', 'parental rights incarceration', 'family support', 'maintain family contact', 'keep in touch from jail', 'visit someone in prison', 'will I lose parental rights', 'custody while in jail', 'phone calls from jail', 'jail mail rules', 'family during incarceration'],
      headings: ['Visitation rights', 'Getting on the visitor list', 'Phone calls from jail', 'Legal mail vs regular mail', 'Parental rights during incarceration', 'Custody hearings from jail', 'Family reunification after release', 'Emergency family planning'],
      url: '/support/family-care'
    },
    {
      id: 'support-reputation',
      title: 'Reputation, Record, and Background Check Support',
      titleEs: 'Apoyo para la Reputación, Registro y Verificación de Antecedentes',
      titleZh: '声誉、记录和背景调查支持',
      content: 'Resources to manage and rebuild reputation after a criminal record. Expungement and record sealing eligibility screener. Clean Slate automatic clearance programs (8 states with active programs). FCRA rights when a background check is run: pre-adverse action notice, 7-year lookback rule, how to dispute errors. Rap sheet error identification: missing dispositions, improperly unsealed records, unrecorded warrant vacaturs. Certificates of relief from collateral consequences. Mugshot removal. Handling conversations with employers and family.',
      tags: ['reputation', 'record', 'expungement', 'record sealing', 'background check', 'FCRA', 'Clean Slate', 'certificates of relief', 'rap sheet errors', 'background check dispute', 'automatic clearance', 'collateral consequences'],
      aliases: ['clear criminal record', 'expunge record', 'seal record', 'background check dispute', 'dispute background check error', 'FCRA rights', 'certificate of relief', 'clean slate', 'rap sheet', 'missing disposition', 'mugshot removal', 'employer background check'],
      headings: ['Expungement eligibility screener', 'Record sealing', 'Clean Slate automatic clearance', 'FCRA rights', 'Pre-adverse action notice', 'Background check dispute', '7-year lookback rule', 'Rap sheet errors', 'Missing disposition', 'Improperly unsealed records', 'Certificates of relief', 'Mugshot removal', 'Talking to employers about your record'],
      url: '/support/reputation'
    },
    {
      id: 'support-reentry',
      title: 'Re-entry Resources',
      titleEs: 'Recursos de Reinserción',
      titleZh: '重返社会资源',
      content: 'Resources for people leaving incarceration or completing a sentence. Covers ID restoration (birth certificate, Social Security card, state ID), housing with a criminal record, employment and Ban the Box rights, and voting rights restoration. Includes verified national resources and state-by-state guidance on voting eligibility.',
      tags: ['reentry', 're-entry', 'after incarceration', 'after release', 'ID restoration', 'voting rights', 'housing with record', 'employment with record', 'ban the box', 'fair chance', 'voting restoration', 'social security card', 'birth certificate', 'state ID'],
      aliases: ['after prison', 'getting out of jail', 'life after arrest', 'getting ID after prison', 'voting after felony', 'housing after prison', 'jobs with criminal record', 'ban the box', 'fair chance housing', 'restore voting rights'],
      url: '/support/reentry'
    },
    {
      id: 'support-personal-health',
      title: 'Personal Health Support Resources',
      titleEs: 'Recursos de Apoyo de Salud Personal',
      titleZh: '个人健康支持资源',
      content: 'Access to healthcare for people involved in the criminal justice system. Prescription medications: how to maintain access to prescriptions if detained, what to tell jail medical staff on intake, your right to necessary medications while incarcerated. Health insurance: arrest alone does not automatically terminate Medicaid (ACA protections). How to enroll in Medicaid after release. Free clinics and community health centers that serve people regardless of insurance status. CHIP for children of people involved in the system. Dental care and mental health services. Marketplace insurance enrollment during special enrollment periods triggered by release. Managing chronic conditions (diabetes, HIV, hypertension) during incarceration. Requesting medical care in jail: how to file a sick call request. ADA rights for people with disabilities in the criminal justice system.',
      tags: ['personal health', 'healthcare', 'medical', 'health insurance', 'medicaid', 'free clinic', 'prescription', 'health care', 'prescription access', 'medication in custody', 'CHIP', 'dental care', 'community health center', 'ADA disability', 'chronic condition', 'sick call'],
      aliases: ['health care help', 'free medical care', 'doctor help', 'health insurance help', 'medicaid enrollment', 'medical assistance', 'medication while in jail', 'lose health insurance arrested', 'medicaid after release', 'free clinic near me', 'prescription in jail', 'jail sick call', 'dental care low income', 'disability rights jail'],
      headings: ['Prescription medications in custody', 'Medicaid and ACA protections', 'Enrolling in Medicaid after release', 'Free clinics and community health centers', 'CHIP for children', 'Dental care', 'Mental health services', 'Managing chronic conditions while incarcerated', 'ADA rights in the criminal justice system'],
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
      content: 'Privacy policy for OpenDefender. How we protect your data. Data ephemerality. No personal information stored. Session-based privacy.',
      tags: ['privacy', 'policy', 'data', 'security'],
      aliases: ['data privacy', 'privacy statement'],
      url: '/privacy-policy'
    },
    {
      id: 'disclaimers',
      title: 'Legal Disclaimers',
      titleEs: 'Descargos de Responsabilidad',
      titleZh: '法律免责声明',
      content: 'Legal disclaimers for OpenDefender. Not a substitute for legal counsel. Educational purposes only. Limitation of liability.',
      tags: ['disclaimer', 'legal notice', 'terms'],
      aliases: ['terms of use', 'legal notice', 'not legal advice'],
      url: '/disclaimers'
    },
    {
      id: 'right-to-counsel',
      title: 'Right to an Attorney',
      titleEs: 'Derecho a un Abogado',
      titleZh: '获得律师的权利',
      content: 'When does your right to an attorney begin? Fifth Amendment vs Sixth Amendment right to counsel. Custodial interrogation triggers 5th Amendment — you must be in custody and being questioned. Sixth Amendment kicks in after formal charges are filed at arraignment or indictment. Detention vs custody vs arrest — they are not the same. A brief police stop may not trigger Miranda rights. Voluntary encounter: you are free to leave. Custodial interrogation: you are not free to leave and are being questioned. Miranda warning required. Invoke your right clearly: "I want a lawyer. I will not answer questions without a lawyer present." All questioning must stop immediately. Police cannot try again later or send a different officer. Lawyer during questioning vs lawyer at trial — different protections. Public defender appointed if you cannot afford an attorney. Right to counsel does not apply in civil cases or immigration removal. Grand jury testimony: no right to have attorney in the room. Unclear situations: home visits, being in a police car, workplace questioning, juvenile questioning.',
      tags: ['attorney', 'lawyer', 'right to counsel', 'fifth amendment', 'sixth amendment', 'miranda', 'custodial interrogation', 'custody', 'detention', 'arrest', 'public defender', 'invoke rights', 'interrogation'],
      aliases: ['when does right to attorney start', 'right to counsel', 'do i need a lawyer', 'can i get a lawyer', 'fifth vs sixth amendment', 'miranda rights attorney', 'invoke right to counsel', 'ask for lawyer', 'attorney during questioning', 'lawyer during interrogation', 'when to ask for lawyer'],
      headings: ['Fifth Amendment right to counsel', 'Sixth Amendment right to counsel', 'When does your right to a lawyer begin', 'Custodial interrogation', 'Detention vs custody vs arrest', 'How to invoke your right to a lawyer', 'What happens after you invoke', 'Lawyer during questioning vs lawyer at trial', 'Public defender appointment', 'Grand jury testimony', 'Juvenile questioning'],
      url: '/right-to-counsel'
    },
    {
      id: 'warrants',
      title: 'Warrants & Your Rights',
      titleEs: 'Órdenes Judiciales y Sus Derechos',
      titleZh: '搜查令与您的权利',
      content: 'What officers need to enter your home, search your belongings, or arrest you. Search warrants, arrest warrants, ICE administrative warrants vs. judicial warrants. Your rights when officers have a warrant and when they do not. When no warrant is needed. Documented concerns about immigration enforcement. What to do at the door.',
      tags: ['warrant', 'search warrant', 'arrest warrant', 'ICE warrant', 'administrative warrant', 'judicial warrant', 'fourth amendment', 'home entry', 'immigration enforcement', 'consent', 'exigent circumstances', 'terry stop', 'no warrant', 'rights at home', 'I-200', 'I-205', 'border zone', 'expedited removal'],
      aliases: ['can police enter without warrant', 'do I have to open door', 'ICE at my door', 'warrant requirements', 'when do police need warrant', 'administrative vs judicial warrant', 'ICE form I-200', 'search without warrant', 'what is a warrant'],
      headings: ['Search warrants', 'Arrest warrants', 'ICE administrative warrant vs judicial warrant', 'Officers at your door', 'What to do when officers arrive', 'When police do not need a warrant', 'Consent to search', 'Exigent circumstances', 'Fourth Amendment rights at home', 'Border zone and expedited removal'],
      url: '/warrants'
    },
    {
      id: 'first-24-hours',
      title: 'The First 24 Hours After Arrest',
      titleEs: 'Las Primeras 24 Horas Después del Arresto',
      titleZh: '逮捕后的前24小时',
      content: 'Step-by-step guide for the first 24 hours after arrest. At the moment of arrest: invoke your right to remain silent and ask for a lawyer immediately. Booking: cooperate with fingerprints and photos but do not answer questions about the incident. Your first phone call from jail: jail calls are recorded — call a family member, give them your facility name and booking number, ask them to find a lawyer. What never to say on a jail call. Sample script for first jail call. Facility and inmate locator by state. Bail hearing: have your attorney argue for release, mention ties to community. Getting legal representation: request a public defender if you cannot afford an attorney. Arraignment: plead not guilty — preserve your options. Between now and your next court date: attend every hearing, follow bail conditions, do not contact victims or witnesses. Do not discuss your case on social media. Who is charging you: local charges filed by city or county prosecutor — called District Attorney, State\'s Attorney, City Attorney, or County Attorney depending on the state; state charges filed by the state attorney general\'s office or state prosecutor; federal charges filed by a U.S. Attorney — these carry harsher penalties and different procedures. Understanding who brings the case against you matters for negotiating and for knowing which court your case will be in. When does your right to a lawyer actually begin: Fifth Amendment right during interrogation vs Sixth Amendment right at formal proceedings. The gap between arrest and arraignment. Right to counsel timing in California, New York, Texas, Florida, and federal courts. If you are on probation or parole: violation holds, probation officer notification, revocation hearing rights. Your first appearance before a magistrate: probable cause, bail conditions, right to counsel, how it works in each state.',
      tags: ['arrest', 'first 24 hours', 'booking', 'bail', 'arraignment', 'phone call', 'jail call', 'recorded call', 'public defender', 'attorney', 'right to remain silent', 'miranda', 'custody', 'right to counsel', 'sixth amendment', 'fifth amendment', 'probation', 'parole', 'violation', 'revocation', 'magistrate', 'first appearance', 'initial appearance', 'inmate locator', 'facility lookup', 'juvenile arrest'],
      aliases: ['just arrested', 'what to do after arrest', 'arrested now what', 'first steps after arrest', 'arrested guide', 'what happens when arrested', 'after being arrested', 'booking process', 'bail hearing guide', 'phone call from jail', 'calling from jail', 'jail call advice', 'what to say on jail call', 'when does right to lawyer begin', 'arrested on probation', 'arrested on parole', 'first court appearance', 'magistrate hearing', 'find someone in jail', 'inmate locator'],
      headings: ['At the moment of arrest', 'Booking', 'Your first phone call from jail', 'Jail phone call script', 'What never to say on a jail call', 'Inmate and facility locator', 'Bail hearing', 'Getting legal representation', 'Arraignment', 'Post-arraignment steps', 'When does your right to a lawyer begin', 'Fifth Amendment vs Sixth Amendment', 'Right to counsel timing by state', 'If you are on probation or parole', 'Violation hold', 'Revocation hearing rights', 'Your first appearance before a magistrate'],
      url: '/first-24-hours'
    },
    {
      id: 'collateral-consequences',
      title: 'Collateral Consequences Screener',
      titleEs: 'Evaluador de Consecuencias Colaterales',
      titleZh: '附带后果评估',
      content: 'Seven-question risk screener for the life areas most immediately threatened by a criminal charge. Questions cover: (1) active supervision — are you currently on probation or parole? A new arrest can trigger a revocation hold before your new case is even resolved. Probation and parole violations are treated as critical risk. (2) immigration status — non-citizens face deportation and removal risk from any conviction. (3) children and custody — arrest can affect custody arrangements and child protective services. (4) housing — arrest can trigger lease violations and eviction proceedings. (5) employment — background check flags, ban-the-box rights, job loss risk. (6) public benefits — SNAP, TANF, Section 8 housing eligibility. (7) professional licenses — occupational and professional licenses can be suspended or revoked. Results are prioritized: supervision and immigration are flagged as critical. No login required. No data stored.',
      tags: ['collateral consequences', 'parole', 'probation', 'supervision', 'revocation', 'parole violation', 'probation violation', 'active supervision', 'parole hold', 'probation hold', 'immigration', 'deportation', 'custody', 'housing', 'employment', 'benefits', 'professional license', 'screener', 'conviction consequences', 'criminal record'],
      aliases: ['on parole', 'on probation', 'active supervision', 'parole consequences', 'probation consequences', 'parole violation risk', 'probation revocation', 'what happens if arrested on parole', 'what happens if arrested on probation', 'parole hold', 'supervision hold', 'consequences of arrest', 'consequences of conviction', 'criminal record effects', 'felony consequences', 'hidden penalties', 'beyond jail time', 'conviction effects on life', 'life areas affected by arrest', 'collateral consequences check'],
      headings: ['Active supervision risk', 'Probation or parole revocation hold', 'Immigration status risk', 'Child custody impact', 'Housing risk', 'Employment risk', 'Public benefits risk', 'Professional license risk'],
      url: '/collateral-consequences'
    },
    {
      id: 'legal-aid',
      title: 'Find Legal Help: Public Defenders, Legal Aid, and Court-Appointed Attorneys',
      titleEs: 'Encontrar Ayuda Legal: Defensores Públicos, Ayuda Legal y Abogados Designados',
      titleZh: '寻找法律帮助：公设辩护人、法律援助和法院指定律师',
      content: 'Find free or low-cost legal help. Public defender offices handle criminal cases for people who cannot afford an attorney. Legal aid organizations provide free civil and criminal assistance based on income. Court-appointed private attorneys are assigned when the public defender has a conflict or is unavailable — how to find your county assigned counsel program and what to ask the court clerk. NLADA and ABA free legal help resources.',
      tags: ['legal aid', 'free lawyer', 'low cost attorney', 'pro bono', 'public defender', 'law clinic', 'income eligibility', 'free legal help', 'court appointed attorney', 'assigned counsel'],
      aliases: ['free attorney', 'free lawyer', 'legal help low income', 'cannot afford lawyer', 'pro bono attorney', 'free legal services', 'legal aid office', 'court appointed lawyer', 'assigned counsel program', 'public defender office'],
      url: '/legal-aid'
    },
    {
      id: 'after-deportation',
      title: 'After Deportation: Help for Families',
      titleEs: 'Después de la Deportación: Ayuda para Familias',
      titleZh: '被驱逐后：家庭帮助',
      content: 'Practical help after a deportation removal order. For the person removed: first steps, documents, receiving money. For family in the US: staying in contact, emergency finances, children\'s rights, school. Key organizations including Al Otro Lado, RAICES, NILC. FAQ on reentry bars, bank accounts, Social Security, grew up in US.',
      tags: ['deportation', 'removal', 'family separation', 'after deportation', 'deported', 'immigration'],
      aliases: ['deported family', 'after removal', 'deportation help', 'family reunification'],
      url: '/immigration-guidance/after-deportation'
    },
    {
      id: 'record-clearance-screener',
      title: 'Record Clearance Eligibility Screener',
      titleEs: 'Evaluador de Elegibilidad para Eliminación de Antecedentes',
      titleZh: '记录清除资格评估',
      content: 'Step-by-step decision tree to check eligibility for record expungement, sealing, or automatic Clean Slate clearance. Covers arrest-only records, misdemeanors, felonies, and marijuana offenses. No data stored.',
      tags: ['expungement', 'record sealing', 'clean slate', 'criminal record', 'eligibility', 'screener'],
      aliases: ['record clearing', 'expunge my record', 'seal my record', 'clean slate eligibility', 'can I expunge'],
      url: '/support/reputation/eligibility'
    },
    {
      id: 'pd-intake-form',
      title: 'Public Defender Intake Form',
      titleEs: 'Formulario de Ingreso del Defensor Público',
      titleZh: '公设辩护人入档表格',
      content: 'Printable intake form to bring to your first public defender meeting. Covers background information: personal details, housing, employment, dependents, prior legal history, and immigration concerns. Does not collect case facts. Print and fill out by hand.',
      tags: ['public defender', 'intake form', 'first meeting', 'attorney', 'preparation'],
      aliases: ['public defender form', 'intake form', 'first meeting preparation', 'what to bring public defender'],
      url: '/support/court-logistics/intake-form'
    },
    {
      id: 'court-date-guide',
      title: 'Court Date Guide: How to Track and Not Miss Your Court Date',
      titleEs: 'Guía de Fechas de Tribunal',
      titleZh: '法庭日期指南',
      content: 'How to confirm court dates in writing, set up redundant reminders, find transportation, and what to do if you have missed a court date. Third-party reminder services including The Bail Project. What to bring and how to prepare on the day of court.',
      tags: ['court date', 'bench warrant', 'failure to appear', 'reminder', 'transportation', 'bail project'],
      aliases: ['court reminder', 'missed court date', 'bench warrant', 'court appearance', 'what to bring to court'],
      url: '/support/court-logistics/court-date-guide'
    },
    {
      id: 'bail-preparation',
      title: 'Pretrial Release Advocacy Toolkit: Prepare for Your Bail Hearing',
      titleEs: 'Herramientas para la Audiencia de Fianza',
      titleZh: '保释听证准备工具包',
      content: 'How to prepare for a bail hearing. What judges consider: community ties, employment, housing, support network. Documentation checklist. Letter templates: employer support letter, character reference, family support statement. Types of release: ROR, cash bail, bail bond, conditional release. Bail fund resources including The Bail Project and National Bail Fund Network.',
      tags: ['bail', 'pretrial', 'bail hearing', 'release', 'ROR', 'bail bond', 'pretrial detention', 'arraignment', 'bail preparation'],
      aliases: ['bail hearing', 'get out of jail', 'pretrial release', 'release on recognizance', 'reduce bail', 'bail help'],
      headings: ['What judges consider at bail', 'Community ties', 'Employment and housing', 'Documentation checklist', 'Employer support letter', 'Character reference letter', 'Family support statement', 'Release on recognizance', 'Cash bail', 'Bail bond', 'Conditional release', 'Bail fund resources'],
      url: '/support/court-logistics/bail-preparation'
    },
    {
      id: 'treatment-connection',
      title: 'Drug Treatment and Mental Health Programs: Connect Before Sentencing',
      titleEs: 'Programas de Tratamiento y Salud Mental: Cómo Conectarse Antes de la Sentencia',
      titleZh: '药物治疗和心理健康项目：判决前建立联系',
      content: 'How to find and enroll in drug treatment, mental health counseling, or anger management programs before your court date. Courts often consider proactive enrollment when deciding outcomes in drug and other cases. Checklist of steps to take before next court date. How to document enrollment for your attorney. SAMHSA treatment locator. Anger management: how to find a court-approved program and verify eligibility. Templates: phone script for calling programs, enrollment confirmation letter request, attorney notification message.',
      tags: ['drug treatment', 'mental health treatment', 'anger management', 'treatment before sentencing', 'rehabilitation', 'SAMHSA', 'enrollment documentation', 'court approved program', 'proactive treatment'],
      aliases: ['find drug treatment', 'enroll in treatment', 'drug program before court', 'anger management court', 'mental health program', 'show judge I am in treatment', 'rehabilitation program', 'SAMHSA locator', 'treatment enrollment letter'],
      url: '/support/mental-health#treatment-connection'
    },
    {
      id: 'fcra-background-check-rights',
      title: 'Your Rights When a Background Check Is Run (FCRA)',
      titleEs: 'Sus Derechos Cuando Se Realiza una Verificación de Antecedentes',
      titleZh: '背景调查时您的权利',
      content: 'Federal rights under the Fair Credit Reporting Act when an employer runs a background check. Pre-adverse action notice requirement: employer must give you a copy of the report before rejecting you. How to dispute background check errors. 7-year lookback rule for criminal records. How to get a free copy of your background check report. CFPB and EEOC resources.',
      tags: ['FCRA', 'background check', 'background check rights', 'adverse action', 'background check dispute', 'employer background check', 'criminal record employment'],
      aliases: ['background check denied job', 'dispute background check', 'background check error', 'employer used background check', 'adverse action notice', 'FCRA rights', 'pre adverse action'],
      url: '/support/reputation#fcra-rights'
    },
    {
      id: 'certificates-of-relief',
      title: 'Certificates of Relief from Collateral Consequences',
      titleEs: 'Certificados de Alivio de Consecuencias Colaterales',
      titleZh: '附带后果救济证书',
      content: 'Certificates of relief lift specific legal barriers caused by a conviction without erasing the record. Available in approximately 20 states including New York, Ohio, Illinois, North Carolina, New Jersey, California, Tennessee, Colorado, and Nevada. How to find out if your state has a certificate program, who qualifies, how to apply, and what barriers can be lifted for employment and licensing.',
      tags: ['certificate of relief', 'collateral consequences', 'conviction consequences', 'employment with record', 'occupational license conviction', 'certificate of good conduct'],
      aliases: ['certificate of relief', 'certificate of good conduct', 'remove barriers conviction', 'employment after conviction', 'license after conviction', 'collateral consequences relief'],
      url: '/support/reputation#certificates-of-relief'
    },
    {
      id: 'rap-sheet-errors',
      title: 'Check Your Criminal Record for Errors',
      titleEs: 'Revise su Historial Penal en Busca de Errores',
      titleZh: '检查您的犯罪记录是否有错误',
      content: 'Research shows more than 60% of criminal records contain significant errors. How to request your FBI Identity History Summary and state criminal history. Three common errors: missing dispositions (arrest without recorded outcome), improperly unsealed records, unrecorded warrant vacaturs. How to submit corrections to the FBI and state repositories. Errors affect bail amounts, plea offers, housing, and employment.',
      tags: ['rap sheet', 'criminal record errors', 'missing disposition', 'record correction', 'FBI record request', 'state criminal history', 'background check errors'],
      aliases: ['rap sheet error', 'wrong criminal record', 'fix criminal record', 'missing disposition', 'FBI identity history summary', 'correct criminal record', 'criminal record mistake'],
      url: '/support/reputation#rap-sheet'
    },
    {
      id: 'for-advocates',
      title: 'Advocate Toolkit: Tools for Public Defenders and Legal Aid Attorneys',
      titleEs: 'Herramientas para Abogados Defensores y Ayuda Legal',
      titleZh: '辩护人工具包',
      content: 'Free browser-based tools for public defenders and legal aid attorneys. No login required. No backend calls. Includes the Public Defender Intake Checklist — a comprehensive first-meeting form covering case identifiers, probation and parole status, warrant status, immigration status with automatic Padilla review flag for non-citizens, housing, mental health, substance use, medications if detained, dependents, and document collection. Also includes the Mitigation Memo Builder — structures sentencing mitigation information including community ties, housing, employment, treatment history, family responsibilities, and character references into a formatted court memo. Both tools export to .docx.',
      tags: ['advocate', 'public defender', 'attorney tools', 'intake checklist', 'mitigation memo', 'legal aid', 'defense attorney', 'criminal defense', 'sentencing mitigation', 'Padilla', 'probation', 'parole'],
      aliases: ['advocate toolkit', 'defense attorney tools', 'public defender intake', 'mitigation memo builder', 'lawyer tools', 'intake checklist for attorneys', 'sentencing mitigation memo', 'pd tools'],
      url: '/for-advocates'
    },
    {
      id: 'for-advocates-intake',
      title: 'Public Defender Intake Checklist',
      titleEs: 'Lista de Verificación de Ingreso del Defensor Público',
      titleZh: '公设辩护人入档清单',
      content: 'Comprehensive first-meeting intake checklist for public defenders and legal aid attorneys. Covers case identifiers, current probation or parole status, warrant status, immigration status with automatic Padilla review flag for non-citizens, housing stability, mental health and substance use screening, medications if client is detained, dependents and family obligations, prior legal history, and document collection checklist. Automatic flag computation raises critical alerts for probation and parole holds, immigration exposure, and mental health crisis situations. Exportable to .docx. No data stored.',
      tags: ['public defender', 'intake checklist', 'first meeting', 'attorney tools', 'probation', 'parole', 'immigration', 'Padilla', 'mental health', 'substance use', 'client intake', 'criminal defense', 'warrant status'],
      aliases: ['public defender intake', 'attorney intake checklist', 'first meeting checklist', 'client intake form', 'PD intake', 'Padilla review', 'defense attorney intake form'],
      url: '/for-advocates/intake-checklist'
    },
    {
      id: 'for-advocates-mitigation',
      title: 'Mitigation Memo Builder',
      titleEs: 'Constructor de Memorando de Mitigación',
      titleZh: '量刑减轻备忘录生成器',
      content: 'Browser-based tool for public defenders to structure sentencing mitigation information into a formatted memo for the court. Input fields for community ties, housing stability, employment history, drug treatment or mental health program enrollment, family responsibilities and dependents, and character references. The tool formats content — it does not generate or embellish. Exportable to .docx. No AI, no login, no backend calls.',
      tags: ['mitigation', 'sentencing mitigation', 'mitigation memo', 'attorney tools', 'sentencing', 'public defender', 'criminal defense', 'character references', 'treatment history', 'community ties'],
      aliases: ['mitigation memo', 'sentencing memo', 'mitigation letter', 'sentencing mitigation memo builder', 'character letter for court', 'mitigation document', 'defense mitigation'],
      url: '/for-advocates/mitigation-builder'
    },
    {
      id: 'case-timeline',
      title: 'Criminal Case Process: Stage-by-Stage Timeline',
      titleEs: 'Proceso Penal: Cronograma por Etapas',
      titleZh: '刑事案件流程：逐阶段时间表',
      content: 'Interactive visual timeline of the 7 stages of a criminal case: arrest, booking, arraignment, pretrial hearings, plea or trial, sentencing, and post-conviction. Each stage describes what happens, your rights at that stage, and practical tips. Includes accordion guides for bail and plea bargains. Speedy trial and public defender information cards. State-specific callouts for major jurisdictions. Mock Q&A practice questions for each proceeding. Available in English, Spanish, and Chinese.',
      tags: ['case timeline', 'criminal case process', 'arraignment', 'booking', 'trial', 'sentencing', 'plea', 'pretrial', 'post-conviction', 'case stages', 'court process'],
      aliases: ['criminal case timeline', 'what happens in a criminal case', 'case stages', 'court process explained', 'steps in criminal case', 'criminal process guide', 'how does a criminal case work', 'what to expect in court'],
      headings: ['Arrest', 'Booking', 'Arraignment', 'Pretrial hearings', 'Plea hearing', 'Trial', 'Sentencing', 'Post-conviction', 'Bail guide', 'Plea bargain guide', 'Speedy trial rights', 'Public defender'],
      url: '/case-timeline'
    },
    {
      id: 'immigration-guidance',
      title: 'Immigration Rights and Criminal Cases',
      titleEs: 'Derechos de Inmigración y Casos Penales',
      titleZh: '移民权利与刑事案件',
      content: 'Know your rights during immigration enforcement. ICE encounters: do not open the door without a judicial warrant. Right to remain silent. Do not sign anything without an attorney. If you are undocumented and arrested: you have the same Fifth and Sixth Amendment rights as citizens. Plead not guilty at arraignment. Immigration detainer (ICE hold): local jails may hold you extra time. Deportation consequences of a criminal conviction — for non-citizens, any conviction can trigger removal proceedings. Padilla v. Kentucky: your criminal defense attorney is required to advise you about immigration consequences of a plea. USCIS adjustment of status policy update May 2026.',
      tags: ['immigration', 'ice', 'deportation', 'undocumented', 'immigration enforcement', 'right to remain silent', 'Padilla', 'removal', 'ice hold', 'immigration detainer', 'criminal immigration', 'adjustment of status', 'ice warrant'],
      aliases: ['ice encounter', 'undocumented rights', 'ice arrest', 'immigration rights', 'criminal and immigration', 'deportation after conviction', 'padilla warning', 'immigration hold', 'ice detainer', 'what are my rights if undocumented'],
      headings: ['ICE at your door', 'If you are undocumented and arrested', 'Immigration detainer', 'Deportation risk from conviction', 'Padilla v. Kentucky', 'Adjustment of status policy update'],
      url: '/immigration-guidance'
    },
    {
      id: 'how-to',
      title: 'How OpenDefender Works: Five Paths Through the System',
      titleEs: 'Cómo Funciona OpenDefender: Cinco Caminos',
      titleZh: 'OpenDefender如何工作：五条路径',
      content: 'Explainer for five different user journeys through the platform. Path 1: Just arrested — start with First 24 Hours, then case guidance and collateral consequences screener. Path 2: Supporting a loved one — start with Friends and Family. Path 3: Facing trial or sentencing — use case timeline, bail preparation, and court Q&A practice. Path 4: Dealing with collateral consequences including probation, parole, immigration, housing, employment, and benefits — use the collateral consequences screener. Path 5: Attorney or advocate — use the advocate toolkit. Also explains the AI guidance system, privacy protections, and how to find a public defender.',
      tags: ['how it works', 'getting started', 'five paths', 'overview', 'explainer', 'guide', 'navigation'],
      aliases: ['how to use this site', 'getting started', 'what does this site do', 'site overview', 'help guide', 'where do I start'],
      url: '/how-to'
    },
    {
      id: 'directory',
      title: 'Site Directory: All Pages and Resources',
      titleEs: 'Directorio del Sitio: Todas las Páginas y Recursos',
      titleZh: '网站目录：所有页面和资源',
      content: 'Complete directory of all pages, tools, and resources on OpenDefender. Organized by topic: rights, support, records, immigration, court preparation, and advocate tools.',
      tags: ['directory', 'site map', 'all pages', 'overview', 'navigation'],
      aliases: ['site directory', 'site map', 'all resources', 'all pages', 'index', 'what pages are on this site'],
      url: '/directory'
    },
  ];

  // Support, resource, and logistics pages get 'legal_resource' type
  // so they surface above charges in topic searches
  const LEGAL_RESOURCE_PAGE_IDS = new Set([
    'support-hub', 'support-employment', 'support-finances', 'support-court-logistics',
    'support-mental-health', 'support-transportation', 'support-childcare', 'support-housing',
    'support-family-care', 'support-reputation', 'support-reentry', 'support-personal-health',
    'resources', 'friends-family', 'friends-family-toolkit', 'legal-aid', 'recap-extensions',
    'document-library', 'document-summarizer', 'attorney-portal', 'attorney-playbooks',
    'court-locator', 'record-clearance-screener', 'pd-intake-form', 'court-date-guide', 'bail-preparation',
    'treatment-connection', 'fcra-background-check-rights', 'certificates-of-relief', 'rap-sheet-errors',
    // Collateral consequences screener — legal_resource so it surfaces above charges
    'collateral-consequences',
    // Advocate toolkit pages
    'for-advocates', 'for-advocates-intake', 'for-advocates-mitigation',
    // Case timeline and immigration guidance
    'case-timeline', 'immigration-guidance',
    // Navigation / directory pages
    'how-to', 'directory',
  ]);

  for (const page of sitePages) {
    documents.push({
      id: `page-${page.id}`,
      type: LEGAL_RESOURCE_PAGE_IDS.has(page.id) ? 'legal_resource' : 'rights_info',
      title: page.title,
      titleEs: page.titleEs,
      titleZh: page.titleZh,
      content: page.content,
      tags: page.tags,
      aliases: page.aliases,
      headings: (page as { headings?: string[] }).headings,
      url: page.url,
    });
  }
  devLog('search', `Indexed ${sitePages.length} site pages`);

  searchIndex = documents;
  buildFuzzyVocabulary();
  indexReady = true;
  const elapsed = Date.now() - startTime;
  devLog('search', `Search index built: ${documents.length} documents, ${fuzzyVocabulary.size} vocab words in ${elapsed}ms`);
}

function runScoring(
  docs: SearchDocument[],
  directTerms: string[],
  synonymTerms: string[],
  filters: SearchQuery['filters'],
  language: 'en' | 'es' | 'zh'
): SearchResult[] {
  const out: SearchResult[] = [];
  const MIN_SCORE_THRESHOLD = 15;
  for (const doc of docs) {
    if (filters?.types && !filters.types.includes(doc.type)) continue;
    if (filters?.jurisdiction && doc.jurisdiction && doc.jurisdiction !== filters.jurisdiction) continue;
    const { score, matchedTerms } = calculateScore(doc, directTerms, synonymTerms, language);
    if (score >= MIN_SCORE_THRESHOLD) {
      const content = language === 'zh' && doc.contentZh ? doc.contentZh :
                      language === 'es' && doc.contentEs ? doc.contentEs : doc.content;
      out.push({ document: doc, score, highlights: [{ field: 'content', snippet: generateHighlight(content, matchedTerms) }], matchedTerms });
    }
  }
  out.sort((a, b) => {
    const scoreDiff = b.score - a.score;
    if (scoreDiff !== 0) return scoreDiff;
    // Tiebreak: charges (and other docs) with a verified instructionUrl rank
    // ahead of equally-scored peers. Among many state charges with the same
    // partial-title score, this surfaces high-quality instruction-linked entries
    // before those with only a citation reference.
    const aUrl = a.document.instructionUrl ? 1 : 0;
    const bUrl = b.document.instructionUrl ? 1 : 0;
    return bUrl - aUrl;
  });
  return out;
}

export function search(query: SearchQuery): SearchResponse {
  const startTime = Date.now();

  if (!indexReady) {
    buildSearchIndex();
  }

  const expandedQuery = expandSynonyms(query.query);
  let results = runScoring(searchIndex, expandedQuery.directTerms, expandedQuery.synonymTerms, query.filters, query.language);
  let correctedQuery: string | undefined;

  // Fuzzy typo correction: previously only fired on zero results, meaning
  // a user who typed "probatoin" and got one weak unrelated result would
  // never see the correction. Now fires whenever the top result is weak
  // (score < 50), so near-miss typos always get a correction attempt.
  // Uses corrected results only when they are substantially better (1.5×).
  const topScore = results[0]?.score ?? 0;
  if (fuzzyVocabulary.size > 0 && topScore < 50) {
    const corrections = tryFuzzyCorrect(expandedQuery.directTerms);
    if (corrections.size > 0) {
      let corrected = normalizeText(query.query);
      for (const [original, replacement] of corrections) {
        corrected = corrected.replace(new RegExp(`\\b${escapeRegex(original)}\\b`, 'g'), replacement);
      }
      if (corrected !== normalizeText(query.query)) {
        const correctedExpanded = expandSynonyms(corrected);
        const correctedResults = runScoring(searchIndex, correctedExpanded.directTerms, correctedExpanded.synonymTerms, query.filters, query.language);
        const correctedTopScore = correctedResults[0]?.score ?? 0;
        if (correctedTopScore > topScore * 1.5 || (results.length === 0 && correctedResults.length > 0)) {
          correctedQuery = corrected;
          results = correctedResults;
        }
      }
    }
  }

  // All known types in a stable fallback order (charges/mock_qa always last)
  const ALL_TYPES: SearchContentType[] = [
    'rights_info', 'legal_resource', 'expungement', 'diversion_program',
    'glossary', 'court', 'mock_qa', 'charge',
  ];

  // Types that should always appear last regardless of their score
  const PINNED_LAST = new Set<SearchContentType>(['charge', 'mock_qa']);

  // Per-type result caps.
  // When the caller filters to 'charge' only (e.g. ?types=charge), raise the
  // charge cap to 20 so the full requested limit worth of matching charges can
  // be returned — the outer route's limit=N slice is the real cap in that case.
  const chargesOnlyFilter =
    query.filters?.types &&
    query.filters.types.length === 1 &&
    query.filters.types[0] === 'charge';
  const GROUP_LIMITS: Record<SearchContentType, number> = {
    rights_info: 5,
    legal_resource: 5,
    expungement: 3,
    diversion_program: 4,
    glossary: 3,
    court: 2,
    mock_qa: 2,
    charge: chargesOnlyFilter ? 50 : 3,
  };

  // Group from ALL scored results so each category gets its best matches
  const groupedResults: Record<SearchContentType, SearchResult[]> = {
    glossary: [], charge: [], diversion_program: [], expungement: [],
    legal_resource: [], court: [], mock_qa: [], rights_info: [],
  };

  for (const result of results) {
    const type = result.document.type;
    const limit = GROUP_LIMITS[type] ?? 3;
    if (groupedResults[type].length < limit) {
      groupedResults[type].push(result);
    }
  }

  // When there are 4 or more strong non-charge results, suppress charges entirely
  // so the results feel like a helpful guide rather than a charge lookup table.
  const nonChargeResultCount = ALL_TYPES
    .filter(t => t !== 'charge' && t !== 'mock_qa')
    .reduce((sum, t) => sum + groupedResults[t].length, 0);
  if (nonChargeResultCount >= 4) {
    groupedResults['charge'] = [];
  }

  // Sort non-pinned sections by their top result score so the most relevant
  // section always appears first, regardless of content type.
  const mainTypes = ALL_TYPES
    .filter(t => !PINNED_LAST.has(t) && groupedResults[t].length > 0)
    .sort((a, b) => (groupedResults[b][0]?.score ?? 0) - (groupedResults[a][0]?.score ?? 0));
  const pinnedTypes = ALL_TYPES.filter(t => PINNED_LAST.has(t) && groupedResults[t].length > 0);

  const flatResults: SearchResult[] = [
    ...mainTypes.flatMap(t => groupedResults[t]),
    ...pinnedTypes.flatMap(t => groupedResults[t]),
  ];

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
    results: flatResults,
    totalCount: results.length,
    groupedResults,
    suggestions: suggestions.slice(0, 5),
    searchTimeMs,
    correctedQuery,
  };
}

export function getSearchIndexStats(): { totalDocuments: number; documentsByType: Record<string, number> } {
  const documentsByType: Record<string, number> = {};
  for (const doc of searchIndex) {
    documentsByType[doc.type] = (documentsByType[doc.type] || 0) + 1;
  }
  return { totalDocuments: searchIndex.length, documentsByType };
}
