// The ten examples published on /statutes. These are lookup identities, not legal summaries.
export const federalStatuteLookups = [
  { title: 'False Statements', code: 18, section: '1001' },
  { title: 'Wire Fraud', code: 18, section: '1343' },
  { title: 'Mail Fraud', code: 18, section: '1341' },
  { title: 'Assault', code: 18, section: '111' },
  { title: 'Conspiracy', code: 18, section: '371' },
  { title: 'Theft of Government Property', code: 18, section: '641' },
  { title: 'Drug Distribution', code: 21, section: '841' },
  { title: 'Bank Robbery', code: 18, section: '2113' },
  { title: 'Identity Theft', code: 18, section: '1028' },
  { title: 'Money Laundering', code: 18, section: '1956' },
].map(item => ({ ...item, citation: `${item.code} USC § ${item.section}` }));

// Additional live coverage for the shared state route and a hyphenated federal section.
export const additionalStatuteLookups = [
  { citation: 'Fla. Stat. § 782.04', jurisdiction: 'FL', section: '782.04' },
  { citation: 'Tex. Penal Code § 22.01', jurisdiction: 'TX', section: '22.01' },
  { citation: 'Cal. Penal Code § 187', jurisdiction: 'CA', section: '187' },
  { citation: 'N.Y. Penal Law § 155.25', jurisdiction: 'NY', section: '155.25' },
  { citation: 'TX Penal Code 22.01', jurisdiction: 'TX', section: '22.01' },
  { citation: '42 U.S.C. § 2000e-2', jurisdiction: 'FED', code: 42, section: '2000e-2' },
];
export const allStatuteLookups = [
  ...federalStatuteLookups.map(item => ({ ...item, jurisdiction: 'FED' })),
  ...additionalStatuteLookups,
];
