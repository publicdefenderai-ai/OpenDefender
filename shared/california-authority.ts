/**
 * Authoritative California charge contract.
 *
 * This module is deliberately separate from the national, legacy charge
 * catalog.  The national catalog contains records that were originally
 * synthesized for coverage; this file is the release boundary for California.
 * A record is selectable only when its statutory identity, classification, and
 * currentness evidence are all present.
 */

import type { CriminalCharge } from "./criminal-charges";

export type CaliforniaDisposition =
  | "retain"
  | "rename"
  | "alias"
  | "remove"
  | "reselection-required";

export type CaliforniaClassification =
  | "offense"
  | "enhancement"
  | "proceeding"
  | "civil-or-regulatory"
  | "related-liability";

export interface CaliforniaSource {
  kind: "statute" | "jury-instruction" | "classification";
  publisher: "California Legislative Information" | "California Judicial Council";
  citation: string;
  url: string;
  currentLawText: boolean;
}

export interface CaliforniaCanonicalRecord {
  /** Stable ID used by current selector/API consumers. */
  canonicalId: string;
  /** IDs from the legacy catalog that resolve to this record. */
  legacyIds: string[];
  disposition: Exclude<CaliforniaDisposition, "alias" | "remove" | "reselection-required">;
  officialTitle: string;
  code: string;
  lawCode: "PEN" | "HSC" | "VEH" | "BPC" | "RTC" | "FAM" | "WIC";
  citation: string;
  classification: CaliforniaClassification;
  elements: string[];
  mentalState: string;
  grading: string;
  penalty: string;
  currentness: {
    status: "current";
    evidence: string;
    effectiveDate: string;
  };
  sources: CaliforniaSource[];
  juryInstruction?: {
    ref: string;
    url: string;
  };
  /** Legal review is intentionally not implied by statutory verification. */
  attorneyReview: "pending";
  selectable: boolean;
}

export interface CaliforniaLegacyDisposition {
  legacyId: string;
  disposition: CaliforniaDisposition;
  canonicalId?: string;
  reason: string;
}

const LEGINFO_BASE = "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml";
const CALCRIM_URL =
  "https://www.courts.ca.gov/partners/california-jury-instructions";

const LAW_CODE_LABELS: Record<CaliforniaCanonicalRecord["lawCode"], string> = {
  PEN: "Cal. Penal Code",
  HSC: "Cal. Health & Safety Code",
  VEH: "Cal. Vehicle Code",
  BPC: "Cal. Business & Professions Code",
  RTC: "Cal. Revenue & Taxation Code",
  FAM: "Cal. Family Code",
  WIC: "Cal. Welfare & Institutions Code",
};

function leginfoUrl(lawCode: CaliforniaCanonicalRecord["lawCode"], code: string): string {
  const section = code.match(/\d+(?:\.\d+)*(?:[a-z])?/)![0];
  return `${LEGINFO_BASE}?sectionNum=${encodeURIComponent(section)}&lawCode=${lawCode}`;
}

const CURRENT_LAW_EVIDENCE =
  "California Legislative Information current code text, checked 2026-08";

/** Primary materials used by the California release contract. */
export const CALIFORNIA_SOURCE_MANIFEST = [
  {
    id: "ca-leginfo",
    role: "statute text, section history, and currentness",
    publisher: "California Legislative Information",
    url: "https://leginfo.legislature.ca.gov/",
    requiredForPromotion: true,
  },
  {
    id: "ca-calcrim",
    role: "pattern jury instructions and element cross-check",
    publisher: "California Judicial Council",
    url: CALCRIM_URL,
    requiredForPromotion: false,
  },
  {
    id: "ca-sentencing",
    role: "classification and punishment cross-check",
    publisher: "California Legislative Information",
    url: "https://leginfo.legislature.ca.gov/faces/codes.xhtml",
    requiredForPromotion: true,
  },
] as const;

const STATUTE_SOURCE = (
  lawCode: CaliforniaCanonicalRecord["lawCode"],
  citation: string,
  code: string,
): CaliforniaSource => ({
  kind: "statute",
  publisher: "California Legislative Information",
  citation,
  url: leginfoUrl(lawCode, code),
  currentLawText: true,
});

const CALCRIM_SOURCE = (ref: string): CaliforniaSource => ({
  kind: "jury-instruction",
  publisher: "California Judicial Council",
  citation: ref,
  url: CALCRIM_URL,
  currentLawText: true,
});

type RecordSeed = Omit<
  CaliforniaCanonicalRecord,
  "legacyIds" | "sources" | "currentness" | "attorneyReview" | "selectable" | "disposition"
> & {
  legacyIds?: string[];
  juryInstruction?: { ref: string; url: string };
};

function record(seed: RecordSeed): CaliforniaCanonicalRecord {
  const sections = [...seed.code.matchAll(/(?:^|[;,]\s*)(\d+(?:\.\d+)*(?:[a-z])?)/g)].map(
    (match) => match[1],
  );
  const statuteSources = [...new Set(sections)].map((section) =>
    STATUTE_SOURCE(
      seed.lawCode,
      `${LAW_CODE_LABELS[seed.lawCode]} § ${section}`,
      section,
    ),
  );
  const jury = seed.juryInstruction
    ? CALCRIM_SOURCE(seed.juryInstruction.ref)
    : undefined;
  return {
    ...seed,
    disposition: "retain",
    legacyIds: seed.legacyIds ?? [seed.canonicalId],
    sources: jury ? [...statuteSources, jury] : statuteSources,
    currentness: {
      status: "current",
      evidence: CURRENT_LAW_EVIDENCE,
      effectiveDate: "2026-08",
    },
    attorneyReview: "pending",
    selectable: true,
  };
}

const PENALTY_MISDEMEANOR =
  "Usually up to 6 months in county jail and/or a fine; exact grading depends on the charged subdivision and facts.";
const PENALTY_WOBBLER =
  "May be charged as a misdemeanor or felony in circumstances specified by statute; exact sentence depends on the subdivision and facts.";
const PENALTY_FELONY =
  "Felony sentencing varies by subdivision and facts; consult the current statute and counsel for the applicable term.";
const PENALTY_INFRACTION =
  "Usually an infraction with a fine; exact amount and enforcement depend on the applicable statute or local rule.";

/**
 * The selectable California release set.  Generic legacy labels are renamed
 * here rather than silently inheriting their old synthesized descriptions.
 */
export const CALIFORNIA_CANONICAL_RECORDS: CaliforniaCanonicalRecord[] = [
  record({
    canonicalId: "ca-murder-in-the-first-degree",
    officialTitle: "Murder — First Degree",
    code: "187(a), 189",
    lawCode: "PEN",
    citation: "Cal. Penal Code §§ 187(a), 189",
    classification: "offense",
    elements: ["A human being was killed", "The defendant acted with malice aforethought", "The killing falls within a first-degree category in § 189"],
    mentalState: "Malice aforethought; the applicable § 189 theory must be proved.",
    grading: "First-degree murder",
    penalty: "State-prison terms include 25 years to life or life without parole in circumstances specified by statute; special circumstances can alter punishment.",
    juryInstruction: { ref: "CALCRIM 521", url: CALCRIM_URL },
  }),
  record({
    canonicalId: "ca-murder-in-the-second-degree",
    officialTitle: "Murder — Second Degree",
    code: "187(a)",
    lawCode: "PEN",
    citation: "Cal. Penal Code § 187(a)",
    classification: "offense",
    elements: ["A human being was killed", "The defendant acted with malice aforethought", "The killing was not first-degree murder under § 189"],
    mentalState: "Malice aforethought.",
    grading: "Second-degree murder",
    penalty: "State-prison term is generally 15 years to life, with statutory variations for specified circumstances.",
    juryInstruction: { ref: "CALCRIM 520", url: CALCRIM_URL },
  }),
  record({
    canonicalId: "ca-voluntary-manslaughter",
    officialTitle: "Voluntary Manslaughter",
    code: "192(a)",
    lawCode: "PEN",
    citation: "Cal. Penal Code § 192(a)",
    classification: "offense",
    elements: ["The defendant unlawfully killed a human being", "The killing was without malice", "The killing occurred under a circumstance recognized by § 192(a)"],
    mentalState: "Intent to kill or conscious disregard as required by the applicable theory, without malice.",
    grading: "Felony",
    penalty: "Three, six, or eleven years in state prison, subject to statutory changes and case-specific rules.",
    juryInstruction: { ref: "CALCRIM 570", url: CALCRIM_URL },
  }),
  record({
    canonicalId: "ca-involuntary-manslaughter",
    officialTitle: "Involuntary Manslaughter",
    code: "192(b)",
    lawCode: "PEN",
    citation: "Cal. Penal Code § 192(b)",
    classification: "offense",
    elements: ["The defendant committed an unlawful killing without malice", "The killing occurred during a qualifying misdemeanor or lawful act performed without due caution", "The act or omission caused the death"],
    mentalState: "Criminal negligence or the mental state specified by the charged theory.",
    grading: "Felony.",
    penalty: "Punishable under Penal Code § 193(b) by imprisonment pursuant to Penal Code § 1170(h) for two, three, or four years.",
    juryInstruction: { ref: "CALCRIM 580", url: CALCRIM_URL },
  }),
  record({
    canonicalId: "ca-assault-in-the-second-degree",
    officialTitle: "Battery",
    code: "242, 243(a)",
    lawCode: "PEN",
    citation: "Cal. Penal Code §§ 242, 243(a)",
    classification: "offense",
    elements: ["The defendant willfully touched another person in a harmful or offensive manner", "The touching was without consent"],
    mentalState: "Willful or intentional touching; no intent to injure is required.",
    grading: "Misdemeanor under Penal Code § 243(a).",
    penalty: "Fine up to $2,000, county jail up to 6 months, or both under Penal Code § 243(a).",
    juryInstruction: { ref: "CALCRIM 960", url: CALCRIM_URL },
  }),
  record({
    canonicalId: "ca-assault-in-the-third-degree",
    officialTitle: "Assault",
    code: "240",
    lawCode: "PEN",
    citation: "Cal. Penal Code § 240",
    classification: "offense",
    elements: ["The defendant committed an act that would probably and directly result in application of force", "The defendant acted willfully", "The defendant knew facts making the act likely to result in force"],
    mentalState: "Willful act with knowledge of facts making application of force likely.",
    grading: "Misdemeanor unless a different assault statute applies.",
    penalty: "Misdemeanor punishable by county jail up to 6 months and/or a fine under Penal Code § 241(a).",
    juryInstruction: { ref: "CALCRIM 915", url: CALCRIM_URL },
  }),
  record({
    canonicalId: "ca-assault-with-deadly-weapon",
    officialTitle: "Assault with a Deadly Weapon",
    code: "245(a)(1)",
    lawCode: "PEN",
    citation: "Cal. Penal Code § 245(a)(1)",
    classification: "offense",
    elements: ["The defendant committed an assault", "The assault was with a deadly weapon or by force likely to cause great bodily injury", "The defendant acted willfully and knew the relevant facts"],
    mentalState: "Willful assault with knowledge of facts making the force likely to cause great bodily injury or involving a deadly weapon.",
    grading: "Wobbler",
    penalty: "Misdemeanor punishment may include county jail up to 1 year; felony punishment may include imprisonment under Penal Code § 1170(h) for 2, 3, or 4 years, depending on the charged theory under § 245(a)(1).",
    juryInstruction: { ref: "CALCRIM 875", url: CALCRIM_URL },
  }),
  record({
    canonicalId: "ca-assault-on-peace-officer",
    officialTitle: "Assault on a Peace Officer",
    code: "241(c)",
    lawCode: "PEN",
    citation: "Cal. Penal Code § 241(c)",
    classification: "offense",
    elements: ["The defendant committed an assault", "The alleged victim was a peace officer performing duties", "The defendant knew or reasonably should have known the victim was a peace officer"],
    mentalState: "Willful assault plus the required knowledge of protected status.",
    grading: "Misdemeanor under § 241(c); related battery statutes can carry different grading.",
    penalty: "Misdemeanor punishable by a fine up to $2,000, county jail up to 1 year, or both under Penal Code § 241(c).",
    juryInstruction: { ref: "CALCRIM 945", url: CALCRIM_URL },
  }),
  record({
    canonicalId: "ca-menacing",
    officialTitle: "Criminal Threats",
    code: "422",
    lawCode: "PEN",
    citation: "Cal. Penal Code § 422",
    classification: "offense",
    elements: ["The defendant willfully threatened a crime resulting in death or great bodily injury", "The threat was specific and unequivocal enough to cause sustained fear", "The victim actually experienced sustained fear"],
    mentalState: "Intent that the statement be understood as a threat; specific intent to carry it out is not required.",
    grading: "Wobbler",
    penalty: "Misdemeanor punishment may include county jail up to 1 year; felony punishment may include imprisonment under Penal Code § 1170(h) for 16 months, 2 years, or 3 years under § 422.",
    juryInstruction: { ref: "CALCRIM 1300", url: CALCRIM_URL },
  }),
  record({
    canonicalId: "ca-rape-in-the-first-degree",
    officialTitle: "Rape",
    code: "261",
    lawCode: "PEN",
    citation: "Cal. Penal Code § 261",
    classification: "offense",
    elements: ["The defendant engaged in an act of sexual intercourse", "The act was against the victim's will or without legally valid consent", "A circumstance listed in § 261 was present"],
    mentalState: "General intent plus the statutory circumstance; the required knowledge depends on the charged subdivision.",
    grading: "Felony",
    penalty: "State-prison term depends on the charged subdivision and circumstances.",
    juryInstruction: { ref: "CALCRIM 1000", url: CALCRIM_URL },
  }),
  record({
    canonicalId: "ca-sexual-assault-in-the-second-degree",
    officialTitle: "Sexual Penetration by a Foreign Object",
    code: "289",
    lawCode: "PEN",
    citation: "Cal. Penal Code § 289",
    classification: "offense",
    elements: ["The defendant caused specified penetration with a foreign or unknown object", "The act was without legally valid consent or under a circumstance in the charged subdivision"],
    mentalState: "Intentional act; knowledge and consent requirements vary by subdivision.",
    grading: "Felony or misdemeanor depending on the charged subdivision.",
    penalty: PENALTY_WOBBLER,
    juryInstruction: { ref: "CALCRIM 1045", url: CALCRIM_URL },
  }),
  record({
    canonicalId: "ca-sexual-assault-in-the-third-degree",
    officialTitle: "Sexual Battery",
    code: "243.4",
    lawCode: "PEN",
    citation: "Cal. Penal Code § 243.4",
    classification: "offense",
    elements: ["The defendant touched an intimate part of another person", "The touching was against the person's will and for sexual arousal, gratification, or abuse", "The applicable statutory circumstance was present"],
    mentalState: "Intentional touching for sexual arousal, gratification, or abuse.",
    grading: "Misdemeanor or felony depending on the charged subdivision.",
    penalty: PENALTY_WOBBLER,
    juryInstruction: { ref: "CALCRIM 938", url: CALCRIM_URL },
  }),
  record({
    canonicalId: "ca-statutory-rape",
    officialTitle: "Unlawful Sexual Intercourse with a Minor",
    code: "261.5",
    lawCode: "PEN",
    citation: "Cal. Penal Code § 261.5",
    classification: "offense",
    elements: ["The defendant engaged in sexual intercourse with a person under the statutory age", "The age relationship and age difference matched the charged subdivision"],
    mentalState: "General intent; mistake-of-age rules depend on the charged subdivision and applicable law.",
    grading: "Misdemeanor or felony depending on age and age difference.",
    penalty: PENALTY_WOBBLER,
    juryInstruction: { ref: "CALCRIM 1070", url: CALCRIM_URL },
  }),
  record({
    canonicalId: "ca-child-sexual-abuse",
    officialTitle: "Lewd or Lascivious Act with a Child",
    code: "288",
    lawCode: "PEN",
    citation: "Cal. Penal Code § 288",
    classification: "offense",
    elements: ["The defendant willfully committed a lewd or lascivious act on or with a child", "The act was intended to arouse, appeal to, or gratify sexual desire", "The child was within the age range in the charged subdivision"],
    mentalState: "Willful act with intent to arouse, appeal to, or gratify sexual desire.",
    grading: "Felony or misdemeanor depending on the charged subdivision and facts.",
    penalty: PENALTY_FELONY,
    juryInstruction: { ref: "CALCRIM 1110", url: CALCRIM_URL },
  }),
  record({
    canonicalId: "ca-grand-theft-in-the-first-degree",
    officialTitle: "Grand Theft",
    code: "487",
    lawCode: "PEN",
    citation: "Cal. Penal Code § 487",
    classification: "offense",
    elements: ["The defendant took property belonging to another", "The defendant intended to permanently deprive the owner or acted under a statutory grand-theft circumstance", "The property or circumstance met § 487"],
    mentalState: "Intent to deprive the owner of possession or the mental state specified by the charged theory.",
    grading: "Wobbler",
    penalty: PENALTY_WOBBLER,
    juryInstruction: { ref: "CALCRIM 1801", url: CALCRIM_URL },
  }),
  record({
    canonicalId: "ca-petty-theft",
    officialTitle: "Petty Theft",
    code: "484, 490.2",
    lawCode: "PEN",
    citation: "Cal. Penal Code §§ 484, 490.2",
    classification: "offense",
    elements: ["The defendant took or appropriated property belonging to another", "The defendant intended to permanently deprive the owner", "The value and circumstances fit petty theft"],
    mentalState: "Intent to deprive the owner of possession.",
    grading: "Misdemeanor or infraction where § 490.2 applies.",
    penalty: "Generally a misdemeanor punishable by county jail up to 6 months; confirm the applicable § 490.2 value and prior-conviction exceptions.",
    juryInstruction: { ref: "CALCRIM 1800", url: CALCRIM_URL },
  }),
  record({
    canonicalId: "ca-theft-by-receiving",
    officialTitle: "Receiving Stolen Property",
    code: "496",
    lawCode: "PEN",
    citation: "Cal. Penal Code § 496",
    classification: "offense",
    elements: ["The property was stolen", "The defendant received, concealed, or withheld the property", "The defendant knew the property was stolen"],
    mentalState: "Knowledge that the property was stolen.",
    grading: "Misdemeanor or felony depending on the value and applicable facts.",
    penalty: "Misdemeanor punishment may include county jail up to 1 year; felony punishment may include imprisonment under Penal Code § 1170(h) for 16 months, 2 years, or 3 years under § 496(a).",
    juryInstruction: { ref: "CALCRIM 1750", url: CALCRIM_URL },
  }),
  record({
    canonicalId: "ca-identity-theft",
    officialTitle: "Identity Theft",
    code: "530.5",
    lawCode: "PEN",
    citation: "Cal. Penal Code § 530.5",
    classification: "offense",
    elements: ["The defendant willfully obtained or used another person's identifying information", "The defendant used it for an unlawful purpose without consent"],
    mentalState: "Willful use or obtaining of identifying information for an unlawful purpose.",
    grading: "Misdemeanor or felony depending on the charged subdivision.",
    penalty: PENALTY_WOBBLER,
    juryInstruction: { ref: "CALCRIM 2040", url: CALCRIM_URL },
  }),
  record({
    canonicalId: "ca-credit-card-fraud",
    officialTitle: "Fraudulent Use of an Access Card",
    code: "484g",
    lawCode: "PEN",
    citation: "Cal. Penal Code § 484g",
    classification: "offense",
    elements: ["The defendant used an access card or account information", "The defendant used it without consent or with intent to defraud", "The transaction met the charged statutory circumstance"],
    mentalState: "Intent to defraud or the mental state specified by the charged subdivision.",
    grading: "Misdemeanor or felony depending on the value and circumstances.",
    penalty: "Misdemeanor punishment may include county jail up to 1 year; felony punishment may include imprisonment under Penal Code § 1170(h) for 16 months, 2 years, or 3 years, depending on the charged § 484g conduct and value.",
    juryInstruction: { ref: "CALCRIM 1803", url: CALCRIM_URL },
  }),
  record({
    canonicalId: "ca-embezzlement",
    officialTitle: "Embezzlement",
    code: "503",
    lawCode: "PEN",
    citation: "Cal. Penal Code § 503",
    classification: "offense",
    elements: ["The defendant was entrusted with property", "The defendant fraudulently appropriated it", "The defendant intended to permanently deprive the owner"],
    mentalState: "Fraudulent intent.",
    grading: "Misdemeanor or felony depending on value and circumstances.",
    penalty: "Misdemeanor punishment may include county jail up to 1 year; felony punishment may include imprisonment under Penal Code § 1170(h) for 16 months, 2 years, or 3 years, depending on value and the charged § 503 theory.",
    juryInstruction: { ref: "CALCRIM 1806", url: CALCRIM_URL },
  }),
  record({
    canonicalId: "ca-shoplifting",
    officialTitle: "Shoplifting",
    code: "459.5",
    lawCode: "PEN",
    citation: "Cal. Penal Code § 459.5",
    classification: "offense",
    elements: ["The defendant entered a commercial establishment during regular business hours", "The defendant entered with intent to commit larceny", "The value and facts met the shoplifting statute"],
    mentalState: "Intent to commit larceny at the time of entry.",
    grading: "Misdemeanor unless a statutory exception applies.",
    penalty: "Misdemeanor punishable by county jail up to 6 months under Penal Code § 459.5, subject to statutory exceptions.",
    juryInstruction: { ref: "CALCRIM 1700", url: CALCRIM_URL },
  }),
  record({
    canonicalId: "ca-burglary-in-the-first-degree",
    officialTitle: "First-Degree Burglary",
    code: "459, 460(a)",
    lawCode: "PEN",
    citation: "Cal. Penal Code §§ 459, 460(a)",
    classification: "offense",
    elements: ["The defendant entered a building or qualifying structure", "The defendant entered with intent to commit theft or a felony", "The structure was an inhabited dwelling or other first-degree location"],
    mentalState: "Intent to commit theft or a felony at the time of entry.",
    grading: "Felony",
    penalty: "State-prison term is generally two, four, or six years, subject to statutory variations.",
    juryInstruction: { ref: "CALCRIM 1700", url: CALCRIM_URL },
  }),
  record({
    canonicalId: "ca-burglary-in-the-second-degree",
    officialTitle: "Second-Degree Burglary",
    code: "459, 460(b)",
    lawCode: "PEN",
    citation: "Cal. Penal Code §§ 459, 460(b)",
    classification: "offense",
    elements: ["The defendant entered a building or qualifying structure", "The defendant entered with intent to commit theft or a felony", "The location was not a first-degree burglary location"],
    mentalState: "Intent to commit theft or a felony at the time of entry.",
    grading: "Wobbler",
    penalty: "Misdemeanor punishment may include county jail up to 1 year; felony punishment may include imprisonment under Penal Code § 1170(h) for 16 months, 2 years, or 3 years under § 460(b).",
    juryInstruction: { ref: "CALCRIM 1700", url: CALCRIM_URL },
  }),
  record({
    canonicalId: "ca-robbery-in-the-first-degree",
    officialTitle: "First-Degree Robbery",
    code: "211, 212.5(a)",
    lawCode: "PEN",
    citation: "Cal. Penal Code § 212.5(a)",
    classification: "offense",
    elements: ["The defendant took personal property from another or their immediate presence", "The taking was accomplished by force or fear", "The defendant intended to permanently deprive the owner"],
    mentalState: "Intent to permanently deprive, plus the charged force-or-fear theory.",
    grading: "Felony",
    penalty: "State-prison term depends on the degree and applicable subdivision.",
    juryInstruction: { ref: "CALCRIM 1600", url: CALCRIM_URL },
  }),
  record({
    canonicalId: "ca-robbery-in-the-second-degree",
    officialTitle: "Second-Degree Robbery",
    code: "211, 212.5(c)",
    lawCode: "PEN",
    citation: "Cal. Penal Code § 212.5(c)",
    classification: "offense",
    elements: ["The defendant took personal property from another or their immediate presence", "The taking was accomplished by force or fear", "The defendant intended to permanently deprive the owner"],
    mentalState: "Intent to permanently deprive, plus the charged force-or-fear theory.",
    grading: "Felony",
    penalty: "State-prison term depends on the degree and applicable subdivision.",
    juryInstruction: { ref: "CALCRIM 1600", url: CALCRIM_URL },
  }),
  record({
    canonicalId: "ca-carjacking",
    officialTitle: "Carjacking",
    code: "215",
    lawCode: "PEN",
    citation: "Cal. Penal Code § 215",
    classification: "offense",
    elements: ["The defendant took a motor vehicle from another person's possession or immediate presence", "The taking was accomplished by force or fear", "The defendant intended to deprive the person of possession"],
    mentalState: "Intent to deprive, plus force or fear.",
    grading: "Felony",
    penalty: "State-prison term is generally three, five, or nine years, with statutory variations.",
    juryInstruction: { ref: "CALCRIM 1550", url: CALCRIM_URL },
  }),
  record({
    canonicalId: "ca-possession-of-controlled-substance",
    officialTitle: "Possession of a Controlled Substance",
    code: "11350",
    lawCode: "HSC",
    citation: "Cal. Health & Safety Code § 11350",
    classification: "offense",
    elements: ["The defendant possessed a controlled substance", "The defendant knew of its presence and nature", "The substance was listed in the charged schedule"],
    mentalState: "Knowledge of the substance's presence and character.",
    grading: "Misdemeanor or felony depending on the substance, history, and statutory exception.",
    penalty: "Generally a misdemeanor punishable by county jail up to 1 year; a qualifying statutory exception may permit felony punishment under Penal Code § 1170(h), so confirm the substance and record-specific provision under § 11350.",
    juryInstruction: { ref: "CALCRIM 2375", url: CALCRIM_URL },
  }),
  record({
    canonicalId: "ca-possession-with-intent-to-distribute",
    officialTitle: "Possession for Sale of a Controlled Substance",
    code: "11351",
    lawCode: "HSC",
    citation: "Cal. Health & Safety Code § 11351",
    classification: "offense",
    elements: ["The defendant possessed a controlled substance", "The defendant knew of its presence and character", "The defendant possessed it with intent to sell"],
    mentalState: "Knowledge plus intent to sell.",
    grading: "Felony",
    penalty: "Felony punishable by imprisonment under Health and Safety Code § 11370.1/ Penal Code § 1170(h), with the applicable term depending on the charged substance and statutory facts under § 11351.",
    juryInstruction: { ref: "CALCRIM 2302", url: CALCRIM_URL },
  }),
  record({
    canonicalId: "ca-distribution-of-controlled-substance",
    officialTitle: "Sale or Transportation of a Controlled Substance",
    code: "11352",
    lawCode: "HSC",
    citation: "Cal. Health & Safety Code § 11352",
    classification: "offense",
    elements: ["The defendant sold, furnished, administered, transported, or offered to do so with a controlled substance", "The defendant knew of the substance's presence and character", "The substance was listed in the charged schedule"],
    mentalState: "Knowledge of the substance's presence and character, plus the intent required by the charged act.",
    grading: "Felony",
    penalty: "Felony; the applicable state-prison term depends on whether the charged § 11352 act is sale, transport, or another listed act and on the statutory facts.",
    juryInstruction: { ref: "CALCRIM 2300", url: CALCRIM_URL },
  }),
  record({
    canonicalId: "ca-manufacturing-controlled-substance",
    officialTitle: "Manufacturing a Controlled Substance",
    code: "11379.6",
    lawCode: "HSC",
    citation: "Cal. Health & Safety Code § 11379.6",
    classification: "offense",
    elements: ["The defendant manufactured or attempted to manufacture a controlled substance", "The defendant knew the substance's nature", "The conduct involved a process identified by the statute"],
    mentalState: "Knowledge of the substance and intent to manufacture.",
    grading: "Felony",
    penalty: "Felony punishable by imprisonment for 3, 5, or 7 years under Health and Safety Code § 11379.6, subject to the charged conduct and statutory facts.",
    juryInstruction: { ref: "CALCRIM 2330", url: CALCRIM_URL },
  }),
  record({
    canonicalId: "ca-possession-of-drug-paraphernalia",
    officialTitle: "Possession of Drug Paraphernalia",
    code: "11364",
    lawCode: "HSC",
    citation: "Cal. Health & Safety Code § 11364",
    classification: "offense",
    elements: ["The defendant possessed an object used or intended for unlawfully injecting or smoking a controlled substance", "The defendant knew of the object's presence and character"],
    mentalState: "Knowledge of the object's presence and character, with the required drug-use purpose.",
    grading: "Misdemeanor",
    penalty: "Misdemeanor punishable by county jail up to 6 months and/or a fine under Health and Safety Code § 11364.",
  }),
  record({
    canonicalId: "ca-maintaining-drug-house",
    officialTitle: "Maintaining a Place for Selling or Using Controlled Substances",
    code: "11366",
    lawCode: "HSC",
    citation: "Cal. Health & Safety Code § 11366",
    classification: "offense",
    elements: ["The defendant opened or maintained a place", "The place was used for unlawfully selling, giving away, or using a controlled substance"],
    mentalState: "Knowledge of and intentional maintenance of the place for the prohibited purpose.",
    grading: "Felony",
    penalty: "Felony punishable by imprisonment under Penal Code § 1170(h) for 16 months, 2 years, or 3 years under Health and Safety Code § 11366.",
  }),
  record({
    canonicalId: "ca-unlawful-carrying-of-weapon",
    officialTitle: "Carrying a Concealed Firearm",
    code: "25400",
    lawCode: "PEN",
    citation: "Cal. Penal Code § 25400",
    classification: "offense",
    elements: ["The defendant carried a firearm concealed on their person or within a vehicle", "The defendant knew of the firearm's presence", "The firearm was capable of being concealed"],
    mentalState: "Knowledge of the firearm's presence; additional knowledge and status requirements depend on the charged subdivision.",
    grading: "Misdemeanor or felony depending on circumstances.",
    penalty: "Misdemeanor punishment may include county jail up to 1 year; felony punishment may include imprisonment under Penal Code § 1170(h) for 16 months, 2 years, or 3 years, depending on the charged § 25400 circumstances.",
  }),
  record({
    canonicalId: "ca-felon-in-possession-of-firearm",
    officialTitle: "Possession of a Firearm by a Person Prohibited by Prior Conviction",
    code: "29800",
    lawCode: "PEN",
    citation: "Cal. Penal Code § 29800",
    classification: "offense",
    elements: ["The defendant possessed or had custody or control of a firearm", "The defendant had a disqualifying prior conviction or status", "The defendant knew of the firearm's presence"],
    mentalState: "Knowledge of the firearm's presence; the disqualifying status is generally established by the record.",
    grading: "Felony",
    penalty: "Felony punishable by imprisonment under Penal Code § 1170(h) for 16 months, 2 years, or 3 years under § 29800, subject to statutory exceptions.",
    juryInstruction: { ref: "CALCRIM 2510", url: CALCRIM_URL },
  }),
  record({
    canonicalId: "ca-discharge-of-firearm-in-city",
    officialTitle: "Negligent Discharge of a Firearm",
    code: "246.3",
    lawCode: "PEN",
    citation: "Cal. Penal Code § 246.3",
    classification: "offense",
    elements: ["The defendant willfully discharged a firearm", "The defendant discharged it in a grossly negligent manner", "The discharge could result in injury or death"],
    mentalState: "Gross negligence.",
    grading: "Misdemeanor or felony depending on the charged subdivision.",
    penalty: "Misdemeanor punishment may include county jail up to 6 months; felony punishment may include imprisonment under Penal Code § 1170(h) for 16 months, 2 years, or 3 years under § 246.3.",
    juryInstruction: { ref: "CALCRIM 970", url: CALCRIM_URL },
  }),
  record({
    canonicalId: "ca-possession-of-prohibited-weapon",
    officialTitle: "Possession of an Assault Weapon",
    code: "30605",
    lawCode: "PEN",
    citation: "Cal. Penal Code § 30605",
    classification: "offense",
    elements: ["The defendant possessed an assault weapon", "The weapon met the statutory definition", "The defendant knew of the weapon's presence"],
    mentalState: "Knowledge of possession; the statutory weapon definition must be met.",
    grading: "Felony-level offense with an alternate county-jail punishment under Penal Code § 30605(a).",
    penalty: "County jail up to 1 year or imprisonment under Penal Code § 1170(h); a qualifying first violation may instead be punishable by a fine under § 30605(b).",
  }),
  record({
    canonicalId: "ca-check-fraud",
    officialTitle: "Making, Drawing, or Uttering a Check with Insufficient Funds",
    code: "476a",
    lawCode: "PEN",
    citation: "Cal. Penal Code § 476a",
    classification: "offense",
    elements: ["The defendant made, drew, uttered, or delivered a check or draft", "The defendant knew there were insufficient funds or credit", "The defendant acted with intent to defraud"],
    mentalState: "Knowledge of insufficient funds plus intent to defraud.",
    grading: "Misdemeanor or felony depending on amount and prior history.",
    penalty: "Misdemeanor punishment may include county jail up to 1 year; felony punishment may include imprisonment under Penal Code § 1170(h) for 16 months, 2 years, or 3 years, depending on the amount and prior history under § 476a.",
    juryInstruction: { ref: "CALCRIM 1950", url: CALCRIM_URL },
  }),
  record({
    canonicalId: "ca-insurance-fraud",
    officialTitle: "Insurance Fraud",
    code: "550",
    lawCode: "PEN",
    citation: "Cal. Penal Code § 550",
    classification: "offense",
    elements: ["The defendant presented or prepared a claim or supporting information", "The information was materially false or misleading", "The defendant acted with the intent required by the charged subdivision"],
    mentalState: "Intent to defraud or obtain an insurance benefit, as specified by the charged subdivision.",
    grading: "Misdemeanor or felony depending on the charged subdivision.",
    penalty: PENALTY_WOBBLER,
  }),
  record({
    canonicalId: "ca-forgery",
    officialTitle: "Forgery",
    code: "470",
    lawCode: "PEN",
    citation: "Cal. Penal Code § 470",
    classification: "offense",
    elements: ["The defendant made, altered, uttered, or possessed a listed writing or instrument", "The writing was false or completed without authorization", "The defendant acted with intent to defraud"],
    mentalState: "Intent to defraud.",
    grading: "Misdemeanor or felony depending on the charged instrument and subdivision.",
    penalty: "Misdemeanor punishment may include county jail up to 1 year; felony punishment may include imprisonment under Penal Code § 1170(h) for 16 months, 2 years, or 3 years, depending on the charged instrument under § 470.",
    juryInstruction: { ref: "CALCRIM 1900", url: CALCRIM_URL },
  }),
  record({
    canonicalId: "ca-computer-fraud",
    officialTitle: "Unauthorized Computer Access",
    code: "502",
    lawCode: "PEN",
    citation: "Cal. Penal Code § 502",
    classification: "offense",
    elements: ["The defendant accessed or used a computer, system, or data without permission or beyond permission", "The defendant committed the charged prohibited act", "The defendant had the mental state required by § 502"],
    mentalState: "Intentional access or use with the statutory purpose; exact mental state varies by subdivision.",
    grading: "Misdemeanor or felony depending on the charged subdivision and loss.",
    penalty: PENALTY_WOBBLER,
  }),
  record({
    canonicalId: "ca-public-intoxication",
    officialTitle: "Public Intoxication",
    code: "647(f)",
    lawCode: "PEN",
    citation: "Cal. Penal Code § 647(f)",
    classification: "offense",
    elements: ["The defendant was willfully under the influence of an intoxicating liquor, drug, or controlled substance in a public place", "The defendant was unable to exercise care for safety or interfered with or obstructed a street, sidewalk, or other passage"],
    mentalState: "Willfully being under the influence; the required inability or interference must be proved.",
    grading: "Misdemeanor",
    penalty: "Misdemeanor punishable by county jail up to 6 months and/or a fine under Penal Code § 647(f).",
    juryInstruction: { ref: "CALCRIM 2960", url: CALCRIM_URL },
  }),
  record({
    canonicalId: "ca-disturbing-the-peace",
    officialTitle: "Disturbing the Peace",
    code: "415",
    lawCode: "PEN",
    citation: "Cal. Penal Code § 415",
    classification: "offense",
    elements: ["The defendant committed one of the acts specified in § 415", "The act occurred in a manner and place covered by the statute"],
    mentalState: "Intentional conduct; exact elements depend on the charged subdivision.",
    grading: "Misdemeanor",
    penalty: "Misdemeanor punishable by county jail up to 90 days and/or a fine under Penal Code § 415, subject to the charged subdivision.",
    juryInstruction: { ref: "CALCRIM 2688", url: CALCRIM_URL },
  }),
  record({
    canonicalId: "ca-vandalism",
    officialTitle: "Vandalism",
    code: "594",
    lawCode: "PEN",
    citation: "Cal. Penal Code § 594",
    classification: "offense",
    elements: ["The defendant maliciously damaged, destroyed, or defaced property", "The property belonged to another or was otherwise protected", "The amount of damage met the charged grading"],
    mentalState: "Malice.",
    grading: "Misdemeanor or felony depending on damage amount and circumstances.",
    penalty: "Misdemeanor punishment may include county jail up to 1 year; felony punishment may include imprisonment under Penal Code § 1170(h) for 16 months, 2 years, or 3 years, depending on damage amount under § 594.",
    juryInstruction: { ref: "CALCRIM 2900", url: CALCRIM_URL },
  }),
  record({
    canonicalId: "ca-dui-first-offense",
    officialTitle: "Driving Under the Influence — First Offense",
    code: "23152",
    lawCode: "VEH",
    citation: "Cal. Vehicle Code § 23152",
    classification: "offense",
    elements: ["The defendant drove a vehicle", "The defendant was under the influence or had the prohibited blood-alcohol concentration", "The driving occurred on a public roadway or other covered location"],
    mentalState: "General intent to drive; impairment or concentration is proved by the charged theory.",
    grading: "Misdemeanor for a first offense absent an applicable enhancement or prior.",
    penalty: "Penalties include county jail, fines, license consequences, and programs; exact terms depend on the charged subdivision and prior history.",
    juryInstruction: { ref: "CALCRIM 2100", url: CALCRIM_URL },
  }),
  record({
    canonicalId: "ca-dui-second-offense",
    officialTitle: "Driving Under the Influence — Second Offense",
    code: "23152; 23540",
    lawCode: "VEH",
    citation: "Cal. Vehicle Code §§ 23152, 23540",
    classification: "offense",
    elements: ["The defendant committed a § 23152 offense", "The defendant had a qualifying prior DUI conviction within the statutory period"],
    mentalState: "General intent to drive; the prior conviction is a sentencing or grading fact.",
    grading: "Misdemeanor with repeat-offender penalties unless another statute applies.",
    penalty: "Repeat-offender penalties include increased jail, fines, license consequences, and programs; exact terms depend on the record.",
    juryInstruction: { ref: "CALCRIM 2110", url: CALCRIM_URL },
  }),
  record({
    canonicalId: "ca-dui-third-offense",
    officialTitle: "Driving Under the Influence — Third Offense",
    code: "23152; 23546",
    lawCode: "VEH",
    citation: "Cal. Vehicle Code §§ 23152, 23546",
    classification: "offense",
    elements: ["The defendant committed a § 23152 offense", "The defendant had two qualifying prior DUI convictions within the statutory period"],
    mentalState: "General intent to drive; the prior convictions are sentencing or grading facts.",
    grading: "Misdemeanor repeat-offender offense unless another statute applies.",
    penalty: "Repeat-offender penalties include increased jail, fines, license consequences, and programs; exact terms depend on the record.",
    juryInstruction: { ref: "CALCRIM 2120", url: CALCRIM_URL },
  }),
  record({
    canonicalId: "ca-reckless-driving",
    officialTitle: "Reckless Driving",
    code: "23103",
    lawCode: "VEH",
    citation: "Cal. Vehicle Code § 23103",
    classification: "offense",
    elements: ["The defendant drove a vehicle on a highway or in an offstreet parking facility", "The defendant drove in willful or wanton disregard for safety"],
    mentalState: "Willful or wanton disregard for safety.",
    grading: "Misdemeanor; certain injury circumstances change punishment.",
    penalty: "Misdemeanor punishable by 5 to 90 days in county jail and/or a fine under Vehicle Code § 23103; injury-related punishment requires a different charged provision.",
    juryInstruction: { ref: "CALCRIM 2200", url: CALCRIM_URL },
  }),
  record({
    canonicalId: "ca-driving-without-license",
    officialTitle: "Driving Without a Valid License",
    code: "12500(a)",
    lawCode: "VEH",
    citation: "Cal. Vehicle Code § 12500(a)",
    classification: "offense",
    elements: ["The defendant drove a motor vehicle on a highway", "The defendant was not then licensed as required"],
    mentalState: "Driving without the required valid license; exact knowledge requirements depend on the defense and facts.",
    grading: "Misdemeanor under Vehicle Code § 12500(a).",
    penalty: "Misdemeanor; confirm the current fine and sentencing provisions applicable to Vehicle Code § 12500(a).",
  }),
  record({
    canonicalId: "ca-domestic-battery",
    officialTitle: "Battery Against a Spouse, Cohabitant, or Dating Partner",
    code: "243(e)(1)",
    lawCode: "PEN",
    citation: "Cal. Penal Code § 243(e)(1)",
    classification: "offense",
    elements: ["The defendant committed a battery", "The alleged victim was a person described in § 243(e)(1)"],
    mentalState: "Willful or intentional touching; no intent to injure is required.",
    grading: "Misdemeanor",
    penalty: "Misdemeanor punishable by a fine up to $2,000, county jail up to 1 year, or both under Penal Code § 243(e)(1).",
    juryInstruction: { ref: "CALCRIM 841", url: CALCRIM_URL },
  }),
  record({
    canonicalId: "ca-fare-evasion",
    officialTitle: "Evasion of Payment on Public Transit",
    code: "640(c)(1), 640(a)(1)",
    lawCode: "PEN",
    citation: "Cal. Penal Code § 640(c)(1); penalty cross-reference: § 640(a)(1)",
    classification: "offense",
    elements: ["The defendant evaded payment of a public transit system fare by entering without valid fare", "The conduct occurred in or on a public transportation system facility or vehicle"],
    mentalState: "Intentional evasion of payment.",
    grading: "Infraction on a first or second violation; a third or subsequent violation of § 640(c)(1) is a misdemeanor under the § 640(a)(1) penalty cross-reference.",
    penalty: "First or second violation: infraction with a fine up to $250 and community service; third or subsequent violation of § 640(c)(1): misdemeanor with a fine up to $400, county jail up to 90 days, or both under § 640(a)(1).",
  }),
  record({
    canonicalId: "ca-prostitution-solicitation",
    officialTitle: "Soliciting or Agreeing to Engage in Prostitution",
    code: "647(b)",
    lawCode: "PEN",
    citation: "Cal. Penal Code § 647(b)",
    classification: "offense",
    elements: ["The defendant solicited or agreed to engage in an act of prostitution", "The defendant acted with the intent required by § 647(b)"],
    mentalState: "Specific intent to engage in or solicit the prohibited commercial sex act.",
    grading: "Misdemeanor",
    penalty: "Misdemeanor punishable by county jail up to 6 months and/or a fine under Penal Code § 647(b).",
  }),
  record({
    canonicalId: "ca-failure-to-appear",
    officialTitle: "Failure to Appear After Release",
    code: "1320",
    lawCode: "PEN",
    citation: "Cal. Penal Code § 1320",
    classification: "offense",
    elements: ["The defendant was released on their own recognizance or under a qualifying order", "The defendant willfully failed to appear as required", "The defendant had notice of the appearance"],
    mentalState: "Willful failure to appear.",
    grading: "Misdemeanor or felony depending on the underlying charge and subdivision.",
    penalty: PENALTY_WOBBLER,
  }),
  record({
    canonicalId: "ca-resisting-arrest",
    officialTitle: "Resisting, Delaying, or Obstructing an Officer",
    code: "148(a)(1)",
    lawCode: "PEN",
    citation: "Cal. Penal Code § 148(a)(1)",
    classification: "offense",
    elements: ["The defendant willfully resisted, delayed, or obstructed a peace officer", "The officer was lawfully performing duties", "The defendant knew or reasonably should have known the officer was performing duties"],
    mentalState: "Willful conduct with knowledge or reason to know of the officer's duties.",
    grading: "Misdemeanor",
    penalty: "Misdemeanor punishable by county jail up to 1 year and/or a fine under Penal Code § 148(a)(1).",
    juryInstruction: { ref: "CALCRIM 2656", url: CALCRIM_URL },
  }),
  record({
    canonicalId: "ca-protective-order-violation",
    officialTitle: "Violation of a Protective Order",
    code: "273.6",
    lawCode: "PEN",
    citation: "Cal. Penal Code § 273.6",
    classification: "offense",
    elements: ["A court issued a protective, restraining, or stay-away order", "The defendant knew of the order", "The defendant intentionally violated it"],
    mentalState: "Knowledge of the order and willful violation.",
    grading: "Misdemeanor or felony for repeat or aggravated violations.",
    penalty: PENALTY_WOBBLER,
  }),
  record({
    canonicalId: "ca-open-container",
    officialTitle: "Possession of an Open Container in a Motor Vehicle",
    code: "23222",
    lawCode: "VEH",
    citation: "Cal. Vehicle Code § 23222",
    classification: "offense",
    elements: ["The defendant possessed an open container or other prohibited substance in a motor vehicle", "The vehicle and substance fell within the statute"],
    mentalState: "Knowing possession.",
    grading: "Infraction or misdemeanor depending on the charged substance and facts.",
    penalty: PENALTY_INFRACTION,
  }),
  record({
    canonicalId: "ca-minor-in-possession",
    officialTitle: "Minor in Possession of Alcohol",
    code: "25662",
    lawCode: "BPC",
    citation: "Cal. Business & Professions Code § 25662",
    classification: "offense",
    elements: ["The defendant was under the statutory age", "The defendant possessed an alcoholic beverage in a public place or other covered circumstance"],
    mentalState: "Knowing possession.",
    grading: "Misdemeanor under Business and Professions Code § 25662(a).",
    penalty: "First violation: $250 fine or 24–32 hours of community service; subsequent violation: up to $500 fine or 36–48 hours of community service under § 25662(a).",
  }),
  record({
    canonicalId: "ca-false-info-to-police",
    officialTitle: "False Identification to a Peace Officer",
    code: "148.9",
    lawCode: "PEN",
    citation: "Cal. Penal Code § 148.9",
    classification: "offense",
    elements: ["The defendant falsely represented or identified themselves to a peace officer", "The defendant did so to evade a lawful process or avoid identification"],
    mentalState: "Intent to evade process or avoid proper identification.",
    grading: "Misdemeanor",
    penalty: "Misdemeanor punishable by county jail up to 6 months and/or a fine under Penal Code § 148.9.",
  }),
  record({
    canonicalId: "ca-driving-without-insurance",
    officialTitle: "Failure to Maintain Evidence of Financial Responsibility",
    code: "16028",
    lawCode: "VEH",
    citation: "Cal. Vehicle Code § 16028",
    classification: "offense",
    elements: ["The defendant drove a motor vehicle", "The defendant failed to provide evidence of financial responsibility when required"],
    mentalState: "Driving without the required evidence; exact defenses depend on the facts.",
    grading: "Infraction",
    penalty: "Infraction; the fine and proof-of-financial-responsibility consequences depend on the violation and any later proof under Vehicle Code § 16028.",
  }),
  record({
    canonicalId: "ca-expired-registration",
    officialTitle: "Operating an Unregistered Vehicle",
    code: "4000(a)(1)",
    lawCode: "VEH",
    citation: "Cal. Vehicle Code § 4000(a)(1)",
    classification: "offense",
    elements: ["The defendant operated a motor vehicle on a highway", "The vehicle was not registered as required"],
    mentalState: "Operation of an unregistered vehicle; statutory exceptions may apply.",
    grading: "Infraction unless another provision applies.",
    penalty: "Infraction; registration fees, statutory fines, and any applicable assessments depend on the violation under Vehicle Code § 4000(a)(1).",
  }),
  record({
    canonicalId: "ca-failure-to-pay-child-support",
    officialTitle: "Failure to Provide Child Support",
    code: "270",
    lawCode: "PEN",
    citation: "Cal. Penal Code § 270",
    classification: "offense",
    elements: ["The defendant had the ability to provide support", "The defendant willfully failed to provide required support for a child"],
    mentalState: "Willful failure with ability to provide.",
    grading: "Misdemeanor",
    penalty: "Misdemeanor punishable by county jail up to 1 year and/or a fine under Penal Code § 270.",
  }),
  record({
    canonicalId: "ca-indecent-exposure",
    officialTitle: "Indecent Exposure",
    code: "314",
    lawCode: "PEN",
    citation: "Cal. Penal Code § 314",
    classification: "offense",
    elements: ["The defendant exposed their genitals or pubic area", "The exposure was willful and lewd", "The defendant intended to direct attention to themselves or their genitals"],
    mentalState: "Willful and lewd exposure with the required intent.",
    grading: "Misdemeanor or felony depending on prior qualifying convictions.",
    penalty: PENALTY_WOBBLER,
    juryInstruction: { ref: "CALCRIM 1160", url: CALCRIM_URL },
  }),
  record({
    canonicalId: "ca-animal-cruelty-misdemeanor",
    officialTitle: "Animal Cruelty",
    code: "597(b)",
    lawCode: "PEN",
    citation: "Cal. Penal Code § 597(b)",
    classification: "offense",
    elements: ["The defendant cruelly killed, injured, overworked, beat, or neglected an animal", "The conduct fell within the misdemeanor subdivision"],
    mentalState: "Intentional or criminally negligent conduct as specified by the charged theory.",
    grading: "Misdemeanor under § 597(b); other subdivisions differ.",
    penalty: "Misdemeanor punishable by county jail up to 1 year and/or a fine under Penal Code § 597(b).",
  }),
  record({
    canonicalId: "ca-littering",
    officialTitle: "Littering",
    code: "374.4",
    lawCode: "PEN",
    citation: "Cal. Penal Code § 374.4",
    classification: "offense",
    elements: ["The defendant discarded waste or other material", "The discard occurred in a place and manner prohibited by § 374.4"],
    mentalState: "Intentional or knowing discard as specified by the statute.",
    grading: "Infraction or misdemeanor depending on the charged amount and circumstances.",
    penalty: "Infraction with mandatory fines of $250–$1,000 for a first conviction, $500–$1,500 for a second, and $750–$3,000 for a third or subsequent conviction under Penal Code § 374.4.",
  }),
  record({
    canonicalId: "ca-illegal-fireworks",
    officialTitle: "Unlawful Fireworks Possession or Discharge",
    code: "12677",
    lawCode: "HSC",
    citation: "Cal. Health & Safety Code § 12677",
    classification: "offense",
    elements: ["The defendant possessed, sold, or discharged fireworks", "The fireworks or conduct were prohibited by § 12677"],
    mentalState: "Knowing or intentional conduct as specified by the charged act.",
    grading: "Misdemeanor or felony depending on the fireworks and conduct.",
    penalty: PENALTY_WOBBLER,
  }),
  record({
    canonicalId: "ca-conspiracy",
    officialTitle: "Criminal Conspiracy",
    code: "182",
    lawCode: "PEN",
    citation: "Cal. Penal Code § 182",
    classification: "offense",
    elements: ["Two or more people agreed to commit a crime", "The defendant intended to agree and intended that the crime be committed", "An overt act was committed to further the agreement"],
    mentalState: "Intent to agree and intent that the target crime be committed.",
    grading: "Depends on the target offense and statutory subdivision.",
    penalty: PENALTY_WOBBLER,
    juryInstruction: { ref: "CALCRIM 415", url: CALCRIM_URL },
  }),
  record({
    canonicalId: "ca-accessory-after-the-fact",
    officialTitle: "Accessory After the Fact",
    code: "32",
    lawCode: "PEN",
    citation: "Cal. Penal Code § 32",
    classification: "offense",
    elements: ["Another person committed a felony", "The defendant harbored, concealed, or aided that person", "The defendant knew the person committed the felony and intended to help them avoid arrest, trial, conviction, or punishment"],
    mentalState: "Knowledge of the felony and intent to help the felon avoid justice.",
    grading: "Felony.",
    penalty: "Punishable by imprisonment pursuant to Penal Code § 1170(h), a fine, or both, as provided by Penal Code § 32.",
    juryInstruction: { ref: "CALCRIM 440", url: CALCRIM_URL },
  }),
  record({
    canonicalId: "ca-attempted-murder",
    officialTitle: "Attempted Murder",
    code: "664, 187",
    lawCode: "PEN",
    citation: "Cal. Penal Code §§ 664, 187",
    classification: "offense",
    elements: ["The defendant intended to kill", "The defendant took a direct but ineffective step toward killing another person"],
    mentalState: "Express malice and intent to kill.",
    grading: "Felony; degree and punishment depend on the charged theory.",
    penalty: "Felony; non-premeditated attempted murder is generally punishable by 5, 7, or 9 years, while willful, deliberate, and premeditated attempted murder is punishable by life with the possibility of parole under Penal Code § 664.",
    juryInstruction: { ref: "CALCRIM 600", url: CALCRIM_URL },
  }),
  record({
    canonicalId: "ca-attempted-robbery",
    officialTitle: "Attempted Robbery",
    code: "664, 211",
    lawCode: "PEN",
    citation: "Cal. Penal Code §§ 664, 211",
    classification: "offense",
    elements: ["The defendant intended to commit robbery", "The defendant took a direct but ineffective step toward committing robbery"],
    mentalState: "Intent to commit robbery.",
    grading: "Felony",
    penalty: "Felony; punishment is governed by the attempted-offense and robbery provisions in Penal Code §§ 664 and 213 and depends on the robbery degree and charged facts.",
    juryInstruction: { ref: "CALCRIM 460", url: CALCRIM_URL },
  }),
  record({
    canonicalId: "ca-criminal-solicitation",
    officialTitle: "Solicitation to Commit a Crime",
    code: "653f",
    lawCode: "PEN",
    citation: "Cal. Penal Code § 653f",
    classification: "offense",
    elements: ["The defendant solicited another person to commit a specified crime", "The defendant intended that the solicited crime be committed"],
    mentalState: "Intent that the solicited crime be committed.",
    grading: "Depends on the target offense and charged subdivision.",
    penalty: PENALTY_WOBBLER,
  }),
  record({
    canonicalId: "ca-money-laundering",
    officialTitle: "Money Laundering",
    code: "186.10",
    lawCode: "PEN",
    citation: "Cal. Penal Code § 186.10",
    classification: "offense",
    elements: ["The defendant conducted or attempted a qualifying financial transaction", "The transaction involved proceeds of criminal activity", "The defendant acted with the knowledge and intent required by § 186.10"],
    mentalState: "Knowledge that the transaction involved criminal proceeds plus the statutory intent.",
    grading: "Felony or misdemeanor depending on amount and circumstances.",
    penalty: "Misdemeanor punishment may include county jail up to 1 year; felony punishment may include imprisonment under Penal Code § 1170(h) for 16 months, 2 years, or 3 years, depending on the amount and circumstances under § 186.10.",
  }),
];

const byCanonicalId = new Map(
  CALIFORNIA_CANONICAL_RECORDS.map((entry) => [entry.canonicalId, entry]),
);

/**
 * Exact explanation joins for canonical California IDs.  The generic
 * explanation remains a fallback for concepts without a California-specific
 * entry, but a display-name regex is no longer the primary join for these
 * canonical records.
 */
export const CALIFORNIA_EXPLANATION_SLUGS: Record<string, string> = {
  "ca-murder-in-the-first-degree": "murder-in-the-first-degree",
  "ca-murder-in-the-second-degree": "murder-in-the-second-degree",
  "ca-voluntary-manslaughter": "manslaughter",
  "ca-involuntary-manslaughter": "manslaughter",
  "ca-assault-with-deadly-weapon": "assault-with-a-deadly-weapon",
  "ca-domestic-battery": "domestic-violence",
  "ca-assault-on-peace-officer": "assault-generic",
  "ca-menacing": "assault-generic",
  "ca-petty-theft": "theft",
  "ca-theft-by-receiving": "receiving-stolen-property",
  "ca-credit-card-fraud": "financial-fraud",
  "ca-embezzlement": "financial-fraud",
  "ca-shoplifting": "shoplifting",
  "ca-burglary-in-the-first-degree": "burglary",
  "ca-burglary-in-the-second-degree": "burglary",
  "ca-robbery-in-the-first-degree": "robbery",
  "ca-robbery-in-the-second-degree": "robbery",
  "ca-carjacking": "carjacking",
  "ca-possession-of-controlled-substance": "drug-possession",
  "ca-possession-with-intent-to-distribute": "drug-distribution",
  "ca-distribution-of-controlled-substance": "drug-distribution",
  "ca-manufacturing-controlled-substance": "drug-distribution",
  "ca-possession-of-drug-paraphernalia": "drug-possession",
  "ca-maintaining-drug-house": "drug-distribution",
  "ca-unlawful-carrying-of-weapon": "weapons-charges",
  "ca-felon-in-possession-of-firearm": "weapons-charges",
  "ca-discharge-of-firearm-in-city": "weapons-charges",
  "ca-possession-of-prohibited-weapon": "weapons-charges",
  "ca-check-fraud": "check-fraud",
  "ca-forgery": "forgery",
  "ca-public-intoxication": "public-intoxication",
  "ca-vandalism": "criminal-mischief",
  "ca-dui-second-offense": "dui",
  "ca-dui-third-offense": "dui",
  "ca-reckless-driving": "reckless-driving",
  "ca-driving-without-license": "driving-without-license",
  "ca-fare-evasion": "fare-evasion",
  "ca-prostitution-solicitation": "prostitution-solicitation",
  "ca-resisting-arrest": "resisting-arrest",
  "ca-minor-in-possession": "public-intoxication",
  "ca-false-info-to-police": "failure-to-identify",
  "ca-driving-without-insurance": "driving-without-license",
  "ca-expired-registration": "driving-without-license",
  "ca-failure-to-pay-child-support": "criminal-nonsupport",
  "ca-animal-cruelty-misdemeanor": "animal-cruelty",
  "ca-littering": "criminal-mischief",
  "ca-attempted-murder": "attempted-murder",
  "ca-attempted-robbery": "conspiracy-accessory-attempt",
  "ca-money-laundering": "financial-fraud",
};

export function getCaliforniaExplanationSlug(id: string): string | undefined {
  return CALIFORNIA_EXPLANATION_SLUGS[id];
}

const alias = (legacyId: string, canonicalId: string, reason: string): CaliforniaLegacyDisposition => ({
  legacyId,
  disposition: "alias",
  canonicalId,
  reason,
});
const remove = (legacyId: string, reason: string): CaliforniaLegacyDisposition => ({
  legacyId,
  disposition: "remove",
  reason,
});
const reselect = (legacyId: string, reason: string): CaliforniaLegacyDisposition => ({
  legacyId,
  disposition: "reselection-required",
  reason,
});
const retained = (legacyId: string): CaliforniaLegacyDisposition => {
  const entry = byCanonicalId.get(legacyId);
  if (!entry) throw new Error(`California retained record missing canonical metadata: ${legacyId}`);
  return {
    legacyId,
    disposition: entry.canonicalId === legacyId ? "retain" : "rename",
    canonicalId: entry.canonicalId,
    reason: "Current statewide offense with exact statute, elements, grading, and currentness evidence.",
  };
};

/**
 * Complete inventory of the 115 records exposed by the legacy California
 * catalog.  Every record has an explicit disposition; anything not in the
 * selectable set is rejected at the input boundary and never returned by the
 * selector API.
 */
export const CALIFORNIA_LEGACY_DISPOSITIONS: CaliforniaLegacyDisposition[] = [
  ...[
    "ca-murder-in-the-first-degree", "ca-murder-in-the-second-degree",
    "ca-voluntary-manslaughter", "ca-involuntary-manslaughter",
    "ca-assault-with-deadly-weapon", "ca-assault-on-peace-officer",
    "ca-menacing", "ca-petty-theft", "ca-theft-by-receiving", "ca-credit-card-fraud",
    "ca-embezzlement", "ca-shoplifting", "ca-burglary-in-the-first-degree",
    "ca-burglary-in-the-second-degree", "ca-robbery-in-the-first-degree",
    "ca-robbery-in-the-second-degree", "ca-carjacking",
    "ca-possession-of-controlled-substance", "ca-possession-with-intent-to-distribute",
    "ca-distribution-of-controlled-substance", "ca-manufacturing-controlled-substance",
    "ca-possession-of-drug-paraphernalia", "ca-maintaining-drug-house",
    "ca-unlawful-carrying-of-weapon", "ca-felon-in-possession-of-firearm",
    "ca-discharge-of-firearm-in-city", "ca-possession-of-prohibited-weapon",
    "ca-check-fraud", "ca-forgery", "ca-public-intoxication", "ca-vandalism",
    "ca-dui-second-offense", "ca-dui-third-offense",
    "ca-reckless-driving", "ca-driving-without-license", "ca-domestic-battery",
    "ca-fare-evasion", "ca-prostitution-solicitation",
    "ca-resisting-arrest",
    "ca-minor-in-possession", "ca-false-info-to-police", "ca-driving-without-insurance",
    "ca-expired-registration", "ca-failure-to-pay-child-support",
    "ca-animal-cruelty-misdemeanor", "ca-littering",
    "ca-attempted-murder", "ca-attempted-robbery",
    "ca-money-laundering",
  ].map(retained),
  alias("ca-felony-murder", "ca-murder-in-the-first-degree", "California treats felony murder as a theory/degree under § 189, not a separate generic offense."),
  alias("ca-domestic-violence-assault", "ca-domestic-battery", "The legacy label did not identify a California offense; the precise statewide record is § 243(e)(1) battery."),
  alias("ca-bank-robbery", "ca-robbery-in-the-first-degree", "California has no standalone generic bank-robbery offense in this catalog; the location may affect the robbery degree or other charges."),
  alias("ca-drug-trafficking", "ca-distribution-of-controlled-substance", "Drug trafficking is an ambiguous generic label; the current California statute record is § 11352 sale/transport."),
  alias("ca-petty-theft-misdemeanor", "ca-petty-theft", "Duplicate legacy label for the same petty-theft family."),
  alias("ca-bad-checks", "ca-check-fraud", "Duplicate legacy label for § 476a."),
  alias("ca-noise-violation", "ca-disturbing-the-peace", "Duplicate/generalized label for § 415."),
  reselect("ca-criminally-negligent-homicide", "California does not have a standalone offense with this generic label; select the applicable manslaughter or vehicular-manslaughter statute."),
  reselect("ca-vehicular-homicide", "Vehicular homicide is too broad for one record; § 191.5 and § 192(c) describe materially different offenses."),
  reselect("ca-assault-in-the-second-degree", "California does not use a generic numbered second-degree assault offense; select the exact battery or assault statute."),
  reselect("ca-assault-in-the-third-degree", "California does not use a generic numbered third-degree assault offense; select the exact assault statute."),
  reselect("ca-rape-in-the-first-degree", "California's § 261 contains distinct subdivisions; the generic first-degree label is not an exact California offense."),
  reselect("ca-sexual-assault-in-the-second-degree", "Section 289 contains distinct subdivisions and conduct; select the exact charged subdivision."),
  reselect("ca-sexual-assault-in-the-third-degree", "Section 243.4 contains distinct subdivisions and conduct; select the exact charged subdivision."),
  reselect("ca-statutory-rape", "Section 261.5 has materially different subdivisions based on age and age difference; select the exact subdivision."),
  reselect("ca-child-sexual-abuse", "Section 288 contains distinct subdivisions and protected-age facts; select the exact charged subdivision."),
  reselect("ca-grand-theft-in-the-first-degree", "California does not use a single generic first-degree grand-theft offense; select the exact § 487 subdivision and property type."),
  reselect("ca-identity-theft", "Section 530.5 contains distinct conduct and subdivisions; select the exact charged subdivision."),
  reselect("ca-insurance-fraud", "Section 550 contains distinct insurance-fraud acts and subdivisions; select the exact charged provision."),
  reselect("ca-computer-fraud", "Section 502 contains distinct unauthorized-access and damage theories; select the exact charged subdivision."),
  reselect("ca-disturbing-the-peace", "Section 415 contains distinct conduct theories; select the exact charged subdivision."),
  reselect("ca-dui-first-offense", "Section 23152 contains separate alcohol and drug theories; select the exact charged subdivision and applicable prior history."),
  reselect("ca-failure-to-appear", "Section 1320 contains distinct failure-to-appear offenses keyed to the underlying charge and notice facts."),
  reselect("ca-protective-order-violation", "Section 273.6 contains distinct violations and repeat/aggravated circumstances; select the exact charged subdivision."),
  reselect("ca-open-container", "Section 23222 has different alcohol, cannabis, and controlled-substance provisions; select the exact charged subdivision."),
  reselect("ca-indecent-exposure", "Section 314 contains distinct exposure and repeat-offense provisions; select the exact charged subdivision."),
  reselect("ca-illegal-fireworks", "Section 12677 applies to different fireworks and conduct; select the exact charged provision."),
  reselect("ca-conspiracy", "Conspiracy liability depends on the exact target offense and subdivision; it is not a standalone generic charge record."),
  reselect("ca-accessory-after-the-fact", "Accessory liability is a theory tied to a specific felony and is not a generic standalone selector record."),
  reselect("ca-criminal-solicitation", "Solicitation depends on the exact target offense and subdivision; select the specific charged statute."),
  reselect("ca-sexual-exploitation-of-minor", "The legacy label does not identify the exact § 311.4 subdivision or statutory conduct."),
  reselect("ca-wire-fraud", "Wire fraud is a federal/generic label, not a standalone California offense."),
  reselect("ca-mail-fraud", "Mail fraud is a federal/generic label, not a standalone California offense."),
  reselect("ca-tax-fraud", "Tax offenses require the tax type and exact Revenue and Taxation Code subdivision."),
  reselect("ca-disorderly-conduct", "Section 647 contains multiple distinct offenses; the generic label is not a selectable statutory identity."),
  reselect("ca-trespassing", "Section 602 contains materially different trespass offenses and required facts; the generic label is not specific enough."),
  reselect("ca-loitering", "The legacy code and label do not identify a single current statewide loitering offense."),
  reselect("ca-hit-and-run", "Hit-and-run offenses differ by injury/death and property-damage facts; select § 20001 or § 20002 specifically."),
  reselect("ca-driving-while-suspended", "California has multiple suspended-license offenses with different status and notice elements."),
  reselect("ca-contempt-of-court", "Criminal contempt under § 166 requires the exact order and subdivision; the generic proceeding label is not specific enough."),
  remove("ca-probation-violation", "A supervision violation/proceeding is not a standalone criminal charge in this selector."),
  reselect("ca-harassment", "The legacy label combines harassment and stalking, which are distinct offenses with different elements."),
  reselect("ca-expired-inspection", "The legacy inspection concept and citation do not identify a current statewide criminal offense."),
  reselect("ca-fake-id", "False-ID offenses vary by document, age, and conduct; § 25661 is not a general fake-ID statute."),
  remove("ca-animal-at-large", "Leash and animal-at-large rules are generally local/regulatory, not one statewide criminal offense."),
  reselect("ca-illegal-camping", "The legacy label is broader than the cited § 647 subdivision and is sensitive to statutory and constitutional limits."),
  reselect("ca-panhandling", "Solicitation rules and statutory subdivisions must be stated precisely; the generic label is not a safe statewide record."),
  reselect("ca-alcohol-in-park", "Alcohol-in-park rules depend on the applicable local or park regulation and are not one statewide criminal offense."),
  remove("ca-curfew-violation", "Curfew is primarily a juvenile/local regulatory matter, not a statewide adult criminal charge."),
  reselect("ca-trespass-after-warning", "The facts and exact § 602 subdivision are required; the legacy label cannot identify the offense."),
  reselect("ca-defective-vehicle-equipment", "The legacy code and description do not identify one current statewide offense."),
  remove("ca-truancy", "Truancy is an education/attendance matter, not an adult criminal charge."),
  reselect("ca-hunting-fishing-no-license", "Fish and Game licensing offenses require the exact activity and code subdivision."),
  reselect("ca-criminal-attempt", "Attempt is not a standalone generic offense; the target crime must be identified."),
  remove("ca-aiding-and-abetting", "Accomplice liability is a liability theory, not a standalone charge."),
  reselect("ca-attempted-sexual-assault", "The target sexual offense must be identified because attempt elements and grading follow that offense."),
  remove("ca-gang-enhancement", "Enhancement-only record; it must attach to a specific qualifying offense and is not a standalone selector charge."),
  remove("ca-hate-crime-enhancement", "Enhancement-only record; it must attach to a specific underlying offense."),
  remove("ca-recidivist-enhancement", "Sentencing enhancement; it is not a standalone criminal charge."),
  remove("ca-firearm-in-felony-enhancement", "Firearm sentencing enhancement; it is not a standalone criminal charge."),
  remove("ca-drug-school-zone-enhancement", "Drug-zone enhancement; it must attach to a specific drug offense."),
  remove("ca-rico-organized-crime", "The cited provision is not a standalone generic California RICO offense."),
  remove("ca-juvenile-delinquency-felony", "Juvenile delinquency is a juvenile proceeding, not an adult criminal conviction."),
  remove("ca-juvenile-delinquency-misdemeanor", "Juvenile delinquency is a juvenile proceeding, not an adult criminal conviction."),
  remove("ca-juvenile-transfer-adult-court", "Transfer is a juvenile proceeding, not the underlying criminal offense."),
  remove("ca-juvenile-firearm-possession", "Juvenile firearm possession requires age-specific facts and a dedicated juvenile-law record; it is not safe in the adult selector."),
];

const legacyMap = new Map(
  CALIFORNIA_LEGACY_DISPOSITIONS.map((entry) => [entry.legacyId, entry]),
);
const selectableCanonicalIds = new Set(
  CALIFORNIA_LEGACY_DISPOSITIONS
    .filter((entry) => entry.disposition === "retain" || entry.disposition === "rename")
    .map((entry) => entry.canonicalId),
);
for (const record of CALIFORNIA_CANONICAL_RECORDS) {
  record.selectable = selectableCanonicalIds.has(record.canonicalId);
}

export function getCaliforniaCanonicalRecord(id: string): CaliforniaCanonicalRecord | undefined {
  const disposition = legacyMap.get(id);
  if (!disposition?.canonicalId || disposition.disposition === "remove" || disposition.disposition === "reselection-required") {
    return undefined;
  }
  return byCanonicalId.get(disposition.canonicalId);
}

export function getCaliforniaLegacyDisposition(id: string): CaliforniaLegacyDisposition | undefined {
  return legacyMap.get(id);
}

export function isCaliforniaSelectableId(id: string): boolean {
  return getCaliforniaCanonicalRecord(id)?.selectable === true;
}

export function getCaliforniaCanonicalCharge(
  legacyCharge: CriminalCharge,
): CriminalCharge | undefined {
  const metadata = getCaliforniaCanonicalRecord(legacyCharge.id);
  if (!metadata) return undefined;
  return {
    ...legacyCharge,
    id: metadata.canonicalId,
    name: metadata.officialTitle,
    code: metadata.code,
    description: `${metadata.officialTitle} under ${metadata.citation}. The prosecution generally must prove: ${metadata.elements.join("; ")}.`,
    category:
      metadata.grading.toLowerCase().includes("infraction")
        ? "infraction"
        : metadata.grading.toLowerCase().includes("misdemeanor") &&
            !metadata.grading.toLowerCase().includes("felony")
          ? "misdemeanor"
          : "felony",
    maxPenalty: metadata.penalty,
    commonDefenses: ["The available defenses depend on the exact statutory elements and facts; discuss them with a California criminal-defense attorney."],
    evidenceToGather: ["Obtain the charging document and the exact statutory subdivision before evaluating the allegations."],
    specificRights: ["You have the right to remain silent and to consult a lawyer; do not discuss case facts with investigators without legal advice."],
    urgentActions: ["Preserve the charging papers and court dates, and seek California criminal-defense counsel promptly."],
    dataConfidence: "high",
    statuteCitations: [metadata.citation],
    sourceUrls: metadata.sources
      .filter((source) => source.kind === "statute")
      .map((source) => source.url),
    lastVerified: "2026-08",
  };
}

export function getCaliforniaCanonicalCharges(
  legacyCharges: CriminalCharge[],
): CriminalCharge[] {
  const byId = new Map(legacyCharges.map((charge) => [charge.id, charge]));
  return CALIFORNIA_CANONICAL_RECORDS.flatMap((metadata) => {
    const source = byId.get(metadata.legacyIds[0]);
    if (!source) return [];
    const canonical = getCaliforniaCanonicalCharge(source);
    return canonical ? [canonical] : [];
  });
}

export function getCaliforniaCitation(id: string): string | null {
  return getCaliforniaCanonicalRecord(id)?.citation ?? null;
}

export function getCaliforniaSourceUrl(id: string): string | null {
  return getCaliforniaCanonicalRecord(id)?.sources.find((source) => source.kind === "statute")?.url ?? null;
}

export function getCaliforniaInstruction(id: string): { ref: string; url: string } | null {
  return getCaliforniaCanonicalRecord(id)?.juryInstruction ?? null;
}

export function getCaliforniaReviewStatus(id: string): "pending" | null {
  return getCaliforniaCanonicalRecord(id)?.attorneyReview ?? null;
}

export interface CaliforniaReconciliationInventoryRow extends CaliforniaLegacyDisposition {
  officialTitle?: string;
  citation?: string;
  sourceUrl?: string;
  juryInstructionRef?: string;
  explanationSlug?: string;
}

/** Joined audit view used by review reports and release-gate tests. */
export function getCaliforniaReconciliationInventory(): CaliforniaReconciliationInventoryRow[] {
  return CALIFORNIA_LEGACY_DISPOSITIONS.map((entry) => {
    const canonical = entry.canonicalId
      ? getCaliforniaCanonicalRecord(entry.canonicalId)
      : undefined;
    return {
      ...entry,
      ...(canonical
        ? {
            officialTitle: canonical.officialTitle,
            citation: canonical.citation,
            sourceUrl: getCaliforniaSourceUrl(canonical.canonicalId) ?? undefined,
            juryInstructionRef: canonical.juryInstruction?.ref,
            explanationSlug: getCaliforniaExplanationSlug(canonical.canonicalId),
          }
        : {}),
    };
  });
}

export function assertCaliforniaInventoryComplete(currentIds: string[]): void {
  const expected = new Set(CALIFORNIA_LEGACY_DISPOSITIONS.map((entry) => entry.legacyId));
  const actual = new Set(currentIds);
  const missing = [...actual].filter((id) => !expected.has(id));
  const stale = [...expected].filter((id) => !actual.has(id));
  if (missing.length || stale.length || expected.size !== 115) {
    throw new Error(
      `California reconciliation inventory drift: expected 115 (${expected.size}), missing=${missing.join(",")}, stale=${stale.join(",")}`,
    );
  }
}