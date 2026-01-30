/**
 * Immigration Court Reference Data
 *
 * Courts, proceeding types, filing methods, and relief types
 * for EOIR immigration court filings.
 */

export const IMMIGRATION_COURTS = [
  { value: "arlington", label: "Arlington Immigration Court" },
  { value: "atlanta", label: "Atlanta Immigration Court" },
  { value: "baltimore", label: "Baltimore Immigration Court" },
  { value: "boston", label: "Boston Immigration Court" },
  { value: "buffalo", label: "Buffalo Immigration Court" },
  { value: "charlotte", label: "Charlotte Immigration Court" },
  { value: "chicago", label: "Chicago Immigration Court" },
  { value: "cleveland", label: "Cleveland Immigration Court" },
  { value: "dallas", label: "Dallas Immigration Court" },
  { value: "denver", label: "Denver Immigration Court" },
  { value: "detroit", label: "Detroit Immigration Court" },
  { value: "el_paso", label: "El Paso Immigration Court" },
  { value: "harlingen", label: "Harlingen Immigration Court" },
  { value: "houston", label: "Houston Immigration Court" },
  { value: "los_angeles", label: "Los Angeles Immigration Court" },
  { value: "memphis", label: "Memphis Immigration Court" },
  { value: "miami", label: "Miami Immigration Court" },
  { value: "newark", label: "Newark Immigration Court" },
  { value: "new_orleans", label: "New Orleans Immigration Court" },
  { value: "new_york_broadway", label: "New York City (Broadway) Immigration Court" },
  { value: "new_york_varick", label: "New York City (Varick) Immigration Court" },
  { value: "orlando", label: "Orlando Immigration Court" },
  { value: "philadelphia", label: "Philadelphia Immigration Court" },
  { value: "phoenix", label: "Phoenix Immigration Court" },
  { value: "portland", label: "Portland Immigration Court" },
  { value: "san_antonio", label: "San Antonio Immigration Court" },
  { value: "san_francisco", label: "San Francisco Immigration Court" },
  { value: "seattle", label: "Seattle Immigration Court" },
  { value: "other", label: "Other Immigration Court" },
];

export const PROCEEDING_TYPES = [
  { value: "removal", label: "Removal Proceedings (INA \u00A7 240)" },
  { value: "deportation", label: "Deportation Proceedings (INA \u00A7 242, pre-IIRIRA)" },
  { value: "exclusion", label: "Exclusion Proceedings (INA \u00A7 236, pre-IIRIRA)" },
  { value: "bond", label: "Bond Proceedings (INA \u00A7 236)" },
  { value: "withholding_only", label: "Withholding-Only Proceedings (8 CFR 1208.2(c)(2))" },
];

export const FILING_METHODS = [
  { value: "ecas", label: "ECAS E-Filing (Electronic)" },
  { value: "paper", label: "Paper Filing" },
];

export const RELIEF_TYPES = [
  { value: "asylum", label: "Asylum (INA \u00A7 208)" },
  { value: "withholding_removal", label: "Withholding of Removal (INA \u00A7 241(b)(3))" },
  { value: "cat", label: "Convention Against Torture (CAT) (8 CFR 1208.16-18)" },
  { value: "cancellation_lpr", label: "Cancellation of Removal \u2014 LPR (INA \u00A7 240A(a))" },
  { value: "cancellation_non_lpr", label: "Cancellation of Removal \u2014 Non-LPR (INA \u00A7 240A(b))" },
  { value: "voluntary_departure", label: "Voluntary Departure (INA \u00A7 240B)" },
  { value: "adjustment", label: "Adjustment of Status (INA \u00A7 245)" },
  { value: "registry", label: "Registry (INA \u00A7 249)" },
  { value: "other", label: "Other Relief" },
];
