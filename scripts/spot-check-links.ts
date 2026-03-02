import { generateStatuteCitation, getStatuteUrl } from '../shared/statute-citation-generator';

const CHECKS = [
  // Original charges — spot check (10 states, various charge types)
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

  // New charge types — false-info-police
  { state: 'CA', code: '148.5', name: 'False Info Police (CA)' },
  { state: 'TX', code: '37.08', name: 'False Info Police (TX)' },
  { state: 'FL', code: '837.05', name: 'False Info Police (FL)' },

  // New charge types — contempt-of-court
  { state: 'CA', code: '166', name: 'Contempt of Court (CA)' },
  { state: 'TX', code: '21.002', name: 'Contempt of Court (TX)' },
  { state: 'FL', code: '38.22', name: 'Contempt of Court (FL)' },

  // New charge types — bad-checks
  { state: 'CA', code: '476a', name: 'Bad Checks (CA)' },
  { state: 'TX', code: '32.41', name: 'Bad Checks (TX)' },
  { state: 'FL', code: '832.05', name: 'Bad Checks (FL)' },

  // New charge types — solicitation
  { state: 'CA', code: '647b', name: 'Solicitation (CA)' },
  { state: 'TX', code: '43.02', name: 'Solicitation (TX)' },
  { state: 'FL', code: '796.07', name: 'Solicitation (FL)' },

  // New charge types — driving-without-insurance
  { state: 'CA', code: '16029', name: 'No Insurance (CA)' },
  { state: 'TX', code: '601.051', name: 'No Insurance (TX)' },
  { state: 'FL', code: '316.646', name: 'No Insurance (FL)' },

  // New charge types — reckless-driving-criminal
  { state: 'CA', code: '23103', name: 'Reckless Driving (CA)' },
  { state: 'TX', code: '545.401', name: 'Reckless Driving (TX)' },
  { state: 'FL', code: '316.192', name: 'Reckless Driving (FL)' },

  // New charge types — expired-registration
  { state: 'CA', code: '4000', name: 'Expired Reg (CA)' },
  { state: 'TX', code: '502.412', name: 'Expired Reg (TX)' },
  { state: 'FL', code: '320.07', name: 'Expired Reg (FL)' },

  // New charge types — failure-to-pay-child-support
  { state: 'CA', code: '270', name: 'Child Support (CA)' },
  { state: 'TX', code: '25.05', name: 'Child Support (TX)' },
  { state: 'FL', code: '827.06', name: 'Child Support (FL)' },

  // New charge types — indecent-exposure
  { state: 'CA', code: '314', name: 'Indecent Exposure (CA)' },
  { state: 'TX', code: '21.08', name: 'Indecent Exposure (TX)' },
  { state: 'FL', code: '800.03', name: 'Indecent Exposure (FL)' },

  // New charge types — fake-id
  { state: 'CA', code: '470b', name: 'Fake ID (CA)' },
  { state: 'TX', code: '521.453', name: 'Fake ID (TX)' },
  { state: 'FL', code: '322.212', name: 'Fake ID (FL)' },

  // New charge types — animal-at-large
  { state: 'TX', code: '822.005', name: 'Animal at Large (TX)' },
  { state: 'FL', code: '767.01', name: 'Animal at Large (FL)' },
  { state: 'GA', code: '4-8-5', name: 'Animal at Large (GA)' },

  // New charge types — animal-cruelty-misdemeanor
  { state: 'CA', code: '597', name: 'Animal Cruelty (CA)' },
  { state: 'TX', code: '42.09', name: 'Animal Cruelty (TX)' },
  { state: 'FL', code: '828.12', name: 'Animal Cruelty (FL)' },

  // New charge types — truancy
  { state: 'TX', code: '25.085', name: 'Truancy (TX)' },
  { state: 'FL', code: '984.151', name: 'Truancy (FL)' },
  { state: 'NC', code: '115C-378', name: 'Truancy (NC)' },

  // New charge types — littering
  { state: 'CA', code: '374.4', name: 'Littering (CA)' },
  { state: 'TX', code: '365.012', name: 'Littering (TX)' },
  { state: 'FL', code: '403.413', name: 'Littering (FL)' },

  // New charge types — illegal-fireworks
  { state: 'CA', code: '12677', name: 'Illegal Fireworks (CA)' },
  { state: 'TX', code: '352.020', name: 'Illegal Fireworks (TX)' },
  { state: 'FL', code: '791.01', name: 'Illegal Fireworks (FL)' },

  // New charge types — alcohol-in-park
  { state: 'CA', code: '25620', name: 'Alcohol in Park (CA)' },
  { state: 'TX', code: '48.02', name: 'Alcohol in Park (TX)' },
  { state: 'FL', code: '562.12', name: 'Alcohol in Park (FL)' },

  // New charge types — hunting-fishing-no-license
  { state: 'TX', code: '66.006', name: 'No Hunting License (TX)' },
  { state: 'FL', code: '379.354', name: 'No Fishing License (FL)' },
  { state: 'GA', code: '27-2-2', name: 'No License (GA)' },

  // New charge types — expired-inspection
  { state: 'CA', code: '24002', name: 'Expired Inspection (CA)' },
  { state: 'TX', code: '548.602', name: 'Expired Inspection (TX)' },
  { state: 'FL', code: '316.610', name: 'Expired Inspection (FL)' },

  // New charge types — illegal-camping
  { state: 'CA', code: '647e', name: 'Illegal Camping (CA)' },
  { state: 'TX', code: '48.05', name: 'Illegal Camping (TX)' },
  { state: 'FL', code: '856.021', name: 'Illegal Camping (FL)' },

  // New charge types — panhandling
  { state: 'CA', code: '647c', name: 'Panhandling (CA)' },
  { state: 'TX', code: '42.03', name: 'Panhandling (TX)' },
  { state: 'FL', code: '856.021', name: 'Panhandling (FL)' },

  // New charge types — unregistered-vehicle
  { state: 'CA', code: '4000', name: 'Unregistered Vehicle (CA)' },
  { state: 'TX', code: '502.002', name: 'Unregistered Vehicle (TX)' },
  { state: 'FL', code: '320.02', name: 'Unregistered Vehicle (FL)' },

  // New charge types — curfew-violation
  { state: 'CA', code: '726', name: 'Curfew Violation (CA)' },
  { state: 'TX', code: '51.03', name: 'Curfew Violation (TX)' },
  { state: 'FL', code: '877.22', name: 'Curfew Violation (FL)' },

  // New charge types — trespass-after-warning
  { state: 'CA', code: '602', name: 'Trespass (CA)' },
  { state: 'TX', code: '30.05', name: 'Trespass (TX)' },
  { state: 'FL', code: '810.09', name: 'Trespass (FL)' },

  // New charge types — defective-vehicle-equipment
  { state: 'CA', code: '24252', name: 'Defective Equipment (CA)' },
  { state: 'TX', code: '547.004', name: 'Defective Equipment (TX)' },
  { state: 'FL', code: '316.234', name: 'Defective Equipment (FL)' },
  { state: 'MA', code: '90-7A', name: 'Defective Equipment (MA)' },
];

let validLinks = 0;
let emptyLinks = 0;
const errors: string[] = [];

for (const check of CHECKS) {
  const citation = generateStatuteCitation(check.state, check.code);
  const url = getStatuteUrl(check.state, check.code);

  if (url && url.startsWith('http')) {
    validLinks++;
    console.log(`✓ ${check.state} ${check.name.padEnd(28)} ${citation}`);
    console.log(`  → ${url}`);
  } else {
    emptyLinks++;
    errors.push(`${check.state} ${check.name}: ${citation}`);
    console.log(`✗ ${check.state} ${check.name}: ${citation} → NO URL`);
  }
}

console.log(`\n${'='.repeat(70)}`);
console.log(`Results: ${validLinks}/${CHECKS.length} have valid URLs (${((validLinks / CHECKS.length) * 100).toFixed(1)}%)`);
console.log(`Missing URLs: ${emptyLinks}`);
console.log(`Coverage: 32/32 new charge types spot-checked`);

if (errors.length > 0) {
  console.log('\nEntries missing URLs:');
  for (const e of errors) console.log(`  - ${e}`);
}
