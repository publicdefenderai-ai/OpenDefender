import { generateStatuteCitation, getStatuteUrl } from '../shared/statute-citation-generator';

const CHECKS = [
  // Original charges — spot check
  { state: 'AL', code: '13A-11-8', name: 'Harassment' },
  { state: 'AK', code: '11.61.120', name: 'Harassment' },
  { state: 'CO', code: '18-3-602', name: 'Stalking' },
  { state: 'CT', code: '53a-181', name: 'Disorderly' },
  { state: 'HI', code: '291E-61', name: 'DUI' },
  { state: 'KS', code: '21-5413', name: 'Battery' },
  { state: 'LA', code: '14:35', name: 'Battery' },
  { state: 'MN', code: '609.2242', name: 'DV Assault' },
  { state: 'SC', code: '16-25-20', name: 'DV 3rd' },
  { state: 'UT', code: '76-5-102', name: 'Assault' },

  // New charge types — failure-to-appear
  { state: 'CA', code: '1320', name: 'FTA (CA)' },
  { state: 'TX', code: '38.10', name: 'FTA (TX)' },
  { state: 'FL', code: '843.15', name: 'FTA (FL)' },
  { state: 'NY', code: '215.59', name: 'FTA (NY)' },
  { state: 'IL', code: '720-5/32-10', name: 'FTA (IL)' },

  // New charge types — probation-violation
  { state: 'CA', code: '1203.2', name: 'Probation Viol (CA)' },
  { state: 'TX', code: '42A.751', name: 'Probation Viol (TX)' },
  { state: 'FL', code: '948.06', name: 'Probation Viol (FL)' },
  { state: 'OH', code: '2951.08', name: 'Probation Viol (OH)' },
  { state: 'NC', code: '15A-1344', name: 'Probation Viol (NC)' },

  // New charge types — resisting-arrest
  { state: 'CA', code: '148', name: 'Resisting (CA)' },
  { state: 'TX', code: '38.03', name: 'Resisting (TX)' },
  { state: 'FL', code: '843.01', name: 'Resisting (FL)' },
  { state: 'VA', code: '18.2-460', name: 'Resisting (VA)' },
  { state: 'WA', code: '9A.76.040', name: 'Resisting (WA)' },

  // New charge types — protective-order-violation
  { state: 'CA', code: '166', name: 'Prot Order Viol (CA)' },
  { state: 'TX', code: '25.07', name: 'Prot Order Viol (TX)' },
  { state: 'FL', code: '741.31', name: 'Prot Order Viol (FL)' },
  { state: 'NY', code: '215.51', name: 'Prot Order Viol (NY)' },
  { state: 'PA', code: '23-6114', name: 'Prot Order Viol (PA)' },

  // New charge types — open-container
  { state: 'CA', code: '23222', name: 'Open Container (CA)' },
  { state: 'TX', code: '49.031', name: 'Open Container (TX)' },
  { state: 'FL', code: '316.1936', name: 'Open Container (FL)' },
  { state: 'IL', code: '625-5/11-502', name: 'Open Container (IL)' },
  { state: 'NC', code: '20-138.7', name: 'Open Container (NC)' },

  // New charge types — mip-alcohol
  { state: 'CA', code: '25662', name: 'MIP (CA)' },
  { state: 'TX', code: '106.04', name: 'MIP (TX)' },
  { state: 'FL', code: '562.111', name: 'MIP (FL)' },
  { state: 'GA', code: '3-3-23', name: 'MIP (GA)' },
  { state: 'MI', code: '436.1703', name: 'MIP (MI)' },

  // New charge types — harassment-stalking
  { state: 'CA', code: '653m', name: 'Harassment (CA)' },
  { state: 'TX', code: '42.07', name: 'Harassment (TX)' },
  { state: 'FL', code: '784.048', name: 'Stalking (FL)' },
  { state: 'NY', code: '240.26', name: 'Harassment (NY)' },
  { state: 'NJ', code: '2C:33-4', name: 'Harassment (NJ)' },

  // New charge types — noise-violation / disorderly conduct
  { state: 'CA', code: '415', name: 'Disturbing Peace (CA)' },
  { state: 'TX', code: '42.01', name: 'Disorderly Cond (TX)' },
  { state: 'FL', code: '877.03', name: 'Disturbing Peace (FL)' },
  { state: 'NY', code: '240.20', name: 'Disorderly Cond (NY)' },
  { state: 'IL', code: '720-5/26-1', name: 'Disorderly Cond (IL)' },
];

let validLinks = 0;
let emptyLinks = 0;
const errors: string[] = [];

for (const check of CHECKS) {
  const citation = generateStatuteCitation(check.state, check.code);
  const url = getStatuteUrl(check.state, check.code);

  if (url && url.startsWith('http')) {
    validLinks++;
    console.log(`✓ ${check.state} ${check.name.padEnd(25)} ${citation}`);
    console.log(`  → ${url}`);
  } else {
    emptyLinks++;
    errors.push(`${check.state} ${check.name}: ${citation}`);
    console.log(`✗ ${check.state} ${check.name}: ${citation} → NO URL`);
  }
}

console.log(`\n${'='.repeat(60)}`);
console.log(`Results: ${validLinks}/${CHECKS.length} have valid URLs (${((validLinks / CHECKS.length) * 100).toFixed(1)}%)`);
console.log(`Missing URLs: ${emptyLinks}`);

if (errors.length > 0) {
  console.log('\nEntries missing URLs:');
  for (const e of errors) console.log(`  - ${e}`);
}
