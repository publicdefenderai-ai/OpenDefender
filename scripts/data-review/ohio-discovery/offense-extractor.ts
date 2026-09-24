/**
 * Derive offense identities from official Ohio Revised Code section text.
 *
 * Ohio's drafting convention is unusually regular and carries the two facts
 * this project otherwise sends to manual review:
 *
 *   "Whoever violates division (A)(3) of this section is guilty of vehicular
 *    homicide. Except as otherwise provided in this division, vehicular
 *    homicide is a misdemeanor of the first degree."
 *
 * The guilt clause states the offense's own name, which is authoritative over
 * the section catchline and over any synthesized catalog label. A section that
 * states several guilt clauses defines several offenses, so the same pass that
 * names an offense also splits compound sections. Named grades are attributed
 * by statutory name. Unnamed local grades and external penalty relationships
 * are separate evidence observations, never names inferred from a catchline.
 *
 * Every returned field carries the exact character span it came from so a
 * reviewer can check it against the hashed source text.
 */

export type OhioOffenceGradeKind = "felony" | "misdemeanor" | "minor_misdemeanor" | "unclassified";

export interface OhioTextSpan {
  text: string;
  start: number;
  end: number;
}

export interface OhioOffenceGrade {
  kind: OhioOffenceGradeKind;
  degree: string | null;
  conditional: boolean;
  span: OhioTextSpan;
}

export interface OhioExtractedOffence {
  /** The offense's own statutory name, taken from its guilt clause. */
  name: string;
  /** Divisions the guilt clause attributes the offense to, when stated. */
  divisions: string[];
  guiltClause: OhioTextSpan;
  grades: OhioOffenceGrade[];
  /** Sections this provision expressly incorporates, for dependency closure. */
  crossReferences: string[];
}

/**
 * A grade stated by a chapter penalty section for conduct defined elsewhere.
 *
 * Ohio's regulatory chapters separate conduct from punishment: the prohibition
 * sits in its own section while a single chapter penalty section, conventionally
 * numbered `.99`, grades it. Without this link those offenses look ungraded, and
 * their catchline name would be the only thing left to publish.
 */
export interface OhioPenaltyTargetScope {
  section: string;
  referenceSpans: OhioTextSpan[];
  scope: "whole_section" | "division_qualified" | "ambiguous_reference";
  reviewReasons: string[];
  requiresApplicabilityReview: boolean;
}

export interface OhioPenaltyLinkage {
  targetSections: string[];
  targetScopes: OhioPenaltyTargetScope[];
  ranges: Array<{ from: string; to: string; span: OhioTextSpan }>;
  context: OhioTextSpan;
  requiresApplicabilityReview: boolean;
  grade: OhioOffenceGrade;
  span: OhioTextSpan;
}

const DEGREE_WORDS = "first|second|third|fourth|fifth";

/**
 * Offense names stop at a sentence break, a grading clause, or the connective
 * that introduces a penalty cross-reference.
 *
 * "and" ends the name only when a verb follows it. Ohio writes both
 * "is guilty of aggravated vehicular homicide and shall be punished..." and
 * "is guilty of breaking and entering", so treating every "and" as a boundary
 * silently truncates real offense names.
 */
const GUILT_CLAUSE = new RegExp(
  String.raw`(?:whoever\s+violates\s+([^.;]{0,160}?)\s+of\s+this\s+section\s+)?` +
  String.raw`is\s+guilty\s+of\s+` +
  // A period normally ends the name, except inside an abbreviation such as the
  // "L.S.D." in "is guilty of trafficking in L.S.D."
  String.raw`([a-z0-9](?:[^.;:,]|(?<=\b[A-Z])\.(?=[A-Z])){2,90}?)` +
  // "under" ends the name only before a citation: "guilty of falsification
  // under section 2921.13". It is part of the name in "having weapons while
  // under disability".
  String.raw`(?=\s*(?:[;:,]|\.(?![A-Z]\.)` +
  String.raw`|\sand\s+(?:shall|is|are|may|must|upon|in\s+addition|the\s+court)\b` +
  String.raw`|\sunder\s+(?:division\s*\([^)]*\)\s*of\s+)?(?:section|chapter)\b` +
  String.raw`|\sif\s|\swhen\s|\sas\s+defined\s|$))`,
  "gi",
);

/**
 * "...is guilty of falsification under section 2921.13 of the Revised Code."
 *
 * A clause that points at another section is citing an offense, not creating
 * one. These appear in required form notices and in cross-references, and
 * treating them as definitions would attach a real offense name to whatever
 * unrelated section happened to quote it.
 */
const EXTERNAL_OFFENCE_REFERENCE =
  /^\s*(?:under|as\s+defined\s+in|in\s+violation\s+of|pursuant\s+to)\s+(?:division\s*\([^)]*\)\s*of\s*)?section\s+\d+\.\d+/i;

/**
 * An offense name never ends mid-phrase. Section 2901.11 sets out criminal
 * jurisdiction and says a person "is guilty of complicity in the commission of,
 * an offense in another jurisdiction"; that is a jurisdiction rule describing
 * conduct, not a guilt clause creating an offense called "complicity in the
 * commission of".
 */
const DANGLING_NAME_TAIL =
  /\b(?:while|under|with|of|to|for|in|on|at|by|the|a|an|from|into|upon|against|without|and|or)$/i;

/**
 * Not every "is guilty of" introduces a name. Ohio also uses the phrase to
 * enumerate ("is guilty of one of the following:"), to limit counts ("is guilty
 * of only one conspiracy"), and to attribute liability ("is guilty of
 * conspiring with that other person"). None of those is an offense identity.
 */
const NON_NAME_LEAD = new RegExp(
  String.raw`^(?:` +
  String.raw`one\s+of\s+the\s+following|any\s+of\s+the\s+following|either\s+of|both\s+of|each\s+of` +
  String.raw`|only\s+\w+|no\s+more\s+than|more\s+than\s+one|the\s+same|a\s+separate` +
  String.raw`|conspiring\b|attempting\b|committing\b|violating\b|the\s+following` +
  String.raw`)`,
  "i",
);

const DIVISION = /\(([A-Z])\)(?:\((\d+)\))?(?:\(([a-z])\))?/g;

function normalize(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

/** Compare offense names without punctuation or article noise. */
export function normalizeOffenceName(value: string): string {
  return normalize(value).toLowerCase().replace(/[^a-z0-9 ]+/g, "").replace(/\s+/g, " ").trim();
}

function collectDivisions(fragment: string): string[] {
  const divisions = new Set<string>();
  for (const match of fragment.matchAll(DIVISION)) {
    const parts = [match[1], match[2], match[3]].filter(Boolean);
    divisions.add(`(${parts.join(")(")})`);
  }
  return [...divisions];
}

const GRADE_CLAUSE = new RegExp(
  String.raw`([^.;]{0,220}?)\bis\s+a\s+` +
  String.raw`(?:(felony|misdemeanor)\s+of\s+the\s+(${DEGREE_WORDS})\s+degree|(minor\s+misdemeanor))` +
  String.raw`([^.;]{0,80})`,
  "gi",
);

function gradeFrom(
  kindWord: string | undefined,
  degreeWord: string | undefined,
  minorWord: string | undefined,
  conditional: boolean,
  matchText: string,
  start: number,
): OhioOffenceGrade {
  return {
    kind: minorWord
      ? "minor_misdemeanor"
      : (kindWord?.toLowerCase() as "felony" | "misdemeanor" | undefined) ?? "unclassified",
    degree: degreeWord ? degreeWord.toLowerCase() : null,
    conditional,
    span: { text: normalize(matchText), start, end: start + matchText.length },
  };
}

function pushGrade(grades: OhioOffenceGrade[], grade: OhioOffenceGrade): void {
  const key = `${grade.kind}|${grade.degree}|${grade.conditional}`;
  if (grades.some(existing => `${existing.kind}|${existing.degree}|${existing.conditional}` === key)) return;
  grades.push(grade);
}

/**
 * Attribute each grading clause in a section to the offense it actually grades.
 *
 * A compound section states several offenses whose names overlap, so
 * "aggravated vehicular homicide ... is a felony of the second degree" also
 * contains the shorter sibling name "vehicular homicide". Attributing every
 * clause to the longest sibling name present in its lead-in keeps each grade on
 * the right offense instead of duplicating it onto the shorter one.
 */
function attributeGrades(names: readonly string[], text: string): Map<string, OhioOffenceGrade[]> {
  const byName = new Map<string, OhioOffenceGrade[]>(names.map(name => [name, []]));
  const ordered = [...names].sort((a, b) => b.length - a.length);
  for (const match of text.matchAll(GRADE_CLAUSE)) {
    const lead = normalizeOffenceName(match[1] ?? "");
    const owner = ordered.find(name => lead.includes(name));
    if (!owner) continue;
    const conditional = /\bexcept\s+as\s+otherwise\b/i.test(match[1] ?? "") ||
      /\b(if|when|unless)\b/i.test(match[5] ?? "");
    pushGrade(
      byName.get(owner)!,
      gradeFrom(match[2], match[3], match[4], conditional, match[0], match.index ?? 0),
    );
  }
  return byName;
}

export function extractOhioCrossReferences(text: string, selfSection: string): string[] {
  const references = new Set<string>();
  for (const match of text.matchAll(/\bsections?\s+((?:\d+\.\d+)(?:\s*(?:,|and|to|through)\s*\d+\.\d+)*)/gi)) {
    for (const found of match[1].matchAll(/\d+\.\d+/g)) {
      if (found[0] !== selfSection) references.add(found[0]);
    }
  }
  for (const match of text.matchAll(/\bChapter\s+(\d+)\.\s/gi)) {
    references.add(`chapter-${match[1]}`);
  }
  return [...references].sort();
}

/**
 * The appositive form states the grade inside the guilt clause itself:
 * "is guilty of voluntary manslaughter, a felony of the first degree."
 */
const APPOSITIVE_GRADE = new RegExp(
  String.raw`^\s*,\s*(?:a|an)\s+` +
  String.raw`(?:(felony|misdemeanor)\s+of\s+the\s+(${DEGREE_WORDS})\s+degree|(minor\s+misdemeanor))`,
  "i",
);

export function extractOhioOffences(
  text: string,
  selfSection: string,
): OhioExtractedOffence[] {
  const byName = new Map<string, OhioExtractedOffence>();
  const crossReferences = extractOhioCrossReferences(text, selfSection);

  for (const match of text.matchAll(GUILT_CLAUSE)) {
    const rawName = normalize(match[2] ?? "");
    const key = normalizeOffenceName(rawName);
    if (!key || key.length < 3) continue;
    // "is guilty of a felony of the fourth degree" states a grade, not a name.
    if (/^(a|an|the)?\s*(felony|misdemeanor|minor misdemeanor)/i.test(rawName)) continue;
    if (/^(this|that|such|the offense|an offense|any offense)\b/i.test(rawName)) continue;
    if (DANGLING_NAME_TAIL.test(rawName.trim())) continue;
    if (NON_NAME_LEAD.test(rawName)) continue;

    // Skip a clause that cites an offense defined in another section.
    const after = text.slice((match.index ?? 0) + match[0].length);
    if (EXTERNAL_OFFENCE_REFERENCE.test(after)) continue;

    const divisions = collectDivisions(match[1] ?? "");
    const existing = byName.get(key);
    if (existing) {
      for (const division of divisions) {
        if (!existing.divisions.includes(division)) existing.divisions.push(division);
      }
      continue;
    }
    const endIndex = (match.index ?? 0) + match[0].length;
    const name = /\b[A-Z]$/.test(rawName) && text[endIndex] === "."
      ? `${rawName}.`
      : rawName;
    const entry: OhioExtractedOffence = {
      name,
      divisions,
      guiltClause: {
        text: normalize(match[0]),
        start: match.index ?? 0,
        end: (match.index ?? 0) + match[0].length,
      },
      grades: [],
      crossReferences,
    };
    const tail = text.slice((match.index ?? 0) + match[0].length);
    const appositive = tail.match(APPOSITIVE_GRADE);
    if (appositive) {
      const start = (match.index ?? 0) + match[0].length;
      pushGrade(
        entry.grades,
        gradeFrom(appositive[1], appositive[2], appositive[3], false, appositive[0], start),
      );
    }
    byName.set(key, entry);
  }

  const attributed = attributeGrades([...byName.keys()], text);
  for (const [key, entry] of byName) {
    for (const grade of attributed.get(key) ?? []) pushGrade(entry.grades, grade);
  }

  return [...byName.values()];
}

/**
 * Section numbers contain periods, so a penalty clause cannot be matched with a
 * character class that treats every period as a boundary. Segment the text into
 * sentences first, then match inside one sentence at a time. That also stops a
 * clause from collecting section numbers belonging to the previous sentence.
 */
export function sentencesWithOffsets(text: string): Array<{ text: string; start: number }> {
  const sentences: Array<{ text: string; start: number }> = [];
  let start = 0;
  const boundary = /\.(?:\s+(?=\(|[A-Z])|(?=\([A-Z]\)))/g;
  for (const match of text.matchAll(boundary)) {
    const end = (match.index ?? 0) + 1;
    sentences.push({ text: text.slice(start, end), start });
    start = end + (match[0].length - 1);
  }
  if (start < text.length) sentences.push({ text: text.slice(start), start });
  return sentences;
}

export interface OhioLocalGradeEvidence {
  kind: OhioOffenceGradeKind;
  degree: string | null;
  span: OhioTextSpan;
  context: OhioTextSpan;
  applicability: "unresolved";
}

/** Observe unnamed self/division grades; preserve conditions, never invent a name. */
export function extractOhioLocalGrades(text: string): OhioLocalGradeEvidence[] {
  const result: OhioLocalGradeEvidence[] = [];
  for (const sentence of sentencesWithOffsets(text)) {
    if (!/\b(?:whoever\s+(?:(?:recklessly|knowingly|purposely|negligently)\s+)?violates|violation\s+of|violates\s+division)\b[\s\S]{0,350}?\bthis\s+(?:section|division)\b[\s\S]{0,800}?\bis\s+(?:guilty\s+of\s+)?(?:a|an)\s+(?:felony|misdemeanor|minor\s+misdemeanor)\b/i.test(sentence.text)) continue;
    const pattern = new RegExp(String.raw`\b(?:a|an)\s+(?:(felony|misdemeanor)\s+(?:of|in)\s+the\s+(${DEGREE_WORDS})\s+degree|(minor\s+misdemeanor))\b`, "gi");
    for (const match of sentence.text.matchAll(pattern)) {
      const start = sentence.start + (match.index ?? 0);
      result.push({ kind: match[3] ? "minor_misdemeanor" : match[1].toLowerCase() as OhioOffenceGradeKind,
        degree: match[2]?.toLowerCase() ?? null, span: { start, end: start + match[0].length, text: match[0] },
        context: { start: sentence.start, end: sentence.start + sentence.text.length, text: sentence.text },
        applicability: "unresolved" });
    }
  }
  return result;
}

const PENALTY_LINKAGE = new RegExp(
  String.raw`whoever\s+violates\s+([\s\S]{0,400}?)\s+of\s+the\s+revised\s+code\s+is\s+guilty\s+of\s+` +
  String.raw`(?:a|an)\s+` +
  String.raw`(?:(felony|misdemeanor)\s+of\s+the\s+(${DEGREE_WORDS})\s+degree|(minor\s+misdemeanor))` +
  String.raw`([\s\S]{0,80}?)(?=[.;]|$)`,
  "i",
);

/** Resolve only explicit list grammar; uncertain inheritance stays reviewable. */
function penaltyTargetScopes(reference: string, referenceStart: number, sentence: string,
  targets: string[]): OhioPenaltyTargetScope[] {
  const shared: string[] = [];
  if (/\b(?:except|unless|if|when|previously|notwithstanding|provided)\b|\b(?:first|second|third|subsequent)\s+(?:offense|violation)/i.test(sentence)) shared.push("conditional_penalty");
  if (/\bbeing\b/i.test(reference)) shared.push("actor_qualification");
  if (/\b(?:prior\s+to|on\s+or\s+after|before|after)\b|(?<![\d.])\b(?:18|19|20)\d{2}\b(?![\d.])/i.test(sentence)) shared.push("temporal_condition");
  // Unknown reference wording may describe rules, conduct or an actor rather
  // than a direct offense. Do not clear its hold simply because a number is bare.
  const unexplained = reference.replace(/\d+\.\d+/g, " ").replace(/\([a-z0-9]+\)/gi, " ")
    .replace(/\b(?:divisions?|sections?|of|the|revised|code|or|and|to|through|violates)\b/gi, " ")
    .replace(/[\s,;]+/g, "");
  if (unexplained) shared.push("unparsed_reference_qualification");
  let previousEnd = 0;
  let inherited: OhioPenaltyTargetScope["scope"] = "ambiguous_reference";
  const byTarget = new Map<string, OhioPenaltyTargetScope>();
  for (const match of reference.matchAll(/\d+\.\d+/g)) {
    const gap = reference.slice(previousEnd, match.index!);
    const start = referenceStart + previousEnd;
    const end = referenceStart + match.index! + match[0].length;
    let scope: OhioPenaltyTargetScope["scope"];
    if (/\bdivisions?\b/i.test(gap)) scope = "division_qualified";
    else if (/\bsections?\s*$/i.test(gap) && !/\bof\s+sections?\s*$/i.test(gap)) scope = "whole_section";
    else if (/\bof\s+sections?\s*$/i.test(gap) && inherited === "division_qualified") scope = "division_qualified";
    else if (/^[\s,]*(?:(?:or|and)\s*)?$/i.test(gap) && inherited === "whole_section") scope = "whole_section";
    else scope = "ambiguous_reference";
    inherited = scope;
    previousEnd = match.index! + match[0].length;
    if (!targets.includes(match[0])) continue;
    const prior = byTarget.get(match[0]);
    const reasons = [...shared, ...(scope === "whole_section" ? [] : [scope])];
    const referenceSpan = { start, end, text: reference.slice(start - referenceStart, end - referenceStart) };
    if (prior) {
      prior.referenceSpans.push(referenceSpan);
      prior.reviewReasons = [...new Set([...prior.reviewReasons, ...reasons])];
      if (prior.scope !== scope) prior.scope = "ambiguous_reference";
      prior.requiresApplicabilityReview = prior.reviewReasons.length > 0;
    } else byTarget.set(match[0], { section: match[0], referenceSpans: [referenceSpan], scope,
      reviewReasons: reasons, requiresApplicabilityReview: reasons.length > 0 });
  }
  return [...byTarget.values()];
}

/**
 * Read a chapter penalty section and attach its grades to the conduct sections
 * it punishes. Only sections other than the penalty section itself are
 * returned, so a penalty section never grades itself.
 */
export function extractOhioPenaltyLinkages(
  text: string,
  selfSection: string,
): OhioPenaltyLinkage[] {
  const linkages: OhioPenaltyLinkage[] = [];
  for (const sentence of sentencesWithOffsets(text)) {
    const match = sentence.text.match(PENALTY_LINKAGE);
    if (!match) continue;
    const referenceText = match[1] ?? "";
    const rangeMatches = [...referenceText.matchAll(/\b(\d+\.\d+)\s+(?:to|through)\s+(\d+\.\d+)\b/gi)];
    const targets = [...new Set([...referenceText.matchAll(/\d+\.\d+/g)]
      .filter(found => !rangeMatches.some(range => found.index! >= range.index! && found.index! < range.index! + range[0].length))
      .map(found => found[0]))].filter(section => section !== selfSection);
    if (targets.length === 0 && rangeMatches.length === 0) continue;
    const start = sentence.start + (match.index ?? 0);
    const referenceStart = start + match[0].indexOf(referenceText);
    const targetScopes = penaltyTargetScopes(referenceText, referenceStart, sentence.text, targets);
    const conditional = /\bexcept\s+as\s+otherwise\b/i.test(sentence.text) ||
      /\b(if|when|unless)\b/i.test(sentence.text.slice(0, match.index ?? 0)) ||
      /\b(if|when|unless)\b/i.test(match[5] ?? "");
    linkages.push({
      targetSections: targets.sort(),
      targetScopes,
      ranges: rangeMatches.map(range => ({ from: range[1], to: range[2], span: {
        start: referenceStart + range.index!, end: referenceStart + range.index! + range[0].length, text: range[0],
      } })),
      context: { start: sentence.start, end: sentence.start + sentence.text.length, text: sentence.text },
      requiresApplicabilityReview: rangeMatches.length > 0 || targetScopes.some(target => target.requiresApplicabilityReview),
      grade: gradeFrom(match[2], match[3], match[4], conditional, match[0], start),
      span: { text: normalize(match[0]), start, end: start + match[0].length },
    });
  }
  return linkages;
}

/** A section states a prohibition even when it never names the offense. */
export function hasOhioProhibition(text: string): boolean {
  return /\bno\s+(person|individual|owner|operator|employer|officer|entity|company|corporation|agency|holder|applicant|licensee|manufacturer|retailer|distributor|dealer)\b[^.;]{0,200}?\bshall\b/i
    .test(text) || /\bit\s+is\s+unlawful\b/i.test(text);
}

export function hasOhioGradingLanguage(text: string): boolean {
  return new RegExp(
    String.raw`\bis\s+a\s+(?:felony|misdemeanor)\s+of\s+the\s+(?:${DEGREE_WORDS})\s+degree\b|\bis\s+a\s+minor\s+misdemeanor\b`,
    "i",
  ).test(text);
}
