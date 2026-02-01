/**
 * Court Formatting Rules
 *
 * Centralized, rules-driven formatting configuration for legal documents.
 * Each court system has specific formatting requirements defined here,
 * replacing hardcoded branching logic in the DOCX generator.
 *
 * Rule sources:
 * - California Rules of Court (CRC) 2.104-2.111
 * - Central District of California Local Rules (L.R.) 11-3
 */

// ============================================================================
// Types
// ============================================================================

export type CourtType = "state" | "federal" | "immigration";

export interface CourtIdentifier {
  jurisdiction: string;
  courtType: CourtType;
  district?: string;
}

export interface CourtFormattingRules {
  // Page layout (twips: 1440 = 1 inch)
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;

  // Typography
  fontFamily: string;
  fontSize: number; // half-points (24 = 12pt, 28 = 14pt)
  fontColor: string; // hex color without #
  lineSpacing: number; // twips (480 = double spacing)

  // Line numbering
  includeLineNumbers: boolean;
  lineNumberRestart: "newPage" | "continuous";

  // Caption / header
  courtTitle: string;
  courtSubtitle?: string;
  plaintiffLabel: string;
  includeCountyLine: boolean;
  includeAttorneyHeader: boolean;
  includeSeparatorLine: boolean;

  // Footer
  footer: {
    includePageNumber: boolean;
    includeDocumentTitle: boolean;
    documentTitleFontSize: number; // half-points
    includeSeparatorLine: boolean;
  };

  // Proof of service
  proofOfServicePreamble: string;

  // Immigration court caption style
  captionStyle?: "adversarial" | "in-matter-of";
  respondentLabel?: string;
  identifierLabel?: string;
  proceedingLabel?: string;

  // Metadata
  ruleSource: string;
  rulesCited: string[];
}

// ============================================================================
// Rule Sets
// ============================================================================

/**
 * Default rules for unknown/generic courts.
 * 1" margins, 12pt TNR, double-spaced, no line numbers.
 */
export const DEFAULT_RULES: CourtFormattingRules = {
  marginTop: 1440,
  marginBottom: 1440,
  marginLeft: 1440,
  marginRight: 1440,

  fontFamily: "Times New Roman",
  fontSize: 24, // 12pt
  fontColor: "000000",
  lineSpacing: 480,

  includeLineNumbers: false,
  lineNumberRestart: "newPage",

  courtTitle: "SUPERIOR COURT",
  plaintiffLabel: "THE PEOPLE OF THE STATE,",
  includeCountyLine: false,
  includeAttorneyHeader: false,
  includeSeparatorLine: false,

  footer: {
    includePageNumber: true,
    includeDocumentTitle: false,
    documentTitleFontSize: 20,
    includeSeparatorLine: false,
  },

  proofOfServicePreamble:
    "I, the undersigned, declare that I am over the age of eighteen years and not a party to this action.",

  ruleSource: "General practice",
  rulesCited: [],
};

/**
 * California state court rules (CRC).
 * - 12pt, TNR, black font color (CRC 2.106)
 * - 1.25" left margin, 0.5" right/bottom (CRC 2.107)
 * - Line numbers, restart per page (CRC 2.108)
 * - Footer with document title >= 10pt + separator line (CRC 2.110)
 * - Attorney header lines 1-7 (CRC 2.111)
 */
export const CA_STATE_RULES: CourtFormattingRules = {
  marginTop: 1440, // 1 inch
  marginBottom: 720, // 0.5 inch
  marginLeft: 1800, // 1.25 inch (extra for line numbers)
  marginRight: 720, // 0.5 inch per CRC 2.107

  fontFamily: "Times New Roman",
  fontSize: 24, // 12pt (CRC 2.104)
  fontColor: "000000", // black (CRC 2.106)
  lineSpacing: 480, // double spacing (CRC 2.108)

  includeLineNumbers: true,
  lineNumberRestart: "newPage", // CRC 2.108

  courtTitle: "SUPERIOR COURT OF CALIFORNIA",
  courtSubtitle: "COUNTY OF _______________",
  plaintiffLabel: "THE PEOPLE OF THE STATE OF CALIFORNIA,",
  includeCountyLine: true,
  includeAttorneyHeader: true, // CRC 2.111
  includeSeparatorLine: true,

  footer: {
    includePageNumber: true,
    includeDocumentTitle: true, // CRC 2.110
    documentTitleFontSize: 20, // 10pt minimum per CRC 2.110
    includeSeparatorLine: true, // CRC 2.110
  },

  proofOfServicePreamble:
    "I, the undersigned, declare that I am over the age of eighteen years and not a party to this action. I am employed in the County of ____________, State of California.",

  ruleSource: "California Rules of Court",
  rulesCited: [
    "CRC 2.104",
    "CRC 2.105",
    "CRC 2.106",
    "CRC 2.107",
    "CRC 2.108",
    "CRC 2.110",
    "CRC 2.111",
  ],
};

/**
 * Central District of California federal court rules (L.R.).
 * - 14pt font (L.R. 11-3.1.1)
 * - 1" margins all sides
 * - No line numbers
 * - Double-spaced (L.R. 11-3.6)
 * - Pages numbered at bottom (L.R. 11-3.3)
 * - Attorney header lines 1-7, court title on/below line 8 (L.R. 11-3.8)
 */
export const CACD_RULES: CourtFormattingRules = {
  marginTop: 1440,
  marginBottom: 1440,
  marginLeft: 1440,
  marginRight: 1440,

  fontFamily: "Times New Roman",
  fontSize: 28, // 14pt (L.R. 11-3.1.1)
  fontColor: "000000",
  lineSpacing: 480, // double spacing (L.R. 11-3.6)

  includeLineNumbers: false,
  lineNumberRestart: "newPage",

  courtTitle: "UNITED STATES DISTRICT COURT",
  courtSubtitle: "CENTRAL DISTRICT OF CALIFORNIA",
  plaintiffLabel: "UNITED STATES OF AMERICA,",
  includeCountyLine: false,
  includeAttorneyHeader: true, // L.R. 11-3.8
  includeSeparatorLine: true,

  footer: {
    includePageNumber: true, // L.R. 11-3.3
    includeDocumentTitle: false,
    documentTitleFontSize: 20,
    includeSeparatorLine: false,
  },

  proofOfServicePreamble:
    "I, the undersigned, declare that I am over the age of eighteen years and not a party to this action.",

  ruleSource: "Central District of California Local Rules",
  rulesCited: [
    "L.R. 11-3.1.1",
    "L.R. 11-3.3",
    "L.R. 11-3.6",
    "L.R. 11-3.8",
  ],
};

/**
 * Northern District of California federal court rules.
 * Similar to CACD but with distinct local rules (N.D. Cal. Civ. L.R.).
 * - 14pt font
 * - 1" margins all sides
 * - Double-spaced
 * - No line numbers
 */
export const NDCA_RULES: CourtFormattingRules = {
  marginTop: 1440,
  marginBottom: 1440,
  marginLeft: 1440,
  marginRight: 1440,

  fontFamily: "Times New Roman",
  fontSize: 28, // 14pt
  fontColor: "000000",
  lineSpacing: 480,

  includeLineNumbers: false,
  lineNumberRestart: "newPage",

  courtTitle: "UNITED STATES DISTRICT COURT",
  courtSubtitle: "NORTHERN DISTRICT OF CALIFORNIA",
  plaintiffLabel: "UNITED STATES OF AMERICA,",
  includeCountyLine: false,
  includeAttorneyHeader: true,
  includeSeparatorLine: true,

  footer: {
    includePageNumber: true,
    includeDocumentTitle: false,
    documentTitleFontSize: 20,
    includeSeparatorLine: false,
  },

  proofOfServicePreamble:
    "I, the undersigned, declare that I am over the age of eighteen years and not a party to this action.",

  ruleSource: "Northern District of California Local Rules",
  rulesCited: [
    "N.D. Cal. Civ. L.R. 3-4",
    "N.D. Cal. Crim. L.R. 47-2",
  ],
};

/**
 * Eastern District of California federal court rules.
 * - 12pt font (E.D. Cal. L.R. 130(b))
 * - 1" margins all sides
 * - Double-spaced
 * - No line numbers
 */
export const EDCA_RULES: CourtFormattingRules = {
  marginTop: 1440,
  marginBottom: 1440,
  marginLeft: 1440,
  marginRight: 1440,

  fontFamily: "Times New Roman",
  fontSize: 24, // 12pt (E.D. Cal. L.R. 130(b))
  fontColor: "000000",
  lineSpacing: 480,

  includeLineNumbers: false,
  lineNumberRestart: "newPage",

  courtTitle: "UNITED STATES DISTRICT COURT",
  courtSubtitle: "EASTERN DISTRICT OF CALIFORNIA",
  plaintiffLabel: "UNITED STATES OF AMERICA,",
  includeCountyLine: false,
  includeAttorneyHeader: true,
  includeSeparatorLine: true,

  footer: {
    includePageNumber: true,
    includeDocumentTitle: false,
    documentTitleFontSize: 20,
    includeSeparatorLine: false,
  },

  proofOfServicePreamble:
    "I, the undersigned, declare that I am over the age of eighteen years and not a party to this action.",

  ruleSource: "Eastern District of California Local Rules",
  rulesCited: [
    "E.D. Cal. L.R. 130(b)",
    "E.D. Cal. L.R. 144",
  ],
};

/**
 * Southern District of California federal court rules.
 * - 14pt font (S.D. Cal. CivLR 5.1)
 * - 1" margins all sides
 * - Double-spaced
 * - No line numbers
 */
export const SDCA_RULES: CourtFormattingRules = {
  marginTop: 1440,
  marginBottom: 1440,
  marginLeft: 1440,
  marginRight: 1440,

  fontFamily: "Times New Roman",
  fontSize: 28, // 14pt
  fontColor: "000000",
  lineSpacing: 480,

  includeLineNumbers: false,
  lineNumberRestart: "newPage",

  courtTitle: "UNITED STATES DISTRICT COURT",
  courtSubtitle: "SOUTHERN DISTRICT OF CALIFORNIA",
  plaintiffLabel: "UNITED STATES OF AMERICA,",
  includeCountyLine: false,
  includeAttorneyHeader: true,
  includeSeparatorLine: true,

  footer: {
    includePageNumber: true,
    includeDocumentTitle: false,
    documentTitleFontSize: 20,
    includeSeparatorLine: false,
  },

  proofOfServicePreamble:
    "I, the undersigned, declare that I am over the age of eighteen years and not a party to this action.",

  ruleSource: "Southern District of California Local Rules",
  rulesCited: [
    "S.D. Cal. CivLR 5.1",
    "S.D. Cal. CrimLR 47.1",
  ],
};

// ============================================================================
// New York Rules
// ============================================================================

/**
 * New York state court rules (22 NYCRR).
 * - 12pt font (22 NYCRR § 202.5(a))
 * - 1" margins all sides
 * - Double-spaced
 * - No line numbers
 * - Court title: "SUPREME COURT OF THE STATE OF NEW YORK" for criminal/felony
 * - County line below court title
 * - No attorney header block (unlike CA)
 */
export const NY_STATE_RULES: CourtFormattingRules = {
  marginTop: 1440,
  marginBottom: 1440,
  marginLeft: 1440,
  marginRight: 1440,

  fontFamily: "Times New Roman",
  fontSize: 24, // 12pt
  fontColor: "000000",
  lineSpacing: 480,

  includeLineNumbers: false,
  lineNumberRestart: "newPage",

  courtTitle: "SUPREME COURT OF THE STATE OF NEW YORK",
  courtSubtitle: "COUNTY OF _______________",
  plaintiffLabel: "THE PEOPLE OF THE STATE OF NEW YORK,",
  includeCountyLine: true,
  includeAttorneyHeader: false,
  includeSeparatorLine: true,

  footer: {
    includePageNumber: true,
    includeDocumentTitle: false,
    documentTitleFontSize: 20,
    includeSeparatorLine: false,
  },

  proofOfServicePreamble:
    "I, the undersigned, declare that I am over the age of eighteen years and not a party to this action.",

  ruleSource: "New York Uniform Rules for Trial Courts (22 NYCRR)",
  rulesCited: [
    "22 NYCRR § 202.5(a)",
    "22 NYCRR § 202.7",
  ],
};

/**
 * Southern District of New York federal court rules.
 * - 12pt font (SDNY Local Civil Rule 11.1)
 * - 1" margins all sides
 * - Double-spaced
 * - Pages numbered at bottom
 */
export const SDNY_RULES: CourtFormattingRules = {
  marginTop: 1440,
  marginBottom: 1440,
  marginLeft: 1440,
  marginRight: 1440,

  fontFamily: "Times New Roman",
  fontSize: 24, // 12pt (Local Civil Rule 11.1)
  fontColor: "000000",
  lineSpacing: 480,

  includeLineNumbers: false,
  lineNumberRestart: "newPage",

  courtTitle: "UNITED STATES DISTRICT COURT",
  courtSubtitle: "SOUTHERN DISTRICT OF NEW YORK",
  plaintiffLabel: "UNITED STATES OF AMERICA,",
  includeCountyLine: false,
  includeAttorneyHeader: true,
  includeSeparatorLine: true,

  footer: {
    includePageNumber: true,
    includeDocumentTitle: false,
    documentTitleFontSize: 20,
    includeSeparatorLine: false,
  },

  proofOfServicePreamble:
    "I, the undersigned, declare that I am over the age of eighteen years and not a party to this action.",

  ruleSource: "Southern District of New York Local Rules",
  rulesCited: [
    "SDNY Local Civil Rule 11.1",
    "SDNY Local Criminal Rule 16.1",
  ],
};

/**
 * Eastern District of New York federal court rules.
 * - 12pt font
 * - 1" margins all sides
 * - Double-spaced
 */
export const EDNY_RULES: CourtFormattingRules = {
  marginTop: 1440,
  marginBottom: 1440,
  marginLeft: 1440,
  marginRight: 1440,

  fontFamily: "Times New Roman",
  fontSize: 24, // 12pt
  fontColor: "000000",
  lineSpacing: 480,

  includeLineNumbers: false,
  lineNumberRestart: "newPage",

  courtTitle: "UNITED STATES DISTRICT COURT",
  courtSubtitle: "EASTERN DISTRICT OF NEW YORK",
  plaintiffLabel: "UNITED STATES OF AMERICA,",
  includeCountyLine: false,
  includeAttorneyHeader: true,
  includeSeparatorLine: true,

  footer: {
    includePageNumber: true,
    includeDocumentTitle: false,
    documentTitleFontSize: 20,
    includeSeparatorLine: false,
  },

  proofOfServicePreamble:
    "I, the undersigned, declare that I am over the age of eighteen years and not a party to this action.",

  ruleSource: "Eastern District of New York Local Rules",
  rulesCited: [
    "EDNY Local Civil Rule 11.1",
    "EDNY Local Criminal Rule 16.1",
  ],
};

/**
 * Northern District of New York federal court rules.
 * - 12pt font (N.D.N.Y. Local Rule 10.1)
 * - 1" margins all sides
 * - Double-spaced
 */
export const NDNY_RULES: CourtFormattingRules = {
  marginTop: 1440,
  marginBottom: 1440,
  marginLeft: 1440,
  marginRight: 1440,

  fontFamily: "Times New Roman",
  fontSize: 24, // 12pt (Local Rule 10.1)
  fontColor: "000000",
  lineSpacing: 480,

  includeLineNumbers: false,
  lineNumberRestart: "newPage",

  courtTitle: "UNITED STATES DISTRICT COURT",
  courtSubtitle: "NORTHERN DISTRICT OF NEW YORK",
  plaintiffLabel: "UNITED STATES OF AMERICA,",
  includeCountyLine: false,
  includeAttorneyHeader: true,
  includeSeparatorLine: true,

  footer: {
    includePageNumber: true,
    includeDocumentTitle: false,
    documentTitleFontSize: 20,
    includeSeparatorLine: false,
  },

  proofOfServicePreamble:
    "I, the undersigned, declare that I am over the age of eighteen years and not a party to this action.",

  ruleSource: "Northern District of New York Local Rules",
  rulesCited: [
    "N.D.N.Y. Local Rule 10.1",
  ],
};

/**
 * Western District of New York federal court rules.
 * - 12pt font
 * - 1" margins all sides
 * - Double-spaced
 */
export const WDNY_RULES: CourtFormattingRules = {
  marginTop: 1440,
  marginBottom: 1440,
  marginLeft: 1440,
  marginRight: 1440,

  fontFamily: "Times New Roman",
  fontSize: 24, // 12pt
  fontColor: "000000",
  lineSpacing: 480,

  includeLineNumbers: false,
  lineNumberRestart: "newPage",

  courtTitle: "UNITED STATES DISTRICT COURT",
  courtSubtitle: "WESTERN DISTRICT OF NEW YORK",
  plaintiffLabel: "UNITED STATES OF AMERICA,",
  includeCountyLine: false,
  includeAttorneyHeader: true,
  includeSeparatorLine: true,

  footer: {
    includePageNumber: true,
    includeDocumentTitle: false,
    documentTitleFontSize: 20,
    includeSeparatorLine: false,
  },

  proofOfServicePreamble:
    "I, the undersigned, declare that I am over the age of eighteen years and not a party to this action.",

  ruleSource: "Western District of New York Local Rules",
  rulesCited: [
    "W.D.N.Y. Local Rule 10(a)",
  ],
};

// ============================================================================
// Texas Rules
// ============================================================================

/**
 * Texas state court rules (TX Supreme Court Order 13-9165).
 * - 14pt font minimum for computer-generated documents
 * - 1" margins all sides
 * - Double-spaced
 * - No line numbers (unlike California)
 * - No attorney header block (unlike California)
 * - Court title: "IN THE DISTRICT COURT" with judicial district subtitle
 * - County line below court title
 * - Page numbers at bottom right, Arabic numerals
 */
export const TX_STATE_RULES: CourtFormattingRules = {
  marginTop: 1440,
  marginBottom: 1440,
  marginLeft: 1440,
  marginRight: 1440,

  fontFamily: "Times New Roman",
  fontSize: 28, // 14pt (TX Supreme Court Order 13-9165)
  fontColor: "000000",
  lineSpacing: 480, // double spacing

  includeLineNumbers: false,
  lineNumberRestart: "newPage",

  courtTitle: "IN THE DISTRICT COURT",
  courtSubtitle: "_____ JUDICIAL DISTRICT",
  plaintiffLabel: "THE STATE OF TEXAS,",
  includeCountyLine: true,
  includeAttorneyHeader: false,
  includeSeparatorLine: true,

  footer: {
    includePageNumber: true,
    includeDocumentTitle: false,
    documentTitleFontSize: 20,
    includeSeparatorLine: false,
  },

  proofOfServicePreamble:
    "STATE OF TEXAS, COUNTY OF ____________________",

  ruleSource: "Texas Rules of Civil Procedure / TX Supreme Court Order 13-9165",
  rulesCited: [
    "Tex. R. Civ. P. 45",
    "Tex. R. App. P. 9.4",
  ],
};

/**
 * Northern District of Texas federal court rules (Dallas).
 * - 12pt font (TXND L.R. 5.1)
 * - 1" margins all sides
 * - Double-spaced
 * - CM/ECF required
 */
export const TXND_RULES: CourtFormattingRules = {
  marginTop: 1440,
  marginBottom: 1440,
  marginLeft: 1440,
  marginRight: 1440,

  fontFamily: "Times New Roman",
  fontSize: 24, // 12pt
  fontColor: "000000",
  lineSpacing: 480,

  includeLineNumbers: false,
  lineNumberRestart: "newPage",

  courtTitle: "UNITED STATES DISTRICT COURT",
  courtSubtitle: "NORTHERN DISTRICT OF TEXAS",
  plaintiffLabel: "UNITED STATES OF AMERICA,",
  includeCountyLine: false,
  includeAttorneyHeader: false,
  includeSeparatorLine: true,

  footer: {
    includePageNumber: true,
    includeDocumentTitle: false,
    documentTitleFontSize: 20,
    includeSeparatorLine: false,
  },

  proofOfServicePreamble:
    "I, the undersigned, declare that I am over the age of eighteen years and not a party to this action.",

  ruleSource: "Northern District of Texas Local Rules",
  rulesCited: [
    "TXND L.R. 5.1",
  ],
};

/**
 * Southern District of Texas federal court rules (Houston).
 * - 12pt font (TXSD L.R. 5)
 * - 1" margins all sides
 * - Double-spaced
 * - CM/ECF required
 */
export const TXSD_RULES: CourtFormattingRules = {
  marginTop: 1440,
  marginBottom: 1440,
  marginLeft: 1440,
  marginRight: 1440,

  fontFamily: "Times New Roman",
  fontSize: 24, // 12pt
  fontColor: "000000",
  lineSpacing: 480,

  includeLineNumbers: false,
  lineNumberRestart: "newPage",

  courtTitle: "UNITED STATES DISTRICT COURT",
  courtSubtitle: "SOUTHERN DISTRICT OF TEXAS",
  plaintiffLabel: "UNITED STATES OF AMERICA,",
  includeCountyLine: false,
  includeAttorneyHeader: false,
  includeSeparatorLine: true,

  footer: {
    includePageNumber: true,
    includeDocumentTitle: false,
    documentTitleFontSize: 20,
    includeSeparatorLine: false,
  },

  proofOfServicePreamble:
    "I, the undersigned, declare that I am over the age of eighteen years and not a party to this action.",

  ruleSource: "Southern District of Texas Local Rules",
  rulesCited: [
    "TXSD L.R. 5",
  ],
};

/**
 * Eastern District of Texas federal court rules (Tyler).
 * - 12pt font (TXED L.R. CV-10)
 * - 1" margins all sides
 * - Double-spaced
 * - CM/ECF required
 */
export const TXED_RULES: CourtFormattingRules = {
  marginTop: 1440,
  marginBottom: 1440,
  marginLeft: 1440,
  marginRight: 1440,

  fontFamily: "Times New Roman",
  fontSize: 24, // 12pt
  fontColor: "000000",
  lineSpacing: 480,

  includeLineNumbers: false,
  lineNumberRestart: "newPage",

  courtTitle: "UNITED STATES DISTRICT COURT",
  courtSubtitle: "EASTERN DISTRICT OF TEXAS",
  plaintiffLabel: "UNITED STATES OF AMERICA,",
  includeCountyLine: false,
  includeAttorneyHeader: false,
  includeSeparatorLine: true,

  footer: {
    includePageNumber: true,
    includeDocumentTitle: false,
    documentTitleFontSize: 20,
    includeSeparatorLine: false,
  },

  proofOfServicePreamble:
    "I, the undersigned, declare that I am over the age of eighteen years and not a party to this action.",

  ruleSource: "Eastern District of Texas Local Rules",
  rulesCited: [
    "TXED L.R. CV-10",
  ],
};

/**
 * Western District of Texas federal court rules (San Antonio/Austin).
 * - 12pt font (TXWD L.R. CV-10)
 * - 1" margins all sides
 * - Double-spaced
 * - CM/ECF required
 */
export const TXWD_RULES: CourtFormattingRules = {
  marginTop: 1440,
  marginBottom: 1440,
  marginLeft: 1440,
  marginRight: 1440,

  fontFamily: "Times New Roman",
  fontSize: 24, // 12pt
  fontColor: "000000",
  lineSpacing: 480,

  includeLineNumbers: false,
  lineNumberRestart: "newPage",

  courtTitle: "UNITED STATES DISTRICT COURT",
  courtSubtitle: "WESTERN DISTRICT OF TEXAS",
  plaintiffLabel: "UNITED STATES OF AMERICA,",
  includeCountyLine: false,
  includeAttorneyHeader: false,
  includeSeparatorLine: true,

  footer: {
    includePageNumber: true,
    includeDocumentTitle: false,
    documentTitleFontSize: 20,
    includeSeparatorLine: false,
  },

  proofOfServicePreamble:
    "I, the undersigned, declare that I am over the age of eighteen years and not a party to this action.",

  ruleSource: "Western District of Texas Local Rules",
  rulesCited: [
    "TXWD L.R. CV-10",
  ],
};

// ============================================================================
// Florida Rules
// ============================================================================

/**
 * Florida state court rules (Fla. R. Jud. Admin. 2.520).
 * - 12pt font (standard practice for e-filed documents)
 * - 1" margins all sides
 * - Double-spaced
 * - No line numbers
 * - No attorney header block
 * - Court title: "IN THE CIRCUIT COURT" with judicial circuit and county
 * - County subtitle: "IN AND FOR _____ COUNTY, FLORIDA"
 * - Page numbers required
 * - E-filing mandatory via Florida Courts E-Filing Portal
 */
export const FL_STATE_RULES: CourtFormattingRules = {
  marginTop: 1440,
  marginBottom: 1440,
  marginLeft: 1440,
  marginRight: 1440,

  fontFamily: "Times New Roman",
  fontSize: 24, // 12pt (Fla. R. Jud. Admin. 2.520)
  fontColor: "000000",
  lineSpacing: 480, // double spacing

  includeLineNumbers: false,
  lineNumberRestart: "newPage",

  courtTitle: "IN THE CIRCUIT COURT",
  courtSubtitle: "IN AND FOR _____ COUNTY, FLORIDA",
  plaintiffLabel: "STATE OF FLORIDA,",
  includeCountyLine: true,
  includeAttorneyHeader: false,
  includeSeparatorLine: true,

  footer: {
    includePageNumber: true,
    includeDocumentTitle: false,
    documentTitleFontSize: 20,
    includeSeparatorLine: false,
  },

  proofOfServicePreamble:
    "STATE OF FLORIDA, COUNTY OF ____________________",

  ruleSource: "Florida Rules of Judicial Administration",
  rulesCited: [
    "Fla. R. Jud. Admin. 2.520",
    "Fla. R. Jud. Admin. 2.545",
    "Fla. R. Crim. P. 3.190",
  ],
};

/**
 * Southern District of Florida federal court rules (Miami).
 * - 12pt font (FLSD L.R. 5.1)
 * - 1" margins all sides
 * - Double-spaced
 * - CM/ECF required
 * - Eleventh Circuit precedent
 */
export const FLSD_RULES: CourtFormattingRules = {
  marginTop: 1440,
  marginBottom: 1440,
  marginLeft: 1440,
  marginRight: 1440,

  fontFamily: "Times New Roman",
  fontSize: 24, // 12pt
  fontColor: "000000",
  lineSpacing: 480,

  includeLineNumbers: false,
  lineNumberRestart: "newPage",

  courtTitle: "UNITED STATES DISTRICT COURT",
  courtSubtitle: "SOUTHERN DISTRICT OF FLORIDA",
  plaintiffLabel: "UNITED STATES OF AMERICA,",
  includeCountyLine: false,
  includeAttorneyHeader: false,
  includeSeparatorLine: true,

  footer: {
    includePageNumber: true,
    includeDocumentTitle: false,
    documentTitleFontSize: 20,
    includeSeparatorLine: false,
  },

  proofOfServicePreamble:
    "I, the undersigned, declare that I am over the age of eighteen years and not a party to this action.",

  ruleSource: "Southern District of Florida Local Rules",
  rulesCited: [
    "FLSD L.R. 5.1",
  ],
};

/**
 * Middle District of Florida federal court rules (Tampa/Orlando).
 * - 12pt font (FLMD L.R. 1.05)
 * - 1" margins all sides
 * - Double-spaced
 * - CM/ECF required
 * - Eleventh Circuit precedent
 */
export const FLMD_RULES: CourtFormattingRules = {
  marginTop: 1440,
  marginBottom: 1440,
  marginLeft: 1440,
  marginRight: 1440,

  fontFamily: "Times New Roman",
  fontSize: 24, // 12pt
  fontColor: "000000",
  lineSpacing: 480,

  includeLineNumbers: false,
  lineNumberRestart: "newPage",

  courtTitle: "UNITED STATES DISTRICT COURT",
  courtSubtitle: "MIDDLE DISTRICT OF FLORIDA",
  plaintiffLabel: "UNITED STATES OF AMERICA,",
  includeCountyLine: false,
  includeAttorneyHeader: false,
  includeSeparatorLine: true,

  footer: {
    includePageNumber: true,
    includeDocumentTitle: false,
    documentTitleFontSize: 20,
    includeSeparatorLine: false,
  },

  proofOfServicePreamble:
    "I, the undersigned, declare that I am over the age of eighteen years and not a party to this action.",

  ruleSource: "Middle District of Florida Local Rules",
  rulesCited: [
    "FLMD L.R. 1.05",
  ],
};

/**
 * Northern District of Florida federal court rules (Pensacola/Tallahassee).
 * - 12pt font (FLND L.R. 5.1)
 * - 1" margins all sides
 * - Double-spaced
 * - CM/ECF required
 * - Eleventh Circuit precedent
 */
export const FLND_RULES: CourtFormattingRules = {
  marginTop: 1440,
  marginBottom: 1440,
  marginLeft: 1440,
  marginRight: 1440,

  fontFamily: "Times New Roman",
  fontSize: 24, // 12pt
  fontColor: "000000",
  lineSpacing: 480,

  includeLineNumbers: false,
  lineNumberRestart: "newPage",

  courtTitle: "UNITED STATES DISTRICT COURT",
  courtSubtitle: "NORTHERN DISTRICT OF FLORIDA",
  plaintiffLabel: "UNITED STATES OF AMERICA,",
  includeCountyLine: false,
  includeAttorneyHeader: false,
  includeSeparatorLine: true,

  footer: {
    includePageNumber: true,
    includeDocumentTitle: false,
    documentTitleFontSize: 20,
    includeSeparatorLine: false,
  },

  proofOfServicePreamble:
    "I, the undersigned, declare that I am over the age of eighteen years and not a party to this action.",

  ruleSource: "Northern District of Florida Local Rules",
  rulesCited: [
    "FLND L.R. 5.1",
  ],
};

// ============================================================================
// Immigration Court Rules (EOIR)
// ============================================================================

/**
 * Immigration court rules (EOIR / ICPM).
 * Nationally uniform formatting — applies to all 68+ immigration courts.
 * - 12pt TNR, double-spaced (ICPM Ch. 3.3)
 * - 1" margins all sides
 * - No line numbers, no attorney header block
 * - "In the Matter of" caption style with A-Number
 * - Cover page required for all filings
 * - Two-hole punch binding for paper filings, single-sided
 */
export const IMMIGRATION_RULES: CourtFormattingRules = {
  marginTop: 1440,
  marginBottom: 1440,
  marginLeft: 1440,
  marginRight: 1440,

  fontFamily: "Times New Roman",
  fontSize: 24, // 12pt (ICPM Ch. 3.3)
  fontColor: "000000",
  lineSpacing: 480, // double spacing

  includeLineNumbers: false,
  lineNumberRestart: "newPage",

  courtTitle: "UNITED STATES DEPARTMENT OF JUSTICE",
  courtSubtitle: "EXECUTIVE OFFICE FOR IMMIGRATION REVIEW",
  plaintiffLabel: "", // Not used — immigration uses "In the Matter of" format
  includeCountyLine: false,
  includeAttorneyHeader: false,
  includeSeparatorLine: true,

  captionStyle: "in-matter-of",
  respondentLabel: "In the Matter of:",
  identifierLabel: "A-Number:",
  proceedingLabel: "In Removal Proceedings",

  footer: {
    includePageNumber: true,
    includeDocumentTitle: false,
    documentTitleFontSize: 20,
    includeSeparatorLine: false,
  },

  proofOfServicePreamble:
    "I, the undersigned, declare that I am over the age of eighteen years and not a party to this action.",

  ruleSource: "EOIR Immigration Court Practice Manual",
  rulesCited: [
    "ICPM Ch. 3.3",
    "8 CFR 1003.17",
    "8 CFR 1003.32",
  ],
};

// ============================================================================
// Registry
// ============================================================================

/**
 * Map of court keys to formatting rules.
 * Keys: "jurisdiction-courtType" for state courts, district code for federal.
 */
const COURT_RULES_REGISTRY: Map<string, CourtFormattingRules> = new Map([
  ["CA-state", CA_STATE_RULES],
  ["CACD", CACD_RULES],
  ["NDCA", NDCA_RULES],
  ["EDCA", EDCA_RULES],
  ["SDCA", SDCA_RULES],
  ["NY-state", NY_STATE_RULES],
  ["SDNY", SDNY_RULES],
  ["EDNY", EDNY_RULES],
  ["NDNY", NDNY_RULES],
  ["WDNY", WDNY_RULES],
  ["TX-state", TX_STATE_RULES],
  ["TXND", TXND_RULES],
  ["TXSD", TXSD_RULES],
  ["TXED", TXED_RULES],
  ["TXWD", TXWD_RULES],
  ["FL-state", FL_STATE_RULES],
  ["FLSD", FLSD_RULES],
  ["FLMD", FLMD_RULES],
  ["FLND", FLND_RULES],
  ["EOIR-immigration", IMMIGRATION_RULES],
]);

/**
 * Build the registry lookup key from court parameters.
 * Federal courts with a district use the district code directly.
 * State courts use "jurisdiction-courtType".
 */
export function getCourtKey(
  jurisdiction: string,
  courtType: CourtType = "state",
  district?: string
): string {
  if (courtType === "immigration") {
    return "EOIR-immigration";
  }
  if (courtType === "federal" && district) {
    return district;
  }
  return `${jurisdiction}-${courtType}`;
}

/**
 * Look up formatting rules for a given court.
 * Defaults courtType to "state" for backward compatibility.
 */
export function resolveFormattingRules(
  jurisdiction: string,
  courtType?: CourtType,
  district?: string
): CourtFormattingRules {
  const effectiveCourtType = courtType || "state";
  const key = getCourtKey(jurisdiction, effectiveCourtType, district);
  return COURT_RULES_REGISTRY.get(key) || DEFAULT_RULES;
}
