import { GlossaryTerm } from "@shared/schema";

export const legalGlossaryTerms: GlossaryTerm[] = [
  {
    id: "arraignment",
    term: "Arraignment",
    definition: "A court proceeding where the defendant is formally informed of the charges against them and asked to enter a plea (guilty, not guilty, or no contest). This is typically the defendant's first appearance in court after being arrested.",
    aliases: ["Initial Appearance", "First Appearance"],
    tags: ["court", "procedure", "criminal"],
    slug: "arraignment",
    lastUpdated: new Date("2024-01-01"),
  },
  {
    id: "bail",
    term: "Bail",
    definition: "Money or property given to the court as security to ensure that a defendant will appear for trial. If the defendant appears as required, the bail is returned; if not, it is forfeited to the court.",
    aliases: ["Bond", "Bail Bond"],
    tags: ["money", "release", "court"],
    slug: "bail",
    lastUpdated: new Date("2024-01-01"),
  },
  {
    id: "bench-warrant",
    term: "Bench Warrant",
    definition: "A court order issued by a judge directing law enforcement to arrest a person who has failed to appear in court as required or violated a court order.",
    aliases: ["Arrest Warrant", "Capias"],
    tags: ["warrant", "court", "arrest"],
    slug: "bench-warrant",
    lastUpdated: new Date("2024-01-01"),
  },
  {
    id: "burden-of-proof",
    term: "Burden of Proof",
    definition: "The obligation to prove one's assertion or allegation. In criminal cases, the prosecution has the burden to prove the defendant's guilt 'beyond a reasonable doubt.'",
    aliases: ["Standard of Proof"],
    tags: ["evidence", "proof", "trial"],
    slug: "burden-of-proof",
    lastUpdated: new Date("2024-01-01"),
  },
  {
    id: "continuance",
    term: "Continuance",
    definition: "A postponement or adjournment of a court hearing or trial to a later date. Either party can request a continuance, but the judge must approve it.",
    aliases: ["Postponement", "Adjournment"],
    tags: ["court", "scheduling", "delay"],
    slug: "continuance",
    lastUpdated: new Date("2024-01-01"),
  },
  {
    id: "defendant",
    term: "Defendant",
    definition: "The person accused of committing a crime in a criminal case. The defendant has the right to legal representation and is presumed innocent until proven guilty.",
    aliases: ["Accused", "Respondent"],
    tags: ["person", "criminal", "rights"],
    slug: "defendant",
    lastUpdated: new Date("2024-01-01"),
  },
  {
    id: "discovery",
    term: "Discovery",
    definition: "The pre-trial process where both the prosecution and defense exchange evidence, witness lists, and other information relevant to the case.",
    aliases: ["Evidence Exchange"],
    tags: ["evidence", "pre-trial", "procedure"],
    slug: "discovery",
    lastUpdated: new Date("2024-01-01"),
  },
  {
    id: "expungement",
    term: "Expungement",
    definition: "The legal process of sealing or destroying criminal records so they are not accessible in background checks. Eligibility varies by state and type of offense.",
    aliases: ["Record Sealing", "Record Clearing"],
    tags: ["records", "relief", "background"],
    slug: "expungement",
    lastUpdated: new Date("2024-01-01"),
  },
  {
    id: "felony",
    term: "Felony",
    definition: "A serious crime typically punishable by imprisonment for more than one year or by death. Examples include murder, rape, burglary, and drug trafficking.",
    aliases: ["Serious Crime"],
    tags: ["crime", "classification", "penalty"],
    slug: "felony",
    lastUpdated: new Date("2024-01-01"),
  },
  {
    id: "grand-jury",
    term: "Grand Jury",
    definition: "A group of 16-23 citizens who determine whether there is probable cause to believe a person committed a crime and should be formally charged (indicted).",
    aliases: ["Indicting Jury"],
    tags: ["jury", "indictment", "charging"],
    slug: "grand-jury",
    lastUpdated: new Date("2024-01-01"),
  },
  {
    id: "habeas-corpus",
    term: "Habeas Corpus",
    definition: "A legal action that requires a person under arrest to be brought before a judge to determine if the person's imprisonment or detention is lawful.",
    aliases: ["Writ of Habeas Corpus"],
    tags: ["detention", "rights", "legal-action"],
    slug: "habeas-corpus",
    lastUpdated: new Date("2024-01-01"),
  },
  {
    id: "indictment",
    term: "Indictment",
    definition: "A formal charge or accusation of a serious crime issued by a grand jury, stating there is enough evidence that the defendant committed the crime to justify having a trial.",
    aliases: ["Formal Charge", "True Bill"],
    tags: ["charge", "grand-jury", "formal"],
    slug: "indictment",
    lastUpdated: new Date("2024-01-01"),
  },
  {
    id: "jurisdiction",
    term: "Jurisdiction",
    definition: "The legal authority of a court to hear and decide a case. This can be limited by geography, subject matter, or the amount of money involved.",
    aliases: ["Court Authority"],
    tags: ["court", "authority", "geography"],
    slug: "jurisdiction",
    lastUpdated: new Date("2024-01-01"),
  },
  {
    id: "miranda-rights",
    term: "Miranda Rights",
    definition: "Rights that police must read to suspects before custodial interrogation, including the right to remain silent and the right to an attorney.",
    aliases: ["Miranda Warning", "Your Rights"],
    tags: ["rights", "police", "interrogation"],
    slug: "miranda-rights",
    lastUpdated: new Date("2024-01-01"),
  },
  {
    id: "misdemeanor",
    term: "Misdemeanor",
    definition: "A less serious crime typically punishable by fines, community service, probation, or imprisonment for less than one year in a local jail.",
    aliases: ["Minor Crime"],
    tags: ["crime", "classification", "penalty"],
    slug: "misdemeanor",
    lastUpdated: new Date("2024-01-01"),
  },
  {
    id: "no-contest",
    term: "No Contest (Nolo Contendere)",
    definition: "A plea where the defendant neither admits nor denies guilt but accepts punishment. It has the same legal effect as a guilty plea but cannot be used against the defendant in civil proceedings.",
    aliases: ["Nolo Contendere", "No Lo"],
    tags: ["plea", "court", "civil"],
    slug: "no-contest",
    lastUpdated: new Date("2024-01-01"),
  },
  {
    id: "parole",
    term: "Parole",
    definition: "The supervised early release of a prisoner before completion of their full sentence, subject to certain conditions and regular check-ins with a parole officer.",
    aliases: ["Early Release", "Supervised Release"],
    tags: ["release", "supervision", "conditions"],
    slug: "parole",
    lastUpdated: new Date("2024-01-01"),
  },
  {
    id: "plea-bargain",
    term: "Plea Bargain",
    definition: "An agreement between the prosecution and defense where the defendant pleads guilty or no contest to a reduced charge or receives a lighter sentence in exchange for avoiding trial.",
    aliases: ["Plea Deal", "Plea Agreement"],
    tags: ["agreement", "plea", "negotiation"],
    slug: "plea-bargain",
    lastUpdated: new Date("2024-01-01"),
  },
  {
    id: "probable-cause",
    term: "Probable Cause",
    definition: "A reasonable belief that a crime has been committed and that a specific person committed it. Required for arrests, searches, and warrants.",
    aliases: ["Reasonable Belief"],
    tags: ["evidence", "arrest", "search"],
    slug: "probable-cause",
    lastUpdated: new Date("2024-01-01"),
  },
  {
    id: "probation",
    term: "Probation",
    definition: "A court-ordered supervision period served in the community instead of prison, with specific conditions such as regular check-ins, community service, or counseling.",
    aliases: ["Community Supervision"],
    tags: ["supervision", "alternative", "conditions"],
    slug: "probation",
    lastUpdated: new Date("2024-01-01"),
  },
  {
    id: "public-defender",
    term: "Public Defender",
    definition: "A lawyer provided by the government at no cost to represent defendants who cannot afford to hire their own attorney. Guaranteed by the Sixth Amendment.",
    aliases: ["Court-Appointed Attorney", "Appointed Counsel"],
    tags: ["attorney", "free", "representation"],
    slug: "public-defender",
    lastUpdated: new Date("2024-01-01"),
  },
  {
    id: "reasonable-doubt",
    term: "Reasonable Doubt",
    definition: "The standard of evidence required to validate a criminal conviction. It means the evidence must be so convincing that a reasonable person would not hesitate to rely on it in making important decisions.",
    aliases: ["Beyond Reasonable Doubt"],
    tags: ["evidence", "standard", "conviction"],
    slug: "reasonable-doubt",
    lastUpdated: new Date("2024-01-01"),
  },
  {
    id: "recidivism",
    term: "Recidivism",
    definition: "The tendency of a convicted criminal to reoffend. Often measured as the percentage of former prisoners who are rearrested within a certain period.",
    aliases: ["Repeat Offense", "Reoffending"],
    tags: ["statistics", "repeat", "crime"],
    slug: "recidivism",
    lastUpdated: new Date("2024-01-01"),
  },
  {
    id: "restitution",
    term: "Restitution",
    definition: "Payment made by a defendant to compensate victims for losses caused by the crime, such as medical bills, property damage, or lost wages.",
    aliases: ["Victim Compensation"],
    tags: ["payment", "victim", "compensation"],
    slug: "restitution",
    lastUpdated: new Date("2024-01-01"),
  },
  {
    id: "search-warrant",
    term: "Search Warrant",
    definition: "A court order authorizing law enforcement to search a specific location for evidence of a crime. Requires probable cause and must describe the place to be searched and items sought.",
    aliases: ["Warrant"],
    tags: ["search", "warrant", "evidence"],
    slug: "search-warrant",
    lastUpdated: new Date("2024-01-01"),
  },
  {
    id: "statute-of-limitations",
    term: "Statute of Limitations",
    definition: "The time limit within which criminal charges must be filed. Varies by jurisdiction and type of crime, with serious crimes like murder often having no time limit.",
    aliases: ["Time Limit"],
    tags: ["time", "filing", "deadline"],
    slug: "statute-of-limitations",
    lastUpdated: new Date("2024-01-01"),
  },
  {
    id: "subpoena",
    term: "Subpoena",
    definition: "A legal document commanding a person to appear in court or produce documents. Failure to comply can result in contempt of court charges.",
    aliases: ["Court Summons"],
    tags: ["court", "witness", "documents"],
    slug: "subpoena",
    lastUpdated: new Date("2024-01-01"),
  },
  {
    id: "suspended-sentence",
    term: "Suspended Sentence",
    definition: "A penalty that is imposed but not immediately enforced, often combined with probation. If the defendant violates conditions, they may have to serve the original sentence.",
    aliases: ["Deferred Sentence"],
    tags: ["sentence", "conditions", "probation"],
    slug: "suspended-sentence",
    lastUpdated: new Date("2024-01-01"),
  },
  {
    id: "venue",
    term: "Venue",
    definition: "The specific geographic location where a case is tried. Generally, criminal cases are tried in the county where the alleged crime occurred.",
    aliases: ["Trial Location"],
    tags: ["location", "trial", "geography"],
    slug: "venue",
    lastUpdated: new Date("2024-01-01"),
  },
  {
    id: "voir-dire",
    term: "Voir Dire",
    definition: "The process of selecting a jury by questioning potential jurors about their backgrounds, opinions, and potential biases to ensure a fair and impartial jury.",
    aliases: ["Jury Selection"],
    tags: ["jury", "selection", "bias"],
    slug: "voir-dire",
    lastUpdated: new Date("2024-01-01"),
  }
];

// Helper function to search glossary terms
export function searchGlossaryTerms(query: string): GlossaryTerm[] {
  if (!query.trim()) return legalGlossaryTerms;
  
  const lowercaseQuery = query.toLowerCase();
  
  return legalGlossaryTerms.filter(term => 
    term.term.toLowerCase().includes(lowercaseQuery) ||
    term.definition.toLowerCase().includes(lowercaseQuery) ||
    term.aliases?.some(alias => alias.toLowerCase().includes(lowercaseQuery)) ||
    term.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}

// Helper function to get terms by letter
export function getTermsByLetter(letter: string): GlossaryTerm[] {
  return legalGlossaryTerms.filter(term => 
    term.term.charAt(0).toLowerCase() === letter.toLowerCase()
  );
}

// Helper function to get all available first letters
export function getAvailableLetters(): string[] {
  const letters = new Set(legalGlossaryTerms.map(term => term.term.charAt(0).toLowerCase()));
  return Array.from(letters).sort();
}