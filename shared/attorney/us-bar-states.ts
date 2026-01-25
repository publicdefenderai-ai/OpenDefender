/**
 * US States and Territories for Bar Association Selection
 *
 * Provides data for the bar state dropdown in the attorney verification form.
 */

export interface BarState {
  code: string;      // 2-letter code
  name: string;      // Full state name
  barWebsite?: string; // Link to state bar website for verification
}

export const usBarStates: BarState[] = [
  { code: "AL", name: "Alabama", barWebsite: "https://www.alabar.org" },
  { code: "AK", name: "Alaska", barWebsite: "https://alaskabar.org" },
  { code: "AZ", name: "Arizona", barWebsite: "https://www.azbar.org" },
  { code: "AR", name: "Arkansas", barWebsite: "https://www.arkbar.com" },
  { code: "CA", name: "California", barWebsite: "https://www.calbar.ca.gov" },
  { code: "CO", name: "Colorado", barWebsite: "https://www.cobar.org" },
  { code: "CT", name: "Connecticut", barWebsite: "https://www.ctbar.org" },
  { code: "DE", name: "Delaware", barWebsite: "https://www.dsba.org" },
  { code: "DC", name: "District of Columbia", barWebsite: "https://www.dcbar.org" },
  { code: "FL", name: "Florida", barWebsite: "https://www.floridabar.org" },
  { code: "GA", name: "Georgia", barWebsite: "https://www.gabar.org" },
  { code: "HI", name: "Hawaii", barWebsite: "https://hsba.org" },
  { code: "ID", name: "Idaho", barWebsite: "https://isb.idaho.gov" },
  { code: "IL", name: "Illinois", barWebsite: "https://www.isba.org" },
  { code: "IN", name: "Indiana", barWebsite: "https://www.inbar.org" },
  { code: "IA", name: "Iowa", barWebsite: "https://www.iowabar.org" },
  { code: "KS", name: "Kansas", barWebsite: "https://www.ksbar.org" },
  { code: "KY", name: "Kentucky", barWebsite: "https://www.kybar.org" },
  { code: "LA", name: "Louisiana", barWebsite: "https://www.lsba.org" },
  { code: "ME", name: "Maine", barWebsite: "https://www.mainebar.org" },
  { code: "MD", name: "Maryland", barWebsite: "https://www.msba.org" },
  { code: "MA", name: "Massachusetts", barWebsite: "https://www.massbar.org" },
  { code: "MI", name: "Michigan", barWebsite: "https://www.michbar.org" },
  { code: "MN", name: "Minnesota", barWebsite: "https://www.mnbar.org" },
  { code: "MS", name: "Mississippi", barWebsite: "https://www.msbar.org" },
  { code: "MO", name: "Missouri", barWebsite: "https://www.mobar.org" },
  { code: "MT", name: "Montana", barWebsite: "https://www.montanabar.org" },
  { code: "NE", name: "Nebraska", barWebsite: "https://www.nebar.com" },
  { code: "NV", name: "Nevada", barWebsite: "https://www.nvbar.org" },
  { code: "NH", name: "New Hampshire", barWebsite: "https://www.nhbar.org" },
  { code: "NJ", name: "New Jersey", barWebsite: "https://www.njsba.com" },
  { code: "NM", name: "New Mexico", barWebsite: "https://www.sbnm.org" },
  { code: "NY", name: "New York", barWebsite: "https://www.nysba.org" },
  { code: "NC", name: "North Carolina", barWebsite: "https://www.ncbar.org" },
  { code: "ND", name: "North Dakota", barWebsite: "https://www.sband.org" },
  { code: "OH", name: "Ohio", barWebsite: "https://www.ohiobar.org" },
  { code: "OK", name: "Oklahoma", barWebsite: "https://www.okbar.org" },
  { code: "OR", name: "Oregon", barWebsite: "https://www.osbar.org" },
  { code: "PA", name: "Pennsylvania", barWebsite: "https://www.pabar.org" },
  { code: "RI", name: "Rhode Island", barWebsite: "https://www.ribar.com" },
  { code: "SC", name: "South Carolina", barWebsite: "https://www.scbar.org" },
  { code: "SD", name: "South Dakota", barWebsite: "https://www.statebarofsouthdakota.com" },
  { code: "TN", name: "Tennessee", barWebsite: "https://www.tba.org" },
  { code: "TX", name: "Texas", barWebsite: "https://www.texasbar.com" },
  { code: "UT", name: "Utah", barWebsite: "https://www.utahbar.org" },
  { code: "VT", name: "Vermont", barWebsite: "https://www.vtbar.org" },
  { code: "VA", name: "Virginia", barWebsite: "https://www.vsb.org" },
  { code: "WA", name: "Washington", barWebsite: "https://www.wsba.org" },
  { code: "WV", name: "West Virginia", barWebsite: "https://www.wvbar.org" },
  { code: "WI", name: "Wisconsin", barWebsite: "https://www.wisbar.org" },
  { code: "WY", name: "Wyoming", barWebsite: "https://www.wyomingbar.org" },
  // US Territories
  { code: "GU", name: "Guam", barWebsite: "https://www.guambar.org" },
  { code: "PR", name: "Puerto Rico", barWebsite: "https://www.capr.org" },
  { code: "VI", name: "Virgin Islands", barWebsite: "https://www.vibar.org" },
];

export const getBarStateByCode = (code: string): BarState | undefined => {
  return usBarStates.find(state => state.code === code.toUpperCase());
};

export const getBarStateCodes = (): string[] => {
  return usBarStates.map(state => state.code);
};
