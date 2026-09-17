import { createHash } from "node:crypto";
import { OHIO_CHAPTER_2903_ADDITIONAL_SOURCE_RECORDS } from "./ohio-chapter-2903-additional-source";
import { OHIO_MANSLAUGHTER_SOURCE_RECORDS } from "./ohio-manslaughter-source";
import { OHIO_AGGRAVATED_ASSAULT_SOURCE } from "./ohio-assault-source";
import { OHIO_FELONIOUS_ASSAULT_SOURCE } from "./ohio-felonious-assault-source";

export type OhioChapter2903SupportRole = "offense" | "penalty";

export interface OhioChapter2903QuotedSpan {
  kind: "title" | "currentness" | "offense" | "grading" | "penalty";
  quote: string;
  start: number;
  end: number;
}

export interface OhioChapter2903OfficialDocument {
  section: string;
  subdivision: string | null;
  citation: string;
  title: string;
  sourceUrl: string;
  effectiveDateStart: string;
  retrievedAt: Date;
  text: string;
  contentHash: string;
  quotedSpans: readonly OhioChapter2903QuotedSpan[];
}

export interface OhioChapter2903PilotSourceRecord {
  chargeId: string;
  canonicalTitle: string;
  offense: OhioChapter2903OfficialDocument;
  penalty: OhioChapter2903OfficialDocument;
  penaltyFine?: OhioChapter2903OfficialDocument;
  /** Definition provisions supporting offense scope, not extra offenses. */
  additionalEvidence?: OhioChapter2903OfficialDocument[];
  additionalPenalties?: OhioChapter2903OfficialDocument[];
}

const retrievedAt = new Date("2026-09-16T22:58:10.000Z");
const ohioCodeUrl = (section: string) =>
  `https://codes.ohio.gov/ohio-revised-code/section-${section}`;

/**
 * These pages were fetched directly from codes.ohio.gov on 2026-09-16 using
 * extractOhioDocument in scripts/data-review/import-ohio-source-database.ts.
 * Keep the complete extraction server-side: only explicit, short catalog
 * claims leave this module.
 */
const aggravatedMurderText = `Section 2903.01 |
Aggravated murder.
Effective: 2019-03-20
(A) No person shall purposely, and with prior calculation and design, cause the death of another or the unlawful termination of another's pregnancy.
(B) No person shall purposely cause the death of another or the unlawful termination of another's pregnancy while committing or attempting to commit, or while fleeing immediately after committing or attempting to commit, kidnapping, rape, aggravated arson, arson, aggravated robbery, robbery, aggravated burglary, burglary, trespass in a habitation when a person is present or likely to be present, terrorism, or escape.
(C) No person shall purposely cause the death of another who is under thirteen years of age at the time of the commission of the offense.
(D) No person who is under detention as a result of having been found guilty of or having pleaded guilty to a felony or who breaks that detention shall purposely cause the death of another.
(E) No person shall purposely cause the death of a law enforcement officer whom the offender knows or has reasonable cause to know is a law enforcement officer when either of the following applies:
(1) The victim, at the time of the commission of the offense, is engaged in the victim's duties.
(2) It is the offender's specific purpose to kill a law enforcement officer.
(F) No person shall purposely cause the death of a first responder or military member whom the offender knows or has reasonable cause to know is a first responder or military member when it is the offender's specific purpose to kill a first responder or military member.
(G) Whoever violates this section is guilty of aggravated murder, and shall be punished as provided in section 2929.02 of the Revised Code.
(H) As used in this section:
(1) "Detention" has the same meaning as in section 2921.01 of the Revised Code.
(2) "Law enforcement officer" has the same meaning as in section 2911.01 of the Revised Code and also includes any federal law enforcement officer as defined in section 2921.51 of the Revised Code and anyone who has previously served as a law enforcement officer or federal law enforcement officer.
(3) "First responder" means an emergency medical service provider, a firefighter, or any other emergency response personnel, or anyone who has previously served as a first responder.
(4) "Military member" means a member of the armed forces of the United States, reserves, or Ohio national guard, a participant in ROTC, JROTC, or any similar military training program, or anyone who has previously served in the military.`;

const murderText = `Section 2903.02 |
Murder.
Effective: 1998-06-30
(A) No person shall purposely cause the death of another or the unlawful termination of another's pregnancy.
(B) No person shall cause the death of another as a proximate result of the offender's committing or attempting to commit an offense of violence that is a felony of the first or second degree and that is not a violation of section 2903.03 or 2903.04 of the Revised Code.
(C) Division (B) of this section does not apply to an offense that becomes a felony of the first or second degree only if the offender previously has been convicted of that offense or another specified offense.
(D) Whoever violates this section is guilty of murder, and shall be punished as provided in section 2929.02 of the Revised Code.`;

const murderPenaltiesText = `Section 2929.02 |
Murder penalties.
Effective: 2021-04-12
(A) Whoever is convicted of or pleads guilty to aggravated murder in violation of section 2903.01 of the Revised Code shall suffer death or be imprisoned for life, as determined pursuant to sections 2929.022, 2929.03, and 2929.04 of the Revised Code, except that no person who is not found to have been eighteen years of age or older at the time of the commission of the offense shall be imprisoned for life without parole, and that no person who raises the matter of age pursuant to section 2929.023 of the Revised Code and who is not found to have been eighteen years of age or older at the time of the commission of the offense and no person who raises the matter of the person's serious mental illness at the time of the alleged commission of the offense pursuant to section 2929.025 of the Revised Code and is found under that section to be ineligible for a sentence of death due to serious mental illness shall suffer death. In addition, the offender may be fined an amount fixed by the court, but not more than twenty-five thousand dollars.
(B)(1) Except as otherwise provided in division (B)(2) or (3) of this section, whoever is convicted of or pleads guilty to murder in violation of section 2903.02 of the Revised Code shall be imprisoned for an indefinite term of fifteen years to life.
(2) Except as otherwise provided in division (B)(3) of this section, if a person is convicted of or pleads guilty to murder in violation of section 2903.02 of the Revised Code, the victim of the offense was less than thirteen years of age, and the offender also is convicted of or pleads guilty to a sexual motivation specification that was included in the indictment, count in the indictment, or information charging the offense, the court shall impose an indefinite prison term of thirty years to life pursuant to division (B)(3) of section 2971.03 of the Revised Code.
(3) Except as otherwise provided in this division, if a person is convicted of or pleads guilty to murder in violation of section 2903.02 of the Revised Code and also is convicted of or pleads guilty to a sexual motivation specification and a sexually violent predator specification that were included in the indictment, count in the indictment, or information that charged the murder, the court shall impose upon the offender a term of life imprisonment without parole that shall be served pursuant to section 2971.03 of the Revised Code. If the offender was under eighteen years of age at the time of the offense, the court shall impose an indefinite prison term of thirty years to life.
(4) In addition, the offender may be fined an amount fixed by the court, but not more than fifteen thousand dollars.
(C) If an offender receives or received a sentence of life imprisonment without parole, a sentence of life imprisonment, a definite sentence, or a sentence to an indefinite prison term under this chapter for an aggravated murder or murder that was committed when the offender was under eighteen years of age, the offender's parole eligibility shall be determined under section 2967.132 of the Revised Code.
(D) The court shall not impose a fine or fines for aggravated murder or murder which, in the aggregate and to the extent not suspended by the court, exceeds the amount which the offender is or will be able to pay by the method and within the time allowed without undue hardship to the offender or to the dependents of the offender, or will prevent the offender from making reparation for the victim's wrongful death.
(E)(1) In addition to any other sanctions imposed for a violation of section 2903.01 or 2903.02 of the Revised Code, if the offender used a motor vehicle as the means to commit the violation, the court shall impose upon the offender a class two suspension of the offender's driver's license, commercial driver's license, temporary instruction permit, probationary license, or nonresident operating privilege as specified in division (A)(2) of section 4510.02 of the Revised Code.
(2) As used in division (E) of this section, "motor vehicle" has the same meaning as in section 4501.01 of the Revised Code.
The Legislative Service Commission presents the text of this section as a composite of the section as amended by multiple acts of the General Assembly. This presentation recognizes the principle stated in R.C. 1.52(B) that amendments are to be harmonized if reasonably capable of simultaneous operation.`;

const aggravatedPenaltyQuote = `(A) Whoever is convicted of or pleads guilty to aggravated murder in violation of section 2903.01 of the Revised Code shall suffer death or be imprisoned for life, as determined pursuant to sections 2929.022, 2929.03, and 2929.04 of the Revised Code, except that no person who is not found to have been eighteen years of age or older at the time of the commission of the offense shall be imprisoned for life without parole, and that no person who raises the matter of age pursuant to section 2929.023 of the Revised Code and who is not found to have been eighteen years of age or older at the time of the commission of the offense and no person who raises the matter of the person's serious mental illness at the time of the alleged commission of the offense pursuant to section 2929.025 of the Revised Code and is found under that section to be ineligible for a sentence of death due to serious mental illness shall suffer death. In addition, the offender may be fined an amount fixed by the court, but not more than twenty-five thousand dollars.`;
const murderPenaltyQuote = `(B)(1) Except as otherwise provided in division (B)(2) or (3) of this section, whoever is convicted of or pleads guilty to murder in violation of section 2903.02 of the Revised Code shall be imprisoned for an indefinite term of fifteen years to life.`;

export const OHIO_CHAPTER_2903_PILOT_SOURCE_RECORDS: readonly OhioChapter2903PilotSourceRecord[] = [
  {
    chargeId: "oh-orc-2903-01-aggravated-murder",
    canonicalTitle: "Aggravated murder",
    offense: {
      section: "2903.01",
      subdivision: null,
      citation: "Ohio Rev. Code Ann. § 2903.01",
      title: "Aggravated murder",
      sourceUrl: ohioCodeUrl("2903.01"),
      effectiveDateStart: "2019-03-20",
      retrievedAt,
      text: aggravatedMurderText,
      contentHash: "98a8094c5635e8b7619106d4f1fc6a0d7774afee7cd9ea9dffe506d5bf8d38eb",
      quotedSpans: [
        { kind: "title", quote: "Aggravated murder", start: 18, end: 35 },
        { kind: "currentness", quote: "Effective: 2019-03-20", start: 37, end: 58 },
        {
          kind: "offense",
          quote: "(A) No person shall purposely, and with prior calculation and design, cause the death of another or the unlawful termination of another's pregnancy.",
          start: 59,
          end: 207,
        },
        {
          kind: "grading",
          quote: "(G) Whoever violates this section is guilty of aggravated murder, and shall be punished as provided in section 2929.02 of the Revised Code.",
          start: 1600,
          end: 1739,
        },
      ],
    },
    penalty: {
      section: "2929.02",
      subdivision: "(A)",
      citation: "Ohio Rev. Code Ann. § 2929.02(A)",
      title: "Murder penalties",
      sourceUrl: ohioCodeUrl("2929.02"),
      effectiveDateStart: "2021-04-12",
      retrievedAt,
      text: murderPenaltiesText,
      contentHash: "39f02e6be755c5468918b00b181496de70718f5ed267d7efb412038e6dbf04c7",
      quotedSpans: [
        { kind: "title", quote: "Murder penalties", start: 18, end: 34 },
        { kind: "currentness", quote: "Effective: 2021-04-12", start: 36, end: 57 },
        { kind: "penalty", quote: aggravatedPenaltyQuote, start: 58, end: 1105 },
      ],
    },
  },
  {
    chargeId: "oh-orc-2903-02-murder",
    canonicalTitle: "Murder",
    offense: {
      section: "2903.02",
      subdivision: null,
      citation: "Ohio Rev. Code Ann. § 2903.02",
      title: "Murder",
      sourceUrl: ohioCodeUrl("2903.02"),
      effectiveDateStart: "1998-06-30",
      retrievedAt,
      text: murderText,
      contentHash: "7d59b3044eafc9f0ce7a7621fdd1cece55e244ab9a2780daa6189ff17eb36f2b",
      quotedSpans: [
        { kind: "title", quote: "Murder", start: 18, end: 24 },
        { kind: "currentness", quote: "Effective: 1998-06-30", start: 26, end: 47 },
        {
          kind: "offense",
          quote: "(A) No person shall purposely cause the death of another or the unlawful termination of another's pregnancy.",
          start: 48,
          end: 156,
        },
        {
          kind: "offense",
          quote: "(B) No person shall cause the death of another as a proximate result of the offender's committing or attempting to commit an offense of violence that is a felony of the first or second degree and that is not a violation of section 2903.03 or 2903.04 of the Revised Code.",
          start: 157,
          end: 427,
        },
        {
          kind: "grading",
          quote: "(D) Whoever violates this section is guilty of murder, and shall be punished as provided in section 2929.02 of the Revised Code.",
          start: 639,
          end: 767,
        },
      ],
    },
    penalty: {
      section: "2929.02",
      subdivision: "(B)(1)",
      citation: "Ohio Rev. Code Ann. § 2929.02(B)(1)",
      title: "Murder penalties",
      sourceUrl: ohioCodeUrl("2929.02"),
      effectiveDateStart: "2021-04-12",
      retrievedAt,
      text: murderPenaltiesText,
      contentHash: "39f02e6be755c5468918b00b181496de70718f5ed267d7efb412038e6dbf04c7",
      quotedSpans: [
        { kind: "title", quote: "Murder penalties", start: 18, end: 34 },
        { kind: "currentness", quote: "Effective: 2021-04-12", start: 36, end: 57 },
        { kind: "penalty", quote: murderPenaltyQuote, start: 1106, end: 1356 },
      ],
    },
    penaltyFine: {
      section: "2929.02",
      subdivision: "(B)(4)",
      citation: "Ohio Rev. Code Ann. § 2929.02(B)(4)",
      title: "Murder penalties",
      sourceUrl: ohioCodeUrl("2929.02"),
      effectiveDateStart: "2021-04-12",
      retrievedAt,
      text: murderPenaltiesText,
      contentHash: "39f02e6be755c5468918b00b181496de70718f5ed267d7efb412038e6dbf04c7",
      quotedSpans: [
        { kind: "title", quote: "Murder penalties", start: 18, end: 34 },
        { kind: "currentness", quote: "Effective: 2021-04-12", start: 36, end: 57 },
        {
          kind: "penalty",
          quote: "(4) In addition, the offender may be fined an amount fixed by the court, but not more than fifteen thousand dollars.",
          start: 2619,
          end: 2735,
        },
      ],
    },
  },
  ...OHIO_CHAPTER_2903_ADDITIONAL_SOURCE_RECORDS,
  ...OHIO_MANSLAUGHTER_SOURCE_RECORDS,
  OHIO_AGGRAVATED_ASSAULT_SOURCE,
  OHIO_FELONIOUS_ASSAULT_SOURCE,
];

export function ohioChapter2903Evidence(source: OhioChapter2903PilotSourceRecord): {
  document: OhioChapter2903OfficialDocument; supportRole: OhioChapter2903SupportRole;
}[] {
  return [
    { document: source.offense, supportRole: "offense" },
    { document: source.penalty, supportRole: "penalty" },
    ...(source.penaltyFine ? [{ document: source.penaltyFine, supportRole: "penalty" as const }] : []),
    ...(source.additionalEvidence ?? []).map(document => ({ document, supportRole: "offense" as const })),
    ...(source.additionalPenalties ?? []).map(document => ({ document, supportRole: "penalty" as const })),
  ];
}

/**
 * An extraction rule is valid only for this exact stored official text. This
 * prevents an HTML/parser change or amended source from retaining stale
 * source-derived claims without a deliberate source-file update.
 */
export function validateOhioChapter2903Document(
  document: OhioChapter2903OfficialDocument,
): string | null {
  const actualHash = createHash("sha256").update(document.text).digest("hex");
  if (actualHash !== document.contentHash) {
    return `Content hash does not match the pinned official extraction for ${document.citation}`;
  }
  for (const span of document.quotedSpans) {
    if (
      document.text.slice(span.start, span.end) !== span.quote ||
      document.text.indexOf(span.quote) !== span.start
    ) {
      return `Quoted ${span.kind} span does not match the pinned official extraction for ${document.citation}`;
    }
  }
  return null;
}