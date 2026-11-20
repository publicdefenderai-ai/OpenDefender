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
