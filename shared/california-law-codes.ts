/** Official code identity is part of a citation; section numbers alone are ambiguous. */
export const CALIFORNIA_LAW_CODE_LABELS = {
  PEN: "Cal. Penal Code", HSC: "Cal. Health & Safety Code", VEH: "Cal. Vehicle Code",
  BPC: "Cal. Business & Professions Code", RTC: "Cal. Revenue & Taxation Code",
  FAM: "Cal. Family Code", WIC: "Cal. Welfare & Institutions Code",
  HNC: "Cal. Harbors & Navigation Code", EDC: "Cal. Education Code", LAB: "Cal. Labor Code",
} as const;
export type CaliforniaLawCode = keyof typeof CALIFORNIA_LAW_CODE_LABELS;
export function californiaLawCode(value: string): CaliforniaLawCode {
  if (!Object.hasOwn(CALIFORNIA_LAW_CODE_LABELS, value)) throw new Error(`Unsupported California law code: ${value}`);
  return value as CaliforniaLawCode;
}
export function californiaPrimaryIdentity(lawCode: CaliforniaLawCode, code: string) {
  const section = code.match(/^\d+(?:\.\d+)*[a-z]*(?=\(|;|$)/)?.[0];
  if (!section) throw new Error("Unparseable California primary section");
  return { lawCode, key: `${lawCode}:${section}`, citation: `${CALIFORNIA_LAW_CODE_LABELS[lawCode]} § ${code}` };
}

/** Common charging-paper spellings supplement, rather than replace, archive codes. */
export function californiaCitationSearchAliases(lawCode: CaliforniaLawCode, code: string): string[] {
  const abbreviations: Partial<Record<CaliforniaLawCode, string>> = {
    PEN: "PC", VEH: "VC", HSC: "H&S", BPC: "B&P", HNC: "H&N",
  };
  return [...new Set([abbreviations[lawCode] ?? lawCode, lawCode,
    CALIFORNIA_LAW_CODE_LABELS[lawCode].replace(/^Cal\. /, "")])].map(label => `${label} ${code}`);
}
